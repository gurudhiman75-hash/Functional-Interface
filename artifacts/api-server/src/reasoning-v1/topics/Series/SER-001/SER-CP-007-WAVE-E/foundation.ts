export const SER_CP007_WAVE_E_SOURCE_RULE_IDS = [
  "SINGLE_MARKER_FIXED_STEP",
  "MARKER_BLOCK_FIXED_STEP",
  "CASE_STATE_MARKER_OVER_PERIODIC_FRAME",
  "MARKER_SHIFT_WITH_FIXED_EDGE_TOKEN",
  "MARKER_SHIFT_OVER_PERIODIC_BACKGROUND",
  "UNIFORM_FRAME_CASE_MARKER_ROTATION",
  "PROGRESSIVE_PREFIX_SUBSTITUTION",
  "PROGRESSIVE_SUFFIX_SUBSTITUTION",
  "MOVING_PATTERN_BOUNDARY",
] as const;

export type SerCp007WaveESourceRuleId =
  (typeof SER_CP007_WAVE_E_SOURCE_RULE_IDS)[number];

export const SER_CP007_WAVE_E_AUTHORITY_IDS = [
  "MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME",
  "PROGRESSIVE_POSITIONAL_SUBSTITUTION",
  "CYCLIC_CLUSTER_PERMUTATION",
] as const;

export type SerCp007WaveEAuthorityId =
  (typeof SER_CP007_WAVE_E_AUTHORITY_IDS)[number];

export type SerCp007WaveETaskKind =
  | "NEXT_TERM"
  | "MISSING_TERM"
  | "PREVIOUS_TERM"
  | "WRONG_TERM";

export type SerCp007WaveEDisposition =
  | "PROVISIONAL_RETAIN_CP007"
  | "COLLIDE_EXISTING_CP007_AUTHORITY";

export type SerCp007WaveETemporaryTemplateId = `SER-CP-007-WE-TMP-${string}`;
export type SerCp007WaveEDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface SerCp007WaveETemplate {
  readonly temporaryTemplateId: SerCp007WaveETemporaryTemplateId;
  readonly sourceRuleId: SerCp007WaveESourceRuleId;
  readonly canonicalAuthorityId: SerCp007WaveEAuthorityId;
  readonly ownershipDisposition: SerCp007WaveEDisposition;
  readonly taskKind: SerCp007WaveETaskKind;
}

const TASKS = [
  "NEXT_TERM",
  "MISSING_TERM",
  "PREVIOUS_TERM",
  "WRONG_TERM",
] as const satisfies readonly SerCp007WaveETaskKind[];

function ownershipFor(
  sourceRuleId: SerCp007WaveESourceRuleId,
): Pick<
  SerCp007WaveETemplate,
  "canonicalAuthorityId" | "ownershipDisposition"
> {
  switch (sourceRuleId) {
    case "SINGLE_MARKER_FIXED_STEP":
    case "MARKER_BLOCK_FIXED_STEP":
    case "CASE_STATE_MARKER_OVER_PERIODIC_FRAME":
    case "MARKER_SHIFT_WITH_FIXED_EDGE_TOKEN":
    case "MARKER_SHIFT_OVER_PERIODIC_BACKGROUND":
      return {
        canonicalAuthorityId:
          "MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP007",
      };
    case "UNIFORM_FRAME_CASE_MARKER_ROTATION":
      return {
        canonicalAuthorityId: "CYCLIC_CLUSTER_PERMUTATION",
        ownershipDisposition: "COLLIDE_EXISTING_CP007_AUTHORITY",
      };
    case "PROGRESSIVE_PREFIX_SUBSTITUTION":
    case "PROGRESSIVE_SUFFIX_SUBSTITUTION":
    case "MOVING_PATTERN_BOUNDARY":
      return {
        canonicalAuthorityId: "PROGRESSIVE_POSITIONAL_SUBSTITUTION",
        ownershipDisposition: "PROVISIONAL_RETAIN_CP007",
      };
  }
}

