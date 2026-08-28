import { exactKey, exactToNumber } from "../foundation/exact";
import { toDegrees } from "../foundation/angle";
import { TRG_001_AUTHORITY_ALIGNED_IDS, authorityFamilyForTrg001Ql } from "./production-authority-runtime";
import {
  TRG_001_ORIENTATION_DIVERSITY_IDS,
  generateAllDiversityRemediatedTrg001Questions,
  generateDiversityRemediatedTrg001Question,
} from "./production-diversity-remediated-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function answerKey(answer: any) {
  if (answer.kind === "TEXT") return `T:${answer.value}`;
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  const degrees = toDegrees(answer.value);
  return `A:${degrees.numerator}/${degrees.denominator}`;
}

function normalizeStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/[θαx]/g, "v")
    .replace(/\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?/g, "#")
    .replace(/\s+/g, " ")
    .trim();
}

function semanticStateFingerprint(state: Record<string, unknown> | undefined) {
  if (!state) return "NO_STATE";
  const entries = Object.entries(state)
    .filter(([key]) => !/variant|wording|seed/i.test(key))
    .sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify(entries);
}

const intentionallySingleForm = new Set([
  "TRG-001-QL-036",
  "TRG-001-QL-037",
  "TRG-001-QL-042",
  "TRG-001-QL-043",
  "TRG-001-QL-044",
  "TRG-001-QL-047",
  "TRG-001-QL-096",
  "TRG-001-QL-117",
  "TRG-001-QL-118",
  "TRG-001-QL-130",
  "TRG-001-QL-133",
  "TRG-001-QL-143",
]);
assert(intentionallySingleForm.size === 12, "Intentional single-form exception budget changed.");

const canonicalSeeds = Array.from({ length: 24 }, (_, i) => `trg-diversity-canonical-${String(i + 1).padStart(2, "0")}`);
const normalizedByQl = new Map<string, Set<string>>();
const statesByQl = new Map<string, Set<string>>();
const orientationByQl = new Map<string, Set<string>>();
let canonicalCases = 0;

for (const qlId of TRG_001_AUTHORITY_ALIGNED_IDS) {
  const normalized = new Set<string>();
  const states = new Set<string>();
  const orientations = new Set<string>();

  for (const seed of canonicalSeeds) {
    const q = generateDiversityRemediatedTrg001Question(qlId, seed);
    assert(q.qlId === qlId, `${qlId} lost permanent ID.`);
    assert(q.authorityAlignment?.family === authorityFamilyForTrg001Ql(qlId), `${qlId} lost locked authority family.`);
    assert(q.validation?.valid === true && q.verification?.valid === true, `${qlId} failed validation/verification for ${seed}.`);
    assert(q.options.length === 4 && q.options.filter((o: any) => o.isCorrect).length === 1, `${qlId} option cardinality failed.`);
    assert(new Set(q.options.map((o: any) => answerKey(o.value))).size === 4, `${qlId} has mathematically equivalent options.`);
    assert(q.options[q.correctIndex]?.isCorrect === true, `${qlId} correctIndex failed.`);
    const floor = q.difficulty === "Hard" ? 3 : q.difficulty === "Medium" ? 2 : 1;
    assert(q.explanation.steps.length >= floor, `${qlId} explanation depth is below ${q.difficulty} floor.`);
    assert(q.reviewStatus === "UNREVIEWED" && q.aiEditorialStatus === "PENDING" && q.humanReviewStatus === "PENDING", `${qlId} review lock changed prematurely.`);
    assert(q.questionBankStatus === "NOT_STORED" && q.testEligibility === "INELIGIBLE" && !q.publiclyPublishable && !q.questionStudioDiscoverable, `${qlId} activation lock failed.`);

    normalized.add(normalizeStem(q.stem));
    states.add(semanticStateFingerprint(q.canonicalState));
    if (q.canonicalState?.orientation) orientations.add(String(q.canonicalState.orientation));
    canonicalCases += 1;
  }

  normalizedByQl.set(qlId, normalized);
  statesByQl.set(qlId, states);
  orientationByQl.set(qlId, orientations);
}

