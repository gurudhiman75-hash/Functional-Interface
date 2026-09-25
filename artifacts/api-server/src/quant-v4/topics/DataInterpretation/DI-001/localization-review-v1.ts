import { generateDi001PermanentQuestion } from "./permanent-question-generator";
import type { Di001ExamProfile } from "./types";
import type { Di001V2Question, Di001V2Stimulus, Di001V2TaskKind } from "./table-v2-types";

export type Di001LocalizationLocale = "hi-IN" | "pa-IN";

export const DI001_LOCALIZATION_REVIEW_ID = "DI-001-HI-PA-REVIEW-V1" as const;
export const DI001_LOCALIZATION_RELEASE_ID = "DI-001-HI-PA-FROZEN-V1" as const;

function isHindi(locale: Di001LocalizationLocale) {
  return locale === "hi-IN";
}

function localizedCentre(index: number, locale: Di001LocalizationLocale) {
  return isHindi(locale) ? `केंद्र ${index + 1}` : `ਕੇਂਦਰ ${index + 1}`;
}

function sourceCentreIndex(stimulus: Di001V2Stimulus, value: string) {
  return stimulus.rows.findIndex((row) => row.centre === value);
}

function totalApplicants(stimulus: Di001V2Stimulus) {
  return stimulus.rows.reduce((sum, row) => sum + row.applicants, 0);
}

function totalSelected(stimulus: Di001V2Stimulus) {
  return stimulus.rows.reduce((sum, row) => sum + row.selected, 0);
}

function localizeCentreValue(stimulus: Di001V2Stimulus, value: string, locale: Di001LocalizationLocale) {
  const index = sourceCentreIndex(stimulus, value);
  return index >= 0 ? localizedCentre(index, locale) : value;
}

function localizeRateGapValue(value: string, locale: Di001LocalizationLocale) {
  if (!value.endsWith(" percentage points")) return value;
  const number = value.slice(0, -" percentage points".length);
  return isHindi(locale) ? `${number} प्रतिशत अंक` : `${number} ਪ੍ਰਤੀਸ਼ਤ ਅੰਕ`;
}

export function localizeDi001Stimulus(stimulus: Di001V2Stimulus, locale: Di001LocalizationLocale) {
  return {
    ...stimulus,
    title: isHindi(locale)
      ? "पाँच केंद्रों पर आवेदक और चयनित अभ्यर्थी"
      : "ਪੰਜ ਕੇਂਦਰਾਂ ਵਿੱਚ ਉਮੀਦਵਾਰ ਅਤੇ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰ",
    instruction: isHindi(locale)
      ? "तालिका का अध्ययन कीजिए और दिए गए प्रश्नों के उत्तर दीजिए।"
      : "ਸਾਰਣੀ ਦਾ ਅਧਿਐਨ ਕਰੋ ਅਤੇ ਦਿੱਤੇ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਦਿਓ।",
    columns: isHindi(locale)
      ? ["केंद्र", "आवेदक", "चयनित"]
      : ["ਕੇਂਦਰ", "ਉਮੀਦਵਾਰ", "ਚੁਣੇ ਗਏ"],
    unit: isHindi(locale) ? "अभ्यर्थी" : "ਉਮੀਦਵਾਰ",
    rows: stimulus.rows.map((row, index) => ({
      ...row,
      centre: localizedCentre(index, locale),
    })),
  };
}

function localizeOptions(question: Di001V2Question, stimulus: Di001V2Stimulus, locale: Di001LocalizationLocale) {
  if (question.kind === "LARGEST_SELECTED") {
    return question.options.map((option) => localizeCentreValue(stimulus, option, locale));
  }
  if (question.kind === "SELECTION_RATE_DIFFERENCE") {
    return question.options.map((option) => localizeRateGapValue(option, locale));
  }
  return [...question.options];
}

function localizedSurface(seed: string, kind: string) {
  let value = 0;
  for (const char of `${seed}:${kind}`) value = (value * 31 + char.charCodeAt(0)) >>> 0;
  return value % 3;
}

