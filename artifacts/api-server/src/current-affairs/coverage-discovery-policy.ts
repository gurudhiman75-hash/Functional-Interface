export const COVERAGE_DISCOVERY_VERSION = "ca-coverage-matrix-v1";
// Coverage completeness is measured independently of competitor publication timing.
export const COVERAGE_SEARCH_CONCURRENCY = 4;
export const COVERAGE_CATCHUP_LOOKBACK_DAYS = 2;

export type CoverageSweep = {
  key: string;
  label: string;
  query: (date: string) => string;
  rescueQuery: (date: string) => string;
};

export const COVERAGE_CATEGORY_SWEEPS: readonly CoverageSweep[] = [
  { key: "national_governance", label: "National & Governance", query: (d) => `India national government cabinet parliament policy scheme major development ${d}`, rescueQuery: (d) => `India ministry cabinet parliament scheme act rule portal launch announcement ${d}` },
  { key: "schemes_welfare", label: "Schemes & Welfare", query: (d) => `India government scheme welfare mission programme beneficiaries launch approval ${d}`, rescueQuery: (d) => `new central scheme mission programme subsidy beneficiaries India ${d}` },
  { key: "state_affairs", label: "State Affairs", query: (d) => `India states government cabinet scheme policy state current affairs ${d}`, rescueQuery: (d) => `state government launches approves scheme policy India states ${d}` },
  { key: "punjab", label: "Punjab", query: (d) => `Punjab government cabinet agriculture education health economy sports appointments important news ${d}`, rescueQuery: (d) => `Punjab Chandigarh government notification scheme policy appointment award report ${d}` },
  { key: "international", label: "International", query: (d) => `India world international diplomacy summit treaty agreement UN WHO IMF World Bank current affairs ${d}`, rescueQuery: (d) => `India bilateral multilateral summit agreement global organisation international development ${d}` },
  { key: "banking_rbi", label: "Banking & RBI", query: (d) => `India RBI banking payments UPI NPCI bank regulation monetary policy current affairs ${d}`, rescueQuery: (d) => `RBI NPCI bank payment regulation circular launch India ${d}` },
  { key: "economy_macro", label: "Economy", query: (d) => `India economy GDP inflation trade fiscal exports imports government data current affairs ${d}`, rescueQuery: (d) => `India GDP inflation IIP trade deficit fiscal data NSO ministry economy ${d}` },
  { key: "business_industry", label: "Business & Industry", query: (d) => `India business industry company investment manufacturing startup major development ${d}`, rescueQuery: (d) => `India company investment plant manufacturing business launch deal ${d}` },
  { key: "regulators_markets", label: "Regulators & Markets", query: (d) => `India SEBI IRDAI PFRDA TRAI CCI DGFT BIS regulator market rule circular ${d}`, rescueQuery: (d) => `SEBI IRDAI PFRDA TRAI CCI regulator notification India ${d}` },
  { key: "courts_legal", label: "Courts & Legal", query: (d) => `India Supreme Court High Court legal constitutional major judgment law current affairs ${d}`, rescueQuery: (d) => `Supreme Court India judgment constitution law tribunal important ruling ${d}` },
  { key: "appointments", label: "Appointments", query: (d) => `India appointed appointment chairperson CEO governor chief new head takes charge ${d}`, rescueQuery: (d) => `appointed as new chairman chief director governor India ${d}` },
  { key: "awards_honours", label: "Awards & Honours", query: (d) => `India award prize honour winner recipient national international ${d}`, rescueQuery: (d) => `award prize honour announced winner Indian ${d}` },
  { key: "reports_indices", label: "Reports & Indices", query: (d) => `India report index ranking survey data released world bank UN government ${d}`, rescueQuery: (d) => `report index ranking India released survey global ranking ${d}` },
  { key: "science_technology", label: "Science & Technology", query: (d) => `India science technology AI semiconductor quantum biotechnology research launch ${d}`, rescueQuery: (d) => `India science research technology breakthrough AI quantum semiconductor ${d}` },
  { key: "space", label: "Space", query: (d) => `India ISRO satellite mission launch space astronomy current affairs ${d}`, rescueQuery: (d) => `ISRO satellite mission launch orbit India ${d}` },
  { key: "defence_security", label: "Defence & Security", query: (d) => `India defence DRDO Army Navy Air Force military exercise missile security ${d}`, rescueQuery: (d) => `India DRDO military exercise defence agreement missile armed forces ${d}` },
  { key: "environment_climate", label: "Environment & Climate", query: (d) => `India environment climate wildlife biodiversity forest renewable energy current affairs ${d}`, rescueQuery: (d) => `India environment climate conservation wildlife national park renewable energy ${d}` },
  { key: "sports", label: "Sports", query: (d) => `India sports winner championship tournament medal cricket hockey badminton chess athletics ${d}`, rescueQuery: (d) => `Indian athlete team wins title medal tournament championship ${d}` },
  { key: "mous_agreements", label: "MoUs & Agreements", query: (d) => `India MoU memorandum agreement partnership signed government organisation ${d}`, rescueQuery: (d) => `India signs MoU agreement partnership ministry organisation ${d}` },
  { key: "mergers_acquisitions", label: "Mergers & Acquisitions", query: (d) => `India merger acquisition stake buyout approved company banking ${d}`, rescueQuery: (d) => `India acquisition merger stake deal approval company ${d}` },
  { key: "apps_portals_digital", label: "Apps, Portals & Digital", query: (d) => `India app portal platform digital service launched government current affairs ${d}`, rescueQuery: (d) => `India launches portal app digital platform ministry ${d}` },
  { key: "books_authors", label: "Books & Authors", query: (d) => `India book author released memoir biography current affairs ${d}`, rescueQuery: (d) => `new book authored by Indian author launched released ${d}` },
  { key: "important_days", label: "Important Days", query: (d) => `important day theme observed international national day theme ${d}`, rescueQuery: (d) => `world day international day theme ${d}` },
  { key: "obituaries", label: "Obituaries", query: (d) => `India notable person dies passes away obituary former leader scientist sportsperson ${d}`, rescueQuery: (d) => `noted Indian dies passes away former minister scientist actor sportsperson ${d}` },
] as const;

