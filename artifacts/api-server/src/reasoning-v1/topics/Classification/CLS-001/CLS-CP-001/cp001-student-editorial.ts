import {
  CLASS_BY_ID,
  ENTITY_BY_LABEL,
} from "./semantic-dataset.en";
import type {
  Explanation,
  GeneratedClassificationQuestion,
  PrototypeFamily,
  SemanticClass,
  SemanticEntity,
} from "./types";

const PREDICATE_BY_CLASS_ID: Readonly<Record<string, string>> = {
  CLS_FRUITS: "a fruit",
  CLS_CITRUS_FRUITS: "a citrus fruit",
  CLS_TROPICAL_FRUITS: "a tropical fruit",
  CLS_VEGETABLES: "a vegetable",
  CLS_CEREALS: "a cereal grain",
  CLS_SPICES: "a spice",
  CLS_FLOWERS: "a flower",
  CLS_TREES: "a tree",
  CLS_BIRDS: "a bird",
  CLS_MAMMALS: "a mammal",
  CLS_AQUATIC_ANIMALS: "an animal that lives mainly in or around water",
  CLS_FLYING_ANIMALS: "an animal that can fly",
  CLS_RIVERS: "a river",
  CLS_MOUNTAIN_RANGES: "a mountain range",
  CLS_MUSICAL_INSTRUMENTS: "a musical instrument",
  CLS_SPORTS_EQUIPMENT: "used as sports equipment",
  CLS_WRITING_TOOLS: "a writing tool",
  CLS_CUTTING_TOOLS: "a cutting tool",
  CLS_MEASURING_INSTRUMENTS: "a measuring instrument",
  CLS_COOKING_TOOLS: "a cooking tool",
  CLS_TREE_PARTS: "part of a tree",
  CLS_SHIP_PARTS: "part of a ship",
  CLS_COMPUTER_PARTS: "a computer component",
  CLS_CIRCLE_COMPONENTS: "an element of a circle",
};

function naturalList(labels: readonly string[]): string {
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0]!;
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")} and ${labels.at(-1)}`;
}

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function chooseStem(templates: readonly string[], seed: number, salt: string): string {
  return templates[hashText(`${salt}:${seed}`) % templates.length]!;
}

function entityForLabel(label: string): SemanticEntity {
  const entity = ENTITY_BY_LABEL.get(label.trim().toLocaleLowerCase("en-IN"));
  if (!entity) throw new Error(`Unknown displayed semantic entity: ${label}`);
  return entity;
}

function requireClass(classId: string): SemanticClass {
  const semanticClass = CLASS_BY_ID.get(classId);
  if (!semanticClass) throw new Error(`Unknown semantic class: ${classId}`);
  return semanticClass;
}

function bestAlternativeClass(entity: SemanticEntity, intendedClassId: string): SemanticClass | null {
  const candidates = [...new Set([...entity.directClassIds, ...entity.classIds])]
    .filter((classId) => classId !== intendedClassId)
    .map((classId) => CLASS_BY_ID.get(classId))
    .filter((value): value is SemanticClass => Boolean(value))
    .filter((semanticClass) => semanticClass.qualityRank >= 90)
    .sort((left, right) =>
      right.qualityRank - left.qualityRank
      || right.hierarchyDepth - left.hierarchyDepth
      || left.classId.localeCompare(right.classId),
    );
  return candidates[0] ?? null;
}

function membershipSentence(entity: SemanticEntity, semanticClass: SemanticClass | null): string {
  if (!semanticClass) return `${entity.label} does not belong to that group.`;
  const predicate = PREDICATE_BY_CLASS_ID[semanticClass.classId];
  return predicate
    ? `${entity.label} is ${predicate}.`
    : `${entity.label} belongs to a different category: ${semanticClass.label}.`;
}

