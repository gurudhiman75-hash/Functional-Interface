import { generationDelta } from "../foundation/family-analysis";
import { solveRelationFromGraph } from "../foundation/graph-closure";
import { SeededRandom, stableHash } from "../foundation/prng";
import { relationLabel } from "../foundation/relation-ontology";
import type { BlrDifficulty, BlrGender, FamilyGraph } from "../foundation/types";
import {
  allBlrCp002CanonicalScenarios,
  cp002CanonicalScenariosFor,
} from "./cp002-canonical-scenario-registry";
import { getBlrCp002PrototypeContract } from "./cp002-contracts";
import { buildBlrCp002Distractors } from "./cp002-distractor-builder";
import {
  cp002AnswerLabel,
  cp002AssertionOnlyConstraintCount,
  cp002NegativeConstraintCount,
  cp002OnlyConstraintCount,
  cp002RoleDepth,
  resolveBlrCp002Expression,
  solveBlrCp002Prompt,
} from "./cp002-role-solver";
import {
  buildCp002StructuredPrompt,
  type BlrCp002ScenarioTemplate,
} from "./cp002-scenario-library";
import type {
  BlrCp002AnswerId,
  BlrCp002PrototypeId,
  BlrCp002QuestionForm,
  BlrCp002StructuredPrompt,
  BlrEntityExpression,
  BlrRoleAssertion,
  BlrRoleCardinalityConstraint,
  GeneratedBlrCp002Option,
  GeneratedBlrCp002PrototypeQuestion,
} from "./cp002-types";

function personGender(prompt: BlrCp002StructuredPrompt, personId: string): BlrGender {
  return prompt.familyGraph.persons.find((person) => person.personId === personId)?.gender ?? "UNKNOWN";
}

function subjectPronoun(gender: BlrGender): string {
  if (gender === "MALE") return "He";
  if (gender === "FEMALE") return "She";
  return "This person";
}

function possessivePronoun(gender: BlrGender): string {
  if (gender === "MALE") return "his";
  if (gender === "FEMALE") return "her";
  return "their";
}

function possessiveDeterminer(gender: BlrGender): string {
  if (gender === "MALE") return "His";
  if (gender === "FEMALE") return "Her";
  return "Their";
}

function objectPronoun(gender: BlrGender): string {
  if (gender === "MALE") return "him";
  if (gender === "FEMALE") return "her";
  return "that person";
}

function personNoun(gender: BlrGender): string {
  if (gender === "MALE") return "a man";
  if (gender === "FEMALE") return "a woman";
  return "a person";
}

function roleStepPhrase(
  relationId: Parameters<typeof relationLabel>[0],
  only: boolean,
): string {
  return `${only ? "only " : ""}${relationLabel(relationId).toLocaleLowerCase("en-IN")}`;
}

function negativeRolePhrase(
  relationId: BlrRoleCardinalityConstraint["relationId"],
): string {
  if (relationId === "SIBLING") return "brother or sister";
  if (relationId === "CHILD") return "son or daughter";
  if (relationId === "PARENT") return "father or mother";
  if (relationId === "SPOUSE") return "husband or wife";
  return relationLabel(relationId).toLocaleLowerCase("en-IN");
}

function roleChainPhrase(expression: Extract<BlrEntityExpression, { kind: "ROLE_CHAIN" }>): string {
  return expression.steps
    .map((step, index) => {
      const phrase = roleStepPhrase(step.relationId, step.quantifier === "ONLY");
      return index < expression.steps.length - 1 ? `${phrase}'s` : phrase;
    })
    .join(" ");
}

