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

function addListenerContext(
  question: GeneratedBlrCp002PrototypeQuestion,
  stem: string,
): string {
  const { listenerId, pointedPersonId, presentation, personNames, speakerId } =
    question.structuredPrompt;
  if (!listenerId || !pointedPersonId) return stem;

  const speakerName = personNames[speakerId] ?? speakerId;
  const listenerName = personNames[listenerId] ?? listenerId;
  const pointedName = personNames[pointedPersonId] ?? pointedPersonId;

  if (presentation === "INTRODUCTION") {
    return stem.replace(
      `Introducing ${pointedName}, ${speakerName} said,`,
      `Introducing ${pointedName} to ${listenerName}, ${speakerName} said,`,
    );
  }
  return stem.replace(
    `${speakerName} said,`,
    `${speakerName} said to ${listenerName},`,
  );
}

function isPicturedSelf(question: GeneratedBlrCp002PrototypeQuestion): boolean {
  return (
    question.metadata.selfIdentity &&
    question.structuredPrompt.pointedPersonId !== undefined &&
    question.structuredPrompt.pointedPersonId === question.structuredPrompt.speakerId
  );
}

function upgradedStem(question: GeneratedBlrCp002PrototypeQuestion): string {
  const isOwnership = question.metadata.questionForm !== "HOW_RELATED";
  const picturedSelf = isPicturedSelf(question);
  if (isOwnership) return addListenerContext(question, question.stem);
  if (!picturedSelf) {
    return addListenerContext(question, naturalPhotoOpening(question.stem));
  }

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
  const picturedSelf = isPicturedSelf(question);
  const isOwnership = question.metadata.questionForm !== "HOW_RELATED";
  const hasOnly = question.metadata.onlyConstraintCount > 0;

  const coreConcept = [
    ...(question.explanation.coreConcept ?? []).filter(
      (line) => !line.startsWith("An 'only' role"),
    ),
    "Resolve every possessive role completely before evaluating the final relationship.",
    ...(hasOnly
      ? ["An 'only' role must resolve to exactly one matching person in the displayed family scope."]
      : []),
    ...(isSelf && isOwnership
      ? ["When the pictured person and the speaker are the same person, choose the possessive option 'His own', 'Her own' or 'Their own'."]
      : isSelf
        ? ["When both resolved endpoints are the same person, the correct answer is Self; do not force a kinship label."]
        : []),
  ];

  const queryPath = isSelf
    ? [
        ...question.explanation.queryPath.slice(0, -1),
        picturedSelf
          ? "The pictured person and the speaker resolve to the same identity."
          : "Both queried role chains resolve to the same identity.",
      ]
    : question.explanation.queryPath;

  const distractorAnalysis = question.explanation.distractorAnalysis?.map((entry) =>
    entry.errorLabel === "IGNORED_SELF_IDENTITY_COLLAPSE"
      ? {
          ...entry,
          studentWarning: picturedSelf
            ? `This ignores that the full role chain returns to the speaker ${reflexive}.`
            : "This ignores that the two independently resolved query endpoints are the same person.",
        }
      : entry,
  );

  return {
    ...question,
    stem: upgradedStem(question),
    structuredPrompt:
      picturedSelf && !isOwnership
        ? { ...question.structuredPrompt, presentation: "PHOTOGRAPH" }
        : question.structuredPrompt,
    explanation: {
      ...question.explanation,
      coreConcept,
      queryPath,
      conclusion:
        picturedSelf && !isOwnership
          ? `Therefore, the person in the photograph is the speaker ${reflexive}.`
          : isSelf && !isOwnership
            ? "Therefore, both queried role chains identify the same person; the answer is Self."
            : question.explanation.conclusion,
      closestTrapRejection:
        isSelf && isOwnership
          ? "Once the pictured person resolves to the speaker, every relative's possessive option is wrong; choose His/Her own."
          : picturedSelf
            ? "Once the complete chain returns to the speaker, any family-relation label is incorrect."
            : isSelf
              ? "Do not force a relation label after both derived query endpoints resolve to one identity."
              : question.explanation.closestTrapRejection,
      distractorAnalysis,
    },
    metadata:
      picturedSelf && !isOwnership
        ? { ...question.metadata, presentation: "PHOTOGRAPH" }
        : question.metadata,
  };
}
