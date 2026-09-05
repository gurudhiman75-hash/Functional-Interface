import { deterministicIndex, deterministicPick, deterministicShuffle } from "../deterministic";
import { assertKnowledgeQuestionValid } from "../question-validation";
import type { KnowledgeFact } from "../types";
import { COM003_CONTROLLED_DISTRACTOR_POOLS } from "./com003-controlled-distractor-pools";
import {
  COM003_EDITORIALLY_APPROVED_FACTS,
  COM003_EDITORIAL_TARGET_FACTS,
} from "./com003-editorial-fact-review";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import type { Com003ReviewQuestion } from "./com003-review-types";

function textValue(fact: KnowledgeFact): string {
  if (fact.value.kind !== "text") throw new Error(`${fact.factId} must carry a text value`);
  return fact.value.text.en;
}

function entityLabel(fact: KnowledgeFact): string {
  return fact.entity.label.en;
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

const approvedFactById = new Map(COM003_EDITORIALLY_APPROVED_FACTS.map((fact) => [fact.factId, fact]));
const qlById = new Map(COM003_PERMANENT_QLS.map((item) => [item.qlId, item]));
const poolById = new Map(COM003_CONTROLLED_DISTRACTOR_POOLS.map((pool) => [pool.poolId, pool]));

function targetFacts(taskId: string, relation?: string): KnowledgeFact[] {
  return COM003_EDITORIAL_TARGET_FACTS.filter(
    (fact) => fact.tags.includes(`provisional-task:${taskId}`) && (!relation || fact.relation === relation),
  );
}

function approvedFacts(taskId: string, relation?: string): KnowledgeFact[] {
  return COM003_EDITORIALLY_APPROVED_FACTS.filter(
    (fact) => fact.tags.includes(`provisional-task:${taskId}`) && (!relation || fact.relation === relation),
  );
}

function semanticWrong(input: {
  target: KnowledgeFact;
  facts: readonly KnowledgeFact[];
  answer: (fact: KnowledgeFact) => string;
  seed: string;
  count?: number;
}) {
  const canonical = input.answer(input.target).trim();
  const seen = new Set([canonical.toLowerCase()]);
  const candidates = deterministicShuffle(input.facts.filter((fact) => fact.factId !== input.target.factId), input.seed);
  const selected: KnowledgeFact[] = [];
  for (const fact of candidates) {
    const value = input.answer(fact).trim();
    if (!value || seen.has(value.toLowerCase())) continue;
    seen.add(value.toLowerCase());
    selected.push(fact);
    if (selected.length === (input.count ?? 3)) break;
  }
  if (selected.length !== (input.count ?? 3)) {
    throw new Error(`COM-003 semantic pool too thin for ${input.target.factId}/${canonical}`);
  }
  return {
    wrongAnswers: selected.map(input.answer),
    provenanceFacts: selected,
    extraSourceIds: [] as string[],
  };
}

function controlledWrong(poolId: string, canonicalAnswer: string, seed: string, count = 3) {
  const pool = poolById.get(poolId);
  if (!pool) throw new Error(`Unknown COM-003 controlled pool ${poolId}`);
  const candidates = deterministicShuffle(
    pool.options.filter((option) => option.value.trim().toLowerCase() !== canonicalAnswer.trim().toLowerCase()),
    seed,
  );
  const selected = candidates.slice(0, count);
  if (selected.length !== count) throw new Error(`COM-003 controlled pool ${poolId} is too thin for ${canonicalAnswer}`);
  const provenanceFacts: KnowledgeFact[] = [];
  const extraSourceIds: string[] = [];
  for (const option of selected) {
    for (const factId of option.basisFactIds ?? []) {
      const fact = approvedFactById.get(factId);
      if (!fact) throw new Error(`Controlled pool ${poolId} references unavailable approved fact ${factId}`);
      provenanceFacts.push(fact);
    }
    extraSourceIds.push(...(option.authoritySourceIds ?? []));
  }
  return {
    wrongAnswers: selected.map((option) => option.value),
    provenanceFacts,
    extraSourceIds,
  };
}

function finalize(input: {
  qlId: string;
  surfaceMode: string;
  target: KnowledgeFact;
  seed: string;
  stem: string;
  canonicalAnswer: string;
  wrongAnswers: string[];
  explanation: string;
  provenanceFacts?: readonly KnowledgeFact[];
  extraSourceIds?: readonly string[];
  controlledPoolId?: string;
}): Com003ReviewQuestion {
  const ql = qlById.get(input.qlId);
  if (!ql) throw new Error(`Unknown COM-003 QL ${input.qlId}`);
  if (!input.target.tags.includes(`provisional-task:${ql.sourceProvisionalTaskId}`)) {
    throw new Error(`${input.target.factId} does not belong to ${ql.sourceProvisionalTaskId}`);
  }
  const wrongAnswers = unique(input.wrongAnswers).filter(
    (value) => value.toLowerCase() !== input.canonicalAnswer.trim().toLowerCase(),
  );
  if (wrongAnswers.length !== 3) throw new Error(`${input.qlId} requires exactly three unique wrong answers`);
  const correctIndex = deterministicIndex(`${input.seed}:${input.qlId}:correct-position`, 4);
  const options = [...wrongAnswers];
  options.splice(correctIndex, 0, input.canonicalAnswer.trim());
  const stem = input.stem.trim();
  const explanation = input.explanation.trim();
  assertKnowledgeQuestionValid({ stem, explanation, options, correctIndex, canonicalAnswer: input.canonicalAnswer.trim() });

  const facts = [input.target, ...(input.provenanceFacts ?? [])];
  return {
    questionId: `COM003-REVIEW-${input.qlId}-${input.seed}`,
    qlId: input.qlId,
    cpId: ql.cpId as Com003ReviewQuestion["cpId"],
    surfaceMode: input.surfaceMode,
    targetFactId: input.target.factId,
    stem,
    options,
    correctIndex,
    canonicalAnswer: input.canonicalAnswer.trim(),
    explanation,
    sourceIds: unique([...facts.map((fact) => fact.source.sourceId), ...(input.extraSourceIds ?? [])]),
    sourceFactIds: unique(facts.map((fact) => fact.factId)),
    distractorStrategy: ql.distractorStrategy,
    controlledPoolId: input.controlledPoolId,
    versionScoped: ql.versionScoped,
    solverAuthority: "CANONICAL_FACT_RELATION",
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

function template(templates: readonly string[], index: number) {
  return templates[index % templates.length]!;
}

type QlGenerator = (seed: string, index: number) => Com003ReviewQuestion;

const ql001: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-001";
  const mode = index % 2 === 0 ? "APPLICATION_FROM_PURPOSE" : "SOFTWARE_CLASSIFICATION";
  if (mode === "APPLICATION_FROM_PURPOSE") {
    const target = deterministicPick(targetFacts("COM003-PT-001", "application_primary_purpose"), `${seed}:target`);
    const canonicalAnswer = entityLabel(target);
    const wrong = controlledWrong("office-application-identities", canonicalAnswer, `${seed}:wrong`);
    const stems = [
      `Which application is primarily used for ${textValue(target)}?`,
      `Identify the Microsoft Office application associated with ${textValue(target)}.`,
      `Which Office program best matches this principal task: ${textValue(target)}?`,
      `${textValue(target)} is primarily associated with which application?`,
      `Select the application whose main productivity role is ${textValue(target)}.`,
      `Which of the following applications is designed chiefly for ${textValue(target)}?`,
    ];
    return finalize({ qlId, surfaceMode: mode, target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${canonicalAnswer} is used for ${textValue(target)}. Therefore, ${canonicalAnswer} is correct.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: "office-application-identities" });
  }
  const target = deterministicPick(targetFacts("COM003-PT-001", "software_classification"), `${seed}:target`);
  const canonicalAnswer = "Application/productivity software";
  const wrong = controlledWrong("office-software-categories", canonicalAnswer, `${seed}:wrong`);
  const stems = [
    `${entityLabel(target)} is best classified as which type of software?`,
    `Which software category includes ${entityLabel(target)}?`,
    `${entityLabel(target)} belongs to which broad software class?`,
    `How should ${entityLabel(target)} be classified in basic computer awareness?`,
    `Select the correct software classification for ${entityLabel(target)}.`,
    `Which category most accurately describes ${entityLabel(target)}?`,
  ];
  return finalize({ qlId, surfaceMode: mode, target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${entityLabel(target)} is application/productivity software rather than system software.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: "office-software-categories" });
};

const ql002: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-002";
  const facts = targetFacts("COM003-PT-002", "office_extension_type");
  const target = deterministicPick(facts, `${seed}:target`);
  const reverse = index % 2 === 0;
  if (reverse) {
    const canonicalAnswer = entityLabel(target);
    const wrong = semanticWrong({ target, facts: approvedFacts("COM003-PT-002", "office_extension_type"), answer: entityLabel, seed: `${seed}:wrong` });
    const stems = [
      `Which file extension matches a ${textValue(target)}?`,
      `Select the extension associated with a ${textValue(target)}.`,
      `A ${textValue(target)} normally uses which of these extensions?`,
      `Which extension correctly identifies the described Office file: ${textValue(target)}?`,
      `Identify the file extension for a ${textValue(target)}.`,
      `Which option is the expected extension for this Office format: ${textValue(target)}?`,
    ];
    return finalize({ qlId, surfaceMode: "TYPE_TO_EXTENSION", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${entityLabel(target)} is the extension for a ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts });
  }
  const canonicalAnswer = textValue(target);
  const wrong = semanticWrong({ target, facts: approvedFacts("COM003-PT-002", "office_extension_type"), answer: textValue, seed: `${seed}:wrong` });
  const stems = [
    `${entityLabel(target)} is normally associated with which Office file type?`,
    `What does the Office extension ${entityLabel(target)} represent?`,
    `Identify the file type corresponding to ${entityLabel(target)}.`,
    `Which description correctly matches ${entityLabel(target)}?`,
    `The extension ${entityLabel(target)} belongs to which Office format?`,
    `Which Office file description is correct for ${entityLabel(target)}?`,
  ];
  return finalize({ qlId, surfaceMode: "EXTENSION_TO_TYPE", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${entityLabel(target)} identifies a ${canonicalAnswer}.`, provenanceFacts: wrong.provenanceFacts });
};

const ql003: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-003";
  const shortcutMode = index % 2 === 1;
  const relation = shortcutMode ? "common_shortcut_action" : "common_command_effect";
  const facts = approvedFacts("COM003-PT-003", relation);
  const targets = targetFacts("COM003-PT-003", relation);
  const target = deterministicPick(targets, `${seed}:target`);
  const reverse = Math.floor(index / 2) % 2 === 0;
  if (reverse) {
    const canonicalAnswer = entityLabel(target);
    const wrong = semanticWrong({ target, facts, answer: entityLabel, seed: `${seed}:wrong` });
    const stems = shortcutMode
      ? [
          `In a supported Windows desktop Office editing context, which shortcut is used to ${textValue(target)}?`,
          `Which Windows desktop Office shortcut corresponds to this action: ${textValue(target)}?`,
          `Select the shortcut for ${textValue(target)} in the stated Office desktop context.`,
          `Which key combination performs this Office action in Windows desktop context: ${textValue(target)}?`,
          `For a supported Windows desktop Office application, ${textValue(target)} is performed with which shortcut?`,
          `Which shortcut-action pair is correct for this Office task: ${textValue(target)}?`,
        ]
      : [
          `Which command is used to ${textValue(target)}?`,
          `Identify the Office command whose effect is to ${textValue(target)}.`,
          `Which command best matches this action: ${textValue(target)}?`,
          `${textValue(target)} is the purpose of which command?`,
          `Select the command that would ${textValue(target)}.`,
          `Which editing/document command performs this function: ${textValue(target)}?`,
        ];
    return finalize({ qlId, surfaceMode: shortcutMode ? "ACTION_TO_SHORTCUT" : "EFFECT_TO_COMMAND", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${entityLabel(target)} is used to ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts });
  }
  const canonicalAnswer = textValue(target);
  const wrong = semanticWrong({ target, facts, answer: textValue, seed: `${seed}:wrong` });
  const stems = shortcutMode
    ? [
        `In supported Windows desktop Office context, what does ${entityLabel(target)} do?`,
        `Which action is associated with ${entityLabel(target)} in a supported Office desktop application?`,
        `What is the usual Office action of ${entityLabel(target)} in Windows desktop context?`,
        `${entityLabel(target)} corresponds to which action in the stated Office environment?`,
        `Select the correct action for the shortcut ${entityLabel(target)}.`,
        `Which description correctly states the function of ${entityLabel(target)}?`,
      ]
    : [
        `What is the effect of the ${entityLabel(target)} command?`,
        `Which action is performed by ${entityLabel(target)}?`,
        `${entityLabel(target)} is used for which purpose?`,
        `Select the correct description of the ${entityLabel(target)} command.`,
        `Which statement best describes what ${entityLabel(target)} does?`,
        `The command ${entityLabel(target)} performs which operation?`,
      ];
  return finalize({ qlId, surfaceMode: shortcutMode ? "SHORTCUT_TO_ACTION" : "COMMAND_TO_EFFECT", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${entityLabel(target)} ${canonicalAnswer}.`, provenanceFacts: wrong.provenanceFacts });
};

const ql004: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-004";
  const modes = ["DOCUMENT_CONCEPT", "EDIT_ACTION_FROM_EFFECT", "FORMAT_CONTROL_FROM_EFFECT", "ALIGNMENT_FROM_PROPERTY", "FORMATTING_SHORTCUT"] as const;
  const mode = modes[index % modes.length]!;
  const config = {
    DOCUMENT_CONCEPT: { relation: "word_document_concept", pool: "office-artifact-types" },
    EDIT_ACTION_FROM_EFFECT: { relation: "word_editing_operation", pool: "word-editing-actions" },
    FORMAT_CONTROL_FROM_EFFECT: { relation: "word_character_formatting", pool: "word-formatting-controls" },
    ALIGNMENT_FROM_PROPERTY: { relation: "word_paragraph_alignment", pool: "word-alignments" },
    FORMATTING_SHORTCUT: { relation: "word_formatting_shortcut", pool: "word-formatting-shortcuts" },
  }[mode];
  const target = deterministicPick(targetFacts("COM003-PT-004", config.relation), `${seed}:target`);
  const canonicalAnswer = entityLabel(target);
  const wrong = controlledWrong(config.pool, canonicalAnswer, `${seed}:wrong`);
  const stemsByMode: Record<typeof mode, readonly string[]> = {
    DOCUMENT_CONCEPT: [
      `Which item is described as ${textValue(target)}?`, `Identify the Word-related concept from this description: ${textValue(target)}.`, `Which option matches this word-processing description: ${textValue(target)}?`, `In Office terminology, what is ${textValue(target)}?`, `Select the artifact/application that is ${textValue(target)}.`, `Which Word concept fits the description: ${textValue(target)}?`,
    ],
    EDIT_ACTION_FROM_EFFECT: [
      `Which Word editing action ${textValue(target)}?`, `Identify the editing command that ${textValue(target)}.`, `Which operation has this effect in Word: ${textValue(target)}?`, `${textValue(target)} is the result of which editing action?`, `Select the Word command that ${textValue(target)}.`, `Which editing operation best matches: ${textValue(target)}?`,
    ],
    FORMAT_CONTROL_FROM_EFFECT: [
      `Which Word formatting control ${textValue(target)}?`, `Identify the formatting feature that ${textValue(target)}.`, `Which option performs this text-formatting action: ${textValue(target)}?`, `${textValue(target)} is the effect of which formatting control?`, `Select the formatting command that ${textValue(target)}.`, `Which Word control matches the stated formatting effect: ${textValue(target)}?`,
    ],
    ALIGNMENT_FROM_PROPERTY: [
      `Which paragraph alignment ${textValue(target)}?`, `Identify the alignment described here: ${textValue(target)}.`, `Which Word alignment has this property: ${textValue(target)}?`, `${textValue(target)} describes which paragraph alignment?`, `Select the alignment that ${textValue(target)}.`, `Which alignment option matches the description: ${textValue(target)}?`,
    ],
    FORMATTING_SHORTCUT: [
      `In Windows desktop Word, which shortcut is used to ${textValue(target)}?`, `Which Word shortcut corresponds to this formatting action: ${textValue(target)}?`, `Select the Windows desktop Word shortcut for ${textValue(target)}.`, `Which key combination performs this Word formatting action: ${textValue(target)}?`, `${textValue(target)} is associated with which Word shortcut?`, `Which shortcut-action pair is correct for this Word formatting task: ${textValue(target)}?`,
    ],
  };
  return finalize({ qlId, surfaceMode: mode, target, seed, stem: template(stemsByMode[mode], index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${canonicalAnswer} ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: config.pool });
};

const ql005: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-005";
  const facts = approvedFacts("COM003-PT-005", "word_correction_feature");
  const target = deterministicPick(targetFacts("COM003-PT-005", "word_correction_feature"), `${seed}:target`);
  const reverse = index % 2 === 0;
  if (reverse) {
    const canonicalAnswer = entityLabel(target);
    const wrong = semanticWrong({ target, facts, answer: entityLabel, seed: `${seed}:wrong` });
    const stems = [`Which Word feature ${textValue(target)}?`, `Identify the feature whose purpose is to ${textValue(target)}.`, `Which document-correction feature matches this description: ${textValue(target)}?`, `${textValue(target)} is performed by which Word feature?`, `Select the proofing/search feature that ${textValue(target)}.`, `Which Word tool is correctly described as follows: ${textValue(target)}?`];
    return finalize({ qlId, surfaceMode: "FEATURE_FROM_PURPOSE", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${canonicalAnswer} ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts });
  }
  const canonicalAnswer = textValue(target);
  const wrong = semanticWrong({ target, facts, answer: textValue, seed: `${seed}:wrong` });
  const stems = [`What is the principal purpose of ${entityLabel(target)} in Word?`, `Which description correctly matches ${entityLabel(target)}?`, `${entityLabel(target)} is used for which task?`, `Select the correct function of ${entityLabel(target)}.`, `What does the Word feature ${entityLabel(target)} do?`, `Which statement best describes ${entityLabel(target)}?`];
  return finalize({ qlId, surfaceMode: "PURPOSE_FROM_FEATURE", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${entityLabel(target)} ${canonicalAnswer}.`, provenanceFacts: wrong.provenanceFacts });
};

const ql006: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-006";
  const orientation = index % 2 === 1;
  const relation = orientation ? "word_page_orientation" : "word_page_element_role";
  const poolId = orientation ? "word-page-orientations" : "word-page-elements";
  const target = deterministicPick(targetFacts("COM003-PT-006", relation), `${seed}:target`);
  const canonicalAnswer = orientation ? entityLabel(target).replace(" orientation", "") : entityLabel(target);
  const wrong = controlledWrong(poolId, canonicalAnswer, `${seed}:wrong`);
  const stems = orientation
    ? [`Which page orientation is described as ${textValue(target)}?`, `A page that is ${textValue(target).replace("page orientation in which the page is ", "")} uses which orientation?`, `Identify the Word page orientation from this description: ${textValue(target)}.`, `${textValue(target)} describes which page orientation?`, `Select the page orientation matching this dimension relationship: ${textValue(target)}.`, `Which Word orientation fits the stated page shape: ${textValue(target)}?`]
    : [`Which Word page element is described as ${textValue(target)}?`, `Identify the page element from this role: ${textValue(target)}.`, `${textValue(target)} refers to which Word page feature?`, `Which page-layout element matches the description: ${textValue(target)}?`, `Select the Word page feature whose role is: ${textValue(target)}.`, `Which option correctly names this page element: ${textValue(target)}?`];
  return finalize({ qlId, surfaceMode: orientation ? "ORIENTATION_FROM_DIMENSIONS" : "PAGE_ELEMENT_FROM_ROLE", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${entityLabel(target)} is ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: poolId });
};

const ql007: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-007";
  const facts = approvedFacts("COM003-PT-007", "mail_merge_relation");
  const target = deterministicPick(targetFacts("COM003-PT-007", "mail_merge_relation"), `${seed}:target`);
  const canonicalAnswer = entityLabel(target);
  const wrong = semanticWrong({ target, facts, answer: entityLabel, seed: `${seed}:wrong` });
  const stems = [`Which mail-merge concept ${textValue(target)}?`, `Identify the Word mail-merge feature/component from this description: ${textValue(target)}.`, `${textValue(target)} describes which part of mail merge?`, `Which option correctly matches this mail-merge role: ${textValue(target)}?`, `Select the mail-merge term whose function is to ${textValue(target)}.`, `Which Word mail-merge concept is being described: ${textValue(target)}?`];
  return finalize({ qlId, surfaceMode: target.factId === "com003-word-mail-merge-purpose" ? "FEATURE_FROM_PURPOSE" : "COMPONENT_FROM_ROLE", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${canonicalAnswer} ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts });
};

const ql008: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-008";
  const modes = ["STRUCTURE_TERM_FROM_DEFINITION", "CELL_ADDRESS_INTERPRETATION", "RANGE_RECOGNITION"] as const;
  const mode = modes[index % modes.length]!;
  if (mode === "STRUCTURE_TERM_FROM_DEFINITION") {
    const target = deterministicPick(targetFacts("COM003-PT-008", "excel_structure_concept"), `${seed}:target`);
    const canonicalAnswer = entityLabel(target);
    const wrong = controlledWrong("excel-structure-terms", canonicalAnswer, `${seed}:wrong`);
    const stems = [`Which Excel structure term is defined as ${textValue(target)}?`, `Identify the spreadsheet concept: ${textValue(target)}.`, `${textValue(target)} describes which Excel term?`, `Which worksheet/workbook term matches this definition: ${textValue(target)}?`, `Select the Excel structure item described here: ${textValue(target)}.`, `Which spreadsheet term correctly fits: ${textValue(target)}?`];
    return finalize({ qlId, surfaceMode: mode, target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${canonicalAnswer} is ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: "excel-structure-terms" });
  }
  if (mode === "CELL_ADDRESS_INTERPRETATION") {
    const target = deterministicPick(targetFacts("COM003-PT-008", "excel_cell_address"), `${seed}:target`);
    const canonicalAnswer = textValue(target);
    const wrong = controlledWrong("excel-reference-notation", canonicalAnswer, `${seed}:wrong`);
    const stems = [`In Excel, what does ${entityLabel(target)} represent?`, `Interpret this A1-style reference component: ${entityLabel(target)}.`, `Which description correctly matches ${entityLabel(target)}?`, `${entityLabel(target)} corresponds to which cell-reference concept?`, `Select the correct interpretation of ${entityLabel(target)}.`, `What is the meaning of ${entityLabel(target)} in an Excel cell reference?`];
    return finalize({ qlId, surfaceMode: mode, target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${entityLabel(target)} ${canonicalAnswer}.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: "excel-reference-notation" });
  }
  const target = deterministicPick(targetFacts("COM003-PT-008", "excel_cell_range"), `${seed}:target`);
  const canonicalAnswer = entityLabel(target);
  const wrong = controlledWrong("excel-reference-notation", canonicalAnswer, `${seed}:wrong`);
  const stems = [`Which notation represents the continuous range described as ${textValue(target)}?`, `Select the Excel range notation for ${textValue(target)}.`, `Which cell/range reference matches this description: ${textValue(target)}?`, `Identify the notation for ${textValue(target)}.`, `${textValue(target)} is written using which Excel reference?`, `Which option correctly expresses this continuous cell range: ${textValue(target)}?`];
  return finalize({ qlId, surfaceMode: mode, target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${canonicalAnswer} denotes ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: "excel-reference-notation" });
};

const ql009: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-009";
  const prefix = index % 3 === 0;
  if (prefix) {
    const target = targetFacts("COM003-PT-009", "excel_formula_syntax")[0]!;
    const canonicalAnswer = "=";
    const wrong = controlledWrong("excel-formula-prefix-symbols", canonicalAnswer, `${seed}:wrong`);
    const stems = [`Which symbol normally begins an Excel formula?`, `An Excel formula is normally entered by starting with which symbol?`, `Which character tells Excel that an entry is a formula?`, `What is the standard first symbol of an Excel formula?`, `Which symbol should appear first when entering a normal Excel formula?`, `Identify the usual formula-prefix symbol in Excel.`];
    return finalize({ qlId, surfaceMode: "FORMULA_PREFIX", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `An Excel formula normally begins with an equal sign (=).`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: "excel-formula-prefix-symbols" });
  }
  const target = deterministicPick(targetFacts("COM003-PT-009", "excel_formula_operator"), `${seed}:target`);
  const canonicalAnswer = entityLabel(target);
  const wrong = controlledWrong("excel-arithmetic-operators", canonicalAnswer, `${seed}:wrong`);
  const stems = [`Which Excel arithmetic operator represents ${textValue(target)}?`, `Select the operator used for ${textValue(target)} in an Excel formula.`, `In Excel formulas, ${textValue(target)} is performed using which symbol?`, `Which symbol should be used to carry out ${textValue(target)}?`, `Identify the arithmetic operator for ${textValue(target)} in Excel.`, `Which operator-action match is correct for ${textValue(target)}?`];
  return finalize({ qlId, surfaceMode: "OPERATION_TO_OPERATOR", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${canonicalAnswer} is the Excel arithmetic operator for ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: "excel-arithmetic-operators" });
};

const ql010: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-010";
  const autoSum = index % 3 === 2;
  if (autoSum) {
    const target = targetFacts("COM003-PT-010", "excel_autosum_behavior").find((fact) => fact.factId === "com003-excel-autosum-sum")!;
    const canonicalAnswer = "SUM";
    const wrong = controlledWrong("excel-autosum-actions", canonicalAnswer, `${seed}:wrong`);
    const stems = [`AutoSum is primarily used to insert which Excel function?`, `Which function is most directly associated with Excel AutoSum?`, `Using AutoSum normally inserts a formula based on which function?`, `Which basic function does the AutoSum command insert quickly?`, `AutoSum is a convenience mechanism for which Excel function?`, `Select the function that is the principal target of AutoSum.`];
    return finalize({ qlId, surfaceMode: "AUTOSUM_IDENTIFICATION", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `AutoSum quickly inserts a SUM formula for a detected or selected range.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: "excel-autosum-actions" });
  }
  const target = deterministicPick(targetFacts("COM003-PT-010", "excel_basic_function"), `${seed}:target`);
  const canonicalAnswer = entityLabel(target);
  const wrong = controlledWrong("excel-basic-functions", canonicalAnswer, `${seed}:wrong`);
  const stems = [`Which Excel function ${textValue(target)}?`, `Identify the function whose basic purpose is to ${textValue(target)}.`, `Which function matches this description: ${textValue(target)}?`, `${textValue(target)} is the purpose of which Excel function?`, `Select the basic Excel function that ${textValue(target)}.`, `Which function-purpose pairing is correct for this task: ${textValue(target)}?`];
  return finalize({ qlId, surfaceMode: "FUNCTION_FROM_PURPOSE", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${canonicalAnswer} ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: "excel-basic-functions" });
};

