export const REASONING_V1_NOVELTY_INVENTORY_VERSION =
  'REASONING_V1_NOVELTY_INVENTORY_2026_10_03_V7' as const;

export type ReasoningNoveltyAuditStatusV1 =
  | 'APPROVED_CONTROLLED_NOVEL_RUNTIME'
  | 'CONTROLLED_NOVEL_DISCOVERY_PENDING_HUMAN_REVIEW'
  | 'CONTENT_REVIEW_APPROVED_AWAITING_QUESTION_STUDIO_ROUTE'
  | 'SEMANTIC_NOVELTY_PROVEN_NEEDS_STANDARDIZATION'
  | 'NOVEL_EDGE_PRESENT_NEEDS_STANDARDIZATION'
  | 'NOVELTY_GATE_PRESENT_NEEDS_EXPANSION'
  | 'DIVERSITY_PROVEN_NOVELTY_NOT_YET_PROVEN'
  | 'NOVELTY_SIGNAL_PRESENT_NEEDS_SEMANTIC_AUDIT'
  | 'DEDICATED_NOVELTY_AUDIT_PENDING'
  | 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER';

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
    chapterId: 'ALP-001',
    status: 'APPROVED_CONTROLLED_NOVEL_RUNTIME',
    evidence: [
      'A full alphabet is explicitly rearranged by an existing CP004 transform, then an interval-gap query is solved in the transformed order.',
      'The lane composes CP003 gap semantics with the exact CP004 transform authority selected for the seed.',
      'The transformed positions are independently recomputed before the gap answer is emitted.',
      'Human content review passed on 2026-10-02; activation is held only because the chapter lacks a live source-backed multi-engine Question Studio route.',
    ],
    countsTowardControlledNovelTargetNow: true,
    nextGate: 'Monitor governed Question Studio novelty mix quality and preserve explicit-scope/language/difficulty safeguards.',
  },
  {
    topicDirectory: 'Analogy',
    chapterId: 'ANA-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'Final ANA anti-inflation authority classifies multi-reference and inverse forms as presentation, not new solve contracts.',
      'CP008 already owns mixed analogy completion and odd-pair selection.',
      'CP009 conditional-branch grammar remains source-gapped with zero admitted QLs.',
      'The coupled-invariant pilot remains quarantined because the recoverable rule permits multiple valid outputs.',
      'ANA-001-CONTROLLED-NOVELTY-AUDIT-CLOSURE-20261002.md records the dedicated novelty decision.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on recurring source evidence for a meta-analogy grammar or a new solver-backed composition that changes learner reasoning structure.',
  },
  {
    topicDirectory: 'Blood-Relations',
    chapterId: 'BLR-001',
    status: 'APPROVED_CONTROLLED_NOVEL_RUNTIME',
    evidence: [
      'A coded-relation graph is decoded first, then a second-stage filtered granddaughter count is solved from the reconstructed family.',
      'The lane composes existing BLR-QL-026 coded decoding with BLR-QL-013 family-counting semantics.',
      'The existing CP006 decoder is reused; the count is independently recomputed from decoded parent edges and gender evidence.',
      'BLR-QL-036 remains unallocated and Question Studio novelty mixing remains disabled.',
    ],
    countsTowardControlledNovelTargetNow: true,
    nextGate: 'Monitor governed Question Studio novelty mix quality and preserve explicit-scope/language/difficulty safeguards.',
  },
  {
    topicDirectory: 'Calendar',
    chapterId: 'CAL-001',
    status: 'APPROVED_CONTROLLED_NOVEL_RUNTIME',
    evidence: [
      'A duration-defined calendar span hides the end date, so the learner must derive the boundary before counting a named weekday.',
      'The lane composes existing CAL-QL-005 date-shift semantics with CAL-QL-035 named-weekday range counting.',
      'Closed-form frequency, enumerated-range frequency and day-by-day verification must agree exactly.',
      'CAL-QL-037 remains unallocated and Question Studio novelty mixing remains disabled.',
    ],
    countsTowardControlledNovelTargetNow: true,
    nextGate: 'Monitor governed Question Studio novelty mix quality and preserve explicit-scope/language/difficulty safeguards.',
  },
  {
    topicDirectory: 'Cause-and-Effect',
    chapterId: 'CAE-001',
    status: 'APPROVED_CONTROLLED_NOVEL_RUNTIME',
    evidence: [
      'CP008 multi-event ordering and CP009 integrated missing-link/reconstruction families are explicitly retained as Examtree edge coverage.',
      'The existing reviewed multilingual runtime is wrapped with shared CONTROLLED_NOVEL provenance.',
      'Solver trace, unique-answer and distractor gates remain intact; no historical-paper frequency claim is made.',
    ],
    countsTowardControlledNovelTargetNow: true,
    nextGate: 'Monitor governed Question Studio novelty mix quality and preserve explicit-scope/language/difficulty safeguards.',
  },
  {
    topicDirectory: 'Classification',
    chapterId: 'CLS-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'CLS-QL-003 already permanently owns coherent semantic-group selection.',
      'The source-backed complete letter-cluster-pair hypothesis was implemented and frozen as CLS-QL-013.',
      'Object-bank, numeric-value, tuple-arity and cluster-length changes are governed instance variables rather than new solve contracts.',
      'CP008 final mixed-token closure found no distinct self-contained Classification solver contract and preserves neighbouring chapter ownership.',
      'CLS-001-CONTROLLED-NOVELTY-AUDIT-CLOSURE-20261002.md records the dedicated novelty decision.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on recurring source evidence for a bounded self-contained Classification contract not representable by CLS-QL-001..013.',
  },
  {
    topicDirectory: 'Clocks',
    chapterId: 'CLK-001',
    status: 'APPROVED_CONTROLLED_NOVEL_RUNTIME',
    evidence: [
      'Faulty actual→display mapping composed with hand-angle reasoning.',
      'Exact Clock solver and independent verifier agree.',
      'Human content review passed on 2026-10-02 and bounded Question Studio novelty mixing is authorized for the live chapter route.',
    ],
    countsTowardControlledNovelTargetNow: true,
    nextGate: 'Monitor bounded Question Studio mix quality and keep the shared 15–25% assembly band intact.',
  },
  {
    topicDirectory: 'Coding-Decoding',
    chapterId: 'COD-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'COD-QL-200..203 already permanently own four infer-and-encode source-gap families.',
      'CP009 already covers exact, possible, impossible, missing-member, resolved-composition and complete-domain artificial-language queries.',
      'COD-QL-199 already owns explicit conditional-table forward coding; inverse and hidden-condition variants remain explicit source gaps.',
      'Operator substitution, Input-Output, Data Sufficiency wrappers and relation puzzles remain outside COD ownership.',
      'COD-001-CONTROLLED-NOVELTY-AUDIT-CLOSURE-20261002.md records the dedicated novelty decision.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on recurring source evidence for a bounded Coding-Decoding solve contract not representable by COD-QL-001..203.',
  },
  {
    topicDirectory: 'Course-of-Action',
    chapterId: 'COA-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'COA-QL-008 already owns ordered/dependency reasoning over action sequences.',
      'COA-QL-009 already owns integrated multi-constraint action validity across evidence, proportionality, timing, authority and constraints.',
      'Three-course and five-code Either-I-or-II forms are frozen as presentation architecture rather than separate semantic contracts.',
      'Single-best-action situational judgment remains outside core COA at the Decision Making boundary.',
      'COA-001-CONTROLLED-NOVELTY-AUDIT-CLOSURE-20261002.md records the dedicated novelty decision.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on recurring source evidence for a bounded Course-of-Action learner contract not representable by the active semantic QLs.',
  },
  {
    topicDirectory: 'Data-Sufficiency',
    chapterId: 'DSF-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'DSF-QL-001 owns two-statement determinacy and DSF-QL-002 owns the complete frozen 19-state three-statement minimal-sufficient-subset lattice.',
      'Alternative singleton/pair/triple sufficient-subset structures are existing QL002 semantic states, not new solve contracts.',
      'Geometry and generic floor/box/scheduling puzzle DS remain explicit solver-authority holds.',
      'reasoning-novelty-final-pending-closures-20261002.md records the batch closure.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on a canonical held-domain solver with a materially new DS contract outside DSF-QL-001/002.',
  },
  {
    topicDirectory: 'Decision-Making',
    chapterId: 'DM-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'DM-001 freezes 60 permanent governed rule/action families across 20 checkpoints and 650 trilingual scenario authorities.',
      'The chapter already includes conjunctive eligibility, exceptions/referrals, cut-off dates, relaxations, ranking, situational action, incomplete information, multi-person and mixed-set decision contracts.',
      'Context, profile values, answer outcome, option order, language, wording and calibrated difficulty remain governed instance variation rather than new QLs.',
      'DM-001-CONTROLLED-NOVELTY-AUDIT-CLOSURE-20261003.md records the dedicated novelty decision.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only for a materially different independently verified Decision-Making learner contract outside DM-QL-001..060.',
  },
  {
    topicDirectory: 'Direction-Sense',
    chapterId: 'DIR-001',
    status: 'APPROVED_CONTROLLED_NOVEL_RUNTIME',
    evidence: [
      'A solver-backed graph-to-relative-path composition combines existing DIR-QL-004 and DIR-QL-041 skills.',
      'Primary and independent relative-path replays must agree before a candidate is emitted.',
      'Exact Pythagorean distance families and misconception-labelled direction-distance options are preserved.',
      'Human content review passed on 2026-10-02 and bounded Question Studio novelty mixing is authorized for the live chapter route.',
    ],
    countsTowardControlledNovelTargetNow: true,
    nextGate: 'Monitor bounded Question Studio mix quality and keep the shared 15–25% assembly band intact.',
  },
  {
    topicDirectory: 'Floor-and-Flat-Arrangement',
    chapterId: 'FLR-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'FLR-001 freezes four source-backed solve contracts: single-column floor, floor plus one secondary variable, bijective two-flat grid and non-bijective shared-flat capacity.',
      'Floor count, person pool, clue order, query projection, gap/parity wording, option order, language and calibrated difficulty remain governed instance or presentation variation.',
      'Vacant-flat, three-flat-per-floor and wider multi-variable variants remain explicit source-reopen holds rather than being relabelled as novelty.',
      'FLR-001-CONTROLLED-NOVELTY-AUDIT-CLOSURE-20261003.md records the dedicated novelty decision.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on recurring source evidence or an independently validated Floor/Flat learner contract outside FLR-QL-001..004.',
  },
  {
    topicDirectory: 'InputOutput',
    chapterId: 'IOP-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'IOP-001 already owns 8 permanent machine QLs across 19 source modes and 8 solve/query modes.',
      'Step/final/position/reverse/missing-state overlays and token/order/placement variations are frozen non-QL variation.',
      'Future quarantined transformation modes remain source-backed expansion candidates rather than controlled novelty.',
      'reasoning-novelty-final-pending-closures-20261002.md records the batch closure.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on source-backed or solver-backed evidence for a materially new machine transition architecture.',
  },
  {
    topicDirectory: 'Inequality',
    chapterId: 'INE-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'INE-001 owns four permanent source-backed contracts: direct relation, conclusion-set classification, either/or and coded inequality.',
      'Chain length, relation direction, strict/weak symbols, equality links, coded-symbol remapping and option order remain governed instance or presentation variation.',
      'No current candidate proves a materially different non-source-backed learner contract beyond INE-QL-001..004.',
      'INE-001-CONTROLLED-NOVELTY-AUDIT-CLOSURE-20261003.md records the dedicated novelty decision.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on a solver-backed Inequality reasoning contract outside INE-QL-001..004 with a clear boundary from Algebra, Ranking, Mathematical Operations and Data Sufficiency.',
  },
  {
    topicDirectory: 'Assertion-and-Reason',
    chapterId: 'ASM-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'ASM-001 owns one permanent source-backed learner contract covering the complete truth/explanation classification task.',
      'The five answer classes, four-option/five-option profiles, option order, subject domain, language and difficulty are governed semantic states or presentation variation rather than new QLs.',
      'The current curated trilingual corpus contains 20 scenario authorities and does not use free-form runtime truth generation.',
      'ASM-001-CONTROLLED-NOVELTY-AUDIT-CLOSURE-20261003.md records the dedicated novelty decision.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on recurring source evidence or an independently validated Assertion-and-Reason learner contract that changes the task beyond truth of A, truth of R and the explanatory link.',
  },
  {
    topicDirectory: 'Logic-Puzzles',
    chapterId: 'LP-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'LP-001 already owns 47 permanent QLs including counterfactual/state-filter reasoning in QL047.',
      'Apparent novelty candidates remain clue-topology, query-projection, scale or scenario variation inside existing puzzle solvers unless future evidence proves otherwise.',
      'Target-exam source saturation remains explicitly false, so novelty is not used to bypass the independent source/production gate.',
      'reasoning-novelty-final-three-closures-20261002.md records the dedicated novelty decision.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Complete LP target-exam source/freeze reconciliation and production-readiness source saturation separately; reopen novelty only on a materially distinct solver-backed contract.',
  },
  {
    topicDirectory: 'Mathematical-Operations',
    chapterId: 'OPS-001',
    status: 'APPROVED_CONTROLLED_NOVEL_RUNTIME',
    evidence: [
      'A hidden bijective operator mapping is inferred first, then applied to recover a missing coded symbol in a fresh target equation.',
      'The lane composes OPS-QL-028 hidden-mapping inference with OPS-QL-008 missing-operator recovery.',
      'The existing exact mapping solver proves one inferred mapping and exactly one target symbol.',
      'Human content review passed on 2026-10-02 and bounded Question Studio novelty mixing is authorized for the live chapter route.',
    ],
    countsTowardControlledNovelTargetNow: true,
    nextGate: 'Monitor bounded Question Studio mix quality and keep the shared 15–25% assembly band intact.',
  },
  {
    topicDirectory: 'Missing-Number',
    chapterId: 'MIS-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'MIS-001 already freezes 112 runtime patterns, 75 canonical semantic authorities, 37 aliases/reuse variants and 73 permanent QLs.',
      'MIS-CAND-034 and MIS-CAND-095 remain source-thin holds and are not reclassified as controlled novelty.',
      'Numeric resampling, layout substitution and recombination of already-owned formulas do not create substantive novelty.',
      'reasoning-novelty-final-pending-closures-20261002.md records the batch closure.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on recurring source evidence for a materially new missing-number semantic authority.',
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
    status: 'APPROVED_CONTROLLED_NOVEL_RUNTIME',
    evidence: [
      'Six-person multi-constraint caselets combine endpoint, exact-gap, neighbour and relative-order reasoning.',
      'All 6! orders are independently checked for one unique solution.',
      'Children map to existing RNK QLs; RNK-QL-043 remains unallocated.',
      'A truthful English-only source-backed Question Studio route now exposes the complete frozen RNK-QL-001..042 inventory.',
      'Human content review passed on 2026-10-02 and bounded Medium Question Studio novelty mixing is activated under the shared scope/language/difficulty safeguards.',
    ],
    countsTowardControlledNovelTargetNow: true,
    nextGate: 'Monitor governed Question Studio novelty mix quality; keep Hindi/Punjabi novelty disabled until their human product review is frozen.',
  },
  {
    topicDirectory: 'SeatingArrangement',
    chapterId: 'SEA-001 / SEA-002 / SEA-003',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'SEA-001 through SEA-003 now retain 40 permanent learner contracts across fifteen implemented checkpoints.',
      'The family covers linear, circular, parallel-row, square, polygonal, concentric, attribute-linked, vacant-seat, conditional, uncertain-number and post-arrangement transformation seating contracts.',
      'Name pool, attribute labels, clue order, arrangement size within an existing contract, vacancy location, exchanged occupants, query target, language and calibrated difficulty remain governed instance variation.',
      'SEA-003-CONTROLLED-NOVELTY-AUDIT-CLOSURE-20261003.md records the final approved-package novelty decision.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on recurring source evidence for a materially new seating learner contract outside SEA-QL-001..051.',
  },
  {
    topicDirectory: 'Series',
    chapterId: 'SER-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'SER-CP-010 permanently allocated all 16 retained source-backed CP008/CP009 families as inactive SER-QL-014..029.',
      'SER-001 now owns a contiguous permanent registry SER-QL-001..029; SER-QL-030 is the next available identity.',
      'Anti-inflation merges and rejected ownership cases remain exactly as frozen by the final Series audit.',
      'The promoted QLs remain inactive: Question Studio discovery, Question Bank writes, tests, mocks and public publication stay closed until a separate activation checkpoint.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Source-backed promotion is complete. Re-open only for an explicit activation checkpoint or for a distinct non-source-backed governed novelty contract.',
  },
  {
    topicDirectory: 'Statement-and-Arguments',
    chapterId: 'ARG-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'ARG-001 already freezes six semantic QLs and eight semantic archetypes per QL.',
      'The documented novel combinations are recombinations inside existing semantic authorities, so certified uniqueness/diversity is not a separate controlled-novel learner contract.',
      'The final chapter audit found no additional QL justified and directs future expansion to recurring source evidence.',
      'reasoning-novelty-final-three-closures-20261002.md records the dedicated novelty decision.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on recurring evidence or a solver-backed Statement-and-Arguments contract outside ARG-QL-001..006.',
  },
  {
    topicDirectory: 'Statement-and-Assumption',
    chapterId: 'STA-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'STA-001 V4.1 already freezes 6 semantic QLs and 108 scenario authorities.',
      'Wording/context, assumption count, option count, coded-answer order and presentation profile are explicitly non-reopening variation.',
      'No recurring authority currently proves a materially new assumption semantic contract.',
      'reasoning-novelty-final-pending-closures-20261002.md records the batch closure.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on recurring authoritative evidence for an assumption semantic contract outside STA-QL-001..006.',
  },
  {
    topicDirectory: 'Statement-and-Conclusion',
    chapterId: 'STC-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'STC-001 V2.2 already freezes 6 semantic QLs spanning direct, clause, conditional, modal, comparative and temporal entailment.',
      'Large surface breadth is already generated inside those contracts and does not constitute controlled novelty.',
      'The removed Banking five-way Either profile remains outside active non-syllogistic STC authority.',
      'reasoning-novelty-final-pending-closures-20261002.md records the batch closure.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on a solver-backed conclusion semantic contract outside STC-QL-001..006.',
  },
  {
    topicDirectory: 'Statement-and-Inference',
    chapterId: 'SIF-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'SIF\'s former NOVELTY gate was deliberately renamed NOVELTY_READINESS because it proves fingerprint readiness only.',
      'The Banking three-inference overlay is explicitly classified as a new presentation contract with novelty: NO.',
      'Current structured-support mechanisms already own the inference answer semantics; no materially distinct controlled-novel contract is proven.',
      'reasoning-novelty-final-three-closures-20261002.md records the dedicated novelty decision.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on a solver-backed inference reasoning contract outside the current structured-support authority.',
  },
  {
    topicDirectory: 'Syllogism',
    chapterId: 'SYL-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'SYL-001 V5 factorizes conclusion structure, semantic feature, premise overlay and conclusion-set relationship without QL inflation.',
      'Possibility and can-never-be are already inactive Banking variants inside the existing conclusion-set archetype rather than new QLs.',
      'Profile weighting, source sampling, Punjab scope and learner-data difficulty calibration remain separate evidence/product gates.',
      'reasoning-novelty-final-pending-closures-20261002.md records the batch closure.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on a governed syllogism reasoning contract not representable by the V5 factorized authority.',
  },
  {
    topicDirectory: 'Word-Dictionary-Order',
    chapterId: 'WOR-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'WOR-001 retains 8 permanent QLs across ordering, rank, global-character, local-character and transform-then-sort contracts.',
      'The 9 source-deferred prototypes remain research/review forms requiring source authority and are not controlled novelty.',
      'Word-bank, prefix-depth, rank-position and Banking-cluster parameter changes remain instance variation.',
      'reasoning-novelty-final-pending-closures-20261002.md records the batch closure.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on recurring source evidence or a solver-backed dictionary-order contract outside WOR-QL-001..008.',
  },
  {
    topicDirectory: 'Word-Formation',
    chapterId: 'WFM-001',
    status: 'DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER',
    evidence: [
      'WFM-001 retains 6 permanent QLs with conventional SSC, Banking and Punjab coverage closed.',
      'Current authority requires recurring exam evidence for any materially new WFM contract rather than wording/object variation.',
      'No currently identified candidate satisfies a distinct governed controlled-novel solve contract.',
      'reasoning-novelty-final-pending-closures-20261002.md records the batch closure.',
    ],
    countsTowardControlledNovelTargetNow: false,
    nextGate: 'Re-open only on recurring authoritative evidence or an explicitly governed additive novelty contract outside WFM-QL-001..006.',
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
