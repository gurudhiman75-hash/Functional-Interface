const DELIMITED_MATH = /(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$|\$(?!\$)[^$]*\$)/g;

function inlineMath(latex: string): string {
  return `\\(${latex}\\)`;
}

function probabilityEventToLatex(event: string): string {
  return event
    .trim()
    .replace(/([A-Za-z])['′]/g, "$1^{\\prime}")
    .replace(/\^c\b/g, "^{c}")
    .replace(/∩/g, "\\cap")
    .replace(/∪/g, "\\cup")
    .replace(/\|/g, "\\mid ")
    .replace(/Ω/g, "\\Omega")
    .replace(/∅/g, "\\varnothing");
}

function renderPlainProbabilityMath(text: string): string {
  return text
    .replace(
      /(-?\d+(?:\.\d+)?)\s*\(\s*(\d+)\s*\/\s*(\d+)\s*\)/g,
      (_match, decimal: string, numerator: string, denominator: string) =>
        inlineMath(`${decimal}\\;\\left(\\frac{${numerator}}{${denominator}}\\right)`),
    )
    .replace(
      /\(\s*(\d+)\s*\/\s*(\d+)\s*\)\s*\^\s*(\d+)/g,
      (_match, numerator: string, denominator: string, exponent: string) =>
        inlineMath(`\\left(\\frac{${numerator}}{${denominator}}\\right)^{${exponent}}`),
    )
    .replace(
      /(^|[^\w\\])(\d+)\s*\/\s*(\d+)(?![\w])/g,
      (_match, prefix: string, numerator: string, denominator: string) =>
        `${prefix}${inlineMath(`\\frac{${numerator}}{${denominator}}`)}`,
    )
    .replace(
      /\bC\(\s*([A-Za-z0-9]+)\s*,\s*([A-Za-z0-9]+)\s*\)/g,
      (_match, n: string, r: string) => inlineMath(`\\binom{${n}}{${r}}`),
    )
    .replace(
      /\b(\d+)C(\d+)\b/g,
      (_match, n: string, r: string) => inlineMath(`\\binom{${n}}{${r}}`),
    )
    .replace(
      /\bP\(([^()\n]+)\)/g,
      (_match, event: string) => inlineMath(`P\\!\\left(${probabilityEventToLatex(event)}\\right)`),
    )
    .replace(
      /\b(\d+)\s*\^\s*(\d+)\b/g,
      (_match, base: string, exponent: string) => inlineMath(`${base}^{${exponent}}`),
    )
    .replace(/∩/g, inlineMath("\\cap"))
    .replace(/∪/g, inlineMath("\\cup"))
    .replace(/Ω/g, inlineMath("\\Omega"))
    .replace(/∅/g, inlineMath("\\varnothing"))
    .replace(/×/g, inlineMath("\\times"))
    .replace(/÷/g, inlineMath("\\div"))
    .replace(/≤/g, inlineMath("\\le"))
    .replace(/≥/g, inlineMath("\\ge"))
    .replace(/≠/g, inlineMath("\\ne"))
    .replace(/≈/g, inlineMath("\\approx"));
}

/**
 * Converts the Probability chapter's plain exam text into mixed prose and
 * MathJax-delimited inline mathematics. Existing delimiters are preserved so
 * the function is safe to call at the final presentation boundary.
 */
export function renderProbabilityMathText(text: string): string {
  if (!text) return text;

  return text
    .split(DELIMITED_MATH)
    .map((segment, index) => (index % 2 === 1 ? segment : renderPlainProbabilityMath(segment)))
    .join("");
}

export function renderProbabilityMathLines(lines: readonly string[]): string[] {
  return lines.map(renderProbabilityMathText);
}
