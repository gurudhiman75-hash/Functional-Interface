import assert from "node:assert/strict";
import {
  areSpatialScenesEquivalent,
  renderSpatialSceneToSvg,
  spatialSceneSemanticFingerprint,
  transformSceneByRequestedOperation,
  validateSpatialOptionUniqueness,
  type SpatialNode,
  type SpatialTransformProofQuestion,
} from "../foundation/spatial";
import { validateSpatialPerceptualOptionUniquenessV2 } from "../foundation/spatial/gap-question-perceptual-v2";
import { generateMirrorGeometricProofQuestion } from "../topics/Non-Verbal-Reasoning/Mirror-Images/MIR-001/runtime/mirror-proof-generator";
import { generateWaterGeometricProofQuestion } from "../topics/Non-Verbal-Reasoning/Water-Images/WAT-001/runtime/water-proof-generator";

const MIRROR_SEEDS = [
  "MIR-PROOF-004",
  "MIR-PROOF-007",
  "MIR-PROOF-008",
  "MIR-PROOF-009",
  "MIR-PROOF-011",
  "MIR-PROOF-012",
  "MIR-PROOF-001",
  "MIR-PROOF-003",
  "MIR-PROOF-005",
  "MIR-PROOF-002",
  "MIR-PROOF-017",
  "MIR-PROOF-026",
] as const;

const WATER_SEEDS = [
  "WAT-PROOF-003",
  "WAT-PROOF-011",
  "WAT-PROOF-009",
  "WAT-PROOF-016",
  "WAT-PROOF-002",
  "WAT-PROOF-015",
  "WAT-PROOF-001",
  "WAT-PROOF-004",
] as const;

function assertLifecycleLocked(question: SpatialTransformProofQuestion): void {
  assert.equal(question.lifecycle.permanentQlId, null);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
}

function nodeBounds(node: SpatialNode | undefined): [number, number, number, number] | null {
  if (!node) return null;
  if (node.kind === "circle" || node.kind === "arc") {
    return [
      node.center.x - node.radius,
      node.center.y - node.radius,
      node.center.x + node.radius,
      node.center.y + node.radius,
    ];
  }
  const points = node.kind === "line" ? [node.start, node.end] : node.points;
  return [
    Math.min(...points.map((point) => point.x)),
    Math.min(...points.map((point) => point.y)),
    Math.max(...points.map((point) => point.x)),
    Math.max(...points.map((point) => point.y)),
  ];
}

function nodePoints(node: SpatialNode): Array<{ x: number; y: number }> | null {
  if (node.kind === "line") return [node.start, node.end];
  if (node.kind === "polygon" || node.kind === "polyline") return node.points;
  return null;
}

function pointSetDistance(left: SpatialNode, right: SpatialNode): number | null {
  const leftPoints = nodePoints(left);
  const rightPoints = nodePoints(right);
  if (!leftPoints || !rightPoints) return null;
  const directed = (
    from: Array<{ x: number; y: number }>,
    to: Array<{ x: number; y: number }>,
  ): number =>
    Math.max(
      ...from.map((point) =>
        Math.min(
          ...to.map((other) =>
            Math.hypot(point.x - other.x, point.y - other.y),
          ),
        ),
      ),
    );
  return Math.max(
    directed(leftPoints, rightPoints),
    directed(rightPoints, leftPoints),
  );
}

