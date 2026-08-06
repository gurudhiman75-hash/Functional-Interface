import {
  BLR_CP007_V3_MISSING_PERSON_BASE,
  type BlrCp007V3MissingPersonTemplate,
} from "./cp007-editorial-v3-scenarios";

const templates = BLR_CP007_V3_MISSING_PERSON_BASE as BlrCp007V3MissingPersonTemplate[];
const maleTargetIndices = new Set([0, 2, 4, 6]);

// Left-side missing-person variants reverse the candidate-bearing statement.
// The reversal preserves the family connection but no longer establishes A's
// gender. Add independent, candidate-neutral evidence so exact uncle/aunt,
// grandfather/grandmother and nephew/niece answers remain provable.
templates.forEach((template, index) => {
  template.clues = [
    ...template.clues,
    {
      leftId: "A",
      relationId: maleTargetIndices.has(index) ? "HUSBAND" : "WIFE",
      rightId: "T",
    },
  ];
});
