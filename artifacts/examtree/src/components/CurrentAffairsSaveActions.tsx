import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Clock3, Loader2 } from "lucide-react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { saveCurrentAffairsItem } from "@/lib/current-affairs-personalization";
import { getUser } from "@/lib/storage";

export default function CurrentAffairsSaveActions({
  targetType,
  targetId,
  compact = false,
}: {
  targetType: "learning_resource" | "quiz_delivery_item";
  targetId: string;
  compact?: boolean;
}) {
  const user = getUser();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (saveMode: "bookmark" | "revise_later") => saveCurrentAffairsItem({ targetType, targetId, saveMode }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-affairs-personalization"] });
    },
  });

  if (!user) {
    return (
      <Button asChild variant="outline" size={compact ? "sm" : "default"} className="rounded-xl border-slate-200 bg-white text-slate-600">
        <Link href="/login/student?next=%2Fcurrent-affairs"><Bookmark className="mr-1.5 h-4 w-4" />Save</Link>
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap gap-2" data-testid="current-affairs-save-actions">
      <Button
        type="button"
        variant="outline"
        size={compact ? "sm" : "default"}
        disabled={mutation.isPending}
        onClick={() => mutation.mutate("bookmark")}
        className="rounded-xl border-slate-200 bg-white text-slate-600 hover:border-[#cfc8ef] hover:text-[#6657e8]"
      >
        {mutation.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Bookmark className="mr-1.5 h-4 w-4" />}
        Save
      </Button>
      <Button
        type="button"
        variant="outline"
        size={compact ? "sm" : "default"}
        disabled={mutation.isPending}
        onClick={() => mutation.mutate("revise_later")}
        className="rounded-xl border-slate-200 bg-white text-slate-600 hover:border-[#cfc8ef] hover:text-[#6657e8]"
      >
        <Clock3 className="mr-1.5 h-4 w-4" />Revise tomorrow
      </Button>
      {mutation.isSuccess ? <span className="self-center text-[11px] font-semibold text-emerald-600">Saved</span> : null}
      {mutation.isError ? <span className="self-center text-[11px] font-semibold text-rose-600">Could not save</span> : null}
    </div>
  );
}
