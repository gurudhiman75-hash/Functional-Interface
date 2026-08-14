import { INT_CP004_QL_IDS } from "./cp004-frequency-math";
import { generateIntCp004EnglishFrozenV2Question } from "./cp004-english-frozen-runtime-v2";
import { INT_CP004_V6_LOCALIZED_LOCALES } from "./cp004-localization-v6-runtime";
import { generateIntCp004V6NativeEditorialV5Question } from "./cp004-localization-v6-native-editorial-v5";
import { generateIntCp004V6NativeEditorialV8Question } from "./cp004-localization-v6-native-editorial-v8";
import type { IntCp004V6Locale } from "./cp004-localization-v6-types";

const fail = (message: string): never => { throw new Error(message); };
const stable = (value: unknown): string => JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);

function outsideMath(text: string): string {
  return text.replace(/\\\([\s\S]*?\\\)/gu, "").replace(/\\\[[\s\S]*?\\\]/gu, "");
}

function approvedClean(text: string, locale: IntCp004V6Locale): string {
  const label = locale === "hi-IN" ? /^(प्रति अवधि दर|हर अवधि की दर):\s*/u : /^(ਹਰ ਮਿਆਦ ਦੀ ਦਰ):\s*/u;
  const match = text.match(label);
  let cleaned = text;
  if (match) {
    const prefix = match[0];
    const rest = text.slice(prefix.length);
    const direct = rest.match(/^\\\(([0-9][0-9{,}.]*)\\frac\{\\%\}\{100\}\\\)([।.]?)$/u);
    if (direct) cleaned = `${prefix}\\(${direct[1]}\\%=\\frac{${direct[1]}}{100}\\)${direct[2]}`;
  }
  cleaned = cleaned.replace(/([0-9][0-9{,}.]*)\\frac\{\\%\}\{100\}/gu, (_m, rate: string) => `\\frac{${rate}}{100}`);
  cleaned = cleaned.replace(/₹\s*([\d,]+)\.00(?!\d)/gu, "₹$1");
  cleaned = cleaned.replace(/(\d+)\.(\d*?[1-9])0+(?=\\?%)/gu, "$1.$2").replace(/(\d+)\.0+(?=\\?%)/gu, "$1");
  return cleaned;
}

function visible(q: ReturnType<typeof generateIntCp004V6NativeEditorialV8Question>): string[] {
  return [q.stem, ...q.options.map((o) => o.text), q.correctAnswer, q.explanation.whatAsked, ...q.explanation.steps, q.explanation.finalAnswer, q.explanation.commonMistake];
}

let questions = 0;
let parityChecks = 0;
let wrapperChecks = 0;
let decimalChecks = 0;
let approximationChecks = 0;
let normalizationIdentityChecks = 0;
let wholeRupeeDotZero = 0;
let malformedPercentFraction = 0;
let rejectedPunjabiTerms = 0;
const localeCounts = { "hi-IN": 0, "pa-IN": 0 };

