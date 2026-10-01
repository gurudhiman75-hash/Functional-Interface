import { generateDsfCp021RankingQuestion } from "../DSF-CP-021/ranking-three-statement-batch-v1.ts";
import { generateDsfCp022DirectionQuestion } from "../DSF-CP-022/direction-three-statement-batch-v1.ts";
import { generateDsfCp023BloodQuestion } from "../DSF-CP-023/blood-relations-three-statement-batch-v1.ts";
import { generateDsfCp024InequalityQuestion } from "../DSF-CP-024/inequality-three-statement-batch-v1.ts";
import { generateDsfCp025SeatingQuestion } from "../DSF-CP-025/seating-three-statement-batch-v1.ts";
import { generateDsfCp026CodingQuestion } from "../DSF-CP-026/coding-three-statement-batch-v1.ts";
import { generateDsfCp027CalendarQuestion } from "../DSF-CP-027/calendar-three-statement-batch-v1.ts";

export const DSF_CP028_REASONING_QL002_CONSOLIDATION_VERSION =
  "DSF_CP028_REASONING_QL002_CONSOLIDATION_V1" as const;

export const DSF_CP028_REASONING_QL002_DOMAINS = Object.freeze([
  Object.freeze({
    domainId: "RANKING" as const,
    sourceChapterId: "RNK-001" as const,
    checkpointId: "DSF-CP-021" as const,
    generator: generateDsfCp021RankingQuestion,
  }),
  Object.freeze({
    domainId: "DIRECTION" as const,
    sourceChapterId: "REAS-DIR" as const,
    checkpointId: "DSF-CP-022" as const,
    generator: generateDsfCp022DirectionQuestion,
  }),
  Object.freeze({
    domainId: "BLOOD_RELATIONS" as const,
    sourceChapterId: "BLR-001" as const,
    checkpointId: "DSF-CP-023" as const,
    generator: generateDsfCp023BloodQuestion,
  }),
  Object.freeze({
    domainId: "INEQUALITY" as const,
    sourceChapterId: "REAS-INEQ" as const,
    checkpointId: "DSF-CP-024" as const,
    generator: generateDsfCp024InequalityQuestion,
  }),
  Object.freeze({
    domainId: "SEATING" as const,
    sourceChapterId: "SEA-001" as const,
    checkpointId: "DSF-CP-025" as const,
    generator: generateDsfCp025SeatingQuestion,
  }),
  Object.freeze({
    domainId: "CODING" as const,
    sourceChapterId: "COD-001" as const,
    checkpointId: "DSF-CP-026" as const,
    generator: generateDsfCp026CodingQuestion,
  }),
  Object.freeze({
    domainId: "CALENDAR" as const,
    sourceChapterId: "CAL-001" as const,
    checkpointId: "DSF-CP-027" as const,
    generator: generateDsfCp027CalendarQuestion,
  }),
] as const);

export const DSF_CP028_REASONING_QL002_STATUS = Object.freeze({
  packageId: "DSF-001" as const,
  checkpointId: "DSF-CP-028" as const,
  qlId: "DSF-QL-002" as const,
  taskContract: "THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS" as const,
  answerSemantic: "MINIMAL_SUFFICIENT_STATEMENT_SUBSET" as const,
  statementCount: 3 as const,
  frozenSemanticStateCount: 19 as const,
  reasoningDomainCount: DSF_CP028_REASONING_QL002_DOMAINS.length,
  reasoningDomainIds: Object.freeze(DSF_CP028_REASONING_QL002_DOMAINS.map((entry) => entry.domainId)),
  contentStatus: "REASONING_MULTI_DOMAIN_RUNTIME_REVIEW_COMPLETE_PENDING_EDITORIAL_RELEASE" as const,
  lifecycle: Object.freeze({
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
  }),
});

export function generateDsfCp028ReasoningQl002Question(
  domainId: (typeof DSF_CP028_REASONING_QL002_DOMAINS)[number]["domainId"],
  seed: string | number,
) {
  const domain = DSF_CP028_REASONING_QL002_DOMAINS.find((entry) => entry.domainId === domainId);
  if (!domain) throw new Error(`Unsupported CP028 QL002 reasoning domain '${String(domainId)}'.`);
  return domain.generator(seed);
}
