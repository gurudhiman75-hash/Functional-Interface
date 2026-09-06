import { COM003_EDITORIALLY_APPROVED_FACTS } from "./com003-editorial-fact-review";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { generateCom003ReviewQuestionV5 } from "./com003-review-synthesis-v5";
import type { Com003ReviewQuestion } from "./com003-review-types";

export type Com003ExamSurfaceFamily =
  | "DIRECT_RECALL"
  | "FUNCTIONAL_APPLICATION"
  | "EXAMPLE_RECOGNITION"
  | "CONTRAST_DISCRIMINATION";

export type Com003ReviewQuestionV7 = Com003ReviewQuestion & {
  examSurfaceFamily: Com003ExamSurfaceFamily;
  stemAuthority: "COM003_V7_EXAM_SURFACE_FAMILY_AUTHORITY";
};

const factById = new Map(COM003_EDITORIALLY_APPROVED_FACTS.map((fact) => [fact.factId, fact]));

function compact(value: string) {
  return value.trim().replace(/\s+/g, " ").replace(/[.]+$/, "");
}

function lowerFirst(value: string) {
  const v = compact(value);
  return v ? `${v.charAt(0).toLowerCase()}${v.slice(1)}` : v;
}

function upperFirst(value: string) {
  const v = compact(value);
  return v ? `${v.charAt(0).toUpperCase()}${v.slice(1)}` : v;
}

function targetEntity(question: Com003ReviewQuestion) {
  return compact(factById.get(question.targetFactId)?.entity.label.en ?? question.canonicalAnswer);
}

function targetText(question: Com003ReviewQuestion) {
  const fact = factById.get(question.targetFactId);
  return fact?.value.kind === "text" ? compact(fact.value.text.en) : "";
}

function infinitive(value: string) {
  return lowerFirst(value)
    .replace(/^inserts\b/i, "insert")
    .replace(/^duplicates\b/i, "duplicate")
    .replace(/^reverses\b/i, "reverse")
    .replace(/^reapplies\b/i, "reapply")
    .replace(/^opens\b/i, "open")
    .replace(/^saves\b/i, "save")
    .replace(/^copies\b/i, "copy")
    .replace(/^cuts\b/i, "cut")
    .replace(/^finds\b/i, "find")
    .replace(/^locates\b/i, "locate")
    .replace(/^replaces\b/i, "replace")
    .replace(/^combines\b/i, "combine")
    .replace(/^returns\b/i, "return")
    .replace(/^counts\b/i, "count")
    .replace(/^calculates\b/i, "calculate")
    .replace(/^sorts\b/i, "sort")
    .replace(/^filters\b/i, "filter")
    .replace(/^continues\b/i, "continue")
    .replace(/^changes\b/i, "change")
    .replace(/^keeps\b/i, "keep")
    .replace(/^starts\b/i, "start")
    .replace(/^adds\b/i, "add")
    .replace(/^moves\b/i, "move")
    .replace(/^controls\b/i, "control")
    .replace(/^applies\b/i, "apply")
    .replace(/^determines\b/i, "determine")
    .replace(/^specifies\b/i, "specify")
    .replace(/^sets\b/i, "set")
    .replace(/^displays\b/i, "display")
    .replace(/^automatically corrects\b/i, "automatically correct")
    .replace(/^is\b/i, "be")
    .replace(/^has\b/i, "have");
}

function applicationForQl(qlId: string) {
  const n = Number(qlId.match(/QL-(\d{3})$/)?.[1] ?? 0);
  if (n <= 3) return "Microsoft Office";
  if (n <= 7) return "Microsoft Word";
  if (n <= 15) return "Microsoft Excel";
  return "Microsoft PowerPoint";
}

function familyForIndex(index: number): Com003ExamSurfaceFamily {
  return (["DIRECT_RECALL", "FUNCTIONAL_APPLICATION", "EXAMPLE_RECOGNITION", "CONTRAST_DISCRIMINATION"] as const)[Math.floor((index % 12) / 3)]!;
}

function variant(index: number) {
  return index % 3;
}

function pick(values: readonly string[], index: number) {
  return values[index % values.length]!;
}

