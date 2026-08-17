import { normalizePremises } from "../foundation/normalization";
import type { SylLocale, TermId } from "../foundation/types";
import { analyzeScenario, conclusionSemanticKey } from "./analysis";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import { buildLearnerPresentationV4 } from "./learner-v4";
import { buildLearnerPresentationV5 } from "./learner-v5";
import { completeRequiredDiagramV5 } from "./learner-v5-diagram-completion";
import { createPrng, shuffle } from "./prng";
import { scenariosForGroup } from "./scenarios";
import { buildStructuredProofV3 } from "./structured-proof-v3";
import { assignTerms } from "./term-assignment";
import type {
  GeneratedSylQuestion,
  SylConclusionTeachingStep,
  SylExplanationTrace,
} from "./types";
import type {
  BankingPossibilityConclusionV1,
  BankingPossibilityShellQuestionV1,
} from "./banking-possibility-shell-v1";
import { renderBankingSupplementalPremiseVennV3 } from "./banking-possibility-supplemental-venn-v3";

export type BankingCombinedGeometrySourceV3 =
  | "APPROVED_V5_EXACT"
  | "SAFETY_GATED_SUPPLEMENTAL_TEMPLATE"
  | "OMITTED";

export interface BankingPossibilityCombinedDiagramV3 {
  schemaVersion: "banking-possibility-combined-diagram-v3";
  renderer: "V5_EXACT_WITH_SAFETY_GATED_SUPPLEMENTAL_TEMPLATES";
  geometrySource: BankingCombinedGeometrySourceV3;
  pipelineMode: "CONCLUSION_MASK";
  premiseOnly: true;
  enabled: boolean;
  omissionReason: string | null;
  svg: string | null;
  caption: string | null;
  accessibleDescription: string | null;
  semanticSignature: string;
  modelSignature: string | null;
  mobileViewBoxWidth: 340;
  diagramCount: 0 | 1;
}

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function neutralDiagramCopy(locale: SylLocale): { caption: string; description: string } {
  if (locale === "hi-IN") {
    return {
      caption: "कथनों का संयुक्त वेन आरेख। निष्कर्ष I और II दोनों को इसी एक व्यवस्था पर जाँचें।",
      description: "यह संयुक्त वेन व्यवस्था केवल दिए गए कथनों और उनसे अनिवार्य सदस्यता को दिखाती है। नीला × कथन से आवश्यक सदस्य को दर्शाता है। किसी अनकहे संबंध को अतिरिक्त निष्कर्ष न मानें।",
    };
  }
  if (locale === "pa-IN") {
    return {
      caption: "ਕਥਨਾਂ ਦਾ ਇਕੱਠਾ ਵੇਨ ਚਿੱਤਰ। ਨਤੀਜਾ I ਅਤੇ II ਦੋਵੇਂ ਨੂੰ ਇਸੇ ਇਕ ਬਣਤਰ ਉੱਤੇ ਜਾਂਚੋ।",
      description: "ਇਹ ਇਕੱਠੀ ਵੇਨ ਬਣਤਰ ਸਿਰਫ਼ ਦਿੱਤੇ ਕਥਨਾਂ ਅਤੇ ਉਨ੍ਹਾਂ ਤੋਂ ਲਾਜ਼ਮੀ ਮੈਂਬਰਸ਼ਿਪ ਨੂੰ ਦਿਖਾਉਂਦੀ ਹੈ। ਨੀਲਾ × ਕਥਨ ਤੋਂ ਲਾਜ਼ਮੀ ਮੈਂਬਰ ਦਿਖਾਉਂਦਾ ਹੈ। ਕਿਸੇ ਨਾ-ਕਹੇ ਸੰਬੰਧ ਨੂੰ ਵਾਧੂ ਨਤੀਜਾ ਨਾ ਮੰਨੋ।",
    };
  }
  return {
    caption: "Combined Venn diagram of the statements. Check Conclusions I and II on this same arrangement.",
    description: "This single Venn arrangement shows only the given statements and premise-required membership. A blue × marks a member required by the statements. Do not treat any unstated relation as an additional conclusion.",
  };
}

