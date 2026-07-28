export type PncStudentSectionKind = "coreConcept" | "stepByStep" | "examSpeedShortcut" | "commonTrapWarning";

export interface PncStudentExplanationSection {
  kind: PncStudentSectionKind;
  heading: string;
  lines: string[];
}

export interface PncStudentPresentation {
  questionLanguageId: string;
  canonicalProblemId: string;
  solveMode: string;
  stem: string;
  optionUnit: string;
  displayOptions: string[];
  correctIndex: number;
  answerLabel: string;
  explanationSections: PncStudentExplanationSection[];
}

export interface PncStudentSourcePackage {
  questionLanguageId: string;
  canonicalProblemId: string;
  solveMode: string;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  solver: {
    numericAnswer: number;
    mathJax: string;
    equation: string;
    evidence: object;
  };
  explanation: { lines: string[] };
}

const numberFormatter = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

function normaliseMathDelimiters(value: string): string {
  return value
    .replace(/\\\[/g, "$$")
    .replace(/\\\]/g, "$$")
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$");
}

function sentenceCase(value: string): string {
  const trimmed = value.trim();
  return trimmed ? `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}` : trimmed;
}

function ensureQuestionMark(value: string): string {
  const trimmed = value.trim().replace(/[.]+$/, "");
  return trimmed.endsWith("?") ? trimmed : `${trimmed}?`;
}

function lexicalPolish(value: string): string {
  return normaliseMathDelimiters(value)
    .replace(/\bdistinct people\b/gi, "different people")
    .replace(/\bdistinct books\b/gi, "different books")
    .replace(/\bdistinct files\b/gi, "labelled files")
    .replace(/\bdistinct objects\b/gi, "different numbered objects")
    .replace(/\bspecified set\b/gi, "particular set")
    .replace(/\bspecified pair\b/gi, "particular pair")
    .replace(/\bspecified person\b/gi, "particular person")
    .replace(/\bspecified woman\b/gi, "particular woman")
    .replace(/\bspecified man\b/gi, "particular man")
    .replace(/\bmust stand together\b/gi, "must be next to each other")
    .replace(/\bstand in a row\b/gi, "be seated in a straight row")
    .replace(/\bunnamed groups\b/gi, "unlabelled groups")
    .replace(/\bunnamed teams\b/gi, "unlabelled teams")
    .replace(/\bunnamed non-empty receivers\b/gi, "identical non-empty receivers")
    .replace(/\s+/g, " ")
    .trim();
}

function prependContext(stem: string, context: string): string {
  const polished = lexicalPolish(stem);
  return `${context} ${sentenceCase(polished)}`.replace(/\s+/g, " ").trim();
}

function humaniseStem(source: PncStudentSourcePackage): string {
  const qlId = source.questionLanguageId;
  const original = lexicalPolish(source.stem);

  if (qlId === "PNC-QL-107") {
    const match = original.match(/In how many ways can (\d+) different people be seated in a straight row if (.+)\?/i);
    if (match) return `In how many different ways can ${match[1]} people be seated in a straight row if ${match[2]}?`;
  }

  if (qlId === "PNC-QL-269") {
    const match = original.match(/There are (\d+) women and (\d+) men\. They are divided into two named teams of (\d+) each, with Team A containing exactly (\d+) women\. Afterward, a captain is chosen for each team\. How many outcomes are possible\?/i);
    if (match) {
      return `A sports club has ${match[2]} men and ${match[1]} women. They are split into two named teams, Team A and Team B, with ${match[3]} members in each team and exactly ${match[4]} women in Team A. If each team then chooses a captain from among its own members, in how many ways can the teams and captains be chosen?`;
    }
  }

  if (/books?|shelf/i.test(original)) {
    return prependContext(original, "A librarian is arranging material for a display shelf.");
  }
  if (/files?|records?/i.test(original)) {
    return prependContext(original, "A records clerk is arranging labelled files in a straight rack.");
  }
  if (/round table|circular|clockwise|neighbour|opposite seats?|ring|necklace|ornaments?/i.test(original)) {
    return prependContext(original, "An event organiser is planning a circular seating or display.");
  }
  if (/committee|chairperson|secretary|treasurer|selected from|chosen from/i.test(original)) {
    return prependContext(original, "A selection panel is forming a committee for an official event.");
  }
  if (/teams?|captain|sports club/i.test(original)) {
    return prependContext(original, "A sports club is forming teams for a tournament.");
  }
  if (/grid path|shortest path|moves? to the right|moves? upward|\(0,0\)/i.test(original)) {
    return prependContext(original, "A courier is travelling through a rectangular city grid.");
  }
  if (/balls?|objects?.*(boxes?|receivers?)|placed in.*boxes?|assigned to.*boxes?|distributed among/i.test(original)) {
    return prependContext(original, "A storekeeper is distributing items among clearly marked containers.");
  }
  if (/divided into|groups?|pairs?/i.test(original)) {
    return prependContext(original, "A school coordinator is forming project groups from the available students.");
  }
  if (/people|performers|students|persons?/i.test(original) && /row|linear|arranged/i.test(original)) {
    return prependContext(original, "A group is being seated for a formal photograph.");
  }
  if (/permutations?|original position|fixed/i.test(original)) {
    return prependContext(original, "A set of numbered cards is being rearranged for a puzzle.");
  }

  return prependContext(original, "An exam coordinator is working with the following counting arrangement.");
}