const templateRows: Omit<SerCp007WaveETemplate, "temporaryTemplateId">[] = [];
for (const sourceRuleId of SER_CP007_WAVE_E_SOURCE_RULE_IDS) {
  for (const taskKind of TASKS) {
    templateRows.push({ sourceRuleId, taskKind, ...ownershipFor(sourceRuleId) });
  }
}

export const SER_CP007_WAVE_E_TEMPORARY_TEMPLATE_IDS = templateRows.map(
  (_, index) =>
    `SER-CP-007-WE-TMP-${String(index + 1).padStart(3, "0")}`,
) as readonly SerCp007WaveETemporaryTemplateId[];

export const SER_CP007_WAVE_E_TEMPORARY_TEMPLATES: readonly SerCp007WaveETemplate[] =
  templateRows.map((row, index) => ({
    temporaryTemplateId: SER_CP007_WAVE_E_TEMPORARY_TEMPLATE_IDS[index]!,
    ...row,
  }));

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const TERM_COUNT = 7;

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
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

function pick<T>(next: () => number, values: readonly T[]): T {
  return values[integer(next, 0, values.length - 1)]!;
}

function distinctUppercase(
  next: () => number,
  count: number,
  forbidden: ReadonlySet<string> = new Set(),
): readonly string[] {
  const output: string[] = [];
  let guard = 0;
  while (output.length < count) {
    const letter = ALPHABET[integer(next, 0, 25)]!;
    if (!forbidden.has(letter) && !output.includes(letter)) output.push(letter);
    guard += 1;
    if (guard > 500) throw new Error("Unable to choose distinct letters.");
  }
  return output;
}

function repeatedFrame(period: readonly string[], width: number): string {
  return Array.from({ length: width }, (_, index) => period[index % period.length]!).join("");
}

function overlay(frame: string, marker: string, position: number): string {
  return frame.slice(0, position) + marker + frame.slice(position + marker.length);
}

function rotateLeft(token: string, amount: number): string {
  const safe = mod(amount, token.length);
  return token.slice(safe) + token.slice(0, safe);
}

function letterRank(character: string): number | null {
  if (!/^[A-Z]$/.test(character)) return null;
  return ALPHABET.indexOf(character);
}

function hasConstantRotation(terms: readonly string[]): boolean {
  if (terms.length < 2 || new Set(terms.map((term) => term.length)).size !== 1) {
    return false;
  }
  const width = terms[0]!.length;
  for (let amount = 1; amount < width; amount += 1) {
    if (
      terms.slice(0, -1).every(
        (term, index) => rotateLeft(term, amount) === terms[index + 1],
      )
    ) {
      return true;
    }
  }
  return false;
}

function hasFixedPositionPermutation(terms: readonly string[]): boolean {
  if (terms.length < 2 || new Set(terms.map((term) => term.length)).size !== 1) {
    return false;
  }
  const width = terms[0]!.length;
  const candidates = Array.from({ length: width }, (_, outputIndex) =>
    Array.from({ length: width }, (_, inputIndex) => inputIndex).filter(
      (inputIndex) =>
        terms.slice(0, -1).every(
          (term, transitionIndex) =>
            term[inputIndex] === terms[transitionIndex + 1]![outputIndex],
        ),
    ),
  );
  const inputToOutput = Array<number | null>(width).fill(null);
  const visit = (outputIndex: number, seen: Set<number>): boolean => {
    for (const inputIndex of candidates[outputIndex]!) {
      if (seen.has(inputIndex)) continue;
      seen.add(inputIndex);
      const previousOutput = inputToOutput[inputIndex];
      if (previousOutput === null || visit(previousOutput, seen)) {
        inputToOutput[inputIndex] = outputIndex;
        return true;
      }
    }
    return false;
  };
  return Array.from({ length: width }, (_, outputIndex) => outputIndex).every(
    (outputIndex) => visit(outputIndex, new Set()),
  );
}

