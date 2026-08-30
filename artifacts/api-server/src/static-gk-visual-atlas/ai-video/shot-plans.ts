import type { SupportedStaticGkRenderVisualId } from "../render-job-contract";
import type { StaticGkAiShotPlan } from "./types";

const SHARED_CONTINUITY = [
  "premium cinematic 3D geography documentary",
  "physically plausible terrain and atmosphere",
  "deep navy, natural earth and warm sunrise palette",
  "smooth restrained camera motion",
  "no presenter",
  "no legible text, typography, numbers, flags, watermarks or logos",
  "no political labels or generated map annotations",
  "leave clean negative space for Examtree factual overlays",
].join("; ");

const TROPIC_SHOTS: readonly StaticGkAiShotPlan[] = [
  {
    visualId: "SGK-VIS-IND-GEO-001", shotId: "SGK-VIS-IND-GEO-001:shot-1", order: 1, durationSeconds: 5,
    purpose: "cinematic hook and India orientation",
    subject: "the Indian subcontinent seen from low Earth orbit, recognizable natural coastline and topography without political markings",
    environment: "curved Earth at dawn, thin atmospheric glow, realistic cloud systems and deep space",
    camera: "slow orbital push toward the subcontinent with subtle parallax and no sudden rotation",
    lighting: "golden sunrise grazing the terrain with cool blue atmosphere",
    composition: "India centered in the lower-middle frame with uncluttered upper safe area",
    continuity: SHARED_CONTINUITY,
  },
  {
    visualId: "SGK-VIS-IND-GEO-001", shotId: "SGK-VIS-IND-GEO-001:shot-2", order: 2, durationSeconds: 5,
    purpose: "establish a premium three-dimensional geography surface",
    subject: "a highly detailed raised-relief physical model of the Indian subcontinent with mountains, plains, plateau and coastline visible but no borders",
    environment: "dark museum-like geographic studio with subtle atmospheric haze and realistic terrain materials",
    camera: "gentle descending dolly from oblique aerial view toward a near-top-down relief view",
    lighting: "soft rim light on mountain ridges and warm directional key light",
    composition: "relief model centered with clear lateral space across the middle for a deterministic latitude overlay",
    continuity: SHARED_CONTINUITY,
  },
  {
    visualId: "SGK-VIS-IND-GEO-001", shotId: "SGK-VIS-IND-GEO-001:shot-3", order: 3, durationSeconds: 5,
    purpose: "west-to-east geographic journey backdrop",
    subject: "a broad cinematic aerial transition across western and central Indian terrain, moving from dry salt-and-desert textures into plateau and greener interior landscapes",
    environment: "realistic large-scale terrain, distant haze, scattered monsoon clouds, no landmarks or signs",
    camera: "steady west-to-east drone-like flyover with moderate altitude and strong depth parallax",
    lighting: "late-afternoon sunlight with volumetric rays and natural shadows",
    composition: "terrain fills frame while the central horizontal band remains visually calm for route and state overlays",
    continuity: SHARED_CONTINUITY,
  },
  {
    visualId: "SGK-VIS-IND-GEO-001", shotId: "SGK-VIS-IND-GEO-001:shot-4", order: 4, durationSeconds: 5,
    purpose: "eastern India geographic journey backdrop",
    subject: "cinematic aerial terrain transitioning from broad green river plains into humid forested hills of northeastern India",
    environment: "lush vegetation, winding natural waterways, distant hills and soft cloud shadows without identifiable buildings or signage",
    camera: "smooth eastward tracking shot that gently rises to reveal wider geography",
    lighting: "bright diffused monsoon light with rich greens and soft atmospheric depth",
    composition: "open center and lower-third safe areas for deterministic state labels",
    continuity: SHARED_CONTINUITY,
  },
  {
    visualId: "SGK-VIS-IND-GEO-001", shotId: "SGK-VIS-IND-GEO-001:shot-5", order: 5, durationSeconds: 5,
    purpose: "recap and exam-recall hero background",
    subject: "an elegant three-dimensional physical relief of the Indian subcontinent floating subtly above a dark premium studio surface",
    environment: "minimal geographic studio, faint particles and atmospheric depth, no annotations",
    camera: "slow pullback into a stable near-top-down hero composition",
    lighting: "controlled dramatic rim lighting with a warm horizon glow",
    composition: "large clean central and lower regions reserved for quiz and recall overlays",
    continuity: SHARED_CONTINUITY,
  },
] as const;

