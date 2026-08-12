import type { TsdCp004NativeLanguage } from "./native";
import type { TsdCp004CanonicalState, TsdCp004Visual } from "./types";

function n(value: { numerator: bigint; denominator: bigint }): string {
  if (value.denominator === 1n) return String(value.numerator);
  const ten = value.numerator * 10n;
  if (ten % value.denominator === 0n) return (Number(ten / value.denominator) / 10).toString();
  return `${value.numerator}/${value.denominator}`;
}

type Lang = "en" | TsdCp004NativeLanguage;

function tr(language: Lang, key: "initialGap" | "start" | "event" | "delay" | "earlier" | "after" | "meet" | "catch" | "compare" | "target" | "timeline" | "minutes"): string {
  const map = {
    en: { initialGap: "initial gap", start: "start", event: "event", delay: "delay", earlier: "earlier", after: "after", meet: "meet", catch: "catch", compare: "compare catches", target: "target", timeline: "relative-motion timeline", minutes: "min" },
    hi: { initialGap: "शुरुआती अंतर", start: "शुरुआत", event: "घटना", delay: "देरी", earlier: "पहले", after: "बाद", meet: "मिलना", catch: "पकड़", compare: "पकड़ समयों की तुलना", target: "लक्ष्य", timeline: "सापेक्ष गति समयरेखा", minutes: "मिनट" },
    pa: { initialGap: "ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲਾ", start: "ਸ਼ੁਰੂਆਤ", event: "ਘਟਨਾ", delay: "ਦੇਰੀ", earlier: "ਪਹਿਲਾਂ", after: "ਬਾਅਦ", meet: "ਮਿਲਣਾ", catch: "ਪਕੜ", compare: "ਪਕੜ ਸਮਿਆਂ ਦੀ ਤੁਲਨਾ", target: "ਨਿਸ਼ਾਨਾ", timeline: "ਸਾਪੇਖ ਗਤੀ ਸਮਾਂ-ਰੇਖਾ", minutes: "ਮਿੰਟ" },
  } as const;
  return map[language][key];
}

function alt(language: Lang, english: string, hindi: string, punjabi: string): string {
  return language === "en" ? english : language === "hi" ? hindi : punjabi;
}

function sameDirectionAAhead(state: TsdCp004CanonicalState): boolean {
  return state.authorityId === "SEPARATION_AFTER_TIME" || state.authorityId === "TIME_TO_SPECIFIED_SEPARATION";
}

