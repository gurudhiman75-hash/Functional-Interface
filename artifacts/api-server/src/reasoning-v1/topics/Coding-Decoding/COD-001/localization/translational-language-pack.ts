export type CodTranslatedLocale = "hi-IN" | "pa-IN";

export interface CodTranslationalLanguagePack {
  locale: CodTranslatedLocale;
  scriptPattern: RegExp;
  evidenceJoin: string;
  evidencePair(source: string, code: string): string;
  encodeStem(evidence: string, target: string, style: number): string;
  decodeStem(evidence: string, code: string, style: number): string;
  missingStem(evidence: string, displayed: string, style: number): string;
  tableMissingStem(evidence: string, source: string, style: number): string;
  conditionStem(source: string, style: number): string;
  referenceAid: readonly string[];
  quickMethod(rule: string): string;
  sourceConfirmation(source: string, code: string, style: number): string;
  targetApplication(target: string, answer: string, style: number): string;
  missingApplication(displayed: string, answer: string, style: number): string;
  conditionApplication(baseCode: string, firstClass: string, lastClass: string, answer: string): readonly string[];
  conclusion(answer: string, style: number): string;
  trap(option: string): string;
  className(value: string): string;
  conditionDescription(firstClass: string, lastClass: string): string;
}

const HINDI: CodTranslationalLanguagePack = {
  locale: "hi-IN",
  scriptPattern: /[\u0900-\u097F]/u,
  evidenceJoin: "; ",
  evidencePair: (source, code) => `‘${source}’ का कोड ‘${code}’ है`,
  encodeStem: (evidence, target, style) => [
    `दिए गए उदाहरणों में एक ही कोड नियम लगा है: ${evidence}। उसी नियम से ‘${target}’ का कोड चुनिए।`,
    `इन कोड उदाहरणों को ध्यान से देखिए: ${evidence}। ‘${target}’ को किस प्रकार लिखा जाएगा?`,
    `${evidence}। इसी तरीके का उपयोग करके ‘${target}’ के लिए सही कोड बताइए।`,
  ][style % 3]!,
  decodeStem: (evidence, code, style) => [
    `दिए गए उदाहरणों में एक ही नियम है: ${evidence}। कोड ‘${code}’ किस मूल शब्द या क्रम को दर्शाता है?`,
    `${evidence}। इसी नियम को उलटा लगाकर ‘${code}’ का मूल रूप चुनिए।`,
    `इन उदाहरणों से कोड नियम पहचानिए: ${evidence}। ‘${code}’ को डिकोड कीजिए।`,
  ][style % 3]!,
  missingStem: (evidence, displayed, style) => [
    `${evidence}। उसी नियम से बने ‘${displayed}’ में खाली स्थान पर क्या आएगा?`,
    `इन उदाहरणों का नियम अपनाइए: ${evidence}। ‘${displayed}’ के प्रश्नचिह्न की सही जगह भरिए।`,
    `${evidence}। अधूरे कोड ‘${displayed}’ में लुप्त चिन्ह चुनिए।`,
  ][style % 3]!,
  tableMissingStem: (evidence, source, style) => [
    `${evidence}। दी गई मैपिंग तालिका में ‘${source}’ के सामने कौन-सा कोड आएगा?`,
    `उदाहरणों से स्थिर मैपिंग पहचानिए: ${evidence}। ‘${source}’ के लिए खाली कोड भरिए।`,
    `${evidence}। तालिका में ‘${source}’ का लुप्त कोड चुनिए।`,
  ][style % 3]!,
  conditionStem: (source, style) => [
    `दी गई कोड तालिका और शर्तों के अनुसार ‘${source}’ का सही कोड चुनिए। पहले मूल कोड लिखें, फिर लागू शर्त का परिवर्तन करें।`,
    `हर चिन्ह का कोड तालिका से लेकर ‘${source}’ का प्रारम्भिक क्रम बनाइए और उसके बाद सही शर्त लगाइए। अंतिम कोड क्या होगा?`,
    `तालिका तथा शर्तों को क्रम से लागू करके ‘${source}’ का पूरा कोड बताइए।`,
  ][style % 3]!,
  referenceAid: [
    "हर स्थान पर वही नियम लगाएँ जो सभी दिए गए उदाहरणों से मेल खाता है।",
    "अक्षरों, अंकों और कोड चिन्हों का क्रम बनाए रखें; केवल बताए गए परिवर्तन ही करें।",
  ],
  quickMethod: (rule) => `पहले नियम पहचानें: ${rule} फिर उसे लक्ष्य पर एक बार सही क्रम में लगाएँ।`,
  sourceConfirmation: (source, code, style) => [
    `उदाहरण ‘${source}’ → ‘${code}’ इसी नियम की पुष्टि करता है।`,
    `‘${source}’ पर नियम लगाने से ‘${code}’ मिलता है, इसलिए नियम उदाहरण से मेल खाता है।`,
    `दिए गए जोड़े ‘${source}’ और ‘${code}’ में यही परिवर्तन दिखाई देता है।`,
  ][style % 3]!,
  targetApplication: (target, answer, style) => [
    `लक्ष्य ‘${target}’ पर वही नियम लगाने से ‘${answer}’ मिलता है।`,
    `अब यही प्रक्रिया ‘${target}’ पर लागू करें: परिणाम ‘${answer}’ है।`,
    `लक्ष्य के हर आवश्यक स्थान पर नियम लगाने के बाद कोड ‘${answer}’ बनता है।`,
  ][style % 3]!,
  missingApplication: (displayed, answer, style) => [
    `अधूरे रूप ‘${displayed}’ की खाली जगह पर ‘${answer}’ आएगा।`,
    `दिए नियम के अनुसार प्रश्नचिह्न का मान ‘${answer}’ है।`,
    `बाकी स्थानों से मिलान करने पर लुप्त चिन्ह ‘${answer}’ मिलता है।`,
  ][style % 3]!,
  conditionApplication: (baseCode, firstClass, lastClass, answer) => [
    `तालिका से प्रारम्भिक कोड ‘${baseCode}’ बनता है।`,
    `पहला चिन्ह ${firstClass} और अंतिम चिन्ह ${lastClass} है; इसलिए उसी जोड़ी वाली शर्त लागू होती है।`,
    `शर्त का परिवर्तन करने पर अंतिम कोड ‘${answer}’ मिलता है।`,
  ],
  conclusion: (answer, style) => [
    `अतः सही उत्तर ‘${answer}’ है।`,
    `इसलिए चुना जाने वाला उत्तर ‘${answer}’ है।`,
    `अंतिम परिणाम ‘${answer}’ प्राप्त होता है।`,
  ][style % 3]!,
  trap: (option) => `विकल्प ‘${option}’ में नियम किसी स्थान पर गलत या अधूरा लगाया गया है, इसलिए वह सभी चरणों से मेल नहीं खाता।`,
  className: (value) => ({ VOWEL: "स्वर", CONSONANT: "व्यंजन", ODD: "विषम अंक", EVEN: "सम अंक" }[value] ?? value),
  conditionDescription: (firstClass, lastClass) => `यदि पहला चिन्ह ${firstClass} और अंतिम चिन्ह ${lastClass} हो`,
};

