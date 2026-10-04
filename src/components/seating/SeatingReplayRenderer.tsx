import type {
  SeatingExplanationBranch,
  SeatingExplanationStep,
} from "@workspace/api-zod";
import SeatingDiagramRenderer from "./SeatingDiagramRenderer";

function getStepReplayAnnotation(
  step: SeatingExplanationStep,
) {
  if (step.type === "elimination") {
    return {
      mode: "elimination" as const,
      label: "Eliminated",
      note: "Rejected by clue cross-check",
    };
  }

  if (step.type === "case-analysis") {
    return {
      mode: "case" as const,
      label: "Case Test",
      note: "Working branch under test",
    };
  }

  if (
    step.type ===
    "final-arrangement"
  ) {
    return {
      mode: "final" as const,
      label: "Final",
      note: "Arrangement fixed",
    };
  }

  return {
    mode: "step" as const,
    label:
      step.type === "reference"
        ? "Reference"
        : "Inference",
  };
}

function getBranchReplayAnnotation(
  branch: SeatingExplanationBranch,
) {
  if (
    branch.status ===
    "eliminated"
  ) {
    return {
      mode: "elimination" as const,
      label: branch.label,
      note: "Discarded case",
    };
  }

  if (
    branch.status ===
    "selected"
  ) {
    return {
      mode: "selected" as const,
      label: branch.label,
      note: "Consistent branch",
    };
  }

  return {
    mode: "case" as const,
    label: branch.label,
    note: "Candidate case",
  };
}

type StepProps = {
  step: SeatingExplanationStep;
  className?: string;
  compact?: boolean;
};

export function SeatingReplayStepRenderer({
  step,
  className,
  compact = true,
}: StepProps) {
  if (!step.arrangementSnapshot) {
    return null;
  }

  return (
    <SeatingDiagramRenderer
      diagram={step.arrangementSnapshot}
      title={step.title}
      compact={compact}
      className={className}
      replayAnnotation={getStepReplayAnnotation(
        step,
      )}
    />
  );
}

type BranchProps = {
  branch: SeatingExplanationBranch;
  className?: string;
  compact?: boolean;
};

export function SeatingReplayBranchRenderer({
  branch,
  className,
  compact = true,
}: BranchProps) {
  if (!branch.arrangementSnapshot) {
    return null;
  }

  return (
    <SeatingDiagramRenderer
      diagram={branch.arrangementSnapshot}
      title={branch.label}
      compact={compact}
      className={className}
      replayAnnotation={getBranchReplayAnnotation(
        branch,
      )}
    />
  );
}

export default SeatingReplayStepRenderer;
