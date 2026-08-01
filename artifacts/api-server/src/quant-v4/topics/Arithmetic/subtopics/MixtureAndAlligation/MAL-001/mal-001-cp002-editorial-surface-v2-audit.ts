import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MAL_CP002_PERMANENT_ALLOCATION,
  MAL_CP002_PERMANENT_QL_IDS,
} from "./foundation/cp002-permanent-runtime";
import {
  MAL_CP002_EDITORIAL_SURFACE_CLEANUP_V2,
  runMalCp002EnglishEditorialSurfaceV2Pipeline,
} from "./foundation/cp002-editorial-surface-cleanup-v2";
import { runMalCp001EnglishReleasePipeline } from "./foundation/cp001-release";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? item.toString() : item,
  );
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function outsideMath(value: string): string {
  return value
    .replace(/\$[^$]*\$/gu, "")
    .replace(/Step\s+\d+:/giu, "Step:");
}

const rows: unknown[] = [];
const stems = new Set<string>();
const explanations = new Set<string>();
const answerPositions = [0, 0, 0, 0];
let generatedQuestionCount = 0;
let deterministicReplayCount = 0;
let checkedLearnerFieldCount = 0;

for (const allocation of MAL_CP002_PERMANENT_ALLOCATION) {
  for (let index = 0; index < 100; index += 1) {
    const seed = `mal-cp002-editorial-surface-v2:${allocation.qlId}:${index}`;
    const question = runMalCp002EnglishEditorialSurfaceV2Pipeline({
      questionLanguageId: allocation.qlId,
      language: "en",
      seed,
    });
    const replay = runMalCp002EnglishEditorialSurfaceV2Pipeline({
      questionLanguageId: allocation.qlId,
      language: "en",
      seed,
    });

    assert(
      stable(question) === stable(replay),
      `${allocation.qlId}/${seed}: final editorial replay is not deterministic.`,
    );
    assert(
      question.editorialSurfaceCleanupId ===
        MAL_CP002_EDITORIAL_SURFACE_CLEANUP_V2.cleanupId,
      `${allocation.qlId}/${seed}: surface cleanup identity is missing.`,
    );
    assert(
      question.options[question.correctIndex] === question.answer,
      `${allocation.qlId}/${seed}: answer-option alignment failed.`,
    );

    const fields = [
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
    const learnerText = fields.join("\n");

    assert(!/alligation/iu.test(learnerText), `${allocation.qlId}: alligation leaked into CP-002.`);
    assert(
      !/\b(?:pure|counterpart|unaltered component|unchanged component|fixed counterpart)\b/iu.test(
        learnerText,
      ),
      `${allocation.qlId}: learner-facing engine jargon survived.`,
    );
    assert(
      !/^(?:A|An) (?:beverage maker|coffee roaster|fuel technician|site supervisor|pulse merchant|grain merchant|alloy maker|oil packer|depot worker|mill operator|tea seller)\b/iu.test(
        question.stem,
      ),
      `${allocation.qlId}: synthetic occupational opening survived.`,
    );
    assert(!/\bthird grade\b/iu.test(learnerText), `${allocation.qlId}: third-grade placeholder survived.`);
    assert(!/\$1[xy]\$/u.test(learnerText), `${allocation.qlId}: redundant coefficient-one notation survived.`);
    assert(!/\s+,/u.test(learnerText), `${allocation.qlId}: punctuation spacing defect survived.`);
    assert(!/,\s+find\b/iu.test(learnerText), `${allocation.qlId}: awkward imperative after comma survived.`);
    assert(
      !/A well-mixed quantity is removed/u.test(learnerText),
      `${allocation.qlId}: awkward unknown-replacement phrase survived.`,
    );
    assert(!/−|\|\s*\d/u.test(learnerText), `${allocation.qlId}: raw minus or absolute-value arithmetic survived.`);
    assert(!/\b1 parts\b/iu.test(learnerText), `${allocation.qlId}: singular part grammar failed.`);

    for (const field of [
      question.stem,
      question.explanation.formula,
      ...question.explanation.steps,
      question.explanation.verification,
      ...question.options,
    ]) {
      const plain = outsideMath(field);
      assert(!/\d/u.test(plain), `${allocation.qlId}: number outside MathJax: ${field}`);
      assert(!/\b(?:kg|litres)\b/iu.test(plain), `${allocation.qlId}: unit outside MathJax: ${field}`);
      assert(!/\b(?:x|y|V)\b/u.test(plain), `${allocation.qlId}: algebra outside MathJax: ${field}`);
      checkedLearnerFieldCount += 1;
    }

    assert(
      question.diagram.before.every(
        (item) => !new RegExp(`\\b${question.diagram.quantityUnit}\\b`, "iu").test(item.quantity),
      ) &&
        question.diagram.after.every(
          (item) => !new RegExp(`\\b${question.diagram.quantityUnit}\\b`, "iu").test(item.quantity),
        ),
      `${allocation.qlId}: SVG quantities duplicate the shared unit.`,
    );

    generatedQuestionCount += 1;
    deterministicReplayCount += 1;
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
      rows.push({
        reviewKey: `${allocation.qlId}:surface-v2-${index + 1}`,
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
        editorialSurfaceCleanupId: question.editorialSurfaceCleanupId,
      });
    }
  }
}

