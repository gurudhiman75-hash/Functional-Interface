import { adminRequest } from '@/lib/admin-request';

export type Com003ReviewLanguage = 'en' | 'hi' | 'pa';

export interface CreateCom003ReviewRunInput {
  exam: string;
  language: Com003ReviewLanguage;
  count: number;
  seed?: string;
  qlId?: string;
}

export interface Com003ReviewRunCreated {
  id: string;
  publicCode: string;
  status: 'review';
  itemCount: number;
  generationSystem: 'knowledge-v1';
  engineId: 'knowledge-v1';
}

export function createCom003ReviewRun(input: CreateCom003ReviewRunInput) {
  return adminRequest<Com003ReviewRunCreated>(
    '/admin/question-studio/runs',
    {
      method: 'POST',
      body: JSON.stringify({
        engineId: 'knowledge-v1',
        exam: input.exam,
        subject: 'Computer Awareness',
        count: input.count,
        packageId: 'COM-003',
        patternId: input.qlId,
        topic: 'Computer Awareness',
        subtopic: 'Office & Productivity Software',
        language: input.language,
        seed: input.seed,
        runtimeMode: 'review-only',
      }),
    },
    { fallbackMessage: 'Unable to create the COM-003 review-only generation run.' },
  );
}
