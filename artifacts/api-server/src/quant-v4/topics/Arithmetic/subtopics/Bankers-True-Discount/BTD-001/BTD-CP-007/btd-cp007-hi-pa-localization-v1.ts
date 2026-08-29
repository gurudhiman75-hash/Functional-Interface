import { createHash } from "node:crypto";
import { buildBtdDiscoveryQuestionV6 } from "../btd-cp001-breadth-remediation-v6";
import { BTD_PERMANENT_QL_REGISTRY, type BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { buildBtdCp002CandidateQuestion } from "../BTD-CP-002/btd-cp002-source-saturation-v2";
import { buildBtdFrozenEnglishQuestionV1 } from "../BTD-CP-005/btd-cp005-english-freeze-v1";

export const BTD_CP007_LOCALIZATION_VERSION = "BTD-001-CP007-HI-PA-LOCALIZATION-v1" as const;
export const BTD_CP007_LANGUAGES = ["hi", "pa"] as const;
export type BtdCp007Language = typeof BTD_CP007_LANGUAGES[number];

type AnyRecord = Record<string, any>;

function t(language: BtdCp007Language, hi: string, pa: string) { return language === "hi" ? hi : pa; }
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
  }
  if (typeof value === "bigint") return JSON.stringify(value.toString());
  return JSON.stringify(value);
}
function fingerprint(value: unknown) { return createHash("sha256").update(canonicalJson(value)).digest("hex"); }
function numeric(value: any) { return value && typeof value === "object" && "n" in value && "d" in value ? Number(value.n) / Number(value.d) : Number(value); }
function numberText(value: number, digits = 2) {
  return value.toFixed(digits).replace(/\.00$/u, "").replace(/(\.\d)0$/u, "$1");
}
function indianNumber(value: number) {
  const fixed = numberText(value);
  const [whole, fraction] = fixed.split(".");
  const negative = whole.startsWith("-");
  const digits = negative ? whole.slice(1) : whole;
  const tail = digits.length > 3 ? digits.slice(-3) : digits;
  let head = digits.length > 3 ? digits.slice(0, -3) : "";
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  const grouped = groups.length ? `${groups.join(",")},${tail}` : tail;
  return `${negative ? "-" : ""}${grouped}${fraction ? `.${fraction}` : ""}`;
}
function money(value: any) { return `₹${indianNumber(numeric(value))}`; }
function ratio(value: any) { return `${String(value.n)}:${String(value.d)}`; }
function monthText(months: number, language: BtdCp007Language) {
  if (months === 12) return t(language, "1 वर्ष", "1 ਸਾਲ");
  if (months % 12 === 0) return t(language, `${months / 12} वर्ष`, `${months / 12} ਸਾਲ`);
  return t(language, `${months} महीने`, `${months} ਮਹੀਨੇ`);
}
function contextText(context: string, language: BtdCp007Language) {
  const key = String(context).toLowerCase();
  const map: Record<string, readonly [string, string]> = {
    "bill of exchange": ["विनिमय बिल", "ਵਿਨਿਮਯ ਬਿੱਲ"],
    "trade bill": ["व्यापारिक बिल", "ਵਪਾਰਕ ਬਿੱਲ"],
    "promissory note": ["प्रतिज्ञा-पत्र", "ਵਚਨ ਪੱਤਰ"],
    "merchant bill": ["व्यापारी बिल", "ਵਪਾਰੀ ਬਿੱਲ"],
    "invoice": ["चालान", "ਚਲਾਨ"],
    "commercial bill": ["वाणिज्यिक बिल", "ਵਪਾਰਕ ਬਿੱਲ"],
  };
  const value = map[key] ?? ["बिल", "ਬਿੱਲ"];
  return language === "hi" ? value[0] : value[1];
}
const HI_MONTHS = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
const PA_MONTHS = ["ਜਨਵਰੀ", "ਫ਼ਰਵਰੀ", "ਮਾਰਚ", "ਅਪ੍ਰੈਲ", "ਮਈ", "ਜੂਨ", "ਜੁਲਾਈ", "ਅਗਸਤ", "ਸਤੰਬਰ", "ਅਕਤੂਬਰ", "ਨਵੰਬਰ", "ਦਸੰਬਰ"];
function dateText(iso: string, language: BtdCp007Language) {
  const date = new Date(`${iso}T00:00:00.000Z`);
  const names = language === "hi" ? HI_MONTHS : PA_MONTHS;
  return `${date.getUTCDate()} ${names[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
function targetText(sourceAuthorityId: string, language: BtdCp007Language) {
  const map: Record<string, readonly [string, string]> = {
    "BTD-PROT-001": ["वर्तमान मूल्य", "ਮੌਜੂਦਾ ਮੁੱਲ"],
    "BTD-PROT-002": ["सच्चा बट्टा", "ਸੱਚਾ ਬੱਟਾ"],
    "BTD-PROT-003": ["बैंकर बट्टा", "ਬੈਂਕਰ ਬੱਟਾ"],
    "BTD-PROT-004": ["बैंकर लाभ", "ਬੈਂਕਰ ਲਾਭ"],
  };
  const value = map[sourceAuthorityId] ?? ["आवश्यक मान", "ਲੋੜੀਂਦਾ ਮੁੱਲ"];
  return language === "hi" ? value[0] : value[1];
}
function familyId(stemFamilyId: string) {
  const match = stemFamilyId.match(/T([123])$/u);
  if (!match) throw new Error(`BTD CP007 cannot resolve stem family ${stemFamilyId}`);
  return Number(match[1]);
}

function rawAuthority(entry: (typeof BTD_PERMANENT_QL_REGISTRY)[number], seed: string): AnyRecord {
  return entry.origin === "BTD-CP-001"
    ? buildBtdDiscoveryQuestionV6(entry.sourceAuthorityId as any, seed) as AnyRecord
    : buildBtdCp002CandidateQuestion(entry.sourceAuthorityId as any, seed) as AnyRecord;
}

function coreStem(sourceId: string, state: AnyRecord, family: number, language: BtdCp007Language) {
  const context = contextText(state.context, language);
  const target = targetText(sourceId, language);
  const duration = monthText(state.months, language);
  if (language === "hi") {
    if (family === 1) return `${money(state.faceValue)} के ${context} की देय अवधि ${duration} है और साधारण ब्याज की वार्षिक दर ${state.ratePercent}% है। ${target} ज्ञात कीजिए।`;
    if (family === 2) return `एक ${context} का अंकित मूल्य ${money(state.faceValue)} है। ${duration} की शेष अवधि और ${state.ratePercent}% वार्षिक दर पर उसका ${target} कितना होगा?`;
    return `${context} के लिए देय राशि = ${money(state.faceValue)}, वार्षिक दर = ${state.ratePercent}% और शेष अवधि = ${duration} है। ${target} निर्धारित कीजिए।`;
  }
  if (family === 1) return `${money(state.faceValue)} ਦੇ ${context} ਦੀ ਬਾਕੀ ਮਿਆਦ ${duration} ਹੈ ਅਤੇ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਸਾਲਾਨਾ ਦਰ ${state.ratePercent}% ਹੈ। ${target} ਕੱਢੋ।`;
  if (family === 2) return `ਇੱਕ ${context} ਦਾ ਅੰਕਿਤ ਮੁੱਲ ${money(state.faceValue)} ਹੈ। ${duration} ਦੀ ਬਾਕੀ ਮਿਆਦ ਅਤੇ ${state.ratePercent}% ਸਾਲਾਨਾ ਦਰ 'ਤੇ ਇਸ ਦਾ ${target} ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
  return `${context} ਲਈ ਦੇਯ ਰਕਮ = ${money(state.faceValue)}, ਸਾਲਾਨਾ ਦਰ = ${state.ratePercent}% ਅਤੇ ਬਾਕੀ ਮਿਆਦ = ${duration} ਹੈ। ${target} ਨਿਰਧਾਰਤ ਕਰੋ।`;
}

