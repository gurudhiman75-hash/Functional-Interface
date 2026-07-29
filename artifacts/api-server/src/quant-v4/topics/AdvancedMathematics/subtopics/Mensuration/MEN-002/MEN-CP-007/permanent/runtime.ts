import { exactKey } from "../../foundation/exact";
import { MEN_CP_007_PROTOTYPES } from "../../foundation/prototype-registry";
import { generateMenCp007Prototype } from "../../foundation/runtime";
import { createSeededRandom } from "../../foundation/seed";
import type { MenCp007PrototypeId } from "../../foundation/types";
import { MEN_CP_007_WAVE_01_PROTOTYPES } from "../../gap-wave-01/registry";
import { generateMenCp007Wave01Prototype } from "../../gap-wave-01/runtime";
import type { MenCp007Wave01PrototypeId } from "../../gap-wave-01/types";
import { MEN_CP_007_WAVE_02_PROTOTYPES } from "../../gap-wave-02/registry";
import { generateMenCp007Wave02Prototype } from "../../gap-wave-02/runtime";
import type { MenCp007Wave02PrototypeId } from "../../gap-wave-02/types";
import { MEN_CP_007_WAVE_03_PROTOTYPES } from "../../gap-wave-03/registry";
import { generateMenCp007Wave03Prototype } from "../../gap-wave-03/runtime";
import type { MenCp007Wave03PrototypeId } from "../../gap-wave-03/types";
import { MEN_CP_007_WAVE_04_PROTOTYPES } from "../../source-gap-wave-04/registry";
import { generateMenCp007Wave04Prototype } from "../../source-gap-wave-04/runtime";
import type { MenCp007Wave04PrototypeId } from "../../source-gap-wave-04/types";
import {
  MEN_CP_007_FROZEN_QLS,
  type MenCp007AnyPrototypeId,
  type MenCp007FrozenQlDefinition,
} from "../final-freeze/registry";
import type { MenCp007PermanentPackage } from "./types";

const foundationIds = new Set<string>(MEN_CP_007_PROTOTYPES.map((item) => item.prototypeId));
const wave01Ids = new Set<string>(MEN_CP_007_WAVE_01_PROTOTYPES.map((item) => item.prototypeId));
const wave02Ids = new Set<string>(MEN_CP_007_WAVE_02_PROTOTYPES.map((item) => item.prototypeId));
const wave03Ids = new Set<string>(MEN_CP_007_WAVE_03_PROTOTYPES.map((item) => item.prototypeId));
const wave04Ids = new Set<string>(MEN_CP_007_WAVE_04_PROTOTYPES.map((item) => item.prototypeId));

function getFrozenDefinition(qlId: string): MenCp007FrozenQlDefinition {
  const definition = MEN_CP_007_FROZEN_QLS.find((item) => item.qlId === qlId);
  if (!definition) throw new Error(`Unknown MEN-CP-007 permanent QL: ${qlId}`);
  return definition;
}

function sourceWaveId(prototypeId: MenCp007AnyPrototypeId): MenCp007PermanentPackage["sourceWaveId"] {
  if (foundationIds.has(prototypeId)) return "MEN-CP-007-PROTOTYPE-FOUNDATION";
  if (wave01Ids.has(prototypeId)) return "MEN-CP-007-GAP-WAVE-01";
  if (wave02Ids.has(prototypeId)) return "MEN-CP-007-GAP-WAVE-02";
  if (wave03Ids.has(prototypeId)) return "MEN-CP-007-GAP-WAVE-03";
  if (wave04Ids.has(prototypeId)) return "MEN-CP-007-SOURCE-GAP-WAVE-04";
  throw new Error(`Prototype is not part of the frozen CP-007 runtime: ${prototypeId}`);
}

export function generateMenCp007SourcePrototype(prototypeId: MenCp007AnyPrototypeId, seed: string) {
  if (foundationIds.has(prototypeId)) {
    return generateMenCp007Prototype(prototypeId as MenCp007PrototypeId, seed);
  }
  if (wave01Ids.has(prototypeId)) {
    return generateMenCp007Wave01Prototype(prototypeId as MenCp007Wave01PrototypeId, seed);
  }
  if (wave02Ids.has(prototypeId)) {
    return generateMenCp007Wave02Prototype(prototypeId as MenCp007Wave02PrototypeId, seed);
  }
  if (wave03Ids.has(prototypeId)) {
    return generateMenCp007Wave03Prototype(prototypeId as MenCp007Wave03PrototypeId, seed);
  }
  if (wave04Ids.has(prototypeId)) {
    return generateMenCp007Wave04Prototype(prototypeId as MenCp007Wave04PrototypeId, seed);
  }
  throw new Error(`Prototype is not part of the frozen CP-007 runtime: ${prototypeId}`);
}

