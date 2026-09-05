import { COM003_EDITORIALLY_APPROVED_FACTS } from "./com003-editorial-fact-review";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { generateCom003ReviewQuestionV4 } from "./com003-review-synthesis-v4";
import type { Com003ReviewQuestion } from "./com003-review-types";

const factById = new Map(COM003_EDITORIALLY_APPROVED_FACTS.map((fact) => [fact.factId, fact]));

function compact(value: string) {
  return value.trim().replace(/\s+/g, " ").replace(/[.]+$/, "");
}

function lowerFirst(value: string) {
  return value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value;
}

function targetEntity(question: Com003ReviewQuestion) {
  return compact(factById.get(question.targetFactId)?.entity.label.en ?? question.canonicalAnswer);
}

function targetText(question: Com003ReviewQuestion) {
  const fact = factById.get(question.targetFactId);
  if (!fact || fact.value.kind !== "text") return "";
  return compact(fact.value.text.en);
}

function indefiniteArticle(value: string) {
  return /^[aeiou]/i.test(value.trim()) ? "an" : "a";
}

const INFINITIVE_REPLACEMENTS: readonly [RegExp, string][] = [
  [/^inserts\b/i, "insert"],
  [/^duplicates\b/i, "duplicate"],
  [/^reverses\b/i, "reverse"],
  [/^reapplies\b/i, "reapply"],
  [/^opens\b/i, "open"],
  [/^saves\b/i, "save"],
  [/^copies\b/i, "copy"],
  [/^cuts\b/i, "cut"],
  [/^finds\b/i, "find"],
  [/^identifies\b/i, "identify"],
  [/^locates\b/i, "locate"],
  [/^replaces\b/i, "replace"],
  [/^combines\b/i, "combine"],
  [/^returns\b/i, "return"],
  [/^counts\b/i, "count"],
  [/^calculates\b/i, "calculate"],
  [/^sorts\b/i, "sort"],
  [/^filters\b/i, "filter"],
  [/^continues\b/i, "continue"],
  [/^changes\b/i, "change"],
  [/^keeps\b/i, "keep"],
  [/^starts\b/i, "start"],
  [/^adds\b/i, "add"],
  [/^moves\b/i, "move"],
  [/^controls\b/i, "control"],
  [/^applies\b/i, "apply"],
  [/^determines\b/i, "determine"],
  [/^specifies\b/i, "specify"],
  [/^sets\b/i, "set"],
  [/^displays\b/i, "display"],
  [/^automatically corrects\b/i, "automatically correct"],
  [/^is\b/i, "be"],
  [/^has\b/i, "have"],
];

function infinitive(value: string) {
  let result = lowerFirst(compact(value));
  for (const [pattern, replacement] of INFINITIVE_REPLACEMENTS) {
    if (pattern.test(result)) return result.replace(pattern, replacement);
  }
  return result;
}

function choose(values: readonly string[], index: number) {
  return values[index % values.length]!;
}

function windowsLead(question: Com003ReviewQuestion, application: "Microsoft Office" | "Microsoft Word" | "Microsoft Excel" | "Microsoft PowerPoint") {
  return question.versionScoped ? `In Windows desktop ${application}, ` : "";
}

function cleanFallbackStem(stem: string) {
  let value = stem.trim().replace(/\s+/g, " ");
  if (!/Windows desktop/i.test(value)) {
    value = value.replace(/^(?:In|For|Within|When)\b[^,]{1,78},\s*(?=(?:which|what|identify|select|choose)\b)/i, "");
  }
  value = value
    .replace(/\bprincipal task\b/gi, "task")
    .replace(/\bprincipal purpose\b/gi, "main purpose")
    .replace(/\bcorresponds to this action:\s*/gi, "is used to ")
    .replace(/\bin the stated Office (?:desktop )?context\b/gi, "in Microsoft Office")
    .replace(/\bin the stated Office environment\b/gi, "in Microsoft Office")
    .replace(/\ba Excel\b/g, "an Excel")
    .replace(/\ba Office\b/g, "an Office")
    .replace(/\bused to inserts\b/gi, "used to insert")
    .replace(/\bused to copies\b/gi, "used to copy")
    .replace(/\bused to cuts\b/gi, "used to cut")
    .replace(/\bused to saves\b/gi, "used to save")
    .replace(/\bused to opens\b/gi, "used to open");
  if (!/[?]$/.test(value)) value = value.replace(/[.]$/, "") + "?";
  return value;
}

