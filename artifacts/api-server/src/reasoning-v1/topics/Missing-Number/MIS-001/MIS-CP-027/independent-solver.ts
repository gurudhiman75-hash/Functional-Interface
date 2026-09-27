export interface MisCp027Group{readonly first:number;readonly second:number;readonly result:number;}
export function independentlyEvaluateMisCp027(first:number,second:number):number|null{
 const v=first*first*first+second*second*second;
 return Number.isInteger(v)&&v>0&&v<=999?v:null;
}
export function independentlyVerifyMisCp027Group(g:MisCp027Group):boolean{
 return independentlyEvaluateMisCp027(g.first,g.second)===g.result;
}
