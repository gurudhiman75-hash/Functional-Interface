import { classifySpatialSceneSymmetry, transformSceneByRequestedOperation } from "./symmetry";
import { translateScene } from "./transform";
import {
  SPATIAL_SCENE_VERSION,
  type SpatialGlyphAuthorityEntry,
  type SpatialNode,
  type SpatialRequestedTransform,
  type SpatialScene,
  type SpatialScript,
  type SpatialSymmetryProfile,
} from "./types";
import { validateSpatialGlyphAuthority } from "./glyph-authority";

const GLYPH_VIEWBOX = { minX: 0, minY: 0, width: 20, height: 20 } as const;
const GLYPH_CENTER = { x: 10, y: 10 } as const;
const STROKE = {
  stroke: "#111",
  strokeWidth: 2.2,
  fill: "none",
  lineCap: "round" as const,
  lineJoin: "round" as const,
};

function line(id: string, x1: number, y1: number, x2: number, y2: number): SpatialNode {
  return {
    kind: "line",
    id,
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    style: STROKE,
  };
}

function polyline(id: string, points: Array<[number, number]>): SpatialNode {
  return {
    kind: "polyline",
    id,
    points: points.map(([x, y]) => ({ x, y })),
    style: STROKE,
  };
}

function scene(id: string, nodes: SpatialNode[]): SpatialScene {
  return {
    version: SPATIAL_SCENE_VERSION,
    id,
    viewBox: { ...GLYPH_VIEWBOX },
    nodes,
    metadata: { semanticRole: "CANONICAL_VECTOR_GLYPH" },
  };
}

function entry(
  glyphId: string,
  script: SpatialScript,
  canonicalScene: SpatialScene,
  symmetry: SpatialSymmetryProfile,
): SpatialGlyphAuthorityEntry {
  return {
    glyphId,
    script,
    localeMode: script === "LATIN" ? "SCRIPT_SPECIFIC" : "INSTRUCTION_LOCALISED",
    canonicalScene,
    symmetry,
    authorityVersion: "PROOF-V2-LEGIBILITY",
  };
}

export const SPATIAL_PROOF_GLYPH_AUTHORITY: readonly SpatialGlyphAuthorityEntry[] = [
  entry(
    "LATIN-F",
    "LATIN",
    scene("GLYPH-LATIN-F", [
      line("stem", 3, 2, 3, 18),
      line("top", 3, 2, 17, 2),
      line("middle", 3, 10, 14, 10),
    ]),
    { vertical: false, horizontal: false, rotational180: false },
  ),
  entry(
    "LATIN-L",
    "LATIN",
    scene("GLYPH-LATIN-L", [
      line("stem", 3, 2, 3, 18),
      line("bottom", 3, 18, 17, 18),
    ]),
    { vertical: false, horizontal: false, rotational180: false },
  ),
  entry(
    "LATIN-P",
    "LATIN",
    scene("GLYPH-LATIN-P", [
      line("stem", 3, 2, 3, 18),
      polyline("rounded-bowl", [
        [3, 2],
        [12, 2],
        [16, 4],
        [17, 7],
        [15, 10],
        [3, 10],
      ]),
    ]),
    { vertical: false, horizontal: false, rotational180: false },
  ),
  entry(
    "LATIN-R",
    "LATIN",
    scene("GLYPH-LATIN-R", [
      line("stem", 3, 2, 3, 18),
      polyline("rounded-bowl", [
        [3, 2],
        [12, 2],
        [16, 4],
        [17, 7],
        [15, 10],
        [3, 10],
      ]),
      line("leg", 10, 10, 18, 18),
    ]),
    { vertical: false, horizontal: false, rotational180: false },
  ),
  entry(
    "LATIN-K",
    "LATIN",
    scene("GLYPH-LATIN-K", [
      line("stem", 3, 2, 3, 18),
      line("upper-arm", 3, 10, 17, 2),
      line("lower-arm", 3, 10, 17, 18),
    ]),
    { vertical: false, horizontal: true, rotational180: false },
  ),
  entry(
    "LATIN-Q",
    "LATIN",
    scene("GLYPH-LATIN-Q", [
      {
        kind: "circle",
        id: "bowl",
        center: { x: 10, y: 9 },
        radius: 7,
        style: STROKE,
      },
      line("tail-inside", 11, 11, 14, 14),
      line("tail-outside", 14, 14, 18, 18),
    ]),
    { vertical: false, horizontal: false, rotational180: false },
  ),
  entry(
    "DIGIT-2",
    "WESTERN_ARABIC_DIGIT",
    scene("GLYPH-DIGIT-2", [
      polyline("stroke", [
        [3, 5],
        [7, 2],
        [14, 2],
        [17, 5],
        [17, 8],
        [3, 18],
        [17, 18],
      ]),
    ]),
    { vertical: false, horizontal: false, rotational180: false },
  ),
  entry(
    "DIGIT-4",
    "WESTERN_ARABIC_DIGIT",
    scene("GLYPH-DIGIT-4", [
      line("left-diagonal", 14, 2, 4, 12),
      line("crossbar", 4, 12, 18, 12),
      line("upright-stem", 14, 2, 14, 18),
    ]),
    { vertical: false, horizontal: false, rotational180: false },
  ),
  entry(
    "DIGIT-5",
    "WESTERN_ARABIC_DIGIT",
    scene("GLYPH-DIGIT-5", [
      polyline("stroke", [
        [17, 2],
        [3, 2],
        [3, 10],
        [14, 10],
        [17, 13],
        [17, 16],
        [14, 18],
        [3, 18],
      ]),
    ]),
    { vertical: false, horizontal: false, rotational180: false },
  ),
  entry(
    "DIGIT-7",
    "WESTERN_ARABIC_DIGIT",
    scene("GLYPH-DIGIT-7", [
      polyline("stroke", [
        [3, 2],
        [17, 2],
        [8, 18],
      ]),
    ]),
    { vertical: false, horizontal: false, rotational180: false },
  ),
] as const;

