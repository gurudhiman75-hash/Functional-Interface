export type NotesStudioStageId =
  | 'config'
  | 'corpus'
  | 'facts'
  | 'reconcile'
  | 'fact-graph'
  | 'style'
  | 'quality'
  | 'generate'
  | 'review'
  | 'publish';

export interface NotesStudioStage {
  id: NotesStudioStageId;
  number: number;
  label: string;
  description: string;
}

export const NOTES_STUDIO_PIPELINE: NotesStudioStage[] = [
  { id: 'config', number: 0, label: 'Admin config', description: 'Define the period-specific sub-category taxonomy.' },
  { id: 'corpus', number: 1, label: 'Corpus intake', description: 'Register multiple references against the period and optional taxonomy hints.' },
  { id: 'facts', number: 2, label: 'Fact extraction', description: 'Extract atomic dates, entities, events, causes/effects and administrative details.' },
  { id: 'reconcile', number: 3, label: 'Cross-source reconciliation', description: 'Merge attestations and flag conflicting claims for admin resolution.' },
  { id: 'fact-graph', number: 4, label: 'Fact graph', description: 'Create the source-agnostic structured outline used downstream.' },
  { id: 'style', number: 5, label: 'Style-conditioned generation', description: 'Generate from the fact graph in the approved house voice.' },
  { id: 'quality', number: 6, label: 'Refinement gates', description: 'Check factual accuracy, originality, style consistency and advisory exam-frequency tags.' },
  { id: 'generate', number: 7, label: 'Multilingual pass', description: 'Generate English, Hindi and Punjabi independently from the same fact graph.' },
  { id: 'review', number: 8, label: 'Review queue', description: 'Spot-check, edit, resolve review work and create required figures.' },
  { id: 'publish', number: 9, label: 'Publish', description: 'Promote an approved immutable note version to published.' },
];
