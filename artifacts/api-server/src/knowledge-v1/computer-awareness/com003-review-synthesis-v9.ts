import { COM003_EDITORIALLY_APPROVED_FACTS } from "./com003-editorial-fact-review";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { generateCom003ReviewQuestionV8, type Com003ReviewQuestionV8 } from "./com003-review-synthesis-v8";

export type Com003ReviewQuestionV9 = Omit<Com003ReviewQuestionV8, "stemAuthority"> & {
  stemAuthority: "COM003_V9_SIMPLE_EXAM_LANGUAGE_AUTHORITY";
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

function targetEntity(question: Com003ReviewQuestionV8) {
  return compact(factById.get(question.targetFactId)?.entity.label.en ?? question.canonicalAnswer);
}

function targetText(question: Com003ReviewQuestionV8) {
  const fact = factById.get(question.targetFactId);
  return fact?.value.kind === "text" ? compact(fact.value.text.en) : "";
}

const INFINITIVE_REPLACEMENTS: readonly [RegExp, string][] = [
  [/^inserts\b/i, "insert"], [/^duplicates\b/i, "duplicate"], [/^reverses\b/i, "reverse"],
  [/^reapplies\b/i, "reapply"], [/^opens\b/i, "open"], [/^saves\b/i, "save"],
  [/^copies\b/i, "copy"], [/^cuts\b/i, "cut"], [/^finds\b/i, "find"],
  [/^identifies\b/i, "identify"], [/^locates\b/i, "locate"], [/^replaces\b/i, "replace"],
  [/^combines\b/i, "combine"], [/^returns\b/i, "return"], [/^counts\b/i, "count"],
  [/^calculates\b/i, "calculate"], [/^sorts\b/i, "sort"], [/^filters\b/i, "filter"],
  [/^continues\b/i, "continue"], [/^changes\b/i, "change"], [/^keeps\b/i, "keep"],
  [/^starts\b/i, "start"], [/^adds\b/i, "add"], [/^moves\b/i, "move"],
  [/^controls\b/i, "control"], [/^applies\b/i, "apply"], [/^determines\b/i, "determine"],
  [/^specifies\b/i, "specify"], [/^sets\b/i, "set"], [/^displays\b/i, "display"],
  [/^removes\b/i, "remove"], [/^shows\b/i, "show"], [/^fills\b/i, "fill"],
  [/^orders\b/i, "order"], [/^compares\b/i, "compare"], [/^illustrates\b/i, "illustrate"],
  [/^visualizes\b/i, "visualize"], [/^represents\b/i, "represent"], [/^creates\b/i, "create"],
  [/^contains\b/i, "contain"], [/^stores\b/i, "store"], [/^holds\b/i, "hold"],
  [/^automatically corrects\b/i, "automatically correct"], [/^is\b/i, "be"], [/^has\b/i, "have"],
];

function infinitive(value: string) {
  let result = lowerFirst(value);
  for (const [pattern, replacement] of INFINITIVE_REPLACEMENTS) {
    if (pattern.test(result)) return result.replace(pattern, replacement);
  }
  return result.replace(/^can be\s+/i, "be ");
}

function appForQl(qlId: string) {
  const n = Number(qlId.match(/QL-(\d{3})$/)?.[1] ?? 0);
  if (n <= 3) return "Microsoft Office";
  if (n <= 7) return "Microsoft Word";
  if (n <= 15) return "Microsoft Excel";
  return "Microsoft PowerPoint";
}

function windowsLead(question: Com003ReviewQuestionV8) {
  return question.versionScoped ? `In Windows desktop ${appForQl(question.qlId)}, ` : "";
}

function pick(values: readonly string[], index: number) {
  return values[index % values.length]!;
}

function relationStems(subject: string, text: string, app: string, index: number) {
  const relation = lowerFirst(text);
  return pick([
    `Which ${subject} ${relation}?`,
    `In ${app}, which ${subject} ${relation}?`,
    `Which of the following ${subject}s ${relation}?`,
  ], index);
}

function simpleStem(question: Com003ReviewQuestionV8, index: number) {
  const entity = targetEntity(question);
  const text = targetText(question);
  const action = infinitive(text);
  const app = appForQl(question.qlId);

  switch (question.surfaceMode) {
    case "APPLICATION_FROM_PURPOSE":
      return pick([
        `Which Microsoft Office application is used to ${action}?`,
        `Which Office application is mainly used to ${action}?`,
        `To ${action}, which Microsoft Office application is used?`,
      ], index);

    case "SOFTWARE_CLASSIFICATION":
      return pick([
        `Which type of software is ${entity}?`,
        `${entity} belongs to which type of software?`,
        `${entity} is an example of which type of software?`,
      ], index);

    case "TYPE_TO_EXTENSION":
      return pick([
        `Which file extension is used for ${lowerFirst(text)}?`,
        `${upperFirst(text)} uses which file extension?`,
        `What is the file extension for ${lowerFirst(text)}?`,
      ], index);

    case "EXTENSION_TO_TYPE":
      return pick([
        `The extension ${entity} is used for which type of Office file?`,
        `A file with the extension ${entity} is which type of Office file?`,
        `Which type of file uses the extension ${entity}?`,
      ], index);

    case "EFFECT_TO_COMMAND":
      return pick([
        `Which command ${lowerFirst(text)}?`,
        `Which command is used to ${action}?`,
        `To ${action}, which command is used?`,
      ], index);

    case "COMMAND_TO_EFFECT":
      return pick([
        `What is the function of ${entity}?`,
        `What is ${entity} used for?`,
        `The ${entity} command is used for which task?`,
      ], index);

    case "ACTION_TO_SHORTCUT":
    case "FORMATTING_SHORTCUT":
    case "SLIDESHOW_ACTION_TO_SHORTCUT":
      return pick([
        `${windowsLead(question)}which shortcut is used to ${action}?`,
        `${windowsLead(question)}which keyboard shortcut is used to ${action}?`,
        `${windowsLead(question)}to ${action}, which shortcut is used?`,
      ], index);

    case "SHORTCUT_TO_ACTION":
    case "SHORTCUT_TO_SLIDESHOW_ACTION":
      return pick([
        `${windowsLead(question)}what is ${entity} used for?`,
        `${windowsLead(question)}the shortcut ${entity} is used for which task?`,
        `${windowsLead(question)}what does the shortcut ${entity} do?`,
      ], index);

    case "DOCUMENT_CONCEPT":
      return pick([
        `Which Microsoft Word term refers to ${lowerFirst(text)}?`,
        `In Microsoft Word, what is ${lowerFirst(text)} called?`,
        `Which Word term is used for ${lowerFirst(text)}?`,
      ], index);

    case "EDIT_ACTION_FROM_EFFECT":
      return pick([
        `Which Word command ${lowerFirst(text)}?`,
        `Which Word command is used to ${action}?`,
        `To ${action} in Word, which command is used?`,
      ], index);

    case "FORMAT_CONTROL_FROM_EFFECT":
      return relationStems("Word formatting option", text, "Microsoft Word", index);

    case "ALIGNMENT_FROM_PROPERTY":
      return relationStems("paragraph alignment", text, "Microsoft Word", index);

    case "FEATURE_FROM_PURPOSE":
      return relationStems(question.qlId === "COM-003-QL-007" ? "Mail Merge feature" : "Word feature", text, "Microsoft Word", index);

    case "PURPOSE_FROM_FEATURE":
      return pick([
        `What is ${entity} used for in Microsoft Word?`,
        `What does ${entity} do in Microsoft Word?`,
        `The ${entity} feature in Word is used for which task?`,
      ], index);

    case "PAGE_ELEMENT_FROM_ROLE":
      return relationStems("Word page element", text, "Microsoft Word", index);

    case "ORIENTATION_FROM_DIMENSIONS": {
      const shape = lowerFirst(text).replace(/^page orientation in which the page is\s*/i, "");
      return pick([
        `Which page orientation is used when the page is ${shape}?`,
        `A page is ${shape}. Which orientation is this?`,
        `In Microsoft Word, which orientation makes the page ${shape}?`,
      ], index);
    }

    case "COMPONENT_FROM_ROLE":
      return relationStems("Mail Merge component", text, "Microsoft Word", index);

    case "STRUCTURE_TERM_FROM_DEFINITION":
      return pick([
        `In Excel, what is ${lowerFirst(text)} called?`,
        `Which Excel term refers to ${lowerFirst(text)}?`,
        `${upperFirst(text)} is called what in Excel?`,
      ], index);

    case "CELL_ADDRESS_INTERPRETATION":
      return pick([
        `In Excel, what does ${entity} represent?`,
        `What does ${entity} represent in Excel?`,
        `In an Excel cell reference, what does ${entity} mean?`,
      ], index);

    case "RANGE_RECOGNITION":
      return pick([
        `Which Excel range represents ${lowerFirst(text)}?`,
        `How is ${lowerFirst(text)} written as an Excel range?`,
        `Which range notation is used for ${lowerFirst(text)}?`,
      ], index);

    case "FORMULA_PREFIX":
      return pick([
        `Which symbol is used to begin a formula in Excel?`,
        `An Excel formula normally starts with which symbol?`,
        `Which symbol is typed first in an Excel formula?`,
      ], index);

    case "OPERATION_TO_OPERATOR":
      return pick([
        `Which symbol is used for ${lowerFirst(text)} in Excel?`,
        `In Excel, which operator is used for ${lowerFirst(text)}?`,
        `Which arithmetic symbol represents ${lowerFirst(text)} in Excel?`,
      ], index);

    case "AUTOSUM_IDENTIFICATION":
      return pick([
        `Which function is used by AutoSum in Excel?`,
        `AutoSum in Excel normally inserts which function?`,
        `Which Excel function is directly used by AutoSum?`,
      ], index);

    case "FUNCTION_FROM_PURPOSE":
      return relationStems("Excel function", text, "Microsoft Excel", index);

    case "REFERENCE_NOTATION_CLASSIFICATION":
      return pick([
        `Which of the following is an absolute cell reference in Excel?`,
        `Which Excel reference keeps both the row and column fixed?`,
        `Which cell reference locks both the row and column in Excel?`,
      ], index);

    case "REFERENCE_TYPE_FROM_BEHAVIOR":
      return relationStems("type of cell reference", text, "Microsoft Excel", index);

    case "FEATURE_FROM_EFFECT":
      return relationStems("Excel feature", text, "Microsoft Excel", index);

    case "EFFECT_FROM_FEATURE":
      return pick([
        `What is ${entity} used for in Excel?`,
        `What does ${entity} do in Excel?`,
        `The ${entity} feature in Excel is used for which task?`,
      ], index);

    case "OPERATION_FROM_EFFECT":
      return relationStems("Excel row or column operation", text, "Microsoft Excel", index);

    case "CHART_FROM_PURPOSE":
      return relationStems("Excel chart", text, "Microsoft Excel", index);

    case "PRESENTATION_CONCEPT":
      return pick([
        `Which PowerPoint term refers to ${lowerFirst(text)}?`,
        `In PowerPoint, what is ${lowerFirst(text)} called?`,
        `Which PowerPoint term is used for ${lowerFirst(text)}?`,
      ], index);

    case "CREATION_CONCEPT_FROM_ROLE":
      return relationStems("PowerPoint feature", text, "Microsoft PowerPoint", index);

    case "OBJECT_FROM_PURPOSE":
      return relationStems("PowerPoint object", text, "Microsoft PowerPoint", index);

    case "EFFECT_FROM_SCOPE":
      return relationStems("PowerPoint effect", text, "Microsoft PowerPoint", index);

    case "TIMING_CONCEPT_FROM_EFFECT":
      return relationStems("PowerPoint timing option", text, "Microsoft PowerPoint", index);

    default:
      return `What is the correct answer for ${lowerFirst(text || entity)}?`;
  }
}

function cleanStem(stem: string) {
  let value = stem.trim().replace(/\s+/g, " ");
  value = value
    .replace(/\bused to be inserted\b/gi, "used to insert")
    .replace(/\bused to can be\b/gi, "used to")
    .replace(/\bto be inserted\b/gi, "to insert")
    .replace(/\?{2,}$/g, "?")
    .replace(/\.\?$/g, "?");
  if (!value.endsWith("?")) value = value.replace(/[.]$/, "") + "?";
  return upperFirst(value);
}

export function generateCom003ReviewQuestionV9(qlId: string, seed: string, index = 0): Com003ReviewQuestionV9 {
  const base = generateCom003ReviewQuestionV8(qlId, seed, index);
  return {
    ...base,
    questionId: base.questionId.replace("COM003-REVIEW-V8-", "COM003-REVIEW-V9-"),
    stem: cleanStem(simpleStem(base, index)),
    stemAuthority: "COM003_V9_SIMPLE_EXAM_LANGUAGE_AUTHORITY",
  };
}

export function buildCom003EnglishReviewCorpusV9(options: { perQl?: number; seedPrefix?: string } = {}) {
  const perQl = options.perQl ?? 12;
  const seedPrefix = options.seedPrefix ?? "com003-review-v9";
  if (!Number.isInteger(perQl) || perQl < 1 || perQl > 48) throw new Error("perQl must be between 1 and 48");
  return COM003_PERMANENT_QLS.flatMap((ql) =>
    Array.from({ length: perQl }, (_, index) => generateCom003ReviewQuestionV9(ql.qlId, `${seedPrefix}:${ql.qlId}:${index}`, index)),
  );
}

export const COM003_ENGLISH_REVIEW_CORPUS_V9 = buildCom003EnglishReviewCorpusV9();
