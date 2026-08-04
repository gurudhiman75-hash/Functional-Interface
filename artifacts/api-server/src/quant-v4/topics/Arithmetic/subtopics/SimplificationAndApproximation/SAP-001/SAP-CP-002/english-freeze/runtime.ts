import { generateSapCp002Wave01Package } from "../wave01/runtime";
import type { SapCp002Wave01Package } from "../wave01/types";
import { generateSapCp002CompletionPackage } from "../completion/final-runtime";
import type { SapCp002CompletionPackage } from "../completion/types";
import {
  SAP_CP002_ALL_PROTOTYPE_IDS,
  SAP_CP002_TEMPLATE_MAP,
  type SapCp002EnglishTemplateId,
  type SapCp002PrototypeId,
} from "../SAP-CP-002-AUTHORITY-AND-TEMPLATE-MAP";

export type SapCp002DiscoveryPackage = SapCp002Wave01Package | SapCp002CompletionPackage;

export interface SapCp002EnglishFrozenCandidate {
  readonly packageId: "SAP-001";
  readonly checkpointId: "SAP-CP-002";
  readonly temporaryPrototypeId: SapCp002PrototypeId;
  readonly templateId: SapCp002EnglishTemplateId;
  readonly permanentQlId: null;
  readonly locale: "en-IN";
  readonly seed: number;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly taskDirection: string;
  readonly answerSemantic: string;
  readonly stemFrameId: string;
  readonly stem: string;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly options: readonly { readonly value: string; readonly isCorrect: boolean; readonly misconceptionId: string | null; readonly analysis: string }[];
  readonly correctIndex: number;
  readonly explanation: {
    readonly coreConcept: string;
    readonly givenDataAndStrategy: string;
    readonly stepByStep: readonly string[];
    readonly examSpeedMethod: string;
    readonly commonTraps: readonly string[];
    readonly finalAnswer: string;
  };
  readonly mathematicalFingerprint: string;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly editorialStatus: "ENGLISH_MANUAL_FREEZE_APPROVED";
  readonly reviewDecision: "APPROVED_FOR_PERMANENT_IDENTITY";
  readonly lifecycle: {
    readonly permanentQlId: null;
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

function discoveryPackage(prototypeId: SapCp002PrototypeId, seed: number): SapCp002DiscoveryPackage {
  if (prototypeId.startsWith("SAP-CP002-PROT-") && [
    "SAP-CP002-PROT-FRACTION-SUM-DIFFERENCE",
    "SAP-CP002-PROT-FRACTION-PRODUCT-CANCELLATION",
    "SAP-CP002-PROT-FRACTION-DIVISION-RECIPROCAL",
    "SAP-CP002-PROT-MIXED-FRACTION-OPERATION-CHAIN",
    "SAP-CP002-PROT-MIXED-NUMBERS-CONVERT-EVALUATE",
    "SAP-CP002-PROT-FRACTION-OF-FRACTION",
    "SAP-CP002-PROT-NESTED-COMPLEX-FRACTION",
    "SAP-CP002-PROT-SIGNED-FRACTION-BRACKETS",
  ].includes(prototypeId)) {
    return generateSapCp002Wave01Package(prototypeId as Parameters<typeof generateSapCp002Wave01Package>[0], seed);
  }
  return generateSapCp002CompletionPackage(prototypeId as Parameters<typeof generateSapCp002CompletionPackage>[0], seed);
}

function frozenStem(pkg: SapCp002DiscoveryPackage): { stemFrameId: string; stem: string } {
  const frame = (pkg.seed - 1) % 4;
  const direction = pkg.taskDirection;
  const expression = pkg.renderedExpression;
  if (direction === "FORWARD") {
    const frames = [
      `Simplify the following expression and give the answer in lowest terms: ${expression}`,
      `What is the exact value of ${expression}? Give the answer in lowest terms.`,
      `Evaluate ${expression} using the correct fraction operations.`,
      `Find the simplified value of the following fraction expression: ${expression}`,
    ] as const;
    return { stemFrameId: `SAP-CP002-FORWARD-${frame + 1}`, stem: frames[frame]! };
  }
  if (direction === "INVERSE") {
    const frames = [
      `Find the value of the blank: ${expression}`,
      `Which value makes the following fraction equality true? ${expression}`,
      `Determine the missing value in ${expression}`,
      `Complete the exact fraction equality: ${expression}`,
    ] as const;
    return { stemFrameId: `SAP-CP002-INVERSE-${frame + 1}`, stem: frames[frame]! };
  }
  if (direction === "COMPARISON") {
    return { stemFrameId: `SAP-CP002-COMPARISON-${frame + 1}`, stem: expression };
  }
  if (direction === "SELECTION") {
    const frames = [
      `Evaluate ${expression} and select the equivalent fraction in lowest terms.`,
      `Which option is the reduced value of ${expression}?`,
      `Find the exact value of ${expression} and choose its lowest-term form.`,
      `Select the fraction in lowest terms that is equal to ${expression}.`,
    ] as const;
    return { stemFrameId: `SAP-CP002-SELECTION-${frame + 1}`, stem: frames[frame]! };
  }
  const frames = [
    `Identify the first incorrect step in the worked solution below.\n${expression}`,
    `At which step does the fraction simplification first become incorrect?\n${expression}`,
    `Review the solution and choose the earliest invalid step.\n${expression}`,
    `Which is the first step that changes the value of the expression?\n${expression}`,
  ] as const;
  return { stemFrameId: `SAP-CP002-DIAGNOSIS-${frame + 1}`, stem: frames[frame]! };
}

export function generateSapCp002EnglishFrozenCandidate(
  prototypeId: SapCp002PrototypeId,
  seed: number,
): SapCp002EnglishFrozenCandidate {
  const pkg = discoveryPackage(prototypeId, seed);
  if (!pkg.validation.ok) throw new Error(`${prototypeId} seed ${seed} failed discovery validation: ${pkg.validation.errors.join("; ")}`);
  const stem = frozenStem(pkg);
  return Object.freeze({
    packageId: "SAP-001",
    checkpointId: "SAP-CP-002",
    temporaryPrototypeId: prototypeId,
    templateId: SAP_CP002_TEMPLATE_MAP[prototypeId],
    permanentQlId: null,
    locale: "en-IN",
    seed,
    difficulty: pkg.difficulty,
    taskDirection: pkg.taskDirection,
    answerSemantic: pkg.answerSemantic,
    stemFrameId: stem.stemFrameId,
    stem: stem.stem,
    canonicalAnswer: pkg.canonicalAnswer,
    verifierAnswer: pkg.verifierAnswer,
    options: pkg.options,
    correctIndex: pkg.correctIndex,
    explanation: pkg.explanation,
    mathematicalFingerprint: pkg.mathematicalFingerprint,
    sourceAncestry: pkg.sourceAncestry,
    prototypeAncestry: pkg.prototypeAncestry,
    editorialStatus: "ENGLISH_MANUAL_FREEZE_APPROVED",
    reviewDecision: "APPROVED_FOR_PERMANENT_IDENTITY",
    lifecycle: Object.freeze({
      permanentQlId: null,
      active: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    }),
  });
}

export function generateSapCp002EnglishFrozenSweep(seedsPerPrototype: number): readonly SapCp002EnglishFrozenCandidate[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) throw new Error("Sweep size must be a positive integer.");
  const items: SapCp002EnglishFrozenCandidate[] = [];
  for (const prototypeId of SAP_CP002_ALL_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) items.push(generateSapCp002EnglishFrozenCandidate(prototypeId, seed));
  }
  return Object.freeze(items);
}

export function generateSapCp002EnglishReviewExport(): readonly SapCp002EnglishFrozenCandidate[] {
  const items: SapCp002EnglishFrozenCandidate[] = [];
  for (const prototypeId of SAP_CP002_ALL_PROTOTYPE_IDS) {
    items.push(generateSapCp002EnglishFrozenCandidate(prototypeId, 1));
    items.push(generateSapCp002EnglishFrozenCandidate(prototypeId, 2));
    items.push(generateSapCp002EnglishFrozenCandidate(prototypeId, 3));
  }
  return Object.freeze(items);
}
