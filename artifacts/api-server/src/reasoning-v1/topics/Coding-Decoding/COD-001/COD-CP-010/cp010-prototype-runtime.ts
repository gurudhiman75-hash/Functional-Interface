import { SeededRandom } from "../foundation/prng";
import { classifyCp010Token, solveCp010Prompt } from "./cp010-prototype-solver";
import type {
  Cp010Action,
  Cp010Condition,
  Cp010Domain,
  Cp010EndpointClass,
  Cp010MappingRow,
  Cp010Option,
  Cp010StructuredPrompt,
  GeneratedCp010PrototypeQuestion,
} from "./cp010-prototype-types";

const LETTER_TABLE_TOKENS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K", "O", "U"] as const;
const DIGIT_TABLE_TOKENS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
const CODE_POOL = ["@", "3", "$", "6", "&", "8", "A", "B", "C", "K", "R", "Z"] as const;
const VOWELS = ["A", "E", "I", "O", "U"] as const;
const CONSONANTS = ["B", "C", "D", "F", "G", "H", "K"] as const;
const ODD_DIGITS = ["1", "3", "5", "7", "9"] as const;
const EVEN_DIGITS = ["0", "2", "4", "6", "8"] as const;

function codeValue(tokens: readonly string[]): string {
  return tokens.join("");
}

function buildMappingRows(domain: Cp010Domain, random: SeededRandom): Cp010MappingRow[] {
  const sourceTokens = domain === "LETTER" ? LETTER_TABLE_TOKENS : DIGIT_TABLE_TOKENS;
  const codes = random.shuffle(CODE_POOL).slice(0, sourceTokens.length);
  return random.shuffle(sourceTokens.map((sourceToken, index) => ({ sourceToken, codeToken: codes[index]! })));
}

function letterConditions(): Cp010Condition[] {
  return [
    {
      conditionId: "LETTER-CONSONANT-CONSONANT",
      firstClass: "CONSONANT",
      lastClass: "CONSONANT",
      description: "If both the first and last letters are consonants, every vowel is coded as the code assigned to D.",
      action: {
        kind: "REPLACE_MATCHING_CLASS_WITH_DESIGNATED_CODE",
        targetClass: "VOWEL",
        designatedSourceToken: "D",
      },
    },
    {
      conditionId: "LETTER-VOWEL-VOWEL",
      firstClass: "VOWEL",
      lastClass: "VOWEL",
      description: "If both the first and last letters are vowels, both endpoint letters are coded as X.",
      action: { kind: "REPLACE_ENDPOINTS_WITH_CONSTANT", constantCode: "X" },
    },
    {
      conditionId: "LETTER-CONSONANT-VOWEL",
      firstClass: "CONSONANT",
      lastClass: "VOWEL",
      description: "If the first letter is a consonant and the last letter is a vowel, their table codes are interchanged.",
      action: { kind: "SWAP_ENDPOINT_CODES" },
    },
    {
      conditionId: "LETTER-VOWEL-CONSONANT",
      firstClass: "VOWEL",
      lastClass: "CONSONANT",
      description: "If the first letter is a vowel and the last letter is a consonant, both endpoint letters use the table code of the first letter.",
      action: { kind: "COPY_LEFT_CODE_TO_BOTH" },
    },
  ];
}

function digitConditions(): Cp010Condition[] {
  return [
    {
      conditionId: "DIGIT-ODD-EVEN",
      firstClass: "ODD",
      lastClass: "EVEN",
      description: "If the first digit is odd and the last digit is even, both endpoint digits use the table code of the last digit.",
      action: { kind: "COPY_RIGHT_CODE_TO_BOTH" },
    },
    {
      conditionId: "DIGIT-EVEN-ODD",
      firstClass: "EVEN",
      lastClass: "ODD",
      description: "If the first digit is even and the last digit is odd, both endpoint digits use the table code of the first digit.",
      action: { kind: "COPY_LEFT_CODE_TO_BOTH" },
    },
    {
      conditionId: "DIGIT-ODD-ODD",
      firstClass: "ODD",
      lastClass: "ODD",
      description: "If both the first and last digits are odd, both endpoint digits are coded as #.",
      action: { kind: "REPLACE_ENDPOINTS_WITH_CONSTANT", constantCode: "#" },
    },
    {
      conditionId: "DIGIT-EVEN-EVEN",
      firstClass: "EVEN",
      lastClass: "EVEN",
      description: "If both the first and last digits are even, both endpoint digits are coded as %.",
      action: { kind: "REPLACE_ENDPOINTS_WITH_CONSTANT", constantCode: "%" },
    },
  ];
}

