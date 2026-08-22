import { STA_ENGLISH_CORPUS_V2 } from "./english-corpus/index.ts";
import { evaluateAssumptionOracle } from "./oracle.ts";
import type { StaAnswerSet, StaCandidateAuthority, StaQlId } from "./types.ts";
import type { StaLocalizationBundle, StaLocalizedLocale } from "./localization-types.ts";
import { STA_QL001_HINDI_REVIEW_COPY, STA_QL001_PUNJABI_REVIEW_COPY } from "./localization-ql001-copy.ts";
import { STA_QL002_HINDI_REVIEW_COPY, STA_QL002_PUNJABI_REVIEW_COPY } from "./localization-ql002-copy.ts";
import { STA_QL003_HINDI_REVIEW_COPY, STA_QL003_PUNJABI_REVIEW_COPY } from "./localization-ql003-copy.ts";
import { STA_QL004_HINDI_REVIEW_COPY, STA_QL004_PUNJABI_REVIEW_COPY } from "./localization-ql004-copy.ts";
import { editorializeStaQl001LocalizedText } from "./localization-ql001-editorial-v2.ts";
import { editorializeStaQl002LocalizedText } from "./localization-ql002-editorial-v2.ts";
import { editorializeStaQl003LocalizedText } from "./localization-ql003-editorial-v2.ts";
import { editorializeStaQl004LocalizedText } from "./localization-ql004-editorial-v2.ts";
import { examRealizeStaQl004Statement } from "./localization-ql004-editorial-v3.ts";

export type StaExamLocale = "en-IN" | StaLocalizedLocale;
export type StaExamQueryPolarity = "IMPLICIT" | "NOT_IMPLICIT";
export type StaExamCandidateCount = 2 | 3;
export type StaExamOptionCount = 4 | 5;
export type StaExamProfileId =
  | "SSC_2X4"
  | "SSC_3X4"
  | "BANK_2X5"
  | "BANK_3X5"
  | "BANK_3X5_NEGATIVE"
  | "PUNJAB_2X4"
  | "PUNJAB_3X4";

type Scenario = (typeof STA_ENGLISH_CORPUS_V2)[number];
type SourceProfile = Scenario["sourceProfile"];

interface StaExamProfile {
  readonly profileId: StaExamProfileId;
  readonly candidateCount: StaExamCandidateCount;
  readonly optionCount: StaExamOptionCount;
  readonly queryPolarity: StaExamQueryPolarity;
  readonly sourceProfiles: readonly SourceProfile[];
}

/**
 * Presentation profiles are deliberately restricted to source-backed STA surfaces.
 * Source ownership audit V1 authorizes two- and three-assumption candidate sets;
 * a four-assumption banking profile is therefore not exposed until direct source
 * evidence is recorded and reviewed.
 */
export const STA_EXAM_PROFILES: Readonly<Record<StaExamProfileId, StaExamProfile>> = {
  SSC_2X4: { profileId: "SSC_2X4", candidateCount: 2, optionCount: 4, queryPolarity: "IMPLICIT", sourceProfiles: ["SSC"] },
  SSC_3X4: { profileId: "SSC_3X4", candidateCount: 3, optionCount: 4, queryPolarity: "IMPLICIT", sourceProfiles: ["SSC"] },
  BANK_2X5: { profileId: "BANK_2X5", candidateCount: 2, optionCount: 5, queryPolarity: "IMPLICIT", sourceProfiles: ["BANKING"] },
  BANK_3X5: { profileId: "BANK_3X5", candidateCount: 3, optionCount: 5, queryPolarity: "IMPLICIT", sourceProfiles: ["BANKING"] },
  BANK_3X5_NEGATIVE: { profileId: "BANK_3X5_NEGATIVE", candidateCount: 3, optionCount: 5, queryPolarity: "NOT_IMPLICIT", sourceProfiles: ["BANKING"] },
  PUNJAB_2X4: { profileId: "PUNJAB_2X4", candidateCount: 2, optionCount: 4, queryPolarity: "IMPLICIT", sourceProfiles: ["PUNJAB_STATE"] },
  PUNJAB_3X4: { profileId: "PUNJAB_3X4", candidateCount: 3, optionCount: 4, queryPolarity: "IMPLICIT", sourceProfiles: ["PUNJAB_STATE"] },
};

