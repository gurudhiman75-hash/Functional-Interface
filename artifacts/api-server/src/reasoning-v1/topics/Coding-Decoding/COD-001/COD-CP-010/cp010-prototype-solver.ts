import type {
  Cp010Action,
  Cp010Domain,
  Cp010EndpointClass,
  Cp010StructuredPrompt,
  Cp010SolveTrace,
} from "./cp010-prototype-types";

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export function classifyCp010Token(token: string, domain: Cp010Domain): Cp010EndpointClass {
  if (domain === "LETTER") return VOWELS.has(token) ? "VOWEL" : "CONSONANT";
  const digit = Number(token);
  if (!Number.isInteger(digit) || digit < 0 || digit > 9) {
    throw new Error(`Invalid digit token '${token}'`);
  }
  return digit % 2 === 0 ? "EVEN" : "ODD";
}

function applyDisplayedAction(
  sourceTokens: readonly string[],
  baseCodeTokens: readonly string[],
  action: Cp010Action,
  mapping: ReadonlyMap<string, string>,
  domain: Cp010Domain,
): string[] {
  const output = [...baseCodeTokens];
  const finalIndex = output.length - 1;

  switch (action.kind) {
    case "REPLACE_ENDPOINTS_WITH_CONSTANT":
      output[0] = action.constantCode;
      output[finalIndex] = action.constantCode;
      return output;

    case "SWAP_ENDPOINT_CODES": {
      const first = output[0]!;
      output[0] = output[finalIndex]!;
      output[finalIndex] = first;
      return output;
    }

    case "COPY_LEFT_CODE_TO_BOTH":
      output[finalIndex] = output[0]!;
      return output;

    case "COPY_RIGHT_CODE_TO_BOTH":
      output[0] = output[finalIndex]!;
      return output;

    case "REPLACE_MATCHING_CLASS_WITH_DESIGNATED_CODE": {
      const replacement = mapping.get(action.designatedSourceToken);
      if (!replacement) {
        throw new Error(`Designated source token '${action.designatedSourceToken}' is absent from the table`);
      }
      for (let index = 0; index < sourceTokens.length; index += 1) {
        if (classifyCp010Token(sourceTokens[index]!, domain) === action.targetClass) {
          output[index] = replacement;
        }
      }
      return output;
    }
  }
}

export function solveCp010Prompt(prompt: Cp010StructuredPrompt): Cp010SolveTrace {
  if (prompt.sourceTokens.length < 2) throw new Error("Conditional coding requires at least two source tokens");
  if (prompt.precedence !== "MUTUALLY_EXCLUSIVE") {
    throw new Error("Prototype solver accepts only mutually exclusive conditions");
  }

  const mapping = new Map(prompt.mappingRows.map((row) => [row.sourceToken, row.codeToken] as const));
  if (mapping.size !== prompt.mappingRows.length) throw new Error("Mapping-table source tokens must be unique");

  const baseCodeTokens = prompt.sourceTokens.map((token) => {
    const code = mapping.get(token);
    if (!code) throw new Error(`Source token '${token}' is absent from the mapping table`);
    return code;
  });

  const firstClass = classifyCp010Token(prompt.sourceTokens[0]!, prompt.domain);
  const lastClass = classifyCp010Token(prompt.sourceTokens[prompt.sourceTokens.length - 1]!, prompt.domain);
  const matching = prompt.conditions.filter(
    (condition) => condition.firstClass === firstClass && condition.lastClass === lastClass,
  );
  if (matching.length !== 1) {
    throw new Error(`Expected exactly one matching condition for ${firstClass}/${lastClass}; found ${matching.length}`);
  }

  const condition = matching[0]!;
  const finalCodeTokens = applyDisplayedAction(
    prompt.sourceTokens,
    baseCodeTokens,
    condition.action,
    mapping,
    prompt.domain,
  );

  return {
    baseCodeTokens,
    firstClass,
    lastClass,
    matchedConditionId: condition.conditionId,
    actionKind: condition.action.kind,
    finalCodeTokens,
  };
}
