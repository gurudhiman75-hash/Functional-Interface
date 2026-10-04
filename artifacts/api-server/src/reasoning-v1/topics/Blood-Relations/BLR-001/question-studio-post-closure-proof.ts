export const BLR_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY =
  "BLR_001_FROZEN_SOURCE_TO_STANDARD_MAPPING_PROOF_2026_10_04" as const;

function texts(value: unknown): string[] {
  return Array.isArray(value) ? value.map((entry) =>
    typeof entry === "string" ? entry : String((entry as any)?.text ?? "")
  ) : [];
}

export function assertBlrFrozenSourceAnswerIntegrity(
  source: Readonly<Record<string, any>>,
): void {
  const options = texts(source.options);
  const correctIndex = Number(source.correctIndex ?? source.correct);
  if (options.length !== 4) {
    throw new Error(`${source.questionId ?? source.qlId ?? "BLR"}: expected four frozen learner options`);
  }
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
    throw new Error(`${source.questionId ?? source.qlId ?? "BLR"}: invalid frozen correct index`);
  }
  if (new Set(options).size !== options.length) {
    throw new Error(`${source.questionId ?? source.qlId ?? "BLR"}: duplicate frozen learner option text`);
  }

  const details = Array.isArray(source.optionDetails) ? source.optionDetails : [];
  if (details.length === options.length) {
    const semanticCorrect = details.flatMap((entry: any, index: number) =>
      entry?.isCorrect === true ? [index] : [],
    );
    if (semanticCorrect.length !== 1 || semanticCorrect[0] !== correctIndex) {
      throw new Error(`${source.questionId ?? source.qlId ?? "BLR"}: frozen option proof disagrees with correct index`);
    }
    for (let index = 0; index < options.length; index += 1) {
      if (String(details[index]?.text ?? "") !== options[index]) {
        throw new Error(`${source.questionId ?? source.qlId ?? "BLR"}: frozen option text/order drifted from option proof`);
      }
    }
  }

  if (source.validation && source.validation.valid !== true) {
    throw new Error(`${source.questionId ?? source.qlId ?? "BLR"}: source validation is not green`);
  }
}

export function assertBlrStandardMappingIntegrity(
  source: Readonly<Record<string, any>>,
  mapped: Readonly<Record<string, any>>,
): void {
  assertBlrFrozenSourceAnswerIntegrity(source);
  const sourceOptions = texts(source.options);
  const mappedOptions = texts(mapped.options);
  const sourceIndex = Number(source.correctIndex ?? source.correct);
  if (JSON.stringify(sourceOptions) !== JSON.stringify(mappedOptions)) {
    throw new Error(`${source.questionId ?? source.qlId ?? "BLR"}: standard adapter changed option order/content`);
  }
  if (Number(mapped.correctIndex) !== sourceIndex || Number(mapped.correct) !== sourceIndex) {
    throw new Error(`${source.questionId ?? source.qlId ?? "BLR"}: standard adapter changed the correct index`);
  }
  if (String(mapped.answer ?? "") !== String(source.answer ?? source.canonicalAnswer ?? "")) {
    throw new Error(`${source.questionId ?? source.qlId ?? "BLR"}: standard adapter changed the answer`);
  }
  if (mapped.questionBankWritable !== false || mapped.testEligible !== false
    || mapped.mockTestEligible !== false || mapped.publiclyPublishable !== false
    || mapped.automaticStudentPublication !== false || mapped.reviewOnly !== true) {
    throw new Error(`${source.questionId ?? source.qlId ?? "BLR"}: standard adapter weakened the review-only lifecycle`);
  }
}
