
import type {
  NumCp004AnswerSemantic,
  NumCp004RetainedTemplateId,
} from "./types";

export const NUM_CP004_RETAINED_SOLVE_MODE_IDS = [
  "NUM-CP004-SM-CLASSIFY-PRIME-STATUS",
  "NUM-CP004-SM-ENUMERATE-PRIMES-IN-INTERVAL",
  "NUM-CP004-SM-COUNT-PRIMES-IN-INTERVAL",
  "NUM-CP004-SM-LOCATE-ADJACENT-OR-EXTREME-PRIME",
  "NUM-CP004-SM-SELECT-PRIME-UNDER-DIGIT-RANGE",
  "NUM-CP004-SM-VERIFY-PRIME-CLAIM",
  "NUM-CP004-SM-FACTORISE-INTEGER",
  "NUM-CP004-SM-PROJECT-PRIME-FACTOR-EXTREMUM",
  "NUM-CP004-SM-COUNT-DISTINCT-PRIME-FACTORS",
  "NUM-CP004-SM-COUNT-PRIME-FACTORS-WITH-MULTIPLICITY",
  "NUM-CP004-SM-RECONSTRUCT-INTEGER-FROM-PRIME-POWERS",
  "NUM-CP004-SM-COMPARE-PRIME-EXPONENT-STRUCTURES",
  "NUM-CP004-SM-COMPLETE-MISSING-PRIME",
  "NUM-CP004-SM-COMPLETE-MISSING-EXPONENT",
  "NUM-CP004-SM-SELECT-COPRIME-PAIR",
  "NUM-CP004-SM-ENUMERATE-COPRIME-CANDIDATES",
  "NUM-CP004-SM-COUNT-COPRIME-CANDIDATES",
  "NUM-CP004-SM-RECOVER-COPRIME-UNKNOWN",
  "NUM-CP004-SM-CLASSIFY-PAIRWISE-COLLECTIVE-COPRIMALITY",
  "NUM-CP004-SM-VERIFY-COPRIME-CLAIM",
  "NUM-CP004-SM-RECONSTRUCT-PRIME-PAIR",
  "NUM-CP004-SM-RECONSTRUCT-PRIME-TRIPLE",
  "NUM-CP004-SM-FIND-LEAST-PRIME-DIVISOR",
  "NUM-CP004-SM-FIND-PRIME-DIVISOR-OF-EXPRESSION",
  "NUM-CP004-SM-CLASSIFY-PRIME-STRUCTURE-FEASIBILITY",
  "NUM-CP004-SM-COMPLETE-FACTOR-TREE",
  "NUM-CP004-SM-RESOLVE-PRIME-DATA-SUFFICIENCY",
  "NUM-CP004-SM-MINIMISE-ADJUSTMENT-TO-PRIME",
] as const;

export type NumCp004RetainedSolveModeId =
  (typeof NUM_CP004_RETAINED_SOLVE_MODE_IDS)[number];

export type NumCp004TaskDirection =
  | "DIRECT"
  | "DIRECT_INVERSE"
  | "REVERSE_RECONSTRUCTION"
  | "MISSING_VARIABLE"
  | "LEAST_GREATEST_OPTIMISATION"
  | "COUNT_ALL_VALID_VALUES"
  | "SELECT_VALID_SET"
  | "POSSIBLE_IMPOSSIBLE"
  | "CLAIM_VERIFICATION"
  | "DATA_SUFFICIENCY";

export type NumCp004Representation =
  | "PROSE"
  | "INTERVAL"
  | "PRIME_EXPONENT_EXPRESSION"
  | "PRIME_EXPONENT_TABLE"
  | "FACTOR_TREE"
  | "STATEMENT_SET"
  | "DATA_SUFFICIENCY";

