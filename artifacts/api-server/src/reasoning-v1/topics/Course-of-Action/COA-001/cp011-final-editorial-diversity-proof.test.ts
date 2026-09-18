import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter.ts";
import { COA_CURRENT_ENGLISH_AUTHORITIES } from "./english-authorities.ts";
import {
  COA_CP009_FULL_LOCALIZED_EITHER,
  COA_CP009_FULL_LOCALIZED_ORDINARY,
  COA_CP009_FULL_LOCALIZED_THREE_ACTION,
} from "./cp009-full-localization-registry.ts";
import {
  COA_CP010_ACTIVE_QL_IDS,
} from "./cp010-question-studio-integration.ts";
import {
  COA_CP011_CHECKPOINT_ID,
  COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
  COA_CP011_QUESTION_STUDIO_PACKAGE,
  generateCoaCp011QuestionStudioBatch,
  getCoaCp011SafeSemanticCapacity,
} from "./cp011-final-editorial-diversity.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const active = COA_CURRENT_ENGLISH_AUTHORITIES.filter((entry) => entry.qlId !== "COA-QL-007");
const legacy = COA_CURRENT_ENGLISH_AUTHORITIES.filter((entry) => entry.qlId === "COA-QL-007");
assert(active.length === 118, `active ordinary authority drift: ${active.length}`);
assert(legacy.length === 2, `legacy QL007 authority drift: ${legacy.length}`);

const expectedQlCounts = Object.freeze({
  "COA-QL-001": 15,
  "COA-QL-002": 15,
  "COA-QL-003": 15,
  "COA-QL-004": 15,
  "COA-QL-005": 15,
  "COA-QL-006": 15,
  "COA-QL-008": 14,
  "COA-QL-009": 14,
});

for (const qlId of COA_CP010_ACTIVE_QL_IDS) {
  const rows = active.filter((entry) => entry.qlId === qlId);
  assert(rows.length === expectedQlCounts[qlId], `${qlId}: authority-count drift`);

  const answerCounts = new Map<string, number>();
  const domains = new Set<string>();
  const difficulties = new Set<string>();
  for (const row of rows) {
    answerCounts.set(row.expectedAnswerClass, (answerCounts.get(row.expectedAnswerClass) ?? 0) + 1);
    domains.add(row.domain);
    difficulties.add(row.difficulty);
  }
  const counts = [...answerCounts.values()];
  assert(answerCounts.size === 4, `${qlId}: all four ordinary answer classes must remain reachable`);
  assert(Math.max(...counts) - Math.min(...counts) <= 1, `${qlId}: answer-class concentration regressed`);
  assert(domains.size >= 10, `${qlId}: domain breadth too narrow (${domains.size})`);
  assert(difficulties.size >= 2, `${qlId}: difficulty breadth too narrow`);
}
assert(!active.some((entry) => entry.qlId === "COA-QL-008" && entry.difficulty === "EASY"),
  "QL008 Easy must not be invented merely to fill a difficulty grid; ordered reasoning is intentionally Medium/Hard.");

