import { STANDARD_MERIDIAN_FACT_LOCK } from "../fact-packs/SGK-VIS-IND-GEO-002";
import type { StaticGkAdminIngestBundle } from "../geometry/ingest-contract";
import {
  SOI_ADMIN_GEOMETRY_ID,
  SOI_ADMIN_PRODUCT_CODE,
  validateAdminIngestBundle,
} from "../geometry/ingest-contract";
import {
  compileLongitudeAcrossIndia,
  compileLongitudeSegmentsForDistrict,
  compileLongitudeSegmentsForState,
} from "../geometry/longitude-compiler";
import { STANDARD_MERIDIAN_LESSON_MANIFEST } from "../lesson-manifests/SGK-VIS-IND-GEO-002.manifest";
import { compileLessonManifest } from "../lesson-manifests/compile";
import type { StaticGkMeridianSceneRecipe } from "./types";

const STANDARD_MERIDIAN_LONGITUDE = 82.5;
const MIRZAPUR_STATE = "Uttar Pradesh";
const MIRZAPUR_DISTRICT = "Mirzapur";
const STANDARD_MERIDIAN_LESSON_CUES = compileLessonManifest(
  STANDARD_MERIDIAN_LESSON_MANIFEST,
  STANDARD_MERIDIAN_FACT_LOCK,
);

function normalizeAdminLabel(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-IN");
}

export function compileStandardMeridianScene(
  bundle?: StaticGkAdminIngestBundle,
): StaticGkMeridianSceneRecipe {
  let status: StaticGkMeridianSceneRecipe["status"] = "geometry-pending";
  let sourceArchiveSha256: string | undefined;
  let canonicalGeoJsonSha256: string | undefined;
  let indiaSegments: StaticGkMeridianSceneRecipe["meridian"]["indiaSegments"] = [];
  let upSegments: StaticGkMeridianSceneRecipe["meridian"]["upSegments"] = [];
  let mirzapurSegments: StaticGkMeridianSceneRecipe["districtOfInterest"]["meridianSegments"] = [];
  let mirzapurFeatureCount = 0;

  if (bundle) {
    validateAdminIngestBundle(bundle);
    indiaSegments = compileLongitudeAcrossIndia(bundle.geometry, STANDARD_MERIDIAN_LONGITUDE);
    upSegments = compileLongitudeSegmentsForState(
      bundle.geometry,
      STANDARD_MERIDIAN_LONGITUDE,
      MIRZAPUR_STATE,
    ).map((segment) => segment.line.geometry);
    sourceArchiveSha256 = bundle.receipt.sourceArchiveSha256;
    canonicalGeoJsonSha256 = bundle.receipt.canonicalGeoJsonSha256;

    const mirzapurStateKey = normalizeAdminLabel(MIRZAPUR_STATE);
    const mirzapurDistrictKey = normalizeAdminLabel(MIRZAPUR_DISTRICT);
    const mirzapurFeatures = bundle.geometry.features.filter(
      (feature) =>
        normalizeAdminLabel(feature.properties.stateName) === mirzapurStateKey &&
        typeof feature.properties.districtName === "string" &&
        normalizeAdminLabel(feature.properties.districtName) === mirzapurDistrictKey,
    );

    if (mirzapurFeatures.length === 0) {
      status = "district-verification-pending";
    } else {
      mirzapurSegments = compileLongitudeSegmentsForDistrict(
        bundle.geometry,
        STANDARD_MERIDIAN_LONGITUDE,
        MIRZAPUR_STATE,
        MIRZAPUR_DISTRICT,
      ).map((segment) => segment.line.geometry);
      mirzapurFeatureCount = mirzapurFeatures.length;
      status = "render-ready";
    }
  }

  return {
    schemaVersion: "1.0",
    rendererVersion: "atlas-map-v1",
    visualId: STANDARD_MERIDIAN_FACT_LOCK.visualId,
    title: STANDARD_MERIDIAN_LESSON_MANIFEST.title,
    template: "india-map-path",
    status,
    viewport: STANDARD_MERIDIAN_LESSON_MANIFEST.viewport,
    geometrySource: {
      geometryId: SOI_ADMIN_GEOMETRY_ID,
      sourceProductCode: SOI_ADMIN_PRODUCT_CODE,
      sourceArchiveSha256,
      canonicalGeoJsonSha256,
    },
    meridian: {
      longitude: STANDARD_MERIDIAN_LONGITUDE,
      editorialLabel: "82°30′E",
      indiaSegments,
      upSegments,
    },
    districtOfInterest: {
      id: "district.mirzapur",
      name: MIRZAPUR_DISTRICT,
      stateName: MIRZAPUR_STATE,
      featureCount: mirzapurFeatureCount,
      meridianSegments: mirzapurSegments,
    },
    cues: STANDARD_MERIDIAN_LESSON_CUES.map((cue) => ({ ...cue, factIds: [...cue.factIds] })),
    narration: STANDARD_MERIDIAN_FACT_LOCK.narration.map(({ id, text, factIds }) => ({ id, text, factIds })),
    quiz: {
      question: STANDARD_MERIDIAN_FACT_LOCK.quiz.question,
      options: [...STANDARD_MERIDIAN_FACT_LOCK.quiz.options],
      correctOptionIndex: STANDARD_MERIDIAN_FACT_LOCK.quiz.correctOptionIndex,
      explanation: STANDARD_MERIDIAN_FACT_LOCK.quiz.explanation,
    },
    qa: {
      requiredFactIds: STANDARD_MERIDIAN_FACT_LOCK.facts.map((fact) => fact.id),
      requiredGeoTargetIds: STANDARD_MERIDIAN_FACT_LOCK.geoTargets.map((target) => target.id),
      assertions: [
        "82°30′E must be compiled as longitude 82.5 and never hand-positioned.",
        "The meridian must intersect canonical India geometry and canonical Uttar Pradesh geometry.",
        "Mirzapur must resolve from official district-level Survey of India geometry before render-ready status.",
        "The canonical Mirzapur district polygon must itself intersect longitude 82.5.",
        "Lesson timing and on-screen actions must come from the validated SGK-VIS-IND-GEO-002 lesson manifest.",
        "No city marker may be cosmetically snapped onto the meridian to satisfy the locked lesson claim.",
      ],
    },
  };
}

export const STANDARD_MERIDIAN_SCENE_PENDING_GEOMETRY = compileStandardMeridianScene();
