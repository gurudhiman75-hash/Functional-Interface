import type {
  SeatingExplanationFlow as SeatingExplanationFlowData,
  SeatingExplanationStep,
} from "@workspace/api-zod";
import {
  SeatingReplayBranchRenderer,
  SeatingReplayStepRenderer,
} from "./SeatingReplayRenderer";
import { QuestionRichText } from "../QuestionRichText";

function stepAccent(
  type: SeatingExplanationStep["type"],
) {
  if (type === "reference") {
    return "text-slate-700";
  }

  if (type === "case-analysis") {
    return "text-amber-700";
  }

  if (type === "elimination") {
    return "text-rose-700";
  }

  if (type === "final-arrangement") {
    return "text-emerald-700";
  }

  return "text-slate-800";
}

type Props = {
  flow?: SeatingExplanationFlowData | null;
  className?: string;
  activeStep?: number;
  onActiveStepChange?: (
    stepIndex: number,
  ) => void;
};

export function SeatingExplanationFlow({
  flow,
  className,
  activeStep = -1,
  onActiveStepChange,
}: Props) {
  if (!flow?.steps?.length) {
    return null;
  }

  return (
    <div
      className={[
        "space-y-3 text-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {flow.summary ? (
        <p className="leading-relaxed text-slate-600">
          {flow.summary}
        </p>
      ) : null}

      {flow.steps.map(
        (step, index) => {
          const isActive =
            activeStep === index;

          return (
          <div
            key={`${step.title}-${index}`}
            className={[
              "space-y-2 border-l pl-3 transition-colors",
              isActive
                ? "border-orange-400 bg-orange-50/40"
                : "border-slate-300",
            ].join(" ")}
          >
            <button
              type="button"
              className="block w-full space-y-1 text-left"
              onClick={() =>
                onActiveStepChange?.(index)
              }
            >
              <div
                className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${stepAccent(
                  step.type,
                )}`}
              >
                {step.title}
              </div>
              <QuestionRichText
                content={step.text}
                className="leading-relaxed text-slate-700"
              />
            </button>

            {step.arrangementSnapshot ? (
              <SeatingReplayStepRenderer
                step={step}
                compact
                className="max-w-md"
              />
            ) : null}

            {step.branches?.length ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {step.branches.map(
                  (branch) => (
                    <div
                      key={branch.id}
                      className="space-y-2 border border-slate-200 bg-slate-50/70 p-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                          {branch.label}
                        </div>
                        <div
                          className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
                            branch.status ===
                            "eliminated"
                              ? "text-rose-700"
                              : branch.status ===
                                  "selected"
                                ? "text-emerald-700"
                                : "text-amber-700"
                          }`}
                        >
                          {branch.status}
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600">
                        {branch.text}
                      </p>
                      {branch.arrangementSnapshot ? (
                        <SeatingReplayBranchRenderer
                          branch={branch}
                          compact
                        />
                      ) : null}
                    </div>
                  ),
                )}
              </div>
            ) : null}
          </div>
          );
        },
      )}
    </div>
  );
}

export default SeatingExplanationFlow;
