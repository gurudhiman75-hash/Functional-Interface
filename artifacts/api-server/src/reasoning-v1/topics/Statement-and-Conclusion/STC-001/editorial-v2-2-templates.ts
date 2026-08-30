import { STC_V22_QL001_TEMPLATES } from "./editorial-v2-2-ql001-templates.ts";
import { STC_V22_QL002_TEMPLATES } from "./editorial-v2-2-ql002-templates.ts";
import { STC_V22_QL003_TEMPLATES } from "./editorial-v2-2-ql003-templates.ts";
import { STC_V22_QL004_TEMPLATES } from "./editorial-v2-2-ql004-templates.ts";
import { STC_V22_QL005_TEMPLATES } from "./editorial-v2-2-ql005-templates.ts";
import { STC_V22_QL006_TEMPLATES } from "./editorial-v2-2-ql006-templates.ts";
import type { StcQlId } from "./types.ts";
import type { StcV22Template } from "./editorial-v2-2-saturation-types.ts";

export const STC_V22_TEMPLATES: readonly StcV22Template[] = [
  ...STC_V22_QL001_TEMPLATES,
  ...STC_V22_QL002_TEMPLATES,
  ...STC_V22_QL003_TEMPLATES,
  ...STC_V22_QL004_TEMPLATES,
  ...STC_V22_QL005_TEMPLATES,
  ...STC_V22_QL006_TEMPLATES,
] as const;

export const STC_V22_TEMPLATES_BY_QL: Readonly<Record<StcQlId, readonly StcV22Template[]>> = Object.freeze({
  "STC-QL-001": STC_V22_QL001_TEMPLATES,
  "STC-QL-002": STC_V22_QL002_TEMPLATES,
  "STC-QL-003": STC_V22_QL003_TEMPLATES,
  "STC-QL-004": STC_V22_QL004_TEMPLATES,
  "STC-QL-005": STC_V22_QL005_TEMPLATES,
  "STC-QL-006": STC_V22_QL006_TEMPLATES,
});

export {
  STC_V22_QL001_TEMPLATES,
  STC_V22_QL002_TEMPLATES,
  STC_V22_QL003_TEMPLATES,
  STC_V22_QL004_TEMPLATES,
  STC_V22_QL005_TEMPLATES,
  STC_V22_QL006_TEMPLATES,
};
