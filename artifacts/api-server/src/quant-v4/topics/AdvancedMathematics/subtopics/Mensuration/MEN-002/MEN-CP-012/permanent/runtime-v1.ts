import {
  MEN_CP_012_PRESENTATION_V2_AUTHORITY,
  generateMenCp012QuestionV2,
} from "../../cp012-foundation/presentation-v2";
import type { MenCp012PrototypeId } from "../../cp012-foundation/types";
import {
  type MenCp012DiscoveryV2Id,
} from "../../cp012-foundation/discovery-v2";
import {
  MEN_CP_012_DISCOVERY_V2_SAFE_RUNTIME_AUTHORITY,
  generateMenCp012DiscoveryV2Safe,
} from "../../cp012-foundation/discovery-v2-runtime-safe";
import type { MenCp012SaturationV3Id } from "../../cp012-foundation/saturation-v3";
import {
  MEN_CP_012_SATURATION_V3_SAFE_AUTHORITY,
  generateMenCp012SaturationV3Safe,
} from "../../cp012-foundation/saturation-v3-safe";
import {
  MEN_CP_012_SOURCE_CORRECTIONS_V4_AUTHORITY,
  generateMenCp012CorrectedConeRatioV4,
} from "../../cp012-foundation/source-corrections-v4";
import type { MenCp012CanonicalClusterId } from "../../cp012-foundation/merge-split-v4";
import {
  MEN_CP_012_PERMANENT_ALLOCATION,
  getMenCp012PermanentAllocation,
  type MenCp012PermanentQlId,
} from "./allocation";

export const MEN_CP_012_PERMANENT_ENGLISH_RUNTIME_AUTHORITY =
  "MEN-CP012-PERMANENT-ENGLISH-RUNTIME-V1-CANDIDATE" as const;

type Label = "A" | "B" | "C" | "D";
export type MenCp012PermanentSourceKind = "WAVE01" | "WAVE02" | "WAVE03" | "V4_CORRECTION";

export interface MenCp012PermanentSource {
  readonly kind: MenCp012PermanentSourceKind;
  readonly id: string;
}

