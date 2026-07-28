import { generationDelta } from "../foundation/family-analysis";
import { graphFromClues } from "../foundation/graph-closure";
import { relationLabel } from "../foundation/relation-ontology";
import type {
  BlrDistractorExplanation,
  BlrExplanationTrace,
  BlrGender,
  DirectRelationClue,
  FamilyGraph,
} from "../foundation/types";

interface EditorialOption {
  value: string;
  answerKey?: string;
  isCorrect: boolean;
  errorLabel?: string;
}

interface EditorialPrompt {
  clues: readonly DirectRelationClue[];
  personNames: Readonly<Record<string, string>>;
  query: Record<string, unknown>;
}

interface EditorialQuestion {
  seed: number;
  structuredPrompt: EditorialPrompt;
  options: readonly EditorialOption[];
  correctIndex: number;
  explanation: BlrExplanationTrace;
  metadata: Record<string, unknown>;
}

function lowerFirst(text: string): string {
  return text.length === 0 ? text : `${text[0]!.toLocaleLowerCase("en-IN")}${text.slice(1)}`;
}

function genderSymbol(gender: BlrGender): string {
  if (gender === "MALE") return "(+)";
  if (gender === "FEMALE") return "(-)";
  return "(?)";
}

function personLabel(
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  personId: string,
): string {
  const gender = graph.persons.find((person) => person.personId === personId)?.gender ?? "UNKNOWN";
  return `[${names[personId] ?? personId}] ${genderSymbol(gender)}`;
}

function clueClause(
  clue: DirectRelationClue,
  names: Readonly<Record<string, string>>,
): string {
  return `${names[clue.subjectId]} is the ${relationLabel(clue.relationId).toLocaleLowerCase("en-IN")} of ${names[clue.referenceId]}`;
}

function queryQuestion(prompt: EditorialPrompt): string {
  const query = prompt.query;
  const names = prompt.personNames;
  const kind = typeof query.kind === "string" ? query.kind : null;

  if (!kind) {
    return `How is ${names[String(query.subjectId)]} related to ${names[String(query.referenceId)]}?`;
  }
  if (kind === "IDENTIFY_PERSON_BY_RELATION") {
    return `Who is the ${relationLabel(String(query.relationId) as never).toLocaleLowerCase("en-IN")} of ${names[String(query.referenceId)]}?`;
  }
  if (kind === "IDENTIFY_ORDERED_PAIR") {
    return `Which ordered pair shows the first person as the ${relationLabel(String(query.relationId) as never).toLocaleLowerCase("en-IN")} of the second person?`;
  }
  if (kind === "SELECT_RELATION_CLAIM") {
    return `Which statement is ${query.targetTruth === "TRUE" ? "definitely true" : "false"}?`;
  }
  if (kind === "COMPARE_GENERATIONS") {
    return `What is ${names[String(query.subjectId)]}'s generation position relative to ${names[String(query.referenceId)]}?`;
  }
  if (kind === "SOLVE_BRANCHING_RELATION") {
    return `How is ${names[String(query.subjectId)]} related to ${names[String(query.referenceId)]}?`;
  }
  if (kind === "IDENTIFY_PERSON_BY_GENDER") {
    return `Who among the following is ${String(query.targetGender).toLocaleLowerCase("en-IN")}?`;
  }
  return `How is ${names[String(query.subjectId)]} exactly related to ${names[String(query.referenceId)]}?`;
}

export function buildExamAuthenticStem(
  prompt: EditorialPrompt,
  seed: number,
): string {
  const clauses = prompt.clues.map((clue) => clueClause(clue, prompt.personNames));
  const question = queryQuestion(prompt);

  if (clauses.length === 1) {
    return seed % 2 === 0
      ? `If ${clauses[0]}, ${lowerFirst(question)}`
      : `${clauses[0]}. ${question}`;
  }
  if (clauses.length === 2) {
    return seed % 2 === 0
      ? `${clauses[0]}, and ${clauses[1]}. ${question}`
      : `Given that ${clauses[0]} and ${clauses[1]}, ${lowerFirst(question)}`;
  }

  if (seed % 2 === 0) {
    return `${clauses.join(". ")}. ${question}`;
  }
  const finalClause = clauses.at(-1)!;
  return `In a family, ${clauses.slice(0, -1).join("; ")}; and ${finalClause}. ${question}`;
}

