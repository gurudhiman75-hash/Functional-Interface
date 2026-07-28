import { buildPnc002TeacherStudentPresentation } from "./student-presentation-teacher";
import type {
  PncStudentExplanationSection,
  PncStudentPresentation,
  PncStudentSourcePackage,
} from "./student-presentation";

type Expansion = { token: string; value: number };

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

function stripNumber(value: string): string {
  return value.replace(/^\d+\.\s*/, "").trim();
}

function lineLabel(value: string): string {
  return value.match(/^\*\*([^*]+):\*\*/)?.[1] ?? "";
}

function isFinalLine(value: string): boolean {
  return lineLabel(value) === "Final answer";
}

function isExpansionLine(value: string): boolean {
  const label = lineLabel(value);
  return label.startsWith("Expand ") || label.startsWith("Evaluate ");
}

function isFormulaLine(value: string): boolean {
  const label = lineLabel(value);
  return label === "Combine the evaluated stages"
    || label === "Calculate the required count"
    || label === "Interpret the formula"
    || label === "Substitute the evaluated factors";
}

function parseExpansion(value: string): Expansion | undefined {
  const math = value.match(/\$([^$]+)\$/)?.[1];
  if (!math) return undefined;
  const parts = math.split("=").map((part) => part.trim());
  if (parts.length < 3) return undefined;
  const numeric = Number(parts.at(-1)?.replace(/,/g, ""));
  if (!Number.isSafeInteger(numeric)) return undefined;
  return { token: parts[0]!, value: numeric };
}

function parenthesisedFactorialStep(source: PncStudentSourcePackage): string | undefined {
  const match = source.solver.mathJax.match(/\((\d+)\s*-\s*(\d+)\)!/);
  if (!match) return undefined;
  const total = Number(match[1]);
  const removed = Number(match[2]);
  const remaining = total - removed;
  const value = factorial(remaining);
  if (value === undefined) return undefined;
  return `**Expand the circular factorial:** $(${total}-${removed})! = ${remaining}! = ${factorialProduct(remaining)} = ${value}$.`;
}

