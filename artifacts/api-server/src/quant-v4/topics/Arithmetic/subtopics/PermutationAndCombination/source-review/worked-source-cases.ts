import {factorial as F,choose as C,permute as P,countMultiset,countComposition,lexicographicRank,squares} from './extended-counting';
import {countConstrainedDigits} from './constrained-digits';
import type {ExtendedSourceCase} from './extended-source-cases';
export const workedSourceCases:ExtendedSourceCase[]=[];
const add=(i:number,stem:string,answer:bigint|number|string,working:string,assumptions?:string)=>workedSourceCases.push({id:`WORKED-${String(i).padStart(3,'0')}`,stem,answer:String(answer),working,assumptions});
export function distinctSubsetSums(values:number[]):number {let sums=new Set([0]);for(const v of values)sums=new Set([...sums,...[...sums].map(s=>s+v)]);sums.delete(0);return sums.size;}
export function noncollinearGridTriples(rows:number,columns:number):bigint {
 const points=Array.from({length:rows*columns},(_,i)=>[i%columns,Math.floor(i/columns)]);let count=0n;
 for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)for(let k=j+1;k<points.length;k++){const [a,b,c]=[points[i],points[j],points[k]];if((b[0]-a[0])*(c[1]-a[1])!==(c[0]-a[0])*(b[1]-a[1]))count++;}return count;
}
/** Integer coordinates doubled to include diagonal intersections exactly. */
export function drawnTrianglesInCrossedSquares(cells:number):number {
 type Point=[number,number];type Segment=[Point,Point];
 const segments:Segment[]=[[[0,0],[2*cells,0]],[[0,2],[2*cells,2]]];for(let i=0;i<=cells;i++)segments.push([[2*i,0],[2*i,2]]);
 for(let i=0;i<cells;i++)segments.push([[2*i,0],[2*i+2,2]],[[2*i,2],[2*i+2,0]]);
 const points:Point[]=[];for(let i=0;i<=cells;i++)points.push([2*i,0],[2*i,2]);for(let i=0;i<cells;i++)points.push([2*i+1,1]);
 const on=(p:Point,s:Segment)=>{const [a,b]=s;return (p[0]-a[0])*(b[1]-a[1])===(p[1]-a[1])*(b[0]-a[0])&&p[0]>=Math.min(a[0],b[0])&&p[0]<=Math.max(a[0],b[0])&&p[1]>=Math.min(a[1],b[1])&&p[1]<=Math.max(a[1],b[1]);};
 const connected=(a:Point,b:Point)=>segments.some(s=>on(a,s)&&on(b,s));let result=0;
 for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)for(let k=j+1;k<points.length;k++){const [a,b,c]=[points[i],points[j],points[k]];if((b[0]-a[0])*(c[1]-a[1])===(c[0]-a[0])*(b[1]-a[1]))continue;if(connected(a,b)&&connected(a,c)&&connected(b,c))result++;}return result;
}
add(1,'Choose and order four of six distinct objects. How many orders are possible?',P(6,4),'P(6,4)=6×5×4×3=360.');
add(2,'How many three-digit integers use digits 1 through 5 without repetition?',P(5,3),'5×4×3=60.','No repetition stated explicitly.');
add(3,'Seven distinct letters include P and Q. How many lineups keep P and Q adjacent?',2n*F(6),'Treat the pair as a block: 6!×2!=1440.');
add(4,'How many arrangements of BEGINS begin with B and end with S?',F(4),'Fix endpoints; permute E,G,I,N: 4!=24.');
add(5,'How many arrangements of VALEDICTORY have all four vowels consecutive?',F(8)*F(4),'Treat AEIO as a block among seven consonants: 8!×4!=967680.');
add(6,'Five labelled boxes each receive one hat, red or blue. Each colour is available in sufficient quantity and hats of one colour are identical. How many patterns are possible?',2n**5n,'Two independent choices per box: 2^5=32.');
add(7,'Four distinct people of each of two groups sit alternately around a circle. Rotations are equivalent and reflections distinct. How many arrangements are possible?',F(3)*F(4),'Arrange the first group in 3! ways, the other group in four gaps in 4! ways. Total 144.');
add(8,'Arrange digits 1,2,3,0,4,2,3 once each to form an integer greater than one million. How many integers are possible?',countMultiset({symbols:['0','1','2','3','4'],counts:[1,1,2,2,1],nonzeroFirst:true}),'All multiset orders: 7!/(2!2!)=1260. Leading-zero orders: 6!/(2!2!)=180. Difference 1080.');
add(9,'Choose eleven players from sixteen distinct players. How many teams are possible?',C(16,11),'C(16,11)=4368.');
add(10,'Arrange eighteen identical white and sixteen identical black balls in a row, with no adjacent black balls. How many patterns are possible?',C(19,16),'White balls create nineteen gaps; choose sixteen for black balls: C(19,16)=969.');
add(11,'Choose three of seven distinct children. How many different groups are possible?',C(7,3),'C(7,3)=35.');
add(12,'Choose three of seven distinct children, including one specified child. How many groups are possible?',C(6,2),'Fix the child; choose two of the other six: C(6,2)=15.');
add(13,'One coin of each value 500,100,50,25,10,1 is available. How many different positive sums can subsets form?',distinctSubsetSums([500,100,50,25,10,1]),'Each denomination exceeds the sum of all smaller denominations, so subset sums are unique. There are 2^6−1=63 positive sums.');
add(14,'Five intermediate boarding stations precede a terminal. Tickets specify a boarding point and a later destination. Choose three distinct ticket types as an unordered set. How many sets are possible?',C(15,3),'5+4+3+2+1=15 ticket types; C(15,3)=455.');
add(15,'For a convex decagon, give the number of diagonals followed by the number of vertex triangles.','35; 120','Diagonals C(10,2)−10=35. Triangles C(10,3)=120.');
add(16,'Eighteen points have one collinear block of five and no other collinear triples. How many lines are determined?',C(18,2)-C(5,2)+1n,'C(18,2)−C(5,2)+1=153−10+1=144.');
add(17,'Eighteen points have one collinear block of five and no other collinear triples. How many triangles are determined?',C(18,3)-C(5,3),'C(18,3)−C(5,3)=816−10=806.');
add(18,'Ten labelled true-false questions are all answered. How many complete answer sequences are possible?',2n**10n,'Two choices independently at ten positions: 2^10=1024.');
add(19,'Ten people each shake hands once with every other person. How many handshakes occur?',C(10,2),'C(10,2)=45.');
add(20,'Four distinct children queue with two specified children adjacent. How many orders are possible?',2n*F(3),'Three objects after forming a block, with two block orientations: 3!×2=12.');
add(21,'Eleven people undergo one comparison for every unordered pair. How many comparisons occur?',C(11,2),'C(11,2)=55.');
add(22,'Notes of values 1,2,5,10 are available once each. How many different positive subset sums are possible?',distinctSubsetSums([1,2,5,10]),'Each denomination exceeds the sum of smaller ones. All 2^4−1=15 nonempty subset sums are different.');
add(23,'Four coins have different unspecified positive denominations. Is the number of different nonempty subset sums fixed?','Cannot be determined','Values 1,2,5,10 give 15 sums, whereas 1,2,3,4 give only ten sums because different subsets can have equal totals.','Different denominations alone do not ensure different subset sums.');
add(24,'How many three-digit integers have strictly increasing digits chosen from 1 through 9?',C(9,3),'Every three-digit subset has exactly one increasing order: C(9,3)=84.');
add(25,'A tournament has m boys and n girls, m>n>1, and one game per pair. There are 221 mixed-gender games. Give the participant count and girl-girl game count.','30; 78','mn=221=17×13. The domain excludes 221×1. Thus m=17,n=13: total 30, girl pairs C(13,2)=78.');
add(26,'Choose five occupied cells in a 3×3 grid, with at least one occupied cell in every row. How many patterns are possible?',C(9,5)-3n*C(6,5),'Total C(9,5)=126; subtract three choices of an empty row, each C(6,5)=6. Two empty rows cannot fit five cells. Answer 108.');
add(27,'Six distinct letters are randomly bijected to their envelopes. What is the probability that exactly five are correct?',0,'Five correct placements force the sixth to be correct. The event is impossible, so its probability is zero.');
add(28,'Arrange two identical balls of each of three colours in six consecutive cells, with no equal adjacent colours. How many patterns are possible?',countMultiset({symbols:['R','B','W'],counts:[2,2,2],noEqualAdjacent:true}),'Inclusion–exclusion on the three equal-colour adjacency events: 6!/(2!)³−3×5!/(2!)²+3×4!/2!−3!=90−90+36−6=30.','The printed worked solution says 24, but independent multiset enumeration gives 30.');
add(29,'Three unit squares sit side by side in one strip. Both diagonals are drawn in each square. Including triangles larger than one square, how many triangles have all three sides on drawn segments?',drawnTrianglesInCrossedSquares(3),'Each square contributes eight triangles. Each adjacent square pair contributes two more. Total 3×8+2×2=28.');
add(30,'Choose three of six distinct students, including a specified student. How many groups are possible?',C(5,2),'Fix the student; C(5,2)=10.');
add(31,'Three distinguishable six-sided dice are rolled. How many outcomes contain at least one 2?',6n**3n-5n**3n,'All outcomes minus outcomes with no 2: 6^3−5^3=216−125=91.');
add(32,'All permutations of SACHIN are alphabetically sorted, starting with rank one. Find the rank of SACHIN.',lexicographicRank('SACHIN'),'Five smaller first letters contribute 5×5!=600 preceding words. ACHIN is the smallest suffix. Rank 601.');
add(33,'Five distinct balls are assigned to three labelled boxes, each nonempty. How many assignments are possible?',3n**5n-3n*2n**5n+3n,'Inclusion–exclusion: 3^5−3×2^5+3×1^5=243−96+3=150.');
add(34,'Group A has two men and three women; group B has three men and two women. Choose two from each group, with two men and two women overall. How many choices are possible?',1n+36n+9n,'Male counts from group A can be 0,1,2. Contributions: C(3,2)C(3,2)=9; 2×3×3×2=36; C(2,2)C(2,2)=1. Total 46.');
add(35,'Distribute eight identical balls among four labelled regions, each nonempty. How many distributions are possible?',C(7,3),'Positive compositions: C(8−1,4−1)=C(7,3)=35.');
add(36,'Six equally spaced vertical and six equally spaced horizontal lines have equal spacing in both directions. How many axis-aligned squares are formed?',squares(5,5),'The lines define a 5×5 cell grid. Square count 1²+2²+3²+4²+5²=55.');
add(37,'Choose three of five distinct people, excluding sets containing both of two specified people. How many sets are possible?',C(5,3)-C(3,1),'C(5,3)−C(3,1)=10−3=7.');
add(38,'Choose three cell centres from a 3×4 square-cell grid, with the centres not collinear. How many sets are possible?',noncollinearGridTriples(3,4),'All C(12,3)=220 triples, minus twelve horizontal, four vertical and four diagonal triples. Answer 200.');
add(39,'How many integers from 6000 through 6999 inclusive have at least one repeated digit?',1000n-countConstrainedDigits({digits:[0,1,2,3,4,5,6,7,8,9],minLength:4,maxLength:4,repetition:false,minimum:6000,maximum:6999}),'Total 1000; distinct-digit suffixes have 9×8×7=504 choices. Difference 496.');
add(40,'Two distinct women choose seats among four designated seats; three distinct men then occupy any three of the six remaining seats. How many seatings are possible?',P(4,2)*P(6,3),'P(4,2)P(6,3)=12×120=1440.');
add(41,'Fifteen balls consist of five unique colours and ten other balls, each of whose colours occurs at least twice. What number of draws guarantees a colour match in the worst case over such inventories?',11,'At most ten colours can appear: five unique plus at most five repeated colours. Ten draws can avoid a match; the eleventh guarantees one.','Exactly five colours occur once; every other colour occurs at least twice.');
add(42,'Four multiple-choice questions each have five options and exactly one correct option. Answer every question. How many answer sequences fail to get all four correct?',5n**4n-1n,'All sequences 5^4=625; exactly one sequence is fully correct. Answer 624.');
add(43,'A grid has horizontal row lengths 2,2,6,6,2,2. Place eight identical balls in different cells: six in one row and two in exactly one other row. How many patterns are possible?',2n*(4n*C(2,2)+C(6,2)),'The six-ball row has two choices. The other row contributes four two-cell rows or fifteen pairs in the remaining six-cell row: 2×(4+15)=38.');
add(44,'Three players leave a round-robin tournament after three games each. All remaining pairs finish their games, and 75 games are played. How many participants started?',15,'With n−3 survivors, games lie between C(n−3,2)+6 and C(n−3,2)+9. Only n=15 admits 75: C(12,2)+9=75.','All survivor pairs complete their games; withdrawn players play at most three games with each other.');
add(45,'Two marked points on each of three parallel lines may move and coincide. Give the maximum and minimum numbers of nondegenerate triangles determined by their locations.','20; 0','Choose generic distinct locations for maximum C(6,3)=20. For minimum, let each pair coincide and put the three resulting points on one transversal: zero triangles.','Coincident locations explicitly permitted.');
let doubles=0n;for(let a=0;a<4;a++)for(let b=a+1;b<4;b++)for(let wa=0;wa<4;wa++)for(let wb=0;wb<4;wb++)if(wa!==a&&wb!==b&&wa!==wb)doubles++;
add(46,'Four married couples can form two mixed-doubles teams. Choose two different men and two different women, and no spouses may be teammates. Swapping the two teams does not create a new game. How many games are possible?',doubles,'Choose two men in C(4,2)=6 ways. For each pair, there are seven valid ordered assignments of different women to those men. Total 6×7=42.');
