import type { PhysicsLocalizedAnchorSurfaceV1 } from "./sci-physics-localization-types-v1";

type Patch = Readonly<{ from: string; to: string }>;

const HINDI_PATCHES_BY_ANCHOR: Readonly<Record<string, readonly Patch[]>> = Object.freeze({
  "SCI-CP003-EXH-A11": [
    { from: "मशीन की दक्षता उपयोगी निर्गत कार्य और किसके अनुपात से मिलती है?", to: "मशीन की दक्षता उपयोगी कार्य का किससे अनुपात लेकर निकाली जाती है?" },
    { from: "उपयोगी निर्गत कार्य", to: "उपयोगी कार्य" },
    { from: "उपयोगी निर्गत", to: "उपयोगी कार्य" },
    { from: "दिए गए कुल निवेश", to: "कुल निवेशित कार्य" },
  ],
  "SCI-CP003-EXH-A13": [
    { from: "सरल मशीन का वेग अनुपात प्रयास द्वारा चली दूरी और किसके द्वारा चली दूरी की तुलना करता है?", to: "वेग अनुपात में प्रयास द्वारा चली दूरी की तुलना किसके द्वारा चली दूरी से की जाती है?" },
  ],
  "SCI-CP003-EXH-A19": [
    { from: "ढलवाँ तल आवश्यक प्रयास को किसे बढ़ाकर कम करता है?", to: "ढलवाँ तल कम प्रयास बल से भार उठाना कैसे संभव करता है?" },
    { from: "जिस दूरी तक प्रयास लगाया जाता है", to: "प्रयास लगाने की दूरी बढ़ाकर" },
  ],
  "SCI-CP003-EXH-A24": [
    { from: "उपयोगी निर्गत", to: "उपयोगी कार्य" },
  ],
  "SCI-CP004-EXH-A07": [
    { from: "घनत्व किसके प्रति इकाई द्रव्यमान को दर्शाता है?", to: "घनत्व के सूत्र ρ = m/V में द्रव्यमान को किस राशि से भाग दिया जाता है?" },
  ],
  "SCI-CP004-EXH-A09": [
    { from: "दाब किसके प्रति इकाई बल है?", to: "दाब के सूत्र P = F/A में बल को किस राशि से भाग दिया जाता है?" },
  ],
});

export function polishHindiPhysicsTextV1(anchorId: string, text: string): string {
  let out = text;
  for (const patch of HINDI_PATCHES_BY_ANCHOR[anchorId] ?? []) out = out.replaceAll(patch.from, patch.to);
  return out;
}

export function applyHindiPhysicsExamPolishV1(
  anchorId: string,
  surface: PhysicsLocalizedAnchorSurfaceV1,
): PhysicsLocalizedAnchorSurfaceV1 {
  return {
    ...surface,
    stem: polishHindiPhysicsTextV1(anchorId, surface.stem),
    answer: polishHindiPhysicsTextV1(anchorId, surface.answer),
    distractors: surface.distractors.map((value) => polishHindiPhysicsTextV1(anchorId, value)) as [string, string, string],
    trueStatement: polishHindiPhysicsTextV1(anchorId, surface.trueStatement),
    falseStatement: polishHindiPhysicsTextV1(anchorId, surface.falseStatement),
    explanation: polishHindiPhysicsTextV1(anchorId, surface.explanation),
  };
}
