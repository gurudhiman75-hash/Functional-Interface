import { createHash } from "node:crypto";

import { generateSapCp001PermanentEnglishPackage } from "./SAP-001/SAP-CP-001/permanent-runtime/runtime";
import { generateSapCp002PermanentEnglishPackage } from "./SAP-001/SAP-CP-002/permanent-runtime/runtime";
import { SAP_CP003_PROTOTYPE_IDS } from "./SAP-001/SAP-CP-003/types";
import { generateSapCp003PermanentPackage } from "./SAP-001/SAP-CP-003/permanent-runtime/runtime";
import {
  SAP_CP004_PROTOTYPE_IDS,
  generateSapCp004E1Existing,
  generateSapCp004E1NestedAdditive,
} from "./SAP-001/SAP-CP-004/e1-runtime";
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
import {
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010E1Existing,
  generateSapCp010E1SuppliedRootScaling,
} from "./SAP-002/SAP-CP-010/e1-runtime";
import { SAP_CP011_E2_STRUCTURES, generateSapCp011E2 } from "./SAP-002/SAP-CP-011/runtime-release-r6";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 } from "./SAP-002/SAP-CP-012/runtime-release-e3";
import { SAP_PERMANENT_QL_REGISTRY } from "./SAP-PERMANENT-QL-REGISTRY";
import { SAP_CP004_008_FROZEN_REGISTRY_ENTRIES } from "./SAP-CP004-008-PERMANENT-FREEZE";
import { SAP_CP009_FROZEN_REGISTRY_ENTRIES } from "./SAP-CP009-PERMANENT-FREEZE";
import { SAP_QL166_211_FINAL_FROZEN_ENTRIES } from "./SAP-QL166-211-PERMANENT-FREEZE";

export const SAP_QUESTION_STUDIO_PACKAGE_ID = "SAP" as const;
export const SAP_QUESTION_STUDIO_LANGUAGES = ["en"] as const;
export const SAP_QUESTION_STUDIO_CP_IDS = [
  "SAP-CP-001",
  "SAP-CP-002",
  "SAP-CP-003",
  "SAP-CP-004",
  "SAP-CP-005",
  "SAP-CP-006",
  "SAP-CP-007",
  "SAP-CP-008",
  "SAP-CP-009",
  "SAP-CP-010",
  "SAP-CP-011",
  "SAP-CP-012",
] as const;

export type SapQuestionStudioCpId = typeof SAP_QUESTION_STUDIO_CP_IDS[number];
export type SapQuestionStudioDifficulty = "Easy" | "Medium" | "Hard";
export type SapQuestionStudioQlId = `SAP-QL-${string}`;

export interface SapQuestionStudioQlDescriptor {
  qlId: SapQuestionStudioQlId;
  checkpointId: SapQuestionStudioCpId;
  title: string;
  sourceIdentity: string;
  defaultWeight: number;
  specialist: boolean;
}

export interface SapQuestionStudioPipelineOptions {
  difficulty?: SapQuestionStudioDifficulty;
  language?: "en";
  questionLanguageId?: string;
  seed?: string;
}

interface Registration {
  qlId: SapQuestionStudioQlId;
  checkpointId: SapQuestionStudioCpId;
  sourceIdentity: string;
  generate: (seed: number) => unknown;
  defaultWeight: number;
  specialist: boolean;
}

const FROZEN_META = [
  ...SAP_PERMANENT_QL_REGISTRY,
  ...SAP_CP004_008_FROZEN_REGISTRY_ENTRIES,
  ...SAP_CP009_FROZEN_REGISTRY_ENTRIES,
  ...SAP_QL166_211_FINAL_FROZEN_ENTRIES,
] as const;

const META_BY_QL = new Map<string, { permanentQlId: string; checkpointId: string; title: string }>(
  FROZEN_META.map((entry) => [entry.permanentQlId, entry]),
);

function ql(number: number): SapQuestionStudioQlId {
  return `SAP-QL-${String(number).padStart(3, "0")}` as SapQuestionStudioQlId;
}

function qlNumber(permanentQlId: string) {
  const value = Number(permanentQlId.slice(-3));
  if (!Number.isInteger(value) || value < 1 || value > 211) {
    throw new Error(`Invalid frozen SAP QL '${permanentQlId}'.`);
  }
  return value;
}

function registration(
  number: number,
  checkpointId: SapQuestionStudioCpId,
  sourceIdentity: string,
  generate: (seed: number) => unknown,
  defaultWeight = 1,
  specialist = false,
): Registration {
  return {
    qlId: ql(number),
    checkpointId,
    sourceIdentity,
    generate,
    defaultWeight,
    specialist,
  };
}

const registrations: Registration[] = [];

