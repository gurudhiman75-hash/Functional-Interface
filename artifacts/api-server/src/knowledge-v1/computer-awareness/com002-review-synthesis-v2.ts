import { deterministicIndex, deterministicShuffle, hashKnowledgeSeed } from "../deterministic";
import { assertKnowledgeQuestionValid } from "../question-validation";
import type { KnowledgeFact } from "../types";
import { COM002_EDITORIAL_TARGET_FACTS } from "./com002-editorial-review";
import { generateCom002ReviewQuestion } from "./com002-review-synthesis";
import type { Com002ReviewQuestion } from "./com002-review-types";

function textValue(fact: KnowledgeFact): string {
  if (fact.value.kind !== "text") throw new Error(`${fact.factId} must carry a text value`);
  return fact.value.text.en;
}

function factById(factId: string | null) {
  if (!factId) return null;
  return COM002_EDITORIAL_TARGET_FACTS.find((fact) => fact.factId === factId) ?? null;
}

function unique(items: readonly string[]) {
  return [...new Set(items)];
}

function reposition(question: Com002ReviewQuestion, wrongAnswers: string[], seed: string): Com002ReviewQuestion {
  const correctIndex = deterministicIndex(`${seed}:v2-correct-position`, 4);
  const options = [...wrongAnswers];
  options.splice(correctIndex, 0, question.canonicalAnswer);
  assertKnowledgeQuestionValid({
    stem: question.stem,
    explanation: question.explanation,
    options,
    correctIndex,
    canonicalAnswer: question.canonicalAnswer,
  });
  return { ...question, options, correctIndex };
}

function redistributeAnswerPosition(question: Com002ReviewQuestion, seed: string): Com002ReviewQuestion {
  const wrongAnswers = question.options.filter((_, index) => index !== question.correctIndex);
  const hash = hashKnowledgeSeed(`${seed}:ql009-final-position`);
  const correctIndex = ((hash >>> 24) ^ (hash >>> 16) ^ (hash >>> 8) ^ hash) & 3;
  const options = [...wrongAnswers];
  options.splice(correctIndex, 0, question.canonicalAnswer);
  assertKnowledgeQuestionValid({
    stem: question.stem,
    explanation: question.explanation,
    options,
    correctIndex,
    canonicalAnswer: question.canonicalAnswer,
  });
  return { ...question, options, correctIndex };
}

function pickStem(variants: readonly string[], seed: string) {
  return variants[deterministicIndex(`${seed}:v2-stem`, variants.length)]!;
}

function licensePolarity(value: string): "OPEN_SOURCE" | "PROPRIETARY" | "OTHER" {
  if (/open-source/i.test(value)) return "OPEN_SOURCE";
  if (/proprietary/i.test(value)) return "PROPRIETARY";
  return "OTHER";
}

function articleFor(value: string) {
  return /^[aeiou]/i.test(value.trim()) ? "an" : "a";
}

function patchQl002Attribute(question: Com002ReviewQuestion, seed: string): Com002ReviewQuestion {
  if (question.surfaceMode !== "ATTRIBUTE_TO_OS") return question;
  const target = factById(question.targetFactId);
  if (!target) throw new Error(`${question.questionId}: QL-002 target fact is missing`);
  const targetPolarity = licensePolarity(textValue(target));
  const licenseFacts = COM002_EDITORIAL_TARGET_FACTS.filter((fact) => fact.relation === "license_class");
  const oppositeFacts = licenseFacts.filter(
    (fact) => licensePolarity(textValue(fact)) !== targetPolarity && licensePolarity(textValue(fact)) !== "OTHER",
  );
  const oppositeEntities = unique(oppositeFacts.map((fact) => fact.entity.label.en));
  const fallback = ["Microsoft Excel", "Google Chrome", "Intel processor", "SQL language"];
  const wrongPool = unique([...oppositeEntities, ...fallback]).filter((entry) => entry !== question.canonicalAnswer);
  const wrongAnswers = deterministicShuffle(wrongPool, `${seed}:ql002-v2-wrong`).slice(0, 3);
  const usedFactEntities = new Set(wrongAnswers);
  const usedFacts = [target, ...oppositeFacts.filter((fact) => usedFactEntities.has(fact.entity.label.en))];
  const patched = {
    ...question,
    sourceFactIds: unique(usedFacts.map((fact) => fact.factId)),
    sourceIds: unique(usedFacts.map((fact) => fact.source.sourceId)),
  };
  return reposition(patched, wrongAnswers, `${seed}:ql002-attribute`);
}