function expressionPhrase(
  prompt: BlrCp002StructuredPrompt,
  expression: BlrEntityExpression,
  mode: "SUBJECT" | "REFERENCE",
  sentenceStart = false,
): string {
  if (expression.kind === "ANCHOR") {
    if (expression.anchor === "SPEAKER") return mode === "SUBJECT" ? "I" : "me";
    if (expression.anchor === "LISTENER") return "you";
    const gender = personGender(prompt, prompt.pointedPersonId!);
    return mode === "SUBJECT" ? subjectPronoun(gender) : objectPronoun(gender);
  }

  const prefix =
    expression.anchor === "SPEAKER"
      ? "my"
      : expression.anchor === "LISTENER"
        ? "your"
        : possessivePronoun(personGender(prompt, prompt.pointedPersonId!));
  const phrase = `${prefix} ${roleChainPhrase(expression)}`;
  return sentenceStart ? phrase[0]!.toLocaleUpperCase("en-IN") + phrase.slice(1) : phrase;
}

function constraintSentence(
  prompt: BlrCp002StructuredPrompt,
  constraint: BlrRoleCardinalityConstraint,
): string {
  const subject = expressionPhrase(prompt, constraint.reference, "SUBJECT", true);
  const verb = subject === "I" || subject.toLocaleLowerCase("en-IN") === "you" ? "have" : "has";
  return `${subject} ${verb} no ${negativeRolePhrase(constraint.relationId)}.`;
}

function assertionSentence(
  prompt: BlrCp002StructuredPrompt,
  assertion: BlrRoleAssertion,
): string {
  const subject = expressionPhrase(prompt, assertion.subject, "SUBJECT", true);
  const reference = expressionPhrase(prompt, assertion.reference, "REFERENCE");
  if (assertion.relation.kind === "SAME_PERSON") return `${subject} is ${reference}.`;
  const relation = roleStepPhrase(
    assertion.relation.relationId,
    assertion.relation.quantifier === "ONLY",
  );
  return `${subject} is the ${relation} of ${reference}.`;
}

function anchorName(
  prompt: BlrCp002StructuredPrompt,
  anchor: "SPEAKER" | "LISTENER" | "POINTED_PERSON",
): string {
  const personId =
    anchor === "SPEAKER"
      ? prompt.speakerId
      : anchor === "LISTENER"
        ? prompt.listenerId!
        : prompt.pointedPersonId!;
  return prompt.personNames[personId] ?? personId;
}

function resolvedQuestionForm(prompt: BlrCp002StructuredPrompt): BlrCp002QuestionForm {
  return prompt.questionForm ?? "HOW_RELATED";
}

function queryExpressionLabel(
  prompt: BlrCp002StructuredPrompt,
  expression: BlrEntityExpression,
): string {
  if (expression.kind === "ANCHOR") {
    if (expression.anchor === "POINTED_PERSON") {
      if (prompt.presentation === "INTRODUCTION" || prompt.presentation === "STAGE") {
        return anchorName(prompt, "POINTED_PERSON");
      }
      return prompt.presentation === "PHOTOGRAPH"
        ? "the person in the photograph"
        : "the indicated person";
    }
    return anchorName(prompt, expression.anchor);
  }
  return `${anchorName(prompt, expression.anchor)}'s ${roleChainPhrase(expression)}`;
}

function ownershipOptionLabel(
  prompt: BlrCp002StructuredPrompt,
  answerId: BlrCp002AnswerId,
): string {
  const determiner = possessiveDeterminer(personGender(prompt, prompt.speakerId));
  if (answerId === "SELF") return `${determiner} own`;
  return `${determiner} ${cp002AnswerLabel(answerId).toLocaleLowerCase("en-IN")}'s`;
}

function renderedOptionLabel(
  prompt: BlrCp002StructuredPrompt,
  answerId: BlrCp002AnswerId,
): string {
  return resolvedQuestionForm(prompt) === "HOW_RELATED"
    ? cp002AnswerLabel(answerId)
    : ownershipOptionLabel(prompt, answerId);
}

