import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  QuestionStemBlock,
  StructuredEditorialEntry,
} from "./foundation/editorial-content";

const root = dirname(fileURLToPath(import.meta.url));
const outputDirectory = resolve(
  process.cwd(),
  "dist/quant-v4/pnl-001-multilingual-editorial-audit",
);
mkdirSync(outputDirectory, { recursive: true });

const CP_META = [
  { cpId: "PNL-CP-001", folder: "CP-001", start: 1, count: 36 },
  { cpId: "PNL-CP-002", folder: "CP-002", start: 37, count: 34 },
  { cpId: "PNL-CP-003", folder: "CP-003", start: 71, count: 24 },
  { cpId: "PNL-CP-004", folder: "CP-004", start: 95, count: 26 },
  { cpId: "PNL-CP-005", folder: "CP-005", start: 121, count: 29 },
  { cpId: "PNL-CP-006", folder: "CP-006", start: 150, count: 37 },
] as const;
const LANGUAGES = ["hi", "pa"] as const;
type Language = (typeof LANGUAGES)[number];

type Library = Readonly<{
  archetypeId: "PNL-001";
  cpId: string;
  language: Language | "en";
  entries: Readonly<Record<string, StructuredEditorialEntry>>;
  entryCount: number;
}>;

type Finding = Readonly<{
  code: string;
  severity: "BLOCKER" | "MAJOR" | "MINOR" | "NOTE";
  scope: string;
  message: string;
  owners?: readonly string[];
}>;

type ReviewRow = Readonly<{
  rowNumber: number;
  cpId: string;
  qlId: string;
  language: Language;
  contextFamily: string;
  representation: string;
  stem: string;
  prompt: string;
  opening: string;
  concept: string;
  steps: string;
  conclusion: string;
  commonTrap: string;
  difficulty: string;
  difficultyRationale: string;
  reviewerDecision: string;
  severity: string;
  issueCodes: string;
  reviewerNotes: string;
  replacementStem: string;
  replacementExplanation: string;
}>;

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(file, "utf8")) as T;
}

function qlIdAt(start: number, index: number): string {
  return `PNL-QL-${String(start + index).padStart(3, "0")}`;
}

function blockText(block: QuestionStemBlock): readonly string[] {
  switch (block.type) {
    case "paragraph":
      return [block.content];
    case "table":
      return [
        block.caption ?? "",
        ...block.columns,
        ...(block.rows?.flat() ?? []),
        block.rowSource ? `{${block.rowSource}}` : "",
      ];
    case "caselet":
      return [
        block.title ?? "",
        ...(block.paragraphs ?? []),
        block.paragraphSource ? `{${block.paragraphSource}}` : "",
      ];
    case "statements":
      return [block.lead ?? "", ...block.statements];
    case "data_sufficiency":
      return [block.question, ...block.statements];
    case "equation":
      return [];
  }
}

function stemText(entry: StructuredEditorialEntry): string {
  return [...entry.stem.blocks.flatMap(blockText), entry.stem.prompt]
    .filter(Boolean)
    .join("\n\n");
}

function explanationParagraphs(entry: StructuredEditorialEntry): readonly Readonly<{
  field: string;
  value: string;
}>[] {
  return [
    { field: "opening", value: entry.explanation.opening },
    { field: "concept", value: entry.explanation.concept },
    ...entry.explanation.steps.flatMap((step, index) => [
      { field: `step-${index + 1}-title`, value: step.title },
      { field: `step-${index + 1}-body`, value: step.body },
    ]),
    { field: "conclusion", value: entry.explanation.conclusion },
    { field: "commonTrap", value: entry.explanation.commonTrap ?? "" },
    { field: "shortcut", value: entry.explanation.shortcut ?? "" },
  ].filter((item) => item.value.trim().length > 0);
}

function explanationText(entry: StructuredEditorialEntry): string {
  return explanationParagraphs(entry)
    .map((item) => item.value)
    .join("\n\n");
}

