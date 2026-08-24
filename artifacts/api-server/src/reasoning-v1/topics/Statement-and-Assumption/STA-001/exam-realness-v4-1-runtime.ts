import {
  STA_V41_SCENARIOS,
  STA_V41_SCENARIOS_BY_QL,
  STA_V4_CHECKPOINT_BY_QL,
  STA_V4_QL_IDS,
  STA_V4_SEMANTIC_AUTHORITY,
} from "./exam-realness-v4-1-authorities.ts";
import type {
  GenerateStaV4QuestionInput,
  StaV4Language,
  StaV4Locale,
  StaV4PresentationProfile,
  StaV4ProfileId,
  StaV4QlId,
  StaV4Question,
  StaV4RenderedOption,
} from "./exam-realness-v4-1-types.ts";

export type {
  GenerateStaV4QuestionInput,
  StaV4CheckpointId,
  StaV4Difficulty,
  StaV4Language,
  StaV4Locale,
  StaV4ProfileId,
  StaV4QlId,
  StaV4Question,
} from "./exam-realness-v4-1-types.ts";
export { STA_V4_CHECKPOINT_BY_QL, STA_V4_QL_IDS, STA_V4_SEMANTIC_AUTHORITY };

export const STA_V4_RUNTIME_VERSION = "EXAM_REALNESS_V4_1" as const;
export const STA_V4_LANGUAGES = Object.freeze(["en", "hi", "pa"] as const satisfies readonly StaV4Language[]);
export const STA_V4_DIFFICULTIES = Object.freeze(["Easy", "Medium", "Hard"] as const);

export const STA_V4_PRESENTATION_PROFILES: readonly StaV4PresentationProfile[] = Object.freeze([
  Object.freeze({ profileId: "SSC_2X4", candidateCount: 2, optionCount: 4, queryPolarity: "POSITIVE", evidenceClass: "DIRECT_PYQ_FORMAT", officialVerbatim: false, directPunjabPyqBacked: false }),
  Object.freeze({ profileId: "SSC_3X4", candidateCount: 3, optionCount: 4, queryPolarity: "POSITIVE", evidenceClass: "DIRECT_PYQ_FORMAT", officialVerbatim: false, directPunjabPyqBacked: false }),
  Object.freeze({ profileId: "BANK_2X5", candidateCount: 2, optionCount: 5, queryPolarity: "POSITIVE", evidenceClass: "LEGACY_OR_FAMILY_COMPATIBLE", officialVerbatim: false, directPunjabPyqBacked: false }),
  Object.freeze({ profileId: "BANK_3X5", candidateCount: 3, optionCount: 5, queryPolarity: "POSITIVE", evidenceClass: "DIRECT_MEMORY_BASED_PYQ", officialVerbatim: false, directPunjabPyqBacked: false }),
  Object.freeze({ profileId: "BANK_4X5", candidateCount: 4, optionCount: 5, queryPolarity: "POSITIVE", evidenceClass: "DIRECT_MEMORY_BASED_PYQ", officialVerbatim: false, directPunjabPyqBacked: false }),
  Object.freeze({ profileId: "BANK_3X5_NEGATIVE", candidateCount: 3, optionCount: 5, queryPolarity: "NEGATIVE", evidenceClass: "LEGACY_OR_FAMILY_COMPATIBLE", officialVerbatim: false, directPunjabPyqBacked: false }),
  Object.freeze({ profileId: "BANK_5X5", candidateCount: 5, optionCount: 5, queryPolarity: "POSITIVE", evidenceClass: "DIRECT_MEMORY_BASED_PYQ", officialVerbatim: false, directPunjabPyqBacked: false }),
  Object.freeze({ profileId: "PUNJAB_2X4", candidateCount: 2, optionCount: 4, queryPolarity: "POSITIVE", evidenceClass: "DIRECT_PYQ_FORMAT", officialVerbatim: false, directPunjabPyqBacked: true }),
  Object.freeze({ profileId: "PUNJAB_3X4", candidateCount: 3, optionCount: 4, queryPolarity: "POSITIVE", evidenceClass: "CROSS_EXAM_SYNTHESIS", officialVerbatim: false, directPunjabPyqBacked: false }),
]);

