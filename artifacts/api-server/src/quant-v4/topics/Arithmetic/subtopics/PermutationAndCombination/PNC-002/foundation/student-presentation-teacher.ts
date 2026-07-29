import { buildPnc002ExamAuthenticStudentPresentation } from "./student-presentation-exam-authentic";
import type {
  PncStudentExplanationSection,
  PncStudentPresentation,
  PncStudentSourcePackage,
} from "./student-presentation";

type ExtendedSourcePackage = PncStudentSourcePackage & {
  parameters?: { values?: Record<string, unknown> };
};

type ArithmeticAtom = {
  token: string;
  value: number;
  expansion: string;
  kind: "combination" | "permutation" | "factorial" | "power";
};

const numberFormatter = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

function sourceValues(source: PncStudentSourcePackage): Record<string, unknown> {
  return (source as ExtendedSourcePackage).parameters?.values ?? {};
}

function numericValue(source: PncStudentSourcePackage, ...keys: string[]): number | undefined {
  const values = sourceValues(source);
  for (const key of keys) {
    const value = values[key];
    if (typeof value === "number" && Number.isInteger(value)) return value;
  }
  return undefined;
}

function factorial(value: number): number | undefined {
  if (!Number.isInteger(value) || value < 0 || value > 12) return undefined;
  let result = 1;
  for (let factor = 2; factor <= value; factor += 1) result *= factor;
  return result;
}

function combination(total: number, selected: number): number | undefined {
  if (!Number.isInteger(total) || !Number.isInteger(selected) || selected < 0 || selected > total || total > 30) return undefined;
  const k = Math.min(selected, total - selected);
  let result = 1;
  for (let index = 1; index <= k; index += 1) result = (result * (total - k + index)) / index;
  return Number.isInteger(result) ? result : undefined;
}

function permutation(total: number, selected: number): number | undefined {
  if (!Number.isInteger(total) || !Number.isInteger(selected) || selected < 0 || selected > total || total > 12) return undefined;
  let result = 1;
  for (let index = 0; index < selected; index += 1) result *= total - index;
  return result;
}

function power(base: number, exponent: number): number | undefined {
  if (!Number.isInteger(base) || !Number.isInteger(exponent) || base < 0 || exponent < 0 || exponent > 10) return undefined;
  const result = base ** exponent;
  return Number.isSafeInteger(result) ? result : undefined;
}

function descendingProduct(start: number, terms: number): string {
  if (terms <= 0) return "1";
  return Array.from({ length: terms }, (_, index) => String(start - index)).join(" \\times ");
}

function factorialProduct(value: number): string {
  if (value <= 1) return "1";
  return Array.from({ length: value }, (_, index) => String(value - index)).join(" \\times ");
}

function parseArithmeticAtoms(mathJax: string): ArithmeticAtom[] {
  const atoms = new Map<string, ArithmeticAtom>();
  const add = (atom: ArithmeticAtom | undefined): void => {
    if (!atom || atoms.has(atom.token)) return;
    atoms.set(atom.token, atom);
  };

  for (const match of mathJax.matchAll(/\\binom\{(\d+)\}\{(\d+)\}/g)) {
    const total = Number(match[1]);
    const selected = Number(match[2]);
    const value = combination(total, selected);
    if (value === undefined) continue;
    add({
      token: match[0],
      value,
      expansion: `${match[0]} = \\frac{${descendingProduct(total, selected)}}{${factorialProduct(selected)}} = ${String(value)}`,
      kind: "combination",
    });
  }

  for (const match of mathJax.matchAll(/\{\}\^\{?(\d+)\}?P_\{?(\d+)\}?/g)) {
    const total = Number(match[1]);
    const selected = Number(match[2]);
    const value = permutation(total, selected);
    if (value === undefined) continue;
    add({
      token: match[0],
      value,
      expansion: `${match[0]} = ${descendingProduct(total, selected)} = ${String(value)}`,
      kind: "permutation",
    });
  }

  for (const match of mathJax.matchAll(/\{\}\^\{?(\d+)\}?C_\{?(\d+)\}?/g)) {
    const total = Number(match[1]);
    const selected = Number(match[2]);
    const value = combination(total, selected);
    if (value === undefined) continue;
    add({
      token: match[0],
      value,
      expansion: `${match[0]} = \\frac{${descendingProduct(total, selected)}}{${factorialProduct(selected)}} = ${String(value)}`,
      kind: "combination",
    });
  }

  for (const match of mathJax.matchAll(/(?<![A-Za-z_}])(\d+)!/g)) {
    const n = Number(match[1]);
    const value = factorial(n);
    if (value === undefined) continue;
    add({
      token: match[0],
      value,
      expansion: `${match[0]} = ${factorialProduct(n)} = ${String(value)}`,
      kind: "factorial",
    });
  }

  for (const match of mathJax.matchAll(/(\d+)\^\{(\d+)\}/g)) {
    const base = Number(match[1]);
    const exponent = Number(match[2]);
    const value = power(base, exponent);
    if (value === undefined) continue;
    const repeated = exponent === 0 ? "1" : Array.from({ length: exponent }, () => String(base)).join(" \\times ");
    add({
      token: match[0],
      value,
      expansion: `${match[0]} = ${repeated} = ${String(value)}`,
      kind: "power",
    });
  }

  for (const match of mathJax.matchAll(/(\d+)\^(\d+)/g)) {
    const base = Number(match[1]);
    const exponent = Number(match[2]);
    const value = power(base, exponent);
    if (value === undefined) continue;
    const repeated = exponent === 0 ? "1" : Array.from({ length: exponent }, () => String(base)).join(" \\times ");
    add({
      token: match[0],
      value,
      expansion: `${match[0]} = ${repeated} = ${String(value)}`,
      kind: "power",
    });
  }

  return [...atoms.values()];
}

