import assert from "node:assert/strict";
import { localizeDiExtensionSet as localize } from "./native-extension-v1";
import { generateDi003SingleBarSet } from "./DI-003/single-bar-v1";
import { generateDi003StackedBarSet } from "./DI-003/stacked-bar-v1";
import { generateDi005FullyVisibleSet } from "./DI-005/fully-visible-pie-v1";
import { generateDi005ComparativePieSet } from "./DI-005/comparative-pie-v1";
import { generateDi006AdvancedCaseletSet } from "./DI-006/advanced-caselet-v1";
import { generateDi008AdvancedArithmeticSet } from "./DI-008/advanced-arithmetic-v1";
import { generateDi005DonutSet } from "./DI-005/donut-v1";
import { renderDi005DonutSvg } from "./DI-005/donut-svg-v1";
import { renderDi008AdvancedTableHtml } from "./DI-008/advanced-arithmetic-table";

function numbers(value: unknown): number[] {
  if (typeof value === "number") return [value];
  if (Array.isArray(value)) return value.flatMap(numbers);
  if (value && typeof value === "object")
    return Object.values(value).flatMap(numbers);
  return [];
}
const tasks = new Set<string>(),
  topologies = new Set<string>(),
  domains = new Set<string>();
let checked = 0,
  ratioCases = 0;
const generators: Array<(input: { seed: string }) => any> = [
  generateDi003SingleBarSet,
  generateDi003StackedBarSet,
  generateDi005FullyVisibleSet,
  generateDi005DonutSet,
  generateDi005ComparativePieSet,
  generateDi006AdvancedCaseletSet,
  generateDi008AdvancedArithmeticSet,
];
for (const generate of generators)
  for (let index = 0; index < 200; index++) {
    const source = generate({ seed: `EXT:${index}` });
    const snapshot = JSON.stringify(source);
    if (source.stimulus?.topology) topologies.add(source.stimulus.topology);
    if (source.stimulus?.domain) domains.add(source.stimulus.domain);
    if (source.stimulus?.topology === "RATIO_NETWORK") {
      const [a, b, c, d, e] = source.resolvedValues;
      // The learner facts now determine k = total/20 and every category uniquely.
      assert(
        source.stimulus.learnerText.includes(
          `${source.stimulus.categories[4]} had twice as many as ${source.stimulus.categories[0]}`,
        ),
      );
      const k = source.stimulus.totalValue / 20;
      assert.deepEqual([a, b, c, d, e], [3 * k, 4 * k, 5 * k, 2 * k, 6 * k]);
      ratioCases++;
    }
    for (const language of ["hi", "pa"] as const) {
      const native = localize(source, language);
      const script = language === "hi" ? /[\u0900-\u097f]/ : /[\u0a00-\u0a7f]/;
      assert.deepEqual(numbers(native), numbers(source));
      assert.equal(
        JSON.stringify(source),
        snapshot,
        "Localization mutated English source",
      );
      for (const [i, q] of native.questions.entries()) {
        const original = source.questions[i];
        tasks.add(q.kind);
        assert.equal(q.questionId, original.questionId);
        assert.equal(q.correctIndex, original.correctIndex);
        assert.equal(q.answer, q.options[q.correctIndex]);
        assert.equal(new Set(q.options).size, q.options.length);
        assert(script.test(q.stem));
        assert(!/undefined|NaN/.test(JSON.stringify(q)));
        assert(
          !/[A-Za-z]{3,}/.test(
            q.stem + q.explanation.keyIdea + q.explanation.steps.join(" "),
          ),
        );
        if (!/[A-Za-z]{3,}/.test(original.answer))
          assert.equal(q.answer, original.answer);
        checked++;
      }
      const s = native.stimulus;
      if (s?.topology === "RATIO_NETWORK")
        assert(s.learnerText.includes(language === "hi" ? "दोगुना" : "ਦੁੱਗਣਾ"));
      if (["FULLY_VISIBLE_PIE_V1", "RING_DONUT_V1"].includes(source.mode)) {
        const svg = renderDi005DonutSvg(s);
        assert(!/>Total</.test(svg));
        assert(script.test(svg));
      }
      if (s?.domain) {
        const html = renderDi008AdvancedTableHtml(s);
        assert(!/>Case<|>Use:</.test(html));
        assert(!/[A-Za-z]{3,}/.test(html.replace(/<[^>]*>/g, "")));
      }
    }
  }
assert.equal(topologies.size, 5);
assert.equal(domains.size, 6);
assert(ratioCases > 20);
assert(tasks.size > 50);
console.log(
  "DI_NATIVE_EXTENSION_V1",
  JSON.stringify({
    checked,
    tasks: tasks.size,
    topologies: topologies.size,
    domains: domains.size,
    ratioCases,
  }),
);
