import {
  generateMalCp006Wave04Generalisation,
  MAL_CP006_WAVE04_FORWARD_STATES,
  MAL_CP006_WAVE04_GENERALISATION_ID,
  MAL_CP006_WAVE04_INVERSE_STATES,
  MAL_CP006_WAVE04_VARIANT_IDS,
  malCp006Wave04ForwardStateSummary,
} from "./foundation/cp006-wave04-within-identity-generalisation";
import {
  MAL_CP006_WAVE03_CANDIDATE_IDS,
  MAL_CP006_WAVE03_GENERALISATION_GAPS,
} from "./foundation/cp006-wave03-merge-split-analysis";
import { generateMalCp006Wave01FinalLearnerAuthorityQuestion } from "./foundation/cp006-wave01-learner-authority-final";
import { generateMalCp006Wave02FinalAuthorityV4 } from "./foundation/cp006-wave02-final-authority-v4";

const failures: string[] = [];
const expectedPrototypeIds = new Set([
  "MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO",
  "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO",
]);

const evidence = Object.fromEntries(
  MAL_CP006_WAVE04_VARIANT_IDS.map((variantId) => [
    variantId,
    {
      generated: 0,
      passed: 0,
      states: new Set<string>(),
      stemShapes: new Set<number>(),
      objectContexts: new Set<string>(),
      containerObjects: new Set<string>(),
      objectCombinations: new Set<string>(),
      answerPositions: [0, 0, 0, 0],
      prototypeIds: new Set<string>(),
    },
  ]),
) as Record<
  (typeof MAL_CP006_WAVE04_VARIANT_IDS)[number],
  {
    generated: number;
    passed: number;
    states: Set<string>;
    stemShapes: Set<number>;
    objectContexts: Set<string>;
    containerObjects: Set<string>;
    objectCombinations: Set<string>;
    answerPositions: number[];
    prototypeIds: Set<string>;
  }
>;

for (const variantId of MAL_CP006_WAVE04_VARIANT_IDS) {
  const bucket = evidence[variantId];
  for (let i = 0; i < 3200; i += 1) {
    const q = generateMalCp006Wave04Generalisation(
      variantId,
      `mal-cp006-wave04-audit:${variantId}:${i}`,
    );
    bucket.generated += 1;
    if (q.validation.ok) bucket.passed += 1;
    else failures.push(`${variantId}/${i}: ${q.validation.errors.join("; ")}`);
    bucket.states.add(q.stateKey);
    bucket.stemShapes.add(q.stemShape);
    bucket.objectContexts.add(q.objectContextId);
    bucket.containerObjects.add(q.containerObject);
    bucket.objectCombinations.add(`${q.objectContextId}|${q.containerObject}`);
    bucket.answerPositions[q.correctIndex] = (bucket.answerPositions[q.correctIndex] ?? 0) + 1;
    bucket.prototypeIds.add(q.prototypeId);

    if (!expectedPrototypeIds.has(q.prototypeId)) failures.push(`${variantId}: new prototype identity leaked: ${q.prototypeId}`);
    if (!(MAL_CP006_WAVE03_CANDIDATE_IDS as readonly string[]).includes(q.prototypeId)) failures.push(`${variantId}: prototype is outside Wave03 retained set`);
    if (q.permanentQlId !== null || q.permanentSolveModeId !== null || q.active || q.publiclyPublishable || q.questionStudioDiscoverable || q.questionBankWritable || q.testEligible) failures.push(`${variantId}: lifecycle lock failed`);
    if (new Set(q.options).size !== 4 || q.options[q.correctIndex] !== q.answer) failures.push(`${variantId}: option mapping failed`);
  }

  const expectedStates = variantId === "ASYMMETRIC_INVERSE_RETURN"
    ? MAL_CP006_WAVE04_INVERSE_STATES.length
    : MAL_CP006_WAVE04_FORWARD_STATES.length;
  if (bucket.states.size !== expectedStates) failures.push(`${variantId}: observed ${bucket.states.size}/${expectedStates} states`);
  if (bucket.stemShapes.size !== 8) failures.push(`${variantId}: observed ${bucket.stemShapes.size}/8 stem shapes`);
  if (bucket.objectContexts.size !== 16) failures.push(`${variantId}: observed ${bucket.objectContexts.size}/16 object contexts`);
  if (bucket.containerObjects.size !== 4) failures.push(`${variantId}: observed ${bucket.containerObjects.size}/4 container nouns`);
  if (bucket.objectCombinations.size !== 48) failures.push(`${variantId}: observed ${bucket.objectCombinations.size}/48 context-container combinations`);
  if (bucket.prototypeIds.size !== 1) failures.push(`${variantId}: variant changed prototype identity across seeds`);
  if (bucket.answerPositions.some((count) => count < 500)) failures.push(`${variantId}: answer positions are too imbalanced: ${bucket.answerPositions.join("/")}`);
}

