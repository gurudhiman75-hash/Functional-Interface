export interface DsfEditorialAuditRecord {
  readonly id: string;
  readonly stem: string;
  readonly statementI: string;
  readonly statementII: string;
  readonly explanation?: string;
  readonly solveModeId?: string;
  readonly contextId?: string;
  readonly objectKey?: string;
  readonly structuralFingerprint?: string;
}

export interface DsfEditorialAuditPolicy {
  readonly entityLexicon?: readonly string[];
  readonly nearDuplicateThreshold?: number;
  readonly minimumSharedTokens?: number;
  readonly compareAcrossSolveModes?: boolean;
  readonly maximumStructuralCluster?: number;
  readonly maximumExplanationOpeningCluster?: number;
  readonly explanationOpeningTokens?: number;
  readonly minimumContextCount?: number;
  readonly minimumObjectCount?: number;
  readonly maximumObjectShare?: number;
}

export interface DsfNearDuplicatePair {
  readonly leftId: string;
  readonly rightId: string;
  readonly score: number;
  readonly sameSolveMode: boolean;
}

export interface DsfDuplicateGroup {
  readonly key: string;
  readonly ids: readonly string[];
}

export interface DsfEditorialAuditResult {
  readonly recordCount: number;
  readonly normalizedDuplicateGroups: readonly DsfDuplicateGroup[];
  readonly statementSwapGroups: readonly DsfDuplicateGroup[];
  readonly nearDuplicatePairs: readonly DsfNearDuplicatePair[];
  readonly structuralClusters: readonly DsfDuplicateGroup[];
  readonly explanationOpeningClusters: readonly DsfDuplicateGroup[];
  readonly contextCounts: Readonly<Record<string, number>>;
  readonly objectCounts: Readonly<Record<string, number>>;
  readonly violations: readonly string[];
  readonly passed: boolean;
}

const ENTITY_SENTINEL = "dsfentity";
const NUMBER_SENTINEL = "dsfnumber";
const CURRENCY_SENTINEL = "dsfcurrency";

const DEFAULT_STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "determine", "does", "for", "from",
  "given", "if", "in", "is", "it", "of", "on", "or", "the", "then", "to", "what", "which", "with",
]);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceEntities(text: string, entityLexicon: readonly string[]): string {
  let output = text;
  const entities = [...new Set(entityLexicon.map((entity) => entity.trim()).filter(Boolean))]
    .sort((left, right) => right.length - left.length);
  for (const entity of entities) {
    output = output.replace(new RegExp(`\\b${escapeRegExp(entity)}\\b`, "giu"), ` ${ENTITY_SENTINEL} `);
  }
  return output;
}

