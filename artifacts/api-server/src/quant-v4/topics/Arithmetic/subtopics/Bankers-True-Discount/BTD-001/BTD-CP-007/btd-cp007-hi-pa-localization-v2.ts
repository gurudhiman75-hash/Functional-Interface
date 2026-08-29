import { createHash } from "node:crypto";
import { buildBtdDiscoveryQuestionV6 } from "../btd-cp001-breadth-remediation-v6";
import { BTD_PERMANENT_QL_REGISTRY, type BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { buildBtdCp002CandidateQuestion } from "../BTD-CP-002/btd-cp002-source-saturation-v2";
import { buildBtdFrozenEnglishQuestionV1 } from "../BTD-CP-005/btd-cp005-english-freeze-v1";

export const BTD_CP007_LOCALIZATION_V2 = "BTD-001-CP007-HI-PA-LOCALIZATION-v2" as const;
export const BTD_CP007_LANGUAGES_V2 = ["hi", "pa"] as const;
export type BtdCp007LanguageV2 = typeof BTD_CP007_LANGUAGES_V2[number];
type R = Record<string, any>;

function tr(language: BtdCp007LanguageV2, hi: string, pa: string) { return language === "hi" ? hi : pa; }
function sourceJson(value: unknown) { return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item); }
function sourceFingerprint(value: unknown) { return createHash("sha256").update(sourceJson(value)).digest("hex"); }
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
function n(value: number, digits = 4) { return value.toFixed(digits).replace(/0+$/u, "").replace(/\.$/u, ""); }
function indian(value: number) {
  const raw = n(value, 2); const [wholeRaw, fraction] = raw.split("."); const negative = wholeRaw.startsWith("-");
  const whole = negative ? wholeRaw.slice(1) : wholeRaw; const tail = whole.length > 3 ? whole.slice(-3) : whole; let head = whole.length > 3 ? whole.slice(0, -3) : ""; const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); } if (head) groups.unshift(head);
  return `${negative ? "-" : ""}${groups.length ? `${groups.join(",")},` : ""}${tail}${fraction ? `.${fraction}` : ""}`;
}
function money(value: any) { return `₹${indian(numeric(value))}`; }
function ratio(value: any) { return `${String(value.n)}:${String(value.d)}`; }
function duration(months: number, language: BtdCp007LanguageV2) {
  if (months === 12) return tr(language, "1 वर्ष", "1 ਸਾਲ");
  if (months % 12 === 0) return tr(language, `${months / 12} वर्ष`, `${months / 12} ਸਾਲ`);
  return tr(language, `${months} महीने`, `${months} ਮਹੀਨੇ`);
}
const HI_MONTHS = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
const PA_MONTHS = ["ਜਨਵਰੀ", "ਫ਼ਰਵਰੀ", "ਮਾਰਚ", "ਅਪ੍ਰੈਲ", "ਮਈ", "ਜੂਨ", "ਜੁਲਾਈ", "ਅਗਸਤ", "ਸਤੰਬਰ", "ਅਕਤੂਬਰ", "ਨਵੰਬਰ", "ਦਸੰਬਰ"];
function dateText(iso: string, language: BtdCp007LanguageV2) { const d = new Date(`${iso}T00:00:00.000Z`); const m = language === "hi" ? HI_MONTHS : PA_MONTHS; return `${d.getUTCDate()} ${m[d.getUTCMonth()]} ${d.getUTCFullYear()}`; }
function daysBetween(a: string, b: string) { return Math.round((new Date(`${b}T00:00:00Z`).getTime() - new Date(`${a}T00:00:00Z`).getTime()) / 86_400_000); }
function context(value: string, language: BtdCp007LanguageV2) {
  const map: Record<string, readonly [string, string]> = {
    "bill of exchange": ["विनिमय बिल", "ਵਿਨਿਮਯ ਬਿੱਲ"], "trade bill": ["व्यापारिक बिल", "ਵਪਾਰਕ ਬਿੱਲ"], "promissory note": ["प्रतिज्ञा-पत्र", "ਵਚਨ ਪੱਤਰ"],
    "merchant bill": ["व्यापारी बिल", "ਵਪਾਰੀ ਬਿੱਲ"], invoice: ["चालान", "ਚਲਾਨ"], "commercial bill": ["वाणिज्यिक बिल", "ਵਪਾਰਕ ਬਿੱਲ"],
  };
  const pair = map[String(value ?? "commercial bill").toLowerCase()] ?? ["बिल", "ਬਿੱਲ"];
  return language === "hi" ? pair[0] : pair[1];
}
function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T { if (!value || typeof value !== "object") return value; const o = value as object; if (seen.has(o)) return value; seen.add(o); for (const key of Reflect.ownKeys(o)) deepFreeze((o as Record<PropertyKey, unknown>)[key], seen); return Object.freeze(value); }
function family(stemFamilyId: string) { const match = stemFamilyId.match(/T([123])$/u); if (!match) throw new Error(`BTD CP007 v2 cannot resolve stem family ${stemFamilyId}`); return Number(match[1]); }
function raw(entry: (typeof BTD_PERMANENT_QL_REGISTRY)[number], seed: string): R { return entry.origin === "BTD-CP-001" ? buildBtdDiscoveryQuestionV6(entry.sourceAuthorityId as any, seed) as R : buildBtdCp002CandidateQuestion(entry.sourceAuthorityId as any, seed) as R; }

