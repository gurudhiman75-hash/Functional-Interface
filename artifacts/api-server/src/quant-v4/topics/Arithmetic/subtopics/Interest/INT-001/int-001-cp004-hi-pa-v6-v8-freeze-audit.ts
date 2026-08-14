import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP004_QL_IDS } from "./cp004-frequency-math";
import { generateIntCp004V6NativeEditorialV8Question } from "./cp004-localization-v6-native-editorial-v8";
import {
  generateIntCp004HiPaV6V8FrozenQuestion,
  INT_CP004_HI_PA_V6_V8_APPROVAL,
  INT_CP004_HI_PA_V6_V8_FREEZE_ID,
} from "./cp004-localization-v6-native-v8-frozen";
import type { IntCp004V6Locale } from "./cp004-localization-v6-types";

const fail = (message: string): never => { throw new Error(message); };
const stable = (value: unknown): string => JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);

function learnerProjection(q: ReturnType<typeof generateIntCp004V6NativeEditorialV8Question>): unknown {
  return {
    qlId: q.qlId, seed: q.seed, locale: q.locale, language: q.language,
    solveContract: q.solveContract, answerSemantic: q.answerSemantic, difficulty: q.difficulty,
    representation: q.representation, stemFamilyId: q.stemFamilyId, stem: q.stem,
    options: q.options, correctIndex: q.correctIndex, correctAnswer: q.correctAnswer,
    explanation: q.explanation, mathematicalState: q.mathematicalState,
    mathematicalFingerprint: q.mathematicalFingerprint, solution: q.solution, localization: q.localization,
  };
}

function frozenLearnerProjection(q: ReturnType<typeof generateIntCp004HiPaV6V8FrozenQuestion>): unknown {
  return {
    qlId: q.qlId, seed: q.seed, locale: q.locale, language: q.language,
    solveContract: q.solveContract, answerSemantic: q.answerSemantic, difficulty: q.difficulty,
    representation: q.representation, stemFamilyId: q.stemFamilyId, stem: q.stem,
    options: q.options, correctIndex: q.correctIndex, correctAnswer: q.correctAnswer,
    explanation: q.explanation, mathematicalState: q.mathematicalState,
    mathematicalFingerprint: q.mathematicalFingerprint, solution: q.solution, localization: q.localization,
  };
}

function outsideMath(text: string): string {
  return text.replace(/\\\([\s\S]*?\\\)/gu, "").replace(/\\\[[\s\S]*?\\\]/gu, "");
}

