import type { Rap001Language } from "./types";

type LocalizedLanguage = Exclude<Rap001Language, "en">;

export const RAP_001_LOCALIZED_QUESTION_OVERRIDES: Record<LocalizedLanguage, Record<string, string>> = {
  hi: {
    "RAP-QL-101": "यदि {personA}:{personB} का अनुपात {ratioA1}:{ratioB1} है और {personB}:{personC} का अनुपात {ratioB2}:{ratioC2} है, तो तीनों का संयुक्त अनुपात क्या होगा?",
    "RAP-QL-103": "{personA}, {personB}, {personC} और {personD} की आयु के अनुपात इस प्रकार हैं: {personA}:{personB} = {ratioA}:{ratioB}, {personB}:{personC} = {ratioB_prime}:{ratioC} और {personC}:{personD} = {ratioC_prime}:{ratioD}। {personA}:{personD} का आयु अनुपात ज्ञात करें।",
    "RAP-QL-303": "इन तीन अनुपातों को जोड़कर अंतिम अनुपात ज्ञात करें: {personA}:{personB} = {ratioA}:{ratioB}, {personB}:{personC} = {ratioB_prime}:{ratioC}, {personC}:{personD} = {ratioC_prime}:{ratioD}।",
    "RAP-QL-403": "{personA} से {personD} तक जुड़े अनुपात ये हैं: {personA}:{personB} = {ratioA}:{ratioB}, {personB}:{personC} = {ratioB_prime}:{ratioC} और {personC}:{personD} = {ratioC_prime}:{ratioD}। {personA}:{personD} ज्ञात करें।",
    "RAP-QL-011": "{personA} के मासिक खर्च और बचत का अनुपात {ratioExp}:{ratioSav} है। यदि मासिक वेतन ₹{totalSalary} है, तो हर महीने कितनी बचत होती है?"
  },
  pa: {
    "RAP-QL-101": "ਜੇ {personA}:{personB} ਦਾ ਅਨੁਪਾਤ {ratioA1}:{ratioB1} ਹੈ ਅਤੇ {personB}:{personC} ਦਾ ਅਨੁਪਾਤ {ratioB2}:{ratioC2} ਹੈ, ਤਾਂ ਤਿੰਨਾਂ ਦਾ ਸਾਂਝਾ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ?",
    "RAP-QL-103": "{personA}, {personB}, {personC} ਅਤੇ {personD} ਦੀ ਉਮਰ ਦੇ ਅਨੁਪਾਤ ਇਸ ਤਰ੍ਹਾਂ ਹਨ: {personA}:{personB} = {ratioA}:{ratioB}, {personB}:{personC} = {ratioB_prime}:{ratioC} ਅਤੇ {personC}:{personD} = {ratioC_prime}:{ratioD}। {personA}:{personD} ਦਾ ਉਮਰ ਅਨੁਪਾਤ ਲੱਭੋ।",
    "RAP-QL-303": "ਇਨ੍ਹਾਂ ਤਿੰਨ ਅਨੁਪਾਤਾਂ ਨੂੰ ਜੋੜ ਕੇ ਅੰਤਿਮ ਅਨੁਪਾਤ ਲੱਭੋ: {personA}:{personB} = {ratioA}:{ratioB}, {personB}:{personC} = {ratioB_prime}:{ratioC}, {personC}:{personD} = {ratioC_prime}:{ratioD}।",
    "RAP-QL-403": "{personA} ਤੋਂ {personD} ਤੱਕ ਜੁੜੇ ਅਨੁਪਾਤ ਇਹ ਹਨ: {personA}:{personB} = {ratioA}:{ratioB}, {personB}:{personC} = {ratioB_prime}:{ratioC} ਅਤੇ {personC}:{personD} = {ratioC_prime}:{ratioD}। {personA}:{personD} ਲੱਭੋ।",
    "RAP-QL-011": "{personA} ਦੇ ਮਹੀਨਾਵਾਰ ਖਰਚ ਅਤੇ ਬਚਤ ਦਾ ਅਨੁਪਾਤ {ratioExp}:{ratioSav} ਹੈ। ਜੇ ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ ₹{totalSalary} ਹੈ, ਤਾਂ ਹਰ ਮਹੀਨੇ ਕਿੰਨੀ ਬਚਤ ਹੁੰਦੀ ਹੈ?"
  }
};

export function getRap001LocalizedQuestionOverride(language: Rap001Language, questionLanguageId: string) {
  if (language === "en") return undefined;
  return RAP_001_LOCALIZED_QUESTION_OVERRIDES[language][questionLanguageId];
}