function patchQl002Presentation(question: Com002ReviewQuestion, target: KnowledgeFact): Com002ReviewQuestion {
  if (!["OS_TO_LICENSE", "ATTRIBUTE_TO_OS"].includes(question.surfaceMode)) return question;
  const value = textValue(target);
  const article = articleFor(value);
  const explanation = `${target.entity.label.en} is ${article} ${value}.`;
  if (question.surfaceMode === "ATTRIBUTE_TO_OS") {
    return {
      ...question,
      stem: `Which of the following is ${article} ${value}?`,
      explanation,
    };
  }
  return { ...question, explanation };
}

function kernelExplanation(fact: KnowledgeFact) {
  if (fact.factId === "com002-kernel-core") return "The kernel is the core component of an operating system.";
  return `The kernel ${textValue(fact)}.`;
}

function describeFileItem(fact: KnowledgeFact) {
  const entity = fact.entity.label.en;
  const value = textValue(fact);
  if (entity === "File Explorer") {
    return value.startsWith("browse") ? `File Explorer is used to ${value}.` : `File Explorer ${value}.`;
  }
  if (entity === "Folder (directory)") return `A folder (directory) is a ${value}.`;
  if (entity === "File path") return `A file path ${value}.`;
  if (entity === "File") return `A file is a ${value}.`;
  return `${entity} is correctly described as: ${value}.`;
}

function describeExtensionConcept(fact: KnowledgeFact) {
  const entity = fact.entity.label.en;
  const value = textValue(fact);
  if (entity === "File extension") return `A file extension is the ${value}.`;
  return `${entity} ${value}.`;
}

function patchQl005Stem(question: Com002ReviewQuestion, target: KnowledgeFact, seed: string): Com002ReviewQuestion {
  const value = textValue(target);
  const entity = target.entity.label.en;
  if (question.surfaceMode === "PROPERTY_TO_INTERFACE") {
    return {
      ...question,
      stem: pickStem([
        `Which user-interface type is described by the following property: it ${value}?`,
        `An interface that ${value} is best classified as:`,
        `Identify the interface type that ${value}.`,
      ], `${seed}:ql005-property-to-interface`),
    };
  }
  return {
    ...question,
    stem: pickStem([
      `Which statement correctly describes ${entity}?`,
      `Which property is associated with ${entity}?`,
      `${entity} is best described by which of the following?`,
    ], `${seed}:ql005-interface-to-property`),
  };
}

function functionOptionPhrase(value: string) {
  const replacements: readonly [RegExp, string][] = [
    [/^provides\b/i, "provide"],
    [/^shows\b/i, "show"],
    [/^helps\b/i, "help"],
    [/^manages\b/i, "manage"],
    [/^accepts\b/i, "accept"],
    [/^uses\b/i, "use"],
    [/^allows\b/i, "allow"],
    [/^displays\b/i, "display"],
    [/^opens\b/i, "open"],
  ];
  for (const [pattern, replacement] of replacements) {
    if (pattern.test(value)) return value.replace(pattern, replacement);
  }
  return value;
}