function validatePermanentPackage(
  question: Omit<MenCp007PermanentPackage, "validation">,
  definition: MenCp007FrozenQlDefinition,
) {
  const checks = [
    {
      name: "frozen QL mapping",
      passed: definition.qlId === question.qlId && definition.templateId === question.templateId && definition.canonicalSolveMode === question.canonicalSolveMode,
      message: "Permanent identity, template and canonical solve mode must match the frozen registry.",
    },
    {
      name: "approved prototype ancestry",
      passed: definition.prototypeIds.includes(question.sourcePrototypeId),
      message: "The selected source prototype must belong to the frozen QL family.",
    },
    {
      name: "source validation",
      passed: question.sourceValidation.valid,
      message: "The original executable prototype package must remain valid.",
    },
    {
      name: "independent verifier",
      passed: question.verification.valid,
      message: "The source independent verifier must agree with the answer.",
    },
    {
      name: "four exact options",
      passed: question.options.length === 4 && new Set(question.options.map((option) => exactKey(option.value))).size === 4,
      message: "Exactly four unique exact options are required.",
    },
    {
      name: "one correct option",
      passed: question.options.filter((option) => option.isCorrect).length === 1 && question.options[question.correctIndex]?.isCorrect === true,
      message: "Exactly one option must be correct at the declared index.",
    },
    {
      name: "answer preservation",
      passed: question.answer === question.options[question.correctIndex]?.display,
      message: "The displayed answer must equal the source correct option.",
    },
    {
      name: "source state preservation",
      passed: question.sourceState.prototypeId === question.sourcePrototypeId && question.sourceState.solveMode === question.sourceSolveMode && question.sourceState.seed === question.sourceSeed,
      message: "Prototype, solve-mode and seed provenance must remain exact.",
    },
    {
      name: "four-tier explanation",
      passed: Boolean(question.explanation.keyRule) && question.explanation.steps.length >= 2 && Boolean(question.explanation.shortcut) && question.explanation.traps.length === 3,
      message: "Core concept, worked steps, shortcut and three option-specific traps are required.",
    },
    {
      name: "inactive lifecycle",
      passed: question.maturity === "IMPLEMENTATION_PROOF" && question.permanentIdentityFrozen && !question.active && !question.questionStudioDiscoverable && !question.questionBankWritable && !question.testEligible && !question.publiclyPublishable,
      message: "Permanent implementation proof must remain invisible and ineligible.",
    },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp007PermanentQuestion(
  qlId: string,
  seed: string,
  language: "en" | "hi" | "pa" = "en",
): MenCp007PermanentPackage {
  if (language !== "en") {
    throw new Error(`MEN-CP-007 permanent runtime currently supports English only; received ${language}.`);
  }
  if (!seed.trim()) throw new Error("MEN-CP-007 permanent runtime requires a non-empty deterministic seed.");

  const definition = getFrozenDefinition(qlId);
  const prototypeId = createSeededRandom(`${definition.qlId}:${seed}:prototype`).pick(definition.prototypeIds);
  const sourceSeed = `men-002-cp007-permanent:${definition.qlId}:${seed}:${prototypeId}`;
  const source = generateMenCp007SourcePrototype(prototypeId, sourceSeed);

  const partial = {
    packageId: "MEN-002" as const,
    canonicalProblemId: "MEN-CP-007" as const,
    qlId: definition.qlId,
    templateId: definition.templateId,
    canonicalSolveMode: definition.canonicalSolveMode,
    sourcePrototypeId: prototypeId,
    sourceSolveMode: source.solveMode,
    sourceWaveId: sourceWaveId(prototypeId),
    language: "en" as const,
    seed,
    sourceSeed,
    difficulty: source.difficulty,
    target: definition.target,
    stem: source.stem,
    options: source.options.map((option) => ({ ...option })),
    correctIndex: source.correctIndex,
    answer: source.answer,
    exactAnswer: source.exactAnswer,
    unit: source.unit,
    explanation: {
      keyRule: source.explanation.keyRule,
      steps: source.explanation.steps.map((step) => ({ ...step })),
      shortcut: source.explanation.shortcut,
      traps: [...source.explanation.traps],
    },
    sourceState: {
      prototypeId: source.state.prototypeId,
      solveMode: source.state.solveMode,
      seed: source.state.seed,
      difficulty: source.state.difficulty,
      dimensions: { ...source.state.dimensions },
      derived: { ...source.state.derived },
      unit: source.state.unit,
    },
    verification: { ...source.verification },
    sourceValidation: {
      valid: source.validation.valid,
      checks: source.validation.checks.map((check) => ({ ...check })),
    },
    maturity: "IMPLEMENTATION_PROOF" as const,
    allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF" as const,
    permanentIdentityFrozen: true as const,
    active: false as const,
    reviewStatus: "UNREVIEWED_PERMANENT_ENGLISH" as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
  };

  return { ...partial, validation: validatePermanentPackage(partial, definition) };
}