function hasColumnwiseFixedMovement(terms: readonly string[]): boolean {
  if (terms.length < 3 || new Set(terms.map((term) => term.length)).size !== 1) {
    return false;
  }
  const width = terms[0]!.length;
  for (let column = 0; column < width; column += 1) {
    const differences: number[] = [];
    for (let index = 0; index < terms.length - 1; index += 1) {
      const from = letterRank(terms[index]![column]!);
      const to = letterRank(terms[index + 1]![column]!);
      if (from === null || to === null) return false;
      differences.push(mod(to - from, 26));
    }
    if (new Set(differences).size !== 1) return false;
  }
  return true;
}

function mutateToken(token: string, seed: number): string {
  const characters = [...token];
  const index = mod(seed, characters.length);
  const character = characters[index]!;
  if (/^[a-z]$/.test(character)) {
    const rank = character.charCodeAt(0) - 97;
    characters[index] = String.fromCharCode(97 + mod(rank + 1 + mod(seed, 3), 26));
  } else if (/^[A-Z]$/.test(character)) {
    const rank = character.charCodeAt(0) - 65;
    characters[index] = String.fromCharCode(65 + mod(rank + 1 + mod(seed, 3), 26));
  } else {
    characters[index] = character === "0" ? "1" : "0";
  }
  return characters.join("");
}

interface GeneratedWaveEFamily {
  readonly familyKind: "MARKER" | "SUBSTITUTION";
  readonly terms: readonly string[];
  readonly parameterKey: string;
  readonly rule: string;
  readonly steps: readonly string[];
  readonly quickMethod: string;
  readonly commonMistake: string;
  readonly trapCode: string;
  readonly backgroundFrame: string;
  readonly marker: string;
  readonly markerPositions: readonly number[];
  readonly step: number;
  readonly direction: 1 | -1;
  readonly wrap: boolean;
  readonly sourceFrame: string;
  readonly targetFrame: string;
  readonly boundaryPositions: readonly number[];
  readonly substitutionSide: "PREFIX" | "SUFFIX" | "NONE";
}

function markerRuleText(
  marker: string,
  step: number,
  direction: 1 | -1,
  wrap: boolean,
): string {
  return `Keep the background pattern fixed. Move the marker ${marker} ${step} place${step === 1 ? "" : "s"} ${direction === 1 ? "to the right" : "to the left"} each time${wrap ? ", continuing from the other end when it crosses the boundary" : ""}.`;
}

