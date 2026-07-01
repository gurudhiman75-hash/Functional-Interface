import {
  normalizeQuantV4Answer,
  renderQuantV4Answer,
  type QuantV4AnswerLike,
  type QuantV4CanonicalAnswer,
} from "../answers/answer-contract";
import type { EducationalRenderingInput, MathIllustration, MathIllustrationKind } from "./renderer-contracts";
import { extractReasoningNodes } from "./resolver-utils";

function inferKind(text: string, answer?: QuantV4CanonicalAnswer): MathIllustrationKind {
  if (answer) {
    if (answer.kind === "percentage") return "percentage";
    if (answer.kind === "fraction") return "fraction";
    if (answer.kind === "ratio") return "ratio";
    if (answer.kind === "currency") return "currency";
    if (answer.kind === "unit") return "unit";
    if (answer.kind === "symbolic") return "symbolic";
    return "numeric";
  }
  if (/%/.test(text)) return "percentage";
  if (/\d+\s*:\s*\d+/.test(text)) return "ratio";
  if (/\d+\s*\/\s*\d+/.test(text)) return "fraction";
  if (/[₹$€£¥]/.test(text)) return "currency";
  if (/[=<>]|\btherefore\b|\bso\b/i.test(text)) return "equation";
  return "numeric";
}

function sanitizeMath(value: string) {
  return value
    .replace(/₹/g, "\\text{₹}")
    .replace(/%/g, "\\%")
    .replace(/×/g, "\\times")
    .replace(/÷/g, "\\div")
    .trim();
}

function implication(expression: string, consequence: string) {
  const left = sanitizeMath(expression || consequence || "given");
  const right = sanitizeMath(consequence || expression || "required value");
  if (left === right) return `\\[\\Rightarrow ${right}\\]`;
  return `\\[${left} \\Rightarrow ${right}\\]`;
}

export function buildMathIllustrations(input: EducationalRenderingInput): MathIllustration[] {
  const canonical = input.canonicalAnswer ?? normalizeQuantV4Answer(input.answer as QuantV4AnswerLike);
  const nodes = extractReasoningNodes(input.reasoningGraph);
  const illustrations = nodes
    .map((node, index): MathIllustration => {
      const statement = String(node.statement ?? node.label ?? `Step ${index + 1}`);
      const expression = String(node.expression ?? node.value ?? statement);
      const consequence = String(node.consequence ?? node.value ?? statement);
      return {
        id: `MATH-${index + 1}`,
        kind: inferKind([statement, expression, consequence, node.unit].filter(Boolean).join(" ")),
        statement,
        mathjax: implication(expression, node.unit ? `${consequence} ${node.unit}` : consequence),
        consequence: node.unit ? `${consequence} ${node.unit}` : consequence,
        sourceNodeId: node.id,
      };
    });

  if (illustrations.length) return illustrations;

  const finalAnswer = renderQuantV4Answer(canonical);
  return [
    {
      id: "MATH-1",
      kind: inferKind(finalAnswer, canonical),
      statement: "Compute the required value step by step.",
      mathjax: implication("given values", finalAnswer),
      consequence: finalAnswer,
    },
  ];
}
