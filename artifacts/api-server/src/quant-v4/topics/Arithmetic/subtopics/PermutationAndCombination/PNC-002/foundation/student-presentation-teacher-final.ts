import { buildPnc002ReviewedTeacherStudentPresentation } from "./student-presentation-teacher-reviewed";
import type {
  PncStudentExplanationSection,
  PncStudentPresentation,
  PncStudentSourcePackage,
} from "./student-presentation";

type Expansion = { token: string; value: number; line: string };

function factorial(value: number): number | undefined {
  if (!Number.isInteger(value) || value < 0 || value > 12) return undefined;
  let result = 1;
  for (let factor = 2; factor <= value; factor += 1) result *= factor;
  return result;
}

function factorialProduct(value: number): string {
  if (value <= 1) return "1";
  return Array.from({ length: value }, (_, index) => String(value - index)).join(" \\times ");
}

function powerProduct(base: number, exponent: number): string {
  if (exponent === 0) return "1";
  return Array.from({ length: exponent }, () => String(base)).join(" \\times ");
}

function stripNumber(value: string): string {
  return value.replace(/^\d+\.\s*/, "").trim();
}

function label(value: string): string {
  return value.match(/^\*\*([^*]+):\*\*/)?.[1] ?? "";
}

function parseExpansionLine(value: string): Expansion | undefined {
  const math = value.match(/\$([^$]+)\$/)?.[1];
  if (!math) return undefined;
  const parts = math.split("=").map((part) => part.trim());
  if (parts.length < 3) return undefined;
  const numeric = Number(parts.at(-1)?.replace(/,/g, ""));
  if (!Number.isSafeInteger(numeric)) return undefined;
  return { token: parts[0]!, value: numeric, line: value };
}

function missingArithmeticExpansions(source: PncStudentSourcePackage, existing: Expansion[]): Expansion[] {
  const present = new Set(existing.map((item) => item.token));
  const additions: Expansion[] = [];
  const math = source.solver.mathJax;

  for (const match of math.matchAll(/(\d+)!/g)) {
    const before = math.slice(0, match.index);
    if (/-\s*$/.test(before)) continue;
    const token = match[0];
    if (present.has(token)) continue;
    const n = Number(match[1]);
    const value = factorial(n);
    if (value === undefined) continue;
    const line = `**Expand the arrangement factor:** $${token} = ${factorialProduct(n)} = ${value}$.`;
    additions.push({ token, value, line });
    present.add(token);
  }

  for (const match of math.matchAll(/\(?([0-9]+)\)?\^\{?([0-9]+)\}?/g)) {
    const token = match[0];
    if (present.has(token)) continue;
    const base = Number(match[1]);
    const exponent = Number(match[2]);
    const value = base ** exponent;
    if (!Number.isSafeInteger(value) || exponent > 10) continue;
    const line = `**Expand the repeated independent choices:** $${token} = ${powerProduct(base, exponent)} = ${value}$.`;
    additions.push({ token, value, line });
    present.add(token);
  }

  return additions;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function evaluatePowers(value: string): string {
  let result = value;
  const pattern = /\(?([0-9]+)\)?\^\{?([0-9]+)\}?/g;
  for (let pass = 0; pass < 4; pass += 1) {
    const next = result.replace(pattern, (_match, baseText: string, exponentText: string) => {
      const powered = Number(baseText) ** Number(exponentText);
      return Number.isSafeInteger(powered) ? String(powered) : _match;
    });
    if (next === result) break;
    result = next;
  }
  return result;
}

function substitute(source: PncStudentSourcePackage, expansions: Expansion[]): string | undefined {
  const equalsIndex = source.solver.mathJax.lastIndexOf("=");
  if (equalsIndex < 0 || expansions.length === 0) return undefined;
  const lhs = source.solver.mathJax.slice(0, equalsIndex).trim();
  const values = new Map(expansions.map((item) => [item.token, item.value]));
  const tokens = [...values.keys()].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(tokens.map(escapeRegExp).join("|"), "g");
  let cursor = 0;
  let result = "";
  let previousAtom = false;
  let count = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(lhs)) !== null) {
    const between = lhs.slice(cursor, match.index);
    if (previousAtom && between.replace(/\s|\\,/g, "") === "") result += " \\times ";
    else result += between;
    result += String(values.get(match[0])!);
    cursor = match.index + match[0].length;
    previousAtom = true;
    count += 1;
  }
  result += lhs.slice(cursor);
  if (count === 0) return undefined;

  result = evaluatePowers(result)
    .replace(/\\left|\\right/g, "")
    .replace(/\\,/g, " ")
    .replace(/\((\d+)\)/g, "$1")
    .replace(/}(?=\d)/g, "} \\times ")
    .replace(/(\d)\s+(?=\d)/g, "$1 \\times ")
    .replace(/\s+/g, " ")
    .trim();

  if (/\\sum|\\binom|S\(|B_|p_|D_|\bj\b|\bi\b|\d+!/.test(result)) return undefined;
  return result;
}

