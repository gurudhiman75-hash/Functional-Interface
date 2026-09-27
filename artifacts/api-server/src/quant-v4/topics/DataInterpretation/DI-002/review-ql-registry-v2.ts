/** @deprecated DI-002 V2 is human-approved. Use permanent-ql-registry for authoritative ownership. */
export {
  DI002_PERMANENT_OWNERSHIP as DI002_V2_REVIEW_OWNERSHIP,
  DI002_PERMANENT_QLS as DI002_V2_REVIEW_QLS,
  DI002_PERMANENT_RELEASE_ID as DI002_V2_REVIEW_RELEASE_ID,
  getDi002PermanentQl as getDi002V2ReviewQl,
} from "./permanent-ql-registry";

export type {
  Di002PermanentQlDescriptor as Di002V2ReviewQlDescriptor,
  Di002PermanentQlId as Di002V2ReviewQlId,
} from "./permanent-ql-registry";
