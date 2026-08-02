import { rational, toLatex } from "./rational";
import type { Rational } from "./types";
import { getTmwCp011RegistryEntry } from "./cp011-registry";
import type {
  TmwCp011AnswerType,
  TmwCp011GeneratedQuestion,
  TmwCp011MisconceptionId,
  TmwCp011Option,
  TmwCp011Parameters,
  TmwCp011RuleId,
  TmwCp011Solution,
} from "./cp011-types";
import type {
  TmwDisplayLocale,
  TmwLocalizationEditorialStatus,
  TmwLocalizedLanguage,
} from "./localization-types";
import { displayLocale } from "./localization-types";
import { localizedOptionLabel } from "./localization-glossary";

type LocalePair = { hi: string; pa: string };

const settings: Record<string, LocalePair> = {
  "a bank document-verification centre": {
    hi: "एक बैंक दस्तावेज़-जाँच केंद्र",
    pa: "ਇੱਕ ਬੈਂਕ ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਕੇਂਦਰ",
  },
  "an automobile component plant": {
    hi: "एक वाहन-पुर्ज़ा कारखाना",
    pa: "ਇੱਕ ਵਾਹਨ ਪੁਰਜ਼ਾ ਫੈਕਟਰੀ",
  },
  "a district printing unit": {
    hi: "एक जिला प्रिंटिंग इकाई",
    pa: "ਇੱਕ ਜ਼ਿਲ੍ਹਾ ਪ੍ਰਿੰਟਿੰਗ ਇਕਾਈ",
  },
  "a warehouse packaging line": {
    hi: "एक गोदाम पैकेजिंग लाइन",
    pa: "ਇੱਕ ਗੋਦਾਮ ਪੈਕਿੰਗ ਲਾਈਨ",
  },
  "a road-maintenance project": {
    hi: "एक सड़क रखरखाव परियोजना",
    pa: "ਇੱਕ ਸੜਕ ਸੰਭਾਲ ਪ੍ਰੋਜੈਕਟ",
  },
  "an agricultural sorting centre": {
    hi: "एक कृषि छँटाई केंद्र",
    pa: "ਇੱਕ ਖੇਤੀਬਾੜੀ ਛਾਂਟ ਕੇਂਦਰ",
  },
};

const units: Record<string, LocalePair> = {
  files: { hi: "फाइलें", pa: "ਫਾਈਲਾਂ" },
  components: { hi: "पुर्ज़े", pa: "ਪੁਰਜ਼ੇ" },
  booklets: { hi: "पुस्तिकाएँ", pa: "ਪੁਸਤਿਕਾਵਾਂ" },
  cartons: { hi: "कार्टन", pa: "ਕਾਰਟਨ" },
  sections: { hi: "सड़क के हिस्से", pa: "ਸੜਕ ਦੇ ਹਿੱਸੇ" },
  crates: { hi: "पेटियाँ", pa: "ਪੇਟੀਆਂ" },
};

function native(pair: LocalePair, language: TmwLocalizedLanguage): string {
  return pair[language];
}

function settingText(value: string, language: TmwLocalizedLanguage): string {
  return settings[value]?.[language] ?? (language === "hi" ? "एक कार्यस्थल" : "ਇੱਕ ਕੰਮ ਵਾਲੀ ਥਾਂ");
}

function unitText(value: string, language: TmwLocalizedLanguage): string {
  return units[value]?.[language] ?? (language === "hi" ? "इकाइयाँ" : "ਇਕਾਈਆਂ");
}

function shown(value: Rational): string {
  return value.denominator === 1 ? String(value.numerator) : `\\(${toLatex(value)}\\)`;
}

function math(value: Rational): string {
  return `\\(${toLatex(value)}\\)`;
}

function magnitude(value: Rational): Rational {
  return rational(Math.abs(value.numerator), value.denominator);
}

function dayWord(days: number, language: TmwLocalizedLanguage): string {
  if (language === "hi") return days === 1 ? "दिन" : "दिन";
  return "ਦਿਨ";
}

function signedDailyChange(
  value: Rational,
  unit: string,
  language: TmwLocalizedLanguage,
): string {
  const amount = shown(magnitude(value));
  if (value.numerator === 0) {
    return language === "hi" ? "हर दिन समान रहता है" : "ਹਰ ਦਿਨ ਇੱਕੋ ਜਿਹਾ ਰਹਿੰਦਾ ਹੈ";
  }
  if (language === "hi") {
    return value.numerator > 0
      ? `हर दिन ${amount} ${unit} बढ़ जाता है`
      : `हर दिन ${amount} ${unit} घट जाता है`;
  }
  return value.numerator > 0
    ? `ਹਰ ਦਿਨ ${amount} ${unit} ਵੱਧ ਜਾਂਦਾ ਹੈ`
    : `ਹਰ ਦਿਨ ${amount} ${unit} ਘੱਟ ਜਾਂਦਾ ਹੈ`;
}

function multiplierPhrase(value: Rational, language: TmwLocalizedLanguage): string {
  if (value.numerator === 2 && value.denominator === 1) {
    return language === "hi" ? "हर अगले दिन दोगुना हो जाता है" : "ਹਰ ਅਗਲੇ ਦਿਨ ਦੁੱਗਣਾ ਹੋ ਜਾਂਦਾ ਹੈ";
  }
  if (value.numerator === 1 && value.denominator === 2) {
    return language === "hi"
      ? "हर अगले दिन पिछले दिन का आधा रह जाता है"
      : "ਹਰ ਅਗਲੇ ਦਿਨ ਪਿਛਲੇ ਦਿਨ ਦਾ ਅੱਧਾ ਰਹਿ ਜਾਂਦਾ ਹੈ";
  }
  return language === "hi"
    ? `हर अगले दिन पिछले दिन का ${shown(value)} गुना हो जाता है`
    : `ਹਰ ਅਗਲੇ ਦਿਨ ਪਿਛਲੇ ਦਿਨ ਦਾ ${shown(value)} ਗੁਣਾ ਹੋ ਜਾਂਦਾ ਹੈ`;
}

function rateList(values: Rational[]): string {
  return values.map(shown).join(", ");
}

