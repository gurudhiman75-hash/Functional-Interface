import {
  auditCom003V15,
  buildCom003EnglishReviewCorpusV15,
  expectedCom003V15Answer,
  type Com003ReviewQuestionV15,
} from "./com003-review-synthesis-v15";
import { COM003_EDITORIALLY_APPROVED_FACTS } from "./com003-editorial-fact-review";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";

const VERB_AFTER_TO = /\bto (returns|counts|calculates|adds|compares|shows|illustrates|visualizes|sorts|filters|continues|changes|keeps|starts|sets|controls|applies|determines|specifies|displays|removes|fills|orders|creates|contains|stores|holds|identifies|locates|replaces|combines|inserts|duplicates|opens|saves|copies|cuts|finds|reverses|reapplies)\b/gi;
const BASE_VERB: Record<string, string> = {
  returns: "return", counts: "count", calculates: "calculate", adds: "add", compares: "compare",
  shows: "show", illustrates: "illustrate", visualizes: "visualize", sorts: "sort", filters: "filter",
  continues: "continue", changes: "change", keeps: "keep", starts: "start", sets: "set",
  controls: "control", applies: "apply", determines: "determine", specifies: "specify", displays: "display",
  removes: "remove", fills: "fill", orders: "order", creates: "create", contains: "contain", stores: "store",
  holds: "hold", identifies: "identify", locates: "locate", replaces: "replace", combines: "combine",
  inserts: "insert", duplicates: "duplicate", opens: "open", saves: "save", copies: "copy", cuts: "cut",
  finds: "find", reverses: "reverse", reapplies: "reapply",
};

const SURFACE_FAMILIES: readonly Com003ReviewQuestionV15["examSurfaceFamily"][] = [
  "DIRECT_RECALL",
  "FUNCTIONAL_APPLICATION",
  "EXAMPLE_RECOGNITION",
  "CONTRAST_DISCRIMINATION",
];

const factById = new Map(COM003_EDITORIALLY_APPROVED_FACTS.map((fact) => [fact.factId, fact]));

function compact(value: string) {
  return value.trim().replace(/\s+/g, " ").replace(/[.]+$/, "");
}

function lowerFirst(value: string) {
  const v = compact(value);
  return v ? `${v.charAt(0).toLowerCase()}${v.slice(1)}` : v;
}

function factParts(question: Com003ReviewQuestionV15) {
  const fact = factById.get(question.targetFactId);
  if (!fact || fact.value.kind !== "text") throw new Error(`COM003 V15 finalizer missing text fact ${question.targetFactId}`);
  return {
    entity: compact(fact.entity.label.en),
    text: compact(fact.value.text.en),
    expected: compact(expectedCom003V15Answer(question)),
  };
}

function applicationForQl(qlId: string) {
  const n = Number(qlId.match(/QL-(\d{3})$/)?.[1] ?? 0);
  if (n <= 3) return "Microsoft Office";
  if (n <= 7) return "Microsoft Word";
  if (n <= 15) return "Microsoft Excel";
  return "Microsoft PowerPoint";
}

function finalizeStem(input: string) {
  let stem = input.trim().replace(/\s+/g, " ");
  stem = stem.replace(VERB_AFTER_TO, (_match, verb: string) => `to ${BASE_VERB[verb.toLowerCase()] ?? verb}`);
  stem = stem.replace(/\?+$/g, "").replace(/[.]+$/g, "").trim();
  return `${stem}?`;
}

function alternateDuplicateStem(question: Com003ReviewQuestionV15, stem: string, seen: Set<string>) {
  const candidates: string[] = [];
  if (/^Which\b/i.test(stem) && !/^Which of the following\b/i.test(stem)) candidates.push(stem.replace(/^Which\b/i, "What"));
  if (/,\s*which\b/i.test(stem)) candidates.push(stem.replace(/,\s*which\b/i, ", what"));
  const app = applicationForQl(question.qlId);
  const core = stem.replace(/\?+$/g, "");
  candidates.push(`In ${app}, ${lowerFirst(core)}?`);
  candidates.push(`Within ${app}, ${lowerFirst(core)}?`);
  for (const candidate of candidates.map(finalizeStem)) {
    if (!seen.has(candidate.toLowerCase())) return candidate;
  }
  throw new Error(`COM003 V15 finalizer could not resolve duplicate stem ${question.questionId}:${stem}`);
}