function quickMethod(family: PrototypeFamily, task: GeneratedClassificationQuestion["task"]): string {
  if (task === "SELECT_COHERENT_GROUP") {
    return "Check one option at a time. All three words must belong to the same group.";
  }
  if (task === "SELECT_CLASS_MEMBER") {
    return "Name the group first. Then choose the option that truly belongs to it.";
  }
  if (family === "PART_WHOLE") {
    return "Name the whole that each item belongs to. The item linked to a different whole is the answer.";
  }
  if (family === "FUNCTIONAL_USE") {
    return "Say the main use of each item. The item with a different use is the answer.";
  }
  if (family === "HIERARCHY_CATEGORY") {
    return "Find the smallest clear group that contains most items. The item outside it is the answer.";
  }
  if (family === "CROSS_CUTTING_CATEGORY") {
    return "Find one fact that is true for most items. The item that does not fit is the answer.";
  }
  return "Name the group shared by most items. The item outside it is the answer.";
}

function simpleStem(question: GeneratedClassificationQuestion): string {
  if (question.task === "SELECT_COHERENT_GROUP") {
    return chooseStem([
      "Which option has three words from the same group?",
      "Choose the option in which all three words belong together.",
      "In which option do all three words belong to one group?",
      "Find the option whose three words form one clear group.",
      "Which set of three words belongs together?",
    ], question.seed, "coherent-group");
  }

  if (question.task === "SELECT_CLASS_MEMBER") {
    const group = naturalList(question.givens);
    return chooseStem([
      `${group} belong to one group. Which option belongs to the same group?`,
      `Which option can be placed with ${group}?`,
      `Choose another item from the same group as ${group}.`,
      `Which option belongs with ${group}?`,
      `Find the option from the same group as ${group}.`,
    ], question.seed, "class-member");
  }

  return chooseStem([
    "Which item is different from the others?",
    "Choose the item that does not belong with the others.",
    "Find the odd one out.",
    "Which option does not fit the group?",
    "Select the item that is different from the rest.",
  ], question.seed, "semantic-outlier");
}

function directTrap(
  question: GeneratedClassificationQuestion,
  answer: SemanticEntity | null,
  alternativeClass: SemanticClass | null,
): string {
  if (
    question.intendedClassId === "CLS_TREE_PARTS"
    && alternativeClass?.classId === "CLS_SHIP_PARTS"
    && answer
  ) {
    return `${answer.label} may be made of wood, but it is a ship part, not a part of a tree.`;
  }
  if (question.family === "PART_WHOLE") {
    return "Do not group items only by material or shape; check which larger thing they belong to.";
  }
  if (question.family === "FUNCTIONAL_USE") {
    return "Do not count every possible use; use the main use of each item.";
  }
  if (
    question.family === "HIERARCHY_CATEGORY"
    || question.generationProfile === "HIERARCHY_CLASS_MEMBER"
  ) {
    return "Do not stop at a broad group that includes all the options; use the smaller clear group.";
  }
  if (question.family === "CROSS_CUTTING_CATEGORY") {
    return "Do not let one overlapping trait create a second answer; use the link that clearly joins most options.";
  }
  return "Do not choose by a loose similarity such as colour, size or place.";
}

type NearMiss = {
  readonly optionIndex: number;
  readonly matchingLabels: readonly [string, string];
  readonly outsiderLabel: string;
  readonly semanticClass: SemanticClass;
};

