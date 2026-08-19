import { canonicalDigest } from "../canonical.ts";
import { SEA_001_ENGLISH_NAME_POOL } from "../generation/name-pool.ts";
import { seatCountOf, type AuditCaselet } from "./corpus.ts";

export interface Sea001CloneClusterStats {
  readonly uniqueCount: number;
  readonly cloneCaseletCount: number;
  readonly cloneClusterCount: number;
  readonly largestCluster: number;
}

export interface Sea001StructuralCloneAudit {
  readonly caseletCount: number;
  readonly authorityStructure: Sea001CloneClusterStats;
  readonly familyStructure: Sea001CloneClusterStats;
  readonly nearStructure: Sea001CloneClusterStats;
  readonly lexicalTemplate: Sea001CloneClusterStats;
  readonly structuralQueryCombination: Sea001CloneClusterStats;
  readonly authorityStructureByBlueprint: Readonly<Record<string, Sea001CloneClusterStats>>;
  readonly participantExtractionFailureCount: number;
  readonly methodology: "ROLE_GRAPH_V1_TELEMETRY_ONLY";
  readonly thresholdStatus: "UNSET_PENDING_MEASUREMENT";
}

type ClueRecord = Readonly<{
  shape: string;
  mentions: readonly string[];
}>;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsWholeWord(text: string, value: string): boolean {
  return new RegExp(`\\b${escapeRegExp(value)}\\b`, "u").test(text);
}

function solverParticipants(caselet: AuditCaselet): readonly string[] {
  const key = caselet.solverOracleAgreement.productionKeys[0] ?? "";
  const orderPart = key.split("|")[0] ?? "";
  const separator = orderPart.includes(">") ? ">" : ",";
  return [...new Set(orderPart
    .split(separator)
    .map((value) => value.trim())
    .filter(Boolean))];
}

/**
 * Structural canonicalisation must operate on the names that actually occur in rendered
 * clue text. Circular/mixed generators keep P1/P2/... inside solver keys but replace them
 * with broad display names before learners see the caselet. Using solver IDs here would
 * miss every rendered participant mention and falsely inflate novelty.
 */
function participantsOf(caselet: AuditCaselet): readonly string[] {
  const learnerSurface = [
    caselet.setupText,
    ...caselet.clueTexts,
    ...caselet.children.flatMap((child) => [
      child.text,
      ...child.options.map((option) => option.display),
    ]),
  ].join("\n");
  const rendered = SEA_001_ENGLISH_NAME_POOL.filter((name) => containsWholeWord(learnerSurface, name));
  return rendered.length ? rendered : solverParticipants(caselet);
}

function participantExtractionComplete(caselet: AuditCaselet): boolean {
  return participantsOf(caselet).length === seatCountOf(caselet);
}

function swapDirectionalWords(value: string): string {
  return value
    .replace(/\banticlockwise\b/gi, "__SEA_ACW__")
    .replace(/\bclockwise\b/gi, "anticlockwise")
    .replace(/__SEA_ACW__/g, "clockwise")
    .replace(/\bleft\b/gi, "__SEA_LEFT__")
    .replace(/\bright\b/gi, "left")
    .replace(/__SEA_LEFT__/g, "right");
}

function normalizeWhitespace(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function clueRecords(
  caselet: AuditCaselet,
  mirror: boolean,
  maskNumbers: boolean,
): readonly ClueRecord[] {
  const participants = [...participantsOf(caselet)].sort((left, right) => right.length - left.length);
  return caselet.clueTexts.map((source) => {
    let text = mirror ? swapDirectionalWords(source) : source;
    const mentions: { id: string; index: number; ordinal: number }[] = [];
    for (const personId of participants) {
      const expression = new RegExp(`\\b${escapeRegExp(personId)}\\b`, "g");
      let match: RegExpExecArray | null;
      let ordinal = 0;
      while ((match = expression.exec(text)) !== null) {
        mentions.push({ id: personId, index: match.index, ordinal });
        ordinal += 1;
      }
    }
    mentions.sort((left, right) => left.index - right.index || left.ordinal - right.ordinal || left.id.localeCompare(right.id));

    for (const personId of participants) {
      text = text.replace(new RegExp(`\\b${escapeRegExp(personId)}\\b`, "g"), "@PERSON");
    }
    if (maskNumbers) text = text.replace(/\b\d+\b/g, "#");
    return {
      shape: normalizeWhitespace(text),
      mentions: mentions.map((mention) => mention.id),
    };
  });
}

function roleGraphPayload(caselet: AuditCaselet, mirror: boolean, maskNumbers: boolean) {
  const participants = participantsOf(caselet);
  const records = clueRecords(caselet, mirror, maskNumbers);
  let colors = new Map<string, string>();

  for (const personId of participants) {
    const features = records.flatMap((record) => {
      const slots = record.mentions
        .map((mentioned, index) => mentioned === personId ? index : -1)
        .filter((index) => index >= 0);
      return slots.map((slot) => `${record.shape}|self:${slot}`);
    }).sort();
    colors.set(personId, canonicalDigest(features));
  }

  for (let iteration = 0; iteration < 4; iteration += 1) {
    const next = new Map<string, string>();
    for (const personId of participants) {
      const features = records.flatMap((record) => {
        const slots = record.mentions
          .map((mentioned, index) => mentioned === personId ? index : -1)
          .filter((index) => index >= 0);
        if (!slots.length) return [];
        const neighborhood = record.mentions.map((mentioned, index) => `${index}:${colors.get(mentioned) ?? "?"}`).join(",");
        return slots.map((slot) => `${record.shape}|self:${slot}|neighbors:${neighborhood}`);
      }).sort();
      next.set(personId, canonicalDigest(features));
    }
    colors = next;
  }

  const canonicalClues = records.map((record) => ({
    shape: record.shape,
    roles: record.mentions.map((personId) => colors.get(personId) ?? "?"),
  })).sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));

  return {
    checkpointId: caselet.checkpointId,
    seatCount: seatCountOf(caselet),
    clues: canonicalClues,
  };
}

