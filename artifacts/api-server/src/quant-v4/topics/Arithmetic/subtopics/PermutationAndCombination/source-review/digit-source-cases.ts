import {countConstrainedDigits,type DigitConstraints} from './constrained-digits';
const decimal=Array.from({length:10},(_,i)=>i),range=(a:number,b:number)=>Array.from({length:b-a+1},(_,i)=>a+i);
export interface DigitSourceCase {id:string;input:DigitConstraints;stem:string;expected?:string;interpretation?:string}
const c=(id:string,stem:string,input:DigitConstraints,expected?:string,interpretation?:string):DigitSourceCase=>({id,stem,input,expected,interpretation});
const base=(digits:number[],minLength:number,maxLength=minLength,repetition=true):DigitConstraints=>({digits,minLength,maxLength,repetition});
export const digitSourceCases:DigitSourceCase[]=[
 c('I-001','How many three-digit integers use only 1, 2, 3, 4 and 5, without repeating a digit?',base(range(1,5),3,3,false),'60'),
 c('I-002','How many integers strictly between 2000 and 3000 use digits from 0 through 7 without repetition?',{...base(range(0,7),4,4,false),minimum:2001,maximum:2999},'210'),
 c('I-016','How many four-digit integers use only 0, 1, 2 and 3 without repeating a digit?',base(range(0,3),4,4,false),'18'),
 c('I-017','How many four-digit integers use only 0, 1, 2 and 3, with repetition allowed?',base(range(0,3),4),'192'),
 c('I-018','Using only 0, 1, 2 and 3 without repetition, how many integers are strictly between 200 and 1200?',{...base(range(0,3),3,4,false),minimum:201,maximum:1199},'14'),
 c('I-019','Using only 0, 1, 2 and 3 with repetition allowed, how many integers are strictly between 200 and 1200?',{...base(range(0,3),3,4),minimum:201,maximum:1199},undefined,'Strict endpoints; source key may use an inclusive endpoint.'),
 c('I-024','How many four-digit integers have only odd digits, with repetition allowed?',base([1,3,5,7,9],4),'625'),
 c('I-035','How many four-digit integers use only 0 through 5 without repetition? The first digit must be nonzero.',base(range(0,5),4,4,false),'300','Number interpretation; a fixed-width registration code allowing initial zero instead gives 360.'),
 c('I-036','How many codes of lengths one through five use digits 1 through 5 without repetition?',{...base(range(1,5),1,5,false),code:true},'325'),
 c('I-059','How many six-digit integers use each of 1 through 6 once and are divisible by their last digit, which is not 1?',{...base(range(1,6),6,6,false),divisibleByLast:true,excludeLast:[1]},'528'),
 c('I-075','A seven-digit telephone code starts with 635 or 674, ends in an odd digit and contains exactly one 9. Repetition of other digits is allowed. How many codes meet these conditions?',{...base(decimal,7),code:true,prefixes:['635','674'],exact:{digit:9,count:1},modulus:2,residue:1},'3402'),
 c('I-077','How many five-digit integers use only 1 through 6 without repetition and are divisible by 4?',{...base(range(1,6),5,5,false),modulus:4},'192'),
 c('I-078','How many positive integers below one million use only 0, 7 and 8, with repetition allowed?',{...base([0,7,8],1,6),maximum:999999},'728'),
 c('I-084','How many positive integers use only 1, 3, 5, 7 and 9 without repetition?',base([1,3,5,7,9],1,5,false),'325'),
 c('II-001','How many even four-digit integers use only 1 through 6, with repetition allowed?',{...base(range(1,6),4),modulus:2},'648'),
 c('II-005','How many nine-digit integers have no repeated digits?',base(decimal,9,9,false),'3265920'),
 c('II-019','How many positive integers of at most ten digits use only 0, 1, 2 and 3, with repetition allowed?',base(range(0,3),1,10),'1048575'),
 c('II-020','A four-ring lock has ten choices on every ring, from 0 to 9. Initial zero is allowed. How many possible codes must a worst-case exhaustive search test?',{...base(decimal,4),code:true},'10000'),
 c('II-022','A seven-digit telephone code has distinct digits, starts with 6 and ends with 5. Initial zero is irrelevant because the first digit is fixed. How many codes are possible?',{...base(decimal,7,7,false),code:true,fixed:{0:6,6:5}},'6720'),
 c('II-034','How many six-digit integers have either all odd digits or all even digits? Repetition is allowed.',{...base([1,3,5,7,9],6)},'15625','This component counts all-odd numbers; combine with 12500 all-even numbers for total 28125.'),
 c('II-035','How many six-digit integers contain at least one even digit? Repetition is allowed.',{...base(decimal,6),oddCount:undefined},'900000','Total component; subtract 15625 all-odd numbers for 884375.'),
 c('II-036','How many ten-digit integers have at least two equal digits?',base(decimal,10),'9000000000','Total component; subtract 3265920 distinct-digit integers for 8996734080.'),
 c('II-045','How many even six-digit integers use only 1 through 7 without repetition?',{...base(range(1,7),6,6,false),modulus:2},'2160'),
 c('II-046','How many six-digit integers use only 1 through 7 without repetition, with both their last and second-last digits even?',{...base(range(1,7),6,6,false),evenPositions:[4,5]},'720'),
 c('II-047','How many five-digit integers use only 1 through 9 without repetition?',base(range(1,9),5,5,false),'15120'),
 c('II-048','How many four-digit integers use only 1 through 8, with exactly one occurrence of 1 and repetition allowed for other digits?',{...base(range(1,8),4),exact:{digit:1,count:1}},'1372'),
 c('II-049','How many seven-digit integers use only 1, 2 and 3, with exactly two occurrences of 3 and repetition allowed for other digits?',{...base(range(1,3),7),exact:{digit:3,count:2}},'672'),
 c('II-050','How many four-digit integers use only 1 through 8 without repetition and contain 2?',{...base(range(1,8),4,4,false),exact:{digit:2,count:1}},'840'),
 c('III-006','How many positive integers of at least two digits have digits strictly increasing from left to right?',{...base(decimal,2,9,false),increasing:true},'502'),
 c('III-023','How many positive integers below 10000 use only 0, 1, 2, 3 and 5 without repetition?',base([0,1,2,3,5],1,4,false),'164'),
 c('III-026','How many four-digit integers use only 1 through 5 and are divisible by 4, with repetition allowed?',{...base(range(1,5),4),modulus:4},'125','Explicit repetition interpretation; without repetition gives 24.'),
 c('III-027','How many positive integers below 10000 have no repeated digit?',base(decimal,1,4,false),'5274'),
 c('III-028','How many four-digit integers contain at most two distinct digits?',{...base(decimal,4),distinct:{min:1,max:2}},'576'),
 c('III-029','How many seven-digit integers have an odd digit sum?',{...base(decimal,7),sumParity:1},'4500000'),
 c('III-030','How many six-digit integers contain exactly four distinct digits?',{...base(decimal,6),distinct:{min:4,max:4}},'294840'),
 c('III-031','How many integers with at least three digits, smaller than 200000000, use only 0, 1 and 2 and are divisible by 3? Repetition is allowed.',{...base(range(0,2),3,9),maximum:199999999,modulus:3},'4371'),
 c('III-034','How many positive integers smaller than 200000000 use only 1 and 2, with repetition allowed?',{...base([1,2],1,9),maximum:199999999},'766'),
 c('III-035','How many six-digit integers contain exactly three odd and three even digits? Repetition is allowed.',{...base(decimal,6),oddCount:3},'281250'),
 c('III-036','How many eight-digit integers have an even digit sum?',{...base(decimal,8),sumParity:0},'45000000'),
 c('III-040','How many eight-digit telephone codes end in an odd digit and contain exactly one 9? Initial zero and repetition of other digits are allowed.',{...base(decimal,8),code:true,exact:{digit:9,count:1},modulus:2,residue:1},'19663317'),
 c('III-041','How many eight-digit telephone codes end in an odd digit that occurs nowhere else, and contain exactly one 9? Initial zero and repetition of other digits are allowed.',{...base(decimal,8),code:true,exact:{digit:9,count:1},modulus:2,residue:1,lastUnique:true},'12123001'),
 c('III-042','How many positive integers not exceeding 4300 use only 0 through 4, with repetition allowed?',{...base(range(0,4),1,4),maximum:4300},'575'),
 c('III-043','How many positive integers strictly below 4300 use only 0 through 4 without repetition?',{...base(range(0,4),1,4,false),maximum:4299},'158'),
 c('III-044','How many positive integers use only 0 through 6 without repetition and are divisible by 10?',{...base(range(0,6),1,7,false),modulus:10},'1956'),
];
export function digitSourceAnswer(c:DigitSourceCase):bigint {
 let a=countConstrainedDigits(c.input);
 if(c.id==='II-034')a+=countConstrainedDigits({...c.input,digits:[0,2,4,6,8]});
 if(c.id==='II-035')a-=countConstrainedDigits({...c.input,digits:[1,3,5,7,9]});
 if(c.id==='II-036')a-=countConstrainedDigits({...c.input,repetition:false});
 return a;
}
