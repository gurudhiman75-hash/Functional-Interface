import { writeFileSync } from "node:fs";
import {
  TMW_ENGLISH_ADAPTERS,
  allTmwEnglishRegistryEntries,
  classifyTmwEnglishOpening,
  hasTmwEnglishFourTierExplanation,
  normalizedTmwEnglishOpening,
  normalizedTmwEnglishStem,
  tmwEnglishExplanationParts,
  tmwEnglishLearnerText,
  tmwEnglishPrefix,
  type TmwEnglishOpeningStyle,
} from "./foundation/english-freeze-adapter";

const SAMPLES_PER_QL = 12;
const EXPECTED_QL_COUNT = 211;
const outputPath = "dist/quant-v4/tmw-001-english-gap-audit.json";

type Severity = "HARD_FAILURE" | "FREEZE_BLOCKER" | "OBSERVATION";
interface Finding {
  severity: Severity;
  code: string;
  cpId?: string;
  qlId?: string;
  seed?: string;
  detail: string;
  sample?: string;
}

interface CpStats {
  qls: number;
  questions: number;
  validQuestions: number;
  distinctStems: Set<string>;
  normalizedStems: Set<string>;
  normalizedOpenings: Set<string>;
  styles: Record<TmwEnglishOpeningStyle, number>;
  prefixes: Map<string, number>;
  fourTierQls: Set<string>;
  negativeTrapQls: Set<string>;
  missingTrapQls: Set<string>;
  jargonQls: Set<string>;
}

const findings: Finding[] = [];
const addFinding = (finding: Finding) => findings.push(finding);
const hard = (code: string, detail: string, extra: Partial<Finding> = {}) => addFinding({ severity: "HARD_FAILURE", code, detail, ...extra });
const blocker = (code: string, detail: string, extra: Partial<Finding> = {}) => addFinding({ severity: "FREEZE_BLOCKER", code, detail, ...extra });
const observe = (code: string, detail: string, extra: Partial<Finding> = {}) => addFinding({ severity: "OBSERVATION", code, detail, ...extra });

function emptyStyles(): Record<TmwEnglishOpeningStyle, number> {
  return { SUBJECT_FIRST: 0, TEMPORAL_FIRST: 0, OBJECTIVE_FIRST: 0, CONTEXT_FIRST: 0, QUESTION_FIRST: 0, OTHER: 0 };
}

const cpStats = new Map<string, CpStats>();
for (const adapter of TMW_ENGLISH_ADAPTERS) {
  cpStats.set(adapter.cpId, {
    qls: adapter.registry.length,
    questions: 0,
    validQuestions: 0,
    distinctStems: new Set(),
    normalizedStems: new Set(),
    normalizedOpenings: new Set(),
    styles: emptyStyles(),
    prefixes: new Map(),
    fourTierQls: new Set(),
    negativeTrapQls: new Set(),
    missingTrapQls: new Set(),
    jargonQls: new Set(),
  });
}

