import { INT_CP004_QL_IDS } from "./cp004-frequency-math";
import { generateIntCp004EnglishFrozenV2Question } from "./cp004-english-frozen-runtime-v2";
import { INT_CP004_V6_LOCALIZED_LOCALES } from "./cp004-localization-v6-runtime";
import { generateIntCp004V6NativeEditorialV4Question } from "./cp004-localization-v6-native-editorial-v4";
import { generateIntCp004V6NativeEditorialV5Question } from "./cp004-localization-v6-native-editorial-v5";

const fail = (message: string): never => { throw new Error(message); };
const stable = (value: unknown): string => JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);

function mathSegments(text: string): string[] {
  return [...text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/gu)].map((match) => match[1] ?? match[2] ?? "");
}

function outsideMath(text: string): string {
  return text.replace(/\\\([\s\S]*?\\\)/gu, "").replace(/\\\[[\s\S]*?\\\]/gu, "");
}

let questions = 0;
let wrapperChecks = 0;
let parityChecks = 0;
const localeCounts = { "hi-IN": 0, "pa-IN": 0 };

for (const qlId of INT_CP004_QL_IDS) {
  for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
    const seed = `int-cp004-v6-native-v5:${qlId}:${seedIndex}`;
    const english = generateIntCp004EnglishFrozenV2Question(qlId, seed);
    for (const locale of INT_CP004_V6_LOCALIZED_LOCALES) {
      const v4 = generateIntCp004V6NativeEditorialV4Question(qlId, seed, locale);
      const q = generateIntCp004V6NativeEditorialV5Question(qlId, seed, locale);
      questions += 1;
      localeCounts[locale] += 1;

      parityChecks += 6;
      if (stable(q.mathematicalState) !== stable(english.mathematicalState)) fail(`${qlId}/${seed}/${locale}: math changed.`);
      if (stable(q.solution) !== stable(english.solution)) fail(`${qlId}/${seed}/${locale}: solution changed.`);
      if (q.correctIndex !== english.correctIndex) fail(`${qlId}/${seed}/${locale}: answer index changed.`);
      if (q.stem !== v4.stem || stable(q.options) !== stable(v4.options)) fail(`${qlId}/${seed}/${locale}: V5 changed question content.`);
      if (q.explanation.steps.length !== v4.explanation.steps.length) fail(`${qlId}/${seed}/${locale}: step count changed.`);
      if (q.approvalStatus !== "LOCALIZED_REVIEW_REQUIRED" || q.enabled || q.registrationStatus !== "NOT_REGISTERED" || q.questionStudioDiscoverable || q.questionBankStatus !== "NOT_STORED" || q.publiclyPublishable) fail(`${qlId}/${seed}/${locale}: lifecycle opened.`);

      const prefix = locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
      const first = q.explanation.steps[0] ?? "";
      if (!first.startsWith(prefix) || mathSegments(first).length === 0) fail(`${qlId}/${seed}/${locale}: formula wrapper missing.`);

      for (let stepIndex = 0; stepIndex < q.explanation.steps.length; stepIndex += 1) {
        const step = q.explanation.steps[stepIndex] ?? "";
        wrapperChecks += 1;
        if (step.includes("$")) fail(`${qlId}/${seed}/${locale}/step-${stepIndex + 1}: dollar delimiter remains.`);
        const outside = outsideMath(step);
        if (outside.includes("=") || outside.includes("×") || outside.includes("÷") || outside.includes("−") || outside.includes("^")) fail(`${qlId}/${seed}/${locale}/step-${stepIndex + 1}: unwrapped math remains: ${step}`);
        if (outside.includes("\\frac") || outside.includes("\\dfrac") || outside.includes("\\times") || outside.includes("\\div")) fail(`${qlId}/${seed}/${locale}/step-${stepIndex + 1}: LaTeX command remains outside wrapper.`);
        for (const expression of mathSegments(step)) {
          if (!expression.trim()) fail(`${qlId}/${seed}/${locale}/step-${stepIndex + 1}: empty wrapper.`);
          if (expression.includes("×") || expression.includes("÷") || expression.includes("−") || expression.includes("₹") || expression.includes("$")) fail(`${qlId}/${seed}/${locale}/step-${stepIndex + 1}: non-LaTeX symbol inside wrapper.`);
        }
      }
    }
  }
}

if (questions !== 3800 || localeCounts["hi-IN"] !== 1900 || localeCounts["pa-IN"] !== 1900) fail(`count mismatch ${questions}`);

console.log(JSON.stringify({
  editorialVersion: "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v5",
  supersedes: "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v4",
  questions,
  localeCounts,
  parityChecks,
  wrapperChecks,
  learnerStandard: {
    PunjabiCompoundInterest: "ਮਿਸ਼ਰਤ ਵਿਆਜ",
    math: "EXAMTREE_MATHJAX_LATEX",
    inlineDelimiter: "\\(...\\)",
    displayDelimiter: "\\[...\\]",
    legacyDollarDelimitersAllowed: false,
    rawEquationsOutsideMathAllowed: false
  }
}, null, 2));
console.log("PASS_INT_CP004_HI_PA_V6_NATIVE_V5");
