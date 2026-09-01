import type { ArgCp003Template, RenderedArgCp003Template } from "./cp003-saturation-types.ts";

export type ArgCp009DimensionIndex = 0 | 1 | 2 | 3;

export type ArgCp009CorrelatedPair = Readonly<{
  dimensions: readonly [ArgCp009DimensionIndex, ArgCp009DimensionIndex];
  /**
   * Exactly sixteen curated pairs. The two base-4 digits belonging to the
   * selected dimensions are combined into a 0..15 selector, preserving the
   * original 256 variants/template without allowing unsafe Cartesian pairing.
   */
  values: readonly (readonly [string, string])[];
}>;

export type ArgCp009Template = ArgCp003Template & Readonly<{
  remediationAuthority: "ARG_CP009_EDITORIAL_REMEDIATION_V1";
  correlatedPairs?: readonly ArgCp009CorrelatedPair[];
}>;

export type RenderedArgCp009Template = RenderedArgCp003Template & Readonly<{
  remediationAuthority: "ARG_CP009_EDITORIAL_REMEDIATION_V1";
}>;