const GLYPH_BY_ID = new Map(
  SPATIAL_PROOF_GLYPH_AUTHORITY.map((item) => [item.glyphId, item] as const),
);

export function getSpatialProofGlyph(glyphId: string): SpatialGlyphAuthorityEntry {
  const found = GLYPH_BY_ID.get(glyphId);
  if (!found) {
    throw new Error(`Unsupported proof glyph '${glyphId}'.`);
  }
  return found;
}

export interface BuildGlyphStringSceneInput {
  id: string;
  glyphIds: readonly string[];
  glyphOrder?: readonly number[];
  glyphTransform?: Extract<
    SpatialRequestedTransform,
    "REFLECT_VERTICAL" | "REFLECT_HORIZONTAL"
  >;
}

export function buildGlyphStringScene(input: BuildGlyphStringSceneInput): SpatialScene {
  if (input.glyphIds.length < 2 || input.glyphIds.length > 4) {
    throw new Error("Proof glyph strings must contain two to four glyphs.");
  }

  const order = input.glyphOrder ?? input.glyphIds.map((_, index) => index);
  if (
    order.length !== input.glyphIds.length ||
    new Set(order).size !== input.glyphIds.length ||
    order.some((index) => index < 0 || index >= input.glyphIds.length)
  ) {
    throw new Error("Glyph order must be a complete permutation of source indices.");
  }

  const width = input.glyphIds.length * 24 + 4;
  const nodes: SpatialNode[] = [];

  order.forEach((sourceIndex, slotIndex) => {
    const authority = getSpatialProofGlyph(input.glyphIds[sourceIndex]!);
    let glyphScene = authority.canonicalScene;
    if (input.glyphTransform) {
      glyphScene = transformSceneByRequestedOperation(
        glyphScene,
        input.glyphTransform,
        { axisX: GLYPH_CENTER.x, axisY: GLYPH_CENTER.y, pivot: GLYPH_CENTER },
        `${glyphScene.id}-${input.glyphTransform}`,
      );
    }

    const positioned = translateScene(
      glyphScene,
      4 + slotIndex * 24,
      10,
      `${input.id}-glyph-${slotIndex}`,
    );
    nodes.push(
      ...positioned.nodes.map((node) => ({
        ...node,
        id: `glyph-${slotIndex}-${node.id}`,
        role: `glyph-${slotIndex}`,
      })),
    );
  });

  return {
    version: SPATIAL_SCENE_VERSION,
    id: input.id,
    viewBox: { minX: 0, minY: 0, width, height: 40 },
    nodes,
    metadata: {
      semanticRole: "CANONICAL_VECTOR_GLYPH_STRING",
      glyphCount: input.glyphIds.length,
      glyphAuthorityVersion: "PROOF-V2-LEGIBILITY",
      recommendedRenderPixels: 150,
    },
  };
}

export function validateSpatialProofGlyphAuthority(): void {
  const validation = validateSpatialGlyphAuthority([...SPATIAL_PROOF_GLYPH_AUTHORITY]);
  if (!validation.ok) {
    throw new Error(
      `Invalid proof glyph authority: ${validation.errors
        .map((item) => `${item.code}:${item.message}`)
        .join(" | ")}`,
    );
  }

  for (const authority of SPATIAL_PROOF_GLYPH_AUTHORITY) {
    const computed = classifySpatialSceneSymmetry(authority.canonicalScene);
    if (
      computed.vertical !== authority.symmetry.vertical ||
      computed.horizontal !== authority.symmetry.horizontal ||
      computed.rotational180 !== authority.symmetry.rotational180
    ) {
      throw new Error(`Glyph symmetry drift for '${authority.glyphId}'.`);
    }
  }
}