function assertPremiumMirrorDistractor(question: SpatialTransformProofQuestion): void {
  const correct = question.options.find((option) => option.label === "CORRECT_REFLECTION");
  const premium = question.options.find(
    (option) => option.label === "OUTER_SHAPE_CORRECT_INNER_PROPERTY_WRONG",
  );
  assert(correct, "Mirror question is missing the correct option.");
  assert(premium, "Mirror question is missing the strict inner-property distractor.");

  const correctById = new Map(correct.scene.nodes.map((node) => [node.id, node] as const));
  const premiumById = new Map(premium.scene.nodes.map((node) => [node.id, node] as const));
  const changedNodeIds = correct.scene.nodes
    .filter((node) => JSON.stringify(node) !== JSON.stringify(premiumById.get(node.id)))
    .map((node) => node.id);

  assert.deepEqual(
    changedNodeIds,
    ["secondary-shape"],
    `Premium MIR distractor must change only the internal secondary feature; changed ${changedNodeIds.join(",")}.`,
  );
  for (const protectedNodeId of ["primary-shape", "marker", "orientation-mark"] as const) {
    assert.deepEqual(
      premiumById.get(protectedNodeId),
      correctById.get(protectedNodeId),
      `Premium MIR distractor must preserve '${protectedNodeId}' exactly.`,
    );
  }

  const correctSecondary = correctById.get("secondary-shape");
  const premiumSecondary = premiumById.get("secondary-shape");
  assert(correctSecondary && premiumSecondary);
  assert.deepEqual(
    nodeBounds(premiumSecondary),
    nodeBounds(correctSecondary),
    "The changed inner feature must keep the exact same footprint; only its internal property/orientation may change.",
  );

  const geometricSeparation = pointSetDistance(correctSecondary, premiumSecondary);
  if (geometricSeparation !== null) {
    assert(
      geometricSeparation >= 5,
      `Premium MIR inner outline is too visually similar (${geometricSeparation.toFixed(2)} SVG units); require at least 5.`,
    );
  } else {
    assert.equal(correctSecondary.kind, "circle");
    assert.equal(premiumSecondary.kind, "circle");
    assert.notEqual(
      correctSecondary.style?.fill ?? "none",
      premiumSecondary.style?.fill ?? "none",
      "Circular inner-feature distractor must change a clearly visible fill property.",
    );
  }

  assert.notEqual(
    spatialSceneSemanticFingerprint(correct.scene),
    spatialSceneSemanticFingerprint(premium.scene),
  );

  const perceptual = validateSpatialPerceptualOptionUniquenessV2(
    question.options.map((option) => option.scene),
  );
  assert.equal(perceptual.ok, true, JSON.stringify(perceptual.duplicatePairs));
}

function assertQuestion(
  question: SpatialTransformProofQuestion,
  expectedChapter: "MIR-001" | "WAT-001",
): void {
  assert.equal(question.familyCode, "SPA-001");
  assert.equal(question.chapterCode, expectedChapter);
  assert.equal(question.options.length, 4);
  assert(question.correctOptionIndex >= 0 && question.correctOptionIndex < 4);
  assert.equal(question.explanationSteps.length, 4);
  assert(question.learnerExplanation);
  assert.equal(question.reviewMetadata.equivalentCandidateCheck, "PASS");
  assert.equal(question.reviewMetadata.clockGeometryCheck, "NOT_APPLICABLE");
  assert.equal(question.reviewMetadata.clockShortcutCheck, "NOT_APPLICABLE");
  assert.equal(question.solverEvidence.symmetryProfile.vertical, false);
  assert.equal(question.solverEvidence.symmetryProfile.horizontal, false);
  assert.equal(question.solverEvidence.symmetryProfile.rotational180, false);
  assertLifecycleLocked(question);

  const optionValidation = validateSpatialOptionUniqueness(
    question.options.map((option) => option.scene),
  );
  assert.equal(optionValidation.ok, true, JSON.stringify(optionValidation.errors));
  assert.equal(new Set(question.options.map((option) => option.fingerprint)).size, 4);
  const expectedLabels = expectedChapter === "MIR-001"
    ? [
        "AXIS_CONFUSION",
        "CORRECT_REFLECTION",
        "OUTER_SHAPE_CORRECT_INNER_PROPERTY_WRONG",
        "ROTATION_SUBSTITUTED_FOR_REFLECTION",
      ]
    : [
        "AXIS_CONFUSION",
        "CORRECT_REFLECTION",
        "PARTIAL_REFLECTION_ERROR",
        "ROTATION_SUBSTITUTED_FOR_REFLECTION",
      ];
  assert.deepEqual(question.options.map((option) => option.label).sort(), expectedLabels);

  if (expectedChapter === "MIR-001") assertPremiumMirrorDistractor(question);

  const independentlySolved = transformSceneByRequestedOperation(
    question.sourceScene,
    question.requestedTransform,
    { axisX: 50, axisY: 50, pivot: { x: 50, y: 50 } },
  );
  assert.equal(
    areSpatialScenesEquivalent(
      independentlySolved,
      question.options[question.correctOptionIndex]!.scene,
    ),
    true,
  );
  assert.equal(
    question.options[question.correctOptionIndex]!.label,
    "CORRECT_REFLECTION",
  );
  assert.equal(
    spatialSceneSemanticFingerprint(independentlySolved),
    question.solverEvidence.correctFingerprint,
  );

  const firstSourceSvg = renderSpatialSceneToSvg(question.sourceScene, {
    ariaLabel: `${expectedChapter} source proof scene`,
  });
  const secondSourceSvg = renderSpatialSceneToSvg(question.sourceScene, {
    ariaLabel: `${expectedChapter} source proof scene`,
  });
  assert.equal(firstSourceSvg, secondSourceSvg);

  for (const [index, option] of question.options.entries()) {
    const svg = renderSpatialSceneToSvg(option.scene, {
      ariaLabel: `${expectedChapter} proof option ${index + 1}`,
    });
    assert.match(svg, /^<svg /);
    assert.doesNotMatch(svg, /<script|foreignObject|javascript:/i);
  }
}