function assertDeepFrozen(value: unknown, seen = new WeakSet<object>()): number {
  if (typeof value !== "object" || value === null) return 0;
  const objectValue = value as object;
  if (seen.has(objectValue)) return 0;
  seen.add(objectValue);
  if (!Object.isFrozen(objectValue)) fail("Frozen runtime returned a mutable object.");
  let count = 1;
  for (const key of Reflect.ownKeys(objectValue)) count += assertDeepFrozen((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return count;
}

let frozenQuestions = 0;
let contentIdentityChecks = 0;
let mathematicalIdentityChecks = 0;
let lifecycleChecks = 0;
let frozenObjectChecks = 0;
let wrapperChecks = 0;
let decimalChecks = 0;
let termChecks = 0;
let approximationChecks = 0;
const localeCounts: Record<IntCp004V6Locale, number> = { "hi-IN": 0, "pa-IN": 0 };

for (const qlId of INT_CP004_QL_IDS) {
  for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
    const seed = `int-cp004-v8-freeze:${qlId}:${seedIndex}`;
    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const source = generateIntCp004V6NativeEditorialV8Question(qlId, seed, locale);
      const frozen = generateIntCp004HiPaV6V8FrozenQuestion(qlId, seed, locale);
      frozenQuestions += 1;
      localeCounts[locale] += 1;

      contentIdentityChecks += 1;
      if (stable(learnerProjection(source)) !== stable(frozenLearnerProjection(frozen))) fail(`${qlId}/${seed}/${locale}: freeze changed learner content.`);

      mathematicalIdentityChecks += 4;
      if (stable(source.mathematicalState) !== stable(frozen.mathematicalState)) fail(`${qlId}/${seed}/${locale}: mathematical state changed.`);
      if (stable(source.solution) !== stable(frozen.solution)) fail(`${qlId}/${seed}/${locale}: solution changed.`);
      if (source.mathematicalFingerprint !== frozen.mathematicalFingerprint) fail(`${qlId}/${seed}/${locale}: fingerprint changed.`);
      if (source.correctIndex !== frozen.correctIndex) fail(`${qlId}/${seed}/${locale}: answer ownership changed.`);

      lifecycleChecks += 12;
      if (frozen.freezeId !== INT_CP004_HI_PA_V6_V8_FREEZE_ID) fail(`${qlId}/${seed}/${locale}: wrong freeze ID.`);
      if (frozen.editorialStatus !== "MULTILINGUAL_FROZEN" || frozen.approvalStatus !== "APPROVED_MULTILINGUAL_FROZEN") fail(`${qlId}/${seed}/${locale}: freeze status missing.`);
      if (frozen.allocationStatus !== "INACTIVE_MULTILINGUAL_FROZEN" || !frozen.permanentIdentityFrozen || !frozen.learnerContentFrozen) fail(`${qlId}/${seed}/${locale}: immutable markers missing.`);
      if (frozen.lifecycle.maturity !== "MULTILINGUAL_FROZEN" || frozen.lifecycle.reviewStatus !== "APPROVED_MULTILINGUAL_FROZEN") fail(`${qlId}/${seed}/${locale}: lifecycle freeze missing.`);
      if (frozen.enabled || frozen.lifecycle.enabled) fail(`${qlId}/${seed}/${locale}: enabled.`);
      if (frozen.stagingStatus !== "NOT_STAGED" || frozen.lifecycle.stagingStatus !== "NOT_STAGED") fail(`${qlId}/${seed}/${locale}: staging opened.`);
      if (frozen.registrationStatus !== "NOT_REGISTERED" || frozen.lifecycle.registrationStatus !== "NOT_REGISTERED") fail(`${qlId}/${seed}/${locale}: registration opened.`);
      if (frozen.questionStudioDiscoverable || frozen.lifecycle.questionStudioDiscoverable) fail(`${qlId}/${seed}/${locale}: Question Studio opened.`);
      if (frozen.questionBankStatus !== "NOT_STORED" || frozen.lifecycle.questionBankStatus !== "NOT_STORED") fail(`${qlId}/${seed}/${locale}: Question Bank opened.`);
      if (frozen.testEligibility !== "INELIGIBLE" || frozen.lifecycle.testEligibility !== "INELIGIBLE") fail(`${qlId}/${seed}/${locale}: test gate opened.`);
      if (frozen.publiclyPublishable || frozen.lifecycle.publiclyPublishable) fail(`${qlId}/${seed}/${locale}: public gate opened.`);

      frozenObjectChecks += assertDeepFrozen(frozen);
      const visible = [frozen.stem, ...frozen.options.map((o) => o.text), frozen.correctAnswer, frozen.explanation.whatAsked, ...frozen.explanation.steps, frozen.explanation.finalAnswer, frozen.explanation.commonMistake];
      const joined = visible.join("\n");

      termChecks += 1;
      if (locale === "pa-IN" && /ਚੱਕਰਵੱਧੀ ਵਿਆਜ/u.test(joined)) fail(`${qlId}/${seed}: rejected Punjabi term survived freeze.`);
      if (/₹\s*[\d,]+\.00(?!\d)/u.test(joined)) fail(`${qlId}/${seed}/${locale}: whole-rupee .00 survived freeze.`);
      if (/\\frac\{\\%\}\{100\}/u.test(joined)) fail(`${qlId}/${seed}/${locale}: malformed percent fraction survived freeze.`);

      for (const text of visible) {
        for (const match of text.matchAll(/\d[\d,]*\.(\d+)/gu)) {
          decimalChecks += 1;
          if ((match[1] ?? "").length > 2) fail(`${qlId}/${seed}/${locale}: ugly decimal ${match[0]} survived freeze.`);
        }
      }
      for (const step of frozen.explanation.steps) {
        wrapperChecks += 1;
        if (step.includes("$")) fail(`${qlId}/${seed}/${locale}: dollar wrapper survived freeze.`);
        const outside = outsideMath(step);
        if (/[=×÷−^]/u.test(outside) || /\\(?:frac|dfrac|times|div)/u.test(outside)) fail(`${qlId}/${seed}/${locale}: raw math outside wrapper.`);
      }
      const approxWord = locale === "hi-IN" ? "लगभग" : "ਲਗਭਗ";
      if (source.explanation.finalAnswer.includes(approxWord)) {
        approximationChecks += 1;
        if (!frozen.explanation.finalAnswer.includes(approxWord) || !frozen.explanation.steps.some((step) => step.includes("\\approx"))) fail(`${qlId}/${seed}/${locale}: approximation semantics changed.`);
      }
    }
  }
}

if (frozenQuestions !== 3800 || localeCounts["hi-IN"] !== 1900 || localeCounts["pa-IN"] !== 1900) fail(`freeze count mismatch ${frozenQuestions}.`);
if (approximationChecks === 0) fail("approximation path not exercised by freeze audit.");

const mutationTarget = generateIntCp004HiPaV6V8FrozenQuestion("INT-QL-067", "int-cp004-v8-freeze-mutation", "pa-IN");
let rootMutationRejected = false;
let nestedMutationRejected = false;
try { (mutationTarget as { stem: string }).stem = "tampered"; } catch { rootMutationRejected = true; }
try { (mutationTarget.options[0] as { text: string }).text = "tampered"; } catch { nestedMutationRejected = true; }
if (!rootMutationRejected || !nestedMutationRejected) fail("Frozen mutation guards failed.");

const summary = {
  freezeId: INT_CP004_HI_PA_V6_V8_FREEZE_ID,
  approval: INT_CP004_HI_PA_V6_V8_APPROVAL,
  frozenQuestions,
  localeCounts,
  contentIdentityChecks,
  mathematicalIdentityChecks,
  lifecycleChecks,
  frozenObjectChecks,
  wrapperChecks,
  decimalChecks,
  termChecks,
  approximationChecks,
  mutationGuards: 2,
  lifecycle: {
    maturity: "MULTILINGUAL_FROZEN",
    reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-hi-pa-v6-v8-freeze");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(join(outputDirectory, "int-cp004-hi-pa-v6-v8-freeze-audit.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_HI_PA_V6_V8_FREEZE");