function balancedInlineMath(value: string): boolean {
  return (value.match(/\\\(/g) ?? []).length === (value.match(/\\\)/g) ?? []).length;
}
function outsideInlineMath(value: string): string {
  return value.replace(/\\\([\s\S]*?\\\)/g, "");
}
function normalizedExplanation(question: any): string {
  return tmwEnglishExplanationParts(question)
    .join(" ")
    .toLowerCase()
    .replace(/\\\([\s\S]*?\\\)/g, "<math>")
    .replace(/₹[\d,]+(?:\.\d+)?/g, "<money>")
    .replace(/\b\d+(?:\.\d+)?\b/g, "#")
    .replace(/[^a-z#<>]+/g, " ")
    .trim();
}
function answerText(question: any): string {
  return typeof question?.solution?.answerText === "string"
    ? question.solution.answerText
    : String(question?.options?.[question?.correctIndex] ?? "");
}
function topEntry<K>(map: Map<K, number>): [K, number] | undefined {
  return [...map.entries()].sort((a, b) => b[1] - a[1])[0];
}
function topStyle(styles: Record<TmwEnglishOpeningStyle, number>): [TmwEnglishOpeningStyle, number] {
  return (Object.entries(styles) as [TmwEnglishOpeningStyle, number][]).sort((a, b) => b[1] - a[1])[0];
}

const registry = allTmwEnglishRegistryEntries();
const expectedIds = Array.from({ length: EXPECTED_QL_COUNT }, (_, index) => `TMW-QL-${String(index + 1).padStart(3, "0")}`);
const actualIds = registry.map((entry) => entry.qlId);
if (registry.length !== EXPECTED_QL_COUNT) hard("REGISTRY_COUNT", `Expected ${EXPECTED_QL_COUNT} QLs but found ${registry.length}.`);
if (actualIds.join("|") !== expectedIds.join("|")) hard("QL_CONTINUITY", "Registry order is not exactly TMW-QL-001 through TMW-QL-211.");
if (new Set(actualIds).size !== actualIds.length) hard("DUPLICATE_QL_ID", "At least one QL ID appears more than once.");

const solveModeOwners = new Map<string, string>();
for (const entry of registry) {
  if (entry.publiclyPublishable !== false) hard("REGISTRY_PUBLICATION_FLAG", "Registry entry is publishable before chapter freeze.", { cpId: entry.cpId, qlId: entry.qlId });
  const previous = solveModeOwners.get(entry.solveMode);
  if (previous && previous !== entry.cpId) blocker("CROSS_CP_SOLVE_MODE_DUPLICATE", `${entry.solveMode} is owned by both ${previous} and ${entry.cpId}.`, { cpId: entry.cpId, qlId: entry.qlId });
  solveModeOwners.set(entry.solveMode, entry.cpId);
}

const exactStemOwners = new Map<string, { cpId: string; qlId: string; seed: string }>();
const normalizedStemOwners = new Map<string, { cpId: string; qlId: string; seed: string; stem: string }>();
const normalizedExplanationOwners = new Map<string, { cpId: string; qlId: string; seed: string }>();
const collisionKeys = new Set<string>();

for (const adapter of TMW_ENGLISH_ADAPTERS) {
  const stats = cpStats.get(adapter.cpId)!;
  for (const entry of adapter.registry) {
    if (entry.cpId !== adapter.cpId) hard("CP_ID_MISMATCH", `Registry entry declares ${entry.cpId} inside ${adapter.cpId}.`, { cpId: adapter.cpId, qlId: entry.qlId });
    const fingerprints = new Set<string>();
    const stems = new Set<string>();
    const answerPositions = new Set<number>();
    const qlStyles = new Set<TmwEnglishOpeningStyle>();
    let fourTier = true;
    let sawNegativeTrap = false;
    let sawTrap = false;
    let sawJargon = false;

    for (let index = 0; index < SAMPLES_PER_QL; index += 1) {
      const seed = `english-gap-${entry.qlId}-${index}`;
      let question: any;
      try {
        question = adapter.run(entry.qlId, seed);
      } catch (error) {
        hard("PIPELINE_EXCEPTION", error instanceof Error ? error.message : String(error), { cpId: adapter.cpId, qlId: entry.qlId, seed });
        continue;
      }
      stats.questions += 1;
      if (question?.validation?.valid === true) stats.validQuestions += 1;
      else hard("QUESTION_VALIDATION", (question?.validation?.errors ?? ["Unknown validation failure"]).join(" | "), { cpId: adapter.cpId, qlId: entry.qlId, seed, sample: question?.stem });

      if (index < 2) {
        const replay = adapter.run(entry.qlId, seed);
        if (JSON.stringify(question) !== JSON.stringify(replay)) hard("NON_DETERMINISTIC_REPLAY", "The same QL and seed produced different candidate packages.", { cpId: adapter.cpId, qlId: entry.qlId, seed });
      }

      const stem = String(question?.stem ?? "").trim();
      const options = Array.isArray(question?.options) ? question.options.map(String) : [];
      const correctIndex = Number(question?.correctIndex);
      const solvedAnswer = answerText(question);
      const learner = tmwEnglishLearnerText(question);
      const style = classifyTmwEnglishOpening(stem);
      const prefix = tmwEnglishPrefix(stem);
      const normalizedStem = normalizedTmwEnglishStem(stem);
      const normalizedOpening = normalizedTmwEnglishOpening(stem);
      const explanationSignature = normalizedExplanation(question);

      if (question?.canonicalProblemId !== adapter.cpId) hard("QUESTION_CP_ID", `Candidate declares ${question?.canonicalProblemId}.`, { cpId: adapter.cpId, qlId: entry.qlId, seed });
      if (question?.questionLanguageId !== entry.qlId) hard("QUESTION_QL_ID", `Candidate declares ${question?.questionLanguageId}.`, { cpId: adapter.cpId, qlId: entry.qlId, seed });
      if (question?.solveMode !== entry.solveMode) hard("QUESTION_SOLVE_MODE", `Candidate declares ${question?.solveMode}.`, { cpId: adapter.cpId, qlId: entry.qlId, seed });
      if (question?.language !== "en") hard("QUESTION_LANGUAGE", `Candidate language is ${question?.language}.`, { cpId: adapter.cpId, qlId: entry.qlId, seed });
      if (question?.publiclyPublishable !== false) hard("QUESTION_PUBLICATION_FLAG", "Candidate is publishable before freeze.", { cpId: adapter.cpId, qlId: entry.qlId, seed });
      if (!stem || !stem.endsWith("?")) blocker("STEM_TARGET_PUNCTUATION", "Stem is empty or does not end as a direct question.", { cpId: adapter.cpId, qlId: entry.qlId, seed, sample: stem });
      const wordCount = stem.split(/\s+/).filter(Boolean).length;
      if (wordCount < 12 || wordCount > 110) blocker("STEM_LENGTH", `Stem contains ${wordCount} words.`, { cpId: adapter.cpId, qlId: entry.qlId, seed, sample: stem });
      if (options.length !== 4 || new Set(options).size !== 4) hard("OPTION_PACKAGE", "Candidate does not contain four unique options.", { cpId: adapter.cpId, qlId: entry.qlId, seed });
      if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) hard("CORRECT_INDEX", `Invalid correct index ${correctIndex}.`, { cpId: adapter.cpId, qlId: entry.qlId, seed });
      if (options[correctIndex] !== solvedAnswer) hard("ANSWER_OPTION_MISMATCH", `Solved answer ${solvedAnswer} does not match option ${correctIndex}.`, { cpId: adapter.cpId, qlId: entry.qlId, seed });
      if (options.filter((option: string) => option === solvedAnswer).length !== 1) hard("ANSWER_MULTIPLICITY", "Solved answer is not present exactly once.", { cpId: adapter.cpId, qlId: entry.qlId, seed });
      if (!balancedInlineMath(learner)) hard("UNBALANCED_MATHJAX", "Learner text contains unbalanced inline MathJax.", { cpId: adapter.cpId, qlId: entry.qlId, seed });
      if (/\\frac/.test(outsideInlineMath(learner))) blocker("RAW_LATEX_FRACTION", "Learner text contains raw \\frac outside inline MathJax.", { cpId: adapter.cpId, qlId: entry.qlId, seed });
      if (/(^|[^\\])\$/.test(learner)) blocker("DOLLAR_MATH_DELIMITER", "Learner text uses an unsupported dollar-sign MathJax delimiter.", { cpId: adapter.cpId, qlId: entry.qlId, seed });
      if (/\b(?:\d+\s+)?\d+\/\d+\s+(?:minutes?|hours?|days?|shifts?)\b/i.test(learner)) blocker("ASCII_FRACTIONAL_TIME", "Learner text contains an ASCII fractional time.", { cpId: adapter.cpId, qlId: entry.qlId, seed });
      if (/undefined|null|NaN|Infinity|\{\{|\$\{/.test(learner)) hard("UNRESOLVED_VALUE", "Learner text contains an unresolved value or placeholder.", { cpId: adapter.cpId, qlId: entry.qlId, seed });
      if (/TMW-QL-|TMW_CP_|misconceptionId|publiclyPublishable/.test(learner)) blocker("INTERNAL_ID_LEAK", "Learner text exposes internal metadata.", { cpId: adapter.cpId, qlId: entry.qlId, seed });
      if (/arithmetic progression|geometric progression|sum identity|inverse relation|recover the unknown parameter|substitute parameters/i.test(learner)) sawJargon = true;

      const commonTrap = question?.explanation?.commonTrap;
      if (commonTrap?.explanation) {
        sawTrap = true;
        if (/Do not choose|Don't choose/i.test(commonTrap.explanation)) sawNegativeTrap = true;
        if (commonTrap.optionText === solvedAnswer) hard("TRAP_POINTS_TO_ANSWER", "Diagnostic trap points to the correct answer.", { cpId: adapter.cpId, qlId: entry.qlId, seed });
        if (!options.includes(String(commonTrap.optionText))) hard("TRAP_OPTION_NOT_FOUND", "Diagnostic trap does not map to an actual option.", { cpId: adapter.cpId, qlId: entry.qlId, seed });
      }
      fourTier = fourTier && hasTmwEnglishFourTierExplanation(question);

      fingerprints.add(String(question?.mathematicalFingerprint ?? ""));
      stems.add(stem);
      answerPositions.add(correctIndex);
      qlStyles.add(style);
      stats.distinctStems.add(stem);
      stats.normalizedStems.add(normalizedStem);
      stats.normalizedOpenings.add(normalizedOpening);
      stats.styles[style] += 1;
      stats.prefixes.set(prefix, (stats.prefixes.get(prefix) ?? 0) + 1);

      const exactOwner = exactStemOwners.get(stem);
      if (exactOwner && exactOwner.qlId !== entry.qlId) {
        const key = [exactOwner.qlId, entry.qlId, stem].sort().join("|");
        if (!collisionKeys.has(key)) {
          collisionKeys.add(key);
          hard("EXACT_CROSS_QL_STEM_DUPLICATE", `Exact stem duplicates ${exactOwner.qlId}.`, { cpId: adapter.cpId, qlId: entry.qlId, seed, sample: stem });
        }
      } else exactStemOwners.set(stem, { cpId: adapter.cpId, qlId: entry.qlId, seed });

      const normalizedOwner = normalizedStemOwners.get(normalizedStem);
      if (normalizedOwner && normalizedOwner.qlId !== entry.qlId) {
        const key = [normalizedOwner.qlId, entry.qlId, normalizedStem].sort().join("|");
        if (!collisionKeys.has(key)) {
          collisionKeys.add(key);
          blocker("NORMALIZED_CROSS_QL_STEM_COLLISION", `Normalized stem collides with ${normalizedOwner.qlId} (${normalizedOwner.cpId}).`, { cpId: adapter.cpId, qlId: entry.qlId, seed, sample: stem });
        }
      } else normalizedStemOwners.set(normalizedStem, { cpId: adapter.cpId, qlId: entry.qlId, seed, stem });

      if (explanationSignature) {
        const explanationOwner = normalizedExplanationOwners.get(explanationSignature);
        if (explanationOwner && explanationOwner.qlId !== entry.qlId) {
          const key = [explanationOwner.qlId, entry.qlId, explanationSignature].sort().join("|");
          if (!collisionKeys.has(key)) {
            collisionKeys.add(key);
            blocker("NORMALIZED_EXPLANATION_COLLISION", `Explanation structure collides with ${explanationOwner.qlId} (${explanationOwner.cpId}).`, { cpId: adapter.cpId, qlId: entry.qlId, seed });
          }
        } else normalizedExplanationOwners.set(explanationSignature, { cpId: adapter.cpId, qlId: entry.qlId, seed });
      }
    }

    if (fingerprints.size < 3) hard("INSUFFICIENT_MATHEMATICAL_STATES", `Only ${fingerprints.size} mathematical fingerprints across ${SAMPLES_PER_QL} seeds.`, { cpId: adapter.cpId, qlId: entry.qlId });
    if (stems.size < 3) blocker("INSUFFICIENT_STEM_VARIETY", `Only ${stems.size} distinct stems across ${SAMPLES_PER_QL} seeds.`, { cpId: adapter.cpId, qlId: entry.qlId });
    if (answerPositions.size < 2) hard("ANSWER_POSITION_STAGNATION", `Only ${answerPositions.size} correct-answer position across ${SAMPLES_PER_QL} seeds.`, { cpId: adapter.cpId, qlId: entry.qlId });
    if (answerPositions.size < 4) observe("ANSWER_POSITION_PARTIAL_COVERAGE", `${answerPositions.size}/4 answer positions observed in the audit sample.`, { cpId: adapter.cpId, qlId: entry.qlId });
    if (qlStyles.size < 2) blocker("SINGLE_OPENING_STYLE_QL", `All sampled stems use one opening style: ${[...qlStyles][0] ?? "UNKNOWN"}.`, { cpId: adapter.cpId, qlId: entry.qlId });
    if (fourTier) stats.fourTierQls.add(entry.qlId);
    if (sawNegativeTrap) stats.negativeTrapQls.add(entry.qlId);
    if (!sawTrap) stats.missingTrapQls.add(entry.qlId);
    if (sawJargon) stats.jargonQls.add(entry.qlId);
  }
}

for (const [cpId, stats] of cpStats) {
  if (stats.fourTierQls.size !== stats.qls) blocker("CP_FOUR_TIER_GAP", `${stats.qls - stats.fourTierQls.size}/${stats.qls} QLs do not consistently provide Core → Working → Shortcut → Trap.`, { cpId });
  if (stats.missingTrapQls.size) blocker("CP_MISSING_DIAGNOSTIC_TRAPS", `${stats.missingTrapQls.size}/${stats.qls} QLs do not expose an option-linked diagnostic trap.`, { cpId, sample: [...stats.missingTrapQls].slice(0, 8).join(", ") });
  if (stats.negativeTrapQls.size) blocker("CP_NEGATIVE_TRAP_COMMANDS", `${stats.negativeTrapQls.size}/${stats.qls} QLs still use “Do not choose/Don't choose” wording.`, { cpId, sample: [...stats.negativeTrapQls].slice(0, 8).join(", ") });
  if (stats.jargonQls.size) blocker("CP_ACADEMIC_JARGON", `${stats.jargonQls.size}/${stats.qls} QLs contain rejected textbook-heavy phrases.`, { cpId, sample: [...stats.jargonQls].slice(0, 8).join(", ") });
  const [dominantStyle, dominantCount] = topStyle(stats.styles);
  const dominantShare = stats.questions ? dominantCount / stats.questions : 0;
  if (dominantShare > 0.70) blocker("CP_OPENING_STYLE_DOMINANCE", `${dominantStyle} accounts for ${(dominantShare * 100).toFixed(1)}% of sampled stems.`, { cpId });
  const contextShare = stats.questions ? stats.styles.CONTEXT_FIRST / stats.questions : 0;
  if (contextShare > 0.35) blocker("CP_CONTEXT_FIRST_OVERUSE", `Context-first stems account for ${(contextShare * 100).toFixed(1)}% of sampled stems.`, { cpId });
  const prefix = topEntry(stats.prefixes);
  if (prefix && stats.questions && prefix[1] / stats.questions > 0.35) blocker("CP_PREFIX_CONCENTRATION", `Prefix “${prefix[0]}” accounts for ${((prefix[1] / stats.questions) * 100).toFixed(1)}% of sampled stems.`, { cpId });
}

const totalQuestions = [...cpStats.values()].reduce((sum, stats) => sum + stats.questions, 0);
const totalValid = [...cpStats.values()].reduce((sum, stats) => sum + stats.validQuestions, 0);
const chapterStyles = emptyStyles();
const chapterPrefixes = new Map<string, number>();
for (const stats of cpStats.values()) {
  for (const [style, count] of Object.entries(stats.styles) as [TmwEnglishOpeningStyle, number][]) chapterStyles[style] += count;
  for (const [prefix, count] of stats.prefixes) chapterPrefixes.set(prefix, (chapterPrefixes.get(prefix) ?? 0) + count);
}
const chapterContextShare = totalQuestions ? chapterStyles.CONTEXT_FIRST / totalQuestions : 0;
if (chapterContextShare > 0.30) blocker("CHAPTER_CONTEXT_FIRST_OVERUSE", `Context-first stems account for ${(chapterContextShare * 100).toFixed(1)}% of the chapter sample.`);
const chapterPrefix = topEntry(chapterPrefixes);
if (chapterPrefix && totalQuestions && chapterPrefix[1] / totalQuestions > 0.20) blocker("CHAPTER_PREFIX_CONCENTRATION", `Prefix “${chapterPrefix[0]}” accounts for ${((chapterPrefix[1] / totalQuestions) * 100).toFixed(1)}% of the chapter sample.`);

const serializedCpStats = Object.fromEntries([...cpStats.entries()].map(([cpId, stats]) => {
  const prefix = topEntry(stats.prefixes);
  const [dominantStyle, dominantCount] = topStyle(stats.styles);
  return [cpId, {
    qls: stats.qls,
    questions: stats.questions,
    validQuestions: stats.validQuestions,
    distinctStems: stats.distinctStems.size,
    normalizedStems: stats.normalizedStems.size,
    normalizedOpenings: stats.normalizedOpenings.size,
    openingStyles: stats.styles,
    dominantOpeningStyle: dominantStyle,
    dominantOpeningShare: stats.questions ? dominantCount / stats.questions : 0,
    contextFirstShare: stats.questions ? stats.styles.CONTEXT_FIRST / stats.questions : 0,
    topPrefix: prefix?.[0] ?? "",
    topPrefixShare: prefix && stats.questions ? prefix[1] / stats.questions : 0,
    fourTierQls: stats.fourTierQls.size,
    missingTrapQls: stats.missingTrapQls.size,
    negativeTrapQls: stats.negativeTrapQls.size,
    academicJargonQls: stats.jargonQls.size,
  }];
}));

const summary = {
  qls: registry.length,
  samplesPerQl: SAMPLES_PER_QL,
  totalQuestions,
  validQuestions: totalValid,
  distinctExactStems: exactStemOwners.size,
  distinctNormalizedStems: normalizedStemOwners.size,
  distinctNormalizedExplanations: normalizedExplanationOwners.size,
  openingStyles: chapterStyles,
  contextFirstShare: chapterContextShare,
  hardFailures: findings.filter((finding) => finding.severity === "HARD_FAILURE").length,
  freezeBlockers: findings.filter((finding) => finding.severity === "FREEZE_BLOCKER").length,
  observations: findings.filter((finding) => finding.severity === "OBSERVATION").length,
};

const report = { summary, cpStats: serializedCpStats, findings };
writeFileSync(outputPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ summary, cpStats: serializedCpStats, findingPreview: findings.slice(0, 40) }, null, 2));
if (summary.hardFailures || summary.freezeBlockers) process.exitCode = 1;
