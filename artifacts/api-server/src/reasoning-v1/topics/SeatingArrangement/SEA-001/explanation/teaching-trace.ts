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

function directExplanation(input: TeachingTraceInput): string {
  return [
    ...input.intro,
    "Build the arrangement by joining the clues in this order:",
    ...input.clues.map((clue, index) => `${index + 1}. ${clue.text}`),
    "Here the linked clues fix the arrangement directly, so a separate case split is not required.",
    input.finalHeading ?? "Final arrangement:",
    input.finalModel.display,
  ].join("\n\n");
}

/**
 * Compile verified prefix narrowing into a student-facing case/elimination trace.
 * Cases are exposed only when the enumerator proves that exactly two or three
 * complete possibilities remain. We never display arbitrary completions merely
 * because a larger search space was truncated to three examples.
 */
export function compileCaseEliminationExplanation(input: TeachingTraceInput): string {
  if (input.clues.length === 0) {
    return [...input.intro, input.finalHeading ?? "Final arrangement:", input.finalModel.display].join("\n\n");
  }

  const lastBranchablePrefix = Math.max(1, input.clues.length - 1);
  let branchPrefix = 0;
  let branchModels: TeachingCaseModel[] = [];

  for (let clueCount = 1; clueCount <= lastBranchablePrefix; clueCount += 1) {
    const models = uniqueModels(input.enumeratePrefix(clueCount, 4));
    // maxModels=4 acts as an exhaustiveness guard: a result of four means
    // there may be more, so it must not be presented as a closed case set.
    if (models.length >= 2 && models.length <= 3) {
      branchPrefix = clueCount;
      branchModels = models;
      break;
    }
  }

  if (branchPrefix === 0 || branchModels.length < 2) return directExplanation(input);
  if (!branchModels.some((model) => model.key === input.finalModel.key)) return directExplanation(input);

  const lines: string[] = [...input.intro];
  lines.push(branchPrefix === 1 ? "Start with this clue:" : `First combine clues 1 to ${branchPrefix}:`);
  lines.push(input.clues.slice(0, branchPrefix).map((clue, index) => `${index + 1}. ${clue.text}`).join("\n"));
  lines.push(`At this stage, exactly ${branchModels.length} cases are possible:`);
  lines.push(caseLines(branchModels).join("\n"));

  let activeKeys = new Set(branchModels.map((model) => model.key));
  const shownLaterClues = new Set<number>();

  for (let clueCount = branchPrefix + 1; clueCount <= input.clues.length && activeKeys.size > 1; clueCount += 1) {
    const prefixModels = uniqueModels(input.enumeratePrefix(clueCount, 4));
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
      lines.push(survivingKeys.has(model.key)
        ? `Case ${caseNumber} ✅ — it still fits this clue.`
        : `Case ${caseNumber} ❌ — cancel it because it does not satisfy this clue.`);
    }
    activeKeys = new Set([...activeKeys].filter((key) => survivingKeys.has(key)));
  }

  const finalCaseIndex = branchModels.findIndex((model) => model.key === input.finalModel.key);
  if (activeKeys.size === 1 && finalCaseIndex >= 0 && activeKeys.has(input.finalModel.key)) {
    lines.push(`Only Case ${finalCaseIndex + 1} remains, so the arrangement is fixed.`);
  } else {
    return directExplanation(input);
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