function retitleSvg(svg: string, caption: string, description: string): string {
  return svg
    .replace(/(<title\b[^>]*>)[\s\S]*?(<\/title>)/u, `$1${esc(caption)}$2`)
    .replace(/(<desc\b[^>]*>)[\s\S]*?(<\/desc>)/u, `$1${esc(description)}$2`)
    .replace(
      "<svg ",
      '<svg data-banking-combined-venn="true" data-premise-only="true" ',
    );
}

function statusStep(
  entry: BankingPossibilityConclusionV1,
  index: number,
): SylConclusionTeachingStep {
  const verdict = entry.mode === "POSSIBILITY"
    ? entry.follows ? "POSSIBILITY_ONLY" : "IMPOSSIBLE"
    : entry.classification === "ENTAILED"
      ? "DEFINITELY_FOLLOWS"
      : entry.classification === "CONTRADICTED"
        ? "IMPOSSIBLE"
        : "POSSIBILITY_ONLY";
  return {
    label: index === 0 ? "I" : "II",
    conclusion: entry.text,
    verdict,
    verdictLabel: verdict,
    reasoning: entry.mode === "POSSIBILITY"
      ? entry.follows
        ? "At least one valid arrangement permits this possibility."
        : "Every valid arrangement rules this possibility out."
      : entry.classification === "ENTAILED"
        ? "The relation is forced by the statements."
        : entry.classification === "CONTRADICTED"
          ? "The relation is ruled out by the statements."
          : "The relation is not guaranteed by the statements.",
    supportingPremiseIds: [],
  };
}

function legacyTrace(question: BankingPossibilityShellQuestionV1): SylExplanationTrace {
  const finalAnswer = question.options[question.correctIndex]?.text ?? question.semanticAnswer;
  return {
    schemaVersion: "syl-pedagogy-v2",
    tier1Concept: {
      heading: "Statements",
      coreRule: "Read all statements together before checking the two conclusions.",
      premiseBreakdown: question.statements.map((statement, index) => ({
        premiseId: `P${index + 1}`,
        statement,
        naturalRule: statement,
        compactRule: statement,
      })),
    },
    tier2StepByStep: {
      heading: "Conclusions",
      conclusionSteps: question.conclusions.map(statusStep),
      combinationSummary: finalAnswer,
    },
    tier3Shortcut: {
      heading: "Shortcut",
      shortcut: "Use one combined Venn arrangement for both conclusions.",
      application: "A possibility needs at least one valid arrangement; an ordinary conclusion must be forced in every valid arrangement.",
    },
    tier4Trap: {
      heading: "Trap",
      studentWarning: "Do not treat a possible relation as a definitely-following ordinary conclusion.",
      diagnosticTag: "BANKING_MIXED_POSSIBILITY",
    },
    finalAnswer,
    diagramRole: "FORCED_FACTS",
    diagramMode: "RELATION_CARDS",
    diagramTitle: "Combined Venn diagram",
    diagramCaption: "One combined premise arrangement is used for both conclusions.",
    overlappingVennSvg: "",
  };
}

