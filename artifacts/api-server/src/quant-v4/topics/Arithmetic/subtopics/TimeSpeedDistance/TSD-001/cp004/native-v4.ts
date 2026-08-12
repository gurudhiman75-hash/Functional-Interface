import { renderCp004EditorialV2NativeQuestion } from "./native-v2";
import type { TsdCp004NativeLanguage } from "./native";
import type { TsdCp004FinalNativeQuestion } from "./native-polished";
import type { TsdCp004Question } from "./types";
import { buildCp004FaithfulVisualV3 } from "./visual-v3";

const NOUNS = Object.freeze({
  hi: Object.freeze({ RUNNER: "धावक", CYCLIST: "साइकिल चालक", CAR: "कार", BUS: "बस", SCOOTER: "स्कूटर", DELIVERY_VAN: "डिलीवरी वैन" }),
  pa: Object.freeze({ RUNNER: "ਦੌੜਾਕ", CYCLIST: "ਸਾਈਕਲ ਸਵਾਰ", CAR: "ਕਾਰ", BUS: "ਬੱਸ", SCOOTER: "ਸਕੂਟਰ", DELIVERY_VAN: "ਡਿਲਿਵਰੀ ਵੈਨ" }),
});

function n(value: { numerator: bigint; denominator: bigint }): string {
  if (value.denominator === 1n) return String(value.numerator);
  const ten = value.numerator * 10n;
  if (ten % value.denominator === 0n) return (Number(ten / value.denominator) / 10).toString();
  return `${value.numerator}/${value.denominator}`;
}

function firstMeetingStem(english: TsdCp004Question, language: TsdCp004NativeLanguage): string | null {
  if (english.authorityId !== "FIRST_MEETING_TIME") return null;
  const s = english.state;
  const noun = NOUNS[language][s.actorKind];
  const A = `${noun} A`;
  const B = `${noun} B`;
  const gap = n(s.initialGapKm);
  const a = n(s.speedAKmph);
  const b = n(s.speedBKmph);

  if (language === "hi") {
    if (s.variant === 0) return `${A} और ${B} ${gap} km दूर दो बिंदुओं से एक ही समय पर क्रमशः ${a} km/h और ${b} km/h की गति से एक-दूसरे की ओर चलना शुरू करते हैं। वे पहली बार कितने मिनट बाद मिलेंगे?`;
    if (s.variant === 1) return `${B}, ${A} से ${gap} km आगे है। दोनों एक ही दिशा में चलते हैं; ${B} की गति ${b} km/h और ${A} की गति ${a} km/h है। यदि दोनों एक ही समय पर चलना शुरू करें, तो ${A}, ${B} को कितने मिनट बाद पकड़ेगा?`;
    return `दो ${noun} एक सीधी सड़क पर ${gap} km की दूरी से एक-दूसरे की ओर चलते हैं। पहले की गति ${a} km/h और दूसरे की ${b} km/h है। यदि दोनों एक साथ चलना शुरू करें, तो उनकी पहली मुलाकात कितने मिनट बाद होगी?`;
  }

  if (s.variant === 0) return `${A} ਅਤੇ ${B} ${gap} km ਦੂਰ ਦੋ ਬਿੰਦੂਆਂ ਤੋਂ ਇੱਕੋ ਸਮੇਂ ਕ੍ਰਮਵਾਰ ${a} km/h ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਉਹ ਪਹਿਲੀ ਵਾਰ ਕਿੰਨੇ ਮਿੰਟ ਬਾਅਦ ਮਿਲਣਗੇ?`;
  if (s.variant === 1) return `${B}, ${A} ਤੋਂ ${gap} km ਅੱਗੇ ਹੈ। ਦੋਵੇਂ ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਚੱਲਦੇ ਹਨ; ${B} ਦੀ ਰਫ਼ਤਾਰ ${b} km/h ਅਤੇ ${A} ਦੀ ਰਫ਼ਤਾਰ ${a} km/h ਹੈ। ਜੇ ਦੋਵੇਂ ਇੱਕੋ ਸਮੇਂ ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਨ, ਤਾਂ ${A}, ${B} ਨੂੰ ਕਿੰਨੇ ਮਿੰਟ ਬਾਅਦ ਫੜੇਗਾ?`;
  return `ਦੋ ${noun} ਇੱਕ ਸਿੱਧੀ ਸੜਕ ਉੱਤੇ ${gap} km ਦੇ ਫ਼ਾਸਲੇ ਤੋਂ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਦੇ ਹਨ। ਪਹਿਲੇ ਦੀ ਰਫ਼ਤਾਰ ${a} km/h ਅਤੇ ਦੂਜੇ ਦੀ ${b} km/h ਹੈ। ਜੇ ਦੋਵੇਂ ਇਕੱਠੇ ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਨ, ਤਾਂ ਉਹਨਾਂ ਦੀ ਪਹਿਲੀ ਮੁਲਾਕਾਤ ਕਿੰਨੇ ਮਿੰਟ ਬਾਅਦ ਹੋਵੇਗੀ?`;
}

export function renderCp004EditorialV4NativeQuestion(english: TsdCp004Question, language: TsdCp004NativeLanguage): TsdCp004FinalNativeQuestion {
  const base = renderCp004EditorialV2NativeQuestion(english, language);
  return Object.freeze({
    ...base,
    stem: firstMeetingStem(english, language) ?? base.stem,
    visual: buildCp004FaithfulVisualV3(english.state, language),
  });
}
