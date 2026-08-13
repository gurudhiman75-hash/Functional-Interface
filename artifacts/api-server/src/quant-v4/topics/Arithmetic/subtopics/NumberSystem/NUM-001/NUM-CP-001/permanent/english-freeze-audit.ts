import { NUM_CP001_PERMANENT_ALLOCATION } from "./allocation";
import { runNumCp001PermanentPipeline } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerQl = 60;
const stemOwners = new Map<string, string>();
const answerByQuestionSurface = new Map<string, string>();
const stemsByQl = new Map<string, Set<string>>();
const questionSurfacesByQl = new Map<string, Set<string>>();
const explanationsByQl = new Map<string, Set<string>>();
let generatedQuestions = 0;
let optionViolations = 0;
let verifierViolations = 0;
let lifecycleViolations = 0;
let internalIdentityLeaks = 0;
let crossQlStemCollisions = 0;
let ambiguousRepeatedQuestionSurfaces = 0;
let maxStemCharacters = 0;
let maxStemWords = 0;
const stems = new Set<string>();
const questionSurfaces = new Set<string>();
const explanations = new Set<string>();
const reachedPrototypes = new Set<string>();

const internalPattern = /NUM-(?:CP|QL)|PROT-|AUTH-|temporaryPrototype|solveModeId|proposalId|questionLanguageId/i;

for (const allocation of NUM_CP001_PERMANENT_ALLOCATION) {
  stemsByQl.set(allocation.qlId, new Set());
  questionSurfacesByQl.set(allocation.qlId, new Set());
  explanationsByQl.set(allocation.qlId, new Set());

  for (let seed = 1; seed <= seedsPerQl; seed += 1) {
    const question = runNumCp001PermanentPipeline({ questionLanguageId: allocation.qlId, seed });
    generatedQuestions += 1;
    reachedPrototypes.add(question.temporaryPrototypeId);
    maxStemCharacters = Math.max(maxStemCharacters, question.stem.length);
    maxStemWords = Math.max(maxStemWords, question.stem.trim().split(/\s+/).length);

    if (
      question.options.length !== 4
      || new Set(question.options.map((option) => option.value)).size !== 4
      || question.options.filter((option) => option.isCorrect).length !== 1
    ) {
      optionViolations += 1;
    }
    if (question.canonicalAnswer !== question.verifierAnswer || question.options[question.correctIndex]?.value !== question.canonicalAnswer) {
      verifierViolations += 1;
    }
    if (
      question.lifecycle.active
      || question.lifecycle.questionStudioDiscoverable
      || question.lifecycle.questionBankWritable
      || question.lifecycle.testEligible
      || question.lifecycle.publiclyPublishable
    ) {
      lifecycleViolations += 1;
    }

    const learnerText = [
      question.stem,
      ...question.options.map((option) => option.value),
      ...question.explanation.coreConcept,
      ...question.explanation.givenDataAndStrategy,
      ...question.explanation.stepByStep,
      ...question.explanation.examSpeedMethod,
      ...question.explanation.commonTraps,
      question.explanation.finalAnswer,
    ].join("\n");
    if (internalPattern.test(learnerText)) internalIdentityLeaks += 1;

    const previousOwner = stemOwners.get(question.stem);
    if (previousOwner && previousOwner !== allocation.qlId) crossQlStemCollisions += 1;
    else stemOwners.set(question.stem, allocation.qlId);

    const questionSurface = JSON.stringify({
      stem: question.stem,
      options: question.options.map((option) => option.value),
    });
    const ownedSurfaceKey = `${allocation.qlId}\u0000${questionSurface}`;
    const previousAnswer = answerByQuestionSurface.get(ownedSurfaceKey);
    if (previousAnswer !== undefined && previousAnswer !== question.canonicalAnswer) ambiguousRepeatedQuestionSurfaces += 1;
    else answerByQuestionSurface.set(ownedSurfaceKey, question.canonicalAnswer);

    const explanationKey = JSON.stringify(question.explanation);
    stems.add(question.stem);
    questionSurfaces.add(questionSurface);
    explanations.add(explanationKey);
    stemsByQl.get(allocation.qlId)!.add(question.stem);
    questionSurfacesByQl.get(allocation.qlId)!.add(questionSurface);
    explanationsByQl.get(allocation.qlId)!.add(explanationKey);
  }
}

for (const allocation of NUM_CP001_PERMANENT_ALLOCATION) {
  assert(questionSurfacesByQl.get(allocation.qlId)!.size >= 4, `${allocation.qlId}: insufficient distinct learner question surfaces`);
  assert(explanationsByQl.get(allocation.qlId)!.size >= 4, `${allocation.qlId}: insufficient distinct learner explanations`);
}

assert(optionViolations === 0, `option violations: ${optionViolations}`);
assert(verifierViolations === 0, `verifier violations: ${verifierViolations}`);
assert(lifecycleViolations === 0, `lifecycle violations: ${lifecycleViolations}`);
assert(internalIdentityLeaks === 0, `internal identity leaks: ${internalIdentityLeaks}`);
assert(crossQlStemCollisions === 0, `cross-QL exact stem collisions: ${crossQlStemCollisions}`);
assert(ambiguousRepeatedQuestionSurfaces === 0, `identical full question surfaces with different answers: ${ambiguousRepeatedQuestionSurfaces}`);
assert(reachedPrototypes.size === 26, `prototype reachability: ${reachedPrototypes.size}/26`);
assert(maxStemCharacters <= 520, `stem too long: ${maxStemCharacters}`);
assert(maxStemWords <= 95, `stem word count too high: ${maxStemWords}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_ENGLISH_IMPLEMENTATION_FREEZE_AUDIT",
  permanentQlCount: NUM_CP001_PERMANENT_ALLOCATION.length,
  representedPrototypeCount: reachedPrototypes.size,
  seedsPerQl,
  generatedQuestions,
  exactStemCount: stems.size,
  exactQuestionSurfaceCount: questionSurfaces.size,
  exactExplanationCount: explanations.size,
  distinctStemsByQl: Object.fromEntries([...stemsByQl.entries()].map(([qlId, values]) => [qlId, values.size])),
  distinctQuestionSurfacesByQl: Object.fromEntries([...questionSurfacesByQl.entries()].map(([qlId, values]) => [qlId, values.size])),
  distinctExplanationsByQl: Object.fromEntries([...explanationsByQl.entries()].map(([qlId, values]) => [qlId, values.size])),
  ambiguousRepeatedQuestionSurfaces,
  crossQlStemCollisions,
  optionViolations,
  verifierViolations,
  lifecycleViolations,
  internalIdentityLeaks,
  maxStemCharacters,
  maxStemWords,
  nextQlId: "NUM-QL-145",
}, null, 2));
