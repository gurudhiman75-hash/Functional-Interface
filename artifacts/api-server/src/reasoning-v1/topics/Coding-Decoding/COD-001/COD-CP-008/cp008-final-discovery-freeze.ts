import { CP008_SEMANTIC_FACTS } from "./cp008-curated-facts";
import { CP008_PROTOTYPE_CONTRACTS } from "./cp008-prototype-contracts";

export const COD_CP008_ENGLISH_DISCOVERY_FREEZE_V1 = {
  freezeVersion: "COD_CP008_ENGLISH_DISCOVERY_FREEZE_V1",
  checkpointId: "COD-CP-008",
  permanentQlCount: 0,
  nextAvailableQlId: "COD-QL-173",
  retainedRuleFamilies: [
    "DIRECT_RENAMED_LABEL",
    "SEMANTIC_REFERENT_THEN_RENAME",
  ],
  prototypeContracts: CP008_PROTOTYPE_CONTRACTS.map(({ prototypeId, taskKind, ruleId }) => ({
    prototypeId,
    taskKind,
    ruleId,
  })),
  semanticFactCount: CP008_SEMANTIC_FACTS.length,
  semanticFactCategories: ["ATTRIBUTE", "CATEGORY", "FUNCTION", "ROLE"],
  admittedTopologies: ["OPEN_CHAIN", "CYCLE"],
  mergeDecisions: [
    "Chain length is an instance property.",
    "Open-chain and cycle topology are instance properties.",
    "Colour, object, profession, body-part, food and time-unit contexts are curated dataset variants.",
    "Option-selection wording is a presentation variant.",
    "Repeatedly following the renaming chain is a distractor misconception, not a solve contract.",
  ],
  excludedOrDelegatedCandidates: [
    {
      candidate: "CHARACTER_OR_TOKEN_SUBSTITUTION",
      disposition: "DELEGATE_COD_CP001",
      reason: "Visible character-by-character substitution is already owned by direct mapping.",
    },
    {
      candidate: "SENTENCE_OR_ARTIFICIAL_LANGUAGE_OVERLAP",
      disposition: "DELEGATE_COD_CP009",
      reason: "Sentence overlap and token deduction are owned by artificial-language coding.",
    },
    {
      candidate: "CONDITIONAL_RENAMING_TABLE",
      disposition: "DELEGATE_COD_CP010",
      reason: "Conditional lookup and precedence are owned by conditional coding.",
    },
    {
      candidate: "INVERSE_ORIGINAL_REFERENT_QUERY",
      disposition: "SOURCE_GAP_EXCLUDE",
      reason: "No recurring materially distinct target-exam format was found.",
    },
    {
      candidate: "MULTI_HOP_RENAMING",
      disposition: "REJECT_MISCONCEPTION",
      reason: "The assigned label is applied once; following the chain repeatedly changes the source question.",
    },
    {
      candidate: "UNSTABLE_OR_AMBIGUOUS_FACTS",
      disposition: "REJECT_DATASET",
      reason: "Time-sensitive, disputed or multi-answer semantic facts are unsafe for generation.",
    },
  ],
  allocationPlanAfterFreezeApproval: [
    { qlId: "COD-QL-173", ruleId: "DIRECT_RENAMED_LABEL" },
    { qlId: "COD-QL-174", ruleId: "SEMANTIC_REFERENT_THEN_RENAME" },
  ],
  localeStatus: "ENGLISH_DISCOVERY_ONLY",
  publiclyPublishable: false,
  questionStudioVisible: false,
} as const;