function windowsContext(question: Com003ReviewQuestion, application: string) {
  return question.versionScoped ? `In Windows desktop ${application}, ` : "";
}

function directStem(question: Com003ReviewQuestion, index: number) {
  const base = generateCom003ReviewQuestionV5(question.qlId, `v7-direct:${question.qlId}:${index}`, index);
  return upperFirst(base.stem).replace(/\?+$/, "?");
}

function functionalStem(question: Com003ReviewQuestion, index: number) {
  const entity = targetEntity(question);
  const text = targetText(question);
  const action = infinitive(text);
  const app = applicationForQl(question.qlId);
  const v = variant(index);

  switch (question.surfaceMode) {
    case "APPLICATION_FROM_PURPOSE":
      return pick([
        `A user needs to ${action}. Which Microsoft Office application should be used?`,
        `For a task that requires a user to ${action}, which Office application is appropriate?`,
        `Which Microsoft Office application would you choose to ${action}?`,
      ], v);
    case "SOFTWARE_CLASSIFICATION":
      return pick([
        `A computer contains ${entity}. Under which category should this program be classified?`,
        `While classifying software installed on a PC, ${entity} should be placed in which category?`,
        `${entity} is installed for user productivity tasks. It belongs to which class of software?`,
      ], v);
    case "TYPE_TO_EXTENSION":
    case "EXTENSION_TO_TYPE":
      return pick([
        `A file has to be saved or identified as ${lowerFirst(text || entity)}. Which file extension is appropriate?`,
        `While checking an Office file, which extension corresponds to ${lowerFirst(text || entity)}?`,
        `Which extension would you expect for ${lowerFirst(text || entity)}?`,
      ], v);
    case "ACTION_TO_SHORTCUT":
    case "FORMATTING_SHORTCUT":
    case "SLIDESHOW_ACTION_TO_SHORTCUT":
      return pick([
        `${windowsContext(question, app)}a user wants to ${action} without using the mouse. Which shortcut should be used?`,
        `${windowsContext(question, app)}which key combination provides the quickest keyboard method to ${action}?`,
        `${windowsContext(question, app)}to ${action} by keyboard, which shortcut is appropriate?`,
      ], v);
    case "SHORTCUT_TO_ACTION":
    case "SHORTCUT_TO_SLIDESHOW_ACTION":
      return pick([
        `${windowsContext(question, app)}a user presses ${entity}. What action will this shortcut perform?`,
        `${windowsContext(question, app)}what happens when ${entity} is used?`,
        `${windowsContext(question, app)}${entity} is pressed during normal use. Which action does it invoke?`,
      ], v);
    case "EFFECT_TO_COMMAND":
    case "EDIT_ACTION_FROM_EFFECT":
    case "FORMAT_CONTROL_FROM_EFFECT":
    case "FEATURE_FROM_PURPOSE":
    case "PAGE_ELEMENT_FROM_ROLE":
    case "COMPONENT_FROM_ROLE":
    case "FEATURE_FROM_EFFECT":
    case "OPERATION_FROM_EFFECT":
    case "CREATION_CONCEPT_FROM_ROLE":
    case "OBJECT_FROM_PURPOSE":
      return pick([
        `A user needs to ${action} in ${app}. Which option should be used?`,
        `Which ${app} command or feature is appropriate when the requirement is to ${action}?`,
        `To ${action} in ${app}, which option is the correct choice?`,
      ], v);
    case "COMMAND_TO_EFFECT":
    case "PURPOSE_FROM_FEATURE":
    case "EFFECT_FROM_FEATURE":
      return pick([
        `A user selects ${entity} in ${app}. What result should be expected?`,
        `If ${entity} is used in ${app}, which task does it perform?`,
        `What is the practical effect of choosing ${entity} in ${app}?`,
      ], v);
    case "ALIGNMENT_FROM_PROPERTY":
      return pick([
        `A paragraph must satisfy this layout requirement: ${lowerFirst(text)}. Which alignment should be applied?`,
        `Which alignment would produce a paragraph in which ${lowerFirst(text)}?`,
        `To make a paragraph so that ${lowerFirst(text)}, which alignment is required?`,
      ], v);
    case "ORIENTATION_FROM_DIMENSIONS": {
      const shape = lowerFirst(text).replace(/^page orientation in which the page is\s*/i, "");
      return pick([
        `A document page needs to be ${shape}. Which page orientation should be selected?`,
        `If the page is required to be ${shape}, which orientation is appropriate?`,
        `Which Word orientation setting produces a page that is ${shape}?`,
      ], v);
    }
    case "STRUCTURE_TERM_FROM_DEFINITION":
      return pick([
        `While working in Excel, a user encounters ${lowerFirst(text)}. What is this structure called?`,
        `In an Excel worksheet, which term is used for ${lowerFirst(text)}?`,
        `Which Excel structure matches this description: ${lowerFirst(text)}?`,
      ], v);
    case "CELL_ADDRESS_INTERPRETATION":
      return pick([
        `A formula refers to cell ${entity}. What information does this cell address convey?`,
        `While reading an Excel formula, the reference ${entity} is encountered. What does it identify?`,
        `In a worksheet formula, ${entity} points to which location?`,
      ], v);
    case "RANGE_RECOGNITION":
      return pick([
        `A formula must refer to ${lowerFirst(text)}. Which Excel range notation should be used?`,
        `Which notation would select ${lowerFirst(text)} in Excel?`,
        `To refer to ${lowerFirst(text)} in a formula, which range expression is correct?`,
      ], v);
    case "FORMULA_PREFIX":
      return pick([
        `A user is about to enter a formula in Excel. Which symbol should be typed first?`,
        `To make Excel interpret an entry as a formula, which symbol normally begins the entry?`,
        `Before typing the expression of an Excel formula, which symbol is normally entered?`,
      ], v);
    case "OPERATION_TO_OPERATOR":
      return pick([
        `An Excel formula must perform ${lowerFirst(text)}. Which arithmetic operator should be used?`,
        `Which symbol should be placed in a formula when the required operation is ${lowerFirst(text)}?`,
        `To carry out ${lowerFirst(text)} in an Excel formula, which operator is appropriate?`,
      ], v);
    case "AUTOSUM_IDENTIFICATION":
      return pick([
        `A user clicks AutoSum to total a range quickly. Which function is normally inserted?`,
        `Which function does Excel normally use when AutoSum is chosen for a basic total?`,
        `AutoSum is used to create a quick total. Which function does it generally place in the formula?`,
      ], v);
    case "FUNCTION_FROM_PURPOSE":
      return pick([
        `An Excel worksheet needs to ${action}. Which function should be used?`,
        `Which Excel function is appropriate for a calculation that must ${action}?`,
        `To ${action} in Excel, which built-in function should be selected?`,
      ], v);
    case "REFERENCE_NOTATION_CLASSIFICATION":
      return pick([
        `A formula will be copied, but both its row and column reference must remain fixed. Which notation should be used?`,
        `Which Excel reference should be chosen when neither the row nor column may change after copying?`,
        `To lock both row and column in a copied Excel formula, which cell-reference form is required?`,
      ], v);
    case "REFERENCE_TYPE_FROM_BEHAVIOR":
      return pick([
        `A formula is copied to another cell and the reference ${lowerFirst(text)}. Which reference type has this behavior?`,
        `Which Excel reference type is suitable when the reference should ${action} as the formula is copied?`,
        `When formulas are filled to other cells, which reference type ${lowerFirst(text)}?`,
      ], v);
    case "CHART_FROM_PURPOSE":
      return pick([
        `A worksheet needs a simple chart to ${action}. Which chart type is commonly used for this purpose?`,
        `Which basic Excel chart would normally be chosen to ${action}?`,
        `For a simple visualization intended to ${action}, which chart type is appropriate?`,
      ], v);
    default:
      return directStem(question, index);
  }
}

