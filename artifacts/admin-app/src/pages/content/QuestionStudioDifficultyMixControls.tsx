import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STORAGE_KEY = 'examtree:question-studio:difficulty-mix';

type Distribution = { Easy: number; Medium: number; Hard: number };
type PresetId = 'balanced' | 'easy-heavy' | 'exam-level' | 'hard-heavy' | 'custom';

const PRESETS: Record<Exclude<PresetId, 'custom'>, { label: string; distribution: Distribution }> = {
  balanced: { label: 'Balanced', distribution: { Easy: 30, Medium: 50, Hard: 20 } },
  'easy-heavy': { label: 'Easy-heavy', distribution: { Easy: 50, Medium: 40, Hard: 10 } },
  'exam-level': { label: 'Exam-level', distribution: { Easy: 20, Medium: 55, Hard: 25 } },
  'hard-heavy': { label: 'Hard-heavy', distribution: { Easy: 10, Medium: 40, Hard: 50 } },
};

function loadStored(): { preset: PresetId; distribution: Distribution } {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as { preset?: PresetId; distribution?: Partial<Distribution> } | null;
    const preset = parsed?.preset ?? 'balanced';
    const fallback = preset === 'custom' ? PRESETS.balanced.distribution : PRESETS[preset]?.distribution ?? PRESETS.balanced.distribution;
    return {
      preset,
      distribution: {
        Easy: Number(parsed?.distribution?.Easy ?? fallback.Easy),
        Medium: Number(parsed?.distribution?.Medium ?? fallback.Medium),
        Hard: Number(parsed?.distribution?.Hard ?? fallback.Hard),
      },
    };
  } catch {
    return { preset: 'balanced', distribution: PRESETS.balanced.distribution };
  }
}

function allocate(count: number, distribution: Distribution) {
  const entries = (Object.entries(distribution) as Array<[keyof Distribution, number]>).map(([difficulty, weight]) => {
    const exact = count * weight / 100;
    return { difficulty, value: Math.floor(exact), remainder: exact - Math.floor(exact) };
  });
  let remaining = count - entries.reduce((sum, entry) => sum + entry.value, 0);
  entries.sort((a, b) => b.remainder - a.remainder || b.value - a.value).forEach((entry) => {
    if (remaining > 0) { entry.value += 1; remaining -= 1; }
  });
  return Object.fromEntries(entries.map((entry) => [entry.difficulty, entry.value])) as Distribution;
}

export function QuestionStudioDifficultyMixControls() {
  const initial = loadStored();
  const [preset, setPreset] = useState<PresetId>(initial.preset);
  const [distribution, setDistribution] = useState<Distribution>(initial.distribution);
  const [previewCount, setPreviewCount] = useState(10);
  const total = distribution.Easy + distribution.Medium + distribution.Hard;
  const counts = useMemo(() => allocate(Math.max(1, previewCount), distribution), [distribution, previewCount]);

  const persist = (nextPreset: PresetId, nextDistribution: Distribution) => {
    setPreset(nextPreset);
    setDistribution(nextDistribution);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ preset: nextPreset, distribution: nextDistribution }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base">Mixed difficulty profile</CardTitle>
        <p className="text-xs text-muted-foreground">Applied only when the Question Studio difficulty selector is set to Mixed.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-2 xl:col-span-2">
            <Label>Preset</Label>
            <Select value={preset} onValueChange={(value) => {
              const next = value as PresetId;
              persist(next, next === 'custom' ? distribution : PRESETS[next].distribution);
            }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(PRESETS).map(([id, value]) => <SelectItem key={id} value={id}>{value.label} · {value.distribution.Easy}/{value.distribution.Medium}/{value.distribution.Hard}</SelectItem>)}
                <SelectItem value="custom">Custom distribution</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(['Easy', 'Medium', 'Hard'] as const).map((difficulty) => (
            <div key={difficulty} className="space-y-2">
              <Label>{difficulty} %</Label>
              <Input
                type="number"
                min={0}
                max={100}
                disabled={preset !== 'custom'}
                value={distribution[difficulty]}
                onChange={(event) => persist('custom', { ...distribution, [difficulty]: Math.max(0, Math.min(100, Number(event.target.value) || 0)) })}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-muted/20 p-3">
          <div className="w-32 space-y-2"><Label>Preview count</Label><Input type="number" min={1} max={50} value={previewCount} onChange={(event) => setPreviewCount(Math.max(1, Math.min(50, Number(event.target.value) || 1)))} /></div>
          <Badge variant={total === 100 ? 'outline' : 'destructive'}>Total {total}%</Badge>
          <span className="text-sm text-muted-foreground">{previewCount} questions → {counts.Easy} Easy, {counts.Medium} Medium, {counts.Hard} Hard</span>
          {total !== 100 && <span className="text-sm font-medium text-destructive">Custom percentages must total 100 before generation.</span>}
        </div>
      </CardContent>
    </Card>
  );
}
