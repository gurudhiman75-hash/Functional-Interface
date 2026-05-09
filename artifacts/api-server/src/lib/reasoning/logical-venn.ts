export type SetRelation =
  | "subset"
  | "disjoint"
  | "overlap"
  | "unknown";

export type VennMathState = {
  total: number;
  a: number;
  b: number;
  c?: number;
  ab: number;
  bc?: number;
  ac?: number;
  abc?: number;
};

export function twoSetIntersection(
  total: number,
  a: number,
  b: number,
  neither: number,
) {
  const union = total - neither;
  return a + b - union;
}

export function threeSetUnion(
  state: VennMathState,
) {
  return (
    state.a +
    state.b +
    (state.c ?? 0) -
    state.ab -
    (state.bc ?? 0) -
    (state.ac ?? 0) +
    (state.abc ?? 0)
  );
}

export function exactlyTwo(
  state: VennMathState,
) {
  return (
    state.ab +
    (state.bc ?? 0) +
    (state.ac ?? 0) -
    3 * (state.abc ?? 0)
  );
}

export function atLeastTwo(
  state: VennMathState,
) {
  return (
    state.ab +
    (state.bc ?? 0) +
    (state.ac ?? 0) -
    2 * (state.abc ?? 0)
  );
}

export function validateVennMathState(
  state: VennMathState,
) {
  const union = threeSetUnion(state);
  const issues: string[] = [];

  if (union > state.total) {
    issues.push(
      "Set union cannot exceed the universal set.",
    );
  }

  if (state.ab > state.a || state.ab > state.b) {
    issues.push(
      "Pairwise intersection cannot exceed either parent set.",
    );
  }

  if (
    state.abc !== undefined &&
    (state.abc > state.ab ||
      state.abc > (state.bc ?? state.abc) ||
      state.abc > (state.ac ?? state.abc))
  ) {
    issues.push(
      "Triple intersection cannot exceed any pairwise intersection.",
    );
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function renderSimpleVennSvg(
  labels: string[],
) {
  const [a = "A", b = "B", c] =
    labels;

  if (!c) {
    return `<svg viewBox="0 0 220 130" role="img" aria-label="Two set Venn"><circle cx="85" cy="65" r="45" fill="#bfdbfe" fill-opacity="0.55" stroke="#2563eb"/><circle cx="135" cy="65" r="45" fill="#fecaca" fill-opacity="0.55" stroke="#dc2626"/><text x="55" y="65">${a}</text><text x="150" y="65">${b}</text></svg>`;
  }

  return `<svg viewBox="0 0 240 160" role="img" aria-label="Three set Venn"><circle cx="95" cy="70" r="48" fill="#bfdbfe" fill-opacity="0.5" stroke="#2563eb"/><circle cx="145" cy="70" r="48" fill="#fecaca" fill-opacity="0.5" stroke="#dc2626"/><circle cx="120" cy="110" r="48" fill="#bbf7d0" fill-opacity="0.5" stroke="#16a34a"/><text x="62" y="55">${a}</text><text x="160" y="55">${b}</text><text x="115" y="142">${c}</text></svg>`;
}
