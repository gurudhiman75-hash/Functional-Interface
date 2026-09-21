import { generateDi009PermanentQuestion } from "./permanent-question-generator";
import type {
  Di009ExamProfile,
  Di009HistogramBin,
  Di009Question,
  Di009Stimulus,
  Di009TaskKind,
} from "./types";

export type Di009LocalizationLocale = "hi-IN" | "pa-IN";

export const DI009_LOCALIZATION_REVIEW_ID = "DI-009-HI-PA-REVIEW-V1" as const;
export const DI009_LOCALIZATION_RELEASE_ID = "DI-009-HI-PA-FROZEN-V1" as const;

type LocalizedContext = Readonly<{
  hi: Readonly<{ title: string; xAxisLabel: string; yAxisLabel: string; unit: string; description: string }>;
  pa: Readonly<{ title: string; xAxisLabel: string; yAxisLabel: string; unit: string; description: string }>;
}>;

const CONTEXTS: Readonly<Record<string, LocalizedContext>> = Object.freeze({
  "Marks obtained by students in a test": {
    hi: {
      title: "एक परीक्षा में विद्यार्थियों द्वारा प्राप्त अंक",
      xAxisLabel: "अंक",
      yAxisLabel: "विद्यार्थियों की संख्या",
      unit: "विद्यार्थी",
      description: "समान वर्ग-चौड़ाई वाला हिस्टोग्राम, जिसमें स्तंभ की ऊँचाई आवृत्ति दर्शाती है।",
    },
    pa: {
      title: "ਇੱਕ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਵਿਦਿਆਰਥੀਆਂ ਵੱਲੋਂ ਪ੍ਰਾਪਤ ਅੰਕ",
      xAxisLabel: "ਅੰਕ",
      yAxisLabel: "ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਵਿਦਿਆਰਥੀ",
      description: "ਬਰਾਬਰ ਵਰਗ-ਚੌੜਾਈ ਵਾਲਾ ਹਿਸਟੋਗ੍ਰਾਮ, ਜਿਸ ਵਿੱਚ ਸਤੰਭ ਦੀ ਉਚਾਈ ਬਾਰੰਬਾਰਤਾ ਦਿਖਾਉਂਦੀ ਹੈ।",
    },
  },
  "Heights of students in a sports group": {
    hi: {
      title: "खेल समूह के विद्यार्थियों की ऊँचाई",
      xAxisLabel: "ऊँचाई (सेमी)",
      yAxisLabel: "विद्यार्थियों की संख्या",
      unit: "विद्यार्थी",
      description: "विद्यार्थियों की ऊँचाई का समान वर्ग-चौड़ाई वाला हिस्टोग्राम।",
    },
    pa: {
      title: "ਖੇਡ ਸਮੂਹ ਦੇ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਲੰਬਾਈ",
      xAxisLabel: "ਲੰਬਾਈ (ਸੈਮੀ)",
      yAxisLabel: "ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਵਿਦਿਆਰਥੀ",
      description: "ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਲੰਬਾਈ ਦਾ ਬਰਾਬਰ ਵਰਗ-ਚੌੜਾਈ ਵਾਲਾ ਹਿਸਟੋਗ੍ਰਾਮ।",
    },
  },
  "Weights of participants in a fitness survey": {
    hi: {
      title: "फिटनेस सर्वे में प्रतिभागियों का वजन",
      xAxisLabel: "वजन (किलोग्राम)",
      yAxisLabel: "प्रतिभागियों की संख्या",
      unit: "प्रतिभागी",
      description: "प्रतिभागियों के वजन का समान वर्ग-चौड़ाई वाला हिस्टोग्राम।",
    },
    pa: {
      title: "ਫਿਟਨੈੱਸ ਸਰਵੇਖਣ ਵਿੱਚ ਭਾਗੀਦਾਰਾਂ ਦਾ ਭਾਰ",
      xAxisLabel: "ਭਾਰ (ਕਿਲੋਗ੍ਰਾਮ)",
      yAxisLabel: "ਭਾਗੀਦਾਰਾਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਭਾਗੀਦਾਰ",
      description: "ਭਾਗੀਦਾਰਾਂ ਦੇ ਭਾਰ ਦਾ ਬਰਾਬਰ ਵਰਗ-ਚੌੜਾਈ ਵਾਲਾ ਹਿਸਟੋਗ੍ਰਾਮ।",
    },
  },
  "Daily travel time of employees": {
    hi: {
      title: "कर्मचारियों का दैनिक यात्रा समय",
      xAxisLabel: "यात्रा समय (मिनट)",
      yAxisLabel: "कर्मचारियों की संख्या",
      unit: "कर्मचारी",
      description: "कर्मचारियों के दैनिक यात्रा समय का समान वर्ग-चौड़ाई वाला हिस्टोग्राम।",
    },
    pa: {
      title: "ਕਰਮਚਾਰੀਆਂ ਦਾ ਰੋਜ਼ਾਨਾ ਯਾਤਰਾ ਸਮਾਂ",
      xAxisLabel: "ਯਾਤਰਾ ਸਮਾਂ (ਮਿੰਟ)",
      yAxisLabel: "ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਕਰਮਚਾਰੀ",
      description: "ਕਰਮਚਾਰੀਆਂ ਦੇ ਰੋਜ਼ਾਨਾ ਯਾਤਰਾ ਸਮੇਂ ਦਾ ਬਰਾਬਰ ਵਰਗ-ਚੌੜਾਈ ਵਾਲਾ ਹਿਸਟੋਗ੍ਰਾਮ।",
    },
  },
  "Ages of workers in a unit": {
    hi: {
      title: "एक इकाई में कामगारों की आयु",
      xAxisLabel: "आयु (वर्ष)",
      yAxisLabel: "कामगारों की संख्या",
      unit: "कामगार",
      description: "कामगारों की आयु का समान वर्ग-चौड़ाई वाला हिस्टोग्राम।",
    },
    pa: {
      title: "ਇੱਕ ਇਕਾਈ ਵਿੱਚ ਮਜ਼ਦੂਰਾਂ ਦੀ ਉਮਰ",
      xAxisLabel: "ਉਮਰ (ਸਾਲ)",
      yAxisLabel: "ਮਜ਼ਦੂਰਾਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਮਜ਼ਦੂਰ",
      description: "ਮਜ਼ਦੂਰਾਂ ਦੀ ਉਮਰ ਦਾ ਬਰਾਬਰ ਵਰਗ-ਚੌੜਾਈ ਵਾਲਾ ਹਿਸਟੋਗ੍ਰਾਮ।",
    },
  },
  "Daily wages of workers": {
    hi: {
      title: "कामगारों की दैनिक मजदूरी",
      xAxisLabel: "दैनिक मजदूरी (₹)",
      yAxisLabel: "कामगारों की संख्या",
      unit: "कामगार",
      description: "कामगारों की दैनिक मजदूरी का समान वर्ग-चौड़ाई वाला हिस्टोग्राम।",
    },
    pa: {
      title: "ਮਜ਼ਦੂਰਾਂ ਦੀ ਰੋਜ਼ਾਨਾ ਮਜ਼ਦੂਰੀ",
      xAxisLabel: "ਰੋਜ਼ਾਨਾ ਮਜ਼ਦੂਰੀ (₹)",
      yAxisLabel: "ਮਜ਼ਦੂਰਾਂ ਦੀ ਗਿਣਤੀ",
      unit: "ਮਜ਼ਦੂਰ",
      description: "ਮਜ਼ਦੂਰਾਂ ਦੀ ਰੋਜ਼ਾਨਾ ਮਜ਼ਦੂਰੀ ਦਾ ਬਰਾਬਰ ਵਰਗ-ਚੌੜਾਈ ਵਾਲਾ ਹਿਸਟੋਗ੍ਰਾਮ।",
    },
  },
});

