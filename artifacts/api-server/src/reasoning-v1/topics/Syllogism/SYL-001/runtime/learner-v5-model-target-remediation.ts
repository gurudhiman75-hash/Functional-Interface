import { classifyConclusionPrimary } from "../foundation/primary-solver";
import {
  modelSatisfiesConstraints,
  regionHas,
} from "../foundation/region-model";
import type {
  CanonicalConclusion,
  CanonicalModel,
  SylLocale,
  TermId,
} from "../foundation/types";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import type {
  SylLearnerExplanationModeV5,
  SylLearnerPresentationV5,
} from "./learner-v5-types";

const MODEL_MODES = new Set<SylLearnerExplanationModeV5>([
  "COUNTEREXAMPLE",
  "POSSIBILITY_MODEL",
  "DUAL_MODEL",
  "POSSIBLE_NOT_DEFINITE",
]);

const MODEL_DIAGRAM_MODES = new Set([
  "VENN_COUNTEREXAMPLE",
  "VENN_POSSIBILITY",
  "VENN_DUAL_MODEL",
]);

function clean(value: string): string {
  return value.trim().replace(/\s+/gu, " ").replace(/([.!?।])\1+/gu, "$1");
}

function withoutTerminal(value: string): string {
  return clean(value).replace(/[.!?।]+$/u, "");
}

function unique(values: readonly string[]): readonly string[] {
  return [...new Set(values.filter(Boolean))];
}

function quote(value: string): string {
  return `“${value}”`;
}

function joinNatural(values: readonly string[], locale: SylLocale): string {
  const labels = unique(values).map(quote);
  if (labels.length <= 1) return labels[0] ?? "";
  const conjunction = locale === "hi-IN" ? "और" : locale === "pa-IN" ? "ਅਤੇ" : "and";
  if (labels.length === 2) return `${labels[0]} ${conjunction} ${labels[1]}`;
  const comma = locale === "en-IN" ? "," : "";
  return `${labels.slice(0, -1).join(", ")}${comma} ${conjunction} ${labels.at(-1)}`;
}

function modelMemberSentence(
  memberTerms: readonly TermId[],
  termOrder: readonly TermId[],
  termLabels: Readonly<Record<TermId, string>>,
  locale: SylLocale,
): string {
  const memberSet = new Set(memberTerms);
  const insideLabels = memberTerms.map((term) => termLabels[term] ?? term);
  const outsideLabels = termOrder
    .filter((term) => !memberSet.has(term))
    .map((term) => termLabels[term] ?? term);

  if (insideLabels.length === 0) {
    if (locale === "hi-IN") return "एक सदस्य किसी भी नामित वर्ग में नहीं आता।";
    if (locale === "pa-IN") return "ਇੱਕ ਵਸਤੂ ਕਿਸੇ ਵੀ ਨਾਮਿਤ ਵਰਗ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੀ।";
    return "One possible member belongs to none of the named classes.";
  }

  const inside = joinNatural(insideLabels, locale);
  const outside = joinNatural(outsideLabels, locale);
  if (locale === "hi-IN") {
    const insideClass = insideLabels.length === 1 ? "वर्ग में" : "वर्गों में";
    const outsideClass = outsideLabels.length === 1 ? "वर्ग में" : "वर्गों में";
    return outside
      ? `एक सदस्य ${inside} ${insideClass} आता है, लेकिन ${outside} ${outsideClass} नहीं आता।`
      : `एक सदस्य ${inside} ${insideClass} आता है।`;
  }
  if (locale === "pa-IN") {
    const insideClass = insideLabels.length === 1 ? "ਵਰਗ ਵਿੱਚ" : "ਵਰਗਾਂ ਵਿੱਚ";
    const outsideClass = outsideLabels.length === 1 ? "ਵਰਗ ਵਿੱਚ" : "ਵਰਗਾਂ ਵਿੱਚ";
    return outside
      ? `ਇੱਕ ਵਸਤੂ ${inside} ${insideClass} ਆਉਂਦੀ ਹੈ, ਪਰ ${outside} ${outsideClass} ਨਹੀਂ ਆਉਂਦੀ।`
      : `ਇੱਕ ਵਸਤੂ ${inside} ${insideClass} ਆਉਂਦੀ ਹੈ।`;
  }
  const insideClass = insideLabels.length === 1 ? "class" : "classes";
  const outsideClass = outsideLabels.length === 1 ? "class" : "classes";
  return outside
    ? `One possible member belongs to the ${inside} ${insideClass} and not to the ${outside} ${outsideClass}.`
    : `One possible member belongs to the ${inside} ${insideClass}.`;
}

