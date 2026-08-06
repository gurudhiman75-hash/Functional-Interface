import { exactKey } from "../foundation/exact";
import { generateMenCp008Wave01Prototype } from "../cp008-gap-wave-01/runtime";
import { generateMenCp008Wave02Prototype } from "../cp008-gap-wave-02/runtime";

export const MEN_CP_008_MERGE_REVIEW_DECISIONS = [
  {
    groupId: "EQUAL_VOLUME_CYLINDER_CONE_MISSING_HEIGHT_DIRECTION",
    decision: "MERGE_AS_TARGET_SOLID_PARAMETER",
    canonicalFamilyId: "EQUAL_VOLUME_CYLINDER_CONE_MISSING_HEIGHT",
    answerSemantic: "LENGTH",
    governingEquation: "pi*Rc^2*Hc=(1/3)*pi*Rk^2*Hk",
    retainedAncestries: [
      "MEN-CP008-W1-PROT-EQUAL-VOLUME-CONE-HEIGHT",
      "MEN-CP008-W2-PROT-EQUAL-VOLUME-CYLINDER-HEIGHT",
    ],
    reason:
      "Both directions conserve the same cylinder-cone volume equality and return a missing height. The target solid changes the rearrangement and factor-of-three direction, but not the learner contract or answer semantic.",
  },
  {
    groupId: "ROLLER_INVERSE_DIMENSION_DIRECTION",
    decision: "MERGE_AS_MISSING_DIMENSION_PARAMETER",
    canonicalFamilyId: "ROLLER_SWEPT_AREA_MISSING_LINEAR_DIMENSION",
    answerSemantic: "LENGTH",
    governingEquation: "A=2*pi*r*L*n",
    retainedAncestries: [
      "MEN-CP008-W1-PROT-ROLLER-LENGTH-FROM-SWEPT-AREA",
      "MEN-CP008-W1-PROT-ROLLER-RADIUS-FROM-SWEPT-AREA",
    ],
    reason:
      "Both tasks divide the same swept-area product by all known factors to recover one missing linear dimension. Radius versus roller length is a target-role parameter, while the output unit and decisive inverse reasoning remain identical.",
  },
] as const;

export function auditMenCp008DirectionalMergeEvidence(seedsPerPrototype = 80) {
  const equalVolumeCone = [];
  const equalVolumeCylinder = [];
  const rollerLength = [];
  const rollerRadius = [];

  for (let index = 0; index < seedsPerPrototype; index += 1) {
    equalVolumeCone.push(
      generateMenCp008Wave01Prototype(
        "MEN-CP008-W1-PROT-EQUAL-VOLUME-CONE-HEIGHT",
        `men-cp008-merge-review:equal-volume-cone:${index}`,
      ),
    );
    equalVolumeCylinder.push(
      generateMenCp008Wave02Prototype(
        "MEN-CP008-W2-PROT-EQUAL-VOLUME-CYLINDER-HEIGHT",
        `men-cp008-merge-review:equal-volume-cylinder:${index}`,
      ),
    );
    rollerLength.push(
      generateMenCp008Wave01Prototype(
        "MEN-CP008-W1-PROT-ROLLER-LENGTH-FROM-SWEPT-AREA",
        `men-cp008-merge-review:roller-length:${index}`,
      ),
    );
    rollerRadius.push(
      generateMenCp008Wave01Prototype(
        "MEN-CP008-W1-PROT-ROLLER-RADIUS-FROM-SWEPT-AREA",
        `men-cp008-merge-review:roller-radius:${index}`,
      ),
    );
  }

  const all = [
    ...equalVolumeCone,
    ...equalVolumeCylinder,
    ...rollerLength,
    ...rollerRadius,
  ];

  const equalVolumeInvariantFailures = [
    ...equalVolumeCone,
    ...equalVolumeCylinder,
  ].filter((question) => {
    const d = question.state.dimensions;
    return 3n * d.cylinderRadius ** 2n * d.cylinderHeight !==
      d.coneRadius ** 2n * d.coneHeight;
  });

  const rollerInvariantFailures = [
    ...rollerLength,
    ...rollerRadius,
  ].filter((question) => {
    const d = question.state.dimensions;
    const expected = (44n * d.radius * d.length * d.revolutions) / 7n;
    return expected !== d.sweptArea;
  });

  const groupMetrics = {
    equalVolume: {
      generated: equalVolumeCone.length + equalVolumeCylinder.length,
      targetKinds: [...new Set([...equalVolumeCone, ...equalVolumeCylinder].map((q) => q.target))],
      units: [...new Set([...equalVolumeCone, ...equalVolumeCylinder].map((q) => q.unit))],
      exactKinds: [...new Set([...equalVolumeCone, ...equalVolumeCylinder].map((q) => q.exactAnswer.kind))],
      solveModes: [...new Set([...equalVolumeCone, ...equalVolumeCylinder].map((q) => q.solveMode))],
      answerFingerprints: new Set(
        [...equalVolumeCone, ...equalVolumeCylinder].map((q) => exactKey(q.exactAnswer)),
      ).size,
      invariantFailures: equalVolumeInvariantFailures.length,
    },
    rollerInverse: {
      generated: rollerLength.length + rollerRadius.length,
      targetKinds: [...new Set([...rollerLength, ...rollerRadius].map((q) => q.target))],
      units: [...new Set([...rollerLength, ...rollerRadius].map((q) => q.unit))],
      exactKinds: [...new Set([...rollerLength, ...rollerRadius].map((q) => q.exactAnswer.kind))],
      solveModes: [...new Set([...rollerLength, ...rollerRadius].map((q) => q.solveMode))],
      answerFingerprints: new Set(
        [...rollerLength, ...rollerRadius].map((q) => exactKey(q.exactAnswer)),
      ).size,
      invariantFailures: rollerInvariantFailures.length,
    },
  };

  return {
    generated: all.length,
    valid: all.every((question) => question.validation.valid && question.verification.valid),
    lifecycleLocked: all.every(
      (question) =>
        question.permanentQlId === null &&
        !question.publiclyPublishable &&
        !question.questionStudioDiscoverable,
    ),
    allThreeStep: all.every((question) => question.explanation.steps.length === 3),
    allThreeTraps: all.every((question) => question.explanation.traps.length === 3),
    decisions: MEN_CP_008_MERGE_REVIEW_DECISIONS,
    groupMetrics,
    samples: {
      equalVolumeCone: equalVolumeCone.slice(0, 3),
      equalVolumeCylinder: equalVolumeCylinder.slice(0, 3),
      rollerLength: rollerLength.slice(0, 3),
      rollerRadius: rollerRadius.slice(0, 3),
    },
  };
}
