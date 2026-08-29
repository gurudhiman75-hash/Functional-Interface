import { generateStcCp001Question } from "./cp001-generator.ts";
import { generateStcCp002Question } from "./cp002-generator.ts";
import { generateStcCp003Question } from "./cp003-generator.ts";
import type { GeneratedStcQuestion, StcLocale, StcQlId } from "./types.ts";

export function generateStcQuestion(input: {
  readonly qlId: StcQlId;
  readonly locale: StcLocale;
  readonly seed: number;
}): GeneratedStcQuestion {
  const { qlId, locale, seed } = input;
  switch (qlId) {
    case "STC-QL-001":
    case "STC-QL-002":
      return generateStcCp001Question({ qlId, locale, seed });
    case "STC-QL-003":
    case "STC-QL-004":
      return generateStcCp002Question({ qlId, locale, seed });
    case "STC-QL-005":
    case "STC-QL-006":
      return generateStcCp003Question({ qlId, locale, seed });
  }
}
