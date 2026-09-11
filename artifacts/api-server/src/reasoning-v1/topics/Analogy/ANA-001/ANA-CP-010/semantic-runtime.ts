import {
  ANA_CP010_SEMANTIC_RELATIONS,
  type AnaCp010Locale,
  type AnaCp010SemanticFact,
  type AnaCp010SemanticRelation,
  type AnaCp010SemanticRelationId,
} from "./semantic-registry";
import { independentlyValidateAnaCp010SemanticPair } from "./semantic-solver";

export type AnaCp010SemanticDifficulty = "EASY" | "MEDIUM";
type SemanticOption = string | readonly [string, string];

export interface GeneratedAnaCp010Semantic {
  kind: "SEMANTIC";
  qlId: "ANA-QL-267" | "ANA-QL-268";
  relationId: AnaCp010SemanticRelationId;
  presentationMode: "MISSING_FOURTH_TERM" | "EQUIVALENT_PAIR_SELECTION";
  locale: AnaCp010Locale;
  difficulty: AnaCp010SemanticDifficulty;
  sourceFactId: string;
  targetFactId: string;
  sourceA: string;
  sourceB: string;
  targetA: string;
  targetB: string;
  stem: string;
  options: readonly { value: SemanticOption; errorLabel: string | null }[];
  correctIndex: number;
  explanation: readonly string[];
}

