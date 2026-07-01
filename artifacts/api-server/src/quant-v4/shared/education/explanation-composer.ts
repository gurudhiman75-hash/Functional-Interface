import { normalizeQuantV4Answer, renderQuantV4Answer, type QuantV4AnswerLike } from "../answers/answer-contract";
import { buildMathIllustrations } from "./math-illustration-builder";
import { resolvePedagogyRules } from "./pedagogy-resolver";
import { readEducationReferences } from "./resolver-utils";
import type {
  ChapterOwnedEducationalStep,
  EducationalExplanation,
  EducationalExplanationBlock,
  EducationalKnowledgeLink,
  EducationalResolverContext,
  EducationalShortcutBlock,
  EducationalTeachingStep,
  EducationalTrapWarning,
  ExplanationComposerInput,
  MathIllustration,
  ResolvedPedagogyRule,
  ResolvedShortcut,
  ResolvedStrategy,
  ResolvedTerminologyEntry,
  ResolvedTrap,
} from "./renderer-contracts";
import { QUANT_V4_ERE_CONTRACT_VERSION } from "./renderer-contracts";
import { resolveShortcuts } from "./shortcut-resolver";
import { resolveStrategies } from "./strategy-resolver";
import { applyTerminology, resolveTerminologyEntries } from "./terminology-resolver";
import { resolveTraps } from "./trap-resolver";

function introduction(input: ExplanationComposerInput, strategies: readonly ResolvedStrategy[]) {
  const base = strategies[0]
    ? `We will use the strategy: ${strategies[0].title}.`
    : "We will connect the given values to the required answer step by step.";
  return input.stem ? `${base} Start from what the question gives and keep the required value in focus.` : base;
}

function buildTeachingSteps(
  strategies: readonly ResolvedStrategy[],
  pedagogyRules: readonly ResolvedPedagogyRule[],
  terminologyEntries: readonly ResolvedTerminologyEntry[],
  mathIllustrationIds: readonly string[],
): EducationalTeachingStep[] {
  return strategies.map((strategy, index) => ({
    id: `STEP-${index + 1}`,
    title: strategy.title,
    narrative: applyTerminology(strategy.description, terminologyEntries),
    mathIllustrationIds: mathIllustrationIds.length ? [mathIllustrationIds[Math.min(index, mathIllustrationIds.length - 1)]!] : [],
    strategyIds: [strategy.id],
    pedagogyRuleIds: pedagogyRules.slice(0, 2).map((rule) => rule.id),
    terminologyIds: terminologyEntries.slice(0, 3).map((entry) => entry.id),
    review: strategy.review,
  }));
}

function buildChapterOwnedMathIllustrations(steps: readonly ChapterOwnedEducationalStep[]): MathIllustration[] {
  return steps.map((step) => ({
    id: `${step.id}:math`,
    kind: step.kind ?? "equation",
    statement: step.statement,
    mathjax: step.mathjax,
    consequence: step.consequence ?? step.statement,
    sourceNodeId: step.sourceNodeId,
    review: step.review,
  }));
}

function buildChapterOwnedTeachingSteps(steps: readonly ChapterOwnedEducationalStep[], mathIllustrations: readonly MathIllustration[]): EducationalTeachingStep[] {
  return steps.map((step, index) => ({
    id: step.id,
    title: step.title,
    narrative: step.statement,
    mathIllustrationIds: mathIllustrations[index] ? [mathIllustrations[index]!.id] : [],
    strategyIds: [],
    pedagogyRuleIds: [],
    terminologyIds: [],
    review: step.review,
  }));
}

function buildShortcutBlocks(shortcuts: readonly ResolvedShortcut[], mathIllustrationIds: readonly string[]): EducationalShortcutBlock[] {
  return shortcuts.map((shortcut, index) => ({
    id: `SHORTCUT-${index + 1}`,
    shortcutId: shortcut.id,
    title: shortcut.title,
    explanation: `${shortcut.pattern ? `${shortcut.pattern} means ${shortcut.shortcut}. ` : ""}${shortcut.explanation}`.trim(),
    mathIllustrationIds: mathIllustrationIds.slice(0, 1),
    review: shortcut.review,
  }));
}

function buildTrapWarnings(traps: readonly ResolvedTrap[]): EducationalTrapWarning[] {
  return traps.map((trap, index) => ({
    id: `TRAP-${index + 1}`,
    trapId: trap.id,
    misconception: trap.misconception,
    correction: trap.correction,
    relevance: trap.relevance,
    review: trap.review,
  }));
}

function block(id: string, kind: EducationalExplanationBlock["kind"], markdown: string, title?: string, assetIds: readonly string[] = [], mathjax?: string): EducationalExplanationBlock {
  return { id, kind, title, markdown, assetIds, mathjax };
}