function exampleStem(question: Com003ReviewQuestion, index: number) {
  const entity = targetEntity(question);
  const text = targetText(question);
  const app = applicationForQl(question.qlId);
  const v = variant(index);

  switch (question.surfaceMode) {
    case "EXTENSION_TO_TYPE":
      return pick([
        `A file name ends with ${entity}. Which type of Office file does this indicate?`,
        `Consider the file name Sample${entity}. What type of file is it?`,
        `The extension shown in Report${entity} identifies the file as which type?`,
      ], v);
    case "TYPE_TO_EXTENSION":
      return pick([
        `Which of the following could correctly appear at the end of a file name for ${lowerFirst(text)}?`,
        `A file of type “${lowerFirst(text)}” is being named. Which extension should follow the file name?`,
        `Which extension correctly completes the name of ${lowerFirst(text)} file?`,
      ], v);
    case "SHORTCUT_TO_ACTION":
    case "SHORTCUT_TO_SLIDESHOW_ACTION":
      return pick([
        `Consider the keyboard input ${entity}. Which action is associated with it in ${app}?`,
        `In ${app}, ${entity} is an example of a shortcut for which action?`,
        `Which action correctly completes the pair ${entity} → ?`,
      ], v);
    case "ACTION_TO_SHORTCUT":
    case "FORMATTING_SHORTCUT":
    case "SLIDESHOW_ACTION_TO_SHORTCUT":
      return pick([
        `Which shortcut correctly completes this pair: “${lowerFirst(text)}” → ?`,
        `Which key combination is the correct example for the action “${lowerFirst(text)}”?`,
        `Choose the shortcut that correctly matches this action: ${lowerFirst(text)}.`,
      ], v);
    case "CELL_ADDRESS_INTERPRETATION":
      return pick([
        `In the cell reference ${entity}, which part identifies the row/column information described in the question?`,
        `${entity} is an example of A1-style notation. What does it identify?`,
        `Which interpretation of the example ${entity} is correct?`,
      ], v);
    case "RANGE_RECOGNITION":
      return pick([
        `Which of the following is a correct example of notation for ${lowerFirst(text)}?`,
        `Select the range expression that represents ${lowerFirst(text)}.`,
        `Which Excel range is an example of ${lowerFirst(text)}?`,
      ], v);
    case "FORMULA_PREFIX":
      return pick([
        `Which symbol would correctly complete the beginning of an Excel formula: ___SUM(A1:A5)?`,
        `To turn “SUM(A1:A5)” into a normal Excel formula, which symbol should be placed before it?`,
        `Which prefix makes SUM(A1:A5) a standard Excel formula entry?`,
      ], v);
    case "OPERATION_TO_OPERATOR":
      return pick([
        `Which operator would correctly replace the blank in a formula intended for ${lowerFirst(text)}: =A1 __ B1?`,
        `In the expression =A1 __ B1, which symbol performs ${lowerFirst(text)}?`,
        `Which arithmetic sign correctly completes an Excel formula for ${lowerFirst(text)}?`,
      ], v);
    case "REFERENCE_NOTATION_CLASSIFICATION":
      return pick([
        `Which option is an example of a reference in which both row and column are absolute?`,
        `Identify the fully absolute reference among the given Excel notations.`,
        `Which cell reference is written in fully absolute form?`,
      ], v);
    case "ALIGNMENT_FROM_PROPERTY":
    case "ORIENTATION_FROM_DIMENSIONS":
    case "STRUCTURE_TERM_FROM_DEFINITION":
    case "FUNCTION_FROM_PURPOSE":
    case "FEATURE_FROM_PURPOSE":
    case "FEATURE_FROM_EFFECT":
    case "CHART_FROM_PURPOSE":
      return pick([
        `Which option is the correct example or choice for this requirement in ${app}: ${lowerFirst(text)}?`,
        `Identify the ${app} option that matches this description: ${lowerFirst(text)}.`,
        `Which of the following correctly represents the concept described here: ${lowerFirst(text)}?`,
      ], v);
    default:
      return pick([
        `Which option correctly matches the following ${app} fact: ${lowerFirst(text || entity)}?`,
        `Identify the correct ${app} term for this example or description: ${lowerFirst(text || entity)}.`,
        `Which choice correctly represents ${lowerFirst(text || entity)} in ${app}?`,
      ], v);
  }
}

