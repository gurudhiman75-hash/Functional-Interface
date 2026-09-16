import type { PhysicsLocaleV1, PhysicsLocalizedAnchorSurfaceV1 } from "./sci-physics-localization-types-v1";

type Patch = Readonly<{ from: string; to: string }>;

const HI_PATCHES: Readonly<Record<string, readonly Patch[]>> = Object.freeze({});

const PA_COMMON_PATCHES: readonly Patch[] = Object.freeze([
  { from: "ਸੋਲੇਨਾਇਡ", to: "ਸੋਲੀਨਾਇਡ" },
  { from: "ਬਿਜਲਈ-ਚੁੰਬਕੀ ਪ੍ਰੇਰਣ", to: "ਬਿਜਲ ਚੁੰਬਕੀ ਪ੍ਰੇਰਣ" },
  { from: "ਬਿਜਲਈ-ਚੁੰਬਕੀ ਸਪੈਕਟ੍ਰਮ", to: "ਬਿਜਲ ਚੁੰਬਕੀ ਸਪੈਕਟ੍ਰਮ" },
  { from: "ਪ੍ਰਤਿਆਵਰਤੀ ਧਾਰਾ", to: "ਪ੍ਰਤਿਵਰਤੀ ਧਾਰਾ" },
  { from: "ਦਿਸ਼ਟ ਧਾਰਾ", to: "ਸਿੱਧੀ ਧਾਰਾ" },
  { from: "ਪਰਾਬੈਂਗਨੀ", to: "ਪਰਾਬੈਂਗਣੀ" },
  { from: "ਸੰਧਾਰਿਤਰ", to: "ਸੰਧਾਰਕ" },
  { from: "ਸਮਕੇਂਦਰੀ ਵਰਤੂਲ", to: "ਸਮਕੇਂਦਰੀ ਚੱਕਰ" },
]);

const PA_PATCHES: Readonly<Record<string, readonly Patch[]>> = Object.freeze({
  "SCI-CP009-EXH-A18": [
    { from: "ਇਸ ਦਾ ਮਾਨ ਵੀ ਆਮ ਤੌਰ ਤੇ ਸਮੇਂ ਨਾਲ ਆਵਰਤੀ ਤਰੀਕੇ ਨਾਲ ਬਦਲਦਾ ਹੈ", to: "ਇਸ ਦਾ ਮਾਨ ਵੀ ਆਮ ਤੌਰ ਤੇ ਸਮੇਂ ਨਾਲ ਆਵਰਤੀ ਢੰਗ ਨਾਲ ਬਦਲਦਾ ਹੈ" },
  ],
  "SCI-CP009-EXH-A23": [
    { from: "ਇੱਕ ਸਰਕਟ ਨਾਲ ਦੂਜੇ ਸਰਕਟ ਨੂੰ ਕਾਬੂ ਕਰਨਾ", to: "ਇੱਕ ਸਰਕਟ ਦੀ ਮਦਦ ਨਾਲ ਦੂਜੇ ਸਰਕਟ ਨੂੰ ਕਾਬੂ ਕਰਨਾ" },
  ],
  "SCI-CP010-EXH-A09": [
    { from: "ਅੰਕੜਾ-ਆਧਾਰਿਤ ਦਰ ਦਾ ਪਾਲਣ ਕਰਦਾ ਹੈ", to: "ਸੰਭਾਵਿਕ ਦਰ ਅਨੁਸਾਰ ਘਟਦਾ ਹੈ" },
  ],
  "SCI-CP010-EXH-A20": [
    { from: "ਰੈਕਟੀਫਿਕੇਸ਼ਨ", to: "ਦਿਸ਼ਾਕਰਨ" },
  ],
});

function anchorPatches(locale: Exclude<PhysicsLocaleV1, "en">, anchorId: string): readonly Patch[] {
  return (locale === "hi" ? HI_PATCHES : PA_PATCHES)[anchorId] ?? [];
}

export function polishPhysicsCp009Cp010TextV1(
  locale: Exclude<PhysicsLocaleV1, "en">,
  anchorId: string,
  text: string,
): string {
  let out = text;
  if (locale === "pa") {
    for (const patch of PA_COMMON_PATCHES) out = out.replaceAll(patch.from, patch.to);
  }
  for (const patch of anchorPatches(locale, anchorId)) out = out.replaceAll(patch.from, patch.to);
  return out;
}

export function applyPhysicsCp009Cp010PolishV1(
  locale: Exclude<PhysicsLocaleV1, "en">,
  anchorId: string,
  surface: PhysicsLocalizedAnchorSurfaceV1,
): PhysicsLocalizedAnchorSurfaceV1 {
  const polish = (text: string) => polishPhysicsCp009Cp010TextV1(locale, anchorId, text);
  return {
    ...surface,
    stem: polish(surface.stem),
    answer: polish(surface.answer),
    distractors: surface.distractors.map(polish) as [string, string, string],
    trueStatement: polish(surface.trueStatement),
    falseStatement: polish(surface.falseStatement),
    explanation: polish(surface.explanation),
  };
}
