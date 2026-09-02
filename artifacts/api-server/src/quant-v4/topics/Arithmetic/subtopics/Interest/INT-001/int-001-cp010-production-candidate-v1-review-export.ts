import {
  INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES,
  generateIntCp010ProductionCandidate,
} from "./cp010-production-authoring-candidate-v1";

const selected: any[] = [];
for (const authorityId of INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES) {
  const seen = new Set<string>();
  for (let index = 0; index < 500 && seen.size < 8; index += 1) {
    const q = generateIntCp010ProductionCandidate(authorityId, `cp010:prod-review:${authorityId}:${index}`) as any;
    if (seen.has(q.stemFamilyId)) continue;
    seen.add(q.stemFamilyId);
    selected.push(q);
  }
  if (seen.size !== 8) throw new Error(`${authorityId}: unable to recover all eight production-candidate stem families`);
}

console.log("# INT-CP-010 — Production Authoring Candidate English Review\n");
console.log("Status: **PRE-ALLOCATION / ID-FREE / REVIEW CANDIDATE**\n");
console.log("This pack contains one question from each of the 16 authority/stem families. P001/P002 source-hold prototypes are deliberately absent.\n");

selected.forEach((q, index) => {
  console.log(`## ${index + 1}. ${q.authorityId} — ${q.stemFamilyId}`);
  console.log(`Context: ${q.context}  `);
  console.log(`Source prototype: ${q.sourcePrototypeId}  `);
  console.log(`Seed: \`${q.seed}\`\n`);
  console.log(q.stem);
  console.log("");
  q.options.forEach((option: any, optionIndex: number) => {
    console.log(`${String.fromCharCode(65 + optionIndex)}. ${option.text}${option.isCorrect ? " **✓**" : ""} — ${option.misconceptionId}`);
  });
  console.log("");
  console.log(`**Answer:** ${q.correctAnswer}`);
  console.log("");
  console.log(`**Key idea:** ${q.explanation.keyIdea}`);
  q.explanation.steps.forEach((step: string, stepIndex: number) => console.log(`${stepIndex + 1}. ${step}`));
  console.log(`\n**Final answer:** ${q.explanation.finalAnswer}\n`);
});
