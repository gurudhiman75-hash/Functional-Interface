import { INT_CP003_QL_IDS, type Rational } from "./cp003-exam-model";
import { generateIntCp003FinalLocalizedQuestionV3 } from "./cp003-localized-final-runtime-v3";
import { generateIntCp003HiPaV3FrozenQuestion, INT_CP003_HI_PA_V3_FREEZE_ID } from "./cp003-localized-v3-frozen";
import type { IntCp003LocalizedLocale } from "./cp003-localization-types";

const LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const satisfies readonly IntCp003LocalizedLocale[]);
const QUESTIONS_PER_QL = 100;

function sameRational(left: Rational, right: Rational): boolean {
  return left.numerator === right.numerator && left.denominator === right.denominator;
}
function assertDeepFrozen(value: unknown, seen = new WeakSet<object>()): number {
  if (typeof value !== "object" || value === null) return 0;
  const objectValue = value as object;
  if (seen.has(objectValue)) return 0;
  seen.add(objectValue);
  if (!Object.isFrozen(objectValue)) throw new Error("Freeze audit found a mutable object.");
  let checks = 1;
  for (const key of Reflect.ownKeys(objectValue)) checks += assertDeepFrozen((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return checks;
}
function assertLearnerIdentity(source: ReturnType<typeof generateIntCp003FinalLocalizedQuestionV3>, frozen: ReturnType<typeof generateIntCp003HiPaV3FrozenQuestion>, label: string): number {
  if (frozen.presentation.markdown !== source.presentation.markdown) throw new Error(`${label}: frozen presentation drift.`);
  if (frozen.correctAnswer !== source.correctAnswer || frozen.correctIndex !== source.correctIndex) throw new Error(`${label}: frozen answer drift.`);
  if (frozen.explanation.keyIdea !== source.explanation.keyIdea || JSON.stringify(frozen.explanation.steps) !== JSON.stringify(source.explanation.steps) || frozen.explanation.finalAnswer !== source.explanation.finalAnswer) throw new Error(`${label}: frozen explanation drift.`);
  if (frozen.options.length !== source.options.length) throw new Error(`${label}: frozen option count drift.`);
  frozen.options.forEach((option, index) => {
    const original = source.options[index]!;
    if (option.text !== original.text || !sameRational(option.value, original.value) || option.misconceptionId !== original.misconceptionId || option.studentFeedback !== original.studentFeedback || option.isCorrect !== original.isCorrect) throw new Error(`${label}: frozen option ${index} drift.`);
  });
  return 4 + frozen.options.length * 5;
}

let frozenQuestions = 0;
let learnerContentIdentityChecks = 0;
let mathematicalIdentityChecks = 0;
let lifecycleChecks = 0;
let deepFrozenObjectChecks = 0;
let terminologyChecks = 0;
let wrapperChecks = 0;
let decimalChecks = 0;

for (const qlId of INT_CP003_QL_IDS) {
  for (let index = 0; index < QUESTIONS_PER_QL; index += 1) {
    const seed = `int-cp003-hi-pa-v3-freeze:${qlId}:${index}`;
    for (const locale of LOCALES) {
      const source = generateIntCp003FinalLocalizedQuestionV3(qlId, seed, locale);
      const frozen = generateIntCp003HiPaV3FrozenQuestion(qlId, seed, locale);
      const label = `${qlId}/${seed}/${locale}`;
      frozenQuestions += 1;
      learnerContentIdentityChecks += assertLearnerIdentity(source, frozen, label);

      if (frozen.mathematicalFingerprint !== source.mathematicalFingerprint) throw new Error(`${label}: mathematical fingerprint drift.`);
      if (!sameRational(frozen.solution, source.solution)) throw new Error(`${label}: solution drift.`);
      if (frozen.options.some((option, optionIndex) => !sameRational(option.value, source.options[optionIndex]!.value))) throw new Error(`${label}: mathematical option drift.`);
      if (frozen.correctIndex !== source.correctIndex) throw new Error(`${label}: correct-index drift.`);
      mathematicalIdentityChecks += 4;

      if (frozen.freezeId !== INT_CP003_HI_PA_V3_FREEZE_ID || frozen.editorialStatus !== "MULTILINGUAL_FROZEN" || frozen.approvalStatus !== "APPROVED_MULTILINGUAL_FROZEN" || frozen.allocationStatus !== "INACTIVE_MULTILINGUAL_FROZEN" || !frozen.permanentIdentityFrozen || !frozen.learnerContentFrozen) throw new Error(`${label}: freeze metadata invalid.`);
      if (frozen.enabled || frozen.stagingStatus !== "NOT_STAGED" || frozen.registrationStatus !== "NOT_REGISTERED" || frozen.questionStudioDiscoverable || frozen.questionBankStatus !== "NOT_STORED" || frozen.testEligibility !== "INELIGIBLE" || frozen.publiclyPublishable) throw new Error(`${label}: source delivery gate opened.`);
      if (frozen.lifecycle.enabled || frozen.lifecycle.stagingStatus !== "NOT_STAGED" || frozen.lifecycle.registrationStatus !== "NOT_REGISTERED" || frozen.lifecycle.questionStudioDiscoverable || frozen.lifecycle.questionBankStatus !== "NOT_STORED" || frozen.lifecycle.testEligibility !== "INELIGIBLE" || frozen.lifecycle.publiclyPublishable) throw new Error(`${label}: frozen delivery gate opened.`);
      lifecycleChecks += 20;

      deepFrozenObjectChecks += assertDeepFrozen(frozen);
      const learnerText = [frozen.presentation.markdown, ...frozen.options.flatMap((option) => [option.text, option.studentFeedback]), frozen.explanation.keyIdea, ...frozen.explanation.steps, frozen.explanation.finalAnswer, ...(frozen.explanation.commonMistake ? [frozen.explanation.commonMistake] : [])].join("\n");
      if (/\$/u.test(learnerText)) throw new Error(`${label}: dollar delimiter in frozen content.`);
      if (/\d[\d,]*\.\d{3,}/u.test(learnerText)) throw new Error(`${label}: >2-place decimal in frozen content.`);
      if (/₹\s*\d[\d,]*\.00\b/u.test(learnerText)) throw new Error(`${label}: whole-rupee .00 in frozen content.`);
      if (/জ্ঞাত कीजिए|ज्ञात कीजिए|ਪਤਾ ਕਰੋ/gu.test(learnerText)) throw new Error(`${label}: command-style prompt in frozen content.`);
      if (locale === "pa-IN" && /ਚੱਕਰਵੱਧੀ ਵਿਆਜ/gu.test(learnerText)) throw new Error(`${label}: rejected Punjabi term in frozen content.`);
      if (/\\frac\{\d+\\frac\{/u.test(learnerText)) throw new Error(`${label}: nested mixed fraction in frozen content.`);
      wrapperChecks += frozen.explanation.steps.length + 1;
      decimalChecks += 1;
      terminologyChecks += 1;
    }
  }
}

const mutationProbe = generateIntCp003HiPaV3FrozenQuestion("INT-QL-053", "int-cp003-freeze-mutation-probe", "pa-IN");
let mutationGuards = 0;
try { (mutationProbe as unknown as { correctIndex: number }).correctIndex = 3; } catch { mutationGuards += 1; }
try { (mutationProbe.options as unknown as { text: string }[])[0]!.text = "MUTATED"; } catch { mutationGuards += 1; }
if (mutationGuards !== 2) throw new Error(`Expected 2/2 mutation guards, got ${mutationGuards}/2.`);
if (frozenQuestions !== 2800) throw new Error(`Expected 2,800 frozen questions, got ${frozenQuestions}.`);

console.log(JSON.stringify({
  status: "PASS_INT_CP003_HI_PA_V3_FREEZE",
  freezeId: INT_CP003_HI_PA_V3_FREEZE_ID,
  frozenQuestions,
  hindi: 1400,
  punjabi: 1400,
  learnerContentIdentityChecks,
  mathematicalIdentityChecks,
  lifecycleChecks,
  deepFrozenObjectChecks,
  terminologyChecks,
  wrapperChecks,
  decimalChecks,
  mutationGuards: `${mutationGuards}/2`,
}, null, 2));
