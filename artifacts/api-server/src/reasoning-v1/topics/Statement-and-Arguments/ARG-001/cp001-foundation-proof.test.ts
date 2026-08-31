import { ARG_CP001_ENGLISH_AUTHORITIES } from "./cp001-english-authorities.ts";
import {
  answerClassForArguments,
  assertArgumentAuthorityConsistent,
} from "./strength-model.ts";
import { ARG_QL_IDS, type ArgAnswerClass } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(ARG_CP001_ENGLISH_AUTHORITIES.length === 24, "ARG-CP-001 must contain exactly 24 calibration scenarios");

const ids = new Set<string>();
let supportsStrong = 0;
let supportsWeak = 0;
let opposesStrong = 0;
let opposesWeak = 0;

for (const scenario of ARG_CP001_ENGLISH_AUTHORITIES) {
  assert(!ids.has(scenario.id), `${scenario.id}: duplicate scenario id`);
  ids.add(scenario.id);
  assert(scenario.statement.length >= 45, `${scenario.id}: statement is too toy-like/short for calibration`);

  for (const argument of scenario.arguments) {
    assertArgumentAuthorityConsistent(argument);
    assert(argument.text.length >= 35, `${argument.id}: argument surface is too thin`);
    assert(!/\b(because it is good|because it is bad)\b/i.test(argument.text), `${argument.id}: toy argument wording detected`);

    if (argument.stance === "SUPPORTS" && argument.expectedStrength === "STRONG") supportsStrong += 1;
    if (argument.stance === "SUPPORTS" && argument.expectedStrength === "WEAK") supportsWeak += 1;
    if (argument.stance === "OPPOSES" && argument.expectedStrength === "STRONG") opposesStrong += 1;
    if (argument.stance === "OPPOSES" && argument.expectedStrength === "WEAK") opposesWeak += 1;
  }

  const actualAnswer = answerClassForArguments(scenario.arguments);
  assert(
    actualAnswer === scenario.expectedAnswerClass,
    `${scenario.id}: expected ${scenario.expectedAnswerClass}, got ${actualAnswer}`,
  );
}

for (const qlId of ARG_QL_IDS) {
  const scenarios = ARG_CP001_ENGLISH_AUTHORITIES.filter((entry) => entry.qlId === qlId);
  assert(scenarios.length === 4, `${qlId}: CP001 must contain four calibration scenarios`);

  const answerClasses = new Set<ArgAnswerClass>(scenarios.map((entry) => entry.expectedAnswerClass));
  for (const required of ["ONLY_I", "ONLY_II", "BOTH", "NEITHER"] as const) {
    assert(answerClasses.has(required), `${qlId}: missing answer class ${required}`);
  }

  const domains = new Set(scenarios.map((entry) => entry.domain));
  assert(domains.size >= 3, `${qlId}: calibration contexts are too narrow`);
}

assert(supportsStrong > 0, "No supporting strong arguments found");
assert(supportsWeak > 0, "No supporting weak arguments found");
assert(opposesStrong > 0, "No opposing strong arguments found");
assert(opposesWeak > 0, "No opposing weak arguments found");

const allArguments = ARG_CP001_ENGLISH_AUTHORITIES.flatMap((entry) => entry.arguments);
const weakDefects = new Set(allArguments.flatMap((entry) => entry.weaknessDefects));
assert(weakDefects.size >= 10, `Weakness taxonomy too thin: only ${weakDefects.size} defects represented`);

console.log(
  JSON.stringify(
    {
      chapter: "ARG-001",
      checkpoint: "ARG-CP-001",
      scenarios: ARG_CP001_ENGLISH_AUTHORITIES.length,
      qls: ARG_QL_IDS.length,
      answerClassesPerQl: 4,
      weakDefectFamiliesObserved: weakDefects.size,
      polarityIndependence: {
        supportsStrong,
        supportsWeak,
        opposesStrong,
        opposesWeak,
      },
      learnerRelease: "LOCKED",
    },
    null,
    2,
  ),
);