function finalStepSection(source: PncStudentSourcePackage, section: PncStudentExplanationSection): PncStudentExplanationSection {
  const raw = section.lines.map(stripNumber);
  const final = raw.find((line) => label(line) === "Final answer") ?? `**Final answer:** ${source.answer}.`;
  const process = raw.filter((line) => {
    const current = label(line);
    return current !== "Final answer"
      && !current.startsWith("Expand ")
      && !current.startsWith("Evaluate ")
      && current !== "Interpret the formula"
      && current !== "Combine the evaluated stages"
      && current !== "Calculate the required count"
      && current !== "Substitute the evaluated factors"
      && current !== "Verify the successful candidate";
  });
  const interpret = raw.filter((line) => label(line) === "Interpret the formula").slice(0, 1);
  const existing = raw
    .filter((line) => label(line).startsWith("Expand ") || label(line).startsWith("Evaluate "))
    .map(parseExpansionLine)
    .filter((item): item is Expansion => item !== undefined);
  const allExpansions = [...existing, ...missingArithmeticExpansions(source, existing)]
    .sort((a, b) => source.solver.mathJax.indexOf(a.token) - source.solver.mathJax.indexOf(b.token));

  const recover = source.solveMode.toLowerCase().includes("recover");
  const formulaValue = recover ? undefined : substitute(source, allExpansions);
  let formula: string | undefined;
  if (recover) {
    formula = `**Verify the successful candidate:** $$${source.solver.mathJax}$$`;
  } else if (formulaValue) {
    const compact = formulaValue.replace(/\s|\\times/g, "");
    if (!/^\d+$/.test(compact) || Number(compact) !== source.solver.numericAnswer) {
      formula = `**Combine the evaluated stages:** $$${formulaValue} = ${source.solver.numericAnswer}$$`;
    }
  } else if (allExpansions.length === 0 || interpret.length > 0) {
    formula = `**Calculate the required count:** $$${source.solver.mathJax}$$`;
  }

  const body = [...process.slice(0, 2), ...interpret, ...allExpansions.map((item) => item.line).slice(0, 4)];
  if (formula) body.push(formula);
  while (body.length < 3) body.push("**Connect the condition to the formula:** Apply the stated restriction before evaluating the final count.");
  const limited = body.slice(0, 7);
  limited.push(final);
  return { ...section, lines: limited.map((line, index) => `${index + 1}. ${line}`) };
}

function baseVerb(value: string): string {
  const verbs: Record<string, string> = {
    uses: "use", ignores: "ignore", counts: "count", omits: "omit", treats: "treat", misses: "miss",
    duplicates: "duplicate", handles: "handle", fails: "fail", chooses: "choose", reverses: "reverse",
    confuses: "confuse", applies: "apply", divides: "divide", forms: "form", arranges: "arrange",
    stops: "stop", drops: "drop", adds: "add", represents: "represent", forgets: "forget", leaves: "leave",
  };
  return verbs[value.toLowerCase()] ?? value;
}

function normaliseReason(value: string): string {
  let reason = value.trim().replace(/\.$/, "");
  reason = reason
    .replace(/^This result appears when\s+/i, "")
    .replace(/^This happens when\s+/i, "")
    .replace(/^you\s+/i, "")
    .replace(/^It counts only\s+/i, "count only ");

  if (/^This option (?:is|does)\b/i.test(reason)) return reason;
  const verbs = "uses|ignores|counts|omits|treats|misses|duplicates|handles|fails|chooses|reverses|confuses|applies|divides|forms|arranges|stops|drops|adds|represents|forgets|leaves";
  reason = reason.replace(new RegExp(`^(${verbs})\\b`, "i"), (verb) => baseVerb(verb));
  reason = reason.replace(new RegExp(`\\b(and|or|but)\\s+(${verbs})\\b`, "gi"), (_match, conjunction: string, verb: string) => `${conjunction} ${baseVerb(verb)}`);
  if (/^(is|does not)\b/i.test(reason)) return `This option ${reason}`;
  return `This happens when you ${reason}`;
}

function finalTrapSection(section: PncStudentExplanationSection): PncStudentExplanationSection {
  return {
    ...section,
    lines: section.lines.map((line) => {
      const match = line.match(/^Don't fall for Option ([A-D]) \(([^)]*)\)\.\s*(.*)$/);
      if (!match) return line;
      return `Don't fall for Option ${match[1]} (${match[2]}). ${normaliseReason(match[3]!)}.`;
    }),
  };
}

export function buildPnc002FinalTeacherStudentPresentation(source: PncStudentSourcePackage): PncStudentPresentation {
  const reviewed = buildPnc002ReviewedTeacherStudentPresentation(source);
  return {
    ...reviewed,
    explanationSections: reviewed.explanationSections.map((section) => {
      if (section.kind === "stepByStep") return finalStepSection(source, section);
      if (section.kind === "commonTrapWarning") return finalTrapSection(section);
      return section;
    }),
  };
}
