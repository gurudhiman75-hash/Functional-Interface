import fs from "node:fs";

export interface HumanReviewQuestion {
  text?: string;
  stem?: string;
  options?: unknown[];
  correctIndex?: number;
  correct?: number;
  answer?: string;
  explanation?: string;
  questionId?: string;
  seed?: string;
}

export interface HumanReviewPackage {
  canonicalProblemId: string;
  questionLanguageId: string;
  difficultyBand: string;
  questionId: string;
  parameters: { taskKind: string; variables: Record<string, unknown> };
  solver: { answer: string };
  explanation: { lines: string[] };
}

export interface HumanReviewExportConfig {
  packageId: string;
  cpIds: readonly string[];
  qlIds(cpId: string): string[];
  generate(cpId: string, qlId: string, seed: string): Promise<{ question: HumanReviewQuestion; pkg: HumanReviewPackage }>;
  reviewPath: string;
  diversityPath: string;
}

const reviewHeader = [
  "packageId", "cpId", "qlId", "taskKind", "solveMode", "difficulty", "questionId", "seed",
  "parameterFingerprint", "variablesJson", "stem", "options", "correctIndex", "correctAnswer", "explanation",
  "stemRealism", "solverCorrect", "explanationQuality", "optionQuality", "editorialStatus", "reviewNotes",
];

function csv(value: unknown) {
  return "\"" + String(value ?? "").replaceAll("\"", "\"\"") + "\"";
}

function stableValue(value: unknown): string {
  if (Array.isArray(value)) return "[" + value.map(stableValue).join(",") + "]";
  if (value && typeof value === "object") {
    return "{" + Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b))
      .map(([key, child]) => key + ":" + stableValue(child)).join(",") + "}";
  }
  return JSON.stringify(value);
}

function fingerprint(variables: Record<string, unknown>) {
  const input = stableValue(variables);
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return "fnv1a-" + (hash >>> 0).toString(16).padStart(8, "0");
}

function readable(value: unknown) {
  return String(value ?? "")
    .replace(/\\n/g, "\n")
    .replace(/(?:^|\n)\[\s*\n?\\Rightarrow\s*([\s\S]*?)\n\]/g, "\n$$\n$1\n$$");
}

function normalizedStem(value: unknown) {
  return readable(value).replace(/\s+/g, " ").trim().toLowerCase();
}

function optionsText(question: HumanReviewQuestion) {
  const options = Array.isArray(question.options) ? question.options : [];
  return options.map((option, index) => String.fromCharCode(65 + index) + ". " + readable(option)).join("\n");
}

function answerIndex(question: HumanReviewQuestion) {
  return Number.isInteger(question.correctIndex) ? Number(question.correctIndex) : Number(question.correct);
}

function reviewRow(packageId: string, pkg: HumanReviewPackage, question: HumanReviewQuestion) {
  const index = answerIndex(question);
  const options = Array.isArray(question.options) ? question.options : [];
  const answer = options[index] ?? question.answer ?? pkg.solver.answer;
  return [
    packageId, pkg.canonicalProblemId, pkg.questionLanguageId, pkg.parameters.taskKind, pkg.parameters.taskKind,
    pkg.difficultyBand, question.questionId ?? pkg.questionId, question.seed ?? "", fingerprint(pkg.parameters.variables),
    JSON.stringify(pkg.parameters.variables), readable(question.text ?? question.stem), optionsText(question), index, readable(answer),
    readable(question.explanation ?? pkg.explanation.lines.join("\n")), "", "", "", "", "PENDING", "",
  ].map(csv).join(",");
}

export async function writeHumanReviewExports(config: HumanReviewExportConfig) {
  const mainRows = [reviewHeader.map(csv).join(",")];
  const diversityHeader = [
    "packageId", "cpId", "qlId", "taskKind", "primaryQuestionId", "primarySeed", "primaryFingerprint",
    "primaryStem", "variantQuestionId", "variantSeed", "variantFingerprint", "variantStem", "sameStem",
  ];
  const diversityRows = [diversityHeader.map(csv).join(",")];
  let pairedExportSameFingerprintCount = 0;
  let pairedExportSameMathematicalStateCount = 0;
  let pairedExportSeedCollisionCount = 0;
  const pairedExportSameFingerprintQlIds: string[] = [];
  for (const cpId of config.cpIds) {
    for (const qlId of config.qlIds(cpId)) {
      // RAP generators use the caller's final numeric seed component as the
      // diversification index; the engine appends its own item index of zero.
      const primarySeed = config.packageId.toLowerCase() + ":human-review:" + qlId + ":0";
      const variantSeed = config.packageId.toLowerCase() + ":same-ql-diversity:" + qlId + ":7";
      const primary = await config.generate(cpId, qlId, primarySeed);
      const variant = await config.generate(cpId, qlId, variantSeed);
      const primaryFingerprint = fingerprint(primary.pkg.parameters.variables);
      const variantFingerprint = fingerprint(variant.pkg.parameters.variables);
      if (primary.question.seed === variant.question.seed) pairedExportSeedCollisionCount += 1;
      if (primaryFingerprint === variantFingerprint) {
        pairedExportSameFingerprintCount += 1;
        pairedExportSameMathematicalStateCount += 1;
        pairedExportSameFingerprintQlIds.push(qlId);
      }
      mainRows.push(reviewRow(config.packageId, primary.pkg, primary.question));
      diversityRows.push([
        config.packageId, cpId, qlId, primary.pkg.parameters.taskKind,
        primary.question.questionId ?? primary.pkg.questionId, primary.question.seed ?? primarySeed,
        primaryFingerprint, readable(primary.question.text ?? primary.question.stem),
        variant.question.questionId ?? variant.pkg.questionId, variant.question.seed ?? variantSeed,
        variantFingerprint, readable(variant.question.text ?? variant.question.stem),
        normalizedStem(primary.question.text ?? primary.question.stem) === normalizedStem(variant.question.text ?? variant.question.stem),
      ].map(csv).join(","));
    }
  }
  fs.writeFileSync(config.reviewPath, mainRows.join("\n") + "\n", "utf8");
  fs.writeFileSync(config.diversityPath, diversityRows.join("\n") + "\n", "utf8");
  if (pairedExportSameFingerprintCount || pairedExportSeedCollisionCount) {
    throw new Error(`${config.packageId} paired diversity export failed: same fingerprints=${pairedExportSameFingerprintCount} (${pairedExportSameFingerprintQlIds.join(", ")}), seed collisions=${pairedExportSeedCollisionCount}.`);
  }
  return {
    reviewRowCount: mainRows.length - 1,
    diversityRowCount: diversityRows.length - 1,
    pairedExportSameFingerprintCount,
    pairedExportSameMathematicalStateCount,
    pairedExportSeedCollisionCount,
  };
}
