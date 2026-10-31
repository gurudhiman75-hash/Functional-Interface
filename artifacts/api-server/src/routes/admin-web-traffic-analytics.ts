import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";

const router = Router();
router.use(authenticate);
router.use(requireAdminPermission("users.students.read"));

const allowedWindows = new Set([7, 30]);
const cloudflareGraphql = "https://api.cloudflare.com/client/v4/graphql";
const idPattern = /^[a-f0-9]{32}$/i;
const requestTimeoutMs = 9000;
const numberOrZero = (value: unknown): number => Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;

type Group = {
  count?: number;
  dimensions?: { date?: string; deviceType?: string; refererHost?: string };
  sum?: { visits?: number };
  avg?: { sampleInterval?: number };
};

router.get("/traffic", async (req, res) => {
  res.setHeader("Cache-Control", "private, no-store");
  const days = Number(req.query.window ?? 7);
  if (!allowedWindows.has(days)) {
    return res.status(400).json({ code: "TRAFFIC_WINDOW_UNSUPPORTED", error: "Web traffic reporting currently supports 7- and 30-day periods." });
  }

  const token = process.env.CLOUDFLARE_ANALYTICS_READ_TOKEN?.trim();
  const accountTag = process.env.CLOUDFLARE_ANALYTICS_ACCOUNT_TAG?.trim();
  const siteTag = process.env.CLOUDFLARE_ANALYTICS_SITE_TAG?.trim();
  if (!token || !accountTag || !siteTag || !idPattern.test(accountTag) || !idPattern.test(siteTag)) {
    return res.status(503).json({ code: "TRAFFIC_NOT_CONFIGURED", error: "Cloudflare Web Analytics collection is enabled, but the server-side read-only reporting integration is not configured." });
  }

  const end = new Date();
  const start = new Date(end.getTime() - days * 86400000);
  const query = `query WebTraffic($accountTag: string!, $siteTag: string!, $start: Time!, $end: Time!) {
    viewer {
      accounts(filter: { accountTag: $accountTag }) {
        daily: rumPageloadEventsAdaptiveGroups(limit: 32, orderBy: [date_ASC], filter: { siteTag: $siteTag, datetime_geq: $start, datetime_leq: $end }) {
          count dimensions { date } sum { visits } avg { sampleInterval }
        }
        devices: rumPageloadEventsAdaptiveGroups(limit: 20, orderBy: [count_DESC], filter: { siteTag: $siteTag, datetime_geq: $start, datetime_leq: $end }) {
          count dimensions { deviceType } avg { sampleInterval }
        }
        referrers: rumPageloadEventsAdaptiveGroups(limit: 50, orderBy: [count_DESC], filter: { siteTag: $siteTag, datetime_geq: $start, datetime_leq: $end }) {
          count dimensions { refererHost } avg { sampleInterval }
        }
      }
    }
  }`;

  try {
    const response = await fetch(cloudflareGraphql, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { accountTag, siteTag, start: start.toISOString(), end: end.toISOString() },
      }),
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
    if (!response.ok) {
      console.error("Cloudflare traffic API returned an unsuccessful status", response.status);
      return res.status(502).json({ code: "TRAFFIC_PROVIDER_UNAVAILABLE", error: "Cloudflare traffic metrics are temporarily unavailable." });
    }

    const payload = await response.json() as {
      data?: { viewer?: { accounts?: Array<{ daily?: Group[]; devices?: Group[]; referrers?: Group[] }> } };
      errors?: Array<{ message?: string }>;
    };
    if (payload.errors?.length || !payload.data?.viewer?.accounts?.length) {
      console.error("Cloudflare traffic API query could not be completed");
      return res.status(502).json({ code: "TRAFFIC_PROVIDER_QUERY_FAILED", error: "The Cloudflare traffic report could not be verified." });
    }

    const groups = payload.data.viewer.accounts[0];
    const daily = (groups?.daily ?? [])
      .filter((row) => /^\\d{4}-\\d{2}-\\d{2}$/.test(row.dimensions?.date ?? ""))
      .map((row) => ({
        day: row.dimensions!.date!,
        pageLoads: numberOrZero(row.count),
        visits: numberOrZero(row.sum?.visits),
      }));
    const sampling = (groups?.daily ?? []).some((row) => numberOrZero(row.avg?.sampleInterval) > 1);
    const devices = (groups?.devices ?? [])
      .map((row) => ({ name: String(row.dimensions?.deviceType || "Unknown").slice(0, 50), pageLoads: numberOrZero(row.count) }))
      .filter((row) => row.pageLoads > 0);
    const referrers = (groups?.referrers ?? [])
      .map((row) => ({ name: String(row.dimensions?.refererHost || "Direct / unknown").slice(0, 140), pageLoads: numberOrZero(row.count) }))
      .filter((row) => row.pageLoads > 0);
    return res.json({
      source: "cloudflare-web-analytics",
      windowDays: days,
      generatedAt: new Date().toISOString(),
      sampled: sampling || (groups?.devices ?? []).some((row) => numberOrZero(row.avg?.sampleInterval) > 1) || (groups?.referrers ?? []).some((row) => numberOrZero(row.avg?.sampleInterval) > 1),
      summary: {
        pageLoads: daily.reduce((sum, row) => sum + row.pageLoads, 0),
        visits: daily.reduce((sum, row) => sum + row.visits, 0),
      },
      daily,
      devices,
      referrers,
      note: "Visits are Cloudflare RUM visit events, not unique people or registered students. Counts may be sampled; data includes only measured browser beacon events.",
    });
  } catch {
    console.error("Cloudflare traffic report request failed");
    return res.status(502).json({ code: "TRAFFIC_PROVIDER_UNAVAILABLE", error: "Unable to retrieve Cloudflare traffic metrics." });
  }
});

export default router;