function makeMarkerFamily(
  sourceRuleId: SerCp007WaveESourceRuleId,
  seed: number,
  attempt: number,
): GeneratedWaveEFamily {
  const sourceIndex = SER_CP007_WAVE_E_SOURCE_RULE_IDS.indexOf(sourceRuleId);
  const next = createPrng(seed * 104729 + sourceIndex * 130363 + attempt * 15485863 + 17);

  if (sourceRuleId === "UNIFORM_FRAME_CASE_MARKER_ROTATION") {
    const width = integer(next, 8, 12);
    const backgroundFrame = "X".repeat(width);
    const marker = "x";
    const start = integer(next, 0, width - 1);
    const direction = pick(next, [1, -1] as const);
    const markerPositions = Array.from(
      { length: TERM_COUNT },
      (_, index) => mod(start + direction * index, width),
    );
    const terms = markerPositions.map((position) =>
      overlay(backgroundFrame, marker, position),
    );
    return {
      familyKind: "MARKER",
      terms,
      parameterKey: `uniform-X|${marker}|${markerPositions.join(".")}`,
      rule: markerRuleText(marker, 1, direction, true),
      steps: terms.slice(0, -1).map(
        (term, index) =>
          `${term} → ${terms[index + 1]}: the lowercase marker moves from place ${markerPositions[index]! + 1} to place ${markerPositions[index + 1]! + 1}.`,
      ),
      quickMethod: "Track the lowercase letter only; all uppercase X letters are identical.",
      commonMistake: "Rotating the whole group gives the same result, so do not treat this as a different rule.",
      trapCode: "DUPLICATE_MARKER_AUTHORITY",
      backgroundFrame,
      marker,
      markerPositions,
      step: 1,
      direction,
      wrap: true,
      sourceFrame: "",
      targetFrame: "",
      boundaryPositions: [],
      substitutionSide: "NONE",
    };
  }

  const markerWidth =
    sourceRuleId === "MARKER_BLOCK_FIXED_STEP" ? integer(next, 2, 3) :
    sourceRuleId === "MARKER_SHIFT_OVER_PERIODIC_BACKGROUND" ? integer(next, 1, 2) : 1;
  const periodLength =
    sourceRuleId === "CASE_STATE_MARKER_OVER_PERIODIC_FRAME" ? 3 :
    sourceRuleId === "MARKER_SHIFT_OVER_PERIODIC_BACKGROUND" ? integer(next, 2, 3) : 2;
  const period = distinctUppercase(next, periodLength);
  const periodSet = new Set(period);
  const fixedEdge = sourceRuleId === "MARKER_SHIFT_WITH_FIXED_EDGE_TOKEN";
  const wrap = fixedEdge ? false : next() < 0.55;
  const step = sourceRuleId === "MARKER_BLOCK_FIXED_STEP" ? integer(next, 1, 2) : integer(next, 1, 3);
  const direction = pick(next, [1, -1] as const);
  const protectedEachSide = fixedEdge ? 1 : 0;
  const travel = step * (TERM_COUNT - 1);
  const width = wrap
    ? integer(next, 12 + markerWidth, 17 + markerWidth)
    : travel + markerWidth + protectedEachSide * 2 + integer(next, 2, 5);
  const minimumPosition = protectedEachSide;
  const maximumPosition = width - markerWidth - protectedEachSide;
  const domainLength = maximumPosition - minimumPosition + 1;

  let start: number;
  if (wrap) {
    start = integer(next, minimumPosition, maximumPosition);
  } else if (direction === 1) {
    const maximumStart = maximumPosition - travel;
    start = integer(next, minimumPosition, Math.max(minimumPosition, maximumStart));
  } else {
    const minimumStart = minimumPosition + travel;
    start = integer(next, Math.min(maximumPosition, minimumStart), maximumPosition);
  }

  const markerPositions = Array.from({ length: TERM_COUNT }, (_, index) => {
    const raw = start + direction * step * index;
    return wrap ? minimumPosition + mod(raw - minimumPosition, domainLength) : raw;
  });

  let backgroundFrame = repeatedFrame(period, width);
  if (fixedEdge) {
    const edges = distinctUppercase(next, 2, periodSet);
    backgroundFrame = edges[0]! + backgroundFrame.slice(1, -1) + edges[1]!;
  }

  let marker: string;
  if (sourceRuleId === "CASE_STATE_MARKER_OVER_PERIODIC_FRAME") {
    marker = period[integer(next, 0, period.length - 1)]!.toLowerCase();
  } else if (markerWidth > 1 && next() < 0.5) {
    const markerLetter = distinctUppercase(next, 1, new Set([...periodSet, backgroundFrame[0], backgroundFrame.at(-1)!]))[0]!;
    marker = markerLetter.repeat(markerWidth);
  } else {
    marker = distinctUppercase(
      next,
      markerWidth,
      new Set([...periodSet, backgroundFrame[0], backgroundFrame.at(-1)!]),
    ).join("");
  }

  const terms = markerPositions.map((position) => overlay(backgroundFrame, marker, position));
  const rule = markerRuleText(marker, step, direction, wrap);
  const steps = terms.slice(0, -1).map(
    (term, index) =>
      `${term} → ${terms[index + 1]}: ${marker} moves from place ${markerPositions[index]! + 1} to place ${markerPositions[index + 1]! + 1}; the remaining letters return to the background frame.`,
  );

  return {
    familyKind: "MARKER",
    terms,
    parameterKey: [
      backgroundFrame,
      marker,
      markerPositions.join("."),
      `step:${step}`,
      `direction:${direction}`,
      `wrap:${wrap}`,
    ].join("|"),
    rule,
    steps,
    quickMethod: `First locate ${marker} in each term. Its positions are ${markerPositions.map((position) => position + 1).join(", ")}.`,
    commonMistake: "Do not rotate the complete term. After moving the marker, rebuild every uncovered place from the background pattern.",
    trapCode: "WHOLE_TERM_ROTATED",
    backgroundFrame,
    marker,
    markerPositions,
    step,
    direction,
    wrap,
    sourceFrame: "",
    targetFrame: "",
    boundaryPositions: [],
    substitutionSide: "NONE",
  };
}

