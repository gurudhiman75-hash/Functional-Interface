import {
  SER_CP007_TEMPORARY_TEMPLATES,
  generateSerCp007Question,
} from "../SER-CP-007/foundation";
import {
  SER_CP007_WAVE_B_TEMPORARY_TEMPLATES,
  generateSerCp007WaveBQuestion,
} from "../SER-CP-007-WAVE-B/foundation-expanded";
import {
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATES,
  generateSerCp007WaveCQuestion,
} from "../SER-CP-007-WAVE-C/foundation-refined";
import {
  SER_CP007_WAVE_D_TEMPORARY_TEMPLATES,
  generateSerCp007WaveDQuestion,
} from "../SER-CP-007-WAVE-D/foundation";
import {
  SER_CP007_WAVE_E_TEMPORARY_TEMPLATES,
  generateSerCp007WaveEQuestion,
} from "../SER-CP-007-WAVE-E/foundation";

export const SER_CP007_DISCOVERY_AUTHORITY_IDS = [
  "ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE",
  "ALTERNATING_BLOCK_COMPLETION",
  "COLUMNWISE_FIXED_CLUSTER_MOVEMENT",
  "COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT",
  "CUMULATIVE_PREFIX_CLUSTER",
  "CYCLIC_CLUSTER_PERMUTATION",
  "EDGE_DELETION_WORD_SEQUENCE",
  "FIXED_POSITION_PERMUTATION_CLUSTER",
  "GROWING_CONSECUTIVE_CLUSTER",
  "K_INTERLEAVED_CLUSTER_SERIES",
  "MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME",
  "PATTERNED_INTERIOR_INSERTION_GROWTH",
  "PROGRESSIVE_POSITIONAL_SUBSTITUTION",
  "REPEATED_BLOCK_COMPLETION",
  "SYMMETRIC_EDGE_GROWTH",
  "TWO_INTERLEAVED_CLUSTER_SERIES",
  "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER",
] as const;

export type SerCp007DiscoveryAuthorityId =
  (typeof SER_CP007_DISCOVERY_AUTHORITY_IDS)[number];

export type SerCp007DiscoveryWaveId =
  | "WAVE_A"
  | "WAVE_B"
  | "WAVE_C"
  | "WAVE_D"
  | "WAVE_E";

export type SerCp007Candidate14AuthorityId =
  | Exclude<
      SerCp007DiscoveryAuthorityId,
      | "TWO_INTERLEAVED_CLUSTER_SERIES"
      | "K_INTERLEAVED_CLUSTER_SERIES"
      | "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER"
      | "GROWING_CONSECUTIVE_CLUSTER"
      | "REPEATED_BLOCK_COMPLETION"
      | "ALTERNATING_BLOCK_COMPLETION"
    >
  | "INTERLEAVED_CLUSTER_SERIES"
  | "DIRECTIONAL_CONSECUTIVE_CLUSTER"
  | "PERIODIC_BLOCK_COMPLETION";

export type SerCp007Candidate13AuthorityId =
  | Exclude<
      SerCp007Candidate14AuthorityId,
      | "CYCLIC_CLUSTER_PERMUTATION"
      | "FIXED_POSITION_PERMUTATION_CLUSTER"
    >
  | "POSITION_PERMUTATION_CLUSTER";

export type SerCp007CandidateQuestion = {
  readonly questionId: string;
  readonly temporaryTemplateId: string;
  readonly canonicalAuthorityId: SerCp007DiscoveryAuthorityId;
  readonly sourceRuleId: string;
  readonly taskKind: string;
  readonly options: readonly string[];
  readonly correctAnswer: string;
  readonly correctIndex: number;
  readonly lifecycleLocks: Readonly<Record<string, boolean>>;
  readonly hiddenState?: {
    readonly permutationOrder?: readonly number[];
    readonly rotationAmount?: number;
  };
};

export type SerCp007TemplateProbe = {
  readonly waveId: SerCp007DiscoveryWaveId;
  readonly temporaryTemplateId: string;
  readonly originalAuthorityId: SerCp007DiscoveryAuthorityId;
  readonly sourceRuleId: string;
  readonly taskKind: string;
  readonly generate: (seed: number) => SerCp007CandidateQuestion;
};

export const SER_CP007_CANDIDATE_14_MAP: Readonly<
  Record<SerCp007DiscoveryAuthorityId, SerCp007Candidate14AuthorityId>
