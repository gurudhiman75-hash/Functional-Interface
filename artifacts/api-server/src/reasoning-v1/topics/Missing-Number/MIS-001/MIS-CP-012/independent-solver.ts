export interface MisCp012GenericGroup{readonly values:readonly number[];readonly result:number;}
export function evaluateMisCp012Rule(rule:string,values:readonly number[]):number|null{
 let v:number;
 switch(rule){
  case'SUM':if(values.length!==2)return null;v=values[0]!+values[1]!;break;
  case'PRODUCT':if(values.length!==2)return null;v=values[0]!*values[1]!;break;
  case'SQUARE_FIRST_PLUS_SECOND':if(values.length!==2)return null;v=values[0]!*values[0]!+values[1]!;break;
  case'ROW_PRODUCTS_SUM':if(values.length!==4)return null;v=values[0]!*values[1]!+values[2]!*values[3]!;break;
  case'COLUMN_PRODUCTS_SUM':if(values.length!==4)return null;v=values[0]!*values[2]!+values[1]!*values[3]!;break;
  case'DIAGONAL_PRODUCTS_SUM':if(values.length!==4)return null;v=values[0]!*values[3]!+values[1]!*values[2]!;break;
  case'PAIR_PRODUCT_MINUS_THIRD_SQUARE':if(values.length!==3)return null;v=values[0]!*values[1]!-values[2]!*values[2]!;break;
  case'FIRST_SQUARE_PLUS_PAIR_PRODUCT':if(values.length!==3)return null;v=values[0]!*values[0]!+values[1]!*values[2]!;break;
  default:return null;
 }
 return Number.isInteger(v)&&v>0&&v<=999?v:null;
}
export function ruleFitsMisCp012(rule:string,g:MisCp012GenericGroup){return evaluateMisCp012Rule(rule,g.values)===g.result;}
export function survivingMisCp012Rules(rules:readonly string[],evidence:readonly MisCp012GenericGroup[]){return rules.filter(r=>evidence.every(g=>ruleFitsMisCp012(r,g)));}
