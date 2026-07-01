import fs from "node:fs";
import path from "node:path";
import {
  generatePct001Batch,
  auditPct001Packages,
} from "../topics/Arithmetic/subtopics/Percentage/PCT-001/coverage-auditor";
import {
  generatePct002Batch,
  auditPct002Packages,
} from "../topics/Arithmetic/subtopics/Percentage/PCT-002/coverage-auditor";
import {
  generateRap001Batch,
  auditRap001Packages,
} from "../topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/coverage-auditor";

const QUESTION_COUNT = 300;
const CANDIDATE_COUNT = 6000;

type ReviewPackage = {
  language: string;
  canonicalProblemId: string;
  questionLanguageId: string;
  explanationId: string;
  difficultyBand: string;
  parameters: {
    taskKind: string;
    answerType: string;
  };
  stem: string;
  answer: string;
  explanation: {
    lines: readonly string[];
  };
  validation: {
    valid: boolean;
  };
};

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function renderCsv(packages: readonly ReviewPackage[]) {
  const header = [
    "language",
    "cpId",
    "qlId",
    "esId",
    "difficulty",
    "taskKind",
    "answerType",
    "question",
    "answer",
    "explanation",
    "validation",
  ];

  const rows = packages.map((pkg) =>
    [
      pkg.language,
      pkg.canonicalProblemId,
      pkg.questionLanguageId,
      pkg.explanationId,
      pkg.difficultyBand,
      pkg.parameters.taskKind,
      pkg.parameters.answerType,
      pkg.stem,
      pkg.answer,
      pkg.explanation.lines.join(" | "),
      pkg.validation.valid ? "PASS" : "FAIL",
    ]
      .map(csvCell)
      .join(","),
  );

  return `${[header.map(csvCell).join(","), ...rows].join("\n")}\n`;
}

function isUsable(pkg: ReviewPackage) {
  const combined = `${pkg.stem} ${pkg.answer} ${pkg.explanation.lines.join(" ")}`;
  return (
    pkg.validation.valid &&
    pkg.stem.trim().length > 0 &&
    pkg.answer.trim().length > 0 &&
    !/\b(?:undefined|NaN|Infinity)\b/.test(combined)
  );
}

function selectUnique(packages: readonly ReviewPackage[]) {
  const seen = new Set<string>();
  const selected: ReviewPackage[] = [];

  for (const pkg of packages) {
    const key = pkg.stem.trim().toLocaleLowerCase("en");
    if (!isUsable(pkg) || seen.has(key)) continue;
    seen.add(key);
    selected.push(pkg);
    if (selected.length === QUESTION_COUNT) break;
  }

  if (selected.length !== QUESTION_COUNT) {
    throw new Error(`Only ${selected.length} unique usable questions were generated.`);
  }

  return selected;
}

const apiRoot = fs.existsSync(path.join(process.cwd(), "src/quant-v4"))
  ? process.cwd()
  : path.join(process.cwd(), "artifacts/api-server");
const root = path.join(apiRoot, "src/quant-v4/topics/Arithmetic/subtopics");

const jobs = [
  {
    id: "PCT-001",
    output: path.join(root, "Percentage/PCT-001/pct-001-human-review-en.csv"),
    generate: () => generatePct001Batch(CANDIDATE_COUNT, "en") as ReviewPackage[],
    audit: (packages: ReviewPackage[]) => auditPct001Packages(packages as never),
  },
  {
    id: "PCT-002",
    output: path.join(root, "Percentage/PCT-002/pct-002-human-review-en.csv"),
    generate: () => generatePct002Batch(CANDIDATE_COUNT, "en") as ReviewPackage[],
    audit: (packages: ReviewPackage[]) => auditPct002Packages(packages as never),
  },
  {
    id: "RAP-001",
    output: path.join(root, "RatioAndProportion/RAP-001/rap-001-human-review-en.csv"),
    generate: () => generateRap001Batch(CANDIDATE_COUNT, "en") as ReviewPackage[],
    audit: (packages: ReviewPackage[]) => auditRap001Packages(packages as never),
  },
] as const;

for (const job of jobs) {
  const selected = selectUnique(job.generate());
  const audit = job.audit(selected) as {
    validationFailures: number;
    renderFailures: number;
    solverFailures: number;
    duplicateRate: number;
  };

  if (audit.validationFailures || audit.renderFailures || audit.solverFailures) {
    throw new Error(`${job.id} failed audit: ${JSON.stringify(audit)}`);
  }

  fs.writeFileSync(job.output, renderCsv(selected), "utf8");
  console.log(
    `${job.id}: wrote ${selected.length} questions to ${job.output} (duplicate rate ${(audit.duplicateRate * 100).toFixed(2)}%)`,
  );
}