// Every orientation-sensitive permanent QL must now cover both sides of 45 degrees.
for (const qlId of TRG_001_ORIENTATION_DIVERSITY_IDS) {
  const orientations = orientationByQl.get(qlId) ?? new Set<string>();
  assert(orientations.has("TAN_LT_ONE") && orientations.has("TAN_GT_ONE"), `${qlId} does not cover both tanθ<1 and tanθ>1 states.`);
  assert((normalizedByQl.get(qlId)?.size ?? 0) >= 2, `${qlId} has number-only wording diversity; two normalized stem structures are required.`);
  assert((statesByQl.get(qlId)?.size ?? 0) >= 2, `${qlId} lacks genuine mathematical-state diversity.`);

  for (const seed of canonicalSeeds) {
    const q = generateDiversityRemediatedTrg001Question(qlId, seed);
    const o = Number(q.canonicalState.o);
    const a = Number(q.canonicalState.a);
    if (q.canonicalState.orientation === "TAN_LT_ONE") assert(o < a, `${qlId} labels TAN_LT_ONE with o>=a.`);
    if (q.canonicalState.orientation === "TAN_GT_ONE") assert(o > a, `${qlId} labels TAN_GT_ONE with o<=a.`);
  }
}

// Chapter-wide diversity gate: parameterized QLs need either a second normalized stem structure
// or a second semantic mathematical state. Only 12 deliberately canonical single-form roles may opt out.
let generativelyDiverse = 0;
const nonDiverse: string[] = [];
for (const qlId of TRG_001_AUTHORITY_ALIGNED_IDS) {
  const normalizedCount = normalizedByQl.get(qlId)?.size ?? 0;
  const stateCount = statesByQl.get(qlId)?.size ?? 0;
  if (normalizedCount >= 2 || stateCount >= 2) generativelyDiverse += 1;
  else if (!intentionallySingleForm.has(qlId)) nonDiverse.push(qlId);
}
assert(nonDiverse.length === 0, `Unexpected single-form QLs outside the explicit exception budget: ${nonDiverse.join(", ")}`);
assert(generativelyDiverse >= 132, `At least 132/144 QLs must have structural or semantic-state diversity; found ${generativelyDiverse}.`);

// Orientation-sensitive sign checks: these roles must visibly react when the acute angle crosses 45 degrees.
for (const seed of canonicalSeeds) {
  const q23 = generateDiversityRemediatedTrg001Question("TRG-001-QL-023", seed);
  if (q23.canonicalState.orientation === "TAN_GT_ONE") assert(q23.answer === "sin θ > cos θ", "QL-023 failed tan>1 comparison semantics.");
  else assert(q23.answer === "cos θ > sin θ", "QL-023 failed tan<1 comparison semantics.");

  const q100 = generateDiversityRemediatedTrg001Question("TRG-001-QL-100", seed);
  const sign100 = Number(q100.canonicalState.o) > Number(q100.canonicalState.a) ? 1 : -1;
  assert(Math.sign(exactToNumber(q100.exactAnswer.value)) === sign100, "QL-100 square-difference sign no longer follows orientation.");

  const q132 = generateDiversityRemediatedTrg001Question("TRG-001-QL-132", seed);
  const sign132 = Number(q132.canonicalState.a) > Number(q132.canonicalState.o) ? 1 : -1;
  assert(Math.sign(exactToNumber(q132.exactAnswer.value)) === sign132, "QL-132 cos2θ sign no longer follows orientation.");
}

const sweepSeeds = Array.from({ length: 50 }, (_, i) => `trg-diversity-sweep-${String(i + 1).padStart(2, "0")}`);
let sweepCases = 0;
for (const seed of sweepSeeds) {
  const questions = generateAllDiversityRemediatedTrg001Questions(seed);
  assert(questions.length === 144, `${seed} did not generate all 144 QLs.`);
  for (const q of questions) {
    assert(q.validation?.valid === true && q.verification?.valid === true, `${q.qlId} failed sweep validation for ${seed}.`);
    assert(q.options.length === 4 && new Set(q.options.map((o: any) => answerKey(o.value))).size === 4, `${q.qlId} option integrity failed for ${seed}.`);
    assert(q.options[q.correctIndex]?.isCorrect === true, `${q.qlId} correctIndex failed for ${seed}.`);
    assert(q.questionBankStatus === "NOT_STORED" && q.testEligibility === "INELIGIBLE" && !q.publiclyPublishable && !q.questionStudioDiscoverable, `${q.qlId} activation lock failed for ${seed}.`);
    sweepCases += 1;
  }
}

console.log(`TRG-001 diversity gate target: 144 QLs, ${canonicalCases} canonical cases, ${sweepCases} sweep cases, ${TRG_001_ORIENTATION_DIVERSITY_IDS.length} orientation-sensitive QLs and >=132 generatively diverse QLs.`);
