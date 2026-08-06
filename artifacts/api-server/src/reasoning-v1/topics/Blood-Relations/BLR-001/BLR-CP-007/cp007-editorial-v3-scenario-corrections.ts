import {
  BLR_CP007_V3_THREE_LINK,
  type BlrCp007V3RelationTemplate,
} from "./cp007-editorial-v3-scenarios";

// The scenario catalogue is exported as readonly so consumers cannot casually
// alter it. This module is the explicit editorial correction authority loaded
// before the V3 bank is generated.
const threeLink = BLR_CP007_V3_THREE_LINK as BlrCp007V3RelationTemplate[];

threeLink[6] = {
  id: "THREE-BROTHER-IN-LAW",
  statements: [
    { leftId: "A", relationId: "BROTHER", rightId: "B" },
    { leftId: "B", relationId: "HUSBAND", rightId: "C" },
    { leftId: "C", relationId: "MOTHER", rightId: "D" },
  ],
  target: { subjectId: "A", relationId: "BROTHER_IN_LAW", referenceId: "C" },
  topology: "AFFINAL-WITH-CHILD-CONTEXT",
};

threeLink[7] = {
  id: "THREE-SISTER-IN-LAW",
  statements: [
    { leftId: "E", relationId: "SISTER", rightId: "F" },
    { leftId: "F", relationId: "WIFE", rightId: "G" },
    { leftId: "G", relationId: "FATHER", rightId: "H" },
  ],
  target: { subjectId: "E", relationId: "SISTER_IN_LAW", referenceId: "G" },
  topology: "AFFINAL-WITH-CHILD-CONTEXT",
};
