import { Router, type IRouter } from "express";
import multer from "multer";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "../lib/db";
import { questions, sections, topicsGlobal, tests as testsTable } from "@workspace/db";
import { authenticate } from "../middlewares/auth";
import { assertAdmin } from "./admin-data";

/** Trim + lowercase for case-insensitive matching */
function normaliseKey(v: string): string {
  return v.trim().toLowerCase().replace(/\s+/g, " ");
}

const router: IRouter = Router();

// Store file in memory (no disk I/O)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter(_req, file, cb) {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only .csv files are accepted"));
    }
  },
});

/**
 * Parse a raw CSV line, handling quoted fields that may contain commas.
 */
function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      // Handle escaped quotes inside a quoted field
      if (inQuote && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuote = !inQuote;
      }
    } else if (ch === "," && !inQuote) {
      cells.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  cells.push(cur.trim());
  return cells;
}

const CORRECT_MAP: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

/** Always-required columns regardless of language */
const BASE_REQUIRED_HEADERS = ["correct_option"];

/** Build the list of required column names for the given language set */
function buildRequiredHeaders(langs: string[]): string[] {
  const cols = [...BASE_REQUIRED_HEADERS];
  for (const lang of ["en", "hi", "pa"]) {
    if (!langs.includes(lang)) continue;
    cols.push(
      `question_${lang}`,
      `optiona_${lang}`,
      `optionb_${lang}`,
      `optionc_${lang}`,
      `optiond_${lang}`,
    );
  }
  return cols;
}

/**
 * POST /api/upload-questions
 * Multipart body:
 *   - file: the CSV file
 *   - testId: string (required)
 *   - subcategoryId: string (optional — used to enforce language columns)
 *   - sectionId: string (optional, batch-level ID; per-row 'section_id' column takes precedence)
 *   - section: string (optional, batch-level name fallback when sectionId absent)
 *   - topicId: string (optional, batch-level ID; per-row 'topic_id' column takes precedence)
 *   - topic: string (optional, batch-level name fallback when topicId absent)
 *   - createMissingTopics: "true"|"false" (optional; when "true", auto-create topics not in master)
 */
