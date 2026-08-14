import { generateMenCp010Question } from "../../cp010-foundation/runtime";
import {
  generateMenCp010DiscoveryV2Probe,
  type MenCp010DiscoveryCandidateId,
} from "../../cp010-foundation/discovery-v2";
import { generateMenCp010SaturationV3Probe } from "../../cp010-foundation/saturation-v3";
import type { MenCp010PrototypeId } from "../../cp010-foundation/types";
import type { MenCp010CanonicalClusterId } from "../../cp010-foundation/merge-split-v4";
import {
  MEN_CP_010_PERMANENT_ALLOCATION,
  getMenCp010PermanentAllocation,
  type MenCp010PermanentQlId,
} from "./allocation";

export const MEN_CP_010_PERMANENT_ENGLISH_RUNTIME_AUTHORITY =
  "MEN-CP010-PERMANENT-ENGLISH-RUNTIME-V1-CANDIDATE" as const;

type Source =
  | { readonly kind: "WAVE01"; readonly id: MenCp010PrototypeId }
  | { readonly kind: "WAVE02"; readonly id: MenCp010DiscoveryCandidateId }
  | { readonly kind: "WAVE03"; readonly id: string };

type Label = "A" | "B" | "C" | "D";

export interface MenCp010PermanentEnglishQuestion {
  readonly authority: typeof MEN_CP_010_PERMANENT_ENGLISH_RUNTIME_AUTHORITY;
  readonly packageId: "MEN-002";
  readonly canonicalProblemId: "MEN-CP-010";
  readonly permanentQlId: MenCp010PermanentQlId;
  readonly templateId: string;
  readonly solveModeId: string;
  readonly clusterId: MenCp010CanonicalClusterId;
  readonly title: string;
  readonly language: "en";
  readonly seed: string;
  readonly sourceWave: Source["kind"];
  readonly sourceId: string;
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
  readonly allocationStatus: "PERMANENT_QL_ALLOCATED";
  readonly reviewStatus: "AWAITING_HUMAN_ENGLISH_REVIEW";
  readonly englishImplementationFrozen: false;
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

const W1 = (id: MenCp010PrototypeId): Source => ({ kind: "WAVE01", id });
const W2 = (id: string): Source => ({ kind: "WAVE02", id: id as MenCp010DiscoveryCandidateId });
const W3 = (id: string): Source => ({ kind: "WAVE03", id });

/**
 * Each permanent family routes to one or more already-proved mathematical
 * generators. Multiple sources are representations of one reasoning contract,
 * not separate permanent QLs.
 */
const SOURCE_POOLS: Readonly<Record<MenCp010CanonicalClusterId, readonly Source[]>> = {
  PYRAMID_VOLUME_DIRECT: [
    W1("MEN-CP010-PROT-SQUARE-PYRAMID-VOLUME"),
    W1("MEN-CP010-PROT-RECTANGULAR-PYRAMID-VOLUME"),
    W1("MEN-CP010-PROT-TRIANGULAR-PYRAMID-VOLUME"),
  ],
  PYRAMID_VOLUME_INVERSE_HEIGHT: [W1("MEN-CP010-PROT-SQUARE-PYRAMID-HEIGHT-FROM-VOLUME")],
  RIGHT_PYRAMID_FRUSTUM_PYTHAGOREAN_DIRECT: [
    W1("MEN-CP010-PROT-SQUARE-PYRAMID-SLANT-HEIGHT"),
    W1("MEN-CP010-PROT-CONICAL-FRUSTUM-SLANT-HEIGHT"),
    W1("MEN-CP010-PROT-SQUARE-FRUSTUM-SLANT-HEIGHT"),
    W3("V3-SURD-SLANT-REPRESENTATION"),
  ],
  RIGHT_PYRAMID_FRUSTUM_PYTHAGOREAN_INVERSE: [
    W1("MEN-CP010-PROT-SQUARE-PYRAMID-VERTICAL-HEIGHT"),
    W2("CP010-D2-INV-CONICAL-FRUSTUM-OUTER-RADIUS"),
    W2("CP010-D2-INV-SQUARE-FRUSTUM-LOWER-SIDE"),
  ],
  PYRAMID_SURFACE_DIRECT: [
    W1("MEN-CP010-PROT-SQUARE-PYRAMID-LSA"),
    W1("MEN-CP010-PROT-SQUARE-PYRAMID-TSA"),
    W3("V3-REGULAR-PYRAMID-LSA"),
    W3("V3-REGULAR-PYRAMID-TSA"),
  ],
  CONICAL_FRUSTUM_VOLUME_DIRECT: [W1("MEN-CP010-PROT-CONICAL-FRUSTUM-VOLUME")],
  CONICAL_FRUSTUM_SURFACE_DIRECT: [
    W1("MEN-CP010-PROT-CONICAL-FRUSTUM-CSA"),
    W1("MEN-CP010-PROT-CONICAL-FRUSTUM-TSA"),
  ],
  POLYGONAL_FRUSTUM_VOLUME_DIRECT: [
    W1("MEN-CP010-PROT-SQUARE-FRUSTUM-VOLUME"),
    W3("V3-REGULAR-FRUSTUM-VOLUME"),
  ],
  POLYGONAL_FRUSTUM_SURFACE_DIRECT: [
    W1("MEN-CP010-PROT-SQUARE-FRUSTUM-LSA"),
    W1("MEN-CP010-PROT-SQUARE-FRUSTUM-TSA"),
    W3("V3-REGULAR-FRUSTUM-LSA"),
  ],
  PYRAMID_VOLUME_INVERSE_BASE: [
    W2("CP010-D2-INV-SQUARE-PYRAMID-SIDE-FROM-VOLUME"),
    W2("CP010-D2-INV-RECT-PYRAMID-LENGTH-FROM-VOLUME"),
  ],
  CONICAL_FRUSTUM_VOLUME_INVERSE_HEIGHT: [W2("CP010-D2-INV-CONICAL-FRUSTUM-HEIGHT-FROM-VOLUME")],
  POLYGONAL_FRUSTUM_VOLUME_INVERSE_HEIGHT: [W2("CP010-D2-INV-SQUARE-FRUSTUM-HEIGHT-FROM-VOLUME")],
  SIMILAR_SOLID_VOLUME_RATIO: [W2("CP010-D2-RATIO-VOLUME-FROM-LINEAR")],
  SIMILAR_SOLID_AREA_RATIO: [W2("CP010-D2-RATIO-AREA-FROM-LINEAR")],
  SIMILAR_SOLID_VOLUME_RATIO_INVERSE: [W2("CP010-D2-RATIO-LINEAR-FROM-VOLUME")],
  SIMILAR_SOLID_AREA_RATIO_INVERSE: [W2("CP010-D2-RATIO-LINEAR-FROM-AREA")],
  PYRAMID_PRISM_SAME_BASE_HEIGHT_RATIO: [W2("CP010-D2-RATIO-PYRAMID-TO-PRISM")],
  FRUSTUM_SIMILAR_SECTION_HEIGHT: [
    W2("CP010-D2-SIMILAR-FULL-HEIGHT-FROM-FRUSTUM"),
    W2("CP010-D2-SIMILAR-REMOVED-TOP-HEIGHT"),
  ],
  PYRAMID_CROSS_SECTION_SIMILARITY: [W2("CP010-D2-SIMILAR-CROSS-SECTION-SIDE")],
  FRUSTUM_CAPACITY_CONVERSION: [W2("CP010-D2-APP-BUCKET-CAPACITY-LITRES")],
  PYRAMID_FRUSTUM_SURFACE_COST: [W2("CP010-D2-APP-SURFACE-COST")],
  PYRAMID_FRUSTUM_VOLUME_SCALING: [W2("CP010-D2-SCALE-VOLUME-PERCENT-CHANGE")],
  PYRAMID_FRUSTUM_AREA_SCALING: [W2("CP010-D2-SCALE-AREA-PERCENT-CHANGE")],
  PYRAMID_SURFACE_INVERSE: [
    W3("V3-PYRAMID-LSA-INVERSE-SLANT"),
    W3("V3-PYRAMID-TSA-INVERSE-SLANT"),
  ],
  CONICAL_FRUSTUM_SURFACE_INVERSE: [
    W3("V3-CONICAL-FRUSTUM-CSA-INVERSE-SLANT"),
    W3("V3-CONICAL-FRUSTUM-TSA-INVERSE-SLANT"),
  ],
  POLYGONAL_FRUSTUM_SURFACE_INVERSE: [
    W3("V3-POLYGONAL-FRUSTUM-LSA-INVERSE-SLANT"),
    W3("V3-POLYGONAL-FRUSTUM-TSA-INVERSE-SLANT"),
  ],
} as const;

const FORMULA: Readonly<Record<MenCp010CanonicalClusterId, string>> = {
  PYRAMID_VOLUME_DIRECT: "V = Bh/3",
  PYRAMID_VOLUME_INVERSE_HEIGHT: "h = 3V/B",
  RIGHT_PYRAMID_FRUSTUM_PYTHAGOREAN_DIRECT: "l² = h² + (horizontal offset)²",
  RIGHT_PYRAMID_FRUSTUM_PYTHAGOREAN_INVERSE: "(horizontal offset)² = l² - h², or h² = l² - (offset)²",
  PYRAMID_SURFACE_DIRECT: "LSA = Pl/2; TSA = B + Pl/2",
  CONICAL_FRUSTUM_VOLUME_DIRECT: "V = πh(R² + Rr + r²)/3",
  CONICAL_FRUSTUM_SURFACE_DIRECT: "CSA = π(R+r)l; TSA = CSA + πR² + πr²",
  POLYGONAL_FRUSTUM_VOLUME_DIRECT: "V = h(A₁ + √(A₁A₂) + A₂)/3",
  POLYGONAL_FRUSTUM_SURFACE_DIRECT: "LSA = (P₁+P₂)l/2; TSA = LSA + A₁ + A₂",
  PYRAMID_VOLUME_INVERSE_BASE: "B = 3V/h, followed by the required base-dimension recovery",
  CONICAL_FRUSTUM_VOLUME_INVERSE_HEIGHT: "h = 3V/[π(R² + Rr + r²)]",
  POLYGONAL_FRUSTUM_VOLUME_INVERSE_HEIGHT: "h = 3V/[A₁ + √(A₁A₂) + A₂]",
  SIMILAR_SOLID_VOLUME_RATIO: "volume ratio = (linear ratio)³",
  SIMILAR_SOLID_AREA_RATIO: "area ratio = (linear ratio)²",
  SIMILAR_SOLID_VOLUME_RATIO_INVERSE: "linear ratio = cube root of the volume ratio",
  SIMILAR_SOLID_AREA_RATIO_INVERSE: "linear ratio = square root of the area ratio",
  PYRAMID_PRISM_SAME_BASE_HEIGHT_RATIO: "Vpyramid : Vprism = 1 : 3",
  FRUSTUM_SIMILAR_SECTION_HEIGHT: "corresponding linear dimensions are proportional to corresponding heights",
  PYRAMID_CROSS_SECTION_SIMILARITY: "section side/base side = apex-to-section height/full height",
  FRUSTUM_CAPACITY_CONVERSION: "find frustum volume first, then use 1000 cm³ = 1 litre",
  PYRAMID_FRUSTUM_SURFACE_COST: "cost = required exposed surface area × rate per unit area",
  PYRAMID_FRUSTUM_VOLUME_SCALING: "volume scale factor = k³",
  PYRAMID_FRUSTUM_AREA_SCALING: "area scale factor = k²",
  PYRAMID_SURFACE_INVERSE: "remove any base area, then solve l from LSA = Pl/2",
  CONICAL_FRUSTUM_SURFACE_INVERSE: "remove end discs if needed, then solve l from π(R+r)l",
  POLYGONAL_FRUSTUM_SURFACE_INVERSE: "remove both bases if needed, then solve l from (P₁+P₂)l/2",
} as const;

function hash(text: string) {
  let h = 2166136261 >>> 0;
  for (const c of text) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function sourceFor(clusterId: MenCp010CanonicalClusterId, seed: string): Source {
  const pool = SOURCE_POOLS[clusterId];
  return pool[hash(`${clusterId}:${seed}:source`) % pool.length]!;
}

function polishProbeStem(raw: string) {
  return raw
    .replace(/^Square pyramid:/, "For a right square pyramid,")
    .replace(/^Rectangular pyramid:/, "For a right pyramid with a rectangular base,")
    .replace(/^Conical frustum:/, "For a conical frustum,")
    .replace(/^Square frustum:/, "For a right square-pyramid frustum,")
    .replace(/^Regular pyramid:/, "For a regular right pyramid,")
    .replace(/^Regular-polygon frustum:/, "For a regular-polygon frustum,")
    .replace(/^Similar-base frustum:/, "For a frustum with similar parallel bases,")
    .replace(/^Right square pyramid:/, "For a right square pyramid,")
    .replace(/^Two similar pyramids\/frustums/, "Two similar pyramids or frustums")
    .replace(/^Similar solids/, "Two similar solids")
    .replace(/^A pyramid and prism/, "A pyramid and a prism")
    .replace(/^Bucket frustum:/, "A bucket is shaped like a conical frustum with")
    .replace(/^A conical lampshade/, "A lampshade is shaped like a conical frustum and")
    .replace(/\bV=/g, "volume = ")
    .replace(/\bTSA=/g, "TSA = ")
    .replace(/\bCSA=/g, "CSA = ")
    .replace(/\bLSA=/g, "LSA = ")
    .replace(/\bh=/g, "vertical height = ")
    .replace(/\bl=/g, "slant height = ")
    .replace(/\bR=/g, "larger radius = ")
    .replace(/\br=/g, "smaller radius = ")
    .replace(/\bFind L\./g, "Find the missing base length.")
    .replace(/\bFind h\./g, "Find the vertical height.")
    .replace(/\bFind R\./g, "Find the larger radius.")
    .replace(/\bFind LSA\./g, "Find the lateral surface area.")
    .replace(/\bFind TSA\./g, "Find the total surface area.")
    .replace(/\s+/g, " ")
    .trim();
}

function teaching(
  clusterId: MenCp010CanonicalClusterId,
  governingInference: string,
  answer: string,
): MenCp010PermanentEnglishQuestion["explanation"] {
  const f = FORMULA[clusterId];
  const similarity = clusterId.includes("SIMILAR") || clusterId.includes("SCALING") || clusterId.includes("RATIO");
  return {
    keyRule: governingInference,
    steps: [
      {
        title: "Identify the target",
        body: "Separate the given vertical, slant, base and corresponding dimensions before choosing a formula.",
      },
      {
        title: "Choose the governing relation",
        body: `Use ${f}.`,
      },
      {
        title: "Substitute consistently",
        body: similarity
          ? "Apply the same correspondence order throughout the ratio and use the correct square or cube scaling law."
          : "Substitute only matching geometric quantities; do not interchange vertical height and slant height.",
      },
      {
        title: "Solve exactly",
        body: "Simplify before decimal approximation. Preserve exact ratios, fractions, roots or π when the state requires them.",
      },
      {
        title: "Check the result",
        body: `Substitute the result back into the governing relation. The required answer is ${answer}.`,
      },
    ],
    shortcut: similarity
      ? "For similar solids: lengths scale as k, areas as k² and volumes as k³."
      : "Sketch or mentally mark the vertical height, slant height and corresponding base dimensions before calculating.",
    traps: [
      "Do not confuse vertical height with slant height.",
      clusterId.includes("VOLUME")
        ? "Do not omit the one-third factor or the mixed frustum term."
        : "Include only the surfaces or dimensions requested by the question.",
    ],
  };
}

function normalizeSource(source: Source, seed: string) {
  if (source.kind === "WAVE01") {
    const q = generateMenCp010Question(source.id, seed);
    return {
      stem: q.stem,
      options: q.options.map((o) => ({
        label: o.label,
        display: o.display,
        isCorrect: o.isCorrect,
        misconceptionId: o.misconceptionId,
      })),
      correctIndex: q.correctIndex,
      answer: q.answer,
      explanation: q.explanation,
      verification: { valid: q.verification.valid, method: q.verification.method },
    };
  }
  if (source.kind === "WAVE02") {
    const q = generateMenCp010DiscoveryV2Probe(source.id, seed);
    return {
      stem: polishProbeStem(q.stem),
      options: q.options.map((o, index) => ({
        label: o.label,
        display: o.value,
        isCorrect: o.isCorrect,
        misconceptionId: o.isCorrect ? null : `WAVE02_DISTRACTOR_${index + 1}`,
      })),
      correctIndex: q.correctIndex,
      answer: q.answer,
      explanation: null,
      verification: { valid: q.verification.valid, method: q.verification.method },
    };
  }
  const q = generateMenCp010SaturationV3Probe(source.id, seed);
  return {
    stem: polishProbeStem(q.stem),
    options: q.options.map((o, index) => ({
      label: o.label,
      display: o.value,
      isCorrect: o.isCorrect,
      misconceptionId: o.isCorrect ? null : `WAVE03_DISTRACTOR_${index + 1}`,
    })),
    correctIndex: q.correctIndex,
    answer: q.answer,
    explanation: null,
    verification: { valid: q.verification.valid, method: q.verification.method },
  };
}

export function generateMenCp010PermanentEnglishQuestion(
  qlId: MenCp010PermanentQlId,
  seed: string,
): MenCp010PermanentEnglishQuestion {
  const allocation = getMenCp010PermanentAllocation(qlId);
  const source = sourceFor(allocation.clusterId, seed);
  const normalized = normalizeSource(source, `${qlId}:${seed}`);
  const explanation = normalized.explanation ?? teaching(
    allocation.clusterId,
    allocation.governingInference,
    normalized.answer,
  );
  const uniqueOptions = new Set(normalized.options.map((o) => o.display)).size === 4;
  const oneCorrect = normalized.options.filter((o) => o.isCorrect).length === 1;
  const answerParity = normalized.correctIndex >= 0 && normalized.options[normalized.correctIndex]?.isCorrect === true;
  if (!normalized.verification.valid || !uniqueOptions || !oneCorrect || !answerParity) {
    throw new Error(
      `MEN-CP-010 permanent English runtime validation failed for ${qlId}/${seed}/${source.kind}/${source.id}`,
    );
  }
  return {
    authority: MEN_CP_010_PERMANENT_ENGLISH_RUNTIME_AUTHORITY,
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-010",
    permanentQlId: allocation.qlId,
    templateId: allocation.templateId,
    solveModeId: allocation.solveModeId,
    clusterId: allocation.clusterId,
    title: allocation.title,
    language: "en",
    seed,
    sourceWave: source.kind,
    sourceId: source.id,
    stem: normalized.stem,
    options: normalized.options,
    correctIndex: normalized.correctIndex,
    answer: normalized.answer,
    explanation,
    verification: normalized.verification,
    maturity: "PERMANENT_ENGLISH_RUNTIME_CANDIDATE",
    allocationStatus: "PERMANENT_QL_ALLOCATED",
    reviewStatus: "AWAITING_HUMAN_ENGLISH_REVIEW",
    englishImplementationFrozen: false,
    active: false,
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  };
}

export function listMenCp010PermanentEnglishSources() {
  return MEN_CP_010_PERMANENT_ALLOCATION.map((allocation) => ({
    qlId: allocation.qlId,
    clusterId: allocation.clusterId,
    sources: SOURCE_POOLS[allocation.clusterId],
  }));
}
