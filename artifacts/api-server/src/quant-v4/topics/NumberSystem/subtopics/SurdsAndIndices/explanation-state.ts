import type { SriCheckpointId } from "./discovery-types";

const CHECKPOINT_CONTEXT: Readonly<Record<SriCheckpointId, string>> = {
  "SRI-CP-001": "The question gives an expression built from integer powers.",
  "SRI-CP-002": "The question gives a power whose zero, negative, or fractional exponent must be interpreted over the real numbers.",
  "SRI-CP-003": "The given powers use related bases that can be rewritten using one common base.",
  "SRI-CP-004": "One or more exact power values are provided for a related transformation or parameter.",
  "SRI-CP-005": "An exponential equation or exact power relation is given.",
  "SRI-CP-006": "Power expressions or index-law statements are given for exact comparison.",
  "SRI-CP-007": "A radical expression is given for simplification or classification.",
  "SRI-CP-008": "A surd expression is given for exact arithmetic or classification.",
  "SRI-CP-009": "The given expression contains a radical denominator that can be rationalised.",
  "SRI-CP-010": "A nested or repeating radical relation is given.",
  "SRI-CP-011": "Surd expressions, bounds, or a radical equation are given for exact analysis.",
  "SRI-CP-012": "The given expression combines radical and fractional-index notation.",
};

function stripTerminalPunctuation(value: string): string {
  return value.trim().replace(/[?.!]+$/g, "").trim();
}

function sentence(prefix: string, body: string): string {
  const value = stripTerminalPunctuation(body);
  return `${prefix} ${value}.`;
}

