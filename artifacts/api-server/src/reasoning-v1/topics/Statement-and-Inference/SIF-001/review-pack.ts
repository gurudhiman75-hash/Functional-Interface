import { SIF_CP_DIFFICULTIES } from "./authorities.ts";
import { SIF_CP004_PROFILE_BY_AUTHORITY_ID } from "./cp004-comparison-authorities.ts";
import { SIF_CP005_PROFILE_BY_AUTHORITY_ID } from "./cp005-suggestive-reason-authorities.ts";
import { SIF_CP006_PROFILE_BY_AUTHORITY_ID } from "./cp006-purpose-authorities.ts";
import { generateSifQuestion } from "./generator.ts";
import { listSifAuthorities } from "./authorities.ts";
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
const CP004_TARGET: Readonly<Record<SifDifficulty, number>> = { EASY: 10, MEDIUM: 14, HARD: 0 };
const CP005_TARGET: Readonly<Record<SifDifficulty, number>> = { EASY: 0, MEDIUM: 24, HARD: 0 };
const CP006_TARGET: Readonly<Record<SifDifficulty, number>> = { EASY: 0, MEDIUM: 24, HARD: 0 };

export function buildSifCpReviewPack(input: { readonly cpId: SifCpId; readonly locale: SifLocale; readonly seed?: number }): SifReviewPack {
  const baseSeed = input.seed ?? 10_001;
  const target = input.cpId === "SIF-CP003" ? CP003_TARGET : input.cpId === "SIF-CP004" ? CP004_TARGET : input.cpId === "SIF-CP005" ? CP005_TARGET : input.cpId === "SIF-CP006" ? CP006_TARGET : DEFAULT_TARGET;
  const requested = { ...target };
  const effective: Record<SifDifficulty, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
  const questions: GeneratedSifQuestion[] = [];
  const usedScenarioIds = new Set<string>();
  if (input.cpId === "SIF-CP005") {
    const pool = listSifAuthorities(input.cpId);
    const kinds = [...new Set(pool.map((authority) => SIF_CP005_PROFILE_BY_AUTHORITY_ID[authority.id].kind))];
    for (const kind of kinds) {
      const authorities = pool.filter((authority) => SIF_CP005_PROFILE_BY_AUTHORITY_ID[authority.id].kind === kind).filter((_, index) => index % 2 === 0);
      if (authorities.length !== 3) throw new Error(`SIF-CP005: expected three selected scenarios for ${kind}`);
      for (const authority of authorities) {
        const index = pool.findIndex((entry) => entry.id === authority.id);
        const offset = (index - (Math.abs(baseSeed) % pool.length) + pool.length) % pool.length;
        const question = generateSifQuestion({ cpId: input.cpId, locale: input.locale, seed: baseSeed + offset });
        if (question.scenarioId !== authority.id) throw new Error(`SIF-CP005: deterministic review selection mismatch for ${authority.id}`);
        questions.push(question);
        usedScenarioIds.add(question.scenarioId);
        effective[question.difficulty] += 1;
      }
    }
    return { chapterId: "SIF-001", cpId: input.cpId, locale: input.locale, requestedDistribution: requested, effectiveDistribution: effective, questions };
  }
  if (input.cpId === "SIF-CP006") {
    const pool = listSifAuthorities(input.cpId);
    const families = [...new Set(pool.map((authority) => SIF_CP006_PROFILE_BY_AUTHORITY_ID[authority.id].family))];
    for (const family of families) {
      const authorities = pool.filter((authority) => SIF_CP006_PROFILE_BY_AUTHORITY_ID[authority.id].family === family).filter((_, index) => index % 2 === 0);
      if (authorities.length !== 3) throw new Error(`SIF-CP006: expected three selected scenarios for ${family}`);
      for (const authority of authorities) {
        const index = pool.findIndex((entry) => entry.id === authority.id);
        const offset = (index - (Math.abs(baseSeed) % pool.length) + pool.length) % pool.length;
        const question = generateSifQuestion({ cpId: input.cpId, locale: input.locale, seed: baseSeed + offset });
        if (question.scenarioId !== authority.id) throw new Error(`SIF-CP006: deterministic review selection mismatch for ${authority.id}`);
        questions.push(question);
        usedScenarioIds.add(question.scenarioId);
        effective[question.difficulty] += 1;
      }
    }
    return { chapterId: "SIF-001", cpId: input.cpId, locale: input.locale, requestedDistribution: requested, effectiveDistribution: effective, questions };
  }
  if (input.cpId === "SIF-CP004") {
    const pool = listSifAuthorities(input.cpId);
    const kinds = [...new Set(pool.map((authority) => SIF_CP004_PROFILE_BY_AUTHORITY_ID[authority.id].kind))];
    const easyPerKind = [2, 1, 1, 1, 1, 1, 1, 2];
    for (let kindIndex = 0; kindIndex < kinds.length; kindIndex += 1) {
      const kind = kinds[kindIndex];
      const desired = { EASY: easyPerKind[kindIndex], MEDIUM: 3 - easyPerKind[kindIndex] } as const;
      for (const difficulty of ["EASY", "MEDIUM"] as const) {
        const authorities = pool.filter((authority) => SIF_CP004_PROFILE_BY_AUTHORITY_ID[authority.id].kind === kind && authority.difficulty === difficulty).slice(0, desired[difficulty]);
        if (authorities.length !== desired[difficulty]) throw new Error(`SIF-CP004: unable to build ${kind} ${difficulty} review sample`);
        for (const authority of authorities) {
          const index = pool.findIndex((entry) => entry.id === authority.id);
          const offset = (index - (Math.abs(baseSeed) % pool.length) + pool.length) % pool.length;
          const question = generateSifQuestion({ cpId: input.cpId, locale: input.locale, seed: baseSeed + offset });
          if (question.scenarioId !== authority.id) throw new Error(`SIF-CP004: deterministic review selection mismatch for ${authority.id}`);
          questions.push(question);
          usedScenarioIds.add(question.scenarioId);
          effective[question.difficulty] += 1;
        }
      }
    }
    return { chapterId: "SIF-001", cpId: input.cpId, locale: input.locale, requestedDistribution: requested, effectiveDistribution: effective, questions };
  }
  let sequence = 0;
  for (const difficulty of ["EASY", "MEDIUM", "HARD"] as const) {
    const count = target[difficulty];
    for (let index = 0; index < count; index += 1) {
      let question = generateSifQuestion({ cpId: input.cpId, locale: input.locale, seed: baseSeed + sequence });
      if (input.cpId === "SIF-CP003") {
        if (count === 0) continue;
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
