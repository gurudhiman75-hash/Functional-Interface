import { SeededRandom } from "../foundation/prng";
import type { CodDifficulty, CodRenderer, GeneratedOption } from "../foundation/types";
import { validateOptions } from "../foundation/option-validator";
import { CP008_DIRECT_LABEL_POOLS, CP008_SEMANTIC_FACTS } from "./cp008-curated-facts";
import { getCp008PrototypeContract } from "./cp008-prototype-contracts";
import {
  auditCp008Mapping,
  inverseRenamingSource,
  renamedLabel,
  solveCp008Prompt,
} from "./cp008-prototype-solver";
import type {
  Cp008PrototypeId,
  Cp008RenamingPair,
  Cp008SemanticFact,
  Cp008Topology,
  GeneratedCp008PrototypeQuestion,
} from "./cp008-prototype-types";

const RENDERERS: readonly CodRenderer[] = ["INLINE_CODE_PAIR", "EXAMPLE_TARGET_BLOCK", "MAPPING_TABLE"];

function buildMapping(
  random: SeededRandom,
  sourceDomain: readonly string[],
  topology: Cp008Topology,
  requiredSource: string,
  size: number,
): Cp008RenamingPair[] {
  const unique = [...new Set(sourceDomain)];
  if (!unique.includes(requiredSource)) throw new Error(`Required CP-008 source '${requiredSource}' is absent`);
  if (unique.length < size) throw new Error("CP-008 source domain is too small");

  const selected = random.shuffle(unique).slice(0, size);
  if (!selected.includes(requiredSource)) selected[selected.length - 1] = requiredSource;
  const ordered = random.shuffle([...new Set(selected)]);
  while (ordered.length < size) {
    const addition = unique.find((value) => !ordered.includes(value));
    if (!addition) throw new Error("Unable to complete CP-008 mapping domain");
    ordered.push(addition);
  }

  if (topology === "OPEN_CHAIN" && ordered[ordered.length - 1] === requiredSource) {
    [ordered[0], ordered[ordered.length - 1]] = [ordered[ordered.length - 1]!, ordered[0]!];
  }

  const mapping = topology === "CYCLE"
    ? ordered.map((actual, index) => ({ actual, called: ordered[(index + 1) % ordered.length]! }))
    : ordered.slice(0, -1).map((actual, index) => ({ actual, called: ordered[index + 1]! }));

  const audit = auditCp008Mapping(mapping);
  if (!audit.accepted) throw new Error(audit.reason ?? "Generated invalid CP-008 mapping");
  if (!mapping.some((pair) => pair.actual === requiredSource)) {
    throw new Error(`Generated mapping does not define '${requiredSource}'`);
  }
  return mapping;
}

function mappingStatements(mapping: readonly Cp008RenamingPair[]): string {
  return mapping.map(({ actual, called }) => `‘${actual}’ is called ‘${called}’`).join(", ");
}

function addWrong(
  output: GeneratedOption[],
  seen: Set<string>,
  value: string | null | undefined,
  errorLabel: string,
  correct: string,
): void {
  if (!value || value === correct || seen.has(value)) return;
  seen.add(value);
  output.push({ value, isCorrect: false, errorLabel });
}

function buildOptions(
  random: SeededRandom,
  mapping: readonly Cp008RenamingPair[],
  ordinaryAnswer: string,
  correct: string,
): { options: GeneratedOption[]; correctIndex: number } {
  const wrong: GeneratedOption[] = [];
  const seen = new Set<string>([correct]);
  addWrong(wrong, seen, ordinaryAnswer, "NO_RENAMING_APPLIED", correct);
  addWrong(wrong, seen, mapping.find((pair) => pair.actual === correct)?.called, "FOLLOWED_RENAMING_TWICE", correct);
  addWrong(wrong, seen, inverseRenamingSource(mapping, ordinaryAnswer), "INVERSE_RENAMING_DIRECTION", correct);
  const otherMapped = mapping.find((pair) => pair.actual !== ordinaryAnswer && pair.called !== correct)?.called;
  addWrong(wrong, seen, otherMapped, "WRONG_ORDINARY_REFERENT", correct);

  for (const value of [...mapping.map((pair) => pair.actual), ...mapping.map((pair) => pair.called)]) {
    addWrong(wrong, seen, value, "UNRELATED_RENAMED_LABEL", correct);
    if (wrong.length >= 3) break;
  }
  if (wrong.length < 3) throw new Error("Unable to build three CP-008 distractors");

  const options = random.shuffle([{ value: correct, isCorrect: true }, ...wrong.slice(0, 3)] satisfies GeneratedOption[]);
  validateOptions(options);
  return { options, correctIndex: options.findIndex((option) => option.isCorrect) };
}

function directDifficulty(seed: number, topology: Cp008Topology, mappingSize: number): CodDifficulty {
  return topology === "OPEN_CHAIN" && mappingSize <= 5 && seed % 3 !== 0 ? "EASY" : "MEDIUM";
}

function semanticDifficulty(seed: number, topology: Cp008Topology, fact: Cp008SemanticFact): CodDifficulty {
  if (topology === "CYCLE" && (seed % 4 === 0 || fact.category === "CATEGORY")) return "HARD";
  return "MEDIUM";
}