function numberLine(state: TsdCp004CanonicalState, language: Lang): TsdCp004Visual {
  const a = n(state.speedAKmph), b = n(state.speedBKmph), c = n(state.speedCKmph), gap = n(state.initialGapKm), extra = n(state.extraGapCKm);
  if (state.authorityId === "MULTI_PURSUER_MEETING_ORDER") {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="165" viewBox="0 0 620 165" role="img"><line x1="45" y1="88" x2="575" y2="88" stroke="currentColor" stroke-width="2"/><circle cx="90" cy="88" r="5"/><circle cx="220" cy="88" r="5"/><circle cx="520" cy="88" r="5"/><text x="55" y="52" font-size="13">C → ${c} km/h</text><text x="180" y="52" font-size="13">A → ${a} km/h</text><text x="475" y="52" font-size="13">B → ${b} km/h</text><text x="95" y="126" font-size="12">C-B: ${extra} km</text><text x="330" y="126" font-size="12">A-B: ${gap} km</text></svg>`;
    return Object.freeze({ kind: "NUMBER_LINE", svg, alt: alt(language, `A and C are behind target B on the same straight road; their speeds and starting gaps from B are shown.`, `A और C एक ही सीधी सड़क पर लक्ष्य B के पीछे हैं; उनकी गतियाँ और B से शुरुआती अंतर दिखाए गए हैं।`, `A ਅਤੇ C ਇੱਕੋ ਸਿੱਧੀ ਸੜਕ ਉੱਤੇ ਨਿਸ਼ਾਨਾ B ਦੇ ਪਿੱਛੇ ਹਨ; ਉਹਨਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਅਤੇ B ਤੋਂ ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲੇ ਦਿਖਾਏ ਗਏ ਹਨ।`) });
  }

  let left = "A", right = "B", leftSpeed = a, rightSpeed = b, leftArrow = "→", rightArrow = "←";
  if (state.directionCase === "OPPOSITE_AWAY") { leftArrow = "←"; rightArrow = "→"; }
  if (state.directionCase === "SAME_DIRECTION") {
    leftArrow = rightArrow = "→";
    if (sameDirectionAAhead(state)) {
      left = "B"; right = "A"; leftSpeed = b; rightSpeed = a;
    }
  }
  const gapLabel = state.initialGapKm.numerator === 0n ? "" : `<text x="225" y="127" font-size="12">${tr(language,"initialGap")}: ${gap} km</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="165" viewBox="0 0 600 165" role="img"><line x1="60" y1="88" x2="540" y2="88" stroke="currentColor" stroke-width="2"/><circle cx="105" cy="88" r="5"/><circle cx="495" cy="88" r="5"/><text x="65" y="50" font-size="14">${left} ${leftArrow} ${leftSpeed} km/h</text><text x="430" y="50" font-size="14">${right} ${rightArrow} ${rightSpeed} km/h</text>${gapLabel}</svg>`;
  return Object.freeze({ kind: "NUMBER_LINE", svg, alt: alt(language, `Straight-line positions, directions and speeds of A and B${state.initialGapKm.numerator === 0n ? "" : ` with an initial gap of ${gap} km`}.`, `सीधी रेखा पर A और B की स्थिति, दिशा और गति${state.initialGapKm.numerator === 0n ? "" : ` तथा ${gap} km का शुरुआती अंतर`} दिखाया गया है।`, `ਸਿੱਧੀ ਰੇਖਾ ਉੱਤੇ A ਅਤੇ B ਦੀ ਸਥਿਤੀ, ਦਿਸ਼ਾ ਅਤੇ ਰਫ਼ਤਾਰ${state.initialGapKm.numerator === 0n ? "" : ` ਅਤੇ ${gap} km ਦਾ ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲਾ`} ਦਿਖਾਇਆ ਗਿਆ ਹੈ।`) });
}

function timeline(state: TsdCp004CanonicalState, language: Lang): TsdCp004Visual {
  const t = n(state.elapsedMinutes), delay = n(state.startDelayMinutes), deadline = n(state.deadlineMinutes);
  let left = tr(language,"start");
  let middle = tr(language,"timeline");
  let right = tr(language,"event");

  switch (state.authorityId) {
    case "FIRST_MEETING_TIME":
    case "HEAD_START_CATCH_UP_TIME":
    case "TIME_TO_SPECIFIED_SEPARATION":
      right = `${tr(language,"event")}: ? ${tr(language,"minutes")}`;
      break;
    case "DELAYED_START_CATCH_UP_TIME":
      left = `B ${tr(language,"start")}`;
      middle = `A ${tr(language,"start")}: ${delay} ${tr(language,"minutes")} ${tr(language,"after")}`;
      right = `${tr(language,"catch")}: ? ${tr(language,"minutes")}`;
      break;
    case "START_DELAY_FROM_CATCH_UP":
      left = `B ${tr(language,"start")}: ? ${tr(language,"minutes")} ${tr(language,"earlier")}`;
      middle = `A ${tr(language,"start")}`;
      right = `${tr(language,"catch")}: ${t} ${tr(language,"minutes")} ${tr(language,"after")}`;
      break;
    case "INITIAL_GAP_FROM_MEETING":
    case "UNKNOWN_SPEED_FROM_MEETING":
    case "HEAD_START_DISTANCE":
      right = `${tr(language,"event")}: ${t} ${tr(language,"minutes")} ${tr(language,"after")}`;
      break;
    case "REQUIRED_SPEED_FOR_MEETING_DEADLINE":
      right = `${tr(language,"event")} ≤ ${deadline} ${tr(language,"minutes")}`;
      break;
    case "MULTI_PURSUER_MEETING_ORDER":
      middle = tr(language,"compare");
      right = `${tr(language,"target")} B`;
      break;
    case "MEETING_POINT_DISTANCE_SPLIT":
    case "SPEED_RATIO_FROM_MEETING_POINT":
    case "MEETING_POINT_FROM_SPEED_RATIO":
      right = tr(language,"meet");
      break;
    case "SEPARATION_AFTER_TIME":
      right = `${t} ${tr(language,"minutes")} ${tr(language,"after")}`;
      break;
    case "RELATIVE_SPEED_OPPOSITE":
    case "RELATIVE_SPEED_SAME_DIRECTION":
      middle = language === "en" ? "compare gap after 1 hour" : language === "hi" ? "1 घंटे में अंतर का बदलाव" : "1 ਘੰਟੇ ਵਿੱਚ ਫ਼ਾਸਲੇ ਦਾ ਬਦਲਾਅ";
      right = tr(language,"event");
      break;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="155" viewBox="0 0 620 155" role="img"><line x1="70" y1="76" x2="550" y2="76" stroke="currentColor" stroke-width="2"/><line x1="70" y1="58" x2="70" y2="94" stroke="currentColor"/><line x1="310" y1="62" x2="310" y2="90" stroke="currentColor"/><line x1="550" y1="58" x2="550" y2="94" stroke="currentColor"/><text x="45" y="122" font-size="12">${left}</text><text x="210" y="45" font-size="12">${middle}</text><text x="420" y="122" font-size="12">${right}</text></svg>`;
  return Object.freeze({ kind: "TIMELINE", svg, alt: alt(language, `Timeline showing only the given start/event timing information; unknown requested timing is kept as a question mark.`, `समयरेखा में केवल प्रश्न में दी गई शुरुआत/घटना की समय-सूचना दिखाई गई है; मांगा गया अज्ञात समय प्रश्नचिह्न से रखा गया है।`, `ਸਮਾਂ-ਰੇਖਾ ਵਿੱਚ ਕੇਵਲ ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੀ ਸ਼ੁਰੂਆਤ/ਘਟਨਾ ਦੀ ਸਮਾਂ-ਜਾਣਕਾਰੀ ਦਿਖਾਈ ਗਈ ਹੈ; ਮੰਗਿਆ ਅਣਜਾਣ ਸਮਾਂ ਪ੍ਰਸ਼ਨ-ਚਿੰਨ੍ਹ ਨਾਲ ਰੱਖਿਆ ਗਿਆ ਹੈ।`) });
}

export function buildCp004FaithfulVisualV2(state: TsdCp004CanonicalState, language: Lang): TsdCp004Visual | null {
  if (state.representation === "PROSE") return null;
  return state.representation === "NUMBER_LINE" ? numberLine(state, language) : timeline(state, language);
}
