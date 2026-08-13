import {
  RNK_CP003_NAMES,
  RNK_CP003_PROTOTYPE_IDS,
  answerSemanticForCp003,
  buildCp003Evidence,
  contextsForPrototype,
  createRng,
  hashText,
  randomInt,
  solveCp003Independently,
  type RnkCp003PrototypeId,
  type RnkCp003Question,
} from './cp003-model';
import {
  buildCp003Options,
  difficultyForCp003,
  explanationForCp003,
  fingerprintForCp003,
  formatCp003Answer,
  stemForCp003,
  validateRenderedAnswer,
} from './cp003-renderer';

export * from './cp003-model';

export function generateRnkCp003Question(prototypeId: RnkCp003PrototypeId, seed: number): RnkCp003Question {
  const rng = createRng(prototypeId, seed);
  const availableContexts = contextsForPrototype(prototypeId);
  const context = availableContexts[randomInt(rng, 0, availableContexts.length - 1)];
  const firstNameIndex = randomInt(rng, 0, RNK_CP003_NAMES.length - 1);
  let secondNameIndex = randomInt(rng, 0, RNK_CP003_NAMES.length - 1);
  if (secondNameIndex === firstNameIndex) secondNameIndex = (secondNameIndex + 1) % RNK_CP003_NAMES.length;
  const firstName = RNK_CP003_NAMES[firstNameIndex];
  const secondName = RNK_CP003_NAMES[secondNameIndex];
  const evidence = buildCp003Evidence(prototypeId, rng, seed);
  const answerSemantic = answerSemanticForCp003(prototypeId);
  const answerKey = solveCp003Independently(evidence);
  validateRenderedAnswer(evidence, answerKey);
  const answer = formatCp003Answer(answerKey, answerSemantic, firstName, secondName);
  const correctIndex = hashText(`${prototypeId}:correct:${seed}`) % 4;
  const options = buildCp003Options(evidence, answerKey, answerSemantic, correctIndex, firstName, secondName);
  const teaching = explanationForCp003(evidence, context, firstName, secondName, answer);

  return {
    packageId: 'RNK-001',
    checkpointId: 'RNK-CP-003',
    prototypeId,
    permanentQlId: null,
    seed,
    locale: 'en-IN',
    contextId: context.id,
    firstName,
    secondName,
    stem: stemForCp003(evidence, context, firstName, secondName),
    displayedEvidence: evidence,
    answerSemantic,
    answerKey,
    answer,
    options,
    correctIndex,
    difficulty: difficultyForCp003(evidence),
    explanation: {
      keyRule: teaching.keyRule,
      stepByStepSolution: teaching.steps,
      examSpeedShortcut: teaching.shortcut,
      optionAnalysis: options.map((option, index) => `Option ${index + 1} (${option.label}): ${option.explanation}.`),
      conclusion: teaching.conclusion,
    },
    mathematicalFingerprint: fingerprintForCp003(evidence),
    lifecycle: {
      reviewStatus: 'UNREVIEWED',
      questionStudioDiscoverable: false,
      questionBankStatus: 'NOT_STORED',
      testEligibility: 'INELIGIBLE',
      publiclyPublishable: false,
    },
  };
}

export { RNK_CP003_PROTOTYPE_IDS };
