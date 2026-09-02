import assert from "node:assert/strict";

import {
  gdeltQueryUrl,
  isOpenNewsClusterEligible,
  OPEN_NEWS_DISCOVERY_QUERIES,
  parseGdeltArticleList,
} from "./open-news-discovery";

assert.ok(OPEN_NEWS_DISCOVERY_QUERIES.length >= 9);
assert.ok(OPEN_NEWS_DISCOVERY_QUERIES.some((item) => item.key === "punjab"));
assert.ok(OPEN_NEWS_DISCOVERY_QUERIES.some((item) => item.key === "punjab_governance"));
assert.ok(OPEN_NEWS_DISCOVERY_QUERIES.some((item) => item.key === "economy_banking"));
assert.ok(OPEN_NEWS_DISCOVERY_QUERIES.some((item) => item.key === "regulators_departments"));
assert.ok(OPEN_NEWS_DISCOVERY_QUERIES.some((item) => item.key === "international_diplomacy"));
assert.match(
  OPEN_NEWS_DISCOVERY_QUERIES.find((item) => item.key === "regulators_departments")?.query ?? "",
  /Legal Metrology/,
);

const url = new URL(gdeltQueryUrl("sourcecountry:india sourcelang:english", "2026-08-30", 500));
assert.equal(url.origin, "https://api.gdeltproject.org");
assert.equal(url.pathname, "/api/v2/doc/doc");
assert.equal(url.searchParams.get("mode"), "artlist");
assert.equal(url.searchParams.get("format"), "json");
assert.equal(url.searchParams.get("maxrecords"), "250");
assert.equal(url.searchParams.get("startdatetime"), "20260829183000");
assert.equal(url.searchParams.get("enddatetime"), "20260830182959");
assert.throws(() => gdeltQueryUrl("India", "2026-02-30"), /target date is invalid/);

const articles = parseGdeltArticleList({
  articles: [
    {
      url: "https://www.thehindu.com/news/national/example-story/article123.ece",
      title: "Government announces a major national policy initiative",
      seendate: "20260830T103000Z",
      domain: "www.thehindu.com",
      language: "English",
      sourcecountry: "India",
    },
    {
      url: "https://indianexpress.com/article/india/example-999/",
      title: "RBI announces a banking policy development",
      seendate: "20260830172959",
      domain: "indianexpress.com",
      language: "English",
      sourcecountry: "India",
    },
    {
      url: "https://example.com/start-boundary",
      title: "Punjab cabinet approves another examination relevant initiative",
      seendate: "20260829T183000Z",
      domain: "example.com",
    },
    {
      url: "https://example.com/next-india-day",
      title: "Article observed at the start of the next India day",
      seendate: "20260830T183000Z",
      domain: "example.com",
    },
    {
      url: "http://example.com/insecure",
      title: "Insecure article should be rejected",
      seendate: "20260830T110000Z",
      domain: "example.com",
    },
    {
      url: "https://example.com/wrong-day",
      title: "Article from another India day should be rejected",
      seendate: "20260829T170000Z",
      domain: "example.com",
    },
  ],
}, "2026-08-30");

assert.equal(articles.length, 3);
assert.equal(articles[0]?.domain, "thehindu.com");
assert.equal(articles[0]?.seenAt, "2026-08-30T10:30:00.000Z");
assert.equal(articles[1]?.domain, "indianexpress.com");
assert.equal(articles[1]?.seenAt, "2026-08-30T17:29:59.000Z");
assert.equal(articles[2]?.seenAt, "2026-08-29T18:30:00.000Z");
assert.ok(articles.every((article) => article.url.startsWith("https://")));
assert.ok(articles.every((article) => !article.url.includes("next-india-day")));

const broadLowSignal = isOpenNewsClusterEligible({
  discoveryScore: 24,
  queryKeys: ["india_press_broad"],
});
assert.equal(broadLowSignal.eligible, false);
assert.equal(broadLowSignal.reason, "broad_only_low_signal");

const strongBroadSignal = isOpenNewsClusterEligible({
  discoveryScore: 45,
  queryKeys: ["india_press_broad"],
});
assert.equal(strongBroadSignal.eligible, true);
assert.equal(strongBroadSignal.reason, "exam_signal_score");

const targetedLowSignal = isOpenNewsClusterEligible({
  discoveryScore: 24,
  queryKeys: ["science_defence_sports"],
});
assert.equal(targetedLowSignal.eligible, true);
assert.equal(targetedLowSignal.reason, "targeted_discovery_query");

const regulatorLowSignal = isOpenNewsClusterEligible({
  discoveryScore: 18,
  queryKeys: ["regulators_departments"],
});
assert.equal(regulatorLowSignal.eligible, true);
assert.equal(regulatorLowSignal.reason, "targeted_discovery_query");

console.log("CP-043/052 open-news target-date, expanded-source and clustering-triage contracts passed");
