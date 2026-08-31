import { sqlClient } from "../lib/db";
import type { CurrentAffairsCategory } from "./core";
import { classifyCurrentAffairsSignal } from "./ingestion";

const PIB_NATIONAL_MARKERS = /\b(vice president|prime minister|president|union minister|ministry|department|secretary|government|commission|authority|notifies?|rules?|regulations?|mission|scheme|policy|action plan|convocation|inaugurates?|conducts?|releases?|launches?|approves?|adopts?|opens?|meets?|negotiations?)\b/i;
const INTERNATIONAL_MARKERS = /\b(cepa|bilateral|foreign|international|state visit|uzbekistan|chile|argentina|brics|summit|treaty|agreement|joint statement)\b/i;
const DEFENCE_MARKERS = /\b(defence|army|navy|air force|missile|military|cantonment|raksha mantri|drdo)\b/i;
const SPORTS_MARKERS = /\b(sports|fit india|championship|tournament|world cup|medal|cricket|hockey|badminton|athletics|run & ride|cycle)\b/i;
const APPOINTMENT_MARKERS = /\b(appointed|appointment|chairperson|chairman|governor|director general|secretary appointed|elected)\b/i;
const REPORT_MARKERS = /\b(report|index|ranking|survey|estimates|data release|annual report)\b/i;
const SCIENCE_MARKERS = /\b(science|technology|semiconductor|quantum|biotechnology|research|innovation)\b/i;

export type OfficialClassificationInput = {
  title: string;
  sourceKey: string;
  sourceFamily?: string | null;
  isPrimarySource: boolean;
  existingCategory?: string | null;
};

export function classifyOfficialCandidate(input: OfficialClassificationInput): {
  category: CurrentAffairsCategory;
  reason: string;
} {
  const existing = String(input.existingCategory ?? "").trim() as CurrentAffairsCategory;
  if (existing && existing !== "other") {
    return { category: existing, reason: "existing_specific_category" };
  }

  const sourceKey = input.sourceKey.toLowerCase();
  const sourceFamily = String(input.sourceFamily ?? sourceKey).toLowerCase();
  const classified = classifyCurrentAffairsSignal(input.title);
  if (classified.category !== "other") {
    return { category: classified.category, reason: "headline_classifier" };
  }
  if (!input.isPrimarySource) {
    return { category: "other", reason: "secondary_source_requires_explicit_category" };
  }

  if (sourceKey === "rbi" || sourceKey === "sebi" || sourceFamily === "rbi" || sourceFamily === "sebi") {
    return { category: "economy_banking", reason: "official_financial_institution" };
  }
  if (sourceKey === "isro" || sourceFamily === "isro") {
    return { category: "space", reason: "official_space_institution" };
  }
  if (sourceKey.startsWith("punjab_") || sourceFamily.startsWith("punjab")) {
    return { category: "punjab", reason: "official_punjab_institution" };
  }

  const isPib = sourceKey === "pib" || sourceFamily === "pib";
  if (!isPib) return { category: "other", reason: "no_safe_official_fallback" };

  const title = input.title.replace(/\s+/g, " ").trim();
  if (DEFENCE_MARKERS.test(title)) return { category: "defence", reason: "pib_defence_marker" };
  if (SPORTS_MARKERS.test(title)) return { category: "sports", reason: "pib_sports_marker" };
  if (APPOINTMENT_MARKERS.test(title)) return { category: "appointments", reason: "pib_appointment_marker" };
  if (REPORT_MARKERS.test(title)) return { category: "reports_indices", reason: "pib_report_marker" };
  if (SCIENCE_MARKERS.test(title)) return { category: "science_technology", reason: "pib_science_marker" };
  if (INTERNATIONAL_MARKERS.test(title)) return { category: "international", reason: "pib_international_marker" };
  if (PIB_NATIONAL_MARKERS.test(title) || classified.score >= 31) {
    return { category: "national", reason: "pib_official_exam_signal" };
  }
  return { category: "other", reason: "pib_signal_too_weak" };
}

function increment(map: Record<string, number>, key: string) {
  map[key] = (map[key] ?? 0) + 1;
}