function buildBlocks(explanation: Omit<EducationalExplanation, "blocks">): EducationalExplanationBlock[] {
  const blocks: EducationalExplanationBlock[] = [block("INTRO", "introduction", explanation.introduction, "Approach")];
  for (const step of explanation.teachingSteps) {
    const math = explanation.mathIllustrations.find((item) => step.mathIllustrationIds.includes(item.id));
    blocks.push(block(step.id, "teaching-step", step.narrative, step.title, [...step.strategyIds, ...step.pedagogyRuleIds, ...step.terminologyIds], math?.mathjax));
  }
  for (const shortcut of explanation.shortcutBlocks) {
    blocks.push(block(shortcut.id, "shortcut", shortcut.explanation, shortcut.title, [shortcut.shortcutId]));
  }
  for (const trap of explanation.trapWarnings) {
    blocks.push(block(trap.id, "trap-warning", `Common mistake: ${trap.misconception}\n\nCorrection: ${trap.correction}`, "Trap warning", [trap.trapId]));
  }
  for (const illustration of explanation.mathIllustrations) {
    blocks.push(block(illustration.id, "math-illustration", illustration.statement, "Math consequence", [], illustration.mathjax));
  }
  blocks.push(block("RECAP", "recap", explanation.recap, "Recap"));
  blocks.push(block("FINAL", "final-answer", explanation.finalAnswer, "Final answer"));
  return blocks;
}

function buildKnowledgeLinks(
  strategies: readonly ResolvedStrategy[],
  shortcuts: readonly ResolvedShortcut[],
  traps: readonly ResolvedTrap[],
  pedagogyRules: readonly ResolvedPedagogyRule[],
  terminologyEntries: readonly ResolvedTerminologyEntry[],
  existing: readonly EducationalKnowledgeLink[] = [],
): EducationalKnowledgeLink[] {
  const links: EducationalKnowledgeLink[] = [...existing];
  for (const strategy of strategies) {
    for (const shortcut of shortcuts) links.push({ sourceId: strategy.id, targetId: shortcut.id, relation: "supports" });
    for (const trap of traps) links.push({ sourceId: strategy.id, targetId: trap.id, relation: "warns-about" });
    for (const rule of pedagogyRules) links.push({ sourceId: strategy.id, targetId: rule.id, relation: "governed-by" });
    for (const term of terminologyEntries) links.push({ sourceId: strategy.id, targetId: term.id, relation: "phrased-by" });
  }
  const seen = new Set<string>();
  return links.filter((link) => {
    const key = `${link.sourceId}:${link.relation}:${link.targetId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function composeEducationalExplanation(input: ExplanationComposerInput): EducationalExplanation {
  const assets = input.assets ?? {};
  const context: EducationalResolverContext = {
    input,
    references: readEducationReferences(input),
    assets,
  };

  const strategies = resolveStrategies(context);
  const pedagogyRules = resolvePedagogyRules(context, strategies);
  const terminologyEntries = resolveTerminologyEntries(context, strategies, pedagogyRules);
  const shortcuts = resolveShortcuts(context, strategies);
  const traps = resolveTraps(context, strategies);
  const chapterOwnedSteps = input.chapterOwnedSteps ?? [];
  const mathIllustrations = chapterOwnedSteps.length ? buildChapterOwnedMathIllustrations(chapterOwnedSteps) : buildMathIllustrations(input);
  const finalAnswerValue = renderQuantV4Answer(input.canonicalAnswer ?? normalizeQuantV4Answer(input.answer as QuantV4AnswerLike));
  const teachingSteps = chapterOwnedSteps.length
    ? buildChapterOwnedTeachingSteps(chapterOwnedSteps, mathIllustrations)
    : buildTeachingSteps(strategies, pedagogyRules, terminologyEntries, mathIllustrations.map((item) => item.id));
  const shortcutBlocks = buildShortcutBlocks(shortcuts, mathIllustrations.map((item) => item.id));
  const trapWarnings = buildTrapWarnings(traps);
  const intro = applyTerminology(introduction(input, strategies), terminologyEntries);
  const recap = applyTerminology("We used the given values, applied the selected strategy, checked useful shortcuts or traps, and reached the required value.", terminologyEntries);
  const finalAnswer = `So, the answer is ${finalAnswerValue}.`;
  const knowledgeLinks = buildKnowledgeLinks(strategies, shortcuts, traps, pedagogyRules, terminologyEntries, assets.knowledgeLinks);

  const withoutBlocks = {
    contractVersion: QUANT_V4_ERE_CONTRACT_VERSION,
    introduction: intro,
    teachingSteps,
    mathIllustrations,
    shortcutBlocks,
    trapWarnings,
    recap,
    finalAnswer,
    knowledgeLinks,
  } satisfies Omit<EducationalExplanation, "blocks">;

  return {
    ...withoutBlocks,
    blocks: buildBlocks(withoutBlocks),
  };
}
