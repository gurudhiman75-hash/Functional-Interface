import { createHash } from "node:crypto";

import { SAP_CP001_ALL_PROTOTYPE_IDS } from "./SAP-001/SAP-CP-001/SAP-CP-001-ENGLISH-TEMPLATE-PROPOSAL";
import { generateSapCp001PermanentEnglishPackage } from "./SAP-001/SAP-CP-001/permanent-runtime/runtime";
import { SAP_CP002_ALL_PROTOTYPE_IDS } from "./SAP-001/SAP-CP-002/SAP-CP-002-AUTHORITY-AND-TEMPLATE-MAP";
import { generateSapCp002PermanentEnglishPackage } from "./SAP-001/SAP-CP-002/permanent-runtime/runtime";
import { SAP_CP003_PROTOTYPE_IDS } from "./SAP-001/SAP-CP-003/types";
import { generateSapCp003PermanentPackage } from "./SAP-001/SAP-CP-003/permanent-runtime/runtime";
import { SAP_CP004_PROTOTYPE_IDS, generateSapCp004E1Existing, generateSapCp004E1NestedAdditive } from "./SAP-001/SAP-CP-004/e1-runtime";
import { SAP_CP005_PROTOTYPE_IDS, generateSapCp005 } from "./SAP-001/SAP-CP-005/runtime";
import { SAP_CP005_WAVE2_PROTOTYPE_IDS, generateSapCp005Wave2 } from "./SAP-001/SAP-CP-005/runtime-wave2";
import { generateSapCp005E1Telescoping } from "./SAP-001/SAP-CP-005/e1-runtime";
import { SAP_CP006_PROTOTYPE_IDS, generateSapCp006 } from "./SAP-001/SAP-CP-006/runtime";
import { SAP_CP006_WAVE2_PROTOTYPE_IDS, generateSapCp006Wave2 } from "./SAP-001/SAP-CP-006/runtime-wave2";
import { SAP_CP006_WAVE3_PROTOTYPE_IDS, generateSapCp006Wave3 } from "./SAP-001/SAP-CP-006/runtime-wave3-v3";
import { SAP_CP007_PROTOTYPE_IDS, generateSapCp007 } from "./SAP-001/SAP-CP-007/runtime-v4";
import { SAP_CP007_WAVE2_PROTOTYPE_IDS, generateSapCp007Wave2 } from "./SAP-001/SAP-CP-007/runtime-wave2-v5";
import { generateSapCp007E1SignificantFigures } from "./SAP-001/SAP-CP-007/e1-runtime";
import { SAP_CP008_PROTOTYPE_IDS, generateSapCp008 } from "./SAP-001/SAP-CP-008/runtime-v4";
import { SAP_CP009_PROTOTYPE_IDS, generateSapCp009 } from "./SAP-001/SAP-CP-009/final-runtime";
import { SAP_CP010_PROTOTYPE_IDS, generateSapCp010E1Existing, generateSapCp010E1SuppliedRootScaling } from "./SAP-002/SAP-CP-010/e1-runtime";
import { SAP_CP011_E2_STRUCTURES, generateSapCp011E2 } from "./SAP-002/SAP-CP-011/runtime-release-r6";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 } from "./SAP-002/SAP-CP-012/runtime-release-e3";
import { SAP_PERMANENT_QL_REGISTRY } from "./SAP-PERMANENT-QL-REGISTRY";
import { SAP_CP004_008_FROZEN_REGISTRY_ENTRIES } from "./SAP-CP004-008-PERMANENT-FREEZE";
import { SAP_CP009_FROZEN_REGISTRY_ENTRIES } from "./SAP-CP009-PERMANENT-FREEZE";
import { SAP_QL166_211_FINAL_FROZEN_ENTRIES } from "./SAP-QL166-211-PERMANENT-FREEZE";

export type SapStudioExamProfile = "SSC" | "BANKING" | "RAILWAY" | "PUNJAB_STATE";
export type SapStudioDifficulty = "EASY" | "MEDIUM" | "HARD";
export type SapStudioQlId = `SAP-QL-${string}`;
export type SapStudioCheckpointId = `SAP-CP-${string}`;

