export const SER_CP005_SOURCE_RULE_IDS = [
  "ALTERNATING_ADDITIVE_STEPS",
  "ALTERNATING_MULTIPLICATIVE_RATIOS",
  "TWO_INTERLEAVED_ARITHMETIC",
  "TWO_INTERLEAVED_GEOMETRIC",
  "INTERLEAVED_ARITHMETIC_GEOMETRIC",
  "ALTERNATING_ADD_THEN_MULTIPLY",
  "ALTERNATING_MULTIPLY_THEN_ADD",
  "PROGRESSIVE_MULTIPLY_PLUS_ADD",
  "PROGRESSIVE_ADD_THEN_MULTIPLY_CYCLES",
  "PROGRESSIVE_MULTIPLY_THEN_ADD_CYCLES",
] as const;

export type SerCp005SourceRuleId = (typeof SER_CP005_SOURCE_RULE_IDS)[number];

export const SER_CP005_CANONICAL_AUTHORITY_IDS = [
  "TWO_INTERLEAVED_ARITHMETIC",
  "TWO_INTERLEAVED_GEOMETRIC",
  "INTERLEAVED_ARITHMETIC_GEOMETRIC",
  "ALTERNATING_FIXED_AFFINE_PHASE",
  "PROGRESSIVE_MULTIPLY_PLUS_ADD",
  "PROGRESSIVE_ALTERNATING_AFFINE_CYCLES",
] as const;

export type SerCp005CanonicalAuthorityId =
  (typeof SER_CP005_CANONICAL_AUTHORITY_IDS)[number];

export type SerCp005TemporaryTemplateId = `SER-CP-005-TMP-${string}`;

export const SER_CP005_TEMPORARY_TEMPLATE_IDS = Array.from(
  { length: SER_CP005_SOURCE_RULE_IDS.length * 4 },
  (_, index) => `SER-CP-005-TMP-${String(index + 1).padStart(3, "0")}`,
) as readonly SerCp005TemporaryTemplateId[];

export type SerCp005TaskKind =
  | "NEXT_TERM"
  | "MISSING_TERM"
  | "PREVIOUS_TERM"
  | "WRONG_TERM";

export type SerCp005Difficulty = "EASY" | "MEDIUM" | "HARD";

export type SerCp005OwnershipDisposition =
  | "PROVISIONAL_RETAIN_CP005"
  | "PROVISIONAL_COLLAPSE_TO_INTERLEAVED_AUTHORITY"
  | "PROVISIONAL_MERGE_PHASE_VARIANTS";

export interface SerCp005Template {
  readonly temporaryTemplateId: SerCp005TemporaryTemplateId;
  readonly sourceRuleId: SerCp005SourceRuleId;
  readonly canonicalAuthorityId: SerCp005CanonicalAuthorityId;
  readonly taskKind: SerCp005TaskKind;
  readonly answerSemantic: "TERM_VALUE" | "WRONG_DISPLAYED_TERM";
  readonly ownershipDisposition: SerCp005OwnershipDisposition;
}

const TASKS = [
  "NEXT_TERM",
  "MISSING_TERM",
  "PREVIOUS_TERM",
  "WRONG_TERM",
] as const;

function authorityFor(sourceRuleId: SerCp005SourceRuleId): Pick<
  SerCp005Template,
  "canonicalAuthorityId" | "ownershipDisposition"
> {
  switch (sourceRuleId) {
    case "ALTERNATING_ADDITIVE_STEPS":
      return {
        canonicalAuthorityId: "TWO_INTERLEAVED_ARITHMETIC",
        ownershipDisposition: "PROVISIONAL_COLLAPSE_TO_INTERLEAVED_AUTHORITY",
      };
    case "ALTERNATING_MULTIPLICATIVE_RATIOS":
      return {
        canonicalAuthorityId: "TWO_INTERLEAVED_GEOMETRIC",
        ownershipDisposition: "PROVISIONAL_COLLAPSE_TO_INTERLEAVED_AUTHORITY",
      };
    case "TWO_INTERLEAVED_ARITHMETIC":
      return {
        canonicalAuthorityId: "TWO_INTERLEAVED_ARITHMETIC",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP005",
      };
    case "TWO_INTERLEAVED_GEOMETRIC":
      return {
        canonicalAuthorityId: "TWO_INTERLEAVED_GEOMETRIC",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP005",
      };
    case "INTERLEAVED_ARITHMETIC_GEOMETRIC":
      return {
        canonicalAuthorityId: "INTERLEAVED_ARITHMETIC_GEOMETRIC",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP005",
      };
    case "ALTERNATING_ADD_THEN_MULTIPLY":
    case "ALTERNATING_MULTIPLY_THEN_ADD":
      return {
        canonicalAuthorityId: "ALTERNATING_FIXED_AFFINE_PHASE",
        ownershipDisposition: "PROVISIONAL_MERGE_PHASE_VARIANTS",
      };
    case "PROGRESSIVE_MULTIPLY_PLUS_ADD":
      return {
        canonicalAuthorityId: "PROGRESSIVE_MULTIPLY_PLUS_ADD",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP005",
      };
    case "PROGRESSIVE_ADD_THEN_MULTIPLY_CYCLES":
    case "PROGRESSIVE_MULTIPLY_THEN_ADD_CYCLES":
      return {
        canonicalAuthorityId: "PROGRESSIVE_ALTERNATING_AFFINE_CYCLES",
        ownershipDisposition: "PROVISIONAL_MERGE_PHASE_VARIANTS",
      };
  }
}

export const SER_CP005_TEMPORARY_TEMPLATES: readonly SerCp005Template[] =
  SER_CP005_TEMPORARY_TEMPLATE_IDS.map((temporaryTemplateId, index) => {
    const sourceRuleId = SER_CP005_SOURCE_RULE_IDS[Math.floor(index / 4)]!;
    const taskKind = TASKS[index % 4]!;
    return {
      temporaryTemplateId,
      sourceRuleId,
      taskKind,
      answerSemantic:
        taskKind === "WRONG_TERM" ? "WRONG_DISPLAYED_TERM" : "TERM_VALUE",
      ...authorityFor(sourceRuleId),
    };
  });

export interface SerCp005HiddenState {
  readonly parameterKey: string;
  readonly canonicalSequence: readonly number[];
  readonly targetIndex: number;
  readonly corruptedValue: number | null;
  readonly correctReplacement: number;
  readonly independentRepresentationRuleIds: readonly SerCp005SourceRuleId[];
}

