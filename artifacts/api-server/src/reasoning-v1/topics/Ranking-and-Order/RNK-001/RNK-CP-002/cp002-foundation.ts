import {
  RNK_CP002_CONTEXTS,
  RNK_CP002_NAMES,
  RNK_CP002_PROTOTYPE_IDS,
  answerSemanticForCp002,
  buildCp002State,
  createRng,
  evidenceForCp002,
  hashText,
  randomInt,
  solveCp002Canonical,
  solveCp002Independently,
  type RnkCp002Question,
  type RnkCp002PrototypeId,
} from './cp002-model';
import { refineCp002OptionRealism } from './cp002-option-realism';
import {
  buildCp002Options,
  calculationForCp002,
  difficultyForCp002,
  fingerprintForCp002,
  stemForCp002,
} from './cp002-renderer';

export * from './cp002-model';

export function generateRnkCp002Question(prototypeId: RnkCp002PrototypeId, seed: number): RnkCp002Question {
  const rng = createRng(prototypeId, seed);
  const context = RNK_CP002_CONTEXTS[randomInt(rng, 0, RNK_CP002_CONTEXTS.length - 1)];
  const firstNameIndex = randomInt(rng, 0, RNK_CP002_NAMES.length - 1);
  let secondNameIndex = randomInt(rng, 0, RNK_CP002_NAMES.length - 1);
  if (secondNameIndex === firstNameIndex) secondNameIndex = (secondNameIndex + 1) % RNK_CP002_NAMES.length;
  const firstName = RNK_CP002_NAMES[firstNameIndex];
  const secondName = RNK_CP002_NAMES[secondNameIndex];
  const state = buildCp002State(prototypeId, rng, seed);
  const evidence = evidenceForCp002(prototypeId, state, rng, seed);
  const answer = solveCp002Canonical(prototypeId, state, evidence);
  const independentAnswer = solveCp002Independently(evidence);
  if (answer !== independentAnswer) throw new Error(`${prototypeId}:${seed} canonical ${answer} disagrees with independent ${independentAnswer}`);
  const answerSemantic = answerSemanticForCp002(prototypeId);
  const correctIndex = hashText(`${prototypeId}:correct:${seed}`) % 4;
  const baseOptions = buildCp002Options(evidence, answer, answerSemantic, correctIndex);
  const options = refineCp002OptionRealism(evidence, answer, correctIndex, baseOptions);
  const calculation = calculationForCp002(evidence, context, firstName, secondName);

  return {
    packageId: 'RNK-001',
    checkpointId: 'RNK-CP-002',
    prototypeId,
    permanentQlId: null,
    seed,
    locale: 'en-IN',
    contextId: context.id,
    firstName,
    secondName,
    stem: stemForCp002(prototypeId, evidence, context, firstName, secondName),
    displayedEvidence: evidence,
    answerSemantic,
    answer,
    options,
    correctIndex,
    difficulty: difficultyForCp002(prototypeId, state, context, evidence),
    normalizedState: state,
    explanation: {
      keyRule: calculation.keyRule,
      stepByStepSolution: calculation.steps,
      examSpeedShortcut: calculation.shortcut,
      optionAnalysis: options.map((option, index) => `Option ${index + 1} (${option.label}): ${option.explanation}`),
      conclusion: `Therefore, the required ${answerSemantic.toLowerCase()} is ${answer}.`,
    },
    mathematicalFingerprint: fingerprintForCp002(evidence),
    lifecycle: {
      reviewStatus: 'UNREVIEWED',
      questionStudioDiscoverable: false,
      questionBankStatus: 'NOT_STORED',
      testEligibility: 'INELIGIBLE',
      publiclyPublishable: false,
    },
  };
}

export { RNK_CP002_PROTOTYPE_IDS };
