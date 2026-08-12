import { absRational, divide, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { CP004_ENGLISH_ACTORS } from "./presentation";
import { formatCp004Value } from "./solver";
import { renderCp004NativeStem, type TsdCp004NativeLanguage } from "./native";
import type { TsdCp004CanonicalState, TsdCp004OptionAudit, TsdCp004Question, TsdCp004Visual } from "./types";

function n(value: Rational): string {
  if (value.denominator === 1n) return String(value.numerator);
  const ten = value.numerator * 10n;
  if (ten % value.denominator === 0n) return (Number(ten / value.denominator) / 10).toString();
  const hundred = value.numerator * 100n;
  if (hundred % value.denominator === 0n) return (Number(hundred / value.denominator) / 100).toString();
  const raw = value.numerator < 0n ? -value.numerator : value.numerator;
  const sign = value.numerator < 0n ? "-" : "";
  const whole = raw / value.denominator;
  const rem = raw % value.denominator;
  return whole === 0n ? `${sign}${rem}/${value.denominator}` : `${sign}${whole} ${rem}/${value.denominator}`;
}

function actorEn(state: TsdCp004CanonicalState, letter: "A" | "B" | "C"): string {
  const noun = CP004_ENGLISH_ACTORS[state.actorKind].singular;
  return `${noun[0].toUpperCase()}${noun.slice(1)} ${letter}`;
}

const NATIVE_NOUNS = Object.freeze({
  hi: Object.freeze({ RUNNER: "धावक", CYCLIST: "साइकिल चालक", CAR: "कार", BUS: "बस", SCOOTER: "स्कूटर", DELIVERY_VAN: "डिलीवरी वैन" }),
  pa: Object.freeze({ RUNNER: "ਦੌੜਾਕ", CYCLIST: "ਸਾਈਕਲ ਸਵਾਰ", CAR: "ਕਾਰ", BUS: "ਬੱਸ", SCOOTER: "ਸਕੂਟਰ", DELIVERY_VAN: "ਡਿਲਿਵਰੀ ਵੈਨ" }),
});

function actorNative(state: TsdCp004CanonicalState, language: TsdCp004NativeLanguage, letter: "A" | "B" | "C"): string {
  return `${NATIVE_NOUNS[language][state.actorKind]} ${letter}`;
}

export function renderCp004EnglishEditorialV2Stem(base: TsdCp004Question): string {
  const s = base.state;
  const v = s.variant;
  const A = actorEn(s, "A"), B = actorEn(s, "B"), C = actorEn(s, "C");
  const a = n(s.speedAKmph), b = n(s.speedBKmph), c = n(s.speedCKmph);
  const gap = n(s.initialGapKm), t = n(s.elapsedMinutes), delay = n(s.startDelayMinutes);
  const route = n(s.routeLengthKm), point = n(s.meetingFromAKm), deadline = n(s.deadlineMinutes), extra = n(s.extraGapCKm);
  const plural = CP004_ENGLISH_ACTORS[s.actorKind].plural;
  switch (s.authorityId) {
    case "HEAD_START_CATCH_UP_TIME":
      if (v === 0) return `${B} is ${gap} km ahead of ${A} and moves at ${b} km/h. ${A} travels in the same direction at ${a} km/h. How long will ${A} take to catch ${B}?`;
      if (v === 1) return `A ${CP004_ENGLISH_ACTORS[s.actorKind].singular} moving at ${b} km/h has a ${gap} km lead. If another ${CP004_ENGLISH_ACTORS[s.actorKind].singular} follows at ${a} km/h in the same direction, after how many minutes will the lead disappear?`;
      return `${A} follows ${B} on a straight road. Their speeds are ${a} km/h and ${b} km/h respectively, and ${B} is initially ${gap} km ahead. When will ${A} catch ${B}?`;
    case "HEAD_START_DISTANCE":
      if (v === 0) return `${A} travels at ${a} km/h and catches ${B}, moving in the same direction at ${b} km/h, after ${t} minutes. What head start in kilometres did ${B} have?`;
      if (v === 1) return `Two ${plural} move in the same direction at ${a} km/h and ${b} km/h. The faster one catches the slower one after ${t} minutes. How far ahead was the slower ${CP004_ENGLISH_ACTORS[s.actorKind].singular} at the start?`;
      return `${B} starts some distance ahead of ${A}. If their speeds are ${b} km/h and ${a} km/h in the same direction and the catch occurs ${t} minutes later, find the initial lead of ${B} in kilometres?`;
    case "DELAYED_START_CATCH_UP_TIME":
      if (v === 0) return `${B} leaves a point at ${b} km/h. ${delay} minutes later, ${A} leaves the same point at ${a} km/h in pursuit. From the moment ${A} starts, how many minutes are needed to catch ${B}?`;
      if (v === 1) return `A ${CP004_ENGLISH_ACTORS[s.actorKind].singular} moving at ${b} km/h gets a ${delay}-minute early start. If a faster ${CP004_ENGLISH_ACTORS[s.actorKind].singular} then follows at ${a} km/h from the same place, how long after the second start will they meet?`;
      return `${B} starts first from a checkpoint and continues at ${b} km/h. ${A} begins ${delay} minutes afterwards at ${a} km/h. After ${A} begins, what is the catch-up time?`;
    case "START_DELAY_FROM_CATCH_UP":
      if (v === 0) return `${B} starts before ${A} from the same point at ${b} km/h. ${A} later follows at ${a} km/h and catches ${B} after ${t} minutes of chasing. How many minutes earlier did ${B} start?`;
      if (v === 1) return `${A}, travelling at ${a} km/h, catches ${B} after a ${t}-minute chase. If ${B} had been moving from the same point at ${b} km/h before ${A} began, find ${B}'s earlier-start time?`;
      return `A slower ${CP004_ENGLISH_ACTORS[s.actorKind].singular} moves at ${b} km/h before a faster one starts at ${a} km/h from the same place. The faster one needs ${t} minutes to catch it. What was the start-time gap?`;
    case "INITIAL_GAP_FROM_MEETING":
      if (v === 0) return `${A} and ${B} move towards each other at ${a} km/h and ${b} km/h and meet after ${t} minutes. What was the distance between their starting points?`;
      if (v === 1) return `${A}, moving at ${a} km/h, catches ${B}, moving in the same direction at ${b} km/h, after ${t} minutes. How far apart were they when the chase began?`;
      return `Two ${plural} start simultaneously towards each other at ${a} km/h and ${b} km/h. If their first meeting occurs ${t} minutes later, determine their initial separation?`;
    case "UNKNOWN_SPEED_FROM_MEETING":
      if (v === 0) return `${A} and ${B} start ${gap} km apart and move towards each other. ${B} travels at ${b} km/h and they meet after ${t} minutes. What is ${A}'s speed?`;
      if (v === 1) return `${B} is ${gap} km ahead and travels at ${b} km/h. ${A} starts behind it at the same time and catches it in ${t} minutes. At what speed is ${A} travelling?`;
      return `Two ${plural} are ${gap} km apart and approach each other. If one travels at ${b} km/h and they meet in ${t} minutes, what must the other one's speed be?`;
    case "MEETING_POINT_DISTANCE_SPLIT":
      if (v === 0) return `${A} and ${B} start together from opposite ends of a ${route} km route at ${a} km/h and ${b} km/h. How many kilometres from ${A}'s end is their meeting point?`;
      if (v === 1) return `From the two ends of a ${route} km straight route, two ${plural} move towards each other at ${a} km/h and ${b} km/h. If they start simultaneously, where will they meet measured from the first end?`;
      return `${A} leaves one end of a ${route} km road as ${B} leaves the other end at the same instant. Their speeds are ${a} km/h and ${b} km/h. What distance does ${A} cover before they meet?`;
    case "SPEED_RATIO_FROM_MEETING_POINT":
      if (v === 0) return `${A} and ${B} leave opposite ends of a ${route} km route simultaneously and meet ${point} km from ${A}'s end. What is the speed ratio ${A}:${B}?`;
      if (v === 1) return `Two ${plural} start at the same time from opposite ends of a ${route} km road. Their meeting point is ${point} km from the first end. Find the ratio of the first speed to the second speed?`;
      return `On a ${route} km route, ${A} covers ${point} km before meeting ${B}, which started simultaneously from the other end. In what ratio are their speeds?`;
    case "MEETING_POINT_FROM_SPEED_RATIO":
      if (v === 0) return `Two ${plural} start simultaneously from opposite ends of a ${route} km route. Their speeds are in the ratio ${s.ratioA}:${s.ratioB}. How far from the first end will they meet?`;
      if (v === 1) return `A ${route} km road is approached from opposite ends by two ${plural} starting at the same time. If their speed ratio is ${s.ratioA}:${s.ratioB}, what distance will the first one cover before meeting?`;
      return `The speeds of two ${plural} moving towards each other are in the ratio ${s.ratioA}:${s.ratioB}. They start together from the ends of a ${route} km route. Locate the meeting point by giving its distance from the first end?`;
    case "REQUIRED_SPEED_FOR_MEETING_DEADLINE":
      if (v === 0) return `${A} and ${B} are ${gap} km apart and move towards each other. ${B} travels at ${b} km/h. If they must meet within ${deadline} minutes, what speed must ${A} maintain?`;
      if (v === 1) return `${B} is ${gap} km ahead and moves at ${b} km/h. To catch ${B} within ${deadline} minutes while travelling in the same direction, what minimum constant speed must ${A} maintain?`;
      return `Two ${plural} move towards each other from points ${gap} km apart. One moves at ${b} km/h. What constant speed should the other maintain so that the meeting occurs in ${deadline} minutes?`;
    case "MULTI_PURSUER_MEETING_ORDER":
      if (v === 0) return `${B} moves at ${b} km/h. ${A} is ${gap} km behind at ${a} km/h, while ${C} is ${extra} km behind at ${c} km/h. If all continue in the same direction, who catches ${B} first?`;
      if (v === 1) return `A target ${CP004_ENGLISH_ACTORS[s.actorKind].singular} moves at ${b} km/h. Pursuer A is ${gap} km behind at ${a} km/h and pursuer C is ${extra} km behind at ${c} km/h. Which pursuer reaches the target first?`;
      return `${A} and ${C} chase ${B} along the same straight road. Their speeds are ${a}, ${c} and ${b} km/h respectively; their initial gaps behind ${B} are ${gap} km and ${extra} km. Compare their catch times: who catches ${B} first?`;
    default:
      return base.stem;
  }
}

function polishWhile(englishStem: string, nativeStem: string, language: TsdCp004NativeLanguage): string {
  let stem = nativeStem;
  if (/\bwhile\b/i.test(englishStem)) {
    if (language === "hi" && !/जबकि|चलते हुए/u.test(stem)) stem = stem.replace(/ और /u, ", जबकि ");
    if (language === "pa" && !/ਜਦਕਿ|ਚੱਲਦਿਆਂ/u.test(stem)) stem = stem.replace(/ ਅਤੇ /u, ", ਜਦਕਿ ");
  }
  return stem;
}

export function renderCp004NativeEditorialV2Stem(english: TsdCp004Question, language: TsdCp004NativeLanguage): string {
  const s = english.state;
  const v = s.variant;
  const A = actorNative(s, language, "A"), B = actorNative(s, language, "B"), C = actorNative(s, language, "C");
  const a = n(s.speedAKmph), b = n(s.speedBKmph), c = n(s.speedCKmph);
  const gap = n(s.initialGapKm), t = n(s.elapsedMinutes), delay = n(s.startDelayMinutes);
  const route = n(s.routeLengthKm), point = n(s.meetingFromAKm), deadline = n(s.deadlineMinutes), extra = n(s.extraGapCKm);
  const one = NATIVE_NOUNS[language][s.actorKind];
  if (language === "hi") {
    switch (s.authorityId) {
      case "HEAD_START_CATCH_UP_TIME":
        if (v === 0) return `${B}, ${A} से ${gap} km आगे है और ${b} km/h से चलता है। ${A} उसी दिशा में ${a} km/h से चलता है। ${A}, ${B} को कितने मिनट में पकड़ेगा?`;
        if (v === 1) return `${b} km/h से चल रहे एक ${one} को ${gap} km की बढ़त मिली है। यदि दूसरा ${one} उसी दिशा में ${a} km/h से पीछा करे, तो यह बढ़त कितने मिनट में समाप्त होगी?`;
        return `${A} एक सीधी सड़क पर ${B} का पीछा करता है। उनकी गतियाँ क्रमशः ${a} km/h और ${b} km/h हैं और ${B} शुरुआत में ${gap} km आगे है। ${A}, ${B} को कब पकड़ेगा?`;
      case "HEAD_START_DISTANCE":
        if (v === 0) return `${A}, ${a} km/h से चलते हुए ${b} km/h से उसी दिशा में चल रहे ${B} को ${t} मिनट में पकड़ता है। ${B} को शुरुआत में कितने km की बढ़त थी?`;
        if (v === 1) return `दो ${one} एक ही दिशा में ${a} km/h और ${b} km/h से चलते हैं। तेज ${one}, धीमे ${one} को ${t} मिनट बाद पकड़ता है। शुरुआत में धीमा ${one} कितने km आगे था?`;
        return `${B}, ${A} से कुछ दूरी आगे शुरू करता है। यदि दोनों की गतियाँ उसी दिशा में ${b} km/h और ${a} km/h हैं और पकड़ ${t} मिनट बाद होती है, तो ${B} की शुरुआती बढ़त कितनी थी?`;
      case "DELAYED_START_CATCH_UP_TIME":
        if (v === 0) return `${B} एक बिंदु से ${b} km/h पर निकलता है। ${delay} मिनट बाद ${A} उसी बिंदु से ${a} km/h पर पीछा शुरू करता है। ${A} के शुरू होने के बाद ${B} को पकड़ने में कितने मिनट लगेंगे?`;
        if (v === 1) return `${b} km/h से चल रहे एक ${one} को ${delay} मिनट की शुरुआती बढ़त मिलती है। यदि दूसरा तेज ${one} फिर उसी स्थान से ${a} km/h पर चले, तो दूसरे के शुरू होने के कितने मिनट बाद वे मिलेंगे?`;
        return `${B} एक चेकपॉइंट से पहले चलना शुरू कर ${b} km/h से चलता रहता है। ${A}, ${delay} मिनट बाद ${a} km/h से शुरू करता है। ${A} के शुरू होने के बाद पकड़ने का समय कितना है?`;
      case "START_DELAY_FROM_CATCH_UP":
        if (v === 0) return `${B}, ${A} से पहले उसी बिंदु से ${b} km/h पर चलता है। ${A} बाद में ${a} km/h से पीछा करता है और ${t} मिनट के पीछा के बाद ${B} को पकड़ता है। ${B} कितने मिनट पहले चला था?`;
        if (v === 1) return `${A}, ${a} km/h से चलते हुए ${t} मिनट के पीछा के बाद ${B} को पकड़ता है। यदि ${B} उसी बिंदु से पहले ${b} km/h पर चल रहा था, तो उसकी शुरुआती बढ़त समय में कितनी थी?`;
        return `एक धीमा ${one} ${b} km/h से पहले चलता है और बाद में उसी स्थान से तेज ${one} ${a} km/h पर शुरू करता है। तेज ${one} को पकड़ने में ${t} मिनट लगते हैं। दोनों के शुरू होने के समय में कितना अंतर था?`;
      case "INITIAL_GAP_FROM_MEETING":
        if (v === 0) return `${A} और ${B} ${a} km/h और ${b} km/h से एक-दूसरे की ओर चलते हैं और ${t} मिनट बाद मिलते हैं। उनके शुरुआती बिंदुओं के बीच कितनी दूरी थी?`;
        if (v === 1) return `${A}, ${a} km/h से चलते हुए उसी दिशा में ${b} km/h से चल रहे ${B} को ${t} मिनट बाद पकड़ता है। पीछा शुरू होने पर वे कितनी दूरी पर थे?`;
        return `दो ${one} एक ही समय पर ${a} km/h और ${b} km/h से एक-दूसरे की ओर चलते हैं। यदि उनकी पहली मुलाकात ${t} मिनट बाद होती है, तो शुरुआती दूरी कितनी थी?`;
      case "UNKNOWN_SPEED_FROM_MEETING":
        if (v === 0) return `${A} और ${B} ${gap} km दूर से एक-दूसरे की ओर चलते हैं। ${B} की गति ${b} km/h है और वे ${t} मिनट बाद मिलते हैं। ${A} की गति कितनी है?`;
        if (v === 1) return `${B}, ${A} से ${gap} km आगे ${b} km/h से चलता है। ${A} उसी समय पीछे से चलकर ${t} मिनट में उसे पकड़ता है। ${A} की गति क्या है?`;
        return `दो ${one} ${gap} km दूर हैं और एक-दूसरे की ओर आते हैं। यदि एक की गति ${b} km/h है और वे ${t} मिनट में मिलते हैं, तो दूसरे की गति कितनी होनी चाहिए?`;
      case "MEETING_POINT_DISTANCE_SPLIT":
        if (v === 0) return `${A} और ${B} ${route} km लंबे मार्ग के विपरीत सिरों से एक साथ ${a} km/h और ${b} km/h पर चलते हैं। ${A} के सिरे से वे कितने km दूर मिलेंगे?`;
        if (v === 1) return `${route} km के सीधे मार्ग के दो सिरों से दो ${one} ${a} km/h और ${b} km/h से एक-दूसरे की ओर चलते हैं। यदि वे एक साथ शुरू करें, तो पहले सिरे से मिलने का बिंदु कितनी दूरी पर होगा?`;
        return `${A}, ${route} km सड़क के एक सिरे से चलता है और उसी क्षण ${B} दूसरे सिरे से चलता है। उनकी गतियाँ ${a} km/h और ${b} km/h हैं। मिलने तक ${A} कितनी दूरी तय करेगा?`;
      case "SPEED_RATIO_FROM_MEETING_POINT":
        if (v === 0) return `${A} और ${B} ${route} km मार्ग के विपरीत सिरों से एक साथ चलते हैं और ${A} के सिरे से ${point} km दूर मिलते हैं। गति अनुपात ${A}:${B} क्या है?`;
        if (v === 1) return `दो ${one} ${route} km सड़क के विपरीत सिरों से एक ही समय पर चलते हैं। मिलने का बिंदु पहले सिरे से ${point} km दूर है। पहली गति और दूसरी गति का अनुपात क्या है?`;
        return `${route} km मार्ग पर ${A}, दूसरे सिरे से उसी समय चले ${B} से मिलने से पहले ${point} km तय करता है। उनकी गतियाँ किस अनुपात में हैं?`;
      case "MEETING_POINT_FROM_SPEED_RATIO":
        if (v === 0) return `दो ${one} ${route} km मार्ग के विपरीत सिरों से एक साथ चलते हैं। उनकी गतियों का अनुपात ${s.ratioA}:${s.ratioB} है। वे पहले सिरे से कितनी दूरी पर मिलेंगे?`;
        if (v === 1) return `${route} km सड़क के विपरीत सिरों से दो ${one} एक ही समय पर चलते हैं। यदि गति अनुपात ${s.ratioA}:${s.ratioB} है, तो पहला ${one} मिलने से पहले कितनी दूरी तय करेगा?`;
        return `एक-दूसरे की ओर चलते दो ${one} की गति का अनुपात ${s.ratioA}:${s.ratioB} है। वे ${route} km मार्ग के सिरों से एक साथ शुरू करते हैं। पहले सिरे से मिलने का बिंदु कितनी दूरी पर होगा?`;
      case "REQUIRED_SPEED_FOR_MEETING_DEADLINE":
        if (v === 0) return `${A} और ${B} ${gap} km दूर हैं और एक-दूसरे की ओर चलते हैं। ${B} की गति ${b} km/h है। यदि उन्हें ${deadline} मिनट के भीतर मिलना हो, तो ${A} की गति कितनी होनी चाहिए?`;
        if (v === 1) return `${B}, ${A} से ${gap} km आगे ${b} km/h पर चलता है। यदि ${A} को उसी दिशा में चलते हुए ${deadline} मिनट के भीतर ${B} को पकड़ना हो, तो ${A} की न्यूनतम स्थिर गति कितनी होनी चाहिए?`;
        return `दो ${one} ${gap} km दूर बिंदुओं से एक-दूसरे की ओर चलते हैं। एक की गति ${b} km/h है। ${deadline} मिनट में मिलने के लिए दूसरे को कितनी स्थिर गति रखनी चाहिए?`;
      case "MULTI_PURSUER_MEETING_ORDER":
        if (v === 0) return `${B}, ${b} km/h से चलता है। ${A}, ${gap} km पीछे ${a} km/h से चलता है, जबकि ${C}, ${extra} km पीछे ${c} km/h से चलता है। यदि सभी उसी दिशा में चलते रहें, तो ${B} को पहले कौन पकड़ेगा?`;
        if (v === 1) return `लक्ष्य ${one}, ${b} km/h से चलता है। पीछा करने वाला A ${gap} km पीछे ${a} km/h पर और पीछा करने वाला C ${extra} km पीछे ${c} km/h पर है। लक्ष्य तक पहले कौन पहुँचेगा?`;
        return `${A} और ${C}, उसी सीधी सड़क पर ${B} का पीछा करते हैं। उनकी गतियाँ क्रमशः ${a}, ${c} और ${b} km/h हैं; ${B} से उनके शुरुआती अंतर ${gap} km और ${extra} km हैं। पकड़ने के समय की तुलना करें: ${B} को पहले कौन पकड़ेगा?`;
      default:
        return polishWhile(english.stem, renderCp004NativeStem(s, language), language);
    }
  }

  switch (s.authorityId) {
    case "HEAD_START_CATCH_UP_TIME":
      if (v === 0) return `${B}, ${A} ਤੋਂ ${gap} km ਅੱਗੇ ਹੈ ਅਤੇ ${b} km/h ਨਾਲ ਚੱਲਦਾ ਹੈ। ${A} ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ${a} km/h ਨਾਲ ਚੱਲਦਾ ਹੈ। ${A}, ${B} ਨੂੰ ਕਿੰਨੇ ਮਿੰਟ ਵਿੱਚ ਫੜੇਗਾ?`;
      if (v === 1) return `${b} km/h ਨਾਲ ਚੱਲ ਰਹੇ ਇੱਕ ${one} ਨੂੰ ${gap} km ਦੀ ਬੜ੍ਹਤ ਮਿਲੀ ਹੈ। ਜੇ ਦੂਜਾ ${one} ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ${a} km/h ਨਾਲ ਪਿੱਛਾ ਕਰੇ, ਤਾਂ ਇਹ ਬੜ੍ਹਤ ਕਿੰਨੇ ਮਿੰਟ ਵਿੱਚ ਖਤਮ ਹੋਵੇਗੀ?`;
      return `${A} ਇੱਕ ਸਿੱਧੀ ਸੜਕ ਉੱਤੇ ${B} ਦਾ ਪਿੱਛਾ ਕਰਦਾ ਹੈ। ਉਹਨਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਕ੍ਰਮਵਾਰ ${a} km/h ਅਤੇ ${b} km/h ਹਨ ਅਤੇ ${B} ਸ਼ੁਰੂ ਵਿੱਚ ${gap} km ਅੱਗੇ ਹੈ। ${A}, ${B} ਨੂੰ ਕਦੋਂ ਫੜੇਗਾ?`;
    case "HEAD_START_DISTANCE":
      if (v === 0) return `${A}, ${a} km/h ਨਾਲ ਚੱਲਦਿਆਂ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ${b} km/h ਨਾਲ ਚੱਲ ਰਹੇ ${B} ਨੂੰ ${t} ਮਿੰਟ ਵਿੱਚ ਫੜਦਾ ਹੈ। ${B} ਨੂੰ ਸ਼ੁਰੂ ਵਿੱਚ ਕਿੰਨੇ km ਦੀ ਬੜ੍ਹਤ ਸੀ?`;
      if (v === 1) return `ਦੋ ${one} ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ${a} km/h ਅਤੇ ${b} km/h ਨਾਲ ਚੱਲਦੇ ਹਨ। ਤੇਜ਼ ${one}, ਹੌਲੇ ${one} ਨੂੰ ${t} ਮਿੰਟ ਬਾਅਦ ਫੜਦਾ ਹੈ। ਸ਼ੁਰੂ ਵਿੱਚ ਹੌਲਾ ${one} ਕਿੰਨੇ km ਅੱਗੇ ਸੀ?`;
      return `${B}, ${A} ਤੋਂ ਕੁਝ ਦੂਰੀ ਅੱਗੇ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ਜੇ ਦੋਵੇਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ${b} km/h ਅਤੇ ${a} km/h ਹਨ ਅਤੇ ਪਕੜ ${t} ਮਿੰਟ ਬਾਅਦ ਹੁੰਦੀ ਹੈ, ਤਾਂ ${B} ਦੀ ਸ਼ੁਰੂਆਤੀ ਬੜ੍ਹਤ ਕਿੰਨੀ ਸੀ?`;
    case "DELAYED_START_CATCH_UP_TIME":
      if (v === 0) return `${B} ਇੱਕ ਬਿੰਦੂ ਤੋਂ ${b} km/h ਨਾਲ ਨਿਕਲਦਾ ਹੈ। ${delay} ਮਿੰਟ ਬਾਅਦ ${A} ਉਸੇ ਬਿੰਦੂ ਤੋਂ ${a} km/h ਨਾਲ ਪਿੱਛਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${A} ਦੇ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਬਾਅਦ ${B} ਨੂੰ ਫੜਨ ਵਿੱਚ ਕਿੰਨੇ ਮਿੰਟ ਲੱਗਣਗੇ?`;
      if (v === 1) return `${b} km/h ਨਾਲ ਚੱਲ ਰਹੇ ਇੱਕ ${one} ਨੂੰ ${delay} ਮਿੰਟ ਦੀ ਸ਼ੁਰੂਆਤੀ ਬੜ੍ਹਤ ਮਿਲਦੀ ਹੈ। ਜੇ ਦੂਜਾ ਤੇਜ਼ ${one} ਫਿਰ ਉਸੇ ਥਾਂ ਤੋਂ ${a} km/h ਨਾਲ ਚੱਲੇ, ਤਾਂ ਦੂਜੇ ਦੇ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਕਿੰਨੇ ਮਿੰਟ ਬਾਅਦ ਉਹ ਮਿਲਣਗੇ?`;
      return `${B} ਇੱਕ ਚੈਕਪੋਇੰਟ ਤੋਂ ਪਹਿਲਾਂ ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਕੇ ${b} km/h ਨਾਲ ਚੱਲਦਾ ਰਹਿੰਦਾ ਹੈ। ${A}, ${delay} ਮਿੰਟ ਬਾਅਦ ${a} km/h ਨਾਲ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${A} ਦੇ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਪਕੜਨ ਦਾ ਸਮਾਂ ਕਿੰਨਾ ਹੈ?`;
    case "START_DELAY_FROM_CATCH_UP":
      if (v === 0) return `${B}, ${A} ਤੋਂ ਪਹਿਲਾਂ ਉਸੇ ਬਿੰਦੂ ਤੋਂ ${b} km/h ਨਾਲ ਚੱਲਦਾ ਹੈ। ${A} ਬਾਅਦ ਵਿੱਚ ${a} km/h ਨਾਲ ਪਿੱਛਾ ਕਰਦਾ ਹੈ ਅਤੇ ${t} ਮਿੰਟ ਦੇ ਪਿੱਛੇ ਤੋਂ ਬਾਅਦ ${B} ਨੂੰ ਫੜਦਾ ਹੈ। ${B} ਕਿੰਨੇ ਮਿੰਟ ਪਹਿਲਾਂ ਚੱਲਿਆ ਸੀ?`;
      if (v === 1) return `${A}, ${a} km/h ਨਾਲ ਚੱਲਦਿਆਂ ${t} ਮਿੰਟ ਦੇ ਪਿੱਛੇ ਤੋਂ ਬਾਅਦ ${B} ਨੂੰ ਫੜਦਾ ਹੈ। ਜੇ ${B} ਉਸੇ ਬਿੰਦੂ ਤੋਂ ਪਹਿਲਾਂ ${b} km/h ਨਾਲ ਚੱਲ ਰਿਹਾ ਸੀ, ਤਾਂ ਉਸਦੀ ਸ਼ੁਰੂਆਤੀ ਬੜ੍ਹਤ ਸਮੇਂ ਵਿੱਚ ਕਿੰਨੀ ਸੀ?`;
      return `ਇੱਕ ਹੌਲਾ ${one} ${b} km/h ਨਾਲ ਪਹਿਲਾਂ ਚੱਲਦਾ ਹੈ ਅਤੇ ਬਾਅਦ ਵਿੱਚ ਉਸੇ ਥਾਂ ਤੋਂ ਤੇਜ਼ ${one} ${a} km/h ਨਾਲ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ਤੇਜ਼ ${one} ਨੂੰ ਫੜਨ ਵਿੱਚ ${t} ਮਿੰਟ ਲੱਗਦੇ ਹਨ। ਦੋਵਾਂ ਦੇ ਸ਼ੁਰੂ ਹੋਣ ਦੇ ਸਮੇਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਸੀ?`;
    case "INITIAL_GAP_FROM_MEETING":
      if (v === 0) return `${A} ਅਤੇ ${B} ${a} km/h ਅਤੇ ${b} km/h ਨਾਲ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਦੇ ਹਨ ਅਤੇ ${t} ਮਿੰਟ ਬਾਅਦ ਮਿਲਦੇ ਹਨ। ਉਹਨਾਂ ਦੇ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂਆਂ ਵਿਚਲੀ ਦੂਰੀ ਕਿੰਨੀ ਸੀ?`;
      if (v === 1) return `${A}, ${a} km/h ਨਾਲ ਚੱਲਦਿਆਂ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ${b} km/h ਨਾਲ ਚੱਲ ਰਹੇ ${B} ਨੂੰ ${t} ਮਿੰਟ ਬਾਅਦ ਫੜਦਾ ਹੈ। ਪਿੱਛਾ ਸ਼ੁਰੂ ਹੋਣ ਵੇਲੇ ਉਹ ਕਿੰਨੀ ਦੂਰੀ ਉੱਤੇ ਸਨ?`;
      return `ਦੋ ${one} ਇੱਕੋ ਸਮੇਂ ${a} km/h ਅਤੇ ${b} km/h ਨਾਲ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਦੇ ਹਨ। ਜੇ ਉਹਨਾਂ ਦੀ ਪਹਿਲੀ ਮੁਲਾਕਾਤ ${t} ਮਿੰਟ ਬਾਅਦ ਹੁੰਦੀ ਹੈ, ਤਾਂ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ਕਿੰਨੀ ਸੀ?`;
    case "UNKNOWN_SPEED_FROM_MEETING":
      if (v === 0) return `${A} ਅਤੇ ${B} ${gap} km ਦੂਰ ਤੋਂ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਦੇ ਹਨ। ${B} ਦੀ ਰਫ਼ਤਾਰ ${b} km/h ਹੈ ਅਤੇ ਉਹ ${t} ਮਿੰਟ ਬਾਅਦ ਮਿਲਦੇ ਹਨ। ${A} ਦੀ ਰਫ਼ਤਾਰ ਕਿੰਨੀ ਹੈ?`;
      if (v === 1) return `${B}, ${A} ਤੋਂ ${gap} km ਅੱਗੇ ${b} km/h ਨਾਲ ਚੱਲਦਾ ਹੈ। ${A} ਉਸੇ ਸਮੇਂ ਪਿੱਛੋਂ ਚੱਲ ਕੇ ${t} ਮਿੰਟ ਵਿੱਚ ਉਸਨੂੰ ਫੜਦਾ ਹੈ। ${A} ਦੀ ਰਫ਼ਤਾਰ ਕੀ ਹੈ?`;
      return `ਦੋ ${one} ${gap} km ਦੂਰ ਹਨ ਅਤੇ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਆਉਂਦੇ ਹਨ। ਜੇ ਇੱਕ ਦੀ ਰਫ਼ਤਾਰ ${b} km/h ਹੈ ਅਤੇ ਉਹ ${t} ਮਿੰਟ ਵਿੱਚ ਮਿਲਦੇ ਹਨ, ਤਾਂ ਦੂਜੇ ਦੀ ਰਫ਼ਤਾਰ ਕਿੰਨੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?`;
    case "MEETING_POINT_DISTANCE_SPLIT":
      if (v === 0) return `${A} ਅਤੇ ${B} ${route} km ਲੰਮੇ ਰਸਤੇ ਦੇ ਵਿਰੁੱਧ ਸਿਰਿਆਂ ਤੋਂ ਇਕੱਠੇ ${a} km/h ਅਤੇ ${b} km/h ਨਾਲ ਚੱਲਦੇ ਹਨ। ${A} ਦੇ ਸਿਰੇ ਤੋਂ ਉਹ ਕਿੰਨੇ km ਦੂਰ ਮਿਲਣਗੇ?`;
      if (v === 1) return `${route} km ਦੇ ਸਿੱਧੇ ਰਸਤੇ ਦੇ ਦੋ ਸਿਰਿਆਂ ਤੋਂ ਦੋ ${one} ${a} km/h ਅਤੇ ${b} km/h ਨਾਲ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਦੇ ਹਨ। ਜੇ ਉਹ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਨ, ਤਾਂ ਪਹਿਲੇ ਸਿਰੇ ਤੋਂ ਮਿਲਣ ਦਾ ਬਿੰਦੂ ਕਿੰਨੀ ਦੂਰੀ ਉੱਤੇ ਹੋਵੇਗਾ?`;
      return `${A}, ${route} km ਸੜਕ ਦੇ ਇੱਕ ਸਿਰੇ ਤੋਂ ਚੱਲਦਾ ਹੈ ਅਤੇ ਉਸੇ ਵੇਲੇ ${B} ਦੂਜੇ ਸਿਰੇ ਤੋਂ ਚੱਲਦਾ ਹੈ। ਉਹਨਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${a} km/h ਅਤੇ ${b} km/h ਹਨ। ਮਿਲਣ ਤੱਕ ${A} ਕਿੰਨੀ ਦੂਰੀ ਤੈਅ ਕਰੇਗਾ?`;
    case "SPEED_RATIO_FROM_MEETING_POINT":
      if (v === 0) return `${A} ਅਤੇ ${B} ${route} km ਰਸਤੇ ਦੇ ਵਿਰੁੱਧ ਸਿਰਿਆਂ ਤੋਂ ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ ਅਤੇ ${A} ਦੇ ਸਿਰੇ ਤੋਂ ${point} km ਦੂਰ ਮਿਲਦੇ ਹਨ। ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ${A}:${B} ਕੀ ਹੈ?`;
      if (v === 1) return `ਦੋ ${one} ${route} km ਸੜਕ ਦੇ ਵਿਰੁੱਧ ਸਿਰਿਆਂ ਤੋਂ ਇੱਕੋ ਸਮੇਂ ਚੱਲਦੇ ਹਨ। ਮਿਲਣ ਦਾ ਬਿੰਦੂ ਪਹਿਲੇ ਸਿਰੇ ਤੋਂ ${point} km ਦੂਰ ਹੈ। ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`;
      return `${route} km ਰਸਤੇ ਉੱਤੇ ${A}, ਦੂਜੇ ਸਿਰੇ ਤੋਂ ਉਸੇ ਸਮੇਂ ਚੱਲੇ ${B} ਨਾਲ ਮਿਲਣ ਤੋਂ ਪਹਿਲਾਂ ${point} km ਤੈਅ ਕਰਦਾ ਹੈ। ਉਹਨਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਕਿਸ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ?`;
    case "MEETING_POINT_FROM_SPEED_RATIO":
      if (v === 0) return `ਦੋ ${one} ${route} km ਰਸਤੇ ਦੇ ਵਿਰੁੱਧ ਸਿਰਿਆਂ ਤੋਂ ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ। ਉਹਨਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ${s.ratioA}:${s.ratioB} ਹੈ। ਉਹ ਪਹਿਲੇ ਸਿਰੇ ਤੋਂ ਕਿੰਨੀ ਦੂਰੀ ਉੱਤੇ ਮਿਲਣਗੇ?`;
      if (v === 1) return `${route} km ਸੜਕ ਦੇ ਵਿਰੁੱਧ ਸਿਰਿਆਂ ਤੋਂ ਦੋ ${one} ਇੱਕੋ ਸਮੇਂ ਚੱਲਦੇ ਹਨ। ਜੇ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ${s.ratioA}:${s.ratioB} ਹੈ, ਤਾਂ ਪਹਿਲਾ ${one} ਮਿਲਣ ਤੋਂ ਪਹਿਲਾਂ ਕਿੰਨੀ ਦੂਰੀ ਤੈਅ ਕਰੇਗਾ?`;
      return `ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਦੇ ਦੋ ${one} ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ${s.ratioA}:${s.ratioB} ਹੈ। ਉਹ ${route} km ਰਸਤੇ ਦੇ ਸਿਰਿਆਂ ਤੋਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਪਹਿਲੇ ਸਿਰੇ ਤੋਂ ਮਿਲਣ ਦਾ ਬਿੰਦੂ ਕਿੰਨੀ ਦੂਰੀ ਉੱਤੇ ਹੋਵੇਗਾ?`;
    case "REQUIRED_SPEED_FOR_MEETING_DEADLINE":
      if (v === 0) return `${A} ਅਤੇ ${B} ${gap} km ਦੂਰ ਹਨ ਅਤੇ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਦੇ ਹਨ। ${B} ਦੀ ਰਫ਼ਤਾਰ ${b} km/h ਹੈ। ਜੇ ਉਹਨਾਂ ਨੇ ${deadline} ਮਿੰਟ ਦੇ ਅੰਦਰ ਮਿਲਣਾ ਹੋਵੇ, ਤਾਂ ${A} ਦੀ ਰਫ਼ਤਾਰ ਕਿੰਨੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?`;
      if (v === 1) return `${B}, ${A} ਤੋਂ ${gap} km ਅੱਗੇ ${b} km/h ਨਾਲ ਚੱਲਦਾ ਹੈ। ਜੇ ${A} ਨੇ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਚੱਲਦਿਆਂ ${deadline} ਮਿੰਟ ਦੇ ਅੰਦਰ ${B} ਨੂੰ ਫੜਨਾ ਹੋਵੇ, ਤਾਂ ${A} ਦੀ ਘੱਟੋ-ਘੱਟ ਸਥਿਰ ਰਫ਼ਤਾਰ ਕਿੰਨੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?`;
      return `ਦੋ ${one} ${gap} km ਦੂਰ ਬਿੰਦੂਆਂ ਤੋਂ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਦੇ ਹਨ। ਇੱਕ ਦੀ ਰਫ਼ਤਾਰ ${b} km/h ਹੈ। ${deadline} ਮਿੰਟ ਵਿੱਚ ਮਿਲਣ ਲਈ ਦੂਜੇ ਨੂੰ ਕਿੰਨੀ ਸਥਿਰ ਰਫ਼ਤਾਰ ਰੱਖਣੀ ਚਾਹੀਦੀ ਹੈ?`;
    case "MULTI_PURSUER_MEETING_ORDER":
      if (v === 0) return `${B}, ${b} km/h ਨਾਲ ਚੱਲਦਾ ਹੈ। ${A}, ${gap} km ਪਿੱਛੇ ${a} km/h ਨਾਲ ਚੱਲਦਾ ਹੈ, ਜਦਕਿ ${C}, ${extra} km ਪਿੱਛੇ ${c} km/h ਨਾਲ ਚੱਲਦਾ ਹੈ। ਜੇ ਸਾਰੇ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਚੱਲਦੇ ਰਹਿਣ, ਤਾਂ ${B} ਨੂੰ ਪਹਿਲਾਂ ਕੌਣ ਫੜੇਗਾ?`;
      if (v === 1) return `ਨਿਸ਼ਾਨਾ ${one}, ${b} km/h ਨਾਲ ਚੱਲਦਾ ਹੈ। ਪਿੱਛਾ ਕਰਨ ਵਾਲਾ A ${gap} km ਪਿੱਛੇ ${a} km/h ਉੱਤੇ ਅਤੇ ਪਿੱਛਾ ਕਰਨ ਵਾਲਾ C ${extra} km ਪਿੱਛੇ ${c} km/h ਉੱਤੇ ਹੈ। ਨਿਸ਼ਾਨੇ ਤੱਕ ਪਹਿਲਾਂ ਕੌਣ ਪਹੁੰਚੇਗਾ?`;
      return `${A} ਅਤੇ ${C}, ਉਸੇ ਸਿੱਧੀ ਸੜਕ ਉੱਤੇ ${B} ਦਾ ਪਿੱਛਾ ਕਰਦੇ ਹਨ। ਉਹਨਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਕ੍ਰਮਵਾਰ ${a}, ${c} ਅਤੇ ${b} km/h ਹਨ; ${B} ਤੋਂ ਉਹਨਾਂ ਦੇ ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲੇ ${gap} km ਅਤੇ ${extra} km ਹਨ। ਪਕੜਨ ਦੇ ਸਮੇਂ ਦੀ ਤੁਲਨਾ ਕਰੋ: ${B} ਨੂੰ ਪਹਿਲਾਂ ਕੌਣ ਫੜੇਗਾ?`;
    default:
      return polishWhile(english.stem, renderCp004NativeStem(s, language), language);
  }
}

function parseNumericOption(text: string): number | null {
  const m = text.match(/^(-?\d+(?:\.\d+)?)(?:\s+(\d+)\/(\d+))?/u);
  if (!m) return null;
  const whole = Number(m[1]);
  if (!m[2]) return whole;
  return whole + Number(m[2]) / Number(m[3]);
}

function candidateAudit(text: string, misconceptionId: TsdCp004OptionAudit["misconceptionId"]): TsdCp004OptionAudit {
  return Object.freeze({ text, misconceptionId, isCorrect: false });
}

export function polishCp004EditorialV2Options(base: TsdCp004Question): readonly TsdCp004OptionAudit[] {
  const audits = base.optionAudit.map((x) => ({ ...x })) as { text: string; misconceptionId: TsdCp004OptionAudit["misconceptionId"]; isCorrect: boolean }[];
  const correct = base.solution.answerValue;
  if (base.authorityId === "MEETING_POINT_DISTANCE_SPLIT" && correct) {
    const route = Number(base.state.routeLengthKm.numerator) / Number(base.state.routeLengthKm.denominator);
    const correctNum = Number(correct.numerator) / Number(correct.denominator);
    const complement = route - correctNum;
    const safe = Math.abs(correctNum - complement);
    for (let i = 0; i < audits.length; i += 1) {
      if (audits[i].isCorrect) continue;
      const value = parseNumericOption(audits[i].text);
      if (value !== null && (value <= 0 || value >= route)) {
        const replacement = safe > 0 && safe < route && !audits.some((x) => parseNumericOption(x.text) === safe)
          ? `${Number.isInteger(safe) ? safe : Number(safe.toFixed(2))} km`
          : `${Number.isInteger(route / 4) ? route / 4 : Number((route / 4).toFixed(2))} km`;
        audits[i] = { text: replacement, misconceptionId: "USE_TOTAL_SPEED_AS_DISTANCE_SHARE", isCorrect: false };
      }
    }
  }
  if ((base.authorityId === "HEAD_START_CATCH_UP_TIME" || base.authorityId === "DELAYED_START_CATCH_UP_TIME") && correct) {
    const answer = Number(correct.numerator) / Number(correct.denominator);
    for (let i = 0; i < audits.length; i += 1) {
      if (audits[i].isCorrect || !/\d+\/\d+/.test(audits[i].text)) continue;
      const candidates = [answer / 2, answer * 1.5, answer * 2].filter((x) => x > 0 && Number.isInteger(x));
      const chosen = candidates.find((x) => !audits.some((a) => parseNumericOption(a.text) === x));
      if (chosen !== undefined) audits[i] = { text: `${chosen} minutes`, misconceptionId: "HALVE_CLOSING_TIME", isCorrect: false };
    }
  }
  const texts = audits.map((x) => x.text);
  if (new Set(texts).size !== 4) return base.optionAudit;
  return Object.freeze(audits.map((x) => Object.freeze(x)));
}

function svgText(language: "en" | TsdCp004NativeLanguage, key: "initialGap" | "start" | "firstEvent" | "delay" | "unknown" | "timeline"): string {
  const maps = {
    en: { initialGap: "initial gap", start: "start", firstEvent: "first event", delay: "delay", unknown: "? min", timeline: "relative-motion timeline" },
    hi: { initialGap: "शुरुआती अंतर", start: "शुरुआत", firstEvent: "पहली घटना", delay: "देरी", unknown: "? मिनट", timeline: "सापेक्ष गति समयरेखा" },
    pa: { initialGap: "ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲਾ", start: "ਸ਼ੁਰੂਆਤ", firstEvent: "ਪਹਿਲੀ ਘਟਨਾ", delay: "ਦੇਰੀ", unknown: "? ਮਿੰਟ", timeline: "ਸਾਪੇਖ ਗਤੀ ਸਮਾਂ-ਰੇਖਾ" },
  } as const;
  return maps[language][key];
}

export function buildCp004EditorialV2Visual(state: TsdCp004CanonicalState, language: "en" | TsdCp004NativeLanguage): TsdCp004Visual | null {
  if (state.representation === "PROSE") return null;
  const a = n(state.speedAKmph), b = n(state.speedBKmph), gap = n(state.initialGapKm);
  if (state.representation === "NUMBER_LINE") {
    const dirA = state.directionCase === "OPPOSITE_AWAY" ? "←" : "→";
    const dirB = state.directionCase === "OPPOSITE_TOWARD" ? "←" : "→";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="145" viewBox="0 0 560 145" role="img"><line x1="65" y1="78" x2="495" y2="78" stroke="currentColor" stroke-width="2"/><circle cx="105" cy="78" r="5"/><circle cx="455" cy="78" r="5"/><text x="70" y="42" font-size="14">A ${dirA} ${a} km/h</text><text x="390" y="42" font-size="14">B ${dirB} ${b} km/h</text><text x="205" y="112" font-size="13">${svgText(language,"initialGap")}: ${gap} km</text></svg>`;
    const alt = language === "en"
      ? `Straight-line positions of A and B with their directions, speeds ${a} km/h and ${b} km/h, and initial gap ${gap} km.`
      : language === "hi"
        ? `सीधी रेखा पर A और B की दिशाएँ, ${a} km/h और ${b} km/h की गतियाँ तथा ${gap} km का शुरुआती अंतर दिखाया गया है।`
        : `ਸਿੱਧੀ ਰੇਖਾ ਉੱਤੇ A ਅਤੇ B ਦੀਆਂ ਦਿਸ਼ਾਵਾਂ, ${a} km/h ਅਤੇ ${b} km/h ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਅਤੇ ${gap} km ਦਾ ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲਾ ਦਿਖਾਇਆ ਗਿਆ ਹੈ।`;
    return Object.freeze({ kind: "NUMBER_LINE", svg, alt });
  }

  const delay = n(state.startDelayMinutes);
  const delayKnown = ["DELAYED_START_CATCH_UP_TIME"].includes(state.authorityId);
  const delayUnknown = state.authorityId === "START_DELAY_FROM_CATCH_UP";
  const middle = delayKnown
    ? `${svgText(language,"delay")}: ${delay} ${language === "en" ? "min" : language === "hi" ? "मिनट" : "ਮਿੰਟ"}`
    : delayUnknown ? `${svgText(language,"delay")}: ${svgText(language,"unknown")}` : svgText(language,"timeline");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="145" viewBox="0 0 560 145" role="img"><line x1="70" y1="70" x2="490" y2="70" stroke="currentColor" stroke-width="2"/><line x1="70" y1="55" x2="70" y2="88" stroke="currentColor"/><line x1="490" y1="55" x2="490" y2="88" stroke="currentColor"/><text x="48" y="112" font-size="13">${svgText(language,"start")}</text><text x="215" y="45" font-size="13">${middle}</text><text x="430" y="112" font-size="13">${svgText(language,"firstEvent")}: ${svgText(language,"unknown")}</text></svg>`;
  const alt = language === "en"
    ? `Timeline from the start to the requested first relative-motion event; unknown event time is shown as a question mark.`
    : language === "hi"
      ? `शुरुआत से मांगी गई पहली सापेक्ष-गति घटना तक की समयरेखा; अज्ञात समय प्रश्नचिह्न से दिखाया गया है।`
      : `ਸ਼ੁਰੂਆਤ ਤੋਂ ਮੰਗੀ ਗਈ ਪਹਿਲੀ ਸਾਪੇਖ-ਗਤੀ ਘਟਨਾ ਤੱਕ ਦੀ ਸਮਾਂ-ਰੇਖਾ; ਅਣਜਾਣ ਸਮਾਂ ਪ੍ਰਸ਼ਨ-ਚਿੰਨ੍ਹ ਨਾਲ ਦਿਖਾਇਆ ਗਿਆ ਹੈ।`;
  return Object.freeze({ kind: "TIMELINE", svg, alt });
}
