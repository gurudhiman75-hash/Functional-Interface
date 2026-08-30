import type { NoteSourceRole, SourcePackRequirementStatus } from './source-pack-policy';

export type SourcePackProposalCandidate = {
  sourceId: string;
  title: string;
  publisher: string;
  generationReady: boolean;
  relevanceScore: number;
  relevanceReason: string;
  approvedUses: number;
  roleUses: Partial<Record<NoteSourceRole, number>>;
};

export type SourcePackProposalItem = {
  requirementCode: string;
  sourceId: string;
  title: string;
  publisher: string;
  suggestedRole: NoteSourceRole;
  generationReady: boolean;
  score: number;
  reason: string;
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

export function buildSourcePackProposal(
  requirements: SourcePackRequirementStatus[],
  candidates: SourcePackProposalCandidate[],
) {
  const selected = new Set<string>();
  const selectedPublishers = new Set<string>();
  const items: SourcePackProposalItem[] = [];
  const unresolved: Array<{ requirementCode: string; label: string; missingCount: number }> = [];

  for (const requirement of requirements.filter((item) => !item.satisfied)) {
    let needed = Math.max(0, requirement.minCount - requirement.currentCount);
    while (needed > 0) {
      const ranked = candidates
        .filter((candidate) => !selected.has(candidate.sourceId))
        .filter((candidate) => !requirement.generationReadyOnly || candidate.generationReady)
        .map((candidate) => ({
          candidate,
          role: preferredRole(candidate, requirement.roles),
          affinity: roleAffinity(candidate, requirement.roles),
        }))
        .filter((entry): entry is typeof entry & { role: NoteSourceRole } => entry.role !== null && entry.affinity > 0)
        .map((entry) => ({
          ...entry,
          effectiveScore: entry.candidate.relevanceScore
            + entry.affinity * 25
            + entry.candidate.approvedUses * 10
            + (entry.candidate.publisher && !selectedPublishers.has(entry.candidate.publisher.toLowerCase()) ? 8 : 0),
        }))
        .sort((left, right) =>
          right.effectiveScore - left.effectiveScore
          || left.candidate.title.localeCompare(right.candidate.title)
          || left.candidate.sourceId.localeCompare(right.candidate.sourceId),
        );

      const winner = ranked[0];
      if (!winner) break;
      selected.add(winner.candidate.sourceId);
      if (winner.candidate.publisher) selectedPublishers.add(winner.candidate.publisher.toLowerCase());
      items.push({
        requirementCode: requirement.code,
        sourceId: winner.candidate.sourceId,
        title: winner.candidate.title,
        publisher: winner.candidate.publisher,
        suggestedRole: winner.role,
        generationReady: winner.candidate.generationReady,
        score: winner.effectiveScore,
        reason: `${winner.candidate.relevanceReason}; previously used as ${winner.role.replaceAll('_', ' ')}`,
      });
      needed -= 1;
    }

    if (needed > 0) {
      unresolved.push({ requirementCode: requirement.code, label: requirement.label, missingCount: needed });
    }
  }

  return {
    items,
    unresolved,
    complete: unresolved.length === 0,
    automaticAttachment: false,
    requiresExplicitEditorApply: true,
  };
}