function inferInverseUnit(source: PncStudentSourcePackage): string {
  const stem = source.stem.toLowerCase();
  if (/receiver|box/.test(stem)) return "receivers";
  if (/group size/.test(stem)) return "people per group";
  if (/gap/.test(stem)) return "positions";
  if (/committee|people|person/.test(stem)) return "people";
  if (/category/.test(stem)) return "members";
  if (/object|ornament|card|book|file/.test(stem)) return "objects";
  return "values";
}

function inferOptionUnit(source: PncStudentSourcePackage): string {
  const mode = source.solveMode.toLowerCase();
  const stem = source.stem.toLowerCase();
  if (mode.includes("recover")) return inferInverseUnit(source);
  if (/shortest path|grid path|moves? to the right|moves? upward/.test(stem)) return "paths";
  if (/seated|seating|round table|sit|seat/.test(stem)) return "seatings";
  if (/permutation|original position|fixed point/.test(stem)) return "permutations";
  if (/distributed|distribution|assigned to|placed in|boxes?|receivers?/.test(stem)) return "distributions";
  if (/arrange|arrangement|row|shelf|ring|necklace|ornament|display/.test(stem)) return "arrangements";
  if (/committee|selected|chosen|selection/.test(stem)) return "selections";
  if (/divided into|groups?|teams?|pairs?/.test(stem)) return "groupings";
  return "ways";
}

function singularUnit(unit: string): string {
  const singulars: Record<string, string> = {
    ways: "way",
    arrangements: "arrangement",
    seatings: "seating",
    selections: "selection",
    distributions: "distribution",
    paths: "path",
    permutations: "permutation",
    groupings: "grouping",
    receivers: "receiver",
    positions: "position",
    people: "person",
    members: "member",
    objects: "object",
    values: "value",
  };
  return singulars[unit] ?? unit.replace(/s$/, "");
}

function parseNumericOption(value: string): number {
  const numeric = Number(value.replace(/,/g, "").trim());
  if (!Number.isInteger(numeric) || numeric <= 0) throw new Error(`PNC student option is not a positive integer: ${value}`);
  return numeric;
}

function formatOption(value: string, unit: string): string {
  const numeric = parseNumericOption(value);
  const label = numeric === 1 ? singularUnit(unit) : unit;
  return `${numberFormatter.format(numeric)} ${label}`;
}

function conceptTitle(mode: string): string {
  const lower = mode.toLowerCase();
  if (lower.includes("recover")) return "Bounded Reverse Search";
  if (lower.includes("derangement") || lower.includes("fixedpoint") || lower.includes("fixedpoints")) return "Derangements and Fixed-Point Inclusion–Exclusion";
  if (lower.includes("grid") || lower.includes("path")) return "Shortest-Path Binomial Counting";
  if (lower.includes("circular") || lower.includes("roundtable") || lower.includes("rotation") || lower.includes("dihedral")) return "Circular Symmetry and Reference Fixing";
  if (lower.includes("unlabelled") || lower.includes("unnamed") || lower.includes("identicalreceiver")) return "Symmetry Correction for Unlabelled Groups";
  if (lower.includes("distribution") || lower.includes("receiver") || lower.includes("boxes") || lower.includes("capacity")) return "Occupancy and Distribution Counting";
  if (lower.includes("alternation") || lower.includes("adjacent") || lower.includes("gap")) return "Gap Method and Position Restrictions";
  if (lower.includes("relativeorder") || lower.includes("position")) return "Position Reservation and Relative Order";
  if (lower.includes("committee") || lower.includes("selection") || lower.includes("category") || lower.includes("compulsory") || lower.includes("excluded")) return "Category-Wise Selection";
  if (lower.includes("block") || lower.includes("together") || lower.includes("apart")) return "Block (Tie) Method";
  if (lower.includes("group") || lower.includes("team") || lower.includes("pair")) return "Grouping with Identity and Symmetry";
  return "Structured Counting Principle";
}