function describeModel(
  model: CanonicalModel,
  termLabels: Readonly<Record<TermId, string>>,
  locale: SylLocale,
): string {
  return unique(model.occupiedRegions.map((region) =>
    modelMemberSentence(region.memberTerms, model.termOrder, termLabels, locale))).join(" ");
}

function conclusionKey(conclusion: CanonicalConclusion): string {
  return `${conclusion.form}:${conclusion.subject}:${conclusion.predicate}`;
}

export interface SylModelTargetV5 {
  canonical: CanonicalConclusion;
  rendered: string;
  conclusionIndex: number;
}

export function resolveModelTargetV5(question: GeneratedSylQuestionV4): SylModelTargetV5 {
  const correctSemanticValue = question.options[question.correctIndex]?.semanticValue ?? "";
  const keyedIndex = question.structuredPrompt.conclusions.findIndex((conclusion) =>
    conclusionKey(conclusion) === correctSemanticValue);
  const conclusionIndex = keyedIndex >= 0 ? keyedIndex : 0;
  const canonical = question.structuredPrompt.conclusions[conclusionIndex];
  if (!canonical) {
    throw new Error(`${question.qlId}/${question.seed}/${question.locale}: missing model-target conclusion`);
  }
  return {
    canonical,
    rendered: withoutTerminal(
      question.conclusions[conclusionIndex]
      ?? question.options[question.correctIndex]?.text
      ?? canonical.conclusionId,
    ),
    conclusionIndex,
  };
}

export function modelSatisfiesConclusionV5(
  model: CanonicalModel,
  conclusion: CanonicalConclusion,
): boolean {
  const hasSubject = model.occupiedRegions.some((region) =>
    regionHas(model.termOrder, region.mask, conclusion.subject));
  const hasPredicate = model.occupiedRegions.some((region) =>
    regionHas(model.termOrder, region.mask, conclusion.predicate));
  const overlap = model.occupiedRegions.some((region) =>
    regionHas(model.termOrder, region.mask, conclusion.subject)
    && regionHas(model.termOrder, region.mask, conclusion.predicate));
  const subjectOutsidePredicate = model.occupiedRegions.some((region) =>
    regionHas(model.termOrder, region.mask, conclusion.subject)
    && !regionHas(model.termOrder, region.mask, conclusion.predicate));

  switch (conclusion.form) {
    case "ALL": return hasSubject && !subjectOutsidePredicate;
    case "NO": return hasSubject && hasPredicate && !overlap;
    case "SOME": return overlap;
    case "SOME_NOT": return subjectOutsidePredicate;
  }
}

export function modelSignatureV5(model: CanonicalModel): string {
  const masks = model.occupiedRegions.map((region) => region.mask).sort((left, right) => left - right);
  return `${model.termOrder.join(",")}|${masks.join(",")}`;
}

