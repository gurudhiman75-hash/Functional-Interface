export const CURRENT_AFFAIRS_REQUIRED_SOURCE_DOMAINS = [
  "national",
  "economy_banking",
  "punjab",
] as const;

export type CurrentAffairsRequiredSourceDomain = typeof CURRENT_AFFAIRS_REQUIRED_SOURCE_DOMAINS[number];

export type CurrentAffairsSourceHealthEndpoint = {
  sourceKey: string;
  name: string;
  sourceFamily: string;
  sourceTier: string;
  coverageDomain: string | null;
  scheduled: boolean;
  fresh: boolean;
  status: string | null;
};

export type CurrentAffairsSourceFamilyHealth = {
  sourceFamily: string;
  coverageDomain: string | null;
  healthy: boolean;
  degraded: boolean;
  endpointCount: number;
  freshSuccessfulEndpointCount: number;
  endpointKeys: string[];
};

export type CurrentAffairsSourceFamilyCoverage = {
  requiredSourceFamilies: number;
  healthyRequiredSourceFamilies: number;
  sourceCoveragePercent: number;
  failingPrimaryEndpoints: number;
  stalePrimaryEndpoints: number;
  unhealthySourceFamilies: string[];
  degradedSourceFamilies: string[];
  criticalDomainFailures: CurrentAffairsRequiredSourceDomain[];
  families: CurrentAffairsSourceFamilyHealth[];
};

function endpointHealthy(endpoint: CurrentAffairsSourceHealthEndpoint) {
  return endpoint.scheduled && endpoint.fresh && endpoint.status === "success";
}

export function evaluateCurrentAffairsSourceFamilyCoverage(
  endpoints: CurrentAffairsSourceHealthEndpoint[],
): CurrentAffairsSourceFamilyCoverage {
  const coreEndpoints = endpoints.filter((endpoint) => endpoint.sourceTier === "core_official" && endpoint.scheduled);
  const byFamily = new Map<string, CurrentAffairsSourceHealthEndpoint[]>();

  for (const endpoint of coreEndpoints) {
    const family = endpoint.sourceFamily.trim() || endpoint.sourceKey;
    const bucket = byFamily.get(family) ?? [];
    bucket.push(endpoint);
    byFamily.set(family, bucket);
  }

  const families: CurrentAffairsSourceFamilyHealth[] = [...byFamily.entries()]
    .map(([sourceFamily, members]) => {
      const freshSuccessfulEndpointCount = members.filter(endpointHealthy).length;
      const healthy = freshSuccessfulEndpointCount > 0;
      const degraded = healthy && freshSuccessfulEndpointCount < members.length;
      const coverageDomain = members.find((member) => member.coverageDomain)?.coverageDomain ?? null;
      return {
        sourceFamily,
        coverageDomain,
        healthy,
        degraded,
        endpointCount: members.length,
        freshSuccessfulEndpointCount,
        endpointKeys: members.map((member) => member.sourceKey).sort(),
      };
    })
    .sort((a, b) => a.sourceFamily.localeCompare(b.sourceFamily));

  const healthyRequiredSourceFamilies = families.filter((family) => family.healthy).length;
  const requiredSourceFamilies = families.length;
  const sourceCoveragePercent = requiredSourceFamilies > 0
    ? Math.round((healthyRequiredSourceFamilies / requiredSourceFamilies) * 100)
    : 0;

  const criticalDomainFailures = CURRENT_AFFAIRS_REQUIRED_SOURCE_DOMAINS.filter((domain) =>
    !families.some((family) => family.coverageDomain === domain && family.healthy),
  );

  return {
    requiredSourceFamilies,
    healthyRequiredSourceFamilies,
    sourceCoveragePercent,
    failingPrimaryEndpoints: coreEndpoints.filter((endpoint) => endpoint.status === "failure").length,
    stalePrimaryEndpoints: coreEndpoints.filter((endpoint) => !endpoint.fresh).length,
    unhealthySourceFamilies: families.filter((family) => !family.healthy).map((family) => family.sourceFamily),
    degradedSourceFamilies: families.filter((family) => family.degraded).map((family) => family.sourceFamily),
    criticalDomainFailures,
    families,
  };
}
