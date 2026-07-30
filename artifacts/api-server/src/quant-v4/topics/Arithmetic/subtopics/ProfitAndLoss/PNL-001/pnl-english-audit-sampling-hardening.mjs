import fs from "node:fs";
import path from "node:path";

const root = path.resolve(
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001",
);
const auditPath = path.join(root, "pnl-001-english-editorial-audit.ts");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, value) {
  fs.writeFileSync(file, value);
}

function replaceOnce(file, oldValue, newValue) {
  const source = read(file);
  const first = source.indexOf(oldValue);
  if (first < 0) {
    throw new Error(`Anchor not found in ${file}: ${oldValue.slice(0, 160)}`);
  }
  if (source.indexOf(oldValue, first + oldValue.length) >= 0) {
    throw new Error(`Anchor is not unique in ${file}: ${oldValue.slice(0, 160)}`);
  }
  write(file, source.replace(oldValue, newValue));
}

replaceOnce(
  auditPath,
  "const candidateSeedsPerQl = 18;",
  "const candidateSeedsPerQl = 48;",
);

replaceOnce(
  auditPath,
  `mkdirSync(outputDirectory, { recursive: true });\n\nfunction visibleExplanation`,
  `mkdirSync(outputDirectory, { recursive: true });\n\nconst editorialSeedSalts = [\n  "amber",\n  "birch",\n  "cobalt",\n  "delta",\n  "ember",\n  "fjord",\n  "garnet",\n  "harbor",\n  "indigo",\n  "juniper",\n  "kestrel",\n  "lotus",\n  "marble",\n  "nectar",\n  "onyx",\n  "prairie",\n] as const;\n\nfunction mixedCandidateToken(candidateIndex: number): string {\n  let value = Math.imul(candidateIndex + 1, 0x9e3779b1) >>> 0;\n  value ^= value >>> 16;\n  value = Math.imul(value, 0x85ebca6b) >>> 0;\n  value ^= value >>> 13;\n  value = Math.imul(value, 0xc2b2ae35) >>> 0;\n  value ^= value >>> 16;\n  return value.toString(36);\n}\n\nfunction editorialCandidateSeed(\n  cpId: string,\n  qlId: string,\n  candidateIndex: number,\n): string {\n  const salt =\n    editorialSeedSalts[(candidateIndex * 7) % editorialSeedSalts.length]!;\n  return \`pnl-english-editorial:\${cpId}:\${qlId}:\${salt}:\${mixedCandidateToken(candidateIndex)}:\${candidateIndex}\`;\n}\n\nfunction visibleExplanation`,
);

replaceOnce(
  auditPath,
  `const generated = runtimes.flatMap((runtime) =>\n  runtime.listQlIds().flatMap((qlId) => {`,
  `const candidateDiversityByQl = new Map<\n  string,\n  Readonly<{\n    cpId: string;\n    qlId: string;\n    exactCandidateStemCount: number;\n    normalizedCandidateStemCount: number;\n    candidateAnswerCount: number;\n  }>\n>();\n\nconst generated = runtimes.flatMap((runtime) =>\n  runtime.listQlIds().flatMap((qlId) => {`,
);

replaceOnce(
  auditPath,
  "        const seed = `pnl-english-editorial:${runtime.cpId}:${qlId}:candidate-${candidateIndex}`;",
  "        const seed = editorialCandidateSeed(runtime.cpId, qlId, candidateIndex);",
);

