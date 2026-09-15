import type { PhysicsLocaleV1, PhysicsLocalizedAnchorSurfaceV1 } from "./sci-physics-localization-types-v1";

type Patch = Readonly<{ from: string; to: string }>;

const HI_PATCHES: Readonly<Record<string, readonly Patch[]>> = Object.freeze({
  "SCI-CP008-EXH-A02": [
    { from: "विद्युत धारा आवेश के किसके प्रति प्रवाह की दर है?", to: "विद्युत धारा में आवेश के प्रवाह को किसके प्रति मापा जाता है?" },
  ],
});

const PA_PATCHES: Readonly<Record<string, readonly Patch[]>> = Object.freeze({
  "SCI-CP007-EXH-A12": [
    { from: "ਮੁੱਖ ਅੱਖ", to: "ਮੁੱਖ ਅਕਸ" },
  ],
  "SCI-CP007-EXH-A14": [
    { from: "ਸ਼ਕਤੀ ਦੀ ਮਾਤਰਾ ਉੱਨਾ ਵੱਧ ਹੋਵੇਗਾ", to: "ਸ਼ਕਤੀ ਦਾ ਮਾਨ ਉੱਨਾ ਵੱਧ ਹੋਵੇਗਾ" },
  ],
  "SCI-CP007-EXH-A15": [
    { from: "ਦੂਰਲੀ ਵਸਤੂ ਦਾ ਪ੍ਰਤਿਬਿੰਬ ਰੈਟੀਨਾ ਤੋਂ ਪਹਿਲਾਂ ਬਣਨ ਦੀ ਰੁਝਾਨ ਹੁੰਦੀ ਹੈ", to: "ਦੂਰਲੀ ਵਸਤੂ ਦਾ ਪ੍ਰਤਿਬਿੰਬ ਆਮ ਤੌਰ ਤੇ ਰੈਟੀਨਾ ਤੋਂ ਪਹਿਲਾਂ ਬਣਦਾ ਹੈ" },
  ],
  "SCI-CP007-EXH-A16": [
    { from: "ਨੇੜਲੀ ਵਸਤੂ ਦਾ ਪ੍ਰਤਿਬਿੰਬ ਰੈਟੀਨਾ ਦੇ ਪਿੱਛੇ ਬਣਨ ਦੀ ਰੁਝਾਨ ਹੁੰਦੀ ਹੈ", to: "ਨੇੜਲੀ ਵਸਤੂ ਦਾ ਪ੍ਰਤਿਬਿੰਬ ਆਮ ਤੌਰ ਤੇ ਰੈਟੀਨਾ ਦੇ ਪਿੱਛੇ ਬਣਦਾ ਹੈ" },
  ],
  "SCI-CP008-EXH-A02": [
    { from: "ਬਿਜਲਈ ਧਾਰਾ ਚਾਰਜ ਦੇ ਕਿਸ ਦੇ ਪ੍ਰਤੀ ਵਹਾਅ ਦੀ ਦਰ ਹੈ?", to: "ਬਿਜਲਈ ਧਾਰਾ ਵਿੱਚ ਚਾਰਜ ਦੇ ਵਹਾਅ ਨੂੰ ਕਿਸ ਦੇ ਪ੍ਰਤੀ ਮਾਪਿਆ ਜਾਂਦਾ ਹੈ?" },
  ],
  "SCI-CP008-EXH-A20": [
    { from: "ਅਧਿਕ ਧਾਰਾ", to: "ਵੱਧ ਧਾਰਾ" },
  ],
});

function patches(locale: Exclude<PhysicsLocaleV1, "en">, anchorId: string): readonly Patch[] {
  return (locale === "hi" ? HI_PATCHES : PA_PATCHES)[anchorId] ?? [];
}

export function polishPhysicsCp007Cp008TextV1(
  locale: Exclude<PhysicsLocaleV1, "en">,
  anchorId: string,
  text: string,
): string {
  let out = text;
  for (const patch of patches(locale, anchorId)) out = out.replaceAll(patch.from, patch.to);
  return out;
}

export function applyPhysicsCp007Cp008PolishV1(
  locale: Exclude<PhysicsLocaleV1, "en">,
  anchorId: string,
  surface: PhysicsLocalizedAnchorSurfaceV1,
): PhysicsLocalizedAnchorSurfaceV1 {
  const polish = (text: string) => polishPhysicsCp007Cp008TextV1(locale, anchorId, text);
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
