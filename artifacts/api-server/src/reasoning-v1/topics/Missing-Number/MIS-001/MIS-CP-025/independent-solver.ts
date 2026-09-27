export interface MisCp025Group{
 readonly leftInput:number;
 readonly shared:number;
 readonly rightInput:number;
 readonly leftProduct:number;
 readonly rightProduct:number;
}

export function independentlyBuildMisCp025Group(leftInput:number,shared:number,rightInput:number):MisCp025Group{
 return{
  leftInput,shared,rightInput,
  leftProduct:leftInput*shared,
  rightProduct:shared*rightInput,
 };
}

export function independentlyVerifyMisCp025Group(group:MisCp025Group):boolean{
 return group.leftProduct===group.leftInput*group.shared
  && group.rightProduct===group.shared*group.rightInput;
}

export function independentlySolveMisCp025RightProduct(group:Omit<MisCp025Group,'rightProduct'>):number{
 return group.shared*group.rightInput;
}
