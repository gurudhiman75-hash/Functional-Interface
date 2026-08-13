import { MEN_CP_010_PROTOTYPES } from "./registry";
import { generateMenCp010Question } from "./runtime";
import type { MenCp010Question } from "./types";
export function buildMenCp010ReviewBatch(){const out:MenCp010Question[]=[],used=new Set<string>();for(const def of MEN_CP_010_PROTOTYPES)for(let pos=0;pos<4;pos++){let selected:MenCp010Question|null=null;for(let n=0;n<200;n++){const q=generateMenCp010Question(def.prototypeId,`review:${pos}:${String(n).padStart(3,"0")}`);if(q.correctIndex===pos&&!used.has(q.stem)){selected=q;break;}}if(!selected)throw new Error(`Cannot build balanced review for ${def.prototypeId}/${pos}`);used.add(selected.stem);out.push(selected);}return out;}
