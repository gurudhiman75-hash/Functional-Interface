/**
 * Canonical MathJax delimiter helpers for Quant V2 plain-text fields
 * (stem, options, explanations). The exam UI renders these via
 * `QuestionRichText`, which tokenizes the full string before line breaks.
 *
 * Supported in plain text:
 * - Inline: `inlineMath("x=5")` → `\(x=5\)`
 * - Display: `displayMathBlock("N=10\\times 3+5")` → multiline `\[...\]` (OK)
 * - Dollar TeX: `$...$` / `$$...$$` also work
 *
 * Rich HTML explanations (e.g. mixture-alligation) may use their own markup;
 * new chapters should prefer these helpers unless they need structured HTML.
 */
export function inlineMath(tex: string) {
  return `\\(${tex.trim()}\\)`;
}

export function displayMathBlock(tex: string) {
  return `\\[\n${tex.trim()}\n\\]`;
}
