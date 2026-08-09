import { listPrb001QuestionEntries } from "./PRB-001";
import { listPrb002QuestionEntries } from "./PRB-002";

export const PROBABILITY_LANGUAGES = ["en", "hi", "pa"] as const;
export type ProbabilityLanguage = (typeof PROBABILITY_LANGUAGES)[number];
export type ProbabilityNativeLanguage = Exclude<ProbabilityLanguage, "en">;

export type ProbabilityLocalizationStatus =
  | "APPROVED_EDITORIAL_ENGLISH"
  | "PENDING_NATIVE_EDITORIAL"
  | "APPROVED_NATIVE_EDITORIAL";

export type ProbabilityMultilingualManifestEntry = Readonly<{
  packageId: "PRB-001" | "PRB-002";
  cpId: string;
  qlId: string;
  language: ProbabilityLanguage;
  sourceLanguage: "en";
  localizationStatus: ProbabilityLocalizationStatus;
  questionStudioEnabled: boolean;
  publiclyPublishable: false;
  authority:
    | "PROBABILITY_ENGLISH_RUNTIME"
    | "PROBABILITY_NATIVE_EDITORIAL_PENDING";
}>;

type EnglishQuestionEntry = Readonly<{
  packageId: "PRB-001" | "PRB-002";
  cpId: string;
  qlId: string;
}>;

function listEnglishQuestionEntries(): readonly EnglishQuestionEntry[] {
  return [
    ...listPrb001QuestionEntries().map((entry) => ({
      packageId: "PRB-001" as const,
      cpId: entry.cpId,
      qlId: entry.qlId,
    })),
    ...listPrb002QuestionEntries().map((entry) => ({
      packageId: "PRB-002" as const,
      cpId: entry.cpId,
      qlId: entry.qlId,
    })),
  ];
}

export function buildProbabilityMultilingualManifest(): readonly ProbabilityMultilingualManifestEntry[] {
  return listEnglishQuestionEntries().flatMap((entry) =>
    PROBABILITY_LANGUAGES.map((language) => ({
      ...entry,
      language,
      sourceLanguage: "en" as const,
      localizationStatus:
        language === "en"
          ? ("APPROVED_EDITORIAL_ENGLISH" as const)
          : ("PENDING_NATIVE_EDITORIAL" as const),
      questionStudioEnabled: language === "en",
      publiclyPublishable: false as const,
      authority:
        language === "en"
          ? ("PROBABILITY_ENGLISH_RUNTIME" as const)
          : ("PROBABILITY_NATIVE_EDITORIAL_PENDING" as const),
    })),
  );
}

export function getProbabilityMultilingualReadinessSummary(): Readonly<{
  englishQlCount: number;
  manifestEntryCount: number;
  pendingHindiCount: number;
  pendingPunjabiCount: number;
  questionStudioEnabledLanguages: readonly ProbabilityLanguage[];
  publiclyPublishableLanguages: readonly ProbabilityLanguage[];
}> {
  const manifest = buildProbabilityMultilingualManifest();
  const englishQlCount = manifest.filter((entry) => entry.language === "en").length;
  return {
    englishQlCount,
    manifestEntryCount: manifest.length,
    pendingHindiCount: manifest.filter(
      (entry) => entry.language === "hi" && entry.localizationStatus === "PENDING_NATIVE_EDITORIAL",
    ).length,
    pendingPunjabiCount: manifest.filter(
      (entry) => entry.language === "pa" && entry.localizationStatus === "PENDING_NATIVE_EDITORIAL",
    ).length,
    questionStudioEnabledLanguages: PROBABILITY_LANGUAGES.filter((language) =>
      manifest.some((entry) => entry.language === language && entry.questionStudioEnabled),
    ),
    publiclyPublishableLanguages: PROBABILITY_LANGUAGES.filter((language) =>
      manifest.some((entry) => entry.language === language && entry.publiclyPublishable),
    ),
  };
}

export function assertProbabilityLanguageQuestionStudioReady(
  language: ProbabilityLanguage,
): void {
  if (language === "en") return;
  throw new Error(
    `Probability ${language} is not Question Studio-ready: all native stems, options and explanations require approved editorial entries and parity proof.`,
  );
}

export function assertProbabilityLanguagePubliclyPublishable(
  language: ProbabilityLanguage,
): never {
  throw new Error(
    `Probability ${language} is not publicly publishable. Public release requires a separate multilingual parity and publication freeze.`,
  );
}
