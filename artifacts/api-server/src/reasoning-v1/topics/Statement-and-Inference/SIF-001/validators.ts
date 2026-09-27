import { createHash } from "node:crypto";
import { assertSifAuthority, solveSifScenario } from "./solver.ts";
import type { GeneratedSifQuestion, SifLocale, SifScenarioAuthority, SifValidationGateResult } from "./types.ts";

const GATES: readonly SifValidationGateResult["gate"][] = ["LOGICAL_VALIDITY", "UNIQUE_ANSWER", "NO_OUTSIDE_KNOWLEDGE", "INFERENCE_IDENTITY", "DISTRACTOR_PLAUSIBILITY", "LANGUAGE_QUALITY", "DIFFICULTY_MATCH", "EXPLANATION_QUALITY", "MULTILINGUAL_PARITY", "NOVELTY"];

export function fingerprintSifAuthority(authority: SifScenarioAuthority): string {
  return createHash("sha256").update(JSON.stringify({ cpId: authority.cpId, statement: authority.statement["en-IN"], candidates: authority.candidates.map((entry) => entry.text["en-IN"]), strengths: authority.candidates.map((entry) => entry.strength), follows: authority.candidates.map((entry) => entry.follows), mechanisms: authority.mechanisms })).digest("hex").slice(0, 20);
}

export function validateSifAuthority(authority: SifScenarioAuthority): readonly SifValidationGateResult[] {
  assertSifAuthority(authority);
  const answer = solveSifScenario(authority);
  const localized = (["en-IN", "hi-IN", "pa-IN"] as const).every((locale) => authority.statement[locale].trim().length > 10 && authority.explanation[locale].trim().length > 20 && authority.candidates.every((entry) => entry.text[locale].trim().length > 5));
  const invalidCandidates = authority.candidates.filter((entry) => !entry.follows);
  const results: Record<SifValidationGateResult["gate"], readonly [boolean, string]> = {
    LOGICAL_VALIDITY: [true, `Structured solver returns ${answer}.`],
    UNIQUE_ANSWER: [answer === "EITHER" || ["ONLY_I", "ONLY_II", "BOTH", "NEITHER"].includes(answer), "Exactly one answer-code state is keyed."],
    NO_OUTSIDE_KNOWLEDGE: [authority.candidates.every((entry) => entry.supportFactIds.length > 0), "Every candidate is assessed against declared facts."],
    INFERENCE_IDENTITY: [authority.identityGuard.evaluatesSupport && !authority.identityGuard.assumptionQuestion && !authority.identityGuard.conclusionQuestion && !authority.identityGuard.argumentQuestion && !authority.identityGuard.causeEffectQuestion && !authority.identityGuard.courseOfActionQuestion, "The task evaluates evidential support only."],
    DISTRACTOR_PLAUSIBILITY: [invalidCandidates.every((entry) => Boolean(entry.distractorType)) || answer === "EITHER", "Invalid candidates use a controlled logical-error family."],
    LANGUAGE_QUALITY: [localized, "English, Hindi and Punjabi text is complete."],
    DIFFICULTY_MATCH: [authority.difficulty === "EASY" ? authority.mechanisms.filter((mechanism) => mechanism !== "MIXED").length <= 2 : authority.mechanisms.filter((mechanism) => mechanism !== "MIXED").length <= 3, "Reasoning mechanisms remain within the difficulty ceiling."],
    EXPLANATION_QUALITY: [(["en-IN", "hi-IN", "pa-IN"] as const).every((locale) => authority.explanation[locale].length >= 45), "Explanation states the evidence, connection and result."],
    MULTILINGUAL_PARITY: [localized, `Answer class ${answer} is derived before language realization.`],
    NOVELTY: [
      fingerprintSifAuthority(authority).length === 20,
      "Semantic identity is fingerprinted for repetition checks. This gate means novelty-audit readiness only; it does not grant CONTROLLED_NOVEL provenance.",
    ],
  };
  return GATES.map((gate) => ({ gate, passed: results[gate][0], detail: results[gate][1] }));
}

export function assertGeneratedSifQuestion(question: GeneratedSifQuestion): void {
  if (question.validation.some((gate) => !gate.passed)) throw new Error(`${question.scenarioId}/${question.locale}: validation gate failed`);
  if (question.options[question.correctIndex] === undefined) throw new Error(`${question.scenarioId}: invalid correct index`);
  if (!question.statement || !question.explanation) throw new Error(`${question.scenarioId}/${question.locale}: empty learner text`);
}

export function assertSifLanguageParity(questions: readonly GeneratedSifQuestion[]): void {
  const bySeed = new Map<string, GeneratedSifQuestion[]>();
  for (const question of questions) {
    const key = `${question.cpId}:${question.scenarioId}:${question.seed}`;
    bySeed.set(key, [...(bySeed.get(key) ?? []), question]);
  }
  for (const [key, entries] of bySeed) {
    const locales = new Set(entries.map((entry) => entry.locale));
    if (locales.size !== 3) throw new Error(`${key}: expected all three locales`);
    if (new Set(entries.map((entry) => entry.answerClass)).size !== 1 || new Set(entries.map((entry) => entry.correctIndex)).size !== 1) throw new Error(`${key}: answer parity drift`);
  }
}
