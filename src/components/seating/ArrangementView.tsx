import type {
  LayoutManifest,
  LayoutManifestSlot,
} from "@workspace/api-zod";

type InferenceTraceLike = {
  steps?: string[];
  deductionArray?: Array<{
    step: number;
    statement: string;
  }>;
} | null;

type Props = {
  manifest: LayoutManifest;
  className?: string;
  title?: string;
  activeStep?: number;
  inferenceTrace?: InferenceTraceLike;
  compact?: boolean;
};

type OrchestratedSlot =
  LayoutManifestSlot & {
    timelineActive?: boolean;
  };

const slotFill = {
  EMPTY: "#f8fafc",
  OCCUPIED: "#ffffff",
  HIGHLIGHTED: "#dcfce7",
  HIDDEN: "#e2e8f0",
} as const;

function normalizeColor(
  color?: string,
) {
  if (!color) return undefined;
  if (color.startsWith("#")) return color;

  const map: Record<string, string> = {
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    white: "#f8fafc",
    black: "#111827",
    orange: "#f97316",
  };

  return map[color.toLowerCase()] ?? "#64748b";
}

function coordinateForLayout(
  manifest: LayoutManifest,
  index: number,
) {
  const total =
    manifest.slots.length;
  const cols = Math.max(
    manifest.dimensions.cols,
    1,
  );
  const rows = Math.max(
    manifest.dimensions.rows,
    1,
  );
  const row =
    Math.floor(index / cols);
  const col = index % cols;

  if (manifest.type === "RING") {
    const angle =
      -Math.PI / 2 +
      (index / Math.max(total, 1)) *
        Math.PI *
        2;

    return {
      x: 50 + Math.cos(angle) * 36,
      y: 50 + Math.sin(angle) * 32,
    };
  }

  if (manifest.type === "PARALLEL") {
    return {
      x:
        12 +
        (col / Math.max(cols - 1, 1)) *
          76,
      y: 28 + row * 34,
    };
  }

  if (manifest.type === "STACK") {
    return {
      x: 50,
      y:
        12 +
        ((total - index - 1) /
          Math.max(total - 1, 1)) *
          76,
    };
  }

  if (manifest.type === "GRID") {
    return {
      x:
        16 +
        (col / Math.max(cols - 1, 1)) *
          68,
      y:
        20 +
        (row / Math.max(rows - 1, 1)) *
          60,
    };
  }

  return {
    x:
      10 +
      (index / Math.max(total - 1, 1)) *
        80,
    y: 50,
  };
}

function orchestrateSlots(
  manifest: LayoutManifest,
  activeStep: number,
): OrchestratedSlot[] {
  const timeline =
    activeStep >= 0
      ? manifest.reasoningTimeline?.[
          activeStep
        ]
      : undefined;
  const sync =
    activeStep >= 0
      ? manifest.stateSync?.[
          String(activeStep)
        ]
      : undefined;
  const highlighted = new Set(
    sync?.highlightedSlotIds ??
      timeline?.highlightedSlotIds ??
      [],
  );
  const visibleArrangement =
    timeline?.currentVisibleArrangement ??
    {};

  return manifest.slots.map(
    (slot, index) => {
      const timelineLabel =
        visibleArrangement[slot.id];
      const mappedCoordinates =
        manifest.slotMap?.find(
          (entry) =>
            entry.slotId === slot.id,
        )?.coordinates;
      const isHidden =
        Boolean(timeline) &&
        !timelineLabel &&
        !highlighted.has(slot.id);

      return {
        ...slot,
        coordinates:
          mappedCoordinates ??
          coordinateForLayout(
            manifest,
            index,
          ),
        data: {
          ...slot.data,
          primaryLabel:
            timelineLabel ??
            (isHidden
              ? ""
              : slot.data.primaryLabel),
        },
        state: highlighted.has(slot.id)
          ? "HIGHLIGHTED"
          : isHidden
            ? "HIDDEN"
            : slot.state,
        timelineActive:
          highlighted.has(slot.id),
      };
    },
  );
}

function facingArrow(
  slot: LayoutManifestSlot,
  type: LayoutManifest["type"],
) {
  const facing = slot.facing;
  if (!facing) return null;

  const { x, y } = slot.coordinates;
  const center = {
    x: 50,
    y: type === "STACK" ? 56 : 50,
  };
  const radial =
    facing === "IN" ||
    facing === "OUT";
  const dx = radial
    ? center.x - x
    : 0;
  const dy = radial
    ? center.y - y
    : facing === "NORTH"
      ? -1
      : 1;
  const length =
    Math.hypot(dx, dy) || 1;
  const direction =
    facing === "OUT" ? -1 : 1;
  const ux = dx / length;
  const uy = dy / length;
  const start = {
    x:
      x -
      ux * direction * 16,
    y:
      y -
      uy * direction * 16,
  };
  const end = {
    x:
      x -
      ux * direction * 8,
    y:
      y -
      uy * direction * 8,
  };
  const path = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;

  return (
    <path
      d={path}
      stroke="#64748b"
      strokeWidth="1.6"
      strokeLinecap="round"
      markerEnd="url(#arrangement-arrow)"
    />
  );
}