function answerKeyPersonIds(option: EditorialOption): {
  subjectId: string | null;
  referenceId: string | null;
} {
  const answerKey = option.answerKey ?? "";
  if (answerKey.startsWith("PAIR:")) {
    const [subjectId, referenceId] = answerKey.slice("PAIR:".length).split(">");
    return { subjectId: subjectId ?? null, referenceId: referenceId ?? null };
  }
  if (answerKey.startsWith("CLAIM:")) {
    const [subjectId, , referenceId] = answerKey.slice("CLAIM:".length).split(":");
    return { subjectId: subjectId ?? null, referenceId: referenceId ?? null };
  }
  if (answerKey.startsWith("PERSON:")) {
    return { subjectId: answerKey.slice("PERSON:".length), referenceId: null };
  }
  return { subjectId: null, referenceId: null };
}

function queryPeople(question: EditorialQuestion): {
  subjectId: string | null;
  referenceId: string | null;
} {
  const query = question.structuredPrompt.query;
  const kind = typeof query.kind === "string" ? query.kind : null;
  const correct = question.options[question.correctIndex]!;
  const parsed = answerKeyPersonIds(correct);

  if (!kind) {
    return {
      subjectId: String(query.subjectId),
      referenceId: String(query.referenceId),
    };
  }
  if (
    kind === "COMPARE_GENERATIONS" ||
    kind === "SOLVE_BRANCHING_RELATION" ||
    kind === "SOLVE_EXACT_LINEAGE_RELATION"
  ) {
    return {
      subjectId: String(query.subjectId),
      referenceId: String(query.referenceId),
    };
  }
  if (kind === "IDENTIFY_PERSON_BY_RELATION") {
    return {
      subjectId: parsed.subjectId,
      referenceId: String(query.referenceId),
    };
  }
  if (kind === "IDENTIFY_PERSON_BY_GENDER") {
    return { subjectId: parsed.subjectId, referenceId: parsed.subjectId };
  }
  return parsed;
}

function renderFamilyTreeGrid(
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  referenceId: string | null,
): string {
  const usableReference =
    referenceId && graph.persons.some((person) => person.personId === referenceId)
      ? referenceId
      : graph.persons[0]?.personId ?? null;
  if (!usableReference) return "No family members are available for the generation map.";

  const levels = new Map<number, string[]>();
  for (const person of graph.persons) {
    try {
      const delta = generationDelta(graph, person.personId, usableReference);
      const entries = levels.get(delta) ?? [];
      entries.push(personLabel(graph, names, person.personId));
      levels.set(delta, entries);
    } catch {
      // A disconnected person is omitted from this query-focused grid.
    }
  }

  const levelLines = [...levels.entries()]
    .sort(([left], [right]) => right - left)
    .map(([delta, people]) => {
      const level = delta > 0 ? `+${delta}` : `${delta}`;
      return `Generation ${level.padStart(2, " ")}: ${people.sort().join("   ")}`;
    });
  const connections: string[] = [];
  for (const edge of graph.parentEdges) {
    connections.push(
      `  ${personLabel(graph, names, edge.parentId)} --parent of--> ${personLabel(graph, names, edge.childId)}`,
    );
  }
  for (const edge of graph.spouseEdges) {
    connections.push(
      `  ${personLabel(graph, names, edge.personAId)} --spouse-- ${personLabel(graph, names, edge.personBId)}`,
    );
  }
  for (const edge of graph.siblingEdges) {
    connections.push(
      `  ${personLabel(graph, names, edge.personAId)} --sibling-- ${personLabel(graph, names, edge.personBId)}`,
    );
  }

  return [
    `Reference: ${personLabel(graph, names, usableReference)} = Generation 0`,
    ...levelLines,
    "Connections:",
    ...connections,
  ].join("\n");
}