const MERIDIAN_SHOTS: readonly StaticGkAiShotPlan[] = [
  {
    visualId: "SGK-VIS-IND-GEO-002", shotId: "SGK-VIS-IND-GEO-002:shot-1", order: 1, durationSeconds: 5,
    purpose: "cinematic hook and India orientation",
    subject: "the Indian subcontinent from low Earth orbit with physically realistic coastlines and terrain, free of political markings",
    environment: "Earth at blue hour with atmospheric glow, subtle city-light texture too small to read and deep space",
    camera: "slow orbital move into a centered view of the subcontinent",
    lighting: "cool blue atmosphere with warm dawn edge light",
    composition: "India centered with clear vertical safe space for a deterministic meridian overlay",
    continuity: SHARED_CONTINUITY,
  },
  {
    visualId: "SGK-VIS-IND-GEO-002", shotId: "SGK-VIS-IND-GEO-002:shot-2", order: 2, durationSeconds: 5,
    purpose: "three-dimensional meridian map backdrop",
    subject: "a detailed raised-relief physical model of India emphasizing north-south terrain depth without any labels or borders",
    environment: "premium dark geographic visualization studio with realistic earth materials",
    camera: "controlled tilt from oblique perspective toward top-down view",
    lighting: "soft directional key light and cool rim lighting",
    composition: "a clean vertical corridor through the center-right is reserved for the factual longitude line",
    continuity: SHARED_CONTINUITY,
  },
  {
    visualId: "SGK-VIS-IND-GEO-002", shotId: "SGK-VIS-IND-GEO-002:shot-3", order: 3, durationSeconds: 5,
    purpose: "north-central India terrain backdrop",
    subject: "wide cinematic aerial view of north-central Indian plains with a major river landscape, agricultural texture and distant settlement silhouettes too small for identification",
    environment: "broad alluvial plain, natural river bends, atmospheric haze and scattered clouds",
    camera: "slow forward glide with slight downward tilt",
    lighting: "warm early-morning sunlight and long soft shadows",
    composition: "center frame remains uncluttered for a district highlight and longitude overlay",
    continuity: SHARED_CONTINUITY,
  },
  {
    visualId: "SGK-VIS-IND-GEO-002", shotId: "SGK-VIS-IND-GEO-002:shot-4", order: 4, durationSeconds: 5,
    purpose: "time-standard conceptual backdrop",
    subject: "a cinematic physical globe focused on South Asia with sunlight advancing across its surface, no clocks, labels or numerals",
    environment: "dark observatory-style studio with subtle volumetric atmosphere",
    camera: "slow lateral arc around the globe while maintaining South Asia in view",
    lighting: "moving sunrise terminator with warm gold and cool blue contrast",
    composition: "right and lower thirds kept clean for deterministic time-standard facts",
    continuity: SHARED_CONTINUITY,
  },
  {
    visualId: "SGK-VIS-IND-GEO-002", shotId: "SGK-VIS-IND-GEO-002:shot-5", order: 5, durationSeconds: 5,
    purpose: "recap and quiz hero background",
    subject: "an elegant raised-relief model of India in a premium studio, viewed nearly top-down without annotations",
    environment: "minimal dark geographic set with subtle haze and soft reflective surface",
    camera: "slow settling pullback to a stable hero frame",
    lighting: "dramatic but restrained rim light with a soft warm accent",
    composition: "large clean lower half for deterministic quiz content",
    continuity: SHARED_CONTINUITY,
  },
] as const;

const SHOTS_BY_VISUAL: Record<SupportedStaticGkRenderVisualId, readonly StaticGkAiShotPlan[]> = {
  "SGK-VIS-IND-GEO-001": TROPIC_SHOTS,
  "SGK-VIS-IND-GEO-002": MERIDIAN_SHOTS,
};

export function getStaticGkAiShotPlan(visualId: SupportedStaticGkRenderVisualId): readonly StaticGkAiShotPlan[] {
  return SHOTS_BY_VISUAL[visualId];
}
