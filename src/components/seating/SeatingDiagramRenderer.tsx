import { useMemo, useState } from "react";
import type { SeatingDiagramData } from "@workspace/api-zod";
import AlternateFacingDiagram from "./AlternateFacingDiagram";
import CircularSeatingDiagram from "./CircularSeatingDiagram";
import DoubleRowDiagram from "./DoubleRowDiagram";
import LinearSeatingDiagram from "./LinearSeatingDiagram";
import ArrangementView from "./ArrangementView";
import type { ReplayAnnotation } from "./diagram-utils";

type Props = {
  diagram?: SeatingDiagramData | null;
  className?: string;
  title?: string;
  compact?: boolean;
  replayAnnotation?: ReplayAnnotation;
  inferenceTrace?: {
    steps?: string[];
    deductionArray?: Array<{
      step: number;
      statement: string;
    }>;
  } | null;
  activeStep?: number;
};

export function SeatingDiagramRenderer({
  diagram,
  className,
  title,
  compact = false,
  replayAnnotation,
  inferenceTrace,
  activeStep,
}: Props) {
  const [localStep, setLocalStep] =
    useState(0);
  const manifestStepCount =
    diagram?.layoutManifest
      ?.reasoningTimeline?.length ?? 0;
  const stepCount =
    inferenceTrace?.deductionArray
      ?.length ||
    inferenceTrace?.steps?.length ||
    manifestStepCount ||
    0;
  const resolvedActiveStep =
    activeStep ?? (stepCount ? localStep : -1);
  const activeStepText = useMemo(
    () =>
      inferenceTrace?.deductionArray?.[
        resolvedActiveStep
      ]?.statement ??
      inferenceTrace?.steps?.[
        resolvedActiveStep
      ] ??
      diagram?.layoutManifest
        ?.reasoningTimeline?.[
          resolvedActiveStep
        ]?.note ??
      "",
    [
      diagram,
      inferenceTrace,
      resolvedActiveStep,
    ],
  );

  if (!diagram?.seats?.length) {
    return null;
  }

  const frameClassName = [
    compact
      ? "inline-block max-w-full border border-slate-200 bg-white px-1.5 py-1"
      : "inline-block max-w-full rounded-md border border-slate-200 bg-white px-2 py-1.5",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (diagram.layoutManifest) {
    return (
      <div className={frameClassName}>
        <ArrangementView
          manifest={
            diagram.layoutManifest
          }
          className="w-full h-auto"
          title={
            title ??
            "Interactive arrangement"
          }
          compact={compact}
          inferenceTrace={
            inferenceTrace
          }
          activeStep={
            resolvedActiveStep
          }
        />
        {stepCount && !compact ? (
          <div className="mt-2 space-y-1 border-t border-slate-200 pt-2 text-xs text-slate-600">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                className="rounded border border-slate-300 px-2 py-0.5 disabled:opacity-40"
                disabled={
                  resolvedActiveStep <= 0
                }
                onClick={() =>
                  setLocalStep((step) =>
                    Math.max(0, step - 1),
                  )
                }
              >
                Prev
              </button>
              <span className="font-medium text-slate-700">
                Step{" "}
                {resolvedActiveStep + 1} /{" "}
                {stepCount}
              </span>
              <button
                type="button"
                className="rounded border border-slate-300 px-2 py-0.5 disabled:opacity-40"
                disabled={
                  resolvedActiveStep >=
                  stepCount - 1
                }
                onClick={() =>
                  setLocalStep((step) =>
                    Math.min(
                      stepCount - 1,
                      step + 1,
                    ),
                  )
                }
              >
                Next
              </button>
            </div>
            {activeStepText ? (
              <p className="leading-relaxed">
                {activeStepText}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  if (
    diagram.arrangementType ===
      "double-row" ||
    diagram.arrangementType ===
      "parallel-row"
  ) {
    return (
      <div className={frameClassName}>
        <DoubleRowDiagram
          diagram={diagram}
          className="w-full h-auto"
          title={title}
          replayAnnotation={
            replayAnnotation
          }
        />
      </div>
    );
  }

  if (
    diagram.arrangementType ===
      "linear" &&
    diagram.orientationType ===
      "alternate"
  ) {
    return (
      <div className={frameClassName}>
        <AlternateFacingDiagram
          diagram={diagram}
          className="w-full h-auto"
          title={title}
          replayAnnotation={
            replayAnnotation
          }
        />
      </div>
    );
  }

  if (
    diagram.arrangementType ===
      "circular" ||
    diagram.arrangementType ===
      "square" ||
    diagram.arrangementType ===
      "rectangular"
  ) {
    return (
      <div className={frameClassName}>
        <CircularSeatingDiagram
          diagram={diagram}
          className="w-full h-auto"
          title={title}
          replayAnnotation={
            replayAnnotation
          }
        />
      </div>
    );
  }

  return (
    <div className={frameClassName}>
      <LinearSeatingDiagram
        diagram={diagram}
        className="w-full h-auto"
        title={title}
        replayAnnotation={
          replayAnnotation
        }
      />
    </div>
  );
}

export default SeatingDiagramRenderer;
