function normalizeLine(value) {
  return value.trim().toLowerCase().replace(/\s+/gu, " ");
}

function fixSimpleGrammar(value) {
  return value
    .replace(/(^|[\s(])1 choices\b/gu, "$11 choice")
    .replace(/\b2th\b/gu, "2nd")
    .replace(/\b3th\b/gu, "3rd");
}

function wordCount(value) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

const machineLanguagePattern =
  /\b(?:governed|admissible|independently|exponent-choice|set-difference|canonical|verifier|semantic|bounded optimisation|retain)\b/iu;

export function enforceNumCp005StudentExplanationPolicy(input, explanation) {
  const coreConcept = fixSimpleGrammar(explanation.coreConcept);
  const givenDataAndStrategy = fixSimpleGrammar(explanation.givenDataAndStrategy);
  const finalAnswer = fixSimpleGrammar(explanation.finalAnswer);
  const seen = new Set([
    normalizeLine(coreConcept),
    normalizeLine(givenDataAndStrategy),
    normalizeLine(finalAnswer),
  ]);

  const stepByStep = [];
  for (const rawStep of explanation.stepByStep) {
    const step = fixSimpleGrammar(rawStep);
    const normalized = normalizeLine(step);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    stepByStep.push(step);
  }

  const examSpeedMethod = fixSimpleGrammar(explanation.examSpeedMethod);
  const traps = explanation.commonTraps.map(fixSimpleGrammar);
  const commonTraps = [...new Map(traps.map((trap) => [normalizeLine(trap), trap])).values()];

  const polished = {
    coreConcept,
    givenDataAndStrategy,
    stepByStep,
    examSpeedMethod,
    commonTraps,
    finalAnswer,
  };

  const lines = [
    polished.coreConcept,
    polished.givenDataAndStrategy,
    ...polished.stepByStep,
    polished.examSpeedMethod,
    ...polished.commonTraps,
    polished.finalAnswer,
  ];
  const joined = lines.join("\n");

  if (machineLanguagePattern.test(joined)) {
    throw new Error(`${input.qlId}/${input.seed}: machine-like wording entered the student explanation`);
  }
  if (/(^|[\s(])1 choices\b/iu.test(joined) || /\b(?:1th|2th|3th)\b/iu.test(joined)) {
    throw new Error(`${input.qlId}/${input.seed}: broken learner-facing grammar`);
  }
  if (polished.stepByStep.length < 2) {
    throw new Error(`${input.qlId}/${input.seed}: explanation needs at least two working steps`);
  }
  if (polished.commonTraps.length !== 3) {
    throw new Error(`${input.qlId}/${input.seed}: three different question checks are required`);
  }
  if (lines.some((line) => wordCount(line) > 32)) {
    throw new Error(`${input.qlId}/${input.seed}: explanation sentence is too long`);
  }
  if (!polished.finalAnswer.includes(input.canonicalAnswer)) {
    throw new Error(`${input.qlId}/${input.seed}: final answer does not match the question`);
  }

  return polished;
}