export interface NumCp004RetainedTemplateEntry {
  readonly temporaryTemplateId: NumCp004RetainedTemplateId;
  readonly title: string;
  readonly solveModeId: NumCp004RetainedSolveModeId;
  readonly taskDirection: NumCp004TaskDirection;
  readonly answerSemantic: NumCp004AnswerSemantic;
  readonly representation: NumCp004Representation;
  readonly targetProjection: string;
  readonly sourceEvidence: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly disposition: "RETAIN";
  readonly permanentQlId: null;
}

const COMMON_SOURCES = [
  "DESIGN:NUM-001-COMPLETE-CHECKPOINT-DESIGN",
  "UPLOAD:SSC-MATHEMATICS-PREVIOUS-YEAR-NUMBER-SYSTEM",
  "UPLOAD:DISHA-SSC-MATHEMATICS-GUIDE",
  "LEGACY:QUANT-V2:NUMBER-SYSTEM-PRIME-RECOVERY",
  "LEGACY:QUANT-V3:NUMBER-SYSTEM-TRACE-RECOVERY",
] as const;

function entry(
  temporaryTemplateId: NumCp004RetainedTemplateId,
  title: string,
  solveModeId: NumCp004RetainedSolveModeId,
  taskDirection: NumCp004TaskDirection,
  answerSemantic: NumCp004AnswerSemantic,
  representation: NumCp004Representation,
  targetProjection: string,
  prototypeAncestry: readonly string[],
): NumCp004RetainedTemplateEntry {
  return {
    temporaryTemplateId,
    title,
    solveModeId,
    taskDirection,
    answerSemantic,
    representation,
    targetProjection,
    sourceEvidence: COMMON_SOURCES,
    prototypeAncestry,
    disposition: "RETAIN",
    permanentQlId: null,
  };
}

