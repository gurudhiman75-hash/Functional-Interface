import { assertUnique, canonicalSetKey, uniqueSorted } from "./canonical-set";
import type {
  AbstractSentenceCodeQuery,
  SentenceCodeRelationStatus,
  SentenceCodeSolutionSpace,
} from "./types";

function requireWord(space: SentenceCodeSolutionSpace, wordId: string): void {
  if (!space.activeWords.includes(wordId)) throw new Error(`Unknown active word '${wordId}'`);
}

function requireToken(space: SentenceCodeSolutionSpace, token: string): void {
  if (!space.activeTokens.includes(token)) throw new Error(`Unknown active code token '${token}'`);
}

function classifyCandidate(candidates: readonly string[], candidate: string): SentenceCodeRelationStatus {
  if (!candidates.includes(candidate)) return "IMPOSSIBLE";
  return candidates.length === 1 ? "DEFINITE" : "POSSIBLE";
}

export function classifyWordTokenRelation(
  space: SentenceCodeSolutionSpace,
  wordId: string,
  token: string,
): SentenceCodeRelationStatus {
  requireWord(space, wordId);
  requireToken(space, token);
  return classifyCandidate(space.candidateTokensByWord[wordId]!, token);
}

export function classifyTokenWordRelation(
  space: SentenceCodeSolutionSpace,
  token: string,
  wordId: string,
): SentenceCodeRelationStatus {
  requireToken(space, token);
  requireWord(space, wordId);
  return classifyCandidate(space.candidateWordsByToken[token]!, wordId);
}

export function possibleTokenSetsForWords(
  space: SentenceCodeSolutionSpace,
  wordIds: readonly string[],
): readonly (readonly string[])[] {
  assertUnique(wordIds, "Word-set query");
  const words = uniqueSorted(wordIds);
  if (words.length === 0) throw new Error("Word-set query must contain at least one word");
  words.forEach((wordId) => requireWord(space, wordId));

  const byKey = new Map<string, readonly string[]>();
  for (const solution of space.solutions) {
    const tokens = uniqueSorted(words.map((wordId) => solution.wordToToken[wordId]!));
    byKey.set(canonicalSetKey(tokens), tokens);
  }
  return [...byKey.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([, values]) => values);
}

export function possibleWordSetsForTokens(
  space: SentenceCodeSolutionSpace,
  tokens: readonly string[],
): readonly (readonly string[])[] {
  assertUnique(tokens, "Token-set query");
  const canonicalTokens = uniqueSorted(tokens);
  if (canonicalTokens.length === 0) throw new Error("Token-set query must contain at least one token");
  canonicalTokens.forEach((token) => requireToken(space, token));

  const byKey = new Map<string, readonly string[]>();
  for (const solution of space.solutions) {
    const words = uniqueSorted(
      space.activeWords.filter((wordId) => canonicalTokens.includes(solution.wordToToken[wordId]!)),
    );
    byKey.set(canonicalSetKey(words), words);
  }
  return [...byKey.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([, values]) => values);
}

function classifySetRelation(
  possibleSets: readonly (readonly string[])[],
  candidate: readonly string[],
): SentenceCodeRelationStatus {
  const candidateKey = canonicalSetKey(candidate);
  const possibleKeys = possibleSets.map((values) => canonicalSetKey(values));
  if (!possibleKeys.includes(candidateKey)) return "IMPOSSIBLE";
  return possibleKeys.length === 1 ? "DEFINITE" : "POSSIBLE";
}

export function classifyWordsToTokenSetRelation(
  space: SentenceCodeSolutionSpace,
  wordIds: readonly string[],
  candidateTokens: readonly string[],
): SentenceCodeRelationStatus {
  assertUnique(candidateTokens, "Candidate token set");
  candidateTokens.forEach((token) => requireToken(space, token));
  return classifySetRelation(possibleTokenSetsForWords(space, wordIds), candidateTokens);
}

export function classifyTokenSetToWordsRelation(
  space: SentenceCodeSolutionSpace,
  tokens: readonly string[],
  candidateWords: readonly string[],
): SentenceCodeRelationStatus {
  assertUnique(candidateWords, "Candidate word set");
  candidateWords.forEach((wordId) => requireWord(space, wordId));
  return classifySetRelation(possibleWordSetsForTokens(space, tokens), candidateWords);
}

export function possibleMissingTokens(
  space: SentenceCodeSolutionSpace,
  wordIds: readonly string[],
  knownTokens: readonly string[],
): readonly string[] {
  assertUnique(wordIds, "Missing-token words");
  assertUnique(knownTokens, "Known tokens");
  const words = uniqueSorted(wordIds);
  const known = uniqueSorted(knownTokens);
  if (words.length !== known.length + 1) throw new Error("Missing-token query must omit exactly one token");
  words.forEach((wordId) => requireWord(space, wordId));
  known.forEach((token) => requireToken(space, token));

  const candidates = new Set<string>();
  for (const solution of space.solutions) {
    const fullSet = new Set(words.map((wordId) => solution.wordToToken[wordId]!));
    if (known.every((token) => fullSet.has(token))) {
      for (const token of fullSet) if (!known.includes(token)) candidates.add(token);
    }
  }
  return uniqueSorted([...candidates]);
}

export function possibleMissingWords(
  space: SentenceCodeSolutionSpace,
  tokens: readonly string[],
  knownWords: readonly string[],
): readonly string[] {
  assertUnique(tokens, "Missing-word tokens");
  assertUnique(knownWords, "Known words");
  const canonicalTokens = uniqueSorted(tokens);
  const known = uniqueSorted(knownWords);
  if (canonicalTokens.length !== known.length + 1) throw new Error("Missing-word query must omit exactly one word");
  canonicalTokens.forEach((token) => requireToken(space, token));
  known.forEach((wordId) => requireWord(space, wordId));

  const candidates = new Set<string>();
  for (const solution of space.solutions) {
    const fullWords = space.activeWords.filter((wordId) => canonicalTokens.includes(solution.wordToToken[wordId]!));
    if (known.every((wordId) => fullWords.includes(wordId))) {
      for (const wordId of fullWords) if (!known.includes(wordId)) candidates.add(wordId);
    }
  }
  return uniqueSorted([...candidates]);
}

export function queryDomain(space: SentenceCodeSolutionSpace, query: AbstractSentenceCodeQuery): readonly string[] {
  if (query.kind === "WORD_TO_TOKEN") {
    requireWord(space, query.wordId);
    return [...space.candidateTokensByWord[query.wordId]!];
  }
  if (query.kind === "TOKEN_TO_WORD") {
    requireToken(space, query.token);
    return [...space.candidateWordsByToken[query.token]!];
  }
  if (query.kind === "WORDS_TO_TOKEN_SET") {
    return possibleTokenSetsForWords(space, query.wordIds).map((values) => canonicalSetKey(values));
  }
  return possibleWordSetsForTokens(space, query.tokens).map((values) => canonicalSetKey(values));
}
