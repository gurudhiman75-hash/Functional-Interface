import { generateLpCp04LocalizedBatchV1, LP_CP04_HI_PA_LOCALIZATION_REVIEW_V1, type LpCp04LocalizedCaselet, type LpCp04LocalizedLanguage } from "./lp-cp04-localization-v1.ts";

export const LP_CP04_HI_PA_LOCALIZATION_REVIEW_V2 = Object.freeze({
  authorityId: "LP_CP04_HI_PA_LOCALIZATION_REVIEW_V2" as const,
  parentAuthorityId: LP_CP04_HI_PA_LOCALIZATION_REVIEW_V1.authorityId,
  sourceEnglishAuthorityId: LP_CP04_HI_PA_LOCALIZATION_REVIEW_V1.sourceEnglishAuthorityId,
  packageId: "LP-CP04-COUNTERFACTUAL" as const,
  checkpointId: "LP-CP-012" as const,
  permanentQlIds: ["LP-QL-047"] as const,
  supportedLanguages: ["hi", "pa"] as const,
  localizationMethod: "SEMANTIC_REBUILD_PLUS_NATIVE_EDITORIAL_POLISH" as const,
  status: "HUMAN_REVIEW_CANDIDATE_V2" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

function polishHindi(text: string): string {
  return text
    .replace(/छह व्यक्ति हैं: ([^।]+)। तीन समूह हैं: /gu, "इन छह व्यक्तियों के नाम हैं: $1। तीन समूह हैं: ")
    .replace(/सात व्यक्ति हैं: ([^।]+)। कुल चार लोगों का चयन किया जाएगा।/gu, "इनके नाम हैं: $1। कुल चार लोगों का चयन किया जाएगा।")
    .replace(/यदि ([A-Za-z]+) चुना जाता है, तो ([A-Za-z]+) का चयन भी होगा।/gu, "यदि $1 का चयन होता है, तो $2 का चयन भी होगा।")
    .replace(/\*\*([A-Za-z]+) नहीं चुना गया है।\*\*/gu, "**$1 का चयन नहीं हुआ है।**")
    .replace(/\*\*([A-Za-z]+) चुना गया है।\*\*/gu, "**$1 का चयन हुआ है।**")
    .replace(/\*\*([A-Za-z]+)\*\* नहीं चुना गया है/gu, "**$1** का चयन नहीं हुआ है")
    .replace(/\*\*([A-Za-z]+)\*\* चुना गया है/gu, "**$1** का चयन हुआ है");
}

function polishPunjabi(text: string): string {
  return text
    .replace(/ਛੇ ਵਿਅਕਤੀ ਹਨ: ([^।]+)। ਤਿੰਨ ਸਮੂਹ ਹਨ: /gu, "ਇਨ੍ਹਾਂ ਛੇ ਵਿਅਕਤੀਆਂ ਦੇ ਨਾਮ ਹਨ: $1। ਤਿੰਨ ਸਮੂਹ ਹਨ: ")
    .replace(/ਸੱਤ ਵਿਅਕਤੀ ਹਨ: ([^।]+)। ਕੁੱਲ ਚਾਰ ਲੋਕ ਚੁਣੇ ਜਾਣਗੇ।/gu, "ਇਨ੍ਹਾਂ ਦੇ ਨਾਮ ਹਨ: $1। ਕੁੱਲ ਚਾਰ ਲੋਕ ਚੁਣੇ ਜਾਣਗੇ।")
    .replace(/ਜੇ ([A-Za-z]+) ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ, ਤਾਂ ([A-Za-z]+) ਵੀ ਚੁਣਿਆ ਜਾਵੇਗਾ।/gu, "ਜੇ $1 ਦੀ ਚੋਣ ਹੁੰਦੀ ਹੈ, ਤਾਂ $2 ਦੀ ਚੋਣ ਵੀ ਹੋਵੇਗੀ।")
    .replace(/\*\*([A-Za-z]+) ਨਹੀਂ ਚੁਣਿਆ ਗਿਆ ਹੈ।\*\*/gu, "**$1 ਦੀ ਚੋਣ ਨਹੀਂ ਹੋਈ ਹੈ।**")
    .replace(/\*\*([A-Za-z]+) ਚੁਣਿਆ ਗਿਆ ਹੈ।\*\*/gu, "**$1 ਦੀ ਚੋਣ ਹੋਈ ਹੈ।**")
    .replace(/\*\*([A-Za-z]+)\*\* ਨਹੀਂ ਚੁਣਿਆ ਗਿਆ ਹੈ/gu, "**$1** ਦੀ ਚੋਣ ਨਹੀਂ ਹੋਈ ਹੈ")
    .replace(/\*\*([A-Za-z]+)\*\* ਚੁਣਿਆ ਗਿਆ ਹੈ/gu, "**$1** ਦੀ ਚੋਣ ਹੋਈ ਹੈ");
}

function polish(language: LpCp04LocalizedLanguage, text: string): string {
  return language === "hi" ? polishHindi(text) : polishPunjabi(text);
}

function polishCaselet(caselet: LpCp04LocalizedCaselet): LpCp04LocalizedCaselet {
  const language = caselet.language;
  return {
    ...caselet,
    scenario: polish(language, caselet.scenario),
    learnerFacingClues: caselet.learnerFacingClues.map((clue) => polish(language, clue)),
    counterfactualChild: {
      ...caselet.counterfactualChild,
      stem: polish(language, caselet.counterfactualChild.stem),
      options: caselet.counterfactualChild.options.map((option) => polish(language, option)),
      answer: polish(language, caselet.counterfactualChild.answer),
      explanation: {
        summary: polish(language, caselet.counterfactualChild.explanation.summary),
        lines: caselet.counterfactualChild.explanation.lines.map((line) => polish(language, line)),
      },
    },
  };
}

export function generateLpCp04LocalizedBatchV2(language: LpCp04LocalizedLanguage, seed = "lp-cp04-localization-v2", count = 9): LpCp04LocalizedCaselet[] {
  return generateLpCp04LocalizedBatchV1(language, seed, count).map(polishCaselet);
}