const PUNJABI: CodTranslationalLanguagePack = {
  locale: "pa-IN",
  scriptPattern: /[\u0A00-\u0A7F]/u,
  evidenceJoin: "; ",
  evidencePair: (source, code) => `‘${source}’ ਦਾ ਕੋਡ ‘${code}’ ਹੈ`,
  encodeStem: (evidence, target, style) => [
    `ਦਿੱਤੀਆਂ ਉਦਾਹਰਨਾਂ ਵਿੱਚ ਇੱਕੋ ਕੋਡ ਨਿਯਮ ਵਰਤਿਆ ਗਿਆ ਹੈ: ${evidence}। ਉਸੇ ਨਿਯਮ ਨਾਲ ‘${target}’ ਦਾ ਸਹੀ ਕੋਡ ਚੁਣੋ।`,
    `ਇਨ੍ਹਾਂ ਕੋਡ ਉਦਾਹਰਨਾਂ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖੋ: ${evidence}। ‘${target}’ ਨੂੰ ਕਿਵੇਂ ਲਿਖਿਆ ਜਾਵੇਗਾ?`,
    `${evidence}। ਇਹੋ ਤਰੀਕਾ ਵਰਤ ਕੇ ‘${target}’ ਲਈ ਸਹੀ ਕੋਡ ਦੱਸੋ।`,
  ][style % 3]!,
  decodeStem: (evidence, code, style) => [
    `ਦਿੱਤੀਆਂ ਉਦਾਹਰਨਾਂ ਵਿੱਚ ਇੱਕੋ ਨਿਯਮ ਹੈ: ${evidence}। ਕੋਡ ‘${code}’ ਕਿਸ ਮੂਲ ਸ਼ਬਦ ਜਾਂ ਲੜੀ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`,
    `${evidence}। ਇਸੇ ਨਿਯਮ ਨੂੰ ਉਲਟ ਲਗਾ ਕੇ ‘${code}’ ਦਾ ਮੂਲ ਰੂਪ ਚੁਣੋ।`,
    `ਇਨ੍ਹਾਂ ਉਦਾਹਰਨਾਂ ਤੋਂ ਕੋਡ ਨਿਯਮ ਪਛਾਣੋ: ${evidence}। ‘${code}’ ਨੂੰ ਡੀਕੋਡ ਕਰੋ।`,
  ][style % 3]!,
  missingStem: (evidence, displayed, style) => [
    `${evidence}। ਉਸੇ ਨਿਯਮ ਨਾਲ ਬਣੇ ‘${displayed}’ ਵਿੱਚ ਖਾਲੀ ਥਾਂ ਉੱਤੇ ਕੀ ਆਵੇਗਾ?`,
    `ਇਨ੍ਹਾਂ ਉਦਾਹਰਨਾਂ ਦਾ ਨਿਯਮ ਵਰਤੋ: ${evidence}। ‘${displayed}’ ਵਿੱਚ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਸਹੀ ਥਾਂ ਭਰੋ।`,
    `${evidence}। ਅਧੂਰੇ ਕੋਡ ‘${displayed}’ ਵਿੱਚ ਗੁੰਮ ਨਿਸ਼ਾਨ ਚੁਣੋ।`,
  ][style % 3]!,
  tableMissingStem: (evidence, source, style) => [
    `${evidence}। ਦਿੱਤੀ ਮੈਪਿੰਗ ਸਾਰਣੀ ਵਿੱਚ ‘${source}’ ਦੇ ਸਾਹਮਣੇ ਕਿਹੜਾ ਕੋਡ ਆਵੇਗਾ?`,
    `ਉਦਾਹਰਨਾਂ ਤੋਂ ਪੱਕੀ ਮੈਪਿੰਗ ਪਛਾਣੋ: ${evidence}। ‘${source}’ ਲਈ ਖਾਲੀ ਕੋਡ ਭਰੋ।`,
    `${evidence}। ਸਾਰਣੀ ਵਿੱਚ ‘${source}’ ਦਾ ਗੁੰਮ ਕੋਡ ਚੁਣੋ।`,
  ][style % 3]!,
  conditionStem: (source, style) => [
    `ਦਿੱਤੀ ਕੋਡ ਸਾਰਣੀ ਅਤੇ ਸ਼ਰਤਾਂ ਮੁਤਾਬਕ ‘${source}’ ਦਾ ਸਹੀ ਕੋਡ ਚੁਣੋ। ਪਹਿਲਾਂ ਮੁੱਢਲਾ ਕੋਡ ਲਿਖੋ, ਫਿਰ ਲਾਗੂ ਸ਼ਰਤ ਅਨੁਸਾਰ ਬਦਲਾਅ ਕਰੋ।`,
    `ਹਰ ਨਿਸ਼ਾਨ ਦਾ ਕੋਡ ਸਾਰਣੀ ਤੋਂ ਲੈ ਕੇ ‘${source}’ ਦੀ ਮੁੱਢਲੀ ਲੜੀ ਬਣਾਓ ਅਤੇ ਫਿਰ ਸਹੀ ਸ਼ਰਤ ਲਗਾਓ। ਆਖਰੀ ਕੋਡ ਕੀ ਹੋਵੇਗਾ?`,
    `ਸਾਰਣੀ ਅਤੇ ਸ਼ਰਤਾਂ ਨੂੰ ਕ੍ਰਮਵਾਰ ਲਾਗੂ ਕਰਕੇ ‘${source}’ ਦਾ ਪੂਰਾ ਕੋਡ ਦੱਸੋ।`,
  ][style % 3]!,
  referenceAid: [
    "ਹਰ ਥਾਂ ਉਹੀ ਨਿਯਮ ਲਗਾਓ ਜੋ ਸਾਰੀਆਂ ਦਿੱਤੀਆਂ ਉਦਾਹਰਨਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।",
    "ਅੱਖਰਾਂ, ਅੰਕਾਂ ਅਤੇ ਕੋਡ ਨਿਸ਼ਾਨਾਂ ਦਾ ਕ੍ਰਮ ਕਾਇਮ ਰੱਖੋ; ਸਿਰਫ਼ ਦੱਸੇ ਬਦਲਾਅ ਹੀ ਕਰੋ।",
  ],
  quickMethod: (rule) => `ਪਹਿਲਾਂ ਨਿਯਮ ਪਛਾਣੋ: ${rule} ਫਿਰ ਉਸ ਨੂੰ ਨਿਸ਼ਾਨੇ ਉੱਤੇ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕ ਵਾਰ ਲਗਾਓ।`,
  sourceConfirmation: (source, code, style) => [
    `ਉਦਾਹਰਨ ‘${source}’ → ‘${code}’ ਇਸੇ ਨਿਯਮ ਦੀ ਪੁਸ਼ਟੀ ਕਰਦੀ ਹੈ।`,
    `‘${source}’ ਉੱਤੇ ਨਿਯਮ ਲਗਾਉਣ ਨਾਲ ‘${code}’ ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ ਨਿਯਮ ਉਦਾਹਰਨ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`,
    `ਦਿੱਤੇ ਜੋੜੇ ‘${source}’ ਅਤੇ ‘${code}’ ਵਿੱਚ ਇਹੋ ਬਦਲਾਅ ਦਿਖਾਈ ਦਿੰਦਾ ਹੈ।`,
  ][style % 3]!,
  targetApplication: (target, answer, style) => [
    `ਨਿਸ਼ਾਨੇ ‘${target}’ ਉੱਤੇ ਇਹੋ ਨਿਯਮ ਲਗਾਉਣ ਨਾਲ ‘${answer}’ ਮਿਲਦਾ ਹੈ।`,
    `ਹੁਣ ਇਹੀ ਤਰੀਕਾ ‘${target}’ ਉੱਤੇ ਲਗਾਓ: ਨਤੀਜਾ ‘${answer}’ ਹੈ।`,
    `ਲੋੜੀਂਦੀ ਹਰ ਥਾਂ ਨਿਯਮ ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਕੋਡ ‘${answer}’ ਬਣਦਾ ਹੈ।`,
  ][style % 3]!,
  missingApplication: (displayed, answer, style) => [
    `ਅਧੂਰੇ ਰੂਪ ‘${displayed}’ ਦੀ ਖਾਲੀ ਥਾਂ ਉੱਤੇ ‘${answer}’ ਆਵੇਗਾ।`,
    `ਦਿੱਤੇ ਨਿਯਮ ਅਨੁਸਾਰ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦਾ ਮੁੱਲ ‘${answer}’ ਹੈ।`,
    `ਬਾਕੀ ਥਾਵਾਂ ਨਾਲ ਮਿਲਾਣ ਕਰਨ ਉੱਤੇ ਗੁੰਮ ਨਿਸ਼ਾਨ ‘${answer}’ ਮਿਲਦਾ ਹੈ।`,
  ][style % 3]!,
  conditionApplication: (baseCode, firstClass, lastClass, answer) => [
    `ਸਾਰਣੀ ਤੋਂ ਮੁੱਢਲਾ ਕੋਡ ‘${baseCode}’ ਬਣਦਾ ਹੈ।`,
    `ਪਹਿਲਾ ਨਿਸ਼ਾਨ ${firstClass} ਅਤੇ ਆਖਰੀ ਨਿਸ਼ਾਨ ${lastClass} ਹੈ; ਇਸ ਲਈ ਉਸੇ ਜੋੜੀ ਵਾਲੀ ਸ਼ਰਤ ਲਾਗੂ ਹੁੰਦੀ ਹੈ।`,
    `ਸ਼ਰਤ ਮੁਤਾਬਕ ਬਦਲਾਅ ਕਰਨ ਉੱਤੇ ਆਖਰੀ ਕੋਡ ‘${answer}’ ਮਿਲਦਾ ਹੈ।`,
  ],
  conclusion: (answer, style) => [
    `ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ‘${answer}’ ਹੈ।`,
    `ਅਤੇ ਚੁਣਿਆ ਜਾਣ ਵਾਲਾ ਜਵਾਬ ‘${answer}’ ਹੈ।`,
    `ਆਖਰੀ ਨਤੀਜਾ ‘${answer}’ ਮਿਲਦਾ ਹੈ।`,
  ][style % 3]!,
  trap: (option) => `ਚੋਣ ‘${option}’ ਵਿੱਚ ਨਿਯਮ ਕਿਸੇ ਥਾਂ ਗਲਤ ਜਾਂ ਅਧੂਰਾ ਲਾਇਆ ਗਿਆ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਾਰੇ ਕਦਮਾਂ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦੀ।`,
  className: (value) => ({ VOWEL: "ਸਵਰ", CONSONANT: "ਵਿਅੰਜਨ", ODD: "ਬੇ-ਜੋੜ ਅੰਕ", EVEN: "ਜੋੜ ਅੰਕ" }[value] ?? value),
  conditionDescription: (firstClass, lastClass) => `ਜੇ ਪਹਿਲਾ ਨਿਸ਼ਾਨ ${firstClass} ਅਤੇ ਆਖਰੀ ਨਿਸ਼ਾਨ ${lastClass} ਹੋਵੇ`,
};

export function getCodTranslationalLanguagePack(locale: CodTranslatedLocale): CodTranslationalLanguagePack {
  return locale === "hi-IN" ? HINDI : PUNJABI;
}
