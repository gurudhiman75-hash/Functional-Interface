import { generateCaseletBatch } from "./index.ts";
import { generateLp002Batch } from "./lp-002.ts";
import { generateLp003Batch } from "./lp-003.ts";
import { generateLp004Batch } from "./lp-004.ts";
import { generateLp005Batch } from "./lp-005.ts";
import { generateLp006Batch } from "./lp-006.ts";
import { generateLp007Batch } from "./lp-007.ts";
import { generateLp008Batch } from "./lp-008.ts";

type AuditCaselet = {
  scenarioProfileId: string;
  difficultyBand: string;
  clues: readonly { kind: string }[];
  children: readonly { qlId: string; difficultyBand: string }[];
};

type Generator = (seed: string, count: number) => AuditCaselet[];

const packages: readonly [string, Generator][] = [
  ["LP-001", generateCaseletBatch],
  ["LP-002", generateLp002Batch],
  ["LP-003", generateLp003Batch],
  ["LP-004", generateLp004Batch],
  ["LP-005", generateLp005Batch],
  ["LP-006", generateLp006Batch],
  ["LP-007", generateLp007Batch],
  ["LP-008", generateLp008Batch],
];

for (const [packageId, generate] of packages) {
  const caselets = generate(`retrofit-topology:${packageId}`, 100);
  const difficulty: Record<string, number> = {};
  const clueCounts: Record<string, number> = {};
  const clueKinds: Record<string, number> = {};
  const profiles = new Set<string>();
  const qls = new Set<string>();

  for (const caselet of caselets) {
    difficulty[caselet.difficultyBand] = (difficulty[caselet.difficultyBand] ?? 0) + 1;
    clueCounts[String(caselet.clues.length)] = (clueCounts[String(caselet.clues.length)] ?? 0) + 1;
    profiles.add(caselet.scenarioProfileId);
    for (const clue of caselet.clues) clueKinds[clue.kind] = (clueKinds[clue.kind] ?? 0) + 1;
    for (const child of caselet.children) {
      qls.add(child.qlId);
      if (child.difficultyBand !== caselet.difficultyBand) throw new Error(`${packageId} child/caselet difficulty mismatch`);
    }
  }

  console.log(JSON.stringify({
    packageId,
    caselets: caselets.length,
    questions: caselets.reduce((sum, caselet) => sum + caselet.children.length, 0),
    difficulty,
    clueCounts,
    clueKinds,
    profileCount: profiles.size,
    qls: [...qls].sort(),
  }));
}
