import type { SylLocale } from "../foundation/types";
import { generateSylQuestionV4 } from "./generator-v4";
import { SYL_QL_REGISTRY } from "./ql-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let identityNoRecords = 0;
let modelRecords = 0;
let dualRecords = 0;

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestionV4(definition.qlId, seed, locale);
      const diagram = question.learnerPresentationV4.diagram;
      const key = `${definition.qlId}/${seed}/${locale}`;
      const identity = question.structuredPrompt.premises.find((premise) => premise.form === "IDENTITY");
      const no = question.structuredPrompt.premises.find((premise) =>
        premise.form === "NO"
        && identity
        && [identity.subject, identity.predicate].some((term) =>
          premise.subject === term || premise.predicate === term));

      if (identity && no && diagram.mode === "VENN_SEPARATION") {
        assert(Boolean(diagram.svg), `${key} identity-separation diagram is missing.`);
        assert(diagram.svg!.includes('data-relation="IDENTITY_AND_NO"'), `${key} omits the identity relation from the separation diagram.`);
        assert(diagram.svg!.includes(`data-equivalent="${identity.subject},${identity.predicate}"`), `${key} does not preserve both equivalent classes.`);
        assert(diagram.caption?.includes(question.learnerPresentationV4.locale === "en-IN" ? "same set" : question.learnerPresentationV4.locale === "hi-IN" ? "एक ही वर्ग" : "ਇੱਕੋ ਵਰਗ"), `${key} identity caption is not explicit.`);
        identityNoRecords += 1;
      }

      if (["VENN_COUNTEREXAMPLE", "VENN_POSSIBILITY", "VENN_DUAL_MODEL"].includes(diagram.mode)) {
        const legend = locale === "en-IN"
          ? "Each × represents one possible member"
          : locale === "hi-IN"
            ? "हर × एक संभावित सदस्य"
            : "ਹਰ × ਇੱਕ ਸੰਭਵ ਮੈਂਬਰ";
        assert(diagram.caption?.includes(legend), `${key} model diagram lacks a localized × legend.`);
        assert(diagram.accessibleDescription?.includes(legend), `${key} accessible model description lacks the × legend.`);
        modelRecords += 1;
      }

      if (diagram.mode === "VENN_DUAL_MODEL") {
        assert(Boolean(diagram.svg), `${key} dual diagram is missing.`);
        assert(diagram.svg!.includes(".mini-model-label{font:750 12px"), `${key} dual model labels are below the mobile readability floor.`);
        assert(diagram.svg!.includes(".mini-witness{font:900 17px"), `${key} dual witnesses are below the mobile readability floor.`);
        dualRecords += 1;
      }
    }
  }
}

assert(identityNoRecords > 0, "No identity-plus-separation record was validated.");
assert(modelRecords > 0, "No model diagram legend was validated.");
assert(dualRecords > 0, "No dual-model readability record was validated.");

console.log(JSON.stringify({
  status: "SYL-001 V4 visual remediation audit passed",
  identityNoRecords,
  modelRecords,
  dualRecords,
}, null, 2));
