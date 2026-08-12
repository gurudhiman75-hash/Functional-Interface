import {
  SAP_CP009_CATALOGUE,
  SAP_CP009_POLICY,
  SAP_CP009_PROTOTYPE_IDS,
  generateSapCp009,
} from "./runtime-v6";
import { runCp009Authority } from "./authority-core";

const result = runCp009Authority({
  prototypeIds: SAP_CP009_PROTOTYPE_IDS,
  catalogueLength: SAP_CP009_CATALOGUE.length,
  policy: SAP_CP009_POLICY,
  generate: generateSapCp009,
  seedsPerMode: 100,
});

console.log(`SAP-CP-009 authority passed: ${result.total} independently verified unique cases across SAP-QL-147..165, 100 stems per identity, all ratio relations, both over/under classes, ${result.positions.join("/")} A/B/C/D positions, short student explanations and inactive lifecycle.`);
