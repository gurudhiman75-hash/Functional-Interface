import { add, divide, formatExactPlain, multiply, rational } from "../foundation/exact";
import type { ExactRational } from "../foundation/types";
import {
  MEN_CP_012_DISCOVERY_V2_AUTHORITY,
  generateMenCp012DiscoveryV2,
  type MenCp012DiscoveryQuestion,
  type MenCp012DiscoveryV2Id,
} from "./discovery-v2";

export const MEN_CP_012_DISCOVERY_V2_SAFE_RUNTIME_AUTHORITY =
  "MEN-CP012-DISCOVERY-WAVE-02-SAFE-RUNTIME-V2" as const;

const LABELS = ["A", "B", "C", "D"] as const;

function requestedPosition(seed: string) {
  const trailing = /(\d+)$/.exec(seed);
  if (trailing) return Number(trailing[1]) % 4;
  let hash = 2166136261 >>> 0;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash % 4;
}

function natural(value: ExactRational) {
  if (value.denominator === 1n) return `${value.numerator}`;
  const denominator = Number(value.denominator);
  if ([2,4,5,8,10,20,25,40,50,100].includes(denominator)) {
    return `${Number(value.numerator) / denominator}`;
  }
  return formatExactPlain(value);
}

function unitOf(answer: string) {
  const firstSpace = answer.indexOf(" ");
  if (firstSpace < 0) throw new Error(`Cannot identify answer unit from: ${answer}`);
  return answer.slice(firstSpace + 1);
}

function uniqueWrongValues(answer: ExactRational, unit: string) {
  const countUnit = unit === "spheres" || unit === "cubes" || unit === "cylinders";
  const percentUnit = unit === "%";
  const candidates: ExactRational[] = countUnit
    ? [
        divide(answer, rational(2)),
        multiply(answer, rational(2)),
        multiply(answer, rational(3)),
        add(answer, rational(1)),
        add(answer, rational(2)),
      ]
    : percentUnit
      ? [
          add(answer, rational(5)),
          answer.numerator > 5n * answer.denominator ? add(answer, rational(-5)) : add(answer, rational(10)),
          divide(answer, rational(2)),
          multiply(answer, rational(2)),
          add(answer, rational(20)),
        ]
      : [
          divide(answer, rational(2)),
          multiply(answer, rational(2)),
          multiply(answer, rational(3)),
          add(answer, rational(1)),
          add(answer, rational(2)),
        ];

  const answerDisplay = `${natural(answer)} ${unit}`;
  const seen = new Set<string>([answerDisplay]);
  const wrong: Array<{ value: ExactRational; display: string }> = [];
  for (const value of candidates) {
    if (value.numerator <= 0n) continue;
    if (countUnit && value.denominator !== 1n) continue;
    const display = `${natural(value)} ${unit}`;
    if (seen.has(display)) continue;
    seen.add(display);
    wrong.push({ value, display });
    if (wrong.length === 3) break;
  }
  if (wrong.length !== 3) throw new Error(`Could not build three distinct distractors for ${answerDisplay}.`);
  return wrong;
}

function rebuildOptions(question: MenCp012DiscoveryQuestion, correctIndex: number) {
  const unit = unitOf(question.answer);
  const wrong = uniqueWrongValues(question.exactAnswer, unit);
  let wrongIndex = 0;
  const options = LABELS.map((label, index) => {
    if (index === correctIndex) {
      return { label, display: `${natural(question.exactAnswer)} ${unit}`, isCorrect: true };
    }
    const distractor = wrong[wrongIndex++]!;
    return { label, display: distractor.display, isCorrect: false };
  });
  return { options, answer: `${natural(question.exactAnswer)} ${unit}` };
}

/**
 * Wave 02 low-level construction intentionally throws on duplicate prototype
 * distractors so discovery catches the weakness. This learner-facing wrapper
 * keeps the exact constructed state but owns a stronger unit-aware option set.
 * If the low-level state itself collides before it can be returned, a
 * deterministic derived seed with the same requested answer position is used.
 */
export function generateMenCp012DiscoveryV2Safe(
  id: MenCp012DiscoveryV2Id,
  seed: string,
): MenCp012DiscoveryQuestion & {
  safeRuntimeAuthority: typeof MEN_CP_012_DISCOVERY_V2_SAFE_RUNTIME_AUTHORITY;
  requestedSeed: string;
  constructionSeed: string;
} {
  const targetPosition = requestedPosition(seed);
  let base: MenCp012DiscoveryQuestion | null = null;
  let constructionSeed = seed;

  for (let cycle = 0; cycle < 64 && !base; cycle += 1) {
    const attempt = targetPosition + cycle * 4;
    constructionSeed = cycle === 0 ? seed : `${seed}:safe:${attempt}`;
    try {
      const candidate = generateMenCp012DiscoveryV2(id, constructionSeed);
      if (candidate.correctIndex !== targetPosition) continue;
      base = candidate;
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes("duplicate options")) throw error;
    }
  }

  if (!base) throw new Error(`${id}/${seed}: could not construct a safe Wave 02 state.`);
  const rebuilt = rebuildOptions(base, targetPosition);
  if (new Set(rebuilt.options.map((option) => option.display)).size !== 4) {
    throw new Error(`${id}/${seed}: safe runtime still produced duplicate options.`);
  }

  return {
    ...base,
    authority: MEN_CP_012_DISCOVERY_V2_AUTHORITY,
    seed,
    correctIndex: targetPosition,
    options: rebuilt.options,
    answer: rebuilt.answer,
    safeRuntimeAuthority: MEN_CP_012_DISCOVERY_V2_SAFE_RUNTIME_AUTHORITY,
    requestedSeed: seed,
    constructionSeed,
  };
}
