import { divide, equals, formatRational, rational, toMixedLatex } from "./rational";
import type { Rational } from "./types";
import type { TmwCp006GeneratedQuestion, TmwCp006Parameters } from "./cp006-types";
import type { TmwLocalizedLanguage } from "./localization-types";

type Pair = { hi: string; pa: string };

const copy: Record<string, Pair> = {
  "a boundary wall": { hi: "चारदीवारी का निर्माण", pa: "ਚਾਰਦੀਵਾਰੀ ਦਾ ਨਿਰਮਾਣ" },
  "a road-repair contract": { hi: "सड़क-मरम्मत का ठेका", pa: "ਸੜਕ ਮੁਰੰਮਤ ਦਾ ਠੇਕਾ" },
  "a document-verification batch": { hi: "दस्तावेज़ सत्यापन की खेप", pa: "ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ ਦੀ ਖੇਪ" },
  "a packaging order": { hi: "पैकिंग का ऑर्डर", pa: "ਪੈਕਿੰਗ ਦਾ ਆਰਡਰ" },
  "a painting contract": { hi: "रंगाई का ठेका", pa: "ਰੰਗ ਕਰਨ ਦਾ ਠੇਕਾ" },
  "an inspection assignment": { hi: "निरीक्षण का कार्य", pa: "ਜਾਂਚ ਦਾ ਕੰਮ" },
  "a warehouse sorting assignment": { hi: "गोदाम में छँटाई का कार्य", pa: "ਗੋਦਾਮ ਵਿੱਚ ਛਾਂਟਣ ਦਾ ਕੰਮ" },
  "a data-entry backlog": { hi: "डेटा-एंट्री का लंबित कार्य", pa: "ਡਾਟਾ ਐਂਟਰੀ ਦਾ ਬਕਾਇਆ ਕੰਮ" },
  "a landscaping contract": { hi: "भूदृश्य-सज्जा का कार्य", pa: "ਲੈਂਡਸਕੇਪਿੰਗ ਦਾ ਕੰਮ" },
  "a field-survey assignment": { hi: "मैदानी सर्वेक्षण का कार्य", pa: "ਮੈਦਾਨੀ ਸਰਵੇਖਣ ਦਾ ਕੰਮ" },
  "a quality-control batch": { hi: "गुणवत्ता-जाँच की खेप", pa: "ਗੁਣਵੱਤਾ ਜਾਂਚ ਦੀ ਖੇਪ" },
  "a loading assignment": { hi: "माल चढ़ाने का कार्य", pa: "ਮਾਲ ਚੜ੍ਹਾਉਣ ਦਾ ਕੰਮ" },
  "a component-production order": { hi: "पुर्ज़ों के उत्पादन का ऑर्डर", pa: "ਪੁਰਜ਼ਿਆਂ ਦੇ ਉਤਪਾਦਨ ਦਾ ਆਰਡਰ" },
  "a printing order": { hi: "छपाई का ऑर्डर", pa: "ਛਪਾਈ ਦਾ ਆਰਡਰ" },
  "a bottling target": { hi: "बोतल भरने का लक्ष्य", pa: "ਬੋਤਲਾਂ ਭਰਨ ਦਾ ਟੀਚਾ" },
  "an assembly target": { hi: "असेंबली का लक्ष्य", pa: "ਅਸੈਂਬਲੀ ਦਾ ਟੀਚਾ" },
  "a label-printing order": { hi: "लेबल छपाई का ऑर्डर", pa: "ਲੇਬਲ ਛਪਾਈ ਦਾ ਆਰਡਰ" },
  "a textile production order": { hi: "कपड़ा उत्पादन का ऑर्डर", pa: "ਕੱਪੜਾ ਉਤਪਾਦਨ ਦਾ ਆਰਡਰ" },
  "a machining order": { hi: "मशीनिंग का ऑर्डर", pa: "ਮਸ਼ੀਨਿੰਗ ਦਾ ਆਰਡਰ" },
  "a carton-sealing target": { hi: "कार्टन सील करने का लक्ष्य", pa: "ਕਾਰਟਨ ਸੀਲ ਕਰਨ ਦਾ ਟੀਚਾ" },
  "a wall face": { hi: "दीवार की सतह", pa: "ਕੰਧ ਦੀ ਸਤਹ" },
  "a road surface": { hi: "सड़क की सतह", pa: "ਸੜਕ ਦੀ ਸਤਹ" },
  "a masonry wall": { hi: "ईंटों की दीवार", pa: "ਇੱਟਾਂ ਦੀ ਕੰਧ" },
  "an excavation pit": { hi: "खुदाई का गड्ढा", pa: "ਖੁਦਾਈ ਦਾ ਖੱਡਾ" },
  "the available food stock": { hi: "उपलब्ध खाद्य भंडार", pa: "ਉਪਲਬਧ ਖਾਣੇ ਦਾ ਭੰਡਾਰ" },

  worker: { hi: "श्रमिक", pa: "ਮਜ਼ਦੂਰ" },
  workers: { hi: "श्रमिक", pa: "ਮਜ਼ਦੂਰ" },
  clerk: { hi: "क्लर्क", pa: "ਕਲਰਕ" },
  clerks: { hi: "क्लर्क", pa: "ਕਲਰਕ" },
  packer: { hi: "पैकिंग कर्मी", pa: "ਪੈਕਿੰਗ ਕਰਮਚਾਰੀ" },
  packers: { hi: "पैकिंग कर्मी", pa: "ਪੈਕਿੰਗ ਕਰਮਚਾਰੀ" },
  painter: { hi: "पेंटर", pa: "ਪੇਂਟਰ" },
  painters: { hi: "पेंटर", pa: "ਪੇਂਟਰ" },
  inspector: { hi: "निरीक्षक", pa: "ਜਾਂਚ ਕਰਮਚਾਰੀ" },
  inspectors: { hi: "निरीक्षक", pa: "ਜਾਂਚ ਕਰਮਚਾਰੀ" },
  sorter: { hi: "छँटाई कर्मी", pa: "ਛਾਂਟਣ ਕਰਮਚਾਰੀ" },
  sorters: { hi: "छँटाई कर्मी", pa: "ਛਾਂਟਣ ਕਰਮਚਾਰੀ" },
  operator: { hi: "ऑपरेटर", pa: "ਓਪਰੇਟਰ" },
  operators: { hi: "ऑपरेटर", pa: "ਓਪਰੇਟਰ" },
  gardener: { hi: "माली", pa: "ਮਾਲੀ" },
  gardeners: { hi: "माली", pa: "ਮਾਲੀ" },
  surveyor: { hi: "सर्वेक्षक", pa: "ਸਰਵੇਖਕ" },
  surveyors: { hi: "सर्वेक्षक", pa: "ਸਰਵੇਖਕ" },
  technician: { hi: "तकनीशियन", pa: "ਤਕਨੀਸ਼ੀਅਨ" },
  technicians: { hi: "तकनीशियन", pa: "ਤਕਨੀਸ਼ੀਅਨ" },
  loader: { hi: "लोडिंग कर्मी", pa: "ਲੋਡਿੰਗ ਕਰਮਚਾਰੀ" },
  loaders: { hi: "लोडिंग कर्मी", pa: "ਲੋਡਿੰਗ ਕਰਮਚਾਰੀ" },
  machine: { hi: "मशीन", pa: "ਮਸ਼ੀਨ" },
  machines: { hi: "मशीनें", pa: "ਮਸ਼ੀਨਾਂ" },
  printer: { hi: "प्रिंटिंग मशीन", pa: "ਪ੍ਰਿੰਟਿੰਗ ਮਸ਼ੀਨ" },
  printers: { hi: "प्रिंटिंग मशीनें", pa: "ਪ੍ਰਿੰਟਿੰਗ ਮਸ਼ੀਨਾਂ" },
  "bottling line": { hi: "बोतल भरने वाली लाइन", pa: "ਬੋਤਲ ਭਰਨ ਵਾਲੀ ਲਾਈਨ" },
  "bottling lines": { hi: "बोतल भरने वाली लाइनें", pa: "ਬੋਤਲ ਭਰਨ ਵਾਲੀਆਂ ਲਾਈਨਾਂ" },
  "assembly unit": { hi: "असेंबली इकाई", pa: "ਅਸੈਂਬਲੀ ਇਕਾਈ" },
  "assembly units": { hi: "असेंबली इकाइयाँ", pa: "ਅਸੈਂਬਲੀ ਇਕਾਈਆਂ" },
  "labeling machine": { hi: "लेबलिंग मशीन", pa: "ਲੇਬਲਿੰਗ ਮਸ਼ੀਨ" },
  "labeling machines": { hi: "लेबलिंग मशीनें", pa: "ਲੇਬਲਿੰਗ ਮਸ਼ੀਨਾਂ" },
  loom: { hi: "करघा", pa: "ਖੱਡੀ" },
  looms: { hi: "करघे", pa: "ਖੱਡੀਆਂ" },
  "CNC machine": { hi: "सीएनसी मशीन", pa: "ਸੀਐਨਸੀ ਮਸ਼ੀਨ" },
  "CNC machines": { hi: "सीएनसी मशीनें", pa: "ਸੀਐਨਸੀ ਮਸ਼ੀਨਾਂ" },
  "sealing line": { hi: "सीलिंग लाइन", pa: "ਸੀਲਿੰਗ ਲਾਈਨ" },
  "sealing lines": { hi: "सीलिंग लाइनें", pa: "ਸੀਲਿੰਗ ਲਾਈਨਾਂ" },
  person: { hi: "व्यक्ति", pa: "ਵਿਅਕਤੀ" },
  people: { hi: "लोग", pa: "ਲੋਕ" },

  "work units": { hi: "कार्य-इकाइयाँ", pa: "ਕੰਮ ਇਕਾਈਆਂ" },
  applications: { hi: "आवेदन", pa: "ਅਰਜ਼ੀਆਂ" },
  packages: { hi: "पैकेट", pa: "ਪੈਕੇਟ" },
  units: { hi: "इकाइयाँ", pa: "ਇਕਾਈਆਂ" },
  components: { hi: "पुर्ज़े", pa: "ਪੁਰਜ਼ੇ" },
  copies: { hi: "प्रतियाँ", pa: "ਕਾਪੀਆਂ" },
  parcels: { hi: "पार्सल", pa: "ਪਾਰਸਲ" },
  records: { hi: "रिकॉर्ड", pa: "ਰਿਕਾਰਡ" },
  sections: { hi: "खंड", pa: "ਹਿੱਸੇ" },
  forms: { hi: "फॉर्म", pa: "ਫਾਰਮ" },
  consignments: { hi: "खेपें", pa: "ਖੇਪਾਂ" },
  labels: { hi: "लेबल", pa: "ਲੇਬਲ" },
  "metres of fabric": { hi: "मीटर कपड़ा", pa: "ਮੀਟਰ ਕੱਪੜਾ" },
  cartons: { hi: "कार्टन", pa: "ਕਾਰਟਨ" },
  bottles: { hi: "बोतलें", pa: "ਬੋਤਲਾਂ" },
  "person-days of food": { hi: "व्यक्ति-दिन का भोजन", pa: "ਵਿਅਕਤੀ-ਦਿਨ ਦਾ ਖਾਣਾ" },

  "worker-days": { hi: "श्रमिक-दिन", pa: "ਮਜ਼ਦੂਰ-ਦਿਨ" },
  "clerk-days": { hi: "क्लर्क-दिन", pa: "ਕਲਰਕ-ਦਿਨ" },
  "packer-days": { hi: "पैकिंग-कर्मी-दिन", pa: "ਪੈਕਿੰਗ-ਕਰਮਚਾਰੀ-ਦਿਨ" },
  "painter-days": { hi: "पेंटर-दिन", pa: "ਪੇਂਟਰ-ਦਿਨ" },
  "inspector-days": { hi: "निरीक्षक-दिन", pa: "ਜਾਂਚ-ਕਰਮਚਾਰੀ-ਦਿਨ" },
  "sorter-days": { hi: "छँटाई-कर्मी-दिन", pa: "ਛਾਂਟਣ-ਕਰਮਚਾਰੀ-ਦਿਨ" },
  "operator-days": { hi: "ऑपरेटर-दिन", pa: "ਓਪਰੇਟਰ-ਦਿਨ" },
  "gardener-days": { hi: "माली-दिन", pa: "ਮਾਲੀ-ਦਿਨ" },
  "surveyor-days": { hi: "सर्वेक्षक-दिन", pa: "ਸਰਵੇਖਕ-ਦਿਨ" },
  "technician-days": { hi: "तकनीशियन-दिन", pa: "ਤਕਨੀਸ਼ੀਅਨ-ਦਿਨ" },
  "loader-days": { hi: "लोडिंग-कर्मी-दिन", pa: "ਲੋਡਿੰਗ-ਕਰਮਚਾਰੀ-ਦਿਨ" },
  "machine-hours": { hi: "मशीन-घंटे", pa: "ਮਸ਼ੀਨ-ਘੰਟੇ" },
  "printer-hours": { hi: "प्रिंटिंग-मशीन-घंटे", pa: "ਪ੍ਰਿੰਟਿੰਗ-ਮਸ਼ੀਨ-ਘੰਟੇ" },
  "person-days": { hi: "व्यक्ति-दिन", pa: "ਵਿਅਕਤੀ-ਦਿਨ" },

  length: { hi: "लंबाई", pa: "ਲੰਬਾਈ" },
  height: { hi: "ऊँचाई", pa: "ਉਚਾਈ" },
  width: { hi: "चौड़ाई", pa: "ਚੌੜਾਈ" },
  thickness: { hi: "मोटाई", pa: "ਮੋਟਾਈ" },
  depth: { hi: "गहराई", pa: "ਡੂੰਘਾਈ" },
};