function target(answerSemantic: string, language: BtdCp007LanguageV2) {
  const map: Record<string, readonly [string, string]> = {
    PRESENT_WORTH: ["वर्तमान मूल्य", "ਮੌਜੂਦਾ ਮੁੱਲ"], TRUE_DISCOUNT: ["सच्चा बट्टा", "ਸੱਚਾ ਬੱਟਾ"], BANKERS_DISCOUNT: ["बैंकर बट्टा", "ਬੈਂਕਰ ਬੱਟਾ"], BANKERS_GAIN: ["बैंकर लाभ", "ਬੈਂਕਰ ਲਾਭ"],
    RATE_PERCENT: ["वार्षिक ब्याज दर", "ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ"], FACE_VALUE: ["अंकित मूल्य", "ਅੰਕਿਤ ਮੁੱਲ"], TIME_MONTHS: ["अवधि", "ਮਿਆਦ"], FACE_VALUE_DIFFERENCE: ["दोनों अंकित मूल्यों का अंतर", "ਦੋਵੇਂ ਅੰਕਿਤ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ"],
  };
  const pair = map[answerSemantic] ?? ["आवश्यक मान", "ਲੋੜੀਂਦਾ ਮੁੱਲ"];
  return language === "hi" ? pair[0] : pair[1];
}

