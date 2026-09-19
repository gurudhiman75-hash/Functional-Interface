import { asR, localizeDiagram, localizeFreeText, optionLabel, type R } from "./hindi-foundation";

const BASE_PLACE_HI: Readonly<Record<string, string>> = {
  "school playground": "स्कूल के खेल मैदान",
  "school ground": "स्कूल के मैदान",
  "public park": "सार्वजनिक उद्यान",
  "college campus": "कॉलेज परिसर",
  "office compound": "कार्यालय परिसर",
  "village square": "गाँव के चौक",
  "sports complex": "खेल परिसर",
  "market yard": "बाज़ार के खुले परिसर",
  "open field": "खुले मैदान",
  garden: "बगीचे",
};

const QUALIFIER_HI: Readonly<Record<string, string>> = {
  "near the main gate": "मुख्य द्वार के पास",
  "beside the central lawn": "केंद्रीय लॉन के पास",
  "along a marked track": "चिह्नित पथ वाले",
  "close to the entrance": "प्रवेश द्वार के पास",
  "near the entrance": "प्रवेश द्वार के पास",
  "near the boundary wall": "सीमा-दीवार के पास",
};

const PLACE_PATTERN = /\b(?:a|an) (school playground|school ground|public park|college campus|office compound|village square|sports complex|market yard|open field|garden)(?: (near the main gate|beside the central lawn|along a marked track|close to the entrance|near the entrance|near the boundary wall))?\b/gi;

export function applyHindiEditorialOverrides(input: string): string {
  return input
    .replace(/\bTaran\b/g, "तरन")
    .replace(PLACE_PATTERN, (_match, base: string, qualifier?: string) => {
      const baseText = BASE_PLACE_HI[base.toLowerCase()] ?? base;
      const qualifierText = qualifier ? QUALIFIER_HI[qualifier.toLowerCase()] : undefined;
      return qualifierText ? `${qualifierText} ${baseText}` : baseText;
    });
}

export function optionLabelHindi(option: R): string {
  const value = asR(option.value);
  const label = value?.kind === "DISTANCE" && /√|metres?/i.test(String(option.label))
    ? localizeFreeText(String(option.label))
    : optionLabel(option);
  return applyHindiEditorialOverrides(label);
}

export function localizeDiagramHindi(value: unknown): Readonly<Record<string, unknown>> | undefined {
  const diagram = localizeDiagram(value);
  if (!diagram) return undefined;
  return {
    ...diagram,
    ...(diagram.title ? { title: applyHindiEditorialOverrides(String(diagram.title)) } : {}),
    ...(diagram.svg ? { svg: applyHindiEditorialOverrides(String(diagram.svg)) } : {}),
  };
}
