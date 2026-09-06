import { deterministicIndex, deterministicPick, deterministicShuffle } from "../deterministic";
import { verifyKnowledgeComposition, type KnowledgeCombinationOption, type KnowledgeStatementClaim } from "../composition-verifier";
import { assertKnowledgeQuestionValid } from "../question-validation";
import type { KnowledgeFact, KnowledgeFactValue } from "../types";
import {
  COM002_EDITORIALLY_APPROVED_FACTS,
  COM002_EDITORIAL_SUPPORT_FACTS,
  COM002_EDITORIAL_TARGET_FACTS,
} from "./com002-editorial-review";
import type { Com002ReviewQuestion } from "./com002-review-types";

const QL_IDS = Array.from({ length: 13 }, (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`);

function textValue(fact: KnowledgeFact): string {
  if (fact.value.kind !== "text") throw new Error(`${fact.factId} must carry a text value`);
  return fact.value.text.en;
}

function entityLabel(fact: KnowledgeFact): string {
  return fact.entity.label.en;
}

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function targetFacts(predicate: (fact: KnowledgeFact) => boolean): KnowledgeFact[] {
  return COM002_EDITORIAL_TARGET_FACTS.filter(predicate);
}

function approvedFacts(predicate: (fact: KnowledgeFact) => boolean): KnowledgeFact[] {
  return COM002_EDITORIALLY_APPROVED_FACTS.filter(predicate);
}

function supportFacts(predicate: (fact: KnowledgeFact) => boolean): KnowledgeFact[] {
  return COM002_EDITORIAL_SUPPORT_FACTS.filter(predicate);
}

function pickWrongStrings(pool: readonly string[], canonicalAnswer: string, seed: string, count = 3): string[] {
  const candidates = unique(pool.map((entry) => entry.trim()).filter((entry) => entry && entry !== canonicalAnswer));
  if (candidates.length < count) {
    throw new Error(`COM-002 distractor pool has ${candidates.length}; requires ${count} for ${canonicalAnswer}`);
  }
  return deterministicShuffle(candidates, seed).slice(0, count);
}

function positionOptions(canonicalAnswer: string, wrongAnswers: readonly string[], seed: string) {
  if (wrongAnswers.length !== 3) throw new Error("COM-002 review questions require exactly three distractors");
  const correctIndex = deterministicIndex(`${seed}:correct-position`, 4);
  const options = [...wrongAnswers];
  options.splice(correctIndex, 0, canonicalAnswer);
  return { options, correctIndex };
}

function finalize(input: {
  qlId: string;
  surfaceMode: string;
  targetFactId: string | null;
  seed: string;
  stem: string;
  canonicalAnswer: string;
  wrongAnswers: string[];
  explanation: string;
  facts: readonly KnowledgeFact[];
  solverAuthority?: Com002ReviewQuestion["solverAuthority"];
}): Com002ReviewQuestion {
  const { options, correctIndex } = positionOptions(input.canonicalAnswer, input.wrongAnswers, `${input.seed}:${input.qlId}:${input.surfaceMode}`);
  assertKnowledgeQuestionValid({
    stem: input.stem,
    explanation: input.explanation,
    options,
    correctIndex,
    canonicalAnswer: input.canonicalAnswer,
  });
  const cpId = Number(input.qlId.slice(-3)) <= 7 ? "COM-002-CP-001" : "COM-002-CP-002";
  return {
    questionId: `COM002-REVIEW-${input.qlId}-${input.seed}`,
    qlId: input.qlId,
    cpId,
    surfaceMode: input.surfaceMode,
    targetFactId: input.targetFactId,
    stem: input.stem,
    options,
    correctIndex,
    canonicalAnswer: input.canonicalAnswer,
    explanation: input.explanation,
    sourceIds: unique(input.facts.map((fact) => fact.source.sourceId)),
    sourceFactIds: unique(input.facts.map((fact) => fact.factId)),
    solverAuthority: input.solverAuthority ?? "CANONICAL_FACT_RELATION",
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

function ql001(seed: string): Com002ReviewQuestion {
  const qlId = "COM-002-QL-001";
  const pool = targetFacts((fact) => ["has_primary_role", "manages_resource"].includes(fact.relation));
  const target = deterministicPick(pool, `${seed}:target`);
  const mode = deterministicPick(["FUNCTION_TO_ENTITY", "ENTITY_TO_FUNCTION"] as const, `${seed}:mode`);
  if (mode === "FUNCTION_TO_ENTITY") {
    const functionText = target.relation === "manages_resource"
      ? `managing ${textValue(target)}`
      : textValue(target);
    return finalize({
      qlId, surfaceMode: mode, targetFactId: target.factId, seed,
      stem: deterministicPick([
        `Which type of system software is responsible for ${functionText}?`,
        `Which software performs the following core system function: ${functionText}?`,
        `The function “${functionText}” is primarily associated with which software?`,
      ], `${seed}:stem`),
      canonicalAnswer: "Operating system",
      wrongAnswers: deterministicShuffle(["Word processor", "Web browser", "Presentation software", "Spreadsheet software"], `${seed}:wrong`).slice(0, 3),
      explanation: `An operating system ${target.relation === "manages_resource" ? `manages ${textValue(target)}` : textValue(target)}. Therefore, Operating system is the correct answer.`,
      facts: [target],
    });
  }
  const canonicalAnswer = target.relation === "manages_resource"
    ? `Managing ${textValue(target)}`
    : "Managing hardware and applications by allocating system resources";
  return finalize({
    qlId, surfaceMode: mode, targetFactId: target.factId, seed,
    stem: deterministicPick([
      "Which of the following is a core function of an operating system?",
      "Which task is normally performed by the operating system?",
      "Select the activity that belongs to operating-system resource management.",
    ], `${seed}:stem`),
    canonicalAnswer,
    wrongAnswers: deterministicShuffle(["Creating presentation slides", "Editing a photograph", "Writing a spreadsheet formula", "Composing an email message"], `${seed}:wrong`).slice(0, 3),
    explanation: `${canonicalAnswer} is an operating-system function. The other options are application-level user tasks rather than core OS resource-management functions.`,
    facts: [target],
  });
}

const NON_OS_OPTIONS = ["Microsoft Excel", "Google Chrome", "Intel processor", "SQL language", "Adobe Photoshop", "Microsoft Word"];

function ql002(seed: string): Com002ReviewQuestion {
  const qlId = "COM-002-QL-002";
  const identity = targetFacts((fact) => fact.relation === "software_classification");
  const licenses = targetFacts((fact) => fact.relation === "license_class");
  const mode = deterministicPick(["OS_VS_NON_OS", "OS_TO_LICENSE", "ATTRIBUTE_TO_OS"] as const, `${seed}:mode`);
  if (mode === "OS_VS_NON_OS") {
    const target = deterministicPick(identity, `${seed}:identity`);
    return finalize({
      qlId, surfaceMode: mode, targetFactId: target.factId, seed,
      stem: deterministicPick(["Which of the following is an operating system?", "Identify the operating system from the options.", "Which option belongs to the operating-system category?"], `${seed}:stem`),
      canonicalAnswer: entityLabel(target),
      wrongAnswers: deterministicShuffle(NON_OS_OPTIONS, `${seed}:wrong`).slice(0, 3),
      explanation: `${entityLabel(target)} is classified as ${textValue(target)}. The other options are not operating systems.`,
      facts: [target],
    });
  }
  if (mode === "OS_TO_LICENSE") {
    const target = deterministicPick(licenses, `${seed}:license`);
    const value = textValue(target);
    const wrong = value.includes("mobile")
      ? [value.includes("open-source") ? "proprietary mobile operating system" : "open-source mobile operating system", "mobile application", "device driver"]
      : [value.includes("open-source") ? "proprietary operating system" : "open-source operating system", "application software", "device driver"];
    return finalize({
      qlId, surfaceMode: mode, targetFactId: target.factId, seed,
      stem: `${entityLabel(target)} is best classified as:`,
      canonicalAnswer: value,
      wrongAnswers: wrong,
      explanation: `${entityLabel(target)} is classified here as ${value}.`,
      facts: [target],
    });
  }
  const target = deterministicPick(licenses, `${seed}:attribute`);
  const targetValue = textValue(target);
  const oppositeFacts = licenses.filter((fact) => textValue(fact) !== targetValue && entityLabel(fact) !== entityLabel(target));
  const wrongEntities = unique(oppositeFacts.map(entityLabel));
  while (wrongEntities.length < 3) {
    const fallback = NON_OS_OPTIONS[wrongEntities.length]!;
    if (!wrongEntities.includes(fallback)) wrongEntities.push(fallback);
  }
  return finalize({
    qlId, surfaceMode: mode, targetFactId: target.factId, seed,
    stem: `Which of the following is classified as ${targetValue}?`,
    canonicalAnswer: entityLabel(target),
    wrongAnswers: deterministicShuffle(wrongEntities, `${seed}:wrong`).slice(0, 3),
    explanation: `${entityLabel(target)} is classified as ${targetValue}.`,
    facts: [target, ...oppositeFacts],
  });
}

function ql003(seed: string): Com002ReviewQuestion {
  const qlId = "COM-002-QL-003";
  const pool = targetFacts((fact) => fact.relation === "os_type_property");
  const target = deterministicPick(pool, `${seed}:target`);
  const mode = deterministicPick(["PROPERTY_TO_TYPE", "TYPE_TO_PROPERTY"] as const, `${seed}:mode`);
  const otherFacts = pool.filter((fact) => fact.entityId !== target.entityId);
  if (mode === "PROPERTY_TO_TYPE") {
    return finalize({
      qlId, surfaceMode: mode, targetFactId: target.factId, seed,
      stem: deterministicPick([
        `Which type of operating system ${textValue(target)}?`,
        `Identify the OS type described as one that ${textValue(target)}.`,
        `The property “${textValue(target)}” best describes which operating-system type?`,
      ], `${seed}:stem`),
      canonicalAnswer: entityLabel(target),
      wrongAnswers: pickWrongStrings(otherFacts.map(entityLabel), entityLabel(target), `${seed}:wrong`),
      explanation: `${entityLabel(target)} ${textValue(target)}. Therefore, it matches the property in the question.`,
      facts: [target, ...otherFacts],
    });
  }
  return finalize({
    qlId, surfaceMode: mode, targetFactId: target.factId, seed,
    stem: `Which statement best describes a ${entityLabel(target)}?`,
    canonicalAnswer: textValue(target),
    wrongAnswers: pickWrongStrings(otherFacts.map(textValue), textValue(target), `${seed}:wrong`),
    explanation: `A ${entityLabel(target)} ${textValue(target)}.`,
    facts: [target, ...otherFacts],
  });
}

function ql004(seed: string): Com002ReviewQuestion {
  const qlId = "COM-002-QL-004";
  const targets = targetFacts((fact) => fact.relation === "component_role" && entityLabel(fact) === "Kernel");
  const support = supportFacts((fact) => fact.relation === "component_role");
  const target = deterministicPick(targets, `${seed}:target`);
  const mode = deterministicPick(["ROLE_TO_COMPONENT", "COMPONENT_TO_ROLE", "CORE_COMPONENT"] as const, `${seed}:mode`);
  if (mode === "CORE_COMPONENT") {
    return finalize({
      qlId, surfaceMode: mode, targetFactId: target.factId, seed,
      stem: deterministicPick(["Which component forms the core of an operating system?", "The central core component of an operating system is called:", "Which of the following is the core OS component?"], `${seed}:stem`),
      canonicalAnswer: "Kernel",
      wrongAnswers: pickWrongStrings(support.map(entityLabel), "Kernel", `${seed}:wrong`),
      explanation: "The kernel is the core component of an operating system.",
      facts: [target, ...support],
    });
  }
  if (mode === "ROLE_TO_COMPONENT") {
    return finalize({
      qlId, surfaceMode: mode, targetFactId: target.factId, seed,
      stem: `Which operating-system component ${textValue(target)}?`,
      canonicalAnswer: "Kernel",
      wrongAnswers: pickWrongStrings(support.map(entityLabel), "Kernel", `${seed}:wrong`),
      explanation: `The kernel ${textValue(target)}.`,
      facts: [target, ...support],
    });
  }
  return finalize({
    qlId, surfaceMode: mode, targetFactId: target.factId, seed,
    stem: "Which statement correctly describes the kernel?",
    canonicalAnswer: textValue(target),
    wrongAnswers: pickWrongStrings(support.map(textValue), textValue(target), `${seed}:wrong`),
    explanation: `The kernel ${textValue(target)}.`,
    facts: [target, ...support],
  });
}

function ql005(seed: string): Com002ReviewQuestion {
  const qlId = "COM-002-QL-005";
  const pool = targetFacts((fact) => fact.relation === "interface_property");
  const target = deterministicPick(pool, `${seed}:target`);
  const other = pool.find((fact) => fact.factId !== target.factId)!;
  const mode = deterministicPick(["PROPERTY_TO_INTERFACE", "INTERFACE_TO_PROPERTY"] as const, `${seed}:mode`);
  if (mode === "PROPERTY_TO_INTERFACE") {
    const options = ["Graphical user interface (GUI)", "Command-line interface (CLI)", "Application programming interface (API)", "Basic input/output system (BIOS)"];
    return finalize({
      qlId, surfaceMode: mode, targetFactId: target.factId, seed,
      stem: `Which interface ${textValue(target)}?`,
      canonicalAnswer: entityLabel(target),
      wrongAnswers: pickWrongStrings(options, entityLabel(target), `${seed}:wrong`),
      explanation: `${entityLabel(target)} ${textValue(target)}.`,
      facts: [target],
    });
  }
  return finalize({
    qlId, surfaceMode: mode, targetFactId: target.factId, seed,
    stem: `Which statement correctly describes ${entityLabel(target)}?`,
    canonicalAnswer: textValue(target),
    wrongAnswers: [textValue(other), "manages files and folders in Windows", "loads the operating system during startup"],
    explanation: `${entityLabel(target)} ${textValue(target)}.`,
    facts: [target, other],
  });
}

function ql006(seed: string): Com002ReviewQuestion {
  const qlId = "COM-002-QL-006";
  const targets = targetFacts((fact) => fact.relation === "system_start_stop_meaning");
  const all = approvedFacts((fact) => fact.relation === "system_start_stop_meaning");
  const target = deterministicPick(targets, `${seed}:target`);
  const mode = deterministicPick(["PROCESS_TO_TERM", "TERM_TO_PROCESS"] as const, `${seed}:mode`);
  const others = all.filter((fact) => fact.entityId !== target.entityId);
  if (mode === "PROCESS_TO_TERM") {
    return finalize({
      qlId, surfaceMode: mode, targetFactId: target.factId, seed,
      stem: `Which system action ${textValue(target)}?`,
      canonicalAnswer: entityLabel(target),
      wrongAnswers: pickWrongStrings(others.map(entityLabel), entityLabel(target), `${seed}:wrong`),
      explanation: `${entityLabel(target)} ${textValue(target)}.`,
      facts: [target, ...others],
    });
  }
  return finalize({
    qlId, surfaceMode: mode, targetFactId: target.factId, seed,
    stem: `What does “${entityLabel(target)}” mean in this Windows/basic-computer context?`,
    canonicalAnswer: textValue(target),
    wrongAnswers: pickWrongStrings(others.map(textValue), textValue(target), `${seed}:wrong`),
    explanation: `${entityLabel(target)} ${textValue(target)}.`,
    facts: [target, ...others],
  });
}

function ql007(seed: string): Com002ReviewQuestion {
  const qlId = "COM-002-QL-007";
  const pool = targetFacts((fact) => ["ui_component_function", "settings_task"].includes(fact.relation));
  const target = deterministicPick(pool, `${seed}:target`);
  const others = pool.filter((fact) => fact.entityId !== target.entityId);
  const mode = deterministicPick(["FUNCTION_TO_COMPONENT", "COMPONENT_TO_FUNCTION"] as const, `${seed}:mode`);
  if (mode === "FUNCTION_TO_COMPONENT") {
    return finalize({
      qlId, surfaceMode: mode, targetFactId: target.factId, seed,
      stem: `Which Windows component or settings area is used to ${textValue(target)}?`,
      canonicalAnswer: entityLabel(target),
      wrongAnswers: pickWrongStrings(others.map(entityLabel), entityLabel(target), `${seed}:wrong`),
      explanation: `${entityLabel(target)} is used to ${textValue(target)}.`,
      facts: [target, ...others],
    });
  }
  return finalize({
    qlId, surfaceMode: mode, targetFactId: target.factId, seed,
    stem: `Which function best matches ${entityLabel(target)}?`,
    canonicalAnswer: textValue(target),
    wrongAnswers: pickWrongStrings(others.map(textValue), textValue(target), `${seed}:wrong`),
    explanation: `${entityLabel(target)} is used to ${textValue(target)}.`,
    facts: [target, ...others],
  });
}

function ql008(seed: string): Com002ReviewQuestion {
  const qlId = "COM-002-QL-008";
  const pool = targetFacts((fact) => ["file-explorer-purpose", "file-explorer-view-properties", "file-folder-path-concepts"].includes(fact.contextGroupId));
  const target = deterministicPick(pool, `${seed}:target`);
  const mode = deterministicPick(["DEFINITION_TO_ITEM", "ITEM_TO_DEFINITION"] as const, `${seed}:mode`);
  const otherEntities = pool.filter((fact) => fact.entityId !== target.entityId);
  if (mode === "DEFINITION_TO_ITEM") {
    return finalize({
      qlId, surfaceMode: mode, targetFactId: target.factId, seed,
      stem: `Which file-management item is described as follows: ${textValue(target)}?`,
      canonicalAnswer: entityLabel(target),
      wrongAnswers: pickWrongStrings(otherEntities.map(entityLabel), entityLabel(target), `${seed}:wrong`),
      explanation: `${entityLabel(target)} ${textValue(target)}.`,
      facts: [target, ...otherEntities],
    });
  }
  const wrongValues = otherEntities.map(textValue);
  return finalize({
    qlId, surfaceMode: mode, targetFactId: target.factId, seed,
    stem: `Which statement correctly describes ${entityLabel(target)}?`,
    canonicalAnswer: textValue(target),
    wrongAnswers: pickWrongStrings(wrongValues, textValue(target), `${seed}:wrong`),
    explanation: `${entityLabel(target)} ${textValue(target)}.`,
    facts: [target, ...otherEntities],
  });
}

function ql009(seed: string): Com002ReviewQuestion {
  const qlId = "COM-002-QL-009";
  const mappings = targetFacts((fact) => fact.relation === "extension_file_type");
  const concepts = targetFacts((fact) => ["file_concept_definition", "extension_behavior"].includes(fact.relation) && fact.contextGroupId === "file-extension-concept");
  const mode = deterministicPick(["EXTENSION_TO_TYPE", "TYPE_TO_EXTENSION", "MATCHED_PAIR", "EXTENSION_CONCEPT"] as const, `${seed}:mode`);
  if (mode === "EXTENSION_CONCEPT") {
    const target = deterministicPick(concepts, `${seed}:concept`);
    const wrong = target.relation === "extension_behavior"
      ? ["automatically converts the file into the new format", "deletes the original file contents", "compresses the file into an archive"]
      : ["the folder in which the file is stored", "the password used to open the file", "the amount of free disk space"];
    return finalize({
      qlId, surfaceMode: mode, targetFactId: target.factId, seed,
      stem: target.relation === "extension_behavior" ? "Which statement about changing a file-name extension is correct?" : "Which statement correctly describes a file extension?",
      canonicalAnswer: textValue(target),
      wrongAnswers: wrong,
      explanation: `${entityLabel(target)} ${textValue(target)}.`,
      facts: [target],
    });
  }
  if (mode === "TYPE_TO_EXTENSION") {
    const valueCounts = new Map<string, number>();
    for (const fact of mappings) valueCounts.set(textValue(fact), (valueCounts.get(textValue(fact)) ?? 0) + 1);
    const uniqueMappings = mappings.filter((fact) => valueCounts.get(textValue(fact)) === 1);
    const target = deterministicPick(uniqueMappings, `${seed}:unique-target`);
    const others = mappings.filter((fact) => textValue(fact) !== textValue(target));
    return finalize({
      qlId, surfaceMode: mode, targetFactId: target.factId, seed,
      stem: `Which file extension is associated with a ${textValue(target)}?`,
      canonicalAnswer: entityLabel(target),
      wrongAnswers: pickWrongStrings(others.map(entityLabel), entityLabel(target), `${seed}:wrong`),
      explanation: `${entityLabel(target)} is associated with a ${textValue(target)}.`,
      facts: [target, ...others],
    });
  }
  const target = deterministicPick(mappings, `${seed}:mapping-target`);
  const others = mappings.filter((fact) => fact.factId !== target.factId && textValue(fact) !== textValue(target));
  if (mode === "EXTENSION_TO_TYPE") {
    return finalize({
      qlId, surfaceMode: mode, targetFactId: target.factId, seed,
      stem: `What type of file is commonly associated with the ${entityLabel(target)} extension?`,
      canonicalAnswer: textValue(target),
      wrongAnswers: pickWrongStrings(others.map(textValue), textValue(target), `${seed}:wrong`),
      explanation: `${entityLabel(target)} is commonly associated with a ${textValue(target)}.`,
      facts: [target, ...others],
    });
  }
  const canonicalAnswer = `${entityLabel(target)} — ${textValue(target)}`;
  const wrongFacts = deterministicShuffle(others, `${seed}:wrong-facts`).slice(0, 3);
  const wrongAnswers = wrongFacts.map((fact) => `${entityLabel(fact)} — ${textValue(target)}`);
  return finalize({
    qlId, surfaceMode: mode, targetFactId: target.factId, seed,
    stem: "Which file extension and file-type pair is correctly matched?",
    canonicalAnswer,
    wrongAnswers,
    explanation: `${entityLabel(target)} is associated with a ${textValue(target)}, so ${canonicalAnswer} is the correctly matched pair.`,
    facts: [target, ...wrongFacts],
  });
}

function ql010(seed: string): Com002ReviewQuestion {
  const qlId = "COM-002-QL-010";
  const pool = targetFacts((fact) => fact.relation === "file_operation_effect");
  const target = deterministicPick(pool, `${seed}:target`);
  const others = pool.filter((fact) => fact.factId !== target.factId);
  const mode = deterministicPick(["EFFECT_TO_ACTION", "ACTION_TO_EFFECT"] as const, `${seed}:mode`);
  if (mode === "EFFECT_TO_ACTION") {
    return finalize({
      qlId, surfaceMode: mode, targetFactId: target.factId, seed,
      stem: `Which file/folder operation ${textValue(target)}?`,
      canonicalAnswer: entityLabel(target),
      wrongAnswers: pickWrongStrings(others.map(entityLabel), entityLabel(target), `${seed}:wrong`),
      explanation: `${entityLabel(target)} ${textValue(target)}.`,
      facts: [target, ...others],
    });
  }
  return finalize({
    qlId, surfaceMode: mode, targetFactId: target.factId, seed,
    stem: `What is the effect of the ${entityLabel(target)} operation?`,
    canonicalAnswer: textValue(target),
    wrongAnswers: pickWrongStrings(others.map(textValue), textValue(target), `${seed}:wrong`),
    explanation: `${entityLabel(target)} ${textValue(target)}.`,
    facts: [target, ...others],
  });
}

function ql011(seed: string): Com002ReviewQuestion {
  const qlId = "COM-002-QL-011";
  const pool = targetFacts((fact) => ["delete_behavior", "delete_recovery_action"].includes(fact.relation));
  const target = deterministicPick(pool, `${seed}:target`);
  if (target.factId === "com002-local-delete-recycle-bin") {
    return finalize({
      qlId, surfaceMode: "DELETE_DESTINATION", targetFactId: target.factId, seed,
      stem: deterministicPick(["In ordinary local Windows use, where does a normally deleted file usually go?", "A file deleted from an ordinary local Windows hard-disk location is normally moved to:", "Which Windows location temporarily holds an ordinarily deleted local file?"], `${seed}:stem`),
      canonicalAnswer: "Recycle Bin",
      wrongAnswers: ["Clipboard", "Taskbar", "Start menu"],
      explanation: "For ordinary local Windows deletion, the deleted item is moved to the Recycle Bin, from where it can generally be restored while it remains there.",
      facts: [target],
    });
  }
  if (target.factId === "com002-shift-delete-permanent") {
    return finalize({
      qlId, surfaceMode: "PERMANENT_DELETE_BEHAVIOR", targetFactId: target.factId, seed,
      stem: "What does Shift+Delete do to a selected item in Windows?",
      canonicalAnswer: textValue(target),
      wrongAnswers: ["moves the selected item to the Recycle Bin", "renames the selected item", "opens the selected item's properties"],
      explanation: `Shift+Delete ${textValue(target)}.`,
      facts: [target],
    });
  }
  return finalize({
    qlId, surfaceMode: "RECOVERY_ACTION", targetFactId: target.factId, seed,
    stem: "What is the purpose of the Restore action for an item in the Windows Recycle Bin?",
    canonicalAnswer: textValue(target),
    wrongAnswers: ["permanently erases the item", "renames the item", "compresses the item into an archive"],
    explanation: `Restore from Recycle Bin ${textValue(target)}.`,
    facts: [target],
  });
}

function ql012(seed: string): Com002ReviewQuestion {
  const qlId = "COM-002-QL-012";
  const pool = targetFacts((fact) => fact.relation === "shortcut_action");
  const target = deterministicPick(pool, `${seed}:target`);
  const others = pool.filter((fact) => fact.factId !== target.factId);
  const mode = deterministicPick(["SHORTCUT_TO_ACTION", "ACTION_TO_SHORTCUT", "MATCHED_PAIR"] as const, `${seed}:mode`);
  if (mode === "SHORTCUT_TO_ACTION") {
    return finalize({
      qlId, surfaceMode: mode, targetFactId: target.factId, seed,
      stem: `What does ${entityLabel(target)} do in Windows/File Explorer?`,
      canonicalAnswer: textValue(target),
      wrongAnswers: pickWrongStrings(others.map(textValue), textValue(target), `${seed}:wrong`),
      explanation: `${entityLabel(target)} is used to ${textValue(target)}.`,
      facts: [target, ...others],
    });
  }
  if (mode === "ACTION_TO_SHORTCUT") {
    return finalize({
      qlId, surfaceMode: mode, targetFactId: target.factId, seed,
      stem: `Which shortcut is used to ${textValue(target)}?`,
      canonicalAnswer: entityLabel(target),
      wrongAnswers: pickWrongStrings(others.map(entityLabel), entityLabel(target), `${seed}:wrong`),
      explanation: `${entityLabel(target)} is used to ${textValue(target)}.`,
      facts: [target, ...others],
    });
  }
  const canonicalAnswer = `${entityLabel(target)} — ${textValue(target)}`;
  const wrongFacts = deterministicShuffle(others, `${seed}:wrong-pairs`).slice(0, 3);
  const wrongAnswers = wrongFacts.map((fact) => `${entityLabel(fact)} — ${textValue(target)}`);
  return finalize({
    qlId, surfaceMode: mode, targetFactId: target.factId, seed,
    stem: "Which Windows/File Explorer shortcut is correctly matched with its action?",
    canonicalAnswer,
    wrongAnswers,
    explanation: `${entityLabel(target)} is used to ${textValue(target)}, so ${canonicalAnswer} is the correctly matched pair.`,
    facts: [target, ...wrongFacts],
  });
}

function valueText(value: KnowledgeFactValue): string {
  if (value.kind !== "text") throw new Error("COM-002 QL-013 currently composes text-valued facts only");
  return value.text.en;
}

function renderStatement(fact: KnowledgeFact, claimValue: KnowledgeFactValue): string {
  const value = valueText(claimValue);
  switch (fact.relation) {
    case "software_classification":
    case "license_class":
      return `${entityLabel(fact)} is classified as ${value}.`;
    case "os_type_property":
      return `${entityLabel(fact)} ${value}.`;
    case "extension_file_type":
      return `${entityLabel(fact)} is associated with ${value}.`;
    case "shortcut_action":
      return `${entityLabel(fact)} is used to ${value}.`;
    default:
      return `${entityLabel(fact)}: ${value}.`;
  }
}

function allStatementSubsets(ids: readonly string[]): string[][] {
  const output: string[][] = [];
  for (let mask = 0; mask < 2 ** ids.length; mask += 1) {
    output.push(ids.filter((_, index) => Boolean(mask & (1 << index))));
  }
  return output;
}

function comboLabel(ids: readonly string[]): string {
  if (ids.length === 0) return "None of the statements";
  if (ids.length === 1) return `${ids[0]} only`;
  if (ids.length === 2) return `${ids[0]} and ${ids[1]} only`;
  if (ids.length === 3) return `${ids[0]}, ${ids[1]} and ${ids[2]} only`;
  return `${ids.slice(0, -1).join(", ")} and ${ids.at(-1)}`;
}

function ql013(seed: string): Com002ReviewQuestion {
  const qlId = "COM-002-QL-013";
  const groups = [
    targetFacts((fact) => fact.relation === "software_classification"),
    targetFacts((fact) => fact.relation === "os_type_property"),
    targetFacts((fact) => fact.relation === "extension_file_type"),
    targetFacts((fact) => fact.relation === "shortcut_action"),
  ];
  const selected = groups.map((group, index) => deterministicPick(group, `${seed}:statement-target:${index}`));
  const statementIds = ["I", "II", "III", "IV"];
  const truthPatterns = [
    [true, false, true, false],
    [true, true, false, true],
    [false, true, true, false],
    [true, false, false, true],
    [false, true, false, true],
  ] as const;
  const truthPattern = deterministicPick(truthPatterns, `${seed}:truth-pattern`);
  const claims: KnowledgeStatementClaim[] = [];
  const donorFacts: KnowledgeFact[] = [];

  selected.forEach((fact, index) => {
    let claimedValue = fact.value;
    if (!truthPattern[index]) {
      const group = groups[index]!;
      const donors = group.filter((candidate) => candidate.factId !== fact.factId && valueText(candidate.value) !== valueText(fact.value));
      const donor = deterministicPick(donors, `${seed}:false-donor:${index}`);
      claimedValue = donor.value;
      donorFacts.push(donor);
    }
    claims.push({ statementId: statementIds[index]!, factId: fact.factId, claimedValue });
  });

  const expectedTrueIds = statementIds.filter((_, index) => truthPattern[index]);
  const subsets = allStatementSubsets(statementIds);
  const wrongSets = deterministicShuffle(
    subsets.filter((set) => set.join("|") !== expectedTrueIds.join("|")),
    `${seed}:wrong-combos`,
  ).slice(0, 3);
  const optionSets = deterministicShuffle([expectedTrueIds, ...wrongSets], `${seed}:option-combos`);
  const combinationOptions: KnowledgeCombinationOption[] = optionSets.map((set, index) => ({
    optionId: `COMBO-${index + 1}`,
    trueStatementIds: set,
  }));
  const verification = verifyKnowledgeComposition(COM002_EDITORIALLY_APPROVED_FACTS, claims, combinationOptions);
  const options = combinationOptions.map((option) => comboLabel(option.trueStatementIds));
  const canonicalAnswer = options[verification.correctIndex]!;
  const stemLines = claims.map((claim, index) => `${statementIds[index]}. ${renderStatement(selected[index]!, claim.claimedValue)}`);
  const stem = `Consider the following statements:\n${stemLines.join("\n")}\nWhich of the above statements are correct?`;
  const explanationParts = verification.truths.map((truth, index) => {
    const fact = selected[index]!;
    return `${statementIds[index]} is ${truth.true ? "correct" : "incorrect"}. ${renderStatement(fact, fact.value)}`;
  });
  const allFacts = unique([...selected, ...donorFacts].map((fact) => fact.factId)).map((factId) => COM002_EDITORIALLY_APPROVED_FACTS.find((fact) => fact.factId === factId)!);

  assertKnowledgeQuestionValid({ stem, explanation: `${explanationParts.join(" ")} Therefore, ${canonicalAnswer} is correct.`, options, correctIndex: verification.correctIndex, canonicalAnswer });
  return {
    questionId: `COM002-REVIEW-${qlId}-${seed}`,
    qlId,
    cpId: "COM-002-CP-002",
    surfaceMode: "MULTI_STATEMENT_TRUTH_VECTOR",
    targetFactId: null,
    stem,
    options,
    correctIndex: verification.correctIndex,
    canonicalAnswer,
    explanation: `${explanationParts.join(" ")} Therefore, ${canonicalAnswer} is correct.`,
    sourceIds: unique(allFacts.map((fact) => fact.source.sourceId)),
    sourceFactIds: unique(allFacts.map((fact) => fact.factId)),
    solverAuthority: "KNOWLEDGE_COMPOSITION_VERIFIER",
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generateCom002ReviewQuestion(input: { qlId: string; seed: string }): Com002ReviewQuestion {
  if (!QL_IDS.includes(input.qlId)) throw new Error(`Unknown COM-002 QL ${input.qlId}`);
  switch (input.qlId) {
    case "COM-002-QL-001": return ql001(input.seed);
    case "COM-002-QL-002": return ql002(input.seed);
    case "COM-002-QL-003": return ql003(input.seed);
    case "COM-002-QL-004": return ql004(input.seed);
    case "COM-002-QL-005": return ql005(input.seed);
    case "COM-002-QL-006": return ql006(input.seed);
    case "COM-002-QL-007": return ql007(input.seed);
    case "COM-002-QL-008": return ql008(input.seed);
    case "COM-002-QL-009": return ql009(input.seed);
    case "COM-002-QL-010": return ql010(input.seed);
    case "COM-002-QL-011": return ql011(input.seed);
    case "COM-002-QL-012": return ql012(input.seed);
    case "COM-002-QL-013": return ql013(input.seed);
    default: throw new Error(`Unhandled COM-002 QL ${input.qlId}`);
  }
}
