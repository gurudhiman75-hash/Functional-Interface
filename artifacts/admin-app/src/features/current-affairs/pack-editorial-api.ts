import { adminRequest } from '@/lib/admin-request';
import type {
  DailyMasterPackApproval,
  DailyMasterPackSet,
} from '@/features/current-affairs/production-ops-api';

export type CurrentAffairsPackEditorialRefreshResult = {
  targetDate: string;
  refreshId: string;
  result: {
    boundaryVersion?: string;
    created?: boolean;
    locked?: boolean;
    reason?: string;
    membership?: {
      selectedHeadlineCount?: number;
      selectedEventCount?: number;
      duplicateSelectedHeadlineCount?: number;
    };
    quality?: {
      ready?: boolean;
      blockers?: string[];
      warnings?: string[];
    };
    localizationWarnings?: string[];
  };
  masterPacks: DailyMasterPackSet;
  approvalReadiness: {
    ready: boolean;
    blockers: string[];
    warnings: string[];
    checks: Record<string, boolean>;
  };
  activeApproval: DailyMasterPackApproval | null;
  discoveryReplay: false;
  publicationAuthority: false;
  questionBankPromotionAuthority: false;
};

export function refreshCurrentAffairsPackEditorial(date: string, reason: string) {
  return adminRequest<CurrentAffairsPackEditorialRefreshResult>(
    '/admin/current-affairs/production/master-pack/editorial-refresh',
    {
      method: 'POST',
      body: JSON.stringify({ date, reason }),
    },
  );
}
