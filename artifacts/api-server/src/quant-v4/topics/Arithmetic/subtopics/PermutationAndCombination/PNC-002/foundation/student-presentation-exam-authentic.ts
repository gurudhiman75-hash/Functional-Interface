import { buildPnc002FinalStudentPresentation } from "./student-presentation-final";
import type {
  PncStudentExplanationSection,
  PncStudentPresentation,
  PncStudentSourcePackage,
} from "./student-presentation";

type ExtendedSourcePackage = PncStudentSourcePackage & {
  parameters?: { values?: Record<string, unknown> };
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

function combination(total: number, selected: number): number | undefined {
  if (!Number.isInteger(total) || !Number.isInteger(selected) || selected < 0 || selected > total || total > 30) return undefined;
  const k = Math.min(selected, total - selected);
  let result = 1;
  for (let index = 1; index <= k; index += 1) result = (result * (total - k + index)) / index;
  return Number.isInteger(result) ? result : undefined;
}

function parseOptionValue(value: string): number | undefined {
  const match = value.match(/\(([\d,]+)\s/);
  if (!match) return undefined;
  const numeric = Number(match[1]!.replace(/,/g, ""));
  return Number.isSafeInteger(numeric) ? numeric : undefined;
}

function formatOption(value: string, unit: string): string {
  const numeric = Number(value.replace(/,/g, "").trim());
  if (!Number.isSafeInteger(numeric) || numeric <= 0) throw new Error(`Invalid PNC option: ${value}`);
  return `${numberFormatter.format(numeric)} ${unit}`;
}

function uniqueLines(lines: string[]): string[] {
  const unique = new Map<string, string>();
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    const key = line.toLowerCase().replace(/\s+/g, "");
    if (!unique.has(key)) unique.set(key, line);
  }
  return [...unique.values()];
}

function normaliseMathDelimiters(value: string): string {
  return value
    .replace(/\\\[/g, "$$")
    .replace(/\\\]/g, "$$")
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$");
}

function naturalise(value: string): string {
  return normaliseMathDelimiters(value)
    .replace(/\bdistinct\b/gi, "different")
    .replace(/\bspecified\b/gi, "particular")
    .replace(/\bunnamed\b/gi, "unlabelled")
    .replace(/\bnumbered teams\b/gi, "named teams")
    .replace(/\b(is|gives|equals|becomes|using|as|produce|produces)\$(?!\$)/gi, "$1 $")
    .replace(/\s+/g, " ")
    .trim();
}

function naturaliseForSource(source: PncStudentSourcePackage, value: string): string {
  const mode = source.solveMode.toLowerCase();
  let natural = naturalise(value);
  if (mode.includes("derangement") || mode.includes("fixedpoint")) {
    natural = natural
      .replace(/\bdifferent objects\b/gi, "numbered cards")
      .replace(/\bobjects\b/gi, "cards")
      .replace(/\bobject\b/gi, "card");
  }
  if (source.questionLanguageId === "PNC-QL-226"
      || source.questionLanguageId === "PNC-QL-227"
      || source.questionLanguageId === "PNC-QL-228") {
    natural = natural
      .replace(/\bidentical boxes\b/gi, "unlabelled groups")
      .replace(/\bboxes\b/gi, "groups")
      .replace(/\bbox\b/gi, "group");
  }
  return natural;
}

function ensureQuestionEnding(value: string): string {
  const trimmed = value.trim();
  if (/[?!]$/.test(trimmed)) return trimmed;
  if (/\bfind\b/i.test(trimmed)) return trimmed.replace(/\.$/, "") + ".";
  return trimmed.replace(/\.$/, "") + "?";
}

function examAuthenticStem(source: PncStudentSourcePackage): string {
  const qlId = source.questionLanguageId;
  let stem = naturalise(source.stem)
    .replace(/(\d+) different people stand in a row/gi, "$1 different people be seated in a straight row")
    .replace(/people must stand together/gi, "people must sit next to each other")
    .replace(/people must not stand together/gi, "people must not sit next to each other")
    .replace(/pair-blocks must not be adjacent to one another/gi, "pair-blocks must not be adjacent");

  if (qlId === "PNC-QL-107") {
    stem = stem.replace(
      /^In how many ways can (\d+) different people be seated in a straight row/i,
      "In how many different ways can $1 people be seated in a straight row",
    );
  } else if (qlId === "PNC-QL-108") {
    stem = stem.replace(
      /^In how many linear arrangements of (\d+) different books will a particular set of (\d+) books remain together\?/i,
      "$1 different books are to be arranged on a shelf. In how many arrangements will a particular set of $2 books remain together?",
    );
  } else if (qlId === "PNC-QL-110") {
    stem = stem.replace(
      /^In how many arrangements of (\d+) different files will a particular set of (\d+) files not all appear consecutively\?/i,
      "$1 different files are to be arranged in a row. In how many arrangements will a particular set of $2 files not all be consecutive?",
    );
  } else if (qlId === "PNC-QL-178") {
    stem = stem.replace(
      /^At a round-table meeting of (\d+) people, one person is fixed as the reference\. In how many relative seatings can the remaining people be arranged\?/i,
      "$1 people are seated around a round table, with one person fixed as a reference. In how many relative seatings can the others be arranged?",
    );
  } else if (qlId === "PNC-QL-196") {
    stem = stem.replace(
      /^There are (\d+) members of Category A and (\d+) members of Category B\. In how many round-table arrangements do the two categories alternate\?/i,
      "$1 members of Category A and $2 members of Category B are seated around a round table. In how many arrangements do the two categories alternate?",
    );
  } else if (qlId === "PNC-QL-197") {
    stem = stem.replace(
      /^There are (\d+) members of Category A and (\d+) members of Category B\. In how many round-table arrangements are no two Category B members adjacent\?/i,
      "$1 members of Category A and $2 members of Category B are seated around a round table. In how many arrangements are no two Category B members adjacent?",
    );
  } else if (qlId === "PNC-QL-210") {
    stem = stem.replace(/\bnumbered teams\b/gi, "named teams");
  } else if (qlId === "PNC-QL-226") {
    stem = stem.replace(
      /be divided among exactly (\d+) non-empty identical boxes, where swapping complete boxes does not create a new distribution/i,
      "be divided into exactly $1 non-empty unlabelled groups",
    );
  } else if (qlId === "PNC-QL-227") {
    stem = stem.replace(
      /be divided among at most (\d+) non-empty identical boxes, where the boxes have no labels/i,
      "be divided into at most $1 non-empty unlabelled groups",
    );
  } else if (qlId >= "PNC-QL-253" && qlId <= "PNC-QL-257") {
    stem = stem
      .replace(/\bdifferent objects\b/gi, "numbered cards")
      .replace(/\bobjects\b/gi, "cards")
      .replace(/\bobject\b/gi, "card")
      .replace(
        /^For two particular cards among (\d+) numbered cards,/i,
        "$1 numbered cards are rearranged. For two particular cards,",
      );
  } else if (qlId === "PNC-QL-262" || qlId === "PNC-QL-263") {
    stem = stem
      .replace(/\bidentical objects\b/gi, "identical balls")
      .replace(/three labelled boxes whose maximum capacities are/gi, "three labelled boxes with capacities");
  } else if (qlId === "PNC-QL-264") {
    stem = stem.replace(/\bdifferent objects\b/gi, "different parcels");
  } else if (qlId === "PNC-QL-269") {
    stem = stem.replace(
      /^There are (\d+) women and (\d+) men\. They are divided into two named teams of (\d+) each, with Team A containing exactly (\d+) women\. Afterward, a captain is chosen for each team\. How many outcomes are possible\?/i,
      "A sports club has $1 women and $2 men. They are divided into named teams A and B of $3 members each, with exactly $4 women in Team A. If each team chooses a captain from its own members, in how many ways can the teams and captains be chosen?",
    );
  }
  return ensureQuestionEnding(stem);
}

function stripStepNumber(value: string): string {
  return value.replace(/^\d+\.\s*/, "").trim();
}

function isCalculationOrAnswerSummary(value: string, mathJax: string): boolean {
  const lower = value.toLowerCase();
  return value.includes(`$$${mathJax}$$`)
    || lower.startsWith("use the solver-owned calculation")
    || lower.startsWith("therefore")
    || lower.startsWith("thus")
    || lower.startsWith("hence")
    || lower.startsWith("the calculation")
    || lower.startsWith("the complete count")
    || lower.startsWith("the complete calculation")
    || lower.startsWith("the complete quota")
    || lower.startsWith("so the calculation")
    || lower.startsWith("that gives");
}

function authoredProcessLines(source: PncStudentSourcePackage): string[] {
  return uniqueLines(
    source.explanation.lines
      .map((line) => naturaliseForSource(source, line))
      .filter((line) => !isCalculationOrAnswerSummary(line, source.solver.mathJax)),
  );
}

function baseProcessLines(
  presentation: PncStudentPresentation,
  source: PncStudentSourcePackage,
): string[] {
  const stepSection = presentation.explanationSections.find((section) => section.kind === "stepByStep");
  if (!stepSection) return [];
  return uniqueLines(
    stepSection.lines
      .map(stripStepNumber)
      .map((line) => naturaliseForSource(source, line))
      .filter((line) => !isCalculationOrAnswerSummary(line, source.solver.mathJax)),
  );
}

function coreConceptLines(
  source: PncStudentSourcePackage,
  presentation: PncStudentPresentation,
  processLines: string[],
): string[] {
  const mode = source.solveMode.toLowerCase();
  const qlId = source.questionLanguageId;
  const specific = processLines[0];

  if (qlId === "PNC-QL-226" || qlId === "PNC-QL-227" || qlId === "PNC-QL-228") {
    const base = qlId === "PNC-QL-228"
      ? "Different objects divided into any number of non-empty unlabelled groups are counted by a Bell number."
      : "Different objects divided into a fixed or bounded number of non-empty unlabelled groups are counted with Stirling numbers of the second kind.";
    return uniqueLines([base, ...(specific ? [specific] : [])]).slice(0, 2);
  }
  if ((mode.includes("identical") || /identical/.test(source.stem))
      && (mode.includes("box") || mode.includes("receiver") || mode.includes("distribution") || /boxes?|bags?|jars?/.test(source.stem))) {
    return uniqueLines([
      "For identical items, an allocation is determined only by the occupancy of each labelled receiver.",
      ...(specific ? [specific] : []),
    ]).slice(0, 2);
  }
  if ((mode.includes("group") || mode.includes("team") || mode.includes("pair"))
      && /named|numbered|labelled/i.test(source.stem)) {
    return uniqueLines([
      "Named groups have different identities, so do not divide by permutations of whole groups.",
      ...(specific ? [specific] : []),
    ]).slice(0, 2);
  }

  const core = presentation.explanationSections.find((section) => section.kind === "coreConcept");
  const general = core?.lines.map((line) => naturaliseForSource(source, line)) ?? [];
  return uniqueLines([...general, ...(specific ? [specific] : [])]).slice(0, 2);
}

function shortcutLines(
  source: PncStudentSourcePackage,
  presentation: PncStudentPresentation,
): string[] {
  const mode = source.solveMode.toLowerCase();
  const stem = source.stem.toLowerCase();
  const qlId = source.questionLanguageId;

  if (mode.includes("recover")) {
    return ["Test only the permitted candidate values in a small table; the value that reproduces the target count is the answer."];
  }
  if (mode.includes("derangement") || mode.includes("fixedpoint")) {
    return ["For fixed-position questions, separate the positions that stay fixed and derange the remaining cards."];
  }
  if (mode.includes("grid") || mode.includes("path")) {
    return ["A shortest path is an ordering of right and upward moves: use a binomial coefficient, then split or subtract at compulsory or forbidden points."];
  }
  if (/captain|chairperson|secretary|treasurer/.test(stem)) {
    return ["Complete the selection or grouping first; multiply the ordered role choices only after the members are fixed."];
  }
  if (mode.includes("alternation") || mode.includes("adjacent") || mode.includes("gap")) {
    return ["Arrange the controlling category first and count only the gaps or alternate positions available to the restricted category."];
  }
  if (mode.includes("relativeorder") || mode.includes("position")) {
    return ["Reserve the compulsory positions first; for a prescribed relative order, divide by the factorial of the ordered subset."];
  }
  if (mode.includes("dihedral")) {
    return ["Count circular arrangements first; divide by 2 only when a reflected arrangement is explicitly considered the same."];
  }
  if (mode.includes("circular") || mode.includes("roundtable") || mode.includes("rotation")) {
    return ["Fix one person as the reference before applying the remaining condition; this removes rotational duplicates immediately."];
  }
  if (mode.includes("block") || mode.includes("together") || mode.includes("apart")) {
    return ["Compress each required group into one unit, count the outside units, restore internal orders, and use a complement for a 'not together' condition."];
  }
  if (mode.includes("committee") || mode.includes("selection") || mode.includes("category")
      || mode.includes("compulsory") || mode.includes("excluded")) {
    return ["Adjust the eligible pool first, write one product of combinations for each valid quota case, and add only disjoint cases."];
  }
  if (qlId === "PNC-QL-226" || qlId === "PNC-QL-227" || qlId === "PNC-QL-228") {
    return ["Use Stirling numbers for an exact or bounded number of non-empty unlabelled groups; sum them to obtain an 'at most' count or a Bell number."];
  }
  if (mode.includes("group") || mode.includes("team") || mode.includes("pair")) {
    if (/named|numbered|labelled/.test(stem)) {
      return ["For named groups, divide only by internal orders within each group; do not divide by permutations of the whole groups."];
    }
    return ["Count the corresponding named groups first, then divide by the factorials of interchangeable whole groups before adding any role choices."];
  }
  if ((mode.includes("identical") || /identical/.test(stem))
      && (mode.includes("box") || mode.includes("receiver") || mode.includes("distribution") || /boxes?|bags?|jars?/.test(stem))) {
    return ["For identical items, count occupancy vectors: shift minimums first, then apply stars and bars, inclusion–exclusion or integer partitions as required."];
  }
  if (mode.includes("distribution") || mode.includes("receiver") || mode.includes("boxes")
      || /assigned to|placed in|distributed among|filed in|sent to/.test(stem)) {
    return ["For different items and labelled receivers, start from one receiver choice per item, then enforce non-empty or capacity conditions."];
  }

  const shortcut = presentation.explanationSections.find((section) => section.kind === "examSpeedShortcut");
  return shortcut?.lines.map((line) => naturaliseForSource(source, line))
    ?? ["Write the counting stages separately before multiplying or adding them."];
}

function familyTrapReason(source: PncStudentSourcePackage): string {
  const mode = source.solveMode.toLowerCase();
  const stem = source.stem.toLowerCase();
  const qlId = source.questionLanguageId;

  if (mode.includes("recover")) return "fails the bounded candidate check and does not reproduce the stated target";
  if (mode.includes("derangement") || mode.includes("fixedpoint")) return "counts the wrong fixed-point case";
  if (mode.includes("grid") || mode.includes("path")) return "does not apply the checkpoint or complement condition correctly";
  if (/captain|chairperson|secretary|treasurer/.test(stem)) return "uses the wrong team or committee selection before the role choices are applied";
  if (mode.includes("alternation") || mode.includes("adjacent") || mode.includes("gap")
      || mode.includes("relativeorder") || mode.includes("position")) {
    return "uses the wrong admissible positions, gaps or relative-order factor";
  }
  if (mode.includes("dihedral") || mode.includes("circular") || mode.includes("roundtable") || mode.includes("rotation")) {
    return "uses a linear count or the wrong rotation/reflection symmetry factor";
  }
  if (mode.includes("block") || mode.includes("together") || mode.includes("apart")) {
    return "uses an incomplete block or complement count, with an outside arrangement, internal order or subtraction factor missing";
  }
  if (mode.includes("committee") || mode.includes("selection") || mode.includes("category")
      || mode.includes("compulsory") || mode.includes("excluded")) {
    return "uses the wrong eligible pool or omits one of the valid quota cases";
  }
  if (qlId === "PNC-QL-226" || qlId === "PNC-QL-227" || qlId === "PNC-QL-228") {
    return "treats the unlabelled groups as labelled or uses the wrong Stirling-number range";
  }
  if (mode.includes("group") || mode.includes("team") || mode.includes("pair")) {
    if (/named|numbered|labelled/.test(stem)) {
      return "incorrectly divides for permutations of whole groups even though the group names distinguish them";
    }
    return "misses a whole-group symmetry factor for interchangeable groups";
  }
  if ((mode.includes("identical") || /identical/.test(stem))
      && (mode.includes("box") || mode.includes("receiver") || mode.includes("distribution") || /boxes?|bags?|jars?/.test(stem))) {
    return "uses the wrong stars-and-bars shift, partition limit or occupancy bound";
  }
  if (mode.includes("distribution") || mode.includes("receiver") || mode.includes("boxes")
      || /assigned to|placed in|distributed among|filed in|sent to/.test(stem)) {
    return "uses the wrong empty/non-empty condition or confuses labelled and unlabelled receivers";
  }
  return "drops or adds one of the required counting stages";
}

function refinedTrapLines(
  source: PncStudentSourcePackage,
  presentation: PncStudentPresentation,
): string[] {
  const trapSection = presentation.explanationSections.find((section) => section.kind === "commonTrapWarning");
  if (!trapSection) throw new Error(`${source.questionLanguageId}: missing trap-warning section`);
  const familyReason = familyTrapReason(source);

  return trapSection.lines.map((line) => {
    const natural = naturaliseForSource(source, line);
    const option = parseOptionValue(natural);

    if (source.questionLanguageId === "PNC-QL-269" && option !== undefined) {
      const women = numericValue(source, "womenCount");
      const men = numericValue(source, "menCount");
      const teamSize = numericValue(source, "teamSize");
      if (women !== undefined && men !== undefined && teamSize !== undefined) {
        const unrestrictedSelection = combination(women + men, teamSize);
        const unrestrictedWithCaptains = unrestrictedSelection === undefined
          ? undefined
          : unrestrictedSelection * teamSize * teamSize;
        if (option === unrestrictedWithCaptains) {
          return natural.replace(/: .*\.$/, ": forms Team A without enforcing the required number of women.");
        }
      }
    }

    if (source.questionLanguageId === "PNC-QL-226"
        || source.questionLanguageId === "PNC-QL-227"
        || source.questionLanguageId === "PNC-QL-228") {
      if (/treats identical objects as different/i.test(natural)) {
        return natural.replace(
          /treats identical objects as different and uses one receiver choice per object/i,
          "treats the unlabelled groups as labelled and counts assignments to labelled receivers",
        );
      }
    }
    if (/does not match the required formula|incomplete count or arithmetic distractor/i.test(natural)) {
      return natural.replace(/does not match the required formula .*?(?: and represents an incomplete count or arithmetic distractor)?\.$/i, `${familyReason}.`);
    }
    return natural;
  });
}

function examAuthenticSections(
  source: PncStudentSourcePackage,
  presentation: PncStudentPresentation,
): PncStudentExplanationSection[] {
  const authored = authoredProcessLines(source);
  const fallback = baseProcessLines(presentation, source);
  const process = uniqueLines([...authored, ...fallback]);
  const core = coreConceptLines(source, presentation, process);
  const solutionProcess = process.slice(0, 3).length > 0
    ? process.slice(0, 3)
    : ["Apply the stated restriction before evaluating the counting formula."];
  const steps = [
    ...solutionProcess,
    `Calculation: $$${source.solver.mathJax}$$`,
    `Therefore, the correct answer is **${presentation.answerLabel}**.`,
  ].map((line, index) => `${index + 1}. ${line}`);

  return presentation.explanationSections.map((section) => {
    if (section.kind === "coreConcept") return { ...section, lines: core };
    if (section.kind === "stepByStep") return { ...section, lines: steps };
    if (section.kind === "examSpeedShortcut") return { ...section, lines: shortcutLines(source, presentation) };
    return { ...section, lines: refinedTrapLines(source, presentation) };
  });
}

function examAuthenticOptionUnit(source: PncStudentSourcePackage, currentUnit: string): string {
  const number = Number(source.questionLanguageId.split("-").at(-1));
  if ((number >= 209 && number <= 218) || (number >= 226 && number <= 228)) return "groupings";
  return currentUnit;
}

export function buildPnc002ExamAuthenticStudentPresentation(
  source: PncStudentSourcePackage,
): PncStudentPresentation {
  const finalPresentation = buildPnc002FinalStudentPresentation(source);
  const optionUnit = examAuthenticOptionUnit(source, finalPresentation.optionUnit);
  const displayOptions = source.options.map((option) => formatOption(option, optionUnit));
  const answerLabel = displayOptions[source.correctIndex]!;
  const presentation = {
    ...finalPresentation,
    optionUnit,
    displayOptions,
    answerLabel,
  };
  return {
    ...presentation,
    stem: examAuthenticStem(source),
    explanationSections: examAuthenticSections(source, presentation),
  };
}