for (const frozen of SAP_PERMANENT_QL_REGISTRY.filter((entry) => entry.checkpointId === "SAP-CP-001")) {
  const ancestry = frozen.prototypeAncestry;
  if (!ancestry.length) throw new Error(`${frozen.permanentQlId}: CP001 prototype ancestry is empty.`);
  registrations.push(registration(
    qlNumber(frozen.permanentQlId),
    "SAP-CP-001",
    String(frozen.templateId),
    (seed) => {
      const prototypeId = ancestry[(seed - 1) % ancestry.length] as Parameters<typeof generateSapCp001PermanentEnglishPackage>[0];
      return generateSapCp001PermanentEnglishPackage(prototypeId, seed);
    },
  ));
}

for (const frozen of SAP_PERMANENT_QL_REGISTRY.filter((entry) => entry.checkpointId === "SAP-CP-002")) {
  const ancestry = frozen.prototypeAncestry;
  if (!ancestry.length) throw new Error(`${frozen.permanentQlId}: CP002 prototype ancestry is empty.`);
  registrations.push(registration(
    qlNumber(frozen.permanentQlId),
    "SAP-CP-002",
    String(frozen.templateId),
    (seed) => {
      const prototypeId = ancestry[(seed - 1) % ancestry.length] as Parameters<typeof generateSapCp002PermanentEnglishPackage>[0];
      return generateSapCp002PermanentEnglishPackage(prototypeId, seed);
    },
  ));
}

