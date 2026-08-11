import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { MAL_CP004_PERMANENT_QL_IDS } from "./foundation/cp004-permanent-runtime";
import {
  MAL_CP005_DISCOVERY_PROTOTYPE_IDS,
  type MalCp005DiscoveryPrototypeId,
} from "./foundation/cp005-types";
import {
  MAL_CP005_WAVE02_PROTOTYPE_DECISIONS,
} from "./foundation/cp005-wave02-merge-split";
import {
  MAL_CP005_WAVE02_SOURCE_FIXTURES,
} from "./foundation/cp005-wave02-source-fixtures";
import { generateMalCp005ExamReadyV2Question } from "./foundation/cp005-exam-ready-v2-runtime";
import {
  MAL_CP005_WAVE03_CANDIDATE_ID,
} from "./foundation/cp005-wave03-price-change-candidate";
import {
  generateMalCp005Wave03ProductReadyV2,
} from "./foundation/cp005-wave03-product-ready-v2";
import {
  MAL_CP005_PERMANENT_ALLOCATION,
  MAL_CP005_PERMANENT_ALLOCATION_ID,
  MAL_CP005_PERMANENT_QL_IDS,
  MAL_CP005_PERMANENT_QL_RANGE,
} from "./foundation/cp005-permanent-allocation-v1";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

const numericQl = (qlId: string): number => {
  const match = qlId.match(/^(?:MAL)-QL-(\d+)$/u);
  if (!match) fail(`Invalid MAL QL ID: ${qlId}.`);
  return Number(match[1]);
};

assert(
  MAL_CP005_PERMANENT_ALLOCATION_ID === "MAL-CP005-EN-PERMANENT-ALLOCATION-V1",
  "Permanent allocation ID changed.",
);
assert(MAL_CP005_PERMANENT_QL_RANGE === "MAL-QL-048..MAL-QL-060", "QL range changed.");
assert(MAL_CP005_PERMANENT_ALLOCATION.length === 13, "CP-005 must freeze 13 approved task contracts.");
assert(MAL_CP005_PERMANENT_QL_IDS.length === 13, "CP-005 permanent QL count changed.");

