import fs from "node:fs";
import path from "node:path";
import {
  generateEcoCp001LocalizedReviewV1,
  generateEcoCp002LocalizedReviewV1,
  generateEcoCp003LocalizedReviewV1,
  generateEcoCp004LocalizedReviewV1,
  generateEcoCp005LocalizedReviewV1,
  generateEcoCp006LocalizedReviewV1,
  generateEcoCp007LocalizedReviewV1,
  generateEcoCp008LocalizedReviewV1,
  generateEcoCp009LocalizedReviewV1,
  generateEcoCp010LocalizedReviewV1,
  generateEcoCp011LocalizedReviewV1,
  generateEcoCp012LocalizedReviewV1,
  generateEcoCp013LocalizedReviewV1,
  generateEcoCp014LocalizedReviewV1,
  generateEcoCp015LocalizedReviewV1,
  generateEcoCp016LocalizedReviewV1,
  generateEcoCp017LocalizedReviewV1,
  generateEcoCp018LocalizedReviewV1,
  generateEcoCp019LocalizedReviewV1,
  generateEcoCp020LocalizedReviewV1,
  generateEcoCp021LocalizedReviewV1,
  generateEcoCp022LocalizedReviewV1,
  generateEcoCp023LocalizedReviewV1,
  generateEcoCp024LocalizedReviewV1,
  generateEcoCp025LocalizedReviewV1,
  generateEcoCp026LocalizedReviewV1,
  generateEcoCp027LocalizedReviewV1,
  generateEcoCp028LocalizedReviewV1,
} from "./eco-localization-generator-v1";
import type { EcoLocaleV1, EcoLocalizedQuestionV1 } from "./eco-localization-types-v1";

const labels: Record<EcoLocaleV1, string> = { en: "English", hi: "Hindi", pa: "Punjabi" };
const locales: EcoLocaleV1[] = ["en", "hi", "pa"];
const targetDir = path.resolve("dist/economy-review/ECO-MULTILINGUAL-V1");
fs.mkdirSync(targetDir, { recursive: true });

type Cp = "ECO-CP-001" | "ECO-CP-002" | "ECO-CP-003" | "ECO-CP-004" | "ECO-CP-005" | "ECO-CP-006" | "ECO-CP-007" | "ECO-CP-008" | "ECO-CP-009" | "ECO-CP-010" | "ECO-CP-011" | "ECO-CP-012" | "ECO-CP-013" | "ECO-CP-014" | "ECO-CP-015" | "ECO-CP-016" | "ECO-CP-017" | "ECO-CP-018" | "ECO-CP-019" | "ECO-CP-020" | "ECO-CP-021" | "ECO-CP-022" | "ECO-CP-023" | "ECO-CP-024" | "ECO-CP-025" | "ECO-CP-026" | "ECO-CP-027" | "ECO-CP-028";