SAP_CP003_PROTOTYPE_IDS.forEach((id, index) => registrations.push(registration(34 + index, "SAP-CP-003", id, (seed) => generateSapCp003PermanentPackage(id, seed))));
SAP_CP004_PROTOTYPE_IDS.forEach((id, index) => registrations.push(registration(53 + index, "SAP-CP-004", id, (seed) => generateSapCp004E1Existing(id, seed))));
SAP_CP005_PROTOTYPE_IDS.forEach((id, index) => registrations.push(registration(72 + index, "SAP-CP-005", id, (seed) => generateSapCp005(id, seed))));
SAP_CP005_WAVE2_PROTOTYPE_IDS.forEach((id, index) => registrations.push(registration(86 + index, "SAP-CP-005", id, (seed) => generateSapCp005Wave2(id, seed))));
SAP_CP006_PROTOTYPE_IDS.forEach((id, index) => registrations.push(registration(92 + index, "SAP-CP-006", id, (seed) => generateSapCp006(id, seed))));
SAP_CP006_WAVE2_PROTOTYPE_IDS.forEach((id, index) => registrations.push(registration(104 + index, "SAP-CP-006", id, (seed) => generateSapCp006Wave2(id, seed))));
SAP_CP006_WAVE3_PROTOTYPE_IDS.forEach((id, index) => registrations.push(registration(112 + index, "SAP-CP-006", id, (seed) => generateSapCp006Wave3(id, seed))));
SAP_CP007_PROTOTYPE_IDS.forEach((id, index) => registrations.push(registration(113 + index, "SAP-CP-007", id, (seed) => generateSapCp007(id, seed))));
SAP_CP007_WAVE2_PROTOTYPE_IDS.forEach((id, index) => registrations.push(registration(125 + index, "SAP-CP-007", id, (seed) => generateSapCp007Wave2(id, seed))));
SAP_CP008_PROTOTYPE_IDS.forEach((id, index) => registrations.push(registration(129 + index, "SAP-CP-008", id, (seed) => generateSapCp008(id, seed))));
SAP_CP009_PROTOTYPE_IDS.forEach((id, index) => registrations.push(registration(147 + index, "SAP-CP-009", id, (seed) => generateSapCp009(id, seed))));
SAP_CP010_PROTOTYPE_IDS.forEach((id, index) => registrations.push(registration(166 + index, "SAP-CP-010", id, (seed) => generateSapCp010E1Existing(id, seed))));
registrations.push(registration(183, "SAP-CP-004", "SAP-CP004-E1-CAND-NESTED-ADDITIVE-EXACT-RADICAL", generateSapCp004E1NestedAdditive, 0.5, true));
registrations.push(registration(184, "SAP-CP-005", "SAP-CP005-E1-CAND-NUMERIC-PARTIAL-FRACTION-TELESCOPING", generateSapCp005E1Telescoping, 0.25, true));
registrations.push(registration(185, "SAP-CP-007", "SAP-CP007-E1-CAND-ROUND-TO-SIGNIFICANT-FIGURES", generateSapCp007E1SignificantFigures, 0, true));
registrations.push(registration(186, "SAP-CP-010", "SAP-CP010-E1-CAND-SUPPLIED-ROOT-SCALING", generateSapCp010E1SuppliedRootScaling, 0.25, true));
SAP_CP011_E2_STRUCTURES.forEach((id, index) => registrations.push(registration(187 + index, "SAP-CP-011", id, (seed) => generateSapCp011E2(id, seed), index >= 8 ? 0.5 : 1, index >= 8));
SAP_CP012_E2_STRUCTURES.forEach((id, index) => registrations.push(registration(199 + index, "SAP-CP-012", id, (seed) => generateSapCp012E2(id, seed))));

const REGISTRATION_BY_QL = new Map(registrations.map((entry) => [entry.qlId, entry]));

export const SAP_QUESTION_STUDIO_QLS: readonly SapQuestionStudioQlDescriptor[] = registrations
  .slice()
  .sort((left, right) => left.qlId.localeCompare(right.qlId))
  .map((entry) => {
    const meta = META_BY_QL.get(entry.qlId);
    if (!meta) throw new Error(`Missing frozen SAP metadata for ${entry.qlId}.`);
    if (meta.checkpointId !== entry.checkpointId) {
      throw new Error(`${entry.qlId}: frozen checkpoint mismatch (${meta.checkpointId} != ${entry.checkpointId}).`);
    }
    return Object.freeze({
      qlId: entry.qlId,
      checkpointId: entry.checkpointId,
      title: meta.title,
      sourceIdentity: entry.sourceIdentity,
      defaultWeight: entry.defaultWeight,
      specialist: entry.specialist,
    });
  });

if (SAP_QUESTION_STUDIO_QLS.length !== 211) {
  throw new Error(`SAP Question Studio adapter expected 211 frozen QLs, found ${SAP_QUESTION_STUDIO_QLS.length}.`);
}

const EXPECTED_QLS = Array.from({ length: 211 }, (_, index) => ql(index + 1));
if (SAP_QUESTION_STUDIO_QLS.some((entry, index) => entry.qlId !== EXPECTED_QLS[index])) {
  throw new Error("SAP Question Studio adapter QL registration is not contiguous SAP-QL-001..SAP-QL-211.");
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function firstStrings(...values: unknown[]) {
  for (const value of values) {
    const result = strings(value);
    if (result.length) return result;
  }
  return [];
}

function normalizeDifficulty(value: unknown): SapQuestionStudioDifficulty {
  const normalized = text(value, "MEDIUM").trim().toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "hard") return "Hard";
  return "Medium";
}

function hash(value: string) {
  return createHash("sha256").update(value).digest().readUInt32BE(0);
}

function numericSeed(seed: string, qlId: string, attempt: number) {
  return (hash(`${seed}:${qlId}:${attempt}`) % 100) + 1;
}

function weightedPick(list: readonly SapQuestionStudioQlDescriptor[], seed: string, attempt: number) {
  const pool: SapQuestionStudioQlDescriptor[] = [];
  for (const entry of list) {
    const copies = Math.max(1, Math.round(entry.defaultWeight * 4));
    for (let index = 0; index < copies; index += 1) pool.push(entry);
  }
  return pool[hash(`${seed}:pick:${attempt}`) % pool.length]!;
}

export function inferSapQuestionStudioCpFromQl(value: unknown): SapQuestionStudioCpId | undefined {
  const qlId = String(value ?? "") as SapQuestionStudioQlId;
  return SAP_QUESTION_STUDIO_QLS.find((entry) => entry.qlId === qlId)?.checkpointId;
}

export function getSapQuestionStudioQlIds(checkpointId?: SapQuestionStudioCpId) {
  return SAP_QUESTION_STUDIO_QLS
    .filter((entry) => !checkpointId || entry.checkpointId === checkpointId)
    .map((entry) => entry.qlId);
}

function normalizePackage(
  descriptor: SapQuestionStudioQlDescriptor,
  source: unknown,
  seed: string,
  sourceSeed: number,
) {
  const pkg = record(source);
  const rawOptions = Array.isArray(pkg.options) ? pkg.options : [];
  const sourceCorrectIndex = Number(pkg.correctIndex);
  const optionRows = rawOptions.map((item, index) => {
    if (typeof item === "string" || typeof item === "number") {
      return {
        value: String(item),
        isCorrect: Number.isInteger(sourceCorrectIndex) && index === sourceCorrectIndex,
        misconceptionId: null as string | null,
        analysis: "",
      };
    }
    const option = record(item);
    return {
      value: text(option.value, text(option.text, String(item))),
      isCorrect: option.isCorrect === true || (Number.isInteger(sourceCorrectIndex) && index === sourceCorrectIndex),
      misconceptionId: typeof option.misconceptionId === "string" ? option.misconceptionId : null,
      analysis: text(option.analysis),
    };
  });
  const options = optionRows.map((entry) => entry.value);
  const fallbackCorrectIndex = optionRows.findIndex((entry) => entry.isCorrect);
  const correctIndex = Number.isInteger(sourceCorrectIndex) && sourceCorrectIndex >= 0 && sourceCorrectIndex < options.length
    ? sourceCorrectIndex
    : fallbackCorrectIndex;
  const answer = text(pkg.canonicalAnswer, text(pkg.answer, options[correctIndex] ?? ""));

  const explanation = record(pkg.explanation);
  const technicalDetails = record(pkg.technicalDetails);
  const validation = record(pkg.validation);
  const discoveryValidation = record(technicalDetails.discoveryValidation);
  const validationErrors = firstStrings(validation.errors, discoveryValidation.errors);
  const validationOk = typeof validation.ok === "boolean"
    ? validation.ok
    : typeof discoveryValidation.ok === "boolean"
      ? discoveryValidation.ok
      : true;
  const explanationLines = [
    text(explanation.coreConcept, text(explanation.givenDataAndStrategy)),
    ...firstStrings(explanation.steps, explanation.stepByStep, explanation.lines),
    text(explanation.finalAnswer),
    ...firstStrings(explanation.verification).map((line) => `Check: ${line}`),
  ].filter(Boolean);

  const identity = createHash("sha256")
    .update(JSON.stringify({ qlId: descriptor.qlId, seed, sourceSeed, stem: pkg.stem, options, answer }))
    .digest("hex")
    .slice(0, 20);
  const questionId = `SAP-${descriptor.qlId.slice(-3)}-${identity}`;
  const difficultyBand = normalizeDifficulty(pkg.difficulty ?? pkg.difficultyBand);

  return Object.freeze({
    packageId: SAP_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: descriptor.checkpointId,
    questionLanguageId: descriptor.qlId,
    explanationId: `${descriptor.qlId}-EXP-EN`,
    questionId,
    stem: text(pkg.stem),
    options: Object.freeze(options),
    correctIndex,
    answer,
    difficultyBand,
    language: "en" as const,
    locale: "en-IN" as const,
    runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    explanation: Object.freeze({ lines: Object.freeze(explanationLines) }),
    validation: Object.freeze({ ok: validationOk && validationErrors.length === 0, errors: Object.freeze(validationErrors) }),
    traceability: Object.freeze({
      releaseId: "SAP-QL001-211-FROZEN",
      permanentQlId: descriptor.qlId,
      checkpointId: descriptor.checkpointId,
      sourceIdentity: descriptor.sourceIdentity,
      qlTitle: descriptor.title,
      sourceSeed,
      specialist: descriptor.specialist,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    }),
  });
}

export function runSapQuestionStudioPipeline(
  checkpointId: SapQuestionStudioCpId,
  options: SapQuestionStudioPipelineOptions = {},
) {
  if (!SAP_QUESTION_STUDIO_CP_IDS.includes(checkpointId)) {
    throw new Error(`Unknown canonical problem '${checkpointId}' for package SAP`);
  }
  if ((options.language ?? "en") !== "en") {
    throw new Error("SAP supports English generation only in Question Studio.");
  }

  const explicitQl = options.questionLanguageId as SapQuestionStudioQlId | undefined;
  const explicitDescriptor = explicitQl
    ? SAP_QUESTION_STUDIO_QLS.find((entry) => entry.qlId === explicitQl)
    : undefined;
  if (explicitQl && !explicitDescriptor) throw new Error(`Unknown frozen SAP QL '${explicitQl}'.`);
  if (explicitDescriptor && explicitDescriptor.checkpointId !== checkpointId) {
    throw new Error(`${explicitQl} is owned by ${explicitDescriptor.checkpointId}, not ${checkpointId}.`);
  }

  const scoped = explicitDescriptor
    ? [explicitDescriptor]
    : SAP_QUESTION_STUDIO_QLS.filter((entry) => entry.checkpointId === checkpointId && entry.defaultWeight > 0);
  if (!scoped.length) throw new Error(`No active SAP QLs are registered for ${checkpointId}.`);

  const seed = options.seed?.trim() || `quant-v4:SAP:${checkpointId}`;
  const maxAttempts = explicitDescriptor ? 100 : Math.max(200, scoped.length * 20);
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const descriptor = explicitDescriptor ?? weightedPick(scoped, seed, attempt);
    const sourceSeed = numericSeed(seed, descriptor.qlId, attempt);
    const registration = REGISTRATION_BY_QL.get(descriptor.qlId);
    if (!registration) throw new Error(`Missing SAP generator registration for ${descriptor.qlId}.`);
    const normalized = normalizePackage(descriptor, registration.generate(sourceSeed), seed, sourceSeed);
    if (!options.difficulty || normalized.difficultyBand === options.difficulty) return normalized;
  }

  const scope = explicitQl ?? checkpointId;
  throw new Error(
    options.difficulty
      ? `Unable to generate ${options.difficulty} SAP content from ${scope}; choose another difficulty or QL.`
      : `Unable to generate SAP content from ${scope}.`,
  );
}
