import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  listProbabilityMl05QlEntries,
  runProbabilityNativePreview,
  type ProbabilityMultilingualPreview,
} from "./multilingual-runtime";
import type { ProbabilityNativeLanguage } from "./multilingual-foundation";
import type { ProbabilityPackageId } from "./shared/types";

const OUTPUT_DIR = join(import.meta.dirname, "review");
const LANGUAGES: readonly ProbabilityNativeLanguage[] = ["hi", "pa"];
const PACKAGES: readonly ProbabilityPackageId[] = ["PRB-001", "PRB-002"];
const EXPECTED_COUNTS: Record<ProbabilityPackageId, number> = {
  "PRB-001": 120,
  "PRB-002": 96,
};

const LANGUAGE_META: Record<ProbabilityNativeLanguage, Readonly<{ label: string; filenameLabel: string }>> = {
  hi: { label: "Hindi", filenameLabel: "HINDI" },
  pa: { label: "Punjabi", filenameLabel: "PUNJABI" },
};

function optionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

function cleanLine(value: string): string {
  return value.replace(/\r\n?/gu, "\n").trim();
}

function reviewChecklist(language: ProbabilityNativeLanguage): string[] {
  const nativeLabel = LANGUAGE_META[language].label;
  return [
    `- [ ] ${nativeLabel} stem is natural, concise and exam-like.`,
    "- [ ] Mathematical meaning matches the English authority exactly.",
    "- [ ] Options are logically correct and the marked answer is unambiguous.",
    `- [ ] ${nativeLabel} explanation is easy for a student to understand.`,
    "- [ ] No awkward literal translation, wrong terminology or unintended English prose leakage.",
    "- [ ] Any visual title/alt text is natural and preserves the event meaning.",
  ];
}

function renderVisuals(preview: ProbabilityMultilingualPreview): string[] {
  const visuals = preview.presentation.explanation.visuals;
  if (!visuals.length) return ["**Native visuals:** None"];
  const lines = ["**Native visuals:**"];
  for (const visual of visuals) {
    lines.push(`- **${visual.strategyId}** — ${cleanLine(visual.title)}`);
    lines.push(`  - Alt: ${cleanLine(visual.altText)}`);
  }
  return lines;
}

function renderQuestion(
  preview: ProbabilityMultilingualPreview,
  ordinal: number,
): string {
  const { source, presentation, parity } = preview;
  const correctLabel = optionLabel(presentation.correctIndex);
  const correctOption = presentation.options[presentation.correctIndex] ?? presentation.answer;
  const lines: string[] = [];

  lines.push(`## ${ordinal}. ${source.questionLanguageId} — ${source.canonicalProblemId} — ${source.difficultyBand}`);
  lines.push("");
  lines.push(`- **Package:** ${source.packageId}`);
  lines.push(`- **Exam profile:** ${source.examProfile}`);
  lines.push(`- **Deterministic review seed:** \`${source.seed}\``);
  lines.push(`- **Parameter fingerprint:** \`${source.parameterFingerprint}\``);
  lines.push(`- **Mathematical fingerprint:** \`${source.mathematicalFingerprint}\``);
  if (source.packageId === "PRB-001" && (source.questionLanguageId === "PRB-QL-004" || source.questionLanguageId === "PRB-QL-010")) {
    lines.push("- **Use note:** Learning-only QL; review language quality, but it remains excluded from scored storage.");
  }
  lines.push("");
  lines.push("### English source authority");
  lines.push("");
  lines.push(cleanLine(source.stem));
  lines.push("");
  lines.push("### Native question to review");
  lines.push("");
  lines.push(cleanLine(presentation.stem));
  lines.push("");
  lines.push("### Options");
  lines.push("");
  presentation.options.forEach((option, index) => {
    lines.push(`- **${optionLabel(index)}.** ${cleanLine(option)}`);
  });
  lines.push("");
  lines.push(`**Correct answer:** ${correctLabel}. ${cleanLine(correctOption)}`);
  lines.push("");
  lines.push(`**English-runtime answer value:** ${cleanLine(presentation.answer)}`);
  lines.push("");
  lines.push("### Native explanation to review");
  lines.push("");
  presentation.explanation.lines.forEach((line, index) => {
    lines.push(`${index + 1}. ${cleanLine(line)}`);
  });
  lines.push("");
  lines.push("### English explanation authority");
  lines.push("");
  source.explanation.lines.forEach((line, index) => {
    lines.push(`${index + 1}. ${cleanLine(line)}`);
  });
  lines.push("");
  lines.push(...renderVisuals(preview));
  lines.push("");
  lines.push("### Parity evidence");
  lines.push("");
  lines.push(`- Options preserved: **${parity.exactOptionsPreserved ? "YES" : "NO"}**`);
  lines.push(`- Correct index preserved: **${parity.correctIndexPreserved ? "YES" : "NO"}**`);
  lines.push(`- Answer preserved: **${parity.answerPreserved ? "YES" : "NO"}**`);
  lines.push(`- Solver authority: **${parity.solverAuthority}**`);
  lines.push(`- Answer-key authority: **${parity.answerKeyAuthority}**`);
  lines.push("");
  lines.push("### Human review checklist");
  lines.push("");
  lines.push(...reviewChecklist(presentation.language));
  lines.push("");
  lines.push("**Decision:** [ ] APPROVED  [ ] CHANGES_REQUIRED");
  lines.push("");
  lines.push("**Reviewer:** ____________________");
  lines.push("");
  lines.push("**Review date:** ____________________");
  lines.push("");
  lines.push("**Notes / required correction:**");
  lines.push("");
  lines.push("> ");
  lines.push("");
  lines.push("---");
  lines.push("");

  return lines.join("\n");
}