> = {
  ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE:
    "ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE",
  ALTERNATING_BLOCK_COMPLETION: "PERIODIC_BLOCK_COMPLETION",
  COLUMNWISE_FIXED_CLUSTER_MOVEMENT: "COLUMNWISE_FIXED_CLUSTER_MOVEMENT",
  COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT:
    "COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT",
  CUMULATIVE_PREFIX_CLUSTER: "CUMULATIVE_PREFIX_CLUSTER",
  CYCLIC_CLUSTER_PERMUTATION: "CYCLIC_CLUSTER_PERMUTATION",
  EDGE_DELETION_WORD_SEQUENCE: "EDGE_DELETION_WORD_SEQUENCE",
  FIXED_POSITION_PERMUTATION_CLUSTER: "FIXED_POSITION_PERMUTATION_CLUSTER",
  GROWING_CONSECUTIVE_CLUSTER: "DIRECTIONAL_CONSECUTIVE_CLUSTER",
  K_INTERLEAVED_CLUSTER_SERIES: "INTERLEAVED_CLUSTER_SERIES",
  MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME:
    "MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME",
  PATTERNED_INTERIOR_INSERTION_GROWTH:
    "PATTERNED_INTERIOR_INSERTION_GROWTH",
  PROGRESSIVE_POSITIONAL_SUBSTITUTION:
    "PROGRESSIVE_POSITIONAL_SUBSTITUTION",
  REPEATED_BLOCK_COMPLETION: "PERIODIC_BLOCK_COMPLETION",
  SYMMETRIC_EDGE_GROWTH: "SYMMETRIC_EDGE_GROWTH",
  TWO_INTERLEAVED_CLUSTER_SERIES: "INTERLEAVED_CLUSTER_SERIES",
  VARIABLE_LENGTH_CONSECUTIVE_CLUSTER:
    "DIRECTIONAL_CONSECUTIVE_CLUSTER",
};

export const SER_CP007_CANDIDATE_13_MAP: Readonly<
  Record<SerCp007DiscoveryAuthorityId, SerCp007Candidate13AuthorityId>
> = {
  ...SER_CP007_CANDIDATE_14_MAP,
  CYCLIC_CLUSTER_PERMUTATION: "POSITION_PERMUTATION_CLUSTER",
  FIXED_POSITION_PERMUTATION_CLUSTER: "POSITION_PERMUTATION_CLUSTER",
};

function asProbe(
  waveId: SerCp007DiscoveryWaveId,
  template: {
    readonly temporaryTemplateId: string;
    readonly canonicalAuthorityId: string;
    readonly sourceRuleId: string;
    readonly taskKind: string;
  },
  generate: (seed: number) => SerCp007CandidateQuestion,
): SerCp007TemplateProbe {
  if (
    !SER_CP007_DISCOVERY_AUTHORITY_IDS.includes(
      template.canonicalAuthorityId as SerCp007DiscoveryAuthorityId,
    )
  ) {
    throw new Error(
      `Unknown discovery authority ${template.canonicalAuthorityId}`,
    );
  }
  return {
    waveId,
    temporaryTemplateId: template.temporaryTemplateId,
    originalAuthorityId:
      template.canonicalAuthorityId as SerCp007DiscoveryAuthorityId,
    sourceRuleId: template.sourceRuleId,
    taskKind: template.taskKind,
    generate,
  };
}

export const SER_CP007_TEMPLATE_PROBES: readonly SerCp007TemplateProbe[] = [
  ...SER_CP007_TEMPORARY_TEMPLATES.map((template) =>
    asProbe("WAVE_A", template, (seed) =>
      generateSerCp007Question(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007CandidateQuestion,
    ),
  ),
  ...SER_CP007_WAVE_B_TEMPORARY_TEMPLATES.map((template) =>
    asProbe("WAVE_B", template, (seed) =>
      generateSerCp007WaveBQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007CandidateQuestion,
    ),
  ),
  ...SER_CP007_WAVE_C_TEMPORARY_TEMPLATES.map((template) =>
    asProbe("WAVE_C", template, (seed) =>
      generateSerCp007WaveCQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007CandidateQuestion,
    ),
  ),
  ...SER_CP007_WAVE_D_TEMPORARY_TEMPLATES.map((template) =>
    asProbe("WAVE_D", template, (seed) =>
      generateSerCp007WaveDQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007CandidateQuestion,
    ),
  ),
  ...SER_CP007_WAVE_E_TEMPORARY_TEMPLATES.map((template) =>
    asProbe("WAVE_E", template, (seed) =>
      generateSerCp007WaveEQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007CandidateQuestion,
    ),
  ),
];

export function candidateCounts<T extends string>(
  mapping: Readonly<Record<SerCp007DiscoveryAuthorityId, T>>,
): Readonly<Record<T, number>> {
  const counts = new Map<T, number>();
  for (const probe of SER_CP007_TEMPLATE_PROBES) {
    const candidateAuthorityId = mapping[probe.originalAuthorityId];
    counts.set(
      candidateAuthorityId,
      (counts.get(candidateAuthorityId) ?? 0) + 1,
    );
  }
  return Object.fromEntries([...counts.entries()].sort()) as Record<T, number>;
}

export const SER_CP007_CANDIDATE_14_COUNTS = candidateCounts(
  SER_CP007_CANDIDATE_14_MAP,
);

export const SER_CP007_CANDIDATE_13_COUNTS = candidateCounts(
  SER_CP007_CANDIDATE_13_MAP,
);
