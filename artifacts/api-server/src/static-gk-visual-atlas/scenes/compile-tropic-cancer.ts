import { TROPIC_OF_CANCER_FACT_LOCK } from "../fact-packs/SGK-VIS-IND-GEO-001";
import type { StaticGkAdminIngestBundle } from "../geometry/ingest-contract";
import {
  REQUIRED_TROPIC_STATES,
  SOI_ADMIN_GEOMETRY_ID,
  SOI_ADMIN_PRODUCT_CODE,
  validateAdminIngestBundle,
} from "../geometry/ingest-contract";
import { assertWestToEastOrder, compileLatitudeSegmentsByState } from "../geometry/latitude-compiler";
import { TROPIC_OF_CANCER_LESSON_MANIFEST } from "../lesson-manifests/SGK-VIS-IND-GEO-001.manifest";
import { compileLessonManifest } from "../lesson-manifests/compile";
import type { StaticGkMapPathSceneRecipe } from "./types";

const TROPIC_CLASSROOM_LATITUDE = 23.5;
const TROPIC_LESSON_CUES = compileLessonManifest(
  TROPIC_OF_CANCER_LESSON_MANIFEST,
  TROPIC_OF_CANCER_FACT_LOCK,
);

export function compileTropicCancerScene(bundle?: StaticGkAdminIngestBundle): StaticGkMapPathSceneRecipe {
  const resolvedSegments: StaticGkMapPathSceneRecipe["route"]["resolvedSegments"] = [];
  let sourceArchiveSha256: string | undefined;
  let canonicalGeoJsonSha256: string | undefined;
  let status: StaticGkMapPathSceneRecipe["status"] = "geometry-pending";

  if (bundle) {
    validateAdminIngestBundle(bundle);
    const segments = compileLatitudeSegmentsByState(bundle.geometry, TROPIC_CLASSROOM_LATITUDE, REQUIRED_TROPIC_STATES);
    assertWestToEastOrder(segments, REQUIRED_TROPIC_STATES);
    resolvedSegments.push(
      ...segments.map((segment) => ({
        stateName: segment.stateName,
        stateCode: segment.stateCode,
        geometry: segment.line.geometry,
      })),
    );
    sourceArchiveSha256 = bundle.receipt.sourceArchiveSha256;
    canonicalGeoJsonSha256 = bundle.receipt.canonicalGeoJsonSha256;
    status = "render-ready";
  }

  return {
    schemaVersion: "1.0",
    rendererVersion: "atlas-map-v1",
    visualId: TROPIC_OF_CANCER_FACT_LOCK.visualId,
    title: TROPIC_OF_CANCER_LESSON_MANIFEST.title,
    template: "india-map-path",
    status,
    viewport: TROPIC_OF_CANCER_LESSON_MANIFEST.viewport,
    geometrySource: {
      geometryId: SOI_ADMIN_GEOMETRY_ID,
      sourceProductCode: SOI_ADMIN_PRODUCT_CODE,
      sourceArchiveSha256,
      canonicalGeoJsonSha256,
    },
    route: {
      latitude: TROPIC_CLASSROOM_LATITUDE,
      editorialLabel: "Tropic of Cancer · ≈23½°N",
      orderedStateNames: [...REQUIRED_TROPIC_STATES],
      resolvedSegments,
    },
    cues: TROPIC_LESSON_CUES.map((cue) => ({ ...cue, factIds: [...cue.factIds] })),
    narration: TROPIC_OF_CANCER_FACT_LOCK.narration.map(({ id, text, factIds }) => ({ id, text, factIds })),
    quiz: {
      question: TROPIC_OF_CANCER_FACT_LOCK.quiz.question,
      options: [...TROPIC_OF_CANCER_FACT_LOCK.quiz.options],
      correctOptionIndex: TROPIC_OF_CANCER_FACT_LOCK.quiz.correctOptionIndex,
      explanation: TROPIC_OF_CANCER_FACT_LOCK.quiz.explanation,
    },
    qa: {
      requiredFactIds: TROPIC_OF_CANCER_FACT_LOCK.facts.map((fact) => fact.id),
      requiredGeoTargetIds: TROPIC_OF_CANCER_FACT_LOCK.geoTargets.map((target) => target.id),
      assertions: [
        "Production status must remain geometry-pending until a checksummed Survey of India OVSF/1M/7 ingest bundle is supplied.",
        "The line is computed at 23.5 degrees north; it is not screen-positioned by hand.",
        "All eight fact-locked states must produce a non-empty latitude intersection.",
        "Resolved segments must preserve the fact-locked west-to-east sequence.",
        "Lesson timing and on-screen actions must come from the validated SGK-VIS-IND-GEO-001 lesson manifest.",
        "No third-party political boundary geometry may satisfy the production ingest gate.",
      ],
    },
  };
}

export const TROPIC_CANCER_SCENE_PENDING_GEOMETRY = compileTropicCancerScene();