function coreConceptLines(source: PncStudentSourcePackage): string[] {
  const mode = source.solveMode.toLowerCase();
  if (mode.includes("recover")) return ["Work backwards by evaluating only the stated candidate range and keep the unique value that reproduces the target count."];
  if (mode.includes("derangement")) return ["A derangement leaves no item in its original position; use the derangement recurrence or inclusion–exclusion over fixed positions."];
  if (mode.includes("fixedpoint")) return ["Choose any positions that must remain fixed, then derange the remaining items when the condition says exactly that many are fixed."];
  if (mode.includes("grid") || mode.includes("path")) return ["A shortest grid route is an ordering of horizontal and vertical moves, so it is counted with a binomial coefficient."];
  if (mode.includes("dihedral")) return ["First remove rotational duplicates, then remove mirror-image duplicates only when reflections are declared identical."];
  if (mode.includes("circular") || mode.includes("roundtable") || mode.includes("rotation")) return ["For a round table, fix one reference position to remove rotational duplicates before applying any additional restriction."];
  if (mode.includes("unlabelled") || mode.includes("unnamed")) return ["Count the corresponding labelled grouping first, then divide by the factorials of interchangeable whole groups."];
  if (mode.includes("identical") && (mode.includes("box") || mode.includes("receiver") || mode.includes("distribution"))) return ["Identical objects are described only by occupancies; use stars and bars, integer partitions or bounded occupancy counting as required."];
  if (mode.includes("distribution") || mode.includes("receiver") || mode.includes("capacity")) return ["Separate object identity from receiver identity, then enforce empty, non-empty or capacity conditions on the resulting assignments."];
  if (mode.includes("alternation") || mode.includes("adjacent") || mode.includes("gap")) return ["Arrange the controlling group first and use the gaps or admissible positions to place the restricted items."];
  if (mode.includes("relativeorder")) return ["All relative orders are equally likely; divide by the factorial of each independently ordered chain."];
  if (mode.includes("compulsory") || mode.includes("excluded")) return ["Fix compulsory members and remove excluded members before making the remaining selection."];
  if (mode.includes("category") || mode.includes("selection") || mode.includes("committee")) return ["Choose from each category separately, multiply within one case, and add only when several disjoint cases are allowed."];
  if (mode.includes("nottogether") || mode.includes("apart") || mode.includes("neither") || mode.includes("atleastone")) return ["Use a complement or inclusion–exclusion: begin with the unrestricted count and remove the forbidden event carefully."];
  if (mode.includes("block") || mode.includes("together")) return ["When particular items must remain together, tie them into one temporary block and restore their internal orders afterwards."];
  if (mode.includes("group") || mode.includes("team") || mode.includes("pair")) return ["Use a multinomial grouping count, then correct for whole-group labels and any roles chosen after the groups are formed."];
  return ["Break the task into independent counting stages and multiply; add only across mutually exclusive cases."];
}

function speedShortcut(source: PncStudentSourcePackage): string[] {
  const mode = source.solveMode.toLowerCase();
  if (mode.includes("recover")) return ["Write a tiny candidate table instead of trying to invert a factorial or combination formula algebraically."];
  if (mode.includes("derangement")) return ["Remember $!n=(n-1)(!(n-1)+!(n-2))$ for quick small-$n$ calculation."];
  if (mode.includes("fixedpoint")) return ["Exactly $r$ fixed points: use $\\binom{n}{r}!(n-r)$."];
  if (mode.includes("grid") || mode.includes("path")) return ["For $R$ right moves and $U$ upward moves, use $\\binom{R+U}{R}$; split and multiply at compulsory checkpoints."];
  if (mode.includes("dihedral")) return ["For different objects on a reversible ring, start from $(n-1)!$ and divide by $2$ only after confirming reflections are identical."];
  if (mode.includes("circular") || mode.includes("roundtable") || mode.includes("rotation")) return ["Ordinary round-table arrangements of $n$ different people equal $(n-1)!$."];
  if (mode.includes("unlabelled") || mode.includes("unnamed")) return ["Label first, count, then divide by the permutation count of interchangeable groups."];
  if (mode.includes("identical") && (mode.includes("box") || mode.includes("receiver") || mode.includes("distribution"))) return ["Identical objects into $r$ labelled boxes: $\\binom{n+r-1}{r-1}$; require non-empty boxes by shifting one item into each box first."];
  if (mode.includes("distribution") || mode.includes("receiver")) return ["Different objects into $r$ labelled receivers give $r^n$ before non-empty or occupancy restrictions are imposed."];
  if (mode.includes("alternation") || mode.includes("adjacent") || mode.includes("gap")) return ["Arrange the larger group first; its outside and internal gaps are the only legal slots for the restricted group."];
  if (mode.includes("relativeorder")) return ["A prescribed order of $r$ particular items usually contributes a divisor of $r!$."];
  if (mode.includes("compulsory") || mode.includes("excluded")) return ["Reduce both the pool and the number still to be selected before applying $\\binom{n}{r}$."];
  if (mode.includes("category") || mode.includes("selection") || mode.includes("committee")) return ["Write one product of combinations per valid quota case; use a short summation only for at-least or at-most conditions."];
  if (mode.includes("nottogether") || mode.includes("apart") || mode.includes("neither") || mode.includes("atleastone")) return ["Complement questions are often fastest as $\\text{total}-\\text{forbidden}$."];
  if (mode.includes("block") || mode.includes("together")) return ["A block of $k$ among $n$ different items contributes $(n-k+1)!\\,k!$ before any extra restriction."];
  if (mode.includes("team") || mode.includes("group")) return ["Form the groups first, apply any label-symmetry divisor, and multiply role choices only at the end."];
  return ["Write the structural formula before substituting numbers; this prevents double-counting and missed symmetry factors."];
}