function buildStem(prompt: BlrCp002StructuredPrompt): string {
  const speakerName = anchorName(prompt, "SPEAKER");
  const statement = [
    ...(prompt.constraints ?? []).map((constraint) =>
      constraintSentence(prompt, constraint),
    ),
    assertionSentence(prompt, prompt.assertion),
  ].join(" ");
  const questionForm = resolvedQuestionForm(prompt);
  const question =
    questionForm === "HOW_RELATED"
      ? `How is ${queryExpressionLabel(prompt, prompt.query.subject)} related to ${queryExpressionLabel(prompt, prompt.query.reference)}?`
      : questionForm === "WHOSE_PHOTOGRAPH"
        ? "Whose photograph was it?"
        : `At whose portrait was ${speakerName} looking?`;

  if (prompt.presentation === "CONVERSATION") {
    return `${speakerName} said to ${anchorName(prompt, "LISTENER")}, “${statement}” ${question}`;
  }

  const pointedGender = personGender(prompt, prompt.pointedPersonId!);
  if (questionForm === "WHOSE_PORTRAIT") {
    return `Looking at a portrait of ${personNoun(pointedGender)}, ${speakerName} said, “${statement}” ${question}`;
  }
  if (prompt.presentation === "PHOTOGRAPH") {
    return `Pointing to a photograph of ${personNoun(pointedGender)}, ${speakerName} said, “${statement}” ${question}`;
  }
  if (prompt.presentation === "POINTING") {
    return `Pointing to ${personNoun(pointedGender)}, ${speakerName} said, “${statement}” ${question}`;
  }
  if (prompt.presentation === "STAGE") {
    return `Showing ${anchorName(prompt, "POINTED_PERSON")} on the stage, ${speakerName} said, “${statement}” ${question}`;
  }
  if (prompt.pointedPersonId === prompt.speakerId) {
    return `Showing a photograph of ${personNoun(pointedGender)}, ${speakerName} said, “${statement}” ${question}`;
  }
  return `Introducing ${anchorName(prompt, "POINTED_PERSON")}, ${speakerName} said, “${statement}” ${question}`;
}

function difficultyFor(
  prototypeId: BlrCp002PrototypeId,
  roleDepth: number,
  onlyCount: number,
  negativeCount: number,
  seed: number,
): BlrDifficulty {
  if (prototypeId === "BLR-CP002-PROT-SELF-IDENTITY") {
    return seed % 4 === 0 || negativeCount > 0 ? "MEDIUM" : "EASY";
  }
  const score =
    roleDepth +
    onlyCount +
    negativeCount +
    (prototypeId.includes("CONVERSATION") ? 2 : 0);
  if (score <= 3) return "EASY";
  if (score <= 6) return seed % 5 === 0 ? "HARD" : "MEDIUM";
  return "HARD";
}

function reverseAnswer(
  prompt: BlrCp002StructuredPrompt,
  subjectId: string,
  referenceId: string,
): BlrCp002AnswerId | null {
  if (subjectId === referenceId) return "SELF";
  try {
    return solveRelationFromGraph(prompt.familyGraph, referenceId, subjectId).relationId;
  } catch {
    return null;
  }
}

function genderMark(gender: BlrGender): string {
  return gender === "MALE" ? "+" : gender === "FEMALE" ? "-" : "?";
}

function familyTreeGrid(
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  referenceId: string,
): string {
  const rows = new Map<number, string[]>();
  for (const person of graph.persons) {
    let delta = 0;
    try {
      delta = generationDelta(graph, person.personId, referenceId);
    } catch {
      continue;
    }
    const entries = rows.get(delta) ?? [];
    entries.push(`[${names[person.personId] ?? person.name}] (${genderMark(person.gender)})`);
    rows.set(delta, entries);
  }
  const lines = [...rows.entries()]
    .sort(([first], [second]) => second - first)
    .map(
      ([delta, entries]) =>
        `Generation ${delta >= 0 ? "+" : ""}${delta}: ${entries.sort().join("   ")}`,
    );
  const connections = [
    ...graph.parentEdges.map(
      (edge) => `  [${names[edge.parentId]}] --parent of--> [${names[edge.childId]}]`,
    ),
    ...graph.spouseEdges.map(
      (edge) => `  [${names[edge.personAId]}] --spouse of-- [${names[edge.personBId]}]`,
    ),
    ...graph.siblingEdges.map(
      (edge) => `  [${names[edge.personAId]}] --sibling of-- [${names[edge.personBId]}]`,
    ),
  ];
  return [
    `Reference: [${names[referenceId]}] = Generation 0`,
    ...lines,
    "Connections:",
    ...connections,
  ].join("\n");
}

