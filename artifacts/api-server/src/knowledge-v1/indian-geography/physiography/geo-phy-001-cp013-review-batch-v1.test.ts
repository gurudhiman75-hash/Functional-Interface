import { auditGeoPhy001Cp013ReviewBatchV1 } from "./geo-phy-001-cp013-review-batch-v1";
import { auditGeoPhy001ChapterClosureV1 } from "./geo-phy-001-chapter-closure-v1";

const cp013 = auditGeoPhy001Cp013ReviewBatchV1();
const closure = auditGeoPhy001ChapterClosureV1();

const contractIssues: string[] = [];
if (cp013.questionCount !== 108) contractIssues.push(`MASTER_COUNT:${cp013.questionCount}`);
if (cp013.permanentQlBreadth !== 108) contractIssues.push(`MASTER_QL_BREADTH:${cp013.permanentQlBreadth}`);
if (cp013.sourceCheckpointBreadth !== 12) contractIssues.push(`MASTER_CP_BREADTH:${cp013.sourceCheckpointBreadth}`);
if (cp013.answerPositions.join(",") !== "27,27,27,27") contractIssues.push(`MASTER_ANSWER_BALANCE:${cp013.answerPositions.join(",")}`);
if (closure.owningQuestionCount !== 648) contractIssues.push(`OWNING_TOTAL:${closure.owningQuestionCount}`);
if (closure.permanentQlCount !== 108) contractIssues.push(`PERMANENT_QL_TOTAL:${closure.permanentQlCount}`);
if (closure.payloadsPerPermanentQl !== 6) contractIssues.push(`PAYLOAD_DEPTH:${closure.payloadsPerPermanentQl}`);
if (closure.exhaustiveMasterQuestionCount !== 108) contractIssues.push(`CLOSURE_MASTER_COUNT:${closure.exhaustiveMasterQuestionCount}`);
if (closure.cp013AddsPermanentQls) contractIssues.push("CP013_ADDS_PERMANENT_QLS");

if (!cp013.valid || !closure.valid || contractIssues.length) {
  console.error(JSON.stringify({ cp013, closure, contractIssues }, null, 2));
  throw new Error(`GEO-PHY-001 exhaustive closure failed: ${[...cp013.issues, ...closure.issues, ...contractIssues].join(" | ")}`);
}

console.log(JSON.stringify({ cp013, closure }));
