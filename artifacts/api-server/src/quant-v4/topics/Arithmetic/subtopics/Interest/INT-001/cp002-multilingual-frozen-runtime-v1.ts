import {
  INT_CP002_FINAL_QL_IDS,
  type IntCp002FinalQlId,
} from "./cp002-final-registry";
import {
  generateIntCp002EnglishFrozenQuestion,
  type IntCp002EnglishFrozenQuestion,
} from "./cp002-english-frozen-runtime";

export const INT_CP002_HI_PA_FREEZE_V1 = Object.freeze({
  freezeId: "INT-CP-002-HI-PA-v1-frozen" as const,
  sourceFreezeId: "INT-CP-002-EN-v1-frozen" as const,
  qlCount: 31 as const,
  languages: Object.freeze(["hi", "pa"] as const),
  approvalAuthority: "PRODUCT_OWNER_CONTINUE_REMAINING_INTEREST_WORK_2026_09_01" as const,
  permanentIdentityFrozen: true as const,
  learnerContentFrozen: true as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
});

export type IntCp002LocalizedLanguage = "hi" | "pa";

const ACTORS: Readonly<Record<string, readonly [string, string]>> = Object.freeze({
  Meera: ["मीरा", "ਮੀਰਾ"], Arjun: ["अर्जुन", "ਅਰਜੁਨ"], Kavya: ["काव्या", "ਕਾਵਿਆ"], Rohan: ["रोहन", "ਰੋਹਨ"],
  Simran: ["सिमरन", "ਸਿਮਰਨ"], Aman: ["अमन", "ਅਮਨ"], Neha: ["नेहा", "ਨੇਹਾ"], Vikram: ["विक्रम", "ਵਿਕਰਮ"],
  Aarav: ["आरव", "ਆਰਵ"], Diya: ["दिया", "ਦੀਆ"], Harpreet: ["हरप्रीत", "ਹਰਪ੍ਰੀਤ"], Ishita: ["इशिता", "ਇਸ਼ਿਤਾ"],
  Kabir: ["कबीर", "ਕਬੀਰ"], Mandeep: ["मनदीप", "ਮਨਦੀਪ"], Navya: ["नव्या", "ਨਵਿਆ"], Yuvraj: ["युवराज", "ਯੁਵਰਾਜ"],
});

const INSTITUTIONS: ReadonlyArray<readonly [string, string, string]> = Object.freeze([
  ["a post-office savings account", "डाकघर बचत खाते", "ਡਾਕਘਰ ਬਚਤ ਖਾਤੇ"],
  ["a post-office savings scheme", "डाकघर बचत योजना", "ਡਾਕਘਰ ਬਚਤ ਯੋਜਨਾ"],
  ["a regional rural bank", "क्षेत्रीय ग्रामीण बैंक", "ਖੇਤਰੀ ਪੇਂਡੂ ਬੈਂਕ"],
  ["a cooperative bank", "सहकारी बैंक", "ਸਹਿਕਾਰੀ ਬੈਂਕ"],
  ["a community savings fund", "सामुदायिक बचत कोष", "ਸਮੁਦਾਇਕ ਬਚਤ ਫੰਡ"],
  ["a credit society", "ऋण सहकारी समिति", "ਕ੍ਰੈਡਿਟ ਸੋਸਾਇਟੀ"],
  ["a rural bank", "ग्रामीण बैंक", "ਪੇਂਡੂ ਬੈਂਕ"],
]);

