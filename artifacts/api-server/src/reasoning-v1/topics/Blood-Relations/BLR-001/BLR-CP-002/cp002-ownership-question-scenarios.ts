import type {
  BlrCp002QuestionForm,
  BlrRoleCardinalityConstraint,
} from "./cp002-types";
import type { BlrCp002ScenarioTemplate } from "./cp002-scenario-library";
import { cp002Anchor, cp002Chain, cp002Step } from "./cp002-scenario-library";

export interface BlrCp002OwnershipScenarioTemplate
  extends BlrCp002ScenarioTemplate {
  questionForm: Exclude<BlrCp002QuestionForm, "HOW_RELATED">;
  constraints?: readonly BlrRoleCardinalityConstraint[];
}

const speaker = cp002Anchor("SPEAKER");
const pointed = cp002Anchor("POINTED_PERSON");
const noSpeakerSibling: readonly BlrRoleCardinalityConstraint[] = [
  {
    reference: speaker,
    relationId: "SIBLING",
    cardinality: "NONE",
  },
];

export const BLR_CP002_OWNERSHIP_QUESTION_SCENARIOS: readonly BlrCp002OwnershipScenarioTemplate[] = [
  {
    scenarioId: "CP002-WHOSE-PHOTO-SPEAKERS-SON",
    prototypeId: "BLR-CP002-PROT-POINTED-TO-SPEAKER",
    presentation: "PHOTOGRAPH",
    questionForm: "WHOSE_PHOTOGRAPH",
    sourcePattern: "PHOTO",
    clues: [
      { subjectId: "S", relationId: "SON", referenceId: "F" },
      { subjectId: "F", relationId: "FATHER", referenceId: "S" },
      { subjectId: "P", relationId: "SON", referenceId: "S" },
      { subjectId: "S", relationId: "FATHER", referenceId: "P" },
    ],
    speakerId: "S",
    pointedPersonId: "P",
    constraints: noSpeakerSibling,
    assertion: {
      subject: cp002Chain("POINTED_PERSON", cp002Step("FATHER")),
      relation: { kind: "SAME_PERSON" },
      reference: cp002Chain(
        "SPEAKER",
        cp002Step("FATHER"),
        cp002Step("SON"),
      ),
    },
    query: { subject: pointed, reference: speaker },
    expectedAnswerId: "SON",
  },
  {
    scenarioId: "CP002-WHOSE-PHOTO-SPEAKERS-OWN",
    prototypeId: "BLR-CP002-PROT-SELF-IDENTITY",
    presentation: "PHOTOGRAPH",
    questionForm: "WHOSE_PHOTOGRAPH",
    sourcePattern: "PHOTO",
    clues: [
      { subjectId: "S", relationId: "SON", referenceId: "M" },
      { subjectId: "M", relationId: "MOTHER", referenceId: "S" },
      { subjectId: "S", relationId: "HUSBAND", referenceId: "W" },
      { subjectId: "W", relationId: "WIFE", referenceId: "S" },
      { subjectId: "C", relationId: "SON", referenceId: "S" },
      { subjectId: "S", relationId: "FATHER", referenceId: "C" },
      { subjectId: "C", relationId: "SON", referenceId: "W" },
      { subjectId: "W", relationId: "MOTHER", referenceId: "C" },
    ],
    speakerId: "S",
    pointedPersonId: "S",
    constraints: noSpeakerSibling,
    assertion: {
      subject: cp002Chain(
        "POINTED_PERSON",
        cp002Step("SON"),
        cp002Step("MOTHER"),
      ),
      relation: { kind: "SAME_PERSON" },
      reference: cp002Chain(
        "SPEAKER",
        cp002Step("MOTHER"),
        cp002Step("DAUGHTER_IN_LAW"),
      ),
    },
    query: { subject: pointed, reference: speaker },
    expectedAnswerId: "SELF",
  },
  {
    scenarioId: "CP002-WHOSE-PORTRAIT-MOTHER-IN-LAW",
    prototypeId: "BLR-CP002-PROT-POINTED-TO-SPEAKER",
    presentation: "PHOTOGRAPH",
    questionForm: "WHOSE_PORTRAIT",
    sourcePattern: "PHOTO",
    clues: [
      { subjectId: "H", relationId: "HUSBAND", referenceId: "S" },
      { subjectId: "S", relationId: "WIFE", referenceId: "H" },
      { subjectId: "D", relationId: "DAUGHTER", referenceId: "S" },
      { subjectId: "S", relationId: "MOTHER", referenceId: "D" },
      { subjectId: "D", relationId: "DAUGHTER", referenceId: "H" },
      { subjectId: "H", relationId: "FATHER", referenceId: "D" },
      { subjectId: "H", relationId: "SON", referenceId: "P" },
      { subjectId: "P", relationId: "MOTHER", referenceId: "H" },
    ],
    speakerId: "S",
    pointedPersonId: "P",
    assertion: {
      subject: cp002Chain("POINTED_PERSON", cp002Step("SON")),
      relation: { kind: "SAME_PERSON" },
      reference: cp002Chain(
        "SPEAKER",
        cp002Step("DAUGHTER"),
        cp002Step("FATHER"),
      ),
    },
    query: { subject: pointed, reference: speaker },
    expectedAnswerId: "MOTHER_IN_LAW",
  },
] as const;
