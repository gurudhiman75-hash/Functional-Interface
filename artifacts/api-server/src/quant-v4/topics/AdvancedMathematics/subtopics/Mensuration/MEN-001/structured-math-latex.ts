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
  ["lb", "l b"],
  ["bh", "b h"],
]);

const SINGLE_LETTER_SYMBOLS = new Set([
  "A", "P", "C", "L", "B", "R", "r", "l", "b", "h", "a", "c", "d", "s", "w", "k", "x", "y", "z",
]);

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

export function toMen001LatexEquation(input: string) {
  const protectedValues: string[] = [];
  let value = stripMathDelimiters(input);

  value = value
    .replace(/\\text\{[^{}]*\}/g, (match) => protect(protectedValues, match))
    .replace(/\\(?:sqrt|frac|times|div|cdot|pi|theta|max)\b/g, (match) => protect(protectedValues, match));

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

  return restoreProtected(spaced, protectedValues)
    .replace(/\s+/g, " ")
    .trim();
}

export function isMen001LatexEquation(value: string) {
  if (!value.trim() || /\$\$/.test(value)) return false;
  if (/[×÷π√²₁₂¼½°]/.test(value)) return false;
  if (/(^|[^\\])%/.test(value)) return false;

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
    equations: section.equations.map(toMen001LatexEquation),
  }));
}
