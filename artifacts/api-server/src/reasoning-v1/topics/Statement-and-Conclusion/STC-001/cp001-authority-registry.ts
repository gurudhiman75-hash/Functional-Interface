import { STC_CP001_AUTHORITIES } from "./cp001-authorities.ts";
import { STC_CP001_COVERAGE_AUTHORITIES } from "./cp001-coverage-authorities.ts";

export const STC_CP001_ALL_AUTHORITIES = [
  ...STC_CP001_AUTHORITIES,
  ...STC_CP001_COVERAGE_AUTHORITIES,
] as const;
