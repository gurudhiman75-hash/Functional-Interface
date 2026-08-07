export interface Rat {
  readonly n: bigint;
  readonly d: bigint;
}

type Op = "+" | "-" | "*" | "/";

export type ExprNode =
  | { readonly kind: "VALUE"; readonly raw: string; readonly value: Rat; readonly mixed: boolean }
  | { readonly kind: "UNARY"; readonly child: ExprNode }
  | { readonly kind: "BINARY"; readonly op: Op; readonly left: ExprNode; readonly right: ExprNode };

export interface SolvedNode {
  readonly value: Rat;
  readonly rendered: string;
  readonly steps: readonly string[];
}

export const BANNED = /(?:the denominator work is kept exact throughout|quick substitution or reverse calculation|therefore the exact answer remains|greatest common factor leaves the value unchanged)/i;
const FRACTION_TOKEN = /[−-]?\d+\s+\d+\/\d+|[−-]?\d+\/\d+/g;

function abs(value: bigint): bigint {
  return value < 0n ? -value : value;
}

export function gcd(a: bigint, b: bigint): bigint {
  let x = abs(a);
  let y = abs(b);
  while (y !== 0n) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x === 0n ? 1n : x;
}

function lcm(a: bigint, b: bigint): bigint {
  return abs((a / gcd(a, b)) * b);
}

export function rat(n: bigint, d: bigint = 1n): Rat {
  if (d === 0n) throw new Error("A rational denominator cannot be zero.");
  const sign = d < 0n ? -1n : 1n;
  const divisor = gcd(n, d);
  return Object.freeze({ n: (n / divisor) * sign, d: abs(d / divisor) });
}

export function add(left: Rat, right: Rat): Rat {
  return rat(left.n * right.d + right.n * left.d, left.d * right.d);
}

export function subtract(left: Rat, right: Rat): Rat {
  return rat(left.n * right.d - right.n * left.d, left.d * right.d);
}

export function multiply(left: Rat, right: Rat): Rat {
  return rat(left.n * right.n, left.d * right.d);
}

export function divide(left: Rat, right: Rat): Rat {
  if (right.n === 0n) throw new Error("Division by zero is not allowed.");
  return rat(left.n * right.d, left.d * right.n);
}

export function reciprocal(value: Rat): Rat {
  if (value.n === 0n) throw new Error("Zero has no reciprocal.");
  return rat(value.d, value.n);
}

export function equalRat(left: Rat, right: Rat): boolean {
  return left.n === right.n && left.d === right.d;
}

export function formatRat(value: Rat): string {
  const sign = value.n < 0n ? "−" : "";
  const numerator = abs(value.n).toString();
  return value.d === 1n ? `${sign}${numerator}` : `${sign}${numerator}/${value.d.toString()}`;
}

