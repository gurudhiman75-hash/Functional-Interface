import {
  formatExplanationSteps,
  validateExplanationPipeline,
  type ExplanationEvidence,
  type ExplanationRenderer,
  type ExplanationStep,
} from "../../../../../common/explanation-engine";
import { RAP_001_LIBRARY_REGISTRY, resolveRap001EntityVariables } from "./library";
import type {
  Rap001Explanation,
  Rap001Language,
  Rap001Parameters,
  Rap001SolverResult,
  Rap001TaskKind,
} from "./types";

type LocalizedLanguage = Exclude<Rap001Language, "en">;
type GrammarForm = "male_singular" | "female_singular" | "plural";

const PLURAL_ENTITY_IDS = new Set([
  "boys",
  "girls",
  "students",
  "teachers",
  "workers",
  "employees",
  "men",
  "women",
]);

const STEP_TEXT: Record<
  LocalizedLanguage,
  { goal: string; formula: string; substitution: string; simplification: string }
> = {
  hi: {
    goal: "\u0926\u093f\u092f\u093e \u0917\u092f\u093e \u0938\u0902\u092c\u0902\u0927",
    formula: "\u0928\u093f\u092f\u092e \u0932\u093f\u0916\u0947\u0902",
    substitution: "\u092e\u093e\u0928 \u0930\u0916\u0947\u0902",
    simplification: "\u0938\u0930\u0932 \u0915\u0930\u0947\u0902",
  },
  pa: {
    goal: "\u0a26\u0a3f\u0a71\u0a24\u0a3e \u0a38\u0a70\u0a2c\u0a70\u0a27",
    formula: "\u0a28\u0a3f\u0a2f\u0a2e \u0a32\u0a3f\u0a16\u0a4b",
    substitution: "\u0a2e\u0a41\u0a71\u0a32 \u0a30\u0a71\u0a16\u0a4b",
    simplification: "\u0a38\u0a30\u0a32 \u0a15\u0a30\u0a4b",
  },
};

function stripMathDelimiters(text: string) {
  return text
    .trim()
    .replace(/^\$\$\s*/, "")
    .replace(/\s*\$\$$/, "");
}

function answerText(answer: string) {
  return stripMathDelimiters(answer).replace(/\\%/g, "%");
}

function localizedVariables(parameters: Rap001Parameters) {
  return resolveRap001EntityVariables(
    parameters.variables,
    parameters.language,
    parameters.entityReferences,
  );
}

function numberValue(parameters: Rap001Parameters, name: string) {
  return Number(parameters.variables[name]);
}

function stringValue(values: Record<string, string | number>, name: string) {
  return String(values[name]);
}

function grammarFormForField(parameters: Rap001Parameters, fieldName: string): GrammarForm {
  const entity = parameters.semanticContext?.entities[fieldName];
  if (!entity) return "male_singular";
  if (PLURAL_ENTITY_IDS.has(entity.id)) return "plural";
  if (entity.gender === "female") return "female_singular";
  return "male_singular";
}

function localizedVerb(
  language: LocalizedLanguage,
  verbId: "save" | "do",
  form: GrammarForm,
) {
  const verbSet = RAP_001_LIBRARY_REGISTRY.semantic.grammarRules[language]?.verbs?.[verbId];
  return (
    verbSet?.[form] ??
    verbSet?.male_singular ??
    (language === "hi" ? "\u0915\u0930\u0924\u093e \u0939\u0948" : "\u0a15\u0a30\u0a26\u0a3e \u0a39\u0a48")
  );
}