// Exact source-style witness for the CAT-2022 three-leg half-current-source topology.
const witness = malCp006Wave04ForwardStateSummary([40, 20, 30, 25]);
if (`${witness.finalPrimaryB}:${witness.finalSecondaryB}` !== "25:30") failures.push("CAT-2022 forward witness unreduced state changed");
if (witness.finalPrimaryB / witness.finalSecondaryB !== 5 / 6) failures.push("CAT-2022 forward witness no longer reduces to 5:6");

// The two Wave03 gaps must be exactly the two identities covered here; neither is a new QL.
const gapIds = new Set(MAL_CP006_WAVE03_GENERALISATION_GAPS.map((x) => x.id));
for (const id of expectedPrototypeIds) if (!gapIds.has(id as never)) failures.push(`Wave03 gap missing for ${id}`);
if (gapIds.size !== 2) failures.push(`expected two Wave03 generalisation gaps, got ${gapIds.size}`);

// Approved authorities remain valid alongside the new within-identity variants.
for (let i = 0; i < 160; i += 1) {
  const oldForward = generateMalCp006Wave01FinalLearnerAuthorityQuestion(
    "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO",
    `mal-cp006-wave04-regression:w1:${i}`,
  );
  if (!oldForward.validation.ok) failures.push(`Wave01 approved forward regression failed at ${i}`);

  const oldInverse = generateMalCp006Wave02FinalAuthorityV4(
    "MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO",
    `mal-cp006-wave04-regression:w2:${i}`,
  );
  if (!oldInverse.validation.ok) failures.push(`Wave02 V4 approved inverse regression failed at ${i}`);
}

const serialisedEvidence = Object.fromEntries(
  Object.entries(evidence).map(([variantId, bucket]) => [
    variantId,
    {
      generated: bucket.generated,
      passed: bucket.passed,
      states: bucket.states.size,
      stemShapes: bucket.stemShapes.size,
      objectContexts: bucket.objectContexts.size,
      containerObjects: bucket.containerObjects.size,
      objectCombinations: bucket.objectCombinations.size,
      answerPositions: bucket.answerPositions,
      prototypeIds: [...bucket.prototypeIds],
    },
  ]),
);

const report = {
  status: failures.length ? "FAIL_MAL_CP006_WAVE04_GENERALISATION" : "PASS_MAL_CP006_WAVE04_GENERALISATION",
  generalisationId: MAL_CP006_WAVE04_GENERALISATION_ID,
  newPrototypeIds: 0,
  newPermanentQls: 0,
  newPermanentSolveModes: 0,
  coveredExistingIdentities: [...expectedPrototypeIds],
  variants: serialisedEvidence,
  sourceWitnesses: {
    cat2022ThreeLegFinalRatio: "5:6",
    asymmetricInverseSupportingEvidence: "BANK-MAINS-2021-GENERAL-INVERSE-RETURN",
  },
  approvedAuthorityRegressionQuestions: 320,
  allocationProposalOnly: true,
  failures,
};

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
