import { exactKey, isPositive } from "../../foundation/exact";
import type {
  ExactValue,
  Men002Difficulty,
  Men002Target,
  Men002Unit,
} from "../../foundation/types";
import { MEN_CP_008_PROTOTYPES } from "../../cp008-foundation/registry";
import { generateMenCp008Prototype } from "../../cp008-foundation/runtime";
import type { MenCp008PrototypeId } from "../../cp008-foundation/types";
import { MEN_CP_008_WAVE_01_PROTOTYPES } from "../../cp008-gap-wave-01/registry";
import { generateMenCp008Wave01Prototype } from "../../cp008-gap-wave-01/runtime";
import type { MenCp008Wave01PrototypeId } from "../../cp008-gap-wave-01/types";
import { MEN_CP_008_WAVE_02_PROTOTYPES } from "../../cp008-gap-wave-02/registry";
import { generateMenCp008Wave02Prototype } from "../../cp008-gap-wave-02/runtime";
import type { MenCp008Wave02PrototypeId } from "../../cp008-gap-wave-02/types";
import { MEN_CP_008_WAVE_03_PROTOTYPES } from "../../cp008-source-gap-wave-03/registry";
import { generateMenCp008Wave03Prototype } from "../../cp008-source-gap-wave-03/runtime";
import type { MenCp008Wave03PrototypeId } from "../../cp008-source-gap-wave-03/types";
import { MEN_CP_008_WAVE_04_PROTOTYPES } from "../../cp008-source-gap-wave-04/registry";
import { generateMenCp008Wave04Prototype } from "../../cp008-source-gap-wave-04/runtime";
import type { MenCp008Wave04PrototypeId } from "../../cp008-source-gap-wave-04/types";
import type { MenCp008AnyPrototypeId } from "../../cp008-chapter-audit/compression";
import {
  getMenCp008FrozenQlDefinition,
  type MenCp008FrozenQlDefinition,
} from "../final-freeze/registry";

