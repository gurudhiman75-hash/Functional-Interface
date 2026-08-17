import type { Men001ExplanationSection } from "./structured-explanation";

const NAMED_SYMBOLS = new Map<string, string>([
  ["Apath", "A_{\\text{path}}"],
  ["Aremaining", "A_{\\text{remaining}}"],
  ["Aroads", "A_{\\text{roads}}"],
  ["Ashaded", "A_{\\text{shaded}}"],
  ["Aunion", "A_{\\text{union}}"],
  ["Aoverlap", "A_{\\text{overlap}}"],
  ["Amax", "A_{\\max}"],
  ["Ptotal", "P_{\\text{total}}"],
  ["lmap", "l_{\\text{map}}"],
  ["bmap", "b_{\\text{map}}"],
  ["LB", "L B"],
  ["Lw", "L w"],
  ["Bw", "B w"],
  ["kP", "k P"],
  ["lb", "l b"],
  ["bh", "b h"],
  ["min", "\\min"],
  ["lving", "\\text{Solving}"],
]);

const SINGLE_LETTER_SYMBOLS = new Set([
  "A", "P", "C", "L", "B", "R", "r", "l", "b", "h", "a", "c", "d", "s", "w", "k", "n", "p", "x", "y", "z",
]);

const LATEX_NAMED_ATOM = String.raw`(?:[A-Za-z]+_\{\\text\{[^{}]+\}\})`;
const LATEX_ATOM = String.raw`(?:${LATEX_NAMED_ATOM}|\\sqrt\{[^{}]+\}|\\(?:pi|theta)|(?<![\\A-Za-z0-9])[A-Za-z0-9]+(?:_\{[^{}]+\})?(?:\^\{[^{}]+\})?)`;
const LATEX_PRODUCT = String.raw`${LATEX_ATOM}(?:\s*${LATEX_ATOM})*`;
const SIMPLE_FRACTION = new RegExp(String.raw`(${LATEX_PRODUCT})\s*\/\s*(${LATEX_PRODUCT})`, "g");
const PAREN_NUMERATOR_FRACTION = new RegExp(String.raw`\(([^()]+)\)\s*\/\s*(${LATEX_PRODUCT})`, "g");
const PAREN_DENOMINATOR_FRACTION = new RegExp(String.raw`(${LATEX_PRODUCT})\s*\/\s*\(([^()]+)\)`, "g");
const PAREN_FRACTION = /\(([^()]+)\)\s*\/\s*\(([^()]+)\)/g;

function placeholder(index: number) {
  return `\uE000${index}\uE001`;
}

function protect(store: string[], value: string) {
  const token = placeholder(store.length);
  store.push(value);
  return token;
}

function restoreProtected(value: string, store: readonly string[]) {
  return value.replace(/\uE000(\d+)\uE001/g, (_, index: string) => store[Number(index)] ?? "");
}

function stripMathDelimiters(value: string) {
  return value
    .trim()
    .replace(/^\$\$/, "")
    .replace(/\$\$$/, "")
    .replace(/^\$/, "")
    .replace(/\$$/, "")
    .replace(/\$/g, "")
    .trim();
}

function normalizeSquareRoots(value: string, store: string[]) {
  let output = "";
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] !== "√") {
      output += value[index];
      continue;
    }

    const command = protect(store, "\\sqrt");
    const next = value[index + 1];
    if (next === "(" || next === "[") {
      const closing = next === "(" ? ")" : "]";
      let depth = 0;
      let cursor = index + 1;
      for (; cursor < value.length; cursor += 1) {
        if (value[cursor] === next) depth += 1;
        if (value[cursor] === closing) {
          depth -= 1;
          if (depth === 0) break;
        }
      }
      if (cursor < value.length) {
        output += `${command}{${normalizeSquareRoots(value.slice(index + 2, cursor), store)}}`;
        index = cursor;
        continue;
      }
    }

    const simple = value.slice(index + 1).match(/^\s*([A-Za-z0-9]+(?:\^\{2\})?)/);
    if (simple) {
      output += `${command}{${simple[1]}}`;
      index += simple[0].length;
    } else {
      output += command;
    }
  }
  return output;
}

function protectTextCompounds(value: string, store: string[]) {
  return value.replace(
    /\b([A-Za-z]{2,})\s*[−-]\s*([A-Za-z]{2,})\b/g,
    (_, left: string, right: string) => protect(store, `\\text{${left}-${right}}`),
  );
}

function protectNamedPhrases(value: string, store: string[]) {
  return value
    .replace(/\bHeron's formula\b/gi, () => protect(store, "\\text{Heron's formula}"))
    .replace(/\bPythagoras' theorem\b/gi, () => protect(store, "\\text{Pythagoras' theorem}"));
}