const ql011: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-011";
  const notationMode = index % 3 === 2;
  if (notationMode) {
    const target = targetFacts("COM003-PT-011", "excel_reference_notation")[0]!;
    const canonicalAnswer = entityLabel(target);
    const wrong = controlledWrong("excel-reference-notation", canonicalAnswer, `${seed}:wrong`);
    const stems = [`Which Excel reference is fully absolute for both column and row?`, `Select the fully absolute A1-style reference.`, `Which notation keeps both the column and row absolute?`, `Identify the reference with an absolute column and absolute row.`, `Which of these is a fully absolute Excel cell reference?`, `Which notation uses dollar signs to lock both column and row?`];
    return finalize({ qlId, surfaceMode: "REFERENCE_NOTATION_CLASSIFICATION", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${canonicalAnswer} is an absolute column and absolute row reference.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: "excel-reference-notation" });
  }
  const target = deterministicPick(targetFacts("COM003-PT-011", "excel_reference_behavior"), `${seed}:target`);
  const canonicalAnswer = entityLabel(target);
  const wrong = controlledWrong("excel-reference-types", canonicalAnswer, `${seed}:wrong`);
  const stems = [`Which Excel reference type ${textValue(target)}?`, `Identify the reference type from this copied-formula behavior: ${textValue(target)}.`, `${textValue(target)} describes which reference type?`, `Which cell-reference type behaves as follows when copied: ${textValue(target)}?`, `Select the reference class that ${textValue(target)}.`, `Which Excel reference concept matches this behavior: ${textValue(target)}?`];
  return finalize({ qlId, surfaceMode: "REFERENCE_TYPE_FROM_BEHAVIOR", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${canonicalAnswer} ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: "excel-reference-types" });
};

