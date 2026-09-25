import { SIF_CP_DIFFICULTIES } from "./authorities.ts";
import { generateSifQuestion } from "./generator.ts";
import type { GeneratedSifQuestion, SifCpId, SifDifficulty, SifLocale } from "./types.ts";

export interface SifReviewPack {
  readonly chapterId: "SIF-001";
  readonly cpId: SifCpId;
  readonly locale: SifLocale;
  readonly requestedDistribution: Readonly<Record<SifDifficulty, number>>;
  readonly effectiveDistribution: Readonly<Record<SifDifficulty, number>>;
  readonly questions: readonly GeneratedSifQuestion[];
}

const DEFAULT_TARGET: Readonly<Record<SifDifficulty, number>> = { EASY: 5, MEDIUM: 8, HARD: 7 };
const CP003_TARGET: Readonly<Record<SifDifficulty, number>> = { EASY: 6, MEDIUM: 10, HARD: 8 };

export function buildSifCpReviewPack(input: { readonly cpId: SifCpId; readonly locale: SifLocale; readonly seed?: number }): SifReviewPack {
  const baseSeed = input.seed ?? 10_001;
  const target = input.cpId === "SIF-CP003" ? CP003_TARGET : DEFAULT_TARGET;
  const requested = { ...target };
  const effective: Record<SifDifficulty, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
  const questions: GeneratedSifQuestion[] = [];
  const usedScenarioIds = new Set<string>();
  let sequence = 0;
  for (const difficulty of ["EASY", "MEDIUM", "HARD"] as const) {
    const count = target[difficulty];
    for (let index = 0; index < count; index += 1) {
      let question = generateSifQuestion({ cpId: input.cpId, locale: input.locale, seed: baseSeed + sequence });
      if (input.cpId === "SIF-CP003") {
        let attempts = 0;
        while ((question.difficulty !== difficulty || usedScenarioIds.has(question.scenarioId)) && attempts < 600) {
          sequence += 1;
          attempts += 1;
          question = generateSifQuestion({ cpId: input.cpId, locale: input.locale, seed: baseSeed + sequence });
        }
        if (question.difficulty !== difficulty || usedScenarioIds.has(question.scenarioId)) throw new Error(`${input.cpId}: unable to build distinct ${difficulty} review sample`);
      }
      questions.push(question);
      usedScenarioIds.add(question.scenarioId);
      effective[question.difficulty] += 1;
      sequence += 1;
    }
  }
  return { chapterId: "SIF-001", cpId: input.cpId, locale: input.locale, requestedDistribution: requested, effectiveDistribution: effective, questions };
}

export function buildSifChapterReviewPack(locale: SifLocale, seed = 10_001): readonly SifReviewPack[] {
  return (Object.keys(SIF_CP_DIFFICULTIES) as SifCpId[]).map((cpId, index) => buildSifCpReviewPack({ cpId, locale, seed: seed + index * 10_000 }));
}
