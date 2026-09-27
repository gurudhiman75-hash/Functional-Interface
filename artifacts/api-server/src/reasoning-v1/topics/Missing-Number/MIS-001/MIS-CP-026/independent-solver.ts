export interface MisCp026Pair{readonly input:number;readonly output:number;}
export function independentlyEvaluateMisCp026(input:number):number|null{
 if(!Number.isInteger(input)||input<1||input>31)return null;
 return input*input;
}
export function independentlyVerifyMisCp026Pair(pair:MisCp026Pair):boolean{
 return independentlyEvaluateMisCp026(pair.input)===pair.output;
}