const ql012: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-012";
  const facts = approvedFacts("COM003-PT-012", "excel_data_feature");
  const target = deterministicPick(targetFacts("COM003-PT-012", "excel_data_feature"), `${seed}:target`);
  const canonicalAnswer = entityLabel(target);
  const wrong = semanticWrong({ target, facts, answer: entityLabel, seed: `${seed}:wrong` });
  const stems = [`Which Excel feature/action ${textValue(target)}?`, `Identify the worksheet feature from this behavior: ${textValue(target)}.`, `${textValue(target)} describes which Excel operation?`, `Which data-handling feature matches the stated effect: ${textValue(target)}?`, `Select the Excel feature that ${textValue(target)}.`, `Which spreadsheet operation is being described: ${textValue(target)}?`];
  return finalize({ qlId, surfaceMode: "FEATURE_FROM_EFFECT", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${canonicalAnswer} ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts });
};

const ql013: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-013";
  const facts = approvedFacts("COM003-PT-013", "excel_row_column_operation");
  const target = deterministicPick(targetFacts("COM003-PT-013", "excel_row_column_operation"), `${seed}:target`);
  const canonicalAnswer = entityLabel(target);
  const wrong = semanticWrong({ target, facts, answer: entityLabel, seed: `${seed}:wrong` });
  const stems = [`Which Excel row/column operation ${textValue(target)}?`, `Identify the worksheet operation from this effect: ${textValue(target)}.`, `${textValue(target)} describes which row/column setting or action?`, `Select the Excel operation that ${textValue(target)}.`, `Which worksheet structure control matches this description: ${textValue(target)}?`, `Which row/column concept is correctly described as follows: ${textValue(target)}?`];
  return finalize({ qlId, surfaceMode: "OPERATION_FROM_EFFECT", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${canonicalAnswer} ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts });
};

