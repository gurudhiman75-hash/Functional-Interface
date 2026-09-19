import type { SifAnswerClass, SifScenarioAuthority } from "./types.ts";

export function solveSifScenario(authority: SifScenarioAuthority): SifAnswerClass {
  if (authority.id.endsWith("-EITHER")) return "EITHER";
  const [first, second] = authority.candidates.map((entry) => entry.follows);
  if (first && second) return "BOTH";
  if (first) return "ONLY_I";
  if (second) return "ONLY_II";
  return "NEITHER";
}

export function answerIndexFor(answerClass: SifAnswerClass): number {
  return ({ ONLY_I: 0, ONLY_II: 1, EITHER: 2, NEITHER: 3, BOTH: 4 } as const)[answerClass];
}

export function assertSifAuthority(authority: SifScenarioAuthority): void {
  const factIds = new Set(authority.facts.map((entry) => entry.id));
  if (!authority.statement["en-IN"] || !authority.statement["hi-IN"] || !authority.statement["pa-IN"]) throw new Error(`${authority.id}: missing localized statement`);
  if (authority.candidates.length !== 2) throw new Error(`${authority.id}: exactly two candidates are required`);
  for (const candidate of authority.candidates) {
    if (candidate.supportFactIds.some((id) => !factIds.has(id))) throw new Error(`${authority.id}/${candidate.id}: unknown support fact`);
    if (!candidate.follows && !candidate.distractorType && !authority.id.endsWith("-EITHER")) throw new Error(`${authority.id}/${candidate.id}: invalid candidate requires controlled distractor type`);
    if (candidate.follows && (candidate.strength === "POSSIBLE_ONLY" || candidate.strength === "UNSUPPORTED_OR_CONTRADICTED")) throw new Error(`${authority.id}/${candidate.id}: following candidate has insufficient strength`);
  }
  if (!authority.identityGuard.evaluatesSupport || authority.identityGuard.assumptionQuestion || authority.identityGuard.conclusionQuestion || authority.identityGuard.argumentQuestion || authority.identityGuard.causeEffectQuestion || authority.identityGuard.courseOfActionQuestion) throw new Error(`${authority.id}: inference identity guard failed`);
}
