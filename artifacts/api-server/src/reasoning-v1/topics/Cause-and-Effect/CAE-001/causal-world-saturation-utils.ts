import type { CaeMagnitude, CaeRenderingConstraints, CaeScenarioNodeUnit, CaeScenarioVariant, CaeScope, LocalizedText } from "./types.ts";

export type SaturationEventText = readonly [string, string, string];
export type SaturationScale = Readonly<{ scope: CaeScope; magnitude: CaeMagnitude; severity: CaeMagnitude }>;

export const saturationText = (en: string, hi: string, pa: string): LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
export const saturationEvent = (en: string, hi: string, pa: string): SaturationEventText => [en, hi, pa];

const unit = (
  id: string,
  scale: SaturationScale,
  semanticSlot: string,
  role: CaeScenarioNodeUnit["role"],
  temporalOrder: number,
  value: SaturationEventText,
  primaryEffect = role === "EFFECT",
): CaeScenarioNodeUnit => ({
  semanticSlot,
  role,
  temporalOrder,
  timeBand: temporalOrder === 1 ? "TRIGGER" : temporalOrder === 2 ? "IMMEDIATE_RESPONSE" : temporalOrder === 3 ? "SAME_SHIFT" : "LATER_OUTCOME",
  scope: scale.scope,
  magnitude: scale.magnitude,
  severity: scale.severity,
  primaryEffect,
  text: saturationText(...value),
});

export const saturationChainVariant = (
  id: string,
  scale: SaturationScale,
  backdrop: LocalizedText,
  cause: SaturationEventText,
  bridge: SaturationEventText,
  effect: SaturationEventText,
  terminal: SaturationEventText,
): CaeScenarioVariant => ({
  id,
  backdrop,
  semanticCandidateEvents: [],
  semanticBridgeCandidateEvents: [],
  semanticEffectCandidateEvents: [],
  nodes: [
    unit(id, scale, "cause", "CAUSE", 1, cause),
    unit(id, scale, "bridge", "INTERMEDIATE", 2, bridge, false),
    unit(id, scale, "effect", "EFFECT", 3, effect),
    unit(id, scale, "terminal", "EFFECT", 4, terminal, false),
  ],
  edgeBindings: [
    { from: "cause", to: "bridge" },
    { from: "bridge", to: "effect" },
    { from: "effect", to: "terminal", temporalRelation: "SHORT_DELAY" },
  ],
});

export const saturationBranchVariant = (
  id: string,
  scale: SaturationScale,
  backdrop: LocalizedText,
  cause: SaturationEventText,
  first: SaturationEventText,
  second: SaturationEventText,
): CaeScenarioVariant => ({
  id,
  backdrop,
  semanticCandidateEvents: [],
  semanticBridgeCandidateEvents: [],
  semanticEffectCandidateEvents: [],
  nodes: [
    unit(id, scale, "cause", "CAUSE", 1, cause),
    unit(id, scale, "first-effect", "EFFECT", 2, first),
    unit(id, scale, "second-effect", "EFFECT", 2, second),
  ],
  edgeBindings: [
    { from: "cause", to: "first-effect" },
    { from: "cause", to: "second-effect" },
  ],
});

export const saturationParallelVariant = (
  id: string,
  scale: SaturationScale,
  backdrop: LocalizedText,
  firstCause: SaturationEventText,
  firstEffect: SaturationEventText,
  secondCause: SaturationEventText,
  secondEffect: SaturationEventText,
): CaeScenarioVariant => ({
  id,
  backdrop,
  semanticCandidateEvents: [],
  semanticBridgeCandidateEvents: [],
  semanticEffectCandidateEvents: [],
  nodes: [
    unit(id, scale, "first-cause", "CAUSE", 1, firstCause),
    unit(id, scale, "first-effect", "EFFECT", 2, firstEffect),
    unit(id, scale, "second-cause", "CAUSE", 1, secondCause),
    unit(id, scale, "second-effect", "EFFECT", 2, secondEffect),
  ],
  edgeBindings: [
    { from: "first-cause", to: "first-effect" },
    { from: "second-cause", to: "second-effect" },
  ],
});

export const CAE_SATURATION_RENDERING_CONSTRAINTS: CaeRenderingConstraints = Object.freeze({
  hiddenCanonicalRoles: ["CAUSE", "INTERMEDIATE", "COMPETING"],
  contextMustBeNeutral: true,
  prohibitAnswerInStem: true,
  prohibitIndependenceCue: true,
  explanationMustShowStructure: true,
});
