import type { ArticleSceneV1 } from "./cp003-catalog-v1";

const replacements: Readonly<Record<string, ArticleSceneV1>> = {
  A051: {
    id: "A051",
    domain: "household",
    ruleId: "GR-ART-009",
    difficulty: "medium",
    correctSegments: ["After the leak was repaired,", "there is not much water", "left in the tank", "for the morning supply."],
    errorSegments: ["After the leak was repaired,", "there is not many water", "left in the tank", "for the morning supply."],
    errorIndex: 1,
    correction: "much water",
    reason: "Water is uncountable, so 'much', not 'many', is used here.",
  },
};

export function remediateCp003SceneForClosureV1(scene: ArticleSceneV1): ArticleSceneV1 {
  return replacements[scene.id] ?? scene;
}