export interface SerCp005Explanation {
  readonly ruleStatement: string;
  readonly working: readonly string[];
  readonly conclusion: string;
  readonly trapAnalyses: readonly string[];
}

export interface SerCp005Question {
  readonly questionId: string;
  readonly packageId: "SER-001";
  readonly checkpointId: "SER-CP-005";
  readonly temporaryTemplateId: SerCp005TemporaryTemplateId;
  readonly permanentQlId: null;
  readonly sourceRuleId: SerCp005SourceRuleId;
  readonly canonicalAuthorityId: SerCp005CanonicalAuthorityId;
  readonly taskKind: SerCp005TaskKind;
  readonly solveMode: "INFER_ALTERNATING_INTERLEAVED_OR_COMPOSITE_SEQUENCE";
  readonly answerSemantic: "TERM_VALUE" | "WRONG_DISPLAYED_TERM";
  readonly ownershipDisposition: SerCp005OwnershipDisposition;
  readonly language: "en-IN";
  readonly difficulty: SerCp005Difficulty;
  readonly seed: number;
  readonly stem: string;
  readonly sequence: readonly (number | null)[];
  readonly options: readonly number[];
  readonly correctAnswer: number;
  readonly correctIndex: number;
  readonly mathematicalFingerprint: string;
  readonly explanation: SerCp005Explanation;
  readonly hiddenState: SerCp005HiddenState;
  readonly lifecycle: {
    readonly maturity: "OPEN_EXECUTABLE_DISCOVERY";
    readonly sourceSaturation: "OPEN";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export interface SerCp005IndependentSolution {
  readonly answer: number;
  readonly canonicalAuthorityId: SerCp005CanonicalAuthorityId;
  readonly representationRuleIds: readonly SerCp005SourceRuleId[];
  readonly representationCount: number;
  readonly targetIndex: number;
  readonly correctReplacement: number;
  readonly candidateCount: number;
}

interface GeneratedCanonical {
  readonly parameterKey: string;
  readonly sequence: readonly number[];
}

interface MutableCandidate {
  readonly canonicalAuthorityId: SerCp005CanonicalAuthorityId;
  readonly projected: readonly number[];
  readonly mismatches: readonly number[];
  readonly representations: Map<SerCp005SourceRuleId, string>;
}

interface Candidate {
  readonly canonicalAuthorityId: SerCp005CanonicalAuthorityId;
  readonly projected: readonly number[];
  readonly mismatches: readonly number[];
  readonly representationRuleIds: readonly SerCp005SourceRuleId[];
  readonly representationCount: number;
}

interface LaneCandidate {
  readonly parameterKey: string;
  readonly values: readonly number[];
  readonly mismatches: readonly number[];
}

function assertPositiveSeed(seed: number): void {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`SER-CP-005 seed must be a positive integer; received ${seed}`);
  }
}

function templateFor(
  temporaryTemplateId: SerCp005TemporaryTemplateId,
): SerCp005Template {
  const template = SER_CP005_TEMPORARY_TEMPLATES.find(
    (entry) => entry.temporaryTemplateId === temporaryTemplateId,
  );
  if (!template) {
    throw new Error(`Unknown SER-CP-005 temporary template: ${temporaryTemplateId}`);
  }
  return template;
}

function createPrng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function integer(next: () => number, minimum: number, maximum: number): number {
  return minimum + Math.floor(next() * (maximum - minimum + 1));
}

function difficultyFor(seed: number, templateIndex: number): SerCp005Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[
    (seed + templateIndex) % 3
  ]!;
}

function isSafeSequence(sequence: readonly number[]): boolean {
  return sequence.every(
    (value) => Number.isSafeInteger(value) && Math.abs(value) <= 2_000_000,
  );
}

function mismatchesFor(
  displayed: readonly (number | null)[],
  projected: readonly number[],
): number[] {
  const mismatches: number[] = [];
  for (let index = 0; index < displayed.length; index += 1) {
    const value = displayed[index];
    if (value != null && value !== projected[index]) mismatches.push(index);
  }
  return mismatches;
}

function addRepresentation(
  candidates: Map<string, MutableCandidate>,
  displayed: readonly (number | null)[],
  allowedMismatchCount: 0 | 1,
  sourceRuleId: SerCp005SourceRuleId,
  canonicalAuthorityId: SerCp005CanonicalAuthorityId,
  parameterKey: string,
  projected: readonly number[],
): void {
  if (projected.length !== displayed.length || !isSafeSequence(projected)) return;
  const mismatches = mismatchesFor(displayed, projected);
  if (mismatches.length !== allowedMismatchCount) return;
  const key = `${canonicalAuthorityId}|${projected.join(",")}`;
  const existing = candidates.get(key);
  if (existing) {
    existing.representations.set(sourceRuleId, parameterKey);
    return;
  }
  candidates.set(key, {
    canonicalAuthorityId,
    projected: [...projected],
    mismatches,
    representations: new Map([[sourceRuleId, parameterKey]]),
  });
}

function deriveStartsFromAffine(
  displayed: readonly (number | null)[],
  coefficients: readonly (readonly [number, number])[],
): number[] {
  const starts = new Set<number>();
  for (let index = 0; index < displayed.length; index += 1) {
    const value = displayed[index];
    if (value == null) continue;
    const [a, b] = coefficients[index]!;
    if (a === 0) continue;
    const numerator = value - b;
    if (numerator % a !== 0) continue;
    const start = numerator / a;
    if (Number.isSafeInteger(start) && Math.abs(start) <= 100_000) starts.add(start);
  }
  return [...starts];
}

function projectAffine(
  start: number,
  coefficients: readonly (readonly [number, number])[],
): number[] {
  return coefficients.map(([a, b]) => a * start + b);
}

function alternatingAdditiveCoefficients(
  length: number,
  stepA: number,
  stepB: number,
): readonly (readonly [number, number])[] {
  const result: [number, number][] = [[1, 0]];
  for (let index = 0; index < length - 1; index += 1) {
    const previous = result[index]!;
    result.push([previous[0], previous[1] + (index % 2 === 0 ? stepA : stepB)]);
  }
  return result;
}

