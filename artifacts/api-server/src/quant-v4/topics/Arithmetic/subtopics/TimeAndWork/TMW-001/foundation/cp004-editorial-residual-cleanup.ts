import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";

function clean(value: string, language: TmwLocalizedLanguage): string {
  const replacements: readonly (readonly [string, string])[] = language === "hi"
    ? [
        ["इसके बाद उसकी भागीदारी समाप्त हो गई", "इसके बाद उसे काम से हटा दिया गया"],
        ["इसके बाद उसकी भागीदारी समाप्त हो जाती है", "इसके बाद उसे काम से हटा दिया जाता है"],
        ["इसके बाद उसकी भागीदारी शुरू हो गई", "इसके बाद उसे काम में लगा दिया गया"],
        ["इसके बाद उसकी भागीदारी शुरू हो जाती है", "इसके बाद उसे काम में लगा दिया जाता है"],
        ["सभी सक्रिय सदस्य", "सभी सदस्य"],
        ["भागीदारी शुरू होने", "काम में जुड़ने"],
        ["भागीदारी समाप्त होने", "काम से हटने"],
        ["भागीदारी शुरू", "काम में जुड़ना"],
        ["भागीदारी समाप्त", "काम से हटना"],
      ]
    : [
        ["ਇਸ ਤੋਂ ਬਾਅਦ ਉਸ ਦੀ ਭਾਗੀਦਾਰੀ ਖਤਮ ਹੋ ਗਈ", "ਇਸ ਤੋਂ ਬਾਅਦ ਉਸ ਨੂੰ ਕੰਮ ਤੋਂ ਹਟਾ ਦਿੱਤਾ ਗਿਆ"],
        ["ਇਸ ਤੋਂ ਬਾਅਦ ਉਸ ਦੀ ਭਾਗੀਦਾਰੀ ਖਤਮ ਹੋ ਜਾਂਦੀ ਹੈ", "ਇਸ ਤੋਂ ਬਾਅਦ ਉਸ ਨੂੰ ਕੰਮ ਤੋਂ ਹਟਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ"],
        ["ਇਸ ਤੋਂ ਬਾਅਦ ਉਸ ਦੀ ਭਾਗੀਦਾਰੀ ਸ਼ੁਰੂ ਹੋ ਗਈ", "ਇਸ ਤੋਂ ਬਾਅਦ ਉਸ ਨੂੰ ਕੰਮ ਵਿੱਚ ਲਾ ਦਿੱਤਾ ਗਿਆ"],
        ["ਇਸ ਤੋਂ ਬਾਅਦ ਉਸ ਦੀ ਭਾਗੀਦਾਰੀ ਸ਼ੁਰੂ ਹੋ ਜਾਂਦੀ ਹੈ", "ਇਸ ਤੋਂ ਬਾਅਦ ਉਸ ਨੂੰ ਕੰਮ ਵਿੱਚ ਲਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ"],
        ["ਉਸ ਤੋਂ ਬਾਅਦ ਉਸ ਦੀ ਭਾਗੀਦਾਰੀ ਖਤਮ ਹੋ ਗਈ", "ਉਸ ਤੋਂ ਬਾਅਦ ਉਸ ਨੂੰ ਕੰਮ ਤੋਂ ਹਟਾ ਦਿੱਤਾ ਗਿਆ"],
        ["ਉਸ ਤੋਂ ਬਾਅਦ ਉਸ ਦੀ ਭਾਗੀਦਾਰੀ ਖਤਮ ਹੋ ਜਾਂਦੀ ਹੈ", "ਉਸ ਤੋਂ ਬਾਅਦ ਉਸ ਨੂੰ ਕੰਮ ਤੋਂ ਹਟਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ"],
        ["ਉਸ ਤੋਂ ਬਾਅਦ ਉਸ ਦੀ ਭਾਗੀਦਾਰੀ ਸ਼ੁਰੂ ਹੋ ਗਈ", "ਉਸ ਤੋਂ ਬਾਅਦ ਉਸ ਨੂੰ ਕੰਮ ਵਿੱਚ ਲਾ ਦਿੱਤਾ ਗਿਆ"],
        ["ਉਸ ਤੋਂ ਬਾਅਦ ਉਸ ਦੀ ਭਾਗੀਦਾਰੀ ਸ਼ੁਰੂ ਹੋ ਜਾਂਦੀ ਹੈ", "ਉਸ ਤੋਂ ਬਾਅਦ ਉਸ ਨੂੰ ਕੰਮ ਵਿੱਚ ਲਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ"],
        ["ਸਾਰੇ ਸਰਗਰਮ ਮੈਂਬਰ", "ਸਾਰੇ ਮੈਂਬਰ"],
        ["ਭਾਗੀਦਾਰੀ ਸ਼ੁਰੂ ਹੋਣ", "ਕੰਮ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਣ"],
        ["ਭਾਗੀਦਾਰੀ ਖਤਮ ਹੋਣ", "ਕੰਮ ਤੋਂ ਹਟਣ"],
        ["ਭਾਗੀਦਾਰੀ ਸ਼ੁਰੂ", "ਕੰਮ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਣਾ"],
        ["ਭਾਗੀਦਾਰੀ ਖਤਮ", "ਕੰਮ ਤੋਂ ਹਟਣਾ"],
      ];

  return replacements.reduce((updated, [from, to]) => updated.replaceAll(from, to), value);
}

export function cleanTmwCp004EditorialResiduals(
  question: TmwLocalizedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion {
  return {
    ...question,
    stem: clean(question.stem, language),
    explanation: {
      ...question.explanation,
      opening: clean(question.explanation.opening, language),
      shortcut: {
        ...question.explanation.shortcut,
        title: clean(question.explanation.shortcut.title, language),
        steps: question.explanation.shortcut.steps.map((step) => clean(step, language)),
      },
      commonTrap: {
        ...question.explanation.commonTrap,
        explanation: clean(question.explanation.commonTrap.explanation, language),
      },
      conclusion: clean(question.explanation.conclusion, language),
    },
  };
}
