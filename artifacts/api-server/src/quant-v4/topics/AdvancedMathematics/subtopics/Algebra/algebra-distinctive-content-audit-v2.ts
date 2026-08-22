import fs from "node:fs";
import path from "node:path";

import {
  ALGEBRA_QUESTION_STUDIO_PATTERNS,
  type AlgebraQuestionStudioPattern,
} from "./algebra-question-studio-runtime-v1";
import {
  ALGEBRA_QUESTION_STUDIO_DELIVERY_V4_AUTHORITY,
  generateAlgebraStudioQuestionV4,
  type AlgebraQuestionStudioQuestionV4,
} from "./algebra-question-studio-runtime-v4";

export const ALGEBRA_DISTINCTIVE_CONTENT_AUDIT_V2_AUTHORITY =
  "ALGEBRA-DISTINCTIVE-CONTENT-AUDIT-V2-CATEGORY-AWARE" as const;

const SAMPLES_PER_PATTERN = 16;
const FIXED_CHOICE_FAMILIES = new Set([
  "BOOLEAN",
  "NO_SOLUTION",
  "INFINITE_SOLUTIONS",
  "NO_REAL_ROOTS",
  "STRING_RELATION",
  "QUANTITY_RELATION",
  "DATA_SUFFICIENCY",
]);
const NUMERIC_FAMILIES = new Set([
  "RATIONAL",
  "UNIQUE_VALUE",
  "PARAMETER_VALUE",
  "EXCLUDED_VALUE",
]);

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "OPPORTUNITY";
type Remediation = "STATE_POOL" | "EXPLANATION" | "DISTRACTOR_STRATEGY" | "STEM_FRAMING" | "EDITORIAL";

