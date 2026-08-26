import { createHash } from "node:crypto";

type Language = "en" | "hi" | "pa";
type FactorPair = readonly [bigint, number];

type BaseOption = Readonly<{
  value: string;
  isCorrect: boolean;
  misconceptionId: string;
}>;

type OverlayInput = Readonly<{
  temporaryPrototypeId: string;
  seed: number;
  stem: string;
  options: readonly BaseOption[];
  correctIndex: number;
  canonicalAnswer: string;
  verifierAnswer: string;
  hiddenState: Readonly<Record<string, unknown>>;
  mathematicalFingerprint: string;
}>;

export const NUM_CP012_EXAM_DEPTH_PROFILE = "CALCULATION_INTENSIVE_REVIEW_V1" as const;

function L(language: Language, en: string, hi: string, pa: string) {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function field(state: Readonly<Record<string, unknown>>, key: string) {
  if (!(key in state)) throw new Error(`NUM-CP-012 exam-depth overlay missing state field ${key}.`);
  return state[key];
}

function text(state: Readonly<Record<string, unknown>>, key: string) {
  const item = field(state, key);
  return typeof item === "bigint" ? item.toString() : String(item);
}

function num(state: Readonly<Record<string, unknown>>, key: string) {
  const parsed = Number(field(state, key));
  if (!Number.isFinite(parsed)) throw new Error(`NUM-CP-012 exam-depth overlay field ${key} is not numeric.`);
  return parsed;
}

function big(state: Readonly<Record<string, unknown>>, key: string) {
  return BigInt(text(state, key));
}

function pairs(state: Readonly<Record<string, unknown>>, key = "factors"): FactorPair[] {
  const item = field(state, key);
  if (!Array.isArray(item)) throw new Error(`NUM-CP-012 exam-depth overlay factor field ${key} is not an array.`);
  return item.map((entry) => {
    if (!Array.isArray(entry) || entry.length !== 2) throw new Error(`NUM-CP-012 malformed factor pair in ${key}.`);
    return [BigInt(String(entry[0])), Number(entry[1])] as const;
  });
}

function pow(base: bigint, exponent: number) {
  return base ** BigInt(exponent);
}

function product(factors: readonly FactorPair[]) {
  return factors.reduce((acc, [prime, exponent]) => acc * pow(prime, exponent), 1n);
}

function floorRoot(input: bigint, k: number) {
  const target = input < 0n ? -input : input;
  if (target <= 1n) return target;
  let low = 0n;
  let high = 1n;
  while (pow(high, k) <= target) high *= 2n;
  while (low + 1n < high) {
    const mid = (low + high) / 2n;
    if (pow(mid, k) <= target) low = mid;
    else high = mid;
  }
  return low;
}

function fingerprint(prototypeId: string, state: Readonly<Record<string, unknown>>) {
  return createHash("sha256")
    .update(JSON.stringify({ prototypeId, state }, (_key, value) => typeof value === "bigint" ? value.toString() : value))
    .digest("hex");
}

function powerLabel(k: number, language: Language) {
  if (k === 2) return L(language, "perfect square", "पूर्ण वर्ग", "ਪੂਰਨ ਵਰਗ");
  if (k === 3) return L(language, "perfect cube", "पूर्ण घन", "ਪੂਰਨ ਘਨ");
  return L(language, `perfect ${k}th power`, `पूर्ण ${k}वीं घात`, `ਪੂਰਨ ${k}ਵੀਂ ਘਾਤ`);
}

function rootLabel(k: number, language: Language) {
  if (k === 2) return L(language, "square root", "वर्गमूल", "ਵਰਗਮੂਲ");
  if (k === 3) return L(language, "cube root", "घनमूल", "ਘਨਮੂਲ");
  return L(language, `${k}th root`, `${k}वाँ मूल`, `${k}ਵਾਂ ਮੂਲ`);
}

function scaledRoot(seed: number, k: number) {
  if (k === 2) return BigInt(180 + (seed % 221));
  if (k === 3) return BigInt(28 + (seed % 53));
  return BigInt(12 + (seed % 25));
}

function withBoostedExponents(factors: readonly FactorPair[], k: number, seed: number) {
  return factors.map(([prime, exponent], index) => {
    const boost = 1 + ((seed + index) % 2);
    return [prime, exponent + boost * k] as const;
  });
}

function nearbyNonPower(perfect: bigint, offset: number) {
  return perfect + BigInt(offset);
}

function remapOptions(
  input: OverlayInput,
  resolver: (misconceptionId: string, originalValue: string, index: number) => string,
) {
  const values = new Set<string>();
  return Object.freeze(input.options.map((option, index) => {
    let next = resolver(option.misconceptionId, option.value, index);
    if (values.has(next)) {
      const parsed = /^-?\d+$/u.test(next) ? BigInt(next) : 0n;
      let delta = 1n;
      while (values.has((parsed + delta).toString())) delta += 1n;
      next = (parsed + delta).toString();
    }
    values.add(next);
    return Object.freeze({ ...option, value: next });
  }));
}

function finalize<T extends OverlayInput>(
  input: T,
  patch: Readonly<{
    stem: string;
    options?: readonly BaseOption[];
    canonicalAnswer: string;
    hiddenState: Readonly<Record<string, unknown>>;
  }>,
) {
  const options = patch.options ?? input.options;
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options[correctIndex]?.value !== patch.canonicalAnswer) {
    throw new Error(`${input.temporaryPrototypeId}: exam-depth overlay answer binding drift.`);
  }
  if (new Set(options.map((option) => option.value)).size !== 4) {
    throw new Error(`${input.temporaryPrototypeId}: exam-depth overlay duplicate options.`);
  }
  return Object.freeze({
    ...input,
    stem: patch.stem,
    options: Object.freeze(options),
    correctIndex,
    canonicalAnswer: patch.canonicalAnswer,
    verifierAnswer: patch.canonicalAnswer,
    hiddenState: Object.freeze({ ...patch.hiddenState }),
    sourceMathematicalFingerprint: input.mathematicalFingerprint,
    mathematicalFingerprint: fingerprint(input.temporaryPrototypeId, patch.hiddenState),
    examDepthOverlay: Object.freeze({
      profile: NUM_CP012_EXAM_DEPTH_PROFILE,
      sourceMathematicalFingerprint: input.mathematicalFingerprint,
      mathematicalFingerprint: fingerprint(input.temporaryPrototypeId, patch.hiddenState),
    }),
  }) as T & Readonly<{
    sourceMathematicalFingerprint: string;
    examDepthOverlay: Readonly<{
      profile: typeof NUM_CP012_EXAM_DEPTH_PROFILE;
      sourceMathematicalFingerprint: string;
      mathematicalFingerprint: string;
    }>;
  }>;
}

