import { STANDARD_MERIDIAN_FACT_LOCK } from "../fact-packs/SGK-VIS-IND-GEO-002";
import type { StaticGkAdminIngestBundle } from "../geometry/ingest-contract";
import {
  SOI_ADMIN_GEOMETRY_ID,
  SOI_ADMIN_PRODUCT_CODE,
  validateAdminIngestBundle,
} from "../geometry/ingest-contract";
import { compileLongitudeAcrossIndia, compileLongitudeSegmentsForState } from "../geometry/longitude-compiler";
import { pointInArea } from "../geometry/point-in-area";
import type { StaticGkMeridianSceneRecipe, StaticGkSceneCue } from "./types";

const STANDARD_MERIDIAN_LONGITUDE = 82.5;

export interface VerifiedStaticGkPoint {
  latitude: number;
  longitude: number;
  source: string;
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
      layer: "point-marker",
      action: "label",
      targetRef: "point.mirzapur",
      text: "Mirzapur",
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
  mirzapur?: VerifiedStaticGkPoint,
): StaticGkMeridianSceneRecipe {
  let status: StaticGkMeridianSceneRecipe["status"] = "geometry-pending";
  let sourceArchiveSha256: string | undefined;
  let canonicalGeoJsonSha256: string | undefined;
  let indiaSegments: StaticGkMeridianSceneRecipe["meridian"]["indiaSegments"] = [];
  let upSegments: StaticGkMeridianSceneRecipe["meridian"]["upSegments"] = [];

  if (bundle) {
    validateAdminIngestBundle(bundle);
    indiaSegments = compileLongitudeAcrossIndia(bundle.geometry, STANDARD_MERIDIAN_LONGITUDE);
    upSegments = compileLongitudeSegmentsForState(bundle.geometry, STANDARD_MERIDIAN_LONGITUDE, "Uttar Pradesh").map(
      (segment) => segment.line.geometry,
    );
    sourceArchiveSha256 = bundle.receipt.sourceArchiveSha256;
    canonicalGeoJsonSha256 = bundle.receipt.canonicalGeoJsonSha256;
    status = "point-verification-pending";

    if (mirzapur) {
      if (!Number.isFinite(mirzapur.latitude) || !Number.isFinite(mirzapur.longitude)) {
        throw new Error("Mirzapur point contains non-finite coordinates");
      }
      if (!mirzapur.source.trim()) throw new Error("Mirzapur point requires a verification source");
      const upFeatures = bundle.geometry.features.filter((feature) => feature.properties.stateName === "Uttar Pradesh");
      const insideUttarPradesh = upFeatures.some((feature) => pointInArea([mirzapur.longitude, mirzapur.latitude], feature.geometry));
      if (!insideUttarPradesh) throw new Error("Verified Mirzapur point does not lie inside canonical Uttar Pradesh geometry");
      if (Math.abs(mirzapur.longitude - STANDARD_MERIDIAN_LONGITUDE) > 0.5) {
        throw new Error("Verified Mirzapur point is implausibly far from 82°30′E for the locked lesson claim");
      }
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
    pointOfInterest: {
      id: "point.mirzapur",
      name: "Mirzapur",
      latitude: mirzapur?.latitude,
      longitude: mirzapur?.longitude,
      verificationSource: mirzapur?.source,
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
        "Mirzapur must be independently source-verified before render-ready status.",
        "The Mirzapur point must lie inside canonical Uttar Pradesh geometry.",
        "The Mirzapur marker must not be snapped onto the meridian for cosmetic alignment.",
      ],
    },
  };
}

export const STANDARD_MERIDIAN_SCENE_PENDING_GEOMETRY = compileStandardMeridianScene();
