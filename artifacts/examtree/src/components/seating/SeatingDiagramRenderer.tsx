import type { SeatingDiagramData } from "@workspace/api-zod";
import AlternateFacingDiagram from "./AlternateFacingDiagram";
import CircularSeatingDiagram from "./CircularSeatingDiagram";
import DoubleRowDiagram from "./DoubleRowDiagram";
import LinearSeatingDiagram from "./LinearSeatingDiagram";

type Props = {
  diagram?: SeatingDiagramData | null;
  className?: string;
  title?: string;
  compact?: boolean;
};

export function SeatingDiagramRenderer({
  diagram,
  className,
  title,
  compact = false,
}: Props) {
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
      />
    </div>
  );
}

export default SeatingDiagramRenderer;