function renderTmwCp011LocalizedStem(
  source: TmwCp011GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const c = p.context;
  const place = settingText(c.setting, language);
  const unit = unitText(c.unit, language);
  const a = p.initialRate;
  const d = p.dailyChange;
  const n = p.days;

  switch (source.solveMode) {
    case "findOutputFromArithmeticDailyRates":
      return language === "hi"
        ? `${place} में ${c.actor} पहले दिन ${shown(a!)} ${unit} पूरा करती है। उसका दैनिक उत्पादन ${signedDailyChange(d!, unit, language)}। ${n} दिनों में कुल कितनी ${unit} पूरी होंगी?`
        : `${place} ਵਿੱਚ ${c.actor} ਪਹਿਲੇ ਦਿਨ ${shown(a!)} ${unit} ਪੂਰੀ ਕਰਦੀ ਹੈ। ਉਸ ਦਾ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ${signedDailyChange(d!, unit, language)}। ${n} ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੀਆਂ ${unit} ਪੂਰੀਆਂ ਹੋਣਗੀਆਂ?`;
    case "findCompletionTimeFromArithmeticDailyRates":
      return language === "hi"
        ? `${place} में ${c.actor} पहले दिन ${shown(a!)} ${unit} पूरा करती है और उत्पादन ${signedDailyChange(d!, unit, language)}। ${shown(p.targetOutput!)} ${unit} पूरा करने में ठीक कितना समय लगेगा?`
        : `${place} ਵਿੱਚ ${c.actor} ਪਹਿਲੇ ਦਿਨ ${shown(a!)} ${unit} ਪੂਰੀ ਕਰਦੀ ਹੈ ਅਤੇ ਉਤਪਾਦਨ ${signedDailyChange(d!, unit, language)}। ${shown(p.targetOutput!)} ${unit} ਪੂਰੀਆਂ ਕਰਨ ਲਈ ਠੀਕ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findInitialRateFromArithmeticTotal":
      return language === "hi"
        ? `${place} में ${c.actor} का दैनिक उत्पादन ${signedDailyChange(d!, unit, language)}। ${n} दिनों में कुल ${shown(p.totalOutput!)} ${unit} पूरी हुईं। पहले दिन का उत्पादन कितना था?`
        : `${place} ਵਿੱਚ ${c.actor} ਦਾ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ${signedDailyChange(d!, unit, language)}। ${n} ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ ${shown(p.totalOutput!)} ${unit} ਪੂਰੀਆਂ ਹੋਈਆਂ। ਪਹਿਲੇ ਦਿਨ ਦਾ ਉਤਪਾਦਨ ਕਿੰਨਾ ਸੀ?`;
    case "findDailyChangeFromArithmeticTotal":
      return language === "hi"
        ? `${place} में ${c.actor} पहले दिन ${shown(a!)} ${unit} पूरा करती है। उत्पादन हर दिन समान मात्रा से बदलता है और ${n} दिनों का कुल ${shown(p.totalOutput!)} ${unit} है। दैनिक बढ़ोतरी या कमी ज्ञात कीजिए।`
        : `${place} ਵਿੱਚ ${c.actor} ਪਹਿਲੇ ਦਿਨ ${shown(a!)} ${unit} ਪੂਰੀ ਕਰਦੀ ਹੈ। ਉਤਪਾਦਨ ਹਰ ਦਿਨ ਇੱਕੋ ਮਾਤਰਾ ਨਾਲ ਬਦਲਦਾ ਹੈ ਅਤੇ ${n} ਦਿਨਾਂ ਦਾ ਕੁੱਲ ${shown(p.totalOutput!)} ${unit} ਹੈ। ਰੋਜ਼ਾਨਾ ਵਾਧਾ ਜਾਂ ਘਾਟ ਲੱਭੋ।`;
    case "findOutputFromGeometricDailyRates":
      return language === "hi"
        ? `${place} में ${c.actor} पहले दिन ${shown(a!)} ${unit} पूरा करती है। उत्पादन ${multiplierPhrase(p.multiplier!, language)}। ${n} दिनों में कुल उत्पादन कितना होगा?`
        : `${place} ਵਿੱਚ ${c.actor} ਪਹਿਲੇ ਦਿਨ ${shown(a!)} ${unit} ਪੂਰੀ ਕਰਦੀ ਹੈ। ਉਤਪਾਦਨ ${multiplierPhrase(p.multiplier!, language)}। ${n} ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
    case "findCompletionTimeFromGeometricDailyRates":
      return language === "hi"
        ? `${place} में ${c.actor} पहले दिन ${shown(a!)} ${unit} पूरा करती है और उत्पादन ${multiplierPhrase(p.multiplier!, language)}। ${shown(p.targetOutput!)} ${unit} पूरा करने में ठीक कितना समय लगेगा?`
        : `${place} ਵਿੱਚ ${c.actor} ਪਹਿਲੇ ਦਿਨ ${shown(a!)} ${unit} ਪੂਰੀ ਕਰਦੀ ਹੈ ਅਤੇ ਉਤਪਾਦਨ ${multiplierPhrase(p.multiplier!, language)}। ${shown(p.targetOutput!)} ${unit} ਪੂਰੀਆਂ ਕਰਨ ਲਈ ਠੀਕ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findInitialRateFromGeometricTotal":
      return language === "hi"
        ? `${place} में दैनिक उत्पादन ${multiplierPhrase(p.multiplier!, language)} और ${n} दिनों का कुल ${shown(p.totalOutput!)} ${unit} है। पहले दिन का उत्पादन कितना था?`
        : `${place} ਵਿੱਚ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ${multiplierPhrase(p.multiplier!, language)} ਅਤੇ ${n} ਦਿਨਾਂ ਦਾ ਕੁੱਲ ${shown(p.totalOutput!)} ${unit} ਹੈ। ਪਹਿਲੇ ਦਿਨ ਦਾ ਉਤਪਾਦਨ ਕਿੰਨਾ ਸੀ?`;
    case "findMultiplierFromGeometricTotal":
      return language === "hi"
        ? `${place} में ${c.actor} पहले दिन ${shown(a!)} ${unit} पूरा करती है। हर अगले दिन उत्पादन एक ही गुणक से बदलता है और ${n} दिनों का कुल ${shown(p.totalOutput!)} ${unit} है। वह गुणक क्या है?`
        : `${place} ਵਿੱਚ ${c.actor} ਪਹਿਲੇ ਦਿਨ ${shown(a!)} ${unit} ਪੂਰੀ ਕਰਦੀ ਹੈ। ਹਰ ਅਗਲੇ ਦਿਨ ਉਤਪਾਦਨ ਇੱਕੋ ਗੁਣਕ ਨਾਲ ਬਦਲਦਾ ਹੈ ਅਤੇ ${n} ਦਿਨਾਂ ਦਾ ਕੁੱਲ ${shown(p.totalOutput!)} ${unit} ਹੈ। ਉਹ ਗੁਣਕ ਕੀ ਹੈ?`;
    case "findCompletionTimeAfterThresholdRateSwitch":
      return language === "hi"
        ? `${place} में ${c.actor} पहले ${p.thresholdDay} ${dayWord(p.thresholdDay!, language)} तक प्रतिदिन ${shown(a!)} ${unit} और उसके बाद प्रतिदिन ${shown(p.postThresholdRate!)} ${unit} पूरा करती है। ${shown(p.targetOutput!)} ${unit} पूरा करने में कितना समय लगेगा?`
        : `${place} ਵਿੱਚ ${c.actor} ਪਹਿਲੇ ${p.thresholdDay} ${dayWord(p.thresholdDay!, language)} ਤੱਕ ਹਰ ਦਿਨ ${shown(a!)} ${unit} ਅਤੇ ਉਸ ਤੋਂ ਬਾਅਦ ਹਰ ਦਿਨ ${shown(p.postThresholdRate!)} ${unit} ਪੂਰੀ ਕਰਦੀ ਹੈ। ${shown(p.targetOutput!)} ${unit} ਪੂਰੀਆਂ ਕਰਨ ਲਈ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findUnknownThresholdDay":
      return language === "hi"
        ? `${place} में ${c.actor} पहले प्रतिदिन ${shown(a!)} ${unit} और दर बदलने के बाद प्रतिदिन ${shown(p.postThresholdRate!)} ${unit} पूरा करती है। ${n} दिनों में कुल ${shown(p.totalOutput!)} ${unit} पूरी हुईं। दर किस दिन के बाद बदली?`
        : `${place} ਵਿੱਚ ${c.actor} ਪਹਿਲਾਂ ਹਰ ਦਿਨ ${shown(a!)} ${unit} ਅਤੇ ਦਰ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਹਰ ਦਿਨ ${shown(p.postThresholdRate!)} ${unit} ਪੂਰੀ ਕਰਦੀ ਹੈ। ${n} ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ ${shown(p.totalOutput!)} ${unit} ਪੂਰੀਆਂ ਹੋਈਆਂ। ਦਰ ਕਿਹੜੇ ਦਿਨ ਤੋਂ ਬਾਅਦ ਬਦਲੀ?`;
    case "findUnknownPostThresholdRate":
      return language === "hi"
        ? `${place} में ${c.actor} पहले ${p.thresholdDay} दिनों तक प्रतिदिन ${shown(a!)} ${unit} पूरा करती है। फिर एक नई स्थिर दर से काम करके ${n} दिनों में कुल ${shown(p.totalOutput!)} ${unit} पूरी करती है। नई दैनिक दर क्या है?`
        : `${place} ਵਿੱਚ ${c.actor} ਪਹਿਲੇ ${p.thresholdDay} ਦਿਨਾਂ ਤੱਕ ਹਰ ਦਿਨ ${shown(a!)} ${unit} ਪੂਰੀ ਕਰਦੀ ਹੈ। ਫਿਰ ਇੱਕ ਨਵੀਂ ਸਥਿਰ ਦਰ ਨਾਲ ਕੰਮ ਕਰਕੇ ${n} ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ ${shown(p.totalOutput!)} ${unit} ਪੂਰੀਆਂ ਕਰਦੀ ਹੈ। ਨਵੀਂ ਰੋਜ਼ਾਨਾ ਦਰ ਕੀ ਹੈ?`;
    case "findOutputWithVaryingCrewByDay":
      return language === "hi"
        ? `${place} में लगातार दिनों के लिए श्रमिकों की संख्या ${p.crewCounts!.join(", ")} है। प्रत्येक श्रमिक प्रतिदिन ${shown(p.perWorkerRate!)} ${unit} पूरा करता है। कुल उत्पादन ज्ञात कीजिए।`
        : `${place} ਵਿੱਚ ਲਗਾਤਾਰ ਦਿਨਾਂ ਲਈ ਮਜ਼ਦੂਰਾਂ ਦੀ ਗਿਣਤੀ ${p.crewCounts!.join(", ")} ਹੈ। ਹਰ ਮਜ਼ਦੂਰ ਹਰ ਦਿਨ ${shown(p.perWorkerRate!)} ${unit} ਪੂਰੀ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਉਤਪਾਦਨ ਲੱਭੋ।`;
    case "findCombinedVariableAgentOutput":
      return language === "hi"
        ? `${place} में ${c.actor} पहले दिन ${shown(a!)} ${unit} और ${c.peerActor} पहले दिन ${shown(p.peerInitialRate!)} ${unit} पूरा करते हैं। उनकी दैनिक बदलावट क्रमशः ${shown(d!)} और ${shown(p.peerDailyChange!)} ${unit} है। ${n} दिनों का संयुक्त उत्पादन कितना है?`
        : `${place} ਵਿੱਚ ${c.actor} ਪਹਿਲੇ ਦਿਨ ${shown(a!)} ${unit} ਅਤੇ ${c.peerActor} ਪਹਿਲੇ ਦਿਨ ${shown(p.peerInitialRate!)} ${unit} ਪੂਰੀ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੇ ਰੋਜ਼ਾਨਾ ਬਦਲਾਅ ਕ੍ਰਮਵਾਰ ${shown(d!)} ਅਤੇ ${shown(p.peerDailyChange!)} ${unit} ਹਨ। ${n} ਦਿਨਾਂ ਦਾ ਸਾਂਝਾ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੈ?`;
    case "findSignedNetVariableOutput":
      return language === "hi"
        ? `${place} में उपयोगी उत्पादन पहले दिन ${shown(a!)} ${unit} है और हर दिन ${shown(d!)} ${unit} बढ़ता है। खराब या दोबारा करने वाला काम पहले दिन ${shown(p.negativeInitialRate!)} ${unit} है और हर दिन ${shown(p.negativeDailyChange!)} ${unit} बदलता है। ${n} दिनों का शुद्ध उत्पादन कितना है?`
        : `${place} ਵਿੱਚ ਲਾਭਕਾਰੀ ਉਤਪਾਦਨ ਪਹਿਲੇ ਦਿਨ ${shown(a!)} ${unit} ਹੈ ਅਤੇ ਹਰ ਦਿਨ ${shown(d!)} ${unit} ਵੱਧਦਾ ਹੈ। ਖਰਾਬ ਜਾਂ ਮੁੜ ਕਰਨ ਵਾਲਾ ਕੰਮ ਪਹਿਲੇ ਦਿਨ ${shown(p.negativeInitialRate!)} ${unit} ਹੈ ਅਤੇ ਹਰ ਦਿਨ ${shown(p.negativeDailyChange!)} ${unit} ਬਦਲਦਾ ਹੈ। ${n} ਦਿਨਾਂ ਦਾ ਸ਼ੁੱਧ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੈ?`;
    case "findCompletionTimeFromExplicitRateTable":
      return language === "hi"
        ? `${place} में लगातार दिनों की दैनिक दरें ${rateList(p.explicitRates!)} ${unit} हैं। ${shown(p.targetOutput!)} ${unit} पूरा होने का ठीक समय ज्ञात कीजिए।`
        : `${place} ਵਿੱਚ ਲਗਾਤਾਰ ਦਿਨਾਂ ਦੀਆਂ ਰੋਜ਼ਾਨਾ ਦਰਾਂ ${rateList(p.explicitRates!)} ${unit} ਹਨ। ${shown(p.targetOutput!)} ${unit} ਪੂਰੀਆਂ ਹੋਣ ਦਾ ਠੀਕ ਸਮਾਂ ਲੱਭੋ।`;
    case "findRequiredDailyAdjustmentForDeadline":
      return language === "hi"
        ? `${place} में पहले दिन की नियोजित दर ${shown(a!)} ${unit} है और वह ${signedDailyChange(d!, unit, language)}। ${p.requiredDeadlineDays} दिनों में ${shown(p.targetOutput!)} ${unit} पूरा करने के लिए हर दिन नियोजित दर में समान कितनी बढ़ोतरी चाहिए?`
        : `${place} ਵਿੱਚ ਪਹਿਲੇ ਦਿਨ ਦੀ ਯੋਜਿਤ ਦਰ ${shown(a!)} ${unit} ਹੈ ਅਤੇ ਉਹ ${signedDailyChange(d!, unit, language)}। ${p.requiredDeadlineDays} ਦਿਨਾਂ ਵਿੱਚ ${shown(p.targetOutput!)} ${unit} ਪੂਰੀਆਂ ਕਰਨ ਲਈ ਹਰ ਦਿਨ ਯੋਜਿਤ ਦਰ ਵਿੱਚ ਇੱਕੋ ਜਿਹਾ ਕਿੰਨਾ ਵਾਧਾ ਚਾਹੀਦਾ ਹੈ?`;
    case "findOutputAfterThresholdRateSwitch":
      return language === "hi"
        ? `${place} में ${c.actor} पहले ${p.thresholdDay} दिनों तक प्रतिदिन ${shown(a!)} ${unit} और फिर प्रतिदिन ${shown(p.postThresholdRate!)} ${unit} पूरा करती है। ${n} दिनों में कुल उत्पादन कितना होगा?`
        : `${place} ਵਿੱਚ ${c.actor} ਪਹਿਲੇ ${p.thresholdDay} ਦਿਨਾਂ ਤੱਕ ਹਰ ਦਿਨ ${shown(a!)} ${unit} ਅਤੇ ਫਿਰ ਹਰ ਦਿਨ ${shown(p.postThresholdRate!)} ${unit} ਪੂਰੀ ਕਰਦੀ ਹੈ। ${n} ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
    case "findCompletionTimeWithVaryingCrewByDay":
      return language === "hi"
        ? `${place} में लगातार दिनों के लिए श्रमिकों की संख्या ${p.crewCounts!.join(", ")} है और प्रत्येक श्रमिक प्रतिदिन ${shown(p.perWorkerRate!)} ${unit} पूरा करता है। ${shown(p.targetOutput!)} ${unit} कब पूरी होंगी?`
        : `${place} ਵਿੱਚ ਲਗਾਤਾਰ ਦਿਨਾਂ ਲਈ ਮਜ਼ਦੂਰਾਂ ਦੀ ਗਿਣਤੀ ${p.crewCounts!.join(", ")} ਹੈ ਅਤੇ ਹਰ ਮਜ਼ਦੂਰ ਹਰ ਦਿਨ ${shown(p.perWorkerRate!)} ${unit} ਪੂਰੀ ਕਰਦਾ ਹੈ। ${shown(p.targetOutput!)} ${unit} ਕਦੋਂ ਪੂਰੀਆਂ ਹੋਣਗੀਆਂ?`;
    case "findPostThresholdRateChange":
      return language === "hi"
        ? `${place} में ${c.actor} पहले ${p.thresholdDay} दिनों तक प्रतिदिन ${shown(a!)} ${unit} पूरा करती है। फिर दर बदल जाती है और ${n} दिनों में कुल ${shown(p.totalOutput!)} ${unit} पूरी होती हैं। नई दर में प्रतिदिन कितनी बढ़ोतरी या कमी हुई?`
        : `${place} ਵਿੱਚ ${c.actor} ਪਹਿਲੇ ${p.thresholdDay} ਦਿਨਾਂ ਤੱਕ ਹਰ ਦਿਨ ${shown(a!)} ${unit} ਪੂਰੀ ਕਰਦੀ ਹੈ। ਫਿਰ ਦਰ ਬਦਲ ਜਾਂਦੀ ਹੈ ਅਤੇ ${n} ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ ${shown(p.totalOutput!)} ${unit} ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ। ਨਵੀਂ ਦਰ ਵਿੱਚ ਹਰ ਦਿਨ ਕਿੰਨਾ ਵਾਧਾ ਜਾਂ ਘਾਟ ਹੋਇਆ?`;
    default:
      throw new Error(`Unsupported CP-011 solve mode: ${source.solveMode}`);
  }
}

function localizeEquation(value: string, language: TmwLocalizedLanguage): string {
  const total = language === "hi" ? "कुल" : "ਕੁੱਲ";
  const net = language === "hi" ? "शुद्ध" : "ਸ਼ੁੱਧ";
  return value
    .replace(/S_\{total\}/g, `S_{\\text{${total}}}`)
    .replace(/S_\{positive\}/g, "S_{+}")
    .replace(/S_\{negative\}/g, "S_{-}")
    .replace(/S_\{net\}/g, `S_{\\text{${net}}}`);
}

function formatAnswer(
  answer: Rational,
  type: TmwCp011AnswerType,
  p: TmwCp011Parameters,
  language: TmwLocalizedLanguage,
): string {
  const unit = unitText(p.context.unit, language);
  switch (type) {
    case "TIME": {
      if (answer.denominator === 1) return `${answer.numerator} ${language === "hi" ? "दिन" : "ਦਿਨ"}`;
      const whole = Math.trunc(answer.numerator / answer.denominator);
      const remainder = answer.numerator - whole * answer.denominator;
      const label = language === "hi" ? "दिन" : "ਦਿਨ";
      return whole === 0
        ? `\\(${toLatex(answer)}\\;\\text{${label}}\\)`
        : `\\(${whole}\\frac{${remainder}}{${answer.denominator}}\\;\\text{${label}}\\)`;
    }
    case "MULTIPLIER":
      return math(answer);
    case "RATE_CHANGE": {
      const amount = shown(magnitude(answer));
      if (language === "hi") {
        return answer.numerator < 0
          ? `${amount} ${unit} प्रतिदिन की कमी`
          : `${amount} ${unit} प्रतिदिन की बढ़ोतरी`;
      }
      return answer.numerator < 0
        ? `${amount} ${unit} ਹਰ ਦਿਨ ਦੀ ਘਾਟ`
        : `${amount} ${unit} ਹਰ ਦਿਨ ਦਾ ਵਾਧਾ`;
    }
    case "DAY_INDEX":
      return language === "hi" ? `दिन ${answer.numerator} के बाद` : `ਦਿਨ ${answer.numerator} ਤੋਂ ਬਾਅਦ`;
    case "RATE":
      return language === "hi"
        ? `${shown(answer)} ${unit} प्रतिदिन`
        : `${shown(answer)} ${unit} ਹਰ ਦਿਨ`;
    case "OUTPUT":
      return `${shown(answer)} ${unit}`;
    default:
      throw new Error(`Unsupported CP-011 answer type: ${type}`);
  }
}

function opening(ruleId: TmwCp011RuleId, language: TmwLocalizedLanguage): string {
  const copy: Record<TmwCp011RuleId, LocalePair> = {
    TMW_ARITHMETIC_RATE_SUM: {
      hi: "हर दिन की दर को अलग लिखें; समान दैनिक बदलाव होने पर पहली और अंतिम दर से कुल जल्दी निकलेगा।",
      pa: "ਹਰ ਦਿਨ ਦੀ ਦਰ ਵੱਖ ਲਿਖੋ; ਇੱਕੋ ਰੋਜ਼ਾਨਾ ਬਦਲਾਅ ਹੋਣ ਤੇ ਪਹਿਲੀ ਅਤੇ ਆਖਰੀ ਦਰ ਨਾਲ ਕੁੱਲ ਜਲਦੀ ਨਿਕਲੇਗਾ।",
    },
    TMW_GEOMETRIC_RATE_SUM: {
      hi: "यहाँ हर दिन समान मात्रा नहीं जुड़ती; पिछली दर एक ही गुणक से बदलती है, इसलिए सभी दैनिक दरें बनाकर जोड़ें।",
      pa: "ਇੱਥੇ ਹਰ ਦਿਨ ਇੱਕੋ ਮਾਤਰਾ ਨਹੀਂ ਜੁੜਦੀ; ਪਿਛਲੀ ਦਰ ਇੱਕੋ ਗੁਣਕ ਨਾਲ ਬਦਲਦੀ ਹੈ, ਇਸ ਲਈ ਸਾਰੀਆਂ ਰੋਜ਼ਾਨਾ ਦਰਾਂ ਬਣਾਕੇ ਜੋੜੋ।",
    },
    TMW_VARIABLE_COMPLETION: {
      hi: "पहले पूरे दिनों का काम जोड़ें, फिर बचा हुआ काम अगले दिन की दर के हिस्से के रूप में लें।",
      pa: "ਪਹਿਲਾਂ ਪੂਰੇ ਦਿਨਾਂ ਦਾ ਕੰਮ ਜੋੜੋ, ਫਿਰ ਬਚਿਆ ਕੰਮ ਅਗਲੇ ਦਿਨ ਦੀ ਦਰ ਦੇ ਹਿੱਸੇ ਵਜੋਂ ਲਓ।",
    },
    TMW_THRESHOLD_SWITCH: {
      hi: "दर बदलने से पहले और बाद के काम को दो अलग चरणों में रखें; तभी दिन और दर सही मिलेंगे।",
      pa: "ਦਰ ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਦਾ ਕੰਮ ਦੋ ਵੱਖਰੇ ਪੜਾਅਾਂ ਵਿੱਚ ਰੱਖੋ; ਤਦ ਹੀ ਦਿਨ ਅਤੇ ਦਰ ਠੀਕ ਮਿਲਣਗੇ।",
    },
    TMW_CREW_SCHEDULE: {
      hi: "हर दिन का काम = उस दिन के श्रमिक × प्रति श्रमिक दर। दिनवार काम जोड़ने से कुल या पूरा होने का समय मिलेगा।",
      pa: "ਹਰ ਦਿਨ ਦਾ ਕੰਮ = ਉਸ ਦਿਨ ਦੇ ਮਜ਼ਦੂਰ × ਪ੍ਰਤੀ ਮਜ਼ਦੂਰ ਦਰ। ਦਿਨਵਾਰ ਕੰਮ ਜੋੜਨ ਨਾਲ ਕੁੱਲ ਜਾਂ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ ਮਿਲੇਗਾ।",
    },
    TMW_COMBINED_SEQUENCE: {
      hi: "दोनों व्यक्तियों की दिनवार बदलती दरों का कुल अलग-अलग निकालें और अंत में दोनों कुल जोड़ें।",
      pa: "ਦੋਵੇਂ ਵਿਅਕਤੀਆਂ ਦੀਆਂ ਦਿਨਵਾਰ ਬਦਲਦੀਆਂ ਦਰਾਂ ਦੇ ਕੁੱਲ ਵੱਖਰੇ ਕੱਢੋ ਅਤੇ ਅੰਤ ਵਿੱਚ ਦੋਵੇਂ ਕੁੱਲ ਜੋੜੋ।",
    },
    TMW_SIGNED_SEQUENCE: {
      hi: "उपयोगी काम और खराब या दोबारा होने वाला काम अलग जोड़ें; शुद्ध काम के लिए दूसरे कुल को पहले से घटाएँ।",
      pa: "ਲਾਭਕਾਰੀ ਕੰਮ ਅਤੇ ਖਰਾਬ ਜਾਂ ਮੁੜ ਹੋਣ ਵਾਲਾ ਕੰਮ ਵੱਖਰੇ ਜੋੜੋ; ਸ਼ੁੱਧ ਕੰਮ ਲਈ ਦੂਜਾ ਕੁੱਲ ਪਹਿਲੇ ਵਿੱਚੋਂ ਘਟਾਓ।",
    },
    TMW_EXPLICIT_RATE_TABLE: {
      hi: "तालिका की दरों को उसी दिनक्रम में जोड़ें; लक्ष्य जिस दिन पार हो, केवल उस दिन का आवश्यक हिस्सा लें।",
      pa: "ਸਾਰਣੀ ਦੀਆਂ ਦਰਾਂ ਨੂੰ ਉਸੇ ਦਿਨਕ੍ਰਮ ਵਿੱਚ ਜੋੜੋ; ਟੀਚਾ ਜਿਸ ਦਿਨ ਪਾਰ ਹੋਵੇ, ਸਿਰਫ਼ ਉਸ ਦਿਨ ਦਾ ਲੋੜੀਂਦਾ ਹਿੱਸਾ ਲਓ।",
    },
    TMW_DEADLINE_ADJUSTMENT: {
      hi: "पहले नियोजित दरों से तय दिनों का कुल निकालें; लक्ष्य की कमी को सभी दिनों में बराबर बाँटें।",
      pa: "ਪਹਿਲਾਂ ਯੋਜਿਤ ਦਰਾਂ ਨਾਲ ਨਿਰਧਾਰਤ ਦਿਨਾਂ ਦਾ ਕੁੱਲ ਕੱਢੋ; ਟੀਚੇ ਦੀ ਘਾਟ ਨੂੰ ਸਾਰੇ ਦਿਨਾਂ ਵਿੱਚ ਬਰਾਬਰ ਵੰਡੋ।",
    },
  };
  return native(copy[ruleId], language);
}

function givens(source: TmwCp011GeneratedQuestion, language: TmwLocalizedLanguage): string[] {
  const p = source.parameters;
  const unit = unitText(p.context.unit, language);
  const out: string[] = [
    language === "hi"
      ? `कार्यस्थल: ${settingText(p.context.setting, language)}`
      : `ਕੰਮ ਦੀ ਥਾਂ: ${settingText(p.context.setting, language)}`,
  ];
  const addLine = (hi: string, pa: string): void => out.push(language === "hi" ? hi : pa);
  if (p.initialRate) addLine(`पहली दर = ${shown(p.initialRate)} ${unit}`, `ਪਹਿਲੀ ਦਰ = ${shown(p.initialRate)} ${unit}`);
  if (p.dailyChange) addLine(`दैनिक बदलाव = ${shown(p.dailyChange)} ${unit}`, `ਰੋਜ਼ਾਨਾ ਬਦਲਾਅ = ${shown(p.dailyChange)} ${unit}`);
  if (p.multiplier) addLine(`दैनिक गुणक = ${shown(p.multiplier)}`, `ਰੋਜ਼ਾਨਾ ਗੁਣਕ = ${shown(p.multiplier)}`);
  if (p.days) addLine(`कुल अवधि = ${p.days} दिन`, `ਕੁੱਲ ਮਿਆਦ = ${p.days} ਦਿਨ`);
  if (p.targetOutput) addLine(`लक्ष्य = ${shown(p.targetOutput)} ${unit}`, `ਟੀਚਾ = ${shown(p.targetOutput)} ${unit}`);
  if (p.totalOutput) addLine(`दिया गया कुल = ${shown(p.totalOutput)} ${unit}`, `ਦਿੱਤਾ ਕੁੱਲ = ${shown(p.totalOutput)} ${unit}`);
  if (p.thresholdDay) addLine(`दर बदलने का बिंदु = दिन ${p.thresholdDay} के बाद`, `ਦਰ ਬਦਲਣ ਦਾ ਬਿੰਦੂ = ਦਿਨ ${p.thresholdDay} ਤੋਂ ਬਾਅਦ`);
  if (p.postThresholdRate) addLine(`बदली हुई दर = ${shown(p.postThresholdRate)} ${unit} प्रतिदिन`, `ਬਦਲੀ ਦਰ = ${shown(p.postThresholdRate)} ${unit} ਹਰ ਦਿਨ`);
  if (p.crewCounts) addLine(`दिनवार श्रमिक = ${p.crewCounts.join(", ")}`, `ਦਿਨਵਾਰ ਮਜ਼ਦੂਰ = ${p.crewCounts.join(", ")}`);
  if (p.perWorkerRate) addLine(`प्रति श्रमिक दर = ${shown(p.perWorkerRate)} ${unit}`, `ਪ੍ਰਤੀ ਮਜ਼ਦੂਰ ਦਰ = ${shown(p.perWorkerRate)} ${unit}`);
  if (p.peerInitialRate) addLine(`दूसरे व्यक्ति की पहली दर = ${shown(p.peerInitialRate)} ${unit}`, `ਦੂਜੇ ਵਿਅਕਤੀ ਦੀ ਪਹਿਲੀ ਦਰ = ${shown(p.peerInitialRate)} ${unit}`);
  if (p.peerDailyChange) addLine(`दूसरे व्यक्ति का दैनिक बदलाव = ${shown(p.peerDailyChange)} ${unit}`, `ਦੂਜੇ ਵਿਅਕਤੀ ਦਾ ਰੋਜ਼ਾਨਾ ਬਦਲਾਅ = ${shown(p.peerDailyChange)} ${unit}`);
  if (p.negativeInitialRate) addLine(`पहले दिन का घटाने वाला काम = ${shown(p.negativeInitialRate)} ${unit}`, `ਪਹਿਲੇ ਦਿਨ ਦਾ ਘਟਾਉਣ ਵਾਲਾ ਕੰਮ = ${shown(p.negativeInitialRate)} ${unit}`);
  if (p.negativeDailyChange) addLine(`घटाने वाले काम का दैनिक बदलाव = ${shown(p.negativeDailyChange)} ${unit}`, `ਘਟਾਉਣ ਵਾਲੇ ਕੰਮ ਦਾ ਰੋਜ਼ਾਨਾ ਬਦਲਾਅ = ${shown(p.negativeDailyChange)} ${unit}`);
  if (p.explicitRates) addLine(`दिनवार दरें = ${rateList(p.explicitRates)} ${unit}`, `ਦਿਨਵਾਰ ਦਰਾਂ = ${rateList(p.explicitRates)} ${unit}`);
  if (p.requiredDeadlineDays) addLine(`समय-सीमा = ${p.requiredDeadlineDays} दिन`, `ਸਮਾਂ-ਸੀਮਾ = ${p.requiredDeadlineDays} ਦਿਨ`);
  return out;
}

function shortcut(ruleId: TmwCp011RuleId, language: TmwLocalizedLanguage): { title: string; steps: string[] } {
  const title = language === "hi" ? "10-सेकंड तरीका" : "10-ਸਕਿੰਟ ਤਰੀਕਾ";
  const copy: Record<TmwCp011RuleId, LocalePair[]> = {
    TMW_ARITHMETIC_RATE_SUM: [
      { hi: "पहली और अंतिम दर निकालें।", pa: "ਪਹਿਲੀ ਅਤੇ ਆਖਰੀ ਦਰ ਕੱਢੋ।" },
      { hi: "औसत दर × दिनों की संख्या से कुल लें।", pa: "ਔਸਤ ਦਰ × ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਕੁੱਲ ਲਓ।" },
    ],
    TMW_GEOMETRIC_RATE_SUM: [
      { hi: "गुणक से दिनवार दरें तुरंत लिखें।", pa: "ਗੁਣਕ ਨਾਲ ਦਿਨਵਾਰ ਦਰਾਂ ਤੁਰੰਤ ਲਿਖੋ।" },
      { hi: "दरें जोड़ें; समान अंतर वाला नियम न लगाएँ।", pa: "ਦਰਾਂ ਜੋੜੋ; ਇੱਕੋ ਅੰਤਰ ਵਾਲਾ ਨਿਯਮ ਨਾ ਲਗਾਓ।" },
    ],
    TMW_VARIABLE_COMPLETION: [
      { hi: "लक्ष्य से पहले पूरे दिनों का संचयी कुल देखें।", pa: "ਟੀਚੇ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰੇ ਦਿਨਾਂ ਦਾ ਸੰਚਿਤ ਕੁੱਲ ਵੇਖੋ।" },
      { hi: "शेष ÷ अगले दिन की दर को पूरे दिनों में जोड़ें।", pa: "ਬਚਿਆ ÷ ਅਗਲੇ ਦਿਨ ਦੀ ਦਰ ਨੂੰ ਪੂਰੇ ਦਿਨਾਂ ਵਿੱਚ ਜੋੜੋ।" },
    ],
    TMW_THRESHOLD_SWITCH: [
      { hi: "बदलाव से पहले का काम पहले निकालें।", pa: "ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ ਦਾ ਕੰਮ ਪਹਿਲਾਂ ਕੱਢੋ।" },
      { hi: "बाकी दिनों या काम पर नई दर लगाएँ।", pa: "ਬਾਕੀ ਦਿਨਾਂ ਜਾਂ ਕੰਮ ਉੱਤੇ ਨਵੀਂ ਦਰ ਲਗਾਓ।" },
    ],
    TMW_CREW_SCHEDULE: [
      { hi: "हर दिन श्रमिक × प्रति श्रमिक दर लिखें।", pa: "ਹਰ ਦਿਨ ਮਜ਼ਦੂਰ × ਪ੍ਰਤੀ ਮਜ਼ਦੂਰ ਦਰ ਲਿਖੋ।" },
      { hi: "दिनवार काम जोड़ें और अंतिम दिन का आवश्यक हिस्सा लें।", pa: "ਦਿਨਵਾਰ ਕੰਮ ਜੋੜੋ ਅਤੇ ਆਖਰੀ ਦਿਨ ਦਾ ਲੋੜੀਂਦਾ ਹਿੱਸਾ ਲਓ।" },
    ],
    TMW_COMBINED_SEQUENCE: [
      { hi: "दोनों के अलग-अलग कुल निकालें।", pa: "ਦੋਵੇਂ ਦੇ ਵੱਖਰੇ ਕੁੱਲ ਕੱਢੋ।" },
      { hi: "अंत में दोनों कुल जोड़ें।", pa: "ਅੰਤ ਵਿੱਚ ਦੋਵੇਂ ਕੁੱਲ ਜੋੜੋ।" },
    ],
    TMW_SIGNED_SEQUENCE: [
      { hi: "उपयोगी और घटाने वाले काम के कुल अलग रखें।", pa: "ਲਾਭਕਾਰੀ ਅਤੇ ਘਟਾਉਣ ਵਾਲੇ ਕੰਮ ਦੇ ਕੁੱਲ ਵੱਖਰੇ ਰੱਖੋ।" },
      { hi: "शुद्ध कुल = उपयोगी कुल − घटाने वाला कुल।", pa: "ਸ਼ੁੱਧ ਕੁੱਲ = ਲਾਭਕਾਰੀ ਕੁੱਲ − ਘਟਾਉਣ ਵਾਲਾ ਕੁੱਲ।" },
    ],
    TMW_EXPLICIT_RATE_TABLE: [
      { hi: "तालिका को दिन के क्रम में जोड़ते जाएँ।", pa: "ਸਾਰਣੀ ਨੂੰ ਦਿਨ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਜੋੜਦੇ ਜਾਓ।" },
      { hi: "लक्ष्य वाले दिन केवल आवश्यक अंश लें।", pa: "ਟੀਚੇ ਵਾਲੇ ਦਿਨ ਸਿਰਫ਼ ਲੋੜੀਂਦਾ ਹਿੱਸਾ ਲਓ।" },
    ],
    TMW_DEADLINE_ADJUSTMENT: [
      { hi: "नियोजित कुल और लक्ष्य का अंतर निकालें।", pa: "ਯੋਜਿਤ ਕੁੱਲ ਅਤੇ ਟੀਚੇ ਦਾ ਅੰਤਰ ਕੱਢੋ।" },
      { hi: "उस अंतर को तय दिनों में बराबर बाँटें।", pa: "ਉਸ ਅੰਤਰ ਨੂੰ ਨਿਰਧਾਰਤ ਦਿਨਾਂ ਵਿੱਚ ਬਰਾਬਰ ਵੰਡੋ।" },
    ],
  };
  return { title, steps: copy[ruleId].map((pair) => native(pair, language)) };
}

function trapReason(id: TmwCp011MisconceptionId, language: TmwLocalizedLanguage): string {
  const hi = (value: string): string => (language === "hi" ? value : "");
  switch (id) {
    case "FIRST_RATE_USED_FOR_ALL_DAYS":
      return language === "hi" ? "इसमें पहले दिन की दर को सभी दिनों पर लगा दिया गया है, जबकि दर हर दिन बदलती है।" : "ਇਸ ਵਿੱਚ ਪਹਿਲੇ ਦਿਨ ਦੀ ਦਰ ਸਾਰੇ ਦਿਨਾਂ ਉੱਤੇ ਲਗਾ ਦਿੱਤੀ ਗਈ ਹੈ, ਜਦਕਿ ਦਰ ਹਰ ਦਿਨ ਬਦਲਦੀ ਹੈ।";
    case "LAST_RATE_USED_FOR_ALL_DAYS":
      return language === "hi" ? "इसमें अंतिम दिन की दर को पूरे समय पर लगा दिया गया है; पहले दिनों की अलग दरें छूट गई हैं।" : "ਇਸ ਵਿੱਚ ਆਖਰੀ ਦਿਨ ਦੀ ਦਰ ਪੂਰੇ ਸਮੇਂ ਉੱਤੇ ਲਗਾ ਦਿੱਤੀ ਗਈ ਹੈ; ਪਹਿਲੇ ਦਿਨਾਂ ਦੀਆਂ ਵੱਖਰੀਆਂ ਦਰਾਂ ਛੁੱਟ ਗਈਆਂ ਹਨ।";
    case "RATE_CHANGE_COUNT_OFF_BY_ONE":
    case "THRESHOLD_DAY_OFF_BY_ONE":
    case "REMAINING_PERIOD_COUNT_WRONG":
      return language === "hi" ? "दिनों या बदलावों की गिनती में एक का अंतर लिया गया है; पहले दिन के बाद ही पहला बदलाव आता है।" : "ਦਿਨਾਂ ਜਾਂ ਬਦਲਾਵਾਂ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਇੱਕ ਦਾ ਫਰਕ ਲਿਆ ਗਿਆ ਹੈ; ਪਹਿਲੇ ਦਿਨ ਤੋਂ ਬਾਅਦ ਹੀ ਪਹਿਲਾ ਬਦਲਾਅ ਆਉਂਦਾ ਹੈ।";
    case "ARITHMETIC_MEAN_MISUSED":
    case "AP_SUM_HALF_OMITTED":
      return language === "hi" ? "औसत या कुल के नियम में आधा गुणक गलत छोड़ा गया है; पहली और अंतिम दर का सही औसत लें।" : "ਔਸਤ ਜਾਂ ਕੁੱਲ ਦੇ ਨਿਯਮ ਵਿੱਚ ਅੱਧਾ ਗੁਣਕ ਗਲਤ ਛੱਡਿਆ ਗਿਆ ਹੈ; ਪਹਿਲੀ ਅਤੇ ਆਖਰੀ ਦਰ ਦਾ ਠੀਕ ਔਸਤ ਲਓ।";
    case "PHASE_DURATIONS_IGNORED":
    case "POST_SWITCH_RATE_APPLIED_FROM_DAY_ONE":
      return language === "hi" ? "दर बदलने से पहले और बाद की अवधियाँ अलग नहीं रखी गईं; नई दर केवल बदलाव के बाद लगती है।" : "ਦਰ ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਦੀਆਂ ਮਿਆਦਾਂ ਵੱਖ ਨਹੀਂ ਰੱਖੀਆਂ ਗਈਆਂ; ਨਵੀਂ ਦਰ ਸਿਰਫ਼ ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ ਲੱਗਦੀ ਹੈ।";
    case "AVERAGE_REPORTED_AS_INITIAL":
    case "AVERAGE_OUTPUT_REPORTED_AS_CHANGE":
    case "TOTAL_AVERAGE_REPORTED_AS_ADJUSTMENT":
      return language === "hi" ? "औसत मान को पूछी गई पहली दर, बदलाव या अतिरिक्त दर मान लिया गया है; प्रश्न की माँगी राशि अलग है।" : "ਔਸਤ ਮੁੱਲ ਨੂੰ ਪੁੱਛੀ ਗਈ ਪਹਿਲੀ ਦਰ, ਬਦਲਾਅ ਜਾਂ ਵਾਧੂ ਦਰ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ; ਪ੍ਰਸ਼ਨ ਦੀ ਮੰਗੀ ਮਾਤਰਾ ਵੱਖ ਹੈ।";
    case "TARGET_DIVIDED_BY_INITIAL_RATE":
    case "TERMINAL_PARTIAL_DAY_IGNORED":
    case "FULL_SCHEDULE_AVERAGE_USED_FOR_EARLY_COMPLETION":
      return language === "hi" ? "बदलती दरों को नज़रअंदाज़ करके सीधा भाग दिया गया है या अंतिम अधूरे दिन को छोड़ दिया गया है।" : "ਬਦਲਦੀਆਂ ਦਰਾਂ ਨੂੰ ਨਜ਼ਰਅੰਦਾਜ਼ ਕਰਕੇ ਸਿੱਧਾ ਭਾਗ ਦਿੱਤਾ ਗਿਆ ਹੈ ਜਾਂ ਆਖਰੀ ਅਧੂਰਾ ਦਿਨ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।";
    case "GEOMETRIC_TREATED_AS_ARITHMETIC":
    case "GEOMETRIC_SUM_FACTOR_WRONG":
    case "MULTIPLIER_NOT_COMPOUNDED":
    case "MULTIPLIER_AS_ADDITIVE_INCREASE":
      return language === "hi" ? "गुणक से बदलती दर को समान दैनिक जोड़ मान लिया गया है; हर नई दर पिछली दर से गुणा करके बनती है।" : "ਗੁਣਕ ਨਾਲ ਬਦਲਦੀ ਦਰ ਨੂੰ ਇੱਕੋ ਰੋਜ਼ਾਨਾ ਜੋੜ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ; ਹਰ ਨਵੀਂ ਦਰ ਪਿਛਲੀ ਦਰ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਬਣਦੀ ਹੈ।";
    case "POST_SWITCH_DURATION_REPORTED":
    case "ORIGINAL_RATE_REPORTED":
    case "PLANNED_RATE_REPORTED_AS_ADJUSTMENT":
    case "NEW_RATE_REPORTED_AS_CHANGE":
      return language === "hi" ? "यह संबंधित अवधि या दर है, लेकिन प्रश्न ने कुल समय, नई दर या दर में बदलाव पूछा है।" : "ਇਹ ਸੰਬੰਧਿਤ ਮਿਆਦ ਜਾਂ ਦਰ ਹੈ, ਪਰ ਪ੍ਰਸ਼ਨ ਨੇ ਕੁੱਲ ਸਮਾਂ, ਨਵੀਂ ਦਰ ਜਾਂ ਦਰ ਵਿੱਚ ਬਦਲਾਅ ਪੁੱਛਿਆ ਹੈ।";
    case "CREW_VARIATION_IGNORED":
    case "CREW_RATE_OMITTED":
      return language === "hi" ? "दिनवार श्रमिक संख्या या प्रति श्रमिक दर में से एक को छोड़ दिया गया है; दोनों का गुणन जरूरी है।" : "ਦਿਨਵਾਰ ਮਜ਼ਦੂਰ ਗਿਣਤੀ ਜਾਂ ਪ੍ਰਤੀ ਮਜ਼ਦੂਰ ਦਰ ਵਿੱਚੋਂ ਇੱਕ ਛੱਡ ਦਿੱਤੀ ਗਈ ਹੈ; ਦੋਵਾਂ ਦਾ ਗੁਣਾ ਲਾਜ਼ਮੀ ਹੈ।";
    case "PEER_SEQUENCE_OMITTED":
      return language === "hi" ? "दूसरे व्यक्ति की बदलती दर का कुल शामिल नहीं किया गया है; दोनों क्रमों का योगदान जोड़ना होगा।" : "ਦੂਜੇ ਵਿਅਕਤੀ ਦੀ ਬਦਲਦੀ ਦਰ ਦਾ ਕੁੱਲ ਸ਼ਾਮਲ ਨਹੀਂ ਕੀਤਾ ਗਿਆ; ਦੋਵੇਂ ਕ੍ਰਮਾਂ ਦਾ ਯੋਗਦਾਨ ਜੋੜਨਾ ਪਵੇਗਾ।";
    case "NEGATIVE_SEQUENCE_IGNORED":
    case "NEGATIVE_SEQUENCE_ADDED":
      return language === "hi" ? "खराब या दोबारा होने वाले काम को सही चिन्ह से नहीं लिया गया; उसे उपयोगी कुल से घटाना चाहिए।" : "ਖਰਾਬ ਜਾਂ ਮੁੜ ਹੋਣ ਵਾਲੇ ਕੰਮ ਨੂੰ ਠੀਕ ਨਿਸ਼ਾਨ ਨਾਲ ਨਹੀਂ ਲਿਆ ਗਿਆ; ਉਸ ਨੂੰ ਲਾਭਕਾਰੀ ਕੁੱਲ ਵਿੱਚੋਂ ਘਟਾਉਣਾ ਚਾਹੀਦਾ ਹੈ।";
    case "TABLE_ORDER_IGNORED":
      return language === "hi" ? "दिनवार तालिका का क्रम बदल दिया गया है; पूरा होने का समय उसी दिए क्रम से निकलेगा।" : "ਦਿਨਵਾਰ ਸਾਰਣੀ ਦਾ ਕ੍ਰਮ ਬਦਲ ਦਿੱਤਾ ਗਿਆ ਹੈ; ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ ਉਸੇ ਦਿੱਤੇ ਕ੍ਰਮ ਨਾਲ ਨਿਕਲੇਗਾ।";
    case "DEADLINE_GAP_NOT_SPREAD":
      return language === "hi" ? "लक्ष्य की पूरी कमी को एक ही दिन की बढ़ोतरी मान लिया गया है; कमी सभी तय दिनों में बराबर बाँटनी है।" : "ਟੀਚੇ ਦੀ ਪੂਰੀ ਘਾਟ ਨੂੰ ਇੱਕੋ ਦਿਨ ਦਾ ਵਾਧਾ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ; ਘਾਟ ਸਾਰੇ ਨਿਰਧਾਰਤ ਦਿਨਾਂ ਵਿੱਚ ਬਰਾਬਰ ਵੰਡਣੀ ਹੈ।";
    case "INVERSE_FORMULA_REVERSED":
    case "PLAUSIBLE_SCALE_ERROR":
      return language === "hi" ? "समीकरण की दिशा या पैमाना उलट गया है; दिए कुल से ज्ञात योगदान घटाकर ही अज्ञात निकालें।" : "ਸਮੀਕਰਨ ਦੀ ਦਿਸ਼ਾ ਜਾਂ ਪੈਮਾਨਾ ਉਲਟ ਗਿਆ ਹੈ; ਦਿੱਤੇ ਕੁੱਲ ਵਿੱਚੋਂ ਜਾਣਿਆ ਯੋਗਦਾਨ ਘਟਾਕੇ ਹੀ ਅਣਜਾਣ ਕੱਢੋ।";
    case "CORRECT":
      return hi("सही विकल्प।") || "ਸਹੀ ਚੋਣ।";
    default:
      return language === "hi" ? "इस विकल्प में दिनवार बदलती दरों का पूरा लेखा नहीं रखा गया है।" : "ਇਸ ਚੋਣ ਵਿੱਚ ਦਿਨਵਾਰ ਬਦਲਦੀਆਂ ਦਰਾਂ ਦਾ ਪੂਰਾ ਹਿਸਾਬ ਨਹੀਂ ਰੱਖਿਆ ਗਿਆ।";
  }
}

export interface TmwCp011LocalizedOption extends TmwCp011Option {}

export interface TmwCp011LocalizedQuestion {
  archetypeId: "TMW-001";
  canonicalProblemId: "TMW-CP-011";
  questionLanguageId: string;
  solveMode: TmwCp011GeneratedQuestion["solveMode"];
  language: TmwLocalizedLanguage;
  locale: TmwDisplayLocale;
  sourceLanguage: "en";
  seed: string;
  stem: string;
  parameters: TmwCp011Parameters;
  solution: TmwCp011Solution;
  options: string[];
  optionAudit: TmwCp011LocalizedOption[];
  correctIndex: number;
  explanation: TmwCp011GeneratedQuestion["explanation"];
  mathematicalFingerprint: string;
  validation: { valid: boolean; errors: string[] };
  editorialStatus: TmwLocalizationEditorialStatus;
  publiclyPublishable: false;
}

export function localizeTmwCp011Question(
  source: TmwCp011GeneratedQuestion,
  language: TmwLocalizedLanguage,
): TmwCp011LocalizedQuestion {
  const entry = getTmwCp011RegistryEntry(source.questionLanguageId);
  const answerText = formatAnswer(source.solution.answer, source.solution.answerType, source.parameters, language);
  const optionAudit = source.optionAudit.map((option) => ({
    ...option,
    text: formatAnswer(option.value, source.solution.answerType, source.parameters, language),
  }));
  const options = optionAudit.map((option) => option.text);
  const trapId = source.explanation.commonTrap.misconceptionId;
  let trapIndex = source.optionAudit.findIndex(
    (option) => option.misconceptionId === trapId && option.text === source.explanation.commonTrap.optionText,
  );
  if (trapIndex < 0) trapIndex = source.optionAudit.findIndex((option) => option.misconceptionId === trapId);

  const formula = `\\(${localizeEquation(source.solution.formulaLatex, language)}\\)`;
  const worked = source.solution.workedLatex.map((step) => localizeEquation(step, language));
  const steps = [
    language === "hi" ? `चरण 1: पहले सही नियम लिखें — ${formula}` : `ਪੜਾਅ 1: ਪਹਿਲਾਂ ਠੀਕ ਨਿਯਮ ਲਿਖੋ — ${formula}`,
    ...worked.map((step, index) =>
      language === "hi"
        ? `चरण ${index + 2}: \\(${step}\\)`
        : `ਪੜਾਅ ${index + 2}: \\(${step}\\)`,
    ),
  ];
  const localizedShortcut = shortcut(entry.ruleId, language);
  const trapLabel = localizedOptionLabel(trapIndex, language);
  const trapText = options[trapIndex] ?? options[0] ?? "";
  const trapExplanation = language === "hi"
    ? `${trapLabel} (${trapText}) इस कारण गलत है: ${trapReason(trapId, language)}`
    : `${trapLabel} (${trapText}) ਇਸ ਕਾਰਨ ਗਲਤ ਹੈ: ${trapReason(trapId, language)}`;
  const conclusion = language === "hi"
    ? `अतः सही उत्तर ${answerText} है।`
    : `ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${answerText} ਹੈ।`;
  const localizedGivens = givens(source, language);
  const errors = [...source.validation.errors];

  if (trapIndex < 0) errors.push("Localized common trap is not linked to an option");
  if (options.length !== 4) errors.push("Localized question does not contain exactly four options");
  if (new Set(options).size !== 4) errors.push("Localized options are not unique");
  if (options[source.correctIndex] !== answerText) errors.push("Localized correct option text differs from localized answer text");
  if (optionAudit[source.correctIndex]?.misconceptionId !== "CORRECT") errors.push("Localized correct option metadata differs from canonical answer");
  if (!source.stem.trim()) errors.push("Canonical source stem is empty");
  const stem = renderTmwCp011LocalizedStem(source, language);
  if (!stem.trim()) errors.push("Localized stem is empty");
  if (localizedGivens.length < 2) errors.push("Localized givens are incomplete");
  if (steps.length < 4) errors.push("Localized worked steps are incomplete");
  if (localizedShortcut.steps.length < 2) errors.push("Localized shortcut is incomplete");

  const learnerText = [
    stem,
    ...options,
    opening(entry.ruleId, language),
    formula,
    ...localizedGivens,
    ...steps,
    localizedShortcut.title,
    ...localizedShortcut.steps,
    trapExplanation,
    conclusion,
  ].join(" ");
  const outsideMath = learnerText.replace(/\\\([\s\S]*?\\\)/g, "");
  if (language === "hi" && !/[\u0900-\u097F]/.test(outsideMath)) errors.push("Hindi delivery has no Devanagari text");
  if (language === "pa" && !/[\u0A00-\u0A7F]/.test(outsideMath)) errors.push("Punjabi delivery has no Gurmukhi text");
  if (language === "hi" && /[\u0A00-\u0A7F]/.test(outsideMath)) errors.push("Hindi delivery contains Gurmukhi text");
  if (language === "pa" && /[\u0900-\u097F]/.test(outsideMath)) errors.push("Punjabi delivery contains Devanagari text");
  if (/find[A-Z]|TMW_|misconceptionId|publiclyPublishable/.test(outsideMath)) errors.push("Localized learner text contains internal wording");
  if (/\b(?:output|rate|target|worker|crew|day|days|total|threshold|table|deadline|increase|decrease|multiplier|files|components|booklets|cartons|sections|crates)\b/i.test(outsideMath)) {
    errors.push("Localized learner text contains English instructional wording");
  }
  if (/\b\d+\s+\d+\/\d+\b/.test(outsideMath)) errors.push("Localized learner text contains a raw mixed fraction");
  if ((learnerText.match(/\\\(/g) ?? []).length !== (learnerText.match(/\\\)/g) ?? []).length) errors.push("Localized MathJax delimiters are unbalanced");

  return {
    archetypeId: source.archetypeId,
    canonicalProblemId: source.canonicalProblemId,
    questionLanguageId: source.questionLanguageId,
    solveMode: source.solveMode,
    language,
    locale: displayLocale(language),
    sourceLanguage: "en",
    seed: source.seed,
    stem,
    parameters: source.parameters,
    solution: { ...source.solution, answerText },
    options,
    optionAudit,
    correctIndex: source.correctIndex,
    explanation: {
      opening: opening(entry.ruleId, language),
      formula,
      givens: localizedGivens,
      steps,
      shortcut: localizedShortcut,
      commonTrap: {
        optionLabel: trapLabel,
        optionText: trapText,
        misconceptionId: trapId,
        explanation: trapExplanation,
      },
      conclusion,
    },
    mathematicalFingerprint: source.mathematicalFingerprint,
    validation: { valid: errors.length === 0, errors },
    editorialStatus: "PENDING",
    publiclyPublishable: false,
  };
}
