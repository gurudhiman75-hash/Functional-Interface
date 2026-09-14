import type { PhysicsLocalizedAnchorSurfaceV1 } from "./sci-physics-localization-types-v1";

type Patch = Readonly<{ from: string; to: string }>;

const GLOBAL_PATCHES: readonly Patch[] = Object.freeze([
  { from: "ਵਾਤਾਵਰਣੀ ਦਬਾਅ", to: "ਹਵਾਈ ਦਬਾਅ" },
  { from: "ਮੂਲ ਰਾਸ਼ੀ", to: "ਮੂਲ ਮਾਤਰਾ" },
  { from: "ਮੂਲ ਰਾਸ਼ੀ", to: "ਮੂਲ ਮਾਤਰਾ" },
  { from: "ਮਾਤਰਾਆਂ", to: "ਮਾਤਰਾਵਾਂ" },
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
  { from: "ਕੇਵਲ", to: "ਸਿਰਫ਼" },
  { from: "ਸ਼ੁੱਧ ਬਾਹਰੀ ਬਲ", to: "ਕੁੱਲ ਬਾਹਰੀ ਬਲ" },
  { from: "ਸ਼ੁੱਧ ਅੰਦਰ ਵੱਲ ਬਲ", to: "ਕੁੱਲ ਅੰਦਰ ਵੱਲ ਬਲ" },
  { from: "ਸ਼ੁੱਧ ਵਿਸਥਾਪਨ", to: "ਨੈੱਟ ਵਿਸਥਾਪਨ" },
  { from: "ਪਰਸਪਰ ਕਿਰਿਆ", to: "ਆਪਸੀ ਕਿਰਿਆ" },
  { from: "ਪ੍ਰਵਿਰਤੀ", to: "ਰੁਝਾਨ" },
  { from: "ਵਰਤੁਲ ਦੇ ਕੇਂਦਰ", to: "ਗੋਲ ਰਸਤੇ ਦੇ ਕੇਂਦਰ" },
  { from: "ਵਰਤੁਲ ਵਿੱਚ", to: "ਗੋਲ ਰਸਤੇ ਵਿੱਚ" },
  { from: "ਸੀਮਾਂਤ ਸਥਿਰ ਘਰਸ਼ਣ", to: "ਸਭ ਤੋਂ ਵੱਧ ਸਥਿਰ ਘਰਸ਼ਣ" },
  { from: "ਗਤਿਜ ਊਰਜਾ", to: "ਕਾਇਨੇਟਿਕ ਊਰਜਾ" },
  { from: "ਸਥਿਤਿਜ ਊਰਜਾ", to: "ਪੋਟੈਂਸ਼ਲ ਊਰਜਾ" },
  { from: "ਸਾਰਥਕ ਹਨ", to: "ਸਿਗਨਿਫਿਕੈਂਟ ਮੰਨੇ ਜਾਂਦੇ ਹਨ" },
  { from: "ਦਾ ਮਾਤਰਾ", to: "ਦੀ ਮਾਤਰਾ" },
  { from: "ਦੇ ਮਾਤਰਾ", to: "ਦੀ ਮਾਤਰਾ" },
  { from: "ਅਲੱਗ ਸਿਸਟਮ", to: "ਅਲੱਗ-ਥਲੱਗ ਸਿਸਟਮ" },
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
  "SCI-CP002-EXH-A02": [
    { from: "ਵਿਸਥਾਪਨ ਸ਼ੁਰੂਆਤੀ ਸਥਿਤੀ ਤੋਂ ਅੰਤਿਮ ਸਥਿਤੀ ਤੱਕ ਦਾ ਦਿਸ਼ਾਵਾਂ ਬਦਲਾਅ ਹੈ", to: "ਵਿਸਥਾਪਨ ਸ਼ੁਰੂਆਤੀ ਸਥਿਤੀ ਤੋਂ ਅੰਤਿਮ ਸਥਿਤੀ ਤੱਕ ਦਿਸ਼ਾ ਸਮੇਤ ਸਿੱਧੀ ਦੂਰੀ ਹੈ" },
  ],
  "SCI-CP002-EXH-A08": [
    { from: "ਬੀਜਗਣਿਤੀ ਖੇਤਰਫਲ", to: "ਚਿੰਨ੍ਹ ਸਮੇਤ ਖੇਤਰਫਲ" },
  ],
  "SCI-CP002-EXH-A09": [
    { from: "ਵਿਸ਼ਰਾਮ ਵਿੱਚ ਰਹਿੰਦੀ ਹੈ", to: "ਟਿਕੀ ਹੋਈ ਹਾਲਤ ਵਿੱਚ ਰਹਿੰਦੀ ਹੈ" },
    { from: "ਵਿਰੋਧ ਕਰਨ ਦੀ ਰੁਝਾਨ", to: "ਵਿਰੋਧ ਕਰਨ ਦਾ ਰੁਝਾਨ" },
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
  "SCI-CP002-EXH-A21": [
    { from: "ਕਿਹੜੇ ਸੰਰਕਸ਼ਣ ਨਿਯਮ ਨਾਲ", to: "ਕਿਹੜੇ ਨਿਯਮ ਨਾਲ" },
    { from: "ਸੰਵੇਗ ਸੰਰਕਸ਼ਣ", to: "ਸੰਵੇਗ ਕਾਇਮ ਰਹਿਣ ਦਾ ਨਿਯਮ" },
    { from: "ਤਾਪਮਾਨ ਸੰਰਕਸ਼ਣ", to: "ਤਾਪਮਾਨ ਕਾਇਮ ਰਹਿਣ ਦਾ ਨਿਯਮ" },
    { from: "ਦਬਾਅ ਸੰਰਕਸ਼ਣ", to: "ਦਬਾਅ ਕਾਇਮ ਰਹਿਣ ਦਾ ਨਿਯਮ" },
    { from: "ਬਿਜਲੀ ਆਵੇਸ਼ ਸੰਰਕਸ਼ਣ", to: "ਬਿਜਲੀ ਆਵੇਸ਼ ਕਾਇਮ ਰਹਿਣ ਦਾ ਨਿਯਮ" },
    { from: "ਸੰਰੱਖਿਤ ਰਹਿੰਦਾ ਹੈ", to: "ਕਾਇਮ ਰਹਿੰਦਾ ਹੈ" },
    { from: "ਇਹ ਪਿੱਛੇ ਵਾਲੀ ਗਤੀ ਪਿੱਛੇ ਵੱਲ ਝਟਕਾ ਹੈ", to: "ਇਸੇ ਕਰਕੇ ਬੰਦੂਕ ਪਿੱਛੇ ਵੱਲ ਝਟਕਾ ਖਾਂਦੀ ਹੈ" },
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