function localizedStem(sourceId: string, state: AnyRecord, family: number, language: BtdCp007Language): string {
  if (["BTD-PROT-001", "BTD-PROT-002", "BTD-PROT-003", "BTD-PROT-004"].includes(sourceId)) return coreStem(sourceId, state, family, language);
  const c = contextText(state.context ?? "commercial bill", language);
  switch (sourceId) {
    case "BTD-PROT-005":
      return family === 1
        ? t(language, `${c} का अंकित मूल्य ${money(state.faceValue)} और सच्चा बट्टा ${money(state.trueDiscount)} है। बैंकर बट्टा ज्ञात कीजिए।`, `${c} ਦਾ ਅੰਕਿਤ ਮੁੱਲ ${money(state.faceValue)} ਅਤੇ ਸੱਚਾ ਬੱਟਾ ${money(state.trueDiscount)} ਹੈ। ਬੈਂਕਰ ਬੱਟਾ ਕੱਢੋ।`)
        : family === 2
          ? t(language, `${c} की देय राशि ${money(state.faceValue)} है। यदि सच्चा बट्टा ${money(state.trueDiscount)} है, तो उसी शेष अवधि के लिए बैंकर बट्टा कितना होगा?`, `${c} ਦੀ ਦੇਯ ਰਕਮ ${money(state.faceValue)} ਹੈ। ਜੇ ਸੱਚਾ ਬੱਟਾ ${money(state.trueDiscount)} ਹੈ, ਤਾਂ ਉਸੇ ਬਾਕੀ ਮਿਆਦ ਲਈ ਬੈਂਕਰ ਬੱਟਾ ਕਿੰਨਾ ਹੋਵੇਗਾ?`)
          : t(language, `एक ${c} के लिए अंकित मूल्य = ${money(state.faceValue)} और सच्चा बट्टा = ${money(state.trueDiscount)} है। बैंकर बट्टा निर्धारित कीजिए।`, `ਇੱਕ ${c} ਲਈ ਅੰਕਿਤ ਮੁੱਲ = ${money(state.faceValue)} ਅਤੇ ਸੱਚਾ ਬੱਟਾ = ${money(state.trueDiscount)} ਹੈ। ਬੈਂਕਰ ਬੱਟਾ ਨਿਰਧਾਰਤ ਕਰੋ।`);
    case "BTD-PROT-006":
      return family === 1
        ? t(language, `${c} के लिए बैंकर बट्टा : सच्चा बट्टा = ${ratio(state.bdToTdRatio)} है। शेष अवधि ${monthText(state.months, language)} है। वार्षिक साधारण ब्याज दर ज्ञात कीजिए।`, `${c} ਲਈ ਬੈਂਕਰ ਬੱਟਾ : ਸੱਚਾ ਬੱਟਾ = ${ratio(state.bdToTdRatio)} ਹੈ। ਬਾਕੀ ਮਿਆਦ ${monthText(state.months, language)} ਹੈ। ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦਰ ਕੱਢੋ।`)
        : family === 2
          ? t(language, `${c} में BD:TD = ${ratio(state.bdToTdRatio)} और शेष अवधि ${monthText(state.months, language)} है। प्रति वर्ष ब्याज दर कितने प्रतिशत है?`, `${c} ਵਿੱਚ BD:TD = ${ratio(state.bdToTdRatio)} ਅਤੇ ਬਾਕੀ ਮਿਆਦ ${monthText(state.months, language)} ਹੈ। ਪ੍ਰਤੀ ਸਾਲ ਵਿਆਜ ਦਰ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`)
          : t(language, `बैंकर बट्टे और सच्चे बट्टे का अनुपात ${ratio(state.bdToTdRatio)} है और बिल की ${monthText(state.months, language)} अवधि शेष है। वार्षिक दर निर्धारित कीजिए।`, `ਬੈਂਕਰ ਬੱਟੇ ਅਤੇ ਸੱਚੇ ਬੱਟੇ ਦਾ ਅਨੁਪਾਤ ${ratio(state.bdToTdRatio)} ਹੈ ਅਤੇ ਬਿੱਲ ਦੀ ${monthText(state.months, language)} ਮਿਆਦ ਬਾਕੀ ਹੈ। ਸਾਲਾਨਾ ਦਰ ਨਿਰਧਾਰਤ ਕਰੋ।`);
    case "BTD-PROT-007":
      return family === 1
        ? t(language, `${c} पर ${state.ratePercent}% वार्षिक दर से ${monthText(state.months, language)} के लिए बैंकर लाभ ${money(state.bankersGain)} है। वर्तमान मूल्य ज्ञात कीजिए।`, `${c} 'ਤੇ ${state.ratePercent}% ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${monthText(state.months, language)} ਲਈ ਬੈਂਕਰ ਲਾਭ ${money(state.bankersGain)} ਹੈ। ਮੌਜੂਦਾ ਮੁੱਲ ਕੱਢੋ।`)
        : family === 2
          ? t(language, `${state.ratePercent}% वार्षिक दर और ${monthText(state.months, language)} की अवधि पर ${c} का बैंकर लाभ ${money(state.bankersGain)} है। उसका वर्तमान मूल्य कितना है?`, `${state.ratePercent}% ਸਾਲਾਨਾ ਦਰ ਅਤੇ ${monthText(state.months, language)} ਦੀ ਮਿਆਦ 'ਤੇ ${c} ਦਾ ਬੈਂਕਰ ਲਾਭ ${money(state.bankersGain)} ਹੈ। ਇਸ ਦਾ ਮੌਜੂਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`)
          : t(language, `${c} को देय तिथि से ${monthText(state.months, language)} पहले ${state.ratePercent}% वार्षिक दर पर भुनाने से बैंकर लाभ ${money(state.bankersGain)} मिलता है। वर्तमान मूल्य निर्धारित कीजिए।`, `${c} ਨੂੰ ਦੇਯ ਮਿਤੀ ਤੋਂ ${monthText(state.months, language)} ਪਹਿਲਾਂ ${state.ratePercent}% ਸਾਲਾਨਾ ਦਰ 'ਤੇ ਭੁਣਾਉਣ ਨਾਲ ਬੈਂਕਰ ਲਾਭ ${money(state.bankersGain)} ਮਿਲਦਾ ਹੈ। ਮੌਜੂਦਾ ਮੁੱਲ ਨਿਰਧਾਰਤ ਕਰੋ।`);
    case "BTD-PROT-008":
      return family === 1
        ? t(language, `${money(state.faceValue)} का बिल ${dateText(state.drawDateIso, language)} को ${state.termMonths} महीने के लिए बनाया गया। इसे ${dateText(state.discountDateIso, language)} को ${state.ratePercent}% वार्षिक दर पर भुनाया गया। 3 अनुग्रह दिवस जोड़कर बैंकर बट्टा ज्ञात कीजिए।`, `${money(state.faceValue)} ਦਾ ਬਿੱਲ ${dateText(state.drawDateIso, language)} ਨੂੰ ${state.termMonths} ਮਹੀਨਿਆਂ ਲਈ ਬਣਾਇਆ ਗਿਆ। ਇਸ ਨੂੰ ${dateText(state.discountDateIso, language)} ਨੂੰ ${state.ratePercent}% ਸਾਲਾਨਾ ਦਰ 'ਤੇ ਭੁਣਾਇਆ ਗਿਆ। 3 ਗ੍ਰੇਸ ਦਿਨ ਜੋੜ ਕੇ ਬੈਂਕਰ ਬੱਟਾ ਕੱਢੋ।`)
        : family === 2
          ? t(language, `${dateText(state.drawDateIso, language)} दिनांक का ${state.termMonths}-महीने का ${money(state.faceValue)} का बिल ${dateText(state.discountDateIso, language)} को ${state.ratePercent}% वार्षिक दर पर भुनाया गया। कानूनी देय तिथि में 3 अनुग्रह दिवस जोड़कर बैंकर बट्टा ज्ञात कीजिए।`, `${dateText(state.drawDateIso, language)} ਮਿਤੀ ਦਾ ${state.termMonths}-ਮਹੀਨੇ ਦਾ ${money(state.faceValue)} ਦਾ ਬਿੱਲ ${dateText(state.discountDateIso, language)} ਨੂੰ ${state.ratePercent}% ਸਾਲਾਨਾ ਦਰ 'ਤੇ ਭੁਣਾਇਆ ਗਿਆ। ਕਾਨੂੰਨੀ ਦੇਯ ਮਿਤੀ ਵਿੱਚ 3 ਗ੍ਰੇਸ ਦਿਨ ਜੋੜ ਕੇ ਬੈਂਕਰ ਬੱਟਾ ਕੱਢੋ।`)
          : t(language, `अंकित मूल्य ${money(state.faceValue)}; बिल तिथि ${dateText(state.drawDateIso, language)}; अवधि ${state.termMonths} महीने; भुनाने की तिथि ${dateText(state.discountDateIso, language)}; दर ${state.ratePercent}% वार्षिक। 3 अनुग्रह दिवस सहित बैंकर बट्टा कितना होगा?`, `ਅੰਕਿਤ ਮੁੱਲ ${money(state.faceValue)}; ਬਿੱਲ ਮਿਤੀ ${dateText(state.drawDateIso, language)}; ਮਿਆਦ ${state.termMonths} ਮਹੀਨੇ; ਭੁਣਾਉਣ ਦੀ ਮਿਤੀ ${dateText(state.discountDateIso, language)}; ਦਰ ${state.ratePercent}% ਸਾਲਾਨਾ। 3 ਗ੍ਰੇਸ ਦਿਨਾਂ ਸਮੇਤ ਬੈਂਕਰ ਬੱਟਾ ਕਿੰਨਾ ਹੋਵੇਗਾ?`);
    case "BTD-PROT-009":
      return family === 1
        ? t(language, `${c} में बैंकर बट्टा और सच्चा बट्टा ${ratio(state.bdToTdRatio)} के अनुपात में हैं। वार्षिक दर का संख्यात्मक मान बिल की अवधि (वर्षों में) का ${state.rateEqualsYearsMultiplier} गुना है। वार्षिक दर ज्ञात कीजिए।`, `${c} ਵਿੱਚ ਬੈਂਕਰ ਬੱਟਾ ਅਤੇ ਸੱਚਾ ਬੱਟਾ ${ratio(state.bdToTdRatio)} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ। ਸਾਲਾਨਾ ਦਰ ਦਾ ਅੰਕੀ ਮੁੱਲ ਬਿੱਲ ਦੀ ਮਿਆਦ (ਸਾਲਾਂ ਵਿੱਚ) ਦਾ ${state.rateEqualsYearsMultiplier} ਗੁਣਾ ਹੈ। ਸਾਲਾਨਾ ਦਰ ਕੱਢੋ।`)
        : family === 2
          ? t(language, `${c} में BD:TD = ${ratio(state.bdToTdRatio)} है। वार्षिक दर प्रतिशत, अवधि के वर्षों की संख्या का ${state.rateEqualsYearsMultiplier} गुना है। दर ज्ञात कीजिए।`, `${c} ਵਿੱਚ BD:TD = ${ratio(state.bdToTdRatio)} ਹੈ। ਸਾਲਾਨਾ ਦਰ ਪ੍ਰਤੀਸ਼ਤ, ਮਿਆਦ ਦੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ${state.rateEqualsYearsMultiplier} ਗੁਣਾ ਹੈ। ਦਰ ਕੱਢੋ।`)
          : t(language, `${c} के लिए BD:TD = ${ratio(state.bdToTdRatio)} तथा R = ${state.rateEqualsYearsMultiplier}T है, जहाँ R वार्षिक दर प्रतिशत और T वर्षों में अवधि है। R निर्धारित कीजिए।`, `${c} ਲਈ BD:TD = ${ratio(state.bdToTdRatio)} ਅਤੇ R = ${state.rateEqualsYearsMultiplier}T ਹੈ, ਜਿੱਥੇ R ਸਾਲਾਨਾ ਦਰ ਪ੍ਰਤੀਸ਼ਤ ਅਤੇ T ਸਾਲਾਂ ਵਿੱਚ ਮਿਆਦ ਹੈ। R ਨਿਰਧਾਰਤ ਕਰੋ।`);
    case "BTD-CAND-010":
      return family === 1
        ? t(language, `${c} का वर्तमान मूल्य ${money(state.presentWorth)} और बैंकर लाभ ${money(state.bankersGain)} है। सच्चा बट्टा ज्ञात कीजिए।`, `${c} ਦਾ ਮੌਜੂਦਾ ਮੁੱਲ ${money(state.presentWorth)} ਅਤੇ ਬੈਂਕਰ ਲਾਭ ${money(state.bankersGain)} ਹੈ। ਸੱਚਾ ਬੱਟਾ ਕੱਢੋ।`)
        : family === 2
          ? t(language, `${c} में वर्तमान मूल्य ${money(state.presentWorth)} है जबकि बैंकर लाभ ${money(state.bankersGain)} है। सच्चा बट्टा कितना है?`, `${c} ਵਿੱਚ ਮੌਜੂਦਾ ਮੁੱਲ ${money(state.presentWorth)} ਹੈ ਜਦਕਿ ਬੈਂਕਰ ਲਾਭ ${money(state.bankersGain)} ਹੈ। ਸੱਚਾ ਬੱਟਾ ਕਿੰਨਾ ਹੈ?`)
          : t(language, `${c} को भुनाने पर PW = ${money(state.presentWorth)} और BG = ${money(state.bankersGain)} है। TD निर्धारित कीजिए।`, `${c} ਨੂੰ ਭੁਣਾਉਣ 'ਤੇ PW = ${money(state.presentWorth)} ਅਤੇ BG = ${money(state.bankersGain)} ਹੈ। TD ਨਿਰਧਾਰਤ ਕਰੋ।`);
    case "BTD-CAND-011":
      return family === 1
        ? t(language, `दो विनिमय बिलों का कुल अंकित मूल्य ${money(state.totalFaceValue)} है और वे ${state.firstMonths} तथा ${state.secondMonths} महीनों में परिपक्व होते हैं। ${state.ratePercent}% वार्षिक दर पर कुल बैंकर बट्टा ${money(state.totalBankersDiscount)} है। उनके अंकित मूल्यों का अंतर ज्ञात कीजिए।`, `ਦੋ ਵਿਨਿਮਯ ਬਿੱਲਾਂ ਦਾ ਕੁੱਲ ਅੰਕਿਤ ਮੁੱਲ ${money(state.totalFaceValue)} ਹੈ ਅਤੇ ਉਹ ${state.firstMonths} ਅਤੇ ${state.secondMonths} ਮਹੀਨਿਆਂ ਵਿੱਚ ਪੱਕੇ ਹੁੰਦੇ ਹਨ। ${state.ratePercent}% ਸਾਲਾਨਾ ਦਰ 'ਤੇ ਕੁੱਲ ਬੈਂਕਰ ਬੱਟਾ ${money(state.totalBankersDiscount)} ਹੈ। ਉਨ੍ਹਾਂ ਦੇ ਅੰਕਿਤ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।`)
        : family === 2
          ? t(language, `दो बिलों का संयुक्त अंकित मूल्य ${money(state.totalFaceValue)} है। उनकी अवधियाँ ${state.firstMonths} और ${state.secondMonths} महीने, दर ${state.ratePercent}% वार्षिक तथा कुल BD ${money(state.totalBankersDiscount)} है। अंकित मूल्यों का अंतर ज्ञात कीजिए।`, `ਦੋ ਬਿੱਲਾਂ ਦਾ ਮਿਲਿਆ-ਜੁਲਿਆ ਅੰਕਿਤ ਮੁੱਲ ${money(state.totalFaceValue)} ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਮਿਆਦਾਂ ${state.firstMonths} ਅਤੇ ${state.secondMonths} ਮਹੀਨੇ, ਦਰ ${state.ratePercent}% ਸਾਲਾਨਾ ਅਤੇ ਕੁੱਲ BD ${money(state.totalBankersDiscount)} ਹੈ। ਅੰਕਿਤ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।`)
          : t(language, `दो बिलों के अंकित मूल्यों का योग ${money(state.totalFaceValue)} है। ${state.firstMonths} और ${state.secondMonths} महीनों की अवधियों पर ${state.ratePercent}% वार्षिक दर से कुल बैंकर बट्टा ${money(state.totalBankersDiscount)} है। दोनों अंकित मूल्यों का अंतर निर्धारित कीजिए।`, `ਦੋ ਬਿੱਲਾਂ ਦੇ ਅੰਕਿਤ ਮੁੱਲਾਂ ਦਾ ਜੋੜ ${money(state.totalFaceValue)} ਹੈ। ${state.firstMonths} ਅਤੇ ${state.secondMonths} ਮਹੀਨਿਆਂ ਦੀਆਂ ਮਿਆਦਾਂ 'ਤੇ ${state.ratePercent}% ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਕੁੱਲ ਬੈਂਕਰ ਬੱਟਾ ${money(state.totalBankersDiscount)} ਹੈ। ਦੋਵੇਂ ਅੰਕਿਤ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ਨਿਰਧਾਰਤ ਕਰੋ।`);
    case "BTD-CAND-012":
      return family === 1
        ? t(language, `${c} का बैंकर बट्टा ${money(state.bankersDiscount)} और सच्चा बट्टा ${money(state.trueDiscount)} है। अंकित मूल्य ज्ञात कीजिए।`, `${c} ਦਾ ਬੈਂਕਰ ਬੱਟਾ ${money(state.bankersDiscount)} ਅਤੇ ਸੱਚਾ ਬੱਟਾ ${money(state.trueDiscount)} ਹੈ। ਅੰਕਿਤ ਮੁੱਲ ਕੱਢੋ।`)
        : family === 2
          ? t(language, `${c} में BD = ${money(state.bankersDiscount)} और TD = ${money(state.trueDiscount)} है। परिपक्वता पर देय राशि कितनी है?`, `${c} ਵਿੱਚ BD = ${money(state.bankersDiscount)} ਅਤੇ TD = ${money(state.trueDiscount)} ਹੈ। ਪੱਕਣ ਸਮੇਂ ਦੇਯ ਰਕਮ ਕਿੰਨੀ ਹੈ?`)
          : t(language, `${c} पर बैंकर बट्टा ${money(state.bankersDiscount)} तथा सच्चा बट्टा ${money(state.trueDiscount)} है। उसका अंकित मूल्य निर्धारित कीजिए।`, `${c} 'ਤੇ ਬੈਂਕਰ ਬੱਟਾ ${money(state.bankersDiscount)} ਅਤੇ ਸੱਚਾ ਬੱਟਾ ${money(state.trueDiscount)} ਹੈ। ਇਸ ਦਾ ਅੰਕਿਤ ਮੁੱਲ ਨਿਰਧਾਰਤ ਕਰੋ।`);
    case "BTD-CAND-013":
      return family === 1
        ? t(language, `${c} का बैंकर बट्टा ${money(state.bankersDiscount)} है। दर ${state.ratePercent}% वार्षिक और अवधि ${state.months} महीने है। सच्चा बट्टा ज्ञात कीजिए।`, `${c} ਦਾ ਬੈਂਕਰ ਬੱਟਾ ${money(state.bankersDiscount)} ਹੈ। ਦਰ ${state.ratePercent}% ਸਾਲਾਨਾ ਅਤੇ ਮਿਆਦ ${state.months} ਮਹੀਨੇ ਹੈ। ਸੱਚਾ ਬੱਟਾ ਕੱਢੋ।`)
        : family === 2
          ? t(language, `${state.months} महीने के लिए ${state.ratePercent}% वार्षिक दर पर भुनाए गए ${c} का BD ${money(state.bankersDiscount)} है। TD निर्धारित कीजिए।`, `${state.months} ਮਹੀਨਿਆਂ ਲਈ ${state.ratePercent}% ਸਾਲਾਨਾ ਦਰ 'ਤੇ ਭੁਣਾਏ ${c} ਦਾ BD ${money(state.bankersDiscount)} ਹੈ। TD ਨਿਰਧਾਰਤ ਕਰੋ।`)
          : t(language, `${c} के लिए BD = ${money(state.bankersDiscount)}, दर = ${state.ratePercent}% वार्षिक और अवधि = ${state.months} महीने है। सच्चा बट्टा कितना है?`, `${c} ਲਈ BD = ${money(state.bankersDiscount)}, ਦਰ = ${state.ratePercent}% ਸਾਲਾਨਾ ਅਤੇ ਮਿਆਦ = ${state.months} ਮਹੀਨੇ ਹੈ। ਸੱਚਾ ਬੱਟਾ ਕਿੰਨਾ ਹੈ?`);
    case "BTD-CAND-014":
      return family === 1
        ? t(language, `${c} में BD:TD = ${ratio(state.bdToTdRatio)} और दर ${state.ratePercent}% वार्षिक है। शेष अवधि ज्ञात कीजिए।`, `${c} ਵਿੱਚ BD:TD = ${ratio(state.bdToTdRatio)} ਅਤੇ ਦਰ ${state.ratePercent}% ਸਾਲਾਨਾ ਹੈ। ਬਾਕੀ ਮਿਆਦ ਕੱਢੋ।`)
        : family === 2
          ? t(language, `${c} के बैंकर बट्टे और सच्चे बट्टे का अनुपात ${ratio(state.bdToTdRatio)} है। यदि दर ${state.ratePercent}% वार्षिक है, तो अवधि निर्धारित कीजिए।`, `${c} ਦੇ ਬੈਂਕਰ ਬੱਟੇ ਅਤੇ ਸੱਚੇ ਬੱਟੇ ਦਾ ਅਨੁਪਾਤ ${ratio(state.bdToTdRatio)} ਹੈ। ਜੇ ਦਰ ${state.ratePercent}% ਸਾਲਾਨਾ ਹੈ, ਤਾਂ ਮਿਆਦ ਨਿਰਧਾਰਤ ਕਰੋ।`)
          : t(language, `${c} के लिए BD/TD = ${numberText(numeric(state.bdToTdRatio), 4)} और दर ${state.ratePercent}% वार्षिक है। अवधि महीनों में ज्ञात कीजिए।`, `${c} ਲਈ BD/TD = ${numberText(numeric(state.bdToTdRatio), 4)} ਅਤੇ ਦਰ ${state.ratePercent}% ਸਾਲਾਨਾ ਹੈ। ਮਿਆਦ ਮਹੀਨਿਆਂ ਵਿੱਚ ਕੱਢੋ।`);
    case "BTD-CAND-015":
      return family === 1
        ? t(language, `${c} पर बैंकर लाभ ${money(state.bankersGain)} है। दर ${state.ratePercent}% वार्षिक और अवधि ${state.months} महीने है। सच्चा बट्टा ज्ञात कीजिए।`, `${c} 'ਤੇ ਬੈਂਕਰ ਲਾਭ ${money(state.bankersGain)} ਹੈ। ਦਰ ${state.ratePercent}% ਸਾਲਾਨਾ ਅਤੇ ਮਿਆਦ ${state.months} ਮਹੀਨੇ ਹੈ। ਸੱਚਾ ਬੱਟਾ ਕੱਢੋ।`)
        : family === 2
          ? t(language, `${state.months} महीने और ${state.ratePercent}% वार्षिक दर पर ${c} का बैंकर लाभ ${money(state.bankersGain)} है। TD निर्धारित कीजिए।`, `${state.months} ਮਹੀਨੇ ਅਤੇ ${state.ratePercent}% ਸਾਲਾਨਾ ਦਰ 'ਤੇ ${c} ਦਾ ਬੈਂਕਰ ਲਾਭ ${money(state.bankersGain)} ਹੈ। TD ਨਿਰਧਾਰਤ ਕਰੋ।`)
          : t(language, `${c} के लिए BG = ${money(state.bankersGain)}, दर = ${state.ratePercent}% और अवधि = ${state.months} महीने है। सच्चा बट्टा कितना है?`, `${c} ਲਈ BG = ${money(state.bankersGain)}, ਦਰ = ${state.ratePercent}% ਅਤੇ ਮਿਆਦ = ${state.months} ਮਹੀਨੇ ਹੈ। ਸੱਚਾ ਬੱਟਾ ਕਿੰਨਾ ਹੈ?`);
    case "BTD-CAND-016":
      return family === 1
        ? t(language, `${c} का वर्तमान मूल्य ${money(state.presentWorth)} और सच्चा बट्टा ${money(state.trueDiscount)} है। बैंकर बट्टा ज्ञात कीजिए।`, `${c} ਦਾ ਮੌਜੂਦਾ ਮੁੱਲ ${money(state.presentWorth)} ਅਤੇ ਸੱਚਾ ਬੱਟਾ ${money(state.trueDiscount)} ਹੈ। ਬੈਂਕਰ ਬੱਟਾ ਕੱਢੋ।`)
        : family === 2
          ? t(language, `${c} में PW = ${money(state.presentWorth)} और TD = ${money(state.trueDiscount)} है। BD निर्धारित कीजिए।`, `${c} ਵਿੱਚ PW = ${money(state.presentWorth)} ਅਤੇ TD = ${money(state.trueDiscount)} ਹੈ। BD ਨਿਰਧਾਰਤ ਕਰੋ।`)
          : t(language, `${c} का वर्तमान मूल्य ${money(state.presentWorth)} तथा सच्चा बट्टा ${money(state.trueDiscount)} है। बैंकर बट्टा कितना है?`, `${c} ਦਾ ਮੌਜੂਦਾ ਮੁੱਲ ${money(state.presentWorth)} ਅਤੇ ਸੱਚਾ ਬੱਟਾ ${money(state.trueDiscount)} ਹੈ। ਬੈਂਕਰ ਬੱਟਾ ਕਿੰਨਾ ਹੈ?`);
    case "BTD-CAND-017":
      return family === 1
        ? t(language, `${c} का वर्तमान मूल्य ${money(state.presentWorth)} और सच्चा बट्टा ${money(state.trueDiscount)} है। बैंकर लाभ ज्ञात कीजिए।`, `${c} ਦਾ ਮੌਜੂਦਾ ਮੁੱਲ ${money(state.presentWorth)} ਅਤੇ ਸੱਚਾ ਬੱਟਾ ${money(state.trueDiscount)} ਹੈ। ਬੈਂਕਰ ਲਾਭ ਕੱਢੋ।`)
        : family === 2
          ? t(language, `${c} में PW = ${money(state.presentWorth)} और TD = ${money(state.trueDiscount)} है। बैंकर लाभ निर्धारित कीजिए।`, `${c} ਵਿੱਚ PW = ${money(state.presentWorth)} ਅਤੇ TD = ${money(state.trueDiscount)} ਹੈ। ਬੈਂਕਰ ਲਾਭ ਨਿਰਧਾਰਤ ਕਰੋ।`)
          : t(language, `${c} का वर्तमान मूल्य ${money(state.presentWorth)} तथा सच्चा बट्टा ${money(state.trueDiscount)} है। BG कितना है?`, `${c} ਦਾ ਮੌਜੂਦਾ ਮੁੱਲ ${money(state.presentWorth)} ਅਤੇ ਸੱਚਾ ਬੱਟਾ ${money(state.trueDiscount)} ਹੈ। BG ਕਿੰਨਾ ਹੈ?`);
    case "BTD-CAND-018":
      return family === 1
        ? t(language, `${state.ratePercent}% वार्षिक दर पर ${money(state.bankersDiscountFace)} का बैंकर बट्टा, समान अवधि के लिए ${money(state.trueDiscountFace)} के सच्चे बट्टे के बराबर है। अवधि महीनों में ज्ञात कीजिए।`, `${state.ratePercent}% ਸਾਲਾਨਾ ਦਰ 'ਤੇ ${money(state.bankersDiscountFace)} ਦਾ ਬੈਂਕਰ ਬੱਟਾ, ਇੱਕੋ ਮਿਆਦ ਲਈ ${money(state.trueDiscountFace)} ਦੇ ਸੱਚੇ ਬੱਟੇ ਦੇ ਬਰਾਬਰ ਹੈ। ਮਿਆਦ ਮਹੀਨਿਆਂ ਵਿੱਚ ਕੱਢੋ।`)
        : family === 2
          ? t(language, `${money(state.bankersDiscountFace)} पर BD, ${money(state.trueDiscountFace)} पर TD के बराबर है और दर ${state.ratePercent}% वार्षिक है। समान अवधि निर्धारित कीजिए।`, `${money(state.bankersDiscountFace)} 'ਤੇ BD, ${money(state.trueDiscountFace)} 'ਤੇ TD ਦੇ ਬਰਾਬਰ ਹੈ ਅਤੇ ਦਰ ${state.ratePercent}% ਸਾਲਾਨਾ ਹੈ। ਇੱਕੋ ਮਿਆਦ ਨਿਰਧਾਰਤ ਕਰੋ।`)
          : t(language, `समान अवधि पर ${state.ratePercent}% वार्षिक दर से ${money(state.bankersDiscountFace)} का BD, ${money(state.trueDiscountFace)} के TD के बराबर है। वह अवधि महीनों में ज्ञात कीजिए।`, `ਇੱਕੋ ਮਿਆਦ 'ਤੇ ${state.ratePercent}% ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${money(state.bankersDiscountFace)} ਦਾ BD, ${money(state.trueDiscountFace)} ਦੇ TD ਦੇ ਬਰਾਬਰ ਹੈ। ਉਹ ਮਿਆਦ ਮਹੀਨਿਆਂ ਵਿੱਚ ਕੱਢੋ।`);
    case "BTD-CAND-019":
      return family === 1
        ? t(language, `${c} का बैंकर बट्टा ${money(state.bankersDiscount)} और सच्चा बट्टा ${money(state.trueDiscount)} है। अवधि ${state.months} महीने है। वार्षिक दर ज्ञात कीजिए।`, `${c} ਦਾ ਬੈਂਕਰ ਬੱਟਾ ${money(state.bankersDiscount)} ਅਤੇ ਸੱਚਾ ਬੱਟਾ ${money(state.trueDiscount)} ਹੈ। ਮਿਆਦ ${state.months} ਮਹੀਨੇ ਹੈ। ਸਾਲਾਨਾ ਦਰ ਕੱਢੋ।`)
        : family === 2
          ? t(language, `${c} में BD = ${money(state.bankersDiscount)}, TD = ${money(state.trueDiscount)} और अवधि ${state.months} महीने है। वार्षिक ब्याज दर प्रतिशत निर्धारित कीजिए।`, `${c} ਵਿੱਚ BD = ${money(state.bankersDiscount)}, TD = ${money(state.trueDiscount)} ਅਤੇ ਮਿਆਦ ${state.months} ਮਹੀਨੇ ਹੈ। ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪ੍ਰਤੀਸ਼ਤ ਨਿਰਧਾਰਤ ਕਰੋ।`)
          : t(language, `${c} के लिए BD ${money(state.bankersDiscount)}, TD ${money(state.trueDiscount)} और समय ${state.months} महीने है। वार्षिक दर कितनी है?`, `${c} ਲਈ BD ${money(state.bankersDiscount)}, TD ${money(state.trueDiscount)} ਅਤੇ ਸਮਾਂ ${state.months} ਮਹੀਨੇ ਹੈ। ਸਾਲਾਨਾ ਦਰ ਕਿੰਨੀ ਹੈ?`);
    case "BTD-CAND-020":
      return family === 1
        ? t(language, `${c} का सच्चा बट्टा ${money(state.trueDiscount)} है। दर ${state.ratePercent}% वार्षिक और अवधि ${state.months} महीने है। बैंकर बट्टा ज्ञात कीजिए।`, `${c} ਦਾ ਸੱਚਾ ਬੱਟਾ ${money(state.trueDiscount)} ਹੈ। ਦਰ ${state.ratePercent}% ਸਾਲਾਨਾ ਅਤੇ ਮਿਆਦ ${state.months} ਮਹੀਨੇ ਹੈ। ਬੈਂਕਰ ਬੱਟਾ ਕੱਢੋ।`)
        : family === 2
          ? t(language, `${c} में TD = ${money(state.trueDiscount)}, अवधि ${state.months} महीने और दर ${state.ratePercent}% वार्षिक है। BD निर्धारित कीजिए।`, `${c} ਵਿੱਚ TD = ${money(state.trueDiscount)}, ਮਿਆਦ ${state.months} ਮਹੀਨੇ ਅਤੇ ਦਰ ${state.ratePercent}% ਸਾਲਾਨਾ ਹੈ। BD ਨਿਰਧਾਰਤ ਕਰੋ।`)
          : t(language, `${c} के लिए सच्चा बट्टा = ${money(state.trueDiscount)}, दर = ${state.ratePercent}% और अवधि = ${state.months} महीने है। बैंकर बट्टा कितना है?`, `${c} ਲਈ ਸੱਚਾ ਬੱਟਾ = ${money(state.trueDiscount)}, ਦਰ = ${state.ratePercent}% ਅਤੇ ਮਿਆਦ = ${state.months} ਮਹੀਨੇ ਹੈ। ਬੈਂਕਰ ਬੱਟਾ ਕਿੰਨਾ ਹੈ?`);
    default: throw new Error(`BTD CP007 missing localized stem for ${sourceId}`);
  }
}

