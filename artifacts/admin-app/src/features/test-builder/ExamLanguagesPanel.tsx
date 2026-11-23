import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getTranslationOverview, updateExamVersionLanguages } from '@/features/translations/api';

interface Props {
  examVersionId: string;
  examName: string;
  current: Array<{ id: string; code: string; name: string; isPrimary: boolean }>;
  canManage: boolean;
  onChanged: () => Promise<void>;
}

/** Choose which languages students can use for every test of this exam (English, Hindi, Punjabi, ...). */
export function ExamLanguagesPanel({ examVersionId, examName, current, canManage, onChanged }: Props) {
  const [options, setOptions] = useState<Array<{ id: string; code: string; name: string }>>([]);
  const [picked, setPicked] = useState<string[]>(current.map((l) => l.id));
  const [saving, setSaving] = useState(false);
  const currentKey = current.map((l) => l.id).sort().join('|');

  useEffect(() => {
    let alive = true;
    getTranslationOverview()
      .then((overview) => { if (alive) setOptions(overview.languages.filter((l) => l.isActive).map((l) => ({ id: l.id, code: l.code, name: l.name }))); })
      .catch(() => undefined);
    return () => { alive = false; };
  }, []);
  useEffect(() => { setPicked(current.map((l) => l.id)); }, [examVersionId, currentKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const changed = [...picked].sort().join('|') !== currentKey;
  const toggle = (id: string, on: boolean) => setPicked((p) => (on ? [...p, id] : p.filter((x) => x !== id)));

  const save = async () => {
    if (picked.length === 0) { showToast.error('Pick at least one language', 'Every exam needs at least one language.'); return; }
    const existingPrimary = current.find((l) => l.isPrimary && picked.includes(l.id))?.id;
    const english = options.find((o) => o.code.toLowerCase() === 'en' && picked.includes(o.id))?.id;
    const primary = existingPrimary ?? english ?? picked[0];
    setSaving(true);
    try {
      await updateExamVersionLanguages({
        examVersionId,
        languages: picked.map((languageId) => ({ languageId, isPrimary: languageId === primary })),
        reason: 'Exam languages updated from Tests workspace',
      });
      await onChanged();
      showToast.success('Languages saved', `${examName} now allows ${options.filter((o) => picked.includes(o.id)).map((o) => o.name).join(', ')}.`);
    } catch (error) {
      showToast.error('Could not save languages', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-md border p-3 text-sm" data-testid="exam-languages-panel">
      <div className="mb-2 font-medium">Languages students can use for {examName}</div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {options.length === 0 && <span className="text-xs text-muted-foreground">Loading languages…</span>}
        {options.map((o) => (
          <label key={o.id} className="flex items-center gap-1.5">
            <Checkbox checked={picked.includes(o.id)} disabled={!canManage} onCheckedChange={(v) => toggle(o.id, v === true)} /> {o.name}
          </label>
        ))}
        {canManage && changed && (
          <Button size="sm" onClick={() => void save()} disabled={saving}>
            {saving && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}Save languages
          </Button>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Applies to every test of this exam. A question appears in Hindi or Punjabi only if it has an approved translation.
        {!canManage && ' You need the language-management permission to change this.'}
      </p>
    </div>
  );
}
