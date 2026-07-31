import { MAL_CP002_DISCOVERY_REGISTRY } from "./foundation/cp002-discovery-registry";
import { verifyMalCp002Result } from "./foundation/cp002-independent-verifier";
import {
  generateMalCp002Parameters,
  malCp002RequestFingerprint,
} from "./foundation/cp002-parameter-generator";
import {
  malCp002ResultFingerprint,
  solveMalCp002Request,
} from "./foundation/cp002-solver";
import type { MalCp002ExecutablePrototypeId } from "./foundation/cp002-types";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? `${item}n` : item,
  );
}

const executablePrototypeIds = MAL_CP002_DISCOVERY_REGISTRY.filter(
  (entry) => entry.discoveryStatus === "EXECUTABLE_DISCOVERY",
).map((entry) => entry.prototypeId as MalCp002ExecutablePrototypeId);

assert(
  executablePrototypeIds.length > 0,
  "MAL-CP-002 has no executable discovery prototypes.",
);

const seedsPerPrototype = 200;
let generatedCount = 0;
let deterministicParameterCount = 0;
let deterministicSolutionCount = 0;
let independentVerificationCount = 0;
let solverFingerprintCount = 0;
const requestDiversityByPrototype: Record<string, number> = {};
const answerDiversityByPrototype: Record<string, number> = {};
const componentDirectionCoverage = new Set<string>();
const requestModeCoverage = new Set<string>();
const resultKindCoverage = new Set<string>();

for (const prototypeId of executablePrototypeIds) {
  const requestFingerprints = new Set<string>();
  const answerFingerprints = new Set<string>();

  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const seed = `cp002-generation-${prototypeId}-${index}`;
    const firstParameters = generateMalCp002Parameters(prototypeId, seed);
    const secondParameters = generateMalCp002Parameters(prototypeId, seed);

    assert(
      stable(firstParameters) === stable(secondParameters),
      `${prototypeId}/${seed}: parameter generation is not deterministic.`,
    );
    assert(
      firstParameters.construction === "VALID_STATE_FIRST",
      `${prototypeId}/${seed}: generator did not declare valid-state-first construction.`,
    );
    deterministicParameterCount += 1;

    const firstSolution = solveMalCp002Request(firstParameters.request);
    const secondSolution = solveMalCp002Request(secondParameters.request);
    assert(
      stable(firstSolution) === stable(secondSolution),
      `${prototypeId}/${seed}: solver output is not deterministic.`,
    );
    deterministicSolutionCount += 1;

    const verification = verifyMalCp002Result(
      firstParameters.request,
      firstSolution,
    );
    assert(
      verification.ok,
      `${prototypeId}/${seed}: independent verification failed: ${verification.errors.join("; ")}`,
    );
    independentVerificationCount += 1;

    const requestFingerprint = malCp002RequestFingerprint(
      firstParameters.request,
    );
    const answerFingerprint = malCp002ResultFingerprint(firstSolution);
    requestFingerprints.add(requestFingerprint);
    answerFingerprints.add(answerFingerprint);
    solverFingerprintCount += 1;
    generatedCount += 1;
    requestModeCoverage.add(firstParameters.request.mode);
    resultKindCoverage.add(firstSolution.kind);

    if (
      firstParameters.request.mode === "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET" ||
      firstParameters.request.mode === "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT" ||
      firstParameters.request.mode ===
        "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT"
    ) {
      componentDirectionCoverage.add(
        `${firstParameters.request.adjustmentKind}_${firstParameters.request.changedComponent}`,
      );
    }
    if (
      firstParameters.request.mode === "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET"
    ) {
      componentDirectionCoverage.add(
        `REPLACE_WITH_${firstParameters.request.replacementComponent}`,
      );
    }
  }

  requestDiversityByPrototype[prototypeId] = requestFingerprints.size;
  answerDiversityByPrototype[prototypeId] = answerFingerprints.size;
  assert(
    requestFingerprints.size >= 140,
    `${prototypeId}: only ${requestFingerprints.size}/${seedsPerPrototype} distinct requests; generator diversity is too low.`,
  );
  assert(
    answerFingerprints.size >= 40,
    `${prototypeId}: only ${answerFingerprints.size}/${seedsPerPrototype} distinct answers; output diversity is too low.`,
  );
}

for (const requiredDirection of [
  "ADD_A",
  "ADD_B",
  "REMOVE_A",
  "REMOVE_B",
  "REPLACE_WITH_A",
  "REPLACE_WITH_B",
]) {
  assert(
    componentDirectionCoverage.has(requiredDirection),
    `Generated corpus does not cover ${requiredDirection}.`,
  );
}

assert(
  MAL_CP002_DISCOVERY_REGISTRY.every(
    (entry) =>
      entry.permanentQlId === null &&
      entry.active === false &&
      entry.publiclyPublishable === false &&
      entry.questionStudioDiscoverable === false &&
      entry.questionBankWritable === false &&
      entry.testEligible === false,
  ),
  "Valid-state generation changed a discovery lifecycle gate.",
);

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP002_VALID_STATE_GENERATION",
      canonicalProblemId: "MAL-CP-002",
      permanentQlCount: 0,
      frozenSolveModeCount: 0,
      executablePrototypeCount: executablePrototypeIds.length,
      seedsPerPrototype,
      generatedCount,
      deterministicParameterCount,
      deterministicSolutionCount,
      independentVerificationCount,
      solverFingerprintCount,
      requestModeCoverage: [...requestModeCoverage].sort(),
      resultKindCoverage: [...resultKindCoverage].sort(),
      componentDirectionCoverage: [...componentDirectionCoverage].sort(),
      requestDiversityByPrototype,
      answerDiversityByPrototype,
      rejectionLoopCount: 0,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      discoveryCountsFrozen: false,
    },
    null,
    2,
  ),
);
