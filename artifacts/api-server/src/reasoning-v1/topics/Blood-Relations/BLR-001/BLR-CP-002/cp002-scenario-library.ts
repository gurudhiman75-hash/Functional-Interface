import { graphFromClues } from "../foundation/graph-closure";
import { assignNamesForClues } from "../foundation/name-registry";
import type { SeededRandom } from "../foundation/prng";
import type { DirectRelationClue } from "../foundation/types";
import type {
  BlrCp002AnswerId,
  BlrCp002Presentation,
  BlrCp002PrototypeId,
  BlrCp002StructuredPrompt,
  BlrEntityExpression,
  BlrRoleAssertion,
  BlrRoleStep,
} from "./cp002-types";

export interface BlrCp002ScenarioTemplate {
  scenarioId: string;
  prototypeId: BlrCp002PrototypeId;
  presentation: BlrCp002Presentation;
  clues: readonly DirectRelationClue[];
  speakerId: string;
  listenerId?: string;
  pointedPersonId?: string;
  assertion: BlrRoleAssertion;
  query: {
    subject: BlrEntityExpression;
    reference: BlrEntityExpression;
  };
  expectedAnswerId: BlrCp002AnswerId;
  sourcePattern:
    | "POINTER"
    | "PHOTO"
    | "INTRODUCTION"
    | "STAGE"
    | "TWO_SPEAKER";
}

export const cp002Anchor = (
  anchor: "SPEAKER" | "LISTENER" | "POINTED_PERSON",
): BlrEntityExpression => ({ kind: "ANCHOR", anchor });

export const cp002Step = (
  relationId: BlrRoleStep["relationId"],
  quantifier: BlrRoleStep["quantifier"] = "ANY",
): BlrRoleStep => ({ relationId, quantifier });

export const cp002Chain = (
  anchor: "SPEAKER" | "LISTENER" | "POINTED_PERSON",
  ...steps: readonly BlrRoleStep[]
): BlrEntityExpression => ({ kind: "ROLE_CHAIN", anchor, steps });

const pointed = cp002Anchor("POINTED_PERSON");
const speaker = cp002Anchor("SPEAKER");
const listener = cp002Anchor("LISTENER");

