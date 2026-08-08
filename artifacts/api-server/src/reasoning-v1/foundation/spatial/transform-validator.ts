import {
  areSpatialScenesEquivalent,
  spatialSceneSemanticFingerprint,
} from "./normalize";
import {
  transformSceneByRequestedOperation,
  type SpatialSymmetryAxes,
} from "./symmetry";
import type {
  SpatialRequestedTransform,
  SpatialScene,
  SpatialTransformCandidate,
  SpatialValidationIssue,
  SpatialValidationResult,
} from "./types";
import { validateSpatialScene } from "./validator";

function issue(code: string, message: string): SpatialValidationIssue {
  return { code, message };
}

export function validateSpatialTransformCandidateUniqueness(
  candidates: SpatialTransformCandidate[],
): SpatialValidationResult {
  const errors: SpatialValidationIssue[] = [];
  const warnings: SpatialValidationIssue[] = [];
  const owners = new Map<string, string>();
  const labels = new Set<string>();

  for (const candidate of candidates) {
    if (!candidate.label.trim()) {
      errors.push(
        issue(
          "SPA_EMPTY_TRANSFORM_CANDIDATE_LABEL",
          "Every transform candidate requires a label.",
        ),
      );
    } else if (labels.has(candidate.label)) {
      errors.push(
        issue(
          "SPA_DUPLICATE_TRANSFORM_CANDIDATE_LABEL",
          `Duplicate transform candidate label '${candidate.label}'.`,
        ),
      );
    }
    labels.add(candidate.label);

    const sceneResult = validateSpatialScene(candidate.scene);
    errors.push(
      ...sceneResult.errors.map((entry) => ({
        ...entry,
        message: `${candidate.label}: ${entry.message}`,
      })),
    );
    warnings.push(
      ...sceneResult.warnings.map((entry) => ({
        ...entry,
        message: `${candidate.label}: ${entry.message}`,
      })),
    );

    const fingerprint = spatialSceneSemanticFingerprint(candidate.scene);
    const existingOwner = owners.get(fingerprint);
    if (existingOwner !== undefined) {
      errors.push(
        issue(
          "SPA_EQUIVALENT_TRANSFORM_CANDIDATES",
          `Transform candidates '${existingOwner}' and '${candidate.label}' are semantically equivalent.`,
        ),
      );
    } else {
      owners.set(fingerprint, candidate.label);
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}

export interface SpatialTransformQuestionValidationInput {
  sourceScene: SpatialScene;
  requestedTransform: SpatialRequestedTransform;
  axes?: SpatialSymmetryAxes;
  allowSelfSymmetry?: boolean;
  candidates?: SpatialTransformCandidate[];
}

export function validateSpatialTransformQuestion(
  input: SpatialTransformQuestionValidationInput,
): SpatialValidationResult {
  const errors: SpatialValidationIssue[] = [];
  const warnings: SpatialValidationIssue[] = [];

  const sourceResult = validateSpatialScene(input.sourceScene);
  errors.push(...sourceResult.errors);
  warnings.push(...sourceResult.warnings);

  const correctScene = transformSceneByRequestedOperation(
    input.sourceScene,
    input.requestedTransform,
    input.axes,
    `${input.sourceScene.id}-correct-transform`,
  );

  if (
    !input.allowSelfSymmetry &&
    areSpatialScenesEquivalent(input.sourceScene, correctScene)
  ) {
    errors.push(
      issue(
        "SPA_ACCIDENTAL_SELF_SYMMETRY",
        `Source scene is unchanged by ${input.requestedTransform}; this is degenerate outside an explicit symmetry task.`,
      ),
    );
  }

  if (input.candidates) {
    const candidateResult = validateSpatialTransformCandidateUniqueness(
      input.candidates,
    );
    errors.push(...candidateResult.errors);
    warnings.push(...candidateResult.warnings);

    const correctFingerprint = spatialSceneSemanticFingerprint(correctScene);
    const matchingCandidates = input.candidates.filter(
      (candidate) =>
        spatialSceneSemanticFingerprint(candidate.scene) === correctFingerprint,
    );

    if (matchingCandidates.length !== 1) {
      errors.push(
        issue(
          "SPA_CORRECT_TRANSFORM_MATCH_COUNT",
          `Expected exactly one candidate matching the requested transform; found ${matchingCandidates.length}.`,
        ),
      );
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}