const englishStatements = active.map((entry) => entry.statement.trim().replace(/\s+/g, " "));
assert(new Set(englishStatements).size === englishStatements.length, "active English authorities contain duplicate statements");

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const ordinary = COA_CP009_FULL_LOCALIZED_ORDINARY.filter((entry) => entry.locale === locale);
  const either = COA_CP009_FULL_LOCALIZED_EITHER.filter((entry) => entry.locale === locale);
  const three = COA_CP009_FULL_LOCALIZED_THREE_ACTION.filter((entry) => entry.locale === locale);
  assert(ordinary.length === 120, `${locale}: ordinary localization count drift`);
  assert(either.length === 4, `${locale}: Either localization count drift`);
  assert(three.length === 6, `${locale}: three-action localization count drift`);
  assert(new Set(ordinary.map((entry) => entry.statement.trim().replace(/\s+/g, " "))).size === ordinary.length,
    `${locale}: duplicate ordinary statements`);

  const learnerText = [...ordinary, ...either, ...three]
    .flatMap((entry: any) => [entry.statement, ...entry.actions.flatMap((action: any) => [action.text, action.explanation]), entry.pairReason ?? ""])
    .join(" ");

  assert(!/\bassociated\b/i.test(learnerText), `${locale}: banned English editorial filler leaked`);
  if (locale === "hi-IN") {
    assert(!/असामान्य समानता|अंतिम प्रक्रिया कतार|बाहर जाने वाली सूचना कतार|गंतव्य मेल नहीं खा|आने वाले वेतन समूह|बहुत बड़ी त्योहार भीड़/.test(learnerText),
      "Hindi literal-translation regression detected");
  } else {
    assert(!/ਅਸਧਾਰਣ ਮਿਲਾਪ ਮਿਲਿਆ ਹੈ|ਆਖਰੀ ਕਾਰਵਾਈ ਕਤਾਰ|ਬਾਹਰ ਜਾਣ ਵਾਲੀ ਸੂਚਨਾ ਕਤਾਰ|ਮੰਜ਼ਿਲ ਮਿਲ ਨਹੀਂ ਰਹੀ|ਆਉਣ ਵਾਲੇ ਤਨਖਾਹ ਸਮੂਹ|ਬਹੁਤ ਵੱਡੀ ਤਿਉਹਾਰ ਭੀੜ/.test(learnerText),
      "Punjabi literal-translation regression detected");
  }
}

assert(COA_CP011_QUESTION_STUDIO_PACKAGE.reviewOnly === true, "CP011 must remain review-only");
assert(COA_CP011_QUESTION_STUDIO_PACKAGE.questionBankWritable === false, "Question Bank opened before CP012");
assert(COA_CP011_QUESTION_STUDIO_PACKAGE.testEligible === false, "test eligibility opened before CP012");
assert(COA_CP011_QUESTION_STUDIO_PACKAGE.mockTestEligible === false, "mock eligibility opened before CP012");
assert(COA_CP011_QUESTION_STUDIO_PACKAGE.publiclyPublishable === false, "public release opened before CP012");

for (const language of ["en", "hi", "pa"] as const) {
  const request = { packageId: "COA-001", language, count: 50, seed: `CP011-DEFAULT-50:${language}` } as const;
  assert(getCoaCp011SafeSemanticCapacity(request) >= 50, `${language}: default safe capacity unexpectedly below 50`);
  const a = await generateCoaCp011QuestionStudioBatch(request);
  const b = await generateCoaCp011QuestionStudioBatch(request);
  assert(JSON.stringify(a) === JSON.stringify(b), `${language}: deterministic replay drift`);
  const ids = (a.questions as readonly any[]).map((question) => question.semanticAuthorityId);
  assert(new Set(ids).size === ids.length, `${language}: repeated semantic authority in 50-question default batch`);
  for (const question of a.questions as readonly any[]) {
    assert(question.checkpointId === COA_CP011_CHECKPOINT_ID, `${language}: CP011 checkpoint marker lost`);
    assert(question.currentQuestionStudioAuthority === COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY, `${language}: current authority drift`);
    assert(question.semanticUniqueWithinBatch === true, `${language}: uniqueness marker missing`);
    assert(question.questionBankWritable === false && question.testEligible === false && question.mockTestEligible === false,
      `${language}: downstream lifecycle opened`);
  }
}

for (const qlId of COA_CP010_ACTIVE_QL_IDS) {
  const request = { packageId: "COA-001", canonicalProblemId: qlId, language: "en" as const, seed: `CP011-QL-CAP:${qlId}` };
  const capacity = getCoaCp011SafeSemanticCapacity(request);
  assert(capacity === expectedQlCounts[qlId], `${qlId}: safe capacity must equal frozen semantic authority count`);
  const batch = await generateCoaCp011QuestionStudioBatch({ ...request, count: capacity });
  const ids = (batch.questions as readonly any[]).map((question) => question.semanticAuthorityId);
  assert(new Set(ids).size === capacity, `${qlId}: full-capacity review batch repeats semantic authority`);

  let rejected = false;
  try {
    await generateCoaCp011QuestionStudioBatch({ ...request, count: capacity + 1 });
  } catch (error) {
    rejected = /anti-repetition gate/.test(String(error));
  }
  assert(rejected, `${qlId}: oversized review batch did not fail explicitly`);
}

