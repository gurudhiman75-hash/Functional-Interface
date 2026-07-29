import {
  CLS_CP002_PERMANENT_CONTRACT,
  CLS_CP002_QL_ID,
  type ClsCp002QlId,
  type ClsCp002SolveContractId,
} from "./cp002-permanent-contract";
import { polishClsCp002EnglishQuestion } from "./cp002-english-editorial";
import { generateClsCp002MultilingualSafePrototype } from "./cp002-safe-source-runtime";
import {
  CLS_CP002_FALSE_PAIR_SAFE_RELATION_IDS,
} from "./relation-registry";
import {
  canonicalizeClsCp002StudentPair,
  localizeClsCp002StudentPair,
} from "./localization/cp002-student-presentation";
import type {
  ClsCp002PrototypeId,
  GeneratedClsCp002Question,
} from "./types";

type PrototypeMetadata = GeneratedClsCp002Question["metadata"];

export type ClsCp002FrozenLifecycle = {
  readonly permanentQlId: ClsCp002QlId;
  readonly reviewStatus: "FROZEN_MULTILINGUAL_RUNTIME_PROOF";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
  readonly questionStudioDiscoverable: false;
};

export type GeneratedClsCp002EnglishQuestion = Omit<
  GeneratedClsCp002Question,
  "prototypeId" | "seed" | "metadata" | "lifecycle"
> & {
  readonly qlId: ClsCp002QlId;
  readonly permanentQlId: ClsCp002QlId;
  readonly seed: number;
  readonly reviewOnly: true;
  readonly questionStudioVisible: false;
  readonly metadata: Omit<PrototypeMetadata, "locale" | "runtimeVersion"> & {
    readonly locale: "en-IN";
    readonly runtimeVersion: "cls-cp002-permanent-runtime-v1";
    readonly sourcePrototypeId: ClsCp002PrototypeId;
    readonly sourcePrototypeSeed: number;
    readonly solveContractId: ClsCp002SolveContractId;
  };
  readonly lifecycle: ClsCp002FrozenLifecycle;
};

const SOURCE_SEED_STRIDE = 64;
const MAX_PRESENTATION_SAFE_ATTEMPTS = SOURCE_SEED_STRIDE;

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function selectPrototypeId(seed: number): ClsCp002PrototypeId {
  const prototypes = CLS_CP002_PERMANENT_CONTRACT.allowedPrototypeIds;
  return prototypes[hashText(`${CLS_CP002_QL_ID}:${seed}`) % prototypes.length]!;
}

function optionCountForSeed(seed: number): 4 | 5 {
  return hashText(`${CLS_CP002_QL_ID}:option-count:${seed}`) % 4 === 0 ? 5 : 4;
}

function sourceSeedBase(seed: number, prototypeIndex: number, prototypeCount: number): number {
  const maximumBase = Math.floor(
    (Number.MAX_SAFE_INTEGER - (SOURCE_SEED_STRIDE - 1)) / SOURCE_SEED_STRIDE,
  );
  const maximumSeed = Math.floor((maximumBase - prototypeIndex) / prototypeCount);
  if (seed > maximumSeed) {
    throw new Error(`Seed ${seed} is too large for CLS-CP-002 permanent runtime expansion`);
  }
  return (seed * prototypeCount + prototypeIndex) * SOURCE_SEED_STRIDE;
}

function pairDisplay(left: string, right: string): string {
  return `${left} : ${right}`;
}

function isPresentationSafe(question: GeneratedClsCp002Question): boolean {
  if (
    question.generationProfile === "CATEGORY_SAFE_FALSE_PAIR"
    && !CLS_CP002_FALSE_PAIR_SAFE_RELATION_IDS.includes(question.intendedRelationId as never)
  ) {
    return false;
  }

  for (const locale of ["hi-IN", "pa-IN"] as const) {
    try {
      const localizedPairs = question.pairs.map((pair) =>
        localizeClsCp002StudentPair(pair, question.metadata.sourceRelationFactIds, locale),
      );
      const displays = localizedPairs.map((pair) => pairDisplay(pair.left, pair.right));
      if (new Set(displays).size !== displays.length) return false;
      const reconstructed = localizedPairs.map((pair) =>
        canonicalizeClsCp002StudentPair(pair, question.metadata.sourceRelationFactIds, locale),
      );
      if (JSON.stringify(reconstructed) !== JSON.stringify(question.pairs)) return false;
    } catch {
      return false;
    }
  }
  return true;
}

export function generateClsCp002EnglishQuestion(
  qlId: ClsCp002QlId = CLS_CP002_QL_ID,
  seed = 0,
): GeneratedClsCp002EnglishQuestion {
  if (qlId !== CLS_CP002_QL_ID) throw new Error(`Unknown CLS-CP-002 QL: ${qlId}`);
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  }

  const sourcePrototypeId = selectPrototypeId(seed);
  const prototypeIndex = CLS_CP002_PERMANENT_CONTRACT.allowedPrototypeIds.indexOf(sourcePrototypeId);
  const sourceOptionCount = optionCountForSeed(seed);
  const base = sourceSeedBase(
    seed,
    prototypeIndex,
    CLS_CP002_PERMANENT_CONTRACT.allowedPrototypeIds.length,
  );

  let generated: GeneratedClsCp002Question | null = null;
  let sourcePrototypeSeed = base;
  for (let attempt = 0; attempt < MAX_PRESENTATION_SAFE_ATTEMPTS; attempt += 1) {
    const candidateSeed = base + attempt;
    const candidate = generateClsCp002MultilingualSafePrototype(
      sourcePrototypeId,
      candidateSeed,
      sourceOptionCount,
    );
    if (!isPresentationSafe(candidate)) continue;
    generated = polishClsCp002EnglishQuestion(candidate);
    sourcePrototypeSeed = candidateSeed;
    break;
  }
  if (!generated) {
    throw new Error(
      `${qlId}/${seed} did not produce a presentation-safe state after ${MAX_PRESENTATION_SAFE_ATTEMPTS} attempts`,
    );
  }

  const {
    prototypeId: _prototypeId,
    seed: _prototypeSeed,
    metadata,
    lifecycle: _prototypeLifecycle,
    ...question
  } = generated;

  return {
    ...question,
    qlId,
    permanentQlId: qlId,
    seed,
    reviewOnly: true,
    questionStudioVisible: false,
    metadata: {
      ...metadata,
      locale: "en-IN",
      runtimeVersion: "cls-cp002-permanent-runtime-v1",
      sourcePrototypeId,
      sourcePrototypeSeed,
      solveContractId: CLS_CP002_PERMANENT_CONTRACT.solveContractId,
    },
    lifecycle: {
      permanentQlId: qlId,
      reviewStatus: "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
  };
}