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

type Pair = { hi: string; pa: string };

const SETTINGS: Record<string, Pair> = {
  "a bank document-verification centre": { hi: "एक बैंक दस्तावेज़-जाँच केंद्र", pa: "ਇੱਕ ਬੈਂਕ ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਕੇਂਦਰ" },
  "an automobile component plant": { hi: "एक वाहन-पुर्ज़ा कारखाना", pa: "ਇੱਕ ਵਾਹਨ ਪੁਰਜ਼ਾ ਫੈਕਟਰੀ" },
  "a district printing unit": { hi: "एक जिला प्रिंटिंग इकाई", pa: "ਇੱਕ ਜ਼ਿਲ੍ਹਾ ਪ੍ਰਿੰਟਿੰਗ ਇਕਾਈ" },
  "a warehouse packaging line": { hi: "एक गोदाम पैकेजिंग लाइन", pa: "ਇੱਕ ਗੋਦਾਮ ਪੈਕਿੰਗ ਲਾਈਨ" },
  "a road-maintenance project": { hi: "एक सड़क रखरखाव परियोजना", pa: "ਇੱਕ ਸੜਕ ਸੰਭਾਲ ਪ੍ਰੋਜੈਕਟ" },
  "an agricultural sorting centre": { hi: "एक कृषि छँटाई केंद्र", pa: "ਇੱਕ ਖੇਤੀਬਾੜੀ ਛਾਂਟ ਕੇਂਦਰ" },
};

const UNITS: Record<string, Pair> = {
  files: { hi: "फाइलें", pa: "ਫਾਈਲਾਂ" },
  components: { hi: "पुर्ज़े", pa: "ਪੁਰਜ਼ੇ" },
  booklets: { hi: "पुस्तिकाएँ", pa: "ਪੁਸਤਿਕਾਵਾਂ" },
  cartons: { hi: "कार्टन", pa: "ਕਾਰਟਨ" },
  sections: { hi: "सड़क के हिस्से", pa: "ਸੜਕ ਦੇ ਹਿੱਸੇ" },
  crates: { hi: "पेटियाँ", pa: "ਪੇਟੀਆਂ" },
};

function pick(pair: Pair, language: TmwLocalizedLanguage): string {
  return pair[language];
}

function setting(value: string, language: TmwLocalizedLanguage): string {
  return SETTINGS[value]?.[language] ?? (language === "hi" ? "एक कार्यस्थल" : "ਇੱਕ ਕੰਮ ਵਾਲੀ ਥਾਂ");
}

function unit(value: string, language: TmwLocalizedLanguage): string {
  return UNITS[value]?.[language] ?? (language === "hi" ? "इकाइयाँ" : "ਇਕਾਈਆਂ");
}

function shown(value: Rational): string {
  return value.denominator === 1 ? String(value.numerator) : `\\(${toLatex(value)}\\)`;
}

function magnitude(value: Rational): Rational {
  return rational(Math.abs(value.numerator), value.denominator);
}

function dailyChange(value: Rational, label: string, language: TmwLocalizedLanguage): string {
  if (value.numerator === 0) return language === "hi" ? "हर दिन समान रहता है" : "ਹਰ ਦਿਨ ਇੱਕੋ ਜਿਹਾ ਰਹਿੰਦਾ ਹੈ";
  const amount = shown(magnitude(value));
  if (language === "hi") return value.numerator > 0 ? `हर दिन ${amount} ${label} बढ़ता है` : `हर दिन ${amount} ${label} घटता है`;
  return value.numerator > 0 ? `ਹਰ ਦਿਨ ${amount} ${label} ਵੱਧਦਾ ਹੈ` : `ਹਰ ਦਿਨ ${amount} ${label} ਘੱਟਦਾ ਹੈ`;
}

function multiplier(value: Rational, language: TmwLocalizedLanguage): string {
  if (value.numerator === 2 && value.denominator === 1) return language === "hi" ? "हर अगले दिन दोगुना होता है" : "ਹਰ ਅਗਲੇ ਦਿਨ ਦੁੱਗਣਾ ਹੁੰਦਾ ਹੈ";
  if (value.numerator === 1 && value.denominator === 2) return language === "hi" ? "हर अगले दिन पिछले दिन का आधा होता है" : "ਹਰ ਅਗਲੇ ਦਿਨ ਪਿਛਲੇ ਦਿਨ ਦਾ ਅੱਧਾ ਹੁੰਦਾ ਹੈ";
  return language === "hi" ? `हर अगले दिन पिछले दिन का ${shown(value)} गुना होता है` : `ਹਰ ਅਗਲੇ ਦਿਨ ਪਿਛਲੇ ਦਿਨ ਦਾ ${shown(value)} ਗੁਣਾ ਹੁੰਦਾ ਹੈ`;
}

function list(values: Rational[]): string {
  return values.map(shown).join(", ");
}

