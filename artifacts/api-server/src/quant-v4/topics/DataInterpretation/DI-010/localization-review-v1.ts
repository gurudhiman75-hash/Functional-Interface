import { generateDi010PermanentQuestion } from "./permanent-question-generator";
import type { Di010Class, Di010ExamProfile, Di010Question, Di010Stimulus, Di010TaskKind } from "./types";

export type Di010LocalizationLocale = "hi-IN" | "pa-IN";

export const DI010_LOCALIZATION_REVIEW_ID = "DI-010-HI-PA-REVIEW-V1" as const;

type LocalizedContext = Readonly<{
  hi: Readonly<{ title: string; xAxisLabel: string; yAxisLabel: string; unit: string; description: string }>;
  pa: Readonly<{ title: string; xAxisLabel: string; yAxisLabel: string; unit: string; description: string }>;
}>;

const CONTEXTS: Readonly<Record<string, LocalizedContext>> = Object.freeze({
  "Marks of students": {
    hi: {
      title: "एक परीक्षा में विद्यार्थियों के अंक",
      xAxisLabel: "अंक",
      yAxisLabel: "विद्यार्थियों की संख्या",
      unit: "विद्यार्थी",
      description: "वर्ग-चिह्न बिंदुओं को उनकी आवृत्तियों के अनुसार सीधी रेखाओं से जोड़कर बनाया गया आवृत्ति बहुभुज।",
    },
    pa: {
      title: "ਇੱਕ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਅੰਕ",
      xAxisLabel: "ਅੰਕ",
      yAxisLabel: "ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਵਿਦਿਆਰਥੀ",
      description: "ਵਰਗ-ਚਿੰਨ੍ਹ ਬਿੰਦੂਆਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਅਨੁਸਾਰ ਸਿੱਧੀਆਂ ਰੇਖਾਵਾਂ ਨਾਲ ਜੋੜ ਕੇ ਬਣਾਇਆ ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ।",
    },
  },
  "Travel time of employees": {
    hi: {
      title: "कर्मचारियों का यात्रा समय",
      xAxisLabel: "यात्रा समय (मिनट)",
      yAxisLabel: "कर्मचारियों की संख्या",
      unit: "कर्मचारी",
      description: "कर्मचारियों के यात्रा समय का आवृत्ति बहुभुज।",
    },
    pa: {
      title: "ਕਰਮਚਾਰੀਆਂ ਦਾ ਯਾਤਰਾ ਸਮਾਂ",
      xAxisLabel: "ਯਾਤਰਾ ਸਮਾਂ (ਮਿੰਟ)",
      yAxisLabel: "ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਕਰਮਚਾਰੀ",
      description: "ਕਰਮਚਾਰੀਆਂ ਦੇ ਯਾਤਰਾ ਸਮੇਂ ਦਾ ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ।",
    },
  },
  "Weights in a fitness survey": {
    hi: {
      title: "फिटनेस सर्वे में व्यक्तियों का वजन",
      xAxisLabel: "वजन (किलोग्राम)",
      yAxisLabel: "व्यक्तियों की संख्या",
      unit: "व्यक्ति",
      description: "फिटनेस सर्वे में दर्ज वजन का आवृत्ति बहुभुज।",
    },
    pa: {
      title: "ਫਿਟਨੈੱਸ ਸਰਵੇਖਣ ਵਿੱਚ ਵਿਅਕਤੀਆਂ ਦਾ ਭਾਰ",
      xAxisLabel: "ਭਾਰ (ਕਿਲੋਗ੍ਰਾਮ)",
      yAxisLabel: "ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਵਿਅਕਤੀ",
      description: "ਫਿਟਨੈੱਸ ਸਰਵੇਖਣ ਵਿੱਚ ਦਰਜ ਭਾਰ ਦਾ ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ।",
    },
  },
  "Heights in a sports group": {
    hi: {
      title: "खेल समूह के खिलाड़ियों की ऊँचाई",
      xAxisLabel: "ऊँचाई (सेमी)",
      yAxisLabel: "खिलाड़ियों की संख्या",
      unit: "खिलाड़ी",
      description: "खेल समूह के खिलाड़ियों की ऊँचाई का आवृत्ति बहुभुज।",
    },
    pa: {
      title: "ਖੇਡ ਸਮੂਹ ਦੇ ਖਿਡਾਰੀਆਂ ਦੀ ਲੰਬਾਈ",
      xAxisLabel: "ਲੰਬਾਈ (ਸੈਮੀ)",
      yAxisLabel: "ਖਿਡਾਰੀਆਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਖਿਡਾਰੀ",
      description: "ਖੇਡ ਸਮੂਹ ਦੇ ਖਿਡਾਰੀਆਂ ਦੀ ਲੰਬਾਈ ਦਾ ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ।",
    },
  },
  "Daily wages of workers": {
    hi: {
      title: "कामगारों की दैनिक मजदूरी",
      xAxisLabel: "दैनिक मजदूरी (₹)",
      yAxisLabel: "कामगारों की संख्या",
      unit: "कामगार",
      description: "कामगारों की दैनिक मजदूरी का आवृत्ति बहुभुज।",
    },
    pa: {
      title: "ਮਜ਼ਦੂਰਾਂ ਦੀ ਰੋਜ਼ਾਨਾ ਮਜ਼ਦੂਰੀ",
      xAxisLabel: "ਰੋਜ਼ਾਨਾ ਮਜ਼ਦੂਰੀ (₹)",
      yAxisLabel: "ਮਜ਼ਦੂਰਾਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਮਜ਼ਦੂਰ",
      description: "ਮਜ਼ਦੂਰਾਂ ਦੀ ਰੋਜ਼ਾਨਾ ਮਜ਼ਦੂਰੀ ਦਾ ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ।",
    },
  },
  "Ages of workers": {
    hi: {
      title: "कामगारों की आयु",
      xAxisLabel: "आयु (वर्ष)",
      yAxisLabel: "कामगारों की संख्या",
      unit: "कामगार",
      description: "कामगारों की आयु का आवृत्ति बहुभुज।",
    },
    pa: {
      title: "ਮਜ਼ਦੂਰਾਂ ਦੀ ਉਮਰ",
      xAxisLabel: "ਉਮਰ (ਸਾਲ)",
      yAxisLabel: "ਮਜ਼ਦੂਰਾਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਮਜ਼ਦੂਰ",
      description: "ਮਜ਼ਦੂਰਾਂ ਦੀ ਉਮਰ ਦਾ ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ।",
    },
  },
});