function localizedStem(question: Di001V2Question, stimulus: Di001V2Stimulus, locale: Di001LocalizationLocale, seed: string) {
  const rows = stimulus.rows;
  const evidence = question.evidence;
  const hi = isHindi(locale);
  const surface = localizedSurface(seed, question.kind);

  switch (question.kind) {
    case "DIRECT_SELECTED": {
      const row = rows[Number(evidence.rowIndex)]!;
      const centre = localizedCentre(Number(evidence.rowIndex), locale);
      const h = [
        `${centre} में कितने अभ्यर्थी चयनित हुए?`,
        `तालिका के अनुसार ${centre} में चयनित अभ्यर्थियों की संख्या कितनी है?`,
        `${centre} के लिए चयनित अभ्यर्थियों की संख्या बताइए।`,
      ];
      const p = [
        `${centre} ਵਿੱਚ ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਚੁਣੇ ਗਏ?`,
        `ਸਾਰਣੀ ਅਨੁਸਾਰ ${centre} ਵਿੱਚ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`,
        `${centre} ਲਈ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ ਦੱਸੋ।`,
      ];
      void row;
      return (hi ? h : p)[surface]!;
    }
    case "TOTAL_APPLICANTS": {
      const h = [
        "सभी पाँच केंद्रों पर आवेदकों की कुल संख्या कितनी है?",
        "पाँचों केंद्रों को मिलाकर कुल कितने आवेदक हैं?",
        "तालिका में दिए गए सभी केंद्रों के आवेदकों का कुल योग ज्ञात कीजिए।",
      ];
      const p = [
        "ਸਾਰੇ ਪੰਜ ਕੇਂਦਰਾਂ ਵਿੱਚ ਉਮੀਦਵਾਰਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?",
        "ਪੰਜਾਂ ਕੇਂਦਰਾਂ ਨੂੰ ਮਿਲਾ ਕੇ ਕੁੱਲ ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਹਨ?",
        "ਸਾਰਣੀ ਵਿੱਚ ਦਿੱਤੇ ਸਾਰੇ ਕੇਂਦਰਾਂ ਦੇ ਉਮੀਦਵਾਰਾਂ ਦਾ ਕੁੱਲ ਜੋੜ ਕੱਢੋ।",
      ];
      return (hi ? h : p)[surface]!;
    }
    case "LARGEST_SELECTED": {
      const h = [
        "किस केंद्र पर चयनित अभ्यर्थियों की संख्या सबसे अधिक है?",
        "तालिका में सबसे अधिक चयनित अभ्यर्थी किस केंद्र पर हैं?",
        "चयनित अभ्यर्थियों की अधिकतम संख्या किस केंद्र पर दर्ज है?",
      ];
      const p = [
        "ਕਿਹੜੇ ਕੇਂਦਰ ਵਿੱਚ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ ਸਭ ਤੋਂ ਵੱਧ ਹੈ?",
        "ਸਾਰਣੀ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਧ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰ ਕਿਹੜੇ ਕੇਂਦਰ ਵਿੱਚ ਹਨ?",
        "ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦੀ ਸਭ ਤੋਂ ਵੱਧ ਗਿਣਤੀ ਕਿਹੜੇ ਕੇਂਦਰ ਵਿੱਚ ਦਰਜ ਹੈ?",
      ];
      return (hi ? h : p)[surface]!;
    }
    case "DIFFERENCE_SELECTED": {
      const a = Number(evidence.rowA), b = Number(evidence.rowB);
      const ca = localizedCentre(a, locale), cb = localizedCentre(b, locale);
      const h = [
        `${ca} और ${cb} में चयनित अभ्यर्थियों की संख्या का अंतर कितना है?`,
        `${ca} तथा ${cb} के चयनित अभ्यर्थियों में कितने का अंतर है?`,
        `${ca} और ${cb} के चयनित अभ्यर्थियों की संख्या में अंतर ज्ञात कीजिए।`,
      ];
      const p = [
        `${ca} ਅਤੇ ${cb} ਵਿੱਚ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅੰਤਰ ਕਿੰਨਾ ਹੈ?`,
        `${ca} ਅਤੇ ${cb} ਦੇ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਵਿੱਚ ਕਿੰਨੇ ਦਾ ਅੰਤਰ ਹੈ?`,
        `${ca} ਅਤੇ ${cb} ਦੇ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਅੰਤਰ ਕੱਢੋ।`,
      ];
      return (hi ? h : p)[surface]!;
    }
    case "PERCENTAGE_SELECTED": {
      const index = Number(evidence.rowIndex);
      const centre = localizedCentre(index, locale);
      const h = [
        `निकटतम पूर्ण प्रतिशत में, ${centre} के आवेदकों में से कितने प्रतिशत चयनित हुए?`,
        `${centre} में चयनित अभ्यर्थी, कुल आवेदकों का लगभग कितने पूर्ण प्रतिशत हैं?`,
        `${centre} का चयन प्रतिशत निकटतम पूर्ण प्रतिशत में ज्ञात कीजिए।`,
      ];
      const p = [
        `ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ, ${centre} ਦੇ ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਚੁਣੇ ਗਏ?`,
        `${centre} ਵਿੱਚ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰ, ਕੁੱਲ ਉਮੀਦਵਾਰਾਂ ਦਾ ਲਗਭਗ ਕਿੰਨੇ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਹਨ?`,
        `${centre} ਦਾ ਚੋਣ ਪ੍ਰਤੀਸ਼ਤ ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਕੱਢੋ।`,
      ];
      return (hi ? h : p)[surface]!;
    }
    case "RATIO_APPLICANTS": {
      const a = Number(evidence.rowA), b = Number(evidence.rowB);
      const ca = localizedCentre(a, locale), cb = localizedCentre(b, locale);
      const h = [
        `${ca} और ${cb} के आवेदकों का अनुपात क्या है?`,
        `${ca} के आवेदकों का ${cb} के आवेदकों से अनुपात ज्ञात कीजिए।`,
        `${ca} : ${cb} के क्रम में आवेदकों का सरल अनुपात क्या है?`,
      ];
      const p = [
        `${ca} ਅਤੇ ${cb} ਦੇ ਉਮੀਦਵਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
        `${ca} ਦੇ ਉਮੀਦਵਾਰਾਂ ਦਾ ${cb} ਦੇ ਉਮੀਦਵਾਰਾਂ ਨਾਲ ਅਨੁਪਾਤ ਕੱਢੋ।`,
        `${ca} : ${cb} ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਉਮੀਦਵਾਰਾਂ ਦਾ ਸਰਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
      ];
      return (hi ? h : p)[surface]!;
    }
    case "AVERAGE_SELECTED": {
      const h = [
        "निकटतम पूर्ण संख्या में, प्रति केंद्र चयनित अभ्यर्थियों की औसत संख्या कितनी है?",
        "पाँचों केंद्रों में चयनित अभ्यर्थियों का औसत निकटतम पूर्ण संख्या में ज्ञात कीजिए।",
        "प्रति केंद्र औसतन लगभग कितने अभ्यर्थी चयनित हुए? निकटतम पूर्ण संख्या दीजिए।",
      ];
      const p = [
        "ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ ਵਿੱਚ, ਪ੍ਰਤੀ ਕੇਂਦਰ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦੀ ਔਸਤ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?",
        "ਪੰਜਾਂ ਕੇਂਦਰਾਂ ਵਿੱਚ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦੀ ਔਸਤ ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ ਵਿੱਚ ਕੱਢੋ।",
        "ਪ੍ਰਤੀ ਕੇਂਦਰ ਔਸਤਨ ਲਗਭਗ ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਚੁਣੇ ਗਏ? ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ ਦਿਓ।",
      ];
      return (hi ? h : p)[surface]!;
    }
    case "OVERALL_SELECTION_PERCENTAGE": {
      const h = [
        "निकटतम पूर्ण प्रतिशत में, सभी पाँच केंद्रों के कुल आवेदकों में से कितने प्रतिशत चयनित हुए?",
        "सभी केंद्रों को मिलाकर चयनित अभ्यर्थी, कुल आवेदकों का लगभग कितने पूर्ण प्रतिशत हैं?",
        "पाँचों केंद्रों का समग्र चयन प्रतिशत निकटतम पूर्ण प्रतिशत में ज्ञात कीजिए।",
      ];
      const p = [
        "ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ, ਸਾਰੇ ਪੰਜ ਕੇਂਦਰਾਂ ਦੇ ਕੁੱਲ ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਚੁਣੇ ਗਏ?",
        "ਸਾਰੇ ਕੇਂਦਰਾਂ ਨੂੰ ਮਿਲਾ ਕੇ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰ, ਕੁੱਲ ਉਮੀਦਵਾਰਾਂ ਦਾ ਲਗਭਗ ਕਿੰਨੇ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਹਨ?",
        "ਪੰਜਾਂ ਕੇਂਦਰਾਂ ਦਾ ਸਮੁੱਚਾ ਚੋਣ ਪ੍ਰਤੀਸ਼ਤ ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਕੱਢੋ।",
      ];
      return (hi ? h : p)[surface]!;
    }
    case "SELECTED_TO_NOT_SELECTED_RATIO": {
      const h = [
        "सभी पाँच केंद्रों में चयनित और चयनित न होने वाले अभ्यर्थियों का अनुपात क्या है?",
        "पाँचों केंद्रों को मिलाकर चयनित : चयनित नहीं का सरल अनुपात ज्ञात कीजिए।",
        "कुल चयनित अभ्यर्थियों का कुल चयनित न होने वाले अभ्यर्थियों से अनुपात क्या है?",
      ];
      const p = [
        "ਸਾਰੇ ਪੰਜ ਕੇਂਦਰਾਂ ਵਿੱਚ ਚੁਣੇ ਗਏ ਅਤੇ ਨਾ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?",
        "ਪੰਜਾਂ ਕੇਂਦਰਾਂ ਨੂੰ ਮਿਲਾ ਕੇ ਚੁਣੇ ਗਏ : ਨਾ ਚੁਣੇ ਗਏ ਦਾ ਸਰਲ ਅਨੁਪਾਤ ਕੱਢੋ।",
        "ਕੁੱਲ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦਾ ਕੁੱਲ ਨਾ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?",
      ];
      return (hi ? h : p)[surface]!;
    }
    case "SELECTION_RATE_DIFFERENCE": {
      const a = Number(evidence.rowA), b = Number(evidence.rowB);
      const ca = localizedCentre(a, locale), cb = localizedCentre(b, locale);
      const h = [
        `निकटतम पूर्ण प्रतिशत अंक में, ${ca} और ${cb} के चयन प्रतिशत में कितना अंतर है?`,
        `${ca} तथा ${cb} के चयन प्रतिशतों का अंतर निकटतम पूर्ण प्रतिशत अंक में ज्ञात कीजिए।`,
        `${ca} और ${cb} के चयन प्रतिशत में कितना अंतर है? उत्तर निकटतम पूर्ण प्रतिशत अंक में दीजिए।`,
      ];
      const p = [
        `ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਅੰਕ ਵਿੱਚ, ${ca} ਅਤੇ ${cb} ਦੇ ਚੋਣ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੈ?`,
        `${ca} ਅਤੇ ${cb} ਦੇ ਚੋਣ ਪ੍ਰਤੀਸ਼ਤਾਂ ਦਾ ਅੰਤਰ ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਅੰਕ ਵਿੱਚ ਕੱਢੋ।`,
        `${ca} ਅਤੇ ${cb} ਦੇ ਚੋਣ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੈ? ਉੱਤਰ ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਅੰਕ ਵਿੱਚ ਦਿਓ।`,
      ];
      return (hi ? h : p)[surface]!;
    }
    default:
      throw new Error(`DI-001 localization has no stem builder for ${question.kind}.`);
  }
}

