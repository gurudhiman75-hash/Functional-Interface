import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type RegistryEntry = Readonly<{
  solveMode: string;
  answerSemantic: string;
  requiredVariables: readonly string[];
  difficulty: string;
  representation?: string;
  presentation?: string;
}>;

type RegistryFile = Readonly<{
  cpId: string;
  entries: Readonly<Record<string, RegistryEntry>>;
}>;

type EditorialEntry = Readonly<{
  stem: Readonly<{
    contextFamily: string;
    blocks: readonly Readonly<Record<string, unknown>>[];
    prompt: string;
  }>;
  explanation: Readonly<{
    opening: string;
    concept: string;
    steps: readonly Readonly<{ title: string; body: string; equationLatex?: string }>[];
    conclusion: string;
    commonTrap?: string;
    shortcut?: string;
    finalAnswerLatex?: string;
  }>;
  difficulty: string;
}>;

type EditorialLibrary = Readonly<{
  cpId: string;
  language: string;
  entryCount: number;
  entries: Readonly<Record<string, EditorialEntry>>;
}>;

const root = dirname(fileURLToPath(import.meta.url));
const languages = ["en", "hi", "pa"] as const;
const expected = {
  "CP-001": { start: 1, end: 36, count: 36 },
  "CP-002": { start: 37, end: 70, count: 34 },
  "CP-003": { start: 71, end: 94, count: 24 },
  "CP-004": { start: 95, end: 120, count: 26 },
  "CP-005": { start: 121, end: 149, count: 29 },
  "CP-006": { start: 150, end: 186, count: 37 },
} as const;

const structuredVariableMigrations: Readonly<Record<string, Readonly<{
  aggregate: string;
  absorbed: readonly string[];
}>>> = {
  "PNL-QL-145": {
    aggregate: "schemeTable",
    absorbed: ["firstScheme", "secondScheme"],
  },
};

const syntheticOpenings = {
  en: /^(?:During this\b|Consider this\b|Use the following information\b|The following commercial records\b|This .+? transaction is described below\b)/u,
  hi: /^(?:.+? से जुड़े एक व्यावहारिक प्रश्न|.+? के एक वास्तविक व्यावसायिक रिकॉर्ड|.+? की मूल्य-निर्धारण स्थिति नीचे|निम्न विवरण .+? से जुड़े एक लेन-देन|.+? के दिए गए आंकड़ों का उपयोग)/u,
  pa: /^(?:.+? ਨਾਲ ਜੁੜੇ ਇੱਕ ਵਿਆਵਹਾਰਿਕ ਪ੍ਰਸ਼ਨ|.+? ਦੇ ਇੱਕ ਅਸਲ ਵਪਾਰਕ ਰਿਕਾਰਡ|.+? ਦੀ ਕੀਮਤ-ਨਿਰਧਾਰਨ ਸਥਿਤੀ ਹੇਠਾਂ|ਹੇਠਾਂ ਦਿੱਤਾ ਵੇਰਵਾ .+? ਨਾਲ ਜੁੜੇ ਇੱਕ ਲੈਣ-ਦੇਣ|.+? ਦੇ ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਦੀ ਵਰਤੋਂ)/u,
} as const;

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function qlNumber(qlId: string): number {
  const value = Number(qlId.split("-").at(-1));
  assert.ok(Number.isInteger(value), `Invalid QL id: ${qlId}`);
  return value;
}

function collectStrings(value: unknown, output: string[] = []): string[] {
  if (typeof value === "string") output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, output));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, output));
  return output;
}

function placeholderSet(value: unknown): Set<string> {
  const result = new Set<string>();
  for (const text of collectStrings(value)) {
    for (const match of text.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)) result.add(match[1]);
  }
  return result;
}

function stemVariableSet(entry: EditorialEntry, requiredVariables: readonly string[]): Set<string> {
  const result = placeholderSet(entry.stem.prompt);
  const registered = new Set(requiredVariables);
  for (const block of entry.stem.blocks) {
    const candidates = placeholderSet(block);
    if (block.type === "equation") {
      for (const variable of candidates) {
        if (registered.has(variable)) result.add(variable);
      }
    } else {
      for (const variable of candidates) result.add(variable);
    }
    for (const key of ["rowSource", "paragraphSource"] as const) {
      const source = block[key];
      if (typeof source === "string" && /^[A-Za-z][A-Za-z0-9_]*$/.test(source)) result.add(source);
    }
  }
  return result;
}

function expectedStemVariableSet(
  qlId: string,
  requiredVariables: readonly string[],
  actualVariables: ReadonlySet<string>,
): Set<string> {
  const result = new Set(requiredVariables);
  const migration = structuredVariableMigrations[qlId];
  if (
    migration
    && actualVariables.has(migration.aggregate)
    && migration.absorbed.every((variable) => !actualVariables.has(variable))
  ) {
    for (const absorbed of migration.absorbed) result.delete(absorbed);
  }
  return result;
}

function sorted(values: Iterable<string>): string[] {
  return [...values].sort();
}

function specialBlockTypes(entry: EditorialEntry): string[] {
  return entry.stem.blocks
    .map((block) => String(block.type ?? ""))
    .filter((type) => type && type !== "paragraph");
}

