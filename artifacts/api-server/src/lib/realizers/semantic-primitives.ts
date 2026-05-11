import type {
  RealizationPrimitive,
} from "./types";

export type SemanticClue = {
  primitive: RealizationPrimitive;
  subject?: string;
  object?: string;
  anchor?: string;
  secondObject?: string;
  distance?: number;
  direction?: "left" | "right";
  raw?: string;
};

export function parseSeatingExpression(
  expression: string,
): SemanticClue {
  const raw = expression.trim();

  const notAdjacent = raw.match(
    /^(.+?)\s+not\s+adjacent\s+to\s+(.+)$/i,
  );
  if (notAdjacent) {
    return {
      primitive: "not-adjacent",
      subject: notAdjacent[1],
      object: notAdjacent[2],
      raw,
    };
  }

  const adjacent = raw.match(
    /^(.+?)\s+adjacent\s+to\s+(.+)$/i,
  );
  if (adjacent) {
    return {
      primitive: "adjacent",
      subject: adjacent[1],
      object: adjacent[2],
      raw,
    };
  }

  const offset = raw.match(
    /^(.+?)\s+(\d+)\s+(left|right)\s+of\s+(.+)$/i,
  );
  if (offset) {
    const [, subject, distance, direction, object] =
      offset;
    const numericDistance = Number(distance);
    return {
      primitive:
        direction.toLowerCase() === "left"
          ? numericDistance === 1
            ? "immediate-left"
            : "relative-left"
          : numericDistance === 1
            ? "immediate-right"
            : "relative-right",
      subject,
      object,
      distance: numericDistance,
      direction:
        direction.toLowerCase() === "left"
          ? "left"
          : "right",
      raw,
    };
  }

  const notEnd = raw.match(
    /^(.+?)\s+not\s+at\s+end$/i,
  );
  if (notEnd) {
    return {
      primitive: "not-end",
      subject: notEnd[1],
      raw,
    };
  }

  const between = raw.match(
    /^(.+?)\s+between\s+(.+?)\s+and\s+(.+)$/i,
  );
  if (between) {
    return {
      primitive: "between",
      subject: between[1],
      object: between[2],
      secondObject: between[3],
      raw,
    };
  }

  const notOpposite = raw.match(
    /^(.+?)\s+not\s+opposite(?:\s+to)?\s+(.+)$/i,
  );
  if (notOpposite) {
    return {
      primitive: "not-opposite",
      subject: notOpposite[1],
      object: notOpposite[2],
      raw,
    };
  }

  const opposite = raw.match(
    /^(.+?)\s+opposite\s+(.+)$/i,
  );
  if (opposite) {
    return {
      primitive: "opposite",
      subject: opposite[1],
      object: opposite[2],
      raw,
    };
  }

  return {
    primitive: "attribute-match",
    raw,
  };
}

export function semanticFromStudioRelation(
  relation: unknown,
  subject: string,
  object: string,
): SemanticClue {
  switch (String(relation ?? "")) {
    case "IMMEDIATE_LEFT":
      return {
        primitive: "immediate-left",
        subject,
        object,
        distance: 1,
        direction: "left",
      };
    case "IMMEDIATE_RIGHT":
      return {
        primitive: "immediate-right",
        subject,
        object,
        distance: 1,
        direction: "right",
      };
    case "SECOND_TO_LEFT":
      return {
        primitive: "relative-left",
        subject,
        object,
        distance: 2,
        direction: "left",
      };
    case "SECOND_TO_RIGHT":
      return {
        primitive: "relative-right",
        subject,
        object,
        distance: 2,
        direction: "right",
      };
    case "OPPOSITE":
      return {
        primitive: "opposite",
        subject,
        object,
      };
    case "NOT_OPPOSITE":
      return {
        primitive: "not-opposite",
        subject,
        object,
      };
    case "BETWEEN":
      return {
        primitive: "between",
        subject,
        object,
      };
    default:
      return {
        primitive: "attribute-match",
        subject,
        object,
        raw: String(relation ?? ""),
      };
  }
}

export function primitiveFromSeatingClueType(
  type: string,
): RealizationPrimitive {
  switch (type) {
    case "absolute":
      return "absolute-position";
    case "end":
      return "end-position";
    case "adjacent":
    case "adjacent-both":
      return "adjacent";
    case "not-adjacent":
      return "not-adjacent";
    case "offset":
      return "relative-left";
    case "between":
      return "between";
    case "not-end":
      return "not-end";
    case "opposite":
      return "opposite";
    case "not-opposite":
      return "not-opposite";
    case "same-row":
      return "same-row";
    case "different-row":
      return "different-row";
    case "slot-fixed":
      return "slot-fixed";
    case "slot-gap":
      return "slot-gap";
    case "slot-parity":
      return "slot-parity";
    case "slot-immediate":
      return "slot-immediate";
    case "slot-not":
      return "slot-not";
    case "attribute":
      return "attribute-match";
    default:
      return "attribute-match";
  }
}
