import { createHash } from 'node:crypto';

export const NOTE_OUTLINE_POLICY_VERSION = 'notes-outline-v1';
export const NOTE_SECTION_PROMPT_POLICY_VERSION = 'notes-section-v1';

export type OutlineTarget = {
  id: string;
  label: string;
  sourceKind: string;
  required: boolean;
};

export type PlannedSection = {
  sectionKey: string;
  title: string;
  objective: string;
  position: number;
  targetIds: string[];
  targetLabels: string[];
};

export type SectionEvidenceClaim = {
  id: string;
  claimText: string;
  claimType: string;
};

export type GeneratedSectionOutput = {
  title: string;
  markdown: string;
  usedClaimIds: string[];
  warnings: string[];
};

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function clean(value: string): string {
  return value.replace(/[\s\u00a0]+/g, ' ').trim();
}

function shortKey(value: string): string {
  return sha256(value).slice(0, 10);
}

function sectionTitle(labels: string[], fallback: string): string {
  if (labels.length === 0) return fallback;
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} & ${labels[1]}`;
  return `${labels[0]} + ${labels.length - 1} related areas`;
}

export function planOutlineSections(
  topicTitle: string,
  targets: OutlineTarget[],
  maxSections = 10,
): PlannedSection[] {
  const safeMax = Math.max(1, Math.min(16, Math.floor(maxSections)));
  const ordered = [...targets].sort((a, b) => {
    if (a.sourceKind === 'topic' && b.sourceKind !== 'topic') return -1;
    if (b.sourceKind === 'topic' && a.sourceKind !== 'topic') return 1;
    if (a.required !== b.required) return a.required ? -1 : 1;
    return a.label.localeCompare(b.label);
  });
  if (ordered.length === 0) return [];

  const topic = ordered.find((target) => target.sourceKind === 'topic');
  const remaining = topic ? ordered.filter((target) => target.id !== topic.id) : ordered;
  const groups: OutlineTarget[][] = [];
  if (topic) groups.push([topic]);

  const slots = Math.max(1, safeMax - groups.length);
  if (remaining.length <= slots) {
    for (const target of remaining) groups.push([target]);
  } else {
    const chunkSize = Math.ceil(remaining.length / slots);
    for (let index = 0; index < remaining.length; index += chunkSize) {
      groups.push(remaining.slice(index, index + chunkSize));
    }
  }

  return groups.slice(0, safeMax).map((group, position) => {
    const labels = group.map((target) => clean(target.label)).filter(Boolean);
    const title = sectionTitle(labels, clean(topicTitle) || `Section ${position + 1}`);
    const targetIds = group.map((target) => target.id);
    const stable = [...targetIds].sort().join('|');
    return {
      sectionKey: `s${String(position + 1).padStart(2, '0')}-${shortKey(stable)}`,
      title,
      objective: `Explain the exam-relevant concepts and facts needed to cover: ${labels.join('; ')}.`,
      position,
      targetIds,
      targetLabels: labels,
    };
  });
}

export function outlineInputHash(input: {
  jobId: string;
  evidenceRunId: string;
  policyVersion?: string;
  targets: OutlineTarget[];
}): string {
  return sha256(JSON.stringify({
    jobId: input.jobId,
    evidenceRunId: input.evidenceRunId,
    policyVersion: input.policyVersion ?? NOTE_OUTLINE_POLICY_VERSION,
    targets: [...input.targets]
      .map((target) => ({ id: target.id, label: clean(target.label), sourceKind: target.sourceKind, required: target.required }))
      .sort((a, b) => a.id.localeCompare(b.id)),
  }));
}

export function sectionInputHash(input: {
  jobId: string;
  sectionId: string;
  evidenceRunId: string;
  targetIds: string[];
  claims: SectionEvidenceClaim[];
  promptPolicyVersion?: string;
}): string {
  return sha256(JSON.stringify({
    jobId: input.jobId,
    sectionId: input.sectionId,
    evidenceRunId: input.evidenceRunId,
    targetIds: [...input.targetIds].sort(),
    promptPolicyVersion: input.promptPolicyVersion ?? NOTE_SECTION_PROMPT_POLICY_VERSION,
    claims: [...input.claims]
      .map((claim) => ({ id: claim.id, claimText: clean(claim.claimText), claimType: claim.claimType }))
      .sort((a, b) => a.id.localeCompare(b.id)),
  }));
}

export const SECTION_RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string', minLength: 3, maxLength: 180 },
    markdown: { type: 'string', minLength: 80, maxLength: 14000 },
    usedClaimIds: {
      type: 'array',
      minItems: 1,
      uniqueItems: true,
      items: { type: 'string' },
    },
    warnings: {
      type: 'array',
      maxItems: 12,
      items: { type: 'string', maxLength: 300 },
    },
  },
  required: ['title', 'markdown', 'usedClaimIds', 'warnings'],
} as const;

export function buildSectionGenerationRequest(input: {
  noteTitle: string;
  sectionTitle: string;
  objective: string;
  targetLabels: string[];
  depth: string;
  learnerLevel: string;
  claims: SectionEvidenceClaim[];
}) {
  const claimLines = input.claims.map((claim) => `- [${claim.id}] (${claim.claimType}) ${clean(claim.claimText)}`);
  return {
    prompt: {
      system: [
        'You are ExamTree Notes Studio, an exam-preparation authoring engine.',
        'Write original learner-facing study notes using ONLY the accepted evidence claims supplied in the request.',
        'Do not use outside knowledge, do not infer missing facts, and do not invent examples, dates, numbers, names, exceptions or legal provisions.',
        'Independently phrase the learner copy. Do not reproduce source-like sentences or mention sources, evidence IDs, prompts, models or the authoring process.',
        'Preserve exact factual names, constitutional/legal identifiers, dates, numbers and percentages when they appear in accepted evidence.',
        'The markdown field must contain the section BODY only: no H1 or H2 heading. H3 subheadings, bullets, tables and bold text are allowed when useful.',
        'Optimize for competitive-exam revision: concise definitions, distinctions, traps, high-yield facts and structured recall. Avoid filler and motivational prose.',
        'If accepted evidence is too thin for part of the objective, omit unsupported content and add a short warning instead of guessing.',
      ].join(' '),
      user: [
        `Note title: ${clean(input.noteTitle)}`,
        `Section: ${clean(input.sectionTitle)}`,
        `Objective: ${clean(input.objective)}`,
        `Coverage targets: ${input.targetLabels.map(clean).join('; ')}`,
        `Depth: ${clean(input.depth) || 'standard'}`,
        `Learner level: ${clean(input.learnerLevel) || 'standard'}`,
        'Return strict JSON matching the supplied schema.',
      ].join('\n'),
    },
    input: `ACCEPTED EVIDENCE CLAIMS\n${claimLines.join('\n')}`,
    responseSchema: SECTION_RESPONSE_SCHEMA,
    responseSchemaName: 'notes_studio_section',
  };
}

function stringArray(value: unknown, maxItems: number, maxLength: number): string[] | null {
  if (!Array.isArray(value) || value.length > maxItems) return null;
  const result: string[] = [];
  for (const item of value) {
    if (typeof item !== 'string') return null;
    const normalized = item.trim();
    if (!normalized || normalized.length > maxLength) return null;
    result.push(normalized);
  }
  return result;
}

export function normalizeGeneratedSectionOutput(
  value: unknown,
  allowedClaimIds: string[],
): GeneratedSectionOutput | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  const title = typeof raw.title === 'string' ? clean(raw.title) : '';
  let markdown = typeof raw.markdown === 'string' ? raw.markdown.trim() : '';
  markdown = markdown.replace(/^```(?:markdown|md)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const usedClaimIds = stringArray(raw.usedClaimIds, 120, 80);
  const warnings = Array.isArray(raw.warnings) && raw.warnings.length === 0
    ? []
    : stringArray(raw.warnings, 12, 300);
  if (title.length < 3 || title.length > 180) return null;
  if (markdown.length < 80 || markdown.length > 14000) return null;
  if (/^#\s+/m.test(markdown) || /^##\s+/m.test(markdown)) return null;
  if (!usedClaimIds || usedClaimIds.length === 0 || warnings === null) return null;
  const allowed = new Set(allowedClaimIds);
  if (usedClaimIds.some((claimId) => !allowed.has(claimId))) return null;
  return { title, markdown, usedClaimIds: [...new Set(usedClaimIds)], warnings };
}

export function outputHash(markdown: string): string {
  return sha256(markdown.trim());
}

export function assembleNoteDraft(input: {
  noteTitle: string;
  sections: Array<{ sectionTitle: string; markdown: string }>;
}): string {
  const noteTitle = clean(input.noteTitle);
  if (!noteTitle || input.sections.length === 0) return '';
  const blocks = [`# ${noteTitle}`];
  for (const section of input.sections) {
    const title = clean(section.sectionTitle);
    const markdown = section.markdown.trim();
    if (!title || !markdown) return '';
    blocks.push(`## ${title}\n\n${markdown}`);
  }
  return `${blocks.join('\n\n')}\n`;
}

export function draftInputHash(input: {
  jobId: string;
  outlineVersionId: string;
  sectionVersions: Array<{ id: string; outputHash: string }>;
}): string {
  return sha256(JSON.stringify({
    jobId: input.jobId,
    outlineVersionId: input.outlineVersionId,
    sectionVersions: [...input.sectionVersions]
      .map((section) => ({ id: section.id, outputHash: section.outputHash }))
      .sort((a, b) => a.id.localeCompare(b.id)),
  }));
}