function alternatingMultiplicativeCoefficients(
  length: number,
  ratioA: number,
  ratioB: number,
): readonly (readonly [number, number])[] {
  const result: [number, number][] = [[1, 0]];
  for (let index = 0; index < length - 1; index += 1) {
    const previous = result[index]!;
    result.push([previous[0] * (index % 2 === 0 ? ratioA : ratioB), 0]);
  }
  return result;
}

function alternatingAffineCoefficients(
  length: number,
  add: number,
  multiplier: number,
  phase: "ADD_THEN_MULTIPLY" | "MULTIPLY_THEN_ADD",
): readonly (readonly [number, number])[] {
  const result: [number, number][] = [[1, 0]];
  for (let index = 0; index < length - 1; index += 1) {
    const previous = result[index]!;
    const addTurn =
      phase === "ADD_THEN_MULTIPLY" ? index % 2 === 0 : index % 2 === 1;
    result.push(
      addTurn
        ? [previous[0], previous[1] + add]
        : [previous[0] * multiplier, previous[1] * multiplier],
    );
  }
  return result;
}

function progressiveMultiplyPlusAddCoefficients(
  length: number,
  multiplierStart: number,
  addStart: number,
): readonly (readonly [number, number])[] {
  const result: [number, number][] = [[1, 0]];
  for (let index = 0; index < length - 1; index += 1) {
    const multiplier = multiplierStart + index;
    const addend = addStart + index;
    const previous = result[index]!;
    result.push([
      previous[0] * multiplier,
      previous[1] * multiplier + addend,
    ]);
  }
  return result;
}

function progressiveCycleCoefficients(
  length: number,
  addStart: number,
  multiplierStart: number,
  phase: "ADD_THEN_MULTIPLY" | "MULTIPLY_THEN_ADD",
): readonly (readonly [number, number])[] {
  const result: [number, number][] = [[1, 0]];
  for (let index = 0; index < length - 1; index += 1) {
    const cycle = Math.floor(index / 2);
    const addTurn =
      phase === "ADD_THEN_MULTIPLY" ? index % 2 === 0 : index % 2 === 1;
    const previous = result[index]!;
    if (addTurn) {
      result.push([previous[0], previous[1] + addStart + cycle]);
    } else {
      const multiplier = multiplierStart + cycle;
      result.push([
        previous[0] * multiplier,
        previous[1] * multiplier,
      ]);
    }
  }
  return result;
}

function laneIndexes(length: number, parity: 0 | 1): number[] {
  const result: number[] = [];
  for (let index = parity; index < length; index += 2) result.push(index);
  return result;
}

function arithmeticLaneCandidates(
  displayed: readonly (number | null)[],
  parity: 0 | 1,
  allowedMismatchCount: 0 | 1,
): LaneCandidate[] {
  const indexes = laneIndexes(displayed.length, parity);
  const candidates = new Map<string, LaneCandidate>();
  for (let step = -36; step <= 48; step += 1) {
    if (step === 0) continue;
    const starts = new Set<number>();
    for (let rank = 0; rank < indexes.length; rank += 1) {
      const value = displayed[indexes[rank]!]!;
      if (value == null) continue;
      starts.add(value - rank * step);
    }
    for (const start of starts) {
      const values = indexes.map((_, rank) => start + rank * step);
      if (!isSafeSequence(values)) continue;
      const mismatches: number[] = [];
      for (let rank = 0; rank < indexes.length; rank += 1) {
        const fullIndex = indexes[rank]!;
        const value = displayed[fullIndex];
        if (value != null && value !== values[rank]) mismatches.push(fullIndex);
      }
      if (mismatches.length > allowedMismatchCount) continue;
      const key = `${start}|${step}|${values.join(",")}`;
      candidates.set(key, {
        parameterKey: `start=${start};step=${step}`,
        values,
        mismatches,
      });
    }
  }
  return [...candidates.values()];
}

function geometricLaneCandidates(
  displayed: readonly (number | null)[],
  parity: 0 | 1,
  allowedMismatchCount: 0 | 1,
): LaneCandidate[] {
  const indexes = laneIndexes(displayed.length, parity);
  const candidates = new Map<string, LaneCandidate>();
  for (let ratio = 2; ratio <= 36; ratio += 1) {
    const starts = new Set<number>();
    for (let rank = 0; rank < indexes.length; rank += 1) {
      const value = displayed[indexes[rank]!]!;
      if (value == null) continue;
      const divisor = ratio ** rank;
      if (value % divisor === 0) starts.add(value / divisor);
    }
    for (const start of starts) {
      if (!Number.isInteger(start) || start === 0) continue;
      const values = indexes.map((_, rank) => start * ratio ** rank);
      if (!isSafeSequence(values)) continue;
      const mismatches: number[] = [];
      for (let rank = 0; rank < indexes.length; rank += 1) {
        const fullIndex = indexes[rank]!;
        const value = displayed[fullIndex];
        if (value != null && value !== values[rank]) mismatches.push(fullIndex);
      }
      if (mismatches.length > allowedMismatchCount) continue;
      const key = `${start}|${ratio}|${values.join(",")}`;
      candidates.set(key, {
        parameterKey: `start=${start};ratio=${ratio}`,
        values,
        mismatches,
      });
    }
  }
  return [...candidates.values()];
}

function combineLanes(
  length: number,
  even: LaneCandidate,
  odd: LaneCandidate,
): number[] {
  const projected = Array<number>(length);
  let evenRank = 0;
  let oddRank = 0;
  for (let index = 0; index < length; index += 1) {
    if (index % 2 === 0) projected[index] = even.values[evenRank++]!;
    else projected[index] = odd.values[oddRank++]!;
  }
  return projected;
}

