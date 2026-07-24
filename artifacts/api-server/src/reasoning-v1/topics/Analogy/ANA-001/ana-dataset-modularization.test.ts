import assert from "node:assert/strict";
import { ANA_CP001_FACTS } from "./ANA-CP-001/semantic-facts";
import { ANA_CP002_FACTS } from "./ANA-CP-002/lexical-facts.en";

assert.equal(ANA_CP001_FACTS.length, 216);
assert.equal(ANA_CP002_FACTS.length, 144);

const cp001Relations = new Map<string, number>();
for (const fact of ANA_CP001_FACTS) cp001Relations.set(fact.relation, (cp001Relations.get(fact.relation) ?? 0) + 1);
assert.equal(cp001Relations.size, 18);
for (const count of cp001Relations.values()) assert.equal(count, 12);

const cp002Relations = new Map<string, number>();
for (const fact of ANA_CP002_FACTS) cp002Relations.set(fact.relation, (cp002Relations.get(fact.relation) ?? 0) + 1);
assert.equal(cp002Relations.size, 12);
for (const count of cp002Relations.values()) assert.equal(count, 12);

assert.equal(new Set(ANA_CP001_FACTS.map((fact) => fact.id)).size, ANA_CP001_FACTS.length);
assert.equal(new Set(ANA_CP002_FACTS.map((fact) => fact.id)).size, ANA_CP002_FACTS.length);

console.log("ANA dataset modularization audit passed.");
