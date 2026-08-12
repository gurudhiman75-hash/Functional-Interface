import type { ProbabilityNativeLanguage } from "../multilingual-foundation";
import type { ProbabilityQuestion } from "./types";
import { renderNativeStudentFacingStem as renderBaseNativeStem } from "./native-student-facing-renderer";
import { rational, rationalText } from "./rational";

const num = (source: ProbabilityQuestion, key: string, fallback = 0): number => {
  const value = source.parameters[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};

const text = (source: ProbabilityQuestion, key: string, fallback = ""): string => {
  const value = source.parameters[key];
  return typeof value === "string" ? value : fallback;
};

const frac = (a: number | bigint, b: number | bigint): string => rationalText(rational(a, b));
const tidy = (value: string): string => value.replace(/\s+/gu, " ").replace(/\s+([?.!,।])/gu, "$1").trim();

function qlNumber(source: ProbabilityQuestion): number {
  const match = source.questionLanguageId.match(/(\d+)$/u);
  return match ? Number(match[1]) : 0;
}

function variant(source: ProbabilityQuestion, count: number): number {
  return qlNumber(source) % count;
}

type NativeObjectContext = Readonly<{
  container: string;
  singular: string;
  plural: string;
  redBlueComposition: (red: number, blue: number) => string;
  oneSelected: string;
  oneSelectedAndReplaced: string;
  twoSelectedWithoutReplacement: string;
  selectedTogether: (draw: number) => string;
  bothSelectedRed: string;
  sameColour: string;
  differentColours: string;
  redFirstBlueSecond: string;
  atLeastOneRed: string;
  noneRed: string;
}>;

function objectContext(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): NativeObjectContext {
  const index = variant(source, 4);
  if (language === "hi") {
    if (index === 0) return {
      container: "एक बैग",
      singular: "गेंद",
      plural: "गेंदें",
      redBlueComposition: (red, blue) => `${red} लाल और ${blue} नीली गेंदें`,
      oneSelected: "एक गेंद यादृच्छिक रूप से निकाली जाती है",
      oneSelectedAndReplaced: "एक गेंद निकालकर वापस रख दी जाती है, फिर दूसरी गेंद निकाली जाती है",
      twoSelectedWithoutReplacement: "दो गेंदें एक के बाद एक बिना वापस रखे निकाली जाती हैं",
      selectedTogether: (draw) => `${draw} गेंदें एक साथ बिना वापस रखे निकाली जाती हैं`,
      bothSelectedRed: "दोनों गेंदों के लाल होने",
      sameColour: "दोनों गेंदों के एक ही रंग की होने",
      differentColours: "दोनों गेंदों के अलग-अलग रंग की होने",
      redFirstBlueSecond: "पहले लाल और फिर नीली गेंद निकलने",
      atLeastOneRed: "कम-से-कम एक लाल गेंद निकलने",
      noneRed: "एक भी लाल गेंद न निकलने",
    };
    if (index === 1) return {
      container: "एक जार",
      singular: "कंचा",
      plural: "कंचे",
      redBlueComposition: (red, blue) => `${red} लाल और ${blue} नीले कंचे`,
      oneSelected: "एक कंचा यादृच्छिक रूप से चुना जाता है",
      oneSelectedAndReplaced: "एक कंचा चुनकर वापस रख दिया जाता है, फिर दूसरा कंचा चुना जाता है",
      twoSelectedWithoutReplacement: "दो कंचे एक के बाद एक बिना वापस रखे चुने जाते हैं",
      selectedTogether: (draw) => `${draw} कंचे एक साथ बिना वापस रखे चुने जाते हैं`,
      bothSelectedRed: "दोनों चुने गए कंचों के लाल होने",
      sameColour: "दोनों कंचों के एक ही रंग के होने",
      differentColours: "दोनों कंचों के अलग-अलग रंग के होने",
      redFirstBlueSecond: "पहले लाल और फिर नीला कंचा मिलने",
      atLeastOneRed: "कम-से-कम एक लाल कंचा मिलने",
      noneRed: "एक भी लाल कंचा न मिलने",
    };
    if (index === 2) return {
      container: "एक बॉक्स",
      singular: "पेन",
      plural: "पेन",
      redBlueComposition: (red, blue) => `${red} लाल और ${blue} नीले पेन`,
      oneSelected: "एक पेन यादृच्छिक रूप से चुना जाता है",
      oneSelectedAndReplaced: "एक पेन चुनकर वापस रख दिया जाता है, फिर दूसरा पेन चुना जाता है",
      twoSelectedWithoutReplacement: "दो पेन एक के बाद एक बिना वापस रखे चुने जाते हैं",
      selectedTogether: (draw) => `${draw} पेन एक साथ बिना वापस रखे चुने जाते हैं`,
      bothSelectedRed: "दोनों चुने गए पेन के लाल होने",
      sameColour: "दोनों पेन के एक ही रंग के होने",
      differentColours: "दोनों पेन के अलग-अलग रंग के होने",
      redFirstBlueSecond: "पहले लाल और फिर नीला पेन मिलने",
      atLeastOneRed: "कम-से-कम एक लाल पेन मिलने",
      noneRed: "एक भी लाल पेन न मिलने",
    };
    return {
      container: "एक पाउच",
      singular: "रंगीन पत्थर",
      plural: "रंगीन पत्थर",
      redBlueComposition: (red, blue) => `${red} लाल और ${blue} नीले रंगीन पत्थर`,
      oneSelected: "एक रंगीन पत्थर यादृच्छिक रूप से निकाला जाता है",
      oneSelectedAndReplaced: "एक रंगीन पत्थर निकालकर वापस रख दिया जाता है, फिर दूसरा रंगीन पत्थर निकाला जाता है",
      twoSelectedWithoutReplacement: "दो रंगीन पत्थर एक के बाद एक बिना वापस रखे निकाले जाते हैं",
      selectedTogether: (draw) => `${draw} रंगीन पत्थर एक साथ बिना वापस रखे निकाले जाते हैं`,
      bothSelectedRed: "दोनों चुने गए रंगीन पत्थरों के लाल होने",
      sameColour: "दोनों रंगीन पत्थरों के एक ही रंग के होने",
      differentColours: "दोनों रंगीन पत्थरों के अलग-अलग रंग के होने",
      redFirstBlueSecond: "पहले लाल और फिर नीला रंगीन पत्थर मिलने",
      atLeastOneRed: "कम-से-कम एक लाल रंगीन पत्थर मिलने",
      noneRed: "एक भी लाल रंगीन पत्थर न मिलने",
    };
  }

  if (index === 0) return {
    container: "ਇੱਕ ਬੈਗ",
    singular: "ਗੇਂਦ",
    plural: "ਗੇਂਦਾਂ",
    redBlueComposition: (red, blue) => `${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ`,
    oneSelected: "ਇੱਕ ਗੇਂਦ ਬੇਤਰਤੀਬੀ ਨਾਲ ਕੱਢੀ ਜਾਂਦੀ ਹੈ",
    oneSelectedAndReplaced: "ਇੱਕ ਗੇਂਦ ਕੱਢ ਕੇ ਵਾਪਸ ਰੱਖ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ, ਫਿਰ ਦੂਜੀ ਗੇਂਦ ਕੱਢੀ ਜਾਂਦੀ ਹੈ",
    twoSelectedWithoutReplacement: "ਦੋ ਗੇਂਦਾਂ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ",
    selectedTogether: (draw) => `${draw} ਗੇਂਦਾਂ ਇਕੱਠੀਆਂ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ`,
    bothSelectedRed: "ਦੋਵੇਂ ਗੇਂਦਾਂ ਦੇ ਲਾਲ ਹੋਣ",
    sameColour: "ਦੋਵੇਂ ਗੇਂਦਾਂ ਦੇ ਇੱਕੋ ਰੰਗ ਦੀਆਂ ਹੋਣ",
    differentColours: "ਦੋਵੇਂ ਗੇਂਦਾਂ ਦੇ ਵੱਖ-ਵੱਖ ਰੰਗ ਦੀਆਂ ਹੋਣ",
    redFirstBlueSecond: "ਪਹਿਲਾਂ ਲਾਲ ਅਤੇ ਫਿਰ ਨੀਲੀ ਗੇਂਦ ਨਿਕਲਣ",
    atLeastOneRed: "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਲ ਗੇਂਦ ਨਿਕਲਣ",
    noneRed: "ਇੱਕ ਵੀ ਲਾਲ ਗੇਂਦ ਨਾ ਨਿਕਲਣ",
  };
  if (index === 1) return {
    container: "ਇੱਕ ਜਾਰ",
    singular: "ਕੰਚਾ",
    plural: "ਕੰਚੇ",
    redBlueComposition: (red, blue) => `${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੇ ਕੰਚੇ`,
    oneSelected: "ਇੱਕ ਕੰਚਾ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ",
    oneSelectedAndReplaced: "ਇੱਕ ਕੰਚਾ ਚੁਣ ਕੇ ਵਾਪਸ ਰੱਖ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ, ਫਿਰ ਦੂਜਾ ਕੰਚਾ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ",
    twoSelectedWithoutReplacement: "ਦੋ ਕੰਚੇ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਚੁਣੇ ਜਾਂਦੇ ਹਨ",
    selectedTogether: (draw) => `${draw} ਕੰਚੇ ਇਕੱਠੇ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਚੁਣੇ ਜਾਂਦੇ ਹਨ`,
    bothSelectedRed: "ਦੋਵੇਂ ਚੁਣੇ ਕੰਚਿਆਂ ਦੇ ਲਾਲ ਹੋਣ",
    sameColour: "ਦੋਵੇਂ ਕੰਚਿਆਂ ਦੇ ਇੱਕੋ ਰੰਗ ਦੇ ਹੋਣ",
    differentColours: "ਦੋਵੇਂ ਕੰਚਿਆਂ ਦੇ ਵੱਖ-ਵੱਖ ਰੰਗ ਦੇ ਹੋਣ",
    redFirstBlueSecond: "ਪਹਿਲਾਂ ਲਾਲ ਅਤੇ ਫਿਰ ਨੀਲਾ ਕੰਚਾ ਮਿਲਣ",
    atLeastOneRed: "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਲ ਕੰਚਾ ਮਿਲਣ",
    noneRed: "ਇੱਕ ਵੀ ਲਾਲ ਕੰਚਾ ਨਾ ਮਿਲਣ",
  };
  if (index === 2) return {
    container: "ਇੱਕ ਬਾਕਸ",
    singular: "ਪੈਨ",
    plural: "ਪੈਨ",
    redBlueComposition: (red, blue) => `${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੇ ਪੈਨ`,
    oneSelected: "ਇੱਕ ਪੈਨ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ",
    oneSelectedAndReplaced: "ਇੱਕ ਪੈਨ ਚੁਣ ਕੇ ਵਾਪਸ ਰੱਖ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ, ਫਿਰ ਦੂਜਾ ਪੈਨ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ",
    twoSelectedWithoutReplacement: "ਦੋ ਪੈਨ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਚੁਣੇ ਜਾਂਦੇ ਹਨ",
    selectedTogether: (draw) => `${draw} ਪੈਨ ਇਕੱਠੇ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਚੁਣੇ ਜਾਂਦੇ ਹਨ`,
    bothSelectedRed: "ਦੋਵੇਂ ਚੁਣੇ ਪੈਨਾਂ ਦੇ ਲਾਲ ਹੋਣ",
    sameColour: "ਦੋਵੇਂ ਪੈਨਾਂ ਦੇ ਇੱਕੋ ਰੰਗ ਦੇ ਹੋਣ",
    differentColours: "ਦੋਵੇਂ ਪੈਨਾਂ ਦੇ ਵੱਖ-ਵੱਖ ਰੰਗ ਦੇ ਹੋਣ",
    redFirstBlueSecond: "ਪਹਿਲਾਂ ਲਾਲ ਅਤੇ ਫਿਰ ਨੀਲਾ ਪੈਨ ਮਿਲਣ",
    atLeastOneRed: "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਲ ਪੈਨ ਮਿਲਣ",
    noneRed: "ਇੱਕ ਵੀ ਲਾਲ ਪੈਨ ਨਾ ਮਿਲਣ",
  };
  return {
    container: "ਇੱਕ ਪਾਊਚ",
    singular: "ਰੰਗੀਨ ਪੱਥਰ",
    plural: "ਰੰਗੀਨ ਪੱਥਰ",
    redBlueComposition: (red, blue) => `${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੇ ਰੰਗੀਨ ਪੱਥਰ`,
    oneSelected: "ਇੱਕ ਰੰਗੀਨ ਪੱਥਰ ਬੇਤਰਤੀਬੀ ਨਾਲ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ",
    oneSelectedAndReplaced: "ਇੱਕ ਰੰਗੀਨ ਪੱਥਰ ਕੱਢ ਕੇ ਵਾਪਸ ਰੱਖ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ, ਫਿਰ ਦੂਜਾ ਰੰਗੀਨ ਪੱਥਰ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ",
    twoSelectedWithoutReplacement: "ਦੋ ਰੰਗੀਨ ਪੱਥਰ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੇ ਜਾਂਦੇ ਹਨ",
    selectedTogether: (draw) => `${draw} ਰੰਗੀਨ ਪੱਥਰ ਇਕੱਠੇ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਕੱਢੇ ਜਾਂਦੇ ਹਨ`,
    bothSelectedRed: "ਦੋਵੇਂ ਚੁਣੇ ਰੰਗੀਨ ਪੱਥਰਾਂ ਦੇ ਲਾਲ ਹੋਣ",
    sameColour: "ਦੋਵੇਂ ਰੰਗੀਨ ਪੱਥਰਾਂ ਦੇ ਇੱਕੋ ਰੰਗ ਦੇ ਹੋਣ",
    differentColours: "ਦੋਵੇਂ ਰੰਗੀਨ ਪੱਥਰਾਂ ਦੇ ਵੱਖ-ਵੱਖ ਰੰਗ ਦੇ ਹੋਣ",
    redFirstBlueSecond: "ਪਹਿਲਾਂ ਲਾਲ ਅਤੇ ਫਿਰ ਨੀਲਾ ਰੰਗੀਨ ਪੱਥਰ ਮਿਲਣ",
    atLeastOneRed: "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਲ ਰੰਗੀਨ ਪੱਥਰ ਮਿਲਣ",
    noneRed: "ਇੱਕ ਵੀ ਲਾਲ ਰੰਗੀਨ ਪੱਥਰ ਨਾ ਮਿਲਣ",
  };
}

function frequencyContext(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): NativeObjectContext {
  const order = [0, 2, 1, 3] as const;
  const targetIndex = order[variant(source, 4)]!;
  const synthetic = { ...source, questionLanguageId: `PRB-QL-${targetIndex}` } as ProbabilityQuestion;
  return objectContext(synthetic, language);
}

function renderObjectStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const mode = source.solveMode;
  const red = num(source, "red");
  const blue = num(source, "blue");
  const draw = num(source, "draw", 1);
  const exactRed = num(source, "exactRed", 1);
  const context = objectContext(source, language);
  const composition = `${context.container} में ${context.redBlueComposition(red, blue)} हैं।`;
  const compositionPa = `${context.container} ਵਿੱਚ ${context.redBlueComposition(red, blue)} ਹਨ।`;
  const opening = language === "hi" ? composition : compositionPa;
  const probability = language === "hi" ? "प्रायिकता" : "ਸੰਭਾਵਨਾ";

  if (mode === "findSingleDrawColourProbability") {
    if (variant(source, 4) === 3) {
      const divisor = gcd(red, blue);
      const ratio = `${red / divisor}:${blue / divisor}`;
      return language === "hi"
        ? `एक पात्र में लाल और नीले ${context.plural} का अनुपात ${ratio} है। एक ${context.singular} यादृच्छिक रूप से चुना जाता है। उसके लाल होने की प्रायिकता क्या है?`
        : `ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ ਲਾਲ ਅਤੇ ਨੀਲੇ ${context.plural} ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ਇੱਕ ${context.singular} ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
    }
    return language === "hi"
      ? `${opening} ${context.oneSelected}। उसके लाल होने की ${probability} क्या है?`
      : `${opening} ${context.oneSelected}। ਉਸ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ${probability} ਕੀ ਹੈ?`;
  }

  if (mode === "findMissingObjectCountFromProbability") {
    return language === "hi"
      ? `${context.container} में कुल ${red + blue} ${context.plural} हैं। लाल ${context.singular} चुने जाने की प्रायिकता ${frac(red, red + blue)} है। लाल ${context.plural} की संख्या कितनी है?`
      : `${context.container} ਵਿੱਚ ਕੁੱਲ ${red + blue} ${context.plural} ਹਨ। ਲਾਲ ${context.singular} ਚੁਣੇ ਜਾਣ ਦੀ ਸੰਭਾਵਨਾ ${frac(red, red + blue)} ਹੈ। ਲਾਲ ${context.plural} ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`;
  }

  if (mode === "findSimultaneousSameTypeProbability") {
    return language === "hi"
      ? `${opening} ${context.selectedTogether(draw)}। सभी चुने गए ${context.plural} के एक ही रंग के होने की प्रायिकता क्या है?`
      : `${opening} ${context.selectedTogether(draw)}। ਸਾਰੇ ਚੁਣੇ ${context.plural} ਦੇ ਇੱਕੋ ਰੰਗ ਦੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  }

  if (mode === "findSimultaneousDifferentTypeProbability") {
    if (draw === 2) return language === "hi"
      ? `${opening} दो ${context.plural} एक साथ बिना वापस रखे चुने जाते हैं। एक लाल और एक नीला ${context.singular} मिलने की प्रायिकता क्या है?`
      : `${opening} ਦੋ ${context.plural} ਇਕੱਠੇ ਬਿਨਾਂ ਵਾਪਸ ਰੱਖੇ ਚੁਣੇ ਜਾਂਦੇ ਹਨ। ਇੱਕ ਲਾਲ ਅਤੇ ਇੱਕ ਨੀਲਾ ${context.singular} ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
    return language === "hi"
      ? `${opening} ${context.selectedTogether(draw)}। चुने गए ${context.plural} में दोनों रंग मिलने की प्रायिकता क्या है?`
      : `${opening} ${context.selectedTogether(draw)}। ਚੁਣੇ ${context.plural} ਵਿੱਚ ਦੋਵੇਂ ਰੰਗ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  }

  if (["findExactCompositionProbability", "findSelectionProbabilityUsingCombination"].includes(mode)) {
    return language === "hi"
      ? `${opening} ${context.selectedTogether(draw)}। चुने गए ${context.plural} में ठीक ${exactRed} लाल ${context.singular} होने की प्रायिकता क्या है?`
      : `${opening} ${context.selectedTogether(draw)}। ਚੁਣੇ ${context.plural} ਵਿੱਚ ਠੀਕ ${exactRed} ਲਾਲ ${context.singular} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  }

  if (mode === "findNoObjectOfTypeProbability") {
    return language === "hi"
      ? `${opening} ${context.selectedTogether(draw)}। ${context.noneRed} की प्रायिकता क्या है?`
      : `${opening} ${context.selectedTogether(draw)}। ${context.noneRed} ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  }
  if (mode === "findAtLeastOneObjectOfType") {
    return language === "hi"
      ? `${opening} ${context.selectedTogether(draw)}। ${context.atLeastOneRed} की प्रायिकता क्या है?`
      : `${opening} ${context.selectedTogether(draw)}। ${context.atLeastOneRed} ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  }
  if (["findSuccessiveIndependentProbability", "findWithReplacementProbability"].includes(mode)) {
    return language === "hi"
      ? `${opening} ${context.oneSelectedAndReplaced}। ${context.bothSelectedRed} की प्रायिकता क्या है?`
      : `${opening} ${context.oneSelectedAndReplaced}। ${context.bothSelectedRed} ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  }
  if (["findSuccessiveDependentProbability", "findWithoutReplacementProbability"].includes(mode)) {
    return language === "hi"
      ? `${opening} ${context.twoSelectedWithoutReplacement}। ${context.bothSelectedRed} की प्रायिकता क्या है?`
      : `${opening} ${context.twoSelectedWithoutReplacement}। ${context.bothSelectedRed} ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  }
  if (mode === "findOrderedDrawSequenceProbability") {
    return language === "hi"
      ? `${opening} ${context.twoSelectedWithoutReplacement}। ${context.redFirstBlueSecond} की प्रायिकता क्या है?`
      : `${opening} ${context.twoSelectedWithoutReplacement}। ${context.redFirstBlueSecond} ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  }
  if (mode === "findSameTypeInSuccessiveDraws") {
    return language === "hi"
      ? `${opening} ${context.twoSelectedWithoutReplacement}। ${context.sameColour} की प्रायिकता क्या है?`
      : `${opening} ${context.twoSelectedWithoutReplacement}। ${context.sameColour} ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  }
  if (mode === "findDifferentTypesInSuccessiveDraws") {
    return language === "hi"
      ? `${opening} ${context.twoSelectedWithoutReplacement}। ${context.differentColours} की प्रायिकता क्या है?`
      : `${opening} ${context.twoSelectedWithoutReplacement}। ${context.differentColours} ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  }
  if (mode === "findAtLeastOneAcrossIndependentStages") {
    return language === "hi"
      ? `${opening} दो बार चयन किया जाता है और हर बार वस्तु वापस रख दी जाती है। ${context.atLeastOneRed} की प्रायिकता क्या है?`
      : `${opening} ਦੋ ਵਾਰ ਚੋਣ ਕੀਤੀ ਜਾਂਦੀ ਹੈ ਅਤੇ ਹਰ ਵਾਰ ਵਸਤੂ ਵਾਪਸ ਰੱਖ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ${context.atLeastOneRed} ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  }

  throw new Error(`Unhandled object-context mode ${mode}.`);
}

function gcd(left: number, right: number): number {
  let a = Math.abs(left), b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a || 1;
}

function renderFrequencyStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const red = num(source, "red"), blue = num(source, "blue"), green = num(source, "green");
  const target = text(source, "target", "red").toLowerCase();
  const context = frequencyContext(source, language);
  const targetHi: Record<string, string> = { red: "लाल", blue: "नीला", green: "हरा" };
  const targetPa: Record<string, string> = { red: "ਲਾਲ", blue: "ਨੀਲਾ", green: "ਹਰਾ" };
  if (language === "hi") {
    const composition = context.redBlueComposition(red, blue).replace(/ हैं$/u, "");
    const item = context.plural;
    return `${context.container} में ${red} लाल, ${blue} नीले और ${green} हरे ${item} हैं। ${context.oneSelected}। उसके ${targetHi[target] ?? target} होने की प्रायिकता क्या है?`;
  }
  return `${context.container} ਵਿੱਚ ${red} ਲਾਲ, ${blue} ਨੀਲੇ ਅਤੇ ${green} ਹਰੇ ${context.plural} ਹਨ। ${context.oneSelected}। ਉਸ ਦੇ ${targetPa[target] ?? target} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
}

function propertyCondition(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const property = text(source, "property");
  if (language === "hi") {
    if (property === "EVEN") return "सम";
    if (property === "PRIME") return "अभाज्य";
    if (property === "COMPOSITE") return "संयोज्य";
    if (property === "GREATER_THAN") return `${num(source, "threshold")} से बड़ा`;
    if (property === "LESS_THAN") return `${num(source, "threshold")} से छोटा`;
    if (property === "DIVISIBLE") return `${num(source, "divisor")} से विभाज्य`;
  } else {
    if (property === "EVEN") return "ਜੋੜੀ";
    if (property === "PRIME") return "ਅਭਾਜ";
    if (property === "COMPOSITE") return "ਸੰਯੁਕਤ";
    if (property === "GREATER_THAN") return `${num(source, "threshold")} ਤੋਂ ਵੱਡਾ`;
    if (property === "LESS_THAN") return `${num(source, "threshold")} ਤੋਂ ਛੋਟਾ`;
    if (property === "DIVISIBLE") return `${num(source, "divisor")} ਨਾਲ ਭਾਗਯੋਗ`;
  }
  throw new Error(`Unhandled number property ${property}.`);
}

function renderNumberTicketStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const lower = num(source, "lower", 1), upper = num(source, "upper");
  const condition = propertyCondition(source, language);
  return language === "hi"
    ? `${lower} से ${upper} तक क्रमांकित टिकटों को अच्छी तरह मिलाया जाता है और एक टिकट यादृच्छिक रूप से निकाला जाता है। उसके क्रमांक के ${condition} होने की प्रायिकता क्या है?`
    : `${lower} ਤੋਂ ${upper} ਤੱਕ ਨੰਬਰ ਲੱਗੇ ਟਿਕਟਾਂ ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਇੱਕ ਟਿਕਟ ਬੇਤਰਤੀਬੀ ਨਾਲ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ ਨੰਬਰ ਦੇ ${condition} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
}

function renderCertaintyStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const n = num(source, "n");
  const label = text(source, "eventLabel").trim().toLowerCase();
  const greater = label.match(/^an integer greater than (\d+)$/u);
  const less = label.match(/^an integer less than (\d+)$/u);
  const notExceeding = label.match(/^an integer not exceeding (\d+)$/u);
  const divisible = label.match(/^an integer divisible by (\d+)$/u);
  let condition: string;
  if (language === "hi") {
    if (greater) condition = `${greater[1]} से बड़ा`;
    else if (less) condition = `${less[1]} से छोटा`;
    else if (notExceeding) condition = `${notExceeding[1]} से अधिक न होने वाला`;
    else if (divisible) condition = `${divisible[1]} से विभाज्य`;
    else if (/^an? even integer$/u.test(label)) condition = "सम";
    else if (/^an? odd integer$/u.test(label)) condition = "विषम";
    else if (/^an? prime integer$/u.test(label)) condition = "अभाज्य";
    else if (/^an? composite integer$/u.test(label)) condition = "संयोज्य";
    else throw new Error(`Unhandled certainty event label ${label}.`);
    return `1 से ${n} तक के पूर्णांकों में से एक पूर्णांक यादृच्छिक रूप से चुना जाता है। चुने गए पूर्णांक के ${condition} होने की प्रायिकता क्या है?`;
  }
  if (greater) condition = `${greater[1]} ਤੋਂ ਵੱਡਾ`;
  else if (less) condition = `${less[1]} ਤੋਂ ਛੋਟਾ`;
  else if (notExceeding) condition = `${notExceeding[1]} ਤੋਂ ਵੱਧ ਨਾ ਹੋਣ ਵਾਲਾ`;
  else if (divisible) condition = `${divisible[1]} ਨਾਲ ਭਾਗਯੋਗ`;
  else if (/^an? even integer$/u.test(label)) condition = "ਜੋੜੀ";
  else if (/^an? odd integer$/u.test(label)) condition = "ਬੇਜੋੜ";
  else if (/^an? prime integer$/u.test(label)) condition = "ਅਭਾਜ";
  else if (/^an? composite integer$/u.test(label)) condition = "ਸੰਯੁਕਤ";
  else throw new Error(`Unhandled certainty event label ${label}.`);
  return `1 ਤੋਂ ${n} ਤੱਕ ਦੇ ਪੂਰਨ ਅੰਕਾਂ ਵਿੱਚੋਂ ਇੱਕ ਪੂਰਨ ਅੰਕ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਚੁਣੇ ਗਏ ਪੂਰਨ ਅੰਕ ਦੇ ${condition} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
}

type GroupContext = Readonly<{ kind: "SUBJECTS" | "SPORTS"; first: string; second: string; people: string; person: string; action: string }>;

function groupContext(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): GroupContext {
  const index = variant(source, 4);
  if (language === "hi") {
    if (index === 0) return { kind: "SUBJECTS", first: "गणित", second: "अंग्रेज़ी", people: "विद्यार्थी", person: "विद्यार्थी", action: "उत्तीर्ण" };
    if (index === 1) return { kind: "SUBJECTS", first: "क्वांटिटेटिव एप्टीट्यूड", second: "रीजनिंग", people: "अभ्यर्थी", person: "अभ्यर्थी", action: "उत्तीर्ण" };
    if (index === 2) return { kind: "SPORTS", first: "क्रिकेट", second: "फुटबॉल", people: "विद्यार्थी", person: "विद्यार्थी", action: "खेलते" };
    return { kind: "SUBJECTS", first: "सेक्शन A", second: "सेक्शन B", people: "अभ्यर्थी", person: "अभ्यर्थी", action: "उत्तीर्ण" };
  }
  if (index === 0) return { kind: "SUBJECTS", first: "ਗਣਿਤ", second: "ਅੰਗਰੇਜ਼ੀ", people: "ਵਿਦਿਆਰਥੀ", person: "ਵਿਦਿਆਰਥੀ", action: "ਪਾਸ" };
  if (index === 1) return { kind: "SUBJECTS", first: "ਕੁਆਂਟੀਟੇਟਿਵ ਐਪਟੀਟਿਊਡ", second: "ਰੀਜ਼ਨਿੰਗ", people: "ਉਮੀਦਵਾਰ", person: "ਉਮੀਦਵਾਰ", action: "ਪਾਸ" };
  if (index === 2) return { kind: "SPORTS", first: "ਕ੍ਰਿਕਟ", second: "ਫੁੱਟਬਾਲ", people: "ਵਿਦਿਆਰਥੀ", person: "ਵਿਦਿਆਰਥੀ", action: "ਖੇਡਦੇ" };
  return { kind: "SUBJECTS", first: "ਸੈਕਸ਼ਨ A", second: "ਸੈਕਸ਼ਨ B", people: "ਉਮੀਦਵਾਰ", person: "ਉਮੀਦਵਾਰ", action: "ਪਾਸ" };
}

function renderGroupStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const context = groupContext(source, language);
  const total = num(source, "total"), a = num(source, "aCount"), b = num(source, "bCount"), both = num(source, "overlap");
  const mode = source.solveMode;
  const union = a + b - both;

  if (language === "hi") {
    if (context.kind === "SPORTS") {
      const facts = `${total} विद्यार्थियों के एक समूह में ${a} विद्यार्थी ${context.first} खेलते हैं, ${b} विद्यार्थी ${context.second} खेलते हैं और ${both} विद्यार्थी दोनों खेल खेलते हैं।`;
      if (mode === "findIntersectionProbability") return `${total} विद्यार्थियों के एक समूह में ${both} विद्यार्थी ${context.first} और ${context.second} दोनों खेलते हैं। यादृच्छिक रूप से चुने गए विद्यार्थी के दोनों खेल खेलने की प्रायिकता क्या है?`;
      if (mode === "findUnionProbability") return `${facts} यादृच्छिक रूप से चुने गए विद्यार्थी के कम-से-कम एक खेल खेलने की प्रायिकता क्या है?`;
      if (["findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability"].includes(mode)) return `${facts} यादृच्छिक रूप से चुने गए विद्यार्थी के ठीक एक खेल खेलने की प्रायिकता क्या है?`;
      if (mode === "findNeitherEventProbability") return `${facts} यादृच्छिक रूप से चुने गए विद्यार्थी के कोई भी खेल न खेलने की प्रायिकता क्या है?`;
      return `${total} विद्यार्थियों के एक समूह के लिए P(${context.first}) = ${frac(a, total)}, P(${context.second}) = ${frac(b, total)} और P(${context.first} या ${context.second}) = ${frac(union, total)} है। P(${context.first} और ${context.second}) ज्ञात करें।`;
    }
    const facts = `${total} ${context.people} के एक समूह में ${a} ${context.first} में ${context.action} हैं, ${b} ${context.second} में ${context.action} हैं और ${both} दोनों में ${context.action} हैं।`;
    if (mode === "findIntersectionProbability") return `${total} ${context.people} के एक समूह में ${both} ${context.first} और ${context.second} दोनों में ${context.action} हैं। यादृच्छिक रूप से चुने गए ${context.person} के दोनों शर्तें पूरी करने की प्रायिकता क्या है?`;
    if (mode === "findUnionProbability") return `${facts} यादृच्छिक रूप से चुने गए ${context.person} के कम-से-कम एक शर्त पूरी करने की प्रायिकता क्या है?`;
    if (["findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability"].includes(mode)) return `${facts} यादृच्छिक रूप से चुने गए ${context.person} के ठीक एक शर्त पूरी करने की प्रायिकता क्या है?`;
    if (mode === "findNeitherEventProbability") return `${facts} यादृच्छिक रूप से चुने गए ${context.person} के कोई भी शर्त पूरी न करने की प्रायिकता क्या है?`;
    return `${total} ${context.people} के एक समूह के लिए P(${context.first}) = ${frac(a, total)}, P(${context.second}) = ${frac(b, total)} और P(${context.first} या ${context.second}) = ${frac(union, total)} है। P(${context.first} और ${context.second}) ज्ञात करें।`;
  }

  if (context.kind === "SPORTS") {
    const facts = `${total} ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ${a} ਵਿਦਿਆਰਥੀ ${context.first} ਖੇਡਦੇ ਹਨ, ${b} ਵਿਦਿਆਰਥੀ ${context.second} ਖੇਡਦੇ ਹਨ ਅਤੇ ${both} ਵਿਦਿਆਰਥੀ ਦੋਵੇਂ ਖੇਡ ਖੇਡਦੇ ਹਨ।`;
    if (mode === "findIntersectionProbability") return `${total} ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ${both} ਵਿਦਿਆਰਥੀ ${context.first} ਅਤੇ ${context.second} ਦੋਵੇਂ ਖੇਡਦੇ ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਦੋਵੇਂ ਖੇਡ ਖੇਡਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
    if (mode === "findUnionProbability") return `${facts} ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਖੇਡ ਖੇਡਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
    if (["findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability"].includes(mode)) return `${facts} ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਠੀਕ ਇੱਕ ਖੇਡ ਖੇਡਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
    if (mode === "findNeitherEventProbability") return `${facts} ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਕੋਈ ਵੀ ਖੇਡ ਨਾ ਖੇਡਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
    return `${total} ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਇੱਕ ਸਮੂਹ ਲਈ P(${context.first}) = ${frac(a, total)}, P(${context.second}) = ${frac(b, total)} ਅਤੇ P(${context.first} ਜਾਂ ${context.second}) = ${frac(union, total)} ਹੈ। P(${context.first} ਅਤੇ ${context.second}) ਕੱਢੋ।`;
  }
  const facts = `${total} ${context.people} ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ${a} ${context.first} ਵਿੱਚ ${context.action} ਹਨ, ${b} ${context.second} ਵਿੱਚ ${context.action} ਹਨ ਅਤੇ ${both} ਦੋਵਾਂ ਵਿੱਚ ${context.action} ਹਨ।`;
  if (mode === "findIntersectionProbability") return `${total} ${context.people} ਦੇ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ${both} ${context.first} ਅਤੇ ${context.second} ਦੋਵਾਂ ਵਿੱਚ ${context.action} ਹਨ। ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ${context.person} ਦੇ ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  if (mode === "findUnionProbability") return `${facts} ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ${context.person} ਦੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  if (["findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability"].includes(mode)) return `${facts} ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ${context.person} ਦੇ ਠੀਕ ਇੱਕ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  if (mode === "findNeitherEventProbability") return `${facts} ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ${context.person} ਦੇ ਕੋਈ ਵੀ ਸ਼ਰਤ ਪੂਰੀ ਨਾ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  return `${total} ${context.people} ਦੇ ਇੱਕ ਸਮੂਹ ਲਈ P(${context.first}) = ${frac(a, total)}, P(${context.second}) = ${frac(b, total)} ਅਤੇ P(${context.first} ਜਾਂ ${context.second}) = ${frac(union, total)} ਹੈ। P(${context.first} ਅਤੇ ${context.second}) ਕੱਢੋ।`;
}

function renderConditionalCountStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const total = num(source, "mathTotal"), both = num(source, "both");
  const alternate = variant(source, 2) === 1;
  if (language === "hi") {
    if (alternate) return `क्वांटिटेटिव एप्टीट्यूड में उत्तीर्ण ${total} अभ्यर्थियों में से ${both} रीजनिंग में भी उत्तीर्ण हैं। इन ${total} अभ्यर्थियों में से एक को यादृच्छिक रूप से चुना जाता है। चुने गए अभ्यर्थी के रीजनिंग में भी उत्तीर्ण होने की प्रायिकता क्या है?`;
    return `गणित में उत्तीर्ण ${total} विद्यार्थियों में से ${both} अंग्रेज़ी में भी उत्तीर्ण हैं। इन ${total} विद्यार्थियों में से एक को यादृच्छिक रूप से चुना जाता है। चुने गए विद्यार्थी के अंग्रेज़ी में भी उत्तीर्ण होने की प्रायिकता क्या है?`;
  }
  if (alternate) return `ਕੁਆਂਟੀਟੇਟਿਵ ਐਪਟੀਟਿਊਡ ਵਿੱਚ ਪਾਸ ${total} ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ${both} ਰੀਜ਼ਨਿੰਗ ਵਿੱਚ ਵੀ ਪਾਸ ਹਨ। ਇਨ੍ਹਾਂ ${total} ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਇੱਕ ਨੂੰ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ਰੀਜ਼ਨਿੰਗ ਵਿੱਚ ਵੀ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  return `ਗਣਿਤ ਵਿੱਚ ਪਾਸ ${total} ਵਿਦਿਆਰਥੀਆਂ ਵਿੱਚੋਂ ${both} ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਵੀ ਪਾਸ ਹਨ। ਇਨ੍ਹਾਂ ${total} ਵਿਦਿਆਰਥੀਆਂ ਵਿੱਚੋਂ ਇੱਕ ਨੂੰ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਚੁਣੇ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਵੀ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
}

function renderArrangementStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const people = num(source, "people");
  const apart = text(source, "relation", "TOGETHER") === "APART";
  if (source.solveMode === "findRandomArrangementPropertyProbability") {
    return language === "hi"
      ? `${people} अभ्यर्थी यादृच्छिक क्रम में एक पंक्ति में खड़े होते हैं। किसी एक निश्चित अभ्यर्थी के पहले स्थान पर होने की प्रायिकता क्या है?`
      : `${people} ਉਮੀਦਵਾਰ ਬੇਤਰਤੀਬ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹੇ ਹੁੰਦੇ ਹਨ। ਕਿਸੇ ਇੱਕ ਨਿਰਧਾਰਤ ਉਮੀਦਵਾਰ ਦੇ ਪਹਿਲੇ ਸਥਾਨ ਉੱਤੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
  }
  return language === "hi"
    ? `${people} अभ्यर्थी यादृच्छिक क्रम में एक पंक्ति में खड़े होते हैं। दो निश्चित अभ्यर्थियों के ${apart ? "एक-दूसरे के पास न होने" : "एक-दूसरे के पास होने"} की प्रायिकता क्या है?`
    : `${people} ਉਮੀਦਵਾਰ ਬੇਤਰਤੀਬ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹੇ ਹੁੰਦੇ ਹਨ। ਦੋ ਨਿਰਧਾਰਤ ਉਮੀਦਵਾਰਾਂ ਦੇ ${apart ? "ਇੱਕ-ਦੂਜੇ ਦੇ ਨਾਲ ਨਾ ਖੜ੍ਹੇ ਹੋਣ" : "ਇੱਕ-ਦੂਜੇ ਦੇ ਨਾਲ ਖੜ੍ਹੇ ਹੋਣ"} ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
}

function renderMutuallyExclusiveStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage, base: string): string {
  if (variant(source, 2) !== 1) return base;
  const pA = frac(num(source, "aNumerator"), num(source, "aDenominator", 1));
  const pB = frac(num(source, "bNumerator"), num(source, "bDenominator", 1));
  return language === "hi"
    ? `एक अभ्यर्थी को छात्रवृत्ति A या छात्रवृत्ति B में से कोई एक मिल सकती है, दोनों नहीं। यदि P(A) = ${pA} और P(B) = ${pB} है, तो अभ्यर्थी को कोई छात्रवृत्ति मिलने की प्रायिकता क्या है?`
    : `ਇੱਕ ਉਮੀਦਵਾਰ ਨੂੰ ਸਕਾਲਰਸ਼ਿਪ A ਜਾਂ ਸਕਾਲਰਸ਼ਿਪ B ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਮਿਲ ਸਕਦੀ ਹੈ, ਦੋਵੇਂ ਨਹੀਂ। ਜੇ P(A) = ${pA} ਅਤੇ P(B) = ${pB} ਹੈ, ਤਾਂ ਉਮੀਦਵਾਰ ਨੂੰ ਕੋਈ ਸਕਾਲਰਸ਼ਿਪ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
}

function renderIndependentStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage, base: string): string {
  if (variant(source, 2) !== 1) return base;
  const pA = frac(num(source, "aNumerator"), num(source, "aDenominator", 1));
  const pB = frac(num(source, "bNumerator"), num(source, "bDenominator", 1));
  return language === "hi"
    ? `एक मशीन के यांत्रिक परीक्षण में पास होने की प्रायिकता ${pA} और विद्युत परीक्षण में पास होने की प्रायिकता ${pB} है। दोनों परिणाम स्वतंत्र हैं। मशीन के दोनों परीक्षणों में पास होने की प्रायिकता क्या है?`
    : `ਇੱਕ ਮਸ਼ੀਨ ਦੇ ਮਕੈਨਿਕਲ ਟੈਸਟ ਵਿੱਚ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${pA} ਅਤੇ ਇਲੈਕਟ੍ਰਿਕਲ ਟੈਸਟ ਵਿੱਚ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${pB} ਹੈ। ਦੋਵੇਂ ਨਤੀਜੇ ਸੁਤੰਤਰ ਹਨ। ਮਸ਼ੀਨ ਦੇ ਦੋਵੇਂ ਟੈਸਟਾਂ ਵਿੱਚ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;
}