export const NUM_CP004_RETAINED_TEMPLATE_REGISTRY = [
  entry("NUM-CP004-QLT-01", "Prime, composite, unit or neither", "NUM-CP004-SM-CLASSIFY-PRIME-STATUS", "DIRECT", "PRIME_CLASS", "PROSE", "classification", ["NUM-CP004-PROT-001"]),
  entry("NUM-CP004-QLT-02", "Complete prime set in a bounded interval", "NUM-CP004-SM-ENUMERATE-PRIMES-IN-INTERVAL", "SELECT_VALID_SET", "PRIME_SET", "INTERVAL", "complete set", ["NUM-CP004-PROT-002"]),
  entry("NUM-CP004-QLT-03", "Count primes in a bounded interval", "NUM-CP004-SM-COUNT-PRIMES-IN-INTERVAL", "COUNT_ALL_VALID_VALUES", "COUNT", "INTERVAL", "count", ["NUM-CP004-PROT-003"]),
  entry("NUM-CP004-QLT-04", "Adjacent or extreme prime", "NUM-CP004-SM-LOCATE-ADJACENT-OR-EXTREME-PRIME", "LEAST_GREATEST_OPTIMISATION", "PRIME", "PROSE", "direction parameter", ["NUM-CP004-PROT-009", "NUM-CP004-PROT-010"]),
  entry("NUM-CP004-QLT-05", "Prime under digit and range evidence", "NUM-CP004-SM-SELECT-PRIME-UNDER-DIGIT-RANGE", "DIRECT_INVERSE", "PRIME", "PROSE", "unique bounded prime", ["NUM-CP004-WAVE03-DIGIT-RANGE"]),
  entry("NUM-CP004-QLT-06", "Prime claim verification", "NUM-CP004-SM-VERIFY-PRIME-CLAIM", "CLAIM_VERIFICATION", "BOOLEAN_CLAIM", "STATEMENT_SET", "true claim", ["NUM-CP004-WAVE03-PRIME-CLAIM"]),
  entry("NUM-CP004-QLT-07", "Complete prime factorisation", "NUM-CP004-SM-FACTORISE-INTEGER", "DIRECT", "FACTORISATION", "PRIME_EXPONENT_EXPRESSION", "complete factorisation", ["NUM-CP004-PROT-004"]),
  entry("NUM-CP004-QLT-08", "Smallest or largest prime factor", "NUM-CP004-SM-PROJECT-PRIME-FACTOR-EXTREMUM", "LEAST_GREATEST_OPTIMISATION", "PRIME_FACTOR", "PRIME_EXPONENT_EXPRESSION", "direction parameter", ["NUM-CP004-PROT-005"]),
  entry("NUM-CP004-QLT-09", "Distinct prime-factor count", "NUM-CP004-SM-COUNT-DISTINCT-PRIME-FACTORS", "COUNT_ALL_VALID_VALUES", "COUNT", "PRIME_EXPONENT_EXPRESSION", "distinct support count", ["NUM-CP004-PROT-005"]),
  entry("NUM-CP004-QLT-10", "Prime-factor count with multiplicity", "NUM-CP004-SM-COUNT-PRIME-FACTORS-WITH-MULTIPLICITY", "COUNT_ALL_VALID_VALUES", "COUNT", "PRIME_EXPONENT_EXPRESSION", "multiplicity count", ["NUM-CP004-PROT-005"]),
  entry("NUM-CP004-QLT-11", "Recover integer from prime powers", "NUM-CP004-SM-RECONSTRUCT-INTEGER-FROM-PRIME-POWERS", "REVERSE_RECONSTRUCTION", "INTEGER", "PRIME_EXPONENT_EXPRESSION", "integer product", ["NUM-CP004-WAVE03-RECONSTRUCT-INTEGER"]),
  entry("NUM-CP004-QLT-12", "Compare prime-exponent structures", "NUM-CP004-SM-COMPARE-PRIME-EXPONENT-STRUCTURES", "DIRECT", "COMPARISON_CLASS", "PRIME_EXPONENT_TABLE", "comparison class", ["NUM-CP004-WAVE03-COMPARE-STRUCTURES"]),
  entry("NUM-CP004-QLT-13", "Complete missing prime", "NUM-CP004-SM-COMPLETE-MISSING-PRIME", "MISSING_VARIABLE", "PRIME", "PRIME_EXPONENT_EXPRESSION", "missing base prime", ["NUM-CP004-PROT-006"]),
  entry("NUM-CP004-QLT-14", "Complete missing exponent", "NUM-CP004-SM-COMPLETE-MISSING-EXPONENT", "MISSING_VARIABLE", "PRIME_EXPONENT", "PRIME_EXPONENT_EXPRESSION", "missing exponent", ["NUM-CP004-PROT-006"]),
  entry("NUM-CP004-QLT-15", "Select the co-prime pair", "NUM-CP004-SM-SELECT-COPRIME-PAIR", "DIRECT", "PAIR", "PROSE", "unique pair", ["NUM-CP004-PROT-007"]),
  entry("NUM-CP004-QLT-16", "Complete co-prime candidate set", "NUM-CP004-SM-ENUMERATE-COPRIME-CANDIDATES", "SELECT_VALID_SET", "COPRIME_SET", "PROSE", "complete set", ["NUM-CP004-PROT-015"]),
  entry("NUM-CP004-QLT-17", "Count co-prime candidate values", "NUM-CP004-SM-COUNT-COPRIME-CANDIDATES", "COUNT_ALL_VALID_VALUES", "COUNT", "PROSE", "count", ["NUM-CP004-PROT-015"]),
  entry("NUM-CP004-QLT-18", "Recover unknown for co-prime condition", "NUM-CP004-SM-RECOVER-COPRIME-UNKNOWN", "MISSING_VARIABLE", "INTEGER", "PROSE", "unique candidate", ["NUM-CP004-WAVE03-COPRIME-UNKNOWN"]),
  entry("NUM-CP004-QLT-19", "Pairwise versus collective co-primality", "NUM-CP004-SM-CLASSIFY-PAIRWISE-COLLECTIVE-COPRIMALITY", "DIRECT", "COPRIME_CLASS", "PROSE", "classification", ["NUM-CP004-PROT-008"]),
  entry("NUM-CP004-QLT-20", "Co-prime claim verification", "NUM-CP004-SM-VERIFY-COPRIME-CLAIM", "CLAIM_VERIFICATION", "BOOLEAN_CLAIM", "STATEMENT_SET", "true claim", ["NUM-CP004-WAVE03-COPRIME-CLAIM"]),
  entry("NUM-CP004-QLT-21", "Prime pair reconstruction", "NUM-CP004-SM-RECONSTRUCT-PRIME-PAIR", "REVERSE_RECONSTRUCTION", "PAIR", "PROSE", "sum/difference/product parameter", ["NUM-CP004-PROT-012", "NUM-CP004-PROT-013", "NUM-CP004-WAVE03-PAIR-PRODUCT"]),
  entry("NUM-CP004-QLT-22", "Bounded prime triple reconstruction", "NUM-CP004-SM-RECONSTRUCT-PRIME-TRIPLE", "REVERSE_RECONSTRUCTION", "TRIPLE", "PROSE", "consecutive prime triple", ["NUM-CP004-PROT-014"]),
  entry("NUM-CP004-QLT-23", "Least prime divisor", "NUM-CP004-SM-FIND-LEAST-PRIME-DIVISOR", "LEAST_GREATEST_OPTIMISATION", "PRIME_FACTOR", "PROSE", "least prime divisor", ["NUM-CP004-PROT-011"]),
  entry("NUM-CP004-QLT-24", "Prime divisor of a constructed expression", "NUM-CP004-SM-FIND-PRIME-DIVISOR-OF-EXPRESSION", "DIRECT", "PRIME_FACTOR", "PROSE", "listed prime divisor", ["NUM-CP004-WAVE03-EXPRESSION-DIVISOR"]),
  entry("NUM-CP004-QLT-25", "Possible or impossible prime structure", "NUM-CP004-SM-CLASSIFY-PRIME-STRUCTURE-FEASIBILITY", "POSSIBLE_IMPOSSIBLE", "SOLUTION_CLASS", "STATEMENT_SET", "possible structure", ["NUM-CP004-WAVE03-FEASIBILITY"]),
  entry("NUM-CP004-QLT-26", "Complete a factor tree", "NUM-CP004-SM-COMPLETE-FACTOR-TREE", "MISSING_VARIABLE", "INTEGER", "FACTOR_TREE", "missing tree node", ["NUM-CP004-WAVE03-FACTOR-TREE"]),
  entry("NUM-CP004-QLT-27", "Prime data sufficiency", "NUM-CP004-SM-RESOLVE-PRIME-DATA-SUFFICIENCY", "DATA_SUFFICIENCY", "SUFFICIENCY_CLASS", "DATA_SUFFICIENCY", "four-class sufficiency", ["NUM-CP004-WAVE03-DATA-SUFFICIENCY"]),
  entry("NUM-CP004-QLT-28", "Minimum signed adjustment to a prime", "NUM-CP004-SM-MINIMISE-ADJUSTMENT-TO-PRIME", "LEAST_GREATEST_OPTIMISATION", "PRIME_ADJUSTMENT_SET", "PROSE", "nearest-prime adjustment set", ["NUM-CP004-PROT-016"]),
] as const satisfies readonly NumCp004RetainedTemplateEntry[];

export function getNumCp004RetainedTemplate(
  temporaryTemplateId: NumCp004RetainedTemplateId,
): NumCp004RetainedTemplateEntry {
  const entry = NUM_CP004_RETAINED_TEMPLATE_REGISTRY.find(
    (candidate) => candidate.temporaryTemplateId === temporaryTemplateId,
  );
  if (!entry) throw new Error(`Unknown NUM-CP-004 retained template: ${temporaryTemplateId}`);
  return entry;
}