function given(sourceId: string, s: R, language: BtdCp007LanguageV2): string {
  const c = context(s.context, language);
  switch (sourceId) {
    case "BTD-PROT-001": case "BTD-PROT-002": case "BTD-PROT-003": case "BTD-PROT-004": return tr(language, `${c} का अंकित मूल्य ${money(s.faceValue)}, वार्षिक दर ${s.ratePercent}% और शेष अवधि ${duration(s.months, language)} है।`, `${c} ਦਾ ਅੰਕਿਤ ਮੁੱਲ ${money(s.faceValue)}, ਸਾਲਾਨਾ ਦਰ ${s.ratePercent}% ਅਤੇ ਬਾਕੀ ਮਿਆਦ ${duration(s.months, language)} ਹੈ।`);
    case "BTD-PROT-005": return tr(language, `${c} का अंकित मूल्य ${money(s.faceValue)} और सच्चा बट्टा ${money(s.trueDiscount)} है।`, `${c} ਦਾ ਅੰਕਿਤ ਮੁੱਲ ${money(s.faceValue)} ਅਤੇ ਸੱਚਾ ਬੱਟਾ ${money(s.trueDiscount)} ਹੈ।`);
    case "BTD-PROT-006": return tr(language, `${c} में BD:TD = ${ratio(s.bdToTdRatio)} और शेष अवधि ${duration(s.months, language)} है।`, `${c} ਵਿੱਚ BD:TD = ${ratio(s.bdToTdRatio)} ਅਤੇ ਬਾਕੀ ਮਿਆਦ ${duration(s.months, language)} ਹੈ।`);
    case "BTD-PROT-007": return tr(language, `${c} का बैंकर लाभ ${money(s.bankersGain)}, वार्षिक दर ${s.ratePercent}% और अवधि ${duration(s.months, language)} है।`, `${c} ਦਾ ਬੈਂਕਰ ਲਾਭ ${money(s.bankersGain)}, ਸਾਲਾਨਾ ਦਰ ${s.ratePercent}% ਅਤੇ ਮਿਆਦ ${duration(s.months, language)} ਹੈ।`);
    case "BTD-PROT-008": return tr(language, `${money(s.faceValue)} का बिल ${dateText(s.drawDateIso, language)} को ${s.termMonths} महीने के लिए बनाया गया और ${dateText(s.discountDateIso, language)} को ${s.ratePercent}% वार्षिक दर पर भुनाया गया; 3 अनुग्रह दिवस लागू हैं।`, `${money(s.faceValue)} ਦਾ ਬਿੱਲ ${dateText(s.drawDateIso, language)} ਨੂੰ ${s.termMonths} ਮਹੀਨਿਆਂ ਲਈ ਬਣਾਇਆ ਗਿਆ ਅਤੇ ${dateText(s.discountDateIso, language)} ਨੂੰ ${s.ratePercent}% ਸਾਲਾਨਾ ਦਰ 'ਤੇ ਭੁਣਾਇਆ ਗਿਆ; 3 ਗ੍ਰੇਸ ਦਿਨ ਲਾਗੂ ਹਨ।`);
    case "BTD-PROT-009": return tr(language, `${c} में BD:TD = ${ratio(s.bdToTdRatio)} और R = ${s.rateEqualsYearsMultiplier}T है, जहाँ T वर्षों में अवधि है।`, `${c} ਵਿੱਚ BD:TD = ${ratio(s.bdToTdRatio)} ਅਤੇ R = ${s.rateEqualsYearsMultiplier}T ਹੈ, ਜਿੱਥੇ T ਸਾਲਾਂ ਵਿੱਚ ਮਿਆਦ ਹੈ।`);
    case "BTD-CAND-010": return tr(language, `${c} का वर्तमान मूल्य ${money(s.presentWorth)} और बैंकर लाभ ${money(s.bankersGain)} है।`, `${c} ਦਾ ਮੌਜੂਦਾ ਮੁੱਲ ${money(s.presentWorth)} ਅਤੇ ਬੈਂਕਰ ਲਾਭ ${money(s.bankersGain)} ਹੈ।`);
    case "BTD-CAND-011": return tr(language, `दो बिलों का कुल अंकित मूल्य ${money(s.totalFaceValue)}, अवधियाँ ${s.firstMonths} और ${s.secondMonths} महीने, समान वार्षिक दर ${s.ratePercent}% तथा कुल बैंकर बट्टा ${money(s.totalBankersDiscount)} है।`, `ਦੋ ਬਿੱਲਾਂ ਦਾ ਕੁੱਲ ਅੰਕਿਤ ਮੁੱਲ ${money(s.totalFaceValue)}, ਮਿਆਦਾਂ ${s.firstMonths} ਅਤੇ ${s.secondMonths} ਮਹੀਨੇ, ਇੱਕੋ ਸਾਲਾਨਾ ਦਰ ${s.ratePercent}% ਅਤੇ ਕੁੱਲ ਬੈਂਕਰ ਬੱਟਾ ${money(s.totalBankersDiscount)} ਹੈ।`);
    case "BTD-CAND-012": return tr(language, `${c} का बैंकर बट्टा ${money(s.bankersDiscount)} और सच्चा बट्टा ${money(s.trueDiscount)} है।`, `${c} ਦਾ ਬੈਂਕਰ ਬੱਟਾ ${money(s.bankersDiscount)} ਅਤੇ ਸੱਚਾ ਬੱਟਾ ${money(s.trueDiscount)} ਹੈ।`);
    case "BTD-CAND-013": return tr(language, `${c} का बैंकर बट्टा ${money(s.bankersDiscount)}, वार्षिक दर ${s.ratePercent}% और अवधि ${s.months} महीने है।`, `${c} ਦਾ ਬੈਂਕਰ ਬੱਟਾ ${money(s.bankersDiscount)}, ਸਾਲਾਨਾ ਦਰ ${s.ratePercent}% ਅਤੇ ਮਿਆਦ ${s.months} ਮਹੀਨੇ ਹੈ।`);
    case "BTD-CAND-014": return tr(language, `${c} में BD:TD = ${ratio(s.bdToTdRatio)} और वार्षिक दर ${s.ratePercent}% है।`, `${c} ਵਿੱਚ BD:TD = ${ratio(s.bdToTdRatio)} ਅਤੇ ਸਾਲਾਨਾ ਦਰ ${s.ratePercent}% ਹੈ।`);
    case "BTD-CAND-015": return tr(language, `${c} का बैंकर लाभ ${money(s.bankersGain)}, वार्षिक दर ${s.ratePercent}% और अवधि ${s.months} महीने है।`, `${c} ਦਾ ਬੈਂਕਰ ਲਾਭ ${money(s.bankersGain)}, ਸਾਲਾਨਾ ਦਰ ${s.ratePercent}% ਅਤੇ ਮਿਆਦ ${s.months} ਮਹੀਨੇ ਹੈ।`);
    case "BTD-CAND-016": case "BTD-CAND-017": return tr(language, `${c} का वर्तमान मूल्य ${money(s.presentWorth)} और सच्चा बट्टा ${money(s.trueDiscount)} है।`, `${c} ਦਾ ਮੌਜੂਦਾ ਮੁੱਲ ${money(s.presentWorth)} ਅਤੇ ਸੱਚਾ ਬੱਟਾ ${money(s.trueDiscount)} ਹੈ।`);
    case "BTD-CAND-018": return tr(language, `${s.ratePercent}% वार्षिक दर पर ${money(s.bankersDiscountFace)} का BD, समान अवधि के लिए ${money(s.trueDiscountFace)} के TD के बराबर है।`, `${s.ratePercent}% ਸਾਲਾਨਾ ਦਰ 'ਤੇ ${money(s.bankersDiscountFace)} ਦਾ BD, ਇੱਕੋ ਮਿਆਦ ਲਈ ${money(s.trueDiscountFace)} ਦੇ TD ਦੇ ਬਰਾਬਰ ਹੈ।`);
    case "BTD-CAND-019": return tr(language, `${c} का BD ${money(s.bankersDiscount)}, TD ${money(s.trueDiscount)} और अवधि ${s.months} महीने है।`, `${c} ਦਾ BD ${money(s.bankersDiscount)}, TD ${money(s.trueDiscount)} ਅਤੇ ਮਿਆਦ ${s.months} ਮਹੀਨੇ ਹੈ।`);
    case "BTD-CAND-020": return tr(language, `${c} का सच्चा बट्टा ${money(s.trueDiscount)}, वार्षिक दर ${s.ratePercent}% और अवधि ${s.months} महीने है।`, `${c} ਦਾ ਸੱਚਾ ਬੱਟਾ ${money(s.trueDiscount)}, ਸਾਲਾਨਾ ਦਰ ${s.ratePercent}% ਅਤੇ ਮਿਆਦ ${s.months} ਮਹੀਨੇ ਹੈ।`);
    default: throw new Error(`BTD CP007 v2 missing given summary for ${sourceId}`);
  }
}

