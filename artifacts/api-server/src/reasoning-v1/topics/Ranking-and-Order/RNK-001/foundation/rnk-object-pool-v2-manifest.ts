import { createHash } from "node:crypto";

import {
  RNK_DOMAIN_LEXICON_V2,
  RNK_GROUP_OBJECTS_V2,
  RNK_PERSON_POOL_V2,
  RNK_SETTING_OBJECTS_V2,
} from "./rnk-object-pool-v2";
import { RNK_RELATION_TEMPLATES_V2 } from "./rnk-presentation-object-pool-v2";
import {
  RNK_DERIVED_OPERATION_SURFACES_V2,
  RNK_DERIVED_QUANTITY_DOMAINS_V2,
  RNK_PARTITION_SCHEMES_V2,
  RNK_SYMBOLIC_OBJECT_POOL_V2,
} from "./rnk-derived-object-pool-v2";
import { RNK_DERIVED_OPERATION_REQUIRED_VARIABLES } from "./rnk-derived-operation-render-v2";

export const RNK_OBJECT_POOL_V2_MANIFEST_VERSION = "RNK_OBJECT_POOL_V2_MANIFEST_V1" as const;
export const RNK_OBJECT_POOL_V2_EXPECTED_SHA256 = "UNPINNED" as const;

function sha256(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value), "utf8").digest("hex");
}

export function rnkObjectPoolV2ManifestRecord(): unknown {
  return {
    manifestVersion: RNK_OBJECT_POOL_V2_MANIFEST_VERSION,
    people: RNK_PERSON_POOL_V2,
    groups: RNK_GROUP_OBJECTS_V2,
    settings: RNK_SETTING_OBJECTS_V2,
    domainLexicon: RNK_DOMAIN_LEXICON_V2,
    relationTemplates: RNK_RELATION_TEMPLATES_V2,
    symbolicObjects: RNK_SYMBOLIC_OBJECT_POOL_V2,
    derivedQuantityDomains: RNK_DERIVED_QUANTITY_DOMAINS_V2,
    partitionSchemes: RNK_PARTITION_SCHEMES_V2,
    derivedOperationSurfaces: RNK_DERIVED_OPERATION_SURFACES_V2,
    requiredOperationVariables: RNK_DERIVED_OPERATION_REQUIRED_VARIABLES,
  };
}

export function rnkObjectPoolV2ManifestSha256(): string {
  return sha256(rnkObjectPoolV2ManifestRecord());
}
