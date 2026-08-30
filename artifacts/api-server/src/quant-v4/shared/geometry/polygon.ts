export interface GeoPolygon {
  readonly kind: "POLYGON";
  readonly id: string;
  readonly vertexIds: readonly string[];
}

export function createPolygon(id: string, vertexIds: readonly string[]): GeoPolygon {
  if (vertexIds.length < 3) throw new Error("A polygon requires at least three vertices");
  if (new Set(vertexIds).size !== vertexIds.length) throw new Error("Polygon vertices must be distinct");
  return Object.freeze({ kind: "POLYGON" as const, id, vertexIds: Object.freeze([...vertexIds]) });
}
