import { Router, type IRouter } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import {
  NOTES_STUDIO_MIGRATIONS,
  assessNotesStudioProductionReadiness,
  inspectNotesStudioSchema,
} from '../notes-studio/production-readiness';
import {
  notesStudioAIConfigured,
  resolveNotesStudioAIProvider,
  resolveNotesStudioModel,
} from '../notes-studio/shared-ai-provider';

const router: IRouter = Router();

function notesSourceDiscoveryConfiguration(authoringProvider: string) {
  const requested = String(process.env.NOTES_STUDIO_SEARCH_PROVIDER ?? '').trim().toLowerCase();
  const automaticProvider = String(process.env.TAVILY_API_KEY ?? '').trim()
    ? 'tavily'
    : (authoringProvider === 'openai' || authoringProvider === 'gemini' ? authoringProvider : 'unconfigured');
  const provider = requested && requested !== 'auto' ? requested : automaticProvider;

  if (provider === 'tavily') {
    return {
      provider,
      configured: Boolean(String(process.env.TAVILY_API_KEY ?? '').trim()),
      model: 'tavily-search-basic',
    };
  }
  if (provider === 'gemini') {
    return {
      provider,
      configured: Boolean(String(process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY ?? '').trim()),
      model: String(process.env.NOTES_STUDIO_SEARCH_MODEL ?? '').trim() || 'gemini-3.6-flash',
    };
  }
  if (provider === 'openai') {
    return {
      provider,
      configured: Boolean(String(process.env.OPENAI_API_KEY ?? '').trim()),
      model: String(process.env.NOTES_STUDIO_OPENAI_SEARCH_MODEL ?? '').trim() || 'provider default web-search model',
    };
  }
  return { provider, configured: false, model: null };
}

router.use(authenticate);

router.get('/operations/readiness', requireAdminPermission('content.questions.read'), async (_req, res) => {
  try {
    const schema = await inspectNotesStudioSchema(sqlClient);
    const provider = resolveNotesStudioAIProvider();
    const providerConfigured = notesStudioAIConfigured(provider);
    const sectionModel = resolveNotesStudioModel(provider, ['NOTES_STUDIO_SECTION_MODEL', 'NOTES_STUDIO_MODEL']);
    const localizationModel = resolveNotesStudioModel(provider, ['NOTES_STUDIO_LOCALIZATION_MODEL', 'NOTES_STUDIO_MODEL']);
    const sourceDiscovery = notesSourceDiscoveryConfiguration(provider);
    const modelConfiguration = {
      provider,
      sectionModelConfigured: providerConfigured && Boolean(sectionModel),
      sectionModel: sectionModel || null,
      localizationModelConfigured: providerConfigured && Boolean(localizationModel),
      localizationModel: localizationModel || null,
      modelApiKeyConfigured: providerConfigured,
      sourceDiscoveryProvider: sourceDiscovery.provider,
      sourceDiscoveryConfigured: sourceDiscovery.configured,
      sourceDiscoveryModel: sourceDiscovery.model,
    };

    let stateCounts: Array<Record<string, unknown>> = [];
    let sourceFailures: Array<Record<string, unknown>> = [];
    let generationFailures: Array<Record<string, unknown>> = [];
    let failedQualityRuns: Array<Record<string, unknown>> = [];
    let releaseCounts: Array<Record<string, unknown>> = [];

    if (schema.ready) {
      [stateCounts, sourceFailures, generationFailures, failedQualityRuns, releaseCounts] = await Promise.all([
        sqlClient`
          SELECT state, COUNT(*)::int AS count
          FROM content.note_authoring_jobs
          GROUP BY state
          ORDER BY state
        `,
        sqlClient`
          SELECT id::text AS id, title, source_type AS "sourceType", source_uri AS "sourceUri",
                 failure_reason AS "failureReason", updated_at AS "updatedAt"
          FROM content.source_documents
          WHERE extraction_status = 'failed'
          ORDER BY updated_at DESC
          LIMIT 20
        `,
        sqlClient`
          SELECT event.id::text AS id, event.job_id::text AS "jobId", job.title AS "jobTitle",
                 event.error_code AS "errorCode", event.error_message AS "errorMessage",
                 event.model, event.created_at AS "createdAt", event.finished_at AS "finishedAt"
          FROM content.note_generation_events event
          JOIN content.note_authoring_jobs job ON job.id = event.job_id
          WHERE event.status = 'failed'
          ORDER BY event.created_at DESC
          LIMIT 20
        `,
        sqlClient`
          SELECT run.id::text AS id, run.job_id::text AS "jobId", job.title AS "jobTitle", section.title AS "sectionTitle", run.fail_count AS "failCount",
                 run.warning_count AS "warningCount", run.created_at AS "createdAt"
          FROM content.note_quality_runs run
          JOIN content.note_authoring_jobs job ON job.id = run.job_id
          JOIN content.note_sections section ON section.id = run.section_id
          WHERE run.status = 'failed'
          ORDER BY run.created_at DESC
          LIMIT 20
        `,
        sqlClient`
          SELECT
            (SELECT COUNT(*)::int FROM content.note_approved_versions) AS "approvedVersions",
            (SELECT COUNT(*)::int FROM content.note_materializations) AS "sourceMaterializations",
            (SELECT COUNT(*)::int FROM content.note_localizations WHERE state = 'materialized') AS "localizedMaterializations",
            (SELECT COUNT(*)::int FROM content.note_publish_handoffs) AS "publishHandoffs"
        `,
      ]);
    }

    const assessment = assessNotesStudioProductionReadiness({
      schemaReady: schema.ready,
      sectionModelConfigured: modelConfiguration.sectionModelConfigured,
      localizationModelConfigured: modelConfiguration.localizationModelConfigured,
      modelApiKeyConfigured: modelConfiguration.modelApiKeyConfigured,
      failedSourceCount: sourceFailures.length,
      failedGenerationCount: generationFailures.length,
      failedQualityRunCount: failedQualityRuns.length,
    });

    res.json({
      generatedAt: new Date().toISOString(),
      schema,
      migrations: {
        orderedFiles: NOTES_STUDIO_MIGRATIONS,
        operatorCommand: 'pnpm --dir artifacts/api-server exec esbuild notes-studio-migrate.ts --bundle --packages=external --platform=node --format=esm --outfile=dist/notes-studio-migrate.mjs && node artifacts/api-server/dist/notes-studio-migrate.mjs',
        automaticProductionMigration: true,
      },
      modelConfiguration,
      assessment,
      stateCounts,
      sourceFailures,
      generationFailures,
      failedQualityRuns,
      releaseCounts: releaseCounts[0] ?? {
        approvedVersions: 0,
        sourceMaterializations: 0,
        localizedMaterializations: 0,
        publishHandoffs: 0,
      },
      safety: {
        rawSourceBodiesSentToSectionWriter: false,
        rawResearchSourcesSentToLocalization: false,
        handoffPublishesResource: false,
        automaticPublicationEnabled: false,
      },
    });
  } catch (error) {
    console.error('Unable to inspect Notes Studio production readiness', error);
    res.status(500).json({ error: 'Unable to inspect Notes Studio production readiness', code: 'NOTES_STUDIO_READINESS_FAILED' });
  }
});

export default router;
