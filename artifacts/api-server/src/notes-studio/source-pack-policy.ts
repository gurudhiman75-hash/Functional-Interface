export const NOTE_SOURCE_ROLES = [
  'primary_authority',
  'core_reference',
  'exam_context',
  'supplemental',
] as const;

export type NoteSourceRole = typeof NOTE_SOURCE_ROLES[number];

export const NOTE_SOURCE_PACK_TEMPLATES = ['balanced', 'official_first', 'reference_led', 'exam_focused', 'quick_revision'] as const;
export type NoteSourcePackTemplateKey = typeof NOTE_SOURCE_PACK_TEMPLATES[number];

export type SourcePackPolicySource = {
  sourceRole: NoteSourceRole;
  inclusionState: string;
  generationReady: boolean;
  referenceEvidenceReady?: boolean;
  contentHash?: string | null;
  sourceIdentity?: string | null;
};

type RequirementDefinition = {
  code: string;
  label: string;
  roles: NoteSourceRole[];
  minCount: number;
  /** Legacy field name retained in the API shape. When true, the source must be evidence-ready:
   * either authorized retained text or at least one reviewed editor reference note. */
  generationReadyOnly: boolean;
};

export type SourcePackRequirementStatus = RequirementDefinition & {
  currentCount: number;
  satisfied: boolean;
};

export type SourcePackIntegrityFinding = {
  code: 'INSUFFICIENT_UNIQUE_CONTENT' | 'INSUFFICIENT_SOURCE_IDENTITIES';
  label: string;
  currentCount: number;
  minCount: number;
};

export type SourcePackPolicyEvaluation = {
  templateKey: NoteSourcePackTemplateKey;
  name: string;
  description: string;
  ready: boolean;
  requirements: SourcePackRequirementStatus[];
  missing: SourcePackRequirementStatus[];
  integrity: {
    minUniqueContent: number;
    minDistinctIdentities: number;
    uniqueContentCount: number;
    distinctIdentityCount: number;
    findings: SourcePackIntegrityFinding[];
    ready: boolean;
  };
};

const TEMPLATES: Record<NoteSourcePackTemplateKey, {
  name: string;
  description: string;
  minUniqueContent: number;
  minDistinctIdentities: number;
  requirements: RequirementDefinition[];
}> = {
  balanced: {
    name: 'Balanced static note',
    description: 'Requires two independent evidence-ready core sources. A source may qualify through authorized retained text or an explicit reviewed reference note.',
    minUniqueContent: 2,
    minDistinctIdentities: 2,
    requirements: [
      {
        code: 'two_core_sources',
        label: 'Two evidence-ready authority/reference sources',
        roles: ['primary_authority', 'core_reference'],
        minCount: 2,
        generationReadyOnly: true,
      },
    ],
  },
  official_first: {
    name: 'Official-first',
    description: 'Requires an evidence-ready primary authority plus an independent evidence-ready reference. Reference-only sources qualify only after explicit editor-authored reference evidence exists.',
    minUniqueContent: 2,
    minDistinctIdentities: 2,
    requirements: [
      {
        code: 'primary_authority',
        label: 'Evidence-ready primary authority',
        roles: ['primary_authority'],
        minCount: 1,
        generationReadyOnly: true,
      },
      {
        code: 'core_reference',
        label: 'Evidence-ready core reference',
        roles: ['core_reference'],
        minCount: 1,
        generationReadyOnly: true,
      },
    ],
  },
  reference_led: {
    name: 'Reference-led',
    description: 'Requires two evidence-ready standard references where no single official primary authority is appropriate.',
    minUniqueContent: 2,
    minDistinctIdentities: 2,
    requirements: [
      {
        code: 'two_references',
        label: 'Two evidence-ready core references',
        roles: ['core_reference'],
        minCount: 2,
        generationReadyOnly: true,
      },
    ],
  },
  exam_focused: {
    name: 'Exam-focused',
    description: 'Requires an explicit syllabus/PYQ/notification context source plus one evidence-ready authority or reference.',
    minUniqueContent: 2,
    minDistinctIdentities: 1,
    requirements: [
      {
        code: 'exam_context',
        label: 'Exam-context source',
        roles: ['exam_context'],
        minCount: 1,
        generationReadyOnly: false,
      },
      {
        code: 'core_evidence',
        label: 'Evidence-ready authority/reference source',
        roles: ['primary_authority', 'core_reference'],
        minCount: 1,
        generationReadyOnly: true,
      },
    ],
  },
  quick_revision: {
    name: 'Quick revision',
    description: 'Requires one evidence-ready authority or reference for deliberately narrow revision notes.',
    minUniqueContent: 1,
    minDistinctIdentities: 1,
    requirements: [
      {
        code: 'one_core_source',
        label: 'Evidence-ready authority/reference source',
        roles: ['primary_authority', 'core_reference'],
        minCount: 1,
        generationReadyOnly: true,
      },
    ],
  },
};

