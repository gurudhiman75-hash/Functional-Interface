export const SER_CP008_PROVISIONAL_QL_IDS = [
  "SER-QL-014",
  "SER-QL-015",
  "SER-QL-016",
  "SER-QL-017",
  "SER-QL-018",
] as const;

export type SerCp008ProvisionalQlId =
  (typeof SER_CP008_PROVISIONAL_QL_IDS)[number];

export type SerCp008AuthorityId =
  | "SINGLE_LETTER_PROGRESSIVE_JUMP"
  | "SINGLE_LETTER_INTERLEAVED_ROWS"
  | "ALPHANUMERIC_PARALLEL_CHANNELS"
  | "ALPHANUMERIC_INTERLEAVED_CHANNELS"
  | "ALPHANUMERIC_CLUSTER_NUMBER_CHANNELS";

export interface SerCp008QlAuthority {
  readonly qlId: SerCp008ProvisionalQlId;
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
    solveContract:
      "Continue a one-letter alphabet series whose signed jump is fixed or changes by a fixed increment.",
    sourceEvidence: ["Aggarwal Series Example 33: B, D, G, K, ?"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-015",
    authorityId: "SINGLE_LETTER_INTERLEAVED_ROWS",
    title: "Single-letter interleaved rows",
    solveContract:
      "Separate the single-letter sequence into repeating positional rows and continue each target row independently.",
    sourceEvidence: ["Aggarwal Series Example 36: B, C, O, D, E, P, F, G, Q, ?, ?, ?"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-016",
    authorityId: "ALPHANUMERIC_PARALLEL_CHANNELS",
    title: "Letter-number parallel-channel series",
    solveContract:
      "Track the alphabet and number channels independently inside each token and apply their fixed movements together.",
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
    solveContract:
      "Split alternating alphanumeric tokens into two rows, then continue the number and letter channels inside the target row.",
    sourceEvidence: ["Aggarwal Alphanumeric Example 44: 22P, 2Z, 24Q, 4Y, 26R, ?"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
  {
    qlId: "SER-QL-018",
    authorityId: "ALPHANUMERIC_CLUSTER_NUMBER_CHANNELS",
    title: "Letter-cluster plus number parallel channels",
    solveContract:
      "Track both letter positions in the cluster and the number as three active fixed-movement channels.",
    sourceEvidence: ["SSC CGL 2024: UE 88, VG 84, WI 80, XK 76, ?"],
    allocationStatus: "PROVISIONAL_AUDIT_REMEDIATION",
  },
] as const;

export function serCp008AuthorityByQlId(
  qlId: SerCp008ProvisionalQlId,
): SerCp008QlAuthority {
  const authority = SER_CP008_QL_AUTHORITIES.find((entry) => entry.qlId === qlId);
  if (!authority) throw new Error(`Unknown SER-CP-008 QL: ${qlId}`);
  return authority;
}
