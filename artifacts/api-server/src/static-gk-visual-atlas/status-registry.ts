import { GANGA_JOURNEY_FACT_LOCK } from "./fact-packs/SGK-VIS-IND-GEO-003";
import { STANDARD_MERIDIAN_FACT_LOCK } from "./fact-packs/SGK-VIS-IND-GEO-002";
import { TROPIC_OF_CANCER_FACT_LOCK } from "./fact-packs/SGK-VIS-IND-GEO-001";
import { STATIC_GK_GEOMETRY_REGISTRY } from "./geometry-registry";
import { STATIC_GK_VISUAL_ATLAS_PILOT } from "./pilot-backlog";
import { STANDARD_MERIDIAN_SCENE_PENDING_GEOMETRY } from "./scenes/compile-standard-meridian";
import { TROPIC_CANCER_SCENE_PENDING_GEOMETRY } from "./scenes/compile-tropic-cancer";

export type StaticGkAtlasReadiness =
  | "backlog"
  | "fact-lock"
  | "geometry-pending"
  | "district-verification-pending"
  | "scene-compiler-pending"
  | "render-ready";

export interface StaticGkAtlasStatusItem {
  id: string;
  title: string;
  priority: 1 | 2 | 3;
  category: string;
  subcategory: string;
  template: string;
  factLockStatus: "none" | "draft" | "source-locked" | "review-approved";
  readiness: StaticGkAtlasReadiness;
  sceneCompiler: "none" | "tropic-v1" | "standard-meridian-v1";
  blockers: string[];
}

const factLocks = new Map([
  [TROPIC_OF_CANCER_FACT_LOCK.visualId, TROPIC_OF_CANCER_FACT_LOCK],
  [STANDARD_MERIDIAN_FACT_LOCK.visualId, STANDARD_MERIDIAN_FACT_LOCK],
  [GANGA_JOURNEY_FACT_LOCK.visualId, GANGA_JOURNEY_FACT_LOCK],
]);

function statusFor(id: string): Pick<StaticGkAtlasStatusItem, "readiness" | "sceneCompiler" | "blockers"> {
  if (id === TROPIC_OF_CANCER_FACT_LOCK.visualId) {
    return {
      readiness: TROPIC_CANCER_SCENE_PENDING_GEOMETRY.status,
      sceneCompiler: "tropic-v1",
      blockers: [
        "SOI OVSF/1M/7 geometry is validated. Place canonical digest ab3ef2d51a6c326f7e75a7d6e4fea1386476cb8c1f02599564af76f340f12001 in approved runtime object storage, wire the geometry loader, then complete contact-sheet visual QA.",
      ],
    };
  }
  if (id === STANDARD_MERIDIAN_FACT_LOCK.visualId) {
    return {
      readiness: STANDARD_MERIDIAN_SCENE_PENDING_GEOMETRY.status,
      sceneCompiler: "standard-meridian-v1",
      blockers: [
        "SOI OVSF/1M/7 geometry and Mirzapur DIST_LGD 199 are validated. Place the canonical bundle in approved runtime object storage, wire the geometry loader, then complete contact-sheet visual QA.",
      ],
    };
  }
  if (id === GANGA_JOURNEY_FACT_LOCK.visualId) {
    return {
      readiness: "scene-compiler-pending",
      sceneCompiler: "none",
      blockers: ["Select and ingest authoritative production vector geometry for the Ganga river system."],
    };
  }
  const candidate = STATIC_GK_VISUAL_ATLAS_PILOT.find((item) => item.id === id);
  return {
    readiness: candidate?.authoringState ?? "backlog",
    sceneCompiler: "none",
    blockers: candidate?.authoringState === "fact-lock"
      ? ["Complete authoritative source lock before scene compilation."]
      : ["Move candidate into fact-lock authoring."],
  };
}

export function getStaticGkAtlasStatus() {
  const items: StaticGkAtlasStatusItem[] = STATIC_GK_VISUAL_ATLAS_PILOT.map((candidate) => {
    const factLock = factLocks.get(candidate.id);
    return {
      id: candidate.id,
      title: candidate.title,
      priority: candidate.priority,
      category: candidate.category,
      subcategory: candidate.subcategory,
      template: candidate.template,
      factLockStatus: factLock?.status ?? "none",
      ...statusFor(candidate.id),
    };
  });

  return {
    program: "Static GK Visual Atlas",
    schemaVersion: "1.0",
    pilotCount: items.length,
    sourceLockedCount: items.filter((item) => item.factLockStatus === "source-locked").length,
    compilerCount: items.filter((item) => item.sceneCompiler !== "none").length,
    renderReadyCount: items.filter((item) => item.readiness === "render-ready").length,
    geometryAssets: STATIC_GK_GEOMETRY_REGISTRY.map((asset) => ({
      id: asset.id,
      name: asset.name,
      kind: asset.kind,
      sourcePublisher: asset.sourcePublisher,
      sourceProductCode: asset.sourceProductCode,
      status: asset.status,
    })),
    items,
  };
}
