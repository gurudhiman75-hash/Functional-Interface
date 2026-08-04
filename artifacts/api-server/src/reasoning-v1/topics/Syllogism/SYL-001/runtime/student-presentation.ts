import type { SurfacePremise, SylLocale } from "../foundation/types";
import { conclusionSemanticKey } from "./analysis";
import {
  renderPedagogicalVennDiagram,
  type PedagogicalDiagramFocus,
} from "./diagram";
import type { TermAssignment } from "./localization";
import type { SelectedLogic } from "./selection";
import type {
  GeneratedSylOption,
  SylConclusionTeachingStep,
  SylExplanationTrace,
  SylPremiseTeachingPoint,
  SylQlDefinition,
} from "./types";

const ROMAN = ["I", "II", "III", "IV"];

function focusEntry(
  selected: SelectedLogic,
  index: number,
): PedagogicalDiagramFocus | null {
  const candidate = selected.conclusions[index];
  if (!candidate) return null;
  return {
    label: ROMAN[index] ?? String(index + 1),
    conclusion: candidate.conclusion,
    classification: candidate.profile.classification,
  };
}

function correctOptionFocus(
  definition: SylQlDefinition,
  selected: SelectedLogic,
  correctOption: GeneratedSylOption,
): readonly PedagogicalDiagramFocus[] {
  const direct = selected.conclusions.findIndex((candidate) =>
    conclusionSemanticKey(candidate) === correctOption.semanticValue);
  if (direct >= 0) {
    const entry = focusEntry(selected, direct);
    return entry ? [entry] : [];
  }

  if (definition.renderer === "MODAL_CLASSIFICATION") {
    const entry = focusEntry(selected, 0);
    return entry ? [entry] : [];
  }

  const semantic = correctOption.semanticValue;
  if (semantic.startsWith("MASK_")) {
    const mask = Number.parseInt(semantic.slice("MASK_".length), 10);
    const chosen = selected.conclusions
      .map((_, index) => ((mask & (1 << index)) !== 0 ? focusEntry(selected, index) : null))
      .filter((entry): entry is PedagogicalDiagramFocus => entry !== null);
    // When the correct option is "none follows", all listed conclusions belong to that option.
    if (chosen.length > 0) return chosen;
    return selected.conclusions
      .map((_, index) => focusEntry(selected, index))
      .filter((entry): entry is PedagogicalDiagramFocus => entry !== null);
  }

  if (semantic === "ONLY_FIRST_FOLLOWS") {
    const entry = focusEntry(selected, 0);
    return entry ? [entry] : [];
  }
  if (semantic === "ONLY_SECOND_FOLLOWS") {
    const entry = focusEntry(selected, 1);
    return entry ? [entry] : [];
  }

  // BOTH, NEITHER, EITHER-OR and pair-classification answers describe the pair itself.
  return selected.conclusions
    .slice(0, 3)
    .map((_, index) => focusEntry(selected, index))
    .filter((entry): entry is PedagogicalDiagramFocus => entry !== null);
}

function simpleCoreRule(definition: SylQlDefinition): string {
  if (definition.taskKind.includes("EITHER_OR") || definition.taskKind === "CLASSIFY_CONCLUSION_PAIR") {
    return "Check each conclusion first. Choose ‘either I or II’ only when exactly one of them must be true.";
  }
  if (
    definition.taskKind.includes("MODAL")
    || definition.taskKind.includes("POSSIBILITY")
    || definition.taskKind.includes("IMPOSSIBLE")
  ) {
    return "Possible means it works in at least one correct Venn diagram. Definite means it works in every correct Venn diagram.";
  }
  return "A conclusion definitely follows only if it is true in every correct Venn diagram.";
}

function compactParts(rule: string, separator: string): readonly [string, string] | null {
  const index = rule.indexOf(separator);
  if (index < 0) return null;
  return [rule.slice(0, index).trim(), rule.slice(index + separator.length).trim()];
}