const OBJECT_MODES = new Set([
  "findSingleDrawColourProbability", "findMissingObjectCountFromProbability", "findSimultaneousSameTypeProbability",
  "findSimultaneousDifferentTypeProbability", "findExactCompositionProbability", "findSelectionProbabilityUsingCombination",
  "findNoObjectOfTypeProbability", "findAtLeastOneObjectOfType", "findSuccessiveIndependentProbability",
  "findWithReplacementProbability", "findSuccessiveDependentProbability", "findWithoutReplacementProbability",
  "findOrderedDrawSequenceProbability", "findSameTypeInSuccessiveDraws", "findDifferentTypesInSuccessiveDraws",
  "findAtLeastOneAcrossIndependentStages",
]);

const EVENT_GROUP_MODES = new Set([
  "findUnionProbability", "findIntersectionProbability", "findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability",
  "findNeitherEventProbability", "findMissingIntersectionOrUnionProbability",
]);

export function renderNativeExamStyleStem(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const base = renderBaseNativeStem(source, language);

  if (source.solveMode === "identifyImpossibleCertainOrPossibleEvent") return tidy(renderCertaintyStem(source, language));
  if (OBJECT_MODES.has(source.solveMode) && (source.solveMode !== "findSelectionProbabilityUsingCombination" || source.canonicalProblemId === "PRB-CP-005")) {
    return tidy(renderObjectStem(source, language));
  }
  if (source.solveMode === "findProbabilityFromSimpleFrequencyTable") return tidy(renderFrequencyStem(source, language));
  if (source.solveMode === "findNumberRangePropertyProbability") return tidy(renderNumberTicketStem(source, language));
  if (["findConditionalProbabilityByCounting", "findConditionalFromTwoWayTable"].includes(source.solveMode)) return tidy(renderConditionalCountStem(source, language));
  if (["findRandomArrangementPropertyProbability", "findTogetherOrApartProbability"].includes(source.solveMode)) return tidy(renderArrangementStem(source, language));
  if (EVENT_GROUP_MODES.has(source.solveMode)) return tidy(renderGroupStem(source, language));
  if (source.solveMode === "findMutuallyExclusiveUnion") return tidy(renderMutuallyExclusiveStem(source, language, base));
  if (source.solveMode === "findIndependentIntersection") return tidy(renderIndependentStem(source, language, base));

  return tidy(base);
}
