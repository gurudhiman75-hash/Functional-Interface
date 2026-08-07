import type { SylLocale } from "../foundation/types";
import { conclusionSemanticKey } from "./analysis";
import {
  maskLabel,
  modalLabel,
  pairClassificationLabel,
  pairSemanticLabel,
  renderConclusion,
  type TermAssignment,
} from "./localization";
import { createPrng, shuffle } from "./prng";
import type {
  GeneratedSylOption,
  ModalAnswer,
  PairClassificationStatus,
  PairSemanticStatus,
  SylQlDefinition,
} from "./types";
import type { SelectedLogic } from "./selection";

const PAIR_FOUR: readonly PairSemanticStatus[] = [
  "ONLY_FIRST_FOLLOWS",
  "ONLY_SECOND_FOLLOWS",
  "BOTH_FOLLOW",
  "NEITHER_FOLLOWS",
];
const PAIR_FIVE: readonly PairSemanticStatus[] = [...PAIR_FOUR, "EITHER_OR_FOLLOWS"];

// Premises are generated from satisfiable scenario authorities and are independently
// solver-checked before options are built. Therefore PREMISSES_INCONSISTENT can never
// be a live answer in these four modal diagnostic QLs. The learner-facing modal space
// is the exhaustive three-way classification below.
const MODAL: readonly ModalAnswer[] = [
  "DEFINITELY_TRUE",
  "POSSIBLY_TRUE_NOT_DEFINITE",
  "IMPOSSIBLE",
];
const PAIR_CLASSES: readonly PairClassificationStatus[] = [
  "EITHER_OR",
  "BOTH_FOLLOW",
  "ONLY_FIRST_FOLLOWS",
  "ONLY_SECOND_FOLLOWS",
  "NO_COMPLEMENTARY_RELATION",
];

function option(
  optionId: string,
  semanticValue: string,
  text: string,
  correct: boolean,
  errorLabel: string | null,
): GeneratedSylOption {
  return { optionId, semanticValue, text, isCorrect: correct, errorLabel };
}

function classificationErrorLabel(classification: string): string {
  if (classification === "UNDETERMINED") return "POSSIBILITY_TREATED_AS_DEFINITE";
  if (classification === "CONTRADICTED") return "CONTRADICTED_CONCLUSION_SELECTED";
  return "ENTAILED_CONCLUSION_REJECTED";
}

function shuffledOptions(
  options: readonly GeneratedSylOption[],
  definition: SylQlDefinition,
  seed: number,
): readonly GeneratedSylOption[] {
  return shuffle(options, createPrng(`${definition.qlId}:${seed}:options`)).map((entry, index) => ({
    ...entry,
    optionId: `OPTION-${index + 1}`,
  }));
}

export function buildOptions(
  definition: SylQlDefinition,
  selected: SelectedLogic,
  locale: SylLocale,
  assignment: TermAssignment,
  seed: number,
): readonly GeneratedSylOption[] {
  if (
    definition.taskKind === "SELECT_DEFINITE_CONCLUSION"
    || definition.taskKind === "SELECT_NON_FOLLOWING_CONCLUSION"
    || definition.taskKind === "SELECT_GENUINE_POSSIBILITY"
    || definition.taskKind === "SELECT_IMPOSSIBLE_CONCLUSION"
    || definition.taskKind === "ONLY_SELECT_DEFINITE_CONCLUSION"
    || definition.taskKind === "FEW_SELECT_DEFINITE_CONCLUSION"
  ) {
    const options = selected.conclusions.map((candidate, index) => {
      const key = conclusionSemanticKey(candidate);
      const correct = key === selected.semanticAnswer;
      return option(
        `RAW-${index + 1}`,
        key,
        renderConclusion(candidate.conclusion, locale, assignment),
        correct,
        correct ? null : classificationErrorLabel(candidate.profile.classification),
      );
    });
    return shuffledOptions(options, definition, seed);
  }

  if (
    definition.taskKind === "TWO_CONCLUSION_FOLLOW_MASK"
    || definition.taskKind === "ONLY_TWO_CONCLUSION_MASK"
    || definition.taskKind === "FEW_TWO_CONCLUSION_MASK"
    || definition.taskKind === "MIXED_TWO_CONCLUSION_MASK"
    || definition.taskKind === "TWO_CONCLUSION_EITHER_OR"
  ) {
    const statuses = definition.optionCount === 5 ? PAIR_FIVE : PAIR_FOUR;
    const options = statuses.map((status, index) => option(
      `RAW-${index + 1}`,
      status,
      pairSemanticLabel(status, locale),
      status === selected.semanticAnswer,
      status === selected.semanticAnswer ? null : "WRONG_COMBINATION_LABEL",
    ));
    return shuffledOptions(options, definition, seed);
  }

  if (
    definition.taskKind === "THREE_CONCLUSION_FOLLOW_MASK"
    || definition.taskKind === "MIXED_THREE_CONCLUSION_MASK"
  ) {
    if (selected.followMask === null) throw new Error("Three-conclusion task lacks a follow mask.");
    const random = createPrng(`${definition.qlId}:${seed}:mask-distractors`);
    const distractors = shuffle(
      Array.from({ length: 8 }, (_, mask) => mask).filter((mask) => mask !== selected.followMask),
      random,
    ).slice(0, 3);
    const masks = [selected.followMask, ...distractors];
    const options = masks.map((mask, index) => option(
      `RAW-${index + 1}`,
      `MASK_${mask}`,
      maskLabel(mask, 3, locale),
      mask === selected.followMask,
      mask === selected.followMask ? null : "THREE_CONCLUSION_MASK_ERROR",
    ));
    return shuffledOptions(options, definition, seed);
  }

  if (
    definition.taskKind === "CLASSIFY_CONCLUSION_MODALITY"
    || definition.taskKind === "ONLY_MODAL_CLASSIFICATION"
    || definition.taskKind === "FEW_MODAL_CLASSIFICATION"
    || definition.taskKind === "MIXED_MODAL_CLASSIFICATION"
  ) {
    const options = MODAL.map((status, index) => option(
      `RAW-${index + 1}`,
      status,
      modalLabel(status, locale),
      status === selected.semanticAnswer,
      status === selected.semanticAnswer ? null : "POSSIBILITY_NEGATION_ERROR",
    ));
    return shuffledOptions(options, definition, seed);
  }

  if (definition.taskKind === "CLASSIFY_CONCLUSION_PAIR") {
    const options = PAIR_CLASSES.map((status, index) => option(
      `RAW-${index + 1}`,
      status,
      pairClassificationLabel(status, locale),
      status === selected.semanticAnswer,
      status === selected.semanticAnswer ? null : "EITHER_OR_CLASSIFICATION_ERROR",
    ));
    return shuffledOptions(options, definition, seed);
  }

  const exhaustive: never = definition.taskKind;
  throw new Error(`Unsupported option task: ${String(exhaustive)}.`);
}