function distractorWarning(errorLabel: string): string {
  if (errorLabel === "REVERSED_QUERY_DIRECTION") {
    return "This reads the relationship in the opposite direction from the question.";
  }
  if (errorLabel === "WRONG_GENDER") {
    return "The generation may be close, but the gendered relation does not match the resolved person.";
  }
  if (errorLabel === "IGNORED_SELF_IDENTITY_COLLAPSE") {
    return "This ignores that the full role chain returns to the speaker herself or himself.";
  }
  return "This stops at a nearby role instead of completing every possessive step.";
}

function ownershipConclusion(
  prompt: BlrCp002StructuredPrompt,
  answerId: BlrCp002AnswerId,
): string {
  const item = resolvedQuestionForm(prompt) === "WHOSE_PORTRAIT" ? "portrait" : "photograph";
  if (answerId === "SELF") return `Therefore, the ${item} is the speaker's own.`;
  return `Therefore, the ${item} is of the speaker's ${cp002AnswerLabel(answerId).toLocaleLowerCase("en-IN")}.`;
}

function explanationFor(
  prompt: BlrCp002StructuredPrompt,
  solution: ReturnType<typeof solveBlrCp002Prompt>,
  options: readonly GeneratedBlrCp002Option[],
): GeneratedBlrCp002PrototypeQuestion["explanation"] {
  const assertionSubject = resolveBlrCp002Expression(prompt, prompt.assertion.subject);
  const assertionReference = resolveBlrCp002Expression(prompt, prompt.assertion.reference);
  const subjectName = prompt.personNames[solution.querySubjectId] ?? solution.querySubjectId;
  const referenceName = prompt.personNames[solution.queryReferenceId] ?? solution.queryReferenceId;
  const pathNames = solution.pathPersonIds.map((id) => prompt.personNames[id] ?? id);
  const delta =
    solution.answerId === "SELF"
      ? 0
      : generationDelta(prompt.familyGraph, solution.querySubjectId, solution.queryReferenceId);
  const normalizedAssertion =
    prompt.assertion.relation.kind === "SAME_PERSON"
      ? `${prompt.personNames[assertionSubject.resolvedPersonId]} and ${prompt.personNames[assertionReference.resolvedPersonId]} are the same resolved person.`
      : `${prompt.personNames[assertionSubject.resolvedPersonId]} is the ${relationLabel(prompt.assertion.relation.relationId).toLocaleLowerCase("en-IN")} of ${prompt.personNames[assertionReference.resolvedPersonId]}.`;
  const questionForm = resolvedQuestionForm(prompt);

  return {
    ruleStatement:
      "Replace my, your, his and her with explicit people first. Validate every only or no-relation condition, then reduce the nested role chain from left to right and read the final query in the requested direction.",
    coreConcept: [
      `my = ${anchorName(prompt, "SPEAKER")}`,
      ...(prompt.listenerId ? [`your = ${anchorName(prompt, "LISTENER")}`] : []),
      ...(prompt.pointedPersonId
        ? [`indicated person = ${anchorName(prompt, "POINTED_PERSON")}`]
        : []),
      "An 'only' role must have exactly one matching person in the active family scope.",
      ...((prompt.constraints ?? []).length > 0
        ? ["A 'no brother or sister' condition means the complete sibling set must contain zero people."]
        : []),
      ...(questionForm !== "HOW_RELATED"
        ? ["A possessive option such as 'His son's' means that the pictured person is the speaker's son."]
        : []),
    ],
    normalizedClues: [
      ...solution.constraintTrace,
      normalizedAssertion,
      ...assertionSubject.trace,
      ...assertionReference.trace,
    ],
    familyTreeGrid: familyTreeGrid(
      prompt.familyGraph,
      prompt.personNames,
      solution.queryReferenceId,
    ),
    generationAnalysis: [
      `${subjectName} is at generation ${delta >= 0 ? "+" : ""}${delta} relative to ${referenceName}.`,
      `ΔGen = ${delta >= 0 ? "+" : ""}${delta}.`,
    ],
    queryPath: [
      ...solution.subjectExpression.trace,
      ...solution.referenceExpression.trace,
      solution.answerId === "SELF"
        ? `${subjectName} and ${referenceName} resolve to the same person.`
        : pathNames.join(" → "),
    ],
    conclusion:
      questionForm === "HOW_RELATED"
        ? solution.answerId === "SELF"
          ? "Therefore, the described person is the speaker herself or himself."
          : `Therefore, ${subjectName} is the ${cp002AnswerLabel(solution.answerId).toLocaleLowerCase("en-IN")} of ${referenceName}.`
        : ownershipConclusion(prompt, solution.answerId),
    examShortcut:
      questionForm === "HOW_RELATED"
        ? "Write S for speaker, L for listener and P for the pointed person. Mark no-sibling facts before moving through one possessive role at a time; never reverse the final question."
        : "Resolve the pictured person relative to the speaker, then convert the result into the possessive option form: son becomes 'His/Her son's' and Self becomes 'His/Her own'.",
    closestTrapRejection:
      solution.answerId === "SELF"
        ? "Do not force a family label after the chain has returned to the speaker."
        : "The nearest wrong answer usually comes from ignoring a cardinality fact, reversing the endpoint order or stopping one role early.",
    distractorAnalysis: options
      .filter((option) => !option.isCorrect)
      .map((option) => ({
        optionValue: option.value,
        errorLabel: option.errorLabel!,
        studentWarning: distractorWarning(option.errorLabel!),
      })),
  };
}