export interface SapStudioQlDescriptor {
  readonly qlId: SapStudioQlId;
  readonly checkpointId: SapStudioCheckpointId;
  readonly title: string;
  readonly sourceIdentity: string;
  readonly defaultWeight: number;
  readonly specialist: boolean;
}

export interface SapStudioQuestion {
  readonly packageId: "SAP";
  readonly qlId: SapStudioQlId;
  readonly qlName: string;
  readonly checkpointId: SapStudioCheckpointId;
  readonly sourceIdentity: string;
  readonly questionId: string;
  readonly canonicalItemId: string;
  readonly questionLanguageId: string;
  readonly language: "en";
  readonly locale: "en-IN";
  readonly examProfile: SapStudioExamProfile;
  readonly difficultyBand: SapStudioDifficulty;
  readonly stem: string;
  readonly options: readonly string[];
  readonly optionDetails: readonly Readonly<{
    label: string;
    text: string;
    isCorrect: boolean;
    misconceptionId: string | null;
    analysis: string;
  }>[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly explanation: Readonly<{
    coreConcept: string;
    steps: readonly string[];
    finalAnswer: string;
    verification: readonly string[];
  }>;
  readonly renderer: "TEXT_MATH";
  readonly seed: string;
  readonly sourceSeed: number;
  readonly integrationAuthority: typeof SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY;
  readonly sourceValidation: Readonly<{ valid: boolean; errors: readonly string[] }>;
  readonly sourceLifecycleLocked: true;
}

export const SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY = "SAP-QUESTION-STUDIO-INTEGRATION-V1-QL001-211" as const;

const FROZEN_META = Object.freeze([
  ...SAP_PERMANENT_QL_REGISTRY,
  ...SAP_CP004_008_FROZEN_REGISTRY_ENTRIES,
  ...SAP_CP009_FROZEN_REGISTRY_ENTRIES,
  ...SAP_QL166_211_FINAL_FROZEN_ENTRIES,
]);

const META_BY_QL = new Map<string, { permanentQlId: string; checkpointId: string; title: string }>(
  FROZEN_META.map((entry) => [entry.permanentQlId, entry]),
);

interface GeneratorRegistration {
  readonly qlId: SapStudioQlId;
  readonly checkpointId: SapStudioCheckpointId;
  readonly sourceIdentity: string;
  readonly generate: (seed: number) => unknown;
  readonly defaultWeight: number;
  readonly specialist: boolean;
}

function ql(number: number): SapStudioQlId {
  return `SAP-QL-${String(number).padStart(3, "0")}` as SapStudioQlId;
}

function reg(
  number: number,
  checkpointId: SapStudioCheckpointId,
  sourceIdentity: string,
  generate: (seed: number) => unknown,
  defaultWeight = 1,
  specialist = false,
): GeneratorRegistration {
  return Object.freeze({ qlId: ql(number), checkpointId, sourceIdentity, generate, defaultWeight, specialist });
}

const registrations: GeneratorRegistration[] = [];
SAP_CP001_ALL_PROTOTYPE_IDS.forEach((id, index) => registrations.push(reg(1 + index, "SAP-CP-001", id, (seed) => generateSapCp001PermanentEnglishPackage(id, seed))));
SAP_CP002_ALL_PROTOTYPE_IDS.forEach((id, index) => registrations.push(reg(17 + index, "SAP-CP-002", id, (seed) => generateSapCp002PermanentEnglishPackage(id, seed))));
SAP_CP003_PROTOTYPE_IDS.forEach((id, index) => registrations.push(reg(34 + index, "SAP-CP-003", id, (seed) => generateSapCp003PermanentPackage(id, seed))));
SAP_CP004_PROTOTYPE_IDS.forEach((id, index) => registrations.push(reg(53 + index, "SAP-CP-004", id, (seed) => generateSapCp004E1Existing(id, seed))));
SAP_CP005_PROTOTYPE_IDS.forEach((id, index) => registrations.push(reg(72 + index, "SAP-CP-005", id, (seed) => generateSapCp005(id, seed))));
SAP_CP005_WAVE2_PROTOTYPE_IDS.forEach((id, index) => registrations.push(reg(86 + index, "SAP-CP-005", id, (seed) => generateSapCp005Wave2(id, seed))));
SAP_CP006_PROTOTYPE_IDS.forEach((id, index) => registrations.push(reg(92 + index, "SAP-CP-006", id, (seed) => generateSapCp006(id, seed))));
SAP_CP006_WAVE2_PROTOTYPE_IDS.forEach((id, index) => registrations.push(reg(104 + index, "SAP-CP-006", id, (seed) => generateSapCp006Wave2(id, seed))));
SAP_CP006_WAVE3_PROTOTYPE_IDS.forEach((id, index) => registrations.push(reg(112 + index, "SAP-CP-006", id, (seed) => generateSapCp006Wave3(id, seed))));
SAP_CP007_PROTOTYPE_IDS.forEach((id, index) => registrations.push(reg(113 + index, "SAP-CP-007", id, (seed) => generateSapCp007(id, seed))));
SAP_CP007_WAVE2_PROTOTYPE_IDS.forEach((id, index) => registrations.push(reg(125 + index, "SAP-CP-007", id, (seed) => generateSapCp007Wave2(id, seed))));
SAP_CP008_PROTOTYPE_IDS.forEach((id, index) => registrations.push(reg(129 + index, "SAP-CP-008", id, (seed) => generateSapCp008(id, seed))));
SAP_CP009_PROTOTYPE_IDS.forEach((id, index) => registrations.push(reg(147 + index, "SAP-CP-009", id, (seed) => generateSapCp009(id, seed))));
SAP_CP010_PROTOTYPE_IDS.forEach((id, index) => registrations.push(reg(166 + index, "SAP-CP-010", id, (seed) => generateSapCp010E1Existing(id, seed))));
registrations.push(reg(183, "SAP-CP-004", "SAP-CP004-E1-CAND-NESTED-ADDITIVE-EXACT-RADICAL", generateSapCp004E1NestedAdditive, 0.5, true));
registrations.push(reg(184, "SAP-CP-005", "SAP-CP005-E1-CAND-NUMERIC-PARTIAL-FRACTION-TELESCOPING", generateSapCp005E1Telescoping, 0.25, true));
registrations.push(reg(185, "SAP-CP-007", "SAP-CP007-E1-CAND-ROUND-TO-SIGNIFICANT-FIGURES", generateSapCp007E1SignificantFigures, 0, true));
registrations.push(reg(186, "SAP-CP-010", "SAP-CP010-E1-CAND-SUPPLIED-ROOT-SCALING", generateSapCp010E1SuppliedRootScaling, 0.25, true));
SAP_CP011_E2_STRUCTURES.forEach((id, index) => registrations.push(reg(187 + index, "SAP-CP-011", id, (seed) => generateSapCp011E2(id, seed), index >= 8 ? 0.5 : 1, index >= 8)));
SAP_CP012_E2_STRUCTURES.forEach((id, index) => registrations.push(reg(199 + index, "SAP-CP-012", id, (seed) => generateSapCp012E2(id, seed))));

const REGISTRATION_BY_QL = new Map<SapStudioQlId, GeneratorRegistration>(registrations.map((entry) => [entry.qlId, entry]));

export const SAP_QUESTION_STUDIO_QLS: readonly SapStudioQlDescriptor[] = Object.freeze(
  registrations
    .slice()
    .sort((a, b) => a.qlId.localeCompare(b.qlId))
    .map((entry) => {
      const meta = META_BY_QL.get(entry.qlId);
      if (!meta) throw new Error(`Missing frozen SAP metadata for ${entry.qlId}.`);
      if (meta.checkpointId !== entry.checkpointId) throw new Error(`${entry.qlId}: frozen checkpoint mismatch.`);
      return Object.freeze({
        qlId: entry.qlId,
        checkpointId: entry.checkpointId,
        title: meta.title,
        sourceIdentity: entry.sourceIdentity,
        defaultWeight: entry.defaultWeight,
        specialist: entry.specialist,
      });
    }),
);

export const SAP_QUESTION_STUDIO_CHECKPOINTS = Object.freeze(
  Array.from(new Set(SAP_QUESTION_STUDIO_QLS.map((entry) => entry.checkpointId))).sort(),
);

export const SAP_QUESTION_STUDIO_PACKAGE_V1 = Object.freeze({
  packageId: "SAP" as const,
  label: "Simplification & Approximation",
  permanentQlCount: 211,
  qlIds: Object.freeze(SAP_QUESTION_STUDIO_QLS.map((entry) => entry.qlId)),
  checkpoints: SAP_QUESTION_STUDIO_CHECKPOINTS,
  supportedLanguages: Object.freeze(["en"] as const),
  supportedExamProfiles: Object.freeze(["SSC", "BANKING", "RAILWAY", "PUNJAB_STATE"] as const),
  supportedDifficulties: Object.freeze(["EASY", "MEDIUM", "HARD"] as const),
  integrationAuthority: SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  sourceFreeze: "SAP-QL-001..SAP-QL-211",
  questionStudioRegistrationStatus: "REGISTERED" as const,
  questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
  questionStudioDiscoverable: true as const,
  persistenceAllowed: true as const,
  reviewOnly: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

function stringHash(input: string): number {
  const digest = createHash("sha256").update(input).digest();
  return digest.readUInt32BE(0);
}

function sourceSeed(seed: string, qlId: string, index: number): number {
  return (stringHash(`${seed}:${qlId}:${index}`) % 100) + 1;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function stringArray(value: unknown): readonly string[] {
  return Array.isArray(value) ? Object.freeze(value.map((item) => String(item))) : Object.freeze([]);
}

function normalizeDifficulty(value: unknown): SapStudioDifficulty {
  const normalized = text(value, "MEDIUM").toUpperCase();
  return normalized === "EASY" || normalized === "HARD" ? normalized : "MEDIUM";
}

function normalizeSource(
  descriptor: SapStudioQlDescriptor,
  source: unknown,
  requestSeed: string,
  numericSeed: number,
  examProfile: SapStudioExamProfile,
): SapStudioQuestion {
  const pkg = record(source);
  const rawOptions = Array.isArray(pkg.options) ? pkg.options : [];
  const optionDetails = Object.freeze(rawOptions.map((item, index) => {
    const option = record(item);
    const optionText = text(option.value, text(option.text, String(item)));
    return Object.freeze({
      label: String.fromCharCode(65 + index),
      text: optionText,
      isCorrect: option.isCorrect === true,
      misconceptionId: typeof option.misconceptionId === "string" ? option.misconceptionId : null,
      analysis: text(option.analysis),
    });
  }));
  const options = Object.freeze(optionDetails.map((option) => option.text));
  const rawCorrectIndex = Number(pkg.correctIndex);
  const correctIndex = Number.isInteger(rawCorrectIndex) && rawCorrectIndex >= 0 && rawCorrectIndex < options.length
    ? rawCorrectIndex
    : optionDetails.findIndex((option) => option.isCorrect);
  const answer = text(pkg.canonicalAnswer, text(pkg.answer, options[correctIndex] ?? ""));
  const explanation = record(pkg.explanation);
  const validation = record(pkg.validation);
  const errors = Array.isArray(validation.errors) ? validation.errors.map(String) : [];
  const contentHash = createHash("sha256").update(JSON.stringify({ qlId: descriptor.qlId, requestSeed, numericSeed, stem: pkg.stem, answer, options })).digest("hex").slice(0, 20);
  const questionId = `SAP-${descriptor.qlId.slice(-3)}-${contentHash}`;

  return Object.freeze({
    packageId: "SAP" as const,
    qlId: descriptor.qlId,
    qlName: descriptor.title,
    checkpointId: descriptor.checkpointId,
    sourceIdentity: descriptor.sourceIdentity,
    questionId,
    canonicalItemId: `${descriptor.qlId}:${numericSeed}:${contentHash}`,
    questionLanguageId: `${questionId}:en`,
    language: "en" as const,
    locale: "en-IN" as const,
    examProfile,
    difficultyBand: normalizeDifficulty(pkg.difficulty ?? pkg.difficultyBand),
    stem: text(pkg.stem),
    options,
    optionDetails,
    correctIndex,
    answer,
    explanation: Object.freeze({
      coreConcept: text(explanation.coreConcept),
      steps: stringArray(explanation.steps),
      finalAnswer: text(explanation.finalAnswer, `Therefore, the answer is ${answer}.`),
      verification: stringArray(explanation.verification),
    }),
    renderer: "TEXT_MATH" as const,
    seed: requestSeed,
    sourceSeed: numericSeed,
    integrationAuthority: SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    sourceValidation: Object.freeze({ valid: validation.ok !== false && errors.length === 0, errors: Object.freeze(errors) }),
    sourceLifecycleLocked: true as const,
  });
}

export interface GenerateSapStudioBatchInput {
  readonly count?: number;
  readonly seed?: string;
  readonly qlId?: SapStudioQlId;
  readonly checkpointId?: SapStudioCheckpointId;
  readonly difficulty?: SapStudioDifficulty;
  readonly examProfile?: SapStudioExamProfile;
}

function eligibleDescriptors(input: GenerateSapStudioBatchInput): readonly SapStudioQlDescriptor[] {
  let list = SAP_QUESTION_STUDIO_QLS;
  if (input.qlId) list = list.filter((entry) => entry.qlId === input.qlId);
  if (input.checkpointId) list = list.filter((entry) => entry.checkpointId === input.checkpointId);
  if (!input.qlId) {
    const positive = list.filter((entry) => entry.defaultWeight > 0);
    if (positive.length) list = positive;
  }
  if (!list.length) throw new Error("No Simplification & Approximation QL matches the selected filters.");
  return list;
}

function weightedPick(list: readonly SapStudioQlDescriptor[], seed: string, index: number): SapStudioQlDescriptor {
  const expanded: SapStudioQlDescriptor[] = [];
  for (const entry of list) {
    const copies = Math.max(1, Math.round(entry.defaultWeight * 4));
    for (let i = 0; i < copies; i += 1) expanded.push(entry);
  }
  return expanded[stringHash(`${seed}:pick:${index}`) % expanded.length]!;
}

export function generateSapQuestionStudioQuestion(
  qlId: SapStudioQlId,
  seed = "sap-question-studio-preview",
  examProfile: SapStudioExamProfile = "SSC",
  itemIndex = 0,
): SapStudioQuestion {
  const descriptor = SAP_QUESTION_STUDIO_QLS.find((entry) => entry.qlId === qlId);
  const registration = REGISTRATION_BY_QL.get(qlId);
  if (!descriptor || !registration) throw new Error(`Unknown frozen SAP QL '${qlId}'.`);
  const numericSeed = sourceSeed(seed, qlId, itemIndex);
  return normalizeSource(descriptor, registration.generate(numericSeed), seed, numericSeed, examProfile);
}

export function generateSapQuestionStudioBatch(input: GenerateSapStudioBatchInput = {}) {
  const count = Math.max(1, Math.min(50, Math.floor(input.count ?? 5)));
  const seed = input.seed?.trim() || "sap-question-studio-batch";
  const examProfile = input.examProfile ?? "SSC";
  const eligible = eligibleDescriptors(input);
  const questions: SapStudioQuestion[] = [];
  for (let index = 0; index < count; index += 1) {
    const descriptor = input.qlId ? eligible[0]! : weightedPick(eligible, seed, index);
    let question = generateSapQuestionStudioQuestion(descriptor.qlId, seed, examProfile, index);
    if (input.difficulty && question.difficultyBand !== input.difficulty) {
      let found = false;
      for (let attempt = 1; attempt <= 20; attempt += 1) {
        question = generateSapQuestionStudioQuestion(descriptor.qlId, `${seed}:d${attempt}`, examProfile, index);
        if (question.difficultyBand === input.difficulty) { found = true; break; }
      }
      if (!found) continue;
    }
    questions.push(question);
  }
  if (!questions.length) throw new Error("No SAP questions matched the requested difficulty/filter combination.");
  return Object.freeze({
    packageId: "SAP" as const,
    integrationAuthority: SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    reviewOnly: true as const,
    questions: Object.freeze(questions),
  });
}
