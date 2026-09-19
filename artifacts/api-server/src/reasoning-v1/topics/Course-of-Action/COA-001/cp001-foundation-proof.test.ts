import { COA_CP001_ENGLISH_REVIEW_V2, COA_CP001_EDITORIAL_V2_PATCHED_ACTION_IDS } from "./cp001-editorial-v2.ts";
import {
  answerClassForCoaActions,
  assertCoaActionAuthorityConsistent,
} from "./action-validity-model.ts";
import { COA_QL_IDS, type CoaAnswerClass } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const AUTHORITIES = COA_CP001_ENGLISH_REVIEW_V2;

assert(AUTHORITIES.length === 24, "COA-CP-001 must contain exactly 24 English calibration scenarios");
assert(COA_CP001_EDITORIAL_V2_PATCHED_ACTION_IDS.length >= 10, "CP001 V2 should harden the weak V1 distractor surfaces");

const scenarioIds = new Set<string>();
const actionIds = new Set<string>();
const answerCounts = new Map<CoaAnswerClass, number>([
  ["ONLY_I", 0],
  ["ONLY_II", 0],
  ["BOTH", 0],
  ["NEITHER", 0],
]);
const domains = new Set<string>();
const difficulties = new Set<string>();
const reasonCodes = new Set<string>();
let follows = 0;
let rejects = 0;

for (const scenario of AUTHORITIES) {
  assert(!scenarioIds.has(scenario.id), `${scenario.id}: duplicate scenario id`);
  scenarioIds.add(scenario.id);
  assert(scenario.statement.length >= 75, `${scenario.id}: statement is too thin for exam calibration`);
  assert(!/\bassociated\b/i.test(scenario.statement), `${scenario.id}: avoid machine-like 'associated' wording`);
  assert(scenario.actions.length === 2, `${scenario.id}: CP001 calibration requires exactly two courses of action`);

  domains.add(scenario.domain);
  difficulties.add(scenario.difficulty);
  answerCounts.set(scenario.expectedAnswerClass, (answerCounts.get(scenario.expectedAnswerClass) ?? 0) + 1);

  for (const action of scenario.actions) {
    assert(!actionIds.has(action.id), `${action.id}: duplicate action id`);
    actionIds.add(action.id);
    assert(action.text.length >= 55, `${action.id}: action wording is too toy-like`);
    assert(action.explanation.length >= 55, `${action.id}: explanation is too thin`);
    assert(!/\bassociated\b/i.test(`${action.text} ${action.explanation}`), `${action.id}: avoid machine-like 'associated' wording`);
    assert(!/\b(always wrong|always correct|extreme word)\b/i.test(action.explanation), `${action.id}: shortcut explanation detected`);
    assert(!/foreign affairs department|private sports club|repaint the administrative office|general advertising campaign|permanently delete every user account/i.test(action.text), `${action.id}: trivial V1 distractor survived editorial V2`);
    assertCoaActionAuthorityConsistent(action);
    action.reasonCodes.forEach((code) => reasonCodes.add(code));
    if (action.expectedVerdict === "FOLLOWS") follows += 1;
    else rejects += 1;
  }

  const actualAnswer = answerClassForCoaActions(scenario.actions);
  assert(actualAnswer === scenario.expectedAnswerClass, `${scenario.id}: expected ${scenario.expectedAnswerClass}, got ${actualAnswer}`);
}

for (const answerClass of ["ONLY_I", "ONLY_II", "BOTH", "NEITHER"] as const) {
  assert(answerCounts.get(answerClass) === 6, `${answerClass}: CP001 answer balance must be exactly six scenarios`);
}

for (const qlId of COA_QL_IDS) {
  const scenarios = AUTHORITIES.filter((entry) => entry.qlId === qlId);
  assert(scenarios.length >= 2, `${qlId}: CP001 must calibrate every proposed QL with at least two scenarios`);
  const qlVerdicts = scenarios.flatMap((entry) => entry.actions.map((action) => action.expectedVerdict));
  assert(qlVerdicts.includes("FOLLOWS"), `${qlId}: no following action represented`);
  assert(qlVerdicts.includes("DOES_NOT_FOLLOW"), `${qlId}: no rejected action represented`);
}

assert(domains.size >= 10, `CP001 domain spread is too narrow: ${domains.size}`);
assert(difficulties.has("EASY") && difficulties.has("MEDIUM") && difficulties.has("HARD"), "CP001 must include Easy, Medium and Hard calibration items");
assert(reasonCodes.size >= 12, `CP001 reason-code coverage is too thin: ${reasonCodes.size}`);
assert(follows === rejects, `CP001 should balance following and rejected actions; got follows=${follows}, rejects=${rejects}`);

console.log(JSON.stringify({
  chapter: "COA-001",
  checkpoint: "COA-CP-001",
  editorialAuthority: "CP001_V2",
  scenarios: AUTHORITIES.length,
  editorialV2PatchedActions: COA_CP001_EDITORIAL_V2_PATCHED_ACTION_IDS.length,
  qlsRepresented: COA_QL_IDS.length,
  answerClassCounts: Object.fromEntries(answerCounts),
  domains: domains.size,
  difficulties: [...difficulties].sort(),
  reasonCodeFamiliesObserved: reasonCodes.size,
  actionVerdicts: { follows, rejects },
  questionStudio: "CLOSED",
  learnerRelease: "LOCKED",
}, null, 2));
