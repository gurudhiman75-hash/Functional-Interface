import { GANGA_JOURNEY_FACT_LOCK } from "./fact-packs/SGK-VIS-IND-GEO-003";
import { STANDARD_MERIDIAN_FACT_LOCK } from "./fact-packs/SGK-VIS-IND-GEO-002";
import { TROPIC_OF_CANCER_FACT_LOCK } from "./fact-packs/SGK-VIS-IND-GEO-001";
import { STATIC_GK_GEOMETRY_REGISTRY } from "./geometry-registry";
import type { StaticGkAdminIngestBundle } from "./geometry/ingest-contract";
import { STATIC_GK_VISUAL_ATLAS_PILOT } from "./pilot-backlog";
import { compileStandardMeridianScene } from "./scenes/compile-standard-meridian";
import { compileTropicCancerScene } from "./scenes/compile-tropic-cancer";

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

type CompiledPilotScenes = {
  tropic: ReturnType<typeof compileTropicCancerScene>;
  standardMeridian: ReturnType<typeof compileStandardMeridianScene>;
};

function statusFor(
  id: string,
  scenes: CompiledPilotScenes,
): Pick<StaticGkAtlasStatusItem, "readiness" | "sceneCompiler" | "blockers"> {
  if (id === TROPIC_OF_CANCER_FACT_LOCK.visualId) {
    return {
      readiness: scenes.tropic.status,
      sceneCompiler: "tropic-v1",
      blockers: scenes.tropic.status === "render-ready"
        ? []
        : [
            "Survey of India OVSF/1M/7 geometry is source-validated but no verified runtime bundle is currently loaded. Configure one approved runtime geometry source and complete contact-sheet visual QA.",
          ],
    };
  }
  if (id === STANDARD_MERIDIAN_FACT_LOCK.visualId) {
    const blockers = scenes.standardMeridian.status === "render-ready"
      ? []
      : scenes.standardMeridian.status === "district-verification-pending"
        ? [
            "Runtime Survey of India geometry loaded, but the canonical Mirzapur district polygon did not satisfy the 82°30′E verification gate.",
          ]
        : [
            "Survey of India OVSF/1M/7 geometry and Mirzapur DIST_LGD 199 are source-validated but no verified runtime bundle is currently loaded. Configure one approved runtime geometry source and complete contact-sheet visual QA.",
          ];
    return {
      readiness: scenes.standardMeridian.status,
      sceneCompiler: "standard-meridian-v1",
      blockers,
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

export function getStaticGkAtlasStatus(bundle?: StaticGkAdminIngestBundle) {
  const scenes: CompiledPilotScenes = {
    tropic: compileTropicCancerScene(bundle),
    standardMeridian: compileStandardMeridianScene(bundle),
  };

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
      ...statusFor(candidate.id, scenes),
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
