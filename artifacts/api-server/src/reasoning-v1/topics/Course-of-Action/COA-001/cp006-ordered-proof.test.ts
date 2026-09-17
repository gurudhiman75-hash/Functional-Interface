import { COA_CP001_ENGLISH_REVIEW_V2 } from "./cp001-editorial-v2.ts";
import { COA_CP002_ENGLISH_REVIEW_V2 } from "./cp002-editorial-v2.ts";
import { COA_CP003_ENGLISH_REVIEW_V2 } from "./cp003-editorial-v2.ts";
import { COA_CP004_ENGLISH_REVIEW_V2 } from "./cp004-editorial-v2.ts";
import {
  COA_CP006_EDITORIAL_V2_PATCHED_ACTION_IDS,
  COA_CP006_ENGLISH_REVIEW_V2,
} from "./cp006-editorial-v2.ts";
import { generateCoaCp006Question } from "./cp006-generator.ts";
import {
  COA_CP006_OWNED_QL_IDS,
  COA_CURRENT_ENGLISH_AUTHORITIES,
  coaEnglishAuthoritiesForQl,
} from "./english-authorities.ts";
import {
  answerClassForCoaActions,
  assertCoaActionAuthorityConsistent,
} from "./action-validity-model.ts";
import type { CoaAnswerClass } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const protectedAuthorities = [
  ...COA_CP001_ENGLISH_REVIEW_V2,
  ...COA_CP002_ENGLISH_REVIEW_V2,
  ...COA_CP003_ENGLISH_REVIEW_V2,
  ...COA_CP004_ENGLISH_REVIEW_V2,
];

assert(COA_CP006_ENGLISH_REVIEW_V2.length === 12, "CP006 must add exactly 12 ordered-response scenarios");
assert(COA_CP006_EDITORIAL_V2_PATCHED_ACTION_IDS.length >= 6, "CP006 Editorial V2 did not harden enough near-miss actions");
assert(COA_CP006_OWNED_QL_IDS.length === 1 && COA_CP006_OWNED_QL_IDS[0] === "COA-QL-008", "CP006 must own only QL008");

const currentIds = new Set(COA_CURRENT_ENGLISH_AUTHORITIES.map((entry) => entry.id));
for (const scenario of protectedAuthorities) {
  assert(currentIds.has(scenario.id), `${scenario.id}: a prior checkpoint authority disappeared from the current pool`);
}

const protectedIds = new Set(protectedAuthorities.map((entry) => entry.id));
const expansionIds = new Set<string>();
const reasons = new Set<string>();
let wrongOrderActions = 0;
let validOrderedActions = 0;
let wrongTimingActions = 0;

for (const scenario of COA_CP006_ENGLISH_REVIEW_V2) {
  assert(scenario.qlId === "COA-QL-008", `${scenario.id}: CP006 may expand only QL008`);
  assert(!protectedIds.has(scenario.id), `${scenario.id}: CP006 must not overwrite a prior scenario`);
  assert(!expansionIds.has(scenario.id), `${scenario.id}: duplicate CP006 scenario id`);
  expansionIds.add(scenario.id);
  assert(scenario.statement.length >= 120, `${scenario.id}: ordered-response statement is too thin`);
  assert(!/\bassociated\b/i.test(scenario.statement), `${scenario.id}: machine-like 'associated' wording detected`);
  assert(scenario.actions.length === 2, `${scenario.id}: two course plans are required`);
  assert(scenario.actions.some((action) => action.sequenceFit !== "NOT_APPLICABLE"), `${scenario.id}: no sequence relation is encoded`);

  for (const action of scenario.actions) {
    assertCoaActionAuthorityConsistent(action);
    assert(action.text.length >= 90, `${action.id}: ordered action is too short to express a real sequence`);
    assert(action.explanation.length >= 90, `${action.id}: explanation is too thin`);
    assert(!/\bassociated\b/i.test(`${action.text} ${action.explanation}`), `${action.id}: machine-like wording detected`);
    action.reasonCodes.forEach((code) => reasons.add(code));
    if (action.sequenceFit === "WRONG_ORDER") wrongOrderActions += 1;
    if (action.sequenceFit === "VALID_STEP") validOrderedActions += 1;
    if (action.urgencyFit === "MISMATCHED") wrongTimingActions += 1;
  }

  assert(answerClassForCoaActions(scenario.actions) === scenario.expectedAnswerClass, `${scenario.id}: semantic answer drift`);
}

assert(wrongOrderActions >= 8, `QL008 needs more genuine wrong-order near misses (${wrongOrderActions})`);
assert(validOrderedActions >= 10, `QL008 needs more valid ordered plans (${validOrderedActions})`);
assert(wrongTimingActions >= 2, `QL008 needs explicit too-late sequence failures (${wrongTimingActions})`);
assert(reasons.has("ORDERED_RESPONSE"), "CP006 must explicitly use ORDERED_RESPONSE authority");
assert(reasons.has("CORRECT_ACTION_WRONG_SEQUENCE"), "CP006 must explicitly use wrong-sequence distractors");