const evidenceTrapRules: Array<[string, string]> = [
  ["unrestrictedCount", "counts every unrestricted outcome and ignores the stated condition"],
  ["externalArrangementCount", "arranges only the compressed outside units and forgets internal block orders"],
  ["forbiddenTogetherCount", "counts the forbidden together cases instead of subtracting them"],
  ["forbiddenCount", "counts only the excluded cases rather than the valid cases"],
  ["labelledPrecursorCount", "treats interchangeable or unlabelled groups as though they were labelled"],
  ["sameGroupCount", "counts the same-group event when the question asks for different groups"],
  ["differentGroupCount", "counts the different-group event when the question asks for the same group"],
  ["ordinaryArrangementCount", "uses an ordinary arrangement count and ignores the position-class restriction"],
  ["selectionCount", "stops after selection and omits the later arrangement or role-assignment stage"],
  ["forbiddenAdjacentUnitCount", "counts the adjacent forbidden placements instead of removing them"],
];

function genericTrapReasons(source: PncStudentSourcePackage): string[] {
  const mode = source.solveMode.toLowerCase();
  if (mode.includes("recover")) return ["choosing a nearby candidate without checking the target count", "assuming the unknown can be read directly from the formula"];
  if (mode.includes("derangement") || mode.includes("fixedpoint")) return ["using $n!$ and ignoring fixed-position restrictions", "allowing extra fixed points when the word exactly is present"];
  if (mode.includes("grid") || mode.includes("path")) return ["adding segment counts instead of multiplying independent path segments", "forgetting to subtract the overlap in an at-least-one-checkpoint problem"];
  if (mode.includes("dihedral")) return ["dividing only for rotations and forgetting reflection symmetry", "dividing by $2$ when mirror images are actually different"];
  if (mode.includes("circular") || mode.includes("roundtable") || mode.includes("rotation")) return ["using $n!$ instead of fixing one circular reference", "applying a linear block formula without circular adjustment"];
  if (mode.includes("unlabelled") || mode.includes("unnamed")) return ["forgetting to divide for interchangeable whole groups", "dividing by a symmetry factor that does not apply to differently sized groups"];
  if (mode.includes("identical") && (mode.includes("box") || mode.includes("receiver") || mode.includes("distribution"))) return ["using $r^n$, which treats identical objects as different", "forgetting the positive shift when every receiver must be non-empty"];
  if (mode.includes("distribution") || mode.includes("receiver") || mode.includes("capacity")) return ["confusing labelled and identical receivers", "ignoring an empty, non-empty or capacity condition"];
  if (mode.includes("alternation") || mode.includes("adjacent") || mode.includes("gap")) return ["counting all positions instead of legal gaps", "forgetting to arrange members within their categories"];
  if (mode.includes("relativeorder")) return ["multiplying by the chain factorial instead of dividing", "dividing by one factorial when two independent chains are present"];
  if (mode.includes("compulsory") || mode.includes("excluded")) return ["selecting from the original pool without fixing or removing named members", "reducing the pool but forgetting to reduce the remaining committee size"];
  if (mode.includes("category") || mode.includes("selection") || mode.includes("committee")) return ["adding category choices that should be multiplied within one case", "using one quota case when an at-least or at-most condition requires a sum"];
  if (mode.includes("nottogether") || mode.includes("apart") || mode.includes("neither") || mode.includes("atleastone")) return ["counting the forbidden event itself instead of its complement", "subtracting overlapping forbidden events twice without adding the overlap back"];
  if (mode.includes("block") || mode.includes("together")) return ["forgetting internal arrangements inside the block", "using the unrestricted factorial and ignoring the together condition"];
  if (mode.includes("team") || mode.includes("group")) return ["counting team formation but forgetting later captain or role choices", "treating unlabelled teams as named teams"];
  return ["multiplying stages that are actually alternative cases", "adding stages that are independent and should be multiplied"];
}

