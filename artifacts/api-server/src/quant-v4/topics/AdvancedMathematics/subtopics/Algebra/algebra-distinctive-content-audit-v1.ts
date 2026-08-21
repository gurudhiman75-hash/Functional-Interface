import fs from "node:fs";
import path from "node:path";

import {
  ALGEBRA_QUESTION_STUDIO_PATTERNS,
  type AlgebraQuestionStudioPattern,
} from "./algebra-question-studio-runtime-v1";
import {
  ALGEBRA_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY,
  generateAlgebraStudioQuestionV3,
  type AlgebraQuestionStudioQuestionV3,
} from "./algebra-question-studio-runtime-v3";

export const ALGEBRA_DISTINCTIVE_CONTENT_AUDIT_V1_AUTHORITY =
  "ALGEBRA-DISTINCTIVE-CONTENT-AUDIT-V1" as const;

const SAMPLES_PER_PATTERN = 16;
const LABELS = ["A", "B", "C", "D"] as const;

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "OPPORTUNITY";
type Category =
  | "VALIDITY"
  | "DUPLICATION"
  | "EDITORIAL"
  | "NUMERICAL_DIVERSITY"
  | "EXPLANATION"
  | "DISTRACTOR"
  | "EXAM_REALISM"
  | "DISTINCTIVENESS";

interface Finding {
  severity: Severity;
  category: Category;
  cpId: string;
  qlId: string;
  patternId: string;
  code: string;
  note: string;
  exampleStem: string;
}

interface AuditRecord {
  cpId: string;
  qlId: string;
  patternId: string;
  solveMode: string;
  difficulty: string;
  answerFamily: string;
  seed: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  explanationSteps: readonly string[];
  canonicalAnswer: unknown;
}

function normalizeVisible(text: string) {
  return text
    .toLowerCase()
    .replace(/\$\$[\s\S]*?\$\$/g, " <math> ")
    .replace(/\$[^$]+\$/g, " <math> ")
    .replace(/\\\([^)]*\\\)/g, " <math> ")
    .replace(/\\\[[\s\S]*?\\\]/g, " <math> ")
    .replace(/[−–—]/g, "-")
    .replace(/\b-?\d+(?:\.\d+)?(?:\s*\/\s*\d+)?\b/g, " <n> ")
    .replace(/[αβγλμθ]/g, "<v>")
    .replace(/\s+/g, " ")
    .trim();
}

