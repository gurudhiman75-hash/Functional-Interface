import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP002_PERMANENT_QL_IDS } from "../permanent/allocation";
import { runNumCp002PermanentPipeline } from "../permanent/runtime";
import { runNumCp002LocalizedFinalPipeline } from "./runtime-final";
import type { NumCp002TranslatedLocale } from "./types";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

const locales: readonly NumCp002TranslatedLocale[] = ["hi-IN", "pa-IN"];
const scriptPattern: Readonly<Record<NumCp002TranslatedLocale, RegExp>> = {
  "hi-IN": /[\u0900-\u097F]/u,
  "pa-IN": /[\u0A00-\u0A7F]/u,
};
const rawSlashFraction = /(?<!\\frac\{)\b\d+\/\d+\b/u;
const unicodeMath = /[√²³]/u;
const internalIdLeak = /NUM-(?:CP|QL)|PROT-|solveMode|authorityId|qlTemplateId/iu;

function proseOutsideMath(value: string): string {
  return value.replace(/\\\(.*?\\\)/gsu, " ").replace(/\b(?:I|II|III)\b/gu, " ");
}

let generated = 0;
let replayChecks = 0;
let parityChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let scriptChecks = 0;
let englishLeakChecks = 0;
const review: unknown[] = [];
const answerPositions = new Map<string, Set<number>>();

for (const locale of locales) {
  for (const ql of NUM_CP002_PERMANENT_QL_IDS) {
    answerPositions.set(`${locale}:${ql}`, new Set());
    for (let seed = 1; seed <= 120; seed += 1) {
      const english = runNumCp002PermanentPipeline({ questionLanguageId: ql, seed, language: "en" });
      const localized = runNumCp002LocalizedFinalPipeline({ questionLanguageId: ql, seed, locale });
      const replay = runNumCp002LocalizedFinalPipeline({ questionLanguageId: ql, seed, locale });
      generated += 1;
      assert(JSON.stringify(localized) === JSON.stringify(replay), `${locale}/${ql}/${seed}: replay mismatch`);
      replayChecks += 1;

      assert(localized.permanentQlId === english.permanentQlId, `${locale}/${ql}/${seed}: QL drift`);
      assert(localized.temporaryPrototypeId === english.temporaryPrototypeId, `${locale}/${ql}/${seed}: prototype drift`);
      assert(localized.correctIndex === english.correctIndex, `${locale}/${ql}/${seed}: correctIndex drift`);
      assert(localized.mathematicalFingerprint === english.mathematicalFingerprint, `${locale}/${ql}/${seed}: fingerprint drift`);
      assert(JSON.stringify(localized.hiddenState) === JSON.stringify(english.hiddenState), `${locale}/${ql}/${seed}: hidden-state drift`);
      assert(localized.options.length === english.options.length, `${locale}/${ql}/${seed}: option-count drift`);
      assert(localized.options.every((o, i) => o.isCorrect === english.options[i]!.isCorrect && o.misconceptionId === english.options[i]!.misconceptionId), `${locale}/${ql}/${seed}: option semantic/order drift`);
      assert(localized.localization.canonicalAnswer === english.canonicalAnswer && localized.localization.canonicalVerifierAnswer === english.verifierAnswer, `${locale}/${ql}/${seed}: canonical truth drift`);
      assert(localized.canonicalAnswer === localized.options[localized.correctIndex]!.value && localized.verifierAnswer === localized.canonicalAnswer, `${locale}/${ql}/${seed}: localized answer mismatch`);
      parityChecks += 1;

      assert(localized.options.length === 4 && new Set(localized.options.map((o) => o.value)).size === 4, `${locale}/${ql}/${seed}: localized option integrity`);
      assert(localized.options.filter((o) => o.isCorrect).length === 1, `${locale}/${ql}/${seed}: localized one-correct integrity`);
      optionChecks += 1;

      assert(localized.maturity === "MULTILINGUAL_IMPLEMENTATION_FROZEN", `${locale}/${ql}/${seed}: maturity`);
      assert(!localized.lifecycle.active && !localized.lifecycle.questionStudioDiscoverable && !localized.lifecycle.questionBankWritable && !localized.lifecycle.testEligible && !localized.lifecycle.publiclyPublishable, `${locale}/${ql}/${seed}: delivery gate opened`);
      assert(localized.lifecycle.questionBankStatus === "NOT_STORED" && localized.lifecycle.testEligibility === "INELIGIBLE", `${locale}/${ql}/${seed}: downstream state`);
      lifecycleChecks += 1;

      assert(scriptPattern[locale].test(localized.stem), `${locale}/${ql}/${seed}: stem lacks localized script: ${localized.stem}`);
      const learner = [localized.stem, localized.explanation.concept ?? "", ...localized.explanation.solution].join("\n");
      assert(!rawSlashFraction.test(learner), `${locale}/${ql}/${seed}: raw slash fraction`);
      assert(!unicodeMath.test(learner), `${locale}/${ql}/${seed}: unicode math`);
      assert(!internalIdLeak.test(learner), `${locale}/${ql}/${seed}: internal identity leak`);
      scriptChecks += 1;

      const prose = proseOutsideMath(learner);
      assert(!/[A-Za-z]{2,}/u.test(prose), `${locale}/${ql}/${seed}: English prose leak: ${prose}`);
      englishLeakChecks += 1;
      answerPositions.get(`${locale}:${ql}`)!.add(localized.correctIndex);

      if (seed <= 4) review.push({ english, localized });
    }
  }
}

assert(generated === 5040, `Expected 5,040 localized questions, got ${generated}`);
assert(replayChecks === generated && parityChecks === generated && optionChecks === generated && lifecycleChecks === generated && scriptChecks === generated && englishLeakChecks === generated, "proof count mismatch");
for (const [key, positions] of answerPositions) assert(JSON.stringify([...positions].sort()) === JSON.stringify([0,1,2,3]), `${key}: answer-position reachability ${[...positions]}`);
assert(review.length === 168, `Expected 168 bilingual review pairs, got ${review.length}`);

const outDir = resolve(process.cwd(), "artifacts/api-server/dist/quant-v4/num-cp002-localization");
mkdirSync(outDir, { recursive: true });
const reviewPath = resolve(outDir, "num-cp002-hi-pa-review.json");
writeFileSync(reviewPath, JSON.stringify({
  status: "NUM_CP002_MULTILINGUAL_IMPLEMENTATION_FROZEN",
  qlCount: NUM_CP002_PERMANENT_QL_IDS.length,
  locales,
  generated,
  replayChecks,
  parityChecks,
  optionChecks,
  lifecycleChecks,
  englishLeakChecks,
  reviewPairCount: review.length,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  samples: review,
}, null, 2));

console.log(JSON.stringify({
  status: "PASS_NUM_CP002_HI_PA_LOCALIZATION",
  qlCount: NUM_CP002_PERMANENT_QL_IDS.length,
  generated,
  replayChecks,
  parityChecks,
  optionChecks,
  lifecycleChecks,
  scriptChecks,
  englishLeakChecks,
  reviewPairCount: review.length,
  reviewPath,
}, null, 2));
