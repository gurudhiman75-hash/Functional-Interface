import { TSD_CP007_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-registry";
import { TSD_CP007_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-007 English editorial proof failed: ${message}`);
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/\{[^}]+\}/g, "{var}")
    .replace(/[^a-z0-9{}]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

const bannedExplanationPhrases = [
  "simply use the formula",
  "apply the formula",
  "by formula",
  "using the standard formula",
  "obviously",
] as const;

assert(TSD_CP007_ENGLISH_AUTHORING_REGISTRY.length === 11, "expected one English authoring spec for each of 11 permanent QLs");
assert(new Set(TSD_CP007_ENGLISH_AUTHORING_REGISTRY.map((entry) => entry.qlId)).size === 11, "duplicate English QL authoring specs detected");
assert(
  JSON.stringify(TSD_CP007_ENGLISH_AUTHORING_REGISTRY.map((entry) => entry.qlId)) === JSON.stringify(TSD_CP007_PERMANENT_QL_IDS),
  "English authoring registry order no longer matches permanent QL allocation",
);

const allFamilyIds = new Set<string>();
const allStemSignatures = new Set<string>();
const allExplanationSignatures = new Set<string>();
let totalStemFamilies = 0;
let totalObjectPoolEntries = 0;
const difficultyTotals = { EASY: 0, MEDIUM: 0, HARD: 0 };

for (const ql of TSD_CP007_ENGLISH_AUTHORING_REGISTRY) {
  assert(ql.editorialStatus === "REVIEW_CANDIDATE", `${ql.qlId}: English content is prematurely frozen`);
  assert(ql.learnerContract.length >= 55, `${ql.qlId}: learner contract is too thin`);
  assert(ql.objectPool.length >= 6, `${ql.qlId}: object/scene pool must contain at least six entries`);
  assert(new Set(ql.objectPool.map(normalize)).size === ql.objectPool.length, `${ql.qlId}: object pool contains duplicates`);
  totalObjectPoolEntries += ql.objectPool.length;

  assert(ql.stemFamilies.length >= 6, `${ql.qlId}: must contain at least six human-authored stem families`);
  const difficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };
  const localScenes = new Set<string>();
  const localRepresentations = new Set<string>();
  const localStemSignatures = new Set<string>();
  const localExplanationSignatures = new Set<string>();

  for (const family of ql.stemFamilies) {
    totalStemFamilies += 1;
    difficultyCounts[family.difficulty] += 1;
    difficultyTotals[family.difficulty] += 1;

    assert(!allFamilyIds.has(family.familyId), `${family.familyId}: duplicate family ID`);
    allFamilyIds.add(family.familyId);
    assert(family.familyId.startsWith(ql.qlId.slice(-2)), `${family.familyId}: family ID must remain visibly tied to ${ql.qlId}`);

    assert(family.representation.trim().length >= 8, `${family.familyId}: representation label is too thin`);
    assert(!localRepresentations.has(normalize(family.representation)), `${family.familyId}: repeated representation label within ${ql.qlId}`);
    localRepresentations.add(normalize(family.representation));

    assert(family.scene.trim().length >= 4, `${family.familyId}: scene label is too thin`);
    assert(!localScenes.has(normalize(family.scene)), `${family.familyId}: repeated scene within ${ql.qlId}`);
    localScenes.add(normalize(family.scene));

    assert(wordCount(family.stem) >= 17, `${family.familyId}: stem is too short to establish a natural exam situation`);
    assert(family.stem.includes("{"), `${family.familyId}: stem has no variable placeholders and risks becoming a fixed one-off question`);
    assert((family.stem.match(/\d/g) ?? []).length === 0, `${family.familyId}: stem hard-codes numeric digits; numeric values must come from variable pools`);
    const stemSignature = normalize(family.stem);
    assert(!localStemSignatures.has(stemSignature), `${family.familyId}: duplicate normalized stem inside ${ql.qlId}`);
    assert(!allStemSignatures.has(stemSignature), `${family.familyId}: duplicate normalized stem across CP007`);
    localStemSignatures.add(stemSignature);
    allStemSignatures.add(stemSignature);

    assert(wordCount(family.explanationGuide) >= 24, `${family.familyId}: explanation guide is too terse`);
    const sentences = family.explanationGuide.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
    assert(sentences.length >= 2, `${family.familyId}: explanation must read as human reasoning, not a formula fragment`);
    assert(family.explanationGuide.includes("{"), `${family.familyId}: explanation guide must refer to question-specific values/events`);
    const explanationSignature = normalize(family.explanationGuide);
    assert(!localExplanationSignatures.has(explanationSignature), `${family.familyId}: repeated explanation guide inside ${ql.qlId}`);
    assert(!allExplanationSignatures.has(explanationSignature), `${family.familyId}: repeated explanation guide across CP007`);
    localExplanationSignatures.add(explanationSignature);
    allExplanationSignatures.add(explanationSignature);

    const lowerExplanation = family.explanationGuide.toLowerCase();
    for (const phrase of bannedExplanationPhrases) {
      assert(!lowerExplanation.includes(phrase), `${family.familyId}: banned generic explanation phrase '${phrase}'`);
    }
  }

  assert(difficultyCounts.EASY >= 2, `${ql.qlId}: needs at least two Easy stem families`);
  assert(difficultyCounts.MEDIUM >= 2, `${ql.qlId}: needs at least two Medium stem families`);
  assert(difficultyCounts.HARD >= 2, `${ql.qlId}: needs at least two Hard stem families`);
  assert(localScenes.size >= 6, `${ql.qlId}: scene diversity is below six distinct settings`);
  assert(localRepresentations.size >= 6, `${ql.qlId}: representation diversity is below six distinct forms`);
}

assert(totalStemFamilies === 66, `expected exactly 66 review-candidate stem families, found ${totalStemFamilies}`);
assert(totalObjectPoolEntries >= 66, `expected at least 66 object/scene pool entries, found ${totalObjectPoolEntries}`);
assert(difficultyTotals.EASY === 22 && difficultyTotals.MEDIUM === 22 && difficultyTotals.HARD === 22, "difficulty distribution must remain exactly 22 Easy / 22 Medium / 22 Hard");

console.log("TSD-CP-007 ENGLISH EDITORIAL DIVERSITY PROOF: PASS");
console.log(JSON.stringify({
  qls: TSD_CP007_ENGLISH_AUTHORING_REGISTRY.length,
  stemFamilies: totalStemFamilies,
  objectPoolEntries: totalObjectPoolEntries,
  uniqueStemSignatures: allStemSignatures.size,
  uniqueExplanationGuides: allExplanationSignatures.size,
  difficulty: difficultyTotals,
  englishStatus: "REVIEW_CANDIDATE",
  questionStudioEnabled: false,
}, null, 2));
