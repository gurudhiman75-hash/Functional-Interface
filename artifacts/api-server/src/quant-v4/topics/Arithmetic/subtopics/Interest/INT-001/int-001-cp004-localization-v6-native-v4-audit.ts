import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP004_QL_IDS } from "./cp004-frequency-math";
import { generateIntCp004EnglishFrozenV2Question } from "./cp004-english-frozen-runtime-v2";
import { INT_CP004_V6_LOCALIZED_LOCALES } from "./cp004-localization-v6-runtime";
import { generateIntCp004V6NativeEditorialV4Question } from "./cp004-localization-v6-native-editorial-v4";

const stable = (value: unknown): string => JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
const fail = (message: string): never => { throw new Error(message); };
const hasTable = (text: string): boolean => /^\|.+\|$/mu.test(text) && /^\|\s*[-:]+/mu.test(text);

const DIRECT_HINDI = /(?:ज्ञात कीजिए|पता कीजिए|निकालिए)[।?]?$/u;
const DIRECT_PUNJABI = /(?:ਪਤਾ ਕਰੋ|ਕੱਢੋ)[।?]?$/u;
const OLD_PUNJABI_TERM = /ਚੱਕਰਵੱਧੀ ਵਿਆਜ/u;
const RAW_FORMULA_OPERATOR = /(?:\s[×÷]\s|\^\(?[A-Za-z0-9]|(?:A|P|CI|E|R|r|n|m|y|x)\s*=\s*[A-Za-z0-9])/u;

function outsideMath(text: string): string {
  return text.replace(/\$[^$]*\$/gu, "");
}

let questions = 0;
let parityChecks = 0;
let termChecks = 0;
let latexFormulaChecks = 0;
let latexCalculationChecks = 0;
let stemReadabilityChecks = 0;
let tableParityChecks = 0;
let lifecycleChecks = 0;
const localeCounts = { "hi-IN": 0, "pa-IN": 0 };

for (const qlId of INT_CP004_QL_IDS) {
  for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
    const seed = `int-cp004-v6-native-v4:${qlId}:${seedIndex}`;
    const source = generateIntCp004EnglishFrozenV2Question(qlId, seed);

    for (const locale of INT_CP004_V6_LOCALIZED_LOCALES) {
      const q = generateIntCp004V6NativeEditorialV4Question(qlId, seed, locale);
      questions += 1;
      localeCounts[locale] += 1;

      parityChecks += 6;
      if (stable(q.mathematicalState) !== stable(source.mathematicalState)) fail(`${qlId}/${seed}/${locale}: math changed.`);
      if (stable(q.solution) !== stable(source.solution)) fail(`${qlId}/${seed}/${locale}: solution changed.`);
      if (q.correctIndex !== source.correctIndex) fail(`${qlId}/${seed}/${locale}: correct index changed.`);
      if (q.representation !== source.representation || q.stemFamilyId !== source.stemFamilyId) fail(`${qlId}/${seed}/${locale}: presentation identity changed.`);
      if (q.options.length !== source.options.length) fail(`${qlId}/${seed}/${locale}: option count changed.`);
      for (let i = 0; i < source.options.length; i += 1) {
        if (stable(q.options[i]?.value) !== stable(source.options[i]?.value)) fail(`${qlId}/${seed}/${locale}/option-${i}: option value changed.`);
      }

      tableParityChecks += 1;
      if (hasTable(source.stem) !== hasTable(q.stem)) fail(`${qlId}/${seed}/${locale}: prose/table surface changed.`);

      stemReadabilityChecks += 1;
      const direct = q.stem.match(locale === "hi-IN" ? DIRECT_HINDI : DIRECT_PUNJABI);
      if (direct) fail(`${qlId}/${seed}/${locale}: direct command ending remains '${direct[0]}'.`);
      const proseWordCount = q.stem.replace(/\|[^\n]*\|/gu, " ").trim().split(/\s+/u).filter(Boolean).length;
      if (!hasTable(q.stem) && proseWordCount > 85) fail(`${qlId}/${seed}/${locale}: stem became overlong (${proseWordCount} words).`);
      if (qlId === "INT-QL-067" && !hasTable(q.stem)) {
        const expected = locale === "hi-IN" ? /एक व्यक्ति ने .* निवेश किया/u : /ਇੱਕ ਵਿਅਕਤੀ ਨੇ .* ਨਿਵੇਸ਼ ਕੀਤਾ/u;
        if (!expected.test(q.stem)) fail(`${qlId}/${seed}/${locale}: approved investment framing missing.`);
      }

      termChecks += 1;
      const learnerText = [q.stem, ...q.options.map((o) => o.text), q.explanation.whatAsked, ...q.explanation.steps, q.explanation.commonMistake].join("\n");
      if (locale === "pa-IN" && OLD_PUNJABI_TERM.test(learnerText)) fail(`${qlId}/${seed}/${locale}: rejected Punjabi compound-interest term remains.`);

      latexFormulaChecks += 1;
      const prefix = locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
      const formula = q.explanation.steps[0];
      if (!formula?.startsWith(prefix) || !/\$[^$]+\\(?:frac|dfrac|left)/u.test(formula)) {
        fail(`${qlId}/${seed}/${locale}: Step 1 is not MathJax/LaTeX formula-first.`);
      }
      if (RAW_FORMULA_OPERATOR.test(outsideMath(formula))) fail(`${qlId}/${seed}/${locale}: raw formula operator remains outside MathJax.`);

      latexCalculationChecks += 1;
      for (const step of q.explanation.steps.slice(1)) {
        const outside = outsideMath(step);
        if (/[\^]/u.test(outside) || /\s[×÷]\s/u.test(outside)) {
          fail(`${qlId}/${seed}/${locale}: raw calculation operator remains outside MathJax: ${step}`);
        }
      }
      if (!q.explanation.steps.slice(1).some((step) => step.includes("="))) fail(`${qlId}/${seed}/${locale}: worked calculation missing.`);

      lifecycleChecks += 7;
      if (q.approvalStatus !== "LOCALIZED_REVIEW_REQUIRED" || q.enabled || q.stagingStatus !== "NOT_STAGED" || q.registrationStatus !== "NOT_REGISTERED" || q.questionStudioDiscoverable || q.questionBankStatus !== "NOT_STORED" || q.publiclyPublishable) {
        fail(`${qlId}/${seed}/${locale}: lifecycle opened.`);
      }
    }
  }
}