function classPairForIndex(domain: Cp010Domain, branchIndex: number): readonly [Cp010EndpointClass, Cp010EndpointClass] {
  if (domain === "LETTER") {
    return [
      ["CONSONANT", "CONSONANT"],
      ["VOWEL", "VOWEL"],
      ["CONSONANT", "VOWEL"],
      ["VOWEL", "CONSONANT"],
    ][branchIndex]! as readonly [Cp010EndpointClass, Cp010EndpointClass];
  }
  return [
    ["ODD", "EVEN"],
    ["EVEN", "ODD"],
    ["ODD", "ODD"],
    ["EVEN", "EVEN"],
  ][branchIndex]! as readonly [Cp010EndpointClass, Cp010EndpointClass];
}

function poolForClass(endpointClass: Cp010EndpointClass): readonly string[] {
  if (endpointClass === "VOWEL") return VOWELS;
  if (endpointClass === "CONSONANT") return CONSONANTS;
  if (endpointClass === "ODD") return ODD_DIGITS;
  return EVEN_DIGITS;
}

function buildSourceTokens(
  domain: Cp010Domain,
  firstClass: Cp010EndpointClass,
  lastClass: Cp010EndpointClass,
  random: SeededRandom,
): string[] {
  const length = random.int(5, 7);
  const first = random.pick(poolForClass(firstClass));
  const last = random.pick(poolForClass(lastClass));
  const activeTable = domain === "LETTER" ? LETTER_TABLE_TOKENS : DIGIT_TABLE_TOKENS;
  const interior = Array.from({ length: length - 2 }, () => random.pick(activeTable));

  if (domain === "LETTER" && firstClass === "CONSONANT" && lastClass === "CONSONANT") {
    interior[0] = random.pick(VOWELS);
    interior[1] = random.pick(VOWELS);
  }

  return [first, ...interior, last];
}

function mappingMap(rows: readonly Cp010MappingRow[]): Map<string, string> {
  return new Map(rows.map((row) => [row.sourceToken, row.codeToken] as const));
}

function evaluateHidden(
  sourceTokens: readonly string[],
  mappingRows: readonly Cp010MappingRow[],
  condition: Cp010Condition,
  domain: Cp010Domain,
): string[] {
  const mapping = mappingMap(mappingRows);
  const output = sourceTokens.map((token) => mapping.get(token)!);
  const finalIndex = output.length - 1;
  const action = condition.action;

  if (action.kind === "REPLACE_ENDPOINTS_WITH_CONSTANT") {
    output[0] = action.constantCode;
    output[finalIndex] = action.constantCode;
  } else if (action.kind === "SWAP_ENDPOINT_CODES") {
    const first = output[0]!;
    output[0] = output[finalIndex]!;
    output[finalIndex] = first;
  } else if (action.kind === "COPY_LEFT_CODE_TO_BOTH") {
    output[finalIndex] = output[0]!;
  } else if (action.kind === "COPY_RIGHT_CODE_TO_BOTH") {
    output[0] = output[finalIndex]!;
  } else {
    const replacement = mapping.get(action.designatedSourceToken)!;
    sourceTokens.forEach((token, index) => {
      if (classifyCp010Token(token, domain) === action.targetClass) output[index] = replacement;
    });
  }

  return output;
}

