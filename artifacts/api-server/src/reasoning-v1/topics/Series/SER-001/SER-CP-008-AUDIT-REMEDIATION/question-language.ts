export const SER_CP008_CORE_QL_IDS = [
  "SER-QL-014",
  "SER-QL-015",
  "SER-QL-016",
  "SER-QL-017",
  "SER-QL-018",
] as const;

export const SER_CP008_MIXED_QL_IDS = [
  "SER-QL-019",
  "SER-QL-020",
  "SER-QL-021",
  "SER-QL-022",
  "SER-QL-023",
  "SER-QL-024",
  "SER-QL-025",
  "SER-QL-026",
  "SER-QL-027",
  "SER-QL-028",
] as const;

export const SER_CP008_PROVISIONAL_QL_IDS = [
  ...SER_CP008_CORE_QL_IDS,
  ...SER_CP008_MIXED_QL_IDS,
] as const;

export type SerCp008CoreQlId = (typeof SER_CP008_CORE_QL_IDS)[number];
export type SerCp008MixedQlId = (typeof SER_CP008_MIXED_QL_IDS)[number];
export type SerCp008AllProvisionalQlId = (typeof SER_CP008_PROVISIONAL_QL_IDS)[number];

// Keep the original core-runtime contract narrow so widening the audit inventory
// cannot silently make the frozen SER-QL-014..018 switch non-exhaustive.
export type SerCp008ProvisionalQlId = SerCp008CoreQlId;

export type SerCp008AuthorityId =
  | "SINGLE_LETTER_PROGRESSIVE_JUMP"
  | "SINGLE_LETTER_INTERLEAVED_ROWS"
  | "ALPHANUMERIC_PARALLEL_CHANNELS"
  | "ALPHANUMERIC_INTERLEAVED_CHANNELS"
  | "ALPHANUMERIC_CLUSTER_NUMBER_CHANNELS"
  | "ALPHANUMERIC_LETTER_POSITION_BINDING"
  | "ALPHANUMERIC_OUTER_LETTER_SUM_BINDING"
  | "ALPHANUMERIC_DUAL_LETTER_PROGRESSIVE_NUMBER"
  | "ALPHANUMERIC_PROGRESSIVE_DUAL_CHANNEL"
  | "ALPHANUMERIC_SQUARE_POSITION_COUPLING"
  | "ALPHANUMERIC_LETTER_POSITION_SQUARE"
  | "ALPHANUMERIC_INDEX_SQUARE_WRONG_TERM"
  | "ALPHANUMERIC_TOKEN_ROTATION"
  | "ALPHANUMERIC_DUAL_LETTER_INDEX_SQUARE"
  | "ALPHANUMERIC_NUMBER_LETTER_BLOCK_COMPLETION";

export interface SerCp008QlAuthority {
  readonly qlId: SerCp008AllProvisionalQlId;
  readonly authorityId: SerCp008AuthorityId;
  readonly title: string;
  readonly solveContract: string;
  readonly sourceEvidence: readonly string[];
  readonly allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION";
}