function localizedExplanation(question: Di001V2Question, stimulus: Di001V2Stimulus, locale: Di001LocalizationLocale) {
  const rows = stimulus.rows;
  const evidence = question.evidence;
  const hi = isHindi(locale);
  const totalA = totalApplicants(stimulus);
  const totalS = totalSelected(stimulus);
  const notSelected = totalA - totalS;
  const pack = (keyHi: string, keyPa: string, stepsHi: string[], stepsPa: string[], workingTable?: { headers: string[]; rows: string[][] }) => ({
    keyIdea: hi ? keyHi : keyPa,
    steps: hi ? stepsHi : stepsPa,
    ...(workingTable ? { workingTable } : {}),
  });

  switch (question.kind) {
    case "DIRECT_SELECTED": {
      const index = Number(evidence.rowIndex);
      const row = rows[index]!;
      const centre = localizedCentre(index, locale);
      return pack(
        "दिए गए केंद्र की पंक्ति में चयनित मान पढ़ें।",
        "ਦਿੱਤੇ ਕੇਂਦਰ ਦੀ ਕਤਾਰ ਵਿੱਚ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦਾ ਮੁੱਲ ਪੜ੍ਹੋ।",
        [`${centre} की पंक्ति में चयनित संख्या ${row.selected} है।`, `अतः उत्तर ${row.selected} है।`],
        [`${centre} ਦੀ ਕਤਾਰ ਵਿੱਚ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ ${row.selected} ਹੈ।`, `ਇਸ ਲਈ ਉੱਤਰ ${row.selected} ਹੈ।`],
      );
    }
    case "TOTAL_APPLICANTS":
      return pack(
        "सभी पाँच केंद्रों के आवेदक जोड़ें।",
        "ਸਾਰੇ ਪੰਜ ਕੇਂਦਰਾਂ ਦੇ ਉਮੀਦਵਾਰ ਜੋੜੋ।",
        [`${rows.map((row) => row.applicants).join(" + ")} = ${totalA}।`, `अतः कुल आवेदक ${totalA} हैं।`],
        [`${rows.map((row) => row.applicants).join(" + ")} = ${totalA}।`, `ਇਸ ਲਈ ਕੁੱਲ ਉਮੀਦਵਾਰ ${totalA} ਹਨ।`],
      );
    case "LARGEST_SELECTED": {
      const index = Number(evidence.rowIndex);
      const row = rows[index]!;
      const centre = localizedCentre(index, locale);
      const values = rows.map((item, rowIndex) => `${localizedCentre(rowIndex, locale)}: ${item.selected}`).join(", ");
      return pack(
        "चयनित स्तंभ के सभी मानों की तुलना करें।",
        "ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਵਾਲੇ ਕਾਲਮ ਦੇ ਸਾਰੇ ਮੁੱਲਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
        [`चयनित मान: ${values}।`, `सबसे बड़ा मान ${row.selected} है, जो ${centre} का है।`],
        [`ਚੁਣੇ ਗਏ ਮੁੱਲ: ${values}।`, `ਸਭ ਤੋਂ ਵੱਡਾ ਮੁੱਲ ${row.selected} ਹੈ, ਜੋ ${centre} ਦਾ ਹੈ।`],
      );
    }
    case "DIFFERENCE_SELECTED": {
      const a = Number(evidence.rowA), b = Number(evidence.rowB);
      const ra = rows[a]!, rb = rows[b]!;
      return pack(
        "दोनों केंद्रों के चयनित मान लें और बड़े में से छोटा घटाएँ।",
        "ਦੋਵੇਂ ਕੇਂਦਰਾਂ ਦੇ ਚੁਣੇ ਗਏ ਮੁੱਲ ਲਓ ਅਤੇ ਵੱਡੇ ਵਿੱਚੋਂ ਛੋਟਾ ਘਟਾਓ।",
        [`|${ra.selected} − ${rb.selected}| = ${Math.abs(ra.selected - rb.selected)}।`],
        [`|${ra.selected} − ${rb.selected}| = ${Math.abs(ra.selected - rb.selected)}।`],
      );
    }
    case "PERCENTAGE_SELECTED": {
      const index = Number(evidence.rowIndex);
      const row = rows[index]!;
      return pack(
        "चयन प्रतिशत = चयनित ÷ आवेदक × 100। अंतिम उत्तर निकटतम पूर्ण प्रतिशत में लें।",
        "ਚੋਣ ਪ੍ਰਤੀਸ਼ਤ = ਚੁਣੇ ਗਏ ÷ ਕੁੱਲ ਉਮੀਦਵਾਰ × 100। ਅੰਤਿਮ ਉੱਤਰ ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਲਓ।",
        [`${row.selected} ÷ ${row.applicants} × 100 ≈ ${question.answer}।`],
        [`${row.selected} ÷ ${row.applicants} × 100 ≈ ${question.answer}।`],
      );
    }
    case "RATIO_APPLICANTS": {
      const a = Number(evidence.rowA), b = Number(evidence.rowB);
      const ra = rows[a]!, rb = rows[b]!;
      return pack(
        "दोनों केंद्रों के आवेदक प्रश्न में दिए क्रम में लेकर अनुपात सरल करें।",
        "ਦੋਵੇਂ ਕੇਂਦਰਾਂ ਦੇ ਉਮੀਦਵਾਰ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਲੈ ਕੇ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।",
        [`${ra.applicants}:${rb.applicants} = ${question.answer}।`],
        [`${ra.applicants}:${rb.applicants} = ${question.answer}।`],
      );
    }
    case "AVERAGE_SELECTED":
      return pack(
        "सभी चयनित मान जोड़ें और पाँच से भाग दें।",
        "ਚੁਣੇ ਗਏ ਸਾਰੇ ਮੁੱਲ ਜੋੜੋ ਅਤੇ ਪੰਜ ਨਾਲ ਭਾਗ ਦਿਓ।",
        [`${rows.map((row) => row.selected).join(" + ")} = ${totalS}।`, `${totalS} ÷ 5 ≈ ${question.answer} निकटतम पूर्ण संख्या में।`],
        [`${rows.map((row) => row.selected).join(" + ")} = ${totalS}।`, `${totalS} ÷ 5 ≈ ${question.answer} ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ ਵਿੱਚ।`],
      );
    case "OVERALL_SELECTION_PERCENTAGE": {
      const headers = hi ? ["कुल चयनित", "कुल आवेदक", "समग्र चयन प्रतिशत"] : ["ਕੁੱਲ ਚੁਣੇ ਗਏ", "ਕੁੱਲ ਉਮੀਦਵਾਰ", "ਸਮੁੱਚਾ ਚੋਣ ਪ੍ਰਤੀਸ਼ਤ"];
      return pack(
        "सभी केंद्रों के संयुक्त चयनित और संयुक्त आवेदक लें; केंद्रों के प्रतिशतों का औसत न लें।",
        "ਸਾਰੇ ਕੇਂਦਰਾਂ ਦੇ ਕੁੱਲ ਚੁਣੇ ਗਏ ਅਤੇ ਕੁੱਲ ਉਮੀਦਵਾਰ ਲਓ; ਕੇਂਦਰਾਂ ਦੇ ਪ੍ਰਤੀਸ਼ਤਾਂ ਦੀ ਔਸਤ ਨਾ ਲਓ।",
        [`कुल चयनित = ${totalS}; कुल आवेदक = ${totalA}।`, `${totalS} ÷ ${totalA} × 100 ≈ ${question.answer}।`],
        [`ਕੁੱਲ ਚੁਣੇ ਗਏ = ${totalS}; ਕੁੱਲ ਉਮੀਦਵਾਰ = ${totalA}।`, `${totalS} ÷ ${totalA} × 100 ≈ ${question.answer}।`],
        { headers, rows: [[String(totalS), String(totalA), question.answer]] },
      );
    }
    case "SELECTED_TO_NOT_SELECTED_RATIO": {
      const headers = hi ? ["चयनित", "चयनित नहीं"] : ["ਚੁਣੇ ਗਏ", "ਨਾ ਚੁਣੇ ਗਏ"];
      return pack(
        "पहले चयनित न होने वाले अभ्यर्थियों की कुल संख्या निकालें, फिर अनुपात सरल करें।",
        "ਪਹਿਲਾਂ ਨਾ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਕੱਢੋ, ਫਿਰ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।",
        [`चयनित नहीं = ${totalA} − ${totalS} = ${notSelected}।`, `चयनित : चयनित नहीं = ${totalS}:${notSelected} = ${question.answer}।`],
        [`ਨਾ ਚੁਣੇ ਗਏ = ${totalA} − ${totalS} = ${notSelected}।`, `ਚੁਣੇ ਗਏ : ਨਾ ਚੁਣੇ ਗਏ = ${totalS}:${notSelected} = ${question.answer}।`],
        { headers, rows: [[String(totalS), String(notSelected)]] },
      );
    }
    case "SELECTION_RATE_DIFFERENCE": {
      const a = Number(evidence.rowA), b = Number(evidence.rowB);
      const ra = rows[a]!, rb = rows[b]!;
      const ca = localizedCentre(a, locale), cb = localizedCentre(b, locale);
      const headers = hi ? ["केंद्र", "आवेदक", "चयनित"] : ["ਕੇਂਦਰ", "ਉਮੀਦਵਾਰ", "ਚੁਣੇ ਗਏ"];
      return pack(
        "दोनों केंद्रों के चयन प्रतिशत अलग-अलग निकालें। बिना गोल किए मानों का अंतर लेकर अंतिम उत्तर निकटतम पूर्ण प्रतिशत अंक में दें।",
        "ਦੋਵੇਂ ਕੇਂਦਰਾਂ ਦੇ ਚੋਣ ਪ੍ਰਤੀਸ਼ਤ ਵੱਖ-ਵੱਖ ਕੱਢੋ। ਬਿਨਾਂ ਗੋਲ ਕੀਤੇ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ਲੈ ਕੇ ਅੰਤਿਮ ਉੱਤਰ ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਅੰਕ ਵਿੱਚ ਦਿਓ।",
        [`${ca}: ${ra.selected} ÷ ${ra.applicants} × 100।`, `${cb}: ${rb.selected} ÷ ${rb.applicants} × 100।`, `अंतर ≈ ${localizeRateGapValue(question.answer, locale)}।`],
        [`${ca}: ${ra.selected} ÷ ${ra.applicants} × 100।`, `${cb}: ${rb.selected} ÷ ${rb.applicants} × 100।`, `ਅੰਤਰ ≈ ${localizeRateGapValue(question.answer, locale)}।`],
        { headers, rows: [[ca, String(ra.applicants), String(ra.selected)], [cb, String(rb.applicants), String(rb.selected)]] },
      );
    }
    default:
      throw new Error(`DI-001 localization has no explanation builder for ${question.kind}.`);
  }
}