const previousQlNumbers = MAL_CP004_PERMANENT_QL_IDS.map(numericQl);
const cp005QlNumbers = MAL_CP005_PERMANENT_QL_IDS.map(numericQl);
assert(Math.max(...previousQlNumbers) === 47, "CP-004 no longer ends at MAL-QL-047.");
assert(cp005QlNumbers[0] === 48, "CP-005 must begin at MAL-QL-048.");
assert(cp005QlNumbers.at(-1) === 60, "CP-005 must end at MAL-QL-060.");
for (let index = 1; index < cp005QlNumbers.length; index += 1) {
  assert(
    cp005QlNumbers[index] === cp005QlNumbers[index - 1]! + 1,
    `CP-005 QL range is not contiguous at index ${index}.`,
  );
}
assert(
  !MAL_CP005_PERMANENT_QL_IDS.some((qlId) =>
    (MAL_CP004_PERMANENT_QL_IDS as readonly string[]).includes(qlId),
  ),
  "CP-005 permanent QLs collide with CP-004.",
);
assert(new Set(MAL_CP005_PERMANENT_QL_IDS).size === 13, "Permanent QLs are not unique.");
assert(
  new Set(MAL_CP005_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size === 13,
  "Permanent solve-mode IDs are not unique.",
);
assert(
  new Set(MAL_CP005_PERMANENT_ALLOCATION.map((entry) => entry.qlTemplateId)).size === 13,
  "Permanent QL-template IDs are not unique.",
);
assert(
  new Set(MAL_CP005_PERMANENT_ALLOCATION.map((entry) => entry.authorityId)).size === 13,
  "A task-contract authority was duplicated during permanent allocation.",
);

const expectedAuthorities = new Set<string>([
  ...MAL_CP005_DISCOVERY_PROTOTYPE_IDS,
  MAL_CP005_WAVE03_CANDIDATE_ID,
]);
assert(expectedAuthorities.size === 13, "Expected authority universe must contain 13 contracts.");
for (const allocation of MAL_CP005_PERMANENT_ALLOCATION) {
  assert(expectedAuthorities.has(allocation.authorityId), `${allocation.qlId}: unknown authority.`);
  assert(allocation.permanentIdentityFrozen, `${allocation.qlId}: permanent identity is not frozen.`);
  assert(
    allocation.allocationStatus === "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_ALLOCATION",
    `${allocation.qlId}: allocation lifecycle changed.`,
  );
  assert(allocation.reviewStatus === "PRODUCT_REVIEW_APPROVED", `${allocation.qlId}: product approval missing.`);
  assert(
    allocation.approvalScope === "PERMANENT_IDENTITY_ALLOCATION_ONLY",
    `${allocation.qlId}: approval scope widened.`,
  );
  assert(
    !allocation.active &&
      !allocation.publiclyPublishable &&
      !allocation.questionStudioDiscoverable &&
      !allocation.questionBankWritable &&
      !allocation.testEligible,
    `${allocation.qlId}: delivery capability became enabled during identity allocation.`,
  );
  assert(allocation.sourceEvidence.length > 0, `${allocation.qlId}: normalized source evidence missing.`);
}

for (const prototypeId of MAL_CP005_DISCOVERY_PROTOTYPE_IDS) {
  const decision = MAL_CP005_WAVE02_PROTOTYPE_DECISIONS.find(
    (entry) => entry.prototypeId === prototypeId,
  );
  assert(decision, `${prototypeId}: Wave 02 decision missing.`);
  assert(
    decision.decision === "RETAIN_DISTINCT_TASK_CONTRACT",
    `${prototypeId}: non-retained prototype was permanently allocated.`,
  );
}

const coreCounts = new Map<string, number>();
for (const entry of MAL_CP005_PERMANENT_ALLOCATION) {
  coreCounts.set(entry.coreFamily, (coreCounts.get(entry.coreFamily) ?? 0) + 1);
}
assert(coreCounts.size === 3, `Expected 3 shared mathematical cores, received ${coreCounts.size}.`);
assert(coreCounts.get("FREE_ADULTERANT_AT_PURE_COST") === 6, "Pure-cost core must own 6 QLs.");
assert(coreCounts.get("FREE_ADULTERANT_COMMERCIAL_RATE") === 4, "Free-commercial core must own 4 QLs.");
assert(coreCounts.get("PAID_CHEAPER_INGREDIENT_COMMERCIAL") === 3, "Cheaper-paid core must own 3 QLs.");

const normalizedSourceIds = new Set(MAL_CP005_WAVE02_SOURCE_FIXTURES.map((source) => source.sourceId));
for (const allocation of MAL_CP005_PERMANENT_ALLOCATION) {
  for (const sourceId of allocation.sourceEvidence) {
    assert(normalizedSourceIds.has(sourceId), `${allocation.qlId}: source ${sourceId} is not normalized.`);
  }
}

let generatedRouteProofs = 0;
let productApprovalProofs = 0;
let lifecycleIsolationProofs = 0;
let terminologyProofs = 0;
let answerSemanticProofs = 0;
const previewRows: Array<{
  qlId: string;
  solveModeId: string;
  authorityId: string;
  coreFamily: string;
  sampleQuestionId: string;
  sampleStem: string;
  answerSemantic: string;
}> = [];

for (const allocation of MAL_CP005_PERMANENT_ALLOCATION) {
  for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
    const seed = `mal-cp005-wave04:${allocation.qlId}:${seedIndex}`;
    if (allocation.authorityId === MAL_CP005_WAVE03_CANDIDATE_ID) {
      const question = generateMalCp005Wave03ProductReadyV2(seed);
      assert(question.candidateId === allocation.authorityId, `${allocation.qlId}: candidate route mismatch.`);
      assert(question.reviewStatus === "PRODUCT_REVIEW_APPROVED", `${allocation.qlId}: candidate lost approval.`);
      assert(question.approvalScope === "PRODUCT_REVIEW_ONLY", `${allocation.qlId}: candidate approval scope changed.`);
      assert(question.answerSemantic === allocation.answerSemantic, `${allocation.qlId}: answer semantic mismatch.`);
      assert(
        !question.active && !question.publiclyPublishable && !question.questionBankWritable && !question.testEligible,
        `${allocation.qlId}: source review runtime became deliverable.`,
      );
      const learnerText = `${question.stem}\n${JSON.stringify(question.explanation)}`;
      assert(
        !/\b(?:buying|purchase) rate\b/iu.test(learnerText),
        `${allocation.qlId}: buying/purchase-rate wording survived cost-price policy.`,
      );
      assert(/cost price/iu.test(question.stem), `${allocation.qlId}: cost-price wording missing.`);
      if (seedIndex === 0) {
        previewRows.push({
          qlId: allocation.qlId,
          solveModeId: allocation.solveModeId,
          authorityId: allocation.authorityId,
          coreFamily: allocation.coreFamily,
          sampleQuestionId: question.questionId,
          sampleStem: question.stem,
          answerSemantic: question.answerSemantic,
        });
      }
    } else {
      const prototypeId = allocation.authorityId as MalCp005DiscoveryPrototypeId;
      const question = generateMalCp005ExamReadyV2Question(prototypeId, seed);
      assert(question.prototypeId === prototypeId, `${allocation.qlId}: prototype route mismatch.`);
      assert(question.reviewStatus === "PRODUCT_REVIEW_APPROVED", `${allocation.qlId}: prototype lost approval.`);
      assert(question.answerSemantic === allocation.answerSemantic, `${allocation.qlId}: answer semantic mismatch.`);
      assert(
        !question.active && !question.publiclyPublishable && !question.questionBankWritable && !question.testEligible,
        `${allocation.qlId}: source review runtime became deliverable.`,
      );
      const learnerText = `${question.stem}\n${JSON.stringify(question.explanation)}`;
      assert(
        !/\b(?:buying|purchase) rate\b/iu.test(learnerText),
        `${allocation.qlId}: buying/purchase-rate wording appeared in approved learner text.`,
      );
      if (seedIndex === 0) {
        previewRows.push({
          qlId: allocation.qlId,
          solveModeId: allocation.solveModeId,
          authorityId: allocation.authorityId,
          coreFamily: allocation.coreFamily,
          sampleQuestionId: question.questionId,
          sampleStem: question.stem,
          answerSemantic: question.answerSemantic,
        });
      }
    }

    generatedRouteProofs += 1;
    productApprovalProofs += 1;
    lifecycleIsolationProofs += 1;
    terminologyProofs += 1;
    answerSemanticProofs += 1;
  }
}

