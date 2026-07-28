import {
  buildPnc002StudentPresentation,
  type PncStudentExplanationSection,
  type PncStudentPresentation,
  type PncStudentSourcePackage,
} from "./student-presentation";

const numberFormatter = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

function normaliseMath(value: string): string {
  return value
    .replace(/\\\[/g, "$$")
    .replace(/\\\]/g, "$$")
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$")
    .replace(/\$\s+/g, "$")
    .replace(/\s+\$/g, "$");
}

function polishLanguage(value: string): string {
  return normaliseMath(value)
    .replace(/\bdistinct\b/gi, "different")
    .replace(/\bspecified\b/gi, "particular")
    .replace(/\bunnamed\b/gi, "unlabelled")
    .replace(/\bmust stand together\b/gi, "must remain next to each other")
    .replace(/\s+/g, " ")
    .trim();
}

function ensureQuestionMark(value: string): string {
  const trimmed = value.trim().replace(/[.]+$/, "");
  return trimmed.endsWith("?") ? trimmed : `${trimmed}?`;
}

function replaceOpeningArticle(stem: string): string {
  return stem
    .replace(/^A committee\b/i, "The committee")
    .replace(/^A team\b/i, "The team")
    .replace(/^A panel\b/i, "The panel")
    .replace(/^A shelf\b/i, "The shelf")
    .replace(/^A shortest path\b/i, "The shortest path");
}

function addContext(context: string, stem: string): string {
  return `${context} ${replaceOpeningArticle(polishLanguage(stem))}`.replace(/\s+/g, " ").trim();
}

function reviewedStem(source: PncStudentSourcePackage): string {
  const original = polishLanguage(source.stem);
  const lower = original.toLowerCase();
  const mode = source.solveMode.toLowerCase();

  if (source.questionLanguageId === "PNC-QL-107") {
    const match = original.match(/In how many ways can (\d+) different people (?:stand|be seated) in a (?:straight )?row if (.+)\?/i);
    if (match) return `For a formal photograph, ${match[1]} people are to be seated in a straight row. In how many arrangements can they be seated if ${match[2]}?`;
  }

  if (source.questionLanguageId === "PNC-QL-269") {
    const match = original.match(/There are (\d+) women and (\d+) men\. They are divided into two named teams of (\d+) each, with Team A containing exactly (\d+) women\. Afterward, a captain is chosen for each team\. How many outcomes are possible\?/i);
    if (match) {
      return `A sports club has ${match[2]} men and ${match[1]} women. They are split into two named teams, Team A and Team B, with ${match[3]} members in each team and exactly ${match[4]} women in Team A. If each team chooses a captain from among its own members, in how many ways can the teams and captains be chosen?`;
    }
  }

  const isInverse = mode.includes("recover");
  const isDerangement = mode.includes("derangement") || mode.includes("fixedpoint");
  const isPath = mode.includes("grid") || mode.includes("path");
  const isCircular = mode.includes("circular") || mode.includes("roundtable") || mode.includes("clockwise") || mode.includes("dihedral") || mode.includes("rotation") || mode.includes("opposite") || mode.includes("neighbor") || mode.includes("neighbour");
  const isDistribution = mode.includes("distribution") || mode.includes("receiver") || mode.includes("occupancy") || mode.includes("boxes") || /assigned to|placed in|distributed among|filed in|sent to/.test(lower);
  const isGrouping = mode.includes("group") || mode.includes("team") || mode.includes("pair") || /divided into|divided between/.test(lower);
  const isSelection = mode.includes("selection") || mode.includes("committee") || mode.includes("compulsory") || mode.includes("excluded") || /committee|panel of|team of .*chosen|selected from|chosen from/.test(lower);
  const isLinearArrangement = mode.includes("block") || mode.includes("position") || mode.includes("relativeorder") || mode.includes("alternation") || mode.includes("gap") || /row|linear arrangements?/.test(lower);

  if (isDerangement) return ensureQuestionMark(addContext("A puzzle organiser is rearranging numbered cards.", original));
  if (isPath) return ensureQuestionMark(addContext("A courier is travelling through a rectangular city grid.", original));

  if (isDistribution) {
    if (/files?|documents?|folders?|cabinets?|records?/.test(lower)) {
      return ensureQuestionMark(addContext("A records office is filing documents into labelled storage locations.", original));
    }
    if (/parcels?|lockers?/.test(lower)) {
      return ensureQuestionMark(addContext("A courier depot is assigning parcels to numbered lockers.", original));
    }
    if (/trainees?|rooms?/.test(lower)) {
      return ensureQuestionMark(addContext("A training centre is assigning trainees to named rooms.", original));
    }
    if (/applications?|desks?/.test(lower)) {
      return ensureQuestionMark(addContext("An office is routing applications to named desks.", original));
    }
    if (/balls?|marbles?|tokens?/.test(lower)) {
      return ensureQuestionMark(addContext("A classroom activity uses boxes to distribute counters or tokens.", original));
    }
    return ensureQuestionMark(addContext("A warehouse is distributing items among clearly identified containers.", original));
  }

  if (isCircular) {
    if (/people|person|students?|players?|guests?/.test(lower)) {
      return ensureQuestionMark(addContext("At a conference dinner, guests are being seated around a circular table.", original));
    }
    return ensureQuestionMark(addContext("A designer is preparing a circular ornament or display.", original));
  }

  if (isSelection) {
    return ensureQuestionMark(addContext("A college is forming a committee or team for an official event.", original));
  }

  if (isLinearArrangement) {
    if (/books?|shelf/.test(lower)) return ensureQuestionMark(addContext("A librarian is arranging books on a display shelf.", original));
    if (/files?|records?/.test(lower)) return ensureQuestionMark(addContext("A records clerk is arranging labelled files in a rack.", original));
    if (/cards?/.test(lower)) return ensureQuestionMark(addContext("A teacher is arranging numbered cards in a row.", original));
    return ensureQuestionMark(addContext("For a formal photograph, participants are being arranged in a straight row.", original));
  }

  if (isGrouping) {
    if (/players?|teams?|captain/.test(lower)) return ensureQuestionMark(addContext("A sports club is forming teams for a tournament.", original));
    return ensureQuestionMark(addContext("A coordinator is dividing participants into project groups.", original));
  }

  if (isInverse) return ensureQuestionMark(addContext("An exam setter is checking a bounded counting result.", original));
  return ensureQuestionMark(addContext("A coordinator is planning a counting arrangement for an event.", original));
}

