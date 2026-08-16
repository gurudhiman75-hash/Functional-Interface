import {
  INT_CP005_RUNTIME_VERSION_V16_1,
  INT_CP005_V16_1_DECISION,
  INT_CP005_V16_1_QL_IDS,
  generateIntCp005QuestionV16_1Final as generateBase,
  intCp005V16_1TopologyKey,
  type IntCp005QuestionV16_1,
} from "./cp005-variable-growth-decay-runtime-v16-1-final";
import type { IntCp005QlId } from "./cp005-variable-growth-decay-runtime";

export { INT_CP005_RUNTIME_VERSION_V16_1, INT_CP005_V16_1_DECISION, INT_CP005_V16_1_QL_IDS, intCp005V16_1TopologyKey };
export type { IntCp005QuestionV16_1 };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}
function lowerFirst(text: string): string { return text.length ? `${text[0]!.toLowerCase()}${text.slice(1)}` : text; }

function hardenPresentation(question: IntCp005QuestionV16_1): IntCp005QuestionV16_1 {
  const state = question.mathematicalState;
  let markdown = question.presentation.markdown;

  if (state.qlId === "INT-QL-086") {
    if (state.context === "INVESTMENT" && !/compound/iu.test(markdown)) {
      markdown = markdown
        .replace(" is invested. It changes at ", " is invested at compound interest. The annual rates are ")
        .replace(" is invested. Apply the following annual rates successively:", " is invested at compound interest. Apply the following annual compound-interest rates successively:");
      if (!/compound/iu.test(markdown)) markdown = `At compound interest, ${lowerFirst(markdown)}`;
    }
    if (state.context === "POPULATION" && !/growth|grow/iu.test(markdown)) {
      markdown = markdown
        .replace("It changes at ", "Its population grows at ")
        .replace("the following annual rates", "the following annual growth rates");
      if (!/growth|grow/iu.test(markdown)) markdown = `With annual population growth, ${lowerFirst(markdown)}`;
    }
    if (state.context === "ASSET" && !/appreciat|growth/iu.test(markdown)) {
      markdown = markdown
        .replace("It changes at ", "Its value appreciates at ")
        .replace("the following annual rates", "the following annual appreciation rates");
      if (!/appreciat|growth/iu.test(markdown)) markdown = `With annual appreciation, ${lowerFirst(markdown)}`;
    }
  }

  if (state.qlId === "INT-QL-088") {
    if (state.context === "INVESTMENT" && !/compound/iu.test(markdown)) {
      markdown = markdown
        .replace("successive annual rates", "successive annual compound-interest rates")
        .replace("An investment", "At compound interest, an investment")
        .replace("an investment", "an investment");
      if (!/compound/iu.test(markdown)) markdown = `Under compound interest, ${lowerFirst(markdown)}`;
    }
    if (state.context === "POPULATION" && !/growth|grow/iu.test(markdown)) {
      markdown = markdown
        .replace("successive annual rates", "successive annual growth rates")
        .replace("after applying ", "after annual growth of ");
      if (!/growth|grow/iu.test(markdown)) markdown = `With annual population growth, ${lowerFirst(markdown)}`;
    }
    if (state.context === "ASSET" && !/appreciat|growth/iu.test(markdown)) {
      markdown = markdown
        .replace("successive annual rates", "successive annual appreciation rates")
        .replace("after applying ", "after annual appreciation of ");
      if (!/appreciat|growth/iu.test(markdown)) markdown = `With annual appreciation, ${lowerFirst(markdown)}`;
    }
  }

  if (state.qlId === "INT-QL-095" && !/compound/iu.test(markdown)) {
    markdown = markdown.replace("under Plan A and Plan B", "under compound-interest Plan A and Plan B");
    if (!/compound/iu.test(markdown)) markdown = `Under compound interest, ${lowerFirst(markdown)}`;
  }

  if (markdown === question.presentation.markdown) return question;
  return deepFreeze({
    ...question,
    presentation: deepFreeze({ ...question.presentation, markdown, prompt: markdown }),
    mathematicalFingerprint: `${question.mathematicalFingerprint}|V16_1_SELF_CONTAINED_EN_V2`,
  });
}

export function generateIntCp005QuestionV16_1Final(
  qlId: IntCp005QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp005QuestionV16_1 {
  return hardenPresentation(generateBase(qlId, seed, locale));
}
