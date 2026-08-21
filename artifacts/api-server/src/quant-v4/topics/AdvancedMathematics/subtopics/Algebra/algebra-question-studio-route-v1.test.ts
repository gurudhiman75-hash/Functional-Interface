import algebraQuestionStudioRouter from "../../../../../routes/admin-question-studio-algebra";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

type RouteDescriptor = { path: string; methods: string[] };
const routes: RouteDescriptor[] = ((algebraQuestionStudioRouter as any).stack ?? [])
  .filter((layer: any) => layer.route)
  .map((layer: any) => ({
    path: String(layer.route.path),
    methods: Object.entries(layer.route.methods ?? {})
      .filter(([, enabled]) => Boolean(enabled))
      .map(([method]) => method.toUpperCase())
      .sort(),
  }));

function hasRoute(method: string, path: string): boolean {
  return routes.some((route) => route.path === path && route.methods.includes(method));
}

assert(hasRoute("GET", "/quant/algebra/package"), "Missing Algebra Question Studio package route");
assert(hasRoute("GET", "/quant/algebra/preview"), "Missing Algebra Question Studio preview route");
assert(hasRoute("POST", "/quant/algebra/runs"), "Missing Algebra Question Studio review-run route");
assert(hasRoute("GET", "/quant/algebra/status"), "Missing Algebra Question Studio status route");
assert(routes.length === 4, `Expected exactly four Algebra Question Studio routes, found ${routes.length}`);
assert(!routes.some((route) => /publish|question-bank|mock|test/i.test(route.path)), "Downstream publication/Question Bank/test route leaked into Algebra integration gate");

console.log(`Algebra Question Studio route contract passed: ${routes.map((route) => `${route.methods.join("+")} ${route.path}`).join(", ")}`);
