import { NUM_CP001_PERMANENT_ALLOCATION } from "./allocation";
import { runNumCp001PermanentPipeline } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerQl = 60;
const stemOwners = new Map<string, string>();
let generatedQuestions = 0;
let optionViolations = 0;
let verifierViolations = 0;
let lifecycleViolations = 0;
let internalIdentityLeaks = 0;
let crossQlStemCollisions = 0;
let maxStemCharacters = 0;
let maxStemWords = 0;
const stems = new Set<string>();
const explanations = new Set<string>();
const reachedPrototypes = new Set<string>();

const internalPattern = /NUM-(?:CP|QL)|PROT-|AUTH-|temporaryPrototype|solveModeId|proposalId|questionLanguageId/i;

for (const allocation of NUM_CP001_PERMANENT_ALLOCATION) {
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

    stems.add(question.stem);
    explanations.add(JSON.stringify(question.explanation));
  }
}

assert(optionViolations === 0, `option violations: ${optionViolations}`);
assert(verifierViolations === 0, `verifier violations: ${verifierViolations}`);
assert(lifecycleViolations === 0, `lifecycle violations: ${lifecycleViolations}`);
assert(internalIdentityLeaks === 0, `internal identity leaks: ${internalIdentityLeaks}`);
assert(crossQlStemCollisions === 0, `cross-QL exact stem collisions: ${crossQlStemCollisions}`);
assert(reachedPrototypes.size === 26, `prototype reachability: ${reachedPrototypes.size}/26`);
assert(maxStemCharacters <= 520, `stem too long: ${maxStemCharacters}`);
assert(maxStemWords <= 95, `stem word count too high: ${maxStemWords}`);
assert(stems.size >= generatedQuestions * 0.75, `excessive exact stem repetition: ${stems.size}/${generatedQuestions}`);
assert(explanations.size >= generatedQuestions * 0.65, `excessive exact explanation repetition: ${explanations.size}/${generatedQuestions}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_ENGLISH_IMPLEMENTATION_FREEZE_AUDIT",
  permanentQlCount: NUM_CP001_PERMANENT_ALLOCATION.length,
  representedPrototypeCount: reachedPrototypes.size,
  seedsPerQl,
  generatedQuestions,
  exactStemCount: stems.size,
  exactExplanationCount: explanations.size,
  crossQlStemCollisions,
  optionViolations,
  verifierViolations,
  lifecycleViolations,
  internalIdentityLeaks,
  maxStemCharacters,
  maxStemWords,
  nextQlId: "NUM-QL-145",
}, null, 2));
