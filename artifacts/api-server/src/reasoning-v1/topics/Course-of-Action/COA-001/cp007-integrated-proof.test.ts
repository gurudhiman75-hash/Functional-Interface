import { COA_CP001_ENGLISH_REVIEW_V2 } from "./cp001-editorial-v2.ts";
import { COA_CP002_ENGLISH_REVIEW_V2 } from "./cp002-editorial-v2.ts";
import { COA_CP003_ENGLISH_REVIEW_V2 } from "./cp003-editorial-v2.ts";
import { COA_CP004_ENGLISH_REVIEW_V2 } from "./cp004-editorial-v2.ts";
import { COA_CP006_ENGLISH_REVIEW_V2 } from "./cp006-editorial-v2.ts";
import {
  COA_CP007_EDITORIAL_V2_PATCHED_ACTION_IDS,
  COA_CP007_ENGLISH_REVIEW_V2,
} from "./cp007-editorial-v2.ts";
import { generateCoaCp007Question } from "./cp007-generator.ts";
import {
  COA_CP007_OWNED_QL_IDS,
  COA_CURRENT_ENGLISH_AUTHORITIES,
  coaEnglishAuthoritiesForQl,
} from "./english-authorities.ts";
import {
  answerClassForCoaActions,
  assertCoaActionAuthorityConsistent,
} from "./action-validity-model.ts";
import type { CoaActionAuthority, CoaAnswerClass } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function failingDimensionCount(action: CoaActionAuthority): number {
  let count = 0;
  if (action.relevance === "UNRELATED") count += 1;
  if (action.actionability !== "ACTIONABLE") count += 1;
  if (action.authorityFit === "OUTSIDE_SCOPE") count += 1;
  if (action.feasibility === "IMPOSSIBLE") count += 1;
  if (action.proportionality !== "PROPORTIONATE") count += 1;
  if (action.evidenceFit !== "SUPPORTED") count += 1;
  if (action.expectedUtility === "LOW" || action.expectedUtility === "HARMFUL") count += 1;
  if (action.urgencyFit === "MISMATCHED") count += 1;
  if (action.constraintFit === "VIOLATES") count += 1;
  if (action.sequenceFit === "WRONG_ORDER" || action.sequenceFit === "REDUNDANT_AFTER_PRIOR") count += 1;
  return count;
}

const protectedAuthorities = [
  ...COA_CP001_ENGLISH_REVIEW_V2,
  ...COA_CP002_ENGLISH_REVIEW_V2,
  ...COA_CP003_ENGLISH_REVIEW_V2,
  ...COA_CP004_ENGLISH_REVIEW_V2,
  ...COA_CP006_ENGLISH_REVIEW_V2,
];

assert(COA_CP007_ENGLISH_REVIEW_V2.length === 12, "CP007 must add exactly 12 integrated QL009 scenarios");
assert(COA_CP007_EDITORIAL_V2_PATCHED_ACTION_IDS.length >= 8, "CP007 Editorial V2 did not harden enough near-miss actions");
assert(COA_CP007_OWNED_QL_IDS.length === 1 && COA_CP007_OWNED_QL_IDS[0] === "COA-QL-009", "CP007 must own only QL009");

const currentIds = new Set(COA_CURRENT_ENGLISH_AUTHORITIES.map((entry) => entry.id));
for (const scenario of protectedAuthorities) {
  assert(currentIds.has(scenario.id), `${scenario.id}: a prior checkpoint authority disappeared from the current pool`);
}

const protectedIds = new Set(protectedAuthorities.map((entry) => entry.id));
const expansionIds = new Set<string>();
const globalReasons = new Set<string>();
let followingActionsWithThreePlusReasons = 0;
let rejectedActionsWithTwoPlusFailures = 0;
let evidenceFailures = 0;
let proportionalityFailures = 0;
let sequenceFailures = 0;
let constraintFailures = 0;
let urgencyFailures = 0;

for (const scenario of COA_CP007_ENGLISH_REVIEW_V2) {
  assert(scenario.qlId === "COA-QL-009", `${scenario.id}: CP007 may expand only QL009`);
  assert(!protectedIds.has(scenario.id), `${scenario.id}: CP007 must not overwrite prior authority`);
  assert(!expansionIds.has(scenario.id), `${scenario.id}: duplicate CP007 scenario id`);
  expansionIds.add(scenario.id);
  assert(scenario.statement.length >= 150, `${scenario.id}: integrated statement is too thin`);
  assert(!/\bassociated\b/i.test(scenario.statement), `${scenario.id}: machine-like 'associated' wording detected`);
  assert(scenario.actions.length === 2, `${scenario.id}: two course plans are required`);

  const scenarioReasons = new Set<string>();
  for (const action of scenario.actions) {
    assertCoaActionAuthorityConsistent(action);
    assert(action.text.length >= 105, `${action.id}: integrated action is too short`);
    assert(action.explanation.length >= 105, `${action.id}: explanation is too thin`);
    assert(!/\bassociated\b/i.test(`${action.text} ${action.explanation}`), `${action.id}: machine-like wording detected`);
    action.reasonCodes.forEach((code) => {
      globalReasons.add(code);
      scenarioReasons.add(code);
    });

    if (action.expectedVerdict === "FOLLOWS") {
      assert(action.reasonCodes.length >= 3, `${action.id}: a QL009 following action must integrate at least three authored reasoning signals`);
      followingActionsWithThreePlusReasons += 1;
    } else {
      const failures = failingDimensionCount(action);
      assert(failures >= 2, `${action.id}: a QL009 rejected action must fail at least two material semantic dimensions (got ${failures})`);
      rejectedActionsWithTwoPlusFailures += 1;
    }

    if (action.evidenceFit !== "SUPPORTED") evidenceFailures += 1;
    if (action.proportionality !== "PROPORTIONATE") proportionalityFailures += 1;
    if (action.sequenceFit === "WRONG_ORDER" || action.sequenceFit === "REDUNDANT_AFTER_PRIOR") sequenceFailures += 1;
    if (action.constraintFit === "VIOLATES") constraintFailures += 1;
    if (action.urgencyFit === "MISMATCHED") urgencyFailures += 1;
  }

  assert(scenarioReasons.size >= 4, `${scenario.id}: QL009 scenario does not integrate enough distinct reasoning families (${scenarioReasons.size})`);
  assert(answerClassForCoaActions(scenario.actions) === scenario.expectedAnswerClass, `${scenario.id}: semantic answer drift`);
}

