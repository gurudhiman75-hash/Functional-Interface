import { NUM_CP007_PERMANENT_ALLOCATION } from "./allocation.ts";
import { runNumCp007PermanentPipeline } from "./runtime.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerQl = 60;
const stemOwners = new Map<string, string>();
let generatedQuestions = 0;
let exactStemCount = 0;
let exactExplanationCount = 0;
let optionViolations = 0;
let verifierViolations = 0;
let lifecycleViolations = 0;
let internalIdentityLeaks = 0;
let crossQlStemCollisions = 0;
let zeroRemainderExtremumLeaks = 0;
let cp006GreatestSameRemainderLeaks = 0;
let maxStemCharacters = 0;
let maxStemWords = 0;
const stems = new Set<string>();
const explanations = new Set<string>();

const internalPattern = /NUM-(?:CP|QL)|PROT-|CP007-AUTH|temporaryPrototype|solveModeId|authorityId/i;

for (const allocation of NUM_CP007_PERMANENT_ALLOCATION) {
  for (let seed = 1; seed <= seedsPerQl; seed += 1) {
    const question = runNumCp007PermanentPipeline({ questionLanguageId: allocation.qlId, seed });
    generatedQuestions += 1;
    maxStemCharacters = Math.max(maxStemCharacters, question.stem.length);
    maxStemWords = Math.max(maxStemWords, question.stem.trim().split(/\s+/).length);

    if (question.options.length !== 4 || new Set(question.options.map((option) => option.value)).size !== 4 || question.options.filter((option) => option.isCorrect).length !== 1) {
      optionViolations += 1;
    }
    if (question.canonicalAnswer !== question.verifierAnswer || question.options[question.correctIndex]?.value !== question.canonicalAnswer) {
      verifierViolations += 1;
    }
    if (question.lifecycle.active || question.lifecycle.questionStudioDiscoverable || question.lifecycle.questionBankWritable || question.lifecycle.testEligible || question.lifecycle.publiclyPublishable) {
      lifecycleViolations += 1;
    }

    const learnerText = [
      question.stem,
      ...question.options.map((option) => option.value),
      question.explanation.coreConcept,
      question.explanation.strategy,
      ...question.explanation.steps,
      question.explanation.finalAnswer,
    ].join("\n");
    if (internalPattern.test(learnerText)) internalIdentityLeaks += 1;

    if (allocation.qlId === "NUM-QL-123" && /remainder\s+(?:is\s+)?0|exactly divisible/i.test(question.stem)) {
      zeroRemainderExtremumLeaks += 1;
    }
    if (allocation.qlId === "NUM-QL-115" && /greatest\s+(?:possible\s+)?divisor/i.test(question.stem)) {
      cp006GreatestSameRemainderLeaks += 1;
    }

    const previousOwner = stemOwners.get(question.stem);
    if (previousOwner && previousOwner !== allocation.qlId) crossQlStemCollisions += 1;
    else stemOwners.set(question.stem, allocation.qlId);
    stems.add(question.stem);
    explanations.add(JSON.stringify(question.explanation));
  }
}

exactStemCount = stems.size;
exactExplanationCount = explanations.size;

assert(optionViolations === 0, `option violations: ${optionViolations}`);
assert(verifierViolations === 0, `verifier violations: ${verifierViolations}`);
assert(lifecycleViolations === 0, `lifecycle violations: ${lifecycleViolations}`);
assert(internalIdentityLeaks === 0, `internal identity leaks: ${internalIdentityLeaks}`);
assert(crossQlStemCollisions === 0, `cross-QL exact stem collisions: ${crossQlStemCollisions}`);
assert(zeroRemainderExtremumLeaks === 0, `CP-003 zero-remainder extremum leaks: ${zeroRemainderExtremumLeaks}`);
assert(cp006GreatestSameRemainderLeaks === 0, `CP-006 greatest-same-remainder leaks: ${cp006GreatestSameRemainderLeaks}`);
assert(maxStemCharacters <= 520, `stem too long: ${maxStemCharacters}`);
assert(maxStemWords <= 95, `stem word count too high: ${maxStemWords}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP007_ENGLISH_IMPLEMENTATION_FREEZE_AUDIT",
  permanentQlCount: NUM_CP007_PERMANENT_ALLOCATION.length,
  seedsPerQl,
  generatedQuestions,
  exactStemCount,
  exactExplanationCount,
  crossQlStemCollisions,
  optionViolations,
  verifierViolations,
  lifecycleViolations,
  internalIdentityLeaks,
  zeroRemainderExtremumLeaks,
  cp006GreatestSameRemainderLeaks,
  maxStemCharacters,
  maxStemWords,
  nextQlId: "NUM-QL-124",
}, null, 2));
