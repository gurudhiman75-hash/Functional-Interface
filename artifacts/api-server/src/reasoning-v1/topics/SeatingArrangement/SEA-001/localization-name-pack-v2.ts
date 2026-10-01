export type Sea001NativeLocale = "hi-IN" | "pa-IN";

const SEA001_NATIVE_NAME_PACK = Object.freeze({
  Aman: ["अमन", "ਅਮਨ"],
  Bina: ["बीना", "ਬੀਨਾ"],
  Charan: ["चरण", "ਚਰਨ"],
  Diya: ["दिया", "ਦਿਆ"],
  Eshan: ["ईशान", "ਈਸ਼ਾਨ"],
  Farah: ["फ़राह", "ਫਰਾਹ"],
  Gagan: ["गगन", "ਗਗਨ"],
  Heena: ["हीना", "ਹੀਨਾ"],
} as const satisfies Readonly<Record<string, readonly [string, string]>>);

export function localizeSea001NativeName(value: string, locale: Sea001NativeLocale): string {
  const item = SEA001_NATIVE_NAME_PACK[value as keyof typeof SEA001_NATIVE_NAME_PACK];
  if (!item) return value;
  return locale === "hi-IN" ? item[0] : item[1];
}

export function localizeSea001NativeNames(text: string, locale: Sea001NativeLocale): string {
  let output = text;
  for (const key of Object.keys(SEA001_NATIVE_NAME_PACK).sort((a, b) => b.length - a.length)) {
    output = output.replace(new RegExp(`\\b${key}\\b`, "g"), localizeSea001NativeName(key, locale));
  }
  return output;
}
