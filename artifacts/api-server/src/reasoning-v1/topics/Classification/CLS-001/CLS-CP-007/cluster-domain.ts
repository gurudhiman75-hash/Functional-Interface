import type {
  ClsCp007ClusterItem,
  ClsCp007Length,
  ClsCp007PrototypeDefinition,
  ClsCp007RuleId,
} from "./types";

export const CLS_CP007_ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"] as readonly string[];
const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export const CLS_CP007_RULE_IDS: readonly ClsCp007RuleId[] = [
  "CLUSTER_SIGNED_GAP_VECTOR",
  "CLUSTER_ABSOLUTE_GAP_VECTOR",
  "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO",
  "CLUSTER_GAP_EQUALITY_PATTERN",
  "CLUSTER_VOWEL_COUNT",
  "CLUSTER_REPEAT_PATTERN",
  "CLUSTER_POSITION_SUM",
  "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS",
  "CLUSTER_HALF_SUM_DIFFERENCE",
  "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS",
  "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS",
  "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE",
  "CLUSTER_CENTRAL_ABSOLUTE_GAP",
];

const COMMON_RULE_IDS: readonly ClsCp007RuleId[] = [
  "CLUSTER_SIGNED_GAP_VECTOR",
  "CLUSTER_ABSOLUTE_GAP_VECTOR",
  "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO",
  "CLUSTER_GAP_EQUALITY_PATTERN",
  "CLUSTER_VOWEL_COUNT",
  "CLUSTER_REPEAT_PATTERN",
  "CLUSTER_POSITION_SUM",
];

export function clsCp007LetterPosition(letter: string): number {
  if (!/^[A-Z]$/.test(letter)) {
    throw new Error(`CLS-CP-007 requires uppercase Latin letters: ${letter}`);
  }
  return letter.charCodeAt(0) - 64;
}

export function clsCp007LetterFromPosition(position: number): string {
  if (!Number.isInteger(position) || position < 1 || position > 26) {
    throw new Error(`CLS-CP-007 alphabet position is outside 1..26: ${position}`);
  }
  return String.fromCharCode(position + 64);
}

export function clsCp007IsVowel(letter: string): boolean {
  clsCp007LetterPosition(letter);
  return VOWELS.has(letter);
}

export function clsCp007FormatItem(item: ClsCp007ClusterItem): string {
  return item.letters.join("");
}

export function clsCp007ParseOption(option: string): ClsCp007ClusterItem {
  if (!/^[A-Z]{3,5}$/.test(option)) {
    throw new Error(`Invalid CLS-CP-007 cluster option: ${option}`);
  }
  return { kind: "LETTER_CLUSTER", letters: [...option] };
}

export function clsCp007SignedGaps(item: ClsCp007ClusterItem): readonly number[] {
  return item.letters.slice(1).map((letter, index) =>
    clsCp007LetterPosition(letter) - clsCp007LetterPosition(item.letters[index]!),
  );
}

function greatestCommonDivisor(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}

export function clsCp007NormalizedGapRatio(gaps: readonly number[]): readonly number[] {
  const divisor = gaps.reduce((current, gap) => greatestCommonDivisor(current, gap), 0);
  if (divisor === 0) return gaps.map(() => 0);
  return gaps.map((gap) => gap / divisor);
}

function equalityPattern<T>(values: readonly T[]): string {
  const labels = new Map<T, number>();
  let next = 1;
  return values.map((value) => {
    if (!labels.has(value)) {
      labels.set(value, next);
      next += 1;
    }
    return labels.get(value)!;
  }).join("-");
}

export function clsCp007RepeatPattern(item: ClsCp007ClusterItem): string {
  return equalityPattern(item.letters);
}

export function clsCp007GapEqualityPattern(item: ClsCp007ClusterItem): string {
  return equalityPattern(clsCp007SignedGaps(item));
}

export function clsCp007RuleIdsForLength(length: ClsCp007Length): readonly ClsCp007RuleId[] {
  if (length === 3) {
    return [...COMMON_RULE_IDS, "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS"];
  }
  if (length === 4) {
    return [
      ...COMMON_RULE_IDS,
      "CLUSTER_HALF_SUM_DIFFERENCE",
      "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS",
      "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS",
      "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE",
      "CLUSTER_CENTRAL_ABSOLUTE_GAP",
    ];
  }
  return COMMON_RULE_IDS;
}