function buildGivenLatex(
  taskKind: Rap001TaskKind,
  parameters: Rap001Parameters,
  values: Record<string, string | number>,
) {
  const n = (name: string) => numberValue(parameters, name);
  const s = (name: string) => stringValue(values, name);

  switch (taskKind) {
    case "simpleLinkage":
      return `${s("personA")}:${s("personB")}=${n("ratioA1")}:${n("ratioB1")},\\ ${s("personB")}:${s("personC")}=${n("ratioB2")}:${n("ratioC2")}`;
    case "ratioNormalization":
      return `\\frac{${n("numerator1")}}{${n("denominator1")}}:\\frac{${n("numerator2")}}{${n("denominator2")}}`;
    case "ratioTreeLinkage":
      return `${s("personA")}:${s("personB")}=${n("ratioA")}:${n("ratioB")},\\ ${s("personB")}:${s("personC")}=${n("ratioB_prime")}:${n("ratioC")},\\ ${s("personC")}:${s("personD")}=${n("ratioC_prime")}:${n("ratioD")}`;
    case "scalingByComponent":
      return `${s("personA")}:${s("personB")}=${n("ratioA")}:${n("ratioB")},\\ ${s("personA")}=${n("valueA")}`;
    case "decimalNormalization":
      return `${n("decimalA")}:${n("decimalB")}`;
    case "shareDifference":
      return `${s("personA")}:${s("personB")}:${s("personC")}=${n("ratioA")}:${n("ratioB")}:${n("ratioC")},\\ T=${n("totalAmount")}`;
    case "reversePartition":
      return `${s("personA")}:${s("personB")}:${s("personC")}=${n("ratioA")}:${n("ratioB")}:${n("ratioC")},\\ D=${n("shareDifference")}`;
    case "salaryDistribution":
      return `\\text{Exp:Sav}=${n("ratioExp")}:${n("ratioSav")},\\ S=${n("totalSalary")}`;
    case "twoStateAddition":
      return `${s("groupA")}:${s("groupB")}=${n("ratioA")}:${n("ratioB")},\\ +${n("addedCount")}\\ ${s("groupA")}`;
    case "twoStateSubtraction":
      return `${s("groupA")}:${s("groupB")}=${n("ratioA")}:${n("ratioB")},\\ -${n("removedCount")}\\ ${s("groupA")}`;
    case "twoStateTransfer":
      return `${n("ratioA")}:${n("ratioB")},\\ +${n("transferredCount")}`;
    case "incomeExpenditureSystem":
      return `${s("personA")}:${s("personB")}=${n("incomeRatioA")}:${n("incomeRatioB")},\\ ${n("expRatioA")}:${n("expRatioB")}`;
    case "multiStageTransformation":
      return `${n("ratioA")}:${n("ratioB")},\\ +${n("addedCount")},\\ -${n("removedCount")}`;
    case "meanProportional":
      return `${n("numA")},\\ ${n("numB")}`;
    case "thirdProportional":
      return `${n("numA")}:${n("numB")}=${n("numB")}:x`;
    case "fourthProportional":
      return `${n("numA")}:${n("numB")}=${n("numC")}:x`;
    case "directVariation":
      return `${s("varY")}\\propto ${s("varX")},\\ ${s("varX")}=${n("varX1")},\\ ${s("varY")}=${n("varY1")}`;
    case "inverseVariation":
      return `${s("varY")}\\propto \\frac{1}{${s("varX")}},\\ ${s("varX")}=${n("varX1")},\\ ${s("varY")}=${n("varY1")}`;
    case "coinCounting":
      return `${n("ratio1")}:${n("ratio2")}:${n("ratio3")},\\ V=${n("totalValue")}`;
    case "multiDenominationMapping":
      return `${n("valRatio1")}:${n("valRatio2")}:${n("valRatio3")}:${n("valRatio4")},\\ N=${n("totalCoins")}`;
    case "weightedMapping":
      return `${n("countA")}\\cdot${n("ratioA")}+${n("countB")}\\cdot${n("ratioB")}+${n("countC")}\\cdot${n("ratioC")}=${n("totalWeight")}`;
    case "weightedMarks":
      return `${n("ratio1")}:${n("ratio2")}:${n("ratio3")},\\ W=${n("totalScore")}`;
    case "binaryMixture":
      return `${s("liquid1")}:${s("liquid2")}=${n("ratio1")}:${n("ratio2")},\\ +${n("addedAmount")}\\ ${s("liquid1")}`;
    case "mixtureComponentFinding":
      return `${s("liquid1")}:${s("liquid2")}=${n("ratio1")}:${n("ratio2")},\\ T=${n("totalVolume")}`;
    case "threeComponentMixture":
      return `${s("liquid1")}:${s("liquid2")}:${s("liquid3")}=${n("ratio1")}:${n("ratio2")}:${n("ratio3")},\\ +${n("addedAmount")}\\ ${s("liquid2")}`;
    case "variableReplacementRatio":
      return `${n("initialVolume")}\\text{ L},\\ -${n("removedVolume1")}\\text{ L},\\ -${n("removedVolume2")}\\text{ L}`;
    case "acidConcentration":
      return `A=${n("acidVolume")},\\ W=${n("waterVolume")}`;
    default:
      throw new Error(`Unsupported localized RAP-001 taskKind: ${taskKind}`);
  }
}