export const COVERAGE_CATCHUP_SWEEPS = [
  { key: "catchup_national_economy", category: "national_governance", query: (d: string) => `India major government economy banking development current affairs around ${d}` },
  { key: "catchup_international", category: "international", query: (d: string) => `India international summit treaty global organisation major development around ${d}` },
  { key: "catchup_science_defence", category: "science_technology", query: (d: string) => `India science space defence ISRO DRDO major development around ${d}` },
  { key: "catchup_reports_appointments", category: "reports_indices", query: (d: string) => `India report index ranking appointment award major current affairs around ${d}` },
  { key: "catchup_sports", category: "sports", query: (d: string) => `India sports title winner medal record major current affairs around ${d}` },
  { key: "catchup_punjab", category: "punjab", query: (d: string) => `Punjab government economy agriculture sports important development around ${d}` },
] as const;

export const OPEN_WEB_BLOCKED_DOMAINS = new Set([
  "facebook.com", "instagram.com", "x.com", "twitter.com", "youtube.com", "youtu.be",
  "reddit.com", "quora.com", "pinterest.com", "linkedin.com", "tiktok.com",
]);

export function shiftCoverageDate(date: string, days: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Coverage date must be YYYY-MM-DD");
  const value = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(value.getTime()) || value.toISOString().slice(0, 10) !== date) throw new Error("Coverage date is invalid");
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function isBlockedOpenWebDomain(domain: string) {
  const normalized = domain.toLowerCase().replace(/^www\./, "");
  return [...OPEN_WEB_BLOCKED_DOMAINS].some((blocked) => normalized === blocked || normalized.endsWith(`.${blocked}`));
}

export function coverageHoleKeys(counts: Record<string, number>) {
  return COVERAGE_CATEGORY_SWEEPS.filter((item) => Number(counts[item.key] ?? 0) === 0).map((item) => item.key);
}