function stem(g: string, askTarget: string, familyId: number, language: BtdCp007LanguageV2) {
  const ask = tr(language, `${askTarget} ज्ञात कीजिए।`, `${askTarget} ਕੱਢੋ।`);
  if (familyId === 1) return `${g} ${ask}`;
  if (familyId === 2) return `${g} ${tr(language, `इन जानकारियों से ${askTarget} कितना होगा?`, `ਇਨ੍ਹਾਂ ਜਾਣਕਾਰੀਆਂ ਤੋਂ ${askTarget} ਕਿੰਨਾ ਹੋਵੇਗਾ?`)}`;
  return `${g} ${tr(language, `आवश्यक ${askTarget} निर्धारित कीजिए।`, `ਲੋੜੀਂਦਾ ${askTarget} ਨਿਰਧਾਰਤ ਕਰੋ।`)}`;
}

function keyIdea(sourceId: string, language: BtdCp007LanguageV2) {
  const ideas: Record<string, readonly [string, string]> = {
    "BTD-PROT-001": ["वर्तमान मूल्य वह मूलधन है जो शेष अवधि के साधारण ब्याज सहित अंकित मूल्य बनता है।", "ਮੌਜੂਦਾ ਮੁੱਲ ਉਹ ਮੁੱਢਲੀ ਰਕਮ ਹੈ ਜੋ ਬਾਕੀ ਮਿਆਦ ਦੇ ਸਧਾਰਣ ਵਿਆਜ ਸਮੇਤ ਅੰਕਿਤ ਮੁੱਲ ਬਣਦੀ ਹੈ।"],
    "BTD-PROT-002": ["सच्चा बट्टा अंकित मूल्य और वर्तमान मूल्य का अंतर है।", "ਸੱਚਾ ਬੱਟਾ ਅੰਕਿਤ ਮੁੱਲ ਅਤੇ ਮੌਜੂਦਾ ਮੁੱਲ ਦਾ ਅੰਤਰ ਹੈ।"],
    "BTD-PROT-003": ["बैंकर बट्टा शेष अवधि के लिए अंकित मूल्य पर साधारण ब्याज है।", "ਬੈਂਕਰ ਬੱਟਾ ਬਾਕੀ ਮਿਆਦ ਲਈ ਅੰਕਿਤ ਮੁੱਲ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ ਹੈ।"],
    "BTD-PROT-004": ["बैंकर लाभ = बैंकर बट्टा − सच्चा बट्टा।", "ਬੈਂਕਰ ਲਾਭ = ਬੈਂਕਰ ਬੱਟਾ − ਸੱਚਾ ਬੱਟਾ।"],
    "BTD-PROT-005": ["समान दर और अवधि में BD/TD = अंकित मूल्य/वर्तमान मूल्य।", "ਇੱਕੋ ਦਰ ਅਤੇ ਮਿਆਦ ਵਿੱਚ BD/TD = ਅੰਕਿਤ ਮੁੱਲ/ਮੌਜੂਦਾ ਮੁੱਲ।"],
    "BTD-PROT-006": ["यदि x = दर × महीने/1200, तो समान बिल के लिए BD/TD = 1 + x।", "ਜੇ x = ਦਰ × ਮਹੀਨੇ/1200, ਤਾਂ ਇੱਕੋ ਬਿੱਲ ਲਈ BD/TD = 1 + x।"],
    "BTD-PROT-007": ["यदि x = दर × महीने/1200, तो बैंकर लाभ = PW × x²।", "ਜੇ x = ਦਰ × ਮਹੀਨੇ/1200, ਤਾਂ ਬੈਂਕਰ ਲਾਭ = PW × x²।"],
    "BTD-PROT-008": ["3 अनुग्रह दिवस सहित कानूनी देय तिथि निकालकर शेष दिनों के लिए अंकित मूल्य पर साधारण ब्याज लें।", "3 ਗ੍ਰੇਸ ਦਿਨਾਂ ਸਮੇਤ ਕਾਨੂੰਨੀ ਦੇਯ ਮਿਤੀ ਕੱਢ ਕੇ ਬਾਕੀ ਦਿਨਾਂ ਲਈ ਅੰਕਿਤ ਮੁੱਲ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ ਲਓ।"],
    "BTD-PROT-009": ["BD/TD = 1 + RT/100 को R = kT के साथ जोड़ने पर R का सीधा समीकरण मिलता है।", "BD/TD = 1 + RT/100 ਨੂੰ R = kT ਨਾਲ ਜੋੜਨ 'ਤੇ R ਦਾ ਸਿੱਧਾ ਸਮੀਕਰਨ ਮਿਲਦਾ ਹੈ।"],
    "BTD-CAND-010": ["समान बिल के लिए BG = TD²/PW।", "ਇੱਕੋ ਬਿੱਲ ਲਈ BG = TD²/PW।"],
    "BTD-CAND-011": ["कुल अंकित मूल्य एक समीकरण और कुल बैंकर बट्टा दूसरा भारित समीकरण देता है।", "ਕੁੱਲ ਅੰਕਿਤ ਮੁੱਲ ਇੱਕ ਸਮੀਕਰਨ ਅਤੇ ਕੁੱਲ ਬੈਂਕਰ ਬੱਟਾ ਦੂਜਾ ਭਾਰਿਤ ਸਮੀਕਰਨ ਦਿੰਦਾ ਹੈ।"],
    "BTD-CAND-012": ["BG = BD − TD और BG = BD×TD/Face से अंकित मूल्य मिलता है।", "BG = BD − TD ਅਤੇ BG = BD×TD/Face ਤੋਂ ਅੰਕਿਤ ਮੁੱਲ ਮਿਲਦਾ ਹੈ।"],
    "BTD-CAND-013": ["x = दर × महीने/1200 रखने पर BD/TD = 1 + x।", "x = ਦਰ × ਮਹੀਨੇ/1200 ਰੱਖਣ 'ਤੇ BD/TD = 1 + x।"],
    "BTD-CAND-014": ["BD/TD = 1 + x से पहले शेष-अवधि ब्याज गुणक x निकालें।", "BD/TD = 1 + x ਤੋਂ ਪਹਿਲਾਂ ਬਾਕੀ-ਮਿਆਦ ਵਿਆਜ ਗੁਣਕ x ਕੱਢੋ।"],
    "BTD-CAND-015": ["x = दर × महीने/1200 रखने पर BG = TD × x।", "x = ਦਰ × ਮਹੀਨੇ/1200 ਰੱਖਣ 'ਤੇ BG = TD × x।"],
    "BTD-CAND-016": ["अंकित मूल्य = PW + TD और BD/TD = Face/PW।", "ਅੰਕਿਤ ਮੁੱਲ = PW + TD ਅਤੇ BD/TD = Face/PW।"],
    "BTD-CAND-017": ["बैंकर लाभ = TD²/PW।", "ਬੈਂਕਰ ਲਾਭ = TD²/PW।"],
    "BTD-CAND-018": ["बराबर BD और TD की शर्त से 1 + x = दूसरे अंकित मूल्य/पहले अंकित मूल्य।", "ਬਰਾਬਰ BD ਅਤੇ TD ਦੀ ਸ਼ਰਤ ਤੋਂ 1 + x = ਦੂਜਾ ਅੰਕਿਤ ਮੁੱਲ/ਪਹਿਲਾ ਅੰਕਿਤ ਮੁੱਲ।"],
    "BTD-CAND-019": ["BD/TD = 1 + x से x निकालें; अवधि ज्ञात होने पर वार्षिक दर मिलती है।", "BD/TD = 1 + x ਤੋਂ x ਕੱਢੋ; ਮਿਆਦ ਪਤਾ ਹੋਣ 'ਤੇ ਸਾਲਾਨਾ ਦਰ ਮਿਲਦੀ ਹੈ।"],
    "BTD-CAND-020": ["x = दर × महीने/1200 और BD = TD(1+x)।", "x = ਦਰ × ਮਹੀਨੇ/1200 ਅਤੇ BD = TD(1+x)।"],
  };
  const pair = ideas[sourceId]; if (!pair) throw new Error(`BTD CP007 v2 missing key idea for ${sourceId}`); return language === "hi" ? pair[0] : pair[1];
}