function modelCopy(
  locale: SylLocale,
  mode: SylLearnerExplanationModeV5,
  target: string,
  trueDescription: string | null,
  falseDescription: string | null,
): { lines: readonly string[]; conclusion: string } {
  if (locale === "hi-IN") {
    if (mode === "COUNTEREXAMPLE") return {
      lines: [`प्रति-उदाहरण: ${falseDescription} सभी कथन सही रहते हैं, लेकिन “${target}” असत्य है।`],
      conclusion: `इसलिए, “${target}” निश्चित रूप से नहीं निकलता।`,
    };
    if (mode === "POSSIBILITY_MODEL") return {
      lines: [`एक वैध मॉडल: ${trueDescription} इसमें “${target}” सत्य है, इसलिए यह संभव है।`],
      conclusion: `इसलिए, “${target}” संभव है, लेकिन निश्चित नहीं है।`,
    };
    return {
      lines: [
        `मॉडल 1 — निष्कर्ष सत्य: ${trueDescription} इससे सभी कथन सही रहते हैं और “${target}” सत्य होता है।`,
        `मॉडल 2 — निष्कर्ष असत्य: ${falseDescription} इससे सभी कथन सही रहते हैं और “${target}” असत्य होता है।`,
      ],
      conclusion: `इसलिए, “${target}” संभव है, लेकिन निश्चित नहीं है।`,
    };
  }
  if (locale === "pa-IN") {
    if (mode === "COUNTEREXAMPLE") return {
      lines: [`ਵਿਰੋਧੀ ਉਦਾਹਰਨ: ${falseDescription} ਸਾਰੇ ਕਥਨ ਸਹੀ ਰਹਿੰਦੇ ਹਨ, ਪਰ “${target}” ਗਲਤ ਹੈ।`],
      conclusion: `ਇਸ ਲਈ, “${target}” ਨਿਸ਼ਚਿਤ ਤੌਰ ’ਤੇ ਨਹੀਂ ਨਿਕਲਦਾ।`,
    };
    if (mode === "POSSIBILITY_MODEL") return {
      lines: [`ਇੱਕ ਵੈਧ ਮਾਡਲ: ${trueDescription} ਇਸ ਵਿੱਚ “${target}” ਸਹੀ ਹੈ, ਇਸ ਲਈ ਇਹ ਸੰਭਵ ਹੈ।`],
      conclusion: `ਇਸ ਲਈ, “${target}” ਸੰਭਵ ਹੈ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੈ।`,
    };
    return {
      lines: [
        `ਮਾਡਲ 1 — ਨਤੀਜਾ ਸਹੀ: ${trueDescription} ਇਸ ਵਿੱਚ ਸਾਰੇ ਕਥਨ ਸਹੀ ਰਹਿੰਦੇ ਹਨ ਅਤੇ “${target}” ਸਹੀ ਹੁੰਦਾ ਹੈ।`,
        `ਮਾਡਲ 2 — ਨਤੀਜਾ ਗਲਤ: ${falseDescription} ਇਸ ਵਿੱਚ ਸਾਰੇ ਕਥਨ ਸਹੀ ਰਹਿੰਦੇ ਹਨ ਅਤੇ “${target}” ਗਲਤ ਹੁੰਦਾ ਹੈ।`,
      ],
      conclusion: `ਇਸ ਲਈ, “${target}” ਸੰਭਵ ਹੈ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੈ।`,
    };
  }
  if (mode === "COUNTEREXAMPLE") return {
    lines: [`Counterexample: ${falseDescription} Every statement remains true, but “${target}” is false.`],
    conclusion: `Therefore, “${target}” does not definitely follow.`,
  };
  if (mode === "POSSIBILITY_MODEL") return {
    lines: [`One valid model: ${trueDescription} This makes “${target}” true, so it is possible.`],
    conclusion: `Therefore, “${target}” is possible, but not definite.`,
  };
  return {
    lines: [
      `Model 1 — conclusion true: ${trueDescription} This makes “${target}” true while preserving every statement.`,
      `Model 2 — conclusion false: ${falseDescription} This makes “${target}” false while preserving every statement.`,
    ],
    conclusion: `Therefore, “${target}” is possible, but not definite.`,
  };
}