for (const qlId of INT_CP004_QL_IDS) {
  for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
    const seed = `int-cp004-v8-final:${qlId}:${seedIndex}`;
    const english = generateIntCp004EnglishFrozenV2Question(qlId, seed);
    for (const locale of INT_CP004_V6_LOCALIZED_LOCALES) {
      const predecessor = generateIntCp004V6NativeEditorialV5Question(qlId, seed, locale);
      const q = generateIntCp004V6NativeEditorialV8Question(qlId, seed, locale);
      questions += 1;
      localeCounts[locale] += 1;

      parityChecks += 6;
      if (stable(q.mathematicalState) !== stable(english.mathematicalState)) fail(`${qlId}/${seed}/${locale}: mathematical state changed.`);
      if (stable(q.solution) !== stable(english.solution)) fail(`${qlId}/${seed}/${locale}: solution changed.`);
      if (q.correctIndex !== english.correctIndex) fail(`${qlId}/${seed}/${locale}: correct index changed.`);
      if (q.options.length !== predecessor.options.length) fail(`${qlId}/${seed}/${locale}: option count changed.`);
      if (q.approvalStatus !== "LOCALIZED_REVIEW_REQUIRED" || q.enabled || q.registrationStatus !== "NOT_REGISTERED" || q.questionStudioDiscoverable || q.questionBankStatus !== "NOT_STORED" || q.publiclyPublishable) fail(`${qlId}/${seed}/${locale}: lifecycle opened.`);

      normalizationIdentityChecks += 4 + q.options.length + q.explanation.steps.length;
      if (q.stem !== approvedClean(predecessor.stem, locale)) fail(`${qlId}/${seed}/${locale}: stem changed beyond approved numeric normalization.`);
      q.options.forEach((option, i) => {
        if (option.text !== approvedClean(predecessor.options[i]?.text ?? "", locale)) fail(`${qlId}/${seed}/${locale}: option ${i} changed beyond approved numeric normalization.`);
      });
      if (q.explanation.whatAsked !== approvedClean(predecessor.explanation.whatAsked, locale)) fail(`${qlId}/${seed}/${locale}: whatAsked drift.`);
      q.explanation.steps.forEach((step, i) => {
        if (step !== approvedClean(predecessor.explanation.steps[i] ?? "", locale)) fail(`${qlId}/${seed}/${locale}: explanation step ${i + 1} drift.`);
      });
      if (q.explanation.commonMistake !== approvedClean(predecessor.explanation.commonMistake, locale)) fail(`${qlId}/${seed}/${locale}: commonMistake drift.`);

      const predecessorApprox = locale === "hi-IN" ? predecessor.explanation.finalAnswer.includes("लगभग") : predecessor.explanation.finalAnswer.includes("ਲਗਭਗ");
      if (predecessorApprox) {
        approximationChecks += 1;
        const v8Approx = locale === "hi-IN" ? q.explanation.finalAnswer.includes("लगभग") : q.explanation.finalAnswer.includes("ਲਗਭਗ");
        if (!v8Approx || !q.explanation.steps.some((step) => step.includes("\\approx"))) fail(`${qlId}/${seed}/${locale}: approximation semantics lost.`);
      }

      const joined = visible(q).join("\n");
      if (locale === "pa-IN" && /ਚੱਕਰਵੱਧੀ ਵਿਆਜ/u.test(joined)) { rejectedPunjabiTerms += 1; fail(`${qlId}/${seed}: rejected Punjabi term.`); }
      if (/₹\s*[\d,]+\.00(?!\d)/u.test(joined)) { wholeRupeeDotZero += 1; fail(`${qlId}/${seed}/${locale}: whole rupees show .00.`); }
      if (/\\frac\{\\%\}\{100\}/u.test(joined)) { malformedPercentFraction += 1; fail(`${qlId}/${seed}/${locale}: malformed percent fraction.`); }

      for (const text of visible(q)) {
        for (const match of text.matchAll(/\d[\d,]*\.(\d+)/gu)) {
          decimalChecks += 1;
          if ((match[1] ?? "").length > 2) fail(`${qlId}/${seed}/${locale}: ugly decimal ${match[0]}.`);
        }
      }

      for (const step of q.explanation.steps) {
        wrapperChecks += 1;
        if (step.includes("$")) fail(`${qlId}/${seed}/${locale}: legacy dollar wrapper.`);
        const outside = outsideMath(step);
        if (/[=×÷−^]/u.test(outside) || /\\(?:frac|dfrac|times|div)/u.test(outside)) fail(`${qlId}/${seed}/${locale}: raw math outside wrapper: ${step}`);
      }
    }
  }
}

if (questions !== 3800 || localeCounts["hi-IN"] !== 1900 || localeCounts["pa-IN"] !== 1900) fail(`count mismatch ${questions}`);
if (approximationChecks === 0) fail("approximation path not exercised.");

console.log(JSON.stringify({
  editorialVersion: "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v8",
  sourceEditorialVersion: "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v5",
  questions,
  localeCounts,
  parityChecks,
  normalizationIdentityChecks,
  wrapperChecks,
  decimalChecks,
  approximationChecks,
  wholeRupeeDotZero,
  malformedPercentFraction,
  rejectedPunjabiTerms,
  learnerStandard: {
    PunjabiCompoundInterest: "ਮਿਸ਼ਰਤ ਵਿਆਜ",
    inlineMath: "\\(...\\)",
    displayMath: "\\[...\\]",
    maximumVisibleDecimalPlaces: 2,
    wholeRupeesUseDotZeroZero: false,
    genuinePaisePreserved: true,
    roundedEffectiveRatesStayApproximate: true,
  }
}, null, 2));
console.log("PASS_INT_CP004_HI_PA_V6_NATIVE_V8");