function contrastStem(question: Com003ReviewQuestion, index: number) {
  const entity = targetEntity(question);
  const text = targetText(question);
  const app = applicationForQl(question.qlId);
  const v = variant(index);

  switch (question.surfaceMode) {
    case "APPLICATION_FROM_PURPOSE":
      return pick([
        `Among Word, Excel and PowerPoint, which application is specifically suited to ${lowerFirst(text)}?`,
        `Which Office application should be distinguished from the others when the task is ${lowerFirst(text)}?`,
        `Which member of Microsoft Office best matches the purpose “${lowerFirst(text)}”?`,
      ], v);
    case "SOFTWARE_CLASSIFICATION":
      return pick([
        `${entity} should not be confused with system software. It is which type of software?`,
        `Which classification correctly distinguishes ${entity} from operating-system software?`,
        `When software is divided into system and application categories, where does ${entity} belong?`,
      ], v);
    case "EXTENSION_TO_TYPE":
    case "TYPE_TO_EXTENSION":
      return pick([
        `Which choice correctly distinguishes the required Office file type from the other common Office formats?`,
        `Which extension-file type match is correct for ${lowerFirst(text || entity)}?`,
        `From the given Office formats, which one corresponds to ${lowerFirst(text || entity)}?`,
      ], v);
    case "EFFECT_TO_COMMAND":
    case "COMMAND_TO_EFFECT":
    case "EDIT_ACTION_FROM_EFFECT":
    case "FORMAT_CONTROL_FROM_EFFECT":
    case "FEATURE_FROM_PURPOSE":
    case "PURPOSE_FROM_FEATURE":
    case "PAGE_ELEMENT_FROM_ROLE":
    case "COMPONENT_FROM_ROLE":
    case "FEATURE_FROM_EFFECT":
    case "EFFECT_FROM_FEATURE":
    case "OPERATION_FROM_EFFECT":
      return pick([
        `Which ${app} option correctly matches the function “${lowerFirst(text)}”?`,
        `Which choice should be selected if the intended function is ${lowerFirst(text)}?`,
        `Which ${app} command or feature is correctly associated with ${lowerFirst(text)}?`,
      ], v);
    case "SHORTCUT_TO_ACTION":
    case "ACTION_TO_SHORTCUT":
    case "FORMATTING_SHORTCUT":
    case "SHORTCUT_TO_SLIDESHOW_ACTION":
    case "SLIDESHOW_ACTION_TO_SHORTCUT":
      return pick([
        `${windowsContext(question, app)}which option gives the correct shortcut-action match for ${lowerFirst(text || entity)}?`,
        `${windowsContext(question, app)}which keyboard choice is correctly associated with ${lowerFirst(text || entity)}?`,
        `${windowsContext(question, app)}identify the correct shortcut/action relationship for ${lowerFirst(text || entity)}.`,
      ], v);
    case "ALIGNMENT_FROM_PROPERTY":
      return pick([
        `Which alignment is described by “${lowerFirst(text)}”, rather than the other paragraph-alignment options?`,
        `Which Word alignment uniquely matches this property: ${lowerFirst(text)}?`,
        `Distinguish the alignment options: which one ${lowerFirst(text)}?`,
      ], v);
    case "ORIENTATION_FROM_DIMENSIONS":
      return pick([
        `Which orientation, Portrait or Landscape, matches the condition that the page is ${lowerFirst(text).replace(/^page orientation in which the page is\s*/i, "")}?`,
        `Between the two standard page orientations, which one is ${lowerFirst(text).replace(/^page orientation in which the page is\s*/i, "")}?`,
        `Which page orientation is being described: ${lowerFirst(text)}?`,
      ], v);
    case "FORMULA_PREFIX":
      return pick([
        `Which symbol distinguishes a normal Excel formula entry from ordinary text or a plain number?`,
        `To indicate that an entry is a formula rather than normal cell content, which symbol is normally used first?`,
        `Which leading symbol is characteristic of an Excel formula?`,
      ], v);
    case "OPERATION_TO_OPERATOR":
      return pick([
        `Which arithmetic operator, rather than the symbols for the other basic operations, represents ${lowerFirst(text)} in Excel?`,
        `Identify the Excel operator specifically associated with ${lowerFirst(text)}.`,
        `Which operator correctly distinguishes ${lowerFirst(text)} from the other arithmetic operations?`,
      ], v);
    case "AUTOSUM_IDENTIFICATION":
      return pick([
        `AutoSum is associated with SUM rather than the other basic Excel functions. Which function does it normally insert?`,
        `Which function is the direct match for AutoSum, as opposed to AVERAGE, COUNT, MAX or MIN?`,
        `Among the basic Excel functions, which one is specifically linked with AutoSum?`,
      ], v);
    case "FUNCTION_FROM_PURPOSE":
      return pick([
        `Among SUM, AVERAGE, COUNT, MAX and MIN, which function is used to ${infinitive(text)}?`,
        `Which basic Excel function, rather than the other listed functions, matches this purpose: ${lowerFirst(text)}?`,
        `Identify the Excel function specifically associated with ${lowerFirst(text)}.`,
      ], v);
    case "REFERENCE_NOTATION_CLASSIFICATION":
      return pick([
        `Which notation is fully absolute rather than relative or mixed?`,
        `Which Excel reference locks both dimensions, not just one or neither?`,
        `Which reference should be distinguished as fully absolute?`,
      ], v);
    case "REFERENCE_TYPE_FROM_BEHAVIOR":
      return pick([
        `Which reference type, unlike the alternative basic type, ${lowerFirst(text)}?`,
        `Relative and absolute references behave differently when copied. Which type ${lowerFirst(text)}?`,
        `Which Excel reference category is identified by this copying behavior: ${lowerFirst(text)}?`,
      ], v);
    case "CHART_FROM_PURPOSE":
      return pick([
        `Among the basic line, pie and bar charts, which one is commonly associated with ${lowerFirst(text)}?`,
        `Which basic chart type is the intended choice for ${lowerFirst(text)}, given the alternatives?`,
        `Identify the chart type that best matches this elementary purpose: ${lowerFirst(text)}.`,
      ], v);
    default:
      return pick([
        `Which ${app} choice is correctly associated with ${lowerFirst(text || entity)}?`,
        `Distinguish the given alternatives: which one matches ${lowerFirst(text || entity)}?`,
        `Which option is the correct match for ${lowerFirst(text || entity)} in ${app}?`,
      ], v);
  }
}

