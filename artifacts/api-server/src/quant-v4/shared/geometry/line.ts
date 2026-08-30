export interface GeoLine {
  readonly kind: "LINE";
  readonly id: string;
  readonly through: readonly [string, string];
}

export interface GeoRay {
  readonly kind: "RAY";
  readonly id: string;
  readonly originPointId: string;
  readonly throughPointId: string;
}

export function createLine(id: string, aPointId: string, bPointId: string): GeoLine {
  if (aPointId === bPointId) throw new Error("A line requires two distinct points");
  return Object.freeze({ kind: "LINE" as const, id, through: Object.freeze([aPointId, bPointId]) as readonly [string, string] });
}

export function createRay(id: string, originPointId: string, throughPointId: string): GeoRay {
  if (originPointId === throughPointId) throw new Error("A ray requires two distinct points");
  return Object.freeze({ kind: "RAY" as const, id, originPointId, throughPointId });
}