export async function prepareOfficialYesterdayCandidates(targetDate: string) {
  const candidateRows = await sqlClient`
    SELECT candidate.id::text AS id,
           candidate.raw_title AS title,
           candidate.payload,
           source.source_key AS "sourceKey",
           source.source_family AS "sourceFamily",
           source.is_primary_source AS "isPrimarySource"
    FROM content.current_affairs_ingestion_candidates candidate
    JOIN content.current_affairs_sources source ON source.id=candidate.source_id
    WHERE candidate.published_at::date=${targetDate}::date
      AND source.is_active=true
      AND source.is_primary_source=true
    ORDER BY candidate.published_at, candidate.id
    LIMIT 1500
  `;

  let candidateUpdated = 0;
  const candidateCategories: Record<string, number> = {};
  for (const row of candidateRows) {
    const payload = row.payload && typeof row.payload === "object" ? row.payload as Record<string, unknown> : {};
    const existingCategory = typeof payload.categoryGuess === "string" ? payload.categoryGuess : null;
    const decision = classifyOfficialCandidate({
      title: String(row.title ?? ""),
      sourceKey: String(row.sourceKey ?? ""),
      sourceFamily: row.sourceFamily ? String(row.sourceFamily) : null,
      isPrimarySource: Boolean(row.isPrimarySource),
      existingCategory,
    });
    increment(candidateCategories, decision.category);
    if (existingCategory && existingCategory !== "other") continue;
    if (decision.category === "other") continue;
    await sqlClient`
      UPDATE content.current_affairs_ingestion_candidates
      SET payload=COALESCE(payload, '{}'::jsonb) || ${JSON.stringify({
        categoryGuess: decision.category,
        categoryGuessReason: decision.reason,
        categoryGuessVersion: "ca-cp032-official-v1",
      })}::jsonb,
          updated_at=now()
      WHERE id=${String(row.id)}::uuid
    `;
    candidateUpdated += 1;
  }

  const clusterRows = await sqlClient`
    SELECT cluster.id::text AS id,
           cluster.category_guess AS "existingCategory",
           candidate.raw_title AS title,
           candidate.payload,
           source.source_key AS "sourceKey",
           source.source_family AS "sourceFamily",
           source.is_primary_source AS "isPrimarySource"
    FROM content.current_affairs_clusters cluster
    JOIN content.current_affairs_cluster_members member
      ON member.cluster_id=cluster.id AND member.member_role='representative'
    JOIN content.current_affairs_ingestion_candidates candidate ON candidate.id=member.candidate_id
    JOIN content.current_affairs_sources source ON source.id=candidate.source_id
    WHERE cluster.status='open'
      AND cluster.event_date_guess=${targetDate}::date
      AND cluster.category_guess='other'
      AND source.is_primary_source=true
    ORDER BY cluster.id
    LIMIT 1000
  `;

  let clusterUpdated = 0;
  const clusterCategories: Record<string, number> = {};
  for (const row of clusterRows) {
    const payload = row.payload && typeof row.payload === "object" ? row.payload as Record<string, unknown> : {};
    const payloadCategory = typeof payload.categoryGuess === "string" ? payload.categoryGuess : null;
    const decision = classifyOfficialCandidate({
      title: String(row.title ?? ""),
      sourceKey: String(row.sourceKey ?? ""),
      sourceFamily: row.sourceFamily ? String(row.sourceFamily) : null,
      isPrimarySource: Boolean(row.isPrimarySource),
      existingCategory: payloadCategory && payloadCategory !== "other" ? payloadCategory : String(row.existingCategory ?? "other"),
    });
    increment(clusterCategories, decision.category);
    if (decision.category === "other") continue;
    await sqlClient`
      UPDATE content.current_affairs_clusters
      SET category_guess=${decision.category},
          metadata=COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({
            reclassifiedBy: "ca-cp032-official-v1",
            reclassificationReason: decision.reason,
            reclassifiedAt: new Date().toISOString(),
          })}::jsonb,
          updated_at=now()
      WHERE id=${String(row.id)}::uuid
        AND status='open'
        AND category_guess='other'
    `;
    clusterUpdated += 1;
  }

  return {
    targetDate,
    candidateExamined: candidateRows.length,
    candidateUpdated,
    candidateCategories,
    openOtherClustersExamined: clusterRows.length,
    clusterUpdated,
    clusterCategories,
    authority: {
      primarySourcesOnly: true,
      specificExistingCategoriesPreserved: true,
      manualPublicationAuthority: false,
    },
  };
}
