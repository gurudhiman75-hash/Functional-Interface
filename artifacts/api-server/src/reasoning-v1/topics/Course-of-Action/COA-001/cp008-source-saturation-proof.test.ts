import { assertCoaActionAuthorityConsistent, answerClassForCoaActions } from "./action-validity-model.ts";
import { COA_CP001_ENGLISH_REVIEW_V2 } from "./cp001-editorial-v2.ts";
import { COA_CP002_ENGLISH_REVIEW_V2 } from "./cp002-editorial-v2.ts";
import { COA_CP003_ENGLISH_REVIEW_V2 } from "./cp003-editorial-v2.ts";
import { COA_CP004_ENGLISH_REVIEW_V2 } from "./cp004-editorial-v2.ts";
import { COA_CP006_ENGLISH_REVIEW_V2 } from "./cp006-editorial-v2.ts";
import { COA_CP007_ENGLISH_REVIEW_V2 } from "./cp007-editorial-v2.ts";
import { COA_CURRENT_ENGLISH_AUTHORITIES } from "./english-authorities.ts";
import { COA_CP008_EITHER_AUTHORITIES, COA_CP008_THREE_ACTION_AUTHORITIES } from "./cp008-profile-authorities.ts";
import { COA_CP008_PROFILE_DECISIONS, COA_CP008_SOURCE_CENSUS } from "./cp008-source-census.ts";
import { generateCoaCp008FiveWayQuestion, generateCoaCp008ThreeActionQuestion } from "./cp008-source-backed-profiles.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const protectedAuthorities = [
  ...COA_CP001_ENGLISH_REVIEW_V2,
  ...COA_CP002_ENGLISH_REVIEW_V2,
  ...COA_CP003_ENGLISH_REVIEW_V2,
  ...COA_CP004_ENGLISH_REVIEW_V2,
  ...COA_CP006_ENGLISH_REVIEW_V2,
  ...COA_CP007_ENGLISH_REVIEW_V2,
];

assert(COA_CURRENT_ENGLISH_AUTHORITIES.length >= protectedAuthorities.length, "CP008 must not shrink the existing English semantic authority pool");
const currentIds = new Set(COA_CURRENT_ENGLISH_AUTHORITIES.map((entry) => entry.id));
for (const scenario of protectedAuthorities) assert(currentIds.has(scenario.id), `${scenario.id}: prior English authority disappeared during CP008`);

const officialFourWay = COA_CP008_SOURCE_CENSUS.filter((entry) => entry.evidenceLevel === "OFFICIAL_PAPER_REPRODUCTION" && entry.observedProfile === "TWO_ACTION_FOUR_WAY");
const bankingFiveWay = COA_CP008_SOURCE_CENSUS.filter((entry) => entry.evidenceLevel === "MEMORY_BASED_REPRODUCTION" && entry.observedProfile === "TWO_ACTION_FIVE_CODE");
const observedEither = COA_CP008_SOURCE_CENSUS.filter((entry) => entry.observedProfile === "TWO_ACTION_FIVE_CODE" && entry.eitherObservedAsCorrect);
const officialThreeAction = COA_CP008_SOURCE_CENSUS.filter((entry) => entry.evidenceLevel === "OFFICIAL_PAPER_REPRODUCTION" && entry.observedProfile === "THREE_ACTION_COMBINATION");
const singleBest = COA_CP008_SOURCE_CENSUS.filter((entry) => entry.observedProfile === "SINGLE_BEST_ACTION");

assert(officialFourWay.length >= 4, `CP008 needs stronger official four-way evidence (${officialFourWay.length})`);
assert(bankingFiveWay.length >= 2, `CP008 needs more banking five-way evidence (${bankingFiveWay.length})`);
assert(observedEither.length >= 1, "CP008 needs at least one observed correct Either I/II reproduction before enabling dedicated Either authority");
assert(officialThreeAction.length >= 3, `CP008 needs stronger official three-action evidence (${officialThreeAction.length})`);
assert(singleBest.length >= 1, "CP008 must record the single-best boundary evidence");
assert(COA_CP008_PROFILE_DECISIONS.SINGLE_BEST_ACTION === "EXCLUDE_TO_DECISION_MAKING", "Single-best situational judgment must remain outside core COA");

assert(COA_CP008_THREE_ACTION_AUTHORITIES.length >= 6, "CP008 needs at least six authored three-action authorities");
assert(COA_CP008_EITHER_AUTHORITIES.length >= 4, "CP008 needs at least four dedicated exclusive-either authorities");

const threeDomains = new Set<string>();
const threeMasks = new Set<number>();
for (const scenario of COA_CP008_THREE_ACTION_AUTHORITIES) {
  threeDomains.add(scenario.domain);
  scenario.actions.forEach(assertCoaActionAuthorityConsistent);
  const actualMask = scenario.actions.reduce((mask, action, index) => action.expectedVerdict === "FOLLOWS" ? mask | (1 << index) : mask, 0);
  assert(actualMask === scenario.correctMask, `${scenario.id}: authored three-action mask drift`);
  assert(scenario.optionMasks.includes(scenario.correctMask), `${scenario.id}: correct mask absent from options`);
  assert(new Set(scenario.optionMasks).size === 4, `${scenario.id}: three-action options must be unique`);
  threeMasks.add(scenario.correctMask);
}
assert(threeDomains.size >= 5, `Three-action domain coverage is too narrow (${threeDomains.size})`);
assert(threeMasks.size >= 4, `Three-action answer combinations are too repetitive (${threeMasks.size})`);

