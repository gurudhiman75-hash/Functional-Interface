import { COA_CP001_ENGLISH_REVIEW_V2 } from "./cp001-editorial-v2.ts";
import { COA_CP002_EDITORIAL_V2_PATCHED_ACTION_IDS, COA_CP002_ENGLISH_REVIEW_V2 } from "./cp002-editorial-v2.ts";
import { generateCoaCp002Question } from "./cp002-generator.ts";
import {
  COA_CP002_OWNED_QL_IDS,
  COA_CURRENT_ENGLISH_AUTHORITIES,
  coaEnglishAuthoritiesForQl,
  type CoaCp002OwnedQlId,
} from "./english-authorities.ts";
import {
  answerClassForCoaActions,
  assertCoaActionAuthorityConsistent,
} from "./action-validity-model.ts";
import type { CoaAnswerClass } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(COA_CP001_ENGLISH_REVIEW_V2.length === 24, "CP002 must preserve the approved 24-scenario CP001 Editorial V2 baseline");
assert(COA_CP002_ENGLISH_REVIEW_V2.length === 24, "CP002 must add exactly 24 reviewed expansion scenarios");
assert(COA_CP002_EDITORIAL_V2_PATCHED_ACTION_IDS.length >= 6, "CP002 Editorial V2 hardening did not patch enough weak distractors");
assert(COA_CURRENT_ENGLISH_AUTHORITIES.length >= 48, "Current English authority must retain at least the approved CP001 V2 + CP002 V2 corpus");

const currentIds = new Set(COA_CURRENT_ENGLISH_AUTHORITIES.map((entry) => entry.id));
for (const scenario of [...COA_CP001_ENGLISH_REVIEW_V2, ...COA_CP002_ENGLISH_REVIEW_V2]) {
  assert(currentIds.has(scenario.id), `${scenario.id}: approved CP001/CP002 authority disappeared from the current additive corpus`);
}

const baselineIds = new Set(COA_CP001_ENGLISH_REVIEW_V2.map((entry) => entry.id));
const expansionIds = new Set<string>();
const globalReasons = new Set<string>();

for (const scenario of COA_CP002_ENGLISH_REVIEW_V2) {
  assert(!baselineIds.has(scenario.id), `${scenario.id}: CP002 must not overwrite an approved CP001 scenario id`);
  assert(!expansionIds.has(scenario.id), `${scenario.id}: duplicate CP002 scenario id`);
  expansionIds.add(scenario.id);
  assert(COA_CP002_OWNED_QL_IDS.includes(scenario.qlId as CoaCp002OwnedQlId), `${scenario.id}: CP002 may expand only QL001/QL002`);
  assert(scenario.statement.length >= 90, `${scenario.id}: statement is too thin for CP002 exam calibration`);
  assert(!/\bassociated\b/i.test(scenario.statement), `${scenario.id}: machine-like 'associated' wording detected`);
  assert(scenario.actions.length === 2, `${scenario.id}: CP002 paired calibration requires two courses`);

  for (const action of scenario.actions) {
    assertCoaActionAuthorityConsistent(action);
    assert(action.text.length >= 70, `${action.id}: action surface is too short/trivial`);
    assert(action.explanation.length >= 75, `${action.id}: explanation is too thin`);
    assert(!/\bassociated\b/i.test(`${action.text} ${action.explanation}`), `${action.id}: machine-like 'associated' wording detected`);
    assert(!/foreign affairs|private sports club|repaint the administrative office|general advertising campaign|replace route information boards|recruit additional specialist doctors/i.test(action.text), `${action.id}: stale toy-distractor pattern detected`);
    action.reasonCodes.forEach((code) => globalReasons.add(code));
  }

  assert(answerClassForCoaActions(scenario.actions) === scenario.expectedAnswerClass, `${scenario.id}: answer class is inconsistent with semantic action authority`);
}

