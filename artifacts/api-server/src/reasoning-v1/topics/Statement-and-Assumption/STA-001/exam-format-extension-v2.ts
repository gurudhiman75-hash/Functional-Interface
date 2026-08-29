import { STA_ENGLISH_CORPUS_V2 } from "./english-corpus/index.ts";
import { getStaBankFifthAssumptionOverlay } from "./exam-format-bank-fifth-assumption.ts";
import {
  STA_EXAM_PROFILES,
  generateStaExamFormatQuestion,
  type StaExamFormatOption,
  type StaExamFormatQuestion,
  type StaExamLocale,
  type StaExamProfileId,
} from "./exam-format-extension.ts";
import { evaluateAssumptionOracle } from "./oracle.ts";
import type { StaAnswerSet, StaDependency, StaOracleResult, StaScenarioAuthority } from "./types.ts";

export type StaExamProfileIdV2 = StaExamProfileId | "BANK_5X5";
export type StaExamCandidateLabelV2 = "I" | "II" | "III" | "IV" | "V";

export const STA_EXAM_PROFILE_IDS_V2: readonly StaExamProfileIdV2[] = [
  ...Object.keys(STA_EXAM_PROFILES) as StaExamProfileId[],
  "BANK_5X5",
];

export interface StaExamFormatFiveRenderedCandidate {
  readonly label: StaExamCandidateLabelV2;
  readonly candidateId: string;
  readonly text: string;
  readonly oracle: StaOracleResult;
}

