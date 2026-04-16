import { Router, type IRouter } from "express";
import multer from "multer";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { questions, subcategories } from "@workspace/db";
import { authenticate } from "../middlewares/auth";
import { assertAdmin } from "./admin-data";

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

const REQUIRED_HEADERS = [
  "question_en",
  "optiona_en",
  "optionb_en",
  "optionc_en",
  "optiond_en",
  "correct_option",
];

/**
 * POST /api/upload-questions
 * Multipart body:
 *   - file: the CSV file
 *   - testId: string (required)
 *   - subcategoryId: string (optional — used to enforce language columns)
 *   - section: string (optional, defaults to "General")
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
  const section = (req.body.section as string | undefined)?.trim() ?? "General";

  // Fetch subcategory languages to enforce bilingual columns
  let requiredLangs: string[] = ["en"];
  if (subcategoryId) {
    const [sub] = await db.select().from(subcategories).where(eq(subcategories.id, subcategoryId)).limit(1);
    if (sub && Array.isArray(sub.languages) && sub.languages.length > 0) {
      requiredLangs = sub.languages as string[];
    }
  }
  const needHi = requiredLangs.includes("hi");
  const needPa = requiredLangs.includes("pa");

  if (!testId) return res.status(400).json({ error: "testId is required" });

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

  // Validate required columns
  for (const req_col of REQUIRED_HEADERS) {
    if (!header.includes(req_col)) {
      return res.status(400).json({ error: `Missing required column: "${req_col}"` });
    }
  }

  const get = (cells: string[], col: string) => (cells[header.indexOf(col)] ?? "").trim();

  const toInsert: (typeof questions.$inferInsert)[] = [];
  const errors: { row: number; reason: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1; // 1-based for user display
    const cells = parseCsvLine(lines[i]);

    const questionEn = get(cells, "question_en");
    const optionAEn = get(cells, "optiona_en");
    const optionBEn = get(cells, "optionb_en");
    const optionCEn = get(cells, "optionc_en");
    const optionDEn = get(cells, "optiond_en");
    const correctRaw = get(cells, "correct_option").toUpperCase();

    // Validate required fields
    if (!questionEn) {
      errors.push({ row: rowNum, reason: "question_en is missing" });
      continue;
    }
    if (!optionAEn || !optionBEn || !optionCEn || !optionDEn) {
      errors.push({ row: rowNum, reason: "One or more English options are missing" });
      continue;
    }
    if (!(correctRaw in CORRECT_MAP)) {
      errors.push({ row: rowNum, reason: `correct_option "${correctRaw}" is not A/B/C/D` });
      continue;
    }

    // Language enforcement based on subcategory configuration
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
      text: questionEn,
      options: [optionAEn, optionBEn, optionCEn, optionDEn],
      correct: correctIndex,
      explanation: explanationEn,
      textHi: questionHi,
      optionsHi: optionsHi as string[] | null,
      explanationHi,
      textPa: questionPa,
      optionsPa: optionsPa as string[] | null,
      explanationPa,
    });
  }

  let inserted = 0;
  // Insert in batches to avoid hitting query limits
  const BATCH = 100;
  for (let b = 0; b < toInsert.length; b += BATCH) {
    const batch = toInsert.slice(b, b + BATCH);
    if (batch.length > 0) {
      await db.insert(questions).values(batch);
      inserted += batch.length;
    }
  }

  return res.json({
    inserted,
    skipped: errors.length,
    errors: errors.slice(0, 50), // cap error list at 50
  });
});

export default router;