export function cp006Copy(value: string, language: TmwLocalizedLanguage): string {
  return copy[value]?.[language] ?? value;
}

export function cp006Number(value: Rational): string {
  if (value.denominator === 1) return String(value.numerator);
  return `\\(${toMixedLatex(value)}\\)`;
}

export function cp006Resource(
  p: TmwCp006Parameters,
  value: Rational,
  language: TmwLocalizedLanguage,
): string {
  const noun = equals(value, rational(1)) ? p.context.resourceSingular : p.context.resourcePlural;
  return `${cp006Number(value)} ${cp006Copy(noun, language)}`;
}

export function cp006Days(value: Rational, language: TmwLocalizedLanguage, oblique = false): string {
  const n = cp006Number(value);
  if (language === "hi") {
    if (equals(value, rational(1))) return oblique ? "एक दिन में" : "1 दिन";
    return oblique ? `${n} दिनों में` : `${n} दिन`;
  }
  if (equals(value, rational(1))) return oblique ? "ਇੱਕ ਦਿਨ ਵਿੱਚ" : "1 ਦਿਨ";
  return oblique ? `${n} ਦਿਨਾਂ ਵਿੱਚ` : `${n} ਦਿਨ`;
}

export function cp006Hours(value: Rational, language: TmwLocalizedLanguage): string {
  const n = cp006Number(value);
  if (language === "hi") return equals(value, rational(1)) ? "1 घंटा" : `${n} घंटे`;
  return equals(value, rational(1)) ? "1 ਘੰਟਾ" : `${n} ਘੰਟੇ`;
}