export const STA_V4_PROFILE_IDS = Object.freeze(STA_V4_PRESENTATION_PROFILES.map((entry) => entry.profileId)) as readonly StaV4ProfileId[];
export const STA_V4_SCENARIOS = STA_V41_SCENARIOS;
export const STA_V4_SCENARIOS_BY_QL = STA_V41_SCENARIOS_BY_QL;

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

function shuffled<T>(values: readonly T[], seed: string): T[] {
  const output = [...values];
  const rng = createRng(seed);
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    const tmp = output[index]!;
    output[index] = output[swapIndex]!;
    output[swapIndex] = tmp;
  }
  return output;
}

function choose<T>(values: readonly T[], seed: string): T {
  if (values.length === 0) throw new Error(`${seed}: cannot choose from an empty pool`);
  return values[hash32(seed) % values.length]!;
}

function languageForLocale(locale: StaV4Locale): StaV4Language {
  if (locale === "hi-IN") return "hi";
  if (locale === "pa-IN") return "pa";
  return "en";
}

function roman(index: number): string {
  return ["I", "II", "III", "IV", "V"][index] ?? String(index + 1);
}

function sameSet(left: readonly number[], right: readonly number[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function allSubsets(candidateCount: number): number[][] {
  const result: number[][] = [];
  for (let mask = 0; mask < (1 << candidateCount); mask += 1) {
    const set: number[] = [];
    for (let index = 0; index < candidateCount; index += 1) if ((mask & (1 << index)) !== 0) set.push(index);
    result.push(set);
  }
  return result;
}

function joinLabels(language: StaV4Language, labels: readonly string[]): string {
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0]!;
  const conjunction = language === "hi" ? " और " : language === "pa" ? " ਅਤੇ " : " and ";
  if (labels.length === 2) return `${labels[0]}${conjunction}${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}${conjunction}${labels.at(-1)}`;
}

function displaySet(set: readonly number[], candidateCount: number, language: StaV4Language): string {
  if (set.length === 1 && set[0] === -1) {
    if (language === "hi") return "या तो I या II";
    if (language === "pa") return "ਜਾਂ I ਜਾਂ II";
    return "Either I or II";
  }
  const labels = set.map(roman);
  const allLabels = Array.from({ length: candidateCount }, (_, index) => roman(index));
  if (set.length === 0) {
    if (candidateCount === 2) {
      if (language === "hi") return "न तो I न II";
      if (language === "pa") return "ਨਾ I ਨਾ II";
      return "Neither I nor II";
    }
    const joined = joinLabels(language, allLabels);
    if (language === "hi") return `${joined} में से कोई नहीं`;
    if (language === "pa") return `${joined} ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ`;
    return `None of ${joined}`;
  }
  if (set.length === candidateCount) {
    const joined = joinLabels(language, allLabels);
    if (candidateCount === 2) {
      if (language === "hi") return "I और II दोनों";
      if (language === "pa") return "I ਅਤੇ II ਦੋਵੇਂ";
      return "Both I and II";
    }
    if (language === "hi") return `${joined} सभी`;
    if (language === "pa") return `${joined} ਸਾਰੀਆਂ`;
    return `All ${joined}`;
  }
  const joined = joinLabels(language, labels);
  if (language === "hi") return `केवल ${joined}`;
  if (language === "pa") return `ਕੇਵਲ ${joined}`;
  return `Only ${joined}`;
}

function optionSemanticSets(
  correct: readonly number[],
  profile: StaV4PresentationProfile,
  seed: string,
): readonly number[][] {
  if (profile.profileId === "BANK_2X5") {
    const ordinary = allSubsets(2);
    return shuffled([...ordinary, [-1]], `${seed}:bank-2x5-option-order`);
  }
  const distractors = shuffled(
    allSubsets(profile.candidateCount).filter((set) => !sameSet(set, correct)),
    `${seed}:option-distractors`,
  ).slice(0, profile.optionCount - 1);
  return shuffled([...[correct], ...distractors], `${seed}:option-order`);
}

function instruction(language: StaV4Language, polarity: "POSITIVE" | "NEGATIVE"): string {
  if (polarity === "NEGATIVE") {
    if (language === "hi") return "निम्नलिखित पूर्वधारणाओं में से कौन-सी कथन में निहित नहीं है/हैं?";
    if (language === "pa") return "ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਧਾਰਨਾਵਾਂ ਵਿੱਚੋਂ ਕਿਹੜੀ/ਕਿਹੜੀਆਂ ਕਥਨ ਵਿੱਚ ਨਿਹਿਤ ਨਹੀਂ ਹੈ/ਹਨ?";
    return "Which of the following assumption(s) is/are NOT implicit in the statement?";
  }
  if (language === "hi") return "निम्नलिखित पूर्वधारणाओं में से कौन-सी कथन में निहित है/हैं?";
  if (language === "pa") return "ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਧਾਰਨਾਵਾਂ ਵਿੱਚੋਂ ਕਿਹੜੀ/ਕਿਹੜੀਆਂ ਕਥਨ ਵਿੱਚ ਨਿਹਿਤ ਹੈ/ਹਨ?";
  return "Which of the following assumption(s) is/are implicit in the statement?";
}

function explanationLead(language: StaV4Language, polarity: "POSITIVE" | "NEGATIVE"): string {
  if (language === "hi") return polarity === "NEGATIVE"
    ? "हर पूर्वधारणा को नकारकर देखें कि कौन-सी बात कथन के तर्क के लिए आवश्यक नहीं है।"
    : "हर पूर्वधारणा को नकारकर देखें कि कथन का तर्क किस बात पर वास्तव में निर्भर करता है।";
  if (language === "pa") return polarity === "NEGATIVE"
    ? "ਹਰੇਕ ਧਾਰਨਾ ਨੂੰ ਨਕਾਰ ਕੇ ਵੇਖੋ ਕਿ ਕਿਹੜੀ ਗੱਲ ਕਥਨ ਦੇ ਤਰਕ ਲਈ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।"
    : "ਹਰੇਕ ਧਾਰਨਾ ਨੂੰ ਨਕਾਰ ਕੇ ਵੇਖੋ ਕਿ ਕਥਨ ਦਾ ਤਰਕ ਕਿਹੜੀ ਗੱਲ ਉੱਤੇ ਅਸਲ ਵਿੱਚ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।";
  return polarity === "NEGATIVE"
    ? "Deny each assumption and identify which statement is not required by the argument."
    : "Deny each assumption and identify what the statement's logic actually depends on.";
}

function explanationLine(
  language: StaV4Language,
  label: string,
  classification: "IMPLICIT" | "NOT_IMPLICIT",
  rationale: string,
): string {
  if (language === "hi") return `पूर्वधारणा ${label} ${classification === "IMPLICIT" ? "निहित है" : "निहित नहीं है"}: ${rationale}`;
  if (language === "pa") return `ਧਾਰਨਾ ${label} ${classification === "IMPLICIT" ? "ਨਿਹਿਤ ਹੈ" : "ਨਿਹਿਤ ਨਹੀਂ ਹੈ"}: ${rationale}`;
  return `Assumption ${label} is ${classification === "IMPLICIT" ? "implicit" : "not implicit"}: ${rationale}`;
}

function explanationConclusion(language: StaV4Language, answer: string): string {
  if (language === "hi") return `अतः सही विकल्प है: ${answer}।`;
  if (language === "pa") return `ਇਸ ਲਈ ਸਹੀ ਵਿਕਲਪ ਹੈ: ${answer}।`;
  return `Therefore, the correct choice is ${answer}.`;
}

export function generateStaV4Question(input: GenerateStaV4QuestionInput): StaV4Question {
  const profile = STA_V4_PRESENTATION_PROFILES.find((entry) => entry.profileId === input.profileId);
  if (!profile) throw new Error(`Unsupported STA V4.1 profile ${input.profileId}`);
  const language = languageForLocale(input.locale);
  const qlId = input.qlId ?? choose(STA_V4_QL_IDS, `${input.seed}:ql`);
  const scenario = choose(STA_V41_SCENARIOS_BY_QL[qlId], `${input.seed}:${qlId}:scenario`);
  const semanticSeed = `${input.seed}:${profile.profileId}:${qlId}:${scenario.scenarioId}`;
  const statementIndex = hash32(`${semanticSeed}:statement`) % scenario.statementVariants.length;
  const selectedAuthorities = shuffled(scenario.candidates, `${semanticSeed}:candidate-selection`).slice(0, profile.candidateCount);
  const candidateVariantIndexes = selectedAuthorities.map((candidate) => hash32(`${semanticSeed}:${candidate.candidateId}:wording`) % candidate.textVariants.length);
  const candidates = selectedAuthorities.map((candidate, index) => ({
    label: roman(index),
    candidateId: candidate.candidateId,
    text: candidate.textVariants[candidateVariantIndexes[index]!]![language],
    classification: candidate.classification,
    misconception: candidate.misconception,
  }));
  const positiveSet = candidates.flatMap((candidate, index) => candidate.classification === "IMPLICIT" ? [index] : []);
  const negativeSet = candidates.flatMap((candidate, index) => candidate.classification === "NOT_IMPLICIT" ? [index] : []);
  const answerSet = profile.queryPolarity === "NEGATIVE" ? negativeSet : positiveSet;
  const semanticOptionSets = optionSemanticSets(answerSet, profile, semanticSeed);
  const options: readonly StaV4RenderedOption[] = semanticOptionSets.map((set) => Object.freeze({
    display: displaySet(set, profile.candidateCount, language),
    semanticAnswerSet: Object.freeze([...set]),
    isCorrect: sameSet(set, answerSet),
  }));
  const answerIndex = options.findIndex((option) => option.isCorrect);
  if (answerIndex < 0) throw new Error(`${semanticSeed}: correct option missing`);
  const canonicalItemId = `STA-001:${profile.profileId}:${scenario.scenarioId}:${hash32(semanticSeed).toString(16).padStart(8, "0")}`;
  const contentFingerprint = `sta-v4-1:${hash32(JSON.stringify({
    qlId,
    profileId: profile.profileId,
    scenarioId: scenario.scenarioId,
    statementIndex,
    candidateIds: selectedAuthorities.map((candidate) => candidate.candidateId),
    candidateVariantIndexes,
    answerSet,
    optionSemanticSets: semanticOptionSets,
  })).toString(16).padStart(8, "0")}`;
  const answerDisplay = options[answerIndex]!.display;
  const explanationParts = [explanationLead(language, profile.queryPolarity)];
  selectedAuthorities.forEach((candidate, index) => {
    explanationParts.push(explanationLine(language, roman(index), candidate.classification, candidate.rationale[language]));
  });
  explanationParts.push(explanationConclusion(language, answerDisplay));

  const question: StaV4Question = Object.freeze({
    packageId: "STA-001",
    chapterId: "REAS-STA",
    runtimeVersion: STA_V4_RUNTIME_VERSION,
    qlId,
    checkpointId: STA_V4_CHECKPOINT_BY_QL[qlId],
    presentationProfile: profile.profileId,
    questionId: `STA-V41-${hash32(semanticSeed).toString(16).padStart(8, "0")}`,
    canonicalItemId,
    questionLanguageId: `${canonicalItemId}:${language}`,
    contentFingerprint,
    language,
    locale: input.locale,
    difficulty: scenario.difficulty,
    sourceProfile: scenario.sourceProfile,
    evidenceClass: profile.evidenceClass,
    candidateCount: profile.candidateCount,
    optionCount: profile.optionCount,
    queryPolarity: profile.queryPolarity,
    instruction: instruction(language, profile.queryPolarity),
    statement: scenario.statementVariants[statementIndex]![language],
    candidates: Object.freeze(candidates),
    options: Object.freeze(options),
    answerIndex,
    answerSet: Object.freeze([...answerSet]),
    explanation: explanationParts.join("\n\n"),
    seed: input.seed,
    scenarioId: scenario.scenarioId,
    sourceAuthorityId: scenario.sourceAuthorityId,
  });
  assertStaV4QuestionIntegrity(question);
  return question;
}

export function assertStaV4QuestionIntegrity(question: StaV4Question): void {
  if (question.runtimeVersion !== STA_V4_RUNTIME_VERSION) throw new Error(`${question.questionId}: runtime version drift`);
  if (!STA_V4_QL_IDS.includes(question.qlId)) throw new Error(`${question.questionId}: invalid QL`);
  if (!STA_V4_PROFILE_IDS.includes(question.presentationProfile)) throw new Error(`${question.questionId}: invalid profile`);
  const profile = STA_V4_PRESENTATION_PROFILES.find((entry) => entry.profileId === question.presentationProfile)!;
  if (question.candidates.length !== profile.candidateCount) throw new Error(`${question.questionId}: candidate count mismatch`);
  if (new Set(question.candidates.map((candidate) => candidate.candidateId)).size !== question.candidates.length) throw new Error(`${question.questionId}: duplicate candidate identity`);
  if (question.options.length !== profile.optionCount) throw new Error(`${question.questionId}: option count mismatch`);
  if (new Set(question.options.map((option) => option.display)).size !== question.options.length) throw new Error(`${question.questionId}: duplicate option display`);
  if (question.options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${question.questionId}: expected exactly one correct option`);
  if (!question.options[question.answerIndex]?.isCorrect) throw new Error(`${question.questionId}: answer index mismatch`);
  if (!sameSet(question.options[question.answerIndex]!.semanticAnswerSet, question.answerSet)) throw new Error(`${question.questionId}: answer-set mismatch`);
  if (question.answerSet.includes(-1)) throw new Error(`${question.questionId}: legacy either-state must never become correct`);
  const expected = question.candidates.flatMap((candidate, index) => {
    const matches = profile.queryPolarity === "NEGATIVE"
      ? candidate.classification === "NOT_IMPLICIT"
      : candidate.classification === "IMPLICIT";
    return matches ? [index] : [];
  });
  if (!sameSet(question.answerSet, expected)) throw new Error(`${question.questionId}: oracle parity drift`);
  if (!question.statement.trim() || !question.instruction.trim() || !question.explanation.trim()) throw new Error(`${question.questionId}: incomplete learner surface`);
  if (question.explanation.includes(question.statement)) throw new Error(`${question.questionId}: explanation repeats full statement`);
}

export function staV4CueSignalCount(text: string, language: StaV4Language): number {
  if (language === "en") return (text.match(/\b(all|every|never|always|only|best|most|none|unable|impossible|can|may|some|at least|able)\b/giu) ?? []).length;
  if (language === "hi") return (text.match(/(सभी|हर|कभी नहीं|हमेशा|केवल|सबसे|कोई नहीं|असंभव|सक|कुछ|समर्थ)/gu) ?? []).length;
  return (text.match(/(ਸਾਰੇ|ਹਰ|ਕਦੇ ਨਹੀਂ|ਹਮੇਸ਼ਾ|ਕੇਵਲ|ਸਭ ਤੋਂ|ਕੋਈ ਨਹੀਂ|ਅਸੰਭਵ|ਸਕ|ਕੁਝ|ਸਮਰਥ)/gu) ?? []).length;
}
