import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP004_QL_IDS } from "./cp004-frequency-math";
import { generateIntCp004EnglishFrozenV2Question } from "./cp004-english-frozen-runtime-v2";
import { INT_CP004_V6_LOCALIZED_LOCALES } from "./cp004-localization-v6-runtime";
import { generateIntCp004V6NativeEditorialV3Question } from "./cp004-localization-v6-native-editorial-v3";

const stable = (value: unknown): string => JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
const fail = (message: string): never => { throw new Error(message); };
const hasTable = (text: string): boolean => /^\|.+\|$/mu.test(text) && /^\|\s*[-:]+/mu.test(text);

function hasLongMonthOnly(locale: "hi-IN" | "pa-IN", text: string): boolean {
  const pattern = locale === "hi-IN" ? /(\d+) महीने/gu : /(\d+) ਮਹੀਨੇ/gu;
  return [...text.matchAll(pattern)].some((match) => Number(match[1]) >= 12);
}

const BAD_HINDI = /(?:^एक प्रश्न में|^मान लीजिए|पहले 1 वर्ष|अगले 1 वर्ष|प्रत्येक (?:वार्षिक|छमाही|तिमाही|मासिक) अवधि|हर (?:वार्षिक|छमाही|तिमाही|मासिक) अवधि|वार्षिक चक्रवृद्धि ब्याज लगता है|ब्याज वार्षिक रूप से जुड़ता है|अगले वर्ष हर वर्ष|पूरे हुए वर्षों|कुल अवधि)/mu;
const BAD_PUNJABI = /(?:^ਇੱਕ ਪ੍ਰਸ਼ਨ ਵਿੱਚ|^ਮੰਨ ਲਓ|ਪਹਿਲੇ 1 ਸਾਲ|ਅਗਲੇ 1 ਸਾਲ|ਹਰ (?:ਸਾਲਾਨਾ|ਛਿਮਾਹੀ|ਤਿਮਾਹੀ|ਮਹੀਨਾਵਾਰ) ਮਿਆਦ|ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਲੱਗਦਾ ਹੈ|ਵਿਆਜ ਸਾਲਾਨਾ ਜੁੜਦਾ ਹੈ|ਅਗਲੇ ਸਾਲ ਹਰ ਸਾਲ|ਪੂਰੇ ਹੋਏ ਸਾਲਾਂ|ਕੁੱਲ ਮਿਆਦ|ਚੱਕਰਵੱਧੀ)/mu;

let questions = 0;
let parityChecks = 0;
let naturalnessChecks = 0;
let formulaChecks = 0;
let calculationChecks = 0;
let optionDurationChecks = 0;
let ql083PromptChecks = 0;
let tableParityChecks = 0;
let lifecycleChecks = 0;
const localeCounts = { "hi-IN": 0, "pa-IN": 0 };