function safeCaption(locale: SylLocale, mode: SylLearnerExplanationModeV5): string {
  if (locale === "hi-IN") {
    if (mode === "COUNTEREXAMPLE") return "यह एक वैध व्यवस्था है जिसमें सभी कथन सत्य रहते हैं और चिह्नित निष्कर्ष असत्य होता है। कथनों से सिद्ध न होने वाली दूरी या अलगाव केवल इस मॉडल की व्यवस्था है।";
    if (mode === "DUAL_MODEL" || mode === "POSSIBLE_NOT_DEFINITE") return "पहली वैध व्यवस्था में चिह्नित निष्कर्ष सत्य है और दूसरी में असत्य। कथनों से सिद्ध न होने वाली दूरी या अलगाव केवल मॉडल की व्यवस्था है।";
    return "यह एक वैध व्यवस्था है जिसमें चिह्नित निष्कर्ष सत्य है। कथनों से सिद्ध न होने वाली दूरी या अलगाव केवल इस मॉडल की व्यवस्था है।";
  }
  if (locale === "pa-IN") {
    if (mode === "COUNTEREXAMPLE") return "ਇਹ ਇੱਕ ਵੈਧ ਬਣਤਰ ਹੈ ਜਿਸ ਵਿੱਚ ਸਾਰੇ ਕਥਨ ਸਹੀ ਰਹਿੰਦੇ ਹਨ ਅਤੇ ਚੁਣਿਆ ਨਤੀਜਾ ਗਲਤ ਹੁੰਦਾ ਹੈ। ਕਥਨਾਂ ਨਾਲ ਸਾਬਤ ਨਾ ਹੋਈ ਦੂਰੀ ਜਾਂ ਵੱਖਰਾਪਣ ਸਿਰਫ਼ ਇਸ ਮਾਡਲ ਦੀ ਬਣਤਰ ਹੈ।";
    if (mode === "DUAL_MODEL" || mode === "POSSIBLE_NOT_DEFINITE") return "ਪਹਿਲੀ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਚੁਣਿਆ ਨਤੀਜਾ ਸਹੀ ਹੈ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ਗਲਤ। ਕਥਨਾਂ ਨਾਲ ਸਾਬਤ ਨਾ ਹੋਈ ਦੂਰੀ ਜਾਂ ਵੱਖਰਾਪਣ ਸਿਰਫ਼ ਮਾਡਲ ਦੀ ਬਣਤਰ ਹੈ।";
    return "ਇਹ ਇੱਕ ਵੈਧ ਬਣਤਰ ਹੈ ਜਿਸ ਵਿੱਚ ਚੁਣਿਆ ਨਤੀਜਾ ਸਹੀ ਹੈ। ਕਥਨਾਂ ਨਾਲ ਸਾਬਤ ਨਾ ਹੋਈ ਦੂਰੀ ਜਾਂ ਵੱਖਰਾਪਣ ਸਿਰਫ਼ ਇਸ ਮਾਡਲ ਦੀ ਬਣਤਰ ਹੈ।";
  }
  if (mode === "COUNTEREXAMPLE") return "This is one valid arrangement in which every statement remains true and the marked conclusion is false. Any separation not forced by the statements is only a modelling choice.";
  if (mode === "DUAL_MODEL" || mode === "POSSIBLE_NOT_DEFINITE") return "The first valid arrangement makes the marked conclusion true and the second makes it false. Any separation not forced by the statements is only a modelling choice.";
  return "This is one valid arrangement in which the marked conclusion is true. Any separation not forced by the statements is only a modelling choice.";
}

function countWords(values: readonly string[]): number {
  return values.join(" ").trim().split(/\s+/u).filter(Boolean).length;
}

function genuineEitherOr(question: GeneratedSylQuestionV4): boolean {
  return question.metadata.pairStatus === "EITHER_OR"
    || question.metadata.pairStatus === "EITHER_OR_FOLLOWS";
}

