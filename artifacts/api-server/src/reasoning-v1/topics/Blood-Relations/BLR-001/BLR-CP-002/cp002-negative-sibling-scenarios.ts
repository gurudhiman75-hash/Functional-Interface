import type {
  BlrRoleCardinalityConstraint,
} from "./cp002-types";
import type { BlrCp002ScenarioTemplate } from "./cp002-scenario-library";
import { cp002Anchor, cp002Chain, cp002Step } from "./cp002-scenario-library";

export interface BlrCp002ConstrainedScenarioTemplate
  extends BlrCp002ScenarioTemplate {
  constraints: readonly BlrRoleCardinalityConstraint[];
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

export const BLR_CP002_NEGATIVE_SIBLING_SCENARIOS: readonly BlrCp002ConstrainedScenarioTemplate[] = [
  {
    scenarioId: "CP002-NO-SIBLING-SELF-FATHERS-SON",
    prototypeId: "BLR-CP002-PROT-SELF-IDENTITY",
    presentation: "PHOTOGRAPH",
    sourcePattern: "PHOTO",
    clues: [
      { subjectId: "S", relationId: "SON", referenceId: "F" },
      { subjectId: "F", relationId: "FATHER", referenceId: "S" },
    ],
    speakerId: "S",
    pointedPersonId: "S",
    constraints: noSpeakerSibling,
    assertion: {
      subject: pointed,
      relation: { kind: "KINSHIP", relationId: "SON", quantifier: "ANY" },
      reference: cp002Chain("SPEAKER", cp002Step("FATHER")),
    },
    query: { subject: pointed, reference: speaker },
    expectedAnswerId: "SELF",
  },
  {
    scenarioId: "CP002-NO-SIBLING-POINTED-SON",
    prototypeId: "BLR-CP002-PROT-POINTED-TO-SPEAKER",
    presentation: "POINTING",
    sourcePattern: "POINTER",
    clues: [
      { subjectId: "S", relationId: "DAUGHTER", referenceId: "F" },
      { subjectId: "F", relationId: "FATHER", referenceId: "S" },
      { subjectId: "P", relationId: "SON", referenceId: "S" },
      { subjectId: "S", relationId: "MOTHER", referenceId: "P" },
    ],
    speakerId: "S",
    pointedPersonId: "P",
    constraints: noSpeakerSibling,
    assertion: {
      subject: pointed,
      relation: { kind: "KINSHIP", relationId: "SON", quantifier: "ANY" },
      reference: cp002Chain(
        "SPEAKER",
        cp002Step("FATHER"),
        cp002Step("CHILD"),
      ),
    },
    query: { subject: pointed, reference: speaker },
    expectedAnswerId: "SON",
  },
  {
    scenarioId: "CP002-NO-SIBLING-REVERSE-MOTHER",
    prototypeId: "BLR-CP002-PROT-SPEAKER-TO-POINTED",
    presentation: "PHOTOGRAPH",
    sourcePattern: "PHOTO",
    clues: [
      { subjectId: "S", relationId: "DAUGHTER", referenceId: "F" },
      { subjectId: "F", relationId: "FATHER", referenceId: "S" },
      { subjectId: "P", relationId: "SON", referenceId: "S" },
      { subjectId: "S", relationId: "MOTHER", referenceId: "P" },
    ],
    speakerId: "S",
    pointedPersonId: "P",
    constraints: noSpeakerSibling,
    assertion: {
      subject: pointed,
      relation: { kind: "KINSHIP", relationId: "SON", quantifier: "ANY" },
      reference: cp002Chain(
        "SPEAKER",
        cp002Step("FATHER"),
        cp002Step("CHILD"),
      ),
    },
    query: { subject: speaker, reference: pointed },
    expectedAnswerId: "MOTHER",
  },
] as const;
