import type { BlrCp002ScenarioTemplate } from "./cp002-scenario-library";
import { cp002Anchor, cp002Chain, cp002Step } from "./cp002-scenario-library";

const speaker = cp002Anchor("SPEAKER");
const pointed = cp002Anchor("POINTED_PERSON");

export const BLR_CP002_ONLY_CHILD_SCENARIOS: readonly BlrCp002ScenarioTemplate[] = [
  {
    scenarioId: "CP002-ONLY-CHILD-DAUGHTER-TO-SPEAKER",
    prototypeId: "BLR-CP002-PROT-POINTED-TO-SPEAKER",
    presentation: "PHOTOGRAPH",
    sourcePattern: "PHOTO",
    clues: [
      { subjectId: "F", relationId: "FATHER", referenceId: "S" },
      { subjectId: "S", relationId: "DAUGHTER", referenceId: "F" },
      { subjectId: "P", relationId: "DAUGHTER", referenceId: "S" },
    ],
    speakerId: "S",
    pointedPersonId: "P",
    assertion: {
      subject: pointed,
      relation: { kind: "KINSHIP", relationId: "DAUGHTER", quantifier: "ANY" },
      reference: cp002Chain(
        "SPEAKER",
        cp002Step("FATHER"),
        cp002Step("CHILD", "ONLY"),
      ),
    },
    query: { subject: pointed, reference: speaker },
    expectedAnswerId: "DAUGHTER",
  },
  {
    scenarioId: "CP002-ONLY-CHILD-MOTHER-TO-POINTED",
    prototypeId: "BLR-CP002-PROT-SPEAKER-TO-POINTED",
    presentation: "POINTING",
    sourcePattern: "POINTER",
    clues: [
      { subjectId: "F", relationId: "FATHER", referenceId: "S" },
      { subjectId: "S", relationId: "DAUGHTER", referenceId: "F" },
      { subjectId: "P", relationId: "DAUGHTER", referenceId: "S" },
    ],
    speakerId: "S",
    pointedPersonId: "P",
    assertion: {
      subject: pointed,
      relation: { kind: "KINSHIP", relationId: "DAUGHTER", quantifier: "ANY" },
      reference: cp002Chain(
        "SPEAKER",
        cp002Step("FATHER"),
        cp002Step("CHILD", "ONLY"),
      ),
    },
    query: { subject: speaker, reference: pointed },
    expectedAnswerId: "MOTHER",
  },
  {
    scenarioId: "CP002-ONLY-CHILD-SELF-IDENTITY",
    prototypeId: "BLR-CP002-PROT-SELF-IDENTITY",
    presentation: "PHOTOGRAPH",
    sourcePattern: "PHOTO",
    clues: [
      { subjectId: "F", relationId: "FATHER", referenceId: "S" },
      { subjectId: "S", relationId: "DAUGHTER", referenceId: "F" },
    ],
    speakerId: "S",
    pointedPersonId: "S",
    assertion: {
      subject: pointed,
      relation: { kind: "KINSHIP", relationId: "CHILD", quantifier: "ONLY" },
      reference: cp002Chain("SPEAKER", cp002Step("FATHER")),
    },
    query: { subject: pointed, reference: speaker },
    expectedAnswerId: "SELF",
  },
] as const;