function bestNearMiss(question: GeneratedClassificationQuestion): NearMiss | null {
  let best: NearMiss | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const [optionIndex, group] of question.optionGroups.entries()) {
    if (optionIndex === question.correctIndex || group.length !== 3) continue;
    const entities = group.map(entityForLabel);
    const pairs: readonly (readonly [number, number, number])[] = [
      [0, 1, 2],
      [0, 2, 1],
      [1, 2, 0],
    ];

    for (const [leftIndex, rightIndex, outsiderIndex] of pairs) {
      const left = entities[leftIndex]!;
      const right = entities[rightIndex]!;
      const outsider = entities[outsiderIndex]!;
      const shared = left.classIds
        .filter((classId) => right.classIds.includes(classId) && !outsider.classIds.includes(classId))
        .map((classId) => CLASS_BY_ID.get(classId))
        .filter((value): value is SemanticClass => Boolean(value))
        .filter((semanticClass) => semanticClass.qualityRank >= 90)
        .sort((leftClass, rightClass) =>
          rightClass.qualityRank - leftClass.qualityRank
          || rightClass.hierarchyDepth - leftClass.hierarchyDepth,
        )[0];
      if (!shared) continue;

      const score = shared.qualityRank * 10 + shared.hierarchyDepth;
      if (score <= bestScore) continue;
      bestScore = score;
      best = {
        optionIndex,
        matchingLabels: [left.label, right.label],
        outsiderLabel: outsider.label,
        semanticClass: shared,
      };
    }
  }
  return best;
}

function coherentGroupExplanation(question: GeneratedClassificationQuestion): Explanation {
  const semanticClass = requireClass(question.intendedClassId);
  const correctGroup = question.optionGroups[question.correctIndex]!;
  const optionLetter = String.fromCharCode(65 + question.correctIndex);
  const nearMiss = bestNearMiss(question);

  return {
    coreRule: [
      `Choose the option in which all three words belong to one clear group: ${semanticClass.label}.`,
    ],
    optionChecks: [
      `${naturalList(correctGroup)} are all ${semanticClass.label}.`,
      "Every other option contains at least one word from a different group.",
      `Therefore, option ${optionLetter} (${question.answer}) is correct.`,
    ],
    examSpeedShortcut: [quickMethod(question.family, question.task)],
    commonTraps: [
      nearMiss
        ? `Do not choose option ${String.fromCharCode(65 + nearMiss.optionIndex)} just because ${naturalList(nearMiss.matchingLabels)} are ${nearMiss.semanticClass.label}; ${nearMiss.outsiderLabel} breaks that group.`
        : "Do not choose a group just because two words match; all three must belong together.",
    ],
  };
}

function classMemberExplanation(question: GeneratedClassificationQuestion): Explanation {
  const semanticClass = requireClass(question.intendedClassId);
  const answer = entityForLabel(question.answer);
  const premise = naturalList(question.givens);

  return {
    coreRule: [
      `The given words form the group ${semanticClass.label}; choose another true member of the same group.`,
    ],
    optionChecks: [
      `${premise} are ${semanticClass.label}.`,
      `${answer.label} also belongs to this group; the other options do not.`,
      `Therefore, ${answer.label} is the correct answer.`,
    ],
    examSpeedShortcut: [quickMethod(question.family, question.task)],
    commonTraps: [directTrap(question, answer, bestAlternativeClass(answer, semanticClass.classId))],
  };
}

function outlierExplanation(question: GeneratedClassificationQuestion): Explanation {
  const semanticClass = requireClass(question.intendedClassId);
  const answer = entityForLabel(question.answer);
  const matching = question.options.filter((_, index) => index !== question.correctIndex);
  const alternativeClass = bestAlternativeClass(answer, semanticClass.classId);

  return {
    coreRule: [
      `Most options are ${semanticClass.label}; one item belongs to a different group.`,
    ],
    optionChecks: [
      `${naturalList(matching)} are ${semanticClass.label}.`,
      membershipSentence(answer, alternativeClass),
      `Therefore, ${answer.label} is the odd one out.`,
    ],
    examSpeedShortcut: [quickMethod(question.family, question.task)],
    commonTraps: [directTrap(question, answer, alternativeClass)],
  };
}

export function simplifyClsCp001EnglishQuestion<T extends GeneratedClassificationQuestion>(question: T): T {
  const explanation = question.task === "SELECT_COHERENT_GROUP"
    ? coherentGroupExplanation(question)
    : question.task === "SELECT_CLASS_MEMBER"
      ? classMemberExplanation(question)
      : outlierExplanation(question);

  return {
    ...question,
    stem: simpleStem(question),
    explanation,
  } as T;
}
