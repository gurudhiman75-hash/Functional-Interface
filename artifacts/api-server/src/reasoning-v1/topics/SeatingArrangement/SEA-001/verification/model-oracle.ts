export interface CanonicalModel {
  readonly canonicalKey: string;
}

export interface IndependentModelOracle<TInput, TModel extends CanonicalModel> {
  readonly productionName: string;
  readonly oracleName: string;
  enumerateProduction(input: TInput): readonly TModel[];
  enumerateOracle(input: TInput): readonly TModel[];
}

export interface ModelOracleAgreement {
  readonly productionName: string;
  readonly oracleName: string;
  readonly productionKeys: readonly string[];
  readonly oracleKeys: readonly string[];
  readonly passed: boolean;
}

function sortedUniqueKeys<TModel extends CanonicalModel>(models: readonly TModel[]): readonly string[] {
  return [...new Set(models.map((model) => model.canonicalKey))].sort((left, right) => left.localeCompare(right));
}

export function verifyIndependentModelOracle<TInput, TModel extends CanonicalModel>(
  adapter: IndependentModelOracle<TInput, TModel>,
  input: TInput,
): ModelOracleAgreement {
  const productionKeys = sortedUniqueKeys(adapter.enumerateProduction(input));
  const oracleKeys = sortedUniqueKeys(adapter.enumerateOracle(input));
  return {
    productionName: adapter.productionName,
    oracleName: adapter.oracleName,
    productionKeys,
    oracleKeys,
    passed: JSON.stringify(productionKeys) === JSON.stringify(oracleKeys),
  };
}

export function assertIndependentModelOracleAgreement(agreement: ModelOracleAgreement): void {
  if (!agreement.passed) {
    throw new Error(
      `${agreement.productionName}/${agreement.oracleName} disagreement: production=${agreement.productionKeys.join(",")} oracle=${agreement.oracleKeys.join(",")}`,
    );
  }
}
