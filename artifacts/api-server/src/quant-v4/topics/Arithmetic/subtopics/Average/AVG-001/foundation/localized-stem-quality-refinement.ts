import { applyAvg001LocalizedStemQuality } from "./localized-stem-quality";
import type { Avg001QuestionPackage } from "./types";

type PilotLanguage = "hi" | "pa";

function shown(pkg: Avg001QuestionPackage, key: string) {
  return String(pkg.parameters.renderVariables[key] ?? "");
}

function isCp003AgeQuestion(pkg: Avg001QuestionPackage) {
  const variant = pkg.parameters.scenarioVariant;
  return (
    pkg.parameters.contextDomain === "Family" ||
    /age|teacher|child|newborn|afteryears|elapsedyears|retir/i.test(variant)
  ) && !/cricket/i.test(variant);
}

function cp002Subject(pkg: Avg001QuestionPackage, language: PilotLanguage, variant: number) {
  const domain = pkg.parameters.contextDomain;
  if (language === "hi") {
    const choices: Record<string, string[]> = {
      Abstract: [
        "समान अंतर से बढ़ती संख्याएँ",
        "क्रमबद्ध संख्याओं का समूह",
        "नियमित अंतर पर लिखे गए मान",
        "समान अंतर वाले कुछ मान",
        "एक निश्चित अंतर से बढ़ती संख्याएँ",
        "क्रम में रखे गए समान-अंतर मान",
      ],
      Classroom: [
        "कुछ परीक्षाओं में प्राप्त अंक",
        "एक विद्यार्थी के क्रमिक टेस्ट-अंक",
        "समान अंतर पर रखे गए परीक्षा-अंक",
        "एक अंक-सूची के क्रमबद्ध मान",
        "लगातार परीक्षाओं में प्राप्त अंक",
        "समान अंतर से बढ़ते टेस्ट-अंक",
      ],
      Commerce: [
        "कुछ वस्तुओं की क्रमबद्ध कीमतें",
        "समान अंतर पर रखी गई कीमतें",
        "वस्तुओं के क्रमिक मूल्य",
        "एक मूल्य-सूची की कीमतें",
        "निश्चित अंतर से बढ़ती कीमतें",
        "क्रम में दी गई वस्तु-कीमतें",
      ],
      Factory: [
        "लगातार दिनों के उत्पादन के आँकड़े",
        "दैनिक उत्पादन के क्रमबद्ध मान",
        "समान अंतर से बदलते उत्पादन आँकड़े",
        "एक संयंत्र के दैनिक उत्पादन मान",
        "क्रमिक दिनों का उत्पादन",
        "निश्चित अंतर से बढ़ता दैनिक उत्पादन",
      ],
      Sports: [
        "लगातार मैचों में बने स्कोर",
        "एक खिलाड़ी के क्रमिक स्कोर",
        "समान अंतर से बढ़ते मैच-स्कोर",
        "कुछ पारियों के क्रमबद्ध स्कोर",
        "लगातार मुकाबलों में प्राप्त अंक",
        "निश्चित अंतर पर दर्ज खेल-स्कोर",
      ],
      Travel: [
        "लगातार यात्राओं में तय दूरियाँ",
        "यात्राओं की क्रमबद्ध दूरियाँ",
        "समान अंतर से बढ़ती यात्रा-दूरियाँ",
        "कुछ मार्गों की दर्ज दूरियाँ",
        "क्रमिक चरणों में तय दूरी",
        "निश्चित अंतर पर दी गई दूरियाँ",
      ],
    };
    return (choices[domain] ?? choices.Abstract)![variant]!;
  }

  const choices: Record<string, string[]> = {
    Abstract: [
      "ਬਰਾਬਰ ਅੰਤਰ ਨਾਲ ਵਧਦੀਆਂ ਸੰਖਿਆਵਾਂ",
      "ਤਰਤੀਬਵਾਰ ਸੰਖਿਆਵਾਂ ਦਾ ਸਮੂਹ",
      "ਨਿਯਮਿਤ ਅੰਤਰ ਉੱਤੇ ਲਿਖੇ ਮੁੱਲ",
      "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ਕੁਝ ਮੁੱਲ",
      "ਇੱਕ ਨਿਸ਼ਚਿਤ ਅੰਤਰ ਨਾਲ ਵਧਦੀਆਂ ਸੰਖਿਆਵਾਂ",
      "ਕ੍ਰਮ ਵਿੱਚ ਰੱਖੇ ਬਰਾਬਰ-ਅੰਤਰ ਮੁੱਲ",
    ],
    Classroom: [
      "ਕੁਝ ਪ੍ਰੀਖਿਆਵਾਂ ਵਿੱਚ ਪ੍ਰਾਪਤ ਅੰਕ",
      "ਇੱਕ ਵਿਦਿਆਰਥੀ ਦੇ ਲਗਾਤਾਰ ਟੈਸਟ-ਅੰਕ",
      "ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਰੱਖੇ ਪ੍ਰੀਖਿਆ ਅੰਕ",
      "ਇੱਕ ਅੰਕ-ਸੂਚੀ ਦੇ ਤਰਤੀਬਵਾਰ ਮੁੱਲ",
      "ਲਗਾਤਾਰ ਪ੍ਰੀਖਿਆਵਾਂ ਵਿੱਚ ਪ੍ਰਾਪਤ ਅੰਕ",
      "ਬਰਾਬਰ ਅੰਤਰ ਨਾਲ ਵਧਦੇ ਟੈਸਟ-ਅੰਕ",
    ],
    Commerce: [
      "ਕੁਝ ਵਸਤੂਆਂ ਦੀਆਂ ਤਰਤੀਬਵਾਰ ਕੀਮਤਾਂ",
      "ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਰੱਖੀਆਂ ਕੀਮਤਾਂ",
      "ਵਸਤੂਆਂ ਦੇ ਲਗਾਤਾਰ ਮੁੱਲ",
      "ਇੱਕ ਕੀਮਤ-ਸੂਚੀ ਦੀਆਂ ਕੀਮਤਾਂ",
      "ਨਿਸ਼ਚਿਤ ਅੰਤਰ ਨਾਲ ਵਧਦੀਆਂ ਕੀਮਤਾਂ",
      "ਕ੍ਰਮ ਵਿੱਚ ਦਿੱਤੀਆਂ ਵਸਤੂ-ਕੀਮਤਾਂ",
    ],
    Factory: [
      "ਲਗਾਤਾਰ ਦਿਨਾਂ ਦੇ ਉਤਪਾਦਨ ਦੇ ਅੰਕੜੇ",
      "ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ਦੇ ਤਰਤੀਬਵਾਰ ਮੁੱਲ",
      "ਬਰਾਬਰ ਅੰਤਰ ਨਾਲ ਬਦਲਦੇ ਉਤਪਾਦਨ ਅੰਕੜੇ",
      "ਇੱਕ ਪਲਾਂਟ ਦੇ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ਮੁੱਲ",
      "ਲਗਾਤਾਰ ਦਿਨਾਂ ਦਾ ਉਤਪਾਦਨ",
      "ਨਿਸ਼ਚਿਤ ਅੰਤਰ ਨਾਲ ਵਧਦਾ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ",
    ],
    Sports: [
      "ਲਗਾਤਾਰ ਮੈਚਾਂ ਵਿੱਚ ਬਣੇ ਸਕੋਰ",
      "ਇੱਕ ਖਿਡਾਰੀ ਦੇ ਲਗਾਤਾਰ ਸਕੋਰ",
      "ਬਰਾਬਰ ਅੰਤਰ ਨਾਲ ਵਧਦੇ ਮੈਚ-ਸਕੋਰ",
      "ਕੁਝ ਪਾਰੀਆਂ ਦੇ ਤਰਤੀਬਵਾਰ ਸਕੋਰ",
      "ਲਗਾਤਾਰ ਮੁਕਾਬਲਿਆਂ ਵਿੱਚ ਪ੍ਰਾਪਤ ਅੰਕ",
      "ਨਿਸ਼ਚਿਤ ਅੰਤਰ ਉੱਤੇ ਦਰਜ ਖੇਡ-ਸਕੋਰ",
    ],
    Travel: [
      "ਲਗਾਤਾਰ ਯਾਤਰਾਵਾਂ ਵਿੱਚ ਤੈਅ ਦੂਰੀਆਂ",
      "ਯਾਤਰਾਵਾਂ ਦੀਆਂ ਤਰਤੀਬਵਾਰ ਦੂਰੀਆਂ",
      "ਬਰਾਬਰ ਅੰਤਰ ਨਾਲ ਵਧਦੀਆਂ ਯਾਤਰਾ-ਦੂਰੀਆਂ",
      "ਕੁਝ ਮਾਰਗਾਂ ਦੀਆਂ ਦਰਜ ਦੂਰੀਆਂ",
      "ਲਗਾਤਾਰ ਪੜਾਵਾਂ ਵਿੱਚ ਤੈਅ ਦੂਰੀ",
      "ਨਿਸ਼ਚਿਤ ਅੰਤਰ ਉੱਤੇ ਦਿੱਤੀਆਂ ਦੂਰੀਆਂ",
    ],
  };
  return (choices[domain] ?? choices.Abstract)![variant]!;
}

