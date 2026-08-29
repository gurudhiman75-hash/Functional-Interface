import {
  SUFFICIENCY_CLASSES,
  SufficiencyInvariantError,
  type SufficiencyClass,
} from "./types.ts";

export type DsOptionKey = "A" | "B" | "C" | "D" | "E";

export interface DsAnswerOptionDefinition {
  readonly key: DsOptionKey;
  readonly semanticClass: SufficiencyClass;
  readonly text: string;
}

export interface DsAnswerContract {
  readonly id: string;
  readonly locale: "en-IN";
  readonly options: readonly DsAnswerOptionDefinition[];
}

export const DS_STANDARD_5_EN: DsAnswerContract = {
  id: "DS_STANDARD_5",
  locale: "en-IN",
  options: [
    {
      key: "A",
      semanticClass: "STATEMENT_I_ONLY",
      text: "Statement I alone is sufficient, but Statement II alone is not sufficient.",
    },
    {
      key: "B",
      semanticClass: "STATEMENT_II_ONLY",
      text: "Statement II alone is sufficient, but Statement I alone is not sufficient.",
    },
    {
      key: "C",
      semanticClass: "EACH_STATEMENT_ALONE",
      text: "Each statement alone is sufficient.",
    },
    {
      key: "D",
      semanticClass: "INSUFFICIENT_EVEN_TOGETHER",
      text: "Even when both statements are used together, they are not sufficient.",
    },
    {
      key: "E",
      semanticClass: "BOTH_TOGETHER_ONLY",
      text: "Both statements together are sufficient, but neither statement alone is sufficient.",
    },
  ],
};

export function validateAnswerContract(contract: DsAnswerContract): void {
  const keys = contract.options.map((option) => option.key);
  if (new Set(keys).size !== keys.length) {
    throw new SufficiencyInvariantError("DSF_DUPLICATE_OPTION_KEY", `${contract.id} contains duplicate option keys.`);
  }

  const classes = contract.options.map((option) => option.semanticClass);
  if (new Set(classes).size !== classes.length) {
    throw new SufficiencyInvariantError(
      "DSF_OVERLAPPING_OPTION_SEMANTICS",
      `${contract.id} maps more than one option to the same sufficiency class.`,
    );
  }

  const missing = SUFFICIENCY_CLASSES.filter((semanticClass) => !classes.includes(semanticClass));
  if (missing.length > 0) {
    throw new SufficiencyInvariantError(
      "DSF_INCOMPLETE_STANDARD_5_CONTRACT",
      `${contract.id} does not represent: ${missing.join(", ")}.`,
    );
  }

  for (const option of contract.options) {
    if (option.text.trim().length === 0) {
      throw new SufficiencyInvariantError("DSF_EMPTY_OPTION_TEXT", `${contract.id}/${option.key} has empty text.`);
    }
  }
}

export function optionForClass(
  contract: DsAnswerContract,
  semanticClass: SufficiencyClass,
): DsAnswerOptionDefinition {
  const option = contract.options.find((candidate) => candidate.semanticClass === semanticClass);
  if (!option) {
    throw new SufficiencyInvariantError(
      "DSF_CLASS_NOT_REPRESENTABLE_BY_CONTRACT",
      `${contract.id} cannot render ${semanticClass}.`,
    );
  }
  return option;
}