function buildSubstitutionLatex(
  taskKind: Rap001TaskKind,
  parameters: Rap001Parameters,
  solver: Rap001SolverResult,
) {
  const n = (name: string) => numberValue(parameters, name);

  switch (taskKind) {
    case "simpleLinkage":
      return `${n("ratioA1")}\\times${n("ratioB2")}:${n("ratioB1")}\\times${n("ratioB2")}:${n("ratioB1")}\\times${n("ratioC2")}`;
    case "ratioNormalization":
      return `${n("numerator1")}\\times${n("denominator2")}:${n("denominator1")}\\times${n("numerator2")}`;
    case "ratioTreeLinkage":
      return `${n("ratioA")}\\times${n("ratioB_prime")}\\times${n("ratioC_prime")}:${n("ratioB")}\\times${n("ratioC")}\\times${n("ratioD")}`;
    case "scalingByComponent":
      return `\\frac{${n("valueA")}}{${n("ratioA")}}\\times${n("ratioB")}`;
    case "decimalNormalization":
      return `${n("decimalA")}\\times10:${n("decimalB")}\\times10`;
    case "shareDifference": {
      const sum = n("ratioA") + n("ratioB") + n("ratioC");
      return `\\frac{${n("totalAmount")}}{${sum}}\\times(${n("ratioA")}-${n("ratioC")})`;
    }
    case "reversePartition": {
      const diff = n("ratioA") - n("ratioC");
      const sum = n("ratioA") + n("ratioB") + n("ratioC");
      return `\\frac{${n("shareDifference")}}{${diff}}\\times${sum}`;
    }
    case "salaryDistribution":
      return `\\frac{${n("totalSalary")}}{${n("ratioExp") + n("ratioSav")}}\\times${n("ratioSav")}`;
    case "twoStateAddition":
      return `${n("finalRatioB")}(${n("ratioA")}x+${n("addedCount")})=${n("finalRatioA") * n("ratioB")}x`;
    case "twoStateSubtraction":
      return `${n("finalRatioB")}(${n("ratioA")}x-${n("removedCount")})=${n("finalRatioA") * n("ratioB")}x`;
    case "twoStateTransfer":
      return `${n("finalRatioB")}(${n("ratioA")}x+${n("transferredCount")})=${n("finalRatioA")}(${n("ratioB")}x-${n("transferredCount")})`;
    case "incomeExpenditureSystem":
      return `${n("incomeRatioA")}x-${n("expRatioA")}y=${n("savingsAmount")},\\ ${n("incomeRatioB")}x-${n("expRatioB")}y=${n("savingsAmount")}`;
    case "multiStageTransformation":
      return `${n("finalRatioB")}(${n("ratioA")}x+${n("addedCount")})=${n("finalRatioA")}(${n("ratioB")}x-${n("removedCount")})`;
    case "meanProportional":
      return `x=\\sqrt{${n("numA")}\\times${n("numB")}}`;
    case "thirdProportional":
      return `x=\\frac{${n("numB")}^2}{${n("numA")}}`;
    case "fourthProportional":
      return `x=\\frac{${n("numB")}\\times${n("numC")}}{${n("numA")}}`;
    case "directVariation":
      return `\\frac{${n("varY1")}}{${n("varX1")}}=\\frac{y}{${n("varX2")}}`;
    case "inverseVariation":
      return `${n("varX1")}\\times${n("varY1")}=${n("varX2")}\\times y`;
    case "coinCounting":
      return `x=\\frac{${n("totalValue")}}{${n("ratio1")}\\times${n("denom1")}+${n("ratio2")}\\times${n("denom2")}+${n("ratio3")}\\times${n("denom3")}}`;
    case "multiDenominationMapping":
      return `\\frac{${solver.evidence.countWeight1}}{1}:\\frac{${solver.evidence.countWeight2}}{1}:\\frac{${solver.evidence.countWeight3}}{1}:\\frac{${solver.evidence.countWeight4}}{1}`;
    case "weightedMapping":
      return `\\frac{${n("totalWeight")}}{${n("countA")}\\times${n("ratioA")}+${n("countB")}\\times${n("ratioB")}+${n("countC")}\\times${n("ratioC")}}`;
    case "weightedMarks":
      return `\\frac{${n("totalScore")}}{${n("ratio1")}\\times${n("w1")}+${n("ratio2")}\\times${n("w2")}+${n("ratio3")}\\times${n("w3")}}`;
    case "binaryMixture":
      return `${n("finalRatio2")}\\times${n("addedAmount")}\\div(${n("ratio2")}\\times${n("finalRatio1")}-${n("ratio1")}\\times${n("finalRatio2")})`;
    case "mixtureComponentFinding": {
      const initial1 = Number(solver.workingValues.initial1);
      const initial2 = Number(solver.workingValues.initial2);
      return `\\frac{${initial1}\\times${n("finalRatio2")}}{${n("finalRatio1")}}-${initial2}`;
    }
    case "threeComponentMixture": {
      const unit = Number(solver.workingValues.unit);
      return `${unit}\\times(${n("ratio1")}+${n("ratio2")}+${n("ratio3")})`;
    }
    case "variableReplacementRatio":
      return `\\left(1-\\frac{${n("removedVolume1")}}{${n("initialVolume")}}\\right)\\left(1-\\frac{${n("removedVolume2")}}{${n("initialVolume")}}\\right)`;
    case "acidConcentration":
      return `\\frac{${n("acidVolume")}}{${n("acidVolume") + n("waterVolume")}}\\times100`;
    default:
      throw new Error(`Unsupported localized RAP-001 taskKind: ${taskKind}`);
  }
}

