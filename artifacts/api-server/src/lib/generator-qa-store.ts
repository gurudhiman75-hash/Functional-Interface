import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";

export type QAReviewAction =
  | "approve"
  | "reject"
  | "weak-clues"
  | "too-easy"
  | "too-hard"
  | "repetitive"
  | "unnatural-wording"
  | "contradictory"
  | "duplicate-structure";

export type QAReviewRecord = {
  fingerprint: string;
  status:
    | "approved"
    | "rejected"
    | "flagged";
  action: QAReviewAction;
  topic?: string;
  generationDomain?: string;
  motif?: string;
  archetype?: string;
  arrangementType?: string;
  reviewerNotes?: string;
  validationStatus?: string;
  createdAt: string;
  updatedAt: string;
};

type QAReviewStore = {
  reviews: QAReviewRecord[];
};

const artifactDir = path.dirname(
  fileURLToPath(import.meta.url),
);
const storeDir = path.resolve(
  artifactDir,
  "../../.local",
);
const storePath = path.resolve(
  storeDir,
  "generator-qa-reviews.json",
);

async function ensureStoreFile() {
  await mkdir(storeDir, {
    recursive: true,
  });

  try {
    await readFile(storePath, "utf8");
  } catch {
    const initial: QAReviewStore = {
      reviews: [],
    };

    await writeFile(
      storePath,
      JSON.stringify(initial, null, 2),
      "utf8",
    );
  }
}

async function readStore(): Promise<QAReviewStore> {
  await ensureStoreFile();

  try {
    const content = await readFile(
      storePath,
      "utf8",
    );
    const parsed = JSON.parse(
      content,
    ) as Partial<QAReviewStore>;

    return {
      reviews: Array.isArray(
        parsed.reviews,
      )
        ? parsed.reviews
        : [],
    };
  } catch {
    return {
      reviews: [],
    };
  }
}

async function writeStore(
  store: QAReviewStore,
) {
  await ensureStoreFile();
  await writeFile(
    storePath,
    JSON.stringify(store, null, 2),
    "utf8",
  );
}

export function buildQuestionFingerprint(
  payload: {
    text?: string;
    options?: string[];
    topic?: string;
    selectedMotif?: string;
    selectedArchetype?: string;
  },
) {
  const source = JSON.stringify({
    text: payload.text ?? "",
    options: payload.options ?? [],
    topic: payload.topic ?? "",
    motif:
      payload.selectedMotif ?? "",
    archetype:
      payload.selectedArchetype ?? "",
  });
  let hash = 0;

  for (let index = 0; index < source.length; index++) {
    hash =
      (hash * 31 +
        source.charCodeAt(index)) >>>
      0;
  }

  return `qa_${hash.toString(16)}`;
}

export async function listQAReviews() {
  const store = await readStore();

  return store.reviews.sort(
    (left, right) =>
      right.updatedAt.localeCompare(
        left.updatedAt,
      ),
  );
}

export async function upsertQAReview(
  record: Omit<
    QAReviewRecord,
    "createdAt" | "updatedAt"
  >,
) {
  const store = await readStore();
  const now =
    new Date().toISOString();
  const existingIndex =
    store.reviews.findIndex(
      (entry) =>
        entry.fingerprint ===
        record.fingerprint,
    );

  if (existingIndex >= 0) {
    const existing =
      store.reviews[existingIndex]!;

    store.reviews[existingIndex] = {
      ...existing,
      ...record,
      updatedAt: now,
    };
  } else {
    store.reviews.push({
      ...record,
      createdAt: now,
      updatedAt: now,
    });
  }

  await writeStore(store);

  return store.reviews.find(
    (entry) =>
      entry.fingerprint ===
      record.fingerprint,
  )!;
}

export async function bulkUpsertQAReviews(
  records: Array<
    Omit<
      QAReviewRecord,
      "createdAt" | "updatedAt"
    >
  >,
) {
  const updated: QAReviewRecord[] = [];

  for (const record of records) {
    updated.push(
      await upsertQAReview(record),
    );
  }

  return updated;
}