export function clsCp007RuleValue(
  item: ClsCp007ClusterItem,
  ruleId: ClsCp007RuleId,
): string {
  const length = item.letters.length as ClsCp007Length;
  if (length !== 3 && length !== 4 && length !== 5) {
    throw new Error(`CLS-CP-007 cluster length must be 3, 4 or 5: ${length}`);
  }
  if (!clsCp007RuleIdsForLength(length).includes(ruleId)) {
    throw new Error(`Rule ${ruleId} is incompatible with a ${length}-letter cluster.`);
  }
  const positions = item.letters.map(clsCp007LetterPosition);
  const gaps = clsCp007SignedGaps(item);
  switch (ruleId) {
    case "CLUSTER_SIGNED_GAP_VECTOR":
      return gaps.join(",");
    case "CLUSTER_ABSOLUTE_GAP_VECTOR":
      return gaps.map(Math.abs).join(",");
    case "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO":
      return clsCp007NormalizedGapRatio(gaps).join(",");
    case "CLUSTER_GAP_EQUALITY_PATTERN":
      return clsCp007GapEqualityPattern(item);
    case "CLUSTER_VOWEL_COUNT":
      return String(item.letters.filter(clsCp007IsVowel).length);
    case "CLUSTER_REPEAT_PATTERN":
      return clsCp007RepeatPattern(item);
    case "CLUSTER_POSITION_SUM":
      return String(positions.reduce((total, position) => total + position, 0));
    case "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS":
      return positions[0]! + positions[1]! === positions[2]! ? "MATCH" : "NO_MATCH";
    case "CLUSTER_HALF_SUM_DIFFERENCE":
      return String(Math.abs((positions[0]! + positions[1]!) - (positions[2]! + positions[3]!)));
    case "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS":
      return positions[0]! + positions[2]! === 27 && positions[1]! + positions[3]! === 27
        ? "MATCH"
        : "NO_MATCH";
    case "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS":
      return positions[0]! + positions[1]! === 27 && positions[2]! + positions[3]! === 27
        ? "MATCH"
        : "NO_MATCH";
    case "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE":
      return `${positions[1]! - positions[0]!},${positions[3]! - positions[2]!}`;
    case "CLUSTER_CENTRAL_ABSOLUTE_GAP":
      return String(Math.abs(positions[2]! - positions[1]!));
  }
}

function clusterFromPositions(positions: readonly number[]): string | null {
  if (positions.some((position) => position < 1 || position > 26)) return null;
  return positions.map(clsCp007LetterFromPosition).join("");
}

function addTranslatedGapProfile(target: Set<string>, gaps: readonly number[]): void {
  for (let start = 1; start <= 26; start += 1) {
    const positions = [start];
    for (const gap of gaps) positions.push(positions[positions.length - 1]! + gap);
    const cluster = clusterFromPositions(positions);
    if (cluster) target.add(cluster);
  }
}

function addRepeatControls(target: Set<string>): void {
  const templates: readonly (readonly number[])[] = [
    [0, 0, 1],
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 2, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 1],
    [0, 0, 1, 2],
    [0, 1, 2, 2],
    [0, 1, 2, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 2, 2],
    [0, 1, 2, 3, 0],
  ];
  const multipliers = [3, 5, 7, 9, 11] as const;
  for (const template of templates) {
    for (const multiplier of multipliers) {
      for (let shift = 0; shift < 26; shift += 1) {
        const letters = template.map((symbol) =>
          CLS_CP007_ALPHABET[(shift + symbol * multiplier) % 26]!,
        );
        target.add(letters.join(""));
      }
    }
  }
}

function addOppositePairingControls(target: Set<string>): void {
  for (let first = 1; first <= 26; first += 1) {
    for (let second = 1; second <= 26; second += 1) {
      if (first === second) continue;
      target.add(clusterFromPositions([first, second, 27 - first, 27 - second])!);
      target.add(clusterFromPositions([first, 27 - first, second, 27 - second])!);
    }
  }
}

