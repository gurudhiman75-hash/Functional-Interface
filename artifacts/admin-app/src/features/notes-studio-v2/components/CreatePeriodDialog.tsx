import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Period } from '../domain/types';
import { httpNotesStudioV2Repository } from '../services/repository';

interface CreatePeriodDialogProps {
  source: 'http' | 'mock';
  suggestedOrderIndex: number;
  onCreated: (period: Period) => void;
}

export function CreatePeriodDialog({ source, suggestedOrderIndex, onCreated }: CreatePeriodDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [orderIndex, setOrderIndex] = useState(String(suggestedOrderIndex));
  const [taxonomyText, setTaxonomyText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subCategories = useMemo(() => {
    const seen = new Set<string>();
    return taxonomyText
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter((item) => {
        const key = item.toLowerCase();
        if (!item || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [taxonomyText]);

  const submit = async () => {
    if (source !== 'http') {
      setError('Creating periods requires HTTP data-source mode. Mock mode is read-only.');
      return;
    }
    const parsedOrder = Number(orderIndex);
    if (name.trim().length < 2) {
      setError('Enter a clear period name.');
      return;
    }
    if (!Number.isInteger(parsedOrder)) {
      setError('Order index must be a whole number.');
      return;
    }
    if (subCategories.length === 0) {
      setError('Add at least one sub-category. Use one sub-category per line.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const period = await httpNotesStudioV2Repository.createPeriod({
        name: name.trim(),
        orderIndex: parsedOrder,
        subCategories: subCategories.map((subCategory, index) => ({
          name: subCategory,
          orderIndex: index + 1,
        })),
      });
      setOpen(false);
      setName('');
      setTaxonomyText('');
      setOrderIndex(String(parsedOrder + 1));
      onCreated(period);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to create the period.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={source !== 'http'}>
          <Plus className="mr-2 h-4 w-4" /> Create period
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Notes Studio v2 period</DialogTitle>
          <DialogDescription>
            Define the period and its own ordered taxonomy before corpus intake. The taxonomy routes extraction; it does not filter otherwise valid facts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="notes-v2-period-name">Period name</Label>
            <Input
              id="notes-v2-period-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Gupta Period"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes-v2-period-order">Period order</Label>
            <Input
              id="notes-v2-period-order"
              type="number"
              value={orderIndex}
              onChange={(event) => setOrderIndex(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes-v2-taxonomy">Sub-categories</Label>
            <Textarea
              id="notes-v2-taxonomy"
              value={taxonomyText}
              onChange={(event) => setTaxonomyText(event.target.value)}
              rows={8}
              placeholder={'Political history\nAdministration\nEconomy\nSociety\nArt and culture'}
            />
            <p className="text-xs text-muted-foreground">
              One item per line. The order here becomes the period-specific taxonomy order.
            </p>
          </div>
          {error && <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">{error}</div>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
          <Button onClick={() => void submit()} disabled={saving}>{saving ? 'Creating…' : `Create with ${subCategories.length} sub-categories`}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
