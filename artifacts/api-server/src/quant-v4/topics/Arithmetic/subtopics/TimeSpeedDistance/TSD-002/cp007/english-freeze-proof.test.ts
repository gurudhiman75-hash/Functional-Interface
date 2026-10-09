import { TSD_CP007_ENGLISH_FREEZE_APPROVAL, TSD_CP007_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import { renderCp007EnglishReviewSamples } from "./english-rendered-sample-runtime";
import { TSD_CP007_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-007 English freeze proof failed: ${message}`);
}

assert(TSD_CP007_ENGLISH_FREEZE_APPROVAL.status === "PRODUCT_OWNER_APPROVED_ENGLISH_FREEZE", "product-owner English approval is missing");
assert(TSD_CP007_ENGLISH_FREEZE_APPROVAL.approvedSourceHead === "143231fa0458a264f1e6bb636c79639b9f272124", "approved English source head changed");
assert(TSD_CP007_ENGLISH_FREEZE_APPROVAL.englishFreezeStatus === "FROZEN", "English freeze status changed");
assert(TSD_CP007_ENGLISH_FREEZE_APPROVAL.questionStudioEnabled === false, "Question Studio must stay disabled during localization");
assert(TSD_CP007_ENGLISH_FREEZE_APPROVAL.questionBankStatus === "NOT_STORED", "question bank must remain closed during localization");
assert(TSD_CP007_ENGLISH_FREEZE_APPROVAL.testEligibility === "INELIGIBLE", "test eligibility must remain closed during localization");
assert(TSD_CP007_ENGLISH_FREEZE_APPROVAL.publiclyPublishable === false, "public publication must remain closed during localization");

assert(TSD_CP007_FROZEN_ENGLISH_REGISTRY.length === 11, "expected 11 frozen English QLs");
assert(JSON.stringify(TSD_CP007_FROZEN_ENGLISH_REGISTRY.map((entry) => entry.qlId)) === JSON.stringify(TSD_CP007_PERMANENT_QL_IDS), "frozen QL order changed");
assert(TSD_CP007_FROZEN_ENGLISH_REGISTRY.every((entry) => entry.editorialStatus === "FROZEN"), "a frozen QL lost FROZEN status");

const families = TSD_CP007_FROZEN_ENGLISH_REGISTRY.flatMap((ql) => ql.stemFamilies.map((family) => ({ qlId: ql.qlId, ...family })));
assert(families.length === 66, `expected 66 frozen families, found ${families.length}`);
assert(new Set(families.map((entry) => entry.familyId)).size === 66, "frozen family IDs are not unique");

const difficulty = { EASY: 0, MEDIUM: 0, HARD: 0 };
for (const family of families) difficulty[family.difficulty] += 1;
assert(difficulty.EASY === 25 && difficulty.MEDIUM === 41 && difficulty.HARD === 0, `frozen difficulty changed: ${JSON.stringify(difficulty)}`);

const rendered = renderCp007EnglishReviewSamples();
assert(rendered.length === 66, "approved rendered set must contain 66 questions");
assert(rendered.every((entry) => entry.unresolvedPlaceholders.length === 0), "approved rendered set contains unresolved placeholders");
assert(new Set(rendered.map((entry) => entry.familyId)).size === 66, "rendered family IDs are not unique");
assert(JSON.stringify(rendered.map((entry) => entry.familyId)) === JSON.stringify(families.map((entry) => entry.familyId)), "rendered set no longer matches frozen family order");

console.log("TSD-CP-007 ENGLISH FREEZE PROOF: PASS");
console.log(JSON.stringify({
  status: TSD_CP007_ENGLISH_FREEZE_APPROVAL.status,
  approvedSourceHead: TSD_CP007_ENGLISH_FREEZE_APPROVAL.approvedSourceHead,
  frozenQls: TSD_CP007_FROZEN_ENGLISH_REGISTRY.length,
  frozenQuestionFamilies: families.length,
  renderedQuestions: rendered.length,
  difficulty,
  localizationStatus: TSD_CP007_ENGLISH_FREEZE_APPROVAL.localizationStatus,
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
