import { evaluateCoaAction } from "./action-validity-model.ts";
import { COA_CURRENT_ENGLISH_AUTHORITIES } from "./english-authorities.ts";
import {
  COA_CP008_EITHER_AUTHORITIES,
  COA_CP008_THREE_ACTION_AUTHORITIES,
} from "./cp008-profile-authorities.ts";
import type { CoaActionAuthority, CoaAnswerClass } from "./types.ts";

export const COA_CP012_POST_CLOSURE_ANSWER_PROOF_AUTHORITY =
  "COA_CP012_FINAL_ACTION_SEMANTICS_PROOF_2026_10_04" as const;

type FinalCourse = Readonly<{
  semanticActionId?: unknown;
}>;

type FinalQuestion = Readonly<{
  questionId?: unknown;
  semanticAuthorityId?: unknown;
  presentationProfile?: unknown;
  courses?: readonly FinalCourse[];
  options?: readonly unknown[];
  correctIndex?: unknown;
  correct?: unknown;
  answer?: unknown;
  canonicalAnswer?: unknown;
  answerClass?: unknown;
  answerMask?: unknown;
  pairRelation?: unknown;
}>;

const ORDINARY_BY_ID = new Map(
  COA_CURRENT_ENGLISH_AUTHORITIES.map((scenario) => [scenario.id, scenario] as const),
);
const EITHER_BY_ID = new Map(
  COA_CP008_EITHER_AUTHORITIES.map((scenario) => [scenario.id, scenario] as const),
);
const THREE_BY_ID = new Map(
  COA_CP008_THREE_ACTION_AUTHORITIES.map((scenario) => [scenario.id, scenario] as const),
);

function answerClassForDisplayed(actions: readonly CoaActionAuthority[]): CoaAnswerClass {
  if (actions.length !== 2) throw new Error("COA final ordinary proof requires two displayed actions");
  const first = evaluateCoaAction(actions[0]!);
  const second = evaluateCoaAction(actions[1]!);
  if (first === "FOLLOWS" && second === "FOLLOWS") return "BOTH";
  if (first === "FOLLOWS") return "ONLY_I";
  if (second === "FOLLOWS") return "ONLY_II";
  return "NEITHER";
}

function maskForDisplayed(actions: readonly CoaActionAuthority[]): number {
  return actions.reduce(
    (mask, action, index) =>
      evaluateCoaAction(action) === "FOLLOWS" ? mask | (1 << index) : mask,
    0,
  );
}

function twoActionSemantic(option: string): CoaAnswerClass | "EITHER" | undefined {
  if (
    /Either Course of Action I or II follows/iu.test(option)
    || /कार्रवाई I या II में से कोई एक सही है/u.test(option)
    || /ਕਾਰਵਾਈ I ਜਾਂ II ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਸਹੀ ਹੈ/u.test(option)
  ) return "EITHER";

  if (
    /Only Course of Action I follows/iu.test(option)
    || /केवल कार्रवाई I सही है/u.test(option)
    || /ਕੇਵਲ ਕਾਰਵਾਈ I ਸਹੀ ਹੈ/u.test(option)
  ) return "ONLY_I";

  if (
    /Only Course of Action II follows/iu.test(option)
    || /केवल कार्रवाई II सही है/u.test(option)
    || /ਕੇਵਲ ਕਾਰਵਾਈ II ਸਹੀ ਹੈ/u.test(option)
  ) return "ONLY_II";

  if (
    /Both Courses of Action I and II follow/iu.test(option)
    || /दोनों कार्रवाइयाँ I और II सही हैं/u.test(option)
    || /ਦੋਵੇਂ ਕਾਰਵਾਈਆਂ I ਅਤੇ II ਸਹੀ ਹਨ/u.test(option)
  ) return "BOTH";

  if (
    /Neither Course of Action I nor II follows/iu.test(option)
    || /न तो कार्रवाई I और न ही कार्रवाई II सही है/u.test(option)
    || /ਨਾ ਤਾਂ ਕਾਰਵਾਈ I ਅਤੇ ਨਾ ਹੀ ਕਾਰਵਾਈ II ਸਹੀ ਹੈ/u.test(option)
  ) return "NEITHER";

  return undefined;
}

function threeActionMask(option: string): number | undefined {
  if (
    /None of Courses I, II and III follows/iu.test(option)
    || /I, II और III में से कोई भी सही नहीं है/u.test(option)
    || /I, II ਅਤੇ III ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਸਹੀ ਨਹੀਂ ਹੈ/u.test(option)
  ) return 0;

  if (
    /Courses I, II and III follow/iu.test(option)
    || /I, II और III सभी सही हैं/u.test(option)
    || /I, II ਅਤੇ III ਤਿੰਨੇ ਸਹੀ ਹਨ/u.test(option)
  ) return 0b111;

  const labels = [...option.matchAll(/(?<![IVX])(III|II|I)(?![IVX])/gu)]
    .map((match) => match[1]);
  if (labels.length === 0) return undefined;

  let mask = 0;
  for (const label of new Set(labels)) {
    if (label === "I") mask |= 0b001;
    else if (label === "II") mask |= 0b010;
    else if (label === "III") mask |= 0b100;
  }
  return mask;
}

