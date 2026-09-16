import { COA_CP001_ENGLISH_REVIEW_V2 } from "./cp001-editorial-v2.ts";
import {
  COA_CP005_FIVE_WAY_PROFILE,
  COA_CP005_FOUR_WAY_PROFILES,
  COA_CP005_SEMANTIC_QL_IDS,
  generateCoaCp005FiveWayQuestion,
  generateCoaCp005PairedQuestion,
} from "./cp005-paired-presentation.ts";
import { COA_CURRENT_ENGLISH_AUTHORITIES, coaEnglishAuthoritiesForQl } from "./english-authorities.ts";
import type { CoaAnswerClass } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const cp001LegacyQl007Ids = new Set(
  COA_CP001_ENGLISH_REVIEW_V2.filter((entry) => entry.qlId === "COA-QL-007").map((entry) => entry.id),
);
const currentQl007Ids = new Set(
  COA_CURRENT_ENGLISH_AUTHORITIES.filter((entry) => entry.qlId === "COA-QL-007").map((entry) => entry.id),
);

assert(cp001LegacyQl007Ids.size >= 2, "CP005 expects the approved CP001 calibration to contain legacy QL007 examples");
assert(currentQl007Ids.size === cp001LegacyQl007Ids.size, "CP005 must not expand QL007 as a duplicate semantic content bucket");
for (const id of cp001LegacyQl007Ids) {
  assert(currentQl007Ids.has(id), `${id}: approved legacy QL007 calibration authority disappeared`);
}

assert(COA_CP005_FOUR_WAY_PROFILES.length === 3, "CP005 must expose three four-way presentation permutations for anti-position-gaming review");
assert(COA_CP005_FIVE_WAY_PROFILE.status === "BLOCKED_PENDING_SOURCE_AUDIT", "Five-way Course-of-Action profile must remain blocked before source audit");

let fiveWayBlocked = false;
try {
  generateCoaCp005FiveWayQuestion();
} catch (error) {
  fiveWayBlocked = /blocked pending source audit/i.test(String(error));
}
assert(fiveWayBlocked, "Five-way profile must fail closed instead of manufacturing an unsupported Either I/II answer class");

const answerClasses = new Set<CoaAnswerClass>();
const semanticAuthorities = new Set<string>();
const presentationProfiles = new Set<string>();
const instructions = new Set<string>();
let checkedCrossProfileRenders = 0;

for (const qlId of COA_CP005_SEMANTIC_QL_IDS) {
  const authorities = coaEnglishAuthoritiesForQl(qlId);
  assert(authorities.length >= 15, `${qlId}: CP005 presentation layer needs the existing semantic pool, not a thin duplicate QL007 pool`);

  const seenAuthorityIds = new Set<string>();
  const orderByAuthority = new Map<string, Set<string>>();
  const sampleSize = Math.max(360, authorities.length * 30);

  for (let seed = 0; seed < sampleSize; seed += 1) {
    const question = generateCoaCp005PairedQuestion({ qlId, seed });
    const replay = generateCoaCp005PairedQuestion({ qlId, seed });
    assert(JSON.stringify(question) === JSON.stringify(replay), `${qlId}/${seed}: CP005 generation is not deterministic`);
    assert(question.answerOptions.length === 4, `${qlId}/${seed}: four-way presentation must have four options`);
    assert(question.correctIndex >= 0 && question.correctIndex < 4, `${qlId}/${seed}: invalid correct index`);
    assert(question.semanticQlId === qlId, `${qlId}/${seed}: presentation layer changed semantic QL identity`);
    assert(question.explanation.length >= 150, `${qlId}/${seed}: explanation is too thin`);

    answerClasses.add(question.answerClass);
    semanticAuthorities.add(question.semanticAuthorityId);
    presentationProfiles.add(question.presentationProfile);
    instructions.add(question.instruction);
    seenAuthorityIds.add(question.semanticAuthorityId);

    const order = question.courses.map((course) => course.semanticActionId).join(">");
    const orders = orderByAuthority.get(question.semanticAuthorityId) ?? new Set<string>();
    orders.add(order);
    orderByAuthority.set(question.semanticAuthorityId, orders);
  }

  assert(seenAuthorityIds.size === authorities.length, `${qlId}: not every semantic authority is reachable through CP005`);
  for (const [authorityId, orders] of orderByAuthority) {
    assert(orders.size === 2, `${qlId}/${authorityId}: both Course I/II action orders must be reachable`);
  }

  const baseSeed = Math.min(7, Math.max(0, authorities.length - 1));
  const standard = generateCoaCp005PairedQuestion({ qlId, seed: baseSeed, profileId: "TWO_ACTION_FOUR_WAY_STANDARD" });
  for (const profile of COA_CP005_FOUR_WAY_PROFILES) {
    const rendered = generateCoaCp005PairedQuestion({ qlId, seed: baseSeed, profileId: profile.id });
    assert(rendered.semanticFingerprint === standard.semanticFingerprint, `${qlId}/${profile.id}: presentation profile changed semantic fingerprint`);
    assert(rendered.answerClass === standard.answerClass, `${qlId}/${profile.id}: presentation profile changed semantic answer`);
    assert(rendered.statement === standard.statement, `${qlId}/${profile.id}: presentation profile changed statement authority`);
    assert(rendered.courses[0].text === standard.courses[0].text && rendered.courses[1].text === standard.courses[1].text, `${qlId}/${profile.id}: presentation profile changed course wording`);
    assert(rendered.answerOptions[rendered.correctIndex] === profile.options[profile.indexes[rendered.answerClass]], `${qlId}/${profile.id}: answer-index mapping drift`);
    checkedCrossProfileRenders += 1;
  }
}

assert(answerClasses.size === 4, `CP005 must expose all four semantic answer classes (${answerClasses.size})`);
assert(presentationProfiles.size === COA_CP005_FOUR_WAY_PROFILES.length, "Not every four-way presentation profile is reachable");
assert(instructions.size === 4, "All four instruction surfaces must be reachable");
assert(checkedCrossProfileRenders === COA_CP005_SEMANTIC_QL_IDS.length * COA_CP005_FOUR_WAY_PROFILES.length, "Cross-profile render proof did not cover every QL/profile pair");

console.log(JSON.stringify({
  chapter: "COA-001",
  checkpoint: "COA-CP-005",
  architectureDecision: "PAIRED_COURSE_IS_PRESENTATION_NOT_NEW_SEMANTIC_QL",
  semanticQlsRendered: COA_CP005_SEMANTIC_QL_IDS,
  semanticAuthoritiesReachable: semanticAuthorities.size,
  fourWayProfiles: COA_CP005_FOUR_WAY_PROFILES.map((entry) => ({ id: entry.id, sourceStatus: entry.sourceStatus })),
  fiveWayProfile: COA_CP005_FIVE_WAY_PROFILE,
  legacyQl007AuthoritiesPreserved: currentQl007Ids.size,
  newQl007AuthoritiesAdded: 0,
  crossProfileRendersChecked: checkedCrossProfileRenders,
  questionStudio: "CLOSED",
  learnerRelease: "LOCKED",
}, null, 2));