function randomSource(seed: number): () => number {
  let state = (seed ^ 0x165667b1) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], seed: number): T[] {
  const result = [...items];
  const random = randomSource(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function text(fact: AnaCp010SemanticFact, side: "left" | "right", locale: AnaCp010Locale): string {
  return fact[side][locale];
}

function chooseRelation(seed: number): AnaCp010SemanticRelation {
  return ANA_CP010_SEMANTIC_RELATIONS[Math.abs(seed) % ANA_CP010_SEMANTIC_RELATIONS.length];
}

function difficulty(relationId: AnaCp010SemanticRelationId, presentationMode: string): AnaCp010SemanticDifficulty {
  const mediumRelations = new Set<AnaCp010SemanticRelationId>([
    "SEM_CAUSE_EFFECT",
    "SEM_PROBLEM_REMEDY",
    "SEM_DISEASE_ORGAN",
    "SEM_AUTHOR_WORK",
  ]);
  return mediumRelations.has(relationId) || presentationMode === "EQUIVALENT_PAIR_SELECTION" ? "MEDIUM" : "EASY";
}

function localizedStem(
  locale: AnaCp010Locale,
  presentationMode: "MISSING_FOURTH_TERM" | "EQUIVALENT_PAIR_SELECTION",
  sourceA: string,
  sourceB: string,
  targetA: string,
): string {
  if (presentationMode === "MISSING_FOURTH_TERM") {
    if (locale === "hi-IN") return `उस विकल्प को चुनें जो तीसरे शब्द से उसी प्रकार संबंधित है जैसे दूसरा शब्द पहले शब्द से संबंधित है।\n${sourceA} : ${sourceB} :: ${targetA} : ?`;
    if (locale === "pa-IN") return `ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜੋ ਤੀਜੇ ਸ਼ਬਦ ਨਾਲ ਉਸੇ ਤਰ੍ਹਾਂ ਸੰਬੰਧਿਤ ਹੈ ਜਿਵੇਂ ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੇ ਸ਼ਬਦ ਨਾਲ ਹੈ।\n${sourceA} : ${sourceB} :: ${targetA} : ?`;
    return `Select the option that is related to the third term in the same way as the second term is related to the first.\n${sourceA} : ${sourceB} :: ${targetA} : ?`;
  }
  if (locale === "hi-IN") return `उस शब्द-युग्म को चुनें जिसमें वही संबंध है जो ${sourceA} : ${sourceB} में है।`;
  if (locale === "pa-IN") return `ਉਹ ਸ਼ਬਦ-ਜੋੜਾ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਉਹੀ ਸੰਬੰਧ ਹੈ ਜੋ ${sourceA} : ${sourceB} ਵਿੱਚ ਹੈ।`;
  return `Select the word pair that has the same relationship as ${sourceA} : ${sourceB}.`;
}

function localizedExplanation(
  locale: AnaCp010Locale,
  relation: AnaCp010SemanticRelation,
  sourceA: string,
  sourceB: string,
  targetA: string,
  targetB: string,
): readonly string[] {
  if (locale === "hi-IN") {
    return [
      `संबंध: ${relation.ruleStatement[locale]}`,
      `${sourceA} : ${sourceB} इसी संबंध को दिखाता है।`,
      `उसी संबंध से ${targetA} : ${targetB} मिलता है।`,
      `इसलिए सही उत्तर ${targetB} है।`,
    ];
  }
  if (locale === "pa-IN") {
    return [
      `ਸੰਬੰਧ: ${relation.ruleStatement[locale]}`,
      `${sourceA} : ${sourceB} ਇਹੀ ਸੰਬੰਧ ਦਿਖਾਉਂਦਾ ਹੈ।`,
      `ਇਹੀ ਸੰਬੰਧ ਲਗਾਉਣ ਤੇ ${targetA} : ${targetB} ਮਿਲਦਾ ਹੈ।`,
      `ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${targetB} ਹੈ।`,
    ];
  }
  return [
    `Relationship: ${relation.ruleStatement[locale]}`,
    `${sourceA} : ${sourceB} shows this relationship.`,
    `Applying the same relationship gives ${targetA} : ${targetB}.`,
    `Therefore, ${targetB} is the correct answer.`,
  ];
}

export function generateAnaCp010Semantic(
  qlId: "ANA-QL-267" | "ANA-QL-268",
  seed = 0,
  locale: AnaCp010Locale = "en-IN",
): GeneratedAnaCp010Semantic {
  const presentationMode = qlId === "ANA-QL-267" ? "MISSING_FOURTH_TERM" : "EQUIVALENT_PAIR_SELECTION";
  const relation = chooseRelation(seed);
  const facts = shuffle(relation.facts, seed * 29 + 7);
  const source = facts[0];
  const target = facts[1];
  const sourceA = text(source, "left", locale);
  const sourceB = text(source, "right", locale);
  const targetA = text(target, "left", locale);
  const targetB = text(target, "right", locale);

  let rawOptions: { value: SemanticOption; errorLabel: string | null }[];
  if (presentationMode === "MISSING_FOURTH_TERM") {
    rawOptions = [
      { value: targetB, errorLabel: null },
      ...facts.slice(2, 5).map((entry) => ({
        value: text(entry, "right", locale),
        errorLabel: "SAME_RELATION_CATEGORY_WRONG_TARGET",
      })),
    ];
  } else {
    const lefts = facts.slice(2, 5);
    const rights = [facts[3], facts[4], facts[5]];
    rawOptions = [
      { value: [targetA, targetB] as const, errorLabel: null },
      ...lefts.map((leftFact, index) => ({
        value: [text(leftFact, "left", locale), text(rights[index], "right", locale)] as const,
        errorLabel: "MISMATCHED_RELATION_PAIR",
      })),
    ];
  }

  const requestedIndex = ((seed + Number(qlId.slice(-3))) % 4 + 4) % 4;
  const shuffled = shuffle(rawOptions, seed * 31 + 11);
  const currentCorrect = shuffled.findIndex((option) => option.errorLabel === null);
  const [correct] = shuffled.splice(currentCorrect, 1);
  shuffled.splice(requestedIndex, 0, correct);
  const options = shuffled;
  const canonical = (value: SemanticOption) => Array.isArray(value)
    ? value.map((part) => part.trim().toLocaleLowerCase(locale)).join("::")
    : value.trim().toLocaleLowerCase(locale);
  if (new Set(options.map((option) => canonical(option.value))).size !== 4) throw new Error(`${qlId} produced duplicate semantic options.`);
  const correctIndex = options.findIndex((option) => option.errorLabel === null);

  if (!independentlyValidateAnaCp010SemanticPair(relation.id, sourceA, sourceB, locale)) throw new Error("Independent semantic solver rejected source pair.");
  if (!independentlyValidateAnaCp010SemanticPair(relation.id, targetA, targetB, locale)) throw new Error("Independent semantic solver rejected target pair.");
  if (presentationMode === "EQUIVALENT_PAIR_SELECTION") {
    const validCount = options.filter((option) => {
      if (!Array.isArray(option.value)) return false;
      return independentlyValidateAnaCp010SemanticPair(relation.id, option.value[0], option.value[1], locale);
    }).length;
    if (validCount !== 1) throw new Error(`${qlId} must have exactly one valid semantic pair.`);
  }

  return {
    kind: "SEMANTIC",
    qlId,
    relationId: relation.id,
    presentationMode,
    locale,
    difficulty: difficulty(relation.id, presentationMode),
    sourceFactId: source.id,
    targetFactId: target.id,
    sourceA,
    sourceB,
    targetA,
    targetB,
    stem: localizedStem(locale, presentationMode, sourceA, sourceB, targetA),
    options,
    correctIndex,
    explanation: localizedExplanation(locale, relation, sourceA, sourceB, targetA, targetB),
  };
}
