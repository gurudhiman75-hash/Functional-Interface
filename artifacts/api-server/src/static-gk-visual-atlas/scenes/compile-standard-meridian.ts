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
import type { StaticGkMeridianSceneRecipe, StaticGkSceneCue } from "./types";

const STANDARD_MERIDIAN_LONGITUDE = 82.5;
const MIRZAPUR_STATE = "Uttar Pradesh";
const MIRZAPUR_DISTRICT = "Mirzapur";

function normalizeAdminLabel(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-IN");
}

function buildCues(): StaticGkSceneCue[] {
  return [
    {
      id: "SGK002-CUE-01",
      startMs: 0,
      endMs: 3_000,
      layer: "base-map",
      action: "show",
      targetRef: "geo.india",
      factIds: ["SGK002-F01", "SGK002-F03"],
    },
    {
      id: "SGK002-CUE-02",
      startMs: 2_000,
      endMs: 8_000,
      layer: "longitude-line",
      action: "trace",
      targetRef: "line.standard-meridian",
      text: "82°30′E",
      factIds: ["SGK002-F01"],
    },
    {
      id: "SGK002-CUE-03",
      startMs: 7_000,
      endMs: 14_000,
      layer: "state-highlight",
      action: "highlight",
      targetRef: "state.UP",
      text: "Uttar Pradesh",
      factIds: ["SGK002-F02"],
    },
    {
      id: "SGK002-CUE-04",
      startMs: 10_000,
      endMs: 17_000,
      layer: "district-highlight",
      action: "highlight",
      targetRef: "district.mirzapur",
      text: "Mirzapur district",
      factIds: ["SGK002-F02"],
    },
    {
      id: "SGK002-CUE-05",
      startMs: 17_000,
      endMs: 24_000,
      layer: "labels",
      action: "hold",
      text: "IST · GMT +5:30",
      factIds: ["SGK002-F03", "SGK002-F04"],
    },
    {
      id: "SGK002-CUE-QUIZ",
      startMs: 24_000,
      endMs: 31_000,
      layer: "quiz",
      action: "quiz",
      text: STANDARD_MERIDIAN_FACT_LOCK.quiz.question,
      factIds: STANDARD_MERIDIAN_FACT_LOCK.quiz.factIds,
    },
  ];
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
    title: STANDARD_MERIDIAN_FACT_LOCK.title,
    template: "india-map-path",
    status,
    viewport: {
      aspectRatio: "9:16",
      width: 1080,
      height: 1920,
      safeArea: { top: 170, right: 80, bottom: 230, left: 80 },
      projection: "geoMercator",
    },
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
    cues: buildCues(),
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
        "No city marker may be cosmetically snapped onto the meridian to satisfy the locked lesson claim.",
      ],
    },
  };
}

export const STANDARD_MERIDIAN_SCENE_PENDING_GEOMETRY = compileStandardMeridianScene();
