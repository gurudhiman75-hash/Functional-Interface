import { sqlClient } from "../lib/db";
import { refreshDailyDiscoveryCensus } from "./daily-discovery-census";
import { materializeDailyMasterPacks } from "./daily-master-pack";
import {
  repairSelectedRephrasedLocalizations,
  SELECTED_BLOCKER_CLOSURE_VERSION,
} from "./selected-blocker-closure-runtime";
import {
  closeSelectedResidualBlockers,
  SELECTED_RESIDUAL_BLOCKER_CLOSURE_VERSION,
} from "./selected-residual-blocker-closure-runtime";
import {
  closeSelectedRbiFinalMile,
  SELECTED_RBI_FINAL_MILE_CLOSURE_VERSION,
} from "./selected-rbi-final-mile-closure";
import {
  selectedAffairsProcessingBlockers,
  selectedAffairsProcessingStage,
  type SelectedAffairsProcessingState,
} from "./selected-affairs-processing-policy";

type BaseItem = Record<string, unknown> & {
  eventId?: string | null;
  blockers?: string[];
};

async function loadFinalStates(eventIds: string[]) {
  if (eventIds.length === 0) return [];
  const rows = await sqlClient`
    SELECT
      event.id::text AS "eventId",
      event.public_code AS "publicCode",
      event.canonical_title AS title,
      event.status AS "eventStatus",
      event.learner_authoring_status AS "authoringStatus",
      COALESCE(facts.count, 0)::int AS "verifiedFactCount",
      COALESCE(conflicts.count, 0)::int AS "openConflictCount",
      COALESCE(evidence.official_count, 0)::int AS "officialEvidenceCount",
      COALESCE(evidence.supported_count, 0)::int AS "supportedOfficialEvidenceCount",
      COALESCE(hi.status, 'missing') AS "hindiStatus",
      COALESCE(pa.status, 'missing') AS "punjabiStatus"
    FROM content.current_affairs_events event
    LEFT JOIN LATERAL (
      SELECT count(*)::int AS count
      FROM content.current_affairs_facts fact
      WHERE fact.event_id=event.id AND fact.is_verified=true
    ) facts ON true
    LEFT JOIN LATERAL (
      SELECT count(*)::int AS count
      FROM content.current_affairs_fact_conflicts conflict
      WHERE conflict.event_id=event.id AND conflict.status='open'
    ) conflicts ON true
    LEFT JOIN LATERAL (
      SELECT
        count(*) FILTER (WHERE item.is_primary_evidence=true)::int AS official_count,
        count(*) FILTER (
          WHERE item.is_primary_evidence=true
            AND source.source_key IN ('pib','rbi','sebi','isro','punjab_gov')
        )::int AS supported_count
      FROM content.current_affairs_event_sources item
      JOIN content.current_affairs_sources source ON source.id=item.source_id
      WHERE item.event_id=event.id
    ) evidence ON true
    LEFT JOIN content.current_affairs_localizations hi
      ON hi.event_id=event.id
      AND hi.authoring_version_id=event.learner_authoring_version_id
      AND hi.language_code='hi'
    LEFT JOIN content.current_affairs_localizations pa
      ON pa.event_id=event.id
      AND pa.authoring_version_id=event.learner_authoring_version_id
      AND pa.language_code='pa'
    WHERE event.id = ANY(${eventIds}::uuid[])
  `;
  return rows.map((row) => ({
    eventId: String(row.eventId),
    publicCode: String(row.publicCode),
    title: String(row.title ?? ""),
    eventStatus: String(row.eventStatus),
    authoringStatus: String(row.authoringStatus ?? "pending"),
    verifiedFactCount: Number(row.verifiedFactCount ?? 0),
    openConflictCount: Number(row.openConflictCount ?? 0),
    officialEvidenceCount: Number(row.officialEvidenceCount ?? 0),
    supportedOfficialEvidenceCount: Number(row.supportedOfficialEvidenceCount ?? 0),
    hindiStatus: String(row.hindiStatus ?? "missing"),
    punjabiStatus: String(row.punjabiStatus ?? "missing"),
  }));
}

