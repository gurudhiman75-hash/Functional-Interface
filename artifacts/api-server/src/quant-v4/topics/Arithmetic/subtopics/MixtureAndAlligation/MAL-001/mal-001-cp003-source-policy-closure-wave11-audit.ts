import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  addRational,
  equalsRational,
  multiplyRational,
  rational,
} from "./foundation/rational";
import { runMalCp003DiscoveryPipeline } from "./foundation/cp003-discovery-pipeline";
import { powerRational, solveMalCp003Request } from "./foundation/cp003-solver";
import {
  MAL_CP003_WAVE11_BLOCKER_CLOSURES,
  MAL_CP003_WAVE11_COMPONENT_SWITCH_POLICY,
  MAL_CP003_WAVE11_EXACT_OPERATION_DOMAIN,
  MAL_CP003_WAVE11_FINAL_EFFECTIVE_CONTRACT_IDS,
  MAL_CP003_WAVE11_READINESS,
  MAL_CP003_WAVE11_SOURCE_REFERENCES,
  MAL_CP003_WAVE11_UNEQUAL_STAGE_POLICY,
} from "./foundation/cp003-source-policy-closure-wave11";
import {
  MAL_CP003_WAVE10_EXCLUDED_IDS,
  MAL_CP003_WAVE10_MERGED_REPRESENTATION_IDS,
  MAL_CP003_WAVE10_PROVISIONAL_BLOCKER_IDS,
} from "./foundation/cp003-coverage-closure-wave10";
import type { MalCp003ExecutablePrototypeId } from "./foundation/cp003-types";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function expectThrows(action: () => unknown, message: string): void {
  let threw = false;
  try {
    action();
  } catch {
    threw = true;
  }
  assert(threw, message);
}

assert(MAL_CP003_WAVE11_BLOCKER_CLOSURES.length === 4, "Wave 11 must close four blockers.");
assert(MAL_CP003_WAVE10_PROVISIONAL_BLOCKER_IDS.length === 4, "Wave 10 blocker count changed.");
assert(
  new Set(MAL_CP003_WAVE11_BLOCKER_CLOSURES.map((row) => row.candidateId)).size === 4,
  "Wave 11 blocker closure IDs are not unique.",
);
assert(
  MAL_CP003_WAVE11_BLOCKER_CLOSURES.every((row) => row.remainingBlockers.length === 0),
  "A Wave 11 closure still carries a blocker.",
);
assert(
  MAL_CP003_WAVE11_BLOCKER_CLOSURES.every((row) => row.sourceEvidenceIds.length > 0),
  "A Wave 11 closure lacks source evidence.",
);
assert(
  MAL_CP003_WAVE11_SOURCE_REFERENCES.length >= 8,
  "Wave 11 source ledger is unexpectedly thin.",
);
assert(
  MAL_CP003_WAVE11_FINAL_EFFECTIVE_CONTRACT_IDS.length === 9,
  "Wave 11 must preserve nine effective CP-003 contracts.",
);
assert(
  new Set(MAL_CP003_WAVE11_FINAL_EFFECTIVE_CONTRACT_IDS).size === 9,
  "Effective contract IDs are not unique.",
);
assert(MAL_CP003_WAVE10_MERGED_REPRESENTATION_IDS.length === 2, "Representation merge count changed.");
assert(MAL_CP003_WAVE10_EXCLUDED_IDS.length === 1, "CP-004 exclusion count changed.");
assert(MAL_CP003_WAVE11_READINESS.remainingSourcePolicyBlockerCount === 0, "Source-policy blockers remain.");
assert(MAL_CP003_WAVE11_READINESS.sourcePolicyReadiness, "Source-policy readiness is false.");
assert(!MAL_CP003_WAVE11_READINESS.freezeReadiness, "Wave 11 must not freeze CP-003.");
assert(MAL_CP003_WAVE11_READINESS.permanentQlCount === 0, "Permanent QLs leaked into Wave 11.");
assert(MAL_CP003_WAVE11_READINESS.nextPermanentQlId === "MAL-QL-029", "Wrong next QL boundary.");
assert(
  !MAL_CP003_WAVE11_READINESS.active &&
    !MAL_CP003_WAVE11_READINESS.publiclyPublishable &&
    !MAL_CP003_WAVE11_READINESS.questionStudioDiscoverable &&
    !MAL_CP003_WAVE11_READINESS.questionBankWritable &&
    !MAL_CP003_WAVE11_READINESS.testEligible,
  "A Wave 11 delivery flag became enabled.",
);