function deriveVisibleGiven(stem: string): string | null {
  const text = stripTerminalPunctuation(stem);
  let match: RegExpExecArray | null;

  match = /^(?:Simplify|Evaluate|Denest|Rationalise)\s+(.+)$/i.exec(text);
  if (match) return sentence("The given expression is", match[1]!);

  match = /^(?:Find the value of|Find the exact value of)\s+(.+)$/i.exec(text);
  if (match) return sentence("The given expression is", match[1]!);

  match = /^Which (?:expression|option) is equivalent to\s+(.+)$/i.exec(text);
  if (match) return sentence("The given expression is", match[1]!);

  match = /^Which single power is equal to\s+(.+)$/i.exec(text);
  if (match) return sentence("The given product is", match[1]!);

  match = /^(?:Rewrite|Write)\s+(.+?)\s+(?:as|in)\b/i.exec(text);
  if (match) return sentence("The given expression is", match[1]!);

  match = /^(?:Use fractional-index laws to simplify|First reduce the radical, then simplify|First simplify the surd, then find)\s+(.+)$/i.exec(text);
  if (match) return sentence("The given expression is", match[1]!);

  match = /^Combine(?: the like surds:)?\s*(.+)$/i.exec(text);
  if (match) return sentence("The given surd expression is", match[1]!);

  match = /^Reduce(?: the quotient)?\s+(.+)$/i.exec(text);
  if (match) return sentence("The given expression is", match[1]!);

  match = /^Multiply(?: and simplify)?\s+(.+)$/i.exec(text);
  if (match) return sentence("The given product is", match[1]!);

  match = /^Find the rationalised form of\s+(.+)$/i.exec(text);
  if (match) return sentence("The given fraction is", match[1]!);

  match = /^Remove the cube root from the denominator of\s+(.+)$/i.exec(text);
  if (match) return sentence("The given fraction is", match[1]!);

  match = /^Use a conjugate to remove the radicals from the denominator of\s+(.+)$/i.exec(text);
  if (match) return sentence("The given fraction is", match[1]!);

  match = /^After rationalising\s+(.+?),\s+(?:identify|determine|calculate)\b/i.exec(text);
  if (match) return sentence("The fraction to rationalise is", match[1]!);

  match = /^Convert\s+(.+?)\s+to\b/i.exec(text);
  if (match) return sentence("The given expression is", match[1]!);

  match = /^Use radical form to find the exact value of\s+(.+)$/i.exec(text);
  if (match) return sentence("The given fractional-index expression is", match[1]!);

  match = /^Which is greater:\s+(.+)$/i.exec(text);
  if (match) return sentence("The two quantities to compare are", match[1]!);

  match = /^Without decimal approximation,\s*(?:compare|which is greater:)\s+(.+)$/i.exec(text);
  if (match) return sentence("The quantities to compare are", match[1]!);

  match = /^Without decimals?,\s*determine the order of\s+(.+)$/i.exec(text);
  if (match) return sentence("The quantities to compare are", match[1]!);

  match = /^Compare(?: exactly:)?\s+(.+?)(?:\s+exactly)?$/i.exec(text);
  if (match) return sentence("The quantities to compare are", match[1]!);

  match = /^The two expressions have the same exponent\s+[^.]+\.\s*Compare\s+(.+)$/i.exec(text);
  if (match) return sentence("The quantities to compare are", match[1]!);

  match = /^Which relation is correct for\s+(.+)$/i.exec(text);
  if (match) return sentence("The two quantities are", match[1]!);

  match = /^(?:Find|Arrange) the increasing order of\s+(.+)$/i.exec(text);
  if (match) return sentence("The quantities to order are", match[1]!);

  match = /^Classify\s+(.+?)\s+as\b/i.exec(text);
  if (match) return sentence("The radical to classify is", match[1]!);

  match = /^Is\s+(.+?)\s+(?:rational|denestable)\b/i.exec(text);
  if (match) return sentence("The expression to classify is", match[1]!);

  match = /^Determine whether\s+(.+?)\s+(?:has|simplifies)\b/i.exec(text);
  if (match) return sentence("The expression to classify is", match[1]!);

  match = /^After exact simplification, classify\s+(.+)$/i.exec(text);
  if (match) return sentence("The given surd expression is", match[1]!);

  match = /^Over the real numbers, how should\s+(.+?)\s+be classified$/i.exec(text);
  if (match) return sentence("The given power is", match[1]!);

  match = /^Which power of a is equivalent to\s+(.+)$/i.exec(text);
  if (match) return sentence("The given radical form is", match[1]!);

  match = /^Solve\s+(.+)$/i.exec(text);
  if (match) return sentence("The given equation is", match[1]!);

  match = /^(?:Determine x from|Find x if)\s+(.+)$/i.exec(text);
  if (match) return sentence("The given equation is", match[1]!);

  match = /^Within\s+(.+?),\s*find x if\s+(.+)$/i.exec(text);
  if (match) return `The variable is restricted to ${stripTerminalPunctuation(match[1]!)} and satisfies ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^The value of\s+(.+?)\s+is\s+(.+?)\.\s*What is\s+/i.exec(text);
  if (match) return `The supplied power relation is ${stripTerminalPunctuation(match[1]!)} = ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^(?:Using|From)\s+(.+?),\s*(?:determine|find|evaluate)\b/i.exec(text);
  if (match) return sentence("The supplied relation is", match[1]!);

  match = /^(?:Given|If)\s+(.+?),\s*(?:determine|find|evaluate)\b/i.exec(text);
  if (match) return sentence("The supplied condition is", match[1]!);

  match = /^Let\s+(.+?)\.\s*If\s+(.+?),\s*find\b/i.exec(text);
  if (match) return `The supplied data are ${stripTerminalPunctuation(match[1]!)}; ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^For\s+x=(.+?),\s*evaluate\b/i.exec(text);
  if (match) return sentence("The supplied surd value is x =", match[1]!);

  match = /^If\s+x=(.+?),\s*evaluate\b/i.exec(text);
  if (match) return sentence("The supplied surd value is x =", match[1]!);

  match = /^Find the positive value of the repeating radical\s+(.+)$/i.exec(text);
  if (match) return sentence("The repeating radical satisfies", match[1]!);

  match = /^Choose the exact consecutive-integer interval containing\s+(.+)$/i.exec(text);
  if (match) return sentence("The radical to bound is", match[1]!);

  match = /^Locate\s+(.+?)\s+between consecutive integers\b/i.exec(text);
  if (match) return sentence("The quantity to bound is", match[1]!);

  return null;
}

/**
 * Discovery state contains solver internals as well as learner givens, so it must never
 * be dumped into the learner explanation. Prefer a question-specific summary derived
 * only from the visible stem; use checkpoint context only when no safe surface rule fits.
 */
export function describeSriGivenContext(checkpointId: SriCheckpointId, stem?: string): string {
  if (stem) {
    const visible = deriveVisibleGiven(stem);
    if (visible) return visible;
  }
  return CHECKPOINT_CONTEXT[checkpointId];
}
