import {
  RNK_CP005_AUTHORITY_IDS,
  RNK_CP005_CONTEXT_FAMILIES,
  RNK_CP005_PRESENTATION_MODES,
  buildRnkCp005SharedPassage,
  generateRnkCp005Question,
  solveRnkCp005Question,
  solveRnkCp005SharedPassage,
} from "./cp005-foundation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const fingerprints = new Set<string>();
for (let seed = 0; seed < 192; seed += 1) {
  const passage = buildRnkCp005SharedPassage(seed);
  const order = solveRnkCp005SharedPassage(passage);
  assert(order.length === passage.entityCount, `set ${seed}: entity count mismatch`);
  assert(new Set(order).size === order.length, `set ${seed}: duplicate entity`);
  assert(!fingerprints.has(passage.sharedPassageFingerprint), `set ${seed}: duplicate shared fingerprint`);
  fingerprints.add(passage.sharedPassageFingerprint);

  const sharedFingerprints = new Set<string>();
  for (const authorityId of RNK_CP005_AUTHORITY_IDS) {
    const question = generateRnkCp005Question(authorityId, seed, seed % 4);
    sharedFingerprints.add(question.sharedPassage.sharedPassageFingerprint);
    assert(question.options.length === 4, `${authorityId}:${seed}: option count`);
    assert(new Set(question.options.map((option) => option.answerKey)).size === 4, `${authorityId}:${seed}: duplicate options`);
    assert(question.options[question.correctIndex].answerKey === question.answerKey, `${authorityId}:${seed}: correct option mismatch`);
    assert(solveRnkCp005Question(question.sharedPassage, question.query) === question.answerKey, `${authorityId}:${seed}: independent solve mismatch`);
    assert(question.visibleExplanation.optionAnalysis.length === 4, `${authorityId}:${seed}: option analysis count`);
    assert(question.reviewMetadata.lifecycle.questionStudio === "DISABLED", `${authorityId}:${seed}: question studio enabled`);
    assert(question.reviewMetadata.lifecycle.questionBank === "NOT_STORED", `${authorityId}:${seed}: question bank enabled`);
    assert(question.reviewMetadata.lifecycle.testEligibility === "INELIGIBLE", `${authorityId}:${seed}: test eligible`);
    assert(question.reviewMetadata.lifecycle.publicPublication === false, `${authorityId}:${seed}: public publication enabled`);
  }
  assert(sharedFingerprints.size === 1, `set ${seed}: linked questions do not share one passage`);
}

const contexts = new Set(Array.from({ length: 192 }, (_, seed) => buildRnkCp005SharedPassage(seed).contextFamily));
const modes = new Set(Array.from({ length: 192 }, (_, seed) => buildRnkCp005SharedPassage(seed).presentationMode));
assert(contexts.size === RNK_CP005_CONTEXT_FAMILIES.length, "not all contexts reached");
assert(modes.size === RNK_CP005_PRESENTATION_MODES.length, "not all presentation modes reached");

console.log(JSON.stringify({
  status: "PASS",
  sharedSets: fingerprints.size,
  authorities: RNK_CP005_AUTHORITY_IDS.length,
  generatedQuestionsChecked: fingerprints.size * RNK_CP005_AUTHORITY_IDS.length,
  contexts: [...contexts],
  presentationModes: [...modes],
}, null, 2));