function describeGeneration(
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  subjectId: string | null,
  referenceId: string | null,
): string[] {
  if (!subjectId || !referenceId || subjectId === referenceId) return [];
  try {
    const delta = generationDelta(graph, subjectId, referenceId);
    const sign = delta > 0 ? `+${delta}` : `${delta}`;
    const position =
      delta > 0
        ? `${delta} generation${delta === 1 ? "" : "s"} above`
        : delta < 0
          ? `${Math.abs(delta)} generation${delta === -1 ? "" : "s"} below`
          : "in the same generation as";
    const subject = graph.persons.find((person) => person.personId === subjectId);
    return [
      `Take ${names[referenceId]} as Generation 0.`,
      `${names[subjectId]} is ${position} ${names[referenceId]} (ΔGen = ${sign}).`,
      `${names[subjectId]} is marked ${genderSymbol(subject?.gender ?? "UNKNOWN")} in the family grid.`,
    ];
  } catch {
    return ["Use the displayed links to compare only the connected family members required by the query."];
  }
}

function coreConceptFor(query: Record<string, unknown>): string[] {
  const kind = typeof query.kind === "string" ? query.kind : null;
  const base = [
    "Gender notation: (+) means male, (-) means female and (?) means not required or not established.",
    "Generation mapping: parent = +1, sibling or spouse = 0 and child = -1 relative to the reference person.",
  ];
  if (kind === "IDENTIFY_ORDERED_PAIR") {
    return [...base, "For an ordered pair (X, Y), read X's relation to Y in the stated direction."];
  }
  if (kind === "SELECT_RELATION_CLAIM") {
    return [...base, "Test every statement against the completed graph; familiar names do not make a claim true."];
  }
  if (kind === "COMPARE_GENERATIONS") {
    return [...base, "Count only parent-child moves; sibling and spouse links do not change generation."];
  }
  if (kind === "IDENTIFY_PERSON_BY_GENDER") {
    return [...base, "Infer gender only from relation words such as son, daughter, husband, wife, brother and sister."];
  }
  if (kind === "SOLVE_EXACT_LINEAGE_RELATION") {
    return [
      ...base,
      "Lineage rule: a path through the reference person's mother is maternal; a path through the father is paternal.",
    ];
  }
  return [...base, "Always trace the relation from the queried subject to the reference person, not in reverse."];
}

function shortcutFor(question: EditorialQuestion): string {
  const query = question.structuredPrompt.query;
  const kind = typeof query.kind === "string" ? query.kind : null;
  const correct = question.options[question.correctIndex]!.value.toLocaleLowerCase("en-IN");

  const exactShortcuts: Readonly<Record<string, string>> = {
    "maternal grandmother": "Mother's mother = maternal grandmother.",
    "maternal grandfather": "Mother's father = maternal grandfather.",
    "paternal grandmother": "Father's mother = paternal grandmother.",
    "paternal grandfather": "Father's father = paternal grandfather.",
    "maternal uncle": "Mother's brother = maternal uncle.",
    "maternal aunt": "Mother's sister = maternal aunt.",
    "paternal uncle": "Father's brother = paternal uncle.",
    "paternal aunt": "Father's sister = paternal aunt.",
  };
  if (exactShortcuts[correct]) return exactShortcuts[correct]!;
  if (kind === "COMPARE_GENERATIONS") {
    return "Count upward parent moves as +1 and downward child moves as -1; ignore sibling/spouse links for generation arithmetic.";
  }
  if (kind === "IDENTIFY_ORDERED_PAIR") {
    return "Read the option left to right: first person's relation to second person.";
  }
  if (kind === "SELECT_RELATION_CLAIM") {
    return "Check direction, generation and gender in that order before accepting a statement.";
  }
  if (kind === "IDENTIFY_PERSON_BY_GENDER") {
    return "Use the relation word, never the person's name, to mark (+) or (-).";
  }
  if (kind === "IDENTIFY_PERSON_BY_RELATION") {
    return "Convert the requested relation into a short path pattern, then test each named person.";
  }
  return `Trace the shortest valid path and match both generation and gender before choosing ${correct}.`;
}