export interface StaExamFormatFiveQuestion {
  readonly questionId: string;
  readonly packageId: "STA-001";
  readonly chapterId: "REAS-STA";
  readonly qlId: StaExamFormatQuestion["qlId"];
  readonly scenarioId: string;
  readonly seed: string;
  readonly locale: StaExamLocale;
  readonly sourceProfile: "BANKING";
  readonly difficulty: StaExamFormatQuestion["difficulty"];
  readonly presentationProfile: "BANK_5X5";
  readonly candidateCount: 5;
  readonly optionCount: 5;
  readonly queryPolarity: "IMPLICIT";
  readonly instruction: string;
  readonly statement: string;
  readonly candidates: readonly StaExamFormatFiveRenderedCandidate[];
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
    readonly examFormatStatus: "REVIEW_CANDIDATE_V2";
    readonly multilingualChapterFrozen: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export type StaExamFormatQuestionV2 = StaExamFormatQuestion | StaExamFormatFiveQuestion;

const FIVE_LIFECYCLE = {
  semanticQls: "FROZEN",
  englishCorpus: "FROZEN_V2",
  ql001HindiPunjabi: "FROZEN_V2",
  ql002HindiPunjabi: "FROZEN_V2",
  ql003HindiPunjabi: "FROZEN_V2",
  ql004HindiPunjabi: "REVIEW_CANDIDATE_V3",
  examFormatStatus: "REVIEW_CANDIDATE_V2",
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

function sameAnswerSet(a: StaAnswerSet, b: StaAnswerSet): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function allAnswerSets(count: 5): StaAnswerSet[] {
  const output: StaAnswerSet[] = [];
  for (let mask = 0; mask < (1 << count); mask += 1) {
    const set: number[] = [];
    for (let index = 0; index < count; index += 1) if ((mask & (1 << index)) !== 0) set.push(index);
    output.push(set);
  }
  return output;
}

function roman(index: number): StaExamCandidateLabelV2 {
  if (index === 0) return "I";
  if (index === 1) return "II";
  if (index === 2) return "III";
  if (index === 3) return "IV";
  if (index === 4) return "V";
  throw new Error(`Unsupported assumption label index ${index}`);
}

function joinLabels(locale: StaExamLocale, labels: readonly string[]): string {
  if (labels.length <= 1) return labels[0] ?? "";
  const conjunction = locale === "hi-IN" ? " और " : locale === "pa-IN" ? " ਅਤੇ " : " and ";
  if (labels.length === 2) return `${labels[0]}${conjunction}${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}${conjunction}${labels.at(-1)}`;
}

function displayAnswerSet(locale: StaExamLocale, answer: StaAnswerSet): string {
  const labels = answer.map(roman);
  const allLabels: readonly StaExamCandidateLabelV2[] = ["I", "II", "III", "IV", "V"];
  if (answer.length === 0) {
    const joined = joinLabels(locale, allLabels);
    if (locale === "hi-IN") return `${joined} में से कोई नहीं`;
    if (locale === "pa-IN") return `${joined} ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਨਹੀਂ`;
    return `None of ${joined}`;
  }
  if (answer.length === 5) {
    const joined = joinLabels(locale, allLabels);
    if (locale === "hi-IN") return `${joined} सभी`;
    if (locale === "pa-IN") return `${joined} ਸਾਰੀਆਂ`;
    return `All ${joined}`;
  }
  const joined = joinLabels(locale, labels);
  if (locale === "hi-IN") return `केवल ${joined}`;
  if (locale === "pa-IN") return `ਕੇਵਲ ${joined}`;
  return `Only ${joined}`;
}

function buildOptions(correct: StaAnswerSet, locale: StaExamLocale, seed: string): readonly StaExamFormatOption[] {
  const distractors = deterministicShuffle(
    allAnswerSets(5).filter((set) => !sameAnswerSet(set, correct)),
    `${seed}:bank5:option-distractors`,
  ).slice(0, 4);
  const options: StaExamFormatOption[] = [correct, ...distractors].map((set) => ({
    kind: "ANSWER_SET" as const,
    display: displayAnswerSet(locale, set),
    semanticAnswerSet: [...set],
    isCorrect: sameAnswerSet(set, correct),
  }));
  return deterministicShuffle(options, `${seed}:bank5:option-order`);
}

function instruction(locale: StaExamLocale): string {
  if (locale === "hi-IN") return "कथन और दी गई पूर्वधारणाओं पर विचार करें और बताएं कि कौन-सी पूर्वधारणाएँ कथन में निहित हैं।";
  if (locale === "pa-IN") return "ਕਥਨ ਅਤੇ ਦਿੱਤੀਆਂ ਧਾਰਨਾਵਾਂ ਨੂੰ ਵੇਖੋ ਅਤੇ ਦੱਸੋ ਕਿ ਕਿਹੜੀਆਂ ਧਾਰਨਾਵਾਂ ਕਥਨ ਵਿੱਚ ਨਿਹਿਤ ਹਨ।";
  return "Consider the statement and decide which of the given assumptions are implicit.";
}

function fifthText(locale: StaExamLocale, scenarioId: string, seed: string): string {
  const overlay = getStaBankFifthAssumptionOverlay(scenarioId);
  if (!overlay) throw new Error(`${scenarioId}: BANK_5X5 fifth-assumption overlay missing`);
  const variants = locale === "en-IN" ? overlay.candidate.textVariants : overlay.localized[locale].textVariants;
  return choose(variants, `${seed}:${scenarioId}:FMT-C5:text`);
}

function fifthRationale(locale: StaExamLocale, scenarioId: string): string {
  const overlay = getStaBankFifthAssumptionOverlay(scenarioId);
  if (!overlay) throw new Error(`${scenarioId}: BANK_5X5 fifth-assumption overlay missing`);
  return locale === "en-IN" ? overlay.candidate.rationale : overlay.localized[locale].rationale;
}

function fifthOracle(scenarioId: string): StaOracleResult {
  const scenario = STA_ENGLISH_CORPUS_V2.find((item) => item.scenarioId === scenarioId);
  const overlay = getStaBankFifthAssumptionOverlay(scenarioId);
  if (!scenario || !overlay) throw new Error(`${scenarioId}: missing BANK_5X5 source scenario/overlay`);
  const dependency: StaDependency | undefined = overlay.expectedClassification === "IMPLICIT"
    ? {
      dependencyId: `${scenarioId}-FMT-D5`,
      propositionId: overlay.proposition.propositionId,
      relation: overlay.dependencyRelation ?? "RELEVANCE",
      requiredFor: [...scenario.objectiveIds],
      denialEffect: overlay.denialEffect ?? "BREAKS_RATIONALE",
    }
    : undefined;
  const oracleScenario: StaScenarioAuthority = {
    ...scenario,
    propositions: [...scenario.propositions, overlay.proposition],
    hiddenDependencies: dependency ? [...scenario.hiddenDependencies, dependency] : scenario.hiddenDependencies,
  };
  const result = evaluateAssumptionOracle(oracleScenario, overlay.candidate);
  if (result.classification !== overlay.expectedClassification) {
    throw new Error(`${scenarioId}: fifth-assumption oracle=${result.classification}, expected=${overlay.expectedClassification}`);
  }
  if (result.evidenceCode === "MISSING_SEMANTIC_NEGATION") throw new Error(`${scenarioId}: fifth assumption lacks semantic negation`);
  return result;
}

function buildExplanation(base: StaExamFormatQuestion, fifth: StaExamFormatFiveRenderedCandidate, locale: StaExamLocale, answerSet: StaAnswerSet): string {
  const parts = base.explanation.split("\n\n");
  if (parts.length > 0) parts.pop();
  const rationale = fifthRationale(locale, base.scenarioId);
  if (locale === "hi-IN") {
    parts.push(`पूर्वधारणा V ${fifth.oracle.classification === "IMPLICIT" ? "निहित है" : "निहित नहीं है"}: ${rationale}`);
    parts.push(`इस प्रश्न में सही विकल्प है: ${displayAnswerSet(locale, answerSet)}।`);
  } else if (locale === "pa-IN") {
    parts.push(`ਧਾਰਨਾ V ${fifth.oracle.classification === "IMPLICIT" ? "ਨਿਹਿਤ ਹੈ" : "ਨਿਹਿਤ ਨਹੀਂ ਹੈ"}: ${rationale}`);
    parts.push(`ਇਸ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਸਹੀ ਵਿਕਲਪ ਹੈ: ${displayAnswerSet(locale, answerSet)}।`);
  } else {
    parts.push(`Assumption V is ${fifth.oracle.classification === "IMPLICIT" ? "implicit" : "not implicit"}: ${rationale}`);
    parts.push(`Therefore, the correct choice is: ${displayAnswerSet(locale, answerSet)}.`);
  }
  return parts.join("\n\n");
}

export function getStaBank5x5EligibleScenarioCount(): number {
  return STA_ENGLISH_CORPUS_V2.filter((scenario) => scenario.sourceProfile === "BANKING" && Boolean(getStaBankFifthAssumptionOverlay(scenario.scenarioId))).length;
}

export function generateStaBank5x5Question(seed: string, locale: StaExamLocale): StaExamFormatFiveQuestion {
  const base = generateStaExamFormatQuestion(seed, locale, "BANK_4X5");
  const overlay = getStaBankFifthAssumptionOverlay(base.scenarioId);
  if (!overlay) throw new Error(`${base.scenarioId}: BANK_4X5 selected a scenario without BANK_5X5 overlay`);
  const oracle = fifthOracle(base.scenarioId);
  const fifth: StaExamFormatFiveRenderedCandidate = {
    label: "V",
    candidateId: overlay.candidate.candidateId,
    text: fifthText(locale, base.scenarioId, seed),
    oracle,
  };
  const candidates: readonly StaExamFormatFiveRenderedCandidate[] = [
    ...base.candidates.map((candidate, index) => ({ ...candidate, label: roman(index) })),
    fifth,
  ];
  const implicitAnswerSet = [...base.implicitAnswerSet, ...(oracle.classification === "IMPLICIT" ? [4] : [])].sort((a, b) => a - b);
  const answerSet = [...implicitAnswerSet];
  const options = buildOptions(answerSet, locale, seed);
  const answerIndex = options.findIndex((option) => option.isCorrect);
  if (answerIndex < 0 || answerIndex > 4) throw new Error(`${seed}: BANK_5X5 correct option missing`);

  const question: StaExamFormatFiveQuestion = {
    questionId: `STA-FMT5-${hash32(`${seed}:BANK_5X5:${base.scenarioId}`).toString(16).padStart(8, "0")}`,
    packageId: "STA-001",
    chapterId: "REAS-STA",
    qlId: base.qlId,
    scenarioId: base.scenarioId,
    seed,
    locale,
    sourceProfile: "BANKING",
    difficulty: base.difficulty,
    presentationProfile: "BANK_5X5",
    candidateCount: 5,
    optionCount: 5,
    queryPolarity: "IMPLICIT",
    instruction: instruction(locale),
    statement: base.statement,
    candidates,
    implicitAnswerSet,
    answerSet,
    options,
    answerIndex,
    explanation: buildExplanation(base, fifth, locale, answerSet),
    oracleParity: true,
    lifecycle: FIVE_LIFECYCLE,
  };
  assertStaBank5x5Integrity(question);
  return question;
}

export function generateStaExamFormatQuestionV2(seed: string, locale: StaExamLocale, profileId: StaExamProfileIdV2): StaExamFormatQuestionV2 {
  return profileId === "BANK_5X5" ? generateStaBank5x5Question(seed, locale) : generateStaExamFormatQuestion(seed, locale, profileId);
}

export function assertStaBank5x5Integrity(question: StaExamFormatFiveQuestion): void {
  if (question.candidates.length !== 5 || question.candidateCount !== 5) throw new Error(`${question.questionId}: expected five assumptions`);
  if (question.options.length !== 5 || question.optionCount !== 5) throw new Error(`${question.questionId}: expected five options`);
  if (question.candidates.some((candidate, index) => candidate.label !== roman(index))) throw new Error(`${question.questionId}: I-V label order mismatch`);
  if (question.candidates.at(-1)?.candidateId !== "FMT-C5") throw new Error(`${question.questionId}: fifth overlay identity missing`);
  if (question.options.filter((option) => option.isCorrect).length !== 1 || !question.options[question.answerIndex]?.isCorrect) {
    throw new Error(`${question.questionId}: unique correct option missing`);
  }
  const correct = question.options[question.answerIndex]!;
  if (correct.kind !== "ANSWER_SET" || !sameAnswerSet(correct.semanticAnswerSet, question.answerSet)) throw new Error(`${question.questionId}: answer-set mismatch`);
  const displays = new Set(question.options.map((option) => option.display));
  if (displays.size !== 5) throw new Error(`${question.questionId}: duplicate visible options`);
  const semanticKeys = question.options.flatMap((option) => option.kind === "ANSWER_SET" ? [option.semanticAnswerSet.join(",")] : []);
  if (new Set(semanticKeys).size !== semanticKeys.length) throw new Error(`${question.questionId}: duplicate semantic options`);
  if (question.candidates.some((candidate) => candidate.oracle.evidenceCode === "MISSING_SEMANTIC_NEGATION")) throw new Error(`${question.questionId}: semantic negation missing`);
  if (/STA-|BREAKS_|REQUIRED_HIDDEN_DEPENDENCY|NO_REQUIRED_DEPENDENCY/.test(question.explanation)) throw new Error(`${question.questionId}: internal authority leaked into explanation`);
  if (question.explanation.includes(question.statement)) throw new Error(`${question.questionId}: explanation repeats full stem`);
  if (question.lifecycle.questionStudioDiscoverable || question.lifecycle.questionBankWritable || question.lifecycle.testEligible || question.lifecycle.publiclyPublishable) {
    throw new Error(`${question.questionId}: downstream lock opened`);
  }
}
