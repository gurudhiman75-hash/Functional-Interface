import {
  divisorCountFromState,
  divisorsFromState,
  primePowers,
} from "./english-remediation-common";

function band(score) {
  if (score <= 2) return "EASY";
  if (score <= 5) return "MEDIUM";
  return "HARD";
}

function factorTermCount(value) {
  if (typeof value !== "string" || value.trim() === "" || value.trim() === "1") return 0;
  return value.split(/\s*×\s*/u).length;
}

function maxExponent(state) {
  return state.reduce((maximum, { exponent }) => Math.max(maximum, exponent), 0);
}

function stemScore(stem) {
  const numbers = [...stem.matchAll(/\d+/gu)].map((match) => Number(match[0]));
  const maximum = numbers.length ? Math.max(...numbers) : 0;
  const powerCount = stem.match(/\^\{/gu)?.length ?? 0;
  const conditionCount = stem.match(/\b(?:and|but|where|Statement|exactly|either)\b/giu)?.length ?? 0;
  return powerCount
    + Math.min(3, conditionCount)
    + (maximum >= 1_000 ? 2 : maximum >= 100 ? 1 : 0)
    + (stem.length > 180 ? 2 : stem.length > 110 ? 1 : 0);
}

export function applyNumCp005FinalDifficulty(source, result) {
  const hiddenState = result.hiddenState ?? source.hiddenState ?? {};
  const state = primePowers(hiddenState);
  const divisorCount = state.length ? divisorCountFromState(state) : 1;
  let difficulty = result.difficulty;

  switch (source.qlId) {
    case "NUM-QL-046": {
      const score = state.length
        + (divisorCount > 24 ? 2 : divisorCount > 8 ? 1 : 0)
        + (/proper/iu.test(result.stem) ? 1 : 0);
      difficulty = band(score);
      break;
    }
    case "NUM-QL-047": {
      const score = state.length
        + (divisorCount > 24 ? 2 : divisorCount > 8 ? 1 : 0)
        + (/even/iu.test(result.stem) ? 1 : 0);
      difficulty = band(score);
      break;
    }
    case "NUM-QL-048": {
      const requirementTerms = factorTermCount(hiddenState.requirementFactorisation);
      const score = state.length + requirementTerms + (/not divisible/iu.test(result.stem) ? 1 : 0);
      difficulty = band(score);
      break;
    }
    case "NUM-QL-049": {
      const firstTerms = factorTermCount(hiddenState.firstRequirement);
      const secondTerms = factorTermCount(hiddenState.secondRequirement);
      difficulty = band(state.length + firstTerms + secondTerms + 1);
      break;
    }
    case "NUM-QL-050": {
      const power = Number(hiddenState.power ?? (/fifth/iu.test(result.stem) ? 5 : /cube/iu.test(result.stem) ? 3 : 2));
      difficulty = band(state.length + (power >= 5 ? 2 : power === 3 ? 1 : 0) + (maxExponent(state) >= 8 ? 1 : 0));
      break;
    }
    case "NUM-QL-051": {
      difficulty = band(state.length + (/proper/iu.test(result.stem) ? 1 : 0) + (maxExponent(state) >= 5 ? 1 : 0));
      break;
    }
    case "NUM-QL-052": {
      difficulty = divisorCount <= 8 ? "EASY" : divisorCount <= 24 ? "MEDIUM" : "HARD";
      break;
    }
    case "NUM-QL-053": {
      difficulty = divisorCount <= 4 ? "EASY" : divisorCount <= 12 ? "MEDIUM" : "HARD";
      break;
    }
    case "NUM-QL-054": {
      const target = Number(hiddenState.targetDivisorCount ?? hiddenState.divisorCount ?? divisorCount);
      difficulty = target <= 12 ? "EASY" : target <= 36 ? "MEDIUM" : "HARD";
      break;
    }
    case "NUM-QL-055":
    case "NUM-QL-056":
    case "NUM-QL-057":
    case "NUM-QL-064":
    case "NUM-QL-065":
    case "NUM-QL-066":
    case "NUM-QL-067":
    case "NUM-QL-068":
    case "NUM-QL-069":
      difficulty = result.difficulty;
      break;
    case "NUM-QL-058": {
      const length = divisorsFromState(state).length;
      difficulty = length <= 5 ? "EASY" : "MEDIUM";
      break;
    }
    case "NUM-QL-059": {
      const length = divisorsFromState(state).length;
      difficulty = length <= 12 ? "MEDIUM" : "HARD";
      break;
    }
    case "NUM-QL-060": {
      const lower = Number(hiddenState.lower);
      const upper = Number(hiddenState.upper);
      const target = Number(hiddenState.targetDivisorCount);
      const width = upper - lower + 1;
      difficulty = (target === 2 || target === 3) && width <= 20
        ? "EASY"
        : width <= 50
          ? "MEDIUM"
          : "HARD";
      break;
    }
    case "NUM-QL-061": {
      const property = String(hiddenState.propertyKind);
      difficulty = (property === "TOTAL_DIVISORS" || property === "ODD_DIVISORS") && state.length <= 2
        ? "EASY"
        : "MEDIUM";
      break;
    }
    case "NUM-QL-062": {
      difficulty = band(stemScore(result.stem));
      break;
    }
    case "NUM-QL-063": {
      const integer = Number(hiddenState.integerValue);
      const visible = Number(hiddenState.visiblePartner);
      const answer = Number(result.canonicalAnswer);
      difficulty = integer <= 10_000 && visible <= 100 && answer <= 1_000
        ? "EASY"
        : "MEDIUM";
      break;
    }
    default:
      difficulty = band(stemScore(result.stem));
  }

  return {
    ...result,
    difficulty,
  };
}
