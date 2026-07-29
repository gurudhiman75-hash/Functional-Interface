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

const SIBLING_ARROW_MARKER_ID = "blr-sibling-arrow";

function SiblingArrowDefs() {
  return (
    <>
      <svg
        aria-hidden="true"
        focusable="false"
        className="absolute h-0 w-0 overflow-hidden"
      >
        <defs>
          <marker
            id={SIBLING_ARROW_MARKER_ID}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="9"
            markerHeight="9"
            markerUnits="userSpaceOnUse"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" />
          </marker>
        </defs>
      </svg>
      <style>{`
        .blr-family-tree-with-sibling-arrows line[stroke-dasharray="8 6"] {
          marker-start: url(#${SIBLING_ARROW_MARKER_ID});
          marker-end: url(#${SIBLING_ARROW_MARKER_ID});
        }
      `}</style>
    </>
  );
}

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
      <div className="blr-family-tree-with-sibling-arrows">
        <SiblingArrowDefs />
        <Suspense
          fallback={
            <div className="min-h-64 animate-pulse rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900" />
          }
        >
          <FamilyTreeDiagram data={familyTree} className={props.className} />
        </Suspense>
      </div>
    );
  }

  return <LegacyLogicPlayback {...props} />;
}