function warningFor(errorLabel: string, optionValue: string): string {
  const warnings: Readonly<Record<string, string>> = {
    REVERSED_QUERY_DIRECTION:
      "This follows the same people in the opposite direction, which changes the relation.",
    WRONG_GENDER:
      "This has the right family position but assigns the wrong male/female relation title.",
    WRONG_RELATIVE_GENDER:
      "This keeps the branch but changes the queried relative from male to female or vice versa.",
    MATERNAL_PATERNAL_SWAP:
      "This selects the opposite family side; check whether the connecting parent is the mother or father.",
    NEARBY_KINSHIP_CONFUSION:
      "This is a nearby relation, but its generation or branch does not match the completed path.",
    RELATION_FAMILY_MISMATCH:
      "This relation belongs to a different family pattern from the one established by the clues.",
    WRONG_FAMILY_MEMBER:
      "This person appears in the family but does not have the requested relation to the reference person.",
    PAIR_HAS_DIFFERENT_RELATION:
      "This ordered pair is valid family data, but the first person does not have the requested relation to the second.",
    CLAIM_NOT_ENTAILED:
      "The displayed graph does not prove this statement in the stated direction.",
    CLAIM_IS_TRUE:
      "This statement is actually true, so it cannot answer a question asking for the false statement.",
    SAME_GENERATION_CONFUSION:
      "This treats the two people as peers even though the parent-child moves place them at different levels.",
    GENERATION_DIRECTION_REVERSED:
      "This reverses above and below relative to the named reference person.",
    GENERATION_OFF_BY_ONE:
      "This counts one parent-child move too many or too few.",
    OPPOSITE_GENDER:
      "The relation words establish this candidate as the opposite gender from the one requested.",
    WRONG_GENERATION_OR_BRANCH:
      "This changes the broad kinship family or generation instead of only resolving the required lineage side.",
    WRONG_OPTION:
      "This option does not satisfy the complete direction, generation, gender and branch conditions.",
  };
  return `${optionValue}: ${warnings[errorLabel] ?? warnings.WRONG_OPTION}`;
}

function distractorAnalysis(options: readonly EditorialOption[]): BlrDistractorExplanation[] {
  return options
    .filter((option) => !option.isCorrect)
    .map((option) => ({
      optionValue: option.value,
      errorLabel: option.errorLabel ?? "WRONG_OPTION",
      studentWarning: warningFor(option.errorLabel ?? "WRONG_OPTION", option.value),
    }));
}

function uniqueSteps(values: readonly string[]): string[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function upgradeCp001Question<T>(question: T): T {
  const source = question as unknown as EditorialQuestion;
  const prompt = source.structuredPrompt;
  const graph = graphFromClues(prompt.clues, prompt.personNames);
  const people = queryPeople(source);
  const generationAnalysis = describeGeneration(
    graph,
    prompt.personNames,
    people.subjectId,
    people.referenceId,
  );
  const queryPath = uniqueSteps([
    ...(generationAnalysis.length > 0
      ? generationAnalysis
      : ["Mark each person on the generation grid before evaluating the options."]),
    ...source.explanation.queryPath,
  ]);

  return {
    ...source,
    stem: buildExamAuthenticStem(prompt, source.seed),
    explanation: {
      ...source.explanation,
      coreConcept: coreConceptFor(prompt.query),
      familyTreeGrid: renderFamilyTreeGrid(graph, prompt.personNames, people.referenceId),
      generationAnalysis,
      queryPath,
      examShortcut: shortcutFor(source),
      distractorAnalysis: distractorAnalysis(source.options),
    },
  } as unknown as T;
}
