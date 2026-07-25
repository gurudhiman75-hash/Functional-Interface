import { applyAvg001Cp003ExplanationAnswerEvidence } from "./cp003-explanation-answer-evidence";
import { applyAvg001Cp003ExplanationAuthorship } from "./cp003-explanation-authorship";
import { applyAvg001Cp003ExplanationFinalPolish } from "./cp003-explanation-final-polish";
import { applyAvg001ExplanationContract } from "./human-authored-explanation-contract";
import { finalizeAvg001ExplanationDepth } from "./human-authored-explanation-depth-finalizer";
import { finalizeAvg001ExplanationOpening } from "./human-authored-explanation-opening-finalizer";
import { finalizeAvg001ExplanationSymbols } from "./human-authored-explanation-symbol-finalizer";
import { applyAvg001HumanAuthoredExplanation as applyAuthoredPlanner } from "./human-authored-explanation-quality";
import type { Avg001QuestionPackage } from "./types";

function displayRaw(value: unknown) {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (value && typeof value === "object" && "numerator" in value && "denominator" in value) {
    const numerator = Number(value.numerator);
    const denominator = Number(value.denominator);
    if (denominator === 1) return String(numerator);
    const decimal = numerator / denominator;
    return Number.isInteger(decimal * 10) ? decimal.toFixed(1) : `${numerator}/${denominator}`;
  }
  return "";
}

function shown(pkg: Avg001QuestionPackage, key: string) {
  const rendered = pkg.parameters.renderVariables[key];
  return rendered !== undefined && rendered !== ""
    ? String(rendered)
    : displayRaw(pkg.parameters.values[key]);
}

function answerToken(pkg: Avg001QuestionPackage) {
  const match = String(pkg.answer)
    .replaceAll(",", "")
    .match(/-?\d+(?:\.\d+)?(?::-?\d+(?:\.\d+)?)?/);
  return match?.[0] ?? String(pkg.answer).trim();
}

function containsCalculatedAnswer(pkg: Avg001QuestionPackage, line: string) {
  const answer = answerToken(pkg);
  const compact = line.replaceAll(",", "").replaceAll(" ", "").replaceAll("₹", "");
  const marker = `=${answer}`;
  let index = compact.indexOf(marker);
  while (index >= 0) {
    const next = compact[index + marker.length] ?? "";
    if (!/[0-9.:]/.test(next)) return true;
    index = compact.indexOf(marker, index + 1);
  }
  return false;
}

function label(pkg: Avg001QuestionPackage, en: string, hi: string, pa: string) {
  if (pkg.language === "hi") return hi;
  if (pkg.language === "pa") return pa;
  return en;
}

function decisiveArithmetic(pkg: Avg001QuestionPackage) {
  const mode = pkg.solveMode;

  if (mode === "findMiddleTermFromAverage") {
    const first = shown(pkg, "firstTerm");
    const last = shown(pkg, "lastTerm");
    if (first && last) {
      return `$$${label(pkg, "Middle term", "मध्य पद", "ਮੱਧਲਾ ਪਦ")} = (${first} + ${last}) \\div 2 = ${pkg.answer}$$`;
    }
  }

  if (mode === "findExtremeFromAverageAndCount") {
    const count = shown(pkg, "count");
    const average = shown(pkg, "average");
    const difference = shown(pkg, "commonDifference");
    const target = String(pkg.parameters.values.targetExtreme ?? pkg.parameters.renderVariables.extremeLabel ?? "largest");
    if (count && average && difference) {
      const smallest = /small|least|min/i.test(target);
      const sign = smallest ? "-" : "+";
      const title = smallest
        ? label(pkg, "Smallest value", "सबसे छोटा मान", "ਸਭ ਤੋਂ ਛੋਟਾ ਮੁੱਲ")
        : label(pkg, "Largest value", "सबसे बड़ा मान", "ਸਭ ਤੋਂ ਵੱਡਾ ਮੁੱਲ");
      return `$$${title} = ${average} ${sign} [(${count} - 1) \\times ${difference} \\div 2] = ${pkg.answer}$$`;
    }
  }

  const currentTotal = shown(pkg, "currentTotal") || shown(pkg, "oldTotal");
  const newCount = shown(pkg, "newCount");

  if (mode === "findNewAverageAfterAddition") {
    const added = shown(pkg, "addedValue");
    if (currentTotal && newCount && added) {
      return `$$${label(pkg, "New average", "नया औसत", "ਨਵੀਂ ਔਸਤ")} = (${currentTotal} + ${added}) \\div ${newCount} = ${pkg.answer}$$`;
    }
  }

  if (mode === "findNewAverageAfterRemoval") {
    const removed = shown(pkg, "removedValue");
    if (currentTotal && newCount && removed) {
      return `$$${label(pkg, "New average", "नया औसत", "ਨਵੀਂ ਔਸਤ")} = (${currentTotal} - ${removed}) \\div ${newCount} = ${pkg.answer}$$`;
    }
  }

  if (mode === "findNewAverageAfterReplacement") {
    const oldValue = shown(pkg, "oldValue");
    const newValue = shown(pkg, "newValue");
    const count = shown(pkg, "oldCount");
    if (currentTotal && count && oldValue && newValue) {
      return `$$${label(pkg, "New average", "नया औसत", "ਨਵੀਂ ਔਸਤ")} = (${currentTotal} - ${oldValue} + ${newValue}) \\div ${count} = ${pkg.answer}$$`;
    }
  }

  if (mode === "findGroupCountRatioFromCombinedAverage") {
    const lower = shown(pkg, "groupAverage1");
    const upper = shown(pkg, "groupAverage2");
    const combined = shown(pkg, "combinedAverage");
    if (lower && upper && combined) {
      return `$$${label(pkg, "Group-size ratio", "समूह-संख्या अनुपात", "ਸਮੂਹ-ਗਿਣਤੀ ਅਨੁਪਾਤ")} = (${upper} - ${combined}) : (${combined} - ${lower}) = ${pkg.answer}$$`;
    }
  }

  return undefined;
}

export function applyAvg001HumanAuthoredExplanation(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const planned = applyAuthoredPlanner(pkg);
  let arithmeticallyComplete = planned;

  if (!planned.explanation.lines.some((line) => containsCalculatedAnswer(pkg, line))) {
    const line = decisiveArithmetic(pkg);
    if (line) {
      const lines = [...planned.explanation.lines];
      lines.splice(Math.max(1, lines.length - 1), 0, line);
      arithmeticallyComplete = {
        ...planned,
        explanation: { lines: lines.slice(0, 8) },
      };
    }
  }

  const contextAuthored = applyAvg001Cp003ExplanationAuthorship(arithmeticallyComplete);
  const manuallyDifferentiated = applyAvg001Cp003ExplanationFinalPolish(contextAuthored);
  const answerComplete = applyAvg001Cp003ExplanationAnswerEvidence(manuallyDifferentiated);
  const contracted = applyAvg001ExplanationContract(answerComplete);
  const depthComplete = finalizeAvg001ExplanationDepth(contracted);
  const symbolComplete = finalizeAvg001ExplanationSymbols(depthComplete);
  return finalizeAvg001ExplanationOpening(symbolComplete);
}
