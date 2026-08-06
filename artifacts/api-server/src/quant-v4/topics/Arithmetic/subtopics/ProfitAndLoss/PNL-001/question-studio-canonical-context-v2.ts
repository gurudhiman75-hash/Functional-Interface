import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  renderFriendlyExplanationMarkdown,
  renderStructuredStemMarkdown,
  type StructuredEditorialEntry,
} from "./foundation/editorial-content";
import {
  recoverPnl001CanonicalContext as recoverBaseCanonicalContext,
  unresolvedPnl001ProsePlaceholders,
  type Pnl001CanonicalContextRecovery,
} from "./question-studio-canonical-context";
import { PNL_001_CANONICAL_REVIEW_LIBRARY } from "./question-studio-review.library";

const OVERRIDE_QL_ID = "PNL-QL-092" as const;

export type Pnl001CanonicalContextV2Recovery = Omit<
  Pnl001CanonicalContextRecovery,
  "canonicalStemMode"
> &
  Readonly<{
    canonicalStemMode:
      | Pnl001CanonicalContextRecovery["canonicalStemMode"]
      | "CANONICAL_PROSE_OVERRIDE";
  }>;

type CanonicalEntry = Pnl001CanonicalContextRecovery["canonicalEntry"];
type EditorialLibrary = Readonly<{
  entries: Readonly<Record<string, StructuredEditorialEntry>>;
}>;

function locatePnlRoot(): string {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    moduleDir,
    join(moduleDir, ".."),
    join(
      process.cwd(),
      "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001",
    ),
    join(
      process.cwd(),
      "src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001",
    ),
  ];
  for (const candidate of candidates) {
    if (existsSync(join(candidate, "CP-003", "editorial-content.en.json"))) {
      return candidate;
    }
  }
  throw new Error("Unable to locate PNL-001 CP-003 editorial authority.");
}

function canonicalEntryForQl092(): CanonicalEntry {
  const library = PNL_001_CANONICAL_REVIEW_LIBRARY as Readonly<{
    entries: Readonly<Record<string, CanonicalEntry>>;
  }>;
  const entry = library.entries[OVERRIDE_QL_ID];
  if (!entry) throw new Error(`${OVERRIDE_QL_ID}: canonical review entry missing.`);
  return entry;
}

function englishEntryForQl092(): StructuredEditorialEntry {
  const root = locatePnlRoot();
  const library = JSON.parse(
    readFileSync(join(root, "CP-003", "editorial-content.en.json"), "utf8"),
  ) as EditorialLibrary;
  const entry = library.entries[OVERRIDE_QL_ID];
  if (!entry) throw new Error(`${OVERRIDE_QL_ID}: English editorial entry missing.`);
  return entry;
}

function recoverQl092CanonicalContext(): Pnl001CanonicalContextV2Recovery {
  const canonicalEntry = canonicalEntryForQl092();
  const englishEntry = englishEntryForQl092();
  if (canonicalEntry.cpId !== "PNL-CP-003") {
    throw new Error(`${OVERRIDE_QL_ID}: canonical CP ownership changed.`);
  }
  if (
    canonicalEntry.options.length !== 4 ||
    new Set(canonicalEntry.options).size !== 4 ||
    canonicalEntry.options[canonicalEntry.correctIndex] !== canonicalEntry.answer
  ) {
    throw new Error(`${OVERRIDE_QL_ID}: canonical keyed-answer contract is invalid.`);
  }

  const exactPattern = /^Can the unit selling price required on the remaining stock for an overall ([^%\n]+)% ([^?\n]+) be determined\?\n\n\*\*Statement 1:\*\* ([^\n]+)\n\n\*\*Statement 2:\*\* ([^\n]+)\n\nUse the standard two-statement data-sufficiency answer scheme\.\n\nDecide whether either statement alone or both together are sufficient\.$/u;
  const match = exactPattern.exec(canonicalEntry.stem);
  if (!match) {
    throw new Error(
      `${OVERRIDE_QL_ID}: canonical prose override no longer matches the approved fixture.`,
    );
  }

  const context = {
    targetRatePercent: match[1]!.trim(),
    targetDirection: match[2]!.trim(),
    statementOne: match[3]!.trim(),
    statementTwo: match[4]!.trim(),
  } as const;
  const currentEnglishStem = renderStructuredStemMarkdown(
    englishEntry.stem,
    context,
  );
  const currentEnglishExplanation = renderFriendlyExplanationMarkdown(
    englishEntry.explanation,
    context,
  );
  const unresolved = unresolvedPnl001ProsePlaceholders(
    `${currentEnglishStem}\n${currentEnglishExplanation}`,
  );
  if (unresolved.length > 0) {
    throw new Error(
      `${OVERRIDE_QL_ID}: canonical prose override leaves unresolved fields: ${unresolved.join(", ")}.`,
    );
  }

  return {
    qlId: OVERRIDE_QL_ID,
    cpId: "PNL-CP-003",
    context,
    canonicalEntry,
    englishEntry,
    currentEnglishStem,
    currentEnglishExplanation,
    canonicalStemMode: "CANONICAL_PROSE_OVERRIDE",
    rowSources: [],
    paragraphSources: [],
  };
}

export function recoverPnl001CanonicalContextV2(
  qlId: string,
): Pnl001CanonicalContextV2Recovery {
  if (qlId === OVERRIDE_QL_ID) return recoverQl092CanonicalContext();
  return recoverBaseCanonicalContext(qlId);
}

export function recoverAllPnl001CanonicalContextsV2(): readonly Pnl001CanonicalContextV2Recovery[] {
  return Array.from({ length: 186 }, (_, index) =>
    recoverPnl001CanonicalContextV2(
      `PNL-QL-${String(index + 1).padStart(3, "0")}`,
    ),
  );
}

export { unresolvedPnl001ProsePlaceholders };