let initialInverseRoundTripCount = 0;
let complementRepresentationCount = 0;
for (let index = 0; index < 240; index += 1) {
  const vesselVolume = rational(40 + (index % 9) * 8);
  const initialOriginalQuantity = multiplyRational(
    vesselVolume,
    rational(2 + (index % 3), 5),
  );
  const removedQuantity = multiplyRational(
    vesselVolume,
    rational(1 + (index % 2), 10),
  );
  const operations = 2 + (index % 4);
  const forward = solveMalCp003Request({
    mode: "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES",
    vesselVolume,
    initialOriginalQuantity,
    removedQuantity,
    operations,
  });
  assert(forward.kind === "FINAL_ORIGINAL_QUANTITY", "Wrong forward result kind.");
  const inverse = solveMalCp003Request({
    mode: "INITIAL_ORIGINAL_QUANTITY_FROM_FINAL",
    vesselVolume,
    finalOriginalQuantity: forward.quantity,
    removedQuantity,
    operations,
  });
  assert(inverse.kind === "INITIAL_ORIGINAL_QUANTITY", "Wrong inverse result kind.");
  assert(
    equalsRational(inverse.quantity, initialOriginalQuantity),
    `Initial inverse round trip failed at state ${index}.`,
  );
  const initialComplement = addRational(
    vesselVolume,
    multiplyRational(initialOriginalQuantity, rational(-1)),
  );
  const reconstructedComplement = addRational(
    vesselVolume,
    multiplyRational(inverse.quantity, rational(-1)),
  );
  assert(
    equalsRational(initialComplement, reconstructedComplement),
    `Complement representation failed at state ${index}.`,
  );
  initialInverseRoundTripCount += 1;
  complementRepresentationCount += 1;
}

let exactOperationRoundTripCount = 0;
let exactOperationNoSolutionRejectionCount = 0;
for (
  let operations = MAL_CP003_WAVE11_EXACT_OPERATION_DOMAIN.minimumOperations;
  operations <= MAL_CP003_WAVE11_EXACT_OPERATION_DOMAIN.maximumOperations;
  operations += 1
) {
  for (let variant = 0; variant < 30; variant += 1) {
    const vesselVolume = rational(40 + (variant % 8) * 10);
    const initialOriginalQuantity = vesselVolume;
    const removedQuantity = multiplyRational(
      vesselVolume,
      rational(1 + (variant % 3), 10),
    );
    const forward = solveMalCp003Request({
      mode: "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES",
      vesselVolume,
      initialOriginalQuantity,
      removedQuantity,
      operations,
    });
    assert(forward.kind === "FINAL_ORIGINAL_QUANTITY", "Wrong operation forward result.");
    const inverse = solveMalCp003Request({
      mode: "OPERATION_COUNT_FROM_FINAL",
      vesselVolume,
      initialOriginalQuantity,
      finalOriginalQuantity: forward.quantity,
      removedQuantity,
      maximumOperations: MAL_CP003_WAVE11_EXACT_OPERATION_DOMAIN.maximumOperations,
    });
    assert(inverse.kind === "OPERATION_COUNT", "Wrong operation inverse result.");
    assert(inverse.operations === operations, "Exact operation count round trip failed.");
    exactOperationRoundTripCount += 1;

    const impossibleTarget = addRational(forward.quantity, rational(1, 997));
    expectThrows(
      () =>
        solveMalCp003Request({
          mode: "OPERATION_COUNT_FROM_FINAL",
          vesselVolume,
          initialOriginalQuantity,
          finalOriginalQuantity: impossibleTarget,
          removedQuantity,
          maximumOperations: MAL_CP003_WAVE11_EXACT_OPERATION_DOMAIN.maximumOperations,
        }),
      "A non-exact operation-count target was accepted.",
    );
    exactOperationNoSolutionRejectionCount += 1;
  }
}

