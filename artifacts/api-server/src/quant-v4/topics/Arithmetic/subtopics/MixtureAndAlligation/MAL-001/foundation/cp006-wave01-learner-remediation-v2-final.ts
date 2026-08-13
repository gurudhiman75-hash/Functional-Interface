import {
  generateMalCp006Wave01EditorialV2Question as generateCandidate,
  MAL_CP006_WAVE01_V2_HELD_PROTOTYPES,
  MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS,
  type MalCp006Wave01V2PrototypeId,
  verifyMalCp006Wave01V2Answer,
} from "./cp006-wave01-learner-remediation-v2";
import type { MalCp006DiscoveryQuestion } from "./cp006-types";

export {
  MAL_CP006_WAVE01_V2_HELD_PROTOTYPES,
  MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS,
  type MalCp006Wave01V2PrototypeId,
  verifyMalCp006Wave01V2Answer,
};

function hash(value: string): number {
  let state = 2166136261;
  for (const character of value) {
    state ^= character.codePointAt(0) ?? 0;
    state = Math.imul(state, 16777619);
  }
  return state >>> 0;
}

function tryCandidate(
  prototypeId: MalCp006Wave01V2PrototypeId,
  candidateSeed: string,
): MalCp006DiscoveryQuestion | null {
  try {
    return generateCandidate(prototypeId, candidateSeed);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("not enough misconception distractors")) return null;
    throw error;
  }
}

function generateWithDistinctMisconceptions(
  prototypeId: MalCp006Wave01V2PrototypeId,
  seed: string,
): MalCp006DiscoveryQuestion {
  if (
    prototypeId ===
    "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS"
  ) {
    const byState = new Map<string, MalCp006DiscoveryQuestion>();
    for (let attempt = 0; attempt < 32; attempt += 1) {
      const candidateSeed =
        attempt === 0 ? seed : `${seed}:clean-state-pool:${attempt}`;
      const candidate = tryCandidate(prototypeId, candidateSeed);
      if (!candidate) continue;
      if (!byState.has(candidate.siblingStateKey)) {
        byState.set(candidate.siblingStateKey, candidate);
      }
      if (byState.size >= 8) break;
    }
    const candidates = [...byState.values()];
    if (candidates.length === 0) {
      throw new Error(
        `${prototypeId}: could not find a clean equal-exchange state with three distinct misconception distractors for ${seed}.`,
      );
    }
    return candidates[hash(`${seed}:equal-exchange-choice`) % candidates.length]!;
  }

  for (let attempt = 0; attempt < 64; attempt += 1) {
    const candidateSeed =
      attempt === 0 ? seed : `${seed}:distinct-options:${attempt}`;
    const candidate = tryCandidate(prototypeId, candidateSeed);
    if (candidate) return candidate;
  }
  throw new Error(
    `${prototypeId}: could not find a clean state with three distinct misconception distractors for ${seed}.`,
  );
}

function makeInterrogative(
  question: MalCp006DiscoveryQuestion,
): string {
  const stem = question.stem.trim();
  if (stem.endsWith("?")) return stem;

  const findIndex = stem.lastIndexOf(" Find ");
  if (findIndex >= 0 && stem.endsWith(".")) {
    const prefix = stem.slice(0, findIndex).trim();
    const target = stem.slice(findIndex + 6, -1).trim();

    if (
      question.prototypeId ===
        "MAL-CP006-PROT-SOURCE-REFILL-RETRANSFER-DESTINATION-RATIO" &&
      /^water\s*:\s*spirit\s+in\s+B$/iu.test(target)
    ) {
      return `${prefix} What is the final water : spirit ratio in B?`;
    }

    if (
      question.prototypeId ===
        "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO" &&
      /^final milk in A\s*:\s*final water in B$/iu.test(target)
    ) {
      return `${prefix} What is the ratio of final milk in A to final water in B?`;
    }

    if (
      question.prototypeId ===
        "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO"
    ) {
      return `${prefix} What is the final ${target.replace(/\s+at the end$/iu, "")} at the end?`;
    }

    if (
      question.prototypeId ===
        "MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION"
    ) {
      return `${prefix} What is A's final salt percentage?`;
    }

    if (
      question.prototypeId ===
        "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS"
    ) {
      return `${prefix} What equal amount must be exchanged simultaneously to make the final concentrations equal?`;
    }

    return `${prefix} What is ${target}?`;
  }

  if (stem.endsWith(".")) return `${stem.slice(0, -1)}?`;
  return `${stem}?`;
}

function rebuildValidation(
  question: MalCp006DiscoveryQuestion,
  stem: string,
): MalCp006DiscoveryQuestion["validation"] {
  const errors = question.validation.errors.filter(
    (error) => error !== "Stem is not interrogative.",
  );
  if (!stem.endsWith("?")) errors.push("Stem is not interrogative.");
  return { ok: errors.length === 0, errors };
}

export function generateMalCp006Wave01EditorialV2FinalQuestion(
  prototypeId: MalCp006Wave01V2PrototypeId,
  seed = "mal-cp006-wave01-v2-final:default",
): MalCp006DiscoveryQuestion {
  const question = generateWithDistinctMisconceptions(prototypeId, seed);
  const stem = makeInterrogative(question);
  return {
    ...question,
    requestedSeed: seed,
    stem,
    validation: rebuildValidation(question, stem),
  };
}

export function malCp006Wave01V2FinalStable(
  question: MalCp006DiscoveryQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}
