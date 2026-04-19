import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Loader2, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  getDiSets,
  createDiSet,
  updateDiSet,
  deleteDiSet,
  uploadImageToStorage,
  type DiSet,
} from "@/lib/data";

function blankDiSetForm() {
  return { title: "", imageUrl: "", description: "" };
}

type DiSetForm = ReturnType<typeof blankDiSetForm>;

interface DiSetFormModalProps {
  open: boolean;
  editing: DiSet | null;
  onClose: () => void;
  onSaved: () => void;
}

function DiSetFormModal({ open, editing, onClose, onSaved }: DiSetFormModalProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<DiSetForm>(blankDiSetForm());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with editing prop when dialog opens
  const prevOpen = useRef(false);
  if (open !== prevOpen.current) {
    prevOpen.current = open;
    if (open) {
      if (editing) {
        setForm({ title: editing.title, imageUrl: editing.imageUrl ?? "", description: editing.description ?? "" });
      } else {
        setForm(blankDiSetForm());
      }
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImageToStorage(file, "di-set-images");
      setForm((f) => ({ ...f, imageUrl: url }));
      toast({ title: "Image uploaded" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err?.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        imageUrl: form.imageUrl.trim() || undefined,
        description: form.description.trim() || undefined,
      };
      if (editing) {
        await updateDiSet(editing.id, payload);
        toast({ title: "DI set updated" });
      } else {
        await createDiSet(payload);
        toast({ title: "DI set created" });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      toast({ title: "Save failed", description: err?.message ?? "Unknown error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit DI Set" : "New DI Set"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          <div>
            <Label>Title *</Label>
            <Input
              className="mt-1"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Bar chart — GDP growth 2010-2020"
              required
            />
          </div>

          <div>
            <Label>Diagram / Image</Label>
            <div className="mt-1 flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageUpload(f);
                  e.target.value = "";
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <ImageIcon className="w-3.5 h-3.5 mr-1.5" />}
                {uploading ? "Uploading…" : "Upload image"}
              </Button>
              {form.imageUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Remove
                </Button>
              )}
            </div>
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="DI diagram preview"
                className="mt-2 max-h-48 rounded-md border border-border object-contain"
              />
            )}
          </div>

          <div>
            <Label>Description / Context (optional)</Label>
            <textarea
              className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Additional context shown to students above the question group…"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving || uploading}>
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              {editing ? "Save changes" : "Create DI set"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DiSetManager() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingDiSet, setEditingDiSet] = useState<DiSet | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: diSets = [], isLoading } = useQuery<DiSet[]>({
    queryKey: ["di-sets"],
    queryFn: getDiSets,
    staleTime: 0,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["di-sets"] });

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this DI set? Questions linked to it will lose their DI set association.")) return;
    setDeletingId(id);
    try {
      await deleteDiSet(id);
      toast({ title: "DI set deleted" });
      invalidate();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err?.message, variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">DI Sets</h2>
          <p className="text-sm text-muted-foreground">Manage diagram / data interpretation sets used in questions.</p>
        </div>
        <Button size="sm" onClick={() => { setEditingDiSet(null); setShowForm(true); }}>
          <Plus className="w-3.5 h-3.5 mr-1.5" /> New DI Set
        </Button>
      </div>

      <div className="bg-card/85 border border-border/70 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading…
          </div>
        ) : diSets.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No DI sets yet. Create one to link diagram-based questions.
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {diSets.map((ds) => (
              <div key={ds.id} className="flex items-start gap-4 px-4 py-4">
                {ds.imageUrl ? (
                  <img
                    src={ds.imageUrl}
                    alt={ds.title}
                    className="w-20 h-14 object-cover rounded border border-border flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-14 flex items-center justify-center bg-muted rounded border border-border flex-shrink-0 text-muted-foreground">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{ds.title}</p>
                  {ds.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ds.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => { setEditingDiSet(ds); setShowForm(true); }}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    disabled={deletingId === ds.id}
                    onClick={() => handleDelete(ds.id)}
                  >
                    {deletingId === ds.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DiSetFormModal
        open={showForm}
        editing={editingDiSet}
        onClose={() => setShowForm(false)}
        onSaved={invalidate}
      />
    </div>
  );
}