replaceOnce(
  auditPath,
  `    const selected: Array<\n      (typeof candidates)[number] & { sampleIndex: number }\n    > = [];\n    const seenStemFingerprints = new Set<string>();\n    for (const candidate of candidates) {\n      const fingerprint = normalizedVisible(candidate.pkg.stem);\n      if (seenStemFingerprints.has(fingerprint)) continue;\n      seenStemFingerprints.add(fingerprint);\n      selected.push({ ...candidate, sampleIndex: selected.length + 1 });\n      if (selected.length === samplesPerQl) break;\n    }\n    if (selected.length < samplesPerQl) {\n      const selectedSeeds = new Set(selected.map((item) => item.seed));\n      for (const candidate of candidates) {\n        if (selectedSeeds.has(candidate.seed)) continue;\n        selected.push({ ...candidate, sampleIndex: selected.length + 1 });\n        if (selected.length === samplesPerQl) break;\n      }\n    }`,
  `    candidateDiversityByQl.set(qlId, {\n      cpId: runtime.cpId,\n      qlId,\n      exactCandidateStemCount: new Set(\n        candidates.map((candidate) => candidate.pkg.stem),\n      ).size,\n      normalizedCandidateStemCount: new Set(\n        candidates.map((candidate) => normalizedVisible(candidate.pkg.stem)),\n      ).size,\n      candidateAnswerCount: new Set(\n        candidates.map((candidate) => candidate.pkg.answer),\n      ).size,\n    });\n\n    const selected: Array<\n      (typeof candidates)[number] & { sampleIndex: number }\n    > = [];\n    const selectedSeeds = new Set<string>();\n    const seenExactStems = new Set<string>();\n    const seenStemFingerprints = new Set<string>();\n    const seenAnswers = new Set<string>();\n\n    const selectCandidate = (candidate: (typeof candidates)[number]) => {\n      selected.push({ ...candidate, sampleIndex: selected.length + 1 });\n      selectedSeeds.add(candidate.seed);\n      seenExactStems.add(candidate.pkg.stem);\n      seenStemFingerprints.add(normalizedVisible(candidate.pkg.stem));\n      seenAnswers.add(candidate.pkg.answer);\n    };\n\n    // First maximise semantic stem shape and displayed-answer diversity together.\n    for (const candidate of candidates) {\n      const fingerprint = normalizedVisible(candidate.pkg.stem);\n      if (seenStemFingerprints.has(fingerprint)) continue;\n      if (seenAnswers.has(candidate.pkg.answer)) continue;\n      selectCandidate(candidate);\n      if (selected.length === samplesPerQl) break;\n    }\n\n    // Contractually fixed answers may still expose different semantic stem shapes.\n    if (selected.length < samplesPerQl) {\n      for (const candidate of candidates) {\n        if (selectedSeeds.has(candidate.seed)) continue;\n        const fingerprint = normalizedVisible(candidate.pkg.stem);\n        if (seenStemFingerprints.has(fingerprint)) continue;\n        selectCandidate(candidate);\n        if (selected.length === samplesPerQl) break;\n      }\n    }\n\n    // If the normalized shape is fixed, prefer a new answer with new values.\n    if (selected.length < samplesPerQl) {\n      for (const candidate of candidates) {\n        if (selectedSeeds.has(candidate.seed)) continue;\n        if (seenExactStems.has(candidate.pkg.stem)) continue;\n        if (seenAnswers.has(candidate.pkg.answer)) continue;\n        selectCandidate(candidate);\n        if (selected.length === samplesPerQl) break;\n      }\n    }\n\n    // Contractually fixed answers may still expose distinct visible values.\n    if (selected.length < samplesPerQl) {\n      for (const candidate of candidates) {\n        if (selectedSeeds.has(candidate.seed)) continue;\n        if (seenExactStems.has(candidate.pkg.stem)) continue;\n        selectCandidate(candidate);\n        if (selected.length === samplesPerQl) break;\n      }\n    }\n\n    // Fall back only when the runtime candidate pool itself has fewer than\n    // three distinct exact stems or answers.\n    if (selected.length < samplesPerQl) {\n      for (const candidate of candidates) {\n        if (selectedSeeds.has(candidate.seed)) continue;\n        selectCandidate(candidate);\n        if (selected.length === samplesPerQl) break;\n      }\n    }`,
);

replaceOnce(
  auditPath,
  `const sameQlStemRepeat: string[] = [];\nconst sameQlAnswerRepeat: string[] = [];`,
  `const sameQlStemRepeat: string[] = [];\nconst sameQlAnswerRepeat: string[] = [];\nconst fixedStemQls: string[] = [];\nconst fixedAnswerQls: string[] = [];`,
);