function trapLines(source: PncStudentSourcePackage, displayOptions: string[]): string[] {
  const optionNumbers = source.options.map(parseNumericOption);
  const evidence = source.solver.evidence as Record<string, unknown>;
  const lines: string[] = [];
  const usedIndexes = new Set<number>();

  for (const [key, reason] of evidenceTrapRules) {
    const value = evidence[key];
    if (typeof value !== "number" || !Number.isInteger(value)) continue;
    const index = optionNumbers.indexOf(value);
    if (index < 0 || index === source.correctIndex || usedIndexes.has(index)) continue;
    lines.push(`Option ${String.fromCharCode(65 + index)} (${displayOptions[index]}): ${reason}.`);
    usedIndexes.add(index);
    if (lines.length >= 2) return lines;
  }

  const fallbackReasons = genericTrapReasons(source);
  const wrongIndexes = optionNumbers.map((_, index) => index).filter((index) => index !== source.correctIndex && !usedIndexes.has(index));
  for (let index = 0; lines.length < 2 && index < wrongIndexes.length; index += 1) {
    const optionIndex = wrongIndexes[index]!;
    const reason = fallbackReasons[lines.length % fallbackReasons.length]!;
    lines.push(`Option ${String.fromCharCode(65 + optionIndex)} (${displayOptions[optionIndex]}): may arise from ${reason}.`);
  }
  return lines;
}

function stepByStepLines(source: PncStudentSourcePackage, answerLabel: string): string[] {
  const authored = source.explanation.lines.map((line) => normaliseMathDelimiters(line.trim())).filter(Boolean);
  const steps: string[] = [];
  for (const line of authored) {
    if (!steps.includes(line)) steps.push(line);
  }
  const displayEquation = `Use the solver-owned calculation: $$${source.solver.mathJax}$$`;
  if (!steps.some((line) => line.includes(source.solver.mathJax))) steps.push(displayEquation);
  const finalLine = `Therefore, the required answer is **${answerLabel}**.`;
  if (!steps.some((line) => line.includes(answerLabel))) steps.push(finalLine);
  while (steps.length < 3) steps.splice(Math.max(1, steps.length - 1), 0, "Complete the independent counting stages and multiply their counts.");
  return steps;
}

export function buildPnc002StudentPresentation(source: PncStudentSourcePackage): PncStudentPresentation {
  if (source.options.length !== 4) throw new Error(`${source.questionLanguageId}: four numeric options are required`);
  if (source.correctIndex < 0 || source.correctIndex > 3) throw new Error(`${source.questionLanguageId}: invalid correct option index`);
  const optionUnit = inferOptionUnit(source);
  const displayOptions = source.options.map((option) => formatOption(option, optionUnit));
  const answerLabel = displayOptions[source.correctIndex]!;
  if (parseNumericOption(source.answer) !== source.solver.numericAnswer) throw new Error(`${source.questionLanguageId}: answer and solver disagree`);

  return {
    questionLanguageId: source.questionLanguageId,
    canonicalProblemId: source.canonicalProblemId,
    solveMode: source.solveMode,
    stem: ensureQuestionMark(humaniseStem(source)),
    optionUnit,
    displayOptions,
    correctIndex: source.correctIndex,
    answerLabel,
    explanationSections: [
      {
        kind: "coreConcept",
        heading: `📌 Core Concept — ${conceptTitle(source.solveMode)}`,
        lines: coreConceptLines(source),
      },
      {
        kind: "stepByStep",
        heading: "📝 Step-by-Step Solution",
        lines: stepByStepLines(source, answerLabel),
      },
      {
        kind: "examSpeedShortcut",
        heading: "⚡ Exam Speed Shortcut",
        lines: speedShortcut(source),
      },
      {
        kind: "commonTrapWarning",
        heading: "⚠️ Common Trap Warning",
        lines: trapLines(source, displayOptions),
      },
    ],
  };
}
