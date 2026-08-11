import {
  generateSapCp005,
  type SapCp005Option,
  type SapCp005Package,
  type SapCp005PrototypeId,
} from "./runtime";
import {
  type SapCp005Wave2Package,
  type SapCp005Wave2PrototypeId,
} from "./runtime-wave2";
import {
  generateSapCp005Editorial as generateWave1V1,
  generateSapCp005Wave2Editorial,
} from "./editorial-runtime";

function diagnosisOptions(correctIndex: number): readonly SapCp005Option[] {
  const correct = "Cancellation across addition is invalid";
  const wrong = [
    {
      value: "The whole fraction should be inverted first",
      misconceptionId: "UNNECESSARY_RECIPROCAL",
      analysis: "Inverting the complete fraction is not a valid response to the shown addition and would create a different expression.",
    },
    {
      value: "The value of the cancelled x/x term should be 0",
      misconceptionId: "COMMON_FACTOR_VALUE_ERROR",
      analysis: "A non-zero quantity divided by itself is 1, not 0; this does not address the actual illegal cancellation across a sum.",
    },
    {
      value: "There is no error; the cancellation is valid",
      misconceptionId: "ACCEPT_ILLEGAL_CANCELLATION",
      analysis: "A symbol may be cancelled only when it is a factor of the complete numerator and denominator, not merely one term of a sum.",
    },
  ] as const;
  const options: SapCp005Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push({
        value: correct,
        isCorrect: true,
        misconceptionId: null,
        analysis: "This correctly identifies that cancellation is legal only for a factor of the complete numerator and denominator.",
      });
    } else {
      const option = wrong[wrongIndex++]!;
      options.push({ ...option, isCorrect: false });
    }
  }
  return Object.freeze(options);
}

function diagnosisPackage(seed: number): SapCp005Package {
  const prototypeId = "SAP-CP005-PROT-ILLEGAL-CANCELLATION-DIAGNOSIS" as const;
  const pkg = generateSapCp005(prototypeId, seed);
  const d = pkg.oracle.data;
  const stem = `A student writes (${d.x} + ${d.y})/${d.x} = 1 + ${d.y} by cancelling ${d.x}. Which statement correctly identifies the first error?`;
  const options = diagnosisOptions(pkg.correctIndex);
  const errors: string[] = [];
  if (new Set(options.map((option) => option.value)).size !== 4) errors.push("Diagnosis options are not distinct.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Diagnosis package does not have exactly one correct option.");
  if (options[pkg.correctIndex]?.value !== pkg.canonicalAnswer) errors.push("Diagnosis correct option is not answer-bound.");
  if (options.filter((option) => !option.isCorrect).some((option) => !option.misconceptionId || option.analysis.length < 40)) errors.push("Diagnosis distractor provenance is incomplete.");
  return Object.freeze({
    ...pkg,
    stem,
    options,
    explanation: Object.freeze({
      ...pkg.explanation,
      coreConcept: "Cancellation applies to common factors multiplying the whole numerator and denominator. A term inside a sum or difference cannot be cancelled by itself.",
    }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer: pkg.canonicalAnswer, oracle: pkg.oracle }),
    generationIdentity: `${pkg.generationIdentity}:EDITORIAL-V2-DIAGNOSIS`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

function normaliseStem<T extends SapCp005Package | SapCp005Wave2Package>(pkg: T): T {
  if (pkg.stem.length >= 20) return pkg;
  const compact = pkg.stem.replace(/^Simplify\s*/i, "").replace(/^Evaluate\s*/i, "");
  const stem = `Find the value of ${compact}`;
  return Object.freeze({
    ...pkg,
    stem,
    canonicalPayloadKey: JSON.stringify({
      prototypeId: pkg.prototypeId,
      stem,
      answer: pkg.canonicalAnswer,
      oracle: pkg.oracle,
    }),
    generationIdentity: `${pkg.generationIdentity}:EXAM-STEM`,
  }) as T;
}

export function generateSapCp005Editorial(prototypeId: SapCp005PrototypeId, seed: number): SapCp005Package {
  if (prototypeId === "SAP-CP005-PROT-ILLEGAL-CANCELLATION-DIAGNOSIS") return diagnosisPackage(seed);
  return normaliseStem(generateWave1V1(prototypeId, seed));
}

export function generateSapCp005Wave2EditorialV2(prototypeId: SapCp005Wave2PrototypeId, seed: number): SapCp005Wave2Package {
  return normaliseStem(generateSapCp005Wave2Editorial(prototypeId, seed));
}