function simplePremisePoint(point: SylPremiseTeachingPoint): SylPremiseTeachingPoint {
  const statement = point.statement.trim();
  const compact = point.compactRule;

  if (/^Only a few\b/i.test(statement)) {
    return {
      ...point,
      naturalRule: "This gives two facts: some are in the common part, and some stay outside.",
      compactRule: point.statement.replace(/\.$/u, ""),
    };
  }
  if (/^Not all\b/i.test(statement)) {
    return {
      ...point,
      naturalRule: "At least one member of the first group stays outside the second group.",
      compactRule: point.statement.replace(/\.$/u, ""),
    };
  }

  const subset = compactParts(compact, "⊆");
  if (subset) return {
    ...point,
    naturalRule: `Put all ${subset[0]} inside ${subset[1]}.`,
    compactRule: `All ${subset[0]} are ${subset[1]}`,
  };

  const disjoint = compactParts(compact, "∩");
  if (disjoint && compact.includes("= ∅")) {
    const right = disjoint[1].replace("= ∅", "").trim();
    return {
      ...point,
      naturalRule: `Keep ${disjoint[0]} and ${right} separate.`,
      compactRule: `No ${disjoint[0]} is ${right}`,
    };
  }
  if (disjoint && compact.includes("≠ ∅")) {
    const right = disjoint[1].replace("≠ ∅", "").trim();
    return {
      ...point,
      naturalRule: `At least one member is common to ${disjoint[0]} and ${right}.`,
      compactRule: `Some ${disjoint[0]} are ${right}`,
    };
  }

  const outside = compactParts(compact, "\\");
  if (outside) {
    const right = outside[1].replace("≠ ∅", "").trim();
    return {
      ...point,
      naturalRule: `At least one ${outside[0]} stays outside ${right}.`,
      compactRule: `Some ${outside[0]} are not ${right}`,
    };
  }

  const identity = compactParts(compact, "=");
  if (identity) return {
    ...point,
    naturalRule: `${identity[0]} and ${identity[1]} are the same group.`,
    compactRule: `All ${identity[0]} are ${identity[1]}, and all ${identity[1]} are ${identity[0]}`,
  };

  return {
    ...point,
    naturalRule: point.naturalRule
      .replaceAll("the entire", "all")
      .replaceAll("must remain completely separate", "must stay separate")
      .replaceAll("At least one member is common to", "At least one member is in both"),
  };
}

function premiseReference(
  step: SylConclusionTeachingStep,
  premiseBreakdown: readonly SylPremiseTeachingPoint[],
): string {
  const numbers = step.supportingPremiseIds
    .map((id) => premiseBreakdown.findIndex((point) => point.premiseId === id))
    .filter((index) => index >= 0)
    .map((index) => index + 1);
  const unique = [...new Set(numbers)];
  if (unique.length === 0) return "the statements";
  if (unique.length === 1) return `Statement ${unique[0]}`;
  if (unique.length === 2) return `Statements ${unique[0]} and ${unique[1]}`;
  return `Statements ${unique.slice(0, -1).join(", ")} and ${unique.at(-1)}`;
}

function simpleConclusionStep(
  step: SylConclusionTeachingStep,
  premiseBreakdown: readonly SylPremiseTeachingPoint[],
): SylConclusionTeachingStep {
  const reference = premiseReference(step, premiseBreakdown);
  const plural = reference.startsWith("Statements") || reference === "the statements";
  if (step.verdict === "DEFINITELY_FOLLOWS") {
    return {
      ...step,
      verdictLabel: "Must be true",
      reasoning: plural
        ? `Use ${reference} together. They make this conclusion necessary.`
        : `${reference} makes this conclusion necessary.`,
    };
  }
  if (step.verdict === "IMPOSSIBLE") {
    return {
      ...step,
      verdictLabel: "Not possible",
      reasoning: plural
        ? `${reference} do not allow this relation. So this conclusion cannot be true.`
        : `${reference} does not allow this relation. So this conclusion cannot be true.`,
    };
  }
  return {
    ...step,
    verdictLabel: "May be true, but not definite",
    reasoning: plural
      ? `${reference} allow this relation, but they do not force it. So it is not a definite conclusion.`
      : `${reference} allows this relation, but it does not force it. So it is not a definite conclusion.`,
  };
}

