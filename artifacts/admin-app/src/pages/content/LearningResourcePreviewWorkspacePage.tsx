import { useEffect, useMemo, useState } from 'react';
import { Eye, Loader2, RefreshCw } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminRequest } from '@/lib/admin-request';
import { LearningResourceLearnerPreview } from './LearningResourceLearnerPreview';

type ResourceSummary = {
  id: string;
  publicCode: string;
  category: string;
  format: string;
  title: string;
  summary: string;
  languageCode: string;
  contentDate: string | null;
  status: 'draft' | 'published' | 'archived';
  publishedAt: string | null;
  expiresAt: string | null;
  updatedAt: string;
  examTargetCount: number;
};
type ResourceDetail = ResourceSummary & {
  bodyMarkdown: string | null;
  contentUrl: string | null;
  createdAt: string;
  examIds: string[];
};
type EditorExam = { id: string; code: string; name: string; familyName: string };
type EditorOptions = { exams: EditorExam[]; maxExamTargets: number };

const categoryLabels: Record<string, string> = {
  current_affairs: 'Current affairs',
  notes: 'Notes',
  formula_sheet: 'Formula sheet',
};

export function LearningResourcePreviewWorkspacePage() {
  const [resources, setResources] = useState<ResourceSummary[]>([]);
  const [options, setOptions] = useState<EditorOptions>({ exams: [], maxExamTargets: 12 });
  const [selectedId, setSelectedId] = useState('');
  const [detail, setDetail] = useState<ResourceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadCatalogue = async () => {
    setLoading(true);
    try {
      const [resourceResult, optionResult] = await Promise.all([
        adminRequest<{ resources: ResourceSummary[] }>('/admin/learning-resources'),
        adminRequest<EditorOptions>('/admin/learning-resource-editor/options'),
      ]);
      const nextResources = resourceResult.resources ?? [];
      setResources(nextResources);
      setOptions(optionResult);
      setSelectedId((current) => current && nextResources.some((item) => item.id === current)
        ? current
        : nextResources[0]?.id ?? '');
    } catch (error) {
      showToast.error('Unable to load preview catalogue', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadCatalogue(); }, []);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    void adminRequest<{ resource: ResourceDetail }>(`/admin/learning-resource-editor/${selectedId}`)
      .then((result) => { if (!cancelled) setDetail(result.resource); })
      .catch((error) => {
        if (!cancelled) {
          setDetail(null);
          showToast.error('Unable to load resource preview', error instanceof Error ? error.message : 'Request failed.');
        }
      })
      .finally(() => { if (!cancelled) setDetailLoading(false); });
    return () => { cancelled = true; };
  }, [selectedId]);

  const targetLabel = useMemo(() => {
    if (!detail || detail.examIds.length === 0) return 'all exams';
    const names = detail.examIds
      .map((id) => options.exams.find((exam) => exam.id === id)?.name)
      .filter((name): name is string => Boolean(name));
    if (names.length === 0) return `${detail.examIds.length} selected exam${detail.examIds.length === 1 ? '' : 's'}`;
    if (names.length <= 3) return names.join(', ');
    return `${names.slice(0, 3).join(', ')} +${names.length - 3} more`;
  }, [detail, options.exams]);

  return <div className="space-y-5">
    <PageHeader
      title="Learner Preview"
      description="Inspect a resource as a learner would see it before publication. Preview is read-only and never changes lifecycle state."
      icon={<Eye className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => void loadCatalogue()} disabled={loading || detailLoading}>
        <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
      </Button>}
    />

    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <p className="mb-1.5 text-sm font-medium">Resource</p>
            <Select value={selectedId} onValueChange={setSelectedId} disabled={loading || resources.length === 0}>
              <SelectTrigger><SelectValue placeholder="Choose a resource" /></SelectTrigger>
              <SelectContent>
                {resources.map((resource) => <SelectItem key={resource.id} value={resource.id}>
                  {resource.title} · {resource.status}
                </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {detail && <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{detail.status}</Badge>
            <Badge variant="outline">{detail.publicCode}</Badge>
          </div>}
        </div>
      </CardContent>
    </Card>

    {loading && resources.length === 0 && <Card><CardContent className="flex items-center justify-center gap-2 py-14 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading resources…</CardContent></Card>}
    {!loading && resources.length === 0 && <Card><CardContent className="py-14 text-center text-muted-foreground">No learning resources exist yet. Create a draft in Manage first.</CardContent></Card>}
    {detailLoading && <Card><CardContent className="flex items-center justify-center gap-2 py-14 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Rendering preview…</CardContent></Card>}
    {!detailLoading && detail && <LearningResourceLearnerPreview resource={{
      title: detail.title,
      summary: detail.summary,
      categoryLabel: categoryLabels[detail.category] ?? detail.category,
      format: detail.format,
      languageCode: detail.languageCode,
      contentDate: detail.contentDate,
      expiresAt: detail.expiresAt,
      bodyMarkdown: detail.bodyMarkdown,
      contentUrl: detail.contentUrl,
      targetLabel,
    }} />}
  </div>;
}

export default LearningResourcePreviewWorkspacePage;
