import type { TsdCp004NativeLanguage } from "./native";
import type { TsdCp004CanonicalState, TsdCp004Visual } from "./types";
import { buildCp004FaithfulVisualV2 } from "./visual-v2";

type Lang = "en" | TsdCp004NativeLanguage;

function n(value: { numerator: bigint; denominator: bigint }): string {
  if (value.denominator === 1n) return String(value.numerator);
  const ten = value.numerator * 10n;
  if (ten % value.denominator === 0n) return (Number(ten / value.denominator) / 10).toString();
  return `${value.numerator}/${value.denominator}`;
}

export function buildCp004FaithfulVisualV3(state: TsdCp004CanonicalState, language: Lang): TsdCp004Visual | null {
  if (state.representation !== "NUMBER_LINE" || state.authorityId !== "MULTI_PURSUER_MEETING_ORDER") return buildCp004FaithfulVisualV2(state, language);
  const a = n(state.speedAKmph), b = n(state.speedBKmph), c = n(state.speedCKmph), gapA = n(state.initialGapKm), gapC = n(state.extraGapCKm);
  const gapWord = language === "en" ? "gap" : language === "hi" ? "अंतर" : "ਫ਼ਾਸਲਾ";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="205" viewBox="0 0 640 205" role="img"><line x1="70" y1="72" x2="565" y2="72" stroke="currentColor" stroke-width="2"/><line x1="70" y1="148" x2="565" y2="148" stroke="currentColor" stroke-width="2"/><circle cx="125" cy="72" r="5"/><circle cx="520" cy="72" r="5"/><circle cx="125" cy="148" r="5"/><circle cx="520" cy="148" r="5"/><text x="82" y="45" font-size="13">A → ${a} km/h</text><text x="480" y="45" font-size="13">B → ${b} km/h</text><text x="240" y="96" font-size="12">A-B ${gapWord}: ${gapA} km</text><text x="82" y="124" font-size="13">C → ${c} km/h</text><text x="480" y="124" font-size="13">B → ${b} km/h</text><text x="240" y="181" font-size="12">C-B ${gapWord}: ${gapC} km</text></svg>`;
  const alt = language === "en"
    ? `Two separate pursuit lanes compare A behind B and C behind B; each lane shows its own speed pair and initial gap without implying an A-versus-C position.`
    : language === "hi"
      ? `दो अलग पीछा-रेखाएँ A को B के पीछे और C को B के पीछे दिखाती हैं; हर रेखा अपनी गति और शुरुआती अंतर दिखाती है, इसलिए A और C की आपसी स्थिति का गलत संकेत नहीं मिलता।`
      : `ਦੋ ਵੱਖ ਪਿੱਛਾ-ਰੇਖਾਵਾਂ A ਨੂੰ B ਦੇ ਪਿੱਛੇ ਅਤੇ C ਨੂੰ B ਦੇ ਪਿੱਛੇ ਦਿਖਾਉਂਦੀਆਂ ਹਨ; ਹਰ ਰੇਖਾ ਆਪਣੀਆਂ ਰਫ਼ਤਾਰਾਂ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲਾ ਦਿਖਾਉਂਦੀ ਹੈ, ਇਸ ਲਈ A ਅਤੇ C ਦੀ ਆਪਸੀ ਸਥਿਤੀ ਬਾਰੇ ਗਲਤ ਸੰਕੇਤ ਨਹੀਂ ਮਿਲਦਾ।`;
  return Object.freeze({ kind: "NUMBER_LINE", svg, alt });
}
