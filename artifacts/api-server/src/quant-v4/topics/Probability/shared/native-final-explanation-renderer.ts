import type { ProbabilityNativeLanguage } from "../multilingual-foundation";
import type { ProbabilityQuestion, ProbabilityVisual } from "./types";

type ObjectContext = "BALLS" | "MARBLES" | "PENS" | "STONES" | "NONE";

type ObjectWords = Readonly<{
  plural: string;
}>;

function objectContext(source: ProbabilityQuestion): ObjectContext {
  const stem = source.stem;
  if (/\bjar\b|\bmarbles?\b/iu.test(stem)) return "MARBLES";
  if (/\bbox\b.*\bpens?\b|\bpens?\b/iu.test(stem)) return "PENS";
  if (/\bpouch\b|\bcolou?red stones?\b/iu.test(stem)) return "STONES";
  if (/\bbag\b.*\bballs?\b|\bballs?\b/iu.test(stem)) return "BALLS";
  return "NONE";
}

function numberParameter(source: ProbabilityQuestion, key: string, fallback = 0): number {
  const value = source.parameters[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function wordsFor(context: ObjectContext, language: ProbabilityNativeLanguage): ObjectWords {
  if (language === "hi") {
    if (context === "MARBLES") return { plural: "कंचे" };
    if (context === "PENS") return { plural: "पेन" };
    if (context === "STONES") return { plural: "रंगीन पत्थर" };
    return { plural: "गेंदें" };
  }
  if (context === "MARBLES") return { plural: "ਕੰਚੇ" };
  if (context === "PENS") return { plural: "ਪੈਨ" };
  if (context === "STONES") return { plural: "ਰੰਗੀਨ ਪੱਥਰ" };
  return { plural: "ਗੇਂਦਾਂ" };
}

function polishHindiLine(line: string, context: ObjectContext): string {
  let value = line;
  if (context === "MARBLES") {
    value = value
      .replace(/बैग/gu, "जार")
      .replace(/गेंदों/gu, "कंचों")
      .replace(/गेंदें/gu, "कंचे")
      .replace(/गेंद/gu, "कंचा");
  } else if (context === "PENS") {
    value = value
      .replace(/बैग/gu, "बॉक्स")
      .replace(/गेंदों/gu, "पेनों")
      .replace(/गेंदें/gu, "पेन")
      .replace(/गेंद/gu, "पेन");
  } else if (context === "STONES") {
    value = value
      .replace(/बैग/gu, "पाउच")
      .replace(/गेंदों/gu, "रंगीन पत्थरों")
      .replace(/गेंदें/gu, "रंगीन पत्थर")
      .replace(/गेंद/gu, "रंगीन पत्थर");
  }

  return value
    .replace(/पुनःस्थापन/gu, "वापस रखने")
    .replace(/नमूना-स्थान/gu, "कुल संभावित परिणामों का समूह")
    .replace(/अज्ञात राशि/gu, "अज्ञात संख्या")
    .replace(/दो अलग पहचाने जाने वाले पासों/gu, "दो पासों")
    .replace(/चुनी पेन/gu, "चुने जाने वाले पेन")
    .replace(/चुनी कंचे/gu, "चुने जाने वाले कंचे")
    .replace(/चुनी रंगीन पत्थर/gu, "चुने जाने वाले रंगीन पत्थर")
    .replace(/चुनी गेंदें/gu, "चुनी जाने वाली गेंदें");
}

function polishPunjabiLine(line: string, context: ObjectContext): string {
  let value = line;
  if (context === "MARBLES") {
    value = value
      .replace(/ਬੈਗ/gu, "ਜਾਰ")
      .replace(/ਗੇਂਦਾਂ/gu, "ਕੰਚਿਆਂ")
      .replace(/ਗੇਂਦ/gu, "ਕੰਚਾ");
  } else if (context === "PENS") {
    value = value
      .replace(/ਬੈਗ/gu, "ਬਾਕਸ")
      .replace(/ਗੇਂਦਾਂ/gu, "ਪੈਨਾਂ")
      .replace(/ਗੇਂਦ/gu, "ਪੈਨ");
  } else if (context === "STONES") {
    value = value
      .replace(/ਬੈਗ/gu, "ਪਾਊਚ")
      .replace(/ਗੇਂਦਾਂ/gu, "ਰੰਗੀਨ ਪੱਥਰਾਂ")
      .replace(/ਗੇਂਦ/gu, "ਰੰਗੀਨ ਪੱਥਰ");
  }

  return value
    .replace(/ਪੁਨਰਸਥਾਪਨ/gu, "ਵਾਪਸ ਰੱਖਣ")
    .replace(/ਨਮੂਨਾ-ਅਵਕਾਸ/gu, "ਕੁੱਲ ਸੰਭਵ ਨਤੀਜਿਆਂ ਦਾ ਸਮੂਹ")
    .replace(/ਅਗਿਆਤ ਰਕਮ/gu, "ਅਗਿਆਤ ਗਿਣਤੀ")
    .replace(/ਦੋ ਵੱਖ ਪਛਾਣਯੋਗ ਪਾਸਿਆਂ/gu, "ਦੋ ਪਾਸਿਆਂ")
    .replace(/ਚੁਣੀਆਂ ਪੈਨਾਂ/gu, "ਚੁਣੇ ਜਾਣ ਵਾਲੇ ਪੈਨ")
    .replace(/ਚੁਣੀਆਂ ਕੰਚਿਆਂ/gu, "ਚੁਣੇ ਜਾਣ ਵਾਲੇ ਕੰਚੇ")
    .replace(/ਚੁਣੀਆਂ ਰੰਗੀਨ ਪੱਥਰਾਂ/gu, "ਚੁਣੇ ਜਾਣ ਵਾਲੇ ਰੰਗੀਨ ਪੱਥਰ");
}

function isObjectSimultaneousMode(source: ProbabilityQuestion, context: ObjectContext): boolean {
  if (context === "NONE") return false;
  return [
    "findSimultaneousSameTypeProbability",
    "findSimultaneousDifferentTypeProbability",
    "findExactCompositionProbability",
    "findSelectionProbabilityUsingCombination",
    "findNoObjectOfTypeProbability",
    "findAtLeastOneObjectOfType",
  ].includes(source.solveMode);
}

function isSuccessiveObjectMode(source: ProbabilityQuestion, context: ObjectContext): boolean {
  if (context === "NONE") return false;
  return [
    "findSuccessiveIndependentProbability",
    "findWithReplacementProbability",
    "findSuccessiveDependentProbability",
    "findWithoutReplacementProbability",
    "findOrderedDrawSequenceProbability",
    "findSameTypeInSuccessiveDraws",
    "findDifferentTypesInSuccessiveDraws",
    "findAtLeastOneAcrossIndependentStages",
  ].includes(source.solveMode);
}

function isConditionalMode(source: ProbabilityQuestion): boolean {
  return [
    "findConditionalProbabilityByCounting",
    "findConditionalCardProbability",
    "findConditionalNumberProbability",
    "findConditionalUrnProbability",
    "findReverseConditionalCount",
    "findConditionalFromTwoWayTable",
  ].includes(source.solveMode);
}

function overrideDirectCommitteeCount(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
  lines: string[],
): string[] {
  if (
    source.canonicalProblemId !== "PRB-CP-008" ||
    source.solveMode !== "findReverseCountFromProbability" ||
    /probability/iu.test(source.stem)
  ) return lines;

  const men = numberParameter(source, "men");
  const women = numberParameter(source, "women");
  const requiredWomen = numberParameter(source, "requiredWomen", 1);
  const committeeSize = numberParameter(source, "committeeSize");
  const requiredMen = committeeSize - requiredWomen;
  const next = [...lines];

  if (language === "hi") {
    next[0] = "विधि: समिति में क्रम महत्वपूर्ण नहीं होता, इसलिए संयोजन का उपयोग करें।";
    next[1] = `गणना: C(${women},${requiredWomen}) × C(${men},${requiredMen}) = आवश्यक समितियों की संख्या।`;
    next[3] = `मुख्य बिंदु: ठीक ${requiredWomen} महिला और ${requiredMen} पुरुष चुनने के तरीकों को गुणा करें।`;
  } else {
    next[0] = "ਵਿਧੀ: ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ, ਇਸ ਲਈ ਸੰਚਯ ਵਰਤੋ।";
    next[1] = `ਗਣਨਾ: C(${women},${requiredWomen}) × C(${men},${requiredMen}) = ਲੋੜੀਂਦੀਆਂ ਕਮੇਟੀਆਂ ਦੀ ਗਿਣਤੀ।`;
    next[3] = `ਮੁੱਖ ਬਿੰਦੂ: ਠੀਕ ${requiredWomen} ਔਰਤ ਅਤੇ ${requiredMen} ਮਰਦ ਚੁਣਨ ਦੇ ਤਰੀਕਿਆਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।`;
  }
  return next;
}

function simultaneousWorking(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
): string {
  const red = numberParameter(source, "red");
  const blue = numberParameter(source, "blue");
  const total = red + blue;
  const draw = numberParameter(source, "draw", 1);
  const exactRed = numberParameter(source, "exactRed", 1);
  const exactBlue = draw - exactRed;
  const prefix = language === "hi" ? "गणना: " : "ਗਣਨਾ: ";

  if (source.solveMode === "findSimultaneousSameTypeProbability") {
    return `${prefix}कुल चयन = C(${total},${draw}); अनुकूल चयन = C(${red},${draw}) + C(${blue},${draw}).`;
  }
  if (source.solveMode === "findSimultaneousDifferentTypeProbability") {
    if (draw === 2) return `${prefix}कुल चयन = C(${total},2); अनुकूल चयन = C(${red},1) × C(${blue},1).`;
    return `${prefix}कुल चयन = C(${total},${draw}); अनुकूल चयन = C(${total},${draw}) − C(${red},${draw}) − C(${blue},${draw}).`;
  }
  if (["findExactCompositionProbability", "findSelectionProbabilityUsingCombination"].includes(source.solveMode)) {
    return `${prefix}कुल चयन = C(${total},${draw}); अनुकूल चयन = C(${red},${exactRed}) × C(${blue},${exactBlue}).`;
  }
  if (source.solveMode === "findNoObjectOfTypeProbability") {
    return `${prefix}कुल चयन = C(${total},${draw}); अनुकूल चयन = C(${blue},${draw}).`;
  }
  if (source.solveMode === "findAtLeastOneObjectOfType") {
    return `${prefix}कुल चयन = C(${total},${draw}); अनुकूल चयन = C(${total},${draw}) − C(${blue},${draw}).`;
  }
  return prefix;
}

function overrideSimultaneousObjectExplanation(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
  context: ObjectContext,
  lines: string[],
): string[] {
  if (!isObjectSimultaneousMode(source, context)) return lines;
  const next = [...lines];

  if (language === "hi") {
    next[0] = "विधि: चयन एक साथ और बिना वापस रखे है, इसलिए कुल और अनुकूल चयनों को संयोजन से गिनें।";
    next[1] = simultaneousWorking(source, language)
      .replace(/ਕੁੱਲ ਚੋਣ/gu, "कुल चयन")
      .replace(/ਅਨੁਕੂਲ ਚੋਣ/gu, "अनुकूल चयन");
    next[3] = "मुख्य बिंदु: एक साथ चयन में क्रम महत्वपूर्ण नहीं होता।";
  } else {
    next[0] = "ਵਿਧੀ: ਚੋਣ ਇਕੱਠੇ ਅਤੇ ਵਾਪਸ ਰੱਖੇ ਬਿਨਾਂ ਹੈ, ਇਸ ਲਈ ਕੁੱਲ ਅਤੇ ਅਨੁਕੂਲ ਚੋਣਾਂ ਨੂੰ ਸੰਚਯ ਨਾਲ ਗਿਣੋ।";
    next[1] = simultaneousWorking(source, language)
      .replace(/कुल चयन/gu, "ਕੁੱਲ ਚੋਣ")
      .replace(/अनुकूल चयन/gu, "ਅਨੁਕੂਲ ਚੋਣ");
    next[3] = "ਮੁੱਖ ਬਿੰਦੂ: ਇਕੱਠੀ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ।";
  }
  return next;
}

function successiveWorking(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const red = numberParameter(source, "red");
  const blue = numberParameter(source, "blue");
  const total = red + blue;
  const prefix = language === "hi" ? "गणना: " : "ਗਣਨਾ: ";

  if (["findSuccessiveIndependentProbability", "findWithReplacementProbability"].includes(source.solveMode)) {
    return `${prefix}P(दोनों लाल) = ${red}/${total} × ${red}/${total}.`;
  }
  if (["findSuccessiveDependentProbability", "findWithoutReplacementProbability"].includes(source.solveMode)) {
    return `${prefix}P(दोनों लाल) = ${red}/${total} × ${Math.max(red - 1, 0)}/${Math.max(total - 1, 1)}.`;
  }
  if (source.solveMode === "findOrderedDrawSequenceProbability") {
    return `${prefix}P(पहले लाल, फिर नीला) = ${red}/${total} × ${blue}/${Math.max(total - 1, 1)}.`;
  }
  if (source.solveMode === "findSameTypeInSuccessiveDraws") {
    return `${prefix}P(एक ही रंग) = ${red}/${total} × ${Math.max(red - 1, 0)}/${Math.max(total - 1, 1)} + ${blue}/${total} × ${Math.max(blue - 1, 0)}/${Math.max(total - 1, 1)}.`;
  }
  if (source.solveMode === "findDifferentTypesInSuccessiveDraws") {
    return `${prefix}P(अलग रंग) = ${red}/${total} × ${blue}/${Math.max(total - 1, 1)} + ${blue}/${total} × ${red}/${Math.max(total - 1, 1)}.`;
  }
  if (source.solveMode === "findAtLeastOneAcrossIndependentStages") {
    return `${prefix}P(कम-से-कम एक लाल) = 1 − (${blue}/${total})².`;
  }
  return prefix;
}

function localizeSuccessiveFormula(value: string, language: ProbabilityNativeLanguage): string {
  if (language === "hi") return value;
  return value
    .replace(/दोनों लाल/gu, "ਦੋਵੇਂ ਲਾਲ")
    .replace(/पहले लाल, फिर नीला/gu, "ਪਹਿਲਾਂ ਲਾਲ, ਫਿਰ ਨੀਲਾ")
    .replace(/एक ही रंग/gu, "ਇੱਕੋ ਰੰਗ")
    .replace(/अलग रंग/gu, "ਵੱਖ-ਵੱਖ ਰੰਗ")
    .replace(/कम-से-कम एक लाल/gu, "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਲ");
}

function overrideSuccessiveObjectExplanation(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
  context: ObjectContext,
  lines: string[],
): string[] {
  if (!isSuccessiveObjectMode(source, context)) return lines;
  const words = wordsFor(context, language);
  const next = [...lines];

  if (language === "hi") {
    next[0] = `विधि: हर चयन की प्रायिकता उस समय उपलब्ध ${words.plural} और वस्तु वापस रखी गई है या नहीं, इस पर तय करें।`;
    next[1] = localizeSuccessiveFormula(successiveWorking(source, language), language);
    next[3] = "मुख्य बिंदु: वस्तु वापस रखने पर दोनों चयन स्वतंत्र रहते हैं; वापस न रखने पर दूसरा चयन पहले पर निर्भर करता है।";
  } else {
    next[0] = `ਵਿਧੀ: ਹਰ ਚੋਣ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ${words.plural} ਅਤੇ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਗਈ ਹੈ ਜਾਂ ਨਹੀਂ, ਇਸ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।`;
    next[1] = localizeSuccessiveFormula(successiveWorking(source, language), language);
    next[3] = "ਮੁੱਖ ਬਿੰਦੂ: ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦੋਵੇਂ ਚੋਣਾਂ ਸੁਤੰਤਰ ਰਹਿੰਦੀਆਂ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਪਹਿਲੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।";
  }
  return next;
}

function isConditionalMode(source: ProbabilityQuestion): boolean {
  return [
    "findConditionalProbabilityByCounting",
    "findConditionalCardProbability",
    "findConditionalNumberProbability",
    "findConditionalUrnProbability",
    "findReverseConditionalCount",
    "findConditionalFromTwoWayTable",
  ].includes(source.solveMode);
}

function overrideConditionalExplanation(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
  lines: string[],
): string[] {
  if (!isConditionalMode(source)) return lines;
  const next = [...lines];

  if (source.solveMode === "findReverseConditionalCount") {
    if (language === "hi") {
      next[0] = "विधि: दी गई सशर्त प्रायिकता को अनुकूल संख्या ÷ शर्त पूरी करने वाली कुल संख्या के रूप में लिखें।";
      next[1] = "गणना: दी गई प्रायिकता और कुल संख्या से आवश्यक अनुकूल संख्या ज्ञात करें।";
      next[3] = "मुख्य बिंदु: हर में केवल वही समूह लें जो दी गई शर्त पूरी करता है।";
    } else {
      next[0] = "ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤੀ ਸੰਭਾਵਨਾ ਨੂੰ ਅਨੁਕੂਲ ਗਿਣਤੀ ÷ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀ ਕੁੱਲ ਗਿਣਤੀ ਵਜੋਂ ਲਿਖੋ।";
      next[1] = "ਗਣਨਾ: ਦਿੱਤੀ ਸੰਭਾਵਨਾ ਅਤੇ ਕੁੱਲ ਗਿਣਤੀ ਤੋਂ ਲੋੜੀਂਦੀ ਅਨੁਕੂਲ ਗਿਣਤੀ ਕੱਢੋ।";
      next[3] = "ਮੁੱਖ ਬਿੰਦੂ: ਹਰ ਵਿੱਚ ਕੇਵਲ ਉਹੀ ਸਮੂਹ ਲਵੋ ਜੋ ਦਿੱਤੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦਾ ਹੈ।";
    }
    return next;
  }

  if (language === "hi") {
    next[0] = "विधि: दी गई शर्त के बाद बचने वाले समूह को ही नया कुल समूह मानें।";
    next[1] = "गणना: P(A|B) में हर = B को पूरा करने वाले परिणाम; अंश = A और B दोनों को पूरा करने वाले परिणाम।";
    next[3] = "मुख्य बिंदु: शर्त लगने के बाद मूल कुल समूह का हर उपयोग न करें।";
  } else {
    next[0] = "ਵਿਧੀ: ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਬਚਣ ਵਾਲੇ ਸਮੂਹ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ।";
    next[1] = "ਗਣਨਾ: P(A|B) ਵਿੱਚ ਹਰ = B ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ; ਅੰਸ਼ = A ਅਤੇ B ਦੋਵੇਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ।";
    next[3] = "ਮੁੱਖ ਬਿੰਦੂ: ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕੁੱਲ ਸਮੂਹ ਨੂੰ ਹਰ ਵਜੋਂ ਨਾ ਵਰਤੋ।";
  }
  return next;
}

function simplifyDiceExplanation(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
  lines: string[],
): string[] {
  if (!["findTwoDiceSumProbability", "findTwoDiceProductOrParityProbability"].includes(source.solveMode)) return lines;
  return lines.map((line) => {
    if (language === "hi") {
      return line
        .replace(/दो पासों के लिए कुल 6 × 6 = 36 क्रमित परिणाम गिनें।/gu, "दो पासों के लिए कुल 36 क्रमित परिणाम होते हैं।")
        .replace(/दो पासों.*36 क्रमित परिणाम/gu, "दो पासों के लिए 36 क्रमित परिणाम");
    }
    return line
      .replace(/ਦੋ ਪਾਸਿਆਂ ਲਈ ਕੁੱਲ 6 × 6 = 36 ਕ੍ਰਮਿਤ ਨਤੀਜੇ ਗਿਣੋ।/gu, "ਦੋ ਪਾਸਿਆਂ ਲਈ ਕੁੱਲ 36 ਕ੍ਰਮਿਤ ਨਤੀਜੇ ਹੁੰਦੇ ਹਨ।")
      .replace(/ਦੋ ਪਾਸਿਆਂ.*36 ਕ੍ਰਮਿਤ ਨਤੀਜੇ/gu, "ਦੋ ਪਾਸਿਆਂ ਲਈ 36 ਕ੍ਰਮਿਤ ਨਤੀਜੇ");
  });
}

export function polishNativeExplanationLines(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
  lines: readonly string[],
): string[] {
  const context = objectContext(source);
  let polished = lines.map((line) => language === "hi" ? polishHindiLine(line, context) : polishPunjabiLine(line, context));
  polished = overrideDirectCommitteeCount(source, language, polished);
  polished = overrideSimultaneousObjectExplanation(source, language, context, polished);
  polished = overrideSuccessiveObjectExplanation(source, language, context, polished);
  polished = overrideConditionalExplanation(source, language, polished);
  polished = simplifyDiceExplanation(source, language, polished);
  return polished;
}

export function polishNativeVisual(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
  visual: ProbabilityVisual,
): ProbabilityVisual {
  if (visual.strategyId === "SUCCESSIVE_DRAW_TREE") {
    const withReplacement = source.experiment.replacementPolicy === "WITH_REPLACEMENT";
    if (language === "hi") return {
      ...visual,
      title: "दो चरणों का प्रायिकता वृक्ष",
      altText: withReplacement
        ? "दो चरणों का चयन-वृक्ष; हर चयन के बाद वस्तु वापस रखी जाती है।"
        : "दो चरणों का चयन-वृक्ष; चुनी गई वस्तु वापस नहीं रखी जाती।",
    };
    return {
      ...visual,
      title: "ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਸੰਭਾਵਨਾ ਦਰੱਖਤ",
      altText: withReplacement
        ? "ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਚੋਣ-ਦਰੱਖਤ; ਹਰ ਚੋਣ ਤੋਂ ਬਾਅਦ ਵਸਤੂ ਵਾਪਸ ਰੱਖੀ ਜਾਂਦੀ ਹੈ।"
        : "ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਚੋਣ-ਦਰੱਖਤ; ਚੁਣੀ ਵਸਤੂ ਵਾਪਸ ਨਹੀਂ ਰੱਖੀ ਜਾਂਦੀ।",
    };
  }

  if (visual.strategyId !== "URN_COMPOSITION_DISPLAY") return visual;
  const context = objectContext(source);
  if (context === "NONE" || context === "BALLS") return visual;

  const red = String(visual.data.red ?? "");
  const blue = String(visual.data.blue ?? "");

  if (language === "hi") {
    if (context === "MARBLES") return {
      ...visual,
      title: "जार में कंचों की संरचना",
      altText: `${red} लाल और ${blue} नीले कंचों वाला चयन-चित्र।`,
    };
    if (context === "PENS") return {
      ...visual,
      title: "बॉक्स में पेनों की संरचना",
      altText: `${red} लाल और ${blue} नीले पेनों वाला चयन-चित्र।`,
    };
    return {
      ...visual,
      title: "पाउच में रंगीन पत्थरों की संरचना",
      altText: `${red} लाल और ${blue} नीले रंगीन पत्थरों वाला चयन-चित्र।`,
    };
  }

  if (context === "MARBLES") return {
    ...visual,
    title: "ਜਾਰ ਵਿੱਚ ਕੰਚਿਆਂ ਦੀ ਬਣਤਰ",
    altText: `${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੇ ਕੰਚਿਆਂ ਵਾਲਾ ਚੋਣ-ਚਿੱਤਰ।`,
  };
  if (context === "PENS") return {
    ...visual,
    title: "ਬਾਕਸ ਵਿੱਚ ਪੈਨਾਂ ਦੀ ਬਣਤਰ",
    altText: `${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੇ ਪੈਨਾਂ ਵਾਲਾ ਚੋਣ-ਚਿੱਤਰ।`,
  };
  return {
    ...visual,
    title: "ਪਾਊਚ ਵਿੱਚ ਰੰਗੀਨ ਪੱਥਰਾਂ ਦੀ ਬਣਤਰ",
    altText: `${red} ਲਾਲ ਅਤੇ ${blue} ਨੀਲੇ ਰੰਗੀਨ ਪੱਥਰਾਂ ਵਾਲਾ ਚੋਣ-ਚਿੱਤਰ।`,
  };
}
