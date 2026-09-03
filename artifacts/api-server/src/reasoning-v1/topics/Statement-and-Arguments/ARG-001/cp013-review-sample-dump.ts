import { generateArgCp013QuestionStudioBatch } from "./cp013-final-editorial-surface.ts";

const ROMAN = ["I", "II", "III", "IV"] as const;
type Question = Readonly<Record<string, any>>;

function block(title: string, question: Question): string {
  const lines: string[] = [];
  lines.push(`## ${title}`);
  lines.push("");
  lines.push(`- QL: ${question.qlId}`);
  lines.push(`- Difficulty: ${question.difficultyLabel ?? question.difficulty}`);
  lines.push(`- Profile: ${question.examProfile ?? question.profileMode ?? "core"}`);
  lines.push(`- Locale: ${question.locale}`);
  if (question.editorialCardinalityMode) lines.push(`- Cardinality mode: ${question.editorialCardinalityMode}`);
  lines.push("");
  lines.push(`**Statement:** ${question.statement}`);
  lines.push("");
  lines.push("**Arguments:**");
  for (let index = 0; index < question.arguments.length; index += 1) lines.push(`${ROMAN[index]}. ${question.arguments[index]}`);
  lines.push("");
  lines.push("**Options:**");
  for (let index = 0; index < question.options.length; index += 1) lines.push(`${String.fromCharCode(65 + index)}. ${question.options[index]}`);
  lines.push("");
  lines.push(`**Answer:** ${question.options[question.correctIndex] ?? question.answer ?? question.canonicalAnswer}`);
  lines.push("");
  lines.push(`**Explanation:** ${question.explanation}`);
  lines.push("");
  return lines.join("\n");
}

function one(input: Readonly<Record<string, any>>): Question {
  const result = generateArgCp013QuestionStudioBatch({ ...input, count: 1 });
  const question = result.questions[0] as Question | undefined;
  if (!question) throw new Error(`no CP013 question for ${JSON.stringify(input)}`);
  return question;
}

function find(input: Readonly<Record<string, any>>, predicate: (question: Question) => boolean): Question {
  for (let seed = 0; seed < 400; seed += 1) {
    const question = one({ ...input, seed: `CP013-REVIEW-${seed}` });
    if (predicate(question)) return question;
  }
  throw new Error(`unable to find deterministic CP013 review sample for ${JSON.stringify(input)}`);
}

function strongCount(question: Question): number {
  return Array.isArray(question.argumentStrengths)
    ? question.argumentStrengths.filter((value: unknown) => value === "STRONG").length
    : 0;
}

function hasStrongNo(question: Question): boolean {
  return Array.isArray(question.arguments) && question.arguments.some((argument: unknown, index: number) =>
    question.argumentStrengths?.[index] === "STRONG" && /^(No\.|नहीं।|ਨਹੀਂ।)/u.test(String(argument)),
  );
}

