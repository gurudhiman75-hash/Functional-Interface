import type { BlrGender } from "../foundation/types";
import type { GeneratedBlrCp002PrototypeQuestion } from "./cp002-types";

function speakerGender(question: GeneratedBlrCp002PrototypeQuestion): BlrGender {
  return (
    question.structuredPrompt.familyGraph.persons.find(
      (person) => person.personId === question.structuredPrompt.speakerId,
    )?.gender ?? "UNKNOWN"
  );
}

function reflexivePronoun(gender: BlrGender): string {
  if (gender === "FEMALE") return "herself";
  if (gender === "MALE") return "himself";
  return "themself";
}

function personNoun(gender: BlrGender): string {
  if (gender === "FEMALE") return "woman";
  if (gender === "MALE") return "man";
  return "person";
}

function quotedAssertion(stem: string): string {
  return stem.match(/“([^”]+)”/)?.[1] ?? "The described relation holds.";
}

function naturalPhotoOpening(stem: string): string {
  return stem
    .replace("Pointing to a photograph of a man,", "Pointing to a man in a photograph,")
    .replace("Pointing to a photograph of a woman,", "Pointing to a woman in a photograph,")
    .replace("Pointing to a photograph of a person,", "Pointing to a person in a photograph,");
}

function upgradedStem(question: GeneratedBlrCp002PrototypeQuestion): string {
  if (!question.metadata.selfIdentity) return naturalPhotoOpening(question.stem);

  const speakerName =
    question.structuredPrompt.personNames[question.structuredPrompt.speakerId] ??
    question.structuredPrompt.speakerId;
  const gender = speakerGender(question);
  return `Pointing to a ${personNoun(gender)} in a photograph, ${speakerName} said, “${quotedAssertion(question.stem)}” How is the person in the photograph related to ${speakerName}?`;
}

export function upgradeBlrCp002EditorialQuestion(
  question: GeneratedBlrCp002PrototypeQuestion,
): GeneratedBlrCp002PrototypeQuestion {
  const gender = speakerGender(question);
  const reflexive = reflexivePronoun(gender);
  const isSelf = question.metadata.selfIdentity;
  const hasOnly = question.metadata.onlyConstraintCount > 0;
  const speakerName =
    question.structuredPrompt.personNames[question.structuredPrompt.speakerId] ??
    question.structuredPrompt.speakerId;

  const coreConcept = [
    ...(question.explanation.coreConcept ?? []).filter(
      (line) => !line.startsWith("An 'only' role"),
    ),
    ...(hasOnly
      ? ["An 'only' role must resolve to exactly one matching person in the displayed family scope."]
      : []),
    ...(isSelf
      ? ["When both resolved endpoints are the same person, the correct answer is Self; do not force a kinship label."]
      : []),
  ];

  const queryPath = isSelf
    ? [
        ...question.explanation.queryPath.slice(0, -1),
        `The person in the photograph and ${speakerName} resolve to the same identity.`,
      ]
    : question.explanation.queryPath;

  const distractorAnalysis = question.explanation.distractorAnalysis?.map((entry) =>
    entry.errorLabel === "IGNORED_SELF_IDENTITY_COLLAPSE"
      ? {
          ...entry,
          studentWarning: `This ignores that the full role chain returns to the speaker ${reflexive}.`,
        }
      : entry,
  );

  return {
    ...question,
    stem: upgradedStem(question),
    structuredPrompt: isSelf
      ? { ...question.structuredPrompt, presentation: "PHOTOGRAPH" }
      : question.structuredPrompt,
    explanation: {
      ...question.explanation,
      coreConcept,
      queryPath,
      conclusion: isSelf
        ? `Therefore, the person in the photograph is the speaker ${reflexive}.`
        : question.explanation.conclusion,
      closestTrapRejection: isSelf
        ? "Once the complete chain returns to the speaker, any family-relation label is incorrect."
        : question.explanation.closestTrapRejection,
      distractorAnalysis,
    },
    metadata: isSelf
      ? { ...question.metadata, presentation: "PHOTOGRAPH" }
      : question.metadata,
  };
}
