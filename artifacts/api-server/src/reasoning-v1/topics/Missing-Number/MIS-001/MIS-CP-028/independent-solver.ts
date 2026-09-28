export interface MisCp028Group{
 readonly inputs:readonly[number,number,number];
 readonly result:number;
}

function exactRoot(value:number):number|null{
 const root=Math.round(Math.sqrt(value));
 return root*root===value?root:null;
}

export function independentlyEvaluateMisCp028(inputs:readonly number[]):number|null{
 if(inputs.length!==3)return null;
 const a=exactRoot(inputs[0]!),b=exactRoot(inputs[1]!),c=exactRoot(inputs[2]!);
 if(a==null||b==null||c==null)return null;
 const result=a-b+c;
 return Number.isInteger(result)&&result>0&&result<=999?result:null;
}

export function independentlyVerifyMisCp028Group(group:MisCp028Group):boolean{
 return independentlyEvaluateMisCp028(group.inputs)===group.result;
}
