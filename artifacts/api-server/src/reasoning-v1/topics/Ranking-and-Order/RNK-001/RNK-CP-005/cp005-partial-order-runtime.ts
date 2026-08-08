import {
  buildRnkCp005PartialOrderState,
  enumerateRnkCp005ValidOrders,
  generateRnkCp005DiscoveryQuestion as generateUnnormalizedQuestion,
  RNK_CP005_PARTIAL_ORDER_DISCOVERY_VERSION,
  RNK_CP005_PROTOTYPE_IDS,
  type RnkCp005DiscoveryQuestion,
  type RnkCp005PrototypeId,
} from "./cp005-partial-order-discovery";

export {
  buildRnkCp005PartialOrderState,
  enumerateRnkCp005ValidOrders,
  RNK_CP005_PARTIAL_ORDER_DISCOVERY_VERSION,
  RNK_CP005_PROTOTYPE_IDS,
};

export type {
  RnkCp005Context,
  RnkCp005Difficulty,
  RnkCp005DiscoveryQuestion,
  RnkCp005Edge,
  RnkCp005FixedRank,
  RnkCp005Option,
  RnkCp005PartialOrderState,
  RnkCp005PrototypeId,
} from "./cp005-partial-order-discovery";

export function generateRnkCp005DiscoveryQuestion(
  prototypeId: RnkCp005PrototypeId,
  seed: number,
): RnkCp005DiscoveryQuestion {
  const question = generateUnnormalizedQuestion(prototypeId, seed);
  const trueIndexes = question.options
    .map((option, index) => (option.truth ? index : -1))
    .filter((index) => index >= 0);
  if (trueIndexes.length !== 1) {
    throw new Error(`${question.discoveryId} has ${trueIndexes.length} true options`);
  }

  const options = [...question.options];
  const [correctOption] = options.splice(trueIndexes[0]!, 1);
  const desiredIndex = seed % 4;
  options.splice(desiredIndex, 0, correctOption!);

  return {
    ...question,
    options,
    correctIndex: desiredIndex,
  };
}

export function buildRnkCp005DiscoveryCorpus(
  seedsPerPrototype = 32,
): readonly RnkCp005DiscoveryQuestion[] {
  return RNK_CP005_PROTOTYPE_IDS.flatMap((prototypeId, prototypeIndex) =>
    Array.from({ length: seedsPerPrototype }, (_, seedIndex) =>
      generateRnkCp005DiscoveryQuestion(prototypeId, prototypeIndex * 10_000 + seedIndex),
    ),
  );
}

void RNK_CP005_PARTIAL_ORDER_DISCOVERY_VERSION;
void buildRnkCp005PartialOrderState;
void enumerateRnkCp005ValidOrders;