export function applyNumCp012ExamDepthOverlay<T extends OverlayInput>(input: T, language: Language) {
  const s = input.hiddenState;
  const prototype = input.temporaryPrototypeId;

  if (prototype === "NUM-CP012-PROT-001") {
    const k = num(s, "k");
    const root = scaledRoot(input.seed, k);
    const perfect = pow(root, k);
    const candidates = [perfect, nearbyNonPower(perfect, 1), nearbyNonPower(perfect, 2), nearbyNonPower(perfect, 3)];
    let nonPowerIndex = 0;
    const options = remapOptions(input, (misconceptionId) => {
      if (misconceptionId === "CORRECT") return perfect.toString();
      const value = candidates[1 + (nonPowerIndex % 3)]!;
      nonPowerIndex += 1;
      return value.toString();
    });
    return finalize(input, {
      stem: input.stem,
      options,
      canonicalAnswer: perfect.toString(),
      hiddenState: { ...s, root: root.toString(), perfect: perfect.toString(), factors: [[root, k]], candidates: candidates.map(String) },
    });
  }

  if (prototype === "NUM-CP012-PROT-002") {
    const k = num(s, "k");
    const root = scaledRoot(input.seed + 17, k);
    const target = pow(root, k);
    const options = remapOptions(input, (misconceptionId) => {
      if (misconceptionId === "CORRECT") return root.toString();
      if (misconceptionId === "ROOT_ONE_TOO_LARGE") return (root + 1n).toString();
      if (misconceptionId === "ROOT_ONE_TOO_SMALL") return (root - 1n).toString();
      if (misconceptionId === "MULTIPLY_ROOT_BY_POWER") return (root * BigInt(k)).toString();
      return (root + 2n).toString();
    });
    return finalize(input, {
      stem: L(language, `Find the exact integer ${rootLabel(k, language)} of ${target}.`, `${target} का सटीक पूर्णांक ${rootLabel(k, language)} ज्ञात कीजिए।`, `${target} ਦਾ ਸਹੀ ਪੂਰਨ ਅੰਕ ${rootLabel(k, language)} ਕੱਢੋ।`),
      options,
      canonicalAnswer: root.toString(),
      hiddenState: { ...s, root: root.toString(), value: target.toString() },
    });
  }

  if (prototype === "NUM-CP012-PROT-003" || prototype === "NUM-CP012-PROT-004") {
    const k = num(s, "k");
    const factors = withBoostedExponents(pairs(s), k, input.seed);
    const n = product(factors);
    if (prototype.endsWith("003")) {
      const multiplierFactors = factors
        .map(([prime, exponent]) => [prime, (k - exponent % k) % k] as const)
        .filter(([, exponent]) => exponent > 0);
      const multiplier = product(multiplierFactors);
      return finalize(input, {
        stem: L(language, `What is the least positive integer by which ${n} must be multiplied to make the product a ${powerLabel(k, language)}?`, `${n} को किस न्यूनतम धनात्मक पूर्णांक से गुणा करें ताकि गुणनफल ${powerLabel(k, language)} बन जाए?`, `${n} ਨੂੰ ਕਿਹੜੇ ਘੱਟੋ-ਘੱਟ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਨਾਲ ਗੁਣਾ ਕਰੀਏ ਤਾਂ ਜੋ ਗੁਣਨਫਲ ${powerLabel(k, language)} ਬਣ ਜਾਵੇ?`),
        canonicalAnswer: multiplier.toString(),
        hiddenState: { ...s, factors, value: n.toString(), multiplierFactors, correct: multiplier.toString() },
      });
    }
    const divisorFactors = factors
      .map(([prime, exponent]) => [prime, exponent % k] as const)
      .filter(([, exponent]) => exponent > 0);
    const divisor = product(divisorFactors);
    return finalize(input, {
      stem: L(language, `What is the least positive integer by which ${n} must be divided so that the quotient is a ${powerLabel(k, language)}?`, `${n} को किस न्यूनतम धनात्मक पूर्णांक से भाग दें ताकि भागफल ${powerLabel(k, language)} हो?`, `${n} ਨੂੰ ਕਿਹੜੇ ਘੱਟੋ-ਘੱਟ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਨਾਲ ਭਾਗ ਦੇਈਏ ਤਾਂ ਜੋ ਭਾਗਫਲ ${powerLabel(k, language)} ਹੋਵੇ?`),
      canonicalAnswer: divisor.toString(),
      hiddenState: { ...s, factors, value: n.toString(), divisorFactors, quotient: (n / divisor).toString(), correct: divisor.toString() },
    });
  }

  if (prototype === "NUM-CP012-PROT-005" || prototype === "NUM-CP012-PROT-014") {
    // These are inverse-topology authorities. Their difficulty comes from complete
    // bounded-state reasoning rather than large arithmetic, so preserve the frozen state.
    return Object.freeze({
      ...input,
      sourceMathematicalFingerprint: input.mathematicalFingerprint,
      examDepthOverlay: Object.freeze({
        profile: NUM_CP012_EXAM_DEPTH_PROFILE,
        sourceMathematicalFingerprint: input.mathematicalFingerprint,
        mathematicalFingerprint: input.mathematicalFingerprint,
      }),
    });
  }

  if (prototype === "NUM-CP012-PROT-006") {
    const k = num(s, "k");
    const factors = withBoostedExponents(pairs(s), k, input.seed + 5);
    const n = product(factors);
    const kept = factors
      .map(([prime, exponent]) => [prime, Math.floor(exponent / k) * k] as const)
      .filter(([, exponent]) => exponent > 0);
    const answer = product(kept);
    const root = floorRoot(answer, k);
    const cofactor = n / answer;
    const options = remapOptions(input, (misconceptionId) => {
      if (misconceptionId === "CORRECT") return answer.toString();
      if (misconceptionId === "RETURN_ROOT_INSTEAD_OF_DIVISOR") return root.toString();
      if (misconceptionId === "RETURN_REMOVED_COFACTOR") return cofactor.toString();
      if (misconceptionId === "ROUND_EXPONENTS_UP_INSTEAD_OF_DOWN") {
        return product(factors.map(([prime, exponent]) => [prime, Math.ceil(exponent / k) * k] as const)).toString();
      }
      return (answer + 1n).toString();
    });
    return finalize(input, {
      stem: L(language, `Find the greatest divisor of ${n} that is a ${powerLabel(k, language)}.`, `${n} का सबसे बड़ा भाजक ज्ञात कीजिए जो ${powerLabel(k, language)} हो।`, `${n} ਦਾ ਸਭ ਤੋਂ ਵੱਡਾ ਭਾਜਕ ਕੱਢੋ ਜੋ ${powerLabel(k, language)} ਹੋਵੇ।`),
      options,
      canonicalAnswer: answer.toString(),
      hiddenState: { ...s, factors, value: n.toString(), divisorFactors: kept, correct: answer.toString() },
    });
  }

  if (prototype === "NUM-CP012-PROT-007") {
    const k = num(s, "k");
    const first = scaledRoot(input.seed + 3, k);
    const span = BigInt(18 + (input.seed % 17));
    const last = first + span;
    const previous = pow(first - 1n, k);
    const firstPower = pow(first, k);
    const lastPower = pow(last, k);
    const next = pow(last + 1n, k);
    const low = previous + (firstPower - previous) / 2n + 1n;
    const high = lastPower + (next - lastPower) / 3n;
    const answer = last - first + 1n;
    const options = remapOptions(input, (misconceptionId) => {
      if (misconceptionId === "CORRECT") return answer.toString();
      if (misconceptionId === "OFF_BY_ONE_COUNT") return (answer + 1n).toString();
      if (misconceptionId === "MISS_BOUNDARY_POWER") return (answer - 1n).toString();
      if (misconceptionId === "OPEN_LEFT_BOUNDARY_COUNT") return (answer - 1n).toString();
      return (answer + 2n).toString();
    });
    return finalize(input, {
      stem: L(language, `How many ${k === 2 ? "perfect squares" : "perfect cubes"} lie in the closed interval from ${low} to ${high}?`, `${low} से ${high} तक बंद अंतराल में कितने ${k === 2 ? "पूर्ण वर्ग" : "पूर्ण घन"} हैं?`, `${low} ਤੋਂ ${high} ਤੱਕ ਬੰਦ ਅੰਤਰਾਲ ਵਿੱਚ ਕਿੰਨੇ ${k === 2 ? "ਪੂਰਨ ਵਰਗ" : "ਪੂਰਨ ਘਨ"} ਹਨ?`),
      options,
      canonicalAnswer: answer.toString(),
      hiddenState: { ...s, low: low.toString(), high: high.toString(), firstRoot: first.toString(), highRoot: last.toString(), correct: answer.toString() },
    });
  }

  if (prototype === "NUM-CP012-PROT-008") {
    const k = num(s, "k");
    const direction = text(s, "direction");
    const forceComplete = Boolean(field(s, "forceComplete"));
    const root = scaledRoot(input.seed + 9, k);
    const lower = pow(root, k);
    const upper = pow(root + 1n, k);
    const gap = upper - lower;
    const offset = forceComplete ? 0n : gap / 3n + 1n;
    const n = lower + offset;
    const boundary = direction === "ADD" ? (forceComplete ? lower : upper) : lower;
    const answer = direction === "ADD" ? boundary - n : n - boundary;
    const options = remapOptions(input, (misconceptionId) => {
      if (misconceptionId === "CORRECT") return answer.toString();
      if (misconceptionId === "RETURN_TARGET_POWER_INSTEAD_OF_DIFFERENCE") return boundary.toString();
      if (misconceptionId === "OFF_BY_ONE_COMPLETION") return (answer + 1n).toString();
      if (misconceptionId === "STOP_BEFORE_POWER_BOUNDARY") return (answer > 0n ? answer - 1n : 1n).toString();
      return (answer + 2n).toString();
    });
    return finalize(input, {
      stem: direction === "ADD"
        ? L(language, `What is the least non-negative integer that must be added to ${n} to obtain a ${powerLabel(k, language)}?`, `${n} में कौन-सा न्यूनतम गैर-ऋणात्मक पूर्णांक जोड़ें ताकि ${powerLabel(k, language)} मिले?`, `${n} ਵਿੱਚ ਕਿਹੜਾ ਘੱਟੋ-ਘੱਟ ਗੈਰ-ਰਣਾਤਮਕ ਪੂਰਨ ਅੰਕ ਜੋੜੀਏ ਤਾਂ ਜੋ ${powerLabel(k, language)} ਮਿਲੇ?`)
        : L(language, `What is the least non-negative integer that must be subtracted from ${n} to obtain a ${powerLabel(k, language)}?`, `${n} में से कौन-सा न्यूनतम गैर-ऋणात्मक पूर्णांक घटाएँ ताकि ${powerLabel(k, language)} मिले?`, `${n} ਵਿੱਚੋਂ ਕਿਹੜਾ ਘੱਟੋ-ਘੱਟ ਗੈਰ-ਰਣਾਤਮਕ ਪੂਰਨ ਅੰਕ ਘਟਾਈਏ ਤਾਂ ਜੋ ${powerLabel(k, language)} ਮਿਲੇ?`),
      options,
      canonicalAnswer: answer.toString(),
      hiddenState: { ...s, n: n.toString(), boundary: boundary.toString(), correct: answer.toString() },
    });
  }

  if (prototype === "NUM-CP012-PROT-009") {
    const mode = num(s, "mode");
    const k = num(s, "k");
    if (mode < 2) {
      return Object.freeze({
        ...input,
        sourceMathematicalFingerprint: input.mathematicalFingerprint,
        examDepthOverlay: Object.freeze({
          profile: NUM_CP012_EXAM_DEPTH_PROFILE,
          sourceMathematicalFingerprint: input.mathematicalFingerprint,
          mathematicalFingerprint: input.mathematicalFingerprint,
        }),
      });
    }
    const magnitude = scaledRoot(input.seed + 23, k);
    const target = mode === 2 ? -pow(magnitude, k) : -pow(magnitude, k);
    const answer = mode === 2 ? (-magnitude).toString() : input.canonicalAnswer;
    const options = remapOptions(input, (misconceptionId, originalValue) => {
      if (misconceptionId === "CORRECT") return answer;
      if (misconceptionId === "DROP_NEGATIVE_SIGN" || misconceptionId === "IGNORE_NEGATIVE_TARGET") return magnitude.toString();
      if (misconceptionId === "ROOT_ONE_TOO_SMALL") return (-magnitude - 1n).toString();
      if (misconceptionId === "ASSUME_NEGATIVE_EVEN_ROOT") return (-magnitude).toString();
      return originalValue;
    });
    return finalize(input, {
      stem: L(language, `Find the exact integer ${rootLabel(k, language)} of ${target}, or choose ${mode === 3 ? input.canonicalAnswer : "NO_INTEGER_ROOT"} if no such integer exists.`, `${target} का सटीक पूर्णांक ${rootLabel(k, language)} ज्ञात कीजिए; यदि ऐसा पूर्णांक नहीं है तो उपयुक्त 'कोई पूर्णांक मूल नहीं' विकल्प चुनें।`, `${target} ਦਾ ਸਹੀ ਪੂਰਨ ਅੰਕ ${rootLabel(k, language)} ਕੱਢੋ; ਜੇ ਅਜਿਹਾ ਪੂਰਨ ਅੰਕ ਨਹੀਂ ਹੈ ਤਾਂ ਢੁੱਕਵਾਂ 'ਕੋਈ ਪੂਰਨ ਅੰਕ ਮੂਲ ਨਹੀਂ' ਵਿਕਲਪ ਚੁਣੋ।`),
      options,
      canonicalAnswer: answer,
      hiddenState: { ...s, value: target.toString() },
    });
  }

  if (prototype === "NUM-CP012-PROT-010") {
    const k = num(s, "k");
    const direction = text(s, "direction");
    const exactBoundary = Boolean(field(s, "exactBoundary"));
    const root = scaledRoot(input.seed + 31, k);
    const lower = pow(root, k);
    const upper = pow(root + 1n, k);
    const gap = upper - lower;
    const bound = exactBoundary ? lower : lower + (2n * gap) / 5n;
    const answer = direction === "AT_MOST" || exactBoundary ? lower : upper;
    const other = answer === lower ? upper : lower;
    const options = remapOptions(input, (misconceptionId) => {
      if (misconceptionId === "CORRECT") return answer.toString();
      if (misconceptionId === "CHOOSE_WRONG_BOUNDARY_DIRECTION") return other.toString();
      if (misconceptionId === "RETURN_ROOT_INSTEAD_OF_POWER") return root.toString();
      if (misconceptionId === "RETURN_BOUND_WITHOUT_POWER_CHECK") return bound.toString();
      return (answer + 1n).toString();
    });
    return finalize(input, {
      stem: direction === "AT_MOST"
        ? L(language, `What is the greatest ${powerLabel(k, language)} not exceeding ${bound}?`, `${bound} से अधिक न होने वाला सबसे बड़ा ${powerLabel(k, language)} कौन-सा है?`, `${bound} ਤੋਂ ਵੱਧ ਨਾ ਹੋਣ ਵਾਲਾ ਸਭ ਤੋਂ ਵੱਡਾ ${powerLabel(k, language)} ਕਿਹੜਾ ਹੈ?`)
        : L(language, `What is the least ${powerLabel(k, language)} that is at least ${bound}?`, `${bound} से कम न होने वाला सबसे छोटा ${powerLabel(k, language)} कौन-सा है?`, `${bound} ਤੋਂ ਘੱਟ ਨਾ ਹੋਣ ਵਾਲਾ ਸਭ ਤੋਂ ਛੋਟਾ ${powerLabel(k, language)} ਕਿਹੜਾ ਹੈ?`),
      options,
      canonicalAnswer: answer.toString(),
      hiddenState: { ...s, root: root.toString(), lower: lower.toString(), upper: upper.toString(), bound: bound.toString() },
    });
  }

  if (prototype === "NUM-CP012-PROT-011") {
    const k = num(s, "k");
    const root = scaledRoot(input.seed + 43, k);
    const lower = pow(root, k);
    const upper = pow(root + 1n, k);
    const gap = upper - lower;
    const offset = input.seed % 2 === 0 ? gap / 3n : gap - gap / 3n;
    const query = lower + offset;
    const lowerDistance = query - lower;
    const upperDistance = upper - query;
    const answer = lowerDistance < upperDistance ? lower : upper;
    const other = answer === lower ? upper : lower;
    const answerRoot = answer === lower ? root : root + 1n;
    const options = remapOptions(input, (misconceptionId) => {
      if (misconceptionId === "CORRECT") return answer.toString();
      if (misconceptionId === "CHOOSE_FARTHER_ADJACENT_POWER") return other.toString();
      if (misconceptionId === "RETURN_ORIGINAL_VALUE") return query.toString();
      if (misconceptionId === "RETURN_ROOT_INSTEAD_OF_POWER") return answerRoot.toString();
      return (answer + 1n).toString();
    });
    return finalize(input, {
      stem: L(language, `Which ${powerLabel(k, language)} is nearest to ${query}?`, `${query} के सबसे निकट कौन-सा ${powerLabel(k, language)} है?`, `${query} ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਕਿਹੜਾ ${powerLabel(k, language)} ਹੈ?`),
      options,
      canonicalAnswer: answer.toString(),
      hiddenState: { ...s, root: root.toString(), lower: lower.toString(), upper: upper.toString(), gap: gap.toString(), value: query.toString(), lowerDistance: lowerDistance.toString(), upperDistance: upperDistance.toString() },
    });
  }

  if (prototype === "NUM-CP012-PROT-012") {
    const k = num(s, "k");
    const factors = withBoostedExponents(pairs(s), k, input.seed + 7);
    const n = product(factors);
    const missing = factors
      .map(([prime, exponent]) => [prime, (k - exponent % k) % k] as const)
      .filter(([, exponent]) => exponent > 0);
    const multiplier = product(missing);
    const completed = n * multiplier;
    const completedRoot = floorRoot(completed, k);
    const options = remapOptions(input, (misconceptionId) => {
      if (misconceptionId === "CORRECT") return completed.toString();
      if (misconceptionId === "RETURN_MULTIPLIER_INSTEAD_OF_MULTIPLE") return multiplier.toString();
      if (misconceptionId === "RETURN_ROOT_INSTEAD_OF_MULTIPLE") return completedRoot.toString();
      if (misconceptionId === "KEEP_ORIGINAL_WITHOUT_COMPLETION") return n.toString();
      return (completed + 1n).toString();
    });
    return finalize(input, {
      stem: L(language, `What is the least multiple of ${n} that is a ${powerLabel(k, language)}?`, `${n} का सबसे छोटा गुणज कौन-सा है जो ${powerLabel(k, language)} हो?`, `${n} ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਗੁਣਜ ਕਿਹੜਾ ਹੈ ਜੋ ${powerLabel(k, language)} ਹੋਵੇ?`),
      options,
      canonicalAnswer: completed.toString(),
      hiddenState: { ...s, factors, value: n.toString(), multiplier: multiplier.toString(), canonicalValue: completed.toString() },
    });
  }

  // P013 terminal compatibility is intentionally residue-driven; increasing the
  // displayed magnitude would add noise without adding solve depth.
  if (prototype === "NUM-CP012-PROT-013") {
    return Object.freeze({
      ...input,
      sourceMathematicalFingerprint: input.mathematicalFingerprint,
      examDepthOverlay: Object.freeze({
        profile: NUM_CP012_EXAM_DEPTH_PROFILE,
        sourceMathematicalFingerprint: input.mathematicalFingerprint,
        mathematicalFingerprint: input.mathematicalFingerprint,
      }),
    });
  }

  throw new Error(`NUM-CP-012 exam-depth overlay does not support ${prototype}.`);
}
