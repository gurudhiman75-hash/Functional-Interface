import { Router, type IRouter } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import { classifyResearchQueueItem, researchQueueLimit, researchQueueRank } from '../notes-studio/research-queue';
import { loadNotesStudioSourcePackProposal } from './admin-notes-studio-source-pack-proposals';

const router: IRouter = Router();
const PROPOSAL_CONCURRENCY = 4;

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function briefField(brief: unknown, key: string): string {
  if (!brief || typeof brief !== 'object' || Array.isArray(brief)) return '';
  return text((brief as Record<string, unknown>)[key], 300);
}

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, mapper: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= items.length) return;
      results[index] = await mapper(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

router.use(authenticate);

router.get('/research-queue', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const limit = researchQueueLimit(req.query.limit);
    const rows = await sqlClient`
      SELECT id::text AS id, title, state, brief, updated_at AS "updatedAt"
      FROM content.note_authoring_jobs
      WHERE state IN ('brief', 'sources_ready')
      ORDER BY updated_at ASC, created_at ASC
      LIMIT ${limit}
    `;

    const evaluated = await mapWithConcurrency(rows, PROPOSAL_CONCURRENCY, async (row) => {
      try {
        const result = await loadNotesStudioSourcePackProposal(String(row.id));
        const status = classifyResearchQueueItem({
          policyReady: result.policy.ready,
          proposedItems: result.proposal.items.length,
          unresolvedRequirements: result.proposal.unresolved.length,
        });
        return {
          id: String(row.id),
          title: String(row.title),
          state: String(row.state),
          updatedAt: row.updatedAt,
          taxonomyCode: briefField(row.brief, 'taxonomyCode'),
          topicLabel: briefField(row.brief, 'topicLabel'),
          depth: briefField(row.brief, 'depth') || 'standard',
          sourcePackTemplate: result.job.sourcePackTemplate,
          policy: {
            ready: result.policy.ready,
            name: result.policy.name,
            missing: result.policy.missing.map((item) => ({
              code: item.code,
              label: item.label,
              currentCount: item.currentCount,
              minCount: item.minCount,
            })),
          },
          proposal: {
            complete: result.proposal.complete,
            itemCount: result.proposal.items.length,
            candidateCount: result.candidateCount,
            unresolved: result.proposal.unresolved,
          },
          queueStatus: status,
          queueRank: researchQueueRank(status),
          evaluationError: null,
        };
      } catch (error) {
        console.error('Unable to evaluate Notes Studio research queue job', row.id, error);
        return {
          id: String(row.id),
          title: String(row.title),
          state: String(row.state),
          updatedAt: row.updatedAt,
          taxonomyCode: briefField(row.brief, 'taxonomyCode'),
          topicLabel: briefField(row.brief, 'topicLabel'),
          depth: briefField(row.brief, 'depth') || 'standard',
          sourcePackTemplate: briefField(row.brief, 'sourcePackTemplate') || 'balanced',
          policy: { ready: false, name: 'Evaluation unavailable', missing: [] },
          proposal: { complete: false, itemCount: 0, candidateCount: 0, unresolved: [] },
          queueStatus: 'manual_research_required' as const,
          queueRank: researchQueueRank('manual_research_required'),
          evaluationError: error instanceof Error ? error.message.slice(0, 300) : 'Evaluation failed',
        };
      }
    });

    evaluated.sort((left, right) =>
      left.queueRank - right.queueRank
      || new Date(String(left.updatedAt)).getTime() - new Date(String(right.updatedAt)).getTime()
      || left.title.localeCompare(right.title),
    );

    const summary = {
      total: evaluated.length,
      readyForEvidence: evaluated.filter((item) => item.queueStatus === 'ready_for_evidence').length,
      proposalReady: evaluated.filter((item) => item.queueStatus === 'proposal_ready').length,
      partialProposal: evaluated.filter((item) => item.queueStatus === 'partial_proposal').length,
      manualResearchRequired: evaluated.filter((item) => item.queueStatus === 'manual_research_required').length,
      evaluationErrors: evaluated.filter((item) => item.evaluationError).length,
    };

    res.json({
      items: evaluated,
      summary,
      limit,
      proposalConcurrency: PROPOSAL_CONCURRENCY,
      externalNetworkSearch: false,
      automaticProposalApply: false,
      automaticEvidenceGeneration: false,
      rawSourceBodiesReturned: false,
    });
  } catch (error) {
    console.error('Unable to load Notes Studio research queue', error);
    res.status(500).json({ error: 'Unable to load Notes Studio research queue', code: 'NOTES_STUDIO_RESEARCH_QUEUE_FAILED' });
  }
});

export default router;
