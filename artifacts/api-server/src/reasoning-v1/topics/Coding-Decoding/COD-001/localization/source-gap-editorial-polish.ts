interface QuestionLike {
  locale: string;
  explanation: unknown;
  [key: string]: unknown;
}

function polishString(text: string, locale: string): string {
  if (locale === "hi-IN") {
    return text
      .replace("हर अगले अक्षर पर चाल 1 स्थान बढ़ाएँ।", "हर अगले अक्षर को पिछले अक्षर से 1 स्थान अधिक उसी दिशा में ले जाएँ।")
      .replace("पर बढ़ती चाल लगाने से", "के अक्षरों को इसी बढ़ते क्रम में ले जाने पर")
      .replace("उसका विपरीत वर्णमाला अक्षर", "वर्णमाला में उसका विपरीत अक्षर")
      .replace(/([A-Z0-9])\.$/u, "$1।");
  }

  if (locale === "pa-IN") {
    return text
      .replace("ਹਰ ਅਗਲੇ ਅੱਖਰ ਲਈ ਚਾਲ 1 ਥਾਂ ਵਧਾਓ।", "ਹਰ ਅਗਲੇ ਅੱਖਰ ਨੂੰ ਪਿਛਲੇ ਅੱਖਰ ਨਾਲੋਂ 1 ਥਾਂ ਵੱਧ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਲਿਜਾਓ।")
      .replace("ਉੱਤੇ ਵਧਦੀ ਚਾਲ ਲਗਾਉਣ ਨਾਲ", "ਦੇ ਅੱਖਰਾਂ ਨੂੰ ਇਸੇ ਵਧਦੇ ਕ੍ਰਮ ਵਿੱਚ ਲਿਜਾਣ ਨਾਲ")
      .replaceAll("ਵਿਆੰਜਨ", "ਵਿਅੰਜਨ")
      .replace("ਉਸ ਦਾ ਉਲਟ ਵਰਣਮਾਲਾ ਅੱਖਰ", "ਵਰਣਮਾਲਾ ਵਿੱਚ ਉਸ ਦਾ ਉਲਟ ਅੱਖਰ")
      .replace(/([A-Z0-9])\.$/u, "$1।");
  }

  return text;
}

function polishValue(value: unknown, locale: string): unknown {
  if (typeof value === "string") return polishString(value, locale);
  if (Array.isArray(value)) return value.map((item) => polishValue(item, locale));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, polishValue(item, locale)]),
  );
}

export function polishCodSourceGapLocalization<T extends QuestionLike>(question: T): T {
  if (question.locale !== "hi-IN" && question.locale !== "pa-IN") return question;
  return {
    ...question,
    explanation: polishValue(question.explanation, question.locale),
  } as T;
}
