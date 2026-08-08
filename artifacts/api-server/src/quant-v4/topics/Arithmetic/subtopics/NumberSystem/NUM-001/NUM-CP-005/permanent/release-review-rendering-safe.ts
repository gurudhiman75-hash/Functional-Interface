function replaceUnsafePowerShorthand(value) {
  return value
    .replaceAll("p³q", "\\(p^{3}q\\)")
    .replaceAll("p²q", "\\(p^{2}q\\)")
    .replaceAll("p⁷", "\\(p^{7}\\)")
    .replaceAll("p⁵", "\\(p^{5}\\)")
    .replaceAll("p³", "\\(p^{3}\\)")
    .replaceAll("p⁰=1", "\\(p^{0}=1\\)");
}

export function applyNumCp005ReleaseReviewRenderingSafety(explanation) {
  return {
    ...explanation,
    coreConcept: replaceUnsafePowerShorthand(explanation.coreConcept),
    givenDataAndStrategy: replaceUnsafePowerShorthand(explanation.givenDataAndStrategy),
    stepByStep: explanation.stepByStep.map(replaceUnsafePowerShorthand),
    examSpeedMethod: replaceUnsafePowerShorthand(explanation.examSpeedMethod),
    commonTraps: explanation.commonTraps.map(replaceUnsafePowerShorthand),
    finalAnswer: replaceUnsafePowerShorthand(explanation.finalAnswer),
  };
}
