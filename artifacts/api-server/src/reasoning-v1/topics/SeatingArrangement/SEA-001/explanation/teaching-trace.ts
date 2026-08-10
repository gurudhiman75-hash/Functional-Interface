export interface TeachingCaseModel {
  readonly key: string;
  readonly display: string;
}

export interface TeachingTraceClue {
  readonly text: string;
}

export interface TeachingTraceInput {
  readonly intro: readonly string[];
  readonly clues: readonly TeachingTraceClue[];
  readonly enumeratePrefix: (clueCount: number, maxModels: number) => readonly TeachingCaseModel[];
  readonly finalModel: TeachingCaseModel;
  readonly finalHeading?: string;
}

function uniqueModels(models: readonly TeachingCaseModel[]): TeachingCaseModel[] {
  const byKey = new Map<string, TeachingCaseModel>();
  for (const model of models) byKey.set(model.key, model);
  return [...byKey.values()];
}

function caseLines(models: readonly TeachingCaseModel[]): string[] {
  return models.map((model, index) => `Case ${index + 1}: ${model.display}`);
}

/**
 * Converts verified model-prefix narrowing into a student-facing teaching trace.
 *
 * The compiler deliberately shows no more than three cases. When a prefix has
 * exactly two or three possibilities, all are shown. If there are more, three
 * representative cases are shown (always including the verified final case),
 * and later clues are used to demonstrate why the alternatives are cancelled.
 */
export function compileCaseEliminationExplanation(input: TeachingTraceInput): string {
  if (input.clues.length === 0) {
    return [...input.intro, input.finalHeading ?? "Final arrangement:", input.finalModel.display].join("\n\n");
  }

  const lastBranchablePrefix = Math.max(1, input.clues.length - 1);
  let branchPrefix = 0;
  let branchModels: TeachingCaseModel[] = [];
  let exhaustiveBranch = false;

  // Prefer the earliest stage at which the remaining uncertainty is naturally
  // small enough for a student to compare every live case.
  for (let clueCount = 1; clueCount <= lastBranchablePrefix; clueCount += 1) {
    const models = uniqueModels(input.enumeratePrefix(clueCount, 4));
    if (models.length >= 2 && models.length <= 3) {
      branchPrefix = clueCount;
      branchModels = models;
      exhaustiveBranch = true;
      break;
    }
  }

  // Some clue sets jump from many possibilities directly to one. In that
  // situation, show only three useful examples rather than dumping every raw
  // arrangement. The verified final arrangement is always one of those cases.
  if (branchPrefix === 0) {
    branchPrefix = lastBranchablePrefix;
    const prefixModels = uniqueModels(input.enumeratePrefix(branchPrefix, 4));
    const alternatives = prefixModels.filter((model) => model.key !== input.finalModel.key).slice(0, 2);
    branchModels = uniqueModels([...alternatives, input.finalModel]).slice(0, 3);
    exhaustiveBranch = prefixModels.length < 4;
  } else if (!branchModels.some((model) => model.key === input.finalModel.key)) {
    branchModels = uniqueModels([...branchModels.slice(0, 2), input.finalModel]).slice(0, 3);
  }

  if (branchModels.length < 2) {
    return [
      ...input.intro,
      "Use the clues in this order:",
      ...input.clues.map((clue, index) => `${index + 1}. ${clue.text}`),
      "These deductions leave only one arrangement.",
      input.finalHeading ?? "Final arrangement:",
      input.finalModel.display,
    ].join("\n\n");
  }

  const lines: string[] = [...input.intro];
  lines.push(branchPrefix === 1
    ? "Start with this clue:"
    : `First combine clues 1 to ${branchPrefix}:`);
  lines.push(input.clues.slice(0, branchPrefix)
    .map((clue, index) => `${index + 1}. ${clue.text}`)
    .join("\n"));
  lines.push(exhaustiveBranch
    ? `At this stage, ${branchModels.length} cases are possible:`
    : "At this stage several arrangements are still possible. Instead of listing all of them, compare these three useful cases:");
  lines.push(caseLines(branchModels).join("\n"));

  let activeKeys = new Set(branchModels.map((model) => model.key));
  const shownLaterClues = new Set<number>();

  for (let clueCount = branchPrefix + 1; clueCount <= input.clues.length && activeKeys.size > 1; clueCount += 1) {
    const prefixModels = uniqueModels(input.enumeratePrefix(clueCount, 4));
    // A result of four may be truncated, so absence from it is not enough to
    // prove that a displayed case is impossible. Wait for an exhaustive prefix.
    if (prefixModels.length >= 4) continue;
    const survivingKeys = new Set(prefixModels.map((model) => model.key));
    const eliminated = branchModels.filter((model) => activeKeys.has(model.key) && !survivingKeys.has(model.key));
    if (eliminated.length === 0) continue;

    shownLaterClues.add(clueCount - 1);
    const clue = input.clues[clueCount - 1];
    if (!clue) continue;
    lines.push(`Now use clue ${clueCount}: ${clue.text}`);
    for (const model of branchModels) {
      if (!activeKeys.has(model.key)) continue;
      const caseNumber = branchModels.findIndex((candidate) => candidate.key === model.key) + 1;
      if (survivingKeys.has(model.key)) {
        lines.push(`Case ${caseNumber} ✅ — it still fits this clue.`);
      } else {
        lines.push(`Case ${caseNumber} ❌ — cancel it because it does not satisfy this clue.`);
      }
    }
    activeKeys = new Set([...activeKeys].filter((key) => survivingKeys.has(key)));
  }

  const finalCaseIndex = branchModels.findIndex((model) => model.key === input.finalModel.key);
  if (activeKeys.size === 1 && finalCaseIndex >= 0) {
    lines.push(`Only Case ${finalCaseIndex + 1} remains, so the arrangement is fixed.`);
  } else {
    lines.push("After applying the remaining clues, only the verified arrangement remains.");
  }

  const unshownLater = input.clues
    .map((clue, index) => ({ clue, index }))
    .filter(({ index }) => index >= branchPrefix && !shownLaterClues.has(index));
  if (unshownLater.length > 0) {
    lines.push("Use the remaining clue(s) as cross-checks:");
    lines.push(unshownLater.map(({ clue, index }) => `${index + 1}. ${clue.text}`).join("\n"));
  }

  lines.push(input.finalHeading ?? "Final arrangement:");
  lines.push(input.finalModel.display);
  return lines.join("\n\n");
}
