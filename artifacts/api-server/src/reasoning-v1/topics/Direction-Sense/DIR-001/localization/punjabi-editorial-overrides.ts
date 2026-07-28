import { asR, localizeDiagramPa, localizeFreeTextPa, optionLabelPa, type R } from "./punjabi-foundation";

const BASE_PLACE_PA: Readonly<Record<string, string>> = {
  "school playground": "ਸਕੂਲ ਦੇ ਖੇਡ ਮੈਦਾਨ",
  "school ground": "ਸਕੂਲ ਦੇ ਮੈਦਾਨ",
  "public park": "ਸਰਕਾਰੀ ਬਾਗ਼",
  "college campus": "ਕਾਲਜ ਕੈਂਪਸ",
  "office compound": "ਦਫ਼ਤਰ ਦੇ ਅਹਾਤੇ",
  "village square": "ਪਿੰਡ ਦੇ ਚੌਕ",
  "sports complex": "ਖੇਡ ਕੰਪਲੈਕਸ",
  "market yard": "ਬਾਜ਼ਾਰ ਦੇ ਖੁੱਲ੍ਹੇ ਅਹਾਤੇ",
  "open field": "ਖੁੱਲ੍ਹੇ ਮੈਦਾਨ",
  garden: "ਬਾਗ਼",
};

const QUALIFIER_PA: Readonly<Record<string, string>> = {
  "near the main gate": "ਮੁੱਖ ਦਰਵਾਜ਼ੇ ਕੋਲ",
  "beside the central lawn": "ਵਿਚਕਾਰਲੇ ਲਾਨ ਕੋਲ",
  "along a marked track": "ਨਿਸ਼ਾਨ ਲੱਗੇ ਰਸਤੇ ਵਾਲੇ",
  "close to the entrance": "ਦਾਖ਼ਲੇ ਦੇ ਨੇੜੇ",
  "near the entrance": "ਦਾਖ਼ਲੇ ਦੇ ਨੇੜੇ",
  "near the boundary wall": "ਚਾਰਦੀਵਾਰੀ ਕੋਲ",
};

const PLACE_PATTERN = /\b(?:a|an) (school playground|school ground|public park|college campus|office compound|village square|sports complex|market yard|open field|garden)(?: (near the main gate|beside the central lawn|along a marked track|close to the entrance|near the entrance|near the boundary wall))?\b/gi;

export function applyPunjabiEditorialOverrides(input: string): string {
  return input
    .replace(/\bTaran\b/g, "ਤਰਨ")
    .replace(PLACE_PATTERN, (_match, base: string, qualifier?: string) => {
      const baseText = BASE_PLACE_PA[base.toLowerCase()] ?? base;
      const qualifierText = qualifier ? QUALIFIER_PA[qualifier.toLowerCase()] : undefined;
      return qualifierText ? `${qualifierText} ${baseText}` : baseText;
    });
}

export function optionLabelPunjabi(option: R): string {
  const value = asR(option.value);
  const label = value?.kind === "DISTANCE" && /√|metres?/i.test(String(option.label))
    ? localizeFreeTextPa(String(option.label))
    : optionLabelPa(option);
  return applyPunjabiEditorialOverrides(label);
}

export function localizeDiagramPunjabi(value: unknown): Readonly<Record<string, unknown>> | undefined {
  const diagram = localizeDiagramPa(value);
  if (!diagram) return undefined;
  return {
    ...diagram,
    ...(diagram.title ? { title: applyPunjabiEditorialOverrides(String(diagram.title)) } : {}),
    ...(diagram.svg ? { svg: applyPunjabiEditorialOverrides(String(diagram.svg)) } : {}),
  };
}
