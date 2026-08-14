import {
  MAL_CP006_WAVE04_FINAL_GENERALISATION_ID,
  generateMalCp006Wave04FinalGeneralisation,
} from "./foundation/cp006-wave04-within-identity-generalisation-v2";
import {
  MAL_CP006_WAVE04_FORWARD_STATES,
  MAL_CP006_WAVE04_INVERSE_STATES,
  MAL_CP006_WAVE04_VARIANT_IDS,
  malCp006Wave04ForwardStateSummary,
} from "./foundation/cp006-wave04-within-identity-generalisation";
import { MAL_CP006_WAVE03_CANDIDATE_IDS } from "./foundation/cp006-wave03-merge-split-analysis";
import { generateMalCp006Wave01FinalLearnerAuthorityQuestion } from "./foundation/cp006-wave01-learner-authority-final";
import { generateMalCp006Wave02FinalAuthorityV4 } from "./foundation/cp006-wave02-final-authority-v4";

const failures: string[] = [];
const expectedPrototypeIds = new Set([
  "MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO",
  "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO",
]);

const evidence = Object.fromEntries(
  MAL_CP006_WAVE04_VARIANT_IDS.map((variantId) => [variantId, {
    generated: 0,
    passed: 0,
    states: new Set<string>(),
    stemShapes: new Set<number>(),
    objectContexts: new Set<string>(),
    containerObjects: new Set<string>(),
    objectCombinations: new Set<string>(),
    answerPositions: [0, 0, 0, 0],
    prototypeIds: new Set<string>(),
  }]),
) as Record<string, any>;

for (const variantId of MAL_CP006_WAVE04_VARIANT_IDS) {
  const bucket = evidence[variantId];
  for (let i = 0; i < 3600; i += 1) {
    const q = generateMalCp006Wave04FinalGeneralisation(
      variantId,
      `mal-cp006-wave04-v2-audit:${variantId}:${i}`,
    );
    bucket.generated += 1;
    if (q.validation.ok) bucket.passed += 1;
    else failures.push(`${variantId}/${i}: ${q.validation.errors.join("; ")}`);
    bucket.states.add(q.stateKey);
    bucket.stemShapes.add(q.stemShape);
    bucket.objectContexts.add(q.objectContextId);
    bucket.containerObjects.add(q.containerObject);
    bucket.objectCombinations.add(`${q.objectContextId}|${q.containerObject}`);
    bucket.answerPositions[q.correctIndex] += 1;
    bucket.prototypeIds.add(q.prototypeId);

    if (!expectedPrototypeIds.has(q.prototypeId)) failures.push(`${variantId}: new prototype identity leaked`);
    if (!(MAL_CP006_WAVE03_CANDIDATE_IDS as readonly string[]).includes(q.prototypeId)) failures.push(`${variantId}: prototype outside retained Wave03 set`);
    if (q.permanentQlId !== null || q.permanentSolveModeId !== null || q.active || q.publiclyPublishable || q.questionStudioDiscoverable || q.questionBankWritable || q.testEligible) failures.push(`${variantId}: lifecycle escaped discovery lock`);

    const learnerText = [q.stem, ...q.options, ...q.explanation, q.commonMistake].join(" ");
    if (/\b\d+ litres is\b/iu.test(learnerText)) failures.push(`${variantId}/${i}: quantity-plus-is grammar`);
    if (/\b\d+ litres goes\b/iu.test(learnerText)) failures.push(`${variantId}/${i}: litres-goes grammar`);
    if (/\b1x\b/u.test(learnerText)) failures.push(`${variantId}/${i}: 1x notation`);
    if (/Solving this linear equation gives/iu.test(learnerText)) failures.push(`${variantId}/${i}: skipped inverse solving`);
    if (/^Starting from\b/u.test(q.stem)) failures.push(`${variantId}/${i}: opening sentence fragment`);
    if (/\bfind the .+ ratio in B\./iu.test(q.stem)) failures.push(`${variantId}/${i}: command-style opening`);
  }

  const expectedStates = variantId === "ASYMMETRIC_INVERSE_RETURN"
    ? MAL_CP006_WAVE04_INVERSE_STATES.length
    : MAL_CP006_WAVE04_FORWARD_STATES.length;
  if (bucket.states.size !== expectedStates) failures.push(`${variantId}: observed ${bucket.states.size}/${expectedStates} states`);
  if (bucket.stemShapes.size !== 8) failures.push(`${variantId}: observed ${bucket.stemShapes.size}/8 stem shapes`);
  if (bucket.objectContexts.size !== 16) failures.push(`${variantId}: observed ${bucket.objectContexts.size}/16 contexts`);
  if (bucket.containerObjects.size !== 4) failures.push(`${variantId}: observed ${bucket.containerObjects.size}/4 containers`);
  if (bucket.objectCombinations.size !== 48) failures.push(`${variantId}: observed ${bucket.objectCombinations.size}/48 object combinations`);
  if (bucket.prototypeIds.size !== 1) failures.push(`${variantId}: prototype identity varies across seeds`);
  if (bucket.answerPositions.some((count: number) => count < 600)) failures.push(`${variantId}: answer-position imbalance ${bucket.answerPositions.join("/")}`);
}

const witness = malCp006Wave04ForwardStateSummary([40, 20, 30, 25]);
if (witness.finalPrimaryB !== 25 || witness.finalSecondaryB !== 30) failures.push("CAT-2022 three-leg witness state changed");

for (let i = 0; i < 240; i += 1) {
  const oldForward = generateMalCp006Wave01FinalLearnerAuthorityQuestion(
    "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO",
    `mal-cp006-wave04-v2-regression:w1:${i}`,
  );
  if (!oldForward.validation.ok) failures.push(`Wave01 approved forward regression failed at ${i}`);

  const oldInverse = generateMalCp006Wave02FinalAuthorityV4(
    "MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO",
    `mal-cp006-wave04-v2-regression:w2:${i}`,
  );
  if (!oldInverse.validation.ok) failures.push(`Wave02 V4 approved inverse regression failed at ${i}`);
}

const serialised = Object.fromEntries(
  Object.entries(evidence).map(([variantId, bucket]: [string, any]) => [variantId, {
    generated: bucket.generated,
    passed: bucket.passed,
    states: bucket.states.size,
    stemShapes: bucket.stemShapes.size,
    objectContexts: bucket.objectContexts.size,
    containerObjects: bucket.containerObjects.size,
    objectCombinations: bucket.objectCombinations.size,
    answerPositions: bucket.answerPositions,
    prototypeIds: [...bucket.prototypeIds],
  }]),
);

const report = {
  status: failures.length ? "FAIL_MAL_CP006_WAVE04_FINAL_GENERALISATION" : "PASS_MAL_CP006_WAVE04_FINAL_GENERALISATION",
  authorityId: MAL_CP006_WAVE04_FINAL_GENERALISATION_ID,
  newPrototypeIds: 0,
  newPermanentQls: 0,
  newPermanentSolveModes: 0,
  coveredExistingIdentities: [...expectedPrototypeIds],
  variants: serialised,
  cat2022ThreeLegWitness: "5:6",
  approvedAuthorityRegressionQuestions: 480,
  allocationProposalOnly: true,
  proposedPermanentRange: "MAL-QL-061..MAL-QL-067",
  failures,
};

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
