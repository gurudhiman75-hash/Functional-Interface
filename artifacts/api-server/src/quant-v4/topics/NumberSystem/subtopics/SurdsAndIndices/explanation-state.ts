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
  return `${prefix} ${stripTerminalPunctuation(body)}.`;
}

function deriveVisibleGiven(stem: string): string | null {
  const text = stripTerminalPunctuation(stem);
  let match: RegExpExecArray | null;

  // Multi-clause stems: preserve learner-visible data and remove only the final request.
  match = /^(.+?)\.\s*(?:Which|What|Determine|Find|Evaluate|Choose|Identify|Calculate|Compare|Recover|Decide|Classify|Locate|Bound|Arrange|Write|Express|Simplify|Rationalise|Denest|Use)\b/i.exec(text);
  if (match) return sentence("The supplied information is", match[1]!);

  match = /^(.+?),\s*(?:determine|find|evaluate|calculate|identify|compare|recover|decide)\b/i.exec(text);
  if (match && /[=^\\√]/.test(match[1]!)) return sentence("The supplied relation is", match[1]!);

  match = /^For\s+(.+?),\s*consider the statements:\s*(.+?)\.\s*Which\b/i.exec(text);
  if (match) return `The quantity under review is ${stripTerminalPunctuation(match[1]!)}; the displayed statements are ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Statement I:\s*(.+?)\.\s*Statement II:\s*(.+?)\.\s*Which\b/i.exec(text);
  if (match) return `Statement I is ${stripTerminalPunctuation(match[1]!)}; Statement II is ${stripTerminalPunctuation(match[2]!)}.`;

  // Power relations, equations, ordering and comparison.
  match = /^Which statement correctly describes\s+(.+?)\s+over the real numbers$/i.exec(text);
  if (match) return sentence("The power to classify is", match[1]!);

  match = /^Over the real numbers, how should\s+(.+?)\s+be classified$/i.exec(text);
  if (match) return sentence("The power to classify is", match[1]!);

  match = /^For\s+(X=.+?\s+and\s+Y=.+?),\s*determine n when\s+(.+)$/i.exec(text);
  if (match) return `The supplied power definitions are ${stripTerminalPunctuation(match[1]!)} and they satisfy ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Determine x when\s+(.+?)\s+and\s+(.+?)\s+are equal$/i.exec(text);
  if (match) return `The two equal power expressions are ${stripTerminalPunctuation(match[1]!)} and ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Determine x when\s+(.+?)\s+equals\s+(.+)$/i.exec(text);
  if (match) return `The given equation is ${stripTerminalPunctuation(match[1]!)} = ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^(?:Determine x from|Find x if)\s+(.+)$/i.exec(text);
  if (match) return sentence("The given equation is", match[1]!);

  match = /^Within\s+(.+?),\s*find x if\s+(.+)$/i.exec(text);
  if (match) return `The variable is restricted to ${stripTerminalPunctuation(match[1]!)} and satisfies ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Find the bounded real solution of\s+(.+?),\s*where\s+(.+)$/i.exec(text);
  if (match) return `The equation is ${stripTerminalPunctuation(match[1]!)} with the restriction ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Determine x in\s+(.+?)\s+satisfying\s+(.+)$/i.exec(text);
  if (match) return `The variable is restricted to ${stripTerminalPunctuation(match[1]!)} and satisfies ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Arrange\s+(.+?)\s+in increasing order$/i.exec(text);
  if (match) return sentence("The powers to order are", match[1]!);

  match = /^(?:Find|Arrange) the increasing order of\s+(.+)$/i.exec(text);
  if (match) return sentence("The quantities to order are", match[1]!);

  match = /^Using base\s+.+?,\s*order\s+(.+?)\s+from least to greatest$/i.exec(text);
  if (match) return sentence("The powers to order are", match[1]!);

  match = /^After writing both with base\s+.+?,\s*compare\s+(.+)$/i.exec(text);
  if (match) return sentence("The powers to compare are", match[1]!);

  match = /^(?:Compare(?: exactly:)?|Which is greater:|Without decimal approximation,\s*(?:compare|which is greater:)|Without decimals?,\s*determine the order of)\s+(.+?)(?:\s+exactly)?$/i.exec(text);
  if (match) return sentence("The quantities to compare are", match[1]!);

  match = /^(?:State whether|Determine the exact order of)\s+(.+?)\s+(?:is greater than, less than, or equal to|and)\s+(.+)$/i.exec(text);
  if (match) return `The quantities to compare are ${stripTerminalPunctuation(match[1]!)} and ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Classify the relation between\s+(.+?)\s+and\s+(.+)$/i.exec(text);
  if (match) return `The powers to compare are ${stripTerminalPunctuation(match[1]!)} and ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Which relation is correct for\s+(.+)$/i.exec(text);
  if (match) return sentence("The two labelled quantities are", match[1]!);

  match = /^Quantity A:\s*(.+?)\.\s*Quantity B:\s*(.+?)\.\s*Compare A and B$/i.exec(text);
  if (match) return `Quantity A is ${stripTerminalPunctuation(match[1]!)} and Quantity B is ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^For the following two index statements—\s*(.+?)\s*—which option is correct$/i.exec(text);
  if (match) return sentence("The two displayed index statements are", match[1]!);

  match = /^(?:Which of the following statements about indices is true|Identify the true index-law statement|Which statement is valid under its stated domain)$/i.exec(text);
  if (match) return "The answer choices contain index-law statements whose stated domains must be checked.";

  // Classification and representation changes.
  match = /^(?:Determine the number type of|What is the number type of the exact result of|Classify the result of|After exact simplification, classify|After exact simplification, is)\s+(.+?)(?:\s+rational or irrational)?$/i.exec(text);
  if (match) return sentence("The expression to classify is", match[1]!);

  match = /^Determine whether\s+(.+?)\s+(?:has an exact rational value|simplifies to a rational or irrational number)$/i.exec(text);
  if (match) return sentence("The expression to classify is", match[1]!);

  match = /^Classify\s+(.+?)\s+as\b/i.exec(text);
  if (match) return sentence("The expression to classify is", match[1]!);

  match = /^Is\s+(.+?)\s+(?:rational|denestable)\b/i.exec(text);
  if (match) return sentence("The expression to classify is", match[1]!);

  match = /^Express\s+(.+?)\s+using a root sign$/i.exec(text);
  if (match) return sentence("The fractional-index expression is", match[1]!);

  match = /^Convert\s+(.+?)\s+to (?:an equivalent )?radical$/i.exec(text);
  if (match) return sentence("The fractional-index expression is", match[1]!);

  match = /^Write\s+(.+?)\s+using a fractional index$/i.exec(text);
  if (match) return sentence("The radical form to convert is", match[1]!);

  match = /^Which power of a is equivalent to\s+(.+)$/i.exec(text);
  if (match) return sentence("The given radical form is", match[1]!);

  match = /^Which single power is equal to\s+(.+)$/i.exec(text);
  if (match) return sentence("The given product is", match[1]!);

  match = /^(?:Rewrite|Write)\s+(.+?)\s+(?:as|in)\s+(?:a\s+)?(?:single\s+|one\s+)?power(?:\s+of\s+\d+)?$/i.exec(text);
  if (match) return sentence("The given power expression is", match[1]!);

  // Surd arithmetic and simplification.
  match = /^Which is the simplest form of\s+(.+)$/i.exec(text);
  if (match) return sentence("The radical to simplify is", match[1]!);

  match = /^Extract the greatest perfect-(?:square|cube) factor from\s+(.+)$/i.exec(text);
  if (match) return sentence("The radical to simplify is", match[1]!);

  match = /^Find (?:the )?(?:simplified|simplest exact radical|simplest) form of\s+(.+)$/i.exec(text);
  if (match) return sentence("The radical to simplify is", match[1]!);

  match = /^Write\s+(.+?)\s+(?:in simplest radical form|after extracting the perfect .+? factor)$/i.exec(text);
  if (match) return sentence("The radical to simplify is", match[1]!);

  match = /^Find the exact simplified form of\s+(.+?)\s+using rational exponents$/i.exec(text);
  if (match) return sentence("The radical to simplify is", match[1]!);

  match = /^Use fractional-index laws to simplify\s+(.+)$/i.exec(text);
  if (match) return sentence("The fractional-index expression is", match[1]!);

  match = /^Use a difference of squares to find\s+(.+)$/i.exec(text);
  if (match) return sentence("The conjugate product is", match[1]!);

  match = /^Find the exact product of\s+(.+?)\s+and\s+(.+)$/i.exec(text);
  if (match) return `The factors are ${stripTerminalPunctuation(match[1]!)} and ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Find the exact product\s+(.+)$/i.exec(text);
  if (match) return sentence("The given product is", match[1]!);

  match = /^Multiply the surd sums\s+(.+?)\s+and\s+(.+)$/i.exec(text);
  if (match) return `The two surd factors are ${stripTerminalPunctuation(match[1]!)} and ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Write\s+(.+?)\s+in simplest surd form$/i.exec(text);
  if (match) return sentence("The surd expression to simplify is", match[1]!);

  match = /^(?:Divide the surds exactly:|Expand and simplify|Multiply and simplify|Combine(?: the like surds:)?|Reduce(?: the quotient)?)\s*(.+)$/i.exec(text);
  if (match) return sentence("The given surd expression is", match[1]!);

  // Rationalisation and conjugates.
  match = /^Use (?:the )?(?:coefficient-bearing )?conjugate to simplify\s+(.+)$/i.exec(text);
  if (match) return sentence("The fraction to rationalise is", match[1]!);

  match = /^Find the ordered pair \(A,B\) when\s+(.+)$/i.exec(text);
  if (match) return sentence("The rationalisation identity is", match[1]!);

  match = /^Determine A\+B from the (?:canonical )?rationalised form of\s+(.+)$/i.exec(text);
  if (match) return sentence("The fraction to rationalise is", match[1]!);

  match = /^(?:Remove (?:the radical|the radicals|the cube root) from the denominator of|Find the (?:simplest |exact )?rationalised form of|Find the rationalised form of|Use the conjugate to rationalise|Use a conjugate to remove the radicals from the denominator of)\s+(.+)$/i.exec(text);
  if (match) return sentence("The fraction to rationalise is", match[1]!);

  match = /^Write\s+(.+?)\s+with a rational denominator$/i.exec(text);
  if (match) return sentence("The fraction to rationalise is", match[1]!);

  match = /^Write the sum\s+(.+?)\s+as A\+B\\sqrt\{.+\}$/i.exec(text);
  if (match) return sentence("The conjugate-denominator sum is", match[1]!);

  match = /^After rationalising\s+(.+?),\s+(?:identify|determine|calculate)\b/i.exec(text);
  if (match) return sentence("The fraction to rationalise is", match[1]!);

  match = /^For x=(.+?),\s*determine the exact value of\s+/i.exec(text);
  if (match) return sentence("The supplied surd value is x =", match[1]!);

  match = /^Let x=(.+?)\.\s*Find\s+/i.exec(text);
  if (match) return sentence("The supplied surd value is x =", match[1]!);

  match = /^(?:For|If)\s+x=(.+?),\s*evaluate\b/i.exec(text);
  if (match) return sentence("The supplied surd value is x =", match[1]!);

  // Denesting and repeating radicals.
  match = /^Squaring\s+(.+?)\s+gives\s+(.+?)\.\s*Determine A and B$/i.exec(text);
  if (match) return `The denested expression is ${stripTerminalPunctuation(match[1]!)} and its square is ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Find the missing radicand x in\s+(.+)$/i.exec(text);
  if (match) return sentence("The denesting relation is", match[1]!);

  match = /^Let x denote\s+(.+?)\.\s*Find the positive fixed point x$/i.exec(text);
  if (match) return sentence("The repeating radical defining x is", match[1]!);

  match = /^Find the positive value of the repeating radical\s+(.+)$/i.exec(text);
  if (match) return sentence("The repeating radical satisfies", match[1]!);

  match = /^(?:Find the exact denested form of|Decide whether)\s+(.+?)(?:\s+is denestable\b.*)?$/i.exec(text);
  if (match) return sentence("The nested radical is", match[1]!);

  match = /^Can\s+(.+?)\s+be written as\s+(.+)$/i.exec(text);
  if (match) return sentence("The nested radical to test is", match[1]!);

  match = /^Find\s+\(A,B\)\s+such that\s+(.+)$/i.exec(text);
  if (match) return sentence("The denesting identity to match is", match[1]!);

  match = /^Write\s+(.+?)\s+as a (?:sum|difference) of two simple square roots$/i.exec(text);
  if (match) return sentence("The nested radical is", match[1]!);

  match = /^Recover x when\s+(.+)$/i.exec(text);
  if (match) return sentence("The denesting relation is", match[1]!);

  // Bounds, equations and statement checks.
  match = /^Without decimals, bound\s+(.+?)\s+by consecutive integers$/i.exec(text);
  if (match) return sentence("The radical to bound is", match[1]!);

  match = /^Which exact integer bound contains\s+(.+)$/i.exec(text);
  if (match) return sentence("The quantity to bound is", match[1]!);

  match = /^Choose the true range statement for\s+(.+)$/i.exec(text);
  if (match) return sentence("The irrational quantity to bound is", match[1]!);

  match = /^Bound the irrational quantity\s+(.+?)\s+exactly by consecutive integers$/i.exec(text);
  if (match) return sentence("The irrational quantity to bound is", match[1]!);

  match = /^(?:Between which consecutive integers does|Choose the exact consecutive-integer interval containing|Locate)\s+(.+?)(?:\s+lie|\s+between\s+(?:two\s+)?consecutive integers)?$/i.exec(text);
  if (match) return sentence("The quantity to bound is", match[1]!);

  match = /^Use a common exact power to compare\s+(.+?)\s+with\s+(.+)$/i.exec(text);
  if (match) return `The radicals to compare are ${stripTerminalPunctuation(match[1]!)} and ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Use the conjugate of\s+(.+?)\s+to find\b/i.exec(text);
  if (match) return sentence("The supplied surd value is", match[1]!);

  match = /^Without decimal approximation, determine\s+(.+?)\s+when\s+(.+)$/i.exec(text);
  if (match) return sentence("The supplied surd value is", match[2]!);

  match = /^Squaring\s+(.+?)\s+gives candidates\s+(.+?)\.\s*Which candidate is extraneous$/i.exec(text);
  if (match) return `The original equation is ${stripTerminalPunctuation(match[1]!)} and squaring gives candidates ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^(?:After squaring|For)\s+(.+?),\s*(?:candidates|the squared equation yields)\s+(.+?)(?:\s+appear)?\.\s*(?:Identify the extraneous root|Which value must be rejected)$/i.exec(text);
  if (match) return `The original equation is ${stripTerminalPunctuation(match[1]!)} and squaring gives candidates ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Which candidate fails the original equation\s+(.+?):\s*(.+)$/i.exec(text);
  if (match) return `The original equation is ${stripTerminalPunctuation(match[1]!)} with candidate values ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Which statement set is correct for\s+(.+?)\?\s*(.+)$/i.exec(stem.trim());
  if (match) return `The radical under review is ${stripTerminalPunctuation(match[1]!)}; the displayed statements are ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Without decimals, decide the truth of:\s*(.+)$/i.exec(text);
  if (match) return sentence("The displayed surd statements are", match[1]!);

  // Mixed radical/index surfaces.
  match = /^Convert\s+(.+?)\s+to exponent notation, simplify the powers, then return to radical form$/i.exec(text);
  if (match) return sentence("The radical to rewrite is", match[1]!);

  match = /^Use fractional indices to reduce\s+(.+?)\s+to simplest radical form$/i.exec(text);
  if (match) return sentence("The radical to simplify is", match[1]!);

  match = /^Convert the fractional index\s+(.+?)\s+to a root before evaluating it$/i.exec(text);
  if (match) return sentence("The fractional-index expression is", match[1]!);

  match = /^Rewrite\s+(.+?)\s+as a radical and simplify exactly$/i.exec(text);
  if (match) return sentence("The fractional-index expression is", match[1]!);

  match = /^Are\s+(.+?)\s+and\s+(.+?)\s+equal, or is one greater$/i.exec(text);
  if (match) return `The two exact representations are ${stripTerminalPunctuation(match[1]!)} and ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Using exact radical-index equivalence, compare\s+(.+?)\s+with\s+(.+)$/i.exec(text);
  if (match) return `The two exact representations are ${stripTerminalPunctuation(match[1]!)} and ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^Determine the relation between\s+(.+?)\s+and\s+(.+)$/i.exec(text);
  if (match) return `The two exact representations are ${stripTerminalPunctuation(match[1]!)} and ${stripTerminalPunctuation(match[2]!)}.`;

  match = /^First simplify the surd, then find\s+(.+)$/i.exec(text);
  if (match) return sentence("The mixed surd-index expression is", match[1]!);

  match = /^Use surd simplification and a negative index to evaluate\s+(.+)$/i.exec(text);
  if (match) return sentence("The mixed surd-index expression is", match[1]!);

  // General safe surfaces used by remaining arithmetic/equation families.
  match = /^(?:Simplify|Evaluate|Denest|Rationalise)\s+(.+)$/i.exec(text);
  if (match) return sentence("The given expression is", match[1]!);

  match = /^(?:Find the value of|Find the exact value of)\s+(.+)$/i.exec(text);
  if (match) return sentence("The given expression is", match[1]!);

  match = /^(?:Given|If|Using|From)\s+(.+?),\s*(?:determine|find|evaluate)\b/i.exec(text);
  if (match) return sentence("The supplied condition is", match[1]!);

  match = /^Solve\s+(.+)$/i.exec(text);
  if (match) return sentence("The given equation is", match[1]!);

  match = /^Which (?:expression|option) is equivalent to\s+(.+)$/i.exec(text);
  if (match) return sentence("The given expression is", match[1]!);

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