function renderFile(
  packageId: ProbabilityPackageId,
  language: ProbabilityNativeLanguage,
  previews: readonly ProbabilityMultilingualPreview[],
): string {
  const languageLabel = LANGUAGE_META[language].label;
  const lines: string[] = [
    `# ${packageId} — ${languageLabel} Native Question Review`,
    "",
    `> ExamTree Probability ML-06 human-review file. Contains all ${previews.length} rendered ${languageLabel} QLs for ${packageId}.`,
    "> Each item is generated from the frozen English Probability runtime and then rendered through the ML-05 native presentation overlay.",
    "> The English runtime remains the sole mathematical, solver, options and answer-key authority.",
    "",
    "## Review status",
    "",
    "- **Editorial status:** PENDING HUMAN REVIEW",
    "- **Question Bank:** NOT STORED",
    "- **Scored mocks:** DISABLED",
    "- **Student/public release:** DISABLED",
    `- **QLs in this file:** ${previews.length}`,
    "- **Required action:** mark each item APPROVED or CHANGES_REQUIRED and add reviewer/date evidence.",
    "",
    "## Review method",
    "",
    "Review the native question against the English authority immediately above it. Focus on natural exam wording, exact mathematical meaning, correct terminology, option logic, and student-friendly explanation quality. Do not approve merely because automated parity passed.",
    "",
    "---",
    "",
  ];

  previews.forEach((preview, index) => lines.push(renderQuestion(preview, index + 1)));
  return lines.join("\n");
}

function assertPreview(preview: ProbabilityMultilingualPreview): void {
  const { source, presentation, parity } = preview;
  if (!source.validation.valid || !presentation.validation.valid) {
    throw new Error(`${source.questionLanguageId}/${presentation.language}: invalid review source.`);
  }
  if (!parity.exactOptionsPreserved || !parity.correctIndexPreserved || !parity.answerPreserved) {
    throw new Error(`${source.questionLanguageId}/${presentation.language}: parity contract failed.`);
  }
  if (source.options.length !== presentation.options.length || source.correctIndex !== presentation.correctIndex || source.answer !== presentation.answer) {
    throw new Error(`${source.questionLanguageId}/${presentation.language}: answer-key parity drift.`);
  }
  if (source.options.some((option, index) => option !== presentation.options[index])) {
    throw new Error(`${source.questionLanguageId}/${presentation.language}: option byte parity drift.`);
  }
}

mkdirSync(OUTPUT_DIR, { recursive: true });

const entries = listProbabilityMl05QlEntries();
const sourceFingerprints = new Map<string, string>();
let totalGenerated = 0;

for (const packageId of PACKAGES) {
  const packageEntries = entries.filter((entry) => entry.packageId === packageId);
  if (packageEntries.length !== EXPECTED_COUNTS[packageId]) {
    throw new Error(`${packageId}: expected ${EXPECTED_COUNTS[packageId]} QLs, found ${packageEntries.length}.`);
  }

  for (const language of LANGUAGES) {
    const previews = packageEntries.map((entry) => {
      const seed = `ml06-human-review:${entry.qlId}`;
      const preview = runProbabilityNativePreview(entry.packageId, entry.cpId, language, {
        questionLanguageId: entry.qlId,
        seed,
      });
      assertPreview(preview);

      const sourceKey = `${entry.packageId}:${entry.qlId}`;
      const sourceIdentity = `${preview.source.parameterFingerprint}:${preview.source.mathematicalFingerprint}:${JSON.stringify(preview.source.options)}:${preview.source.correctIndex}:${preview.source.answer}`;
      const previous = sourceFingerprints.get(sourceKey);
      if (previous && previous !== sourceIdentity) {
        throw new Error(`${sourceKey}: Hindi/Punjabi review files do not share the same English source instance.`);
      }
      sourceFingerprints.set(sourceKey, sourceIdentity);
      return preview;
    });

    const filename = `${packageId}-${LANGUAGE_META[language].filenameLabel}-${previews.length}Q-REVIEW.md`;
    writeFileSync(join(OUTPUT_DIR, filename), renderFile(packageId, language, previews), "utf8");
    totalGenerated += previews.length;
    console.log(`WROTE ${filename}: ${previews.length} QLs`);
  }
}

if (totalGenerated !== 432) {
  throw new Error(`Expected 432 native review surfaces, generated ${totalGenerated}.`);
}

console.log(`Probability ML-06 review Markdown generation complete: ${totalGenerated}/432 native surfaces.`);
