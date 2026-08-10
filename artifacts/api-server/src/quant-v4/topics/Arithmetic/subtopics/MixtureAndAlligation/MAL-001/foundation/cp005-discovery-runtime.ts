import { generateByPrototype } from "./cp005-discovery-generators";
import { verifyMalCp005Solution } from "./cp005-independent-verifier";
import type { MalCp005DiscoveryPrototypeId, MalCp005DiscoveryQuestion } from "./cp005-types";

export function generateMalCp005DiscoveryQuestion(prototypeId:MalCp005DiscoveryPrototypeId,seed=`mal-cp005-discovery:${prototypeId}:default`):MalCp005DiscoveryQuestion { return generateByPrototype(prototypeId,seed); }
export function malCp005DiscoveryStable(question:MalCp005DiscoveryQuestion):string { return JSON.stringify(question,(_key,value)=>typeof value==="bigint"?`${value}n`:value); }
export function verifyMalCp005DiscoveryQuestion(question:MalCp005DiscoveryQuestion):{ok:boolean;errors:string[]}{ return verifyMalCp005Solution(question.request,question.solution); }
