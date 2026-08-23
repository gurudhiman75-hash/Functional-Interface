import type { StaAnswerSet } from "./types.ts";

export type StaExamLocale = "en-IN" | "hi-IN" | "pa-IN";
export type StaExamFormatProfile = "FOUR_OPTION_STANDARD" | "FIVE_OPTION_BANKING";

export interface StaExamFormatInput {
  readonly seed: string;
  readonly locale: StaExamLocale;
  readonly candidateCount: 2 | 3;
  readonly answerSet: StaAnswerSet;
}

export interface StaExamRenderedOption {
  readonly display: string;
  readonly semanticAnswerSet: StaAnswerSet;
  readonly isCorrect: boolean;
}

export interface StaExamFormatSurface {
  readonly profile: StaExamFormatProfile;
  readonly directions: string;
  readonly optionCount: 4 | 5;
  readonly options: readonly StaExamRenderedOption[];
  readonly answerIndex: number;
}

function hash32(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function rng(seed: string): () => number {
  let state = hash32(seed) || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x1_0000_0000;
  };
}

function shuffle<T>(values: readonly T[], seed: string): T[] {
  const out = [...values];
  const random = rng(seed);
  for (let index = out.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [out[index], out[swap]] = [out[swap]!, out[index]!];
  }
  return out;
}

function sameSet(a: StaAnswerSet, b: StaAnswerSet): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function allAnswerSets(candidateCount: 2 | 3): StaAnswerSet[] {
  const sets: StaAnswerSet[] = [];
  for (let mask = 0; mask < 1 << candidateCount; mask += 1) {
    const set: number[] = [];
    for (let index = 0; index < candidateCount; index += 1) if ((mask & (1 << index)) !== 0) set.push(index);
    sets.push(set);
  }
  return sets;
}

function roman(index: number): "I" | "II" | "III" {
  if (index === 0) return "I";
  if (index === 1) return "II";
  return "III";
}

function displayAnswerSet(locale: StaExamLocale, answer: StaAnswerSet, candidateCount: 2 | 3): string {
  const labels = answer.map(roman);
  if (locale === "hi-IN") {
    if (candidateCount === 2) {
      if (answer.length === 0) return "न तो I, न II";
      if (answer.length === 2) return "I और II दोनों";
      return `केवल ${labels[0]}`;
    }
    if (answer.length === 0) return "I, II और III में से कोई नहीं";
    if (answer.length === 3) return "I, II और III सभी";
    if (answer.length === 1) return `केवल ${labels[0]}`;
    return `केवल ${labels[0]} और ${labels[1]}`;
  }
  if (locale === "pa-IN") {
    if (candidateCount === 2) {
      if (answer.length === 0) return "ਨਾ I, ਨਾ II";
      if (answer.length === 2) return "I ਅਤੇ II ਦੋਵੇਂ";
      return `ਕੇਵਲ ${labels[0]}`;
    }
    if (answer.length === 0) return "I, II ਅਤੇ III ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ";
    if (answer.length === 3) return "I, II ਅਤੇ III ਸਾਰੇ";
    if (answer.length === 1) return `ਕੇਵਲ ${labels[0]}`;
    return `ਕੇਵਲ ${labels[0]} ਅਤੇ ${labels[1]}`;
  }
  if (candidateCount === 2) {
    if (answer.length === 0) return "Neither I nor II";
    if (answer.length === 2) return "Both I and II";
    return `Only ${labels[0]}`;
  }
  if (answer.length === 0) return "None of I, II and III";
  if (answer.length === 3) return "All I, II and III";
  if (answer.length === 1) return `Only ${labels[0]}`;
  return `Only ${labels[0]} and ${labels[1]}`;
}

function directions(locale: StaExamLocale, candidateCount: 2 | 3): string {
  const labels = candidateCount === 2 ? "I and II" : "I, II and III";
  if (locale === "hi-IN") {
    return candidateCount === 2
      ? "नीचे एक कथन और उसके बाद पूर्वधारणाएँ I और II दी गई हैं। कथन को ध्यान में रखते हुए तय कीजिए कि कौन-सी पूर्वधारणा निहित है।"
      : "नीचे एक कथन और उसके बाद पूर्वधारणाएँ I, II और III दी गई हैं। कथन को ध्यान में रखते हुए तय कीजिए कि कौन-सी पूर्वधारणाएँ निहित हैं।";
  }
  if (locale === "pa-IN") {
    return candidateCount === 2
      ? "ਹੇਠਾਂ ਇੱਕ ਕਥਨ ਅਤੇ ਉਸ ਤੋਂ ਬਾਅਦ ਧਾਰਨਾਵਾਂ I ਅਤੇ II ਦਿੱਤੀਆਂ ਹਨ। ਕਥਨ ਦੇ ਆਧਾਰ ਉੱਤੇ ਤੈਅ ਕਰੋ ਕਿ ਕਿਹੜੀ ਧਾਰਨਾ ਨਿਹਿਤ ਹੈ।"
      : "ਹੇਠਾਂ ਇੱਕ ਕਥਨ ਅਤੇ ਉਸ ਤੋਂ ਬਾਅਦ ਧਾਰਨਾਵਾਂ I, II ਅਤੇ III ਦਿੱਤੀਆਂ ਹਨ। ਕਥਨ ਦੇ ਆਧਾਰ ਉੱਤੇ ਤੈਅ ਕਰੋ ਕਿ ਕਿਹੜੀਆਂ ਧਾਰਨਾਵਾਂ ਨਿਹਿਤ ਹਨ।";
  }
  return `In the question below, a statement is followed by assumptions ${labels}. Consider the statement and decide which assumption${candidateCount === 2 ? "" : "s"} is/are implicit.`;
}

export function renderStaExamFormat(input: StaExamFormatInput, requested: StaExamFormatProfile): StaExamFormatSurface {
  // A 5-option exact-answer-set format needs at least five distinct semantic answer sets.
  // With two assumptions only four exact answer sets exist, so the renderer safely uses
  // the standard four-option form instead of inventing an ambiguous "either" option.
  const profile: StaExamFormatProfile = requested === "FIVE_OPTION_BANKING" && input.candidateCount === 3
    ? "FIVE_OPTION_BANKING"
    : "FOUR_OPTION_STANDARD";
  const optionCount: 4 | 5 = profile === "FIVE_OPTION_BANKING" ? 5 : 4;
  const distractors = shuffle(
    allAnswerSets(input.candidateCount).filter((set) => !sameSet(set, input.answerSet)),
    `${input.seed}:${profile}:distractors`,
  ).slice(0, optionCount - 1);
  const sets = shuffle<StaAnswerSet>([input.answerSet, ...distractors], `${input.seed}:${profile}:order`);
  const options = sets.map((set) => ({
    display: displayAnswerSet(input.locale, set, input.candidateCount),
    semanticAnswerSet: [...set],
    isCorrect: sameSet(set, input.answerSet),
  }));
  const answerIndex = options.findIndex((option) => option.isCorrect);
  if (answerIndex < 0 || options.length !== optionCount) throw new Error(`${input.seed}: invalid exam-format surface`);
  if (new Set(options.map((option) => option.display)).size !== options.length) throw new Error(`${input.seed}: duplicate visible exam options`);
  return {
    profile,
    directions: directions(input.locale, input.candidateCount),
    optionCount,
    options,
    answerIndex,
  };
}