let unequalStageIdentityCount = 0;
for (let index = 0; index < 320; index += 1) {
  const vesselVolume = rational(60 + (index % 8) * 12);
  const initialOriginalQuantity = vesselVolume;
  const stageCount =
    MAL_CP003_WAVE11_UNEQUAL_STAGE_POLICY.minimumStages +
    (index %
      (MAL_CP003_WAVE11_UNEQUAL_STAGE_POLICY.maximumStages -
        MAL_CP003_WAVE11_UNEQUAL_STAGE_POLICY.minimumStages +
        1));
  const removedQuantities = Array.from({ length: stageCount }, (_value, stage) =>
    multiplyRational(vesselVolume, rational(1 + ((index + stage) % 4), 10)),
  );
  const result = solveMalCp003Request({
    mode: "FINAL_ORIGINAL_QUANTITY_UNEQUAL_STAGES",
    vesselVolume,
    initialOriginalQuantity,
    removedQuantities,
  });
  assert(result.kind === "FINAL_ORIGINAL_QUANTITY", "Wrong unequal-stage result kind.");
  let expectedRetention = rational(1);
  for (const removed of removedQuantities) {
    expectedRetention = multiplyRational(
      expectedRetention,
      addRational(rational(1), multiplyRational(removed, rational(-1, vesselVolume.numerator))),
    );
  }
  // The previous compact expression is valid only for integer vessel states.
  // Recompute through exact solver factors to prove the general identity.
  expectedRetention = rational(1);
  for (const removed of removedQuantities) {
    expectedRetention = multiplyRational(
      expectedRetention,
      multiplyRational(
        addRational(vesselVolume, multiplyRational(removed, rational(-1))),
        rational(vesselVolume.denominator, vesselVolume.numerator),
      ),
    );
  }
  assert(
    equalsRational(result.retainedFraction, expectedRetention),
    `Unequal-stage retention identity failed at state ${index}.`,
  );
  assert(
    equalsRational(result.quantity, multiplyRational(initialOriginalQuantity, expectedRetention)),
    `Unequal-stage final quantity failed at state ${index}.`,
  );
  unequalStageIdentityCount += 1;
}

let componentVectorConservationCount = 0;
for (let index = 0; index < 320; index += 1) {
  const vesselVolume = rational(60 + (index % 6) * 12);
  const initialState = {
    componentA: multiplyRational(vesselVolume, rational(1, 2)),
    componentB: multiplyRational(vesselVolume, rational(1, 3)),
    componentC: multiplyRational(vesselVolume, rational(1, 6)),
  };
  const result = solveMalCp003Request({
    mode: "FINAL_THREE_COMPONENT_STATE",
    vesselVolume,
    initialState,
    stages: [
      {
        removedQuantity: multiplyRational(vesselVolume, rational(1, 5)),
        refillComponent: index % 2 === 0 ? "B" : "C",
      },
      {
        removedQuantity: multiplyRational(vesselVolume, rational(1, 4)),
        refillComponent: index % 2 === 0 ? "C" : "A",
      },
    ],
  });
  assert(result.kind === "FINAL_THREE_COMPONENT_STATE", "Wrong component-vector result kind.");
  const finalTotal = addRational(
    addRational(result.state.componentA, result.state.componentB),
    result.state.componentC,
  );
  assert(
    equalsRational(finalTotal, vesselVolume),
    `Three-component conservation failed at state ${index}.`,
  );
  assert(
    result.state.componentA.numerator >= 0n &&
      result.state.componentB.numerator >= 0n &&
      result.state.componentC.numerator >= 0n,
    "A three-component quantity became negative.",
  );
  componentVectorConservationCount += 1;
}

const blockerPrototypeIds: readonly MalCp003ExecutablePrototypeId[] = [
  "MAL-CP003-PROT-INITIAL-ORIGINAL-QUANTITY-FROM-FINAL",
  "MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL",
  "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-UNEQUAL-REPLACEMENTS",
  "MAL-CP003-PROT-THIRD-LIQUID-TWO-STAGE-COMPOSITION",
];
let runtimeRegressionCount = 0;
for (const prototypeId of blockerPrototypeIds) {
  for (let index = 0; index < 50; index += 1) {
    const question = runMalCp003DiscoveryPipeline(
      prototypeId,
      `mal-cp003-wave11:${prototypeId}:${index}`,
    );
    assert(question.validation.ok, `${prototypeId}: ${question.validation.errors.join("; ")}`);
    assert(question.permanentQlId === null, "Permanent QL leaked into discovery runtime.");
    assert(question.options.length === 4, "Runtime does not have four options.");
    assert(new Set(question.options).size === 4, "Runtime options are not unique.");
    assert(question.options[question.correctIndex] === question.answer, "Runtime correct option is wrong.");
    assert(question.explanation.steps.length >= 4, "Runtime explanation is too shallow.");
    assert(
      !question.active &&
        !question.publiclyPublishable &&
        !question.questionStudioDiscoverable &&
        !question.questionBankWritable &&
        !question.testEligible,
      "A discovery runtime delivery flag became enabled.",
    );
    runtimeRegressionCount += 1;
  }
}

