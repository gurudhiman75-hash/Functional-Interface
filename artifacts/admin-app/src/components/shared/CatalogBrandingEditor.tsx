import { useEffect, useState } from 'react';
import { ImagePlus, Loader2, Save, Trash2 } from 'lucide-react';

import { MediaAssetPicker } from '@/components/shared/MediaAssetPicker';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getFirebaseAuth } from '@/integrations/firebase';

export type CatalogBrandingEntityType = 'exam_family' | 'exam' | 'test_series' | 'test';

type Branding = {
  entityType: CatalogBrandingEntityType;
  entityId: string;
  iconName: string;
  iconUrl: string;
  imageUrl: string;
  updatedAt: string | null;
};

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await user.getIdToken()}`,
      ...init?.headers,
    },
  });
  const body = await response.json().catch(() => null) as (T & { error?: string }) | null;
  if (!response.ok) throw new Error(body?.error || `Branding request failed (${response.status}).`);
  if (!body) throw new Error('Branding API returned an empty response.');
  return body;
}

export function CatalogBrandingEditor({
  entityType,
  entityId,
  title = 'Icon / logo',
  compact = false,
  onSaved,
}: {
  entityType: CatalogBrandingEntityType;
  entityId: string;
  title?: string;
  compact?: boolean;
  onSaved?: (branding: Branding) => void;
}) {
  const [iconUrl, setIconUrl] = useState('');
  const [iconName, setIconName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void request<Branding>(`/admin/catalog-branding/${entityType}/${encodeURIComponent(entityId)}`)
      .then((branding) => {
        if (!active) return;
        setIconUrl(branding.iconUrl || '');
        setIconName(branding.iconName || '');
      })
      .catch((error) => {
        if (active) showToast.error('Unable to load icon', error instanceof Error ? error.message : 'Request failed.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [entityId, entityType]);

  const save = async (nextIconUrl = iconUrl) => {
    setSaving(true);
    try {
      const branding = await request<Branding>(
        `/admin/catalog-branding/${entityType}/${encodeURIComponent(entityId)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            iconName: iconName.trim(),
            iconUrl: nextIconUrl.trim(),
            imageUrl: '',
            reason: 'Updated catalog icon',
          }),
        },
      );
      setIconUrl(branding.iconUrl || '');
      setIconName(branding.iconName || '');
      onSaved?.(branding);
      showToast.success('Icon updated', 'The new icon is now the canonical icon for web and mobile.');
    } catch (error) {
      showToast.error('Unable to update icon', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-20 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading icon…</div>;
  }

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4 rounded-xl border p-4'}>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">Upload/select an image or leave blank to use the automatic fallback icon.</p>
      </div>
      <MediaAssetPicker
        value={iconUrl}
        onChange={(url) => setIconUrl(url)}
        preferredType="Exam Icon"
        label="Choose icon"
      />
      <div className="space-y-1.5">
        <Label>Built-in icon name (optional)</Label>
        <Input value={iconName} onChange={(event) => setIconName(event.target.value)} placeholder="e.g. Landmark, Banknote" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => void save()} disabled={saving}>
          {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
          Save icon
        </Button>
        {(iconUrl || iconName) && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIconUrl('');
              setIconName('');
              void save('');
            }}
            disabled={saving}
          >
            <Trash2 className="mr-1.5 h-4 w-4" /> Use automatic icon
          </Button>
        )}
      </div>
    </div>
  );
}

export default CatalogBrandingEditor;
