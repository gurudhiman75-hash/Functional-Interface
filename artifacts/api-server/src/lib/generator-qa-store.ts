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

export type QAIssueTag =
  | "repetitive"
  | "too-direct"
  | "ambiguous"
  | "unrealistic"
  | "weak-explanation";

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
  issueTags?: QAIssueTag[];
  seed?: string;
  topologyType?: string;
  inferenceDepth?: number;
  clueCount?: number;
  redundancyScore?: number;
  realismScore?: number;
  structuralDiversityScore?: number;
  difficultyConfidence?: number;
  generationLatencyMs?: number;
  uniquenessStatus?: string;
  bookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type QAAnalyticsBucket = {
  date: string;
  approvalRate: number;
  realismScore: number;
  structuralDiversityScore: number;
  difficultyConfidence: number;
  generationLatencyMs: number;
  count: number;
};

export type QAAnalyticsSummary = {
  totalReviews: number;
  approvalRate: number;
  averageRealismScore: number;
  averageStructuralDiversity: number;
  averageDifficultyConfidence: number;
  averageGenerationLatencyMs: number;
  rejectionReasons: Record<string, number>;
  byDomain: Record<
    string,
    {
      totalReviews: number;
      approvalRate: number;
      averageRealismScore: number;
      averageStructuralDiversity: number;
      averageDifficultyConfidence: number;
      averageGenerationLatencyMs: number;
    }
  >;
  trends: QAAnalyticsBucket[];
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

function round(
  value: number,
  digits = 2,
) {
  return Number(value.toFixed(digits));
}

function average(
  values: number[],
) {
  if (!values.length) {
    return 0;
  }

  return round(
    values.reduce(
      (sum, value) => sum + value,
      0,
    ) / values.length,
  );
}

export async function getQAAnalyticsSummary(): Promise<QAAnalyticsSummary> {
  const reviews = await listQAReviews();
  const approvalCount = reviews.filter(
    (review) =>
      review.status === "approved",
  ).length;
  const rejectionReasons =
    reviews.reduce(
      (accumulator, review) => {
        if (
          review.status === "rejected" ||
          review.status === "flagged"
        ) {
          accumulator[review.action] =
            (accumulator[
              review.action
            ] ?? 0) + 1;

          for (const tag of review.issueTags ??
            []) {
            accumulator[tag] =
              (accumulator[tag] ?? 0) + 1;
          }
        }

        return accumulator;
      },
      {} as Record<string, number>,
    );
  const byDomainEntries =
    Object.entries(
      reviews.reduce(
        (accumulator, review) => {
          const domain =
            review.generationDomain ??
            "unknown";
          const bucket =
            accumulator[domain] ??
            [];

          bucket.push(review);
          accumulator[domain] = bucket;
          return accumulator;
        },
        {} as Record<
          string,
          QAReviewRecord[]
        >,
      ),
    );
  const byDomain = Object.fromEntries(
    byDomainEntries.map(
      ([domain, domainReviews]) => [
        domain,
        {
          totalReviews:
            domainReviews.length,
          approvalRate: round(
            domainReviews.filter(
              (review) =>
                review.status ===
                "approved",
            ).length /
              Math.max(
                domainReviews.length,
                1,
              ) *
              100,
          ),
          averageRealismScore: average(
            domainReviews
              .map(
                (review) =>
                  review.realismScore,
              )
              .filter(
                (
                  value,
                ): value is number =>
                  typeof value ===
                  "number",
              ),
          ),
          averageStructuralDiversity:
            average(
              domainReviews
                .map(
                  (review) =>
                    review.structuralDiversityScore,
                )
                .filter(
                  (
                    value,
                  ): value is number =>
                    typeof value ===
                    "number",
                ),
            ),
          averageDifficultyConfidence:
            average(
              domainReviews
                .map(
                  (review) =>
                    review.difficultyConfidence,
                )
                .filter(
                  (
                    value,
                  ): value is number =>
                    typeof value ===
                    "number",
                ),
            ),
          averageGenerationLatencyMs:
            average(
              domainReviews
                .map(
                  (review) =>
                    review.generationLatencyMs,
                )
                .filter(
                  (
                    value,
                  ): value is number =>
                    typeof value ===
                    "number",
                ),
            ),
        },
      ],
    ),
  );
  const trendMap = reviews.reduce(
    (accumulator, review) => {
      const date =
        review.updatedAt.slice(0, 10);
      const bucket =
        accumulator[date] ?? [];

      bucket.push(review);
      accumulator[date] = bucket;
      return accumulator;
    },
    {} as Record<
      string,
      QAReviewRecord[]
    >,
  );
  const trends = Object.entries(trendMap)
    .sort(([left], [right]) =>
      left.localeCompare(right),
    )
    .map(([date, bucket]) => ({
      date,
      approvalRate: round(
        bucket.filter(
          (review) =>
            review.status ===
            "approved",
        ).length /
          Math.max(
            bucket.length,
            1,
          ) *
          100,
      ),
      realismScore: average(
        bucket
          .map(
            (review) =>
              review.realismScore,
          )
          .filter(
            (
              value,
            ): value is number =>
              typeof value ===
              "number",
          ),
      ),
      structuralDiversityScore:
        average(
          bucket
            .map(
              (review) =>
                review.structuralDiversityScore,
            )
            .filter(
              (
                value,
              ): value is number =>
                typeof value ===
                "number",
            ),
        ),
      difficultyConfidence:
        average(
          bucket
            .map(
              (review) =>
                review.difficultyConfidence,
            )
            .filter(
              (
                value,
              ): value is number =>
                typeof value ===
                "number",
            ),
        ),
      generationLatencyMs: average(
        bucket
          .map(
            (review) =>
              review.generationLatencyMs,
          )
          .filter(
            (
              value,
            ): value is number =>
              typeof value ===
              "number",
          ),
      ),
      count: bucket.length,
    }));

  return {
    totalReviews: reviews.length,
    approvalRate: round(
      approvalCount /
        Math.max(reviews.length, 1) *
        100,
    ),
    averageRealismScore: average(
      reviews
        .map(
          (review) =>
            review.realismScore,
        )
        .filter(
          (
            value,
          ): value is number =>
            typeof value === "number",
        ),
    ),
    averageStructuralDiversity:
      average(
        reviews
          .map(
            (review) =>
              review.structuralDiversityScore,
          )
          .filter(
            (
              value,
            ): value is number =>
              typeof value === "number",
          ),
      ),
    averageDifficultyConfidence:
      average(
        reviews
          .map(
            (review) =>
              review.difficultyConfidence,
          )
          .filter(
            (
              value,
            ): value is number =>
              typeof value === "number",
          ),
      ),
    averageGenerationLatencyMs:
      average(
        reviews
          .map(
            (review) =>
              review.generationLatencyMs,
          )
          .filter(
            (
              value,
            ): value is number =>
              typeof value === "number",
          ),
      ),
    rejectionReasons,
    byDomain,
    trends,
  };
}
