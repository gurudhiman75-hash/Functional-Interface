import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";

import express from "express";

process.env.DATABASE_URL ??= "postgresql://test:test@127.0.0.1:5432/test";

const [
  { default: bulkRouter },
  { default: dashboardRouter },
  { default: seriesRouter },
] = await Promise.all([
  import("./admin-question-studio-bulk-hardening"),
  import("./admin-question-studio-dashboard-lifecycle"),
  import("./admin-question-studio-series"),
]);

const app = express();
app.use(express.json());
app.use("/admin/question-studio", bulkRouter);
app.use("/admin/question-studio", dashboardRouter);
app.use("/admin/question-studio", seriesRouter);
app.post("/admin/question-studio/runs", (_req, res) => {
  res.status(418).json({ generationSystem: "legacy-quant-fallback" });
});

const server = app.listen(0, "127.0.0.1");
await new Promise<void>((resolve, reject) => {
  server.once("listening", resolve);
  server.once("error", reject);
});

try {
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}/admin/question-studio`;
  const jsonHeaders = { "content-type": "application/json" };

  const quantDispatch = await fetch(`${baseUrl}/runs`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ packageId: "PNL-001", count: 1 }),
  });
  assert.equal(
    quantDispatch.status,
    418,
    "Non-Series generation requests must continue to the established Quant route.",
  );
  assert.deepEqual(await quantDispatch.json(), {
    generationSystem: "legacy-quant-fallback",
  });

  const protectedRequests = [
    fetch(`${baseUrl}/capabilities`),
    fetch(`${baseUrl}/runs`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ packageId: "SER-001", count: 1 }),
    }),
    fetch(`${baseUrl}/items/bulk`, {
      method: "PATCH",
      headers: jsonHeaders,
      body: JSON.stringify({ itemIds: [], status: "approved" }),
    }),
    fetch(`${baseUrl}/dashboard`),
  ];

  const responses = await Promise.all(protectedRequests);
  for (const response of responses) {
    assert.ok(
      response.status === 401 || response.status === 500,
      `Expected an authentication boundary, received HTTP ${response.status}.`,
    );
    const payload = await response.json() as { error?: unknown; code?: unknown };
    assert.equal(typeof payload.error, "string");
    if (response.status === 401) {
      assert.equal(payload.code, "AUTH_TOKEN_REQUIRED");
    } else {
      assert.equal(payload.error, "Authentication not configured");
    }
  }

  console.log(JSON.stringify({
    status: "PASS_QUESTION_STUDIO_HTTP_AUTH_AND_DISPATCH",
    quantFallbackStatus: quantDispatch.status,
    protectedStatuses: responses.map((response) => response.status),
  }, null, 2));
} finally {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
}