function stripStepNumber(value: string): string {
  return value.replace(/^\d+\.\s*/, "").trim();
}

function scenarioName(source: PncStudentSourcePackage): string {
  const stem = source.stem.toLowerCase();
  if (/books?|shelf/.test(stem)) return "books on a shelf";
  if (/files?|records?/.test(stem)) return "files in a row";
  if (/cards?|fixed point|original position|derangement/.test(stem)) return "numbered cards";
  if (/round table|circular|clockwise|opposite|ring|ornament|necklace/.test(stem)) return "a circular arrangement";
  if (/committee|chairperson|secretary|treasurer|selected from|chosen from/.test(stem)) return "committee selection";
  if (/teams?|captain/.test(stem)) return "team formation";
  if (/grid|path|right|upward|point \(/.test(stem)) return "a shortest grid path";
  if (/balls?|marbles?/.test(stem)) return "identical objects in boxes";
  if (/parcels?|objects?.*(boxes?|receivers?)|assigned to|distributed among|placed in/.test(stem)) return "objects distributed to receivers";
  if (/groups?|pairs?/.test(stem)) return "group formation";
  if (/people|persons?|students|performers/.test(stem)) return "people in an arrangement";
  return "this counting problem";
}

function teacherConcept(source: PncStudentSourcePackage, presentation: PncStudentPresentation): PncStudentExplanationSection {
  const mode = source.solveMode.toLowerCase();
  const scenario = scenarioName(source);
  const stem = presentation.stem.toLowerCase();
  let title = "Break the Count into Clear Stages";
  let lines: string[];

  if (mode.includes("recover")) {
    title = "Work Backwards from the Given Count";
    lines = [
      `This ${scenario} question asks for a missing parameter, not the count itself. Check only the permitted candidate values and keep the one that reproduces the target.`,
    ];
  } else if (mode.includes("derangement")) {
    title = "Keep Every Card Away from Its Original Position";
    lines = [
      "A derangement allows no card to return to its original position. Use the derangement recurrence or inclusion–exclusion instead of ordinary permutations.",
    ];
  } else if (mode.includes("fixedpoint") || /fixed position|original position/.test(stem)) {
    title = "Separate Fixed and Misplaced Cards";
    lines = [
      "First choose the positions that remain fixed; the remaining cards must satisfy the required derangement condition.",
    ];
  } else if (mode.includes("grid") || mode.includes("path")) {
    title = "Choose the Order of Right and Up Moves";
    lines = [
      "A shortest route uses a fixed number of right and upward moves. Choosing the positions of one type of move determines the whole path.",
    ];
  } else if (mode.includes("block") || mode.includes("together")) {
    const noun = /books?/.test(stem) ? "books" : /files?/.test(stem) ? "files" : "people";
    if (mode.includes("not") || mode.includes("apart")) {
      title = `Total Minus the Forbidden ${noun === "people" ? "Seating" : "Block"}`;
      lines = [
        `Count all arrangements of the ${noun}, then subtract the cases in which the restricted items form the forbidden block.`,
      ];
    } else {
      title = `Tie the Required ${noun === "people" ? "People" : noun} into One Block`;
      lines = [
        `The required ${noun} move together as one outer unit, but their different orders inside that block must still be counted.`,
      ];
    }
  } else if (mode.includes("eitherend") || mode.includes("bothends") || mode.includes("position")) {
    title = "Reserve the Restricted Positions First";
    lines = [
      `In this ${scenario} question, fill the compulsory or allowed positions first and arrange the remaining items only after those places are fixed.`,
    ];
  } else if (mode.includes("relativeorder")) {
    title = "Use Equal Relative Orders";
    lines = [
      "All orders of the restricted items occur equally often. Keep the required order by dividing the unrestricted count by the factorial of that ordered subset.",
    ];
  } else if (mode.includes("alternation") || mode.includes("adjacent") || mode.includes("gap")) {
    title = "Arrange One Category, Then Use Its Gaps";
    lines = [
      `Arrange the controlling items in ${scenario} first. Their gaps or alternate positions show exactly where the restricted items may be placed.`,
    ];
  } else if (mode.includes("circular") || mode.includes("roundtable") || mode.includes("rotation") || mode.includes("dihedral") || /round table|clockwise|ring|necklace|ornament/.test(stem)) {
    title = mode.includes("dihedral") ? "Remove Rotation and Reflection Duplicates" : "Fix One Reference in the Circle";
    lines = [
      mode.includes("dihedral")
        ? "First remove rotational duplicates; divide for mirror images only when a reflected arrangement is explicitly considered the same."
        : "Fix one person or object as the reference before applying the remaining condition, because rotating the entire circle does not create a new arrangement.",
    ];
  } else if (mode.includes("compulsory") || mode.includes("excluded")) {
    title = mode.includes("compulsory") ? "Reserve the Compulsory Members" : "Remove the Ineligible Members";
    lines = [
      mode.includes("compulsory")
        ? "Place every compulsory member into the committee first; reduce both the available pool and the number of seats still to fill."
        : "Remove the excluded members before choosing the committee, so they never enter the eligible pool.",
    ];
  } else if (mode.includes("committee") || mode.includes("selection") || mode.includes("category") || /committee|selected from|chosen from/.test(stem)) {
    title = "Build the Required Category Quota";
    lines = [
      "Choose the required number from each category separately. Multiply within one valid quota case and add only when several disjoint quota cases are allowed.",
    ];
  } else if (mode.includes("group") || mode.includes("team") || mode.includes("pair")) {
    const named = /named|labelled|team a|team b/.test(stem);
    title = named ? "Form the Named Groups Directly" : "Correct for Interchangeable Whole Groups";
    lines = [
      named
        ? "The group names make the groups different, so swapping complete groups gives a new outcome; divide only for order inside a group."
        : "Start from a labelled grouping count, then divide by the permutations of whole groups that are indistinguishable.",
    ];
  } else if ((mode.includes("identical") || /identical/.test(stem)) && /boxes?|receivers?|groups?/.test(stem)) {
    title = "Count Occupancies, Not Individual Objects";
    lines = [
      "Because the objects are identical, only the number placed in each receiver matters. Shift minimums first, then apply stars and bars, partitions or bounded inclusion–exclusion.",
    ];
  } else if (mode.includes("distribution") || mode.includes("receiver") || mode.includes("boxes") || /assigned to|distributed among|placed in/.test(stem)) {
    title = "Give Each Different Object a Receiver";
    lines = [
      "Different objects make different assignments. Begin with the receiver choices for each object, then impose non-empty, exact-occupancy or capacity restrictions.",
    ];
  } else {
    title = "Separate the Independent Counting Stages";
    lines = [
      `For ${scenario}, identify each independent choice, count it once and multiply; add only when the cases cannot overlap.`,
    ];
  }

  const specific = processLines(presentation)[0];
  if (specific) {
    const normalizedSpecific = specific.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const withoutDuplicate = lines.filter((line) => line.toLowerCase().replace(/[^a-z0-9]+/g, "") !== normalizedSpecific);
    lines = [specific, ...withoutDuplicate].slice(0, 2);
  }

  return {
    kind: "coreConcept",
    heading: `📌 Core Concept — ${title}`,
    lines,
  };
}

function isCalculationLine(value: string): boolean {
  const lower = value.toLowerCase();
  return lower.startsWith("calculation:")
    || lower.startsWith("therefore")
    || value.includes("$$");
}

function processLines(presentation: PncStudentPresentation): string[] {
  const section = presentation.explanationSections.find((item) => item.kind === "stepByStep");
  if (!section) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of section.lines) {
    const line = stripStepNumber(raw);
    if (!line || isCalculationLine(line)) continue;
    const key = line.toLowerCase().replace(/[^a-z0-9]+/g, "");
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(line);
  }
  return result;
}

