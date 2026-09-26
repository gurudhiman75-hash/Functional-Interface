/** @deprecated DI-004 V2 is human-approved. Use permanent-ql-registry for authoritative ownership. */
export {
  DI004_PERMANENT_OWNERSHIP as DI004_V2_REVIEW_OWNERSHIP,
  DI004_PERMANENT_QLS as DI004_V2_REVIEW_QLS,
  DI004_PERMANENT_RELEASE_ID as DI004_V2_REVIEW_RELEASE_ID,
  getDi004PermanentQl as getDi004V2ReviewQl,
} from "./permanent-ql-registry";

export type {
  Di004PermanentQlDescriptor as Di004V2ReviewQlDescriptor,
  Di004PermanentQlId as Di004V2ReviewQlId,
} from "./permanent-ql-registry";
