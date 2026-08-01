import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MAL_CP002_PERMANENT_ALLOCATION,
  MAL_CP002_PERMANENT_QL_IDS,
} from "./foundation/cp002-permanent-runtime";
import {
  MAL_CP002_EDITORIAL_REMEDIATION_V2,
  runMalCp002EnglishEditorialRemediationV2Pipeline,
} from "./foundation/cp002-editorial-remediation-v2";
import { runMalCp001EnglishReleasePipeline } from "./foundation/cp001-release";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? item.toString() : item,
  );
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function rawDigitsOutsideMath(value: string): boolean {
  return /\d/u.test(
    value
      .replace(/\$[^$]*\$/gu, "")
      .replace(/Step\s+\d+:/giu, "Step:"),
  );
}

const roleOpening =
  /^(?:A|An) (?:beverage maker|coffee roaster|fuel technician|site supervisor|pulse merchant|grain merchant|alloy maker|oil packer|depot worker|mill operator|tea seller)\b/iu;
const jargon =
  /\b(?:pure|counterpart|unaltered component|unchanged component|fixed counterpart)\b/iu;

const reviewRows: unknown[] = [];
let generatedQuestionCount = 0;
let deterministicReplayCount = 0;
let distinctStemCount = 0;
let distinctExplanationCount = 0;
let mathJaxFieldCount = 0;
const stems = new Set<string>();
const explanations = new Set<string>();
const answerPositions = [0, 0, 0, 0];

for (const allocation of MAL_CP002_PERMANENT_ALLOCATION) {
  for (let index = 0; index < 100; index += 1) {
    const seed = `mal-cp002-editorial-v2:${allocation.qlId}:${index}`;
    const question = runMalCp002EnglishEditorialRemediationV2Pipeline({
      questionLanguageId: allocation.qlId,
      language: "en",
      seed,
    });
    const replay = runMalCp002EnglishEditorialRemediationV2Pipeline({
      questionLanguageId: allocation.qlId,
      language: "en",
      seed,
    });

    assert(
      stable(question) === stable(replay),
      `${allocation.qlId}/${seed}: editorial replay is not deterministic.`,
    );
    deterministicReplayCount += 1;

    assert(
      question.options[question.correctIndex] === question.answer,
      `${allocation.qlId}/${seed}: answer-option alignment failed.`,
    );
    assert(
      question.presentationRevisionId ===
        MAL_CP002_EDITORIAL_REMEDIATION_V2.presentationRevisionId,
      `${allocation.qlId}/${seed}: presentation revision is missing.`,
    );
    assert(
      question.editorialAuthority ===
        MAL_CP002_EDITORIAL_REMEDIATION_V2.editorialAuthority,
      `${allocation.qlId}/${seed}: editorial authority is missing.`,
    );
    assert(
      !roleOpening.test(question.stem),
      `${allocation.qlId}/${seed}: synthetic occupational opening survived.`,
    );

    const learnerFields = [
      question.stem,
      question.explanation.coreConcept,
      question.explanation.formula,
      ...question.explanation.steps,
      question.explanation.verification,
      question.explanation.conclusion,
      question.explanation.examShortcut,
      question.explanation.commonTrap,
      ...question.options,
    ];
    const learnerText = learnerFields.join("\n");

    assert(
      !/alligation/iu.test(learnerText),
      `${allocation.qlId}/${seed}: alligation leaked into CP-002.`,
    );
    assert(
      !jargon.test(learnerText),
      `${allocation.qlId}/${seed}: learner-facing engine jargon survived.`,
    );
    assert(
      !/\b1 parts\b/iu.test(learnerText),
      `${allocation.qlId}/${seed}: singular ratio-part grammar failed.`,
    );
    assert(
      !/−|\|\s*\d/u.test(learnerText),
      `${allocation.qlId}/${seed}: raw minus or absolute-value arithmetic survived.`,
    );

    for (const field of [
      question.stem,
      question.explanation.formula,
      ...question.explanation.steps,
      question.explanation.verification,
      ...question.options,
    ]) {
      assert(
        !rawDigitsOutsideMath(field),
        `${allocation.qlId}/${seed}: number outside MathJax: ${field}`,
      );
      mathJaxFieldCount += 1;
    }

    assert(
      question.explanation.steps.length >= 4,
      `${allocation.qlId}/${seed}: explanation has fewer than four worked steps.`,
    );
    assert(
      question.diagram.before.every(
        (item) => !new RegExp(`\\b${question.diagram.quantityUnit}\\b`, "iu").test(item.quantity),
      ),
      `${allocation.qlId}/${seed}: visual quantity duplicates its unit.`,
    );
    assert(
      question.diagram.after.every(
        (item) => !new RegExp(`\\b${question.diagram.quantityUnit}\\b`, "iu").test(item.quantity),
      ),
      `${allocation.qlId}/${seed}: final visual quantity duplicates its unit.`,
    );

    generatedQuestionCount += 1;
    answerPositions[question.correctIndex] += 1;
    stems.add(question.stem);
    explanations.add(
      [
        question.explanation.coreConcept,
        question.explanation.formula,
        ...question.explanation.steps,
        question.explanation.verification,
        question.explanation.conclusion,
        question.explanation.examShortcut,
        question.explanation.commonTrap,
      ].join("\n"),
    );

    if (index < 4) {
      reviewRows.push({
        reviewKey: `${allocation.qlId}:editorial-v2-${index + 1}`,
        qlId: allocation.qlId,
        familyId: allocation.familyId,
        difficulty: allocation.difficulty,
        stem: question.stem,
        options: question.options,
        correctIndex: question.correctIndex,
        answer: question.answer,
        explanation: question.explanation,
        diagram: question.diagram,
        mathematicalFingerprint: question.mathematicalFingerprint,
        presentationRevisionId: question.presentationRevisionId,
        editorialAuthority: question.editorialAuthority,
      });
    }
  }
}