const SCENARIOS: readonly BlrCp002ScenarioTemplate[] = [
  {
    scenarioId: "CP002-P2S-GRANDSON-HUSBANDS-DAUGHTER",
    prototypeId: "BLR-CP002-PROT-POINTED-TO-SPEAKER",
    presentation: "PHOTOGRAPH",
    sourcePattern: "PHOTO",
    clues: [
      { subjectId: "H", relationId: "HUSBAND", referenceId: "W" },
      { subjectId: "D", relationId: "DAUGHTER", referenceId: "H" },
      { subjectId: "D", relationId: "DAUGHTER", referenceId: "W" },
      { subjectId: "P", relationId: "SON", referenceId: "D" },
    ],
    speakerId: "W",
    pointedPersonId: "P",
    assertion: {
      subject: pointed,
      relation: { kind: "KINSHIP", relationId: "SON", quantifier: "ANY" },
      reference: cp002Chain("SPEAKER", cp002Step("HUSBAND"), cp002Step("DAUGHTER")),
    },
    query: { subject: pointed, reference: speaker },
    expectedAnswerId: "GRANDSON",
  },
  {
    scenarioId: "CP002-P2S-SON-MOTHERS-ONLY-DAUGHTER",
    prototypeId: "BLR-CP002-PROT-POINTED-TO-SPEAKER",
    presentation: "POINTING",
    sourcePattern: "POINTER",
    clues: [
      { subjectId: "M", relationId: "MOTHER", referenceId: "S" },
      { subjectId: "S", relationId: "DAUGHTER", referenceId: "M" },
      { subjectId: "P", relationId: "SON", referenceId: "S" },
    ],
    speakerId: "S",
    pointedPersonId: "P",
    assertion: {
      subject: pointed,
      relation: { kind: "KINSHIP", relationId: "SON", quantifier: "ANY" },
      reference: cp002Chain("SPEAKER", cp002Step("MOTHER"), cp002Step("DAUGHTER", "ONLY")),
    },
    query: { subject: pointed, reference: speaker },
    expectedAnswerId: "SON",
  },
  {
    scenarioId: "CP002-P2S-SISTER-WIFE-HUSBAND-COLLAPSE",
    prototypeId: "BLR-CP002-PROT-POINTED-TO-SPEAKER",
    presentation: "STAGE",
    sourcePattern: "STAGE",
    clues: [
      { subjectId: "S", relationId: "HUSBAND", referenceId: "W" },
      { subjectId: "P", relationId: "SISTER", referenceId: "S" },
    ],
    speakerId: "S",
    pointedPersonId: "P",
    assertion: {
      subject: pointed,
      relation: { kind: "KINSHIP", relationId: "SISTER", quantifier: "ANY" },
      reference: cp002Chain("SPEAKER", cp002Step("WIFE"), cp002Step("HUSBAND")),
    },
    query: { subject: pointed, reference: speaker },
    expectedAnswerId: "SISTER",
  },
  {
    scenarioId: "CP002-P2S-NEPHEW-MOTHERS-ONLY-SON",
    prototypeId: "BLR-CP002-PROT-POINTED-TO-SPEAKER",
    presentation: "INTRODUCTION",
    sourcePattern: "INTRODUCTION",
    clues: [
      { subjectId: "M", relationId: "MOTHER", referenceId: "A" },
      { subjectId: "A", relationId: "DAUGHTER", referenceId: "M" },
      { subjectId: "B", relationId: "SON", referenceId: "M" },
      { subjectId: "P", relationId: "SON", referenceId: "B" },
    ],
    speakerId: "A",
    pointedPersonId: "P",
    assertion: {
      subject: pointed,
      relation: { kind: "KINSHIP", relationId: "SON", quantifier: "ANY" },
      reference: cp002Chain("SPEAKER", cp002Step("MOTHER"), cp002Step("SON", "ONLY")),
    },
    query: { subject: pointed, reference: speaker },
    expectedAnswerId: "NEPHEW",
  },
  {
    scenarioId: "CP002-S2P-GRANDMOTHER-HUSBANDS-DAUGHTER",
    prototypeId: "BLR-CP002-PROT-SPEAKER-TO-POINTED",
    presentation: "PHOTOGRAPH",
    sourcePattern: "PHOTO",
    clues: [
      { subjectId: "H", relationId: "HUSBAND", referenceId: "W" },
      { subjectId: "D", relationId: "DAUGHTER", referenceId: "H" },
      { subjectId: "D", relationId: "DAUGHTER", referenceId: "W" },
      { subjectId: "P", relationId: "SON", referenceId: "D" },
    ],
    speakerId: "W",
    pointedPersonId: "P",
    assertion: {
      subject: pointed,
      relation: { kind: "KINSHIP", relationId: "SON", quantifier: "ANY" },
      reference: cp002Chain("SPEAKER", cp002Step("HUSBAND"), cp002Step("DAUGHTER")),
    },
    query: { subject: speaker, reference: pointed },
    expectedAnswerId: "GRANDMOTHER",
  },
  {
    scenarioId: "CP002-S2P-MOTHER-ONLY-DAUGHTER-COLLAPSE",
    prototypeId: "BLR-CP002-PROT-SPEAKER-TO-POINTED",
    presentation: "POINTING",
    sourcePattern: "POINTER",
    clues: [
      { subjectId: "M", relationId: "MOTHER", referenceId: "S" },
      { subjectId: "S", relationId: "DAUGHTER", referenceId: "M" },
      { subjectId: "P", relationId: "SON", referenceId: "S" },
    ],
    speakerId: "S",
    pointedPersonId: "P",
    assertion: {
      subject: pointed,
      relation: { kind: "KINSHIP", relationId: "SON", quantifier: "ANY" },
      reference: cp002Chain("SPEAKER", cp002Step("MOTHER"), cp002Step("DAUGHTER", "ONLY")),
    },
    query: { subject: speaker, reference: pointed },
    expectedAnswerId: "MOTHER",
  },
  {
    scenarioId: "CP002-S2P-BROTHER-WIFE-HUSBAND-COLLAPSE",
    prototypeId: "BLR-CP002-PROT-SPEAKER-TO-POINTED",
    presentation: "STAGE",
    sourcePattern: "STAGE",
    clues: [
      { subjectId: "S", relationId: "HUSBAND", referenceId: "W" },
      { subjectId: "P", relationId: "SISTER", referenceId: "S" },
    ],
    speakerId: "S",
    pointedPersonId: "P",
    assertion: {
      subject: pointed,
      relation: { kind: "KINSHIP", relationId: "SISTER", quantifier: "ANY" },
      reference: cp002Chain("SPEAKER", cp002Step("WIFE"), cp002Step("HUSBAND")),
    },
    query: { subject: speaker, reference: pointed },
    expectedAnswerId: "BROTHER",
  },
  {
    scenarioId: "CP002-NESTED-HUSBAND-TO-PHOTO-LADY",
    prototypeId: "BLR-CP002-PROT-NESTED-QUERY-ENDPOINT",
    presentation: "PHOTOGRAPH",
    sourcePattern: "PHOTO",
    clues: [
      { subjectId: "L", relationId: "DAUGHTER", referenceId: "F" },
      { subjectId: "F", relationId: "FATHER", referenceId: "L" },
      { subjectId: "B", relationId: "SON", referenceId: "F" },
      { subjectId: "F", relationId: "FATHER", referenceId: "B" },
      { subjectId: "B", relationId: "HUSBAND", referenceId: "M" },
      { subjectId: "H", relationId: "SON", referenceId: "B" },
      { subjectId: "M", relationId: "MOTHER", referenceId: "H" },
      { subjectId: "W", relationId: "WIFE", referenceId: "H" },
    ],
    speakerId: "W",
    pointedPersonId: "L",
    assertion: {
      subject: cp002Chain(
        "POINTED_PERSON",
        cp002Step("FATHER"),
        cp002Step("SON", "ONLY"),
        cp002Step("WIFE"),
      ),
      relation: { kind: "SAME_PERSON" },
      reference: cp002Chain("SPEAKER", cp002Step("MOTHER_IN_LAW")),
    },
    query: {
      subject: cp002Chain("SPEAKER", cp002Step("HUSBAND")),
      reference: pointed,
    },
    expectedAnswerId: "NEPHEW",
  },
  {
    scenarioId: "CP002-NESTED-POINTED-DAUGHTER-TO-SPEAKER",
    prototypeId: "BLR-CP002-PROT-NESTED-QUERY-ENDPOINT",
    presentation: "INTRODUCTION",
    sourcePattern: "INTRODUCTION",
    clues: [
      { subjectId: "M", relationId: "MOTHER", referenceId: "S" },
      { subjectId: "S", relationId: "DAUGHTER", referenceId: "M" },
      { subjectId: "P", relationId: "SON", referenceId: "M" },
      { subjectId: "D", relationId: "DAUGHTER", referenceId: "P" },
    ],
    speakerId: "S",
    pointedPersonId: "P",
    assertion: {
      subject: pointed,
      relation: { kind: "KINSHIP", relationId: "SON", quantifier: "ONLY" },
      reference: cp002Chain("SPEAKER", cp002Step("MOTHER")),
    },
    query: {
      subject: cp002Chain("POINTED_PERSON", cp002Step("DAUGHTER")),
      reference: speaker,
    },
    expectedAnswerId: "NIECE",
  },
  {
    scenarioId: "CP002-CONV-MOTHER-ONLY-DAUGHTER",
    prototypeId: "BLR-CP002-PROT-TWO-SPEAKER-CONVERSATION",
    presentation: "CONVERSATION",
    sourcePattern: "TWO_SPEAKER",
    clues: [
      { subjectId: "G", relationId: "MOTHER", referenceId: "L" },
      { subjectId: "L", relationId: "SON", referenceId: "G" },
      { subjectId: "M", relationId: "DAUGHTER", referenceId: "G" },
      { subjectId: "M", relationId: "MOTHER", referenceId: "S" },
      { subjectId: "S", relationId: "SON", referenceId: "M" },
    ],
    speakerId: "S",
    listenerId: "L",
    assertion: {
      subject: cp002Chain("SPEAKER", cp002Step("MOTHER")),
      relation: { kind: "KINSHIP", relationId: "DAUGHTER", quantifier: "ONLY" },
      reference: cp002Chain("LISTENER", cp002Step("MOTHER")),
    },
    query: {
      subject: cp002Chain("SPEAKER", cp002Step("MOTHER")),
      reference: listener,
    },
    expectedAnswerId: "SISTER",
  },
  {
    scenarioId: "CP002-CONV-YOUR-MOTHER-MY-MOTHERS-SISTER",
    prototypeId: "BLR-CP002-PROT-TWO-SPEAKER-CONVERSATION",
    presentation: "CONVERSATION",
    sourcePattern: "TWO_SPEAKER",
    clues: [
      { subjectId: "M1", relationId: "MOTHER", referenceId: "B" },
      { subjectId: "B", relationId: "SON", referenceId: "M1" },
      { subjectId: "M2", relationId: "MOTHER", referenceId: "A" },
      { subjectId: "M2", relationId: "SISTER", referenceId: "M1" },
    ],
    speakerId: "B",
    listenerId: "A",
    assertion: {
      subject: cp002Chain("LISTENER", cp002Step("MOTHER")),
      relation: { kind: "KINSHIP", relationId: "SISTER", quantifier: "ANY" },
      reference: cp002Chain("SPEAKER", cp002Step("MOTHER")),
    },
    query: { subject: listener, reference: speaker },
    expectedAnswerId: "COUSIN",
  },
  {
    scenarioId: "CP002-CONV-FATHER-ONLY-BROTHER-OF-YOUR-MOTHER",
    prototypeId: "BLR-CP002-PROT-TWO-SPEAKER-CONVERSATION",
    presentation: "CONVERSATION",
    sourcePattern: "TWO_SPEAKER",
    clues: [
      { subjectId: "F", relationId: "FATHER", referenceId: "S" },
      { subjectId: "M", relationId: "MOTHER", referenceId: "L" },
      { subjectId: "F", relationId: "BROTHER", referenceId: "M" },
    ],
    speakerId: "S",
    listenerId: "L",
    assertion: {
      subject: cp002Chain("SPEAKER", cp002Step("FATHER")),
      relation: { kind: "KINSHIP", relationId: "BROTHER", quantifier: "ONLY" },
      reference: cp002Chain("LISTENER", cp002Step("MOTHER")),
    },
    query: { subject: speaker, reference: listener },
    expectedAnswerId: "COUSIN",
  },
  {
    scenarioId: "CP002-SELF-FATHERS-ONLY-DAUGHTER",
    prototypeId: "BLR-CP002-PROT-SELF-IDENTITY",
    presentation: "PHOTOGRAPH",
    sourcePattern: "PHOTO",
    clues: [
      { subjectId: "S", relationId: "DAUGHTER", referenceId: "F" },
      { subjectId: "F", relationId: "FATHER", referenceId: "S" },
      { subjectId: "B", relationId: "SON", referenceId: "F" },
    ],
    speakerId: "S",
    pointedPersonId: "S",
    assertion: {
      subject: pointed,
      relation: { kind: "KINSHIP", relationId: "DAUGHTER", quantifier: "ONLY" },
      reference: cp002Chain("SPEAKER", cp002Step("FATHER")),
    },
    query: { subject: pointed, reference: speaker },
    expectedAnswerId: "SELF",
  },
  {
    scenarioId: "CP002-SELF-WIFE-OF-MY-HUSBAND",
    prototypeId: "BLR-CP002-PROT-SELF-IDENTITY",
    presentation: "INTRODUCTION",
    sourcePattern: "INTRODUCTION",
    clues: [
      { subjectId: "S", relationId: "WIFE", referenceId: "H" },
      { subjectId: "H", relationId: "HUSBAND", referenceId: "S" },
    ],
    speakerId: "S",
    pointedPersonId: "S",
    assertion: {
      subject: pointed,
      relation: { kind: "KINSHIP", relationId: "WIFE", quantifier: "ANY" },
      reference: cp002Chain("SPEAKER", cp002Step("HUSBAND")),
    },
    query: { subject: pointed, reference: speaker },
    expectedAnswerId: "SELF",
  },
] as const;

export function cp002ScenariosFor(
  prototypeId: BlrCp002PrototypeId,
): readonly BlrCp002ScenarioTemplate[] {
  const scenarios = SCENARIOS.filter((entry) => entry.prototypeId === prototypeId);
  if (scenarios.length === 0) throw new Error(`No CP-002 scenarios for ${prototypeId}.`);
  return scenarios;
}

export function buildCp002StructuredPrompt(
  template: BlrCp002ScenarioTemplate,
  random: SeededRandom,
): BlrCp002StructuredPrompt {
  const personNames = assignNamesForClues(template.clues, random);
  const familyGraph = graphFromClues(template.clues, personNames);
  return {
    presentation: template.presentation,
    speakerId: template.speakerId,
    listenerId: template.listenerId,
    pointedPersonId: template.pointedPersonId,
    personNames,
    familyGraph,
    assertion: template.assertion,
    query: template.query,
  };
}