function parseNumeric(value: string): number {
  const numeric = Number(value.replace(/,/g, "").trim());
  if (!Number.isInteger(numeric) || numeric <= 0) throw new Error(`Invalid numeric option: ${value}`);
  return numeric;
}

function inverseUnit(source: PncStudentSourcePackage): string {
  const stem = source.stem.toLowerCase();
  if (/folders?|boxes?|receivers?|lockers?|laboratories?/.test(stem)) return "receivers";
  if (/group size/.test(stem)) return "people per group";
  if (/gap|positions?/.test(stem)) return "positions";
  if (/committee|people|person/.test(stem)) return "people";
  if (/category|members?/.test(stem)) return "members";
  return "objects";
}

function reviewedUnit(source: PncStudentSourcePackage): string {
  const mode = source.solveMode.toLowerCase();
  const stem = source.stem.toLowerCase();
  if (mode.includes("recover")) return inverseUnit(source);
  if (mode.includes("derangement") || mode.includes("fixedpoint")) return "permutations";
  if (mode.includes("grid") || mode.includes("path")) return "paths";
  if (mode.includes("distribution") || mode.includes("receiver") || mode.includes("occupancy") || mode.includes("boxes") || /assigned to|placed in|distributed among|filed in|sent to/.test(stem)) return "distributions";
  if (mode.includes("circular") || mode.includes("roundtable") || mode.includes("clockwise") || mode.includes("opposite")) {
    return /people|person|students?|players?|guests?/.test(stem) ? "seatings" : "arrangements";
  }
  if (mode.includes("dihedral") || mode.includes("rotation")) return "arrangements";
  if (mode.includes("block") || mode.includes("position") || mode.includes("relativeorder") || mode.includes("alternation") || mode.includes("gap")) return "arrangements";
  if (mode.includes("captain") || mode.includes("chair") || mode.includes("secretary") || mode.includes("treasurer") || /captain|chairperson|secretary|treasurer/.test(stem)) return "ways";
  if (mode.includes("group") || mode.includes("team") || mode.includes("pair") || /divided into|divided between/.test(stem)) return "groupings";
  if (mode.includes("selection") || mode.includes("committee") || mode.includes("compulsory") || mode.includes("excluded") || /committee|selected|chosen/.test(stem)) return "selections";
  if (/arrange|permutation|row|shelf|display/.test(stem)) return "arrangements";
  return "ways";
}

function singular(unit: string): string {
  const values: Record<string, string> = {
    arrangements: "arrangement",
    distributions: "distribution",
    groupings: "grouping",
    paths: "path",
    permutations: "permutation",
    people: "person",
    positions: "position",
    receivers: "receiver",
    selections: "selection",
    ways: "way",
    members: "member",
    objects: "object",
  };
  return values[unit] ?? unit.replace(/s$/, "");
}

function formatOption(value: string, unit: string): string {
  const numeric = parseNumeric(value);
  return `${numberFormatter.format(numeric)} ${numeric === 1 ? singular(unit) : unit}`;
}

function factorial(value: number): number | undefined {
  if (!Number.isInteger(value) || value < 0 || value > 10) return undefined;
  let result = 1;
  for (let factor = 2; factor <= value; factor += 1) result *= factor;
  return result;
}