if (questions !== 3800 || localeCounts["hi-IN"] !== 1900 || localeCounts["pa-IN"] !== 1900) {
  fail(`Question counts changed: ${questions}/${JSON.stringify(localeCounts)}.`);
}

const summary = {
  editorialVersion: "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v4",
  approvalBasis: "EXPLICIT_PRODUCT_OWNER_APPROVAL_2026_08_13",
  canonicalFreezeId: "INT-CP-004-EN-v2-frozen",
  qlCount: 19,
  questions,
  localeCounts,
  parityChecks,
  termChecks,
  latexFormulaChecks,
  latexCalculationChecks,
  stemReadabilityChecks,
  tableParityChecks,
  lifecycleChecks,
  learnerStandard: {
    PunjabiCompoundInterest: "ਮਿਸ਼ਰਤ ਵਿਆਜ",
    math: "MATHJAX_LATEX",
    stems: "SLIGHTLY_WORDIER_EXAM_STYLE",
  },
  lifecycle: {
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
    enabled: false,
    registrationStatus: "NOT_REGISTERED",
    questionBankStatus: "NOT_STORED",
    publiclyPublishable: false,
  },
};

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-hi-pa-v6-native-v4");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(join(outputDirectory, "int-cp004-hi-pa-v6-native-v4-audit.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_HI_PA_V6_NATIVE_V4");