function patchQl007(question: Com002ReviewQuestion, target: KnowledgeFact): Com002ReviewQuestion {
  const value = textValue(target);
  const explanation = `${target.entity.label.en} ${value}.`;
  if (question.surfaceMode === "FUNCTION_TO_COMPONENT") {
    const stem = target.factId === "com002-notification-area-function"
      ? "Which part of the Windows taskbar displays system-status icons and notification-related features?"
      : `Which Windows component or settings area is used to ${functionOptionPhrase(value)}?`;
    return { ...question, stem, explanation };
  }
  if (question.surfaceMode === "COMPONENT_TO_FUNCTION") {
    const canonicalAnswer = functionOptionPhrase(value);
    const options = question.options.map((option, index) =>
      index === question.correctIndex ? canonicalAnswer : functionOptionPhrase(option),
    );
    return {
      ...question,
      canonicalAnswer,
      options,
      explanation,
    };
  }
  return { ...question, explanation };
}

function canonicalFileType(value: string) {
  const normalized = value.normalize("NFKC").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (normalized.includes("jpeg")) return "jpeg-image";
  return normalized;
}

function extensionMappings() {
  return COM002_EDITORIAL_TARGET_FACTS.filter((fact) => fact.relation === "extension_file_type");
}

function representativeWrongExtensionFacts(target: KnowledgeFact, seed: string) {
  const targetType = canonicalFileType(textValue(target));
  const groups = new Map<string, KnowledgeFact[]>();
  for (const fact of extensionMappings()) {
    const typeKey = canonicalFileType(textValue(fact));
    if (typeKey === targetType) continue;
    const bucket = groups.get(typeKey) ?? [];
    bucket.push(fact);
    groups.set(typeKey, bucket);
  }
  return deterministicShuffle(
    [...groups.entries()].map(([typeKey, facts]) =>
      deterministicShuffle(facts, `${seed}:alias-representative:${typeKey}`)[0]!,
    ),
    `${seed}:wrong-extension-types`,
  ).slice(0, 3);
}

function patchQl009AliasSafety(question: Com002ReviewQuestion, target: KnowledgeFact, seed: string): Com002ReviewQuestion {
  if (question.surfaceMode === "TYPE_TO_EXTENSION") {
    const sameType = extensionMappings().filter(
      (fact) => canonicalFileType(textValue(fact)) === canonicalFileType(textValue(target)),
    );
    let effectiveTarget = target;
    if (sameType.length > 1) {
      const uniqueTargets = extensionMappings().filter((fact) => {
        const key = canonicalFileType(textValue(fact));
        return extensionMappings().filter((candidate) => canonicalFileType(textValue(candidate)) === key).length === 1;
      });
      effectiveTarget = deterministicShuffle(uniqueTargets, `${seed}:unique-reverse-target`)[0]!;
    }
    const wrongFacts = representativeWrongExtensionFacts(effectiveTarget, `${seed}:type-to-extension`);
    const canonicalAnswer = effectiveTarget.entity.label.en;
    const stem = pickStem([
      `Which file extension is associated with a ${textValue(effectiveTarget)}?`,
      `A ${textValue(effectiveTarget)} commonly uses which file extension?`,
      `Identify the extension associated with a ${textValue(effectiveTarget)}.`,
    ], `${seed}:ql009-type-to-extension-stem`);
    const usedFacts = [effectiveTarget, ...wrongFacts];
    const patched: Com002ReviewQuestion = {
      ...question,
      targetFactId: effectiveTarget.factId,
      stem,
      canonicalAnswer,
      explanation: `${canonicalAnswer} is associated with a ${textValue(effectiveTarget)}.`,
      sourceFactIds: usedFacts.map((fact) => fact.factId),
      sourceIds: unique(usedFacts.map((fact) => fact.source.sourceId)),
    };
    return reposition(patched, wrongFacts.map((fact) => fact.entity.label.en), `${seed}:ql009-type-to-extension`);
  }

  if (question.surfaceMode === "MATCHED_PAIR") {
    const wrongFacts = representativeWrongExtensionFacts(target, `${seed}:matched-pair`);
    const canonicalAnswer = `${target.entity.label.en} — ${textValue(target)}`;
    const wrongAnswers = wrongFacts.map((fact) => `${fact.entity.label.en} — ${textValue(target)}`);
    const usedFacts = [target, ...wrongFacts];
    const patched: Com002ReviewQuestion = {
      ...question,
      canonicalAnswer,
      stem: pickStem([
        "Which file extension and file-type pair is correctly matched?",
        "Identify the correctly matched file extension and file type.",
        "Which option correctly pairs a file extension with its file type?",
      ], `${seed}:ql009-matched-pair-stem`),
      explanation: `${target.entity.label.en} is associated with a ${textValue(target)}, so ${canonicalAnswer} is the correctly matched pair.`,
      sourceFactIds: usedFacts.map((fact) => fact.factId),
      sourceIds: unique(usedFacts.map((fact) => fact.source.sourceId)),
    };
    return reposition(patched, wrongAnswers, `${seed}:ql009-matched-pair`);
  }

  return question;
}

