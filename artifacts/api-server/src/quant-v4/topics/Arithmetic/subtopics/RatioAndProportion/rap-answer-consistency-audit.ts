import { strict as assert } from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { generateQuestion } from "../../../../generation-engine";
import { getComparableAnswerKey, normalizeQuantV4Answer } from "../../../../shared/answers/answer-contract";
import { getQuestionLanguageIds as getRap001QlIds } from "./RAP-001/library";
import { RAP_001_CP_IDS } from "./RAP-001/types";
import { getRap002QuestionLanguageIds } from "./RAP-002/library";
import { RAP_002_CP_IDS } from "./RAP-002/types";
import { getRap003QuestionLanguageIds } from "./RAP-003/library";
import { RAP_003_CP_IDS } from "./RAP-003/types";

type PackageId = "RAP-001" | "RAP-002" | "RAP-003";

const SEEDS_PER_QL = 12;

function normalized(value: unknown) {
  return getComparableAnswerKey(String(value ?? ""));
}

function answerShownInExplanation(explanation: string, canonical: string) {
  const compact = String(explanation).replace(/[\s$\\]/g, "").toLowerCase();
  const answer = String(canonical).replace(/[\s$\\]/g, "").toLowerCase();
  return compact.includes(answer);
}

function ratioIsReducible(value: string) {
  const canonical = normalizeQuantV4Answer(value);
  if (canonical.kind !== "ratio") return false;
  const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
  return canonical.terms.reduce(gcd) > 1;
}

const packages: Array<{ id: PackageId; cpIds: readonly string[]; qlIds: (cp: string) => string[] }> = [
  { id: "RAP-001", cpIds: RAP_001_CP_IDS, qlIds: (cp) => getRap001QlIds(cp as any, "en") },
  { id: "RAP-002", cpIds: RAP_002_CP_IDS, qlIds: (cp) => getRap002QuestionLanguageIds(cp as any) },
  { id: "RAP-003", cpIds: RAP_003_CP_IDS, qlIds: (cp) => getRap003QuestionLanguageIds(cp as any) },
];

const report: Record<string, Record<string, number>> = {};
const originalInfo = console.info;
console.info = () => undefined;

try {
  for (const entry of packages) {
    const counters = {
      questionCount: 0,
      canonicalAnswerMismatchCount: 0,
      independentAnswerMismatchCount: 0,
      correctOptionMismatchCount: 0,
      explanationFinalAnswerMismatchCount: 0,
      unsimplifiedRatioCount: 0,
      decimalDerivedRatioCount: 0,
      excessiveRatioMagnitudeCount: 0,
      malformedLatexCount: 0,
      nestedMathDelimiterCount: 0,
      literalEscapeSequenceCount: 0,
    };

    for (const cpId of entry.cpIds) {
      for (const qlId of entry.qlIds(cpId)) {
        for (let seedIndex = 0; seedIndex < SEEDS_PER_QL; seedIndex++) {
          const generated = await generateQuestion({
            packageId: entry.id,
            canonicalProblemId: cpId,
            questionLanguageId: qlId,
            language: "en",
            seed: `${entry.id.toLowerCase()}:answer-consistency:${qlId}:${seedIndex}`,
            count: 1,
          });
          const question: any = generated.questions[0];
          const pkg: any = generated.questionPackages[0];
          const solverAnswer = String(pkg.solver?.answer ?? pkg.answer ?? "");
          const canonicalAnswer = question.canonicalAnswer;
          const canonicalKey = getComparableAnswerKey(canonicalAnswer);
          const option = question.options?.[question.correctIndex];
          const explanation = String(question.explanation ?? pkg.explanation?.lines?.join("\n") ?? "");
          counters.questionCount++;

          if (normalized(pkg.answer) !== normalized(solverAnswer) || canonicalKey !== normalized(solverAnswer)) counters.canonicalAnswerMismatchCount++;
          // Solver evidence is independent from option construction and is checked before the shuffled options are read.
          if (normalized(solverAnswer) !== canonicalKey) counters.independentAnswerMismatchCount++;
          if (normalized(option) !== canonicalKey || question.options.filter((value: string) => normalized(value) === canonicalKey).length !== 1) {
            counters.correctOptionMismatchCount++;
          }
          if (!answerShownInExplanation(explanation, solverAnswer)) counters.explanationFinalAnswerMismatchCount++;
          if (ratioIsReducible(solverAnswer)) counters.unsimplifiedRatioCount++;
          if (/\d{6,}\s*:\s*\d{6,}/.test(solverAnswer)) counters.decimalDerivedRatioCount++;
          if (/\d{7,}/.test(solverAnswer) && /:/.test(solverAnswer)) counters.excessiveRatioMagnitudeCount++;
          if (/\$\$\s*\\Rightarrow\s*\$\$|\$\$\$\$/.test(explanation)) counters.nestedMathDelimiterCount++;
          if (/\\n/.test(explanation)) counters.literalEscapeSequenceCount++;
          if (/\$\$\$\$|\$\$\s*\\Rightarrow\s*\$\$/.test(explanation)) counters.malformedLatexCount++;
        }
      }
    }
    report[entry.id] = counters;
    for (const [key, value] of Object.entries(counters)) {
      if (key !== "questionCount") assert.equal(value, 0, `${entry.id} ${key} must be zero`);
    }
  }
} finally {
  console.info = originalInfo;
}

const reportPath = path.resolve("src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/rap-answer-consistency-audit-report.md");
fs.writeFileSync(reportPath, [
  "# RAP Canonical Answer Consistency Audit", "",
  `Reviewed date: \`${new Date().toISOString().slice(0, 10)}\``,
  `Forced seeds per active English QL: \`${SEEDS_PER_QL}\``, "", "```json", JSON.stringify(report, null, 2), "```", "",
  "All correctness counters are hard blockers. The solver canonical answer, shuffled correct option, and rendered explanation must agree.", "",
].join("\n"), "utf8");

console.log(JSON.stringify(report, null, 2));
console.log("RAP canonical-answer consistency audit passed.");
