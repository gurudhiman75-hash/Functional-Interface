import type { PhysicsLocalizedAnchorSurfaceV1 } from "./sci-physics-localization-types-v1";

type SurfaceKey = keyof PhysicsLocalizedAnchorSurfaceV1;
type Patch = Readonly<{ from: string; to: string }>;

const GLOBAL_NATURAL_PUNJABI_PATCHES: readonly Patch[] = Object.freeze([
  { from: "ਤ੍ਵਰਨ", to: "ਪ੍ਰਵੇਗ" },
  { from: "ਊਸ਼ਮਾਗਤਿਕ", to: "ਥਰਮੋਡਾਇਨਾਮਿਕ" },
  { from: "ਤਾਪਗਤਿਕ", to: "ਥਰਮੋਡਾਇਨਾਮਿਕ" },
  { from: "ਵਿਉਤਪੰਨ ਇਕਾਈ", to: "ਡਿਰਾਈਵਡ ਇਕਾਈ" },
  { from: "ਉਤਪੰਨ ਇਕਾਈ", to: "ਡਿਰਾਈਵਡ ਇਕਾਈ" },
  { from: "ਆਵ੍ਰਿਤੀ", to: "ਫ੍ਰਿਕਵੈਂਸੀ" },
  { from: "ਵਿਦਿਉਤ", to: "ਬਿਜਲੀ" },
  { from: "ਪਰਿਪਥ", to: "ਸਰਕਟ" },
  { from: "ਅਲਪਤਮ ਅੰਕ", to: "ਲੀਸਟ ਕਾਊਂਟ" },
  { from: "ਪਰਿਸ਼ੁੱਧਤਾ", to: "ਸੁਚੋਕਤਾ" },
  { from: "ਯਥਾਰਥਤਾ", to: "ਸਹੀਪਣ" },
  { from: "ਯਥਾਰਥ", to: "ਸਹੀ" },
  { from: "ਪ੍ਰਣਾਲੀਗਤ ਗਲਤੀ", to: "ਸਿਸਟਮੈਟਿਕ ਗਲਤੀ" },
  { from: "ਪ੍ਰਣਾਲੀਬੱਧ ਗਲਤੀ", to: "ਸਿਸਟਮੈਟਿਕ ਗਲਤੀ" },
  { from: "ਯਾਦ੍ਰਿਚਛਿਕ ਗਲਤੀ", to: "ਰੈਂਡਮ ਗਲਤੀ" },
  { from: "ਸ਼ੂਨਯ", to: "ਜ਼ੀਰੋ" },
  { from: "ਆਯਾਮੀ ਸੂਤਰ", to: "ਡਾਇਮੈਂਸ਼ਨਲ ਫਾਰਮੂਲਾ" },
  { from: "ਆਯਾਮ ਰਹਿਤ", to: "ਬਿਨਾ ਡਾਇਮੈਂਸ਼ਨ ਦੇ" },
  { from: "ਵਿਗਿਆਨਕ ਸੰਕੇਤਨ", to: "ਸਾਇੰਟਿਫਿਕ ਨੋਟੇਸ਼ਨ" },
  { from: "ਮਹੱਤਵਪੂਰਨ ਅੰਕ", to: "ਸਿਗਨਿਫਿਕੈਂਟ ਫਿਗਰ" },
  { from: "ਸਾਰਥਕ ਅੰਕ", to: "ਸਿਗਨਿਫਿਕੈਂਟ ਫਿਗਰ" },
  { from: "ਅਗੇਤਰ", to: "ਪ੍ਰੀਫਿਕਸ" },
  { from: "ਸਾਪੇਖ ਘਣਤਾ", to: "ਰਿਲੇਟਿਵ ਡੈਨਸਿਟੀ" },
  { from: "ਸਦਿਸ਼ ਰਾਸ਼ੀ", to: "ਵੇਕਟਰ ਰਾਸ਼ੀ" },
  { from: "ਸਦਿਸ਼ ਰਾਸ਼ੀ", to: "ਵੇਕਟਰ ਰਾਸ਼ੀ" },
  { from: "ਅਦਿਸ਼ ਰਾਸ਼ੀ", to: "ਸਕੇਲਰ ਰਾਸ਼ੀ" },
  { from: "ਅਦਿਸ਼ ਰਾਸ਼ੀ", to: "ਸਕੇਲਰ ਰਾਸ਼ੀ" },
  { from: "ਅਦਿਸ਼ ਗੁਣਨਫਲ", to: "ਸਕੇਲਰ ਗੁਣਨਫਲ" },
  { from: "ਪਰਿਮਾਣ", to: "ਮਾਤਰਾ" },
  { from: "ਆਵੇਗ", to: "ਇੰਪਲਸ" },
  { from: "ਅਭਿਕੇਂਦਰੀ ਬਲ", to: "ਸੈਂਟ੍ਰਿਪੀਟਲ ਬਲ" },
  { from: "ਪ੍ਰਤਿਕਸ਼ੇਪ", to: "ਪਿੱਛੇ ਵੱਲ ਝਟਕਾ" },
  { from: "ਸੀਮਾਂਤ ਚਾਲ", to: "ਟਰਮੀਨਲ ਚਾਲ" },
  { from: "ਸ਼ੁੱਧ ਬਲ", to: "ਕੁੱਲ ਬਲ" },
  { from: "ਤੰਤਰ", to: "ਸਿਸਟਮ" },
  { from: "ਵਰਤੁਲ ਗਤੀ", to: "ਸਰਕੁਲਰ ਗਤੀ" },
  { from: "ਲੰਬ ਬਲ", to: "ਨਾਰਮਲ ਬਲ" },
  { from: "ਸੁਖਮਤਾ", to: "ਬਰੀਕੀ" },
  { from: "ਸੁਖਮ ਮਾਪ", to: "ਬਰੀਕ ਮਾਪ" },
  { from: "ਸਧਾਰਣ ਪੈਮਾਨੇ", to: "ਸਧਾਰਣ ਸਕੇਲ" },
]);

