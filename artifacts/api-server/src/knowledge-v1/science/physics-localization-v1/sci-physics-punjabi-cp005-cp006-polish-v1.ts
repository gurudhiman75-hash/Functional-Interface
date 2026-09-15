import type { PhysicsLocalizedAnchorSurfaceV1 } from "./sci-physics-localization-types-v1";

type Patch = Readonly<{ from: string; to: string }>;

// PSEB-level Punjabi register for Heat/Sound. Keep common textbook loanwords
// such as ਪਿੱਚ where Punjabi school material itself uses them; avoid invented
// Sanskritized forms merely to remove English-origin terminology.
const COMMON_PATCHES: readonly Patch[] = Object.freeze([
  { from: "ਕਲੀਨੀਕਲ ਥਰਮਾਮੀਟਰ ਦਾ ਮੁੱਖ ਵਰਤੋਂ", to: "ਕਲੀਨੀਕਲ ਥਰਮਾਮੀਟਰ ਦੀ ਮੁੱਖ ਵਰਤੋਂ" },
  { from: "ਤਾਰਤਾ", to: "ਪਿੱਚ" },
  { from: "ਆਵਰਤ-ਕਾਲ", to: "ਆਵਰਤ ਕਾਲ" },
  { from: "ਤਰੰਗ-ਲੰਬਾਈ", to: "ਤਰੰਗ ਲੰਬਾਈ" },
  { from: "ਪਰਾਸ਼੍ਰਵਣ ਤਰੰਗਾਂ", to: "ਪਰਾ-ਧੁਨੀ ਤਰੰਗਾਂ" },
  { from: "ਪਰਾਸ਼੍ਰਵਣ ਧੁਨੀ", to: "ਪਰਾ-ਧੁਨੀ" },
  { from: "ਪਰਾਸ਼੍ਰਵਣ", to: "ਪਰਾ-ਧੁਨੀ" },
  { from: "ਅਵਸ਼੍ਰਵਣ ਤਰੰਗਾਂ", to: "ਨੀਮ-ਧੁਨੀ ਤਰੰਗਾਂ" },
  { from: "ਅਵਸ਼੍ਰਵਣ ਧੁਨੀ", to: "ਨੀਮ ਧੁਨੀ" },
  { from: "ਅਵਸ਼੍ਰਵਣ", to: "ਨੀਮ-ਧੁਨੀ" },
  { from: "ਪ੍ਰਤਿਧੁਨੀ-ਸਥਾਇਤਾ", to: "ਗੂੰਜ" },
]);

const ANCHOR_PATCHES: Readonly<Record<string, readonly Patch[]>> = Object.freeze({
  // Keep echo distinct from reverberation in the rendered bank.
  "SCI-CP006-EXH-A14": [{ from: "ਗੂੰਜ", to: "ਪ੍ਰਤਿਧੁਨੀ" }],
  "SCI-CP006-EXH-A24": [{ from: "ਗੂੰਜ", to: "ਪ੍ਰਤਿਧੁਨੀ" }],
});

export function polishPunjabiPhysicsCp005Cp006TextV1(anchorId: string, text: string): string {
  let out = text;
  for (const patch of COMMON_PATCHES) out = out.replaceAll(patch.from, patch.to);
  for (const patch of ANCHOR_PATCHES[anchorId] ?? []) out = out.replaceAll(patch.from, patch.to);
  return out;
}

export function applyPunjabiPhysicsCp005Cp006PolishV1(
  anchorId: string,
  surface: PhysicsLocalizedAnchorSurfaceV1,
): PhysicsLocalizedAnchorSurfaceV1 {
  return {
    ...surface,
    stem: polishPunjabiPhysicsCp005Cp006TextV1(anchorId, surface.stem),
    answer: polishPunjabiPhysicsCp005Cp006TextV1(anchorId, surface.answer),
    distractors: surface.distractors.map((value) => polishPunjabiPhysicsCp005Cp006TextV1(anchorId, value)) as [string, string, string],
    trueStatement: polishPunjabiPhysicsCp005Cp006TextV1(anchorId, surface.trueStatement),
    falseStatement: polishPunjabiPhysicsCp005Cp006TextV1(anchorId, surface.falseStatement),
    explanation: polishPunjabiPhysicsCp005Cp006TextV1(anchorId, surface.explanation),
  };
}