function finalizeCorpus(corpus: readonly Com003ReviewQuestionV15[]) {
  const seenByQl = new Map<string, Set<string>>();
  return corpus.map((question) => {
    const seen = seenByQl.get(question.qlId) ?? new Set<string>();
    let stem = finalizeStem(question.stem);
    if (seen.has(stem.toLowerCase())) stem = alternateDuplicateStem(question, stem, seen);
    seen.add(stem.toLowerCase());
    seenByQl.set(question.qlId, seen);
    return { ...question, stem };
  });
}

function specialFamilyStem(question: Com003ReviewQuestionV15, family: Com003ReviewQuestionV15["examSurfaceFamily"], variant: number) {
  const { entity, text } = factParts(question);
  const description = lowerFirst(text);
  if (question.surfaceMode === "SOFTWARE_CLASSIFICATION") {
    const stems = {
      DIRECT_RECALL: [`How is ${entity} classified in basic computer awareness?`, `${entity} belongs to which class of software?`, `Which software category includes ${entity}?`],
      FUNCTIONAL_APPLICATION: [`While classifying programs on a computer, ${entity} should be placed in which software category?`, `A user is sorting installed programs by software type. How should ${entity} be classified?`, `Under which software class should ${entity} be recorded?`],
      EXAMPLE_RECOGNITION: [`${entity} is an example of which type of software?`, `Which software class is illustrated by ${entity}?`, `The program ${entity} provides an example of which software category?`],
      CONTRAST_DISCRIMINATION: [`When distinguishing application software from system software, where does ${entity} belong?`, `Which classification correctly distinguishes ${entity} from operating-system software?`, `${entity} should be classified under which category rather than system software?`],
    } as const;
    return stems[family][variant % 3]!;
  }
  if (question.surfaceMode === "FORMULA_PREFIX") {
    const stems = {
      DIRECT_RECALL: ["Which symbol normally begins an Excel formula?", "An Excel formula normally starts with which symbol?", "Which character tells Excel that an entry is a formula?"],
      FUNCTIONAL_APPLICATION: ["A user is about to enter a formula in Excel. Which symbol should be typed first?", "To make Excel interpret an entry as a formula, which symbol should precede the expression?", "Before entering a calculation as a formula in Excel, which symbol is normally used?"],
      EXAMPLE_RECOGNITION: ["Which symbol correctly completes the formula ___SUM(A1:A5)?", "Which prefix would turn SUM(A1:A5) into a standard Excel formula?", "Which leading symbol makes A1+B1 a normal Excel formula entry?"],
      CONTRAST_DISCRIMINATION: ["Which symbol distinguishes an Excel formula from ordinary text or a plain number?", "Which leading symbol is specifically associated with formula entry in Excel?", "Among common arithmetic and punctuation symbols, which one normally marks the start of an Excel formula?"],
    } as const;
    return stems[family][variant % 3]!;
  }
  if (question.surfaceMode === "AUTOSUM_IDENTIFICATION") {
    const stems = {
      DIRECT_RECALL: ["Which function is normally inserted by AutoSum in Excel?", "AutoSum is directly associated with which Excel function?", "Which function does Excel normally use when AutoSum is selected?"],
      FUNCTIONAL_APPLICATION: ["A user wants AutoSum to total a selected range. Which function will normally be inserted?", "When AutoSum is used for a basic total, which function does Excel place in the formula?", "A worksheet needs a quick total through AutoSum. Which function is used?"],
      EXAMPLE_RECOGNITION: ["Using AutoSum on A1:A5 normally creates an example of which function?", "Which function is illustrated by the common AutoSum operation?", "A formula inserted automatically to total a range is usually an example of which Excel function?"],
      CONTRAST_DISCRIMINATION: ["AutoSum is linked with which function rather than AVERAGE, COUNT, MAX or MIN?", "Among the basic Excel functions, which one is specifically associated with AutoSum?", "Which function should be distinguished as the normal AutoSum function?"],
    } as const;
    return stems[family][variant % 3]!;
  }
  if (question.surfaceMode === "ORIENTATION_FROM_DIMENSIONS") {
    const shape = description.replace(/^page orientation in which the page is\s*/i, "");
    const stems = {
      DIRECT_RECALL: [`Which page orientation is used when the page is ${shape}?`, `A page is ${shape}. Which orientation is this?`, `Which Word orientation makes a page ${shape}?`],
      FUNCTIONAL_APPLICATION: [`A document page needs to be ${shape}. Which orientation should be selected?`, `If a Word page must be ${shape}, which orientation setting should be used?`, `Which page-orientation setting should a user choose for a page that is ${shape}?`],
      EXAMPLE_RECOGNITION: [`A page that is ${shape} is an example of which orientation?`, `Which orientation is illustrated by a page that is ${shape}?`, `The page shape “${shape}” corresponds to which Word orientation?`],
      CONTRAST_DISCRIMINATION: [`Between Portrait and Landscape, which orientation is ${shape}?`, `Which standard orientation, rather than the other one, matches a page that is ${shape}?`, `Which orientation is correctly matched with the condition that the page is ${shape}?`],
    } as const;
    return stems[family][variant % 3]!;
  }
  throw new Error(`COM003 V15 missing special family synthesis for ${question.surfaceMode}`);
}

