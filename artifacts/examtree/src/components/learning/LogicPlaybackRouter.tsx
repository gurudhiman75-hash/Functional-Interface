import { lazy, Suspense } from "react";
import type {
  SeatingDiagramData,
  SeatingExplanationFlow as SeatingExplanationFlowData,
} from "@workspace/api-zod";
import type { Language } from "@/lib/lang-utils";
import LegacyLogicPlayback from "./LogicPlayback";
import { parseFamilyTreeDiagram } from "@/components/blood-relations/family-tree-types";

const FamilyTreeDiagram = lazy(
  () => import("@/components/blood-relations/FamilyTreeDiagram"),
);

type LogicPlaybackRouterProps = {
  logic?: unknown | null;
  diagram?: SeatingDiagramData | null;
  seatingDiagram?: SeatingDiagramData | null;
  seatingExplanationFlow?: SeatingExplanationFlowData | null;
  content?: unknown | null;
  languages?: unknown | null;
  currentLang?: Language;
  availableLanguages?: Language[];
  onLanguageChange?: (lang: Language) => void;
  className?: string;
};

export default function LogicPlaybackRouter(props: LogicPlaybackRouterProps) {
  const familyTree = parseFamilyTreeDiagram(props.logic);
  if (familyTree) {
    return (
      <Suspense
        fallback={
          <div className="min-h-64 animate-pulse rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900" />
        }
      >
        <FamilyTreeDiagram data={familyTree} className={props.className} />
      </Suspense>
    );
  }

  return <LegacyLogicPlayback {...props} />;
}
