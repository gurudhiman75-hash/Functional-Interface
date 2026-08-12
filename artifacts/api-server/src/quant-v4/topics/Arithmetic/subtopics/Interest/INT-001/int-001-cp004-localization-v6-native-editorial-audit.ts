import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP004_QL_IDS } from "./cp004-frequency-math";
import { generateIntCp004EnglishFrozenV2Question } from "./cp004-english-frozen-runtime-v2";
import { INT_CP004_V6_LOCALIZED_LOCALES } from "./cp004-localization-v6-runtime";
import { generateIntCp004V6NativeEditorialQuestion } from "./cp004-localization-v6-native-editorial";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function fail(message: string): never {
  throw new Error(message);
}

function hasTable(text: string): boolean {
  return /^\|.+\|$/mu.test(text) && /^\|\s*[-:]+/mu.test(text);
}

function hasLongMonthOnly(locale: "hi-IN" | "pa-IN", text: string): boolean {
  const pattern = locale === "hi-IN" ? /(\d+) महीने/gu : /(\d+) ਮਹੀਨੇ/gu;
  for (const match of text.matchAll(pattern)) {
    if (Number(match[1]) >= 12) return true;
  }
  return false;
}

const BAD_HINDI = /(?:^एक प्रश्न में|^मान लीजिए|पहले 1 वर्ष|अगले 1 वर्ष|प्रत्येक (?:वार्षिक|छमाही|तिमाही|मासिक) अवधि|हर (?:वार्षिक|छमाही|तिमाही|मासिक) अवधि|वार्षिक चक्रवृद्धि ब्याज लगता है|कुल अवधि)/mu;
const BAD_PUNJABI = /(?:^ਇੱਕ ਪ੍ਰਸ਼ਨ ਵਿੱਚ|^ਮੰਨ ਲਓ|ਪਹਿਲੇ 1 ਸਾਲ|ਅਗਲੇ 1 ਸਾਲ|ਹਰ (?:ਸਾਲਾਨਾ|ਛਿਮਾਹੀ|ਤਿਮਾਹੀ|ਮਹੀਨਾਵਾਰ) ਮਿਆਦ|ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਲੱਗਦਾ ਹੈ|ਕੁੱਲ ਮਿਆਦ|ਚੱਕਰਵੱਧੀ)/mu;
const DEVANAGARI = /[\u0900-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;

let questions = 0;
let parityChecks = 0;
let naturalnessChecks = 0;
let formulaChecks = 0;
let calculationChecks = 0;
let tableParityChecks = 0;
let ql083PromptChecks = 0;
let optionDurationChecks = 0;
let lifecycleChecks = 0;
const localeCounts = { "hi-IN": 0, "pa-IN": 0 };

for (const qlId of INT_CP004_QL_IDS) {
  for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
    const seed = `int-cp004-v6-native-editorial:${qlId}:${seedIndex}`;
    const source = generateIntCp004EnglishFrozenV2Question(qlId, seed);
    for (const locale of INT_CP004_V6_LOCALIZED_LOCALES) {
      const localized = generateIntCp004V6NativeEditorialQuestion(qlId, seed, locale);
      questions += 1;
      localeCounts[locale] += 1;

      parityChecks += 7;
      if (stable(localized.mathematicalState) !== stable(source.mathematicalState)) fail(`${qlId}/${seed}/${locale}: math changed after native editorial pass.`);
      if (stable(localized.solution) !== stable(source.solution)) fail(`${qlId}/${seed}/${locale}: solution changed after native editorial pass.`);
      if (localized.correctIndex !== source.correctIndex) fail(`${qlId}/${seed}/${locale}: correct index changed.`);
      if (localized.representation !== source.representation) fail(`${qlId}/${seed}/${locale}: representation changed.`);
      if (localized.stemFamilyId !== source.stemFamilyId) fail(`${qlId}/${seed}/${locale}: stem family changed.`);
      if (localized.options.length !== source.options.length) fail(`${qlId}/${seed}/${locale}: option count changed.`);
      if (localized.correctAnswer !== localized.options[localized.correctIndex]?.text) fail(`${qlId}/${seed}/${locale}: correct answer text is not keyed to the preserved correct index.`);
      for (let index = 0; index < source.options.length; index += 1) {
        if (stable(localized.options[index]?.value) !== stable(source.options[index]?.value)) fail(`${qlId}/${seed}/${locale}/option-${index}: option value changed.`);
      }

      tableParityChecks += 1;
      if (hasTable(source.stem) !== hasTable(localized.stem)) fail(`${qlId}/${seed}/${locale}: prose/table surface changed.`);

      naturalnessChecks += 1;
      const nativeText = [localized.stem, localized.explanation.whatAsked, ...localized.explanation.steps, localized.explanation.commonMistake].join("\n");
      if (locale === "hi-IN") {
        if (!DEVANAGARI.test(nativeText)) fail(`${qlId}/${seed}/${locale}: Devanagari missing.`);
        if (BAD_HINDI.test(nativeText)) fail(`${qlId}/${seed}/${locale}: mechanical Hindi wording remains.`);
      } else {
        if (!GURMUKHI.test(nativeText)) fail(`${qlId}/${seed}/${locale}: Gurmukhi missing.`);
        if (BAD_PUNJABI.test(nativeText)) fail(`${qlId}/${seed}/${locale}: mechanical/rejected Punjabi wording remains.`);
      }
      if (hasLongMonthOnly(locale, localized.stem)) fail(`${qlId}/${seed}/${locale}: duration of 12+ months is still written only in months.`);

      formulaChecks += 1;
      const prefix = locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
      if (!localized.explanation.steps[0]?.startsWith(prefix)) fail(`${qlId}/${seed}/${locale}: formula is not Step 1.`);

      calculationChecks += 1;
      if (!localized.explanation.steps.slice(1).some((step) => step.includes("="))) fail(`${qlId}/${seed}/${locale}: no substitution/calculation follows the formula.`);

      for (const option of localized.options) {
        optionDurationChecks += 1;
        if (hasLongMonthOnly(locale, option.text)) fail(`${qlId}/${seed}/${locale}/${option.id}: 12+ month option is not expressed naturally in years/months.`);
      }

      if (qlId === "INT-QL-083") {
        ql083PromptChecks += 1;
        const expected = locale === "hi-IN" ? /अंतिम \d+ महीनों से पहले कितने वर्षों/u : /ਆਖਰੀ \d+ ਮਹੀਨਿਆਂ ਤੋਂ ਪਹਿਲਾਂ ਕਿੰਨੇ ਸਾਲਾਂ/u;
        if (!expected.test(localized.stem)) fail(`${qlId}/${seed}/${locale}: inverse-time prompt is still ambiguous.`);
      }

      lifecycleChecks += 7;
      if (
        localized.approvalStatus !== "LOCALIZED_REVIEW_REQUIRED"
        || localized.enabled
        || localized.stagingStatus !== "NOT_STAGED"
        || localized.registrationStatus !== "NOT_REGISTERED"
        || localized.questionStudioDiscoverable
        || localized.questionBankStatus !== "NOT_STORED"
        || localized.publiclyPublishable
      ) fail(`${qlId}/${seed}/${locale}: lifecycle opened.`);
    }
  }
}

if (questions !== 3800) fail(`Expected 3,800 questions; received ${questions}.`);
if (localeCounts["hi-IN"] !== 1900 || localeCounts["pa-IN"] !== 1900) fail(`Locale counts changed: ${JSON.stringify(localeCounts)}.`);

const summary = {
  editorialVersion: "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v2",
  canonicalFreezeId: "INT-CP-004-EN-v2-frozen",
  qlCount: 19,
  questions,
  localeCounts,
  parityChecks,
  naturalnessChecks,
  formulaChecks,
  calculationChecks,
  tableParityChecks,
  ql083PromptChecks,
  optionDurationChecks,
  lifecycleChecks,
  lifecycle: {
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
    enabled: false,
    registrationStatus: "NOT_REGISTERED",
    questionBankStatus: "NOT_STORED",
    publiclyPublishable: false,
  },
};

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-hi-pa-v6-native-editorial");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(join(outputDirectory, "int-cp004-hi-pa-v6-native-editorial-audit.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_HI_PA_V6_NATIVE_EDITORIAL");
