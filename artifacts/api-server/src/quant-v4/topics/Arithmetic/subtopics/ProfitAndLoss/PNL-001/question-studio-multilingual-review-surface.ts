import {
  buildAllWave03MultilingualEditorialLibraries,
} from "./foundation/editorial-v2-multilingual-reconstruction-wave03";
import {
  renderLocalizedFriendlyExplanationMarkdown,
  renderLocalizedStructuredStemMarkdown,
} from "./foundation/editorial-v2-localized-renderer";
import type { EditorialRenderContext } from "./foundation/editorial-content";
import type { EditorialLibraryFile } from "./foundation/editorial-library";
import {
  recoverPnl001CanonicalContextV2,
  unresolvedPnl001ProsePlaceholders,
} from "./question-studio-canonical-context-v2";
import {
  localizePnl001CanonicalChoiceV3,
  type Pnl001NativeReviewLanguage,
} from "./question-studio-native-choice-localizer-v3";
import {
  localizePnl001CanonicalContext,
} from "./question-studio-native-context-localizer";

export type Pnl001ReviewLanguage = "en" | Pnl001NativeReviewLanguage;

export type Pnl001LocalizedReviewSurface = Readonly<{
  qlId: string;
  cpId: string;
  language: Pnl001ReviewLanguage;
  stem: string;
  explanation: string;
  options: readonly [string, string, string, string];
  answer: string;
  correctIndex: number;
  context: EditorialRenderContext;
  source: "CANONICAL_ENGLISH" | "WAVE03_NATIVE";
  validation: Readonly<{
    valid: boolean;
    checks: readonly Readonly<{
      name: string;
      passed: boolean;
      message: string;
    }>[];
  }>;
}>;

const nativeLibraries = buildAllWave03MultilingualEditorialLibraries();
const nativeLibraryByKey = new Map<string, EditorialLibraryFile>(
  nativeLibraries.map((library) => [
    `${library.cpId}:${library.language}`,
    library,
  ]),
);

function nativeFinalAnswerLabel(language: Pnl001NativeReviewLanguage): string {
  return language === "hi" ? "अंतिम उत्तर" : "ਅੰਤਿਮ ਉੱਤਰ";
}

function nativeScriptPattern(language: Pnl001NativeReviewLanguage): RegExp {
  return language === "hi" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
}

function toEditorialContext(value: unknown): EditorialRenderContext {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("PNL-001 localized context must remain an object.");
  }
  return value as EditorialRenderContext;
}

function deriveNativeContextAliases(
  qlId: string,
  language: Pnl001NativeReviewLanguage,
  context: EditorialRenderContext,
): EditorialRenderContext {
  if (qlId !== "PNL-QL-145") return context;
  const table = context.schemeTable;
  if (
    !Array.isArray(table) ||
    table.length !== 2 ||
    !table.every((row) => Array.isArray(row) && row.length >= 3)
  ) {
    throw new Error(
      `${qlId} ${language}: canonical scheme table cannot derive native explanation aliases.`,
    );
  }
  const conjunction = language === "hi" ? " और " : " ਅਤੇ ";
  const firstRow = table[0] as readonly unknown[];
  const secondRow = table[1] as readonly unknown[];
  return {
    ...context,
    firstScheme: `${String(firstRow[1])}${conjunction}${String(firstRow[2])}`,
    secondScheme: `${String(secondRow[1])}${conjunction}${String(secondRow[2])}`,
  };
}

export function buildPnl001LocalizedReviewSurface(
  qlId: string,
  language: Pnl001ReviewLanguage,
): Pnl001LocalizedReviewSurface {
  const recovery = recoverPnl001CanonicalContextV2(qlId);
  const canonical = recovery.canonicalEntry;

  if (language === "en") {
    return {
      qlId,
      cpId: recovery.cpId,
      language,
      stem: canonical.stem,
      explanation: canonical.explanation,
      options: [...canonical.options] as [string, string, string, string],
      answer: canonical.answer,
      correctIndex: canonical.correctIndex,
      context: recovery.context as EditorialRenderContext,
      source: "CANONICAL_ENGLISH",
      validation: {
        valid: true,
        checks: [
          {
            name: "canonical-english-identity",
            passed: true,
            message: "English review surface is returned byte-for-byte from the approved canonical library.",
          },
        ],
      },
    };
  }

  const nativeLibrary = nativeLibraryByKey.get(`${recovery.cpId}:${language}`);
  const nativeEntry = nativeLibrary?.entries[qlId];
  if (!nativeEntry) {
    throw new Error(`${qlId} ${language}: Wave 03 native editorial entry is missing.`);
  }

  const localizedContext = deriveNativeContextAliases(
    qlId,
    language,
    toEditorialContext(
      localizePnl001CanonicalContext(recovery.context, language),
    ),
  );
  const stem = renderLocalizedStructuredStemMarkdown(
    nativeEntry.stem,
    language,
    localizedContext,
  );
  const structuredExplanation = renderLocalizedFriendlyExplanationMarkdown(
    nativeEntry.explanation,
    language,
    localizedContext,
  );
  const options = canonical.options.map((option) =>
    localizePnl001CanonicalChoiceV3(option, language),
  ) as [string, string, string, string];
  const answer = localizePnl001CanonicalChoiceV3(
    canonical.answer,
    language,
  );
  const explanation = `${structuredExplanation}\n\n**${nativeFinalAnswerLabel(language)}:** ${answer}`;
  const unresolved = unresolvedPnl001ProsePlaceholders(
    `${stem}\n${explanation}`,
  );
  const scriptPattern = nativeScriptPattern(language);
  const checks = [
    {
      name: "wave03-native-authority",
      passed:
        nativeLibrary?.entryCount === Object.keys(nativeLibrary.entries).length,
      message: "Stem and explanation are sourced from the merged Wave 03 native library.",
    },
    {
      name: "canonical-context-binding",
      passed: unresolved.length === 0,
      message:
        unresolved.length === 0
          ? "Canonical fixture values interpolate without unresolved prose placeholders."
          : `Unresolved prose placeholders remain: ${unresolved.join(", ")}.`,
    },
    {
      name: "native-script-surface",
      passed: scriptPattern.test(stem) && scriptPattern.test(explanation),
      message: "Rendered stem and explanation contain the requested native script.",
    },
    {
      name: "localized-four-option-key",
      passed:
        options.length === 4 &&
        new Set(options).size === 4 &&
        options[canonical.correctIndex] === answer,
      message: "Localized options preserve four unique choices and the reviewed correct index.",
    },
  ] as const;
  const validation = {
    valid: checks.every((check) => check.passed),
    checks,
  };
  if (!validation.valid) {
    throw new Error(
      `${qlId} ${language}: multilingual review surface failed: ${checks
        .filter((check) => !check.passed)
        .map((check) => check.message)
        .join(" | ")}`,
    );
  }

  return {
    qlId,
    cpId: recovery.cpId,
    language,
    stem,
    explanation,
    options,
    answer,
    correctIndex: canonical.correctIndex,
    context: localizedContext,
    source: "WAVE03_NATIVE",
    validation,
  };
}