function slotShape(
  type: LayoutManifest["type"],
  slot: LayoutManifestSlot,
  active: boolean,
) {
  const { x, y } = slot.coordinates;
  const fill =
    slotFill[slot.state] ??
    "#ffffff";
  const stroke = active
    ? "#f97316"
    : slot.state === "HIGHLIGHTED"
      ? "#16a34a"
      : "#475569";
  const common = {
    fill,
    stroke,
    strokeWidth: active ? 2.8 : 1.4,
    className:
      "transition-all duration-300 ease-out",
  };

  if (type === "RING") {
    return (
      <circle
        cx={x}
        cy={y}
        r={11}
        {...common}
      />
    );
  }

  if (type === "STACK") {
    return (
      <g>
        <rect
          x={x - 28}
          y={y - 9}
          width={56}
          height={18}
          rx={3}
          fill="#cbd5e1"
          opacity={0.45}
          transform={`translate(3 3)`}
        />
        <rect
          x={x - 30}
          y={y - 11}
          width={60}
          height={22}
          rx={4}
          {...common}
        />
      </g>
    );
  }

  return (
    <rect
      x={x - 18}
      y={y - 13}
      width={36}
      height={26}
      rx={6}
      {...common}
    />
  );
}

function SlotNode({
  slot,
  type,
  active,
}: {
  slot: LayoutManifestSlot;
  type: LayoutManifest["type"];
  active: boolean;
}) {
  const color =
    normalizeColor(
      slot.data.colorCode,
    );
  const { x, y } = slot.coordinates;

  return (
    <g
      className={
        active
          ? "animate-pulse"
          : undefined
      }
    >
      {slotShape(type, slot, active)}
      {color ? (
        <circle
          cx={x - 20}
          cy={y - 10}
          r={4}
          fill={color}
          stroke="#334155"
          strokeWidth="0.6"
        />
      ) : null}
      {slot.data.primaryLabel ? (
        <text
          x={x}
          y={y - 1}
          textAnchor="middle"
          fontSize={
            slot.data.primaryLabel
              .length > 10
              ? 4.5
              : 5.8
          }
          fontWeight="700"
          fill="#0f172a"
        >
          {slot.data.primaryLabel}
        </text>
      ) : null}
      {slot.data.secondaryLabel ? (
        <g>
          <rect
            x={x - 16}
            y={y + 3}
            width={32}
            height={6}
            rx={3}
            fill="#e0f2fe"
            stroke="#bae6fd"
            strokeWidth="0.4"
          />
          <text
            x={x}
            y={y + 7.4}
            textAnchor="middle"
            fontSize="3.4"
            fill="#0369a1"
          >
            {slot.data.secondaryLabel}
          </text>
        </g>
      ) : null}
      {slot.data.tertiaryLabel ? (
        <text
          x={x}
          y={y + 13}
          textAnchor="middle"
          fontSize="3.4"
          fill="#64748b"
        >
          {slot.data.tertiaryLabel}
        </text>
      ) : null}
      {facingArrow(slot, type)}
    </g>
  );
}

function activeLabels(
  trace: InferenceTraceLike | undefined,
  activeStep: number,
) {
  const text =
    trace?.deductionArray?.[
      activeStep
    ]?.statement ??
    trace?.steps?.[activeStep] ??
    "";

  return new Set(
    Array.from(
      text.matchAll(
        /\b[A-Z][A-Za-z]+(?:\s(?:box|seminar|workshop|session))?\b/g,
      ),
    ).map((match) => match[0]),
  );
}

export function ArrangementView({
  manifest,
  className,
  title = "Interactive arrangement",
  activeStep = -1,
  inferenceTrace,
  compact = false,
}: Props) {
  const timeline =
    activeStep >= 0
      ? manifest.reasoningTimeline?.[
          activeStep
        ]
      : undefined;
  const slots =
    orchestrateSlots(
      manifest,
      activeStep,
    );
  const highlighted =
    activeLabels(
      inferenceTrace,
      activeStep,
    );
  const width = 100;
  const height =
    manifest.type === "STACK"
      ? 112
      : manifest.type === "PARALLEL"
        ? 86
        : 100;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        <marker
          id="arrangement-arrow"
          markerWidth="4"
          markerHeight="4"
          refX="3"
          refY="2"
          orient="auto"
        >
          <path
            d="M0,0 L4,2 L0,4"
            fill="#64748b"
          />
        </marker>
      </defs>
      <rect
        x="1"
        y="1"
        width="98"
        height={height - 2}
        rx="5"
        fill="#f8fafc"
        stroke="#cbd5e1"
      />
      {manifest.type === "STACK"
        ? (
            <line
              x1="50"
              x2="50"
              y1="8"
              y2={height - 8}
              stroke="#e2e8f0"
              strokeWidth="0.8"
            />
          )
        : null}
      {slots.map((slot) => (
        <SlotNode
          key={slot.id}
          slot={slot}
          type={manifest.type}
          active={
            slot.timelineActive ||
            highlighted.has(
              slot.data.primaryLabel,
            ) ||
            slot.state === "HIGHLIGHTED"
          }
        />
      ))}
      {!compact &&
      timeline?.availableEntities?.length ? (
        <g>
          <rect
            x="4"
            y="4"
            width="36"
            height="10"
            rx="3"
            fill="#fff7ed"
            stroke="#fed7aa"
          />
          <text
            x="6"
            y="10.5"
            fontSize="3.2"
            fill="#9a3412"
          >
            Pool:{" "}
            {timeline.availableEntities
              .slice(0, 3)
              .join(", ")}
            {timeline.availableEntities
              .length > 3
              ? "..."
              : ""}
          </text>
        </g>
      ) : null}
      {!compact ? (
        <text
          x="4"
          y={height - 4}
          fontSize="3.5"
          fill="#64748b"
        >
          {manifest.type} layout
        </text>
      ) : null}
    </svg>
  );
}

export default ArrangementView;
