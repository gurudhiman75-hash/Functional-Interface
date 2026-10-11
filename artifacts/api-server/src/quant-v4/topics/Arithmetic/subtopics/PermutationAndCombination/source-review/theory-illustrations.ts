import {choose,factorial,countComposition,squares,rectangles} from './extended-counting';
import {distinctSubsetSums} from './worked-source-cases';
export function primeExponentInFactorial(n:number,p:number):number {
 if(!Number.isInteger(n)||n<0||!Number.isInteger(p)||p<2||p>10000||Array.from({length:Math.max(0,Math.floor(Math.sqrt(p))-1)},(_,i)=>i+2).some(d=>p%d===0))throw Error('Nonnegative factorial argument and prime required');
 let total=0;for(let q=Math.floor(n/p);q>0;q=Math.floor(q/p))total+=q;return total;
}
export const theoryIllustrations=[
 {id:'THEORY-001',pdfPage:813,description:'Unordered selection of two of three people',answer:String(choose(3,2))},
 {id:'THEORY-002',pdfPage:814,description:'Two distinct offices from three people',answer:String(3*2)},
 {id:'THEORY-003',pdfPage:814,description:'Three-digit numbers from five nonzero digits, no repetition',answer:String(5*4*3)},
 {id:'THEORY-004',pdfPage:814,description:'ALLAHABAD repeated-letter arrangements',answer:String(factorial(9)/factorial(4)/factorial(2))},
 {id:'THEORY-005',pdfPage:814,description:'Four distinguishable rings on three named fingers; order ignored',answer:String(3**4)},
 {id:'THEORY-006',pdfPage:814,description:'Select five of one hundred identical marbles',answer:'1'},
 {id:'THEORY-007',pdfPage:814,description:'Twenty-seven identical marbles to four named people, empty permitted',answer:String(choose(30,3))},
 {id:'THEORY-008',pdfPage:815,description:'Distinct monomials of (a+b+c)^2 after collecting like terms',answer:String(choose(4,2))},
 {id:'THEORY-009',pdfPage:815,description:'Trailing decimal zeroes of 1000!',answer:String(primeExponentInFactorial(1000,5))},
 {id:'THEORY-010',pdfPage:815,description:'Exponent of prime 3 in 24!',answer:String(primeExponentInFactorial(24,3))},
 {id:'THEORY-011',pdfPage:816,description:'Axis-aligned squares in a 3×3 grid',answer:String(squares(3,3))},
 {id:'THEORY-012',pdfPage:816,description:'Axis-aligned rectangles in a 3×3 grid',answer:String(rectangles(3,3))},
 {id:'TASK-001',pdfPage:817,description:'Three specified letters together among seven distinct letters',answer:String(factorial(5)*factorial(3))},
 {id:'TASK-002',pdfPage:817,description:'Specified pair never together among seven distinct letters',answer:String(factorial(7)-2n*factorial(6))},
 {id:'TASK-003',pdfPage:817,description:'BEGINS with B and S at endpoints, either orientation',answer:String(2n*factorial(4))},
 {id:'TASK-004',pdfPage:818,description:'Distinct positive sums of coin values 500,100,50,25,10,3,2,1',answer:String(distinctSubsetSums([500,100,50,25,10,3,2,1]))},
];
export const theoryCorrections=[
 {pdfPage:815,reference:'Important result 18',correction:'Zero-or-more mixed selection count is (p+1)(q+1)2^r. For a nonempty selection subtract one from the entire product, not from only the distinct-object factor.'},
 {pdfPage:815,reference:'Prime exponent corollary',correction:'Use Σ floor(n/p^j), not floor(n!/p^j).'},
 {pdfPage:813,reference:'Factorial domain',correction:'Elementary factorial is defined for nonnegative integers, including zero.'},
];