function calculations(sourceId: string, s: R, answer: string, language: BtdCp007LanguageV2): readonly string[] {
  const x = typeof s.ratePercent === "number" && typeof s.months === "number" ? s.ratePercent * s.months / 1200 : null;
  switch (sourceId) {
    case "BTD-PROT-001": return [tr(language, `ब्याज गुणक x = ${s.ratePercent} × ${s.months}/1200 = ${n(x!)}।`, `ਵਿਆਜ ਗੁਣਕ x = ${s.ratePercent} × ${s.months}/1200 = ${n(x!)}।`), tr(language, `PW = ${money(s.faceValue)}/(1+x) = ${answer}।`, `PW = ${money(s.faceValue)}/(1+x) = ${answer}।`)];
    case "BTD-PROT-002": { const pw = numeric(s.faceValue) / (1 + x!); return [tr(language, `PW = ${money(s.faceValue)}/(1+${n(x!)}) = ${money(pw)}।`, `PW = ${money(s.faceValue)}/(1+${n(x!)}) = ${money(pw)}।`), tr(language, `TD = अंकित मूल्य − PW = ${money(s.faceValue)} − ${money(pw)} = ${answer}।`, `TD = ਅੰਕਿਤ ਮੁੱਲ − PW = ${money(s.faceValue)} − ${money(pw)} = ${answer}।`)]; }
    case "BTD-PROT-003": return [tr(language, `BD = अंकित मूल्य × दर × महीने/1200।`, `BD = ਅੰਕਿਤ ਮੁੱਲ × ਦਰ × ਮਹੀਨੇ/1200।`), `BD = ${money(s.faceValue)} × ${s.ratePercent} × ${s.months}/1200 = ${answer}।`];
    case "BTD-PROT-004": { const face = numeric(s.faceValue); const pw = face / (1 + x!); const bd = face * x!; const td = face - pw; return [`BD = ${money(bd)}; TD = ${money(td)}।`, tr(language, `BG = BD − TD = ${money(bd)} − ${money(td)} = ${answer}।`, `BG = BD − TD = ${money(bd)} − ${money(td)} = ${answer}।`)]; }
    case "BTD-PROT-005": { const pw = numeric(s.faceValue) - numeric(s.trueDiscount); return [tr(language, `PW = ${money(s.faceValue)} − ${money(s.trueDiscount)} = ${money(pw)}।`, `PW = ${money(s.faceValue)} − ${money(s.trueDiscount)} = ${money(pw)}।`), `BD = TD × Face/PW = ${money(s.trueDiscount)} × ${money(s.faceValue)}/${money(pw)} = ${answer}।`]; }
    case "BTD-PROT-006": { const factor = numeric(s.bdToTdRatio) - 1; return [`x = BD/TD − 1 = ${ratio(s.bdToTdRatio)} − 1 = ${n(factor)}।`, tr(language, `दर = x × 1200/${s.months} = ${answer}।`, `ਦਰ = x × 1200/${s.months} = ${answer}।`)]; }
    case "BTD-PROT-007": return [`x = ${s.ratePercent} × ${s.months}/1200 = ${n(x!)}।`, `PW = BG/x² = ${money(s.bankersGain)}/${n(x!)}² = ${answer}।`];
    case "BTD-PROT-008": { const days = daysBetween(s.discountDateIso, s.legalDueDateIso); return [tr(language, `3 अनुग्रह दिवस सहित कानूनी देय तिथि ${dateText(s.legalDueDateIso, language)} है; शेष समय ${days} दिन है।`, `3 ਗ੍ਰੇਸ ਦਿਨਾਂ ਸਮੇਤ ਕਾਨੂੰਨੀ ਦੇਯ ਮਿਤੀ ${dateText(s.legalDueDateIso, language)} ਹੈ; ਬਾਕੀ ਸਮਾਂ ${days} ਦਿਨ ਹੈ।`), `BD = ${money(s.faceValue)} × ${s.ratePercent} × ${days}/36500 = ${answer}।`]; }
    case "BTD-PROT-009": { const delta = numeric(s.bdToTdRatio) - 1; return [`BD/TD − 1 = ${ratio(s.bdToTdRatio)} − 1 = ${n(delta)}।`, `R² = 100 × ${s.rateEqualsYearsMultiplier} × ${n(delta)}; R = ${answer}।`]; }
    case "BTD-CAND-010": return [`TD = √(PW × BG) = √(${money(s.presentWorth)} × ${money(s.bankersGain)})।`, tr(language, `अतः TD = ${answer}।`, `ਇਸ ਲਈ TD = ${answer}।`)];
    case "BTD-CAND-011": { const total = numeric(s.totalFaceValue); const d = numeric(s.totalBankersDiscount); const x1 = s.ratePercent * s.firstMonths / 1200; const x2 = s.ratePercent * s.secondMonths / 1200; const f1 = (d - total * x2) / (x1 - x2); const f2 = total - f1; return [`F₁ + F₂ = ${money(total)}; ${n(x1)}F₁ + ${n(x2)}F₂ = ${money(d)}।`, tr(language, `हल करने पर F₁ = ${money(f1)}, F₂ = ${money(f2)}; अंतर = ${answer}।`, `ਹੱਲ ਕਰਨ 'ਤੇ F₁ = ${money(f1)}, F₂ = ${money(f2)}; ਅੰਤਰ = ${answer}।`)]; }
    case "BTD-CAND-012": { const bg = numeric(s.bankersDiscount) - numeric(s.trueDiscount); return [`BG = BD − TD = ${money(s.bankersDiscount)} − ${money(s.trueDiscount)} = ${money(bg)}।`, `Face = BD × TD/BG = ${answer}।`]; }
    case "BTD-CAND-013": return [`x = ${s.ratePercent} × ${s.months}/1200 = ${n(x!)}।`, `TD = BD/(1+x) = ${money(s.bankersDiscount)}/(1+${n(x!)}) = ${answer}।`];
    case "BTD-CAND-014": { const factor = numeric(s.bdToTdRatio) - 1; return [`x = BD/TD − 1 = ${n(factor)}।`, tr(language, `अवधि = x × 1200/${s.ratePercent} = ${answer}।`, `ਮਿਆਦ = x × 1200/${s.ratePercent} = ${answer}।`)]; }
    case "BTD-CAND-015": return [`x = ${s.ratePercent} × ${s.months}/1200 = ${n(x!)}।`, `TD = BG/x = ${money(s.bankersGain)}/${n(x!)} = ${answer}।`];
    case "BTD-CAND-016": { const face = numeric(s.presentWorth) + numeric(s.trueDiscount); return [`Face = PW + TD = ${money(s.presentWorth)} + ${money(s.trueDiscount)} = ${money(face)}।`, `BD = TD × Face/PW = ${answer}।`]; }
    case "BTD-CAND-017": return [`BG = TD²/PW = ${money(s.trueDiscount)}²/${money(s.presentWorth)}।`, tr(language, `अतः BG = ${answer}।`, `ਇਸ ਲਈ BG = ${answer}।`)];
    case "BTD-CAND-018": { const factor = numeric(s.trueDiscountFace) / numeric(s.bankersDiscountFace) - 1; return [`1 + x = ${money(s.trueDiscountFace)}/${money(s.bankersDiscountFace)}; x = ${n(factor)}।`, tr(language, `अवधि = x × 1200/${s.ratePercent} = ${answer}।`, `ਮਿਆਦ = x × 1200/${s.ratePercent} = ${answer}।`)]; }
    case "BTD-CAND-019": { const factor = numeric(s.bankersDiscount) / numeric(s.trueDiscount) - 1; return [`x = BD/TD − 1 = ${money(s.bankersDiscount)}/${money(s.trueDiscount)} − 1 = ${n(factor)}।`, tr(language, `दर = x × 1200/${s.months} = ${answer}।`, `ਦਰ = x × 1200/${s.months} = ${answer}।`)]; }
    case "BTD-CAND-020": return [`x = ${s.ratePercent} × ${s.months}/1200 = ${n(x!)}।`, `BD = TD(1+x) = ${money(s.trueDiscount)} × (1+${n(x!)}) = ${answer}।`];
    default: throw new Error(`BTD CP007 v2 missing calculations for ${sourceId}`);
  }
}

