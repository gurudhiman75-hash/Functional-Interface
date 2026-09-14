import type { PhysicsLocalizedAnchorSurfaceV1 } from "./sci-physics-localization-types-v1";

type Patch = Readonly<{ from: string; to: string }>;

// Punjabi-medium exam register: keep accepted Punjabi scientific terminology.
// Do not replace valid Punjabi terms merely because cognates also exist in Hindi.
const STANDARD_EXAM_PATCHES: readonly Patch[] = Object.freeze([
  { from: "ਡਿਰਾਈਵਡ ਇਕਾਈ", to: "ਵਿਉਤਪੰਨ ਇਕਾਈ" },
  { from: "ਫ੍ਰਿਕਵੈਂਸੀ", to: "ਆਵਿਰਤੀ" },
  { from: "ਲੀਸਟ ਕਾਊਂਟ", to: "ਘੱਟੋ-ਘੱਟ ਮਾਪ" },
  { from: "ਸਿਸਟਮੈਟਿਕ ਗਲਤੀ", to: "ਪ੍ਰਣਾਲੀਗਤ ਗਲਤੀ" },
  { from: "ਰੈਂਡਮ ਗਲਤੀ", to: "ਬੇਤਰਤੀਬ ਗਲਤੀ" },
  { from: "ਡਾਇਮੈਂਸ਼ਨਲ ਫਾਰਮੂਲਾ", to: "ਆਯਾਮੀ ਸੂਤਰ" },
  { from: "ਬਿਨਾ ਡਾਇਮੈਂਸ਼ਨ ਦੇ", to: "ਆਯਾਮ-ਰਹਿਤ" },
  { from: "ਸਾਇੰਟਿਫਿਕ ਨੋਟੇਸ਼ਨ", to: "ਵਿਗਿਆਨਕ ਸੰਕੇਤਨ" },
  { from: "ਸਿਗਨਿਫਿਕੈਂਟ ਫਿਗਰ", to: "ਸਾਰਥਕ ਅੰਕ" },
  { from: "ਪ੍ਰੀਫਿਕਸ", to: "ਅਗੇਤਰ" },
  { from: "ਰਿਲੇਟਿਵ ਡੈਨਸਿਟੀ", to: "ਸਾਪੇਖ ਘਣਤਾ" },
  { from: "ਵੇਕਟਰ ਮਾਤਰਾ", to: "ਸਦਿਸ਼ ਰਾਸ਼ੀ" },
  { from: "ਵੇਕਟਰ ਰਾਸ਼ੀ", to: "ਸਦਿਸ਼ ਰਾਸ਼ੀ" },
  { from: "ਵੇਕਟਰ ਰਾਸ਼ੀ", to: "ਸਦਿਸ਼ ਰਾਸ਼ੀ" },
  { from: "ਵੇਗ ਵੇਕਟਰ ਹੈ", to: "ਵੇਗ ਸਦਿਸ਼ ਰਾਸ਼ੀ ਹੈ" },
  { from: "ਸਕੇਲਰ ਮਾਤਰਾ", to: "ਅਦਿਸ਼ ਰਾਸ਼ੀ" },
  { from: "ਸਕੇਲਰ ਰਾਸ਼ੀ", to: "ਅਦਿਸ਼ ਰਾਸ਼ੀ" },
  { from: "ਸਕੇਲਰ ਰਾਸ਼ੀ", to: "ਅਦਿਸ਼ ਰਾਸ਼ੀ" },
  { from: "ਸਕੇਲਰ ਗੁਣਨਫਲ", to: "ਅਦਿਸ਼ ਗੁਣਨਫਲ" },
  { from: "ਇੰਪਲਸ", to: "ਆਵੇਗ" },
  { from: "ਸੈਂਟ੍ਰਿਪੀਟਲ ਬਲ", to: "ਕੇਂਦਰਗਾਮੀ ਬਲ" },
  { from: "ਸਰਕੁਲਰ ਗਤੀ", to: "ਵਰਤੂਲ ਗਤੀ" },
  { from: "ਇਕਸਾਰ ਗੋਲ ਗਤੀ", to: "ਇਕਸਾਰ ਵਰਤੂਲ ਗਤੀ" },
  { from: "ਟੈਂਜੈਂਟ ਦੀ ਦਿਸ਼ਾ", to: "ਸਪਰਸ਼ ਰੇਖਾ ਦੀ ਦਿਸ਼ਾ" },
  { from: "ਕਾਇਨੇਟਿਕ ਊਰਜਾ", to: "ਗਤਿਜ ਊਰਜਾ" },
  { from: "ਪੋਟੈਂਸ਼ਲ ਊਰਜਾ", to: "ਸਥਿਤਿਜ ਊਰਜਾ" },
  { from: "ਪਾਜ਼ਿਟਿਵ", to: "ਧਨਾਤਮਕ" },
  { from: "ਨੈਗੇਟਿਵ", to: "ਰਿਣਾਤਮਕ" },
  { from: "ਗ੍ਰੈਵਿਟੀ", to: "ਗੁਰੂਤਾਕਰਸ਼ਣ" },
  { from: "ਨੈੱਟ ਵਿਸਥਾਪਨ", to: "ਕੁੱਲ ਵਿਸਥਾਪਨ" },
  { from: "ਨਾਰਮਲ ਬਲ", to: "ਲੰਬ ਬਲ" },
  { from: "ਟਰਮੀਨਲ ਚਾਲ", to: "ਸੀਮਾਂਤ ਚਾਲ" },
  { from: "ਜ਼ੀਰੋ ਐਰਰ", to: "ਸਿਫ਼ਰ ਗਲਤੀ" },
  { from: "ਅਲੱਗ-ਥਲੱਗ ਸਿਸਟਮ", to: "ਅਲੱਗ-ਥਲੱਗ ਪ੍ਰਣਾਲੀ" },
  { from: "ਅਲੱਗ ਸਿਸਟਮ", to: "ਅਲੱਗ ਪ੍ਰਣਾਲੀ" },
  { from: "ਸਿਸਟਮ", to: "ਪ੍ਰਣਾਲੀ" },
]);

