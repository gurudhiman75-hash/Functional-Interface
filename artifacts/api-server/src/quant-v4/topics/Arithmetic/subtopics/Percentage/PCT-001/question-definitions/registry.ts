import { Q001 } from "./Q001/definition";
import { Q002 } from "./Q002/definition";
import { Q003 } from "./Q003/definition";
import { Q004 } from "./Q004/definition";
import { Q005 } from "./Q005/definition";
import { Q006 } from "./Q006/definition";
import { Q007 } from "./Q007/definition";
import { Q008 } from "./Q008/definition";
import { Q009 } from "./Q009/definition";
import { Q010 } from "./Q010/definition";
import { Q011 } from "./Q011/definition";
import { Q012 } from "./Q012/definition";
import { Q013 } from "./Q013/definition";
import { Q014 } from "./Q014/definition";
import { Q015 } from "./Q015/definition";
import { Q016 } from "./Q016/definition";
import { Q017 } from "./Q017/definition";
import { Q018 } from "./Q018/definition";
import { Q019 } from "./Q019/definition";
import { Q020 } from "./Q020/definition";
import type {
  Pct001QuestionDefinition,
  Pct001QuestionDefinitionId,
} from "./types";

export const PCT_001_QUESTION_DEFINITIONS = [
  Q001, Q002, Q003, Q004, Q005,
  Q006, Q007, Q008, Q009, Q010,
  Q011, Q012, Q013, Q014, Q015,
  Q016, Q017, Q018, Q019, Q020,
] as const satisfies readonly Pct001QuestionDefinition[];

const BY_ID = new Map(
  PCT_001_QUESTION_DEFINITIONS.map((definition) => [
    definition.definitionId,
    definition,
  ]),
);

export function getPct001QuestionDefinition(
  definitionId: Pct001QuestionDefinitionId,
): Pct001QuestionDefinition {
  const definition = BY_ID.get(definitionId);
  if (!definition) {
    throw new Error(`Unknown PCT-001 question definition: ${definitionId}`);
  }
  return definition;
}