function buildStem(question: Com003ReviewQuestion, family: Com003ExamSurfaceFamily, index: number) {
  switch (family) {
    case "DIRECT_RECALL": return directStem(question, index);
    case "FUNCTIONAL_APPLICATION": return upperFirst(functionalStem(question, index)).replace(/[.]$/, "?");
    case "EXAMPLE_RECOGNITION": return upperFirst(exampleStem(question, index)).replace(/[.]$/, "?");
    case "CONTRAST_DISCRIMINATION": return upperFirst(contrastStem(question, index)).replace(/[.]$/, "?");
  }
}

export function generateCom003ReviewQuestionV7(qlId: string, seed: string, index = 0): Com003ReviewQuestionV7 {
  const base = generateCom003ReviewQuestionV5(qlId, seed, index);
  const family = familyForIndex(index);
  return {
    ...base,
    questionId: base.questionId.replace("COM003-REVIEW-V5-", "COM003-REVIEW-V7-"),
    stem: buildStem(base, family, index),
    examSurfaceFamily: family,
    stemAuthority: "COM003_V7_EXAM_SURFACE_FAMILY_AUTHORITY",
  };
}

export function buildCom003EnglishReviewCorpusV7(options: { perQl?: number; seedPrefix?: string } = {}) {
  const perQl = options.perQl ?? 12;
  const seedPrefix = options.seedPrefix ?? "com003-review-v7";
  if (!Number.isInteger(perQl) || perQl < 1 || perQl > 48) throw new Error("perQl must be between 1 and 48");
  return COM003_PERMANENT_QLS.flatMap((ql) =>
    Array.from({ length: perQl }, (_, index) => generateCom003ReviewQuestionV7(ql.qlId, `${seedPrefix}:${ql.qlId}:${index}`, index)),
  );
}

export const COM003_ENGLISH_REVIEW_CORPUS_V7 = buildCom003EnglishReviewCorpusV7();
