import { TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q } from "./english-approved-freeze-v13";

console.log(JSON.stringify(TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2));