assert(evidenceFailures >= 6, `CP007 needs stronger evidence-fit integration (${evidenceFailures})`);
assert(proportionalityFailures >= 6, `CP007 needs stronger proportionality integration (${proportionalityFailures})`);
assert(sequenceFailures >= 4, `CP007 needs stronger sequence integration (${sequenceFailures})`);
assert(constraintFailures >= 3, `CP007 needs stronger constraint integration (${constraintFailures})`);
assert(urgencyFailures >= 1, `CP007 needs at least one explicit timing interaction (${urgencyFailures})`);
assert(globalReasons.size >= 12, `CP007 reason-code diversity is too narrow (${globalReasons.size})`);

const answerCounts = new Map<CoaAnswerClass, number>([
  ["ONLY_I", 0],
  ["ONLY_II", 0],
  ["BOTH", 0],
  ["NEITHER", 0],
]);
COA_CP007_ENGLISH_REVIEW_V2.forEach((entry) => answerCounts.set(entry.expectedAnswerClass, (answerCounts.get(entry.expectedAnswerClass) ?? 0) + 1));
for (const answerClass of ["ONLY_I", "ONLY_II", "BOTH", "NEITHER"] as const) {
  assert(answerCounts.get(answerClass) === 3, `CP007 answer class ${answerClass} must appear exactly three times`);
}

const domains = new Set(COA_CP007_ENGLISH_REVIEW_V2.map((entry) => entry.domain));
assert(domains.size >= 10, `CP007 domain spread is too narrow (${domains.size})`);
const difficulties = new Set(COA_CP007_ENGLISH_REVIEW_V2.map((entry) => entry.difficulty));
assert(difficulties.has("EASY") && difficulties.has("MEDIUM") && difficulties.has("HARD"), "CP007 must cover Easy/Medium/Hard");

const cp001Ql009Count = COA_CP001_ENGLISH_REVIEW_V2.filter((entry) => entry.qlId === "COA-QL-009").length;
const current = coaEnglishAuthoritiesForQl("COA-QL-009");
assert(current.length === cp001Ql009Count + 12, `QL009 current pool must be CP001 baseline + 12 CP007 scenarios (got ${current.length})`);

const seenAuthorities = new Set<string>();
const seenFingerprints = new Set<string>();
const seenInstructions = new Set<string>();
const seenAnswerClasses = new Set<CoaAnswerClass>();
const ordersByAuthority = new Map<string, Set<string>>();
const answerDistribution = new Map<CoaAnswerClass, number>();
const sampleSize = Math.max(320, current.length * 24);

for (let seed = 0; seed < sampleSize; seed += 1) {
  const question = generateCoaCp007Question({ qlId: "COA-QL-009", seed });
  const replay = generateCoaCp007Question({ qlId: "COA-QL-009", seed });
  assert(JSON.stringify(question) === JSON.stringify(replay), `${seed}: CP007 generation is not deterministic`);
  assert(question.answerOptions.length === 4, `${seed}: four answer choices are required`);
  assert(question.correctIndex >= 0 && question.correctIndex < 4, `${seed}: invalid answer index`);
  assert(question.explanation.length >= 220, `${seed}: generated explanation is too thin for integrated reasoning`);
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

assert(seenAuthorities.size === current.length, "Not every QL009 semantic authority is reachable");
assert(seenFingerprints.size === current.length * 2, "Both Course I/II orders must be reachable for every QL009 authority");
assert(seenInstructions.size === 4, "All four CP007 instruction surfaces must be reachable");
assert(seenAnswerClasses.size === 4, "CP007 generator must expose all four answer classes");
for (const [authorityId, orders] of ordersByAuthority) {
  assert(orders.size === 2, `${authorityId}: both action orders are not reachable`);
}
const topShare = Math.max(...answerDistribution.values()) / sampleSize;
assert(topShare <= 0.4, `CP007 answer concentration too high (${topShare.toFixed(3)})`);

console.log(JSON.stringify({
  chapter: "COA-001",
  checkpoint: "COA-CP-007",
  priorCheckpointScenariosPreserved: protectedAuthorities.length,
  cp007ExpansionScenarios: COA_CP007_ENGLISH_REVIEW_V2.length,
  ql009CurrentSemanticStates: current.length,
  ql009OrderedFingerprints: current.length * 2,
  answerBalance: Object.fromEntries(answerCounts),
  domainCount: domains.size,
  followingActionsWithThreePlusReasons,
  rejectedActionsWithTwoPlusFailures,
  evidenceFailures,
  proportionalityFailures,
  sequenceFailures,
  constraintFailures,
  urgencyFailures,
  reasonCodeFamiliesObserved: globalReasons.size,
  editorialV2PatchedActions: COA_CP007_EDITORIAL_V2_PATCHED_ACTION_IDS.length,
  questionStudio: "CLOSED",
  learnerRelease: "LOCKED",
}, null, 2));