function normaliseText(value: string): string {
  return value
    .toLowerCase()
    .replace(/\{[A-Za-z][A-Za-z0-9_]*\}/g, "{var}")
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?।]/g, "")
    .trim();
}

function canonicalStem(entry: EditorialEntry): string {
  const strings = collectStrings(entry.stem).map(normaliseText);
  const blockTypes = entry.stem.blocks.map((block) => String(block.type ?? ""));
  return JSON.stringify({ blockTypes, strings });
}

function nativeScriptPresent(language: "hi" | "pa", value: unknown): boolean {
  const text = collectStrings(value).join(" ");
  return language === "hi" ? /[\u0900-\u097F]/u.test(text) : /[\u0A00-\u0A7F]/u.test(text);
}

const allIds = new Set<string>();
const ownershipFingerprints = new Map<string, Set<string>>();
const duplicateStemGroups: Record<string, string[][]> = { en: [], hi: [], pa: [] };
const stemBuckets: Record<string, Map<string, string[]>> = {
  en: new Map(), hi: new Map(), pa: new Map(),
};
const solveModes: string[] = [];
const cpMetrics: Record<string, unknown> = {};
let registryEntryCount = 0;
let editorialEntryCount = 0;
let structuredEntryCount = 0;
let explanationStepCount = 0;

for (const [cp, range] of Object.entries(expected)) {
  const registry = readJson<RegistryFile>(join(root, cp, "task-registry.library.json"));
  const registryIds = Object.keys(registry.entries).sort((a, b) => qlNumber(a) - qlNumber(b));
  assert.equal(registryIds.length, range.count, `${cp}: registry count mismatch.`);
  assert.equal(qlNumber(registryIds[0]), range.start, `${cp}: first QL mismatch.`);
  assert.equal(qlNumber(registryIds.at(-1) ?? ""), range.end, `${cp}: last QL mismatch.`);

  const libraries = Object.fromEntries(languages.map((language) => [
    language,
    readJson<EditorialLibrary>(join(root, cp, `editorial-content.${language}.json`)),
  ])) as Record<typeof languages[number], EditorialLibrary>;

  const EnglishIds = Object.keys(libraries.en.entries).sort((a, b) => qlNumber(a) - qlNumber(b));
  assert.deepEqual(EnglishIds, registryIds, `${cp}: English editorial IDs differ from registry.`);

  for (const language of languages) {
    const library = libraries[language];
    const ids = Object.keys(library.entries).sort((a, b) => qlNumber(a) - qlNumber(b));
    assert.equal(library.entryCount, range.count, `${cp}/${language}: entryCount mismatch.`);
    assert.deepEqual(ids, registryIds, `${cp}/${language}: editorial IDs differ from registry.`);
  }

  let cpStructured = 0;
  for (const qlId of registryIds) {
    assert.equal(allIds.has(qlId), false, `Duplicate chapter QL id: ${qlId}`);
    allIds.add(qlId);
    registryEntryCount += 1;

    const registryEntry = registry.entries[qlId];
    solveModes.push(registryEntry.solveMode);
    const ownershipFingerprint = [
      registryEntry.solveMode,
      registryEntry.answerSemantic,
      sorted(registryEntry.requiredVariables).join(","),
      registryEntry.representation ?? "DIRECT",
      registryEntry.presentation ?? "",
    ].join("|");
    const owners = ownershipFingerprints.get(ownershipFingerprint) ?? new Set<string>();
    owners.add(cp);
    ownershipFingerprints.set(ownershipFingerprint, owners);

    const EnglishEntry = libraries.en.entries[qlId];
    const EnglishVariables = stemVariableSet(EnglishEntry, registryEntry.requiredVariables);
    assert.deepEqual(
      sorted(EnglishVariables),
      sorted(expectedStemVariableSet(qlId, registryEntry.requiredVariables, EnglishVariables)),
      `${qlId}: English stem variables differ from the registered or migrated contract.`,
    );

    const expectedSpecialTypes = specialBlockTypes(EnglishEntry);
    if (expectedSpecialTypes.length > 0) {
      structuredEntryCount += 1;
      cpStructured += 1;
    }

    for (const language of languages) {
      const entry = libraries[language].entries[qlId];
      editorialEntryCount += 1;
      assert.equal(entry.difficulty, EnglishEntry.difficulty, `${qlId}/${language}: difficulty differs from English.`);
      const actualVariables = stemVariableSet(entry, registryEntry.requiredVariables);
      assert.deepEqual(
        sorted(actualVariables),
        sorted(expectedStemVariableSet(qlId, registryEntry.requiredVariables, actualVariables)),
        `${qlId}/${language}: stem variables differ from the registered or migrated contract.`,
      );
      assert.deepEqual(
        specialBlockTypes(entry),
        expectedSpecialTypes,
        `${qlId}/${language}: structured representation differs from English.`,
      );

      assert.ok(entry.stem.prompt.trim().length >= 5, `${qlId}/${language}: prompt is too short.`);
      assert.notEqual(entry.stem.prompt, "Select the correct answer.", `${qlId}/${language}: fallback prompt remains.`);
      assert.ok(entry.stem.blocks.length > 0, `${qlId}/${language}: stem has no blocks.`);
      for (const block of entry.stem.blocks) {
        if (block.type !== "paragraph") continue;
        const content = String(block.content ?? "").trim();
        assert.ok(content.length > 0, `${qlId}/${language}: empty paragraph block.`);
        assert.equal(syntheticOpenings[language].test(content), false, `${qlId}/${language}: synthetic opening remains.`);
      }

      const explanation = entry.explanation;
      assert.ok(explanation.opening.trim().length >= 12, `${qlId}/${language}: explanation opening is too short.`);
      assert.ok(explanation.concept.trim().length >= 30, `${qlId}/${language}: explanation concept is too short.`);
      assert.ok(explanation.steps.length >= 2, `${qlId}/${language}: explanation has fewer than two steps.`);
      assert.ok(explanation.conclusion.trim().length >= 15, `${qlId}/${language}: explanation conclusion is too short.`);
      assert.ok((explanation.commonTrap ?? "").trim().length >= 15, `${qlId}/${language}: common-trap guidance is missing.`);
      explanationStepCount += explanation.steps.length;

      if (language !== "en") {
        assert.equal(nativeScriptPresent(language, entry.stem), true, `${qlId}/${language}: native script missing from stem.`);
        assert.equal(nativeScriptPresent(language, entry.explanation), true, `${qlId}/${language}: native script missing from explanation.`);
      }

      const stemKey = canonicalStem(entry);
      const bucket = stemBuckets[language].get(stemKey) ?? [];
      bucket.push(qlId);
      stemBuckets[language].set(stemKey, bucket);
    }
  }

  cpMetrics[cp] = {
    qlCount: range.count,
    structuredQlCount: cpStructured,
    firstQl: `PNL-QL-${String(range.start).padStart(3, "0")}`,
    lastQl: `PNL-QL-${String(range.end).padStart(3, "0")}`,
  };
}