function localizedStem(source: TmwCp011GeneratedQuestion, language: TmwLocalizedLanguage): string {
  const p = source.parameters;
  const c = p.context;
  const place = setting(c.setting, language);
  const label = unit(c.unit, language);
  const a = p.initialRate;
  const d = p.dailyChange;
  const n = p.days;
  const hi = language === "hi";

  switch (source.solveMode) {
    case "findOutputFromArithmeticDailyRates":
      return hi ? `${place} में ${c.actor} पहले दिन ${shown(a!)} ${label} पूरा करती है और उत्पादन ${dailyChange(d!, label, language)}। ${n} दिनों का कुल ज्ञात कीजिए।` : `${place} ਵਿੱਚ ${c.actor} ਪਹਿਲੇ ਦਿਨ ${shown(a!)} ${label} ਪੂਰੀ ਕਰਦੀ ਹੈ ਅਤੇ ਉਤਪਾਦਨ ${dailyChange(d!, label, language)}। ${n} ਦਿਨਾਂ ਦਾ ਕੁੱਲ ਲੱਭੋ।`;
    case "findCompletionTimeFromArithmeticDailyRates":
      return hi ? `${place} में पहले दिन ${shown(a!)} ${label} पूरे होते हैं और उत्पादन ${dailyChange(d!, label, language)}। ${shown(p.targetOutput!)} ${label} पूरा होने में ठीक कितना समय लगेगा?` : `${place} ਵਿੱਚ ਪਹਿਲੇ ਦਿਨ ${shown(a!)} ${label} ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ ਅਤੇ ਉਤਪਾਦਨ ${dailyChange(d!, label, language)}। ${shown(p.targetOutput!)} ${label} ਪੂਰੀਆਂ ਹੋਣ ਲਈ ਠੀਕ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findInitialRateFromArithmeticTotal":
      return hi ? `${place} में उत्पादन ${dailyChange(d!, label, language)} और ${n} दिनों का कुल ${shown(p.totalOutput!)} ${label} है। पहले दिन का उत्पादन कितना था?` : `${place} ਵਿੱਚ ਉਤਪਾਦਨ ${dailyChange(d!, label, language)} ਅਤੇ ${n} ਦਿਨਾਂ ਦਾ ਕੁੱਲ ${shown(p.totalOutput!)} ${label} ਹੈ। ਪਹਿਲੇ ਦਿਨ ਦਾ ਉਤਪਾਦਨ ਕਿੰਨਾ ਸੀ?`;
    case "findDailyChangeFromArithmeticTotal":
      return hi ? `${place} में पहले दिन ${shown(a!)} ${label} पूरे हुए। उत्पादन हर दिन समान मात्रा से बदलता है और ${n} दिनों का कुल ${shown(p.totalOutput!)} ${label} है। दैनिक बदलाव ज्ञात कीजिए।` : `${place} ਵਿੱਚ ਪਹਿਲੇ ਦਿਨ ${shown(a!)} ${label} ਪੂਰੀਆਂ ਹੋਈਆਂ। ਉਤਪਾਦਨ ਹਰ ਦਿਨ ਇੱਕੋ ਮਾਤਰਾ ਨਾਲ ਬਦਲਦਾ ਹੈ ਅਤੇ ${n} ਦਿਨਾਂ ਦਾ ਕੁੱਲ ${shown(p.totalOutput!)} ${label} ਹੈ। ਰੋਜ਼ਾਨਾ ਬਦਲਾਅ ਲੱਭੋ।`;
    case "findOutputFromGeometricDailyRates":
      return hi ? `${place} में पहले दिन ${shown(a!)} ${label} पूरे होते हैं और उत्पादन ${multiplier(p.multiplier!, language)}। ${n} दिनों का कुल ज्ञात कीजिए।` : `${place} ਵਿੱਚ ਪਹਿਲੇ ਦਿਨ ${shown(a!)} ${label} ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ ਅਤੇ ਉਤਪਾਦਨ ${multiplier(p.multiplier!, language)}। ${n} ਦਿਨਾਂ ਦਾ ਕੁੱਲ ਲੱਭੋ।`;
    case "findCompletionTimeFromGeometricDailyRates":
      return hi ? `${place} में पहले दिन ${shown(a!)} ${label} पूरे होते हैं और उत्पादन ${multiplier(p.multiplier!, language)}। ${shown(p.targetOutput!)} ${label} पूरा होने में कितना समय लगेगा?` : `${place} ਵਿੱਚ ਪਹਿਲੇ ਦਿਨ ${shown(a!)} ${label} ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ ਅਤੇ ਉਤਪਾਦਨ ${multiplier(p.multiplier!, language)}। ${shown(p.targetOutput!)} ${label} ਪੂਰੀਆਂ ਹੋਣ ਲਈ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findInitialRateFromGeometricTotal":
      return hi ? `${place} में उत्पादन ${multiplier(p.multiplier!, language)} और ${n} दिनों का कुल ${shown(p.totalOutput!)} ${label} है। पहले दिन का उत्पादन कितना था?` : `${place} ਵਿੱਚ ਉਤਪਾਦਨ ${multiplier(p.multiplier!, language)} ਅਤੇ ${n} ਦਿਨਾਂ ਦਾ ਕੁੱਲ ${shown(p.totalOutput!)} ${label} ਹੈ। ਪਹਿਲੇ ਦਿਨ ਦਾ ਉਤਪਾਦਨ ਕਿੰਨਾ ਸੀ?`;
    case "findMultiplierFromGeometricTotal":
      return hi ? `${place} में पहले दिन ${shown(a!)} ${label} पूरे होते हैं। हर दिन एक ही गुणक लगता है और ${n} दिनों का कुल ${shown(p.totalOutput!)} ${label} है। गुणक ज्ञात कीजिए।` : `${place} ਵਿੱਚ ਪਹਿਲੇ ਦਿਨ ${shown(a!)} ${label} ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ। ਹਰ ਦਿਨ ਇੱਕੋ ਗੁਣਕ ਲੱਗਦਾ ਹੈ ਅਤੇ ${n} ਦਿਨਾਂ ਦਾ ਕੁੱਲ ${shown(p.totalOutput!)} ${label} ਹੈ। ਗੁਣਕ ਲੱਭੋ।`;
    case "findCompletionTimeAfterThresholdRateSwitch":
      return hi ? `${place} में पहले ${p.thresholdDay} दिनों तक प्रतिदिन ${shown(a!)} ${label} और फिर प्रतिदिन ${shown(p.postThresholdRate!)} ${label} पूरे होते हैं। ${shown(p.targetOutput!)} ${label} पूरा होने में कितना समय लगेगा?` : `${place} ਵਿੱਚ ਪਹਿਲੇ ${p.thresholdDay} ਦਿਨਾਂ ਤੱਕ ਹਰ ਦਿਨ ${shown(a!)} ${label} ਅਤੇ ਫਿਰ ਹਰ ਦਿਨ ${shown(p.postThresholdRate!)} ${label} ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ। ${shown(p.targetOutput!)} ${label} ਪੂਰੀਆਂ ਹੋਣ ਲਈ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findUnknownThresholdDay":
      return hi ? `${place} में दर पहले प्रतिदिन ${shown(a!)} ${label} और बाद में प्रतिदिन ${shown(p.postThresholdRate!)} ${label} है। ${n} दिनों में कुल ${shown(p.totalOutput!)} ${label} पूरे हुए। दर किस दिन के बाद बदली?` : `${place} ਵਿੱਚ ਦਰ ਪਹਿਲਾਂ ਹਰ ਦਿਨ ${shown(a!)} ${label} ਅਤੇ ਬਾਅਦ ਵਿੱਚ ਹਰ ਦਿਨ ${shown(p.postThresholdRate!)} ${label} ਹੈ। ${n} ਦਿਨਾਂ ਵਿੱਚ ਕੁੱਲ ${shown(p.totalOutput!)} ${label} ਪੂਰੀਆਂ ਹੋਈਆਂ। ਦਰ ਕਿਹੜੇ ਦਿਨ ਤੋਂ ਬਾਅਦ ਬਦਲੀ?`;
    case "findUnknownPostThresholdRate":
      return hi ? `${place} में पहले ${p.thresholdDay} दिनों तक प्रतिदिन ${shown(a!)} ${label} पूरे हुए। नई स्थिर दर से ${n} दिनों का कुल ${shown(p.totalOutput!)} ${label} हुआ। नई दैनिक दर ज्ञात कीजिए।` : `${place} ਵਿੱਚ ਪਹਿਲੇ ${p.thresholdDay} ਦਿਨਾਂ ਤੱਕ ਹਰ ਦਿਨ ${shown(a!)} ${label} ਪੂਰੀਆਂ ਹੋਈਆਂ। ਨਵੀਂ ਸਥਿਰ ਦਰ ਨਾਲ ${n} ਦਿਨਾਂ ਦਾ ਕੁੱਲ ${shown(p.totalOutput!)} ${label} ਹੋਇਆ। ਨਵੀਂ ਰੋਜ਼ਾਨਾ ਦਰ ਲੱਭੋ।`;
    case "findOutputWithVaryingCrewByDay":
      return hi ? `${place} में दिनवार श्रमिक संख्या ${p.crewCounts!.join(", ")} है। प्रत्येक श्रमिक प्रतिदिन ${shown(p.perWorkerRate!)} ${label} पूरा करता है। कुल उत्पादन ज्ञात कीजिए।` : `${place} ਵਿੱਚ ਦਿਨਵਾਰ ਮਜ਼ਦੂਰ ਗਿਣਤੀ ${p.crewCounts!.join(", ")} ਹੈ। ਹਰ ਮਜ਼ਦੂਰ ਹਰ ਦਿਨ ${shown(p.perWorkerRate!)} ${label} ਪੂਰੀ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਉਤਪਾਦਨ ਲੱਭੋ।`;
    case "findCombinedVariableAgentOutput":
      return hi ? `${place} में ${c.actor} और ${c.peerActor} की पहले दिन की दरें ${shown(a!)} और ${shown(p.peerInitialRate!)} ${label} हैं। उनके दैनिक बदलाव ${shown(d!)} और ${shown(p.peerDailyChange!)} हैं। ${n} दिनों का संयुक्त कुल ज्ञात कीजिए।` : `${place} ਵਿੱਚ ${c.actor} ਅਤੇ ${c.peerActor} ਦੀਆਂ ਪਹਿਲੇ ਦਿਨ ਦੀਆਂ ਦਰਾਂ ${shown(a!)} ਅਤੇ ${shown(p.peerInitialRate!)} ${label} ਹਨ। ਉਨ੍ਹਾਂ ਦੇ ਰੋਜ਼ਾਨਾ ਬਦਲਾਅ ${shown(d!)} ਅਤੇ ${shown(p.peerDailyChange!)} ਹਨ। ${n} ਦਿਨਾਂ ਦਾ ਸਾਂਝਾ ਕੁੱਲ ਲੱਭੋ।`;
    case "findSignedNetVariableOutput":
      return hi ? `${place} में उपयोगी काम पहले दिन ${shown(a!)} ${label} है और दैनिक बदलाव ${shown(d!)} है। घटाने वाला काम पहले दिन ${shown(p.negativeInitialRate!)} ${label} है और उसका दैनिक बदलाव ${shown(p.negativeDailyChange!)} है। ${n} दिनों का शुद्ध कुल ज्ञात कीजिए।` : `${place} ਵਿੱਚ ਲਾਭਕਾਰੀ ਕੰਮ ਪਹਿਲੇ ਦਿਨ ${shown(a!)} ${label} ਹੈ ਅਤੇ ਰੋਜ਼ਾਨਾ ਬਦਲਾਅ ${shown(d!)} ਹੈ। ਘਟਾਉਣ ਵਾਲਾ ਕੰਮ ਪਹਿਲੇ ਦਿਨ ${shown(p.negativeInitialRate!)} ${label} ਹੈ ਅਤੇ ਉਸ ਦਾ ਰੋਜ਼ਾਨਾ ਬਦਲਾਅ ${shown(p.negativeDailyChange!)} ਹੈ। ${n} ਦਿਨਾਂ ਦਾ ਸ਼ੁੱਧ ਕੁੱਲ ਲੱਭੋ।`;
    case "findCompletionTimeFromExplicitRateTable":
      return hi ? `${place} में दिनवार दरें ${list(p.explicitRates!)} ${label} हैं। ${shown(p.targetOutput!)} ${label} पूरा होने का ठीक समय ज्ञात कीजिए।` : `${place} ਵਿੱਚ ਦਿਨਵਾਰ ਦਰਾਂ ${list(p.explicitRates!)} ${label} ਹਨ। ${shown(p.targetOutput!)} ${label} ਪੂਰੀਆਂ ਹੋਣ ਦਾ ਠੀਕ ਸਮਾਂ ਲੱਭੋ।`;
    case "findRequiredDailyAdjustmentForDeadline":
      return hi ? `${place} में पहले दिन की नियोजित दर ${shown(a!)} ${label} है और वह ${dailyChange(d!, label, language)}। ${p.requiredDeadlineDays} दिनों में ${shown(p.targetOutput!)} ${label} पूरा करने के लिए हर दिन समान अतिरिक्त दर कितनी चाहिए?` : `${place} ਵਿੱਚ ਪਹਿਲੇ ਦਿਨ ਦੀ ਯੋਜਿਤ ਦਰ ${shown(a!)} ${label} ਹੈ ਅਤੇ ਉਹ ${dailyChange(d!, label, language)}। ${p.requiredDeadlineDays} ਦਿਨਾਂ ਵਿੱਚ ${shown(p.targetOutput!)} ${label} ਪੂਰੀਆਂ ਕਰਨ ਲਈ ਹਰ ਦਿਨ ਇੱਕੋ ਵਾਧੂ ਦਰ ਕਿੰਨੀ ਚਾਹੀਦੀ ਹੈ?`;
    case "findOutputAfterThresholdRateSwitch":
      return hi ? `${place} में पहले ${p.thresholdDay} दिनों तक प्रतिदिन ${shown(a!)} ${label} और फिर प्रतिदिन ${shown(p.postThresholdRate!)} ${label} पूरे होते हैं। ${n} दिनों का कुल ज्ञात कीजिए।` : `${place} ਵਿੱਚ ਪਹਿਲੇ ${p.thresholdDay} ਦਿਨਾਂ ਤੱਕ ਹਰ ਦਿਨ ${shown(a!)} ${label} ਅਤੇ ਫਿਰ ਹਰ ਦਿਨ ${shown(p.postThresholdRate!)} ${label} ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ। ${n} ਦਿਨਾਂ ਦਾ ਕੁੱਲ ਲੱਭੋ।`;
    case "findCompletionTimeWithVaryingCrewByDay":
      return hi ? `${place} में दिनवार श्रमिक संख्या ${p.crewCounts!.join(", ")} है और प्रत्येक श्रमिक प्रतिदिन ${shown(p.perWorkerRate!)} ${label} पूरा करता है। ${shown(p.targetOutput!)} ${label} कब पूरी होंगी?` : `${place} ਵਿੱਚ ਦਿਨਵਾਰ ਮਜ਼ਦੂਰ ਗਿਣਤੀ ${p.crewCounts!.join(", ")} ਹੈ ਅਤੇ ਹਰ ਮਜ਼ਦੂਰ ਹਰ ਦਿਨ ${shown(p.perWorkerRate!)} ${label} ਪੂਰੀ ਕਰਦਾ ਹੈ। ${shown(p.targetOutput!)} ${label} ਕਦੋਂ ਪੂਰੀਆਂ ਹੋਣਗੀਆਂ?`;
    case "findPostThresholdRateChange":
      return hi ? `${place} में पहले ${p.thresholdDay} दिनों तक प्रतिदिन ${shown(a!)} ${label} पूरे हुए। फिर दर बदलकर ${n} दिनों का कुल ${shown(p.totalOutput!)} ${label} हुआ। नई दर में दैनिक बढ़ोतरी या कमी ज्ञात कीजिए।` : `${place} ਵਿੱਚ ਪਹਿਲੇ ${p.thresholdDay} ਦਿਨਾਂ ਤੱਕ ਹਰ ਦਿਨ ${shown(a!)} ${label} ਪੂਰੀਆਂ ਹੋਈਆਂ। ਫਿਰ ਦਰ ਬਦਲ ਕੇ ${n} ਦਿਨਾਂ ਦਾ ਕੁੱਲ ${shown(p.totalOutput!)} ${label} ਹੋਇਆ। ਨਵੀਂ ਦਰ ਵਿੱਚ ਰੋਜ਼ਾਨਾ ਵਾਧਾ ਜਾਂ ਘਾਟ ਲੱਭੋ।`;
    default:
      throw new Error(`Unsupported CP-011 solve mode: ${source.solveMode}`);
  }
}

function equation(value: string, language: TmwLocalizedLanguage): string {
  return value
    .replace(/S_\{total\}/g, language === "hi" ? "S_{\\text{कुल}}" : "S_{\\text{ਕੁੱਲ}}")
    .replace(/S_\{positive\}/g, "S_{+}")
    .replace(/S_\{negative\}/g, "S_{-}")
    .replace(/S_\{net\}/g, language === "hi" ? "S_{\\text{शुद्ध}}" : "S_{\\text{ਸ਼ੁੱਧ}}");
}

function answerText(answer: Rational, type: TmwCp011AnswerType, p: TmwCp011Parameters, language: TmwLocalizedLanguage): string {
  const label = unit(p.context.unit, language);
  if (type === "TIME") {
    if (answer.denominator === 1) return `${answer.numerator} ${language === "hi" ? "दिन" : "ਦਿਨ"}`;
    const whole = Math.trunc(answer.numerator / answer.denominator);
    const remainder = answer.numerator - whole * answer.denominator;
    const day = language === "hi" ? "दिन" : "ਦਿਨ";
    return whole === 0 ? `\\(${toLatex(answer)}\\;\\text{${day}}\\)` : `\\(${whole}\\frac{${remainder}}{${answer.denominator}}\\;\\text{${day}}\\)`;
  }
  if (type === "MULTIPLIER") return `\\(${toLatex(answer)}\\)`;
  if (type === "RATE_CHANGE") {
    const amount = shown(magnitude(answer));
    if (language === "hi") return answer.numerator < 0 ? `${amount} ${label} प्रतिदिन की कमी` : `${amount} ${label} प्रतिदिन की बढ़ोतरी`;
    return answer.numerator < 0 ? `${amount} ${label} ਹਰ ਦਿਨ ਦੀ ਘਾਟ` : `${amount} ${label} ਹਰ ਦਿਨ ਦਾ ਵਾਧਾ`;
  }
  if (type === "DAY_INDEX") return language === "hi" ? `दिन ${answer.numerator} के बाद` : `ਦਿਨ ${answer.numerator} ਤੋਂ ਬਾਅਦ`;
  if (type === "RATE") return language === "hi" ? `${shown(answer)} ${label} प्रतिदिन` : `${shown(answer)} ${label} ਹਰ ਦਿਨ`;
  return `${shown(answer)} ${label}`;
}

const OPENINGS: Record<TmwCp011RuleId, Pair> = {
  TMW_ARITHMETIC_RATE_SUM: { hi: "हर दिन की दर अलग लिखें; पहली और अंतिम दर के औसत से कुल जल्दी निकलेगा।", pa: "ਹਰ ਦਿਨ ਦੀ ਦਰ ਵੱਖ ਲਿਖੋ; ਪਹਿਲੀ ਅਤੇ ਆਖਰੀ ਦਰ ਦੇ ਔਸਤ ਨਾਲ ਕੁੱਲ ਜਲਦੀ ਨਿਕਲੇਗਾ।" },
  TMW_GEOMETRIC_RATE_SUM: { hi: "हर नई दर पिछली दर पर एक ही गुणक लगाकर बनती है; सभी दैनिक दरें जोड़ें।", pa: "ਹਰ ਨਵੀਂ ਦਰ ਪਿਛਲੀ ਦਰ ਉੱਤੇ ਇੱਕੋ ਗੁਣਕ ਲਗਾਕੇ ਬਣਦੀ ਹੈ; ਸਾਰੀਆਂ ਦਿਨਵਾਰ ਦਰਾਂ ਜੋੜੋ।" },
  TMW_VARIABLE_COMPLETION: { hi: "पहले पूरे दिनों का काम जोड़ें, फिर बचा काम अगले दिन की दर के हिस्से के रूप में लें।", pa: "ਪਹਿਲਾਂ ਪੂਰੇ ਦਿਨਾਂ ਦਾ ਕੰਮ ਜੋੜੋ, ਫਿਰ ਬਚਿਆ ਕੰਮ ਅਗਲੇ ਦਿਨ ਦੀ ਦਰ ਦੇ ਹਿੱਸੇ ਵਜੋਂ ਲਓ।" },
  TMW_THRESHOLD_SWITCH: { hi: "दर बदलने से पहले और बाद के काम को दो अलग चरणों में रखें।", pa: "ਦਰ ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਦੇ ਕੰਮ ਨੂੰ ਦੋ ਵੱਖਰੇ ਪੜਾਅਾਂ ਵਿੱਚ ਰੱਖੋ।" },
  TMW_CREW_SCHEDULE: { hi: "हर दिन का काम = श्रमिक संख्या × प्रति श्रमिक दर; दिनवार काम जोड़ें।", pa: "ਹਰ ਦਿਨ ਦਾ ਕੰਮ = ਮਜ਼ਦੂਰ ਗਿਣਤੀ × ਪ੍ਰਤੀ ਮਜ਼ਦੂਰ ਦਰ; ਦਿਨਵਾਰ ਕੰਮ ਜੋੜੋ।" },
  TMW_COMBINED_SEQUENCE: { hi: "दोनों व्यक्तियों के बदलते काम का कुल अलग निकालें और दोनों कुल जोड़ें।", pa: "ਦੋਵੇਂ ਵਿਅਕਤੀਆਂ ਦੇ ਬਦਲਦੇ ਕੰਮ ਦਾ ਕੁੱਲ ਵੱਖ ਕੱਢੋ ਅਤੇ ਦੋਵੇਂ ਕੁੱਲ ਜੋੜੋ।" },
  TMW_SIGNED_SEQUENCE: { hi: "उपयोगी काम में से घटाने वाला काम निकालने पर शुद्ध काम मिलेगा।", pa: "ਲਾਭਕਾਰੀ ਕੰਮ ਵਿੱਚੋਂ ਘਟਾਉਣ ਵਾਲਾ ਕੰਮ ਕੱਢਣ ਤੇ ਸ਼ੁੱਧ ਕੰਮ ਮਿਲੇਗਾ।" },
  TMW_EXPLICIT_RATE_TABLE: { hi: "तालिका की दरों को उसी दिनक्रम में जोड़ें और अंतिम दिन का आवश्यक हिस्सा लें।", pa: "ਸਾਰਣੀ ਦੀਆਂ ਦਰਾਂ ਨੂੰ ਉਸੇ ਦਿਨਕ੍ਰਮ ਵਿੱਚ ਜੋੜੋ ਅਤੇ ਆਖਰੀ ਦਿਨ ਦਾ ਲੋੜੀਂਦਾ ਹਿੱਸਾ ਲਓ।" },
  TMW_DEADLINE_ADJUSTMENT: { hi: "नियोजित कुल निकालें और लक्ष्य की कमी को सभी दिनों में बराबर बाँटें।", pa: "ਯੋਜਿਤ ਕੁੱਲ ਕੱਢੋ ਅਤੇ ਟੀਚੇ ਦੀ ਘਾਟ ਨੂੰ ਸਾਰੇ ਦਿਨਾਂ ਵਿੱਚ ਬਰਾਬਰ ਵੰਡੋ।" },
};

function localizedGivens(source: TmwCp011GeneratedQuestion, language: TmwLocalizedLanguage): string[] {
  const p = source.parameters;
  const label = unit(p.context.unit, language);
  const out: string[] = [language === "hi" ? `कार्यस्थल: ${setting(p.context.setting, language)}` : `ਕੰਮ ਦੀ ਥਾਂ: ${setting(p.context.setting, language)}`];
  const addLine = (hi: string, pa: string): void => { out.push(language === "hi" ? hi : pa); };
  if (p.initialRate) addLine(`पहली दर = ${shown(p.initialRate)} ${label}`, `ਪਹਿਲੀ ਦਰ = ${shown(p.initialRate)} ${label}`);
  if (p.dailyChange) addLine(`दैनिक बदलाव = ${shown(p.dailyChange)} ${label}`, `ਰੋਜ਼ਾਨਾ ਬਦਲਾਅ = ${shown(p.dailyChange)} ${label}`);
  if (p.multiplier) addLine(`दैनिक गुणक = ${shown(p.multiplier)}`, `ਰੋਜ਼ਾਨਾ ਗੁਣਕ = ${shown(p.multiplier)}`);
  if (p.days) addLine(`कुल अवधि = ${p.days} दिन`, `ਕੁੱਲ ਮਿਆਦ = ${p.days} ਦਿਨ`);
  if (p.targetOutput) addLine(`लक्ष्य = ${shown(p.targetOutput)} ${label}`, `ਟੀਚਾ = ${shown(p.targetOutput)} ${label}`);
  if (p.totalOutput) addLine(`दिया कुल = ${shown(p.totalOutput)} ${label}`, `ਦਿੱਤਾ ਕੁੱਲ = ${shown(p.totalOutput)} ${label}`);
  if (p.thresholdDay) addLine(`दर बदलने का बिंदु = दिन ${p.thresholdDay} के बाद`, `ਦਰ ਬਦਲਣ ਦਾ ਬਿੰਦੂ = ਦਿਨ ${p.thresholdDay} ਤੋਂ ਬਾਅਦ`);
  if (p.postThresholdRate) addLine(`बदली दर = ${shown(p.postThresholdRate)} ${label} प्रतिदिन`, `ਬਦਲੀ ਦਰ = ${shown(p.postThresholdRate)} ${label} ਹਰ ਦਿਨ`);
  if (p.crewCounts) addLine(`दिनवार श्रमिक = ${p.crewCounts.join(", ")}`, `ਦਿਨਵਾਰ ਮਜ਼ਦੂਰ = ${p.crewCounts.join(", ")}`);
  if (p.perWorkerRate) addLine(`प्रति श्रमिक दर = ${shown(p.perWorkerRate)} ${label}`, `ਪ੍ਰਤੀ ਮਜ਼ਦੂਰ ਦਰ = ${shown(p.perWorkerRate)} ${label}`);
  if (p.peerInitialRate) addLine(`दूसरे व्यक्ति की पहली दर = ${shown(p.peerInitialRate)} ${label}`, `ਦੂਜੇ ਵਿਅਕਤੀ ਦੀ ਪਹਿਲੀ ਦਰ = ${shown(p.peerInitialRate)} ${label}`);
  if (p.peerDailyChange) addLine(`दूसरे व्यक्ति का दैनिक बदलाव = ${shown(p.peerDailyChange)} ${label}`, `ਦੂਜੇ ਵਿਅਕਤੀ ਦਾ ਰੋਜ਼ਾਨਾ ਬਦਲਾਅ = ${shown(p.peerDailyChange)} ${label}`);
  if (p.negativeInitialRate) addLine(`पहले दिन का घटाने वाला काम = ${shown(p.negativeInitialRate)} ${label}`, `ਪਹਿਲੇ ਦਿਨ ਦਾ ਘਟਾਉਣ ਵਾਲਾ ਕੰਮ = ${shown(p.negativeInitialRate)} ${label}`);
  if (p.negativeDailyChange) addLine(`घटाने वाले काम का दैनिक बदलाव = ${shown(p.negativeDailyChange)} ${label}`, `ਘਟਾਉਣ ਵਾਲੇ ਕੰਮ ਦਾ ਰੋਜ਼ਾਨਾ ਬਦਲਾਅ = ${shown(p.negativeDailyChange)} ${label}`);
  if (p.explicitRates) addLine(`दिनवार दरें = ${list(p.explicitRates)} ${label}`, `ਦਿਨਵਾਰ ਦਰਾਂ = ${list(p.explicitRates)} ${label}`);
  if (p.requiredDeadlineDays) addLine(`समय-सीमा = ${p.requiredDeadlineDays} दिन`, `ਸਮਾਂ-ਸੀਮਾ = ${p.requiredDeadlineDays} ਦਿਨ`);
  return out;
}

const SHORTCUTS: Record<TmwCp011RuleId, Pair[]> = {
  TMW_ARITHMETIC_RATE_SUM: [{ hi: "पहली और अंतिम दर निकालें।", pa: "ਪਹਿਲੀ ਅਤੇ ਆਖਰੀ ਦਰ ਕੱਢੋ।" }, { hi: "औसत दर × दिनों की संख्या करें।", pa: "ਔਸਤ ਦਰ × ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਕਰੋ।" }],
  TMW_GEOMETRIC_RATE_SUM: [{ hi: "गुणक से दिनवार दरें लिखें।", pa: "ਗੁਣਕ ਨਾਲ ਦਿਨਵਾਰ ਦਰਾਂ ਲਿਖੋ।" }, { hi: "सभी दरें सीधे जोड़ें।", pa: "ਸਾਰੀਆਂ ਦਰਾਂ ਸਿੱਧੀਆਂ ਜੋੜੋ।" }],
  TMW_VARIABLE_COMPLETION: [{ hi: "पूरे दिनों का संचयी कुल देखें।", pa: "ਪੂਰੇ ਦਿਨਾਂ ਦਾ ਸੰਚਿਤ ਕੁੱਲ ਵੇਖੋ।" }, { hi: "शेष ÷ अगली दर को पूरे दिनों में जोड़ें।", pa: "ਬਚਿਆ ÷ ਅਗਲੀ ਦਰ ਨੂੰ ਪੂਰੇ ਦਿਨਾਂ ਵਿੱਚ ਜੋੜੋ।" }],
  TMW_THRESHOLD_SWITCH: [{ hi: "बदलाव से पहले का काम निकालें।", pa: "ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ ਦਾ ਕੰਮ ਕੱਢੋ।" }, { hi: "बाकी दिनों पर नई दर लगाएँ।", pa: "ਬਾਕੀ ਦਿਨਾਂ ਉੱਤੇ ਨਵੀਂ ਦਰ ਲਗਾਓ।" }],
  TMW_CREW_SCHEDULE: [{ hi: "हर दिन श्रमिक × प्रति श्रमिक दर करें।", pa: "ਹਰ ਦਿਨ ਮਜ਼ਦੂਰ × ਪ੍ਰਤੀ ਮਜ਼ਦੂਰ ਦਰ ਕਰੋ।" }, { hi: "दिनवार काम जोड़ें।", pa: "ਦਿਨਵਾਰ ਕੰਮ ਜੋੜੋ।" }],
  TMW_COMBINED_SEQUENCE: [{ hi: "दोनों के अलग कुल निकालें।", pa: "ਦੋਵੇਂ ਦੇ ਵੱਖਰੇ ਕੁੱਲ ਕੱਢੋ।" }, { hi: "दोनों कुल जोड़ें।", pa: "ਦੋਵੇਂ ਕੁੱਲ ਜੋੜੋ।" }],
  TMW_SIGNED_SEQUENCE: [{ hi: "दोनों काम के कुल अलग रखें।", pa: "ਦੋਵੇਂ ਕੰਮ ਦੇ ਕੁੱਲ ਵੱਖ ਰੱਖੋ।" }, { hi: "घटाने वाला कुल उपयोगी कुल से घटाएँ।", pa: "ਘਟਾਉਣ ਵਾਲਾ ਕੁੱਲ ਲਾਭਕਾਰੀ ਕੁੱਲ ਵਿੱਚੋਂ ਘਟਾਓ।" }],
  TMW_EXPLICIT_RATE_TABLE: [{ hi: "दरें दिए क्रम में जोड़ें।", pa: "ਦਰਾਂ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਜੋੜੋ।" }, { hi: "अंतिम दिन का आवश्यक हिस्सा लें।", pa: "ਆਖਰੀ ਦਿਨ ਦਾ ਲੋੜੀਂਦਾ ਹਿੱਸਾ ਲਓ।" }],
  TMW_DEADLINE_ADJUSTMENT: [{ hi: "लक्ष्य और नियोजित कुल का अंतर लें।", pa: "ਟੀਚੇ ਅਤੇ ਯੋਜਿਤ ਕੁੱਲ ਦਾ ਅੰਤਰ ਲਓ।" }, { hi: "अंतर को तय दिनों में बराबर बाँटें।", pa: "ਅੰਤਰ ਨੂੰ ਨਿਰਧਾਰਤ ਦਿਨਾਂ ਵਿੱਚ ਬਰਾਬਰ ਵੰਡੋ।" }],
};

function trapReason(id: TmwCp011MisconceptionId, language: TmwLocalizedLanguage): string {
  const hi = language === "hi";
  if (/FIRST_RATE|LAST_RATE/.test(id)) return hi ? "एक ही दिन की दर सभी दिनों पर लगा दी गई है, जबकि दर बदलती है।" : "ਇੱਕੋ ਦਿਨ ਦੀ ਦਰ ਸਾਰੇ ਦਿਨਾਂ ਉੱਤੇ ਲਗਾ ਦਿੱਤੀ ਗਈ ਹੈ, ਜਦਕਿ ਦਰ ਬਦਲਦੀ ਹੈ।";
  if (/OFF_BY_ONE|PERIOD_COUNT/.test(id)) return hi ? "दिनों या बदलावों की गिनती में एक का अंतर लिया गया है।" : "ਦਿਨਾਂ ਜਾਂ ਬਦਲਾਵਾਂ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਇੱਕ ਦਾ ਫਰਕ ਲਿਆ ਗਿਆ ਹੈ।";
  if (/GEOMETRIC|MULTIPLIER/.test(id)) return hi ? "गुणक से बदलती दर को समान दैनिक जोड़ मान लिया गया है।" : "ਗੁਣਕ ਨਾਲ ਬਦਲਦੀ ਦਰ ਨੂੰ ਇੱਕੋ ਰੋਜ਼ਾਨਾ ਜੋੜ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।";
  if (/THRESHOLD|POST_SWITCH|PHASE/.test(id)) return hi ? "दर बदलने से पहले और बाद की अवधियाँ अलग नहीं रखी गईं।" : "ਦਰ ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਦੀਆਂ ਮਿਆਦਾਂ ਵੱਖ ਨਹੀਂ ਰੱਖੀਆਂ ਗਈਆਂ।";
  if (/CREW/.test(id)) return hi ? "श्रमिक संख्या या प्रति श्रमिक दर में से एक को छोड़ दिया गया है।" : "ਮਜ਼ਦੂਰ ਗਿਣਤੀ ਜਾਂ ਪ੍ਰਤੀ ਮਜ਼ਦੂਰ ਦਰ ਵਿੱਚੋਂ ਇੱਕ ਛੱਡ ਦਿੱਤੀ ਗਈ ਹੈ।";
  if (/NEGATIVE/.test(id)) return hi ? "घटाने वाले काम को सही चिन्ह से नहीं लिया गया; उसे उपयोगी कुल से घटाना है।" : "ਘਟਾਉਣ ਵਾਲੇ ਕੰਮ ਨੂੰ ਠੀਕ ਨਿਸ਼ਾਨ ਨਾਲ ਨਹੀਂ ਲਿਆ ਗਿਆ; ਉਸ ਨੂੰ ਲਾਭਕਾਰੀ ਕੁੱਲ ਵਿੱਚੋਂ ਘਟਾਉਣਾ ਹੈ।";
  if (/PEER/.test(id)) return hi ? "दूसरे व्यक्ति का योगदान शामिल नहीं किया गया है।" : "ਦੂਜੇ ਵਿਅਕਤੀ ਦਾ ਯੋਗਦਾਨ ਸ਼ਾਮਲ ਨਹੀਂ ਕੀਤਾ ਗਿਆ।";
  if (/TABLE/.test(id)) return hi ? "दिनवार सारणी का दिया क्रम बदल दिया गया है।" : "ਦਿਨਵਾਰ ਸਾਰਣੀ ਦਾ ਦਿੱਤਾ ਕ੍ਰਮ ਬਦਲ ਦਿੱਤਾ ਗਿਆ ਹੈ।";
  if (/DEADLINE/.test(id)) return hi ? "पूरी कमी एक दिन पर रखी गई है; उसे सभी दिनों में बाँटना है।" : "ਪੂਰੀ ਘਾਟ ਇੱਕ ਦਿਨ ਉੱਤੇ ਰੱਖੀ ਗਈ ਹੈ; ਉਸ ਨੂੰ ਸਾਰੇ ਦਿਨਾਂ ਵਿੱਚ ਵੰਡਣਾ ਹੈ।";
  if (/TERMINAL|TARGET_DIVIDED|EARLY_COMPLETION/.test(id)) return hi ? "बदलती दरों या अंतिम अधूरे दिन का पूरा हिसाब नहीं रखा गया है।" : "ਬਦਲਦੀਆਂ ਦਰਾਂ ਜਾਂ ਆਖਰੀ ਅਧੂਰੇ ਦਿਨ ਦਾ ਪੂਰਾ ਹਿਸਾਬ ਨਹੀਂ ਰੱਖਿਆ ਗਿਆ।";
  if (/AVERAGE|PLANNED_RATE|NEW_RATE|ORIGINAL_RATE|POST_SWITCH_DURATION/.test(id)) return hi ? "संबंधित औसत, अवधि या दर को ही पूछा गया उत्तर मान लिया गया है।" : "ਸੰਬੰਧਿਤ ਔਸਤ, ਮਿਆਦ ਜਾਂ ਦਰ ਨੂੰ ਹੀ ਪੁੱਛਿਆ ਜਵਾਬ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।";
  return hi ? "दिए कुल से ज्ञात योगदान सही दिशा में घटाकर अज्ञात निकालना चाहिए।" : "ਦਿੱਤੇ ਕੁੱਲ ਵਿੱਚੋਂ ਜਾਣਿਆ ਯੋਗਦਾਨ ਠੀਕ ਦਿਸ਼ਾ ਵਿੱਚ ਘਟਾਕੇ ਅਣਜਾਣ ਕੱਢਣਾ ਚਾਹੀਦਾ ਹੈ।";
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

export function localizeTmwCp011Question(source: TmwCp011GeneratedQuestion, language: TmwLocalizedLanguage): TmwCp011LocalizedQuestion {
  const entry = getTmwCp011RegistryEntry(source.questionLanguageId);
  const localizedAnswer = answerText(source.solution.answer, source.solution.answerType, source.parameters, language);
  const optionAudit = source.optionAudit.map((option) => ({ ...option, text: answerText(option.value, source.solution.answerType, source.parameters, language) }));
  const options = optionAudit.map((option) => option.text);
  const trapId = source.explanation.commonTrap.misconceptionId;
  let trapIndex = source.optionAudit.findIndex((option) => option.misconceptionId === trapId && option.text === source.explanation.commonTrap.optionText);
  if (trapIndex < 0) trapIndex = source.optionAudit.findIndex((option) => option.misconceptionId === trapId);
  const safeTrapIndex = Math.max(0, trapIndex);
  const formula = `\\(${equation(source.solution.formulaLatex, language)}\\)`;
  const steps = [
    language === "hi" ? `चरण 1: सही नियम लिखें — ${formula}` : `ਪੜਾਅ 1: ਠੀਕ ਨਿਯਮ ਲਿਖੋ — ${formula}`,
    ...source.solution.workedLatex.map((value, index) => language === "hi" ? `चरण ${index + 2}: \\(${equation(value, language)}\\)` : `ਪੜਾਅ ${index + 2}: \\(${equation(value, language)}\\)`),
  ];
  const localizedShortcut = {
    title: language === "hi" ? "10-सेकंड तरीका" : "10-ਸਕਿੰਟ ਤਰੀਕਾ",
    steps: SHORTCUTS[entry.ruleId].map((value) => pick(value, language)),
  };
  const trapLabel = localizedOptionLabel(safeTrapIndex, language);
  const trapOption = options[safeTrapIndex] ?? "";
  const trapExplanation = language === "hi" ? `${trapLabel} (${trapOption}) इस कारण गलत है: ${trapReason(trapId, language)}` : `${trapLabel} (${trapOption}) ਇਸ ਕਾਰਨ ਗਲਤ ਹੈ: ${trapReason(trapId, language)}`;
  const conclusion = language === "hi" ? `अतः सही उत्तर ${localizedAnswer} है।` : `ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${localizedAnswer} ਹੈ।`;
  const givens = localizedGivens(source, language);
  const stem = localizedStem(source, language);
  const errors = [...source.validation.errors];
  if (trapIndex < 0) errors.push("Localized common trap is not linked to an option");
  if (options.length !== 4) errors.push("Localized question does not contain exactly four options");
  if (new Set(options).size !== 4) errors.push("Localized options are not unique");
  if (options[source.correctIndex] !== localizedAnswer) errors.push("Localized correct option text differs from localized answer text");
  if (optionAudit[source.correctIndex]?.misconceptionId !== "CORRECT") errors.push("Localized correct option metadata differs from canonical answer");
  if (!stem.trim()) errors.push("Localized stem is empty");
  if (givens.length < 2) errors.push("Localized givens are incomplete");
  if (steps.length < 4) errors.push("Localized worked steps are incomplete");
  if (localizedShortcut.steps.length < 2) errors.push("Localized shortcut is incomplete");
  const learnerText = [stem, ...options, pick(OPENINGS[entry.ruleId], language), formula, ...givens, ...steps, localizedShortcut.title, ...localizedShortcut.steps, trapExplanation, conclusion].join(" ");
  const outsideMath = learnerText.replace(/\\\([\s\S]*?\\\)/g, "");
  if (language === "hi" && !/[\u0900-\u097F]/.test(outsideMath)) errors.push("Hindi delivery has no Devanagari text");
  if (language === "pa" && !/[\u0A00-\u0A7F]/.test(outsideMath)) errors.push("Punjabi delivery has no Gurmukhi text");
  if (language === "hi" && /[\u0A00-\u0A7F]/.test(outsideMath)) errors.push("Hindi delivery contains Gurmukhi text");
  if (language === "pa" && /[\u0900-\u097F]/.test(outsideMath)) errors.push("Punjabi delivery contains Devanagari text");
  if (/find[A-Z]|TMW_|misconceptionId|publiclyPublishable/.test(outsideMath)) errors.push("Localized learner text contains internal wording");
  if (/\b(?:output|rate|target|worker|crew|day|days|total|threshold|table|deadline|increase|decrease|multiplier|files|components|booklets|cartons|sections|crates)\b/i.test(outsideMath)) errors.push("Localized learner text contains English instructional wording");
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
    solution: { ...source.solution, answerText: localizedAnswer },
    options,
    optionAudit,
    correctIndex: source.correctIndex,
    explanation: {
      opening: pick(OPENINGS[entry.ruleId], language),
      formula,
      givens,
      steps,
      shortcut: localizedShortcut,
      commonTrap: { optionLabel: trapLabel, optionText: trapOption, misconceptionId: trapId, explanation: trapExplanation },
      conclusion,
    },
    mathematicalFingerprint: source.mathematicalFingerprint,
    validation: { valid: errors.length === 0, errors },
    editorialStatus: "PENDING",
    publiclyPublishable: false,
  };
}
