import { TSD_CP001_DISCOVERY_AUTHORITIES, type TsdCp001DiscoveryAuthority, type TsdCp001DiscoverySolveMode } from "./discovery-registry";
import { solveCp001 } from "./canonical-solver";
import { verifyCp001Solution } from "./independent-verifier";
import type { TsdCp001Difficulty, TsdCp001GeneratedQuestion } from "./runtime-types";
import { generateState } from "./parameter-factory";
import { optionPackage } from "./options";
import { examOptionPackage } from "./exam-options";
import { clockOptionPackage } from "./clock-options";
import { elapsedClockOptionPackage } from "./elapsed-clock-options";
import { paceOptionPackage } from "./pace-options";
import {
  SCALAR_SPEED_FINGERPRINT,
  buildEquivalentSpeedRepresentation,
  isEquivalentSpeedFingerprint,
  prepareEquivalentSpeedInput,
} from "./equivalent-speed-representation";
import {
  answerUnitReviewBucket,
  answerUnitReviewTargets,
  formatAnswerUnitTarget,
} from "./answer-unit-review";
import { examWorkingLines } from "./exam-working";
import { editorialStem, inlineMathText } from "./pedagogy";
import { buildHumanExplanation } from "./human-explanation";
import { authorityOrdinal, formatAnswer, stableStringify } from "./runtime-support";

export const TSD_CP001_NON_LEARNER_MODES = new Set<TsdCp001DiscoverySolveMode>([
  "classifyUniformMotionState",
  "verifyUniformMotionClaim",
]);

export const TSD_CP001_LEARNER_AUTHORITIES = TSD_CP001_DISCOVERY_AUTHORITIES.filter(
  (authority) => !TSD_CP001_NON_LEARNER_MODES.has(authority.solveMode),
);

function validationErrors(question: Omit<TsdCp001GeneratedQuestion, "validation">): string[] {
  const errors: string[] = [];
  const verification = verifyCp001Solution(question.input, question.solution);
  if (!verification.valid) errors.push(...verification.errors.map((error) => `Verifier: ${error}`));
  if (!question.stem.trim().endsWith("?") && !question.stem.trim().endsWith(".")) errors.push("Stem must end with punctuation");
  if (question.options.length !== 4 || new Set(question.options).size !== 4) errors.push("Options must contain four unique values");
  if (question.optionAudit.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct");
  if (!question.optionAudit[question.correctIndex]?.isCorrect) errors.push("Correct index does not identify the correct option");
  if (question.answerText !== question.options[question.correctIndex]) errors.push("Answer text and keyed option differ");
  if (question.explanation.working.length < 2) errors.push("Explanation working is too brief");
  if (!question.explanation.trap.trim()) errors.push("Common-mistake note is missing");
  if (!question.explanation.keyRule.startsWith("📌 Main Rule:")) errors.push("Four-tier main-rule header is missing");
  if (question.explanation.stepByStepSolution.length < 5) errors.push("Learner explanation is too compressed");
  if (!question.explanation.examSpeedShortcut.startsWith("⚡ Exam Speed Trick:")) errors.push("Four-tier shortcut header is missing");
  if (question.explanation.optionAnalysis.length !== 4) errors.push("Option analysis must cover all four options");
  if (question.explanation.optionAnalysis.filter((option) => option.isCorrect).length !== 1) errors.push("Option analysis must identify one correct choice");
  if (question.explanation.optionAnalysis.some((option, index) => option.option !== (["A", "B", "C", "D"] as const)[index])) errors.push("Option-analysis labels are out of order");
  if (question.explanation.optionAnalysis.some((option, index) => option.text !== question.options[index])) errors.push("Option analysis and option text differ");
  if (question.explanation.optionAnalysis.some((option) => !option.reason.trim())) errors.push("Option-analysis reason is missing");
  if (!TSD_CP001_NON_LEARNER_MODES.has(question.solveMode) && !question.stemMathJax.includes("\\(")) errors.push("Learner stem has no MathJax quantity");
  if (question.lifecycle.reviewStatus !== "UNREVIEWED") errors.push("Review status must remain UNREVIEWED");
  if (question.lifecycle.questionBankStatus !== "NOT_STORED") errors.push("Question Bank status must remain NOT_STORED");
  if (question.lifecycle.testEligibility !== "INELIGIBLE") errors.push("Test eligibility must remain INELIGIBLE");
  if (question.lifecycle.publiclyPublishable || question.publiclyPublishable) errors.push("Candidate must not be publicly publishable");
  const serialized = stableStringify(question);
  if (/TSD-QL-|\{\{[A-Z_][^}]*\}\}|TODO|PLACEHOLDER/.test(serialized)) errors.push("Permanent ID or unresolved placeholder leaked into candidate");
  return errors;
}

