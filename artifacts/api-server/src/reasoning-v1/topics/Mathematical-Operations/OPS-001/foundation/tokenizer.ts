import { fromFiniteDecimal } from "./exact-rational";
import { OpsFoundationError, type DisplayToken } from "./types";

const SINGLE_SYMBOLS = new Set(["+", "−", "-", "×", "*", "÷", "/", "=", "<", ">", "$", "#", "@", "%", "?", "_"]);

function canonicalSymbol(value: string): string {
  if (value === "-") return "−";
  if (value === "*") return "×";
  if (value === "/") return "÷";
  return value;
}

export function tokenizeDisplayExpression(source: string): readonly DisplayToken[] {
  const tokens: DisplayToken[] = [];
  let index = 0;

  while (index < source.length) {
    const char = source[index];
    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (char === "(") {
      tokens.push({ kind: "LPAREN" });
      index += 1;
      continue;
    }
    if (char === ")") {
      tokens.push({ kind: "RPAREN" });
      index += 1;
      continue;
    }

    if (/\d/.test(char)) {
      const start = index;
      while (index < source.length && /\d/.test(source[index])) index += 1;
      if (source[index] === ".") {
        index += 1;
        const fractionStart = index;
        while (index < source.length && /\d/.test(source[index])) index += 1;
        if (fractionStart === index) {
          throw new OpsFoundationError("MALFORMED_NUMBER", `Decimal point must be followed by digits near index ${start}.`);
        }
      }
      const literal = source.slice(start, index);
      tokens.push({ kind: "NUMBER", source: literal, value: fromFiniteDecimal(literal) });
      continue;
    }

    if (/[A-Za-z]/.test(char)) {
      const start = index;
      while (index < source.length && /[A-Za-z]/.test(source[index])) index += 1;
      tokens.push({ kind: "SYMBOL", lexeme: source.slice(start, index) });
      continue;
    }

    if (SINGLE_SYMBOLS.has(char)) {
      tokens.push({ kind: "SYMBOL", lexeme: canonicalSymbol(char) });
      index += 1;
      continue;
    }

    const codePoint = source.codePointAt(index);
    if (codePoint === undefined) break;
    const glyph = String.fromCodePoint(codePoint);
    if (/^[\p{S}\p{P}]$/u.test(glyph)) {
      tokens.push({ kind: "SYMBOL", lexeme: glyph });
      index += glyph.length;
      continue;
    }

    throw new OpsFoundationError("UNKNOWN_TOKEN", `Unsupported character '${char}' at index ${index}.`);
  }

  if (tokens.length === 0) {
    throw new OpsFoundationError("EMPTY_EXPRESSION", "Expression must contain at least one token.");
  }
  return tokens;
}

export function renderDisplayTokens(tokens: readonly DisplayToken[]): string {
  const parts: string[] = [];
  for (const token of tokens) {
    if (token.kind === "NUMBER") parts.push(token.source);
    else if (token.kind === "SYMBOL") parts.push(token.lexeme);
    else if (token.kind === "LPAREN") parts.push("(");
    else parts.push(")");
  }
  return parts.join(" ").replace(/\( /g, "(").replace(/ \)/g, ")");
}