function addInterleavedRepresentations(
  candidates: Map<string, MutableCandidate>,
  displayed: readonly (number | null)[],
  allowedMismatchCount: 0 | 1,
): void {
  const arithmeticEven = arithmeticLaneCandidates(displayed, 0, allowedMismatchCount);
  const arithmeticOdd = arithmeticLaneCandidates(displayed, 1, allowedMismatchCount);
  for (const even of arithmeticEven) {
    for (const odd of arithmeticOdd) {
      const mismatchSet = new Set([...even.mismatches, ...odd.mismatches]);
      if (mismatchSet.size !== allowedMismatchCount) continue;
      addRepresentation(
        candidates,
        displayed,
        allowedMismatchCount,
        "TWO_INTERLEAVED_ARITHMETIC",
        "TWO_INTERLEAVED_ARITHMETIC",
        `even{${even.parameterKey}};odd{${odd.parameterKey}}`,
        combineLanes(displayed.length, even, odd),
      );
    }
  }

  const geometricEven = geometricLaneCandidates(displayed, 0, allowedMismatchCount);
  const geometricOdd = geometricLaneCandidates(displayed, 1, allowedMismatchCount);
  for (const even of geometricEven) {
    for (const odd of geometricOdd) {
      const mismatchSet = new Set([...even.mismatches, ...odd.mismatches]);
      if (mismatchSet.size !== allowedMismatchCount) continue;
      addRepresentation(
        candidates,
        displayed,
        allowedMismatchCount,
        "TWO_INTERLEAVED_GEOMETRIC",
        "TWO_INTERLEAVED_GEOMETRIC",
        `even{${even.parameterKey}};odd{${odd.parameterKey}}`,
        combineLanes(displayed.length, even, odd),
      );
    }
  }

  for (const arithmetic of arithmeticEven) {
    for (const geometric of geometricOdd) {
      const mismatchSet = new Set([...arithmetic.mismatches, ...geometric.mismatches]);
      if (mismatchSet.size !== allowedMismatchCount) continue;
      addRepresentation(
        candidates,
        displayed,
        allowedMismatchCount,
        "INTERLEAVED_ARITHMETIC_GEOMETRIC",
        "INTERLEAVED_ARITHMETIC_GEOMETRIC",
        `arithmeticParity=0;arithmetic{${arithmetic.parameterKey}};geometric{${geometric.parameterKey}}`,
        combineLanes(displayed.length, arithmetic, geometric),
      );
    }
  }
  for (const geometric of geometricEven) {
    for (const arithmetic of arithmeticOdd) {
      const mismatchSet = new Set([...geometric.mismatches, ...arithmetic.mismatches]);
      if (mismatchSet.size !== allowedMismatchCount) continue;
      addRepresentation(
        candidates,
        displayed,
        allowedMismatchCount,
        "INTERLEAVED_ARITHMETIC_GEOMETRIC",
        "INTERLEAVED_ARITHMETIC_GEOMETRIC",
        `arithmeticParity=1;arithmetic{${arithmetic.parameterKey}};geometric{${geometric.parameterKey}}`,
        combineLanes(displayed.length, geometric, arithmetic),
      );
    }
  }
}

function addAffineFamilyRepresentations(
  candidates: Map<string, MutableCandidate>,
  displayed: readonly (number | null)[],
  allowedMismatchCount: 0 | 1,
): void {
  const length = displayed.length;

  for (let stepA = -18; stepA <= 24; stepA += 1) {
    if (stepA === 0) continue;
    for (let stepB = -18; stepB <= 24; stepB += 1) {
      if (stepB === 0 || stepA === stepB || stepA + stepB === 0) continue;
      const coefficients = alternatingAdditiveCoefficients(length, stepA, stepB);
      for (const start of deriveStartsFromAffine(displayed, coefficients)) {
        addRepresentation(
          candidates,
          displayed,
          allowedMismatchCount,
          "ALTERNATING_ADDITIVE_STEPS",
          "TWO_INTERLEAVED_ARITHMETIC",
          `start=${start};stepA=${stepA};stepB=${stepB}`,
          projectAffine(start, coefficients),
        );
      }
    }
  }

  for (let ratioA = 2; ratioA <= 6; ratioA += 1) {
    for (let ratioB = 2; ratioB <= 6; ratioB += 1) {
      if (ratioA === ratioB) continue;
      const coefficients = alternatingMultiplicativeCoefficients(length, ratioA, ratioB);
      for (const start of deriveStartsFromAffine(displayed, coefficients)) {
        addRepresentation(
          candidates,
          displayed,
          allowedMismatchCount,
          "ALTERNATING_MULTIPLICATIVE_RATIOS",
          "TWO_INTERLEAVED_GEOMETRIC",
          `start=${start};ratioA=${ratioA};ratioB=${ratioB}`,
          projectAffine(start, coefficients),
        );
      }
    }
  }

  for (let add = 1; add <= 18; add += 1) {
    for (let multiplier = 2; multiplier <= 6; multiplier += 1) {
      for (const [sourceRuleId, phase] of [
        ["ALTERNATING_ADD_THEN_MULTIPLY", "ADD_THEN_MULTIPLY"],
        ["ALTERNATING_MULTIPLY_THEN_ADD", "MULTIPLY_THEN_ADD"],
      ] as const) {
        const coefficients = alternatingAffineCoefficients(length, add, multiplier, phase);
        for (const start of deriveStartsFromAffine(displayed, coefficients)) {
          addRepresentation(
            candidates,
            displayed,
            allowedMismatchCount,
            sourceRuleId,
            "ALTERNATING_FIXED_AFFINE_PHASE",
            `start=${start};add=${add};multiplier=${multiplier};phase=${phase}`,
            projectAffine(start, coefficients),
          );
        }
      }
    }
  }

  for (let multiplierStart = 1; multiplierStart <= 3; multiplierStart += 1) {
    for (let addStart = 0; addStart <= 7; addStart += 1) {
      const coefficients = progressiveMultiplyPlusAddCoefficients(
        length,
        multiplierStart,
        addStart,
      );
      for (const start of deriveStartsFromAffine(displayed, coefficients)) {
        addRepresentation(
          candidates,
          displayed,
          allowedMismatchCount,
          "PROGRESSIVE_MULTIPLY_PLUS_ADD",
          "PROGRESSIVE_MULTIPLY_PLUS_ADD",
          `start=${start};multiplierStart=${multiplierStart};addStart=${addStart}`,
          projectAffine(start, coefficients),
        );
      }
    }
  }

  for (let addStart = 1; addStart <= 10; addStart += 1) {
    for (let multiplierStart = 2; multiplierStart <= 4; multiplierStart += 1) {
      for (const [sourceRuleId, phase] of [
        ["PROGRESSIVE_ADD_THEN_MULTIPLY_CYCLES", "ADD_THEN_MULTIPLY"],
        ["PROGRESSIVE_MULTIPLY_THEN_ADD_CYCLES", "MULTIPLY_THEN_ADD"],
      ] as const) {
        const coefficients = progressiveCycleCoefficients(
          length,
          addStart,
          multiplierStart,
          phase,
        );
        for (const start of deriveStartsFromAffine(displayed, coefficients)) {
          addRepresentation(
            candidates,
            displayed,
            allowedMismatchCount,
            sourceRuleId,
            "PROGRESSIVE_ALTERNATING_AFFINE_CYCLES",
            `start=${start};addStart=${addStart};multiplierStart=${multiplierStart};phase=${phase}`,
            projectAffine(start, coefficients),
          );
        }
      }
    }
  }
}