function partialActiveOverride(
  base: readonly string[],
  correct: readonly string[],
  action: Cp010Action,
  sourceTokens: readonly string[],
  domain: Cp010Domain,
): string[] {
  const output = [...base];
  const finalIndex = output.length - 1;
  if (action.kind === "REPLACE_ENDPOINTS_WITH_CONSTANT") {
    output[0] = action.constantCode;
  } else if (action.kind === "SWAP_ENDPOINT_CODES") {
    output[0] = correct[0]!;
  } else if (action.kind === "COPY_LEFT_CODE_TO_BOTH") {
    output[0] = base[finalIndex]!;
  } else if (action.kind === "COPY_RIGHT_CODE_TO_BOTH") {
    output[finalIndex] = base[0]!;
  } else {
    const matchingIndex = sourceTokens.findIndex((token) => classifyCp010Token(token, domain) === action.targetClass);
    if (matchingIndex >= 0) output[matchingIndex] = correct[matchingIndex]!;
  }
  return output;
}

function buildOptions(
  prompt: Cp010StructuredPrompt,
  correctTokens: readonly string[],
  traceBase: readonly string[],
  activeCondition: Cp010Condition,
  seed: number,
): { options: Cp010Option[]; correctIndex: number } {
  const candidates: Cp010Option[] = [];
  const seen = new Set([codeValue(correctTokens)]);
  const add = (tokens: readonly string[], errorLabel: Cp010Option["errorLabel"]) => {
    const value = codeValue(tokens);
    if (!seen.has(value)) {
      seen.add(value);
      candidates.push({ value, codeTokens: [...tokens], isCorrect: false, errorLabel });
    }
  };

  add(traceBase, "MISSED_CONDITION");

  const wrongCondition = prompt.conditions.find((condition) => condition.conditionId !== activeCondition.conditionId)!;
  add(
    evaluateHidden(prompt.sourceTokens, prompt.mappingRows, wrongCondition, prompt.domain),
    "WRONG_CONDITION",
  );

  add(
    partialActiveOverride(traceBase, correctTokens, activeCondition.action, prompt.sourceTokens, prompt.domain),
    activeCondition.action.kind === "COPY_LEFT_CODE_TO_BOTH" || activeCondition.action.kind === "COPY_RIGHT_CODE_TO_BOTH"
      ? "WRONG_ENDPOINT_DIRECTION"
      : "PARTIAL_OVERRIDE",
  );
  add([...correctTokens].reverse(), "REVERSED_OUTPUT");

  const mappingCodes = prompt.mappingRows.map((row) => row.codeToken);
  let mutationIndex = 0;
  while (candidates.length < 3) {
    const mutated = [...correctTokens];
    const index = mutationIndex % mutated.length;
    const replacement = mappingCodes[(mappingCodes.indexOf(mutated[index]!) + mutationIndex + 1) % mappingCodes.length]!;
    mutated[index] = replacement;
    add(mutated, "PARTIAL_OVERRIDE");
    mutationIndex += 1;
    if (mutationIndex > 20) throw new Error("Unable to construct three unique CP-010 distractors");
  }

  const correct: Cp010Option = {
    value: codeValue(correctTokens),
    codeTokens: [...correctTokens],
    isCorrect: true,
  };
  const options = new SeededRandom(`cp010:${seed}:option-order-v1`).shuffle([correct, ...candidates.slice(0, 3)]);
  return { options, correctIndex: options.findIndex((option) => option.isCorrect) };
}

function difficultyFor(action: Cp010Action): "EASY" | "MEDIUM" | "HARD" {
  if (action.kind === "REPLACE_MATCHING_CLASS_WITH_DESIGNATED_CODE") return "HARD";
  if (action.kind === "REPLACE_ENDPOINTS_WITH_CONSTANT") return "EASY";
  return "MEDIUM";
}

