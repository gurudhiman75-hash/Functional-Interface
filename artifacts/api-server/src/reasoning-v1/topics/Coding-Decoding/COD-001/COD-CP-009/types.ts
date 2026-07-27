export type SentenceCodeWordId = string;
export type SentenceCodeToken = string;

export interface AbstractSentenceCodeRow {
  rowId: string;
  wordIds: readonly SentenceCodeWordId[];
  codeTokens: readonly SentenceCodeToken[];
}

export interface AbstractSentenceCodePuzzle {
  rows: readonly AbstractSentenceCodeRow[];
}

export interface SentenceCodeSolution {
  wordToToken: Readonly<Record<SentenceCodeWordId, SentenceCodeToken>>;
}

export interface SentenceCodeInvariantPair {
  wordId: SentenceCodeWordId;
  token: SentenceCodeToken;
}

export interface SentenceCodeSolutionSpace {
  activeWords: readonly SentenceCodeWordId[];
  activeTokens: readonly SentenceCodeToken[];
  solutions: readonly SentenceCodeSolution[];
  solutionCount: number;
  candidateTokensByWord: Readonly<Record<SentenceCodeWordId, readonly SentenceCodeToken[]>>;
  candidateWordsByToken: Readonly<Record<SentenceCodeToken, readonly SentenceCodeWordId[]>>;
  invariantPairs: readonly SentenceCodeInvariantPair[];
  membershipSignatureByWord: Readonly<Record<SentenceCodeWordId, string>>;
  membershipSignatureByToken: Readonly<Record<SentenceCodeToken, string>>;
  enumerationNodes: number;
}

export type SentenceCodeRelationStatus = "DEFINITE" | "POSSIBLE" | "IMPOSSIBLE";

export type AbstractSentenceCodeQuery =
  | { kind: "WORD_TO_TOKEN"; wordId: SentenceCodeWordId }
  | { kind: "TOKEN_TO_WORD"; token: SentenceCodeToken }
  | { kind: "WORDS_TO_TOKEN_SET"; wordIds: readonly SentenceCodeWordId[] }
  | { kind: "TOKEN_SET_TO_WORDS"; tokens: readonly SentenceCodeToken[] };

export interface SentenceCodeRowContribution {
  rowId: string;
  contributes: boolean;
  baselineDomain: readonly string[];
  domainWithoutRow: readonly string[];
}

export interface SentenceCodeRowMinimalityReport {
  allRowsContribute: boolean;
  rows: readonly SentenceCodeRowContribution[];
}

export interface SentenceCodeSolverOptions {
  maxSolutions?: number;
}

export interface SentenceCodeVerifierOptions {
  maxAssignments?: number;
}
