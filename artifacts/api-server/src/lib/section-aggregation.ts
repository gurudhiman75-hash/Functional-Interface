import { eq } from "drizzle-orm";
import { db } from "./db";
import { questions, responses } from "@workspace/db";

export interface SectionAggregate {
  section: string;
  total: number;
  correct: number;
  totalTime: number; // sum of timeTaken (seconds) for all responses in section
}

/**
 * Aggregates response data for a single attempt, grouped by question section.
 *
 * Joins responses → questions on questionId = questions.id, filters by attemptId,
 * then groups by questions.section computing:
 *   - total       : number of questions in the section
 *   - correct     : responses where selectedOption === questions.correct
 *   - totalTime   : sum of responses.timeTaken (seconds)
 *
 * @param attemptId - The attempt whose responses to aggregate.
 * @returns Array of SectionAggregate, one entry per distinct section.
 */
export async function aggregateSectionsByAttempt(
  attemptId: string,
): Promise<SectionAggregate[]> {
  const rows = await db
    .select({
      section: questions.section,
      correct: questions.correct,
      selectedOption: responses.selectedOption,
      timeTaken: responses.timeTaken,
    })
    .from(responses)
    .innerJoin(questions, eq(responses.questionId, questions.id))
    .where(eq(responses.attemptId, attemptId));

  const secMap = new Map<string, SectionAggregate>();

  for (const row of rows) {
    const entry = secMap.get(row.section) ?? {
      section: row.section,
      total: 0,
      correct: 0,
      totalTime: 0,
    };
    entry.total++;
    if (row.selectedOption !== null && row.selectedOption === row.correct) {
      entry.correct++;
    }
    entry.totalTime += row.timeTaken ?? 0;
    secMap.set(row.section, entry);
  }

  return Array.from(secMap.values());
}

// ── Metrics ──────────────────────────────────────────────────────────────────

export interface SectionMetrics {
  section: string;
  total: number;
  correct: number;
  accuracy: number;  // 0–100, rounded
  avgTime: number;   // avg seconds per question, rounded
}

export interface SectionRanking {
  weakestSections: SectionMetrics[];   // top 2, ascending accuracy
  strongestSections: SectionMetrics[]; // top 2, descending accuracy
}

const WEAK_ACCURACY_THRESHOLD = 50;  // below this → weak
const SLOW_TIME_THRESHOLD_SECS = 75; // above this → slow

/**
 * Generates plain-English recommendations from section metrics.
 *
 * Rules (per section):
 *   - accuracy < 50  AND avgTime > 75 → "Focus on {section} — low accuracy and high time"
 *   - accuracy < 50  only             → "You are weak in {section}"
 *   - avgTime  > 75  only             → "You are slow in {section}"
 */
export function generateRecommendations(metrics: SectionMetrics[]): string[] {
  const recommendations: string[] = [];

  for (const s of metrics) {
    const isWeak = s.accuracy < WEAK_ACCURACY_THRESHOLD;
    const isSlow = s.avgTime > SLOW_TIME_THRESHOLD_SECS;

    if (isWeak && isSlow) {
      recommendations.push(`Focus on ${s.section} — low accuracy and high time`);
    } else if (isWeak) {
      recommendations.push(`You are weak in ${s.section}`);
    } else if (isSlow) {
      recommendations.push(`You are slow in ${s.section}`);
    }
  }

  return recommendations;
}

/**
 * Derives per-section accuracy and avgTime from raw aggregates, then
 * returns the top-2 weakest and top-2 strongest sections.
 *
 * @param aggregates - Output of aggregateSectionsByAttempt (or any SectionAggregate[]).
 */
export function computeSectionRanking(aggregates: SectionAggregate[]): SectionRanking {
  const metrics: SectionMetrics[] = aggregates.map((agg) => ({
    section: agg.section,
    total: agg.total,
    correct: agg.correct,
    accuracy: agg.total > 0 ? Math.round((agg.correct / agg.total) * 100) : 0,
    avgTime: agg.total > 0 ? Math.round(agg.totalTime / agg.total) : 0,
  }));

  const byAccuracyAsc = [...metrics].sort((a, b) => a.accuracy - b.accuracy);

  return {
    weakestSections: byAccuracyAsc.slice(0, 2),
    strongestSections: byAccuracyAsc.slice(-2).reverse(),
  };
}

// ── Trend ─────────────────────────────────────────────────────────────────────

export type Trend = "improving" | "declining" | "stable";

/**
 * Determines the accuracy trend from an ordered (oldest → newest) list of
 * per-attempt accuracy values (0–100).
 *
 * Algorithm: compare the average of the first half against the second half.
 *   Δ > +5  → "improving"
 *   Δ < -5  → "declining"
 *   otherwise → "stable"
 *
 * Requires at least 2 data points; with fewer returns "stable".
 */
export function computeSectionTrend(accuracies: number[]): Trend {
  if (accuracies.length < 2) return "stable";
  const mid = Math.floor(accuracies.length / 2);
  const older = accuracies.slice(0, mid);
  const newer = accuracies.slice(mid);
  const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length;
  const delta = avg(newer) - avg(older);
  if (delta > 5) return "improving";
  if (delta < -5) return "declining";
  return "stable";
}

export function trendLabel(trend: Trend): string {
  if (trend === "improving") return "Improving";
  if (trend === "declining") return "Needs attention";
  return "Stable";
}