function makeSubstitutionFamily(
  sourceRuleId: SerCp007WaveESourceRuleId,
  seed: number,
  attempt: number,
): GeneratedWaveEFamily {
  const sourceIndex = SER_CP007_WAVE_E_SOURCE_RULE_IDS.indexOf(sourceRuleId);
  const next = createPrng(seed * 130363 + sourceIndex * 196613 + attempt * 32452843 + 43);
  const sourcePeriodLength = integer(next, 2, 3);
  const sourcePeriod = distinctUppercase(next, sourcePeriodLength);
  const targetPeriodLength =
    sourceRuleId === "MOVING_PATTERN_BOUNDARY" ? integer(next, 2, 3) : sourcePeriodLength;
  const targetPeriod = distinctUppercase(next, targetPeriodLength, new Set(sourcePeriod));
  const step = integer(next, 1, 2);
  const initialConverted = integer(next, 0, 1);
  const width = initialConverted + step * (TERM_COUNT - 1) + integer(next, 3, 6);
  const sourceFrame = repeatedFrame(sourcePeriod, width);
  const targetFrame = repeatedFrame(targetPeriod, width);
  const substitutionSide =
    sourceRuleId === "PROGRESSIVE_PREFIX_SUBSTITUTION" ? "PREFIX" :
    sourceRuleId === "PROGRESSIVE_SUFFIX_SUBSTITUTION" ? "SUFFIX" :
    pick(next, ["PREFIX", "SUFFIX"] as const);
  const boundaryPositions = Array.from(
    { length: TERM_COUNT },
    (_, index) => initialConverted + step * index,
  );
  const terms = boundaryPositions.map((converted) =>
    Array.from({ length: width }, (_, index) => {
      const useTarget =
        substitutionSide === "PREFIX"
          ? index < converted
          : index >= width - converted;
      return useTarget ? targetFrame[index]! : sourceFrame[index]!;
    }).join(""),
  );
  const sideText = substitutionSide === "PREFIX" ? "left" : "right";
  const rule = `Keep the term length fixed. At every step, change ${step} more position${step === 1 ? "" : "s"} from the old repeating pattern to the new repeating pattern, starting from the ${sideText}.`;
  const steps = terms.slice(0, -1).map(
    (term, index) =>
      `${term} → ${terms[index + 1]}: the changed ${sideText}-side section grows from ${boundaryPositions[index]} to ${boundaryPositions[index + 1]} places.`,
  );
  return {
    familyKind: "SUBSTITUTION",
    terms,
    parameterKey: [
      sourceFrame,
      targetFrame,
      substitutionSide,
      boundaryPositions.join("."),
      `step:${step}`,
    ].join("|"),
    rule,
    steps,
    quickMethod: `Mark the boundary between the old and new patterns. It moves ${step} place${step === 1 ? "" : "s"} toward the ${substitutionSide === "PREFIX" ? "right" : "left"} each time.`,
    commonMistake: "Do not treat the group as growing. Its length stays fixed; existing positions are replaced.",
    trapCode: "FIXED_WIDTH_MISTAKEN_FOR_GROWTH",
    backgroundFrame: "",
    marker: "",
    markerPositions: [],
    step,
    direction: substitutionSide === "PREFIX" ? 1 : -1,
    wrap: false,
    sourceFrame,
    targetFrame,
    boundaryPositions,
    substitutionSide,
  };
}

