import {
  WFM_REARRANGEMENT_FIXTURES,
  WFM_SELECTED_LETTER_FIXTURES,
  rearrangementFixtureDifficulty,
  selectedFixtureDifficulty,
  selectedFixtureLetters,
  type WfmRearrangementFixture,
  type WfmSelectedLetterFixture,
} from "./authorities";
import {
  WFM_CANDIDATE_WORDS,
  WFM_EXAM_COMMON_WORD_SET,
  WFM_SOURCE_WORDS,
  analyseCandidate,
  normalizeWfmWord,
} from "./lexicon";
import type {
  WfmDifficulty,
  WfmExamProfile,
  WfmGeneratedQuestion,
  WfmLanguage,
  WfmOption,
  WfmQlId,
  WfmTask,
} from "./types";

const OPTION_IDS = ["A", "B", "C", "D"] as const;
const DIFFICULTIES: readonly WfmDifficulty[] = ["EASY", "MEDIUM", "HARD"];

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function rngFor(seed: number): () => number {
  let state = (seed >>> 0) ^ 0x9e3779b9;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(values: readonly T[], seed: number): T[] {
  const out = [...values];
  const rng = rngFor(seed);
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function takeDistinct(values: readonly string[], count: number, seed: number): string[] {
  const picked = shuffled(Array.from(new Set(values)), seed).slice(0, count);
  if (picked.length !== count) throw new Error(`WFM needed ${count} distinct values but found ${picked.length}.`);
  return picked;
}

function lifecycleMetadata() {
  return {
    runtimeVersion: "WFM-001-RUNTIME-V2-REVIEW" as const,
    optionCount: 4 as const,
    sourceEvidenceStatus: "SOURCE_BACKED_SSC_WORD_FORMATION" as const,
    lifecycle: "REVIEW_ONLY" as const,
    questionStudioVisible: false as const,
    questionBankStored: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    difficultyBasis: "GENERATED_INSTANCE" as const,
    ownershipDecision: "PROPOSED_REAS_WFM" as const,
  };
}

function validateProfile(profile: WfmExamProfile): void {
  if (profile !== "SSC_CGL_4" && profile !== "PUNJAB_4") {
    throw new Error(`WFM-001 does not support exam profile: ${String(profile)}`);
  }
}

function targetDifficulty(seed: number, requested?: WfmDifficulty): WfmDifficulty {
  return requested ?? DIFFICULTIES[mod(seed * 7 + 5, DIFFICULTIES.length)];
}

function optionize(entries: readonly { text: string; provenance: WfmOption["provenance"] }[], seed: number): readonly WfmOption[] {
  const ordered = shuffled(entries, seed ^ 0x5f3759df);
  return ordered.map((entry, index) => ({ id: OPTION_IDS[index], ...entry }));
}

function correctId(options: readonly WfmOption[], predicate: (option: WfmOption) => boolean): WfmOption["id"] {
  const matches = options.filter(predicate);
  if (matches.length !== 1) throw new Error(`WFM expected exactly one correct option; found ${matches.length}.`);
  return matches[0].id;
}

function letterCounts(word: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const letter of normalizeWfmWord(word)) out[letter] = (out[letter] ?? 0) + 1;
  return out;
}

function countSummary(word: string): string {
  return Object.entries(letterCounts(word))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, count]) => `${letter}×${count}`)
    .join(", ");
}

function deficitSummary(language: WfmLanguage, sourceWord: string, candidateWord: string): string {
  const analysis = analyseCandidate(sourceWord, candidateWord);
  return Object.entries(analysis.deficits)
    .map(([letter, values]) => {
      if (language === "hi-IN") return `${letter}×${values.needed} चाहिए, उपलब्ध ${letter}×${values.available}`;
      if (language === "pa-IN") return `${letter}×${values.needed} ਦੀ ਲੋੜ ਹੈ, ਮੌਜੂਦ ${letter}×${values.available}`;
      return `${letter}×${values.needed} needed, ${letter}×${values.available} available`;
    })
    .join("; ");
}

// ---------------------------------------------------------------------------
// CP001 — full-source can/cannot form
// ---------------------------------------------------------------------------