const mirrorQuestions = MIRROR_SEEDS.map((seed) => {
  const first = generateMirrorGeometricProofQuestion(seed);
  const second = generateMirrorGeometricProofQuestion(seed);
  assert.deepEqual(first, second);
  assertQuestion(first, "MIR-001");
  assert.equal(first.requestedTransform, "REFLECT_VERTICAL");
  assert.equal(first.solverEvidence.axisKind, "VERTICAL");
  return first;
});

const waterQuestions = WATER_SEEDS.map((seed) => {
  const first = generateWaterGeometricProofQuestion(seed);
  const second = generateWaterGeometricProofQuestion(seed);
  assert.deepEqual(first, second);
  assertQuestion(first, "WAT-001");
  assert.equal(first.requestedTransform, "REFLECT_HORIZONTAL");
  assert.equal(first.solverEvidence.axisKind, "HORIZONTAL");
  return first;
});

const allQuestions = [...mirrorQuestions, ...waterQuestions];
assert.equal(mirrorQuestions.length, 12);
assert.equal(waterQuestions.length, 8);
assert.equal(allQuestions.length, 20);
assert.equal(
  new Set(allQuestions.map((question) => question.seed)).size,
  allQuestions.length,
);
assert.equal(
  new Set(
    allQuestions.map((question) =>
      spatialSceneSemanticFingerprint(question.sourceScene),
    ),
  ).size,
  allQuestions.length,
);

const answerPositions = allQuestions.reduce(
  (counts, question) => {
    counts[question.correctOptionIndex] += 1;
    return counts;
  },
  [0, 0, 0, 0],
);
assert.deepEqual(answerPositions, [5, 5, 5, 5]);

console.log(
  JSON.stringify(
    {
      status: "PASS_SPA_FND_001_MIRROR_WATER_PROOF",
      corpus: {
        total: allQuestions.length,
        mirror: mirrorQuestions.length,
        water: waterQuestions.length,
        answerPositions,
        uniqueSourceScenes: new Set(
          allQuestions.map((question) =>
            spatialSceneSemanticFingerprint(question.sourceScene),
          ),
        ).size,
      },
      checks: {
        deterministicRegeneration: true,
        independentTransformSolve: true,
        fourUniqueOptions: true,
        misconceptionOwnership: true,
        mirrorOuterFigureByteIdentical: true,
        mirrorOnlySecondaryInnerFeatureChanged: true,
        mirrorInnerFeatureFootprintUnchanged: true,
        mirrorInnerOutlineMinimumFiveUnitSeparation: true,
        mirrorPremiumDistractorPerceptuallyDistinct: true,
        balancedAnswerPositions: true,
        explanationEvidence: true,
        lifecycleIsolation: true,
        deterministicSanitisedSvg: true,
      },
    },
    null,
    2,
  ),
);
