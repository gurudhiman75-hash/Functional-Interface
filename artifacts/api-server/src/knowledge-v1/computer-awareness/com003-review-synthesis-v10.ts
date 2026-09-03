import { COM003_EDITORIALLY_APPROVED_FACTS } from "./com003-editorial-fact-review";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { generateCom003ReviewQuestionV8, type Com003ReviewQuestionV8 } from "./com003-review-synthesis-v8";

export type Com003ReviewQuestionV10 = Omit<Com003ReviewQuestionV8, "stemAuthority"> & {
  stemAuthority: "COM003_V10_SIMPLE_STANDARD_EXAM_AUTHORITY";
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

function pick(values: readonly string[], variant: number) {
  return values[variant % values.length]!;
}

function roleStem(subject: string, text: string, app: string, variant: number) {
  const relation = lowerFirst(text);
  return pick([
    `Which ${subject} ${relation}?`,
    `In ${app}, which ${subject} ${relation}?`,
    `${upperFirst(relation)}. Which ${subject} is this?`,
    `Which ${subject} is described as ${relation}?`,
  ], variant);
}

function simpleStem(question: Com003ReviewQuestionV8, variant: number) {
  const entity = targetEntity(question);
  const text = targetText(question);
  const action = infinitive(text);

  switch (question.surfaceMode) {
    case "APPLICATION_FROM_PURPOSE":
      return pick([
        `Which Microsoft Office application is used to ${action}?`,
        `Which Office application is mainly used to ${action}?`,
        `To ${action}, which Microsoft Office application is used?`,
        `Which Microsoft Office program is used to ${action}?`,
      ], variant);

    case "SOFTWARE_CLASSIFICATION":
      return pick([
        `Which type of software is ${entity}?`,
        `${entity} belongs to which type of software?`,
        `${entity} is an example of which type of software?`,
        `How is ${entity} classified?`,
      ], variant);

    case "TYPE_TO_EXTENSION":
      return pick([
        `Which file extension is used for ${lowerFirst(text)}?`,
        `${upperFirst(text)} uses which file extension?`,
        `What is the file extension for ${lowerFirst(text)}?`,
        `Which extension is normally used for ${lowerFirst(text)}?`,
      ], variant);

    case "EXTENSION_TO_TYPE":
      return pick([
        `The extension ${entity} is used for which type of Office file?`,
        `A file with the extension ${entity} is which type of Office file?`,
        `Which type of file uses the extension ${entity}?`,
        `What type of Office file has the extension ${entity}?`,
      ], variant);

    case "EFFECT_TO_COMMAND":
      return pick([
        `Which command ${lowerFirst(text)}?`,
        `Which command is used to ${action}?`,
        `To ${action}, which command is used?`,
        `What command is used to ${action}?`,
      ], variant);

    case "COMMAND_TO_EFFECT":
      return pick([
        `What is the function of ${entity}?`,
        `What is ${entity} used for?`,
        `The ${entity} command is used for which task?`,
        `What does the ${entity} command do?`,
      ], variant);

    case "ACTION_TO_SHORTCUT":
    case "FORMATTING_SHORTCUT":
    case "SLIDESHOW_ACTION_TO_SHORTCUT":
      return pick([
        `${windowsLead(question)}which shortcut is used to ${action}?`,
        `${windowsLead(question)}which keyboard shortcut is used to ${action}?`,
        `${windowsLead(question)}to ${action}, which shortcut is used?`,
        `${windowsLead(question)}what is the shortcut for ${action}?`,
        `${windowsLead(question)}which of the following shortcuts is used to ${action}?`,
        `${windowsLead(question)}which shortcut should be pressed to ${action}?`,
      ], variant);

    case "SHORTCUT_TO_ACTION":
    case "SHORTCUT_TO_SLIDESHOW_ACTION":
      return pick([
        `${windowsLead(question)}what is ${entity} used for?`,
        `${windowsLead(question)}the shortcut ${entity} is used for which task?`,
        `${windowsLead(question)}what does the shortcut ${entity} do?`,
        `${windowsLead(question)}what happens when ${entity} is pressed?`,
        `${windowsLead(question)}${entity} is the shortcut for which task?`,
        `${windowsLead(question)}which task is performed by ${entity}?`,
      ], variant);

    case "DOCUMENT_CONCEPT":
      return pick([
        `Which Microsoft Word term refers to ${lowerFirst(text)}?`,
        `In Microsoft Word, what is ${lowerFirst(text)} called?`,
        `Which Word term is used for ${lowerFirst(text)}?`,
        `${upperFirst(text)} is called what in Microsoft Word?`,
      ], variant);

    case "EDIT_ACTION_FROM_EFFECT":
      return pick([
        `Which Word command ${lowerFirst(text)}?`,
        `Which Word command is used to ${action}?`,
        `To ${action} in Word, which command is used?`,
        `What Word command is used to ${action}?`,
      ], variant);

    case "FORMAT_CONTROL_FROM_EFFECT":
      return roleStem("Word formatting option", text, "Microsoft Word", variant);
    case "ALIGNMENT_FROM_PROPERTY":
      return roleStem("paragraph alignment", text, "Microsoft Word", variant);
    case "FEATURE_FROM_PURPOSE":
      return roleStem(question.qlId === "COM-003-QL-007" ? "Mail Merge feature" : "Word feature", text, "Microsoft Word", variant);

    case "PURPOSE_FROM_FEATURE":
      return pick([
        `What is ${entity} used for in Microsoft Word?`,
        `What does ${entity} do in Microsoft Word?`,
        `The ${entity} feature in Word is used for which task?`,
        `What is the function of ${entity} in Word?`,
      ], variant);

    case "PAGE_ELEMENT_FROM_ROLE":
      return roleStem("Word page element", text, "Microsoft Word", variant);

    case "ORIENTATION_FROM_DIMENSIONS": {
      const shape = lowerFirst(text).replace(/^page orientation in which the page is\s*/i, "");
      return pick([
        `Which page orientation is used when the page is ${shape}?`,
        `A page is ${shape}. Which orientation is this?`,
        `In Microsoft Word, which orientation makes the page ${shape}?`,
        `What is the page orientation when the page is ${shape}?`,
      ], variant);
    }

    case "COMPONENT_FROM_ROLE":
      return roleStem("Mail Merge component", text, "Microsoft Word", variant);

    case "STRUCTURE_TERM_FROM_DEFINITION":
      return pick([
        `In Excel, what is ${lowerFirst(text)} called?`,
        `Which Excel term refers to ${lowerFirst(text)}?`,
        `${upperFirst(text)} is called what in Excel?`,
        `What is the Excel term for ${lowerFirst(text)}?`,
      ], variant);

    case "CELL_ADDRESS_INTERPRETATION":
      return pick([
        `In Excel, what does ${entity} represent?`,
        `What does ${entity} represent in Excel?`,
        `In an Excel cell reference, what does ${entity} mean?`,
        `The cell reference ${entity} represents what?`,
      ], variant);

    case "RANGE_RECOGNITION":
      return pick([
        `Which Excel range represents ${lowerFirst(text)}?`,
        `How is ${lowerFirst(text)} written as an Excel range?`,
        `Which range notation is used for ${lowerFirst(text)}?`,
        `What is the Excel range notation for ${lowerFirst(text)}?`,
      ], variant);

    case "FORMULA_PREFIX":
      return pick([
        `Which symbol is used to begin a formula in Excel?`,
        `An Excel formula normally starts with which symbol?`,
        `Which symbol is typed first in an Excel formula?`,
        `What symbol comes first in an Excel formula?`,
      ], variant);

    case "OPERATION_TO_OPERATOR":
      return pick([
        `Which symbol is used for ${lowerFirst(text)} in Excel?`,
        `In Excel, which operator is used for ${lowerFirst(text)}?`,
        `Which arithmetic symbol represents ${lowerFirst(text)} in Excel?`,
        `What symbol is used to perform ${lowerFirst(text)} in Excel?`,
      ], variant);

    case "AUTOSUM_IDENTIFICATION":
      return pick([
        `Which function is used by AutoSum in Excel?`,
        `AutoSum in Excel normally inserts which function?`,
        `Which Excel function is directly used by AutoSum?`,
        `What function does AutoSum normally use in Excel?`,
      ], variant);

    case "FUNCTION_FROM_PURPOSE":
      return roleStem("Excel function", text, "Microsoft Excel", variant);
    case "REFERENCE_NOTATION_CLASSIFICATION":
      return pick([
        `Which of the following is an absolute cell reference in Excel?`,
        `Which Excel reference keeps both the row and column fixed?`,
        `Which cell reference locks both the row and column in Excel?`,
        `Which notation is used for an absolute cell reference in Excel?`,
      ], variant);
    case "REFERENCE_TYPE_FROM_BEHAVIOR":
      return roleStem("type of cell reference", text, "Microsoft Excel", variant);
    case "FEATURE_FROM_EFFECT":
      return roleStem("Excel feature", text, "Microsoft Excel", variant);

    case "EFFECT_FROM_FEATURE":
      return pick([
        `What is ${entity} used for in Excel?`,
        `What does ${entity} do in Excel?`,
        `The ${entity} feature in Excel is used for which task?`,
        `What is the function of ${entity} in Excel?`,
      ], variant);

    case "OPERATION_FROM_EFFECT":
      return roleStem("Excel row or column operation", text, "Microsoft Excel", variant);
    case "CHART_FROM_PURPOSE":
      return roleStem("Excel chart", text, "Microsoft Excel", variant);

    case "PRESENTATION_CONCEPT":
      return pick([
        `Which PowerPoint term refers to ${lowerFirst(text)}?`,
        `In PowerPoint, what is ${lowerFirst(text)} called?`,
        `Which PowerPoint term is used for ${lowerFirst(text)}?`,
        `${upperFirst(text)} is called what in PowerPoint?`,
      ], variant);

    case "CREATION_CONCEPT_FROM_ROLE":
      return roleStem("PowerPoint feature", text, "Microsoft PowerPoint", variant);
    case "OBJECT_FROM_PURPOSE":
      return roleStem("PowerPoint object", text, "Microsoft PowerPoint", variant);
    case "EFFECT_FROM_SCOPE":
      return roleStem("PowerPoint effect", text, "Microsoft PowerPoint", variant);
    case "TIMING_CONCEPT_FROM_EFFECT":
      return roleStem("PowerPoint timing option", text, "Microsoft PowerPoint", variant);

    default:
      return `UNSUPPORTED SURFACE MODE: ${question.surfaceMode}?`;
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

function upgrade(base: Com003ReviewQuestionV8, variant: number, ordinal: number): Com003ReviewQuestionV10 {
  return {
    ...base,
    questionId: `${base.questionId.replace("COM003-REVIEW-V8-", "COM003-REVIEW-V10-")}-${ordinal + 1}`,
    stem: cleanStem(simpleStem(base, variant)),
    stemAuthority: "COM003_V10_SIMPLE_STANDARD_EXAM_AUTHORITY",
  };
}

export function generateCom003ReviewQuestionV10(qlId: string, seed: string, index = 0): Com003ReviewQuestionV10 {
  const base = generateCom003ReviewQuestionV8(qlId, seed, index);
  return upgrade(base, index, index);
}

function buildBalancedQl(qlId: string, perQl: number, seedPrefix: string) {
  const poolSize = Math.max(96, perQl * 12);
  const groups = new Map<string, Com003ReviewQuestionV8[]>();
  for (let attempt = 0; attempt < poolSize; attempt += 1) {
    const candidate = generateCom003ReviewQuestionV8(
      qlId,
      `${seedPrefix}:${qlId}:pool:${attempt}`,
      attempt % 12,
    );
    const group = groups.get(candidate.targetFactId) ?? [];
    group.push(candidate);
    groups.set(candidate.targetFactId, group);
  }

  const orderedGroups = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  if (orderedGroups.length === 0) throw new Error(`${qlId}: no reachable facts`);

  const offsets = new Map<string, number>();
  const occurrences = new Map<string, number>();
  const selected: Com003ReviewQuestionV10[] = [];

  while (selected.length < perQl) {
    let advanced = false;
    for (const [factId, candidates] of orderedGroups) {
      if (selected.length >= perQl) break;
      const offset = offsets.get(factId) ?? 0;
      if (offset >= candidates.length) continue;
      const base = candidates[offset]!;
      offsets.set(factId, offset + 1);
      const occurrence = occurrences.get(factId) ?? 0;
      occurrences.set(factId, occurrence + 1);
      selected.push(upgrade(base, occurrence, selected.length));
      advanced = true;
    }
    if (!advanced) throw new Error(`${qlId}: candidate pool exhausted before ${perQl} questions`);
  }

  return selected;
}

export function buildCom003EnglishReviewCorpusV10(options: { perQl?: number; seedPrefix?: string } = {}) {
  const perQl = options.perQl ?? 12;
  const seedPrefix = options.seedPrefix ?? "com003-review-v10";
  if (!Number.isInteger(perQl) || perQl < 1 || perQl > 48) throw new Error("perQl must be between 1 and 48");
  return COM003_PERMANENT_QLS.flatMap((ql) => buildBalancedQl(ql.qlId, perQl, seedPrefix));
}

export const COM003_ENGLISH_REVIEW_CORPUS_V10 = buildCom003EnglishReviewCorpusV10();