const directEvidenceReasons: Array<[string, string]> = [
  ["unrestrictedCount", "uses the unrestricted count and ignores the stated restriction"],
  ["forbiddenTogetherCount", "counts the forbidden together cases instead of removing them"],
  ["forbiddenCount", "counts only the excluded cases rather than the valid cases"],
  ["allSpecifiedBlocksTogetherCount", "counts only the case in which all particular blocks form"],
  ["externalArrangementCount", "arranges the compressed outside units but omits internal orders"],
  ["primaryExternalArrangementCount", "stops after arranging the outside units and omits the remaining factors"],
  ["labelledPrecursorCount", "treats interchangeable groups or receivers as though they were labelled"],
  ["sameGroupCount", "counts the same-group event when a different-group event is required"],
  ["differentGroupCount", "counts the different-group event when a same-group event is required"],
  ["selectionCount", "stops after selecting members and omits the later arrangement or role choices"],
  ["forbiddenAdjacentUnitCount", "counts the forbidden adjacent placements rather than excluding them"],
  ["adjacentExternalPairCount", "counts the adjacent forbidden event instead of the permitted event"],
  ["ordinaryArrangementCount", "uses an ordinary arrangement count and ignores the position-class condition"],
];

function symmetryReason(source: PncStudentSourcePackage, option: number, correct: number): string | undefined {
  if (option !== correct * 2 && option * 2 !== correct) return undefined;
  const mode = source.solveMode.toLowerCase();
  if (mode.includes("unlabelled") || mode.includes("unnamed") || mode.includes("labelled") || mode.includes("named") || mode.includes("group") || mode.includes("team")) {
    return "applies an incorrect whole-group label or symmetry factor of 2";
  }
  if (mode.includes("dihedral") || mode.includes("rotation") || mode.includes("circular")) {
    return "applies the wrong rotation or reflection symmetry factor";
  }
  if (mode.includes("block") || mode.includes("together")) {
    return "misses or duplicates the two internal orders of a particular pair";
  }
  return undefined;
}

function exactTrapReason(source: PncStudentSourcePackage, option: number): string {
  const correct = source.solver.numericAnswer;
  const evidence = source.solver.evidence as Record<string, unknown>;

  for (const [key, reason] of directEvidenceReasons) {
    const value = evidence[key];
    if (typeof value === "number" && Number.isInteger(value) && value === option) return reason;
  }

  const totalObjects = evidence.totalObjects;
  if (typeof totalObjects === "number") {
    const unrestrictedFactorial = factorial(totalObjects);
    if (unrestrictedFactorial === option) return "uses the unrestricted factorial and ignores the condition";
  }

  const internalMultiplier = evidence.internalArrangementMultiplier;
  if (typeof internalMultiplier === "number" && internalMultiplier > 1 && option * internalMultiplier === correct) {
    return "forgets the internal arrangements inside the compressed block or groups";
  }

  const symmetry = symmetryReason(source, option, correct);
  if (symmetry) return symmetry;

  const difference = Math.abs(option - correct);
  if (difference <= 2 || difference / Math.max(1, correct) < 0.02) {
    return "is a nearby arithmetic distractor and does not equal the condition-aware calculation";
  }

  return `does not satisfy the required calculation $${source.solver.mathJax}$$ and represents an incomplete count or arithmetic distractor`;
}

function reviewedTrapLines(source: PncStudentSourcePackage, displayOptions: string[]): string[] {
  return source.options
    .map((value, index) => ({ value: parseNumeric(value), index }))
    .filter(({ index }) => index !== source.correctIndex)
    .map(({ value, index }) => `Option ${String.fromCharCode(65 + index)} (${displayOptions[index]}): ${exactTrapReason(source, value)}.`);
}

function reviewedSteps(base: PncStudentPresentation, answerLabel: string): string[] {
  const stepSection = base.explanationSections.find((section) => section.kind === "stepByStep");
  if (!stepSection) throw new Error(`${base.questionLanguageId}: missing step-by-step section`);
  const filtered = stepSection.lines.filter((line) => !/^Therefore, the required answer is \*\*/.test(line));
  const numbered = filtered.map((line, index) => `${index + 1}. ${normaliseMath(line)}`);
  numbered.push(`${numbered.length + 1}. Therefore, the required answer is **${answerLabel}**.`);
  return numbered;
}

function replaceSection(
  sections: PncStudentExplanationSection[],
  kind: PncStudentExplanationSection["kind"],
  lines: string[],
): PncStudentExplanationSection[] {
  return sections.map((section) => section.kind === kind ? { ...section, lines } : { ...section, lines: [...section.lines] });
}

export function buildPnc002ReviewedStudentPresentation(source: PncStudentSourcePackage): PncStudentPresentation {
  const base = buildPnc002StudentPresentation(source);
  const optionUnit = reviewedUnit(source);
  const displayOptions = source.options.map((option) => formatOption(option, optionUnit));
  const answerLabel = displayOptions[source.correctIndex]!;
  let sections = replaceSection(base.explanationSections, "stepByStep", reviewedSteps(base, answerLabel));
  sections = replaceSection(sections, "commonTrapWarning", reviewedTrapLines(source, displayOptions));

  return {
    ...base,
    stem: reviewedStem(source),
    optionUnit,
    displayOptions,
    answerLabel,
    explanationSections: sections,
  };
}
