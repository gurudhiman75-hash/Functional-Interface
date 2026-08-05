import type { SylLocale } from "../foundation/types";
import { generateSylQuestionV4 } from "./generator-v4";
import { SYL_QL_REGISTRY } from "./ql-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function decodeXml(value: string): string {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function elementText(svg: string, element: "title" | "desc"): string | null {
  const match = svg.match(new RegExp(`<${element}[^>]*>([\\s\\S]*?)<\\/${element}>`, "u"));
  return match ? decodeXml(match[1]) : null;
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let records = 0;
let enabledDiagrams = 0;
let captionParityPassed = 0;
let firstQuestionValidated = false;
let containmentCaptionValidated = false;

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestionV4(definition.qlId, seed, locale);
      const diagram = question.learnerPresentationV4.diagram;
      const key = `${definition.qlId}/${seed}/${locale}`;
      records += 1;

      if (!diagram.enabled) {
        assert(diagram.svg === null && diagram.caption === null && diagram.accessibleDescription === null, `${key} omitted diagram retains caption or SVG content.`);
        continue;
      }

      assert(Boolean(diagram.svg), `${key} enabled diagram is missing SVG.`);
      assert(Boolean(diagram.caption), `${key} enabled diagram is missing its visible caption.`);
      assert(Boolean(diagram.accessibleDescription), `${key} enabled diagram is missing accessible description.`);
      const title = elementText(diagram.svg!, "title");
      const description = elementText(diagram.svg!, "desc");
      assert(title === diagram.caption, `${key} SVG title differs from the visible caption.`);
      assert(description === diagram.accessibleDescription, `${key} SVG description differs from accessibleDescription.`);
      assert(diagram.caption === diagram.accessibleDescription, `${key} visible and accessible captions are not synchronized.`);

      if (locale === "en-IN") {
        assert(!/\bBecause [^.]+? is separate from [^,]+?, the same × is outside\b/u.test(diagram.caption!), `${key} retains singular-verb witness-transfer grammar: ${diagram.caption}`);
        assert(!/\b[A-Za-z][A-Za-z-]*s is separate from\b/u.test(diagram.caption!), `${key} contains plural subject with singular separation verb: ${diagram.caption}`);
        assert(!/\b[A-Za-z][A-Za-z-]*s (?:is inside|lies inside)\b/u.test(diagram.caption!), `${key} contains plural category with singular containment verb: ${diagram.caption}`);
      }

      if (definition.qlId === "SYL-QL-001" && seed === 0 && locale === "en-IN") {
        assert(diagram.caption!.includes("stones and books are separate"), `${key} does not explicitly state the corrected separation relation.`);
        assert(diagram.svg!.includes("stones and books are separate"), `${key} SVG title/description does not contain the corrected caption.`);
        firstQuestionValidated = true;
      }

      if (definition.qlId === "SYL-QL-001" && seed === 5 && locale === "en-IN") {
        assert(diagram.caption!.includes("The bells set lies inside the windows set"), `${key} does not use set-to-set containment wording: ${diagram.caption}`);
        assert(diagram.caption!.includes("windows and rivers sets are separate"), `${key} does not use grammatical set separation wording: ${diagram.caption}`);
        containmentCaptionValidated = true;
      }

      enabledDiagrams += 1;
      captionParityPassed += 1;
    }
  }
}

assert(firstQuestionValidated, "The exact first English question caption was not validated.");
assert(containmentCaptionValidated, "The seed-5 containment/separation caption was not validated.");
assert(enabledDiagrams > 0, "No enabled learner diagrams were validated.");

console.log(JSON.stringify({
  status: "SYL-001 V4 caption and accessibility audit passed",
  records,
  enabledDiagrams,
  captionParityPassed,
  firstQuestionValidated,
  containmentCaptionValidated,
  rejectedEnglishPatterns: [
    "plural category + is separate from",
    "plural category + is/lies inside",
  ],
}, null, 2));