distinctStemCount = stems.size;
distinctExplanationCount = explanations.size;

assert(
  generatedQuestionCount === MAL_CP002_PERMANENT_QL_IDS.length * 100,
  "The editorial audit did not generate the full 1,700-question matrix.",
);
assert(
  reviewRows.length === MAL_CP002_PERMANENT_QL_IDS.length * 4,
  "The editorial review corpus must contain four rows per permanent QL.",
);
assert(
  answerPositions.every((count) => count > 300),
  `Correct-answer positions are too imbalanced: ${answerPositions.join(", ")}.`,
);

const cp001 = runMalCp001EnglishReleasePipeline({
  questionLanguageId: "MAL-QL-001",
  language: "en",
  seed: "mal-cp002-editorial-v2:cp001-regression",
});
assert(
  cp001.explanation.alligationVisualId === "MAL-CP001-ALLIGATION-SVG-V1",
  "MAL-CP-001 structured alligation visual regressed.",
);
assert(
  cp001.explanation.lines.some((line) =>
    line.includes("EXAMTREE_ALLIGATION_SVG_V1"),
  ),
  "MAL-CP-001 serialized alligation visual is missing.",
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const reviewJson = resolve(
  outputDirectory,
  "mal-cp002-editorial-v2-review.json",
);
writeFileSync(
  reviewJson,
  `${JSON.stringify(
    {
      status: "MAL_CP002_EDITORIAL_V2_REVIEW",
      presentationRevisionId:
        MAL_CP002_EDITORIAL_REMEDIATION_V2.presentationRevisionId,
      editorialAuthority:
        MAL_CP002_EDITORIAL_REMEDIATION_V2.editorialAuthority,
      questionCount: reviewRows.length,
      rows: reviewRows,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

const reviewMarkdown = resolve(
  outputDirectory,
  "mal-cp002-editorial-v2-review.md",
);
const markdown = reviewRows
  .map((row) => {
    const item = row as {
      reviewKey: string;
      qlId: string;
      familyId: string;
      stem: string;
      options: string[];
      correctIndex: number;
      answer: string;
      explanation: {
        sectionTitles: Record<string, string>;
        coreConcept: string;
        formula: string;
        steps: string[];
        verification: string;
        conclusion: string;
        examShortcut: string;
        commonTrap: string;
      };
    };
    return [
      `## ${item.reviewKey} — ${item.familyId}`,
      "",
      item.stem,
      "",
      ...item.options.map(
        (option, optionIndex) =>
          `${String.fromCharCode(65 + optionIndex)}. ${option}${
            optionIndex === item.correctIndex ? " ✅" : ""
          }`,
      ),
      "",
      item.explanation.sectionTitles.coreConcept,
      item.explanation.coreConcept,
      `Formula: ${item.explanation.formula}`,
      "",
      item.explanation.sectionTitles.steps,
      ...item.explanation.steps,
      `Quick check: ${item.explanation.verification}`,
      `Final answer: ${item.explanation.conclusion}`,
      "",
      item.explanation.sectionTitles.shortcut,
      item.explanation.examShortcut,
      "",
      item.explanation.sectionTitles.trap,
      item.explanation.commonTrap,
      "",
      "---",
      "",
    ].join("\n");
  })
  .join("\n");
writeFileSync(reviewMarkdown, markdown, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP002_EDITORIAL_V2",
      presentationRevisionId:
        MAL_CP002_EDITORIAL_REMEDIATION_V2.presentationRevisionId,
      editorialAuthority:
        MAL_CP002_EDITORIAL_REMEDIATION_V2.editorialAuthority,
      permanentQlCount: MAL_CP002_PERMANENT_QL_IDS.length,
      permanentQlRange: "MAL-QL-012..MAL-QL-028",
      generatedQuestionCount,
      deterministicReplayCount,
      distinctStemCount,
      distinctExplanationCount,
      answerPositions,
      mathJaxFieldCount,
      reviewQuestionCount: reviewRows.length,
      cp001AlligationRegression: true,
      reviewJson,
      reviewMarkdown,
    },
    null,
    2,
  ),
);
