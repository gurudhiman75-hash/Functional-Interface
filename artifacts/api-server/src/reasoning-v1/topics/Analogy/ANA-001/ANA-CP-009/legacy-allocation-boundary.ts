export type AnaCp009LegacyVerdict =
  | "DELEGATE_EXISTING_AUTHORITY"
  | "PRESENTATION_NOT_AUTHORITY"
  | "QUARANTINE_SOURCE_REQUIRED";

export interface AnaCp009LegacyFamilyDecision {
  legacyFamilyId: string;
  legacyTitles: readonly [string, string];
  formerQlRange: string;
  verdict: AnaCp009LegacyVerdict;
  destination: string;
  rationale: string;
  permanentQlIds: readonly [];
}

/**
 * The original ANA-001 design reserved 24 CP-009 QLs before the earlier
 * checkpoints were saturated. These entries are historical labels only.
 * No former QL number or count survives this boundary audit.
 */
export const ANA_CP009_LEGACY_FAMILY_DECISIONS: readonly AnaCp009LegacyFamilyDecision[] = [
  {
    legacyFamilyId: "ADV_TWO_ARITHMETIC_OPERATIONS",
    legacyTitles: [
      "Two arithmetic operations — direct completion",
      "Two arithmetic operations — pair selection",
    ],
    formerQlRange: "ANA-QL-237..238",
    verdict: "DELEGATE_EXISTING_AUTHORITY",
    destination: "ANA-CP-003 through ANA-CP-005 numeric rule authorities",
    rationale: "Using two arithmetic stages changes rule complexity, not checkpoint ownership. A source-backed formula must be registered in the appropriate numeric authority and checked against the complete numeric ambiguity pool.",
    permanentQlIds: [],
  },
  {
    legacyFamilyId: "ADV_POWER_PLUS_DIGIT_OPERATION",
    legacyTitles: [
      "Power plus digit operation — direct completion",
      "Power plus digit operation — pair selection",
    ],
    formerQlRange: "ANA-QL-239..240",
    verdict: "DELEGATE_EXISTING_AUTHORITY",
    destination: "ANA-CP-005 digit-based numeric analogy",
    rationale: "A power combined with digit decomposition remains a numeric relation. It does not become a meta-analogy unless a separate visible rule derives which operation must be used across complete pairs.",
    permanentQlIds: [],
  },
  {
    legacyFamilyId: "ADV_INFER_FROM_TWO_EXAMPLES",
    legacyTitles: [
      "Infer relation from two examples — direct completion",
      "Infer relation from two examples — pair selection",
    ],
    formerQlRange: "ANA-QL-241..242",
    verdict: "PRESENTATION_NOT_AUTHORITY",
    destination: "Presentation layer over the underlying frozen rule",
    rationale: "Showing two complete examples increases evidence and inference depth but does not define a new solve authority. Ownership follows the rule that explains the pairs.",
    permanentQlIds: [],
  },
  {
    legacyFamilyId: "ADV_REVERSE_DIRECTION_TRANSFER",
    legacyTitles: [
      "Reverse-direction transfer — direct completion",
      "Reverse-direction transfer — pair selection",
    ],
    formerQlRange: "ANA-QL-243..244",
    verdict: "PRESENTATION_NOT_AUTHORITY",
    destination: "Inverse-presentation audit for the underlying checkpoint",
    rationale: "Placing the blank on the input side or solving an invertible rule backwards is a presentation contract. It must not create a second solver authority for the same relation.",
    permanentQlIds: [],
  },
  {
    legacyFamilyId: "ADV_NUMBER_TO_LETTER",
    legacyTitles: [
      "Number-to-letter position analogy — direct completion",
      "Number-to-letter position analogy — pair selection",
    ],
    formerQlRange: "ANA-QL-245..246",
    verdict: "DELEGATE_EXISTING_AUTHORITY",
    destination: "ANA-CP-008 mixed-token authority or Coding-Decoding",
    rationale: "Transparent number-to-letter conversion is cross-domain but pair-local. Analogy framing may belong to CP-008; direct encode/decode or recovered code tables belong to Coding-Decoding.",
    permanentQlIds: [],
  },
  {
    legacyFamilyId: "ADV_LETTER_TO_NUMBER",
    legacyTitles: [
      "Letter-to-number position analogy — direct completion",
      "Letter-to-number position analogy — pair selection",
    ],
    formerQlRange: "ANA-QL-247..248",
    verdict: "DELEGATE_EXISTING_AUTHORITY",
    destination: "ANA-CP-007/ANA-CP-008 or Coding-Decoding by task framing",
    rationale: "Alphabet-position output is already owned by word-structure or mixed-token authorities when presented as analogy. Encoding prompts remain outside Analogy.",
    permanentQlIds: [],
  },
  {
    legacyFamilyId: "ADV_WORD_LENGTH_ALPHA_VALUE",
    legacyTitles: [
      "Word length plus alphabet value — direct completion",
      "Word length plus alphabet value — pair selection",
    ],
    formerQlRange: "ANA-QL-249..250",
    verdict: "DELEGATE_EXISTING_AUTHORITY",
    destination: "ANA-CP-007 word-structure authority after source proof",
    rationale: "A formula that combines word length and alphabet values is word-to-number structure. It requires a source-backed explicit formula and CP-007 collision checks, not an advanced catch-all label.",
    permanentQlIds: [],
  },
  {
    legacyFamilyId: "ADV_CLOSE_SEMANTIC_RELATIONS",
    legacyTitles: [
      "Close semantic relation discrimination — direct completion",
      "Close semantic relation discrimination — pair selection",
    ],
    formerQlRange: "ANA-QL-251..252",
    verdict: "DELEGATE_EXISTING_AUTHORITY",
    destination: "ANA-CP-001/ANA-CP-002 curated semantic relation datasets",
    rationale: "Closer distractors and finer relation labels increase semantic difficulty but do not create a new meta-rule. They belong in curated semantic datasets with directional relation metadata.",
    permanentQlIds: [],
  },
  {
    legacyFamilyId: "ADV_HIERARCHY_SEMANTIC",
    legacyTitles: [
      "Hierarchy-sensitive semantic analogy — direct completion",
      "Hierarchy-sensitive semantic analogy — pair selection",
    ],
    formerQlRange: "ANA-QL-253..254",
    verdict: "DELEGATE_EXISTING_AUTHORITY",
    destination: "ANA-CP-001/ANA-CP-002 curated hierarchy relations",
    rationale: "Genus-species, part-whole and hierarchy depth are semantic relation properties. They require curated facts and precise distractors, not a separate advanced symbolic runtime.",
    permanentQlIds: [],
  },
  {
    legacyFamilyId: "ADV_CONDITIONAL_BRANCH",
    legacyTitles: [
      "Conditional branch rule — direct completion",
      "Conditional branch rule — pair selection",
    ],
    formerQlRange: "ANA-QL-255..256",
    verdict: "QUARANTINE_SOURCE_REQUIRED",
    destination: "Potential ANA-CP-009 family only after recurring source proof",
    rationale: "A genuine visible condition that selects between pair-local rules could be meta-analogy. The inherited label provides no exam fixture, branch predicate, bounded rule whitelist or uniqueness proof, so it cannot receive QLs yet.",
    permanentQlIds: [],
  },
  {
    legacyFamilyId: "ADV_INCORRECT_ANALOGY",
    legacyTitles: [
      "Identify the incorrect analogy in an option set",
      "Identify the relation-breaking pair in a matched set",
    ],
    formerQlRange: "ANA-QL-257..258",
    verdict: "PRESENTATION_NOT_AUTHORITY",
    destination: "Odd/incorrect-pair presentation owned by each underlying rule",
    rationale: "Selecting the broken pair is already a validated presentation contract in operational checkpoints. A generic cross-rule option set would weaken ownership and ambiguity validation.",
    permanentQlIds: [],
  },
  {
    legacyFamilyId: "ADV_MOST_PRECISE_RELATION",
    legacyTitles: [
      "Choose the most precise relation label",
      "Choose the most precise matching pair",
    ],
    formerQlRange: "ANA-QL-259..260",
    verdict: "DELEGATE_EXISTING_AUTHORITY",
    destination: "ANA-CP-001/ANA-CP-002 semantic precision review",
    rationale: "Relation-label precision is an editorial and dataset concern. The matching-pair form remains ordinary semantic analogy, while a standalone label question is not automatically an analogy QL.",
    permanentQlIds: [],
  },
] as const;