export interface MenCp012PermanentEnglishQuestion {
  readonly authority: typeof MEN_CP_012_PERMANENT_ENGLISH_RUNTIME_AUTHORITY;
  readonly packageId: "MEN-002";
  readonly canonicalProblemId: "MEN-CP-012";
  readonly permanentQlId: MenCp012PermanentQlId;
  readonly templateId: string;
  readonly solveModeId: string;
  readonly clusterId: MenCp012CanonicalClusterId;
  readonly title: string;
  readonly language: "en";
  readonly seed: string;
  readonly sourceKind: MenCp012PermanentSourceKind;
  readonly sourceId: string;
  readonly sourceAuthority: string;
  readonly stem: string;
  readonly options: readonly {
    readonly label: Label;
    readonly display: string;
    readonly isCorrect: boolean;
    readonly misconceptionId: string | null;
  }[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly explanation: {
    readonly keyRule: string;
    readonly steps: readonly { readonly title: string; readonly body: string }[];
    readonly shortcut: string;
    readonly traps: readonly string[];
  };
  readonly verification: {
    readonly valid: boolean;
    readonly method: string;
  };
  readonly maturity: "PERMANENT_ENGLISH_RUNTIME_CANDIDATE";
  readonly reviewStatus: "AWAITING_HUMAN_ENGLISH_REVIEW";
  readonly englishImplementationFrozen: false;
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

function classifySource(id: string): MenCp012PermanentSource {
  if (id === "V3-SPHERE-TO-CONE-DIAMETER-HEIGHT-RATIO") return { kind: "V4_CORRECTION", id };
  if (id.startsWith("MEN-CP012-PROT-")) return { kind: "WAVE01", id };
  if (id.startsWith("CP012-D2-")) return { kind: "WAVE02", id };
  if (id.startsWith("V3-")) return { kind: "WAVE03", id };
  throw new Error(`Unknown MEN-CP-012 permanent source ID: ${id}`);
}

const SOURCE_POOLS: Readonly<Record<MenCp012CanonicalClusterId, readonly MenCp012PermanentSource[]>> =
  Object.fromEntries(
    MEN_CP_012_PERMANENT_ALLOCATION.map((allocation) => [
      allocation.clusterId,
      [...allocation.coreEvidenceIds, ...allocation.representationEvidenceIds].map(classifySource),
    ]),
  ) as Readonly<Record<MenCp012CanonicalClusterId, readonly MenCp012PermanentSource[]>>;

const TEACHING: Readonly<Record<MenCp012CanonicalClusterId, { shortcut: string; traps: readonly [string, string] }>> = {
  RECAST_COUNT_DIRECT: {
    shortcut: "Write total usable material volume first, then divide by the volume of one target unit.",
    traps: ["Do not use a linear or surface-area ratio for a three-dimensional count.", "Keep source and target direction correct when forming the volume quotient."],
  },
  RECAST_LINEAR_DIMENSION_DIRECT: {
    shortcut: "Cancel common constants such as π before isolating the first-power target height or length.",
    traps: ["Use the volume formula of both source and target solids before rearranging.", "Do not introduce a square or cube root when the unknown occurs only to the first power."],
  },
  RECAST_SQUARE_ROOT_DIMENSION_INVERSE: {
    shortcut: "Isolate the squared target dimension completely, then take the positive square root once.",
    traps: ["Do not stop after finding the squared radius or diameter.", "If the final question asks diameter or a ratio, convert the recovered radius only after the square-root step."],
  },
  RECAST_CUBE_ROOT_DIMENSION_INVERSE: {
    shortcut: "Cancel common shape constants, isolate x³, then take the positive cube root.",
    traps: ["Do not add source radii or sides when volumes are being combined.", "Use a cube root for a sphere/cube linear dimension, not a square root."],
  },
  DRAWING_ROLLING_LENGTH_DIRECT: {
    shortcut: "For unchanged material, cross-sectional area × length stays constant; cancel unchanged width where possible.",
    traps: ["A wire radius enters as r², not r.", "Convert the final length unit only after the conservation equation is dimensionally consistent."],
  },
  DRAWING_ROLLING_CROSS_SECTION_INVERSE: {
    shortcut: "Find the required final cross-sectional area from volume/length, then recover radius or thickness.",
    traps: ["Circular cross-section requires a square-root radius recovery.", "For a plate, thickness is linear once width and length are accounted for."],
  },
  COMBINED_SOURCE_RECAST: {
    shortcut: "Add the volumes of all source solids first; only then solve the single target equation.",
    traps: ["Do not add or average source radii instead of their volumes.", "Include every source solid before taking any required root for the target."],
  },
  LOSS_AWARE_RECAST_GIVEN: {
    shortcut: "Convert loss to retained percentage first, then apply that retained fraction to source material volume.",
    traps: ["Use 100% minus loss%, not the loss percentage itself, as usable material.", "Apply wastage to material volume—not directly to a side, radius or height."],
  },
  LOSS_YIELD_PERCENT_UNKNOWN: {
    shortcut: "Compare actual target material with the no-loss source material; yield and loss are complementary percentages.",
    traps: ["Keep the denominator as the original source material when computing yield/loss.", "If yield is found first, subtract from 100 only when the question asks loss."],
  },
  HOLLOW_SOURCE_MATERIAL_RECAST: {
    shortcut: "Find material volume as outer volume minus inner hollow volume, then recast that material normally.",
    traps: ["The empty core contributes no material.", "Do not use surface area of the shell in a melting/recasting conservation equation."],
  },
  HOLLOW_TARGET_LENGTH_DIRECT: {
    shortcut: "Use shell material area π(R²−r²) times length, then isolate length directly.",
    traps: ["Use R²−r², not (R−r)², for annular cross-sectional area.", "Both outer and inner radii must be in the same unit before solving length."],
  },
  HOLLOW_TARGET_THICKNESS_INVERSE: {
    shortcut: "Recover inner radius from the shell-volume equation first, then thickness = outer radius − inner radius.",
    traps: ["Do not treat wall thickness itself as the inner radius.", "The square root is needed to recover inner radius before subtracting from the outer radius."],
  },
  RECAST_THEN_SECONDARY_MEASURE: {
    shortcut: "Complete the volume-conservation step first; calculate the requested secondary surface measure only afterward.",
    traps: ["Surface area is not conserved during recasting.", "Use the new dimension obtained from volume conservation when computing the second-stage measure."],
  },
} as const;

function hash(text: string) {
  let value = 2166136261 >>> 0;
  for (const char of text) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619) >>> 0;
  }
  return value >>> 0;
}

function sourceFor(clusterId: MenCp012CanonicalClusterId, seed: string) {
  const pool = SOURCE_POOLS[clusterId];
  return pool[hash(`${clusterId}:${seed}:source`) % pool.length]!;
}

function normalizeOptions(sourceId: string, options: readonly { label: Label; display: string; isCorrect: boolean; misconceptionId?: string | null }[]) {
  let wrongIndex = 0;
  return options.map((option) => ({
    label: option.label,
    display: option.display,
    isCorrect: option.isCorrect,
    misconceptionId: option.isCorrect
      ? null
      : option.misconceptionId ?? `${sourceId}-DISTRACTOR-${++wrongIndex}`,
  }));
}

