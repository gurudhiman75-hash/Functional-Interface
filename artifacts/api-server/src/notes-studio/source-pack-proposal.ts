import type { NoteSourceRole, SourcePackRequirementStatus } from './source-pack-policy';

export type SourcePackProposalEvidencePath = 'retained_ready' | 'reference_review_required' | 'provenance_only';

export type SourcePackProposalCandidate = {
  sourceId: string;
  title: string;
  publisher: string;
  generationReady: boolean;
  referenceReviewEligible?: boolean;
  relevanceScore: number;
  relevanceReason: string;
  approvedUses: number;
  roleUses: Partial<Record<NoteSourceRole, number>>;
  contentHash?: string;
  sourceIdentity?: string | null;
};

export type SourcePackProposalItem = {
  requirementCode: string;
  sourceId: string;
  title: string;
  publisher: string;
  suggestedRole: NoteSourceRole;
  generationReady: boolean;
  referenceReviewRequired: boolean;
  satisfiesRequirementNow: boolean;
  evidencePath: SourcePackProposalEvidencePath;
  score: number;
  reason: string;
};

export type SourcePackProposalOptions = {
  existingContentHashes?: string[];
  existingSourceIdentities?: string[];
  minUniqueContent?: number;
  minDistinctIdentities?: number;
};

type ProposalUnresolved = {
  requirementCode: string;
  label: string;
  missingCount: number;
  pendingReferenceReviewCount?: number;
};

function roleAffinity(candidate: SourcePackProposalCandidate, roles: NoteSourceRole[]) {
  return Math.max(...roles.map((role) => candidate.roleUses[role] ?? 0), 0);
}

function preferredRole(candidate: SourcePackProposalCandidate, roles: NoteSourceRole[]): NoteSourceRole | null {
  return [...roles]
    .map((role) => ({ role, uses: candidate.roleUses[role] ?? 0 }))
    .filter((entry) => entry.uses > 0)
    .sort((left, right) => right.uses - left.uses || left.role.localeCompare(right.role))[0]?.role ?? null;
}

function normalizedHash(value: unknown) {
  return String(value ?? '').trim().toLowerCase();
}

function normalizedIdentity(value: unknown) {
  return String(value ?? '').trim().toLowerCase();
}

function evidencePath(candidate: SourcePackProposalCandidate): SourcePackProposalEvidencePath {
  if (candidate.generationReady) return 'retained_ready';
  if (candidate.referenceReviewEligible) return 'reference_review_required';
  return 'provenance_only';
}