function scenarioConstraints(
  template: BlrCp002ScenarioTemplate,
): readonly BlrRoleCardinalityConstraint[] {
  return (
    template as BlrCp002ScenarioTemplate & {
      constraints?: readonly BlrRoleCardinalityConstraint[];
    }
  ).constraints ?? [];
}

function scenarioQuestionForm(
  template: BlrCp002ScenarioTemplate,
): BlrCp002QuestionForm {
  return (
    template as BlrCp002ScenarioTemplate & {
      questionForm?: BlrCp002QuestionForm;
    }
  ).questionForm ?? "HOW_RELATED";
}

function validateQuestionForm(prompt: BlrCp002StructuredPrompt): void {
  if (resolvedQuestionForm(prompt) === "HOW_RELATED") return;
  if (
    prompt.query.subject.kind !== "ANCHOR" ||
    prompt.query.subject.anchor !== "POINTED_PERSON" ||
    prompt.query.reference.kind !== "ANCHOR" ||
    prompt.query.reference.anchor !== "SPEAKER"
  ) {
    throw new Error(
      "Whose photograph/portrait questions must ask for the pointed person relative to the speaker.",
    );
  }
  if (prompt.presentation !== "PHOTOGRAPH") {
    throw new Error("Whose photograph/portrait questions require the photograph presentation.");
  }
}