const KEY_IDEAS: Readonly<Record<string, readonly [string, string]>> = Object.freeze({
  "BTD-PROT-001": ["वर्तमान मूल्य वह मूलधन है जो शेष अवधि में साधारण ब्याज सहित अंकित मूल्य बनता है।", "ਮੌਜੂਦਾ ਮੁੱਲ ਉਹ ਮੁੱਢਲੀ ਰਕਮ ਹੈ ਜੋ ਬਾਕੀ ਮਿਆਦ ਵਿੱਚ ਸਧਾਰਣ ਵਿਆਜ ਸਮੇਤ ਅੰਕਿਤ ਮੁੱਲ ਬਣਦੀ ਹੈ।"],
  "BTD-PROT-002": ["सच्चा बट्टा = अंकित मूल्य − वर्तमान मूल्य; यह वर्तमान मूल्य पर साधारण ब्याज के बराबर होता है।", "ਸੱਚਾ ਬੱਟਾ = ਅੰਕਿਤ ਮੁੱਲ − ਮੌਜੂਦਾ ਮੁੱਲ; ਇਹ ਮੌਜੂਦਾ ਮੁੱਲ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।"],
  "BTD-PROT-003": ["बैंकर बट्टा शेष अवधि के लिए अंकित मूल्य पर साधारण ब्याज है।", "ਬੈਂਕਰ ਬੱਟਾ ਬਾਕੀ ਮਿਆਦ ਲਈ ਅੰਕਿਤ ਮੁੱਲ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ ਹੈ।"],
  "BTD-PROT-004": ["बैंकर लाभ, बैंकर बट्टे और सच्चे बट्टे का अंतर है।", "ਬੈਂਕਰ ਲਾਭ, ਬੈਂਕਰ ਬੱਟੇ ਅਤੇ ਸੱਚੇ ਬੱਟੇ ਦਾ ਅੰਤਰ ਹੈ।"],
  "BTD-PROT-005": ["समान दर और अवधि में TD वर्तमान मूल्य पर और BD अंकित मूल्य पर साधारण ब्याज है।", "ਇੱਕੋ ਦਰ ਅਤੇ ਮਿਆਦ ਵਿੱਚ TD ਮੌਜੂਦਾ ਮੁੱਲ ਉੱਤੇ ਅਤੇ BD ਅੰਕਿਤ ਮੁੱਲ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ ਹੈ।"],
  "BTD-PROT-006": ["यदि x = दर × महीने/1200, तो समान बिल के लिए BD/TD = 1 + x। अवधि ज्ञात होने पर दर सीधे मिलती है।", "ਜੇ x = ਦਰ × ਮਹੀਨੇ/1200, ਤਾਂ ਇੱਕੋ ਬਿੱਲ ਲਈ BD/TD = 1 + x। ਮਿਆਦ ਪਤਾ ਹੋਣ 'ਤੇ ਦਰ ਸਿੱਧੀ ਮਿਲਦੀ ਹੈ।"],
  "BTD-PROT-007": ["यदि x = दर × महीने/1200, तो बैंकर लाभ = PW × x²।", "ਜੇ x = ਦਰ × ਮਹੀਨੇ/1200, ਤਾਂ ਬੈਂਕਰ ਲਾਭ = PW × x²।"],
  "BTD-PROT-008": ["पहले 3 अनुग्रह दिवस सहित कानूनी देय तिथि निकालें, फिर शेष दिनों के लिए अंकित मूल्य पर साधारण ब्याज लें।", "ਪਹਿਲਾਂ 3 ਗ੍ਰੇਸ ਦਿਨਾਂ ਸਮੇਤ ਕਾਨੂੰਨੀ ਦੇਯ ਮਿਤੀ ਕੱਢੋ, ਫਿਰ ਬਾਕੀ ਦਿਨਾਂ ਲਈ ਅੰਕਿਤ ਮੁੱਲ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ ਲਓ।"],
  "BTD-PROT-009": ["एक बिल के लिए BD/TD = 1 + RT/100। इसे R = kT के साथ जोड़कर R का सीधा समीकरण मिलता है।", "ਇੱਕ ਬਿੱਲ ਲਈ BD/TD = 1 + RT/100। ਇਸ ਨੂੰ R = kT ਨਾਲ ਜੋੜ ਕੇ R ਦਾ ਸਿੱਧਾ ਸਮੀਕਰਨ ਮਿਲਦਾ ਹੈ।"],
  "BTD-CAND-010": ["समान बिल के लिए बैंकर लाभ = TD²/PW, इसलिए PW और BG से TD मिलता है।", "ਇੱਕੋ ਬਿੱਲ ਲਈ ਬੈਂਕਰ ਲਾਭ = TD²/PW, ਇਸ ਲਈ PW ਅਤੇ BG ਤੋਂ TD ਮਿਲਦਾ ਹੈ।"],
  "BTD-CAND-011": ["कुल अंकित मूल्य एक समीकरण देता है और कुल बैंकर बट्टा दूसरा भारित समीकरण देता है।", "ਕੁੱਲ ਅੰਕਿਤ ਮੁੱਲ ਇੱਕ ਸਮੀਕਰਨ ਦਿੰਦਾ ਹੈ ਅਤੇ ਕੁੱਲ ਬੈਂਕਰ ਬੱਟਾ ਦੂਜਾ ਭਾਰਿਤ ਸਮੀਕਰਨ ਦਿੰਦਾ ਹੈ।"],
  "BTD-CAND-012": ["BG = BD − TD तथा BG = BD×TD/Face का उपयोग करके अंकित मूल्य सीधे निकाला जा सकता है।", "BG = BD − TD ਅਤੇ BG = BD×TD/Face ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਅੰਕਿਤ ਮੁੱਲ ਸਿੱਧਾ ਕੱਢਿਆ ਜਾ ਸਕਦਾ ਹੈ।"],
  "BTD-CAND-013": ["x = दर × महीने/1200 रखें। समान बिल के लिए BD/TD = 1 + x।", "x = ਦਰ × ਮਹੀਨੇ/1200 ਰੱਖੋ। ਇੱਕੋ ਬਿੱਲ ਲਈ BD/TD = 1 + x।"],
  "BTD-CAND-014": ["शेष अवधि के साधारण-ब्याज गुणक को x मानें; तब BD/TD = 1 + x।", "ਬਾਕੀ ਮਿਆਦ ਦੇ ਸਧਾਰਣ-ਵਿਆਜ ਗੁਣਕ ਨੂੰ x ਮੰਨੋ; ਤਦ BD/TD = 1 + x।"],
  "BTD-CAND-015": ["x = दर × महीने/1200 रखने पर बैंकर लाभ = TD × x।", "x = ਦਰ × ਮਹੀਨੇ/1200 ਰੱਖਣ 'ਤੇ ਬੈਂਕਰ ਲਾਭ = TD × x।"],
  "BTD-CAND-016": ["अंकित मूल्य = PW + TD और BD/TD = Face/PW।", "ਅੰਕਿਤ ਮੁੱਲ = PW + TD ਅਤੇ BD/TD = Face/PW।"],
  "BTD-CAND-017": ["बैंकर लाभ = TD²/PW।", "ਬੈਂਕਰ ਲਾਭ = TD²/PW।"],
  "BTD-CAND-018": ["यदि पहले अंकित मूल्य का BD दूसरे अंकित मूल्य के TD के बराबर है, तो दूसरा/पहला = 1 + x।", "ਜੇ ਪਹਿਲੇ ਅੰਕਿਤ ਮੁੱਲ ਦਾ BD ਦੂਜੇ ਅੰਕਿਤ ਮੁੱਲ ਦੇ TD ਦੇ ਬਰਾਬਰ ਹੈ, ਤਾਂ ਦੂਜਾ/ਪਹਿਲਾ = 1 + x।"],
  "BTD-CAND-019": ["BD/TD = 1 + x से BD और TD साधारण-ब्याज गुणक x देते हैं; समय ज्ञात होने पर वार्षिक दर मिलती है।", "BD/TD = 1 + x ਤੋਂ BD ਅਤੇ TD ਸਧਾਰਣ-ਵਿਆਜ ਗੁਣਕ x ਦਿੰਦੇ ਹਨ; ਸਮਾਂ ਪਤਾ ਹੋਣ 'ਤੇ ਸਾਲਾਨਾ ਦਰ ਮਿਲਦੀ ਹੈ।"],
  "BTD-CAND-020": ["x = दर × महीने/1200 और BD/TD = 1 + x।", "x = ਦਰ × ਮਹੀਨੇ/1200 ਅਤੇ BD/TD = 1 + x।"],
});