const expectedExactOperationRoundTrips =
  (MAL_CP003_WAVE11_EXACT_OPERATION_DOMAIN.maximumOperations -
    MAL_CP003_WAVE11_EXACT_OPERATION_DOMAIN.minimumOperations +
    1) *
  30;
assert(initialInverseRoundTripCount === 240, "Initial inverse audit count mismatch.");
assert(complementRepresentationCount === 240, "Complement audit count mismatch.");
assert(
  exactOperationRoundTripCount === expectedExactOperationRoundTrips,
  "Exact operation audit count mismatch.",
);
assert(
  exactOperationNoSolutionRejectionCount === expectedExactOperationRoundTrips,
  "No-solution rejection count mismatch.",
);
assert(unequalStageIdentityCount === 320, "Unequal-stage audit count mismatch.");
assert(componentVectorConservationCount === 320, "Component-vector audit count mismatch.");
assert(runtimeRegressionCount === 200, "Blocker runtime regression count mismatch.");

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp003-source-policy-closure-wave11.json");
const markdownPath = resolve(outputDirectory, "mal-cp003-source-policy-closure-wave11.md");
const summary = {
  status: "PASS_MAL_CP003_SOURCE_POLICY_CLOSURE_WAVE11",
  canonicalProblemId: "MAL-CP-003",
  sourceReferenceCount: MAL_CP003_WAVE11_SOURCE_REFERENCES.length,
  newlyClosedBlockerCount: MAL_CP003_WAVE11_BLOCKER_CLOSURES.length,
  effectiveOwnedContractCount: MAL_CP003_WAVE11_FINAL_EFFECTIVE_CONTRACT_IDS.length,
  mergedRepresentationCount: MAL_CP003_WAVE10_MERGED_REPRESENTATION_IDS.length,
  excludedToCp004Count: MAL_CP003_WAVE10_EXCLUDED_IDS.length,
  remainingSourcePolicyBlockerCount: MAL_CP003_WAVE11_READINESS.remainingSourcePolicyBlockerCount,
  initialInverseRoundTripCount,
  complementRepresentationCount,
  exactOperationRoundTripCount,
  exactOperationNoSolutionRejectionCount,
  unequalStageIdentityCount,
  componentVectorConservationCount,
  runtimeRegressionCount,
  exactOperationDomain: MAL_CP003_WAVE11_EXACT_OPERATION_DOMAIN,
  unequalStagePolicy: MAL_CP003_WAVE11_UNEQUAL_STAGE_POLICY,
  componentSwitchPolicy: MAL_CP003_WAVE11_COMPONENT_SWITCH_POLICY,
  sourcePolicyReadiness: true,
  runtimeEditorialReadiness: false,
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  freezeReadiness: false,
  active: false,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
};
writeFileSync(
  jsonPath,
  `${JSON.stringify({ ...summary, closures: MAL_CP003_WAVE11_BLOCKER_CLOSURES, sources: MAL_CP003_WAVE11_SOURCE_REFERENCES }, null, 2)}\n`,
  "utf8",
);
const markdown = [
  "# MAL-CP-003 Wave 11 — Source and Policy Closure Audit",
  "",
  `Status: **${summary.status}**`,
  "",
  `Source references: **${summary.sourceReferenceCount}**`,
  `Former blockers closed: **${summary.newlyClosedBlockerCount}**`,
  `Effective owned contracts: **${summary.effectiveOwnedContractCount}**`,
  `Remaining source-policy blockers: **${summary.remainingSourcePolicyBlockerCount}**`,
  "",
  "## Executable proofs",
  "",
  `- Initial-state inverse round trips: **${initialInverseRoundTripCount}**`,
  `- Complement representations: **${complementRepresentationCount}**`,
  `- Exact operation-count round trips: **${exactOperationRoundTripCount}**`,
  `- Non-exact count states rejected: **${exactOperationNoSolutionRejectionCount}**`,
  `- Unequal-stage identities: **${unequalStageIdentityCount}**`,
  `- Three-component conservation states: **${componentVectorConservationCount}**`,
  `- Existing blocker-runtime regressions: **${runtimeRegressionCount}**`,
  "",
  "## Lifecycle",
  "",
  "Permanent QLs: **0**",
  "Freeze readiness: **false**",
  "Next checkpoint: **unified runtime and editorial audit**",
  "",
].join("\n");
writeFileSync(markdownPath, `${markdown}\n`, "utf8");
console.log(JSON.stringify({ ...summary, jsonPath, markdownPath }, null, 2));