function synthesizedFamilyStem(question: Com003ReviewQuestionV15, family: Com003ReviewQuestionV15["examSurfaceFamily"], variant: number) {
  const { entity, text, expected } = factParts(question);
  const app = applicationForQl(question.qlId);
  const description = lowerFirst(text);
  const entityAnswer = expected.toLowerCase() === entity.toLowerCase();
  const textAnswer = expected.toLowerCase() === text.toLowerCase();

  if (!entityAnswer && !textAnswer) return specialFamilyStem(question, family, variant);

  if (entityAnswer) {
    const stems = {
      DIRECT_RECALL: [
        `Which ${app} term or option matches this description: ${description}?`,
        `In ${app}, what is described as ${description}?`,
        `Which ${app} item has this meaning or function: ${description}?`,
      ],
      FUNCTIONAL_APPLICATION: [
        `A user needs the ${app} item whose function is ${description}. Which option should be used?`,
        `In ${app}, which option should a user choose for the following requirement: ${description}?`,
        `Which ${app} feature or item is appropriate when the requirement is ${description}?`,
      ],
      EXAMPLE_RECOGNITION: [
        `Which ${app} option is the correct example for this description: ${description}?`,
        `The description “${description}” is an example of which ${app} term or feature?`,
        `Which choice correctly illustrates the ${app} concept described as ${description}?`,
      ],
      CONTRAST_DISCRIMINATION: [
        `Which ${app} choice, rather than the alternatives, matches this description: ${description}?`,
        `Which option correctly distinguishes the ${app} item described as ${description}?`,
        `Among the given ${app} alternatives, which one is correctly associated with ${description}?`,
      ],
    } as const;
    return stems[family][variant % 3]!;
  }

  const stems = {
    DIRECT_RECALL: [
      `What does ${entity} mean or do in ${app}?`,
      `Which description correctly states the function or meaning of ${entity} in ${app}?`,
      `In ${app}, ${entity} is associated with which description?`,
    ],
    FUNCTIONAL_APPLICATION: [
      `A user encounters or selects ${entity} in ${app}. What result or meaning should be expected?`,
      `When ${entity} is used in ${app}, which description states what it does?`,
      `In practical ${app} use, what does ${entity} indicate or perform?`,
    ],
    EXAMPLE_RECOGNITION: [
      `Which description is a correct example of the meaning or function of ${entity} in ${app}?`,
      `${entity} in ${app} illustrates which of the following descriptions?`,
      `Which choice correctly exemplifies what ${entity} means or does in ${app}?`,
    ],
    CONTRAST_DISCRIMINATION: [
      `Which description correctly distinguishes ${entity} from the other alternatives in ${app}?`,
      `Which statement, rather than the competing descriptions, correctly matches ${entity} in ${app}?`,
      `Among the given descriptions, which one is correctly associated with ${entity} in ${app}?`,
    ],
  } as const;
  return stems[family][variant % 3]!;
}

function addGovernedMissingFamilies(candidates: readonly Com003ReviewQuestionV15[], perFamily = 3) {
  const output = [...candidates];
  for (const ql of COM003_PERMANENT_QLS) {
    const qlCandidates = candidates.filter((question) => question.qlId === ql.qlId);
    for (const family of SURFACE_FAMILIES) {
      const existing = output.filter((question) => question.qlId === ql.qlId && question.examSurfaceFamily === family);
      const missing = Math.max(0, perFamily - existing.length);
      if (!missing) continue;

      const usedTargetFacts = new Set(existing.map((question) => question.targetFactId));
      const bases: Com003ReviewQuestionV15[] = [];
      for (const preferUnusedTarget of [true, false]) {
        for (const base of qlCandidates) {
          if (bases.length >= missing) break;
          if (bases.includes(base)) continue;
          if (preferUnusedTarget && usedTargetFacts.has(base.targetFactId)) continue;
          bases.push(base);
          usedTargetFacts.add(base.targetFactId);
        }
        if (bases.length >= missing) break;
      }
      if (bases.length < missing) throw new Error(`${ql.qlId}:${family}: insufficient governed bases for family synthesis`);

      bases.forEach((base, index) => {
        output.push({
          ...base,
          questionId: `${base.questionId}-V15-SYNTH-${family}-${index + 1}`,
          examSurfaceFamily: family,
          stem: synthesizedFamilyStem(base, family, existing.length + index),
        });
      });
    }
  }
  return output;
}