function normalize(value: string): string {
  return value
    .normalize("NFC")
    .toLowerCase()
    .replace(/\{[A-Za-z][A-Za-z0-9_]*\}/g, "{#}")
    .replace(/₹\s*[\d,.]+(?:\.\d+)?/g, "₹#")
    .replace(/\b\d+(?:\.\d+)?%/g, "#%")
    .replace(/\b\d+(?:\.\d+)?\b/g, "#")
    .replace(/[“”"'`]/g, "")
    .replace(/[—–-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value: string): number {
  return value
    .replace(/\{[A-Za-z][A-Za-z0-9_]*\}/g, " ")
    .replace(/[₹%\d.,;:!?()[\]{}+\-*/=<>|]/g, " ")
    .split(/\s+/u)
    .filter(Boolean).length;
}

function representation(entry: StructuredEditorialEntry): string {
  const special = entry.stem.blocks
    .map((block) => block.type)
    .filter((type) => type !== "paragraph");
  return special.length ? [...new Set(special)].join("+").toUpperCase() : "PARAGRAPH";
}

function groupOwners(
  rows: readonly ReviewRow[],
  selector: (row: ReviewRow) => string,
): readonly Readonly<{ value: string; owners: readonly string[] }>[] {
  const groups = new Map<string, Set<string>>();
  for (const row of rows) {
    const value = normalize(selector(row));
    if (!value) continue;
    const owners = groups.get(value) ?? new Set<string>();
    owners.add(row.qlId);
    groups.set(value, owners);
  }
  return [...groups.entries()]
    .map(([value, owners]) => ({ value, owners: [...owners].sort() }))
    .filter((item) => item.owners.length > 1)
    .sort(
      (left, right) =>
        right.owners.length - left.owners.length ||
        left.value.localeCompare(right.value),
    );
}

function csvCell(value: unknown): string {
  const text = String(value ?? "").replace(/\r?\n/g, "\n");
  return `"${text.replace(/"/g, '""')}"`;
}

const fatalFindings: Finding[] = [];
const editorialFindings: Finding[] = [];
const lexicalReviewFindings: Finding[] = [];
const rows: ReviewRow[] = [];
const librariesByLanguage: Record<Language, number> = { hi: 0, pa: 0 };
let rowNumber = 0;

const lexicalPatterns: Readonly<
  Record<Language, readonly Readonly<{ phrase: string; replacementHint: string }>[]> 
> = {
  hi: [
    { phrase: "लक्षित", replacementHint: "Prefer लक्ष्य or मांगा गया result where natural." },
    { phrase: "व्यावसायिक क्रम", replacementHint: "Prefer the concrete transaction order." },
    { phrase: "पुनर्निर्माण", replacementHint: "Prefer वापस निकालना or फिर से बनाना." },
    { phrase: "अज्ञात समूह", replacementHint: "Prefer वह समूह जिसकी दर/मात्रा ज्ञात करनी है." },
  ],
  pa: [
    { phrase: "ਲਕਸ਼ਿਤ", replacementHint: "Prefer ਟੀਚਾ or ਮੰਗਿਆ ਨਤੀਜਾ." },
    { phrase: "ਵਪਾਰਕ ਕ੍ਰਮ", replacementHint: "Prefer the concrete sale/order wording." },
    { phrase: "ਪੁਨਰਨਿਰਮਾਣ", replacementHint: "Prefer ਵਾਪਸ ਕੱਢੋ or ਮੁੜ ਬਣਾਓ." },
    { phrase: "ਪਰਯਾਪਤਾ", replacementHint: "Prefer ਕਥਨਾਂ ਵਿੱਚ ਕਾਫ਼ੀ ਜਾਣਕਾਰੀ." },
  ],
};

for (const meta of CP_META) {
  const english = readJson<Library>(join(root, meta.folder, "editorial-content.en.json"));
  for (const language of LANGUAGES) {
    const library = readJson<Library>(
      join(root, meta.folder, `editorial-content.${language}.json`),
    );
    librariesByLanguage[language] += 1;

    if (library.entryCount !== meta.count) {
      fatalFindings.push({
        code: "ENTRY-COUNT-MISMATCH",
        severity: "BLOCKER",
        scope: `${meta.cpId}/${language}`,
        message: `Expected ${meta.count} entries, found ${library.entryCount}.`,
      });
    }

    for (let index = 0; index < meta.count; index += 1) {
      const qlId = qlIdAt(meta.start, index);
      const entry = library.entries[qlId];
      const englishEntry = english.entries[qlId];
      if (!entry || !englishEntry) {
        fatalFindings.push({
          code: "MISSING-ENTRY",
          severity: "BLOCKER",
          scope: `${meta.cpId}/${qlId}/${language}`,
          message: "The native or English source entry is missing.",
        });
        continue;
      }

      rowNumber += 1;
      const stem = stemText(entry);
      const explanation = explanationText(entry);
      const nativeScript =
        language === "hi" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
      const englishWords = [
        ...`${stem} ${explanation}`
          .replace(/\{[A-Za-z][A-Za-z0-9_]*\}/g, " ")
          .matchAll(/\b[A-Za-z][A-Za-z'-]{3,}\b/g),
      ].map((match) => match[0]);

      if (!nativeScript.test(`${stem} ${explanation}`)) {
        fatalFindings.push({
          code: "NATIVE-SCRIPT-MISSING",
          severity: "BLOCKER",
          scope: `${qlId}/${language}`,
          message: "The native source contains no expected script characters.",
        });
      }
      if (entry.explanation.steps.length !== englishEntry.explanation.steps.length) {
        fatalFindings.push({
          code: "STEP-COUNT-PARITY",
          severity: "BLOCKER",
          scope: `${qlId}/${language}`,
          message: `Native explanation has ${entry.explanation.steps.length} steps; English has ${englishEntry.explanation.steps.length}.`,
        });
      }
      if (representation(entry) !== representation(englishEntry)) {
        fatalFindings.push({
          code: "REPRESENTATION-PARITY",
          severity: "BLOCKER",
          scope: `${qlId}/${language}`,
          message: `Native representation ${representation(entry)} differs from English ${representation(englishEntry)}.`,
        });
      }
      if (wordCount(explanation) < 55) {
        editorialFindings.push({
          code: "SHALLOW-NATIVE-EXPLANATION",
          severity: "MAJOR",
          scope: `${qlId}/${language}`,
          message: `Explanation contains only ${wordCount(explanation)} native-language words.`,
        });
      }
      if (englishWords.length) {
        editorialFindings.push({
          code: "ENGLISH-PROSE-LEAKAGE",
          severity: "MAJOR",
          scope: `${qlId}/${language}`,
          message: `English prose remains: ${[...new Set(englishWords)].join(", ")}.`,
        });
      }

      for (const item of lexicalPatterns[language]) {
        if (`${stem} ${explanation}`.includes(item.phrase)) {
          lexicalReviewFindings.push({
            code: "FORMAL-OR-TECHNICAL-WORDING",
            severity: "NOTE",
            scope: `${qlId}/${language}`,
            message: `${item.phrase}: ${item.replacementHint}`,
          });
        }
      }

      rows.push({
        rowNumber,
        cpId: meta.cpId,
        qlId,
        language,
        contextFamily: entry.stem.contextFamily,
        representation: representation(entry),
        stem,
        prompt: entry.stem.prompt,
        opening: entry.explanation.opening,
        concept: entry.explanation.concept,
        steps: entry.explanation.steps
          .map((step, stepIndex) =>
            `${stepIndex + 1}. ${step.title}: ${step.body}`,
          )
          .join("\n"),
        conclusion: entry.explanation.conclusion,
        commonTrap: entry.explanation.commonTrap ?? "",
        difficulty: entry.difficulty,
        difficultyRationale: entry.difficultyRationale,
        reviewerDecision: "PENDING",
        severity: "",
        issueCodes: "",
        reviewerNotes: "",
        replacementStem: "",
        replacementExplanation: "",
      });
    }
  }
}

const repeatedMetrics: Record<string, unknown> = {};
for (const language of LANGUAGES) {
  const languageRows = rows.filter((row) => row.language === language);
  const selectors = [
    { field: "stem", threshold: 3, severity: "MAJOR" as const },
    { field: "opening", threshold: 6, severity: "MINOR" as const },
    { field: "concept", threshold: 6, severity: "MINOR" as const },
    { field: "conclusion", threshold: 6, severity: "MINOR" as const },
    { field: "commonTrap", threshold: 6, severity: "MINOR" as const },
  ] as const;

  for (const selector of selectors) {
    const duplicates = groupOwners(
      languageRows,
      (row) => row[selector.field],
    ).filter((item) => item.owners.length >= selector.threshold);
    repeatedMetrics[`${language}.${selector.field}`] = duplicates;
    for (const duplicate of duplicates) {
      editorialFindings.push({
        code: `REPEATED-${selector.field.toUpperCase()}`,
        severity: selector.severity,
        scope: `${language}/${duplicate.owners.length} QLs`,
        message: duplicate.value,
        owners: duplicate.owners,
      });
    }
  }

  const stepTitles = languageRows.flatMap((row) =>
    row.steps
      .split("\n")
      .map((step) => step.replace(/^\d+\.\s*/, "").split(":")[0] ?? "")
      .filter(Boolean)
      .map((value) => ({ ...row, steps: value })),
  );
  const repeatedStepTitles = groupOwners(stepTitles, (row) => row.steps).filter(
    (item) => item.owners.length >= 10,
  );
  repeatedMetrics[`${language}.stepTitles`] = repeatedStepTitles;
  for (const duplicate of repeatedStepTitles) {
    editorialFindings.push({
      code: "REPEATED-STEP-TITLE",
      severity: "MINOR",
      scope: `${language}/${duplicate.owners.length} QLs`,
      message: duplicate.value,
      owners: duplicate.owners,
    });
  }
}

const codeCounts = (findings: readonly Finding[]) =>
  Object.entries(
    findings.reduce<Record<string, number>>((output, finding) => {
      output[finding.code] = (output[finding.code] ?? 0) + 1;
      return output;
    }, {}),
  )
    .map(([value, count]) => ({ value, count }))
    .sort((left, right) => right.count - left.count || left.value.localeCompare(right.value));

const metrics = {
  packageId: "PNL-001",
  languages: LANGUAGES,
  cpCount: CP_META.length,
  qlCountPerLanguage: 186,
  reviewRows: rows.length,
  librariesByLanguage,
  fatalFindingCount: fatalFindings.length,
  editorialFindingCount: editorialFindings.length,
  lexicalReviewFindingCount: lexicalReviewFindings.length,
  fatalCodeCounts: codeCounts(fatalFindings),
  editorialCodeCounts: codeCounts(editorialFindings),
  lexicalCodeCounts: codeCounts(lexicalReviewFindings),
  repeatedMetrics,
  auditStatus:
    fatalFindings.length > 0
      ? "STRUCTURAL_FAIL"
      : editorialFindings.length > 0 || lexicalReviewFindings.length > 0
        ? "REVIEW_REQUIRED"
        : "PASS",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
};

const findings = {
  fatalFindings,
  editorialFindings,
  lexicalReviewFindings,
};

const headers: readonly (keyof ReviewRow)[] = [
  "rowNumber",
  "cpId",
  "qlId",
  "language",
  "contextFamily",
  "representation",
  "stem",
  "prompt",
  "opening",
  "concept",
  "steps",
  "conclusion",
  "commonTrap",
  "difficulty",
  "difficultyRationale",
  "reviewerDecision",
  "severity",
  "issueCodes",
  "reviewerNotes",
  "replacementStem",
  "replacementExplanation",
];
const csv = [
  headers.map(csvCell).join(","),
  ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")),
].join("\n");

writeFileSync(
  join(outputDirectory, "pnl-001-multilingual-editorial-review.csv"),
  `${csv}\n`,
);
writeFileSync(
  join(outputDirectory, "pnl-001-multilingual-editorial-findings.json"),
  `${JSON.stringify(findings, null, 2)}\n`,
);
writeFileSync(
  join(outputDirectory, "pnl-001-multilingual-editorial-metrics.json"),
  `${JSON.stringify(metrics, null, 2)}\n`,
);

console.log(JSON.stringify(metrics, null, 2));