function generateFromScenario(
  template: BlrCp002ScenarioTemplate,
  seed: number,
): GeneratedBlrCp002PrototypeQuestion {
  const prototypeId = template.prototypeId;
  const contract = getBlrCp002PrototypeContract(prototypeId);
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash([prototypeId, template.scenarioId]), 16),
  );
  const prompt: BlrCp002StructuredPrompt = {
    ...buildCp002StructuredPrompt(template, random),
    questionForm: scenarioQuestionForm(template),
    constraints: scenarioConstraints(template),
  };

  if (contract.requiresListener && !prompt.listenerId) {
    throw new Error(`${prototypeId} requires a listener anchor.`);
  }
  if (contract.requiresPointedPerson && !prompt.pointedPersonId) {
    throw new Error(`${prototypeId} requires a pointed-person anchor.`);
  }
  validateQuestionForm(prompt);

  const solution = solveBlrCp002Prompt(prompt);
  if (solution.answerId !== template.expectedAnswerId) {
    throw new Error(
      `${template.scenarioId} expected ${template.expectedAnswerId} but solver returned ${solution.answerId}.`,
    );
  }

  const assertionRoleDepth =
    cp002RoleDepth(prompt.assertion.subject) + cp002RoleDepth(prompt.assertion.reference);
  const queryRoleDepth =
    cp002RoleDepth(prompt.query.subject) + cp002RoleDepth(prompt.query.reference);
  const totalRoleDepth = assertionRoleDepth + queryRoleDepth;
  if (totalRoleDepth < contract.minimumRoleDepth) {
    throw new Error(`${template.scenarioId} violates the minimum role-depth contract.`);
  }

  const reverseAnswerId = reverseAnswer(
    prompt,
    solution.querySubjectId,
    solution.queryReferenceId,
  );
  const distractors = buildBlrCp002Distractors(solution.answerId, reverseAnswerId, random);
  const correctIndex = ((Math.trunc(seed) % 4) + 4) % 4;
  const options: GeneratedBlrCp002Option[] = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push({
        value: renderedOptionLabel(prompt, solution.answerId),
        answerId: solution.answerId,
        isCorrect: true,
      });
    } else {
      const distractor = distractors[distractorIndex++]!;
      options.push({
        value: renderedOptionLabel(prompt, distractor.answerId),
        answerId: distractor.answerId,
        isCorrect: false,
        errorLabel: distractor.errorLabel,
      });
    }
  }

  const onlyConstraintCount =
    cp002AssertionOnlyConstraintCount(prompt.assertion) +
    cp002OnlyConstraintCount(prompt.query.subject) +
    cp002OnlyConstraintCount(prompt.query.reference);
  const negativeConstraintCount = cp002NegativeConstraintCount(prompt);
  const questionForm = resolvedQuestionForm(prompt);

  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-002",
    prototypeId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    ruleId: "BLOOD_ROLE_CHAIN_RELATION",
    seed,
    locale: "en-IN",
    difficulty: difficultyFor(
      prototypeId,
      totalRoleDepth,
      onlyConstraintCount,
      negativeConstraintCount,
      seed,
    ),
    renderer: "DIALOGUE_STRUCTURED_TEXT",
    answerType: "RELATION_LABEL_OR_SELF",
    stem: buildStem(prompt),
    structuredPrompt: prompt,
    options,
    correctIndex,
    explanation: explanationFor(prompt, solution, options),
    metadata: {
      runtimeVersion: "blr-cp002-prototype-v1",
      scenarioId: template.scenarioId,
      hiddenFingerprint: stableHash([
        template.scenarioId,
        questionForm,
        JSON.stringify(prompt.constraints ?? []),
        JSON.stringify(prompt.assertion),
        JSON.stringify(prompt.query),
      ]),
      answerId: solution.answerId,
      presentation: prompt.presentation,
      questionForm,
      assertionRoleDepth,
      queryRoleDepth,
      onlyConstraintCount,
      negativeConstraintCount,
      pathLength: solution.pathLength,
      selfIdentity: solution.answerId === "SELF",
      familyGraphValid: true,
      constraintsVerified: true,
      assertionVerified: true,
      independentSolverAgreed: true,
      ambiguityAccepted: true,
      distractorErrorLabels: distractors.map((entry) => entry.errorLabel),
    },
  };
}

export function generateBlrCp002PrototypeQuestion(
  prototypeId: BlrCp002PrototypeId,
  seed = 0,
): GeneratedBlrCp002PrototypeQuestion {
  const selectionRandom = new SeededRandom(
    seed ^ Number.parseInt(stableHash([prototypeId, "canonical-scenario-selection"]), 16),
  );
  const template = selectionRandom.pick(cp002CanonicalScenariosFor(prototypeId));
  return generateFromScenario(template, seed);
}

export function generateBlrCp002ScenarioQuestion(
  scenarioId: string,
  seed = 0,
): GeneratedBlrCp002PrototypeQuestion {
  const template = allBlrCp002CanonicalScenarios().find(
    (scenario) => scenario.scenarioId === scenarioId,
  );
  if (!template) throw new Error(`Unknown canonical CP-002 scenario: ${scenarioId}.`);
  return generateFromScenario(template, seed);
}
