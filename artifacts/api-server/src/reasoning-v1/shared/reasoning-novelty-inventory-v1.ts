export const REASONING_V1_NOVELTY_INVENTORY_VERSION =
  'REASONING_V1_NOVELTY_INVENTORY_2026_09_26_V1' as const;

export type ReasoningNoveltyAuditStatusV1 =
  | 'APPROVED_CONTROLLED_NOVEL_RUNTIME'
  | 'CONTROLLED_NOVEL_DISCOVERY_PENDING_HUMAN_REVIEW'
  | 'SEMANTIC_NOVELTY_PROVEN_NEEDS_STANDARDIZATION'
  | 'NOVEL_EDGE_PRESENT_NEEDS_STANDARDIZATION'
  | 'NOVELTY_GATE_PRESENT_NEEDS_EXPANSION'
  | 'DIVERSITY_PROVEN_NOVELTY_NOT_YET_PROVEN'
  | 'NOVELTY_SIGNAL_PRESENT_NEEDS_SEMANTIC_AUDIT'
  | 'DEDICATED_NOVELTY_AUDIT_PENDING';

export interface ReasoningNoveltyInventoryEntryV1 {
  readonly topicDirectory: string;
  readonly chapterId: string | null;
  readonly status: ReasoningNoveltyAuditStatusV1;
  readonly evidence: readonly string[];
  readonly countsTowardControlledNovelTargetNow: boolean;
  readonly nextGate: string;
}