function buildConclusion(
  language: LocalizedLanguage,
  taskKind: Rap001TaskKind,
  parameters: Rap001Parameters,
  values: Record<string, string | number>,
  solver: Rap001SolverResult,
) {
  const answer = answerText(solver.answer);
  const s = (name: string) => stringValue(values, name);

  if (language === "hi") {
    switch (taskKind) {
      case "simpleLinkage":
        return `\u0905\u0924\u0903 \u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u0905\u0928\u0941\u092a\u093e\u0924 ${answer} \u0939\u0948\u0964`;
      case "ratioNormalization":
      case "decimalNormalization":
        return `\u0905\u0924\u0903 \u0938\u0930\u0932 \u0905\u0928\u0941\u092a\u093e\u0924 ${answer} \u0939\u0948\u0964`;
      case "ratioTreeLinkage":
        return `\u0905\u0924\u0903 ${s("personA")} \u0914\u0930 ${s("personD")} \u0915\u093e \u0905\u0928\u0941\u092a\u093e\u0924 ${answer} \u0939\u0948\u0964`;
      case "scalingByComponent":
        return `\u0905\u0924\u0903 ${s("personB")} \u0915\u0940 \u0938\u0902\u0916\u094d\u092f\u093e ${answer} \u0939\u0948\u0964`;
      case "shareDifference":
        return `\u0905\u0924\u0903 ${s("personA")} \u0915\u094b ${s("personC")} \u0938\u0947 ${answer} \u0905\u0927\u093f\u0915 \u092e\u093f\u0932\u0924\u0947 \u0939\u0948\u0902\u0964`;
      case "reversePartition":
        return `\u0905\u0924\u0903 \u0915\u0941\u0932 \u0930\u093e\u0936\u093f ${answer} \u0939\u0948\u0964`;
      case "salaryDistribution": {
        const saveVerb = localizedVerb(language, "save", grammarFormForField(parameters, "personA"));
        return `\u0905\u0924\u0903 ${s("personA")} \u0939\u0930 \u092e\u0939\u0940\u0928\u0947 ${answer} \u0930\u0941\u092a\u092f\u0947 ${saveVerb}\u0964`;
      }
      case "twoStateAddition":
        return `\u0905\u0924\u0903 \u0936\u0941\u0930\u0941\u0906\u0924 \u092e\u0947\u0902 ${s("groupA")} \u0915\u0940 \u0938\u0902\u0916\u094d\u092f\u093e ${answer} \u0925\u0940\u0964`;
      case "twoStateSubtraction":
        return `\u0905\u0924\u0903 \u0936\u0941\u0930\u0941\u0906\u0924 \u092e\u0947\u0902 \u0915\u0941\u0932 ${answer} \u0932\u094b\u0917 \u0925\u0947\u0964`;
      case "twoStateTransfer":
        return `\u0905\u0924\u0903 \u092c\u0921\u093c\u0940 \u0938\u0902\u0916\u094d\u092f\u093e ${answer} \u0939\u0948\u0964`;
      case "incomeExpenditureSystem":
        return `\u0905\u0924\u0903 ${s("personA")} \u0915\u0940 \u0906\u092f ${answer} \u0939\u0948\u0964`;
      case "multiStageTransformation":
        return `\u0905\u0924\u0903 \u0936\u0941\u0930\u0941\u0906\u0924 \u092e\u0947\u0902 \u0932\u0921\u093c\u0915\u093f\u092f\u094b\u0902 \u0915\u0940 \u0938\u0902\u0916\u094d\u092f\u093e ${answer} \u0925\u0940\u0964`;
      case "meanProportional":
        return `\u0905\u0924\u0903 \u092e\u0927\u094d\u092f \u0905\u0928\u0941\u092a\u093e\u0924\u0940 ${answer} \u0939\u0948\u0964`;
      case "thirdProportional":
        return `\u0905\u0924\u0903 \u0924\u0940\u0938\u0930\u093e \u0905\u0928\u0941\u092a\u093e\u0924\u0940 ${answer} \u0939\u0948\u0964`;
      case "fourthProportional":
        return `\u0905\u0924\u0903 \u091a\u094c\u0925\u093e \u0905\u0928\u0941\u092a\u093e\u0924\u0940 ${answer} \u0939\u0948\u0964`;
      case "directVariation":
      case "inverseVariation":
        return `\u0905\u0924\u0903 ${s("varY")} \u0915\u093e \u092e\u093e\u0928 ${answer} \u0939\u0948\u0964`;
      case "coinCounting":
      case "multiDenominationMapping":
        return `\u0905\u0924\u0903 ${numberValue(parameters, "targetDenom")} \u0930\u0941\u092a\u092f\u0947 \u0935\u093e\u0932\u0947 \u0938\u093f\u0915\u094d\u0915\u094b\u0902 \u0915\u0940 \u0938\u0902\u0916\u094d\u092f\u093e ${answer} \u0939\u0948\u0964`;
      case "weightedMapping":
        return `\u0905\u0924\u0903 \u090f\u0915 ${s("itemA")} \u0915\u093e \u092d\u093e\u0930 ${answer} \u0915\u093f\u0932\u094b\u0917\u094d\u0930\u093e\u092e \u0939\u0948\u0964`;
      case "weightedMarks":
        return `\u0905\u0924\u0903 ${s("sub1")} \u092e\u0947\u0902 \u092a\u094d\u0930\u093e\u092a\u094d\u0924 \u0905\u0902\u0915 ${answer} \u0939\u0948\u0902\u0964`;
      case "binaryMixture":
        return `\u0905\u0924\u0903 \u0936\u0941\u0930\u0941\u0906\u0924 \u092e\u0947\u0902 ${s("liquid2")} \u0915\u0940 \u092e\u093e\u0924\u094d\u0930\u093e ${answer} \u0932\u0940\u091f\u0930 \u0925\u0940\u0964`;
      case "mixtureComponentFinding":
        return `\u0905\u0924\u0903 ${s("liquid2")} \u0915\u0947 ${answer} \u0932\u0940\u091f\u0930 \u0914\u0930 \u092e\u093f\u0932\u093e\u0928\u0947 \u0939\u094b\u0902\u0917\u0947\u0964`;
      case "threeComponentMixture":
        return `\u0905\u0924\u0903 \u0936\u0941\u0930\u0941\u0906\u0924\u0940 \u0915\u0941\u0932 \u092e\u093e\u0924\u094d\u0930\u093e ${answer} \u0932\u0940\u091f\u0930 \u0925\u0940\u0964`;
      case "variableReplacementRatio":
        return `\u0905\u0924\u0903 \u0905\u0902\u0924\u093f\u092e \u0905\u0928\u0941\u092a\u093e\u0924 ${answer} \u0939\u0948\u0964`;
      case "acidConcentration":
        return `\u0905\u0924\u0903 \u0905\u092e\u094d\u0932 \u0915\u093e \u092a\u094d\u0930\u0924\u093f\u0936\u0924 ${answer} \u0939\u0948\u0964`;
      default:
        throw new Error(`Unsupported localized RAP-001 taskKind: ${taskKind}`);
    }
  }

  switch (taskKind) {
    case "simpleLinkage":
      return `\u0a07\u0a38 \u0a32\u0a08 \u0a38\u0a3e\u0a02\u0a1d\u0a3e \u0a05\u0a28\u0a41\u0a2a\u0a3e\u0a24 ${answer} \u0a39\u0a48\u0964`;
    case "ratioNormalization":
    case "decimalNormalization":
      return `\u0a07\u0a38 \u0a32\u0a08 \u0a38\u0a2d \u0a24\u0a4b\u0a02 \u0a38\u0a30\u0a32 \u0a05\u0a28\u0a41\u0a2a\u0a3e\u0a24 ${answer} \u0a39\u0a48\u0964`;
    case "ratioTreeLinkage":
      return `\u0a07\u0a38 \u0a32\u0a08 ${s("personA")} \u0a05\u0a24\u0a47 ${s("personD")} \u0a26\u0a3e \u0a05\u0a28\u0a41\u0a2a\u0a3e\u0a24 ${answer} \u0a39\u0a48\u0964`;
    case "scalingByComponent":
      return `\u0a07\u0a38 \u0a32\u0a08 ${s("personB")} \u0a26\u0a40 \u0a17\u0a3f\u0a23\u0a24\u0a40 ${answer} \u0a39\u0a48\u0964`;
    case "shareDifference":
      return `\u0a07\u0a38 \u0a32\u0a08 ${s("personA")} \u0a28\u0a42\u0a70 ${s("personC")} \u0a28\u0a3e\u0a32\u0a4b\u0a02 ${answer} \u0a35\u0a71\u0a27 \u0a2e\u0a3f\u0a32\u0a26\u0a47 \u0a39\u0a28\u0964`;
    case "reversePartition":
      return `\u0a07\u0a38 \u0a32\u0a08 \u0a15\u0a41\u0a71\u0a32 \u0a30\u0a15\u0a2e ${answer} \u0a39\u0a48\u0964`;
    case "salaryDistribution": {
      const saveVerb = localizedVerb(language, "save", grammarFormForField(parameters, "personA"));
      return `\u0a07\u0a38 \u0a32\u0a08 ${s("personA")} \u0a39\u0a30 \u0a2e\u0a39\u0a40\u0a28\u0a47 ${answer} \u0a30\u0a41\u0a2a\u0a0f ${saveVerb}\u0964`;
    }
    case "twoStateAddition":
      return `\u0a07\u0a38 \u0a32\u0a08 \u0a38\u0a3c\u0a41\u0a30\u0a42 \u0a35\u0a3f\u0a71\u0a1a ${s("groupA")} \u0a26\u0a40 \u0a17\u0a3f\u0a23\u0a24\u0a40 ${answer} \u0a38\u0a40\u0964`;
    case "twoStateSubtraction":
      return `\u0a07\u0a38 \u0a32\u0a08 \u0a38\u0a3c\u0a41\u0a30\u0a42 \u0a35\u0a3f\u0a71\u0a1a \u0a15\u0a41\u0a71\u0a32 ${answer} \u0a32\u0a4b\u0a15 \u0a38\u0a28\u0964`;
    case "twoStateTransfer":
      return `\u0a07\u0a38 \u0a32\u0a08 \u0a35\u0a71\u0a21\u0a40 \u0a38\u0a70\u0a16\u0a3f\u0a06 ${answer} \u0a39\u0a48\u0964`;
    case "incomeExpenditureSystem":
      return `\u0a07\u0a38 \u0a32\u0a08 ${s("personA")} \u0a26\u0a40 \u0a06\u0a2e\u0a26\u0a28 ${answer} \u0a39\u0a48\u0964`;
    case "multiStageTransformation":
      return `\u0a07\u0a38 \u0a32\u0a08 \u0a38\u0a3c\u0a41\u0a30\u0a42 \u0a35\u0a3f\u0a71\u0a1a \u0a15\u0a41\u0a5c\u0a40\u0a06\u0a02 \u0a26\u0a40 \u0a17\u0a3f\u0a23\u0a24\u0a40 ${answer} \u0a38\u0a40\u0964`;
    case "meanProportional":
      return `\u0a07\u0a38 \u0a32\u0a08 \u0a2e\u0a71\u0a27 \u0a05\u0a28\u0a41\u0a2a\u0a3e\u0a24\u0a40 ${answer} \u0a39\u0a48\u0964`;
    case "thirdProportional":
      return `\u0a07\u0a38 \u0a32\u0a08 \u0a24\u0a40\u0a1c\u0a3e \u0a05\u0a28\u0a41\u0a2a\u0a3e\u0a24\u0a40 ${answer} \u0a39\u0a48\u0964`;
    case "fourthProportional":
      return `\u0a07\u0a38 \u0a32\u0a08 \u0a1a\u0a4c\u0a25\u0a3e \u0a05\u0a28\u0a41\u0a2a\u0a3e\u0a24\u0a40 ${answer} \u0a39\u0a48\u0964`;
    case "directVariation":
    case "inverseVariation":
      return `\u0a07\u0a38 \u0a32\u0a08 ${s("varY")} \u0a26\u0a3e \u0a2e\u0a41\u0a71\u0a32 ${answer} \u0a39\u0a48\u0964`;
    case "coinCounting":
    case "multiDenominationMapping":
      return `\u0a07\u0a38 \u0a32\u0a08 ${numberValue(parameters, "targetDenom")} \u0a30\u0a41\u0a2a\u0a0f \u0a35\u0a3e\u0a32\u0a47 \u0a38\u0a3f\u0a71\u0a15\u0a3f\u0a06\u0a02 \u0a26\u0a40 \u0a17\u0a3f\u0a23\u0a24\u0a40 ${answer} \u0a39\u0a48\u0964`;
    case "weightedMapping":
      return `\u0a07\u0a38 \u0a32\u0a08 \u0a07\u0a71\u0a15 ${s("itemA")} \u0a26\u0a3e \u0a2d\u0a3e\u0a30 ${answer} \u0a15\u0a3f\u0a32\u0a4b\u0a17\u0a4d\u0a30\u0a3e\u0a2e \u0a39\u0a48\u0964`;
    case "weightedMarks":
      return `\u0a07\u0a38 \u0a32\u0a08 ${s("sub1")} \u0a35\u0a3f\u0a71\u0a1a \u0a2a\u0a4d\u0a30\u0a3e\u0a2a\u0a24 \u0a05\u0a70\u0a15 ${answer} \u0a39\u0a28\u0964`;
    case "binaryMixture":
      return `\u0a07\u0a38 \u0a32\u0a08 \u0a38\u0a3c\u0a41\u0a30\u0a42 \u0a35\u0a3f\u0a71\u0a1a ${s("liquid2")} \u0a26\u0a40 \u0a2e\u0a3e\u0a24\u0a30\u0a3e ${answer} \u0a32\u0a40\u0a1f\u0a30 \u0a38\u0a40\u0964`;
    case "mixtureComponentFinding":
      return `\u0a07\u0a38 \u0a32\u0a08 ${s("liquid2")} \u0a26\u0a47 ${answer} \u0a32\u0a40\u0a1f\u0a30 \u0a39\u0a4b\u0a30 \u0a2e\u0a3f\u0a32\u0a3e\u0a09\u0a23\u0a47 \u0a2a\u0a48\u0a23\u0a17\u0a47\u0964`;
    case "threeComponentMixture":
      return `\u0a07\u0a38 \u0a32\u0a08 \u0a38\u0a3c\u0a41\u0a30\u0a42\u0a06\u0a24\u0a40 \u0a15\u0a41\u0a71\u0a32 \u0a2e\u0a3e\u0a24\u0a30\u0a3e ${answer} \u0a32\u0a40\u0a1f\u0a30 \u0a38\u0a40\u0964`;
    case "variableReplacementRatio":
      return `\u0a07\u0a38 \u0a32\u0a08 \u0a05\u0a70\u0a24\u0a3f\u0a2e \u0a05\u0a28\u0a41\u0a2a\u0a3e\u0a24 ${answer} \u0a39\u0a48\u0964`;
    case "acidConcentration":
      return `\u0a07\u0a38 \u0a32\u0a08 \u0a24\u0a47\u0a1c\u0a3c\u0a3e\u0a2c \u0a26\u0a3e \u0a2a\u0a4d\u0a30\u0a24\u0a40\u0a38\u0a3c\u0a24 ${answer} \u0a39\u0a48\u0964`;
    default:
      throw new Error(`Unsupported localized RAP-001 taskKind: ${taskKind}`);
  }
}