interface DirectBuckets {
  valid: string[];
  multiplicityNear: string[];
  absentNear: string[];
  absentEasy: string[];
  absentAny: string[];
}

function directBuckets(sourceWord: string): DirectBuckets {
  const buckets: DirectBuckets = { valid: [], multiplicityNear: [], absentNear: [], absentEasy: [], absentAny: [] };
  for (const candidate of WFM_CANDIDATE_WORDS) {
    if (candidate === sourceWord || candidate.length < 4 || candidate.length > 8) continue;
    const analysis = analyseCandidate(sourceWord, candidate);
    if (analysis.canForm) {
      buckets.valid.push(candidate);
      continue;
    }
    if (analysis.deficitKind === "MULTIPLICITY" && analysis.totalDeficit === 1) buckets.multiplicityNear.push(candidate);
    if (analysis.deficitKind === "ABSENT_LETTER") {
      buckets.absentAny.push(candidate);
      if (analysis.totalDeficit === 1) buckets.absentNear.push(candidate);
      else buckets.absentEasy.push(candidate);
    }
  }
  return buckets;
}

function nearLength(values: readonly string[], length: number): string[] {
  const near = values.filter((word) => Math.abs(word.length - length) <= 1);
  return near.length >= 3 ? near : [...values];
}

function supportsDirect(b: DirectBuckets, task: WfmTask, difficulty: WfmDifficulty): boolean {
  if (b.valid.length < 4) return false;
  if (task === "CAN_FORM") {
    if (difficulty === "EASY") return b.absentEasy.length >= 3;
    if (difficulty === "MEDIUM") return b.multiplicityNear.length >= 1 && b.absentNear.length + b.absentEasy.length >= 2;
    return b.multiplicityNear.length >= 2 && b.absentNear.length + b.absentEasy.length >= 1;
  }
  if (difficulty === "EASY") return b.absentEasy.length >= 1;
  if (difficulty === "MEDIUM") return b.absentNear.length >= 1;
  return b.multiplicityNear.length >= 1;
}

function chooseDirectSource(seed: number, task: WfmTask, difficulty: WfmDifficulty): { sourceWord: string; buckets: DirectBuckets } {
  const start = mod(seed * 17 + (task === "CAN_FORM" ? 11 : 37), WFM_SOURCE_WORDS.length);
  for (let offset = 0; offset < WFM_SOURCE_WORDS.length; offset += 1) {
    const sourceWord = WFM_SOURCE_WORDS[(start + offset) % WFM_SOURCE_WORDS.length];
    const buckets = directBuckets(sourceWord);
    if (supportsDirect(buckets, task, difficulty)) return { sourceWord, buckets };
  }
  throw new Error(`WFM could not find a direct source for ${task}/${difficulty}.`);
}

function directProvenance(sourceWord: string, word: string): WfmOption["provenance"] {
  const analysis = analyseCandidate(sourceWord, word);
  if (analysis.canForm) return "VALID_LETTER_MULTISET";
  return analysis.deficitKind === "MULTIPLICITY"
    ? "IGNORED_REPEATED_LETTER_LIMIT"
    : "IGNORED_MISSING_LETTER";
}

function buildDirectEntries(sourceWord: string, buckets: DirectBuckets, task: WfmTask, difficulty: WfmDifficulty, seed: number) {
  if (task === "CAN_FORM") {
    const correct = takeDistinct(buckets.valid, 1, seed + 101)[0];
    const absent = nearLength(difficulty === "EASY" ? buckets.absentEasy : [...buckets.absentNear, ...buckets.absentEasy], correct.length);
    const multiplicity = nearLength(buckets.multiplicityNear, correct.length);
    const wrongs = difficulty === "EASY"
      ? takeDistinct(absent, 3, seed + 211)
      : difficulty === "MEDIUM"
        ? [...takeDistinct(multiplicity, 1, seed + 307), ...takeDistinct(absent, 2, seed + 401)]
        : [...takeDistinct(multiplicity, 2, seed + 503), ...takeDistinct(absent, 1, seed + 601)];
    return [
      { text: correct, provenance: "VALID_LETTER_MULTISET" as const },
      ...wrongs.map((word) => ({ text: word, provenance: directProvenance(sourceWord, word) })),
    ];
  }

  const invalidPool = difficulty === "HARD"
    ? buckets.multiplicityNear
    : difficulty === "MEDIUM"
      ? buckets.absentNear
      : buckets.absentEasy;
  const correctInvalid = takeDistinct(invalidPool, 1, seed + 809)[0];
  const valids = nearLength(buckets.valid, correctInvalid.length);
  return [
    { text: correctInvalid, provenance: directProvenance(sourceWord, correctInvalid) },
    ...takeDistinct(valids, 3, seed + 701).map((word) => ({ text: word, provenance: "VALID_LETTER_MULTISET" as const })),
  ];
}