const ql014: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-014";
  const target = deterministicPick(targetFacts("COM003-PT-014", "excel_chart_purpose"), `${seed}:target`);
  const canonicalAnswer = entityLabel(target);
  const wrong = controlledWrong("excel-basic-chart-types", canonicalAnswer, `${seed}:wrong`);
  const stems = [`Which chart type is commonly used to ${textValue(target)}?`, `For this elementary visualization purpose, which chart is commonly appropriate: ${textValue(target)}?`, `Identify the chart associated with this basic use: ${textValue(target)}.`, `Which Excel chart type commonly serves the following purpose: ${textValue(target)}?`, `Select the chart that is conventionally used to ${textValue(target)}.`, `Which basic chart-purpose pairing matches: ${textValue(target)}?`];
  return finalize({ qlId, surfaceMode: "CHART_FROM_PURPOSE", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${canonicalAnswer} is commonly used to ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: "excel-basic-chart-types" });
};

const ql015: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-015";
  const facts = approvedFacts("COM003-PT-015", "excel_shortcut_action");
  const target = deterministicPick(targetFacts("COM003-PT-015", "excel_shortcut_action"), `${seed}:target`);
  const reverse = index % 2 === 0;
  if (reverse) {
    const canonicalAnswer = entityLabel(target);
    const wrong = semanticWrong({ target, facts, answer: entityLabel, seed: `${seed}:wrong` });
    const stems = [`In Windows desktop Excel, which shortcut/access-key sequence is used to ${textValue(target)}?`, `Which Windows desktop Excel shortcut corresponds to this action: ${textValue(target)}?`, `Select the Excel shortcut for ${textValue(target)} in Windows desktop context.`, `Which key or access-key sequence performs this Excel action: ${textValue(target)}?`, `In the stated Windows desktop Excel context, ${textValue(target)} uses which shortcut?`, `Which shortcut-action pair is correct for this Excel task: ${textValue(target)}?`];
    return finalize({ qlId, surfaceMode: "ACTION_TO_SHORTCUT", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `In Windows desktop Excel, ${canonicalAnswer} is used to ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts });
  }
  const canonicalAnswer = textValue(target);
  const wrong = semanticWrong({ target, facts, answer: textValue, seed: `${seed}:wrong` });
  const stems = [`In Windows desktop Excel, what does ${entityLabel(target)} do?`, `Which Excel action is associated with ${entityLabel(target)} in Windows desktop context?`, `What is the function of ${entityLabel(target)} in the stated Excel environment?`, `${entityLabel(target)} corresponds to which Excel action?`, `Select the correct Windows desktop Excel action for ${entityLabel(target)}.`, `Which description correctly matches the Excel shortcut ${entityLabel(target)}?`];
  return finalize({ qlId, surfaceMode: "SHORTCUT_TO_ACTION", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `In Windows desktop Excel, ${entityLabel(target)} is used to ${canonicalAnswer}.`, provenanceFacts: wrong.provenanceFacts });
};

const ql016: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-016";
  const creationMode = index % 2 === 1;
  const relation = creationMode ? "powerpoint_creation_structure" : "powerpoint_structure_concept";
  const poolId = creationMode ? "powerpoint-creation-concepts" : "office-artifact-types";
  const target = deterministicPick(targetFacts("COM003-PT-016", relation), `${seed}:target`);
  const canonicalAnswer = entityLabel(target);
  const wrong = controlledWrong(poolId, canonicalAnswer, `${seed}:wrong`);
  const stems = creationMode
    ? [`Which PowerPoint creation concept ${textValue(target)}?`, `Identify the presentation-design concept from this role: ${textValue(target)}.`, `${textValue(target)} describes which PowerPoint concept?`, `Which presentation feature matches this definition: ${textValue(target)}?`, `Select the PowerPoint creation/design term that ${textValue(target)}.`, `Which PowerPoint concept is correctly described as follows: ${textValue(target)}?`]
    : [`Which PowerPoint artifact/concept is described as ${textValue(target)}?`, `Identify the presentation structure term: ${textValue(target)}.`, `${textValue(target)} describes which PowerPoint item?`, `Which presentation unit or artifact matches this description: ${textValue(target)}?`, `Select the PowerPoint structure concept that is ${textValue(target)}.`, `Which presentation term fits the description: ${textValue(target)}?`];
  return finalize({ qlId, surfaceMode: creationMode ? "CREATION_CONCEPT_FROM_ROLE" : "PRESENTATION_CONCEPT", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${canonicalAnswer} ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: poolId });
};

const ql017: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-017";
  const target = deterministicPick(targetFacts("COM003-PT-017", "powerpoint_insertable_object"), `${seed}:target`);
  const canonicalAnswer = entityLabel(target);
  const wrong = controlledWrong("powerpoint-insertable-objects", canonicalAnswer, `${seed}:wrong`);
  const stems = [`Which PowerPoint insertable object ${textValue(target)}?`, `Identify the slide object from this purpose: ${textValue(target)}.`, `${textValue(target)} describes which object that can be inserted on a slide?`, `Which PowerPoint object best matches this role: ${textValue(target)}?`, `Select the insertable slide object that ${textValue(target)}.`, `Which presentation object is correctly described as follows: ${textValue(target)}?`];
  return finalize({ qlId, surfaceMode: "OBJECT_FROM_PURPOSE", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${canonicalAnswer} ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: "powerpoint-insertable-objects" });
};

const ql018: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-018";
  const timingMode = index % 2 === 1;
  const relation = timingMode ? "powerpoint_transition_timing" : "powerpoint_motion_effect";
  const poolId = timingMode ? "powerpoint-timing-concepts" : "powerpoint-motion-effects";
  const target = deterministicPick(targetFacts("COM003-PT-018", relation), `${seed}:target`);
  const canonicalAnswer = entityLabel(target);
  const wrong = controlledWrong(poolId, canonicalAnswer, `${seed}:wrong`);
  const stems = timingMode
    ? [`Which PowerPoint timing concept ${textValue(target)}?`, `Identify the timing setting from this effect: ${textValue(target)}.`, `${textValue(target)} describes which presentation timing concept?`, `Which PowerPoint timing control matches this description: ${textValue(target)}?`, `Select the timing concept that ${textValue(target)}.`, `Which slide-transition timing term is correctly described as follows: ${textValue(target)}?`]
    : [`Which PowerPoint effect is described as ${textValue(target)}?`, `Identify the presentation effect from this scope: ${textValue(target)}.`, `${textValue(target)} describes which PowerPoint effect?`, `Which effect matches this slide/object behavior: ${textValue(target)}?`, `Select the PowerPoint effect that is ${textValue(target)}.`, `Which presentation-effect term fits this description: ${textValue(target)}?`];
  return finalize({ qlId, surfaceMode: timingMode ? "TIMING_CONCEPT_FROM_EFFECT" : "EFFECT_FROM_SCOPE", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `${canonicalAnswer} is ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: poolId });
};

