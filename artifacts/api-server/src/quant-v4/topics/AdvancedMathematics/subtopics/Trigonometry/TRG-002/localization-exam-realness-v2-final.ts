import { createHash } from "node:crypto";

import {
  TRG_002_EXAM_REALNESS_LOCALIZATION_VERSION,
  TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS,
  generateExamRealLocalizedTrg002Question as generateRemediatedQuestion,
  type Trg002ExamRealnessLocale,
} from "./localization-exam-realness-v2-remediated";

export {
  TRG_002_EXAM_REALNESS_LOCALIZATION_VERSION,
  TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS,
};
export type { Trg002ExamRealnessLocale };

type AnyQuestion = Record<string, any>;

function stableJson(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current);
}
function sha256(value: unknown) {
  return createHash("sha256").update(typeof value === "string" ? value : stableJson(value), "utf8").digest("hex");
}

function editorialPolish(text: string, locale: Trg002ExamRealnessLocale) {
  if (locale === "hi-IN") {
    return text
      .replaceAll("दृष्टि-रेखाs", "दृष्टि-रेखाएँ")
      .replaceAll("दोनों दृष्टि-रेखाएँ को साथ हल करें", "दोनों दृष्टि-रेखाओं के समीकरणों को साथ हल करें")
      .replaceAll("ऊँचाइयों का ऊँचाई का अंतर", "दोनों ऊँचाइयों का अंतर")
      .replaceAll("ऊँचाइयों का ऊँचाई में अंतर", "दोनों ऊँचाइयों का अंतर")
      .replaceAll("छत के स्तर का ऊँचाई का अंतर/ऊँचाई में अंतर", "दोनों छतों के बीच ऊँचाई का अंतर")
      .replaceAll("दो छतों के बीच का ऊँचाई-अंतर", "दो छतों के बीच ऊँचाई का अंतर")
      .replaceAll("के ऊपर का ऊँचाई का अंतर", "से ऊपर की ऊँचाई")
      .replaceAll("ऊपर का ऊँचाई का अंतर", "ऊपर की ऊँचाई")
      .replaceAll("केवल ऊँचाई का अंतर का उपयोग करें", "केवल ऊँचाई के अंतर का उपयोग करें")
      .replaceAll("मीनार की पूरी ऊँचाई को केवल ऊपर वाले ऊँचाई का अंतर के बराबर न मानें", "मीनार की पूरी ऊँचाई को केवल छत के स्तर से ऊपर की ऊँचाई के बराबर न मानें")
      .replaceAll("खंभे/पेड़ की ऊँचाई", "खंभे की ऊँचाई")
      .replaceAll("निकट और दूर दूरी में दिया हुआ अंतर", "निकट और दूर बिंदुओं की दूरियों के बीच दिया हुआ अंतर")
      .replaceAll("दूर जाने की दूरी अंतिम दूरी घटाकर प्रारंभिक दूरी है।", "दूर चली गई दूरी = अंतिम दूरी − प्रारंभिक दूरी।")
      .replaceAll("एक ही ओर दो बिंदुओं की दूरी = बड़ी मीनार से दूरी − छोटी मीनार से दूरी।", "एक ही ओर दो बिंदुओं के बीच दूरी = बड़ी दूरी − छोटी दूरी।")
      .replaceAll("दूर वाले कोण से दूर दूरी निकालें", "दूर वाले कोण से दूर बिंदु की दूरी निकालें")
      .replaceAll("उससे चली दूरी कम है", "उससे चली दूरी जितनी कम है")
      .replaceAll("आँख के ऊपर वाली ऊँचाई", "आँख के स्तर से ऊपर की ऊँचाई")
      .replaceAll("छत-से-छत त्रिभुज में", "दोनों छतों को जोड़ने वाले समकोण त्रिभुज में")
      .replaceAll("नीचे आधार और ऊपर शीर्ष की दोनों दृष्टि-रेखाओं के समीकरणों को साथ हल करें।", "आधार के अवनमन और शीर्ष के उन्नयन से बने दोनों समीकरणों को साथ हल करें।")
      .replaceAll("एक ही क्षैतिज दूरी पर दो दृष्टि-रेखा ऊँचाइयों का अंतर ऊपर लगे मस्तूल की ऊँचाई देता है।", "एक ही क्षैतिज दूरी पर छत और मस्तूल के शीर्ष तक प्राप्त ऊँचाइयों का अंतर मस्तूल की ऊँचाई देता है।")
      .replaceAll("ऊपरी वस्तु की ऊँचाई पाने के लिए दो कुल स्तर घटाएँ।", "मस्तूल की ऊँचाई के लिए मस्तूल के शीर्ष की कुल ऊँचाई में से छत की ऊँचाई घटाएँ।")
      .replaceAll("मस्तूल की ऊँचाई = d(tan ऊपरी कोण − tan छत कोण); इसी से d निकालें।", "मस्तूल की ऊँचाई = d[tan(मस्तूल के शीर्ष का कोण) − tan(छत का कोण)]; इससे d निकालें।")
      .replaceAll("दोनों tan मान का अंतर लें; यही मस्तूल का लंबवत हिस्सा है।", "दोनों tan मानों का अंतर लें; इसे d से गुणा करने पर मस्तूल की ऊँचाई मिलती है।")
      .replaceAll("टैन", "tan")
      .replaceAll("tan θ में लंबवत भुजा आँख के स्तर से इमारत के शीर्ष तक की ऊँचाई होती है।", "tan θ = आँख के स्तर से इमारत के शीर्ष तक की ऊँचाई / क्षैतिज दूरी।");
  }
  return text
    .replaceAll("ਡਿਪ੍ਰੈਸ਼ਨ", "ਨਿਵਾਣ")
    .replaceAll("ਅਵਨਮਨ ਕੋਣ", "ਨਿਵਾਣ ਕੋਣ")
    .replaceAll("ਉਚਾਈ ਕੋਣ", "ਉਚਾਣ ਕੋਣ")
    .replaceAll("ਝੰਡੇ ਦਾ ਡੰਡਾ ਦੀ", "ਝੰਡੇ ਦੇ ਡੰਡੇ ਦੀ")
    .replaceAll("ਝੰਡੇ ਦਾ ਡੰਡਾ ਦੇ", "ਝੰਡੇ ਦੇ ਡੰਡੇ ਦੇ")
    .replaceAll("ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾs", "ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾਵਾਂ")
    .replaceAll("ਦੋਵੇਂ ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾਵਾਂ ਇਕੱਠੇ ਹੱਲ ਕਰੋ", "ਦੋਵੇਂ ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾਵਾਂ ਦੇ ਸਮੀਕਰਨ ਇਕੱਠੇ ਹੱਲ ਕਰੋ")
    .replaceAll("ਉਚਾਈਆਂ ਦਾ ਉਚਾਈ ਦਾ ਅੰਤਰ", "ਦੋਵੇਂ ਉਚਾਈਆਂ ਦਾ ਅੰਤਰ")
    .replaceAll("ਉਚਾਈਆਂ ਦਾ ਉਚਾਈ ਵਿੱਚ ਅੰਤਰ", "ਦੋਵੇਂ ਉਚਾਈਆਂ ਦਾ ਅੰਤਰ")
    .replaceAll("ਛੱਤ ਦੇ ਪੱਧਰ ਦਾ ਉਚਾਈ ਦਾ ਅੰਤਰ/ਉਚਾਈ ਵਿੱਚ ਅੰਤਰ", "ਦੋਵੇਂ ਛੱਤਾਂ ਵਿਚਕਾਰ ਉਚਾਈ ਦਾ ਅੰਤਰ")
    .replaceAll("ਦੋ ਛੱਤਾਂ ਵਿਚਕਾਰ ਉਚਾਈ-ਅੰਤਰ", "ਦੋ ਛੱਤਾਂ ਵਿਚਕਾਰ ਉਚਾਈ ਦਾ ਅੰਤਰ")
    .replaceAll("ਅੱਖ ਦੇ ਪੱਧਰ ਤੋਂ ਉੱਪਰ ਦਾ ਉਚਾਈ ਦਾ ਅੰਤਰ", "ਅੱਖ ਦੇ ਪੱਧਰ ਤੋਂ ਉੱਪਰ ਦੀ ਉਚਾਈ")
    .replaceAll("ਉੱਪਰ ਵਾਲਾ ਉਚਾਈ ਦਾ ਅੰਤਰ", "ਉੱਪਰਲੀ ਉਚਾਈ")
    .replaceAll("ਉੱਪਰ ਵਾਲੇ ਉਚਾਈ ਦਾ ਅੰਤਰ", "ਉੱਪਰਲੀ ਉਚਾਈ ਦੇ ਅੰਤਰ")
    .replaceAll("ਖੰਭੇ/ਦਰੱਖਤ ਦੀ ਉਚਾਈ", "ਖੰਭੇ ਦੀ ਉਚਾਈ")
    .replaceAll("ਨੇੜਲੀ ਅਤੇ ਦੂਰਲੀ ਦੂਰੀ ਵਿੱਚ ਦਿੱਤਾ ਅੰਤਰ", "ਨੇੜਲੇ ਅਤੇ ਦੂਰਲੇ ਬਿੰਦੂਆਂ ਦੀਆਂ ਦੂਰੀਆਂ ਵਿਚਕਾਰ ਦਿੱਤਾ ਅੰਤਰ")
    .replaceAll("ਦੂਰ ਜਾਣ ਦਾ ਫਾਸਲਾ ਅੰਤਿਮ ਦੂਰੀ ਘਟਾ ਕੇ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ਹੈ।", "ਦੂਰ ਤੁਰਿਆ ਫਾਸਲਾ = ਅੰਤਿਮ ਦੂਰੀ − ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ।")
    .replaceAll("ਇੱਕੋ ਪਾਸੇ ਦੋ ਬਿੰਦੂਆਂ ਦੀ ਦੂਰੀ = ਵੱਡੀ ਮੀਨਾਰ ਤੋਂ ਦੂਰੀ − ਛੋਟੀ ਮੀਨਾਰ ਤੋਂ ਦੂਰੀ।", "ਇੱਕੋ ਪਾਸੇ ਦੋ ਬਿੰਦੂਆਂ ਵਿਚਕਾਰ ਦੂਰੀ = ਵੱਡੀ ਦੂਰੀ − ਛੋਟੀ ਦੂਰੀ।")
    .replaceAll("ਨੇੜਲੇ ਬਿੰਦੂ ਦੀ ਪਤਾ ਦੂਰੀ", "ਨੇੜਲੇ ਬਿੰਦੂ ਦੀ ਦਿੱਤੀ ਦੂਰੀ")
    .replaceAll("ਪਤਾ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ", "ਦਿੱਤੀ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ")
    .replaceAll("ਪਹਿਲੀ ਪਤਾ ਦੂਰੀ", "ਦਿੱਤੀ ਪਹਿਲੀ ਦੂਰੀ")
    .replaceAll("ਪਤਾ ਉਚਾਈ", "ਦਿੱਤੀ ਉਚਾਈ")
    .replaceAll("ਉਸ ਤੋਂ ਤੁਰਿਆ ਫਾਸਲਾ ਘੱਟ ਹੈ", "ਉਸ ਤੋਂ ਤੁਰੇ ਫਾਸਲੇ ਜਿੰਨੀ ਘੱਟ ਹੈ")
    .replaceAll("ਅੱਖ ਤੋਂ ਉੱਪਰ ਵਾਲੀ ਉਚਾਈ", "ਅੱਖ ਦੇ ਪੱਧਰ ਤੋਂ ਉੱਪਰ ਦੀ ਉਚਾਈ")
    .replaceAll("ਛੱਤ-ਤੋਂ-ਛੱਤ ਤਿਕੋਣ ਵਿੱਚ", "ਦੋਵੇਂ ਛੱਤਾਂ ਨੂੰ ਜੋੜਦੇ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ")
    .replaceAll("ਅਧਾਰ ਤੱਕ ਅਵਨਮਨ ਵਾਲਾ ਤਿਕੋਣ", "ਅਧਾਰ ਤੱਕ ਨਿਵਾਣ ਵਾਲਾ ਤਿਕੋਣ")
    .replaceAll("ਹੇਠਾਂ ਅਧਾਰ ਅਤੇ ਉੱਪਰ ਚੋਟੀ ਦੀਆਂ ਦੋਵੇਂ ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾਵਾਂ ਦੇ ਸਮੀਕਰਨ ਇਕੱਠੇ ਹੱਲ ਕਰੋ।", "ਅਧਾਰ ਦੇ ਨਿਵਾਣ ਅਤੇ ਚੋਟੀ ਦੇ ਉਚਾਣ ਤੋਂ ਬਣੇ ਦੋਵੇਂ ਸਮੀਕਰਨ ਇਕੱਠੇ ਹੱਲ ਕਰੋ।")
    .replaceAll("ਖਿਤਿਜੀ ਲੱਗਦੀ ਭੁਜਾ", "ਖਿਤਿਜੀ ਭੁਜਾ")
    .replaceAll("ਇੱਕੋ ਖਿਤਿਜੀ ਦੂਰੀ 'ਤੇ ਦੋ ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾ ਉਚਾਈਆਂ ਦਾ ਅੰਤਰ ਉੱਪਰ ਲੱਗੇ ਮਸਤੂਲ ਦੀ ਉਚਾਈ ਦਿੰਦਾ ਹੈ।", "ਇੱਕੋ ਖਿਤਿਜੀ ਦੂਰੀ 'ਤੇ ਛੱਤ ਅਤੇ ਮਸਤੂਲ ਦੀ ਚੋਟੀ ਤੱਕ ਮਿਲਣ ਵਾਲੀਆਂ ਉਚਾਈਆਂ ਦਾ ਅੰਤਰ ਮਸਤੂਲ ਦੀ ਉਚਾਈ ਹੁੰਦਾ ਹੈ।")
    .replaceAll("ਉੱਪਰੀ ਵਸਤੂ ਦੀ ਉਚਾਈ ਲਈ ਦੋ ਕੁੱਲ ਪੱਧਰ ਘਟਾਓ।", "ਮਸਤੂਲ ਦੀ ਉਚਾਈ ਲਈ ਮਸਤੂਲ ਦੀ ਚੋਟੀ ਦੀ ਕੁੱਲ ਉਚਾਈ ਵਿੱਚੋਂ ਛੱਤ ਦੀ ਉਚਾਈ ਘਟਾਓ।")
    .replaceAll("ਮਸਤੂਲ ਦੀ ਉਚਾਈ = d(tan ਉੱਪਰਲਾ ਕੋਣ − tan ਛੱਤ ਕੋਣ); ਇਸੇ ਤੋਂ d ਕੱਢੋ।", "ਮਸਤੂਲ ਦੀ ਉਚਾਈ = d[tan(ਮਸਤੂਲ ਦੀ ਚੋਟੀ ਦਾ ਕੋਣ) − tan(ਛੱਤ ਦਾ ਕੋਣ)]; ਇੱਥੋਂ d ਕੱਢੋ।")
    .replaceAll("ਦੋਵੇਂ tan ਮੁੱਲ ਦਾ ਅੰਤਰ ਲਓ; ਇਹੀ ਮਸਤੂਲ ਦਾ ਲੰਬਵਾਂ ਹਿੱਸਾ ਹੈ।", "ਦੋਵੇਂ tan ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ਲਓ; ਇਸ ਨੂੰ d ਨਾਲ ਗੁਣਾ ਕਰਨ 'ਤੇ ਮਸਤੂਲ ਦੀ ਉਚਾਈ ਮਿਲਦੀ ਹੈ।")
    .replaceAll("ਟੈਨ", "tan")
    .replaceAll("tan θ ਵਿੱਚ ਲੰਬ ਭੁਜਾ ਅੱਖ ਦੇ ਪੱਧਰ ਤੋਂ ਇਮਾਰਤ ਦੀ ਚੋਟੀ ਤੱਕ ਦੀ ਉਚਾਈ ਹੁੰਦੀ ਹੈ।", "tan θ = ਅੱਖ ਦੇ ਪੱਧਰ ਤੋਂ ਇਮਾਰਤ ਦੀ ਚੋਟੀ ਤੱਕ ਦੀ ਉਚਾਈ / ਖਿਤਿਜੀ ਦੂਰੀ।");
}