router.post("/", authenticate, upload.single("file"), async (req, res) => {
  try {
    await assertAdmin(req.user!.id);
  } catch {
    return res.status(403).json({ error: "Admin access required" });
  }

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const testId = (req.body.testId as string | undefined)?.trim();
  const subcategoryId = (req.body.subcategoryId as string | undefined)?.trim() || null;

  // Batch-level overrides: prefer ID, fall back to name string
  const batchSectionId = (req.body.sectionId as string | undefined)?.trim() ?? "";
  const batchSection   = (req.body.section   as string | undefined)?.trim() ?? "";
  const batchTopicId   = (req.body.topicId   as string | undefined)?.trim() ?? "";
  const batchTopic     = (req.body.topic     as string | undefined)?.trim() ?? "";
  const createMissingTopics = (req.body.createMissingTopics as string | undefined)?.trim() === "true";

  // ── Load master tables once for this request ─────────────────────────────
  const [allSections, allTopicsGlobalRaw] = await Promise.all([
    db.select().from(sections),
    db.select().from(topicsGlobal),
  ]);
  // Mutable array — grows when topics are auto-created during this request
  const allGlobalTopics = [...allTopicsGlobalRaw];

  // Build lookup maps: normalised name → row
  const sectionByName = new Map(allSections.map((s) => [normaliseKey(s.name), s]));
  const sectionById   = new Map(allSections.map((s) => [s.id, s]));
  // topics_global lookup by normalised name → row
  const topicsGlobalByName = new Map(allTopicsGlobalRaw.map((t) => [normaliseKey(t.name), t]));
  const topicsGlobalById   = new Map(allTopicsGlobalRaw.map((t) => [t.id, t]));

  if (!testId) return res.status(400).json({ error: "testId is required" });

  // ── Resolve required languages from the test record ──────────────────────
  // Priority: test.languages → default ["en"]
  // We do NOT inherit from subcategory — if a test needs bilingual validation
  // its own languages field must be explicitly set (e.g. ["en","pa"]).
  const [testRow] = await db.select().from(testsTable).where(eq(testsTable.id, testId)).limit(1);
  if (!testRow) return res.status(404).json({ error: `Test "${testId}" not found` });

  const requiredLangs: string[] =
    Array.isArray(testRow.languages) && (testRow.languages as string[]).length > 0
      ? (testRow.languages as string[])
      : ["en"];
  const needHi = requiredLangs.includes("hi");
  const needPa = requiredLangs.includes("pa");

  const csvText = req.file.buffer.toString("utf-8");
  const lines = csvText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return res.status(400).json({ error: "CSV must have a header row and at least one data row" });
  }

  // Parse header — normalise to lowercase for matching
  const rawHeader = parseCsvLine(lines[0]);
  const header = rawHeader.map((h) => h.toLowerCase().trim());

  // Validate required columns — dynamically based on resolved languages
  const requiredHeaders = buildRequiredHeaders(requiredLangs);
  for (const req_col of requiredHeaders) {
    if (!header.includes(req_col)) {
      return res.status(400).json({ error: `Missing required column: "${req_col}" (required for languages: ${requiredLangs.join(", ")})` });
    }
  }

  const get = (cells: string[], col: string) => (cells[header.indexOf(col)] ?? "").trim();

  const toInsert: (typeof questions.$inferInsert)[] = [];
  const errors: { row: number; reason: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1; // 1-based for user display
    const cells = parseCsvLine(lines[i]);

    const correctRaw = get(cells, "correct_option").toUpperCase();

    // ── Per-row validation: only require fields for active languages ───────
    // English (always required when "en" in requiredLangs)
    const needEn = requiredLangs.includes("en");
    const questionEn = needEn ? get(cells, "question_en") : (get(cells, "question_en") || "");
    const optionAEn = needEn ? get(cells, "optiona_en") : (get(cells, "optiona_en") || "");
    const optionBEn = needEn ? get(cells, "optionb_en") : (get(cells, "optionb_en") || "");
    const optionCEn = needEn ? get(cells, "optionc_en") : (get(cells, "optionc_en") || "");
    const optionDEn = needEn ? get(cells, "optiond_en") : (get(cells, "optiond_en") || "");

    if (needEn && !questionEn) {
      errors.push({ row: rowNum, reason: "question_en is missing" });
      continue;
    }
    if (needEn && (!optionAEn || !optionBEn || !optionCEn || !optionDEn)) {
      errors.push({ row: rowNum, reason: "One or more English options are missing" });
      continue;
    }
    if (!(correctRaw in CORRECT_MAP)) {
      errors.push({ row: rowNum, reason: `correct_option "${correctRaw}" is not A/B/C/D` });
      continue;
    }

    // ── Section / Topic resolution against master tables ───────────────────
    // Per-row columns take precedence over batch-level body fields.
    // IDs (section_id / topic_id columns) take precedence over name strings.
    const rowSectionId = get(cells, "section_id");
    const rowSection   = get(cells, "section");
    const rowTopicId   = get(cells, "topic_id");
    const rowTopic     = get(cells, "topic");

    const effectiveSectionId = rowSectionId || batchSectionId;
    const effectiveSectionName = rowSection || batchSection;
    const effectiveTopicId   = rowTopicId   || batchTopicId;
    const effectiveTopicName  = rowTopic    || batchTopic;

    // ── Resolve section ────────────────────────────────────────────────────
    let sectionRow: (typeof allSections)[number] | undefined;
    if (effectiveSectionId) {
      // ID provided — look up directly
      sectionRow = sectionById.get(effectiveSectionId);
      if (!sectionRow) {
        errors.push({ row: rowNum, reason: `sectionId "${effectiveSectionId}" not found in master sections table` });
        continue;
      }
    } else if (effectiveSectionName) {
      // Name provided — case-insensitive match
      sectionRow = sectionByName.get(normaliseKey(effectiveSectionName));
      if (!sectionRow) {
        errors.push({ row: rowNum, reason: `Section "${effectiveSectionName}" not found in master table. Valid sections: ${allSections.map((s) => s.name).join(", ")}` });
        continue;
      }
    } else {
      errors.push({ row: rowNum, reason: "section is missing — provide a 'section_id' or 'section' column in the CSV, or a sectionId / section field in the request" });
      continue;
    }

    // ── Resolve topic from topics_global (primary source) ─────────────────
    let globalTopicRow: (typeof allGlobalTopics)[number] | undefined;
    if (effectiveTopicId) {
      // ID provided — look up by id first, then fall back to name in topics_global
      globalTopicRow = topicsGlobalById.get(effectiveTopicId)
        ?? allGlobalTopics.find((t) => normaliseKey(t.name) === normaliseKey(effectiveTopicId));
    }
    if (!globalTopicRow && effectiveTopicName) {
      // Name match (case-insensitive)
      globalTopicRow = topicsGlobalByName.get(normaliseKey(effectiveTopicName));
    }
    if (!globalTopicRow) {
      // Determine the canonical name to create under
      const nameToCreate = effectiveTopicName || effectiveTopicId;
      if (!nameToCreate) {
        errors.push({ row: rowNum, reason: "topic is missing — provide a 'topic_id' or 'topic' column in the CSV, or a topicId / topic field in the request" });
        continue;
      }
      // Auto-create idempotently in topics_global (ON CONFLICT DO NOTHING ensures no duplicates)
      const newId = `topic-${nameToCreate.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
      await db
        .insert(topicsGlobal)
        .values({ id: newId, name: nameToCreate })
        .onConflictDoNothing();
      // Re-fetch canonical row (may have pre-existed with a different id)
      const [created] = await db
        .select()
        .from(topicsGlobal)
        .where(eq(topicsGlobal.name, nameToCreate))
        .limit(1);
      if (!created) {
        errors.push({ row: rowNum, reason: `Failed to create topic "${nameToCreate}" in topics_global` });
        continue;
      }
      globalTopicRow = created;
      // Cache for subsequent rows in this upload
      allGlobalTopics.push(created);
      topicsGlobalByName.set(normaliseKey(created.name), created);
      topicsGlobalById.set(created.id, created);
    }

    // Use canonical names from master tables (maintains consistency)
    const section   = sectionRow.name;
    const topic     = globalTopicRow.name;
    const sectionId = sectionRow.id;
    const globalTopicId = globalTopicRow.id;

    // Language enforcement based on test (or subcategory) language configuration
    if (needHi) {
      const qHi = get(cells, "question_hi");
      const oAHi = get(cells, "optiona_hi");
      const oBHi = get(cells, "optionb_hi");
      const oCHi = get(cells, "optionc_hi");
      const oDHi = get(cells, "optiond_hi");
      if (!qHi || !oAHi || !oBHi || !oCHi || !oDHi) {
        errors.push({ row: rowNum, reason: "Hindi fields required by subcategory (question_hi + optionA/B/C/D_hi)" });
        continue;
      }
    }
    if (needPa) {
      const qPa = get(cells, "question_pa");
      const oAPa = get(cells, "optiona_pa");
      const oBPa = get(cells, "optionb_pa");
      const oCPa = get(cells, "optionc_pa");
      const oDPa = get(cells, "optiond_pa");
      if (!qPa || !oAPa || !oBPa || !oCPa || !oDPa) {
        errors.push({ row: rowNum, reason: "Punjabi fields required by subcategory (question_pa + optionA/B/C/D_pa)" });
        continue;
      }
    }

    // Optional Hindi
    const questionHi = get(cells, "question_hi") || null;
    const optionAHi = get(cells, "optiona_hi");
    const optionBHi = get(cells, "optionb_hi");
    const optionCHi = get(cells, "optionc_hi");
    const optionDHi = get(cells, "optiond_hi");
    const optionsHi =
      questionHi && (optionAHi || optionBHi || optionCHi || optionDHi)
        ? [
            optionAHi || optionAEn,
            optionBHi || optionBEn,
            optionCHi || optionCEn,
            optionDHi || optionDEn,
          ]
        : null;

    // Optional Punjabi
    const questionPa = get(cells, "question_pa") || null;
    const optionAPa = get(cells, "optiona_pa");
    const optionBPa = get(cells, "optionb_pa");
    const optionCPa = get(cells, "optionc_pa");
    const optionDPa = get(cells, "optiond_pa");
    const optionsPa =
      questionPa && (optionAPa || optionBPa || optionCPa || optionDPa)
        ? [
            optionAPa || optionAEn,
            optionBPa || optionBEn,
            optionCPa || optionCEn,
            optionDPa || optionDEn,
          ]
        : null;

    // Optional explanation
    const explanationEn = get(cells, "explanation_en") || get(cells, "explanation") || "";
    const explanationHi = get(cells, "explanation_hi") || null;
    const explanationPa = get(cells, "explanation_pa") || null;

    toInsert.push({
      clientId: `csv-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      testId,
      section,
      topic,
      sectionId,
      topicId: null,
      globalTopicId,
      text: questionEn,
      options: [optionAEn, optionBEn, optionCEn, optionDEn],
      correct: CORRECT_MAP[correctRaw],
      explanation: explanationEn,
      textHi: questionHi,
      optionsHi: optionsHi as string[] | null,
      explanationHi,
      textPa: questionPa,
      optionsPa: optionsPa as string[] | null,
      explanationPa,
    });
  }

  const totalRows = lines.length - 1; // exclude header

  // If ANY row failed validation, reject the entire upload — no partial inserts
  if (errors.length > 0) {
    return res.status(422).json({
      error: "Upload rejected: validation errors found. No rows were inserted.",
      totalRows,
      successCount: 0,
      errorCount: errors.length,
      errors,
    });
  }

  if (toInsert.length === 0) {
    return res.status(400).json({ error: "No valid rows to insert" });
  }

  // Insert all rows atomically — any DB error rolls back the entire upload
  const BATCH = 100;
  await db.transaction(async (tx) => {
    for (let b = 0; b < toInsert.length; b += BATCH) {
      const batch = toInsert.slice(b, b + BATCH);
      await tx.insert(questions).values(batch);
    }
  });

  return res.status(201).json({
    totalRows,
    successCount: toInsert.length,
    errorCount: 0,
    errors: [],
  });
});

export default router;
