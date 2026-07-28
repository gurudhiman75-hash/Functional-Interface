import { deterministicIndex } from "./foundation/prng";
import type { IntCp001FinalQlId } from "./cp001-final-registry";
import { humaniseIntCp001Stem } from "./cp001-editorial-v3";

const FALLBACK_CONTEXTS = [
  "Meera's fixed deposit with a cooperative bank",
  "Harpreet's term deposit with a post office",
  "Simran's savings certificate with a savings cooperative",
  "Ravi's business investment with a local finance office",
] as const;

export function finaliseIntCp001HumanisedStem(
  qlId: IntCp001FinalQlId,
  seed: string,
  stem: string,
): string {
  const initial = humaniseIntCp001Stem(qlId, seed, stem);
  const context = FALLBACK_CONTEXTS[
    deterministicIndex(`${qlId}:${seed}:editorial-story-v3`, FALLBACK_CONTEXTS.length)
  ]!;

  const reordered = initial.replace(
    /^At (.+?) simple interest per annum, an investment amounts to (.+?) after (.+?)\. (.+)$/u,
    `${context} amounts to $2 after $3 at $1 simple interest per annum. $4`,
  );
  if (reordered !== initial) return reordered;

  const contextualClause = initial.replace(
    /^At (.+?), an investment\b/u,
    `For ${context}, at $1, the investment`,
  );
  if (contextualClause !== initial) return contextualClause;

  return initial
    .replace(/^Under simple interest, a sum\b/u, `Under simple interest, ${context}`)
    .replace(/^The amounts of one sum\b/u, `The amounts of ${context}`)
    .replace(/^A sum\b/u, context)
    .replace(/^A principal\b/u, context)
    .replace(/^An investment\b/u, context);
}