interface Finding {
  severity: Severity;
  remediation: Remediation;
  cpId: string;
  qlId: string;
  patternId: string;
  code: string;
  note: string;
  exampleStem: string;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function answerFamily(question: AlgebraQuestionStudioQuestionV4) {
  const answer = question.canonicalAnswer as any;
  if (answer && typeof answer === "object" && typeof answer.kind === "string") return answer.kind;
  return typeof answer === "string" ? "STRING_RELATION" : typeof answer;
}

function normalizeMathShape(text: string) {
  return text
    .toLowerCase()
    .replace(/\$\$[\s\S]*?\$\$/g, " <math> ")
    .replace(/\$[^$]+\$/g, " <math> ")
    .replace(/[−–—]/g, "-")
    .replace(/\b-?\d+(?:\.\d+)?(?:\s*\/\s*\d+)?\b/g, " <n> ")
    .replace(/[αβγλμθ]/g, "<v>")
    .replace(/\b(?:x|y|z|a|b|c|k|m|n|p|q|r|t)\b/g, "<v>")
    .replace(/[(){}\[\],;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stemShape(stem: string) {
  return normalizeMathShape(stem);
}

function sourceStateFingerprint(question: AlgebraQuestionStudioQuestionV4) {
  return `${question.stem}\n${JSON.stringify(question.canonicalAnswer)}`;
}

function explanationFingerprint(question: AlgebraQuestionStudioQuestionV4) {
  return question.explanation.steps.join("\n");
}

function hasClearExamIntent(stem: string) {
  return /\?|^\s*(?:solve|find|determine|calculate|evaluate|simplify|expand|factorise|factorize|classify|compare|form|identify|choose|state|check|verify|is|are|which|what|how many)\b/i.test(stem)
    || /\b(?:find|determine|calculate|evaluate|solve|factorise|factorize|simplify|compare|classify|coefficient|remainder|roots?|solution|maximum|minimum|range|sufficient|defined)\b/i.test(stem);
}

function setterShorthand(stem: string) {
  return /(?:^|[,;:(]\s*)(?:x|y|z|a|b|c|k|m|n|p|q|r)\s*=\s*-?\d/i.test(stem)
    && !/\bif\b/i.test(stem);
}

function explanationSpecificity(question: AlgebraQuestionStudioQuestionV4) {
  const text = question.explanation.steps.join(" ");
  return (text.match(/(?:-?\d+(?:\.\d+)?|[=+\-×÷√²³]|\b(?:x|y|z|a|b|c|k|m|n)\b)/g) ?? []).length;
}

function parseRational(text: string): [bigint, bigint] | null {
  const trimmed = text.trim();
  const match = /^(-?\d+)(?:\/(-?\d+))?$/.exec(trimmed);
  if (!match) return null;
  const n = BigInt(match[1]!);
  const d = BigInt(match[2] ?? "1");
  if (d === 0n) return null;
  return d < 0n ? [-n, -d] : [n, d];
}

function equalRational(a: [bigint, bigint], b: [bigint, bigint]) {
  return a[0] * b[1] === b[0] * a[1];
}

function classifyNumericWrong(correctText: string, wrongText: string) {
  const correct = parseRational(correctText);
  const wrong = parseRational(wrongText);
  if (!correct || !wrong) return "TEXT_OTHER";
  const [n, d] = correct;
  if (equalRational(wrong, [-n, d])) return "SIGN_FLIP";
  if (equalRational(wrong, [n + d, d])) return "PLUS_ONE";
  if (equalRational(wrong, [n - d, d])) return "MINUS_ONE";
  if (n !== 0n && equalRational(wrong, [d, n])) return "RECIPROCAL";
  if (equalRational(wrong, [n + 2n * d, d])) return "PLUS_TWO";
  return "NUMERIC_OTHER";
}

function distractorStrategySignature(question: AlgebraQuestionStudioQuestionV4) {
  const family = answerFamily(question);
  if (FIXED_CHOICE_FAMILIES.has(family)) return "STANDARD_FIXED_CHOICES";
  const wrongs = question.optionDetails.filter((option) => !option.isCorrect).map((option) => option.text);
  if (NUMERIC_FAMILIES.has(family)) {
    return wrongs.map((wrong) => classifyNumericWrong(question.answer, wrong)).sort().join("|");
  }
  return wrongs.map(normalizeMathShape).sort().join("|");
}

function scoreFromRatio(unique: number, total: number, floor: number) {
  if (total <= 0) return 0;
  const ratio = unique / total;
  if (ratio <= floor) return 0;
  return Math.min(100, ((ratio - floor) / (1 - floor)) * 100);
}

function strategyScore(family: string, count: number) {
  if (FIXED_CHOICE_FAMILIES.has(family)) return 100;
  if (count >= 4) return 100;
  if (count === 3) return 80;
  if (count === 2) return 50;
  return 15;
}

const findings: Finding[] = [];
const generated: AlgebraQuestionStudioQuestionV4[] = [];
const byPattern = new Map<string, AlgebraQuestionStudioQuestionV4[]>();
const exactStemOccurrences = new Map<string, Array<{ patternId: string; qlId: string; seed: string }>>();

function finding(
  pattern: AlgebraQuestionStudioPattern,
  severity: Severity,
  remediation: Remediation,
  code: string,
  note: string,
  exampleStem: string,
) {
  findings.push({ severity, remediation, cpId: pattern.cpId, qlId: pattern.qlId, patternId: pattern.prototypeId, code, note, exampleStem });
}

for (const pattern of ALGEBRA_QUESTION_STUDIO_PATTERNS) {
  const bucket: AlgebraQuestionStudioQuestionV4[] = [];
  for (let index = 0; index < SAMPLES_PER_PATTERN; index += 1) {
    const question = generateAlgebraStudioQuestionV4({
      pattern,
      language: "en",
      examProfile: "SSC_CORE",
      seed: `algebra-distinctive-v2:${pattern.prototypeId}:${index}`,
    });
    generated.push(question);
    bucket.push(question);
    const stemBucket = exactStemOccurrences.get(question.stem) ?? [];
    stemBucket.push({ patternId: pattern.prototypeId, qlId: pattern.qlId, seed: question.seed });
    exactStemOccurrences.set(question.stem, stemBucket);

    if (!question.validation.valid || new Set(question.options).size !== 4 || question.options[question.correctIndex] !== question.answer) {
      finding(pattern, "CRITICAL", "EDITORIAL", "STRUCTURAL_VALIDITY", "Question Studio structural/answer contract failed.", question.stem);
    }
    if (!hasClearExamIntent(question.stem)) {
      finding(pattern, "MEDIUM", "EDITORIAL", "UNCLEAR_TASK_WORDING", "Stem should be checked for an explicit exam task; standard Solve/Factorise/Compare commands are accepted by this audit.", question.stem);
    }
    if (setterShorthand(question.stem)) {
      finding(pattern, "LOW", "EDITORIAL", "SETTER_SHORTHAND", "Inspect whether setter-style variable assignment can be made more natural without adding needless story context.", question.stem);
    }
    if (question.explanation.steps.length < 2) {
      finding(pattern, "HIGH", "EXPLANATION", "THIN_EXPLANATION", "Explanation has fewer than two visible reasoning steps.", question.stem);
    } else if (explanationSpecificity(question) < 3) {
      finding(pattern, "MEDIUM", "EXPLANATION", "LOW_EXPLANATION_SPECIFICITY", "Explanation contains little question-specific mathematical working.", question.stem);
    }
  }
  byPattern.set(pattern.prototypeId, bucket);
}

const metrics = ALGEBRA_QUESTION_STUDIO_PATTERNS.map((pattern) => {
  const bucket = byPattern.get(pattern.prototypeId)!;
  const family = answerFamily(bucket[0]!);
  const stateCount = new Set(bucket.map(sourceStateFingerprint)).size;
  const stemCount = new Set(bucket.map((q) => q.stem)).size;
  const frameCount = new Set(bucket.map((q) => stemShape(q.stem))).size;
  const explanationCount = new Set(bucket.map(explanationFingerprint)).size;
  const distractorStrategyCount = new Set(bucket.map(distractorStrategySignature)).size;
  const answerPositionCount = new Set(bucket.map((q) => q.correctIndex)).size;

  if (stateCount < 8) {
    finding(pattern, "HIGH", "STATE_POOL", "THIN_MATHEMATICAL_STATE_POOL", `${stateCount}/${SAMPLES_PER_PATTERN} distinct stem+answer states; expand the safe mathematical state pool before cosmetic rewriting.`, bucket[0]!.stem);
  } else if (stateCount < 12) {
    finding(pattern, "MEDIUM", "STATE_POOL", "LIMITED_MATHEMATICAL_STATE_POOL", `${stateCount}/${SAMPLES_PER_PATTERN} distinct stem+answer states.`, bucket[0]!.stem);
  }
  if (stemCount < 10) {
    finding(pattern, "MEDIUM", "STEM_FRAMING", "LOW_VISIBLE_STEM_DIVERSITY", `${stemCount}/${SAMPLES_PER_PATTERN} distinct visible stems.`, bucket[0]!.stem);
  }
  if (frameCount === 1 && stemCount >= 8) {
    finding(pattern, "OPPORTUNITY", "STEM_FRAMING", "SINGLE_NATURAL_FRAME", "Numerical states vary but one normalized stem frame dominates; consider 2–4 natural ExamTree-authored frames if the topic supports them.", bucket[0]!.stem);
  }
  if (explanationCount < 8) {
    finding(pattern, "MEDIUM", "EXPLANATION", "LOW_EXPLANATION_DIVERSITY", `${explanationCount}/${SAMPLES_PER_PATTERN} distinct explanations.`, bucket[0]!.stem);
  }
  if (!FIXED_CHOICE_FAMILIES.has(family) && distractorStrategyCount < 3) {
    finding(pattern, "MEDIUM", "DISTRACTOR_STRATEGY", "LOW_DISTRACTOR_STRATEGY_VARIETY", `${distractorStrategyCount} distinct misconception-strategy signatures; rotate credible misconception families rather than only changing numbers.`, bucket[0]!.stem);
  }
  if (answerPositionCount < 4) {
    finding(pattern, "LOW", "EDITORIAL", "ANSWER_POSITION_NOT_SATURATED", `${answerPositionCount}/4 answer positions reached in the 16-state sample.`, bucket[0]!.stem);
  }

  const stateScore = scoreFromRatio(stateCount, SAMPLES_PER_PATTERN, 0.35);
  const stemScore = scoreFromRatio(stemCount, SAMPLES_PER_PATTERN, 0.30);
  const explanationScore = scoreFromRatio(explanationCount, SAMPLES_PER_PATTERN, 0.25);
  const distractorScore = strategyScore(family, distractorStrategyCount);
  const frameScore = frameCount >= 4 ? 100 : frameCount === 3 ? 85 : frameCount === 2 ? 70 : 55;
  const positionScore = answerPositionCount * 25;
  const distinctiveScore = Math.round(
    stateScore * 0.30
    + stemScore * 0.15
    + explanationScore * 0.20
    + distractorScore * 0.20
    + frameScore * 0.05
    + positionScore * 0.10,
  );

  return {
    cpId: pattern.cpId,
    qlId: pattern.qlId,
    patternId: pattern.prototypeId,
    title: pattern.title,
    solveMode: pattern.solveModeId,
    family,
    difficulty: bucket[0]!.difficultyBand,
    stateCount,
    stemCount,
    frameCount,
    explanationCount,
    distractorStrategyCount,
    distractorPolicy: FIXED_CHOICE_FAMILIES.has(family) ? "STANDARD_FIXED_CHOICES_ACCEPTED" : "VARIABLE_MISCONCEPTION_STRATEGIES_EXPECTED",
    answerPositionCount,
    distinctiveScore,
  };
});

const duplicateStemGroups = [...exactStemOccurrences.entries()]
  .filter(([, rows]) => rows.length > 1)
  .map(([stem, rows]) => ({
    stem,
    occurrenceCount: rows.length,
    patternCount: new Set(rows.map((row) => row.patternId)).size,
    qlCount: new Set(rows.map((row) => row.qlId)).size,
    rows,
  }))
  .sort((a, b) => b.occurrenceCount - a.occurrenceCount);

const crossPatternExactDuplicates = duplicateStemGroups.filter((group) => group.patternCount > 1);
const scores = metrics.map((row) => row.distinctiveScore).sort((a, b) => a - b);
const average = scores.reduce((sum, value) => sum + value, 0) / scores.length;
const median = scores[Math.floor(scores.length / 2)] ?? 0;
const low = metrics.filter((row) => row.distinctiveScore < 75);
const critical = findings.filter((row) => row.severity === "CRITICAL");
const high = findings.filter((row) => row.severity === "HIGH");

const remediationCounts = findings.reduce<Record<string, number>>((acc, row) => {
  acc[row.remediation] = (acc[row.remediation] ?? 0) + 1;
  return acc;
}, {});
const codeCounts = findings.reduce<Record<string, number>>((acc, row) => {
  acc[row.code] = (acc[row.code] ?? 0) + 1;
  return acc;
}, {});

let decision = "DISTINCTIVE_READY";
if (critical.length) decision = "BLOCKED_STRUCTURAL_REMEDIATION_REQUIRED";
else if (high.length || low.length > Math.ceil(metrics.length * 0.15)) decision = "FOCUSED_DISTINCTIVENESS_REMEDIATION_REQUIRED";
else if (median < 88 || low.length) decision = "EXAM_READY_TARGETED_INNOVATION_RECOMMENDED";

const priority = [...metrics]
  .sort((a, b) => a.distinctiveScore - b.distinctiveScore)
  .slice(0, 36)
  .map((row) => {
    const ownFindings = findings.filter((findingRow) => findingRow.patternId === row.patternId);
    const remediations = [...new Set(ownFindings.map((findingRow) => findingRow.remediation))];
    return { ...row, remediations };
  });

const cpSummaries = [...new Set(metrics.map((row) => row.cpId))].map((cpId) => {
  const rows = metrics.filter((row) => row.cpId === cpId);
  return {
    cpId,
    patternCount: rows.length,
    qlCount: new Set(rows.map((row) => row.qlId)).size,
    averageDistinctiveScore: Number((rows.reduce((sum, row) => sum + row.distinctiveScore, 0) / rows.length).toFixed(1)),
    lowScorePatternCount: rows.filter((row) => row.distinctiveScore < 75).length,
    remediationCounts: findings.filter((row) => row.cpId === cpId).reduce<Record<string, number>>((acc, row) => {
      acc[row.remediation] = (acc[row.remediation] ?? 0) + 1;
      return acc;
    }, {}),
  };
}).sort((a, b) => a.averageDistinctiveScore - b.averageDistinctiveScore);

const report = {
  authority: ALGEBRA_DISTINCTIVE_CONTENT_AUDIT_V2_AUTHORITY,
  sourceDeliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V4_AUTHORITY,
  generatedAt: new Date().toISOString(),
  philosophy: {
    floor: "Exam-authentic and mathematically correct.",
    ceiling: "Fresh ExamTree-authored mathematical states, natural framing variety, question-specific teaching, and misconception-owned distractors.",
    fixedChoicePolicy: "Banking comparison, quantity comparison, data sufficiency and other canonical categorical formats are not penalized for correctly retaining standard answer choices.",
    noveltyGuardrail: "Do not force stories into abstract Algebra; prefer genuine mathematical novelty over decorative context.",
  },
  scope: {
    permanentQlCount: new Set(ALGEBRA_QUESTION_STUDIO_PATTERNS.map((row) => row.qlId)).size,
    patternCount: ALGEBRA_QUESTION_STUDIO_PATTERNS.length,
    samplesPerPattern: SAMPLES_PER_PATTERN,
    questionCount: generated.length,
  },
  decision,
  summary: {
    averageDistinctiveScore: Number(average.toFixed(1)),
    medianDistinctiveScore: median,
    lowestDistinctiveScore: scores[0],
    highestDistinctiveScore: scores.at(-1),
    lowScorePatternCount: low.length,
    criticalFindingCount: critical.length,
    highFindingCount: high.length,
    duplicateStemGroupCount: duplicateStemGroups.length,
    crossPatternExactDuplicateGroupCount: crossPatternExactDuplicates.length,
    remediationCounts,
    codeCounts,
  },
  cpSummaries,
  priority,
  metrics,
  findings,
  duplicateStemGroups: duplicateStemGroups.slice(0, 80),
};

const cwd = process.cwd();
const outputDir = cwd.endsWith(`${path.sep}artifacts${path.sep}api-server`)
  ? path.resolve(cwd, "dist/quant-v4")
  : path.resolve(cwd, "artifacts/api-server/dist/quant-v4");
fs.mkdirSync(outputDir, { recursive: true });
const jsonPath = path.join(outputDir, "algebra-distinctive-content-audit-v2.json");
const mdPath = path.join(outputDir, "algebra-distinctive-content-audit-v2.md");
fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);

const md = [
  "# Algebra Distinctive Content Audit V2",
  "",
  `Authority: \`${ALGEBRA_DISTINCTIVE_CONTENT_AUDIT_V2_AUTHORITY}\``,
  `Source: \`${ALGEBRA_QUESTION_STUDIO_DELIVERY_V4_AUTHORITY}\``,
  "",
  "## Decision",
  "",
  `**${decision}**`,
  "",
  "## Calibrated score",
  "",
  `- average: **${average.toFixed(1)}/100**`,
  `- median: **${median}/100**`,
  `- low-score variants (<75): **${low.length}/${metrics.length}**`,
  `- high findings: **${high.length}**`,
  `- cross-pattern exact duplicate stem groups: **${crossPatternExactDuplicates.length}**`,
  "",
  "Fixed canonical choice formats (Banking comparison, quantity comparison, data sufficiency and similar categorical outcomes) are explicitly exempt from fake option-diversity requirements.",
  "",
  "## Priority variants",
  "",
  "| Pattern | QL | CP | Score | States | Stems | Frames | Explanation states | Distractor strategies | Remediation |",
  "| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |",
  ...priority.slice(0, 24).map((row) => `| ${row.patternId} | ${row.qlId} | ${row.cpId} | ${row.distinctiveScore} | ${row.stateCount} | ${row.stemCount} | ${row.frameCount} | ${row.explanationCount} | ${row.distractorStrategyCount} | ${row.remediations.join(", ")} |`),
  "",
  "## Chapter order",
  "",
  ...cpSummaries.map((row) => `- ${row.cpId}: **${row.averageDistinctiveScore}/100**, ${row.lowScorePatternCount} low-score variants`),
  "",
  "## Innovation rule",
  "",
  "Repair thin state pools first, then teaching/explanation gaps, then misconception-strategy rotation, then natural alternate framing. Do not use superficial story dressing as a substitute for mathematical originality.",
  "",
].join("\n");
fs.writeFileSync(mdPath, `${md}\n`);

console.log(`Algebra distinctive-content V2: ${generated.length} questions / median ${median} / average ${average.toFixed(1)} / low ${low.length} / high ${high.length} / decision ${decision}`);
console.log(`Cross-pattern exact duplicate groups: ${crossPatternExactDuplicates.length}; remediation counts: ${JSON.stringify(remediationCounts)}`);
console.log(`Artifacts: ${jsonPath} and ${mdPath}`);

assert(critical.length === 0, `V2 audit found ${critical.length} structural critical findings`);