replaceOnce(
  auditPath,
  `  if (new Set(group.map((item) => item.pkg.stem)).size === 1) {\n    sameQlStemRepeat.push(qlId);\n    editorialFindings.push({\n      code: "SAME-QL-STEM-REPEAT",\n      severity: "MAJOR",\n      scope: qlId,\n      message: "All three deterministic samples render the same visible stem.",\n    });\n  }\n  if (new Set(group.map((item) => item.pkg.answer)).size === 1) {\n    sameQlAnswerRepeat.push(qlId);\n    editorialFindings.push({\n      code: "SAME-QL-ANSWER-REPEAT",\n      severity: "NOTE",\n      scope: qlId,\n      message:\n        "All three deterministic samples produce the same displayed answer; confirm this is contractually necessary.",\n    });\n  }`,
  `  const candidateDiversity = candidateDiversityByQl.get(qlId);\n  if (new Set(group.map((item) => item.pkg.stem)).size === 1) {\n    const fixedStem =\n      (candidateDiversity?.exactCandidateStemCount ?? 0) === 1;\n    if (fixedStem) fixedStemQls.push(qlId);\n    else sameQlStemRepeat.push(qlId);\n    editorialFindings.push({\n      code: fixedStem\n        ? "CONTRACTUALLY-FIXED-STEM"\n        : "SAME-QL-STEM-REPEAT",\n      severity: fixedStem ? "NOTE" : "MAJOR",\n      scope: qlId,\n      message: fixedStem\n        ? \`All \${candidateSeedsPerQl} deterministic candidates render the same visible stem; record this as a fixed-stem task contract.\`\n        : \`All three selected samples render the same visible stem despite \${candidateDiversity?.exactCandidateStemCount ?? "unknown"} exact stems in the candidate pool.\`,\n    });\n  }\n  if (new Set(group.map((item) => item.pkg.answer)).size === 1) {\n    const fixedAnswer =\n      (candidateDiversity?.candidateAnswerCount ?? 0) === 1;\n    if (fixedAnswer) fixedAnswerQls.push(qlId);\n    else sameQlAnswerRepeat.push(qlId);\n    editorialFindings.push({\n      code: fixedAnswer\n        ? "CONTRACTUALLY-FIXED-ANSWER"\n        : "SAME-QL-ANSWER-REPEAT",\n      severity: "NOTE",\n      scope: qlId,\n      message: fixedAnswer\n        ? \`All \${candidateSeedsPerQl} deterministic candidates produce the same displayed answer; record this as a fixed-answer task contract.\`\n        : \`The selected samples repeat one answer despite \${candidateDiversity?.candidateAnswerCount ?? "unknown"} answers in the candidate pool.\`,\n    });\n  }`,
);

replaceOnce(
  auditPath,
  `  sameQlStemRepeatCount: sameQlStemRepeat.length,\n  sameQlAnswerRepeatCount: sameQlAnswerRepeat.length,`,
  `  sameQlStemRepeatCount: sameQlStemRepeat.length,\n  sameQlAnswerRepeatCount: sameQlAnswerRepeat.length,\n  contractuallyFixedStemCount: fixedStemQls.length,\n  contractuallyFixedStemQls: fixedStemQls,\n  contractuallyFixedAnswerCount: fixedAnswerQls.length,\n  contractuallyFixedAnswerQls: fixedAnswerQls,\n  candidateDiversityByQl: [...candidateDiversityByQl.values()].sort((left, right) =>\n    left.qlId.localeCompare(right.qlId),\n  ),`,
);

console.log(
  JSON.stringify(
    {
      status: "PATCHED",
      candidateSeedsPerQl: 48,
      selectionPolicy:
        "MAXIMISE_NORMALIZED_STEM_ANSWER_AND_EXACT_VALUE_DIVERSITY",
      affectedAudit: "PNL-001 English editorial review corpus",
    },
    null,
    2,
  ),
);