function generateFamily(
  sourceRuleId: SerCp007WaveESourceRuleId,
  seed: number,
): GeneratedWaveEFamily {
  const isSubstitution =
    sourceRuleId === "PROGRESSIVE_PREFIX_SUBSTITUTION" ||
    sourceRuleId === "PROGRESSIVE_SUFFIX_SUBSTITUTION" ||
    sourceRuleId === "MOVING_PATTERN_BOUNDARY";

  for (let attempt = 0; attempt < 80; attempt += 1) {
    const family = isSubstitution
      ? makeSubstitutionFamily(sourceRuleId, seed, attempt)
      : makeMarkerFamily(sourceRuleId, seed, attempt);

    if (sourceRuleId === "UNIFORM_FRAME_CASE_MARKER_ROTATION") {
      if (hasConstantRotation(family.terms) && hasFixedPositionPermutation(family.terms)) {
        return family;
      }
      continue;
    }

    if (
      !hasConstantRotation(family.terms) &&
      !hasFixedPositionPermutation(family.terms) &&
      !hasColumnwiseFixedMovement(family.terms)
    ) {
      return family;
    }
  }
  throw new Error(`Unable to generate a collision-safe Wave E family for ${sourceRuleId}.`);
}

function templateFor(
  temporaryTemplateId: SerCp007WaveETemporaryTemplateId,
): SerCp007WaveETemplate {
  const template = SER_CP007_WAVE_E_TEMPORARY_TEMPLATES.find(
    (entry) => entry.temporaryTemplateId === temporaryTemplateId,
  );
  if (!template) throw new Error(`Unknown Wave E template ${temporaryTemplateId}`);
  return template;
}

function optionCandidates(
  correctAnswer: string,
  family: GeneratedWaveEFamily,
  answerIndex: number,
  seed: number,
): readonly string[] {
  const candidates = [
    correctAnswer,
    family.terms[Math.max(0, answerIndex - 1)]!,
    family.terms[Math.min(family.terms.length - 1, answerIndex + 1)]!,
    mutateToken(correctAnswer, seed),
    rotateLeft(correctAnswer, 1),
    [...correctAnswer].reverse().join(""),
  ];
  const unique = [...new Set(candidates)];
  let offset = 1;
  while (unique.length < 4) {
    const candidate = mutateToken(correctAnswer, seed + offset * 17);
    if (!unique.includes(candidate)) unique.push(candidate);
    offset += 1;
  }
  return unique;
}

function buildOptions(
  correctAnswer: string,
  family: GeneratedWaveEFamily,
  answerIndex: number,
  seed: number,
  correctIndex: number,
): readonly string[] {
  const distractors = optionCandidates(correctAnswer, family, answerIndex, seed)
    .filter((candidate) => candidate !== correctAnswer)
    .slice(0, 3);
  const options = [...distractors];
  options.splice(correctIndex, 0, correctAnswer);
  return options;
}

function stemFor(
  taskKind: SerCp007WaveETaskKind,
  sequence: readonly (string | null)[],
): string {
  const rendered = sequence.map((term) => term ?? "?").join(", ");
  switch (taskKind) {
    case "NEXT_TERM":
      return `Which letter group should come next?\n${rendered}, ?`;
    case "MISSING_TERM":
      return `Which letter group should replace the question mark?\n${rendered}`;
    case "PREVIOUS_TERM":
      return `Which letter group should come immediately before the given series?\n?, ${rendered}`;
    case "WRONG_TERM":
      return `Which letter group should replace the incorrectly placed group?\n${rendered}`;
  }
}