function polishExplanation(explanation: AnyQuestion, locale: Trg002ExamRealnessLocale) {
  return {
    ...explanation,
    keyRule: editorialPolish(explanation.keyRule, locale),
    steps: explanation.steps.map((step: AnyQuestion) => ({ ...step, body: editorialPolish(step.body, locale) })),
    shortcut: editorialPolish(explanation.shortcut, locale),
    traps: explanation.traps.map((trap: string) => editorialPolish(trap, locale)),
  };
}

export function generateExamRealLocalizedTrg002Question(qlId: string, seed: string, locale: Trg002ExamRealnessLocale) {
  const base: AnyQuestion = generateRemediatedQuestion(qlId, seed, locale);
  const stem = editorialPolish(base.stem, locale);
  const explanation = polishExplanation(base.explanation, locale);
  const localizationFingerprint = sha256({
    version: TRG_002_EXAM_REALNESS_LOCALIZATION_VERSION,
    locale,
    qlId,
    seed,
    canonicalSemanticFingerprint: base.localizationProof.canonicalSemanticFingerprint,
    stem,
    explanation,
  });
  return {
    ...base,
    stem,
    explanation,
    localizationProof: {
      ...base.localizationProof,
      localizationFingerprint,
      finalExamLanguageEditorialPolish: true,
      grammarRemediationV3: true,
      grammarManualPolishV31: true,
    },
    realnessRemediation: {
      ...base.realnessRemediation,
      finalExamLanguageEditorialPolish: true,
      grammarRemediationV3: true,
      grammarManualPolishV31: true,
    },
  };
}

export function buildTrg002ExamRealnessV2ReviewBank(locale: Trg002ExamRealnessLocale, seedsPerQl = 12) {
  return TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS.flatMap((qlId) =>
    Array.from({ length: seedsPerQl }, (_, index) => generateExamRealLocalizedTrg002Question(
      qlId,
      `trg002-exam-realness-v2-${String(index + 1).padStart(2, "0")}`,
      locale,
    )),
  );
}