assert(generatedRouteProofs === 1300, "Expected 1,300 permanent-route proofs.");
assert(productApprovalProofs === 1300, "Expected 1,300 product-approval proofs.");
assert(lifecycleIsolationProofs === 1300, "Expected 1,300 lifecycle-isolation proofs.");
assert(terminologyProofs === 1300, "Expected 1,300 terminology proofs.");
assert(answerSemanticProofs === 1300, "Expected 1,300 answer-semantic proofs.");
assert(previewRows.length === 13, "Expected one preview row per permanent QL.");

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp005-wave04-permanent-allocation.json");
const markdownPath = resolve(outputDirectory, "MAL-CP-005-WAVE-04-PERMANENT-ALLOCATION.md");

const result = {
  status: "PASS_MAL_CP005_WAVE04_PERMANENT_ALLOCATION",
  allocationId: MAL_CP005_PERMANENT_ALLOCATION_ID,
  qlRange: MAL_CP005_PERMANENT_QL_RANGE,
  permanentQlCount: MAL_CP005_PERMANENT_ALLOCATION.length,
  permanentSolveModeCount: new Set(MAL_CP005_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size,
  sharedMathematicalCoreCount: coreCounts.size,
  coreCounts: Object.fromEntries(coreCounts),
  previousPermanentQlMax: Math.max(...previousQlNumbers),
  firstCp005Ql: cp005QlNumbers[0],
  lastCp005Ql: cp005QlNumbers.at(-1),
  generatedRouteProofs,
  productApprovalProofs,
  lifecycleIsolationProofs,
  terminologyProofs,
  answerSemanticProofs,
  reviewStatus: "PRODUCT_REVIEW_APPROVED",
  approvalScope: "PERMANENT_IDENTITY_ALLOCATION_ONLY",
  active: false,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  previewRows,
};

writeFileSync(jsonPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

const markdown = [
  "# MAL-CP-005 Wave 04 — Permanent QL Allocation",
  "",
  "> Permanent identities are frozen but inactive. This checkpoint does not activate Question Studio permanent routes, Question Bank writes, tests, mocks or public delivery.",
  "",
  `Allocation ID: \`${MAL_CP005_PERMANENT_ALLOCATION_ID}\``,
  `Permanent QL range: \`${MAL_CP005_PERMANENT_QL_RANGE}\``,
  "",
  "## Allocation matrix",
  "",
  "| QL | Solve mode | Shared core | Learner contract |",
  "|---|---|---|---|",
  ...MAL_CP005_PERMANENT_ALLOCATION.map(
    (entry) => `| \`${entry.qlId}\` | \`${entry.solveModeId}\` | \`${entry.coreFamily}\` | ${entry.title} |`,
  ),
  "",
  "## Freeze decision",
  "",
  "- 13 product-approved task contracts become 13 permanent learner QLs.",
  "- The 13 task solve modes share only 3 mathematical cores: 6 pure-cost, 4 free-commercial and 3 cheaper-paid-commercial QLs.",
  "- `MAL-QL-060` remains distinct because it asks for total monetary profit; scaling the paid quantity changes that answer while leaving profit percentage unchanged.",
  "- `MAL-QL-048..060` is contiguous and begins immediately after CP-004's `MAL-QL-047`.",
  "- All permanent allocation lifecycle flags remain inactive/non-deliverable.",
  "- Learner-facing `buying rate` / `purchase rate` wording is rejected; cost-price terminology is enforced.",
  "",
  "## Route proof",
  "",
  `- Generated route proofs: **${generatedRouteProofs}**`,
  `- Product-approval proofs: **${productApprovalProofs}**`,
  `- Lifecycle-isolation proofs: **${lifecycleIsolationProofs}**`,
  `- Cost-price terminology proofs: **${terminologyProofs}**`,
  `- Answer-semantic proofs: **${answerSemanticProofs}**`,
  "",
  "## One deterministic sample per QL",
  "",
  ...previewRows.flatMap((row) => [
    `### ${row.qlId} — ${row.answerSemantic}`,
    "",
    `- Solve mode: \`${row.solveModeId}\``,
    `- Shared core: \`${row.coreFamily}\``,
    `- Authority: \`${row.authorityId}\``,
    `- Sample question: ${row.sampleStem}`,
    "",
  ]),
].join("\n");
writeFileSync(markdownPath, `${markdown}\n`, "utf8");

console.log(JSON.stringify(result, null, 2));