export function noteSourceRole(value: unknown): NoteSourceRole {
  const normalized = String(value ?? '').trim().toLowerCase();
  return (NOTE_SOURCE_ROLES as readonly string[]).includes(normalized)
    ? normalized as NoteSourceRole
    : 'core_reference';
}

export function noteSourcePackTemplateKey(value: unknown): NoteSourcePackTemplateKey {
  const normalized = String(value ?? '').trim().toLowerCase();
  return (NOTE_SOURCE_PACK_TEMPLATES as readonly string[]).includes(normalized)
    ? normalized as NoteSourcePackTemplateKey
    : 'balanced';
}

export function noteSourceIdentity(publisherValue: unknown, sourceUriValue: unknown): string | null {
  const publisher = String(publisherValue ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (publisher) return `publisher:${publisher}`;
  const sourceUri = String(sourceUriValue ?? '').trim();
  try {
    const host = new URL(sourceUri).hostname.trim().toLowerCase().replace(/^www\./, '');
    return host ? `host:${host}` : null;
  } catch {
    return null;
  }
}

export function sourcePackTemplateOptions() {
  return NOTE_SOURCE_PACK_TEMPLATES.map((key) => ({ key, ...TEMPLATES[key] }));
}

export function sourcePolicyEvidenceReady(source: Pick<SourcePackPolicySource, 'generationReady' | 'referenceEvidenceReady'>): boolean {
  return source.generationReady || source.referenceEvidenceReady === true;
}

export function evaluateSourcePackPolicy(
  templateValue: unknown,
  sources: SourcePackPolicySource[],
): SourcePackPolicyEvaluation {
  const templateKey = noteSourcePackTemplateKey(templateValue);
  const template = TEMPLATES[templateKey];
  const included = sources.filter((source) => source.inclusionState === 'included');
  const requirements = template.requirements.map((requirement) => {
    const currentCount = included.filter((source) =>
      requirement.roles.includes(source.sourceRole)
      && (!requirement.generationReadyOnly || sourcePolicyEvidenceReady(source)),
    ).length;
    return {
      ...requirement,
      currentCount,
      satisfied: currentCount >= requirement.minCount,
    };
  });
  const missing = requirements.filter((requirement) => !requirement.satisfied);

  const participatingRoles = new Set(template.requirements.flatMap((requirement) => requirement.roles));
  const integritySources = included.filter((source) => participatingRoles.has(source.sourceRole));
  const uniqueContentKeys = new Set(integritySources.map((source, index) => {
    const hash = String(source.contentHash ?? '').trim().toLowerCase();
    return hash || `unkeyed-content:${index}`;
  }));
  const distinctIdentityKeys = new Set(integritySources.map((source, index) => {
    const identity = String(source.sourceIdentity ?? '').trim().toLowerCase();
    return identity || `unidentified-source:${index}`;
  }));
  const integrityFindings: SourcePackIntegrityFinding[] = [];
  if (uniqueContentKeys.size < template.minUniqueContent) {
    integrityFindings.push({
      code: 'INSUFFICIENT_UNIQUE_CONTENT',
      label: 'Independent content copies',
      currentCount: uniqueContentKeys.size,
      minCount: template.minUniqueContent,
    });
  }
  if (distinctIdentityKeys.size < template.minDistinctIdentities) {
    integrityFindings.push({
      code: 'INSUFFICIENT_SOURCE_IDENTITIES',
      label: 'Independent publisher/domain identities',
      currentCount: distinctIdentityKeys.size,
      minCount: template.minDistinctIdentities,
    });
  }
  const integrity = {
    minUniqueContent: template.minUniqueContent,
    minDistinctIdentities: template.minDistinctIdentities,
    uniqueContentCount: uniqueContentKeys.size,
    distinctIdentityCount: distinctIdentityKeys.size,
    findings: integrityFindings,
    ready: integrityFindings.length === 0,
  };

  return {
    templateKey,
    name: template.name,
    description: template.description,
    ready: missing.length === 0 && integrity.ready,
    requirements,
    missing,
    integrity,
  };
}