const MASS_PATCHES_BY_ANCHOR: Readonly<Record<string, readonly Patch[]>> = Object.freeze({
  "SCI-CP001-EXH-A04": [{ from: "1 kg ਭਾਰ ਵਾਲੀ ਵਸਤੂ", to: "1 kg ਪੁੰਜ ਵਾਲੀ ਵਸਤੂ" }],
  "SCI-CP001-EXH-A19": [{ from: "ਭਾਰ", to: "ਪੁੰਜ" }],
  "SCI-CP001-EXH-A21": [{ from: "ਘਣਤਾ = ਭਾਰ/ਆਇਤਨ", to: "ਘਣਤਾ = ਪੁੰਜ/ਆਇਤਨ" }],
  "SCI-CP001-EXH-A22": [{ from: "ਕੇਵਲ ਭਾਰ ਤੇ ਨਿਰਭਰ", to: "ਸਿਰਫ਼ ਪੁੰਜ ਤੇ ਨਿਰਭਰ" }],
  "SCI-CP002-EXH-A03": [{ from: "ਪ੍ਰਤੀ ਇਕਾਈ ਭਾਰ ਬਲ", to: "ਇੱਕ ਇਕਾਈ ਪੁੰਜ ਉੱਤੇ ਬਲ" }],
  "SCI-CP002-EXH-A04": [{ from: "ਇਸ ਵਿੱਚ ਭਾਰ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ", to: "ਇਸ ਵਿੱਚ ਪੁੰਜ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ" }],
  "SCI-CP002-EXH-A05": [{ from: "ਭਾਰ", to: "ਪੁੰਜ" }],
  "SCI-CP002-EXH-A10": [
    { from: "ਸਥਿਰ ਭਾਰ", to: "ਸਥਿਰ ਪੁੰਜ" },
    { from: "ਭਾਰ ×", to: "ਪੁੰਜ ×" },
  ],
  "SCI-CP002-EXH-A13": [
    { from: "ਭਾਰ ਅਤੇ ਵੇਗ", to: "ਪੁੰਜ ਅਤੇ ਵੇਗ" },
    { from: "ਭਾਰ ਅਤੇ ਤ੍ਵਰਨ", to: "ਪੁੰਜ ਅਤੇ ਪ੍ਰਵੇਗ" },
    { from: "ਭਾਰ ਅਤੇ ਪ੍ਰਵੇਗ", to: "ਪੁੰਜ ਅਤੇ ਪ੍ਰਵੇਗ" },
  ],
  "SCI-CP002-EXH-A14": [{ from: "ਭਾਰ", to: "ਪੁੰਜ" }],
  "SCI-CP002-EXH-A18": [{ from: "ਭਾਰ ਦੇ ਬਰਾਬਰ", to: "ਪੁੰਜ ਦੇ ਬਰਾਬਰ" }],
  "SCI-CP002-EXH-A19": [{ from: "ਭਾਰ ਬਦਲਦਾ ਰਹਿੰਦਾ ਹੈ", to: "ਪੁੰਜ ਬਦਲਦਾ ਰਹਿੰਦਾ ਹੈ" }],
  "SCI-CP002-EXH-A22": [{ from: "ਭਾਰ ਘਟਾਉਂਦੀ ਹੈ", to: "ਪੁੰਜ ਘਟਾਉਂਦੀ ਹੈ" }],
  "SCI-CP002-EXH-A23": [{ from: "ਕੁੱਲ ਬਲ ਉਸ ਦੇ ਭਾਰ ਦੇ ਬਰਾਬਰ ਹੋਵੇ", to: "ਕੁੱਲ ਬਲ ਉਸ ਦੇ ਪੁੰਜ ਦੇ ਬਰਾਬਰ ਹੋਵੇ" }],
});

