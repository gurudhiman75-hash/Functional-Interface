const EXISTING_MATH = /\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$\$[\s\S]*?\$\$|\$[^$\n]+?\$/g;

function inlineMath(tex: string): string {
  return `\\(${tex.trim()}\\)`;
}

function normalizeOperators(value: string): string {
  return value
    .replace(/×/g, "\\times ")
    .replace(/÷/g, "\\div ")
    .replace(/−/g, "-")
    .replace(/≥/g, "\\ge ")
    .replace(/≤/g, "\\le ")
    .replace(/\s+/g, " ")
    .trim();
}

function factorialTermToTex(value: string): string {
  const trimmed = value.trim();
  const parenthesized = trimmed.match(/^\(([^()]+)\)!$/);
  if (parenthesized) return `\\left(${normalizeOperators(parenthesized[1] ?? "")}\\right)!`;
  return normalizeOperators(trimmed);
}

function formatOutsideMath(raw: string): string {
  const protectedMath: string[] = [];
  const protect = (math: string): string => {
    const token = `\uE000MATH${protectedMath.length}\uE001`;
    protectedMath.push(math);
    return token;
  };
  const protectInline = (tex: string): string => protect(inlineMath(tex));

  let value = raw.replace(EXISTING_MATH, (match) => protect(match));

  value = value.replace(
    /\b([A-Za-z]|\d+)C([A-Za-z]|\d+)\s*[×x]\s*([A-Za-z]|\d+)P([A-Za-z]|\d+)\b/g,
    (_match, n: string, s: string, selected: string, roles: string) =>
      protectInline(`\\binom{${n}}{${s}}\\,{}^{${selected}}P_{${roles}}`),
  );

  value = value.replace(
    /\b([A-Za-z]|\d+)C([A-Za-z]|\d+)\s*[×x]\s*([A-Za-z]|\d+)!\s*=\s*([A-Za-z]|\d+)P([A-Za-z]|\d+)\b/g,
    (_match, n: string, s: string, factorialBase: string, permutationN: string, permutationR: string) =>
      protectInline(`\\binom{${n}}{${s}}\\,${factorialBase}! = {}^{${permutationN}}P_{${permutationR}}`),
  );

  value = value.replace(
    /(\([^()]+\)!|\b[A-Za-z0-9]+!)\s*\/\s*(\([^()]+\)!|\b[A-Za-z0-9]+!)(\s*=\s*\d+)?/g,
    (_match, numerator: string, denominator: string, equality: string | undefined) => {
      const right = equality ? ` ${normalizeOperators(equality)}` : "";
      return protectInline(`\\frac{${factorialTermToTex(numerator)}}{${factorialTermToTex(denominator)}}${right}`);
    },
  );

  value = value.replace(
    /((?:\d+!)(?:\s*[×x]\s*\d+!)+)(\s*=\s*\d+)?/g,
    (_match, product: string, equality: string | undefined) =>
      protectInline(`${normalizeOperators(product)}${equality ? ` ${normalizeOperators(equality)}` : ""}`),
  );

  value = value.replace(
    /(\([^()]+\)!|\b[A-Za-z0-9]+!)\s*([+\-−=])\s*(\([^()]+\)!|\b[A-Za-z0-9]+!|\d+)/g,
    (_match, left: string, operator: string, right: string) =>
      protectInline(`${factorialTermToTex(left)} ${normalizeOperators(operator)} ${factorialTermToTex(right)}`),
  );

  value = value.replace(
    /\b([A-Za-z]|\d+)P([A-Za-z]|\d+)\b/g,
    (_match, n: string, r: string) => protectInline(`{}^{${n}}P_{${r}}`),
  );

  value = value.replace(
    /\b([A-Za-z]|\d+)C([A-Za-z]|\d+)\b/g,
    (_match, n: string, r: string) => protectInline(`\\binom{${n}}{${r}}`),
  );

  value = value.replace(
    /\b([A-Za-z0-9]+)\^([A-Za-z0-9]+)\b/g,
    (_match, base: string, exponent: string) => protectInline(`${base}^{${exponent}}`),
  );

  value = value.replace(
    /\b([A-Za-z])\s*(=|≥|≤|>|<)\s*(\d+)\b/g,
    (_match, variable: string, relation: string, number: string) =>
      protectInline(`${variable} ${normalizeOperators(relation)} ${number}`),
  );

  value = value.replace(
    /\(([^()]+)\)!/g,
    (_match, expression: string) => protectInline(`\\left(${normalizeOperators(expression)}\\right)!`),
  );

  value = value.replace(
    /\b([A-Za-z0-9]+)!/g,
    (_match, term: string) => protectInline(`${term}!`),
  );

  value = value.replace(
    /(?<![\w])((?:\d+\s*[×÷]\s*)+\d+(?:\s*=\s*\d+)?)/g,
    (_match, expression: string) => protectInline(normalizeOperators(expression)),
  );

  value = value.replace(
    /(?<![\w])(\d+\s*[+\-−]\s*\d+\s*=\s*\d+)/g,
    (_match, expression: string) => protectInline(normalizeOperators(expression)),
  );

  return value.replace(/\uE000MATH(\d+)\uE001/g, (_match, index: string) => protectedMath[Number(index)] ?? "");
}

export function formatPnc001MathText(raw: string): string {
  return formatOutsideMath(raw);
}

export function formatPnc001MathJax(tex: string, display = false): string {
  const normalized = normalizeOperators(tex);
  return display ? `\\[${normalized}\\]` : inlineMath(normalized);
}

export function hasBalancedPnc001MathDelimiters(value: string): boolean {
  const count = (pattern: RegExp): number => value.match(pattern)?.length ?? 0;
  return count(/\\\(/g) === count(/\\\)/g)
    && count(/\\\[/g) === count(/\\\]/g)
    && count(/\$\$/g) % 2 === 0
    && (value.replace(/\$\$/g, "").match(/\$/g)?.length ?? 0) % 2 === 0;
}

export function containsUndelimitedPnc001Formula(value: string): boolean {
  const proseOnly = value.replace(EXISTING_MATH, " ");
  return /\b(?:[A-Za-z]|\d+)P(?:[A-Za-z]|\d+)\b/.test(proseOnly)
    || /\b(?:[A-Za-z]|\d+)C(?:[A-Za-z]|\d+)\b/.test(proseOnly)
    || /(?:\([^()\n]+\)|\b[A-Za-z0-9]+)!/.test(proseOnly)
    || /\b[A-Za-z0-9]+\^[A-Za-z0-9]+\b/.test(proseOnly)
    || /\b[A-Za-z]\s*(?:≥|≤|=)\s*\d+\b/.test(proseOnly)
    || /\d+\s*[×÷]\s*\d+/.test(proseOnly);
}
