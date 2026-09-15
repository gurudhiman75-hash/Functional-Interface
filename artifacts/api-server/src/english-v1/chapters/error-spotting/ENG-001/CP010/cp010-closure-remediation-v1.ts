import { modifierScene, type ModifierSceneV1 } from "./cp010-scene-types";

const replacements: Readonly<Record<string, ModifierSceneV1>> = {
  "MOD-H07": modifierScene({
    id: "MOD-H07", difficulty: "hard", ruleId: "GR-MOD-004", domain: "legal-file", errorIndex: 2,
    correctSegments: [
      "Because the original file contained no signatures,",
      "the reviewing officer retained the annexure",
      "that contained the disputed signatures",
      "with the original file until the handwriting report arrived.",
    ],
    errorSegments: [
      "Because the original file contained no signatures,",
      "the reviewing officer retained the annexure",
      "with the original file that contained the disputed signatures",
      "until the handwriting report arrived.",
    ],
    reason: "The opening clause states that the original file contained no signatures, so the relative clause about the disputed signatures must modify 'the annexure', not 'the original file'.",
  }),
  "MOD-H08": modifierScene({
    id: "MOD-H08", difficulty: "hard", ruleId: "GR-MOD-004", domain: "procurement-records", errorIndex: 2,
    correctSegments: [
      "Because the covering letter contained no tax figures,",
      "the audit team requested",
      "a replacement copy of the invoice that showed the revised tax amount",
      "together with the covering letter for the file.",
    ],
    errorSegments: [
      "Because the covering letter contained no tax figures,",
      "the audit team requested",
      "a replacement copy of the invoice with the covering letter that showed the revised tax amount",
      "for the file.",
    ],
    reason: "The opening clause rules out the covering letter as the source of the tax figure, so the relative clause must stay next to 'invoice'.",
  }),
};

export function remediateCp010SceneForClosureV1(scene: ModifierSceneV1): ModifierSceneV1 {
  return replacements[scene.id] ?? scene;
}