function substitutedFormula(mathJax: string, atoms: ArithmeticAtom[], answer: number): string | undefined {
  const firstEquality = mathJax.indexOf("=");
  if (firstEquality < 0) return undefined;
  let left = mathJax.slice(0, firstEquality).trim();
  for (const atom of atoms) left = left.split(atom.token).join(String(atom.value));
  left = left
    .replace(/\\left|\\right/g, "")
    .replace(/\\,/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (left === mathJax.slice(0, firstEquality).trim()) return undefined;
  return `${left} = ${String(answer)}`;
}

function arithmeticLabel(atom: ArithmeticAtom, scenario: string): string {
  if (atom.kind === "combination") return `Evaluate the selection factor for ${scenario}`;
  if (atom.kind === "permutation") return `Evaluate the ordered-role factor for ${scenario}`;
  if (atom.kind === "factorial") return `Expand the arrangement factor`;
  return `Expand the repeated independent choices`;
}

function advancedFormulaNote(source: PncStudentSourcePackage): string | undefined {
  const math = source.solver.mathJax;
  if (/S\(|S\{|S_/.test(math) || /S\(\d/.test(math)) {
    return "The Stirling number counts partitions into the required number of non-empty unlabelled groups; any outer factorial or combination then restores labels or chooses the groups used.";
  }
  if (/B_\{?\d/.test(math)) {
    return "The Bell number adds the Stirling counts for every possible number of non-empty unlabelled groups.";
  }
  if (/p_\{?\d/.test(math)) {
    return "The partition number counts occupancy patterns directly because both the objects and the receiving groups are unlabelled.";
  }
  if (/\\sum|S\\subseteq/.test(math)) {
    return "Read the summation as inclusion–exclusion: begin with all unrestricted allocations, then alternately subtract and add the cases that break one or more capacity conditions.";
  }
  if (/D_\{?\d/.test(math)) {
    return "Use the derangement value only after deciding which positions, if any, are allowed to stay fixed.";
  }
  return undefined;
}

function teacherSteps(source: PncStudentSourcePackage, presentation: PncStudentPresentation): string[] {
  const scenario = scenarioName(source);
  const process = processLines(presentation).slice(0, 3);
  const atoms = parseArithmeticAtoms(source.solver.mathJax);
  const steps: string[] = [];

  process.forEach((line, index) => {
    const label = index === 0 ? "Interpret the condition" : index === 1 ? "Count the next stage" : "Apply the remaining restriction";
    steps.push(`**${label}:** ${line}`);
  });

  const usefulAtoms = atoms.filter((atom, index) => atoms.findIndex((candidate) => candidate.value === atom.value && candidate.kind === atom.kind) === index).slice(0, 3);
  for (const atom of usefulAtoms) {
    steps.push(`**${arithmeticLabel(atom, scenario)}:** $${atom.expansion}$.`);
  }

  const advanced = advancedFormulaNote(source);
  if (advanced && usefulAtoms.length === 0) steps.push(`**Interpret the formula:** ${advanced}`);

  const substituted = source.solveMode.toLowerCase().includes("recover")
    ? undefined
    : substitutedFormula(source.solver.mathJax, atoms, source.solver.numericAnswer);
  if (substituted) {
    steps.push(`**Combine the evaluated stages:** $$${substituted}$$`);
  } else {
    steps.push(`**Calculate the required count:** $$${source.solver.mathJax}$$`);
  }
  steps.push(`**Final answer:** ${presentation.answerLabel}.`);

  const compacted = steps.slice(0, 8);
  return compacted.map((line, index) => `${index + 1}. ${line}`);
}

function teacherShortcut(source: PncStudentSourcePackage, presentation: PncStudentPresentation): PncStudentExplanationSection {
  const mode = source.solveMode.toLowerCase();
  const math = source.solver.mathJax;
  let line: string;

  if (mode.includes("recover")) {
    line = `Make a tiny candidate table and stop as soon as the count matches the target; here the successful check is $${math}$.`;
  } else if (mode.includes("block") || mode.includes("together") || mode.includes("apart")) {
    line = `Tie each compulsory block first. For a “not together” condition, use total minus forbidden; the final one-line check is $${math}$.`;
  } else if (mode.includes("compulsory") || mode.includes("excluded") || mode.includes("committee") || mode.includes("selection") || mode.includes("category")) {
    line = `Write one combination for each category after adjusting compulsory or excluded members, then multiply the independent selections: $${math}$.`;
  } else if (mode.includes("circular") || mode.includes("roundtable") || mode.includes("rotation") || mode.includes("dihedral")) {
    line = `Fix one reference before applying the restriction; divide by 2 only when mirror images are also identical. Check with $${math}$.`;
  } else if (mode.includes("derangement") || mode.includes("fixedpoint")) {
    line = `Choose any fixed positions first and derange the rest; the compact check for this question is $${math}$.`;
  } else if (mode.includes("grid") || mode.includes("path")) {
    line = `Convert the route into an order of right/up moves; multiply through compulsory points or subtract routes through forbidden points. Here: $${math}$.`;
  } else if (mode.includes("group") || mode.includes("team") || mode.includes("pair")) {
    line = `Decide whether whole groups are named before dividing for symmetry; then attach any captain or role choices. Here: $${math}$.`;
  } else if (mode.includes("distribution") || mode.includes("receiver") || mode.includes("boxes") || mode.includes("identical")) {
    line = `Different objects suggest repeated receiver choices; identical objects suggest occupancy equations. Apply the empty/capacity rule in $${math}$.`;
  } else {
    line = `Write the structural factors before multiplying or adding them; for this question the compact check is $${math}$.`;
  }

  return {
    kind: "examSpeedShortcut",
    heading: "⚡ Exam Speed Shortcut",
    lines: [line],
  };
}

function optionValue(label: string): number | undefined {
  const match = label.match(/([\d,]+)/);
  if (!match) return undefined;
  const value = Number(match[1]!.replace(/,/g, ""));
  return Number.isSafeInteger(value) ? value : undefined;
}

function secondPersonReason(reason: string): string {
  return reason
    .replace(/^arranges\b/i, "you arrange")
    .replace(/^uses\b/i, "you use")
    .replace(/^counts\b/i, "you count")
    .replace(/^omits\b/i, "you omit")
    .replace(/^treats\b/i, "you treat")
    .replace(/^misses\b/i, "you miss")
    .replace(/^fails\b/i, "you fail")
    .replace(/^handles\b/i, "you handle")
    .replace(/^does not\b/i, "you do not")
    .replace(/^incorrectly divides\b/i, "you divide incorrectly")
    .replace(/^applies\b/i, "you apply")
    .replace(/^stops\b/i, "you stop")
    .replace(/^forms\b/i, "you form")
    .replace(/^is\b/i, "it is");
}

function teacherTrapLines(source: PncStudentSourcePackage, presentation: PncStudentPresentation): string[] {
  const section = presentation.explanationSections.find((item) => item.kind === "commonTrapWarning");
  if (!section) throw new Error(`${source.questionLanguageId}: missing trap section`);
  const atoms = parseArithmeticAtoms(source.solver.mathJax);

  return section.lines.map((line) => {
    const match = line.match(/^Option ([A-D]) \(([^)]*)\):\s*(.*?)(?:\.)?$/);
    if (!match) return line;
    const letter = match[1]!;
    const label = match[2]!;
    const reason = match[3]!.replace(/\.$/, "");
    const value = optionValue(label);
    const matchingAtom = value === undefined ? undefined : atoms.find((atom) => atom.value === value);

    if (matchingAtom) {
      return `Don't fall for Option ${letter} (${label}). It counts only $${matchingAtom.token} = ${numberFormatter.format(matchingAtom.value)}$ and stops before the remaining required factor or restriction.`;
    }
    return `Don't fall for Option ${letter} (${label}). This result appears when ${secondPersonReason(reason)}.`;
  });
}

function teacherSections(source: PncStudentSourcePackage, presentation: PncStudentPresentation): PncStudentExplanationSection[] {
  const core = teacherConcept(source, presentation);
  const steps: PncStudentExplanationSection = {
    kind: "stepByStep",
    heading: "📝 Step-by-Step Solution",
    lines: teacherSteps(source, presentation),
  };
  const shortcut = teacherShortcut(source, presentation);
  const traps: PncStudentExplanationSection = {
    kind: "commonTrapWarning",
    heading: "⚠️ Common Traps & Mistakes",
    lines: teacherTrapLines(source, presentation),
  };
  return [core, steps, shortcut, traps];
}

export function buildPnc002TeacherStudentPresentation(source: PncStudentSourcePackage): PncStudentPresentation {
  const examAuthentic = buildPnc002ExamAuthenticStudentPresentation(source);
  return {
    ...examAuthentic,
    explanationSections: teacherSections(source, examAuthentic),
  };
}