function buildStem(
  mapping: readonly Cp008RenamingPair[],
  directTarget: string | undefined,
  fact: Cp008SemanticFact | undefined,
  style: number,
): string {
  const statements = mappingStatements(mapping);
  const opening = style % 2 === 0 ? "In a certain code language" : "Under a renaming code";
  if (directTarget) {
    const endings = [
      `what is ‘${directTarget}’ called?`,
      `which name is used for ‘${directTarget}’?`,
      `how should ‘${directTarget}’ be named?`,
    ];
    return `${opening}, ${statements}. In this language, ${endings[style % endings.length]}`;
  }
  if (!fact) throw new Error("Semantic CP-008 stem requires a fact");
  return `${opening}, ${statements}. In this language, ${fact.question}`;
}

function buildExplanation(
  mapping: readonly Cp008RenamingPair[],
  directTarget: string | undefined,
  fact: Cp008SemanticFact | undefined,
  ordinaryAnswer: string,
  correct: string,
  trap: GeneratedOption,
) {
  const relevant = mapping.find((pair) => pair.actual === ordinaryAnswer)!;
  const ordinaryStep = directTarget
    ? `The question directly asks about ‘${directTarget}’, so the real referent is ${ordinaryAnswer}.`
    : fact!.rationale;
  return {
    referenceAid: [
      "Keep the real thing and its renamed label separate.",
      "Use exactly one renaming arrow; do not keep moving through the chain.",
    ],
    quickMethod: "Find the ordinary answer first, then read the label written immediately after that answer in the renaming statements.",
    ruleStatement: "Each statement changes only the name used for an item. The correct response is the label assigned directly to the real referent.",
    sourceDemonstration: [ordinaryStep],
    targetApplication: [`The relevant renaming is ${relevant.actual} → ${relevant.called}. Therefore, ${ordinaryAnswer} must be answered as ${correct}.`],
    conclusion: `Hence, the correct answer is ${correct}.`,
    commonTrapAlert: `${trap.value} represents the ${trap.errorLabel?.toLowerCase().replaceAll("_", " ") ?? "wrong"} approach. The mapping must be used once from the real referent.`,
    closestTrapRejection: `${trap.value} does not follow the single required renaming ${relevant.actual} → ${relevant.called}.`,
  } as const;
}

export function generateCp008PrototypeQuestion(
  prototypeId: Cp008PrototypeId,
  seed: number,
): GeneratedCp008PrototypeQuestion {
  const contract = getCp008PrototypeContract(prototypeId);
  const random = new SeededRandom(`${prototypeId}:${seed}:generator-v1`);
  const topology: Cp008Topology = seed % 2 === 0 ? "CYCLE" : "OPEN_CHAIN";
  const mappingSize = 5 + (seed % 3);

  let directTarget: string | undefined;
  let fact: Cp008SemanticFact | undefined;
  let ordinaryAnswer: string;
  let sourceDomain: readonly string[];

  if (contract.taskKind === "DIRECT_LABEL_QUERY") {
    sourceDomain = CP008_DIRECT_LABEL_POOLS[seed % CP008_DIRECT_LABEL_POOLS.length]!;
    directTarget = sourceDomain[(seed * 3 + 1) % Math.min(mappingSize, sourceDomain.length)]!;
    ordinaryAnswer = directTarget;
  } else {
    fact = CP008_SEMANTIC_FACTS[seed % CP008_SEMANTIC_FACTS.length]!;
    sourceDomain = fact.domain;
    ordinaryAnswer = fact.ordinaryAnswer;
  }

  const mapping = buildMapping(random, sourceDomain, topology, ordinaryAnswer, Math.min(mappingSize, sourceDomain.length));
  const prompt = {
    taskKind: contract.taskKind,
    topology,
    mapping,
    directTarget,
    semanticFactId: fact?.factId,
    semanticQuestion: fact?.question,
    ordinaryAnswer,
  } as const;
  const correct = renamedLabel(mapping, ordinaryAnswer);
  const independentlySolved = solveCp008Prompt(prompt);
  if (correct !== independentlySolved) throw new Error("CP-008 generator and independent solver disagree");

  const { options, correctIndex } = buildOptions(
    new SeededRandom(`${prototypeId}:${seed}:options-v1`),
    mapping,
    ordinaryAnswer,
    correct,
  );
  const style = new SeededRandom(`${prototypeId}:${seed}:editorial-v1`).int(0, 5);
  const trap = options.find((option) => !option.isCorrect)!;
  const hiddenFingerprint = `${contract.ruleId}:${topology}:${mapping.map(({ actual, called }) => `${actual}>${called}`).join("|")}:${fact?.factId ?? directTarget}`;

  return {
    packageId: "COD-001",
    checkpointId: "COD-CP-008",
    prototypeId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    ruleId: contract.ruleId,
    seed,
    locale: "en-IN",
    difficulty: contract.taskKind === "DIRECT_LABEL_QUERY"
      ? directDifficulty(seed, topology, mapping.length)
      : semanticDifficulty(seed, topology, fact!),
    renderer: RENDERERS[(seed + style) % RENDERERS.length]!,
    answerType: "WORD_OR_LABEL",
    stem: buildStem(mapping, directTarget, fact, style),
    structuredPrompt: prompt,
    options,
    correctIndex,
    explanation: buildExplanation(mapping, directTarget, fact, ordinaryAnswer, correct, trap),
    metadata: {
      runtimeVersion: "cod-cp008-renaming-prototype-v1",
      hiddenFingerprint,
      mappingInjective: true,
      identityEdges: 0,
      oneStepOnly: true,
      ordinaryAnswerUnique: true,
      solverAgreement: true,
      mappingSize: mapping.length,
      topology,
      factCategory: fact?.category,
      correctAnswer: correct,
    },
  };
}