const ANCHOR_PATCHES: Readonly<Record<string, readonly Patch[]>> = Object.freeze({
  "SCI-CP001-EXH-A02": [
    { from: "ਬਿਜਲੀ ਧਾਰਾ", to: "ਬਿਜਲਈ ਧਾਰਾ" },
  ],
  "SCI-CP001-EXH-A10": [
    { from: "ਘੱਟੋ-ਘੱਟ ਮਾਪ ਉਹ ਸਭ ਤੋਂ ਛੋਟਾ ਮਾਨ", to: "ਯੰਤਰ ਦਾ ਘੱਟੋ-ਘੱਟ ਮਾਪ ਉਹ ਸਭ ਤੋਂ ਛੋਟਾ ਮਾਨ" },
  ],
  "SCI-CP002-EXH-A19": [
    { from: "ਸਮਾਨ ਚਾਲ ਨਾਲ ਵਰਤੂਲ ਗਤੀ", to: "ਇਕਸਾਰ ਵਰਤੂਲ ਗਤੀ" },
  ],
  "SCI-CP002-EXH-A20": [
    { from: "ਗੋਲ ਰਸਤੇ ਦੇ ਕੇਂਦਰ", to: "ਵਰਤੂਲ ਦੇ ਕੇਂਦਰ" },
    { from: "ਗੋਲ ਰਸਤੇ ਵਿੱਚ", to: "ਵਰਤੂਲ ਪਥ ਵਿੱਚ" },
  ],
});

export function standardizePunjabiPhysicsExamTextV4(anchorId: string, text: string): string {
  let out = text;
  for (const patch of STANDARD_EXAM_PATCHES) out = out.replaceAll(patch.from, patch.to);
  for (const patch of ANCHOR_PATCHES[anchorId] ?? []) out = out.replaceAll(patch.from, patch.to);
  return out;
}

export function applyPunjabiPhysicsStandardExamV4(
  anchorId: string,
  surface: PhysicsLocalizedAnchorSurfaceV1,
): PhysicsLocalizedAnchorSurfaceV1 {
  return {
    ...surface,
    stem: standardizePunjabiPhysicsExamTextV4(anchorId, surface.stem),
    answer: standardizePunjabiPhysicsExamTextV4(anchorId, surface.answer),
    distractors: surface.distractors.map((value) => standardizePunjabiPhysicsExamTextV4(anchorId, value)) as [string, string, string],
    trueStatement: standardizePunjabiPhysicsExamTextV4(anchorId, surface.trueStatement),
    falseStatement: standardizePunjabiPhysicsExamTextV4(anchorId, surface.falseStatement),
    explanation: standardizePunjabiPhysicsExamTextV4(anchorId, surface.explanation),
  };
}

export const SCI_PHYSICS_PUNJABI_STANDARD_EXAM_V4 = "SCI-PHYSICS-PA-STANDARD-EXAM-V4" as const;
