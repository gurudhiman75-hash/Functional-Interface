import { absRational, add, divide, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { generateCp004EnglishQuestion, generateCp004EnglishReviewCorpus } from "./runtime";
import type { TsdCp004AuthorityId } from "./authority";
import type { TsdCp004CanonicalState, TsdCp004Explanation, TsdCp004Language, TsdCp004Question } from "./types";

export type TsdCp004NativeLanguage = "hi" | "pa";

const NOUNS = Object.freeze({
  hi: Object.freeze({ RUNNER: "धावक", CYCLIST: "साइकिल चालक", CAR: "कार", BUS: "बस", SCOOTER: "स्कूटर", DELIVERY_VAN: "डिलीवरी वैन" }),
  pa: Object.freeze({ RUNNER: "ਦੌੜਾਕ", CYCLIST: "ਸਾਈਕਲ ਸਵਾਰ", CAR: "ਕਾਰ", BUS: "ਬੱਸ", SCOOTER: "ਸਕੂਟਰ", DELIVERY_VAN: "ਡਿਲਿਵਰੀ ਵੈਨ" }),
});

function n(value: Rational): string {
  if (value.denominator === 1n) return String(value.numerator);
  const scaled10 = value.numerator * 10n;
  if (scaled10 % value.denominator === 0n) return (Number(scaled10 / value.denominator) / 10).toString();
  const scaled100 = value.numerator * 100n;
  if (scaled100 % value.denominator === 0n) return (Number(scaled100 / value.denominator) / 100).toString();
  const sign = value.numerator < 0n ? "-" : "";
  const raw = value.numerator < 0n ? -value.numerator : value.numerator;
  const whole = raw / value.denominator;
  const rem = raw % value.denominator;
  return whole === 0n ? `${sign}${rem}/${value.denominator}` : `${sign}${whole} ${rem}/${value.denominator}`;
}

function hours(minutes: Rational): Rational {
  return divide(minutes, rational(60));
}

function km(speed: Rational, minutes: Rational): Rational {
  return multiply(speed, hours(minutes));
}

function noun(state: TsdCp004CanonicalState, language: TsdCp004NativeLanguage): string {
  return NOUNS[language][state.actorKind];
}

function actor(state: TsdCp004CanonicalState, language: TsdCp004NativeLanguage, letter: "A" | "B" | "C"): string {
  return `${noun(state, language)} ${letter}`;
}

function localizeAnswerText(text: string, language: TsdCp004NativeLanguage): string {
  const orders: Record<string, readonly [string, string]> = {
    "Pursuer A catches first": ["पीछा करने वाला A पहले पकड़ता है", "ਪਿੱਛਾ ਕਰਨ ਵਾਲਾ A ਪਹਿਲਾਂ ਫੜਦਾ ਹੈ"],
    "Pursuer C catches first": ["पीछा करने वाला C पहले पकड़ता है", "ਪਿੱਛਾ ਕਰਨ ਵਾਲਾ C ਪਹਿਲਾਂ ਫੜਦਾ ਹੈ"],
    "Both catch at the same time": ["दोनों एक ही समय पर पकड़ते हैं", "ਦੋਵੇਂ ਇੱਕੋ ਸਮੇਂ ਫੜਦੇ ਹਨ"],
    "Neither can catch": ["कोई भी नहीं पकड़ सकता", "ਕੋਈ ਵੀ ਨਹੀਂ ਫੜ ਸਕਦਾ"],
  };
  if (orders[text]) return orders[text][language === "hi" ? 0 : 1];
  if (language === "hi") return text.replace(/ minutes$/u, " मिनट");
  return text.replace(/ minutes$/u, " ਮਿੰਟ");
}

export function cp004ExpectedNativeNoun(state: TsdCp004CanonicalState, language: TsdCp004NativeLanguage): string {
  return noun(state, language);
}

export function renderCp004NativeStem(state: TsdCp004CanonicalState, language: TsdCp004NativeLanguage): string {
  const A = actor(state, language, "A");
  const B = actor(state, language, "B");
  const C = actor(state, language, "C");
  const a = n(state.speedAKmph);
  const b = n(state.speedBKmph);
  const c = n(state.speedCKmph);
  const gap = n(state.initialGapKm);
  const t = n(state.elapsedMinutes);
  const delay = n(state.startDelayMinutes);
  const target = n(state.targetSeparationKm);
  const route = n(state.routeLengthKm);
  const point = n(state.meetingFromAKm);
  const deadline = n(state.deadlineMinutes);
  const extraGap = n(state.extraGapCKm);
  const one = noun(state, language);

  if (language === "hi") {
    switch (state.authorityId) {
      case "RELATIVE_SPEED_OPPOSITE":
        return state.variant === 0
          ? `${A} और ${B} एक ही सीधी सड़क पर क्रमशः ${a} km/h और ${b} km/h की गति से एक-दूसरे की ओर बढ़ रहे हैं। उनके बीच की दूरी किस गति से कम हो रही है?`
          : state.variant === 1
            ? `दो ${one} क्रमशः ${a} km/h और ${b} km/h की गति से एक-दूसरे की ओर बढ़ते हैं। उनकी सापेक्ष गति कितनी है?`
            : `यदि ${A} ${a} km/h की गति से पूर्व की ओर चले और ${B} ${b} km/h की गति से उसकी ओर पश्चिम की दिशा से आए, तो उनकी सापेक्ष गति कितनी होगी?`;
      case "RELATIVE_SPEED_SAME_DIRECTION":
        return state.variant === 0
          ? `${A} और ${B} एक ही दिशा में क्रमशः ${a} km/h और ${b} km/h की गति से चलते हैं, और ${A} अधिक तेज है। ${B} के सापेक्ष ${A} की पकड़ने की गति कितनी है?`
          : state.variant === 1
            ? `${B} एक सीधी सड़क पर आगे है और ${b} km/h की गति से चलता है। ${A} उसी दिशा में ${a} km/h की गति से पीछे से आता है। उनके बीच का अंतर किस गति से कम हो रहा है?`
            : `यदि दो ${one} एक ही दिशा में ${a} km/h और ${b} km/h की गति से चलें, तो तेज ${one} की धीमे ${one} के सापेक्ष गति कितनी होगी?`;
      case "FIRST_MEETING_TIME":
        return state.directionCase === "OPPOSITE_TOWARD"
          ? `${A} और ${B} ${gap} km की दूरी पर हैं और एक ही समय पर क्रमशः ${a} km/h और ${b} km/h की गति से एक-दूसरे की ओर चलना शुरू करते हैं। वे पहली बार कितने मिनट बाद मिलेंगे?`
          : `${B}, ${A} से ${gap} km आगे है। दोनों एक ही दिशा में क्रमशः ${b} km/h और ${a} km/h की गति से चलते हैं। यदि दोनों एक ही समय पर चलना शुरू करें, तो ${A}, ${B} को कितने मिनट बाद पकड़ेगा?`;
      case "INITIAL_GAP_FROM_MEETING":
        return state.directionCase === "OPPOSITE_TOWARD"
          ? `${A} और ${B} एक ही समय पर ${a} km/h और ${b} km/h की गति से एक-दूसरे की ओर चलते हैं और ${t} मिनट बाद मिलते हैं। उनके शुरुआती बिंदुओं के बीच कितनी दूरी थी?`
          : `${A}, ${B} के पीछे से ${a} km/h की गति से चलता है, जबकि ${B} उसी दिशा में ${b} km/h की गति से चलता है। यदि ${A}, ${B} को ${t} मिनट में पकड़ लेता है, तो शुरुआती अंतर कितना था?`;
      case "UNKNOWN_SPEED_FROM_MEETING":
        return state.directionCase === "OPPOSITE_TOWARD"
          ? `${A} और ${B} ${gap} km की दूरी से एक-दूसरे की ओर चलना शुरू करते हैं। ${B} की गति ${b} km/h है और वे ${t} मिनट बाद मिलते हैं। ${A} की गति कितनी है?`
          : `${B}, ${A} से ${gap} km आगे है और ${b} km/h की गति से चलता है। ${A} उसी समय पीछे से चलना शुरू करता है और ${t} मिनट में ${B} को पकड़ लेता है। ${A} की गति कितनी है?`;
      case "HEAD_START_CATCH_UP_TIME":
        return `${B} को ${gap} km की बढ़त मिली हुई है और उसकी गति ${b} km/h है। ${A} उसी दिशा में ${a} km/h की गति से पीछे से चलता है। ${A}, ${B} को कितने मिनट में पकड़ेगा?`;
      case "HEAD_START_DISTANCE":
        return `${A} और ${B} एक ही दिशा में क्रमशः ${a} km/h और ${b} km/h की गति से चलते हैं। यदि ${A}, ${B} को ${t} मिनट बाद पकड़ता है, तो शुरुआत में ${B} कितने km आगे था?`;
      case "DELAYED_START_CATCH_UP_TIME":
        return `${B} का चलना ${b} km/h की गति से पहले शुरू होता है। ${A} उसी बिंदु से ${delay} मिनट बाद ${a} km/h की गति से पीछा शुरू करता है। ${A} के चलना शुरू करने के बाद ${B} को पकड़ने में कितने मिनट लगेंगे?`;
      case "START_DELAY_FROM_CATCH_UP":
        return `${B} की गति ${b} km/h है और उसका चलना ${A} से पहले शुरू होता है। बाद में ${A} उसी बिंदु से ${a} km/h की गति से पीछा करता है और ${t} मिनट के पीछा समय के बाद ${B} को पकड़ता है। ${B} ने कितने मिनट पहले चलना शुरू किया था?`;
      case "SEPARATION_AFTER_TIME":
        if (state.directionCase === "OPPOSITE_AWAY") return `${A} और ${B} शुरुआत में ${gap} km दूर हैं और विपरीत दिशाओं में क्रमशः ${a} km/h और ${b} km/h की गति से एक-दूसरे से दूर जाते हैं। ${t} मिनट बाद उनके बीच की दूरी कितनी होगी?`;
        if (state.directionCase === "SAME_DIRECTION") return `${A}, ${B} से शुरुआत में ${gap} km आगे है और दोनों एक ही दिशा में क्रमशः ${a} km/h और ${b} km/h की गति से चलते हैं, जहाँ ${A} तेज है। ${t} मिनट बाद अंतर कितना होगा?`;
        return `${A} और ${B} ${gap} km दूर हैं और क्रमशः ${a} km/h तथा ${b} km/h की गति से एक-दूसरे की ओर चलते हैं। मिलने से पहले, ${t} मिनट बाद उनके बीच कितनी दूरी बचेगी?`;
      case "TIME_TO_SPECIFIED_SEPARATION":
        if (state.directionCase === "OPPOSITE_AWAY") return `${A} और ${B} शुरुआत में ${gap} km दूर हैं और ${a} km/h तथा ${b} km/h की गति से एक-दूसरे से दूर जाते हैं। वे कितने मिनट बाद ${target} km दूर होंगे?`;
        if (state.directionCase === "SAME_DIRECTION") return `${A}, ${B} से ${gap} km आगे है और दोनों एक ही दिशा में क्रमशः ${a} km/h और ${b} km/h की गति से चलते हैं, जहाँ ${A} तेज है। अंतर ${target} km होने में कितने मिनट लगेंगे?`;
        return `${A} और ${B} ${gap} km दूर हैं और ${a} km/h तथा ${b} km/h की गति से एक-दूसरे की ओर चलते हैं। उनके बीच की शेष दूरी ${target} km होने में कितने मिनट लगेंगे?`;
      case "MEETING_POINT_DISTANCE_SPLIT":
        return `${A} और ${B} ${route} km लंबे मार्ग के विपरीत सिरों से एक ही समय पर क्रमशः ${a} km/h और ${b} km/h की गति से एक-दूसरे की ओर चलना शुरू करते हैं। वे ${A} के शुरुआती बिंदु से कितनी दूरी पर मिलेंगे?`;
      case "SPEED_RATIO_FROM_MEETING_POINT":
        return `${A} और ${B} ${route} km लंबे मार्ग के विपरीत सिरों से एक ही समय पर चलते हैं और ${A} के सिरे से ${point} km दूर एक बिंदु पर मिलते हैं। उनकी गति का अनुपात ${A}:${B} क्या है?`;
      case "MEETING_POINT_FROM_SPEED_RATIO":
        return `दो ${one} ${route} km लंबे मार्ग के विपरीत सिरों से एक ही समय पर चलते हैं। यदि उनकी गतियों का अनुपात ${state.ratioA}:${state.ratioB} है, तो वे पहले ${one} के शुरुआती बिंदु से कितनी दूरी पर मिलेंगे?`;
      case "REQUIRED_SPEED_FOR_MEETING_DEADLINE":
        return state.directionCase === "OPPOSITE_TOWARD"
          ? `${A} और ${B} ${gap} km दूर हैं और एक-दूसरे की ओर चलते हैं। ${B} की गति ${b} km/h है। यदि उन्हें ${deadline} मिनट के भीतर मिलना हो, तो ${A} को कितनी गति रखनी चाहिए?`
          : `${B}, ${A} से ${gap} km आगे है और ${b} km/h की गति से चलता है। यदि ${A} को उसी दिशा में चलते हुए ${deadline} मिनट के भीतर ${B} को पकड़ना हो, तो ${A} को कितनी गति रखनी चाहिए?`;
      case "MULTI_PURSUER_MEETING_ORDER":
        return `${B} एक सीधी सड़क पर ${b} km/h की गति से चलता है। ${A}, ${a} km/h की गति से चलते हुए ${B} से ${gap} km पीछे है; ${C}, ${c} km/h की गति से चलते हुए ${B} से ${extraGap} km पीछे है। यदि तीनों समान गति बनाए रखें, तो ${B} को पहले कौन पकड़ेगा?`;
    }
  }

  switch (state.authorityId) {
    case "RELATIVE_SPEED_OPPOSITE":
      return state.variant === 0
        ? `${A} ਅਤੇ ${B} ਇੱਕੋ ਸਿੱਧੀ ਸੜਕ ਉੱਤੇ ਕ੍ਰਮਵਾਰ ${a} km/h ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲ ਰਹੇ ਹਨ। ਉਹਨਾਂ ਵਿਚਲੀ ਦੂਰੀ ਕਿਸ ਰਫ਼ਤਾਰ ਨਾਲ ਘਟ ਰਹੀ ਹੈ?`
        : state.variant === 1
          ? `ਦੋ ${one} ਕ੍ਰਮਵਾਰ ${a} km/h ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਆ ਰਹੇ ਹਨ। ਉਹਨਾਂ ਦੀ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਕਿੰਨੀ ਹੈ?`
          : `ਜੇ ${A} ${a} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਪੂਰਬ ਵੱਲ ਚੱਲੇ ਅਤੇ ${B} ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਪੱਛਮ ਵੱਲੋਂ ਉਸਦੀ ਓਰ ਆਵੇ, ਤਾਂ ਉਹਨਾਂ ਦੀ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਕਿੰਨੀ ਹੋਵੇਗੀ?`;
    case "RELATIVE_SPEED_SAME_DIRECTION":
      return state.variant === 0
        ? `${A} ਅਤੇ ${B} ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਕ੍ਰਮਵਾਰ ${a} km/h ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦੇ ਹਨ ਅਤੇ ${A} ਤੇਜ਼ ਹੈ। ${B} ਦੇ ਸਾਪੇਖ ${A} ਦੀ ਪਕੜਨ ਵਾਲੀ ਰਫ਼ਤਾਰ ਕਿੰਨੀ ਹੈ?`
        : state.variant === 1
          ? `${B} ਸਿੱਧੀ ਸੜਕ ਉੱਤੇ ਅੱਗੇ ਹੈ ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦਾ ਹੈ। ${A} ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ${a} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਪਿੱਛੋਂ ਆਉਂਦਾ ਹੈ। ਉਹਨਾਂ ਵਿਚਲਾ ਫ਼ਾਸਲਾ ਕਿਸ ਰਫ਼ਤਾਰ ਨਾਲ ਘਟਦਾ ਹੈ?`
          : `ਜੇ ਦੋ ${one} ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ${a} km/h ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਣ, ਤਾਂ ਤੇਜ਼ ${one} ਦੀ ਹੌਲੀ ${one} ਦੇ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਕਿੰਨੀ ਹੋਵੇਗੀ?`;
    case "FIRST_MEETING_TIME":
      return state.directionCase === "OPPOSITE_TOWARD"
        ? `${A} ਅਤੇ ${B} ${gap} km ਦੂਰ ਹਨ ਅਤੇ ਇੱਕੋ ਸਮੇਂ ਕ੍ਰਮਵਾਰ ${a} km/h ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਉਹ ਪਹਿਲੀ ਵਾਰ ਕਿੰਨੇ ਮਿੰਟ ਬਾਅਦ ਮਿਲਣਗੇ?`
        : `${B}, ${A} ਤੋਂ ${gap} km ਅੱਗੇ ਹੈ। ਦੋਵੇਂ ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਕ੍ਰਮਵਾਰ ${b} km/h ਅਤੇ ${a} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦੇ ਹਨ। ਜੇ ਦੋਵੇਂ ਇੱਕੋ ਸਮੇਂ ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਨ, ਤਾਂ ${A}, ${B} ਨੂੰ ਕਿੰਨੇ ਮਿੰਟ ਬਾਅਦ ਫੜੇਗਾ?`;
    case "INITIAL_GAP_FROM_MEETING":
      return state.directionCase === "OPPOSITE_TOWARD"
        ? `${A} ਅਤੇ ${B} ਇੱਕੋ ਸਮੇਂ ${a} km/h ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਦੇ ਹਨ ਅਤੇ ${t} ਮਿੰਟ ਬਾਅਦ ਮਿਲਦੇ ਹਨ। ਉਹਨਾਂ ਦੇ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂਆਂ ਵਿਚਲੀ ਦੂਰੀ ਕਿੰਨੀ ਸੀ?`
        : `${A}, ${B} ਦੇ ਪਿੱਛੋਂ ${a} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦਾ ਹੈ, ਜਦਕਿ ${B} ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦਾ ਹੈ। ਜੇ ${A}, ${B} ਨੂੰ ${t} ਮਿੰਟ ਵਿੱਚ ਫੜ ਲੈਂਦਾ ਹੈ, ਤਾਂ ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲਾ ਕਿੰਨਾ ਸੀ?`;
    case "UNKNOWN_SPEED_FROM_MEETING":
      return state.directionCase === "OPPOSITE_TOWARD"
        ? `${A} ਅਤੇ ${B} ${gap} km ਦੀ ਦੂਰੀ ਤੋਂ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ${B} ਦੀ ਰਫ਼ਤਾਰ ${b} km/h ਹੈ ਅਤੇ ਉਹ ${t} ਮਿੰਟ ਬਾਅਦ ਮਿਲਦੇ ਹਨ। ${A} ਦੀ ਰਫ਼ਤਾਰ ਕਿੰਨੀ ਹੈ?`
        : `${B}, ${A} ਤੋਂ ${gap} km ਅੱਗੇ ਹੈ ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦਾ ਹੈ। ${A} ਉਸੇ ਸਮੇਂ ਪਿੱਛੋਂ ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਅਤੇ ${t} ਮਿੰਟ ਵਿੱਚ ${B} ਨੂੰ ਫੜ ਲੈਂਦਾ ਹੈ। ${A} ਦੀ ਰਫ਼ਤਾਰ ਕਿੰਨੀ ਹੈ?`;
    case "HEAD_START_CATCH_UP_TIME":
      return `${B} ਨੂੰ ${gap} km ਦੀ ਬੜ੍ਹਤ ਮਿਲੀ ਹੋਈ ਹੈ ਅਤੇ ਉਸਦੀ ਰਫ਼ਤਾਰ ${b} km/h ਹੈ। ${A} ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ${a} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਪਿੱਛੋਂ ਚੱਲਦਾ ਹੈ। ${A}, ${B} ਨੂੰ ਕਿੰਨੇ ਮਿੰਟ ਵਿੱਚ ਫੜੇਗਾ?`;
    case "HEAD_START_DISTANCE":
      return `${A} ਅਤੇ ${B} ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਕ੍ਰਮਵਾਰ ${a} km/h ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦੇ ਹਨ। ਜੇ ${A}, ${B} ਨੂੰ ${t} ਮਿੰਟ ਬਾਅਦ ਫੜਦਾ ਹੈ, ਤਾਂ ਸ਼ੁਰੂ ਵਿੱਚ ${B} ਕਿੰਨੇ km ਅੱਗੇ ਸੀ?`;
    case "DELAYED_START_CATCH_UP_TIME":
      return `${B} ਦੀ ਚਾਲ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ। ${A} ਉਸੇ ਬਿੰਦੂ ਤੋਂ ${delay} ਮਿੰਟ ਬਾਅਦ ${a} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਪਿੱਛਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${A} ਦੇ ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਬਾਅਦ ${B} ਨੂੰ ਫੜਨ ਵਿੱਚ ਕਿੰਨੇ ਮਿੰਟ ਲੱਗਣਗੇ?`;
    case "START_DELAY_FROM_CATCH_UP":
      return `${B} ਦੀ ਰਫ਼ਤਾਰ ${b} km/h ਹੈ ਅਤੇ ਉਸਦੀ ਚਾਲ ${A} ਤੋਂ ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ। ਬਾਅਦ ਵਿੱਚ ${A} ਉਸੇ ਬਿੰਦੂ ਤੋਂ ${a} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਪਿੱਛਾ ਕਰਦਾ ਹੈ ਅਤੇ ${t} ਮਿੰਟ ਦੇ ਪਿੱਛਾ ਸਮੇਂ ਤੋਂ ਬਾਅਦ ${B} ਨੂੰ ਫੜਦਾ ਹੈ। ${B} ਨੇ ਕਿੰਨੇ ਮਿੰਟ ਪਹਿਲਾਂ ਚੱਲਣਾ ਸ਼ੁਰੂ ਕੀਤਾ ਸੀ?`;
    case "SEPARATION_AFTER_TIME":
      if (state.directionCase === "OPPOSITE_AWAY") return `${A} ਅਤੇ ${B} ਸ਼ੁਰੂ ਵਿੱਚ ${gap} km ਦੂਰ ਹਨ ਅਤੇ ਵਿਰੁੱਧ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਕ੍ਰਮਵਾਰ ${a} km/h ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਇੱਕ-ਦੂਜੇ ਤੋਂ ਦੂਰ ਜਾਂਦੇ ਹਨ। ${t} ਮਿੰਟ ਬਾਅਦ ਉਹਨਾਂ ਵਿਚਲੀ ਦੂਰੀ ਕਿੰਨੀ ਹੋਵੇਗੀ?`;
      if (state.directionCase === "SAME_DIRECTION") return `${A}, ${B} ਤੋਂ ਸ਼ੁਰੂ ਵਿੱਚ ${gap} km ਅੱਗੇ ਹੈ ਅਤੇ ਦੋਵੇਂ ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਕ੍ਰਮਵਾਰ ${a} km/h ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦੇ ਹਨ, ਜਿੱਥੇ ${A} ਤੇਜ਼ ਹੈ। ${t} ਮਿੰਟ ਬਾਅਦ ਫ਼ਾਸਲਾ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
      return `${A} ਅਤੇ ${B} ${gap} km ਦੂਰ ਹਨ ਅਤੇ ਕ੍ਰਮਵਾਰ ${a} km/h ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਦੇ ਹਨ। ਮਿਲਣ ਤੋਂ ਪਹਿਲਾਂ, ${t} ਮਿੰਟ ਬਾਅਦ ਉਹਨਾਂ ਵਿਚਲੀ ਦੂਰੀ ਕਿੰਨੀ ਬਚੇਗੀ?`;
    case "TIME_TO_SPECIFIED_SEPARATION":
      if (state.directionCase === "OPPOSITE_AWAY") return `${A} ਅਤੇ ${B} ਸ਼ੁਰੂ ਵਿੱਚ ${gap} km ਦੂਰ ਹਨ ਅਤੇ ${a} km/h ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਇੱਕ-ਦੂਜੇ ਤੋਂ ਦੂਰ ਜਾਂਦੇ ਹਨ। ਉਹ ਕਿੰਨੇ ਮਿੰਟ ਬਾਅਦ ${target} km ਦੂਰ ਹੋਣਗੇ?`;
      if (state.directionCase === "SAME_DIRECTION") return `${A}, ${B} ਤੋਂ ${gap} km ਅੱਗੇ ਹੈ ਅਤੇ ਦੋਵੇਂ ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਕ੍ਰਮਵਾਰ ${a} km/h ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦੇ ਹਨ, ਜਿੱਥੇ ${A} ਤੇਜ਼ ਹੈ। ਫ਼ਾਸਲਾ ${target} km ਹੋਣ ਵਿੱਚ ਕਿੰਨੇ ਮਿੰਟ ਲੱਗਣਗੇ?`;
      return `${A} ਅਤੇ ${B} ${gap} km ਦੂਰ ਹਨ ਅਤੇ ${a} km/h ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਦੇ ਹਨ। ਉਹਨਾਂ ਵਿਚਲੀ ਬਾਕੀ ਦੂਰੀ ${target} km ਹੋਣ ਵਿੱਚ ਕਿੰਨੇ ਮਿੰਟ ਲੱਗਣਗੇ?`;
    case "MEETING_POINT_DISTANCE_SPLIT":
      return `${A} ਅਤੇ ${B} ${route} km ਲੰਮੇ ਰਸਤੇ ਦੇ ਵਿਰੁੱਧ ਸਿਰਿਆਂ ਤੋਂ ਇੱਕੋ ਸਮੇਂ ਕ੍ਰਮਵਾਰ ${a} km/h ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਉਹ ${A} ਦੇ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ਕਿੰਨੀ ਦੂਰੀ ਉੱਤੇ ਮਿਲਣਗੇ?`;
    case "SPEED_RATIO_FROM_MEETING_POINT":
      return `${A} ਅਤੇ ${B} ${route} km ਲੰਮੇ ਰਸਤੇ ਦੇ ਵਿਰੁੱਧ ਸਿਰਿਆਂ ਤੋਂ ਇੱਕੋ ਸਮੇਂ ਚੱਲਦੇ ਹਨ ਅਤੇ ${A} ਦੇ ਸਿਰੇ ਤੋਂ ${point} km ਦੂਰ ਇੱਕ ਬਿੰਦੂ ਉੱਤੇ ਮਿਲਦੇ ਹਨ। ਉਹਨਾਂ ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ${A}:${B} ਕੀ ਹੈ?`;
    case "MEETING_POINT_FROM_SPEED_RATIO":
      return `ਦੋ ${one} ${route} km ਲੰਮੇ ਰਸਤੇ ਦੇ ਵਿਰੁੱਧ ਸਿਰਿਆਂ ਤੋਂ ਇੱਕੋ ਸਮੇਂ ਚੱਲਦੇ ਹਨ। ਜੇ ਉਹਨਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ${state.ratioA}:${state.ratioB} ਹੈ, ਤਾਂ ਉਹ ਪਹਿਲੇ ${one} ਦੇ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ਕਿੰਨੀ ਦੂਰੀ ਉੱਤੇ ਮਿਲਣਗੇ?`;
    case "REQUIRED_SPEED_FOR_MEETING_DEADLINE":
      return state.directionCase === "OPPOSITE_TOWARD"
        ? `${A} ਅਤੇ ${B} ${gap} km ਦੂਰ ਹਨ ਅਤੇ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਦੇ ਹਨ। ${B} ਦੀ ਰਫ਼ਤਾਰ ${b} km/h ਹੈ। ਜੇ ਉਹਨਾਂ ਨੇ ${deadline} ਮਿੰਟ ਦੇ ਅੰਦਰ ਮਿਲਣਾ ਹੋਵੇ, ਤਾਂ ${A} ਨੂੰ ਕਿਹੜੀ ਰਫ਼ਤਾਰ ਰੱਖਣੀ ਚਾਹੀਦੀ ਹੈ?`
        : `${B}, ${A} ਤੋਂ ${gap} km ਅੱਗੇ ਹੈ ਅਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦਾ ਹੈ। ਜੇ ${A} ਨੇ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਚੱਲਦਿਆਂ ${deadline} ਮਿੰਟ ਦੇ ਅੰਦਰ ${B} ਨੂੰ ਫੜਨਾ ਹੋਵੇ, ਤਾਂ ${A} ਨੂੰ ਕਿਹੜੀ ਰਫ਼ਤਾਰ ਰੱਖਣੀ ਚਾਹੀਦੀ ਹੈ?`;
    case "MULTI_PURSUER_MEETING_ORDER":
      return `${B} ਇੱਕ ਸਿੱਧੀ ਸੜਕ ਉੱਤੇ ${b} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦਾ ਹੈ। ${A}, ${a} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦਿਆਂ ${B} ਤੋਂ ${gap} km ਪਿੱਛੇ ਹੈ; ${C}, ${c} km/h ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦਿਆਂ ${B} ਤੋਂ ${extraGap} km ਪਿੱਛੇ ਹੈ। ਜੇ ਤਿੰਨੇ ਇੱਕੋ ਰਫ਼ਤਾਰ ਜਾਰੀ ਰੱਖਣ, ਤਾਂ ${B} ਨੂੰ ਪਹਿਲਾਂ ਕੌਣ ਫੜੇਗਾ?`;
  }
}

function nativeExplanation(state: TsdCp004CanonicalState, english: TsdCp004Question, language: TsdCp004NativeLanguage): TsdCp004Explanation {
  const a = n(state.speedAKmph);
  const b = n(state.speedBKmph);
  const gap = n(state.initialGapKm);
  const t = n(state.elapsedMinutes);
  const sum = n(add(state.speedAKmph, state.speedBKmph));
  const diff = n(absRational(subtract(state.speedAKmph, state.speedBKmph)));
  const answer = localizeAnswerText(english.solution.answerText, language);
  if (language === "hi") {
    const baseMethod = state.directionCase === "SAME_DIRECTION" ? "एक ही दिशा में सापेक्ष गति के लिए तेज गति में से धीमी गति घटाएँ।" : "सीधी रेखा पर दूरी के बदलने की दर के रूप में सापेक्ष गति का उपयोग करें।";
    const steps: string[] = [];
    switch (state.authorityId) {
      case "RELATIVE_SPEED_OPPOSITE": steps.push(`दोनों एक-दूसरे की ओर चल रहे हैं, इसलिए गतियाँ जुड़ेंगी: ${a} + ${b} = ${sum} km/h।`, `यही उनके बीच की दूरी घटने की दर है।`, `अतः सापेक्ष गति ${answer} है।`); break;
      case "RELATIVE_SPEED_SAME_DIRECTION": steps.push(`दोनों एक ही दिशा में हैं, इसलिए तेज गति में से धीमी गति घटाएँ।`, `${a} - ${b} = ${diff} km/h।`, `अतः पकड़ने की गति ${answer} है।`); break;
      case "FIRST_MEETING_TIME": steps.push(`शुरुआती अंतर ${gap} km है।`, `सही सापेक्ष गति लेकर समय = दूरी ÷ सापेक्ष गति करें।`, `घंटों में मिले समय को मिनट में बदलने पर ${answer} मिलता है।`); break;
      case "DELAYED_START_CATCH_UP_TIME": steps.push(`पहले ${BLabel(state, language)} द्वारा बनाई गई बढ़त को दूरी में बदलें।`, `फिर एक ही दिशा की सापेक्ष गति ${a} - ${b} = ${diff} km/h लें।`, `बढ़त ÷ सापेक्ष गति करने पर पीछा समय ${answer} है।`); break;
      case "START_DELAY_FROM_CATCH_UP": steps.push(`पीछा करते समय मिटाई गई बढ़त = (${a} - ${b}) × पीछा समय।`, `यही बढ़त पहले चलने वाले ने शुरुआती देरी में बनाई थी।`, `उस दूरी को ${b} km/h से भाग देने पर शुरुआती देरी ${answer} है।`); break;
      case "MULTI_PURSUER_MEETING_ORDER": steps.push(`A और C के लिए पकड़ने का समय अलग-अलग निकालें।`, `हर बार समय = अपनी शुरुआती दूरी ÷ अपनी सापेक्ष पकड़ गति।`, `दोनों समयों की तुलना करने पर ${answer}।`); break;
      default: steps.push(`दिए गए अंतर और दिशाओं से सही सापेक्ष गति निर्धारित करें।`, `प्रश्न के अनुसार दूरी = गति × समय या समय = दूरी ÷ गति का उपयोग करें।`, `सटीक मान रखने पर उत्तर ${answer} मिलता है।`); break;
    }
    return Object.freeze({ method: baseMethod, steps: Object.freeze(steps), shortcut: state.directionCase === "SAME_DIRECTION" ? "एक दिशा: तेज − धीमी; विपरीत दिशा में एक-दूसरे की ओर: जोड़।" : "दूरी के अंतर पर काम करें; वही सापेक्ष गति से बदलता है।", answer: `उत्तर: ${answer}` });
  }
  const baseMethod = state.directionCase === "SAME_DIRECTION" ? "ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਲਈ ਤੇਜ਼ ਰਫ਼ਤਾਰ ਵਿੱਚੋਂ ਹੌਲੀ ਰਫ਼ਤਾਰ ਘਟਾਓ।" : "ਸਿੱਧੀ ਰੇਖਾ ਉੱਤੇ ਫ਼ਾਸਲੇ ਦੇ ਬਦਲਣ ਦੀ ਦਰ ਵਜੋਂ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਵਰਤੋ।";
  const steps: string[] = [];
  switch (state.authorityId) {
    case "RELATIVE_SPEED_OPPOSITE": steps.push(`ਦੋਵੇਂ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਆ ਰਹੇ ਹਨ, ਇਸ ਲਈ ਰਫ਼ਤਾਰਾਂ ਜੋੜੀਆਂ ਜਾਣਗੀਆਂ: ${a} + ${b} = ${sum} km/h।`, `ਇਹੀ ਉਹਨਾਂ ਵਿਚਲਾ ਫ਼ਾਸਲਾ ਘਟਣ ਦੀ ਦਰ ਹੈ।`, `ਇਸ ਲਈ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ${answer} ਹੈ।`); break;
    case "RELATIVE_SPEED_SAME_DIRECTION": steps.push(`ਦੋਵੇਂ ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਹਨ, ਇਸ ਲਈ ਤੇਜ਼ ਵਿੱਚੋਂ ਹੌਲੀ ਰਫ਼ਤਾਰ ਘਟਾਓ।`, `${a} - ${b} = ${diff} km/h।`, `ਇਸ ਲਈ ਪਕੜਨ ਦੀ ਰਫ਼ਤਾਰ ${answer} ਹੈ।`); break;
    case "FIRST_MEETING_TIME": steps.push(`ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲਾ ${gap} km ਹੈ।`, `ਸਹੀ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਨਾਲ ਸਮਾਂ = ਦੂਰੀ ÷ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਕਰੋ।`, `ਘੰਟਿਆਂ ਵਾਲੇ ਸਮੇਂ ਨੂੰ ਮਿੰਟਾਂ ਵਿੱਚ ਬਦਲਣ ਉੱਤੇ ${answer} ਮਿਲਦਾ ਹੈ।`); break;
    case "DELAYED_START_CATCH_UP_TIME": steps.push(`ਪਹਿਲਾਂ ${BLabel(state, language)} ਵੱਲੋਂ ਬਣਾਈ ਬੜ੍ਹਤ ਨੂੰ ਦੂਰੀ ਵਿੱਚ ਬਦਲੋ।`, `ਫਿਰ ਇੱਕੋ ਦਿਸ਼ਾ ਦੀ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ${a} - ${b} = ${diff} km/h ਲਓ।`, `ਬੜ੍ਹਤ ÷ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਕਰਨ ਉੱਤੇ ਪਿੱਛਾ ਸਮਾਂ ${answer} ਹੈ।`); break;
    case "START_DELAY_FROM_CATCH_UP": steps.push(`ਪਿੱਛਾ ਕਰਦਿਆਂ ਮਿਟਾਈ ਬੜ੍ਹਤ = (${a} - ${b}) × ਪਿੱਛਾ ਸਮਾਂ।`, `ਇਹੀ ਬੜ੍ਹਤ ਪਹਿਲਾਂ ਚੱਲਣ ਵਾਲੇ ਨੇ ਸ਼ੁਰੂਆਤੀ ਦੇਰੀ ਵਿੱਚ ਬਣਾਈ ਸੀ।`, `ਉਸ ਦੂਰੀ ਨੂੰ ${b} km/h ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ ਸ਼ੁਰੂਆਤੀ ਦੇਰੀ ${answer} ਹੈ।`); break;
    case "MULTI_PURSUER_MEETING_ORDER": steps.push(`A ਅਤੇ C ਲਈ ਪਕੜਨ ਦਾ ਸਮਾਂ ਵੱਖ-ਵੱਖ ਕੱਢੋ।`, `ਹਰ ਵਾਰ ਸਮਾਂ = ਆਪਣੀ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ÷ ਆਪਣੀ ਸਾਪੇਖ ਪਕੜ ਰਫ਼ਤਾਰ।`, `ਦੋਵੇਂ ਸਮਿਆਂ ਦੀ ਤੁਲਨਾ ਕਰਨ ਉੱਤੇ ${answer}।`); break;
    default: steps.push(`ਦਿੱਤੇ ਫ਼ਾਸਲੇ ਅਤੇ ਦਿਸ਼ਾਵਾਂ ਤੋਂ ਸਹੀ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਨਿਰਧਾਰਤ ਕਰੋ।`, `ਸਵਾਲ ਮੁਤਾਬਕ ਦੂਰੀ = ਰਫ਼ਤਾਰ × ਸਮਾਂ ਜਾਂ ਸਮਾਂ = ਦੂਰੀ ÷ ਰਫ਼ਤਾਰ ਵਰਤੋ।`, `ਸਹੀ ਮੁੱਲ ਰੱਖਣ ਉੱਤੇ ਜਵਾਬ ${answer} ਮਿਲਦਾ ਹੈ।`); break;
  }
  return Object.freeze({ method: baseMethod, steps: Object.freeze(steps), shortcut: state.directionCase === "SAME_DIRECTION" ? "ਇੱਕੋ ਦਿਸ਼ਾ: ਤੇਜ਼ − ਹੌਲੀ; ਵਿਰੁੱਧ ਦਿਸ਼ਾ ਵਿੱਚ ਇੱਕ-ਦੂਜੇ ਵੱਲ: ਜੋੜ।" : "ਫ਼ਾਸਲੇ ਉੱਤੇ ਕੰਮ ਕਰੋ; ਉਹੀ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਨਾਲ ਬਦਲਦਾ ਹੈ।", answer: `ਉੱਤਰ: ${answer}` });
}

function BLabel(state: TsdCp004CanonicalState, language: TsdCp004NativeLanguage): string {
  return actor(state, language, "B");
}

export interface TsdCp004NativeQuestion extends Omit<TsdCp004Question, "language" | "stem" | "options" | "explanation" | "correctIndex"> {
  readonly language: TsdCp004NativeLanguage;
  readonly stem: string;
  readonly options: readonly string[];
  readonly localizedAnswerText: string;
  readonly correctIndex: number;
  readonly explanation: TsdCp004Explanation;
}

export function renderCp004NativeQuestion(english: TsdCp004Question, language: TsdCp004NativeLanguage): TsdCp004NativeQuestion {
  const options = Object.freeze(english.options.map((text) => localizeAnswerText(text, language)));
  const localizedAnswerText = localizeAnswerText(english.solution.answerText, language);
  if (options[english.correctIndex] !== localizedAnswerText) throw new Error("Native correct option parity failed");
  return Object.freeze({
    ...english,
    language,
    stem: renderCp004NativeStem(english.state, language),
    options,
    localizedAnswerText,
    correctIndex: english.correctIndex,
    explanation: nativeExplanation(english.state, english, language),
  });
}

export function generateCp004NativeQuestion(authorityId: TsdCp004AuthorityId, seed: string, language: TsdCp004NativeLanguage): TsdCp004NativeQuestion {
  return renderCp004NativeQuestion(generateCp004EnglishQuestion(authorityId, seed), language);
}

export function generateCp004MultilingualReviewCorpus(): readonly (TsdCp004Question | TsdCp004NativeQuestion)[] {
  const english = generateCp004EnglishReviewCorpus();
  const all: (TsdCp004Question | TsdCp004NativeQuestion)[] = [];
  for (const question of english) {
    all.push(question, renderCp004NativeQuestion(question, "hi"), renderCp004NativeQuestion(question, "pa"));
  }
  return Object.freeze(all);
}

export function cp004SentenceCount(text: string): number {
  return text.split(/[.!?।?]+/u).map((x) => x.trim()).filter(Boolean).length;
}
