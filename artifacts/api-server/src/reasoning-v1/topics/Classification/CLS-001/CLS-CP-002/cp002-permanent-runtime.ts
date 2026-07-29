import {
  CLS_CP002_PERMANENT_CONTRACT,
  CLS_CP002_QL_ID,
  type ClsCp002QlId,
  type ClsCp002SolveContractId,
} from "./cp002-permanent-contract";
import {
  canonicalizeClsCp002Pair,
  localizeClsCp002Pair,
} from "./localization/cp002-language-pack";
import { generateClsCp002Prototype } from "./runtime";
import type {
  ClsCp002PrototypeId,
  GeneratedClsCp002Question,
} from "./types";

type PrototypeMetadata = GeneratedClsCp002Question["metadata"];

export type ClsCp002ProvisionalLifecycle = {
  readonly permanentQlId: ClsCp002QlId;
  readonly reviewStatus: "PROVISIONAL_MULTILINGUAL_PROOF";
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
  readonly lifecycle: ClsCp002ProvisionalLifecycle;
};

const SOURCE_SEED_STRIDE = 48;
const MAX_LOCALIZATION_SAFE_ATTEMPTS = SOURCE_SEED_STRIDE;

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

function isLocalizationSafe(question: GeneratedClsCp002Question): boolean {
  for (const locale of ["hi-IN", "pa-IN"] as const) {
    try {
      const localizedPairs = question.pairs.map((pair) =>
        localizeClsCp002Pair(pair, question.metadata.sourceRelationFactIds, locale),
      );
      const displays = localizedPairs.map((pair) => pairDisplay(pair.left, pair.right));
      if (new Set(displays).size !== displays.length) return false;
      if (displays.some((display) => display.trim().length === 0)) return false;

      const reconstructed = localizedPairs.map((pair) =>
        canonicalizeClsCp002Pair(pair, question.metadata.sourceRelationFactIds, locale),
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
  for (let attempt = 0; attempt < MAX_LOCALIZATION_SAFE_ATTEMPTS; attempt += 1) {
    const candidateSeed = base + attempt;
    const candidate = generateClsCp002Prototype(
      sourcePrototypeId,
      candidateSeed,
      sourceOptionCount,
    );
    if (!isLocalizationSafe(candidate)) continue;
    generated = candidate;
    sourcePrototypeSeed = candidateSeed;
    break;
  }
  if (!generated) {
    throw new Error(
      `${qlId}/${seed} did not produce a multilingual-safe state after ${MAX_LOCALIZATION_SAFE_ATTEMPTS} attempts`,
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
      reviewStatus: "PROVISIONAL_MULTILINGUAL_PROOF",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
  };
}
