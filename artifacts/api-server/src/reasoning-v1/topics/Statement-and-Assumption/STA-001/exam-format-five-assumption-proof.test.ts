import { STA_BANK_FIFTH_ASSUMPTION_OVERLAYS } from "./exam-format-bank-fifth-assumption.ts";
import {
  generateStaBank5x5Question,
  getStaBank5x5EligibleScenarioCount,
} from "./exam-format-extension-v2.ts";
import type { StaExamLocale } from "./exam-format-extension.ts";
import type { StaQlId } from "./types.ts";

const locales: readonly StaExamLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const casesPerLocale = Number(process.env.STA_EXAM_FORMAT_FIVE_CASES_PER_LOCALE ?? "2048");
if (!Number.isInteger(casesPerLocale) || casesPerLocale < 256) throw new Error("STA_EXAM_FORMAT_FIVE_CASES_PER_LOCALE must be an integer >= 256");

const expectedScenarios = Object.keys(STA_BANK_FIFTH_ASSUMPTION_OVERLAYS).sort();
if (expectedScenarios.length !== 8) throw new Error(`Expected 8 fifth-assumption overlays, found ${expectedScenarios.length}`);
if (getStaBank5x5EligibleScenarioCount() !== 8) throw new Error(`BANK_5X5 must expose exactly 8 audited banking scenarios`);

const reachedByLocale = new Map<StaExamLocale, Set<string>>(locales.map((locale) => [locale, new Set<string>()]));
const answerPositions = [0, 0, 0, 0, 0];
let implicitV = 0;
let nonImplicitV = 0;
const vClassificationsByQl = new Map<StaQlId, Set<string>>();
let generated = 0;

for (const locale of locales) {
  for (let index = 0; index < casesPerLocale; index += 1) {
    const seed = `sta-bank5-proof:${locale}:${index}`;
    const question = generateStaBank5x5Question(seed, locale);
    const replay = generateStaBank5x5Question(seed, locale);
    if (JSON.stringify(question) !== JSON.stringify(replay)) throw new Error(`${seed}: BANK_5X5 replay is not deterministic`);
    if (question.presentationProfile !== "BANK_5X5" || question.sourceProfile !== "BANKING") throw new Error(`${seed}: profile/source mismatch`);
    if (question.candidateCount !== 5 || question.candidates.length !== 5) throw new Error(`${seed}: expected assumptions I-V`);
    if (question.optionCount !== 5 || question.options.length !== 5) throw new Error(`${seed}: expected five coded options`);
    if (question.candidates.map((candidate) => candidate.label).join(",") !== "I,II,III,IV,V") throw new Error(`${seed}: assumption labels are not I-V`);
    const fifth = question.candidates[4]!;
    if (fifth.candidateId !== "FMT-C5") throw new Error(`${seed}: fifth overlay identity missing`);
    const vImplicit = fifth.oracle.classification === "IMPLICIT";
    if (vImplicit !== question.answerSet.includes(4)) throw new Error(`${seed}: V classification and answer set disagree`);
    if (vImplicit) implicitV += 1;
    else nonImplicitV += 1;
    const perQl = vClassificationsByQl.get(question.qlId) ?? new Set<string>();
    perQl.add(fifth.oracle.classification);
    vClassificationsByQl.set(question.qlId, perQl);
    reachedByLocale.get(locale)!.add(question.scenarioId);
    answerPositions[question.answerIndex] = (answerPositions[question.answerIndex] ?? 0) + 1;
    if (question.options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${seed}: unique correct option failed`);
    if (question.lifecycle.questionStudioDiscoverable || question.lifecycle.questionBankWritable || question.lifecycle.testEligible || question.lifecycle.publiclyPublishable) {
      throw new Error(`${seed}: downstream product lock opened`);
    }
    generated += 1;
  }
}

for (const locale of locales) {
  const reached = [...reachedByLocale.get(locale)!].sort();
  if (JSON.stringify(reached) !== JSON.stringify(expectedScenarios)) {
    throw new Error(`${locale}: BANK_5X5 scenario coverage mismatch; reached ${reached.join(", ")}`);
  }
}

for (const qlId of ["STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004"] as const) {
  const classes = vClassificationsByQl.get(qlId);
  if (!classes?.has("IMPLICIT") || !classes.has("NOT_IMPLICIT")) {
    throw new Error(`${qlId}: assumption V must be genuinely correct in one audited scenario and genuinely incorrect in another`);
  }
}

if (implicitV === 0 || nonImplicitV === 0) throw new Error(`BANK_5X5 failed to exercise both V-correct and V-incorrect outcomes`);
if (answerPositions.some((count) => count === 0)) throw new Error(`BANK_5X5 failed to exercise all five answer positions: ${answerPositions.join("/")}`);
const total = answerPositions.reduce((sum, count) => sum + count, 0);
if (Math.max(...answerPositions) / total > 0.28) throw new Error(`BANK_5X5 answer-position concentration too high: ${answerPositions.join("/")}`);

console.log("PASS_STA_001_BANK_5X5_GENUINE_FIVE_ASSUMPTION_FORMAT");
console.log("generated questions", generated);
console.log("audited banking scenarios", expectedScenarios.length);
console.log("V implicit / not implicit", implicitV, "/", nonImplicitV);
console.log("answer positions", answerPositions.join("/"));
console.log("candidate counts 5");
console.log("option counts 5");
console.log("Question Studio false");