function displayedStructuredActions(
  questionId: string,
  courses: readonly FinalCourse[],
  sourceActions: readonly CoaActionAuthority[],
): readonly CoaActionAuthority[] {
  const sourceById = new Map(sourceActions.map((action) => [action.id, action] as const));
  const seen = new Set<string>();
  return courses.map((course, index) => {
    const id = String(course.semanticActionId ?? "");
    if (!id) throw new Error(`${questionId}: displayed course ${index + 1} has no semanticActionId`);
    if (seen.has(id)) throw new Error(`${questionId}: duplicate displayed semantic action ${id}`);
    seen.add(id);
    const source = sourceById.get(id);
    if (!source) throw new Error(`${questionId}: displayed semantic action ${id} is not owned by the source authority`);
    return source;
  });
}

function assertRuntimeAnswerText(
  questionId: string,
  options: readonly string[],
  correctIndex: number,
  question: FinalQuestion,
): void {
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
    throw new Error(`${questionId}: runtime correct index is outside the option range`);
  }
  const expected = options[correctIndex]!;
  if (question.answer !== undefined && String(question.answer) !== expected) {
    throw new Error(`${questionId}: answer text disagrees with the semantic correct option`);
  }
  if (question.canonicalAnswer !== undefined && String(question.canonicalAnswer) !== expected) {
    throw new Error(`${questionId}: canonical answer disagrees with the semantic correct option`);
  }
}

export function assertCoaCp012FinalAnswerIntegrity(question: FinalQuestion): void {
  const questionId = String(question.questionId ?? "COA-CP012-UNKNOWN");
  const semanticAuthorityId = String(question.semanticAuthorityId ?? "");
  const profile = String(question.presentationProfile ?? "");
  const courses = Array.isArray(question.courses) ? question.courses : [];
  const options = Array.isArray(question.options) ? question.options.map(String) : [];
  const runtimeCorrectIndex = Number(question.correctIndex ?? question.correct);

  if (!semanticAuthorityId) throw new Error(`${questionId}: missing semanticAuthorityId`);

  const either = EITHER_BY_ID.get(semanticAuthorityId);
  if (either) {
    if (courses.length !== 2) throw new Error(`${questionId}: Either authority must display exactly two courses`);
    const actions = displayedStructuredActions(questionId, courses, either.actions);
    if (actions.some((action) => evaluateCoaAction(action) !== "FOLLOWS")) {
      throw new Error(`${questionId}: Either authority contains a course that is not independently valid`);
    }
    if (profile !== "TWO_ACTION_FIVE_CODE") {
      throw new Error(`${questionId}: Either authority must use the five-code profile`);
    }
    if (String(question.pairRelation ?? "") !== "MUTUALLY_EXCLUSIVE_ALTERNATIVES") {
      throw new Error(`${questionId}: Either authority lost its mutually-exclusive pair relation`);
    }
    if (String(question.answerClass ?? "") !== "EITHER") {
      throw new Error(`${questionId}: Either authority lost its EITHER answer class`);
    }
    const semanticOptions = options.map(twoActionSemantic);
    const matches = semanticOptions.flatMap((semantic, index) => semantic === "EITHER" ? [index] : []);
    if (matches.length !== 1 || runtimeCorrectIndex !== matches[0]) {
      throw new Error(`${questionId}: runtime key disagrees with independently proved EITHER semantics`);
    }
    assertRuntimeAnswerText(questionId, options, runtimeCorrectIndex, question);
    return;
  }

  const three = THREE_BY_ID.get(semanticAuthorityId);
  if (three) {
    if (courses.length !== 3) throw new Error(`${questionId}: three-action authority must display exactly three courses`);
    if (profile !== "THREE_ACTION_COMBINATION") {
      throw new Error(`${questionId}: three-action authority lost its presentation profile`);
    }
    const actions = displayedStructuredActions(questionId, courses, three.actions);
    const semanticMask = maskForDisplayed(actions);
    if (Number(question.answerMask) !== semanticMask) {
      throw new Error(`${questionId}: runtime answer mask disagrees with structured action validity`);
    }
    const optionMasks = options.map(threeActionMask);
    const matches = optionMasks.flatMap((mask, index) => mask === semanticMask ? [index] : []);
    if (matches.length !== 1 || runtimeCorrectIndex !== matches[0]) {
      throw new Error(`${questionId}: runtime key disagrees with independently proved three-action mask`);
    }
    assertRuntimeAnswerText(questionId, options, runtimeCorrectIndex, question);
    return;
  }

  const ordinary = ORDINARY_BY_ID.get(semanticAuthorityId);
  if (!ordinary) throw new Error(`${questionId}: unknown COA semantic authority ${semanticAuthorityId}`);
  if (courses.length !== 2) throw new Error(`${questionId}: ordinary authority must display exactly two courses`);
  if (profile !== "TWO_ACTION_FOUR_WAY" && profile !== "TWO_ACTION_FIVE_CODE") {
    throw new Error(`${questionId}: ordinary authority uses unsupported profile ${profile}`);
  }

  const actions = displayedStructuredActions(questionId, courses, ordinary.actions);
  const semanticAnswer = answerClassForDisplayed(actions);
  if (String(question.answerClass ?? "") !== semanticAnswer) {
    throw new Error(`${questionId}: runtime answer class disagrees with structured action validity`);
  }
  if (String(question.pairRelation ?? "") !== "INDEPENDENT_VERDICTS") {
    throw new Error(`${questionId}: ordinary authority lost independent-verdict pair relation`);
  }

  const semanticOptions = options.map(twoActionSemantic);
  const matches = semanticOptions.flatMap((semantic, index) => semantic === semanticAnswer ? [index] : []);
  if (matches.length !== 1 || runtimeCorrectIndex !== matches[0]) {
    throw new Error(`${questionId}: runtime key disagrees with independently proved ordinary answer class`);
  }
  assertRuntimeAnswerText(questionId, options, runtimeCorrectIndex, question);
}