function addAdjacentPairControls(target: Set<string>): void {
  const gaps = [-4, -3, -2, -1, 1, 2, 3, 4] as const;
  for (const firstGap of gaps) {
    for (const secondGap of gaps) {
      for (let first = 1; first <= 26; first += 1) {
        const second = first + firstGap;
        if (second < 1 || second > 26) continue;
        for (let third = 1; third <= 26; third += 3) {
          const fourth = third + secondGap;
          const cluster = clusterFromPositions([first, second, third, fourth]);
          if (cluster) target.add(cluster);
        }
      }
    }
  }
}

function nextRandom(state: number): number {
  let value = state >>> 0;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return value >>> 0;
}

function addGeneratedControls(target: Set<string>, length: 4 | 5, count: number, salt: number): void {
  let state = (0x6d2b79f5 ^ salt) >>> 0;
  for (let index = 0; index < count; index += 1) {
    const letters: string[] = [];
    for (let position = 0; position < length; position += 1) {
      state = nextRandom(state + index + position * 97 + salt);
      letters.push(CLS_CP007_ALPHABET[state % 26]!);
    }
    target.add(letters.join(""));
  }
}

function buildDomain(): readonly ClsCp007ClusterItem[] {
  const clusters = new Set<string>();

  for (const first of CLS_CP007_ALPHABET) {
    for (const second of CLS_CP007_ALPHABET) {
      for (const third of CLS_CP007_ALPHABET) {
        clusters.add(`${first}${second}${third}`);
      }
    }
  }

  const sourceGapProfiles: readonly (readonly number[])[] = [
    [2, 2],
    [-2, -2],
    [3, 3],
    [-3, -3],
    [3, -4],
    [-4, 3],
    [1, 1, -3],
    [-1, -1, 3],
    [3, 5, 7],
    [-3, -5, -7],
    [1, 6, 1],
    [2, 1, 2],
    [6, -3, 6],
    [4, -2, 4],
    [2, -1, 2],
    [-6, 3, -6],
    [3, 3, 3],
    [-5, -5, -5],
    [2, 2, 2, 2],
    [3, 3, 3, 3],
    [-3, -3, -3, -3],
    [2, -3, 2, -3],
    [-2, 3, -2, 3],
  ];
  sourceGapProfiles.forEach((profile) => addTranslatedGapProfile(clusters, profile));
  addRepeatControls(clusters);
  addOppositePairingControls(clusters);
  addAdjacentPairControls(clusters);
  addGeneratedControls(clusters, 4, 12_000, 407);
  addGeneratedControls(clusters, 5, 14_000, 509);

  return [...clusters]
    .sort()
    .map((cluster) => ({ kind: "LETTER_CLUSTER" as const, letters: [...cluster] }));
}

export const CLS_CP007_DOMAIN: readonly ClsCp007ClusterItem[] = buildDomain();

const DOMAIN_BY_LENGTH = new Map<ClsCp007Length, readonly ClsCp007ClusterItem[]>(
  ([3, 4, 5] as const).map((length) => [
    length,
    CLS_CP007_DOMAIN.filter((item) => item.letters.length === length),
  ]),
);

export function clsCp007DomainForLength(length: ClsCp007Length): readonly ClsCp007ClusterItem[] {
  return DOMAIN_BY_LENGTH.get(length)!;
}

const RULE_GROUP_CACHE = new Map<string, ReadonlyMap<string, readonly ClsCp007ClusterItem[]>>();

export function clsCp007RuleGroups(
  length: ClsCp007Length,
  ruleId: ClsCp007RuleId,
): ReadonlyMap<string, readonly ClsCp007ClusterItem[]> {
  const key = `${length}:${ruleId}`;
  const cached = RULE_GROUP_CACHE.get(key);
  if (cached) return cached;
  const mutable = new Map<string, ClsCp007ClusterItem[]>();
  for (const item of clsCp007DomainForLength(length)) {
    const value = clsCp007RuleValue(item, ruleId);
    const group = mutable.get(value) ?? [];
    group.push(item);
    mutable.set(value, group);
  }
  const frozen = new Map(
    [...mutable.entries()].map(([value, items]) => [value, Object.freeze(items.slice())] as const),
  );
  RULE_GROUP_CACHE.set(key, frozen);
  return frozen;
}

