import type { Avg001Cp004PilotLanguage, Avg001Cp004UnitKind } from "./cp004-localization-types";

export type Avg001Cp004RatioUnit = Avg001Cp004UnitKind | "rainfall" | "thousandCurrency";

type RatioWords = {
  firstAverage: string;
  secondAverage: string;
  combinedAverage: string;
  ratio: string;
  unit: Avg001Cp004RatioUnit;
};

const RATIO_HI: readonly RatioWords[] = [
  { firstAverage: "पहली कक्षा के अंकों का औसत", secondAverage: "दूसरी कक्षा के अंकों का औसत", combinedAverage: "दोनों कक्षाओं के अंकों का संयुक्त औसत", ratio: "पहली और दूसरी कक्षा के विद्यार्थियों की संख्याओं का अनुपात", unit: "marks" },
  { firstAverage: "पहले विभाग का औसत उत्पादन", secondAverage: "दूसरे विभाग का औसत उत्पादन", combinedAverage: "दोनों विभागों का संयुक्त औसत उत्पादन", ratio: "पहले और दूसरे विभाग के कर्मचारियों की संख्याओं का अनुपात", unit: "units" },
  { firstAverage: "पहली टीम के खिलाड़ियों के औसत रन", secondAverage: "दूसरी टीम के खिलाड़ियों के औसत रन", combinedAverage: "दोनों टीमों का संयुक्त बल्लेबाजी औसत", ratio: "पहली और दूसरी टीम के खिलाड़ियों की संख्याओं का अनुपात", unit: "runs" },
  { firstAverage: "पहले कर्मचारी-समूह की औसत आयु", secondAverage: "दूसरे कर्मचारी-समूह की औसत आयु", combinedAverage: "दोनों कर्मचारी-समूहों की संयुक्त औसत आयु", ratio: "पहले और दूसरे कर्मचारी-समूह के सदस्यों की संख्याओं का अनुपात", unit: "years" },
  { firstAverage: "पहली उत्पादन इकाई का औसत उत्पादन", secondAverage: "दूसरी उत्पादन इकाई का औसत उत्पादन", combinedAverage: "दोनों उत्पादन इकाइयों का संयुक्त औसत उत्पादन", ratio: "पहली और दूसरी उत्पादन इकाई की मशीनों की संख्याओं का अनुपात", unit: "units" },
  { firstAverage: "पहले जिले की औसत वर्षा", secondAverage: "दूसरे जिले की औसत वर्षा", combinedAverage: "दोनों जिलों की संयुक्त औसत वर्षा", ratio: "पहले और दूसरे जिले के प्रेक्षणों की संख्याओं का अनुपात", unit: "rainfall" },
  { firstAverage: "पहले प्रशिक्षण बैच के अंकों का औसत", secondAverage: "दूसरे प्रशिक्षण बैच के अंकों का औसत", combinedAverage: "दोनों प्रशिक्षण बैचों के अंकों का संयुक्त औसत", ratio: "पहले और दूसरे बैच के प्रशिक्षुओं की संख्याओं का अनुपात", unit: "marks" },
  { firstAverage: "पहले खाता-समूह का औसत शेष", secondAverage: "दूसरे खाता-समूह का औसत शेष", combinedAverage: "दोनों खाता-समूहों का संयुक्त औसत शेष", ratio: "पहले और दूसरे समूह के खातों की संख्याओं का अनुपात", unit: "thousandCurrency" },
];

