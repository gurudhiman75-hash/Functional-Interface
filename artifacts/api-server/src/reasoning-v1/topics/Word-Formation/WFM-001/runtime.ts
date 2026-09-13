import { analyseCandidate, WFM_CANDIDATE_WORDS, WFM_SOURCE_WORDS } from "./lexicon";
import { solveWfmOptions } from "./solver";
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
  if (picked.length !== count) throw new Error(`WFM needed ${count} distinct words but found ${picked.length}.`);
  return picked;
}

function taskForQl(qlId: WfmQlId): WfmTask {
  return qlId === "WFM-QL-001" ? "CAN_FORM" : "CANNOT_FORM";
}

interface SourceBuckets {
  valid: string[];
  multiplicityNear: string[];
  absentNear: string[];
  absentEasy: string[];
  absentAny: string[];
}

function bucketsFor(sourceWord: string): SourceBuckets {
  const buckets: SourceBuckets = { valid: [], multiplicityNear: [], absentNear: [], absentEasy: [], absentAny: [] };
  for (const candidate of WFM_CANDIDATE_WORDS) {
    if (candidate === sourceWord) continue;
    const analysis = analyseCandidate(sourceWord, candidate);
    if (analysis.canForm) {
      buckets.valid.push(candidate);
      continue;
    }
    if (analysis.deficitKind === "MULTIPLICITY" && analysis.totalDeficit === 1) {
      buckets.multiplicityNear.push(candidate);
      continue;
    }
    if (analysis.deficitKind === "ABSENT_LETTER") {
      buckets.absentAny.push(candidate);
      if (analysis.totalDeficit === 1) buckets.absentNear.push(candidate);
      else buckets.absentEasy.push(candidate);
    }
  }
  return buckets;
}

function supports(source: SourceBuckets, task: WfmTask, difficulty: WfmDifficulty): boolean {
  if (source.valid.length < 3) return false;
  if (task === "CAN_FORM") {
    if (difficulty === "EASY") return source.valid.length >= 1 && source.absentAny.length >= 3;
    if (difficulty === "MEDIUM") return source.valid.length >= 1 && source.multiplicityNear.length >= 1 && source.absentAny.length >= 2;
    return source.valid.length >= 1 && source.multiplicityNear.length >= 2 && source.absentAny.length >= 1;
  }
  if (difficulty === "EASY") return source.absentEasy.length >= 1;
  if (difficulty === "MEDIUM") return source.absentNear.length >= 1;
  return source.multiplicityNear.length >= 1;
}

function chooseSource(seed: number, task: WfmTask, targetDifficulty: WfmDifficulty): { sourceWord: string; buckets: SourceBuckets } {
  const start = mod(seed * 17 + (task === "CAN_FORM" ? 11 : 37), WFM_SOURCE_WORDS.length);
  for (let offset = 0; offset < WFM_SOURCE_WORDS.length; offset += 1) {
    const sourceWord = WFM_SOURCE_WORDS[(start + offset) % WFM_SOURCE_WORDS.length];
    const buckets = bucketsFor(sourceWord);
    if (supports(buckets, task, targetDifficulty)) return { sourceWord, buckets };
  }
  throw new Error(`WFM could not find a source for ${task}/${targetDifficulty}.`);
}

function provenanceForWrong(sourceWord: string, word: string): WfmOption["provenance"] {
  const analysis = analyseCandidate(sourceWord, word);
  return analysis.deficitKind === "MULTIPLICITY"
    ? "IGNORED_REPEATED_LETTER_LIMIT"
    : "IGNORED_MISSING_LETTER";
}

function buildUnshuffledOptions(
  sourceWord: string,
  buckets: SourceBuckets,
  task: WfmTask,
  targetDifficulty: WfmDifficulty,
  seed: number,
): Array<{ text: string; provenance: WfmOption["provenance"] }> {
  if (task === "CAN_FORM") {
    const correct = takeDistinct(buckets.valid, 1, seed + 101)[0];
    let wrongs: string[];
    if (targetDifficulty === "EASY") {
      wrongs = takeDistinct(buckets.absentAny, 3, seed + 211);
    } else if (targetDifficulty === "MEDIUM") {
      wrongs = [
        ...takeDistinct(buckets.multiplicityNear, 1, seed + 307),
        ...takeDistinct(buckets.absentAny, 2, seed + 401),
      ];
    } else {
      wrongs = [
        ...takeDistinct(buckets.multiplicityNear, 2, seed + 503),
        ...takeDistinct(buckets.absentAny, 1, seed + 601),
      ];
    }
    if (new Set([correct, ...wrongs]).size !== 4) {
      throw new Error("WFM option construction produced a duplicate word.");
    }
    return [
      { text: correct, provenance: "VALID_LETTER_MULTISET" },
      ...wrongs.map((word) => ({ text: word, provenance: provenanceForWrong(sourceWord, word) })),
    ];
  }

  const wrongValid = takeDistinct(buckets.valid, 3, seed + 701);
  const invalidPool = targetDifficulty === "HARD"
    ? buckets.multiplicityNear
    : targetDifficulty === "MEDIUM"
      ? buckets.absentNear
      : buckets.absentEasy;
  const correctInvalid = takeDistinct(invalidPool, 1, seed + 809)[0];
  return [
    { text: correctInvalid, provenance: provenanceForWrong(sourceWord, correctInvalid) },
    ...wrongValid.map((word) => ({ text: word, provenance: "VALID_LETTER_MULTISET" as const })),
  ];
}