function normalizeLatexFractions(input: string) {
  let value = input
    .replace(
      /\\text\{sector\}\s*\\text\{area\}\s*\/\s*(\\pi\s*r\^\{2\})/g,
      (_, denominator: string) => `\\frac{\\text{sector area}}{${denominator}}`,
    )
    .replace(
      /\\text\{₹\}\s*(\d+(?:\.\d+)?)\s*\/\s*(?:\\,)?\\text\{(m|cm)\}\^\{?2\}?/g,
      (_, amount: string, unit: string) => `\\frac{\\text{₹}${amount}}{\\text{${unit}}^{2}}`,
    )
    .replace(
      /\\text\{₹\}\s*(\d+(?:\.\d+)?)\s*\/\s*(?:\\,)?\\text\{(m|cm)\}/g,
      (_, amount: string, unit: string) => `\\frac{\\text{₹}${amount}}{\\text{${unit}}}`,
    );

  for (let attempt = 0; attempt < 20 && value.includes("/"); attempt += 1) {
    const previous = value;
    value = value
      .replace(SIMPLE_FRACTION, (_, numerator: string, denominator: string) => `\\frac{${numerator}}{${denominator}}`)
      .replace(PAREN_NUMERATOR_FRACTION, (_, numerator: string, denominator: string) => `\\frac{${numerator}}{${denominator}}`)
      .replace(PAREN_DENOMINATOR_FRACTION, (_, numerator: string, denominator: string) => `\\frac{${numerator}}{${denominator}}`)
      .replace(PAREN_FRACTION, (_, numerator: string, denominator: string) => `\\frac{${numerator}}{${denominator}}`);
    if (value === previous) break;
  }

  return value;
}

export function toMen001NarrativeMath(input: string) {
  return input
    .replace(/A\s*=\s*½\s*b\s*h\b/gi, "\\(A = \\frac{1}{2}bh\\)")
    .replace(/A\s*=\s*½\s*\(([^)]+)\)\s*h\b/gi, (_, sum: string) => `\\(A = \\frac{1}{2}(${sum})h\\)`)
    .replace(/½/g, "\\(\\frac{1}{2}\\)")
    .replace(/¼/g, "\\(\\frac{1}{4}\\)");
}

export function toMen001LatexEquation(input: string) {
  const protectedValues: string[] = [];
  let value = stripMathDelimiters(input);

  value = protectNamedPhrases(value, protectedValues)
    .replace(/\\text\{[^{}]*\}/g, (match) => protect(protectedValues, match))
    .replace(/\\(?:sqrt|frac|times|div|cdot|pi|theta|max|min)\b/g, (match) => protect(protectedValues, match));

  value = protectTextCompounds(value, protectedValues)
    .replace(/cm²/g, () => protect(protectedValues, "\\,\\text{cm}^{2}"))
    .replace(/m²/g, () => protect(protectedValues, "\\,\\text{m}^{2}"))
    .replace(/₹/g, () => protect(protectedValues, "\\text{₹}"))
    .replace(/(\d|\)|\]|\})\s*cm\b/g, (_, prefix: string) => `${prefix}${protect(protectedValues, "\\,\\text{cm}")}`)
    .replace(/(\d|\)|\]|\})\s*m\b/g, (_, prefix: string) => `${prefix}${protect(protectedValues, "\\,\\text{m}")}`)
    .replace(
      /(\d|\)|\]|\})\s*(tiles|revolutions|rounds|times)\b/gi,
      (_, prefix: string, unit: string) => `${prefix}${protect(protectedValues, `\\,\\text{${unit.toLowerCase()}}`)}`,
    )
    .replace(/%/g, () => protect(protectedValues, "\\%"))
    .replace(/°/g, () => protect(protectedValues, "^{\\circ}"))
    .replace(/²/g, "^{2}")
    .replace(/₁/g, "_{1}")
    .replace(/₂/g, "_{2}");

  value = normalizeSquareRoots(value, protectedValues)
    .replace(/½/g, () => protect(protectedValues, "\\frac{1}{2}"))
    .replace(/¼/g, () => protect(protectedValues, "\\frac{1}{4}"))
    .replace(/×/g, () => protect(protectedValues, "\\times"))
    .replace(/÷/g, () => protect(protectedValues, "\\div"))
    .replace(/π/g, () => protect(protectedValues, "\\pi "))
    .replace(/θ/g, () => protect(protectedValues, "\\theta "))
    .replace(/−/g, "-");

  value = value.replace(/[A-Za-z]+/g, (word) => {
    const named = NAMED_SYMBOLS.get(word);
    if (named) return named;
    if (SINGLE_LETTER_SYMBOLS.has(word)) return word;
    return `\\text{${word}}`;
  });

  const spaced = value
    .replace(/\s+/g, " ")
    .replace(/\s*([=+])\s*/g, " $1 ")
    .replace(/\s*;\s*/g, ";\\quad ")
    .trim();

  const restored = restoreProtected(spaced, protectedValues)
    .replace(/\\text\{(cm|m)\}\^2/g, "\\text{$1}^{2}")
    .replace(/\s+/g, " ")
    .replace(/\s+\\,/g, "\\,")
    .trim();

  return normalizeLatexFractions(restored)
    .replace(/\s+/g, " ")
    .replace(/\s+\\,/g, "\\,")
    .trim();
}

export function isMen001LatexEquation(value: string) {
  if (!value.trim() || /\$/.test(value)) return false;
  if (/[×÷π√²₁₂¼½°]/.test(value)) return false;
  if (/(^|[^\\])%/.test(value)) return false;
  if (value.includes("/")) return false;

  let braceDepth = 0;
  for (const character of value) {
    if (character === "{") braceDepth += 1;
    if (character === "}") braceDepth -= 1;
    if (braceDepth < 0) return false;
  }
  return braceDepth === 0;
}

export function latexizeMen001StructuredSections(
  sections: readonly Men001ExplanationSection[],
): Men001ExplanationSection[] {
  return sections.map((section) => ({
    ...section,
    paragraphs: section.paragraphs.map(toMen001NarrativeMath),
    equations: section.equations.map(toMen001LatexEquation),
  }));
}