function qlSpecificStem(question: Com003ReviewQuestion, index: number) {
  const entity = targetEntity(question);
  const text = targetText(question);
  const action = infinitive(text);

  switch (question.surfaceMode) {
    case "APPLICATION_FROM_PURPOSE":
      return choose([
        `Which Microsoft Office application is primarily used for ${text}?`,
        `Which Office application is best suited for ${text}?`,
        `For ${text}, which Microsoft Office application is used?`,
      ], index);

    case "SOFTWARE_CLASSIFICATION":
      return choose([
        `${entity} is classified as which type of software?`,
        `Which type of software is ${entity}?`,
        `${entity} belongs to which broad category of software?`,
      ], index);

    case "TYPE_TO_EXTENSION":
      return choose([
        `Which file extension is used for ${indefiniteArticle(text)} ${text}?`,
        `Which extension correctly identifies ${indefiniteArticle(text)} ${text}?`,
        `${indefiniteArticle(text).replace(/^./, (char) => char.toUpperCase())} ${text} normally uses which file extension?`,
      ], index);

    case "EXTENSION_TO_TYPE":
      return choose([
        `The file extension ${entity} is associated with which type of Office file?`,
        `A file with the extension ${entity} is which of the following?`,
        `Which file type is identified by the extension ${entity}?`,
      ], index);

    case "EFFECT_TO_COMMAND":
      return choose([
        `Which command ${lowerFirst(text)}?`,
        `Which Office command is used to ${action}?`,
        `To ${action}, which command should be used?`,
      ], index);

    case "COMMAND_TO_EFFECT":
      return choose([
        `What is the function of the ${entity} command?`,
        `The ${entity} command is used for which action?`,
        `What does the ${entity} command do?`,
      ], index);

    case "ACTION_TO_SHORTCUT":
      return choose([
        `${windowsLead(question, "Microsoft Office")}which keyboard shortcut is used to ${action}?`,
        `${windowsLead(question, "Microsoft Office")}to ${action}, which shortcut should be used?`,
        `${windowsLead(question, "Microsoft Office")}which shortcut performs the action “${action}”?`,
      ], index);

    case "SHORTCUT_TO_ACTION":
      return choose([
        `${windowsLead(question, "Microsoft Office")}what is the function of ${entity}?`,
        `${windowsLead(question, "Microsoft Office")}the shortcut ${entity} is used for which action?`,
        `${windowsLead(question, "Microsoft Office")}what does ${entity} do?`,
      ], index);

    case "EDIT_ACTION_FROM_EFFECT":
      return choose([
        `Which Microsoft Word editing command ${lowerFirst(text)}?`,
        `To ${action} in Word, which command should be used?`,
        `Which editing operation in Word is used to ${action}?`,
      ], index);

    case "FORMAT_CONTROL_FROM_EFFECT":
      return choose([
        `Which Word formatting option ${lowerFirst(text)}?`,
        `To ${action}, which text-formatting option should be used?`,
        `Which formatting control gives the selected text this effect: ${lowerFirst(text)}?`,
      ], index);

    case "ALIGNMENT_FROM_PROPERTY":
      return choose([
        `Which paragraph alignment ${lowerFirst(text)}?`,
        `Which alignment option matches this description: ${lowerFirst(text)}?`,
        `In Microsoft Word, ${lowerFirst(text)} describes which paragraph alignment?`,
      ], index);

    case "FORMATTING_SHORTCUT":
      return choose([
        `${windowsLead(question, "Microsoft Word")}which shortcut is used to ${action}?`,
        `${windowsLead(question, "Microsoft Word")}to ${action}, which keyboard shortcut should be used?`,
        `${windowsLead(question, "Microsoft Word")}which key combination performs this formatting action: ${action}?`,
      ], index);

    case "FEATURE_FROM_PURPOSE":
      if (question.qlId === "COM-003-QL-007") {
        return choose([
          `Which Microsoft Word feature ${lowerFirst(text)}?`,
          `Which Word feature is used to ${action}?`,
          `To ${action}, which feature of Microsoft Word should be used?`,
        ], index);
      }
      return choose([
        `Which Microsoft Word feature ${lowerFirst(text)}?`,
        `Which Word tool is used to ${action}?`,
        `To ${action}, which Word feature should be used?`,
      ], index);

    case "PURPOSE_FROM_FEATURE":
      return choose([
        `What is the main purpose of ${entity} in Microsoft Word?`,
        `The ${entity} feature in Word is used for which task?`,
        `What does ${entity} do in Microsoft Word?`,
      ], index);

    case "PAGE_ELEMENT_FROM_ROLE":
      return choose([
        `Which Microsoft Word page element ${lowerFirst(text)}?`,
        `Which page element is used to ${action}?`,
        `In Word, ${lowerFirst(text)} describes which page element?`,
      ], index);

    case "ORIENTATION_FROM_DIMENSIONS": {
      const shape = text.replace(/^page orientation in which the page is\s*/i, "");
      return choose([
        `Which page orientation is used when the page is ${shape}?`,
        `A page is ${shape}. Which orientation does it have?`,
        `In Microsoft Word, which orientation makes a page ${shape}?`,
      ], index);
    }

    case "COMPONENT_FROM_ROLE":
      return choose([
        `Which mail-merge component ${lowerFirst(text)}?`,
        `Which component of Mail Merge is used to ${action}?`,
        `In Mail Merge, ${lowerFirst(text)} describes which component?`,
      ], index);

    case "STRUCTURE_TERM_FROM_DEFINITION":
      return choose([
        `Which Excel term refers to ${lowerFirst(text)}?`,
        `In Microsoft Excel, what is ${lowerFirst(text)} called?`,
        `${text.charAt(0).toUpperCase()}${text.slice(1)} is the definition of which Excel term?`,
      ], index);

    case "CELL_ADDRESS_INTERPRETATION":
      return choose([
        `In Excel, what does ${entity} represent?`,
        `What does ${entity} indicate in an Excel cell reference?`,
        `In A1-style cell notation, ${entity} represents what?`,
      ], index);

    case "RANGE_RECOGNITION":
      return choose([
        `Which Excel notation represents ${lowerFirst(text)}?`,
        `How is ${lowerFirst(text)} written as an Excel range?`,
        `Which of the following is the correct range notation for ${lowerFirst(text)}?`,
      ], index);

    case "FORMULA_PREFIX":
      return choose([
        "Which symbol is normally used to begin a formula in Microsoft Excel?",
        "An Excel formula normally starts with which symbol?",
        "Which symbol tells Excel that an entry is a formula?",
      ], index);

    case "OPERATION_TO_OPERATOR":
      return choose([
        `Which operator is used for ${lowerFirst(text)} in an Excel formula?`,
        `In Excel, which arithmetic symbol represents ${lowerFirst(text)}?`,
        `Which symbol performs ${lowerFirst(text)} in an Excel formula?`,
      ], index);

    case "AUTOSUM_IDENTIFICATION":
      return choose([
        "The AutoSum command in Excel most commonly inserts which function?",
        "Which function is directly associated with the AutoSum command?",
        "Using AutoSum normally creates a formula based on which function?",
      ], index);

    case "FUNCTION_FROM_PURPOSE":
      return choose([
        `Which Excel function ${lowerFirst(text)}?`,
        `Which Excel function is used to ${action}?`,
        `To ${action}, which Excel function should be used?`,
      ], index);

    case "REFERENCE_NOTATION_CLASSIFICATION":
      return choose([
        "Which of the following is a fully absolute cell reference in Excel?",
        "Which Excel reference keeps both the column and row absolute?",
        "Which notation uses dollar signs to lock both the column and the row?",
      ], index);

    case "REFERENCE_TYPE_FROM_BEHAVIOR":
      return choose([
        `Which type of Excel cell reference ${lowerFirst(text)}?`,
        `Which reference type behaves this way when a formula is copied: ${lowerFirst(text)}?`,
        `In Excel, ${lowerFirst(text)} describes which reference type?`,
      ], index);

    case "FEATURE_FROM_EFFECT":
      return choose([
        `Which Excel feature ${lowerFirst(text)}?`,
        `Which Excel feature is used to ${action}?`,
        `To ${action} in a worksheet, which feature should be used?`,
      ], index);

    case "EFFECT_FROM_FEATURE":
      return choose([
        `What does the ${entity} feature do in Excel?`,
        `The Excel feature ${entity} is used for which task?`,
        `What is the effect of using ${entity} in a worksheet?`,
      ], index);

    case "OPERATION_FROM_EFFECT":
      return choose([
        `Which Excel row or column operation ${lowerFirst(text)}?`,
        `Which worksheet operation is used to ${action}?`,
        `In Excel, ${lowerFirst(text)} is the function of which row or column operation?`,
      ], index);

    case "CHART_FROM_PURPOSE":
      return choose([
        `Which chart type is commonly used to ${action}?`,
        `For ${lowerFirst(text)}, which Excel chart is generally used?`,
        `Which basic chart type best matches this purpose: ${lowerFirst(text)}?`,
      ], index);

    case "PRESENTATION_CONCEPT":
      return cleanFallbackStem(question.stem);

    case "CREATION_CONCEPT_FROM_ROLE":
      return choose([
        `Which PowerPoint feature ${lowerFirst(text)}?`,
        `Which PowerPoint concept is used to ${action}?`,
        `In PowerPoint, ${lowerFirst(text)} describes which feature?`,
      ], index);

    case "OBJECT_FROM_PURPOSE":
      return choose([
        `Which object should be inserted in PowerPoint to ${action}?`,
        `To ${action} on a slide, which object should be inserted?`,
        `Which PowerPoint object is used to ${action}?`,
      ], index);

    case "SHORTCUT_TO_SLIDESHOW_ACTION":
      return choose([
        `${windowsLead(question, "Microsoft PowerPoint")}what does ${entity} do during presentation setup?`,
        `${windowsLead(question, "Microsoft PowerPoint")}the shortcut ${entity} starts the slide show from where?`,
        `${windowsLead(question, "Microsoft PowerPoint")}what is the slide-show function of ${entity}?`,
      ], index);

    case "SLIDESHOW_ACTION_TO_SHORTCUT":
      return choose([
        `${windowsLead(question, "Microsoft PowerPoint")}which shortcut is used to ${action}?`,
        `${windowsLead(question, "Microsoft PowerPoint")}to ${action}, which key should be pressed?`,
        `${windowsLead(question, "Microsoft PowerPoint")}which key combination performs this slide-show action: ${action}?`,
      ], index);

    default:
      return cleanFallbackStem(question.stem);
  }
}

