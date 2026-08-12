import { absRational, add, divide, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { renderCp004NativeStem, cp004ExpectedNativeNoun, type TsdCp004NativeLanguage } from "./native";
import { generateCp004FinalEnglishQuestion, generateCp004FinalEnglishReviewCorpus } from "./runtime-final";
import type { TsdCp004AuthorityId } from "./authority";
import type { TsdCp004Explanation, TsdCp004Question, TsdCp004Visual } from "./types";

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

function hours(minutes: Rational): Rational {
  return divide(minutes, rational(60));
}

function distance(speed: Rational, minutes: Rational): Rational {
  return multiply(speed, hours(minutes));
}

function answerText(text: string, language: TsdCp004NativeLanguage): string {
  const order: Record<string, readonly [string, string]> = {
    "Pursuer A catches first": ["पीछा करने वाला A पहले पकड़ता है", "ਪਿੱਛਾ ਕਰਨ ਵਾਲਾ A ਪਹਿਲਾਂ ਫੜਦਾ ਹੈ"],
    "Pursuer C catches first": ["पीछा करने वाला C पहले पकड़ता है", "ਪਿੱਛਾ ਕਰਨ ਵਾਲਾ C ਪਹਿਲਾਂ ਫੜਦਾ ਹੈ"],
    "Both catch at the same time": ["दोनों एक ही समय पर पकड़ते हैं", "ਦੋਵੇਂ ਇੱਕੋ ਸਮੇਂ ਫੜਦੇ ਹਨ"],
    "Neither can catch": ["कोई भी नहीं पकड़ सकता", "ਕੋਈ ਵੀ ਨਹੀਂ ਫੜ ਸਕਦਾ"],
  };
  const known = order[text];
  if (known) return known[language === "hi" ? 0 : 1];
  return language === "hi" ? text.replace(/ minutes$/u, " मिनट") : text.replace(/ minutes$/u, " ਮਿੰਟ");
}

function localizeVisual(visual: TsdCp004Visual | null, language: TsdCp004NativeLanguage): TsdCp004Visual | null {
  if (!visual) return null;
  if (language === "hi") {
    return Object.freeze({
      ...visual,
      svg: visual.svg
        .replace(/gap /gu, "अंतर ")
        .replace(/>start</gu, ">शुरुआत<")
        .replace(/>event</gu, ">घटना<")
        .replace(/>relative-motion timeline</gu, ">सापेक्ष गति समयरेखा<"),
      alt: visual.kind === "NUMBER_LINE"
        ? "सीधी रेखा पर A और B की स्थिति, गति और शुरुआती अंतर दिखाया गया है।"
        : "शुरुआत से मांगी गई पहली सापेक्ष-गति घटना तक की समयरेखा।",
    });
  }
  return Object.freeze({
    ...visual,
    svg: visual.svg
      .replace(/gap /gu, "ਫ਼ਾਸਲਾ ")
      .replace(/>start</gu, ">ਸ਼ੁਰੂਆਤ<")
      .replace(/>event</gu, ">ਘਟਨਾ<")
      .replace(/>relative-motion timeline</gu, ">ਸਾਪੇਖ ਗਤੀ ਸਮਾਂ-ਰੇਖਾ<"),
    alt: visual.kind === "NUMBER_LINE"
      ? "ਸਿੱਧੀ ਰੇਖਾ ਉੱਤੇ A ਅਤੇ B ਦੀ ਸਥਿਤੀ, ਰਫ਼ਤਾਰ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲਾ ਦਿਖਾਇਆ ਗਿਆ ਹੈ।"
      : "ਸ਼ੁਰੂਆਤ ਤੋਂ ਮੰਗੀ ਗਈ ਪਹਿਲੀ ਸਾਪੇਖ-ਗਤੀ ਘਟਨਾ ਤੱਕ ਦੀ ਸਮਾਂ-ਰੇਖਾ।",
  });
}

function hiExplanation(q: TsdCp004Question, localizedAnswer: string): TsdCp004Explanation {
  const s = q.state;
  const a = n(s.speedAKmph), b = n(s.speedBKmph), c = n(s.speedCKmph);
  const sum = n(add(s.speedAKmph, s.speedBKmph));
  const diff = n(absRational(subtract(s.speedAKmph, s.speedBKmph)));
  const gap = n(s.initialGapKm), t = n(s.elapsedMinutes), delay = n(s.startDelayMinutes);
  const target = n(s.targetSeparationKm), route = n(s.routeLengthKm), point = n(s.meetingFromAKm), deadline = n(s.deadlineMinutes);
  let method = "सापेक्ष गति से दोनों गतियों को एक ही अंतर पर लागू करें।";
  let steps: string[];
  let shortcut = "पहले तय करें कि अंतर घट रहा है या बढ़ रहा है; फिर सही सापेक्ष गति लगाएँ।";
  switch (s.authorityId) {
    case "RELATIVE_SPEED_OPPOSITE":
      method = "एक-दूसरे की ओर गति में दोनों गतियाँ जोड़ें।";
      steps = [`एक घंटे में पहला पिंड ${a} km और दूसरा ${b} km एक-दूसरे की ओर बढ़ता है।`, `इसलिए उनके बीच का अंतर ${a} + ${b} = ${sum} km प्रति घंटे घटता है।`, `अतः सापेक्ष गति ${localizedAnswer} है।`];
      shortcut = "एक-दूसरे की ओर → गतियाँ जोड़ें।"; break;
    case "RELATIVE_SPEED_SAME_DIRECTION":
      method = "एक ही दिशा में तेज गति में से धीमी गति घटाएँ।";
      steps = [`तेज गति ${a} km/h और धीमी गति ${b} km/h है।`, `एक घंटे में तेज पिंड ${a} - ${b} = ${diff} km की बढ़त लेता है।`, `अतः पकड़ने की सापेक्ष गति ${localizedAnswer} है।`];
      shortcut = "एक दिशा → तेज − धीमी।"; break;
    case "FIRST_MEETING_TIME": {
      const rel = s.directionCase === "OPPOSITE_TOWARD" ? sum : diff;
      steps = [`शुरुआती अंतर ${gap} km है।`, `इस स्थिति में सापेक्ष गति ${rel} km/h है।`, `समय = दूरी ÷ सापेक्ष गति = ${gap} ÷ ${rel} घंटे।`, `मिनट में बदलने पर ${localizedAnswer} मिलता है।`];
      shortcut = "पहली मुलाकात का समय = शुरुआती अंतर ÷ सकारात्मक closing speed।"; break;
    }
    case "INITIAL_GAP_FROM_MEETING": {
      const rel = s.directionCase === "OPPOSITE_TOWARD" ? sum : diff;
      steps = [`मिलने का समय ${t} मिनट = ${n(hours(s.elapsedMinutes))} घंटा है।`, `सापेक्ष गति ${rel} km/h है।`, `शुरुआती अंतर = ${rel} × ${n(hours(s.elapsedMinutes))} = ${localizedAnswer}.`];
      shortcut = "समय दिया हो तो उल्टा करें: अंतर = सापेक्ष गति × समय।"; break;
    }
    case "UNKNOWN_SPEED_FROM_MEETING": {
      const closing = n(divide(s.initialGapKm, hours(s.elapsedMinutes)));
      steps = [`${gap} km का अंतर ${t} मिनट में समाप्त होता है, इसलिए आवश्यक सापेक्ष गति ${closing} km/h है।`, s.directionCase === "OPPOSITE_TOWARD" ? `एक-दूसरे की ओर होने से अज्ञात गति + ${b} = ${closing}.` : `एक दिशा में पकड़ने के लिए अज्ञात तेज गति − ${b} = ${closing}.`, `समीकरण हल करने पर अज्ञात गति ${localizedAnswer} है।`];
      shortcut = "पहले closing speed निकालें, फिर दिशा के अनुसार ज्ञात गति जोड़ें या घटाएँ।"; break;
    }
    case "HEAD_START_CATCH_UP_TIME":
      steps = [`पहले से मिली बढ़त ${gap} km है।`, `एक दिशा में closing speed = ${a} - ${b} = ${diff} km/h।`, `पकड़ने का समय = ${gap} ÷ ${diff} घंटा।`, `मिनट में उत्तर ${localizedAnswer} है।`];
      shortcut = "distance lead ÷ speed difference।"; break;
    case "HEAD_START_DISTANCE":
      steps = [`closing speed = ${a} - ${b} = ${diff} km/h।`, `पकड़ने का समय ${t} मिनट = ${n(hours(s.elapsedMinutes))} घंटा है।`, `शुरुआती बढ़त = ${diff} × ${n(hours(s.elapsedMinutes))} = ${localizedAnswer}.`];
      shortcut = "बढ़त = गति का अंतर × पकड़ने का समय।"; break;
    case "DELAYED_START_CATCH_UP_TIME": {
      const lead = n(distance(s.speedBKmph, s.startDelayMinutes));
      steps = [`${delay} मिनट पहले चलकर B ${b} × ${n(hours(s.startDelayMinutes))} = ${lead} km की बढ़त बनाता है।`, `A के शुरू होने के बाद closing speed = ${a} - ${b} = ${diff} km/h।`, `पीछा समय = ${lead} ÷ ${diff} घंटा।`, `मिनट में यह ${localizedAnswer} है।`];
      shortcut = "देरी को पहले दूरी की बढ़त में बदलें।"; break;
    }
    case "START_DELAY_FROM_CATCH_UP": {
      const gain = n(distance(absRational(subtract(s.speedAKmph, s.speedBKmph)), s.elapsedMinutes));
      steps = [`${t} मिनट के पीछा में A, B पर ${diff} × ${n(hours(s.elapsedMinutes))} = ${gain} km की बढ़त बनाता है।`, `यही ${gain} km वह बढ़त थी जो B ने पहले चलकर बनाई थी।`, `B को ${b} km/h से ${gain} km तय करने में जितना समय लगेगा, वही शुरुआती देरी है।`, `इसलिए देरी ${localizedAnswer} है।`];
      shortcut = "पीछा में मिटाई बढ़त = पहले बनी बढ़त।"; break;
    }
    case "SEPARATION_AFTER_TIME":
      if (s.directionCase === "OPPOSITE_AWAY") steps = [`शुरुआती दूरी ${gap} km है।`, `दूर जाने पर अंतर ${sum} km/h से बढ़ता है।`, `${t} मिनट में बढ़ी दूरी को ${gap} km में जोड़ें।`, `नई दूरी ${localizedAnswer} है।`];
      else if (s.directionCase === "SAME_DIRECTION") steps = [`शुरुआती अंतर ${gap} km है।`, `A तेज है, इसलिए अंतर ${diff} km/h से बढ़ता है।`, `${t} मिनट की सापेक्ष दूरी को शुरुआती अंतर में जोड़ें।`, `अंतिम अंतर ${localizedAnswer} है।`];
      else steps = [`शुरुआती दूरी ${gap} km है।`, `एक-दूसरे की ओर होने से अंतर ${sum} km/h से घटता है।`, `${t} मिनट में बंद हुई दूरी को ${gap} km से घटाएँ।`, `बाकी दूरी ${localizedAnswer} है।`];
      shortcut = "अंतर बढ़े तो जोड़ें, घटे तो घटाएँ।"; break;
    case "TIME_TO_SPECIFIED_SEPARATION": {
      const change = s.directionCase === "OPPOSITE_TOWARD" ? n(subtract(s.initialGapKm, s.targetSeparationKm)) : n(subtract(s.targetSeparationKm, s.initialGapKm));
      const rel = s.directionCase === "SAME_DIRECTION" ? diff : sum;
      steps = [`अंतर को कुल ${change} km बदलना है; केवल यही दूरी उपयोग करें।`, `सापेक्ष गति ${rel} km/h है।`, `समय = ${change} ÷ ${rel} घंटा।`, `मिनट में यह ${localizedAnswer} है।`];
      shortcut = "अंतिम दूरी नहीं, अंतर में आवश्यक बदलाव ÷ सापेक्ष गति।"; break;
    }
    case "MEETING_POINT_DISTANCE_SPLIT":
      steps = [`दोनों का मिलने तक का समय समान है।`, `इसलिए तय की गई दूरियों का अनुपात उनकी गतियों ${a}:${b} के बराबर है।`, `${route} km को इसी अनुपात में बाँटें।`, `A के सिरे से मिलने की दूरी ${localizedAnswer} है।`];
      shortcut = "एक समान समय → दूरी का अनुपात = गति का अनुपात।"; break;
    case "SPEED_RATIO_FROM_MEETING_POINT": {
      const other = n(subtract(s.routeLengthKm, s.meetingFromAKm));
      steps = [`A ने मिलने तक ${point} km तय किए।`, `B ने बाकी ${route} - ${point} = ${other} km तय किए।`, `समय समान है, इसलिए गति अनुपात = दूरी अनुपात।`, `अतः A:B = ${localizedAnswer}.`];
      shortcut = "एक ही meeting time में speed ratio = travelled-distance ratio।"; break;
    }
    case "MEETING_POINT_FROM_SPEED_RATIO":
      steps = [`गति अनुपात ${s.ratioA}:${s.ratioB} है, इसलिए कुल ${s.ratioA + s.ratioB} अनुपात भाग हैं।`, `पहले पिंड की दूरी ${s.ratioA} भाग होगी।`, `${route} km को इस अनुपात में बाँटने पर पहले सिरे से दूरी ${localizedAnswer} मिलती है।`];
      shortcut = "मार्ग को सीधे गति अनुपात में बाँटें।"; break;
    case "REQUIRED_SPEED_FOR_MEETING_DEADLINE": {
      const closing = n(divide(s.initialGapKm, hours(s.deadlineMinutes)));
      steps = [`उपलब्ध समय ${deadline} मिनट = ${n(hours(s.deadlineMinutes))} घंटा है।`, `समय सीमा तक ${gap} km का अंतर मिटाने के लिए आवश्यक closing speed ${closing} km/h है।`, s.directionCase === "OPPOSITE_TOWARD" ? `एक-दूसरे की ओर होने से A की गति + ${b} = ${closing}.` : `एक दिशा में पकड़ने के लिए A की गति − ${b} = ${closing}.`, `अतः आवश्यक गति ${localizedAnswer} है।`];
      shortcut = "पहले deadline की required closing speed, फिर अज्ञात गति अलग करें।"; break;
    }
    case "MULTI_PURSUER_MEETING_ORDER": {
      const timeA = n(multiply(divide(s.initialGapKm, subtract(s.speedAKmph, s.speedBKmph)), rational(60)));
      const timeC = n(multiply(divide(s.extraGapCKm, subtract(s.speedCKmph, s.speedBKmph)), rational(60)));
      steps = [`A के लिए पकड़ समय = उसकी बढ़त ÷ (${a} - ${b}) = ${timeA} मिनट।`, `C के लिए पकड़ समय = उसकी बढ़त ÷ (${c} - ${b}) = ${timeC} मिनट।`, `सिर्फ गति नहीं, दोनों पकड़ समयों की तुलना करें।`, `निष्कर्ष: ${localizedAnswer}.`];
      shortcut = "हर pursuer का catch time अलग निकालें; सबसे छोटा सकारात्मक समय पहले पकड़ता है।"; break;
    }
  }
  return Object.freeze({ method, steps: Object.freeze(steps), shortcut, answer: `उत्तर: ${localizedAnswer}` });
}

function paExplanation(q: TsdCp004Question, localizedAnswer: string): TsdCp004Explanation {
  const s = q.state;
  const a = n(s.speedAKmph), b = n(s.speedBKmph), c = n(s.speedCKmph);
  const sum = n(add(s.speedAKmph, s.speedBKmph));
  const diff = n(absRational(subtract(s.speedAKmph, s.speedBKmph)));
  const gap = n(s.initialGapKm), t = n(s.elapsedMinutes), delay = n(s.startDelayMinutes);
  const route = n(s.routeLengthKm), point = n(s.meetingFromAKm), deadline = n(s.deadlineMinutes);
  let method = "ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਨਾਲ ਦੋਵੇਂ ਚਾਲਾਂ ਨੂੰ ਇੱਕੋ ਫ਼ਾਸਲੇ ਉੱਤੇ ਲਾਗੂ ਕਰੋ।";
  let steps: string[];
  let shortcut = "ਪਹਿਲਾਂ ਵੇਖੋ ਕਿ ਫ਼ਾਸਲਾ ਘਟ ਰਿਹਾ ਹੈ ਜਾਂ ਵੱਧ ਰਿਹਾ ਹੈ; ਫਿਰ ਸਹੀ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਵਰਤੋ।";
  switch (s.authorityId) {
    case "RELATIVE_SPEED_OPPOSITE":
      method = "ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਣ ਵੇਲੇ ਦੋਵੇਂ ਰਫ਼ਤਾਰਾਂ ਜੋੜੋ।";
      steps = [`ਇੱਕ ਘੰਟੇ ਵਿੱਚ ਪਹਿਲਾ ਪਿੰਡ ${a} km ਅਤੇ ਦੂਜਾ ${b} km ਇੱਕ-ਦੂਜੇ ਵੱਲ ਵਧਦਾ ਹੈ।`, `ਇਸ ਲਈ ਉਹਨਾਂ ਵਿਚਲਾ ਫ਼ਾਸਲਾ ${a} + ${b} = ${sum} km ਪ੍ਰਤੀ ਘੰਟਾ ਘਟਦਾ ਹੈ।`, `ਸਾਪੇਖ ਰਫ਼ਤਾਰ ${localizedAnswer} ਹੈ।`];
      shortcut = "ਇੱਕ-ਦੂਜੇ ਵੱਲ → ਰਫ਼ਤਾਰਾਂ ਜੋੜੋ।"; break;
    case "RELATIVE_SPEED_SAME_DIRECTION":
      method = "ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਤੇਜ਼ ਰਫ਼ਤਾਰ ਵਿੱਚੋਂ ਹੌਲੀ ਰਫ਼ਤਾਰ ਘਟਾਓ।";
      steps = [`ਤੇਜ਼ ਰਫ਼ਤਾਰ ${a} km/h ਅਤੇ ਹੌਲੀ ਰਫ਼ਤਾਰ ${b} km/h ਹੈ।`, `ਇੱਕ ਘੰਟੇ ਵਿੱਚ ਤੇਜ਼ ਪਿੰਡ ${a} - ${b} = ${diff} km ਦੀ ਬੜ੍ਹਤ ਲੈਂਦਾ ਹੈ।`, `ਪਕੜਨ ਦੀ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ${localizedAnswer} ਹੈ।`];
      shortcut = "ਇੱਕੋ ਦਿਸ਼ਾ → ਤੇਜ਼ − ਹੌਲੀ।"; break;
    case "FIRST_MEETING_TIME": {
      const rel = s.directionCase === "OPPOSITE_TOWARD" ? sum : diff;
      steps = [`ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲਾ ${gap} km ਹੈ।`, `ਇਸ ਹਾਲਤ ਵਿੱਚ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ${rel} km/h ਹੈ।`, `ਸਮਾਂ = ਦੂਰੀ ÷ ਸਾਪੇਖ ਰਫ਼ਤਾਰ = ${gap} ÷ ${rel} ਘੰਟਾ।`, `ਮਿੰਟਾਂ ਵਿੱਚ ${localizedAnswer} ਮਿਲਦਾ ਹੈ।`];
      shortcut = "ਪਹਿਲੀ ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ = ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲਾ ÷ positive closing speed।"; break;
    }
    case "INITIAL_GAP_FROM_MEETING": {
      const rel = s.directionCase === "OPPOSITE_TOWARD" ? sum : diff;
      steps = [`ਮਿਲਣ ਦਾ ਸਮਾਂ ${t} ਮਿੰਟ = ${n(hours(s.elapsedMinutes))} ਘੰਟਾ ਹੈ।`, `ਸਾਪੇਖ ਰਫ਼ਤਾਰ ${rel} km/h ਹੈ।`, `ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲਾ = ${rel} × ${n(hours(s.elapsedMinutes))} = ${localizedAnswer}.`];
      shortcut = "ਸਮਾਂ ਦਿੱਤਾ ਹੋਵੇ ਤਾਂ ਫ਼ਾਸਲਾ = ਸਾਪੇਖ ਰਫ਼ਤਾਰ × ਸਮਾਂ।"; break;
    }
    case "UNKNOWN_SPEED_FROM_MEETING": {
      const closing = n(divide(s.initialGapKm, hours(s.elapsedMinutes)));
      steps = [`${gap} km ਦਾ ਫ਼ਾਸਲਾ ${t} ਮਿੰਟ ਵਿੱਚ ਮੁੱਕਦਾ ਹੈ, ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ${closing} km/h ਹੈ।`, s.directionCase === "OPPOSITE_TOWARD" ? `ਇੱਕ-ਦੂਜੇ ਵੱਲ ਹੋਣ ਕਰਕੇ ਅਣਜਾਣ ਰਫ਼ਤਾਰ + ${b} = ${closing}.` : `ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਪਕੜ ਲਈ ਅਣਜਾਣ ਤੇਜ਼ ਰਫ਼ਤਾਰ − ${b} = ${closing}.`, `ਸਮੀਕਰਨ ਹੱਲ ਕਰਨ ਉੱਤੇ ਅਣਜਾਣ ਰਫ਼ਤਾਰ ${localizedAnswer} ਹੈ।`];
      shortcut = "ਪਹਿਲਾਂ closing speed ਕੱਢੋ, ਫਿਰ ਦਿਸ਼ਾ ਅਨੁਸਾਰ ਜਾਣੀ ਰਫ਼ਤਾਰ ਜੋੜੋ ਜਾਂ ਘਟਾਓ।"; break;
    }
    case "HEAD_START_CATCH_UP_TIME":
      steps = [`ਪਹਿਲਾਂ ਮਿਲੀ ਬੜ੍ਹਤ ${gap} km ਹੈ।`, `ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ closing speed = ${a} - ${b} = ${diff} km/h।`, `ਪਕੜ ਸਮਾਂ = ${gap} ÷ ${diff} ਘੰਟਾ।`, `ਮਿੰਟਾਂ ਵਿੱਚ ਜਵਾਬ ${localizedAnswer} ਹੈ।`];
      shortcut = "distance lead ÷ speed difference।"; break;
    case "HEAD_START_DISTANCE":
      steps = [`closing speed = ${a} - ${b} = ${diff} km/h।`, `ਪਕੜਨ ਦਾ ਸਮਾਂ ${t} ਮਿੰਟ = ${n(hours(s.elapsedMinutes))} ਘੰਟਾ ਹੈ।`, `ਸ਼ੁਰੂਆਤੀ ਬੜ੍ਹਤ = ${diff} × ${n(hours(s.elapsedMinutes))} = ${localizedAnswer}.`];
      shortcut = "ਬੜ੍ਹਤ = ਰਫ਼ਤਾਰ ਦਾ ਅੰਤਰ × ਪਕੜ ਸਮਾਂ।"; break;
    case "DELAYED_START_CATCH_UP_TIME": {
      const lead = n(distance(s.speedBKmph, s.startDelayMinutes));
      steps = [`${delay} ਮਿੰਟ ਪਹਿਲਾਂ ਚੱਲ ਕੇ B ${b} × ${n(hours(s.startDelayMinutes))} = ${lead} km ਦੀ ਬੜ੍ਹਤ ਬਣਾਉਂਦਾ ਹੈ।`, `A ਦੇ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਬਾਅਦ closing speed = ${a} - ${b} = ${diff} km/h।`, `ਪਿੱਛਾ ਸਮਾਂ = ${lead} ÷ ${diff} ਘੰਟਾ।`, `ਮਿੰਟਾਂ ਵਿੱਚ ਇਹ ${localizedAnswer} ਹੈ।`];
      shortcut = "ਦੇਰੀ ਨੂੰ ਪਹਿਲਾਂ ਦੂਰੀ ਦੀ ਬੜ੍ਹਤ ਵਿੱਚ ਬਦਲੋ।"; break;
    }
    case "START_DELAY_FROM_CATCH_UP": {
      const gain = n(distance(absRational(subtract(s.speedAKmph, s.speedBKmph)), s.elapsedMinutes));
      steps = [`${t} ਮਿੰਟ ਦੇ ਪਿੱਛੇ ਵਿੱਚ A, B ਉੱਤੇ ${diff} × ${n(hours(s.elapsedMinutes))} = ${gain} km ਦੀ ਬੜ੍ਹਤ ਬਣਾਉਂਦਾ ਹੈ।`, `ਇਹੀ ${gain} km ਦੀ ਬੜ੍ਹਤ B ਨੇ ਪਹਿਲਾਂ ਚੱਲ ਕੇ ਬਣਾਈ ਸੀ।`, `${gain} km ਨੂੰ B ਦੀ ${b} km/h ਰਫ਼ਤਾਰ ਨਾਲ ਭਾਗ ਦਿਓ।`, `ਸ਼ੁਰੂਆਤੀ ਦੇਰੀ ${localizedAnswer} ਹੈ।`];
      shortcut = "ਪਿੱਛੇ ਵਿੱਚ ਮਿਟਾਈ ਬੜ੍ਹਤ = ਪਹਿਲਾਂ ਬਣੀ ਬੜ੍ਹਤ।"; break;
    }
    case "SEPARATION_AFTER_TIME":
      if (s.directionCase === "OPPOSITE_AWAY") steps = [`ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ${gap} km ਹੈ।`, `ਦੂਰ ਜਾਣ ਵੇਲੇ ਫ਼ਾਸਲਾ ${sum} km/h ਨਾਲ ਵੱਧਦਾ ਹੈ।`, `${t} ਮਿੰਟ ਵਿੱਚ ਵਧੀ ਦੂਰੀ ਨੂੰ ${gap} km ਵਿੱਚ ਜੋੜੋ।`, `ਨਵੀਂ ਦੂਰੀ ${localizedAnswer} ਹੈ।`];
      else if (s.directionCase === "SAME_DIRECTION") steps = [`ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲਾ ${gap} km ਹੈ।`, `A ਤੇਜ਼ ਹੈ, ਇਸ ਲਈ ਫ਼ਾਸਲਾ ${diff} km/h ਨਾਲ ਵੱਧਦਾ ਹੈ।`, `${t} ਮਿੰਟ ਦੀ ਸਾਪੇਖ ਦੂਰੀ ਨੂੰ ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲੇ ਵਿੱਚ ਜੋੜੋ।`, `ਅੰਤਿਮ ਫ਼ਾਸਲਾ ${localizedAnswer} ਹੈ।`];
      else steps = [`ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ${gap} km ਹੈ।`, `ਇੱਕ-ਦੂਜੇ ਵੱਲ ਹੋਣ ਕਰਕੇ ਫ਼ਾਸਲਾ ${sum} km/h ਨਾਲ ਘਟਦਾ ਹੈ।`, `${t} ਮਿੰਟ ਵਿੱਚ ਬੰਦ ਹੋਈ ਦੂਰੀ ਨੂੰ ${gap} km ਵਿੱਚੋਂ ਘਟਾਓ।`, `ਬਾਕੀ ਦੂਰੀ ${localizedAnswer} ਹੈ।`];
      shortcut = "ਫ਼ਾਸਲਾ ਵਧੇ ਤਾਂ ਜੋੜੋ, ਘਟੇ ਤਾਂ ਘਟਾਓ।"; break;
    case "TIME_TO_SPECIFIED_SEPARATION": {
      const change = s.directionCase === "OPPOSITE_TOWARD" ? n(subtract(s.initialGapKm, s.targetSeparationKm)) : n(subtract(s.targetSeparationKm, s.initialGapKm));
      const rel = s.directionCase === "SAME_DIRECTION" ? diff : sum;
      steps = [`ਫ਼ਾਸਲੇ ਨੂੰ ਕੁੱਲ ${change} km ਬਦਲਣਾ ਹੈ; ਕੇਵਲ ਇਹੀ ਦੂਰੀ ਵਰਤੋ।`, `ਸਾਪੇਖ ਰਫ਼ਤਾਰ ${rel} km/h ਹੈ।`, `ਸਮਾਂ = ${change} ÷ ${rel} ਘੰਟਾ।`, `ਮਿੰਟਾਂ ਵਿੱਚ ਇਹ ${localizedAnswer} ਹੈ।`];
      shortcut = "ਅੰਤਿਮ ਦੂਰੀ ਨਹੀਂ, ਫ਼ਾਸਲੇ ਵਿੱਚ ਲੋੜੀਂਦਾ ਬਦਲਾਅ ÷ ਸਾਪੇਖ ਰਫ਼ਤਾਰ।"; break;
    }
    case "MEETING_POINT_DISTANCE_SPLIT":
      steps = [`ਦੋਵੇਂ ਦਾ ਮਿਲਣ ਤੱਕ ਦਾ ਸਮਾਂ ਇੱਕੋ ਹੈ।`, `ਇਸ ਲਈ ਤੈਅ ਦੂਰੀਆਂ ਦਾ ਅਨੁਪਾਤ ਉਹਨਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${a}:${b} ਦੇ ਬਰਾਬਰ ਹੈ।`, `${route} km ਨੂੰ ਇਸੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ।`, `A ਦੇ ਸਿਰੇ ਤੋਂ ਮਿਲਣ ਦੀ ਦੂਰੀ ${localizedAnswer} ਹੈ।`];
      shortcut = "ਇੱਕੋ ਸਮਾਂ → ਦੂਰੀ ਅਨੁਪਾਤ = ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ।"; break;
    case "SPEED_RATIO_FROM_MEETING_POINT": {
      const other = n(subtract(s.routeLengthKm, s.meetingFromAKm));
      steps = [`A ਮਿਲਣ ਤੱਕ ${point} km ਤੈਅ ਕਰਦਾ ਹੈ।`, `B ਬਾਕੀ ${route} - ${point} = ${other} km ਤੈਅ ਕਰਦਾ ਹੈ।`, `ਸਮਾਂ ਇੱਕੋ ਹੈ, ਇਸ ਲਈ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ = ਦੂਰੀ ਅਨੁਪਾਤ।`, `ਇਸ ਲਈ A:B = ${localizedAnswer}.`];
      shortcut = "ਇੱਕੋ meeting time ਵਿੱਚ speed ratio = travelled-distance ratio।"; break;
    }
    case "MEETING_POINT_FROM_SPEED_RATIO":
      steps = [`ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ${s.ratioA}:${s.ratioB} ਹੈ, ਇਸ ਲਈ ਕੁੱਲ ${s.ratioA + s.ratioB} ਅਨੁਪਾਤ ਭਾਗ ਹਨ।`, `ਪਹਿਲੇ ਪਿੰਡ ਦੀ ਦੂਰੀ ${s.ratioA} ਭਾਗ ਹੋਵੇਗੀ।`, `${route} km ਨੂੰ ਇਸ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਣ ਉੱਤੇ ਪਹਿਲੇ ਸਿਰੇ ਤੋਂ ਦੂਰੀ ${localizedAnswer} ਹੈ।`];
      shortcut = "ਰਸਤੇ ਨੂੰ ਸਿੱਧਾ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ।"; break;
    case "REQUIRED_SPEED_FOR_MEETING_DEADLINE": {
      const closing = n(divide(s.initialGapKm, hours(s.deadlineMinutes)));
      steps = [`ਉਪਲਬਧ ਸਮਾਂ ${deadline} ਮਿੰਟ = ${n(hours(s.deadlineMinutes))} ਘੰਟਾ ਹੈ।`, `ਸਮਾਂ ਸੀਮਾ ਤੱਕ ${gap} km ਦਾ ਫ਼ਾਸਲਾ ਮਿਟਾਉਣ ਲਈ ਲੋੜੀਂਦੀ closing speed ${closing} km/h ਹੈ।`, s.directionCase === "OPPOSITE_TOWARD" ? `ਇੱਕ-ਦੂਜੇ ਵੱਲ ਹੋਣ ਕਰਕੇ A ਦੀ ਰਫ਼ਤਾਰ + ${b} = ${closing}.` : `ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਪਕੜ ਲਈ A ਦੀ ਰਫ਼ਤਾਰ − ${b} = ${closing}.`, `ਲੋੜੀਂਦੀ ਰਫ਼ਤਾਰ ${localizedAnswer} ਹੈ।`];
      shortcut = "ਪਹਿਲਾਂ deadline ਲਈ required closing speed, ਫਿਰ ਅਣਜਾਣ ਰਫ਼ਤਾਰ ਵੱਖ ਕਰੋ।"; break;
    }
    case "MULTI_PURSUER_MEETING_ORDER": {
      const timeA = n(multiply(divide(s.initialGapKm, subtract(s.speedAKmph, s.speedBKmph)), rational(60)));
      const timeC = n(multiply(divide(s.extraGapCKm, subtract(s.speedCKmph, s.speedBKmph)), rational(60)));
      steps = [`A ਲਈ ਪਕੜ ਸਮਾਂ = ਉਸਦੀ ਬੜ੍ਹਤ ÷ (${a} - ${b}) = ${timeA} ਮਿੰਟ।`, `C ਲਈ ਪਕੜ ਸਮਾਂ = ਉਸਦੀ ਬੜ੍ਹਤ ÷ (${c} - ${b}) = ${timeC} ਮਿੰਟ।`, `ਸਿਰਫ਼ ਰਫ਼ਤਾਰਾਂ ਨਹੀਂ, ਦੋਵੇਂ ਪਕੜ ਸਮਿਆਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।`, `ਨਤੀਜਾ: ${localizedAnswer}.`];
      shortcut = "ਹਰ pursuer ਦਾ catch time ਵੱਖ ਕੱਢੋ; ਸਭ ਤੋਂ ਛੋਟਾ positive ਸਮਾਂ ਪਹਿਲਾਂ ਪਕੜਦਾ ਹੈ।"; break;
    }
  }
  return Object.freeze({ method, steps: Object.freeze(steps), shortcut, answer: `ਉੱਤਰ: ${localizedAnswer}` });
}

export interface TsdCp004FinalNativeQuestion extends Omit<TsdCp004Question, "language" | "stem" | "visual" | "options" | "explanation"> {
  readonly language: TsdCp004NativeLanguage;
  readonly stem: string;
  readonly visual: TsdCp004Visual | null;
  readonly options: readonly string[];
  readonly localizedAnswerText: string;
  readonly explanation: TsdCp004Explanation;
}

export function renderCp004FinalNativeQuestion(english: TsdCp004Question, language: TsdCp004NativeLanguage): TsdCp004FinalNativeQuestion {
  const localizedOptions = Object.freeze(english.options.map((x) => answerText(x, language)));
  const localizedAnswerText = answerText(english.solution.answerText, language);
  if (localizedOptions[english.correctIndex] !== localizedAnswerText) throw new Error("CP004 final native correct option parity failed");
  const explanation = language === "hi" ? hiExplanation(english, localizedAnswerText) : paExplanation(english, localizedAnswerText);
  return Object.freeze({
    ...english,
    language,
    stem: renderCp004NativeStem(english.state, language),
    visual: localizeVisual(english.visual, language),
    options: localizedOptions,
    localizedAnswerText,
    explanation,
  });
}

export function generateCp004FinalNativeQuestion(authorityId: TsdCp004AuthorityId, seed: string, language: TsdCp004NativeLanguage): TsdCp004FinalNativeQuestion {
  return renderCp004FinalNativeQuestion(generateCp004FinalEnglishQuestion(authorityId, seed), language);
}

export function generateCp004FinalMultilingualReviewCorpus(): readonly (TsdCp004Question | TsdCp004FinalNativeQuestion)[] {
  const English = generateCp004FinalEnglishReviewCorpus();
  const rows: (TsdCp004Question | TsdCp004FinalNativeQuestion)[] = [];
  for (const q of English) rows.push(q, renderCp004FinalNativeQuestion(q, "hi"), renderCp004FinalNativeQuestion(q, "pa"));
  return Object.freeze(rows);
}

export function cp004FinalExpectedNativeNoun(q: TsdCp004Question, language: TsdCp004NativeLanguage): string {
  return cp004ExpectedNativeNoun(q.state, language);
}
