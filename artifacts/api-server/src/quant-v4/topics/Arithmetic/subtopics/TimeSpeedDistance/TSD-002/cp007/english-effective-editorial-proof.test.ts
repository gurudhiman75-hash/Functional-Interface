import { TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-effective";
import { TSD_CP007_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-007 effective English editorial proof failed: ${message}`);
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\{[^}]+\}/g, "{var}").replace(/[^a-z0-9{}]+/g, " ").replace(/\s+/g, " ").trim();
}

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

const bannedExplanationPhrases = ["simply use the formula", "apply the formula", "by formula", "using the standard formula", "obviously"] as const;

assert(TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY.length === 11, "expected 11 effective English QL specs");
assert(JSON.stringify(TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY.map((entry) => entry.qlId)) === JSON.stringify(TSD_CP007_PERMANENT_QL_IDS), "effective English QL order must match permanent allocation");

const familyIds = new Set<string>();
const stemSignatures = new Set<string>();
const explanationSignatures = new Set<string>();
const difficulty = { EASY: 0, MEDIUM: 0, HARD: 0 };
let stemFamilies = 0;
let objectPoolEntries = 0;

for (const ql of TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY) {
  assert(ql.editorialStatus === "REVIEW_CANDIDATE", `${ql.qlId}: English is prematurely frozen`);
  assert(ql.objectPool.length >= 6, `${ql.qlId}: object/scene pool is thinner than six entries`);
  assert(new Set(ql.objectPool.map(normalize)).size === ql.objectPool.length, `${ql.qlId}: object pool contains duplicates`);
  objectPoolEntries += ql.objectPool.length;
  assert(ql.stemFamilies.length === 6, `${ql.qlId}: expected exactly six review stem families`);

  const localScenes = new Set<string>();
  const localRepresentations = new Set<string>();
  const localDifficulty = { EASY: 0, MEDIUM: 0, HARD: 0 };

  for (const family of ql.stemFamilies) {
    stemFamilies += 1;
    difficulty[family.difficulty] += 1;
    localDifficulty[family.difficulty] += 1;
    assert(!familyIds.has(family.familyId), `${family.familyId}: duplicate family ID`);
    familyIds.add(family.familyId);
    assert(!localScenes.has(normalize(family.scene)), `${family.familyId}: repeated scene inside ${ql.qlId}`);
    localScenes.add(normalize(family.scene));
    assert(!localRepresentations.has(normalize(family.representation)), `${family.familyId}: repeated representation inside ${ql.qlId}`);
    localRepresentations.add(normalize(family.representation));

    const stemVariables = family.stem.match(/\{[^}]+\}/g) ?? [];
    assert(stemVariables.length >= 2, `${family.familyId}: stem must expose at least two variable/event bindings`);
    assert((family.stem.match(/\d/g) ?? []).length === 0, `${family.familyId}: stem hard-codes numeric digits`);
    assert(wordCount(family.stem) >= 17, `${family.familyId}: stem is too terse`);
    const stemSignature = normalize(family.stem);
    assert(!stemSignatures.has(stemSignature), `${family.familyId}: repeated normalized stem`);
    stemSignatures.add(stemSignature);

    assert(wordCount(family.explanationGuide) >= 24, `${family.familyId}: explanation guide is too terse`);
    assert(family.explanationGuide.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean).length >= 2, `${family.familyId}: explanation guide is formula-fragment-like`);
    const explanationSignature = normalize(family.explanationGuide);
    assert(!explanationSignatures.has(explanationSignature), `${family.familyId}: repeated normalized explanation guide`);
    explanationSignatures.add(explanationSignature);
    const lower = family.explanationGuide.toLowerCase();
    for (const phrase of bannedExplanationPhrases) assert(!lower.includes(phrase), `${family.familyId}: banned generic explanation phrase '${phrase}'`);
  }

  assert(localScenes.size === 6, `${ql.qlId}: expected six distinct scenes`);
  assert(localRepresentations.size === 6, `${ql.qlId}: expected six distinct representations`);
  assert(localDifficulty.EASY === 2 && localDifficulty.MEDIUM === 2 && localDifficulty.HARD === 2, `${ql.qlId}: expected 2/2/2 Easy/Medium/Hard split`);
}

assert(stemFamilies === 66, `expected 66 stem families, found ${stemFamilies}`);
assert(objectPoolEntries >= 66, `object pool total is too thin: ${objectPoolEntries}`);
assert(difficulty.EASY === 22 && difficulty.MEDIUM === 22 && difficulty.HARD === 22, "overall difficulty split changed");

console.log("TSD-CP-007 EFFECTIVE ENGLISH EDITORIAL PROOF: PASS");
console.log(JSON.stringify({ qls: 11, stemFamilies, objectPoolEntries, uniqueStemSignatures: stemSignatures.size, uniqueExplanationGuides: explanationSignatures.size, difficulty, englishStatus: "REVIEW_CANDIDATE", questionStudioEnabled: false }, null, 2));