function translateStep(step: string, language: BtdCp007Language) {
  const pairs: readonly (readonly [RegExp, string, string])[] = [
    [/Let the first face value be F₁ and the second be F₂\. Then/gu, "पहला अंकित मूल्य F₁ और दूसरा F₂ मानें। तब", "ਪਹਿਲਾ ਅੰਕਿਤ ਮੁੱਲ F₁ ਅਤੇ ਦੂਜਾ F₂ ਮੰਨੋ। ਤਦ"],
    [/Solving gives face values/gu, "हल करने पर अंकित मूल्य मिलते हैं", "ਹੱਲ ਕਰਨ 'ਤੇ ਅੰਕਿਤ ਮੁੱਲ ਮਿਲਦੇ ਹਨ"],
    [/their difference is/gu, "और उनका अंतर है", "ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਅੰਤਰ ਹੈ"],
    [/the corresponding term is/giu, "और संबंधित अवधि है", "ਅਤੇ ਸੰਬੰਧਿਤ ਮਿਆਦ ਹੈ"],
    [/Legal due date/gu, "कानूनी देय तिथि", "ਕਾਨੂੰਨੀ ਦੇਯ ਮਿਤੀ"],
    [/nominal due date/gu, "मूल देय तिथि", "ਮੂਲ ਦੇਯ ਮਿਤੀ"],
    [/Unexpired time/gu, "शेष अवधि", "ਬਾਕੀ ਮਿਆਦ"],
    [/Present worth/giu, "वर्तमान मूल्य", "ਮੌਜੂਦਾ ਮੁੱਲ"],
    [/Face value/giu, "अंकित मूल्य", "ਅੰਕਿਤ ਮੁੱਲ"],
    [/banker's gain/giu, "बैंकर लाभ", "ਬੈਂਕਰ ਲਾਭ"],
    [/banker's discount/giu, "बैंकर बट्टा", "ਬੈਂਕਰ ਬੱਟਾ"],
    [/true discount/giu, "सच्चा बट्टा", "ਸੱਚਾ ਬੱਟਾ"],
    [/Interest factor/giu, "ब्याज गुणक", "ਵਿਆਜ ਗੁਣਕ"],
    [/Time in months/giu, "अवधि (महीनों में)", "ਮਿਆਦ (ਮਹੀਨਿਆਂ ਵਿੱਚ)"],
    [/Rate/gu, "दर", "ਦਰ"],
    [/Use /gu, "सूत्र लें: ", "ਸੂਤਰ ਵਰਤੋ: "],
    [/Since /gu, "क्योंकि ", "ਕਿਉਂਕਿ "],
    [/From /gu, "इससे ", "ਇਸ ਤੋਂ "],
    [/This gives /gu, "इससे मिलता है ", "ਇਸ ਨਾਲ ਮਿਲਦਾ ਹੈ "],
    [/Solving gives /gu, "हल करने पर मिलता है ", "ਹੱਲ ਕਰਨ 'ਤੇ ਮਿਲਦਾ ਹੈ "],
    [/substitute /giu, "प्रतिस्थापित करें ", "ਬਦਲ ਕੇ ਰੱਖੋ "],
    [/the time is /giu, "अवधि है ", "ਮਿਆਦ ਹੈ "],
    [/years/giu, "वर्ष", "ਸਾਲ"],
    [/days/giu, "दिन", "ਦਿਨ"],
  ];
  let result = step;
  for (const [pattern, hi, pa] of pairs) result = result.replace(pattern, language === "hi" ? hi : pa);
  return result;
}

function localizedExplanation(sourceId: string, frozen: AnyRecord, state: AnyRecord, language: BtdCp007Language) {
  const askedMap: Record<string, readonly [string, string]> = {
    PRESENT_WORTH: ["वर्तमान मूल्य ज्ञात कीजिए।", "ਮੌਜੂਦਾ ਮੁੱਲ ਕੱਢੋ।"],
    TRUE_DISCOUNT: ["सच्चा बट्टा ज्ञात कीजिए।", "ਸੱਚਾ ਬੱਟਾ ਕੱਢੋ।"],
    BANKERS_DISCOUNT: ["बैंकर बट्टा ज्ञात कीजिए।", "ਬੈਂਕਰ ਬੱਟਾ ਕੱਢੋ।"],
    BANKERS_GAIN: ["बैंकर लाभ ज्ञात कीजिए।", "ਬੈਂਕਰ ਲਾਭ ਕੱਢੋ।"],
    RATE_PERCENT: ["वार्षिक ब्याज दर ज्ञात कीजिए।", "ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਕੱਢੋ।"],
    FACE_VALUE: ["अंकित मूल्य ज्ञात कीजिए।", "ਅੰਕਿਤ ਮੁੱਲ ਕੱਢੋ।"],
    TIME_MONTHS: ["अवधि महीनों में ज्ञात कीजिए।", "ਮਿਆਦ ਮਹੀਨਿਆਂ ਵਿੱਚ ਕੱਢੋ।"],
    FACE_VALUE_DIFFERENCE: ["दोनों अंकित मूल्यों का अंतर ज्ञात कीजिए।", "ਦੋਵੇਂ ਅੰਕਿਤ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।"],
  };
  const askedPair = askedMap[String(frozen.answerSemantic)] ?? ["आवश्यक मान ज्ञात कीजिए।", "ਲੋੜੀਂਦਾ ਮੁੱਲ ਕੱਢੋ।"];
  const keyPair = KEY_IDEAS[sourceId];
  if (!keyPair) throw new Error(`BTD CP007 missing key idea for ${sourceId}`);
  const given = t(language,
    `प्रश्न में दिए गए सभी संख्यात्मक मान उसी जमे हुए अंग्रेज़ी प्रश्न के हैं; अंकित/वर्तमान मूल्य, BD, TD, BG, दर और अवधि का अर्थ प्रश्न के अनुसार लें।`,
    `ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੇ ਸਾਰੇ ਅੰਕੀ ਮੁੱਲ ਉਸੇ ਜਮੇ ਹੋਏ ਅੰਗਰੇਜ਼ੀ ਸਵਾਲ ਦੇ ਹਨ; ਅੰਕਿਤ/ਮੌਜੂਦਾ ਮੁੱਲ, BD, TD, BG, ਦਰ ਅਤੇ ਮਿਆਦ ਦਾ ਅਰਥ ਸਵਾਲ ਅਨੁਸਾਰ ਲਓ।`,
  );
  const steps = frozen.explanation.steps.map((step: string) => translateStep(step, language));
  return Object.freeze({
    whatGiven: given,
    whatAsked: language === "hi" ? askedPair[0] : askedPair[1],
    keyIdea: language === "hi" ? keyPair[0] : keyPair[1],
    steps: Object.freeze(steps),
    finalAnswer: t(language, `अतः सही उत्तर ${frozen.correctAnswer} है।`, `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${frozen.correctAnswer} ਹੈ।`),
  });
}

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (!value || typeof value !== "object") return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

export const BTD_CP007_LOCALIZATION_BOUNDARY = Object.freeze({
  localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const,
  englishAuthorityFrozen: true as const,
  multilingualFrozen: false as const,
  questionStudioDiscoverable: false as const,
  questionStudioGenerationEnabled: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
});

export function buildBtdLocalizedQuestionV1(qlId: BtdPermanentQlId, seed: string, language: BtdCp007Language) {
  const entry = BTD_PERMANENT_QL_REGISTRY.find((item) => item.qlId === qlId);
  if (!entry) throw new Error(`${qlId}: unknown BTD permanent QL`);
  const frozen = buildBtdFrozenEnglishQuestionV1(qlId, seed) as AnyRecord;
  const raw = rawAuthority(entry, seed);
  if (fingerprint(raw.state) !== frozen.sourceStateFingerprint) {
    throw new Error(`${qlId}/${seed}: localized source state does not match frozen English source state`);
  }
  const family = familyId(frozen.presentation.stemFamilyId);
  const stem = localizedStem(entry.sourceAuthorityId, raw.state, family, language);
  const explanation = localizedExplanation(entry.sourceAuthorityId, frozen, raw.state, language);
  const options = Object.freeze(frozen.options.map((option: AnyRecord) => Object.freeze({ ...option })));
  const localizedPayload = { qlId, language, stem, options: options.map((option) => option.text), correctIndex: frozen.correctIndex, answer: frozen.correctAnswer, explanation };

  return deepFreeze({
    chapterId: "BTD-001" as const,
    checkpointId: "BTD-CP-007" as const,
    localizationVersion: BTD_CP007_LOCALIZATION_VERSION,
    qlId,
    semanticSignature: entry.semanticSignature,
    answerSemantic: entry.answerSemantic,
    sourceAuthorityId: entry.sourceAuthorityId,
    sourceStateFingerprint: frozen.sourceStateFingerprint,
    englishContentFingerprint: frozen.contentFingerprint,
    language,
    locale: language === "hi" ? "hi-IN" as const : "pa-IN" as const,
    seed,
    presentation: Object.freeze({ stemFamilyId: `${frozen.presentation.stemFamilyId}-${language.toUpperCase()}`, stem }),
    options,
    correctIndex: frozen.correctIndex,
    correctAnswer: frozen.correctAnswer,
    explanation,
    localizationFingerprint: fingerprint(localizedPayload),
    lifecycle: BTD_CP007_LOCALIZATION_BOUNDARY,
  });
}
