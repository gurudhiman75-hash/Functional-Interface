import { div, mul, rat, sub, type Rational } from "./cp003-exam-model";
import { siCiDifference } from "./cp006-si-ci-relations-runtime-v2";
import {
  INT_CP006_QL_IDS,
  type IntCp006QlId,
} from "./cp006-si-ci-relations-runtime-v4-final";
import {
  INT_CP006_ENGLISH_FREEZE_APPROVAL,
  INT_CP006_ENGLISH_FREEZE_ID,
  generateIntCp006EnglishFrozenQuestion,
} from "./cp006-si-ci-relations-v1-frozen";

export const INT_CP006_LOCALIZED_VERSION = "INT-CP-006-HI-PA-v1-review" as const;
export const INT_CP006_LOCALIZED_LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const);
export type IntCp006LocalizedLocale = typeof INT_CP006_LOCALIZED_LOCALES[number];
export const INT_CP006_LOCALIZATION_DECISION = Object.freeze({
  checkpoint: "INT-CP-006" as const,
  sourceFreezeId: INT_CP006_ENGLISH_FREEZE_ID,
  sourceApproval: INT_CP006_ENGLISH_FREEZE_APPROVAL,
  learnerQls: INT_CP006_QL_IDS,
  locales: INT_CP006_LOCALIZED_LOCALES,
  localizationStatus: "REVIEW_CANDIDATE" as const,
  questionStudioActivationAuthorized: false as const,
});

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}
function indianInteger(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const source = (value < 0n ? -value : value).toString();
  if (source.length <= 3) return `${sign}${source}`;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${sign}${groups.join(",")},${tail}`;
}
function decimal(value: Rational): string {
  const scaled = value.numerator * 100n;
  if (scaled % value.denominator !== 0n) throw new Error(`CP006 localized non-displayable value ${value.numerator}/${value.denominator}`);
  const hundredths = scaled / value.denominator;
  const sign = hundredths < 0n ? "-" : "";
  const magnitude = hundredths < 0n ? -hundredths : hundredths;
  const whole = magnitude / 100n;
  const fraction = magnitude % 100n;
  const wholeText = indianInteger(whole);
  if (fraction === 0n) return `${sign}${wholeText}`;
  if (fraction % 10n === 0n) return `${sign}${wholeText}.${fraction / 10n}`;
  return `${sign}${wholeText}.${fraction.toString().padStart(2, "0")}`;
}
const money = (value: Rational): string => `₹${decimal(value)}`;
const percent = (value: Rational): string => `${decimal(value)}%`;
function yearText(year: number, locale: IntCp006LocalizedLocale): string {
  return locale === "hi-IN" ? `${year} वर्ष` : `${year} ਸਾਲ`;
}
function table(locale: IntCp006LocalizedLocale, rows: readonly (readonly [string, string])[]): string {
  const headers = locale === "hi-IN" ? ["विवरण", "मान"] : ["ਵੇਰਵਾ", "ਮੁੱਲ"];
  return `| ${headers[0]} | ${headers[1]} |\n|---|---:|\n${rows.map(([name, value]) => `| ${name} | ${value} |`).join("\n")}`;
}
function templateIndex(stemFamilyId: string): 0 | 1 | 2 {
  const match = stemFamilyId.match(/-T([123])$/u);
  if (!match) throw new Error(`CP006 localized invalid stem family ${stemFamilyId}`);
  return (Number(match[1]) - 1) as 0 | 1 | 2;
}
function rateFromConsecutive(earlier: Rational, later: Rational): Rational {
  return mul(sub(div(later, earlier), rat(1)), rat(100));
}

function localizedStem(qlId: IntCp006QlId, state: any, template: 0 | 1 | 2, locale: IntCp006LocalizedLocale): string {
  const hi = locale === "hi-IN";
  switch (qlId) {
    case "INT-QL-096": {
      const frames = hi ? [
        `${money(state.principal)} पर ${percent(state.ratePercent)} वार्षिक दर से 2 वर्षों के लिए चक्रवृद्धि ब्याज और साधारण ब्याज का अंतर ज्ञात कीजिए।`,
        `${money(state.principal)} को 2 वर्षों के लिए ${percent(state.ratePercent)} वार्षिक दर पर लगाया गया है। वार्षिक चक्रवृद्धि ब्याज, साधारण ब्याज से कितना अधिक होगा?`,
        `${money(state.principal)} के मूलधन पर ${percent(state.ratePercent)} वार्षिक दर से 2 वर्षों बाद CI, SI से कितने रुपये अधिक होगा?`,
      ] : [
        `${money(state.principal)} ਉੱਤੇ ${percent(state.ratePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ 2 ਸਾਲਾਂ ਲਈ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਅਤੇ ਸਧਾਰਣ ਵਿਆਜ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।`,
        `${money(state.principal)} ਨੂੰ 2 ਸਾਲਾਂ ਲਈ ${percent(state.ratePercent)} ਸਾਲਾਨਾ ਦਰ 'ਤੇ ਲਗਾਇਆ ਗਿਆ ਹੈ। ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ, ਸਧਾਰਣ ਵਿਆਜ ਨਾਲੋਂ ਕਿੰਨਾ ਵੱਧ ਹੋਵੇਗਾ?`,
        `${money(state.principal)} ਦੇ ਮੂਲਧਨ ਉੱਤੇ ${percent(state.ratePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ 2 ਸਾਲਾਂ ਬਾਅਦ CI, SI ਨਾਲੋਂ ਕਿੰਨਾ ਵੱਧ ਹੋਵੇਗਾ?`,
      ]; return frames[template]!;
    }
    case "INT-QL-097": {
      const frames = hi ? [
        `${money(state.principal)} पर ${percent(state.ratePercent)} वार्षिक दर से 3 वर्षों के लिए चक्रवृद्धि ब्याज और साधारण ब्याज का अंतर ज्ञात कीजिए।`,
        `${money(state.principal)} को 3 वर्षों के लिए ${percent(state.ratePercent)} वार्षिक दर पर रखा गया है। चक्रवृद्धि ब्याज, साधारण ब्याज से कितना अधिक होगा?`,
        `${money(state.principal)} के मूलधन पर ${percent(state.ratePercent)} वार्षिक दर से 3 वर्षों बाद CI, SI से कितने रुपये अधिक होगा?`,
      ] : [
        `${money(state.principal)} ਉੱਤੇ ${percent(state.ratePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ 3 ਸਾਲਾਂ ਲਈ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਅਤੇ ਸਧਾਰਣ ਵਿਆਜ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।`,
        `${money(state.principal)} ਨੂੰ 3 ਸਾਲਾਂ ਲਈ ${percent(state.ratePercent)} ਸਾਲਾਨਾ ਦਰ 'ਤੇ ਰੱਖਿਆ ਗਿਆ ਹੈ। ਚੱਕਰਵੱਧੀ ਵਿਆਜ, ਸਧਾਰਣ ਵਿਆਜ ਨਾਲੋਂ ਕਿੰਨਾ ਵੱਧ ਹੋਵੇਗਾ?`,
        `${money(state.principal)} ਦੇ ਮੂਲਧਨ ਉੱਤੇ ${percent(state.ratePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ 3 ਸਾਲਾਂ ਬਾਅਦ CI, SI ਨਾਲੋਂ ਕਿੰਨਾ ਵੱਧ ਹੋਵੇਗਾ?`,
      ]; return frames[template]!;
    }
    case "INT-QL-098": {
      const frames = hi ? [
        `2 वर्षों के लिए ${percent(state.ratePercent)} वार्षिक दर पर CI, SI से ${money(state.difference2)} अधिक है। मूलधन ज्ञात कीजिए।`,
        `2 वर्षों के चक्रवृद्धि और साधारण ब्याज का अंतर ${money(state.difference2)} है और वार्षिक दर ${percent(state.ratePercent)} है। निवेश की गई राशि ज्ञात कीजिए।`,
        `एक राशि पर ${percent(state.ratePercent)} वार्षिक दर से 2 वर्षों में चक्रवृद्धि ब्याज, साधारण ब्याज से ${money(state.difference2)} अधिक है। राशि ज्ञात कीजिए।`,
      ] : [
        `2 ਸਾਲਾਂ ਲਈ ${percent(state.ratePercent)} ਸਾਲਾਨਾ ਦਰ 'ਤੇ CI, SI ਨਾਲੋਂ ${money(state.difference2)} ਵੱਧ ਹੈ। ਮੂਲਧਨ ਪਤਾ ਕਰੋ।`,
        `2 ਸਾਲਾਂ ਦੇ ਚੱਕਰਵੱਧੀ ਅਤੇ ਸਧਾਰਣ ਵਿਆਜ ਦਾ ਅੰਤਰ ${money(state.difference2)} ਹੈ ਅਤੇ ਸਾਲਾਨਾ ਦਰ ${percent(state.ratePercent)} ਹੈ। ਲਗਾਈ ਗਈ ਰਕਮ ਪਤਾ ਕਰੋ।`,
        `ਇੱਕ ਰਕਮ ਉੱਤੇ ${percent(state.ratePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ 2 ਸਾਲਾਂ ਵਿੱਚ ਚੱਕਰਵੱਧੀ ਵਿਆਜ, ਸਧਾਰਣ ਵਿਆਜ ਨਾਲੋਂ ${money(state.difference2)} ਵੱਧ ਹੈ। ਰਕਮ ਪਤਾ ਕਰੋ।`,
      ]; return frames[template]!;
    }
    case "INT-QL-099": {
      const frames = hi ? [
        `${money(state.principal)} के मूलधन पर 2 वर्षों में CI और SI का अंतर ${money(state.difference2)} है। वार्षिक ब्याज दर ज्ञात कीजिए।`,
        `एक राशि ${money(state.principal)} है। 2 वर्षों बाद चक्रवृद्धि ब्याज, साधारण ब्याज से ${money(state.difference2)} अधिक है। वार्षिक दर ज्ञात कीजिए।`,
        `${money(state.principal)} पर समान वार्षिक दर से 2 वर्षों के CI−SI का अंतर ${money(state.difference2)} है। दर कितनी है?`,
      ] : [
        `${money(state.principal)} ਦੇ ਮੂਲਧਨ ਉੱਤੇ 2 ਸਾਲਾਂ ਵਿੱਚ CI ਅਤੇ SI ਦਾ ਅੰਤਰ ${money(state.difference2)} ਹੈ। ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਕਰੋ।`,
        `ਇੱਕ ਰਕਮ ${money(state.principal)} ਹੈ। 2 ਸਾਲਾਂ ਬਾਅਦ ਚੱਕਰਵੱਧੀ ਵਿਆਜ, ਸਧਾਰਣ ਵਿਆਜ ਨਾਲੋਂ ${money(state.difference2)} ਵੱਧ ਹੈ। ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰੋ।`,
        `${money(state.principal)} ਉੱਤੇ ਇੱਕੋ ਸਾਲਾਨਾ ਦਰ ਨਾਲ 2 ਸਾਲਾਂ ਦੇ CI−SI ਦਾ ਅੰਤਰ ${money(state.difference2)} ਹੈ। ਦਰ ਕਿੰਨੀ ਹੈ?`,
      ]; return frames[template]!;
    }
    case "INT-QL-100":
    case "INT-QL-101": {
      const askHi = qlId === "INT-QL-100" ? "वार्षिक ब्याज दर ज्ञात कीजिए।" : "मूलधन ज्ञात कीजिए।";
      const askPa = qlId === "INT-QL-100" ? "ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਕਰੋ।" : "ਮੂਲਧਨ ਪਤਾ ਕਰੋ।";
      if (hi) {
        const frames = [
          `एक ही राशि पर एक ही दर से 2 वर्षों का साधारण ब्याज ${money(state.simpleInterest2)} और चक्रवृद्धि ब्याज ${money(state.compoundInterest2)} है। ${askHi}`,
          `2 वर्षों के लिए SI = ${money(state.simpleInterest2)} और CI = ${money(state.compoundInterest2)} है। दोनों एक ही मूलधन और वार्षिक दर से संबंधित हैं। ${askHi}`,
          `${table(locale, [["2 वर्षों का साधारण ब्याज", money(state.simpleInterest2)], ["2 वर्षों का चक्रवृद्धि ब्याज", money(state.compoundInterest2)]])}\n\nदोनों मान एक ही मूलधन और वार्षिक दर के हैं। ${askHi}`,
        ]; return frames[template]!;
      }
      const frames = [
        `ਇੱਕੋ ਰਕਮ ਉੱਤੇ ਇੱਕੋ ਦਰ ਨਾਲ 2 ਸਾਲਾਂ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ${money(state.simpleInterest2)} ਅਤੇ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ${money(state.compoundInterest2)} ਹੈ। ${askPa}`,
        `2 ਸਾਲਾਂ ਲਈ SI = ${money(state.simpleInterest2)} ਅਤੇ CI = ${money(state.compoundInterest2)} ਹੈ। ਦੋਵੇਂ ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਸੰਬੰਧਿਤ ਹਨ। ${askPa}`,
        `${table(locale, [["2 ਸਾਲਾਂ ਦਾ ਸਧਾਰਣ ਵਿਆਜ", money(state.simpleInterest2)], ["2 ਸਾਲਾਂ ਦਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ", money(state.compoundInterest2)]])}\n\nਦੋਵੇਂ ਮੁੱਲ ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਸਾਲਾਨਾ ਦਰ ਦੇ ਹਨ। ${askPa}`,
      ]; return frames[template]!;
    }
    case "INT-QL-102": {
      const other = state.knownYears === 2 ? 3 : 2;
      const frames = hi ? [
        `${percent(state.ratePercent)} वार्षिक दर पर ${state.knownYears} वर्षों का CI−SI अंतर ${money(state.knownDifference)} है। ${other} वर्षों का CI−SI अंतर ज्ञात कीजिए।`,
        `एक ही मूलधन पर ${percent(state.ratePercent)} वार्षिक दर से ${state.knownYears} वर्षों बाद CI, SI से ${money(state.knownDifference)} अधिक है। ${other} वर्षों बाद यह अंतर कितना होगा?`,
        `${state.knownYears} वर्षों का SI−CI अंतर ${money(state.knownDifference)} है और दर ${percent(state.ratePercent)} वार्षिक है। संबंधित ${other} वर्षों का अंतर ज्ञात कीजिए।`,
      ] : [
        `${percent(state.ratePercent)} ਸਾਲਾਨਾ ਦਰ 'ਤੇ ${state.knownYears} ਸਾਲਾਂ ਦਾ CI−SI ਅੰਤਰ ${money(state.knownDifference)} ਹੈ। ${other} ਸਾਲਾਂ ਦਾ CI−SI ਅੰਤਰ ਪਤਾ ਕਰੋ।`,
        `ਇੱਕੋ ਮੂਲਧਨ ਉੱਤੇ ${percent(state.ratePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${state.knownYears} ਸਾਲਾਂ ਬਾਅਦ CI, SI ਨਾਲੋਂ ${money(state.knownDifference)} ਵੱਧ ਹੈ। ${other} ਸਾਲਾਂ ਬਾਅਦ ਇਹ ਅੰਤਰ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
        `${state.knownYears} ਸਾਲਾਂ ਦਾ SI−CI ਅੰਤਰ ${money(state.knownDifference)} ਹੈ ਅਤੇ ਦਰ ${percent(state.ratePercent)} ਸਾਲਾਨਾ ਹੈ। ਸੰਬੰਧਿਤ ${other} ਸਾਲਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।`,
      ]; return frames[template]!;
    }
    case "INT-QL-103":
    case "INT-QL-104": {
      const askHi = qlId === "INT-QL-103" ? "वार्षिक ब्याज दर ज्ञात कीजिए।" : "मूलधन ज्ञात कीजिए।";
      const askPa = qlId === "INT-QL-103" ? "ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਕਰੋ।" : "ਮੂਲਧਨ ਪਤਾ ਕਰੋ।";
      const frames = hi ? [
        `एक ही मूलधन और दर पर 2 वर्षों का CI−SI अंतर ${money(state.difference2)} तथा 3 वर्षों का अंतर ${money(state.difference3)} है। ${askHi}`,
        `2 वर्षों के लिए चक्रवृद्धि ब्याज, साधारण ब्याज से ${money(state.difference2)} अधिक है और 3 वर्षों के लिए यह अंतर ${money(state.difference3)} है। ${askHi}`,
        `${table(locale, [["2 वर्षों का CI−SI अंतर", money(state.difference2)], ["3 वर्षों का CI−SI अंतर", money(state.difference3)]])}\n\nदोनों एक ही मूलधन और वार्षिक दर के हैं। ${askHi}`,
      ] : [
        `ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਦਰ ਉੱਤੇ 2 ਸਾਲਾਂ ਦਾ CI−SI ਅੰਤਰ ${money(state.difference2)} ਅਤੇ 3 ਸਾਲਾਂ ਦਾ ਅੰਤਰ ${money(state.difference3)} ਹੈ। ${askPa}`,
        `2 ਸਾਲਾਂ ਲਈ ਚੱਕਰਵੱਧੀ ਵਿਆਜ, ਸਧਾਰਣ ਵਿਆਜ ਨਾਲੋਂ ${money(state.difference2)} ਵੱਧ ਹੈ ਅਤੇ 3 ਸਾਲਾਂ ਲਈ ਇਹ ਅੰਤਰ ${money(state.difference3)} ਹੈ। ${askPa}`,
        `${table(locale, [["2 ਸਾਲਾਂ ਦਾ CI−SI ਅੰਤਰ", money(state.difference2)], ["3 ਸਾਲਾਂ ਦਾ CI−SI ਅੰਤਰ", money(state.difference3)]])}\n\nਦੋਵੇਂ ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਸਾਲਾਨਾ ਦਰ ਦੇ ਹਨ। ${askPa}`,
      ]; return frames[template]!;
    }
    case "INT-QL-105":
    case "INT-QL-106": {
      const next = state.yearNumber + 1;
      const askHi = qlId === "INT-QL-105" ? "वार्षिक चक्रवृद्धि ब्याज दर ज्ञात कीजिए।" : "मूल मूलधन ज्ञात कीजिए।";
      const askPa = qlId === "INT-QL-105" ? "ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਦਰ ਪਤਾ ਕਰੋ।" : "ਮੂਲ ਮੂਲਧਨ ਪਤਾ ਕਰੋ।";
      const frames = hi ? [
        `वार्षिक चक्रवृद्धि ब्याज में वर्ष ${state.yearNumber} का ब्याज ${money(state.earlierInterest)} और वर्ष ${next} का ब्याज ${money(state.laterInterest)} है। ${askHi}`,
        `एक स्थिर वार्षिक चक्रवृद्धि दर पर ${state.yearNumber}वें वर्ष का ब्याज ${money(state.earlierInterest)} तथा अगले वर्ष का ब्याज ${money(state.laterInterest)} है। ${askHi}`,
        `${table(locale, [[`वर्ष ${state.yearNumber} का ब्याज`, money(state.earlierInterest)], [`वर्ष ${next} का ब्याज`, money(state.laterInterest)]])}\n\nचक्रवृद्धि ब्याज की वार्षिक दर स्थिर है। ${askHi}`,
      ] : [
        `ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਵਿੱਚ ਸਾਲ ${state.yearNumber} ਦਾ ਵਿਆਜ ${money(state.earlierInterest)} ਅਤੇ ਸਾਲ ${next} ਦਾ ਵਿਆਜ ${money(state.laterInterest)} ਹੈ। ${askPa}`,
        `ਇੱਕ ਸਥਿਰ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਦਰ ਉੱਤੇ ${state.yearNumber}ਵੇਂ ਸਾਲ ਦਾ ਵਿਆਜ ${money(state.earlierInterest)} ਅਤੇ ਅਗਲੇ ਸਾਲ ਦਾ ਵਿਆਜ ${money(state.laterInterest)} ਹੈ। ${askPa}`,
        `${table(locale, [[`ਸਾਲ ${state.yearNumber} ਦਾ ਵਿਆਜ`, money(state.earlierInterest)], [`ਸਾਲ ${next} ਦਾ ਵਿਆਜ`, money(state.laterInterest)]])}\n\nਚੱਕਰਵੱਧੀ ਵਿਆਜ ਦੀ ਸਾਲਾਨਾ ਦਰ ਸਥਿਰ ਹੈ। ${askPa}`,
      ]; return frames[template]!;
    }
    case "INT-QL-107": {
      const frames = hi ? [
        `${money(state.principal)} पर ${percent(state.ratePercent)} वार्षिक दर से कितने पूर्ण वर्षों बाद CI और SI का अंतर पहली बार कम-से-कम ${money(state.targetDifference)} होगा?`,
        `${money(state.principal)} को साधारण और वार्षिक चक्रवृद्धि ब्याज पर ${percent(state.ratePercent)} दर से माना गया है। वह पहला पूर्ण वर्ष ज्ञात कीजिए जब CI, SI से ${money(state.targetDifference)} या अधिक हो जाए।`,
        `${money(state.principal)} पर ${percent(state.ratePercent)} वार्षिक दर से वह सबसे पहला पूर्ण वर्ष ज्ञात कीजिए जब CI−SI कम-से-कम ${money(state.targetDifference)} हो।`,
      ] : [
        `${money(state.principal)} ਉੱਤੇ ${percent(state.ratePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਕਿੰਨੇ ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ CI ਅਤੇ SI ਦਾ ਅੰਤਰ ਪਹਿਲੀ ਵਾਰ ਘੱਟੋ-ਘੱਟ ${money(state.targetDifference)} ਹੋਵੇਗਾ?`,
        `${money(state.principal)} ਨੂੰ ਸਧਾਰਣ ਅਤੇ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਲਈ ${percent(state.ratePercent)} ਦਰ ਨਾਲ ਮੰਨਿਆ ਗਿਆ ਹੈ। ਉਹ ਪਹਿਲਾ ਪੂਰਾ ਸਾਲ ਪਤਾ ਕਰੋ ਜਦੋਂ CI, SI ਨਾਲੋਂ ${money(state.targetDifference)} ਜਾਂ ਵੱਧ ਹੋ ਜਾਵੇ।`,
        `${money(state.principal)} ਉੱਤੇ ${percent(state.ratePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਸਭ ਤੋਂ ਪਹਿਲਾ ਪੂਰਾ ਸਾਲ ਪਤਾ ਕਰੋ ਜਦੋਂ CI−SI ਘੱਟੋ-ਘੱਟ ${money(state.targetDifference)} ਹੋਵੇ।`,
      ]; return frames[template]!;
    }
    case "INT-QL-108": {
      const frames = hi ? [
        `${percent(state.ratePercent)} चक्रवृद्धि ब्याज पर दूसरे वर्ष का ब्याज, पहले वर्ष के ब्याज से ${money(state.secondYearExcess)} अधिक है। पहले वर्ष का ब्याज ज्ञात कीजिए।`,
        `${percent(state.ratePercent)} वार्षिक दर पर दूसरे वर्ष का चक्रवृद्धि ब्याज, पहले वर्ष के ब्याज से ${money(state.secondYearExcess)} अधिक है। वर्ष 1 का ब्याज कितना था?`,
        `${percent(state.ratePercent)} वार्षिक चक्रवृद्धि पर \\(J_2-J_1=${money(state.secondYearExcess)}\\) है। \\(J_1\\) ज्ञात कीजिए।`,
      ] : [
        `${percent(state.ratePercent)} ਚੱਕਰਵੱਧੀ ਵਿਆਜ 'ਤੇ ਦੂਜੇ ਸਾਲ ਦਾ ਵਿਆਜ, ਪਹਿਲੇ ਸਾਲ ਦੇ ਵਿਆਜ ਨਾਲੋਂ ${money(state.secondYearExcess)} ਵੱਧ ਹੈ। ਪਹਿਲੇ ਸਾਲ ਦਾ ਵਿਆਜ ਪਤਾ ਕਰੋ।`,
        `${percent(state.ratePercent)} ਸਾਲਾਨਾ ਦਰ 'ਤੇ ਦੂਜੇ ਸਾਲ ਦਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ, ਪਹਿਲੇ ਸਾਲ ਦੇ ਵਿਆਜ ਨਾਲੋਂ ${money(state.secondYearExcess)} ਵੱਧ ਹੈ। ਸਾਲ 1 ਦਾ ਵਿਆਜ ਕਿੰਨਾ ਸੀ?`,
        `${percent(state.ratePercent)} ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ 'ਤੇ \\(J_2-J_1=${money(state.secondYearExcess)}\\) ਹੈ। \\(J_1\\) ਪਤਾ ਕਰੋ।`,
      ]; return frames[template]!;
    }
  }
}

function localizedExplanation(qlId: IntCp006QlId, state: any, answer: Rational, locale: IntCp006LocalizedLocale) {
  const hi = locale === "hi-IN";
  const finalAnswer = qlId === "INT-QL-107" ? yearText(Number(answer.numerator / answer.denominator), locale)
    : (qlId === "INT-QL-099" || qlId === "INT-QL-100" || qlId === "INT-QL-103" || qlId === "INT-QL-105") ? percent(answer)
    : money(answer);
  switch (qlId) {
    case "INT-QL-096": return deepFreeze(hi ? {
      keyIdea: "2 वर्षों के लिए CI−SI का सीधा संबंध मूलधन और वार्षिक दर के वर्ग से होता है।",
      steps: Object.freeze([`सूत्र \\(D_2=P(r/100)^2\\) में मान रखने पर \\(D_2=${money(state.principal)}\\times(${percent(state.ratePercent)}/100)^2=${money(answer)}\\)।`]),
      finalAnswer, commonMistake: "दर के स्थान पर 2 वर्षों की कुल दर का वर्ग न लें; यहाँ वार्षिक दर का वर्ग आता है।",
    } : {
      keyIdea: "2 ਸਾਲਾਂ ਲਈ CI−SI ਦਾ ਸਿੱਧਾ ਸੰਬੰਧ ਮੂਲਧਨ ਅਤੇ ਸਾਲਾਨਾ ਦਰ ਦੇ ਵਰਗ ਨਾਲ ਹੁੰਦਾ ਹੈ।",
      steps: Object.freeze([`ਸੂਤਰ \\(D_2=P(r/100)^2\\) ਵਿੱਚ ਮੁੱਲ ਰੱਖਣ 'ਤੇ \\(D_2=${money(state.principal)}\\times(${percent(state.ratePercent)}/100)^2=${money(answer)}\\)।`]),
      finalAnswer, commonMistake: "ਦਰ ਦੀ ਥਾਂ 2 ਸਾਲਾਂ ਦੀ ਕੁੱਲ ਦਰ ਦਾ ਵਰਗ ਨਾ ਲਓ; ਇੱਥੇ ਸਾਲਾਨਾ ਦਰ ਦਾ ਵਰਗ ਆਉਂਦਾ ਹੈ।",
    });
    case "INT-QL-097": {
      const d2 = siCiDifference(state.principal, state.ratePercent, 2);
      return deepFreeze(hi ? {
        keyIdea: "3 वर्षों के अंतर के लिए पहले 2 वर्षों का अंतर निकालकर उस पर तीसरे वर्ष का अतिरिक्त चक्रवृद्धि प्रभाव जोड़ें।",
        steps: Object.freeze([`पहले \\(D_2=${money(d2)}\\)।`, `अब \\(D_3=D_2(3+r/100)=${money(d2)}\\times(3+${percent(state.ratePercent)}/100)=${money(answer)}\\)।`]),
        finalAnswer, commonMistake: "केवल 3D₂ लेने से तीसरे क्रम का चक्रवृद्धि पद छूट जाता है।",
      } : {
        keyIdea: "3 ਸਾਲਾਂ ਦੇ ਅੰਤਰ ਲਈ ਪਹਿਲਾਂ 2 ਸਾਲਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ ਅਤੇ ਫਿਰ ਤੀਜੇ ਸਾਲ ਦਾ ਵਾਧੂ ਚੱਕਰਵੱਧੀ ਪ੍ਰਭਾਵ ਜੋੜੋ।",
        steps: Object.freeze([`ਪਹਿਲਾਂ \\(D_2=${money(d2)}\\)।`, `ਹੁਣ \\(D_3=D_2(3+r/100)=${money(d2)}\\times(3+${percent(state.ratePercent)}/100)=${money(answer)}\\)।`]),
        finalAnswer, commonMistake: "ਕੇਵਲ 3D₂ ਲੈਣ ਨਾਲ ਤੀਜੇ ਕ੍ਰਮ ਵਾਲਾ ਚੱਕਰਵੱਧੀ ਪਦ ਰਹਿ ਜਾਂਦਾ ਹੈ।",
      });
    }
    case "INT-QL-098": return deepFreeze(hi ? {
      keyIdea: "2 वर्षों के लिए \\(D_2=P(r/100)^2\\); इसलिए दिए गए अंतर और दर से मूलधन निकलेगा।",
      steps: Object.freeze([`\\(P=${money(state.difference2)}\\div(${percent(state.ratePercent)}/100)^2=${money(answer)}\\)।`]),
      finalAnswer, commonMistake: "अंतर को एक वर्ष का साधारण ब्याज न मानें; इसमें वार्षिक दर का वर्ग शामिल है।",
    } : {
      keyIdea: "2 ਸਾਲਾਂ ਲਈ \\(D_2=P(r/100)^2\\); ਇਸ ਲਈ ਦਿੱਤੇ ਅੰਤਰ ਅਤੇ ਦਰ ਤੋਂ ਮੂਲਧਨ ਨਿਕਲੇਗਾ।",
      steps: Object.freeze([`\\(P=${money(state.difference2)}\\div(${percent(state.ratePercent)}/100)^2=${money(answer)}\\)।`]),
      finalAnswer, commonMistake: "ਅੰਤਰ ਨੂੰ ਇੱਕ ਸਾਲ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਨਾ ਮੰਨੋ; ਇਸ ਵਿੱਚ ਸਾਲਾਨਾ ਦਰ ਦਾ ਵਰਗ ਸ਼ਾਮਲ ਹੈ।",
    });
    case "INT-QL-099": return deepFreeze(hi ? {
      keyIdea: "2 वर्षों के लिए \\(D_2=P(r/100)^2\\) से वार्षिक दर निकाली जाती है।",
      steps: Object.freeze([`दिए गए मानों के लिए \\(r=100\\sqrt{D_2/P}=100\\sqrt{${money(state.difference2)}\\div${money(state.principal)}}=${percent(answer)}\\)।`]),
      finalAnswer, commonMistake: "D₂/P को सीधे प्रतिशत न मानें; दर का वर्ग D₂/P के बराबर होता है।",
    } : {
      keyIdea: "2 ਸਾਲਾਂ ਲਈ \\(D_2=P(r/100)^2\\) ਤੋਂ ਸਾਲਾਨਾ ਦਰ ਨਿਕਲਦੀ ਹੈ।",
      steps: Object.freeze([`ਦਿੱਤੇ ਮੁੱਲਾਂ ਲਈ \\(r=100\\sqrt{D_2/P}=100\\sqrt{${money(state.difference2)}\\div${money(state.principal)}}=${percent(answer)}\\)।`]),
      finalAnswer, commonMistake: "D₂/P ਨੂੰ ਸਿੱਧਾ ਪ੍ਰਤੀਸ਼ਤ ਨਾ ਮੰਨੋ; ਦਰ ਦਾ ਵਰਗ D₂/P ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।",
    });
    case "INT-QL-100": {
      const difference = sub(state.compoundInterest2, state.simpleInterest2);
      return deepFreeze(hi ? {
        keyIdea: "2 वर्षों में CI−SI का अंतर निकालकर उसे 2-वर्षीय SI से जोड़ने पर दर मिलती है।",
        steps: Object.freeze([`\\(D_2=${money(state.compoundInterest2)}-${money(state.simpleInterest2)}=${money(difference)}\\)।`, `\\(r=2D_2/SI_2=2\\times${money(difference)}\\div${money(state.simpleInterest2)}=${percent(answer)}\\)।`]),
        finalAnswer, commonMistake: "D₂ को SI₂ से सीधे भाग देने पर दर आधी आ जाएगी; 2 का गुणक जरूरी है।",
      } : {
        keyIdea: "2 ਸਾਲਾਂ ਵਿੱਚ CI−SI ਦਾ ਅੰਤਰ ਕੱਢ ਕੇ ਉਸਨੂੰ 2-ਸਾਲਾਂ ਦੇ SI ਨਾਲ ਜੋੜਨ 'ਤੇ ਦਰ ਮਿਲਦੀ ਹੈ।",
        steps: Object.freeze([`\\(D_2=${money(state.compoundInterest2)}-${money(state.simpleInterest2)}=${money(difference)}\\)।`, `\\(r=2D_2/SI_2=2\\times${money(difference)}\\div${money(state.simpleInterest2)}=${percent(answer)}\\)।`]),
        finalAnswer, commonMistake: "D₂ ਨੂੰ SI₂ ਨਾਲ ਸਿੱਧਾ ਭਾਗ ਦੇਣ 'ਤੇ ਦਰ ਅੱਧੀ ਆਵੇਗੀ; 2 ਦਾ ਗੁਣਕ ਲਾਜ਼ਮੀ ਹੈ।",
      });
    }
    case "INT-QL-101": {
      const difference = sub(state.compoundInterest2, state.simpleInterest2);
      const rate = mul(div(mul(difference, rat(2)), state.simpleInterest2), rat(100));
      return deepFreeze(hi ? {
        keyIdea: "पहले SI और CI से वार्षिक दर निकालें, फिर 2 वर्षों के SI से मूलधन प्राप्त करें।",
        steps: Object.freeze([`\\(D_2=${money(difference)}\\), इसलिए वार्षिक दर ${percent(rate)} है।`, `अब \\(SI_2=2Pr/100\\), अतः \\(P=${money(answer)}\\)।`]),
        finalAnswer, commonMistake: "CI को सीधे 2Pr/100 में न रखें; उस संबंध में 2-वर्षीय साधारण ब्याज आता है।",
      } : {
        keyIdea: "ਪਹਿਲਾਂ SI ਅਤੇ CI ਤੋਂ ਸਾਲਾਨਾ ਦਰ ਕੱਢੋ, ਫਿਰ 2 ਸਾਲਾਂ ਦੇ SI ਤੋਂ ਮੂਲਧਨ ਪ੍ਰਾਪਤ ਕਰੋ।",
        steps: Object.freeze([`\\(D_2=${money(difference)}\\), ਇਸ ਲਈ ਸਾਲਾਨਾ ਦਰ ${percent(rate)} ਹੈ।`, `ਹੁਣ \\(SI_2=2Pr/100\\), ਇਸ ਕਰਕੇ \\(P=${money(answer)}\\)।`]),
        finalAnswer, commonMistake: "CI ਨੂੰ ਸਿੱਧਾ 2Pr/100 ਵਿੱਚ ਨਾ ਰੱਖੋ; ਉਸ ਸੰਬੰਧ ਵਿੱਚ 2-ਸਾਲਾਂ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਆਉਂਦਾ ਹੈ।",
      });
    }
    case "INT-QL-102": {
      const other = state.knownYears === 2 ? 3 : 2;
      const step = state.knownYears === 2
        ? `\\(D_3=${money(state.knownDifference)}\\times(3+${percent(state.ratePercent)}/100)=${money(answer)}\\)।`
        : `\\(D_2=${money(state.knownDifference)}\\div(3+${percent(state.ratePercent)}/100)=${money(answer)}\\)।`;
      return deepFreeze(hi ? {
        keyIdea: "एक ही मूलधन और दर के लिए \\(D_3=D_2(3+r/100)\\) संबंध लागू करें।",
        steps: Object.freeze([step, `इसलिए ${other} वर्षों का अंतर ${money(answer)} है।`]),
        finalAnswer, commonMistake: "D₂ और D₃ को केवल पूर्णांक गुणज न मानें; दर के कारण अतिरिक्त पद आता है।",
      } : {
        keyIdea: "ਇੱਕੋ ਮੂਲਧਨ ਅਤੇ ਦਰ ਲਈ \\(D_3=D_2(3+r/100)\\) ਸੰਬੰਧ ਲਾਗੂ ਕਰੋ।",
        steps: Object.freeze([step, `ਇਸ ਲਈ ${other} ਸਾਲਾਂ ਦਾ ਅੰਤਰ ${money(answer)} ਹੈ।`]),
        finalAnswer, commonMistake: "D₂ ਅਤੇ D₃ ਨੂੰ ਕੇਵਲ ਪੂਰਨ ਅੰਕ ਗੁਣਜ ਨਾ ਮੰਨੋ; ਦਰ ਕਰਕੇ ਵਾਧੂ ਪਦ ਆਉਂਦਾ ਹੈ।",
      });
    }
    case "INT-QL-103": return deepFreeze(hi ? {
      keyIdea: "2-वर्षीय और 3-वर्षीय अंतर का अनुपात सीधे वार्षिक दर देता है।",
      steps: Object.freeze([`\\(D_3/D_2=3+r/100\\), इसलिए \\(r=100(${money(state.difference3)}\\div${money(state.difference2)}-3)=${percent(answer)}\\)।`]),
      finalAnswer, commonMistake: "D₃/D₂ से केवल 3 घटाना पर्याप्त नहीं; दशमलव दर को प्रतिशत में बदलने के लिए 100 से गुणा करें।",
    } : {
      keyIdea: "2-ਸਾਲਾਂ ਅਤੇ 3-ਸਾਲਾਂ ਦੇ ਅੰਤਰ ਦਾ ਅਨੁਪਾਤ ਸਿੱਧਾ ਸਾਲਾਨਾ ਦਰ ਦਿੰਦਾ ਹੈ।",
      steps: Object.freeze([`\\(D_3/D_2=3+r/100\\), ਇਸ ਲਈ \\(r=100(${money(state.difference3)}\\div${money(state.difference2)}-3)=${percent(answer)}\\)।`]),
      finalAnswer, commonMistake: "D₃/D₂ ਵਿੱਚੋਂ ਕੇਵਲ 3 ਘਟਾਉਣਾ ਕਾਫ਼ੀ ਨਹੀਂ; ਦਸ਼ਮਲਵ ਦਰ ਨੂੰ ਪ੍ਰਤੀਸ਼ਤ ਬਣਾਉਣ ਲਈ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।",
    });
    case "INT-QL-104": {
      const rate = mul(sub(div(state.difference3, state.difference2), rat(3)), rat(100));
      return deepFreeze(hi ? {
        keyIdea: "पहले D₂ और D₃ से दर निकालें, फिर \\(D_2=P(r/100)^2\\) से मूलधन निकालें।",
        steps: Object.freeze([`\\(r=100(D_3/D_2-3)=${percent(rate)}\\)।`, `अब \\(P=D_2/(r/100)^2=${money(answer)}\\)।`]),
        finalAnswer, commonMistake: "D₂ से मूलधन निकालने से पहले दर का वर्ग लेना न भूलें।",
      } : {
        keyIdea: "ਪਹਿਲਾਂ D₂ ਅਤੇ D₃ ਤੋਂ ਦਰ ਕੱਢੋ, ਫਿਰ \\(D_2=P(r/100)^2\\) ਤੋਂ ਮੂਲਧਨ ਕੱਢੋ।",
        steps: Object.freeze([`\\(r=100(D_3/D_2-3)=${percent(rate)}\\)।`, `ਹੁਣ \\(P=D_2/(r/100)^2=${money(answer)}\\)।`]),
        finalAnswer, commonMistake: "D₂ ਤੋਂ ਮੂਲਧਨ ਕੱਢਣ ਤੋਂ ਪਹਿਲਾਂ ਦਰ ਦਾ ਵਰਗ ਲੈਣਾ ਨਾ ਭੁੱਲੋ।",
      });
    }
    case "INT-QL-105": return deepFreeze(hi ? {
      keyIdea: "लगातार दो वर्षों के चक्रवृद्धि ब्याज का अनुपात \\(1+r/100\\) होता है।",
      steps: Object.freeze([`\\(r=100(J_{k+1}/J_k-1)=100(${money(state.laterInterest)}\\div${money(state.earlierInterest)}-1)=${percent(answer)}\\)।`]),
      finalAnswer, commonMistake: "वृद्धि को दोनों वर्षों के ब्याज के योग का प्रतिशत न लें; आधार पहले वर्ष का ब्याज है।",
    } : {
      keyIdea: "ਲਗਾਤਾਰ ਦੋ ਸਾਲਾਂ ਦੇ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਦਾ ਅਨੁਪਾਤ \\(1+r/100\\) ਹੁੰਦਾ ਹੈ।",
      steps: Object.freeze([`\\(r=100(J_{k+1}/J_k-1)=100(${money(state.laterInterest)}\\div${money(state.earlierInterest)}-1)=${percent(answer)}\\)।`]),
      finalAnswer, commonMistake: "ਵਾਧੇ ਨੂੰ ਦੋਵੇਂ ਸਾਲਾਂ ਦੇ ਵਿਆਜ ਦੇ ਜੋੜ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਨਾ ਲਓ; ਆਧਾਰ ਪਹਿਲੇ ਵਾਲੇ ਸਾਲ ਦਾ ਵਿਆਜ ਹੈ।",
    });
    case "INT-QL-106": {
      const rate = rateFromConsecutive(state.earlierInterest, state.laterInterest);
      return deepFreeze(hi ? {
        keyIdea: "पहले लगातार वर्षों के ब्याज से दर निकालें, फिर उस वर्ष के ब्याज संबंध को उलटकर मूलधन निकालें।",
        steps: Object.freeze([`लगातार ब्याजों से वार्षिक दर ${percent(rate)} है।`, `अब \\(J_k=P(r/100)(1+r/100)^{k-1}\\) में मान रखने पर मूलधन ${money(answer)} मिलता है।`]),
        finalAnswer, commonMistake: "यदि दिया गया ब्याज दूसरे या तीसरे वर्ष का है, तो उसे सीधे पहले वर्ष का ब्याज न मानें।",
      } : {
        keyIdea: "ਪਹਿਲਾਂ ਲਗਾਤਾਰ ਸਾਲਾਂ ਦੇ ਵਿਆਜ ਤੋਂ ਦਰ ਕੱਢੋ, ਫਿਰ ਉਸ ਸਾਲ ਦੇ ਵਿਆਜ ਸੰਬੰਧ ਨੂੰ ਉਲਟ ਕੇ ਮੂਲਧਨ ਕੱਢੋ।",
        steps: Object.freeze([`ਲਗਾਤਾਰ ਵਿਆਜਾਂ ਤੋਂ ਸਾਲਾਨਾ ਦਰ ${percent(rate)} ਹੈ।`, `ਹੁਣ \\(J_k=P(r/100)(1+r/100)^{k-1}\\) ਵਿੱਚ ਮੁੱਲ ਰੱਖਣ 'ਤੇ ਮੂਲਧਨ ${money(answer)} ਮਿਲਦਾ ਹੈ।`]),
        finalAnswer, commonMistake: "ਜੇ ਦਿੱਤਾ ਵਿਆਜ ਦੂਜੇ ਜਾਂ ਤੀਜੇ ਸਾਲ ਦਾ ਹੈ, ਤਾਂ ਉਸਨੂੰ ਸਿੱਧਾ ਪਹਿਲੇ ਸਾਲ ਦਾ ਵਿਆਜ ਨਾ ਮੰਨੋ।",
      });
    }
    case "INT-QL-107": {
      const year = Number(answer.numerator / answer.denominator);
      const previous = siCiDifference(state.principal, state.ratePercent, year - 1);
      const current = siCiDifference(state.principal, state.ratePercent, year);
      return deepFreeze(hi ? {
        keyIdea: "CI−SI का अंतर वर्ष-दर-वर्ष देखें और लक्ष्य तक पहुँचने वाले पहले पूर्ण वर्ष पर रुकें।",
        steps: Object.freeze([`${year - 1} वर्षों बाद CI−SI = ${money(previous)}, जो ${money(state.targetDifference)} से कम है।`, `${year} वर्षों बाद CI−SI = ${money(current)}, इसलिए यही पहला वर्ष है जब लक्ष्य पूरा होता है।`]),
        finalAnswer, commonMistake: "ऐसा बाद का वर्ष न चुनें जिसमें अंतर लक्ष्य से अधिक है; प्रश्न पहला पूर्ण वर्ष पूछता है।",
      } : {
        keyIdea: "CI−SI ਦਾ ਅੰਤਰ ਸਾਲ-ਦਰ-ਸਾਲ ਵੇਖੋ ਅਤੇ ਟੀਚੇ ਤੱਕ ਪਹੁੰਚਣ ਵਾਲੇ ਪਹਿਲੇ ਪੂਰੇ ਸਾਲ 'ਤੇ ਰੁੱਕੋ।",
        steps: Object.freeze([`${year - 1} ਸਾਲਾਂ ਬਾਅਦ CI−SI = ${money(previous)}, ਜੋ ${money(state.targetDifference)} ਤੋਂ ਘੱਟ ਹੈ।`, `${year} ਸਾਲਾਂ ਬਾਅਦ CI−SI = ${money(current)}, ਇਸ ਲਈ ਇਹੀ ਪਹਿਲਾ ਸਾਲ ਹੈ ਜਦੋਂ ਟੀਚਾ ਪੂਰਾ ਹੁੰਦਾ ਹੈ।`]),
        finalAnswer, commonMistake: "ਕੋਈ ਬਾਅਦਲਾ ਸਾਲ ਨਾ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਅੰਤਰ ਟੀਚੇ ਤੋਂ ਵੱਧ ਹੈ; ਸਵਾਲ ਪਹਿਲਾ ਪੂਰਾ ਸਾਲ ਪੁੱਛਦਾ ਹੈ।",
      });
    }
    case "INT-QL-108": return deepFreeze(hi ? {
      keyIdea: "दूसरे और पहले वर्ष के ब्याज का अंतर, पहले वर्ष के ब्याज का r% होता है।",
      steps: Object.freeze([`क्योंकि \\(J_2-J_1=J_1(r/100)\\), इसलिए \\(J_1=${money(state.secondYearExcess)}\\div(${percent(state.ratePercent)}/100)=${money(answer)}\\)।`]),
      finalAnswer, commonMistake: "अंतर को दोनों वर्षों में बाँटें नहीं; यह पहले वर्ष के ब्याज पर मिलने वाला अतिरिक्त ब्याज है।",
    } : {
      keyIdea: "ਦੂਜੇ ਅਤੇ ਪਹਿਲੇ ਸਾਲ ਦੇ ਵਿਆਜ ਦਾ ਅੰਤਰ, ਪਹਿਲੇ ਸਾਲ ਦੇ ਵਿਆਜ ਦਾ r% ਹੁੰਦਾ ਹੈ।",
      steps: Object.freeze([`ਕਿਉਂਕਿ \\(J_2-J_1=J_1(r/100)\\), ਇਸ ਲਈ \\(J_1=${money(state.secondYearExcess)}\\div(${percent(state.ratePercent)}/100)=${money(answer)}\\)।`]),
      finalAnswer, commonMistake: "ਅੰਤਰ ਨੂੰ ਦੋਵੇਂ ਸਾਲਾਂ ਵਿੱਚ ਨਾ ਵੰਡੋ; ਇਹ ਪਹਿਲੇ ਸਾਲ ਦੇ ਵਿਆਜ ਉੱਤੇ ਮਿਲਣ ਵਾਲਾ ਵਾਧੂ ਵਿਆਜ ਹੈ।",
    });
  }
}

function localizeOptionText(text: string, locale: IntCp006LocalizedLocale): string {
  const match = text.match(/^(\d+) years?$/u);
  return match ? yearText(Number(match[1]), locale) : text;
}

export function generateIntCp006LocalizedQuestion(qlId: IntCp006QlId, seed: string, locale: IntCp006LocalizedLocale) {
  const source = generateIntCp006EnglishFrozenQuestion(qlId, seed, "en-IN");
  const template = templateIndex(source.presentation.stemFamilyId);
  const markdown = localizedStem(qlId, source.mathematicalState, template, locale);
  const options = Object.freeze(source.options.map((option) => deepFreeze({ ...option, text: localizeOptionText(option.text, locale) })));
  const correctAnswer = options[source.correctIndex]!.text;
  const answer = source.options[source.correctIndex]!.value;
  const explanation = localizedExplanation(qlId, source.mathematicalState, answer, locale);

  if (
    source.enabled
    || source.stagingStatus !== "NOT_STAGED"
    || source.registrationStatus !== "NOT_REGISTERED"
    || source.questionStudioDiscoverable
    || source.questionBankStatus !== "NOT_STORED"
    || source.testEligibility !== "INELIGIBLE"
    || source.publiclyPublishable
  ) throw new Error(`${qlId}/${seed}: frozen English source delivery boundary is open`);

  return deepFreeze({
    ...source,
    locale,
    presentation: deepFreeze({ ...source.presentation, markdown, prompt: markdown }),
    options,
    correctAnswer,
    explanation,
    localizedVersion: INT_CP006_LOCALIZED_VERSION,
    localizedFromFreezeId: INT_CP006_ENGLISH_FREEZE_ID,
    localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const,
    editorialStatus: "LOCALIZED_REVIEW" as const,
    approvalStatus: "PENDING_LOCALIZED_REVIEW" as const,
    allocationStatus: "INACTIVE_LOCALIZED_REVIEW" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: false as const,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|${locale}|CP006_HI_PA_V1`,
  });
}
