import { COA_CP001_ENGLISH_REVIEW_V2 } from "./cp001-editorial-v2.ts";
import { COA_CP002_ENGLISH_REVIEW_V2 } from "./cp002-editorial-v2.ts";
import { COA_CP003_ENGLISH_REVIEW_V2 } from "./cp003-editorial-v2.ts";
import {
  COA_CP004_EDITORIAL_V2_PATCHED_ACTION_IDS,
  COA_CP004_ENGLISH_REVIEW_V2,
} from "./cp004-editorial-v2.ts";
import { generateCoaCp004Question } from "./cp004-generator.ts";
import {
  COA_CP004_OWNED_QL_IDS,
  COA_CURRENT_ENGLISH_AUTHORITIES,
  coaEnglishAuthoritiesForQl,
  type CoaCp004OwnedQlId,
} from "./english-authorities.ts";
import {
  answerClassForCoaActions,
  assertCoaActionAuthorityConsistent,
} from "./action-validity-model.ts";
import type { CoaAnswerClass } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(COA_CP001_ENGLISH_REVIEW_V2.length === 24, "CP004 must preserve the CP001 V2 baseline");
assert(COA_CP002_ENGLISH_REVIEW_V2.length === 24, "CP004 must preserve the CP002 V2 baseline");
assert(COA_CP003_ENGLISH_REVIEW_V2.length === 24, "CP004 must preserve the CP003 V2 review authority");
assert(COA_CP004_ENGLISH_REVIEW_V2.length === 24, "CP004 must add exactly 24 reviewed scenarios");
assert(COA_CP004_EDITORIAL_V2_PATCHED_ACTION_IDS.length >= 8, "CP004 Editorial V2 did not harden enough distractors");

const protectedAuthorities = [
  ...COA_CP001_ENGLISH_REVIEW_V2,
  ...COA_CP002_ENGLISH_REVIEW_V2,
  ...COA_CP003_ENGLISH_REVIEW_V2,
];
const currentIds = new Set(COA_CURRENT_ENGLISH_AUTHORITIES.map((entry) => entry.id));
for (const scenario of protectedAuthorities) {
  assert(currentIds.has(scenario.id), `${scenario.id}: a prior checkpoint authority disappeared from the current pool`);
}

const protectedIds = new Set(protectedAuthorities.map((entry) => entry.id));
const expansionIds = new Set<string>();
const globalReasons = new Set<string>();
let ql005ConstraintViolations = 0;
let ql006ExcessiveRejections = 0;

for (const scenario of COA_CP004_ENGLISH_REVIEW_V2) {
  assert(!protectedIds.has(scenario.id), `${scenario.id}: CP004 must not overwrite a prior checkpoint scenario id`);
  assert(!expansionIds.has(scenario.id), `${scenario.id}: duplicate CP004 scenario id`);
  expansionIds.add(scenario.id);
  assert(COA_CP004_OWNED_QL_IDS.includes(scenario.qlId as CoaCp004OwnedQlId), `${scenario.id}: CP004 may expand only QL005/QL006`);
  assert(scenario.statement.length >= 105, `${scenario.id}: statement is too thin for CP004 exam calibration`);
  assert(!/\bassociated\b/i.test(scenario.statement), `${scenario.id}: machine-like 'associated' wording detected`);
  assert(scenario.actions.length === 2, `${scenario.id}: CP004 paired calibration requires two courses`);

  for (const action of scenario.actions) {
    assertCoaActionAuthorityConsistent(action);
    assert(action.text.length >= 75, `${action.id}: action surface is too short/trivial`);
    assert(action.explanation.length >= 80, `${action.id}: explanation is too thin`);
    assert(!/\bassociated\b/i.test(`${action.text} ${action.explanation}`), `${action.id}: machine-like 'associated' wording detected`);
    assert(!/foreign affairs|private sports club|repaint the administrative office|general advertising campaign/i.test(action.text), `${action.id}: stale toy-distractor wording detected`);
    action.reasonCodes.forEach((code) => globalReasons.add(code));

    if (scenario.qlId === "COA-QL-005" && action.expectedVerdict === "DOES_NOT_FOLLOW" && action.constraintFit === "VIOLATES") {
      ql005ConstraintViolations += 1;
    }
    if (scenario.qlId === "COA-QL-006" && action.expectedVerdict === "DOES_NOT_FOLLOW" && action.proportionality === "EXCESSIVE") {
      ql006ExcessiveRejections += 1;
    }
  }

  assert(answerClassForCoaActions(scenario.actions) === scenario.expectedAnswerClass, `${scenario.id}: answer class is inconsistent with semantic authority`);
}

assert(ql005ConstraintViolations >= 10, `QL005 is not sufficiently driven by explicit constraint violations (${ql005ConstraintViolations})`);
assert(ql006ExcessiveRejections >= 10, `QL006 is not sufficiently driven by excessive-response discrimination (${ql006ExcessiveRejections})`);