function isHindi(locale: Di010LocalizationLocale) {
  return locale === "hi-IN";
}

function interval(item: Di010Class) {
  return `${item.lower}–${item.upper}`;
}

function rangeLabel(classes: readonly Di010Class[], start: number, end: number) {
  return `${classes[start]!.lower}–${classes[end]!.upper}`;
}

function totalFrequency(classes: readonly Di010Class[]) {
  return classes.reduce((sum, item) => sum + item.frequency, 0);
}

function cumulativeFrequencies(classes: readonly Di010Class[]) {
  let running = 0;
  return classes.map((item) => (running += item.frequency));
}

function contextFor(stimulus: Di010Stimulus, locale: Di010LocalizationLocale) {
  const context = CONTEXTS[stimulus.title];
  if (!context) throw new Error(`DI-010 localization is missing context '${stimulus.title}'.`);
  return isHindi(locale) ? context.hi : context.pa;
}

export function localizeDi010Stimulus(stimulus: Di010Stimulus, locale: Di010LocalizationLocale) {
  const context = contextFor(stimulus, locale);
  return {
    ...stimulus,
    title: context.title,
    instruction: isHindi(locale)
      ? "आवृत्ति बहुभुज का अध्ययन कीजिए और दिए गए प्रश्नों के उत्तर दीजिए।"
      : "ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ ਦਾ ਅਧਿਐਨ ਕਰੋ ਅਤੇ ਦਿੱਤੇ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਦਿਓ।",
    xAxisLabel: context.xAxisLabel,
    yAxisLabel: context.yAxisLabel,
    unit: context.unit,
    description: context.description,
  };
}

const CONSTRUCTION_OPTIONS = Object.freeze({
  "Class marks (midpoints)": {
    hi: "वर्ग-चिह्न (मध्य मान)",
    pa: "ਵਰਗ-ਚਿੰਨ੍ਹ (ਮੱਧ-ਬਿੰਦੂ)",
  },
  "Lower class limits": {
    hi: "निम्न वर्ग सीमाएँ",
    pa: "ਹੇਠਲੀਆਂ ਵਰਗ ਸੀਮਾਵਾਂ",
  },
  "Upper class limits": {
    hi: "उच्च वर्ग सीमाएँ",
    pa: "ਉੱਪਰਲੀਆਂ ਵਰਗ ਸੀਮਾਵਾਂ",
  },
  "Cumulative frequencies": {
    hi: "संचयी आवृत्तियाँ",
    pa: "ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾਵਾਂ",
  },
} as const);

function localizeOptions(question: Di010Question, locale: Di010LocalizationLocale) {
  if (question.kind === "CONSTRUCTION_PROPERTY") {
    return question.options.map((option) => {
      const mapped = CONSTRUCTION_OPTIONS[option as keyof typeof CONSTRUCTION_OPTIONS];
      if (!mapped) throw new Error(`DI-010 localization is missing construction option '${option}'.`);
      return isHindi(locale) ? mapped.hi : mapped.pa;
    });
  }
  if (question.kind === "ZERO_CLOSING_ENDPOINTS") {
    const connector = isHindi(locale) ? " और " : " ਅਤੇ ";
    return question.options.map((option) => option.replace(" and ", connector));
  }
  return [...question.options];
}