function directStem(language: WfmLanguage, task: WfmTask, sourceWord: string): string {
  if (language === "hi-IN") return task === "CAN_FORM"
    ? `शब्द ‘${sourceWord}’ के अक्षरों से निम्नलिखित में से कौन-सा शब्द बनाया जा सकता है?`
    : `शब्द ‘${sourceWord}’ के अक्षरों से निम्नलिखित में से कौन-सा शब्द नहीं बनाया जा सकता है?`;
  if (language === "pa-IN") return task === "CAN_FORM"
    ? `ਸ਼ਬਦ ‘${sourceWord}’ ਦੇ ਅੱਖਰਾਂ ਨਾਲ ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਬਦ ਬਣਾਇਆ ਜਾ ਸਕਦਾ ਹੈ?`
    : `ਸ਼ਬਦ ‘${sourceWord}’ ਦੇ ਅੱਖਰਾਂ ਨਾਲ ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਬਦ ਨਹੀਂ ਬਣਾਇਆ ਜਾ ਸਕਦਾ?`;
  return task === "CAN_FORM"
    ? `Which of the following words can be formed using the letters of ‘${sourceWord}’?`
    : `Which of the following words cannot be formed using the letters of ‘${sourceWord}’?`;
}

function directExplanation(language: WfmLanguage, task: WfmTask, sourceWord: string, options: readonly WfmOption[], answerId: WfmOption["id"]): string {
  const answer = options.find((option) => option.id === answerId)!.text;
  const trap = options.find((option) => option.id !== answerId && option.provenance === "IGNORED_REPEATED_LETTER_LIMIT");
  if (language === "hi-IN") {
    if (task === "CAN_FORM") {
      return `किसी अक्षर को मूल शब्द में उपलब्ध संख्या से अधिक बार नहीं ले सकते। ${answer} के लिए ${countSummary(answer)} चाहिए और ये सभी अक्षर ${sourceWord} में पर्याप्त हैं।${trap ? ` ${trap.text} में ${deficitSummary(language, sourceWord, trap.text)}।` : ""} इसलिए सही उत्तर ${answer} है।`;
    }
    return `${answer} नहीं बन सकता क्योंकि ${deficitSummary(language, sourceWord, answer)}। इसलिए सही उत्तर ${answer} है।`;
  }
  if (language === "pa-IN") {
    if (task === "CAN_FORM") {
      return `ਕਿਸੇ ਅੱਖਰ ਨੂੰ ਮੂਲ ਸ਼ਬਦ ਵਿੱਚ ਮੌਜੂਦ ਗਿਣਤੀ ਤੋਂ ਵੱਧ ਵਾਰ ਨਹੀਂ ਲਿਆ ਜਾ ਸਕਦਾ। ${answer} ਲਈ ${countSummary(answer)} ਦੀ ਲੋੜ ਹੈ ਅਤੇ ਇਹ ਸਾਰੇ ਅੱਖਰ ${sourceWord} ਵਿੱਚ ਕਾਫ਼ੀ ਹਨ।${trap ? ` ${trap.text} ਵਿੱਚ ${deficitSummary(language, sourceWord, trap.text)}।` : ""} ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
    }
    return `${answer} ਨਹੀਂ ਬਣ ਸਕਦਾ ਕਿਉਂਕਿ ${deficitSummary(language, sourceWord, answer)}। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
  }
  if (task === "CAN_FORM") {
    return `A letter cannot be used more times than it appears in the source word. ${answer} needs ${countSummary(answer)}, all available in ${sourceWord}.${trap ? ` The close trap ${trap.text} fails because ${deficitSummary(language, sourceWord, trap.text)}.` : ""} Therefore, ${answer} can be formed.`;
  }
  return `${answer} cannot be formed because ${deficitSummary(language, sourceWord, answer)}. Therefore, ${answer} is the correct answer.`;
}

function generateDirect(input: BaseInput, qlId: "WFM-QL-001" | "WFM-QL-002"): WfmGeneratedQuestion {
  const task: WfmTask = qlId === "WFM-QL-001" ? "CAN_FORM" : "CANNOT_FORM";
  const difficulty = targetDifficulty(input.seed, input.difficulty);
  const { sourceWord, buckets } = chooseDirectSource(input.seed, task, difficulty);
  const options = optionize(buildDirectEntries(sourceWord, buckets, task, difficulty, input.seed), input.seed);
  const answerId = correctId(options, (option) => task === "CAN_FORM"
    ? analyseCandidate(sourceWord, option.text).canForm
    : !analyseCandidate(sourceWord, option.text).canForm);
  return {
    chapterId: "WFM-001",
    checkpointId: "WFM-CP-001",
    qlId,
    task,
    renderer: "FULL_SOURCE_WORD",
    seed: input.seed,
    language: input.language,
    examProfile: input.examProfile,
    difficulty,
    stem: directStem(input.language, task, sourceWord),
    sourceWord,
    structuredPrompt: { sourceWord },
    options,
    correctOptionId: answerId,
    explanation: directExplanation(input.language, task, sourceWord, options, answerId),
    metadata: lifecycleMetadata(),
  };
}

// ---------------------------------------------------------------------------
// CP002 — selected-position letters -> count meaningful words
// ---------------------------------------------------------------------------

function chooseSelectedFixture(seed: number, difficulty: WfmDifficulty): WfmSelectedLetterFixture {
  const candidates = WFM_SELECTED_LETTER_FIXTURES.filter((fixture) => selectedFixtureDifficulty(fixture) === difficulty);
  if (candidates.length === 0) throw new Error(`No selected-letter WFM fixture for ${difficulty}.`);
  return candidates[mod(seed * 13 + 3, candidates.length)];
}

function ordinalList(language: WfmLanguage, positions: readonly number[]): string {
  if (language === "hi-IN") return positions.map((n) => `${n}वें`).join(", ");
  if (language === "pa-IN") return positions.map((n) => `${n}ਵੇਂ`).join(", ");
  const suffix = (n: number) => n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th";
  return positions.map((n) => `${n}${suffix(n)}`).join(", ");
}

function selectedStem(language: WfmLanguage, fixture: WfmSelectedLetterFixture): string {
  const positions = ordinalList(language, fixture.positions);
  if (language === "hi-IN") return `शब्द ‘${fixture.sourceWord}’ के ${positions} अक्षरों को लेकर, प्रत्येक अक्षर का केवल एक बार प्रयोग करते हुए, कितने अर्थपूर्ण अंग्रेज़ी शब्द बनाए जा सकते हैं?`;
  if (language === "pa-IN") return `ਸ਼ਬਦ ‘${fixture.sourceWord}’ ਦੇ ${positions} ਅੱਖਰ ਲੈ ਕੇ, ਹਰ ਅੱਖਰ ਨੂੰ ਸਿਰਫ਼ ਇੱਕ ਵਾਰ ਵਰਤਦਿਆਂ, ਕਿੰਨੇ ਅਰਥਪੂਰਨ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ ਬਣਾਏ ਜਾ ਸਕਦੇ ਹਨ?`;
  return `Using the ${positions} letters of ‘${fixture.sourceWord}’, how many meaningful English words can be formed if each selected letter is used exactly once?`;
}

function selectedExplanation(language: WfmLanguage, fixture: WfmSelectedLetterFixture): string {
  const letters = selectedFixtureLetters(fixture);
  const words = fixture.acceptedWords;
  if (language === "hi-IN") return words.length === 0
    ? `चुने गए अक्षर ${letters.split("").join(", ")} हैं। इन सभी अक्षरों का एक-एक बार प्रयोग करके कोई सामान्य अर्थपूर्ण अंग्रेज़ी शब्द नहीं बनता। इसलिए उत्तर 0 है।`
    : `चुने गए अक्षर ${letters.split("").join(", ")} हैं। इनसे ${words.join(", ")} बनते हैं। कुल ${words.length} अर्थपूर्ण शब्द बनते हैं, इसलिए उत्तर ${words.length} है।`;
  if (language === "pa-IN") return words.length === 0
    ? `ਚੁਣੇ ਅੱਖਰ ${letters.split("").join(", ")} ਹਨ। ਇਨ੍ਹਾਂ ਸਾਰੇ ਅੱਖਰਾਂ ਨੂੰ ਇੱਕ-ਇੱਕ ਵਾਰ ਵਰਤ ਕੇ ਕੋਈ ਆਮ ਅਰਥਪੂਰਨ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ ਨਹੀਂ ਬਣਦਾ। ਇਸ ਲਈ ਉੱਤਰ 0 ਹੈ।`
    : `ਚੁਣੇ ਅੱਖਰ ${letters.split("").join(", ")} ਹਨ। ਇਨ੍ਹਾਂ ਨਾਲ ${words.join(", ")} ਬਣਦੇ ਹਨ। ਕੁੱਲ ${words.length} ਅਰਥਪੂਰਨ ਸ਼ਬਦ ਬਣਦੇ ਹਨ, ਇਸ ਲਈ ਉੱਤਰ ${words.length} ਹੈ।`;
  return words.length === 0
    ? `The selected letters are ${letters.split("").join(", ")}. No common meaningful English word uses all of them exactly once, so the answer is 0.`
    : `The selected letters are ${letters.split("").join(", ")}. They form ${words.join(", ")}. Hence ${words.length} meaningful word${words.length === 1 ? "" : "s"} can be formed.`;
}

function generateSelectedCount(input: BaseInput): WfmGeneratedQuestion {
  const difficulty = targetDifficulty(input.seed, input.difficulty);
  const fixture = chooseSelectedFixture(input.seed, difficulty);
  const count = fixture.acceptedWords.length;
  const numberOptions = shuffled([0, 1, 2, 3], input.seed ^ 0x11223344);
  const options: readonly WfmOption[] = numberOptions.map((value, index) => ({
    id: OPTION_IDS[index],
    text: String(value),
    provenance: value === count ? "CORRECT_WORD_COUNT" : "COUNT_NEAR_MISS",
  }));
  return {
    chapterId: "WFM-001",
    checkpointId: "WFM-CP-002",
    qlId: "WFM-QL-003",
    task: "COUNT_SELECTED_LETTER_WORDS",
    renderer: "SELECTED_POSITION_COUNT",
    seed: input.seed,
    language: input.language,
    examProfile: input.examProfile,
    difficulty: selectedFixtureDifficulty(fixture),
    stem: selectedStem(input.language, fixture),
    sourceWord: fixture.sourceWord,
    structuredPrompt: {
      sourceWord: fixture.sourceWord,
      positions: fixture.positions,
      selectedLetters: selectedFixtureLetters(fixture),
      acceptedCommonWords: fixture.acceptedWords,
    },
    options,
    correctOptionId: correctId(options, (option) => option.text === String(count)),
    explanation: selectedExplanation(input.language, fixture),
    metadata: lifecycleMetadata(),
  };
}

// ---------------------------------------------------------------------------
// CP003 — jumbled word / numbered arrangement, same semantic QL
// ---------------------------------------------------------------------------

function chooseRearrangementFixture(seed: number, difficulty: WfmDifficulty): WfmRearrangementFixture {
  const candidates = WFM_REARRANGEMENT_FIXTURES.filter((fixture) => rearrangementFixtureDifficulty(fixture) === difficulty);
  if (candidates.length === 0) throw new Error(`No rearrangement WFM fixture for ${difficulty}.`);
  return candidates[mod(seed * 19 + 7, candidates.length)];
}

function shuffledWord(word: string, seed: number): string {
  const letters = shuffled([...normalizeWfmWord(word)], seed ^ 0x31415926);
  const candidate = letters.join("");
  return candidate === normalizeWfmWord(word) ? [...candidate.slice(1), candidate[0]].join("") : candidate;
}

function signature(word: string): string {
  return [...normalizeWfmWord(word)].sort().join("");
}

function numberedCorrectSequence(scrambled: string, target: string): number[] {
  return [...normalizeWfmWord(target)].map((letter) => {
    const index = scrambled.indexOf(letter);
    if (index < 0) throw new Error(`WFM numbered sequence lost target letter ${letter}.`);
    return index + 1;
  });
}

function sequenceWord(scrambled: string, sequence: readonly number[]): string {
  return sequence.map((index) => scrambled[index - 1] ?? "").join("");
}

function numberedDistractors(scrambled: string, correct: readonly number[]): number[][] {
  const variants: number[][] = [];
  const add = (candidate: number[]) => {
    if (candidate.join(",") === correct.join(",")) return;
    if (variants.some((entry) => entry.join(",") === candidate.join(","))) return;
    if (WFM_EXAM_COMMON_WORD_SET.has(sequenceWord(scrambled, candidate))) return;
    variants.push(candidate);
  };
  for (let i = 0; i < correct.length - 1; i += 1) {
    const swapped = [...correct];
    [swapped[i], swapped[i + 1]] = [swapped[i + 1], swapped[i]];
    add(swapped);
  }
  add([...correct].reverse());
  add([...correct.slice(1), correct[0]]);
  add([correct[correct.length - 1], ...correct.slice(0, -1)]);
  if (variants.length < 3) throw new Error(`WFM could not build three safe numbered distractors for ${scrambled}.`);
  return variants.slice(0, 3);
}

function rearrangementStem(language: WfmLanguage, fixture: WfmRearrangementFixture, scrambled: string): string {
  if (fixture.mode === "JUMBLED_WORD") {
    if (language === "hi-IN") return `अक्षरों ‘${scrambled}’ को सही क्रम में लगाने पर एक अर्थपूर्ण अंग्रेज़ी शब्द बनता है। वह शब्द कौन-सा है?`;
    if (language === "pa-IN") return `ਅੱਖਰਾਂ ‘${scrambled}’ ਨੂੰ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਣ ਨਾਲ ਇੱਕ ਅਰਥਪੂਰਨ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ ਬਣਦਾ ਹੈ। ਉਹ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`;
    return `The letters ‘${scrambled}’ can be rearranged to form one meaningful English word. Which word is it?`;
  }
  const display = [...scrambled].map((letter, index) => `${index + 1}-${letter}`).join("  ");
  if (language === "hi-IN") return `अक्षर इस प्रकार क्रमांकित हैं: ${display}. सही अर्थपूर्ण अंग्रेज़ी शब्द बनाने वाला क्रम चुनिए।`;
  if (language === "pa-IN") return `ਅੱਖਰ ਇਸ ਤਰ੍ਹਾਂ ਨੰਬਰ ਕੀਤੇ ਹਨ: ${display}. ਸਹੀ ਅਰਥਪੂਰਨ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ ਬਣਾਉਣ ਵਾਲਾ ਕ੍ਰਮ ਚੁਣੋ।`;
  return `The letters are numbered as follows: ${display}. Choose the number sequence that forms the meaningful English word.`;
}

function rearrangementExplanation(language: WfmLanguage, fixture: WfmRearrangementFixture, scrambled: string, answerText: string): string {
  if (fixture.mode === "JUMBLED_WORD") {
    if (language === "hi-IN") return `${scrambled} और ${fixture.targetWord} में वही अक्षर उतनी ही बार हैं। अक्षरों को सही क्रम में रखने पर ${fixture.targetWord} बनता है। इसलिए सही उत्तर ${fixture.targetWord} है।`;
    if (language === "pa-IN") return `${scrambled} ਅਤੇ ${fixture.targetWord} ਵਿੱਚ ਉਹੀ ਅੱਖਰ ਉਨ੍ਹਾਂ ਹੀ ਵਾਰ ਹਨ। ਅੱਖਰਾਂ ਨੂੰ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਣ ਨਾਲ ${fixture.targetWord} ਬਣਦਾ ਹੈ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${fixture.targetWord} ਹੈ।`;
    return `${scrambled} and ${fixture.targetWord} contain the same letters with the same counts. Rearranging them gives ${fixture.targetWord}, so that is the correct answer.`;
  }
  if (language === "hi-IN") return `क्रम ${answerText} के अनुसार अक्षर पढ़ने पर ${fixture.targetWord} बनता है। इसलिए यही सही क्रम है।`;
  if (language === "pa-IN") return `ਕ੍ਰਮ ${answerText} ਅਨੁਸਾਰ ਅੱਖਰ ਪੜ੍ਹਨ ਨਾਲ ${fixture.targetWord} ਬਣਦਾ ਹੈ। ਇਸ ਲਈ ਇਹੀ ਸਹੀ ਕ੍ਰਮ ਹੈ।`;
  return `Reading the letters in the order ${answerText} gives ${fixture.targetWord}. Therefore, that is the correct sequence.`;
}

function generateRearrangement(input: BaseInput): WfmGeneratedQuestion {
  const requested = targetDifficulty(input.seed, input.difficulty);
  const fixture = chooseRearrangementFixture(input.seed, requested);
  const scrambled = shuffledWord(fixture.targetWord, input.seed);
  let options: readonly WfmOption[];

  if (fixture.mode === "JUMBLED_WORD") {
    const entries = [
      { text: fixture.targetWord, provenance: "EXACT_REARRANGEMENT" as const },
      ...(fixture.distractorWords ?? []).map((word) => ({ text: word, provenance: "NEAR_REARRANGEMENT" as const })),
    ];
    options = optionize(entries, input.seed);
    if (options.filter((option) => signature(option.text) === signature(scrambled)).length !== 1) {
      throw new Error(`WFM jumbled fixture is ambiguous: ${fixture.targetWord}.`);
    }
  } else {
    const correctSequence = numberedCorrectSequence(scrambled, fixture.targetWord);
    const entries = [
      { text: correctSequence.join(", "), provenance: "EXACT_REARRANGEMENT" as const },
      ...numberedDistractors(scrambled, correctSequence).map((sequence) => ({ text: sequence.join(", "), provenance: "WRONG_INDEX_ORDER" as const })),
    ];
    options = optionize(entries, input.seed);
  }

  const answerId = correctId(options, (option) => option.provenance === "EXACT_REARRANGEMENT");
  const answerText = options.find((option) => option.id === answerId)!.text;
  return {
    chapterId: "WFM-001",
    checkpointId: "WFM-CP-003",
    qlId: "WFM-QL-004",
    task: "REARRANGE_TO_MEANINGFUL_WORD",
    renderer: fixture.mode,
    seed: input.seed,
    language: input.language,
    examProfile: input.examProfile,
    difficulty: rearrangementFixtureDifficulty(fixture),
    stem: rearrangementStem(input.language, fixture, scrambled),
    structuredPrompt: {
      mode: fixture.mode,
      scrambled,
      targetWord: fixture.targetWord,
    },
    options,
    correctOptionId: answerId,
    explanation: rearrangementExplanation(input.language, fixture, scrambled, answerText),
    metadata: lifecycleMetadata(),
  };
}

interface BaseInput {
  readonly seed: number;
  readonly language: WfmLanguage;
  readonly examProfile: WfmExamProfile;
  readonly difficulty?: WfmDifficulty;
}

export function generateWfm001Question(input: {
  readonly qlId: WfmQlId;
  readonly seed: number;
  readonly language?: WfmLanguage;
  readonly examProfile?: WfmExamProfile;
  readonly difficulty?: WfmDifficulty;
}): WfmGeneratedQuestion {
  const base: BaseInput = {
    seed: input.seed,
    language: input.language ?? "en-IN",
    examProfile: input.examProfile ?? "SSC_CGL_4",
    difficulty: input.difficulty,
  };
  validateProfile(base.examProfile);
  if (input.qlId === "WFM-QL-001" || input.qlId === "WFM-QL-002") return generateDirect(base, input.qlId);
  if (input.qlId === "WFM-QL-003") return generateSelectedCount(base);
  if (input.qlId === "WFM-QL-004") return generateRearrangement(base);
  throw new Error(`Unknown WFM-001 QL: ${String(input.qlId)}`);
}

export const WFM_001_QL_IDS: readonly WfmQlId[] = ["WFM-QL-001", "WFM-QL-002", "WFM-QL-003", "WFM-QL-004"];
export const WFM_001_CHECKPOINT_IDS = ["WFM-CP-001", "WFM-CP-002", "WFM-CP-003"] as const;
