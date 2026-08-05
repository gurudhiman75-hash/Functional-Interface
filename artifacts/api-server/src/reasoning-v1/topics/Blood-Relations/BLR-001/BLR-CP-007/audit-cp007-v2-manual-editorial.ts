import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { BlrCp007V2Question } from "./cp007-v2-model";
import { generateBlrCp007V2Bank } from "./cp007-v2-runtime";

function wordCount(value: string): number {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function visibleExplanation(question: BlrCp007V2Question): string {
  return [
    ...question.explanation.steps,
    question.explanation.conclusion,
    question.explanation.shortcut ?? "",
    ...question.explanation.optionAnalysis.map((entry) => entry.explanation),
  ].join(" ");
}

const outputDirectory = resolve(process.argv[2] ?? "cp007-v2-output");
mkdirSync(outputDirectory, { recursive: true });
const bank = generateBlrCp007V2Bank();
const reviewHtml = readFileSync(
  resolve(outputDirectory, "blr-cp007-v2-review.html"),
  "utf8",
);

const directQuestions = bank.filter(
  (question) => question.explanation.mode === "DIRECT_LOOKUP_MINIMAL",
);
const missingPersonQuestions = bank.filter(
  (question) => question.query.kind === "MISSING_PERSON",
);
const genericConclusions = bank.filter((question) =>
  /only option that completes the required coded relation/iu.test(
    question.explanation.conclusion,
  ),
);
const broadWrongGenerationLabels = bank.flatMap((question) =>
  question.explanation.optionAnalysis.filter((analysis) =>
    analysis.explanation.startsWith("Wrong generation:"),
  ),
);
const directLookupRepetitionDefects = directQuestions.filter((question) => {
  const correct = question.explanation.optionAnalysis[question.correctIndex]!;
  return (
    question.explanation.steps.length !== 2 ||
    !/direct match with the relation asked/iu.test(question.explanation.steps[1]!) ||
    /\btherefore\b/iu.test(correct.explanation)
  );
});
const unfocusedMissingPersonQuestions = missingPersonQuestions.filter(
  (question) => question.explanation.steps.length > 4,
);
const genderUnsupportedClaimsExplained = bank.flatMap((question) =>
  question.explanation.optionAnalysis.filter((analysis) =>
    /gender is not given/iu.test(analysis.explanation),
  ),
).length;
const explanationWordCounts = bank.map(visibleExplanation).map(wordCount);
const analysisPanels = (
  reviewHtml.match(/class="analysis-panel"/gu) ?? []
).length;
const optionalDiagramPanels = (
  reviewHtml.match(/class="diagram-panel"/gu) ?? []
).length;
const expandedAnalysisPanels = (
  reviewHtml.match(/<details class="analysis-panel"[^>]*\sopen(?:\s|>)/gu) ?? []
).length;
const expandedDiagramPanels = (
  reviewHtml.match(/<details class="diagram-panel"[^>]*\sopen(?:\s|>)/gu) ?? []
).length;

const audit = {
  status: "CP007_V2_MANUAL_EDITORIAL_AUDIT_PASSED",
  questionsReviewed: bank.length,
  optionExplanationsReviewed: bank.reduce(
    (total, question) => total + question.explanation.optionAnalysis.length,
    0,
  ),
  genericConclusions: genericConclusions.length,
  broadWrongGenerationLabels: broadWrongGenerationLabels.length,
  directLookupQuestions: directQuestions.length,
  directLookupRepetitionDefects: directLookupRepetitionDefects.length,
  missingPersonQuestions: missingPersonQuestions.length,
  focusedMissingPersonQuestions:
    missingPersonQuestions.length - unfocusedMissingPersonQuestions.length,
  unfocusedMissingPersonQuestions: unfocusedMissingPersonQuestions.length,
  genderUnsupportedClaimsExplained,
  maximumVisibleExplanationWords: Math.max(...explanationWordCounts),
  averageVisibleExplanationWords: Number(
    (
      explanationWordCounts.reduce((total, value) => total + value, 0) /
      explanationWordCounts.length
    ).toFixed(2),
  ),
  explanationWordLimit: 300,
  optionAnalysisPanels: analysisPanels,
  optionalDiagramPanels,
  expandedOptionAnalysisPanels: expandedAnalysisPanels,
  expandedDiagramPanels,
  humanApprovalStatus: "PENDING",
} as const;

if (audit.questionsReviewed !== 168) throw new Error("Expected 168 questions.");
if (audit.optionExplanationsReviewed !== 672) {
  throw new Error("Expected 672 option explanations.");
}
if (audit.genericConclusions !== 0) throw new Error("Generic conclusions remain.");
if (audit.broadWrongGenerationLabels !== 0) {
  throw new Error("Broad wrong-generation labels remain.");
}
if (audit.directLookupQuestions !== 8 || audit.directLookupRepetitionDefects !== 0) {
  throw new Error("Direct-lookup explanation defects remain.");
}
if (
  audit.missingPersonQuestions !== 32 ||
  audit.focusedMissingPersonQuestions !== 32 ||
  audit.unfocusedMissingPersonQuestions !== 0
) {
  throw new Error("Missing-person explanations are not fully focused.");
}
if (audit.genderUnsupportedClaimsExplained !== 8) {
  throw new Error("Expected eight unsupported-gender explanations.");
}
if (audit.maximumVisibleExplanationWords > audit.explanationWordLimit) {
  throw new Error("Explanation word limit exceeded.");
}
if (audit.optionAnalysisPanels !== 168 || audit.optionalDiagramPanels !== 168) {
  throw new Error("Progressive-disclosure panels are incomplete.");
}
if (audit.expandedOptionAnalysisPanels || audit.expandedDiagramPanels) {
  throw new Error("Optional review panels must be collapsed by default.");
}

writeFileSync(
  resolve(outputDirectory, "blr-cp007-v2-manual-editorial-audit.json"),
  `${JSON.stringify(audit, null, 2)}\n`,
);
writeFileSync(
  resolve(outputDirectory, "BLR-CP-007-V2-MANUAL-EDITORIAL-AUDIT.md"),
  `# BLR-CP-007 V2 Manual Editorial Audit\n\nStatus: **passed as a model-assisted full-corpus editorial audit; human approval remains pending**.\n\n## Reviewed surface\n\n\`\`\`text\nquestions reviewed:                         ${audit.questionsReviewed}\noption explanations reviewed:               ${audit.optionExplanationsReviewed}\ngeneric conclusions:                        ${audit.genericConclusions}\nbroad wrong-generation labels:              ${audit.broadWrongGenerationLabels}\ndirect-lookup repetition defects:           ${audit.directLookupRepetitionDefects}\nfocused missing-person explanations:         ${audit.focusedMissingPersonQuestions} / ${audit.missingPersonQuestions}\ngender-unsupported claims explained:        ${audit.genderUnsupportedClaimsExplained}\nmaximum visible explanation words:          ${audit.maximumVisibleExplanationWords}\naverage visible explanation words:          ${audit.averageVisibleExplanationWords}\noption-analysis panels collapsed by default: ${audit.optionAnalysisPanels} / 168\noptional diagram panels collapsed by default:${audit.optionalDiagramPanels} / 168\n\`\`\`\n\n## Editorial decisions\n\n- The main solution shows the decisive family chain rather than every candidate branch.\n- Conclusions are specific to expression, token, ordered-pair, missing-person or validity tasks.\n- Wrong options state the actual resulting relation instead of relying on a broad template.\n- Gendered claims are rejected as unproved when the graph establishes only a gender-neutral relation.\n- Detailed option diagnostics and diagrams remain available, but are collapsed by default to keep the learner-facing explanation uncluttered.\n\nThis audit does not self-authorise English freeze, localisation, publication, Question Studio exposure or merge.\n`,
);

console.log(JSON.stringify(audit, null, 2));
