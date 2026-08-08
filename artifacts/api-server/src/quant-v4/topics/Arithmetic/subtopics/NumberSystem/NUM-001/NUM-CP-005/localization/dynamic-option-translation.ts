import type { NumCp005PermanentQlId } from "../permanent/allocation";
import { translateNumCp005OptionValue } from "./language-pack";
import type { NumCp005TranslatedLocale } from "./types";

function translateComparisonOption(
  value: string,
  locale: NumCp005TranslatedLocale,
): string | null {
  const match = value.match(
    /^A has (.+?); B has (.+?); (Number A has more\.|Number B has more\.|Both numbers have the same value\.|Cannot determine\.)$/u,
  );
  if (!match) return null;

  const valueA = match[1]!;
  const valueB = match[2]!;
  const outcome = match[3]!;
  const hi = locale === "hi-IN";
  const outcomeText = outcome === "Number A has more."
    ? hi ? "A का मान अधिक है।" : "A ਦਾ ਮੁੱਲ ਵੱਧ ਹੈ।"
    : outcome === "Number B has more."
      ? hi ? "B का मान अधिक है।" : "B ਦਾ ਮੁੱਲ ਵੱਧ ਹੈ।"
      : outcome === "Both numbers have the same value."
        ? hi ? "A और B दोनों का मान समान है।" : "A ਅਤੇ B ਦੋਵਾਂ ਦਾ ਮੁੱਲ ਇੱਕੋ ਹੈ।"
        : hi
          ? "दिए गए मानों से निर्णय नहीं किया जा सकता।"
          : "ਦਿੱਤੇ ਮੁੱਲਾਂ ਤੋਂ ਫੈਸਲਾ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।";

  return hi
    ? `A का मान ${valueA} है; B का मान ${valueB} है; ${outcomeText}`
    : `A ਦਾ ਮੁੱਲ ${valueA} ਹੈ; B ਦਾ ਮੁੱਲ ${valueB} ਹੈ; ${outcomeText}`;
}

const DATA_SUFFICIENCY_TRANSLATIONS = Object.freeze({
  "hi-IN": Object.freeze({
    "Statement I alone is sufficient, but Statement II alone is not.":
      "केवल कथन I पर्याप्त है, लेकिन केवल कथन II पर्याप्त नहीं है।",
    "Statement II alone is sufficient, but Statement I alone is not.":
      "केवल कथन II पर्याप्त है, लेकिन केवल कथन I पर्याप्त नहीं है।",
    "Both statements together are sufficient, but neither statement alone is sufficient.":
      "दोनों कथन मिलकर पर्याप्त हैं, लेकिन कोई भी कथन अकेले पर्याप्त नहीं है।",
    "Even both statements together are not sufficient.":
      "दोनों कथन मिलकर भी पर्याप्त नहीं हैं।",
  }),
  "pa-IN": Object.freeze({
    "Statement I alone is sufficient, but Statement II alone is not.":
      "ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ, ਪਰ ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
    "Statement II alone is sufficient, but Statement I alone is not.":
      "ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ, ਪਰ ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
    "Both statements together are sufficient, but neither statement alone is sufficient.":
      "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਕਾਫ਼ੀ ਹਨ, ਪਰ ਕੋਈ ਵੀ ਕਥਨ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
    "Even both statements together are not sufficient.":
      "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ।",
  }),
}) as const;

export function translateNumCp005LocalizedOptionValue(
  qlId: NumCp005PermanentQlId,
  value: string,
  locale: NumCp005TranslatedLocale,
): string {
  if (qlId === "NUM-QL-068") {
    const comparison = translateComparisonOption(value, locale);
    if (comparison) return comparison;
  }

  if (qlId === "NUM-QL-069") {
    const translated = (
      DATA_SUFFICIENCY_TRANSLATIONS[locale] as Readonly<Record<string, string>>
    )[value];
    if (translated) return translated;
  }

  return translateNumCp005OptionValue(value, locale);
}
