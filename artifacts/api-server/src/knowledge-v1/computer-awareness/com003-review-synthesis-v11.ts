import { COM003_EDITORIALLY_APPROVED_FACTS } from "./com003-editorial-fact-review";
import { buildCom003EnglishReviewCorpusV10, type Com003ReviewQuestionV10 } from "./com003-review-synthesis-v10";

export type Com003ReviewQuestionV11 = Omit<Com003ReviewQuestionV10, "stemAuthority"> & {
  stemAuthority: "COM003_V11_PLAIN_EXAM_LANGUAGE_AUTHORITY";
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

function targetEntity(question: Com003ReviewQuestionV10) {
  return compact(factById.get(question.targetFactId)?.entity.label.en ?? question.canonicalAnswer);
}

function targetText(question: Com003ReviewQuestionV10) {
  const fact = factById.get(question.targetFactId);
  return fact?.value.kind === "text" ? compact(fact.value.text.en) : "";
}

function appForQl(qlId: string) {
  const n = Number(qlId.match(/QL-(\d{3})$/)?.[1] ?? 0);
  if (n <= 3) return "Microsoft Office";
  if (n <= 7) return "Microsoft Word";
  if (n <= 15) return "Microsoft Excel";
  return "Microsoft PowerPoint";
}

function windowsLead(question: Com003ReviewQuestionV10) {
  return question.versionScoped ? `In Windows desktop ${appForQl(question.qlId)}, ` : "";
}

function pick(values: readonly string[], variant: number) {
  return values[variant % values.length]!;
}

function definitionStem(subject: string, text: string, app: string, variant: number) {
  const relation = lowerFirst(text);
  return pick([
    `Which ${subject} is described as ${relation}?`,
    `In ${app}, ${relation} refers to which ${subject}?`,
    `What is the ${subject} for ${relation}?`,
    `${upperFirst(relation)} refers to which ${subject}?`,
  ], variant);
}

function rewriteStem(question: Com003ReviewQuestionV10, variant: number) {
  const entity = targetEntity(question);
  const text = targetText(question);

  switch (question.surfaceMode) {
    case "APPLICATION_FROM_PURPOSE":
      return pick([
        `Which Microsoft Office application is used for ${lowerFirst(text)}?`,
        `Which Office application is mainly used for ${lowerFirst(text)}?`,
        `For ${lowerFirst(text)}, which Microsoft Office application is used?`,
        `Which Microsoft Office program is used for ${lowerFirst(text)}?`,
      ], variant);

    case "SHORTCUT_TO_ACTION":
    case "SHORTCUT_TO_SLIDESHOW_ACTION":
      return pick([
        `${windowsLead(question)}what is ${entity} used for?`,
        `${windowsLead(question)}what does ${entity} do?`,
        `${windowsLead(question)}${entity} is used for what?`,
        `${windowsLead(question)}what happens when ${entity} is pressed?`,
        `${windowsLead(question)}what is the function of ${entity}?`,
        `${windowsLead(question)}${entity} is the shortcut for what?`,
      ], variant);

    case "PAGE_ELEMENT_FROM_ROLE":
      return definitionStem("Word page element", text, "Microsoft Word", variant);

    case "COMPONENT_FROM_ROLE":
      return definitionStem("Mail Merge component", text, "Microsoft Word", variant);

    case "CREATION_CONCEPT_FROM_ROLE":
      return definitionStem("PowerPoint feature", text, "Microsoft PowerPoint", variant);

    case "EFFECT_FROM_SCOPE":
      return definitionStem("PowerPoint effect", text, "Microsoft PowerPoint", variant);

    default:
      return question.stem
        .replace(/ is used for which task\?/gi, " is used for what?")
        .replace(/ is used for which task\?/gi, " is used for what?")
        .replace(/ for which task\?/gi, " for what?")
        .replace(/which task is performed by ([^?]+)\?/gi, "what does $1 do?")
        .replace(/\btask\b/gi, "use")
        .replace(/\baction\b/gi, "use");
  }
}

function cleanStem(stem: string) {
  let value = stem.trim().replace(/\s+/g, " ");
  value = value
    .replace(/\?{2,}$/g, "?")
    .replace(/\.\?$/g, "?")
    .replace(/\bused for what\?$/i, "used for what?");
  if (!value.endsWith("?")) value = value.replace(/[.]$/, "") + "?";
  return upperFirst(value);
}

function rewriteCorpus(corpus: readonly Com003ReviewQuestionV10[]) {
  const occurrences = new Map<string, number>();
  return corpus.map((question, index): Com003ReviewQuestionV11 => {
    const key = `${question.qlId}:${question.targetFactId}`;
    const occurrence = occurrences.get(key) ?? 0;
    occurrences.set(key, occurrence + 1);
    return {
      ...question,
      questionId: `${question.questionId.replace("COM003-REVIEW-V10-", "COM003-REVIEW-V11-")}-${index + 1}`,
      stem: cleanStem(rewriteStem(question, occurrence)),
      stemAuthority: "COM003_V11_PLAIN_EXAM_LANGUAGE_AUTHORITY",
    };
  });
}

export function buildCom003EnglishReviewCorpusV11(options: { perQl?: number; seedPrefix?: string } = {}) {
  return rewriteCorpus(buildCom003EnglishReviewCorpusV10(options));
}

export const COM003_ENGLISH_REVIEW_CORPUS_V11 = buildCom003EnglishReviewCorpusV11();
