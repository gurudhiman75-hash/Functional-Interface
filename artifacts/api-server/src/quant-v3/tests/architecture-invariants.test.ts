import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { strict as assert } from "node:assert";
import {
  ARCHETYPE_REGISTRY,
  CANONICAL_PROBLEM_REGISTRY,
  SUBTOPIC_REGISTRY,
  TOPIC_REGISTRY,
} from "../core/registries";

const root = existsSync(join(process.cwd(), "src", "quant-v3"))
  ? join(process.cwd(), "src", "quant-v3")
  : join(process.cwd(), "artifacts", "api-server", "src", "quant-v3");
const topicsRoot = join(root, "topics");

const requiredTopics = [
  "NumberSystem",
  "Percentage",
  "RatioProportion",
  "Average",
  "ProfitLossDiscount",
  "SimpleInterest",
  "CompoundInterest",
  "MixtureAlligation",
  "Partnership",
  "TimeWork",
  "PipesCisterns",
  "TimeDistance",
  "BoatsStreams",
  "Algebra",
  "Geometry",
  "Mensuration",
  "CoordinateGeometry",
  "Statistics",
  "DataInterpretation",
  "PermutationCombination",
  "Probability",
] as const;

const numberSystemSubtopics = [
  "Divisibility",
  "Remainders",
  "HCF",
  "LCM",
  "PrimeNumbers",
  "Factors",
  "PerfectSquares",
  "PerfectCubes",
  "NumberFormation",
  "UnitDigit",
  "LastDigits",
  "Cyclicity",
  "BaseSystems",
  "Miscellaneous",
] as const;

const ownershipFolders = [
  "archetypes",
  "explanations",
  "stems",
  "shortcuts",
  "distractors",
  "scenarios",
  "validators",
  "localization",
] as const;

assert.equal(Object.keys(TOPIC_REGISTRY).length, 0);
assert.equal(Object.keys(SUBTOPIC_REGISTRY).length, 0);
assert.equal(Object.keys(ARCHETYPE_REGISTRY).length, 0);
assert.equal(Object.keys(CANONICAL_PROBLEM_REGISTRY).length, 0);

for (const topic of requiredTopics) {
  assert.ok(existsSync(join(topicsRoot, topic)), `Missing Quant V3 topic folder: ${topic}`);
  assert.ok(existsSync(join(topicsRoot, topic, "topic.config.ts")), `Missing topic config: ${topic}`);
}

for (const subtopic of numberSystemSubtopics) {
  const subtopicRoot = join(topicsRoot, "NumberSystem", "subtopics", subtopic);
  assert.ok(existsSync(subtopicRoot), `Missing Number System subtopic folder: ${subtopic}`);

  for (const folder of ownershipFolders) {
    assert.ok(existsSync(join(subtopicRoot, folder)), `Missing ${subtopic}/${folder}`);
    const entries = readdirSync(join(subtopicRoot, folder));
    assert.deepEqual(entries, [".gitkeep"], `${subtopic}/${folder} must contain only .gitkeep`);
  }
}

const forbiddenNamePattern = /Global(?:Explanation|Stem|Shortcut|Distractor)Engine/i;
const scan = (directory: string): string[] => {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (forbiddenNamePattern.test(entry.name)) return [path];
    return entry.isDirectory() ? scan(path) : [];
  });
};

assert.deepEqual(scan(root), []);

console.log("Quant V3 architecture invariants passed.");