for (const qlId of INT_CP004_QL_IDS) {
  for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
    const seed = `int-cp004-v6-native-v3:${qlId}:${seedIndex}`;
    const source = generateIntCp004EnglishFrozenV2Question(qlId, seed);
    for (const locale of INT_CP004_V6_LOCALIZED_LOCALES) {
      const q = generateIntCp004V6NativeEditorialV3Question(qlId, seed, locale);
      questions += 1;
      localeCounts[locale] += 1;

      parityChecks += 6;
      if (stable(q.mathematicalState) !== stable(source.mathematicalState)) fail(`${qlId}/${seed}/${locale}: math changed.`);
      if (stable(q.solution) !== stable(source.solution)) fail(`${qlId}/${seed}/${locale}: solution changed.`);
      if (q.correctIndex !== source.correctIndex) fail(`${qlId}/${seed}/${locale}: correct index changed.`);
      if (q.representation !== source.representation || q.stemFamilyId !== source.stemFamilyId) fail(`${qlId}/${seed}/${locale}: presentation identity changed.`);
      if (q.options.length !== source.options.length) fail(`${qlId}/${seed}/${locale}: option count changed.`);
      if (q.correctAnswer !== q.options[q.correctIndex]?.text) fail(`${qlId}/${seed}/${locale}: keyed answer text changed.`);
      for (let i = 0; i < source.options.length; i += 1) {
        if (stable(q.options[i]?.value) !== stable(source.options[i]?.value)) fail(`${qlId}/${seed}/${locale}/option-${i}: option value changed.`);
      }

      tableParityChecks += 1;
      if (hasTable(source.stem) !== hasTable(q.stem)) fail(`${qlId}/${seed}/${locale}: prose/table surface changed.`);

      naturalnessChecks += 1;
      const text = [q.stem, q.explanation.whatAsked, ...q.explanation.steps, q.explanation.commonMistake].join("\n");
      if (locale === "hi-IN" ? BAD_HINDI.test(text) : BAD_PUNJABI.test(text)) fail(`${qlId}/${seed}/${locale}: rejected mechanical wording remains.`);
      if (hasLongMonthOnly(locale, q.stem)) fail(`${qlId}/${seed}/${locale}: 12+ month duration remains month-only.`);

      for (const option of q.options) {
        optionDurationChecks += 1;
        if (hasLongMonthOnly(locale, option.text)) fail(`${qlId}/${seed}/${locale}/${option.id}: long duration option remains month-only.`);
      }

      formulaChecks += 1;
      const formulaPrefix = locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
      if (!q.explanation.steps[0]?.startsWith(formulaPrefix)) fail(`${qlId}/${seed}/${locale}: formula is not Step 1.`);
      calculationChecks += 1;
      if (!q.explanation.steps.slice(1).some((step) => step.includes("="))) fail(`${qlId}/${seed}/${locale}: no worked calculation follows formula.`);

      if (qlId === "INT-QL-083") {
        ql083PromptChecks += 1;
        const expected = locale === "hi-IN" ? /अंतिम \d+ महीनों से पहले कितने वर्षों/u : /ਆਖਰੀ \d+ ਮਹੀਨਿਆਂ ਤੋਂ ਪਹਿਲਾਂ ਕਿੰਨੇ ਸਾਲਾਂ/u;
        if (!expected.test(q.stem)) fail(`${qlId}/${seed}/${locale}: inverse-time question is still ambiguous.`);
      }

      lifecycleChecks += 7;
      if (q.approvalStatus !== "LOCALIZED_REVIEW_REQUIRED" || q.enabled || q.stagingStatus !== "NOT_STAGED" || q.registrationStatus !== "NOT_REGISTERED" || q.questionStudioDiscoverable || q.questionBankStatus !== "NOT_STORED" || q.publiclyPublishable) {
        fail(`${qlId}/${seed}/${locale}: lifecycle opened.`);
      }
    }
  }
}

if (questions !== 3800 || localeCounts["hi-IN"] !== 1900 || localeCounts["pa-IN"] !== 1900) fail(`Question counts changed: ${questions}/${JSON.stringify(localeCounts)}.`);

const summary = {
  editorialVersion: "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v3",
  canonicalFreezeId: "INT-CP-004-EN-v2-frozen",
  qlCount: 19,
  questions,
  localeCounts,
  parityChecks,
  naturalnessChecks,
  formulaChecks,
  calculationChecks,
  optionDurationChecks,
  ql083PromptChecks,
  tableParityChecks,
  lifecycleChecks,
  lifecycle: { reviewStatus: "LOCALIZED_REVIEW_REQUIRED", enabled: false, registrationStatus: "NOT_REGISTERED", questionBankStatus: "NOT_STORED", publiclyPublishable: false },
};
const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-hi-pa-v6-native-v3");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(join(outputDirectory, "int-cp004-hi-pa-v6-native-v3-audit.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_HI_PA_V6_NATIVE_V3");