export const SER_CP008_QL_AUTHORITIES: readonly SerCp008QlAuthority[] = [
  {
    qlId: "SER-QL-014",
    authorityId: "SINGLE_LETTER_PROGRESSIVE_JUMP",
    title: "Single-letter fixed/progressive alphabet movement",
    solveContract: "Continue a one-letter alphabet series whose signed jump changes by a fixed increment.",
    sourceEvidence: ["Aggarwal Series Example 33: B, D, G, K, ?"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-015",
    authorityId: "SINGLE_LETTER_INTERLEAVED_ROWS",
    title: "Single-letter interleaved rows",
    solveContract: "Separate the single-letter sequence into repeating positional rows and continue each target row independently.",
    sourceEvidence: ["Aggarwal Series Example 36: B, C, O, D, E, P, F, G, Q, ?, ?, ?"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-016",
    authorityId: "ALPHANUMERIC_PARALLEL_CHANNELS",
    title: "Letter-number parallel-channel series",
    solveContract: "Track the alphabet and number channels independently inside each token and apply their fixed movements together.",
    sourceEvidence: [
      "Aggarwal Alphanumeric Example 43: E-5, G-7, I-9, K-11, ?",
      "Aggarwal Alphanumeric Example 45: 2I, 9L, 16O, ?",
    ],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-017",
    authorityId: "ALPHANUMERIC_INTERLEAVED_CHANNELS",
    title: "Interleaved alphanumeric rows",
    solveContract: "Split alternating alphanumeric tokens into two rows, then continue the number and letter channels inside the target row.",
    sourceEvidence: ["Aggarwal Alphanumeric Example 44: 22P, 2Z, 24Q, 4Y, 26R, ?"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-018",
    authorityId: "ALPHANUMERIC_CLUSTER_NUMBER_CHANNELS",
    title: "Letter-cluster plus number fixed channels",
    solveContract: "Track both letter positions in the cluster and the number as three active fixed-movement channels.",
    sourceEvidence: [
      "SSC CGL 2024: UE 88, VG 84, WI 80, XK 76, ?",
      "Aggarwal Mixed Series 239: JL22, OQ32, TV42, ?",
    ],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-019",
    authorityId: "ALPHANUMERIC_LETTER_POSITION_BINDING",
    title: "Letter with its alphabet-position number",
    solveContract: "Infer that each number is the English-alphabet position of the adjacent letter, independent of cross-term order.",
    sourceEvidence: ["Aggarwal Mixed Series 237 / UP Police 2018: D4X24E5H8T20L?"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-020",
    authorityId: "ALPHANUMERIC_OUTER_LETTER_SUM_BINDING",
    title: "Number equals sum of the two outer letter positions",
    solveContract: "For each letter-number-letter token, add the two alphabet positions to obtain the middle number.",
    sourceEvidence: ["Aggarwal Mixed Series 238 / SSC CHSL 2020: C10G, H20L, L17E, L?Q"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-021",
    authorityId: "ALPHANUMERIC_DUAL_LETTER_PROGRESSIVE_NUMBER",
    title: "Two fixed letter channels with progressive number gaps",
    solveContract: "Continue both letter channels by fixed jumps while the numeric channel advances through an arithmetic progression of gaps.",
    sourceEvidence: ["Aggarwal Mixed Series 240 / DSSSB 2019: UV5, XZ10, AD17, ?, GL37"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-022",
    authorityId: "ALPHANUMERIC_PROGRESSIVE_DUAL_CHANNEL",
    title: "Progressive number and letter jumps",
    solveContract: "Increase the number-channel jump and letter-channel jump by fixed increments at each transition.",
    sourceEvidence: ["Aggarwal Mixed Series 243 / RRB ALP 2018: 5E, 7F, 11H, 17K, ?"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-023",
    authorityId: "ALPHANUMERIC_SQUARE_POSITION_COUPLING",
    title: "Square sequence coupled to wrapped alphabet position",
    solveContract: "Advance through consecutive squares; show the square as the number and its wrapped alphabet position as the letter.",
    sourceEvidence: ["Aggarwal Mixed Series 242 / DSSSB 2019: A1, D4, I9, P16, Y25, J36, ?"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-024",
    authorityId: "ALPHANUMERIC_LETTER_POSITION_SQUARE",
    title: "Number equals square of the displayed letter position",
    solveContract: "Move the letter by a fixed alphabet jump and square that letter's alphabet position for the numeric part.",
    sourceEvidence: ["Aggarwal Mixed Series 245 / IB ACIO 2021: e25, j100, o225, ?"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-025",
    authorityId: "ALPHANUMERIC_INDEX_SQUARE_WRONG_TERM",
    title: "Wrong term in fixed-letter / index-square series",
    solveContract: "Track a fixed letter jump and consecutive square numbers, then identify the one term whose numeric component breaks the square sequence.",
    sourceEvidence: ["Aggarwal Mixed Series 241 / DSSSB 2019: F4, H9, J15, L25, N36"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-026",
    authorityId: "ALPHANUMERIC_TOKEN_ROTATION",
    title: "Cyclic permutation of a mixed alphanumeric token",
    solveContract: "Rotate the same letters/digit through token positions without changing the token members.",
    sourceEvidence: ["Aggarwal Mixed Series 244 / RRB NTPC 2021: B7K, KB7, ?"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-027",
    authorityId: "ALPHANUMERIC_DUAL_LETTER_INDEX_SQUARE",
    title: "Opposing letter channels with consecutive squares",
    solveContract: "Advance two letter channels by fixed signed jumps while the numeric channel follows consecutive squares.",
    sourceEvidence: ["Aggarwal Mixed Series 246 / RRB NTPC 2021: D4U, G9R, J16O, ?"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-028",
    authorityId: "ALPHANUMERIC_NUMBER_LETTER_BLOCK_COMPLETION",
    title: "Number-letter correspondence block completion",
    solveContract: "Complete repeated blocks in which consecutive numbers are followed by their corresponding alphabet letters.",
    sourceEvidence: ["Aggarwal Series Example 42: 1 2 _ _ 4 5 D E 6 _ F _ 8 9 _ I"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
] as const;

export function serCp008AuthorityByQlId(qlId: SerCp008AllProvisionalQlId): SerCp008QlAuthority {
  const authority = SER_CP008_QL_AUTHORITIES.find((entry) => entry.qlId === qlId);
  if (!authority) throw new Error(`Unknown SER-CP-008 QL: ${qlId}`);
  return authority;
}