function inferCandidates(
  displayed: readonly (number | null)[],
  allowedMismatchCount: 0 | 1,
): Candidate[] {
  const candidates = new Map<string, MutableCandidate>();
  addAffineFamilyRepresentations(candidates, displayed, allowedMismatchCount);
  addInterleavedRepresentations(candidates, displayed, allowedMismatchCount);
  return [...candidates.values()].map((candidate) => ({
    canonicalAuthorityId: candidate.canonicalAuthorityId,
    projected: candidate.projected,
    mismatches: candidate.mismatches,
    representationRuleIds: [...candidate.representations.keys()].sort(),
    representationCount: candidate.representations.size,
  }));
}

export function solveSerCp005Sequence(
  taskKind: SerCp005TaskKind,
  sequence: readonly (number | null)[],
): SerCp005IndependentSolution {
  if (sequence.length < 7) {
    throw new Error("SER-CP-005 requires at least seven displayed positions");
  }
  const missingIndexes = sequence
    .map((value, index) => (value == null ? index : -1))
    .filter((index) => index >= 0);
  if (taskKind === "WRONG_TERM" && missingIndexes.length !== 0) {
    throw new Error("Wrong-term SER-CP-005 sequences cannot contain a blank");
  }
  if (taskKind !== "WRONG_TERM" && missingIndexes.length !== 1) {
    throw new Error("Completion SER-CP-005 sequences require exactly one blank");
  }

  const candidates = inferCandidates(sequence, taskKind === "WRONG_TERM" ? 1 : 0);
  if (candidates.length !== 1) {
    throw new Error(
      `SER-CP-005 ambiguity rejection: expected one canonical authority, found ${candidates.length}`,
    );
  }
  const candidate = candidates[0]!;
  const targetIndex =
    taskKind === "WRONG_TERM" ? candidate.mismatches[0]! : missingIndexes[0]!;
  const correctReplacement = candidate.projected[targetIndex]!;
  const displayedAnswer = sequence[targetIndex];
  const answer = taskKind === "WRONG_TERM" ? displayedAnswer : correctReplacement;
  if (answer == null) throw new Error("SER-CP-005 independent solver found no answer");
  return {
    answer,
    canonicalAuthorityId: candidate.canonicalAuthorityId,
    representationRuleIds: candidate.representationRuleIds,
    representationCount: candidate.representationCount,
    targetIndex,
    correctReplacement,
    candidateCount: candidates.length,
  };
}

