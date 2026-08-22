import { TSD_CP007_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import type { TsdCp007EnglishDifficulty } from "./english-authoring-registry";
import type { TsdCp007AuthorityKey } from "./executable-types";

export type TsdCp007Locale = "hi-IN" | "pa-IN";

export interface TsdCp007LocalizedFamilyText {
  readonly stem: string;
  readonly explanationGuide: string;
}

export interface TsdCp007LocalizedStemFamily extends TsdCp007LocalizedFamilyText {
  readonly familyId: string;
  readonly difficulty: TsdCp007EnglishDifficulty;
  readonly representation: string;
  readonly scene: string;
}

export interface TsdCp007LocalizedQlSpec {
  readonly locale: TsdCp007Locale;
  readonly qlId: `TSD-QL-${string}`;
  readonly authorityKey: TsdCp007AuthorityKey;
  readonly learnerContract: string;
  readonly objectPool: readonly string[];
  readonly stemFamilies: readonly TsdCp007LocalizedStemFamily[];
  readonly localizationStatus: "REVIEW_CANDIDATE";
  readonly sourceEnglishStatus: "FROZEN";
}

export function buildCp007LocalizedRegistry(
  locale: TsdCp007Locale,
  learnerContracts: Readonly<Record<string, string>>,
  objectPools: Readonly<Record<string, readonly string[]>>,
  familyTexts: Readonly<Record<string, TsdCp007LocalizedFamilyText>>,
): readonly TsdCp007LocalizedQlSpec[] {
  return Object.freeze(TSD_CP007_FROZEN_ENGLISH_REGISTRY.map((englishQl) => {
    const learnerContract = learnerContracts[englishQl.qlId];
    const objectPool = objectPools[englishQl.qlId];
    if (!learnerContract) throw new Error(`${locale}/${englishQl.qlId}: localized learner contract missing`);
    if (!objectPool || objectPool.length < 8) throw new Error(`${locale}/${englishQl.qlId}: localized object pool must contain at least eight entries`);

    const stemFamilies = englishQl.stemFamilies.map((englishFamily) => {
      const localized = familyTexts[englishFamily.familyId];
      if (!localized) throw new Error(`${locale}/${englishFamily.familyId}: localized family text missing`);
      return Object.freeze({
        familyId: englishFamily.familyId,
        difficulty: englishFamily.difficulty,
        representation: englishFamily.representation,
        scene: englishFamily.scene,
        stem: localized.stem,
        explanationGuide: localized.explanationGuide,
      });
    });

    return Object.freeze({
      locale,
      qlId: englishQl.qlId,
      authorityKey: englishQl.authorityKey,
      learnerContract,
      objectPool: Object.freeze([...objectPool]),
      stemFamilies: Object.freeze(stemFamilies),
      localizationStatus: "REVIEW_CANDIDATE" as const,
      sourceEnglishStatus: "FROZEN" as const,
    });
  }));
}
