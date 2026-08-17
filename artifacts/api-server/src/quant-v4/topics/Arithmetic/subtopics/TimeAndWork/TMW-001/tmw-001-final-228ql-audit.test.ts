import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LANGUAGES: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const QL_IDS = Array.from({ length: 228 }, (_, index) => `TMW-QL-${String(index + 1).padStart(3, "0")}`);
const DISTRIBUTION_SEEDS = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;

function ordinal(qlId: string): number {
  return Number(qlId.slice(-3));
}

function optionCountFor(qlOrdinal: number): number {
  return qlOrdinal >= 216 && qlOrdinal <= 223 ? 5 : 4;
}

function visibleExplanation(question: any): string {
  if (question.learnerExplanation) {
    return [question.learnerExplanation.method, ...question.learnerExplanation.solution, question.learnerExplanation.answer].join(" ");
  }
  if (question.explanation) {
    return [
      question.explanation.opening ?? "",
      ...(question.explanation.givens ?? []),
      question.explanation.formula ?? "",
      ...(question.explanation.steps ?? []),
      ...(question.explanation.shortcut?.steps ?? []),
      question.explanation.commonTrap?.explanation ?? "",
      question.explanation.conclusion ?? "",
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

const byCheckpoint = new Map<string, number>();
const byLanguage = new Map<string, number>();
const snapshotAnswerPositions = new Map<number, number>();
const learnerVersions = new Map<string, number>();
const contractFingerprints = new Set<string>();
let cases = 0;
let maxStemTokens = 0;
let maxStemLabel = "";

for (const qlId of QL_IDS) {
  for (const language of LANGUAGES) {
    const seed = `tmw-final-228-audit:${qlId}:${language}`;
    const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
    const label = `${qlId}:${language}`;
    const qlOrdinal = ordinal(qlId);
    const expectedOptions = optionCountFor(qlOrdinal);
    const explanation = visibleExplanation(question);
    const answer = solvedAnswer(question);
    const stemTokens = String(question.stem ?? "").trim().split(/\s+/u).filter(Boolean).length;
    cases += 1;
    maxStemTokens = Math.max(maxStemTokens, stemTokens);
    if (stemTokens === maxStemTokens) maxStemLabel = label;

    assert(question.questionLanguageId === qlId, `${label}: QL identity mismatch`);
    assert(question.language === language || qlOrdinal <= 211, `${label}: language identity mismatch`);
    assert(question.validation?.valid, `${label}: validation failed: ${(question.validation?.errors ?? []).join(" | ")}`);
    assert(question.publiclyPublishable === false, `${label}: publication lock changed before final GO`);
    assert(Array.isArray(question.options) && question.options.length === expectedOptions, `${label}: expected ${expectedOptions} options`);
    assert(new Set(question.options).size === expectedOptions, `${label}: options are not unique`);
    assert(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < expectedOptions, `${label}: invalid correctIndex`);
    assert(answer !== null, `${label}: solved/canonical answer is missing`);
    assert(question.options[question.correctIndex] === answer, `${label}: correct option does not equal solved/canonical answer`);
    assert(typeof question.stem === "string" && question.stem.trim().length > 20, `${label}: stem is missing or too short`);
    assert(explanation.trim().length > 20, `${label}: learner-facing explanation is missing or too short`);
    assert(!/undefined|null|NaN|Infinity|\{\{|\$\{/.test(`${question.stem} ${explanation} ${question.options.join(" ")}`), `${label}: unresolved learner-facing content`);
    assert(mathBalanced(`${question.stem} ${explanation} ${question.options.join(" ")}`), `${label}: unbalanced inline MathJax`);
    assert(!/Continue the calculation with the remaining quantity|After simplification, the required value is/i.test(explanation), `${label}: mechanical R2 boilerplate returned`);
    assert(stemTokens <= 125, `${label}: stem exceeds final 125-token hard ceiling (${stemTokens})`);

    if (language === "hi") {
      assert(/[\u0900-\u097F]/u.test(`${question.stem} ${explanation}`), `${label}: Hindi student text lacks Devanagari`);
    }
    if (language === "pa") {
      assert(/[\u0A00-\u0A7F]/u.test(`${question.stem} ${explanation}`), `${label}: Punjabi student text lacks Gurmukhi`);
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
      assert(question.learnerExplanationVersion === "TMW_DS_V2", `${label}: DS learner version mismatch`);
      assert(question.learnerExplanation?.solution?.length >= 4, `${label}: DS learner explanation missing or too thin`);
      assert(question.canonicalAnswer === question.verifierAnswer, `${label}: DS independent verifier mismatch`);
      assert(new Set((question.optionAudit ?? []).map((option: any) => option.value)).size === 5, `${label}: DS five-class option scheme incomplete`);
    } else {
      assert(question.canonicalProblemId === "TMW-CP-014", `${label}: CP014 routing mismatch`);
      assert(question.representation === "TABLE" || question.representation === "CASELET", `${label}: structured representation missing`);
      assert(question.learnerExplanationVersion === "TMW_PRESENTATION_V1", `${label}: presentation learner version mismatch`);
      assert(Array.isArray(question.presentationBlocks) && question.presentationBlocks.length === 1, `${label}: structured presentation block missing`);
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
assert(learnerVersions.get("TMW_DS_V2") === 24, `Expected 24 CP013 packages, got ${learnerVersions.get("TMW_DS_V2") ?? 0}`);
assert(learnerVersions.get("TMW_PRESENTATION_V1") === 15, `Expected 15 CP014 packages, got ${learnerVersions.get("TMW_PRESENTATION_V1") ?? 0}`);

const distributionPositions = new Map<number, number>();
const cp013DistributionPositions = new Map<number, number>();
let distributionCases = 0;
let cp013DistributionCases = 0;
for (const qlId of QL_IDS) {
  const qlOrdinal = ordinal(qlId);
  const expectedOptions = optionCountFor(qlOrdinal);
  for (const language of LANGUAGES) {
    for (const seedSuffix of DISTRIBUTION_SEEDS) {
      const seed = `tmw-position-audit:${qlId}:${language}:${seedSuffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      assert(question.validation?.valid, `${qlId}:${language}:${seedSuffix}: distribution sample is invalid`);
      assert(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < expectedOptions, `${qlId}:${language}:${seedSuffix}: invalid distribution correctIndex`);
      distributionPositions.set(question.correctIndex, (distributionPositions.get(question.correctIndex) ?? 0) + 1);
      distributionCases += 1;
      if (qlOrdinal >= 216 && qlOrdinal <= 223) {
        cp013DistributionPositions.set(question.correctIndex, (cp013DistributionPositions.get(question.correctIndex) ?? 0) + 1);
        cp013DistributionCases += 1;
      }
    }
  }
}
assert(distributionCases === 5472, `Expected 5472 position samples, got ${distributionCases}`);
for (const index of [0, 1, 2, 3]) {
  const count = distributionPositions.get(index) ?? 0;
  const share = count / distributionCases;
  assert(share >= 0.20 && share <= 0.30, `Correct-option position ${index} has biased multi-seed share ${(share * 100).toFixed(2)}% (${count}/${distributionCases})`);
}
assert(cp013DistributionCases === 192, `Expected 192 CP013 position samples, got ${cp013DistributionCases}`);
for (const index of [0, 1, 2, 3, 4]) {
  const count = cp013DistributionPositions.get(index) ?? 0;
  const share = count / cp013DistributionCases;
  assert(share >= 0.10 && share <= 0.30, `CP013 correct-option position ${index} has biased share ${(share * 100).toFixed(2)}% (${count}/${cp013DistributionCases})`);
}

console.log(JSON.stringify({
  chapter: "TMW-001",
  audit: "FINAL-228-QL-MULTILINGUAL",
  qls: QL_IDS.length,
  languages: LANGUAGES.length,
  cases,
  byLanguage: Object.fromEntries([...byLanguage.entries()].sort()),
  byCheckpoint: Object.fromEntries([...byCheckpoint.entries()].sort()),
  learnerVersions: Object.fromEntries([...learnerVersions.entries()].sort()),
  snapshotAnswerPositions: Object.fromEntries([...snapshotAnswerPositions.entries()].sort(([a], [b]) => a - b)),
  multiSeedDistributionCases: distributionCases,
  multiSeedAnswerPositions: Object.fromEntries([...distributionPositions.entries()].sort(([a], [b]) => a - b)),
  cp013DistributionCases,
  cp013AnswerPositions: Object.fromEntries([...cp013DistributionPositions.entries()].sort(([a], [b]) => a - b)),
  uniqueSameLanguageContractFingerprints: contractFingerprints.size,
  maxStemTokens,
  maxStemLabel,
  publicationLocked: true,
  verdict: "PASS",
}, null, 2));