assert(
  generatedQuestionCount === MAL_CP002_PERMANENT_QL_IDS.length * 100,
  "Final editorial audit did not cover all 1,700 questions.",
);
assert(rows.length === 68, "Final review corpus must contain 68 rows.");
assert(
  answerPositions.every((count) => count > 300),
  `Correct-answer positions are imbalanced: ${answerPositions.join(", ")}.`,
);

const cp001 = runMalCp001EnglishReleasePipeline({
  questionLanguageId: "MAL-QL-001",
  language: "en",
  seed: "mal-cp002-editorial-surface-v2:cp001-regression",
});
assert(
  cp001.explanation.alligationVisualId === "MAL-CP001-ALLIGATION-SVG-V1" &&
    cp001.explanation.lines.some((line) =>
      line.includes("EXAMTREE_ALLIGATION_SVG_V1"),
    ),
  "MAL-CP-001 structured alligation presentation regressed.",
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const reviewJson = resolve(outputDirectory, "mal-cp002-editorial-v2-review.json");
const reviewMarkdown = resolve(outputDirectory, "mal-cp002-editorial-v2-review.md");

writeFileSync(
  reviewJson,
  `${JSON.stringify(
    {
      status: "MAL_CP002_FINAL_EDITORIAL_SURFACE_V2_REVIEW",
      editorialSurfaceCleanupId:
        MAL_CP002_EDITORIAL_SURFACE_CLEANUP_V2.cleanupId,
      questionCount: rows.length,
      rows,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

const markdown = rows
  .map((row) => {
    const item = row as {
      reviewKey: string;
      familyId: string;
      stem: string;
      options: string[];
      correctIndex: number;
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
      status: "PASS_MAL_CP002_FINAL_EDITORIAL_SURFACE_V2",
      editorialSurfaceCleanupId:
        MAL_CP002_EDITORIAL_SURFACE_CLEANUP_V2.cleanupId,
      permanentQlCount: MAL_CP002_PERMANENT_QL_IDS.length,
      permanentQlRange: "MAL-QL-012..MAL-QL-028",
      generatedQuestionCount,
      deterministicReplayCount,
      distinctStemCount: stems.size,
      distinctExplanationCount: explanations.size,
      answerPositions,
      checkedLearnerFieldCount,
      reviewQuestionCount: rows.length,
      cp001AlligationRegression: true,
      reviewJson,
      reviewMarkdown,
    },
    null,
    2,
  ),
);