const NATURAL_PATCHES_BY_ANCHOR: Readonly<Record<string, readonly Patch[]>> = Object.freeze({
  "SCI-CP001-EXH-A09": [
    { from: "ਵਧੇਰੇ ਸ਼ੁੱਧਤਾ ਨਾਲ", to: "ਵਧੇਰੇ ਸੁਚੋਕਤਾ ਨਾਲ" },
    { from: "ਵੱਧ ਸੁਖਮਤਾ ਨਾਲ", to: "ਹੋਰ ਬਰੀਕੀ ਨਾਲ" },
  ],
  "SCI-CP001-EXH-A10": [
    { from: "ਕੇਵਲ ਜ਼ੀਰੋ ਐਰਰ", to: "ਸਿਰਫ਼ ਜ਼ੀਰੋ ਐਰਰ" },
  ],
  "SCI-CP001-EXH-A22": [
    { from: "ਇਹ ਦੋ ਘਣਤਾਵਾਂ ਦਾ ਅਨੁਪਾਤ ਹੈ", to: "ਇਹ ਦੋ ਘਣਤਾਵਾਂ ਦੀ ਤੁਲਨਾ ਦਾ ਅਨੁਪਾਤ ਹੈ" },
  ],
  "SCI-CP002-EXH-A02": [
    { from: "ਸ਼ੁਰੂਆਤੀ ਅਤੇ ਅੰਤਿਮ ਸਥਿਤੀ ਵਿਚਕਾਰ ਸਭ ਤੋਂ ਛੋਟੀ ਦਿਸ਼ਾਵਾਂ ਵਾਲੀ ਦੂਰੀ", to: "ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ਅੰਤਿਮ ਬਿੰਦੂ ਤੱਕ ਦਿਸ਼ਾ ਸਮੇਤ ਸਭ ਤੋਂ ਛੋਟੀ ਦੂਰੀ" },
    { from: "ਸ਼ੁਰੂਆਤੀ ਅਤੇ ਅੰਤਿਮ ਸਥਿਤੀ ਵਿਚਕਾਰ ਸਭ ਤੋਂ ਛੋਟੀ ਦਿਸ਼ਾਵਾਂ ਵਾਲੀ ਦੂਰੀ ਹੈ", to: "ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ਅੰਤਿਮ ਬਿੰਦੂ ਤੱਕ ਦਿਸ਼ਾ ਸਮੇਤ ਸਭ ਤੋਂ ਛੋਟੀ ਦੂਰੀ ਹੈ" },
  ],
  "SCI-CP002-EXH-A03": [
    { from: "ਪ੍ਰਤੀ ਇਕਾਈ ਸਮਾਂ ਤੈਅ ਕੀਤੀ ਦੂਰੀ", to: "ਇੱਕ ਇਕਾਈ ਸਮੇਂ ਵਿੱਚ ਤੈਅ ਕੀਤੀ ਦੂਰੀ" },
    { from: "ਪ੍ਰਤੀ ਇਕਾਈ ਸਮਾਂ ਵਿਸਥਾਪਨ", to: "ਇੱਕ ਇਕਾਈ ਸਮੇਂ ਵਿੱਚ ਵਿਸਥਾਪਨ" },
    { from: "ਪ੍ਰਤੀ ਇਕਾਈ ਸਮਾਂ ਵੇਗ ਵਿੱਚ ਬਦਲਾਅ", to: "ਇੱਕ ਇਕਾਈ ਸਮੇਂ ਵਿੱਚ ਵੇਗ ਦਾ ਬਦਲਾਅ" },
  ],
  "SCI-CP002-EXH-A06": [{ from: "ਢਾਲ", to: "ਢਲਾਣ" }],
  "SCI-CP002-EXH-A07": [{ from: "ਢਾਲ", to: "ਢਲਾਣ" }],
  "SCI-CP002-EXH-A17": [
    { from: "ਸੁਖਮ ਅਸਮਾਨਤਾਵਾਂ", to: "ਨਿੱਕੀਆਂ ਉਭਾਰ-ਖੱਡਾਂ" },
  ],
  "SCI-CP002-EXH-A20": [
    { from: "ਵਰਤੁਲ ਦੇ ਕੇਂਦਰ", to: "ਗੋਲ ਰਸਤੇ ਦੇ ਕੇਂਦਰ" },
  ],
  "SCI-CP002-EXH-A23": [
    { from: "ਉੱਪਰ ਵੱਲ ਲੱਗਣ ਵਾਲਾ ਰੋਧੀ ਬਲ", to: "ਉੱਪਰ ਵੱਲ ਲੱਗਣ ਵਾਲਾ ਹਵਾ ਦਾ ਰੋਧ" },
  ],
});