function generateSource(source: MenCp012PermanentSource, seed: string) {
  if (source.kind === "WAVE01") {
    const q = generateMenCp012QuestionV2(source.id as MenCp012PrototypeId, seed);
    return {
      sourceAuthority: MEN_CP_012_PRESENTATION_V2_AUTHORITY,
      stem: q.stem,
      options: normalizeOptions(source.id, q.options),
      correctIndex: q.correctIndex,
      answer: q.answer,
      steps: q.explanation.steps,
      sourceTraps: q.explanation.traps,
      verification: { valid: q.verification.valid, method: q.verification.method },
    };
  }
  if (source.kind === "WAVE02") {
    const q = generateMenCp012DiscoveryV2Safe(source.id as MenCp012DiscoveryV2Id, seed);
    return {
      sourceAuthority: MEN_CP_012_DISCOVERY_V2_SAFE_RUNTIME_AUTHORITY,
      stem: q.stem,
      options: normalizeOptions(source.id, q.options),
      correctIndex: q.correctIndex,
      answer: q.answer,
      steps: q.explanation.steps,
      sourceTraps: q.explanation.traps,
      verification: q.verification,
    };
  }
  if (source.kind === "WAVE03") {
    const q = generateMenCp012SaturationV3Safe(source.id as MenCp012SaturationV3Id, seed);
    return {
      sourceAuthority: MEN_CP_012_SATURATION_V3_SAFE_AUTHORITY,
      stem: q.stem,
      options: normalizeOptions(source.id, q.options),
      correctIndex: q.correctIndex,
      answer: q.answer,
      steps: q.explanation.steps,
      sourceTraps: q.explanation.traps,
      verification: q.verification,
    };
  }
  const q = generateMenCp012CorrectedConeRatioV4(seed);
  return {
    sourceAuthority: MEN_CP_012_SOURCE_CORRECTIONS_V4_AUTHORITY,
    stem: q.stem,
    options: normalizeOptions(source.id, q.options),
    correctIndex: q.correctIndex,
    answer: q.answer,
    steps: q.explanation.steps,
    sourceTraps: q.explanation.traps,
    verification: q.verification,
  };
}

function buildQuestion(
  qlId: MenCp012PermanentQlId,
  seed: string,
  forcedSource?: MenCp012PermanentSource,
): MenCp012PermanentEnglishQuestion {
  const allocation = getMenCp012PermanentAllocation(qlId);
  const source = forcedSource ?? sourceFor(allocation.clusterId, seed);
  const generated = generateSource(source, seed);
  const teaching = TEACHING[allocation.clusterId];
  const traps = [...new Set([...generated.sourceTraps, ...teaching.traps])].slice(0, 4);

  const question: MenCp012PermanentEnglishQuestion = {
    authority: MEN_CP_012_PERMANENT_ENGLISH_RUNTIME_AUTHORITY,
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-012",
    permanentQlId: qlId,
    templateId: allocation.templateId,
    solveModeId: allocation.solveModeId,
    clusterId: allocation.clusterId,
    title: allocation.title,
    language: "en",
    seed,
    sourceKind: source.kind,
    sourceId: source.id,
    sourceAuthority: generated.sourceAuthority,
    stem: generated.stem,
    options: generated.options,
    correctIndex: generated.correctIndex,
    answer: generated.answer,
    explanation: {
      keyRule: allocation.governingInference,
      steps: generated.steps,
      shortcut: teaching.shortcut,
      traps,
    },
    verification: generated.verification,
    maturity: "PERMANENT_ENGLISH_RUNTIME_CANDIDATE",
    reviewStatus: "AWAITING_HUMAN_ENGLISH_REVIEW",
    englishImplementationFrozen: false,
    active: false,
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  };

  if (!question.verification.valid) throw new Error(`${qlId}/${seed}: source verification failed.`);
  if (question.options.length !== 4 || new Set(question.options.map((option) => option.display)).size !== 4) {
    throw new Error(`${qlId}/${seed}: permanent option contract failed.`);
  }
  if (question.options.filter((option) => option.isCorrect).length !== 1 || question.options[question.correctIndex]?.display !== question.answer) {
    throw new Error(`${qlId}/${seed}: permanent answer-position parity failed.`);
  }
  return question;
}

export function generateMenCp012PermanentEnglishQuestion(qlId: MenCp012PermanentQlId, seed: string) {
  return buildQuestion(qlId, seed);
}

export function generateMenCp012PermanentEnglishQuestionFromSource(
  qlId: MenCp012PermanentQlId,
  sourceId: string,
  seed: string,
) {
  const allocation = getMenCp012PermanentAllocation(qlId);
  const source = SOURCE_POOLS[allocation.clusterId].find((row) => row.id === sourceId);
  if (!source) throw new Error(`${sourceId} does not belong to ${qlId}/${allocation.clusterId}.`);
  return buildQuestion(qlId, seed, source);
}

export function listMenCp012PermanentEnglishSources() {
  return MEN_CP_012_PERMANENT_ALLOCATION.map((allocation) => ({
    qlId: allocation.qlId,
    clusterId: allocation.clusterId,
    sources: SOURCE_POOLS[allocation.clusterId],
  }));
}
