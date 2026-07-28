import { strict as assert } from "node:assert";
import { getPnc002QuestionEntries } from "./foundation/library";
import { buildPnc002Cp007LocalizedPresentation } from "./foundation/localization-cp007-polished";
import type { PncStudentLocale } from "./foundation/localization-types";
import { runPnc002Pipeline } from "./foundation/pipeline";

const entries = getPnc002QuestionEntries().filter((entry) => entry.cpId === "PNC-CP-007");
const locales: PncStudentLocale[] = ["hi-IN", "pa-IN"];

function sectionText(presentation: ReturnType<typeof buildPnc002Cp007LocalizedPresentation>, kind: string): string {
  const section = presentation.explanationSections.find((candidate) => candidate.kind === kind);
  assert.ok(section, `${presentation.questionLanguageId}: missing ${kind}`);
  return [section.heading, ...section.lines].join(" ");
}

for (const entry of entries) {
  for (const locale of locales) {
    const source = runPnc002Pipeline({
      questionLanguageId: entry.qlId,
      seed: `pnc-cp007-localization-polish:${locale}:${entry.qlId}`,
    });
    const presentation = buildPnc002Cp007LocalizedPresentation(source, locale);
    const text = [
      presentation.stem,
      ...presentation.displayOptions,
      ...presentation.explanationSections.flatMap((section) => [section.heading, ...section.lines]),
    ].join(" ");

    assert.doesNotMatch(text, /\d[\d,]*, (?:व्यवस्थाएँ|तरीके|है|ਤਰੀਕੇ|ਹੈ)/);
    assert.doesNotMatch(text, /रैखिक क्रम|व्यवस्था गुणक खोलें|गिने हुए चरण जोड़ें|हर अनुमत मान|लक्ष्य संख्या|स्वीकार्य उत्तर/);
    assert.doesNotMatch(text, /ਸਿੱਧੇ ਕ੍ਰਮ|ਕ੍ਰਮ ਵਾਲਾ ਗੁਣਕ ਖੋਲ੍ਹੋ|ਗਿਣੇ ਹੋਏ ਕਦਮ ਜੋੜੋ|ਹਰ ਮਨਜ਼ੂਰ ਮੁੱਲ|ਟੀਚਾ ਗਿਣਤੀ|ਮਨਜ਼ੂਰ ਉੱਤਰ/);
    assert.equal(presentation.publiclyPublishable, false);
    assert.equal(presentation.editorialStatus, "PENDING");
  }
}

for (const locale of locales) {
  const ql118Source = runPnc002Pipeline({
    questionLanguageId: "PNC-QL-118",
    seed: `pnc-cp007-localization-polish:${locale}:PNC-QL-118`,
  });
  const ql118 = buildPnc002Cp007LocalizedPresentation(ql118Source, locale);
  assert.ok(ql118.displayOptions.every((option) => locale === "hi-IN" ? /किताब/.test(option) : /ਕਿਤਾਬ/.test(option)));
  assert.ok(locale === "hi-IN" ? ql118.stem.startsWith("आठ ") : ql118.stem.startsWith("ਅੱਠ "));
  assert.doesNotMatch(ql118.displayOptions.join(" "), /वस्तु|ਵਸਤੂ/);

  const ql119Source = runPnc002Pipeline({
    questionLanguageId: "PNC-QL-119",
    seed: `pnc-cp007-localization-polish:${locale}:PNC-QL-119`,
  });
  const ql119 = buildPnc002Cp007LocalizedPresentation(ql119Source, locale);
  assert.match(sectionText(ql119, "coreConcept"), locale === "hi-IN" ? /दोनों.*ब्लॉक.*पास-पास/ : /ਦੋਵੇਂ.*ਬਲਾਕ.*ਨਾਲ-ਨਾਲ/);
  assert.doesNotMatch(sectionText(ql119, "coreConcept"), /प्रतिबंधित व्यक्ति|ਰੋਕੇ ਵਿਅਕਤੀ/);

  const ql121Source = runPnc002Pipeline({
    questionLanguageId: "PNC-QL-121",
    seed: `pnc-cp007-localization-polish:${locale}:PNC-QL-121`,
  });
  const ql121 = buildPnc002Cp007LocalizedPresentation(ql121Source, locale);
  assert.doesNotMatch(sectionText(ql121, "coreConcept"), /बड़ा ब्लॉक|ਵੱਡਾ ਬਲਾਕ/);
  assert.match(sectionText(ql121, "coreConcept"), /बाहरी व्यक्ति|ਬਾਹਰਲਾ ਵਿਅਕਤੀ/);
}

console.log(JSON.stringify({
  packageId: "PNC-002",
  canonicalProblemId: "PNC-CP-007",
  locales,
  qlCount: entries.length,
  naturalnessRegressions: "PASS",
  publiclyPublishable: false,
  status: "PASS",
}, null, 2));
