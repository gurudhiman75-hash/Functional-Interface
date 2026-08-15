import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LANGUAGES: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const QL_IDS = Array.from({ length: 228 }, (_, index) => `TMW-QL-${String(index + 1).padStart(3, "0")}`);
const DISTRIBUTION_SEEDS = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;
const CONCEPT_FAMILIES = new Set([
  "WORK_RATE_FOUNDATIONS",
  "COMBINED_RATES",
  "EFFICIENCY",
  "STAGED_JOIN_LEAVE",
  "ALTERNATING_CYCLES",
  "WORKFORCE_SCALING",
  "HETEROGENEOUS_CREWS",
  "WORK_WAGES",
  "PIPES_SIMULTANEOUS",
  "PIPES_STAGED_CYCLES",
  "VARIABLE_PRODUCTIVITY",
  "DATA_SUFFICIENCY",
  "STRUCTURED_TABLE",
  "STRUCTURED_CASELET",
]);
const EXAM_AFFINITIES = new Set(["CORE", "STANDARD", "ADVANCED", "ENRICHMENT", "SPECIAL_FORMAT"]);
const DISTRACTOR_QUALITIES = new Set(["MISCONCEPTION_DERIVED", "MISCONCEPTION_FIRST", "MIXED_GENERIC"]);

function ordinal(qlId: string): number {
  return Number(qlId.slice(-3));
}

function visibleExplanation(question: any): string {
  const publicExplanation = question.studentFacingExplanation;
  if (publicExplanation?.method && Array.isArray(publicExplanation.solution)) {
    return [publicExplanation.method, ...publicExplanation.solution, publicExplanation.answer].join(" ");
  }
  if (publicExplanation) {
    return [
      publicExplanation.opening ?? "",
      ...(publicExplanation.givens ?? []),
      publicExplanation.formula ?? "",
      ...(publicExplanation.steps ?? []),
      ...(publicExplanation.shortcut?.steps ?? []),
      publicExplanation.commonTrap?.explanation ?? "",
      publicExplanation.conclusion ?? "",
    ].join(" ");
  }
  return "";
}

function solvedAnswer(question: any): string | null {
  return question.solution?.answerText ?? question.answerText ?? question.canonicalAnswer ?? null;
}

function mathBalanced(value: string): boolean {
  return (value.match(/\\\(/g) ?? []).length === (value.match(/\\\)/g) ?? []).length;
}

function isDataSufficiency(qlOrdinal: number): boolean {
  return qlOrdinal >= 216 && qlOrdinal <= 223;
}

const byCheckpoint = new Map<string, number>();
const byLanguage = new Map<string, number>();
const snapshotAnswerPositions = new Map<number, number>();
const learnerVersions = new Map<string, number>();
const contractFingerprints = new Set<string>();
const affinityCounts = new Map<string, number>();
const conceptFamilyCounts = new Map<string, number>();
let cases = 0;
let maxStemTokens = 0;
let maxStemLabel = "";