export function normalizeDsfEditorialSurface(text: string, entityLexicon: readonly string[] = []): string {
  return replaceEntities(text.normalize("NFKC").toLowerCase(), entityLexicon)
    .replace(/[₹$£€]/gu, ` ${CURRENCY_SENTINEL} `)
    .replace(/\b\d+(?:\.\d+)?\s*%/gu, ` ${NUMBER_SENTINEL} percent `)
    .replace(/\b\d+(?:\.\d+)?\b/gu, ` ${NUMBER_SENTINEL} `)
    .replace(/≥/gu, " greater-or-equal ")
    .replace(/≤/gu, " less-or-equal ")
    .replace(/≠/gu, " not-equal ")
    .replace(/>/gu, " greater-than ")
    .replace(/</gu, " less-than ")
    .replace(/=/gu, " equal-to ")
    .replace(/[^\p{L}\p{N}-]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function orderedKey(record: DsfEditorialAuditRecord, entities: readonly string[]): string {
  return [
    normalizeDsfEditorialSurface(record.stem, entities),
    normalizeDsfEditorialSurface(record.statementI, entities),
    normalizeDsfEditorialSurface(record.statementII, entities),
  ].join(" || ");
}

function unorderedKey(record: DsfEditorialAuditRecord, entities: readonly string[]): string {
  const statements = [
    normalizeDsfEditorialSurface(record.statementI, entities),
    normalizeDsfEditorialSurface(record.statementII, entities),
  ].sort();
  return [normalizeDsfEditorialSurface(record.stem, entities), ...statements].join(" || ");
}

function groupByKey(entries: readonly { readonly id: string; readonly key: string }[]): DsfDuplicateGroup[] {
  const groups = new Map<string, string[]>();
  for (const entry of entries) {
    const bucket = groups.get(entry.key) ?? [];
    bucket.push(entry.id);
    groups.set(entry.key, bucket);
  }
  return [...groups.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([key, ids]) => ({ key, ids: Object.freeze([...ids].sort()) }))
    .sort((left, right) => left.key.localeCompare(right.key));
}

function meaningfulTokens(surface: string): readonly string[] {
  return surface.split(" ").filter((token) => token.length >= 2 && !DEFAULT_STOPWORDS.has(token));
}

function tokenSet(surface: string): ReadonlySet<string> {
  return new Set(meaningfulTokens(surface));
}

function bigramSet(surface: string): ReadonlySet<string> {
  const tokens = meaningfulTokens(surface);
  const output = new Set<string>();
  for (let index = 0; index + 1 < tokens.length; index += 1) output.add(`${tokens[index]} ${tokens[index + 1]}`);
  return output;
}

function jaccard(left: ReadonlySet<string>, right: ReadonlySet<string>): number {
  if (left.size === 0 && right.size === 0) return 1;
  let intersection = 0;
  for (const value of left) if (right.has(value)) intersection += 1;
  const union = left.size + right.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function similarity(left: string, right: string): number {
  const unigram = jaccard(tokenSet(left), tokenSet(right));
  const bigram = jaccard(bigramSet(left), bigramSet(right));
  return Number((0.65 * unigram + 0.35 * bigram).toFixed(6));
}

function canonicalComparisonSurface(record: DsfEditorialAuditRecord, entities: readonly string[]): string {
  const statements = [
    normalizeDsfEditorialSurface(record.statementI, entities),
    normalizeDsfEditorialSurface(record.statementII, entities),
  ].sort();
  return `${normalizeDsfEditorialSurface(record.stem, entities)} ${statements.join(" ")}`;
}

function candidatePairs(
  records: readonly DsfEditorialAuditRecord[],
  surfaces: readonly string[],
  minimumSharedTokens: number,
  compareAcrossSolveModes: boolean,
): readonly [number, number][] {
  const tokenToIndexes = new Map<string, number[]>();
  surfaces.forEach((surface, index) => {
    for (const token of new Set(meaningfulTokens(surface))) {
      if (token === NUMBER_SENTINEL || token === ENTITY_SENTINEL || token === CURRENCY_SENTINEL || token.length < 3) continue;
      const bucket = tokenToIndexes.get(token) ?? [];
      bucket.push(index);
      tokenToIndexes.set(token, bucket);
    }
  });

  const pairSharedCounts = new Map<string, number>();
  for (const indexes of tokenToIndexes.values()) {
    for (let first = 0; first < indexes.length; first += 1) {
      for (let second = first + 1; second < indexes.length; second += 1) {
        const left = indexes[first]!;
        const right = indexes[second]!;
        if (!compareAcrossSolveModes && records[left]!.solveModeId !== records[right]!.solveModeId) continue;
        const key = `${left}:${right}`;
        pairSharedCounts.set(key, (pairSharedCounts.get(key) ?? 0) + 1);
      }
    }
  }

  return [...pairSharedCounts.entries()]
    .filter(([, count]) => count >= minimumSharedTokens)
    .map(([key]) => key.split(":").map(Number) as [number, number]);
}

function countsFor(records: readonly DsfEditorialAuditRecord[], key: "contextId" | "objectKey"): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const record of records) {
    const value = record[key];
    if (!value) continue;
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return counts;
}

function openingKey(explanation: string, entities: readonly string[], tokenCount: number): string {
  return meaningfulTokens(normalizeDsfEditorialSurface(explanation, entities)).slice(0, tokenCount).join(" ");
}

export function auditDsfEditorialBatch(
  records: readonly DsfEditorialAuditRecord[],
  policy: DsfEditorialAuditPolicy = {},
): DsfEditorialAuditResult {
  const ids = records.map((record) => record.id);
  if (new Set(ids).size !== ids.length) throw new Error("DSF editorial audit requires unique record IDs.");

  const entities = policy.entityLexicon ?? [];
  const threshold = policy.nearDuplicateThreshold ?? 0.82;
  const minimumSharedTokens = policy.minimumSharedTokens ?? 4;
  const compareAcrossSolveModes = policy.compareAcrossSolveModes ?? false;
  const maximumStructuralCluster = policy.maximumStructuralCluster ?? 10;
  const maximumExplanationOpeningCluster = policy.maximumExplanationOpeningCluster ?? 12;
  const explanationOpeningTokens = policy.explanationOpeningTokens ?? 8;

  const orderedEntries = records.map((record) => ({ id: record.id, key: orderedKey(record, entities) }));
  const unorderedEntries = records.map((record) => ({ id: record.id, key: unorderedKey(record, entities) }));
  const normalizedDuplicateGroups = groupByKey(orderedEntries);
  const unorderedGroups = groupByKey(unorderedEntries);
  const orderedKeyById = new Map(orderedEntries.map((entry) => [entry.id, entry.key] as const));
  const statementSwapGroups = unorderedGroups.filter((group) => new Set(group.ids.map((id) => orderedKeyById.get(id))).size > 1);

  const surfaces = records.map((record) => canonicalComparisonSurface(record, entities));
  const exactUnorderedPairs = new Set<string>();
  for (const group of unorderedGroups) {
    for (let first = 0; first < group.ids.length; first += 1) for (let second = first + 1; second < group.ids.length; second += 1) {
      exactUnorderedPairs.add([group.ids[first]!, group.ids[second]!].sort().join("::"));
    }
  }

  const nearDuplicatePairs: DsfNearDuplicatePair[] = [];
  for (const [leftIndex, rightIndex] of candidatePairs(records, surfaces, minimumSharedTokens, compareAcrossSolveModes)) {
    const left = records[leftIndex]!;
    const right = records[rightIndex]!;
    const pairKey = [left.id, right.id].sort().join("::");
    if (exactUnorderedPairs.has(pairKey)) continue;
    const score = similarity(surfaces[leftIndex]!, surfaces[rightIndex]!);
    if (score < threshold) continue;
    nearDuplicatePairs.push({
      leftId: left.id,
      rightId: right.id,
      score,
      sameSolveMode: left.solveModeId === right.solveModeId,
    });
  }
  nearDuplicatePairs.sort((left, right) => right.score - left.score || left.leftId.localeCompare(right.leftId));

  const structuralClusters = groupByKey(records
    .filter((record) => record.structuralFingerprint)
    .map((record) => ({ id: record.id, key: record.structuralFingerprint! })))
    .filter((group) => group.ids.length > maximumStructuralCluster);

  const explanationOpeningClusters = groupByKey(records
    .filter((record) => record.explanation?.trim())
    .map((record) => ({ id: record.id, key: openingKey(record.explanation!, entities, explanationOpeningTokens) })))
    .filter((group) => group.key.length > 0 && group.ids.length > maximumExplanationOpeningCluster);

  const contextCounts = countsFor(records, "contextId");
  const objectCounts = countsFor(records, "objectKey");
  const violations: string[] = [];

  if (normalizedDuplicateGroups.length > 0) violations.push(`${normalizedDuplicateGroups.length} normalized duplicate group(s) detected.`);
  if (statementSwapGroups.length > 0) violations.push(`${statementSwapGroups.length} Statement-I/II swap duplicate group(s) detected.`);
  if (nearDuplicatePairs.length > 0) violations.push(`${nearDuplicatePairs.length} semantic near-duplicate pair(s) met or exceeded ${threshold}.`);
  if (structuralClusters.length > 0) violations.push(`${structuralClusters.length} structural fingerprint cluster(s) exceed ${maximumStructuralCluster}.`);
  if (explanationOpeningClusters.length > 0) violations.push(`${explanationOpeningClusters.length} explanation-opening cluster(s) exceed ${maximumExplanationOpeningCluster}.`);

  if (policy.minimumContextCount !== undefined && Object.keys(contextCounts).length < policy.minimumContextCount) {
    violations.push(`Context pool has ${Object.keys(contextCounts).length} unique values; requires at least ${policy.minimumContextCount}.`);
  }
  if (policy.minimumObjectCount !== undefined && Object.keys(objectCounts).length < policy.minimumObjectCount) {
    violations.push(`Object pool has ${Object.keys(objectCounts).length} unique values; requires at least ${policy.minimumObjectCount}.`);
  }
  if (policy.maximumObjectShare !== undefined && records.length > 0) {
    const maximumShare = Math.max(0, ...Object.values(objectCounts).map((count) => count / records.length));
    if (maximumShare > policy.maximumObjectShare) {
      violations.push(`Largest object share ${maximumShare.toFixed(4)} exceeds ${policy.maximumObjectShare}.`);
    }
  }

  return Object.freeze({
    recordCount: records.length,
    normalizedDuplicateGroups: Object.freeze(normalizedDuplicateGroups),
    statementSwapGroups: Object.freeze(statementSwapGroups),
    nearDuplicatePairs: Object.freeze(nearDuplicatePairs),
    structuralClusters: Object.freeze(structuralClusters),
    explanationOpeningClusters: Object.freeze(explanationOpeningClusters),
    contextCounts: Object.freeze({ ...contextCounts }),
    objectCounts: Object.freeze({ ...objectCounts }),
    violations: Object.freeze(violations),
    passed: violations.length === 0,
  });
}
