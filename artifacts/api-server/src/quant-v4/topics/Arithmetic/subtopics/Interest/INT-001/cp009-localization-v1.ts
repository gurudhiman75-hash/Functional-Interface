import { add, sub, rat, type Rational } from "./cp003-exam-model";
import {
  intCp009DebtBalanceByRecurrence,
  intCp009EquivalentAt,
  intCp009GrowthFactor,
  intCp009ShiftAmount,
} from "./cp009-dated-cash-flow-discovery-v1";
import { generateIntCp009Permanent, type IntCp009PermanentQlId } from "./cp009-production-runtime-v1";

export const INT_CP009_LOCALIZATION_VERSION = "INT-CP-009-HI-PA-v1" as const;
export const INT_CP009_LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);
export type IntCp009Language = (typeof INT_CP009_LANGUAGES)[number];

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function indianInteger(value: bigint): string {
  const sign = value < 0n ? "−" : "";
  const source = (value < 0n ? -value : value).toString();
  if (source.length <= 3) return `${sign}${source}`;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${sign}${groups.join(",")},${tail}`;
}

function money(value: Rational): string {
  const negative = value.numerator < 0n;
  const numerator = negative ? -value.numerator : value.numerator;
  let paise = (numerator * 100n) / value.denominator;
  const remainder = (numerator * 100n) % value.denominator;
  if (remainder * 2n >= value.denominator) paise += 1n;
  const rupees = paise / 100n;
  const p = paise % 100n;
  const text = p === 0n ? indianInteger(rupees) : `${indianInteger(rupees)}.${p.toString().padStart(2, "0")}`;
  return `${negative ? "−" : ""}₹${text}`;
}

function percent(value: Rational): string {
  return value.denominator === 1n ? `${value.numerator}%` : `${value.numerator}/${value.denominator}%`;
}

function factorText(rate: Rational) {
  const factor = intCp009GrowthFactor(rate);
  return `${factor.numerator}/${factor.denominator}`;
}

function time(period: number, unit: string, language: "hi" | "pa") {
  if (period === 0) return language === "hi" ? "आज" : "ਅੱਜ";
  if (language === "hi") return unit === "YEAR" ? `${period}वें वर्ष के अंत में` : `${period}वीं अर्धवार्षिक अवधि के अंत में`;
  return unit === "YEAR" ? `${period}ਵੇਂ ਸਾਲ ਦੇ ਅੰਤ ਤੇ` : `${period}ਵੀਂ ਅੱਧ-ਸਾਲੀ ਮਿਆਦ ਦੇ ਅੰਤ ਤੇ`;
}

function flowList(flows: readonly any[], unit: string, language: "hi" | "pa") {
  return flows.map((flow) => `${money(flow.amount)} ${time(flow.atPeriod, unit, language)}`).join(language === "hi" ? ", " : ", ");
}

function rateText(rate: Rational, unit: string, language: "hi" | "pa") {
  if (language === "hi") return unit === "YEAR" ? `${percent(rate)} वार्षिक, वार्षिक चक्रवृद्धि` : `${percent(rate)} प्रति अर्धवर्ष, अर्धवार्षिक चक्रवृद्धि`;
  return unit === "YEAR" ? `${percent(rate)} ਸਾਲਾਨਾ, ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ` : `${percent(rate)} ਪ੍ਰਤੀ ਅੱਧ-ਸਾਲ, ਅੱਧ-ਸਾਲੀ ਚੱਕਰਵੱਧੀ`;
}

function promptFor(source: any, language: "hi" | "pa") {
  const s = source.mathematicalState as any;
  const r = s.periodicRatePercent ? rateText(s.periodicRatePercent, s.periodUnit, language) : "";
  if (language === "hi") {
    switch (s.prototypeId) {
      case "INT-CP009-PROT-001": return `एक बचत खाते में ${r} ब्याज मिलता है। जमा राशियाँ हैं: ${flowList(s.deposits, s.periodUnit, language)}। ${time(s.duePeriod, s.periodUnit, language)} खाते की कुल राशि ज्ञात कीजिए।`;
      case "INT-CP009-PROT-002": return `एक ऋण पर ${r} ब्याज लगता है और इसे इन असमान भुगतानों से पूरी तरह चुकाया जाता है: ${flowList(s.repayments, s.periodUnit, language)}। आरंभ में लिया गया ऋण ज्ञात कीजिए।`;
      case "INT-CP009-PROT-003": return `आज ऋण ${money(s.openingDebt)} है और ब्याज ${r} है। ज्ञात भुगतान हैं: ${flowList(s.repayments, s.periodUnit, language)}। ${time(s.missingAtPeriod, s.periodUnit, language)} का एक भुगतान गायब है। ऋण ठीक-ठीक समाप्त करने के लिए वह भुगतान कितना होना चाहिए?`;
      case "INT-CP009-PROT-004": return `आरंभिक ऋण ${money(s.openingDebt)} है, ब्याज ${r} है और भुगतान हैं: ${flowList(s.repayments, s.periodUnit, language)}। ${time(s.afterPeriod, s.periodUnit, language)} किए गए भुगतान के तुरंत बाद बकाया राशि ज्ञात कीजिए।`;
      case "INT-CP009-PROT-005": return `आरंभिक ऋण ${money(s.openingDebt)} है और ब्याज ${r} है। ज्ञात भुगतान हैं: ${flowList(s.knownRepayments, s.periodUnit, language)}। ${time(s.finalPeriod, s.periodUnit, language)} ऋण चुकाने के लिए अंतिम भुगतान कितना होना चाहिए?`;
      case "INT-CP009-PROT-006": return `${time(s.duePeriod, s.periodUnit, language)} निधि में ठीक ${money(s.targetFund)} चाहिए। ज्ञात जमा हैं: ${flowList(s.deposits, s.periodUnit, language)}। ब्याज ${r} है। ${time(s.missingAtPeriod, s.periodUnit, language)} की गायब जमा ज्ञात कीजिए।`;
      case "INT-CP009-PROT-007": return `आज का ऋण ${money(s.openingDebt)} है और इसे इन भुगतानों से ठीक-ठीक चुकाया जाता है: ${flowList(s.repayments, s.periodUnit, language)}। लागू चक्रवृद्धि ब्याज दर ज्ञात कीजिए।`;
      case "INT-CP009-PROT-008": return `${r} पर इन भुगतानों ${flowList(s.repayments, s.periodUnit, language)} के स्थान पर ${time(s.comparisonPeriod, s.periodUnit, language)} एक ही समतुल्य भुगतान करना है। वह भुगतान ज्ञात कीजिए।`;
    }
  }
  switch (s.prototypeId) {
    case "INT-CP009-PROT-001": return `ਇੱਕ ਬਚਤ ਖਾਤੇ ਤੇ ${r} ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ਜਮ੍ਹਾਂ ਰਕਮਾਂ ਹਨ: ${flowList(s.deposits, s.periodUnit, language)}। ${time(s.duePeriod, s.periodUnit, language)} ਖਾਤੇ ਦੀ ਕੁੱਲ ਰਕਮ ਕੱਢੋ।`;
    case "INT-CP009-PROT-002": return `ਇੱਕ ਕਰਜ਼ੇ ਤੇ ${r} ਵਿਆਜ ਲੱਗਦਾ ਹੈ ਅਤੇ ਇਹਨਾਂ ਅਸਮਾਨ ਭੁਗਤਾਨਾਂ ਨਾਲ ਕਰਜ਼ਾ ਪੂਰਾ ਮੁਕ ਜਾਂਦਾ ਹੈ: ${flowList(s.repayments, s.periodUnit, language)}। ਸ਼ੁਰੂ ਵਿੱਚ ਲਿਆ ਕਰਜ਼ਾ ਕਿੰਨਾ ਸੀ?`;
    case "INT-CP009-PROT-003": return `ਅੱਜ ਕਰਜ਼ਾ ${money(s.openingDebt)} ਹੈ ਅਤੇ ਵਿਆਜ ${r} ਹੈ। ਜਾਣੇ ਭੁਗਤਾਨ ਹਨ: ${flowList(s.repayments, s.periodUnit, language)}। ${time(s.missingAtPeriod, s.periodUnit, language)} ਦਾ ਇੱਕ ਭੁਗਤਾਨ ਨਹੀਂ ਦਿੱਤਾ। ਕਰਜ਼ਾ ਬਿਲਕੁਲ ਮੁਕਾਉਣ ਲਈ ਉਹ ਭੁਗਤਾਨ ਕਿੰਨਾ ਹੋਵੇ?`;
    case "INT-CP009-PROT-004": return `ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ ${money(s.openingDebt)} ਹੈ, ਵਿਆਜ ${r} ਹੈ ਅਤੇ ਭੁਗਤਾਨ ਹਨ: ${flowList(s.repayments, s.periodUnit, language)}। ${time(s.afterPeriod, s.periodUnit, language)} ਕੀਤੇ ਭੁਗਤਾਨ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਬਕਾਇਆ ਕਿੰਨਾ ਰਹੇਗਾ?`;
    case "INT-CP009-PROT-005": return `ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ ${money(s.openingDebt)} ਹੈ ਅਤੇ ਵਿਆਜ ${r} ਹੈ। ਜਾਣੇ ਭੁਗਤਾਨ ਹਨ: ${flowList(s.knownRepayments, s.periodUnit, language)}। ${time(s.finalPeriod, s.periodUnit, language)} ਕਰਜ਼ਾ ਮੁਕਾਉਣ ਲਈ ਆਖਰੀ ਭੁਗਤਾਨ ਕਿੰਨਾ ਹੋਵੇ?`;
    case "INT-CP009-PROT-006": return `${time(s.duePeriod, s.periodUnit, language)} ਫੰਡ ਵਿੱਚ ਠੀਕ ${money(s.targetFund)} ਚਾਹੀਦਾ ਹੈ। ਜਾਣੀਆਂ ਜਮ੍ਹਾਂ ਹਨ: ${flowList(s.deposits, s.periodUnit, language)}। ਵਿਆਜ ${r} ਹੈ। ${time(s.missingAtPeriod, s.periodUnit, language)} ਦੀ ਗੁੰਮ ਜਮ੍ਹਾਂ ਰਕਮ ਕੱਢੋ।`;
    case "INT-CP009-PROT-007": return `ਅੱਜ ਦਾ ਕਰਜ਼ਾ ${money(s.openingDebt)} ਹੈ ਅਤੇ ਇਹਨਾਂ ਭੁਗਤਾਨਾਂ ਨਾਲ ਬਿਲਕੁਲ ਮੁਕ ਜਾਂਦਾ ਹੈ: ${flowList(s.repayments, s.periodUnit, language)}। ਲਾਗੂ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਦਰ ਕੱਢੋ।`;
    case "INT-CP009-PROT-008": return `${r} ਤੇ ਇਹਨਾਂ ਭੁਗਤਾਨਾਂ ${flowList(s.repayments, s.periodUnit, language)} ਦੀ ਥਾਂ ${time(s.comparisonPeriod, s.periodUnit, language)} ਇੱਕੋ ਸਮਤੁੱਲ ਭੁਗਤਾਨ ਕਰਨਾ ਹੈ। ਉਹ ਰਕਮ ਕੱਢੋ।`;
  }
  throw new Error(`Unsupported CP009 prototype ${s.prototypeId}`);
}

function localizedExplanation(source: any, language: "hi" | "pa") {
  const s = source.mathematicalState as any;
  const answer = source.answer as Rational;
  const hi = language === "hi";
  const factor = s.periodicRatePercent ? factorText(s.periodicRatePercent) : "";
  const final = source.correctAnswer;
  let keyIdea = "";
  let steps: string[] = [];

  switch (s.prototypeId) {
    case "INT-CP009-PROT-001": {
      const values = s.deposits.map((flow: any) => intCp009ShiftAmount(flow.amount, s.periodicRatePercent, flow.atPeriod, s.duePeriod));
      keyIdea = hi ? "हर जमा को उसकी अपनी तारीख से लक्ष्य तारीख तक बढ़ाएँ और फिर सभी राशियाँ जोड़ें।" : "ਹਰ ਜਮ੍ਹਾਂ ਨੂੰ ਉਸਦੀ ਆਪਣੀ ਤਾਰੀਖ ਤੋਂ ਨਿਸ਼ਾਨਾ ਤਾਰੀਖ ਤੱਕ ਵਧਾਓ ਅਤੇ ਫਿਰ ਸਾਰੀਆਂ ਰਕਮਾਂ ਜੋੜੋ।";
      steps = [
        hi ? `प्रति अवधि वृद्धि गुणक = ${factor}।` : `ਹਰ ਮਿਆਦ ਦਾ ਵਾਧਾ ਗੁਣਕ = ${factor}।`,
        s.deposits.map((flow: any, i: number) => `${money(flow.amount)} × (${factor})^${s.duePeriod - flow.atPeriod} = ${money(values[i]!)}`).join("; "),
        `${values.map((v: Rational) => money(v)).join(" + ")} = ${money(answer)}`,
        hi ? `अतः लक्ष्य राशि = ${final}।` : `ਇਸ ਲਈ ਨਿਸ਼ਾਨਾ ਰਕਮ = ${final}।`,
      ];
      break;
    }
    case "INT-CP009-PROT-002": {
      const pvs = s.repayments.map((flow: any) => intCp009ShiftAmount(flow.amount, s.periodicRatePercent, flow.atPeriod, 0));
      keyIdea = hi ? "सभी भविष्य के भुगतानों का आज का समतुल्य मूल्य निकालें। उनका योग ही आरंभिक ऋण है।" : "ਸਾਰੇ ਭਵਿੱਖੀ ਭੁਗਤਾਨਾਂ ਦਾ ਅੱਜ ਦਾ ਸਮਤੁੱਲ ਮੁੱਲ ਕੱਢੋ। ਉਹਨਾਂ ਦਾ ਜੋੜ ਹੀ ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ ਹੈ।";
      steps = [
        hi ? `वृद्धि गुणक = ${factor}; हर भुगतान को उसकी तारीख से आज तक छूट दें।` : `ਵਾਧਾ ਗੁਣਕ = ${factor}; ਹਰ ਭੁਗਤਾਨ ਨੂੰ ਉਸਦੀ ਤਾਰੀਖ ਤੋਂ ਅੱਜ ਤੱਕ ਡਿਸਕਾਊਂਟ ਕਰੋ।`,
        s.repayments.map((flow: any, i: number) => `${money(flow.amount)} → ${money(pvs[i]!)}`).join("; "),
        `${pvs.map((v: Rational) => money(v)).join(" + ")} = ${money(answer)}`,
        hi ? `अतः आरंभिक ऋण = ${final}।` : `ਇਸ ਲਈ ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ = ${final}।`,
      ];
      break;
    }
    case "INT-CP009-PROT-003": {
      const knownPv = intCp009EquivalentAt(s.repayments, s.periodicRatePercent, 0);
      const missingPv = sub(s.openingDebt, knownPv);
      const missing = intCp009ShiftAmount(missingPv, s.periodicRatePercent, 0, s.missingAtPeriod);
      keyIdea = hi ? "आज की तारीख पर ऋण और सभी भुगतानों को बराबर करें; बचा हुआ वर्तमान मूल्य गायब भुगतान का वर्तमान मूल्य है।" : "ਅੱਜ ਦੀ ਤਾਰੀਖ ਤੇ ਕਰਜ਼ੇ ਅਤੇ ਸਾਰੇ ਭੁਗਤਾਨਾਂ ਨੂੰ ਬਰਾਬਰ ਕਰੋ; ਬਚਿਆ ਮੌਜੂਦਾ ਮੁੱਲ ਗੁੰਮ ਭੁਗਤਾਨ ਦਾ ਮੌਜੂਦਾ ਮੁੱਲ ਹੈ।";
      steps = [
        hi ? `ज्ञात भुगतानों का आज का मूल्य = ${money(knownPv)}।` : `ਜਾਣੇ ਭੁਗਤਾਨਾਂ ਦਾ ਅੱਜ ਦਾ ਮੁੱਲ = ${money(knownPv)}।`,
        `${money(s.openingDebt)} − ${money(knownPv)} = ${money(missingPv)}`,
        `${money(missingPv)} × (${factor})^${s.missingAtPeriod} = ${money(missing)}`,
        hi ? `अतः गायब भुगतान = ${final}।` : `ਇਸ ਲਈ ਗੁੰਮ ਭੁਗਤਾਨ = ${final}।`,
      ];
      break;
    }
    case "INT-CP009-PROT-004": {
      const balance = intCp009DebtBalanceByRecurrence(s.openingDebt, s.repayments, s.periodicRatePercent, s.afterPeriod);
      keyIdea = hi ? "हर अवधि में पहले ब्याज जोड़ें, फिर उस अवधि का भुगतान घटाएँ।" : "ਹਰ ਮਿਆਦ ਵਿੱਚ ਪਹਿਲਾਂ ਵਿਆਜ ਜੋੜੋ, ਫਿਰ ਉਸ ਮਿਆਦ ਦਾ ਭੁਗਤਾਨ ਘਟਾਓ।";
      steps = [
        hi ? `आरंभिक ऋण = ${money(s.openingDebt)}, वृद्धि गुणक = ${factor}।` : `ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ = ${money(s.openingDebt)}, ਵਾਧਾ ਗੁਣਕ = ${factor}।`,
        hi ? `नियम: नया बकाया = पुराना बकाया × ${factor} − भुगतान।` : `ਨਿਯਮ: ਨਵਾਂ ਬਕਾਇਆ = ਪੁਰਾਣਾ ਬਕਾਇਆ × ${factor} − ਭੁਗਤਾਨ।`,
        `${flowList(s.repayments.filter((f: any) => f.atPeriod <= s.afterPeriod), s.periodUnit, language)} ⇒ ${money(balance)}`,
        hi ? `अतः बकाया = ${final}।` : `ਇਸ ਲਈ ਬਕਾਇਆ = ${final}।`,
      ];
      break;
    }
    case "INT-CP009-PROT-005": {
      const beforeFinal = intCp009DebtBalanceByRecurrence(s.openingDebt, s.knownRepayments, s.periodicRatePercent, s.finalPeriod - 1);
      const due = intCp009ShiftAmount(beforeFinal, s.periodicRatePercent, s.finalPeriod - 1, s.finalPeriod);
      keyIdea = hi ? "ज्ञात भुगतानों के बाद बचा ऋण निकालें; एक और अवधि का ब्याज जोड़ने पर अंतिम भुगतान मिलता है।" : "ਜਾਣੇ ਭੁਗਤਾਨਾਂ ਤੋਂ ਬਾਅਦ ਬਚਿਆ ਕਰਜ਼ਾ ਕੱਢੋ; ਇੱਕ ਹੋਰ ਮਿਆਦ ਦਾ ਵਿਆਜ ਜੋੜ ਕੇ ਆਖਰੀ ਭੁਗਤਾਨ ਮਿਲਦਾ ਹੈ।";
      steps = [
        hi ? `आरंभिक ऋण = ${money(s.openingDebt)}, वृद्धि गुणक = ${factor}।` : `ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ = ${money(s.openingDebt)}, ਵਾਧਾ ਗੁਣਕ = ${factor}।`,
        hi ? `ज्ञात भुगतान लगाने के बाद बकाया = ${money(beforeFinal)}।` : `ਜਾਣੇ ਭੁਗਤਾਨ ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਬਕਾਇਆ = ${money(beforeFinal)}।`,
        `${money(beforeFinal)} × ${factor} = ${money(due)}`,
        hi ? `अतः अंतिम भुगतान = ${final}।` : `ਇਸ ਲਈ ਆਖਰੀ ਭੁਗਤਾਨ = ${final}।`,
      ];
      break;
    }
    case "INT-CP009-PROT-006": {
      const known = intCp009EquivalentAt(s.deposits, s.periodicRatePercent, s.duePeriod);
      const shortfall = sub(s.targetFund, known);
      const missing = intCp009ShiftAmount(shortfall, s.periodicRatePercent, s.duePeriod, s.missingAtPeriod);
      keyIdea = hi ? "ज्ञात जमा को लक्ष्य तारीख तक बढ़ाएँ; लक्ष्य से कमी निकालकर उसे गायब जमा की तारीख तक वापस छूट दें।" : "ਜਾਣੀਆਂ ਜਮ੍ਹਾਂ ਨੂੰ ਨਿਸ਼ਾਨਾ ਤਾਰੀਖ ਤੱਕ ਵਧਾਓ; ਨਿਸ਼ਾਨੇ ਤੋਂ ਘਾਟ ਕੱਢ ਕੇ ਉਸਨੂੰ ਗੁੰਮ ਜਮ੍ਹਾਂ ਦੀ ਤਾਰੀਖ ਤੱਕ ਵਾਪਸ ਡਿਸਕਾਊਂਟ ਕਰੋ।";
      steps = [
        hi ? `ज्ञात जमा का लक्ष्य मूल्य = ${money(known)}।` : `ਜਾਣੀਆਂ ਜਮ੍ਹਾਂ ਦਾ ਨਿਸ਼ਾਨਾ ਮੁੱਲ = ${money(known)}।`,
        `${money(s.targetFund)} − ${money(known)} = ${money(shortfall)}`,
        `${money(shortfall)} ÷ (${factor})^${s.duePeriod - s.missingAtPeriod} = ${money(missing)}`,
        hi ? `अतः गायब जमा = ${final}।` : `ਇਸ ਲਈ ਗੁੰਮ ਜਮ੍ਹਾਂ = ${final}।`,
      ];
      break;
    }
    case "INT-CP009-PROT-007": {
      const finalPeriod = Math.max(...s.repayments.map((flow: any) => flow.atPeriod));
      const candidates = [10n, 15n, 20n, 25n].map((n) => rat(n));
      const balances = candidates.map((r) => intCp009DebtBalanceByRecurrence(s.openingDebt, s.repayments, r, finalPeriod));
      keyIdea = hi ? "विकल्पों की ब्याज दरों को भुगतान पुनरावृत्ति में जाँचें; सही दर पर अंतिम बकाया शून्य होगा।" : "ਚੋਣਾਂ ਵਾਲੀਆਂ ਵਿਆਜ ਦਰਾਂ ਨੂੰ ਭੁਗਤਾਨ ਰਿਕਰੈਂਸ ਵਿੱਚ ਜਾਂਚੋ; ਸਹੀ ਦਰ ਤੇ ਆਖਰੀ ਬਕਾਇਆ ਸਿਫ਼ਰ ਹੋਵੇਗਾ।";
      steps = [
        hi ? `नियम: नया बकाया = पुराना बकाया × (1+r) − भुगतान।` : `ਨਿਯਮ: ਨਵਾਂ ਬਕਾਇਆ = ਪੁਰਾਣਾ ਬਕਾਇਆ × (1+r) − ਭੁਗਤਾਨ।`,
        `${percent(candidates[0]!)} → ${money(balances[0]!)}, ${percent(candidates[1]!)} → ${money(balances[1]!)}`,
        `${percent(candidates[2]!)} → ${money(balances[2]!)}, ${percent(candidates[3]!)} → ${money(balances[3]!)}`,
        hi ? `केवल ${final} पर अंतिम बकाया ₹0 है; अतः उत्तर ${final}।` : `ਕੇਵਲ ${final} ਤੇ ਆਖਰੀ ਬਕਾਇਆ ₹0 ਹੈ; ਇਸ ਲਈ ਉੱਤਰ ${final}।`,
      ];
      break;
    }
    case "INT-CP009-PROT-008": {
      const equivalent = intCp009EquivalentAt(s.repayments, s.periodicRatePercent, s.comparisonPeriod);
      keyIdea = hi ? "हर भुगतान को एक ही तुलना तारीख पर लाएँ; उसी तारीख पर उनका योग एकल समतुल्य भुगतान है।" : "ਹਰ ਭੁਗਤਾਨ ਨੂੰ ਇੱਕੋ ਤੁਲਨਾ ਤਾਰੀਖ ਤੇ ਲਿਆਓ; ਉਸ ਤਾਰੀਖ ਤੇ ਉਹਨਾਂ ਦਾ ਜੋੜ ਇਕੱਲਾ ਸਮਤੁੱਲ ਭੁਗਤਾਨ ਹੈ।";
      steps = [
        hi ? `वृद्धि गुणक = ${factor}; तुलना अवधि = ${s.comparisonPeriod}।` : `ਵਾਧਾ ਗੁਣਕ = ${factor}; ਤੁਲਨਾ ਮਿਆਦ = ${s.comparisonPeriod}।`,
        s.repayments.map((flow: any) => `${money(flow.amount)} → ${money(intCp009ShiftAmount(flow.amount, s.periodicRatePercent, flow.atPeriod, s.comparisonPeriod))}`).join("; "),
        hi ? `तुलना तारीख पर योग = ${money(equivalent)}।` : `ਤੁਲਨਾ ਤਾਰੀਖ ਤੇ ਜੋੜ = ${money(equivalent)}।`,
        hi ? `अतः समतुल्य एकल भुगतान = ${final}।` : `ਇਸ ਲਈ ਸਮਤੁੱਲ ਇਕੱਲਾ ਭੁਗਤਾਨ = ${final}।`,
      ];
      break;
    }
    default: throw new Error(`Unsupported CP009 prototype ${s.prototypeId}`);
  }
  return deepFreeze({ keyIdea, steps: Object.freeze(steps), finalAnswer: final });
}

export function generateIntCp009Localized(qlId: IntCp009PermanentQlId, seed: string | number, language: IntCp009Language) {
  const source = generateIntCp009Permanent(qlId, seed) as any;
  if (language === "en") return source;
  const localized = deepFreeze({
    ...source,
    localizationVersion: INT_CP009_LOCALIZATION_VERSION,
    locale: language === "hi" ? "hi-IN" as const : "pa-IN" as const,
    language,
    stem: promptFor(source, language),
    explanation: localizedExplanation(source, language),
    lifecycle: deepFreeze({ ...source.lifecycle, questionStudioDiscoverable: false as const }),
  });
  if (localized.correctIndex !== source.correctIndex || localized.correctAnswer !== source.correctAnswer) throw new Error(`${qlId}/${seed}/${language}: localization changed answer binding.`);
  return localized;
}
