import questionLanguageLibrary from "./question-language.library.json" assert { type: "json" };
import explanationLibrary from "./explanation.library.json" assert { type: "json" };
import * as formatter from "./formatter";
import { generate } from "./generator";
import { solve } from "./solver";
import { validate } from "./validator";

export const NS_SURD_001 = {
  packageId: "NS-SURD-001",
  activeCps: [
    "CP01",
    "CP02",
    "CP03",
    "CP04",
    "CP05",
    "CP06",
    "CP07",
    "CP08"
  ],
  questionLanguageLibrary,
  explanationLibrary,
  generator: generate,
  formatter: formatter,
  solver: solve,
  validator: validate
};