function buildCarrierQuestion(
  question: BankingPossibilityShellQuestionV1,
): { carrier: GeneratedSylQuestionV4; assignment: ReturnType<typeof assignTerms> } {
  const scenario = scenariosForGroup(question.scenarioGroup).find((entry) =>
    entry.scenarioId === question.scenarioId);
  if (!scenario) throw new Error(`${question.scenarioId}: scenario missing for combined diagram.`);

  const analysis = analyzeScenario(scenario);
  const assignment = assignTerms("SYL-QL-005", question.seed, analysis.termOrder);
  const displayedPremises = shuffle(
    analysis.premises,
    createPrng(`SYL-PROTOTYPE-BANK-POSSIBILITY-001:${question.seed}:premises`),
  );
  const canonicalConclusions = question.conclusions.map((entry) => entry.canonicalConclusion);
  const evaluations = canonicalConclusions.map((conclusion) => {
    const candidate = analysis.candidates.find((entry) =>
      conclusionSemanticKey(entry) === `${conclusion.form}:${conclusion.subject}:${conclusion.predicate}`);
    if (!candidate) {
      throw new Error(`${question.scenarioId}: missing solver profile for ${conclusion.conclusionId}.`);
    }
    return candidate;
  });
  const termLabels = Object.fromEntries(
    analysis.termOrder.map((termId) => [termId, assignment[termId].labels[question.locale]]),
  ) as Readonly<Record<TermId, string>>;
  const termKeysById = Object.fromEntries(
    analysis.termOrder.map((termId) => [termId, assignment[termId].termKey]),
  ) as Readonly<Record<TermId, string>>;
  const followMask = (question.conclusions[0]?.follows ? 1 : 0)
    | (question.conclusions[1]?.follows ? 2 : 0);

  const structuredProofV3 = buildStructuredProofV3({
    qlId: "SYL-QL-008",
    checkpointId: "SYL-CP-004",
    seed: question.seed,
    locale: question.locale,
    scenarioId: question.scenarioId,
    sourcePatternId: question.sourcePatternId,
    taskKind: "TWO_CONCLUSION_FOLLOW_MASK",
    premises: analysis.premises,
    displayedPremises,
    statements: question.statements,
    conclusions: question.conclusions.map((entry) => entry.text),
    canonicalConclusions,
    conclusionProfiles: evaluations.map((candidate, index) => ({
      conclusion: candidate.conclusion,
      rendered: question.conclusions[index]?.text ?? candidate.conclusion.conclusionId,
      classification: candidate.profile.classification,
      canBeTrue: candidate.profile.canBeTrue,
      canBeFalse: candidate.profile.canBeFalse,
      witnessModel: candidate.profile.witnessModel,
      counterModel: candidate.profile.counterModel,
      verdictImpactPremiseIds: candidate.verdictImpactPremiseIds,
      modelImpactPremiseIds: candidate.impactPremiseIds,
    })),
    options: question.options,
    correctIndex: question.correctIndex,
    followMask,
    pairStatus: question.semanticAnswer,
    termLabels,
  });

  const reviewLogic: GeneratedSylQuestion["reviewLogic"] = {
    conclusionEvaluations: evaluations.map((candidate) => ({
      conclusionId: candidate.conclusion.conclusionId,
      classification: candidate.profile.classification,
      canBeTrue: candidate.profile.canBeTrue,
      canBeFalse: candidate.profile.canBeFalse,
      verdictImpactPremiseIds: candidate.verdictImpactPremiseIds,
      modelImpactPremiseIds: candidate.impactPremiseIds,
    })),
  };

  const base: GeneratedSylQuestion = {
    packageId: "SYL-001",
    checkpointId: "SYL-CP-004",
    qlId: "SYL-QL-008",
    permanentQlId: "SYL-QL-008",
    seed: question.seed,
    locale: question.locale,
    difficulty: analysis.scenario.baseDifficulty,
    renderer: "CONCLUSION_COMBINATION",
    answerType: "FOLLOW_MASK",
    semanticsProfileId: "INDIAN_COMPETITIVE_EXAM_SYLLOGISM_V1",
    sourcePatternId: question.sourcePatternId,
    scenarioId: question.scenarioId,
    stem: [
      ...question.statements.map((statement, index) => `${index + 1}. ${statement}`),
      ...question.conclusions.map((entry, index) => `${index === 0 ? "I" : "II"}. ${entry.text}`),
    ].join("\n"),
    structuredPrompt: {
      premises: analysis.premises,
      conclusions: canonicalConclusions,
      termKeysById,
      normalizedConstraints: normalizePremises(analysis.premises),
    },
    reviewLogic,
    statements: question.statements,
    conclusions: question.conclusions.map((entry) => entry.text),
    options: question.options,
    correctIndex: question.correctIndex,
    explanation: legacyTrace(question),
    metadata: {
      runtimeVersion: "syl-001-pedagogy-runtime-v2",
      taskKind: "TWO_CONCLUSION_FOLLOW_MASK",
      topology: analysis.scenario.topology,
      premiseForms: analysis.premises.map((premise) => premise.form),
      termKeys: analysis.termOrder.map((termId) => assignment[termId].termKey),
      selectedConclusionClasses: evaluations.map((candidate) => candidate.profile.classification),
      followMask,
      pairStatus: question.semanticAnswer,
      optionCount: 5,
      answerTemplateId: "BANK_FIVE_OPTION_V1",
      solverAgreementPassed: true,
      premiseRelevancePassed: true,
      ambiguityAuditPassed: true,
      deterministic: true,
      studentExplanationNaturalized: true,
      overlappingDiagramValidated: true,
      localePedagogyParityPassed: true,
      questionStudioVisible: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };

  const learnerPresentationV4 = buildLearnerPresentationV4(structuredProofV3, {
    qlId: base.qlId,
    sourcePatternId: base.sourcePatternId,
    scenarioId: base.scenarioId,
    locale: base.locale,
    taskKind: base.metadata.taskKind,
    displayedPremises,
    statements: base.statements,
    conclusions: base.conclusions,
    canonicalConclusions,
    termLabels,
    correctIndex: base.correctIndex,
    options: base.options,
    reviewLogic: base.reviewLogic,
    structuredPrompt: base.structuredPrompt,
  });

  return {
    carrier: {
      ...base,
      structuredProofV3,
      learnerPresentationV4,
    },
    assignment,
  };
}

export function renderBankingPossibilityCombinedDiagramV3(
  question: BankingPossibilityShellQuestionV1,
): BankingPossibilityCombinedDiagramV3 {
  const { carrier, assignment } = buildCarrierQuestion(question);
  const termOrder = Object.keys(carrier.structuredPrompt.termKeysById).sort() as TermId[];
  const termLabels = Object.fromEntries(
    termOrder.map((termId) => [termId, assignment[termId].labels[question.locale]]),
  ) as Readonly<Record<TermId, string>>;
  const v5 = buildLearnerPresentationV5(carrier, termLabels);
  if (v5.learnerExplanation.mode !== "CONCLUSION_MASK") {
    throw new Error(`${question.seed}/${question.locale}: combined diagram must remain premise-only CONCLUSION_MASK.`);
  }

  const primary = completeRequiredDiagramV5(carrier, v5, assignment).diagram;
  const supplemental = primary.enabled
    ? null
    : renderBankingSupplementalPremiseVennV3(carrier, v5, assignment);
  const completed = primary.enabled ? primary : supplemental ?? primary;
  const geometrySource: BankingCombinedGeometrySourceV3 = primary.enabled
    ? "APPROVED_V5_EXACT"
    : supplemental?.enabled
      ? "SAFETY_GATED_SUPPLEMENTAL_TEMPLATE"
      : "OMITTED";

  const copy = neutralDiagramCopy(question.locale);
  const svg = completed.enabled && completed.svg
    ? retitleSvg(completed.svg, copy.caption, copy.description)
    : null;
  const enabled = completed.enabled && Boolean(svg);

  return {
    schemaVersion: "banking-possibility-combined-diagram-v3",
    renderer: "V5_EXACT_WITH_SAFETY_GATED_SUPPLEMENTAL_TEMPLATES",
    geometrySource: enabled ? geometrySource : "OMITTED",
    pipelineMode: "CONCLUSION_MASK",
    premiseOnly: true,
    enabled,
    omissionReason: enabled ? null : completed.omissionReason,
    svg,
    caption: enabled ? copy.caption : null,
    accessibleDescription: enabled ? copy.description : null,
    semanticSignature: `${completed.semanticSignature}:banking-combined-v3:${geometrySource}`,
    modelSignature: completed.modelSignature,
    mobileViewBoxWidth: 340,
    diagramCount: enabled ? 1 : 0,
  };
}
