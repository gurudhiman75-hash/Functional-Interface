import assert from "node:assert/strict";
import { once } from "node:events";
import { build } from "esbuild";
import express from "express";

const previous = process.env.EXAMTREE_SALES_DISABLED;
process.env.EXAMTREE_SALES_DISABLED = "true";
let writes = 0;
globalThis.salesPausedFixture = (...args) => {
  writes += 1;
  throw new Error("sales pause must stop before database access: " + args.length);
};
await build({
  entryPoints: ["src/routes/canonical-commerce-checkout.ts"],
  outfile: "dist/sales-paused-fixture.mjs",
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  plugins: [{ name: "fixtures", setup(builder) {
    builder.onResolve({ filter: /^\.\.\/lib\/db$/ },
      () => ({ path: "db", namespace: "fixture" }));
    builder.onResolve({ filter: /^\.\.\/middlewares\/auth$/ },
      () => ({ path: "auth", namespace: "fixture" }));
    builder.onLoad({ filter: /.*/, namespace: "fixture" }, ({ path }) => ({
      loader: "js",
      contents: path === "auth"
        ? 'export function authenticate(req,res,next){if(!req.headers["x-user"])return res.status(401).json({code:"AUTH_REQUIRED"});req.user={id:"firebase-uid"};next();}'
        : "export const sqlClient=(...args)=>globalThis.salesPausedFixture(...args);sqlClient.begin=()=>{throw Error('transaction attempted');};",
    }));
  } }],
});
const { default: router } = await import("../dist/sales-paused-fixture.mjs");
const app = express();
app.use(express.json());
app.use(router);
const server = app.listen(0, "127.0.0.1");
await once(server, "listening");
try {
  const base = "http://127.0.0.1:" + server.address().port;
  const response = await fetch(base + "/commerce/orders", {
    method: "POST",
    headers: { "content-type": "application/json", "x-user": "test" },
    body: JSON.stringify({ productId: "invalid", idempotencyKey: "bad" }),
  });
  assert.equal(response.status, 503);
  const payload = await response.json();
  assert.equal(payload.code, "SALES_TEMPORARILY_UNAVAILABLE");
  assert.equal(writes, 0, "must not touch real database or gateway before blocking");
  console.log("PASS: checkout paused with 503 before validation, DB write or payment request");
} finally {
  server.close();
  if (previous === undefined) delete process.env.EXAMTREE_SALES_DISABLED;
  else process.env.EXAMTREE_SALES_DISABLED = previous;
}