const ql019: QlGenerator = (seed, index) => {
  const qlId = "COM-003-QL-019";
  const target = deterministicPick(targetFacts("COM003-PT-019", "powerpoint_slideshow_shortcut"), `${seed}:target`);
  const canonicalAnswer = entityLabel(target);
  const wrong = controlledWrong("powerpoint-slideshow-shortcuts", canonicalAnswer, `${seed}:wrong`);
  const stems = [`In Windows desktop PowerPoint, which shortcut is used to ${textValue(target)}?`, `Which PowerPoint slide-show shortcut corresponds to this action: ${textValue(target)}?`, `Select the Windows desktop PowerPoint shortcut for ${textValue(target)}.`, `Which key combination performs this slide-show action: ${textValue(target)}?`, `In the stated PowerPoint desktop context, ${textValue(target)} uses which shortcut?`, `Which shortcut-action pair is correct for this PowerPoint slide-show task: ${textValue(target)}?`];
  return finalize({ qlId, surfaceMode: "SLIDESHOW_ACTION_TO_SHORTCUT", target, seed, stem: template(stems, index), canonicalAnswer, wrongAnswers: wrong.wrongAnswers, explanation: `In Windows desktop PowerPoint, ${canonicalAnswer} is used to ${textValue(target)}.`, provenanceFacts: wrong.provenanceFacts, extraSourceIds: wrong.extraSourceIds, controlledPoolId: "powerpoint-slideshow-shortcuts" });
};