function simpleShortcut(value: string): string {
  if (value.includes("complementary pair")) {
    return "Either-or is correct only when exactly one conclusion must be true.";
  }
  if (value.startsWith("Convert ‘Not all")) {
    return "Not all A are B ⇒ Some A are not B";
  }
  if (value.startsWith("Build the boundaries")) {
    return "Use All/No first. Then move the ‘Some’ member through the chain.";
  }
  return value
    .replaceAll("directly", "")
    .replaceAll("Read the direct chain", "Use the chain")
    .trim();
}

function simpleShortcutApplication(value: string): string {
  if (value.includes("Opposite-looking wording")) {
    return "Do not decide from opposite words alone. Check both conclusions.";
  }
  if (value.includes("Do not reverse directions")) {
    return "Do not reverse the arrows. Do not add an overlap unless the statements give it.";
  }
  return value
    .replaceAll("is carried into", "must also be in")
    .replaceAll("lies inside", "is inside")
    .replaceAll("which is separate from", "and is separate from")
    .replaceAll("Read the direct chain", "Use the chain")
    .replaceAll("the whole", "all")
    .replaceAll("guaranteed to be", "that is");
}

function simpleWarning(tag: string): string {
  if (tag === "ONLY_DIRECTION_REVERSED") {
    return "Do not read ‘only’ in the same direction. Reverse it once.";
  }
  if (tag === "ONLY_FEW_REDUCED_TO_SOME") {
    return "‘Only a few’ gives two facts: some are inside and some are outside.";
  }
  if (tag.startsWith("EITHER_OR")) {
    return "Do not choose ‘either-or’ only because the conclusions look opposite. Check both cases.";
  }
  if (tag === "THREE_CONCLUSION_MASK_ERROR") {
    return "Check conclusions I, II and III one by one before choosing the combination.";
  }
  return "Do not choose a conclusion only because it is possible. It must be true in every correct Venn diagram.";
}

function localizedDiagramText(
  locale: SylLocale,
  mode: SylExplanationTrace["diagramMode"],
): { title: string; caption: string } {
  if (locale === "hi-IN") {
    return {
      title: "सही विकल्प का वेन आरेख",
      caption: mode === "TRUE_FALSE_COMPARISON"
        ? "दोनों छोटे चित्र केवल सही विकल्प की जाँच करते हैं—एक में निष्कर्ष सत्य हो सकता है और दूसरे में असत्य।"
        : "यह चित्र केवल सही विकल्प से संबंधित निष्कर्ष दिखाता है।",
    };
  }
  if (locale === "pa-IN") {
    return {
      title: "ਸਹੀ ਵਿਕਲਪ ਦਾ ਵੇਨ ਚਿੱਤਰ",
      caption: mode === "TRUE_FALSE_COMPARISON"
        ? "ਦੋਵੇਂ ਛੋਟੇ ਚਿੱਤਰ ਸਿਰਫ਼ ਸਹੀ ਵਿਕਲਪ ਦੀ ਜਾਂਚ ਕਰਦੇ ਹਨ—ਇੱਕ ਵਿੱਚ ਨਤੀਜਾ ਸਹੀ ਹੋ ਸਕਦਾ ਹੈ ਅਤੇ ਦੂਜੇ ਵਿੱਚ ਗਲਤ।"
        : "ਇਹ ਚਿੱਤਰ ਸਿਰਫ਼ ਸਹੀ ਵਿਕਲਪ ਨਾਲ ਸੰਬੰਧਿਤ ਨਤੀਜੇ ਦਿਖਾਉਂਦਾ ਹੈ।",
    };
  }
  return {
    title: "Venn Diagram for the Correct Answer",
    caption: mode === "TRUE_FALSE_COMPARISON"
      ? "Both small diagrams are for the correct option. One shows it can be true; the other shows it can be false."
      : mode === "EITHER_OR_COMPARISON"
        ? "These diagrams show only the cases covered by the correct either-or option."
        : "This diagram shows only the conclusion or conclusions covered by the correct option.",
  };
}

