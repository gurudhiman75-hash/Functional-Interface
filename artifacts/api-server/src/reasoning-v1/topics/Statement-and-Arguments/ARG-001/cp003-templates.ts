import { ARG_CP003_QL001_TEMPLATES } from "./cp003-ql001-templates.ts";
import { ARG_CP003_QL002_TEMPLATES } from "./cp003-ql002-templates.ts";
import { ARG_CP003_QL003_TEMPLATES } from "./cp003-ql003-templates.ts";
import { ARG_CP003_QL004_TEMPLATES } from "./cp003-ql004-templates.ts";
import { ARG_CP003_QL005_TEMPLATES } from "./cp003-ql005-templates.ts";
import { ARG_CP003_QL006_TEMPLATES } from "./cp003-ql006-templates.ts";
import type { ArgCp003Template } from "./cp003-saturation-types.ts";
import type { ArgQlId } from "./types.ts";

export const ARG_CP003_TEMPLATES_BY_QL: Readonly<Record<ArgQlId, readonly ArgCp003Template[]>> = Object.freeze({
  "ARG-QL-001": ARG_CP003_QL001_TEMPLATES,
  "ARG-QL-002": ARG_CP003_QL002_TEMPLATES,
  "ARG-QL-003": ARG_CP003_QL003_TEMPLATES,
  "ARG-QL-004": ARG_CP003_QL004_TEMPLATES,
  "ARG-QL-005": ARG_CP003_QL005_TEMPLATES,
  "ARG-QL-006": ARG_CP003_QL006_TEMPLATES,
});