export interface SerCp007WaveEQuestion {
  readonly questionId: string;
  readonly packageId: "SER-001";
  readonly checkpointId: "SER-CP-007";
  readonly waveId: "SER-CP-007-WAVE-E";
  readonly temporaryTemplateId: SerCp007WaveETemporaryTemplateId;
  readonly permanentQlId: null;
  readonly sourceRuleId: SerCp007WaveESourceRuleId;
  readonly canonicalAuthorityId: SerCp007WaveEAuthorityId;
  readonly ownershipDisposition: SerCp007WaveEDisposition;
  readonly taskKind: SerCp007WaveETaskKind;
  readonly solveMode: "INFER_MARKER_MOTION_OR_POSITIONAL_SUBSTITUTION";
  readonly language: "en-IN";
  readonly difficulty: SerCp007WaveEDifficulty;
  readonly seed: number;
  readonly stem: string;
  readonly sequence: readonly (string | null)[];
  readonly options: readonly string[];
  readonly correctAnswer: string;
  readonly correctIndex: number;
  readonly mathematicalFingerprint: string;
  readonly explanation: {
    readonly rule: string;
    readonly steps: readonly string[];
    readonly quickMethod: string;
    readonly commonMistake: string;
    readonly trapCode: string;
    readonly conclusion: string;
  };
  readonly hiddenState: {
    readonly familyKind: "MARKER" | "SUBSTITUTION";
    readonly parameterKey: string;
    readonly canonicalTerms: readonly string[];
    readonly answerIndex: number;
    readonly corruptedIndex: number | null;
    readonly displayedWrongTerm: string | null;
    readonly backgroundFrame: string;
    readonly marker: string;
    readonly markerPositions: readonly number[];
    readonly step: number;
    readonly direction: 1 | -1;
    readonly wrap: boolean;
    readonly sourceFrame: string;
    readonly targetFrame: string;
    readonly boundaryPositions: readonly number[];
    readonly substitutionSide: "PREFIX" | "SUFFIX" | "NONE";
  };
  readonly ownershipBoundary: {
    readonly minimumTermWidth: 2;
    readonly fixedTermWidth: true;
    readonly autonomousSequence: true;
    readonly explicitInputOutputMapping: false;
    readonly pairRelationTransfer: false;
    readonly classifyIndependentOptions: false;
  };
  readonly lifecycleLocks: {
    readonly questionStudioVisible: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
    readonly localizationStarted: false;
  };
}