export interface StaExamFormatRenderedCandidate {
  readonly label: "I" | "II" | "III";
  readonly candidateId: string;
  readonly text: string;
  readonly oracle: ReturnType<typeof evaluateAssumptionOracle>;
}

export interface StaExamFormatAnswerSetOption {
  readonly kind: "ANSWER_SET";
  readonly display: string;
  readonly semanticAnswerSet: StaAnswerSet;
  readonly isCorrect: boolean;
}

export interface StaExamFormatNoneOption {
  readonly kind: "NONE_OF_THE_ABOVE";
  readonly display: string;
  readonly semanticAnswerSet: null;
  readonly isCorrect: false;
}

export type StaExamFormatOption = StaExamFormatAnswerSetOption | StaExamFormatNoneOption;

export interface StaExamFormatQuestion {
  readonly questionId: string;
  readonly packageId: "STA-001";
  readonly chapterId: "REAS-STA";
  readonly qlId: StaQlId;
  readonly scenarioId: string;
  readonly seed: string;
  readonly locale: StaExamLocale;
  readonly sourceProfile: SourceProfile;
  readonly difficulty: Scenario["difficulty"];
  readonly presentationProfile: StaExamProfileId;
  readonly candidateCount: StaExamCandidateCount;
  readonly optionCount: StaExamOptionCount;
  readonly queryPolarity: StaExamQueryPolarity;
  readonly instruction: string;
  readonly statement: string;
  readonly candidates: readonly StaExamFormatRenderedCandidate[];
  readonly implicitAnswerSet: StaAnswerSet;
  readonly answerSet: StaAnswerSet;
  readonly options: readonly StaExamFormatOption[];
  readonly answerIndex: number;
  readonly explanation: string;
  readonly oracleParity: true;
  readonly lifecycle: {
    readonly semanticQls: "FROZEN";
    readonly englishCorpus: "FROZEN_V2";
    readonly ql001HindiPunjabi: "FROZEN_V2";
    readonly ql002HindiPunjabi: "FROZEN_V2";
    readonly ql003HindiPunjabi: "FROZEN_V2";
    readonly ql004HindiPunjabi: "REVIEW_CANDIDATE_V3";
    readonly examFormatStatus: "REVIEW_CANDIDATE_V1";
    readonly multilingualChapterFrozen: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

const EXAM_FORMAT_LIFECYCLE = {
  semanticQls: "FROZEN",
  englishCorpus: "FROZEN_V2",
  ql001HindiPunjabi: "FROZEN_V2",
  ql002HindiPunjabi: "FROZEN_V2",
  ql003HindiPunjabi: "FROZEN_V2",
  ql004HindiPunjabi: "REVIEW_CANDIDATE_V3",
  examFormatStatus: "REVIEW_CANDIDATE_V1",
  multilingualChapterFrozen: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
} as const;

function hash32(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function createRng(seed: string): () => number {
  let state = hash32(seed) || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x1_0000_0000;
  };
}

function deterministicShuffle<T>(values: readonly T[], seed: string): T[] {
  const output = [...values];
  const rng = createRng(seed);
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    const temp = output[index]!;
    output[index] = output[swapIndex]!;
    output[swapIndex] = temp;
  }
  return output;
}

function choose<T>(values: readonly T[], seed: string): T {
  if (values.length === 0) throw new Error(`Cannot choose from empty collection (${seed})`);
  return values[hash32(seed) % values.length]!;
}

function roman(index: number): "I" | "II" | "III" {
  if (index === 0) return "I";
  if (index === 1) return "II";
  if (index === 2) return "III";
  throw new Error(`Unsupported assumption label index ${index}`);
}

function sameAnswerSet(a: StaAnswerSet, b: StaAnswerSet): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function allAnswerSets(candidateCount: StaExamCandidateCount): StaAnswerSet[] {
  const output: StaAnswerSet[] = [];
  const total = 1 << candidateCount;
  for (let mask = 0; mask < total; mask += 1) {
    const set: number[] = [];
    for (let index = 0; index < candidateCount; index += 1) if ((mask & (1 << index)) !== 0) set.push(index);
    output.push(set);
  }
  return output;
}

function conjunction(locale: StaExamLocale): string {
  if (locale === "hi-IN") return " और ";
  if (locale === "pa-IN") return " ਅਤੇ ";
  return " and ";
}

function displayAnswerSet(locale: StaExamLocale, answer: StaAnswerSet, candidateCount: StaExamCandidateCount): string {
  const labels = answer.map(roman);
  const allLabels = Array.from({ length: candidateCount }, (_, index) => roman(index));
  if (answer.length === 0) {
    if (locale === "hi-IN") return `${allLabels.join(", ")} में से कोई नहीं`;
    if (locale === "pa-IN") return `${allLabels.join(", ")} ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਨਹੀਂ`;
    return `None of ${allLabels.join(", ")}`;
  }
  if (answer.length === candidateCount) {
    if (candidateCount === 2) {
      if (locale === "hi-IN") return "I और II दोनों";
      if (locale === "pa-IN") return "I ਅਤੇ II ਦੋਵੇਂ";
      return "Both I and II";
    }
    if (locale === "hi-IN") return `${allLabels.join(", ")} सभी`;
    if (locale === "pa-IN") return `${allLabels.join(", ")} ਸਾਰੀਆਂ`;
    return `All ${allLabels.join(", ")}`;
  }
  const joined = labels.join(conjunction(locale));
  if (locale === "hi-IN") return `केवल ${joined}`;
  if (locale === "pa-IN") return `ਕੇਵਲ ${joined}`;
  return `Only ${joined}`;
}

function noneOfAbove(locale: StaExamLocale): string {
  if (locale === "hi-IN") return "इनमें से कोई नहीं";
  if (locale === "pa-IN") return "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ";
  return "None of these";
}

function instructionFor(locale: StaExamLocale, polarity: StaExamQueryPolarity): string {
  if (locale === "hi-IN") {
    return polarity === "IMPLICIT"
      ? "कथन और दी गई पूर्वधारणाओं पर विचार करें और बताएं कि कौन-सी पूर्वधारणा कथन में निहित है।"
      : "कथन और दी गई पूर्वधारणाओं पर विचार करें और बताएं कि कौन-सी पूर्वधारणा कथन में निहित नहीं है।";
  }
  if (locale === "pa-IN") {
    return polarity === "IMPLICIT"
      ? "ਕਥਨ ਅਤੇ ਦਿੱਤੀਆਂ ਧਾਰਨਾਵਾਂ ਨੂੰ ਵੇਖੋ ਅਤੇ ਦੱਸੋ ਕਿ ਕਿਹੜੀ ਧਾਰਨਾ ਕਥਨ ਵਿੱਚ ਨਿਹਿਤ ਹੈ।"
      : "ਕਥਨ ਅਤੇ ਦਿੱਤੀਆਂ ਧਾਰਨਾਵਾਂ ਨੂੰ ਵੇਖੋ ਅਤੇ ਦੱਸੋ ਕਿ ਕਿਹੜੀ ਧਾਰਨਾ ਕਥਨ ਵਿੱਚ ਨਿਹਿਤ ਨਹੀਂ ਹੈ।";
  }
  return polarity === "IMPLICIT"
    ? "Consider the statement and decide which of the given assumptions is implicit."
    : "Consider the statement and decide which of the given assumptions is not implicit.";
}

function localizedBundle(qlId: StaQlId, locale: StaLocalizedLocale): StaLocalizationBundle {
  if (qlId === "STA-QL-001") return locale === "hi-IN" ? STA_QL001_HINDI_REVIEW_COPY : STA_QL001_PUNJABI_REVIEW_COPY;
  if (qlId === "STA-QL-002") return locale === "hi-IN" ? STA_QL002_HINDI_REVIEW_COPY : STA_QL002_PUNJABI_REVIEW_COPY;
  if (qlId === "STA-QL-003") return locale === "hi-IN" ? STA_QL003_HINDI_REVIEW_COPY : STA_QL003_PUNJABI_REVIEW_COPY;
  return locale === "hi-IN" ? STA_QL004_HINDI_REVIEW_COPY : STA_QL004_PUNJABI_REVIEW_COPY;
}

function editorializeLocalized(qlId: StaQlId, locale: StaLocalizedLocale, value: string): string {
  if (qlId === "STA-QL-001") return editorializeStaQl001LocalizedText(locale, value);
  if (qlId === "STA-QL-002") return editorializeStaQl002LocalizedText(locale, value);
  if (qlId === "STA-QL-003") return editorializeStaQl003LocalizedText(locale, value);
  return editorializeStaQl004LocalizedText(locale, value);
}

function availableCandidates(scenario: Scenario, locale: StaExamLocale): readonly StaCandidateAuthority[] {
  if (locale === "en-IN") return scenario.candidates;
  const copy = localizedBundle(scenario.proposedQlId, locale)[scenario.scenarioId];
  if (!copy) return [];
  return scenario.candidates.filter((candidate) => Boolean(copy.candidates[candidate.candidateId]));
}

function eligibleScenarios(profile: StaExamProfile, locale: StaExamLocale): Scenario[] {
  return STA_ENGLISH_CORPUS_V2.filter((scenario) =>
    profile.sourceProfiles.includes(scenario.sourceProfile)
    && availableCandidates(scenario, locale).length >= profile.candidateCount,
  );
}

function renderStatement(scenario: Scenario, locale: StaExamLocale, seed: string): string {
  if (locale === "en-IN") return choose(scenario.statementVariants, `${seed}:statement`);
  const copy = localizedBundle(scenario.proposedQlId, locale)[scenario.scenarioId];
  if (!copy) throw new Error(`${scenario.scenarioId}/${locale}: missing localized scenario copy`);
  const raw = choose(copy.statementVariants, `${seed}:statement`);
  const v2 = editorializeLocalized(scenario.proposedQlId, locale, raw);
  return scenario.proposedQlId === "STA-QL-004" ? examRealizeStaQl004Statement(locale, v2) : v2;
}

function renderCandidateText(scenario: Scenario, candidate: StaCandidateAuthority, locale: StaExamLocale, seed: string): string {
  if (locale === "en-IN") return choose(candidate.textVariants, `${seed}:${candidate.candidateId}:text`);
  const copy = localizedBundle(scenario.proposedQlId, locale)[scenario.scenarioId];
  const localizedCandidate = copy?.candidates[candidate.candidateId];
  if (!localizedCandidate) throw new Error(`${scenario.scenarioId}/${locale}/${candidate.candidateId}: missing localized candidate copy`);
  return editorializeLocalized(scenario.proposedQlId, locale, choose(localizedCandidate.textVariants, `${seed}:${candidate.candidateId}:text`));
}

function renderedRationale(scenario: Scenario, candidate: StaCandidateAuthority, locale: StaExamLocale): string {
  if (locale === "en-IN") return candidate.rationale;
  const copy = localizedBundle(scenario.proposedQlId, locale)[scenario.scenarioId];
  const localizedCandidate = copy?.candidates[candidate.candidateId];
  if (!localizedCandidate) throw new Error(`${scenario.scenarioId}/${locale}/${candidate.candidateId}: missing localized candidate rationale`);
  return editorializeLocalized(scenario.proposedQlId, locale, localizedCandidate.rationale);
}

function targetAnswerSet(implicit: StaAnswerSet, candidateCount: StaExamCandidateCount, polarity: StaExamQueryPolarity): StaAnswerSet {
  if (polarity === "IMPLICIT") return [...implicit];
  const implicitSet = new Set(implicit);
  return Array.from({ length: candidateCount }, (_, index) => index).filter((index) => !implicitSet.has(index));
}

function buildOptions(
  correct: StaAnswerSet,
  candidateCount: StaExamCandidateCount,
  optionCount: StaExamOptionCount,
  locale: StaExamLocale,
  seed: string,
): readonly StaExamFormatOption[] {
  const allSets = allAnswerSets(candidateCount);
  let options: StaExamFormatOption[];

  if (candidateCount === 2 && optionCount === 5) {
    options = allSets.map((set) => ({
      kind: "ANSWER_SET" as const,
      display: displayAnswerSet(locale, set, candidateCount),
      semanticAnswerSet: [...set],
      isCorrect: sameAnswerSet(set, correct),
    }));
    options.push({ kind: "NONE_OF_THE_ABOVE", display: noneOfAbove(locale), semanticAnswerSet: null, isCorrect: false });
  } else {
    const distractorCount = optionCount - 1;
    const distractors = deterministicShuffle(
      allSets.filter((set) => !sameAnswerSet(set, correct)),
      `${seed}:option-distractors`,
    ).slice(0, distractorCount);
    options = [correct, ...distractors].map((set) => ({
      kind: "ANSWER_SET" as const,
      display: displayAnswerSet(locale, set, candidateCount),
      semanticAnswerSet: [...set],
      isCorrect: sameAnswerSet(set, correct),
    }));
  }

  return deterministicShuffle(options, `${seed}:option-order`);
}

function buildExplanation(
  scenario: Scenario,
  rendered: readonly StaExamFormatRenderedCandidate[],
  selected: readonly StaCandidateAuthority[],
  locale: StaExamLocale,
  target: StaAnswerSet,
  profile: StaExamProfile,
): string {
  const lines: string[] = [];
  for (let index = 0; index < rendered.length; index += 1) {
    const candidate = rendered[index]!;
    const authority = selected[index]!;
    const implicit = candidate.oracle.classification === "IMPLICIT";
    const rationale = renderedRationale(scenario, authority, locale);
    if (locale === "hi-IN") lines.push(`पूर्वधारणा ${candidate.label} ${implicit ? "निहित है" : "निहित नहीं है"}: ${rationale}`);
    else if (locale === "pa-IN") lines.push(`ਧਾਰਨਾ ${candidate.label} ${implicit ? "ਨਿਹਿਤ ਹੈ" : "ਨਿਹਿਤ ਨਹੀਂ ਹੈ"}: ${rationale}`);
    else lines.push(`Assumption ${candidate.label} is ${implicit ? "implicit" : "not implicit"}: ${rationale}`);
  }
  const answerDisplay = displayAnswerSet(locale, target, profile.candidateCount);
  if (locale === "hi-IN") lines.push(`इस प्रश्न में सही विकल्प है: ${answerDisplay}।`);
  else if (locale === "pa-IN") lines.push(`ਇਸ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਸਹੀ ਵਿਕਲਪ ਹੈ: ${answerDisplay}।`);
  else lines.push(`Therefore, the correct choice is: ${answerDisplay}.`);
  return lines.join("\n\n");
}

export function getStaExamProfileEligibleScenarioCount(profileId: StaExamProfileId, locale: StaExamLocale): number {
  return eligibleScenarios(STA_EXAM_PROFILES[profileId], locale).length;
}

export function generateStaExamFormatQuestion(seed: string, locale: StaExamLocale, profileId: StaExamProfileId): StaExamFormatQuestion {
  const profile = STA_EXAM_PROFILES[profileId];
  const scenarios = eligibleScenarios(profile, locale);
  if (scenarios.length === 0) throw new Error(`${profileId}/${locale}: no eligible STA scenarios for exam presentation profile`);
  const scenario = choose(scenarios, `${seed}:${profileId}:scenario`);
  const candidatePool = availableCandidates(scenario, locale);
  const selected = deterministicShuffle(candidatePool, `${seed}:${scenario.scenarioId}:candidate-selection`).slice(0, profile.candidateCount);
  if (selected.length !== profile.candidateCount) throw new Error(`${scenario.scenarioId}: insufficient candidates for ${profileId}`);

  const rendered = selected.map((candidate, index) => ({
    label: roman(index),
    candidateId: candidate.candidateId,
    text: renderCandidateText(scenario, candidate, locale, seed),
    oracle: evaluateAssumptionOracle(scenario, candidate),
  }));
  const implicitAnswerSet = rendered.flatMap((candidate, index) => candidate.oracle.classification === "IMPLICIT" ? [index] : []);
  const answerSet = targetAnswerSet(implicitAnswerSet, profile.candidateCount, profile.queryPolarity);
  const options = buildOptions(answerSet, profile.candidateCount, profile.optionCount, locale, seed);
  const answerIndex = options.findIndex((option) => option.isCorrect);
  if (answerIndex < 0 || answerIndex >= profile.optionCount) throw new Error(`${seed}/${profileId}: correct option missing`);

  const question: StaExamFormatQuestion = {
    questionId: `STA-FMT-${hash32(`${seed}:${profileId}:${scenario.scenarioId}`).toString(16).padStart(8, "0")}`,
    packageId: "STA-001",
    chapterId: "REAS-STA",
    qlId: scenario.proposedQlId,
    scenarioId: scenario.scenarioId,
    seed,
    locale,
    sourceProfile: scenario.sourceProfile,
    difficulty: scenario.difficulty,
    presentationProfile: profileId,
    candidateCount: profile.candidateCount,
    optionCount: profile.optionCount,
    queryPolarity: profile.queryPolarity,
    instruction: instructionFor(locale, profile.queryPolarity),
    statement: renderStatement(scenario, locale, seed),
    candidates: rendered,
    implicitAnswerSet,
    answerSet,
    options,
    answerIndex,
    explanation: buildExplanation(scenario, rendered, selected, locale, answerSet, profile),
    oracleParity: true,
    lifecycle: EXAM_FORMAT_LIFECYCLE,
  };
  assertStaExamFormatIntegrity(question);
  return question;
}

export function assertStaExamFormatIntegrity(question: StaExamFormatQuestion): void {
  if (question.candidates.length !== question.candidateCount) throw new Error(`${question.questionId}: candidate-count mismatch`);
  if (question.options.length !== question.optionCount) throw new Error(`${question.questionId}: option-count mismatch`);
  if (question.options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${question.questionId}: expected exactly one correct option`);
  if (!question.options[question.answerIndex]?.isCorrect) throw new Error(`${question.questionId}: answer-index mismatch`);
  const correct = question.options[question.answerIndex]!;
  if (correct.kind !== "ANSWER_SET" || !sameAnswerSet(correct.semanticAnswerSet, question.answerSet)) throw new Error(`${question.questionId}: correct semantic answer-set mismatch`);
  const displays = new Set(question.options.map((option) => option.display));
  if (displays.size !== question.options.length) throw new Error(`${question.questionId}: duplicate visible options`);
  const answerSetKeys = question.options.filter((option): option is StaExamFormatAnswerSetOption => option.kind === "ANSWER_SET").map((option) => option.semanticAnswerSet.join(","));
  if (new Set(answerSetKeys).size !== answerSetKeys.length) throw new Error(`${question.questionId}: duplicate semantic answer options`);
  if (question.candidates.some((candidate) => candidate.oracle.evidenceCode === "MISSING_SEMANTIC_NEGATION")) throw new Error(`${question.questionId}: missing semantic negation`);
  if (question.candidates.some((candidate, index) => candidate.label !== roman(index))) throw new Error(`${question.questionId}: candidate label order mismatch`);
  if (/STA-|BREAKS_|REQUIRED_HIDDEN_DEPENDENCY|NO_REQUIRED_DEPENDENCY/.test(question.explanation)) throw new Error(`${question.questionId}: internal authority leaked into explanation`);
  if (question.explanation.includes(question.statement)) throw new Error(`${question.questionId}: explanation repeats full stem`);
  if (question.lifecycle.questionStudioDiscoverable || question.lifecycle.questionBankWritable || question.lifecycle.testEligible || question.lifecycle.publiclyPublishable) {
    throw new Error(`${question.questionId}: downstream product lock opened before exam-format freeze`);
  }
}
