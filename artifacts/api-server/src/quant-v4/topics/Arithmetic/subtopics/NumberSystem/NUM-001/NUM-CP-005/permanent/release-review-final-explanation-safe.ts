function factorState(value) {
  return Array.isArray(value)
    ? value.map((entry) => ({
      prime: Number(entry?.prime),
      exponent: Number(entry?.exponent),
    }))
    : [];
}

function divisorCountFormula(state) {
  return state.map(({ exponent }) => `(${exponent}+1)`).join(" \\times ");
}

function divisorCount(state) {
  return state.reduce((count, { exponent }) => count * (exponent + 1), 1);
}

function setBody(values) {
  return Array.isArray(values) ? values.join(", ") : "";
}

function ql053Final(input, explanation) {
  const state = factorState(input.hiddenState.factorState);
  if (state.length === 0) return explanation;
  const formula = divisorCountFormula(state);
  const count = divisorCount(state);
  const equation = `Number of divisors: \\(d(n)=${formula}=${count}\\).`;
  const hasEquation = explanation.stepByStep.some((step) => /d\(n\)=/u.test(step));
  return {
    ...explanation,
    stepByStep: hasEquation ? explanation.stepByStep : [equation, ...explanation.stepByStep],
  };
}

function ql064Or065Final(input, explanation) {
  const target = Number(input.hiddenState.targetDivisorCount);
  if (!Number.isFinite(target)) return explanation;
  return {
    ...explanation,
    coreConcept: `For \\(n=p^{x}q^{y}\\), \\(d(n)=(x+1)(y+1)=${target}\\).`,
  };
}

function ql068Final(explanation) {
  const countLine = explanation.stepByStep.find((step) => /A gives \d+; B gives \d+\./u.test(step));
  const match = countLine?.match(/A gives (\d+); B gives (\d+)\./u);
  if (!match) return explanation;
  const first = Number(match[1]);
  const second = Number(match[2]);
  const sign = first > second ? ">" : first < second ? "<" : "=";
  const conclusion = first > second
    ? "Number A has more divisors."
    : first < second
      ? "Number B has more divisors."
      : "Both numbers have the same number of divisors.";
  return {
    ...explanation,
    stepByStep: [
      `\\(d_A=${first}\\) and \\(d_B=${second}\\).`,
      `Since \\(${first}${sign}${second}\\), ${conclusion}`,
    ],
    finalAnswer: conclusion,
  };
}

function ql069Final(input, explanation) {
  const first = input.hiddenState.firstCandidates;
  const second = input.hiddenState.secondCandidates;
  const combined = input.hiddenState.combinedCandidates;
  return {
    ...explanation,
    stepByStep: [
      `Statement I gives \\(S_I=\\{${setBody(first)}\\}\\); it is ${Array.isArray(first) && first.length === 1 ? "sufficient" : "not sufficient"} alone.`,
      `Statement II gives \\(S_{II}=\\{${setBody(second)}\\}\\); it is ${Array.isArray(second) && second.length === 1 ? "sufficient" : "not sufficient"} alone.`,
      `Together, \\(S_I\\cap S_{II}=\\{${setBody(combined)}\\}\\).`,
    ],
  };
}

export function applyNumCp005FinalExplanationSafety(input, explanation) {
  if (input.qlId === "NUM-QL-053") return ql053Final(input, explanation);
  if (input.qlId === "NUM-QL-064" || input.qlId === "NUM-QL-065") {
    return ql064Or065Final(input, explanation);
  }
  if (input.qlId === "NUM-QL-068") return ql068Final(explanation);
  if (input.qlId === "NUM-QL-069") return ql069Final(input, explanation);
  return explanation;
}