const coreWorkshop = find(
  { qlId: "ARG-QL-004", language: "en", difficulty: "Medium" },
  (question) => question.templateId === "ARG-CP003-QL004-T04",
);
const corePunjabi = find(
  { qlId: "ARG-QL-005", language: "pa", difficulty: "Hard" },
  (question) => String(question.statement).includes("ਨਾਰਮਲਾਈਜ਼ਡ ਸਕੋਰ"),
);
const grievanceEnglish = find(
  { cpId: "ARG-CP-013", qlId: "ARG-QL-001", language: "en", difficulty: "Easy", examProfile: "SSC_RECENT_2X4" },
  (question) => String(question.scenarioId).includes("GRIEVANCE_CONTACT") && hasStrongNo(question),
);
const grievanceHindi = find(
  { cpId: "ARG-CP-013", qlId: "ARG-QL-001", language: "hi", difficulty: "Easy", examProfile: "SSC_RECENT_2X4" },
  (question) => String(question.scenarioId).includes("GRIEVANCE_CONTACT") && hasStrongNo(question),
);
const bankingClassic = one({ cpId: "ARG-CP-013", qlId: "ARG-QL-002", language: "en", difficulty: "Medium", examProfile: "BANKING_CLASSIC_2X5", seed: "CP013-REVIEW-BANKING-CLASSIC" });
const threeMediumOne = find(
  { cpId: "ARG-CP-013", qlId: "ARG-QL-003", language: "en", difficulty: "Medium", examProfile: "BANKING_COMBO_3X5" },
  (question) => strongCount(question) === 1,
);
const threeMediumTwo = find(
  { cpId: "ARG-CP-013", qlId: "ARG-QL-003", language: "en", difficulty: "Medium", examProfile: "BANKING_COMBO_3X5" },
  (question) => strongCount(question) === 2,
);
const threeHardOne = find(
  { cpId: "ARG-CP-013", qlId: "ARG-QL-006", language: "en", difficulty: "Hard", examProfile: "BANKING_COMBO_3X5" },
  (question) => strongCount(question) === 1,
);
const threeHardTwo = find(
  { cpId: "ARG-CP-013", qlId: "ARG-QL-006", language: "en", difficulty: "Hard", examProfile: "BANKING_COMBO_3X5" },
  (question) => strongCount(question) === 2,
);
const fourOne = find(
  { cpId: "ARG-CP-013", qlId: "ARG-QL-004", language: "en", difficulty: "Hard", examProfile: "BANKING_COMBO_4X5" },
  (question) => strongCount(question) === 1,
);
const fourTwo = find(
  { cpId: "ARG-CP-013", qlId: "ARG-QL-004", language: "en", difficulty: "Hard", examProfile: "BANKING_COMBO_4X5" },
  (question) => strongCount(question) === 2,
);
const fourThree = find(
  { cpId: "ARG-CP-013", qlId: "ARG-QL-004", language: "en", difficulty: "Hard", examProfile: "BANKING_COMBO_4X5" },
  (question) => strongCount(question) === 3,
);
const monitoringHindi = one({ cpId: "ARG-CP-013", qlId: "ARG-QL-005", language: "hi", difficulty: "Hard", examProfile: "BANKING_COMBO_4X5", seed: "CP013-REVIEW-MONITORING-HI" });
const monitoringPunjabi = one({ cpId: "ARG-CP-013", qlId: "ARG-QL-005", language: "pa", difficulty: "Hard", examProfile: "BANKING_COMBO_4X5", seed: "CP013-REVIEW-MONITORING-PA" });
const dueProcess = one({ cpId: "ARG-CP-013", qlId: "ARG-QL-006", language: "en", difficulty: "Hard", examProfile: "BANKING_COMBO_4X5", seed: "CP013-REVIEW-DUE-PROCESS" });

console.log([
  "# ARG-001 CP013 — Final Learner-Facing Review Samples",
  "",
  "Generated directly from the current CP013 Question Studio runtime. Learner release remains locked.",
  "",
  block("1. Core / English / Medium / workshop correlation repair", coreWorkshop),
  block("2. Core / Punjabi / Hard / normalized-score naturalness repair", corePunjabi),
  block("3. SSC 2×4 / English / grievance-contact strong-No repair", grievanceEnglish),
  block("4. SSC 2×4 / Hindi / grievance-contact strong-No repair", grievanceHindi),
  block("5. Banking classic 2×5", bankingClassic),
  block("6. Banking 3×5 / Medium / one strong", threeMediumOne),
  block("7. Banking 3×5 / Medium / two strong", threeMediumTwo),
  block("8. Banking 3×5 / Hard / one strong", threeHardOne),
  block("9. Banking 3×5 / Hard / two strong", threeHardTwo),
  block("10. Banking 4×5 / one strong / distractor diversity", fourOne),
  block("11. Banking 4×5 / two strong", fourTwo),
  block("12. Banking 4×5 / three strong", fourThree),
  block("13. Banking 4×5 / Hindi / monitoring grammar and polarity", monitoringHindi),
  block("14. Banking 4×5 / Punjabi / monitoring grammar and polarity", monitoringPunjabi),
  block("15. Banking 4×5 / English / distinct due-process arguments", dueProcess),
].join("\n"));