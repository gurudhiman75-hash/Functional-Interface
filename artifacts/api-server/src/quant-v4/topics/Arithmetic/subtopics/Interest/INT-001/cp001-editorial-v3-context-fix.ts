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

  return initial.replace(
    /^At (.+?) simple interest per annum, an investment amounts to (.+?) after (.+?)\. (.+)$/u,
    `${context} amounts to $2 after $3 at $1 simple interest per annum. $4`,
  );
}
