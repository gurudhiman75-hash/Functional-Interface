import { TSD_CP007_EXAM_REVIEW_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-exam-review";
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
const bannedStemPhrases = [
  "without first finding",
  "without treating",
  "explaining what",
  "state which gap",
  "taking care not",
  "retain the exact value",
  "keeping the intermediate",
  "start a stopwatch",
  "maintenance deck",
  "inspection deck",
  "maintenance bay",
  "inspection shed",
  "station logbook",
  "camera line",
  "maintenance block",
] as const;

assert(TSD_CP007_EXAM_REVIEW_ENGLISH_AUTHORING_REGISTRY.length === 11, "expected 11 effective English QL specs");
assert(JSON.stringify(TSD_CP007_EXAM_REVIEW_ENGLISH_AUTHORING_REGISTRY.map((entry) => entry.qlId)) === JSON.stringify(TSD_CP007_PERMANENT_QL_IDS), "effective English QL order must match permanent allocation");

const familyIds = new Set<string>();
const stemSignatures = new Set<string>();
const explanationSignatures = new Set<string>();
const difficulty = { EASY: 0, MEDIUM: 0, HARD: 0 };
let stemFamilies = 0;
let objectPoolEntries = 0;

for (const ql of TSD_CP007_EXAM_REVIEW_ENGLISH_AUTHORING_REGISTRY) {
  assert(ql.editorialStatus === "REVIEW_CANDIDATE", `${ql.qlId}: English is prematurely frozen`);
  assert(ql.objectPool.length >= 8, `${ql.qlId}: object/scene pool is thinner than eight entries`);
  assert(new Set(ql.objectPool.map(normalize)).size === ql.objectPool.length, `${ql.qlId}: object pool still contains duplicate exam scenes`);
  objectPoolEntries += ql.objectPool.length;
  assert(ql.stemFamilies.length === 6, `${ql.qlId}: expected exactly six review stem families`);

  const localScenes = new Set<string>();
  const localRepresentations = new Set<string>();

  for (const family of ql.stemFamilies) {
    stemFamilies += 1;
    difficulty[family.difficulty] += 1;
    assert(!familyIds.has(family.familyId), `${family.familyId}: duplicate family ID`);
    familyIds.add(family.familyId);
    localScenes.add(normalize(family.scene));
    localRepresentations.add(normalize(family.representation));

    const stemVariables = family.stem.match(/\{[^}]+\}/g) ?? [];
    assert(stemVariables.length >= 2, `${family.familyId}: stem must expose at least two variable/event bindings`);
    assert((family.stem.match(/\d/g) ?? []).length === 0, `${family.familyId}: stem hard-codes numeric digits`);
    assert(wordCount(family.stem) >= 10, `${family.familyId}: stem is too terse even for a direct exam form`);
    const lowerStem = family.stem.toLowerCase();
    for (const phrase of bannedStemPhrases) assert(!lowerStem.includes(phrase), `${family.familyId}: non-exam tutoring/synthetic phrase '${phrase}' remains in stem`);
    const stemSignature = normalize(family.stem);
    assert(!stemSignatures.has(stemSignature), `${family.familyId}: repeated normalized stem`);
    stemSignatures.add(stemSignature);

    assert(wordCount(family.explanationGuide) >= 20, `${family.familyId}: explanation guide is too terse`);
    assert(family.explanationGuide.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean).length >= 2, `${family.familyId}: explanation guide is formula-fragment-like`);
    const explanationSignature = normalize(family.explanationGuide);
    assert(!explanationSignatures.has(explanationSignature), `${family.familyId}: repeated normalized explanation guide`);
    explanationSignatures.add(explanationSignature);
    const lowerExplanation = family.explanationGuide.toLowerCase();
    for (const phrase of bannedExplanationPhrases) assert(!lowerExplanation.includes(phrase), `${family.familyId}: banned generic explanation phrase '${phrase}'`);
  }

  assert(localScenes.size >= 3, `${ql.qlId}: fewer than three meaningful exam-natural scenes remain`);
  assert(localRepresentations.size >= 4, `${ql.qlId}: representation pool is structurally too thin`);
}

assert(stemFamilies === 66, `expected 66 stem families, found ${stemFamilies}`);
assert(objectPoolEntries >= 88, `object pool total is too thin: ${objectPoolEntries}`);
assert(difficulty.EASY === 25 && difficulty.MEDIUM === 41 && difficulty.HARD === 0, `difficulty calibration changed unexpectedly: ${JSON.stringify(difficulty)}`);
assert(difficulty.HARD === 0, "CP007 must not manufacture HARD labels from one-step fixed-object arithmetic");

console.log("TSD-CP-007 EFFECTIVE ENGLISH EDITORIAL PROOF: PASS");
console.log(JSON.stringify({
  qls: 11,
  stemFamilies,
  objectPoolEntries,
  uniqueStemSignatures: stemSignatures.size,
  uniqueExplanationGuides: explanationSignatures.size,
  difficulty,
  difficultyPolicy: "DEPTH_DRIVEN_NO_FORCED_SPLIT",
  englishStatus: "REVIEW_CANDIDATE",
  questionStudioEnabled: false,
}, null, 2));