function symmetryNormalizedPayload(caselet: AuditCaselet, maskNumbers: boolean) {
  const direct = roleGraphPayload(caselet, false, maskNumbers);
  const mirrored = roleGraphPayload(caselet, true, maskNumbers);
  const directText = JSON.stringify(direct);
  const mirroredText = JSON.stringify(mirrored);
  return directText <= mirroredText ? direct : mirrored;
}

export function sea001AuthorityStructureFingerprint(caselet: AuditCaselet): string {
  return canonicalDigest({
    blueprintAuthorityId: caselet.blueprintAuthorityId,
    structure: symmetryNormalizedPayload(caselet, false),
  });
}

export function sea001FamilyStructureFingerprint(caselet: AuditCaselet): string {
  return canonicalDigest(symmetryNormalizedPayload(caselet, false));
}

export function sea001NearStructureFingerprint(caselet: AuditCaselet): string {
  return canonicalDigest(symmetryNormalizedPayload(caselet, true));
}

export function sea001StructuralQueryCombinationFingerprint(caselet: AuditCaselet): string {
  return canonicalDigest({
    structure: symmetryNormalizedPayload(caselet, false),
    queries: caselet.children.map((child) => child.queryContractId).sort(),
  });
}

export function sea001LexicalTemplateFingerprint(caselet: AuditCaselet): string {
  const participants = [...participantsOf(caselet)].sort((left, right) => right.length - left.length);
  const normalize = (source: string) => {
    let text = source;
    for (const personId of participants) {
      text = text.replace(new RegExp(`\\b${escapeRegExp(personId)}\\b`, "g"), "PERSON");
    }
    return normalizeWhitespace(text)
      .replace(/\b\d+\b/g, "#")
      .replace(/\b(?:first|second|third|fourth|fifth|sixth|seventh|eighth|ninth)\b/g, "ORDINAL");
  };
  return canonicalDigest({
    checkpointId: caselet.checkpointId,
    setup: normalize(caselet.setupText),
    clues: caselet.clueTexts.map(normalize).sort(),
    questions: caselet.children.map((child) => ({
      queryContractId: child.queryContractId,
      text: normalize(child.text),
    })).sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right))),
  });
}

function clusterStats(fingerprints: readonly string[]): Sea001CloneClusterStats {
  const counts = new Map<string, number>();
  for (const fingerprint of fingerprints) counts.set(fingerprint, (counts.get(fingerprint) ?? 0) + 1);
  const clusterSizes = [...counts.values()];
  return {
    uniqueCount: counts.size,
    cloneCaseletCount: clusterSizes.reduce((sum, size) => sum + Math.max(0, size - 1), 0),
    cloneClusterCount: clusterSizes.filter((size) => size > 1).length,
    largestCluster: clusterSizes.length ? Math.max(...clusterSizes) : 0,
  };
}

export function auditSea001StructuralClones(caselets: readonly AuditCaselet[]): Sea001StructuralCloneAudit {
  const byBlueprint = new Map<string, string[]>();
  const authorityFingerprints: string[] = [];
  const familyFingerprints: string[] = [];
  const nearFingerprints: string[] = [];
  const lexicalFingerprints: string[] = [];
  const structuralQueryFingerprints: string[] = [];
  let participantExtractionFailureCount = 0;

  for (const caselet of caselets) {
    if (!participantExtractionComplete(caselet)) participantExtractionFailureCount += 1;
    const authority = sea001AuthorityStructureFingerprint(caselet);
    authorityFingerprints.push(authority);
    familyFingerprints.push(sea001FamilyStructureFingerprint(caselet));
    nearFingerprints.push(sea001NearStructureFingerprint(caselet));
    lexicalFingerprints.push(sea001LexicalTemplateFingerprint(caselet));
    structuralQueryFingerprints.push(sea001StructuralQueryCombinationFingerprint(caselet));
    const values = byBlueprint.get(caselet.blueprintAuthorityId) ?? [];
    values.push(authority);
    byBlueprint.set(caselet.blueprintAuthorityId, values);
  }

  return {
    caseletCount: caselets.length,
    authorityStructure: clusterStats(authorityFingerprints),
    familyStructure: clusterStats(familyFingerprints),
    nearStructure: clusterStats(nearFingerprints),
    lexicalTemplate: clusterStats(lexicalFingerprints),
    structuralQueryCombination: clusterStats(structuralQueryFingerprints),
    authorityStructureByBlueprint: Object.fromEntries([...byBlueprint.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([blueprint, fingerprints]) => [blueprint, clusterStats(fingerprints)])),
    participantExtractionFailureCount,
    methodology: "ROLE_GRAPH_V1_TELEMETRY_ONLY",
    thresholdStatus: "UNSET_PENDING_MEASUREMENT",
  };
}
