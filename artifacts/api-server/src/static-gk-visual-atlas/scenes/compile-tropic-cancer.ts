import { TROPIC_OF_CANCER_FACT_LOCK } from "../fact-packs/SGK-VIS-IND-GEO-001";
import type { StaticGkAdminIngestBundle } from "../geometry/ingest-contract";
import {
  REQUIRED_TROPIC_STATES,
  SOI_ADMIN_GEOMETRY_ID,
  SOI_ADMIN_PRODUCT_CODE,
  validateAdminIngestBundle,
} from "../geometry/ingest-contract";
import { assertWestToEastOrder, compileLatitudeSegmentsByState } from "../geometry/latitude-compiler";
import type { StaticGkMapPathSceneRecipe, StaticGkSceneCue } from "./types";

const TROPIC_CLASSROOM_LATITUDE = 23.5;
const STATE_TARGET_IDS: Record<(typeof REQUIRED_TROPIC_STATES)[number], string> = {
  Gujarat: "state.GJ",
  Rajasthan: "state.RJ",
  "Madhya Pradesh": "state.MP",
  Chhattisgarh: "state.CG",
  Jharkhand: "state.JH",
  "West Bengal": "state.WB",
  Tripura: "state.TR",
  Mizoram: "state.MZ",
};

function buildCues(): StaticGkSceneCue[] {
  const stateCueStart = 5_000;
  const stateCueDuration = 2_250;
  const cues: StaticGkSceneCue[] = [
    {
      id: "SGK001-CUE-01",
      startMs: 0,
      endMs: 2_000,
      layer: "base-map",
      action: "show",
      targetRef: "geo.india",
      factIds: ["SGK001-F01"],
    },
    {
      id: "SGK001-CUE-02",
      startMs: 1_500,
      endMs: 5_000,
      layer: "latitude-line",
      action: "trace",
      targetRef: "line.tropic-cancer.india",
      text: "Tropic of Cancer · ≈23½°N",
      factIds: ["SGK001-F01", "SGK001-F04"],
    },
  ];

  REQUIRED_TROPIC_STATES.forEach((stateName, index) => {
    const startMs = stateCueStart + index * stateCueDuration;
    cues.push({
      id: `SGK001-CUE-STATE-${String(index + 1).padStart(2, "0")}`,
      startMs,
      endMs: startMs + stateCueDuration,
      layer: "state-highlight",
      action: "highlight",
      targetRef: STATE_TARGET_IDS[stateName],
      text: `${index + 1}. ${stateName}`,
      factIds: ["SGK001-F03"],
    });
  });

  cues.push(
    {
      id: "SGK001-CUE-RECAP",
      startMs: 23_000,
      endMs: 28_000,
      layer: "labels",
      action: "hold",
      text: "8 states · west → east",
      factIds: ["SGK001-F02", "SGK001-F03"],
    },
    {
      id: "SGK001-CUE-QUIZ",
      startMs: 28_000,
      endMs: 34_000,
      layer: "quiz",
      action: "quiz",
      text: TROPIC_OF_CANCER_FACT_LOCK.quiz.question,
      factIds: TROPIC_OF_CANCER_FACT_LOCK.quiz.factIds,
    },
  );
  return cues;
}

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
    title: TROPIC_OF_CANCER_FACT_LOCK.title,
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
    route: {
      latitude: TROPIC_CLASSROOM_LATITUDE,
      editorialLabel: "Tropic of Cancer · ≈23½°N",
      orderedStateNames: [...REQUIRED_TROPIC_STATES],
      resolvedSegments,
    },
    cues: buildCues(),
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
        "No third-party political boundary geometry may satisfy the production ingest gate.",
      ],
    },
  };
}

export const TROPIC_CANCER_SCENE_PENDING_GEOMETRY = compileTropicCancerScene();