function classifyDifficulty(sourceWord: string, task: WfmTask, optionWords: readonly string[], correctIndex: number): WfmDifficulty {
  if (task === "CAN_FORM") {
    const multiplicityTraps = optionWords.filter((word, index) => index !== correctIndex && analyseCandidate(sourceWord, word).deficitKind === "MULTIPLICITY").length;
    if (multiplicityTraps >= 2) return "HARD";
    if (multiplicityTraps === 1) return "MEDIUM";
    return "EASY";
  }
  const correct = analyseCandidate(sourceWord, optionWords[correctIndex]);
  if (correct.deficitKind === "MULTIPLICITY") return "HARD";
  if (correct.deficitKind === "ABSENT_LETTER" && correct.totalDeficit === 1) return "MEDIUM";
  return "EASY";
}

function renderStem(language: WfmLanguage, task: WfmTask, sourceWord: string): string {
  if (language === "hi-IN") {
    return task === "CAN_FORM"
      ? `शब्द ‘${sourceWord}’ के अक्षरों का प्रयोग करके निम्नलिखित में से कौन-सा शब्द बनाया जा सकता है?`
      : `शब्द ‘${sourceWord}’ के अक्षरों का प्रयोग करके निम्नलिखित में से कौन-सा शब्द नहीं बनाया जा सकता है?`;
  }
  if (language === "pa-IN") {
    return task === "CAN_FORM"
      ? `ਸ਼ਬਦ ‘${sourceWord}’ ਦੇ ਅੱਖਰਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਬਦ ਬਣਾਇਆ ਜਾ ਸਕਦਾ ਹੈ?`
      : `ਸ਼ਬਦ ‘${sourceWord}’ ਦੇ ਅੱਖਰਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਬਦ ਨਹੀਂ ਬਣਾਇਆ ਜਾ ਸਕਦਾ?`;
  }
  return task === "CAN_FORM"
    ? `Which of the following words can be formed using the letters of the word ‘${sourceWord}’?`
    : `Which of the following words cannot be formed using the letters of the word ‘${sourceWord}’?`;
}

function letterCounts(word: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const letter of word.toUpperCase()) if (letter >= "A" && letter <= "Z") out[letter] = (out[letter] ?? 0) + 1;
  return out;
}

function countSummary(word: string): string {
  return Object.entries(letterCounts(word)).sort(([a], [b]) => a.localeCompare(b)).map(([letter, count]) => `${letter}×${count}`).join(", ");
}

function deficitSummary(sourceWord: string, candidateWord: string): string {
  const analysis = analyseCandidate(sourceWord, candidateWord);
  return Object.entries(analysis.deficits)
    .map(([letter, values]) => `${letter}×${values.needed} needed, ${letter}×${values.available} available`)
    .join("; ");
}