const easyCapacity = getCoaCp011SafeSemanticCapacity({ packageId: "COA-001", difficulty: "Easy" });
assert(easyCapacity > 0 && easyCapacity < 50, "Easy semantic-capacity diagnostic is not exercising a constrained pool");
const easyBatch = await generateCoaCp011QuestionStudioBatch({
  packageId: "COA-001", difficulty: "Easy", count: easyCapacity, seed: "CP011-EASY-FULL",
});
assert(new Set((easyBatch.questions as readonly any[]).map((q) => q.semanticAuthorityId)).size === easyCapacity,
  "Easy full-capacity batch repeats semantic authority");

const fiveRequest = { packageId: "COA-001", patternId: "TWO_ACTION_FIVE_CODE", language: "en" as const, seed: "CP011-FIVE-CAP" };
const fiveCapacity = getCoaCp011SafeSemanticCapacity(fiveRequest);
assert(fiveCapacity > 0 && fiveCapacity <= 20, `unexpected five-code safe capacity: ${fiveCapacity}`);
const five = await generateCoaCp011QuestionStudioBatch({ ...fiveRequest, count: fiveCapacity });
assert(new Set((five.questions as readonly any[]).map((q) => q.semanticAuthorityId)).size === fiveCapacity,
  "five-code safe-capacity batch repeats semantic authority");
assert((five.questions as readonly any[]).some((q) => q.answerClass === "EITHER"),
  "five-code final audit did not reach genuine Either");

const threeRequest = { packageId: "COA-001", patternId: "THREE_ACTION_COMBINATION", language: "pa" as const, seed: "CP011-THREE-CAP" };
const threeCapacity = getCoaCp011SafeSemanticCapacity(threeRequest);
assert(threeCapacity === 6, `three-action safe capacity drift: ${threeCapacity}`);
const three = await generateCoaCp011QuestionStudioBatch({ ...threeRequest, count: threeCapacity });
assert(new Set((three.questions as readonly any[]).map((q) => q.semanticAuthorityId)).size === 6,
  "three-action full-capacity batch repeats semantic authority");

assert(getCoaCp011SafeSemanticCapacity({
  packageId: "COA-001",
  canonicalProblemId: "COA-QL-008",
  difficulty: "Easy",
}) === 0, "QL008/Easy should truthfully report zero rather than relabel Medium/Hard questions");

const packages = reasoningV1QuestionStudioAdapter.listPackages();
const registered = packages.find((pkg) => pkg.packageId === "COA-001") as any;
assert(registered, "COA-001 disappeared from reasoning-v1 registry");
assert(registered.metadata?.currentQuestionStudioAuthority === COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
  "Question Studio registry is not using CP011 as current COA authority");

console.log(JSON.stringify({
  chapter: "COA-001",
  checkpoint: COA_CP011_CHECKPOINT_ID,
  status: "PASS_FINAL_EDITORIAL_DIVERSITY_AUDIT",
  activeOrdinaryAuthorities: active.length,
  legacyQl007Authorities: legacy.length,
  qlAuthorityCounts: expectedQlCounts,
  answerClassBalance: "MAX_SPREAD_1_PER_ACTIVE_QL",
  domainBreadth: "AT_LEAST_10_DOMAINS_PER_ACTIVE_QL",
  englishStatementDuplicates: 0,
  localizedStatementDuplicates: 0,
  defaultReviewBatchSemanticUniqueness: "50/50",
  easySafeCapacity: easyCapacity,
  fiveCodeSafeCapacity: fiveCapacity,
  threeActionSafeCapacity: threeCapacity,
  ql008Easy: "UNSUPPORTED_NOT_RELABELED",
  antiRepetitionGate: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publicRelease: false,
}, null, 2));