export function localizeDi001Question(source: ReturnType<typeof generateDi001PermanentQuestion>, locale: Di001LocalizationLocale) {
  const localizedOptions = localizeOptions(source.question, source.stimulus, locale);
  const answer = localizedOptions[source.question.correctIndex]!;
  return {
    packageId: "DI-001" as const,
    requestedSeed: source.requestedSeed,
    sourceSeed: source.sourceSeed,
    examProfile: source.examProfile,
    language: locale === "hi-IN" ? "hi" as const : "pa" as const,
    locale,
    localizationReviewId: DI001_LOCALIZATION_REVIEW_ID,
    localizationReleaseId: DI001_LOCALIZATION_RELEASE_ID,
    localizationStatus: "HI_PA_FROZEN" as const,
    sourceEnglishStatus: "ENGLISH_REVIEW_APPROVED" as const,
    stimulus: localizeDi001Stimulus(source.stimulus, locale),
    question: {
      ...source.question,
      stem: localizedStem(source.question, source.stimulus, locale, source.requestedSeed),
      options: localizedOptions,
      optionMetadata: source.question.optionMetadata.map((option, index) => ({ ...option, text: localizedOptions[index]! })),
      answer,
      explanation: localizedExplanation(source.question, source.stimulus, locale),
    },
    traceability: {
      ...source.traceability,
      reviewStatus: "MULTILINGUAL_FROZEN" as const,
      localizationStatus: "HI_PA_FROZEN" as const,
      questionStudioDiscoverable: true as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      productionReleaseAuthorized: false as const,
    },
  };
}

export function generateDi001LocalizedReviewQuestion(input: {
  seed: string;
  examProfile: Di001ExamProfile;
  taskKind: Di001V2TaskKind;
  locale: Di001LocalizationLocale;
}) {
  return localizeDi001Question(
    generateDi001PermanentQuestion({ seed: input.seed, examProfile: input.examProfile, taskKind: input.taskKind }),
    input.locale,
  );
}