export function cp006HoursPerDay(value: Rational, language: TmwLocalizedLanguage): string {
  return language === "hi" ? `प्रतिदिन ${cp006Hours(value, language)}` : `ਹਰ ਦਿਨ ${cp006Hours(value, language)}`;
}

export function cp006WorkRelation(p: TmwCp006Parameters, language: TmwLocalizedLanguage): string {
  const ratio = divide(p.stateB.work, p.stateA.work);
  if (equals(ratio, rational(1))) return language === "hi" ? "उतना ही काम" : "ਉਤਨਾ ਹੀ ਕੰਮ";
  return language === "hi"
    ? `मूल काम का ${cp006Number(ratio)} गुना काम`
    : `ਮੂਲ ਕੰਮ ਦਾ ${cp006Number(ratio)} ਗੁਣਾ ਕੰਮ`;
}

export function cp006EfficiencyRelation(p: TmwCp006Parameters, language: TmwLocalizedLanguage): string {
  const ratio = divide(p.stateB.efficiency, p.stateA.efficiency);
  if (equals(ratio, rational(1))) return language === "hi" ? "समान दक्षता पर" : "ਇੱਕੋ ਦੱਖਤਾ ਉੱਤੇ";
  return language === "hi"
    ? `मूल दक्षता की ${cp006Number(ratio)} गुनी दक्षता पर`
    : `ਮੂਲ ਦੱਖਤਾ ਦੀ ${cp006Number(ratio)} ਗੁਣੀ ਦੱਖਤਾ ਉੱਤੇ`;
}