export async function finalizeSelectedBlockerClosure(args: {
  targetDate: string;
  actorUserId: string;
  baseResult: Record<string, any>;
}) {
  const residualClosure = await closeSelectedResidualBlockers({
    targetDate: args.targetDate,
    actorUserId: args.actorUserId,
  });
  const rbiFinalMile = await closeSelectedRbiFinalMile({
    targetDate: args.targetDate,
    actorUserId: args.actorUserId,
  });
  const localizationRepair = await repairSelectedRephrasedLocalizations(args.targetDate);
  if (
    residualClosure.reprocessedEventCount > 0
    || rbiFinalMile.reprocessedEventCount > 0
    || localizationRepair.repairedLocalizations > 0
  ) {
    const census = await refreshDailyDiscoveryCensus(args.targetDate);
    await materializeDailyMasterPacks(args.targetDate, String(census.id));
  }

  const baseItems = Array.isArray(args.baseResult.items) ? args.baseResult.items as BaseItem[] : [];
  const eventIds = [...new Set(baseItems.map((item) => item.eventId).filter((id): id is string => Boolean(id)))];
  const states = await loadFinalStates(eventIds);
  const stateById = new Map(states.map((state) => [state.eventId, state]));

  const items = baseItems.map((item) => {
    const eventId = item.eventId ? String(item.eventId) : null;
    if (!eventId) return item;
    const state = stateById.get(eventId);
    if (!state) return item;
    const priorBlockers = Array.isArray(item.blockers) ? item.blockers.map(String) : [];
    const processingState: SelectedAffairsProcessingState = {
      reviewEventPresent: true,
      eventStatus: state.eventStatus,
      verifiedFactCount: state.verifiedFactCount,
      openConflictCount: state.openConflictCount,
      officialEvidenceCount: state.officialEvidenceCount,
      supportedOfficialEvidenceCount: state.supportedOfficialEvidenceCount,
      enrichmentFailureCount: priorBlockers.includes("primary_enrichment_failed") ? 1 : 0,
      authoringStatus: state.authoringStatus,
      hindiStatus: state.hindiStatus,
      punjabiStatus: state.punjabiStatus,
    };
    const blockers = selectedAffairsProcessingBlockers(processingState);
    return {
      ...item,
      publicCode: state.publicCode,
      title: state.title,
      eventStatus: state.eventStatus,
      authoringStatus: state.authoringStatus,
      hindiStatus: state.hindiStatus,
      punjabiStatus: state.punjabiStatus,
      verifiedFactCount: state.verifiedFactCount,
      officialEvidenceCount: state.officialEvidenceCount,
      supportedOfficialEvidenceCount: state.supportedOfficialEvidenceCount,
      blockers,
      stage: selectedAffairsProcessingStage(processingState),
      ready: blockers.length === 0,
    };
  });

  const ready = items.filter((item) => Boolean(item.ready)).length;
  const verified = items.filter((item) => String(item.eventStatus ?? "") === "verified").length;
  const blocked = items.length - ready;
  return {
    ...args.baseResult,
    completedAt: new Date().toISOString(),
    summary: {
      selected: items.length,
      verified,
      ready,
      blocked,
      verificationBlocked: items.filter((item) => item.stage === "verification").length,
      englishBlocked: items.filter((item) => item.stage === "english").length,
      localizationBlocked: items.filter((item) => item.stage === "localization").length,
    },
    items,
    blockerClosure: {
      closureVersion: SELECTED_BLOCKER_CLOSURE_VERSION,
      residualClosureVersion: SELECTED_RESIDUAL_BLOCKER_CLOSURE_VERSION,
      rbiFinalMileClosureVersion: SELECTED_RBI_FINAL_MILE_CLOSURE_VERSION,
      repairedLocalizations: localizationRepair.repairedLocalizations,
      examinedLocalizationEvents: localizationRepair.examinedEvents,
      residualCandidatesExamined: residualClosure.candidatesExamined,
      residualEvidenceRecoveryCandidates: residualClosure.evidenceRecoveryCandidates,
      residualInsertedFactCount: residualClosure.insertedFactCount,
      residualRecurringTitleRepairCount: residualClosure.recurringTitleRepairCount,
      residualReprocessedEventCount: residualClosure.reprocessedEventCount,
      rbiFinalMileCandidatesExamined: rbiFinalMile.candidatesExamined,
      rbiFinalMileRecoveredCandidates: rbiFinalMile.recoveredCandidates,
      rbiFinalMileInsertedFactCount: rbiFinalMile.insertedFactCount,
      rbiFinalMileReprocessedEventCount: rbiFinalMile.reprocessedEventCount,
      rbiFinalMileFetchDiagnostics: rbiFinalMile.diagnostics,
    },
  };
}
