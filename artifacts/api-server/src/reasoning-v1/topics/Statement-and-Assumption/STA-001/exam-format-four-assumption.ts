import { STA_ENGLISH_CORPUS_BY_QL } from "./english-corpus/index.ts";
import { generateStaQuestionFromPool, type StaScenarioPoolByQl } from "./generator.ts";
import {
  generateStaQl004LocalizedQuestionV3,
  type StaQl004LocalizedQuestionV3,
} from "./localization-ql004-exam-realness-v3.ts";
import type { StaLocalizedLocale } from "./localization-types.ts";
import type {
  StaAnswerSet,
  StaOracleResult,
  StaQuestion,
} from "./types.ts";

export const STA_BANK_FOUR_ASSUMPTION_FORMAT_VERSION = "BANK_FOUR_ASSUMPTION_V1" as const;
export type StaExamLocale = "en-IN" | StaLocalizedLocale;
export type StaFourAssumptionLabel = "I" | "II" | "III" | "IV";

export interface StaFourAssumptionCandidate {
  readonly label: StaFourAssumptionLabel;
  readonly candidateId: string;
  readonly text: string;
  readonly oracle: StaOracleResult;
}

export interface StaFiveOption {
  readonly display: string;
  readonly semanticAnswerSet: StaAnswerSet;
  readonly isCorrect: boolean;
}

