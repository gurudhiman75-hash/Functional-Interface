import { validateCatalogState, type QcpCatalogState } from "./catalog-schema";
// Closed-form independent answers for the finite, versioned catalogue. This
// module does not import the production rational derivations or root solver.
export function independentlySolveCatalog(s: QcpCatalogState): number {
  validateCatalogState(s);
  const k = s.scale,
    left = s.quantity === "I";
  const C = (n: number, r: number) => {
    let p = 1;
    for (let i = 0; i < r; i++) p *= n - i;
    let f = 1;
    for (let i = 1; i <= r; i++) f *= i;
    return p / f;
  };
  switch (s.pattern) {
    case "BA24-01":
      return left ? 5 : 4;
    case "BA24-02":
      return 49 * k;
    case "BA24-03":
      return left
        ? C(5 * k, 2) / C(8 * k, 2)
        : s.rootIndex === 0
          ? 5 / 14
          : 8 / 7;
    case "BA24-04":
      return (left ? 576 : 480) * k * k;
    case "BA24-06":
      return left ? 60000 * k : (175000 * k) / 3;
    case "BA24-10":
      return (
        (left ? C(5 * k, 3) + C(6 * k, 3) : 468 * k * k * k) / C(20 * k, 3)
      );
    case "BA24-11":
      return left ? (100 - 25 * k) / 2 : (200 * 25 * k) / (100 + 25 * k);
    case "BA24-12":
      return 900 * k;
    case "BA24-13":
      return (
        (left
          ? (s.rootIndex === 0 ? -5 : 4) * Math.sqrt(3)
          : (s.rootIndex === 0 ? -5 : -2) * Math.sqrt(2)) * k
      );
    case "BA24-14":
      return (left ? 28000 : 27500) * k;
    case "BA24-15":
      return left ? 88 * k : (165 * k) / 2;
    case "BA24-16":
      return left ? 140 * k : (1250 * k) / 9;
    case "BA24-18":
      return left ? 450 / 7 : 750 / 11;
    case "BA24-19":
      return (left ? 40 : 42) * k;
    case "BA24-20":
      return left ? 10 : 11;
    case "BA22-01":
      return 144 * k;
    case "BA22-02":
      return (left ? 16000 : 20000) * k;
    case "BA22-03":
      return left ? ((120 + 5 * k) * (125 + 5 * k) - 10000) / 100 : 125 / 2;
    case "BA22-04":
      return left ? 2 * (4 + k) - 3 : 6;
    case "BA22-05":
      return (left ? 18 : 20) * k;
  }
}
