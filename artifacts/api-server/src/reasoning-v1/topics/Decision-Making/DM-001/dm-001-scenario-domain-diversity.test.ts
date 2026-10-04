import assert from "node:assert/strict";

import { DM_OPERATIONAL_DIVERSITY_SEEDS } from "./operational-diversity-library.ts";
import { dmScenariosForCheckpoint } from "./scenario-library.ts";

const checkpoints = ["DM-CP-011", "DM-CP-012", "DM-CP-013", "DM-CP-014", "DM-CP-015", "DM-CP-016"] as const;

for (const checkpointId of checkpoints) {
  const seeds = DM_OPERATIONAL_DIVERSITY_SEEDS[checkpointId];
  assert.equal(seeds.length, 5, checkpointId + ": expected five dedicated operational-domain seeds.");
  assert.ok(seeds.every((seed) =>
    seed.situation.en.trim().length > 0 &&
    seed.situation.hi.trim().length > 0 &&
    seed.situation.pa.trim().length > 0 &&
    seed.action.en.trim().length > 0 &&
    seed.action.hi.trim().length > 0 &&
    seed.action.pa.trim().length > 0
  ), checkpointId + ": operational seeds must be fully localized.");

  const scenarios = dmScenariosForCheckpoint(checkpointId);
  assert.ok(scenarios.length >= 75, checkpointId + ": operational expansion did not reach the expected scenario surface.");

  for (const seed of seeds) {
    assert.ok(
      scenarios.some((scenario) => scenario.context.en === seed.situation.en),
      checkpointId + ": operational seed is not reachable through the scenario library: " + seed.situation.en,
    );
  }
}

const situationalScenarios = checkpoints.flatMap((checkpointId) => dmScenariosForCheckpoint(checkpointId));
const uniqueEnglishContexts = new Set(situationalScenarios.map((scenario) => scenario.context.en));
assert.ok(
  uniqueEnglishContexts.size >= 90,
  "DM-001 situational layer must expose at least 90 distinct decision contexts after the diversity remediation.",
);

const operationalCorpus = [...uniqueEnglishContexts].join("\n").toLowerCase();
const domainMarkers = [
  "apple lot",
  "wheat procurement",
  "packaged-food",
  "textile-roll",
  "vehicle-inspection",
  "fruit consignment",
  "milk-tanker",
  "warehouse",
  "electronics shipment",
  "seed lot",
  "orange lot",
  "rice lot",
  "spare-parts",
  "food-safety",
  "cement batch",
  "fruit growers",
  "tender-sample",
  "weighbridge",
  "cold-storage",
  "packaging conveyor",
  "pesticide-residue",
  "water-treatment",
  "phytosanitary",
  "laboratory analyser",
  "loading bay",
  "backup generator",
];

for (const marker of domainMarkers) {
  assert.ok(operationalCorpus.includes(marker), "Missing operational-domain marker: " + marker);
}

const peopleAdministrationMarkers = [
  "application",
  "applicant",
  "candidate",
  "scholarship",
  "admission",
  "fellowship",
  "licence",
];

const newOperationalCorpus = checkpoints
  .flatMap((checkpointId) => DM_OPERATIONAL_DIVERSITY_SEEDS[checkpointId])
  .map((seed) => seed.situation.en.toLowerCase())
  .join("\n");

const operationalMarkerCount = domainMarkers.filter((marker) => newOperationalCorpus.includes(marker)).length;
const administrationMarkerCount = peopleAdministrationMarkers.filter((marker) => newOperationalCorpus.includes(marker)).length;

assert.ok(operationalMarkerCount >= 24, "Operational seeds do not span enough materially different domains.");
assert.ok(
  administrationMarkerCount <= 2,
  "Operational diversity seeds have drifted back toward candidate/application administration.",
);

console.log(
  "DM-001 scenario-domain diversity checks passed:",
  uniqueEnglishContexts.size,
  "distinct situational contexts with",
  operationalMarkerCount,
  "operational markers.",
);
