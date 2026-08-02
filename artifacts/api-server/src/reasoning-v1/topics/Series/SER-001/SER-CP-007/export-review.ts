import {
  SER_CP007_TEMPORARY_TEMPLATE_IDS,
  generateSerCp007Question,
  renderSerCp007Review,
} from "./foundation";

const sections: string[] = [
  "# SER-CP-007 English discovery review",
  "",
  "Temporary discovery identities only. Permanent QLs remain unallocated.",
  "All choices use numeric labels 1–4.",
  "",
];

for (const temporaryTemplateId of SER_CP007_TEMPORARY_TEMPLATE_IDS) {
  for (const seed of [1, 2]) {
    sections.push(renderSerCp007Review(generateSerCp007Question(temporaryTemplateId, seed)));
    sections.push("", "---", "");
  }
}

console.log(sections.join("\n"));