const GENERATORISH_EXPLANATION_TAILS = [
  /\s+Therefore, the required [^.]+ is [^.]+\.$/i,
  /\s+So [^.]+ is the [^.]+ that matches the question\.$/i,
  /\s+Hence, select [^.]+ as the correct [^.]+\.$/i,
  /\s+This makes [^.]+ the appropriate [^.]+ for the given prompt\.$/i,
  /\s+Accordingly, [^.]+ is the [^.]+ identified by the stated condition\.$/i,
  /\s+For this question, the matching [^.]+ is [^.]+\.$/i,
] as const;

function cleanExplanation(explanation: string) {
  let result = explanation.trim().replace(/\s+/g, " ");
  for (const pattern of GENERATORISH_EXPLANATION_TAILS) result = result.replace(pattern, "");
  return result
    .replace(/\ba Excel\b/g, "an Excel")
    .replace(/\ba Office\b/g, "an Office")
    .replace(/\bused to inserts\b/gi, "used to insert")
    .replace(/\bused to copies\b/gi, "used to copy")
    .replace(/\bused to cuts\b/gi, "used to cut")
    .replace(/\bused to saves\b/gi, "used to save")
    .replace(/\bused to opens\b/gi, "used to open");
}

export function generateCom003ReviewQuestionV5(qlId: string, seed: string, index = 0): Com003ReviewQuestion {
  const base = generateCom003ReviewQuestionV4(qlId, seed, index);
  return {
    ...base,
    questionId: base.questionId.replace("COM003-REVIEW-V4-", "COM003-REVIEW-V5-"),
    stem: qlSpecificStem(base, index),
    explanation: cleanExplanation(base.explanation),
  };
}

export function buildCom003EnglishReviewCorpusV5(options: { perQl?: number; seedPrefix?: string } = {}) {
  const perQl = options.perQl ?? 12;
  const seedPrefix = options.seedPrefix ?? "com003-review-v5";
  if (!Number.isInteger(perQl) || perQl < 1 || perQl > 50) throw new Error("perQl must be between 1 and 50");
  return COM003_PERMANENT_QLS.flatMap((ql) =>
    Array.from({ length: perQl }, (_, index) =>
      generateCom003ReviewQuestionV5(ql.qlId, `${seedPrefix}:${ql.qlId}:${index}`, index),
    ),
  );
}

export const COM003_ENGLISH_REVIEW_CORPUS_V5 = buildCom003EnglishReviewCorpusV5();