function correctOnlyDiagramMode(
  mode: SylExplanationTrace["diagramMode"],
  definition: SylQlDefinition,
): SylExplanationTrace["diagramMode"] {
  if (
    mode === "TRUE_FALSE_COMPARISON"
    && definition.renderer === "MODAL_CLASSIFICATION"
  ) {
    return "FORCED_AND_TRUE_FALSE_COMPARISON";
  }
  return mode;
}

function replaceDiagramMode(
  svg: string,
  mode: SylExplanationTrace["diagramMode"],
): string {
  return svg.replace(/data-diagram-mode="[A-Z_]+"/u, `data-diagram-mode="${mode}"`);
}

function simplifySvgEnglish(svg: string): string {
  return svg
    .replaceAll("Basic Venn Diagram and Conclusion Check", "Venn Diagram for the Correct Answer")
    .replaceAll("Relations forced by the statements", "What the statements show")
    .replaceAll("Conclusion check", "Correct answer")
    .replaceAll("Definitely true", "Must be true")
    .replaceAll("Conflicts with statements", "Not possible")
    .replaceAll("Can be true", "Possible")
    .replaceAll("Each alternative is possible separately", "Each case is possible separately")
    .replace("<svg ", '<svg data-correct-option-only="true" ');
}

export function remodelStudentPresentation(
  base: SylExplanationTrace,
  definition: SylQlDefinition,
  selected: SelectedLogic,
  displayedPremises: readonly SurfacePremise[],
  locale: SylLocale,
  assignment: TermAssignment,
  options: readonly GeneratedSylOption[],
): SylExplanationTrace {
  const correctOption = options.find((option) => option.isCorrect);
  if (!correctOption) throw new Error("Student presentation cannot find the correct option.");

  const focus = correctOptionFocus(definition, selected, correctOption);
  const diagram = renderPedagogicalVennDiagram(
    displayedPremises,
    focus,
    selected.pairStatus,
    locale,
    assignment,
    `${definition.qlId}-${selected.analysis.scenario.scenarioId}-correct-only`,
  );
  const diagramMode = correctOnlyDiagramMode(diagram.mode, definition);
  const diagramText = localizedDiagramText(locale, diagramMode);
  const baseSvg = locale === "en-IN"
    ? simplifySvgEnglish(diagram.svg)
    : diagram.svg.replace("<svg ", '<svg data-correct-option-only="true" ');
  const svg = replaceDiagramMode(baseSvg, diagramMode);

  if (locale !== "en-IN") {
    return {
      ...base,
      diagramRole: diagram.role,
      diagramMode,
      diagramTitle: diagramText.title,
      diagramCaption: diagramText.caption,
      overlappingVennSvg: svg,
    };
  }

  const premiseBreakdown = base.tier1Concept.premiseBreakdown.map(simplePremisePoint);
  const conclusionSteps = base.tier2StepByStep.conclusionSteps.map((step) =>
    simpleConclusionStep(step, premiseBreakdown));

  return {
    ...base,
    tier1Concept: {
      heading: "📌 1. Basic Rule",
      coreRule: simpleCoreRule(definition),
      premiseBreakdown,
    },
    tier2StepByStep: {
      heading: "📝 2. Check the Conclusions",
      conclusionSteps,
      combinationSummary: base.tier2StepByStep.combinationSummary
        ? `So the correct option is: ${base.finalAnswer}`
        : null,
    },
    tier3Shortcut: {
      heading: "⚡ 3. Fast Method",
      shortcut: simpleShortcut(base.tier3Shortcut.shortcut),
      application: simpleShortcutApplication(base.tier3Shortcut.application),
    },
    tier4Trap: {
      ...base.tier4Trap,
      heading: "⚠️ 4. Common Mistake",
      studentWarning: simpleWarning(base.tier4Trap.diagnosticTag),
    },
    diagramRole: diagram.role,
    diagramMode,
    diagramTitle: diagramText.title,
    diagramCaption: diagramText.caption,
    overlappingVennSvg: svg,
  };
}