assert.equal(allIds.size, 186, "Chapter must contain exactly 186 unique QLs.");
assert.deepEqual(
  sorted(allIds),
  Array.from({ length: 186 }, (_, index) => `PNL-QL-${String(index + 1).padStart(3, "0")}`),
  "Chapter QL IDs are not contiguous from 001 through 186.",
);
assert.equal(registryEntryCount, 186, "Registry entry total must be 186.");
assert.equal(editorialEntryCount, 558, "Editorial entry total must be 558.");

for (const language of languages) {
  const duplicates = [...stemBuckets[language].values()].filter((ids) => ids.length > 1);
  duplicateStemGroups[language] = duplicates;
  assert.deepEqual(duplicates, [], `${language}: exact duplicate structured stems found: ${JSON.stringify(duplicates)}`);
}

const ownershipOverlaps = [...ownershipFingerprints.entries()]
  .filter(([, owners]) => owners.size > 1)
  .map(([fingerprint, owners]) => ({ fingerprint, owners: sorted(owners) }));
assert.deepEqual(ownershipOverlaps, [], `Cross-CP ownership overlaps found: ${JSON.stringify(ownershipOverlaps)}`);

const coverageFamilies = {
  fundamentalPriceRelations: /CP_SP|CP_RATE|SP_RATE|AMOUNT|RATIO|FRACTION/,
  markedPriceDiscountPromotion: /MARKUP|MARKED|DISCOUNT|OFFER|COUPON|CASHBACK|BUY_X/,
  aggregateInventory: /INVENTORY|LOT|GROUP|REMAINING|EQUAL_SP|EQUAL_CP|MULTIPLE/,
  successiveTradeChains: /CHAIN|TRANSACTION|INTERMEDIARY|STAGE/,
  dishonestTrade: /FALSE|SHORT|WEIGHT|MEASURE|DISHONEST/,
  effectiveCostManufacturing: /EFFECTIVE|OVERHEAD|MANUFACTURING|WASTAGE|SCRAP/,
  breakEvenContribution: /BREAK_EVEN|CONTRIBUTION|MARGIN_OF_SAFETY/,
  recoveryAndCapitalRestoration: /RECOVERY|EARLIER_LOSS|REMAINING_CAPITAL/,
} as const;

const coverageCounts = Object.fromEntries(
  Object.entries(coverageFamilies).map(([name, pattern]) => [
    name,
    solveModes.filter((mode) => pattern.test(mode)).length,
  ]),
);
for (const [family, count] of Object.entries(coverageCounts)) {
  assert.ok(count > 0, `Critical source-backed coverage family is absent: ${family}`);
}

console.log(JSON.stringify({
  ok: true,
  status: "FREEZE_CANDIDATE",
  qlCount: allIds.size,
  registryEntryCount,
  editorialEntryCount,
  languages: languages.length,
  structuredEntryCount,
  explanationStepCount,
  exactDuplicateStemGroups: duplicateStemGroups,
  crossCpOwnershipOverlaps: ownershipOverlaps,
  structuredVariableMigrations,
  coverageCounts,
  cpMetrics,
}, null, 2));