export function cp006Dimensions(
  values: Rational[],
  labels: string[],
  language: TmwLocalizedLanguage,
): string {
  return labels.map((label, index) => `${cp006Copy(label, language)} ${cp006Number(values[index] ?? rational(0))} मीटर`).join(", ");
}

export function cp006LocalizedAnswerText(
  source: TmwCp006GeneratedQuestion,
  value: Rational,
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const n = cp006Number(value);
  switch (source.solution.answerType) {
    case "COUNT":
      return cp006Resource(p, value, language);
    case "TIME":
      return cp006Days(value, language);
    case "HOURS":
      if (source.solveMode === "findOvertimeHoursForDeadline") {
        return language === "hi" ? `प्रतिदिन ${cp006Hours(value, language)} अतिरिक्त` : `ਹਰ ਦਿਨ ${cp006Hours(value, language)} ਵਾਧੂ`;
      }
      return cp006HoursPerDay(value, language);
    case "EFFICIENCY":
      return language === "hi" ? `मूल दक्षता की ${n} गुनी` : `ਮੂਲ ਦੱਖਤਾ ਦੀ ${n} ਗੁਣੀ`;
    case "WORK":
      return `${n} ${cp006Copy(p.context.outputUnit, language)}`;
    case "RATIO":
      return `${Math.abs(value.numerator)}:${value.denominator}`;
    case "PERCENT":
      return `${formatRational(value)}%`;
    case "SHIFT":
      if (language === "hi") return equals(value, rational(1)) ? "1 पाली" : `${n} पालियाँ`;
      return equals(value, rational(1)) ? "1 ਸ਼ਿਫ਼ਟ" : `${n} ਸ਼ਿਫ਼ਟਾਂ`;
    case "RESOURCE_TIME":
      return `${n} ${cp006Copy(p.context.resourceTimeUnit, language)}`;
  }
}