class LocalizedRap001ExplanationRenderer implements ExplanationRenderer {
  constructor(
    private readonly language: LocalizedLanguage,
    private readonly parameters: Rap001Parameters,
    private readonly solver: Rap001SolverResult,
    private readonly values: Record<string, string | number>,
  ) {}

  render(): ExplanationStep[] {
    const stepText = STEP_TEXT[this.language];
    const givenLatex = buildGivenLatex(this.parameters.taskKind, this.parameters, this.values);
    const substitutionLatex = buildSubstitutionLatex(this.parameters.taskKind, this.parameters, this.solver);
    const setupLatex = stripMathDelimiters(this.solver.mathJax.setupLatex ?? "");
    const calculationLatex = stripMathDelimiters(this.solver.mathJax.calculationLatex ?? this.solver.answer);

    return [
      { stepId: "step-1", type: "GOAL", narrative: stepText.goal, mathLatex: givenLatex },
      { stepId: "step-2", type: "FORMULA", narrative: stepText.formula, mathLatex: setupLatex },
      { stepId: "step-3", type: "SUBSTITUTION", narrative: stepText.substitution, mathLatex: substitutionLatex },
      { stepId: "step-4", type: "SIMPLIFICATION", narrative: stepText.simplification, mathLatex: calculationLatex },
      {
        stepId: "step-5",
        type: "CONCLUSION",
        narrative: buildConclusion(
          this.language,
          this.parameters.taskKind,
          this.parameters,
          this.values,
          this.solver,
        ),
      },
    ];
  }
}

export function renderLocalizedRap001Explanation(
  parameters: Rap001Parameters,
  solver: Rap001SolverResult,
): Rap001Explanation {
  const language = parameters.language as LocalizedLanguage;
  const values = localizedVariables(parameters);
  const evidence: ExplanationEvidence = {
    variables: values,
    derivedValues: solver.evidence,
    entities: Object.fromEntries(
      Object.entries(values).filter(([, value]) => typeof value === "string") as Array<[string, string]>,
    ),
    answer: solver.answer,
  };

  const renderer = new LocalizedRap001ExplanationRenderer(language, parameters, solver, values);
  const validatedSteps = validateExplanationPipeline(evidence, renderer);
  return {
    explanationId: parameters.explanationId,
    lines: formatExplanationSteps(validatedSteps),
  };
}
