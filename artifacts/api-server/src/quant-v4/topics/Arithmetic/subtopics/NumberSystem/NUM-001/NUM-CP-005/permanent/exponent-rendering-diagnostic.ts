import { NUM_CP005_PERMANENT_ALLOCATION } from "./allocation";
import { runNumCp005PermanentPipeline } from "./runtime";

const unbracedPowerPattern = /\^[a-zA-Z0-9]/gu;
const leftSuperscriptPattern = /[²³¹⁰⁴⁵⁶⁷⁸⁹]\s*[0-9a-zA-Z]/gu;
const calculationMarkerPattern = /(?:=|\\times|\\div|\\frac|\\lfloor|\bso\b|\bhence\b|\btherefore\b)/iu;
const renderingViolations: string[] = [];
const calculationViolations: string[] = [];

for (const allocation of NUM_CP005_PERMANENT_ALLOCATION) {
  for (let seed = 1; seed <= 48; seed += 1) {
    const question = runNumCp005PermanentPipeline({ questionLanguageId: allocation.qlId, seed });
    const fields = [
      ["stem", question.stem],
      ...question.options.map((option, index) => [`option-${index + 1}`, option.value] as const),
      ["core", question.explanation.coreConcept],
      ["strategy", question.explanation.givenDataAndStrategy],
      ...question.explanation.stepByStep.map((step, index) => [`step-${index + 1}`, step] as const),
      ["speed", question.explanation.examSpeedMethod],
      ...question.explanation.commonTraps.map((trap, index) => [`trap-${index + 1}`, trap] as const),
      ["final", question.explanation.finalAnswer],
    ] as const;

    for (const [label, value] of fields) {
      const unbraced = [...value.matchAll(unbracedPowerPattern)].map((match) => match[0]);
      const left = [...value.matchAll(leftSuperscriptPattern)].map((match) => match[0]);
      const openings = value.match(/\\\(/g)?.length ?? 0;
      const closings = value.match(/\\\)/g)?.length ?? 0;
      if (unbraced.length || left.length || openings !== closings) {
        renderingViolations.push(JSON.stringify({ qlId: allocation.qlId, seed, label, unbraced, left, openings, closings, value }));
      }
    }

    if (!question.explanation.stepByStep.some((step) => calculationMarkerPattern.test(step))) {
      calculationViolations.push(JSON.stringify({
        qlId: allocation.qlId,
        seed,
        stem: question.stem,
        steps: question.explanation.stepByStep,
      }));
    }
  }
}

if (renderingViolations.length > 0 || calculationViolations.length > 0) {
  throw new Error([
    renderingViolations.length
      ? `NUM-CP-005 exponent rendering diagnostics:\n${renderingViolations.slice(0, 30).join("\n")}`
      : "",
    calculationViolations.length
      ? `NUM-CP-005 calculation completeness diagnostics:\n${calculationViolations.slice(0, 30).join("\n")}`
      : "",
  ].filter(Boolean).join("\n"));
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_RENDERING_AND_CALCULATION_DIAGNOSTIC",
  checkedQuestions: NUM_CP005_PERMANENT_ALLOCATION.length * 48,
  renderingViolations: 0,
  calculationViolations: 0,
}, null, 2));