const RATIO_PA: readonly RatioWords[] = [
  { firstAverage: "ਪਹਿਲੀ ਜਮਾਤ ਦੇ ਅੰਕਾਂ ਦੀ ਔਸਤ", secondAverage: "ਦੂਜੀ ਜਮਾਤ ਦੇ ਅੰਕਾਂ ਦੀ ਔਸਤ", combinedAverage: "ਦੋਵਾਂ ਜਮਾਤਾਂ ਦੇ ਅੰਕਾਂ ਦੀ ਸੰਯੁਕਤ ਔਸਤ", ratio: "ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਜਮਾਤ ਦੇ ਵਿਦਿਆਰਥੀਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਅਨੁਪਾਤ", unit: "marks" },
  { firstAverage: "ਪਹਿਲੇ ਵਿਭਾਗ ਦਾ ਔਸਤ ਉਤਪਾਦਨ", secondAverage: "ਦੂਜੇ ਵਿਭਾਗ ਦਾ ਔਸਤ ਉਤਪਾਦਨ", combinedAverage: "ਦੋਵਾਂ ਵਿਭਾਗਾਂ ਦਾ ਸੰਯੁਕਤ ਔਸਤ ਉਤਪਾਦਨ", ratio: "ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਵਿਭਾਗ ਦੇ ਕਰਮਚਾਰੀਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਅਨੁਪਾਤ", unit: "units" },
  { firstAverage: "ਪਹਿਲੀ ਟੀਮ ਦੇ ਖਿਡਾਰੀਆਂ ਦੀਆਂ ਔਸਤ ਦੌੜਾਂ", secondAverage: "ਦੂਜੀ ਟੀਮ ਦੇ ਖਿਡਾਰੀਆਂ ਦੀਆਂ ਔਸਤ ਦੌੜਾਂ", combinedAverage: "ਦੋਵਾਂ ਟੀਮਾਂ ਦੀ ਸੰਯੁਕਤ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ", ratio: "ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਟੀਮ ਦੇ ਖਿਡਾਰੀਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਅਨੁਪਾਤ", unit: "runs" },
  { firstAverage: "ਪਹਿਲੇ ਕਰਮਚਾਰੀ-ਸਮੂਹ ਦੀ ਔਸਤ ਉਮਰ", secondAverage: "ਦੂਜੇ ਕਰਮਚਾਰੀ-ਸਮੂਹ ਦੀ ਔਸਤ ਉਮਰ", combinedAverage: "ਦੋਵਾਂ ਕਰਮਚਾਰੀ-ਸਮੂਹਾਂ ਦੀ ਸੰਯੁਕਤ ਔਸਤ ਉਮਰ", ratio: "ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਕਰਮਚਾਰੀ-ਸਮੂਹ ਦੇ ਮੈਂਬਰਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਅਨੁਪਾਤ", unit: "years" },
  { firstAverage: "ਪਹਿਲੀ ਉਤਪਾਦਨ ਇਕਾਈ ਦਾ ਔਸਤ ਉਤਪਾਦਨ", secondAverage: "ਦੂਜੀ ਉਤਪਾਦਨ ਇਕਾਈ ਦਾ ਔਸਤ ਉਤਪਾਦਨ", combinedAverage: "ਦੋਵਾਂ ਉਤਪਾਦਨ ਇਕਾਈਆਂ ਦਾ ਸੰਯੁਕਤ ਔਸਤ ਉਤਪਾਦਨ", ratio: "ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਉਤਪਾਦਨ ਇਕਾਈ ਦੀਆਂ ਮਸ਼ੀਨਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਅਨੁਪਾਤ", unit: "units" },
  { firstAverage: "ਪਹਿਲੇ ਜ਼ਿਲ੍ਹੇ ਦੀ ਔਸਤ ਵਰਖਾ", secondAverage: "ਦੂਜੇ ਜ਼ਿਲ੍ਹੇ ਦੀ ਔਸਤ ਵਰਖਾ", combinedAverage: "ਦੋਵਾਂ ਜ਼ਿਲ੍ਹਿਆਂ ਦੀ ਸੰਯੁਕਤ ਔਸਤ ਵਰਖਾ", ratio: "ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਜ਼ਿਲ੍ਹੇ ਦੇ ਮਾਪਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਅਨੁਪਾਤ", unit: "rainfall" },
  { firstAverage: "ਪਹਿਲੇ ਸਿਖਲਾਈ ਬੈਚ ਦੇ ਅੰਕਾਂ ਦੀ ਔਸਤ", secondAverage: "ਦੂਜੇ ਸਿਖਲਾਈ ਬੈਚ ਦੇ ਅੰਕਾਂ ਦੀ ਔਸਤ", combinedAverage: "ਦੋਵਾਂ ਸਿਖਲਾਈ ਬੈਚਾਂ ਦੇ ਅੰਕਾਂ ਦੀ ਸੰਯੁਕਤ ਔਸਤ", ratio: "ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਬੈਚ ਦੇ ਸਿਖਿਆਰਥੀਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਅਨੁਪਾਤ", unit: "marks" },
  { firstAverage: "ਪਹਿਲੇ ਖਾਤਾ-ਸਮੂਹ ਦਾ ਔਸਤ ਬਕਾਇਆ", secondAverage: "ਦੂਜੇ ਖਾਤਾ-ਸਮੂਹ ਦਾ ਔਸਤ ਬਕਾਇਆ", combinedAverage: "ਦੋਵਾਂ ਖਾਤਾ-ਸਮੂਹਾਂ ਦਾ ਸੰਯੁਕਤ ਔਸਤ ਬਕਾਇਆ", ratio: "ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਸਮੂਹ ਦੇ ਖਾਤਿਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਅਨੁਪਾਤ", unit: "thousandCurrency" },
];

const TRAVEL_HI = ["बस", "डिलीवरी वैन", "रेलगाड़ी", "कार", "सेवा वाहन", "निरीक्षण वाहन"] as const;
const TRAVEL_PA = ["ਬੱਸ", "ਡਿਲਿਵਰੀ ਵੈਨ", "ਰੇਲਗੱਡੀ", "ਕਾਰ", "ਸੇਵਾ ਵਾਹਨ", "ਜਾਂਚ ਵਾਹਨ"] as const;

export function avg001Cp004GapIndex(scenarioVariant: string) {
  const index = Number(scenarioVariant.split(":").at(-1));
  if (!Number.isInteger(index) || index < 1) throw new Error(`Invalid CP-004 gap scenario ${scenarioVariant}`);
  return index;
}

export function avg001Cp004RatioLexicon(scenarioVariant: string, language: Avg001Cp004PilotLanguage) {
  const value = (language === "hi" ? RATIO_HI : RATIO_PA)[avg001Cp004GapIndex(scenarioVariant) - 1];
  if (!value) throw new Error(`Missing CP-004 ratio lexicon for ${scenarioVariant}`);
  return value;
}

export function avg001Cp004TravelSubject(scenarioVariant: string, language: Avg001Cp004PilotLanguage) {
  const value = (language === "hi" ? TRAVEL_HI : TRAVEL_PA)[avg001Cp004GapIndex(scenarioVariant) - 1];
  if (!value) throw new Error(`Missing CP-004 travel lexicon for ${scenarioVariant}`);
  return value;
}
