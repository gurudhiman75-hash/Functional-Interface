import { INT_CP010_PROTOTYPE_IDS, buildIntCp010DiscoveryPackage } from "./cp010-mixed-systems-discovery-v1";

const lines: string[] = [
  "# INT-CP-010 Mixed Advanced Systems — Wave01 English Review",
  "",
  "Temporary prototypes only. No permanent QL identity is allocated or reserved.",
  "",
];

for (const prototypeId of INT_CP010_PROTOTYPE_IDS) {
  for (let family = 0; family < 3; family += 1) {
    const q = buildIntCp010DiscoveryPackage(prototypeId, `cp010:review:${prototypeId}:${family}`) as any;
    lines.push(`## ${prototypeId} · ${q.presentation.stemFamilyId} · ${q.difficultyBand}`);
    lines.push("");
    lines.push(q.presentation.prompt);
    lines.push("");
    q.options.forEach((option: any, index: number) => lines.push(`${String.fromCharCode(65 + index)}. ${option.text}${option.isCorrect ? " ✓" : ""}`));
    lines.push("");
    lines.push(`**Concept:** ${q.explanation.keyIdea}`);
    lines.push("");
    q.explanation.steps.forEach((step: string, index: number) => lines.push(`${index + 1}. ${step}`));
    lines.push("");
    lines.push(`**Answer:** ${q.correctAnswer}`);
    lines.push("");
    lines.push(`Source lineage: ${q.sourceLineage}`);
    lines.push(`Component authorities: ${q.componentAuthorities.join(" + ")}`);
    lines.push("");
  }
}

console.log(lines.join("\n"));
