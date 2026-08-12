import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateNumCp007Wave02Package } from "../wave02/runtime.ts";
import { generateNumCp007Wave03Package } from "../wave03/runtime.ts";
import {
  generateNumCp007Wave04Package,
  NUM_CP007_WAVE04_PROTOTYPE_IDS,
} from "./runtime.ts";

type Reviewable = {
  readonly temporaryPrototypeId: string;
  readonly seed: number;
  readonly difficulty: string;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly { readonly value: string }[];
  readonly canonicalAnswer: string;
  readonly mathematicalFingerprint: string;
  readonly explanation: {
    readonly coreConcept: string;
    readonly strategy: string;
    readonly steps: readonly string[];
  };
};

function selectWave04Samples(prototypeId: (typeof NUM_CP007_WAVE04_PROTOTYPE_IDS)[number]): Reviewable[] {
  const selected: Reviewable[] = [];
  const seenRepresentations = new Set<string>();
  const seenFingerprints = new Set<string>();

  for (let seed = 1; seed <= 240 && selected.length < 4; seed++) {
    const question = generateNumCp007Wave04Package(prototypeId, seed);
    if (!seenRepresentations.has(question.representation)) {
      selected.push(question);
      seenRepresentations.add(question.representation);
      seenFingerprints.add(question.mathematicalFingerprint);
    }
  }

  for (let seed = 1; seed <= 240 && selected.length < 4; seed++) {
    const question = generateNumCp007Wave04Package(prototypeId, seed);
    if (seenFingerprints.has(question.mathematicalFingerprint)) continue;
    if (selected.some((item) => item.seed === seed)) continue;
    selected.push(question);
    seenFingerprints.add(question.mathematicalFingerprint);
  }

  if (selected.length !== 4) throw new Error(`Could not select four Wave 04 review samples for ${prototypeId}.`);
  return selected;
}

function selectDistinctAnswers(generate: (seed: number) => Reviewable, expected = 4): Reviewable[] {
  const selected: Reviewable[] = [];
  const answers = new Set<string>();
  for (let seed = 1; seed <= 480 && selected.length < expected; seed++) {
    const question = generate(seed);
    if (answers.has(question.canonicalAnswer)) continue;
    answers.add(question.canonicalAnswer);
    selected.push(question);
  }
  if (selected.length !== expected) {
    throw new Error(`Expected ${expected} distinct outcome classes but found ${selected.length}.`);
  }
  return selected;
}

const wave04Questions = NUM_CP007_WAVE04_PROTOTYPE_IDS.flatMap((prototypeId) =>
  selectWave04Samples(prototypeId).map((question) => ({ reviewBucket: "WAVE04_SOURCE_GAP", ...question })),
);

const legacyOutcomeQuestions = [
  ...selectDistinctAnswers((seed) => generateNumCp007Wave02Package("NUM-CP007-PROT-016", seed))
    .map((question) => ({ reviewBucket: "LEGACY_NEAREST_MULTIPLE_OUTCOME", ...question })),
  ...selectDistinctAnswers((seed) => generateNumCp007Wave03Package("NUM-CP007-PROT-019", seed))
    .map((question) => ({ reviewBucket: "LEGACY_STATE_CLASS_OUTCOME", ...question })),
  ...selectDistinctAnswers((seed) => generateNumCp007Wave03Package("NUM-CP007-PROT-022", seed))
    .map((question) => ({ reviewBucket: "LEGACY_STATEMENT_COMBINATION_OUTCOME", ...question })),
  ...selectDistinctAnswers((seed) => generateNumCp007Wave03Package("NUM-CP007-PROT-023", seed))
    .map((question) => ({ reviewBucket: "LEGACY_DS_OUTCOME", ...question })),
];

const questions = [...wave04Questions, ...legacyOutcomeQuestions];
const outputDir = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDir, { recursive: true });

const jsonPath = resolve(outputDir, "num-002-cp007-wave04-review.json");
const csvPath = resolve(outputDir, "num-002-cp007-wave04-review.csv");
const mdPath = resolve(outputDir, "num-002-cp007-wave04-review.md");
writeFileSync(jsonPath, JSON.stringify(questions, null, 2));

const csvEscape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csvRows = [
  ["reviewBucket", "prototypeId", "seed", "difficulty", "answerSemantic", "representation", "stem", "options", "answer", "concept", "strategy", "steps"].map(csvEscape).join(","),
  ...questions.map((question) => [
    question.reviewBucket,
    question.temporaryPrototypeId,
    question.seed,
    question.difficulty,
    question.answerSemantic,
    question.representation,
    question.stem,
    question.options.map((option) => option.value).join(" | "),
    question.canonicalAnswer,
    question.explanation.coreConcept,
    question.explanation.strategy,
    question.explanation.steps.join(" | "),
  ].map(csvEscape).join(",")),
];
writeFileSync(csvPath, csvRows.join("\n"));

const md = questions.map((question, index) => [
  `## ${index + 1}. ${question.temporaryPrototypeId} · ${question.reviewBucket} · seed ${question.seed} · ${question.difficulty}`,
  "",
  question.stem,
  "",
  ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option.value}`),
  "",
  `**Answer:** ${question.canonicalAnswer}`,
  "",
  `**Concept:** ${question.explanation.coreConcept}`,
  "",
  `**Strategy:** ${question.explanation.strategy}`,
  "",
  ...question.explanation.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
  "",
].join("\n")).join("\n");
writeFileSync(mdPath, md);

console.log(JSON.stringify({
  status: "PASS_NUM_CP007_WAVE04_OUTCOME_STRATIFIED_REVIEW_EXPORT",
  wave04PrototypeCount: NUM_CP007_WAVE04_PROTOTYPE_IDS.length,
  wave04Questions: wave04Questions.length,
  legacyOutcomeQuestions: legacyOutcomeQuestions.length,
  exportedQuestions: questions.length,
  legacyOutcomeFamilies: 4,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-098",
  jsonPath,
  csvPath,
  mdPath,
}, null, 2));