const GENERATORS: Record<string, QlGenerator> = {
  "COM-003-QL-001": ql001,
  "COM-003-QL-002": ql002,
  "COM-003-QL-003": ql003,
  "COM-003-QL-004": ql004,
  "COM-003-QL-005": ql005,
  "COM-003-QL-006": ql006,
  "COM-003-QL-007": ql007,
  "COM-003-QL-008": ql008,
  "COM-003-QL-009": ql009,
  "COM-003-QL-010": ql010,
  "COM-003-QL-011": ql011,
  "COM-003-QL-012": ql012,
  "COM-003-QL-013": ql013,
  "COM-003-QL-014": ql014,
  "COM-003-QL-015": ql015,
  "COM-003-QL-016": ql016,
  "COM-003-QL-017": ql017,
  "COM-003-QL-018": ql018,
  "COM-003-QL-019": ql019,
};

export function generateCom003ReviewQuestion(qlId: string, seed: string, index = 0) {
  const generator = GENERATORS[qlId];
  if (!generator) throw new Error(`No COM-003 review generator for ${qlId}`);
  return generator(seed, index);
}

export function buildCom003EnglishReviewCorpus(options: { perQl?: number; seedPrefix?: string } = {}) {
  const perQl = options.perQl ?? 12;
  const seedPrefix = options.seedPrefix ?? "com003-review-v1";
  if (!Number.isInteger(perQl) || perQl < 1 || perQl > 50) throw new Error("perQl must be between 1 and 50");
  return COM003_PERMANENT_QLS.flatMap((ql) =>
    Array.from({ length: perQl }, (_, index) =>
      generateCom003ReviewQuestion(ql.qlId, `${seedPrefix}:${ql.qlId}:${index}`, index),
    ),
  );
}

