import type { BlrCp002ScenarioTemplate } from "./cp002-scenario-library";
import { cp002Anchor, cp002Chain, cp002Step } from "./cp002-scenario-library";

const speaker = cp002Anchor("SPEAKER");

export const BLR_CP002_BOTH_DERIVED_QUERY_SCENARIOS: readonly BlrCp002ScenarioTemplate[] = [
  {
    scenarioId: "CP002-BOTH-DERIVED-MY-MOTHER-TO-YOUR-FATHER",
    prototypeId: "BLR-CP002-PROT-TWO-SPEAKER-CONVERSATION",
    presentation: "CONVERSATION",
    sourcePattern: "TWO_SPEAKER",
    clues: [
      { subjectId: "M", relationId: "MOTHER", referenceId: "S" },
      { subjectId: "S", relationId: "DAUGHTER", referenceId: "M" },
      { subjectId: "U", relationId: "SON", referenceId: "M" },
      { subjectId: "F", relationId: "SON", referenceId: "M" },
      { subjectId: "U", relationId: "BROTHER", referenceId: "F" },
      { subjectId: "F", relationId: "FATHER", referenceId: "L" },
      { subjectId: "L", relationId: "SON", referenceId: "F" },
    ],
    speakerId: "S",
    listenerId: "L",
    assertion: {
      subject: cp002Chain(
        "LISTENER",
        cp002Step("FATHER"),
        cp002Step("BROTHER"),
      ),
      relation: { kind: "KINSHIP", relationId: "SON", quantifier: "ANY" },
      reference: cp002Chain("SPEAKER", cp002Step("MOTHER")),
    },
    query: {
      subject: cp002Chain("SPEAKER", cp002Step("MOTHER")),
      reference: cp002Chain("LISTENER", cp002Step("FATHER")),
    },
    expectedAnswerId: "MOTHER",
  },
  {
    scenarioId: "CP002-BOTH-DERIVED-MY-AUNT-TO-YOUR-FATHER",
    prototypeId: "BLR-CP002-PROT-TWO-SPEAKER-CONVERSATION",
    presentation: "CONVERSATION",
    sourcePattern: "TWO_SPEAKER",
    clues: [
      { subjectId: "SM", relationId: "MOTHER", referenceId: "S" },
      { subjectId: "S", relationId: "SON", referenceId: "SM" },
      { subjectId: "A", relationId: "SISTER", referenceId: "SM" },
      { subjectId: "LM", relationId: "MOTHER", referenceId: "L" },
      { subjectId: "LF", relationId: "HUSBAND", referenceId: "LM" },
      { subjectId: "LM", relationId: "WIFE", referenceId: "LF" },
      { subjectId: "LF", relationId: "FATHER", referenceId: "L" },
      { subjectId: "L", relationId: "DAUGHTER", referenceId: "LF" },
      { subjectId: "L", relationId: "DAUGHTER", referenceId: "LM" },
      { subjectId: "A", relationId: "SISTER", referenceId: "LF" },
    ],
    speakerId: "S",
    listenerId: "L",
    assertion: {
      subject: cp002Chain(
        "LISTENER",
        cp002Step("MOTHER"),
        cp002Step("HUSBAND"),
        cp002Step("SISTER"),
      ),
      relation: { kind: "KINSHIP", relationId: "AUNT", quantifier: "ANY" },
      reference: speaker,
    },
    query: {
      subject: cp002Chain("SPEAKER", cp002Step("AUNT")),
      reference: cp002Chain(
        "LISTENER",
        cp002Step("MOTHER"),
        cp002Step("HUSBAND"),
      ),
    },
    expectedAnswerId: "SISTER",
  },
  {
    scenarioId: "CP002-BOTH-DERIVED-SELF-COLLAPSE",
    prototypeId: "BLR-CP002-PROT-TWO-SPEAKER-CONVERSATION",
    presentation: "CONVERSATION",
    sourcePattern: "TWO_SPEAKER",
    clues: [
      { subjectId: "F", relationId: "FATHER", referenceId: "S" },
      { subjectId: "S", relationId: "SON", referenceId: "F" },
      { subjectId: "M", relationId: "MOTHER", referenceId: "S" },
      { subjectId: "S", relationId: "SON", referenceId: "M" },
      { subjectId: "L", relationId: "DAUGHTER", referenceId: "M" },
      { subjectId: "M", relationId: "MOTHER", referenceId: "L" },
    ],
    speakerId: "S",
    listenerId: "L",
    assertion: {
      subject: cp002Chain(
        "LISTENER",
        cp002Step("MOTHER"),
        cp002Step("SON", "ONLY"),
      ),
      relation: { kind: "SAME_PERSON" },
      reference: cp002Chain(
        "SPEAKER",
        cp002Step("FATHER"),
        cp002Step("SON", "ONLY"),
      ),
    },
    query: {
      subject: cp002Chain(
        "LISTENER",
        cp002Step("MOTHER"),
        cp002Step("SON", "ONLY"),
      ),
      reference: cp002Chain(
        "SPEAKER",
        cp002Step("FATHER"),
        cp002Step("SON", "ONLY"),
      ),
    },
    expectedAnswerId: "SELF",
  },
] as const;