function patchQl010Delete(question: Com002ReviewQuestion, target: KnowledgeFact): Com002ReviewQuestion {
  if (target.factId !== "com002-file-operation-delete") return question;
  if (question.surfaceMode === "EFFECT_TO_ACTION") {
    return {
      ...question,
      stem: "Which file/folder operation is used to delete a selected item?",
      explanation: "Delete removes the selected file or folder rather than relocating it to another folder.",
    };
  }
  if (question.surfaceMode === "ACTION_TO_EFFECT") {
    const canonicalAnswer = "deletes the selected file or folder";
    const options = question.options.map((option, index) => index === question.correctIndex ? canonicalAnswer : option);
    return {
      ...question,
      canonicalAnswer,
      options,
      explanation: "The Delete operation deletes the selected file or folder; it is not the same as moving the item to a different location.",
    };
  }
  return question;
}

export function generateCom002ReviewQuestionV2(input: { qlId: string; seed: string }): Com002ReviewQuestion {
  let question = generateCom002ReviewQuestion(input);
  let target = factById(question.targetFactId);

  if (input.qlId === "COM-002-QL-001" && question.surfaceMode === "FUNCTION_TO_ENTITY") {
    question = {
      ...question,
      stem: question.stem.replace(
        /manages computer hardware and applications by allocating system resources/g,
        "managing computer hardware and applications by allocating system resources",
      ),
    };
  }

  if (input.qlId === "COM-002-QL-002") {
    question = patchQl002Attribute(question, input.seed);
    target = factById(question.targetFactId);
    if (target) question = patchQl002Presentation(question, target);
  }

  if (input.qlId === "COM-002-QL-004" && target) {
    if (target.factId === "com002-kernel-core" && question.surfaceMode === "ROLE_TO_COMPONENT") {
      question = { ...question, stem: "Which component forms the core of an operating system?" };
    }
    question = { ...question, explanation: kernelExplanation(target) };
  }

  if (input.qlId === "COM-002-QL-005" && target) {
    question = patchQl005Stem(question, target, input.seed);
  }

  if (input.qlId === "COM-002-QL-007" && target) {
    question = patchQl007(question, target);
  }

  if (input.qlId === "COM-002-QL-008" && target) {
    question = { ...question, explanation: describeFileItem(target) };
  }

  if (input.qlId === "COM-002-QL-009" && target) {
    if (question.surfaceMode === "EXTENSION_CONCEPT") {
      question = { ...question, explanation: describeExtensionConcept(target) };
    }
    question = patchQl009AliasSafety(question, target, input.seed);
    question = redistributeAnswerPosition(question, input.seed);
  }

  if (input.qlId === "COM-002-QL-010" && target) {
    question = patchQl010Delete(question, target);
  }

  assertKnowledgeQuestionValid({
    stem: question.stem,
    explanation: question.explanation,
    options: question.options,
    correctIndex: question.correctIndex,
    canonicalAnswer: question.canonicalAnswer,
  });
  return { ...question, questionId: `${question.questionId}-V2` };
}
