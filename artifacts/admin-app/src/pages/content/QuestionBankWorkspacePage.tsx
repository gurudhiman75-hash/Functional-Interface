import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { LiveApprovedQuestions } from '@/pages/content/LiveApprovedQuestions';
import { QuestionBankPage } from '@/pages/content/QuestionBankPage';

export function QuestionBankWorkspacePage() {
  const navigate = useNavigate();
  const { hasPermission } = useAdminPermissions();
  const canOpenGeneration = hasPermission('content.generation.read');

  return (
    <div>
      {canOpenGeneration && (
        <div className="mb-3 flex justify-end">
          <Button size="sm" onClick={() => navigate('/content/questions/generate')}>
            <Sparkles className="mr-1.5 h-4 w-4" /> Generate Questions
          </Button>
        </div>
      )}
      <LiveApprovedQuestions />
      <QuestionBankPage />
    </div>
  );
}