function renderQuestion(question: EcoLocalizedQuestionV1, index: number): string[] {
  const out = [`**${index + 1}. ${question.stem}**`];
  question.options.forEach((option, optionIndex) => out.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
  out.push(`**Answer:** ${String.fromCharCode(65 + question.correctIndex)} — ${question.canonicalAnswer}`);
  out.push(`**Explanation:** ${question.explanation}`, "");
  return out;
}

function questionsFor(cp: Cp, locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  if (cp === "ECO-CP-001") return generateEcoCp001LocalizedReviewV1(locale);
  if (cp === "ECO-CP-002") return generateEcoCp002LocalizedReviewV1(locale);
  if (cp === "ECO-CP-003") return generateEcoCp003LocalizedReviewV1(locale);
  if (cp === "ECO-CP-004") return generateEcoCp004LocalizedReviewV1(locale);
  if (cp === "ECO-CP-005") return generateEcoCp005LocalizedReviewV1(locale);
  if (cp === "ECO-CP-006") return generateEcoCp006LocalizedReviewV1(locale);
  if (cp === "ECO-CP-007") return generateEcoCp007LocalizedReviewV1(locale);
  if (cp === "ECO-CP-008") return generateEcoCp008LocalizedReviewV1(locale);
  if (cp === "ECO-CP-009") return generateEcoCp009LocalizedReviewV1(locale);
  if (cp === "ECO-CP-010") return generateEcoCp010LocalizedReviewV1(locale);
  if (cp === "ECO-CP-011") return generateEcoCp011LocalizedReviewV1(locale);
  if (cp === "ECO-CP-012") return generateEcoCp012LocalizedReviewV1(locale);
  if (cp === "ECO-CP-013") return generateEcoCp013LocalizedReviewV1(locale);
  if (cp === "ECO-CP-014") return generateEcoCp014LocalizedReviewV1(locale);
  if (cp === "ECO-CP-015") return generateEcoCp015LocalizedReviewV1(locale);
  if (cp === "ECO-CP-016") return generateEcoCp016LocalizedReviewV1(locale);
  if (cp === "ECO-CP-017") return generateEcoCp017LocalizedReviewV1(locale);
  if (cp === "ECO-CP-018") return generateEcoCp018LocalizedReviewV1(locale);
  if (cp === "ECO-CP-019") return generateEcoCp019LocalizedReviewV1(locale);
  if (cp === "ECO-CP-020") return generateEcoCp020LocalizedReviewV1(locale);
  if (cp === "ECO-CP-021") return generateEcoCp021LocalizedReviewV1(locale);
  if (cp === "ECO-CP-022") return generateEcoCp022LocalizedReviewV1(locale);
  if (cp === "ECO-CP-023") return generateEcoCp023LocalizedReviewV1(locale);
  if (cp === "ECO-CP-024") return generateEcoCp024LocalizedReviewV1(locale);
  if (cp === "ECO-CP-025") return generateEcoCp025LocalizedReviewV1(locale);
  if (cp === "ECO-CP-026") return generateEcoCp026LocalizedReviewV1(locale);
  if (cp === "ECO-CP-027") return generateEcoCp027LocalizedReviewV1(locale);
  return generateEcoCp028LocalizedReviewV1(locale);
}

function materialize(cps: readonly Cp[], title: string, filename: string) {
  const out: string[] = [
    `# Economy Multilingual V1 — ${title} Review`,
    "",
    "Review-only candidate. Frozen English review batches remain semantic authority. Hindi and Punjabi preserve CP, QL, difficulty, source provenance, option order and correct-index parity.",
    "",
  ];

  for (const cp of cps) {
    out.push(`## ${cp}`, "");
    for (const locale of locales) {
      out.push(`### ${labels[locale]}`, "");
      questionsFor(cp, locale).forEach((question, index) => out.push(...renderQuestion(question, index)));
    }
  }

  const target = path.join(targetDir, filename);
  fs.writeFileSync(target, out.join("\n"));
  console.log(target);
}

materialize(["ECO-CP-001", "ECO-CP-002"], "CP001–CP002", "ECO-MULTILINGUAL-V1-CP001-CP002-REVIEW.md");
materialize(["ECO-CP-003", "ECO-CP-004"], "CP003–CP004", "ECO-MULTILINGUAL-V1-CP003-CP004-REVIEW.md");
materialize(["ECO-CP-005", "ECO-CP-006"], "CP005–CP006", "ECO-MULTILINGUAL-V1-CP005-CP006-REVIEW.md");

materialize(["ECO-CP-007", "ECO-CP-008"], "CP007–CP008", "ECO-MULTILINGUAL-V1-CP007-CP008-REVIEW.md");

materialize(["ECO-CP-009", "ECO-CP-010"], "CP009–CP010", "ECO-MULTILINGUAL-V1-CP009-CP010-REVIEW.md");

materialize(["ECO-CP-011", "ECO-CP-012"], "CP011–CP012", "ECO-MULTILINGUAL-V1-CP011-CP012-REVIEW.md");

materialize(["ECO-CP-013", "ECO-CP-014"], "CP013–CP014", "ECO-MULTILINGUAL-V1-CP013-CP014-REVIEW.md");

materialize(["ECO-CP-015", "ECO-CP-016"], "CP015–CP016", "ECO-MULTILINGUAL-V1-CP015-CP016-REVIEW.md");

materialize(["ECO-CP-017", "ECO-CP-018"], "CP017–CP018", "ECO-MULTILINGUAL-V1-CP017-CP018-REVIEW.md");

materialize(["ECO-CP-019", "ECO-CP-020"], "CP019–CP020", "ECO-MULTILINGUAL-V1-CP019-CP020-REVIEW.md");

materialize(["ECO-CP-021", "ECO-CP-022", "ECO-CP-023"], "CP021–CP023", "ECO-MULTILINGUAL-V1-CP021-CP023-REVIEW.md");

materialize(["ECO-CP-024", "ECO-CP-025", "ECO-CP-026", "ECO-CP-027", "ECO-CP-028"], "CP024–CP028 Coverage Gap Closure", "ECO-MULTILINGUAL-V1-CP024-CP028-REVIEW.md");