for (const qlId of QL_IDS) {
  for (const language of LANGUAGES) {
    const seed = `tmw-final-228-audit:${qlId}:${language}`;
    const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
    const label = `${qlId}:${language}`;
    const qlOrdinal = ordinal(qlId);
    const explanation = visibleExplanation(question);
    const answer = solvedAnswer(question);
    const stemTokens = String(question.stem ?? "").trim().split(/\s+/u).filter(Boolean).length;
    const expectedOptionCount = isDataSufficiency(qlOrdinal) ? 5 : 4;
    cases += 1;
    maxStemTokens = Math.max(maxStemTokens, stemTokens);
    if (stemTokens === maxStemTokens) maxStemLabel = label;

    assert(question.questionLanguageId === qlId, `${label}: QL identity mismatch`);
    assert(question.language === language, `${label}: language identity mismatch`);
    assert(question.validation?.valid, `${label}: validation failed: ${(question.validation?.errors ?? []).join(" | ")}`);
    assert(question.publiclyPublishable === false, `${label}: publication lock changed before final GO`);
    assert(Array.isArray(question.options) && question.options.length === expectedOptionCount, `${label}: expected ${expectedOptionCount} options`);
    assert(new Set(question.options).size === expectedOptionCount, `${label}: options are not unique`);
    assert(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < expectedOptionCount, `${label}: invalid correctIndex`);
    assert(answer !== null, `${label}: solved/canonical answer is missing`);
    assert(question.options[question.correctIndex] === answer, `${label}: correct option does not equal solved/canonical answer`);
    assert(typeof question.stem === "string" && question.stem.trim().length > 20, `${label}: stem is missing or too short`);
    assert(explanation.trim().length > 20, `${label}: learner-facing explanation is missing or too short`);
    assert(!/undefined|null|NaN|Infinity|\{\{|\$\{/.test(`${question.stem} ${explanation} ${question.options.join(" ")}`), `${label}: unresolved learner-facing content`);
    assert(mathBalanced(`${question.stem} ${explanation} ${question.options.join(" ")}`), `${label}: unbalanced inline MathJax`);
    assert(!/Continue the calculation with the remaining quantity|After simplification, the required value is/i.test(explanation), `${label}: mechanical R2 boilerplate returned`);
    assert(stemTokens <= 125, `${label}: stem exceeds final 125-token hard ceiling (${stemTokens})`);

    assert(question.studentFacingExplanation, `${label}: student-facing explanation authority missing`);
    assert(question.explanationContract?.publicField === "studentFacingExplanation", `${label}: public explanation field is not explicit`);
    if (qlOrdinal <= 211) {
      assert(question.explanationContract?.legacyField === "explanation", `${label}: legacy explanation field not identified`);
      assert(question.explanationContract?.legacyVisibility === "INTERNAL_ONLY", `${label}: legacy explanation is not locked to internal use`);
    } else {
      assert(question.explanationContract?.legacyVisibility === "NOT_APPLICABLE", `${label}: extension explanation contract should have no legacy public field`);
    }

    assert(CONCEPT_FAMILIES.has(question.conceptFamily), `${label}: concept-family metadata missing or invalid`);
    assert(typeof question.diversityKey === "string" && question.diversityKey.startsWith(`${question.conceptFamily}:`), `${label}: diversity key missing or inconsistent`);
    assert(EXAM_AFFINITIES.has(question.examReadiness?.examAffinity), `${label}: exam-affinity metadata missing or invalid`);
    assert(typeof question.examReadiness?.selectionWeight === "number" && question.examReadiness.selectionWeight > 0 && question.examReadiness.selectionWeight <= 1, `${label}: selection weight outside 0..1`);
    assert(Array.isArray(question.examReadiness?.recommendedProfiles) && question.examReadiness.recommendedProfiles.length > 0, `${label}: recommended exam profiles missing`);
    assert(DISTRACTOR_QUALITIES.has(question.examReadiness?.distractorQuality), `${label}: distractor quality metadata missing or invalid`);
    affinityCounts.set(question.examReadiness.examAffinity, (affinityCounts.get(question.examReadiness.examAffinity) ?? 0) + 1);
    conceptFamilyCounts.set(question.conceptFamily, (conceptFamilyCounts.get(question.conceptFamily) ?? 0) + 1);

    if (language === "hi") {
      assert(/[\u0900-\u097F]/u.test(`${question.stem} ${explanation}`), `${label}: Hindi student text lacks Devanagari`);
      assert(!/कार्यक्षमता|कार्य-क्षमता/u.test(`${question.stem} ${explanation} ${question.options.join(" ")}`), `${label}: non-standard Hindi efficiency terminology returned`);
    }
    if (language === "pa") {
      assert(/[\u0A00-\u0A7F]/u.test(`${question.stem} ${explanation}`), `${label}: Punjabi student text lacks Gurmukhi`);
      assert(!/ਕਾਰਗੁਜ਼ਾਰੀ|ਦੱਖਤਾ/u.test(`${question.stem} ${explanation} ${question.options.join(" ")}`), `${label}: non-standard Punjabi efficiency terminology returned`);
    }

    if (qlOrdinal <= 211) {
      assert(question.learnerExplanationVersion === "TMW_LEARNER_V2", `${label}: legacy R4 learner version mismatch`);
      assert(question.learnerExplanation, `${label}: legacy learnerExplanation missing`);
    } else if (qlOrdinal <= 215) {
      assert(question.canonicalProblemId === "TMW-CP-012", `${label}: CP012 routing mismatch`);
      assert(question.learnerExplanationVersion === "TMW_COVERAGE_V1", `${label}: CP012 learner version mismatch`);
      assert(question.explanation?.steps?.length >= 3, `${label}: CP012 explanation too thin`);
    } else if (qlOrdinal <= 223) {
      assert(question.canonicalProblemId === "TMW-CP-013", `${label}: CP013 routing mismatch`);
      assert(question.representation === "DATA_SUFFICIENCY", `${label}: DS representation missing`);
      assert(question.answerSemantic === "DATA_SUFFICIENCY_CLASS", `${label}: DS answer semantic mismatch`);
      assert(question.learnerExplanationVersion === "TMW_DS_V1", `${label}: DS learner version mismatch`);
      assert(question.canonicalAnswer === question.verifierAnswer, `${label}: DS independent verifier mismatch`);
      assert(question.dataSufficiencyOptionCount === 5, `${label}: DS five-outcome contract missing`);
      assert(Array.isArray(question.dataSufficiencyClasses) && question.dataSufficiencyClasses.includes("EITHER_ALONE"), `${label}: DS either-alone class missing`);
      if (qlId === "TMW-QL-223") {
        assert(question.classValue === "EITHER_ALONE", `${label}: QL-223 must exercise the either-alone class`);
        assert(/either|कोई भी|ਕੋਈ ਵੀ/u.test(question.canonicalAnswer), `${label}: QL-223 either-alone answer is not learner-readable`);
      }
    } else {
      assert(question.canonicalProblemId === "TMW-CP-014", `${label}: CP014 routing mismatch`);
      assert(question.representation === "TABLE" || question.representation === "CASELET", `${label}: structured representation missing`);
      assert(question.learnerExplanationVersion === "TMW_PRESENTATION_V1", `${label}: presentation learner version mismatch`);
      assert(Array.isArray(question.presentationBlocks) && question.presentationBlocks.length === 1, `${label}: structured presentation block missing`);
      assert(typeof question.structuredQuestionText === "string" && question.structuredQuestionText.trim().length > 5, `${label}: structured question-only prompt missing`);
      assert(question.structuredRenderingContract?.mode === "STRUCTURED_PRIMARY_WITH_TEXT_FALLBACK", `${label}: structured rendering mode missing`);
      assert(question.structuredRenderingContract?.structuredField === "presentationBlocks", `${label}: structured rendering field mismatch`);
      assert(question.structuredRenderingContract?.fallbackField === "stem", `${label}: structured fallback field mismatch`);
      assert(question.structuredRenderingContract?.structuredPromptField === "structuredQuestionText", `${label}: structured prompt field mismatch`);
      assert(question.structuredRenderingContract?.renderTogether === false, `${label}: structured and fallback content must not render together`);
    }

    const cp = question.canonicalProblemId ?? question.cpId ?? "UNKNOWN";
    byCheckpoint.set(cp, (byCheckpoint.get(cp) ?? 0) + 1);
    byLanguage.set(language, (byLanguage.get(language) ?? 0) + 1);
    snapshotAnswerPositions.set(question.correctIndex, (snapshotAnswerPositions.get(question.correctIndex) ?? 0) + 1);
    const version = question.learnerExplanationVersion ?? "UNKNOWN";
    learnerVersions.set(version, (learnerVersions.get(version) ?? 0) + 1);

    const parameterFingerprint = question.mathematicalFingerprint ?? `${qlId}|${seed}`;
    const contractFingerprint = `${language}|${question.solveMode ?? "unknown"}|${parameterFingerprint}`;
    assert(!contractFingerprints.has(contractFingerprint), `${label}: duplicate same-language solve-mode + parameter fingerprint in final deterministic export`);
    contractFingerprints.add(contractFingerprint);
  }
}

assert(cases === 684, `Expected 684 final audit packages, got ${cases}`);
assert(byLanguage.get("en") === 228 && byLanguage.get("hi") === 228 && byLanguage.get("pa") === 228, "Final language parity count mismatch");
assert(learnerVersions.get("TMW_LEARNER_V2") === 633, `Expected 633 legacy R4 packages, got ${learnerVersions.get("TMW_LEARNER_V2") ?? 0}`);
assert(learnerVersions.get("TMW_COVERAGE_V1") === 12, `Expected 12 CP012 packages, got ${learnerVersions.get("TMW_COVERAGE_V1") ?? 0}`);
assert(learnerVersions.get("TMW_DS_V1") === 24, `Expected 24 CP013 packages, got ${learnerVersions.get("TMW_DS_V1") ?? 0}`);
assert(learnerVersions.get("TMW_PRESENTATION_V1") === 15, `Expected 15 CP014 packages, got ${learnerVersions.get("TMW_PRESENTATION_V1") ?? 0}`);
for (const affinity of ["CORE", "STANDARD", "ADVANCED", "ENRICHMENT", "SPECIAL_FORMAT"]) {
  assert((affinityCounts.get(affinity) ?? 0) > 0, `Exam-affinity bucket ${affinity} has no generated coverage`);
}
for (const family of CONCEPT_FAMILIES) {
  assert((conceptFamilyCounts.get(family) ?? 0) > 0, `Concept family ${family} has no generated coverage`);
}

const nonDsDistributionPositions = new Map<number, number>();
const dsDistributionPositions = new Map<number, number>();
let distributionCases = 0;
let nonDsDistributionCases = 0;
let dsDistributionCases = 0;
for (const qlId of QL_IDS) {
  for (const language of LANGUAGES) {
    for (const seedSuffix of DISTRIBUTION_SEEDS) {
      const seed = `tmw-position-audit:${qlId}:${language}:${seedSuffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      const qlOrdinal = ordinal(qlId);
      const ds = isDataSufficiency(qlOrdinal);
      const optionCount = ds ? 5 : 4;
      assert(question.validation?.valid, `${qlId}:${language}:${seedSuffix}: distribution sample is invalid`);
      assert(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < optionCount, `${qlId}:${language}:${seedSuffix}: invalid distribution correctIndex`);
      if (ds) {
        dsDistributionPositions.set(question.correctIndex, (dsDistributionPositions.get(question.correctIndex) ?? 0) + 1);
        dsDistributionCases += 1;
      } else {
        nonDsDistributionPositions.set(question.correctIndex, (nonDsDistributionPositions.get(question.correctIndex) ?? 0) + 1);
        nonDsDistributionCases += 1;
      }
      distributionCases += 1;
    }
  }
}
assert(distributionCases === 5472, `Expected 5472 position samples, got ${distributionCases}`);
assert(nonDsDistributionCases === 5280, `Expected 5280 non-DS position samples, got ${nonDsDistributionCases}`);
assert(dsDistributionCases === 192, `Expected 192 DS position samples, got ${dsDistributionCases}`);
for (const index of [0, 1, 2, 3]) {
  const count = nonDsDistributionPositions.get(index) ?? 0;
  const share = count / nonDsDistributionCases;
  assert(share >= 0.20 && share <= 0.30, `Non-DS correct-option position ${index} has biased multi-seed share ${(share * 100).toFixed(2)}% (${count}/${nonDsDistributionCases})`);
}
for (const index of [0, 1, 2, 3, 4]) {
  const count = dsDistributionPositions.get(index) ?? 0;
  const share = count / dsDistributionCases;
  assert(share >= 0.10 && share <= 0.30, `DS correct-option position ${index} has biased multi-seed share ${(share * 100).toFixed(2)}% (${count}/${dsDistributionCases})`);
}

console.log(JSON.stringify({
  chapter: "TMW-001",
  audit: "FINAL-228-QL-MULTILINGUAL-EXAM-READINESS",
  qls: QL_IDS.length,
  languages: LANGUAGES.length,
  cases,
  byLanguage: Object.fromEntries([...byLanguage.entries()].sort()),
  byCheckpoint: Object.fromEntries([...byCheckpoint.entries()].sort()),
  learnerVersions: Object.fromEntries([...learnerVersions.entries()].sort()),
  affinityCounts: Object.fromEntries([...affinityCounts.entries()].sort()),
  conceptFamilyCounts: Object.fromEntries([...conceptFamilyCounts.entries()].sort()),
  snapshotAnswerPositions: Object.fromEntries([...snapshotAnswerPositions.entries()].sort(([a], [b]) => a - b)),
  multiSeedDistributionCases: distributionCases,
  nonDsMultiSeedAnswerPositions: Object.fromEntries([...nonDsDistributionPositions.entries()].sort(([a], [b]) => a - b)),
  dsMultiSeedAnswerPositions: Object.fromEntries([...dsDistributionPositions.entries()].sort(([a], [b]) => a - b)),
  uniqueSameLanguageContractFingerprints: contractFingerprints.size,
  maxStemTokens,
  maxStemLabel,
  publicationLocked: true,
  verdict: "PASS",
}, null, 2));
