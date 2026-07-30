import { NUM_CP004_SOURCE_DISPOSITIONS } from "../completion/source-dispositions";
import { NUM_CP004_PERMANENT_QL_IDS } from "./allocation";
import { runNumCp004PermanentPipeline } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerQl = 40;
const normalizedStemOwners = new Map<string, Set<string>>();
const exactStems = new Set<string>();
const exactExplanations = new Set<string>();
let generatedQuestions = 0;
let maxStemWords = 0;
let maxStemCharacters = 0;
let lifecycleViolations = 0;
let internalIdLeaks = 0;
let optionTrapViolations = 0;

for (const qlId of NUM_CP004_PERMANENT_QL_IDS) {
  for (let seed = 1; seed <= seedsPerQl; seed += 1) {
    const question = runNumCp004PermanentPipeline({ questionLanguageId: qlId, seed });
    generatedQuestions += 1;
    const normalizedStem = question.stem.toLowerCase().replace(/\d+/g, "#").replace(/\s+/g, " ").trim();
    const owners = normalizedStemOwners.get(normalizedStem) ?? new Set<string>();
    owners.add(qlId);
    normalizedStemOwners.set(normalizedStem, owners);
    exactStems.add(question.stem);
    exactExplanations.add(JSON.stringify(question.explanation));
    maxStemWords = Math.max(maxStemWords, question.stem.trim().split(/\s+/).length);
    maxStemCharacters = Math.max(maxStemCharacters, question.stem.length);
    if (/NUM-CP004|NUM-QL-|QLT-|PROT-/i.test(question.stem) || /NUM-CP004|NUM-QL-|QLT-|PROT-/i.test(question.explanation.finalAnswer)) {
      internalIdLeaks += 1;
    }
    if (question.explanation.commonTraps.length !== 3 || question.options.filter((option) => !option.isCorrect && !option.misconceptionId).length > 0) {
      optionTrapViolations += 1;
    }
    if (
      question.lifecycle.active
      || question.lifecycle.questionStudioDiscoverable
      || question.lifecycle.questionBankWritable
      || question.lifecycle.testEligible
      || question.lifecycle.publiclyPublishable
    ) lifecycleViolations += 1;
    assert(question.explanation.coreConcept.length >= 1, `${qlId}/${seed}: core concept`);
    assert(question.explanation.givenDataAndStrategy.length >= 1, `${qlId}/${seed}: strategy`);
    assert(question.explanation.stepByStep.length >= 2, `${qlId}/${seed}: step-by-step`);
    assert(question.explanation.examSpeedMethod.length >= 1, `${qlId}/${seed}: shortcut`);
  }
}

const crossQlNormalizedStemCollisions = [...normalizedStemOwners.entries()]
  .filter(([, owners]) => owners.size > 1)
  .map(([stem, owners]) => ({ stem, owners: [...owners] }));
const undisposedSources = NUM_CP004_SOURCE_DISPOSITIONS.filter((row) => !row.disposition);
const advancedHolds = NUM_CP004_SOURCE_DISPOSITIONS.filter((row) => row.disposition === "ADVANCED_ENRICHMENT_HOLD");
const reassignments = NUM_CP004_SOURCE_DISPOSITIONS.filter((row) => row.disposition.startsWith("REASSIGN_"));

assert(crossQlNormalizedStemCollisions.length === 0, `cross-QL normalized stem collisions: ${JSON.stringify(crossQlNormalizedStemCollisions)}`);
assert(undisposedSources.length === 0, "undisposed source families");
assert(lifecycleViolations === 0, "lifecycle violations");
assert(internalIdLeaks === 0, "learner-facing internal ID leaks");
assert(optionTrapViolations === 0, "option-specific trap violations");
assert(maxStemWords <= 45, `stem exceeds 45 words: ${maxStemWords}`);
assert(maxStemCharacters <= 260, `stem exceeds 260 characters: ${maxStemCharacters}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP004_ENGLISH_IMPLEMENTATION_FREEZE_AUDIT",
  permanentQlRange: "NUM-QL-018..NUM-QL-045",
  permanentQlCount: NUM_CP004_PERMANENT_QL_IDS.length,
  frozenSolveModeCount: NUM_CP004_PERMANENT_QL_IDS.length,
  generatedQuestions,
  exactStemCount: exactStems.size,
  exactExplanationCount: exactExplanations.size,
  crossQlNormalizedStemCollisions: crossQlNormalizedStemCollisions.length,
  sourceDispositionRows: NUM_CP004_SOURCE_DISPOSITIONS.length,
  undisposedSourceRows: undisposedSources.length,
  advancedHoldCount: advancedHolds.length,
  reassignedCount: reassignments.length,
  maxStemWords,
  maxStemCharacters,
  internalIdLeaks,
  optionTrapViolations,
  lifecycleViolations,
  nextChapterWideQlIdentity: "NUM-QL-046",
}, null, 2));
