import type { NumCp008PermanentPackage } from "./permanent-runtime.ts";

type State = Readonly<Record<string, unknown>>;

function numberValue(state: State, key: string): number {
  const value = state[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error(`NUM-CP-008 English polish expected integer ${key}`);
  return value;
}

function mod(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}

function polishStem(q: NumCp008PermanentPackage): string {
  let stem = q.stem;
  switch (q.temporaryPrototypeId) {
    case "NUM-CP008-PROT-011":
      stem = stem.replace("that leaves remainder", "that leave remainder").replaceAll(" and leaves remainder", " and leave remainder").replaceAll(", leaves remainder", ", leave remainder");
      break;
    case "NUM-CP008-PROT-016":
      stem = stem.replace("that must leaves remainder", "that leaves remainder");
      break;
    case "NUM-CP008-PROT-021":
      stem = stem.replace("The least positive integer satisfying both conditions (leaves remainder", "The least positive integer that leaves remainder").replace(") is ", " is ");
      break;
    case "NUM-CP008-PROT-024":
      stem = stem.replace("satisfy all these conditions: they leaves remainder", "satisfy all these conditions: they leave remainder").replaceAll(", leaves remainder", ", leave remainder").replaceAll(", and leaves remainder", ", and leave remainder");
      break;
    case "NUM-CP008-PROT-025":
      stem = stem.replace("how many values leaves remainder", "how many values leave remainder").replaceAll(", leaves remainder", ", leave remainder").replaceAll(", and leaves remainder", ", and leave remainder");
      break;
  }
  return stem;
}

function polishExplanation(q: NumCp008PermanentPackage): NumCp008PermanentPackage["explanation"] {
  if (q.temporaryPrototypeId !== "NUM-CP008-PROT-014") return q.explanation;

  const state = q.hiddenState as State;
  const base = numberValue(state, "base");
  const highestExponent = numberValue(state, "highestExponent");
  const modulus = numberValue(state, "modulus");
  const answer = Number(q.canonicalAnswer);
  const factor = base - 1;

  if (Number.isSafeInteger(answer) && factor > 0) {
    let powerResidue = 1;
    for (let index = 0; index < highestExponent + 1; index += 1) powerResidue = mod(powerResidue * base, modulus);
    const numeratorResidue = mod(powerResidue - 1, modulus);
    const answerCheck = mod(factor * answer, modulus);

    if (answerCheck === numeratorResidue) {
      return Object.freeze({
        coreConcept: "For a geometric sum, multiplying the sum by one less than the base makes almost all terms cancel.",
        strategy: "Use the cancellation identity, find one power remainder, and check the answer without adding every term.",
        steps: Object.freeze([
          `Let S = 1 + ${base} + ${base}^2 + ... + ${base}^${highestExponent}. Then ${factor}S = ${base}^${highestExponent + 1} − 1.`,
          `${base}^${highestExponent + 1} leaves remainder ${powerResidue} when divided by ${modulus}, so ${factor}S leaves remainder ${numeratorResidue}. Since ${factor} × ${answer} also leaves remainder ${answerCheck}, S leaves remainder ${answer}.`,
        ]),
        finalAnswer: q.canonicalAnswer,
      });
    }
  }

  return q.explanation;
}

export function polishNumCp008EnglishExamHumanV2(q: NumCp008PermanentPackage): NumCp008PermanentPackage {
  return Object.freeze({
    ...q,
    stem: polishStem(q),
    explanation: polishExplanation(q),
  }) as NumCp008PermanentPackage;
}
