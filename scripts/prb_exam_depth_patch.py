from pathlib import Path

ROOT = Path("artifacts/api-server/src/quant-v4/topics/Probability")


def replace_once(path: Path, old: str, new: str, label: str) -> None:
    text = path.read_text()
    if new in text:
        return
    if old not in text:
        raise SystemExit(f"Could not patch {label} in {path}")
    path.write_text(text.replace(old, new, 1))


remodeler = ROOT / "shared/exam-depth-remodeler.ts"
replace_once(
    remodeler,
    "function probabilityLine(favourable: number | bigint, total: number | bigint, answer: string): string {",
    "function probabilityLine(favourable: number | bigint | string, total: number | bigint | string, answer: string): string {",
    "rendered evidence count typing",
)

pipeline = ROOT / "shared/pipeline.ts"
replace_once(
    pipeline,
    'import { explanationWordCount, renderProbabilityExplanation } from "./explanation-renderer";\n',
    'import { explanationWordCount, renderProbabilityExplanation } from "./explanation-renderer";\nimport { remodelProbabilityExplanation, remodelProbabilityStem } from "./exam-depth-remodeler";\n',
    "pipeline remodeler import",
)
replace_once(
    pipeline,
    '  const stem = renderStudentFacingStem(entry, parameters, solved, event, legacyStem);\n  const explanation = renderProbabilityExplanation(entry, language, parameters, solved, verification, visuals);\n',
    '  const baseStem = renderStudentFacingStem(entry, parameters, solved, event, legacyStem);\n  const stem = remodelProbabilityStem(entry, parameters, solved, baseStem);\n  const baseExplanation = renderProbabilityExplanation(entry, language, parameters, solved, verification, visuals);\n  const explanation = remodelProbabilityExplanation(entry, parameters, solved, baseExplanation);\n',
    "pipeline remodeler calls",
)
replace_once(
    pipeline,
    'explanationId: `${entry.qlId}-${entry.explanationStrategyId}-CONCRETE-V3`',
    'explanationId: `${entry.qlId}-${entry.explanationStrategyId}-EXAM-DEPTH-V4`',
    "explanation id version",
)
replace_once(
    pipeline,
    'studentRendererVersion: "PRB-STUDENT-RENDERER-V3",\n      explanationVersion: "PRB-CONCRETE-EXPLANATION-V3",',
    'studentRendererVersion: "PRB-EXAM-DEPTH-RENDERER-V4",\n      explanationVersion: "PRB-EXAM-DEPTH-EXPLANATION-V4",',
    "traceability versions",
)

validator = ROOT / "shared/validator.ts"
validator_helpers = '''

const EXAM_DEPTH_MODES = new Set([
  "findSimultaneousSameTypeProbability", "findSimultaneousDifferentTypeProbability", "findExactCompositionProbability",
  "findSelectionProbabilityUsingCombination", "findNoObjectOfTypeProbability", "findAtLeastOneObjectOfType",
  "findSuccessiveIndependentProbability", "findWithReplacementProbability", "findSuccessiveDependentProbability",
  "findWithoutReplacementProbability", "findOrderedDrawSequenceProbability", "findSameTypeInSuccessiveDraws",
  "findDifferentTypesInSuccessiveDraws", "findAtLeastOneAcrossIndependentStages",
  "findConditionalProbabilityByCounting", "findConditionalFromTwoWayTable", "findConditionalCardProbability",
  "findConditionalUrnProbability", "findReverseConditionalCount", "findCommitteeCompositionProbability",
  "findRestrictedSelectionProbability", "findReverseCountFromProbability", "findTogetherOrApartProbability",
  "findPositionRestrictionProbability", "findNumberFormationProbability", "findUnionProbability",
  "findIntersectionProbability", "findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability",
  "findNeitherEventProbability", "findMissingIntersectionOrUnionProbability", "findMutuallyExclusiveUnion",
  "findIndependentIntersection",
]);

function hasMethodDecision(explanation: string[]): boolean {
  const value = explanation.join(" ");
  return /because|since|use combinations|order does not matter|replacement|without replacement|complement|restricted sample space|sample space|overlap|counted twice|one block|last digit|mutually exclusive|independent|both orders|possible selections|required people|C\\(|P\\(/i.test(value);
}
'''
replace_once(
    validator,
    '\nexport function validateProbabilityQuestion(args: {',
    validator_helpers + '\nexport function validateProbabilityQuestion(args: {',
    "validator exam-depth helpers",
)
replace_once(
    validator,
    '  checks.push(check("simple-explanation-length", explanationWords >= 12 && explanationWords <= 120, `Explanation has ${explanationWords} words; expected 12-120.`));\n  checks.push(check("contextual-explanation", !hasGenericExplanation(explanation), "The explanation states generic counts or uses unnatural instructional wording."));',
    '  checks.push(check("simple-explanation-length", explanationWords >= 12 && explanationWords <= 120, `Explanation has ${explanationWords} words; expected 12-120.`));\n  checks.push(check("difficulty-appropriate-explanation-depth", entry.difficulty === "Easy" || explanationWords >= 20, `Medium/Hard explanation has only ${explanationWords} words; expected at least 20.`));\n  checks.push(check("exam-depth-decision-path", !EXAM_DEPTH_MODES.has(entry.solveMode) || (explanation.length >= 3 && hasMethodDecision(explanation)), "A multi-step explanation must state the method decision and show at least three reasoning lines."));\n  checks.push(check("contextual-explanation", !hasGenericExplanation(explanation), "The explanation states generic counts or uses unnatural instructional wording."));',
    "validator exam-depth checks",
)

workflow = Path(".github/workflows/prb-editorial-remediation.yml")
replace_once(
    workflow,
    '      - name: Verify generated review evidence\n',
    '      - name: Permanent exam-depth audit\n        run: python artifacts/api-server/src/quant-v4/topics/Probability/exam-depth-review-audit.py\n\n      - name: Verify generated review evidence\n',
    "workflow exam-depth audit",
)
replace_once(
    workflow,
    '      - name: Upload comprehensive Markdown\n        uses: actions/upload-artifact@v4\n        with:\n          name: probability-contextual-questions\n          path: artifacts/api-server/src/quant-v4/topics/Probability/PROBABILITY-COMPREHENSIVE-QUESTIONS-AND-EXPLANATIONS.md\n',
    '      - name: Upload review Markdown files\n        uses: actions/upload-artifact@v4\n        with:\n          name: probability-cutting-edge-review\n          path: |\n            artifacts/api-server/src/quant-v4/topics/Probability/PROBABILITY-COMPREHENSIVE-QUESTIONS-AND-EXPLANATIONS.md\n            artifacts/api-server/src/quant-v4/topics/Probability/PROBABILITY-REVIEW-QUESTIONS-AND-EXPLANATIONS.md\n',
    "workflow artifact upload",
)
replace_once(
    workflow,
    '            artifacts/api-server/src/quant-v4/topics/Probability/PROBABILITY-COMPREHENSIVE-QUESTIONS-AND-EXPLANATIONS.md\n',
    '            artifacts/api-server/src/quant-v4/topics/Probability/PROBABILITY-COMPREHENSIVE-QUESTIONS-AND-EXPLANATIONS.md\n            artifacts/api-server/src/quant-v4/topics/Probability/PROBABILITY-REVIEW-QUESTIONS-AND-EXPLANATIONS.md\n',
    "workflow review markdown target",
)

print("Probability exam-depth integration patch applied.")