export const COM003_ENGLISH_REVIEW_CORPUS_V1 = buildCom003EnglishReviewCorpus();

export function auditCom003EnglishReviewSynthesisV1() {
  const issues: string[] = [];
  const corpus = COM003_ENGLISH_REVIEW_CORPUS_V1;
  const targetIds = new Set(COM003_EDITORIAL_TARGET_FACTS.map((fact) => fact.factId));
  const allocatedQlIds = COM003_PERMANENT_QLS.map((ql) => ql.qlId).sort();
  const generatedQlIds = [...new Set(corpus.map((question) => question.qlId))].sort();
  if (JSON.stringify(allocatedQlIds) !== JSON.stringify(generatedQlIds)) issues.push("REVIEW_CORPUS_DOES_NOT_COVER_ALL_PERMANENT_QLS");

  for (const question of corpus) {
    if (!targetIds.has(question.targetFactId)) issues.push(`NON_TARGET_FACT_USED:${question.questionId}:${question.targetFactId}`);
    if (question.options.length !== 4) issues.push(`OPTION_COUNT:${question.questionId}:${question.options.length}`);
    if (new Set(question.options.map((option) => option.trim().toLowerCase())).size !== 4) issues.push(`DUPLICATE_OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`CANONICAL_ANSWER_POSITION:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`MISSING_PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE_DRIFT:${question.questionId}`);
    if (question.distractorStrategy === "SEMANTIC_FACT_POOL" && question.controlledPoolId) issues.push(`SEMANTIC_QUESTION_HAS_CONTROLLED_POOL:${question.questionId}`);
    if (question.distractorStrategy !== "SEMANTIC_FACT_POOL" && !question.controlledPoolId) issues.push(`CONTROLLED_QUESTION_MISSING_POOL:${question.questionId}`);
    if (/all of the above|none of the above/i.test(question.options.join(" "))) issues.push(`META_OPTION_LEAK:${question.questionId}`);
    if (question.versionScoped && /SHORTCUT|ACCESS|SLIDESHOW/i.test(question.surfaceMode) && !/Windows desktop/i.test(question.stem)) {
      issues.push(`VERSION_CONTEXT_MISSING:${question.questionId}`);
    }
  }

  const coverage = COM003_PERMANENT_QLS.map((ql) => {
    const questions = corpus.filter((question) => question.qlId === ql.qlId);
    const stems = new Set(questions.map((question) => question.stem));
    const surfaceModes = new Set(questions.map((question) => question.surfaceMode));
    if (questions.length !== 12) issues.push(`QL_REVIEW_COUNT:${ql.qlId}:${questions.length}`);
    if (stems.size < 6) issues.push(`THIN_STEM_DIVERSITY:${ql.qlId}:${stems.size}`);
    if (ql.supportedSolveModes.length >= 4 && surfaceModes.size < 2) issues.push(`THIN_SURFACE_MODE_DIVERSITY:${ql.qlId}:${surfaceModes.size}`);
    return {
      qlId: ql.qlId,
      questionCount: questions.length,
      uniqueStemCount: stems.size,
      surfaceModes: [...surfaceModes].sort(),
    };
  });

  const fingerprints = new Set(corpus.map((question) => `${question.stem}|${question.options.join("|")}|${question.correctIndex}`));
  if (fingerprints.size !== corpus.length) issues.push(`DUPLICATE_REVIEW_QUESTIONS:${corpus.length - fingerprints.size}`);
  if (corpus.length !== 228) issues.push(`UNEXPECTED_REVIEW_CORPUS_SIZE:${corpus.length}`);

  return {
    valid: issues.length === 0,
    questionCount: corpus.length,
    qlCount: generatedQlIds.length,
    perQl: 12,
    coverage,
    reviewOnly: true,
    contentFrozen: false,
    runtimeRegistered: false,
    productionReleased: false,
    issues,
  };
}
