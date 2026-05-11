import fs from "node:fs/promises";
import path from "node:path";
import type {
  FactExtractionCandidate,
  KnowledgeFact,
} from "./types";

const DATA_DIR = path.resolve(
  process.cwd(),
  "data",
);
const CANDIDATE_FILE = path.join(
  DATA_DIR,
  "knowledge-extraction-candidates.json",
);
const APPROVED_FACTS_FILE = path.join(
  DATA_DIR,
  "approved-knowledge-facts.json",
);

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, {
    recursive: true,
  });
}

async function readJsonArray<T>(
  filePath: string,
): Promise<T[]> {
  try {
    const raw = await fs.readFile(
      filePath,
      "utf8",
    );
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeJsonArray<T>(
  filePath: string,
  values: T[],
) {
  await ensureDataDir();
  await fs.writeFile(
    filePath,
    `${JSON.stringify(values, null, 2)}\n`,
    "utf8",
  );
}

export async function listExtractionCandidates() {
  return readJsonArray<FactExtractionCandidate>(
    CANDIDATE_FILE,
  );
}

export async function upsertExtractionCandidates(
  candidates: FactExtractionCandidate[],
) {
  const existing =
    await listExtractionCandidates();
  const byId = new Map(
    existing.map((candidate) => [
      candidate.candidateId,
      candidate,
    ]),
  );

  candidates.forEach((candidate) => {
    byId.set(
      candidate.candidateId,
      candidate,
    );
  });

  const next = [...byId.values()].sort(
    (left, right) =>
      left.candidateId.localeCompare(
        right.candidateId,
      ),
  );
  await writeJsonArray(
    CANDIDATE_FILE,
    next,
  );
  return next;
}

export async function updateExtractionCandidate(
  candidateId: string,
  updater: (
    candidate: FactExtractionCandidate,
  ) => FactExtractionCandidate,
) {
  const candidates =
    await listExtractionCandidates();
  let updated:
    | FactExtractionCandidate
    | null = null;
  const next = candidates.map(
    (candidate) => {
      if (
        candidate.candidateId !==
        candidateId
      ) {
        return candidate;
      }
      updated = updater(candidate);
      return updated;
    },
  );

  if (!updated) {
    return null;
  }

  await writeJsonArray(
    CANDIDATE_FILE,
    next,
  );
  return updated;
}

export async function listApprovedKnowledgeFacts() {
  return readJsonArray<KnowledgeFact>(
    APPROVED_FACTS_FILE,
  );
}

export async function approveKnowledgeFact(
  fact: KnowledgeFact,
) {
  const approved =
    await listApprovedKnowledgeFacts();
  const byId = new Map(
    approved.map((entry) => [
      entry.factId,
      entry,
    ]),
  );
  byId.set(fact.factId, fact);
  const next = [...byId.values()].sort(
    (left, right) =>
      left.factId.localeCompare(
        right.factId,
      ),
  );
  await writeJsonArray(
    APPROVED_FACTS_FILE,
    next,
  );
  return fact;
}
