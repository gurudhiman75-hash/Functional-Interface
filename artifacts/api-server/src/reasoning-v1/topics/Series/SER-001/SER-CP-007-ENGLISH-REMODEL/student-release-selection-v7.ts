import type { SerCp007EditorialQuestion } from "./adaptive-review";
import type { SerCp007AdaptiveReviewV7 } from "./adaptive-review-v7";

export interface SerCp007ReleaseEntryV7 {
  readonly question: SerCp007EditorialQuestion;
  readonly review: SerCp007AdaptiveReviewV7;
}

export interface SerCp007PrimarySelectionV7 {
  readonly primary: readonly SerCp007ReleaseEntryV7[];
  readonly standardPrimary: readonly SerCp007ReleaseEntryV7[];
  readonly advancedPrimary: readonly SerCp007ReleaseEntryV7[];
  readonly primaryIds: ReadonlySet<string>;
  readonly taskCounts: Readonly<Record<string, number>>;
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

function identity(entry: SerCp007ReleaseEntryV7): string {
  return `${entry.question.temporaryTemplateId}:${entry.question.seed}`;
}

function groupByPool(
  entries: readonly SerCp007ReleaseEntryV7[],
): ReadonlyMap<string, readonly SerCp007ReleaseEntryV7[]> {
  const groups = new Map<string, SerCp007ReleaseEntryV7[]>();
  for (const entry of entries) {
    const pool = entry.review.studentReleasePoolKey;
    groups.set(pool, [...(groups.get(pool) ?? []), entry]);
  }
  return groups;
}

function onePerTask(
  entries: readonly SerCp007ReleaseEntryV7[],
): ReadonlyMap<string, SerCp007ReleaseEntryV7> {
  const map = new Map<string, SerCp007ReleaseEntryV7>();
  for (const entry of [...entries].sort((left, right) =>
    identity(left).localeCompare(identity(right)),
  )) {
    if (!map.has(entry.review.editorialTaskKind)) {
      map.set(entry.review.editorialTaskKind, entry);
    }
  }
  return map;
}

function chooseBalancedFlexiblePrimaries(
  pools: readonly (readonly [string, readonly SerCp007ReleaseEntryV7[]])[],
): readonly SerCp007ReleaseEntryV7[] {
  const flexibleTasks = [
    "NEXT_TERM",
    "MISSING_TERM",
    "REPLACE_WRONG_TERM",
    "PREVIOUS_TERM",
  ] as const;
  const poolCount = pools.length;
  const quotas: Record<(typeof flexibleTasks)[number], number> = {
    NEXT_TERM: Math.round(poolCount * 0.68),
    MISSING_TERM: Math.round(poolCount * 0.23),
    REPLACE_WRONG_TERM: Math.round(poolCount * 0.06),
    PREVIOUS_TERM: 0,
  };
  quotas.PREVIOUS_TERM =
    poolCount -
    quotas.NEXT_TERM -
    quotas.MISSING_TERM -
    quotas.REPLACE_WRONG_TERM;
  if (quotas.PREVIOUS_TERM < 0) {
    quotas.NEXT_TERM += quotas.PREVIOUS_TERM;
    quotas.PREVIOUS_TERM = 0;
  }

  const counts = new Map<string, number>();
  const selected: SerCp007ReleaseEntryV7[] = [];
  const ordered = [...pools].sort((left, right) => {
    const leftTasks = onePerTask(left[1]).size;
    const rightTasks = onePerTask(right[1]).size;
    if (leftTasks !== rightTasks) return leftTasks - rightTasks;
    return stableHash(left[0]) - stableHash(right[0]);
  });

  for (const [, entries] of ordered) {
    const byTask = onePerTask(entries);
    const available = flexibleTasks.filter((task) => byTask.has(task));
    const task = [...available].sort((left, right) => {
      const leftQuota = Math.max(1, quotas[left]);
      const rightQuota = Math.max(1, quotas[right]);
      const leftRemaining =
        (quotas[left] - (counts.get(left) ?? 0)) / leftQuota;
      const rightRemaining =
        (quotas[right] - (counts.get(right) ?? 0)) / rightQuota;
      if (leftRemaining !== rightRemaining) return rightRemaining - leftRemaining;
      return flexibleTasks.indexOf(left) - flexibleTasks.indexOf(right);
    })[0];
    if (!task) {
      throw new Error("A flexible V7 release pool has no supported task form.");
    }
    selected.push(byTask.get(task)!);
    counts.set(task, (counts.get(task) ?? 0) + 1);
  }
  return selected;
}

function selectAdvancedPrimary(
  entries: readonly SerCp007ReleaseEntryV7[],
): SerCp007ReleaseEntryV7 {
  const priority = [
    "MISSING_TERM",
    "REPLACE_WRONG_TERM",
    "NEXT_TERM",
    "PREVIOUS_TERM",
    "NEXT_TWO_TERMS",
    "MISSING_TWO_TERMS",
    "WRONG_AND_REPLACEMENT",
    "FILL_GAPS",
    "FILL_GAP_GROUPS",
  ];
  return [...entries].sort((left, right) => {
    const leftTask = priority.indexOf(left.review.editorialTaskKind);
    const rightTask = priority.indexOf(right.review.editorialTaskKind);
    const normalizedLeft = leftTask < 0 ? 99 : leftTask;
    const normalizedRight = rightTask < 0 ? 99 : rightTask;
    if (normalizedLeft !== normalizedRight) return normalizedLeft - normalizedRight;
    return identity(left).localeCompare(identity(right));
  })[0]!;
}

export function selectSerCp007PrimaryReleaseV7(
  entries: readonly SerCp007ReleaseEntryV7[],
): SerCp007PrimarySelectionV7 {
  const grouped = groupByPool(entries);
  const forcedStandard: SerCp007ReleaseEntryV7[] = [];
  const flexibleStandard: Array<
    readonly [string, readonly SerCp007ReleaseEntryV7[]]
  > = [];
  const advancedOnly: SerCp007ReleaseEntryV7[][] = [];

  for (const [pool, poolEntries] of grouped) {
    const standard = poolEntries.filter(
      (entry) => entry.review.releaseTier === "STANDARD_MOCK",
    );
    if (standard.length === 0) {
      advancedOnly.push([...poolEntries]);
      continue;
    }
    const tasks = onePerTask(standard);
    const flexibleTaskCount = [
      "NEXT_TERM",
      "MISSING_TERM",
      "REPLACE_WRONG_TERM",
      "PREVIOUS_TERM",
    ].filter((task) => tasks.has(task)).length;
    if (tasks.size === 1 || flexibleTaskCount < 2) {
      forcedStandard.push(
        [...standard].sort((left, right) =>
          identity(left).localeCompare(identity(right)),
        )[0]!,
      );
    } else {
      flexibleStandard.push([pool, standard]);
    }
  }

  const standardPrimary = [
    ...forcedStandard,
    ...chooseBalancedFlexiblePrimaries(flexibleStandard),
  ];
  const advancedPrimary = advancedOnly.map(selectAdvancedPrimary);
  const primary = [...standardPrimary, ...advancedPrimary];
  assertSerCp007ReleasePoolUniquenessV7(primary);

  const taskCounts = new Map<string, number>();
  for (const entry of standardPrimary) {
    const task = entry.review.editorialTaskKind;
    taskCounts.set(task, (taskCounts.get(task) ?? 0) + 1);
  }
  return {
    primary,
    standardPrimary,
    advancedPrimary,
    primaryIds: new Set(primary.map(identity)),
    taskCounts: Object.fromEntries([...taskCounts.entries()].sort()),
  };
}

export function assertSerCp007ReleasePoolUniquenessV7(
  entries: readonly SerCp007ReleaseEntryV7[],
): void {
  const seen = new Set<string>();
  for (const entry of entries) {
    const pool = entry.review.studentReleasePoolKey;
    if (seen.has(pool)) {
      throw new Error(`Duplicate SER-001 student release pool: ${pool}`);
    }
    seen.add(pool);
  }
}

export function excludeRecentSerCp007ReleasePoolsV7(
  entries: readonly SerCp007ReleaseEntryV7[],
  blockedPoolKeys: ReadonlySet<string>,
): readonly SerCp007ReleaseEntryV7[] {
  const filtered = entries.filter(
    (entry) => !blockedPoolKeys.has(entry.review.studentReleasePoolKey),
  );
  assertSerCp007ReleasePoolUniquenessV7(filtered);
  return filtered;
}
