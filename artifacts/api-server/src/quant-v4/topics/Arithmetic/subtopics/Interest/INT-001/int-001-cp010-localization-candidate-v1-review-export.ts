import { INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES } from "./cp010-production-authoring-candidate-v1";
import { generateIntCp010LocalizedCandidate } from "./cp010-localization-authoring-candidate-v1";

const selected: any[] = [];
for (const authorityId of INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES) {
  for (const language of ["hi", "pa"] as const) {
    const seen = new Set<string>();
    for (let index = 0; index < 800 && seen.size < 8; index += 1) {
      const q = generateIntCp010LocalizedCandidate(authorityId, `cp010:locale-review:${authorityId}:${language}:${index}`, language) as any;
      if (seen.has(q.stemFamilyId)) continue;
      seen.add(q.stemFamilyId);
      selected.push(q);
    }
    if (seen.size !== 8) throw new Error(`${authorityId}/${language}: unable to recover all eight localized stem families`);
  }
}

console.log("# INT-CP-010 — Hindi/Punjabi Authoring Candidate Review\n");
console.log("Status: **PRE-ALLOCATION / ID-FREE / MATHEMATICAL PARITY REQUIRED**\n");
console.log("One question from each authority × language × stem-family combination. P001/P002 source holds are absent.\n");

selected.forEach((q, index) => {
  console.log(`## ${index + 1}. ${q.authorityId} — ${q.language.toUpperCase()} — ${q.stemFamilyId}`);
  console.log(`Context source: ${q.context}  `);
  console.log(`Prototype: ${q.sourcePrototypeId}  `);
  console.log(`Seed: \`${q.seed}\`\n`);
  console.log(q.stem);
  console.log("");
  q.options.forEach((option: any, optionIndex: number) => {
    console.log(`${String.fromCharCode(65 + optionIndex)}. ${option.text}${option.isCorrect ? " **✓**" : ""} — ${option.misconceptionId}`);
  });
  console.log(`\n**Answer:** ${q.correctAnswer}\n`);
  console.log(`**Key idea:** ${q.explanation.keyIdea}`);
  q.explanation.steps.forEach((step: string, stepIndex: number) => console.log(`${stepIndex + 1}. ${step}`));
  console.log(`\n**Final answer:** ${q.explanation.finalAnswer}\n`);
});