function generateCanonical(
  sourceRuleId: SerCp005SourceRuleId,
  difficulty: SerCp005Difficulty,
  next: () => number,
): GeneratedCanonical {
  const length = difficulty === "EASY" ? 7 : difficulty === "MEDIUM" ? 8 : 9;
  switch (sourceRuleId) {
    case "ALTERNATING_ADDITIVE_STEPS": {
      const start = integer(next, 24, difficulty === "HARD" ? 90 : 65);
      const stepA = integer(next, 2, difficulty === "HARD" ? 16 : 11);
      let stepB = integer(next, difficulty === "EASY" ? -5 : -10, 14);
      if (stepB === 0 || stepB === stepA || stepA + stepB === 0) stepB += 1;
      const coefficients = alternatingAdditiveCoefficients(length, stepA, stepB);
      return {
        parameterKey: `start=${start};stepA=${stepA};stepB=${stepB}`,
        sequence: projectAffine(start, coefficients),
      };
    }
    case "ALTERNATING_MULTIPLICATIVE_RATIOS": {
      const start = integer(next, 1, 5);
      const ratioA = integer(next, 2, difficulty === "HARD" ? 5 : 4);
      let ratioB = integer(next, 2, difficulty === "HARD" ? 5 : 4);
      if (ratioB === ratioA) ratioB = ratioB === 2 ? 3 : 2;
      const coefficients = alternatingMultiplicativeCoefficients(length, ratioA, ratioB);
      return {
        parameterKey: `start=${start};ratioA=${ratioA};ratioB=${ratioB}`,
        sequence: projectAffine(start, coefficients),
      };
    }
    case "TWO_INTERLEAVED_ARITHMETIC": {
      const evenStart = integer(next, 3, 40);
      const oddStart = integer(next, 5, 50);
      const evenStep = integer(next, 2, difficulty === "HARD" ? 16 : 11);
      let oddStep = integer(next, 2, difficulty === "HARD" ? 18 : 13);
      if (oddStep === evenStep) oddStep += 1;
      const evenLength = Math.ceil(length / 2);
      const oddLength = Math.floor(length / 2);
      const even = Array.from({ length: evenLength }, (_, rank) => evenStart + rank * evenStep);
      const odd = Array.from({ length: oddLength }, (_, rank) => oddStart + rank * oddStep);
      return {
        parameterKey: `evenStart=${evenStart};evenStep=${evenStep};oddStart=${oddStart};oddStep=${oddStep}`,
        sequence: combineLanes(
          length,
          { parameterKey: "", values: even, mismatches: [] },
          { parameterKey: "", values: odd, mismatches: [] },
        ),
      };
    }
    case "TWO_INTERLEAVED_GEOMETRIC": {
      const evenStart = integer(next, 1, 8);
      const oddStart = integer(next, 1, 8);
      const evenRatio = integer(next, 2, difficulty === "HARD" ? 5 : 4);
      let oddRatio = integer(next, 2, difficulty === "HARD" ? 5 : 4);
      if (oddRatio === evenRatio) oddRatio = oddRatio === 2 ? 3 : 2;
      const evenLength = Math.ceil(length / 2);
      const oddLength = Math.floor(length / 2);
      const even = Array.from({ length: evenLength }, (_, rank) => evenStart * evenRatio ** rank);
      const odd = Array.from({ length: oddLength }, (_, rank) => oddStart * oddRatio ** rank);
      return {
        parameterKey: `evenStart=${evenStart};evenRatio=${evenRatio};oddStart=${oddStart};oddRatio=${oddRatio}`,
        sequence: combineLanes(
          length,
          { parameterKey: "", values: even, mismatches: [] },
          { parameterKey: "", values: odd, mismatches: [] },
        ),
      };
    }
    case "INTERLEAVED_ARITHMETIC_GEOMETRIC": {
      const arithmeticParity = integer(next, 0, 1) as 0 | 1;
      const arithmeticStart = integer(next, 3, 35);
      const arithmeticStep = integer(next, 2, difficulty === "HARD" ? 15 : 10);
      const geometricStart = integer(next, 1, 6);
      const geometricRatio = integer(next, 2, difficulty === "HARD" ? 5 : 4);
      const evenLength = Math.ceil(length / 2);
      const oddLength = Math.floor(length / 2);
      const arithmeticLength = arithmeticParity === 0 ? evenLength : oddLength;
      const geometricLength = arithmeticParity === 0 ? oddLength : evenLength;
      const arithmetic = Array.from(
        { length: arithmeticLength },
        (_, rank) => arithmeticStart + rank * arithmeticStep,
      );
      const geometric = Array.from(
        { length: geometricLength },
        (_, rank) => geometricStart * geometricRatio ** rank,
      );
      const even = arithmeticParity === 0 ? arithmetic : geometric;
      const odd = arithmeticParity === 0 ? geometric : arithmetic;
      return {
        parameterKey: `arithmeticParity=${arithmeticParity};arithmeticStart=${arithmeticStart};arithmeticStep=${arithmeticStep};geometricStart=${geometricStart};geometricRatio=${geometricRatio}`,
        sequence: combineLanes(
          length,
          { parameterKey: "", values: even, mismatches: [] },
          { parameterKey: "", values: odd, mismatches: [] },
        ),
      };
    }
    case "ALTERNATING_ADD_THEN_MULTIPLY":
    case "ALTERNATING_MULTIPLY_THEN_ADD": {
      const start = integer(next, 2, 20);
      const add = integer(next, 1, difficulty === "HARD" ? 14 : 9);
      const multiplier = integer(next, 2, difficulty === "HARD" ? 5 : 4);
      const phase =
        sourceRuleId === "ALTERNATING_ADD_THEN_MULTIPLY"
          ? "ADD_THEN_MULTIPLY"
          : "MULTIPLY_THEN_ADD";
      const coefficients = alternatingAffineCoefficients(length, add, multiplier, phase);
      return {
        parameterKey: `start=${start};add=${add};multiplier=${multiplier};phase=${phase}`,
        sequence: projectAffine(start, coefficients),
      };
    }
    case "PROGRESSIVE_MULTIPLY_PLUS_ADD": {
      const start = integer(next, 1, 10);
      const multiplierStart = integer(next, 1, difficulty === "HARD" ? 3 : 2);
      const addStart = integer(next, 0, difficulty === "HARD" ? 7 : 4);
      const coefficients = progressiveMultiplyPlusAddCoefficients(
        length,
        multiplierStart,
        addStart,
      );
      return {
        parameterKey: `start=${start};multiplierStart=${multiplierStart};addStart=${addStart}`,
        sequence: projectAffine(start, coefficients),
      };
    }
    case "PROGRESSIVE_ADD_THEN_MULTIPLY_CYCLES":
    case "PROGRESSIVE_MULTIPLY_THEN_ADD_CYCLES": {
      const start = integer(next, 2, 16);
      const addStart = integer(next, 1, difficulty === "HARD" ? 10 : 7);
      const multiplierStart = integer(next, 2, difficulty === "HARD" ? 4 : 3);
      const phase =
        sourceRuleId === "PROGRESSIVE_ADD_THEN_MULTIPLY_CYCLES"
          ? "ADD_THEN_MULTIPLY"
          : "MULTIPLY_THEN_ADD";
      const coefficients = progressiveCycleCoefficients(
        length,
        addStart,
        multiplierStart,
        phase,
      );
      return {
        parameterKey: `start=${start};addStart=${addStart};multiplierStart=${multiplierStart};phase=${phase}`,
        sequence: projectAffine(start, coefficients),
      };
    }
  }
}

function targetIndexFor(
  taskKind: SerCp005TaskKind,
  length: number,
  next: () => number,
): number {
  if (taskKind === "NEXT_TERM") return length - 1;
  if (taskKind === "PREVIOUS_TERM") return 0;
  return integer(next, 2, length - 3);
}

function makeCorruptedValue(
  canonical: readonly number[],
  targetIndex: number,
  next: () => number,
): number {
  const current = canonical[targetIndex]!;
  const leftGap = Math.abs(current - canonical[Math.max(0, targetIndex - 1)]!);
  const rightGap = Math.abs(canonical[Math.min(canonical.length - 1, targetIndex + 1)]! - current);
  const scale = Math.max(1, Math.min(100, leftGap || rightGap || 1));
  let corrupted = current;
  for (let attempt = 0; attempt < 24 && canonical.includes(corrupted); attempt += 1) {
    const magnitude = scale * integer(next, 1, 3) + integer(next, 1, 7);
    corrupted = current + (next() < 0.5 ? -magnitude : magnitude);
  }
  if (canonical.includes(corrupted)) corrupted = current + scale + 11;
  return corrupted;
}

function stemFor(taskKind: SerCp005TaskKind): string {
  switch (taskKind) {
    case "NEXT_TERM":
      return "What number should come next in the series?";
    case "MISSING_TERM":
      return "Which number should replace the blank in the series?";
    case "PREVIOUS_TERM":
      return "Which number should be placed before the first shown term to complete the series?";
    case "WRONG_TERM":
      return "One term in the series is incorrect. Which displayed term is wrong?";
  }
}