for (const qlId of COA_CP004_OWNED_QL_IDS) {
  const expansion = COA_CP004_ENGLISH_REVIEW_V2.filter((entry) => entry.qlId === qlId);
  assert(expansion.length === 12, `${qlId}: CP004 must add exactly 12 semantic states`);

  const answerCounts = new Map<CoaAnswerClass, number>([
    ["ONLY_I", 0],
    ["ONLY_II", 0],
    ["BOTH", 0],
    ["NEITHER", 0],
  ]);
  expansion.forEach((entry) => answerCounts.set(entry.expectedAnswerClass, (answerCounts.get(entry.expectedAnswerClass) ?? 0) + 1));
  for (const answerClass of ["ONLY_I", "ONLY_II", "BOTH", "NEITHER"] as const) {
    assert(answerCounts.get(answerClass) === 3, `${qlId}: answer class ${answerClass} must appear exactly three times`);
  }

  const domains = new Set(expansion.map((entry) => entry.domain));
  assert(domains.size >= 9, `${qlId}: expansion domain spread is too narrow (${domains.size})`);
  const difficulties = new Set(expansion.map((entry) => entry.difficulty));
  assert(difficulties.has("EASY") && difficulties.has("MEDIUM") && difficulties.has("HARD"), `${qlId}: Easy/Medium/Hard must all be represented`);

  const cp001BaselineCount = COA_CP001_ENGLISH_REVIEW_V2.filter((entry) => entry.qlId === qlId).length;
  const current = coaEnglishAuthoritiesForQl(qlId);
  assert(current.length === cp001BaselineCount + 12, `${qlId}: current pool must be CP001 baseline + 12 CP004 scenarios`);

  const seenAuthorities = new Set<string>();
  const seenFingerprints = new Set<string>();
  const seenInstructions = new Set<string>();
  const seenAnswerClasses = new Set<CoaAnswerClass>();
  const orderByAuthority = new Map<string, Set<string>>();
  const answerDistribution = new Map<CoaAnswerClass, number>();
  const sampleSize = Math.max(240, current.length * 16);

  for (let seed = 0; seed < sampleSize; seed += 1) {
    const question = generateCoaCp004Question({ qlId, seed });
    const replay = generateCoaCp004Question({ qlId, seed });
    assert(JSON.stringify(question) === JSON.stringify(replay), `${qlId}/${seed}: generation is not deterministic`);
    assert(question.answerOptions.length === 4, `${qlId}/${seed}: four answer choices are required`);
    assert(question.correctIndex >= 0 && question.correctIndex < 4, `${qlId}/${seed}: invalid correct answer index`);
    assert(question.explanation.length >= 180, `${qlId}/${seed}: generated explanation is too thin`);

    seenAuthorities.add(question.semanticAuthorityId);
    seenFingerprints.add(question.semanticFingerprint);
    seenInstructions.add(question.instruction);
    seenAnswerClasses.add(question.answerClass);
    answerDistribution.set(question.answerClass, (answerDistribution.get(question.answerClass) ?? 0) + 1);
    const order = question.courses.map((course) => course.semanticActionId).join(">");
    const orders = orderByAuthority.get(question.semanticAuthorityId) ?? new Set<string>();
    orders.add(order);
    orderByAuthority.set(question.semanticAuthorityId, orders);
  }

  assert(seenAuthorities.size === current.length, `${qlId}: not every current semantic authority is reachable`);
  assert(seenFingerprints.size === current.length * 2, `${qlId}: both action orders must be reachable for every authority`);
  assert(seenInstructions.size === 4, `${qlId}: all four exam-instruction surfaces must be reachable`);
  assert(seenAnswerClasses.size === 4, `${qlId}: generator must expose all four answer classes`);
  for (const [authorityId, orders] of orderByAuthority) {
    assert(orders.size === 2, `${qlId}/${authorityId}: both action orders are not reachable`);
  }
  const topShare = Math.max(...answerDistribution.values()) / sampleSize;
  assert(topShare <= 0.4, `${qlId}: answer-class concentration too high (${topShare.toFixed(3)})`);
}

assert(globalReasons.size >= 8, `CP004 reasoning/distractor taxonomy is too thin (${globalReasons.size})`);

console.log(JSON.stringify({
  chapter: "COA-001",
  checkpoint: "COA-CP-004",
  priorCheckpointScenariosPreserved: protectedAuthorities.length,
  cp004ExpansionScenarios: COA_CP004_ENGLISH_REVIEW_V2.length,
  currentEnglishAuthorityScenarios: COA_CURRENT_ENGLISH_AUTHORITIES.length,
  ownedQls: COA_CP004_OWNED_QL_IDS,
  ql005ConstraintViolationRejections: ql005ConstraintViolations,
  ql006ExcessiveResponseRejections: ql006ExcessiveRejections,
  reasonCodeFamiliesObserved: globalReasons.size,
  editorialV2PatchedActions: COA_CP004_EDITORIAL_V2_PATCHED_ACTION_IDS.length,
  questionStudio: "CLOSED",
  learnerRelease: "LOCKED",
}, null, 2));
