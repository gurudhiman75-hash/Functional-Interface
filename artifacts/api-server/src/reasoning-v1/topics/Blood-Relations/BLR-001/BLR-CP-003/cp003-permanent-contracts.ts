import {
  BLR_CP003_PERMANENT_QL_BY_AUTHORITY,
  type BlrCp003PermanentAuthority,
  type BlrCp003PermanentQlId,
} from "./cp003-final-authority-audit";
import { generateBlrCp003FinalApprovedBank } from "./cp003-final-approved-bank";

export type BlrCp003QuestionForm =
  | "SELECT_COUPLE_PAIR"
  | "SELECT_SIBLING_PAIR"
  | "SELECT_PARENT_CHILD_PAIR"
  | "SELECT_MIXED_RELATION_PAIR"
  | "IDENTIFY_COMPLETE_RELATION_SET"
  | "IDENTIFY_COMPLETE_IN_LAW_SET"
  | "IDENTIFY_COMPLETE_MULTI_BRANCH_SET"
  | "IDENTIFY_EXPLICITLY_MARRIED_MEMBER"
  | "IDENTIFY_EXPLICITLY_UNMARRIED_MEMBER"
  | "IDENTIFY_UNRESOLVED_STATUS_MEMBER"
  | "IDENTIFY_PATERNAL_LINEAGE_PERSON"
  | "IDENTIFY_MATERNAL_LINEAGE_PERSON"
  | "IDENTIFY_GREAT_LINEAGE_PERSON";

export interface BlrCp003PermanentContract {
  qlId: BlrCp003PermanentQlId;
  checkpointId: "BLR-CP-003";
  solveAuthority: BlrCp003PermanentAuthority;
  sourcePrototypeIds: readonly string[];
  questionForms: readonly BlrCp003QuestionForm[];
  answerType:
    | "UNORDERED_PERSON_PAIR"
    | "PERSON_NAME_SET"
    | "PERSON_NAME";
  status: "ENGLISH_DISCOVERY_FROZEN";
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
}

const finalBank = generateBlrCp003FinalApprovedBank();

function sourcePrototypeIdsFor(
  authority: BlrCp003PermanentAuthority,
): readonly string[] {
  return [
    ...new Set(
      finalBank
        .filter((record) => record.finalAuthority === authority)
        .map((record) => record.sourcePrototypeId),
    ),
  ].sort();
}

export const BLR_CP003_PERMANENT_CONTRACTS: readonly BlrCp003PermanentContract[] = [
  {
    qlId: BLR_CP003_PERMANENT_QL_BY_AUTHORITY.SELECT_UNORDERED_FAMILY_PAIR,
    checkpointId: "BLR-CP-003",
    solveAuthority: "SELECT_UNORDERED_FAMILY_PAIR",
    sourcePrototypeIds: sourcePrototypeIdsFor("SELECT_UNORDERED_FAMILY_PAIR"),
    questionForms: [
      "SELECT_COUPLE_PAIR",
      "SELECT_SIBLING_PAIR",
      "SELECT_PARENT_CHILD_PAIR",
      "SELECT_MIXED_RELATION_PAIR",
    ],
    answerType: "UNORDERED_PERSON_PAIR",
    status: "ENGLISH_DISCOVERY_FROZEN",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
  },
  {
    qlId: BLR_CP003_PERMANENT_QL_BY_AUTHORITY.IDENTIFY_ALL_MEMBERS_BY_RELATION,
    checkpointId: "BLR-CP-003",
    solveAuthority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    sourcePrototypeIds: sourcePrototypeIdsFor(
      "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    ),
    questionForms: [
      "IDENTIFY_COMPLETE_RELATION_SET",
      "IDENTIFY_COMPLETE_IN_LAW_SET",
      "IDENTIFY_COMPLETE_MULTI_BRANCH_SET",
    ],
    answerType: "PERSON_NAME_SET",
    status: "ENGLISH_DISCOVERY_FROZEN",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
  },
  {
    qlId: BLR_CP003_PERMANENT_QL_BY_AUTHORITY.IDENTIFY_MEMBER_BY_MARITAL_STATUS,
    checkpointId: "BLR-CP-003",
    solveAuthority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    sourcePrototypeIds: sourcePrototypeIdsFor(
      "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    ),
    questionForms: [
      "IDENTIFY_EXPLICITLY_MARRIED_MEMBER",
      "IDENTIFY_EXPLICITLY_UNMARRIED_MEMBER",
      "IDENTIFY_UNRESOLVED_STATUS_MEMBER",
    ],
    answerType: "PERSON_NAME",
    status: "ENGLISH_DISCOVERY_FROZEN",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
  },
  {
    qlId: BLR_CP003_PERMANENT_QL_BY_AUTHORITY.IDENTIFY_PERSON_BY_EXACT_LINEAGE,
    checkpointId: "BLR-CP-003",
    solveAuthority: "IDENTIFY_PERSON_BY_EXACT_LINEAGE",
    sourcePrototypeIds: sourcePrototypeIdsFor(
      "IDENTIFY_PERSON_BY_EXACT_LINEAGE",
    ),
    questionForms: [
      "IDENTIFY_PATERNAL_LINEAGE_PERSON",
      "IDENTIFY_MATERNAL_LINEAGE_PERSON",
      "IDENTIFY_GREAT_LINEAGE_PERSON",
    ],
    answerType: "PERSON_NAME",
    status: "ENGLISH_DISCOVERY_FROZEN",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
  },
] as const;

export function getBlrCp003PermanentContract(
  qlId: BlrCp003PermanentQlId,
): BlrCp003PermanentContract {
  const contract = BLR_CP003_PERMANENT_CONTRACTS.find(
    (entry) => entry.qlId === qlId,
  );
  if (!contract) throw new Error(`Unknown BLR-CP-003 QL '${qlId}'.`);
  return contract;
}