function selectBalancedQl(qlId: string, candidates: readonly Com003ReviewQuestionV15[], perFamily: number) {
  const selected: Com003ReviewQuestionV15[] = [];
  const selectedIds = new Set<string>();
  const usedTargetFacts = new Set<string>();
  for (const family of SURFACE_FAMILIES) {
    const familyCandidates = candidates.filter((question) => question.examSurfaceFamily === family);
    const familySelected: Com003ReviewQuestionV15[] = [];
    for (const preferUnusedTarget of [true, false]) {
      for (const candidate of familyCandidates) {
        if (familySelected.length >= perFamily) break;
        if (selectedIds.has(candidate.questionId)) continue;
        if (preferUnusedTarget && usedTargetFacts.has(candidate.targetFactId)) continue;
        familySelected.push(candidate);
        selectedIds.add(candidate.questionId);
        usedTargetFacts.add(candidate.targetFactId);
      }
      if (familySelected.length >= perFamily) break;
    }
    if (familySelected.length !== perFamily) throw new Error(`${qlId}:${family}: expected ${perFamily} selectable candidates, found ${familySelected.length}`);
    selected.push(...familySelected);
  }
  return selected;
}

function buildCandidatePool(seedPrefix: string) {
  const raw = Array.from({ length: 6 }, (_, batch) =>
    buildCom003EnglishReviewCorpusV15({ perQl: 12, seedPrefix: `${seedPrefix}:candidate-batch-${batch + 1}` }),
  ).flat();
  return addGovernedMissingFamilies(raw, 3);
}

export function buildCom003EnglishReviewCorpusV15Final(options: { perQl?: number; seedPrefix?: string } = {}) {
  const perQl = options.perQl ?? 12;
  if (perQl !== 12) throw new Error("COM003 V15 final learner-review surface is fixed at 12 questions per QL");
  const seedPrefix = options.seedPrefix ?? "com003-v15-final";
  const candidatePool = buildCandidatePool(seedPrefix);
  const selected = COM003_PERMANENT_QLS.flatMap((ql) => selectBalancedQl(ql.qlId, candidatePool.filter((question) => question.qlId === ql.qlId), 3));
  return finalizeCorpus(selected);
}

export const COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL = buildCom003EnglishReviewCorpusV15Final();

export function auditCom003V15Final() {
  const base = auditCom003V15();
  const issues = base.issues.filter((issue) => !issue.startsWith("DUPLICATE_STEM:"));
  for (const ql of COM003_PERMANENT_QLS) {
    const questions = COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL.filter((question) => question.qlId === ql.qlId);
    if (questions.length !== 12) issues.push(`FINAL_COUNT:${ql.qlId}:${questions.length}`);
    if (new Set(questions.map((question) => question.stem.toLowerCase())).size !== questions.length) issues.push(`FINAL_DUPLICATE_STEM:${ql.qlId}`);
    for (const family of SURFACE_FAMILIES) {
      const count = questions.filter((question) => question.examSurfaceFamily === family).length;
      if (count !== 3) issues.push(`FINAL_FAMILY_BALANCE:${ql.qlId}:${family}:${count}`);
    }
  }
  for (const question of COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL) {
    if (!question.stem.endsWith("?") || question.stem.endsWith("??")) issues.push(`TERMINAL_PUNCTUATION:${question.questionId}`);
    if (/\bto (returns|counts|calculates|adds|compares|shows|sorts|filters|starts|sets|controls|applies|displays|removes|creates|stores|inserts|opens|saves|copies|cuts|finds)\b/i.test(question.stem)) issues.push(`BROKEN_INFINITIVE:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER_POSITION:${question.questionId}`);
    if (expectedCom003V15Answer(question).trim().toLowerCase() !== question.canonicalAnswer.trim().toLowerCase()) issues.push(`SEMANTIC_ANSWER:${question.questionId}:${question.targetFactId}`);
  }
  return { valid: issues.length === 0, questions: COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL.length, qls: 19, issues };
}