export function buildSourcePackProposal(
  requirements: SourcePackRequirementStatus[],
  candidates: SourcePackProposalCandidate[],
  options: SourcePackProposalOptions = {},
) {
  const selected = new Set<string>();
  const selectedContent = new Set((options.existingContentHashes ?? []).map(normalizedHash).filter(Boolean));
  const selectedIdentities = new Set((options.existingSourceIdentities ?? []).map(normalizedIdentity).filter(Boolean));
  const items: SourcePackProposalItem[] = [];
  const unresolved: ProposalUnresolved[] = [];
  const allRequirementRoles = [...new Set(requirements.flatMap((requirement) => requirement.roles))];

  const addWinner = (
    winner: { candidate: SourcePackProposalCandidate; role: NoteSourceRole; effectiveScore: number },
    requirementCode: string,
    reasonSuffix: string,
    satisfiesRequirementNow: boolean,
  ) => {
    selected.add(winner.candidate.sourceId);
    const hash = normalizedHash(winner.candidate.contentHash);
    const identity = normalizedIdentity(winner.candidate.sourceIdentity);
    if (hash) selectedContent.add(hash);
    if (identity) selectedIdentities.add(identity);
    const path = evidencePath(winner.candidate);
    items.push({
      requirementCode,
      sourceId: winner.candidate.sourceId,
      title: winner.candidate.title,
      publisher: winner.candidate.publisher,
      suggestedRole: winner.role,
      generationReady: winner.candidate.generationReady,
      referenceReviewRequired: path === 'reference_review_required',
      satisfiesRequirementNow,
      evidencePath: path,
      score: winner.effectiveScore,
      reason: `${winner.candidate.relevanceReason}; ${reasonSuffix}`,
    });
  };

  const rankCandidates = (
    roles: NoteSourceRole[],
    readiness: 'ready' | 'reference_review' | 'any',
    requireNewContent: boolean,
    requireNewIdentity: boolean,
  ) => candidates
    .filter((candidate) => !selected.has(candidate.sourceId))
    .filter((candidate) => readiness !== 'ready' || candidate.generationReady)
    .filter((candidate) => readiness !== 'reference_review' || (!candidate.generationReady && candidate.referenceReviewEligible === true))
    .filter((candidate) => {
      const hash = normalizedHash(candidate.contentHash);
      return !requireNewContent || !hash || !selectedContent.has(hash);
    })
    .filter((candidate) => {
      const identity = normalizedIdentity(candidate.sourceIdentity);
      return !requireNewIdentity || (Boolean(identity) && !selectedIdentities.has(identity));
    })
    .map((candidate) => ({
      candidate,
      role: preferredRole(candidate, roles),
      affinity: roleAffinity(candidate, roles),
    }))
    .filter((entry): entry is typeof entry & { role: NoteSourceRole } => entry.role !== null && entry.affinity > 0)
    .map((entry) => {
      const hash = normalizedHash(entry.candidate.contentHash);
      const identity = normalizedIdentity(entry.candidate.sourceIdentity);
      return {
        ...entry,
        effectiveScore: entry.candidate.relevanceScore
          + entry.affinity * 25
          + entry.candidate.approvedUses * 10
          + (entry.candidate.generationReady ? 20 : 0)
          + (entry.candidate.referenceReviewEligible ? 8 : 0)
          + (hash && !selectedContent.has(hash) ? 12 : 0)
          + (identity && !selectedIdentities.has(identity) ? 16 : 0),
      };
    })
    .sort((left, right) =>
      right.effectiveScore - left.effectiveScore
      || left.candidate.title.localeCompare(right.candidate.title)
      || left.candidate.sourceId.localeCompare(right.candidate.sourceId),
    );

  for (const requirement of requirements.filter((item) => !item.satisfied)) {
    let needed = Math.max(0, requirement.minCount - requirement.currentCount);

    if (requirement.generationReadyOnly) {
      while (needed > 0) {
        const winner = rankCandidates(requirement.roles, 'ready', true, false)[0];
        if (!winner) break;
        addWinner(winner, requirement.code, `previously used as ${winner.role.replaceAll('_', ' ')}`, true);
        needed -= 1;
      }

      let pendingReferenceReviewCount = 0;
      while (pendingReferenceReviewCount < needed) {
        const staged = rankCandidates(requirement.roles, 'reference_review', true, false)[0];
        if (!staged) break;
        addWinner(
          staged,
          requirement.code,
          `previously reviewed as ${staged.role.replaceAll('_', ' ')}; fresh reference review is required for this job`,
          false,
        );
        pendingReferenceReviewCount += 1;
      }

      if (needed > 0) {
        unresolved.push({
          requirementCode: requirement.code,
          label: requirement.label,
          missingCount: needed,
          ...(pendingReferenceReviewCount > 0 ? { pendingReferenceReviewCount } : {}),
        });
      }
      continue;
    }

    while (needed > 0) {
      const winner = rankCandidates(requirement.roles, 'any', true, false)[0];
      if (!winner) break;
      addWinner(winner, requirement.code, `previously used as ${winner.role.replaceAll('_', ' ')}`, true);
      needed -= 1;
    }

    if (needed > 0) {
      unresolved.push({ requirementCode: requirement.code, label: requirement.label, missingCount: needed });
    }
  }

  const minUniqueContent = Math.max(0, options.minUniqueContent ?? 0);
  const minDistinctIdentities = Math.max(0, options.minDistinctIdentities ?? 0);
  while (selectedContent.size < minUniqueContent || selectedIdentities.size < minDistinctIdentities) {
    const needContent = selectedContent.size < minUniqueContent;
    const needIdentity = selectedIdentities.size < minDistinctIdentities;
    const ranked = rankCandidates(allRequirementRoles, 'any', needContent, needIdentity)
      .filter((entry) => {
        const matchingRequirements = requirements.filter((requirement) => requirement.roles.includes(entry.role));
        return matchingRequirements.some((requirement) =>
          !requirement.generationReadyOnly || entry.candidate.generationReady || entry.candidate.referenceReviewEligible === true,
        );
      });
    const winner = ranked[0];
    if (!winner) break;
    addWinner(
      winner,
      'source_integrity',
      `adds independent ${needContent && needIdentity ? 'content and source identity' : needContent ? 'content' : 'source identity'}`,
      true,
    );
  }

  const missingUniqueContent = Math.max(0, minUniqueContent - selectedContent.size);
  const missingIdentities = Math.max(0, minDistinctIdentities - selectedIdentities.size);
  if (missingUniqueContent > 0) {
    unresolved.push({ requirementCode: 'source_integrity_unique_content', label: 'Independent content copies', missingCount: missingUniqueContent });
  }
  if (missingIdentities > 0) {
    unresolved.push({ requirementCode: 'source_integrity_identity', label: 'Independent publisher/domain identities', missingCount: missingIdentities });
  }

  return {
    items,
    unresolved,
    complete: unresolved.length === 0,
    projectedIntegrity: {
      uniqueContentCount: selectedContent.size,
      distinctIdentityCount: selectedIdentities.size,
      minUniqueContent,
      minDistinctIdentities,
    },
    automaticAttachment: false,
    requiresExplicitEditorApply: true,
    historicalReferenceEvidenceTransferred: false,
  };
}