for (const qlId of COA_CP002_OWNED_QL_IDS) {
  const expansion = COA_CP002_ENGLISH_REVIEW_V2.filter((entry) => entry.qlId === qlId);
  assert(expansion.length === 12, `${qlId}: CP002 must add exactly 12 semantic states`);

  const answerCounts = new Map<CoaAnswerClass, number>([
    ["ONLY_I", 0],
    ["ONLY_II", 0],
    ["BOTH", 0],
    ["NEITHER", 0],
  ]);
  expansion.forEach((entry) => answerCounts.set(entry.expectedAnswerClass, (answerCounts.get(entry.expectedAnswerClass) ?? 0) + 1));
  for (const answerClass of ["ONLY_I", "ONLY_II", "BOTH", "NEITHER"] as const) {
    assert(answerCounts.get(answerClass) === 3, `${qlId}: expansion answer class ${answerClass} must appear exactly three times`);
  }

  const domains = new Set(expansion.map((entry) => entry.domain));
  assert(domains.size >= 10, `${qlId}: expansion domain spread is too narrow (${domains.size})`);
  const difficulties = new Set(expansion.map((entry) => entry.difficulty));
  assert(difficulties.has("EASY") && difficulties.has("MEDIUM") && difficulties.has("HARD"), `${qlId}: Easy/Medium/Hard must all be represented`);

  const current = coaEnglishAuthoritiesForQl(qlId);
  assert(current.length === 15, `${qlId}: current pool should contain 3 approved CP001 V2 + 12 CP002 V2 scenarios`);

  const seenAuthorities = new Set<string>();
  const seenFingerprints = new Set<string>();
  const seenInstructions = new Set<string>();
  const seenAnswerClasses = new Set<CoaAnswerClass>();
  const orderByAuthority = new Map<string, Set<string>>();
  const answerDistribution = new Map<CoaAnswerClass, number>();

  for (let seed = 0; seed < 240; seed += 1) {
    const question = generateCoaCp002Question({ qlId, seed });
    const replay = generateCoaCp002Question({ qlId, seed });
    assert(JSON.stringify(question) === JSON.stringify(replay), `${qlId}/${seed}: generation is not deterministic`);
    assert(question.answerOptions.length === 4, `${qlId}/${seed}: four answer choices are required`);
    assert(question.correctIndex >= 0 && question.correctIndex < 4, `${qlId}/${seed}: invalid correct answer index`);
    assert(question.explanation.length >= 150, `${qlId}/${seed}: generated explanation is too thin`);

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

  assert(seenAuthorities.size === 15, `${qlId}: not every current semantic authority is reachable`);
  assert(seenFingerprints.size === 30, `${qlId}: both action orders must be reachable for every authority`);
  assert(seenInstructions.size === 4, `${qlId}: all four exam-instruction surfaces must be reachable`);
  assert(seenAnswerClasses.size === 4, `${qlId}: generator must expose all four answer classes`);
  for (const [authorityId, orders] of orderByAuthority) {
    assert(orders.size === 2, `${qlId}/${authorityId}: both action orders are not reachable`);
  }
  const topShare = Math.max(...answerDistribution.values()) / 240;
  assert(topShare <= 0.35, `${qlId}: answer-class concentration too high (${topShare.toFixed(3)})`);
}

assert(globalReasons.size >= 10, `CP002 distractor/reason taxonomy is too thin (${globalReasons.size})`);

console.log(JSON.stringify({
  chapter: "COA-001",
  checkpoint: "COA-CP-002",
  approvedCp001BaselineScenarios: COA_CP001_ENGLISH_REVIEW_V2.length,
  cp002ReviewedExpansionScenarios: COA_CP002_ENGLISH_REVIEW_V2.length,
  currentEnglishAuthorityScenarios: COA_CURRENT_ENGLISH_AUTHORITIES.length,
  ownedQls: COA_CP002_OWNED_QL_IDS,
  currentSemanticStatesPerOwnedQl: 15,
  renderedOrderStatesPerOwnedQl: 30,
  instructionSurfaces: 4,
  reasonCodeFamiliesObserved: globalReasons.size,
  editorialV2PatchedActions: COA_CP002_EDITORIAL_V2_PATCHED_ACTION_IDS.length,
  questionStudio: "CLOSED",
  learnerRelease: "LOCKED",
}, null, 2));
