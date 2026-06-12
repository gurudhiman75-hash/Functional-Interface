import type { NsClass001MathJaxFields, NsClass001Parameters } from "./types";

export const NS_CLASS_001_MATHJAX_KEYS = ["propertyWorkingLatex"] as const;

export function propertyWorkingLatex(parameters: NsClass001Parameters): NsClass001MathJaxFields {
  return {
    propertyWorkingLatex: `${parameters.questionLanguageId}: ${parameters.coverageBucket} \\Rightarrow ${parameters.answer}`,
  };
}

export function hasValidPropertyWorking(fields: NsClass001MathJaxFields) {
  return fields.propertyWorkingLatex.length > 0;
}

export function verifyFixtureAnswer(parameters: NsClass001Parameters) {
  return parameters.answer.length > 0 && parameters.coverageBucket.length > 0 && parameters.variableRange.length > 0;
}