const answerCounts = new Map<CoaAnswerClass, number>([
  ["ONLY_I", 0],
  ["ONLY_II", 0],
  ["BOTH", 0],
  ["NEITHER", 0],
]);
COA_CP006_ENGLISH_REVIEW_V2.forEach((entry) => answerCounts.set(entry.expectedAnswerClass, (answerCounts.get(entry.expectedAnswerClass) ?? 0) + 1));
for (const answerClass of ["ONLY_I", "ONLY_II", "BOTH", "NEITHER"] as const) {
  assert(answerCounts.get(answerClass) === 3, `CP006 answer class ${answerClass} must appear exactly three times`);
}

const domains = new Set(COA_CP006_ENGLISH_REVIEW_V2.map((entry) => entry.domain));
assert(domains.size >= 10, `CP006 domain spread is too narrow (${domains.size})`);
const difficulties = new Set(COA_CP006_ENGLISH_REVIEW_V2.map((entry) => entry.difficulty));
assert(difficulties.has("EASY") && difficulties.has("MEDIUM") && difficulties.has("HARD"), "CP006 must cover Easy/Medium/Hard");

const cp001Ql008Count = COA_CP001_ENGLISH_REVIEW_V2.filter((entry) => entry.qlId === "COA-QL-008").length;
const current = coaEnglishAuthoritiesForQl("COA-QL-008");
assert(current.length === cp001Ql008Count + 12, `QL008 current pool must be CP001 baseline + 12 CP006 scenarios (got ${current.length})`);

const seenAuthorities = new Set<string>();
const seenFingerprints = new Set<string>();
const seenInstructions = new Set<string>();
const seenAnswerClasses = new Set<CoaAnswerClass>();
const ordersByAuthority = new Map<string, Set<string>>();
const answerDistribution = new Map<CoaAnswerClass, number>();
const sampleSize = Math.max(256, current.length * 20);

for (let seed = 0; seed < sampleSize; seed += 1) {
  const question = generateCoaCp006Question({ qlId: "COA-QL-008", seed });
  const replay = generateCoaCp006Question({ qlId: "COA-QL-008", seed });
  assert(JSON.stringify(question) === JSON.stringify(replay), `${seed}: CP006 generation is not deterministic`);
  assert(question.answerOptions.length === 4, `${seed}: four answer choices are required`);
  assert(question.correctIndex >= 0 && question.correctIndex < 4, `${seed}: invalid answer index`);
  assert(question.explanation.length >= 190, `${seed}: generated explanation is too thin`);
  seenAuthorities.add(question.semanticAuthorityId);
  seenFingerprints.add(question.semanticFingerprint);
  seenInstructions.add(question.instruction);
  seenAnswerClasses.add(question.answerClass);
  answerDistribution.set(question.answerClass, (answerDistribution.get(question.answerClass) ?? 0) + 1);
  const order = question.courses.map((course) => course.semanticActionId).join(">");
  const orders = ordersByAuthority.get(question.semanticAuthorityId) ?? new Set<string>();
  orders.add(order);
  ordersByAuthority.set(question.semanticAuthorityId, orders);
}

assert(seenAuthorities.size === current.length, "Not every QL008 semantic authority is reachable");
assert(seenFingerprints.size === current.length * 2, "Both Course I/II orders must be reachable for every QL008 authority");
assert(seenInstructions.size === 4, "All four CP006 instruction surfaces must be reachable");
assert(seenAnswerClasses.size === 4, "CP006 generator must expose all four answer classes");
for (const [authorityId, orders] of ordersByAuthority) {
  assert(orders.size === 2, `${authorityId}: both action orders are not reachable`);
}
const topShare = Math.max(...answerDistribution.values()) / sampleSize;
assert(topShare <= 0.4, `CP006 answer concentration too high (${topShare.toFixed(3)})`);

console.log(JSON.stringify({
  chapter: "COA-001",
  checkpoint: "COA-CP-006",
  priorCheckpointScenariosPreserved: protectedAuthorities.length,
  cp006ExpansionScenarios: COA_CP006_ENGLISH_REVIEW_V2.length,
  ql008CurrentSemanticStates: current.length,
  ql008OrderedFingerprints: current.length * 2,
  answerBalance: Object.fromEntries(answerCounts),
  domainCount: domains.size,
  wrongOrderActions,
  validOrderedActions,
  wrongTimingActions,
  reasonCodeFamiliesObserved: reasons.size,
  editorialV2PatchedActions: COA_CP006_EDITORIAL_V2_PATCHED_ACTION_IDS.length,
  questionStudio: "CLOSED",
  learnerRelease: "LOCKED",
}, null, 2));
