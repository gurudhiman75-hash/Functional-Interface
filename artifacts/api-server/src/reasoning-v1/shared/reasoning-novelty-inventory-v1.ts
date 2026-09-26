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
    chapterId: 'BLR-001',
    status: 'CONTROLLED_NOVEL_DISCOVERY_PENDING_HUMAN_REVIEW',
    evidence: [
      'A coded-relation graph is decoded first, then a second-stage filtered granddaughter count is solved from the reconstructed family.',
      'The lane composes existing BLR-QL-026 coded decoding with BLR-QL-013 family-counting semantics.',
      'The existing CP006 decoder is reused; the count is independently recomputed from decoded parent edges and gender evidence.',
      'BLR-QL-036 remains unallocated and Question Studio novelty mixing remains disabled.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Human-review coded-count learner surfaces before chapter-mix activation.',
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
    status: 'CONTROLLED_NOVEL_DISCOVERY_PENDING_HUMAN_REVIEW',
    evidence: [
      'CP008 multi-event ordering and CP009 integrated missing-link/reconstruction families are explicitly retained as Examtree edge coverage.',
      'The existing reviewed multilingual runtime is wrapped with shared CONTROLLED_NOVEL provenance.',
      'Solver trace, unique-answer and distractor gates remain intact; no historical-paper frequency claim is made.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Human-review the standardized CP008/009 controlled-novel corpus before chapter-mix activation.',
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
    status: 'CONTROLLED_NOVEL_DISCOVERY_PENDING_HUMAN_REVIEW',
    evidence: [
      'A solver-backed graph-to-relative-path composition combines existing DIR-QL-004 and DIR-QL-041 skills.',
      'Primary and independent relative-path replays must agree before a candidate is emitted.',
      'Exact Pythagorean distance families and misconception-labelled direction-distance options are preserved.',
      'No permanent QL is allocated and Question Studio novelty mixing remains disabled.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Human-review the graph-relative-path learner surface before chapter-mix activation.',
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
    status: 'DEDICATED_NOVELTY_AUDIT_PENDING',
    evidence: [
      'The historical novelCandidates helper only excluded conclusions that directly restated a premise.',
      'It has been renamed nonRestatementCandidates so anti-triviality cannot be mistaken for controlled novelty.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Design and prove a separate semantic controlled-novel lane beyond non-restatement filtering.',
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
