import { evaluateCurrentAffairsEditorialPriority } from "./editorial-priority";

export type DailyPackPortfolioEvent = {
  id: string;
  title: string;
  summary?: string;
  category: string;
  facts?: Array<{ key?: string; value?: string }>;
};

export type DailyPackPortfolioDecision = {
  selectedIds: string[];
  excluded: Array<{ id: string; reason: string }>;
};

const RAIL_INFRA = /\b(?:indian railways?|railway|railways|yard|kavach|electronic interlocking|rail line|bypass line|rkm|route km|station)\b/i;
const RAIL_SAFETY = /\b(?:kavach|safety|signalling|signaling|electronic interlocking|collision|automatic train protection)\b/i;
const CORPORATE_COMBINATION = /\b(?:cci|competition commission of india)\b.*\b(?:acquisition|merger|combination|equity shareholding)\b/i;
const PUBLIC_ENGAGEMENT = /\b(?:quiz|awareness theme|awareness campaign|dialogue series|foundation day)\b/i;

function combined(event: DailyPackPortfolioEvent) {
  const factText = (event.facts ?? []).map((fact) => `${fact.key ?? ""} ${fact.value ?? ""}`).join(" ");
  return `${event.title} ${event.summary ?? ""} ${factText}`.replace(/\s+/g, " ").trim();
}

function amountSignal(text: string) {
  const values = [...text.matchAll(/(?:₹|rs\.?\s*)\s*(\d+(?:\.\d+)?)\s*crore/gi)]
    .map((match) => Number(match[1] ?? 0))
    .filter(Number.isFinite);
  return values.length ? Math.max(...values) : 0;
}

function portfolioScore(event: DailyPackPortfolioEvent) {
  const priority = evaluateCurrentAffairsEditorialPriority(event);
  const text = combined(event);
  const tier = priority.tier === "critical" ? 400 : priority.tier === "high" ? 300 : priority.tier === "standard" ? 200 : 0;
  const safety = RAIL_SAFETY.test(text) ? 35 : 0;
  const international = /\b(?:summit|bilateral|multilateral|sco|g20|brics|agreement|mou)\b/i.test(text) ? 18 : 0;
  const appointment = /\b(?:appointed|appointment|takes over|assumes charge|first woman|first female|scripts history)\b/i.test(text) ? 18 : 0;
  const amount = Math.min(15, amountSignal(text) / 50);
  return tier + safety + international + appointment + amount;
}

export function selectDailyMasterPackPortfolio(
  events: DailyPackPortfolioEvent[],
  maxEvents = 18,
): DailyPackPortfolioDecision {
  const excluded: Array<{ id: string; reason: string }> = [];
  const eligible = events.filter((event) => {
    const priority = evaluateCurrentAffairsEditorialPriority(event);
    if (priority.tier !== "routine") return true;
    excluded.push({ id: event.id, reason: `routine:${priority.reasons.join("|")}` });
    return false;
  });

  const ranked = [...eligible].sort((a, b) => portfolioScore(b) - portfolioScore(a) || a.id.localeCompare(b.id));
  const selected: DailyPackPortfolioEvent[] = [];
  let railInfraCount = 0;
  let corporateCombinationCount = 0;
  let publicEngagementCount = 0;

  for (const event of ranked) {
    const priority = evaluateCurrentAffairsEditorialPriority(event);
    const text = combined(event);
    const protectedHighYield = priority.tier === "critical" || priority.tier === "high";

    if (!protectedHighYield && RAIL_INFRA.test(text)) {
      if (railInfraCount >= 2) {
        excluded.push({ id: event.id, reason: "portfolio_cap:rail_infrastructure" });
        continue;
      }
      railInfraCount += 1;
    }
    if (!protectedHighYield && CORPORATE_COMBINATION.test(text)) {
      if (corporateCombinationCount >= 2) {
        excluded.push({ id: event.id, reason: "portfolio_cap:corporate_combinations" });
        continue;
      }
      corporateCombinationCount += 1;
    }
    if (!protectedHighYield && PUBLIC_ENGAGEMENT.test(text)) {
      if (publicEngagementCount >= 1) {
        excluded.push({ id: event.id, reason: "portfolio_cap:public_engagement" });
        continue;
      }
      publicEngagementCount += 1;
    }

    if (selected.length < maxEvents || protectedHighYield) {
      selected.push(event);
    } else {
      excluded.push({ id: event.id, reason: "portfolio_cap:daily_event_limit" });
    }
  }

  return {
    selectedIds: selected.map((event) => event.id),
    excluded,
  };
}
