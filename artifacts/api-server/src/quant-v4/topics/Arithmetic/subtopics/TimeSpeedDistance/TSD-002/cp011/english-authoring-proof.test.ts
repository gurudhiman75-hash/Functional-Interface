import { verifyTsdCp011 } from "./executable-verifier";
import { TSD_CP011_ENGLISH_REVIEW } from "./english-review-final";
import { TSD_CP011_PROVISIONAL_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-011 English authoring proof failed: ${message}`);
}

function stemShape(stem: string) {
  return stem
    .replace(/\d+(?:\s+\d+\/\d+|\/\d+)?/g, "#")
    .replace(/\s+/g, " ")
    .trim();
}

assert(TSD_CP011_ENGLISH_REVIEW.length === 168, "expected 168 English review questions");
assert(new Set(TSD_CP011_ENGLISH_REVIEW.map((x) => x.familyId)).size === 168, "family IDs must be unique");
assert(new Set(TSD_CP011_ENGLISH_REVIEW.map((x) => x.stem)).size === 168, "rendered stems must be unique");

for (const qlId of TSD_CP011_PROVISIONAL_QL_IDS) {
  const questions = TSD_CP011_ENGLISH_REVIEW.filter((x) => x.qlId === qlId);
  assert(questions.length === 24, `${qlId}: expected 24 reviewed families`);
  assert(new Set(questions.map((x) => x.input.target)).size >= 2, `${qlId}: target diversity is too thin`);
  assert(new Set(questions.map((x) => stemShape(x.stem))).size >= 3, `${qlId}: normalized stem-shape variety is too thin`);
  assert(questions.filter((x) => x.difficulty === "EASY").length === 2, `${qlId}: expected two calibrated EASY families`);
  assert(questions.filter((x) => x.difficulty === "MEDIUM").length === 22, `${qlId}: expected twenty-two calibrated MEDIUM families`);

  for (const target of new Set(questions.map((x) => x.input.target))) {
    assert(questions.filter((x) => x.input.target === target).length >= 4, `${qlId}/${target}: target evidence is too thin`);
  }
}

const EXPLANATION_EVIDENCE = /(rate|speed|time|distance|length|step|escalator|surface|walk|wheel|revolution|circumference|radius|diameter|rpm|minute|ratio)/i;
for (const question of TSD_CP011_ENGLISH_REVIEW) {
  assert(question.stem.length >= 75, `${question.familyId}: stem is too thin`);
  assert(question.explanation.steps.length === 2, `${question.familyId}: explanation should remain two concise steps`);
  assert(question.explanation.steps.every((step) => step.length >= 25), `${question.familyId}: explanation step is fragmentary`);
  assert(question.explanation.steps.every((step) => EXPLANATION_EVIDENCE.test(step)), `${question.familyId}: explanation step lacks problem-specific motion evidence`);
  assert(question.explanation.conclusion.startsWith("Answer:"), `${question.familyId}: conclusion missing answer`);
  assert(!/\{[A-Za-z0-9]+\}/.test(question.stem), `${question.familyId}: unresolved placeholder`);
  assert(!/(practice set|worksheet|survey|selection committee|report states|data collected)/i.test(question.stem), `${question.familyId}: synthetic non-paper prose detected`);
  assert(verifyTsdCp011(question.input, question.solution).accepted, `${question.familyId}: independent verifier rejected authored question`);
}

const ql125 = TSD_CP011_ENGLISH_REVIEW.filter((x) => x.qlId === "TSD-QL-125");
const ql126 = TSD_CP011_ENGLISH_REVIEW.filter((x) => x.qlId === "TSD-QL-126");
const ql127 = TSD_CP011_ENGLISH_REVIEW.filter((x) => x.qlId === "TSD-QL-127");
const ql128 = TSD_CP011_ENGLISH_REVIEW.filter((x) => x.qlId === "TSD-QL-128");
const ql129 = TSD_CP011_ENGLISH_REVIEW.filter((x) => x.qlId === "TSD-QL-129");
const ql130 = TSD_CP011_ENGLISH_REVIEW.filter((x) => x.qlId === "TSD-QL-130");
const ql131 = TSD_CP011_ENGLISH_REVIEW.filter((x) => x.qlId === "TSD-QL-131");

assert(ql125.every((x) => /(moving|surface|walkway|escalator)/i.test(x.stem)), "QL125: moving-surface ownership is not explicit");
assert(ql126.every((x) => /escalator/i.test(x.stem) && /steps/i.test(x.stem)), "QL126: stationary-step ownership is not explicit");
assert(ql127.every((x) => /(same|with|against|up|down)/i.test(x.stem)), "QL127: paired directional observations are not explicit");
assert(ql128.every((x) => /(stopped|stationary|standing|moving)/i.test(x.stem)), "QL128: alternate surface states are not explicit");
assert(ql129.every((x) => /wheel/i.test(x.stem) && /(revolution|circumference|radius|diameter)/i.test(x.stem)), "QL129: wheel-roll evidence is not explicit");
assert(ql130.every((x) => /wheel/i.test(x.stem) && /(rpm|revolutions per minute|circumference)/i.test(x.stem)), "QL130: wheel-rate evidence is not explicit");
assert(ql131.every((x) => /two wheels|wheel A/i.test(x.stem)), "QL131: two-wheel comparison ownership is not explicit");

console.log("TSD-CP-011 ENGLISH REVIEW AUTHORING PROOF: PASS");
console.log(JSON.stringify({
  questions: TSD_CP011_ENGLISH_REVIEW.length,
  qls: TSD_CP011_PROVISIONAL_QL_IDS.length,
  familiesPerQl: 24,
  uniqueStems: new Set(TSD_CP011_ENGLISH_REVIEW.map((x) => x.stem)).size,
  minimumNormalizedStemShapesPerQl: 3,
  targetEvidenceFloor: 4,
  difficultyPerQl: { easy: 2, medium: 22 },
  explanationStyle: "TWO_CONCISE_CUSTOM_STEPS_PLUS_CONCLUSION",
  explanationGuard: "SUBSTANTIVE_AND_PROBLEM_SPECIFIC",
}, null, 2));