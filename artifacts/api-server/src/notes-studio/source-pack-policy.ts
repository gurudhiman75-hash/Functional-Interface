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
};

type RequirementDefinition = {
  code: string;
  label: string;
  roles: NoteSourceRole[];
  minCount: number;
  generationReadyOnly: boolean;
};

export type SourcePackRequirementStatus = RequirementDefinition & {
  currentCount: number;
  satisfied: boolean;
};

export type SourcePackPolicyEvaluation = {
  templateKey: NoteSourcePackTemplateKey;
  name: string;
  description: string;
  ready: boolean;
  requirements: SourcePackRequirementStatus[];
  missing: SourcePackRequirementStatus[];
};

const TEMPLATES: Record<NoteSourcePackTemplateKey, {
  name: string;
  description: string;
  requirements: RequirementDefinition[];
}> = {
  balanced: {
    name: 'Balanced static note',
    description: 'Requires two independent generation-ready core sources. Use for most static syllabus notes.',
    requirements: [
      {
        code: 'two_core_sources',
        label: 'Two generation-ready authority/reference sources',
        roles: ['primary_authority', 'core_reference'],
        minCount: 2,
        generationReadyOnly: true,
      },
    ],
  },
  official_first: {
    name: 'Official-first',
    description: 'Requires a generation-ready primary authority plus an independent generation-ready reference.',
    requirements: [
      {
        code: 'primary_authority',
        label: 'Generation-ready primary authority',
        roles: ['primary_authority'],
        minCount: 1,
        generationReadyOnly: true,
      },
      {
        code: 'core_reference',
        label: 'Generation-ready core reference',
        roles: ['core_reference'],
        minCount: 1,
        generationReadyOnly: true,
      },
    ],
  },
  reference_led: {
    name: 'Reference-led',
    description: 'Requires two generation-ready standard references where no single official primary authority is appropriate.',
    requirements: [
      {
        code: 'two_references',
        label: 'Two generation-ready core references',
        roles: ['core_reference'],
        minCount: 2,
        generationReadyOnly: true,
      },
    ],
  },
  exam_focused: {
    name: 'Exam-focused',
    description: 'Requires an explicit syllabus/PYQ/notification context source plus one generation-ready authority or reference.',
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
        label: 'Generation-ready authority/reference source',
        roles: ['primary_authority', 'core_reference'],
        minCount: 1,
        generationReadyOnly: true,
      },
    ],
  },
  quick_revision: {
    name: 'Quick revision',
    description: 'Requires one generation-ready authority or reference for deliberately narrow revision notes.',
    requirements: [
      {
        code: 'one_core_source',
        label: 'Generation-ready authority/reference source',
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

export function sourcePackTemplateOptions() {
  return NOTE_SOURCE_PACK_TEMPLATES.map((key) => ({ key, ...TEMPLATES[key] }));
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
      && (!requirement.generationReadyOnly || source.generationReady),
    ).length;
    return {
      ...requirement,
      currentCount,
      satisfied: currentCount >= requirement.minCount,
    };
  });
  const missing = requirements.filter((requirement) => !requirement.satisfied);
  return {
    templateKey,
    name: template.name,
    description: template.description,
    ready: missing.length === 0,
    requirements,
    missing,
  };
}