function ruleStatementFor(
  sourceRuleId: SerCp005SourceRuleId,
  canonicalAuthorityId: SerCp005CanonicalAuthorityId,
): string {
  switch (sourceRuleId) {
    case "ALTERNATING_ADDITIVE_STEPS":
      return "Two fixed additions alternate; equivalently, the odd-position and even-position terms form arithmetic sub-series.";
    case "ALTERNATING_MULTIPLICATIVE_RATIOS":
      return "Two fixed multipliers alternate; equivalently, the odd-position and even-position terms form geometric sub-series.";
    case "TWO_INTERLEAVED_ARITHMETIC":
      return "Read alternate positions separately: each lane is an arithmetic progression with its own fixed difference.";
    case "TWO_INTERLEAVED_GEOMETRIC":
      return "Read alternate positions separately: each lane is a geometric progression with its own fixed ratio.";
    case "INTERLEAVED_ARITHMETIC_GEOMETRIC":
      return "The series contains two interleaved lanes: one arithmetic progression and one geometric progression.";
    case "ALTERNATING_ADD_THEN_MULTIPLY":
      return "A fixed addition and a fixed multiplication alternate, beginning with the addition.";
    case "ALTERNATING_MULTIPLY_THEN_ADD":
      return "A fixed multiplication and a fixed addition alternate, beginning with the multiplication.";
    case "PROGRESSIVE_MULTIPLY_PLUS_ADD":
      return "Each transition multiplies and then adds, while both the multiplier and the added amount increase step by step.";
    case "PROGRESSIVE_ADD_THEN_MULTIPLY_CYCLES":
      return "Addition and multiplication alternate in cycles, and the operation values increase from one cycle to the next.";
    case "PROGRESSIVE_MULTIPLY_THEN_ADD_CYCLES":
      return "Multiplication and addition alternate in cycles, and the operation values increase from one cycle to the next.";
    default:
      return `The series follows the ${canonicalAuthorityId} authority.`;
  }
}

function laneText(sequence: readonly number[], parity: 0 | 1): string {
  return sequence.filter((_, index) => index % 2 === parity).join(", ");
}

function workingFor(
  sourceRuleId: SerCp005SourceRuleId,
  taskKind: SerCp005TaskKind,
  displayed: readonly (number | null)[],
  hiddenState: SerCp005HiddenState,
): string[] {
  const { canonicalSequence, targetIndex, correctReplacement } = hiddenState;
  const working: string[] = [];
  switch (sourceRuleId) {
    case "ALTERNATING_ADDITIVE_STEPS": {
      const differences = canonicalSequence.slice(1).map((value, index) => value - canonicalSequence[index]!);
      working.push(`The successive changes begin ${differences.slice(0, 6).map((value) => value >= 0 ? `+${value}` : String(value)).join(", ")} and repeat in pairs.`);
      working.push(`The alternate-position lanes are ${laneText(canonicalSequence, 0)} and ${laneText(canonicalSequence, 1)}.`);
      break;
    }
    case "ALTERNATING_MULTIPLICATIVE_RATIOS": {
      const ratios = canonicalSequence.slice(1).map((value, index) => value / canonicalSequence[index]!);
      working.push(`The successive multipliers begin ×${ratios.slice(0, 6).join(", ×")} and repeat in pairs.`);
      working.push(`The alternate-position lanes are ${laneText(canonicalSequence, 0)} and ${laneText(canonicalSequence, 1)}.`);
      break;
    }
    case "TWO_INTERLEAVED_ARITHMETIC":
    case "TWO_INTERLEAVED_GEOMETRIC":
    case "INTERLEAVED_ARITHMETIC_GEOMETRIC":
      working.push(`Odd positions form: ${laneText(canonicalSequence, 0)}.`);
      working.push(`Even positions form: ${laneText(canonicalSequence, 1)}.`);
      break;
    case "ALTERNATING_ADD_THEN_MULTIPLY":
    case "ALTERNATING_MULTIPLY_THEN_ADD":
    case "PROGRESSIVE_MULTIPLY_PLUS_ADD":
    case "PROGRESSIVE_ADD_THEN_MULTIPLY_CYCLES":
    case "PROGRESSIVE_MULTIPLY_THEN_ADD_CYCLES":
      working.push(`Applying the operation chain to the correct series gives ${canonicalSequence.join(", ")}.`);
      working.push(`The term at position ${targetIndex + 1} must therefore be ${correctReplacement}.`);
      break;
  }
  if (taskKind === "WRONG_TERM") {
    working.push(
      `At position ${targetIndex + 1}, the rule requires ${correctReplacement}, not ${displayed[targetIndex]}.`,
    );
  } else if (!working.some((line) => line.includes(`position ${targetIndex + 1}`))) {
    working.push(`So the blank at position ${targetIndex + 1} is ${correctReplacement}.`);
  }
  return working;
}

function buildOptions(
  correctAnswer: number,
  correctReplacement: number,
  canonicalSequence: readonly number[],
  targetIndex: number,
  correctIndex: number,
): number[] {
  const distractors: number[] = [];
  const add = (value: number): void => {
    if (
      Number.isSafeInteger(value)
      && value !== correctAnswer
      && !distractors.includes(value)
    ) {
      distractors.push(value);
    }
  };
  add(correctReplacement);
  add(canonicalSequence[Math.max(0, targetIndex - 2)]!);
  add(canonicalSequence[Math.max(0, targetIndex - 1)]!);
  add(canonicalSequence[Math.min(canonicalSequence.length - 1, targetIndex + 1)]!);
  add(canonicalSequence[Math.min(canonicalSequence.length - 1, targetIndex + 2)]!);
  add(correctAnswer - 1);
  add(correctAnswer + 1);
  add(correctAnswer - 2);
  add(correctAnswer + 2);
  let offset = 3;
  while (distractors.length < 3) {
    add(correctAnswer + offset);
    add(correctAnswer - offset);
    offset += 1;
  }
  const options = distractors.slice(0, 3);
  options.splice(correctIndex, 0, correctAnswer);
  return options;
}

function trapAnalyses(
  options: readonly number[],
  correctIndex: number,
  correctAnswer: number,
  taskKind: SerCp005TaskKind,
  correctReplacement: number,
  sequence: readonly (number | null)[],
): string[] {
  return options
    .map((value, index) => ({ value, index }))
    .filter(({ index }) => index !== correctIndex)
    .map(({ value, index }) => {
      const label = `Option ${String.fromCharCode(65 + index)} (${value})`;
      if (taskKind === "WRONG_TERM") {
        if (value === correctReplacement) {
          return `${label} is the correction for the faulty position, but the question asks for the wrong displayed term.`;
        }
        if (sequence.includes(value)) {
          return `${label} is displayed but remains consistent with its own alternating lane or operation step.`;
        }
        return `${label} is not the displayed value that breaks the complete pattern.`;
      }
      if (sequence.includes(value)) {
        return `${label} copies a visible term instead of continuing the required lane or operation phase.`;
      }
      if (value === correctAnswer - 1) return `${label} is one less than the complete rule gives.`;
      if (value === correctAnswer + 1) return `${label} is one more than the complete rule gives.`;
      return `${label} does not satisfy both alternating lanes or the full composite operation chain.`;
    });
}