for (const scenario of COA_CP008_EITHER_AUTHORITIES) {
  scenario.actions.forEach(assertCoaActionAuthorityConsistent);
  assert(answerClassForCoaActions(scenario.actions) === "BOTH", `${scenario.id}: both alternatives must be independently valid before exclusive pair semantics are applied`);
  assert(scenario.exclusiveRelationReason.length >= 100, `${scenario.id}: exclusive relation needs an explicit learner-auditable reason`);
}

const ordinaryAnswerClasses = new Set<string>();
for (let seed = 0; seed < 240; seed += 1) {
  const q = generateCoaCp008FiveWayQuestion({ seed, qlId: "COA-QL-001", mode: "ORDINARY" });
  const replay = generateCoaCp008FiveWayQuestion({ seed, qlId: "COA-QL-001", mode: "ORDINARY" });
  assert(JSON.stringify(q) === JSON.stringify(replay), `${seed}: ordinary five-way generation is not deterministic`);
  assert(q.answerOptions.length === 5, `${seed}: five-way profile must expose five options`);
  assert(q.answerClass !== "EITHER", `${seed}: ordinary independent authority leaked into Either answer class`);
  assert(q.correctIndex !== 2, `${seed}: ordinary authority incorrectly mapped to Either option`);
  ordinaryAnswerClasses.add(q.answerClass);
}
assert(ordinaryAnswerClasses.size === 4, "Five-way ordinary rendering must expose Only I / Only II / Both / Neither");

const eitherSeen = new Set<string>();
for (let seed = 0; seed < 80; seed += 1) {
  const q = generateCoaCp008FiveWayQuestion({ seed, mode: "EITHER" });
  const replay = generateCoaCp008FiveWayQuestion({ seed, mode: "EITHER" });
  assert(JSON.stringify(q) === JSON.stringify(replay), `${seed}: Either generation is not deterministic`);
  assert(q.answerClass === "EITHER" && q.correctIndex === 2, `${seed}: dedicated Either authority must map only to the Either option`);
  assert(q.pairRelation === "MUTUALLY_EXCLUSIVE_ALTERNATIVES", `${seed}: Either question lacks exclusive pair relation`);
  eitherSeen.add(q.semanticAuthorityId);
}
assert(eitherSeen.size === COA_CP008_EITHER_AUTHORITIES.length, "Not every dedicated Either authority is reachable");

const threeSeen = new Set<string>();
const correctIndexes = new Set<number>();
const instructionSet = new Set<string>();
for (let seed = 0; seed < 120; seed += 1) {
  const q = generateCoaCp008ThreeActionQuestion({ seed });
  const replay = generateCoaCp008ThreeActionQuestion({ seed });
  assert(JSON.stringify(q) === JSON.stringify(replay), `${seed}: three-action generation is not deterministic`);
  assert(q.courses.length === 3, `${seed}: three-action profile must expose exactly three courses`);
  assert(q.answerOptions.length === 4, `${seed}: source-shaped combination profile must expose four authored combinations`);
  assert(q.correctIndex >= 0 && q.correctIndex < 4, `${seed}: invalid three-action correct index`);
  threeSeen.add(q.semanticAuthorityId);
  correctIndexes.add(q.correctIndex);
  instructionSet.add(q.instruction);
}
assert(threeSeen.size === COA_CP008_THREE_ACTION_AUTHORITIES.length, "Not every three-action authority is reachable");
assert(correctIndexes.size >= 3, `Three-action correct answer position is too predictable (${correctIndexes.size})`);
assert(instructionSet.size === 3, "All CP008 three-action instruction surfaces must be reachable");

let ql007Rejected = false;
try {
  generateCoaCp008FiveWayQuestion({ seed: 1, qlId: "COA-QL-007", mode: "ORDINARY" });
} catch {
  ql007Rejected = true;
}
assert(ql007Rejected, "Legacy QL007 must not be revived as an ordinary semantic authority by CP008");

console.log(JSON.stringify({
  chapter: "COA-001",
  checkpoint: "COA-CP-008",
  protectedEnglishSemanticAuthorities: protectedAuthorities.length,
  sourceCensusEntries: COA_CP008_SOURCE_CENSUS.length,
  officialFourWaySources: officialFourWay.length,
  bankingFiveWaySources: bankingFiveWay.length,
  observedCorrectEitherSources: observedEither.length,
  officialThreeActionSources: officialThreeAction.length,
  threeActionAuthorities: COA_CP008_THREE_ACTION_AUTHORITIES.length,
  exclusiveEitherAuthorities: COA_CP008_EITHER_AUTHORITIES.length,
  singleBestDecision: COA_CP008_PROFILE_DECISIONS.SINGLE_BEST_ACTION,
  ql007SemanticExpansion: "RETIRED_FROM_FUTURE_EXPANSION",
  qlAllocationFreeze: "PENDING_CP007_HUMAN_APPROVAL",
  questionStudio: "CLOSED",
  learnerRelease: "LOCKED",
}, null, 2));
