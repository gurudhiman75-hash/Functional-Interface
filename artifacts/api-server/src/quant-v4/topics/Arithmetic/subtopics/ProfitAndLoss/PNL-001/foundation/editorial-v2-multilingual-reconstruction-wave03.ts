import type { StructuredEditorialEntry } from "./editorial-content";
import type { EditorialLibraryFile } from "./editorial-library";
import { buildAllNormalizedMultilingualEditorialLibraries as buildWave02Libraries } from "./editorial-v2-multilingual-naturalness-wave02";
import type { NativeEditorialLanguage } from "./editorial-v2-native-stems";

type TextReplacement = readonly [from: string, to: string];

const WAVE03_REPLACEMENTS: Readonly<
  Record<NativeEditorialLanguage, readonly TextReplacement[]>
> = {
  hi: [
    [
      "हर प्रतिशत का हर पहले बताता है कि हर में कौन-सी राशि आएगी",
      "प्रतिशत निकालते समय हर में वही राशि आती है जिस पर दर लागू होती है",
    ],
    ["अंतिम मांग न भूलें", "प्रश्न में मांगी गई राशि या प्रतिशत पर ध्यान रखें"],
    ["सौख्य भाग", "अनुपाती मान"],
  ],
  pa: [
    ["ਜਾਣੇ ਮੂਲ ਮੁੱਲ", "ਦਿੱਤੇ ਗਏ ਲਾਗਤ ਮੁੱਲ"],
    ["ਜਾਣਿਆ ਮੂਲ ਮੁੱਲ", "ਦਿੱਤਾ ਗਿਆ ਲਾਗਤ ਮੁੱਲ"],
    ["ਅੰਤਿਮ ਮੰਗ ਨਾ ਭੁੱਲੋ", "ਸਵਾਲ ਵਿੱਚ ਮੰਗੀ ਰਕਮ ਜਾਂ ਪ੍ਰਤੀਸ਼ਤ ਉੱਤੇ ਧਿਆਨ ਦਿਓ"],
    ["ਸੌਖੇ ਭਾਗ ਮੰਨੋ", "ਅਨੁਪਾਤੀ ਮੁੱਲ ਮੰਨੋ"],
    ["ਸੌਖੇ ਭਾਗ", "ਅਨੁਪਾਤੀ ਮੁੱਲ"],
    [
      "ਹਰ ਪ੍ਰਤੀਸ਼ਤ ਦਾ ਹਰ ਪਹਿਲਾਂ ਦੱਸਦਾ ਹੈ ਕਿ ਹਰ ਵਿੱਚ ਕਿਹੜੀ ਰਕਮ ਆਵੇਗੀ",
      "ਪ੍ਰਤੀਸ਼ਤ ਕੱਢਦੇ ਸਮੇਂ ਹੇਠਾਂ ਉਹੀ ਰਕਮ ਲਿਖੀ ਜਾਂਦੀ ਹੈ ਜਿਸ ਉੱਤੇ ਦਰ ਲਾਗੂ ਹੁੰਦੀ ਹੈ",
    ],
  ],
};

const STEP_PREFIXES: Readonly<Record<NativeEditorialLanguage, readonly string[]>> = {
  hi: [
    "दिए आँकड़ों से — ",
    "सही आधार पर — ",
    "इस चरण में ",
    "अब ",
    "प्रश्न की शर्त के अनुसार — ",
    "संबंधित राशि पर — ",
    "जाँच के साथ — ",
    "क्रमवार — ",
  ],
  pa: [
    "ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਤੋਂ — ",
    "ਸਹੀ ਆਧਾਰ ਉੱਤੇ — ",
    "ਇਸ ਪੜਾਅ ਵਿੱਚ ",
    "ਹੁਣ ",
    "ਸਵਾਲ ਦੀ ਸ਼ਰਤ ਅਨੁਸਾਰ — ",
    "ਸਬੰਧਤ ਰਕਮ ਉੱਤੇ — ",
    "ਜਾਂਚ ਸਮੇਤ — ",
    "ਕ੍ਰਮਵਾਰ — ",
  ],
};

function applyReplacements(
  language: NativeEditorialLanguage,
  value: string,
): string {
  return WAVE03_REPLACEMENTS[language]
    .reduce((output, [from, to]) => output.split(from).join(to), value)
    .replace(/\s{2,}/gu, " ")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function targetText(
  language: NativeEditorialLanguage,
  entry: StructuredEditorialEntry,
): string {
  const fallback =
    language === "hi" ? "मांगा गया परिणाम ज्ञात कीजिए" : "ਮੰਗਿਆ ਨਤੀਜਾ ਪਤਾ ਕਰੋ";
  return (entry.stem.prompt.trim() || fallback)
    .replace(/[?？।.]+$/u, "")
    .trim();
}

function removePromptEcho(value: string, target: string): string {
  if (!value.trim() || !target.trim()) return value.trim();
  const escapedTarget = escapeRegExp(target);
  const sentenceWithTarget = new RegExp(
    `[^।!?\\n]*[“\"]${escapedTarget}[”\"][^।!?\\n]*[।!?]?`,
    "gu",
  );
  return value
    .replace(sentenceWithTarget, " ")
    .replace(/\s+([।!?])/gu, "$1")
    .replace(/\s{2,}/gu, " ")
    .trim();
}

function removeSyntheticStepPrefix(
  language: NativeEditorialLanguage,
  title: string,
): string {
  const prefix = STEP_PREFIXES[language].find((candidate) =>
    title.startsWith(candidate),
  );
  return (prefix ? title.slice(prefix.length) : title).trim();
}

function mapProse<T>(
  language: NativeEditorialLanguage,
  value: T,
  propertyName = "",
): T {
  if (typeof value === "string") {
    return (/latex/i.test(propertyName)
      ? value
      : applyReplacements(language, value)) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => mapProse(language, item, propertyName)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        mapProse(language, item, key),
      ]),
    ) as T;
  }
  return value;
}

function reconstructEntry(
  language: NativeEditorialLanguage,
  sourceEntry: StructuredEditorialEntry,
): StructuredEditorialEntry {
  const entry = mapProse(language, sourceEntry);
  const target = targetText(language, entry);

  return {
    ...entry,
    explanation: {
      ...entry.explanation,
      opening: removePromptEcho(entry.explanation.opening, target),
      concept: removePromptEcho(entry.explanation.concept, target),
      steps: entry.explanation.steps.map((step) => ({
        ...step,
        title: removeSyntheticStepPrefix(language, step.title),
      })),
      conclusion: removePromptEcho(entry.explanation.conclusion, target),
      commonTrap: entry.explanation.commonTrap
        ? removePromptEcho(entry.explanation.commonTrap, target)
        : entry.explanation.commonTrap,
    },
  };
}

function reconstructLibrary(library: EditorialLibraryFile): EditorialLibraryFile {
  const language = library.language as NativeEditorialLanguage;
  return {
    ...library,
    entries: Object.fromEntries(
      Object.entries(library.entries).map(([qlId, entry]) => [
        qlId,
        reconstructEntry(language, entry),
      ]),
    ),
  };
}

export function buildAllWave03MultilingualEditorialLibraries(): readonly EditorialLibraryFile[] {
  return buildWave02Libraries().map(reconstructLibrary);
}