export function naturalizePunjabiPhysicsTextV3(anchorId: string, text: string): string {
  let out = text;
  for (const patch of GLOBAL_NATURAL_PUNJABI_PATCHES) out = out.replaceAll(patch.from, patch.to);
  for (const patch of MASS_PATCHES_BY_ANCHOR[anchorId] ?? []) out = out.replaceAll(patch.from, patch.to);
  for (const patch of NATURAL_PATCHES_BY_ANCHOR[anchorId] ?? []) out = out.replaceAll(patch.from, patch.to);
  return out;
}

export function applyPunjabiPhysicsEditorialV2(
  anchorId: string,
  surface: PhysicsLocalizedAnchorSurfaceV1,
): PhysicsLocalizedAnchorSurfaceV1 {
  const result = { ...surface } as PhysicsLocalizedAnchorSurfaceV1;
  const scalarKeys: SurfaceKey[] = ["stem", "answer", "trueStatement", "falseStatement", "explanation"];
  for (const key of scalarKeys) {
    const value = result[key];
    if (typeof value === "string") (result as Record<string, unknown>)[key] = naturalizePunjabiPhysicsTextV3(anchorId, value);
  }
  result.distractors = surface.distractors.map((value) => naturalizePunjabiPhysicsTextV3(anchorId, value)) as [string, string, string];
  return result;
}

export const SCI_PHYSICS_PUNJABI_EDITORIAL_V3 = "SCI-PHYSICS-PA-EDITORIAL-V3-NATURAL-PUNJABI" as const;