export function parseRat(text: string): Rat | null {
  const normalized = text.trim().replace(/[−–—]/g, "-");
  const mixed = normalized.match(/^(-?)(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const sign = mixed[1] === "-" ? -1n : 1n;
    const whole = BigInt(mixed[2]!);
    const numerator = BigInt(mixed[3]!);
    const denominator = BigInt(mixed[4]!);
    return rat(sign * (whole * denominator + numerator), denominator);
  }
  const fraction = normalized.match(/^(-?\d+)\/(\d+)$/);
  if (fraction) return rat(BigInt(fraction[1]!), BigInt(fraction[2]!));
  if (/^-?\d+$/.test(normalized)) return rat(BigInt(normalized));
  return null;
}

export function ensureSentence(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return clean;
  return /[.!?:]$/.test(clean) ? clean : `${clean}.`;
}

export function normalizeSentence(text: string): string {
  return text
    .toLowerCase()
    .replace(/[−–—]/g, "-")
    .replace(/[^a-z0-9/<>+=*()-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function uniqueSentences(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of values) {
    const sentence = ensureSentence(value);
    const key = normalizeSentence(sentence);
    if (!key || BANNED.test(sentence) || seen.has(key)) continue;
    seen.add(key);
    output.push(sentence);
  }
  return Object.freeze(output);
}

export function visibleOperands(stem: string): readonly string[] {
  const tokens = stem.match(FRACTION_TOKEN) ?? [];
  return Object.freeze([...new Set(tokens.map((token) => token.replace(/\s+/g, " ").trim()))]);
}

function normalizedMathText(text: string): string {
  return text
    .replace(/[−–—]/g, "-")
    .replace(/[×·]/g, "*")
    .replace(/÷/g, "/")
    .replace(/\bof\b/gi, "*")
    .replace(/[\[\{⟦]/g, "(")
    .replace(/[\]\}⟧]/g, ")")
    .replace(/\)\s*\(/g, ")*(")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractExpression(stem: string): string | null {
  const normalized = normalizedMathText(stem);
  const candidates = normalized.match(/[0-9()\s+\-*/.]+/g) ?? [];
  const viable = candidates
    .map((candidate) => candidate.trim().replace(/[.]+$/g, ""))
    .filter((candidate) => /\d/.test(candidate) && /[+\-*/]/.test(candidate))
    .sort((left, right) => right.length - left.length);
  return viable[0] ?? null;
}

function tokenize(expression: string): readonly string[] {
  const normalized = normalizedMathText(expression);
  const tokens = normalized.match(/\d+\s+\d+\/\d+|\d+\/\d+|\d+|[()+\-*/]/g) ?? [];
  return Object.freeze(tokens);
}

class Parser {
  private index = 0;

  constructor(private readonly tokens: readonly string[]) {}

  parse(): ExprNode {
    const node = this.parseSum();
    if (this.index !== this.tokens.length) throw new Error(`Unexpected token ${this.tokens[this.index]}.`);
    return node;
  }

  private peek(): string | undefined {
    return this.tokens[this.index];
  }

  private take(): string {
    const token = this.tokens[this.index];
    if (token === undefined) throw new Error("Unexpected end of expression.");
    this.index += 1;
    return token;
  }

  private parseSum(): ExprNode {
    let node = this.parseProduct();
    while (this.peek() === "+" || this.peek() === "-") {
      const op = this.take() as "+" | "-";
      node = Object.freeze({ kind: "BINARY", op, left: node, right: this.parseProduct() });
    }
    return node;
  }

  private parseProduct(): ExprNode {
    let node = this.parseUnary();
    while (this.peek() === "*" || this.peek() === "/") {
      const op = this.take() as "*" | "/";
      node = Object.freeze({ kind: "BINARY", op, left: node, right: this.parseUnary() });
    }
    return node;
  }

  private parseUnary(): ExprNode {
    if (this.peek() === "+") {
      this.take();
      return this.parseUnary();
    }
    if (this.peek() === "-") {
      this.take();
      return Object.freeze({ kind: "UNARY", child: this.parseUnary() });
    }
    return this.parsePrimary();
  }

  private parsePrimary(): ExprNode {
    if (this.peek() === "(") {
      this.take();
      const node = this.parseSum();
      if (this.take() !== ")") throw new Error("Missing closing bracket.");
      return node;
    }
    const raw = this.take();
    const value = parseRat(raw);
    if (!value) throw new Error(`Unsupported numeric token ${raw}.`);
    return Object.freeze({ kind: "VALUE", raw, value, mixed: /\s/.test(raw) });
  }
}

export function parseExpression(expression: string | null): ExprNode | null {
  if (!expression) return null;
  try {
    const tokens = tokenize(expression);
    if (tokens.length === 0) return null;
    return new Parser(tokens).parse();
  } catch {
    return null;
  }
}

export function renderNode(node: ExprNode): string {
  if (node.kind === "VALUE") return node.raw;
  if (node.kind === "UNARY") return `−(${renderNode(node.child)})`;
  const symbol = node.op === "*" ? "×" : node.op === "/" ? "÷" : node.op === "-" ? "−" : "+";
  return `(${renderNode(node.left)} ${symbol} ${renderNode(node.right)})`;
}

export function solveNode(node: ExprNode): SolvedNode {
  if (node.kind === "VALUE") {
    const steps = node.mixed
      ? [`Convert ${node.raw} to the improper fraction ${formatRat(node.value)}`]
      : [];
    return Object.freeze({ value: node.value, rendered: node.raw, steps: Object.freeze(steps) });
  }
  if (node.kind === "UNARY") {
    const child = solveNode(node.child);
    const value = rat(-child.value.n, child.value.d);
    return Object.freeze({
      value,
      rendered: `−(${child.rendered})`,
      steps: uniqueSentences([...child.steps, `Apply the outside negative sign: −(${formatRat(child.value)}) = ${formatRat(value)}`]),
    });
  }
  const left = solveNode(node.left);
  const right = solveNode(node.right);
  let value: Rat;
  let step: string;
  if (node.op === "+" || node.op === "-") {
    value = node.op === "+" ? add(left.value, right.value) : subtract(left.value, right.value);
    const common = lcm(left.value.d, right.value.d);
    const leftScaled = left.value.n * (common / left.value.d);
    const rightScaled = right.value.n * (common / right.value.d);
    const symbol = node.op === "+" ? "+" : "−";
    step = `${formatRat(left.value)} ${symbol} ${formatRat(right.value)} = ${leftScaled}/${common} ${symbol} ${rightScaled}/${common} = ${formatRat(value)}`;
  } else if (node.op === "*") {
    value = multiply(left.value, right.value);
    const crossLeft = gcd(left.value.n, right.value.d);
    const crossRight = gcd(right.value.n, left.value.d);
    const a = left.value.n / crossLeft;
    const b = left.value.d / crossRight;
    const c = right.value.n / crossRight;
    const d = right.value.d / crossLeft;
    step = (crossLeft > 1n || crossRight > 1n)
      ? `${formatRat(left.value)} × ${formatRat(right.value)} = ${formatRat(rat(a, b))} × ${formatRat(rat(c, d))} = ${formatRat(value)}`
      : `${formatRat(left.value)} × ${formatRat(right.value)} = ${formatRat(value)}`;
  } else {
    value = divide(left.value, right.value);
    step = `${formatRat(left.value)} ÷ ${formatRat(right.value)} = ${formatRat(left.value)} × ${formatRat(reciprocal(right.value))} = ${formatRat(value)}`;
  }
  return Object.freeze({
    value,
    rendered: renderNode(node),
    steps: uniqueSentences([...left.steps, ...right.steps, step]),
  });
}

export function canonicalNode(node: ExprNode): string {
  if (node.kind === "VALUE") return formatRat(node.value).replace(/−/g, "-");
  if (node.kind === "UNARY") return `NEG(${canonicalNode(node.child)})`;
  const left = canonicalNode(node.left);
  const right = canonicalNode(node.right);
  if (node.op === "+" || node.op === "*") {
    const ordered = [left, right].sort();
    return `${node.op}(${ordered[0]},${ordered[1]})`;
  }
  return `${node.op}(${left},${right})`;
}

export function normalizeFingerprint(value: string): string {
  return normalizedMathText(value)
    .replace(/-?\d+\/\d+/g, (token) => {
      const parsed = parseRat(token);
      return parsed ? formatRat(parsed).replace(/−/g, "-") : token;
    })
    .replace(/[()\s]/g, "")
    .toLowerCase();
}