function buildExplanation(
  prompt: Cp010StructuredPrompt,
  activeCondition: Cp010Condition,
  baseCodeTokens: readonly string[],
  finalCodeTokens: readonly string[],
): GeneratedCp010PrototypeQuestion["explanation"] {
  const first = prompt.sourceTokens[0]!;
  const last = prompt.sourceTokens[prompt.sourceTokens.length - 1]!;
  const firstClass = classifyCp010Token(first, prompt.domain).toLowerCase();
  const lastClass = classifyCp010Token(last, prompt.domain).toLowerCase();
  const source = prompt.sourceDisplay;
  const base = codeValue(baseCodeTokens);
  const answer = codeValue(finalCodeTokens);

  return {
    referenceAid: [
      "First write the ordinary table code for every source token.",
      "Then inspect only the stated condition and change the affected positions exactly once.",
    ],
    quickMethod: "Table first, condition second: do not mix the two stages while reading the group.",
    ruleStatement: "Use the fixed lookup table, identify the one endpoint condition that applies, and then apply its override to the table code.",
    sourceDemonstration: [
      `${source} gives the ordinary table code ${base}.`,
      `The first token ${first} is ${firstClass}, while the last token ${last} is ${lastClass}.`,
    ],
    targetApplication: [
      `Therefore this condition applies: ${activeCondition.description}`,
      `Applying that override changes ${base} to ${answer}.`,
    ],
    conclusion: `Hence, the required code is ${answer}.`,
    commonTrapAlert: "Stopping after the table lookup ignores the condition; applying a different endpoint case changes the wrong positions.",
  };
}

export function generateCp010PrototypeQuestion(seed = 0): GeneratedCp010PrototypeQuestion {
  const absoluteSeed = Math.abs(seed);
  const domain: Cp010Domain = absoluteSeed % 2 === 0 ? "LETTER" : "DIGIT";
  const branchIndex = Math.floor(absoluteSeed / 2) % 4;
  const random = new SeededRandom(`COD-CP010-PROT-APPLY-CONDITIONAL-TABLE:${seed}:generator-v1`);
  const mappingRows = buildMappingRows(domain, random);
  const conditions = domain === "LETTER" ? letterConditions() : digitConditions();
  const [firstClass, lastClass] = classPairForIndex(domain, branchIndex);
  const sourceTokens = buildSourceTokens(domain, firstClass, lastClass, random);
  const sourceDisplay = sourceTokens.join("");
  const prompt: Cp010StructuredPrompt = {
    taskKind: "ENCODE_WITH_CONDITION_TABLE",
    domain,
    mappingRows,
    conditions,
    precedence: "MUTUALLY_EXCLUSIVE",
    sourceTokens,
    sourceDisplay,
  };

  const activeCondition = conditions.find(
    (condition) => condition.firstClass === firstClass && condition.lastClass === lastClass,
  )!;
  const hiddenAnswer = evaluateHidden(sourceTokens, mappingRows, activeCondition, domain);
  const solved = solveCp010Prompt(prompt);
  if (codeValue(hiddenAnswer) !== codeValue(solved.finalCodeTokens)) {
    throw new Error(`CP-010 hidden evaluator and independent solver disagree for seed ${seed}`);
  }

  const { options, correctIndex } = buildOptions(
    prompt,
    hiddenAnswer,
    solved.baseCodeTokens,
    activeCondition,
    seed,
  );
  const styles = [
    `Using the coding table and conditions, choose the correct code for '${sourceDisplay}'.`,
    `Which option correctly represents '${sourceDisplay}' under the given table and conditions?`,
    `Apply the displayed coding system to '${sourceDisplay}' and select its code.`,
  ];

  return {
    checkpointId: "COD-CP-010",
    prototypeId: "COD-CP010-PROT-APPLY-CONDITIONAL-TABLE",
    permanentQlId: null,
    prototypeOnly: true,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    seed,
    locale: "en-IN",
    difficulty: difficultyFor(activeCondition.action),
    renderer: "CONDITION_TABLE",
    answerType: "MIXED_CODE_SEQUENCE",
    stem: styles[absoluteSeed % styles.length]!,
    structuredPrompt: prompt,
    options,
    correctIndex,
    explanation: buildExplanation(prompt, activeCondition, solved.baseCodeTokens, hiddenAnswer),
    metadata: {
      runtimeVersion: "cod-cp010-prototype-v1",
      domain,
      endpointSignature: `${firstClass}_${lastClass}`,
      matchedConditionId: activeCondition.conditionId,
      actionKind: activeCondition.action.kind,
      baseCode: codeValue(solved.baseCodeTokens),
      correctAnswer: codeValue(hiddenAnswer),
      solverAgreement: true,
      mutuallyExclusiveConditions: true,
      precedenceRequired: false,
    },
  };
}
