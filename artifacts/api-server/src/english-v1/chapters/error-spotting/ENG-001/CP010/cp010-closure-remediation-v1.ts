import { modifierScene, type ModifierSceneV1 } from "./cp010-scene-types";

const replacements: Readonly<Record<string, ModifierSceneV1>> = {
  "MOD-H01": modifierScene({
    id: "MOD-H01", difficulty: "hard", ruleId: "GR-MOD-001", domain: "inquiry", errorIndex: 0,
    correctSegments: [
      "Examining entries in three registers, the inquiry officer traced the mismatch to a late correction",
      "during a routine reconciliation",
      "before the external review",
      "began the following week.",
    ],
    errorSegments: [
      "Examining entries in three registers, a late correction was traced by the inquiry officer",
      "during a routine reconciliation",
      "before the external review",
      "began the following week.",
    ],
    reason: "The inquiry officer examined the registers, so the opening participial phrase must attach to the officer rather than to 'a late correction'.",
  }),
  "MOD-H07": modifierScene({
    id: "MOD-H07", difficulty: "hard", ruleId: "GR-MOD-004", domain: "legal-file", errorIndex: 2,
    correctSegments: [
      "Because the original file contained no signatures,",
      "the reviewing officer retained the annexure",
      "that contained the disputed signatures, together with the original file,",
      "until the handwriting report arrived.",
    ],
    errorSegments: [
      "Because the original file contained no signatures,",
      "the reviewing officer retained the annexure",
      "with the original file that contained the disputed signatures,",
      "until the handwriting report arrived.",
    ],
    reason: "The opening clause states that the original file contained no signatures, so the relative clause about the disputed signatures must modify 'the annexure', not 'the original file'.",
  }),
  "MOD-H08": modifierScene({
    id: "MOD-H08", difficulty: "hard", ruleId: "GR-MOD-004", domain: "procurement-records", errorIndex: 3,
    correctSegments: [
      "Because the covering letter contained no tax figures,",
      "the audit team requested a replacement copy",
      "for the file, together with the covering letter,",
      "of the invoice that showed the revised tax amount on a separate line.",
    ],
    errorSegments: [
      "Because the covering letter contained no tax figures,",
      "the audit team requested a replacement copy",
      "for the file, together with the covering letter,",
      "of the invoice with the covering letter that showed the revised tax amount on a separate line.",
    ],
    reason: "The opening clause rules out the covering letter as the source of the tax figure, so the relative clause about the revised amount must modify 'invoice', not 'covering letter'.",
  }),
};

export function remediateCp010SceneForClosureV1(scene: ModifierSceneV1): ModifierSceneV1 {
  return replacements[scene.id] ?? scene;
}
