import type { SemanticLanguage } from "./anchorLexicon";

export const REASONING_LEXICON = {
  votes_remaining: {
    en: "Votes remaining for other candidates",
    hi: "अन्य उम्मीदवारों के वोट",
    pa: "ਹੋਰ ਉਮੀਦਵਾਰਾਂ ਦੇ ਵੋਟ",
  },
  winning_margin: {
    en: "Winning margin",
    hi: "जीत का अंतर",
    pa: "ਜਿੱਤ ਦਾ ਅੰਤਰ",
  },
  vote_difference: {
    en: "Vote difference",
    hi: "वोटों का अंतर",
    pa: "ਵੋਟਾਂ ਦਾ ਅੰਤਰ",
  },
  valid_votes: {
    en: "Total valid votes",
    hi: "कुल वैध वोट",
    pa: "ਕੁੱਲ ਯੋਗ ਵੋਟ",
  },
  maximum_marks: {
    en: "Maximum marks",
    hi: "अधिकतम अंक",
    pa: "ਵੱਧ ਤੋਂ ਵੱਧ ਅੰਕ",
  },
  profit_percentage: {
    en: "Profit percentage",
    hi: "लाभ प्रतिशत",
    pa: "ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ",
  },
  loss_percentage: {
    en: "Loss percentage",
    hi: "हानि प्रतिशत",
    pa: "ਨੁਕਸਾਨ ਪ੍ਰਤੀਸ਼ਤ",
  },
  final_population: {
    en: "Final population",
    hi: "अंतिम जनसंख्या",
    pa: "ਅੰਤਿਮ ਆਬਾਦੀ",
  },
  required_reduction: {
    en: "Required reduction",
    hi: "आवश्यक कमी",
    pa: "ਲੋੜੀਂਦੀ ਕਮੀ",
  },
  required_value: {
    en: "Required value",
    hi: "आवश्यक मान",
    pa: "ਲੋੜੀਂਦਾ ਮੁੱਲ",
  },
} as const;

export function localizeReasoningFragments(
  text: string,
  language: SemanticLanguage,
) {
  if (language === "en") return text;

  let output = text;
  for (const entry of Object.values(REASONING_LEXICON)) {
    output = output.replaceAll(entry.en, entry[language]);
  }
  return output;
}

export function untranslatedReasoningFragments(
  text: string | undefined,
  language: Exclude<SemanticLanguage, "en">,
) {
  const value = String(text ?? "");
  return Object.values(REASONING_LEXICON)
    .map((entry) => entry.en)
    .filter((fragment) => value.includes(fragment));
}

