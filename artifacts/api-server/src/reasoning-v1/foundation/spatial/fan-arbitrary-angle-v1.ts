import { spatialSceneSemanticFingerprint } from "./normalize";
import { validateSpatialPerceptualOptionUniquenessV2 } from "./gap-question-perceptual-v2";
import { SpatialSeededRandom } from "./seed";
import { buildSeededAsymmetricComposition } from "./seeded-composition";
import { rotateScene } from "./transform";
import type { SpatialScene } from "./types";
import { validateSpatialScene } from "./validator";

export type SpatialFanArbitraryAngleV1 = 45 | 135 | -45 | -135;

export interface SpatialFanArbitraryAngleQuestionV1 {
  version: "SPA-FND-001-FAN-ARBITRARY-ANGLE-V1";
  familyCode: "SPA-001";
  chapterCode: "FAN-001";
  prototypeId: string;
  seed: string;
  angleDeg: SpatialFanArbitraryAngleV1;
  stemText: string;
  stimulusScenes: [SpatialScene, SpatialScene, SpatialScene];
  options: Array<{ scene: SpatialScene; angleDeg: number; sceneFingerprint: string }>;
  correctOptionIndex: number;
  learnerExplanation: { observation: string; rule: string; application: string; check: string };
  reviewMetadata: { recommendedStimulusPixels: 128; recommendedOptionPixels: 104; perceptualUniquenessCheck: "PASS" };
  lifecycle: {
    permanentQlId: null;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  };
}

function direction(angleDeg: number): string {
  return angleDeg > 0 ? "clockwise" : "anticlockwise";
}

function optionAngles(intended: SpatialFanArbitraryAngleV1): number[] {
  if (intended === 45) return [45, -45, 90, 180];
  if (intended === -45) return [-45, 45, -90, 180];
  if (intended === 135) return [135, -135, 90, 180];
  return [-135, 135, -90, 180];
}

export function generateSpatialFanArbitraryAngleQuestionV1(input: {
  seed: string;
  angleDeg: SpatialFanArbitraryAngleV1;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): SpatialFanArbitraryAngleQuestionV1 {
  const slotRng = new SpatialSeededRandom(`${input.seed}:correct-slot`);
  const desired = input.desiredCorrectOptionIndex ?? (slotRng.int(0, 3) as 0 | 1 | 2 | 3);
  const pivot = { x: 50, y: 50 };
  const a = buildSeededAsymmetricComposition(`${input.seed}:A`);
  const c = buildSeededAsymmetricComposition(`${input.seed}:C:TRANSFER`);
  const b = rotateScene(a, input.angleDeg, pivot, `${input.seed}:B`);
  const rawAngles = optionAngles(input.angleDeg);
  const rng = new SpatialSeededRandom(`${input.seed}:angle-option-order`);
  const distractors = rng.shuffle(rawAngles.filter((angle) => angle !== input.angleDeg));
  const orderedAngles = [...distractors];
  orderedAngles.splice(desired, 0, input.angleDeg);
  const options = orderedAngles.map((angle, index) => {
    const scene = rotateScene(c, angle, pivot, `${input.seed}:OPTION:${index + 1}:${angle}`);
    return { scene, angleDeg: angle, sceneFingerprint: spatialSceneSemanticFingerprint(scene) };
  });
  const allScenes = [a, b, c, ...options.map((option) => option.scene)];
  for (const scene of allScenes) {
    const validation = validateSpatialScene(scene);
    if (!validation.ok) throw new Error(`${input.seed}: arbitrary-angle FAN scene failed validation.`);
  }
  if (new Set(options.map((option) => option.sceneFingerprint)).size !== 4) {
    throw new Error(`${input.seed}: arbitrary-angle FAN semantic option collision.`);
  }
  const perceptual = validateSpatialPerceptualOptionUniquenessV2(options.map((option) => option.scene));
  if (!perceptual.ok) throw new Error(`${input.seed}: arbitrary-angle FAN perceptual option collision.`);
  const abs = Math.abs(input.angleDeg);
  const dir = direction(input.angleDeg);
  return {
    version: "SPA-FND-001-FAN-ARBITRARY-ANGLE-V1",
    familyCode: "SPA-001",
    chapterCode: "FAN-001",
    prototypeId: `FAN-PQL-01-ANGLE-${input.seed}`,
    seed: input.seed,
    angleDeg: input.angleDeg,
    stemText: "Observe how the first figure changes into the second. Apply the same change to the third figure and choose the correct answer.",
    stimulusScenes: [a, b, c],
    options,
    correctOptionIndex: desired,
    learnerExplanation: {
      observation: `From the first figure to the second, the complete figure turns ${abs}° ${dir}; every visible part moves together.`,
      rule: `Rotate the complete figure ${abs}° ${dir}. Both the angle and the direction of rotation must remain the same.`,
      application: `Turn the entire third figure ${abs}° ${dir} about its centre. Do not rotate only one part and do not substitute a 90° or 180° turn.`,
      check: `Option ${String.fromCharCode(65 + desired)} alone shows the complete ${abs}° ${dir} rotation.`,
    },
    reviewMetadata: { recommendedStimulusPixels: 128, recommendedOptionPixels: 104, perceptualUniquenessCheck: "PASS" },
    lifecycle: {
      permanentQlId: null,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}