export function remediateModelTargetV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  termLabels: Readonly<Record<TermId, string>>,
): SylLearnerPresentationV5 {
  const mode = presentation.learnerExplanation.mode;
  let diagram = presentation.diagram;

  if (
    question.metadata.taskKind === "CLASSIFY_CONCLUSION_PAIR"
    && genuineEitherOr(question)
    && question.learnerPresentationV4.diagram.enabled
    && question.learnerPresentationV4.diagram.mode === "VENN_EITHER_OR"
    && diagram.omissionReason === "ANSWER_MODE_MISMATCH"
  ) {
    diagram = question.learnerPresentationV4.diagram;
  }

  if (!MODEL_MODES.has(mode)) {
    return {
      ...presentation,
      learnerExplanation: {
        ...presentation.learnerExplanation,
        showDiagram: diagram.enabled,
      },
      diagram,
    };
  }

  const target = resolveModelTargetV5(question);
  const termOrder = Object.keys(question.structuredPrompt.termKeysById).sort() as TermId[];
  const profile = classifyConclusionPrimary(
    question.structuredPrompt.normalizedConstraints,
    target.canonical,
    termOrder,
  );
  const trueModel = profile.witnessModel
    && modelSatisfiesConstraints(profile.witnessModel, question.structuredPrompt.normalizedConstraints)
    && modelSatisfiesConclusionV5(profile.witnessModel, target.canonical)
    ? profile.witnessModel
    : null;
  const falseModel = profile.counterModel
    && modelSatisfiesConstraints(profile.counterModel, question.structuredPrompt.normalizedConstraints)
    && !modelSatisfiesConclusionV5(profile.counterModel, target.canonical)
    ? profile.counterModel
    : null;

  const expectedModels = mode === "DUAL_MODEL" || mode === "POSSIBLE_NOT_DEFINITE" ? 2 : 1;
  const actualModels = mode === "COUNTEREXAMPLE"
    ? Number(Boolean(falseModel))
    : mode === "POSSIBILITY_MODEL"
      ? Number(Boolean(trueModel))
      : Number(Boolean(trueModel)) + Number(Boolean(falseModel));
  if (actualModels < expectedModels) {
    throw new Error(`${question.qlId}/${question.seed}/${question.locale}: canonical model remediation is incomplete for ${mode}`);
  }

  const copy = modelCopy(
    question.locale,
    mode,
    target.rendered,
    trueModel ? describeModel(trueModel, termLabels, question.locale) : null,
    falseModel ? describeModel(falseModel, termLabels, question.locale) : null,
  );

  const expectedSignature = mode === "COUNTEREXAMPLE" && falseModel
    ? modelSignatureV5(falseModel)
    : mode === "POSSIBILITY_MODEL" && trueModel
      ? modelSignatureV5(trueModel)
      : trueModel && falseModel
        ? `${modelSignatureV5(trueModel)}||${modelSignatureV5(falseModel)}`
        : null;

  if (
    diagram.enabled
    && MODEL_DIAGRAM_MODES.has(diagram.mode)
    && expectedSignature
    && diagram.modelSignature !== expectedSignature
  ) {
    diagram = {
      ...diagram,
      enabled: false,
      mode: "OMITTED_NOT_USEFUL",
      omissionReason: "MODEL_TARGET_MISMATCH",
      svg: null,
      caption: null,
      accessibleDescription: null,
      semanticSignature: `syl-v5:model-target-mismatch:${question.qlId}:${question.seed}`,
      modelSignature: null,
      answerSentenceEmbedded: false,
      diagramCount: 0,
    };
  } else if (diagram.enabled && MODEL_DIAGRAM_MODES.has(diagram.mode)) {
    const caption = safeCaption(question.locale, mode);
    diagram = {
      ...diagram,
      caption,
      accessibleDescription: caption,
    };
  }

  const wordCount = countWords([
    ...copy.lines,
    copy.conclusion,
    ...presentation.learnerExplanation.conclusionResults.map((result) => result.shortReason),
    presentation.learnerExplanation.existenceNote ?? "",
  ]);

  return {
    ...presentation,
    learnerExplanation: {
      ...presentation.learnerExplanation,
      shortReasoning: copy.lines.map(clean),
      conclusion: clean(copy.conclusion),
      showDiagram: diagram.enabled,
      wordCount,
    },
    diagram,
    modelEvidence: {
      ...presentation.modelEvidence,
      required: true,
      canonicalModelCount: actualModels,
      source: mode === "COUNTEREXAMPLE"
        ? "COUNTERMODEL"
        : mode === "POSSIBILITY_MODEL"
          ? "CORRECT_PROOF_MODEL"
          : "TRUE_FALSE_MODELS",
    },
  };
}