export function generateSerCp007WaveEQuestion(
  temporaryTemplateId: SerCp007WaveETemporaryTemplateId,
  seed: number,
): SerCp007WaveEQuestion {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  const template = templateFor(temporaryTemplateId);
  const templateIndex = SER_CP007_WAVE_E_TEMPORARY_TEMPLATE_IDS.indexOf(
    temporaryTemplateId,
  );
  const family = generateFamily(template.sourceRuleId, seed);
  const terms = family.terms;
  const displayLength = terms.length - 1;
  const correctIndex = (seed + templateIndex) % 4;

  let sequence: readonly (string | null)[];
  let answerIndex: number;
  let corruptedIndex: number | null = null;
  let displayedWrongTerm: string | null = null;

  switch (template.taskKind) {
    case "NEXT_TERM":
      sequence = terms.slice(0, displayLength);
      answerIndex = displayLength;
      break;
    case "MISSING_TERM": {
      answerIndex = 2 + mod(seed + templateIndex, Math.max(1, displayLength - 3));
      sequence = terms.slice(0, displayLength).map((term, index) =>
        index === answerIndex ? null : term,
      );
      break;
    }
    case "PREVIOUS_TERM":
      sequence = terms.slice(1);
      answerIndex = 0;
      break;
    case "WRONG_TERM": {
      corruptedIndex = 2 + mod(seed + templateIndex, Math.max(1, displayLength - 3));
      const displayed = [...terms.slice(0, displayLength)];
      displayedWrongTerm = mutateToken(displayed[corruptedIndex]!, seed + templateIndex * 7);
      displayed[corruptedIndex] = displayedWrongTerm;
      sequence = displayed;
      answerIndex = corruptedIndex;
      break;
    }
  }

  const correctAnswer = terms[answerIndex]!;
  const explanationSteps =
    template.taskKind === "WRONG_TERM"
      ? [
          `First write the correct series: ${terms.slice(0, displayLength).join(", ")}.`,
          ...family.steps.slice(0, 5),
        ]
      : template.taskKind === "PREVIOUS_TERM"
        ? [
            `First check the shown groups: ${terms.slice(1).join(", ")}.`,
            `Now move one step backward using the same rule.`,
            ...family.steps.slice(0, 4),
          ]
        : family.steps;
  const conclusion =
    template.taskKind === "WRONG_TERM"
      ? `${displayedWrongTerm} is wrong at that place. It should be ${correctAnswer}.`
      : `Therefore, the answer is ${correctAnswer}.`;

  return {
    questionId: `${temporaryTemplateId}-${seed}`,
    packageId: "SER-001",
    checkpointId: "SER-CP-007",
    waveId: "SER-CP-007-WAVE-E",
    temporaryTemplateId,
    permanentQlId: null,
    sourceRuleId: template.sourceRuleId,
    canonicalAuthorityId: template.canonicalAuthorityId,
    ownershipDisposition: template.ownershipDisposition,
    taskKind: template.taskKind,
    solveMode: "INFER_MARKER_MOTION_OR_POSITIONAL_SUBSTITUTION",
    language: "en-IN",
    difficulty: (["EASY", "MEDIUM", "HARD"] as const)[
      (seed + templateIndex) % 3
    ]!,
    seed,
    stem: stemFor(template.taskKind, sequence),
    sequence,
    options: buildOptions(
      correctAnswer,
      family,
      answerIndex,
      seed + templateIndex * 61,
      correctIndex,
    ),
    correctAnswer,
    correctIndex,
    mathematicalFingerprint: [
      template.canonicalAuthorityId,
      family.parameterKey,
      template.taskKind,
      answerIndex,
      corruptedIndex ?? "clean",
    ].join("|"),
    explanation: {
      rule: family.rule,
      steps: explanationSteps,
      quickMethod: family.quickMethod,
      commonMistake: family.commonMistake,
      trapCode: family.trapCode,
      conclusion,
    },
    hiddenState: {
      familyKind: family.familyKind,
      parameterKey: family.parameterKey,
      canonicalTerms: terms,
      answerIndex,
      corruptedIndex,
      displayedWrongTerm,
      backgroundFrame: family.backgroundFrame,
      marker: family.marker,
      markerPositions: family.markerPositions,
      step: family.step,
      direction: family.direction,
      wrap: family.wrap,
      sourceFrame: family.sourceFrame,
      targetFrame: family.targetFrame,
      boundaryPositions: family.boundaryPositions,
      substitutionSide: family.substitutionSide,
    },
    ownershipBoundary: {
      minimumTermWidth: 2,
      fixedTermWidth: true,
      autonomousSequence: true,
      explicitInputOutputMapping: false,
      pairRelationTransfer: false,
      classifyIndependentOptions: false,
    },
    lifecycleLocks: {
      questionStudioVisible: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      localizationStarted: false,
    },
  };
}

export const SER_CP007_WAVE_E_OPTION_LABELS = ["1", "2", "3", "4"] as const;

export function renderSerCp007WaveEReview(
  question: SerCp007WaveEQuestion,
): string {
  const options = question.options.map(
    (option, index) =>
      `${index === question.correctIndex ? "✓" : " "} ${SER_CP007_WAVE_E_OPTION_LABELS[index]}. ${option}`,
  );
  return [
    `## ${question.temporaryTemplateId} · seed ${question.seed} · ${question.difficulty}`,
    "",
    question.stem,
    "",
    ...options,
    "",
    `**Answer:** ${SER_CP007_WAVE_E_OPTION_LABELS[question.correctIndex]}. ${question.correctAnswer}`,
    "",
    "📌 **Rule**",
    question.explanation.rule,
    "",
    "📝 **Solution**",
    ...question.explanation.steps.map((step, index) => `${index + 1}. ${step}`),
    `${question.explanation.steps.length + 1}. ${question.explanation.conclusion}`,
    "",
    "⚡ **Quick Method**",
    question.explanation.quickMethod,
    "",
    "⚠️ **Common Mistake**",
    `${question.explanation.commonMistake} [${question.explanation.trapCode}]`,
  ].join("\n");
}