function isHindi(locale: Di009LocalizationLocale) {
  return locale === "hi-IN";
}

function interval(bin: Di009HistogramBin) {
  return `${bin.lower}–${bin.upper}`;
}

function rangeLabel(bins: readonly Di009HistogramBin[], start: number, end: number) {
  return `${bins[start]!.lower}–${bins[end]!.upper}`;
}

function totalFrequency(bins: readonly Di009HistogramBin[]) {
  return bins.reduce((sum, bin) => sum + bin.frequency, 0);
}

function sumRange(bins: readonly Di009HistogramBin[], start: number, end: number) {
  let total = 0;
  for (let index = start; index <= end; index += 1) total += bins[index]!.frequency;
  return total;
}

function cumulativeFrequencies(bins: readonly Di009HistogramBin[]) {
  let running = 0;
  return bins.map((bin) => (running += bin.frequency));
}

function contextFor(stimulus: Di009Stimulus, locale: Di009LocalizationLocale) {
  const context = CONTEXTS[stimulus.title];
  if (!context) throw new Error(`DI-009 localization is missing context '${stimulus.title}'.`);
  return isHindi(locale) ? context.hi : context.pa;
}

export function localizeDi009Stimulus(stimulus: Di009Stimulus, locale: Di009LocalizationLocale) {
  const context = contextFor(stimulus, locale);
  return {
    ...stimulus,
    title: context.title,
    instruction: isHindi(locale)
      ? "हिस्टोग्राम का अध्ययन कीजिए और दिए गए प्रश्नों के उत्तर दीजिए।"
      : "ਹਿਸਟੋਗ੍ਰਾਮ ਦਾ ਅਧਿਐਨ ਕਰੋ ਅਤੇ ਦਿੱਤੇ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਦਿਓ।",
    xAxisLabel: context.xAxisLabel,
    yAxisLabel: context.yAxisLabel,
    unit: context.unit,
    description: context.description,
  };
}

