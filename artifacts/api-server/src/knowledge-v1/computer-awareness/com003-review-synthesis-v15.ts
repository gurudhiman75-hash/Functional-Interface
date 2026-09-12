import { COM003_EDITORIALLY_APPROVED_FACTS } from "./com003-editorial-fact-review";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import {
  COM003_ENGLISH_REVIEW_CORPUS_V14,
  buildCom003EnglishReviewCorpusV14,
  type Com003ReviewQuestionV14,
} from "./com003-review-synthesis-v14";

export type Com003ReviewQuestionV15 = Omit<Com003ReviewQuestionV14, "stemAuthority"> & {
  stemAuthority: "COM003_V15_TARGET_FACT_SEMANTIC_AUTHORITY";
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

function pick(values: readonly string[], index: number) {
  return values[index % values.length]!;
}

function factFor(question: Com003ReviewQuestionV14) {
  const fact = factById.get(question.targetFactId);
  if (!fact) throw new Error(`COM003 V15 missing governed fact ${question.targetFactId}`);
  if (fact.value.kind !== "text") throw new Error(`COM003 V15 requires text fact ${question.targetFactId}`);
  return fact;
}

function entity(question: Com003ReviewQuestionV14) {
  return compact(factFor(question).entity.label.en);
}

function text(question: Com003ReviewQuestionV14) {
  const fact = factFor(question);
  if (fact.value.kind !== "text") throw new Error(`COM003 V15 requires text fact ${question.targetFactId}`);
  return compact(fact.value.text.en);
}

function directStem(question: Com003ReviewQuestionV14, variant: number) {
  const e = entity(question);
  const t = text(question);
  const lower = lowerFirst(t);

  switch (question.surfaceMode) {
    case "APPLICATION_FROM_PURPOSE":
      return pick([
        `Which Microsoft Office application is mainly used for ${lower}?`,
        `Which Office application is primarily meant for ${lower}?`,
        `For ${lower}, which Microsoft Office application is used?`,
      ], variant);
    case "SOFTWARE_CLASSIFICATION":
      return pick([
        `Which type of software is ${e}?`,
        `${e} belongs to which class of software?`,
        `How is ${e} classified in basic computer awareness?`,
      ], variant);
    case "TYPE_TO_EXTENSION":
      return pick([
        `Which file extension is used for ${lower}?`,
        `What is the file extension for ${lower}?`,
        `${upperFirst(t)} normally uses which file extension?`,
      ], variant);
    case "EXTENSION_TO_TYPE":
      return pick([
        `What type of Office file uses the extension ${e}?`,
        `A file ending in ${e} is which type of Office file?`,
        `Which Office file type is identified by ${e}?`,
      ], variant);
    case "EFFECT_TO_COMMAND":
      return pick([
        `Which command ${lower}?`,
        `Which Office command is used to ${lower.replace(/^(saves|opens|copies|cuts|finds|inserts|removes|reverses|reapplies)\b/i, (m) => ({ saves: "save", opens: "open", copies: "copy", cuts: "cut", finds: "find", inserts: "insert", removes: "remove", reverses: "reverse", reapplies: "reapply" } as Record<string,string>)[m.toLowerCase()] ?? m)}?`,
        `Which command matches this function: ${lower}?`,
      ], variant);
    case "COMMAND_TO_EFFECT":
      return pick([
        `What does the ${e} command do?`,
        `What is the function of the ${e} command?`,
        `The ${e} command is used for which purpose?`,
      ], variant);
    case "ACTION_TO_SHORTCUT":
    case "FORMATTING_SHORTCUT":
      return pick([
        `Which shortcut is used to ${lower}?`,
        `Which key combination performs this action: ${lower}?`,
        `What is the shortcut for ${lower}?`,
      ], variant);
    case "SHORTCUT_TO_ACTION":
    case "SHORTCUT_TO_SLIDESHOW_ACTION":
      return pick([
        `What does ${e} do?`,
        `Which action is performed by ${e}?`,
        `${e} is the shortcut for which action?`,
      ], variant);
    case "DOCUMENT_CONCEPT":
      if (question.targetFactId === "com003-word-word-processor") {
        return pick([
          "Which Microsoft application is primarily used for word processing?",
          "Which Microsoft Office program is a word-processing application?",
          "Which application is mainly used to create and edit text documents?",
        ], variant);
      }
      return pick([
        `Which Microsoft Word term refers to ${lower}?`,
        `In Microsoft Word, what is ${lower} called?`,
        `Which Word concept matches this description: ${lower}?`,
      ], variant);
    case "EDIT_ACTION_FROM_EFFECT":
      return pick([
        `Which Word command ${lower}?`,
        `Which editing command in Word matches this function: ${lower}?`,
        `Which Word operation is used for this purpose: ${lower}?`,
      ], variant);
    case "FORMAT_CONTROL_FROM_EFFECT":
      return pick([
        `Which Word formatting option ${lower}?`,
        `Which text-formatting control has this effect: ${lower}?`,
        `In Word, which formatting option matches this description: ${lower}?`,
      ], variant);
    case "ALIGNMENT_FROM_PROPERTY":
      return pick([
        `Which paragraph alignment ${lower}?`,
        `Which Word alignment matches this description: ${lower}?`,
        `Which alignment should be used when text ${lower}?`,
      ], variant);
    case "FEATURE_FROM_PURPOSE":
      return pick([
        `Which Word feature ${lower}?`,
        `Which Microsoft Word feature is used for this purpose: ${lower}?`,
        `Which Word tool matches this function: ${lower}?`,
      ], variant);
    case "PURPOSE_FROM_FEATURE":
      return pick([
        `What is ${e} used for in Microsoft Word?`,
        `What does ${e} do in Word?`,
        `What is the main purpose of ${e} in Word?`,
      ], variant);
    case "PAGE_ELEMENT_FROM_ROLE":
      return pick([
        `Which Word page element ${lower}?`,
        `Which page element in Word matches this description: ${lower}?`,
        `In Microsoft Word, which page element has this role: ${lower}?`,
      ], variant);
    case "ORIENTATION_FROM_DIMENSIONS": {
      const shape = lower.replace(/^page orientation in which the page is\s*/i, "");
      return pick([
        `Which page orientation is used when the page is ${shape}?`,
        `A page is ${shape}. Which orientation is this?`,
        `Which Word orientation makes a page ${shape}?`,
      ], variant);
    }
    case "COMPONENT_FROM_ROLE":
      return pick([
        `Which Mail Merge component ${lower}?`,
        `Which component of Mail Merge matches this role: ${lower}?`,
        `In Mail Merge, which component has this function: ${lower}?`,
      ], variant);
    case "STRUCTURE_TERM_FROM_DEFINITION":
      return pick([
        `Which Excel term refers to ${lower}?`,
        `In Excel, what is ${lower} called?`,
        `Which spreadsheet structure matches this definition: ${lower}?`,
      ], variant);
    case "CELL_ADDRESS_INTERPRETATION":
      return pick([
        `In Excel, what does ${e} represent?`,
        `What does ${e} mean in an Excel cell reference?`,
        `Which description correctly explains ${e} in Excel notation?`,
      ], variant);
    case "RANGE_RECOGNITION":
      return pick([
        `Which Excel range represents ${lower}?`,
        `How is ${lower} written as an Excel range?`,
        `Which range notation is used for ${lower}?`,
      ], variant);
    case "FORMULA_PREFIX":
      return pick([
        "Which symbol normally begins an Excel formula?",
        "An Excel formula normally starts with which symbol?",
        "Which symbol is typed first in a standard Excel formula?",
      ], variant);
    case "OPERATION_TO_OPERATOR":
      return pick([
        `Which operator is used for ${lower} in Excel?`,
        `In an Excel formula, which symbol represents ${lower}?`,
        `Which arithmetic operator performs ${lower} in Excel?`,
      ], variant);
    case "AUTOSUM_IDENTIFICATION":
      return pick([
        "Which function is normally inserted by AutoSum in Excel?",
        "AutoSum in Excel is directly associated with which function?",
        "Which Excel function does AutoSum normally use?",
      ], variant);
    case "FUNCTION_FROM_PURPOSE":
      return pick([
        `Which Excel function ${lower}?`,
        `Which Excel function matches this purpose: ${lower}?`,
        `Which function should be used in Excel when the requirement is to ${lower}?`,
      ], variant);
    case "REFERENCE_NOTATION_CLASSIFICATION":
      return pick([
        "Which of the following is a fully absolute cell reference in Excel?",
        "Which Excel reference keeps both the row and column absolute?",
        "Which notation locks both the row and column in Excel?",
      ], variant);
    case "REFERENCE_TYPE_FROM_BEHAVIOR":
      return pick([
        `Which type of Excel reference ${lower}?`,
        `Which cell-reference type has this behavior: ${lower}?`,
        `In Excel, ${lower} describes which reference type?`,
      ], variant);
    case "FEATURE_FROM_EFFECT":
      return pick([
        `Which Excel feature ${lower}?`,
        `Which Excel feature matches this effect: ${lower}?`,
        `Which worksheet feature has this function: ${lower}?`,
      ], variant);
    case "EFFECT_FROM_FEATURE":
      return pick([
        `What does ${e} do in Excel?`,
        `What is ${e} used for in Excel?`,
        `Which effect is produced by ${e} in a worksheet?`,
      ], variant);
    case "OPERATION_FROM_EFFECT":
      return pick([
        `Which Excel row or column operation ${lower}?`,
        `Which worksheet operation matches this effect: ${lower}?`,
        `Which Excel command or option has this function: ${lower}?`,
      ], variant);
    case "CHART_FROM_PURPOSE":
      return pick([
        `Which Excel chart is commonly used to ${lower}?`,
        `Which basic chart type matches this purpose: ${lower}?`,
        `For ${lower}, which Excel chart is commonly used?`,
      ], variant);
    case "PRESENTATION_CONCEPT":
      if (/^slide$/i.test(e)) {
        return pick([
          "What is an individual page of a PowerPoint presentation called?",
          "Which term names one page-like unit in PowerPoint?",
          "A single screen in a PowerPoint presentation is called what?",
        ], variant);
      }
      return pick([
        `Which PowerPoint term refers to ${lower}?`,
        `In PowerPoint, what is ${lower} called?`,
        `Which presentation concept matches this description: ${lower}?`,
      ], variant);
    case "CREATION_CONCEPT_FROM_ROLE":
      return pick([
        `Which PowerPoint feature ${lower}?`,
        `Which PowerPoint creation concept matches this role: ${lower}?`,
        `Which presentation feature has this function: ${lower}?`,
      ], variant);
    case "OBJECT_FROM_PURPOSE":
      return pick([
        `Which PowerPoint object ${lower}?`,
        `Which object can be inserted in PowerPoint for this purpose: ${lower}?`,
        `Which slide object matches this description: ${lower}?`,
      ], variant);
    case "EFFECT_FROM_SCOPE":
      return pick([
        `Which PowerPoint effect is ${lower}?`,
        `Which presentation effect matches this description: ${lower}?`,
        `Which PowerPoint effect has this scope: ${lower}?`,
      ], variant);
    case "TIMING_CONCEPT_FROM_EFFECT":
      return pick([
        `Which PowerPoint timing option ${lower}?`,
        `Which timing setting matches this effect: ${lower}?`,
        `Which PowerPoint timing concept has this function: ${lower}?`,
      ], variant);
    case "SLIDESHOW_ACTION_TO_SHORTCUT":
      return pick([
        `In Windows desktop PowerPoint, which shortcut is used to ${lower}?`,
        `Which PowerPoint shortcut performs this slide-show action: ${lower}?`,
        `What is the Windows desktop PowerPoint shortcut for ${lower}?`,
      ], variant);
    default:
      throw new Error(`COM003 V15 unsupported direct surface mode ${question.surfaceMode}:${question.questionId}`);
  }
}

const ENTITY_ANSWER_MODES = new Set([
  "APPLICATION_FROM_PURPOSE",
  "TYPE_TO_EXTENSION",
  "EFFECT_TO_COMMAND",
  "ACTION_TO_SHORTCUT",
  "FORMATTING_SHORTCUT",
  "DOCUMENT_CONCEPT",
  "EDIT_ACTION_FROM_EFFECT",
  "FORMAT_CONTROL_FROM_EFFECT",
  "ALIGNMENT_FROM_PROPERTY",
  "FEATURE_FROM_PURPOSE",
  "PAGE_ELEMENT_FROM_ROLE",
  "COMPONENT_FROM_ROLE",
  "STRUCTURE_TERM_FROM_DEFINITION",
  "RANGE_RECOGNITION",
  "OPERATION_TO_OPERATOR",
  "FUNCTION_FROM_PURPOSE",
  "REFERENCE_NOTATION_CLASSIFICATION",
  "REFERENCE_TYPE_FROM_BEHAVIOR",
  "FEATURE_FROM_EFFECT",
  "OPERATION_FROM_EFFECT",
  "CHART_FROM_PURPOSE",
  "PRESENTATION_CONCEPT",
  "CREATION_CONCEPT_FROM_ROLE",
  "OBJECT_FROM_PURPOSE",
  "EFFECT_FROM_SCOPE",
  "TIMING_CONCEPT_FROM_EFFECT",
  "SLIDESHOW_ACTION_TO_SHORTCUT",
]);

const TEXT_ANSWER_MODES = new Set([
  "EXTENSION_TO_TYPE",
  "COMMAND_TO_EFFECT",
  "SHORTCUT_TO_ACTION",
  "SHORTCUT_TO_SLIDESHOW_ACTION",
  "PURPOSE_FROM_FEATURE",
  "CELL_ADDRESS_INTERPRETATION",
  "EFFECT_FROM_FEATURE",
]);

export function expectedCom003V15Answer(question: Com003ReviewQuestionV14) {
  if (question.surfaceMode === "SOFTWARE_CLASSIFICATION") return "Application/productivity software";
  if (question.surfaceMode === "FORMULA_PREFIX") return "=";
  if (question.surfaceMode === "AUTOSUM_IDENTIFICATION") return "SUM";
  if (question.surfaceMode === "ORIENTATION_FROM_DIMENSIONS") return entity(question).replace(/ orientation$/i, "");
  if (ENTITY_ANSWER_MODES.has(question.surfaceMode)) return entity(question);
  if (TEXT_ANSWER_MODES.has(question.surfaceMode)) return text(question);
  throw new Error(`COM003 V15 has no answer-role authority for ${question.surfaceMode}:${question.questionId}`);
}

function rewriteCorpus(corpus: readonly Com003ReviewQuestionV14[]) {
  const directVariantByQl = new Map<string, number>();
  return corpus.map((question, index): Com003ReviewQuestionV15 => {
    const expected = compact(expectedCom003V15Answer(question));
    const actual = compact(question.canonicalAnswer);
    if (expected.toLowerCase() !== actual.toLowerCase()) {
      throw new Error(`COM003 V15 canonical answer contradicts target fact ${question.questionId}:${question.targetFactId}:expected=${expected}:actual=${actual}`);
    }

    let stem = question.stem;
    if (question.examSurfaceFamily === "DIRECT_RECALL") {
      const variant = directVariantByQl.get(question.qlId) ?? 0;
      directVariantByQl.set(question.qlId, variant + 1);
      stem = directStem(question, variant);
    }

    return {
      ...question,
      questionId: `${question.questionId.replace("COM003-REVIEW-V14-", "COM003-REVIEW-V15-")}-${index + 1}`,
      stem: upperFirst(stem).replace(/\s+\?/g, "?").replace(/[.]?$/, "?"),
      stemAuthority: "COM003_V15_TARGET_FACT_SEMANTIC_AUTHORITY",
    };
  });
}

export function buildCom003EnglishReviewCorpusV15(options: { perQl?: number; seedPrefix?: string } = {}) {
  return rewriteCorpus(buildCom003EnglishReviewCorpusV14(options));
}

export const COM003_ENGLISH_REVIEW_CORPUS_V15 = rewriteCorpus(COM003_ENGLISH_REVIEW_CORPUS_V14);

export function auditCom003V15() {
  const issues: string[] = [];
  for (const ql of COM003_PERMANENT_QLS) {
    const qs = COM003_ENGLISH_REVIEW_CORPUS_V15.filter((q) => q.qlId === ql.qlId);
    if (qs.length !== 12) issues.push(`COUNT:${ql.qlId}:${qs.length}`);
    if (new Set(qs.map((q) => q.stem.toLowerCase())).size !== qs.length) issues.push(`DUPLICATE_STEM:${ql.qlId}`);
  }
  for (const question of COM003_ENGLISH_REVIEW_CORPUS_V15) {
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER_POSITION:${question.questionId}`);
    if (compact(expectedCom003V15Answer(question)).toLowerCase() !== compact(question.canonicalAnswer).toLowerCase()) {
      issues.push(`SEMANTIC_ANSWER:${question.questionId}:${question.targetFactId}`);
    }
  }
  return { valid: issues.length === 0, questions: COM003_ENGLISH_REVIEW_CORPUS_V15.length, qls: COM003_PERMANENT_QLS.length, issues };
}