export function generateCp001Candidate(
  provisionalAuthorityId: TsdCp001DiscoveryAuthority["provisionalId"],
  seed: string,
): TsdCp001GeneratedQuestion {
  const authority = TSD_CP001_DISCOVERY_AUTHORITIES.find((entry) => entry.provisionalId === provisionalAuthorityId);
  if (!authority) throw new Error(`Unknown CP-001 discovery authority: ${provisionalAuthorityId}`);
  const generatedState = generateState(authority, seed);
  const input = prepareEquivalentSpeedInput(seed, generatedState.input);
  const solution = solveCp001(input);
  const representation = buildEquivalentSpeedRepresentation(authority, seed, input, solution);
  const display = representation?.display ?? generatedState.display;
  const formattedAnswerText = formatAnswer(solution, display);
  const paceOptionSet = paceOptionPackage(authority, seed, input, solution, display);
  const baseOptionSet = paceOptionSet ?? (
    input.solveMode === "arrivalClockTime" || input.solveMode === "departureClockTime"
      ? clockOptionPackage(authority, seed, input, solution)
      : input.solveMode === "elapsedClockTime"
        ? elapsedClockOptionPackage(authority, seed, input, solution, display)
        : optionPackage(authority, seed, input, solution, display)
  );
  const optionSet = representation?.optionSet ?? (TSD_CP001_NON_LEARNER_MODES.has(authority.solveMode)
    ? baseOptionSet
    : examOptionPackage(input, solution, display, baseOptionSet));
  const answerText = representation?.answerText ?? (
    solution.answerKind === "CLASSIFICATION" || solution.answerKind === "BOOLEAN"
      ? optionSet.options[optionSet.correctIndex]
      : formattedAnswerText
  );
  const ordinal = authorityOrdinal(authority);
  const difficulty: TsdCp001Difficulty = ordinal <= 10 ? "Easy" : ordinal <= 20 ? "Medium" : "Hard";
  const working = representation?.working ?? examWorkingLines(input, solution, display);
  const stem = representation?.stem ?? editorialStem(input, generatedState.stem, seed);
  const representationFingerprint = representation?.fingerprintSuffix
    ?? (input.solveMode === "convertSpeedUnit" ? SCALAR_SPEED_FINGERPRINT : "representation:STANDARD");
  const base = {
    archetypeId: "TSD-001" as const,
    canonicalProblemId: "TSD-CP-001" as const,
    provisionalAuthorityId: authority.provisionalId,
    questionLanguageId: `${authority.provisionalId}:${seed}`,
    solveMode: authority.solveMode,
    language: "en" as const,
    seed,
    difficulty,
    stem,
    stemMathJax: inlineMathText(stem),
    input,
    solution,
    answerText,
    options: optionSet.options,
    optionAudit: optionSet.optionAudit,
    correctIndex: optionSet.correctIndex,
    explanation: buildHumanExplanation(authority, input, display, working, optionSet.optionAudit, answerText, seed),
    mathematicalFingerprint: `${authority.provisionalId}|${authority.solveMode}|${stableStringify(input)}|${representationFingerprint}`,
    lifecycle: {
      reviewStatus: "UNREVIEWED" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
    },
    publiclyPublishable: false as const,
  };
  const errors = validationErrors(base);
  return Object.freeze({
    ...base,
    validation: Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

export function generateCp001ReviewRows(seedsPerAuthority = 3): TsdCp001GeneratedQuestion[] {
  const rows: TsdCp001GeneratedQuestion[] = [];
  for (const authority of TSD_CP001_LEARNER_AUTHORITIES) {
    const authorityRows: TsdCp001GeneratedQuestion[] = [];
    const fingerprints = new Set<string>();
    const stems = new Set<string>();
    const teachingOpenings = new Set<string>();
    const equivalentTarget = authority.solveMode === "convertSpeedUnit" ? Math.min(1, seedsPerAuthority) : 0;
    const scalarTarget = seedsPerAuthority - equivalentTarget;
    let equivalentCount = 0;
    let scalarCount = 0;
    const unitTargets = answerUnitReviewTargets(authority.solveMode, seedsPerAuthority);
    const unitCounts = new Map(unitTargets.map((target) => [target.bucket, 0]));

    for (let index = 0; authorityRows.length < seedsPerAuthority && index < 500; index += 1) {
      const candidate = generateCp001Candidate(authority.provisionalId, `review:${authority.provisionalId}:${index}`);
      const teachingOpening = candidate.explanation.stepByStepSolution[0];
      const equivalent = isEquivalentSpeedFingerprint(candidate.mathematicalFingerprint);
      if (authority.solveMode === "convertSpeedUnit") {
        if (equivalent && equivalentCount >= equivalentTarget) continue;
        if (!equivalent && scalarCount >= scalarTarget) continue;
      }
      const unitBucket = answerUnitReviewBucket(candidate);
      if (unitTargets.length > 0) {
        const target = unitTargets.find((entry) => entry.bucket === unitBucket);
        if (!target || (unitCounts.get(target.bucket) ?? 0) >= target.count) continue;
      }
      if (
        fingerprints.has(candidate.mathematicalFingerprint)
        || stems.has(candidate.stem)
        || teachingOpenings.has(teachingOpening)
      ) continue;
      authorityRows.push(candidate);
      fingerprints.add(candidate.mathematicalFingerprint);
      stems.add(candidate.stem);
      teachingOpenings.add(teachingOpening);
      if (equivalent) equivalentCount += 1;
      else scalarCount += 1;
      if (unitBucket && unitCounts.has(unitBucket)) {
        unitCounts.set(unitBucket, (unitCounts.get(unitBucket) ?? 0) + 1);
      }
    }
    if (authorityRows.length !== seedsPerAuthority) {
      throw new Error(`${authority.solveMode}: could not export ${seedsPerAuthority} distinct mathematical, stem and teaching states`);
    }
    if (authority.solveMode === "convertSpeedUnit") {
      if (equivalentCount !== equivalentTarget || scalarCount !== scalarTarget) {
        throw new Error(`convertSpeedUnit: expected ${equivalentTarget} equivalent-set and ${scalarTarget} scalar review rows`);
      }
    }
    for (const target of unitTargets) {
      const actual = unitCounts.get(target.bucket) ?? 0;
      if (actual !== target.count) {
        throw new Error(
          `${authority.solveMode}: expected answer-unit bucket ${formatAnswerUnitTarget(target)}, received ${actual}`,
        );
      }
    }
    rows.push(...authorityRows);
  }
  return rows;
}

export function cp001AuthorityByMode(mode: TsdCp001DiscoverySolveMode): TsdCp001DiscoveryAuthority {
  const authority = TSD_CP001_DISCOVERY_AUTHORITIES.find((entry) => entry.solveMode === mode);
  if (!authority) throw new Error(`No CP-001 authority for ${mode}`);
  return authority;
}

export { stableStringify } from "./runtime-support";