interface CommonOption {
  label: "A" | "B" | "C" | "D";
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

interface CommonSourcePackage {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-008";
  permanentQlId: null;
  prototypeId: MenCp008AnyPrototypeId;
  solveMode: string;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: Men002Target;
  piPolicy: string;
  stem: string;
  options: CommonOption[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactValue;
  unit: Men002Unit;
  explanation: {
    keyRule: string;
    steps: Array<{ title: string; body: string; equation?: string }>;
    shortcut: string;
    traps: string[];
  };
  state: {
    permanentQlId: null;
    seed: string;
    [key: string]: unknown;
  };
  verification: { valid: boolean; method: string; reconstructed: string };
  validation: { valid: boolean; checks: Array<{ name: string; passed: boolean; message: string }> };
  reviewStatus: string;
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}

export interface MenCp008PermanentQuestion {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-008";
  permanentQlId: string;
  templateId: string;
  candidateId: string;
  canonicalKey: string;
  prototypeId: MenCp008AnyPrototypeId;
  prototypeAncestries: readonly MenCp008AnyPrototypeId[];
  solveMode: string;
  language: "en";
  seed: string;
  sourceSeed: string;
  difficulty: Men002Difficulty;
  target: Men002Target;
  piPolicy: string;
  stem: string;
  options: CommonOption[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactValue;
  unit: Men002Unit;
  explanation: CommonSourcePackage["explanation"];
  state: CommonSourcePackage["state"] & { permanentQlId: string; seed: string };
  sourceState: CommonSourcePackage["state"];
  verification: CommonSourcePackage["verification"];
  sourceValidation: CommonSourcePackage["validation"];
  validation: { valid: boolean; checks: Array<{ name: string; passed: boolean; message: string }> };
  maturity: "IMPLEMENTATION_PROOF";
  allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF";
  permanentIdentityFrozen: true;
  reviewStatus: "ENGLISH_IMPLEMENTATION_FROZEN";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}

const FOUNDATION_IDS = new Set<string>(MEN_CP_008_PROTOTYPES.map((definition) => definition.prototypeId));
const WAVE_01_IDS = new Set<string>(MEN_CP_008_WAVE_01_PROTOTYPES.map((definition) => definition.prototypeId));
const WAVE_02_IDS = new Set<string>(MEN_CP_008_WAVE_02_PROTOTYPES.map((definition) => definition.prototypeId));
const WAVE_03_IDS = new Set<string>(MEN_CP_008_WAVE_03_PROTOTYPES.map((definition) => definition.prototypeId));
const WAVE_04_IDS = new Set<string>(MEN_CP_008_WAVE_04_PROTOTYPES.map((definition) => definition.prototypeId));

function hashText(text: string) {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

function generateSourcePackage(
  prototypeId: MenCp008AnyPrototypeId,
  sourceSeed: string,
): CommonSourcePackage {
  if (FOUNDATION_IDS.has(prototypeId)) {
    return generateMenCp008Prototype(prototypeId as MenCp008PrototypeId, sourceSeed) as unknown as CommonSourcePackage;
  }
  if (WAVE_01_IDS.has(prototypeId)) {
    return generateMenCp008Wave01Prototype(prototypeId as MenCp008Wave01PrototypeId, sourceSeed) as unknown as CommonSourcePackage;
  }
  if (WAVE_02_IDS.has(prototypeId)) {
    return generateMenCp008Wave02Prototype(prototypeId as MenCp008Wave02PrototypeId, sourceSeed) as unknown as CommonSourcePackage;
  }
  if (WAVE_03_IDS.has(prototypeId)) {
    return generateMenCp008Wave03Prototype(prototypeId as MenCp008Wave03PrototypeId, sourceSeed) as unknown as CommonSourcePackage;
  }
  if (WAVE_04_IDS.has(prototypeId)) {
    return generateMenCp008Wave04Prototype(prototypeId as MenCp008Wave04PrototypeId, sourceSeed) as unknown as CommonSourcePackage;
  }
  throw new Error(`Unknown MEN-CP-008 prototype ancestry: ${prototypeId}`);
}

function choosePrototype(
  definition: MenCp008FrozenQlDefinition,
  seed: string,
  requestedPrototypeId?: MenCp008AnyPrototypeId,
) {
  if (requestedPrototypeId) {
    if (!definition.prototypeIds.includes(requestedPrototypeId)) {
      throw new Error(`${requestedPrototypeId} is not an ancestry of ${definition.qlId}.`);
    }
    return requestedPrototypeId;
  }
  return definition.prototypeIds[hashText(`${definition.qlId}:${seed}:ancestry`) % definition.prototypeIds.length]!;
}

function naturaliseTraps(traps: readonly string[]) {
  return traps.map((trap) => trap
    .replace(": Common mistake: ", ": This result comes from ")
    .replace(/Common mistake:/g, "This result comes from"));
}

function validatePermanentQuestion(question: Omit<MenCp008PermanentQuestion, "validation">) {
  const checks = [
    {
      name: "frozen identity",
      passed:
        question.permanentIdentityFrozen &&
        question.permanentQlId.startsWith("MEN-002-QL-") &&
        getMenCp008FrozenQlDefinition(question.permanentQlId).prototypeIds.includes(question.prototypeId),
      message: "Permanent QL and prototype ancestry must agree with the frozen registry.",
    },
    {
      name: "source proof",
      passed: question.sourceValidation.valid && question.verification.valid,
      message: "The source generator and independent mathematical verifier must pass.",
    },
    {
      name: "four exact options",
      passed:
        question.options.length === 4 &&
        new Set(question.options.map((option) => exactKey(option.value))).size === 4 &&
        question.options.every((option) => isPositive(option.value)),
      message: "Exactly four unique positive exact options are required.",
    },
    {
      name: "one correct option",
      passed:
        question.options.filter((option) => option.isCorrect).length === 1 &&
        question.options[question.correctIndex]?.isCorrect === true &&
        question.answer === question.options[question.correctIndex]?.display,
      message: "Exactly one option must be correct and match the declared answer.",
    },
    {
      name: "teaching explanation",
      passed:
        Boolean(question.explanation.keyRule) &&
        question.explanation.steps.length >= 2 &&
        Boolean(question.explanation.shortcut) &&
        question.explanation.traps.length === 3,
      message: "Rule, worked steps, shortcut and three option-linked diagnostics are required.",
    },
    {
      name: "product lifecycle lock",
      passed:
        question.maturity === "IMPLEMENTATION_PROOF" &&
        question.allocationStatus === "ALLOCATED_IMPLEMENTATION_PROOF" &&
        question.reviewStatus === "ENGLISH_IMPLEMENTATION_FROZEN" &&
        question.questionBankStatus === "NOT_STORED" &&
        question.testEligibility === "INELIGIBLE" &&
        !question.publiclyPublishable &&
        !question.questionStudioDiscoverable,
      message: "Permanent allocation must not enable any product or publication surface.",
    },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp008PermanentQuestion(
  qlId: string,
  seed: string,
  requestedPrototypeId?: MenCp008AnyPrototypeId,
): MenCp008PermanentQuestion {
  if (!seed.trim()) throw new Error("MEN-CP-008 permanent generation requires a non-empty deterministic seed.");
  const definition = getMenCp008FrozenQlDefinition(qlId);
  const prototypeId = choosePrototype(definition, seed, requestedPrototypeId);
  const sourceSeed = `men-002-cp008-permanent:${qlId}:${prototypeId}:${seed}`;
  const source = generateSourcePackage(prototypeId, sourceSeed);
  const explanation = {
    ...source.explanation,
    traps: naturaliseTraps(source.explanation.traps),
  };
  const partial = {
    packageId: "MEN-002" as const,
    canonicalProblemId: "MEN-CP-008" as const,
    permanentQlId: definition.qlId,
    templateId: definition.templateId,
    candidateId: definition.candidateId,
    canonicalKey: definition.canonicalKey,
    prototypeId,
    prototypeAncestries: definition.prototypeIds,
    solveMode: source.solveMode,
    language: "en" as const,
    seed,
    sourceSeed,
    difficulty: source.difficulty,
    target: source.target,
    piPolicy: source.piPolicy,
    stem: source.stem,
    options: source.options,
    correctIndex: source.correctIndex,
    answer: source.answer,
    exactAnswer: source.exactAnswer,
    unit: source.unit,
    explanation,
    state: { ...source.state, permanentQlId: definition.qlId, seed },
    sourceState: source.state,
    verification: source.verification,
    sourceValidation: source.validation,
    maturity: "IMPLEMENTATION_PROOF" as const,
    allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF" as const,
    permanentIdentityFrozen: true as const,
    reviewStatus: "ENGLISH_IMPLEMENTATION_FROZEN" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
  };
  return { ...partial, validation: validatePermanentQuestion(partial) };
}
