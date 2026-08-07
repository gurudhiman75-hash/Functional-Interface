import {
  spatialNodeSemanticFingerprint,
  spatialSceneSemanticFingerprint,
} from "./normalize";
import type {
  SpatialNode,
  SpatialPoint,
  SpatialScene,
  SpatialStyle,
  SpatialValidationIssue,
  SpatialValidationResult,
} from "./types";

const UNSAFE_STYLE_PATTERN = /(?:javascript:|url\s*\(|<|>|&\{)/i;

function issue(
  code: string,
  message: string,
  nodeId?: string,
): SpatialValidationIssue {
  return { code, message, nodeId };
}

function isFinitePoint(point: SpatialPoint): boolean {
  return Number.isFinite(point.x) && Number.isFinite(point.y);
}

function validateStyle(
  style: SpatialStyle | undefined,
  nodeId: string,
  errors: SpatialValidationIssue[],
): void {
  if (!style) return;

  for (const [name, value] of [
    ["stroke", style.stroke],
    ["fill", style.fill],
  ] as const) {
    if (value !== undefined && UNSAFE_STYLE_PATTERN.test(value)) {
      errors.push(
        issue(
          "UNSAFE_STYLE_VALUE",
          `${name} contains an unsafe SVG style value.`,
          nodeId,
        ),
      );
    }
  }

  if (
    style.strokeWidth !== undefined &&
    (!Number.isFinite(style.strokeWidth) || style.strokeWidth <= 0)
  ) {
    errors.push(
      issue(
        "INVALID_STROKE_WIDTH",
        "strokeWidth must be a positive finite number.",
        nodeId,
      ),
    );
  }

  if (
    style.opacity !== undefined &&
    (!Number.isFinite(style.opacity) || style.opacity < 0 || style.opacity > 1)
  ) {
    errors.push(
      issue(
        "INVALID_OPACITY",
        "opacity must be a finite number from 0 to 1.",
        nodeId,
      ),
    );
  }

  if (
    style.dashArray?.some(
      (entry) => !Number.isFinite(entry) || entry < 0,
    )
  ) {
    errors.push(
      issue(
        "INVALID_DASH_ARRAY",
        "dashArray entries must be non-negative finite numbers.",
        nodeId,
      ),
    );
  }
}

function validateNode(
  node: SpatialNode,
  errors: SpatialValidationIssue[],
): void {
  if (!node.id.trim()) {
    errors.push(issue("EMPTY_NODE_ID", "Every spatial node requires an ID."));
  }

  if (node.layer !== undefined && !Number.isInteger(node.layer)) {
    errors.push(
      issue("INVALID_LAYER", "Node layer must be an integer.", node.id),
    );
  }

  validateStyle(node.style, node.id, errors);

  switch (node.kind) {
    case "line":
      if (!isFinitePoint(node.start) || !isFinitePoint(node.end)) {
        errors.push(
          issue("NON_FINITE_POINT", "Line points must be finite.", node.id),
        );
      } else if (
        node.start.x === node.end.x &&
        node.start.y === node.end.y
      ) {
        errors.push(
          issue("ZERO_LENGTH_LINE", "Line endpoints must differ.", node.id),
        );
      }
      break;
    case "circle":
      if (!isFinitePoint(node.center)) {
        errors.push(
          issue("NON_FINITE_POINT", "Circle centre must be finite.", node.id),
        );
      }
      if (!Number.isFinite(node.radius) || node.radius <= 0) {
        errors.push(
          issue(
            "INVALID_RADIUS",
            "Circle radius must be a positive finite number.",
            node.id,
          ),
        );
      }
      break;
    case "polygon":
      if (node.points.length < 3) {
        errors.push(
          issue(
            "INSUFFICIENT_POLYGON_POINTS",
            "A polygon requires at least three points.",
            node.id,
          ),
        );
      }
      if (node.points.some((point) => !isFinitePoint(point))) {
        errors.push(
          issue("NON_FINITE_POINT", "Polygon points must be finite.", node.id),
        );
      }
      break;
    case "polyline":
      if (node.points.length < 2) {
        errors.push(
          issue(
            "INSUFFICIENT_POLYLINE_POINTS",
            "A polyline requires at least two points.",
            node.id,
          ),
        );
      }
      if (node.points.some((point) => !isFinitePoint(point))) {
        errors.push(
          issue("NON_FINITE_POINT", "Polyline points must be finite.", node.id),
        );
      }
      break;
    case "arc":
      if (!isFinitePoint(node.center)) {
        errors.push(
          issue("NON_FINITE_POINT", "Arc centre must be finite.", node.id),
        );
      }
      if (!Number.isFinite(node.radius) || node.radius <= 0) {
        errors.push(
          issue(
            "INVALID_RADIUS",
            "Arc radius must be a positive finite number.",
            node.id,
          ),
        );
      }
      if (
        !Number.isFinite(node.startAngleDeg) ||
        !Number.isFinite(node.endAngleDeg)
      ) {
        errors.push(
          issue(
            "INVALID_ARC_ANGLE",
            "Arc angles must be finite numbers.",
            node.id,
          ),
        );
      }
      break;
  }
}

function nodePointsForBounds(node: SpatialNode): SpatialPoint[] {
  switch (node.kind) {
    case "line":
      return [node.start, node.end];
    case "circle":
    case "arc":
      return [
        { x: node.center.x - node.radius, y: node.center.y - node.radius },
        { x: node.center.x + node.radius, y: node.center.y + node.radius },
      ];
    case "polygon":
    case "polyline":
      return node.points;
  }
}

export function validateSpatialScene(scene: SpatialScene): SpatialValidationResult {
  const errors: SpatialValidationIssue[] = [];
  const warnings: SpatialValidationIssue[] = [];

  if (scene.version !== "1.0") {
    errors.push(
      issue(
        "UNSUPPORTED_SCENE_VERSION",
        `Unsupported spatial scene version: ${String(scene.version)}`,
      ),
    );
  }

  if (!scene.id.trim()) {
    errors.push(issue("EMPTY_SCENE_ID", "Spatial scene requires an ID."));
  }

  const { minX, minY, width, height } = scene.viewBox;
  if (
    ![minX, minY, width, height].every(Number.isFinite) ||
    width <= 0 ||
    height <= 0
  ) {
    errors.push(
      issue(
        "INVALID_VIEWBOX",
        "Scene viewBox must use finite coordinates and positive dimensions.",
      ),
    );
  }

  const ids = new Set<string>();
  const geometryOwners = new Map<string, string>();

  for (const node of scene.nodes) {
    validateNode(node, errors);

    if (ids.has(node.id)) {
      errors.push(
        issue(
          "DUPLICATE_NODE_ID",
          `Duplicate node ID '${node.id}'.`,
          node.id,
        ),
      );
    }
    ids.add(node.id);

    const geometryFingerprint = spatialNodeSemanticFingerprint(node);
    const existingOwner = geometryOwners.get(geometryFingerprint);
    if (existingOwner) {
      warnings.push(
        issue(
          "DUPLICATE_GEOMETRY",
          `Node duplicates the semantic geometry of '${existingOwner}'.`,
          node.id,
        ),
      );
    } else {
      geometryOwners.set(geometryFingerprint, node.id);
    }

    if (width > 0 && height > 0) {
      const maxX = minX + width;
      const maxY = minY + height;
      const outside = nodePointsForBounds(node).some(
        (point) =>
          point.x < minX ||
          point.x > maxX ||
          point.y < minY ||
          point.y > maxY,
      );

      if (outside) {
        warnings.push(
          issue(
            "NODE_OUTSIDE_VIEWBOX",
            "Node extends outside the declared viewBox.",
            node.id,
          ),
        );
      }
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}

export function assertValidSpatialScene(scene: SpatialScene): void {
  const result = validateSpatialScene(scene);
  if (!result.ok) {
    const summary = result.errors
      .map((entry) => `${entry.code}${entry.nodeId ? `(${entry.nodeId})` : ""}`)
      .join(", ");
    throw new Error(`Invalid spatial scene: ${summary}`);
  }
}

export function validateSpatialOptionUniqueness(
  optionScenes: SpatialScene[],
): SpatialValidationResult {
  const errors: SpatialValidationIssue[] = [];
  const warnings: SpatialValidationIssue[] = [];
  const owners = new Map<string, number>();

  optionScenes.forEach((scene, index) => {
    const sceneResult = validateSpatialScene(scene);
    errors.push(
      ...sceneResult.errors.map((entry) => ({
        ...entry,
        message: `Option ${index + 1}: ${entry.message}`,
      })),
    );
    warnings.push(
      ...sceneResult.warnings.map((entry) => ({
        ...entry,
        message: `Option ${index + 1}: ${entry.message}`,
      })),
    );

    const fingerprint = spatialSceneSemanticFingerprint(scene);
    const existingIndex = owners.get(fingerprint);
    if (existingIndex !== undefined) {
      errors.push(
        issue(
          "EQUIVALENT_OPTIONS",
          `Options ${existingIndex + 1} and ${index + 1} are semantically equivalent.`,
        ),
      );
    } else {
      owners.set(fingerprint, index);
    }
  });

  return { ok: errors.length === 0, errors, warnings };
}