export const REASONING_V1_NOVELTY_INVENTORY_V1: readonly ReasoningNoveltyInventoryEntryV1[] = [
  {
    topicDirectory: 'Alphabet-Test',
    chapterId: null,
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit semantic construction space beyond resampling and wording changes.',
  },
  {
    topicDirectory: 'Analogy',
    chapterId: 'ANA-001',
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit relation-composition novelty separately from pair-bank breadth.',
  },
  {
    topicDirectory: 'Blood-Relations',
    chapterId: null,
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit family-graph/query recombination under exact kinship solving.',
  },
  {
    topicDirectory: 'Calendar',
    chapterId: 'CAL-001',
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit cross-operation calendar compositions without artificial arithmetic load.',
  },
  {
    topicDirectory: 'Cause-and-Effect',
    chapterId: 'CAE-001',
    status: 'NOVEL_EDGE_PRESENT_NEEDS_STANDARDIZATION',
    evidence: [
      'CP008 multi-event ordering is explicitly retained as Examtree edge coverage.',
      'CP009 missing-causal-link is explicitly retained as advanced/novel coverage.',
      'Competing-explanation depth is retained without claiming common historical-paper frequency.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Tag approved edge families with controlled-novel provenance and run semantic/learner review.',
  },
  {
    topicDirectory: 'Classification',
    chapterId: null,
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Separate true rule novelty from object-bank substitution.',
  },
  {
    topicDirectory: 'Clocks',
    chapterId: 'CLK-001',
    status: 'CONTROLLED_NOVEL_DISCOVERY_PENDING_HUMAN_REVIEW',
    evidence: [
      'Faulty actual→display mapping composed with hand-angle reasoning.',
      'Exact Clock solver and independent verifier agree.',
      'No permanent QL allocated and no Question Studio activation granted.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Human-review the controlled-novel candidate family before mix activation.',
  },
  {
    topicDirectory: 'Coding-Decoding',
    chapterId: 'COD-001',
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit genuinely new rule compositions separately from code/value resampling.',
  },
  {
    topicDirectory: 'Course-of-Action',
    chapterId: 'COA-001',
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit scenario-policy interaction novelty under action-validity constraints.',
  },
  {
    topicDirectory: 'Data-Sufficiency',
    chapterId: null,
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit statement-set construction novelty while preserving sufficiency semantics.',
  },
  {
    topicDirectory: 'Direction-Sense',
    chapterId: 'DIR-001',
    status: 'DIVERSITY_PROVEN_NOVELTY_NOT_YET_PROVEN',
    evidence: [
      'Final audit has generated-instance, multilingual and diagram-policy coverage.',
      'No shared controlled-novel provenance proof has yet been recorded.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Identify safe spatial/query compositions and prove they are more than route resampling.',
  },
  {
    topicDirectory: 'InputOutput',
    chapterId: 'IOP-001',
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit rule-sequence composition space and anti-clone semantics.',
  },
  {
    topicDirectory: 'Logic-Puzzles',
    chapterId: 'LP-001',
    status: 'DIVERSITY_PROVEN_NOVELTY_NOT_YET_PROVEN',
    evidence: [
      'Unique-solution generation, clue-necessity checks and independent re-solving are already audited.',
      'Scenario/object-pool breadth alone does not qualify as controlled novelty.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Define puzzle-structure novelty axes such as constraint topology and query interaction.',
  },
  {
    topicDirectory: 'Mathematical-Operations',
    chapterId: 'OPS-001',
    status: 'DIVERSITY_PROVEN_NOVELTY_NOT_YET_PROVEN',
    evidence: [
      'Audited semantic QLs and generated-instance difficulty exist.',
      'No controlled-novel provenance proof is yet part of the chapter audit.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit valid symbol-rule/query compositions without decorative operator complexity.',
  },
  {
    topicDirectory: 'Missing-Number',
    chapterId: null,
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit rule-composition novelty against superficial number resampling.',
  },
  {
    topicDirectory: 'Non-Verbal-Reasoning',
    chapterId: 'PFC-001 / spatial',
    status: 'APPROVED_CONTROLLED_NOVEL_RUNTIME',
    evidence: [
      'Paper Folding has explicit SOURCE_BACKED_CORE / CONTROLLED_NOVEL provenance.',
      'Novelty axes and difficulty budgets are declared.',
      'Controlled-novel learner review and product-owner approval are recorded.',
      'Question Studio seeded runtime preserves provenance.',
    ],
    countsTowardControlledNovelTargetNow: true,
    nextGate: 'Map its mature innovation envelope onto the shared Reasoning V1 governance without weakening existing safeguards.',
  },
  {
    topicDirectory: 'Ranking-and-Order',
    chapterId: 'RNK-001',
    status: 'CONTROLLED_NOVEL_DISCOVERY_PENDING_HUMAN_REVIEW',
    evidence: [
      'Six-person multi-constraint caselets combine endpoint, exact-gap, neighbour and relative-order reasoning.',
      'All 6! orders are independently checked for one unique solution.',
      'Children map to existing RNK QLs; RNK-QL-043 remains unallocated.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Human-review learner surfaces, then integrate an approved novelty lane into the chapter mixer.',
  },
  {
    topicDirectory: 'SeatingArrangement',
    chapterId: null,
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit constraint-topology and representation novelty under unique-solution proofs.',
  },
  {
    topicDirectory: 'Series',
    chapterId: null,
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit genuinely new rule interactions separately from sequence-value resampling.',
  },
  {
    topicDirectory: 'Statement-and-Arguments',
    chapterId: 'ARG-001',
    status: 'SEMANTIC_NOVELTY_PROVEN_NEEDS_STANDARDIZATION',
    evidence: [
      'Certified 1,000-question audit is exact-unique.',
      'All 48 core templates are represented.',
      'Semantic-archetype system explicitly supports novel combinations inside known exam logic.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Classify archetype recombinations with shared provenance and verify a controlled-novel operating share.',
  },
  {
    topicDirectory: 'Statement-and-Assumption',
    chapterId: 'STA-001',
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit scenario/assumption interaction novelty rather than lexical scenario diversity.',
  },
  {
    topicDirectory: 'Statement-and-Conclusion',
    chapterId: null,
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit conclusion-logic recombination under no-outside-knowledge constraints.',
  },
  {
    topicDirectory: 'Statement-and-Inference',
    chapterId: 'SIF-001',
    status: 'NOVELTY_GATE_PRESENT_NEEDS_EXPANSION',
    evidence: [
      'Chapter validator already includes an explicit NOVELTY gate.',
      'Chapter review boundary explicitly calls for novelty expansion before freeze.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Bind the existing NOVELTY gate to shared semantic axes and prove controlled-novel families.',
  },
  {
    topicDirectory: 'Syllogism',
    chapterId: 'SYL-001',
    status: 'NOVELTY_SIGNAL_PRESENT_NEEDS_SEMANTIC_AUDIT',
    evidence: [
      'Runtime contains novelCandidates selection in multiple banking shells.',
      'This label has not yet been shown to mean chapter-level controlled novelty under the shared standard.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit what novelCandidates means semantically before granting controlled-novel credit.',
  },
  {
    topicDirectory: 'Word-Dictionary-Order',
    chapterId: null,
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit ordering-rule novelty separately from word-pool breadth.',
  },
  {
    topicDirectory: 'Word-Formation',
    chapterId: null,
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Audit operation/query novelty separately from source-word substitution.',
  },
] as const;

export function reasoningNoveltyInventorySummaryV1() {
  const byStatus = Object.fromEntries(
    [...new Set(REASONING_V1_NOVELTY_INVENTORY_V1.map((entry) => entry.status))]
      .map((status) => [
        status,
        REASONING_V1_NOVELTY_INVENTORY_V1.filter((entry) => entry.status === status).length,
      ]),
  );
  return {
    version: REASONING_V1_NOVELTY_INVENTORY_VERSION,
    topicCount: REASONING_V1_NOVELTY_INVENTORY_V1.length,
    controlledNovelTargetCreditedTopics:
      REASONING_V1_NOVELTY_INVENTORY_V1
        .filter((entry) => entry.countsTowardControlledNovelTargetNow)
        .map((entry) => entry.topicDirectory),
    byStatus,
  } as const;
}
