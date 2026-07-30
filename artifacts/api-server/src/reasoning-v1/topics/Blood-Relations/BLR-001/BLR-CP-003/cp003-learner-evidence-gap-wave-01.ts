import type { BlrCp003ProvisionalNewAuthority } from "./cp003-merge-split-audit";

export const BLR_CP003_LEARNER_EVIDENCE_GAP_WAVE_01_VERSION =
  "BLR_CP003_LEARNER_EVIDENCE_GAP_WAVE_01" as const;

export type BlrCp003BlockedAuthority = Exclude<
  BlrCp003ProvisionalNewAuthority,
  "IDENTIFY_PERSON_BY_EXACT_LINEAGE"
>;

export interface BlrCp003GapWaveAuthorityPlan {
  authority: BlrCp003BlockedAuthority;
  disposition: "RETAIN_AND_PROVE";
  currentActiveRecords: 0;
  minimumCandidateRecords: 4;
  candidateTaskContract: string;
  evidenceContract: readonly string[];
  implementationBoundary: readonly string[];
  humanReviewRequired: true;
}

export const BLR_CP003_LEARNER_EVIDENCE_GAP_WAVE_01:
  readonly BlrCp003GapWaveAuthorityPlan[] = [
    {
      authority: "DETERMINE_MEMBER_GENDER",
      disposition: "RETAIN_AND_PROVE",
      currentActiveRecords: 0,
      minimumCandidateRecords: 4,
      candidateTaskContract:
        "Identify a relation-qualified member from the shared graph, then return that member's entailed gender label.",
      evidenceContract: [
        "The target member must be identified through at least two family links.",
        "The displayed passage must not state the final gender proposition verbatim.",
        "The answer remains MALE or FEMALE; the relation-qualified target is query evidence, not a second answer.",
      ],
      implementationBoundary: [
        "Preserve the person-to-gender inverse distinction from BLR-QL-003.",
        "Reject gender inference from names alone.",
        "Expose the decisive target-person path in the SVG and explanation.",
      ],
      humanReviewRequired: true,
    },
    {
      authority: "SELECT_UNORDERED_FAMILY_PAIR",
      disposition: "RETAIN_AND_PROVE",
      currentActiveRecords: 0,
      minimumCandidateRecords: 4,
      candidateTaskContract:
        "Select the unordered pair satisfying a derived multi-edge family connection such as cousins, grandparent-grandchild, or uncle/aunt with nephew/niece.",
      evidenceContract: [
        "At least one decisive path for the correct pair must contain two or more family links.",
        "Pair order must remain semantically irrelevant.",
        "The correct pair proposition must not repeat one displayed clue.",
      ],
      implementationBoundary: [
        "Do not relabel the task as BLR-QL-004 ordered relation-pair selection.",
        "Treat connection type as an instance property.",
        "Show both selected members and the decisive family path in the SVG.",
      ],
      humanReviewRequired: true,
    },
    {
      authority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
      disposition: "RETAIN_AND_PROVE",
      currentActiveRecords: 0,
      minimumCandidateRecords: 4,
      candidateTaskContract:
        "Return the complete set of members satisfying a derived relation, such as all cousins or all grandchildren of a named member.",
      evidenceContract: [
        "Every correct set member must require a two-edge-or-more derivation.",
        "The option must contain all matches and no extra member.",
        "No displayed clue may state the complete answer set.",
      ],
      implementationBoundary: [
        "Keep the set-valued answer distinct from BLR-QL-002 one-person identification.",
        "Audit omission and extra-member distractors separately.",
        "Highlight every accepted set member in the visual explanation.",
      ],
      humanReviewRequired: true,
    },
    {
      authority: "DETERMINE_MEMBER_MARITAL_STATUS",
      disposition: "RETAIN_AND_PROVE",
      currentActiveRecords: 0,
      minimumCandidateRecords: 4,
      candidateTaskContract:
        "Identify a relation-qualified member through the shared graph, then determine that member's married or explicitly unmarried status.",
      evidenceContract: [
        "The target member must require at least two family links to identify.",
        "Married status requires a spouse edge or explicit married fact.",
        "Unmarried status requires an explicit unmarried fact; missing spouse data is insufficient.",
      ],
      implementationBoundary: [
        "Preserve the unary status-label answer contract.",
        "Do not infer co-parenthood from marriage alone.",
        "Separate target identification evidence from status evidence in the explanation.",
      ],
      humanReviewRequired: true,
    },
    {
      authority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
      disposition: "RETAIN_AND_PROVE",
      currentActiveRecords: 0,
      minimumCandidateRecords: 4,
      candidateTaskContract:
        "Identify the unique member satisfying both a derived relation branch and a proved marital-status predicate.",
      evidenceContract: [
        "Candidate qualification must combine kinship reconstruction with status evidence.",
        "The correct person must be unique among the stated candidate domain.",
        "The answer proposition must not be copied from one displayed sentence.",
      ],
      implementationBoundary: [
        "Keep the status predicate distinct from BLR-QL-002 relation-only identification.",
        "Require explicit unmarried evidence where applicable.",
        "Explain why each distractor fails either the relation or status condition.",
      ],
      humanReviewRequired: true,
    },
  ] as const;

export const BLR_CP003_GAP_WAVE_01_RELEASE_LOCK = {
  preserveApprovedV5Pack: true,
  candidatePackVersion: "V6",
  minimumCandidateRecordsPerAuthority: 4,
  humanReviewRequired: true,
  finalFreezeAllowed: false,
  permanentQlAllocationAllowed: false,
  nextAvailableChapterQlId: "BLR-QL-009",
  questionStudioAllowed: false,
  questionBankWriteAllowed: false,
  mockTestAllowed: false,
  localisationAllowed: false,
  publicPublicationAllowed: false,
  mergeAllowed: false,
} as const;