export const BTD_CP007_LOCALIZATION_BOUNDARY_V2 = Object.freeze({
  localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const, englishAuthorityFrozen: true as const, multilingualFrozen: false as const,
  questionStudioDiscoverable: false as const, questionStudioGenerationEnabled: false as const, questionBankWritable: false as const,
  testEligible: false as const, mockTestEligible: false as const, publiclyPublishable: false as const,
});

export function buildBtdLocalizedQuestionV2(qlId: BtdPermanentQlId, seed: string, language: BtdCp007LanguageV2) {
  const entry = BTD_PERMANENT_QL_REGISTRY.find((item) => item.qlId === qlId); if (!entry) throw new Error(`${qlId}: unknown BTD permanent QL`);
  const frozen = buildBtdFrozenEnglishQuestionV1(qlId, seed) as R; const authority = raw(entry, seed);
  const observedStateFingerprint = sourceFingerprint(authority.state);
  if (observedStateFingerprint !== frozen.sourceStateFingerprint) throw new Error(`${qlId}/${seed}: localized source state fingerprint differs from frozen English authority`);
  const askTarget = target(entry.answerSemantic, language); const g = given(entry.sourceAuthorityId, authority.state, language); const f = family(frozen.presentation.stemFamilyId);
  const localizedStem = stem(g, askTarget, f, language); const steps = calculations(entry.sourceAuthorityId, authority.state, frozen.correctAnswer, language);
  const explanation = Object.freeze({ whatGiven: g, whatAsked: tr(language, `${askTarget} ज्ञात कीजिए।`, `${askTarget} ਕੱਢੋ।`), keyIdea: keyIdea(entry.sourceAuthorityId, language), steps: Object.freeze([...steps]), finalAnswer: tr(language, `अतः सही उत्तर ${frozen.correctAnswer} है।`, `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${frozen.correctAnswer} ਹੈ।`) });
  const options = Object.freeze(frozen.options.map((option: R) => Object.freeze({ text: String(option.text), isCorrect: Boolean(option.isCorrect), misconceptionId: option.misconceptionId ? String(option.misconceptionId) : undefined })));
  const payload = { qlId, language, semanticSignature: entry.semanticSignature, answerSemantic: entry.answerSemantic, sourceStateFingerprint: observedStateFingerprint, englishContentFingerprint: frozen.contentFingerprint, presentation: { stemFamilyId: `${frozen.presentation.stemFamilyId}-${language.toUpperCase()}`, stem: localizedStem }, options: options.map((o) => o.text), correctIndex: frozen.correctIndex, correctAnswer: frozen.correctAnswer, explanation };
  return deepFreeze({ chapterId: "BTD-001" as const, checkpointId: "BTD-CP-007" as const, localizationVersion: BTD_CP007_LOCALIZATION_V2, ...payload, locale: language === "hi" ? "hi-IN" as const : "pa-IN" as const, sourceAuthorityId: entry.sourceAuthorityId, localizationFingerprint: fingerprint(payload), lifecycle: BTD_CP007_LOCALIZATION_BOUNDARY_V2 });
}