export const CLS_CP007_PROTOTYPES: readonly ClsCp007PrototypeDefinition[] = [
  {
    prototypeId: "CLS-CP007-PROT-001",
    title: "Exact signed adjacent-gap vector outlier",
    task: "FIND_ODD_LETTER_CLUSTER",
    allowedRuleIds: ["CLUSTER_SIGNED_GAP_VECTOR"],
    allowedLengths: [3, 4, 5],
  },
  {
    prototypeId: "CLS-CP007-PROT-002",
    title: "Exact absolute adjacent-gap vector outlier",
    task: "FIND_ODD_LETTER_CLUSTER",
    allowedRuleIds: ["CLUSTER_ABSOLUTE_GAP_VECTOR"],
    allowedLengths: [3, 4, 5],
  },
  {
    prototypeId: "CLS-CP007-PROT-003",
    title: "Normalized signed-gap ratio outlier",
    task: "FIND_ODD_LETTER_CLUSTER",
    allowedRuleIds: ["CLUSTER_NORMALIZED_SIGNED_GAP_RATIO"],
    allowedLengths: [4],
  },
  {
    prototypeId: "CLS-CP007-PROT-004",
    title: "Adjacent-gap equality topology outlier",
    task: "FIND_ODD_LETTER_CLUSTER",
    allowedRuleIds: ["CLUSTER_GAP_EQUALITY_PATTERN"],
    allowedLengths: [3, 4, 5],
  },
  {
    prototypeId: "CLS-CP007-PROT-005",
    title: "Cluster vowel-count outlier",
    task: "FIND_ODD_LETTER_CLUSTER",
    allowedRuleIds: ["CLUSTER_VOWEL_COUNT"],
    allowedLengths: [3, 4, 5],
  },
  {
    prototypeId: "CLS-CP007-PROT-006",
    title: "Repeated-letter topology outlier",
    task: "FIND_ODD_LETTER_CLUSTER",
    allowedRuleIds: ["CLUSTER_REPEAT_PATTERN"],
    allowedLengths: [3, 4, 5],
  },
  {
    prototypeId: "CLS-CP007-PROT-007",
    title: "Complete alphabet-position total outlier",
    task: "FIND_ODD_LETTER_CLUSTER",
    allowedRuleIds: ["CLUSTER_POSITION_SUM"],
    allowedLengths: [3, 4, 5],
  },
  {
    prototypeId: "CLS-CP007-PROT-008",
    title: "First-two-position sum equation outlier",
    task: "FIND_ODD_LETTER_CLUSTER",
    allowedRuleIds: ["CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS"],
    allowedLengths: [3],
  },
  {
    prototypeId: "CLS-CP007-PROT-009",
    title: "Half-cluster position-total difference outlier",
    task: "FIND_ODD_LETTER_CLUSTER",
    allowedRuleIds: ["CLUSTER_HALF_SUM_DIFFERENCE"],
    allowedLengths: [4],
  },
  {
    prototypeId: "CLS-CP007-PROT-010",
    title: "Opposite pairing at indexes one-three and two-four",
    task: "FIND_ODD_LETTER_CLUSTER",
    allowedRuleIds: ["CLUSTER_OPPOSITE_PAIRING_13_24_STATUS"],
    allowedLengths: [4],
  },
  {
    prototypeId: "CLS-CP007-PROT-011",
    title: "Opposite pairing at adjacent index pairs",
    task: "FIND_ODD_LETTER_CLUSTER",
    allowedRuleIds: ["CLUSTER_OPPOSITE_PAIRING_12_34_STATUS"],
    allowedLengths: [4],
  },
  {
    prototypeId: "CLS-CP007-PROT-012",
    title: "Adjacent pair-block gap signature outlier",
    task: "FIND_ODD_LETTER_CLUSTER",
    allowedRuleIds: ["CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE"],
    allowedLengths: [4],
  },
  {
    prototypeId: "CLS-CP007-PROT-013",
    title: "Central absolute-gap outlier",
    task: "FIND_ODD_LETTER_CLUSTER",
    allowedRuleIds: ["CLUSTER_CENTRAL_ABSOLUTE_GAP"],
    allowedLengths: [4],
  },
];

export const CLS_CP007_PROTOTYPE_BY_ID = new Map(
  CLS_CP007_PROTOTYPES.map((prototype) => [prototype.prototypeId, prototype]),
);