function cp002Stem(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const id = Number(pkg.questionLanguageId.slice(-3));
  const variant = id % 6;
  const subject = cp002Subject(pkg, language, variant);
  const first = shown(pkg, "firstTerm");
  const last = shown(pkg, "lastTerm");
  const count = shown(pkg, "count");
  const average = shown(pkg, "average");
  const difference = shown(pkg, "commonDifference");
  const targetRaw = String(pkg.parameters.values.targetExtreme ?? pkg.parameters.renderVariables.extremeLabel ?? "largest");
  const smallest = /small|least/i.test(targetRaw);
  const extreme = shown(pkg, "extremeValue") || (smallest ? first : last);

  if (language === "hi") {
    const target = smallest ? "सबसे छोटा मान" : "सबसे बड़ा मान";
    switch (pkg.solveMode) {
      case "findAverageOfConsecutiveSet":
      case "findAverageOfOddOrEvenSet": {
        const frames = [
          `${subject} ${first} से ${last} तक हैं। इनका औसत ज्ञात कीजिए।`,
          `${subject} का पहला मान ${first} और अंतिम मान ${last} है। औसत निकालिए।`,
          `${count} मान समान अंतर पर हैं; पहला ${first} और अंतिम ${last} है। उनका औसत क्या है?`,
          `${subject} ${first} से शुरू होते हैं और प्रत्येक अगला मान ${difference} अधिक है। औसत ज्ञात कीजिए।`,
          `${subject} के दोनों अंतिम मान ${first} और ${last} हैं। इनके बीच के सभी मान समान अंतर पर हैं। औसत निकालिए।`,
          `${first}, …, ${last} समान अंतर वाली सूची के प्रारंभ और अंत हैं। सूची का औसत ज्ञात कीजिए।`,
        ];
        return frames[variant]!;
      }
      case "findMiddleTermFromAverage": {
        const frames = [
          `${subject} समान अंतर पर हैं। कुल ${count} मानों का औसत ${average} है। बीच का मान ज्ञात कीजिए।`,
          `${count} समान-अंतर मानों का औसत ${average} है। मध्य में आने वाला मान क्या होगा?`,
          `${subject} की संख्या ${count} है और उनका औसत ${average} है। केंद्रीय मान निकालिए।`,
          `एक समान-अंतर सूची में ${count} मान हैं। सूची का औसत ${average} है। मध्य मान ज्ञात कीजिए।`,
          `${subject} सममित क्रम में हैं। यदि औसत ${average} है, तो बीच में कौन-सा मान आएगा?`,
          `${count} क्रमबद्ध मान समान अंतर पर हैं और औसत ${average} है। मध्यस्थ मान निकालिए।`,
        ];
        return frames[variant]!;
      }
      case "findExtremeFromAverageAndCount": {
        const frames = [
          `${subject} समान अंतर पर हैं। कुल ${count} मानों का औसत ${average} और अंतर ${difference} है। ${target} ज्ञात कीजिए।`,
          `${count} क्रमबद्ध मानों का औसत ${average} है। हर अगला मान ${difference} अधिक है। ${target} निकालिए।`,
          `${subject} की संख्या ${count} है। औसत ${average} तथा क्रमिक अंतर ${difference} होने पर ${target} क्या होगा?`,
          `एक समान-अंतर सूची में ${count} मान और औसत ${average} है। अंतर ${difference} है। ${target} ज्ञात कीजिए।`,
          `${subject} औसत ${average} के दोनों ओर समान रूप से फैले हैं। अंतर ${difference} और संख्या ${count} है। ${target} निकालिए।`,
          `${count} मानों की क्रमबद्ध सूची का औसत ${average} है और अंतर ${difference} है। सूची का ${target} बताइए।`,
        ];
        return frames[variant]!;
      }
      case "findTermCountFromAverageAndExtreme":
        return `${subject} समान अंतर पर हैं। औसत ${average}, ${target} ${extreme} और क्रमिक अंतर ${difference} है। कुल मानों की संख्या ज्ञात कीजिए।`;
      case "findCommonDifferenceFromAverageCountAndExtreme":
        return `${subject} समान अंतर पर हैं। कुल ${count} मानों का औसत ${average} है और ${target} ${extreme} है। दो क्रमिक मानों का अंतर ज्ञात कीजिए।`;
      default:
        return pkg.stem;
    }
  }

  const target = smallest ? "ਸਭ ਤੋਂ ਛੋਟਾ ਮੁੱਲ" : "ਸਭ ਤੋਂ ਵੱਡਾ ਮੁੱਲ";
  switch (pkg.solveMode) {
    case "findAverageOfConsecutiveSet":
    case "findAverageOfOddOrEvenSet": {
      const frames = [
        `${subject} ${first} ਤੋਂ ${last} ਤੱਕ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।`,
        `${subject} ਦਾ ਪਹਿਲਾ ਮੁੱਲ ${first} ਅਤੇ ਆਖਰੀ ਮੁੱਲ ${last} ਹੈ। ਔਸਤ ਕੱਢੋ।`,
        `${count} ਮੁੱਲ ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ; ਪਹਿਲਾ ${first} ਅਤੇ ਆਖਰੀ ${last} ਹੈ। ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ਕੀ ਹੈ?`,
        `${subject} ${first} ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੇ ਹਨ ਅਤੇ ਹਰ ਅਗਲਾ ਮੁੱਲ ${difference} ਵੱਧ ਹੈ। ਔਸਤ ਪਤਾ ਕਰੋ।`,
        `${subject} ਦੇ ਦੋਵੇਂ ਅੰਤਲੇ ਮੁੱਲ ${first} ਅਤੇ ${last} ਹਨ। ਵਿਚਕਾਰਲੇ ਸਾਰੇ ਮੁੱਲ ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ। ਔਸਤ ਕੱਢੋ।`,
        `${first}, …, ${last} ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੀ ਸੂਚੀ ਦੀ ਸ਼ੁਰੂਆਤ ਅਤੇ ਅੰਤ ਹਨ। ਸੂਚੀ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।`,
      ];
      return frames[variant]!;
    }
    case "findMiddleTermFromAverage": {
      const frames = [
        `${subject} ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ। ਕੁੱਲ ${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${average} ਹੈ। ਵਿਚਕਾਰਲਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
        `${count} ਬਰਾਬਰ-ਅੰਤਰ ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${average} ਹੈ। ਮੱਧ ਵਿੱਚ ਆਉਣ ਵਾਲਾ ਮੁੱਲ ਕੀ ਹੋਵੇਗਾ?`,
        `${subject} ਦੀ ਗਿਣਤੀ ${count} ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ${average} ਹੈ। ਕੇਂਦਰੀ ਮੁੱਲ ਕੱਢੋ।`,
        `ਇੱਕ ਬਰਾਬਰ-ਅੰਤਰ ਸੂਚੀ ਵਿੱਚ ${count} ਮੁੱਲ ਹਨ। ਸੂਚੀ ਦੀ ਔਸਤ ${average} ਹੈ। ਮੱਧਲਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
        `${subject} ਸਮਮਿਤ ਕ੍ਰਮ ਵਿੱਚ ਹਨ। ਜੇ ਔਸਤ ${average} ਹੈ, ਤਾਂ ਵਿਚਕਾਰ ਕਿਹੜਾ ਮੁੱਲ ਆਵੇਗਾ?`,
        `${count} ਤਰਤੀਬਵਾਰ ਮੁੱਲ ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ ਅਤੇ ਔਸਤ ${average} ਹੈ। ਮੱਧਵਰਤੀ ਮੁੱਲ ਕੱਢੋ।`,
      ];
      return frames[variant]!;
    }
    case "findExtremeFromAverageAndCount": {
      const frames = [
        `${subject} ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ। ਕੁੱਲ ${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${average} ਅਤੇ ਅੰਤਰ ${difference} ਹੈ। ${target} ਪਤਾ ਕਰੋ।`,
        `${count} ਤਰਤੀਬਵਾਰ ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${average} ਹੈ। ਹਰ ਅਗਲਾ ਮੁੱਲ ${difference} ਵੱਧ ਹੈ। ${target} ਕੱਢੋ।`,
        `${subject} ਦੀ ਗਿਣਤੀ ${count} ਹੈ। ਔਸਤ ${average} ਅਤੇ ਲਗਾਤਾਰ ਅੰਤਰ ${difference} ਹੋਣ ਉੱਤੇ ${target} ਕੀ ਹੋਵੇਗਾ?`,
        `ਇੱਕ ਬਰਾਬਰ-ਅੰਤਰ ਸੂਚੀ ਵਿੱਚ ${count} ਮੁੱਲ ਅਤੇ ਔਸਤ ${average} ਹੈ। ਅੰਤਰ ${difference} ਹੈ। ${target} ਪਤਾ ਕਰੋ।`,
        `${subject} ਔਸਤ ${average} ਦੇ ਦੋਵੇਂ ਪਾਸੇ ਇੱਕਸਾਰ ਫੈਲੇ ਹਨ। ਅੰਤਰ ${difference} ਅਤੇ ਗਿਣਤੀ ${count} ਹੈ। ${target} ਕੱਢੋ।`,
        `${count} ਮੁੱਲਾਂ ਦੀ ਤਰਤੀਬਵਾਰ ਸੂਚੀ ਦੀ ਔਸਤ ${average} ਹੈ ਅਤੇ ਅੰਤਰ ${difference} ਹੈ। ਸੂਚੀ ਦਾ ${target} ਦੱਸੋ।`,
      ];
      return frames[variant]!;
    }
    case "findTermCountFromAverageAndExtreme":
      return `${subject} ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ। ਔਸਤ ${average}, ${target} ${extreme} ਅਤੇ ਲਗਾਤਾਰ ਅੰਤਰ ${difference} ਹੈ। ਕੁੱਲ ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`;
    case "findCommonDifferenceFromAverageCountAndExtreme":
      return `${subject} ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ। ਕੁੱਲ ${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${average} ਹੈ ਅਤੇ ${target} ${extreme} ਹੈ। ਦੋ ਲਗਾਤਾਰ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।`;
    default:
      return pkg.stem;
  }
}

export function applyAvg001LocalizedStemQualityRefinement(
  pkg: Avg001QuestionPackage,
  language: PilotLanguage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId === "AVG-CP-003" && isCp003AgeQuestion(pkg)) {
    return pkg;
  }
  if (pkg.canonicalProblemId === "AVG-CP-002") {
    return { ...pkg, stem: cp002Stem(pkg, language) };
  }
  return applyAvg001LocalizedStemQuality(pkg, language);
}
