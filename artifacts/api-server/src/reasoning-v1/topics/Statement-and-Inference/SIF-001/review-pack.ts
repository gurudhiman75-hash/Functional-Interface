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

const TARGET: Readonly<Record<SifDifficulty, number>> = { EASY: 5, MEDIUM: 8, HARD: 7 };

export function buildSifCpReviewPack(input: { readonly cpId: SifCpId; readonly locale: SifLocale; readonly seed?: number }): SifReviewPack {
  const baseSeed = input.seed ?? 10_001;
  const requested = { ...TARGET };
  const effective: Record<SifDifficulty, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
  const questions: GeneratedSifQuestion[] = [];
  let sequence = 0;
  for (const difficulty of ["EASY", "MEDIUM", "HARD"] as const) {
    const count = TARGET[difficulty];
    for (let index = 0; index < count; index += 1) {
      const question = generateSifQuestion({ cpId: input.cpId, locale: input.locale, seed: baseSeed + sequence });
      questions.push(question);
      effective[question.difficulty] += 1;
      sequence += 1;
    }
  }
  return { chapterId: "SIF-001", cpId: input.cpId, locale: input.locale, requestedDistribution: requested, effectiveDistribution: effective, questions };
}

export function buildSifChapterReviewPack(locale: SifLocale, seed = 10_001): readonly SifReviewPack[] {
  return (Object.keys(SIF_CP_DIFFICULTIES) as SifCpId[]).map((cpId, index) => buildSifCpReviewPack({ cpId, locale, seed: seed + index * 10_000 }));
}