export function generateSerCp005Question(
  temporaryTemplateId: SerCp005TemporaryTemplateId,
  seed: number,
): SerCp005Question {
  assertPositiveSeed(seed);
  const template = templateFor(temporaryTemplateId);
  const templateIndex = SER_CP005_TEMPORARY_TEMPLATE_IDS.indexOf(temporaryTemplateId);
  const difficulty = difficultyFor(seed, templateIndex);

  for (let attempt = 0; attempt < 320; attempt += 1) {
    const mixedSeed =
      (Math.imul(seed, 0x9e3779b1)
        ^ Math.imul(templateIndex + 1, 0x85ebca6b)
        ^ Math.imul(attempt + 1, 0xc2b2ae35)) >>> 0;
    const next = createPrng(mixedSeed || 1);
    const generated = generateCanonical(template.sourceRuleId, difficulty, next);
    const canonicalSequence = [...generated.sequence];
    if (
      !isSafeSequence(canonicalSequence)
      || canonicalSequence.some((value) => value <= 0)
      || new Set(canonicalSequence).size < canonicalSequence.length - 1
    ) {
      continue;
    }

    const targetIndex = targetIndexFor(template.taskKind, canonicalSequence.length, next);
    const sequence: (number | null)[] = [...canonicalSequence];
    let corruptedValue: number | null = null;
    if (template.taskKind === "WRONG_TERM") {
      corruptedValue = makeCorruptedValue(canonicalSequence, targetIndex, next);
      sequence[targetIndex] = corruptedValue;
    } else {
      sequence[targetIndex] = null;
    }

    let independent: SerCp005IndependentSolution;
    try {
      independent = solveSerCp005Sequence(template.taskKind, sequence);
    } catch {
      continue;
    }
    if (
      independent.canonicalAuthorityId !== template.canonicalAuthorityId
      || independent.targetIndex !== targetIndex
      || !independent.representationRuleIds.includes(template.sourceRuleId)
    ) {
      continue;
    }

    const correctAnswer = independent.answer;
    const correctIndex = (seed + templateIndex) % 4;
    const options = buildOptions(
      correctAnswer,
      independent.correctReplacement,
      canonicalSequence,
      targetIndex,
      correctIndex,
    );
    if (new Set(options).size !== 4 || options[correctIndex] !== correctAnswer) continue;

    const hiddenState: SerCp005HiddenState = {
      parameterKey: generated.parameterKey,
      canonicalSequence,
      targetIndex,
      corruptedValue,
      correctReplacement: independent.correctReplacement,
      independentRepresentationRuleIds: independent.representationRuleIds,
    };
    const explanation: SerCp005Explanation = {
      ruleStatement: ruleStatementFor(
        template.sourceRuleId,
        template.canonicalAuthorityId,
      ),
      working: workingFor(
        template.sourceRuleId,
        template.taskKind,
        sequence,
        hiddenState,
      ),
      conclusion:
        template.taskKind === "WRONG_TERM"
          ? `${correctAnswer} is the incorrect displayed term; it should be ${independent.correctReplacement}.`
          : `The required term is ${correctAnswer}.`,
      trapAnalyses: trapAnalyses(
        options,
        correctIndex,
        correctAnswer,
        template.taskKind,
        independent.correctReplacement,
        sequence,
      ),
    };

    return {
      questionId: `${temporaryTemplateId}-SEED-${seed}`,
      packageId: "SER-001",
      checkpointId: "SER-CP-005",
      temporaryTemplateId,
      permanentQlId: null,
      sourceRuleId: template.sourceRuleId,
      canonicalAuthorityId: template.canonicalAuthorityId,
      taskKind: template.taskKind,
      solveMode: "INFER_ALTERNATING_INTERLEAVED_OR_COMPOSITE_SEQUENCE",
      answerSemantic: template.answerSemantic,
      ownershipDisposition: template.ownershipDisposition,
      language: "en-IN",
      difficulty,
      seed,
      stem: stemFor(template.taskKind),
      sequence,
      options,
      correctAnswer,
      correctIndex,
      mathematicalFingerprint: [
        template.sourceRuleId,
        template.canonicalAuthorityId,
        generated.parameterKey,
        template.taskKind,
        canonicalSequence.join(","),
        `target=${targetIndex}`,
        `corrupted=${corruptedValue ?? "none"}`,
      ].join("|"),
      explanation,
      hiddenState,
      lifecycle: {
        maturity: "OPEN_EXECUTABLE_DISCOVERY",
        sourceSaturation: "OPEN",
        active: false,
        questionStudioDiscoverable: false,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
      },
    };
  }

  throw new Error(
    `SER-CP-005 could not generate an unambiguous question for ${temporaryTemplateId} seed ${seed}`,
  );
}

function renderSequence(sequence: readonly (number | null)[]): string {
  return sequence.map((value) => (value == null ? "___" : String(value))).join(", ");
}

export function renderSerCp005Review(question: SerCp005Question): string {
  return [
    `## ${question.temporaryTemplateId} / seed ${question.seed}`,
    "",
    `- Source-shaped rule: ${question.sourceRuleId}`,
    `- Canonical authority: ${question.canonicalAuthorityId}`,
    `- Task: ${question.taskKind}`,
    `- Difficulty: ${question.difficulty}`,
    `- Ownership disposition: ${question.ownershipDisposition}`,
    `- Independent representations: ${question.hiddenState.independentRepresentationRuleIds.join(", ")}`,
    "",
    question.stem,
    "",
    `**Series:** ${renderSequence(question.sequence)}`,
    "",
    ...question.options.map((value, index) => `${String.fromCharCode(65 + index)}. ${value}`),
    "",
    `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.correctAnswer}`,
    "",
    `**Rule:** ${question.explanation.ruleStatement}`,
    "",
    ...question.explanation.working.map((line, index) => `${index + 1}. ${line}`),
    "",
    `**Conclusion:** ${question.explanation.conclusion}`,
    "",
    "**Option checks:**",
    ...question.explanation.trapAnalyses.map((line) => `- ${line}`),
  ].join("\n");
}
