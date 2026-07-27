import { compareRational } from "./rational";
import type {
  BlendComponent,
  MalCp001PrototypeParameters,
} from "./types";

function replaceComponentLabel(
  components: BlendComponent[],
  componentId: string,
  label: string,
): void {
  const component = components.find((item) => item.id === componentId);
  if (component) component.label = label;
}

/**
 * Role words such as regular/premium and standard/high-grade carry a natural
 * value ordering. Parameter direction may reverse, but those labels must not.
 */
export function enforceMalCp001ContextCoherence(
  parameters: MalCp001PrototypeParameters,
): void {
  const { request, context } = parameters;
  if (request.mode !== "ADD_SOURCE_TO_REACH_TARGET") return;

  const initial = request.initialComponents[0];
  if (!initial) throw new Error("Addition prototype requires an initial component.");

  const initialIsLower = compareRational(initial.value, request.addedValue) < 0;
  const initialLabel = initialIsLower ? context.lowerLabel : context.higherLabel;
  const addedLabel = initialIsLower ? context.higherLabel : context.lowerLabel;

  initial.label = initialLabel;
  request.addedComponentLabel = addedLabel;
  replaceComponentLabel(parameters.hiddenState.components, initial.id, initialLabel);
  replaceComponentLabel(
    parameters.hiddenState.components,
    request.addedComponentId,
    addedLabel,
  );
}

function capitaliseFirstLetter(text: string): string {
  const index = text.search(/[a-z]/iu);
  if (index < 0) return text;
  return `${text.slice(0, index)}${text[index].toUpperCase()}${text.slice(index + 1)}`;
}

/**
 * This is a narrow learner-facing quality gate, not a generic prose rewriter.
 * Every rule corresponds to a defect found in the generated English review pack.
 */
export function polishMalCp001Stem(stem: string): string {
  let polished = stem.trim();

  polished = polished.replace(
    /^(\d+\s+(?:kg|litres)\s+of\s+.+?)\s+is blended with\s+(.+)$/iu,
    "A blend combines $1 with $2",
  );
  polished = polished.replace(
    /How much\s+(.+?)\s+was added\?$/iu,
    "What quantity of $1 was added?",
  );
  polished = polished.replace(
    /How much\s+(.+?)\s+was used\?$/iu,
    "What quantity of $1 was used?",
  );
  polished = polished.replace(/,\s+and\s+([^,?]+),\s+and\s+/iu, ", $1, and ");

  return capitaliseFirstLetter(polished);
}

export function validateMalCp001ContextCoherence(
  parameters: MalCp001PrototypeParameters,
): string[] {
  const errors: string[] = [];
  const { context } = parameters;
  const components = parameters.hiddenState.components;

  const lower = components.find((item) => item.label === context.lowerLabel);
  const higher = components.find((item) => item.label === context.higherLabel);
  const middle = components.find((item) => item.label === context.thirdLabel);

  if (lower && higher && compareRational(lower.value, higher.value) >= 0) {
    errors.push("Lower-grade context label is not attached to the lower source value.");
  }
  if (lower && middle && compareRational(lower.value, middle.value) >= 0) {
    errors.push("Middle-grade context label is not above the lower source value.");
  }
  if (middle && higher && compareRational(middle.value, higher.value) >= 0) {
    errors.push("Middle-grade context label is not below the higher source value.");
  }

  return errors;
}