function localizedStem(question: Di010Question, stimulus: Di010Stimulus, locale: Di010LocalizationLocale) {
  const classes = stimulus.classes;
  const evidence = question.evidence;
  const variant = Number(evidence.surfaceId ?? 0);
  const unit = contextFor(stimulus, locale).unit;
  const hi = isHindi(locale);

  switch (question.kind) {
    case "CONSTRUCTION_PROPERTY": {
      const h = [
        "आवृत्ति बहुभुज में मुख्य बिंदुओं के क्षैतिज निर्देशांक क्या दर्शाते हैं?",
        "आवृत्ति बहुभुज के बिंदु क्षैतिज अक्ष पर किन मानों के ऊपर बनाए जाते हैं?",
        "आवृत्ति बहुभुज बनाते समय प्रत्येक वर्ग के लिए क्षैतिज अक्ष पर कौन-सा मान लिया जाता है?",
      ];
      const p = [
        "ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ ਵਿੱਚ ਮੁੱਖ ਬਿੰਦੂਆਂ ਦੇ ਖਿਤਿਜੀ ਨਿਰਦੇਸ਼ਾਂਕ ਕੀ ਦਰਸਾਉਂਦੇ ਹਨ?",
        "ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ ਦੇ ਬਿੰਦੂ ਖਿਤਿਜੀ ਧੁਰਾ ਉੱਤੇ ਕਿਹੜੇ ਮੁੱਲਾਂ ਦੇ ਉੱਪਰ ਬਣਾਏ ਜਾਂਦੇ ਹਨ?",
        "ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ ਬਣਾਉਂਦੇ ਸਮੇਂ ਹਰ ਵਰਗ ਲਈ ਖਿਤਿਜੀ ਧੁਰਾ ਉੱਤੇ ਕਿਹੜਾ ਮੁੱਲ ਲਿਆ ਜਾਂਦਾ ਹੈ?",
      ];
      return (hi ? h : p)[variant]!;
    }
    case "READ_CLASS_FREQUENCY_CONTEXT": {
      const target = classes[Number(evidence.targetIndex)]!;
      const value = interval(target);
      const h = [
        `वर्ग अंतराल ${value} में कितने ${unit} हैं?`,
        `आवृत्ति बहुभुज के अनुसार, वर्ग ${value} की आवृत्ति कितनी है?`,
        `वर्ग ${value} के लिए दर्शाई गई संख्या कितनी है?`,
      ];
      const p = [
        `ਵਰਗ ਅੰਤਰਾਲ ${value} ਵਿੱਚ ਕਿੰਨੇ ${unit} ਹਨ?`,
        `ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ ਅਨੁਸਾਰ, ਵਰਗ ${value} ਦੀ ਬਾਰੰਬਾਰਤਾ ਕਿੰਨੀ ਹੈ?`,
        `ਵਰਗ ${value} ਲਈ ਦਰਸਾਈ ਗਈ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`,
      ];
      return (hi ? h : p)[variant]!;
    }
    case "MODAL_CLASS_FROM_POLYGON": {
      const h = [
        "सबसे अधिक आवृत्ति वाला वर्ग अंतराल कौन-सा है?",
        "आवृत्ति बहुभुज का सबसे ऊँचा बिंदु किस वर्ग अंतराल को दर्शाता है?",
        "ग्राफ से बहुलक वर्ग पहचानिए।",
      ];
      const p = [
        "ਸਭ ਤੋਂ ਵੱਧ ਬਾਰੰਬਾਰਤਾ ਵਾਲਾ ਵਰਗ ਅੰਤਰਾਲ ਕਿਹੜਾ ਹੈ?",
        "ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ ਦਾ ਸਭ ਤੋਂ ਉੱਚਾ ਬਿੰਦੂ ਕਿਹੜਾ ਵਰਗ ਅੰਤਰਾਲ ਦਰਸਾਉਂਦਾ ਹੈ?",
        "ਗ੍ਰਾਫ ਤੋਂ ਬਹੁਲਕ ਵਰਗ ਪਛਾਣੋ।",
      ];
      return (hi ? h : p)[variant]!;
    }
    case "CLASS_INTERVAL_FROM_MARK": {
      const target = classes[Number(evidence.targetIndex)]!;
      const mark = target.classMark;
      const h = [
        `वर्ग-चिह्न ${mark} किस वर्ग अंतराल से संबंधित है?`,
        `जिस वर्ग का मध्य मान ${mark} है, उसका वर्ग अंतराल कौन-सा है?`,
        `बहुभुज में ${mark} पर बना बिंदु किस वर्ग को दर्शाता है?`,
      ];
      const p = [
        `ਵਰਗ-ਚਿੰਨ੍ਹ ${mark} ਕਿਹੜੇ ਵਰਗ ਅੰਤਰਾਲ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`,
        `ਜਿਸ ਵਰਗ ਦਾ ਮੱਧ ਮੁੱਲ ${mark} ਹੈ, ਉਸ ਦਾ ਵਰਗ ਅੰਤਰਾਲ ਕਿਹੜਾ ਹੈ?`,
        `ਬਹੁਭੁਜ ਵਿੱਚ ${mark} ਉੱਤੇ ਬਣਿਆ ਬਿੰਦੂ ਕਿਹੜਾ ਵਰਗ ਦਰਸਾਉਂਦਾ ਹੈ?`,
      ];
      return (hi ? h : p)[variant]!;
    }
    case "TOTAL_FREQUENCY_FROM_POLYGON": {
      const h = [
        "ग्राफ में दर्शाई गई कुल आवृत्ति कितनी है?",
        `आवृत्ति बहुभुज में कुल कितने ${unit} दर्शाए गए हैं?`,
        "सभी वर्गों की आवृत्तियों का योग कितना है?",
      ];
      const p = [
        "ਗ੍ਰਾਫ ਵਿੱਚ ਦਰਸਾਈ ਗਈ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਕਿੰਨੀ ਹੈ?",
        `ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ${unit} ਦਰਸਾਏ ਗਏ ਹਨ?`,
        "ਸਾਰੇ ਵਰਗਾਂ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਦਾ ਜੋੜ ਕਿੰਨਾ ਹੈ?",
      ];
      return (hi ? h : p)[variant]!;
    }
    case "CONSECUTIVE_RANGE_TOTAL_CONTEXT": {
      const start = Number(evidence.startIndex), end = Number(evidence.endIndex);
      const range = rangeLabel(classes, start, end);
      const h = [
        `अंतराल ${range} में कुल कितने ${unit} हैं?`,
        `वर्गों ${range} की संयुक्त आवृत्ति कितनी है?`,
        `${range} के भीतर आने वाले वर्गों की कुल आवृत्ति ज्ञात कीजिए।`,
      ];
      const p = [
        `ਅੰਤਰਾਲ ${range} ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ${unit} ਹਨ?`,
        `ਵਰਗਾਂ ${range} ਦੀ ਮਿਲੀ-ਜੁਲੀ ਬਾਰੰਬਾਰਤਾ ਕਿੰਨੀ ਹੈ?`,
        `${range} ਦੇ ਅੰਦਰ ਆਉਣ ਵਾਲੇ ਵਰਗਾਂ ਦੀ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਕੱਢੋ।`,
      ];
      return (hi ? h : p)[variant]!;
    }
    case "FREQUENCY_DIFFERENCE_CONTEXT": {
      const high = classes[Number(evidence.highIndex)]!;
      const low = classes[Number(evidence.lowIndex)]!;
      const h = [
        `वर्ग ${interval(high)} की आवृत्ति, वर्ग ${interval(low)} से कितनी अधिक है?`,
        `वर्ग ${interval(high)} और ${interval(low)} की आवृत्तियों का अंतर कितना है?`,
        `इन दोनों वर्गों की आवृत्तियों का अंतर ज्ञात कीजिए: ${interval(high)} और ${interval(low)}।`,
      ];
      const p = [
        `ਵਰਗ ${interval(high)} ਦੀ ਬਾਰੰਬਾਰਤਾ, ਵਰਗ ${interval(low)} ਨਾਲੋਂ ਕਿੰਨੀ ਵੱਧ ਹੈ?`,
        `ਵਰਗ ${interval(high)} ਅਤੇ ${interval(low)} ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਦਾ ਅੰਤਰ ਕਿੰਨਾ ਹੈ?`,
        `ਇਨ੍ਹਾਂ ਦੋਵੇਂ ਵਰਗਾਂ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ: ${interval(high)} ਅਤੇ ${interval(low)}।`,
      ];
      return (hi ? h : p)[variant]!;
    }
    case "CLASS_SHARE_OF_TOTAL": {
      const target = classes[Number(evidence.targetIndex)]!;
      const value = interval(target);
      const h = [
        `निकटतम पूर्ण प्रतिशत में, वर्ग ${value} कुल आवृत्ति का कितने प्रतिशत है?`,
        `कुल प्रेक्षणों में लगभग कितने पूर्ण प्रतिशत वर्ग ${value} में आते हैं?`,
        `वर्ग ${value} की प्रतिशत हिस्सेदारी निकटतम पूर्ण प्रतिशत में ज्ञात कीजिए।`,
      ];
      const p = [
        `ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ, ਵਰਗ ${value} ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਦਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`,
        `ਕੁੱਲ ਪ੍ਰੇਖਣਾਂ ਵਿੱਚ ਲਗਭਗ ਕਿੰਨੇ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਰਗ ${value} ਵਿੱਚ ਆਉਂਦੇ ਹਨ?`,
        `ਵਰਗ ${value} ਦੀ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸੇਦਾਰੀ ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਕੱਢੋ।`,
      ];
      return (hi ? h : p)[variant]!;
    }
    case "HISTOGRAM_BAR_HEIGHT_FROM_POLYGON": {
      const target = classes[Number(evidence.targetIndex)]!;
      const value = interval(target);
      const h = [
        `इसी वितरण का हिस्टोग्राम बनाने पर वर्ग ${value} के स्तंभ की ऊँचाई कितनी होगी?`,
        `यदि यही आँकड़े हिस्टोग्राम में दिखाए जाएँ, तो वर्ग ${value} की आवृत्ति क्या होगी?`,
        `वर्ग ${value} के लिए संबंधित हिस्टोग्राम स्तंभ की ऊँचाई ज्ञात कीजिए।`,
      ];
      const p = [
        `ਇਸੇ ਵੰਡ ਦਾ ਹਿਸਟੋਗ੍ਰਾਮ ਬਣਾਉਣ ਤੇ ਵਰਗ ${value} ਦੇ ਸਤੰਭ ਦੀ ਉਚਾਈ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
        `ਜੇ ਇਹੀ ਅੰਕੜੇ ਹਿਸਟੋਗ੍ਰਾਮ ਵਿੱਚ ਦਿਖਾਏ ਜਾਣ, ਤਾਂ ਵਰਗ ${value} ਦੀ ਬਾਰੰਬਾਰਤਾ ਕੀ ਹੋਵੇਗੀ?`,
        `ਵਰਗ ${value} ਲਈ ਸੰਬੰਧਿਤ ਹਿਸਟੋਗ੍ਰਾਮ ਸਤੰਭ ਦੀ ਉਚਾਈ ਕੱਢੋ।`,
      ];
      return (hi ? h : p)[variant]!;
    }
    case "ZERO_CLOSING_ENDPOINTS": {
      const h = [
        "आवृत्ति बहुभुज को दोनों सिरों पर बंद करने के लिए कौन-से दो शून्य-आवृत्ति बिंदु जोड़े जाएँगे?",
        "दोनों ओर समान चौड़ाई का एक-एक काल्पनिक वर्ग जोड़ने पर बहुभुज के बंद करने वाले बिंदु कौन-से होंगे?",
        "इस आवृत्ति बहुभुज को पूरा करने के लिए क्षैतिज अक्ष पर कौन-से दो बिंदु चाहिए?",
      ];
      const p = [
        "ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ ਨੂੰ ਦੋਵੇਂ ਸਿਰਿਆਂ ਤੇ ਬੰਦ ਕਰਨ ਲਈ ਕਿਹੜੇ ਦੋ ਸਿਫ਼ਰ-ਬਾਰੰਬਾਰਤਾ ਬਿੰਦੂ ਜੋੜੇ ਜਾਣਗੇ?",
        "ਦੋਵੇਂ ਪਾਸੇ ਬਰਾਬਰ ਚੌੜਾਈ ਦਾ ਇੱਕ-ਇੱਕ ਕਲਪਿਤ ਵਰਗ ਜੋੜਨ ਤੇ ਬਹੁਭੁਜ ਨੂੰ ਬੰਦ ਕਰਨ ਵਾਲੇ ਬਿੰਦੂ ਕਿਹੜੇ ਹੋਣਗੇ?",
        "ਇਸ ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ ਨੂੰ ਪੂਰਾ ਕਰਨ ਲਈ ਖਿਤਿਜੀ ਧੁਰਾ ਉੱਤੇ ਕਿਹੜੇ ਦੋ ਬਿੰਦੂ ਚਾਹੀਦੇ ਹਨ?",
      ];
      return (hi ? h : p)[variant]!;
    }
    case "RANGE_RATIO_FROM_POLYGON": {
      const leftStart = Number(evidence.leftStart), rightStart = Number(evidence.rightStart);
      const leftRange = rangeLabel(classes, leftStart, leftStart + 1);
      const rightRange = rangeLabel(classes, rightStart, rightStart + 1);
      const h = [
        `अंतराल ${leftRange} और ${rightRange} की कुल आवृत्तियों का अनुपात क्या है?`,
        `${leftRange} की संयुक्त आवृत्ति का ${rightRange} की संयुक्त आवृत्ति से अनुपात ज्ञात कीजिए।`,
        `दोनों अंतरालों ${leftRange} और ${rightRange} के आवृत्ति योगों का सरल अनुपात क्या है?`,
      ];
      const p = [
        `ਅੰਤਰਾਲ ${leftRange} ਅਤੇ ${rightRange} ਦੀਆਂ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾਵਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
        `${leftRange} ਦੀ ਮਿਲੀ-ਜੁਲੀ ਬਾਰੰਬਾਰਤਾ ਦਾ ${rightRange} ਦੀ ਮਿਲੀ-ਜੁਲੀ ਬਾਰੰਬਾਰਤਾ ਨਾਲ ਅਨੁਪਾਤ ਕੱਢੋ।`,
        `ਦੋਵੇਂ ਅੰਤਰਾਲਾਂ ${leftRange} ਅਤੇ ${rightRange} ਦੇ ਬਾਰੰਬਾਰਤਾ ਜੋੜਾਂ ਦਾ ਸਰਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
      ];
      return (hi ? h : p)[variant]!;
    }
    case "GROUPED_MEAN_FROM_POLYGON": {
      const h = [
        "वर्ग-चिह्न मानों का उपयोग करके वितरण का अनुमानित औसत निकटतम पूर्ण संख्या में ज्ञात कीजिए।",
        "आवृत्ति बहुभुज से समूहित आँकड़ों का अनुमानित औसत निकटतम पूर्ण संख्या में कितना है?",
        "प्रत्येक वर्ग-चिह्न को उस वर्ग की आवृत्ति के साथ उपयोग करके औसत ज्ञात कीजिए और निकटतम पूर्ण संख्या दीजिए।",
      ];
      const p = [
        "ਵਰਗ-ਚਿੰਨ੍ਹ ਮੁੱਲਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਵੰਡ ਦਾ ਅਨੁਮਾਨਿਤ ਮੱਧਮਾਨ ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ ਵਿੱਚ ਕੱਢੋ।",
        "ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ ਤੋਂ ਸਮੂਹਿਤ ਅੰਕੜਿਆਂ ਦਾ ਅਨੁਮਾਨਿਤ ਮੱਧਮਾਨ ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ ਵਿੱਚ ਕਿੰਨਾ ਹੈ?",
        "ਹਰੇਕ ਵਰਗ-ਚਿੰਨ੍ਹ ਨੂੰ ਉਸ ਵਰਗ ਦੀ ਬਾਰੰਬਾਰਤਾ ਨਾਲ ਵਰਤ ਕੇ ਮੱਧਮਾਨ ਕੱਢੋ ਅਤੇ ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ ਦਿਓ।",
      ];
      return (hi ? h : p)[variant]!;
    }
    case "MEDIAN_CLASS_FROM_POLYGON": {
      const h = [
        "वितरण का माध्यिका वर्ग कौन-सा है?",
        "संचयी आवृत्तियाँ बनाने पर माध्यिका प्रेक्षण किस वर्ग अंतराल में आता है?",
        "आवृत्ति बहुभुज से माध्यिका वर्ग पहचानिए।",
      ];
      const p = [
        "ਵੰਡ ਦਾ ਮੱਧਿਕਾ ਵਰਗ ਕਿਹੜਾ ਹੈ?",
        "ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾਵਾਂ ਬਣਾਉਣ ਤੇ ਮੱਧਿਕਾ ਪ੍ਰੇਖਣ ਕਿਹੜੇ ਵਰਗ ਅੰਤਰਾਲ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?",
        "ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ ਤੋਂ ਮੱਧਿਕਾ ਵਰਗ ਪਛਾਣੋ।",
      ];
      return (hi ? h : p)[variant]!;
    }
  }
}

function localizedExplanation(question: Di010Question, stimulus: Di010Stimulus, locale: Di010LocalizationLocale) {
  const classes = stimulus.classes;
  const evidence = question.evidence;
  const hi = isHindi(locale);
  const total = totalFrequency(classes);
  const pack = (keyHi: string, keyPa: string, stepsHi: string[], stepsPa: string[], workingTable?: { headers: string[]; rows: string[][] }) => ({
    keyIdea: hi ? keyHi : keyPa,
    steps: hi ? stepsHi : stepsPa,
    ...(workingTable ? { workingTable } : {}),
  });

  switch (question.kind) {
    case "CONSTRUCTION_PROPERTY":
      return pack(
        "आवृत्ति बहुभुज में प्रत्येक वर्ग की आवृत्ति उसके वर्ग-चिह्न पर दर्शाई जाती है।",
        "ਬਾਰੰਬਾਰਤਾ ਬਹੁਭੁਜ ਵਿੱਚ ਹਰ ਵਰਗ ਦੀ ਬਾਰੰਬਾਰਤਾ ਉਸ ਦੇ ਵਰਗ-ਚਿੰਨ੍ਹ ਉੱਤੇ ਦਰਸਾਈ ਜਾਂਦੀ ਹੈ।",
        ["प्रत्येक वर्ग का मध्य मान निकालें।", "उस मध्य मान पर संबंधित आवृत्ति का बिंदु लगाएँ।", "बिंदुओं को सीधी रेखाओं से जोड़ें।"],
        ["ਹਰੇਕ ਵਰਗ ਦਾ ਮੱਧ ਮੁੱਲ ਕੱਢੋ।", "ਉਸ ਮੱਧ ਮੁੱਲ ਉੱਤੇ ਸੰਬੰਧਿਤ ਬਾਰੰਬਾਰਤਾ ਦਾ ਬਿੰਦੂ ਲਗਾਓ।", "ਬਿੰਦੂਆਂ ਨੂੰ ਸਿੱਧੀਆਂ ਰੇਖਾਵਾਂ ਨਾਲ ਜੋੜੋ।"],
      );
    case "READ_CLASS_FREQUENCY_CONTEXT": {
      const target = classes[Number(evidence.targetIndex)]!;
      return pack(
        "दिए गए वर्ग के वर्ग-चिह्न पर बने बिंदु की ऊँचाई उसकी आवृत्ति बताती है।",
        "ਦਿੱਤੇ ਵਰਗ ਦੇ ਵਰਗ-ਚਿੰਨ੍ਹ ਉੱਤੇ ਬਣੇ ਬਿੰਦੂ ਦੀ ਉਚਾਈ ਉਸ ਦੀ ਬਾਰੰਬਾਰਤਾ ਦੱਸਦੀ ਹੈ।",
        [`वर्ग ${interval(target)} का बिंदु देखें।`, `इसकी आवृत्ति ${target.frequency} है।`],
        [`ਵਰਗ ${interval(target)} ਦਾ ਬਿੰਦੂ ਵੇਖੋ।`, `ਇਸ ਦੀ ਬਾਰੰਬਾਰਤਾ ${target.frequency} ਹੈ।`],
      );
    }
    case "MODAL_CLASS_FROM_POLYGON": {
      const index = Number(evidence.targetIndex);
      const target = classes[index]!;
      return pack(
        "सबसे अधिक आवृत्ति वाला वर्ग बहुलक वर्ग होता है।",
        "ਸਭ ਤੋਂ ਵੱਧ ਬਾਰੰਬਾਰਤਾ ਵਾਲਾ ਵਰਗ ਬਹੁਲਕ ਵਰਗ ਹੁੰਦਾ ਹੈ।",
        [`सबसे ऊँचा बिंदु आवृत्ति ${target.frequency} दर्शाता है।`, `इसका वर्ग अंतराल ${interval(target)} है।`],
        [`ਸਭ ਤੋਂ ਉੱਚਾ ਬਿੰਦੂ ਬਾਰੰਬਾਰਤਾ ${target.frequency} ਦਰਸਾਉਂਦਾ ਹੈ।`, `ਇਸ ਦਾ ਵਰਗ ਅੰਤਰਾਲ ${interval(target)} ਹੈ।`],
      );
    }
    case "CLASS_INTERVAL_FROM_MARK": {
      const index = Number(evidence.targetIndex);
      const target = classes[index]!;
      const half = stimulus.classWidth / 2;
      return pack(
        "वर्ग-चिह्न से आधी वर्ग-चौड़ाई घटाने और जोड़ने पर वर्ग की सीमाएँ मिलती हैं।",
        "ਵਰਗ-ਚਿੰਨ੍ਹ ਵਿੱਚੋਂ ਅੱਧੀ ਵਰਗ-ਚੌੜਾਈ ਘਟਾ ਕੇ ਅਤੇ ਜੋੜ ਕੇ ਵਰਗ ਦੀਆਂ ਸੀਮਾਵਾਂ ਮਿਲਦੀਆਂ ਹਨ।",
        [`वर्ग-चौड़ाई = ${stimulus.classWidth}, इसलिए आधी चौड़ाई = ${half}।`, `${target.classMark} − ${half} = ${target.lower} और ${target.classMark} + ${half} = ${target.upper}।`, `अतः वर्ग ${interval(target)} है।`],
        [`ਵਰਗ-ਚੌੜਾਈ = ${stimulus.classWidth}, ਇਸ ਲਈ ਅੱਧੀ ਚੌੜਾਈ = ${half}।`, `${target.classMark} − ${half} = ${target.lower} ਅਤੇ ${target.classMark} + ${half} = ${target.upper}।`, `ਇਸ ਲਈ ਵਰਗ ${interval(target)} ਹੈ।`],
      );
    }
    case "TOTAL_FREQUENCY_FROM_POLYGON":
      return pack(
        "कुल आवृत्ति के लिए सभी वर्गों की आवृत्तियाँ जोड़ें।",
        "ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਲਈ ਸਾਰੇ ਵਰਗਾਂ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਜੋੜੋ।",
        [`कुल = ${classes.map((item) => item.frequency).join(" + ")} = ${total}।`],
        [`ਕੁੱਲ = ${classes.map((item) => item.frequency).join(" + ")} = ${total}।`],
      );
    case "CONSECUTIVE_RANGE_TOTAL_CONTEXT": {
      const start = Number(evidence.startIndex), end = Number(evidence.endIndex);
      const chosen = classes.slice(start, end + 1);
      const sum = chosen.reduce((value, item) => value + item.frequency, 0);
      return pack(
        "दिए गए अंतराल में आने वाले सभी लगातार वर्गों की आवृत्तियाँ जोड़ें।",
        "ਦਿੱਤੇ ਅੰਤਰਾਲ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਸਾਰੇ ਲਗਾਤਾਰ ਵਰਗਾਂ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਜੋੜੋ।",
        [`आवृत्तियाँ = ${chosen.map((item) => item.frequency).join(" + ")} = ${sum}।`],
        [`ਬਾਰੰਬਾਰਤਾਵਾਂ = ${chosen.map((item) => item.frequency).join(" + ")} = ${sum}।`],
      );
    }
    case "FREQUENCY_DIFFERENCE_CONTEXT": {
      const high = classes[Number(evidence.highIndex)]!, low = classes[Number(evidence.lowIndex)]!;
      return pack(
        "दोनों वर्गों की आवृत्तियाँ पढ़ें और छोटी आवृत्ति को बड़ी से घटाएँ।",
        "ਦੋਵੇਂ ਵਰਗਾਂ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਪੜ੍ਹੋ ਅਤੇ ਛੋਟੀ ਬਾਰੰਬਾਰਤਾ ਨੂੰ ਵੱਡੀ ਵਿੱਚੋਂ ਘਟਾਓ।",
        [`आवृत्तियाँ = ${high.frequency} और ${low.frequency}।`, `अंतर = ${high.frequency} − ${low.frequency} = ${question.answer}।`],
        [`ਬਾਰੰਬਾਰਤਾਵਾਂ = ${high.frequency} ਅਤੇ ${low.frequency}।`, `ਅੰਤਰ = ${high.frequency} − ${low.frequency} = ${question.answer}।`],
      );
    }
    case "CLASS_SHARE_OF_TOTAL": {
      const target = classes[Number(evidence.targetIndex)]!;
      return pack(
        "वर्ग की आवृत्ति को कुल आवृत्ति से भाग देकर 100 से गुणा करें और निकटतम पूर्ण प्रतिशत लें।",
        "ਵਰਗ ਦੀ ਬਾਰੰਬਾਰਤਾ ਨੂੰ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਨਾਲ ਭਾਗ ਦੇ ਕੇ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ ਅਤੇ ਨਜ਼ਦੀਕੀ ਪੂਰਾ ਪ੍ਰਤੀਸ਼ਤ ਲਓ।",
        [`कुल आवृत्ति = ${total}।`, `प्रतिशत = ${target.frequency}/${total} × 100 ≈ ${question.answer}।`],
        [`ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ = ${total}।`, `ਪ੍ਰਤੀਸ਼ਤ = ${target.frequency}/${total} × 100 ≈ ${question.answer}।`],
      );
    }
    case "HISTOGRAM_BAR_HEIGHT_FROM_POLYGON": {
      const target = classes[Number(evidence.targetIndex)]!;
      return pack(
        "समान वर्ग-चौड़ाई वाले हिस्टोग्राम में स्तंभ की ऊँचाई उसी वर्ग की आवृत्ति होती है।",
        "ਬਰਾਬਰ ਵਰਗ-ਚੌੜਾਈ ਵਾਲੇ ਹਿਸਟੋਗ੍ਰਾਮ ਵਿੱਚ ਸਤੰਭ ਦੀ ਉਚਾਈ ਉਸੇ ਵਰਗ ਦੀ ਬਾਰੰਬਾਰਤਾ ਹੁੰਦੀ ਹੈ।",
        [`वर्ग ${interval(target)} की आवृत्ति ${target.frequency} है।`, `अतः हिस्टोग्राम स्तंभ की ऊँचाई ${target.frequency} होगी।`],
        [`ਵਰਗ ${interval(target)} ਦੀ ਬਾਰੰਬਾਰਤਾ ${target.frequency} ਹੈ।`, `ਇਸ ਲਈ ਹਿਸਟੋਗ੍ਰਾਮ ਸਤੰਭ ਦੀ ਉਚਾਈ ${target.frequency} ਹੋਵੇਗੀ।`],
      );
    }
    case "ZERO_CLOSING_ENDPOINTS": {
      const left = Number(evidence.leftEndpoint), right = Number(evidence.rightEndpoint);
      const first = classes[0]!, last = classes[classes.length - 1]!;
      return pack(
        "बहुभुज को बंद करने के लिए पहले और अंतिम वर्ग-चिह्न से एक वर्ग-चौड़ाई बाहर शून्य आवृत्ति के बिंदु लें।",
        "ਬਹੁਭੁਜ ਨੂੰ ਬੰਦ ਕਰਨ ਲਈ ਪਹਿਲੇ ਅਤੇ ਆਖਰੀ ਵਰਗ-ਚਿੰਨ੍ਹ ਤੋਂ ਇੱਕ ਵਰਗ-ਚੌੜਾਈ ਬਾਹਰ ਸਿਫ਼ਰ ਬਾਰੰਬਾਰਤਾ ਦੇ ਬਿੰਦੂ ਲਓ।",
        [`बाईं ओर: ${first.classMark} − ${stimulus.classWidth} = ${left}।`, `दाईं ओर: ${last.classMark} + ${stimulus.classWidth} = ${right}।`, `बिंदु = (${left}, 0) और (${right}, 0)।`],
        [`ਖੱਬੇ ਪਾਸੇ: ${first.classMark} − ${stimulus.classWidth} = ${left}।`, `ਸੱਜੇ ਪਾਸੇ: ${last.classMark} + ${stimulus.classWidth} = ${right}।`, `ਬਿੰਦੂ = (${left}, 0) ਅਤੇ (${right}, 0)।`],
      );
    }
    case "RANGE_RATIO_FROM_POLYGON": {
      const leftStart = Number(evidence.leftStart), rightStart = Number(evidence.rightStart);
      const left = Number(evidence.leftTotal), right = Number(evidence.rightTotal);
      return pack(
        "दोनों अंतरालों की आवृत्तियाँ अलग-अलग जोड़ें और उसी क्रम में अनुपात सरल करें।",
        "ਦੋਵੇਂ ਅੰਤਰਾਲਾਂ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਵੱਖ-ਵੱਖ ਜੋੜੋ ਅਤੇ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।",
        [`${rangeLabel(classes, leftStart, leftStart + 1)} की कुल आवृत्ति = ${left}।`, `${rangeLabel(classes, rightStart, rightStart + 1)} की कुल आवृत्ति = ${right}।`, `अनुपात = ${left}:${right} = ${question.answer}।`],
        [`${rangeLabel(classes, leftStart, leftStart + 1)} ਦੀ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ = ${left}।`, `${rangeLabel(classes, rightStart, rightStart + 1)} ਦੀ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ = ${right}।`, `ਅਨੁਪਾਤ = ${left}:${right} = ${question.answer}।`],
      );
    }
    case "GROUPED_MEAN_FROM_POLYGON": {
      const weighted = Number(evidence.weighted);
      const headers = hi
        ? ["वर्ग", "वर्ग-चिह्न", "आवृत्ति", "आवृत्ति × वर्ग-चिह्न"]
        : ["ਵਰਗ", "ਵਰਗ-ਚਿੰਨ੍ਹ", "ਬਾਰੰਬਾਰਤਾ", "ਬਾਰੰਬਾਰਤਾ × ਵਰਗ-ਚਿੰਨ੍ਹ"];
      const rows = classes.map((item) => [interval(item), String(item.classMark), String(item.frequency), String(item.classMark * item.frequency)]);
      return pack(
        "प्रत्येक वर्ग-चिह्न को उसकी आवृत्ति से गुणा करें। इन गुणनफलों के योग को कुल आवृत्ति से भाग देकर निकटतम पूर्ण संख्या लें।",
        "ਹਰੇਕ ਵਰਗ-ਚਿੰਨ੍ਹ ਨੂੰ ਉਸ ਦੀ ਬਾਰੰਬਾਰਤਾ ਨਾਲ ਗੁਣਾ ਕਰੋ। ਇਨ੍ਹਾਂ ਗੁਣਨਫਲਾਂ ਦੇ ਜੋੜ ਨੂੰ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ ਲਓ।",
        [`कुल आवृत्ति = ${total}।`, `आवृत्ति × वर्ग-चिह्न का योग = ${weighted}।`, `औसत = ${weighted}/${total} ≈ ${question.answer}।`],
        [`ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ = ${total}।`, `ਬਾਰੰਬਾਰਤਾ × ਵਰਗ-ਚਿੰਨ੍ਹ ਦਾ ਜੋੜ = ${weighted}।`, `ਮੱਧਮਾਨ = ${weighted}/${total} ≈ ${question.answer}।`],
        { headers, rows },
      );
    }
    case "MEDIAN_CLASS_FROM_POLYGON": {
      const cumulative = cumulativeFrequencies(classes);
      const index = Number(evidence.targetIndex);
      const observationPosition = Math.ceil(total / 2);
      const headers = hi ? ["वर्ग", "आवृत्ति", "संचयी आवृत्ति"] : ["ਵਰਗ", "ਬਾਰੰਬਾਰਤਾ", "ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾ"];
      const rows = classes.map((item, rowIndex) => [interval(item), String(item.frequency), String(cumulative[rowIndex])]);
      return pack(
        "संचयी आवृत्तियाँ बनाकर वह पहला वर्ग खोजें जहाँ माध्यिका प्रेक्षण आता है।",
        "ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾਵਾਂ ਬਣਾ ਕੇ ਉਹ ਪਹਿਲਾ ਵਰਗ ਲੱਭੋ ਜਿੱਥੇ ਮੱਧਿਕਾ ਪ੍ਰੇਖਣ ਆਉਂਦਾ ਹੈ।",
        [`कुल आवृत्ति = ${total}; देखने वाला प्रेक्षण क्रमांक = ${observationPosition}।`, `पहली उपयुक्त संचयी आवृत्ति ${cumulative[index]} है।`, `अतः माध्यिका वर्ग ${interval(classes[index]!)} है।`],
        [`ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ = ${total}; ਵੇਖਣ ਵਾਲਾ ਪ੍ਰੇਖਣ ਨੰਬਰ = ${observationPosition}।`, `ਪਹਿਲੀ ਉਚਿਤ ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾ ${cumulative[index]} ਹੈ।`, `ਇਸ ਲਈ ਮੱਧਿਕਾ ਵਰਗ ${interval(classes[index]!)} ਹੈ।`],
        { headers, rows },
      );
    }
  }
}

export function localizeDi010Question(source: ReturnType<typeof generateDi010PermanentQuestion>, locale: Di010LocalizationLocale) {
  const localizedOptions = localizeOptions(source.question, locale);
  const answer = localizedOptions[source.question.correctIndex]!;
  return {
    packageId: "DI-010" as const,
    seed: source.seed,
    examProfile: source.examProfile,
    language: locale === "hi-IN" ? "hi" as const : "pa" as const,
    locale,
    localizationReviewId: DI010_LOCALIZATION_REVIEW_ID,
    localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const,
    sourceEnglishStatus: "ENGLISH_REVIEW_APPROVED" as const,
    stimulus: localizeDi010Stimulus(source.stimulus, locale),
    question: {
      ...source.question,
      stem: localizedStem(source.question, source.stimulus, locale),
      options: localizedOptions,
      answer,
      explanation: localizedExplanation(source.question, source.stimulus, locale),
    },
    traceability: {
      ...source.traceability,
      reviewStatus: "MULTILINGUAL_REVIEW_CANDIDATE" as const,
      localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
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

export function generateDi010LocalizedReviewQuestion(input: {
  seed: string;
  examProfile: Di010ExamProfile;
  taskKind: Di010TaskKind;
  locale: Di010LocalizationLocale;
}) {
  return localizeDi010Question(
    generateDi010PermanentQuestion({ seed: input.seed, examProfile: input.examProfile, taskKind: input.taskKind }),
    input.locale,
  );
}
