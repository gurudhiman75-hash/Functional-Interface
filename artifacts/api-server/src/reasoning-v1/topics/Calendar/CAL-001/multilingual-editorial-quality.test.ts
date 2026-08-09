import { CALENDAR_PROTOTYPES } from "./registry.ts";
import { generateCalendarQuestion } from "./runtime.ts";
import type { Locale } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const locales = ["hi-IN", "pa-IN"] as const satisfies readonly Locale[];
let packagesChecked = 0;
for (const definition of CALENDAR_PROTOTYPES) {
  for (let seed = 0; seed < 64; seed++) {
    for (const locale of locales) {
      const pkg = generateCalendarQuestion(definition.id, seed, locale);
      const text = JSON.stringify({ stem: pkg.stem, options: pkg.options, explanation: pkg.explanation });
      assert(!/है है|ਹੈ ਹੈ/.test(text), `${definition.id} seed ${seed} ${locale}: doubled copula remains.`);
      assert(!/अतः सही उत्तर .* शामिल है है|ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ .* ਸ਼ਾਮਲ ਹੈ ਹੈ/.test(text), `${definition.id} seed ${seed} ${locale}: classification conclusion is ungrammatical.`);
      packagesChecked++;
    }
  }
}

console.log(JSON.stringify({
  status: "PASS_CAL_001_MULTILINGUAL_EDITORIAL_QUALITY",
  locales,
  packagesChecked,
  doubledCopulaDefects: 0,
}, null, 2));
