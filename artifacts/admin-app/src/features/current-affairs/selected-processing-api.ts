import { adminRequest } from '@/lib/admin-request';

export type CurrentAffairsSelectedProcessingItem = {
  eventId: string | null;
  publicCode: string | null;
  title: string;
  selectedCandidateIds: string[];
  selectedHeadlineCount: number;
  eventStatus: string | null;
  authoringStatus: string | null;
  hindiStatus: string | null;
  punjabiStatus: string | null;
  verifiedFactCount: number;
  officialEvidenceCount: number;
  supportedOfficialEvidenceCount: number;
  blockers: string[];
  stage: 'ready' | 'event_linking' | 'verification' | 'english' | 'localization';
  ready: boolean;
};

export type CurrentAffairsSelectedProcessingResult = {
  processingVersion?: string;
  targetDate: string;
  startedAt: string;
  completedAt: string;
  selectedHeadlineCount: number;
  selectedEventCount: number;
  summary: {
    selected: number;
    verified: number;
    ready: number;
    blocked: number;
    verificationBlocked?: number;
    englishBlocked?: number;
    localizationBlocked?: number;
  };
  items: CurrentAffairsSelectedProcessingItem[];
  packPreviewScope?: string;
  packPreviewNote?: string;
  canonicalApprovalAuthority: false;
  publicationAuthority: false;
  questionBankPromotionAuthority: false;
};

export function processCurrentAffairsSelected(date: string) {
  return adminRequest<CurrentAffairsSelectedProcessingResult>('/admin/current-affairs/editorial/headlines/process-selected', {
    method: 'POST',
    body: JSON.stringify({ date }),
  });
}
