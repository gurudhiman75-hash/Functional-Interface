export type AutoPickHeadline = {
  candidateId: string;
  category: string;
  autoEligible: boolean;
  manualSelected: boolean;
  candidateStatus: string;
  isPrimarySource: boolean;
  relevanceScore: number;
  clusterId: string | null;
  linkedEventId: string | null;
  linkedEventStatus: string | null;
};

export const AUTO_PICK_DEFAULT_LIMIT = 15;
export const AUTO_PICK_MIN_SCORE = 65;
export const AUTO_PICK_PER_CATEGORY = 4;

const storyKey = (item: AutoPickHeadline) => item.linkedEventId ?? item.clusterId ?? item.candidateId;

// Only picks stories that can pass verification: an official source, or an
// already verified event. News-only headlines stay available for manual choice.
export function autoPickHeadlines(items: AutoPickHeadline[], limit = AUTO_PICK_DEFAULT_LIMIT) {
  const selected = items.filter((item) => item.manualSelected);
  const stories = new Set(selected.map(storyKey));
  const perCategory = new Map<string, number>();
  for (const item of selected) perCategory.set(item.category, (perCategory.get(item.category) ?? 0) + 1);

  const ranked = items
    .filter((item) => !item.manualSelected
      && item.autoEligible
      && item.candidateStatus !== "rejected"
      && item.linkedEventStatus !== "rejected"
      && item.relevanceScore >= AUTO_PICK_MIN_SCORE
      && (item.isPrimarySource || item.linkedEventStatus === "verified"))
    .sort((a, b) => b.relevanceScore - a.relevanceScore
      || Number(b.linkedEventStatus === "verified") - Number(a.linkedEventStatus === "verified")
      || a.candidateId.localeCompare(b.candidateId));

  const picks: AutoPickHeadline[] = [];
  for (const item of ranked) {
    if (selected.length + picks.length >= limit) break;
    const count = perCategory.get(item.category) ?? 0;
    if (stories.has(storyKey(item)) || count >= AUTO_PICK_PER_CATEGORY) continue;
    picks.push(item);
    stories.add(storyKey(item));
    perCategory.set(item.category, count + 1);
  }
  return picks;
}
