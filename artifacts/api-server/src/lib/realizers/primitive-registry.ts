import type {
  RealizationPrimitive,
  RealizerLanguage,
} from "./types";

export type PrimitiveSupport = {
  primitive: RealizationPrimitive;
  en: boolean;
  hi: boolean;
  pa: boolean;
};

export const REALIZATION_PRIMITIVE_SUPPORT: PrimitiveSupport[] =
  [
    "immediate-left",
    "immediate-right",
    "relative-left",
    "relative-right",
    "opposite",
    "adjacent",
    "not-adjacent",
    "between",
    "same-row",
    "different-row",
    "north-facing",
    "south-facing",
    "clockwise",
    "anti-clockwise",
    "not-end",
    "absolute-position",
    "end-position",
    "slot-fixed",
    "slot-gap",
    "slot-parity",
    "slot-immediate",
    "slot-not",
    "attribute-match",
  ].map((primitive) => ({
    primitive: primitive as RealizationPrimitive,
    en: true,
    hi: true,
    pa: true,
  }));

export function getPrimitiveSupport(
  primitive: RealizationPrimitive,
) {
  return REALIZATION_PRIMITIVE_SUPPORT.find(
    (entry) => entry.primitive === primitive,
  );
}

export function diagnosePrimitiveSupport(
  primitives: RealizationPrimitive[],
  languages: RealizerLanguage[],
) {
  const unsupported: string[] = [];
  const missingTemplates: string[] = [];

  for (const primitive of primitives) {
    const support = getPrimitiveSupport(primitive);

    if (!support) {
      missingTemplates.push(
        `Template registry missing for primitive: ${primitive}`,
      );
      continue;
    }

    for (const language of languages) {
      if (!support[language]) {
        unsupported.push(
          `${language} template missing for primitive: ${primitive}`,
        );
      }
    }
  }

  return {
    unsupported,
    missingTemplates,
    passed:
      unsupported.length === 0 &&
      missingTemplates.length === 0,
  };
}
