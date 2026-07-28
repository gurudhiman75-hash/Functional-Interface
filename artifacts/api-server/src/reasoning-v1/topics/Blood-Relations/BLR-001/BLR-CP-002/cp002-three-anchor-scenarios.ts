import type { BlrCp002ScenarioTemplate } from "./cp002-scenario-library";
import { cp002Anchor, cp002Chain, cp002Step } from "./cp002-scenario-library";

const speaker = cp002Anchor("SPEAKER");
const listener = cp002Anchor("LISTENER");
const pointed = cp002Anchor("POINTED_PERSON");

export const BLR_CP002_THREE_ANCHOR_SCENARIOS: readonly BlrCp002ScenarioTemplate[] = [
  {
    scenarioId: "CP002-THREE-ANCHOR-INTRODUCED-MAN-TO-HUSBAND",
    prototypeId: "BLR-CP002-PROT-THREE-ANCHOR-INTRODUCTION",
    presentation: "INTRODUCTION",
    sourcePattern: "INTRODUCTION",
    clues: [
      { subjectId: "F", relationId: "SON", referenceId: "G" },
      { subjectId: "G", relationId: "FATHER", referenceId: "F" },
      { subjectId: "S", relationId: "DAUGHTER", referenceId: "F" },
      { subjectId: "P", relationId: "SON", referenceId: "F" },
      { subjectId: "B", relationId: "SON", referenceId: "F" },
      { subjectId: "P", relationId: "BROTHER", referenceId: "B" },
      { subjectId: "S", relationId: "WIFE", referenceId: "H" },
      { subjectId: "H", relationId: "HUSBAND", referenceId: "S" },
    ],
    speakerId: "S",
    listenerId: "H",
    pointedPersonId: "P",
    assertion: {
      subject: cp002Chain(
        "POINTED_PERSON",
        cp002Step("BROTHER"),
        cp002Step("FATHER"),
      ),
      relation: { kind: "SAME_PERSON" },
      reference: cp002Chain(
        "SPEAKER",
        cp002Step("GRANDFATHER"),
        cp002Step("SON", "ONLY"),
      ),
    },
    query: { subject: pointed, reference: listener },
    expectedAnswerId: "BROTHER_IN_LAW",
  },
  {
    scenarioId: "CP002-THREE-ANCHOR-INTRODUCED-WOMAN-TO-HUSBAND",
    prototypeId: "BLR-CP002-PROT-THREE-ANCHOR-INTRODUCTION",
    presentation: "INTRODUCTION",
    sourcePattern: "INTRODUCTION",
    clues: [
      { subjectId: "S", relationId: "DAUGHTER", referenceId: "F" },
      { subjectId: "F", relationId: "FATHER", referenceId: "S" },
      { subjectId: "B", relationId: "SON", referenceId: "F" },
      { subjectId: "F", relationId: "FATHER", referenceId: "B" },
      { subjectId: "P", relationId: "WIFE", referenceId: "B" },
      { subjectId: "B", relationId: "HUSBAND", referenceId: "P" },
      { subjectId: "S", relationId: "WIFE", referenceId: "H" },
      { subjectId: "H", relationId: "HUSBAND", referenceId: "S" },
    ],
    speakerId: "S",
    listenerId: "H",
    pointedPersonId: "P",
    assertion: {
      subject: cp002Chain("POINTED_PERSON", cp002Step("HUSBAND")),
      relation: { kind: "SAME_PERSON" },
      reference: cp002Chain(
        "SPEAKER",
        cp002Step("FATHER"),
        cp002Step("SON", "ONLY"),
      ),
    },
    query: { subject: pointed, reference: speaker },
    expectedAnswerId: "SISTER_IN_LAW",
  },
  {
    scenarioId: "CP002-THREE-ANCHOR-POINTED-SON-OF-LISTENER",
    prototypeId: "BLR-CP002-PROT-THREE-ANCHOR-INTRODUCTION",
    presentation: "POINTING",
    sourcePattern: "POINTER",
    clues: [
      { subjectId: "L", relationId: "SON", referenceId: "M" },
      { subjectId: "M", relationId: "MOTHER", referenceId: "L" },
      { subjectId: "P", relationId: "SON", referenceId: "L" },
      { subjectId: "L", relationId: "FATHER", referenceId: "P" },
      { subjectId: "S", relationId: "WIFE", referenceId: "L" },
      { subjectId: "L", relationId: "HUSBAND", referenceId: "S" },
    ],
    speakerId: "S",
    listenerId: "L",
    pointedPersonId: "P",
    assertion: {
      subject: cp002Chain("POINTED_PERSON", cp002Step("FATHER")),
      relation: { kind: "SAME_PERSON" },
      reference: cp002Chain(
        "LISTENER",
        cp002Step("MOTHER"),
        cp002Step("SON", "ONLY"),
      ),
    },
    query: { subject: pointed, reference: listener },
    expectedAnswerId: "SON",
  },
  {
    scenarioId: "CP002-THREE-ANCHOR-LISTENER-TO-POINTED-SON",
    prototypeId: "BLR-CP002-PROT-THREE-ANCHOR-INTRODUCTION",
    presentation: "PHOTOGRAPH",
    sourcePattern: "PHOTO",
    clues: [
      { subjectId: "L", relationId: "SON", referenceId: "M" },
      { subjectId: "M", relationId: "MOTHER", referenceId: "L" },
      { subjectId: "P", relationId: "SON", referenceId: "L" },
      { subjectId: "L", relationId: "FATHER", referenceId: "P" },
      { subjectId: "S", relationId: "WIFE", referenceId: "L" },
      { subjectId: "L", relationId: "HUSBAND", referenceId: "S" },
    ],
    speakerId: "S",
    listenerId: "L",
    pointedPersonId: "P",
    assertion: {
      subject: cp002Chain("POINTED_PERSON", cp002Step("FATHER")),
      relation: { kind: "SAME_PERSON" },
      reference: cp002Chain(
        "LISTENER",
        cp002Step("MOTHER"),
        cp002Step("SON", "ONLY"),
      ),
    },
    query: { subject: listener, reference: pointed },
    expectedAnswerId: "FATHER",
  },
] as const;