export interface StaFourAssumptionBankQuestion {
  readonly questionId: string;
  readonly packageId: "STA-001";
  readonly chapterId: "REAS-STA";
  readonly checkpointId: StaQuestion["checkpointId"];
  readonly qlId: "STA-QL-004";
  readonly proposedQlId: "STA-QL-004";
  readonly scenarioId: string;
  readonly seed: string;
  readonly locale: StaExamLocale;
  readonly difficulty: StaQuestion["difficulty"];
  readonly sourceProfile: "BANKING";
  readonly statement: string;
  readonly candidates: readonly [
    StaFourAssumptionCandidate,
    StaFourAssumptionCandidate,
    StaFourAssumptionCandidate,
    StaFourAssumptionCandidate,
  ];
  readonly options: readonly [StaFiveOption, StaFiveOption, StaFiveOption, StaFiveOption, StaFiveOption];
  readonly answerIndex: 0 | 1 | 2 | 3 | 4;
  readonly answerSet: StaAnswerSet;
  readonly explanation: string;
  readonly oracleParity: true;
  readonly format: {
    readonly version: typeof STA_BANK_FOUR_ASSUMPTION_FORMAT_VERSION;
    readonly assumptionCount: 4;
    readonly optionCount: 5;
    readonly formatIsMetadataNotQlIdentity: true;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

function hash32(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function deterministicShuffle<T>(values: readonly T[], seed: string): T[] {
  const output = [...values];
  let state = hash32(seed) || 0x9e3779b9;
  const rng = (): number => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x1_0000_0000;
  };
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    const temp = output[index]!;
    output[index] = output[swapIndex]!;
    output[swapIndex] = temp;
  }
  return output;
}

function sameAnswerSet(a: StaAnswerSet, b: StaAnswerSet): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function allFourAnswerSets(): StaAnswerSet[] {
  const output: StaAnswerSet[] = [];
  for (let mask = 0; mask < 16; mask += 1) {
    const set: number[] = [];
    for (let index = 0; index < 4; index += 1) {
      if ((mask & (1 << index)) !== 0) set.push(index);
    }
    output.push(set);
  }
  return output;
}

function label(index: number): StaFourAssumptionLabel {
  if (index === 0) return "I";
  if (index === 1) return "II";
  if (index === 2) return "III";
  return "IV";
}

function joinedLabels(answer: StaAnswerSet, locale: StaExamLocale): string {
  const labels = answer.map(label);
  if (labels.length === 1) return labels[0]!;
  if (labels.length === 2) {
    const joiner = locale === "hi-IN" ? " और " : locale === "pa-IN" ? " ਅਤੇ " : " and ";
    return `${labels[0]}${joiner}${labels[1]}`;
  }
  const last = labels[labels.length - 1]!;
  const head = labels.slice(0, -1).join(", ");
  const joiner = locale === "hi-IN" ? " और " : locale === "pa-IN" ? " ਅਤੇ " : " and ";
  return `${head}${joiner}${last}`;
}

function displayFourAnswerSet(answer: StaAnswerSet, locale: StaExamLocale): string {
  if (locale === "hi-IN") {
    if (answer.length === 0) return "I, II, III और IV में से कोई नहीं";
    if (answer.length === 4) return "I, II, III और IV सभी";
    return `केवल ${joinedLabels(answer, locale)}`;
  }
  if (locale === "pa-IN") {
    if (answer.length === 0) return "I, II, III ਅਤੇ IV ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ";
    if (answer.length === 4) return "I, II, III ਅਤੇ IV ਸਾਰੇ";
    return `ਕੇਵਲ ${joinedLabels(answer, locale)}`;
  }
  if (answer.length === 0) return "None of I, II, III and IV";
  if (answer.length === 4) return "All I, II, III and IV";
  return `Only ${joinedLabels(answer, locale)}`;
}

function buildFiveOptions(correct: StaAnswerSet, locale: StaExamLocale, seed: string): readonly [
  StaFiveOption,
  StaFiveOption,
  StaFiveOption,
  StaFiveOption,
  StaFiveOption,
] {
  const distractors = deterministicShuffle(
    allFourAnswerSets().filter((set) => !sameAnswerSet(set, correct)),
    `${seed}:five-option-distractors`,
  ).slice(0, 4);
  const sets = deterministicShuffle<StaAnswerSet>([correct, ...distractors], `${seed}:five-option-order`);
  const options = sets.map((set) => ({
    display: displayFourAnswerSet(set, locale),
    semanticAnswerSet: [...set],
    isCorrect: sameAnswerSet(set, correct),
  }));
  if (options.length !== 5) throw new Error(`${seed}: expected five options`);
  return options as unknown as readonly [
    StaFiveOption,
    StaFiveOption,
    StaFiveOption,
    StaFiveOption,
    StaFiveOption,
  ];
}

function explicitClauseFromStatement(locale: StaExamLocale, statement: string): string {
  let clause = statement.trim();
  const markers =
    locale === "en-IN"
      ? [", so ", ";", "."]
      : locale === "hi-IN"
        ? [", इसलिए", ";", "।"]
        : [", ਇਸ ਲਈ", ";", "।"];
  for (const marker of markers) {
    const index = clause.indexOf(marker);
    if (index > 0) {
      clause = clause.slice(0, index).trim();
      break;
    }
  }
  if (locale === "en-IN" && clause.startsWith("Because ")) clause = clause.slice("Because ".length);
  if (locale === "hi-IN" && clause.startsWith("क्योंकि ")) clause = clause.slice("क्योंकि ".length);
  if (locale === "pa-IN" && clause.startsWith("ਕਿਉਂਕਿ ")) clause = clause.slice("ਕਿਉਂਕਿ ".length);
  const terminal = locale === "en-IN" ? "." : "।";
  return clause.endsWith(terminal) ? clause : `${clause}${terminal}`;
}

type BaseQuestion = StaQuestion | StaQl004LocalizedQuestionV3;

function generateBase(seed: string, locale: StaExamLocale): BaseQuestion {
  if (locale === "en-IN") {
    return generateStaQuestionFromPool(
      seed,
      "STA-QL-004",
      STA_ENGLISH_CORPUS_BY_QL as unknown as StaScenarioPoolByQl,
    );
  }
  return generateStaQl004LocalizedQuestionV3(seed, locale);
}

function findEligibleBankBase(seed: string, locale: StaExamLocale): BaseQuestion {
  for (let attempt = 0; attempt < 2048; attempt += 1) {
    const resolvedSeed = `${seed}:bank-four:${attempt}`;
    const question = generateBase(resolvedSeed, locale);
    if (question.sourceProfile === "BANKING" && question.candidates.length === 3) return question;
  }
  throw new Error(`${seed}:${locale}: unable to find deterministic three-candidate banking QL004 authority`);
}

function explanationWithoutOldChoice(value: string): string[] {
  const paragraphs = value.split("\n\n");
  if (paragraphs.length > 0) paragraphs.pop();
  return paragraphs;
}

export function generateStaFourAssumptionBankQuestion(
  seed: string,
  locale: StaExamLocale,
): StaFourAssumptionBankQuestion {
  const base = findEligibleBankBase(seed, locale);
  const sourceScenario = STA_ENGLISH_CORPUS_BY_QL["STA-QL-004"].find(
    (scenario) => scenario.scenarioId === base.scenarioId,
  );
  if (!sourceScenario) throw new Error(`${base.scenarioId}: missing frozen English authority`);
  const explicitPropositionId = sourceScenario.explicitPropositionIds[0];
  if (!explicitPropositionId) throw new Error(`${base.scenarioId}: explicit proposition missing`);

  const firstThree = base.candidates.map((candidate, index) => ({
    label: label(index),
    candidateId: candidate.candidateId,
    text: candidate.text,
    oracle: candidate.oracle,
  })) as unknown as readonly [
    StaFourAssumptionCandidate,
    StaFourAssumptionCandidate,
    StaFourAssumptionCandidate,
  ];

  const explicitCandidate: StaFourAssumptionCandidate = {
    label: "IV",
    candidateId: `${base.scenarioId}-FMT-EXPLICIT-P0`,
    text: explicitClauseFromStatement(locale, base.statement),
    oracle: {
      candidateId: `${base.scenarioId}-FMT-EXPLICIT-P0`,
      propositionId: explicitPropositionId,
      classification: "NOT_IMPLICIT",
      evidenceCode: "EXPLICIT_RESTATEMENT",
    },
  };

  const candidates = [...firstThree, explicitCandidate] as unknown as StaFourAssumptionBankQuestion["candidates"];
  const answerSet: StaAnswerSet = [...base.answerSet];
  const options = buildFiveOptions(answerSet, locale, seed);
  const rawAnswerIndex = options.findIndex((option) => option.isCorrect);
  if (rawAnswerIndex < 0 || rawAnswerIndex > 4) throw new Error(`${seed}: correct five-option answer missing`);

  const lines = explanationWithoutOldChoice(base.explanation);
  if (locale === "hi-IN") {
    lines.push("पूर्वधारणा IV निहित नहीं है: यह कथन में पहले से दी गई जानकारी को दोहराती है; कोई छिपी हुई मान्यता नहीं जोड़ती।");
    lines.push(`इसलिए सही विकल्प है: ${displayFourAnswerSet(answerSet, locale)}।`);
  } else if (locale === "pa-IN") {
    lines.push("ਧਾਰਨਾ IV ਨਿਹਿਤ ਨਹੀਂ ਹੈ: ਇਹ ਕਥਨ ਵਿੱਚ ਪਹਿਲਾਂ ਹੀ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਨੂੰ ਦੁਹਰਾਉਂਦੀ ਹੈ; ਕੋਈ ਲੁਕੀ ਹੋਈ ਧਾਰਨਾ ਨਹੀਂ ਜੋੜਦੀ।");
    lines.push(`ਇਸ ਲਈ ਸਹੀ ਵਿਕਲਪ ਹੈ: ${displayFourAnswerSet(answerSet, locale)}।`);
  } else {
    lines.push("Assumption IV is not implicit: it restates information already stated rather than adding a hidden premise.");
    lines.push(`Therefore, the correct choice is ${displayFourAnswerSet(answerSet, locale)}.`);
  }

  return {
    questionId: `${base.questionId}-F4`,
    packageId: "STA-001",
    chapterId: "REAS-STA",
    checkpointId: base.checkpointId,
    qlId: "STA-QL-004",
    proposedQlId: "STA-QL-004",
    scenarioId: base.scenarioId,
    seed,
    locale,
    difficulty: base.difficulty,
    sourceProfile: "BANKING",
    statement: base.statement,
    candidates,
    options,
    answerIndex: rawAnswerIndex as 0 | 1 | 2 | 3 | 4,
    answerSet,
    explanation: lines.join("\n\n"),
    oracleParity: true,
    format: {
      version: STA_BANK_FOUR_ASSUMPTION_FORMAT_VERSION,
      assumptionCount: 4,
      optionCount: 5,
      formatIsMetadataNotQlIdentity: true,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}