function localizedStem(
  question: Di009Question,
  sourceStimulus: Di009Stimulus,
  locale: Di009LocalizationLocale,
) {
  const bins = sourceStimulus.bins;
  const evidence = question.evidence;
  const variant = Number(evidence.surfaceId ?? 0);
  const unit = contextFor(sourceStimulus, locale).unit;
  const hi = isHindi(locale);

  switch (question.kind) {
    case "DIRECT_CLASS_FREQUENCY": {
      const target = bins[Number(evidence.targetIndex)]!;
      const value = interval(target);
      const surfacesHi = [
        `वर्ग अंतराल ${value} में कितने ${unit} दर्शाए गए हैं?`,
        `वर्ग ${value} की आवृत्ति कितनी है?`,
        `हिस्टोग्राम के अनुसार, अंतराल ${value} में कितने ${unit} हैं?`,
        `हिस्टोग्राम से ${value} के अनुरूप आवृत्ति पढ़िए।`,
      ];
      const surfacesPa = [
        `ਵਰਗ ਅੰਤਰਾਲ ${value} ਵਿੱਚ ਕਿੰਨੇ ${unit} ਦਰਸਾਏ ਗਏ ਹਨ?`,
        `ਵਰਗ ${value} ਦੀ ਬਾਰੰਬਾਰਤਾ ਕਿੰਨੀ ਹੈ?`,
        `ਹਿਸਟੋਗ੍ਰਾਮ ਅਨੁਸਾਰ, ਅੰਤਰਾਲ ${value} ਵਿੱਚ ਕਿੰਨੇ ${unit} ਹਨ?`,
        `ਹਿਸਟੋਗ੍ਰਾਮ ਤੋਂ ${value} ਨਾਲ ਸੰਬੰਧਿਤ ਬਾਰੰਬਾਰਤਾ ਪੜ੍ਹੋ।`,
      ];
      return (hi ? surfacesHi : surfacesPa)[variant]!;
    }
    case "TOTAL_FREQUENCY": {
      const surfacesHi = [
        `हिस्टोग्राम में कुल कितने ${unit} दर्शाए गए हैं?`,
        "हिस्टोग्राम द्वारा दर्शाई गई कुल आवृत्ति ज्ञात कीजिए।",
        "सभी वर्ग अंतरालों की आवृत्तियों का योग कितना है?",
      ];
      const surfacesPa = [
        `ਹਿਸਟੋਗ੍ਰਾਮ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ${unit} ਦਰਸਾਏ ਗਏ ਹਨ?`,
        "ਹਿਸਟੋਗ੍ਰਾਮ ਦੁਆਰਾ ਦਰਸਾਈ ਗਈ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਕੱਢੋ।",
        "ਸਾਰੇ ਵਰਗ ਅੰਤਰਾਲਾਂ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਦਾ ਜੋੜ ਕਿੰਨਾ ਹੈ?",
      ];
      return (hi ? surfacesHi : surfacesPa)[variant]!;
    }
    case "COMBINED_RANGE_TOTAL": {
      const start = Number(evidence.startIndex), end = Number(evidence.endIndex);
      const range = rangeLabel(bins, start, end);
      const surfacesHi = [
        `परास ${range} में कुल कितने ${unit} हैं?`,
        `अंतराल ${range} की संयुक्त आवृत्ति ज्ञात कीजिए।`,
        `वर्गों ${bins[start]!.lower} से ${bins[end]!.upper} तक की कुल आवृत्ति कितनी है?`,
        `${range} को समेटने वाले वर्गों में कुल कितने ${unit} हैं?`,
      ];
      const surfacesPa = [
        `ਪਰਾਸ ${range} ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ${unit} ਹਨ?`,
        `ਅੰਤਰਾਲ ${range} ਦੀ ਮਿਲੀ-ਜੁਲੀ ਬਾਰੰਬਾਰਤਾ ਕੱਢੋ।`,
        `ਵਰਗਾਂ ${bins[start]!.lower} ਤੋਂ ${bins[end]!.upper} ਤੱਕ ਦੀ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਕਿੰਨੀ ਹੈ?`,
        `${range} ਨੂੰ ਸਮੇਟਣ ਵਾਲੇ ਵਰਗਾਂ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ${unit} ਹਨ?`,
      ];
      return (hi ? surfacesHi : surfacesPa)[variant]!;
    }
    case "ABOVE_BOUNDARY_TOTAL": {
      const boundary = Number(evidence.boundary);
      const surfacesHi = [
        `वर्ग सीमा ${boundary} से शुरू होने वाले और उससे ऊपर के वर्गों में कितने ${unit} हैं?`,
        `${boundary} से आगे की कुल आवृत्ति ज्ञात कीजिए।`,
        `हिस्टोग्राम के अनुसार, ${boundary} या उससे ऊपर के वर्ग अंतरालों में कितने ${unit} हैं?`,
      ];
      const surfacesPa = [
        `ਵਰਗ ਸੀਮਾ ${boundary} ਤੋਂ ਸ਼ੁਰੂ ਹੋਣ ਵਾਲੇ ਅਤੇ ਇਸ ਤੋਂ ਉੱਪਰ ਦੇ ਵਰਗਾਂ ਵਿੱਚ ਕਿੰਨੇ ${unit} ਹਨ?`,
        `${boundary} ਤੋਂ ਅੱਗੇ ਦੀ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਕੱਢੋ।`,
        `ਹਿਸਟੋਗ੍ਰਾਮ ਅਨੁਸਾਰ, ${boundary} ਜਾਂ ਇਸ ਤੋਂ ਉੱਪਰ ਦੇ ਵਰਗ ਅੰਤਰਾਲਾਂ ਵਿੱਚ ਕਿੰਨੇ ${unit} ਹਨ?`,
      ];
      return (hi ? surfacesHi : surfacesPa)[variant]!;
    }
    case "BELOW_BOUNDARY_TOTAL": {
      const boundary = Number(evidence.boundary);
      const surfacesHi = [
        `${boundary} से कम मान वाले वर्गों में कितने ${unit} दर्शाए गए हैं?`,
        `${boundary} से कम मानों की संचयी आवृत्ति ज्ञात कीजिए।`,
        `${boundary} से नीचे स्थित सभी वर्ग अंतरालों की कुल आवृत्ति कितनी है?`,
      ];
      const surfacesPa = [
        `${boundary} ਤੋਂ ਘੱਟ ਮੁੱਲ ਵਾਲੇ ਵਰਗਾਂ ਵਿੱਚ ਕਿੰਨੇ ${unit} ਦਰਸਾਏ ਗਏ ਹਨ?`,
        `${boundary} ਤੋਂ ਘੱਟ ਮੁੱਲਾਂ ਦੀ ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾ ਕੱਢੋ।`,
        `${boundary} ਤੋਂ ਹੇਠਾਂ ਵਾਲੇ ਸਾਰੇ ਵਰਗ ਅੰਤਰਾਲਾਂ ਦੀ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਕਿੰਨੀ ਹੈ?`,
      ];
      return (hi ? surfacesHi : surfacesPa)[variant]!;
    }
    case "RANGE_RATIO": {
      const leftStart = Number(evidence.leftStart), leftEnd = Number(evidence.leftEnd);
      const rightStart = Number(evidence.rightStart), rightEnd = Number(evidence.rightEnd);
      const leftRange = rangeLabel(bins, leftStart, leftEnd);
      const rightRange = rangeLabel(bins, rightStart, rightEnd);
      const firstCount = leftEnd - leftStart + 1;
      const surfacesHi = [
        `परास ${leftRange} की कुल आवृत्ति और परास ${rightRange} की कुल आवृत्ति का अनुपात क्या है?`,
        `पहले ${firstCount} वर्गों की कुल आवृत्ति का शेष वर्गों की कुल आवृत्ति से अनुपात ज्ञात कीजिए।`,
        `${leftRange} की संयुक्त आवृत्ति, ${rightRange} की संयुक्त आवृत्ति के किस अनुपात में है?`,
      ];
      const surfacesPa = [
        `ਪਰਾਸ ${leftRange} ਦੀ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਅਤੇ ਪਰਾਸ ${rightRange} ਦੀ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
        `ਪਹਿਲੇ ${firstCount} ਵਰਗਾਂ ਦੀ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਦਾ ਬਾਕੀ ਵਰਗਾਂ ਦੀ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਨਾਲ ਅਨੁਪਾਤ ਕੱਢੋ।`,
        `${leftRange} ਦੀ ਮਿਲੀ-ਜੁਲੀ ਬਾਰੰਬਾਰਤਾ, ${rightRange} ਦੀ ਮਿਲੀ-ਜੁਲੀ ਬਾਰੰਬਾਰਤਾ ਦੇ ਕਿਸ ਅਨੁਪਾਤ ਵਿੱਚ ਹੈ?`,
      ];
      return (hi ? surfacesHi : surfacesPa)[variant]!;
    }
    case "CLASS_SHARE_OF_TOTAL": {
      const target = bins[Number(evidence.targetIndex)]!;
      const value = interval(target);
      const surfacesHi = [
        `निकटतम पूर्ण प्रतिशत में, वर्ग ${value} कुल आवृत्ति का कितने प्रतिशत है?`,
        `लगभग कितने पूर्ण प्रतिशत प्रेक्षण अंतराल ${value} में आते हैं?`,
        `पूरे हिस्टोग्राम में वर्ग ${value} की प्रतिशत हिस्सेदारी निकटतम पूर्ण प्रतिशत में ज्ञात कीजिए।`,
      ];
      const surfacesPa = [
        `ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ, ਵਰਗ ${value} ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਦਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`,
        `ਲਗਭਗ ਕਿੰਨੇ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਪ੍ਰੇਖਣ ਅੰਤਰਾਲ ${value} ਵਿੱਚ ਆਉਂਦੇ ਹਨ?`,
        `ਪੂਰੇ ਹਿਸਟੋਗ੍ਰਾਮ ਵਿੱਚ ਵਰਗ ${value} ਦੀ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸੇਦਾਰੀ ਨਜ਼ਦੀਕੀ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਕੱਢੋ।`,
      ];
      return (hi ? surfacesHi : surfacesPa)[variant]!;
    }
    case "FREQUENCY_DIFFERENCE_BETWEEN_CLASSES": {
      const left = interval(bins[Number(evidence.leftIndex)]!);
      const right = interval(bins[Number(evidence.rightIndex)]!);
      const surfacesHi = [
        `वर्ग ${left} और ${right} की आवृत्तियों का अंतर कितना है?`,
        `वर्ग ${left} और ${right} की आवृत्तियाँ कितनी अलग हैं?`,
        `${left} और ${right} के स्तंभों की ऊँचाइयों का निरपेक्ष अंतर ज्ञात कीजिए।`,
      ];
      const surfacesPa = [
        `ਵਰਗ ${left} ਅਤੇ ${right} ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਦਾ ਅੰਤਰ ਕਿੰਨਾ ਹੈ?`,
        `ਵਰਗ ${left} ਅਤੇ ${right} ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਵਿੱਚ ਕਿੰਨਾ ਫਰਕ ਹੈ?`,
        `${left} ਅਤੇ ${right} ਦੇ ਸਤੰਭਾਂ ਦੀਆਂ ਉਚਾਈਆਂ ਦਾ ਨਿਰਪੇਖ ਅੰਤਰ ਕੱਢੋ।`,
      ];
      return (hi ? surfacesHi : surfacesPa)[variant]!;
    }
    case "MODAL_CLASS_IDENTIFICATION": {
      const surfacesHi = [
        "बहुलक वर्ग कौन-सा है?",
        "सर्वाधिक आवृत्ति वाला वर्ग पहचानिए।",
        "हिस्टोग्राम का सबसे ऊँचा आयत किस वर्ग अंतराल को दर्शाता है?",
      ];
      const surfacesPa = [
        "ਬਹੁਲਕ ਵਰਗ ਕਿਹੜਾ ਹੈ?",
        "ਸਭ ਤੋਂ ਵੱਧ ਬਾਰੰਬਾਰਤਾ ਵਾਲਾ ਵਰਗ ਪਛਾਣੋ।",
        "ਹਿਸਟੋਗ੍ਰਾਮ ਦਾ ਸਭ ਤੋਂ ਉੱਚਾ ਆਯਤ ਕਿਹੜਾ ਵਰਗ ਅੰਤਰਾਲ ਦਰਸਾਉਂਦਾ ਹੈ?",
      ];
      return (hi ? surfacesHi : surfacesPa)[variant]!;
    }
    case "MEDIAN_CLASS_IDENTIFICATION": {
      const surfacesHi = [
        "माध्यिका प्रेक्षण किस वर्ग अंतराल में आता है?",
        "हिस्टोग्राम से माध्यिका वर्ग पहचानिए।",
        "कुल आवृत्ति के आधे स्थान वाला प्रेक्षण किस वर्ग में आता है?",
        "इस आवृत्ति वितरण का माध्यिका वर्ग कौन-सा है?",
      ];
      const surfacesPa = [
        "ਮੱਧਿਕਾ ਪ੍ਰੇਖਣ ਕਿਹੜੇ ਵਰਗ ਅੰਤਰਾਲ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?",
        "ਹਿਸਟੋਗ੍ਰਾਮ ਤੋਂ ਮੱਧਿਕਾ ਵਰਗ ਪਛਾਣੋ।",
        "ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਦੇ ਅੱਧੇ ਸਥਾਨ ਵਾਲਾ ਪ੍ਰੇਖਣ ਕਿਹੜੇ ਵਰਗ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?",
        "ਇਸ ਬਾਰੰਬਾਰਤਾ ਵੰਡ ਦਾ ਮੱਧਿਕਾ ਵਰਗ ਕਿਹੜਾ ਹੈ?",
      ];
      return (hi ? surfacesHi : surfacesPa)[variant]!;
    }
    case "KTH_OBSERVATION_CLASS": {
      const rank = Number(evidence.rank);
      const surfacesHi = [
        `प्रेक्षण क्रमांक ${rank} किस वर्ग अंतराल में आता है?`,
        `आँकड़ों को आरोही क्रम में रखने पर क्रमांक ${rank} वाला प्रेक्षण किस वर्ग में होगा?`,
        `वितरण का ${rank}वाँ प्रेक्षण किस वर्ग अंतराल में है?`,
      ];
      const surfacesPa = [
        `ਪ੍ਰੇਖਣ ਨੰਬਰ ${rank} ਕਿਹੜੇ ਵਰਗ ਅੰਤਰਾਲ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`,
        `ਅੰਕੜਿਆਂ ਨੂੰ ਚੜ੍ਹਦੇ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖਣ ਤੇ ਨੰਬਰ ${rank} ਵਾਲਾ ਪ੍ਰੇਖਣ ਕਿਹੜੇ ਵਰਗ ਵਿੱਚ ਹੋਵੇਗਾ?`,
        `ਵੰਡ ਦਾ ${rank}ਵਾਂ ਪ੍ਰੇਖਣ ਕਿਹੜੇ ਵਰਗ ਅੰਤਰਾਲ ਵਿੱਚ ਹੈ?`,
      ];
      return (hi ? surfacesHi : surfacesPa)[variant]!;
    }
    case "APPROX_GROUPED_MEAN_FROM_HISTOGRAM": {
      const surfacesHi = [
        "वर्ग-मध्य मानों का उपयोग करके वितरण का अनुमानित औसत निकटतम पूर्ण संख्या में ज्ञात कीजिए।",
        "हिस्टोग्राम से दर्शाया गया अनुमानित अंकगणितीय औसत निकटतम पूर्ण संख्या में कितना है?",
        "प्रत्येक वर्ग के मध्य मान का उपयोग करके समूहित औसत ज्ञात कीजिए और निकटतम पूर्ण संख्या दीजिए।",
        "वर्ग-मध्य विधि से हिस्टोग्राम का औसत निकटतम पूर्ण संख्या में अनुमानित कीजिए।",
      ];
      const surfacesPa = [
        "ਵਰਗ-ਮੱਧ ਮੁੱਲਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਵੰਡ ਦਾ ਅਨੁਮਾਨਿਤ ਔਸਤ ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ ਵਿੱਚ ਕੱਢੋ।",
        "ਹਿਸਟੋਗ੍ਰਾਮ ਤੋਂ ਦਰਸਾਇਆ ਅਨੁਮਾਨਿਤ ਅੰਕਗਣਿਤ ਔਸਤ ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ ਵਿੱਚ ਕਿੰਨਾ ਹੈ?",
        "ਹਰੇਕ ਵਰਗ ਦੇ ਮੱਧ ਮੁੱਲ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਸਮੂਹਿਤ ਔਸਤ ਕੱਢੋ ਅਤੇ ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ ਦਿਓ।",
        "ਵਰਗ-ਮੱਧ ਵਿਧੀ ਨਾਲ ਹਿਸਟੋਗ੍ਰਾਮ ਦਾ ਔਸਤ ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ ਵਿੱਚ ਅਨੁਮਾਨਿਤ ਕਰੋ।",
      ];
      return (hi ? surfacesHi : surfacesPa)[variant]!;
    }
    case "APPROX_GROUPED_MODE_FROM_HISTOGRAM": {
      const surfacesHi = [
        "समूहित आँकड़ों के बहुलक सूत्र से अनुमानित बहुलक निकटतम पूर्ण संख्या में ज्ञात कीजिए।",
        "हिस्टोग्राम द्वारा दर्शाए गए वितरण का अनुमानित बहुलक निकटतम पूर्ण संख्या में ज्ञात कीजिए।",
        "बहुलक वर्ग और उसके दोनों पड़ोसी वर्गों की आवृत्तियों से समूहित बहुलक ज्ञात कीजिए और निकटतम पूर्ण संख्या दीजिए।",
      ];
      const surfacesPa = [
        "ਸਮੂਹਿਤ ਅੰਕੜਿਆਂ ਦੇ ਬਹੁਲਕ ਸੂਤਰ ਨਾਲ ਅਨੁਮਾਨਿਤ ਬਹੁਲਕ ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ ਵਿੱਚ ਕੱਢੋ।",
        "ਹਿਸਟੋਗ੍ਰਾਮ ਦੁਆਰਾ ਦਰਸਾਈ ਵੰਡ ਦਾ ਅਨੁਮਾਨਿਤ ਬਹੁਲਕ ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ ਵਿੱਚ ਕੱਢੋ।",
        "ਬਹੁਲਕ ਵਰਗ ਅਤੇ ਉਸ ਦੇ ਦੋਨੋਂ ਗੁਆਂਢੀ ਵਰਗਾਂ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਨਾਲ ਸਮੂਹਿਤ ਬਹੁਲਕ ਕੱਢੋ ਅਤੇ ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ ਦਿਓ।",
      ];
      return (hi ? surfacesHi : surfacesPa)[variant]!;
    }
  }
}

function localizedExplanation(
  question: Di009Question,
  stimulus: Di009Stimulus,
  locale: Di009LocalizationLocale,
) {
  const bins = stimulus.bins;
  const evidence = question.evidence;
  const hi = isHindi(locale);
  const total = totalFrequency(bins);
  const pack = (keyHi: string, keyPa: string, stepsHi: string[], stepsPa: string[], workingTable?: { headers: string[]; rows: string[][] }) => ({
    keyIdea: hi ? keyHi : keyPa,
    steps: hi ? stepsHi : stepsPa,
    ...(workingTable ? { workingTable } : {}),
  });

  switch (question.kind) {
    case "DIRECT_CLASS_FREQUENCY": {
      const target = bins[Number(evidence.targetIndex)]!;
      return pack(
        "समान वर्ग-चौड़ाई वाले हिस्टोग्राम में प्रत्येक आयत की ऊँचाई उस वर्ग की आवृत्ति बताती है।",
        "ਬਰਾਬਰ ਵਰਗ-ਚੌੜਾਈ ਵਾਲੇ ਹਿਸਟੋਗ੍ਰਾਮ ਵਿੱਚ ਹਰ ਆਯਤ ਦੀ ਉਚਾਈ ਉਸ ਵਰਗ ਦੀ ਬਾਰੰਬਾਰਤਾ ਦੱਸਦੀ ਹੈ।",
        [`वर्ग ${interval(target)} का आयत देखें।`, `उसकी ऊँचाई ${target.frequency} है, इसलिए आवृत्ति ${target.frequency} है।`],
        [`ਵਰਗ ${interval(target)} ਦਾ ਆਯਤ ਵੇਖੋ।`, `ਉਸ ਦੀ ਉਚਾਈ ${target.frequency} ਹੈ, ਇਸ ਲਈ ਬਾਰੰਬਾਰਤਾ ${target.frequency} ਹੈ।`],
      );
    }
    case "TOTAL_FREQUENCY": {
      const values = bins.map((bin) => bin.frequency);
      return pack(
        "कुल आवृत्ति के लिए सभी वर्गों की आवृत्तियाँ जोड़ें।",
        "ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਲਈ ਸਾਰੇ ਵਰਗਾਂ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਜੋੜੋ।",
        [`कुल = ${values.join(" + ")} = ${total}।`],
        [`ਕੁੱਲ = ${values.join(" + ")} = ${total}।`],
      );
    }
    case "COMBINED_RANGE_TOTAL": {
      const start = Number(evidence.startIndex), end = Number(evidence.endIndex);
      const selected = bins.slice(start, end + 1);
      const answer = sumRange(bins, start, end);
      return pack(
        "दिए गए परास में आने वाले सभी वर्गों की आवृत्तियाँ जोड़ें।",
        "ਦਿੱਤੇ ਪਰਾਸ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਸਾਰੇ ਵਰਗਾਂ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਜੋੜੋ।",
        [`आवृत्तियाँ = ${selected.map((bin) => bin.frequency).join(" + ")} = ${answer}।`],
        [`ਬਾਰੰਬਾਰਤਾਵਾਂ = ${selected.map((bin) => bin.frequency).join(" + ")} = ${answer}।`],
      );
    }
    case "ABOVE_BOUNDARY_TOTAL": {
      const start = Number(evidence.startIndex);
      const boundary = Number(evidence.boundary);
      const selected = bins.slice(start);
      const answer = sumRange(bins, start, bins.length - 1);
      return pack(
        "दी गई सीमा से शुरू होने वाले वर्ग और उसके दाईं ओर के सभी वर्गों की आवृत्तियाँ जोड़ें।",
        "ਦਿੱਤੀ ਸੀਮਾ ਤੋਂ ਸ਼ੁਰੂ ਹੋਣ ਵਾਲੇ ਵਰਗ ਅਤੇ ਉਸ ਦੇ ਸੱਜੇ ਪਾਸੇ ਦੇ ਸਾਰੇ ਵਰਗਾਂ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਜੋੜੋ।",
        [`${boundary} से आगे की आवृत्तियाँ = ${selected.map((bin) => bin.frequency).join(" + ")} = ${answer}।`],
        [`${boundary} ਤੋਂ ਅੱਗੇ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ = ${selected.map((bin) => bin.frequency).join(" + ")} = ${answer}।`],
      );
    }
    case "BELOW_BOUNDARY_TOTAL": {
      const endExclusive = Number(evidence.endExclusive);
      const boundary = Number(evidence.boundary);
      const selected = bins.slice(0, endExclusive);
      const answer = sumRange(bins, 0, endExclusive - 1);
      return pack(
        "दी गई सीमा से नीचे समाप्त होने वाले सभी वर्गों की आवृत्तियाँ जोड़ें।",
        "ਦਿੱਤੀ ਸੀਮਾ ਤੋਂ ਹੇਠਾਂ ਖਤਮ ਹੋਣ ਵਾਲੇ ਸਾਰੇ ਵਰਗਾਂ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਜੋੜੋ।",
        [`${boundary} से नीचे की आवृत्तियाँ = ${selected.map((bin) => bin.frequency).join(" + ")} = ${answer}।`],
        [`${boundary} ਤੋਂ ਹੇਠਾਂ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ = ${selected.map((bin) => bin.frequency).join(" + ")} = ${answer}।`],
      );
    }
    case "RANGE_RATIO": {
      const leftStart = Number(evidence.leftStart), leftEnd = Number(evidence.leftEnd);
      const rightStart = Number(evidence.rightStart), rightEnd = Number(evidence.rightEnd);
      const left = sumRange(bins, leftStart, leftEnd);
      const right = sumRange(bins, rightStart, rightEnd);
      return pack(
        "दोनों परासों की कुल आवृत्ति अलग-अलग जोड़ें और फिर उसी क्रम में अनुपात सरल करें।",
        "ਦੋਵੇਂ ਪਰਾਸਾਂ ਦੀ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਵੱਖ-ਵੱਖ ਜੋੜੋ ਅਤੇ ਫਿਰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।",
        [`${rangeLabel(bins, leftStart, leftEnd)} की कुल आवृत्ति = ${left}।`, `${rangeLabel(bins, rightStart, rightEnd)} की कुल आवृत्ति = ${right}।`, `आवश्यक अनुपात = ${left}:${right} = ${question.answer}।`],
        [`${rangeLabel(bins, leftStart, leftEnd)} ਦੀ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ = ${left}।`, `${rangeLabel(bins, rightStart, rightEnd)} ਦੀ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ = ${right}।`, `ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ = ${left}:${right} = ${question.answer}।`],
      );
    }
    case "CLASS_SHARE_OF_TOTAL": {
      const target = bins[Number(evidence.targetIndex)]!;
      return pack(
        "वर्ग की आवृत्ति को कुल आवृत्ति से भाग देकर 100 से गुणा करें।",
        "ਵਰਗ ਦੀ ਬਾਰੰਬਾਰਤਾ ਨੂੰ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਨਾਲ ਭਾਗ ਦੇ ਕੇ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।",
        [`कुल आवृत्ति = ${total}।`, `वर्ग ${interval(target)} की आवृत्ति = ${target.frequency}।`, `प्रतिशत = ${target.frequency}/${total} × 100 ≈ ${question.answer} (निकटतम पूर्ण प्रतिशत)।`],
        [`ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ = ${total}।`, `ਵਰਗ ${interval(target)} ਦੀ ਬਾਰੰਬਾਰਤਾ = ${target.frequency}।`, `ਪ੍ਰਤੀਸ਼ਤ = ${target.frequency}/${total} × 100 ≈ ${question.answer} (ਨਜ਼ਦੀਕੀ ਪੂਰਾ ਪ੍ਰਤੀਸ਼ਤ)।`],
      );
    }
    case "FREQUENCY_DIFFERENCE_BETWEEN_CLASSES": {
      const left = bins[Number(evidence.leftIndex)]!, right = bins[Number(evidence.rightIndex)]!;
      return pack(
        "दोनों स्तंभों की ऊँचाइयाँ पढ़ें और बड़ी आवृत्ति में से छोटी आवृत्ति घटाएँ।",
        "ਦੋਵੇਂ ਸਤੰਭਾਂ ਦੀਆਂ ਉਚਾਈਆਂ ਪੜ੍ਹੋ ਅਤੇ ਵੱਡੀ ਬਾਰੰਬਾਰਤਾ ਵਿੱਚੋਂ ਛੋਟੀ ਬਾਰੰਬਾਰਤਾ ਘਟਾਓ।",
        [`आवृत्तियाँ = ${left.frequency} और ${right.frequency}।`, `अंतर = |${left.frequency} - ${right.frequency}| = ${question.answer}।`],
        [`ਬਾਰੰਬਾਰਤਾਵਾਂ = ${left.frequency} ਅਤੇ ${right.frequency}।`, `ਅੰਤਰ = |${left.frequency} - ${right.frequency}| = ${question.answer}।`],
      );
    }
    case "MODAL_CLASS_IDENTIFICATION": {
      const index = Number(evidence.modalIndex);
      const modal = bins[index]!;
      return pack(
        "सबसे अधिक आवृत्ति वाला वर्ग बहुलक वर्ग होता है।",
        "ਸਭ ਤੋਂ ਵੱਧ ਬਾਰੰਬਾਰਤਾ ਵਾਲਾ ਵਰਗ ਬਹੁਲਕ ਵਰਗ ਹੁੰਦਾ ਹੈ।",
        [`सबसे ऊँचे स्तंभ की आवृत्ति ${modal.frequency} है।`, `इसका वर्ग अंतराल ${interval(modal)} है।`],
        [`ਸਭ ਤੋਂ ਉੱਚੇ ਸਤੰਭ ਦੀ ਬਾਰੰਬਾਰਤਾ ${modal.frequency} ਹੈ।`, `ਇਸ ਦਾ ਵਰਗ ਅੰਤਰਾਲ ${interval(modal)} ਹੈ।`],
      );
    }
    case "MEDIAN_CLASS_IDENTIFICATION": {
      const cumulative = cumulativeFrequencies(bins);
      const index = Number(evidence.medianIndex);
      const observationPosition = Math.ceil(total / 2);
      const headers = hi ? ["वर्ग", "आवृत्ति", "संचयी आवृत्ति"] : ["ਵਰਗ", "ਬਾਰੰਬਾਰਤਾ", "ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾ"];
      const rows = bins.map((bin, rowIndex) => [interval(bin), String(bin.frequency), String(cumulative[rowIndex])]);
      return pack(
        "कुल आवृत्ति का आधा स्थान निकालें और पहली ऐसी संचयी आवृत्ति खोजें जो उस स्थान तक पहुँचती या उससे आगे जाती है।",
        "ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਦਾ ਅੱਧਾ ਸਥਾਨ ਕੱਢੋ ਅਤੇ ਪਹਿਲੀ ਐਸੀ ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾ ਲੱਭੋ ਜੋ ਉਸ ਸਥਾਨ ਤੱਕ ਪਹੁੰਚਦੀ ਜਾਂ ਉਸ ਤੋਂ ਅੱਗੇ ਜਾਂਦੀ ਹੈ।",
        [`कुल आवृत्ति = ${total}। संचयी आवृत्ति से माध्यिका वर्ग खोजने के लिए प्रेक्षण क्रमांक ${observationPosition} देखें।`, `पहली उपयुक्त संचयी आवृत्ति ${cumulative[index]} है, जो वर्ग ${interval(bins[index]!)} में आती है।`],
        [`ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ = ${total}। ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾ ਨਾਲ ਮੱਧਿਕਾ ਵਰਗ ਲੱਭਣ ਲਈ ਪ੍ਰੇਖਣ ਨੰਬਰ ${observationPosition} ਵੇਖੋ।`, `ਪਹਿਲੀ ਉਚਿਤ ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾ ${cumulative[index]} ਹੈ, ਜੋ ਵਰਗ ${interval(bins[index]!)} ਵਿੱਚ ਆਉਂਦੀ ਹੈ।`],
        { headers, rows },
      );
    }
    case "KTH_OBSERVATION_CLASS": {
      const cumulative = cumulativeFrequencies(bins);
      const rank = Number(evidence.rank), index = Number(evidence.targetIndex);
      const headers = hi ? ["वर्ग", "संचयी आवृत्ति"] : ["ਵਰਗ", "ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾ"];
      const rows = bins.map((bin, rowIndex) => [interval(bin), String(cumulative[rowIndex])]);
      return pack(
        "संचयी आवृत्ति से वह पहला वर्ग खोजें जहाँ आवश्यक प्रेक्षण क्रमांक पहुँचता है।",
        "ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾ ਤੋਂ ਉਹ ਪਹਿਲਾ ਵਰਗ ਲੱਭੋ ਜਿੱਥੇ ਲੋੜੀਂਦਾ ਪ੍ਰੇਖਣ ਨੰਬਰ ਪਹੁੰਚਦਾ ਹੈ।",
        [`आवश्यक स्थान = ${rank}।`, `पहली संचयी आवृत्ति जो ${rank} या उससे अधिक है, ${cumulative[index]} है; इसलिए प्रेक्षण ${interval(bins[index]!)} में है।`],
        [`ਲੋੜੀਂਦਾ ਸਥਾਨ = ${rank}।`, `ਪਹਿਲੀ ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾ ਜੋ ${rank} ਜਾਂ ਇਸ ਤੋਂ ਵੱਧ ਹੈ, ${cumulative[index]} ਹੈ; ਇਸ ਲਈ ਪ੍ਰੇਖਣ ${interval(bins[index]!)} ਵਿੱਚ ਹੈ।`],
        { headers, rows },
      );
    }
    case "APPROX_GROUPED_MEAN_FROM_HISTOGRAM": {
      const doubledWeighted = bins.reduce((sum, bin) => sum + (bin.lower + bin.upper) * bin.frequency, 0);
      const weighted = String(doubledWeighted / 2);
      const headers = hi
        ? ["वर्ग", "आवृत्ति", "वर्ग-मध्य", "आवृत्ति × वर्ग-मध्य"]
        : ["ਵਰਗ", "ਬਾਰੰਬਾਰਤਾ", "ਵਰਗ-ਮੱਧ", "ਬਾਰੰਬਾਰਤਾ × ਵਰਗ-ਮੱਧ"];
      const rows = bins.map((bin) => {
        const midpointNumerator = bin.lower + bin.upper;
        return [interval(bin), String(bin.frequency), String(midpointNumerator / 2), String((midpointNumerator * bin.frequency) / 2)];
      });
      return pack(
        "प्रत्येक वर्ग का मध्य मान लेकर उसे उसकी आवृत्ति से गुणा करें। इन गुणनफलों के योग को कुल आवृत्ति से भाग दें।",
        "ਹਰੇਕ ਵਰਗ ਦਾ ਮੱਧ ਮੁੱਲ ਲੈ ਕੇ ਉਸ ਨੂੰ ਉਸ ਦੀ ਬਾਰੰਬਾਰਤਾ ਨਾਲ ਗੁਣਾ ਕਰੋ। ਇਨ੍ਹਾਂ ਗੁਣਨਫਲਾਂ ਦੇ ਜੋੜ ਨੂੰ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਨਾਲ ਭਾਗ ਦਿਓ।",
        [`कुल आवृत्ति = ${total}।`, `आवृत्ति × वर्ग-मध्य का योग = ${weighted}।`, `औसत = ${weighted}/${total} ≈ ${question.answer} (निकटतम पूर्ण संख्या)।`],
        [`ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ = ${total}।`, `ਬਾਰੰਬਾਰਤਾ × ਵਰਗ-ਮੱਧ ਦਾ ਜੋੜ = ${weighted}।`, `ਔਸਤ = ${weighted}/${total} ≈ ${question.answer} (ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ)।`],
        { headers, rows },
      );
    }
    case "APPROX_GROUPED_MODE_FROM_HISTOGRAM": {
      const index = Number(evidence.modalIndex);
      const modal = bins[index]!;
      const previous = bins[index - 1]!, next = bins[index + 1]!;
      const headers = hi ? ["वर्ग", "आवृत्ति", "भूमिका"] : ["ਵਰਗ", "ਬਾਰੰਬਾਰਤਾ", "ਭੂਮਿਕਾ"];
      const rows = [
        [interval(previous), String(previous.frequency), hi ? "पिछला वर्ग" : "ਪਿਛਲਾ ਵਰਗ"],
        [interval(modal), String(modal.frequency), hi ? "बहुलक वर्ग" : "ਬਹੁਲਕ ਵਰਗ"],
        [interval(next), String(next.frequency), hi ? "अगला वर्ग" : "ਅਗਲਾ ਵਰਗ"],
      ];
      return pack(
        "समूहित बहुलक के लिए बहुलक वर्ग, उसके पिछले और अगले वर्ग की आवृत्तियों तथा वर्ग-चौड़ाई का उपयोग करें।",
        "ਸਮੂਹਿਤ ਬਹੁਲਕ ਲਈ ਬਹੁਲਕ ਵਰਗ, ਉਸ ਦੇ ਪਿਛਲੇ ਅਤੇ ਅਗਲੇ ਵਰਗ ਦੀਆਂ ਬਾਰੰਬਾਰਤਾਵਾਂ ਅਤੇ ਵਰਗ-ਚੌੜਾਈ ਵਰਤੋ।",
        [`बहुलक वर्ग = ${interval(modal)}।`, `पिछले वर्ग की आवृत्ति = ${previous.frequency}, बहुलक वर्ग की आवृत्ति = ${modal.frequency}, अगले वर्ग की आवृत्ति = ${next.frequency}, वर्ग-चौड़ाई = ${stimulus.classWidth}।`, `इन मानों को समूहित बहुलक सूत्र में रखने पर बहुलक ≈ ${question.answer} (निकटतम पूर्ण संख्या)।`],
        [`ਬਹੁਲਕ ਵਰਗ = ${interval(modal)}।`, `ਪਿਛਲੇ ਵਰਗ ਦੀ ਬਾਰੰਬਾਰਤਾ = ${previous.frequency}, ਬਹੁਲਕ ਵਰਗ ਦੀ ਬਾਰੰਬਾਰਤਾ = ${modal.frequency}, ਅਗਲੇ ਵਰਗ ਦੀ ਬਾਰੰਬਾਰਤਾ = ${next.frequency}, ਵਰਗ-ਚੌੜਾਈ = ${stimulus.classWidth}।`, `ਇਨ੍ਹਾਂ ਮੁੱਲਾਂ ਨੂੰ ਸਮੂਹਿਤ ਬਹੁਲਕ ਸੂਤਰ ਵਿੱਚ ਰੱਖਣ ਤੇ ਬਹੁਲਕ ≈ ${question.answer} (ਨਜ਼ਦੀਕੀ ਪੂਰੀ ਸੰਖਿਆ)।`],
        { headers, rows },
      );
    }
  }
}

export function localizeDi009Question(
  source: ReturnType<typeof generateDi009PermanentQuestion>,
  locale: Di009LocalizationLocale,
) {
  return {
    packageId: "DI-009" as const,
    seed: source.seed,
    examProfile: source.examProfile,
    language: locale === "hi-IN" ? "hi" as const : "pa" as const,
    locale,
    localizationReviewId: DI009_LOCALIZATION_REVIEW_ID,
    localizationReleaseId: DI009_LOCALIZATION_RELEASE_ID,
    localizationStatus: "HI_PA_FROZEN" as const,
    sourceEnglishStatus: "ENGLISH_REVIEW_APPROVED" as const,
    stimulus: localizeDi009Stimulus(source.stimulus, locale),
    question: {
      ...source.question,
      stem: localizedStem(source.question, source.stimulus, locale),
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

export function generateDi009LocalizedReviewQuestion(input: {
  seed: string;
  examProfile: Di009ExamProfile;
  taskKind: Di009TaskKind;
  locale: Di009LocalizationLocale;
}) {
  return localizeDi009Question(
    generateDi009PermanentQuestion({
      seed: input.seed,
      examProfile: input.examProfile,
      taskKind: input.taskKind,
    }),
    input.locale,
  );
}
