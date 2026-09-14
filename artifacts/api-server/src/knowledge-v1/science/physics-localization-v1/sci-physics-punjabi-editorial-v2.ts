import type { PhysicsLocalizedAnchorSurfaceV1 } from "./sci-physics-localization-types-v1";

type SurfaceKey = keyof PhysicsLocalizedAnchorSurfaceV1;
type Patch = Readonly<{ from: string; to: string }>;

const MASS_PATCHES_BY_ANCHOR: Readonly<Record<string, readonly Patch[]>> = Object.freeze({
  "SCI-CP001-EXH-A04": [
    { from: "1 kg ਭਾਰ ਵਾਲੀ ਵਸਤੂ", to: "1 kg ਪੁੰਜ ਵਾਲੀ ਵਸਤੂ" },
  ],
  "SCI-CP001-EXH-A19": [
    { from: "ਭਾਰ", to: "ਪੁੰਜ" },
  ],
  "SCI-CP001-EXH-A21": [
    { from: "ਘਣਤਾ = ਭਾਰ/ਆਇਤਨ", to: "ਘਣਤਾ = ਪੁੰਜ/ਆਇਤਨ" },
  ],
  "SCI-CP001-EXH-A22": [
    { from: "ਕੇਵਲ ਭਾਰ ਤੇ ਨਿਰਭਰ", to: "ਕੇਵਲ ਪੁੰਜ ਤੇ ਨਿਰਭਰ" },
  ],
  "SCI-CP002-EXH-A03": [
    { from: "ਪ੍ਰਤੀ ਇਕਾਈ ਭਾਰ ਬਲ", to: "ਪ੍ਰਤੀ ਇਕਾਈ ਪੁੰਜ ਬਲ" },
  ],
  "SCI-CP002-EXH-A04": [
    { from: "ਇਸ ਵਿੱਚ ਭਾਰ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ", to: "ਇਸ ਵਿੱਚ ਪੁੰਜ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ" },
  ],
  "SCI-CP002-EXH-A05": [
    { from: "ਭਾਰ", to: "ਪੁੰਜ" },
  ],
  "SCI-CP002-EXH-A10": [
    { from: "ਸਥਿਰ ਭਾਰ", to: "ਸਥਿਰ ਪੁੰਜ" },
    { from: "ਭਾਰ ×", to: "ਪੁੰਜ ×" },
  ],
  "SCI-CP002-EXH-A13": [
    { from: "ਭਾਰ ਅਤੇ ਵੇਗ", to: "ਪੁੰਜ ਅਤੇ ਵੇਗ" },
    { from: "ਭਾਰ ਅਤੇ ਤ੍ਵਰਨ", to: "ਪੁੰਜ ਅਤੇ ਪ੍ਰਵੇਗ" },
    { from: "ਭਾਰ ਅਤੇ ਪ੍ਰਵੇਗ", to: "ਪੁੰਜ ਅਤੇ ਪ੍ਰਵੇਗ" },
  ],
  "SCI-CP002-EXH-A14": [
    { from: "ਭਾਰ", to: "ਪੁੰਜ" },
  ],
  "SCI-CP002-EXH-A18": [
    { from: "ਭਾਰ ਦੇ ਬਰਾਬਰ", to: "ਪੁੰਜ ਦੇ ਬਰਾਬਰ" },
  ],
  "SCI-CP002-EXH-A19": [
    { from: "ਭਾਰ ਬਦਲਦਾ ਰਹਿੰਦਾ ਹੈ", to: "ਪੁੰਜ ਬਦਲਦਾ ਰਹਿੰਦਾ ਹੈ" },
  ],
  "SCI-CP002-EXH-A22": [
    { from: "ਭਾਰ ਘਟਾਉਂਦੀ ਹੈ", to: "ਪੁੰਜ ਘਟਾਉਂਦੀ ਹੈ" },
  ],
  "SCI-CP002-EXH-A23": [
    { from: "ਕੁੱਲ ਬਲ ਉਸ ਦੇ ਭਾਰ ਦੇ ਬਰਾਬਰ ਹੋਵੇ", to: "ਕੁੱਲ ਬਲ ਉਸ ਦੇ ਪੁੰਜ ਦੇ ਬਰਾਬਰ ਹੋਵੇ" },
  ],
});

function patchText(anchorId: string, text: string): string {
  let out = text.replaceAll("ਤ੍ਵਰਨ", "ਪ੍ਰਵੇਗ");
  for (const patch of MASS_PATCHES_BY_ANCHOR[anchorId] ?? []) {
    out = out.replaceAll(patch.from, patch.to);
  }
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
    if (typeof value === "string") (result as Record<string, unknown>)[key] = patchText(anchorId, value);
  }
  result.distractors = surface.distractors.map((value) => patchText(anchorId, value)) as [string, string, string];
  return result;
}

export const SCI_PHYSICS_PUNJABI_EDITORIAL_V2 = "SCI-PHYSICS-PA-EDITORIAL-V2-MASS-ACCELERATION" as const;