function choose(language: IntCp002LocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function actorOf(stem: string, language: IntCp002LocalizedLanguage): string {
  const name = stem.match(/^([A-Za-z]+)/u)?.[1] ?? "Candidate";
  const translated = ACTORS[name];
  return translated ? translated[language === "hi" ? 0 : 1] : choose(language, "एक अभ्यर्थी", "ਇੱਕ ਉਮੀਦਵਾਰ");
}

function institutionOf(stem: string, language: IntCp002LocalizedLanguage): string {
  const found = INSTITUTIONS.find(([english]) => stem.includes(english));
  return found ? found[language === "hi" ? 1 : 2] : choose(language, "बैंक", "ਬੈਂਕ");
}

function scan(stem: string) {
  return Object.freeze({
    money: Object.freeze(stem.match(/₹\s*[0-9][0-9,]*(?:\.[0-9]+)?/gu) ?? []),
    rate: Object.freeze(stem.match(/(?:[0-9]+(?:\.[0-9]+)?|[0-9]+\s+[0-9]+\/[0-9]+)%/gu) ?? []),
    time: Object.freeze(stem.match(/(?:[0-9]+(?:\.[0-9]+)?|[0-9]+\s+[0-9]+\/[0-9]+)\s+years?/giu) ?? []),
    days: Object.freeze(stem.match(/[0-9]+\s+days/giu) ?? []),
  });
}

function required(values: readonly string[], index: number, label: string, qlId: string): string {
  const value = values[index];
  if (!value) throw new Error(`${qlId}: localized CP002 stem could not recover ${label}.`);
  return value;
}

function localTime(value: string, language: IntCp002LocalizedLanguage): string {
  return value.replace(/\s+years?$/iu, language === "hi" ? " वर्ष" : " ਸਾਲ");
}

function localDays(value: string, language: IntCp002LocalizedLanguage): string {
  return value.replace(/\s+days$/iu, language === "hi" ? " दिन" : " ਦਿਨ");
}

function localizedStem(
  qlId: IntCp002FinalQlId,
  englishStem: string,
  language: IntCp002LocalizedLanguage,
): string {
  const { money, rate, time, days } = scan(englishStem);
  const a = actorOf(englishStem, language);
  const inst = institutionOf(englishStem, language);
  const m = (index: number) => required(money, index, `money[${index}]`, qlId);
  const r = (index: number) => required(rate, index, `rate[${index}]`, qlId);
  const t = (index: number) => localTime(required(time, index, `time[${index}]`, qlId), language);
  const d = (index: number) => localDays(required(days, index, `days[${index}]`, qlId), language);
  const basis = englishStem.includes("365-day")
    ? choose(language, "365-दिन वर्ष", "365-ਦਿਨ ਸਾਲ")
    : choose(language, "360-दिन वाणिज्यिक वर्ष", "360-ਦਿਨ ਵਪਾਰਕ ਸਾਲ");

  switch (qlId) {
    case "INT-QL-022": return choose(language,
      `${a} ने ${m(0)} ${inst} में जमा किए। पहले ${t(0)} के लिए ${r(0)} और अगले ${t(1)} के लिए ${r(1)} वार्षिक साधारण ब्याज मिलता है। कुल ब्याज ज्ञात कीजिए।`,
      `${a} ਨੇ ${m(0)} ${inst} ਵਿੱਚ ਜਮ੍ਹਾਂ ਕੀਤੇ। ਪਹਿਲੇ ${t(0)} ਲਈ ${r(0)} ਅਤੇ ਅਗਲੇ ${t(1)} ਲਈ ${r(1)} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ਕੁੱਲ ਵਿਆਜ ਕੱਢੋ।`);
    case "INT-QL-023": return choose(language,
      `${a} ने ${m(0)} ${inst} में जमा किए। पहले ${t(0)} के लिए ${r(0)} और अगले ${t(1)} के लिए ${r(1)} वार्षिक साधारण ब्याज मिलता है। अंतिम राशि ज्ञात कीजिए।`,
      `${a} ਨੇ ${m(0)} ${inst} ਵਿੱਚ ਜਮ੍ਹਾਂ ਕੀਤੇ। ਪਹਿਲੇ ${t(0)} ਲਈ ${r(0)} ਅਤੇ ਅਗਲੇ ${t(1)} ਲਈ ${r(1)} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ਅੰਤਿਮ ਰਕਮ ਕੱਢੋ।`);
    case "INT-QL-024": return choose(language,
      `एक अज्ञात मूलधन पर पहले ${t(0)} के लिए ${r(0)} और अगले ${t(1)} के लिए ${r(1)} वार्षिक साधारण ब्याज मिलता है। कुल ब्याज ${m(0)} है। मूलधन ज्ञात कीजिए।`,
      `ਇੱਕ ਅਣਜਾਣ ਮੂਲਧਨ ਉੱਤੇ ਪਹਿਲੇ ${t(0)} ਲਈ ${r(0)} ਅਤੇ ਅਗਲੇ ${t(1)} ਲਈ ${r(1)} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ਕੁੱਲ ਵਿਆਜ ${m(0)} ਹੈ। ਮੂਲਧਨ ਕੱਢੋ।`);
    case "INT-QL-025": return choose(language,
      `${a} ने ${m(0)} ${inst} में जमा किए। पहले ${t(0)} के लिए ${r(0)} साधारण ब्याज मिलता है और अगले ${t(1)} के लिए वार्षिक दर अज्ञात है। कुल ब्याज ${m(1)} है। दूसरी दर ज्ञात कीजिए।`,
      `${a} ਨੇ ${m(0)} ${inst} ਵਿੱਚ ਜਮ੍ਹਾਂ ਕੀਤੇ। ਪਹਿਲੇ ${t(0)} ਲਈ ${r(0)} ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਦਾ ਹੈ ਅਤੇ ਅਗਲੇ ${t(1)} ਲਈ ਸਾਲਾਨਾ ਦਰ ਅਣਜਾਣ ਹੈ। ਕੁੱਲ ਵਿਆਜ ${m(1)} ਹੈ। ਦੂਜੀ ਦਰ ਕੱਢੋ।`);
    case "INT-QL-026": return choose(language,
      `${a} ने ${m(0)} ${inst} में ${t(0)} के लिए ${r(0)} साधारण ब्याज पर राशि रखी, फिर ${r(1)} साधारण ब्याज पर अज्ञात अवधि तक रखी। कुल ब्याज ${m(1)} है। दूसरी अवधि ज्ञात कीजिए।`,
      `${a} ਨੇ ${m(0)} ${inst} ਵਿੱਚ ${t(0)} ਲਈ ${r(0)} ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ਰੱਖੇ, ਫਿਰ ${r(1)} ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ਅਣਜਾਣ ਮਿਆਦ ਲਈ ਰੱਖੇ। ਕੁੱਲ ਵਿਆਜ ${m(1)} ਹੈ। ਦੂਜੀ ਮਿਆਦ ਕੱਢੋ।`);
    case "INT-QL-027": return choose(language,
      `${a} ${inst} की दो साधारण-ब्याज योजनाओं की तुलना करता है। योजना A में ${m(0)} पर पहले ${t(0)} के लिए ${r(0)} और फिर ${t(1)} के लिए ${r(1)} मिलता है। योजना B में उसी मूलधन पर ${t(2)} के लिए ${r(2)} मिलता है। योजना A का ब्याज योजना B से कितना अधिक है?`,
      `${a} ${inst} ਦੀਆਂ ਦੋ ਸਧਾਰਣ-ਵਿਆਜ ਯੋਜਨਾਵਾਂ ਦੀ ਤੁਲਨਾ ਕਰਦਾ ਹੈ। ਯੋਜਨਾ A ਵਿੱਚ ${m(0)} ਉੱਤੇ ਪਹਿਲੇ ${t(0)} ਲਈ ${r(0)} ਅਤੇ ਫਿਰ ${t(1)} ਲਈ ${r(1)} ਮਿਲਦਾ ਹੈ। ਯੋਜਨਾ B ਵਿੱਚ ਉਸੇ ਮੂਲਧਨ ਉੱਤੇ ${t(2)} ਲਈ ${r(2)} ਮਿਲਦਾ ਹੈ। ਯੋਜਨਾ A ਦਾ ਵਿਆਜ ਯੋਜਨਾ B ਨਾਲੋਂ ਕਿੰਨਾ ਵੱਧ ਹੈ?`);
    case "INT-QL-028": return choose(language,
      `${a} ने ${m(0)} को ${t(0)} के लिए ${r(0)} और ${m(1)} को ${t(1)} के लिए ${r(1)} साधारण ब्याज पर ${inst} में लगाया। दोनों का कुल ब्याज ज्ञात कीजिए।`,
      `${a} ਨੇ ${m(0)} ਨੂੰ ${t(0)} ਲਈ ${r(0)} ਅਤੇ ${m(1)} ਨੂੰ ${t(1)} ਲਈ ${r(1)} ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ${inst} ਵਿੱਚ ਲਗਾਇਆ। ਦੋਵਾਂ ਦਾ ਕੁੱਲ ਵਿਆਜ ਕੱਢੋ।`);
    case "INT-QL-029": return choose(language,
      `${a} ने ${m(0)} को ${t(0)} के लिए ${r(0)} और एक अज्ञात दूसरी राशि को ${t(1)} के लिए ${r(1)} साधारण ब्याज पर लगाया। कुल ब्याज ${m(1)} है। दूसरी मूल राशि ज्ञात कीजिए।`,
      `${a} ਨੇ ${m(0)} ਨੂੰ ${t(0)} ਲਈ ${r(0)} ਅਤੇ ਇੱਕ ਅਣਜਾਣ ਦੂਜੀ ਰਕਮ ਨੂੰ ${t(1)} ਲਈ ${r(1)} ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ਲਗਾਇਆ। ਕੁੱਲ ਵਿਆਜ ${m(1)} ਹੈ। ਦੂਜਾ ਮੂਲਧਨ ਕੱਢੋ।`);
    case "INT-QL-030": return choose(language,
      `${a} ने ${m(0)} को ${t(0)} के लिए ${r(0)} और ${m(1)} को ${t(1)} के लिए अज्ञात साधारण-ब्याज दर पर लगाया। कुल ब्याज ${m(2)} है। दूसरी दर ज्ञात कीजिए।`,
      `${a} ਨੇ ${m(0)} ਨੂੰ ${t(0)} ਲਈ ${r(0)} ਅਤੇ ${m(1)} ਨੂੰ ${t(1)} ਲਈ ਅਣਜਾਣ ਸਧਾਰਣ-ਵਿਆਜ ਦਰ ਉੱਤੇ ਲਗਾਇਆ। ਕੁੱਲ ਵਿਆਜ ${m(2)} ਹੈ। ਦੂਜੀ ਦਰ ਕੱਢੋ।`);
    case "INT-QL-031": return choose(language,
      `${a} ने ${m(0)} को ${t(0)} के लिए ${r(0)} और ${m(1)} को ${r(1)} साधारण ब्याज पर अज्ञात अवधि के लिए लगाया। कुल ब्याज ${m(2)} है। दूसरी अवधि ज्ञात कीजिए।`,
      `${a} ਨੇ ${m(0)} ਨੂੰ ${t(0)} ਲਈ ${r(0)} ਅਤੇ ${m(1)} ਨੂੰ ${r(1)} ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ਅਣਜਾਣ ਮਿਆਦ ਲਈ ਲਗਾਇਆ। ਕੁੱਲ ਵਿਆਜ ${m(2)} ਹੈ। ਦੂਜੀ ਮਿਆਦ ਕੱਢੋ।`);
    case "INT-QL-032": return choose(language,
      `${a} ने ${m(0)} को ${t(0)} और ${m(1)} को ${t(1)} के लिए समान अज्ञात वार्षिक साधारण-ब्याज दर पर लगाया। कुल ब्याज ${m(2)} है। समान वार्षिक दर ज्ञात कीजिए।`,
      `${a} ਨੇ ${m(0)} ਨੂੰ ${t(0)} ਅਤੇ ${m(1)} ਨੂੰ ${t(1)} ਲਈ ਇੱਕੋ ਅਣਜਾਣ ਸਾਲਾਨਾ ਸਧਾਰਣ-ਵਿਆਜ ਦਰ ਉੱਤੇ ਲਗਾਇਆ। ਕੁੱਲ ਵਿਆਜ ${m(2)} ਹੈ। ਸਾਂਝੀ ਸਾਲਾਨਾ ਦਰ ਕੱਢੋ।`);
    case "INT-QL-033": return choose(language,
      `${a} ने कुल ${m(0)} को दो भागों में बाँटा। पहला भाग ${t(0)} के लिए ${r(0)} और शेष भाग ${t(1)} के लिए ${r(1)} साधारण ब्याज पर लगाया गया। कुल ब्याज ${m(1)} है। पहले भाग की राशि ज्ञात कीजिए।`,
      `${a} ਨੇ ਕੁੱਲ ${m(0)} ਨੂੰ ਦੋ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡਿਆ। ਪਹਿਲਾ ਹਿੱਸਾ ${t(0)} ਲਈ ${r(0)} ਅਤੇ ਬਾਕੀ ਹਿੱਸਾ ${t(1)} ਲਈ ${r(1)} ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ਲਗਾਇਆ ਗਿਆ। ਕੁੱਲ ਵਿਆਜ ${m(1)} ਹੈ। ਪਹਿਲੇ ਹਿੱਸੇ ਦੀ ਰਕਮ ਕੱਢੋ।`);
    case "INT-QL-034": return choose(language,
      `${a} ने ${m(0)} को दो भागों में बाँटा। दोनों भाग ${t(0)} के लिए क्रमशः ${r(0)} और ${r(1)} साधारण ब्याज कमाते हैं। कुल ब्याज ${m(1)} है। पहले भाग और दूसरे भाग का अनुपात ज्ञात कीजिए।`,
      `${a} ਨੇ ${m(0)} ਨੂੰ ਦੋ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡਿਆ। ਦੋਵੇਂ ਹਿੱਸੇ ${t(0)} ਲਈ ਕ੍ਰਮਵਾਰ ${r(0)} ਅਤੇ ${r(1)} ਸਧਾਰਣ ਵਿਆਜ ਕਮਾਉਂਦੇ ਹਨ। ਕੁੱਲ ਵਿਆਜ ${m(1)} ਹੈ। ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਹਿੱਸੇ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`);
    case "INT-QL-035": return choose(language,
      `${a} की दो जमाओं पर समान साधारण ब्याज मिलता है। पहली राशि ${m(0)} है जिस पर ${t(0)} के लिए ${r(0)} मिलता है। दूसरी जमा पर ${t(1)} के लिए ${r(1)} मिलता है। दूसरी मूल राशि ज्ञात कीजिए।`,
      `${a} ਦੀਆਂ ਦੋ ਜਮ੍ਹਾਂ ਰਕਮਾਂ ਉੱਤੇ ਬਰਾਬਰ ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ਪਹਿਲੀ ਰਕਮ ${m(0)} ਹੈ ਜਿਸ ਉੱਤੇ ${t(0)} ਲਈ ${r(0)} ਮਿਲਦਾ ਹੈ। ਦੂਜੀ ਜਮ੍ਹਾਂ ਉੱਤੇ ${t(1)} ਲਈ ${r(1)} ਮਿਲਦਾ ਹੈ। ਦੂਜਾ ਮੂਲਧਨ ਕੱਢੋ।`);
    case "INT-QL-036": return choose(language,
      `${a} की दो जमाओं पर समान साधारण ब्याज मिलता है। पहली राशि ${m(0)} पर ${t(0)} के लिए ${r(0)} है और दूसरी राशि ${m(1)} पर ${t(1)} के लिए दर अज्ञात है। दूसरी वार्षिक दर ज्ञात कीजिए।`,
      `${a} ਦੀਆਂ ਦੋ ਜਮ੍ਹਾਂ ਰਕਮਾਂ ਉੱਤੇ ਬਰਾਬਰ ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ਪਹਿਲੀ ਰਕਮ ${m(0)} ਉੱਤੇ ${t(0)} ਲਈ ${r(0)} ਹੈ ਅਤੇ ਦੂਜੀ ਰਕਮ ${m(1)} ਉੱਤੇ ${t(1)} ਲਈ ਦਰ ਅਣਜਾਣ ਹੈ। ਦੂਜੀ ਸਾਲਾਨਾ ਦਰ ਕੱਢੋ।`);
    case "INT-QL-037": return choose(language,
      `${a} को ${m(0)} पर ${t(0)} के लिए ${r(0)} और ${m(1)} पर ${r(1)} साधारण ब्याज से समान ब्याज मिलता है। दूसरी अवधि अज्ञात है। दूसरी अवधि ज्ञात कीजिए।`,
      `${a} ਨੂੰ ${m(0)} ਉੱਤੇ ${t(0)} ਲਈ ${r(0)} ਅਤੇ ${m(1)} ਉੱਤੇ ${r(1)} ਸਧਾਰਣ ਵਿਆਜ ਨਾਲ ਬਰਾਬਰ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ਦੂਜੀ ਮਿਆਦ ਅਣਜਾਣ ਹੈ। ਦੂਜੀ ਮਿਆਦ ਕੱਢੋ।`);
    case "INT-QL-038": return choose(language,
      `दो मूलधन समान साधारण ब्याज कमाते हैं। पहला ${t(0)} के लिए ${r(0)} और दूसरा ${t(1)} के लिए ${r(1)} पर लगाया गया है। पहले मूलधन और दूसरे मूलधन का अनुपात ज्ञात कीजिए।`,
      `ਦੋ ਮੂਲਧਨ ਬਰਾਬਰ ਸਧਾਰਣ ਵਿਆਜ ਕਮਾਉਂਦੇ ਹਨ। ਪਹਿਲਾ ${t(0)} ਲਈ ${r(0)} ਅਤੇ ਦੂਜਾ ${t(1)} ਲਈ ${r(1)} ਉੱਤੇ ਲਗਾਇਆ ਗਿਆ ਹੈ। ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਮੂਲਧਨ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`);
    case "INT-QL-039": return choose(language,
      `${a} ${m(0)} को ${t(0)} के लिए ${r(0)} से ${r(1)} साधारण-ब्याज दर पर ले जाने पर विचार करता है। अधिक दर से कितना अतिरिक्त ब्याज मिलेगा?`,
      `${a} ${m(0)} ਨੂੰ ${t(0)} ਲਈ ${r(0)} ਤੋਂ ${r(1)} ਸਧਾਰਣ-ਵਿਆਜ ਦਰ ਉੱਤੇ ਲਿਜਾਣ ਬਾਰੇ ਸੋਚਦਾ ਹੈ। ਵੱਧ ਦਰ ਨਾਲ ਕਿੰਨਾ ਵਾਧੂ ਵਿਆਜ ਮਿਲੇਗਾ?`);
    case "INT-QL-040": return choose(language,
      `${a} ने ${m(0)} को ${t(0)} के लिए नई साधारण-ब्याज दर ${r(0)} पर लगाया और पहले की तुलना में ${m(1)} अधिक ब्याज कमाया। मूल वार्षिक दर ज्ञात कीजिए।`,
      `${a} ਨੇ ${m(0)} ਨੂੰ ${t(0)} ਲਈ ਨਵੀਂ ਸਧਾਰਣ-ਵਿਆਜ ਦਰ ${r(0)} ਉੱਤੇ ਲਗਾਇਆ ਅਤੇ ਪਹਿਲਾਂ ਨਾਲੋਂ ${m(1)} ਵੱਧ ਵਿਆਜ ਕਮਾਇਆ। ਮੂਲ ਸਾਲਾਨਾ ਦਰ ਕੱਢੋ।`);
    case "INT-QL-041": return choose(language,
      `${a} ने ${m(0)} को ${r(0)} साधारण ब्याज पर रखा। जमा अवधि को ${t(0)} तक बढ़ाने से ब्याज ${m(1)} बढ़ जाता है। मूल अवधि ज्ञात कीजिए।`,
      `${a} ਨੇ ${m(0)} ਨੂੰ ${r(0)} ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ਰੱਖਿਆ। ਜਮ੍ਹਾਂ ਮਿਆਦ ਨੂੰ ${t(0)} ਤੱਕ ਵਧਾਉਣ ਨਾਲ ਵਿਆਜ ${m(1)} ਵੱਧ ਜਾਂਦਾ ਹੈ। ਮੂਲ ਮਿਆਦ ਕੱਢੋ।`);
    case "INT-QL-042": return choose(language,
      `${a} पर ${m(0)} का ऋण ${r(0)} वार्षिक साधारण ब्याज पर है। ${t(0)} के अंत में ${m(1)} चुकाने के बाद शेष मूलधन पर ${t(1)} के अंत तक ब्याज चलता है। कुल ब्याज ज्ञात कीजिए।`,
      `${a} ਉੱਤੇ ${m(0)} ਦਾ ਕਰਜ਼ਾ ${r(0)} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ਹੈ। ${t(0)} ਦੇ ਅੰਤ ਵਿੱਚ ${m(1)} ਵਾਪਸ ਕਰਨ ਤੋਂ ਬਾਅਦ ਬਾਕੀ ਮੂਲਧਨ ਉੱਤੇ ${t(1)} ਦੇ ਅੰਤ ਤੱਕ ਵਿਆਜ ਚਲਦਾ ਹੈ। ਕੁੱਲ ਵਿਆਜ ਕੱਢੋ।`);
    case "INT-QL-043": return choose(language,
      `${a} पर ${m(0)} का ऋण ${r(0)} साधारण ब्याज पर कुल ${t(0)} के लिए है। ${t(1)} बाद मूलधन का एक अज्ञात भाग चुकाया जाता है और कुल ब्याज ${m(1)} है। चुकाई गई मूलधन राशि ज्ञात कीजिए।`,
      `${a} ਉੱਤੇ ${m(0)} ਦਾ ਕਰਜ਼ਾ ${r(0)} ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ਕੁੱਲ ${t(0)} ਲਈ ਹੈ। ${t(1)} ਬਾਅਦ ਮੂਲਧਨ ਦਾ ਇੱਕ ਅਣਜਾਣ ਹਿੱਸਾ ਵਾਪਸ ਕੀਤਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ਕੁੱਲ ਵਿਆਜ ${m(1)} ਹੈ। ਵਾਪਸ ਕੀਤੀ ਮੂਲਧਨ ਰਕਮ ਕੱਢੋ।`);
    case "INT-QL-044": return choose(language,
      `${a} पर ${m(0)} का ऋण ${r(0)} साधारण ब्याज पर कुल ${t(0)} के लिए है। ${m(1)} की अदायगी अज्ञात समय पर की जाती है, जिसके बाद शेष पर ब्याज चलता है। कुल ब्याज ${m(2)} है। अदायगी का समय ज्ञात कीजिए।`,
      `${a} ਉੱਤੇ ${m(0)} ਦਾ ਕਰਜ਼ਾ ${r(0)} ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ਕੁੱਲ ${t(0)} ਲਈ ਹੈ। ${m(1)} ਦੀ ਅਦਾਇਗੀ ਅਣਜਾਣ ਸਮੇਂ ਉੱਤੇ ਕੀਤੀ ਜਾਂਦੀ ਹੈ, ਜਿਸ ਤੋਂ ਬਾਅਦ ਬਾਕੀ ਉੱਤੇ ਵਿਆਜ ਚਲਦਾ ਹੈ। ਕੁੱਲ ਵਿਆਜ ${m(2)} ਹੈ। ਅਦਾਇਗੀ ਦਾ ਸਮਾਂ ਕੱਢੋ।`);
    case "INT-QL-045": return choose(language,
      `${a} पर ${m(0)} का ऋण ${r(0)} साधारण ब्याज पर ${t(0)} तक है। ${m(1)} की अदायगी ${t(1)} या ${t(2)} बाद की जा सकती है। पहले समय पर अदायगी करने से कितना कम ब्याज देना पड़ेगा?`,
      `${a} ਉੱਤੇ ${m(0)} ਦਾ ਕਰਜ਼ਾ ${r(0)} ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ${t(0)} ਤੱਕ ਹੈ। ${m(1)} ਦੀ ਅਦਾਇਗੀ ${t(1)} ਜਾਂ ${t(2)} ਬਾਅਦ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ। ਪਹਿਲੇ ਸਮੇਂ ਉੱਤੇ ਅਦਾਇਗੀ ਕਰਨ ਨਾਲ ਕਿੰਨਾ ਘੱਟ ਵਿਆਜ ਦੇਣਾ ਪਵੇਗਾ?`);
    case "INT-QL-046": return choose(language,
      `${a} ${m(0)} को ${r(0)} वार्षिक साधारण ब्याज पर उधार लेता है और उसी राशि को समान ${t(0)} के लिए ${r(1)} वार्षिक साधारण ब्याज पर उधार देता है। शुद्ध ब्याज लाभ ज्ञात कीजिए।`,
      `${a} ${m(0)} ਨੂੰ ${r(0)} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ਉਧਾਰ ਲੈਂਦਾ ਹੈ ਅਤੇ ਉਸੇ ਰਕਮ ਨੂੰ ਇੱਕੋ ${t(0)} ਲਈ ${r(1)} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ਉਧਾਰ ਦਿੰਦਾ ਹੈ। ਸ਼ੁੱਧ ਵਿਆਜ ਲਾਭ ਕੱਢੋ।`);
    case "INT-QL-047": return choose(language,
      `${a} ${m(0)} को ${r(0)} वार्षिक साधारण ब्याज पर उधार लेता है और उसी राशि को ${t(0)} के लिए उधार देता है। शुद्ध ब्याज लाभ ${m(1)} है। उधार देने की वार्षिक दर ज्ञात कीजिए।`,
      `${a} ${m(0)} ਨੂੰ ${r(0)} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ਉਧਾਰ ਲੈਂਦਾ ਹੈ ਅਤੇ ਉਸੇ ਰਕਮ ਨੂੰ ${t(0)} ਲਈ ਉਧਾਰ ਦਿੰਦਾ ਹੈ। ਸ਼ੁੱਧ ਵਿਆਜ ਲਾਭ ${m(1)} ਹੈ। ਉਧਾਰ ਦੇਣ ਦੀ ਸਾਲਾਨਾ ਦਰ ਕੱਢੋ।`);
    case "INT-QL-048": return choose(language,
      `${a} एक अज्ञात राशि को ${r(0)} साधारण ब्याज पर उधार लेता है और उसी राशि को ${t(0)} के लिए ${r(1)} पर उधार देता है। शुद्ध ब्याज लाभ ${m(0)} है। मूलधन ज्ञात कीजिए।`,
      `${a} ਇੱਕ ਅਣਜਾਣ ਰਕਮ ਨੂੰ ${r(0)} ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ਉਧਾਰ ਲੈਂਦਾ ਹੈ ਅਤੇ ਉਸੇ ਰਕਮ ਨੂੰ ${t(0)} ਲਈ ${r(1)} ਉੱਤੇ ਉਧਾਰ ਦਿੰਦਾ ਹੈ। ਸ਼ੁੱਧ ਵਿਆਜ ਲਾਭ ${m(0)} ਹੈ। ਮੂਲਧਨ ਕੱਢੋ।`);
    case "INT-QL-049": return choose(language,
      `${a} ${m(0)} को ${r(0)} साधारण ब्याज पर उधार लेता है और ${r(1)} पर समान अज्ञात अवधि के लिए उधार देता है। शुद्ध ब्याज लाभ ${m(1)} है। अवधि ज्ञात कीजिए।`,
      `${a} ${m(0)} ਨੂੰ ${r(0)} ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ਉਧਾਰ ਲੈਂਦਾ ਹੈ ਅਤੇ ${r(1)} ਉੱਤੇ ਇੱਕੋ ਅਣਜਾਣ ਮਿਆਦ ਲਈ ਉਧਾਰ ਦਿੰਦਾ ਹੈ। ਸ਼ੁੱਧ ਵਿਆਜ ਲਾਭ ${m(1)} ਹੈ। ਮਿਆਦ ਕੱਢੋ।`);
    case "INT-QL-050": return choose(language,
      `${a} ने ${m(0)} ${inst} में ${r(0)} वार्षिक साधारण ब्याज पर ${d(0)} के लिए जमा किए। घोषित ${basis} मानकर ब्याज ज्ञात कीजिए।`,
      `${a} ਨੇ ${m(0)} ${inst} ਵਿੱਚ ${r(0)} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ${d(0)} ਲਈ ਜਮ੍ਹਾਂ ਕੀਤੇ। ਘੋਸ਼ਿਤ ${basis} ਮੰਨ ਕੇ ਵਿਆਜ ਕੱਢੋ।`);
    case "INT-QL-051": return choose(language,
      `${a} ने ${m(0)} ${inst} में ${r(0)} वार्षिक साधारण ब्याज पर जमा किए। घोषित ${basis} के अनुसार ब्याज ${m(1)} है। राशि कितने दिन जमा रही?`,
      `${a} ਨੇ ${m(0)} ${inst} ਵਿੱਚ ${r(0)} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ਜਮ੍ਹਾਂ ਕੀਤੇ। ਘੋਸ਼ਿਤ ${basis} ਅਨੁਸਾਰ ਵਿਆਜ ${m(1)} ਹੈ। ਰਕਮ ਕਿੰਨੇ ਦਿਨ ਜਮ੍ਹਾਂ ਰਹੀ?`);
    case "INT-QL-052": return choose(language,
      `${a} ने ${m(0)} ${inst} में ${r(0)} साधारण ब्याज पर ${d(0)} के लिए जमा किए। घोषित 360-दिन वाणिज्यिक वर्ष का ब्याज घोषित 365-दिन वर्ष के ब्याज से कितना अधिक है?`,
      `${a} ਨੇ ${m(0)} ${inst} ਵਿੱਚ ${r(0)} ਸਧਾਰਣ ਵਿਆਜ ਉੱਤੇ ${d(0)} ਲਈ ਜਮ੍ਹਾਂ ਕੀਤੇ। ਘੋਸ਼ਿਤ 360-ਦਿਨ ਵਪਾਰਕ ਸਾਲ ਦਾ ਵਿਆਜ ਘੋਸ਼ਿਤ 365-ਦਿਨ ਸਾਲ ਦੇ ਵਿਆਜ ਨਾਲੋਂ ਕਿੰਨਾ ਵੱਧ ਹੈ?`);
  }
}

function localizeOption(text: string, semantic: string, language: IntCp002LocalizedLanguage): string {
  if (semantic === "TIME_YEARS") return localTime(text, language);
  if (semantic === "DAYS") return localDays(text, language);
  return text;
}

function calculationOnlySteps(
  source: IntCp002EnglishFrozenQuestion,
  language: IntCp002LocalizedLanguage,
): readonly string[] {
  const prefix = language === "hi" ? "गणना:" : "ਗਣਨਾ:";
  const sourceSteps = source.explanation.workedSteps;
  const rendered = sourceSteps.map((step) => {
    const math = step.match(/\$\$[\s\S]*?\$\$|\$[^$]+\$/gu) ?? [];
    if (math.length) return `${prefix} ${math.join(" ; ")}`;
    const direct = step.match(/[^.]*[0-9][^.]*[=×÷+−/][^.]*[0-9][^.]*/u)?.[0]?.trim();
    if (direct) return `${prefix} ${direct}`;
    throw new Error(`${source.qlId}/${language}: a CP002 worked step has no recoverable numerical calculation.`);
  });
  return Object.freeze(rendered.slice(0, 6));
}

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

export function generateIntCp002LocalizedFrozenQuestionV1(
  qlId: IntCp002FinalQlId,
  seed: string,
  language: IntCp002LocalizedLanguage,
) {
  if (!(INT_CP002_FINAL_QL_IDS as readonly string[]).includes(qlId)) throw new Error(`Unknown CP002 QL '${qlId}'.`);
  const source = generateIntCp002EnglishFrozenQuestion(qlId, seed);
  const options = Object.freeze(source.options.map((option) => localizeOption(option, source.answerSemantic, language)));
  if (options.length !== 4 || new Set(options).size !== 4) throw new Error(`${qlId}/${language}: localized options are not four unique choices.`);
  const correctAnswer = options[source.correctIndex]!;
  const workedSteps = calculationOnlySteps(source, language);
  const answerLine = choose(language, `उत्तर: ${correctAnswer}`, `ਉੱਤਰ: ${correctAnswer}`);
  const explanation = Object.freeze({
    ...source.explanation,
    mainRule: "",
    workedSteps,
    examShortcut: "",
    verification: "",
    conclusion: answerLine,
    trapAnalysis: Object.freeze([]),
  });
  const optionAudit = Object.freeze(source.optionAudit.map((option, index) => Object.freeze({
    ...option,
    text: options[index]!,
    explanation: "",
  })));
  const stem = localizedStem(qlId, source.stem, language);
  const targetScript = language === "hi" ? /[ऀ-ॿ]/u : /[਀-੿]/u;
  if (!targetScript.test(stem)) throw new Error(`${qlId}/${language}: localized stem lacks target script.`);
  if (/\b(?:find|interest|principal|rate|year|years|deposit|deposits|invest|borrows?|lends?|amount|simple|unknown|commercial|days?|repayment|period|combined|first|second)\b/iu.test(stem)) {
    throw new Error(`${qlId}/${language}: English learner prose survived CP002 stem localization.`);
  }

  return deepFreeze({
    ...source,
    freezeId: INT_CP002_HI_PA_FREEZE_V1.freezeId,
    sourceEnglishFreezeId: source.freezeId,
    language,
    locale: language === "hi" ? "hi-IN" as const : "pa-IN" as const,
    questionLanguageId: `${qlId}:${language}`,
    stem,
    options,
    optionAudit,
    correctAnswer,
    explanation,
    maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN" as const,
    reviewStatus: "APPROVED_MULTILINGUAL_FROZEN" as const,
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: true as const,
    localization: Object.freeze({
      version: INT_CP002_HI_PA_FREEZE_V1.freezeId,
      sourceEnglishFreezeId: source.freezeId,
      canonicalQlId: qlId,
      canonicalSeed: seed,
      language,
      mathematicalStateChanged: false as const,
      optionValuesChanged: false as const,
      correctIndexChanged: false as const,
    }),
    lifecycle: Object.freeze({
      permanentQlId: qlId,
      maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN" as const,
      reviewStatus: "APPROVED_MULTILINGUAL_FROZEN" as const,
      enabled: false as const,
      stagingStatus: "NOT_STAGED" as const,
      registrationStatus: "NOT_REGISTERED" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
    }),
  });
}