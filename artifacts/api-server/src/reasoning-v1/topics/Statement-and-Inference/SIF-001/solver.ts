import type { SifAnswerClass, SifCandidateAuthority, SifScenarioAuthority } from "./types.ts";

export const SIF_SUPPORT_PROOF_AUTHORITY =
  "SIF_STRENGTH_BACKED_SUPPORT_V2_2026_10_04" as const;

export function candidateFollowsFromStrength(candidate: SifCandidateAuthority): boolean {
  return candidate.strength === "CERTAIN" || candidate.strength === "STRONGLY_SUPPORTED";
}

export function canonicalSifCandidates(
  authority: SifScenarioAuthority,
): readonly [SifCandidateAuthority, SifCandidateAuthority] {
  const first = authority.candidates.find((entry) => entry.id === "I");
  const second = authority.candidates.find((entry) => entry.id === "II");
  if (!first || !second) throw new Error(`${authority.id}: candidates I and II are required`);
  return [first, second] as const;
}

export function solveSifScenario(authority: SifScenarioAuthority): SifAnswerClass {
  const [first, second] = canonicalSifCandidates(authority);

  if (authority.id.endsWith("-EITHER")) {
    if (first.strength !== "POSSIBLE_ONLY" || second.strength !== "POSSIBLE_ONLY") {
      throw new Error(`${authority.id}: EITHER authority requires two possible-only candidates`);
    }
    if (first.follows || second.follows) {
      throw new Error(`${authority.id}: EITHER authority must not mark either individual candidate as certain`);
    }
    return "EITHER";
  }

  const firstFollows = candidateFollowsFromStrength(first);
  const secondFollows = candidateFollowsFromStrength(second);

  if (first.follows !== firstFollows || second.follows !== secondFollows) {
    throw new Error(
      `${authority.id}: follows metadata disagrees with strength-backed support proof`,
    );
  }

  if (firstFollows && secondFollows) return "BOTH";
  if (firstFollows) return "ONLY_I";
  if (secondFollows) return "ONLY_II";
  return "NEITHER";
}

export function answerIndexFor(answerClass: SifAnswerClass): number {
  return ({ ONLY_I: 0, ONLY_II: 1, EITHER: 2, NEITHER: 3, BOTH: 4 } as const)[answerClass];
}

export function assertSifAuthority(authority: SifScenarioAuthority): void {
  const factIds = new Set(authority.facts.map((entry) => entry.id));
  if (!authority.statement["en-IN"] || !authority.statement["hi-IN"] || !authority.statement["pa-IN"]) throw new Error(`${authority.id}: missing localized statement`);
  if (authority.candidates.length !== 2) throw new Error(`${authority.id}: exactly two candidates are required`);
  if (new Set(authority.candidates.map((entry) => entry.id)).size !== 2 || !authority.candidates.some((entry) => entry.id === "I") || !authority.candidates.some((entry) => entry.id === "II")) throw new Error(`${authority.id}: candidates must define inference I and inference II exactly once`);

  const answer = solveSifScenario(authority);
  for (const candidate of authority.candidates) {
    if (candidate.supportFactIds.some((id) => !factIds.has(id))) throw new Error(`${authority.id}/${candidate.id}: unknown support fact`);
    if (!candidate.follows && !candidate.distractorType && answer !== "EITHER") throw new Error(`${authority.id}/${candidate.id}: invalid candidate requires controlled distractor type`);
    if (candidate.follows && (candidate.strength === "POSSIBLE_ONLY" || candidate.strength === "UNSUPPORTED_OR_CONTRADICTED")) throw new Error(`${authority.id}/${candidate.id}: following candidate has insufficient strength`);
  }
  if (!authority.identityGuard.evaluatesSupport || authority.identityGuard.assumptionQuestion || authority.identityGuard.conclusionQuestion || authority.identityGuard.argumentQuestion || authority.identityGuard.causeEffectQuestion || authority.identityGuard.courseOfActionQuestion) throw new Error(`${authority.id}: inference identity guard failed`);
}
