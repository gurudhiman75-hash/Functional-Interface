import type { PhysicsLocalizedAnchorSurfaceV1 } from "./sci-physics-localization-types-v1";

type Patch = Readonly<{ from: string; to: string }>;

const GLOBAL_PATCHES: readonly Patch[] = Object.freeze([
  { from: "ਵਾਤਾਵਰਣੀ ਦਬਾਅ", to: "ਹਵਾਈ ਦਬਾਅ" },
  { from: "ਮੂਲ ਰਾਸ਼ੀ", to: "ਮੂਲ ਮਾਤਰਾ" },
  { from: "ਮੂਲ ਰਾਸ਼ੀ", to: "ਮੂਲ ਮਾਤਰਾ" },
  { from: "ਵੇਕਟਰ ਰਾਸ਼ੀ", to: "ਵੇਕਟਰ ਮਾਤਰਾ" },
  { from: "ਵੇਕਟਰ ਰਾਸ਼ੀ", to: "ਵੇਕਟਰ ਮਾਤਰਾ" },
  { from: "ਸਕੇਲਰ ਰਾਸ਼ੀ", to: "ਸਕੇਲਰ ਮਾਤਰਾ" },
  { from: "ਸਕੇਲਰ ਰਾਸ਼ੀ", to: "ਸਕੇਲਰ ਮਾਤਰਾ" },
  { from: "ਸਦਿਸ਼", to: "ਵੇਕਟਰ" },
  { from: "ਅਦਿਸ਼", to: "ਸਕੇਲਰ" },
  { from: "ਆਯਾਮ", to: "ਡਾਇਮੈਂਸ਼ਨ" },
  { from: "ਧਨਾਤਮਕ", to: "ਪਾਜ਼ਿਟਿਵ" },
  { from: "ਰਿਣਾਤਮਕ", to: "ਨੈਗੇਟਿਵ" },
  { from: "ਅਧਿਕਤਮ", to: "ਸਭ ਤੋਂ ਵੱਧ" },
  { from: "ਗੁਰੁਤਵ ਘਟਾਉਂਦੀ ਹੈ", to: "ਗ੍ਰੈਵਿਟੀ ਘਟਾਉਂਦੀ ਹੈ" },
  { from: "ਸੁਖਮ", to: "ਬਰੀਕ" },
]);

const PATCHES_BY_ANCHOR: Readonly<Record<string, readonly Patch[]>> = Object.freeze({
  "SCI-CP001-EXH-A11": [
    { from: "ਪਰਿਸ਼ੁੱਧ", to: "ਸੁਚੋਕ" },
  ],
  "SCI-CP001-EXH-A22": [
    { from: "ਸੰਦਰਭ ਪਦਾਰਥ ਦੀ ਘਣਤਾ", to: "ਤੁਲਨਾ ਲਈ ਲਏ ਪਦਾਰਥ ਦੀ ਘਣਤਾ" },
  ],
  "SCI-CP001-EXH-A24": [
    { from: "ਅੰਦਰੂਨੀ ਜਬੜੇ", to: "ਅੰਦਰਲੇ ਜੌ" },
  ],
  "SCI-CP002-EXH-A08": [
    { from: "ਬੀਜਗਣਿਤੀ ਖੇਤਰਫਲ", to: "ਚਿੰਨ੍ਹ ਸਮੇਤ ਖੇਤਰਫਲ" },
  ],
  "SCI-CP002-EXH-A09": [
    { from: "ਵਿਸ਼ਰਾਮ ਵਿੱਚ ਰਹਿੰਦੀ ਹੈ", to: "ਟਿਕੀ ਹੋਈ ਹਾਲਤ ਵਿੱਚ ਰਹਿੰਦੀ ਹੈ" },
    { from: "ਪ੍ਰਵਿਰਤੀ", to: "ਰੁਝਾਨ" },
  ],
  "SCI-CP002-EXH-A11": [
    { from: "ਪਰਸਪਰ ਕਿਰਿਆ ਕਰਨ ਵਾਲੀਆਂ ਦੋ ਵਸਤੂਆਂ", to: "ਇੱਕ-ਦੂਜੇ ਨਾਲ ਕਿਰਿਆ ਕਰਨ ਵਾਲੀਆਂ ਦੋ ਵਸਤੂਆਂ" },
  ],
  "SCI-CP002-EXH-A12": [
    { from: "ਵਿਸ਼ਰਾਮ ਦੀ ਜੜਤਾ", to: "ਟਿਕੀ ਹਾਲਤ ਦੀ ਜੜਤਾ" },
  ],
  "SCI-CP002-EXH-A17": [
    { from: "ਅਣੂਈ ਆਕਰਸ਼ਣ", to: "ਅਣੂਆਂ ਵਿਚਕਾਰ ਖਿੱਚ" },
  ],
  "SCI-CP002-EXH-A18": [
    { from: "ਵਿਸ਼ਰਾਮ ਵਿੱਚ ਹੋਵੇਗੀ", to: "ਟਿਕੀ ਹੋਈ ਹੋਵੇਗੀ" },
  ],
  "SCI-CP002-EXH-A20": [
    { from: "ਵਰਤੁਲ ਦੇ ਕੇਂਦਰ", to: "ਗੋਲ ਰਸਤੇ ਦੇ ਕੇਂਦਰ" },
  ],
});

export function naturalizePunjabiPhysicsTextFinalV3(anchorId: string, text: string): string {
  let out = text;
  for (const patch of GLOBAL_PATCHES) out = out.replaceAll(patch.from, patch.to);
  for (const patch of PATCHES_BY_ANCHOR[anchorId] ?? []) out = out.replaceAll(patch.from, patch.to);
  return out;
}

export function applyPunjabiPhysicsNaturalizationV3(
  anchorId: string,
  surface: PhysicsLocalizedAnchorSurfaceV1,
): PhysicsLocalizedAnchorSurfaceV1 {
  return {
    ...surface,
    stem: naturalizePunjabiPhysicsTextFinalV3(anchorId, surface.stem),
    answer: naturalizePunjabiPhysicsTextFinalV3(anchorId, surface.answer),
    distractors: surface.distractors.map((value) => naturalizePunjabiPhysicsTextFinalV3(anchorId, value)) as [string, string, string],
    trueStatement: naturalizePunjabiPhysicsTextFinalV3(anchorId, surface.trueStatement),
    falseStatement: naturalizePunjabiPhysicsTextFinalV3(anchorId, surface.falseStatement),
    explanation: naturalizePunjabiPhysicsTextFinalV3(anchorId, surface.explanation),
  };
}

export const SCI_PHYSICS_PUNJABI_NATURALIZATION_V3 = "SCI-PHYSICS-PA-NATURALIZATION-V3-PUNJABI-FIRST" as const;