function renderExplanation(
  language: WfmLanguage,
  task: WfmTask,
  sourceWord: string,
  optionWords: readonly string[],
  correctIndex: number,
): string {
  const answer = optionWords[correctIndex];
  const answerAnalysis = analyseCandidate(sourceWord, answer);
  const multiplicityTrap = optionWords.find((word, index) => index !== correctIndex && analyseCandidate(sourceWord, word).deficitKind === "MULTIPLICITY");

  if (language === "hi-IN") {
    if (task === "CAN_FORM") {
      const trap = multiplicityTrap ? ` ध्यान रखें: ${multiplicityTrap} में ${deficitSummary(sourceWord, multiplicityTrap)}।` : "";
      return `हर अक्षर को केवल उतनी बार ही इस्तेमाल किया जा सकता है जितनी बार वह मूल शब्द में है। ${answer} के लिए ${countSummary(answer)} चाहिए और ये सभी अक्षर ${sourceWord} में पर्याप्त संख्या में हैं। इसलिए सही उत्तर ${answer} है।${trap}`;
    }
    return `हर अक्षर की संख्या जाँचें। ${answer} नहीं बन सकता क्योंकि ${deficitSummary(sourceWord, answer)}। इसलिए सही उत्तर ${answer} है।`;
  }

  if (language === "pa-IN") {
    if (task === "CAN_FORM") {
      const trap = multiplicityTrap ? ` ਧਿਆਨ ਰੱਖੋ: ${multiplicityTrap} ਲਈ ${deficitSummary(sourceWord, multiplicityTrap)}।` : "";
      return `ਹਰ ਅੱਖਰ ਨੂੰ ਮੂਲ ਸ਼ਬਦ ਵਿੱਚ ਮੌਜੂਦ ਗਿਣਤੀ ਤੋਂ ਵੱਧ ਵਾਰ ਨਹੀਂ ਵਰਤਿਆ ਜਾ ਸਕਦਾ। ${answer} ਲਈ ${countSummary(answer)} ਚਾਹੀਦਾ ਹੈ ਅਤੇ ਇਹ ਸਾਰੇ ਅੱਖਰ ${sourceWord} ਵਿੱਚ ਕਾਫ਼ੀ ਗਿਣਤੀ ਵਿੱਚ ਹਨ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।${trap}`;
    }
    return `ਹਰ ਅੱਖਰ ਦੀ ਗਿਣਤੀ ਜਾਂਚੋ। ${answer} ਨਹੀਂ ਬਣ ਸਕਦਾ ਕਿਉਂਕਿ ${deficitSummary(sourceWord, answer)}। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
  }

  if (task === "CAN_FORM") {
    const trap = multiplicityTrap ? ` A common trap is ${multiplicityTrap}: ${deficitSummary(sourceWord, multiplicityTrap)}.` : "";
    return `Each letter can be used only as many times as it appears in the source word. ${answer} needs ${countSummary(answer)}, and ${sourceWord} contains all of those letters in sufficient counts. Therefore, ${answer} can be formed.${trap}`;
  }
  return `Check the number of times each letter is available. ${answer} cannot be formed because ${deficitSummary(sourceWord, answer)}. Therefore, ${answer} is the correct answer.`;
}

export function generateWfm001Question(input: {
  qlId: WfmQlId;
  seed: number;
  language?: WfmLanguage;
  examProfile?: WfmExamProfile;
}): WfmGeneratedQuestion {
  const language = input.language ?? "en-IN";
  const examProfile = input.examProfile ?? "SSC_CGL_4";
  if (examProfile !== "SSC_CGL_4" && examProfile !== "PUNJAB_4") {
    throw new Error(`WFM-001 does not support exam profile: ${String(examProfile)}`);
  }

  const task = taskForQl(input.qlId);
  const targetDifficulty = DIFFICULTIES[mod(input.seed, DIFFICULTIES.length)];
  const { sourceWord, buckets } = chooseSource(input.seed, task, targetDifficulty);
  const unshuffled = buildUnshuffledOptions(sourceWord, buckets, task, targetDifficulty, input.seed);
  const ordered = shuffled(unshuffled, input.seed ^ 0x5f3759df);
  const optionWords = ordered.map((entry) => entry.text);
  const correctIndex = solveWfmOptions(sourceWord, optionWords, task);
  const difficulty = classifyDifficulty(sourceWord, task, optionWords, correctIndex);
  if (difficulty !== targetDifficulty) {
    throw new Error(`WFM difficulty construction mismatch: target=${targetDifficulty}, actual=${difficulty}`);
  }

  const options: WfmOption[] = ordered.map((entry, index) => ({
    id: OPTION_IDS[index],
    text: entry.text,
    provenance: entry.provenance,
  }));

  return {
    chapterId: "WFM-001",
    checkpointId: "WFM-CP-001",
    qlId: input.qlId,
    task,
    seed: input.seed,
    language,
    examProfile,
    difficulty,
    stem: renderStem(language, task, sourceWord),
    sourceWord,
    options,
    correctOptionId: OPTION_IDS[correctIndex],
    explanation: renderExplanation(language, task, sourceWord, optionWords, correctIndex),
    metadata: {
      runtimeVersion: "WFM-001-RUNTIME-V1-REVIEW",
      optionCount: 4,
      sourceEvidenceStatus: "SOURCE_BACKED_CLASSIC_SSC_PATTERN",
      lifecycle: "REVIEW_ONLY",
      questionBankStored: false,
      testEligible: false,
      publiclyPublishable: false,
      difficultyBasis: "GENERATED_INSTANCE",
      ownershipDecision: "PROPOSED_REAS_WFM",
    },
  };
}

export const WFM_001_QL_IDS: readonly WfmQlId[] = ["WFM-QL-001", "WFM-QL-002"];
