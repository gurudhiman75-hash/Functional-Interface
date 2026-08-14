import {
  MAL_CP006_WAVE02_DIRECT_SOURCE_IDS,
  MAL_CP006_WAVE02_PROTOTYPE_IDS,
  MAL_CP006_WAVE02_RUNTIME_ID,
  MAL_CP006_WAVE02_SOURCE_FIXTURES,
} from "./foundation/cp006-source-fixtures-wave02";
import {
  proveMalCp006Wave02CatWitness,
  proveMalCp006Wave02GeneralInverseWitness,
  proveMalCp006Wave02IbpsWitness,
  proveMalCp006Wave02InverseVariants,
} from "./foundation/cp006-wave02-proof";
import {
  proveMalCp006Wave02ChangedSourceVariants,
  proveMalCp006Wave02FullContentBoundary,
} from "./foundation/cp006-wave02-chain-proof";

const failures: string[] = [];
const check = (ok: boolean, message: string) => { if (!ok) failures.push(message); };
const cat = proveMalCp006Wave02CatWitness();
const ibps = proveMalCp006Wave02IbpsWitness();
const generalInverse = proveMalCp006Wave02GeneralInverseWitness();
const inverseVariants = proveMalCp006Wave02InverseVariants();
const chainVariants = proveMalCp006Wave02ChangedSourceVariants();
const boundary = proveMalCp006Wave02FullContentBoundary();

check(cat, "CAT 2025 inverse witness failed");
check(ibps, "IBPS RRB Clerk 2019 chain witness failed");
check(generalInverse, "bank-mains general inverse witness failed");
check(inverseVariants === 16, `inverse variants ${inverseVariants}/16`);
check(chainVariants === 12, `chain variants ${chainVariants}/12`);
check(boundary, "full-content chain must telescope to CP001");
check(MAL_CP006_WAVE02_DIRECT_SOURCE_IDS.length === 2, "expected two direct target-exam sources");
for (const id of MAL_CP006_WAVE02_PROTOTYPE_IDS) {
  check(MAL_CP006_WAVE02_SOURCE_FIXTURES.some((s) => s.disposition === "CP006_DIRECT" && s.supportedPrototypeIds.includes(id)), `${id} lacks direct evidence`);
}
for (const s of MAL_CP006_WAVE02_SOURCE_FIXTURES.filter((x) => x.disposition === "CP001_BOUNDARY")) {
  check(s.supportedPrototypeIds.length === 0, `${s.sourceId} must consume no CP006 prototype`);
}

const report = {
  status: failures.length ? "FAIL_MAL_CP006_WAVE02_SOURCE_SATURATION" : "PASS_MAL_CP006_WAVE02_SOURCE_SATURATION_GAP_DISCOVERY",
  runtimeId: MAL_CP006_WAVE02_RUNTIME_ID,
  prototypes: MAL_CP006_WAVE02_PROTOTYPE_IDS,
  directSources: MAL_CP006_WAVE02_DIRECT_SOURCE_IDS,
  witnesses: { cat, ibps, generalInverse },
  variants: { inverse: inverseVariants, chain: chainVariants },
  ownership: {
    inverse: "SPLIT_CANDIDATE_FROM_WAVE01_FORWARD_PROJECTION",
    chain: "RETAIN_DISTINCT_CHAIN_PROJECTION",
    fullContentChain: "ROUTE_CP001_AGGREGATE_BLEND",
    stagedBlend: "ROUTE_CP001_COMPOUND_BLEND",
    capacityChain: "SUPPLEMENTAL_GAP_SIGNAL_NOT_PROMOTED",
  },
  alligation: "NOT_A_CP006_CORE_SOLVE_MODE",
  lifecycle: { permanentQls: 0, permanentSolveModes: 0, questionStudio: false, questionBank: false, test: false, public: false },
  failures,
};
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