function familyTeachingStep(source: PncStudentSourcePackage): string {
  const mode = source.solveMode.toLowerCase();
  const stem = source.stem.toLowerCase();
  if (mode.includes("circular") || mode.includes("roundtable") || mode.includes("rotation") || mode.includes("dihedral") || /round table|clockwise|ring|necklace|ornament/.test(stem)) {
    return "**Remove rotational duplicates:** Fix one reference position first; only the remaining positions are freely arranged around the circle.";
  }
  if (mode.includes("recover")) {
    return "**Check the bounded candidates:** Evaluate only the allowed values and keep the unique one that reproduces the target count.";
  }
  return "**Separate the stages:** Write each independent counting choice before combining the factors.";
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function evaluateNumericPowers(value: string): string {
  let result = value;
  const powerPattern = /\(?([0-9]+)\)?\^\{?([0-9]+)\}?/g;
  for (let pass = 0; pass < 4; pass += 1) {
    const next = result.replace(powerPattern, (_match, baseText: string, exponentText: string) => {
      const base = Number(baseText);
      const exponent = Number(exponentText);
      const powered = base ** exponent;
      return Number.isSafeInteger(powered) ? String(powered) : _match;
    });
    if (next === result) break;
    result = next;
  }
  return result;
}

function substituteAtoms(lhs: string, expansions: Expansion[]): string | undefined {
  const unique = new Map<string, number>();
  for (const expansion of expansions) unique.set(expansion.token, expansion.value);
  const tokens = [...unique.keys()].sort((a, b) => b.length - a.length);
  if (tokens.length === 0) return undefined;

  const pattern = new RegExp(tokens.map(escapeRegExp).join("|"), "g");
  let result = "";
  let cursor = 0;
  let previousWasAtom = false;
  let match: RegExpExecArray | null;
  let replacementCount = 0;

  while ((match = pattern.exec(lhs)) !== null) {
    const between = lhs.slice(cursor, match.index);
    const multiplicativeGap = between.replace(/\s|\\,/g, "") === "";
    if (previousWasAtom && multiplicativeGap) result += " \\times ";
    else result += between;
    result += String(unique.get(match[0])!);
    cursor = match.index + match[0].length;
    previousWasAtom = true;
    replacementCount += 1;
  }
  result += lhs.slice(cursor);
  if (replacementCount === 0) return undefined;

  result = evaluateNumericPowers(result)
    .replace(/\\left|\\right/g, "")
    .replace(/\\,/g, " ")
    .replace(/\((\d+)\)/g, "$1")
    .replace(/}(?=\d)/g, "} \\times ")
    .replace(/(\d)\s+(?=\d)/g, "$1 \\times ")
    .replace(/\s+/g, " ")
    .trim();

  if (/\\sum|\\binom|S\(|B_|p_|D_|[a-zA-Z]_?\{|\bj\b|\bi\b/.test(result)) return undefined;
  return result;
}

function reviewedFormulaLine(
  source: PncStudentSourcePackage,
  expansions: Expansion[],
): string | undefined {
  const equalsIndex = source.solver.mathJax.lastIndexOf("=");
  if (equalsIndex < 0) return `**Calculate the required count:** $$${source.solver.mathJax}$$`;
  const lhs = source.solver.mathJax.slice(0, equalsIndex).trim();
  const evaluated = substituteAtoms(lhs, expansions);
  if (!evaluated) return `**Calculate the required count:** $$${source.solver.mathJax}$$`;

  const compact = evaluated.replace(/\s|\\times/g, "");
  if (/^\d+$/.test(compact) && Number(compact) === source.solver.numericAnswer) return undefined;
  return `**Combine the evaluated stages:** $$${evaluated} = ${source.solver.numericAnswer}$$`;
}

function reviewedStepSection(
  source: PncStudentSourcePackage,
  section: PncStudentExplanationSection,
): PncStudentExplanationSection {
  const unnumbered = section.lines.map(stripNumber);
  const final = unnumbered.find(isFinalLine) ?? `**Final answer:** ${source.answer}.`;
  const existingExpansions = unnumbered.filter(isExpansionLine);
  const circularExpansion = parenthesisedFactorialStep(source);
  const expansions = circularExpansion && !existingExpansions.includes(circularExpansion)
    ? [...existingExpansions, circularExpansion]
    : existingExpansions;
  const parsedExpansions = expansions.map(parseExpansion).filter((item): item is Expansion => item !== undefined);

  const process = unnumbered.filter((line) => !isFinalLine(line) && !isExpansionLine(line) && !isFormulaLine(line));
  const circular = /circular|roundtable|rotation|dihedral/i.test(source.solveMode)
    || /round table|clockwise|ring|necklace|ornament/i.test(source.stem);
  if (circular) {
    const reference = familyTeachingStep(source);
    if (!process.includes(reference)) process.push(reference);
  }

  const formula = reviewedFormulaLine(source, parsedExpansions);
  const ordered = [...process.slice(0, 3), ...expansions.slice(0, 4)];
  if (formula) ordered.push(formula);
  ordered.push(final);

  while (ordered.length < 4) {
    const insertion = familyTeachingStep(source);
    const finalIndex = Math.max(0, ordered.length - 1);
    if (!ordered.includes(insertion)) ordered.splice(finalIndex, 0, insertion);
    else ordered.splice(finalIndex, 0, "**Connect the condition to the formula:** Apply the stated restriction before evaluating the final count.");
  }

  return {
    ...section,
    lines: ordered.slice(0, 8).map((line, index) => `${index + 1}. ${line}`),
  };
}

function identicalObjectCore(source: PncStudentSourcePackage): PncStudentExplanationSection {
  const mode = source.solveMode.toLowerCase();
  const stem = source.stem.toLowerCase();
  let heading = "📌 Core Concept — Count Occupancies, Not Individual Objects";
  let line = "The objects are identical, so an allocation is determined by the number placed in each receiver rather than by object-by-object assignments.";

  if (mode.includes("nonempty")) {
    heading = "📌 Core Concept — Reserve One Identical Object for Every Receiver";
    line = "Give each labelled receiver its compulsory minimum first; then distribute the remaining identical objects with stars and bars.";
  } else if (mode.includes("minimum") || /at least/.test(stem)) {
    heading = "📌 Core Concept — Shift the Required Minimums First";
    line = "Reserve every stated minimum before applying stars and bars to the remaining identical objects.";
  } else if (mode.includes("capacity") || /capacity|no .* more than|maximum/.test(stem)) {
    heading = "📌 Core Concept — Count Bounded Occupancy Vectors";
    line = "Start from the unrestricted occupancy count and use inclusion–exclusion to remove allocations that exceed a box capacity.";
  } else if (/identical non-empty boxes|identical.*groups|at most .*identical/.test(stem)) {
    heading = "📌 Core Concept — Use Integer Partitions for Unlabelled Receivers";
    line = "Both the objects and receiving groups are unlabelled, so only the unordered positive occupancy pattern matters.";
  } else if (/red|blue|colou?r/.test(stem)) {
    heading = "📌 Core Concept — Count Each Identical Colour Separately";
    line = "Form one occupancy vector for each colour and combine the independent colour distributions, then enforce any total non-empty condition.";
  } else if (/empty/.test(stem)) {
    heading = "📌 Core Concept — Compare Weak and Positive Compositions";
    line = "Count all weak compositions and subtract the all-non-empty compositions when the condition requires at least one empty receiver.";
  }

  return { kind: "coreConcept", heading, lines: [line] };
}

function reviewedCoreSection(
  source: PncStudentSourcePackage,
  section: PncStudentExplanationSection,
): PncStudentExplanationSection {
  const ql = Number(source.questionLanguageId.split("-").at(-1));
  const mode = source.solveMode.toLowerCase();

  if (ql >= 226 && ql <= 228) {
    return {
      ...section,
      heading: ql === 228
        ? "📌 Core Concept — Add All Set-Partition Counts"
        : "📌 Core Concept — Partition Different Objects into Unlabelled Groups",
      lines: [
        ql === 228
          ? "A Bell number counts partitions of different objects into any number of non-empty unlabelled groups."
          : "A Stirling number of the second kind counts partitions of different objects into the required number of non-empty unlabelled groups.",
      ],
    };
  }

  if ((ql >= 229 && ql <= 238) || ql === 262 || ql === 263 || ql === 265 || ql === 266) {
    return { ...section, ...identicalObjectCore(source) };
  }

  if (source.questionLanguageId === "PNC-QL-246") {
    return {
      ...section,
      heading: "📌 Core Concept — Meet the Committee Quota, Then Assign the Offices",
      lines: [
        "First select the required women and men for the committee; only after the members are fixed should the ordered offices be assigned to eligible members.",
      ],
    };
  }

  if (source.questionLanguageId === "PNC-QL-248") {
    return {
      ...section,
      heading: "📌 Core Concept — Exclude First, Then Select and Arrange",
      lines: [
        "Remove the two forbidden people from the eligible pool, choose the required people from those remaining and then arrange the chosen people in order.",
      ],
    };
  }

  if (source.questionLanguageId === "PNC-QL-249") {
    return {
      ...section,
      heading: "📌 Core Concept — Select the Category Quota, Then Arrange",
      lines: [
        "Choose the required women and men separately, multiply those selections and finally arrange all chosen people in a row.",
      ],
    };
  }

  if (source.questionLanguageId === "PNC-QL-269") {
    return {
      ...section,
      heading: "📌 Core Concept — Build the Team Quota, Then Choose Captains",
      lines: [
        "Form Team A with the required women–men split; because the teams are named, every remaining member then belongs to Team B automatically.",
        "Only after both teams are fixed should one captain be chosen independently from each team.",
      ],
    };
  }

  if (mode.includes("identical") && /boxes?|receivers?|bags?|jars?/.test(source.stem.toLowerCase())) {
    return { ...section, ...identicalObjectCore(source) };
  }
  return section;
}

function reviewedShortcutSection(
  source: PncStudentSourcePackage,
  section: PncStudentExplanationSection,
): PncStudentExplanationSection {
  const ql = Number(source.questionLanguageId.split("-").at(-1));
  const mode = source.solveMode.toLowerCase();
  const math = source.solver.mathJax;

  if (ql >= 226 && ql <= 228) {
    return {
      ...section,
      lines: [ql === 228
        ? `Add the Stirling counts for every possible number of non-empty unlabelled groups; that Bell-number total is $${math}$.`
        : `Use the Stirling number for the required number of non-empty unlabelled groups; here the one-line check is $${math}$.`],
    };
  }

  if ((ql >= 229 && ql <= 238) || ql === 262 || ql === 263 || ql === 265 || ql === 266 || mode.includes("identical")) {
    let method = "Write the occupancy equation for the labelled receivers and apply the required empty, minimum or capacity condition";
    if (/identical non-empty boxes|at most .*identical/.test(source.stem.toLowerCase())) method = "Use an integer-partition count because the receiving groups are also unlabelled";
    else if (/red|blue|colou?r/.test(source.stem.toLowerCase())) method = "Count the occupancy vector for each colour separately, then combine them and enforce any non-empty condition";
    else if (mode.includes("capacity") || /capacity|maximum|no .* more than/.test(source.stem.toLowerCase())) method = "Start with stars and bars and use inclusion–exclusion for the capacity violations";
    else if (mode.includes("nonempty") || /every .* at least one/.test(source.stem.toLowerCase())) method = "Reserve one identical object for every receiver, then apply stars and bars";
    else if (/minimum|at least/.test(source.stem.toLowerCase())) method = "Shift every stated minimum first, then apply stars and bars";
    return { ...section, lines: [`${method}; for this question the compact check is $${math}$.`] };
  }

  if (mode.includes("block") || mode.includes("together") || mode.includes("apart")) {
    const negative = mode.includes("not") || mode.includes("apart") || /not .*together|must not/.test(source.stem.toLowerCase());
    return {
      ...section,
      lines: [negative
        ? `Use total arrangements minus the forbidden block arrangements; here the one-line check is $${math}$.`
        : `Tie the required items into one block, arrange the outer units and multiply by the internal block orders: $${math}$.`],
    };
  }
  return section;
}

function baseVerb(value: string): string {
  const verbs: Record<string, string> = {
    uses: "use",
    ignores: "ignore",
    counts: "count",
    omits: "omit",
    treats: "treat",
    misses: "miss",
    duplicates: "duplicate",
    handles: "handle",
    fails: "fail",
    chooses: "choose",
    reverses: "reverse",
    confuses: "confuse",
    applies: "apply",
    divides: "divide",
    forms: "form",
    arranges: "arrange",
    stops: "stop",
    drops: "drop",
    adds: "add",
    represents: "represent",
  };
  return verbs[value.toLowerCase()] ?? value;
}

function grammaticalReason(value: string): string {
  let reason = value.trim().replace(/\.$/, "").replace(/^you\s+/i, "");
  if (/^it is\b/i.test(reason)) return reason.replace(/^it is\b/i, "This option is");
  if (/^is\b/i.test(reason)) return reason.replace(/^is\b/i, "This option is");
  if (/^does not\b/i.test(reason)) return reason.replace(/^does not\b/i, "This option does not");

  reason = reason.replace(/^(uses|ignores|counts|omits|treats|misses|duplicates|handles|fails|chooses|reverses|confuses|applies|divides|forms|arranges|stops|drops|adds|represents)\b/i, (verb) => baseVerb(verb));
  reason = reason.replace(/\b(and|or)\s+(uses|ignores|counts|omits|treats|misses|duplicates|handles|fails|chooses|reverses|confuses|applies|divides|forms|arranges|stops|drops|adds|represents)\b/gi, (_match, conjunction: string, verb: string) => `${conjunction} ${baseVerb(verb)}`);
  return `This happens when you ${reason}`;
}

function reviewedTrapSection(
  section: PncStudentExplanationSection,
): PncStudentExplanationSection {
  return {
    ...section,
    lines: section.lines.map((line) => {
      const match = line.match(/^Don't fall for Option ([A-D]) \(([^)]*)\)\.\s*(.*)$/);
      if (!match) return line;
      const prefix = `Don't fall for Option ${match[1]} (${match[2]}).`;
      const explanation = match[3]!.trim();
      if (/^It counts only\b/.test(explanation)) return `${prefix} ${explanation}`;
      const reason = explanation
        .replace(/^This result appears when\s+/i, "")
        .replace(/^This happens when\s+/i, "")
        .replace(/^you\s+/i, "");
      return `${prefix} ${grammaticalReason(reason)}.`;
    }),
  };
}

export function buildPnc002ReviewedTeacherStudentPresentation(
  source: PncStudentSourcePackage,
): PncStudentPresentation {
  const teacher = buildPnc002TeacherStudentPresentation(source);
  return {
    ...teacher,
    explanationSections: teacher.explanationSections.map((section) => {
      if (section.kind === "coreConcept") return reviewedCoreSection(source, section);
      if (section.kind === "stepByStep") return reviewedStepSection(source, section);
      if (section.kind === "examSpeedShortcut") return reviewedShortcutSection(source, section);
      return reviewedTrapSection(section);
    }),
  };
}
