import { ArrowLeft, Construction } from "lucide-react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface UnavailableFeaturePageProps {
  title: string;
  description: string;
}

export default function UnavailableFeaturePage({ title, description }: UnavailableFeaturePageProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl items-center py-8">
      <Card className="w-full border-dashed">
        <CardContent className="flex flex-col items-center p-8 text-center sm:p-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <Construction className="h-7 w-7" />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Coming after canonical integration
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">{title}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            ExamTree is intentionally not displaying mock purchase, ranking, or analytics data as if it were real.
          </p>
          <Button asChild className="mt-6">
            <Link href="/tests"><ArrowLeft className="mr-2 h-4 w-4" /> Browse live tests</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