function stemShape(stem: string) {
  return normalizeVisible(stem)
    .replace(/\b(?:x|y|z|a|b|c|k|m|n|p|q|r|t)\b/g, "<v>")
    .replace(/[(){}[\],;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function openingShape(stem: string) {
  return stemShape(stem).split(/\s+/).slice(0, 7).join(" ");
}

function stateFingerprint(question: AlgebraQuestionStudioQuestionV3) {
  return [question.stem, ...question.options].join("\n");
}

function explanationFingerprint(question: AlgebraQuestionStudioQuestionV3) {
  return question.explanation.steps.join("\n");
}

function distractorFingerprint(question: AlgebraQuestionStudioQuestionV3) {
  return question.optionDetails
    .filter((option) => !option.isCorrect)
    .map((option) => normalizeVisible(option.text))
    .sort()
    .join("|");
}

function answerFamily(question: AlgebraQuestionStudioQuestionV3) {
  const answer = question.canonicalAnswer as any;
  if (answer && typeof answer === "object" && typeof answer.kind === "string") return answer.kind;
  return typeof answer === "string" ? "STRING_RELATION" : typeof answer;
}

function visibleText(question: AlgebraQuestionStudioQuestionV3) {
  return [question.stem, ...question.options, ...question.explanation.steps].join("\n");
}

function internalCodeLeak(text: string) {
  return /\b(?:ALG-(?:CP|QL|PROT|DIST)|prototypeId|variantIndex|integrationAuthority|deliveryAuthority|canonicalItemId)\b/i.test(text);
}

function malformedMath(text: string) {
  const dollars = text.match(/\$/g)?.length ?? 0;
  return dollars % 2 !== 0 || /\\(?:undefined|nan)\b/i.test(text);
}

function setterShorthand(stem: string) {
  return /(?:^|[,;:(]\s*)(?:x|y|z|a|b|c|k|m|n|p|q|r)\s*=\s*-?\d/i.test(stem)
    && !/\bif\b/i.test(stem);
}

function hasQuestionIntent(stem: string) {
  return /\?|\b(?:find|determine|calculate|which|what|how many|value|roots?|solution|relation|sufficient|maximum|minimum|range|remainder|coefficient|factor)\b/i.test(stem);
}

function explanationSpecificity(question: AlgebraQuestionStudioQuestionV3) {
  const text = question.explanation.steps.join(" ");
  const numericOrMathTokens = text.match(/(?:-?\d+(?:\.\d+)?|[=+\-×÷√²³]|\b(?:x|y|z|a|b|c|k|m|n)\b)/g) ?? [];
  return numericOrMathTokens.length;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function ratioScore(uniqueCount: number, total: number, floorRatio: number) {
  if (total <= 0) return 0;
  const ratio = uniqueCount / total;
  return clamp(((ratio - floorRatio) / (1 - floorRatio)) * 100);
}

function countBy<T>(items: readonly T[], keyOf: (item: T) => string) {
  const result: Record<string, number> = {};
  for (const item of items) {
    const key = keyOf(item);
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
}

const records: AuditRecord[] = [];
const questions: AlgebraQuestionStudioQuestionV3[] = [];
const findings: Finding[] = [];

function addFinding(
  pattern: AlgebraQuestionStudioPattern,
  severity: Severity,
  category: Category,
  code: string,
  note: string,
  exampleStem: string,
) {
  findings.push({
    severity,
    category,
    cpId: pattern.cpId,
    qlId: pattern.qlId,
    patternId: pattern.prototypeId,
    code,
    note,
    exampleStem,
  });
}

for (const pattern of ALGEBRA_QUESTION_STUDIO_PATTERNS) {
  for (let index = 0; index < SAMPLES_PER_PATTERN; index += 1) {
    const seed = `algebra-distinctive-v1:${pattern.prototypeId}:${index}`;
    const question = generateAlgebraStudioQuestionV3({
      pattern,
      language: "en",
      examProfile: "SSC_CORE",
      seed,
    });
    questions.push(question);
    records.push({
      cpId: question.cpId,
      qlId: question.qlId,
      patternId: question.patternId,
      solveMode: question.solveMode,
      difficulty: question.difficultyBand,
      answerFamily: answerFamily(question),
      seed: question.seed,
      stem: question.stem,
      options: question.options,
      correctIndex: question.correctIndex,
      explanationSteps: question.explanation.steps,
      canonicalAnswer: question.canonicalAnswer,
    });

    if (!question.validation.valid) {
      addFinding(pattern, "CRITICAL", "VALIDITY", "INVALID_QUESTION", "Question Studio validation failed.", question.stem);
    }
    if (question.options.length !== 4 || new Set(question.options).size !== 4) {
      addFinding(pattern, "CRITICAL", "VALIDITY", "OPTION_CONTRACT", "Question does not expose four distinct options.", question.stem);
    }
    if (question.options[question.correctIndex] !== question.answer) {
      addFinding(pattern, "CRITICAL", "VALIDITY", "ANSWER_PARITY", "Correct option does not match the rendered answer.", question.stem);
    }
    const visible = visibleText(question);
    if (internalCodeLeak(visible)) {
      addFinding(pattern, "HIGH", "EDITORIAL", "INTERNAL_CODE_LEAK", "Learner-visible text leaks an internal Algebra identifier.", question.stem);
    }
    if (malformedMath(visible)) {
      addFinding(pattern, "HIGH", "EDITORIAL", "MALFORMED_MATH", "Learner-visible math delimiters or tokens appear malformed.", question.stem);
    }
    if (!hasQuestionIntent(question.stem)) {
      addFinding(pattern, "MEDIUM", "EXAM_REALISM", "WEAK_QUESTION_INTENT", "Stem does not clearly express an exam task or target.", question.stem);
    }
    if (setterShorthand(question.stem)) {
      addFinding(pattern, "LOW", "EDITORIAL", "SETTER_SHORTHAND", "Stem looks like internal setter shorthand; inspect for more natural exam prose.", question.stem);
    }
    if (question.explanation.steps.length < 2) {
      addFinding(pattern, "HIGH", "EXPLANATION", "THIN_EXPLANATION", "Explanation has fewer than two visible reasoning steps.", question.stem);
    } else if (explanationSpecificity(question) < 3) {
      addFinding(pattern, "MEDIUM", "EXPLANATION", "LOW_EXPLANATION_SPECIFICITY", "Explanation is structurally valid but contains little question-specific mathematical working.", question.stem);
    }
  }
}

const questionsByPattern = new Map<string, AlgebraQuestionStudioQuestionV3[]>();
for (const question of questions) {
  const bucket = questionsByPattern.get(question.patternId) ?? [];
  bucket.push(question);
  questionsByPattern.set(question.patternId, bucket);
}

const patternMetrics: Array<{
  cpId: string;
  qlId: string;
  patternId: string;
  solveMode: string;
  difficulty: string;
  answerFamily: string;
  stateCount: number;
  stemCount: number;
  stemShapeCount: number;
  explanationCount: number;
  distractorSetCount: number;
  answerPositionCount: number;
  signatureCollisionQlCount: number;
  distinctiveScore: number;
}> = [];

const shapeToQuestions = new Map<string, AlgebraQuestionStudioQuestionV3[]>();
for (const question of questions) {
  const shape = stemShape(question.stem);
  const bucket = shapeToQuestions.get(shape) ?? [];
  bucket.push(question);
  shapeToQuestions.set(shape, bucket);
}

for (const pattern of ALGEBRA_QUESTION_STUDIO_PATTERNS) {
  const bucket = questionsByPattern.get(pattern.prototypeId) ?? [];
  if (!bucket.length) throw new Error(`No audit questions generated for ${pattern.prototypeId}`);
  const stateCount = new Set(bucket.map(stateFingerprint)).size;
  const stemCount = new Set(bucket.map((question) => question.stem)).size;
  const stemShapeCount = new Set(bucket.map((question) => stemShape(question.stem))).size;
  const explanationCount = new Set(bucket.map(explanationFingerprint)).size;
  const distractorSetCount = new Set(bucket.map(distractorFingerprint)).size;
  const answerPositionCount = new Set(bucket.map((question) => question.correctIndex)).size;
  const shape = stemShape(bucket[0]!.stem);
  const collisionQlCount = new Set((shapeToQuestions.get(shape) ?? []).map((question) => question.qlId)).size;

  if (stateCount < 12) {
    addFinding(pattern, "HIGH", "NUMERICAL_DIVERSITY", "LOW_STATE_DIVERSITY", `${pattern.prototypeId} produced only ${stateCount}/${SAMPLES_PER_PATTERN} distinct stem+option states.`, bucket[0]!.stem);
  }
  if (stemCount < 10) {
    addFinding(pattern, "MEDIUM", "DUPLICATION", "LOW_STEM_SURFACE_DIVERSITY", `${pattern.prototypeId} produced only ${stemCount}/${SAMPLES_PER_PATTERN} distinct visible stems.`, bucket[0]!.stem);
  }
  if (explanationCount < 8) {
    addFinding(pattern, "MEDIUM", "EXPLANATION", "LOW_EXPLANATION_DIVERSITY", `${pattern.prototypeId} produced only ${explanationCount}/${SAMPLES_PER_PATTERN} distinct explanations.`, bucket[0]!.stem);
  }
  if (distractorSetCount < 4) {
    addFinding(pattern, "MEDIUM", "DISTRACTOR", "LOW_DISTRACTOR_SET_DIVERSITY", `${pattern.prototypeId} produced only ${distractorSetCount} distinct wrong-option sets.`, bucket[0]!.stem);
  }
  if (answerPositionCount < 4) {
    addFinding(pattern, "MEDIUM", "DISTRACTOR", "ANSWER_POSITION_NOT_SATURATED", `${pattern.prototypeId} reached ${answerPositionCount}/4 answer positions across ${SAMPLES_PER_PATTERN} states.`, bucket[0]!.stem);
  }
  if (stemShapeCount === 1) {
    addFinding(pattern, "OPPORTUNITY", "DISTINCTIVENESS", "SINGLE_STEM_SHAPE", "Mathematical states vary, but this prototype still presents one normalized stem shape; candidate for a safe ExamTree-authored surface-variation overlay.", bucket[0]!.stem);
  }
  if (collisionQlCount >= 3) {
    addFinding(pattern, "HIGH", "DUPLICATION", "CROSS_QL_STEM_SHAPE_COLLISION", `The same normalized stem shape appears across ${collisionQlCount} permanent QLs.`, bucket[0]!.stem);
  }

  const stateScore = ratioScore(stateCount, SAMPLES_PER_PATTERN, 0.35);
  const stemScore = ratioScore(stemCount, SAMPLES_PER_PATTERN, 0.35);
  const explanationScore = ratioScore(explanationCount, SAMPLES_PER_PATTERN, 0.25);
  const distractorScore = ratioScore(distractorSetCount, SAMPLES_PER_PATTERN, 0.10);
  const shapeUniquenessScore = collisionQlCount === 1 ? 100 : collisionQlCount === 2 ? 70 : collisionQlCount === 3 ? 40 : 10;
  const answerPositionScore = answerPositionCount * 25;
  const distinctiveScore = Math.round(
    stateScore * 0.28
    + stemScore * 0.20
    + explanationScore * 0.16
    + distractorScore * 0.12
    + shapeUniquenessScore * 0.14
    + answerPositionScore * 0.10,
  );

  patternMetrics.push({
    cpId: pattern.cpId,
    qlId: pattern.qlId,
    patternId: pattern.prototypeId,
    solveMode: pattern.solveModeId,
    difficulty: bucket[0]!.difficultyBand,
    answerFamily: answerFamily(bucket[0]!),
    stateCount,
    stemCount,
    stemShapeCount,
    explanationCount,
    distractorSetCount,
    answerPositionCount,
    signatureCollisionQlCount: collisionQlCount,
    distinctiveScore,
  });
}

const exactStemCounts = countBy(questions, (question) => question.stem);
const duplicateExactStems = Object.entries(exactStemCounts).filter(([, count]) => count > 1);
const openingCounts = countBy(questions, (question) => openingShape(question.stem));
const openingLeaders = Object.entries(openingCounts).sort((a, b) => b[1] - a[1]).slice(0, 20);
const answerFamilyCounts = countBy(records, (record) => record.answerFamily);
const difficultyCounts = countBy(records, (record) => record.difficulty);
const answerPositionCounts = countBy(records, (record) => LABELS[record.correctIndex] ?? "?");
const severityCounts = countBy(findings, (finding) => finding.severity);
const categoryCounts = countBy(findings, (finding) => finding.category);
const codeCounts = countBy(findings, (finding) => finding.code);

const scores = patternMetrics.map((metric) => metric.distinctiveScore).sort((a, b) => a - b);
const averageScore = scores.reduce((sum, score) => sum + score, 0) / Math.max(1, scores.length);
const medianScore = scores[Math.floor(scores.length / 2)] ?? 0;
const lowScorePatterns = patternMetrics.filter((metric) => metric.distinctiveScore < 70);
const criticalCount = findings.filter((finding) => finding.severity === "CRITICAL").length;
const highCount = findings.filter((finding) => finding.severity === "HIGH").length;
const highDuplicationCount = findings.filter((finding) => finding.severity === "HIGH" && finding.category === "DUPLICATION").length;

let decision = "DISTINCTIVE_READY";
if (criticalCount > 0) decision = "BLOCKED_STRUCTURAL_REMEDIATION_REQUIRED";
else if (highDuplicationCount > 0 || medianScore < 70 || lowScorePatterns.length > Math.ceil(patternMetrics.length * 0.15)) {
  decision = "FOCUSED_DISTINCTIVENESS_REMEDIATION_REQUIRED";
} else if (highCount > 0 || medianScore < 85) {
  decision = "EXAM_READY_WITH_TARGETED_INNOVATION_PASS_RECOMMENDED";
}

const cpSummaries = [...new Set(patternMetrics.map((metric) => metric.cpId))].map((cpId) => {
  const metrics = patternMetrics.filter((metric) => metric.cpId === cpId);
  const cpScores = metrics.map((metric) => metric.distinctiveScore);
  return {
    cpId,
    patternCount: metrics.length,
    qlCount: new Set(metrics.map((metric) => metric.qlId)).size,
    answerFamilies: [...new Set(metrics.map((metric) => metric.answerFamily))].sort(),
    averageDistinctiveScore: Number((cpScores.reduce((sum, score) => sum + score, 0) / cpScores.length).toFixed(1)),
    lowScorePatternCount: metrics.filter((metric) => metric.distinctiveScore < 70).length,
    singleStemShapeCount: metrics.filter((metric) => metric.stemShapeCount === 1).length,
    findingCounts: countBy(findings.filter((finding) => finding.cpId === cpId), (finding) => `${finding.severity}:${finding.code}`),
  };
});

const innovationCandidates = patternMetrics
  .filter((metric) => metric.stemShapeCount === 1 || metric.distinctiveScore < 78)
  .sort((a, b) => a.distinctiveScore - b.distinctiveScore)
  .slice(0, 40)
  .map((metric) => ({
    ...metric,
    recommendation: metric.signatureCollisionQlCount >= 3
      ? "Prioritize a semantically equivalent but differently framed ExamTree-authored stem family."
      : metric.stateCount < 12
        ? "Expand safe parameter/state pools before adding cosmetic wording variation."
        : metric.distractorSetCount < 4
          ? "Broaden misconception-owned distractor states."
          : "Add 2–4 natural stem frames that preserve the frozen mathematical contract.",
  }));

const report = {
  authority: ALGEBRA_DISTINCTIVE_CONTENT_AUDIT_V1_AUTHORITY,
  sourceDeliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY,
  generatedAt: new Date().toISOString(),
  scope: {
    permanentQlCount: new Set(ALGEBRA_QUESTION_STUDIO_PATTERNS.map((pattern) => pattern.qlId)).size,
    patternCount: ALGEBRA_QUESTION_STUDIO_PATTERNS.length,
    samplesPerPattern: SAMPLES_PER_PATTERN,
    auditedQuestionCount: questions.length,
    language: "en",
    examProfile: "SSC_CORE",
  },
  philosophy: {
    floor: "Current-exam authenticity, mathematical correctness, clear teaching, and misconception-valid distractors.",
    ceiling: "Distinctive ExamTree-authored surface variety, fresh state combinations, low internal repetition, and memorable but non-gimmicky question construction.",
    guardrail: "Novelty must not alter frozen QL semantics, solver truth, answer parity, or create artificial story dressing around naturally abstract Algebra.",
  },
  decision,
  summary: {
    averageDistinctiveScore: Number(averageScore.toFixed(1)),
    medianDistinctiveScore: medianScore,
    lowestDistinctiveScore: scores[0] ?? 0,
    highestDistinctiveScore: scores[scores.length - 1] ?? 0,
    lowScorePatternCount: lowScorePatterns.length,
    exactDuplicateStemSurfaceCount: duplicateExactStems.length,
    severityCounts,
    categoryCounts,
    codeCounts,
    difficultyCounts,
    answerPositionCounts,
    answerFamilyCounts,
    openingLeaders,
  },
  cpSummaries,
  patternMetrics,
  innovationCandidates,
  findings,
};

const outputDir = path.resolve(process.cwd(), "dist/quant-v4");
fs.mkdirSync(outputDir, { recursive: true });
const jsonPath = path.join(outputDir, "algebra-distinctive-content-audit-v1.json");
const mdPath = path.join(outputDir, "algebra-distinctive-content-audit-v1.md");
fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);

const topCodes = Object.entries(codeCounts).sort((a, b) => b[1] - a[1]).slice(0, 16);
const lowest = [...patternMetrics].sort((a, b) => a.distinctiveScore - b.distinctiveScore).slice(0, 20);
const md = [
  `# Algebra Distinctive Content Audit V1`,
  ``,
  `Authority: \`${ALGEBRA_DISTINCTIVE_CONTENT_AUDIT_V1_AUTHORITY}\``,
  `Source delivery authority: \`${ALGEBRA_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY}\``,
  ``,
  `## Decision`,
  ``,
  `**${decision}**`,
  ``,
  `## Scope`,
  ``,
  `- 43 permanent QLs`,
  `- ${ALGEBRA_QUESTION_STUDIO_PATTERNS.length} permanent-mapped learner variants`,
  `- ${SAMPLES_PER_PATTERN} deterministic English states per variant`,
  `- ${questions.length} audited questions`,
  `- source semantics and solver authority remain frozen`,
  ``,
  `## Distinctive-quality bar`,
  ``,
  `Exam realism is the minimum. The higher bar is content that feels deliberately authored for ExamTree: mathematically fresh states, low internal repetition, natural alternate framings, misconception-owned distractors, and question-specific explanations. Novelty is rejected when it becomes gimmicky, verbose, or changes the frozen mathematical contract.`,
  ``,
  `## Score summary`,
  ``,
  `- average distinctive score: **${averageScore.toFixed(1)}/100**`,
  `- median distinctive score: **${medianScore}/100**`,
  `- low-score patterns (<70): **${lowScorePatterns.length}/${patternMetrics.length}**`,
  `- exact duplicated stem surfaces: **${duplicateExactStems.length}**`,
  `- structural critical findings: **${criticalCount}**`,
  `- high duplication findings: **${highDuplicationCount}**`,
  ``,
  `## Leading findings`,
  ``,
  ...topCodes.map(([code, count]) => `- ${code}: **${count}**`),
  ``,
  `## Lowest-scoring variants`,
  ``,
  `| Pattern | QL | CP | Score | States | Stems | Stem shapes | Explanations | Distractor sets | Cross-QL shape collision |`,
  `| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |`,
  ...lowest.map((row) => `| ${row.patternId} | ${row.qlId} | ${row.cpId} | ${row.distinctiveScore} | ${row.stateCount} | ${row.stemCount} | ${row.stemShapeCount} | ${row.explanationCount} | ${row.distractorSetCount} | ${row.signatureCollisionQlCount} |`),
  ``,
  `## Next pass policy`,
  ``,
  `1. Fix state-pool thinness before cosmetic rewriting.`,
  `2. Prioritize normalized stem shapes reused across multiple permanent QLs.`,
  `3. Add only semantically equivalent ExamTree-authored alternate frames; do not mutate frozen QL meaning or solver authority.`,
  `4. Expand distractors through plausible misconception states, never random wrong answers.`,
  `5. Preserve concise human explanations with explicit given/asked/reasoning/calculation logic.`,
  `6. Keep abstract Algebra abstract when context would be artificial; distinctiveness can come from structure, constraints, transformations, and data presentation rather than forced stories.`,
  ``,
].join("\n");
fs.writeFileSync(mdPath, `${md}\n`);

console.log(`Algebra distinctive-content audit: ${questions.length} questions / ${patternMetrics.length} variants / median ${medianScore} / decision ${decision}`);
console.log(`Critical=${criticalCount}; highDuplication=${highDuplicationCount}; lowScorePatterns=${lowScorePatterns.length}; exactDuplicateStemSurfaces=${duplicateExactStems.length}`);
console.log(`Artifacts: ${jsonPath} and ${mdPath}`);

if (criticalCount > 0) {
  throw new Error(`Algebra distinctive-content audit found ${criticalCount} structural critical findings.`);
}
