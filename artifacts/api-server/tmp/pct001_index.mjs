// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/types.ts
var PCT_001_ARCHETYPE_ID = "PCT-001";
var PCT_001_CP_IDS = [
  "PCT-CP-001",
  "PCT-CP-002",
  "PCT-CP-003",
  "PCT-CP-004",
  "PCT-CP-005",
  "PCT-CP-006"
];
var PCT_001_LANGUAGES = ["en", "hi", "pa"];

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/math.ts
function roundTo(value2, places = 2) {
  const factor = 10 ** places;
  return Math.round((value2 + Number.EPSILON) * factor) / factor;
}
function formatNumber(value2) {
  const rounded = roundTo(value2, 2);
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded).replace(/\.?0+$/, "");
}
function gcd(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b !== 0) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a || 1;
}
function formatFraction(numerator, denominator) {
  const sign = numerator * denominator < 0 ? "-" : "";
  const n = Math.abs(Math.round(numerator));
  const d = Math.abs(Math.round(denominator));
  const divisor = gcd(n, d);
  return `${sign}${n / divisor}/${d / divisor}`;
}
function formatRatio(left, right) {
  const divisor = gcd(left, right);
  return `${left / divisor}:${right / divisor}`;
}
function formatPercent(value2) {
  return `${formatNumber(value2)}%`;
}
function percentOf(rate, base) {
  return rate * base / 100;
}
function mathJaxLine(label, expression) {
  return `${label}: \\(${expression}\\)`;
}
function isFiniteNumber(value2) {
  return typeof value2 === "number" && Number.isFinite(value2) && !Number.isNaN(value2);
}
function stableHash(input) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = hash * 31 + input.charCodeAt(index) >>> 0;
  }
  return hash;
}
function stableBucket(seed, size) {
  if (size <= 0) return 0;
  return stableHash(seed) % size;
}

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-language.en.json
var question_language_en_default = {
  "PCT-CP-001": {
    families: {
      "PCT-QL-001": {
        template: "In an election, {percentageRate}% of the {baseValue} registered voters cast their votes. How many votes were cast?",
        difficulty: "Easy"
      },
      "PCT-QL-101": {
        template: "A candidate scored {percentageRate}% of the total {baseValue} marks in an examination. How many marks did he score?",
        difficulty: "Easy"
      },
      "PCT-QL-201": {
        template: "Out of a population of {baseValue} in a village, {percentageRate}% are literate. How many people are literate?",
        difficulty: "Easy"
      },
      "PCT-QL-301": {
        template: "A clinic has a monthly operating grant of Rs. {baseValue}. It spends {percentageRate}% on medicines. Find the medicine expenditure.",
        difficulty: "Easy"
      },
      "PCT-QL-401": {
        template: "The marked price of an article is Rs. {baseValue}. If the discount is {percentageRate}%, find the discount amount.",
        difficulty: "Easy"
      },
      "PCT-QL-501": {
        template: "If a factory produces {baseValue} units per day, and {percentageRate}% of them are defective, how many defective units are produced daily?",
        difficulty: "Easy"
      },
      "PCT-QL-601": {
        template: "In a school, {percentageRate}% of the {baseValue} students are girls. How many girls are there?",
        difficulty: "Easy"
      },
      "PCT-QL-701": {
        template: "A mixture contains {baseValue} liters of liquid, of which {percentageRate}% is water. How much water is there?",
        difficulty: "Easy"
      },
      "PCT-QL-801": {
        template: "Rahul has Rs. {baseValue} with him. He gives {percentageRate}% of it to his friend. How much money did he give?",
        difficulty: "Easy"
      },
      "PCT-QL-901": {
        template: "The marked price of a book is Rs. {baseValue}. The shopkeeper gives a {percentageRate}% discount. What is the discount given?",
        difficulty: "Easy"
      },
      "PCT-QL-1001": {
        template: "An attendance register lists {baseValue} students, and {percentageRate}% were present on Monday. How many students attended the class?",
        difficulty: "Easy"
      },
      "PCT-QL-1101": {
        template: "A fruit seller had {baseValue} apples. He sold {percentageRate}% of them. Find the number of apples sold.",
        difficulty: "Easy"
      },
      "PCT-QL-1201": {
        template: "Out of {baseValue} candidates who appeared for an exam, {percentageRate}% passed. How many passed?",
        difficulty: "Easy"
      },
      "PCT-QL-1301": {
        template: "The total weight of an alloy is {baseValue} kg. If {percentageRate}% of it is copper, find the weight of copper.",
        difficulty: "Easy"
      },
      "PCT-QL-1401": {
        template: "If {percentageRate}% of {baseValue} is equal to x, then what is the value of x?",
        difficulty: "Easy"
      },
      "PCT-QL-1501": {
        template: "A library has {baseValue} books, and {percentageRate}% of them are fiction. How many fiction books are there?",
        difficulty: "Easy"
      },
      "PCT-QL-1601": {
        template: "A person saves {percentageRate}% of a salary of Rs. {baseValue}. Find the savings.",
        difficulty: "Easy"
      },
      "PCT-QL-1701": {
        template: "In a garden of {baseValue} trees, {percentageRate}% are mango trees. How many mango trees are there?",
        difficulty: "Easy"
      },
      "PCT-QL-1801": {
        template: "A water tank holds {baseValue} liters. {percentageRate}% of the water was consumed. How much water was used?",
        difficulty: "Easy"
      },
      "PCT-QL-1901": {
        template: "An investor earns a profit of {percentageRate}% on Rs. {baseValue}. Find the profit amount.",
        difficulty: "Easy"
      },
      "PCT-QL-002": {
        template: "A polling booth had {baseValue} registered voters, and {percentageRate}% of them voted. How many votes were cast?",
        difficulty: "Easy"
      },
      "PCT-QL-102": {
        template: "A result sheet lists {baseValue} as the maximum marks. If a candidate scored {percentageRate}%, how many marks did he score?",
        difficulty: "Easy"
      },
      "PCT-QL-202": {
        template: "A village literacy survey covers {baseValue} people. If {percentageRate}% are literate, how many people are literate?",
        difficulty: "Easy"
      },
      "PCT-QL-302": {
        template: "A district museum has an annual maintenance fund of Rs. {baseValue}. It spends {percentageRate}% on restoration work. Find the restoration expenditure.",
        difficulty: "Easy"
      },
      "PCT-QL-402": {
        template: "A book is marked at Rs. {baseValue}. If a discount of {percentageRate}% is given, find the discount.",
        difficulty: "Easy"
      },
      "PCT-QL-502": {
        template: "A daily inspection sheet lists {baseValue} produced units, of which {percentageRate}% are defective. How many defective units were found?",
        difficulty: "Easy"
      },
      "PCT-QL-602": {
        template: "In a class of {baseValue} students, {percentageRate}% are girls. Find the number of girls.",
        difficulty: "Easy"
      },
      "PCT-QL-702": {
        template: "A lab note records {baseValue} liters of solution, with {percentageRate}% water. How many liters of water are in it?",
        difficulty: "Easy"
      },
      "PCT-QL-802": {
        template: "A cash-book shows Rs. {baseValue} available. If {percentageRate}% of it is paid out, how much money is paid?",
        difficulty: "Easy"
      },
      "PCT-QL-902": {
        template: "A sale bill shows a book marked at Rs. {baseValue} with a {percentageRate}% discount. What is the discount amount?",
        difficulty: "Easy"
      },
      "PCT-QL-1002": {
        template: "A class attendance sheet has {baseValue} names, and {percentageRate}% were present. How many students attended?",
        difficulty: "Easy"
      },
      "PCT-QL-1102": {
        template: "A fruit stock register lists {baseValue} apples. If {percentageRate}% were sold, find the number of apples sold.",
        difficulty: "Easy"
      },
      "PCT-QL-1202": {
        template: "A result summary has {baseValue} candidates, and {percentageRate}% passed. How many candidates passed?",
        difficulty: "Easy"
      },
      "PCT-QL-1302": {
        template: "A workshop material record shows an alloy weighing {baseValue} kg. If {percentageRate}% is copper, find the weight of copper.",
        difficulty: "Easy"
      },
      "PCT-QL-1402": {
        template: "A worksheet asks for {percentageRate}% of {baseValue}. If that value is x, find x.",
        difficulty: "Easy"
      },
      "PCT-QL-1502": {
        template: "A shelf register lists {baseValue} books, and {percentageRate}% are fiction. How many fiction books are there?",
        difficulty: "Easy"
      },
      "PCT-QL-1602": {
        template: "From a monthly income of Rs. {baseValue}, {percentageRate}% is saved. Find the savings.",
        difficulty: "Easy"
      },
      "PCT-QL-1702": {
        template: "A plantation record lists {baseValue} trees, with {percentageRate}% marked as mango trees. How many mango trees are there?",
        difficulty: "Easy"
      },
      "PCT-QL-1802": {
        template: "A supply log shows a tank holding {baseValue} liters of water. If {percentageRate}% was used, how much water was consumed?",
        difficulty: "Easy"
      },
      "PCT-QL-1902": {
        template: "A business earns {percentageRate}% profit on an investment of Rs. {baseValue}. Find the profit.",
        difficulty: "Easy"
      },
      "PCT-QL-003": {
        template: "Convert {percentageRate}% into its simplest fractional form.",
        difficulty: "Easy"
      },
      "PCT-QL-103": {
        template: "Express {percentageRate}% as a fraction in lowest terms.",
        difficulty: "Easy"
      },
      "PCT-QL-203": {
        template: "What is the equivalent fraction of {percentageRate}%?",
        difficulty: "Easy"
      },
      "PCT-QL-303": {
        template: "Write {percentageRate}% in the form of a simple fraction.",
        difficulty: "Easy"
      },
      "PCT-QL-403": {
        template: "Write {percentageRate}% as a fraction.",
        difficulty: "Easy"
      },
      "PCT-QL-503": {
        template: "Reduce {percentageRate}% to its simplest fraction.",
        difficulty: "Easy"
      },
      "PCT-QL-603": {
        template: "Which fraction corresponds exactly to {percentageRate}%?",
        difficulty: "Easy"
      },
      "PCT-QL-703": {
        template: "Convert the percentage {percentageRate}% into fractional form.",
        difficulty: "Easy"
      },
      "PCT-QL-803": {
        template: "Write {percentageRate}% as a simple fraction.",
        difficulty: "Easy"
      },
      "PCT-QL-903": {
        template: "Find the fraction represented by {percentageRate}%.",
        difficulty: "Easy"
      },
      "PCT-QL-1003": {
        template: "Write {percentageRate}% in lowest terms.",
        difficulty: "Easy"
      },
      "PCT-QL-1103": {
        template: "What fraction is equal to {percentageRate}%?",
        difficulty: "Easy"
      },
      "PCT-QL-1203": {
        template: "Give the simplest fraction for {percentageRate}%.",
        difficulty: "Easy"
      },
      "PCT-QL-1303": {
        template: "Change {percentageRate}% into an equivalent fraction.",
        difficulty: "Easy"
      },
      "PCT-QL-1403": {
        template: "Convert {percentageRate}% into a fraction.",
        difficulty: "Easy"
      },
      "PCT-QL-1503": {
        template: "Write the fraction for {percentageRate}%.",
        difficulty: "Easy"
      },
      "PCT-QL-1603": {
        template: "If a value is {percentageRate}%, what part of the whole is it as a fraction?",
        difficulty: "Easy"
      },
      "PCT-QL-1703": {
        template: "Find the simplified fraction that equals {percentageRate}%.",
        difficulty: "Easy"
      },
      "PCT-QL-1803": {
        template: "Write down the fraction equivalent to {percentageRate}%.",
        difficulty: "Easy"
      },
      "PCT-QL-1903": {
        template: "Represent {percentageRate}% as a fraction.",
        difficulty: "Easy"
      },
      "PCT-QL-004": {
        template: "What percentage of {baseValue} is {value}?",
        difficulty: "Easy"
      },
      "PCT-QL-104": {
        template: "A student scored {value} marks out of a total of {baseValue} marks. What is his percentage score?",
        difficulty: "Easy"
      },
      "PCT-QL-204": {
        template: "Out of {baseValue} total apples, {value} were rotten. Find the percentage of rotten apples.",
        difficulty: "Easy"
      },
      "PCT-QL-304": {
        template: "A man saves Rs. {value} from his total monthly income of Rs. {baseValue}. Calculate his savings percentage.",
        difficulty: "Easy"
      },
      "PCT-QL-404": {
        template: "If {value} items in a batch of {baseValue} are defective, what is the defect rate in percent?",
        difficulty: "Easy"
      },
      "PCT-QL-504": {
        template: "In an election, a candidate received {value} votes out of a total of {baseValue} valid votes. What percent of votes did he secure?",
        difficulty: "Easy"
      },
      "PCT-QL-604": {
        template: "The cost price of an article is Rs. {baseValue} and the profit earned is Rs. {value}. Find the profit percentage.",
        difficulty: "Easy"
      },
      "PCT-QL-704": {
        template: "A mixture of {baseValue} liters contains {value} liters of milk. What is the percentage of milk in the mixture?",
        difficulty: "Easy"
      },
      "PCT-QL-804": {
        template: "In a class of {baseValue} students, {value} are girls. What is the percentage of girls?",
        difficulty: "Easy"
      },
      "PCT-QL-904": {
        template: "If a distance of {value} km is covered out of a total journey of {baseValue} km, what percent of the journey is completed?",
        difficulty: "Easy"
      },
      "PCT-QL-1004": {
        template: "A shopkeeper gives a discount of Rs. {value} on a marked price of Rs. {baseValue}. Find the discount percentage.",
        difficulty: "Easy"
      },
      "PCT-QL-1104": {
        template: "Out of a population of {baseValue}, {value} people are literate. What is the literacy rate?",
        difficulty: "Easy"
      },
      "PCT-QL-1204": {
        template: "A person spends Rs. {value} out of his Rs. {baseValue} salary on rent. What percent of his salary goes to rent?",
        difficulty: "Easy"
      },
      "PCT-QL-1304": {
        template: "If a factory target was {baseValue} units and it produced {value} units, what percentage of the target was achieved?",
        difficulty: "Easy"
      },
      "PCT-QL-1404": {
        template: "A book has {baseValue} pages, and {value} pages have pictures. What percent of the book is illustrated?",
        difficulty: "Easy"
      },
      "PCT-QL-1504": {
        template: "The marked price is Rs. {baseValue} and the selling price is less by Rs. {value} (discount). What is the discount percent?",
        difficulty: "Easy"
      },
      "PCT-QL-1604": {
        template: "{value} kg of copper is mixed with other metals to form a {baseValue} kg alloy. Find the copper percentage.",
        difficulty: "Easy"
      },
      "PCT-QL-1704": {
        template: "If a student attends school for {value} days out of a total of {baseValue} working days, calculate his attendance percentage.",
        difficulty: "Easy"
      },
      "PCT-QL-1804": {
        template: "A water tank of capacity {baseValue} liters currently holds {value} liters. What percent of the tank is full?",
        difficulty: "Easy"
      },
      "PCT-QL-1904": {
        template: "Out of Rs. {baseValue} allocated for a project, Rs. {value} was spent. What percentage was spent?",
        difficulty: "Easy"
      },
      "PCT-QL-005": {
        template: "A is {percentageRate}% of B. If B is {baseValue}, find A.",
        difficulty: "Easy"
      },
      "PCT-QL-105": {
        template: "If B = {baseValue} and A is {percentageRate}% of B, find A.",
        difficulty: "Easy"
      },
      "PCT-QL-205": {
        template: "B is {baseValue}. A is {percentageRate}% of B. What is A?",
        difficulty: "Easy"
      },
      "PCT-QL-305": {
        template: "{percentageRate}% of B is A. If B = {baseValue}, find A.",
        difficulty: "Easy"
      },
      "PCT-QL-405": {
        template: "A is {percentageRate}% of B. If B = {baseValue}, what is the value of A?",
        difficulty: "Easy"
      },
      "PCT-QL-006": {
        template: "A is {percentageRate}% more than B. By what percent is B less than A?",
        difficulty: "Medium"
      },
      "PCT-QL-106": {
        template: "If A is {percentageRate}% more than B, by what percent is B less than A?",
        difficulty: "Medium"
      },
      "PCT-QL-206": {
        template: "A is {percentageRate}% more than B. Find how much percent B is less than A.",
        difficulty: "Medium"
      },
      "PCT-QL-306": {
        template: "A exceeds B by {percentageRate}%. By what percent is B less than A?",
        difficulty: "Medium"
      },
      "PCT-QL-406": {
        template: "If A is {percentageRate}% above B, by what percent is B below A?",
        difficulty: "Medium"
      },
      "PCT-QL-007": {
        template: "A is {percentageRate}% less than B. By what percent is B more than A?",
        difficulty: "Medium"
      },
      "PCT-QL-107": {
        template: "If A is {percentageRate}% less than B, by what percent is B more than A?",
        difficulty: "Medium"
      },
      "PCT-QL-207": {
        template: "A is {percentageRate}% less than B. Find how much percent B is more than A.",
        difficulty: "Medium"
      },
      "PCT-QL-307": {
        template: "A is lower than B by {percentageRate}%. By what percent is B greater than A?",
        difficulty: "Medium"
      },
      "PCT-QL-407": {
        template: "If A is {percentageRate}% below B, by what percent is B above A?",
        difficulty: "Medium"
      },
      "PCT-QL-008": {
        template: "If {rate1}% of A is equal to {rate2}% of B, find the ratio A:B.",
        difficulty: "Medium"
      },
      "PCT-QL-108": {
        template: "If {rate1}% of A equals {rate2}% of B, find A:B.",
        difficulty: "Medium"
      },
      "PCT-QL-208": {
        template: "{rate1}% of A is equal to {rate2}% of B. Find the ratio A:B.",
        difficulty: "Medium"
      },
      "PCT-QL-308": {
        template: "If {rate1}% of A and {rate2}% of B are equal, what is A:B?",
        difficulty: "Medium"
      },
      "PCT-QL-408": {
        template: "When {rate1}% of A equals {rate2}% of B, find the ratio A:B.",
        difficulty: "Medium"
      },
      "PCT-QL-009": {
        template: "If {percentageRate}% of a number is {value}, then what is the number?",
        difficulty: "Easy"
      },
      "PCT-QL-109": {
        template: "A student secured {value} marks, which is {percentageRate}% of the maximum marks. Find the maximum marks.",
        difficulty: "Easy"
      },
      "PCT-QL-209": {
        template: "{percentageRate}% of a person's monthly income is Rs. {value}. What is his total monthly income?",
        difficulty: "Easy"
      },
      "PCT-QL-309": {
        template: "In a school, {value} students play cricket, representing {percentageRate}% of the total strength. Find the total number of students.",
        difficulty: "Easy"
      },
      "PCT-QL-409": {
        template: "After spending {percentageRate}% of his money, a man has Rs. {value} left as his expenditure. Find his initial total amount.",
        difficulty: "Easy"
      },
      "PCT-QL-509": {
        template: "A shopkeeper sold {value} items, which is {percentageRate}% of his total stock. What was his total stock?",
        difficulty: "Easy"
      },
      "PCT-QL-609": {
        template: "If a discount of {percentageRate}% amounts to Rs. {value}, what is the marked price?",
        difficulty: "Easy"
      },
      "PCT-QL-709": {
        template: "The profit earned on selling an article is Rs. {value}, which is {percentageRate}% of the cost price. Find the cost price.",
        difficulty: "Easy"
      },
      "PCT-QL-809": {
        template: "If {percentageRate}% of the population of a town is {value}, calculate the total population.",
        difficulty: "Easy"
      },
      "PCT-QL-909": {
        template: "A car depreciates in value by {percentageRate}%, which equals Rs. {value}. Find the original value.",
        difficulty: "Easy"
      },
      "PCT-QL-1009": {
        template: "{value} liters of water leaked from a tank, making up {percentageRate}% of its total capacity. What is the total capacity?",
        difficulty: "Easy"
      },
      "PCT-QL-1109": {
        template: "A man pays Rs. {value} as income tax, which is {percentageRate}% of his gross salary. Find his gross salary.",
        difficulty: "Easy"
      },
      "PCT-QL-1209": {
        template: "If {percentageRate}% of a journey is {value} km, what is the total distance?",
        difficulty: "Easy"
      },
      "PCT-QL-1309": {
        template: "The number of absent students in a class is {value}, which is {percentageRate}% of the total. Find the total students.",
        difficulty: "Easy"
      },
      "PCT-QL-1409": {
        template: "If an alloy contains {value} kg of zinc, representing {percentageRate}% of the total weight, what is the total weight?",
        difficulty: "Easy"
      },
      "PCT-QL-1509": {
        template: "A businessman lost Rs. {value}, which is {percentageRate}% of his investment. Find his total investment.",
        difficulty: "Easy"
      },
      "PCT-QL-1609": {
        template: "If {percentageRate}% of a book contains {value} pages with illustrations, how many pages are in the book?",
        difficulty: "Easy"
      },
      "PCT-QL-1709": {
        template: "The interest earned on a sum is Rs. {value}, which is {percentageRate}% of the principal. Calculate the principal.",
        difficulty: "Easy"
      },
      "PCT-QL-1809": {
        template: "{value} defective items constitute {percentageRate}% of a daily production batch. Find the batch size.",
        difficulty: "Easy"
      },
      "PCT-QL-1909": {
        template: "If {percentageRate}% of the votes polled in an election were {value}, find the total votes polled.",
        difficulty: "Easy"
      }
    }
  },
  "PCT-CP-002": {
    families: {
      "PCT-QL-010": {
        template: "If {baseValue} is increased by {percentageRate}%, find the new number.",
        difficulty: "Easy"
      },
      "PCT-QL-110": {
        template: "A stock ledger shows {baseValue} units before a {percentageRate}% revision. Find the revised stock count after the increase.",
        difficulty: "Easy"
      },
      "PCT-QL-210": {
        template: "A value starts at {baseValue} and is increased by {percentageRate}%. Find the revised value.",
        difficulty: "Easy"
      },
      "PCT-QL-310": {
        template: "A department had {baseValue} sanctioned posts. After a {percentageRate}% increase, find the revised number of posts.",
        difficulty: "Easy"
      },
      "PCT-QL-410": {
        template: "A school club had {baseValue} members. After a {percentageRate}% increase, find the revised membership.",
        difficulty: "Easy"
      },
      "PCT-QL-011": {
        template: "If {baseValue} is decreased by {percentageRate}%, find the new number.",
        difficulty: "Easy"
      },
      "PCT-QL-111": {
        template: "A register shows {baseValue} before a {percentageRate}% reduction. Find the revised number.",
        difficulty: "Easy"
      },
      "PCT-QL-211": {
        template: "A rainfall record shows {baseValue} mm last year. This year it fell by {percentageRate}%. Find this year's rainfall.",
        difficulty: "Easy"
      },
      "PCT-QL-311": {
        template: "A bus depot listed {baseValue} active passes before a {percentageRate}% change downward. Find the revised pass count.",
        difficulty: "Easy"
      },
      "PCT-QL-411": {
        template: "A library listed {baseValue} active cards before a {percentageRate}% reduction. Find the revised number of active cards.",
        difficulty: "Easy"
      },
      "PCT-QL-012": {
        template: "If {percentageRate}% is added to a number, it becomes {finalValue}. Find the number.",
        difficulty: "Medium"
      },
      "PCT-QL-112": {
        template: "A revised bill becomes {finalValue} after adding {percentageRate}% to the earlier amount. Find the earlier amount.",
        difficulty: "Medium"
      },
      "PCT-QL-212": {
        template: "A shop bill became {finalValue} after a {percentageRate}% surcharge. Find the bill before the surcharge.",
        difficulty: "Medium"
      },
      "PCT-QL-312": {
        template: "An electricity bill became {finalValue} after a {percentageRate}% hike. Find the earlier bill amount.",
        difficulty: "Medium"
      },
      "PCT-QL-412": {
        template: "A library count became {finalValue} after a {percentageRate}% increase. Find the earlier count.",
        difficulty: "Medium"
      },
      "PCT-QL-013": {
        template: "If {percentageRate}% is subtracted from a number, it becomes {finalValue}. Find the number.",
        difficulty: "Medium"
      },
      "PCT-QL-113": {
        template: "A revised grant becomes {finalValue} after a {percentageRate}% reduction. Find the earlier grant.",
        difficulty: "Medium"
      },
      "PCT-QL-213": {
        template: "A stock balance becomes {finalValue} after a {percentageRate}% reduction. Find the earlier balance.",
        difficulty: "Medium"
      },
      "PCT-QL-313": {
        template: "A water-supply reading becomes {finalValue} after a {percentageRate}% reduction. Find the earlier reading.",
        difficulty: "Medium"
      },
      "PCT-QL-413": {
        template: "A passenger count becomes {finalValue} after a {percentageRate}% reduction. Find the earlier passenger count.",
        difficulty: "Medium"
      },
      "PCT-QL-014": {
        template: "After increasing a number by {percentageRate}%, it becomes {finalValue}. Find the old number.",
        difficulty: "Medium"
      },
      "PCT-QL-114": {
        template: "A revision note shows {finalValue} after a {percentageRate}% rise. Find the earlier value.",
        difficulty: "Medium"
      },
      "PCT-QL-214": {
        template: "A stock register shows {finalValue} units after a {percentageRate}% rise. Find the earlier stock.",
        difficulty: "Medium"
      },
      "PCT-QL-314": {
        template: "A library register reaches {finalValue} entries after a {percentageRate}% rise. Find the earlier count.",
        difficulty: "Medium"
      },
      "PCT-QL-414": {
        template: "A pass count becomes {finalValue} after a {percentageRate}% rise. Find the earlier count.",
        difficulty: "Medium"
      },
      "PCT-QL-015": {
        template: "A man's salary is increased by {percentageRate}% and becomes Rs. {finalValue}. Find his original salary.",
        difficulty: "Medium"
      },
      "PCT-QL-115": {
        template: "A payroll revision memo shows the revised salary as Rs. {finalValue} after a {percentageRate}% increase. Find the earlier salary.",
        difficulty: "Medium"
      },
      "PCT-QL-215": {
        template: "A pay-slip note shows Rs. {finalValue} after a {percentageRate}% raise. Find the earlier salary.",
        difficulty: "Medium"
      },
      "PCT-QL-315": {
        template: "A staff revision list gives the new salary as Rs. {finalValue} after a {percentageRate}% increase. Find the earlier salary.",
        difficulty: "Medium"
      },
      "PCT-QL-415": {
        template: "A pay register shows Rs. {finalValue} after a {percentageRate}% increase. Find the earlier pay.",
        difficulty: "Medium"
      },
      "PCT-QL-016": {
        template: "Adding {value} to a number is the same as increasing it by {percentageRate}%. Find the number.",
        difficulty: "Medium"
      },
      "PCT-QL-116": {
        template: "A stock entry says adding {value} units gives the same effect as a {percentageRate}% increase. Find the starting stock.",
        difficulty: "Medium"
      },
      "PCT-QL-216": {
        template: "A fee addition of {value} equals {percentageRate}% of the base amount. Find the base amount.",
        difficulty: "Medium"
      },
      "PCT-QL-316": {
        template: "A stock addition of {value} units equals {percentageRate}% of the starting stock. Find the starting stock.",
        difficulty: "Medium"
      },
      "PCT-QL-416": {
        template: "A surcharge of {value} is equal to {percentageRate}% of the original bill. Find the original bill.",
        difficulty: "Medium"
      },
      "PCT-QL-017": {
        template: "If {rate1}% of a number is {value1}, find {rate2}% of that number.",
        difficulty: "Easy"
      },
      "PCT-QL-117": {
        template: "A marks record says {rate1}% of the total marks is {value1}. Find the marks corresponding to {rate2}% of the same total.",
        difficulty: "Easy"
      },
      "PCT-QL-217": {
        template: "A budget sheet says {rate1}% of the total fund is {value1}. Find the amount for {rate2}% of the same fund.",
        difficulty: "Easy"
      },
      "PCT-QL-317": {
        template: "A marks record says {rate1}% of the total marks is {value1}. Find the marks equal to {rate2}% of the total.",
        difficulty: "Easy"
      },
      "PCT-QL-417": {
        template: "A production report says {rate1}% of the total output is {value1}. Find the output corresponding to {rate2}% of the total.",
        difficulty: "Easy"
      },
      "PCT-QL-018": {
        template: "The difference between {rate1}% and {rate2}% of a number is {value}. Find the number.",
        difficulty: "Medium"
      },
      "PCT-QL-118": {
        template: "A grant sheet says {rate1}% and {rate2}% shares differ by {value}. Find the total grant.",
        difficulty: "Medium"
      },
      "PCT-QL-218": {
        template: "A vote record shows the difference between {rate1}% and {rate2}% shares is {value}. Find the total votes.",
        difficulty: "Medium"
      },
      "PCT-QL-318": {
        template: "A stock sheet shows the difference between {rate1}% and {rate2}% portions is {value}. Find the total stock.",
        difficulty: "Medium"
      },
      "PCT-QL-418": {
        template: "A budget note shows the difference between {rate1}% and {rate2}% allocations is {value}. Find the total budget.",
        difficulty: "Medium"
      },
      "PCT-QL-019": {
        template: "By what percent should a number be increased to bring it back to its original value after a {percentageRate}% decrease?",
        difficulty: "Hard"
      },
      "PCT-QL-119": {
        template: "A recovery note says a value fell by {percentageRate}%. What percent rise restores the earlier value?",
        difficulty: "Hard"
      },
      "PCT-QL-219": {
        template: "A price fell by {percentageRate}%. What percent increase is needed to restore the earlier price?",
        difficulty: "Hard"
      },
      "PCT-QL-319": {
        template: "A stock count dropped by {percentageRate}%. What percent rise will restore the earlier stock count?",
        difficulty: "Hard"
      },
      "PCT-QL-419": {
        template: "A turnout figure decreased by {percentageRate}%. What percent rise is needed to return to the earlier turnout?",
        difficulty: "Hard"
      }
    }
  },
  "PCT-CP-003": {
    families: {
      "PCT-QL-020": {
        template: "Two successive increases of {rate1}% and {rate2}% are equal to a single increase of how much?",
        difficulty: "Medium"
      },
      "PCT-QL-120": {
        template: "A subscriber count rises by {rate1}% in one quarter and by {rate2}% in the next. Find the equivalent single percentage increase.",
        difficulty: "Medium"
      },
      "PCT-QL-220": {
        template: "A branch count rose by {rate1}% after one review and by {rate2}% after the next review. Find the equivalent single percentage increase.",
        difficulty: "Medium"
      },
      "PCT-QL-320": {
        template: "A school enrolment record increased by {rate1}% in one term and by {rate2}% in the next term. Find the single equivalent increase percent.",
        difficulty: "Medium"
      },
      "PCT-QL-420": {
        template: "A passenger record shows a {rate1}% rise in one month and a {rate2}% rise in the next month. Find the equivalent single increase percent.",
        difficulty: "Medium"
      },
      "PCT-QL-021": {
        template: "The population of a town increases by {rate1}% in the first year and by {rate2}% in the second year. Find the total percentage increase.",
        difficulty: "Medium"
      },
      "PCT-QL-121": {
        template: "A district population note records a {rate1}% rise in the first year and a {rate2}% rise in the second year. Find the total percentage increase.",
        difficulty: "Medium"
      },
      "PCT-QL-221": {
        template: "A district survey records a {rate1}% rise in households in the first year and a {rate2}% rise in the second year. Find the total percentage increase.",
        difficulty: "Medium"
      },
      "PCT-QL-321": {
        template: "A cattle census increased by {rate1}% in the first year and by {rate2}% in the second year. Find the total percentage increase.",
        difficulty: "Medium"
      },
      "PCT-QL-421": {
        template: "A library membership record rose by {rate1}% in one year and by {rate2}% in the next year. Find the total percentage increase.",
        difficulty: "Medium"
      },
      "PCT-QL-022": {
        template: "A number is increased by {rate1}% and then decreased by {rate2}%. Find the total change percent.",
        difficulty: "Medium"
      },
      "PCT-QL-122": {
        template: "A ticket price rose by {rate1}% after revision and then fell by {rate2}% after a concession. Find the total change percent.",
        difficulty: "Medium"
      },
      "PCT-QL-222": {
        template: "A ticket count rose by {rate1}% after advance booking and then fell by {rate2}% after cancellations. Find the total change percent.",
        difficulty: "Medium"
      },
      "PCT-QL-322": {
        template: "A stock register first rose by {rate1}% after fresh supply and later fell by {rate2}% after sales. Find the total change percent.",
        difficulty: "Medium"
      },
      "PCT-QL-422": {
        template: "A website traffic note shows a {rate1}% rise during a campaign and a {rate2}% fall after it ended. Find the total change percent.",
        difficulty: "Medium"
      },
      "PCT-QL-023": {
        template: "The price of an item is increased by {rate1}% and then decreased by {rate2}%. Find the net change in price percent.",
        difficulty: "Medium"
      },
      "PCT-QL-123": {
        template: "A sale notice first raises the marked price by {rate1}% and later gives a {rate2}% reduction. Find the net change in price percent.",
        difficulty: "Medium"
      },
      "PCT-QL-223": {
        template: "A bill revision first raised the price by {rate1}% and later reduced it by {rate2}%. Find the net change in price percent.",
        difficulty: "Medium"
      },
      "PCT-QL-323": {
        template: "A sale circular first increased the marked price by {rate1}% and later allowed a {rate2}% concession. Find the net change in price percent.",
        difficulty: "Medium"
      },
      "PCT-QL-423": {
        template: "A tax note first raised the item price by {rate1}% and then lowered it by {rate2}%. Find the net change in price percent.",
        difficulty: "Medium"
      },
      "PCT-QL-024": {
        template: "The population of a town is {initialValue}. If it grows at {percentageRate}% every year, what will it be after 2 years?",
        difficulty: "Medium"
      },
      "PCT-QL-124": {
        template: "A cattle census starts at {initialValue}. If it grows at {percentageRate}% every year, what will it be after 2 years?",
        difficulty: "Medium"
      },
      "PCT-QL-224": {
        template: "A subscriber record starts at {initialValue}. If it grows by {percentageRate}% every year, what will it be after 2 years?",
        difficulty: "Medium"
      },
      "PCT-QL-324": {
        template: "An electricity-use record starts at {initialValue}. If it grows by {percentageRate}% each year, what will it be after 2 years?",
        difficulty: "Medium"
      },
      "PCT-QL-424": {
        template: "A vehicle-count record starts at {initialValue}. If it grows by {percentageRate}% every year, what will it be after 2 years?",
        difficulty: "Medium"
      },
      "PCT-QL-025": {
        template: "A machine's value falls by {percentageRate}% every year. If it is Rs. {initialValue} now, find its value after 2 years.",
        difficulty: "Medium"
      },
      "PCT-QL-125": {
        template: "A depreciation register lists a machine at Rs. {initialValue}. Its value falls by {percentageRate}% every year. Find its value after 2 years.",
        difficulty: "Medium"
      },
      "PCT-QL-225": {
        template: "A vehicle value is Rs. {initialValue} now. If it falls by {percentageRate}% every year, find its value after 2 years.",
        difficulty: "Medium"
      },
      "PCT-QL-325": {
        template: "A warehouse asset is valued at Rs. {initialValue}. If it falls by {percentageRate}% every year, find its value after 2 years.",
        difficulty: "Medium"
      },
      "PCT-QL-425": {
        template: "A machine insurance record lists Rs. {initialValue} as the current value. If it falls by {percentageRate}% every year, find its value after 2 years.",
        difficulty: "Medium"
      },
      "PCT-QL-026": {
        template: "The length and breadth of a rectangle are increased by {rate1}% and {rate2}% respectively. Find the percentage increase in area.",
        difficulty: "Medium"
      },
      "PCT-QL-126": {
        template: "A rectangular plot record shows the length and breadth increased by {rate1}% and {rate2}% respectively. Find the percentage increase in area.",
        difficulty: "Medium"
      },
      "PCT-QL-226": {
        template: "A farm plot record shows length rising by {rate1}% and breadth by {rate2}%. Find the percentage increase in area.",
        difficulty: "Medium"
      },
      "PCT-QL-326": {
        template: "A warehouse floor plan increases length by {rate1}% and breadth by {rate2}%. Find the percentage increase in area.",
        difficulty: "Medium"
      },
      "PCT-QL-426": {
        template: "A sports ground layout has its length increased by {rate1}% and breadth by {rate2}%. Find the percentage increase in area.",
        difficulty: "Medium"
      },
      "PCT-QL-027": {
        template: "If the side of a square is increased by {percentageRate}%, find the percentage increase in its area.",
        difficulty: "Easy"
      },
      "PCT-QL-127": {
        template: "A square park layout has its side increased by {percentageRate}%. Find the percentage increase in its area.",
        difficulty: "Easy"
      },
      "PCT-QL-227": {
        template: "A square garden has each side increased by {percentageRate}%. Find the percentage increase in its area.",
        difficulty: "Easy"
      },
      "PCT-QL-327": {
        template: "A square tile design increases each side by {percentageRate}%. Find the percentage increase in its area.",
        difficulty: "Easy"
      },
      "PCT-QL-427": {
        template: "A square floor plan has its side increased by {percentageRate}%. Find the percentage increase in its area.",
        difficulty: "Easy"
      }
    }
  },
  "PCT-CP-004": {
    families: {
      "PCT-QL-028": {
        template: "If the price of sugar increases by {percentageRate}%, by how much percent should a family reduce its consumption to keep the expenditure same?",
        difficulty: "Medium"
      },
      "PCT-QL-128": {
        template: "A ration bill shows sugar price rising by {percentageRate}%. By what percent should consumption be reduced to keep expenditure the same?",
        difficulty: "Medium"
      },
      "PCT-QL-228": {
        template: "A household expense note shows a {percentageRate}% rise in sugar price. By what percent should quantity be reduced to keep expenditure the same?",
        difficulty: "Medium"
      },
      "PCT-QL-328": {
        template: "A ration-card calculation says sugar price rises by {percentageRate}%. By what percent should purchase quantity fall to keep the bill unchanged?",
        difficulty: "Medium"
      },
      "PCT-QL-428": {
        template: "A kitchen budget note records a {percentageRate}% rise in sugar price. By what percent should consumption reduce to keep the sugar expense the same?",
        difficulty: "Medium"
      },
      "PCT-QL-029": {
        template: "The price of petrol falls by {percentageRate}%. By what percent can a person increase his consumption so that the total cost remains same?",
        difficulty: "Medium"
      },
      "PCT-QL-129": {
        template: "A fuel log shows petrol price falling by {percentageRate}%. By what percent can consumption increase while total cost stays the same?",
        difficulty: "Medium"
      },
      "PCT-QL-229": {
        template: "A fuel budget shows petrol price falling by {percentageRate}%. By what percent can usage rise while the total fuel cost stays the same?",
        difficulty: "Medium"
      },
      "PCT-QL-329": {
        template: "A travel allowance note says fuel price fell by {percentageRate}%. By what percent can fuel quantity rise without changing total spending?",
        difficulty: "Medium"
      },
      "PCT-QL-429": {
        template: "A route-cost record shows fuel price falling by {percentageRate}%. By what percent can fuel use increase while total cost remains the same?",
        difficulty: "Medium"
      },
      "PCT-QL-030": {
        template: "The length of a rectangle increases by {percentageRate}%. By what percent should the breadth be decreased to keep the area same?",
        difficulty: "Medium"
      },
      "PCT-QL-130": {
        template: "A rectangular layout has its length increased by {percentageRate}%. By what percent should the breadth be reduced to keep the area the same?",
        difficulty: "Medium"
      },
      "PCT-QL-230": {
        template: "A field layout has its length increased by {percentageRate}%. By what percent should the breadth be reduced to keep the area the same?",
        difficulty: "Medium"
      },
      "PCT-QL-330": {
        template: "A warehouse layout increases its length by {percentageRate}%. By what percent should breadth fall to keep the floor area unchanged?",
        difficulty: "Medium"
      },
      "PCT-QL-430": {
        template: "A sports ground plan extends length by {percentageRate}%. By what percent should breadth reduce so that area remains the same?",
        difficulty: "Medium"
      },
      "PCT-QL-031": {
        template: "If a car's speed increases by {percentageRate}%, by what percent will the time taken decrease for the same distance?",
        difficulty: "Hard"
      },
      "PCT-QL-131": {
        template: "A route schedule shows speed increasing by {percentageRate}% for the same distance. By what percent will the travel time reduce?",
        difficulty: "Hard"
      },
      "PCT-QL-231": {
        template: "A train schedule raises speed by {percentageRate}% for the same route. By what percent will the travel time decrease?",
        difficulty: "Hard"
      },
      "PCT-QL-331": {
        template: "A delivery route note shows speed increasing by {percentageRate}% for the same distance. By what percent will delivery time decrease?",
        difficulty: "Hard"
      },
      "PCT-QL-431": {
        template: "A bus timetable increases average speed by {percentageRate}% on the same route. By what percent will journey time decrease?",
        difficulty: "Hard"
      },
      "PCT-QL-032": {
        template: "The price of an item is increased by {rate1}%. By what percent should the new price be reduced to bring it back to the original?",
        difficulty: "Medium"
      },
      "PCT-QL-132": {
        template: "A revised-price memo raises an item price by {rate1}%. By what percent should the revised price be reduced to restore the earlier price?",
        difficulty: "Medium"
      },
      "PCT-QL-232": {
        template: "A shop notice raises an item price by {rate1}%. By what percent should the revised price be reduced to restore the earlier price?",
        difficulty: "Medium"
      },
      "PCT-QL-332": {
        template: "A tariff memo increases a price by {rate1}%. By what percent should it be lowered to return to the earlier tariff?",
        difficulty: "Medium"
      },
      "PCT-QL-432": {
        template: "A fee schedule raises a charge by {rate1}%. By what percent should the new charge be reduced to restore the old charge?",
        difficulty: "Medium"
      },
      "PCT-QL-033": {
        template: "If the tax on an item is reduced by {rate1}% and its sale increases by {rate2}%, find the total change in revenue percent.",
        difficulty: "Hard"
      },
      "PCT-QL-133": {
        template: "A fee circular reduces tax by {rate1}% while sales increase by {rate2}%. Find the total percentage change in revenue.",
        difficulty: "Hard"
      },
      "PCT-QL-233": {
        template: "A ticketing notice reduces tax by {rate1}% and records a {rate2}% rise in sales. Find the total percentage change in revenue.",
        difficulty: "Hard"
      },
      "PCT-QL-333": {
        template: "A market report shows tax reduced by {rate1}% and sales volume rising by {rate2}%. Find the total percentage change in revenue.",
        difficulty: "Hard"
      },
      "PCT-QL-433": {
        template: "A shop revenue note says tax fell by {rate1}% while sales increased by {rate2}%. Find the total percentage change in revenue.",
        difficulty: "Hard"
      },
      "PCT-QL-034": {
        template: "Working hours of a factory increased by {percentageRate}%. By what percent should the hourly wage be decreased to keep the total bill same?",
        difficulty: "Hard"
      },
      "PCT-QL-134": {
        template: "A contractor bill shows working hours increased by {percentageRate}%. By what percent should the hourly wage be reduced to keep the total bill the same?",
        difficulty: "Hard"
      },
      "PCT-QL-234": {
        template: "A payroll sheet shows working hours increased by {percentageRate}%. By what percent should hourly wage be reduced to keep the total bill the same?",
        difficulty: "Hard"
      },
      "PCT-QL-334": {
        template: "A labour notice records a {percentageRate}% increase in working hours. By what percent should hourly wage fall to keep total pay unchanged?",
        difficulty: "Hard"
      },
      "PCT-QL-434": {
        template: "A contractor bill shows work hours rising by {percentageRate}%. By what percent should the hourly rate reduce to keep the bill unchanged?",
        difficulty: "Hard"
      },
      "PCT-QL-035": {
        template: "If the radius of a circle is decreased by {percentageRate}%, find the percentage decrease in its area.",
        difficulty: "Easy"
      },
      "PCT-QL-135": {
        template: "A circular garden layout has its radius reduced by {percentageRate}%. Find the percentage decrease in its area.",
        difficulty: "Easy"
      },
      "PCT-QL-235": {
        template: "A circular pond layout has its radius reduced by {percentageRate}%. Find the percentage decrease in its area.",
        difficulty: "Easy"
      },
      "PCT-QL-335": {
        template: "A circular park record reduces radius by {percentageRate}%. Find the percentage decrease in its area.",
        difficulty: "Easy"
      },
      "PCT-QL-435": {
        template: "A circular field plan has radius reduced by {percentageRate}%. Find the percentage decrease in its area.",
        difficulty: "Easy"
      }
    }
  },
  "PCT-CP-005": {
    families: {
      "PCT-QL-036": {
        template: "A man spends {rate1}% of his income on food, {rate2}% on rent and {rate3}% on other things. If he saves Rs. {value}, find his total income.",
        difficulty: "Medium"
      },
      "PCT-QL-136": {
        template: "A household ledger shows {rate1}% of income for food, {rate2}% for rent and {rate3}% for other expenses. If savings are Rs. {value}, find the total income.",
        difficulty: "Medium"
      },
      "PCT-QL-236": {
        template: "An office budget uses {rate1}% for supplies, {rate2}% for rent and {rate3}% for travel. If Rs. {value} remains unspent, find the total budget.",
        difficulty: "Medium"
      },
      "PCT-QL-336": {
        template: "A coaching-centre account spends {rate1}% on salaries, {rate2}% on rent and {rate3}% on advertising. If Rs. {value} is left, find the total account amount.",
        difficulty: "Medium"
      },
      "PCT-QL-436": {
        template: "A family account assigns {rate1}% to groceries, {rate2}% to house rent and {rate3}% to bills. If Rs. {value} is saved, find the total income.",
        difficulty: "Medium"
      },
      "PCT-QL-037": {
        template: "A person spends {rate1}% of his salary on food and {rate2}% of the remaining on rent. If he still has Rs. {value} left, find his salary.",
        difficulty: "Hard"
      },
      "PCT-QL-137": {
        template: "A salary ledger sets aside {rate1}% for food and {rate2}% of the remaining amount for rent. If Rs. {value} is left, find the salary.",
        difficulty: "Hard"
      },
      "PCT-QL-237": {
        template: "An employee spends {rate1}% of his salary on family expenses and {rate2}% of the remainder on rent. If Rs. {value} remains, find his salary.",
        difficulty: "Hard"
      },
      "PCT-QL-337": {
        template: "A monthly pay account first uses {rate1}% for food, then {rate2}% of the balance for rent. If Rs. {value} is still left, find the salary.",
        difficulty: "Hard"
      },
      "PCT-QL-437": {
        template: "A worker spends {rate1}% of his salary on household needs and {rate2}% of what remains on rent. If Rs. {value} is left, find the salary.",
        difficulty: "Hard"
      },
      "PCT-QL-038": {
        template: "In an election between two candidates, the winner got {percentageRate}% votes and won by {voteDifference} votes. Find the total votes polled.",
        difficulty: "Medium"
      },
      "PCT-QL-138": {
        template: "A booth-wise result shows the winner got {percentageRate}% votes and won by {voteDifference} votes. Find the total votes polled.",
        difficulty: "Medium"
      },
      "PCT-QL-238": {
        template: "In a two-candidate ward election, the winner received {percentageRate}% of the votes and won by {voteDifference} votes. Find the total votes polled.",
        difficulty: "Medium"
      },
      "PCT-QL-338": {
        template: "A polling summary shows the leading candidate secured {percentageRate}% votes and the winning margin was {voteDifference}. Find the total votes polled.",
        difficulty: "Medium"
      },
      "PCT-QL-438": {
        template: "In a college election with two candidates, the winner got {percentageRate}% of the votes and won by {voteDifference} votes. Find the total votes polled.",
        difficulty: "Medium"
      },
      "PCT-QL-039": {
        template: "In an election, {rate1}% votes were cancelled. The winner got {rate2}% of the valid votes and won by {voteDifference} votes. Find the total votes.",
        difficulty: "Hard"
      },
      "PCT-QL-139": {
        template: "A valid-votes report says {rate1}% votes were cancelled and the winner got {rate2}% of the valid votes, winning by {voteDifference} votes. Find the total votes.",
        difficulty: "Hard"
      },
      "PCT-QL-239": {
        template: "In a local poll, {rate1}% votes were rejected. The winner secured {rate2}% of the valid votes and won by {voteDifference} votes. Find the total votes.",
        difficulty: "Hard"
      },
      "PCT-QL-339": {
        template: "A counting report marks {rate1}% votes as cancelled. The winner got {rate2}% of the valid votes and led by {voteDifference} votes. Find the total votes.",
        difficulty: "Hard"
      },
      "PCT-QL-439": {
        template: "In a student-council election, {rate1}% ballots were invalid. The winner received {rate2}% of valid votes and won by {voteDifference} votes. Find the total votes.",
        difficulty: "Hard"
      },
      "PCT-QL-040": {
        template: "A student needs {passRate}% marks to pass. He gets {marksObtained} marks and fails by {failMargin} marks. Find the maximum marks.",
        difficulty: "Medium"
      },
      "PCT-QL-140": {
        template: "A result sheet says the pass mark is {passRate}% of the maximum marks. A student gets {marksObtained} marks and fails by {failMargin} marks. Find the maximum marks.",
        difficulty: "Medium"
      },
      "PCT-QL-240": {
        template: "A test requires {passRate}% marks to pass. A student scores {marksObtained} marks and falls short by {failMargin} marks. Find the maximum marks.",
        difficulty: "Medium"
      },
      "PCT-QL-340": {
        template: "An exam pass mark is {passRate}% of the maximum marks. A student gets {marksObtained} marks and misses passing by {failMargin} marks. Find the maximum marks.",
        difficulty: "Medium"
      },
      "PCT-QL-440": {
        template: "A board exam sets the passing score at {passRate}% of maximum marks. A student obtains {marksObtained} marks and is short by {failMargin} marks. Find the maximum marks.",
        difficulty: "Medium"
      },
      "PCT-QL-041": {
        template: "In a school, {rate1}% students are boys. If there are {value} girls, find the total number of students.",
        difficulty: "Easy"
      },
      "PCT-QL-141": {
        template: "An enrolment register shows {rate1}% students are boys. If there are {value} girls, find the total number of students.",
        difficulty: "Easy"
      },
      "PCT-QL-241": {
        template: "In a class register, {rate1}% of students are boys. If the number of girls is {value}, find the total number of students.",
        difficulty: "Easy"
      },
      "PCT-QL-341": {
        template: "A school enrolment sheet shows {rate1}% boys. If girls number {value}, find the total number of students.",
        difficulty: "Easy"
      },
      "PCT-QL-441": {
        template: "A coaching batch has {rate1}% boys. If it has {value} girls, find the total number of students.",
        difficulty: "Easy"
      },
      "PCT-QL-042": {
        template: "Out of {totalPopulation} people, {percentageRate}% are men. Find the number of women.",
        difficulty: "Easy"
      },
      "PCT-QL-142": {
        template: "A census sheet lists {totalPopulation} people, of whom {percentageRate}% are men. Find the number of women.",
        difficulty: "Easy"
      },
      "PCT-QL-242": {
        template: "A census list has {totalPopulation} people, and {percentageRate}% are men. Find the number of women.",
        difficulty: "Easy"
      },
      "PCT-QL-342": {
        template: "In a town record of {totalPopulation} residents, {percentageRate}% are men. Find the number of women.",
        difficulty: "Easy"
      },
      "PCT-QL-442": {
        template: "A survey covers {totalPopulation} people, with {percentageRate}% men. Find the number of women.",
        difficulty: "Easy"
      },
      "PCT-QL-043": {
        template: "In an exam, A gets {rate1}% more marks than B. If A gets {marks}, find the marks of B.",
        difficulty: "Medium"
      },
      "PCT-QL-143": {
        template: "A scorecard shows A got {rate1}% more marks than B. If A got {marks} marks, find B's marks.",
        difficulty: "Medium"
      },
      "PCT-QL-243": {
        template: "In a test, A scores {rate1}% more marks than B. If A scores {marks}, find B's marks.",
        difficulty: "Medium"
      },
      "PCT-QL-343": {
        template: "A score comparison says A obtained {rate1}% more marks than B. If A obtained {marks} marks, find B's marks.",
        difficulty: "Medium"
      },
      "PCT-QL-443": {
        template: "In an assessment, A has {rate1}% more marks than B. If A has {marks} marks, find the marks of B.",
        difficulty: "Medium"
      },
      "PCT-QL-044": {
        template: "If {rate1}% people in a village are literate and {value} people are illiterate, find the total population.",
        difficulty: "Medium"
      },
      "PCT-QL-144": {
        template: "A village literacy survey records {rate1}% literate people and {value} illiterate people. Find the total population.",
        difficulty: "Medium"
      },
      "PCT-QL-244": {
        template: "In a village survey, {rate1}% people are literate and {value} people are illiterate. Find the total population.",
        difficulty: "Medium"
      },
      "PCT-QL-344": {
        template: "A literacy record shows {rate1}% of villagers are literate. If {value} villagers are illiterate, find the total population.",
        difficulty: "Medium"
      },
      "PCT-QL-444": {
        template: "A panchayat data sheet says {rate1}% people are literate and {value} are illiterate. Find the total population.",
        difficulty: "Medium"
      },
      "PCT-QL-045": {
        template: "A man gave {rate1}% of his money to his wife, {rate2}% to his son and the remaining Rs. {value} to his daughter. How much did he have at first?",
        difficulty: "Medium"
      },
      "PCT-QL-145": {
        template: "A family ledger allocates {rate1}% of money to one member, {rate2}% to another, and the remaining Rs. {value} to a third member. Find the starting amount.",
        difficulty: "Medium"
      },
      "PCT-QL-245": {
        template: "A person gave {rate1}% of his money to one relative, {rate2}% to another and the remaining Rs. {value} to a third. How much did he have at first?",
        difficulty: "Medium"
      },
      "PCT-QL-345": {
        template: "A donation plan gives {rate1}% of a fund to one group, {rate2}% to another group and Rs. {value} as the balance. Find the original fund.",
        difficulty: "Medium"
      },
      "PCT-QL-445": {
        template: "A family settlement gives {rate1}% of the money to one member and {rate2}% to another, leaving Rs. {value}. Find the starting amount.",
        difficulty: "Medium"
      },
      "PCT-QL-046": {
        template: "An alloy contains {rate1}% copper and the rest is zinc. If there is {value} kg zinc, find the total weight of the alloy.",
        difficulty: "Medium"
      },
      "PCT-QL-146": {
        template: "A metals record has {rate1}% copper and the rest zinc. If zinc weighs {value} kg, find the total weight.",
        difficulty: "Medium"
      },
      "PCT-QL-246": {
        template: "A metal sample contains {rate1}% copper and the remaining part is zinc. If zinc weighs {value} kg, find the total weight of the alloy.",
        difficulty: "Medium"
      },
      "PCT-QL-346": {
        template: "A brass-mix record says {rate1}% of the alloy is copper and the rest is zinc. If zinc is {value} kg, find the alloy's total weight.",
        difficulty: "Medium"
      },
      "PCT-QL-446": {
        template: "An alloy batch is {rate1}% copper, with zinc making up the balance. If the zinc weighs {value} kg, find the total batch weight.",
        difficulty: "Medium"
      },
      "PCT-QL-047": {
        template: "Two candidates contested an election. One got {rate1}% votes and lost by {voteDifference} votes. Find the total number of votes.",
        difficulty: "Medium"
      },
      "PCT-QL-147": {
        template: "A polling summary says one candidate got {rate1}% votes and lost by {voteDifference} votes. Find the total number of votes.",
        difficulty: "Medium"
      },
      "PCT-QL-247": {
        template: "In a two-candidate election, one candidate got {rate1}% votes and lost by {voteDifference} votes. Find the total number of votes.",
        difficulty: "Medium"
      },
      "PCT-QL-347": {
        template: "A ward result says the losing candidate received {rate1}% votes and lost by {voteDifference} votes. Find the total number of votes.",
        difficulty: "Medium"
      },
      "PCT-QL-447": {
        template: "In a society election, one candidate polled {rate1}% votes and lost by {voteDifference} votes. Find the total number of votes.",
        difficulty: "Medium"
      }
    }
  },
  "PCT-CP-006": {
    families: {
      "PCT-QL-048": {
        template: "A mixture of {totalMixture} litres has {percentageRate}% acid. How much water should be added to make it {newRate}% acid?",
        difficulty: "Hard"
      },
      "PCT-QL-148": {
        template: "A lab mixture note has {totalMixture} litres at {percentageRate}% acid. How much water should be added to make it {newRate}% acid?",
        difficulty: "Hard"
      },
      "PCT-QL-248": {
        template: "A chemical tank holds {totalMixture} litres of {percentageRate}% acid mixture. How much water should be added to make it {newRate}% acid?",
        difficulty: "Hard"
      },
      "PCT-QL-348": {
        template: "A laboratory beaker contains {totalMixture} litres of solution with {percentageRate}% acid. How much water should be added to make it {newRate}% acid?",
        difficulty: "Hard"
      },
      "PCT-QL-448": {
        template: "An acid solution measures {totalMixture} litres and is {percentageRate}% acid. How much water should be added to bring it to {newRate}% acid?",
        difficulty: "Hard"
      },
      "PCT-QL-049": {
        template: "{totalQuantity} kg of fresh fruit has {waterRate}% water, and dry fruit has {dryWaterRate}% water. How many kg of dry fruit can be made from {totalQuantity} kg of fresh fruit?",
        difficulty: "Hard"
      },
      "PCT-QL-149": {
        template: "A drying batch starts with {totalQuantity} kg of fruit containing {waterRate}% water. If the dried fruit contains {dryWaterRate}% water, how many kg of dry fruit are produced?",
        difficulty: "Hard"
      },
      "PCT-QL-249": {
        template: "{totalQuantity} kg of fresh mangoes contain {waterRate}% water. After drying, the mangoes contain {dryWaterRate}% water. How many kg of dried mangoes will remain?",
        difficulty: "Hard"
      },
      "PCT-QL-349": {
        template: "A processor dries {totalQuantity} kg of fruit with {waterRate}% water until the dry fruit has {dryWaterRate}% water. Find the weight of dry fruit produced.",
        difficulty: "Hard"
      },
      "PCT-QL-449": {
        template: "From {totalQuantity} kg of fresh fruit with {waterRate}% water, dry fruit is prepared with {dryWaterRate}% water. How many kg of dry fruit can be made?",
        difficulty: "Hard"
      },
      "PCT-QL-050": {
        template: "In {totalMixture} litres of salt solution, there is {percentageRate}% salt. How much salt should be added to make it a {newRate}% solution?",
        difficulty: "Hard"
      },
      "PCT-QL-150": {
        template: "A solution-strength note has {totalMixture} litres of salt solution with {percentageRate}% salt. How much salt should be added to make it a {newRate}% solution?",
        difficulty: "Hard"
      },
      "PCT-QL-250": {
        template: "A tank has {totalMixture} litres of salt solution containing {percentageRate}% salt. How much salt should be added to make it a {newRate}% solution?",
        difficulty: "Hard"
      },
      "PCT-QL-350": {
        template: "A brine container holds {totalMixture} litres at {percentageRate}% salt. How much salt must be added to make it a {newRate}% solution?",
        difficulty: "Hard"
      },
      "PCT-QL-450": {
        template: "A salt-water mix measures {totalMixture} litres and has {percentageRate}% salt. How much salt should be added so that it becomes a {newRate}% solution?",
        difficulty: "Hard"
      },
      "PCT-QL-051": {
        template: "If {value} litres of water is added to {totalMixture} litres of {percentageRate}% alcohol solution, what will be the percentage of alcohol now?",
        difficulty: "Hard"
      },
      "PCT-QL-151": {
        template: "A dilution sheet adds {value} litres of water to {totalMixture} litres of {percentageRate}% alcohol solution. What will be the percentage of alcohol now?",
        difficulty: "Hard"
      },
      "PCT-QL-251": {
        template: "A chemist adds {value} litres of water to {totalMixture} litres of {percentageRate}% alcohol solution. What will be the percentage of alcohol now?",
        difficulty: "Hard"
      },
      "PCT-QL-351": {
        template: "A dilution record adds {value} litres of water to {totalMixture} litres of {percentageRate}% alcohol solution. Find the new alcohol percentage.",
        difficulty: "Hard"
      },
      "PCT-QL-451": {
        template: "To {totalMixture} litres of {percentageRate}% alcohol solution, {value} litres of water is added. What is the alcohol percentage now?",
        difficulty: "Hard"
      },
      "PCT-QL-052": {
        template: "Fresh grapes have {rate1}% water and dry grapes have {rate2}% water. If the dry grapes weigh {value} kg, what was their weight when fresh?",
        difficulty: "Hard"
      },
      "PCT-QL-152": {
        template: "A crop-drying note says fresh grapes have {rate1}% water and dry grapes have {rate2}% water. If the dry grapes weigh {value} kg, what was their weight when fresh?",
        difficulty: "Hard"
      },
      "PCT-QL-252": {
        template: "A batch of fresh grapes has {rate1}% water, while the dried grapes have {rate2}% water. If the dried grapes weigh {value} kg, find their fresh weight.",
        difficulty: "Hard"
      },
      "PCT-QL-352": {
        template: "A drying register says fresh grapes contain {rate1}% water and dry grapes contain {rate2}% water. If dry grapes weigh {value} kg, find the fresh grape weight.",
        difficulty: "Hard"
      },
      "PCT-QL-452": {
        template: "Dry grapes contain {rate2}% water after drying from fresh grapes that had {rate1}% water. If the dry grapes weigh {value} kg, find the original fresh weight.",
        difficulty: "Hard"
      },
      "PCT-QL-053": {
        template: "How much pure alcohol should be added to {totalMixture} mL of {percentageRate}% solution to make it {newRate}% strong?",
        difficulty: "Hard"
      },
      "PCT-QL-153": {
        template: "A lab solution record has {totalMixture} mL of {percentageRate}% solution. How much pure alcohol should be added to make it {newRate}% strong?",
        difficulty: "Hard"
      },
      "PCT-QL-253": {
        template: "A lab has {totalMixture} mL of {percentageRate}% solution. How much pure alcohol should be added to make it {newRate}% strong?",
        difficulty: "Hard"
      },
      "PCT-QL-353": {
        template: "A bottle contains {totalMixture} mL of {percentageRate}% solution. Find the pure alcohol needed to make it {newRate}% strong.",
        difficulty: "Hard"
      },
      "PCT-QL-453": {
        template: "A solution sample is {totalMixture} mL at {percentageRate}% strength. How much pure alcohol should be added to make it {newRate}% strong?",
        difficulty: "Hard"
      },
      "PCT-QL-054": {
        template: "A solution has {percentageRate}% sugar. If {value} kg water evaporates, the sugar becomes {newRate}%. Find the original weight.",
        difficulty: "Hard"
      },
      "PCT-QL-154": {
        template: "A sugar-solution note starts at {percentageRate}% sugar. After {value} kg water evaporates, the sugar becomes {newRate}%. Find the original weight.",
        difficulty: "Hard"
      },
      "PCT-QL-254": {
        template: "A sugar solution initially has {percentageRate}% sugar. After {value} kg water evaporates, the concentration becomes {newRate}%. Find the original weight.",
        difficulty: "Hard"
      },
      "PCT-QL-354": {
        template: "A syrup mixture is {percentageRate}% sugar. When {value} kg of water evaporates, it becomes {newRate}% sugar. Find the original weight.",
        difficulty: "Hard"
      },
      "PCT-QL-454": {
        template: "A sugar-water batch has {percentageRate}% sugar. After {value} kg water evaporates, the sugar percentage is {newRate}%. Find the original weight.",
        difficulty: "Hard"
      },
      "PCT-QL-055": {
        template: "An alloy of copper and zinc has {percentageRate}% copper. Find the weight of zinc in {totalWeight} kg of the alloy.",
        difficulty: "Easy"
      },
      "PCT-QL-155": {
        template: "A metals batch has {percentageRate}% copper. Find the weight of zinc in {totalWeight} kg of the batch.",
        difficulty: "Easy"
      },
      "PCT-QL-255": {
        template: "A materials batch has {percentageRate}% copper. Find the weight of zinc in {totalWeight} kg of the batch.",
        difficulty: "Easy"
      },
      "PCT-QL-355": {
        template: "A copper-zinc batch contains {percentageRate}% copper. Find the zinc weight in {totalWeight} kg of the batch.",
        difficulty: "Easy"
      },
      "PCT-QL-455": {
        template: "A materials batch is {percentageRate}% copper. Find the weight of the remaining metal in {totalWeight} kg of the batch.",
        difficulty: "Easy"
      }
    }
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-language.hi.json
var question_language_hi_default = {
  "PCT-CP-001": {
    families: {
      "PCT-QL-001": {
        template: "\u090F\u0915 \u091A\u0941\u0928\u093E\u0935 \u092E\u0947\u0902 {baseValue} \u092A\u0902\u091C\u0940\u0915\u0943\u0924 \u092E\u0924\u0926\u093E\u0924\u093E\u0913\u0902 \u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u0928\u0947 \u092E\u0924\u0926\u093E\u0928 \u0915\u093F\u092F\u093E\u0964 \u0915\u093F\u0924\u0928\u0947 \u0935\u094B\u091F \u0921\u093E\u0932\u0947 \u0917\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-101": {
        template: "\u090F\u0915 \u092A\u0930\u0940\u0915\u094D\u0937\u093E \u092E\u0947\u0902 \u0915\u093F\u0938\u0940 \u0905\u092D\u094D\u092F\u0930\u094D\u0925\u0940 \u0928\u0947 \u0915\u0941\u0932 {baseValue} \u0905\u0902\u0915\u094B\u0902 \u0915\u093E {percentageRate}% \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u093F\u092F\u093E\u0964 \u0909\u0938\u0928\u0947 \u0915\u093F\u0924\u0928\u0947 \u0905\u0902\u0915 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-201": {
        template: "\u0915\u093F\u0938\u0940 \u0917\u093E\u0901\u0935 \u0915\u0940 {baseValue} \u091C\u0928\u0938\u0902\u0916\u094D\u092F\u093E \u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u0938\u093E\u0915\u094D\u0937\u0930 \u0939\u0948\u0902\u0964 \u0915\u093F\u0924\u0928\u0947 \u0932\u094B\u0917 \u0938\u093E\u0915\u094D\u0937\u0930 \u0939\u0948\u0902?",
        difficulty: "Easy"
      },
      "PCT-QL-301": {
        template: "\u090F\u0915 \u091A\u093F\u0915\u093F\u0924\u094D\u0938\u093E\u0932\u092F \u0915\u0947 \u092A\u093E\u0938 \u092E\u093E\u0938\u093F\u0915 \u0938\u0902\u091A\u093E\u0932\u0928 \u0905\u0928\u0941\u0926\u093E\u0928 Rs. {baseValue} \u0939\u0948\u0964 \u0935\u0939 \u0909\u0938\u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u0926\u0935\u093E\u0907\u092F\u094B\u0902 \u092A\u0930 \u0916\u0930\u094D\u091A \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u0926\u0935\u093E\u0907\u092F\u094B\u0902 \u092A\u0930 \u0939\u094B\u0928\u0947 \u0935\u093E\u0932\u093E \u0916\u0930\u094D\u091A \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-401": {
        template: "\u0915\u093F\u0938\u0940 \u0935\u0938\u094D\u0924\u0941 \u0915\u093E \u0905\u0902\u0915\u093F\u0924 \u092E\u0942\u0932\u094D\u092F Rs. {baseValue} \u0939\u0948\u0964 \u092F\u0926\u093F \u091B\u0942\u091F {percentageRate}% \u0939\u0948, \u0924\u094B \u091B\u0942\u091F \u0915\u0940 \u0930\u093E\u0936\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-501": {
        template: "\u092F\u0926\u093F \u0915\u094B\u0908 \u0915\u093E\u0930\u0916\u093E\u0928\u093E \u092A\u094D\u0930\u0924\u093F\u0926\u093F\u0928 {baseValue} \u0907\u0915\u093E\u0907\u092F\u093E\u0901 \u092C\u0928\u093E\u0924\u093E \u0939\u0948 \u0914\u0930 \u0909\u0928\u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u0916\u0930\u093E\u092C \u0939\u0948\u0902, \u0924\u094B \u092A\u094D\u0930\u0924\u093F\u0926\u093F\u0928 \u0915\u093F\u0924\u0928\u0940 \u0916\u0930\u093E\u092C \u0907\u0915\u093E\u0907\u092F\u093E\u0901 \u092C\u0928\u0924\u0940 \u0939\u0948\u0902?",
        difficulty: "Easy"
      },
      "PCT-QL-601": {
        template: "\u090F\u0915 \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u092E\u0947\u0902 {baseValue} \u091B\u093E\u0924\u094D\u0930\u094B\u0902 \u0915\u093E {percentageRate}% \u0932\u0921\u093C\u0915\u093F\u092F\u093E\u0901 \u0939\u0948\u0902\u0964 \u0915\u0941\u0932 \u0915\u093F\u0924\u0928\u0940 \u0932\u0921\u093C\u0915\u093F\u092F\u093E\u0901 \u0939\u0948\u0902?",
        difficulty: "Easy"
      },
      "PCT-QL-701": {
        template: "\u090F\u0915 \u092E\u093F\u0936\u094D\u0930\u0923 \u092E\u0947\u0902 {baseValue} \u0932\u0940\u091F\u0930 \u0926\u094D\u0930\u0935 \u0939\u0948, \u091C\u093F\u0938\u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u092A\u093E\u0928\u0940 \u0939\u0948\u0964 \u0909\u0938\u092E\u0947\u0902 \u0915\u093F\u0924\u0928\u093E \u092A\u093E\u0928\u0940 \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-801": {
        template: "\u0930\u093E\u0939\u0941\u0932 \u0915\u0947 \u092A\u093E\u0938 Rs. {baseValue} \u0939\u0948\u0902\u0964 \u0935\u0939 \u0909\u0938\u0915\u093E {percentageRate}% \u0905\u092A\u0928\u0947 \u092E\u093F\u0924\u094D\u0930 \u0915\u094B \u0926\u0947 \u0926\u0947\u0924\u093E \u0939\u0948\u0964 \u0909\u0938\u0928\u0947 \u0915\u093F\u0924\u0928\u0940 \u0930\u093E\u0936\u093F \u0926\u0940?",
        difficulty: "Easy"
      },
      "PCT-QL-901": {
        template: "\u0915\u093F\u0938\u0940 \u092A\u0941\u0938\u094D\u0924\u0915 \u0915\u093E \u0905\u0902\u0915\u093F\u0924 \u092E\u0942\u0932\u094D\u092F Rs. {baseValue} \u0939\u0948\u0964 \u0926\u0941\u0915\u093E\u0928\u0926\u093E\u0930 {percentageRate}% \u0915\u0940 \u091B\u0942\u091F \u0926\u0947\u0924\u093E \u0939\u0948\u0964 \u091B\u0942\u091F \u0915\u0940 \u0930\u093E\u0936\u093F \u0915\u094D\u092F\u093E \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-1001": {
        template: "\u0909\u092A\u0938\u094D\u0925\u093F\u0924\u093F \u0930\u091C\u093F\u0938\u094D\u091F\u0930 \u092E\u0947\u0902 {baseValue} \u091B\u093E\u0924\u094D\u0930 \u0926\u0930\u094D\u091C \u0939\u0948\u0902 \u0914\u0930 \u0938\u094B\u092E\u0935\u093E\u0930 \u0915\u094B \u0909\u0928\u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u0909\u092A\u0938\u094D\u0925\u093F\u0924 \u0925\u0947\u0964 \u0915\u0915\u094D\u0937\u093E \u092E\u0947\u0902 \u0915\u093F\u0924\u0928\u0947 \u091B\u093E\u0924\u094D\u0930 \u0909\u092A\u0938\u094D\u0925\u093F\u0924 \u0939\u0941\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-1101": {
        template: "\u090F\u0915 \u092B\u0932 \u0935\u093F\u0915\u094D\u0930\u0947\u0924\u093E \u0915\u0947 \u092A\u093E\u0938 {baseValue} \u0938\u0947\u092C \u0925\u0947\u0964 \u0909\u0938\u0928\u0947 \u0909\u0928\u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u092C\u0947\u091A \u0926\u093F\u090F\u0964 \u092C\u0947\u091A\u0947 \u0917\u090F \u0938\u0947\u092C\u094B\u0902 \u0915\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1201": {
        template: "\u0915\u093F\u0938\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u093E \u092E\u0947\u0902 \u0909\u092A\u0938\u094D\u0925\u093F\u0924 {baseValue} \u0905\u092D\u094D\u092F\u0930\u094D\u0925\u093F\u092F\u094B\u0902 \u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u092A\u093E\u0938 \u0939\u0941\u090F\u0964 \u0915\u093F\u0924\u0928\u0947 \u092A\u093E\u0938 \u0939\u0941\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-1301": {
        template: "\u090F\u0915 \u092E\u093F\u0936\u094D\u0930\u0927\u093E\u0924\u0941 \u0915\u093E \u0915\u0941\u0932 \u092D\u093E\u0930 {baseValue} \u0915\u093F\u0917\u094D\u0930\u093E \u0939\u0948\u0964 \u092F\u0926\u093F \u0909\u0938\u0915\u093E {percentageRate}% \u0924\u093E\u0901\u092C\u093E \u0939\u0948, \u0924\u094B \u0924\u093E\u0901\u092C\u0947 \u0915\u093E \u092D\u093E\u0930 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1401": {
        template: "\u092F\u0926\u093F {baseValue} \u0915\u093E {percentageRate}% = x \u0939\u0948, \u0924\u094B x \u0915\u093E \u092E\u093E\u0928 \u0915\u094D\u092F\u093E \u0939\u094B\u0917\u093E?",
        difficulty: "Easy"
      },
      "PCT-QL-1501": {
        template: "\u090F\u0915 \u092A\u0941\u0938\u094D\u0924\u0915\u093E\u0932\u092F \u092E\u0947\u0902 {baseValue} \u092A\u0941\u0938\u094D\u0924\u0915\u0947\u0902 \u0939\u0948\u0902 \u0914\u0930 \u0909\u0928\u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u0915\u0925\u093E-\u0938\u093E\u0939\u093F\u0924\u094D\u092F \u0915\u0940 \u0939\u0948\u0902\u0964 \u0915\u0925\u093E-\u0938\u093E\u0939\u093F\u0924\u094D\u092F \u0915\u0940 \u0915\u093F\u0924\u0928\u0940 \u092A\u0941\u0938\u094D\u0924\u0915\u0947\u0902 \u0939\u0948\u0902?",
        difficulty: "Easy"
      },
      "PCT-QL-1601": {
        template: "\u0915\u094B\u0908 \u0935\u094D\u092F\u0915\u094D\u0924\u093F Rs. {baseValue} \u0915\u0947 \u0935\u0947\u0924\u0928 \u0915\u093E {percentageRate}% \u092C\u091A\u093E\u0924\u093E \u0939\u0948\u0964 \u0909\u0938\u0915\u0940 \u092C\u091A\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1701": {
        template: "{baseValue} \u092A\u0947\u0921\u093C\u094B\u0902 \u0935\u093E\u0932\u0947 \u090F\u0915 \u092C\u0917\u0940\u091A\u0947 \u092E\u0947\u0902 {percentageRate}% \u0906\u092E \u0915\u0947 \u092A\u0947\u0921\u093C \u0939\u0948\u0902\u0964 \u0906\u092E \u0915\u0947 \u0915\u093F\u0924\u0928\u0947 \u092A\u0947\u0921\u093C \u0939\u0948\u0902?",
        difficulty: "Easy"
      },
      "PCT-QL-1801": {
        template: "\u090F\u0915 \u092A\u093E\u0928\u0940 \u0915\u0940 \u091F\u0902\u0915\u0940 \u092E\u0947\u0902 {baseValue} \u0932\u0940\u091F\u0930 \u092A\u093E\u0928\u0940 \u0939\u0948\u0964 \u0909\u0938\u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u092A\u093E\u0928\u0940 \u0909\u092A\u092F\u094B\u0917 \u0915\u0930 \u0932\u093F\u092F\u093E \u0917\u092F\u093E\u0964 \u0915\u093F\u0924\u0928\u093E \u092A\u093E\u0928\u0940 \u0909\u092A\u092F\u094B\u0917 \u0939\u0941\u0906?",
        difficulty: "Easy"
      },
      "PCT-QL-1901": {
        template: "\u090F\u0915 \u0928\u093F\u0935\u0947\u0936\u0915 \u0915\u094B Rs. {baseValue} \u092A\u0930 {percentageRate}% \u0915\u093E \u0932\u093E\u092D \u0939\u094B\u0924\u093E \u0939\u0948\u0964 \u0932\u093E\u092D \u0915\u0940 \u0930\u093E\u0936\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-002": {
        template: "\u090F\u0915 \u092E\u0924\u0926\u093E\u0928 \u0915\u0947\u0902\u0926\u094D\u0930 \u092A\u0930 {baseValue} \u092A\u0902\u091C\u0940\u0915\u0943\u0924 \u092E\u0924\u0926\u093E\u0924\u093E \u0925\u0947 \u0914\u0930 \u0909\u0928\u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u0928\u0947 \u092E\u0924\u0926\u093E\u0928 \u0915\u093F\u092F\u093E\u0964 \u0915\u093F\u0924\u0928\u0947 \u0935\u094B\u091F \u092A\u0921\u093C\u0947?",
        difficulty: "Easy"
      },
      "PCT-QL-102": {
        template: "\u092A\u0930\u093F\u0923\u093E\u092E-\u092A\u0924\u094D\u0930 \u092E\u0947\u0902 \u0905\u0927\u093F\u0915\u0924\u092E \u0905\u0902\u0915 {baseValue} \u0926\u093F\u090F \u0917\u090F \u0939\u0948\u0902\u0964 \u092F\u0926\u093F \u0915\u093F\u0938\u0940 \u0905\u092D\u094D\u092F\u0930\u094D\u0925\u0940 \u0928\u0947 {percentageRate}% \u0905\u0902\u0915 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u093F\u090F, \u0924\u094B \u0909\u0938\u0928\u0947 \u0915\u093F\u0924\u0928\u0947 \u0905\u0902\u0915 \u092A\u093E\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-202": {
        template: "\u090F\u0915 \u0917\u093E\u0901\u0935 \u0915\u0947 \u0938\u093E\u0915\u094D\u0937\u0930\u0924\u093E \u0938\u0930\u094D\u0935\u0947\u0915\u094D\u0937\u0923 \u092E\u0947\u0902 {baseValue} \u0932\u094B\u0917 \u0936\u093E\u092E\u093F\u0932 \u0939\u0948\u0902\u0964 \u092F\u0926\u093F \u0909\u0928\u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u0938\u093E\u0915\u094D\u0937\u0930 \u0939\u0948\u0902, \u0924\u094B \u0915\u093F\u0924\u0928\u0947 \u0932\u094B\u0917 \u0938\u093E\u0915\u094D\u0937\u0930 \u0939\u0948\u0902?",
        difficulty: "Easy"
      },
      "PCT-QL-302": {
        template: "\u090F\u0915 \u091C\u093F\u0932\u093E \u0938\u0902\u0917\u094D\u0930\u0939\u093E\u0932\u092F \u0915\u0947 \u092A\u093E\u0938 \u0935\u093E\u0930\u094D\u0937\u093F\u0915 \u0930\u0916\u0930\u0916\u093E\u0935 \u0928\u093F\u0927\u093F Rs. {baseValue} \u0939\u0948\u0964 \u0935\u0939 \u0909\u0938\u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u092A\u0941\u0928\u0930\u094D\u0938\u094D\u0925\u093E\u092A\u0928 \u0915\u093E\u0930\u094D\u092F \u092A\u0930 \u0916\u0930\u094D\u091A \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u092A\u0941\u0928\u0930\u094D\u0938\u094D\u0925\u093E\u092A\u0928 \u0935\u094D\u092F\u092F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-402": {
        template: "\u090F\u0915 \u092A\u0941\u0938\u094D\u0924\u0915 \u0915\u093E \u0905\u0902\u0915\u093F\u0924 \u092E\u0942\u0932\u094D\u092F Rs. {baseValue} \u0939\u0948\u0964 \u092F\u0926\u093F \u0909\u0938 \u092A\u0930 {percentageRate}% \u0915\u0940 \u091B\u0942\u091F \u0926\u0940 \u091C\u093E\u0924\u0940 \u0939\u0948, \u0924\u094B \u091B\u0942\u091F \u0915\u0940 \u0930\u093E\u0936\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-502": {
        template: "\u0926\u0948\u0928\u093F\u0915 \u0928\u093F\u0930\u0940\u0915\u094D\u0937\u0923 \u092A\u0924\u094D\u0930\u0915 \u092E\u0947\u0902 {baseValue} \u0909\u0924\u094D\u092A\u093E\u0926\u093F\u0924 \u0907\u0915\u093E\u0907\u092F\u093E\u0901 \u0926\u0930\u094D\u091C \u0939\u0948\u0902, \u091C\u093F\u0928\u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u0916\u0930\u093E\u092C \u0939\u0948\u0902\u0964 \u0915\u093F\u0924\u0928\u0940 \u0916\u0930\u093E\u092C \u0907\u0915\u093E\u0907\u092F\u093E\u0901 \u092E\u093F\u0932\u0940\u0902?",
        difficulty: "Easy"
      },
      "PCT-QL-602": {
        template: "{baseValue} \u091B\u093E\u0924\u094D\u0930\u094B\u0902 \u0915\u0940 \u090F\u0915 \u0915\u0915\u094D\u0937\u093E \u092E\u0947\u0902 {percentageRate}% \u0932\u0921\u093C\u0915\u093F\u092F\u093E\u0901 \u0939\u0948\u0902\u0964 \u0932\u0921\u093C\u0915\u093F\u092F\u094B\u0902 \u0915\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-702": {
        template: "\u090F\u0915 \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0932\u093E \u0935\u093F\u0935\u0930\u0923 \u092E\u0947\u0902 {baseValue} \u0932\u0940\u091F\u0930 \u0935\u093F\u0932\u092F\u0928 \u0926\u0930\u094D\u091C \u0939\u0948, \u091C\u093F\u0938\u092E\u0947\u0902 {percentageRate}% \u092A\u093E\u0928\u0940 \u0939\u0948\u0964 \u0909\u0938\u092E\u0947\u0902 \u0915\u093F\u0924\u0928\u0947 \u0932\u0940\u091F\u0930 \u092A\u093E\u0928\u0940 \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-802": {
        template: "\u0928\u0915\u0926-\u092C\u0939\u0940 \u092E\u0947\u0902 Rs. {baseValue} \u0909\u092A\u0932\u092C\u094D\u0927 \u0926\u093F\u0916\u093E\u090F \u0917\u090F \u0939\u0948\u0902\u0964 \u092F\u0926\u093F \u0909\u0938\u0915\u093E {percentageRate}% \u092D\u0941\u0917\u0924\u093E\u0928 \u0915\u0930 \u0926\u093F\u092F\u093E \u091C\u093E\u090F, \u0924\u094B \u0915\u093F\u0924\u0928\u0940 \u0930\u093E\u0936\u093F \u0926\u0940 \u091C\u093E\u090F\u0917\u0940?",
        difficulty: "Easy"
      },
      "PCT-QL-902": {
        template: "\u090F\u0915 \u092C\u093F\u0915\u094D\u0930\u0940-\u092C\u093F\u0932 \u092E\u0947\u0902 \u092A\u0941\u0938\u094D\u0924\u0915 \u0915\u093E \u0905\u0902\u0915\u093F\u0924 \u092E\u0942\u0932\u094D\u092F Rs. {baseValue} \u0914\u0930 \u091B\u0942\u091F {percentageRate}% \u0926\u0940 \u0917\u0908 \u0939\u0948\u0964 \u091B\u0942\u091F \u0915\u0940 \u0930\u093E\u0936\u093F \u0915\u094D\u092F\u093E \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-1002": {
        template: "\u0915\u0915\u094D\u0937\u093E \u0915\u0940 \u0909\u092A\u0938\u094D\u0925\u093F\u0924\u093F \u0938\u0942\u091A\u0940 \u092E\u0947\u0902 {baseValue} \u0928\u093E\u092E \u0939\u0948\u0902 \u0914\u0930 \u0909\u0928\u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u0909\u092A\u0938\u094D\u0925\u093F\u0924 \u0925\u0947\u0964 \u0915\u093F\u0924\u0928\u0947 \u091B\u093E\u0924\u094D\u0930 \u0909\u092A\u0938\u094D\u0925\u093F\u0924 \u0939\u0941\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-1102": {
        template: "\u092B\u0932 \u092D\u0902\u0921\u093E\u0930 \u0930\u091C\u093F\u0938\u094D\u091F\u0930 \u092E\u0947\u0902 {baseValue} \u0938\u0947\u092C \u0926\u0930\u094D\u091C \u0939\u0948\u0902\u0964 \u092F\u0926\u093F {percentageRate}% \u092C\u093F\u0915 \u0917\u090F, \u0924\u094B \u092C\u093F\u0915\u0947 \u0939\u0941\u090F \u0938\u0947\u092C\u094B\u0902 \u0915\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1202": {
        template: "\u090F\u0915 \u092A\u0930\u093F\u0923\u093E\u092E-\u0938\u093E\u0930 \u092E\u0947\u0902 {baseValue} \u0905\u092D\u094D\u092F\u0930\u094D\u0925\u0940 \u0939\u0948\u0902 \u0914\u0930 \u0909\u0928\u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u092A\u093E\u0938 \u0939\u0941\u090F\u0964 \u0915\u093F\u0924\u0928\u0947 \u0905\u092D\u094D\u092F\u0930\u094D\u0925\u0940 \u092A\u093E\u0938 \u0939\u0941\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-1302": {
        template: "\u0915\u093E\u0930\u094D\u092F\u0936\u093E\u0932\u093E \u0915\u0947 \u0938\u093E\u092E\u0917\u094D\u0930\u0940 \u0905\u092D\u093F\u0932\u0947\u0916 \u092E\u0947\u0902 {baseValue} \u0915\u093F\u0917\u094D\u0930\u093E \u0915\u0940 \u090F\u0915 \u092E\u093F\u0936\u094D\u0930\u0927\u093E\u0924\u0941 \u0926\u0930\u094D\u091C \u0939\u0948\u0964 \u092F\u0926\u093F \u0909\u0938\u0915\u093E {percentageRate}% \u0924\u093E\u0901\u092C\u093E \u0939\u0948, \u0924\u094B \u0924\u093E\u0901\u092C\u0947 \u0915\u093E \u092D\u093E\u0930 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1402": {
        template: "\u090F\u0915 \u0915\u093E\u0930\u094D\u092F\u092A\u0924\u094D\u0930\u0915 \u092E\u0947\u0902 {baseValue} \u0915\u093E {percentageRate}% \u0928\u093F\u0915\u093E\u0932\u0928\u0947 \u0915\u094B \u0915\u0939\u093E \u0917\u092F\u093E \u0939\u0948\u0964 \u092F\u0926\u093F \u0935\u0939 \u092E\u093E\u0928 x \u0939\u0948, \u0924\u094B x \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1502": {
        template: "\u090F\u0915 \u0936\u0947\u0932\u094D\u092B \u0930\u091C\u093F\u0938\u094D\u091F\u0930 \u092E\u0947\u0902 {baseValue} \u092A\u0941\u0938\u094D\u0924\u0915\u0947\u0902 \u0926\u0930\u094D\u091C \u0939\u0948\u0902 \u0914\u0930 \u0909\u0928\u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u0915\u0925\u093E-\u0938\u093E\u0939\u093F\u0924\u094D\u092F \u0915\u0940 \u0939\u0948\u0902\u0964 \u0915\u0925\u093E-\u0938\u093E\u0939\u093F\u0924\u094D\u092F \u0915\u0940 \u0915\u093F\u0924\u0928\u0940 \u092A\u0941\u0938\u094D\u0924\u0915\u0947\u0902 \u0939\u0948\u0902?",
        difficulty: "Easy"
      },
      "PCT-QL-1602": {
        template: "Rs. {baseValue} \u0915\u0940 \u092E\u093E\u0938\u093F\u0915 \u0906\u092F \u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u092C\u091A\u093E\u092F\u093E \u091C\u093E\u0924\u093E \u0939\u0948\u0964 \u092C\u091A\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1702": {
        template: "\u090F\u0915 \u092C\u093E\u0917\u093E\u0928 \u0905\u092D\u093F\u0932\u0947\u0916 \u092E\u0947\u0902 {baseValue} \u092A\u0947\u0921\u093C \u0926\u0930\u094D\u091C \u0939\u0948\u0902, \u091C\u093F\u0928\u092E\u0947\u0902 \u0938\u0947 {percentageRate}% \u0906\u092E \u0915\u0947 \u092A\u0947\u0921\u093C \u0939\u0948\u0902\u0964 \u0906\u092E \u0915\u0947 \u0915\u093F\u0924\u0928\u0947 \u092A\u0947\u0921\u093C \u0939\u0948\u0902?",
        difficulty: "Easy"
      },
      "PCT-QL-1802": {
        template: "\u0906\u092A\u0942\u0930\u094D\u0924\u093F \u0905\u092D\u093F\u0932\u0947\u0916 \u092E\u0947\u0902 {baseValue} \u0932\u0940\u091F\u0930 \u092A\u093E\u0928\u0940 \u0935\u093E\u0932\u0940 \u090F\u0915 \u091F\u0902\u0915\u0940 \u0926\u0930\u094D\u091C \u0939\u0948\u0964 \u092F\u0926\u093F \u0909\u0938\u0915\u093E {percentageRate}% \u0909\u092A\u092F\u094B\u0917 \u0939\u0941\u0906, \u0924\u094B \u0915\u093F\u0924\u0928\u093E \u092A\u093E\u0928\u0940 \u0916\u0930\u094D\u091A \u0939\u0941\u0906?",
        difficulty: "Easy"
      },
      "PCT-QL-1902": {
        template: "\u090F\u0915 \u0935\u094D\u092F\u0935\u0938\u093E\u092F Rs. {baseValue} \u0915\u0947 \u0928\u093F\u0935\u0947\u0936 \u092A\u0930 {percentageRate}% \u0932\u093E\u092D \u0915\u092E\u093E\u0924\u093E \u0939\u0948\u0964 \u0932\u093E\u092D \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-003": {
        template: "{percentageRate}% \u0915\u094B \u0909\u0938\u0915\u0947 \u0938\u0930\u0932\u0924\u092E \u092D\u093F\u0928\u094D\u0928 \u0930\u0942\u092A \u092E\u0947\u0902 \u092C\u0926\u0932\u0947\u0902\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-103": {
        template: "{percentageRate}% \u0915\u094B \u0928\u094D\u092F\u0942\u0928\u0924\u092E \u0930\u0942\u092A \u0935\u093E\u0932\u0947 \u092D\u093F\u0928\u094D\u0928 \u092E\u0947\u0902 \u0935\u094D\u092F\u0915\u094D\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-203": {
        template: "{percentageRate}% \u0915\u093E \u0938\u092E\u0924\u0941\u0932\u094D\u092F \u092D\u093F\u0928\u094D\u0928 \u0915\u094D\u092F\u093E \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-303": {
        template: "{percentageRate}% \u0915\u094B \u0938\u0930\u0932 \u092D\u093F\u0928\u094D\u0928 \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0932\u093F\u0916\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-403": {
        template: "{percentageRate}% \u0915\u094B \u092D\u093F\u0928\u094D\u0928 \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0932\u093F\u0916\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-503": {
        template: "{percentageRate}% \u0915\u094B \u0909\u0938\u0915\u0947 \u0938\u0930\u0932\u0924\u092E \u092D\u093F\u0928\u094D\u0928 \u092E\u0947\u0902 \u092C\u0926\u0932\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-603": {
        template: "{percentageRate}% \u0915\u0947 \u0920\u0940\u0915 \u092C\u0930\u093E\u092C\u0930 \u0915\u094C\u0928-\u0938\u093E \u092D\u093F\u0928\u094D\u0928 \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-703": {
        template: "\u092A\u094D\u0930\u0924\u093F\u0936\u0924 {percentageRate}% \u0915\u094B \u092D\u093F\u0928\u094D\u0928 \u0930\u0942\u092A \u092E\u0947\u0902 \u092C\u0926\u0932\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-803": {
        template: "{percentageRate}% \u0915\u094B \u0938\u0930\u0932 \u092D\u093F\u0928\u094D\u0928 \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0932\u093F\u0916\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-903": {
        template: "{percentageRate}% \u0926\u094D\u0935\u093E\u0930\u093E \u0928\u093F\u0930\u0942\u092A\u093F\u0924 \u092D\u093F\u0928\u094D\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1003": {
        template: "{percentageRate}% \u0915\u094B \u0928\u094D\u092F\u0942\u0928\u0924\u092E \u0930\u0942\u092A \u0935\u093E\u0932\u0947 \u092D\u093F\u0928\u094D\u0928 \u092E\u0947\u0902 \u0932\u093F\u0916\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1103": {
        template: "{percentageRate}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0915\u094C\u0928-\u0938\u093E \u092D\u093F\u0928\u094D\u0928 \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-1203": {
        template: "{percentageRate}% \u0915\u093E \u0938\u092C\u0938\u0947 \u0938\u0930\u0932 \u092D\u093F\u0928\u094D\u0928 \u0932\u093F\u0916\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1303": {
        template: "{percentageRate}% \u0915\u094B \u0938\u092E\u0924\u0941\u0932\u094D\u092F \u092D\u093F\u0928\u094D\u0928 \u092E\u0947\u0902 \u092C\u0926\u0932\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1403": {
        template: "{percentageRate}% \u0915\u094B \u092D\u093F\u0928\u094D\u0928 \u092E\u0947\u0902 \u092C\u0926\u0932\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1503": {
        template: "{percentageRate}% \u0915\u0947 \u0932\u093F\u090F \u092D\u093F\u0928\u094D\u0928 \u0932\u093F\u0916\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1603": {
        template: "\u092F\u0926\u093F \u0915\u094B\u0908 \u092E\u093E\u0928 {percentageRate}% \u0939\u0948, \u0924\u094B \u0935\u0939 \u092A\u0942\u0930\u0947 \u0915\u093E \u0915\u094C\u0928-\u0938\u093E \u092D\u093F\u0928\u094D\u0928 \u0939\u094B\u0917\u093E?",
        difficulty: "Easy"
      },
      "PCT-QL-1703": {
        template: "{percentageRate}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0938\u0930\u0932\u0924\u092E \u092D\u093F\u0928\u094D\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1803": {
        template: "{percentageRate}% \u0915\u0947 \u0938\u092E\u0924\u0941\u0932\u094D\u092F \u092D\u093F\u0928\u094D\u0928 \u0932\u093F\u0916\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1903": {
        template: "{percentageRate}% \u0915\u094B \u092D\u093F\u0928\u094D\u0928 \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0935\u094D\u092F\u0915\u094D\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-004": {
        template: "{baseValue} \u0915\u093E {value} \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-104": {
        template: "\u0915\u093F\u0938\u0940 \u091B\u093E\u0924\u094D\u0930 \u0928\u0947 \u0915\u0941\u0932 {baseValue} \u0905\u0902\u0915\u094B\u0902 \u092E\u0947\u0902 \u0938\u0947 {value} \u0905\u0902\u0915 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u093F\u090F\u0964 \u0909\u0938\u0915\u093E \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-204": {
        template: "\u0915\u0941\u0932 {baseValue} \u0938\u0947\u092C\u094B\u0902 \u092E\u0947\u0902 \u0938\u0947 {value} \u0938\u0947\u092C \u0938\u0921\u093C\u0947 \u0939\u0941\u090F \u0925\u0947\u0964 \u0938\u0921\u093C\u0947 \u0939\u0941\u090F \u0938\u0947\u092C\u094B\u0902 \u0915\u093E \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-304": {
        template: "\u0915\u094B\u0908 \u0935\u094D\u092F\u0915\u094D\u0924\u093F \u0905\u092A\u0928\u0940 \u0915\u0941\u0932 \u092E\u093E\u0938\u093F\u0915 \u0906\u092F Rs. {baseValue} \u092E\u0947\u0902 \u0938\u0947 Rs. {value} \u092C\u091A\u093E\u0924\u093E \u0939\u0948\u0964 \u0909\u0938\u0915\u0940 \u092C\u091A\u0924 \u0915\u093E \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-404": {
        template: "\u092F\u0926\u093F {baseValue} \u0935\u0938\u094D\u0924\u0941\u0913\u0902 \u0915\u0947 \u090F\u0915 \u092C\u0948\u091A \u092E\u0947\u0902 {value} \u0935\u0938\u094D\u0924\u0941\u090F\u0901 \u0916\u0930\u093E\u092C \u0939\u0948\u0902, \u0924\u094B \u0916\u0930\u093E\u092C\u0940 \u0915\u0940 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0926\u0930 \u0915\u094D\u092F\u093E \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-504": {
        template: "\u090F\u0915 \u091A\u0941\u0928\u093E\u0935 \u092E\u0947\u0902 \u0915\u093F\u0938\u0940 \u092A\u094D\u0930\u0924\u094D\u092F\u093E\u0936\u0940 \u0915\u094B \u0915\u0941\u0932 {baseValue} \u0935\u0948\u0927 \u092E\u0924\u094B\u0902 \u092E\u0947\u0902 \u0938\u0947 {value} \u092E\u0924 \u092E\u093F\u0932\u0947\u0964 \u0909\u0938\u0928\u0947 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092E\u0924 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-604": {
        template: "\u0915\u093F\u0938\u0940 \u0935\u0938\u094D\u0924\u0941 \u0915\u093E \u0915\u094D\u0930\u092F \u092E\u0942\u0932\u094D\u092F Rs. {baseValue} \u0939\u0948 \u0914\u0930 \u0932\u093E\u092D Rs. {value} \u0939\u0948\u0964 \u0932\u093E\u092D \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-704": {
        template: "{baseValue} \u0932\u0940\u091F\u0930 \u0915\u0947 \u092E\u093F\u0936\u094D\u0930\u0923 \u092E\u0947\u0902 {value} \u0932\u0940\u091F\u0930 \u0926\u0942\u0927 \u0939\u0948\u0964 \u092E\u093F\u0936\u094D\u0930\u0923 \u092E\u0947\u0902 \u0926\u0942\u0927 \u0915\u093E \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-804": {
        template: "{baseValue} \u091B\u093E\u0924\u094D\u0930\u094B\u0902 \u0915\u0940 \u090F\u0915 \u0915\u0915\u094D\u0937\u093E \u092E\u0947\u0902 {value} \u0932\u0921\u093C\u0915\u093F\u092F\u093E\u0901 \u0939\u0948\u0902\u0964 \u0932\u0921\u093C\u0915\u093F\u092F\u094B\u0902 \u0915\u093E \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0915\u094D\u092F\u093E \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-904": {
        template: "\u092F\u0926\u093F \u0915\u0941\u0932 {baseValue} \u0915\u093F\u092E\u0940 \u0915\u0940 \u092F\u093E\u0924\u094D\u0930\u093E \u092E\u0947\u0902 \u0938\u0947 {value} \u0915\u093F\u092E\u0940 \u092A\u0942\u0930\u0940 \u0939\u094B \u0917\u0908 \u0939\u0948, \u0924\u094B \u092F\u093E\u0924\u094D\u0930\u093E \u0915\u093E \u0915\u093F\u0924\u0928\u093E \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092A\u0942\u0930\u093E \u0939\u0941\u0906?",
        difficulty: "Easy"
      },
      "PCT-QL-1004": {
        template: "\u090F\u0915 \u0926\u0941\u0915\u093E\u0928\u0926\u093E\u0930 \u0928\u0947 Rs. {value} \u0915\u0940 \u091B\u0942\u091F Rs. {baseValue} \u0915\u0947 \u0905\u0902\u0915\u093F\u0924 \u092E\u0942\u0932\u094D\u092F \u092A\u0930 \u0926\u0940\u0964 \u091B\u0942\u091F \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1104": {
        template: "{baseValue} \u0915\u0940 \u091C\u0928\u0938\u0902\u0916\u094D\u092F\u093E \u092E\u0947\u0902 \u0938\u0947 {value} \u0932\u094B\u0917 \u0938\u093E\u0915\u094D\u0937\u0930 \u0939\u0948\u0902\u0964 \u0938\u093E\u0915\u094D\u0937\u0930\u0924\u093E \u0926\u0930 \u0915\u094D\u092F\u093E \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-1204": {
        template: "\u0915\u094B\u0908 \u0935\u094D\u092F\u0915\u094D\u0924\u093F \u0905\u092A\u0928\u0947 Rs. {baseValue} \u0935\u0947\u0924\u0928 \u092E\u0947\u0902 \u0938\u0947 Rs. {value} \u0915\u093F\u0930\u093E\u090F \u092A\u0930 \u0916\u0930\u094D\u091A \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u0909\u0938\u0915\u0947 \u0935\u0947\u0924\u0928 \u0915\u093E \u0915\u093F\u0924\u0928\u093E \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0915\u093F\u0930\u093E\u090F \u092E\u0947\u0902 \u091C\u093E\u0924\u093E \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-1304": {
        template: "\u092F\u0926\u093F \u0915\u093F\u0938\u0940 \u0915\u093E\u0930\u0916\u093E\u0928\u0947 \u0915\u093E \u0932\u0915\u094D\u0937\u094D\u092F {baseValue} \u0907\u0915\u093E\u0907\u092F\u093E\u0901 \u0925\u093E \u0914\u0930 \u0909\u0938\u0928\u0947 {value} \u0907\u0915\u093E\u0907\u092F\u093E\u0901 \u092C\u0928\u093E\u0908, \u0924\u094B \u0932\u0915\u094D\u0937\u094D\u092F \u0915\u093E \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092A\u0942\u0930\u093E \u0939\u0941\u0906?",
        difficulty: "Easy"
      },
      "PCT-QL-1404": {
        template: "\u090F\u0915 \u092A\u0941\u0938\u094D\u0924\u0915 \u092E\u0947\u0902 {baseValue} \u092A\u0943\u0937\u094D\u0920 \u0939\u0948\u0902 \u0914\u0930 {value} \u092A\u0943\u0937\u094D\u0920 \u091A\u093F\u0924\u094D\u0930\u092F\u0941\u0915\u094D\u0924 \u0939\u0948\u0902\u0964 \u092A\u0941\u0938\u094D\u0924\u0915 \u0915\u093E \u0915\u093F\u0924\u0928\u093E \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092D\u093E\u0917 \u091A\u093F\u0924\u094D\u0930\u092F\u0941\u0915\u094D\u0924 \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-1504": {
        template: "\u0905\u0902\u0915\u093F\u0924 \u092E\u0942\u0932\u094D\u092F Rs. {baseValue} \u0939\u0948 \u0914\u0930 \u0935\u093F\u0915\u094D\u0930\u092F \u092E\u0942\u0932\u094D\u092F \u0909\u0938\u0938\u0947 Rs. {value} \u0915\u092E \u0939\u0948\u0964 \u091B\u0942\u091F \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0915\u094D\u092F\u093E \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-1604": {
        template: "{value} \u0915\u093F\u0917\u094D\u0930\u093E \u0924\u093E\u0901\u092C\u093E \u0905\u0928\u094D\u092F \u0927\u093E\u0924\u0941\u0913\u0902 \u0915\u0947 \u0938\u093E\u0925 \u092E\u093F\u0932\u093E\u0915\u0930 {baseValue} \u0915\u093F\u0917\u094D\u0930\u093E \u0915\u0940 \u092E\u093F\u0936\u094D\u0930\u0927\u093E\u0924\u0941 \u092C\u0928\u093E\u0908 \u0917\u0908\u0964 \u0924\u093E\u0901\u092C\u0947 \u0915\u093E \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1704": {
        template: "\u092F\u0926\u093F \u0915\u094B\u0908 \u091B\u093E\u0924\u094D\u0930 \u0915\u0941\u0932 {baseValue} \u0915\u093E\u0930\u094D\u092F-\u0926\u093F\u0935\u0938\u094B\u0902 \u092E\u0947\u0902 \u0938\u0947 {value} \u0926\u093F\u0928 \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u091C\u093E\u0924\u093E \u0939\u0948, \u0924\u094B \u0909\u0938\u0915\u0940 \u0909\u092A\u0938\u094D\u0925\u093F\u0924\u093F \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1804": {
        template: "{baseValue} \u0932\u0940\u091F\u0930 \u0915\u094D\u0937\u092E\u0924\u093E \u0915\u0940 \u090F\u0915 \u091F\u0902\u0915\u0940 \u092E\u0947\u0902 \u0907\u0938 \u0938\u092E\u092F {value} \u0932\u0940\u091F\u0930 \u092A\u093E\u0928\u0940 \u0939\u0948\u0964 \u091F\u0902\u0915\u0940 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092D\u0930\u0940 \u0939\u0941\u0908 \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-1904": {
        template: "\u0915\u093F\u0938\u0940 \u092A\u0930\u093F\u092F\u094B\u091C\u0928\u093E \u0915\u0947 \u0932\u093F\u090F \u0906\u0935\u0902\u091F\u093F\u0924 Rs. {baseValue} \u092E\u0947\u0902 \u0938\u0947 Rs. {value} \u0916\u0930\u094D\u091A \u0915\u093F\u090F \u0917\u090F\u0964 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0916\u0930\u094D\u091A \u0939\u0941\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-005": {
        template: "A, B \u0915\u093E {percentageRate}% \u0939\u0948\u0964 \u092F\u0926\u093F B = {baseValue}, \u0924\u094B A \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-105": {
        template: "\u092F\u0926\u093F B = {baseValue} \u0914\u0930 A, B \u0915\u093E {percentageRate}% \u0939\u0948, \u0924\u094B A \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-205": {
        template: "B = {baseValue} \u0939\u0948\u0964 A, B \u0915\u093E {percentageRate}% \u0939\u0948\u0964 A \u0915\u094D\u092F\u093E \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-305": {
        template: "B \u0915\u093E {percentageRate}% = A \u0939\u0948\u0964 \u092F\u0926\u093F B = {baseValue}, \u0924\u094B A \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-405": {
        template: "A, B \u0915\u093E {percentageRate}% \u0939\u0948\u0964 \u092F\u0926\u093F B = {baseValue}, \u0924\u094B A \u0915\u093E \u092E\u093E\u0928 \u0915\u094D\u092F\u093E \u0939\u094B\u0917\u093E?",
        difficulty: "Easy"
      },
      "PCT-QL-006": {
        template: "A, B \u0938\u0947 {percentageRate}% \u0905\u0927\u093F\u0915 \u0939\u0948\u0964 B, A \u0938\u0947 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0915\u092E \u0939\u0948?",
        difficulty: "Medium"
      },
      "PCT-QL-106": {
        template: "\u092F\u0926\u093F A, B \u0938\u0947 {percentageRate}% \u0905\u0927\u093F\u0915 \u0939\u0948, \u0924\u094B B, A \u0938\u0947 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0915\u092E \u0939\u0948?",
        difficulty: "Medium"
      },
      "PCT-QL-206": {
        template: "A, B \u0938\u0947 {percentageRate}% \u0905\u0927\u093F\u0915 \u0939\u0948\u0964 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F \u0915\u093F B, A \u0938\u0947 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0915\u092E \u0939\u0948\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-306": {
        template: "A, B \u0938\u0947 {percentageRate}% \u0905\u0927\u093F\u0915 \u0939\u0948\u0964 B, A \u0938\u0947 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0915\u092E \u0939\u0948?",
        difficulty: "Medium"
      },
      "PCT-QL-406": {
        template: "\u092F\u0926\u093F A, B \u0938\u0947 {percentageRate}% \u0905\u0927\u093F\u0915 \u0939\u0948, \u0924\u094B B, A \u0938\u0947 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0915\u092E \u0939\u0948?",
        difficulty: "Medium"
      },
      "PCT-QL-007": {
        template: "A, B \u0938\u0947 {percentageRate}% \u0915\u092E \u0939\u0948\u0964 B, A \u0938\u0947 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0905\u0927\u093F\u0915 \u0939\u0948?",
        difficulty: "Medium"
      },
      "PCT-QL-107": {
        template: "\u092F\u0926\u093F A, B \u0938\u0947 {percentageRate}% \u0915\u092E \u0939\u0948, \u0924\u094B B, A \u0938\u0947 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0905\u0927\u093F\u0915 \u0939\u0948?",
        difficulty: "Medium"
      },
      "PCT-QL-207": {
        template: "A, B \u0938\u0947 {percentageRate}% \u0915\u092E \u0939\u0948\u0964 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F \u0915\u093F B, A \u0938\u0947 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0905\u0927\u093F\u0915 \u0939\u0948\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-307": {
        template: "A, B \u0938\u0947 {percentageRate}% \u0915\u092E \u0939\u0948\u0964 B, A \u0938\u0947 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0905\u0927\u093F\u0915 \u0939\u0948?",
        difficulty: "Medium"
      },
      "PCT-QL-407": {
        template: "\u092F\u0926\u093F A, B \u0938\u0947 {percentageRate}% \u0915\u092E \u0939\u0948, \u0924\u094B B, A \u0938\u0947 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0905\u0927\u093F\u0915 \u0939\u0948?",
        difficulty: "Medium"
      },
      "PCT-QL-008": {
        template: "\u092F\u0926\u093F A \u0915\u093E {rate1}%, B \u0915\u0947 {rate2}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948, \u0924\u094B A:B \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-108": {
        template: "\u092F\u0926\u093F A \u0915\u093E {rate1}%, B \u0915\u0947 {rate2}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948, \u0924\u094B A:B \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-208": {
        template: "A \u0915\u093E {rate1}%, B \u0915\u0947 {rate2}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948\u0964 A:B \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-308": {
        template: "\u092F\u0926\u093F A \u0915\u093E {rate1}% \u0914\u0930 B \u0915\u093E {rate2}% \u092C\u0930\u093E\u092C\u0930 \u0939\u0948, \u0924\u094B A:B \u0915\u094D\u092F\u093E \u0939\u094B\u0917\u093E?",
        difficulty: "Medium"
      },
      "PCT-QL-408": {
        template: "\u091C\u092C A \u0915\u093E {rate1}%, B \u0915\u0947 {rate2}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u094B, \u0924\u094B A:B \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-009": {
        template: "\u092F\u0926\u093F \u0915\u093F\u0938\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u0915\u093E {percentageRate}% = {value} \u0939\u0948, \u0924\u094B \u0935\u0939 \u0938\u0902\u0916\u094D\u092F\u093E \u0915\u094D\u092F\u093E \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-109": {
        template: "\u0915\u093F\u0938\u0940 \u091B\u093E\u0924\u094D\u0930 \u0928\u0947 {value} \u0905\u0902\u0915 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u093F\u090F, \u091C\u094B \u0905\u0927\u093F\u0915\u0924\u092E \u0905\u0902\u0915\u094B\u0902 \u0915\u093E {percentageRate}% \u0939\u0948\u0964 \u0905\u0927\u093F\u0915\u0924\u092E \u0905\u0902\u0915 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-209": {
        template: "\u0915\u093F\u0938\u0940 \u0935\u094D\u092F\u0915\u094D\u0924\u093F \u0915\u0940 \u092E\u093E\u0938\u093F\u0915 \u0906\u092F \u0915\u093E {percentageRate}% = Rs. {value} \u0939\u0948\u0964 \u0909\u0938\u0915\u0940 \u0915\u0941\u0932 \u092E\u093E\u0938\u093F\u0915 \u0906\u092F \u0915\u094D\u092F\u093E \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-309": {
        template: "\u090F\u0915 \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u092E\u0947\u0902 {value} \u091B\u093E\u0924\u094D\u0930 \u0915\u094D\u0930\u093F\u0915\u0947\u091F \u0916\u0947\u0932\u0924\u0947 \u0939\u0948\u0902, \u091C\u094B \u0915\u0941\u0932 \u0938\u0902\u0916\u094D\u092F\u093E \u0915\u093E {percentageRate}% \u0939\u0948\u0902\u0964 \u0915\u0941\u0932 \u091B\u093E\u0924\u094D\u0930\u094B\u0902 \u0915\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-409": {
        template: "\u0905\u092A\u0928\u093E {percentageRate}% \u0927\u0928 \u0916\u0930\u094D\u091A \u0915\u0930\u0928\u0947 \u0915\u0947 \u092C\u093E\u0926 \u0915\u093F\u0938\u0940 \u0935\u094D\u092F\u0915\u094D\u0924\u093F \u0915\u0947 \u092A\u093E\u0938 Rs. {value} \u0936\u0947\u0937 \u092C\u091A\u0924\u0947 \u0939\u0948\u0902\u0964 \u0909\u0938\u0915\u0940 \u092A\u094D\u0930\u093E\u0930\u0902\u092D\u093F\u0915 \u0915\u0941\u0932 \u0930\u093E\u0936\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-509": {
        template: "\u090F\u0915 \u0926\u0941\u0915\u093E\u0928\u0926\u093E\u0930 \u0928\u0947 {value} \u0935\u0938\u094D\u0924\u0941\u090F\u0901 \u092C\u0947\u091A\u0940\u0902, \u091C\u094B \u0909\u0938\u0915\u0947 \u0915\u0941\u0932 \u092D\u0902\u0921\u093E\u0930 \u0915\u093E {percentageRate}% \u0925\u0940\u0902\u0964 \u0909\u0938\u0915\u093E \u0915\u0941\u0932 \u092D\u0902\u0921\u093E\u0930 \u0915\u093F\u0924\u0928\u093E \u0925\u093E?",
        difficulty: "Easy"
      },
      "PCT-QL-609": {
        template: "\u092F\u0926\u093F {percentageRate}% \u0915\u0940 \u091B\u0942\u091F Rs. {value} \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948, \u0924\u094B \u0905\u0902\u0915\u093F\u0924 \u092E\u0942\u0932\u094D\u092F \u0915\u094D\u092F\u093E \u0939\u094B\u0917\u093E?",
        difficulty: "Easy"
      },
      "PCT-QL-709": {
        template: "\u0915\u093F\u0938\u0940 \u0935\u0938\u094D\u0924\u0941 \u0915\u094B \u092C\u0947\u091A\u0928\u0947 \u092A\u0930 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0932\u093E\u092D Rs. {value} \u0939\u0948, \u091C\u094B \u0909\u0938\u0915\u0947 \u0915\u094D\u0930\u092F \u092E\u0942\u0932\u094D\u092F \u0915\u093E {percentageRate}% \u0939\u0948\u0964 \u0915\u094D\u0930\u092F \u092E\u0942\u0932\u094D\u092F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-809": {
        template: "\u092F\u0926\u093F \u0915\u093F\u0938\u0940 \u0928\u0917\u0930 \u0915\u0940 \u091C\u0928\u0938\u0902\u0916\u094D\u092F\u093E \u0915\u093E {percentageRate}% = {value} \u0939\u0948, \u0924\u094B \u0915\u0941\u0932 \u091C\u0928\u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-909": {
        template: "\u090F\u0915 \u0915\u093E\u0930 \u0915\u0947 \u092E\u0942\u0932\u094D\u092F \u092E\u0947\u0902 {percentageRate}% \u0915\u0940 \u0915\u092E\u0940 \u0906\u0924\u0940 \u0939\u0948, \u091C\u094B Rs. {value} \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948\u0964 \u0909\u0938\u0915\u093E \u092E\u0942\u0932 \u092E\u0942\u0932\u094D\u092F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1009": {
        template: "\u090F\u0915 \u091F\u0902\u0915\u0940 \u0938\u0947 {value} \u0932\u0940\u091F\u0930 \u092A\u093E\u0928\u0940 \u0928\u093F\u0915\u0932 \u0917\u092F\u093E, \u091C\u094B \u0909\u0938\u0915\u0940 \u0915\u0941\u0932 \u0915\u094D\u0937\u092E\u0924\u093E \u0915\u093E {percentageRate}% \u0925\u093E\u0964 \u091F\u0902\u0915\u0940 \u0915\u0940 \u0915\u0941\u0932 \u0915\u094D\u0937\u092E\u0924\u093E \u0915\u094D\u092F\u093E \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-1109": {
        template: "\u0915\u094B\u0908 \u0935\u094D\u092F\u0915\u094D\u0924\u093F Rs. {value} \u0906\u092F\u0915\u0930 \u0926\u0947\u0924\u093E \u0939\u0948, \u091C\u094B \u0909\u0938\u0915\u0947 \u0938\u0915\u0932 \u0935\u0947\u0924\u0928 \u0915\u093E {percentageRate}% \u0939\u0948\u0964 \u0909\u0938\u0915\u093E \u0938\u0915\u0932 \u0935\u0947\u0924\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1209": {
        template: "\u092F\u0926\u093F \u0915\u093F\u0938\u0940 \u092F\u093E\u0924\u094D\u0930\u093E \u0915\u093E {percentageRate}% = {value} \u0915\u093F\u092E\u0940 \u0939\u0948, \u0924\u094B \u0915\u0941\u0932 \u0926\u0942\u0930\u0940 \u0915\u094D\u092F\u093E \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-1309": {
        template: "\u090F\u0915 \u0915\u0915\u094D\u0937\u093E \u092E\u0947\u0902 \u0905\u0928\u0941\u092A\u0938\u094D\u0925\u093F\u0924 \u091B\u093E\u0924\u094D\u0930\u094B\u0902 \u0915\u0940 \u0938\u0902\u0916\u094D\u092F\u093E {value} \u0939\u0948, \u091C\u094B \u0915\u0941\u0932 \u0938\u0902\u0916\u094D\u092F\u093E \u0915\u093E {percentageRate}% \u0939\u0948\u0964 \u0915\u0941\u0932 \u091B\u093E\u0924\u094D\u0930\u094B\u0902 \u0915\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1409": {
        template: "\u092F\u0926\u093F \u0915\u093F\u0938\u0940 \u092E\u093F\u0936\u094D\u0930\u0927\u093E\u0924\u0941 \u092E\u0947\u0902 {value} \u0915\u093F\u0917\u094D\u0930\u093E \u091C\u0938\u094D\u0924\u093E \u0939\u0948, \u091C\u094B \u0909\u0938\u0915\u0947 \u0915\u0941\u0932 \u092D\u093E\u0930 \u0915\u093E {percentageRate}% \u0939\u0948, \u0924\u094B \u0915\u0941\u0932 \u092D\u093E\u0930 \u0915\u094D\u092F\u093E \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-1509": {
        template: "\u090F\u0915 \u0935\u094D\u092F\u093E\u092A\u093E\u0930\u0940 \u0915\u094B Rs. {value} \u0915\u093E \u0928\u0941\u0915\u0938\u093E\u0928 \u0939\u0941\u0906, \u091C\u094B \u0909\u0938\u0915\u0947 \u0928\u093F\u0935\u0947\u0936 \u0915\u093E {percentageRate}% \u0939\u0948\u0964 \u0909\u0938\u0915\u093E \u0915\u0941\u0932 \u0928\u093F\u0935\u0947\u0936 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1609": {
        template: "\u092F\u0926\u093F \u0915\u093F\u0938\u0940 \u092A\u0941\u0938\u094D\u0924\u0915 \u0915\u093E {percentageRate}% \u092D\u093E\u0917 {value} \u091A\u093F\u0924\u094D\u0930\u092F\u0941\u0915\u094D\u0924 \u092A\u0943\u0937\u094D\u0920\u094B\u0902 \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948, \u0924\u094B \u092A\u0941\u0938\u094D\u0924\u0915 \u092E\u0947\u0902 \u0915\u0941\u0932 \u0915\u093F\u0924\u0928\u0947 \u092A\u0943\u0937\u094D\u0920 \u0939\u0948\u0902?",
        difficulty: "Easy"
      },
      "PCT-QL-1709": {
        template: "\u0915\u093F\u0938\u0940 \u0930\u093E\u0936\u093F \u092A\u0930 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u092C\u094D\u092F\u093E\u091C Rs. {value} \u0939\u0948, \u091C\u094B \u092E\u0942\u0932\u0927\u0928 \u0915\u093E {percentageRate}% \u0939\u0948\u0964 \u092E\u0942\u0932\u0927\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1809": {
        template: "{value} \u0916\u0930\u093E\u092C \u0935\u0938\u094D\u0924\u0941\u090F\u0901 \u0926\u0948\u0928\u093F\u0915 \u0909\u0924\u094D\u092A\u093E\u0926\u0928 \u092C\u0948\u091A \u0915\u093E {percentageRate}% \u0939\u0948\u0902\u0964 \u092C\u0948\u091A \u0915\u093E \u0915\u0941\u0932 \u0906\u0915\u093E\u0930 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1909": {
        template: "\u092F\u0926\u093F \u0915\u093F\u0938\u0940 \u091A\u0941\u0928\u093E\u0935 \u092E\u0947\u0902 \u092A\u0921\u093C\u0947 \u0915\u0941\u0932 \u092E\u0924\u094B\u0902 \u0915\u093E {percentageRate}% = {value} \u0925\u093E, \u0924\u094B \u0915\u0941\u0932 \u092A\u0921\u093C\u0947 \u092E\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      }
    }
  },
  "PCT-CP-002": {
    families: {
      "PCT-QL-010": {
        template: "\u092F\u0926\u093F {baseValue} \u092E\u0947\u0902 {percentageRate}% \u0915\u0940 \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0940 \u091C\u093E\u090F, \u0924\u094B \u0928\u092F\u093E \u092E\u093E\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-011": {
        template: "\u092F\u0926\u093F {baseValue} \u092E\u0947\u0902 {percentageRate}% \u0915\u0940 \u0915\u092E\u0940 \u0915\u0940 \u091C\u093E\u090F, \u0924\u094B \u0928\u092F\u093E \u092E\u093E\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-012": {
        template: "\u0915\u093F\u0938\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u092E\u0947\u0902 \u0909\u0938\u0915\u093E {percentageRate}% \u091C\u094B\u0921\u093C\u0928\u0947 \u092A\u0930 {finalValue} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-013": {
        template: "\u0915\u093F\u0938\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u092E\u0947\u0902 \u0938\u0947 \u0909\u0938\u0915\u093E {percentageRate}% \u0918\u091F\u093E\u0928\u0947 \u092A\u0930 {finalValue} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-014": {
        template: "{percentageRate}% \u092C\u0922\u093C\u0928\u0947 \u0915\u0947 \u092C\u093E\u0926 \u090F\u0915 \u0938\u0902\u0916\u094D\u092F\u093E {finalValue} \u0939\u094B \u091C\u093E\u0924\u0940 \u0939\u0948\u0964 \u092A\u0941\u0930\u093E\u0928\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u0915\u094D\u092F\u093E \u0925\u0940?",
        difficulty: "Medium"
      },
      "PCT-QL-015": {
        template: "\u090F\u0915 \u0935\u094D\u092F\u0915\u094D\u0924\u093F \u0915\u093E \u0935\u0947\u0924\u0928 {percentageRate}% \u092C\u0922\u093C\u0915\u0930 Rs. {finalValue} \u0939\u094B \u0917\u092F\u093E\u0964 \u092A\u0941\u0930\u093E\u0928\u093E \u0935\u0947\u0924\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-016": {
        template: "\u0915\u093F\u0938\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u092E\u0947\u0902 {value} \u091C\u094B\u0921\u093C\u0928\u093E, \u0909\u0938\u092E\u0947\u0902 {percentageRate}% \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948\u0964 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-017": {
        template: "\u0915\u093F\u0938\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u0915\u093E {rate1}% = {value1} \u0939\u0948\u0964 \u0909\u0938\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u0915\u093E {rate2}% \u0915\u093F\u0924\u0928\u093E \u0939\u094B\u0917\u093E?",
        difficulty: "Easy"
      },
      "PCT-QL-018": {
        template: "\u0915\u093F\u0938\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u0915\u0947 {rate1}% \u0914\u0930 {rate2}% \u0915\u093E \u0905\u0902\u0924\u0930 {value} \u0939\u0948\u0964 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-019": {
        template: "{percentageRate}% \u0915\u092E\u0940 \u0915\u0947 \u092C\u093E\u0926 \u092A\u0941\u0930\u093E\u0928\u0947 \u092E\u093E\u0928 \u092A\u0930 \u0932\u094C\u091F\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0930\u0928\u0940 \u0939\u094B\u0917\u0940?",
        difficulty: "Hard"
      },
      "PCT-QL-110": {
        template: "\u090F\u0915 \u092D\u0902\u0921\u093E\u0930-\u092A\u0902\u091C\u0940 \u092E\u0947\u0902 {baseValue} \u0907\u0915\u093E\u0907\u092F\u093E\u0901 {percentageRate}% \u0938\u0902\u0936\u094B\u0927\u0928 \u0938\u0947 \u092A\u0939\u0932\u0947 \u0926\u0930\u094D\u091C \u0939\u0948\u0902\u0964 \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u093E\u0926 \u0938\u0902\u0936\u094B\u0927\u093F\u0924 \u092D\u0902\u0921\u093E\u0930 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-210": {
        template: "\u090F\u0915 \u092E\u093E\u0928 {baseValue} \u0938\u0947 \u0936\u0941\u0930\u0942 \u0939\u094B\u0924\u093E \u0939\u0948 \u0914\u0930 \u0909\u0938\u092E\u0947\u0902 {percentageRate}% \u0915\u0940 \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0940 \u091C\u093E\u0924\u0940 \u0939\u0948\u0964 \u0938\u0902\u0936\u094B\u0927\u093F\u0924 \u092E\u093E\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-310": {
        template: "\u090F\u0915 \u0935\u093F\u092D\u093E\u0917 \u092E\u0947\u0902 {baseValue} \u0938\u094D\u0935\u0940\u0915\u0943\u0924 \u092A\u0926 \u0925\u0947\u0964 {percentageRate}% \u0915\u0940 \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u093E\u0926 \u092A\u0926\u094B\u0902 \u0915\u0940 \u0938\u0902\u0936\u094B\u0927\u093F\u0924 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-410": {
        template: "\u090F\u0915 \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u0915\u094D\u0932\u092C \u092E\u0947\u0902 {baseValue} \u0938\u0926\u0938\u094D\u092F \u0925\u0947\u0964 {percentageRate}% \u0915\u0940 \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u093E\u0926 \u0938\u0902\u0936\u094B\u0927\u093F\u0924 \u0938\u0926\u0938\u094D\u092F \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-111": {
        template: "\u090F\u0915 \u0905\u092D\u093F\u0932\u0947\u0916 \u092E\u0947\u0902 {baseValue} \u0938\u0902\u0916\u094D\u092F\u093E {percentageRate}% \u0915\u0940 \u0915\u092E\u0940 \u0938\u0947 \u092A\u0939\u0932\u0947 \u0926\u0930\u094D\u091C \u0939\u0948\u0964 \u0938\u0902\u0936\u094B\u0927\u093F\u0924 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-211": {
        template: "\u0935\u0930\u094D\u0937\u093E \u0905\u092D\u093F\u0932\u0947\u0916 \u092E\u0947\u0902 \u092A\u093F\u091B\u0932\u0947 \u0935\u0930\u094D\u0937 {baseValue} \u092E\u093F\u092E\u0940 \u0935\u0930\u094D\u0937\u093E \u0926\u0930\u094D\u091C \u0925\u0940\u0964 \u0907\u0938 \u0935\u0930\u094D\u0937 \u0909\u0938\u092E\u0947\u0902 {percentageRate}% \u0915\u0940 \u0915\u092E\u0940 \u0939\u0941\u0908\u0964 \u0907\u0938 \u0935\u0930\u094D\u0937 \u0915\u0940 \u0935\u0930\u094D\u0937\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-311": {
        template: "\u090F\u0915 \u092C\u0938 \u0921\u093F\u092A\u094B \u092E\u0947\u0902 {baseValue} \u0938\u0915\u094D\u0930\u093F\u092F \u092A\u093E\u0938 \u0938\u0942\u091A\u0940\u092C\u0926\u094D\u0927 \u0925\u0947\u0964 {percentageRate}% \u0915\u0940 \u0915\u092E\u0940 \u0915\u0947 \u092C\u093E\u0926 \u0938\u0902\u0936\u094B\u0927\u093F\u0924 \u092A\u093E\u0938 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-411": {
        template: "\u090F\u0915 \u092A\u0941\u0938\u094D\u0924\u0915\u093E\u0932\u092F \u092E\u0947\u0902 {baseValue} \u0938\u0915\u094D\u0930\u093F\u092F \u0915\u093E\u0930\u094D\u0921 \u0938\u0942\u091A\u0940\u092C\u0926\u094D\u0927 \u0925\u0947\u0964 {percentageRate}% \u0915\u0940 \u0915\u092E\u0940 \u0915\u0947 \u092C\u093E\u0926 \u0938\u0915\u094D\u0930\u093F\u092F \u0915\u093E\u0930\u094D\u0921\u094B\u0902 \u0915\u0940 \u0938\u0902\u0936\u094B\u0927\u093F\u0924 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-112": {
        template: "\u092A\u0939\u0932\u0947 \u0915\u0940 \u0930\u093E\u0936\u093F \u092E\u0947\u0902 {percentageRate}% \u091C\u094B\u0921\u093C\u0928\u0947 \u0915\u0947 \u092C\u093E\u0926 \u0938\u0902\u0936\u094B\u0927\u093F\u0924 \u092C\u093F\u0932 {finalValue} \u0939\u094B \u091C\u093E\u0924\u093E \u0939\u0948\u0964 \u092A\u0939\u0932\u0947 \u0915\u0940 \u0930\u093E\u0936\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-212": {
        template: "\u0915\u093F\u0938\u0940 \u0926\u0941\u0915\u093E\u0928 \u0915\u093E \u092C\u093F\u0932 {percentageRate}% \u0905\u0927\u093F\u092D\u093E\u0930 \u0915\u0947 \u092C\u093E\u0926 {finalValue} \u0939\u094B \u0917\u092F\u093E\u0964 \u0905\u0927\u093F\u092D\u093E\u0930 \u0938\u0947 \u092A\u0939\u0932\u0947 \u0915\u093E \u092C\u093F\u0932 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-312": {
        template: "\u090F\u0915 \u092C\u093F\u091C\u0932\u0940 \u092C\u093F\u0932 {percentageRate}% \u092C\u0922\u093C\u0928\u0947 \u0915\u0947 \u092C\u093E\u0926 {finalValue} \u0939\u094B \u0917\u092F\u093E\u0964 \u092A\u0939\u0932\u0947 \u0915\u093E \u092C\u093F\u0932 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-412": {
        template: "\u090F\u0915 \u092A\u0941\u0938\u094D\u0924\u0915\u093E\u0932\u092F \u0915\u0940 \u0938\u0902\u0916\u094D\u092F\u093E {percentageRate}% \u092C\u0922\u093C\u0928\u0947 \u0915\u0947 \u092C\u093E\u0926 {finalValue} \u0939\u094B \u0917\u0908\u0964 \u092A\u0939\u0932\u0947 \u0915\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-113": {
        template: "{percentageRate}% \u0915\u0940 \u0915\u092E\u0940 \u0915\u0947 \u092C\u093E\u0926 \u0938\u0902\u0936\u094B\u0927\u093F\u0924 \u0905\u0928\u0941\u0926\u093E\u0928 {finalValue} \u0930\u0939 \u091C\u093E\u0924\u093E \u0939\u0948\u0964 \u092A\u0939\u0932\u0947 \u0915\u093E \u0905\u0928\u0941\u0926\u093E\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-213": {
        template: "{percentageRate}% \u0915\u0940 \u0915\u092E\u0940 \u0915\u0947 \u092C\u093E\u0926 \u092D\u0902\u0921\u093E\u0930 \u0936\u0947\u0937 {finalValue} \u0930\u0939 \u091C\u093E\u0924\u093E \u0939\u0948\u0964 \u092A\u0939\u0932\u0947 \u0915\u0940 \u0936\u0947\u0937 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-313": {
        template: "{percentageRate}% \u0915\u0940 \u0915\u092E\u0940 \u0915\u0947 \u092C\u093E\u0926 \u091C\u0932-\u0906\u092A\u0942\u0930\u094D\u0924\u093F \u0915\u0940 \u0930\u0940\u0921\u093F\u0902\u0917 {finalValue} \u0930\u0939 \u091C\u093E\u0924\u0940 \u0939\u0948\u0964 \u092A\u0939\u0932\u0947 \u0915\u0940 \u0930\u0940\u0921\u093F\u0902\u0917 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-413": {
        template: "{percentageRate}% \u0915\u0940 \u0915\u092E\u0940 \u0915\u0947 \u092C\u093E\u0926 \u092F\u093E\u0924\u094D\u0930\u0940 \u0938\u0902\u0916\u094D\u092F\u093E {finalValue} \u0930\u0939 \u091C\u093E\u0924\u0940 \u0939\u0948\u0964 \u092A\u0939\u0932\u0947 \u0915\u0940 \u092F\u093E\u0924\u094D\u0930\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-114": {
        template: "\u090F\u0915 \u0938\u0902\u0936\u094B\u0927\u0928 \u091F\u093F\u092A\u094D\u092A\u0923\u0940 \u092E\u0947\u0902 {percentageRate}% \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u093E\u0926 \u092E\u093E\u0928 {finalValue} \u0926\u0930\u094D\u091C \u0939\u0948\u0964 \u092A\u0939\u0932\u0947 \u0915\u093E \u092E\u093E\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-214": {
        template: "\u090F\u0915 \u092D\u0902\u0921\u093E\u0930 \u0930\u091C\u093F\u0938\u094D\u091F\u0930 \u092E\u0947\u0902 {percentageRate}% \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u093E\u0926 {finalValue} \u0907\u0915\u093E\u0907\u092F\u093E\u0901 \u0926\u0930\u094D\u091C \u0939\u0948\u0902\u0964 \u092A\u0939\u0932\u0947 \u0915\u093E \u092D\u0902\u0921\u093E\u0930 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-314": {
        template: "\u090F\u0915 \u092A\u0941\u0938\u094D\u0924\u0915\u093E\u0932\u092F \u0930\u091C\u093F\u0938\u094D\u091F\u0930 \u092E\u0947\u0902 {percentageRate}% \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u093E\u0926 \u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F\u093F\u092F\u094B\u0902 \u0915\u0940 \u0938\u0902\u0916\u094D\u092F\u093E {finalValue} \u0939\u094B \u0917\u0908\u0964 \u092A\u0939\u0932\u0947 \u0915\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-414": {
        template: "{percentageRate}% \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u093E\u0926 \u092A\u093E\u0938\u094B\u0902 \u0915\u0940 \u0938\u0902\u0916\u094D\u092F\u093E {finalValue} \u0939\u094B \u091C\u093E\u0924\u0940 \u0939\u0948\u0964 \u092A\u0939\u0932\u0947 \u0915\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-115": {
        template: "\u090F\u0915 \u0935\u0947\u0924\u0928-\u0938\u0902\u0936\u094B\u0927\u0928 \u091C\u094D\u091E\u093E\u092A\u0928 \u092E\u0947\u0902 {percentageRate}% \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u093E\u0926 \u0938\u0902\u0936\u094B\u0927\u093F\u0924 \u0935\u0947\u0924\u0928 Rs. {finalValue} \u0926\u093F\u0916\u093E\u092F\u093E \u0917\u092F\u093E \u0939\u0948\u0964 \u092A\u0939\u0932\u0947 \u0915\u093E \u0935\u0947\u0924\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-215": {
        template: "\u090F\u0915 \u0935\u0947\u0924\u0928-\u092A\u0930\u094D\u091A\u0940 \u092E\u0947\u0902 {percentageRate}% \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u093E\u0926 \u0935\u0947\u0924\u0928 Rs. {finalValue} \u0926\u093F\u0916\u093E\u092F\u093E \u0917\u092F\u093E \u0939\u0948\u0964 \u092A\u0939\u0932\u0947 \u0915\u093E \u0935\u0947\u0924\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-315": {
        template: "\u090F\u0915 \u0915\u0930\u094D\u092E\u091A\u093E\u0930\u0940 \u0938\u0902\u0936\u094B\u0927\u0928 \u0938\u0942\u091A\u0940 \u092E\u0947\u0902 {percentageRate}% \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u093E\u0926 \u0928\u092F\u093E \u0935\u0947\u0924\u0928 Rs. {finalValue} \u0926\u093F\u092F\u093E \u0917\u092F\u093E \u0939\u0948\u0964 \u092A\u0939\u0932\u0947 \u0915\u093E \u0935\u0947\u0924\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-415": {
        template: "\u090F\u0915 \u0935\u0947\u0924\u0928 \u0930\u091C\u093F\u0938\u094D\u091F\u0930 \u092E\u0947\u0902 {percentageRate}% \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u093E\u0926 \u0935\u0947\u0924\u0928 Rs. {finalValue} \u0926\u0930\u094D\u091C \u0939\u0948\u0964 \u092A\u0939\u0932\u0947 \u0915\u093E \u0935\u0947\u0924\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-116": {
        template: "\u090F\u0915 \u092D\u0902\u0921\u093E\u0930 \u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F\u093F \u092E\u0947\u0902 \u0915\u0939\u093E \u0917\u092F\u093E \u0939\u0948 \u0915\u093F {value} \u0907\u0915\u093E\u0907\u092F\u093E\u0901 \u091C\u094B\u0921\u093C\u0928\u093E {percentageRate}% \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948\u0964 \u092A\u094D\u0930\u093E\u0930\u0902\u092D\u093F\u0915 \u092D\u0902\u0921\u093E\u0930 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-216": {
        template: "{value} \u0915\u0940 \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924 \u0936\u0941\u0932\u094D\u0915 \u0930\u093E\u0936\u093F \u0906\u0927\u093E\u0930 \u0930\u093E\u0936\u093F \u0915\u0947 {percentageRate}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948\u0964 \u0906\u0927\u093E\u0930 \u0930\u093E\u0936\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-316": {
        template: "{value} \u0907\u0915\u093E\u0907\u092F\u094B\u0902 \u0915\u0940 \u0935\u0943\u0926\u094D\u0927\u093F \u092A\u094D\u0930\u093E\u0930\u0902\u092D\u093F\u0915 \u092D\u0902\u0921\u093E\u0930 \u0915\u0947 {percentageRate}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948\u0964 \u092A\u094D\u0930\u093E\u0930\u0902\u092D\u093F\u0915 \u092D\u0902\u0921\u093E\u0930 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-416": {
        template: "{value} \u0915\u093E \u0905\u0927\u093F\u092D\u093E\u0930 \u092E\u0942\u0932 \u092C\u093F\u0932 \u0915\u0947 {percentageRate}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948\u0964 \u092E\u0942\u0932 \u092C\u093F\u0932 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-117": {
        template: "\u090F\u0915 \u0905\u0902\u0915-\u092A\u0924\u094D\u0930 \u092E\u0947\u0902 \u0915\u0941\u0932 \u0905\u0902\u0915\u094B\u0902 \u0915\u093E {rate1}% = {value1} \u0926\u093F\u092F\u093E \u0939\u0948\u0964 \u0909\u0938\u0940 \u0915\u0941\u0932 \u0915\u0947 {rate2}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0905\u0902\u0915 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-217": {
        template: "\u090F\u0915 \u092C\u091C\u091F-\u092A\u0924\u094D\u0930 \u092E\u0947\u0902 \u0915\u0941\u0932 \u0928\u093F\u0927\u093F \u0915\u093E {rate1}% = {value1} \u0926\u093F\u092F\u093E \u0939\u0948\u0964 \u0909\u0938\u0940 \u0928\u093F\u0927\u093F \u0915\u0947 {rate2}% \u0915\u0940 \u0930\u093E\u0936\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-317": {
        template: "\u090F\u0915 \u0905\u0902\u0915 \u0905\u092D\u093F\u0932\u0947\u0916 \u092E\u0947\u0902 \u0915\u0941\u0932 \u0905\u0902\u0915\u094B\u0902 \u0915\u093E {rate1}% = {value1} \u0926\u093F\u092F\u093E \u0939\u0948\u0964 \u0915\u0941\u0932 \u0915\u0947 {rate2}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0905\u0902\u0915 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-417": {
        template: "\u090F\u0915 \u0909\u0924\u094D\u092A\u093E\u0926\u0928 \u0930\u093F\u092A\u094B\u0930\u094D\u091F \u092E\u0947\u0902 \u0915\u0941\u0932 \u0909\u0924\u094D\u092A\u093E\u0926\u0928 \u0915\u093E {rate1}% = {value1} \u0926\u093F\u092F\u093E \u0939\u0948\u0964 \u0915\u0941\u0932 \u0915\u0947 {rate2}% \u0915\u0947 \u0905\u0928\u0941\u0930\u0942\u092A \u0909\u0924\u094D\u092A\u093E\u0926\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-118": {
        template: "\u090F\u0915 \u0905\u0928\u0941\u0926\u093E\u0928-\u092A\u0924\u094D\u0930 \u092E\u0947\u0902 {rate1}% \u0914\u0930 {rate2}% \u0939\u093F\u0938\u094D\u0938\u094B\u0902 \u0915\u093E \u0905\u0902\u0924\u0930 {value} \u0939\u0948\u0964 \u0915\u0941\u0932 \u0905\u0928\u0941\u0926\u093E\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-218": {
        template: "\u090F\u0915 \u092E\u0924-\u0905\u092D\u093F\u0932\u0947\u0916 \u092E\u0947\u0902 {rate1}% \u0914\u0930 {rate2}% \u0939\u093F\u0938\u094D\u0938\u094B\u0902 \u0915\u093E \u0905\u0902\u0924\u0930 {value} \u0939\u0948\u0964 \u0915\u0941\u0932 \u092E\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-318": {
        template: "\u090F\u0915 \u092D\u0902\u0921\u093E\u0930-\u092A\u0924\u094D\u0930 \u092E\u0947\u0902 {rate1}% \u0914\u0930 {rate2}% \u0939\u093F\u0938\u094D\u0938\u094B\u0902 \u0915\u093E \u0905\u0902\u0924\u0930 {value} \u0939\u0948\u0964 \u0915\u0941\u0932 \u092D\u0902\u0921\u093E\u0930 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-418": {
        template: "\u090F\u0915 \u092C\u091C\u091F \u091F\u093F\u092A\u094D\u092A\u0923\u0940 \u092E\u0947\u0902 {rate1}% \u0914\u0930 {rate2}% \u0906\u0935\u0902\u091F\u0928\u094B\u0902 \u0915\u093E \u0905\u0902\u0924\u0930 {value} \u0939\u0948\u0964 \u0915\u0941\u0932 \u092C\u091C\u091F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-119": {
        template: "\u090F\u0915 \u092A\u0941\u0928\u0930\u094D\u092A\u094D\u0930\u093E\u092A\u094D\u0924\u093F \u091F\u093F\u092A\u094D\u092A\u0923\u0940 \u092E\u0947\u0902 \u0915\u0939\u093E \u0917\u092F\u093E \u0939\u0948 \u0915\u093F \u0915\u094B\u0908 \u092E\u093E\u0928 {percentageRate}% \u0918\u091F \u0917\u092F\u093E\u0964 \u092A\u0939\u0932\u0947 \u0915\u0947 \u092E\u093E\u0928 \u092A\u0930 \u0932\u094C\u091F\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-219": {
        template: "\u0915\u093F\u0938\u0940 \u092E\u0942\u0932\u094D\u092F \u092E\u0947\u0902 {percentageRate}% \u0915\u0940 \u0915\u092E\u0940 \u0939\u0941\u0908\u0964 \u092A\u0939\u0932\u0947 \u0915\u0947 \u092E\u0942\u0932\u094D\u092F \u092A\u0930 \u0932\u094C\u091F\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-319": {
        template: "\u092D\u0902\u0921\u093E\u0930 \u0938\u0902\u0916\u094D\u092F\u093E {percentageRate}% \u0918\u091F \u0917\u0908\u0964 \u092A\u0939\u0932\u0947 \u0915\u0940 \u092D\u0902\u0921\u093E\u0930 \u0938\u0902\u0916\u094D\u092F\u093E \u092A\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-419": {
        template: "\u092E\u0924\u0926\u093E\u0928-\u0909\u092A\u0938\u094D\u0925\u093F\u0924\u093F \u0915\u093E \u0906\u0901\u0915\u0921\u093C\u093E {percentageRate}% \u0918\u091F \u0917\u092F\u093E\u0964 \u092A\u0939\u0932\u0947 \u0915\u0940 \u0909\u092A\u0938\u094D\u0925\u093F\u0924\u093F \u092A\u0930 \u0932\u094C\u091F\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      }
    }
  },
  "PCT-CP-003": {
    families: {
      "PCT-QL-020": {
        template: "{rate1}% \u0914\u0930 {rate2}% \u0915\u0940 \u0926\u094B \u0932\u0917\u093E\u0924\u093E\u0930 \u0935\u0943\u0926\u094D\u0927\u093F\u092F\u093E\u0902 \u0915\u093F\u0938 \u090F\u0915 \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u094B\u0902\u0917\u0940?",
        difficulty: "Medium"
      },
      "PCT-QL-021": {
        template: "\u090F\u0915 \u0936\u0939\u0930 \u0915\u0940 \u091C\u0928\u0938\u0902\u0916\u094D\u092F\u093E \u092A\u0939\u0932\u0947 \u0938\u093E\u0932 {rate1}% \u0914\u0930 \u0926\u0942\u0938\u0930\u0947 \u0938\u093E\u0932 {rate2}% \u092C\u0922\u093C\u0924\u0940 \u0939\u0948\u0964 \u0915\u0941\u0932 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-022": {
        template: "\u090F\u0915 \u0938\u0902\u0916\u094D\u092F\u093E \u0915\u094B \u092A\u0939\u0932\u0947 {rate1}% \u092C\u0922\u093C\u093E\u092F\u093E \u0917\u092F\u093E \u0914\u0930 \u092B\u093F\u0930 {rate2}% \u0918\u091F\u093E\u092F\u093E \u0917\u092F\u093E\u0964 \u0915\u0941\u0932 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092C\u0926\u0932\u093E\u0935 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-023": {
        template: "\u0915\u093F\u0938\u0940 \u0935\u0938\u094D\u0924\u0941 \u0915\u093E \u0926\u093E\u092E \u092A\u0939\u0932\u0947 {rate1}% \u092C\u0922\u093C\u093E \u0914\u0930 \u092B\u093F\u0930 {rate2}% \u0918\u091F\u093E\u0964 \u0926\u093E\u092E \u092E\u0947\u0902 \u0915\u0941\u0932 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092C\u0926\u0932\u093E\u0935 \u0939\u0941\u0906?",
        difficulty: "Medium"
      },
      "PCT-QL-024": {
        template: "\u090F\u0915 \u0936\u0939\u0930 \u0915\u0940 \u091C\u0928\u0938\u0902\u0916\u094D\u092F\u093E {initialValue} \u0939\u0948\u0964 \u092F\u0939 \u0939\u0930 \u0938\u093E\u0932 {percentageRate}% \u092C\u0922\u093C\u0924\u0940 \u0939\u0948\u0964 2 \u0938\u093E\u0932 \u092C\u093E\u0926 \u091C\u0928\u0938\u0902\u0916\u094D\u092F\u093E \u0915\u093F\u0924\u0928\u0940 \u0939\u094B\u0917\u0940?",
        difficulty: "Medium"
      },
      "PCT-QL-025": {
        template: "\u090F\u0915 \u092E\u0936\u0940\u0928 \u0915\u0940 \u0915\u0940\u092E\u0924 \u0939\u0930 \u0938\u093E\u0932 {percentageRate}% \u0918\u091F\u0924\u0940 \u0939\u0948\u0964 \u0905\u092D\u0940 \u0915\u0940\u092E\u0924 Rs. {initialValue} \u0939\u0948\u0964 2 \u0938\u093E\u0932 \u092C\u093E\u0926 \u0915\u0940\u092E\u0924 \u0915\u093F\u0924\u0928\u0940 \u0939\u094B\u0917\u0940?",
        difficulty: "Medium"
      },
      "PCT-QL-026": {
        template: "\u090F\u0915 \u0906\u092F\u0924 \u0915\u0940 \u0932\u0902\u092C\u093E\u0908 {rate1}% \u0914\u0930 \u091A\u094C\u0921\u093C\u093E\u0908 {rate2}% \u092C\u0922\u093C\u093E\u0908 \u0917\u0908\u0964 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u092E\u0947\u0902 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-027": {
        template: "\u090F\u0915 \u0935\u0930\u094D\u0917 \u0915\u0940 \u092D\u0941\u091C\u093E {percentageRate}% \u092C\u0922\u093C\u093E \u0926\u0940 \u091C\u093E\u090F, \u0924\u094B \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u092E\u0947\u0902 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u0939\u094B\u0917\u0940?",
        difficulty: "Easy"
      },
      "PCT-QL-120": {
        template: "\u090F\u0915 \u0917\u094D\u0930\u093E\u0939\u0915-\u0938\u0926\u0938\u094D\u092F \u0938\u0902\u0916\u094D\u092F\u093E \u090F\u0915 \u0924\u093F\u092E\u093E\u0939\u0940 \u092E\u0947\u0902 {rate1}% \u0914\u0930 \u0905\u0917\u0932\u0940 \u0924\u093F\u092E\u093E\u0939\u0940 \u092E\u0947\u0902 {rate2}% \u092C\u0922\u093C\u0924\u0940 \u0939\u0948\u0964 \u0907\u0938\u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u090F\u0915\u0932 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-220": {
        template: "\u090F\u0915 \u0936\u093E\u0916\u093E \u0938\u0902\u0916\u094D\u092F\u093E \u090F\u0915 \u0938\u092E\u0940\u0915\u094D\u0937\u093E \u0915\u0947 \u092C\u093E\u0926 {rate1}% \u0914\u0930 \u0905\u0917\u0932\u0940 \u0938\u092E\u0940\u0915\u094D\u0937\u093E \u0915\u0947 \u092C\u093E\u0926 {rate2}% \u092C\u0922\u093C\u0940\u0964 \u0907\u0938\u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u090F\u0915\u0932 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-320": {
        template: "\u090F\u0915 \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u0928\u093E\u092E\u093E\u0902\u0915\u0928 \u0905\u092D\u093F\u0932\u0947\u0916 \u090F\u0915 \u0938\u0924\u094D\u0930 \u092E\u0947\u0902 {rate1}% \u0914\u0930 \u0905\u0917\u0932\u0947 \u0938\u0924\u094D\u0930 \u092E\u0947\u0902 {rate2}% \u092C\u0922\u093C\u093E\u0964 \u0907\u0938\u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u090F\u0915\u0932 \u0935\u0943\u0926\u094D\u0927\u093F \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-420": {
        template: "\u090F\u0915 \u092F\u093E\u0924\u094D\u0930\u0940 \u0905\u092D\u093F\u0932\u0947\u0916 \u092E\u0947\u0902 \u090F\u0915 \u092E\u0939\u0940\u0928\u0947 {rate1}% \u0914\u0930 \u0905\u0917\u0932\u0947 \u092E\u0939\u0940\u0928\u0947 {rate2}% \u0915\u0940 \u0935\u0943\u0926\u094D\u0927\u093F \u0939\u0941\u0908\u0964 \u0907\u0938\u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u090F\u0915\u0932 \u0935\u0943\u0926\u094D\u0927\u093F \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-121": {
        template: "\u090F\u0915 \u091C\u093F\u0932\u093E \u091C\u0928\u0938\u0902\u0916\u094D\u092F\u093E \u091F\u093F\u092A\u094D\u092A\u0923\u0940 \u092E\u0947\u0902 \u092A\u0939\u0932\u0947 \u0935\u0930\u094D\u0937 {rate1}% \u0914\u0930 \u0926\u0942\u0938\u0930\u0947 \u0935\u0930\u094D\u0937 {rate2}% \u0915\u0940 \u0935\u0943\u0926\u094D\u0927\u093F \u0926\u0930\u094D\u091C \u0939\u0948\u0964 \u0915\u0941\u0932 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-221": {
        template: "\u090F\u0915 \u091C\u093F\u0932\u093E \u0938\u0930\u094D\u0935\u0947\u0915\u094D\u0937\u0923 \u092E\u0947\u0902 \u092A\u0939\u0932\u0947 \u0935\u0930\u094D\u0937 \u0918\u0930\u094B\u0902 \u0915\u0940 \u0938\u0902\u0916\u094D\u092F\u093E {rate1}% \u0914\u0930 \u0926\u0942\u0938\u0930\u0947 \u0935\u0930\u094D\u0937 {rate2}% \u092C\u0922\u093C\u0940\u0964 \u0915\u0941\u0932 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-321": {
        template: "\u090F\u0915 \u092A\u0936\u0941\u0917\u0923\u0928\u093E \u092A\u0939\u0932\u0947 \u0935\u0930\u094D\u0937 {rate1}% \u0914\u0930 \u0926\u0942\u0938\u0930\u0947 \u0935\u0930\u094D\u0937 {rate2}% \u092C\u0922\u093C\u0940\u0964 \u0915\u0941\u0932 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-421": {
        template: "\u090F\u0915 \u092A\u0941\u0938\u094D\u0924\u0915\u093E\u0932\u092F \u0938\u0926\u0938\u094D\u092F\u0924\u093E \u0905\u092D\u093F\u0932\u0947\u0916 \u090F\u0915 \u0935\u0930\u094D\u0937 {rate1}% \u0914\u0930 \u0905\u0917\u0932\u0947 \u0935\u0930\u094D\u0937 {rate2}% \u092C\u0922\u093C\u093E\u0964 \u0915\u0941\u0932 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-122": {
        template: "\u0938\u0902\u0936\u094B\u0927\u0928 \u0915\u0947 \u092C\u093E\u0926 \u091F\u093F\u0915\u091F \u092E\u0942\u0932\u094D\u092F {rate1}% \u092C\u0922\u093C\u093E \u0914\u0930 \u0930\u093F\u092F\u093E\u092F\u0924 \u0915\u0947 \u092C\u093E\u0926 {rate2}% \u0918\u091F \u0917\u092F\u093E\u0964 \u0915\u0941\u0932 \u092A\u0930\u093F\u0935\u0930\u094D\u0924\u0928 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-222": {
        template: "\u0905\u0917\u094D\u0930\u093F\u092E \u092C\u0941\u0915\u093F\u0902\u0917 \u0915\u0947 \u092C\u093E\u0926 \u091F\u093F\u0915\u091F \u0938\u0902\u0916\u094D\u092F\u093E {rate1}% \u092C\u0922\u093C\u0940 \u0914\u0930 \u0930\u0926\u094D\u0926\u0940\u0915\u0930\u0923 \u0915\u0947 \u092C\u093E\u0926 {rate2}% \u0918\u091F \u0917\u0908\u0964 \u0915\u0941\u0932 \u092A\u0930\u093F\u0935\u0930\u094D\u0924\u0928 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-322": {
        template: "\u0928\u0908 \u0906\u092A\u0942\u0930\u094D\u0924\u093F \u0915\u0947 \u092C\u093E\u0926 \u092D\u0902\u0921\u093E\u0930 \u0930\u091C\u093F\u0938\u094D\u091F\u0930 {rate1}% \u092C\u0922\u093C\u093E \u0914\u0930 \u092C\u093F\u0915\u094D\u0930\u0940 \u0915\u0947 \u092C\u093E\u0926 {rate2}% \u0918\u091F \u0917\u092F\u093E\u0964 \u0915\u0941\u0932 \u092A\u0930\u093F\u0935\u0930\u094D\u0924\u0928 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-422": {
        template: "\u090F\u0915 \u0935\u0947\u092C\u0938\u093E\u0907\u091F \u092F\u093E\u0924\u093E\u092F\u093E\u0924 \u091F\u093F\u092A\u094D\u092A\u0923\u0940 \u092E\u0947\u0902 \u0905\u092D\u093F\u092F\u093E\u0928 \u0915\u0947 \u0926\u094C\u0930\u093E\u0928 {rate1}% \u0935\u0943\u0926\u094D\u0927\u093F \u0914\u0930 \u0909\u0938\u0915\u0947 \u092C\u093E\u0926 {rate2}% \u0915\u092E\u0940 \u0939\u0941\u0908\u0964 \u0915\u0941\u0932 \u092A\u0930\u093F\u0935\u0930\u094D\u0924\u0928 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-123": {
        template: "\u090F\u0915 \u092C\u093F\u0915\u094D\u0930\u0940 \u0938\u0942\u091A\u0928\u093E \u092E\u0947\u0902 \u092A\u0939\u0932\u0947 \u0905\u0902\u0915\u093F\u0924 \u092E\u0942\u0932\u094D\u092F {rate1}% \u092C\u0922\u093C\u093E\u092F\u093E \u0917\u092F\u093E \u0914\u0930 \u092C\u093E\u0926 \u092E\u0947\u0902 {rate2}% \u0915\u0940 \u0915\u092E\u0940 \u0926\u0940 \u0917\u0908\u0964 \u092E\u0942\u0932\u094D\u092F \u092E\u0947\u0902 \u0936\u0941\u0926\u094D\u0927 \u092A\u0930\u093F\u0935\u0930\u094D\u0924\u0928 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-223": {
        template: "\u090F\u0915 \u092C\u093F\u0932 \u0938\u0902\u0936\u094B\u0927\u0928 \u092E\u0947\u0902 \u092A\u0939\u0932\u0947 \u092E\u0942\u0932\u094D\u092F {rate1}% \u092C\u0922\u093C\u093E\u092F\u093E \u0917\u092F\u093E \u0914\u0930 \u092C\u093E\u0926 \u092E\u0947\u0902 {rate2}% \u0918\u091F\u093E\u092F\u093E \u0917\u092F\u093E\u0964 \u092E\u0942\u0932\u094D\u092F \u092E\u0947\u0902 \u0936\u0941\u0926\u094D\u0927 \u092A\u0930\u093F\u0935\u0930\u094D\u0924\u0928 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-323": {
        template: "\u090F\u0915 \u092C\u093F\u0915\u094D\u0930\u0940 \u092A\u0930\u093F\u092A\u0924\u094D\u0930 \u092E\u0947\u0902 \u092A\u0939\u0932\u0947 \u0905\u0902\u0915\u093F\u0924 \u092E\u0942\u0932\u094D\u092F {rate1}% \u092C\u0922\u093C\u093E\u092F\u093E \u0917\u092F\u093E \u0914\u0930 \u092C\u093E\u0926 \u092E\u0947\u0902 {rate2}% \u0915\u0940 \u0930\u093F\u092F\u093E\u092F\u0924 \u0926\u0940 \u0917\u0908\u0964 \u092E\u0942\u0932\u094D\u092F \u092E\u0947\u0902 \u0936\u0941\u0926\u094D\u0927 \u092A\u0930\u093F\u0935\u0930\u094D\u0924\u0928 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-423": {
        template: "\u090F\u0915 \u0915\u0930 \u091F\u093F\u092A\u094D\u092A\u0923\u0940 \u092E\u0947\u0902 \u092A\u0939\u0932\u0947 \u0935\u0938\u094D\u0924\u0941 \u0915\u093E \u092E\u0942\u0932\u094D\u092F {rate1}% \u092C\u0922\u093C\u093E \u0914\u0930 \u092B\u093F\u0930 {rate2}% \u0918\u091F\u093E\u0964 \u092E\u0942\u0932\u094D\u092F \u092E\u0947\u0902 \u0936\u0941\u0926\u094D\u0927 \u092A\u0930\u093F\u0935\u0930\u094D\u0924\u0928 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-124": {
        template: "\u090F\u0915 \u092A\u0936\u0941\u0917\u0923\u0928\u093E {initialValue} \u0938\u0947 \u0936\u0941\u0930\u0942 \u0939\u094B\u0924\u0940 \u0939\u0948\u0964 \u092F\u0926\u093F \u092F\u0939 \u0939\u0930 \u0935\u0930\u094D\u0937 {percentageRate}% \u0915\u0940 \u0926\u0930 \u0938\u0947 \u092C\u0922\u093C\u0947, \u0924\u094B 2 \u0935\u0930\u094D\u0937 \u092C\u093E\u0926 \u092F\u0939 \u0915\u093F\u0924\u0928\u0940 \u0939\u094B\u0917\u0940?",
        difficulty: "Easy"
      },
      "PCT-QL-224": {
        template: "\u090F\u0915 \u0917\u094D\u0930\u093E\u0939\u0915-\u0938\u0926\u0938\u094D\u092F \u0905\u092D\u093F\u0932\u0947\u0916 {initialValue} \u0938\u0947 \u0936\u0941\u0930\u0942 \u0939\u094B\u0924\u093E \u0939\u0948\u0964 \u092F\u0926\u093F \u092F\u0939 \u0939\u0930 \u0935\u0930\u094D\u0937 {percentageRate}% \u092C\u0922\u093C\u0947, \u0924\u094B 2 \u0935\u0930\u094D\u0937 \u092C\u093E\u0926 \u092F\u0939 \u0915\u093F\u0924\u0928\u093E \u0939\u094B\u0917\u093E?",
        difficulty: "Easy"
      },
      "PCT-QL-324": {
        template: "\u090F\u0915 \u0935\u093F\u0926\u094D\u092F\u0941\u0924-\u0909\u092A\u092F\u094B\u0917 \u0905\u092D\u093F\u0932\u0947\u0916 {initialValue} \u0938\u0947 \u0936\u0941\u0930\u0942 \u0939\u094B\u0924\u093E \u0939\u0948\u0964 \u092F\u0926\u093F \u092F\u0939 \u0939\u0930 \u0935\u0930\u094D\u0937 {percentageRate}% \u092C\u0922\u093C\u0947, \u0924\u094B 2 \u0935\u0930\u094D\u0937 \u092C\u093E\u0926 \u092F\u0939 \u0915\u093F\u0924\u0928\u093E \u0939\u094B\u0917\u093E?",
        difficulty: "Easy"
      },
      "PCT-QL-424": {
        template: "\u090F\u0915 \u0935\u093E\u0939\u0928-\u0938\u0902\u0916\u094D\u092F\u093E \u0905\u092D\u093F\u0932\u0947\u0916 {initialValue} \u0938\u0947 \u0936\u0941\u0930\u0942 \u0939\u094B\u0924\u093E \u0939\u0948\u0964 \u092F\u0926\u093F \u092F\u0939 \u0939\u0930 \u0935\u0930\u094D\u0937 {percentageRate}% \u092C\u0922\u093C\u0947, \u0924\u094B 2 \u0935\u0930\u094D\u0937 \u092C\u093E\u0926 \u092F\u0939 \u0915\u093F\u0924\u0928\u093E \u0939\u094B\u0917\u093E?",
        difficulty: "Easy"
      },
      "PCT-QL-125": {
        template: "\u090F\u0915 \u092E\u0942\u0932\u094D\u092F\u0939\u094D\u0930\u093E\u0938 \u0930\u091C\u093F\u0938\u094D\u091F\u0930 \u092E\u0947\u0902 \u0915\u093F\u0938\u0940 \u092E\u0936\u0940\u0928 \u0915\u093E \u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u092E\u0942\u0932\u094D\u092F Rs. {initialValue} \u0939\u0948\u0964 \u092F\u0926\u093F \u0909\u0938\u0915\u093E \u092E\u0942\u0932\u094D\u092F \u0939\u0930 \u0935\u0930\u094D\u0937 {percentageRate}% \u0918\u091F\u0947, \u0924\u094B 2 \u0935\u0930\u094D\u0937 \u092C\u093E\u0926 \u0909\u0938\u0915\u093E \u092E\u0942\u0932\u094D\u092F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-225": {
        template: "\u0915\u093F\u0938\u0940 \u0935\u093E\u0939\u0928 \u0915\u093E \u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u092E\u0942\u0932\u094D\u092F Rs. {initialValue} \u0939\u0948\u0964 \u092F\u0926\u093F \u0909\u0938\u0915\u093E \u092E\u0942\u0932\u094D\u092F \u0939\u0930 \u0935\u0930\u094D\u0937 {percentageRate}% \u0918\u091F\u0947, \u0924\u094B 2 \u0935\u0930\u094D\u0937 \u092C\u093E\u0926 \u0909\u0938\u0915\u093E \u092E\u0942\u0932\u094D\u092F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-325": {
        template: "\u090F\u0915 \u0917\u094B\u0926\u093E\u092E \u0915\u0940 \u092A\u0930\u093F\u0938\u0902\u092A\u0924\u094D\u0924\u093F \u0915\u093E \u092E\u0942\u0932\u094D\u092F Rs. {initialValue} \u0939\u0948\u0964 \u092F\u0926\u093F \u0909\u0938\u0915\u093E \u092E\u0942\u0932\u094D\u092F \u0939\u0930 \u0935\u0930\u094D\u0937 {percentageRate}% \u0918\u091F\u0947, \u0924\u094B 2 \u0935\u0930\u094D\u0937 \u092C\u093E\u0926 \u0909\u0938\u0915\u093E \u092E\u0942\u0932\u094D\u092F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-425": {
        template: "\u090F\u0915 \u092E\u0936\u0940\u0928 \u092C\u0940\u092E\u093E \u0905\u092D\u093F\u0932\u0947\u0916 \u092E\u0947\u0902 \u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u092E\u0942\u0932\u094D\u092F Rs. {initialValue} \u0926\u0930\u094D\u091C \u0939\u0948\u0964 \u092F\u0926\u093F \u0909\u0938\u0915\u093E \u092E\u0942\u0932\u094D\u092F \u0939\u0930 \u0935\u0930\u094D\u0937 {percentageRate}% \u0918\u091F\u0947, \u0924\u094B 2 \u0935\u0930\u094D\u0937 \u092C\u093E\u0926 \u0909\u0938\u0915\u093E \u092E\u0942\u0932\u094D\u092F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-126": {
        template: "\u090F\u0915 \u0906\u092F\u0924\u093E\u0915\u093E\u0930 \u092D\u0942\u0916\u0902\u0921 \u0915\u0947 \u0905\u092D\u093F\u0932\u0947\u0916 \u092E\u0947\u0902 \u0932\u0902\u092C\u093E\u0908 \u0914\u0930 \u091A\u094C\u0921\u093C\u093E\u0908 \u0915\u094D\u0930\u092E\u0936\u0903 {rate1}% \u0914\u0930 {rate2}% \u092C\u0922\u093C\u093E\u0908 \u0917\u0908 \u0939\u0948\u0902\u0964 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u092E\u0947\u0902 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-226": {
        template: "\u090F\u0915 \u0916\u0947\u0924 \u0915\u0947 \u0905\u092D\u093F\u0932\u0947\u0916 \u092E\u0947\u0902 \u0932\u0902\u092C\u093E\u0908 {rate1}% \u0914\u0930 \u091A\u094C\u0921\u093C\u093E\u0908 {rate2}% \u092C\u0922\u093C\u093E\u0908 \u0917\u0908 \u0939\u0948\u0964 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u092E\u0947\u0902 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-326": {
        template: "\u090F\u0915 \u0917\u094B\u0926\u093E\u092E \u092B\u0930\u094D\u0936 \u092F\u094B\u091C\u0928\u093E \u092E\u0947\u0902 \u0932\u0902\u092C\u093E\u0908 {rate1}% \u0914\u0930 \u091A\u094C\u0921\u093C\u093E\u0908 {rate2}% \u092C\u0922\u093C\u093E\u0908 \u0917\u0908 \u0939\u0948\u0964 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u092E\u0947\u0902 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-426": {
        template: "\u090F\u0915 \u0916\u0947\u0932 \u092E\u0948\u0926\u093E\u0928 \u0915\u0940 \u092F\u094B\u091C\u0928\u093E \u092E\u0947\u0902 \u0932\u0902\u092C\u093E\u0908 {rate1}% \u0914\u0930 \u091A\u094C\u0921\u093C\u093E\u0908 {rate2}% \u092C\u0922\u093C\u093E\u0908 \u0917\u0908 \u0939\u0948\u0964 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u092E\u0947\u0902 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-127": {
        template: "\u090F\u0915 \u0935\u0930\u094D\u0917\u093E\u0915\u093E\u0930 \u092A\u093E\u0930\u094D\u0915 \u0915\u0940 \u092D\u0941\u091C\u093E {percentageRate}% \u092C\u0922\u093C\u093E \u0926\u0940 \u0917\u0908\u0964 \u0909\u0938\u0915\u0947 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u092E\u0947\u0902 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-227": {
        template: "\u090F\u0915 \u0935\u0930\u094D\u0917\u093E\u0915\u093E\u0930 \u092C\u0917\u0940\u091A\u0947 \u0915\u0940 \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u092D\u0941\u091C\u093E {percentageRate}% \u092C\u0922\u093C\u093E \u0926\u0940 \u0917\u0908\u0964 \u0909\u0938\u0915\u0947 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u092E\u0947\u0902 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-327": {
        template: "\u090F\u0915 \u0935\u0930\u094D\u0917\u093E\u0915\u093E\u0930 \u091F\u093E\u0907\u0932 \u0921\u093F\u091C\u093C\u093E\u0907\u0928 \u0915\u0940 \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u092D\u0941\u091C\u093E {percentageRate}% \u092C\u0922\u093C\u093E\u0908 \u0917\u0908\u0964 \u0909\u0938\u0915\u0947 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u092E\u0947\u0902 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-427": {
        template: "\u090F\u0915 \u0935\u0930\u094D\u0917\u093E\u0915\u093E\u0930 \u092B\u0930\u094D\u0936 \u092F\u094B\u091C\u0928\u093E \u0915\u0940 \u092D\u0941\u091C\u093E {percentageRate}% \u092C\u0922\u093C\u093E \u0926\u0940 \u0917\u0908\u0964 \u0909\u0938\u0915\u0947 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u092E\u0947\u0902 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0935\u0943\u0926\u094D\u0927\u093F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      }
    }
  },
  "PCT-CP-004": {
    families: {
      "PCT-QL-028": {
        template: "\u091A\u0940\u0928\u0940 \u0915\u093E \u0926\u093E\u092E {percentageRate}% \u092C\u0922\u093C \u091C\u093E\u090F, \u0924\u094B \u0916\u0930\u094D\u091A \u0938\u092E\u093E\u0928 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0916\u092A\u0924 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u093E\u0928\u0940 \u0939\u094B\u0917\u0940?",
        difficulty: "Medium"
      },
      "PCT-QL-029": {
        template: "\u092A\u0947\u091F\u094D\u0930\u094B\u0932 \u0915\u093E \u0926\u093E\u092E {percentageRate}% \u0918\u091F \u0917\u092F\u093E\u0964 \u0938\u092E\u093E\u0928 \u0916\u0930\u094D\u091A \u092E\u0947\u0902 \u0916\u092A\u0924 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092C\u0922\u093C\u093E\u0908 \u091C\u093E \u0938\u0915\u0924\u0940 \u0939\u0948?",
        difficulty: "Medium"
      },
      "PCT-QL-030": {
        template: "\u090F\u0915 \u0906\u092F\u0924 \u0915\u0940 \u0932\u0902\u092C\u093E\u0908 {percentageRate}% \u092C\u0922\u093C\u0924\u0940 \u0939\u0948\u0964 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u0938\u092E\u093E\u0928 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u091A\u094C\u0921\u093C\u093E\u0908 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u093E\u0928\u0940 \u0939\u094B\u0917\u0940?",
        difficulty: "Medium"
      },
      "PCT-QL-031": {
        template: "\u0915\u093E\u0930 \u0915\u0940 \u091A\u093E\u0932 {percentageRate}% \u092C\u0922\u093C \u091C\u093E\u090F, \u0924\u094B \u0938\u092E\u093E\u0928 \u0926\u0942\u0930\u0940 \u0915\u0947 \u0932\u093F\u090F \u0938\u092E\u092F \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u0947\u0917\u093E?",
        difficulty: "Hard"
      },
      "PCT-QL-032": {
        template: "\u0915\u093F\u0938\u0940 \u0935\u0938\u094D\u0924\u0941 \u0915\u093E \u0926\u093E\u092E {rate1}% \u092C\u0922\u093C\u093E\u092F\u093E \u0917\u092F\u093E\u0964 \u092A\u0941\u0930\u093E\u0928\u0947 \u0926\u093E\u092E \u092A\u0930 \u0932\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0928\u092F\u093E \u0926\u093E\u092E \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u093E\u0928\u093E \u0939\u094B\u0917\u093E?",
        difficulty: "Medium"
      },
      "PCT-QL-033": {
        template: "\u091F\u0948\u0915\u094D\u0938 {rate1}% \u0918\u091F\u0924\u093E \u0939\u0948 \u0914\u0930 \u092C\u093F\u0915\u094D\u0930\u0940 {rate2}% \u092C\u0922\u093C\u0924\u0940 \u0939\u0948\u0964 \u0915\u0941\u0932 \u0915\u092E\u093E\u0908 \u092E\u0947\u0902 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092C\u0926\u0932\u093E\u0935 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Hard"
      },
      "PCT-QL-034": {
        template: "\u0915\u093E\u0930\u0916\u093E\u0928\u0947 \u092E\u0947\u0902 \u0915\u093E\u092E \u0915\u0947 \u0918\u0902\u091F\u0947 {percentageRate}% \u092C\u0922\u093C \u0917\u090F\u0964 \u0915\u0941\u0932 \u092C\u093F\u0932 \u0938\u092E\u093E\u0928 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u092A\u094D\u0930\u0924\u093F \u0918\u0902\u091F\u093E \u092E\u091C\u0926\u0942\u0930\u0940 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u093E\u0928\u0940 \u0939\u094B\u0917\u0940?",
        difficulty: "Hard"
      },
      "PCT-QL-035": {
        template: "\u0935\u0943\u0924\u094D\u0924 \u0915\u0940 \u0924\u094D\u0930\u093F\u091C\u094D\u092F\u093E {percentageRate}% \u0918\u091F\u093E \u0926\u0940 \u091C\u093E\u090F, \u0924\u094B \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u092E\u0947\u0902 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0915\u092E\u0940 \u0939\u094B\u0917\u0940?",
        difficulty: "Easy"
      },
      "PCT-QL-128": {
        template: "\u090F\u0915 \u0930\u093E\u0936\u0928 \u092C\u093F\u0932 \u092E\u0947\u0902 \u091A\u0940\u0928\u0940 \u0915\u093E \u092E\u0942\u0932\u094D\u092F {percentageRate}% \u092C\u0922\u093C\u093E \u0926\u093F\u0916\u093E\u092F\u093E \u0917\u092F\u093E \u0939\u0948\u0964 \u0935\u094D\u092F\u092F \u0938\u092E\u093E\u0928 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0916\u092A\u0924 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u093E\u0928\u0940 \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-228": {
        template: "\u090F\u0915 \u0918\u0930\u0947\u0932\u0942 \u0935\u094D\u092F\u092F \u091F\u093F\u092A\u094D\u092A\u0923\u0940 \u092E\u0947\u0902 \u091A\u0940\u0928\u0940 \u0915\u0947 \u092E\u0942\u0932\u094D\u092F \u092E\u0947\u0902 {percentageRate}% \u0935\u0943\u0926\u094D\u0927\u093F \u0926\u0930\u094D\u091C \u0939\u0948\u0964 \u0935\u094D\u092F\u092F \u0938\u092E\u093E\u0928 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u092E\u093E\u0924\u094D\u0930\u093E \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u093E\u0928\u0940 \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-328": {
        template: "\u090F\u0915 \u0930\u093E\u0936\u0928-\u0915\u093E\u0930\u094D\u0921 \u0917\u0923\u0928\u093E \u092E\u0947\u0902 \u091A\u0940\u0928\u0940 \u0915\u093E \u092E\u0942\u0932\u094D\u092F {percentageRate}% \u092C\u0922\u093C\u0924\u093E \u0939\u0948\u0964 \u092C\u093F\u0932 \u0905\u092A\u0930\u093F\u0935\u0930\u094D\u0924\u093F\u0924 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0916\u0930\u0940\u0926 \u092E\u093E\u0924\u094D\u0930\u093E \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u0928\u0940 \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-428": {
        template: "\u090F\u0915 \u0930\u0938\u094B\u0908 \u092C\u091C\u091F \u091F\u093F\u092A\u094D\u092A\u0923\u0940 \u092E\u0947\u0902 \u091A\u0940\u0928\u0940 \u0915\u0947 \u092E\u0942\u0932\u094D\u092F \u092E\u0947\u0902 {percentageRate}% \u0935\u0943\u0926\u094D\u0927\u093F \u0926\u0930\u094D\u091C \u0939\u0948\u0964 \u091A\u0940\u0928\u0940 \u092A\u0930 \u0938\u092E\u093E\u0928 \u0935\u094D\u092F\u092F \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0916\u092A\u0924 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u093E\u0928\u0940 \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-129": {
        template: "\u090F\u0915 \u0908\u0902\u0927\u0928 \u0905\u092D\u093F\u0932\u0947\u0916 \u092E\u0947\u0902 \u092A\u0947\u091F\u094D\u0930\u094B\u0932 \u0915\u093E \u092E\u0942\u0932\u094D\u092F {percentageRate}% \u0918\u091F\u093E \u0926\u093F\u0916\u093E\u092F\u093E \u0917\u092F\u093E \u0939\u0948\u0964 \u0915\u0941\u0932 \u0932\u093E\u0917\u0924 \u0938\u092E\u093E\u0928 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0916\u092A\u0924 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092C\u0922\u093C\u093E\u0908 \u091C\u093E \u0938\u0915\u0924\u0940 \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-229": {
        template: "\u090F\u0915 \u0908\u0902\u0927\u0928 \u092C\u091C\u091F \u092E\u0947\u0902 \u092A\u0947\u091F\u094D\u0930\u094B\u0932 \u0915\u093E \u092E\u0942\u0932\u094D\u092F {percentageRate}% \u0918\u091F\u0924\u093E \u0939\u0948\u0964 \u0915\u0941\u0932 \u0908\u0902\u0927\u0928 \u0932\u093E\u0917\u0924 \u0938\u092E\u093E\u0928 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0909\u092A\u092F\u094B\u0917 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092C\u0922\u093C \u0938\u0915\u0924\u093E \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-329": {
        template: "\u090F\u0915 \u092F\u093E\u0924\u094D\u0930\u093E-\u092D\u0924\u094D\u0924\u093E \u091F\u093F\u092A\u094D\u092A\u0923\u0940 \u092E\u0947\u0902 \u0908\u0902\u0927\u0928 \u0915\u093E \u092E\u0942\u0932\u094D\u092F {percentageRate}% \u0918\u091F\u093E \u0939\u0948\u0964 \u0915\u0941\u0932 \u0916\u0930\u094D\u091A \u092C\u0926\u0932\u0947 \u092C\u093F\u0928\u093E \u0908\u0902\u0927\u0928 \u0915\u0940 \u092E\u093E\u0924\u094D\u0930\u093E \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092C\u0922\u093C \u0938\u0915\u0924\u0940 \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-429": {
        template: "\u090F\u0915 \u092E\u093E\u0930\u094D\u0917-\u0932\u093E\u0917\u0924 \u0905\u092D\u093F\u0932\u0947\u0916 \u092E\u0947\u0902 \u0908\u0902\u0927\u0928 \u0915\u093E \u092E\u0942\u0932\u094D\u092F {percentageRate}% \u0918\u091F\u093E \u0939\u0948\u0964 \u0915\u0941\u0932 \u0932\u093E\u0917\u0924 \u0938\u092E\u093E\u0928 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0908\u0902\u0927\u0928 \u0909\u092A\u092F\u094B\u0917 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092C\u0922\u093C \u0938\u0915\u0924\u093E \u0939\u0948?",
        difficulty: "Easy"
      },
      "PCT-QL-130": {
        template: "\u090F\u0915 \u0906\u092F\u0924\u093E\u0915\u093E\u0930 \u092F\u094B\u091C\u0928\u093E \u092E\u0947\u0902 \u0932\u0902\u092C\u093E\u0908 {percentageRate}% \u092C\u0922\u093C\u093E \u0926\u0940 \u0917\u0908 \u0939\u0948\u0964 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u0938\u092E\u093E\u0928 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u091A\u094C\u0921\u093C\u093E\u0908 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u093E\u0928\u0940 \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-230": {
        template: "\u090F\u0915 \u0916\u0947\u0924 \u0915\u0940 \u092F\u094B\u091C\u0928\u093E \u092E\u0947\u0902 \u0932\u0902\u092C\u093E\u0908 {percentageRate}% \u092C\u0922\u093C\u093E \u0926\u0940 \u0917\u0908 \u0939\u0948\u0964 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u0938\u092E\u093E\u0928 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u091A\u094C\u0921\u093C\u093E\u0908 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u093E\u0928\u0940 \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-330": {
        template: "\u090F\u0915 \u0917\u094B\u0926\u093E\u092E \u092F\u094B\u091C\u0928\u093E \u092E\u0947\u0902 \u0932\u0902\u092C\u093E\u0908 {percentageRate}% \u092C\u0922\u093C\u093E\u0908 \u0917\u0908 \u0939\u0948\u0964 \u092B\u0930\u094D\u0936 \u0915\u093E \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u0905\u092A\u0930\u093F\u0935\u0930\u094D\u0924\u093F\u0924 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u091A\u094C\u0921\u093C\u093E\u0908 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u0928\u0940 \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-430": {
        template: "\u090F\u0915 \u0916\u0947\u0932 \u092E\u0948\u0926\u093E\u0928 \u0915\u0940 \u092F\u094B\u091C\u0928\u093E \u092E\u0947\u0902 \u0932\u0902\u092C\u093E\u0908 {percentageRate}% \u092C\u0922\u093C\u093E\u0908 \u0917\u0908 \u0939\u0948\u0964 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u0938\u092E\u093E\u0928 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u091A\u094C\u0921\u093C\u093E\u0908 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u093E\u0928\u0940 \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-131": {
        template: "\u090F\u0915 \u092E\u093E\u0930\u094D\u0917-\u0938\u093E\u0930\u0923\u0940 \u092E\u0947\u0902 \u0938\u092E\u093E\u0928 \u0926\u0942\u0930\u0940 \u0915\u0947 \u0932\u093F\u090F \u0917\u0924\u093F {percentageRate}% \u092C\u0922\u093C\u0924\u0940 \u0939\u0948\u0964 \u092F\u093E\u0924\u094D\u0930\u093E-\u0938\u092E\u092F \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u0947\u0917\u093E?",
        difficulty: "Easy"
      },
      "PCT-QL-231": {
        template: "\u090F\u0915 \u0930\u0947\u0932-\u0938\u093E\u0930\u0923\u0940 \u092E\u0947\u0902 \u0938\u092E\u093E\u0928 \u092E\u093E\u0930\u094D\u0917 \u0915\u0947 \u0932\u093F\u090F \u0917\u0924\u093F {percentageRate}% \u092C\u0922\u093C\u0924\u0940 \u0939\u0948\u0964 \u092F\u093E\u0924\u094D\u0930\u093E-\u0938\u092E\u092F \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u0947\u0917\u093E?",
        difficulty: "Easy"
      },
      "PCT-QL-331": {
        template: "\u090F\u0915 \u0935\u093F\u0924\u0930\u0923-\u092E\u093E\u0930\u094D\u0917 \u091F\u093F\u092A\u094D\u092A\u0923\u0940 \u092E\u0947\u0902 \u0938\u092E\u093E\u0928 \u0926\u0942\u0930\u0940 \u0915\u0947 \u0932\u093F\u090F \u0917\u0924\u093F {percentageRate}% \u092C\u0922\u093C\u0924\u0940 \u0939\u0948\u0964 \u0935\u093F\u0924\u0930\u0923-\u0938\u092E\u092F \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u0947\u0917\u093E?",
        difficulty: "Easy"
      },
      "PCT-QL-431": {
        template: "\u090F\u0915 \u092C\u0938 \u0938\u092E\u092F-\u0938\u093E\u0930\u0923\u0940 \u092E\u0947\u0902 \u0938\u092E\u093E\u0928 \u092E\u093E\u0930\u094D\u0917 \u092A\u0930 \u0914\u0938\u0924 \u0917\u0924\u093F {percentageRate}% \u092C\u0922\u093C\u0924\u0940 \u0939\u0948\u0964 \u092F\u093E\u0924\u094D\u0930\u093E-\u0938\u092E\u092F \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u0947\u0917\u093E?",
        difficulty: "Easy"
      },
      "PCT-QL-132": {
        template: "\u090F\u0915 \u0938\u0902\u0936\u094B\u0927\u093F\u0924 \u092E\u0942\u0932\u094D\u092F \u091C\u094D\u091E\u093E\u092A\u0928 \u092E\u0947\u0902 \u0915\u093F\u0938\u0940 \u0935\u0938\u094D\u0924\u0941 \u0915\u093E \u092E\u0942\u0932\u094D\u092F {rate1}% \u092C\u0922\u093C\u093E\u092F\u093E \u0917\u092F\u093E \u0939\u0948\u0964 \u092A\u0939\u0932\u0947 \u0915\u0947 \u092E\u0942\u0932\u094D\u092F \u092A\u0930 \u0932\u094C\u091F\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0938\u0902\u0936\u094B\u0927\u093F\u0924 \u092E\u0942\u0932\u094D\u092F \u0915\u094B \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u093E\u0928\u093E \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-232": {
        template: "\u090F\u0915 \u0926\u0941\u0915\u093E\u0928 \u0915\u0940 \u0938\u0942\u091A\u0928\u093E \u092E\u0947\u0902 \u0915\u093F\u0938\u0940 \u0935\u0938\u094D\u0924\u0941 \u0915\u093E \u092E\u0942\u0932\u094D\u092F {rate1}% \u092C\u0922\u093C\u093E\u092F\u093E \u0917\u092F\u093E \u0939\u0948\u0964 \u092A\u0939\u0932\u0947 \u0915\u0947 \u092E\u0942\u0932\u094D\u092F \u092A\u0930 \u0932\u094C\u091F\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0938\u0902\u0936\u094B\u0927\u093F\u0924 \u092E\u0942\u0932\u094D\u092F \u0915\u094B \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u093E\u0928\u093E \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-332": {
        template: "\u090F\u0915 \u0936\u0941\u0932\u094D\u0915 \u091C\u094D\u091E\u093E\u092A\u0928 \u092E\u0947\u0902 \u092E\u0942\u0932\u094D\u092F {rate1}% \u092C\u0922\u093C\u093E\u092F\u093E \u0917\u092F\u093E \u0939\u0948\u0964 \u092A\u0939\u0932\u0947 \u0915\u0940 \u0926\u0930 \u092A\u0930 \u0932\u094C\u091F\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0907\u0938\u0947 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u093E\u0928\u093E \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-432": {
        template: "\u090F\u0915 \u0936\u0941\u0932\u094D\u0915-\u0938\u093E\u0930\u0923\u0940 \u092E\u0947\u0902 \u0915\u093F\u0938\u0940 \u0936\u0941\u0932\u094D\u0915 \u0915\u094B {rate1}% \u092C\u0922\u093C\u093E\u092F\u093E \u0917\u092F\u093E \u0939\u0948\u0964 \u092A\u0941\u0930\u093E\u0928\u093E \u0936\u0941\u0932\u094D\u0915 \u092A\u0941\u0928\u0903 \u092A\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0928\u0908 \u0930\u093E\u0936\u093F \u0915\u094B \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u093E\u0928\u093E \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-133": {
        template: "\u090F\u0915 \u0936\u0941\u0932\u094D\u0915 \u092A\u0930\u093F\u092A\u0924\u094D\u0930 \u092E\u0947\u0902 \u0915\u0930 {rate1}% \u0918\u091F\u093E\u092F\u093E \u0917\u092F\u093E, \u091C\u092C\u0915\u093F \u092C\u093F\u0915\u094D\u0930\u0940 {rate2}% \u092C\u0922\u093C\u0940\u0964 \u0930\u093E\u091C\u0938\u094D\u0935 \u092E\u0947\u0902 \u0915\u0941\u0932 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092A\u0930\u093F\u0935\u0930\u094D\u0924\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-233": {
        template: "\u090F\u0915 \u091F\u093F\u0915\u091F\u093F\u0902\u0917 \u0938\u0942\u091A\u0928\u093E \u092E\u0947\u0902 \u0915\u0930 {rate1}% \u0918\u091F\u093E\u092F\u093E \u0917\u092F\u093E \u0914\u0930 \u092C\u093F\u0915\u094D\u0930\u0940 \u092E\u0947\u0902 {rate2}% \u0935\u0943\u0926\u094D\u0927\u093F \u0926\u0930\u094D\u091C \u0939\u0941\u0908\u0964 \u0930\u093E\u091C\u0938\u094D\u0935 \u092E\u0947\u0902 \u0915\u0941\u0932 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092A\u0930\u093F\u0935\u0930\u094D\u0924\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-333": {
        template: "\u090F\u0915 \u092C\u093E\u091C\u093C\u093E\u0930 \u0930\u093F\u092A\u094B\u0930\u094D\u091F \u092E\u0947\u0902 \u0915\u0930 {rate1}% \u0918\u091F\u093E \u0914\u0930 \u092C\u093F\u0915\u094D\u0930\u0940 \u0915\u0940 \u092E\u093E\u0924\u094D\u0930\u093E {rate2}% \u092C\u0922\u093C\u0940\u0964 \u0930\u093E\u091C\u0938\u094D\u0935 \u092E\u0947\u0902 \u0915\u0941\u0932 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092A\u0930\u093F\u0935\u0930\u094D\u0924\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-433": {
        template: "\u090F\u0915 \u0926\u0941\u0915\u093E\u0928 \u0930\u093E\u091C\u0938\u094D\u0935 \u091F\u093F\u092A\u094D\u092A\u0923\u0940 \u092E\u0947\u0902 \u0915\u0930 {rate1}% \u0918\u091F\u093E \u091C\u092C\u0915\u093F \u092C\u093F\u0915\u094D\u0930\u0940 {rate2}% \u092C\u0922\u093C\u0940\u0964 \u0930\u093E\u091C\u0938\u094D\u0935 \u092E\u0947\u0902 \u0915\u0941\u0932 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092A\u0930\u093F\u0935\u0930\u094D\u0924\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-134": {
        template: "\u090F\u0915 \u0920\u0947\u0915\u0947\u0926\u093E\u0930 \u092C\u093F\u0932 \u092E\u0947\u0902 \u0915\u093E\u0930\u094D\u092F \u0918\u0902\u091F\u0947 {percentageRate}% \u092C\u0922\u093C\u0947 \u0926\u093F\u0916\u093E\u090F \u0917\u090F \u0939\u0948\u0902\u0964 \u0915\u0941\u0932 \u092C\u093F\u0932 \u0938\u092E\u093E\u0928 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u092A\u094D\u0930\u0924\u093F \u0918\u0902\u091F\u093E \u092E\u091C\u0926\u0942\u0930\u0940 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u093E\u0928\u0940 \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-234": {
        template: "\u090F\u0915 \u0935\u0947\u0924\u0928-\u092A\u0924\u094D\u0930\u0915 \u092E\u0947\u0902 \u0915\u093E\u0930\u094D\u092F \u0918\u0902\u091F\u0947 {percentageRate}% \u092C\u0922\u093C\u0947 \u0926\u093F\u0916\u093E\u090F \u0917\u090F \u0939\u0948\u0902\u0964 \u0915\u0941\u0932 \u092C\u093F\u0932 \u0938\u092E\u093E\u0928 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u092A\u094D\u0930\u0924\u093F \u0918\u0902\u091F\u093E \u092E\u091C\u0926\u0942\u0930\u0940 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u093E\u0928\u0940 \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-334": {
        template: "\u090F\u0915 \u0936\u094D\u0930\u092E \u0938\u0942\u091A\u0928\u093E \u092E\u0947\u0902 \u0915\u093E\u0930\u094D\u092F \u0918\u0902\u091F\u094B\u0902 \u092E\u0947\u0902 {percentageRate}% \u0935\u0943\u0926\u094D\u0927\u093F \u0926\u0930\u094D\u091C \u0939\u0948\u0964 \u0915\u0941\u0932 \u092D\u0941\u0917\u0924\u093E\u0928 \u0905\u092A\u0930\u093F\u0935\u0930\u094D\u0924\u093F\u0924 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u092A\u094D\u0930\u0924\u093F \u0918\u0902\u091F\u093E \u092E\u091C\u0926\u0942\u0930\u0940 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u0928\u0940 \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-434": {
        template: "\u090F\u0915 \u0920\u0947\u0915\u0947\u0926\u093E\u0930 \u092C\u093F\u0932 \u092E\u0947\u0902 \u0915\u093E\u0930\u094D\u092F \u0918\u0902\u091F\u0947 {percentageRate}% \u092C\u0922\u093C\u0947 \u0939\u0948\u0902\u0964 \u092C\u093F\u0932 \u0938\u092E\u093E\u0928 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u092A\u094D\u0930\u0924\u093F \u0918\u0902\u091F\u093E \u0926\u0930 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0918\u091F\u0928\u0940 \u091A\u093E\u0939\u093F\u090F?",
        difficulty: "Easy"
      },
      "PCT-QL-135": {
        template: "\u090F\u0915 \u0935\u0943\u0924\u094D\u0924\u093E\u0915\u093E\u0930 \u092C\u0917\u0940\u091A\u0947 \u0915\u0940 \u092F\u094B\u091C\u0928\u093E \u092E\u0947\u0902 \u0924\u094D\u0930\u093F\u091C\u094D\u092F\u093E {percentageRate}% \u0918\u091F\u093E \u0926\u0940 \u0917\u0908 \u0939\u0948\u0964 \u0909\u0938\u0915\u0947 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u092E\u0947\u0902 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0915\u092E\u0940 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-235": {
        template: "\u090F\u0915 \u0935\u0943\u0924\u094D\u0924\u093E\u0915\u093E\u0930 \u0924\u093E\u0932\u093E\u092C \u0915\u0940 \u092F\u094B\u091C\u0928\u093E \u092E\u0947\u0902 \u0924\u094D\u0930\u093F\u091C\u094D\u092F\u093E {percentageRate}% \u0918\u091F\u093E \u0926\u0940 \u0917\u0908 \u0939\u0948\u0964 \u0909\u0938\u0915\u0947 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u092E\u0947\u0902 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0915\u092E\u0940 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-335": {
        template: "\u090F\u0915 \u0935\u0943\u0924\u094D\u0924\u093E\u0915\u093E\u0930 \u092A\u093E\u0930\u094D\u0915 \u0905\u092D\u093F\u0932\u0947\u0916 \u092E\u0947\u0902 \u0924\u094D\u0930\u093F\u091C\u094D\u092F\u093E {percentageRate}% \u0918\u091F\u093E\u0908 \u0917\u0908 \u0939\u0948\u0964 \u0909\u0938\u0915\u0947 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u092E\u0947\u0902 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0915\u092E\u0940 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-435": {
        template: "\u090F\u0915 \u0935\u0943\u0924\u094D\u0924\u093E\u0915\u093E\u0930 \u092E\u0948\u0926\u093E\u0928 \u0915\u0940 \u092F\u094B\u091C\u0928\u093E \u092E\u0947\u0902 \u0924\u094D\u0930\u093F\u091C\u094D\u092F\u093E {percentageRate}% \u0918\u091F\u093E \u0926\u0940 \u0917\u0908 \u0939\u0948\u0964 \u0909\u0938\u0915\u0947 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 \u092E\u0947\u0902 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0915\u092E\u0940 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      }
    }
  },
  "PCT-CP-005": {
    families: {
      "PCT-QL-036": {
        template: "\u090F\u0915 \u0935\u094D\u092F\u0915\u094D\u0924\u093F \u0906\u092F \u0915\u093E {rate1}% \u0916\u093E\u0928\u0947 \u092A\u0930, {rate2}% \u0915\u093F\u0930\u093E\u090F \u092A\u0930 \u0914\u0930 {rate3}% \u0905\u0928\u094D\u092F \u0916\u0930\u094D\u091A\u094B\u0902 \u092A\u0930 \u0932\u0917\u093E\u0924\u093E \u0939\u0948\u0964 \u092F\u0926\u093F \u0935\u0939 Rs. {value} \u092C\u091A\u093E\u0924\u093E \u0939\u0948, \u0924\u094B \u0915\u0941\u0932 \u0906\u092F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-037": {
        template: "\u090F\u0915 \u0935\u094D\u092F\u0915\u094D\u0924\u093F \u0935\u0947\u0924\u0928 \u0915\u093E {rate1}% \u0916\u093E\u0928\u0947 \u092A\u0930 \u0914\u0930 \u092C\u091A\u0947 \u0939\u0941\u090F \u0915\u093E {rate2}% \u0915\u093F\u0930\u093E\u090F \u092A\u0930 \u0916\u0930\u094D\u091A \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u0909\u0938\u0915\u0947 \u092A\u093E\u0938 Rs. {value} \u092C\u091A\u0924\u0947 \u0939\u0948\u0902\u0964 \u0935\u0947\u0924\u0928 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Hard"
      },
      "PCT-QL-038": {
        template: "\u091A\u0941\u0928\u093E\u0935 \u092E\u0947\u0902 \u0935\u093F\u091C\u0947\u0924\u093E \u0915\u094B {percentageRate}% \u0935\u094B\u091F \u092E\u093F\u0932\u0947 \u0914\u0930 \u0935\u0939 {voteDifference} \u0935\u094B\u091F\u094B\u0902 \u0938\u0947 \u091C\u0940\u0924\u093E\u0964 \u0915\u0941\u0932 \u0935\u094B\u091F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-039": {
        template: "\u090F\u0915 \u091A\u0941\u0928\u093E\u0935 \u092E\u0947\u0902 {rate1}% \u0935\u094B\u091F \u0930\u0926\u094D\u0926 \u0939\u0941\u090F\u0964 \u0935\u093F\u091C\u0947\u0924\u093E \u0915\u094B \u0938\u0939\u0940 \u0935\u094B\u091F\u094B\u0902 \u0915\u093E {rate2}% \u092E\u093F\u0932\u093E \u0914\u0930 \u0935\u0939 {voteDifference} \u0935\u094B\u091F\u094B\u0902 \u0938\u0947 \u091C\u0940\u0924\u093E\u0964 \u0915\u0941\u0932 \u0935\u094B\u091F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Hard"
      },
      "PCT-QL-040": {
        template: "\u090F\u0915 \u091B\u093E\u0924\u094D\u0930 \u0915\u094B \u092A\u093E\u0938 \u0939\u094B\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F {passRate}% \u0905\u0902\u0915 \u091A\u093E\u0939\u093F\u090F\u0964 \u0909\u0938\u0947 {marksObtained} \u0905\u0902\u0915 \u092E\u093F\u0932\u0947 \u0914\u0930 \u0935\u0939 {failMargin} \u0905\u0902\u0915\u094B\u0902 \u0938\u0947 \u092B\u0947\u0932 \u0939\u0941\u0906\u0964 \u0915\u0941\u0932 \u0905\u0902\u0915 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-041": {
        template: "\u090F\u0915 \u0938\u094D\u0915\u0942\u0932 \u092E\u0947\u0902 {rate1}% \u0935\u093F\u0926\u094D\u092F\u093E\u0930\u094D\u0925\u0940 \u0932\u0921\u093C\u0915\u0947 \u0939\u0948\u0902\u0964 \u092F\u0926\u093F \u0932\u0921\u093C\u0915\u093F\u092F\u093E\u0902 {value} \u0939\u0948\u0902, \u0924\u094B \u0915\u0941\u0932 \u0935\u093F\u0926\u094D\u092F\u093E\u0930\u094D\u0925\u0940 \u0915\u093F\u0924\u0928\u0947 \u0939\u0948\u0902?",
        difficulty: "Easy"
      },
      "PCT-QL-042": {
        template: "{totalPopulation} \u0932\u094B\u0917\u094B\u0902 \u092E\u0947\u0902 {percentageRate}% \u092A\u0941\u0930\u0941\u0937 \u0939\u0948\u0902\u0964 \u092E\u0939\u093F\u0932\u093E\u0913\u0902 \u0915\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-043": {
        template: "\u092A\u0930\u0940\u0915\u094D\u0937\u093E \u092E\u0947\u0902 A \u0915\u094B B \u0938\u0947 {rate1}% \u0905\u0927\u093F\u0915 \u0905\u0902\u0915 \u092E\u093F\u0932\u0947\u0964 \u092F\u0926\u093F A \u0915\u094B {marks} \u0905\u0902\u0915 \u092E\u093F\u0932\u0947, \u0924\u094B B \u0915\u0947 \u0905\u0902\u0915 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-044": {
        template: "\u090F\u0915 \u0917\u093E\u0902\u0935 \u092E\u0947\u0902 {rate1}% \u0932\u094B\u0917 \u092A\u0922\u093C\u0947-\u0932\u093F\u0916\u0947 \u0939\u0948\u0902 \u0914\u0930 {value} \u0932\u094B\u0917 \u0905\u0928\u092A\u0922\u093C \u0939\u0948\u0902\u0964 \u0915\u0941\u0932 \u091C\u0928\u0938\u0902\u0916\u094D\u092F\u093E \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-045": {
        template: "\u090F\u0915 \u0935\u094D\u092F\u0915\u094D\u0924\u093F \u0928\u0947 \u0905\u092A\u0928\u0940 \u0930\u093E\u0936\u093F \u0915\u093E {rate1}% \u092A\u0924\u094D\u0928\u0940 \u0915\u094B, {rate2}% \u092C\u0947\u091F\u0947 \u0915\u094B \u0914\u0930 \u092C\u093E\u0915\u0940 Rs. {value} \u092C\u0947\u091F\u0940 \u0915\u094B \u0926\u093F\u090F\u0964 \u0936\u0941\u0930\u0941\u0906\u0924 \u092E\u0947\u0902 \u0909\u0938\u0915\u0947 \u092A\u093E\u0938 \u0915\u093F\u0924\u0928\u0940 \u0930\u093E\u0936\u093F \u0925\u0940?",
        difficulty: "Medium"
      },
      "PCT-QL-046": {
        template: "\u090F\u0915 \u092E\u093F\u0936\u094D\u0930\u0927\u093E\u0924\u0941 \u092E\u0947\u0902 {rate1}% \u0924\u093E\u0902\u092C\u093E \u0939\u0948 \u0914\u0930 \u092C\u093E\u0915\u0940 \u091C\u0938\u094D\u0924\u093E \u0939\u0948\u0964 \u092F\u0926\u093F \u091C\u0938\u094D\u0924\u093E {value} kg \u0939\u0948, \u0924\u094B \u0915\u0941\u0932 \u092D\u093E\u0930 \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-047": {
        template: "\u0926\u094B \u0909\u092E\u094D\u092E\u0940\u0926\u0935\u093E\u0930\u094B\u0902 \u092E\u0947\u0902 \u090F\u0915 \u0915\u094B {rate1}% \u0935\u094B\u091F \u092E\u093F\u0932\u0947 \u0914\u0930 \u0935\u0939 {voteDifference} \u0935\u094B\u091F\u094B\u0902 \u0938\u0947 \u0939\u093E\u0930 \u0917\u092F\u093E\u0964 \u0915\u0941\u0932 \u0935\u094B\u091F \u091C\u094D\u091E\u093E\u0924 \u0915\u0940\u091C\u093F\u090F\u0964",
        difficulty: "Medium"
      }
    }
  },
  "PCT-CP-006": {
    families: {
      "PCT-QL-048": {
        template: "{totalMixture} \u0932\u0940\u091F\u0930 \u092E\u093F\u0936\u094D\u0930\u0923 \u092E\u0947\u0902 {percentageRate}% \u090F\u0938\u093F\u0921 \u0939\u0948\u0964 \u0907\u0938\u0947 {newRate}% \u090F\u0938\u093F\u0921 \u092C\u0928\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u093F\u0924\u0928\u093E \u092A\u093E\u0928\u0940 \u092E\u093F\u0932\u093E\u0928\u093E \u0939\u094B\u0917\u093E?",
        difficulty: "Hard"
      },
      "PCT-QL-049": {
        template: "{totalQuantity} kg \u0924\u093E\u091C\u0947 \u092B\u0932 \u092E\u0947\u0902 {waterRate}% \u092A\u093E\u0928\u0940 \u0939\u0948 \u0914\u0930 \u0938\u0942\u0916\u0947 \u092B\u0932 \u092E\u0947\u0902 {dryWaterRate}% \u092A\u093E\u0928\u0940 \u0939\u0948\u0964 \u0915\u093F\u0924\u0928\u0947 kg \u0938\u0942\u0916\u0947 \u092B\u0932 \u092E\u093F\u0932\u0947\u0902\u0917\u0947?",
        difficulty: "Hard"
      },
      "PCT-QL-050": {
        template: "{totalMixture} \u0932\u0940\u091F\u0930 \u0928\u092E\u0915 \u0915\u0947 \u0918\u094B\u0932 \u092E\u0947\u0902 {percentageRate}% \u0928\u092E\u0915 \u0939\u0948\u0964 \u0907\u0938\u0947 {newRate}% \u0918\u094B\u0932 \u092C\u0928\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u093F\u0924\u0928\u093E \u0928\u092E\u0915 \u092E\u093F\u0932\u093E\u0928\u093E \u0939\u094B\u0917\u093E?",
        difficulty: "Hard"
      },
      "PCT-QL-051": {
        template: "{totalMixture} \u0932\u0940\u091F\u0930 \u0915\u0947 {percentageRate}% \u0905\u0932\u094D\u0915\u094B\u0939\u0932 \u0918\u094B\u0932 \u092E\u0947\u0902 {value} \u0932\u0940\u091F\u0930 \u092A\u093E\u0928\u0940 \u092E\u093F\u0932\u093E\u092F\u093E \u0917\u092F\u093E\u0964 \u0905\u092C \u0905\u0932\u094D\u0915\u094B\u0939\u0932 \u0915\u093F\u0924\u0928\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0939\u094B\u0917\u093E?",
        difficulty: "Hard"
      },
      "PCT-QL-052": {
        template: "\u0924\u093E\u091C\u0947 \u0905\u0902\u0917\u0942\u0930\u094B\u0902 \u092E\u0947\u0902 {rate1}% \u092A\u093E\u0928\u0940 \u0914\u0930 \u0938\u0942\u0916\u0947 \u0905\u0902\u0917\u0942\u0930\u094B\u0902 \u092E\u0947\u0902 {rate2}% \u092A\u093E\u0928\u0940 \u0939\u094B\u0924\u093E \u0939\u0948\u0964 \u0938\u0942\u0916\u0947 \u0905\u0902\u0917\u0942\u0930 {value} kg \u0939\u0948\u0902\u0964 \u0924\u093E\u091C\u0947 \u0905\u0902\u0917\u0942\u0930\u094B\u0902 \u0915\u093E \u092D\u093E\u0930 \u0915\u093F\u0924\u0928\u093E \u0925\u093E?",
        difficulty: "Hard"
      },
      "PCT-QL-053": {
        template: "{totalMixture} mL \u0915\u0947 {percentageRate}% \u0918\u094B\u0932 \u0915\u094B {newRate}% \u092C\u0928\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u093F\u0924\u0928\u093E \u0936\u0941\u0926\u094D\u0927 \u0905\u0932\u094D\u0915\u094B\u0939\u0932 \u092E\u093F\u0932\u093E\u0928\u093E \u0939\u094B\u0917\u093E?",
        difficulty: "Hard"
      },
      "PCT-QL-054": {
        template: "\u090F\u0915 \u0918\u094B\u0932 \u092E\u0947\u0902 {percentageRate}% \u091A\u0940\u0928\u0940 \u0939\u0948\u0964 {value} kg \u092A\u093E\u0928\u0940 \u0909\u0921\u093C\u0928\u0947 \u092A\u0930 \u091A\u0940\u0928\u0940 {newRate}% \u0939\u094B \u091C\u093E\u0924\u0940 \u0939\u0948\u0964 \u0936\u0941\u0930\u0942 \u092E\u0947\u0902 \u0918\u094B\u0932 \u0915\u093E \u092D\u093E\u0930 \u0915\u093F\u0924\u0928\u093E \u0925\u093E?",
        difficulty: "Hard"
      },
      "PCT-QL-055": {
        template: "\u0924\u093E\u0902\u092C\u093E-\u091C\u0938\u094D\u0924\u093E \u092E\u093F\u0936\u094D\u0930\u0923 \u092E\u0947\u0902 {percentageRate}% \u0924\u093E\u0902\u092C\u093E \u0939\u0948\u0964 {totalWeight} kg \u092E\u093F\u0936\u094D\u0930\u0923 \u092E\u0947\u0902 \u091C\u0938\u094D\u0924\u093E \u0915\u093F\u0924\u0928\u093E \u0939\u094B\u0917\u093E?",
        difficulty: "Easy"
      }
    }
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-language.pa.json
var question_language_pa_default = {
  "PCT-CP-001": {
    families: {
      "PCT-QL-001": {
        template: "\u0A07\u0A71\u0A15 \u0A1A\u0A4B\u0A23 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A26\u0A30\u0A1C \u0A35\u0A4B\u0A1F\u0A30\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A28\u0A47 \u0A35\u0A4B\u0A1F \u0A2A\u0A3E\u0A08\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A15\u0A3F\u0A70\u0A28\u0A40\u0A06\u0A02 \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A2A\u0A08\u0A06\u0A02?",
        difficulty: "Easy"
      },
      "PCT-QL-101": {
        template: "\u0A07\u0A71\u0A15 \u0A2A\u0A4D\u0A30\u0A40\u0A16\u0A3F\u0A06 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A3F\u0A38\u0A47 \u0A09\u0A2E\u0A40\u0A26\u0A35\u0A3E\u0A30 \u0A28\u0A47 \u0A15\u0A41\u0A71\u0A32 {baseValue} \u0A05\u0A70\u0A15\u0A3E\u0A02 \u0A26\u0A3E {percentageRate}% \u0A39\u0A3E\u0A38\u0A32 \u0A15\u0A40\u0A24\u0A3E\u0964 \u0A09\u0A38\u0A28\u0A47 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A05\u0A70\u0A15 \u0A32\u0A0F?",
        difficulty: "Easy"
      },
      "PCT-QL-201": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A2A\u0A3F\u0A70\u0A21 \u0A26\u0A40 {baseValue} \u0A06\u0A2C\u0A3E\u0A26\u0A40 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A38\u0A3E\u0A16\u0A30 \u0A39\u0A28\u0964 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A32\u0A4B\u0A15 \u0A38\u0A3E\u0A16\u0A30 \u0A39\u0A28?",
        difficulty: "Easy"
      },
      "PCT-QL-301": {
        template: "\u0A07\u0A71\u0A15 \u0A15\u0A32\u0A40\u0A28\u0A3F\u0A15 \u0A15\u0A4B\u0A32 Rs. {baseValue} \u0A26\u0A3E \u0A2E\u0A3E\u0A38\u0A3F\u0A15 \u0A1A\u0A3E\u0A32\u0A42 \u0A05\u0A28\u0A41\u0A26\u0A3E\u0A28 \u0A39\u0A48\u0964 \u0A09\u0A39 \u0A07\u0A38\u0A26\u0A3E {percentageRate}% \u0A26\u0A35\u0A3E\u0A08\u0A06\u0A02 '\u0A24\u0A47 \u0A16\u0A30\u0A1A \u0A15\u0A30\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A26\u0A35\u0A3E\u0A08\u0A06\u0A02 \u0A26\u0A3E \u0A16\u0A30\u0A1A \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-401": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A35\u0A38\u0A24\u0A42 \u0A26\u0A40 \u0A26\u0A30\u0A1C \u0A15\u0A40\u0A2E\u0A24 Rs. {baseValue} \u0A39\u0A48\u0964 \u0A1C\u0A47 \u0A1B\u0A42\u0A1F {percentageRate}% \u0A39\u0A48, \u0A24\u0A3E\u0A02 \u0A1B\u0A42\u0A1F \u0A26\u0A40 \u0A30\u0A15\u0A2E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-501": {
        template: "\u0A1C\u0A47 \u0A15\u0A4B\u0A08 \u0A2B\u0A48\u0A15\u0A1F\u0A30\u0A40 \u0A39\u0A30 \u0A30\u0A4B\u0A1C\u0A3C {baseValue} \u0A07\u0A15\u0A3E\u0A08\u0A06\u0A02 \u0A2C\u0A23\u0A3E\u0A09\u0A02\u0A26\u0A40 \u0A39\u0A48 \u0A05\u0A24\u0A47 \u0A09\u0A28\u0A4D\u0A39\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A16\u0A30\u0A3E\u0A2C \u0A39\u0A28, \u0A24\u0A3E\u0A02 \u0A39\u0A30 \u0A30\u0A4B\u0A1C\u0A3C \u0A15\u0A3F\u0A70\u0A28\u0A40 \u0A16\u0A30\u0A3E\u0A2C \u0A07\u0A15\u0A3E\u0A08\u0A06\u0A02 \u0A2C\u0A23\u0A26\u0A40\u0A06\u0A02 \u0A39\u0A28?",
        difficulty: "Easy"
      },
      "PCT-QL-601": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A15\u0A42\u0A32 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40\u0A06\u0A02 \u0A26\u0A3E {percentageRate}% \u0A15\u0A41\u0A5C\u0A40\u0A06\u0A02 \u0A39\u0A28\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A15\u0A3F\u0A70\u0A28\u0A40\u0A06\u0A02 \u0A15\u0A41\u0A5C\u0A40\u0A06\u0A02 \u0A39\u0A28?",
        difficulty: "Easy"
      },
      "PCT-QL-701": {
        template: "\u0A07\u0A71\u0A15 \u0A2E\u0A3F\u0A38\u0A3C\u0A30\u0A23 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A32\u0A40\u0A1F\u0A30 \u0A24\u0A30\u0A32 \u0A39\u0A48, \u0A1C\u0A3F\u0A38 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A2A\u0A3E\u0A23\u0A40 \u0A39\u0A48\u0964 \u0A07\u0A38 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A2A\u0A3E\u0A23\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-801": {
        template: "\u0A30\u0A3E\u0A39\u0A41\u0A32 \u0A15\u0A4B\u0A32 Rs. {baseValue} \u0A39\u0A28\u0964 \u0A09\u0A39 \u0A07\u0A38\u0A26\u0A3E {percentageRate}% \u0A06\u0A2A\u0A23\u0A47 \u0A26\u0A4B\u0A38\u0A24 \u0A28\u0A42\u0A70 \u0A26\u0A47 \u0A26\u0A3F\u0A70\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A09\u0A38\u0A28\u0A47 \u0A15\u0A3F\u0A70\u0A28\u0A40 \u0A30\u0A15\u0A2E \u0A26\u0A3F\u0A71\u0A24\u0A40?",
        difficulty: "Easy"
      },
      "PCT-QL-901": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A15\u0A3F\u0A24\u0A3E\u0A2C \u0A26\u0A40 \u0A26\u0A30\u0A1C \u0A15\u0A40\u0A2E\u0A24 Rs. {baseValue} \u0A39\u0A48\u0964 \u0A26\u0A41\u0A15\u093E\u0928\u0926\u093E\u0930 {percentageRate}% \u0A26\u0A40 \u0A1B\u0A42\u0A1F \u0A26\u0A3F\u0A70\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A1B\u0A42\u0A1F \u0A26\u0A40 \u0A30\u0A15\u0A2E \u0A15\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-1001": {
        template: "\u0A39\u0A3E\u0A1C\u0A3C\u0A30\u0A40 \u0A30\u0A1C\u0A3F\u0A38\u0A1F\u0A30 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40 \u0A26\u0A30\u0A1C \u0A39\u0A28 \u0A05\u0A24\u0A47 \u0A38\u0A4B\u0A2E\u0A35\u0A3E\u0A30 \u0A28\u0A42\u0A70 \u0A09\u0A28\u0A4D\u0A39\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A39\u0A3E\u0A1C\u0A3C\u0A30 \u0A38\u0A28\u0964 \u0A15\u0A32\u0A3E\u0A38 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40 \u0A39\u0A3E\u0A1C\u0A3C\u0A30 \u0A39\u0A4B\u0A0F?",
        difficulty: "Easy"
      },
      "PCT-QL-1101": {
        template: "\u0A07\u0A71\u0A15 \u0A2B\u0A32 \u0A35\u0A47\u0A1A\u0A23 \u0A35\u0A3E\u0A32\u0A47 \u0A15\u0A4B\u0A32 {baseValue} \u0A38\u0A47\u0A2C \u0A38\u0A28\u0964 \u0A09\u0A38\u0A28\u0A47 \u0A09\u0A28\u0A4D\u0A39\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A35\u0A47\u0A1A \u0A26\u0A3F\u0A71\u0A24\u0A47\u0964 \u0A35\u0A47\u0A1A\u0A47 \u0A17\u0A0F \u0A38\u0A47\u0A2C\u0A3E\u0A02 \u0A26\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1201": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A2A\u0A4D\u0A30\u0A40\u0A16\u0A3F\u0A06 \u0A35\u0A3F\u0A71\u0A1A \u0A38\u0A3C\u0A3E\u0A2E\u0A32 {baseValue} \u0A09\u0A2E\u0A40\u0A26\u0A35\u0A3E\u0A30\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A2A\u0A3E\u0A38 \u0A39\u0A4B\u0A0F\u0964 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A3E\u0A38 \u0A39\u0A4B\u0A0F?",
        difficulty: "Easy"
      },
      "PCT-QL-1301": {
        template: "\u0A07\u0A71\u0A15 \u0A2E\u0A3F\u0A38\u0A3C\u0A30\u0A27\u0A3E\u0A24\u0A42 \u0A26\u0A3E \u0A15\u0A41\u0A71\u0A32 \u0A2D\u0A3E\u0A30 {baseValue} \u0A15\u0A3F\u0A32\u0A4B \u0A39\u0A48\u0964 \u0A1C\u0A47 \u0A07\u0A38\u0A26\u0A3E {percentageRate}% \u0A24\u0A3E\u0A2E\u0A2C\u0A3E \u0A39\u0A48, \u0A24\u0A3E\u0A02 \u0A24\u0A3E\u0A2E\u0A2C\u0A47 \u0A26\u0A3E \u0A2D\u0A3E\u0A30 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1401": {
        template: "\u0A1C\u0A47 {baseValue} \u0A26\u0A3E {percentageRate}% = x \u0A39\u0A48, \u0A24\u0A3E\u0A02 x \u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 \u0A15\u0A40 \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E?",
        difficulty: "Easy"
      },
      "PCT-QL-1501": {
        template: "\u0A07\u0A71\u0A15 \u0A32\u0A3E\u0A07\u0A2C\u0A4D\u0A30\u0A47\u0A30\u0A40 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A15\u0A3F\u0A24\u0A3E\u0A2C\u0A3E\u0A02 \u0A39\u0A28 \u0A05\u0A24\u0A47 \u0A09\u0A28\u0A4D\u0A39\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A15\u0A25\u0A3E-\u0A38\u0A3E\u0A39\u0A3F\u0A24 \u0A26\u0A40\u0A06\u0A02 \u0A39\u0A28\u0964 \u0A15\u0A25\u0A3E-\u0A38\u0A3E\u0A39\u0A3F\u0A24 \u0A26\u0A40\u0A06\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A40\u0A06\u0A02 \u0A15\u0A3F\u0A24\u0A3E\u0A2C\u0A3E\u0A02 \u0A39\u0A28?",
        difficulty: "Easy"
      },
      "PCT-QL-1601": {
        template: "\u0A15\u0A4B\u0A08 \u0A35\u0A3F\u0A05\u0A15\u0A24\u0A40 Rs. {baseValue} \u0A26\u0A40 \u0A24\u0A28\u0A16\u0A3C\u0A3E\u0A39 \u0A26\u0A3E {percentageRate}% \u0A2C\u0A1A\u0A3E\u0A02\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A2C\u0A1A\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1701": {
        template: "{baseValue} \u0A30\u0A41\u0A71\u0A16\u0A3E\u0A02 \u0A35\u0A3E\u0A32\u0A47 \u0A07\u0A71\u0A15 \u0A2C\u0A3E\u0A17 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A05\u0A70\u0A2C \u0A26\u0A47 \u0A30\u0A41\u0A71\u0A16 \u0A39\u0A28\u0964 \u0A05\u0A70\u0A2C \u0A26\u0A47 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A30\u0A41\u0A71\u0A16 \u0A39\u0A28?",
        difficulty: "Easy"
      },
      "PCT-QL-1801": {
        template: "\u0A07\u0A71\u0A15 \u0A2A\u0A3E\u0A23\u0A40 \u0A26\u0A47 \u0A1F\u0A48\u0A02\u0A15 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A32\u0A40\u0A1F\u0A30 \u0A2A\u0A3E\u0A23\u0A40 \u0A39\u0A48\u0964 \u0A07\u0A38 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A2A\u0A3E\u0A23\u0A40 \u0A35\u0A30\u0A24\u0A3F\u0A06 \u0A17\u0A3F\u0A06\u0964 \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A2A\u0A3E\u0A23\u0A40 \u0A35\u0A30\u0A24\u0A3F\u0A06 \u0A17\u0A3F\u0A06?",
        difficulty: "Easy"
      },
      "PCT-QL-1901": {
        template: "\u0A07\u0A71\u0A15 \u0A28\u0A3F\u0A35\u0A47\u0A38\u0A3C\u0A15 \u0A28\u0A42\u0A70 Rs. {baseValue} '\u0A24\u0A47 {percentageRate}% \u0A32\u0A3E\u0A2D \u0A39\u0A41\u0A70\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A32\u0A3E\u0A2D \u0A26\u0A40 \u0A30\u0A15\u0A2E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-002": {
        template: "\u0A07\u0A71\u0A15 \u0A2A\u0A4B\u0A32\u0A3F\u0A70\u0A17 \u0A2C\u0A42\u0A25 '\u0A24\u0A47 {baseValue} \u0A26\u0A30\u0A1C \u0A35\u0A4B\u0A1F\u0A30 \u0A38\u0A28 \u0A05\u0A24\u0A47 \u0A09\u0A28\u0A4D\u0A39\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A28\u0A47 \u0A35\u0A4B\u0A1F \u0A2A\u0A3E\u0A08\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A15\u0A3F\u0A70\u0A28\u0A40\u0A06\u0A02 \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A2A\u0A08\u0A06\u0A02?",
        difficulty: "Easy"
      },
      "PCT-QL-102": {
        template: "\u0A28\u0A24\u0A40\u0A1C\u0A3E-\u0A2A\u0A71\u0A24\u0A30 \u0A35\u0A3F\u0A71\u0A1A \u0A35\u0A71\u0A27 \u0A24\u0A4B\u0A02 \u0A35\u0A71\u0A27 \u0A05\u0A70\u0A15 {baseValue} \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A39\u0A4B\u0A0F \u0A39\u0A28\u0964 \u0A1C\u0A47 \u0A15\u0A3F\u0A38\u0A47 \u0A09\u0A2E\u0A40\u0A26\u0A35\u0A3E\u0A30 \u0A28\u0A47 {percentageRate}% \u0A05\u0A70\u0A15 \u0A32\u0A0F, \u0A24\u0A3E\u0A02 \u0A09\u0A38\u0A28\u0A47 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A05\u0A70\u0A15 \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24 \u0A15\u0A40\u0A24\u0A47?",
        difficulty: "Easy"
      },
      "PCT-QL-202": {
        template: "\u0A07\u0A71\u0A15 \u0A2A\u0A3F\u0A70\u0A21 \u0A26\u0A47 \u0A38\u0A3E\u0A16\u0A30\u0A24\u0A3E \u0A38\u0A30\u0A35\u0A47\u0A16\u0A23 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A32\u0A4B\u0A15 \u0A38\u0A3C\u0A3E\u0A2E\u0A32 \u0A39\u0A28\u0964 \u0A1C\u0A47 \u0A09\u0A28\u0A4D\u0A39\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A38\u0A3E\u0A16\u0A30 \u0A39\u0A28, \u0A24\u0A3E\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A32\u0A4B\u0A15 \u0A38\u0A3E\u0A16\u0A30 \u0A39\u0A28?",
        difficulty: "Easy"
      },
      "PCT-QL-302": {
        template: "\u0A07\u0A71\u0A15 \u0A1C\u0A3C\u0A3F\u0A32\u0A4D\u0A39\u0A3E \u0A05\u0A1C\u0A3E\u0A07\u0A2C\u0A18\u0A30 \u0A15\u0A4B\u0A32 Rs. {baseValue} \u0A26\u0A3E \u0A38\u0A3E\u0A32\u0A3E\u0A28\u0A3E \u0A30\u0A71\u0A16-\u0A30\u0A16\u0A3E\u0A35 \u0A2B\u0A70\u0A21 \u0A39\u0A48\u0964 \u0A09\u0A39 \u0A07\u0A38\u0A26\u0A3E {percentageRate}% \u0A2E\u0A41\u0A5C-\u0A38\u0A70\u0A2D\u0A3E\u0A32 \u0A26\u0A47 \u0A15\u0A70\u0A2E '\u0A24\u0A47 \u0A16\u0A30\u0A1A \u0A15\u0A30\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A09\u0A39 \u0A16\u0A30\u0A1A \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-402": {
        template: "\u0A07\u0A71\u0A15 \u0A15\u0A3F\u0A24\u0A3E\u0A2C \u0A26\u0A40 \u0A26\u0A30\u0A1C \u0A15\u0A40\u0A2E\u0A24 Rs. {baseValue} \u0A39\u0A48\u0964 \u0A1C\u0A47 \u0A07\u0A38 '\u0A24\u0A47 {percentageRate}% \u0A26\u0A40 \u0A1B\u0A42\u0A1F \u0A26\u0A3F\u0A71\u0A24\u0A40 \u0A1C\u0A3E\u0A02\u0A26\u0A40 \u0A39\u0A48, \u0A24\u0A3E\u0A02 \u0A1B\u0A42\u0A1F \u0A26\u0A40 \u0A30\u0A15\u0A2E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-502": {
        template: "\u0A30\u0A4B\u0A1C\u0A3C\u0A3E\u0A28\u0A3E \u0A1C\u0A3E\u0A02\u0A1A-\u0A2A\u0A71\u0A24\u0A30 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A24\u0A3F\u0A06\u0A30 \u0A15\u0A40\u0A24\u0A40\u0A06\u0A02 \u0A07\u0A15\u0A3E\u0A08\u0A06\u0A02 \u0A26\u0A30\u0A1C \u0A39\u0A28, \u0A1C\u0A3F\u0A28\u0A4D\u0A39\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A16\u0A30\u0A3E\u0A2C \u0A39\u0A28\u0964 \u0A15\u0A3F\u0A70\u0A28\u0A40\u0A06\u0A02 \u0A16\u0A30\u0A3E\u0A2C \u0A07\u0A15\u0A3E\u0A08\u0A06\u0A02 \u0A2E\u0A3F\u0A32\u0A40\u0A06\u0A02?",
        difficulty: "Easy"
      },
      "PCT-QL-602": {
        template: "{baseValue} \u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40\u0A06\u0A02 \u0A26\u0A40 \u0A07\u0A71\u0A15 \u0A15\u0A32\u0A3E\u0A38 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A15\u0A41\u0A5C\u0A40\u0A06\u0A02 \u0A39\u0A28\u0964 \u0A15\u0A41\u0A5C\u0A40\u0A06\u0A02 \u0A26\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-702": {
        template: "\u0A07\u0A71\u0A15 \u0A32\u0A48\u0A2C \u0A28\u0A4B\u0A1F \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A32\u0A40\u0A1F\u0A30 \u0A18\u0A4B\u0A32 \u0A26\u0A30\u0A1C \u0A39\u0A48, \u0A1C\u0A3F\u0A38 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A2A\u0A3E\u0A23\u0A40 \u0A39\u0A48\u0964 \u0A07\u0A38 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A32\u0A40\u0A1F\u0A30 \u0A2A\u0A3E\u0A23\u0A40 \u0A39\u0A28?",
        difficulty: "Easy"
      },
      "PCT-QL-802": {
        template: "\u0A28\u0A15\u0A26-\u0A2C\u0A39\u0A40 \u0A35\u0A3F\u0A71\u0A1A Rs. {baseValue} \u0A09\u0A2A\u0A32\u0A2C\u0A27 \u0A26\u0A30\u0A38\u0A3E\u0A0F \u0A17\u0A0F \u0A39\u0A28\u0964 \u0A1C\u0A47 \u0A07\u0A38\u0A26\u0A3E {percentageRate}% \u0A05\u0A26\u0A3E \u0A15\u0A30 \u0A26\u0A3F\u0A71\u0A24\u0A3E \u0A1C\u0A3E\u0A35\u0A47, \u0A24\u0A3E\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A40 \u0A30\u0A15\u0A2E \u0A26\u0A3F\u0A71\u0A24\u0A40 \u0A1C\u0A3E\u0A35\u0A47\u0A17\u0A40?",
        difficulty: "Easy"
      },
      "PCT-QL-902": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A47\u0A1A-\u0A2C\u0A3F\u0A71\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A3F\u0A24\u0A3E\u0A2C \u0A26\u0A40 \u0A26\u0A30\u0A1C \u0A15\u0A40\u0A2E\u0A24 Rs. {baseValue} \u0A05\u0A24\u0A47 \u0A1B\u0A42\u0A1F {percentageRate}% \u0A26\u0A3F\u0A71\u0A24\u0A40 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A1B\u0A42\u0A1F \u0A26\u0A40 \u0A30\u0A15\u0A2E \u0A15\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-1002": {
        template: "\u0A15\u0A32\u0A3E\u0A38 \u0A26\u0A40 \u0A39\u0A3E\u0A1C\u0A3C\u0A30\u0A40 \u0A38\u0A42\u0A1A\u0A40 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A28\u0A3E\u0A2E \u0A39\u0A28 \u0A05\u0A24\u0A47 \u0A09\u0A28\u0A4D\u0A39\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A39\u0A3E\u0A1C\u0A3C\u0A30 \u0A38\u0A28\u0964 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40 \u0A39\u0A3E\u0A1C\u0A3C\u0A30 \u0A39\u0A4B\u0A0F?",
        difficulty: "Easy"
      },
      "PCT-QL-1102": {
        template: "\u0A2B\u0A32 \u0A38\u0A1F\u0A3E\u0A15 \u0A30\u0A1C\u0A3F\u0A38\u0A1F\u0A30 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A38\u0A47\u0A2C \u0A26\u0A30\u0A1C \u0A39\u0A28\u0964 \u0A1C\u0A47 {percentageRate}% \u0A35\u0A47\u0A1A\u0A47 \u0A17\u0A0F, \u0A24\u0A3E\u0A02 \u0A35\u0A47\u0A1A\u0A47 \u0A17\u0A0F \u0A38\u0A47\u0A2C\u0A3E\u0A02 \u0A26\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1202": {
        template: "\u0A07\u0A71\u0A15 \u0A28\u0A24\u0A40\u0A1C\u0A3E-\u0A38\u0A3E\u0A30 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A09\u0A2E\u0A40\u0A26\u0A35\u0A3E\u0A30 \u0A39\u0A28 \u0A05\u0A24\u0A47 \u0A09\u0A28\u0A4D\u0A39\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A2A\u0A3E\u0A38 \u0A39\u0A4B\u0A0F\u0964 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A09\u0A2E\u0A40\u0A26\u0A35\u0A3E\u0A30 \u0A2A\u0A3E\u0A38 \u0A39\u0A4B\u0A0F?",
        difficulty: "Easy"
      },
      "PCT-QL-1302": {
        template: "\u0A15\u0A3E\u0A30\u0A16\u0A3E\u0A28\u0A47 \u0A26\u0A47 \u0A38\u0A2E\u0A71\u0A17\u0A30\u0A40 \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A15\u0A3F\u0A32\u0A4B \u0A26\u0A40 \u0A07\u0A71\u0A15 \u0A2E\u0A3F\u0A38\u0A3C\u0A30\u0A27\u0A3E\u0A24\u0A42 \u0A26\u0A30\u0A1C \u0A39\u0A48\u0964 \u0A1C\u0A47 \u0A07\u0A38\u0A26\u0A3E {percentageRate}% \u0A24\u0A3E\u0A2E\u0A2C\u0A3E \u0A39\u0A48, \u0A24\u0A3E\u0A02 \u0A24\u0A3E\u0A2E\u0A2C\u0A47 \u0A26\u0A3E \u0A2D\u0A3E\u0A30 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1402": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A30\u0A15\u0A38\u0A3C\u0A40\u0A1F \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A26\u0A3E {percentageRate}% \u0A15\u0A71\u0A22\u0A23 \u0A32\u0A08 \u0A15\u0A3F\u0A39\u0A3E \u0A17\u0A3F\u0A06 \u0A39\u0A48\u0964 \u0A1C\u0A47 \u0A09\u0A39 \u0A2E\u0A41\u0A71\u0A32 x \u0A39\u0A48, \u0A24\u0A3E\u0A02 x \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1502": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A3C\u0A48\u0A32\u0A2B\u0A3C \u0A30\u0A1C\u0A3F\u0A38\u0A1F\u0A30 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A15\u0A3F\u0A24\u0A3E\u0A2C\u0A3E\u0A02 \u0A26\u0A30\u0A1C \u0A39\u0A28 \u0A05\u0A24\u0A47 \u0A09\u0A28\u0A4D\u0A39\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A15\u0A25\u0A3E-\u0A38\u0A3E\u0A39\u0A3F\u0A24 \u0A26\u0A40\u0A06\u0A02 \u0A39\u0A28\u0964 \u0A15\u0A25\u0A3E-\u0A38\u0A3E\u0A39\u0A3F\u0A24 \u0A26\u0A40\u0A06\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A40\u0A06\u0A02 \u0A15\u0A3F\u0A24\u0A3E\u0A2C\u0A3E\u0A02 \u0A39\u0A28?",
        difficulty: "Easy"
      },
      "PCT-QL-1602": {
        template: "Rs. {baseValue} \u0A26\u0A40 \u0A2E\u0A3E\u0A38\u0A3F\u0A15 \u0A06\u0A2E\u0A26\u0A28 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A2C\u0A1A\u0A3E\u0A07\u0A06 \u0A1C\u0A3E\u0A02\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A2C\u0A1A\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1702": {
        template: "\u0A07\u0A71\u0A15 \u0A2C\u0A3E\u0A17\u0A2C\u0A3E\u0A28\u0A40 \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A30\u0A41\u0A71\u0A16 \u0A26\u0A30\u0A1C \u0A39\u0A28, \u0A1C\u0A3F\u0A28\u0A4D\u0A39\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A05\u0A70\u0A2C \u0A26\u0A47 \u0A30\u0A41\u0A71\u0A16 \u0A39\u0A28\u0964 \u0A05\u0A70\u0A2C \u0A26\u0A47 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A30\u0A41\u0A71\u0A16 \u0A39\u0A28?",
        difficulty: "Easy"
      },
      "PCT-QL-1802": {
        template: "\u0A38\u0A2A\u0A32\u0A3E\u0A08 \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A32\u0A40\u0A1F\u0A30 \u0A2A\u0A3E\u0A23\u0A40 \u0A35\u0A3E\u0A32\u0A3E \u0A07\u0A71\u0A15 \u0A1F\u0A48\u0A02\u0A15 \u0A26\u0A30\u0A1C \u0A39\u0A48\u0964 \u0A1C\u0A47 \u0A07\u0A38\u0A26\u0A3E {percentageRate}% \u0A35\u0A30\u0A24\u0A3F\u0A06 \u0A17\u0A3F\u0A06, \u0A24\u0A3E\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A2A\u0A3E\u0A23\u0A40 \u0A16\u0A30\u0A1A \u0A39\u0A4B\u0A07\u0A06?",
        difficulty: "Easy"
      },
      "PCT-QL-1902": {
        template: "\u0A07\u0A71\u0A15 \u0A15\u0A3E\u0A30\u0A4B\u0A2C\u0A3E\u0A30 Rs. {baseValue} \u0A26\u0A47 \u0A28\u0A3F\u0A35\u0A47\u0A38\u0A3C '\u0A24\u0A47 {percentageRate}% \u0A32\u0A3E\u0A2D \u0A15\u0A2E\u0A3E\u0A02\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A32\u0A3E\u0A2D \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-003": {
        template: "{percentageRate}% \u0A28\u0A42\u0A70 \u0A07\u0A38\u0A26\u0A47 \u0A38\u0A2D \u0A24\u0A4B\u0A02 \u0A38\u0A30\u0A32 \u0A2D\u0A3F\u0A70\u0A28 \u0A30\u0A42\u0A2A \u0A35\u0A3F\u0A71\u0A1A \u0A2C\u0A26\u0A32\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-103": {
        template: "{percentageRate}% \u0A28\u0A42\u0A70 \u0A38\u0A2D \u0A24\u0A4B\u0A02 \u0A38\u0A30\u0A32 \u0A2D\u0A3F\u0A70\u0A28 \u0A30\u0A42\u0A2A \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A3F\u0A16\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-203": {
        template: "{percentageRate}% \u0A26\u0A3E \u0A38\u0A2E\u0A24\u0A41\u0A71\u0A32 \u0A2D\u0A3F\u0A70\u0A28 \u0A15\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-303": {
        template: "{percentageRate}% \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A2D\u0A3F\u0A70\u0A28 \u0A26\u0A47 \u0A30\u0A42\u0A2A \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A3F\u0A16\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-403": {
        template: "{percentageRate}% \u0A28\u0A42\u0A70 \u0A2D\u0A3F\u0A70\u0A28 \u0A26\u0A47 \u0A30\u0A42\u0A2A \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A3F\u0A16\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-503": {
        template: "{percentageRate}% \u0A28\u0A42\u0A70 \u0A07\u0A38\u0A26\u0A47 \u0A38\u0A2D \u0A24\u0A4B\u0A02 \u0A38\u0A30\u0A32 \u0A2D\u0A3F\u0A70\u0A28 \u0A35\u0A3F\u0A71\u0A1A \u0A2C\u0A26\u0A32\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-603": {
        template: "{percentageRate}% \u0A26\u0A47 \u0A20\u0A40\u0A15 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A15\u0A3F\u0A39\u0A5C\u0A3E \u0A2D\u0A3F\u0A70\u0A28 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-703": {
        template: "\u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 {percentageRate}% \u0A28\u0A42\u0A70 \u0A2D\u0A3F\u0A70\u0A28 \u0A30\u0A42\u0A2A \u0A35\u0A3F\u0A71\u0A1A \u0A2C\u0A26\u0A32\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-803": {
        template: "{percentageRate}% \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A2D\u0A3F\u0A70\u0A28 \u0A26\u0A47 \u0A30\u0A42\u0A2A \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A3F\u0A16\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-903": {
        template: "{percentageRate}% \u0A28\u0A3E\u0A32 \u0A26\u0A30\u0A38\u0A3E\u0A07\u0A06 \u0A2D\u0A3F\u0A70\u0A28 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1003": {
        template: "{percentageRate}% \u0A28\u0A42\u0A70 \u0A38\u0A2D \u0A24\u0A4B\u0A02 \u0A38\u0A30\u0A32 \u0A2D\u0A3F\u0A70\u0A28 \u0A30\u0A42\u0A2A \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A3F\u0A16\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1103": {
        template: "{percentageRate}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A15\u0A3F\u0A39\u0A5C\u0A3E \u0A2D\u0A3F\u0A70\u0A28 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-1203": {
        template: "{percentageRate}% \u0A26\u0A3E \u0A38\u0A2D \u0A24\u0A4B\u0A02 \u0A38\u0A30\u0A32 \u0A2D\u0A3F\u0A70\u0A28 \u0A32\u0A3F\u0A16\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1303": {
        template: "{percentageRate}% \u0A28\u0A42\u0A70 \u0A38\u0A2E\u0A24\u0A41\u0A71\u0A32 \u0A2D\u0A3F\u0A70\u0A28 \u0A35\u0A3F\u0A71\u0A1A \u0A2C\u0A26\u0A32\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1403": {
        template: "{percentageRate}% \u0A28\u0A42\u0A70 \u0A2D\u0A3F\u0A70\u0A28 \u0A35\u0A3F\u0A71\u0A1A \u0A2C\u0A26\u0A32\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1503": {
        template: "{percentageRate}% \u0A32\u0A08 \u0A2D\u0A3F\u0A70\u0A28 \u0A32\u0A3F\u0A16\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1603": {
        template: "\u0A1C\u0A47 \u0A15\u0A4B\u0A08 \u0A2E\u0A41\u0A71\u0A32 {percentageRate}% \u0A39\u0A48, \u0A24\u0A3E\u0A02 \u0A07\u0A39 \u0A2A\u0A42\u0A30\u0A47 \u0A26\u0A3E \u0A15\u0A3F\u0A39\u0A5C\u0A3E \u0A2D\u0A3F\u0A70\u0A28 \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E?",
        difficulty: "Easy"
      },
      "PCT-QL-1703": {
        template: "{percentageRate}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A38\u0A2D \u0A24\u0A4B\u0A02 \u0A38\u0A30\u0A32 \u0A2D\u0A3F\u0A70\u0A28 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1803": {
        template: "{percentageRate}% \u0A26\u0A47 \u0A38\u0A2E\u0A24\u0A41\u0A71\u0A32 \u0A2D\u0A3F\u0A70\u0A28 \u0A32\u0A3F\u0A16\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1903": {
        template: "{percentageRate}% \u0A28\u0A42\u0A70 \u0A2D\u0A3F\u0A70\u0A28 \u0A26\u0A47 \u0A30\u0A42\u0A2A \u0A35\u0A3F\u0A71\u0A1A \u0A26\u0A30\u0A38\u0A3E\u0A13\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-004": {
        template: "{baseValue} \u0A26\u0A3E {value} \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-104": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40 \u0A28\u0A47 \u0A15\u0A41\u0A71\u0A32 {baseValue} \u0A05\u0A70\u0A15\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {value} \u0A05\u0A70\u0A15 \u0A32\u0A0F\u0964 \u0A09\u0A38\u0A26\u0A3E \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-204": {
        template: "\u0A15\u0A41\u0A71\u0A32 {baseValue} \u0A38\u0A47\u0A2C\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {value} \u0A38\u0A47\u0A2C \u0A38\u0A5C\u0A47 \u0A39\u0A4B\u0A0F \u0A38\u0A28\u0964 \u0A38\u0A5C\u0A47 \u0A39\u0A4B\u0A0F \u0A38\u0A47\u0A2C\u0A3E\u0A02 \u0A26\u0A3E \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-304": {
        template: "\u0A15\u0A4B\u0A08 \u0A35\u0A3F\u0A05\u0A15\u0A24\u0A40 \u0A06\u0A2A\u0A23\u0A40 \u0A15\u0A41\u0A71\u0A32 \u0A2E\u0A3E\u0A38\u0A3F\u0A15 \u0A06\u0A2E\u0A26\u0A28 Rs. {baseValue} \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 Rs. {value} \u0A2C\u0A1A\u0A3E\u0A02\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A2C\u0A1A\u0A24 \u0A26\u0A3E \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-404": {
        template: "\u0A1C\u0A47 {baseValue} \u0A35\u0A38\u0A24\u0A42\u0A06\u0A02 \u0A35\u0A3E\u0A32\u0A47 \u0A07\u0A71\u0A15 \u0A2C\u0A48\u0A1A \u0A35\u0A3F\u0A71\u0A1A {value} \u0A35\u0A38\u0A24\u0A42\u0A06\u0A02 \u0A16\u0A30\u0A3E\u0A2C \u0A39\u0A28, \u0A24\u0A3E\u0A02 \u0A16\u0A30\u0A3E\u0A2C\u0A40 \u0A26\u0A40 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A26\u0A30 \u0A15\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-504": {
        template: "\u0A07\u0A71\u0A15 \u0A1A\u0A4B\u0A23 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A3F\u0A38\u0A47 \u0A09\u0A2E\u0A40\u0A26\u0A35\u0A3E\u0A30 \u0A28\u0A42\u0A70 \u0A15\u0A41\u0A71\u0A32 {baseValue} \u0A35\u0A48\u0A27 \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {value} \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A2E\u0A3F\u0A32\u0A40\u0A06\u0A02\u0964 \u0A09\u0A38\u0A28\u0A47 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24 \u0A15\u0A40\u0A24\u0A40\u0A06\u0A02?",
        difficulty: "Easy"
      },
      "PCT-QL-604": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A35\u0A38\u0A24\u0A42 \u0A26\u0A40 \u0A32\u0A3E\u0A17\u0A24 \u0A15\u0A40\u0A2E\u0A24 Rs. {baseValue} \u0A39\u0A48 \u0A05\u0A24\u0A47 \u0A32\u0A3E\u0A2D Rs. {value} \u0A39\u0A48\u0964 \u0A32\u0A3E\u0A2D \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-704": {
        template: "{baseValue} \u0A32\u0A40\u0A1F\u0A30 \u0A26\u0A47 \u0A2E\u0A3F\u0A38\u0A3C\u0A30\u0A23 \u0A35\u0A3F\u0A71\u0A1A {value} \u0A32\u0A40\u0A1F\u0A30 \u0A26\u0A41\u0A71\u0A27 \u0A39\u0A48\u0964 \u0A2E\u0A3F\u0A38\u0A3C\u0A30\u0A23 \u0A35\u0A3F\u0A71\u0A1A \u0A26\u0A41\u0A71\u0A27 \u0A26\u0A3E \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-804": {
        template: "{baseValue} \u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40\u0A06\u0A02 \u0A26\u0A40 \u0A07\u0A71\u0A15 \u0A15\u0A32\u0A3E\u0A38 \u0A35\u0A3F\u0A71\u0A1A {value} \u0A15\u0A41\u0A5C\u0A40\u0A06\u0A02 \u0A39\u0A28\u0964 \u0A15\u0A41\u0A5C\u0A40\u0A06\u0A02 \u0A26\u0A3E \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A15\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-904": {
        template: "\u0A1C\u0A47 \u0A15\u0A41\u0A71\u0A32 {baseValue} \u0A15\u0A3F\u0A2E\u0A40 \u0A26\u0A40 \u0A2F\u0A3E\u0A24\u0A30\u0A3E \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {value} \u0A15\u0A3F\u0A2E\u0A40 \u0A2A\u0A42\u0A30\u0A40 \u0A39\u0A4B \u0A1A\u0A41\u0A71\u0A15\u0A40 \u0A39\u0A48, \u0A24\u0A3E\u0A02 \u0A2F\u0A3E\u0A24\u0A30\u0A3E \u0A26\u0A3E \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A42\u0A30\u0A3E \u0A39\u0A4B\u0A07\u0A06?",
        difficulty: "Easy"
      },
      "PCT-QL-1004": {
        template: "\u0A07\u0A71\u0A15 \u0A26\u0A41\u0A15\u093E\u0928\u0926\u093E\u0930 \u0A28\u0A47 Rs. {value} \u0A26\u0A40 \u0A1B\u0A42\u0A1F Rs. {baseValue} \u0A26\u0A40 \u0A26\u0A30\u0A1C \u0A15\u0A40\u0A2E\u0A24 '\u0A24\u0A47 \u0A26\u0A3F\u0A71\u0A24\u0A40\u0964 \u0A1B\u0A42\u0A1F \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1104": {
        template: "{baseValue} \u0A26\u0A40 \u0A06\u0A2C\u0A3E\u0A26\u0A40 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {value} \u0A32\u0A4B\u0A15 \u0A38\u0A3E\u0A16\u0A30 \u0A39\u0A28\u0964 \u0A38\u0A3E\u0A16\u0A30\u0A24\u0A3E \u0A26\u0A30 \u0A15\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-1204": {
        template: "\u0A15\u0A4B\u0A08 \u0A35\u0A3F\u0A05\u0A15\u0A24\u0A40 \u0A06\u0A2A\u0A23\u0A40 Rs. {baseValue} \u0A24\u0A28\u0A16\u0A3C\u0A3E\u0A39 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 Rs. {value} \u0A15\u0A3F\u0A30\u0A3E\u0A0F '\u0A24\u0A47 \u0A16\u0A30\u0A1A \u0A15\u0A30\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A09\u0A38\u0A26\u0A40 \u0A24\u0A28\u0A16\u0A3C\u0A3E\u0A39 \u0A26\u0A3E \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A15\u0A3F\u0A30\u0A3E\u0A0F \u0A35\u0A3F\u0A71\u0A1A \u0A1C\u0A3E\u0A02\u0A26\u0A3E \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-1304": {
        template: "\u0A1C\u0A47 \u0A15\u0A3F\u0A38\u0A47 \u0A2B\u0A48\u0A15\u0A1F\u0A30\u0A40 \u0A26\u0A3E \u0A32\u0A15\u0A38\u0A3C {baseValue} \u0A07\u0A15\u0A3E\u0A08\u0A06\u0A02 \u0A38\u0A40 \u0A05\u0A24\u0A47 \u0A07\u0A38\u0A28\u0A47 {value} \u0A07\u0A15\u0A3E\u0A08\u0A06\u0A02 \u0A24\u0A3F\u0A06\u0A30 \u0A15\u0A40\u0A24\u0A40\u0A06\u0A02, \u0A24\u0A3E\u0A02 \u0A32\u0A15\u0A38\u0A3C \u0A26\u0A3E \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A42\u0A30\u0A3E \u0A39\u0A4B\u0A07\u0A06?",
        difficulty: "Easy"
      },
      "PCT-QL-1404": {
        template: "\u0A07\u0A71\u0A15 \u0A15\u0A3F\u0A24\u0A3E\u0A2C \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A38\u0A2B\u0A3C\u0A47 \u0A39\u0A28 \u0A05\u0A24\u0A47 {value} \u0A38\u0A2B\u0A3C\u0A47 \u0A1A\u0A3F\u0A71\u0A24\u0A30\u0A3E\u0A02 \u0A35\u0A3E\u0A32\u0A47 \u0A39\u0A28\u0964 \u0A15\u0A3F\u0A24\u0A3E\u0A2C \u0A26\u0A3E \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2D\u0A3E\u0A17 \u0A1A\u0A3F\u0A71\u0A24\u0A30\u0A2F\u0A41\u0A15\u0A24 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-1504": {
        template: "\u0A26\u0A30\u0A1C \u0A15\u0A40\u0A2E\u0A24 Rs. {baseValue} \u0A39\u0A48 \u0A05\u0A24\u0A47 \u0A35\u0A47\u0A1A \u0A15\u0A40\u0A2E\u0A24 \u0A07\u0A38 \u0A24\u0A4B\u0A02 Rs. {value} \u0A18\u0A71\u0A1F \u0A39\u0A48\u0964 \u0A1B\u0A42\u0A1F \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A15\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-1604": {
        template: "{value} \u0A15\u0A3F\u0A32\u0A4B \u0A24\u0A3E\u0A2E\u0A2C\u0A47 \u0A28\u0A42\u0A70 \u0A39\u0A4B\u0A30 \u0A27\u0A3E\u0A24\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A2E\u0A3F\u0A32\u0A3E\u0A15\u0A47 {baseValue} \u0A15\u0A3F\u0A32\u0A4B \u0A26\u0A40 \u0A2E\u0A3F\u0A38\u0A3C\u0A30\u0A27\u0A3E\u0A24\u0A42 \u0A2C\u0A23\u0A3E\u0A08 \u0A17\u0A08\u0964 \u0A24\u0A3E\u0A2E\u0A2C\u0A47 \u0A26\u0A3E \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1704": {
        template: "\u0A1C\u0A47 \u0A15\u0A4B\u0A08 \u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40 \u0A15\u0A41\u0A71\u0A32 {baseValue} \u0A15\u0A3E\u0A30\u0A1C \u0A26\u0A3F\u0A28\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {value} \u0A26\u0A3F\u0A28 \u0A38\u0A15\u0A42\u0A32 \u0A1C\u0A3E\u0A02\u0A26\u0A3E \u0A39\u0A48, \u0A24\u0A3E\u0A02 \u0A09\u0A38\u0A26\u0A40 \u0A39\u0A3E\u0A1C\u0A3C\u0A30\u0A40 \u0A26\u0A3E \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1804": {
        template: "{baseValue} \u0A32\u0A40\u0A1F\u0A30 \u0A38\u0A2E\u0A30\u0A71\u0A25\u0A3E \u0A35\u0A3E\u0A32\u0A47 \u0A07\u0A71\u0A15 \u0A1F\u0A48\u0A02\u0A15 \u0A35\u0A3F\u0A71\u0A1A \u0A07\u0A38 \u0A35\u0A47\u0A32\u0A47 {value} \u0A32\u0A40\u0A1F\u0A30 \u0A2A\u0A3E\u0A23\u0A40 \u0A39\u0A48\u0964 \u0A1F\u0A48\u0A02\u0A15 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2D\u0A30\u0A3F\u0A06 \u0A39\u0A4B\u0A07\u0A06 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-1904": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A2A\u0A4D\u0A30\u0A4B\u0A1C\u0A48\u0A15\u0A1F \u0A32\u0A08 \u0A30\u0A3E\u0A16\u0A35\u0A47\u0A02 Rs. {baseValue} \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 Rs. {value} \u0A16\u0A30\u0A1A \u0A15\u0A40\u0A24\u0A47 \u0A17\u0A0F\u0964 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A16\u0A30\u0A1A \u0A39\u0A4B\u0A0F?",
        difficulty: "Easy"
      },
      "PCT-QL-005": {
        template: "A, B \u0A26\u0A3E {percentageRate}% \u0A39\u0A48\u0964 \u0A1C\u0A47 B = {baseValue}, \u0A24\u0A3E\u0A02 A \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-105": {
        template: "\u0A1C\u0A47 B = {baseValue} \u0A05\u0A24\u0A47 A, B \u0A26\u0A3E {percentageRate}% \u0A39\u0A48, \u0A24\u0A3E\u0A02 A \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-205": {
        template: "B = {baseValue} \u0A39\u0A48\u0964 A, B \u0A26\u0A3E {percentageRate}% \u0A39\u0A48\u0964 A \u0A15\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-305": {
        template: "B \u0A26\u0A3E {percentageRate}% = A \u0A39\u0A48\u0964 \u0A1C\u0A47 B = {baseValue}, \u0A24\u0A3E\u0A02 A \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-405": {
        template: "A, B \u0A26\u0A3E {percentageRate}% \u0A39\u0A48\u0964 \u0A1C\u0A47 B = {baseValue}, \u0A24\u0A3E\u0A02 A \u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 \u0A15\u0A40 \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E?",
        difficulty: "Easy"
      },
      "PCT-QL-006": {
        template: "A, B \u0A28\u0A3E\u0A32\u0A4B\u0A02 {percentageRate}% \u0A35\u0A71\u0A27 \u0A39\u0A48\u0964 B, A \u0A28\u0A3E\u0A32\u0A4B\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A71\u0A1F \u0A39\u0A48?",
        difficulty: "Medium"
      },
      "PCT-QL-106": {
        template: "\u0A1C\u0A47 A, B \u0A28\u0A3E\u0A32\u0A4B\u0A02 {percentageRate}% \u0A35\u0A71\u0A27 \u0A39\u0A48, \u0A24\u0A3E\u0A02 B, A \u0A28\u0A3E\u0A32\u0A4B\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A71\u0A1F \u0A39\u0A48?",
        difficulty: "Medium"
      },
      "PCT-QL-206": {
        template: "A, B \u0A28\u0A3E\u0A32\u0A4B\u0A02 {percentageRate}% \u0A35\u0A71\u0A27 \u0A39\u0A48\u0964 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B \u0A15\u0A3F B, A \u0A28\u0A3E\u0A32\u0A4B\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A71\u0A1F \u0A39\u0A48\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-306": {
        template: "A, B \u0A28\u0A3E\u0A32\u0A4B\u0A02 {percentageRate}% \u0A35\u0A71\u0A27 \u0A39\u0A48\u0964 B, A \u0A28\u0A3E\u0A32\u0A4B\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A71\u0A1F \u0A39\u0A48?",
        difficulty: "Medium"
      },
      "PCT-QL-406": {
        template: "\u0A1C\u0A47 A, B \u0A28\u0A3E\u0A32\u0A4B\u0A02 {percentageRate}% \u0A35\u0A71\u0A27 \u0A39\u0A48, \u0A24\u0A3E\u0A02 B, A \u0A28\u0A3E\u0A32\u0A4B\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A71\u0A1F \u0A39\u0A48?",
        difficulty: "Medium"
      },
      "PCT-QL-007": {
        template: "A, B \u0A28\u0A3E\u0A32\u0A4B\u0A02 {percentageRate}% \u0A18\u0A71\u0A1F \u0A39\u0A48\u0964 B, A \u0A28\u0A3E\u0A32\u0A4B\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A71\u0A27 \u0A39\u0A48?",
        difficulty: "Medium"
      },
      "PCT-QL-107": {
        template: "\u0A1C\u0A47 A, B \u0A28\u0A3E\u0A32\u0A4B\u0A02 {percentageRate}% \u0A18\u0A71\u0A1F \u0A39\u0A48, \u0A24\u0A3E\u0A02 B, A \u0A28\u0A3E\u0A32\u0A4B\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A71\u0A27 \u0A39\u0A48?",
        difficulty: "Medium"
      },
      "PCT-QL-207": {
        template: "A, B \u0A28\u0A3E\u0A32\u0A4B\u0A02 {percentageRate}% \u0A18\u0A71\u0A1F \u0A39\u0A48\u0964 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B \u0A15\u0A3F B, A \u0A28\u0A3E\u0A32\u0A4B\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A71\u0A27 \u0A39\u0A48\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-307": {
        template: "A, B \u0A28\u0A3E\u0A32\u0A4B\u0A02 {percentageRate}% \u0A18\u0A71\u0A1F \u0A39\u0A48\u0964 B, A \u0A28\u0A3E\u0A32\u0A4B\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A71\u0A27 \u0A39\u0A48?",
        difficulty: "Medium"
      },
      "PCT-QL-407": {
        template: "\u0A1C\u0A47 A, B \u0A28\u0A3E\u0A32\u0A4B\u0A02 {percentageRate}% \u0A18\u0A71\u0A1F \u0A39\u0A48, \u0A24\u0A3E\u0A02 B, A \u0A28\u0A3E\u0A32\u0A4B\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A71\u0A27 \u0A39\u0A48?",
        difficulty: "Medium"
      },
      "PCT-QL-008": {
        template: "\u0A1C\u0A47 A \u0A26\u0A3E {rate1}%, B \u0A26\u0A47 {rate2}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48, \u0A24\u0A3E\u0A02 A:B \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-108": {
        template: "\u0A1C\u0A47 A \u0A26\u0A3E {rate1}%, B \u0A26\u0A47 {rate2}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48, \u0A24\u0A3E\u0A02 A:B \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-208": {
        template: "A \u0A26\u0A3E {rate1}%, B \u0A26\u0A47 {rate2}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48\u0964 A:B \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-308": {
        template: "\u0A1C\u0A47 A \u0A26\u0A3E {rate1}% \u0A05\u0A24\u0A47 B \u0A26\u0A3E {rate2}% \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48, \u0A24\u0A3E\u0A02 A:B \u0A15\u0A40 \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E?",
        difficulty: "Medium"
      },
      "PCT-QL-408": {
        template: "\u0A1C\u0A26\u0A4B\u0A02 A \u0A26\u0A3E {rate1}%, B \u0A26\u0A47 {rate2}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A4B\u0A35\u0A47, \u0A24\u0A3E\u0A02 A:B \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-009": {
        template: "\u0A1C\u0A47 \u0A15\u0A3F\u0A38\u0A47 \u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A26\u0A3E {percentageRate}% = {value} \u0A39\u0A48, \u0A24\u0A3E\u0A02 \u0A09\u0A39 \u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A15\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-109": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40 \u0A28\u0A47 {value} \u0A05\u0A70\u0A15 \u0A32\u0A0F, \u0A1C\u0A4B \u0A35\u0A71\u0A27 \u0A24\u0A4B\u0A02 \u0A35\u0A71\u0A27 \u0A05\u0A70\u0A15\u0A3E\u0A02 \u0A26\u0A3E {percentageRate}% \u0A39\u0A28\u0964 \u0A35\u0A71\u0A27 \u0A24\u0A4B\u0A02 \u0A35\u0A71\u0A27 \u0A05\u0A70\u0A15 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-209": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A35\u0A3F\u0A05\u0A15\u0A24\u0A40 \u0A26\u0A40 \u0A2E\u0A3E\u0A38\u0A3F\u0A15 \u0A06\u0A2E\u0A26\u0A28 \u0A26\u0A3E {percentageRate}% = Rs. {value} \u0A39\u0A48\u0964 \u0A09\u0A38\u0A26\u0A40 \u0A15\u0A41\u0A71\u0A32 \u0A2E\u0A3E\u0A38\u0A3F\u0A15 \u0A06\u0A2E\u0A26\u0A28 \u0A15\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-309": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A15\u0A42\u0A32 \u0A35\u0A3F\u0A71\u0A1A {value} \u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40 \u0A15\u0A4D\u0A30\u0A3F\u0A15\u0A1F \u0A16\u0A47\u0A21\u0A26\u0A47 \u0A39\u0A28, \u0A1C\u0A4B \u0A15\u0A41\u0A71\u0A32 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A26\u0A3E {percentageRate}% \u0A39\u0A28\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40\u0A06\u0A02 \u0A26\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-409": {
        template: "\u0A06\u0A2A\u0A23\u0A3E {percentageRate}% \u0A27\u0A28 \u0A16\u0A30\u0A1A \u0A15\u0A30\u0A28 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A15\u0A3F\u0A38\u0A47 \u0A35\u0A3F\u0A05\u0A15\u0A24\u0A40 \u0A15\u0A4B\u0A32 Rs. {value} \u0A2C\u0A1A\u0A26\u0A47 \u0A39\u0A28\u0964 \u0A09\u0A38\u0A26\u0A40 \u0A38\u0A3C\u0A41\u0A30\u0A42\u0A06\u0A24\u0A40 \u0A15\u0A41\u0A71\u0A32 \u0A30\u0A15\u0A2E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-509": {
        template: "\u0A07\u0A71\u0A15 \u0A26\u0A41\u0A15\u093E\u0928\u0926\u093E\u0930 \u0A28\u0A47 {value} \u0A35\u0A38\u0A24\u0A42\u0A06\u0A02 \u0A35\u0A47\u0A1A\u0A40\u0A06\u0A02, \u0A1C\u0A4B \u0A09\u0A38\u0A26\u0A47 \u0A15\u0A41\u0A71\u0A32 \u0A38\u0A1F\u0A3E\u0A15 \u0A26\u0A3E {percentageRate}% \u0A38\u0A28\u0964 \u0A09\u0A38\u0A26\u0A3E \u0A15\u0A41\u0A71\u0A32 \u0A38\u0A1F\u0A3E\u0A15 \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A38\u0A40?",
        difficulty: "Easy"
      },
      "PCT-QL-609": {
        template: "\u0A1C\u0A47 {percentageRate}% \u0A26\u0A40 \u0A1B\u0A42\u0A1F Rs. {value} \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48, \u0A24\u0A3E\u0A02 \u0A26\u0A30\u0A1C \u0A15\u0A40\u0A2E\u0A24 \u0A15\u0A40 \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A40?",
        difficulty: "Easy"
      },
      "PCT-QL-709": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A35\u0A38\u0A24\u0A42 \u0A28\u0A42\u0A70 \u0A35\u0A47\u0A1A\u0A23 '\u0A24\u0A47 \u0A39\u0A4B\u0A07\u0A06 \u0A32\u0A3E\u0A2D Rs. {value} \u0A39\u0A48, \u0A1C\u0A4B \u0A07\u0A38\u0A26\u0A40 \u0A32\u0A3E\u0A17\u0A24 \u0A15\u0A40\u0A2E\u0A24 \u0A26\u0A3E {percentageRate}% \u0A39\u0A48\u0964 \u0A32\u0A3E\u0A17\u0A24 \u0A15\u0A40\u0A2E\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-809": {
        template: "\u0A1C\u0A47 \u0A15\u0A3F\u0A38\u0A47 \u0A38\u0A3C\u0A39\u0A3F\u0A30 \u0A26\u0A40 \u0A06\u0A2C\u0A3E\u0A26\u0A40 \u0A26\u0A3E {percentageRate}% = {value} \u0A39\u0A48, \u0A24\u0A3E\u0A02 \u0A15\u0A41\u0A71\u0A32 \u0A06\u0A2C\u0A3E\u0A26\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-909": {
        template: "\u0A07\u0A71\u0A15 \u0A15\u0A3E\u0A30 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A26\u0A40 \u0A15\u0A2E\u0A40 \u0A06\u0A09\u0A02\u0A26\u0A40 \u0A39\u0A48, \u0A1C\u0A4B Rs. {value} \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48\u0964 \u0A07\u0A38\u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A22\u0A32\u0A3E \u0A2E\u0A41\u0A71\u0A32 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1009": {
        template: "\u0A07\u0A71\u0A15 \u0A1F\u0A48\u0A02\u0A15 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {value} \u0A32\u0A40\u0A1F\u0A30 \u0A2A\u0A3E\u0A23\u0A40 \u0A28\u0A3F\u0A15\u0A32 \u0A17\u0A3F\u0A06, \u0A1C\u0A4B \u0A07\u0A38\u0A26\u0A40 \u0A15\u0A41\u0A71\u0A32 \u0A38\u0A2E\u0A30\u0A71\u0A25\u0A3E \u0A26\u0A3E {percentageRate}% \u0A38\u0A40\u0964 \u0A1F\u0A48\u0A02\u0A15 \u0A26\u0A40 \u0A15\u0A41\u0A71\u0A32 \u0A38\u0A2E\u0A30\u0A71\u0A25\u0A3E \u0A15\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-1109": {
        template: "\u0A15\u0A4B\u0A08 \u0A35\u0A3F\u0A05\u0A15\u0A24\u0A40 Rs. {value} \u0A06\u0A2E\u0A26\u0A28\u0A40 \u0A15\u0A30 \u0A26\u0A47\u0A02\u0A26\u0A3E \u0A39\u0A48, \u0A1C\u0A4B \u0A09\u0A38\u0A26\u0A40 \u0A15\u0A41\u0A71\u0A32 \u0A24\u0A28\u0A16\u0A3C\u0A3E\u0A39 \u0A26\u0A3E {percentageRate}% \u0A39\u0A48\u0964 \u0A09\u0A38\u0A26\u0A40 \u0A15\u0A41\u0A71\u0A32 \u0A24\u0A28\u0A16\u0A3C\u0A3E\u0A39 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1209": {
        template: "\u0A1C\u0A47 \u0A15\u0A3F\u0A38\u0A47 \u0A2F\u0A3E\u0A24\u0A30\u0A3E \u0A26\u0A3E {percentageRate}% = {value} \u0A15\u0A3F\u0A2E\u0A40 \u0A39\u0A48, \u0A24\u0A3E\u0A02 \u0A15\u0A41\u0A71\u0A32 \u0A26\u0A42\u0A30\u0A40 \u0A15\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-1309": {
        template: "\u0A07\u0A71\u0A15 \u0A15\u0A32\u0A3E\u0A38 \u0A35\u0A3F\u0A71\u0A1A \u0A17\u0A48\u0A30\u0A39\u0A3E\u0A1C\u0A3C\u0A30 \u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40\u0A06\u0A02 \u0A26\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 {value} \u0A39\u0A48, \u0A1C\u0A4B \u0A15\u0A41\u0A71\u0A32 \u0A26\u0A3E {percentageRate}% \u0A39\u0A48\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40\u0A06\u0A02 \u0A26\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1409": {
        template: "\u0A1C\u0A47 \u0A15\u0A3F\u0A38\u0A47 \u0A2E\u0A3F\u0A38\u0A3C\u0A30\u0A27\u0A3E\u0A24\u0A42 \u0A35\u0A3F\u0A71\u0A1A {value} \u0A15\u0A3F\u0A32\u0A4B \u0A1C\u0A3C\u0A3F\u0A70\u0A15 \u0A39\u0A48, \u0A1C\u0A4B \u0A07\u0A38\u0A26\u0A47 \u0A15\u0A41\u0A71\u0A32 \u0A2D\u0A3E\u0A30 \u0A26\u0A3E {percentageRate}% \u0A39\u0A48, \u0A24\u0A3E\u0A02 \u0A15\u0A41\u0A71\u0A32 \u0A2D\u0A3E\u0A30 \u0A15\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-1509": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A2A\u0A3E\u0A30\u0A40 \u0A28\u0A42\u0A70 Rs. {value} \u0A26\u0A3E \u0A28\u0A41\u0A15\u0A38\u0A3E\u0A28 \u0A39\u0A4B\u0A07\u0A06, \u0A1C\u0A4B \u0A07\u0A38\u0A26\u0A47 \u0A28\u0A3F\u0A35\u0A47\u0A38\u0A3C \u0A26\u0A3E {percentageRate}% \u0A39\u0A48\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A28\u0A3F\u0A35\u0A47\u0A38\u0A3C \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1609": {
        template: "\u0A1C\u0A47 \u0A15\u0A3F\u0A38\u0A47 \u0A15\u0A3F\u0A24\u0A3E\u0A2C \u0A26\u0A3E {percentageRate}% \u0A2D\u0A3E\u0A17 {value} \u0A1A\u0A3F\u0A71\u0A24\u0A30\u0A2F\u0A41\u0A15\u0A24 \u0A38\u0A2B\u0A3C\u0A3F\u0A06\u0A02 \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48, \u0A24\u0A3E\u0A02 \u0A15\u0A3F\u0A24\u0A3E\u0A2C \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A41\u0A71\u0A32 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A38\u0A2B\u0A3C\u0A47 \u0A39\u0A28?",
        difficulty: "Easy"
      },
      "PCT-QL-1709": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A30\u0A15\u0A2E '\u0A24\u0A47 \u0A2E\u0A3F\u0A32\u0A3F\u0A06 \u0A35\u0A3F\u0A06\u0A1C Rs. {value} \u0A39\u0A48, \u0A1C\u0A4B \u0A2E\u0A41\u0A71\u0A22 \u0A30\u0A15\u0A2E \u0A26\u0A3E {percentageRate}% \u0A39\u0A48\u0964 \u0A2E\u0A41\u0A71\u0A22 \u0A30\u0A15\u0A2E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1809": {
        template: "{value} \u0A16\u0A30\u0A3E\u0A2C \u0A35\u0A38\u0A24\u0A42\u0A06\u0A02 \u0A30\u0A4B\u0A1C\u0A3C\u0A3E\u0A28\u0A3E \u0A09\u0A24\u0A2A\u0A3E\u0A26\u0A28 \u0A2C\u0A48\u0A1A \u0A26\u0A3E {percentageRate}% \u0A39\u0A28\u0964 \u0A2C\u0A48\u0A1A \u0A26\u0A3E \u0A15\u0A41\u0A71\u0A32 \u0A06\u0A15\u0A3E\u0A30 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-1909": {
        template: "\u0A1C\u0A47 \u0A15\u0A3F\u0A38\u0A47 \u0A1A\u0A4B\u0A23 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A08\u0A06\u0A02 \u0A15\u0A41\u0A71\u0A32 \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A26\u0A3E {percentageRate}% = {value} \u0A38\u0A40, \u0A24\u0A3E\u0A02 \u0A15\u0A41\u0A71\u0A32 \u0A2A\u0A08\u0A06\u0A02 \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      }
    }
  },
  "PCT-CP-002": {
    families: {
      "PCT-QL-010": {
        template: "\u0A1C\u0A47\u0A15\u0A30 {baseValue} \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A35\u0A3E\u0A27\u0A3E \u0A15\u0A40\u0A24\u0A3E \u0A1C\u0A3E\u0A35\u0A47, \u0A24\u0A3E\u0A02 \u0A28\u0A35\u0A3E\u0A02 \u0A2E\u0A41\u0A71\u0A32 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-011": {
        template: "\u0A1C\u0A47\u0A15\u0A30 {baseValue} \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A26\u0A40 \u0A15\u0A2E\u0A40 \u0A15\u0A40\u0A24\u0A40 \u0A1C\u0A3E\u0A35\u0A47, \u0A24\u0A3E\u0A02 \u0A28\u0A35\u0A3E\u0A02 \u0A2E\u0A41\u0A71\u0A32 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-012": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A35\u0A3F\u0A71\u0A1A \u0A09\u0A38\u0A26\u0A3E {percentageRate}% \u0A1C\u0A4B\u0A5C\u0A28 \u0A24\u0A47 {finalValue} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-013": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A35\u0A3F\u0A1A\u0A4B\u0A02 \u0A09\u0A38\u0A26\u0A3E {percentageRate}% \u0A18\u0A1F\u0A3E\u0A09\u0A23 \u0A24\u0A47 {finalValue} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-014": {
        template: "{percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A07\u0A71\u0A15 \u0A38\u0A70\u0A16\u0A3F\u0A06 {finalValue} \u0A39\u0A4B \u0A1C\u0A3E\u0A02\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A2A\u0A41\u0A30\u0A3E\u0A23\u0A40 \u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A15\u0A40 \u0A38\u0A40?",
        difficulty: "Medium"
      },
      "PCT-QL-015": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A3F\u0A05\u0A15\u0A24\u0A40 \u0A26\u0A40 \u0A24\u0A28\u0A16\u0A3E\u0A39 {percentageRate}% \u0A35\u0A71\u0A27 \u0A15\u0A47 Rs. {finalValue} \u0A39\u0A4B \u0A17\u0A08\u0964 \u0A2A\u0A41\u0A30\u0A3E\u0A23\u0A40 \u0A24\u0A28\u0A16\u0A3E\u0A39 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-016": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A35\u0A3F\u0A71\u0A1A {value} \u0A1C\u0A4B\u0A5C\u0A28\u0A3E, \u0A09\u0A38 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48\u0964 \u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-017": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A26\u0A3E {rate1}% = {value1} \u0A39\u0A48\u0964 \u0A09\u0A38\u0A47 \u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A26\u0A3E {rate2}% \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E?",
        difficulty: "Easy"
      },
      "PCT-QL-018": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A26\u0A47 {rate1}% \u0A05\u0A24\u0A47 {rate2}% \u0A26\u0A3E \u0A2B\u0A30\u0A15 {value} \u0A39\u0A48\u0964 \u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-019": {
        template: "{percentageRate}% \u0A15\u0A2E\u0A40 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A2A\u0A41\u0A30\u0A3E\u0A23\u0A47 \u0A2E\u0A41\u0A71\u0A32 \u0A24\u0A47 \u0A32\u0A3F\u0A06\u0A09\u0A23 \u0A32\u0A08 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A15\u0A30\u0A28\u0A3E \u0A2A\u0A35\u0A47\u0A17\u0A3E?",
        difficulty: "Hard"
      },
      "PCT-QL-110": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A1F\u0A3E\u0A15 \u0A30\u0A1C\u0A3F\u0A38\u0A1F\u0A30 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A07\u0A15\u0A3E\u0A08\u0A06\u0A02 {percentageRate}% \u0A38\u0A4B\u0A27 \u0A24\u0A4B\u0A02 \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A26\u0A30\u0A1C \u0A39\u0A28\u0964 \u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A38\u0A4B\u0A27\u0A40 \u0A39\u0A4B\u0A08 \u0A38\u0A1F\u0A3E\u0A15 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-210": {
        template: "\u0A07\u0A71\u0A15 \u0A2E\u0A41\u0A71\u0A32 {baseValue} \u0A24\u0A4B\u0A02 \u0A38\u0A3C\u0A41\u0A30\u0A42 \u0A39\u0A41\u0A70\u0A26\u0A3E \u0A39\u0A48 \u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A26\u0A3E \u0A35\u0A3E\u0A27\u0A3E \u0A15\u0A40\u0A24\u0A3E \u0A1C\u0A3E\u0A02\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A38\u0A4B\u0A27\u0A3F\u0A06 \u0A39\u0A4B\u0A07\u0A06 \u0A2E\u0A41\u0A71\u0A32 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-310": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A3F\u0A2D\u0A3E\u0A17 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A2E\u0A28\u0A1C\u0A3C\u0A42\u0A30\u0A38\u0A3C\u0A41\u0A26\u0A3E \u0A05\u0A38\u0A3E\u0A2E\u0A40\u0A06\u0A02 \u0A38\u0A28\u0964 {percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A05\u0A38\u0A3E\u0A2E\u0A40\u0A06\u0A02 \u0A26\u0A40 \u0A38\u0A4B\u0A27\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-410": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A15\u0A42\u0A32 \u0A15\u0A32\u0A71\u0A2C \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A2E\u0A48\u0A02\u0A2C\u0A30 \u0A38\u0A28\u0964 {percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A38\u0A4B\u0A27\u0A40 \u0A2E\u0A48\u0A02\u0A2C\u0A30 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-111": {
        template: "\u0A07\u0A71\u0A15 \u0A30\u0A1C\u0A3F\u0A38\u0A1F\u0A30 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A26\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 {percentageRate}% \u0A15\u0A2E\u0A40 \u0A24\u0A4B\u0A02 \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A26\u0A30\u0A1C \u0A39\u0A48\u0964 \u0A38\u0A4B\u0A27\u0A40 \u0A39\u0A4B\u0A08 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-211": {
        template: "\u0A35\u0A30\u0A16\u0A3E \u0A26\u0A47 \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A3F\u0A1B\u0A32\u0A47 \u0A38\u0A3E\u0A32 {baseValue} \u0A2E\u0A3F\u0A2E\u0A40 \u0A35\u0A30\u0A16\u0A3E \u0A26\u0A30\u0A1C \u0A38\u0A40\u0964 \u0A07\u0A38 \u0A38\u0A3E\u0A32 \u0A07\u0A39 {percentageRate}% \u0A18\u0A71\u0A1F \u0A17\u0A08\u0964 \u0A07\u0A38 \u0A38\u0A3E\u0A32 \u0A26\u0A40 \u0A35\u0A30\u0A16\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-311": {
        template: "\u0A07\u0A71\u0A15 \u0A2C\u0A71\u0A38 \u0A21\u0A3F\u0A2A\u0A4B \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A38\u0A30\u0A17\u0A30\u0A2E \u0A2A\u0A3E\u0A38 \u0A26\u0A30\u0A1C \u0A38\u0A28\u0964 {percentageRate}% \u0A18\u0A1F\u0A3E\u0A13 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A38\u0A4B\u0A27\u0A40 \u0A2A\u0A3E\u0A38 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-411": {
        template: "\u0A07\u0A71\u0A15 \u0A32\u0A3E\u0A07\u0A2C\u0A4D\u0A30\u0A47\u0A30\u0A40 \u0A35\u0A3F\u0A71\u0A1A {baseValue} \u0A38\u0A30\u0A17\u0A30\u0A2E \u0A15\u0A3E\u0A30\u0A21 \u0A26\u0A30\u0A1C \u0A38\u0A28\u0964 {percentageRate}% \u0A18\u0A1F\u0A3E\u0A13 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A38\u0A30\u0A17\u0A30\u0A2E \u0A15\u0A3E\u0A30\u0A21\u0A3E\u0A02 \u0A26\u0A40 \u0A38\u0A4B\u0A27\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-112": {
        template: "\u0A2A\u0A39\u0A3F\u0A32\u0A40 \u0A30\u0A15\u0A2E \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A1C\u0A4B\u0A5C\u0A28 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A38\u0A4B\u0A27\u0A3F\u0A06 \u0A2C\u0A3F\u0A71\u0A32 {finalValue} \u0A39\u0A4B \u0A1C\u0A3E\u0A02\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A40 \u0A30\u0A15\u0A2E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-212": {
        template: "\u0A07\u0A71\u0A15 \u0A26\u0A41\u0A15\u0A3E\u0A28 \u0A26\u0A3E \u0A2C\u0A3F\u0A71\u0A32 {percentageRate}% \u0A05\u0A27\u0A3F\u0A2D\u0A3E\u0A30 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 {finalValue} \u0A39\u0A4B \u0A17\u0A3F\u0A06\u0964 \u0A05\u0A27\u0A3F\u0A2D\u0A3E\u0A30 \u0A24\u0A4B\u0A02 \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A26\u0A3E \u0A2C\u0A3F\u0A71\u0A32 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-312": {
        template: "\u0A07\u0A71\u0A15 \u0A2C\u0A3F\u0A1C\u0A32\u0A40 \u0A2C\u0A3F\u0A71\u0A32 {percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 {finalValue} \u0A39\u0A4B \u0A17\u0A3F\u0A06\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A26\u0A3E \u0A2C\u0A3F\u0A71\u0A32 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-412": {
        template: "\u0A07\u0A71\u0A15 \u0A32\u0A3E\u0A07\u0A2C\u0A4D\u0A30\u0A47\u0A30\u0A40 \u0A26\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 {percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 {finalValue} \u0A39\u0A4B \u0A17\u0A08\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-113": {
        template: "{percentageRate}% \u0A18\u0A1F\u0A3E\u0A13 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A38\u0A4B\u0A27\u0A3F\u0A06 \u0A05\u0A28\u0A41\u0A26\u0A3E\u0A28 {finalValue} \u0A30\u0A39\u0A3F \u0A1C\u0A3E\u0A02\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A26\u0A3E \u0A05\u0A28\u0A41\u0A26\u0A3E\u0A28 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-213": {
        template: "{percentageRate}% \u0A18\u0A1F\u0A3E\u0A13 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A38\u0A1F\u0A3E\u0A15 \u0A2C\u0A15\u0A3E\u0A07\u0A06 {finalValue} \u0A30\u0A39\u0A3F \u0A1C\u0A3E\u0A02\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A26\u0A3E \u0A2C\u0A15\u0A3E\u0A07\u0A06 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-313": {
        template: "{percentageRate}% \u0A18\u0A1F\u0A3E\u0A13 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A2A\u0A3E\u0A23\u0A40-\u0A38\u0A2A\u0A32\u0A3E\u0A08 \u0A26\u0A40 \u0A30\u0A40\u0A21\u0A3F\u0A70\u0A17 {finalValue} \u0A30\u0A39\u0A3F \u0A1C\u0A3E\u0A02\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A26\u0A40 \u0A30\u0A40\u0A21\u0A3F\u0A70\u0A17 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-413": {
        template: "{percentageRate}% \u0A18\u0A1F\u0A3E\u0A13 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A2F\u0A3E\u0A24\u0A30\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 {finalValue} \u0A30\u0A39\u0A3F \u0A1C\u0A3E\u0A02\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A26\u0A40 \u0A2F\u0A3E\u0A24\u0A30\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-114": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A4B\u0A27 \u0A28\u0A4B\u0A1F \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A2E\u0A41\u0A71\u0A32 {finalValue} \u0A26\u0A30\u0A1C \u0A39\u0A48\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-214": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A1F\u0A3E\u0A15 \u0A30\u0A1C\u0A3F\u0A38\u0A1F\u0A30 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 {finalValue} \u0A07\u0A15\u0A3E\u0A08\u0A06\u0A02 \u0A26\u0A30\u0A1C \u0A39\u0A28\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A26\u0A3E \u0A38\u0A1F\u0A3E\u0A15 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-314": {
        template: "\u0A07\u0A71\u0A15 \u0A32\u0A3E\u0A07\u0A2C\u0A4D\u0A30\u0A47\u0A30\u0A40 \u0A30\u0A1C\u0A3F\u0A38\u0A1F\u0A30 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A10\u0A02\u0A1F\u0A30\u0A40\u0A06\u0A02 \u0A26\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 {finalValue} \u0A39\u0A4B \u0A17\u0A08\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-414": {
        template: "{percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A2A\u0A3E\u0A38\u0A3E\u0A02 \u0A26\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 {finalValue} \u0A39\u0A4B \u0A1C\u0A3E\u0A02\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-115": {
        template: "\u0A07\u0A71\u0A15 \u0A24\u0A28\u0A16\u0A3C\u0A3E\u0A39-\u0A38\u0A4B\u0A27 \u0A2E\u0A48\u0A2E\u0A4B \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A38\u0A4B\u0A27\u0A40 \u0A24\u0A28\u0A16\u0A3C\u0A3E\u0A39 Rs. {finalValue} \u0A26\u0A3F\u0A16\u0A3E\u0A08 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A26\u0A40 \u0A24\u0A28\u0A16\u0A3C\u0A3E\u0A39 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-215": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A47\u0A24\u0A28-\u0A2A\u0A71\u0A24\u0A30 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A24\u0A28\u0A16\u0A3C\u0A3E\u0A39 Rs. {finalValue} \u0A26\u0A3F\u0A16\u0A3E\u0A08 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A26\u0A40 \u0A24\u0A28\u0A16\u0A3C\u0A3E\u0A39 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-315": {
        template: "\u0A07\u0A71\u0A15 \u0A15\u0A30\u0A2E\u0A1A\u0A3E\u0A30\u0A40 \u0A38\u0A4B\u0A27-\u0A38\u0A42\u0A1A\u0A40 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A28\u0A35\u0A40\u0A02 \u0A24\u0A28\u0A16\u0A3C\u0A3E\u0A39 Rs. {finalValue} \u0A26\u0A3F\u0A71\u0A24\u0A40 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A26\u0A40 \u0A24\u0A28\u0A16\u0A3C\u0A3E\u0A39 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-415": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A47\u0A24\u0A28 \u0A30\u0A1C\u0A3F\u0A38\u0A1F\u0A30 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A24\u0A28\u0A16\u0A3C\u0A3E\u0A39 Rs. {finalValue} \u0A26\u0A30\u0A1C \u0A39\u0A48\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A26\u0A40 \u0A24\u0A28\u0A16\u0A3C\u0A3E\u0A39 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-116": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A1F\u0A3E\u0A15 \u0A10\u0A02\u0A1F\u0A30\u0A40 \u0A15\u0A39\u0A3F\u0A70\u0A26\u0A40 \u0A39\u0A48 \u0A15\u0A3F {value} \u0A07\u0A15\u0A3E\u0A08\u0A06\u0A02 \u0A1C\u0A4B\u0A5C\u0A28\u0A3E {percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48\u0964 \u0A38\u0A3C\u0A41\u0A30\u0A42\u0A06\u0A24\u0A40 \u0A38\u0A1F\u0A3E\u0A15 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-216": {
        template: "{value} \u0A26\u0A40 \u0A35\u0A3E\u0A27\u0A42 \u0A2B\u0A40\u0A38 \u0A06\u0A27\u0A3E\u0A30 \u0A30\u0A15\u0A2E \u0A26\u0A47 {percentageRate}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48\u0964 \u0A06\u0A27\u0A3E\u0A30 \u0A30\u0A15\u0A2E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-316": {
        template: "{value} \u0A07\u0A15\u0A3E\u0A08\u0A06\u0A02 \u0A26\u0A3E \u0A35\u0A3E\u0A27\u0A3E \u0A38\u0A3C\u0A41\u0A30\u0A42\u0A06\u0A24\u0A40 \u0A38\u0A1F\u0A3E\u0A15 \u0A26\u0A47 {percentageRate}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48\u0964 \u0A38\u0A3C\u0A41\u0A30\u0A42\u0A06\u0A24\u0A40 \u0A38\u0A1F\u0A3E\u0A15 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-416": {
        template: "{value} \u0A26\u0A3E \u0A05\u0A27\u0A3F\u0A2D\u0A3E\u0A30 \u0A2E\u0A42\u0A32 \u0A2C\u0A3F\u0A71\u0A32 \u0A26\u0A47 {percentageRate}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48\u0964 \u0A2E\u0A42\u0A32 \u0A2C\u0A3F\u0A71\u0A32 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-117": {
        template: "\u0A07\u0A71\u0A15 \u0A05\u0A70\u0A15-\u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A41\u0A71\u0A32 \u0A05\u0A70\u0A15\u0A3E\u0A02 \u0A26\u0A3E {rate1}% = {value1} \u0A26\u0A3F\u0A71\u0A24\u0A3E \u0A39\u0A48\u0964 \u0A09\u0A38\u0A47 \u0A15\u0A41\u0A71\u0A32 \u0A26\u0A47 {rate2}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A05\u0A70\u0A15 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-217": {
        template: "\u0A07\u0A71\u0A15 \u0A2C\u0A1C\u0A1F-\u0A38\u0A3C\u0A40\u0A1F \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A41\u0A71\u0A32 \u0A2B\u0A70\u0A21 \u0A26\u0A3E {rate1}% = {value1} \u0A26\u0A3F\u0A71\u0A24\u0A3E \u0A39\u0A48\u0964 \u0A09\u0A38\u0A47 \u0A2B\u0A70\u0A21 \u0A26\u0A47 {rate2}% \u0A26\u0A40 \u0A30\u0A15\u0A2E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-317": {
        template: "\u0A07\u0A71\u0A15 \u0A05\u0A70\u0A15 \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A41\u0A71\u0A32 \u0A05\u0A70\u0A15\u0A3E\u0A02 \u0A26\u0A3E {rate1}% = {value1} \u0A26\u0A3F\u0A71\u0A24\u0A3E \u0A39\u0A48\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A26\u0A47 {rate2}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A05\u0A70\u0A15 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-417": {
        template: "\u0A07\u0A71\u0A15 \u0A09\u0A24\u0A2A\u0A3E\u0A26\u0A28 \u0A30\u0A3F\u0A2A\u0A4B\u0A30\u0A1F \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A41\u0A71\u0A32 \u0A09\u0A24\u0A2A\u0A3E\u0A26\u0A28 \u0A26\u0A3E {rate1}% = {value1} \u0A26\u0A3F\u0A71\u0A24\u0A3E \u0A39\u0A48\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A26\u0A47 {rate2}% \u0A26\u0A47 \u0A05\u0A28\u0A41\u0A38\u0A3E\u0A30 \u0A09\u0A24\u0A2A\u0A3E\u0A26\u0A28 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-118": {
        template: "\u0A07\u0A71\u0A15 \u0A05\u0A28\u0A41\u0A26\u0A3E\u0A28-\u0A2A\u0A71\u0A24\u0A30 \u0A35\u0A3F\u0A71\u0A1A {rate1}% \u0A05\u0A24\u0A47 {rate2}% \u0A39\u0A3F\u0A71\u0A38\u0A3F\u0A06\u0A02 \u0A26\u0A3E \u0A2B\u0A30\u0A15 {value} \u0A39\u0A48\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A05\u0A28\u0A41\u0A26\u0A3E\u0A28 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-218": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A4B\u0A1F \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 \u0A35\u0A3F\u0A71\u0A1A {rate1}% \u0A05\u0A24\u0A47 {rate2}% \u0A39\u0A3F\u0A71\u0A38\u0A3F\u0A06\u0A02 \u0A26\u0A3E \u0A2B\u0A30\u0A15 {value} \u0A39\u0A48\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-318": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A1F\u0A3E\u0A15-\u0A38\u0A3C\u0A40\u0A1F \u0A35\u0A3F\u0A71\u0A1A {rate1}% \u0A05\u0A24\u0A47 {rate2}% \u0A39\u0A3F\u0A71\u0A38\u0A3F\u0A06\u0A02 \u0A26\u0A3E \u0A2B\u0A30\u0A15 {value} \u0A39\u0A48\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A38\u0A1F\u0A3E\u0A15 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-418": {
        template: "\u0A07\u0A71\u0A15 \u0A2C\u0A1C\u0A1F \u0A28\u0A4B\u0A1F \u0A35\u0A3F\u0A71\u0A1A {rate1}% \u0A05\u0A24\u0A47 {rate2}% \u0A35\u0A70\u0A21\u0A3E\u0A02 \u0A26\u0A3E \u0A2B\u0A30\u0A15 {value} \u0A39\u0A48\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A2C\u0A1C\u0A1F \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-119": {
        template: "\u0A07\u0A71\u0A15 \u0A2E\u0A41\u0A5C-\u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24\u0A40 \u0A28\u0A4B\u0A1F \u0A05\u0A28\u0A41\u0A38\u0A3E\u0A30 \u0A15\u0A4B\u0A08 \u0A2E\u0A41\u0A71\u0A32 {percentageRate}% \u0A18\u0A1F \u0A17\u0A3F\u0A06\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A47 \u0A2E\u0A41\u0A71\u0A32 '\u0A24\u0A47 \u0A35\u0A3E\u0A2A\u0A38 \u0A06\u0A09\u0A23 \u0A32\u0A08 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A47 \u0A26\u0A40 \u0A32\u0A4B\u0A5C \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-219": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A15\u0A40\u0A2E\u0A24 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A26\u0A40 \u0A15\u0A2E\u0A40 \u0A39\u0A4B\u0A08\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A40 \u0A15\u0A40\u0A2E\u0A24 '\u0A24\u0A47 \u0A35\u0A3E\u0A2A\u0A38 \u0A06\u0A09\u0A23 \u0A32\u0A08 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A47 \u0A26\u0A40 \u0A32\u0A4B\u0A5C \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-319": {
        template: "\u0A38\u0A1F\u0A3E\u0A15 \u0A17\u0A3F\u0A23\u0A24\u0A40 {percentageRate}% \u0A18\u0A1F \u0A17\u0A08\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A40 \u0A38\u0A1F\u0A3E\u0A15 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2E\u0A41\u0A5C \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24 \u0A15\u0A30\u0A28 \u0A32\u0A08 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A47 \u0A26\u0A40 \u0A32\u0A4B\u0A5C \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-419": {
        template: "\u0A2E\u0A24\u0A26\u0A3E\u0A28-\u0A39\u0A3E\u0A1C\u0A3C\u0A30\u0A40 \u0A26\u0A3E \u0A05\u0A70\u0A15\u0A5C\u0A3E {percentageRate}% \u0A18\u0A1F \u0A17\u0A3F\u0A06\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A40 \u0A39\u0A3E\u0A1C\u0A3C\u0A30\u0A40 '\u0A24\u0A47 \u0A35\u0A3E\u0A2A\u0A38 \u0A06\u0A09\u0A23 \u0A32\u0A08 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A47 \u0A26\u0A40 \u0A32\u0A4B\u0A5C \u0A39\u0A48?",
        difficulty: "Easy"
      }
    }
  },
  "PCT-CP-003": {
    families: {
      "PCT-QL-020": {
        template: "{rate1}% \u0A05\u0A24\u0A47 {rate2}% \u0A26\u0A47 \u0A26\u0A4B \u0A32\u0A17\u0A3E\u0A24\u0A3E\u0A30 \u0A35\u0A3E\u0A27\u0A47 \u0A15\u0A3F\u0A38 \u0A07\u0A71\u0A15 \u0A35\u0A3E\u0A27\u0A47 \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A4B\u0A23\u0A17\u0A47?",
        difficulty: "Medium"
      },
      "PCT-QL-021": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A3C\u0A39\u0A3F\u0A30 \u0A26\u0A40 \u0A06\u0A2C\u0A3E\u0A26\u0A40 \u0A2A\u0A39\u0A3F\u0A32\u0A47 \u0A38\u0A3E\u0A32 {rate1}% \u0A05\u0A24\u0A47 \u0A26\u0A42\u0A1C\u0A47 \u0A38\u0A3E\u0A32 {rate2}% \u0A35\u0A27\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-022": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A28\u0A42\u0A70 \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 {rate1}% \u0A35\u0A27\u0A3E\u0A07\u0A06 \u0A17\u0A3F\u0A06 \u0A05\u0A24\u0A47 \u0A2B\u0A3F\u0A30 {rate2}% \u0A18\u0A1F\u0A3E\u0A07\u0A06 \u0A17\u0A3F\u0A06\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2C\u0A26\u0A32\u0A3E\u0A05 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-023": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A1A\u0A40\u0A1C\u0A3C \u0A26\u0A3E \u0A30\u0A47\u0A1F \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 {rate1}% \u0A35\u0A27\u0A3F\u0A06 \u0A05\u0A24\u0A47 \u0A2B\u0A3F\u0A30 {rate2}% \u0A18\u0A1F\u0A3F\u0A06\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2C\u0A26\u0A32\u0A3E\u0A05 \u0A39\u0A4B\u0A07\u0A06?",
        difficulty: "Medium"
      },
      "PCT-QL-024": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A3C\u0A39\u0A3F\u0A30 \u0A26\u0A40 \u0A06\u0A2C\u0A3E\u0A26\u0A40 {initialValue} \u0A39\u0A48\u0964 \u0A07\u0A39 \u0A39\u0A30 \u0A38\u0A3E\u0A32 {percentageRate}% \u0A35\u0A27\u0A26\u0A40 \u0A39\u0A48\u0964 2 \u0A38\u0A3E\u0A32 \u0A2C\u0A3E\u0A05\u0A26 \u0A06\u0A2C\u0A3E\u0A26\u0A40 \u0A15\u0A3F\u0A70\u0A28\u0A40 \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A40?",
        difficulty: "Medium"
      },
      "PCT-QL-025": {
        template: "\u0A07\u0A71\u0A15 \u0A2E\u0A38\u0A3C\u0A40\u0A28 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 \u0A39\u0A30 \u0A38\u0A3E\u0A32 {percentageRate}% \u0A18\u0A1F\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A39\u0A41\u0A23 \u0A15\u0A40\u0A2E\u0A24 Rs. {initialValue} \u0A39\u0A48\u0964 2 \u0A38\u0A3E\u0A32 \u0A2C\u0A3E\u0A05\u0A26 \u0A15\u0A40\u0A2E\u0A24 \u0A15\u0A3F\u0A70\u0A28\u0A40 \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A40?",
        difficulty: "Medium"
      },
      "PCT-QL-026": {
        template: "\u0A07\u0A71\u0A15 \u0A06\u0A07\u0A24 \u0A26\u0A40 \u0A32\u0A70\u0A2C\u0A3E\u0A08 {rate1}% \u0A05\u0A24\u0A47 \u0A1A\u0A4C\u0A5C\u0A3E\u0A08 {rate2}% \u0A35\u0A27\u0A3E\u0A08 \u0A17\u0A08\u0964 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-027": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A30\u0A17 \u0A26\u0A40 \u0A2D\u0A41\u0A1C\u0A3E {percentageRate}% \u0A35\u0A27\u0A3E \u0A26\u0A3F\u0A71\u0A24\u0A40 \u0A1C\u0A3E\u0A35\u0A47, \u0A24\u0A3E\u0A02 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E?",
        difficulty: "Easy"
      },
      "PCT-QL-120": {
        template: "\u0A07\u0A71\u0A15 \u0A17\u0A4D\u0A30\u0A3E\u0A39\u0A15-\u0A38\u0A26\u0A71\u0A38 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A07\u0A71\u0A15 \u0A24\u0A3F\u0A2E\u0A3E\u0A39\u0A40 \u0A35\u0A3F\u0A71\u0A1A {rate1}% \u0A05\u0A24\u0A47 \u0A05\u0A17\u0A32\u0A40 \u0A24\u0A3F\u0A2E\u0A3E\u0A39\u0A40 \u0A35\u0A3F\u0A71\u0A1A {rate2}% \u0A35\u0A71\u0A27\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A07\u0A38 \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A07\u0A71\u0A15\u0A4B \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-220": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A3C\u0A3E\u0A16\u0A3E \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A07\u0A71\u0A15 \u0A38\u0A2E\u0A40\u0A16\u0A3F\u0A06 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 {rate1}% \u0A05\u0A24\u0A47 \u0A05\u0A17\u0A32\u0A40 \u0A38\u0A2E\u0A40\u0A16\u0A3F\u0A06 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 {rate2}% \u0A35\u0A27\u0A40\u0964 \u0A07\u0A38 \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A07\u0A71\u0A15\u0A4B \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-320": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A15\u0A42\u0A32\u0A40 \u0A26\u0A3E\u0A16\u0A32\u0A3E \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 \u0A07\u0A71\u0A15 \u0A1F\u0A30\u0A2E \u0A35\u0A3F\u0A71\u0A1A {rate1}% \u0A05\u0A24\u0A47 \u0A05\u0A17\u0A32\u0A40 \u0A1F\u0A30\u0A2E \u0A35\u0A3F\u0A71\u0A1A {rate2}% \u0A35\u0A27\u0A3F\u0A06\u0964 \u0A07\u0A38 \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A07\u0A71\u0A15\u0A4B \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-420": {
        template: "\u0A07\u0A71\u0A15 \u0A2F\u0A3E\u0A24\u0A30\u0A40 \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 \u0A35\u0A3F\u0A71\u0A1A \u0A07\u0A71\u0A15 \u0A2E\u0A39\u0A40\u0A28\u0A47 {rate1}% \u0A05\u0A24\u0A47 \u0A05\u0A17\u0A32\u0A47 \u0A2E\u0A39\u0A40\u0A28\u0A47 {rate2}% \u0A35\u0A3E\u0A27\u0A3E \u0A39\u0A4B\u0A07\u0A06\u0964 \u0A07\u0A38 \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A07\u0A71\u0A15\u0A4B \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-121": {
        template: "\u0A07\u0A71\u0A15 \u0A1C\u0A3C\u0A3F\u0A32\u0A4D\u0A39\u0A3E \u0A06\u0A2C\u0A3E\u0A26\u0A40 \u0A28\u0A4B\u0A1F \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A39\u0A3F\u0A32\u0A47 \u0A38\u0A3E\u0A32 {rate1}% \u0A05\u0A24\u0A47 \u0A26\u0A42\u0A1C\u0A47 \u0A38\u0A3E\u0A32 {rate2}% \u0A35\u0A3E\u0A27\u0A3E \u0A26\u0A30\u0A1C \u0A39\u0A48\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-221": {
        template: "\u0A07\u0A71\u0A15 \u0A1C\u0A3C\u0A3F\u0A32\u0A4D\u0A39\u0A3E \u0A38\u0A30\u0A35\u0A47\u0A16\u0A23 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A39\u0A3F\u0A32\u0A47 \u0A38\u0A3E\u0A32 \u0A18\u0A30\u0A3E\u0A02 \u0A26\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 {rate1}% \u0A05\u0A24\u0A47 \u0A26\u0A42\u0A1C\u0A47 \u0A38\u0A3E\u0A32 {rate2}% \u0A35\u0A27\u0A40\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-321": {
        template: "\u0A07\u0A71\u0A15 \u0A2A\u0A38\u0A3C\u0A42-\u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A39\u0A3F\u0A32\u0A47 \u0A38\u0A3E\u0A32 {rate1}% \u0A05\u0A24\u0A47 \u0A26\u0A42\u0A1C\u0A47 \u0A38\u0A3E\u0A32 {rate2}% \u0A35\u0A27\u0A40\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-421": {
        template: "\u0A07\u0A71\u0A15 \u0A32\u0A3E\u0A07\u0A2C\u0A4D\u0A30\u0A47\u0A30\u0A40 \u0A2E\u0A48\u0A02\u0A2C\u0A30\u0A38\u0A3C\u0A3F\u0A2A \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 \u0A07\u0A71\u0A15 \u0A38\u0A3E\u0A32 {rate1}% \u0A05\u0A24\u0A47 \u0A05\u0A17\u0A32\u0A47 \u0A38\u0A3E\u0A32 {rate2}% \u0A35\u0A27\u0A3F\u0A06\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-122": {
        template: "\u0A38\u0A4B\u0A27 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A1F\u0A3F\u0A15\u0A1F \u0A15\u0A40\u0A2E\u0A24 {rate1}% \u0A35\u0A27\u0A40 \u0A05\u0A24\u0A47 \u0A30\u0A3F\u0A06\u0A2F\u0A24 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 {rate2}% \u0A18\u0A71\u0A1F \u0A17\u0A08\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A2C\u0A26\u0A32\u0A3E\u0A05 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-222": {
        template: "\u0A05\u0A17\u0A3E\u0A0A\u0A02 \u0A2C\u0A41\u0A15\u0A3F\u0A70\u0A17 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A1F\u0A3F\u0A15\u0A1F \u0A17\u0A3F\u0A23\u0A24\u0A40 {rate1}% \u0A35\u0A27\u0A40 \u0A05\u0A24\u0A47 \u0A30\u0A71\u0A26\u0A17\u0A40 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 {rate2}% \u0A18\u0A71\u0A1F \u0A17\u0A08\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A2C\u0A26\u0A32\u0A3E\u0A05 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-322": {
        template: "\u0A28\u0A35\u0A40\u0A02 \u0A38\u0A2A\u0A32\u0A3E\u0A08 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A38\u0A1F\u0A3E\u0A15 \u0A30\u0A1C\u0A3F\u0A38\u0A1F\u0A30 {rate1}% \u0A35\u0A27\u0A3F\u0A06 \u0A05\u0A24\u0A47 \u0A35\u0A3F\u0A15\u0A30\u0A40 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 {rate2}% \u0A18\u0A71\u0A1F \u0A17\u0A3F\u0A06\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A2C\u0A26\u0A32\u0A3E\u0A05 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-422": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A48\u0A71\u0A2C\u0A38\u0A3E\u0A08\u0A1F \u0A1F\u0A4D\u0A30\u0A48\u0A2B\u0A3F\u0A15 \u0A28\u0A4B\u0A1F \u0A35\u0A3F\u0A71\u0A1A \u0A2E\u0A41\u0A39\u0A3F\u0A70\u0A2E \u0A26\u0A4C\u0A30\u0A3E\u0A28 {rate1}% \u0A35\u0A3E\u0A27\u0A3E \u0A05\u0A24\u0A47 \u0A09\u0A38 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 {rate2}% \u0A15\u0A2E\u0A40 \u0A39\u0A4B\u0A08\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A2C\u0A26\u0A32\u0A3E\u0A05 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-123": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A3F\u0A15\u0A30\u0A40 \u0A38\u0A42\u0A1A\u0A28\u0A3E \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A26\u0A30\u0A1C \u0A15\u0A40\u0A2E\u0A24 {rate1}% \u0A35\u0A27\u0A3E\u0A08 \u0A17\u0A08 \u0A05\u0A24\u0A47 \u0A2C\u0A3E\u0A05\u0A26 \u0A35\u0A3F\u0A71\u0A1A {rate2}% \u0A26\u0A40 \u0A15\u0A1F\u0A4C\u0A24\u0A40 \u0A26\u0A3F\u0A71\u0A24\u0A40 \u0A17\u0A08\u0964 \u0A15\u0A40\u0A2E\u0A24 \u0A35\u0A3F\u0A71\u0A1A \u0A38\u0A3C\u0A41\u0A71\u0A27 \u0A2C\u0A26\u0A32\u0A3E\u0A05 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-223": {
        template: "\u0A07\u0A71\u0A15 \u0A2C\u0A3F\u0A71\u0A32 \u0A38\u0A4B\u0A27 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A15\u0A40\u0A2E\u0A24 {rate1}% \u0A35\u0A27\u0A3E\u0A08 \u0A17\u0A08 \u0A05\u0A24\u0A47 \u0A2C\u0A3E\u0A05\u0A26 \u0A35\u0A3F\u0A71\u0A1A {rate2}% \u0A18\u0A1F\u0A3E\u0A08 \u0A17\u0A08\u0964 \u0A15\u0A40\u0A2E\u0A24 \u0A35\u0A3F\u0A71\u0A1A \u0A38\u0A3C\u0A41\u0A71\u0A27 \u0A2C\u0A26\u0A32\u0A3E\u0A05 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-323": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A3F\u0A15\u0A30\u0A40 \u0A2A\u0A30\u0A1A\u0A47 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A26\u0A30\u0A1C \u0A15\u0A40\u0A2E\u0A24 {rate1}% \u0A35\u0A27\u0A3E\u0A08 \u0A17\u0A08 \u0A05\u0A24\u0A47 \u0A2C\u0A3E\u0A05\u0A26 \u0A35\u0A3F\u0A71\u0A1A {rate2}% \u0A26\u0A40 \u0A30\u0A3F\u0A06\u0A2F\u0A24 \u0A26\u0A3F\u0A71\u0A24\u0A40 \u0A17\u0A08\u0964 \u0A15\u0A40\u0A2E\u0A24 \u0A35\u0A3F\u0A71\u0A1A \u0A38\u0A3C\u0A41\u0A71\u0A27 \u0A2C\u0A26\u0A32\u0A3E\u0A05 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-423": {
        template: "\u0A07\u0A71\u0A15 \u0A1F\u0A48\u0A15\u0A38 \u0A28\u0A4B\u0A1F \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A39\u0A3F\u0A32\u0A3E\u0A02 \u0A35\u0A38\u0A24\u0A42 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 {rate1}% \u0A35\u0A27\u0A40 \u0A05\u0A24\u0A47 \u0A2B\u0A3F\u0A30 {rate2}% \u0A18\u0A71\u0A1F\u0A40\u0964 \u0A15\u0A40\u0A2E\u0A24 \u0A35\u0A3F\u0A71\u0A1A \u0A38\u0A3C\u0A41\u0A71\u0A27 \u0A2C\u0A26\u0A32\u0A3E\u0A05 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-124": {
        template: "\u0A07\u0A71\u0A15 \u0A2A\u0A38\u0A3C\u0A42-\u0A17\u0A3F\u0A23\u0A24\u0A40 {initialValue} \u0A24\u0A4B\u0A02 \u0A38\u0A3C\u0A41\u0A30\u0A42 \u0A39\u0A41\u0A70\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A1C\u0A47 \u0A07\u0A39 \u0A39\u0A30 \u0A38\u0A3E\u0A32 {percentageRate}% \u0A26\u0A40 \u0A26\u0A30 \u0A28\u0A3E\u0A32 \u0A35\u0A27\u0A47, \u0A24\u0A3E\u0A02 2 \u0A38\u0A3E\u0A32 \u0A2C\u0A3E\u0A05\u0A26 \u0A07\u0A39 \u0A15\u0A3F\u0A70\u0A28\u0A40 \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A40?",
        difficulty: "Easy"
      },
      "PCT-QL-224": {
        template: "\u0A07\u0A71\u0A15 \u0A17\u0A4D\u0A30\u0A3E\u0A39\u0A15-\u0A38\u0A26\u0A71\u0A38 \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 {initialValue} \u0A24\u0A4B\u0A02 \u0A38\u0A3C\u0A41\u0A30\u0A42 \u0A39\u0A41\u0A70\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A1C\u0A47 \u0A07\u0A39 \u0A39\u0A30 \u0A38\u0A3E\u0A32 {percentageRate}% \u0A35\u0A27\u0A47, \u0A24\u0A3E\u0A02 2 \u0A38\u0A3E\u0A32 \u0A2C\u0A3E\u0A05\u0A26 \u0A07\u0A39 \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E?",
        difficulty: "Easy"
      },
      "PCT-QL-324": {
        template: "\u0A07\u0A71\u0A15 \u0A2C\u0A3F\u0A1C\u0A32\u0A40-\u0A35\u0A30\u0A24\u0A4B\u0A02 \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 {initialValue} \u0A24\u0A4B\u0A02 \u0A38\u0A3C\u0A41\u0A30\u0A42 \u0A39\u0A41\u0A70\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A1C\u0A47 \u0A07\u0A39 \u0A39\u0A30 \u0A38\u0A3E\u0A32 {percentageRate}% \u0A35\u0A27\u0A47, \u0A24\u0A3E\u0A02 2 \u0A38\u0A3E\u0A32 \u0A2C\u0A3E\u0A05\u0A26 \u0A07\u0A39 \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E?",
        difficulty: "Easy"
      },
      "PCT-QL-424": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A3E\u0A39\u0A28-\u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 {initialValue} \u0A24\u0A4B\u0A02 \u0A38\u0A3C\u0A41\u0A30\u0A42 \u0A39\u0A41\u0A70\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A1C\u0A47 \u0A07\u0A39 \u0A39\u0A30 \u0A38\u0A3E\u0A32 {percentageRate}% \u0A35\u0A27\u0A47, \u0A24\u0A3E\u0A02 2 \u0A38\u0A3E\u0A32 \u0A2C\u0A3E\u0A05\u0A26 \u0A07\u0A39 \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E?",
        difficulty: "Easy"
      },
      "PCT-QL-125": {
        template: "\u0A07\u0A71\u0A15 \u0A18\u0A1F\u0A3E\u0A13-\u0A2E\u0A41\u0A71\u0A32 \u0A30\u0A1C\u0A3F\u0A38\u0A1F\u0A30 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A3F\u0A38\u0A47 \u0A2E\u0A38\u0A3C\u0A40\u0A28 \u0A26\u0A40 \u0A2E\u0A4C\u0A1C\u0A42\u0A26\u0A3E \u0A15\u0A40\u0A2E\u0A24 Rs. {initialValue} \u0A39\u0A48\u0964 \u0A1C\u0A47 \u0A07\u0A38 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 \u0A39\u0A30 \u0A38\u0A3E\u0A32 {percentageRate}% \u0A18\u0A1F\u0A47, \u0A24\u0A3E\u0A02 2 \u0A38\u0A3E\u0A32 \u0A2C\u0A3E\u0A05\u0A26 \u0A07\u0A38 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-225": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A35\u0A3E\u0A39\u0A28 \u0A26\u0A40 \u0A2E\u0A4C\u0A1C\u0A42\u0A26\u0A3E \u0A15\u0A40\u0A2E\u0A24 Rs. {initialValue} \u0A39\u0A48\u0964 \u0A1C\u0A47 \u0A07\u0A38 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 \u0A39\u0A30 \u0A38\u0A3E\u0A32 {percentageRate}% \u0A18\u0A1F\u0A47, \u0A24\u0A3E\u0A02 2 \u0A38\u0A3E\u0A32 \u0A2C\u0A3E\u0A05\u0A26 \u0A07\u0A38 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-325": {
        template: "\u0A07\u0A71\u0A15 \u0A17\u0A4B\u0A26\u0A3E\u0A2E \u0A26\u0A40 \u0A38\u0A70\u0A2A\u0A24\u0A40 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 Rs. {initialValue} \u0A39\u0A48\u0964 \u0A1C\u0A47 \u0A07\u0A38 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 \u0A39\u0A30 \u0A38\u0A3E\u0A32 {percentageRate}% \u0A18\u0A1F\u0A47, \u0A24\u0A3E\u0A02 2 \u0A38\u0A3E\u0A32 \u0A2C\u0A3E\u0A05\u0A26 \u0A07\u0A38 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-425": {
        template: "\u0A07\u0A71\u0A15 \u0A2E\u0A38\u0A3C\u0A40\u0A28 \u0A2C\u0A40\u0A2E\u0A3E \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 \u0A35\u0A3F\u0A71\u0A1A \u0A2E\u0A4C\u0A1C\u0A42\u0A26\u0A3E \u0A15\u0A40\u0A2E\u0A24 Rs. {initialValue} \u0A26\u0A30\u0A1C \u0A39\u0A48\u0964 \u0A1C\u0A47 \u0A07\u0A39 \u0A39\u0A30 \u0A38\u0A3E\u0A32 {percentageRate}% \u0A18\u0A1F\u0A47, \u0A24\u0A3E\u0A02 2 \u0A38\u0A3E\u0A32 \u0A2C\u0A3E\u0A05\u0A26 \u0A07\u0A38 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-126": {
        template: "\u0A07\u0A71\u0A15 \u0A06\u0A2F\u0A3E\u0A24\u0A3E\u0A15\u0A3E\u0A30 \u0A2A\u0A32\u0A3E\u0A1F \u0A26\u0A47 \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A70\u0A2C\u0A3E\u0A08 \u0A05\u0A24\u0A47 \u0A1A\u0A4C\u0A5C\u0A3E\u0A08 \u0A28\u0A42\u0A70 \u0A15\u0A4D\u0A30\u0A2E\u0A35\u0A3E\u0A30 {rate1}% \u0A05\u0A24\u0A47 {rate2}% \u0A35\u0A27\u0A3E\u0A07\u0A06 \u0A17\u0A3F\u0A06 \u0A39\u0A48\u0964 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-226": {
        template: "\u0A07\u0A71\u0A15 \u0A16\u0A47\u0A24 \u0A26\u0A47 \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A70\u0A2C\u0A3E\u0A08 {rate1}% \u0A05\u0A24\u0A47 \u0A1A\u0A4C\u0A5C\u0A3E\u0A08 {rate2}% \u0A35\u0A27\u0A3E\u0A08 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-326": {
        template: "\u0A07\u0A71\u0A15 \u0A17\u0A4B\u0A26\u0A3E\u0A2E \u0A26\u0A47 \u0A2B\u0A30\u0A38\u0A3C \u0A26\u0A40 \u0A2F\u0A4B\u0A1C\u0A28\u0A3E \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A70\u0A2C\u0A3E\u0A08 {rate1}% \u0A05\u0A24\u0A47 \u0A1A\u0A4C\u0A5C\u0A3E\u0A08 {rate2}% \u0A35\u0A27\u0A3E\u0A08 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-426": {
        template: "\u0A07\u0A71\u0A15 \u0A16\u0A47\u0A21 \u0A2E\u0A48\u0A26\u0A3E\u0A28 \u0A26\u0A40 \u0A2F\u0A4B\u0A1C\u0A28\u0A3E \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A70\u0A2C\u0A3E\u0A08 {rate1}% \u0A05\u0A24\u0A47 \u0A1A\u0A4C\u0A5C\u0A3E\u0A08 {rate2}% \u0A35\u0A27\u0A3E\u0A08 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-127": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A30\u0A17\u0A3E\u0A15\u0A3E\u0A30 \u0A2A\u0A3E\u0A30\u0A15 \u0A26\u0A40 \u0A2D\u0A41\u0A71\u0A1C\u0A3E {percentageRate}% \u0A35\u0A27\u0A3E \u0A26\u0A3F\u0A71\u0A24\u0A40 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A07\u0A38 \u0A26\u0A47 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-227": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A30\u0A17\u0A3E\u0A15\u0A3E\u0A30 \u0A2C\u0A3E\u0A17\u0A3C \u0A26\u0A40 \u0A39\u0A30 \u0A2D\u0A41\u0A71\u0A1C\u0A3E {percentageRate}% \u0A35\u0A27\u0A3E \u0A26\u0A3F\u0A71\u0A24\u0A40 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A07\u0A38 \u0A26\u0A47 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-327": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A30\u0A17\u0A3E\u0A15\u0A3E\u0A30 \u0A1F\u0A3E\u0A07\u0A32 \u0A21\u0A3F\u0A1C\u0A3C\u0A3E\u0A07\u0A28 \u0A26\u0A40 \u0A39\u0A30 \u0A2D\u0A41\u0A71\u0A1C\u0A3E {percentageRate}% \u0A35\u0A27\u0A3E\u0A08 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A07\u0A38 \u0A26\u0A47 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-427": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A30\u0A17\u0A3E\u0A15\u0A3E\u0A30 \u0A2B\u0A30\u0A38\u0A3C \u0A2F\u0A4B\u0A1C\u0A28\u0A3E \u0A26\u0A40 \u0A2D\u0A41\u0A71\u0A1C\u0A3E {percentageRate}% \u0A35\u0A27\u0A3E \u0A26\u0A3F\u0A71\u0A24\u0A40 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A07\u0A38 \u0A26\u0A47 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3E\u0A27\u0A3E \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      }
    }
  },
  "PCT-CP-004": {
    families: {
      "PCT-QL-028": {
        template: "\u0A16\u0A70\u0A21 \u0A26\u0A3E \u0A30\u0A47\u0A1F {percentageRate}% \u0A35\u0A27 \u0A1C\u0A3E\u0A35\u0A47, \u0A24\u0A3E\u0A02 \u0A16\u0A30\u0A1A\u0A3E \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A35\u0A30\u0A24\u0A4B\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A3E\u0A09\u0A23\u0A40 \u0A2A\u0A35\u0A47\u0A17\u0A40?",
        difficulty: "Medium"
      },
      "PCT-QL-029": {
        template: "\u0A2A\u0A48\u0A1F\u0A30\u0A4B\u0A32 \u0A26\u0A3E \u0A30\u0A47\u0A1F {percentageRate}% \u0A18\u0A1F \u0A17\u0A3F\u0A06\u0964 \u0A09\u0A39\u0A40 \u0A16\u0A30\u0A1A\u0A47 \u0A35\u0A3F\u0A71\u0A1A \u0A35\u0A30\u0A24\u0A4B\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A27\u0A3E\u0A08 \u0A1C\u0A3E \u0A38\u0A15\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Medium"
      },
      "PCT-QL-030": {
        template: "\u0A07\u0A71\u0A15 \u0A06\u0A07\u0A24 \u0A26\u0A40 \u0A32\u0A70\u0A2C\u0A3E\u0A08 {percentageRate}% \u0A35\u0A27\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A1A\u0A4C\u0A5C\u0A3E\u0A08 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A3E\u0A09\u0A23\u0A40 \u0A2A\u0A35\u0A47\u0A17\u0A40?",
        difficulty: "Medium"
      },
      "PCT-QL-031": {
        template: "\u0A15\u0A3E\u0A30 \u0A26\u0A40 \u0A30\u0A2B\u0A24\u0A3E\u0A30 {percentageRate}% \u0A35\u0A27 \u0A1C\u0A3E\u0A35\u0A47, \u0A24\u0A3E\u0A02 \u0A09\u0A39\u0A40 \u0A26\u0A42\u0A30\u0A40 \u0A32\u0A08 \u0A38\u0A2E\u0A3E\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A47\u0A17\u0A3E?",
        difficulty: "Hard"
      },
      "PCT-QL-032": {
        template: "\u0A15\u0A3F\u0A38\u0A47 \u0A1A\u0A40\u0A1C\u0A3C \u0A26\u0A3E \u0A30\u0A47\u0A1F {rate1}% \u0A35\u0A27\u0A3E\u0A07\u0A06 \u0A17\u0A3F\u0A06\u0964 \u0A2A\u0A41\u0A30\u0A3E\u0A23\u0A47 \u0A30\u0A47\u0A1F \u0A24\u0A47 \u0A32\u0A3F\u0A06\u0A09\u0A23 \u0A32\u0A08 \u0A28\u0A35\u0A3E\u0A02 \u0A30\u0A47\u0A1F \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A3E\u0A09\u0A23\u0A3E \u0A2A\u0A35\u0A47\u0A17\u0A3E?",
        difficulty: "Medium"
      },
      "PCT-QL-033": {
        template: "\u0A1F\u0A48\u0A15\u0A38 {rate1}% \u0A18\u0A1F\u0A26\u0A3E \u0A39\u0A48 \u0A05\u0A24\u0A47 \u0A35\u0A3F\u0A15\u0A30\u0A40 {rate2}% \u0A35\u0A27\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A15\u0A2E\u0A3E\u0A08 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2C\u0A26\u0A32\u0A3E\u0A05 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Hard"
      },
      "PCT-QL-034": {
        template: "\u0A2B\u0A48\u0A15\u0A1F\u0A30\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A70\u0A2E \u0A26\u0A47 \u0A18\u0A70\u0A1F\u0A47 {percentageRate}% \u0A35\u0A27 \u0A17\u0A0F\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A2C\u0A3F\u0A71\u0A32 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A18\u0A70\u0A1F\u0A47 \u0A26\u0A40 \u0A2E\u0A1C\u0A3C\u0A26\u0A42\u0A30\u0A40 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A3E\u0A09\u0A23\u0A40 \u0A2A\u0A35\u0A47\u0A17\u0A40?",
        difficulty: "Hard"
      },
      "PCT-QL-035": {
        template: "\u0A1A\u0A71\u0A15\u0A30 \u0A26\u0A3E \u0A05\u0A30\u0A27-\u0A35\u0A3F\u0A06\u0A38 {percentageRate}% \u0A18\u0A1F\u0A3E \u0A26\u0A3F\u0A71\u0A24\u0A3E \u0A1C\u0A3E\u0A35\u0A47, \u0A24\u0A3E\u0A02 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A15\u0A2E\u0A40 \u0A06\u0A35\u0A47\u0A17\u0A40?",
        difficulty: "Easy"
      },
      "PCT-QL-128": {
        template: "\u0A07\u0A71\u0A15 \u0A30\u0A3E\u0A36\u0A28 \u0A2C\u0A3F\u0A71\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A1A\u0A40\u0A28\u0A40 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 {percentageRate}% \u0A35\u0A27\u0A40 \u0A39\u0A4B\u0A08 \u0A26\u0A3F\u0A16\u0A3E\u0A08 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A16\u0A30\u0A1A \u0A07\u0A71\u0A15\u0A4B \u0A1C\u0A3F\u0A39\u0A3E \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A16\u0A2A\u0A24 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A3E\u0A09\u0A23\u0A40 \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-228": {
        template: "\u0A07\u0A71\u0A15 \u0A18\u0A30\u0A47\u0A32\u0A42 \u0A16\u0A30\u0A1A \u0A28\u0A4B\u0A1F \u0A35\u0A3F\u0A71\u0A1A \u0A1A\u0A40\u0A28\u0A40 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A35\u0A3E\u0A27\u0A3E \u0A26\u0A30\u0A1C \u0A39\u0A48\u0964 \u0A16\u0A30\u0A1A \u0A07\u0A71\u0A15\u0A4B \u0A1C\u0A3F\u0A39\u0A3E \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A2E\u0A3E\u0A24\u0A30\u0A3E \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A3E\u0A09\u0A23\u0A40 \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-328": {
        template: "\u0A07\u0A71\u0A15 \u0A30\u0A3E\u0A36\u0A28-\u0A15\u0A3E\u0A30\u0A21 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A1A\u0A40\u0A28\u0A40 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 {percentageRate}% \u0A35\u0A27\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A2C\u0A3F\u0A71\u0A32 \u0A05\u0A23\u0A2C\u0A26\u0A32\u0A3F\u0A06 \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A16\u0A30\u0A40\u0A26 \u0A2E\u0A3E\u0A24\u0A30\u0A3E \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A23\u0A40 \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-428": {
        template: "\u0A07\u0A71\u0A15 \u0A30\u0A38\u0A4B\u0A08 \u0A2C\u0A1C\u0A1F \u0A28\u0A4B\u0A1F \u0A35\u0A3F\u0A71\u0A1A \u0A1A\u0A40\u0A28\u0A40 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A35\u0A3E\u0A27\u0A3E \u0A26\u0A30\u0A1C \u0A39\u0A48\u0964 \u0A1A\u0A40\u0A28\u0A40 '\u0A24\u0A47 \u0A16\u0A30\u0A1A \u0A07\u0A71\u0A15\u0A4B \u0A1C\u0A3F\u0A39\u0A3E \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A16\u0A2A\u0A24 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A3E\u0A09\u0A23\u0A40 \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-129": {
        template: "\u0A07\u0A71\u0A15 \u0A07\u0A70\u0A27\u0A28 \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A48\u0A1F\u0A4D\u0A30\u0A4B\u0A32 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 {percentageRate}% \u0A18\u0A71\u0A1F\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A32\u0A3E\u0A17\u0A24 \u0A07\u0A71\u0A15\u0A4B \u0A1C\u0A3F\u0A39\u0A40 \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A16\u0A2A\u0A24 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A27\u0A3E\u0A08 \u0A1C\u0A3E \u0A38\u0A15\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-229": {
        template: "\u0A07\u0A71\u0A15 \u0A07\u0A70\u0A27\u0A28 \u0A2C\u0A1C\u0A1F \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A48\u0A1F\u0A4D\u0A30\u0A4B\u0A32 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 {percentageRate}% \u0A18\u0A71\u0A1F\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A07\u0A70\u0A27\u0A28 \u0A32\u0A3E\u0A17\u0A24 \u0A07\u0A71\u0A15\u0A4B \u0A1C\u0A3F\u0A39\u0A40 \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A35\u0A30\u0A24\u0A4B\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A27 \u0A38\u0A15\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-329": {
        template: "\u0A07\u0A71\u0A15 \u0A2F\u0A3E\u0A24\u0A30\u0A3E-\u0A2D\u0A71\u0A24\u0A3E \u0A28\u0A4B\u0A1F \u0A35\u0A3F\u0A71\u0A1A \u0A07\u0A70\u0A27\u0A28 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 {percentageRate}% \u0A18\u0A71\u0A1F\u0A40 \u0A39\u0A48\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A16\u0A30\u0A1A \u0A2C\u0A3F\u0A28\u0A3E \u0A2C\u0A26\u0A32\u0A47 \u0A07\u0A70\u0A27\u0A28 \u0A26\u0A40 \u0A2E\u0A3E\u0A24\u0A30\u0A3E \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A27 \u0A38\u0A15\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-429": {
        template: "\u0A07\u0A71\u0A15 \u0A2E\u0A3E\u0A30\u0A17-\u0A32\u0A3E\u0A17\u0A24 \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 \u0A35\u0A3F\u0A71\u0A1A \u0A07\u0A70\u0A27\u0A28 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 {percentageRate}% \u0A18\u0A71\u0A1F\u0A40 \u0A39\u0A48\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A32\u0A3E\u0A17\u0A24 \u0A07\u0A71\u0A15\u0A4B \u0A1C\u0A3F\u0A39\u0A40 \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A07\u0A70\u0A27\u0A28 \u0A26\u0A40 \u0A35\u0A30\u0A24\u0A4B\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A27 \u0A38\u0A15\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-130": {
        template: "\u0A07\u0A71\u0A15 \u0A06\u0A2F\u0A3E\u0A24\u0A3E\u0A15\u0A3E\u0A30 \u0A2F\u0A4B\u0A1C\u0A28\u0A3E \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A70\u0A2C\u0A3E\u0A08 {percentageRate}% \u0A35\u0A27\u0A3E \u0A26\u0A3F\u0A71\u0A24\u0A40 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A07\u0A71\u0A15\u0A4B \u0A1C\u0A3F\u0A39\u0A3E \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A1A\u0A4C\u0A5C\u0A3E\u0A08 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A3E\u0A09\u0A23\u0A40 \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-230": {
        template: "\u0A07\u0A71\u0A15 \u0A16\u0A47\u0A24 \u0A26\u0A40 \u0A2F\u0A4B\u0A1C\u0A28\u0A3E \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A70\u0A2C\u0A3E\u0A08 {percentageRate}% \u0A35\u0A27\u0A3E \u0A26\u0A3F\u0A71\u0A24\u0A40 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A07\u0A71\u0A15\u0A4B \u0A1C\u0A3F\u0A39\u0A3E \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A1A\u0A4C\u0A5C\u0A3E\u0A08 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A3E\u0A09\u0A23\u0A40 \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-330": {
        template: "\u0A07\u0A71\u0A15 \u0A17\u0A4B\u0A26\u0A3E\u0A2E \u0A2F\u0A4B\u0A1C\u0A28\u0A3E \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A70\u0A2C\u0A3E\u0A08 {percentageRate}% \u0A35\u0A27\u0A3E\u0A08 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A2B\u0A30\u0A38\u0A3C \u0A26\u0A3E \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A05\u0A23\u0A2C\u0A26\u0A32\u0A3F\u0A06 \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A1A\u0A4C\u0A5C\u0A3E\u0A08 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A23\u0A40 \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-430": {
        template: "\u0A07\u0A71\u0A15 \u0A16\u0A47\u0A21 \u0A2E\u0A48\u0A26\u0A3E\u0A28 \u0A26\u0A40 \u0A2F\u0A4B\u0A1C\u0A28\u0A3E \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A70\u0A2C\u0A3E\u0A08 {percentageRate}% \u0A35\u0A27\u0A3E\u0A08 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A07\u0A71\u0A15\u0A4B \u0A1C\u0A3F\u0A39\u0A3E \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A1A\u0A4C\u0A5C\u0A3E\u0A08 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A3E\u0A09\u0A23\u0A40 \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-131": {
        template: "\u0A07\u0A71\u0A15 \u0A2E\u0A3E\u0A30\u0A17-\u0A38\u0A42\u0A1A\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A07\u0A71\u0A15\u0A4B \u0A26\u0A42\u0A30\u0A40 \u0A32\u0A08 \u0A17\u0A24\u0A40 {percentageRate}% \u0A35\u0A27\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A2F\u0A3E\u0A24\u0A30\u0A3E \u0A38\u0A2E\u0A3E\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A47\u0A17\u0A3E?",
        difficulty: "Easy"
      },
      "PCT-QL-231": {
        template: "\u0A07\u0A71\u0A15 \u0A30\u0A47\u0A32-\u0A38\u0A42\u0A1A\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A07\u0A71\u0A15\u0A4B \u0A2E\u0A3E\u0A30\u0A17 \u0A32\u0A08 \u0A17\u0A24\u0A40 {percentageRate}% \u0A35\u0A27\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A2F\u0A3E\u0A24\u0A30\u0A3E \u0A38\u0A2E\u0A3E\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A47\u0A17\u0A3E?",
        difficulty: "Easy"
      },
      "PCT-QL-331": {
        template: "\u0A07\u0A71\u0A15 \u0A21\u0A3F\u0A32\u0A3F\u0A35\u0A30\u0A40 \u0A2E\u0A3E\u0A30\u0A17 \u0A28\u0A4B\u0A1F \u0A35\u0A3F\u0A71\u0A1A \u0A07\u0A71\u0A15\u0A4B \u0A26\u0A42\u0A30\u0A40 \u0A32\u0A08 \u0A17\u0A24\u0A40 {percentageRate}% \u0A35\u0A27\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A21\u0A3F\u0A32\u0A3F\u0A35\u0A30\u0A40 \u0A38\u0A2E\u0A3E\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A47\u0A17\u0A3E?",
        difficulty: "Easy"
      },
      "PCT-QL-431": {
        template: "\u0A07\u0A71\u0A15 \u0A2C\u0A71\u0A38 \u0A38\u0A2E\u0A3E\u0A02-\u0A38\u0A42\u0A1A\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A07\u0A71\u0A15\u0A4B \u0A2E\u0A3E\u0A30\u0A17 '\u0A24\u0A47 \u0A14\u0A38\u0A24 \u0A17\u0A24\u0A40 {percentageRate}% \u0A35\u0A27\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A2F\u0A3E\u0A24\u0A30\u0A3E \u0A38\u0A2E\u0A3E\u0A02 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A47\u0A17\u0A3E?",
        difficulty: "Easy"
      },
      "PCT-QL-132": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A4B\u0A27\u0A40 \u0A15\u0A40\u0A2E\u0A24 \u0A2E\u0A48\u0A2E\u0A4B \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A3F\u0A38\u0A47 \u0A35\u0A38\u0A24\u0A42 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 {rate1}% \u0A35\u0A27\u0A3E\u0A08 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A40 \u0A15\u0A40\u0A2E\u0A24 '\u0A24\u0A47 \u0A35\u0A3E\u0A2A\u0A38 \u0A06\u0A09\u0A23 \u0A32\u0A08 \u0A38\u0A4B\u0A27\u0A40 \u0A15\u0A40\u0A2E\u0A24 \u0A28\u0A42\u0A70 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A3E\u0A09\u0A23\u0A3E \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A3E \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-232": {
        template: "\u0A07\u0A71\u0A15 \u0A26\u0A41\u0A15\u0A3E\u0A28\u0A40 \u0A38\u0A42\u0A1A\u0A28\u0A3E \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A3F\u0A38\u0A47 \u0A35\u0A38\u0A24\u0A42 \u0A26\u0A40 \u0A15\u0A40\u0A2E\u0A24 {rate1}% \u0A35\u0A27\u0A3E\u0A08 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A40 \u0A15\u0A40\u0A2E\u0A24 '\u0A24\u0A47 \u0A35\u0A3E\u0A2A\u0A38 \u0A06\u0A09\u0A23 \u0A32\u0A08 \u0A38\u0A4B\u0A27\u0A40 \u0A15\u0A40\u0A2E\u0A24 \u0A28\u0A42\u0A70 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A3E\u0A09\u0A23\u0A3E \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A3E \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-332": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A3C\u0A41\u0A32\u0A15 \u0A2E\u0A48\u0A2E\u0A4B \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A40\u0A2E\u0A24 {rate1}% \u0A35\u0A27\u0A3E\u0A08 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A2A\u0A39\u0A3F\u0A32\u0A40 \u0A26\u0A30 '\u0A24\u0A47 \u0A35\u0A3E\u0A2A\u0A38 \u0A06\u0A09\u0A23 \u0A32\u0A08 \u0A07\u0A38 \u0A28\u0A42\u0A70 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A3E\u0A09\u0A23\u0A3E \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A3E \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-432": {
        template: "\u0A07\u0A71\u0A15 \u0A2B\u0A40\u0A38-\u0A38\u0A42\u0A1A\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A3F\u0A38\u0A47 \u0A38\u0A3C\u0A41\u0A32\u0A15 \u0A28\u0A42\u0A70 {rate1}% \u0A35\u0A27\u0A3E\u0A07\u0A06 \u0A17\u0A3F\u0A06 \u0A39\u0A48\u0964 \u0A2A\u0A41\u0A30\u0A3E\u0A23\u0A3E \u0A38\u0A3C\u0A41\u0A32\u0A15 \u0A2E\u0A41\u0A5C \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24 \u0A15\u0A30\u0A28 \u0A32\u0A08 \u0A28\u0A35\u0A40\u0A02 \u0A30\u0A15\u0A2E \u0A28\u0A42\u0A70 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A3E\u0A09\u0A23\u0A3E \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A3E \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-133": {
        template: "\u0A07\u0A71\u0A15 \u0A2B\u0A40\u0A38 \u0A2A\u0A30\u0A1A\u0A47 \u0A35\u0A3F\u0A71\u0A1A \u0A1F\u0A48\u0A15\u0A38 {rate1}% \u0A18\u0A1F\u0A3E\u0A07\u0A06 \u0A17\u0A3F\u0A06, \u0A1C\u0A26\u0A15\u0A3F \u0A35\u0A3F\u0A15\u0A30\u0A40 {rate2}% \u0A35\u0A27\u0A40\u0964 \u0A06\u0A2E\u0A26\u0A28 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A41\u0A71\u0A32 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2C\u0A26\u0A32\u0A3E\u0A05 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-233": {
        template: "\u0A07\u0A71\u0A15 \u0A1F\u0A3F\u0A15\u0A1F\u0A3F\u0A70\u0A17 \u0A38\u0A42\u0A1A\u0A28\u0A3E \u0A35\u0A3F\u0A71\u0A1A \u0A1F\u0A48\u0A15\u0A38 {rate1}% \u0A18\u0A1F\u0A3E\u0A07\u0A06 \u0A17\u0A3F\u0A06 \u0A05\u0A24\u0A47 \u0A35\u0A3F\u0A15\u0A30\u0A40 \u0A35\u0A3F\u0A71\u0A1A {rate2}% \u0A35\u0A3E\u0A27\u0A3E \u0A26\u0A30\u0A1C \u0A39\u0A4B\u0A07\u0A06\u0964 \u0A06\u0A2E\u0A26\u0A28 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A41\u0A71\u0A32 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2C\u0A26\u0A32\u0A3E\u0A05 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-333": {
        template: "\u0A07\u0A71\u0A15 \u0A2C\u0A3E\u0A1C\u0A3C\u0A3E\u0A30 \u0A30\u0A3F\u0A2A\u0A4B\u0A30\u0A1F \u0A35\u0A3F\u0A71\u0A1A \u0A1F\u0A48\u0A15\u0A38 {rate1}% \u0A18\u0A71\u0A1F\u0A3F\u0A06 \u0A05\u0A24\u0A47 \u0A35\u0A3F\u0A15\u0A30\u0A40 \u0A26\u0A40 \u0A2E\u0A3E\u0A24\u0A30\u0A3E {rate2}% \u0A35\u0A27\u0A40\u0964 \u0A06\u0A2E\u0A26\u0A28 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A41\u0A71\u0A32 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2C\u0A26\u0A32\u0A3E\u0A05 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-433": {
        template: "\u0A07\u0A71\u0A15 \u0A26\u0A41\u0A15\u0A3E\u0A28 \u0A06\u0A2E\u0A26\u0A28 \u0A28\u0A4B\u0A1F \u0A35\u0A3F\u0A71\u0A1A \u0A1F\u0A48\u0A15\u0A38 {rate1}% \u0A18\u0A1F\u0A3F\u0A06 \u0A1C\u0A26\u0A15\u0A3F \u0A35\u0A3F\u0A15\u0A30\u0A40 {rate2}% \u0A35\u0A27\u0A40\u0964 \u0A06\u0A2E\u0A26\u0A28 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A41\u0A71\u0A32 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A2C\u0A26\u0A32\u0A3E\u0A05 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-134": {
        template: "\u0A07\u0A71\u0A15 \u0A20\u0A47\u0A15\u0A47\u0A26\u0A3E\u0A30 \u0A2C\u0A3F\u0A71\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A70\u0A2E \u0A26\u0A47 \u0A18\u0A70\u0A1F\u0A47 {percentageRate}% \u0A35\u0A27\u0A47 \u0A39\u0A4B\u0A0F \u0A26\u0A3F\u0A16\u0A3E\u0A0F \u0A17\u0A0F \u0A39\u0A28\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A2C\u0A3F\u0A71\u0A32 \u0A07\u0A71\u0A15\u0A4B \u0A1C\u0A3F\u0A39\u0A3E \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A2A\u0A4D\u0A30\u0A24\u0A40 \u0A18\u0A70\u0A1F\u0A3E \u0A2E\u0A1C\u0A3C\u0A26\u0A42\u0A30\u0A40 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A3E\u0A09\u0A23\u0A40 \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-234": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A47\u0A24\u0A28-\u0A2A\u0A71\u0A24\u0A30 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A70\u0A2E \u0A26\u0A47 \u0A18\u0A70\u0A1F\u0A47 {percentageRate}% \u0A35\u0A27\u0A47 \u0A39\u0A4B\u0A0F \u0A26\u0A3F\u0A16\u0A3E\u0A0F \u0A17\u0A0F \u0A39\u0A28\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A2C\u0A3F\u0A71\u0A32 \u0A07\u0A71\u0A15\u0A4B \u0A1C\u0A3F\u0A39\u0A3E \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A2A\u0A4D\u0A30\u0A24\u0A40 \u0A18\u0A70\u0A1F\u0A3E \u0A2E\u0A1C\u0A3C\u0A26\u0A42\u0A30\u0A40 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A3E\u0A09\u0A23\u0A40 \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-334": {
        template: "\u0A07\u0A71\u0A15 \u0A2E\u0A1C\u0A3C\u0A26\u0A42\u0A30\u0A40 \u0A28\u0A4B\u0A1F \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A70\u0A2E \u0A26\u0A47 \u0A18\u0A70\u0A1F\u0A3F\u0A06\u0A02 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A35\u0A3E\u0A27\u0A3E \u0A26\u0A30\u0A1C \u0A39\u0A48\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A2D\u0A41\u0A17\u0A24\u0A3E\u0A28 \u0A05\u0A23\u0A2C\u0A26\u0A32\u0A3F\u0A06 \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A2A\u0A4D\u0A30\u0A24\u0A40 \u0A18\u0A70\u0A1F\u0A3E \u0A2E\u0A1C\u0A3C\u0A26\u0A42\u0A30\u0A40 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A23\u0A40 \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-434": {
        template: "\u0A07\u0A71\u0A15 \u0A20\u0A47\u0A15\u0A47\u0A26\u0A3E\u0A30 \u0A2C\u0A3F\u0A71\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A70\u0A2E \u0A26\u0A47 \u0A18\u0A70\u0A1F\u0A47 {percentageRate}% \u0A35\u0A27\u0A47 \u0A39\u0A28\u0964 \u0A2C\u0A3F\u0A71\u0A32 \u0A07\u0A71\u0A15\u0A4B \u0A1C\u0A3F\u0A39\u0A3E \u0A30\u0A71\u0A16\u0A23 \u0A32\u0A08 \u0A2A\u0A4D\u0A30\u0A24\u0A40 \u0A18\u0A70\u0A1F\u0A3E \u0A26\u0A30 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A18\u0A1F\u0A23\u0A40 \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A40 \u0A39\u0A48?",
        difficulty: "Easy"
      },
      "PCT-QL-135": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A30\u0A24\u0A41\u0A32\u0A3E\u0A15\u0A3E\u0A30 \u0A2C\u0A3E\u0A17\u0A3C \u0A26\u0A40 \u0A2F\u0A4B\u0A1C\u0A28\u0A3E \u0A35\u0A3F\u0A71\u0A1A \u0A24\u0A4D\u0A30\u0A3F\u0A1C\u0A3F\u0A06 {percentageRate}% \u0A18\u0A1F\u0A3E \u0A26\u0A3F\u0A71\u0A24\u0A40 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A07\u0A38 \u0A26\u0A47 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A15\u0A2E\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-235": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A30\u0A24\u0A41\u0A32\u0A3E\u0A15\u0A3E\u0A30 \u0A24\u0A32\u0A3E\u0A2C \u0A26\u0A40 \u0A2F\u0A4B\u0A1C\u0A28\u0A3E \u0A35\u0A3F\u0A71\u0A1A \u0A24\u0A4D\u0A30\u0A3F\u0A1C\u0A3F\u0A06 {percentageRate}% \u0A18\u0A1F\u0A3E \u0A26\u0A3F\u0A71\u0A24\u0A40 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A07\u0A38 \u0A26\u0A47 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A15\u0A2E\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-335": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A30\u0A24\u0A41\u0A32\u0A3E\u0A15\u0A3E\u0A30 \u0A2A\u0A3E\u0A30\u0A15 \u0A30\u0A3F\u0A15\u0A3E\u0A30\u0A21 \u0A35\u0A3F\u0A71\u0A1A \u0A24\u0A4D\u0A30\u0A3F\u0A1C\u0A3F\u0A06 {percentageRate}% \u0A18\u0A1F\u0A3E\u0A08 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A07\u0A38 \u0A26\u0A47 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A15\u0A2E\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-435": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A30\u0A24\u0A41\u0A32\u0A3E\u0A15\u0A3E\u0A30 \u0A2E\u0A48\u0A26\u0A3E\u0A28 \u0A26\u0A40 \u0A2F\u0A4B\u0A1C\u0A28\u0A3E \u0A35\u0A3F\u0A71\u0A1A \u0A24\u0A4D\u0A30\u0A3F\u0A1C\u0A3F\u0A06 {percentageRate}% \u0A18\u0A1F\u0A3E \u0A26\u0A3F\u0A71\u0A24\u0A40 \u0A17\u0A08 \u0A39\u0A48\u0964 \u0A07\u0A38 \u0A26\u0A47 \u0A16\u0A47\u0A24\u0A30\u0A2B\u0A32 \u0A35\u0A3F\u0A71\u0A1A \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A15\u0A2E\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      }
    }
  },
  "PCT-CP-005": {
    families: {
      "PCT-QL-036": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A3F\u0A05\u0A15\u0A24\u0A40 \u0A06\u0A2E\u0A26\u0A28 \u0A26\u0A3E {rate1}% \u0A16\u0A3E\u0A23 \u0A24\u0A47, {rate2}% \u0A15\u0A3F\u0A30\u0A3E\u0A0F \u0A24\u0A47 \u0A05\u0A24\u0A47 {rate3}% \u0A39\u0A4B\u0A30 \u0A16\u0A30\u0A1A\u0A3F\u0A06\u0A02 \u0A24\u0A47 \u0A32\u0A17\u0A3E\u0A09\u0A02\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A1C\u0A47 \u0A09\u0A39 Rs. {value} \u0A2C\u0A1A\u0A3E\u0A09\u0A02\u0A26\u0A3E \u0A39\u0A48, \u0A24\u0A3E\u0A02 \u0A15\u0A41\u0A71\u0A32 \u0A06\u0A2E\u0A26\u0A28 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-037": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A3F\u0A05\u0A15\u0A24\u0A40 \u0A24\u0A28\u0A16\u0A3E\u0A39 \u0A26\u0A3E {rate1}% \u0A16\u0A3E\u0A23 \u0A24\u0A47 \u0A05\u0A24\u0A47 \u0A2C\u0A1A\u0A40 \u0A30\u0A15\u0A2E \u0A26\u0A3E {rate2}% \u0A15\u0A3F\u0A30\u0A3E\u0A0F \u0A24\u0A47 \u0A16\u0A30\u0A1A\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A09\u0A38 \u0A15\u0A4B\u0A32 Rs. {value} \u0A2C\u0A1A\u0A26\u0A47 \u0A39\u0A28\u0964 \u0A24\u0A28\u0A16\u0A3E\u0A39 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Hard"
      },
      "PCT-QL-038": {
        template: "\u0A1A\u0A4B\u0A23 \u0A35\u0A3F\u0A71\u0A1A \u0A1C\u0A47\u0A24\u0A42 \u0A28\u0A42\u0A70 {percentageRate}% \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A2E\u0A3F\u0A32\u0A40\u0A06\u0A02 \u0A05\u0A24\u0A47 \u0A09\u0A39 {voteDifference} \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A1C\u0A3F\u0A71\u0A24\u0A3F\u0A06\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-039": {
        template: "\u0A07\u0A71\u0A15 \u0A1A\u0A4B\u0A23 \u0A35\u0A3F\u0A71\u0A1A {rate1}% \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A30\u0A71\u0A26 \u0A39\u0A4B\u0A08\u0A06\u0A02\u0964 \u0A1C\u0A47\u0A24\u0A42 \u0A28\u0A42\u0A70 \u0A38\u0A39\u0A40 \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A26\u0A3E {rate2}% \u0A2E\u0A3F\u0A32\u0A3F\u0A06 \u0A05\u0A24\u0A47 \u0A09\u0A39 {voteDifference} \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A1C\u0A3F\u0A71\u0A24\u0A3F\u0A06\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Hard"
      },
      "PCT-QL-040": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40 \u0A28\u0A42\u0A70 \u0A2A\u0A3E\u0A38 \u0A39\u0A4B\u0A23 \u0A32\u0A08 {passRate}% \u0A05\u0A70\u0A15 \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A47 \u0A39\u0A28\u0964 \u0A09\u0A38\u0A28\u0A42\u0A70 {marksObtained} \u0A05\u0A70\u0A15 \u0A2E\u0A3F\u0A32\u0A47 \u0A05\u0A24\u0A47 \u0A09\u0A39 {failMargin} \u0A05\u0A70\u0A15\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A2B\u0A47\u0A32 \u0A39\u0A4B\u0A07\u0A06\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A05\u0A70\u0A15 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-041": {
        template: "\u0A07\u0A71\u0A15 \u0A38\u0A15\u0A42\u0A32 \u0A35\u0A3F\u0A71\u0A1A {rate1}% \u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40 \u0A2E\u0A41\u0A70\u0A21\u0A47 \u0A39\u0A28\u0964 \u0A1C\u0A47 \u0A15\u0A41\u0A5C\u0A40\u0A06\u0A02 {value} \u0A39\u0A28, \u0A24\u0A3E\u0A02 \u0A15\u0A41\u0A71\u0A32 \u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A39\u0A28?",
        difficulty: "Easy"
      },
      "PCT-QL-042": {
        template: "{totalPopulation} \u0A32\u0A4B\u0A15\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 {percentageRate}% \u0A2E\u0A30\u0A26 \u0A39\u0A28\u0964 \u0A14\u0A30\u0A24\u0A3E\u0A02 \u0A26\u0A40 \u0A17\u0A3F\u0A23\u0A24\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Easy"
      },
      "PCT-QL-043": {
        template: "\u0A2A\u0A4D\u0A30\u0A40\u0A16\u0A3F\u0A06 \u0A35\u0A3F\u0A71\u0A1A A \u0A28\u0A42\u0A70 B \u0A28\u0A3E\u0A32\u0A4B\u0A02 {rate1}% \u0A35\u0A71\u0A27 \u0A05\u0A70\u0A15 \u0A2E\u0A3F\u0A32\u0A47\u0964 \u0A1C\u0A47 A \u0A28\u0A42\u0A70 {marks} \u0A05\u0A70\u0A15 \u0A2E\u0A3F\u0A32\u0A47, \u0A24\u0A3E\u0A02 B \u0A26\u0A47 \u0A05\u0A70\u0A15 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-044": {
        template: "\u0A07\u0A71\u0A15 \u0A2A\u0A3F\u0A70\u0A21 \u0A35\u0A3F\u0A71\u0A1A {rate1}% \u0A32\u0A4B\u0A15 \u0A2A\u0A5C\u0A4D\u0A39\u0A47-\u0A32\u0A3F\u0A16\u0A47 \u0A39\u0A28 \u0A05\u0A24\u0A47 {value} \u0A32\u0A4B\u0A15 \u0A05\u0A23\u0A2A\u0A5C\u0A4D\u0A39 \u0A39\u0A28\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A06\u0A2C\u0A3E\u0A26\u0A40 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-045": {
        template: "\u0A07\u0A71\u0A15 \u0A35\u0A3F\u0A05\u0A15\u0A24\u0A40 \u0A28\u0A47 \u0A06\u0A2A\u0A23\u0A40 \u0A30\u0A15\u0A2E \u0A26\u0A3E {rate1}% \u0A2A\u0A24\u0A28\u0A40 \u0A28\u0A42\u0A70, {rate2}% \u0A2A\u0A41\u0A71\u0A24\u0A30 \u0A28\u0A42\u0A70 \u0A05\u0A24\u0A47 \u0A2C\u0A3E\u0A15\u0A40 Rs. {value} \u0A27\u0A40 \u0A28\u0A42\u0A70 \u0A26\u0A3F\u0A71\u0A24\u0A47\u0964 \u0A38\u0A3C\u0A41\u0A30\u0A42 \u0A35\u0A3F\u0A71\u0A1A \u0A09\u0A38 \u0A15\u0A4B\u0A32 \u0A15\u0A3F\u0A70\u0A28\u0A40 \u0A30\u0A15\u0A2E \u0A38\u0A40?",
        difficulty: "Medium"
      },
      "PCT-QL-046": {
        template: "\u0A07\u0A71\u0A15 \u0A27\u0A3E\u0A24\u0A42 \u0A2E\u0A3F\u0A38\u0A3C\u0A30\u0A23 \u0A35\u0A3F\u0A71\u0A1A {rate1}% \u0A24\u0A3E\u0A02\u0A2C\u0A3E \u0A39\u0A48 \u0A05\u0A24\u0A47 \u0A2C\u0A3E\u0A15\u0A40 \u0A1C\u0A3C\u0A3F\u0A70\u0A15 \u0A39\u0A48\u0964 \u0A1C\u0A47 \u0A1C\u0A3C\u0A3F\u0A70\u0A15 {value} kg \u0A39\u0A48, \u0A24\u0A3E\u0A02 \u0A15\u0A41\u0A71\u0A32 \u0A2D\u0A3E\u0A30 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      },
      "PCT-QL-047": {
        template: "\u0A26\u0A4B \u0A09\u0A2E\u0A40\u0A26\u0A35\u0A3E\u0A30\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A\u0A4B\u0A02 \u0A07\u0A71\u0A15 \u0A28\u0A42\u0A70 {rate1}% \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A2E\u0A3F\u0A32\u0A40\u0A06\u0A02 \u0A05\u0A24\u0A47 \u0A09\u0A39 {voteDifference} \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A39\u0A3E\u0A30 \u0A17\u0A3F\u0A06\u0964 \u0A15\u0A41\u0A71\u0A32 \u0A35\u0A4B\u0A1F\u0A3E\u0A02 \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A4B\u0964",
        difficulty: "Medium"
      }
    }
  },
  "PCT-CP-006": {
    families: {
      "PCT-QL-048": {
        template: "{totalMixture} \u0A32\u0A40\u0A1F\u0A30 \u0A2E\u0A3F\u0A38\u0A3C\u0A30\u0A23 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A10\u0A38\u0A3F\u0A21 \u0A39\u0A48\u0964 \u0A07\u0A38\u0A28\u0A42\u0A70 {newRate}% \u0A10\u0A38\u0A3F\u0A21 \u0A2C\u0A23\u0A3E\u0A09\u0A23 \u0A32\u0A08 \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A2A\u0A3E\u0A23\u0A40 \u0A2E\u0A3F\u0A32\u0A3E\u0A09\u0A23\u0A3E \u0A2A\u0A35\u0A47\u0A17\u0A3E?",
        difficulty: "Hard"
      },
      "PCT-QL-049": {
        template: "{totalQuantity} kg \u0A24\u0A3E\u0A1C\u0A3C\u0A47 \u0A2B\u0A32\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A {waterRate}% \u0A2A\u0A3E\u0A23\u0A40 \u0A39\u0A48 \u0A05\u0A24\u0A47 \u0A38\u0A41\u0A71\u0A15\u0A47 \u0A2B\u0A32\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A {dryWaterRate}% \u0A2A\u0A3E\u0A23\u0A40 \u0A39\u0A48\u0964 \u0A15\u0A3F\u0A70\u0A28\u0A47 kg \u0A38\u0A41\u0A71\u0A15\u0A47 \u0A2B\u0A32 \u0A2E\u0A3F\u0A32\u0A23\u0A17\u0A47?",
        difficulty: "Hard"
      },
      "PCT-QL-050": {
        template: "{totalMixture} \u0A32\u0A40\u0A1F\u0A30 \u0A28\u0A2E\u0A15 \u0A26\u0A47 \u0A18\u0A4B\u0A32 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A28\u0A2E\u0A15 \u0A39\u0A48\u0964 \u0A07\u0A38\u0A28\u0A42\u0A70 {newRate}% \u0A18\u0A4B\u0A32 \u0A2C\u0A23\u0A3E\u0A09\u0A23 \u0A32\u0A08 \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A28\u0A2E\u0A15 \u0A2E\u0A3F\u0A32\u0A3E\u0A09\u0A23\u0A3E \u0A2A\u0A35\u0A47\u0A17\u0A3E?",
        difficulty: "Hard"
      },
      "PCT-QL-051": {
        template: "{totalMixture} \u0A32\u0A40\u0A1F\u0A30 \u0A26\u0A47 {percentageRate}% \u0A05\u0A32\u0A15\u0A4B\u0A39\u0A32 \u0A18\u0A4B\u0A32 \u0A35\u0A3F\u0A71\u0A1A {value} \u0A32\u0A40\u0A1F\u0A30 \u0A2A\u0A3E\u0A23\u0A40 \u0A2E\u0A3F\u0A32\u0A3E\u0A07\u0A06 \u0A17\u0A3F\u0A06\u0964 \u0A39\u0A41\u0A23 \u0A05\u0A32\u0A15\u0A4B\u0A39\u0A32 \u0A15\u0A3F\u0A70\u0A28\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E?",
        difficulty: "Hard"
      },
      "PCT-QL-052": {
        template: "\u0A24\u0A3E\u0A1C\u0A3C\u0A47 \u0A05\u0A70\u0A17\u0A42\u0A30\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A {rate1}% \u0A2A\u0A3E\u0A23\u0A40 \u0A05\u0A24\u0A47 \u0A38\u0A41\u0A71\u0A15\u0A47 \u0A05\u0A70\u0A17\u0A42\u0A30\u0A3E\u0A02 \u0A35\u0A3F\u0A71\u0A1A {rate2}% \u0A2A\u0A3E\u0A23\u0A40 \u0A39\u0A41\u0A70\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A38\u0A41\u0A71\u0A15\u0A47 \u0A05\u0A70\u0A17\u0A42\u0A30 {value} kg \u0A39\u0A28\u0964 \u0A24\u0A3E\u0A1C\u0A3C\u0A47 \u0A05\u0A70\u0A17\u0A42\u0A30\u0A3E\u0A02 \u0A26\u0A3E \u0A2D\u0A3E\u0A30 \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A38\u0A40?",
        difficulty: "Hard"
      },
      "PCT-QL-053": {
        template: "{totalMixture} mL \u0A26\u0A47 {percentageRate}% \u0A18\u0A4B\u0A32 \u0A28\u0A42\u0A70 {newRate}% \u0A2C\u0A23\u0A3E\u0A09\u0A23 \u0A32\u0A08 \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A38\u0A3C\u0A41\u0A71\u0A27 \u0A05\u0A32\u0A15\u0A4B\u0A39\u0A32 \u0A2E\u0A3F\u0A32\u0A3E\u0A09\u0A23\u0A3E \u0A2A\u0A35\u0A47\u0A17\u0A3E?",
        difficulty: "Hard"
      },
      "PCT-QL-054": {
        template: "\u0A07\u0A71\u0A15 \u0A18\u0A4B\u0A32 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A16\u0A70\u0A21 \u0A39\u0A48\u0964 {value} kg \u0A2A\u0A3E\u0A23\u0A40 \u0A09\u0A71\u0A21\u0A23 \u0A24\u0A47 \u0A16\u0A70\u0A21 {newRate}% \u0A39\u0A4B \u0A1C\u0A3E\u0A02\u0A26\u0A40 \u0A39\u0A48\u0964 \u0A38\u0A3C\u0A41\u0A30\u0A42 \u0A35\u0A3F\u0A71\u0A1A \u0A18\u0A4B\u0A32 \u0A26\u0A3E \u0A2D\u0A3E\u0A30 \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A38\u0A40?",
        difficulty: "Hard"
      },
      "PCT-QL-055": {
        template: "\u0A24\u0A3E\u0A02\u0A2C\u0A3E-\u0A1C\u0A3C\u0A3F\u0A70\u0A15 \u0A2E\u0A3F\u0A38\u0A3C\u0A30\u0A23 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A24\u0A3E\u0A02\u0A2C\u0A3E \u0A39\u0A48\u0964 {totalWeight} kg \u0A2E\u0A3F\u0A38\u0A3C\u0A30\u0A23 \u0A35\u0A3F\u0A71\u0A1A \u0A1C\u0A3C\u0A3F\u0A70\u0A15 \u0A15\u0A3F\u0A70\u0A28\u0A3E \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E?",
        difficulty: "Easy"
      }
    }
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/explanation.en.json
var explanation_en_default = {
  "PCT-CP-001": {
    explanationId: "PCT-ES-001",
    taskExplanations: {
      percentOf: {
        steps: [
          "We need {percentageRate}% of {baseValue}.",
          "{percentageRate}% means {percentageRate}/100.",
          "So, required value = {baseValue} x {percentageRate}/100 = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "We need {percentageRate}% of {baseValue}.",
            "{percentageRate}% means {percentageRate}/100.",
            "So, required value = {baseValue} x {percentageRate}/100 = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "We need {percentageRate}% of {baseValue}.",
            "{percentageRate}% means {percentageRate}/100.",
            "So, required value = {baseValue} x {percentageRate}/100 = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "We need {percentageRate}% of {baseValue}.",
            "Substitute the given numbers in the relation.",
            "{percentageRate}% means {percentageRate}/100.",
            "So, required value = {baseValue} x {percentageRate}/100 = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "We need {percentageRate}% of {baseValue}.",
            "{percentageRate}% means {percentageRate}/100.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "We need {percentageRate}% of {baseValue}.",
            "{percentageRate}% means {percentageRate}/100.",
            "Keep the base quantity clear while simplifying.",
            "So, required value = {baseValue} x {percentageRate}/100 = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      directRelation: {
        aliasOf: "percentOf"
      },
      reversePercent: {
        steps: [
          "{percentageRate}% of the number is {value}.",
          "So, 1% of the number = {value}/ {percentageRate}.",
          "Therefore, 100% of the number = {value} x 100 / {percentageRate} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "{percentageRate}% of the number is {value}.",
            "So, 1% of the number = {value}/ {percentageRate}.",
            "Therefore, 100% of the number = {value} x 100 / {percentageRate} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "{percentageRate}% of the number is {value}.",
            "So, 1% of the number = {value}/ {percentageRate}.",
            "Therefore, 100% of the number = {value} x 100 / {percentageRate} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "{percentageRate}% of the number is {value}.",
            "Substitute the given numbers in the relation.",
            "So, 1% of the number = {value}/ {percentageRate}.",
            "Therefore, 100% of the number = {value} x 100 / {percentageRate} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "{percentageRate}% of the number is {value}.",
            "So, 1% of the number = {value}/ {percentageRate}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "{percentageRate}% of the number is {value}.",
            "So, 1% of the number = {value}/ {percentageRate}.",
            "Keep the base quantity clear while simplifying.",
            "Therefore, 100% of the number = {value} x 100 / {percentageRate} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      moreToLess: {
        steps: [
          "Let the smaller value be 100.",
          "Then the larger value = 100 + {percentageRate} = {largerBase}.",
          "Less percentage from larger side = {percentageRate} x 100 / {largerBase} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Let the smaller value be 100.",
            "Then the larger value = 100 + {percentageRate} = {largerBase}.",
            "Less percentage from larger side = {percentageRate} x 100 / {largerBase} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Let the smaller value be 100.",
            "Then the larger value = 100 + {percentageRate} = {largerBase}.",
            "Less percentage from larger side = {percentageRate} x 100 / {largerBase} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Let the smaller value be 100.",
            "Substitute the given numbers in the relation.",
            "Then the larger value = 100 + {percentageRate} = {largerBase}.",
            "Less percentage from larger side = {percentageRate} x 100 / {largerBase} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Let the smaller value be 100.",
            "Then the larger value = 100 + {percentageRate} = {largerBase}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Let the smaller value be 100.",
            "Then the larger value = 100 + {percentageRate} = {largerBase}.",
            "Keep the base quantity clear while simplifying.",
            "Less percentage from larger side = {percentageRate} x 100 / {largerBase} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      lessToMore: {
        steps: [
          "Let the larger value be 100.",
          "Then the smaller value = 100 - {percentageRate} = {smallerBase}.",
          "More percentage from smaller side = {percentageRate} x 100 / {smallerBase} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Let the larger value be 100.",
            "Then the smaller value = 100 - {percentageRate} = {smallerBase}.",
            "More percentage from smaller side = {percentageRate} x 100 / {smallerBase} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Let the larger value be 100.",
            "Then the smaller value = 100 - {percentageRate} = {smallerBase}.",
            "More percentage from smaller side = {percentageRate} x 100 / {smallerBase} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Let the larger value be 100.",
            "Substitute the given numbers in the relation.",
            "Then the smaller value = 100 - {percentageRate} = {smallerBase}.",
            "More percentage from smaller side = {percentageRate} x 100 / {smallerBase} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Let the larger value be 100.",
            "Then the smaller value = 100 - {percentageRate} = {smallerBase}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Let the larger value be 100.",
            "Then the smaller value = 100 - {percentageRate} = {smallerBase}.",
            "Keep the base quantity clear while simplifying.",
            "More percentage from smaller side = {percentageRate} x 100 / {smallerBase} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      ratioFromPercentEquality: {
        steps: [
          "Given, {rate1}% of A = {rate2}% of B.",
          "So, A/B = {rate2}/{rate1}.",
          "After simplification, A:B = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Given, {rate1}% of A = {rate2}% of B.",
            "So, A/B = {rate2}/{rate1}.",
            "After simplification, A:B = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Given, {rate1}% of A = {rate2}% of B.",
            "So, A/B = {rate2}/{rate1}.",
            "After simplification, A:B = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Given, {rate1}% of A = {rate2}% of B.",
            "Substitute the given numbers in the relation.",
            "So, A/B = {rate2}/{rate1}.",
            "After simplification, A:B = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Given, {rate1}% of A = {rate2}% of B.",
            "So, A/B = {rate2}/{rate1}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Given, {rate1}% of A = {rate2}% of B.",
            "So, A/B = {rate2}/{rate1}.",
            "Keep the base quantity clear while simplifying.",
            "After simplification, A:B = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      valueAsPercent: {
        steps: [
          "We need to express {value} as a percentage of {baseValue}.",
          "Percentage = {value} x 100 / {baseValue}.",
          "Percentage = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "We need to express {value} as a percentage of {baseValue}.",
            "Percentage = {value} x 100 / {baseValue}.",
            "Percentage = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "We need to express {value} as a percentage of {baseValue}.",
            "Percentage = {value} x 100 / {baseValue}.",
            "Percentage = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "We need to express {value} as a percentage of {baseValue}.",
            "Substitute the given numbers in the relation.",
            "Percentage = {value} x 100 / {baseValue}.",
            "Percentage = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "We need to express {value} as a percentage of {baseValue}.",
            "Percentage = {value} x 100 / {baseValue}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "We need to express {value} as a percentage of {baseValue}.",
            "Percentage = {value} x 100 / {baseValue}.",
            "Keep the base quantity clear while simplifying.",
            "Percentage = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      percentToFraction: {
        steps: [
          "Write {percentageRate}% as {percentageRate}/100.",
          "Reduce the fraction to lowest terms.",
          "The simplified fraction is {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Write {percentageRate}% as {percentageRate}/100.",
            "Reduce the fraction to lowest terms.",
            "The simplified fraction is {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Write {percentageRate}% as {percentageRate}/100.",
            "Reduce the fraction to lowest terms.",
            "The simplified fraction is {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Write {percentageRate}% as {percentageRate}/100.",
            "Substitute the given numbers in the relation.",
            "Reduce the fraction to lowest terms.",
            "The simplified fraction is {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Write {percentageRate}% as {percentageRate}/100.",
            "Reduce the fraction to lowest terms.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Write {percentageRate}% as {percentageRate}/100.",
            "Reduce the fraction to lowest terms.",
            "Keep the base quantity clear while simplifying.",
            "The simplified fraction is {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      }
    }
  },
  "PCT-CP-002": {
    explanationId: "PCT-ES-002",
    taskExplanations: {
      increaseNewValue: {
        steps: [
          "Original value = {baseValue}.",
          "Increase = {percentageRate}% of {baseValue} = {changeAmount}.",
          "New value = {baseValue} + {changeAmount} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Original value = {baseValue}.",
            "Increase = {percentageRate}% of {baseValue} = {changeAmount}.",
            "New value = {baseValue} + {changeAmount} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Original value = {baseValue}.",
            "Increase = {percentageRate}% of {baseValue} = {changeAmount}.",
            "New value = {baseValue} + {changeAmount} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Original value = {baseValue}.",
            "Substitute the given numbers in the relation.",
            "Increase = {percentageRate}% of {baseValue} = {changeAmount}.",
            "New value = {baseValue} + {changeAmount} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Original value = {baseValue}.",
            "Increase = {percentageRate}% of {baseValue} = {changeAmount}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Original value = {baseValue}.",
            "Increase = {percentageRate}% of {baseValue} = {changeAmount}.",
            "Keep the base quantity clear while simplifying.",
            "New value = {baseValue} + {changeAmount} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      decreaseNewValue: {
        steps: [
          "Original value = {baseValue}.",
          "Decrease = {percentageRate}% of {baseValue} = {changeAmount}.",
          "New value = {baseValue} - {changeAmount} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Original value = {baseValue}.",
            "Decrease = {percentageRate}% of {baseValue} = {changeAmount}.",
            "New value = {baseValue} - {changeAmount} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Original value = {baseValue}.",
            "Decrease = {percentageRate}% of {baseValue} = {changeAmount}.",
            "New value = {baseValue} - {changeAmount} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Original value = {baseValue}.",
            "Substitute the given numbers in the relation.",
            "Decrease = {percentageRate}% of {baseValue} = {changeAmount}.",
            "New value = {baseValue} - {changeAmount} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Original value = {baseValue}.",
            "Decrease = {percentageRate}% of {baseValue} = {changeAmount}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Original value = {baseValue}.",
            "Decrease = {percentageRate}% of {baseValue} = {changeAmount}.",
            "Keep the base quantity clear while simplifying.",
            "New value = {baseValue} - {changeAmount} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      reverseIncrease: {
        steps: [
          "After {percentageRate}% increase, the value becomes {finalValue}.",
          "So, final value represents {changedBase}% of the original value.",
          "Original value = {finalValue} x 100 / {changedBase} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "After {percentageRate}% increase, the value becomes {finalValue}.",
            "So, final value represents {changedBase}% of the original value.",
            "Original value = {finalValue} x 100 / {changedBase} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "After {percentageRate}% increase, the value becomes {finalValue}.",
            "So, final value represents {changedBase}% of the original value.",
            "Original value = {finalValue} x 100 / {changedBase} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "After {percentageRate}% increase, the value becomes {finalValue}.",
            "Substitute the given numbers in the relation.",
            "So, final value represents {changedBase}% of the original value.",
            "Original value = {finalValue} x 100 / {changedBase} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "After {percentageRate}% increase, the value becomes {finalValue}.",
            "So, final value represents {changedBase}% of the original value.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "After {percentageRate}% increase, the value becomes {finalValue}.",
            "So, final value represents {changedBase}% of the original value.",
            "Keep the base quantity clear while simplifying.",
            "Original value = {finalValue} x 100 / {changedBase} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      reverseDecrease: {
        steps: [
          "After {percentageRate}% decrease, the value becomes {finalValue}.",
          "So, final value represents {changedBase}% of the original value.",
          "Original value = {finalValue} x 100 / {changedBase} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "After {percentageRate}% decrease, the value becomes {finalValue}.",
            "So, final value represents {changedBase}% of the original value.",
            "Original value = {finalValue} x 100 / {changedBase} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "After {percentageRate}% decrease, the value becomes {finalValue}.",
            "So, final value represents {changedBase}% of the original value.",
            "Original value = {finalValue} x 100 / {changedBase} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "After {percentageRate}% decrease, the value becomes {finalValue}.",
            "Substitute the given numbers in the relation.",
            "So, final value represents {changedBase}% of the original value.",
            "Original value = {finalValue} x 100 / {changedBase} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "After {percentageRate}% decrease, the value becomes {finalValue}.",
            "So, final value represents {changedBase}% of the original value.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "After {percentageRate}% decrease, the value becomes {finalValue}.",
            "So, final value represents {changedBase}% of the original value.",
            "Keep the base quantity clear while simplifying.",
            "Original value = {finalValue} x 100 / {changedBase} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      increaseByAmount: {
        steps: [
          "The increase amount is {value}, which is {percentageRate}% of the original value.",
          "Original value = {value} x 100 / {percentageRate}.",
          "Original value = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "The increase amount is {value}, which is {percentageRate}% of the original value.",
            "Original value = {value} x 100 / {percentageRate}.",
            "Original value = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "The increase amount is {value}, which is {percentageRate}% of the original value.",
            "Original value = {value} x 100 / {percentageRate}.",
            "Original value = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "The increase amount is {value}, which is {percentageRate}% of the original value.",
            "Substitute the given numbers in the relation.",
            "Original value = {value} x 100 / {percentageRate}.",
            "Original value = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "The increase amount is {value}, which is {percentageRate}% of the original value.",
            "Original value = {value} x 100 / {percentageRate}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "The increase amount is {value}, which is {percentageRate}% of the original value.",
            "Original value = {value} x 100 / {percentageRate}.",
            "Keep the base quantity clear while simplifying.",
            "Original value = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      percentOfKnownNumber: {
        steps: [
          "{rate1}% of the number is {value1}.",
          "First find {rate2}% of the same number directly.",
          "Required value = {value1} x {rate2} / {rate1} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "{rate1}% of the number is {value1}.",
            "First find {rate2}% of the same number directly.",
            "Required value = {value1} x {rate2} / {rate1} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "{rate1}% of the number is {value1}.",
            "First find {rate2}% of the same number directly.",
            "Required value = {value1} x {rate2} / {rate1} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "{rate1}% of the number is {value1}.",
            "Substitute the given numbers in the relation.",
            "First find {rate2}% of the same number directly.",
            "Required value = {value1} x {rate2} / {rate1} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "{rate1}% of the number is {value1}.",
            "First find {rate2}% of the same number directly.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "{rate1}% of the number is {value1}.",
            "First find {rate2}% of the same number directly.",
            "Keep the base quantity clear while simplifying.",
            "Required value = {value1} x {rate2} / {rate1} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      differenceOfPercents: {
        steps: [
          "The difference between {rate1}% and {rate2}% is {percentDifference}%.",
          "This difference equals {value}.",
          "Original number = {value} x 100 / {percentDifference} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "The difference between {rate1}% and {rate2}% is {percentDifference}%.",
            "This difference equals {value}.",
            "Original number = {value} x 100 / {percentDifference} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "The difference between {rate1}% and {rate2}% is {percentDifference}%.",
            "This difference equals {value}.",
            "Original number = {value} x 100 / {percentDifference} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "The difference between {rate1}% and {rate2}% is {percentDifference}%.",
            "Substitute the given numbers in the relation.",
            "This difference equals {value}.",
            "Original number = {value} x 100 / {percentDifference} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "The difference between {rate1}% and {rate2}% is {percentDifference}%.",
            "This difference equals {value}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "The difference between {rate1}% and {rate2}% is {percentDifference}%.",
            "This difference equals {value}.",
            "Keep the base quantity clear while simplifying.",
            "Original number = {value} x 100 / {percentDifference} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      restoreAfterDecrease: {
        steps: [
          "After a decrease of {percentageRate}%, the remaining value is {remainingBase}%.",
          "Required increase to restore = {percentageRate} x 100 / {remainingBase}.",
          "Required increase = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "After a decrease of {percentageRate}%, the remaining value is {remainingBase}%.",
            "Required increase to restore = {percentageRate} x 100 / {remainingBase}.",
            "Required increase = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "After a decrease of {percentageRate}%, the remaining value is {remainingBase}%.",
            "Required increase to restore = {percentageRate} x 100 / {remainingBase}.",
            "Required increase = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "After a decrease of {percentageRate}%, the remaining value is {remainingBase}%.",
            "Substitute the given numbers in the relation.",
            "Required increase to restore = {percentageRate} x 100 / {remainingBase}.",
            "Required increase = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "After a decrease of {percentageRate}%, the remaining value is {remainingBase}%.",
            "Required increase to restore = {percentageRate} x 100 / {remainingBase}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "After a decrease of {percentageRate}%, the remaining value is {remainingBase}%.",
            "Required increase to restore = {percentageRate} x 100 / {remainingBase}.",
            "Keep the base quantity clear while simplifying.",
            "Required increase = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      }
    }
  },
  "PCT-CP-003": {
    explanationId: "PCT-ES-003",
    taskExplanations: {
      successiveChange: {
        steps: [
          "First change factor = {firstFactor}.",
          "Second change factor = {secondFactor}.",
          "Net factor = {netFactor}. Net percentage change = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "First change factor = {firstFactor}.",
            "Second change factor = {secondFactor}.",
            "Net factor = {netFactor}. Net percentage change = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "First change factor = {firstFactor}.",
            "Second change factor = {secondFactor}.",
            "Net factor = {netFactor}. Net percentage change = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "First change factor = {firstFactor}.",
            "Substitute the given numbers in the relation.",
            "Second change factor = {secondFactor}.",
            "Net factor = {netFactor}. Net percentage change = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "First change factor = {firstFactor}.",
            "Second change factor = {secondFactor}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "First change factor = {firstFactor}.",
            "Second change factor = {secondFactor}.",
            "Keep the base quantity clear while simplifying.",
            "Net factor = {netFactor}. Net percentage change = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      successiveIncrease: {
        aliasOf: "successiveChange"
      },
      compoundGrowth: {
        steps: [
          "Initial value = {initialValue}.",
          "Growth factor for one step = {singleFactor}.",
          "After two steps, value = {initialValue} x {singleFactor} x {singleFactor} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Initial value = {initialValue}.",
            "Growth factor for one step = {singleFactor}.",
            "After two steps, value = {initialValue} x {singleFactor} x {singleFactor} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Initial value = {initialValue}.",
            "Growth factor for one step = {singleFactor}.",
            "After two steps, value = {initialValue} x {singleFactor} x {singleFactor} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Initial value = {initialValue}.",
            "Substitute the given numbers in the relation.",
            "Growth factor for one step = {singleFactor}.",
            "After two steps, value = {initialValue} x {singleFactor} x {singleFactor} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Initial value = {initialValue}.",
            "Growth factor for one step = {singleFactor}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Initial value = {initialValue}.",
            "Growth factor for one step = {singleFactor}.",
            "Keep the base quantity clear while simplifying.",
            "After two steps, value = {initialValue} x {singleFactor} x {singleFactor} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      compoundDecay: {
        steps: [
          "Initial value = {initialValue}.",
          "Decay factor for one step = {singleFactor}.",
          "After two steps, value = {initialValue} x {singleFactor} x {singleFactor} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Initial value = {initialValue}.",
            "Decay factor for one step = {singleFactor}.",
            "After two steps, value = {initialValue} x {singleFactor} x {singleFactor} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Initial value = {initialValue}.",
            "Decay factor for one step = {singleFactor}.",
            "After two steps, value = {initialValue} x {singleFactor} x {singleFactor} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Initial value = {initialValue}.",
            "Substitute the given numbers in the relation.",
            "Decay factor for one step = {singleFactor}.",
            "After two steps, value = {initialValue} x {singleFactor} x {singleFactor} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Initial value = {initialValue}.",
            "Decay factor for one step = {singleFactor}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Initial value = {initialValue}.",
            "Decay factor for one step = {singleFactor}.",
            "Keep the base quantity clear while simplifying.",
            "After two steps, value = {initialValue} x {singleFactor} x {singleFactor} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      areaChange: {
        aliasOf: "successiveChange"
      },
      squareAreaChange: {
        steps: [
          "Side changes by {percentageRate}%.",
          "Area depends on side squared, so factor = {singleFactor} x {singleFactor}.",
          "Net percentage change = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Side changes by {percentageRate}%.",
            "Area depends on side squared, so factor = {singleFactor} x {singleFactor}.",
            "Net percentage change = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Side changes by {percentageRate}%.",
            "Area depends on side squared, so factor = {singleFactor} x {singleFactor}.",
            "Net percentage change = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Side changes by {percentageRate}%.",
            "Substitute the given numbers in the relation.",
            "Area depends on side squared, so factor = {singleFactor} x {singleFactor}.",
            "Net percentage change = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Side changes by {percentageRate}%.",
            "Area depends on side squared, so factor = {singleFactor} x {singleFactor}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Side changes by {percentageRate}%.",
            "Area depends on side squared, so factor = {singleFactor} x {singleFactor}.",
            "Keep the base quantity clear while simplifying.",
            "Net percentage change = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      }
    }
  },
  "PCT-CP-004": {
    explanationId: "PCT-ES-004",
    taskExplanations: {
      productInvariance: {
        steps: [
          "The product remains constant.",
          "If one factor changes by {percentageRate}%, the other factor must change in the opposite direction.",
          "Required percentage = {percentageRate} x 100 / {changedBase} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "The product remains constant.",
            "If one factor changes by {percentageRate}%, the other factor must change in the opposite direction.",
            "Required percentage = {percentageRate} x 100 / {changedBase} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "The product remains constant.",
            "If one factor changes by {percentageRate}%, the other factor must change in the opposite direction.",
            "Required percentage = {percentageRate} x 100 / {changedBase} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "The product remains constant.",
            "Substitute the given numbers in the relation.",
            "If one factor changes by {percentageRate}%, the other factor must change in the opposite direction.",
            "Required percentage = {percentageRate} x 100 / {changedBase} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "The product remains constant.",
            "If one factor changes by {percentageRate}%, the other factor must change in the opposite direction.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "The product remains constant.",
            "If one factor changes by {percentageRate}%, the other factor must change in the opposite direction.",
            "Keep the base quantity clear while simplifying.",
            "Required percentage = {percentageRate} x 100 / {changedBase} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      invarianceDecrease: {
        aliasOf: "productInvariance"
      },
      invarianceIncrease: {
        aliasOf: "productInvariance"
      },
      restoreAfterIncrease: {
        aliasOf: "productInvariance"
      },
      revenueChange: {
        steps: [
          "Revenue depends on price and sales quantity.",
          "Price factor = {firstFactor} and quantity factor = {secondFactor}.",
          "Net factor = {netFactor}. Net percentage change = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Revenue depends on price and sales quantity.",
            "Price factor = {firstFactor} and quantity factor = {secondFactor}.",
            "Net factor = {netFactor}. Net percentage change = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Revenue depends on price and sales quantity.",
            "Price factor = {firstFactor} and quantity factor = {secondFactor}.",
            "Net factor = {netFactor}. Net percentage change = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Revenue depends on price and sales quantity.",
            "Substitute the given numbers in the relation.",
            "Price factor = {firstFactor} and quantity factor = {secondFactor}.",
            "Net factor = {netFactor}. Net percentage change = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Revenue depends on price and sales quantity.",
            "Price factor = {firstFactor} and quantity factor = {secondFactor}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Revenue depends on price and sales quantity.",
            "Price factor = {firstFactor} and quantity factor = {secondFactor}.",
            "Keep the base quantity clear while simplifying.",
            "Net factor = {netFactor}. Net percentage change = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      circleAreaDecrease: {
        steps: [
          "Area of a circle depends on radius squared.",
          "New radius factor = {singleFactor}.",
          "Area decrease = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Area of a circle depends on radius squared.",
            "New radius factor = {singleFactor}.",
            "Area decrease = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Area of a circle depends on radius squared.",
            "New radius factor = {singleFactor}.",
            "Area decrease = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Area of a circle depends on radius squared.",
            "Substitute the given numbers in the relation.",
            "New radius factor = {singleFactor}.",
            "Area decrease = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Area of a circle depends on radius squared.",
            "New radius factor = {singleFactor}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Area of a circle depends on radius squared.",
            "New radius factor = {singleFactor}.",
            "Keep the base quantity clear while simplifying.",
            "Area decrease = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      }
    }
  },
  "PCT-CP-005": {
    explanationId: "PCT-ES-005",
    taskExplanations: {
      partToTotal: {
        steps: [
          "The given part {value} represents {knownPercentage}% of the total.",
          "Total = {value} x 100 / {knownPercentage}.",
          "Total = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "The given part {value} represents {knownPercentage}% of the total.",
            "Total = {value} x 100 / {knownPercentage}.",
            "Total = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "The given part {value} represents {knownPercentage}% of the total.",
            "Total = {value} x 100 / {knownPercentage}.",
            "Total = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "The given part {value} represents {knownPercentage}% of the total.",
            "Substitute the given numbers in the relation.",
            "Total = {value} x 100 / {knownPercentage}.",
            "Total = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "The given part {value} represents {knownPercentage}% of the total.",
            "Total = {value} x 100 / {knownPercentage}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "The given part {value} represents {knownPercentage}% of the total.",
            "Total = {value} x 100 / {knownPercentage}.",
            "Keep the base quantity clear while simplifying.",
            "Total = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      incomePartition: {
        steps: [
          "Remaining percentage after all given parts = {knownPercentage}%.",
          "This remaining part equals {value}.",
          "Total = {value} x 100 / {knownPercentage} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Remaining percentage after all given parts = {knownPercentage}%.",
            "This remaining part equals {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Remaining percentage after all given parts = {knownPercentage}%.",
            "This remaining part equals {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Remaining percentage after all given parts = {knownPercentage}%.",
            "Substitute the given numbers in the relation.",
            "This remaining part equals {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Remaining percentage after all given parts = {knownPercentage}%.",
            "This remaining part equals {value}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Remaining percentage after all given parts = {knownPercentage}%.",
            "This remaining part equals {value}.",
            "Keep the base quantity clear while simplifying.",
            "Total = {value} x 100 / {knownPercentage} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      successiveExpense: {
        steps: [
          "First remaining factor = {firstFactor}.",
          "Second remaining factor = {secondFactor}.",
          "Final amount {value} equals original x {netFactor}. Original value = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "First remaining factor = {firstFactor}.",
            "Second remaining factor = {secondFactor}.",
            "Final amount {value} equals original x {netFactor}. Original value = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "First remaining factor = {firstFactor}.",
            "Second remaining factor = {secondFactor}.",
            "Final amount {value} equals original x {netFactor}. Original value = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "First remaining factor = {firstFactor}.",
            "Substitute the given numbers in the relation.",
            "Second remaining factor = {secondFactor}.",
            "Final amount {value} equals original x {netFactor}. Original value = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "First remaining factor = {firstFactor}.",
            "Second remaining factor = {secondFactor}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "First remaining factor = {firstFactor}.",
            "Second remaining factor = {secondFactor}.",
            "Keep the base quantity clear while simplifying.",
            "Final amount {value} equals original x {netFactor}. Original value = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      winnerVotes: {
        steps: [
          "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
          "Vote gap percentage = {gapPercentage}%.",
          "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
            "Substitute the given numbers in the relation.",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "Keep the base quantity clear while simplifying.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      cancelledVotes: {
        steps: [
          "Valid vote percentage = {validPercentage}%.",
          "Winner-loser gap among valid votes = {gapPercentage}%.",
          "Actual gap on total votes = {effectiveGapPercentage}%. Total votes = {voteDifference} x 100 / {effectiveGapPercentage} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Valid vote percentage = {validPercentage}%.",
            "Winner-loser gap among valid votes = {gapPercentage}%.",
            "Actual gap on total votes = {effectiveGapPercentage}%. Total votes = {voteDifference} x 100 / {effectiveGapPercentage} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Valid vote percentage = {validPercentage}%.",
            "Winner-loser gap among valid votes = {gapPercentage}%.",
            "Actual gap on total votes = {effectiveGapPercentage}%. Total votes = {voteDifference} x 100 / {effectiveGapPercentage} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Valid vote percentage = {validPercentage}%.",
            "Substitute the given numbers in the relation.",
            "Winner-loser gap among valid votes = {gapPercentage}%.",
            "Actual gap on total votes = {effectiveGapPercentage}%. Total votes = {voteDifference} x 100 / {effectiveGapPercentage} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Valid vote percentage = {validPercentage}%.",
            "Winner-loser gap among valid votes = {gapPercentage}%.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Valid vote percentage = {validPercentage}%.",
            "Winner-loser gap among valid votes = {gapPercentage}%.",
            "Keep the base quantity clear while simplifying.",
            "Actual gap on total votes = {effectiveGapPercentage}%. Total votes = {voteDifference} x 100 / {effectiveGapPercentage} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      passMarks: {
        steps: [
          "Passing marks = marks obtained + fail margin = {passMarksValue}.",
          "This is {passRate}% of total marks.",
          "Total marks = {passMarksValue} x 100 / {passRate} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Passing marks = marks obtained + fail margin = {passMarksValue}.",
            "This is {passRate}% of total marks.",
            "Total marks = {passMarksValue} x 100 / {passRate} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Passing marks = marks obtained + fail margin = {passMarksValue}.",
            "This is {passRate}% of total marks.",
            "Total marks = {passMarksValue} x 100 / {passRate} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Passing marks = marks obtained + fail margin = {passMarksValue}.",
            "Substitute the given numbers in the relation.",
            "This is {passRate}% of total marks.",
            "Total marks = {passMarksValue} x 100 / {passRate} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Passing marks = marks obtained + fail margin = {passMarksValue}.",
            "This is {passRate}% of total marks.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Passing marks = marks obtained + fail margin = {passMarksValue}.",
            "This is {passRate}% of total marks.",
            "Keep the base quantity clear while simplifying.",
            "Total marks = {passMarksValue} x 100 / {passRate} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      complementOfTotal: {
        steps: [
          "Required percentage = 100 - {percentageRate} = {knownPercentage}%.",
          "Required value = {totalPopulation} x {knownPercentage} / 100 = {answer}.",
          "After simplification, we get the required result.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Required percentage = 100 - {percentageRate} = {knownPercentage}%.",
            "Required value = {totalPopulation} x {knownPercentage} / 100 = {answer}.",
            "After simplification, we get the required result.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Required percentage = 100 - {percentageRate} = {knownPercentage}%.",
            "Required value = {totalPopulation} x {knownPercentage} / 100 = {answer}.",
            "After simplification, we get the required result.",
            "Hence, the required value is {answer}."
          ],
          [
            "Required percentage = 100 - {percentageRate} = {knownPercentage}%.",
            "Substitute the given numbers in the relation.",
            "Required value = {totalPopulation} x {knownPercentage} / 100 = {answer}.",
            "After simplification, we get the required result.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Required percentage = 100 - {percentageRate} = {knownPercentage}%.",
            "Required value = {totalPopulation} x {knownPercentage} / 100 = {answer}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Required percentage = 100 - {percentageRate} = {knownPercentage}%.",
            "Required value = {totalPopulation} x {knownPercentage} / 100 = {answer}.",
            "Keep the base quantity clear while simplifying.",
            "After simplification, we get the required result.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      moreMarksBase: {
        steps: [
          "Given marks {marks} are {rate1}% more than the base.",
          "So, {marks} represents {changedBase}% of the base.",
          "Base marks = {marks} x 100 / {changedBase} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Given marks {marks} are {rate1}% more than the base.",
            "So, {marks} represents {changedBase}% of the base.",
            "Base marks = {marks} x 100 / {changedBase} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Given marks {marks} are {rate1}% more than the base.",
            "So, {marks} represents {changedBase}% of the base.",
            "Base marks = {marks} x 100 / {changedBase} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Given marks {marks} are {rate1}% more than the base.",
            "Substitute the given numbers in the relation.",
            "So, {marks} represents {changedBase}% of the base.",
            "Base marks = {marks} x 100 / {changedBase} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Given marks {marks} are {rate1}% more than the base.",
            "So, {marks} represents {changedBase}% of the base.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Given marks {marks} are {rate1}% more than the base.",
            "So, {marks} represents {changedBase}% of the base.",
            "Keep the base quantity clear while simplifying.",
            "Base marks = {marks} x 100 / {changedBase} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      twoShareRemainder: {
        steps: [
          "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
          "This remaining value is {value}.",
          "Total = {value} x 100 / {knownPercentage} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
            "This remaining value is {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
            "This remaining value is {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
            "Substitute the given numbers in the relation.",
            "This remaining value is {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
            "This remaining value is {value}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
            "This remaining value is {value}.",
            "Keep the base quantity clear while simplifying.",
            "Total = {value} x 100 / {knownPercentage} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      loserVotes: {
        steps: [
          "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
          "Vote gap percentage = {gapPercentage}%.",
          "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
            "Hence, the required value is {answer}."
          ],
          [
            "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
            "Substitute the given numbers in the relation.",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "Keep the base quantity clear while simplifying.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      }
    }
  },
  "PCT-CP-006": {
    explanationId: "PCT-ES-006",
    taskExplanations: {
      mixturePercent: {
        steps: [
          "Use the unchanged component to form the percentage equation.",
          "Initial unchanged amount = {initialUnchangedAmount}.",
          "Final total or required change is found from the new percentage condition.",
          "Now simplify the working carefully.",
          "Therefore, the answer is {answer}."
        ],
        variants: [
          [
            "Use the unchanged component to form the percentage equation.",
            "Initial unchanged amount = {initialUnchangedAmount}.",
            "Final total or required change is found from the new percentage condition.",
            "Now simplify the working carefully.",
            "Therefore, the answer is {answer}."
          ],
          [
            "Observe the given relation carefully.",
            "Use the unchanged component to form the percentage equation.",
            "Initial unchanged amount = {initialUnchangedAmount}.",
            "Final total or required change is found from the new percentage condition.",
            "Hence, the required value is {answer}."
          ],
          [
            "Use the unchanged component to form the percentage equation.",
            "Substitute the given numbers in the relation.",
            "Initial unchanged amount = {initialUnchangedAmount}.",
            "Final total or required change is found from the new percentage condition.",
            "Thus, the value obtained is {answer}."
          ],
          [
            "Now write the working with the given values.",
            "Use the unchanged component to form the percentage equation.",
            "Initial unchanged amount = {initialUnchangedAmount}.",
            "The calculation gives {answer}.",
            "So, the required result is {answer}."
          ],
          [
            "Use the unchanged component to form the percentage equation.",
            "Initial unchanged amount = {initialUnchangedAmount}.",
            "Keep the base quantity clear while simplifying.",
            "Final total or required change is found from the new percentage condition.",
            "Accordingly, the final answer is {answer}."
          ]
        ]
      },
      dilutionAddWater: {
        aliasOf: "mixturePercent"
      },
      dryFromFresh: {
        aliasOf: "mixturePercent"
      },
      addSolute: {
        aliasOf: "mixturePercent"
      },
      dilutedPercent: {
        aliasOf: "mixturePercent"
      },
      freshFromDry: {
        aliasOf: "mixturePercent"
      },
      addPureComponent: {
        aliasOf: "mixturePercent"
      },
      evaporationOriginal: {
        aliasOf: "mixturePercent"
      },
      alloyComplement: {
        aliasOf: "mixturePercent"
      }
    }
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/explanation.hi.json
var explanation_hi_default = {
  "PCT-CP-001": {
    explanationId: "PCT-ES-001",
    taskExplanations: {
      percentOf: {
        steps: [
          "{baseValue} \u0915\u093E {percentageRate}% \u091C\u094D\u091E\u093E\u0924 \u0915\u0930\u0928\u093E \u0939\u0948\u0964",
          "{percentageRate}% = {percentageRate}/100\u0964",
          "\u0905\u0924\u0903 {baseValue} x {percentageRate}/100 = {answer}\u0964",
          "\u0905\u092C \u0907\u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "{baseValue} \u0915\u093E {percentageRate}% \u091C\u094D\u091E\u093E\u0924 \u0915\u0930\u0928\u093E \u0939\u0948\u0964",
            "{percentageRate}% = {percentageRate}/100\u0964",
            "\u0905\u0924\u0903 {baseValue} x {percentageRate}/100 = {answer}\u0964",
            "\u0905\u092C \u0907\u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "{baseValue} \u0915\u093E {percentageRate}% \u0928\u093F\u0915\u093E\u0932\u0928\u093E \u0939\u0948\u0964",
            "{percentageRate}% = {percentageRate}/100\u0964",
            "\u0907\u0938\u0932\u093F\u090F {baseValue} x {percentageRate}/100 = {answer}\u0964",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0905\u0924\u0903 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      directRelation: {
        aliasOf: "percentOf"
      },
      percentToFraction: {
        steps: [
          "{percentageRate}% \u0915\u094B 100 \u0915\u0947 \u090A\u092A\u0930 \u0932\u093F\u0916\u0947\u0902\u0964",
          "{percentageRate}% = {percentageRate}/100\u0964",
          "\u0905\u092C \u092D\u093F\u0928\u094D\u0928 \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0938\u0930\u0932 \u0915\u0930\u0928\u0947 \u092A\u0930 {answer} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964",
          "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "{percentageRate}% \u0915\u094B 100 \u0915\u0947 \u090A\u092A\u0930 \u0932\u093F\u0916\u0947\u0902\u0964",
            "{percentageRate}% = {percentageRate}/100\u0964",
            "\u0905\u092C \u092D\u093F\u0928\u094D\u0928 \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0938\u0930\u0932 \u0915\u0930\u0928\u0947 \u092A\u0930 {answer} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964",
            "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "{percentageRate}% \u0915\u094B 100 \u0915\u0947 \u0939\u0930 \u092E\u0947\u0902 \u0932\u093F\u0916\u0947\u0902\u0964",
            "{percentageRate}% = {percentageRate}/100\u0964",
            "\u0905\u092C \u0907\u0938 \u092D\u093F\u0928\u094D\u0928 \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0938\u0930\u0932 \u0915\u0930\u0928\u0947 \u092A\u0930 {answer} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964",
            "\u0905\u0924\u0903 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      valueAsPercent: {
        steps: [
          "{value} \u0915\u094B {baseValue} \u0915\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092E\u0947\u0902 \u0932\u093F\u0916\u0947\u0902\u0964",
          "\u092A\u094D\u0930\u0924\u093F\u0936\u0924 = {value} x 100 / {baseValue}\u0964",
          "\u0905\u092C \u092E\u093E\u0928 \u0930\u0916\u0915\u0930 \u0917\u0923\u0928\u093E \u0915\u0930\u0947\u0902\u0964",
          "\u0917\u0923\u0928\u093E \u0915\u0930\u0928\u0947 \u092A\u0930 {answer} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964",
          "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "{value} \u0915\u094B {baseValue} \u0915\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092E\u0947\u0902 \u0932\u093F\u0916\u0947\u0902\u0964",
            "\u092A\u094D\u0930\u0924\u093F\u0936\u0924 = {value} x 100 / {baseValue}\u0964",
            "\u0905\u092C \u092E\u093E\u0928 \u0930\u0916\u0915\u0930 \u0917\u0923\u0928\u093E \u0915\u0930\u0947\u0902\u0964",
            "\u0917\u0923\u0928\u093E \u0915\u0930\u0928\u0947 \u092A\u0930 {answer} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964",
            "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "{value} \u0915\u094B {baseValue} \u0915\u0947 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0932\u093F\u0916\u0947\u0902\u0964",
            "\u092A\u094D\u0930\u0924\u093F\u0936\u0924 = {value} x 100 / {baseValue}\u0964",
            "\u0905\u092C \u092E\u093E\u0928 \u0930\u0916\u0915\u0930 \u0939\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0917\u0923\u0928\u093E \u0915\u0930\u0928\u0947 \u092A\u0930 {answer} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964",
            "\u0905\u0924\u0903 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      moreToLess: {
        steps: [
          "\u091B\u094B\u091F\u093E \u092E\u093E\u0928 100 \u092E\u093E\u0928 \u0932\u0947\u0902\u0964",
          "\u0924\u092C \u092C\u0921\u093C\u093E \u092E\u093E\u0928 100 + {percentageRate} \u0939\u094B\u0917\u093E\u0964",
          "\u0905\u092C \u0905\u0902\u0924\u0930 \u0915\u094B \u092C\u0921\u093C\u0947 \u092E\u093E\u0928 \u092A\u0930 \u0932\u0947\u0902\u0964",
          "\u0917\u0923\u0928\u093E \u0915\u0930\u0928\u0947 \u092A\u0930 {answer} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964",
          "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "\u091B\u094B\u091F\u093E \u092E\u093E\u0928 100 \u092E\u093E\u0928 \u0932\u0947\u0902\u0964",
            "\u0924\u092C \u092C\u0921\u093C\u093E \u092E\u093E\u0928 100 + {percentageRate} \u0939\u094B\u0917\u093E\u0964",
            "\u0905\u092C \u0905\u0902\u0924\u0930 \u0915\u094B \u092C\u0921\u093C\u0947 \u092E\u093E\u0928 \u092A\u0930 \u0932\u0947\u0902\u0964",
            "\u0917\u0923\u0928\u093E \u0915\u0930\u0928\u0947 \u092A\u0930 {answer} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964",
            "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u091B\u094B\u091F\u0947 \u092E\u093E\u0928 \u0915\u094B 100 \u092E\u093E\u0928 \u0932\u0947\u0902\u0964",
            "\u0924\u092C \u092C\u0921\u093C\u093E \u092E\u093E\u0928 100 + {percentageRate} \u0939\u094B\u0917\u093E\u0964",
            "\u0905\u092C \u0905\u0902\u0924\u0930 \u0915\u094B \u092C\u0921\u093C\u0947 \u092E\u093E\u0928 \u0915\u0947 \u0906\u0927\u093E\u0930 \u092A\u0930 \u0932\u0947\u0902\u0964",
            "\u0917\u0923\u0928\u093E \u0915\u0930\u0928\u0947 \u092A\u0930 {answer} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964",
            "\u0905\u0924\u0903 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      lessToMore: {
        steps: [
          "\u092C\u0921\u093C\u093E \u092E\u093E\u0928 100 \u092E\u093E\u0928 \u0932\u0947\u0902\u0964",
          "\u0924\u092C \u091B\u094B\u091F\u093E \u092E\u093E\u0928 100 - {percentageRate} \u0939\u094B\u0917\u093E\u0964",
          "\u0905\u092C \u0905\u0902\u0924\u0930 \u0915\u094B \u091B\u094B\u091F\u0947 \u092E\u093E\u0928 \u092A\u0930 \u0932\u0947\u0902\u0964",
          "\u0917\u0923\u0928\u093E \u0915\u0930\u0928\u0947 \u092A\u0930 {answer} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964",
          "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "\u092C\u0921\u093C\u093E \u092E\u093E\u0928 100 \u092E\u093E\u0928 \u0932\u0947\u0902\u0964",
            "\u0924\u092C \u091B\u094B\u091F\u093E \u092E\u093E\u0928 100 - {percentageRate} \u0939\u094B\u0917\u093E\u0964",
            "\u0905\u092C \u0905\u0902\u0924\u0930 \u0915\u094B \u091B\u094B\u091F\u0947 \u092E\u093E\u0928 \u092A\u0930 \u0932\u0947\u0902\u0964",
            "\u0917\u0923\u0928\u093E \u0915\u0930\u0928\u0947 \u092A\u0930 {answer} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964",
            "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u092C\u0921\u093C\u0947 \u092E\u093E\u0928 \u0915\u094B 100 \u092E\u093E\u0928 \u0932\u0947\u0902\u0964",
            "\u0924\u092C \u091B\u094B\u091F\u093E \u092E\u093E\u0928 100 - {percentageRate} \u0939\u094B\u0917\u093E\u0964",
            "\u0905\u092C \u0905\u0902\u0924\u0930 \u0915\u094B \u091B\u094B\u091F\u0947 \u092E\u093E\u0928 \u0915\u0947 \u0906\u0927\u093E\u0930 \u092A\u0930 \u0932\u0947\u0902\u0964",
            "\u0917\u0923\u0928\u093E \u0915\u0930\u0928\u0947 \u092A\u0930 {answer} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964",
            "\u0905\u0924\u0903 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      ratioFromPercentEquality: {
        steps: [
          "A \u0915\u093E {rate1}%, B \u0915\u0947 {rate2}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948\u0964",
          "\u0926\u094B\u0928\u094B\u0902 \u092A\u0915\u094D\u0937\u094B\u0902 \u0915\u094B \u0905\u0928\u0941\u092A\u093E\u0924 \u092E\u0947\u0902 \u0932\u093F\u0916\u0947\u0902\u0964",
          "\u0907\u0938\u0932\u093F\u090F A:B = {rate2}:{rate1}\u0964",
          "\u0938\u0930\u0932 \u0915\u0930\u0928\u0947 \u092A\u0930 {answer} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964",
          "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "A \u0915\u093E {rate1}%, B \u0915\u0947 {rate2}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948\u0964",
            "\u0926\u094B\u0928\u094B\u0902 \u092A\u0915\u094D\u0937\u094B\u0902 \u0915\u094B \u0905\u0928\u0941\u092A\u093E\u0924 \u092E\u0947\u0902 \u0932\u093F\u0916\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F A:B = {rate2}:{rate1}\u0964",
            "\u0938\u0930\u0932 \u0915\u0930\u0928\u0947 \u092A\u0930 {answer} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964",
            "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "A \u0915\u093E {rate1}%, B \u0915\u0947 {rate2}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948\u0964",
            "\u0905\u092C \u0926\u094B\u0928\u094B\u0902 \u092A\u0915\u094D\u0937\u094B\u0902 \u0915\u094B \u0905\u0928\u0941\u092A\u093E\u0924 \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0932\u093F\u0916\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F A:B = {rate2}:{rate1}\u0964",
            "\u0938\u0930\u0932 \u0915\u0930\u0928\u0947 \u092A\u0930 {answer} \u092E\u093F\u0932\u0924\u093E \u0939\u0948\u0964",
            "\u0905\u0924\u0903 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      reversePercent: {
        steps: [
          "{percentageRate}% = {value} \u0926\u093F\u092F\u093E \u0939\u0948\u0964",
          "\u0907\u0938\u0932\u093F\u090F 1% = {value} / {percentageRate}\u0964",
          "\u0905\u092C 100% \u0915\u0947 \u0932\u093F\u090F 100 \u0938\u0947 \u0917\u0941\u0923\u093E \u0915\u0930\u0947\u0902\u0964",
          "\u0907\u0938\u0932\u093F\u090F 100% = {value} x 100 / {percentageRate} = {answer}\u0964",
          "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "{percentageRate}% = {value} \u0926\u093F\u092F\u093E \u0939\u0948\u0964",
            "\u0907\u0938\u0932\u093F\u090F 1% = {value} / {percentageRate}\u0964",
            "\u0905\u092C 100% \u0915\u0947 \u0932\u093F\u090F 100 \u0938\u0947 \u0917\u0941\u0923\u093E \u0915\u0930\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F 100% = {value} x 100 / {percentageRate} = {answer}\u0964",
            "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "{percentageRate}% = {value} \u0926\u093F\u092F\u093E \u0939\u0948\u0964",
            "\u0907\u0938\u0932\u093F\u090F 1% = {value} / {percentageRate}\u0964",
            "\u0905\u092C 100% \u0928\u093F\u0915\u093E\u0932\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F 100 \u0938\u0947 \u0917\u0941\u0923\u093E \u0915\u0930\u0947\u0902\u0964",
            "\u0905\u0924\u0903 100% = {value} x 100 / {percentageRate} = {answer}\u0964",
            "\u0905\u0924\u0903 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      }
    }
  },
  "PCT-CP-002": {
    explanationId: "PCT-ES-002",
    taskExplanations: {
      increaseNewValue: {
        steps: [
          "\u092E\u0942\u0932 \u092E\u093E\u0928 {baseValue} \u0939\u0948\u0964",
          "\u0935\u0943\u0926\u094D\u0927\u093F = {baseValue} \u0915\u093E {percentageRate}% = {changeAmount}\u0964",
          "\u0928\u092F\u093E \u092E\u093E\u0928 = {baseValue} + {changeAmount} = {answer}\u0964",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "\u092E\u0942\u0932 \u092E\u093E\u0928 {baseValue} \u0939\u0948\u0964",
            "\u0935\u0943\u0926\u094D\u0927\u093F = {baseValue} \u0915\u093E {percentageRate}% = {changeAmount}\u0964",
            "\u0928\u092F\u093E \u092E\u093E\u0928 = {baseValue} + {changeAmount} = {answer}\u0964",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0926\u093F\u092F\u093E \u0917\u092F\u093E \u092E\u0942\u0932 \u092E\u093E\u0928 {baseValue} \u0939\u0948\u0964",
            "\u0907\u0938 \u092A\u0930 {percentageRate}% \u0915\u0940 \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0930\u0928\u0947 \u0938\u0947 \u0935\u0943\u0926\u094D\u0927\u093F \u0930\u093E\u0936\u093F {changeAmount} \u092E\u093F\u0932\u0924\u0940 \u0939\u0948\u0964",
            "\u0905\u0924\u0903 \u0928\u092F\u093E \u092E\u093E\u0928 = {baseValue} + {changeAmount} = {answer}\u0964",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0905\u0924\u0903 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      decreaseNewValue: {
        steps: [
          "\u092E\u0942\u0932 \u092E\u093E\u0928 {baseValue} \u0939\u0948\u0964",
          "\u0915\u092E\u0940 = {baseValue} \u0915\u093E {percentageRate}% = {changeAmount}\u0964",
          "\u0928\u092F\u093E \u092E\u093E\u0928 = {baseValue} - {changeAmount} = {answer}\u0964",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "\u092E\u0942\u0932 \u092E\u093E\u0928 {baseValue} \u0939\u0948\u0964",
            "\u0915\u092E\u0940 = {baseValue} \u0915\u093E {percentageRate}% = {changeAmount}\u0964",
            "\u0928\u092F\u093E \u092E\u093E\u0928 = {baseValue} - {changeAmount} = {answer}\u0964",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0926\u093F\u092F\u093E \u0917\u092F\u093E \u092E\u0942\u0932 \u092E\u093E\u0928 {baseValue} \u0939\u0948\u0964",
            "\u0907\u0938\u092E\u0947\u0902 {percentageRate}% \u0915\u0940 \u0915\u092E\u0940 \u0915\u0930\u0928\u0947 \u092A\u0930 \u0915\u092E\u0940 \u0930\u093E\u0936\u093F {changeAmount} \u092E\u093F\u0932\u0924\u0940 \u0939\u0948\u0964",
            "\u0905\u0924\u0903 \u0928\u092F\u093E \u092E\u093E\u0928 = {baseValue} - {changeAmount} = {answer}\u0964",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0905\u0924\u0903 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      reverseIncrease: {
        steps: [
          "{percentageRate}% \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u093E\u0926 \u092E\u093E\u0928 {finalValue} \u0939\u094B \u091C\u093E\u0924\u093E \u0939\u0948\u0964",
          "\u0905\u0924\u0903 \u092F\u0939 \u092E\u0942\u0932 \u092E\u093E\u0928 \u0915\u093E {changedBase}% \u0939\u0948\u0964",
          "\u092E\u0942\u0932 \u092E\u093E\u0928 = {finalValue} x 100 / {changedBase} = {answer}\u0964",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "{percentageRate}% \u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u093E\u0926 \u092E\u093E\u0928 {finalValue} \u0939\u094B \u091C\u093E\u0924\u093E \u0939\u0948\u0964",
            "\u0905\u0924\u0903 \u092F\u0939 \u092E\u0942\u0932 \u092E\u093E\u0928 \u0915\u093E {changedBase}% \u0939\u0948\u0964",
            "\u092E\u0942\u0932 \u092E\u093E\u0928 = {finalValue} x 100 / {changedBase} = {answer}\u0964",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0947 \u092C\u093E\u0926 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u092E\u093E\u0928 {finalValue} \u0926\u093F\u092F\u093E \u0939\u0948\u0964",
            "\u092F\u0939 \u092E\u093E\u0928 \u092A\u0941\u0930\u093E\u0928\u0947 \u092E\u093E\u0928 \u0915\u0947 {changedBase}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948\u0964",
            "\u0907\u0938\u0932\u093F\u090F \u092E\u0942\u0932 \u092E\u093E\u0928 = {finalValue} x 100 / {changedBase} = {answer}\u0964",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0905\u0924\u0903 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      reverseDecrease: {
        steps: [
          "{percentageRate}% \u0915\u092E\u0940 \u0915\u0947 \u092C\u093E\u0926 \u092E\u093E\u0928 {finalValue} \u0930\u0939 \u091C\u093E\u0924\u093E \u0939\u0948\u0964",
          "\u0905\u0924\u0903 \u092F\u0939 \u092E\u0942\u0932 \u092E\u093E\u0928 \u0915\u093E {changedBase}% \u0939\u0948\u0964",
          "\u092E\u0942\u0932 \u092E\u093E\u0928 = {finalValue} x 100 / {changedBase} = {answer}\u0964",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "{percentageRate}% \u0915\u092E\u0940 \u0915\u0947 \u092C\u093E\u0926 \u092E\u093E\u0928 {finalValue} \u0930\u0939 \u091C\u093E\u0924\u093E \u0939\u0948\u0964",
            "\u0905\u0924\u0903 \u092F\u0939 \u092E\u0942\u0932 \u092E\u093E\u0928 \u0915\u093E {changedBase}% \u0939\u0948\u0964",
            "\u092E\u0942\u0932 \u092E\u093E\u0928 = {finalValue} x 100 / {changedBase} = {answer}\u0964",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0915\u092E\u0940 \u0915\u0947 \u092C\u093E\u0926 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u092E\u093E\u0928 {finalValue} \u0926\u093F\u092F\u093E \u0939\u0948\u0964",
            "\u092F\u0939 \u092E\u093E\u0928 \u092A\u0941\u0930\u093E\u0928\u0947 \u092E\u093E\u0928 \u0915\u0947 {changedBase}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948\u0964",
            "\u0907\u0938\u0932\u093F\u090F \u092E\u0942\u0932 \u092E\u093E\u0928 = {finalValue} x 100 / {changedBase} = {answer}\u0964",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0905\u0924\u0903 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      increaseByAmount: {
        steps: [
          "\u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0940 \u0930\u093E\u0936\u093F {value} \u0939\u0948\u0964",
          "\u092F\u0939 \u0930\u093E\u0936\u093F \u092E\u0942\u0932 \u092E\u093E\u0928 \u0915\u0947 {percentageRate}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948\u0964",
          "\u092E\u0942\u0932 \u092E\u093E\u0928 = {value} x 100 / {percentageRate} = {answer}\u0964",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "\u0935\u0943\u0926\u094D\u0927\u093F \u0915\u0940 \u0930\u093E\u0936\u093F {value} \u0939\u0948\u0964",
            "\u092F\u0939 \u0930\u093E\u0936\u093F \u092E\u0942\u0932 \u092E\u093E\u0928 \u0915\u0947 {percentageRate}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948\u0964",
            "\u092E\u0942\u0932 \u092E\u093E\u0928 = {value} x 100 / {percentageRate} = {answer}\u0964",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0926\u093F\u092F\u093E \u0917\u092F\u093E {value} \u0935\u0939\u0940 \u0935\u0943\u0926\u094D\u0927\u093F \u0939\u0948 \u091C\u094B {percentageRate}% \u0915\u0947 \u092C\u0930\u093E\u092C\u0930 \u0939\u0948\u0964",
            "\u0907\u0938\u0932\u093F\u090F {percentageRate}% = {value} \u092E\u093E\u0928\u093E \u091C\u093E\u090F\u0917\u093E\u0964",
            "\u0905\u0924\u0903 \u092E\u0942\u0932 \u092E\u093E\u0928 = {value} x 100 / {percentageRate} = {answer}\u0964",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0905\u0924\u0903 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      percentOfKnownNumber: {
        steps: [
          "\u0938\u0902\u0916\u094D\u092F\u093E \u0915\u093E {rate1}% = {value1} \u0926\u093F\u092F\u093E \u0939\u0948\u0964",
          "\u0909\u0938\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u0915\u093E {rate2}% \u091C\u094D\u091E\u093E\u0924 \u0915\u0930\u0928\u093E \u0939\u0948\u0964",
          "\u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928 = {value1} x {rate2} / {rate1} = {answer}\u0964",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "\u0938\u0902\u0916\u094D\u092F\u093E \u0915\u093E {rate1}% = {value1} \u0926\u093F\u092F\u093E \u0939\u0948\u0964",
            "\u0909\u0938\u0940 \u0938\u0902\u0916\u094D\u092F\u093E \u0915\u093E {rate2}% \u091C\u094D\u091E\u093E\u0924 \u0915\u0930\u0928\u093E \u0939\u0948\u0964",
            "\u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928 = {value1} x {rate2} / {rate1} = {answer}\u0964",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "{rate1}% \u0915\u0947 \u0932\u093F\u090F \u092E\u093E\u0928 {value1} \u0926\u093F\u092F\u093E \u0939\u0948\u0964",
            "\u0905\u092C \u0909\u0938\u0940 \u0906\u0927\u093E\u0930 \u092A\u0930 {rate2}% \u0928\u093F\u0915\u093E\u0932\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928 = {value1} x {rate2} / {rate1} = {answer}\u0964",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0905\u0924\u0903 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      differenceOfPercents: {
        steps: [
          "{rate1}% ?? {rate2}% ?? ???? = {percentDifference}%?",
          "?? ???? {value} ?? ????? ???",
          "??? ?????? = {value} x 100 / {percentDifference} = {answer}?",
          "??? ???? ?? ??? ??? ????? ???",
          "????? {answer} ???"
        ]
      },
      restoreAfterDecrease: {
        steps: [
          "??? ??????? = 100 - {percentageRate} = {remainingBase}%?",
          "?????? ?????? = {percentageRate} x 100 / {remainingBase}?",
          "?????? ?????? = {answer}?",
          "??? ???? ?? ??? ??? ????? ???",
          "????? {answer} ???"
        ]
      }
    }
  },
  "PCT-CP-003": {
    explanationId: "PCT-ES-003",
    taskExplanations: {
      successiveChange: {
        steps: [
          "???? ???? = {firstFactor}?",
          "????? ???? = {secondFactor}?",
          "??? ???? = {netFactor}?",
          "??? ??????? ???????? = {answer}?",
          "????? {answer} ???"
        ]
      },
      successiveIncrease: {
        aliasOf: "successiveChange"
      },
      compoundGrowth: {
        steps: [
          "????????? ??? = {initialValue}?",
          "?? ??? ?? ?????? ???? = {singleFactor}?",
          "?? ????? ?? ??? ??? = {initialValue} x {singleFactor} x {singleFactor}?",
          "??? ???? ?? {answer} ????? ???",
          "????? {answer} ???"
        ]
      },
      compoundDecay: {
        steps: [
          "????????? ??? = {initialValue}?",
          "?? ??? ?? ????? ???? = {singleFactor}?",
          "?? ????? ?? ??? ??? = {initialValue} x {singleFactor} x {singleFactor}?",
          "??? ???? ?? {answer} ????? ???",
          "????? {answer} ???"
        ]
      },
      areaChange: {
        aliasOf: "successiveChange"
      },
      squareAreaChange: {
        steps: [
          "???? ???????? = {percentageRate}%?",
          "????????? ???? = {singleFactor} x {singleFactor}?",
          "??? ??????? ???????? = {answer}?",
          "??? ???? ?? ??? ??? ????? ???",
          "????? {answer} ???"
        ]
      }
    }
  },
  "PCT-CP-004": {
    explanationId: "PCT-ES-004",
    taskExplanations: {
      productInvariance: {
        steps: [
          "?????? ????? ???",
          "????? ???? ?????? ???? ??? ???????",
          "?????? ??????? = {percentageRate} x 100 / {changedBase}?",
          "??? ???? ?? {answer} ????? ???",
          "????? {answer} ???"
        ]
      },
      invarianceDecrease: {
        aliasOf: "productInvariance"
      },
      invarianceIncrease: {
        aliasOf: "productInvariance"
      },
      restoreAfterIncrease: {
        aliasOf: "productInvariance"
      },
      revenueChange: {
        steps: [
          "??????, ????? ?? ?????? ?? ?????? ???? ???",
          "????? ???? = {firstFactor}?",
          "?????? ???? = {secondFactor}?",
          "??? ??????? ???????? = {answer}?",
          "????? {answer} ???"
        ]
      },
      circleAreaDecrease: {
        steps: [
          "????????? ???????? ?? ???? ?? ?????? ???? ???",
          "?? ???????? ?? ???? = {singleFactor}?",
          "????????? ??? ??? = {answer}?",
          "??? ???? ?? ??? ??? ????? ???",
          "????? {answer} ???"
        ]
      }
    }
  },
  "PCT-CP-005": {
    explanationId: "PCT-ES-005",
    taskExplanations: {
      partToTotal: {
        steps: [
          "The given part {value} represents {knownPercentage}% of the total.",
          "Total = {value} x 100 / {knownPercentage}.",
          "Total = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "The given part {value} represents {knownPercentage}% of the total.",
            "Total = {value} x 100 / {knownPercentage}.",
            "Total = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0926\u093F\u090F \u0917\u090F \u0938\u0902\u092C\u0902\u0927 \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0926\u0947\u0916\u0947\u0902\u0964",
            "The given part {value} represents {knownPercentage}% of the total.",
            "Total = {value} x 100 / {knownPercentage}.",
            "Total = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "The given part {value} represents {knownPercentage}% of the total.",
            "\u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0915\u094B \u0938\u0902\u092C\u0902\u0927 \u092E\u0947\u0902 \u0930\u0916\u0947\u0902\u0964",
            "Total = {value} x 100 / {knownPercentage}.",
            "Total = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0907\u0938 \u092A\u094D\u0930\u0915\u093E\u0930 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0905\u092C \u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0938\u0947 \u0917\u0923\u0928\u093E \u0915\u0930\u0947\u0902\u0964",
            "The given part {value} represents {knownPercentage}% of the total.",
            "Total = {value} x 100 / {knownPercentage}.",
            "The calculation gives {answer}.",
            "\u0907\u0938\u0932\u093F\u090F, \u0905\u0902\u0924\u093F\u092E \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "The given part {value} represents {knownPercentage}% of the total.",
            "Total = {value} x 100 / {knownPercentage}.",
            "\u0938\u0930\u0932 \u0915\u0930\u0924\u0947 \u0938\u092E\u092F \u0906\u0927\u093E\u0930 \u092E\u093E\u0928 \u0915\u094B \u0938\u094D\u092A\u0937\u094D\u091F \u0930\u0916\u0947\u0902\u0964",
            "Total = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0938\u0939\u0940 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      incomePartition: {
        steps: [
          "Remaining percentage after all given parts = {knownPercentage}%.",
          "This remaining part equals {value}.",
          "Total = {value} x 100 / {knownPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "Remaining percentage after all given parts = {knownPercentage}%.",
            "This remaining part equals {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0926\u093F\u090F \u0917\u090F \u0938\u0902\u092C\u0902\u0927 \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0926\u0947\u0916\u0947\u0902\u0964",
            "Remaining percentage after all given parts = {knownPercentage}%.",
            "This remaining part equals {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "Remaining percentage after all given parts = {knownPercentage}%.",
            "\u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0915\u094B \u0938\u0902\u092C\u0902\u0927 \u092E\u0947\u0902 \u0930\u0916\u0947\u0902\u0964",
            "This remaining part equals {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0907\u0938 \u092A\u094D\u0930\u0915\u093E\u0930 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0905\u092C \u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0938\u0947 \u0917\u0923\u0928\u093E \u0915\u0930\u0947\u0902\u0964",
            "Remaining percentage after all given parts = {knownPercentage}%.",
            "This remaining part equals {value}.",
            "The calculation gives {answer}.",
            "\u0907\u0938\u0932\u093F\u090F, \u0905\u0902\u0924\u093F\u092E \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "Remaining percentage after all given parts = {knownPercentage}%.",
            "This remaining part equals {value}.",
            "\u0938\u0930\u0932 \u0915\u0930\u0924\u0947 \u0938\u092E\u092F \u0906\u0927\u093E\u0930 \u092E\u093E\u0928 \u0915\u094B \u0938\u094D\u092A\u0937\u094D\u091F \u0930\u0916\u0947\u0902\u0964",
            "Total = {value} x 100 / {knownPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0938\u0939\u0940 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      successiveExpense: {
        steps: [
          "First remaining factor = {firstFactor}.",
          "Second remaining factor = {secondFactor}.",
          "Final amount {value} equals original x {netFactor}. Original value = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "First remaining factor = {firstFactor}.",
            "Second remaining factor = {secondFactor}.",
            "Final amount {value} equals original x {netFactor}. Original value = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0926\u093F\u090F \u0917\u090F \u0938\u0902\u092C\u0902\u0927 \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0926\u0947\u0916\u0947\u0902\u0964",
            "First remaining factor = {firstFactor}.",
            "Second remaining factor = {secondFactor}.",
            "Final amount {value} equals original x {netFactor}. Original value = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "First remaining factor = {firstFactor}.",
            "\u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0915\u094B \u0938\u0902\u092C\u0902\u0927 \u092E\u0947\u0902 \u0930\u0916\u0947\u0902\u0964",
            "Second remaining factor = {secondFactor}.",
            "Final amount {value} equals original x {netFactor}. Original value = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0907\u0938 \u092A\u094D\u0930\u0915\u093E\u0930 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0905\u092C \u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0938\u0947 \u0917\u0923\u0928\u093E \u0915\u0930\u0947\u0902\u0964",
            "First remaining factor = {firstFactor}.",
            "Second remaining factor = {secondFactor}.",
            "The calculation gives {answer}.",
            "\u0907\u0938\u0932\u093F\u090F, \u0905\u0902\u0924\u093F\u092E \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "First remaining factor = {firstFactor}.",
            "Second remaining factor = {secondFactor}.",
            "\u0938\u0930\u0932 \u0915\u0930\u0924\u0947 \u0938\u092E\u092F \u0906\u0927\u093E\u0930 \u092E\u093E\u0928 \u0915\u094B \u0938\u094D\u092A\u0937\u094D\u091F \u0930\u0916\u0947\u0902\u0964",
            "Final amount {value} equals original x {netFactor}. Original value = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0938\u0939\u0940 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      winnerVotes: {
        steps: [
          "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
          "Vote gap percentage = {gapPercentage}%.",
          "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0926\u093F\u090F \u0917\u090F \u0938\u0902\u092C\u0902\u0927 \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0926\u0947\u0916\u0947\u0902\u0964",
            "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
            "\u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0915\u094B \u0938\u0902\u092C\u0902\u0927 \u092E\u0947\u0902 \u0930\u0916\u0947\u0902\u0964",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0907\u0938 \u092A\u094D\u0930\u0915\u093E\u0930 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0905\u092C \u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0938\u0947 \u0917\u0923\u0928\u093E \u0915\u0930\u0947\u0902\u0964",
            "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "The calculation gives {answer}.",
            "\u0907\u0938\u0932\u093F\u090F, \u0905\u0902\u0924\u093F\u092E \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "\u0938\u0930\u0932 \u0915\u0930\u0924\u0947 \u0938\u092E\u092F \u0906\u0927\u093E\u0930 \u092E\u093E\u0928 \u0915\u094B \u0938\u094D\u092A\u0937\u094D\u091F \u0930\u0916\u0947\u0902\u0964",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0938\u0939\u0940 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      cancelledVotes: {
        steps: [
          "Valid vote percentage = {validPercentage}%.",
          "Winner-loser gap among valid votes = {gapPercentage}%.",
          "Actual gap on total votes = {effectiveGapPercentage}%. Total votes = {voteDifference} x 100 / {effectiveGapPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "Valid vote percentage = {validPercentage}%.",
            "Winner-loser gap among valid votes = {gapPercentage}%.",
            "Actual gap on total votes = {effectiveGapPercentage}%. Total votes = {voteDifference} x 100 / {effectiveGapPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0926\u093F\u090F \u0917\u090F \u0938\u0902\u092C\u0902\u0927 \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0926\u0947\u0916\u0947\u0902\u0964",
            "Valid vote percentage = {validPercentage}%.",
            "Winner-loser gap among valid votes = {gapPercentage}%.",
            "Actual gap on total votes = {effectiveGapPercentage}%. Total votes = {voteDifference} x 100 / {effectiveGapPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "Valid vote percentage = {validPercentage}%.",
            "\u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0915\u094B \u0938\u0902\u092C\u0902\u0927 \u092E\u0947\u0902 \u0930\u0916\u0947\u0902\u0964",
            "Winner-loser gap among valid votes = {gapPercentage}%.",
            "Actual gap on total votes = {effectiveGapPercentage}%. Total votes = {voteDifference} x 100 / {effectiveGapPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0907\u0938 \u092A\u094D\u0930\u0915\u093E\u0930 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0905\u092C \u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0938\u0947 \u0917\u0923\u0928\u093E \u0915\u0930\u0947\u0902\u0964",
            "Valid vote percentage = {validPercentage}%.",
            "Winner-loser gap among valid votes = {gapPercentage}%.",
            "The calculation gives {answer}.",
            "\u0907\u0938\u0932\u093F\u090F, \u0905\u0902\u0924\u093F\u092E \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "Valid vote percentage = {validPercentage}%.",
            "Winner-loser gap among valid votes = {gapPercentage}%.",
            "\u0938\u0930\u0932 \u0915\u0930\u0924\u0947 \u0938\u092E\u092F \u0906\u0927\u093E\u0930 \u092E\u093E\u0928 \u0915\u094B \u0938\u094D\u092A\u0937\u094D\u091F \u0930\u0916\u0947\u0902\u0964",
            "Actual gap on total votes = {effectiveGapPercentage}%. Total votes = {voteDifference} x 100 / {effectiveGapPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0938\u0939\u0940 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      passMarks: {
        steps: [
          "Passing marks = marks obtained + fail margin = {passMarksValue}.",
          "This is {passRate}% of total marks.",
          "Total marks = {passMarksValue} x 100 / {passRate} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "Passing marks = marks obtained + fail margin = {passMarksValue}.",
            "This is {passRate}% of total marks.",
            "Total marks = {passMarksValue} x 100 / {passRate} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0926\u093F\u090F \u0917\u090F \u0938\u0902\u092C\u0902\u0927 \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0926\u0947\u0916\u0947\u0902\u0964",
            "Passing marks = marks obtained + fail margin = {passMarksValue}.",
            "This is {passRate}% of total marks.",
            "Total marks = {passMarksValue} x 100 / {passRate} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "Passing marks = marks obtained + fail margin = {passMarksValue}.",
            "\u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0915\u094B \u0938\u0902\u092C\u0902\u0927 \u092E\u0947\u0902 \u0930\u0916\u0947\u0902\u0964",
            "This is {passRate}% of total marks.",
            "Total marks = {passMarksValue} x 100 / {passRate} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0907\u0938 \u092A\u094D\u0930\u0915\u093E\u0930 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0905\u092C \u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0938\u0947 \u0917\u0923\u0928\u093E \u0915\u0930\u0947\u0902\u0964",
            "Passing marks = marks obtained + fail margin = {passMarksValue}.",
            "This is {passRate}% of total marks.",
            "The calculation gives {answer}.",
            "\u0907\u0938\u0932\u093F\u090F, \u0905\u0902\u0924\u093F\u092E \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "Passing marks = marks obtained + fail margin = {passMarksValue}.",
            "This is {passRate}% of total marks.",
            "\u0938\u0930\u0932 \u0915\u0930\u0924\u0947 \u0938\u092E\u092F \u0906\u0927\u093E\u0930 \u092E\u093E\u0928 \u0915\u094B \u0938\u094D\u092A\u0937\u094D\u091F \u0930\u0916\u0947\u0902\u0964",
            "Total marks = {passMarksValue} x 100 / {passRate} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0938\u0939\u0940 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      complementOfTotal: {
        steps: [
          "\u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = 100 - {percentageRate} = {knownPercentage}%.",
          "\u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = {totalPopulation} x {knownPercentage} / 100 = {answer}.",
          "\u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "\u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = 100 - {percentageRate} = {knownPercentage}%.",
            "\u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = {totalPopulation} x {knownPercentage} / 100 = {answer}.",
            "\u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0926\u093F\u090F \u0917\u090F \u0938\u0902\u092C\u0902\u0927 \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0926\u0947\u0916\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = 100 - {percentageRate} = {knownPercentage}%.",
            "\u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = {totalPopulation} x {knownPercentage} / 100 = {answer}.",
            "\u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = 100 - {percentageRate} = {knownPercentage}%.",
            "\u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0915\u094B \u0938\u0902\u092C\u0902\u0927 \u092E\u0947\u0902 \u0930\u0916\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = {totalPopulation} x {knownPercentage} / 100 = {answer}.",
            "\u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0907\u0938 \u092A\u094D\u0930\u0915\u093E\u0930 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0905\u092C \u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0938\u0947 \u0917\u0923\u0928\u093E \u0915\u0930\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = 100 - {percentageRate} = {knownPercentage}%.",
            "\u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = {totalPopulation} x {knownPercentage} / 100 = {answer}.",
            "The calculation gives {answer}.",
            "\u0907\u0938\u0932\u093F\u090F, \u0905\u0902\u0924\u093F\u092E \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = 100 - {percentageRate} = {knownPercentage}%.",
            "\u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = {totalPopulation} x {knownPercentage} / 100 = {answer}.",
            "\u0938\u0930\u0932 \u0915\u0930\u0924\u0947 \u0938\u092E\u092F \u0906\u0927\u093E\u0930 \u092E\u093E\u0928 \u0915\u094B \u0938\u094D\u092A\u0937\u094D\u091F \u0930\u0916\u0947\u0902\u0964",
            "\u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0938\u0939\u0940 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      moreMarksBase: {
        steps: [
          "\u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: marks {marks} are {rate1}% more than the base.",
          "\u0907\u0938\u0932\u093F\u090F, {marks} represents {changedBase}% of the base.",
          "Base marks = {marks} x 100 / {changedBase} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "\u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: marks {marks} are {rate1}% more than the base.",
            "\u0907\u0938\u0932\u093F\u090F, {marks} represents {changedBase}% of the base.",
            "Base marks = {marks} x 100 / {changedBase} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0926\u093F\u090F \u0917\u090F \u0938\u0902\u092C\u0902\u0927 \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0926\u0947\u0916\u0947\u0902\u0964",
            "\u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: marks {marks} are {rate1}% more than the base.",
            "\u0907\u0938\u0932\u093F\u090F, {marks} represents {changedBase}% of the base.",
            "Base marks = {marks} x 100 / {changedBase} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: marks {marks} are {rate1}% more than the base.",
            "\u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0915\u094B \u0938\u0902\u092C\u0902\u0927 \u092E\u0947\u0902 \u0930\u0916\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F, {marks} represents {changedBase}% of the base.",
            "Base marks = {marks} x 100 / {changedBase} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0907\u0938 \u092A\u094D\u0930\u0915\u093E\u0930 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0905\u092C \u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0938\u0947 \u0917\u0923\u0928\u093E \u0915\u0930\u0947\u0902\u0964",
            "\u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: marks {marks} are {rate1}% more than the base.",
            "\u0907\u0938\u0932\u093F\u090F, {marks} represents {changedBase}% of the base.",
            "The calculation gives {answer}.",
            "\u0907\u0938\u0932\u093F\u090F, \u0905\u0902\u0924\u093F\u092E \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: marks {marks} are {rate1}% more than the base.",
            "\u0907\u0938\u0932\u093F\u090F, {marks} represents {changedBase}% of the base.",
            "\u0938\u0930\u0932 \u0915\u0930\u0924\u0947 \u0938\u092E\u092F \u0906\u0927\u093E\u0930 \u092E\u093E\u0928 \u0915\u094B \u0938\u094D\u092A\u0937\u094D\u091F \u0930\u0916\u0947\u0902\u0964",
            "Base marks = {marks} x 100 / {changedBase} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0938\u0939\u0940 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      twoShareRemainder: {
        steps: [
          "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
          "This remaining value is {value}.",
          "Total = {value} x 100 / {knownPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
            "This remaining value is {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0926\u093F\u090F \u0917\u090F \u0938\u0902\u092C\u0902\u0927 \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0926\u0947\u0916\u0947\u0902\u0964",
            "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
            "This remaining value is {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
            "\u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0915\u094B \u0938\u0902\u092C\u0902\u0927 \u092E\u0947\u0902 \u0930\u0916\u0947\u0902\u0964",
            "This remaining value is {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0907\u0938 \u092A\u094D\u0930\u0915\u093E\u0930 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0905\u092C \u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0938\u0947 \u0917\u0923\u0928\u093E \u0915\u0930\u0947\u0902\u0964",
            "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
            "This remaining value is {value}.",
            "The calculation gives {answer}.",
            "\u0907\u0938\u0932\u093F\u090F, \u0905\u0902\u0924\u093F\u092E \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
            "This remaining value is {value}.",
            "\u0938\u0930\u0932 \u0915\u0930\u0924\u0947 \u0938\u092E\u092F \u0906\u0927\u093E\u0930 \u092E\u093E\u0928 \u0915\u094B \u0938\u094D\u092A\u0937\u094D\u091F \u0930\u0916\u0947\u0902\u0964",
            "Total = {value} x 100 / {knownPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0938\u0939\u0940 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      loserVotes: {
        steps: [
          "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
          "Vote gap percentage = {gapPercentage}%.",
          "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0926\u093F\u090F \u0917\u090F \u0938\u0902\u092C\u0902\u0927 \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0926\u0947\u0916\u0947\u0902\u0964",
            "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
            "\u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0915\u094B \u0938\u0902\u092C\u0902\u0927 \u092E\u0947\u0902 \u0930\u0916\u0947\u0902\u0964",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0907\u0938 \u092A\u094D\u0930\u0915\u093E\u0930 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0905\u092C \u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0938\u0947 \u0917\u0923\u0928\u093E \u0915\u0930\u0947\u0902\u0964",
            "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "The calculation gives {answer}.",
            "\u0907\u0938\u0932\u093F\u090F, \u0905\u0902\u0924\u093F\u092E \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "\u0938\u0930\u0932 \u0915\u0930\u0924\u0947 \u0938\u092E\u092F \u0906\u0927\u093E\u0930 \u092E\u093E\u0928 \u0915\u094B \u0938\u094D\u092A\u0937\u094D\u091F \u0930\u0916\u0947\u0902\u0964",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0938\u0939\u0940 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      }
    }
  },
  "PCT-CP-006": {
    explanationId: "PCT-ES-006",
    taskExplanations: {
      mixturePercent: {
        steps: [
          "Use the unchanged component to form the percentage equation.",
          "Initial unchanged amount = {initialUnchangedAmount}.",
          "Final total or required change is found from the new percentage condition. \u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
          "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
          "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
        ],
        variants: [
          [
            "Use the unchanged component to form the percentage equation.",
            "Initial unchanged amount = {initialUnchangedAmount}.",
            "Final total or required change is found from the new percentage condition. \u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u092C \u0917\u0923\u0928\u093E \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0938\u0930\u0932 \u0915\u0930\u0947\u0902\u0964",
            "\u0907\u0938\u0932\u093F\u090F, \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0926\u093F\u090F \u0917\u090F \u0938\u0902\u092C\u0902\u0927 \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u0926\u0947\u0916\u0947\u0902\u0964",
            "Use the unchanged component to form the percentage equation.",
            "Initial unchanged amount = {initialUnchangedAmount}.",
            "Final total or required change is found from the new percentage condition. \u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "Use the unchanged component to form the percentage equation.",
            "\u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0915\u094B \u0938\u0902\u092C\u0902\u0927 \u092E\u0947\u0902 \u0930\u0916\u0947\u0902\u0964",
            "Initial unchanged amount = {initialUnchangedAmount}.",
            "Final total or required change is found from the new percentage condition. \u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0907\u0938 \u092A\u094D\u0930\u0915\u093E\u0930 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u092E\u093E\u0928 {answer} \u0939\u0948\u0964"
          ],
          [
            "\u0905\u092C \u0926\u093F\u090F \u0917\u090F \u092E\u093E\u0928\u094B\u0902 \u0938\u0947 \u0917\u0923\u0928\u093E \u0915\u0930\u0947\u0902\u0964",
            "Use the unchanged component to form the percentage equation.",
            "Initial unchanged amount = {initialUnchangedAmount}.",
            "The calculation gives {answer}.",
            "\u0907\u0938\u0932\u093F\u090F, \u0905\u0902\u0924\u093F\u092E \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ],
          [
            "Use the unchanged component to form the percentage equation.",
            "Initial unchanged amount = {initialUnchangedAmount}.",
            "\u0938\u0930\u0932 \u0915\u0930\u0924\u0947 \u0938\u092E\u092F \u0906\u0927\u093E\u0930 \u092E\u093E\u0928 \u0915\u094B \u0938\u094D\u092A\u0937\u094D\u091F \u0930\u0916\u0947\u0902\u0964",
            "Final total or required change is found from the new percentage condition. \u0907\u0938\u0932\u093F\u090F \u0907\u0938\u0932\u093F\u090F = {answer}. \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u093E\u0928: {answer}",
            "\u0905\u0924\u0903 \u0938\u0939\u0940 \u0909\u0924\u094D\u0924\u0930 {answer} \u0939\u0948\u0964"
          ]
        ]
      },
      dilutionAddWater: {
        aliasOf: "mixturePercent"
      },
      dryFromFresh: {
        aliasOf: "mixturePercent"
      },
      addSolute: {
        aliasOf: "mixturePercent"
      },
      dilutedPercent: {
        aliasOf: "mixturePercent"
      },
      freshFromDry: {
        aliasOf: "mixturePercent"
      },
      addPureComponent: {
        aliasOf: "mixturePercent"
      },
      evaporationOriginal: {
        aliasOf: "mixturePercent"
      },
      alloyComplement: {
        aliasOf: "mixturePercent"
      }
    }
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/explanation.pa.json
var explanation_pa_default = {
  "PCT-CP-001": {
    explanationId: "PCT-ES-001",
    taskExplanations: {
      percentOf: {
        steps: [
          "{baseValue} \u0A26\u0A3E {percentageRate}% \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A28\u0A3E \u0A39\u0A48\u0964",
          "{percentageRate}% = {percentageRate}/100\u0964",
          "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 {baseValue} x {percentageRate}/100 = {answer}\u0964",
          "\u0A39\u0A41\u0A23 \u0A07\u0A38 \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "{baseValue} \u0A26\u0A3E {percentageRate}% \u0A2A\u0A24\u0A3E \u0A15\u0A30\u0A28\u0A3E \u0A39\u0A48\u0964",
            "{percentageRate}% = {percentageRate}/100\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 {baseValue} x {percentageRate}/100 = {answer}\u0964",
            "\u0A39\u0A41\u0A23 \u0A07\u0A38 \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "{baseValue} \u0A26\u0A3E {percentageRate}% \u0A15\u0A71\u0A22\u0A23\u0A3E \u0A39\u0A48\u0964",
            "{percentageRate}% = {percentageRate}/100\u0964",
            "\u0A07\u0A38 \u0A32\u0A08 {baseValue} x {percentageRate}/100 = {answer}\u0964",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      directRelation: {
        aliasOf: "percentOf"
      },
      percentToFraction: {
        steps: [
          "{percentageRate}% \u0A28\u0A42\u0A70 100 \u0A26\u0A47 \u0A09\u0A71\u0A2A\u0A30 \u0A32\u0A3F\u0A16\u0A4B\u0964",
          "{percentageRate}% = {percentageRate}/100\u0964",
          "\u0A39\u0A41\u0A23 \u0A2D\u0A3F\u0A70\u0A28 \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A28 '\u0A24\u0A47 {answer} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
          "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "{percentageRate}% \u0A28\u0A42\u0A70 100 \u0A26\u0A47 \u0A09\u0A71\u0A2A\u0A30 \u0A32\u0A3F\u0A16\u0A4B\u0964",
            "{percentageRate}% = {percentageRate}/100\u0964",
            "\u0A39\u0A41\u0A23 \u0A2D\u0A3F\u0A70\u0A28 \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A28 '\u0A24\u0A47 {answer} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "{percentageRate}% \u0A28\u0A42\u0A70 100 \u0A26\u0A47 \u0A39\u0A30 \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A3F\u0A16\u0A4B\u0964",
            "{percentageRate}% = {percentageRate}/100\u0964",
            "\u0A39\u0A41\u0A23 \u0A07\u0A38 \u0A2D\u0A3F\u0A70\u0A28 \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A28 '\u0A24\u0A47 {answer} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      valueAsPercent: {
        steps: [
          "{value} \u0A28\u0A42\u0A70 {baseValue} \u0A26\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A3F\u0A16\u0A4B\u0964",
          "\u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 = {value} x 100 / {baseValue}\u0964",
          "\u0A39\u0A41\u0A23 \u0A2E\u0A41\u0A71\u0A32 \u0A30\u0A71\u0A16 \u0A15\u0A47 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
          "\u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A28 '\u0A24\u0A47 {answer} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
          "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "{value} \u0A28\u0A42\u0A70 {baseValue} \u0A26\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A3F\u0A16\u0A4B\u0964",
            "\u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 = {value} x 100 / {baseValue}\u0964",
            "\u0A39\u0A41\u0A23 \u0A2E\u0A41\u0A71\u0A32 \u0A30\u0A71\u0A16 \u0A15\u0A47 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "\u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A28 '\u0A24\u0A47 {answer} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "{value} \u0A28\u0A42\u0A70 {baseValue} \u0A26\u0A47 \u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 \u0A26\u0A47 \u0A30\u0A42\u0A2A \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A3F\u0A16\u0A4B\u0964",
            "\u0A2A\u0A4D\u0A30\u0A24\u0A40\u0A38\u0A3C\u0A24 = {value} x 100 / {baseValue}\u0964",
            "\u0A39\u0A41\u0A23 \u0A2E\u0A41\u0A71\u0A32 \u0A30\u0A71\u0A16 \u0A15\u0A47 \u0A39\u0A71\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A28 '\u0A24\u0A47 {answer} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      moreToLess: {
        steps: [
          "\u0A1B\u0A4B\u0A1F\u0A3E \u0A2E\u0A41\u0A71\u0A32 100 \u0A2E\u0A70\u0A28 \u0A32\u0A13\u0964",
          "\u0A24\u0A26 \u0A35\u0A71\u0A21\u0A3E \u0A2E\u0A41\u0A71\u0A32 100 + {percentageRate} \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E\u0964",
          "\u0A39\u0A41\u0A23 \u0A05\u0A70\u0A24\u0A30 \u0A28\u0A42\u0A70 \u0A35\u0A71\u0A21\u0A47 \u0A2E\u0A41\u0A71\u0A32 '\u0A24\u0A47 \u0A32\u0A13\u0964",
          "\u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A28 '\u0A24\u0A47 {answer} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
          "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "\u0A1B\u0A4B\u0A1F\u0A3E \u0A2E\u0A41\u0A71\u0A32 100 \u0A2E\u0A70\u0A28 \u0A32\u0A13\u0964",
            "\u0A24\u0A26 \u0A35\u0A71\u0A21\u0A3E \u0A2E\u0A41\u0A71\u0A32 100 + {percentageRate} \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E\u0964",
            "\u0A39\u0A41\u0A23 \u0A05\u0A70\u0A24\u0A30 \u0A28\u0A42\u0A70 \u0A35\u0A71\u0A21\u0A47 \u0A2E\u0A41\u0A71\u0A32 '\u0A24\u0A47 \u0A32\u0A13\u0964",
            "\u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A28 '\u0A24\u0A47 {answer} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A1B\u0A4B\u0A1F\u0A47 \u0A2E\u0A41\u0A71\u0A32 \u0A28\u0A42\u0A70 100 \u0A2E\u0A70\u0A28 \u0A32\u0A13\u0964",
            "\u0A24\u0A26 \u0A35\u0A71\u0A21\u0A3E \u0A2E\u0A41\u0A71\u0A32 100 + {percentageRate} \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E\u0964",
            "\u0A39\u0A41\u0A23 \u0A05\u0A70\u0A24\u0A30 \u0A28\u0A42\u0A70 \u0A35\u0A71\u0A21\u0A47 \u0A2E\u0A41\u0A71\u0A32 \u0A26\u0A47 \u0A06\u0A27\u0A3E\u0A30 \u0A24\u0A47 \u0A32\u0A13\u0964",
            "\u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A28 '\u0A24\u0A47 {answer} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      lessToMore: {
        steps: [
          "\u0A35\u0A71\u0A21\u0A3E \u0A2E\u0A41\u0A71\u0A32 100 \u0A2E\u0A70\u0A28 \u0A32\u0A13\u0964",
          "\u0A24\u0A26 \u0A1B\u0A4B\u0A1F\u0A3E \u0A2E\u0A41\u0A71\u0A32 100 - {percentageRate} \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E\u0964",
          "\u0A39\u0A41\u0A23 \u0A05\u0A70\u0A24\u0A30 \u0A28\u0A42\u0A70 \u0A1B\u0A4B\u0A1F\u0A47 \u0A2E\u0A41\u0A71\u0A32 '\u0A24\u0A47 \u0A32\u0A13\u0964",
          "\u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A28 '\u0A24\u0A47 {answer} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
          "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "\u0A35\u0A71\u0A21\u0A3E \u0A2E\u0A41\u0A71\u0A32 100 \u0A2E\u0A70\u0A28 \u0A32\u0A13\u0964",
            "\u0A24\u0A26 \u0A1B\u0A4B\u0A1F\u0A3E \u0A2E\u0A41\u0A71\u0A32 100 - {percentageRate} \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E\u0964",
            "\u0A39\u0A41\u0A23 \u0A05\u0A70\u0A24\u0A30 \u0A28\u0A42\u0A70 \u0A1B\u0A4B\u0A1F\u0A47 \u0A2E\u0A41\u0A71\u0A32 '\u0A24\u0A47 \u0A32\u0A13\u0964",
            "\u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A28 '\u0A24\u0A47 {answer} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A35\u0A71\u0A21\u0A47 \u0A2E\u0A41\u0A71\u0A32 \u0A28\u0A42\u0A70 100 \u0A2E\u0A70\u0A28 \u0A32\u0A13\u0964",
            "\u0A24\u0A26 \u0A1B\u0A4B\u0A1F\u0A3E \u0A2E\u0A41\u0A71\u0A32 100 - {percentageRate} \u0A39\u0A4B\u0A35\u0A47\u0A17\u0A3E\u0964",
            "\u0A39\u0A41\u0A23 \u0A05\u0A70\u0A24\u0A30 \u0A28\u0A42\u0A70 \u0A1B\u0A4B\u0A1F\u0A47 \u0A2E\u0A41\u0A71\u0A32 \u0A26\u0A47 \u0A06\u0A27\u0A3E\u0A30 \u0A24\u0A47 \u0A32\u0A13\u0964",
            "\u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A28 '\u0A24\u0A47 {answer} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      ratioFromPercentEquality: {
        steps: [
          "A \u0A26\u0A3E {rate1}%, B \u0A26\u0A47 {rate2}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48\u0964",
          "\u0A26\u0A4B\u0A35\u0A47\u0A02 \u0A2A\u0A3E\u0A38\u0A3F\u0A06\u0A02 \u0A28\u0A42\u0A70 \u0A05\u0A28\u0A41\u0A2A\u0A3E\u0A24 \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A3F\u0A16\u0A4B\u0964",
          "\u0A07\u0A38 \u0A32\u0A08 A:B = {rate2}:{rate1}\u0964",
          "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A28 '\u0A24\u0A47 {answer} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
          "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "A \u0A26\u0A3E {rate1}%, B \u0A26\u0A47 {rate2}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48\u0964",
            "\u0A26\u0A4B\u0A35\u0A47\u0A02 \u0A2A\u0A3E\u0A38\u0A3F\u0A06\u0A02 \u0A28\u0A42\u0A70 \u0A05\u0A28\u0A41\u0A2A\u0A3E\u0A24 \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A3F\u0A16\u0A4B\u0964",
            "\u0A07\u0A38 \u0A32\u0A08 A:B = {rate2}:{rate1}\u0964",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A28 '\u0A24\u0A47 {answer} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "A \u0A26\u0A3E {rate1}%, B \u0A26\u0A47 {rate2}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48\u0964",
            "\u0A39\u0A41\u0A23 \u0A26\u0A4B\u0A35\u0A47\u0A02 \u0A2A\u0A3E\u0A38\u0A3F\u0A06\u0A02 \u0A28\u0A42\u0A70 \u0A05\u0A28\u0A41\u0A2A\u0A3E\u0A24 \u0A26\u0A47 \u0A30\u0A42\u0A2A \u0A35\u0A3F\u0A71\u0A1A \u0A32\u0A3F\u0A16\u0A4B\u0964",
            "\u0A07\u0A38 \u0A32\u0A08 A:B = {rate2}:{rate1}\u0964",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A28 '\u0A24\u0A47 {answer} \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      reversePercent: {
        steps: [
          "{percentageRate}% = {value} \u0A26\u0A3F\u0A71\u0A24\u0A3E \u0A39\u0A48\u0964",
          "\u0A07\u0A38 \u0A32\u0A08 1% = {value} / {percentageRate}\u0964",
          "\u0A39\u0A41\u0A23 100% \u0A32\u0A08 100 \u0A28\u0A3E\u0A32 \u0A17\u0A41\u0A23\u0A3E \u0A15\u0A30\u0A4B\u0964",
          "\u0A07\u0A38 \u0A32\u0A08 100% = {value} x 100 / {percentageRate} = {answer}\u0964",
          "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "{percentageRate}% = {value} \u0A26\u0A3F\u0A71\u0A24\u0A3E \u0A39\u0A48\u0964",
            "\u0A07\u0A38 \u0A32\u0A08 1% = {value} / {percentageRate}\u0964",
            "\u0A39\u0A41\u0A23 100% \u0A32\u0A08 100 \u0A28\u0A3E\u0A32 \u0A17\u0A41\u0A23\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "\u0A07\u0A38 \u0A32\u0A08 100% = {value} x 100 / {percentageRate} = {answer}\u0964",
            "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "{percentageRate}% = {value} \u0A26\u0A3F\u0A71\u0A24\u0A3E \u0A39\u0A48\u0964",
            "\u0A07\u0A38 \u0A32\u0A08 1% = {value} / {percentageRate}\u0964",
            "\u0A39\u0A41\u0A23 100% \u0A15\u0A71\u0A22\u0A23 \u0A32\u0A08 100 \u0A28\u0A3E\u0A32 \u0A17\u0A41\u0A23\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 100% = {value} x 100 / {percentageRate} = {answer}\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      }
    }
  },
  "PCT-CP-002": {
    explanationId: "PCT-ES-002",
    taskExplanations: {
      increaseNewValue: {
        steps: [
          "\u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 {baseValue} \u0A39\u0A48\u0964",
          "\u0A35\u0A3E\u0A27\u0A3E = {baseValue} \u0A26\u0A3E {percentageRate}% = {changeAmount}\u0964",
          "\u0A28\u0A35\u0A3E\u0A02 \u0A2E\u0A41\u0A71\u0A32 = {baseValue} + {changeAmount} = {answer}\u0964",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "\u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 {baseValue} \u0A39\u0A48\u0964",
            "\u0A35\u0A3E\u0A27\u0A3E = {baseValue} \u0A26\u0A3E {percentageRate}% = {changeAmount}\u0964",
            "\u0A28\u0A35\u0A3E\u0A02 \u0A2E\u0A41\u0A71\u0A32 = {baseValue} + {changeAmount} = {answer}\u0964",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A26\u0A3F\u0A71\u0A24\u0A3E \u0A17\u0A3F\u0A06 \u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 {baseValue} \u0A39\u0A48\u0964",
            "\u0A07\u0A38 \u0A09\u0A71\u0A24\u0A47 {percentageRate}% \u0A35\u0A3E\u0A27\u0A3E \u0A15\u0A30\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A3E\u0A27\u0A47 \u0A26\u0A40 \u0A30\u0A15\u0A2E {changeAmount} \u0A2E\u0A3F\u0A32\u0A26\u0A40 \u0A39\u0A48\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A28\u0A35\u0A3E\u0A02 \u0A2E\u0A41\u0A71\u0A32 = {baseValue} + {changeAmount} = {answer}\u0964",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      decreaseNewValue: {
        steps: [
          "\u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 {baseValue} \u0A39\u0A48\u0964",
          "\u0A15\u0A2E\u0A40 = {baseValue} \u0A26\u0A3E {percentageRate}% = {changeAmount}\u0964",
          "\u0A28\u0A35\u0A3E\u0A02 \u0A2E\u0A41\u0A71\u0A32 = {baseValue} - {changeAmount} = {answer}\u0964",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "\u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 {baseValue} \u0A39\u0A48\u0964",
            "\u0A15\u0A2E\u0A40 = {baseValue} \u0A26\u0A3E {percentageRate}% = {changeAmount}\u0964",
            "\u0A28\u0A35\u0A3E\u0A02 \u0A2E\u0A41\u0A71\u0A32 = {baseValue} - {changeAmount} = {answer}\u0964",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A26\u0A3F\u0A71\u0A24\u0A3E \u0A17\u0A3F\u0A06 \u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 {baseValue} \u0A39\u0A48\u0964",
            "\u0A07\u0A38 \u0A35\u0A3F\u0A71\u0A1A {percentageRate}% \u0A15\u0A2E\u0A40 \u0A15\u0A30\u0A28 \u0A28\u0A3E\u0A32 \u0A15\u0A2E\u0A40 \u0A26\u0A40 \u0A30\u0A15\u0A2E {changeAmount} \u0A2E\u0A3F\u0A32\u0A26\u0A40 \u0A39\u0A48\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A28\u0A35\u0A3E\u0A02 \u0A2E\u0A41\u0A71\u0A32 = {baseValue} - {changeAmount} = {answer}\u0964",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      reverseIncrease: {
        steps: [
          "{percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A2E\u0A41\u0A71\u0A32 {finalValue} \u0A2C\u0A23 \u0A1C\u0A3E\u0A02\u0A26\u0A3E \u0A39\u0A48\u0964",
          "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A07\u0A39 \u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 \u0A26\u0A3E {changedBase}% \u0A39\u0A48\u0964",
          "\u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 = {finalValue} x 100 / {changedBase} = {answer}\u0964",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "{percentageRate}% \u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A2E\u0A41\u0A71\u0A32 {finalValue} \u0A2C\u0A23 \u0A1C\u0A3E\u0A02\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A07\u0A39 \u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 \u0A26\u0A3E {changedBase}% \u0A39\u0A48\u0964",
            "\u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 = {finalValue} x 100 / {changedBase} = {answer}\u0964",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A35\u0A3E\u0A27\u0A47 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A2E\u0A3F\u0A32\u0A3F\u0A06 \u0A2E\u0A41\u0A71\u0A32 {finalValue} \u0A26\u0A3F\u0A71\u0A24\u0A3E \u0A39\u0A48\u0964",
            "\u0A07\u0A39 \u0A2A\u0A41\u0A30\u0A3E\u0A23\u0A47 \u0A2E\u0A41\u0A71\u0A32 \u0A26\u0A47 {changedBase}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48\u0964",
            "\u0A07\u0A38 \u0A32\u0A08 \u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 = {finalValue} x 100 / {changedBase} = {answer}\u0964",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      reverseDecrease: {
        steps: [
          "{percentageRate}% \u0A15\u0A2E\u0A40 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A2E\u0A41\u0A71\u0A32 {finalValue} \u0A30\u0A39\u0A3F \u0A1C\u0A3E\u0A02\u0A26\u0A3E \u0A39\u0A48\u0964",
          "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A07\u0A39 \u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 \u0A26\u0A3E {changedBase}% \u0A39\u0A48\u0964",
          "\u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 = {finalValue} x 100 / {changedBase} = {answer}\u0964",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "{percentageRate}% \u0A15\u0A2E\u0A40 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A2E\u0A41\u0A71\u0A32 {finalValue} \u0A30\u0A39\u0A3F \u0A1C\u0A3E\u0A02\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A07\u0A39 \u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 \u0A26\u0A3E {changedBase}% \u0A39\u0A48\u0964",
            "\u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 = {finalValue} x 100 / {changedBase} = {answer}\u0964",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A15\u0A2E\u0A40 \u0A24\u0A4B\u0A02 \u0A2C\u0A3E\u0A05\u0A26 \u0A2E\u0A3F\u0A32\u0A3F\u0A06 \u0A2E\u0A41\u0A71\u0A32 {finalValue} \u0A26\u0A3F\u0A71\u0A24\u0A3E \u0A39\u0A48\u0964",
            "\u0A07\u0A39 \u0A2A\u0A41\u0A30\u0A3E\u0A23\u0A47 \u0A2E\u0A41\u0A71\u0A32 \u0A26\u0A47 {changedBase}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48\u0964",
            "\u0A07\u0A38 \u0A32\u0A08 \u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 = {finalValue} x 100 / {changedBase} = {answer}\u0964",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      increaseByAmount: {
        steps: [
          "\u0A35\u0A3E\u0A27\u0A47 \u0A26\u0A40 \u0A30\u0A15\u0A2E {value} \u0A39\u0A48\u0964",
          "\u0A07\u0A39 \u0A30\u0A15\u0A2E \u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 \u0A26\u0A47 {percentageRate}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48\u0964",
          "\u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 = {value} x 100 / {percentageRate} = {answer}\u0964",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "\u0A35\u0A3E\u0A27\u0A47 \u0A26\u0A40 \u0A30\u0A15\u0A2E {value} \u0A39\u0A48\u0964",
            "\u0A07\u0A39 \u0A30\u0A15\u0A2E \u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 \u0A26\u0A47 {percentageRate}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48\u0964",
            "\u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 = {value} x 100 / {percentageRate} = {answer}\u0964",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "{value} \u0A09\u0A39 \u0A35\u0A3E\u0A27\u0A3E \u0A39\u0A48 \u0A1C\u0A4B {percentageRate}% \u0A26\u0A47 \u0A2C\u0A30\u0A3E\u0A2C\u0A30 \u0A39\u0A48\u0964",
            "\u0A07\u0A38 \u0A32\u0A08 {percentageRate}% = {value} \u0A2E\u0A70\u0A28\u0A3F\u0A06 \u0A1C\u0A3E\u0A35\u0A47\u0A17\u0A3E\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A2E\u0A42\u0A32 \u0A2E\u0A41\u0A71\u0A32 = {value} x 100 / {percentageRate} = {answer}\u0964",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      percentOfKnownNumber: {
        steps: [
          "\u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A26\u0A3E {rate1}% = {value1} \u0A26\u0A3F\u0A71\u0A24\u0A3E \u0A39\u0A48\u0964",
          "\u0A09\u0A38\u0A47 \u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A26\u0A3E {rate2}% \u0A15\u0A71\u0A22\u0A23\u0A3E \u0A39\u0A48\u0964",
          "\u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 = {value1} x {rate2} / {rate1} = {answer}\u0964",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "\u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A26\u0A3E {rate1}% = {value1} \u0A26\u0A3F\u0A71\u0A24\u0A3E \u0A39\u0A48\u0964",
            "\u0A09\u0A38\u0A47 \u0A38\u0A70\u0A16\u0A3F\u0A06 \u0A26\u0A3E {rate2}% \u0A15\u0A71\u0A22\u0A23\u0A3E \u0A39\u0A48\u0964",
            "\u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 = {value1} x {rate2} / {rate1} = {answer}\u0964",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "{rate1}% \u0A32\u0A08 \u0A2E\u0A41\u0A71\u0A32 {value1} \u0A26\u0A3F\u0A71\u0A24\u0A3E \u0A39\u0A48\u0964",
            "\u0A39\u0A41\u0A23 \u0A07\u0A38\u0A47 \u0A06\u0A27\u0A3E\u0A30 \u0A09\u0A71\u0A24\u0A47 {rate2}% \u0A15\u0A71\u0A22\u0A4B\u0964",
            "\u0A07\u0A38 \u0A32\u0A08 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 = {value1} x {rate2} / {rate1} = {answer}\u0964",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A32\u0A08 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      differenceOfPercents: {
        steps: [
          "{rate1}% ??? {rate2}% ?? ???? = {percentDifference}% ???",
          "?? ???? {value} ?? ????? ???",
          "??? ????? = {value} x 100 / {percentDifference} = {answer}?",
          "??? ??? ?? ??? ???? ????? ???",
          "???? {answer} ???"
        ]
      },
      restoreAfterDecrease: {
        steps: [
          "???? ???????? = 100 - {percentageRate} = {remainingBase}%?",
          "??????? ???? ?? = {percentageRate} x 100 / {remainingBase}?",
          "??????? ???? ?? = {answer}?",
          "??? ??? ?? ??? ???? ????? ???",
          "???? {answer} ???"
        ]
      }
    }
  },
  "PCT-CP-003": {
    explanationId: "PCT-ES-003",
    taskExplanations: {
      successiveChange: {
        steps: [
          "????? ???? = {firstFactor}?",
          "???? ???? = {secondFactor}?",
          "???? ???? = {netFactor}?",
          "???? ???????? ????? = {answer}?",
          "???? {answer} ???"
        ]
      },
      successiveIncrease: {
        aliasOf: "successiveChange"
      },
      compoundGrowth: {
        steps: [
          "???????? ???? = {initialValue}?",
          "??? ???? ?? ???? ???? = {singleFactor}?",
          "?? ?????? ??? ???? ???? = {initialValue} x {singleFactor} x {singleFactor}?",
          "??? ??? ?? {answer} ????? ???",
          "???? {answer} ???"
        ]
      },
      compoundDecay: {
        steps: [
          "???????? ???? = {initialValue}?",
          "??? ???? ?? ???? ???? = {singleFactor}?",
          "?? ?????? ??? ???? ???? = {initialValue} x {singleFactor} x {singleFactor}?",
          "??? ??? ?? {answer} ????? ???",
          "???? {answer} ???"
        ]
      },
      areaChange: {
        aliasOf: "successiveChange"
      },
      squareAreaChange: {
        steps: [
          "????? ????? = {percentageRate}%?",
          "?????? ???? = {singleFactor} x {singleFactor}?",
          "???? ???????? ????? = {answer}?",
          "??? ??? ?? ??? ???? ????? ???",
          "???? {answer} ???"
        ]
      }
    }
  },
  "PCT-CP-004": {
    explanationId: "PCT-ES-004",
    taskExplanations: {
      productInvariance: {
        steps: [
          "?????? ???? ???",
          "???? ???? ???? ????? ???? ???????",
          "??????? ???????? = {percentageRate} x 100 / {changedBase}?",
          "??? ??? ?? {answer} ????? ???",
          "???? {answer} ???"
        ]
      },
      invarianceDecrease: {
        aliasOf: "productInvariance"
      },
      invarianceIncrease: {
        aliasOf: "productInvariance"
      },
      restoreAfterIncrease: {
        aliasOf: "productInvariance"
      },
      revenueChange: {
        steps: [
          "???? ????, ???? ??? ????? ?? ????? ???? ???",
          "???? ???? = {firstFactor}?",
          "????? ???? = {secondFactor}?",
          "???? ???????? ????? = {answer}?",
          "???? {answer} ???"
        ]
      },
      circleAreaDecrease: {
        steps: [
          "?????? ??????? ?? ??? ?? ????? ???? ???",
          "???? ??????? ?? ???? = {singleFactor}?",
          "?????? ???? ???? = {answer}?",
          "??? ??? ?? ??? ???? ????? ???",
          "???? {answer} ???"
        ]
      }
    }
  },
  "PCT-CP-005": {
    explanationId: "PCT-ES-005",
    taskExplanations: {
      partToTotal: {
        steps: [
          "The given part {value} represents {knownPercentage}% of the total.",
          "Total = {value} x 100 / {knownPercentage}.",
          "Total = {answer}.",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "The given part {value} represents {knownPercentage}% of the total.",
            "Total = {value} x 100 / {knownPercentage}.",
            "Total = {answer}.",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
            "The given part {value} represents {knownPercentage}% of the total.",
            "Total = {value} x 100 / {knownPercentage}.",
            "Total = {answer}.",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "The given part {value} represents {knownPercentage}% of the total.",
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A42\u0A70 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A35\u0A3F\u0A71\u0A1A \u0A30\u0A71\u0A16\u0A4B\u0964",
            "Total = {value} x 100 / {knownPercentage}.",
            "Total = {answer}.",
            "\u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24 \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "The given part {value} represents {knownPercentage}% of the total.",
            "Total = {value} x 100 / {knownPercentage}.",
            "The calculation gives {answer}.",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A05\u0A70\u0A24\u0A3F\u0A2E \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "The given part {value} represents {knownPercentage}% of the total.",
            "Total = {value} x 100 / {knownPercentage}.",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A26\u0A47 \u0A38\u0A2E\u0A47\u0A02 \u0A06\u0A27\u0A3E\u0A30 \u0A2E\u0A41\u0A71\u0A32 \u0A28\u0A42\u0A70 \u0A38\u0A2A\u0A71\u0A36\u0A1F \u0A30\u0A71\u0A16\u0A4B\u0964",
            "Total = {answer}.",
            "\u0A05\u0A24\u0A47 \u0A38\u0A39\u0A40 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      incomePartition: {
        steps: [
          "Remaining percentage after all given parts = {knownPercentage}%.",
          "This remaining part equals {value}.",
          "Total = {value} x 100 / {knownPercentage} = {answer}.",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "Remaining percentage after all given parts = {knownPercentage}%.",
            "This remaining part equals {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}.",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
            "Remaining percentage after all given parts = {knownPercentage}%.",
            "This remaining part equals {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}.",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "Remaining percentage after all given parts = {knownPercentage}%.",
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A42\u0A70 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A35\u0A3F\u0A71\u0A1A \u0A30\u0A71\u0A16\u0A4B\u0964",
            "This remaining part equals {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}.",
            "\u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24 \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "Remaining percentage after all given parts = {knownPercentage}%.",
            "This remaining part equals {value}.",
            "The calculation gives {answer}.",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A05\u0A70\u0A24\u0A3F\u0A2E \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "Remaining percentage after all given parts = {knownPercentage}%.",
            "This remaining part equals {value}.",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A26\u0A47 \u0A38\u0A2E\u0A47\u0A02 \u0A06\u0A27\u0A3E\u0A30 \u0A2E\u0A41\u0A71\u0A32 \u0A28\u0A42\u0A70 \u0A38\u0A2A\u0A71\u0A36\u0A1F \u0A30\u0A71\u0A16\u0A4B\u0964",
            "Total = {value} x 100 / {knownPercentage} = {answer}.",
            "\u0A05\u0A24\u0A47 \u0A38\u0A39\u0A40 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      successiveExpense: {
        steps: [
          "First remaining factor = {firstFactor}.",
          "Second remaining factor = {secondFactor}.",
          "Final amount {value} equals original x {netFactor}. Original value = {answer}.",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "First remaining factor = {firstFactor}.",
            "Second remaining factor = {secondFactor}.",
            "Final amount {value} equals original x {netFactor}. Original value = {answer}.",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
            "First remaining factor = {firstFactor}.",
            "Second remaining factor = {secondFactor}.",
            "Final amount {value} equals original x {netFactor}. Original value = {answer}.",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "First remaining factor = {firstFactor}.",
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A42\u0A70 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A35\u0A3F\u0A71\u0A1A \u0A30\u0A71\u0A16\u0A4B\u0964",
            "Second remaining factor = {secondFactor}.",
            "Final amount {value} equals original x {netFactor}. Original value = {answer}.",
            "\u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24 \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "First remaining factor = {firstFactor}.",
            "Second remaining factor = {secondFactor}.",
            "The calculation gives {answer}.",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A05\u0A70\u0A24\u0A3F\u0A2E \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "First remaining factor = {firstFactor}.",
            "Second remaining factor = {secondFactor}.",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A26\u0A47 \u0A38\u0A2E\u0A47\u0A02 \u0A06\u0A27\u0A3E\u0A30 \u0A2E\u0A41\u0A71\u0A32 \u0A28\u0A42\u0A70 \u0A38\u0A2A\u0A71\u0A36\u0A1F \u0A30\u0A71\u0A16\u0A4B\u0964",
            "Final amount {value} equals original x {netFactor}. Original value = {answer}.",
            "\u0A05\u0A24\u0A47 \u0A38\u0A39\u0A40 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      winnerVotes: {
        steps: [
          "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
          "Vote gap percentage = {gapPercentage}%.",
          "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
            "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A42\u0A70 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A35\u0A3F\u0A71\u0A1A \u0A30\u0A71\u0A16\u0A4B\u0964",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
            "\u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24 \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "The calculation gives {answer}.",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A05\u0A70\u0A24\u0A3F\u0A2E \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "Winner gets {percentageRate}% votes, so loser gets {loserPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A26\u0A47 \u0A38\u0A2E\u0A47\u0A02 \u0A06\u0A27\u0A3E\u0A30 \u0A2E\u0A41\u0A71\u0A32 \u0A28\u0A42\u0A70 \u0A38\u0A2A\u0A71\u0A36\u0A1F \u0A30\u0A71\u0A16\u0A4B\u0964",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
            "\u0A05\u0A24\u0A47 \u0A38\u0A39\u0A40 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      cancelledVotes: {
        steps: [
          "Valid vote percentage = {validPercentage}%.",
          "Winner-loser gap among valid votes = {gapPercentage}%.",
          "Actual gap on total votes = {effectiveGapPercentage}%. Total votes = {voteDifference} x 100 / {effectiveGapPercentage} = {answer}.",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "Valid vote percentage = {validPercentage}%.",
            "Winner-loser gap among valid votes = {gapPercentage}%.",
            "Actual gap on total votes = {effectiveGapPercentage}%. Total votes = {voteDifference} x 100 / {effectiveGapPercentage} = {answer}.",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
            "Valid vote percentage = {validPercentage}%.",
            "Winner-loser gap among valid votes = {gapPercentage}%.",
            "Actual gap on total votes = {effectiveGapPercentage}%. Total votes = {voteDifference} x 100 / {effectiveGapPercentage} = {answer}.",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "Valid vote percentage = {validPercentage}%.",
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A42\u0A70 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A35\u0A3F\u0A71\u0A1A \u0A30\u0A71\u0A16\u0A4B\u0964",
            "Winner-loser gap among valid votes = {gapPercentage}%.",
            "Actual gap on total votes = {effectiveGapPercentage}%. Total votes = {voteDifference} x 100 / {effectiveGapPercentage} = {answer}.",
            "\u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24 \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "Valid vote percentage = {validPercentage}%.",
            "Winner-loser gap among valid votes = {gapPercentage}%.",
            "The calculation gives {answer}.",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A05\u0A70\u0A24\u0A3F\u0A2E \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "Valid vote percentage = {validPercentage}%.",
            "Winner-loser gap among valid votes = {gapPercentage}%.",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A26\u0A47 \u0A38\u0A2E\u0A47\u0A02 \u0A06\u0A27\u0A3E\u0A30 \u0A2E\u0A41\u0A71\u0A32 \u0A28\u0A42\u0A70 \u0A38\u0A2A\u0A71\u0A36\u0A1F \u0A30\u0A71\u0A16\u0A4B\u0964",
            "Actual gap on total votes = {effectiveGapPercentage}%. Total votes = {voteDifference} x 100 / {effectiveGapPercentage} = {answer}.",
            "\u0A05\u0A24\u0A47 \u0A38\u0A39\u0A40 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      passMarks: {
        steps: [
          "Passing marks = marks obtained + fail margin = {passMarksValue}.",
          "This is {passRate}% of total marks.",
          "Total marks = {passMarksValue} x 100 / {passRate} = {answer}.",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "Passing marks = marks obtained + fail margin = {passMarksValue}.",
            "This is {passRate}% of total marks.",
            "Total marks = {passMarksValue} x 100 / {passRate} = {answer}.",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
            "Passing marks = marks obtained + fail margin = {passMarksValue}.",
            "This is {passRate}% of total marks.",
            "Total marks = {passMarksValue} x 100 / {passRate} = {answer}.",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "Passing marks = marks obtained + fail margin = {passMarksValue}.",
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A42\u0A70 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A35\u0A3F\u0A71\u0A1A \u0A30\u0A71\u0A16\u0A4B\u0964",
            "This is {passRate}% of total marks.",
            "Total marks = {passMarksValue} x 100 / {passRate} = {answer}.",
            "\u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24 \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "Passing marks = marks obtained + fail margin = {passMarksValue}.",
            "This is {passRate}% of total marks.",
            "The calculation gives {answer}.",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A05\u0A70\u0A24\u0A3F\u0A2E \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "Passing marks = marks obtained + fail margin = {passMarksValue}.",
            "This is {passRate}% of total marks.",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A26\u0A47 \u0A38\u0A2E\u0A47\u0A02 \u0A06\u0A27\u0A3E\u0A30 \u0A2E\u0A41\u0A71\u0A32 \u0A28\u0A42\u0A70 \u0A38\u0A2A\u0A71\u0A36\u0A1F \u0A30\u0A71\u0A16\u0A4B\u0964",
            "Total marks = {passMarksValue} x 100 / {passRate} = {answer}.",
            "\u0A05\u0A24\u0A47 \u0A38\u0A39\u0A40 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      complementOfTotal: {
        steps: [
          "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
          "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
          "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A28 \u0A24\u0A47 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A28\u0A24\u0A40\u0A1C\u0A3E \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A28 \u0A24\u0A47 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A28\u0A24\u0A40\u0A1C\u0A3E \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A28 \u0A24\u0A47 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A28\u0A24\u0A40\u0A1C\u0A3E \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A42\u0A70 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A35\u0A3F\u0A71\u0A1A \u0A30\u0A71\u0A16\u0A4B\u0964",
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A28 \u0A24\u0A47 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A28\u0A24\u0A40\u0A1C\u0A3E \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24 \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "The calculation gives {answer}.",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A05\u0A70\u0A24\u0A3F\u0A2E \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A26\u0A47 \u0A38\u0A2E\u0A47\u0A02 \u0A06\u0A27\u0A3E\u0A30 \u0A2E\u0A41\u0A71\u0A32 \u0A28\u0A42\u0A70 \u0A38\u0A2A\u0A71\u0A36\u0A1F \u0A30\u0A71\u0A16\u0A4B\u0964",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A28 \u0A24\u0A47 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A28\u0A24\u0A40\u0A1C\u0A3E \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A05\u0A24\u0A47 \u0A38\u0A39\u0A40 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      moreMarksBase: {
        steps: [
          "Base marks = {marks} x 100 / {changedBase} = {answer}.",
          "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
          "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A28 \u0A24\u0A47 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A28\u0A24\u0A40\u0A1C\u0A3E \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "Base marks = {marks} x 100 / {changedBase} = {answer}.",
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A28 \u0A24\u0A47 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A28\u0A24\u0A40\u0A1C\u0A3E \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
            "Base marks = {marks} x 100 / {changedBase} = {answer}.",
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A28 \u0A24\u0A47 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A28\u0A24\u0A40\u0A1C\u0A3E \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "Base marks = {marks} x 100 / {changedBase} = {answer}.",
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A42\u0A70 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A35\u0A3F\u0A71\u0A1A \u0A30\u0A71\u0A16\u0A4B\u0964",
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A28 \u0A24\u0A47 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A28\u0A24\u0A40\u0A1C\u0A3E \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24 \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "Base marks = {marks} x 100 / {changedBase} = {answer}.",
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "The calculation gives {answer}.",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A05\u0A70\u0A24\u0A3F\u0A2E \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "Base marks = {marks} x 100 / {changedBase} = {answer}.",
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A26\u0A47 \u0A38\u0A2E\u0A47\u0A02 \u0A06\u0A27\u0A3E\u0A30 \u0A2E\u0A41\u0A71\u0A32 \u0A28\u0A42\u0A70 \u0A38\u0A2A\u0A71\u0A36\u0A1F \u0A30\u0A71\u0A16\u0A4B\u0964",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A28 \u0A24\u0A47 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A28\u0A24\u0A40\u0A1C\u0A3E \u0A2E\u0A3F\u0A32\u0A26\u0A3E \u0A39\u0A48\u0964",
            "\u0A05\u0A24\u0A47 \u0A38\u0A39\u0A40 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      twoShareRemainder: {
        steps: [
          "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
          "This remaining value is {value}.",
          "Total = {value} x 100 / {knownPercentage} = {answer}.",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
            "This remaining value is {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}.",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
            "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
            "This remaining value is {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}.",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A42\u0A70 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A35\u0A3F\u0A71\u0A1A \u0A30\u0A71\u0A16\u0A4B\u0964",
            "This remaining value is {value}.",
            "Total = {value} x 100 / {knownPercentage} = {answer}.",
            "\u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24 \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
            "This remaining value is {value}.",
            "The calculation gives {answer}.",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A05\u0A70\u0A24\u0A3F\u0A2E \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "Remaining percentage = 100 - {rate1} - {rate2} = {knownPercentage}%.",
            "This remaining value is {value}.",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A26\u0A47 \u0A38\u0A2E\u0A47\u0A02 \u0A06\u0A27\u0A3E\u0A30 \u0A2E\u0A41\u0A71\u0A32 \u0A28\u0A42\u0A70 \u0A38\u0A2A\u0A71\u0A36\u0A1F \u0A30\u0A71\u0A16\u0A4B\u0964",
            "Total = {value} x 100 / {knownPercentage} = {answer}.",
            "\u0A05\u0A24\u0A47 \u0A38\u0A39\u0A40 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      loserVotes: {
        steps: [
          "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
          "Vote gap percentage = {gapPercentage}%.",
          "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
            "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A42\u0A70 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A35\u0A3F\u0A71\u0A1A \u0A30\u0A71\u0A16\u0A4B\u0964",
            "Vote gap percentage = {gapPercentage}%.",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
            "\u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24 \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "The calculation gives {answer}.",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A05\u0A70\u0A24\u0A3F\u0A2E \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "Loser gets {rate1}% votes, so winner gets {winnerPercentage}%.",
            "Vote gap percentage = {gapPercentage}%.",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A26\u0A47 \u0A38\u0A2E\u0A47\u0A02 \u0A06\u0A27\u0A3E\u0A30 \u0A2E\u0A41\u0A71\u0A32 \u0A28\u0A42\u0A70 \u0A38\u0A2A\u0A71\u0A36\u0A1F \u0A30\u0A71\u0A16\u0A4B\u0964",
            "Total votes = {voteDifference} x 100 / {gapPercentage} = {answer}.",
            "\u0A05\u0A24\u0A47 \u0A38\u0A39\u0A40 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      }
    }
  },
  "PCT-CP-006": {
    explanationId: "PCT-ES-006",
    taskExplanations: {
      mixturePercent: {
        steps: [
          "Use the unchanged component to form the percentage equation.",
          "Initial unchanged amount = {initialUnchangedAmount}.",
          "Final total or required change is found from the new percentage condition.",
          "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
          "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
        ],
        variants: [
          [
            "Use the unchanged component to form the percentage equation.",
            "Initial unchanged amount = {initialUnchangedAmount}.",
            "Final total or required change is found from the new percentage condition.",
            "\u0A39\u0A41\u0A23 \u0A17\u0A23\u0A28\u0A3E \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A38\u0A30\u0A32 \u0A15\u0A30\u0A4B\u0964",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A28\u0A42\u0A70 \u0A27\u0A3F\u0A06\u0A28 \u0A28\u0A3E\u0A32 \u0A35\u0A47\u0A16\u0A4B\u0964",
            "Use the unchanged component to form the percentage equation.",
            "Initial unchanged amount = {initialUnchangedAmount}.",
            "Final total or required change is found from the new percentage condition.",
            "\u0A05\u0A24\u0A47 \u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A32\u0A4B\u0A5C\u0A40\u0A02\u0A26\u0A3E \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "Use the unchanged component to form the percentage equation.",
            "\u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A42\u0A70 \u0A38\u0A70\u0A2C\u0A70\u0A27 \u0A35\u0A3F\u0A71\u0A1A \u0A30\u0A71\u0A16\u0A4B\u0964",
            "Initial unchanged amount = {initialUnchangedAmount}.",
            "Final total or required change is found from the new percentage condition.",
            "\u0A07\u0A38 \u0A24\u0A30\u0A4D\u0A39\u0A3E\u0A02 \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24 \u0A2E\u0A41\u0A71\u0A32 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "\u0A39\u0A41\u0A23 \u0A26\u0A3F\u0A71\u0A24\u0A47 \u0A2E\u0A41\u0A71\u0A32\u0A3E\u0A02 \u0A28\u0A3E\u0A32 \u0A17\u0A23\u0A28\u0A3E \u0A15\u0A30\u0A4B\u0964",
            "Use the unchanged component to form the percentage equation.",
            "Initial unchanged amount = {initialUnchangedAmount}.",
            "The calculation gives {answer}.",
            "\u0A07\u0A38 \u0A32\u0A08, \u0A05\u0A70\u0A24\u0A3F\u0A2E \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ],
          [
            "Use the unchanged component to form the percentage equation.",
            "Initial unchanged amount = {initialUnchangedAmount}.",
            "\u0A38\u0A30\u0A32 \u0A15\u0A30\u0A26\u0A47 \u0A38\u0A2E\u0A47\u0A02 \u0A06\u0A27\u0A3E\u0A30 \u0A2E\u0A41\u0A71\u0A32 \u0A28\u0A42\u0A70 \u0A38\u0A2A\u0A71\u0A36\u0A1F \u0A30\u0A71\u0A16\u0A4B\u0964",
            "Final total or required change is found from the new percentage condition.",
            "\u0A05\u0A24\u0A47 \u0A38\u0A39\u0A40 \u0A09\u0A71\u0A24\u0A30 {answer} \u0A39\u0A48\u0964"
          ]
        ]
      },
      dilutionAddWater: {
        aliasOf: "mixturePercent"
      },
      dryFromFresh: {
        aliasOf: "mixturePercent"
      },
      addSolute: {
        aliasOf: "mixturePercent"
      },
      dilutedPercent: {
        aliasOf: "mixturePercent"
      },
      freshFromDry: {
        aliasOf: "mixturePercent"
      },
      addPureComponent: {
        aliasOf: "mixturePercent"
      },
      evaporationOriginal: {
        aliasOf: "mixturePercent"
      },
      alloyComplement: {
        aliasOf: "mixturePercent"
      }
    }
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/variable-ranges.library.json
var variable_ranges_library_default = {
  variables: {
    percentageRate: {
      easy: [5, 10, 15, 20, 25, 30, 40, 50],
      medium: [12, 18, 22, 28, 32, 35, 45],
      hard: [12.5, 16.66, 33.33, 37.5, 62.5, 66.66, 14.28]
    },
    baseValue: {
      easy: [100, 200, 500, 1e3, 2e3, 5e3],
      medium: [450, 720, 840, 1260, 1500, 2400],
      hard: [357, 483, 594, 1125, 2750]
    },
    initialValue: {
      easy: [1e3, 2e3, 5e3, 1e4],
      medium: [4500, 7200, 8400, 12500],
      hard: [12300, 45600, 78900]
    },
    finalValue: {
      easy: [1100, 2200, 5500, 11e3],
      medium: [5400, 8640, 9600, 14400],
      hard: [13530, 48216, 82143]
    },
    voteDifference: {
      medium: [1200, 2400, 3600, 4800],
      hard: [1540, 2310, 4620]
    },
    totalVotes: {
      medium: [1e4, 2e4, 5e4, 8e4],
      hard: [12500, 37500, 62500]
    },
    mixturePercentage: {
      easy: [10, 20, 25, 50],
      medium: [15, 30, 40, 60],
      hard: [12, 18, 22, 33]
    },
    totalMixture: {
      easy: [20, 40, 60, 80, 100],
      medium: [45, 75, 125, 150],
      hard: [135, 225, 315]
    }
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/coverage-targets.library.json
var coverage_targets_library_default = {
  coverage: {
    difficulty_distribution: {
      Easy: 0.3,
      Medium: 0.5,
      Hard: 0.2
    },
    logical_targets: [
      "direct_calculation",
      "reverse_reasoning",
      "successive_multiplication",
      "product_invariance",
      "additive_partition",
      "successive_partition",
      "composition_shift"
    ]
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/distribution-targets.library.json
var distribution_targets_library_default = {
  distribution: {
    "PCT-CP-001": 0.2,
    "PCT-CP-002": 0.2,
    "PCT-CP-003": 0.15,
    "PCT-CP-004": 0.15,
    "PCT-CP-005": 0.2,
    "PCT-CP-006": 0.1
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/task-registry.library.json
var task_registry_library_default = {
  archetypeId: "PCT-001",
  ownership: "HUMAN_OWNED",
  authority: "task-registry.library.json",
  usage: "Runtime Consumption Only",
  entries: {
    "PCT-QL-001": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-002": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-003": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-004": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-005": {
      cpId: "PCT-CP-001",
      taskKind: "directRelation",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-006": {
      cpId: "PCT-CP-001",
      taskKind: "moreToLess",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-007": {
      cpId: "PCT-CP-001",
      taskKind: "lessToMore",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-008": {
      cpId: "PCT-CP-001",
      taskKind: "ratioFromPercentEquality",
      answerType: "RATIO",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-009": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-010": {
      cpId: "PCT-CP-002",
      taskKind: "increaseNewValue",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "baseValue",
        "percentageRate"
      ]
    },
    "PCT-QL-011": {
      cpId: "PCT-CP-002",
      taskKind: "decreaseNewValue",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "baseValue",
        "percentageRate"
      ]
    },
    "PCT-QL-012": {
      cpId: "PCT-CP-002",
      taskKind: "reverseIncrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-013": {
      cpId: "PCT-CP-002",
      taskKind: "reverseDecrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-014": {
      cpId: "PCT-CP-002",
      taskKind: "reverseIncrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-015": {
      cpId: "PCT-CP-002",
      taskKind: "reverseIncrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-016": {
      cpId: "PCT-CP-002",
      taskKind: "increaseByAmount",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "value",
        "percentageRate"
      ]
    },
    "PCT-QL-017": {
      cpId: "PCT-CP-002",
      taskKind: "percentOfKnownNumber",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "value1",
        "rate2"
      ]
    },
    "PCT-QL-018": {
      cpId: "PCT-CP-002",
      taskKind: "differenceOfPercents",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-019": {
      cpId: "PCT-CP-002",
      taskKind: "restoreAfterDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-020": {
      cpId: "PCT-CP-003",
      taskKind: "successiveIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-021": {
      cpId: "PCT-CP-003",
      taskKind: "successiveIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-022": {
      cpId: "PCT-CP-003",
      taskKind: "successiveChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-023": {
      cpId: "PCT-CP-003",
      taskKind: "successiveChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-024": {
      cpId: "PCT-CP-003",
      taskKind: "compoundGrowth",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "initialValue",
        "percentageRate"
      ]
    },
    "PCT-QL-025": {
      cpId: "PCT-CP-003",
      taskKind: "compoundDecay",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "initialValue",
        "percentageRate"
      ]
    },
    "PCT-QL-026": {
      cpId: "PCT-CP-003",
      taskKind: "areaChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-027": {
      cpId: "PCT-CP-003",
      taskKind: "squareAreaChange",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-028": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-029": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-030": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-031": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-032": {
      cpId: "PCT-CP-004",
      taskKind: "restoreAfterIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1"
      ]
    },
    "PCT-QL-033": {
      cpId: "PCT-CP-004",
      taskKind: "revenueChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-034": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-035": {
      cpId: "PCT-CP-004",
      taskKind: "circleAreaDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-036": {
      cpId: "PCT-CP-005",
      taskKind: "incomePartition",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "rate3",
        "value"
      ]
    },
    "PCT-QL-037": {
      cpId: "PCT-CP-005",
      taskKind: "successiveExpense",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-038": {
      cpId: "PCT-CP-005",
      taskKind: "winnerVotes",
      answerType: "COUNT",
      requiredVariables: [
        "percentageRate",
        "voteDifference"
      ]
    },
    "PCT-QL-039": {
      cpId: "PCT-CP-005",
      taskKind: "cancelledVotes",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "rate2",
        "voteDifference"
      ]
    },
    "PCT-QL-040": {
      cpId: "PCT-CP-005",
      taskKind: "passMarks",
      answerType: "COUNT",
      requiredVariables: [
        "passRate",
        "marksObtained",
        "failMargin"
      ]
    },
    "PCT-QL-041": {
      cpId: "PCT-CP-005",
      taskKind: "partToTotal",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "value"
      ]
    },
    "PCT-QL-042": {
      cpId: "PCT-CP-005",
      taskKind: "complementOfTotal",
      answerType: "COUNT",
      requiredVariables: [
        "totalPopulation",
        "percentageRate"
      ]
    },
    "PCT-QL-043": {
      cpId: "PCT-CP-005",
      taskKind: "moreMarksBase",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "marks"
      ]
    },
    "PCT-QL-044": {
      cpId: "PCT-CP-005",
      taskKind: "partToTotal",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "value"
      ]
    },
    "PCT-QL-045": {
      cpId: "PCT-CP-005",
      taskKind: "twoShareRemainder",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-046": {
      cpId: "PCT-CP-005",
      taskKind: "partToTotal",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "value"
      ]
    },
    "PCT-QL-047": {
      cpId: "PCT-CP-005",
      taskKind: "loserVotes",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "voteDifference"
      ]
    },
    "PCT-QL-048": {
      cpId: "PCT-CP-006",
      taskKind: "dilutionAddWater",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "newRate"
      ]
    },
    "PCT-QL-049": {
      cpId: "PCT-CP-006",
      taskKind: "dryFromFresh",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalQuantity",
        "waterRate",
        "dryWaterRate"
      ]
    },
    "PCT-QL-050": {
      cpId: "PCT-CP-006",
      taskKind: "addSolute",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "newRate"
      ]
    },
    "PCT-QL-051": {
      cpId: "PCT-CP-006",
      taskKind: "dilutedPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-052": {
      cpId: "PCT-CP-006",
      taskKind: "freshFromDry",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-053": {
      cpId: "PCT-CP-006",
      taskKind: "addPureComponent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "newRate"
      ]
    },
    "PCT-QL-054": {
      cpId: "PCT-CP-006",
      taskKind: "evaporationOriginal",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value",
        "newRate"
      ]
    },
    "PCT-QL-055": {
      cpId: "PCT-CP-006",
      taskKind: "alloyComplement",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "totalWeight"
      ]
    },
    "PCT-QL-101": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-201": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-301": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-401": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-501": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-601": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-701": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-801": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-901": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1001": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1101": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1201": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1301": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1401": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1501": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1601": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1701": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1801": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1901": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-102": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-202": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-302": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-402": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-502": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-602": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-702": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-802": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-902": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1002": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1102": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1202": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1302": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1402": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1502": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1602": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1702": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1802": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-1902": {
      cpId: "PCT-CP-001",
      taskKind: "percentOf",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-103": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-203": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-303": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-403": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-503": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-603": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-703": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-803": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-903": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-1003": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-1103": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-1203": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-1303": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-1403": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-1503": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-1603": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-1703": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-1803": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-1903": {
      cpId: "PCT-CP-001",
      taskKind: "percentToFraction",
      answerType: "FRACTION",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-104": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-204": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-304": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-404": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-504": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-604": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-704": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-804": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-904": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-1004": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-1104": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-1204": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-1304": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-1404": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-1504": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-1604": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-1704": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-1804": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-1904": {
      cpId: "PCT-CP-001",
      taskKind: "valueAsPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "value",
        "baseValue"
      ]
    },
    "PCT-QL-105": {
      cpId: "PCT-CP-001",
      taskKind: "directRelation",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-205": {
      cpId: "PCT-CP-001",
      taskKind: "directRelation",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-305": {
      cpId: "PCT-CP-001",
      taskKind: "directRelation",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-405": {
      cpId: "PCT-CP-001",
      taskKind: "directRelation",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "baseValue"
      ]
    },
    "PCT-QL-106": {
      cpId: "PCT-CP-001",
      taskKind: "moreToLess",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-206": {
      cpId: "PCT-CP-001",
      taskKind: "moreToLess",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-306": {
      cpId: "PCT-CP-001",
      taskKind: "moreToLess",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-406": {
      cpId: "PCT-CP-001",
      taskKind: "moreToLess",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-107": {
      cpId: "PCT-CP-001",
      taskKind: "lessToMore",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-207": {
      cpId: "PCT-CP-001",
      taskKind: "lessToMore",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-307": {
      cpId: "PCT-CP-001",
      taskKind: "lessToMore",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-407": {
      cpId: "PCT-CP-001",
      taskKind: "lessToMore",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-108": {
      cpId: "PCT-CP-001",
      taskKind: "ratioFromPercentEquality",
      answerType: "RATIO",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-208": {
      cpId: "PCT-CP-001",
      taskKind: "ratioFromPercentEquality",
      answerType: "RATIO",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-308": {
      cpId: "PCT-CP-001",
      taskKind: "ratioFromPercentEquality",
      answerType: "RATIO",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-408": {
      cpId: "PCT-CP-001",
      taskKind: "ratioFromPercentEquality",
      answerType: "RATIO",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-109": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-209": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-309": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-409": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-509": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-609": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-709": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-809": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-909": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-1009": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-1109": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-1209": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-1309": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-1409": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-1509": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-1609": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-1709": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-1809": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-1909": {
      cpId: "PCT-CP-001",
      taskKind: "reversePercent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-110": {
      cpId: "PCT-CP-002",
      taskKind: "increaseNewValue",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "baseValue",
        "percentageRate"
      ]
    },
    "PCT-QL-210": {
      cpId: "PCT-CP-002",
      taskKind: "increaseNewValue",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "baseValue",
        "percentageRate"
      ]
    },
    "PCT-QL-310": {
      cpId: "PCT-CP-002",
      taskKind: "increaseNewValue",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "baseValue",
        "percentageRate"
      ]
    },
    "PCT-QL-410": {
      cpId: "PCT-CP-002",
      taskKind: "increaseNewValue",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "baseValue",
        "percentageRate"
      ]
    },
    "PCT-QL-111": {
      cpId: "PCT-CP-002",
      taskKind: "decreaseNewValue",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "baseValue",
        "percentageRate"
      ]
    },
    "PCT-QL-211": {
      cpId: "PCT-CP-002",
      taskKind: "decreaseNewValue",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "baseValue",
        "percentageRate"
      ]
    },
    "PCT-QL-311": {
      cpId: "PCT-CP-002",
      taskKind: "decreaseNewValue",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "baseValue",
        "percentageRate"
      ]
    },
    "PCT-QL-411": {
      cpId: "PCT-CP-002",
      taskKind: "decreaseNewValue",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "baseValue",
        "percentageRate"
      ]
    },
    "PCT-QL-112": {
      cpId: "PCT-CP-002",
      taskKind: "reverseIncrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-212": {
      cpId: "PCT-CP-002",
      taskKind: "reverseIncrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-312": {
      cpId: "PCT-CP-002",
      taskKind: "reverseIncrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-412": {
      cpId: "PCT-CP-002",
      taskKind: "reverseIncrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-113": {
      cpId: "PCT-CP-002",
      taskKind: "reverseDecrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-213": {
      cpId: "PCT-CP-002",
      taskKind: "reverseDecrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-313": {
      cpId: "PCT-CP-002",
      taskKind: "reverseDecrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-413": {
      cpId: "PCT-CP-002",
      taskKind: "reverseDecrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-114": {
      cpId: "PCT-CP-002",
      taskKind: "reverseIncrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-214": {
      cpId: "PCT-CP-002",
      taskKind: "reverseIncrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-314": {
      cpId: "PCT-CP-002",
      taskKind: "reverseIncrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-414": {
      cpId: "PCT-CP-002",
      taskKind: "reverseIncrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-115": {
      cpId: "PCT-CP-002",
      taskKind: "reverseIncrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-215": {
      cpId: "PCT-CP-002",
      taskKind: "reverseIncrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-315": {
      cpId: "PCT-CP-002",
      taskKind: "reverseIncrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-415": {
      cpId: "PCT-CP-002",
      taskKind: "reverseIncrease",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "finalValue"
      ]
    },
    "PCT-QL-116": {
      cpId: "PCT-CP-002",
      taskKind: "increaseByAmount",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "value",
        "percentageRate"
      ]
    },
    "PCT-QL-216": {
      cpId: "PCT-CP-002",
      taskKind: "increaseByAmount",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "value",
        "percentageRate"
      ]
    },
    "PCT-QL-316": {
      cpId: "PCT-CP-002",
      taskKind: "increaseByAmount",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "value",
        "percentageRate"
      ]
    },
    "PCT-QL-416": {
      cpId: "PCT-CP-002",
      taskKind: "increaseByAmount",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "value",
        "percentageRate"
      ]
    },
    "PCT-QL-117": {
      cpId: "PCT-CP-002",
      taskKind: "percentOfKnownNumber",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "value1",
        "rate2"
      ]
    },
    "PCT-QL-217": {
      cpId: "PCT-CP-002",
      taskKind: "percentOfKnownNumber",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "value1",
        "rate2"
      ]
    },
    "PCT-QL-317": {
      cpId: "PCT-CP-002",
      taskKind: "percentOfKnownNumber",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "value1",
        "rate2"
      ]
    },
    "PCT-QL-417": {
      cpId: "PCT-CP-002",
      taskKind: "percentOfKnownNumber",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "value1",
        "rate2"
      ]
    },
    "PCT-QL-118": {
      cpId: "PCT-CP-002",
      taskKind: "differenceOfPercents",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-218": {
      cpId: "PCT-CP-002",
      taskKind: "differenceOfPercents",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-318": {
      cpId: "PCT-CP-002",
      taskKind: "differenceOfPercents",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-418": {
      cpId: "PCT-CP-002",
      taskKind: "differenceOfPercents",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-119": {
      cpId: "PCT-CP-002",
      taskKind: "restoreAfterDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-219": {
      cpId: "PCT-CP-002",
      taskKind: "restoreAfterDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-319": {
      cpId: "PCT-CP-002",
      taskKind: "restoreAfterDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-419": {
      cpId: "PCT-CP-002",
      taskKind: "restoreAfterDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-120": {
      cpId: "PCT-CP-003",
      taskKind: "successiveIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-220": {
      cpId: "PCT-CP-003",
      taskKind: "successiveIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-320": {
      cpId: "PCT-CP-003",
      taskKind: "successiveIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-420": {
      cpId: "PCT-CP-003",
      taskKind: "successiveIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-121": {
      cpId: "PCT-CP-003",
      taskKind: "successiveIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-221": {
      cpId: "PCT-CP-003",
      taskKind: "successiveIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-321": {
      cpId: "PCT-CP-003",
      taskKind: "successiveIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-421": {
      cpId: "PCT-CP-003",
      taskKind: "successiveIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-122": {
      cpId: "PCT-CP-003",
      taskKind: "successiveChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-222": {
      cpId: "PCT-CP-003",
      taskKind: "successiveChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-322": {
      cpId: "PCT-CP-003",
      taskKind: "successiveChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-422": {
      cpId: "PCT-CP-003",
      taskKind: "successiveChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-123": {
      cpId: "PCT-CP-003",
      taskKind: "successiveChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-223": {
      cpId: "PCT-CP-003",
      taskKind: "successiveChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-323": {
      cpId: "PCT-CP-003",
      taskKind: "successiveChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-423": {
      cpId: "PCT-CP-003",
      taskKind: "successiveChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-124": {
      cpId: "PCT-CP-003",
      taskKind: "compoundGrowth",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "initialValue",
        "percentageRate"
      ]
    },
    "PCT-QL-224": {
      cpId: "PCT-CP-003",
      taskKind: "compoundGrowth",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "initialValue",
        "percentageRate"
      ]
    },
    "PCT-QL-324": {
      cpId: "PCT-CP-003",
      taskKind: "compoundGrowth",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "initialValue",
        "percentageRate"
      ]
    },
    "PCT-QL-424": {
      cpId: "PCT-CP-003",
      taskKind: "compoundGrowth",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "initialValue",
        "percentageRate"
      ]
    },
    "PCT-QL-125": {
      cpId: "PCT-CP-003",
      taskKind: "compoundDecay",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "initialValue",
        "percentageRate"
      ]
    },
    "PCT-QL-225": {
      cpId: "PCT-CP-003",
      taskKind: "compoundDecay",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "initialValue",
        "percentageRate"
      ]
    },
    "PCT-QL-325": {
      cpId: "PCT-CP-003",
      taskKind: "compoundDecay",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "initialValue",
        "percentageRate"
      ]
    },
    "PCT-QL-425": {
      cpId: "PCT-CP-003",
      taskKind: "compoundDecay",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "initialValue",
        "percentageRate"
      ]
    },
    "PCT-QL-126": {
      cpId: "PCT-CP-003",
      taskKind: "areaChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-226": {
      cpId: "PCT-CP-003",
      taskKind: "areaChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-326": {
      cpId: "PCT-CP-003",
      taskKind: "areaChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-426": {
      cpId: "PCT-CP-003",
      taskKind: "areaChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-127": {
      cpId: "PCT-CP-003",
      taskKind: "squareAreaChange",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-227": {
      cpId: "PCT-CP-003",
      taskKind: "squareAreaChange",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-327": {
      cpId: "PCT-CP-003",
      taskKind: "squareAreaChange",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-427": {
      cpId: "PCT-CP-003",
      taskKind: "squareAreaChange",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-128": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-228": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-328": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-428": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-129": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-229": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-329": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-429": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-130": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-230": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-330": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-430": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-131": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-231": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-331": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-431": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-132": {
      cpId: "PCT-CP-004",
      taskKind: "restoreAfterIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1"
      ]
    },
    "PCT-QL-232": {
      cpId: "PCT-CP-004",
      taskKind: "restoreAfterIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1"
      ]
    },
    "PCT-QL-332": {
      cpId: "PCT-CP-004",
      taskKind: "restoreAfterIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1"
      ]
    },
    "PCT-QL-432": {
      cpId: "PCT-CP-004",
      taskKind: "restoreAfterIncrease",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1"
      ]
    },
    "PCT-QL-133": {
      cpId: "PCT-CP-004",
      taskKind: "revenueChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-233": {
      cpId: "PCT-CP-004",
      taskKind: "revenueChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-333": {
      cpId: "PCT-CP-004",
      taskKind: "revenueChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-433": {
      cpId: "PCT-CP-004",
      taskKind: "revenueChange",
      answerType: "PERCENT",
      requiredVariables: [
        "rate1",
        "rate2"
      ]
    },
    "PCT-QL-134": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-234": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-334": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-434": {
      cpId: "PCT-CP-004",
      taskKind: "invarianceDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-135": {
      cpId: "PCT-CP-004",
      taskKind: "circleAreaDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-235": {
      cpId: "PCT-CP-004",
      taskKind: "circleAreaDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-335": {
      cpId: "PCT-CP-004",
      taskKind: "circleAreaDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-435": {
      cpId: "PCT-CP-004",
      taskKind: "circleAreaDecrease",
      answerType: "PERCENT",
      requiredVariables: [
        "percentageRate"
      ]
    },
    "PCT-QL-136": {
      cpId: "PCT-CP-005",
      taskKind: "incomePartition",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "rate3",
        "value"
      ]
    },
    "PCT-QL-236": {
      cpId: "PCT-CP-005",
      taskKind: "incomePartition",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "rate3",
        "value"
      ]
    },
    "PCT-QL-336": {
      cpId: "PCT-CP-005",
      taskKind: "incomePartition",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "rate3",
        "value"
      ]
    },
    "PCT-QL-436": {
      cpId: "PCT-CP-005",
      taskKind: "incomePartition",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "rate3",
        "value"
      ]
    },
    "PCT-QL-137": {
      cpId: "PCT-CP-005",
      taskKind: "successiveExpense",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-237": {
      cpId: "PCT-CP-005",
      taskKind: "successiveExpense",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-337": {
      cpId: "PCT-CP-005",
      taskKind: "successiveExpense",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-437": {
      cpId: "PCT-CP-005",
      taskKind: "successiveExpense",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-138": {
      cpId: "PCT-CP-005",
      taskKind: "winnerVotes",
      answerType: "COUNT",
      requiredVariables: [
        "percentageRate",
        "voteDifference"
      ]
    },
    "PCT-QL-238": {
      cpId: "PCT-CP-005",
      taskKind: "winnerVotes",
      answerType: "COUNT",
      requiredVariables: [
        "percentageRate",
        "voteDifference"
      ]
    },
    "PCT-QL-338": {
      cpId: "PCT-CP-005",
      taskKind: "winnerVotes",
      answerType: "COUNT",
      requiredVariables: [
        "percentageRate",
        "voteDifference"
      ]
    },
    "PCT-QL-438": {
      cpId: "PCT-CP-005",
      taskKind: "winnerVotes",
      answerType: "COUNT",
      requiredVariables: [
        "percentageRate",
        "voteDifference"
      ]
    },
    "PCT-QL-139": {
      cpId: "PCT-CP-005",
      taskKind: "cancelledVotes",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "rate2",
        "voteDifference"
      ]
    },
    "PCT-QL-239": {
      cpId: "PCT-CP-005",
      taskKind: "cancelledVotes",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "rate2",
        "voteDifference"
      ]
    },
    "PCT-QL-339": {
      cpId: "PCT-CP-005",
      taskKind: "cancelledVotes",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "rate2",
        "voteDifference"
      ]
    },
    "PCT-QL-439": {
      cpId: "PCT-CP-005",
      taskKind: "cancelledVotes",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "rate2",
        "voteDifference"
      ]
    },
    "PCT-QL-140": {
      cpId: "PCT-CP-005",
      taskKind: "passMarks",
      answerType: "COUNT",
      requiredVariables: [
        "passRate",
        "marksObtained",
        "failMargin"
      ]
    },
    "PCT-QL-240": {
      cpId: "PCT-CP-005",
      taskKind: "passMarks",
      answerType: "COUNT",
      requiredVariables: [
        "passRate",
        "marksObtained",
        "failMargin"
      ]
    },
    "PCT-QL-340": {
      cpId: "PCT-CP-005",
      taskKind: "passMarks",
      answerType: "COUNT",
      requiredVariables: [
        "passRate",
        "marksObtained",
        "failMargin"
      ]
    },
    "PCT-QL-440": {
      cpId: "PCT-CP-005",
      taskKind: "passMarks",
      answerType: "COUNT",
      requiredVariables: [
        "passRate",
        "marksObtained",
        "failMargin"
      ]
    },
    "PCT-QL-141": {
      cpId: "PCT-CP-005",
      taskKind: "partToTotal",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "value"
      ]
    },
    "PCT-QL-241": {
      cpId: "PCT-CP-005",
      taskKind: "partToTotal",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "value"
      ]
    },
    "PCT-QL-341": {
      cpId: "PCT-CP-005",
      taskKind: "partToTotal",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "value"
      ]
    },
    "PCT-QL-441": {
      cpId: "PCT-CP-005",
      taskKind: "partToTotal",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "value"
      ]
    },
    "PCT-QL-142": {
      cpId: "PCT-CP-005",
      taskKind: "complementOfTotal",
      answerType: "COUNT",
      requiredVariables: [
        "totalPopulation",
        "percentageRate"
      ]
    },
    "PCT-QL-242": {
      cpId: "PCT-CP-005",
      taskKind: "complementOfTotal",
      answerType: "COUNT",
      requiredVariables: [
        "totalPopulation",
        "percentageRate"
      ]
    },
    "PCT-QL-342": {
      cpId: "PCT-CP-005",
      taskKind: "complementOfTotal",
      answerType: "COUNT",
      requiredVariables: [
        "totalPopulation",
        "percentageRate"
      ]
    },
    "PCT-QL-442": {
      cpId: "PCT-CP-005",
      taskKind: "complementOfTotal",
      answerType: "COUNT",
      requiredVariables: [
        "totalPopulation",
        "percentageRate"
      ]
    },
    "PCT-QL-143": {
      cpId: "PCT-CP-005",
      taskKind: "moreMarksBase",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "marks"
      ]
    },
    "PCT-QL-243": {
      cpId: "PCT-CP-005",
      taskKind: "moreMarksBase",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "marks"
      ]
    },
    "PCT-QL-343": {
      cpId: "PCT-CP-005",
      taskKind: "moreMarksBase",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "marks"
      ]
    },
    "PCT-QL-443": {
      cpId: "PCT-CP-005",
      taskKind: "moreMarksBase",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "marks"
      ]
    },
    "PCT-QL-144": {
      cpId: "PCT-CP-005",
      taskKind: "partToTotal",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "value"
      ]
    },
    "PCT-QL-244": {
      cpId: "PCT-CP-005",
      taskKind: "partToTotal",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "value"
      ]
    },
    "PCT-QL-344": {
      cpId: "PCT-CP-005",
      taskKind: "partToTotal",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "value"
      ]
    },
    "PCT-QL-444": {
      cpId: "PCT-CP-005",
      taskKind: "partToTotal",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "value"
      ]
    },
    "PCT-QL-145": {
      cpId: "PCT-CP-005",
      taskKind: "twoShareRemainder",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-245": {
      cpId: "PCT-CP-005",
      taskKind: "twoShareRemainder",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-345": {
      cpId: "PCT-CP-005",
      taskKind: "twoShareRemainder",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-445": {
      cpId: "PCT-CP-005",
      taskKind: "twoShareRemainder",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-146": {
      cpId: "PCT-CP-005",
      taskKind: "partToTotal",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "value"
      ]
    },
    "PCT-QL-246": {
      cpId: "PCT-CP-005",
      taskKind: "partToTotal",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "value"
      ]
    },
    "PCT-QL-346": {
      cpId: "PCT-CP-005",
      taskKind: "partToTotal",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "value"
      ]
    },
    "PCT-QL-446": {
      cpId: "PCT-CP-005",
      taskKind: "partToTotal",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "value"
      ]
    },
    "PCT-QL-147": {
      cpId: "PCT-CP-005",
      taskKind: "loserVotes",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "voteDifference"
      ]
    },
    "PCT-QL-247": {
      cpId: "PCT-CP-005",
      taskKind: "loserVotes",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "voteDifference"
      ]
    },
    "PCT-QL-347": {
      cpId: "PCT-CP-005",
      taskKind: "loserVotes",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "voteDifference"
      ]
    },
    "PCT-QL-447": {
      cpId: "PCT-CP-005",
      taskKind: "loserVotes",
      answerType: "COUNT",
      requiredVariables: [
        "rate1",
        "voteDifference"
      ]
    },
    "PCT-QL-148": {
      cpId: "PCT-CP-006",
      taskKind: "dilutionAddWater",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "newRate"
      ]
    },
    "PCT-QL-248": {
      cpId: "PCT-CP-006",
      taskKind: "dilutionAddWater",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "newRate"
      ]
    },
    "PCT-QL-348": {
      cpId: "PCT-CP-006",
      taskKind: "dilutionAddWater",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "newRate"
      ]
    },
    "PCT-QL-448": {
      cpId: "PCT-CP-006",
      taskKind: "dilutionAddWater",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "newRate"
      ]
    },
    "PCT-QL-149": {
      cpId: "PCT-CP-006",
      taskKind: "dryFromFresh",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalQuantity",
        "waterRate",
        "dryWaterRate"
      ]
    },
    "PCT-QL-249": {
      cpId: "PCT-CP-006",
      taskKind: "dryFromFresh",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalQuantity",
        "waterRate",
        "dryWaterRate"
      ]
    },
    "PCT-QL-349": {
      cpId: "PCT-CP-006",
      taskKind: "dryFromFresh",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalQuantity",
        "waterRate",
        "dryWaterRate"
      ]
    },
    "PCT-QL-449": {
      cpId: "PCT-CP-006",
      taskKind: "dryFromFresh",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalQuantity",
        "waterRate",
        "dryWaterRate"
      ]
    },
    "PCT-QL-150": {
      cpId: "PCT-CP-006",
      taskKind: "addSolute",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "newRate"
      ]
    },
    "PCT-QL-250": {
      cpId: "PCT-CP-006",
      taskKind: "addSolute",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "newRate"
      ]
    },
    "PCT-QL-350": {
      cpId: "PCT-CP-006",
      taskKind: "addSolute",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "newRate"
      ]
    },
    "PCT-QL-450": {
      cpId: "PCT-CP-006",
      taskKind: "addSolute",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "newRate"
      ]
    },
    "PCT-QL-151": {
      cpId: "PCT-CP-006",
      taskKind: "dilutedPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-251": {
      cpId: "PCT-CP-006",
      taskKind: "dilutedPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-351": {
      cpId: "PCT-CP-006",
      taskKind: "dilutedPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-451": {
      cpId: "PCT-CP-006",
      taskKind: "dilutedPercent",
      answerType: "PERCENT",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "value"
      ]
    },
    "PCT-QL-152": {
      cpId: "PCT-CP-006",
      taskKind: "freshFromDry",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-252": {
      cpId: "PCT-CP-006",
      taskKind: "freshFromDry",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-352": {
      cpId: "PCT-CP-006",
      taskKind: "freshFromDry",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-452": {
      cpId: "PCT-CP-006",
      taskKind: "freshFromDry",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "rate1",
        "rate2",
        "value"
      ]
    },
    "PCT-QL-153": {
      cpId: "PCT-CP-006",
      taskKind: "addPureComponent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "newRate"
      ]
    },
    "PCT-QL-253": {
      cpId: "PCT-CP-006",
      taskKind: "addPureComponent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "newRate"
      ]
    },
    "PCT-QL-353": {
      cpId: "PCT-CP-006",
      taskKind: "addPureComponent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "newRate"
      ]
    },
    "PCT-QL-453": {
      cpId: "PCT-CP-006",
      taskKind: "addPureComponent",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "totalMixture",
        "percentageRate",
        "newRate"
      ]
    },
    "PCT-QL-154": {
      cpId: "PCT-CP-006",
      taskKind: "evaporationOriginal",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value",
        "newRate"
      ]
    },
    "PCT-QL-254": {
      cpId: "PCT-CP-006",
      taskKind: "evaporationOriginal",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value",
        "newRate"
      ]
    },
    "PCT-QL-354": {
      cpId: "PCT-CP-006",
      taskKind: "evaporationOriginal",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value",
        "newRate"
      ]
    },
    "PCT-QL-454": {
      cpId: "PCT-CP-006",
      taskKind: "evaporationOriginal",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "value",
        "newRate"
      ]
    },
    "PCT-QL-155": {
      cpId: "PCT-CP-006",
      taskKind: "alloyComplement",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "totalWeight"
      ]
    },
    "PCT-QL-255": {
      cpId: "PCT-CP-006",
      taskKind: "alloyComplement",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "totalWeight"
      ]
    },
    "PCT-QL-355": {
      cpId: "PCT-CP-006",
      taskKind: "alloyComplement",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "totalWeight"
      ]
    },
    "PCT-QL-455": {
      cpId: "PCT-CP-006",
      taskKind: "alloyComplement",
      answerType: "ABSOLUTE",
      requiredVariables: [
        "percentageRate",
        "totalWeight"
      ]
    }
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/semantic/percentage-semantic-library.json
var percentage_semantic_library_default = {
  domains: {
    school: {
      entities: [
        { id: "boys", en: "boys", hi: "\u0932\u0921\u093C\u0915\u0947", pa: "\u0A2E\u0A41\u0A70\u0A21\u0A47", gender: "male", numberType: "countable", frequency: "common" },
        { id: "girls", en: "girls", hi: "\u0932\u0921\u093C\u0915\u093F\u092F\u093E\u0902", pa: "\u0A15\u0A41\u0A5C\u0A40\u0A06\u0A02", gender: "female", numberType: "countable", frequency: "common" },
        { id: "students", en: "students", hi: "\u091B\u093E\u0924\u094D\u0930", pa: "\u0A35\u0A3F\u0A26\u0A3F\u0A06\u0A30\u0A25\u0A40", gender: "male", numberType: "countable", frequency: "common" },
        { id: "mathematics", en: "Mathematics", hi: "\u0917\u0923\u093F\u0924", pa: "\u0A17\u0A23\u0A3F\u0A24", gender: "neutral", numberType: "uncountable", frequency: "common" },
        { id: "english", en: "English", hi: "\u0905\u0902\u0917\u094D\u0930\u0947\u091C\u0940", pa: "\u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40", gender: "neutral", numberType: "uncountable", frequency: "common" },
        { id: "science", en: "Science", hi: "\u0935\u093F\u091C\u094D\u091E\u093E\u0928", pa: "\u0A35\u0A3F\u0A17\u0A3F\u0A06\u0A28", gender: "neutral", numberType: "uncountable", frequency: "common" },
        { id: "history", en: "History", hi: "\u0907\u0924\u093F\u0939\u093E\u0938", pa: "\u0A07\u0A24\u0A3F\u0A39\u0A3E\u0A38", gender: "neutral", numberType: "uncountable", frequency: "uncommon" }
      ]
    },
    election: {
      entities: [
        { id: "voters", en: "voters", hi: "\u092E\u0924\u0926\u093E\u0924\u093E", pa: "\u0A35\u0A4B\u0A1F\u0A30", gender: "male", numberType: "countable", frequency: "common" },
        { id: "valid_votes", en: "valid votes", hi: "\u0935\u0948\u0927 \u092E\u0924", pa: "\u0A35\u0A48\u0A27 \u0A35\u0A4B\u0A1F\u0A3E\u0A02", gender: "neutral", numberType: "countable", frequency: "common" },
        { id: "invalid_votes", en: "invalid votes", hi: "\u0905\u0935\u0948\u0927 \u092E\u0924", pa: "\u0A05\u0A35\u0A48\u0A27 \u0A35\u0A4B\u0A1F\u0A3E\u0A02", gender: "neutral", numberType: "countable", frequency: "common" },
        { id: "winner", en: "winner", hi: "\u0935\u093F\u091C\u0947\u0924\u093E", pa: "\u0A1C\u0A47\u0A24\u0A42", gender: "male", numberType: "countable", frequency: "common" },
        { id: "runner_up", en: "runner-up", hi: "\u0909\u092A\u0935\u093F\u091C\u0947\u0924\u093E", pa: "\u0A09\u0A2A-\u0A1C\u0A47\u0A24\u0A42", gender: "male", numberType: "countable", frequency: "common" }
      ]
    },
    population: {
      entities: [
        { id: "men", en: "men", hi: "\u092A\u0941\u0930\u0941\u0937", pa: "\u0A2A\u0A41\u0A30\u0A38\u0A3C", gender: "male", numberType: "countable", frequency: "common" },
        { id: "women", en: "women", hi: "\u092E\u0939\u093F\u0932\u093E\u090F\u0902", pa: "\u0A14\u0A30\u0A24\u0A3E\u0A02", gender: "female", numberType: "countable", frequency: "common" },
        { id: "employees", en: "employees", hi: "\u0915\u0930\u094D\u092E\u091A\u093E\u0930\u0940", pa: "\u0A15\u0A30\u0A2E\u0A1A\u0A3E\u0A30\u0A40", gender: "male", numberType: "countable", frequency: "common" },
        { id: "workers", en: "workers", hi: "\u092E\u091C\u0926\u0942\u0930", pa: "\u0A2E\u0A1C\u0A3C\u0A26\u0A42\u0A30", gender: "male", numberType: "countable", frequency: "common" }
      ]
    },
    finance: {
      entities: [
        { id: "salary", en: "salary", hi: "\u0935\u0947\u0924\u0928", pa: "\u0A24\u0A28\u0A16\u0A3E\u0A39", gender: "neutral", numberType: "uncountable", frequency: "common" },
        { id: "income", en: "income", hi: "\u0906\u092F", pa: "\u0A06\u0A2E\u0A26\u0A28", gender: "neutral", numberType: "uncountable", frequency: "common" },
        { id: "expenditure", en: "expenditure", hi: "\u0916\u0930\u094D\u091A", pa: "\u0A16\u0A30\u0A1A", gender: "neutral", numberType: "uncountable", frequency: "common" },
        { id: "saving", en: "saving", hi: "\u092C\u091A\u0924", pa: "\u0A2C\u0A1A\u0A24", gender: "neutral", numberType: "uncountable", frequency: "common" }
      ]
    },
    production: {
      entities: [
        { id: "workers", en: "workers", hi: "\u092E\u091C\u0926\u0942\u0930", pa: "\u0A2E\u0A1C\u0A3C\u0A26\u0A42\u0A30", gender: "male", numberType: "countable", frequency: "common" },
        { id: "machines", en: "machines", hi: "\u092E\u0936\u0940\u0928\u0947\u0902", pa: "\u0A2E\u0A38\u0A3C\u0A40\u0A28\u0A3E\u0A02", gender: "neutral", numberType: "countable", frequency: "uncommon" },
        { id: "output", en: "output", hi: "\u0909\u0924\u094D\u092A\u093E\u0926\u0928", pa: "\u0A09\u0A24\u0A2A\u0A3E\u0A26\u0A28", gender: "neutral", numberType: "uncountable", frequency: "common" }
      ]
    },
    agriculture: {
      entities: [
        { id: "farmers", en: "farmers", hi: "\u0915\u093F\u0938\u093E\u0928", pa: "\u0A15\u0A3F\u0A38\u0A3E\u0A28", gender: "male", numberType: "countable", frequency: "common" },
        { id: "crops", en: "crops", hi: "\u092B\u0938\u0932\u0947\u0902", pa: "\u0A2B\u0A38\u0A32\u0A3E\u0A02", gender: "neutral", numberType: "countable", frequency: "uncommon" },
        { id: "yield", en: "yield", hi: "\u092A\u0948\u0926\u093E\u0935\u093E\u0930", pa: "\u0A1D\u0A3E\u0A5C", gender: "neutral", numberType: "uncountable", frequency: "rare" }
      ]
    }
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/semantic/scenario-map.json
var scenario_map_default = {
  "PCT-CP-001": "school",
  "PCT-CP-002": "finance",
  "PCT-CP-003": "population",
  "PCT-CP-004": "production",
  "PCT-CP-005": "election",
  "PCT-CP-006": "agriculture"
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/semantic/compatibility-map.json
var compatibility_map_default = {
  allowed_pairings: {
    boys: ["girls", "mathematics", "english", "science", "history"],
    girls: ["boys", "mathematics", "english", "science", "history"],
    voters: ["valid_votes", "invalid_votes", "winner", "runner_up"],
    men: ["women", "employees", "workers"],
    women: ["men", "employees", "workers"],
    salary: ["expenditure", "saving"],
    income: ["expenditure", "saving"],
    workers: ["machines", "output"],
    farmers: ["crops", "yield"]
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/semantic/frequency-model.json
var frequency_model_default = {
  probabilities: {
    common: 0.8,
    uncommon: 0.18,
    rare: 0.02
  },
  assignments: {
    boys: "common",
    girls: "common",
    students: "common",
    mathematics: "common",
    english: "common",
    salary: "common",
    income: "common",
    voters: "common",
    men: "common",
    women: "common",
    workers: "common",
    machines: "uncommon",
    crops: "uncommon",
    yield: "rare",
    history: "uncommon",
    science: "common"
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/semantic/grammar-rules.json
var grammar_rules_default = {
  hi: {
    verbs: {
      increase: {
        male_singular: "\u092C\u0922\u093C\u0924\u093E \u0939\u0948",
        female_singular: "\u092C\u0922\u093C\u0924\u0940 \u0939\u0948",
        plural: "\u092C\u0922\u093C\u0924\u0947 \u0939\u0948\u0902"
      },
      decrease: {
        male_singular: "\u0918\u091F\u0924\u093E \u0939\u0948",
        female_singular: "\u0918\u091F\u0924\u0940 \u0939\u0948",
        plural: "\u0918\u091F\u0924\u0947 \u0939\u0948\u0902"
      }
    }
  },
  pa: {
    verbs: {
      increase: {
        male_singular: "\u0A35\u0A71\u0A27\u0A26\u0A3E \u0A39\u0A48",
        female_singular: "\u0A35\u0A71\u0A27\u0A26\u0A40 \u0A39\u0A48",
        plural: "\u0A35\u0A71\u0A27\u0A26\u0A47 \u0A39\u0A28"
      },
      decrease: {
        male_singular: "\u0A18\u0A1F\u0A26\u0A3E \u0A39\u0A48",
        female_singular: "\u0A18\u0A1F\u0A26\u0A40 \u0A39\u0A48",
        plural: "\u0A18\u0A1F\u0A26\u0A47 \u0A39\u0A28"
      }
    }
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/library.ts
var PCT_001_LIBRARY_REGISTRY = {
  questionLanguage: {
    en: question_language_en_default,
    hi: question_language_hi_default,
    pa: question_language_pa_default
  },
  explanation: {
    en: explanation_en_default,
    hi: explanation_hi_default,
    pa: explanation_pa_default
  },
  variableRanges: variable_ranges_library_default,
  coverageTargets: coverage_targets_library_default,
  distributionTargets: distribution_targets_library_default,
  taskRegistry: task_registry_library_default,
  semantic: {
    library: percentage_semantic_library_default,
    scenarioMap: scenario_map_default,
    compatibilityMap: compatibility_map_default,
    frequencyModel: frequency_model_default,
    grammarRules: grammar_rules_default
  }
};
function getQuestionLanguageIds(cpId, language) {
  return Object.keys(PCT_001_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families ?? {});
}
function getCommonQuestionLanguageIds(cpId) {
  const [first, ...rest] = PCT_001_LANGUAGES.map((language) => new Set(getQuestionLanguageIds(cpId, language)));
  return [...first ?? /* @__PURE__ */ new Set()].filter((id) => rest.every((set) => set.has(id)));
}
function getQuestionEntry(cpId, questionLanguageId, language) {
  const entry = PCT_001_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families[questionLanguageId];
  if (!entry) throw new Error(`Missing question language ${language}:${cpId}:${questionLanguageId}`);
  return entry;
}
function getTaskRegistryEntry(cpId, questionLanguageId) {
  const entry = PCT_001_LIBRARY_REGISTRY.taskRegistry.entries[questionLanguageId];
  if (!entry) throw new Error(`Missing task registry entry ${questionLanguageId}`);
  if (entry.cpId !== cpId) throw new Error(`Task registry CP mismatch ${cpId}:${questionLanguageId}`);
  return entry;
}
function getTaskKind(cpId, questionLanguageId) {
  return getTaskRegistryEntry(cpId, questionLanguageId).taskKind;
}
function getAnswerType(cpId, questionLanguageId) {
  return getTaskRegistryEntry(cpId, questionLanguageId).answerType;
}
function getRequiredVariables(cpId, questionLanguageId) {
  return [...getTaskRegistryEntry(cpId, questionLanguageId).requiredVariables];
}
function getExplanationSteps(cpId, taskKind, language, variantKey = 0) {
  const entry = PCT_001_LIBRARY_REGISTRY.explanation[language][cpId];
  if (!entry) throw new Error(`Missing explanation ${language}:${cpId}`);
  const family = entry.taskExplanations?.[taskKind];
  if (!family) throw new Error(`Missing task explanation ${language}:${cpId}:${taskKind}`);
  const resolved = family.aliasOf ? entry.taskExplanations?.[family.aliasOf] : family;
  const variants = resolved?.variants?.filter((variant) => variant.length > 0) ?? [];
  if (variants.length > 0) return [...variants[Math.abs(variantKey) % variants.length]];
  if (!resolved?.steps?.length) throw new Error(`Missing task explanation steps ${language}:${cpId}:${taskKind}`);
  return [...resolved.steps];
}
function getExplanationVariantCount(cpId, taskKind, language) {
  const entry = PCT_001_LIBRARY_REGISTRY.explanation[language][cpId];
  const family = entry?.taskExplanations?.[taskKind];
  const resolved = family?.aliasOf ? entry?.taskExplanations?.[family.aliasOf] : family;
  return resolved?.variants?.length ?? (resolved?.steps?.length ? 1 : 0);
}
function getExplanationId(cpId) {
  const ordinal = PCT_001_CP_IDS.indexOf(cpId) + 1;
  return `PCT-ES-${String(ordinal).padStart(3, "0")}`;
}
function extractPlaceholders(template) {
  return [...template.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);
}
function renderTemplate(template, values) {
  const rendered = template.replace(/\{([^}]+)\}/g, (_match, key) => {
    const value2 = values[key];
    if (typeof value2 !== "string" && typeof value2 !== "number") {
      throw new Error(`Missing placeholder ${key}`);
    }
    return String(value2);
  });
  return rendered.replace(/\b(\w+s)'s\b/gi, "$1'");
}
function buildPct001SemanticTrace(context) {
  if (!context) {
    return {
      scenarioId: "none",
      semanticDomain: "none",
      entityIds: {},
      frequencyMetadata: {},
      grammarMetadata: {}
    };
  }
  const entityEntries = Object.entries(context.entities);
  return {
    scenarioId: context.scenario,
    semanticDomain: context.scenario,
    entityIds: Object.fromEntries(entityEntries.map(([role, entity]) => [`${role}Id`, entity.id])),
    frequencyMetadata: Object.fromEntries(
      entityEntries.map(([role, entity]) => [
        role,
        PCT_001_LIBRARY_REGISTRY.semantic.frequencyModel.assignments[entity.id] ?? entity.frequency ?? "common"
      ])
    ),
    grammarMetadata: Object.fromEntries(
      entityEntries.map(([role, entity]) => [
        role,
        {
          gender: entity.gender ?? "neutral",
          numberType: entity.numberType ?? "unknown"
        }
      ])
    )
  };
}
function validatePct001Libraries() {
  const failures = [];
  if (PCT_001_LIBRARY_REGISTRY.taskRegistry.archetypeId !== PCT_001_ARCHETYPE_ID) failures.push("Task registry archetype mismatch.");
  for (const cpId of PCT_001_CP_IDS) {
    for (const language of PCT_001_LANGUAGES) {
      if (!PCT_001_LIBRARY_REGISTRY.questionLanguage[language][cpId]) failures.push(`Missing QL ${language}:${cpId}`);
      if (!PCT_001_LIBRARY_REGISTRY.explanation[language][cpId]) failures.push(`Missing ES ${language}:${cpId}`);
      for (const questionLanguageId of getQuestionLanguageIds(cpId, language)) {
        const registryEntry = PCT_001_LIBRARY_REGISTRY.taskRegistry.entries[questionLanguageId];
        if (!registryEntry) failures.push(`Missing task registry ${questionLanguageId}`);
        else if (registryEntry.cpId !== cpId) failures.push(`Task registry CP mismatch ${questionLanguageId}`);
      }
    }
    for (const questionLanguageId of getCommonQuestionLanguageIds(cpId)) {
      const required = new Set(getRequiredVariables(cpId, questionLanguageId));
      const placeholderSets = PCT_001_LANGUAGES.map((language) => new Set(extractPlaceholders(getQuestionEntry(cpId, questionLanguageId, language).template)));
      for (const variable of required) {
        if (!placeholderSets.every((set) => set.has(variable))) failures.push(`Required placeholder missing ${questionLanguageId}:${variable}`);
      }
      const [first, ...rest] = placeholderSets;
      if (first && rest.some((set) => first.size !== set.size || [...first].some((value2) => !set.has(value2)))) {
        failures.push(`Cross-language placeholder mismatch ${questionLanguageId}`);
      }
    }
  }
  return { valid: failures.length === 0, failures };
}

// src/quant-v4/common/language-coverage.ts
var LOCALIZED_QUESTION_LANGUAGE_REGISTRY = {
  "PCT-001": {
    hi: [
      ...[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1e3, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900].flatMap(
        (offset) => [1, 2, 3, 4, 9].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`)
      ),
      ...[0, 100, 200, 300, 400].flatMap(
        (offset) => [5, 6, 7, 8].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`)
      ),
      ...[0, 100, 200, 300, 400].flatMap(
        (offset) => [10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`)
      ),
      ...[0, 100, 200, 300, 400].flatMap(
        (offset) => [20, 21, 22, 23, 24, 25, 26, 27].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`)
      ),
      ...[0, 100, 200, 300, 400].flatMap(
        (offset) => [28, 29, 30, 31, 32, 33, 34, 35].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`)
      )
    ],
    pa: [
      ...[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1e3, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900].flatMap(
        (offset) => [1, 2, 3, 4, 9].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`)
      ),
      ...[0, 100, 200, 300, 400].flatMap(
        (offset) => [5, 6, 7, 8].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`)
      ),
      ...[0, 100, 200, 300, 400].flatMap(
        (offset) => [10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`)
      ),
      ...[0, 100, 200, 300, 400].flatMap(
        (offset) => [20, 21, 22, 23, 24, 25, 26, 27].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`)
      ),
      ...[0, 100, 200, 300, 400].flatMap(
        (offset) => [28, 29, 30, 31, 32, 33, 34, 35].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`)
      )
    ]
  },
  "PCT-002": {
    hi: Array.from(
      { length: 150 },
      (_, index) => `PCT-QL-${String(index + 1).padStart(3, "0")}`
    ),
    pa: Array.from(
      { length: 150 },
      (_, index) => `PCT-QL-${String(index + 1).padStart(3, "0")}`
    )
  }
};
function getLocalizedQuestionLanguageIdSet(packageId, language) {
  return new Set(LOCALIZED_QUESTION_LANGUAGE_REGISTRY[packageId]?.[language] ?? []);
}
function isQlLocalized(packageId, qlId, language) {
  if (language === "en") return true;
  return getLocalizedQuestionLanguageIdSet(packageId, language).has(qlId);
}
function getLocalizedQuestionLanguageIds(packageId, language, englishIds) {
  if (language === "en") return [...englishIds];
  const localizedSet = getLocalizedQuestionLanguageIdSet(packageId, language);
  return englishIds.filter((qlId) => localizedSet.has(qlId));
}

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/parameter-generator.ts
function pick(items, seed) {
  return items[stableBucket(seed, items.length)];
}
function pickWeighted(items, getWeight, seed) {
  const weights = items.map(getWeight);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let threshold = stableBucket(seed, 1e4) / 1e4 * totalWeight;
  for (let i = 0; i < items.length; i++) {
    threshold -= weights[i];
    if (threshold <= 0) return items[i];
  }
  return items[0];
}
function rangeValue(name, difficulty, seed) {
  const entry = variable_ranges_library_default.variables[name];
  const values = entry[difficulty.toLowerCase()] ?? entry.medium ?? entry.easy ?? entry.hard ?? [10];
  return pick(values, seed);
}
function variableDomain(name, difficulty, seed) {
  if (name in variable_ranges_library_default.variables) return rangeValue(name, difficulty, seed);
  const domains = {
    value: [120, 200, 300, 450, 600, 800, 1200, 2400, 6e3],
    value1: [100, 150, 200, 250, 300, 400, 500, 600],
    rate1: [10, 15, 20, 25, 30, 40, 45, 50, 60, 80],
    rate2: [10, 15, 20, 25, 30, 40, 50, 60],
    rate3: [10, 15, 20, 25],
    newRate: [10, 20, 25, 40, 50, 60, 75],
    passRate: [30, 33, 35, 40, 50],
    marksObtained: [120, 135, 150, 180, 210, 240],
    failMargin: [5, 10, 15, 20, 25],
    marks: [120, 150, 180, 240, 300],
    totalPopulation: [1e3, 2e3, 5e3, 8e3, 12e3],
    totalWeight: [40, 50, 80, 100, 120],
    totalQuantity: [50, 80, 100, 120, 150],
    waterRate: [75, 80, 85, 90],
    dryWaterRate: [10, 15, 20, 25]
  };
  return pick(domains[name] ?? [10, 20, 25, 40, 50, 100], seed);
}
function buildRequiredVariables(requiredVariables, difficulty, seed) {
  return Object.fromEntries(requiredVariables.map((name) => [name, variableDomain(name, difficulty, `${seed}:${name}`)]));
}
function chooseGreaterThan(name, threshold, difficulty, seed) {
  const values = Array.from({ length: 80 }, (_value, index) => variableDomain(name, difficulty, `${seed}:${index}`)).filter((value2) => Number(value2) > threshold && Number(value2) < 100);
  return Number(pick(values.length ? values : [threshold + 10], `${seed}:gt`));
}
function chooseLessThan(name, threshold, difficulty, seed) {
  const values = Array.from({ length: 80 }, (_value, index) => variableDomain(name, difficulty, `${seed}:${index}`)).filter((value2) => Number(value2) > 0 && Number(value2) < threshold);
  return Number(pick(values.length ? values : [Math.max(5, threshold / 2)], `${seed}:lt`));
}
function gcd2(a, b) {
  a = Math.round(Math.abs(a) * 1e4);
  b = Math.round(Math.abs(b) * 1e4);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return (a || 1) / 1e4;
}
function getDivisors(num2) {
  const divisors = [];
  for (let i = 1; i <= Math.sqrt(num2); i++) {
    if (num2 % i === 0) {
      divisors.push(i);
      if (num2 / i !== i) divisors.push(num2 / i);
    }
  }
  return divisors.sort((a, b) => a - b);
}
function isCountLikeTemplate(template) {
  return /\b(population|residents?|students?|passengers?|employees?|workers?|applicants?|voters?|items?|cartons?|boxes?|bags?|books?|accounts?|users?|inventory)\b/i.test(template);
}
function isWholeNumber(value2) {
  return Math.abs(value2 - Math.round(value2)) < 1e-9;
}
function chooseCompoundFriendlyInitialValue(taskKind, percentageRate, seed) {
  const candidatePool = [
    100,
    120,
    125,
    150,
    160,
    180,
    200,
    240,
    250,
    300,
    320,
    400,
    480,
    500,
    600,
    625,
    640,
    720,
    750,
    800,
    900,
    960,
    1e3,
    1200,
    1250,
    1500,
    1600,
    1800,
    2e3,
    2400,
    2500,
    3e3,
    3125,
    3200,
    4e3,
    5e3,
    6250,
    7500,
    8e3,
    1e4,
    12e3,
    12500,
    15e3,
    2e4
  ];
  const factor = taskKind === "compoundGrowth" ? ((100 + percentageRate) / 100) ** 2 : ((100 - percentageRate) / 100) ** 2;
  const compatible = candidatePool.filter((initialValue) => isWholeNumber(initialValue * factor));
  return pick(compatible.length ? compatible : candidatePool, `${seed}:compound-friendly`);
}
function choosePartBelowBase(baseValue, seed) {
  const ratePool = [10, 15, 20, 25, 30, 40, 50, 60, 75];
  const candidates = ratePool.map((rate) => ({ rate, value: baseValue * rate / 100 })).filter((candidate) => candidate.value > 0 && candidate.value < baseValue && isWholeNumber(candidate.value));
  return pick(candidates.length ? candidates : [{ rate: 50, value: Math.max(1, Math.floor(baseValue / 2)) }], `${seed}:part-below-base`).value;
}
function constrainVariables(taskKind, variables, difficulty, seed, template = "") {
  const output = { ...variables };
  if (taskKind === "winnerVotes") {
    const percentageRate = chooseGreaterThan("percentageRate", 50, difficulty, `${seed}:winner`);
    output.percentageRate = percentageRate;
    const totalVotes = pick([1e3, 2e3, 3e3, 4e3, 5e3, 6e3, 8e3, 1e4, 12e3, 15e3, 2e4], `${seed}:totVotes`);
    output.voteDifference = Math.round(totalVotes * (2 * percentageRate - 100) / 100);
  }
  if (taskKind === "cancelledVotes") {
    const rate1 = chooseLessThan("rate1", 50, difficulty, `${seed}:cancelledRate1`);
    const rate2 = chooseGreaterThan("rate2", 50, difficulty, `${seed}:cancelledRate2`);
    output.rate1 = rate1;
    output.rate2 = rate2;
    const totalVotes = pick([5e3, 1e4, 12e3, 15e3, 2e4, 25e3, 3e4], `${seed}:totVotes`);
    output.voteDifference = Math.round(totalVotes * (1 - rate1 / 100) * (2 * rate2 - 100) / 100);
  }
  if (taskKind === "loserVotes") {
    const rate1 = chooseLessThan("rate1", 50, difficulty, `${seed}:loser`);
    output.rate1 = rate1;
    const totalVotes = pick([1e3, 2e3, 3e3, 4e3, 5e3, 6e3, 8e3, 1e4, 12e3, 15e3, 2e4], `${seed}:totVotes`);
    output.voteDifference = Math.round(totalVotes * (100 - 2 * rate1) / 100);
  }
  if (taskKind === "incomePartition") {
    const rate1 = chooseLessThan("rate1", 40, difficulty, `${seed}:income1`);
    const rate2 = chooseLessThan("rate2", 35, difficulty, `${seed}:income2`);
    const rate3 = chooseLessThan("rate3", 25, difficulty, `${seed}:income3`);
    output.rate1 = rate1;
    output.rate2 = rate2;
    output.rate3 = rate3;
    const totalIncome = pick([2e3, 3e3, 4e3, 5e3, 6e3, 8e3, 1e4, 12e3, 15e3, 2e4, 24e3, 3e4], `${seed}:totIncome`);
    output.value = Math.round(totalIncome * (100 - rate1 - rate2 - rate3) / 100);
  }
  if (taskKind === "twoShareRemainder") {
    const rate1 = chooseLessThan("rate1", 45, difficulty, `${seed}:share1`);
    const rate2 = chooseLessThan("rate2", 40, difficulty, `${seed}:share2`);
    output.rate1 = rate1;
    output.rate2 = rate2;
    const totalAmount = pick([1e3, 2e3, 3e3, 4e3, 5e3, 6e3, 8e3, 1e4, 12e3, 15e3, 16e3, 2e4, 24e3], `${seed}:totAmount`);
    output.value = Math.round(totalAmount * (100 - rate1 - rate2) / 100);
  }
  if (taskKind === "successiveExpense") {
    const rate1 = chooseLessThan("rate1", 50, difficulty, `${seed}:expense1`);
    const rate2 = chooseLessThan("rate2", 50, difficulty, `${seed}:expense2`);
    output.rate1 = rate1;
    output.rate2 = rate2;
    const totalIncome = pick([4e3, 6e3, 8e3, 1e4, 12e3, 15e3, 2e4, 24e3, 3e4, 4e4], `${seed}:totIncome`);
    output.value = Math.round(totalIncome * (1 - rate1 / 100) * (1 - rate2 / 100));
  }
  if (taskKind === "reverseIncrease") {
    const percentageRate = variableDomain("percentageRate", difficulty, `${seed}:rate`);
    output.percentageRate = percentageRate;
    const originalValue = pick([100, 200, 300, 400, 500, 600, 800, 1e3, 1200, 1500, 2e3, 2500, 3e3, 4e3, 5e3, 1e4], `${seed}:orig`);
    output.finalValue = Math.round(originalValue * (100 + percentageRate) / 100);
  }
  if (taskKind === "reverseDecrease") {
    const percentageRate = chooseLessThan("percentageRate", 80, difficulty, `${seed}:rate`);
    output.percentageRate = percentageRate;
    const originalValue = pick([100, 200, 300, 400, 500, 600, 800, 1e3, 1200, 1500, 2e3, 2500, 3e3, 4e3, 5e3, 1e4], `${seed}:orig`);
    output.finalValue = Math.round(originalValue * (100 - percentageRate) / 100);
  }
  if (taskKind === "increaseByAmount") {
    const percentageRate = variableDomain("percentageRate", difficulty, `${seed}:rate`);
    output.percentageRate = percentageRate;
    const originalValue = pick([100, 200, 300, 400, 500, 600, 800, 1e3, 1200, 1500, 2e3, 2500, 3e3, 4e3, 5e3, 1e4], `${seed}:orig`);
    output.value = Math.round(originalValue * percentageRate / 100);
  }
  if (taskKind === "differenceOfPercents") {
    const ratePool = [10, 15, 20, 25, 30, 40, 45, 50, 60, 80];
    const rate1 = Number(output.rate1 ?? variableDomain("rate1", difficulty, `${seed}:rate1`));
    const distinctRate2 = ratePool.filter((rate) => rate !== rate1);
    output.rate1 = rate1;
    output.rate2 = pick(
      distinctRate2.length > 0 ? distinctRate2 : [rate1 + 5],
      `${seed}:rate2`
    );
  }
  if (taskKind === "passMarks") {
    const passRate = variableDomain("passRate", difficulty, `${seed}:rate`);
    output.passRate = passRate;
    const maxMarks = pick([200, 300, 400, 500, 600, 800, 1e3], `${seed}:max`);
    const passing = maxMarks * passRate / 100;
    const failMargin = pick([5, 10, 15, 20], `${seed}:fail`);
    output.failMargin = failMargin;
    output.marksObtained = Math.max(10, passing - failMargin);
  }
  if (taskKind === "partToTotal") {
    const rate1 = chooseLessThan("rate1", 80, difficulty, `${seed}:rate`);
    output.rate1 = rate1;
    const total = pick([100, 200, 300, 400, 500, 600, 800, 1e3, 1200, 1500, 2e3, 2500, 3e3, 4e3, 5e3], `${seed}:total`);
    output.value = Math.round(total * (100 - rate1) / 100);
  }
  if (taskKind === "moreMarksBase") {
    const rate1 = variableDomain("rate1", difficulty, `${seed}:rate`);
    output.rate1 = rate1;
    const baseMarks = pick([100, 120, 150, 180, 200, 240, 300, 400, 500], `${seed}:base`);
    output.marks = Math.round(baseMarks * (100 + rate1) / 100);
  }
  if (taskKind === "dryFromFresh") {
    const waterRate = chooseGreaterThan("waterRate", 50, difficulty, `${seed}:fresh`);
    const dryWaterRate = chooseLessThan("dryWaterRate", Number(waterRate), difficulty, `${seed}:dry`);
    output.waterRate = waterRate;
    output.dryWaterRate = dryWaterRate;
    const solidFresh = 100 - Number(waterRate);
    const solidDry = 100 - Number(dryWaterRate);
    const denom = solidDry / gcd2(solidFresh, solidDry);
    const multiplier = pick([1, 2, 3, 4, 5], `${seed}:mult`);
    output.totalQuantity = denom * multiplier * 10;
  }
  if (taskKind === "freshFromDry") {
    const rate1 = chooseGreaterThan("rate1", 50, difficulty, `${seed}:fresh`);
    const rate2 = chooseLessThan("rate2", Number(rate1), difficulty, `${seed}:dry`);
    output.rate1 = rate1;
    output.rate2 = rate2;
    const solidFresh = 100 - Number(rate1);
    const solidDry = 100 - Number(rate2);
    const denom = solidFresh / gcd2(solidDry, solidFresh);
    const multiplier = pick([1, 2, 3, 4, 5], `${seed}:mult`);
    output.value = denom * multiplier * 10;
  }
  if (taskKind === "dilutionAddWater") {
    const percentageRate = variableDomain("percentageRate", difficulty, `${seed}:rate`);
    const newRate = chooseLessThan("newRate", Number(percentageRate), difficulty, `${seed}:dilute`);
    output.percentageRate = percentageRate;
    output.newRate = newRate;
    const denom = newRate / gcd2(percentageRate, newRate);
    const multiplier = pick([1, 2, 3, 4, 5], `${seed}:mult`);
    output.totalMixture = denom * multiplier * 10;
  }
  if (taskKind === "addSolute" || taskKind === "addPureComponent") {
    const percentageRate = variableDomain("percentageRate", difficulty, `${seed}:rate`);
    const newRate = chooseGreaterThan("newRate", Number(percentageRate), difficulty, `${seed}:strengthen`);
    output.percentageRate = percentageRate;
    output.newRate = newRate;
    const diff = newRate - percentageRate;
    const denom = (100 - newRate) / gcd2(diff, 100 - newRate);
    const multiplier = pick([1, 2, 3, 4, 5], `${seed}:mult`);
    output.totalMixture = denom * multiplier * 10;
  }
  if (taskKind === "evaporationOriginal") {
    const percentageRate = variableDomain("percentageRate", difficulty, `${seed}:rate`);
    const newRate = chooseGreaterThan("newRate", Number(percentageRate), difficulty, `${seed}:strengthen`);
    output.percentageRate = percentageRate;
    output.newRate = newRate;
    const diff = newRate - percentageRate;
    const denom = diff / gcd2(newRate, diff);
    const multiplier = pick([1, 2, 3, 4, 5], `${seed}:mult`);
    output.value = denom * multiplier * 10;
  }
  if (taskKind === "dilutedPercent") {
    const totalMixture = pick([100, 200, 300, 400, 500], `${seed}:mixture`);
    const percentageRate = variableDomain("percentageRate", difficulty, `${seed}:rate`);
    output.totalMixture = totalMixture;
    output.percentageRate = percentageRate;
    const prod = totalMixture * percentageRate;
    const divs = getDivisors(prod).filter((d) => d > totalMixture && d <= totalMixture * 3);
    const div = pick(divs.length ? divs : [totalMixture * 1.5], `${seed}:div`);
    output.value = div - totalMixture;
  }
  if ((taskKind === "compoundGrowth" || taskKind === "compoundDecay") && isCountLikeTemplate(template)) {
    const percentageRate = Number(output.percentageRate ?? 0);
    if (Number.isFinite(percentageRate) && percentageRate > 0) {
      output.initialValue = chooseCompoundFriendlyInitialValue(taskKind, percentageRate, `${seed}:count-compound`);
    }
  }
  if (taskKind === "valueAsPercent") {
    const baseValue = Number(output.baseValue ?? 0);
    const partValue = Number(output.value ?? 0);
    if (Number.isFinite(baseValue) && baseValue > 0 && (!Number.isFinite(partValue) || partValue >= baseValue)) {
      output.value = choosePartBelowBase(baseValue, `${seed}:part-below-base`);
    }
  }
  return output;
}
function getSelectableQuestionLanguageIds(cpId, language) {
  const englishIds = language === "en" ? getQuestionLanguageIds(cpId, "en") : getCommonQuestionLanguageIds(cpId);
  return getLocalizedQuestionLanguageIds("PCT-001", language, englishIds);
}
function selectQuestionLanguageId(cpId, language, seed, difficultyBand) {
  const ids = getSelectableQuestionLanguageIds(cpId, language);
  if (ids.length === 0) {
    throw new Error(`No localized question languages available for ${language}:${cpId} in PCT-001.`);
  }
  const filtered = difficultyBand ? ids.filter((questionLanguageId) => getQuestionEntry(cpId, questionLanguageId, language).difficulty === difficultyBand) : ids;
  const source = filtered.length > 0 ? filtered : ids;
  return source[stableBucket(seed, source.length)];
}
function arraysEqual(left, right) {
  return left.length === right.length && left.every((value2, index) => value2 === right[index]);
}
function selectCompatibleQuestionLanguageId(cpId, language, requestedQuestionLanguageId, seed) {
  if (language === "en") {
    return getQuestionLanguageIds(cpId, "en").includes(requestedQuestionLanguageId) ? requestedQuestionLanguageId : null;
  }
  if (!isQlLocalized("PCT-001", requestedQuestionLanguageId, language)) {
    return null;
  }
  const requestedRegistryEntry = getTaskRegistryEntry(cpId, requestedQuestionLanguageId);
  const requestedDifficulty = getQuestionEntry(cpId, requestedQuestionLanguageId, "en").difficulty;
  const compatibleIds = getCommonQuestionLanguageIds(cpId).filter((questionLanguageId) => {
    const sharedRegistryEntry = getTaskRegistryEntry(cpId, questionLanguageId);
    return sharedRegistryEntry.taskKind === requestedRegistryEntry.taskKind && sharedRegistryEntry.answerType === requestedRegistryEntry.answerType && arraysEqual(sharedRegistryEntry.requiredVariables, requestedRegistryEntry.requiredVariables) && getQuestionEntry(cpId, questionLanguageId, language).difficulty === requestedDifficulty;
  });
  if (compatibleIds.length === 0) return null;
  return compatibleIds[stableBucket(`${seed}:compatible`, compatibleIds.length)];
}
function selectSemanticContext(cpId, seed) {
  const scenario = PCT_001_LIBRARY_REGISTRY.semantic.scenarioMap[cpId] || "school";
  const domain = PCT_001_LIBRARY_REGISTRY.semantic.library.domains[scenario];
  const freqModel = PCT_001_LIBRARY_REGISTRY.semantic.frequencyModel;
  const getWeight = (entity) => {
    const freq = freqModel.assignments[entity.id] || entity.frequency || "common";
    return freqModel.probabilities[freq] || 0.1;
  };
  const entities = {};
  const availableEntities = domain.entities;
  const primary = pickWeighted(availableEntities, getWeight, `${seed}:primary`);
  entities.primary = primary;
  const allowed = PCT_001_LIBRARY_REGISTRY.semantic.compatibilityMap.allowed_pairings[primary.id];
  if (allowed && allowed.length > 0) {
    const secondaryList = availableEntities.filter((e) => allowed.includes(e.id));
    if (secondaryList.length > 0) {
      entities.secondary = pickWeighted(secondaryList, getWeight, `${seed}:secondary`);
    }
  }
  if (!entities.secondary && availableEntities.length > 1) {
    const others = availableEntities.filter((e) => e.id !== primary.id);
    entities.secondary = pickWeighted(others, getWeight, `${seed}:fallback_secondary`);
  }
  return { scenario, entities };
}
function generatePct001Parameters(cpId, input = {}) {
  const language = input.language ?? "en";
  const seed = input.seed ?? `PCT-001:${cpId}`;
  const selectableQuestionLanguageIds = getSelectableQuestionLanguageIds(cpId, language);
  if (selectableQuestionLanguageIds.length === 0) {
    throw new Error(`No localized question languages available for ${language}:${cpId} in PCT-001.`);
  }
  if (input.questionLanguageId && !isQlLocalized("PCT-001", input.questionLanguageId, language)) {
    throw new Error(`Question language ${input.questionLanguageId} is not localized for ${language} in PCT-001.`);
  }
  const questionLanguageId = input.questionLanguageId && selectableQuestionLanguageIds.includes(input.questionLanguageId) ? input.questionLanguageId : input.questionLanguageId ? selectCompatibleQuestionLanguageId(cpId, language, input.questionLanguageId, seed) ?? selectQuestionLanguageId(cpId, language, `${seed}:ql`, input.difficultyBand) : selectQuestionLanguageId(cpId, language, `${seed}:ql`, input.difficultyBand);
  const questionEntry = getQuestionEntry(cpId, questionLanguageId, language);
  const difficultyBand = questionEntry.difficulty;
  const taskKind = getTaskKind(cpId, questionLanguageId);
  const answerType = getAnswerType(cpId, questionLanguageId);
  const requiredVariables = getRequiredVariables(cpId, questionLanguageId);
  const semanticContext = selectSemanticContext(cpId, seed);
  const variables = constrainVariables(
    taskKind,
    buildRequiredVariables(requiredVariables, difficultyBand, seed),
    difficultyBand,
    seed,
    questionEntry.template
  );
  return {
    archetypeId: PCT_001_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `${cpId}:${questionLanguageId}:${stableBucket(seed, 1e5)}`,
    questionLanguageId,
    explanationId: getExplanationId(cpId),
    language,
    difficultyBand,
    taskKind,
    answerType,
    requiredVariables,
    variables,
    semanticContext,
    sourceTrace: {
      questionLanguageSource: `question-language.${language}.json`,
      explanationSource: `explanation.${language}.json`,
      variableRangeSource: "variable-ranges.library.json",
      semanticSource: "percentage-semantic-library.json"
    }
  };
}
function getPct001ActiveCanonicalProblemIds() {
  return [...PCT_001_CP_IDS];
}

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/eev2/percent-of-known-number/evidence.ts
var PERCENT_OF_KNOWN_NUMBER_EVIDENCE_VERSION = "1.0.0";
var PERCENT_OF_KNOWN_NUMBER_METHOD_FAMILY = "UNIT_VALUE";

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/solver.ts
function value(parameters, name) {
  return Number(parameters.variables[name]);
}
function formatByAnswerType(parameters, numericAnswer) {
  if (parameters.answerType === "PERCENT") return formatPercent(numericAnswer);
  if (parameters.answerType === "COUNT") return formatNumber(Math.round(numericAnswer));
  return formatNumber(numericAnswer);
}
function resolveEducationalQuantityUnit(parameters) {
  const semanticEntity = Object.values(parameters.semanticContext?.entities ?? {})[0];
  if (semanticEntity?.id) return semanticEntity.id;
  if (parameters.answerType === "COUNT") return "count";
  return "abstract-number";
}
function solvePct001(parameters) {
  const t = parameters.taskKind;
  let numericAnswer = null;
  let answer = "";
  let educationalEvidence;
  if (t === "percentOf" || t === "directRelation") numericAnswer = percentOf(value(parameters, "percentageRate"), value(parameters, "baseValue"));
  else if (t === "percentToFraction") answer = formatFraction(value(parameters, "percentageRate") * 100, 1e4);
  else if (t === "valueAsPercent") numericAnswer = value(parameters, "value") / value(parameters, "baseValue") * 100;
  else if (t === "moreToLess") numericAnswer = value(parameters, "percentageRate") / (100 + value(parameters, "percentageRate")) * 100;
  else if (t === "lessToMore") numericAnswer = value(parameters, "percentageRate") / (100 - value(parameters, "percentageRate")) * 100;
  else if (t === "ratioFromPercentEquality") answer = formatRatio(value(parameters, "rate2"), value(parameters, "rate1"));
  else if (t === "reversePercent") numericAnswer = value(parameters, "value") * 100 / value(parameters, "percentageRate");
  else if (t === "increaseNewValue") numericAnswer = value(parameters, "baseValue") * (100 + value(parameters, "percentageRate")) / 100;
  else if (t === "decreaseNewValue") numericAnswer = value(parameters, "baseValue") * (100 - value(parameters, "percentageRate")) / 100;
  else if (t === "reverseIncrease") numericAnswer = value(parameters, "finalValue") * 100 / (100 + value(parameters, "percentageRate"));
  else if (t === "reverseDecrease") numericAnswer = value(parameters, "finalValue") * 100 / (100 - value(parameters, "percentageRate"));
  else if (t === "increaseByAmount") numericAnswer = value(parameters, "value") * 100 / value(parameters, "percentageRate");
  else if (t === "percentOfKnownNumber") {
    const knownUnitCount = value(parameters, "rate1");
    const knownQuantity = value(parameters, "value1");
    const targetUnitCount = value(parameters, "rate2");
    if (knownUnitCount <= 0) {
      throw new RangeError("percentOfKnownNumber requires a positive known unit count.");
    }
    if (![knownUnitCount, knownQuantity, targetUnitCount].every(Number.isFinite)) {
      throw new RangeError("percentOfKnownNumber requires finite source values.");
    }
    const singleUnitValue = knownQuantity / knownUnitCount;
    const targetQuantity = singleUnitValue * targetUnitCount;
    const quantityUnit = resolveEducationalQuantityUnit(parameters);
    numericAnswer = targetQuantity;
    educationalEvidence = {
      evidenceId: `${parameters.questionId}:unit-value-evidence`,
      evidenceVersion: PERCENT_OF_KNOWN_NUMBER_EVIDENCE_VERSION,
      taskKind: "percentOfKnownNumber",
      methodFamily: PERCENT_OF_KNOWN_NUMBER_METHOD_FAMILY,
      sourceValues: {
        knownUnitCount,
        knownQuantity,
        targetUnitCount
      },
      derivedValues: {
        singleUnitValue,
        targetQuantity
      },
      exactValues: {
        singleUnitValue: {
          numerator: knownQuantity,
          denominator: knownUnitCount
        },
        targetQuantity: {
          numerator: knownQuantity * targetUnitCount,
          denominator: knownUnitCount
        }
      },
      units: {
        knownUnitCount: "percentage-point",
        knownQuantity: quantityUnit,
        targetUnitCount: "percentage-point",
        singleUnitValue: quantityUnit,
        targetQuantity: quantityUnit
      },
      metadata: {
        exactness: "rational",
        roundingPolicy: "defer-to-presentation",
        countIntegrity: parameters.answerType === "COUNT" || Object.values(parameters.semanticContext?.entities ?? {}).some(
          (entity) => entity.numberType === "countable"
        ) ? "required" : "not-required"
      }
    };
  } else if (t === "differenceOfPercents") numericAnswer = value(parameters, "value") * 100 / Math.abs(value(parameters, "rate1") - value(parameters, "rate2"));
  else if (t === "restoreAfterDecrease") numericAnswer = value(parameters, "percentageRate") * 100 / (100 - value(parameters, "percentageRate"));
  else if (t === "successiveIncrease") numericAnswer = ((1 + value(parameters, "rate1") / 100) * (1 + value(parameters, "rate2") / 100) - 1) * 100;
  else if (t === "successiveChange") numericAnswer = ((1 + value(parameters, "rate1") / 100) * (1 - value(parameters, "rate2") / 100) - 1) * 100;
  else if (t === "compoundGrowth") numericAnswer = value(parameters, "initialValue") * (1 + value(parameters, "percentageRate") / 100) ** 2;
  else if (t === "compoundDecay") numericAnswer = value(parameters, "initialValue") * (1 - value(parameters, "percentageRate") / 100) ** 2;
  else if (t === "areaChange") numericAnswer = ((1 + value(parameters, "rate1") / 100) * (1 + value(parameters, "rate2") / 100) - 1) * 100;
  else if (t === "squareAreaChange") numericAnswer = ((1 + value(parameters, "percentageRate") / 100) ** 2 - 1) * 100;
  else if (t === "invarianceDecrease" || t === "restoreAfterIncrease") numericAnswer = value(parameters, t === "restoreAfterIncrease" ? "rate1" : "percentageRate") * 100 / (100 + value(parameters, t === "restoreAfterIncrease" ? "rate1" : "percentageRate"));
  else if (t === "invarianceIncrease") numericAnswer = value(parameters, "percentageRate") * 100 / (100 - value(parameters, "percentageRate"));
  else if (t === "revenueChange") numericAnswer = ((1 - value(parameters, "rate1") / 100) * (1 + value(parameters, "rate2") / 100) - 1) * 100;
  else if (t === "circleAreaDecrease") numericAnswer = (1 - (1 - value(parameters, "percentageRate") / 100) ** 2) * 100;
  else if (t === "incomePartition") numericAnswer = value(parameters, "value") * 100 / (100 - value(parameters, "rate1") - value(parameters, "rate2") - value(parameters, "rate3"));
  else if (t === "successiveExpense") numericAnswer = value(parameters, "value") / ((1 - value(parameters, "rate1") / 100) * (1 - value(parameters, "rate2") / 100));
  else if (t === "winnerVotes") numericAnswer = value(parameters, "voteDifference") / ((2 * value(parameters, "percentageRate") - 100) / 100);
  else if (t === "cancelledVotes") numericAnswer = value(parameters, "voteDifference") / ((1 - value(parameters, "rate1") / 100) * ((2 * value(parameters, "rate2") - 100) / 100));
  else if (t === "passMarks") numericAnswer = (value(parameters, "marksObtained") + value(parameters, "failMargin")) * 100 / value(parameters, "passRate");
  else if (t === "partToTotal") numericAnswer = value(parameters, "value") * 100 / (100 - value(parameters, "rate1"));
  else if (t === "complementOfTotal") numericAnswer = value(parameters, "totalPopulation") * (100 - value(parameters, "percentageRate")) / 100;
  else if (t === "moreMarksBase") numericAnswer = value(parameters, "marks") * 100 / (100 + value(parameters, "rate1"));
  else if (t === "twoShareRemainder") numericAnswer = value(parameters, "value") * 100 / (100 - value(parameters, "rate1") - value(parameters, "rate2"));
  else if (t === "loserVotes") numericAnswer = value(parameters, "voteDifference") / ((100 - 2 * value(parameters, "rate1")) / 100);
  else if (t === "dilutionAddWater") numericAnswer = value(parameters, "totalMixture") * value(parameters, "percentageRate") / value(parameters, "newRate") - value(parameters, "totalMixture");
  else if (t === "dryFromFresh") numericAnswer = value(parameters, "totalQuantity") * (100 - value(parameters, "waterRate")) / (100 - value(parameters, "dryWaterRate"));
  else if (t === "addSolute" || t === "addPureComponent") numericAnswer = value(parameters, "totalMixture") * (value(parameters, "newRate") - value(parameters, "percentageRate")) / (100 - value(parameters, "newRate"));
  else if (t === "dilutedPercent") numericAnswer = value(parameters, "totalMixture") * value(parameters, "percentageRate") / (value(parameters, "totalMixture") + value(parameters, "value"));
  else if (t === "freshFromDry") numericAnswer = value(parameters, "value") * (100 - value(parameters, "rate2")) / (100 - value(parameters, "rate1"));
  else if (t === "evaporationOriginal") numericAnswer = value(parameters, "newRate") * value(parameters, "value") / (value(parameters, "newRate") - value(parameters, "percentageRate"));
  else if (t === "alloyComplement") numericAnswer = value(parameters, "totalWeight") * (100 - value(parameters, "percentageRate")) / 100;
  if (!answer) answer = formatByAnswerType(parameters, numericAnswer ?? 0);
  if (answer.includes("/")) {
    const [num2, den] = answer.split("/");
    answer = `$$\\frac{${num2}}{${den}}$$`;
  } else if (answer.includes(":")) {
    answer = `$$${answer.split(":").join(" : ")}$$`;
  } else if (answer.endsWith("%")) {
    answer = `$$${answer.slice(0, -1)}\\%$$`;
  } else {
    answer = `$$${answer}$$`;
  }
  const percentageRate = value(parameters, "percentageRate");
  const rate1 = value(parameters, "rate1");
  const rate2 = value(parameters, "rate2");
  const valueAmount = value(parameters, "value");
  const baseValue = value(parameters, "baseValue");
  const evidence = {
    ...parameters.variables,
    taskKind: t,
    answerType: parameters.answerType,
    answer,
    percentageRate: Number.isFinite(percentageRate) ? percentageRate : rate1,
    largerBase: roundTo(100 + percentageRate, 4),
    smallerBase: roundTo(100 - percentageRate, 4),
    changedBase: roundTo(
      t === "reverseDecrease" || t === "decreaseNewValue" ? 100 - percentageRate : 100 + (Number.isFinite(percentageRate) ? percentageRate : rate1),
      4
    ),
    remainingBase: roundTo(100 - percentageRate, 4),
    changeAmount: roundTo(percentOf(percentageRate, baseValue), 4),
    percentDifference: roundTo(Math.abs(rate1 - rate2), 4),
    firstFactor: roundTo(1 + rate1 / 100, 4),
    secondFactor: roundTo(t === "successiveChange" || t === "revenueChange" ? 1 - rate2 / 100 : 1 + rate2 / 100, 4),
    singleFactor: roundTo(t === "compoundDecay" || t === "circleAreaDecrease" ? 1 - percentageRate / 100 : 1 + percentageRate / 100, 4),
    netFactor: roundTo(
      (1 + rate1 / 100) * (t === "successiveChange" || t === "revenueChange" ? 1 - rate2 / 100 : 1 + rate2 / 100),
      4
    ),
    knownPercentage: roundTo(
      t === "partToTotal" || t === "moreMarksBase" ? 100 - rate1 : t === "incomePartition" ? 100 - rate1 - rate2 - value(parameters, "rate3") : t === "twoShareRemainder" ? 100 - rate1 - rate2 : t === "complementOfTotal" ? 100 - percentageRate : 100 - rate1,
      4
    ),
    loserPercentage: roundTo(100 - percentageRate, 4),
    winnerPercentage: roundTo(100 - rate1, 4),
    gapPercentage: roundTo(
      t === "loserVotes" ? 100 - 2 * rate1 : t === "winnerVotes" ? 2 * percentageRate - 100 : Math.abs(rate1 - rate2),
      4
    ),
    validPercentage: roundTo(100 - rate1, 4),
    effectiveGapPercentage: roundTo((1 - rate1 / 100) * (2 * rate2 - 100), 4),
    passMarksValue: roundTo(value(parameters, "marksObtained") + value(parameters, "failMargin"), 4),
    initialUnchangedAmount: roundTo(
      value(parameters, "totalMixture") * percentageRate / 100 || value(parameters, "totalQuantity") * (100 - value(parameters, "waterRate")) / 100 || value(parameters, "totalWeight") * (100 - percentageRate) / 100,
      4
    ),
    value: Number.isFinite(valueAmount) ? valueAmount : ""
  };
  return {
    answer,
    numericAnswer: numericAnswer === null ? null : roundTo(numericAnswer, 4),
    answerType: parameters.answerType,
    evidence,
    educationalEvidence,
    mathJax: {
      setupLatex: mathJaxLine("setup", `${t}`),
      calculationLatex: mathJaxLine("answer", answer)
    }
  };
}

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/reasoning-graph.ts
function buildPct001ReasoningGraph(parameters, solver) {
  return {
    graphId: `${parameters.questionId}:graph`,
    nodes: [
      { id: "inputs", label: "Captured inputs", value: parameters.variables },
      { id: "task", label: "Selected mathematical task", value: parameters.taskKind },
      { id: "answerType", label: "Declared answer type", value: parameters.answerType },
      { id: "calculation", label: "Computed percentage result", value: solver.evidence },
      { id: "answer", label: "Final answer", value: solver.answer }
    ]
  };
}

// src/quant-v4/common/explanation-engine.ts
var ExplanationValidationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ExplanationValidationError";
  }
};
var FORBIDDEN_PHRASES = [
  "Our objective is",
  "We apply the standard rule",
  "Plugging in the values",
  "Plugging in the parameters",
  "Substituting the parameters",
  "Calculating the final value",
  "We need to calculate the target value",
  "Let's determine the final amount",
  "Using the appropriate formula",
  "The mathematical relationship is",
  "Inserting the given numbers",
  "Solving it yields the final answer",
  "The computed result is",
  "A useful starting point is",
  "The working relation is",
  "This determines",
  "Combining aligned ratios",
  "On simplification",
  "Completing the arithmetic",
  "The numerical result is",
  "Notice the key relation",
  "Observe that",
  "Notice that",
  "Using the above",
  "The required expression becomes",
  "Observe the given relation carefully.",
  "Observe carefully.",
  "Now write the working with the given values.",
  "Now write the working.",
  "Keep the base quantity clear while simplifying.",
  "Keep the base quantity clear.",
  "Substitute the given numbers in the relation.",
  "Substitute the given values.",
  "The calculation gives",
  "The calculation gives.",
  "The final slab result is",
  "The final slab result is.",
  "Now simplify the working carefully.",
  "first group",
  "second group",
  "Male part",
  "Female part",
  "Now simplify",
  "Substitute the numbers",
  "calculation gives"
];
function containsIdentifier(text2, identifier) {
  if (!identifier || identifier.length < 3) return false;
  const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^A-Za-z0-9_])${escaped}([^A-Za-z0-9_]|$)`, "i").test(text2);
}
function validateNoInternalIdentifiers(steps, evidence) {
  const fullText = steps.map((step) => `${step.narrative} ${step.mathLatex ?? ""}`).join(" ");
  const taskKind = String(evidence.derivedValues.taskKind ?? "");
  if (taskKind && containsIdentifier(fullText, taskKind)) {
    throw new ExplanationValidationError(`Internal taskKind leaked into explanation: "${taskKind}"`);
  }
  for (const variableName of Object.keys(evidence.variables)) {
    if (variableName.length < 6) continue;
    if (containsIdentifier(fullText, variableName)) {
      throw new ExplanationValidationError(`Internal variable name leaked into explanation: "${variableName}"`);
    }
  }
}
function validateGenericPhrases(steps) {
  const fullText = steps.map((s) => s.narrative).join(" ").toLowerCase();
  for (const phrase of FORBIDDEN_PHRASES) {
    if (fullText.includes(phrase.toLowerCase())) {
      throw new ExplanationValidationError(`Forbidden phrase detected: "${phrase}"`);
    }
  }
}
function validateEntityConsistency(steps, entities) {
  const fullText = steps.map((s) => s.narrative).join(" ").toLowerCase();
  const entityValues = Object.values(entities).map((e) => e.toLowerCase());
  const fallbacks = ["first group", "second group", "male", "female"];
  for (const fallback of fallbacks) {
    if (fullText.includes(fallback) && !entityValues.includes(fallback)) {
      throw new ExplanationValidationError(`Entity corruption: Found generic fallback "${fallback}" without matching semantic entity.`);
    }
  }
}
function validateEvidenceFidelity(steps, evidence) {
  const fullText = steps.map((s) => `${s.narrative} ${s.mathLatex || ""}`).join(" ");
  const extractedNumbers = fullText.match(/\d+(\.\d+)?/g) || [];
  const allowedNumbers = /* @__PURE__ */ new Set([0, 1, 2, 3, 4, 5, 10, 100, 1e3]);
  const extractFromObject = (obj) => {
    Object.values(obj).forEach((v) => {
      if (typeof v === "number") allowedNumbers.add(v);
      else if (typeof v === "string") {
        const nums = v.match(/\d+(\.\d+)?/g);
        if (nums) nums.forEach((n) => allowedNumbers.add(parseFloat(n)));
      }
    });
  };
  extractFromObject(evidence.variables);
  extractFromObject(evidence.derivedValues);
  if (typeof evidence.answer === "number") allowedNumbers.add(evidence.answer);
  else if (typeof evidence.answer === "string") {
    const nums = evidence.answer.match(/\d+(\.\d+)?/g);
    if (nums) nums.forEach((n) => allowedNumbers.add(parseFloat(n)));
  }
  const rounded = (value2) => Number(value2.toFixed(6));
  for (let round = 0; round < 2 && allowedNumbers.size < 12e3; round += 1) {
    const source = [...allowedNumbers].filter((value2) => Number.isFinite(value2) && Math.abs(value2) <= 1e6);
    const additions = [];
    for (let leftIndex = 0; leftIndex < source.length && additions.length < 12e3; leftIndex += 1) {
      for (let rightIndex = 0; rightIndex < source.length && additions.length < 12e3; rightIndex += 1) {
        const left = source[leftIndex];
        const right = source[rightIndex];
        additions.push(rounded(left + right), rounded(left - right), rounded(left * right));
        if (right !== 0) additions.push(rounded(left / right));
      }
    }
    for (const value2 of additions) {
      if (Number.isFinite(value2) && Math.abs(value2) <= 1e9) allowedNumbers.add(value2);
      if (allowedNumbers.size >= 12e3) break;
    }
  }
  for (const numStr of extractedNumbers) {
    const num2 = parseFloat(numStr);
    if (!allowedNumbers.has(num2)) {
      let found = false;
      for (const allowed of allowedNumbers) {
        if (Math.abs(allowed - num2) < 0.1) {
          found = true;
          break;
        }
      }
      if (!found) {
        throw new ExplanationValidationError(`Hallucination detected: Number ${num2} does not exist in evidence or derived values.`);
      }
    }
  }
}
function validateExplanationPipeline(evidence, renderer) {
  const steps = renderer.render(evidence);
  if (steps.length < 4) {
    throw new ExplanationValidationError("Explanation lacks pedagogical structure (Less than 4 steps).");
  }
  validateGenericPhrases(steps);
  validateNoInternalIdentifiers(steps, evidence);
  validateEntityConsistency(steps, evidence.entities);
  validateEvidenceFidelity(steps, evidence);
  const arithmeticSteps = steps.filter((step) => step.mathLatex?.trim()).length;
  if (arithmeticSteps < 3) {
    throw new ExplanationValidationError("Explanation hides the arithmetic (fewer than three mathematical lines).");
  }
  const proseWords = steps.map((step) => step.narrative).join(" ").trim().split(/\s+/).filter(Boolean).length;
  if (proseWords > arithmeticSteps * 9) {
    throw new ExplanationValidationError("Explanation contains too much commentary for its arithmetic content.");
  }
  const hasFormula = steps.some((s) => s.type === "FORMULA");
  const hasSubstitution = steps.some((s) => s.type === "SUBSTITUTION");
  const hasConclusion = steps.some((s) => s.type === "CONCLUSION");
  if (!hasFormula) {
    throw new ExplanationValidationError("Explanation lacks pedagogical structure (Missing FORMULA step).");
  }
  if (!hasSubstitution) {
    throw new ExplanationValidationError("Explanation lacks pedagogical structure (Missing SUBSTITUTION step).");
  }
  if (!hasConclusion) {
    throw new ExplanationValidationError("Explanation lacks pedagogical structure (Missing CONCLUSION step).");
  }
  if (steps[0].type === "CONCLUSION" || steps[1].type === "CONCLUSION") {
    throw new ExplanationValidationError("Explanation reveals answer too early.");
  }
  return steps;
}
function formatExplanationSteps(steps) {
  return steps.map((step) => {
    let narrative = step.narrative || "";
    let mathLatex = step.mathLatex || "";
    if (narrative) {
      narrative = narrative.replace(/\b(\w+s)'s\b/gi, "$1'");
    }
    if (mathLatex) {
      mathLatex = mathLatex.replace(/\b(\w+s)'s\b/gi, "$1'");
      return `${narrative}

[
\\Rightarrow ${mathLatex}
]`;
    }
    return narrative;
  });
}

// src/quant-v4/common/teacher-renderer.ts
var PROFILES = {
  percentToFraction: profile("The percentage must first be written over 100.", "Reduce the resulting fraction to its lowest terms.", "After cancelling the common factor,", "Hence, the percentage in fractional form is"),
  valueAsPercent: profile("Compare the given value with the total on a base of 100.", "Required percentage = given value \xF7 total \xD7 100.", "Using the figures in the question,", "Hence, the required percentage is"),
  directRelation: profile("The required quantity is the stated percentage of the base quantity.", "Required quantity = percentage \xF7 100 \xD7 base quantity.", "Using the stated percentage and base,", "Hence, the required quantity is"),
  moreToLess: profile("Take the smaller quantity as 100 parts.", "Percentage less is measured on the larger quantity.", "The difference is compared with the larger value,", "Hence, the smaller quantity is less by"),
  lessToMore: profile("Take the larger quantity as 100 parts.", "Percentage more is measured on the smaller quantity.", "The difference is compared with the smaller value,", "Hence, the larger quantity is more by"),
  ratioFromPercentEquality: profile("Equate the two percentage amounts.", "If p% of one quantity equals q% of another, their ratio is q:p.", "Reversing the percentage coefficients and simplifying,", "Hence, the required ratio is"),
  increaseNewValue: profile("The increase is added to the original amount.", "New value = original value \xD7 (100 + increase)% \xF7 100.", "Using the original value and increase rate,", "Hence, the increased value is"),
  decreaseNewValue: profile("The decrease is removed from the original amount.", "New value = original value \xD7 (100 \u2212 decrease)% \xF7 100.", "Using the original value and decrease rate,", "Hence, the reduced value is"),
  reverseIncrease: profile("The final amount represents more than 100% of the original.", "Original value = final value \xD7 100 \xF7 final percentage.", "Expressing the increased amount as a percentage of the original,", "Hence, the original value is"),
  reverseDecrease: profile("The final amount is the percentage left after the decrease.", "Original value = final value \xD7 100 \xF7 remaining percentage.", "Using the remaining percentage,", "Hence, the original value is"),
  increaseByAmount: profile("The added amount itself represents the stated percentage of the original.", "Original value = increase amount \xD7 100 \xF7 increase rate.", "Comparing the increase with the original base,", "Hence, the original value is"),
  percentOfKnownNumber: profile("Both amounts refer to the same number.", "Required amount = known amount \xD7 required percentage \xF7 known percentage.", "The common number cancels in the proportion,", "Hence, the required amount is"),
  differenceOfPercents: profile("The difference of the two rates represents the given difference in value.", "Number = stated difference \xD7 100 \xF7 difference of rates.", "Using the percentage gap,", "Hence, the number is"),
  restoreAfterDecrease: profile("The lost percentage must be restored on the smaller remaining base.", "Required increase = decrease \xD7 100 \xF7 remaining percentage.", "Comparing the loss with the reduced value,", "Hence, the required increase is"),
  successiveIncrease: profile("The second increase acts on the already increased value.", "Equivalent increase = first increase + second increase + product \xF7 100.", "Combining the two successive increases,", "Hence, the single equivalent increase is"),
  compoundGrowth: profile("Each period multiplies the quantity by the same growth factor.", "Final value = initial value \xD7 growth factor for each period.", "Applying the growth factor successively,", "Hence, the value after the stated periods is"),
  compoundDecay: profile("Each period leaves the same fraction of the previous value.", "Final value = initial value \xD7 decay factor for each period.", "Applying the decay factor successively,", "Hence, the remaining value is"),
  areaChange: profile("Area changes with both length and breadth.", "New area factor = length factor \xD7 breadth factor.", "Multiplying the two dimensional changes,", "Hence, the percentage change in area is"),
  squareAreaChange: profile("The area of a square depends on the square of its side.", "New area factor = new side factor\xB2.", "Squaring the changed side factor,", "Hence, the percentage change in area is"),
  invarianceDecrease: profile("The product of the two quantities must remain unchanged.", "Required decrease = increase \xD7 100 \xF7 (100 + increase).", "Balancing the increase with an inverse change,", "Hence, the required decrease is"),
  invarianceIncrease: profile("The product of the two quantities must remain unchanged.", "Required increase = decrease \xD7 100 \xF7 (100 \u2212 decrease).", "Balancing the fall with an inverse change,", "Hence, the permissible increase is"),
  restoreAfterIncrease: profile("The reduction is calculated on the increased value.", "Required reduction = increase \xD7 100 \xF7 (100 + increase).", "Comparing the excess with the new value,", "Hence, the required reduction is"),
  revenueChange: profile("Revenue changes through both the rate and the number of sales.", "New revenue factor = new rate factor \xD7 new sales factor.", "Combining the two effects,", "Hence, the net change in revenue is"),
  circleAreaDecrease: profile("The area of a circle varies as the square of its radius.", "New area factor = new radius factor\xB2.", "Squaring the remaining radius factor,", "Hence, the percentage decrease in area is"),
  incomePartition: profile("Savings are the portion left after all stated expenses.", "Savings percentage = 100 \u2212 total expense percentage.", "The given saving is matched with this remaining percentage,", "Hence, the total income is"),
  successiveExpense: profile("Each later expense is taken from the amount still remaining.", "Remaining amount = salary \xD7 first remaining fraction \xD7 second remaining fraction.", "Working backwards from the final balance,", "Hence, the salary is"),
  winnerVotes: profile("With two candidates, the loser's share is the complement of the winner's share.", "Winning margin percentage = winner percentage \u2212 loser percentage.", "The vote margin is matched with this percentage gap,", "Hence, the total number of votes is"),
  cancelledVotes: profile("Only valid votes are divided between the two candidates.", "Margin on total votes = valid-vote fraction \xD7 margin among valid votes.", "Relating the actual margin to all votes cast,", "Hence, the total votes are"),
  passMarks: profile("Passing marks equal marks obtained plus the shortage.", "Maximum marks = passing marks \xD7 100 \xF7 pass percentage.", "First finding the passing mark and then the full total,", "Hence, the maximum marks are"),
  partToTotal: profile("The given part represents the complementary percentage of the total.", "Total = given part \xD7 100 \xF7 represented percentage.", "Matching the known part with its percentage,", "Hence, the total is"),
  complementOfTotal: profile("The required group is the remainder after removing the stated group.", "Required percentage = 100 \u2212 stated percentage.", "Applying this complementary percentage to the total,", "Hence, the required number is"),
  moreMarksBase: profile("The larger score represents more than 100% of the smaller score.", "Smaller score = larger score \xD7 100 \xF7 represented percentage.", "Working back to the 100% base,", "Hence, the smaller score is"),
  twoShareRemainder: profile("The final share is the percentage left after the first two shares.", "Original amount = remaining amount \xD7 100 \xF7 remaining percentage.", "Matching the remainder with its percentage,", "Hence, the original amount is"),
  loserVotes: profile("With two candidates, the winner receives the complementary share.", "Defeat margin percentage = winner percentage \u2212 loser percentage.", "Matching the vote margin with this gap,", "Hence, the total number of votes is"),
  dilutionAddWater: profile("The amount of acid remains unchanged when only water is added.", "Initial acid = final concentration \xD7 final volume.", "Equating the acid before and after dilution,", "Hence, the water added is"),
  dryFromFresh: profile("The solid matter remains unchanged while water is removed.", "Initial solid matter = final solid matter.", "Equating the unchanged dry matter,", "Hence, the weight of dry fruit is"),
  addSolute: profile("The original water remains unchanged when pure solute is added.", "Original water = water fraction of the final solution.", "Equating the unchanged water content,", "Hence, the pure solute added is"),
  dilutedPercent: profile("The amount of alcohol remains unchanged when water is added.", "New concentration = unchanged alcohol \xF7 new total volume \xD7 100.", "Dividing the original alcohol by the enlarged volume,", "Hence, the new concentration is"),
  freshFromDry: profile("The solid matter is unchanged in the fresh and dry states.", "Fresh solid matter = dry solid matter.", "Equating the unchanged solid portion,", "Hence, the fresh weight was"),
  addPureComponent: profile("The original non-alcohol part remains unchanged.", "Original non-alcohol = final non-alcohol fraction \xD7 final volume.", "Equating the unchanged non-alcohol content,", "Hence, the pure alcohol added is"),
  evaporationOriginal: profile("Sugar remains unchanged while only water evaporates.", "Initial sugar = final sugar.", "Equating the sugar content before and after evaporation,", "Hence, the original weight was"),
  alloyComplement: profile("Zinc forms the percentage left after copper.", "Zinc percentage = 100 \u2212 copper percentage.", "Applying this percentage to the alloy weight,", "Hence, the weight of zinc is"),
  fractionalError: profile("Compare the wrong value with the correct value.", "Percentage error = difference \xF7 correct value \xD7 100.", "Using the correct value as the base,", "Hence, the percentage error is"),
  wrongMultiplier: profile("The error comes from multiplying by the wrong fraction.", "Percentage error = change in multiplier \xF7 correct multiplier \xD7 100.", "Comparing the two multipliers,", "Hence, the percentage error is"),
  wrongDivisor: profile("Changing the divisor changes the quotient inversely.", "Percentage error = difference between quotients \xF7 correct quotient \xD7 100.", "Comparing the correct and wrong quotients,", "Hence, the percentage error is"),
  tieredCommission: profile("Commission must be calculated separately for each applicable slab.", "Total commission = sum of commission from all slabs.", "Adding the slab-wise amounts,", "Hence, the total commission is"),
  tieredTax: profile("Tax must be worked out separately over each taxable slab.", "Total tax = sum of tax charged in all slabs.", "Adding the slab-wise tax amounts,", "Hence, the total tax is"),
  piecewiseRate: profile("Split the total quantity at the rate boundary.", "Total charge = charge below the limit + charge above the limit.", "Adding the two portions,", "Hence, the total charge is"),
  weightedSubgroup: profile("Each subgroup contributes according to both its size and its own rate.", "Overall percentage = sum of weighted subgroup percentages.", "Combining the subgroup contributions,", "Hence, the overall percentage is"),
  hierarchicalPopulation: profile("Work through the population levels in their stated order.", "Each percentage is applied to the population remaining at that stage.", "Following the hierarchy step by step,", "Hence, the required population is"),
  branchAggregation: profile("Calculate the contribution from each branch separately.", "Overall result = sum of all branch contributions.", "Adding the branch-wise values,", "Hence, the combined result is"),
  iterativeDilution: profile("The pure component is reduced at every dilution stage.", "Final pure fraction = product of the retained fractions.", "Multiplying the retained fraction at each stage,", "Hence, the final concentration is"),
  multiTierPiecewiseRate: profile("Separate the total across all applicable tiers.", "Total charge = sum of the charge from every tier.", "Adding the tier-wise amounts,", "Hence, the total charge is"),
  reversePiecewiseRate: profile("Remove the completed slab charges before solving the final slab.", "Amount in final slab = remaining charge \xF7 final slab rate.", "Working backwards through the slabs,", "Hence, the original total is"),
  variableReplacement: profile("Each replacement leaves a stated fraction of the pure component.", "Final pure fraction = product of all retained fractions.", "Multiplying the successive retention factors,", "Hence, the pure component remaining is"),
  electionMargin: profile("Convert every voting condition into a percentage of total registered voters.", "Winning margin = winner's total share \u2212 loser's total share.", "Matching the actual margin with the resulting percentage gap,", "Hence, the total electorate is"),
  multiStageAttrition: profile("Each stage removes a percentage from the amount entering that stage.", "Final amount = initial amount \xD7 all successive retention factors.", "Multiplying the stage-wise retained fractions,", "Hence, the final amount is"),
  shiftedBaseChain: profile("Each percentage is taken on the new base created by the previous step.", "Final value = initial value \xD7 successive change factors.", "Following the changing base through the chain,", "Hence, the final value is"),
  simpleLinkage: profile("Make the common term equal in the two ratios.", "The linked ratio is obtained after matching the common quantity.", "Combining the aligned ratios,", "Hence, the combined ratio is"),
  ratioTreeLinkage: profile("Link the ratios through their common quantities.", "Cancel the intermediate quantities to compare the two ends.", "Multiplying along the ratio chain,", "Hence, the required ratio is"),
  scalingByComponent: profile("Find the value represented by one ratio part.", "Required value = value of one part \xD7 required ratio parts.", "Scaling from the known component,", "Hence, the required value is"),
  decimalNormalization: profile("Remove the decimals by multiplying both terms by the same power of 10.", "A ratio is unchanged when both terms are multiplied equally.", "Converting both terms to whole numbers and reducing,", "Hence, the simplest ratio is"),
  shareDifference: profile("First find the value represented by one ratio part.", "Difference of shares = difference of ratio terms \xD7 value of one part.", "Using the difference between the required ratio terms,", "Hence, the difference of shares is"),
  reversePartition: profile("The stated difference represents the difference of ratio parts.", "Value of one part = stated difference \xF7 difference of ratio terms.", "Using one part to rebuild the whole ratio,", "Hence, the total amount is"),
  salaryDistribution: profile("Salary is divided into expenditure and saving in the given ratio.", "Value of one part = total salary \xF7 sum of ratio terms.", "Multiplying one part by the saving term,", "Hence, the saving is"),
  twoStateAddition: profile("Represent the original quantities by the given ratio parts.", "After the addition, their new ratio gives one equation.", "Solving the changed-ratio equation,", "Hence, the original required quantity is"),
  twoStateSubtraction: profile("Represent the original quantities by the given ratio parts.", "After the removal, their new ratio gives one equation.", "Solving the changed-ratio equation,", "Hence, the original total is"),
  twoStateTransfer: profile("A transfer decreases one side and increases the other by the same amount.", "Use the final ratio after adjusting both quantities.", "Solving the transfer equation,", "Hence, the original required quantity is"),
  incomeExpenditureSystem: profile("Write income and expenditure in their respective ratio parts.", "Saving = income \u2212 expenditure for each person.", "Equating the stated savings condition,", "Hence, the required income is"),
  multiStageTransformation: profile("Apply the addition and removal to the correct sides of the original ratio.", "The transformed quantities must satisfy the final ratio.", "Solving the resulting ratio equation,", "Hence, the original required quantity is"),
  meanProportional: profile("The mean proportional is the square root of the product of the two numbers.", "Mean proportional\xB2 = first number \xD7 second number.", "Taking the positive square root,", "Hence, the mean proportional is"),
  thirdProportional: profile("For a third proportional, the first two terms repeat in proportion.", "First : second = second : required number.", "Cross-multiplying the proportion,", "Hence, the third proportional is"),
  fourthProportional: profile("Form a proportion with the first three numbers.", "First : second = third : required number.", "Cross-multiplying the proportion,", "Hence, the fourth proportional is"),
  directVariation: profile("In direct variation, both quantities change in the same ratio.", "First value \xF7 first base = second value \xF7 second base.", "Using the constant ratio,", "Hence, the required value is"),
  inverseVariation: profile("In inverse variation, the product of the two quantities remains constant.", "First pair product = second pair product.", "Equating the two products,", "Hence, the required value is"),
  coinCounting: profile("Convert the value contributed by each coin type into a common money unit.", "Total value = sum of count \xD7 denomination for each coin type.", "Using the count ratio and total value,", "Hence, the required number of coins is"),
  multiDenominationMapping: profile("Map each ratio part to the value of its denomination.", "Total value = common count factor \xD7 weighted sum of denominations.", "Finding the common count factor,", "Hence, the required coin count is"),
  weightedMapping: profile("Each group contributes its ratio part multiplied by its weight.", "Total weighted value = common factor \xD7 weighted ratio sum.", "Finding the common factor from the total,", "Hence, the required quantity is"),
  weightedMarks: profile("Total marks are the sum of marks from each question category.", "Total marks = count \xD7 marks per question for all categories.", "Using the question-count ratio,", "Hence, the required number of questions is"),
  binaryMixture: profile("The two components together make the whole mixture.", "Required component = total mixture \xD7 its ratio part \xF7 sum of ratio terms.", "Dividing the mixture according to the ratio,", "Hence, the required component is"),
  mixtureComponentFinding: profile("Use the known component to determine the value of one ratio part.", "Required component = known component \xD7 required parts \xF7 known parts.", "Scaling from the known component,", "Hence, the required quantity is"),
  threeComponentMixture: profile("Add all three ratio terms to obtain the total number of parts.", "Required component = total mixture \xD7 required parts \xF7 total parts.", "Dividing the mixture among the three components,", "Hence, the required component is"),
  variableReplacementRatio: profile("Track the actual amounts after removal and replacement.", "New ratio = adjusted first component : adjusted second component.", "Applying the stated replacement and simplifying,", "Hence, the new ratio is"),
  acidConcentration: profile("Concentration is the acid amount as a percentage of the whole solution.", "Acid percentage = acid volume \xF7 total volume \xD7 100.", "Comparing the acid with the complete mixture,", "Hence, the concentration is")
};
function profile(opening, relation, working, conclusion) {
  return {
    opening: [
      opening,
      `A useful starting point is this: ${opening}`,
      `Begin with this fact: ${opening}`,
      `Notice the key relation: ${opening}`,
      `${opening} This determines the rest of the working.`
    ],
    relation: [
      relation,
      `The working relation is: ${relation}`,
      `This gives the relation: ${relation}`,
      `Use the relation: ${relation}`,
      `So we write: ${relation}`
    ],
    working: [
      working,
      working.replace(/^Using /, "With "),
      working.replace(/^Combining /, "On combining "),
      working.replace(/^Applying /, "On applying "),
      working.replace(/^Equating /, "On equating ")
    ],
    conclusion: [
      conclusion,
      conclusion.replace(/^Hence, /, "Therefore, "),
      conclusion.replace(/^Hence, /, "Thus, "),
      conclusion.replace(/^Hence, /, "So, "),
      conclusion.replace(/^Hence, /, "Accordingly, ")
    ]
  };
}
function variantIndex(evidence) {
  const source = JSON.stringify(evidence.variables);
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = hash * 31 + source.charCodeAt(index) >>> 0;
  }
  return hash % 5;
}
function num(variables, key) {
  return Number(variables[key]);
}
function text(variables, key) {
  return String(variables[key]);
}
function signedAnswer(answer) {
  return answer.endsWith("%") ? answer : `${answer}`;
}
function formatNumber2(value2) {
  if (!Number.isFinite(value2)) return String(value2);
  const rounded = Math.round((value2 + Number.EPSILON) * 1e6) / 1e6;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(6).replace(/\.?0+$/, "");
}
function sanitizeMathExpression(expression) {
  return expression.replace(/-?\d+\.\d{6,}/g, (match) => formatNumber2(Number(match)));
}
function arithmeticChain(taskKind, evidence) {
  const v = evidence.variables;
  const d = evidence.derivedValues;
  const answer = String(evidence.answer);
  const n = (key) => num(v, key);
  const s = (key) => text(v, key);
  const result = `=${signedAnswer(answer)}`;
  switch (taskKind) {
    case "percentToFraction":
      return [`${n("percentageRate")}\\%=\\frac{${n("percentageRate")}}{100}`, `\\frac{${n("percentageRate")}}{100}`, result];
    case "valueAsPercent":
      return [`\\frac{${n("value")}}{${n("baseValue")}}\\times100`, `${n("value")}\\times\\frac{100}{${n("baseValue")}}`, result];
    case "directRelation":
      return [`${n("percentageRate")}\\%\\text{ of }${n("baseValue")}`, `\\frac{${n("percentageRate")}}{100}\\times${n("baseValue")}`, result];
    case "moreToLess":
      return [`B=100,\\ A=${100 + n("percentageRate")}`, `\\frac{${n("percentageRate")}}{${100 + n("percentageRate")}}\\times100`, result];
    case "lessToMore":
      return [`B=100,\\ A=${100 - n("percentageRate")}`, `\\frac{${n("percentageRate")}}{${100 - n("percentageRate")}}\\times100`, result];
    case "ratioFromPercentEquality":
      return [`${n("rate1")}A=${n("rate2")}B`, `A:B=${n("rate2")}:${n("rate1")}`, result];
    case "increaseNewValue":
      return [`${n("baseValue")}\\times\\frac{100+${n("percentageRate")}}{100}`, `${n("baseValue")}\\times\\frac{${100 + n("percentageRate")}}{100}`, result];
    case "decreaseNewValue":
      return [`${n("baseValue")}\\times\\frac{100-${n("percentageRate")}}{100}`, `${n("baseValue")}\\times\\frac{${100 - n("percentageRate")}}{100}`, result];
    case "reverseIncrease":
      return [`100+${n("percentageRate")}=${100 + n("percentageRate")}\\%`, `\\frac{${n("finalValue")}\\times100}{${100 + n("percentageRate")}}`, result];
    case "reverseDecrease":
      return [`100-${n("percentageRate")}=${100 - n("percentageRate")}\\%`, `\\frac{${n("finalValue")}\\times100}{${100 - n("percentageRate")}}`, result];
    case "increaseByAmount":
      return [`${n("percentageRate")}\\%=${n("value")}`, `\\frac{${n("value")}\\times100}{${n("percentageRate")}}`, result];
    case "percentOfKnownNumber":
      return [`${n("rate1")}\\%=${n("value1")}`, `${n("rate2")}\\%=\\frac{${n("value1")}\\times${n("rate2")}}{${n("rate1")}}`, result];
    case "differenceOfPercents":
      return [`|${n("rate1")}-${n("rate2")}|\\%=${n("value")}`, `\\frac{${n("value")}\\times100}{|${n("rate1")}-${n("rate2")}|}`, result];
    case "restoreAfterDecrease":
      return [`\\text{Remaining}=100-${n("percentageRate")}=${100 - n("percentageRate")}`, `\\frac{${n("percentageRate")}\\times100}{${100 - n("percentageRate")}}`, result];
    case "successiveIncrease":
      return [`${n("rate1")}+${n("rate2")}+\\frac{${n("rate1")}\\times${n("rate2")}}{100}`, `${n("rate1") + n("rate2")}+\\frac{${n("rate1") * n("rate2")}}{100}`, result];
    case "compoundGrowth":
      return [`1+\\frac{${n("percentageRate")}}{100}=\\frac{${100 + n("percentageRate")}}{100}`, `${n("initialValue")}\\left(\\frac{${100 + n("percentageRate")}}{100}\\right)^2`, result];
    case "compoundDecay":
      return [`1-\\frac{${n("percentageRate")}}{100}=\\frac{${100 - n("percentageRate")}}{100}`, `${n("initialValue")}\\left(\\frac{${100 - n("percentageRate")}}{100}\\right)^2`, result];
    case "areaChange":
      return [`\\frac{${100 + n("rate1")}}{100}\\times\\frac{${100 + n("rate2")}}{100}`, `\\left(\\frac{${100 + n("rate1")}}{100}\\times\\frac{${100 + n("rate2")}}{100}-1\\right)100`, result];
    case "squareAreaChange":
      return [`\\text{Side factor}=\\frac{${100 + n("percentageRate")}}{100}`, `\\left[\\left(\\frac{${100 + n("percentageRate")}}{100}\\right)^2-1\\right]100`, result];
    case "invarianceDecrease":
    case "restoreAfterIncrease": {
      const rate = taskKind === "restoreAfterIncrease" ? n("rate1") : n("percentageRate");
      return [`\\text{New base}=100+${rate}=${100 + rate}`, `\\frac{${rate}\\times100}{${100 + rate}}`, result];
    }
    case "invarianceIncrease":
      return [`\\text{New base}=100-${n("percentageRate")}=${100 - n("percentageRate")}`, `\\frac{${n("percentageRate")}\\times100}{${100 - n("percentageRate")}}`, result];
    case "revenueChange":
      return [`\\frac{${100 - n("rate1")}}{100}\\times\\frac{${100 + n("rate2")}}{100}`, `\\left(\\frac{${100 - n("rate1")}\\times${100 + n("rate2")}}{10000}-1\\right)100`, result];
    case "circleAreaDecrease":
      return [`\\text{Radius factor}=\\frac{${100 - n("percentageRate")}}{100}`, `\\left[1-\\left(\\frac{${100 - n("percentageRate")}}{100}\\right)^2\\right]100`, result];
    case "incomePartition": {
      const remaining = 100 - n("rate1") - n("rate2") - n("rate3");
      return [`100-${n("rate1")}-${n("rate2")}-${n("rate3")}=${remaining}\\%`, `\\frac{${n("value")}\\times100}{${remaining}}`, result];
    }
    case "successiveExpense":
      return [`\\text{Remaining fraction}=\\frac{${100 - n("rate1")}}{100}\\times\\frac{${100 - n("rate2")}}{100}`, `\\frac{${n("value")}\\times10000}{${100 - n("rate1")}\\times${100 - n("rate2")}}`, result];
    case "winnerVotes": {
      const gap = 2 * n("percentageRate") - 100;
      return [`${n("percentageRate")}-(100-${n("percentageRate")})=${gap}\\%`, `\\frac{${n("voteDifference")}\\times100}{${gap}}`, result];
    }
    case "cancelledVotes": {
      const valid = 100 - n("rate1");
      const gap = 2 * n("rate2") - 100;
      return [`\\text{Effective gap}=\\frac{${valid}\\times${gap}}{100}\\%`, `\\frac{${n("voteDifference")}\\times10000}{${valid}\\times${gap}}`, result];
    }
    case "passMarks": {
      const passing = n("marksObtained") + n("failMargin");
      return [`${n("marksObtained")}+${n("failMargin")}=${passing}`, `\\frac{${passing}\\times100}{${n("passRate")}}`, result];
    }
    case "partToTotal":
      return [`\\text{Known part}=${100 - n("rate1")}\\%`, `\\frac{${n("value")}\\times100}{${100 - n("rate1")}}`, result];
    case "complementOfTotal":
      return [`100-${n("percentageRate")}=${100 - n("percentageRate")}\\%`, `\\frac{${n("totalPopulation")}\\times${100 - n("percentageRate")}}{100}`, result];
    case "moreMarksBase":
      return [`100+${n("rate1")}=${100 + n("rate1")}\\%`, `\\frac{${n("marks")}\\times100}{${100 + n("rate1")}}`, result];
    case "twoShareRemainder": {
      const remaining = 100 - n("rate1") - n("rate2");
      return [`100-${n("rate1")}-${n("rate2")}=${remaining}\\%`, `\\frac{${n("value")}\\times100}{${remaining}}`, result];
    }
    case "loserVotes": {
      const gap = 100 - 2 * n("rate1");
      return [`(100-${n("rate1")})-${n("rate1")}=${gap}\\%`, `\\frac{${n("voteDifference")}\\times100}{${gap}}`, result];
    }
    case "dilutionAddWater": {
      const acid = n("totalMixture") * n("percentageRate") / 100;
      return [`\\text{Acid}=\\frac{${n("percentageRate")}}{100}\\times${n("totalMixture")}`, `\\text{Final volume}=\\frac{${acid}\\times100}{${n("newRate")}}`, `\\text{Water}=\\frac{${acid}\\times100}{${n("newRate")}}-${n("totalMixture")}=${answer}`];
    }
    case "dryFromFresh":
      return [`\\text{Solid matter}=\\frac{${100 - n("waterRate")}}{100}\\times${n("totalQuantity")}`, `\\text{Dry weight}=\\frac{${n("totalQuantity")}\\times${100 - n("waterRate")}}{${100 - n("dryWaterRate")}}`, result];
    case "addSolute":
      return [`\\text{Water}=\\frac{${100 - n("percentageRate")}}{100}\\times${n("totalMixture")}`, `\\text{Final volume}=\\frac{${n("totalMixture")}\\times${100 - n("percentageRate")}}{${100 - n("newRate")}}`, `\\text{Solute added}=\\text{Final volume}-${n("totalMixture")}=${answer}`];
    case "dilutedPercent":
      return [`\\text{Alcohol}=\\frac{${n("percentageRate")}}{100}\\times${n("totalMixture")}`, `\\frac{${n("totalMixture")}\\times${n("percentageRate")}}{${n("totalMixture") + n("value")}}`, result];
    case "freshFromDry":
      return [`\\text{Dry solid}=\\frac{${100 - n("rate2")}}{100}\\times${n("value")}`, `\\text{Fresh weight}=\\frac{${n("value")}\\times${100 - n("rate2")}}{${100 - n("rate1")}}`, result];
    case "addPureComponent":
      return [`\\text{Non-alcohol}=\\frac{${100 - n("percentageRate")}}{100}\\times${n("totalMixture")}`, `\\text{Final volume}=\\frac{${n("totalMixture")}\\times${100 - n("percentageRate")}}{${100 - n("newRate")}}`, `\\text{Alcohol added}=\\text{Final volume}-${n("totalMixture")}=${answer}`];
    case "evaporationOriginal":
      return [`\\frac{${n("percentageRate")}}{100}W=\\frac{${n("newRate")}}{100}(W-${n("value")})`, `${n("percentageRate")}W=${n("newRate")}W-${n("newRate") * n("value")}`, result];
    case "alloyComplement":
      return [`100-${n("percentageRate")}=${100 - n("percentageRate")}\\%`, `\\frac{${n("totalWeight")}\\times${100 - n("percentageRate")}}{100}`, result];
    case "fractionalError":
      return [`\\text{Correct}=\\frac{${n("correctNumerator")}}{${n("correctDenominator")}},\\quad\\text{Wrong}=\\frac{${n("wrongNumerator")}}{${n("wrongDenominator")}}`, `\\left(\\frac{\\frac{${n("wrongNumerator")}}{${n("wrongDenominator")}}}{\\frac{${n("correctNumerator")}}{${n("correctDenominator")}}}-1\\right)100`, result];
    case "wrongMultiplier":
      return [`\\text{Error factor}=\\frac{${n("wrongMultiplier")}}{${n("correctMultiplier")}}`, `\\left(\\frac{${n("wrongMultiplier")}}{${n("correctMultiplier")}}-1\\right)100`, result];
    case "wrongDivisor":
      return [`\\text{Quotient factor}=\\frac{${n("correctDivisor")}}{${n("wrongDivisor")}}`, `\\left|\\frac{${n("correctDivisor")}}{${n("wrongDivisor")}}-1\\right|100`, result];
    case "tieredCommission": {
      const first = Math.min(n("salesAmount"), n("thresholdAmount"));
      const extra = Math.max(0, n("salesAmount") - n("thresholdAmount"));
      return [`\\frac{${first}\\times${n("baseCommissionRate")}}{100}+\\frac{${extra}\\times${n("bonusCommissionRate")}}{100}`, result, `\\text{Commission}=${answer}`];
    }
    case "tieredTax":
      return [`\\text{Taxable income}=${n("grossIncome")}-${n("exemptionAmount")}`, `\\frac{(${n("grossIncome")}-${n("exemptionAmount")})${n("taxPercentage")}}{100}`, result];
    case "piecewiseRate": {
      const first = Math.min(n("usageAmount"), n("thresholdAmount"));
      const extra = Math.max(0, n("usageAmount") - n("thresholdAmount"));
      return [`${first}\\times${n("baseChargeRate")}+${extra}\\times${n("extraChargeRate")}`, result, `\\text{Total charge}=${answer}`];
    }
    case "weightedSubgroup":
      return [`\\frac{${n("malePercentage")}\\times${n("maleTraitPercentage")}}{100}+\\frac{${100 - n("malePercentage")}\\times${n("femaleTraitPercentage")}}{100}`, result, `\\text{Overall percentage}=${answer}`];
    case "hierarchicalPopulation":
      return [`\\text{First group}=\\frac{${n("totalPopulation")}\\times${n("malePercentage")}}{100}`, `\\text{Required}=\\frac{${n("totalPopulation")}\\times${n("malePercentage")}\\times${n("maleTraitPercentage")}}{10000}`, result];
    case "branchAggregation":
      return [`\\frac{${n("groupAPercentage")}\\times${n("groupATraitPercentage")}}{100}+\\frac{${100 - n("groupAPercentage")}\\times${n("groupBTraitPercentage")}}{100}`, result, `\\text{Combined percentage}=${answer}`];
    case "iterativeDilution":
      return [`1-\\frac{${n("replacementVolume")}}{${n("initialVolume")}}`, `${n("initialVolume")}\\left(1-\\frac{${n("replacementVolume")}}{${n("initialVolume")}}\\right)^{${n("numberOfOperations")}}`, result];
    case "multiTierPiecewiseRate":
      return [`\\frac{${n("tier1Limit")}\\times${n("tier1Rate")}}{100}+\\frac{(${n("tier2Limit")}-${n("tier1Limit")})${n("tier2Rate")}}{100}+\\frac{(${n("totalBase")}-${n("tier2Limit")})${n("tier3Rate")}}{100}`, result, `\\text{Total}=${answer}`];
    case "reversePiecewiseRate":
      return [`\\text{First slab}=\\frac{${n("tier1Limit")}\\times${n("tier1Rate")}}{100}`, `\\text{Extra base}=\\frac{(${n("totalResult")}-\\frac{${n("tier1Limit")}\\times${n("tier1Rate")}}{100})100}{${n("tier2Rate")}}`, result];
    case "variableReplacement":
      return [`\\left(1-\\frac{${n("replacementRate1")}}{100}\\right)\\left(1-\\frac{${n("replacementRate2")}}{100}\\right)\\left(1-\\frac{${n("replacementRate3")}}{100}\\right)`, `100\\times\\frac{${100 - n("replacementRate1")}}{100}\\times\\frac{${100 - n("replacementRate2")}}{100}\\times\\frac{${100 - n("replacementRate3")}}{100}`, result];
    case "electionMargin":
      return [`\\text{Valid votes}=\\frac{${n("polledPercentage")}\\times${100 - n("invalidPercentage")}}{100}\\%`, `\\text{Margin}=\\frac{${n("polledPercentage")}\\times${100 - n("invalidPercentage")}\\times${2 * n("winnerPercentage") - 100}}{10000}\\%`, result];
    case "multiStageAttrition":
      return [`${n("initialCount")}\\times\\frac{${100 - n("firstDropPercentage")}}{100}\\times\\frac{${100 - n("secondDropPercentage")}}{100}\\times\\frac{${100 - n("thirdDropPercentage")}}{100}`, result, `\\text{Final count}=${answer}`];
    case "shiftedBaseChain":
      return [`${n("initialCount")}\\times\\frac{${n("firstPassPercentage")}}{100}\\times\\frac{${n("secondPassPercentage")}}{100}\\times\\frac{${n("thirdPassPercentage")}}{100}`, result, `\\text{Final count}=${answer}`];
    case "simpleLinkage":
      return [`${s("personA")}:${s("personB")}=${n("ratioA1")}:${n("ratioB1")}`, `${s("personB")}:${s("personC")}=${n("ratioB2")}:${n("ratioC2")}`, `${s("personA")}:${s("personB")}:${s("personC")}=${answer}`];
    case "ratioTreeLinkage":
      return [`\\frac{${s("personA")}}{${s("personB")}}=\\frac{${n("ratioA")}}{${n("ratioB")}},\\ \\frac{${s("personB")}}{${s("personC")}}=\\frac{${n("ratioB_prime")}}{${n("ratioC")}}`, `\\frac{${s("personC")}}{${s("personD")}}=\\frac{${n("ratioC_prime")}}{${n("ratioD")}}`, `${s("personA")}:${s("personD")}=${answer}`];
    case "scalingByComponent":
      return [`\\text{One part}=\\frac{${n("valueA")}}{${n("ratioA")}}`, `${s("personB")}=${n("ratioB")}\\times\\frac{${n("valueA")}}{${n("ratioA")}}`, result];
    case "decimalNormalization":
      return [`${n("decimalA")}:${n("decimalB")}`, `${n("decimalA")}\\times10:${n("decimalB")}\\times10`, result];
    case "shareDifference": {
      const sum = n("ratioA") + n("ratioB") + n("ratioC");
      return [`\\text{One part}=\\frac{${n("totalAmount")}}{${sum}}`, `(${n("ratioA")}-${n("ratioC")})\\times\\frac{${n("totalAmount")}}{${sum}}`, result];
    }
    case "reversePartition": {
      const diff = n("ratioA") - n("ratioC");
      const sum = n("ratioA") + n("ratioB") + n("ratioC");
      return [`\\text{One part}=\\frac{${n("shareDifference")}}{${diff}}`, `\\frac{${n("shareDifference")}}{${diff}}\\times${sum}`, result];
    }
    case "salaryDistribution":
      return [`\\text{One part}=\\frac{${n("totalSalary")}}{${n("ratioExp") + n("ratioSav")}}`, `${n("ratioSav")}\\times\\frac{${n("totalSalary")}}{${n("ratioExp") + n("ratioSav")}}`, result];
    case "twoStateAddition":
      return [`\\frac{${n("ratioA")}x+${n("addedCount")}}{${n("ratioB")}x}=\\frac{${n("finalRatioA")}}{${n("finalRatioB")}}`, `${n("finalRatioB")}(${n("ratioA")}x+${n("addedCount")})=${n("finalRatioA") * n("ratioB")}x`, result];
    case "twoStateSubtraction":
      return [`\\frac{${n("ratioA")}x-${n("removedCount")}}{${n("ratioB")}x}=\\frac{${n("finalRatioA")}}{${n("finalRatioB")}}`, `${n("finalRatioB")}(${n("ratioA")}x-${n("removedCount")})=${n("finalRatioA") * n("ratioB")}x`, result];
    case "twoStateTransfer":
      return [`\\frac{${n("ratioA")}x+${n("transferredCount")}}{${n("ratioB")}x-${n("transferredCount")}}=\\frac{${n("finalRatioA")}}{${n("finalRatioB")}}`, `${n("finalRatioB")}(${n("ratioA")}x+${n("transferredCount")})=${n("finalRatioA")}(${n("ratioB")}x-${n("transferredCount")})`, result];
    case "incomeExpenditureSystem":
      return [`${n("incomeRatioA")}x-${n("expRatioA")}y=${n("savingsAmount")}`, `${n("incomeRatioB")}x-${n("expRatioB")}y=${n("savingsAmount")}`, result];
    case "multiStageTransformation":
      return [`\\frac{${n("ratioA")}x+${n("addedCount")}}{${n("ratioB")}x-${n("removedCount")}}=\\frac{${n("finalRatioA")}}{${n("finalRatioB")}}`, `${n("finalRatioB")}(${n("ratioA")}x+${n("addedCount")})=${n("finalRatioA")}(${n("ratioB")}x-${n("removedCount")})`, result];
    case "meanProportional":
      return [`x^2=${n("numA")}\\times${n("numB")}`, `x=\\sqrt{${n("numA")}\\times${n("numB")}}`, result];
    case "thirdProportional":
      return [`${n("numA")}:${n("numB")}=${n("numB")}:x`, `x=\\frac{${n("numB")}^2}{${n("numA")}}`, result];
    case "fourthProportional":
      return [`${n("numA")}:${n("numB")}=${n("numC")}:x`, `x=\\frac{${n("numB")}\\times${n("numC")}}{${n("numA")}}`, result];
    case "directVariation":
      return [`\\frac{${n("varY1")}}{${n("varX1")}}=\\frac{y}{${n("varX2")}}`, `y=\\frac{${n("varY1")}\\times${n("varX2")}}{${n("varX1")}}`, result];
    case "inverseVariation":
      return [`${n("varX1")}\\times${n("varY1")}=${n("varX2")}\\times y`, `y=\\frac{${n("varX1")}\\times${n("varY1")}}{${n("varX2")}}`, result];
    case "coinCounting":
      return [`x(${n("ratio1")}\\times${n("denom1")}+${n("ratio2")}\\times${n("denom2")}+${n("ratio3")}\\times${n("denom3")})=${n("totalValue")}`, `x=\\frac{${n("totalValue")}}{${n("ratio1")}\\times${n("denom1")}+${n("ratio2")}\\times${n("denom2")}+${n("ratio3")}\\times${n("denom3")}}`, result];
    case "multiDenominationMapping":
      return [`x(${n("valRatio1")}+${n("valRatio2")}+${n("valRatio3")}+${n("valRatio4")})=${n("totalCoins")}`, `x=\\frac{${n("totalCoins")}}{${n("valRatio1") + n("valRatio2") + n("valRatio3") + n("valRatio4")}}`, result];
    case "weightedMapping":
      return [`x(${n("countA")}\\times${n("ratioA")}+${n("countB")}\\times${n("ratioB")}+${n("countC")}\\times${n("ratioC")})=${n("totalWeight")}`, `x=\\frac{${n("totalWeight")}}{${n("countA")}\\times${n("ratioA")}+${n("countB")}\\times${n("ratioB")}+${n("countC")}\\times${n("ratioC")}}`, result];
    case "weightedMarks":
      return [`x(${n("ratio1")}\\times${n("w1")}+${n("ratio2")}\\times${n("w2")}+${n("ratio3")}\\times${n("w3")})=${n("totalScore")}`, `x=\\frac{${n("totalScore")}}{${n("ratio1")}\\times${n("w1")}+${n("ratio2")}\\times${n("w2")}+${n("ratio3")}\\times${n("w3")}}`, result];
    case "binaryMixture":
      return [`${s("liquid1")}:${s("liquid2")}=${n("ratio1")}:${n("ratio2")}`, `${n("ratio1")}x:${n("ratio2")}x+${n("addedAmount")}=${n("finalRatio1")}:${n("finalRatio2")}`, result];
    case "mixtureComponentFinding":
      return [`\\text{One part}=\\frac{${n("totalVolume")}}{${n("ratio1") + n("ratio2")}}`, `${n("ratio1")}x:${n("ratio2")}x+y=${n("finalRatio1")}:${n("finalRatio2")}`, result];
    case "threeComponentMixture":
      return [`\\text{One part}=\\frac{\\text{initial total}}{${n("ratio1") + n("ratio2") + n("ratio3")}}`, `${n("ratio1")}x:${n("ratio2")}x+${n("addedAmount")}:${n("ratio3")}x=${n("finalRatio1")}:${n("finalRatio2")}:${n("finalRatio3")}`, result];
    case "variableReplacementRatio":
      return [`\\text{Retained fraction}=\\left(1-\\frac{${n("removedVolume1")}}{${n("initialVolume")}}\\right)\\left(1-\\frac{${n("removedVolume2")}}{${n("initialVolume")}}\\right)`, `${s("liquidA")}:${s("liquidB")}=${answer}`, result];
    case "acidConcentration":
      return [`\\text{Total volume}=${n("acidVolume")}+${n("waterVolume")}`, `\\frac{${n("acidVolume")}}{${n("acidVolume") + n("waterVolume")}}\\times100`, result];
    default: {
      const values = Object.entries(v).filter(([, value2]) => typeof value2 === "number").map(([key, value2]) => `${key}=${value2}`);
      return [`\\text{Given: }${values.join(",\\ ")}`, `\\text{Required value}`, result];
    }
  }
}
var TaskKindTeacherRenderer = class {
  constructor(taskKind, solverMathJax) {
    this.taskKind = taskKind;
    this.solverMathJax = solverMathJax;
  }
  render(evidence) {
    const selected = PROFILES[this.taskKind];
    if (!selected) throw new Error(`Teacher profile missing for taskKind: ${this.taskKind}`);
    const variant = variantIndex(evidence);
    const answer = String(evidence.answer);
    const chain = arithmeticChain(this.taskKind, evidence).map(sanitizeMathExpression);
    const cleanAnswer = sanitizeMathExpression(answer);
    return [
      { stepId: "step-1", type: "GOAL", narrative: "Given", mathLatex: chain[0] },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: "Calculation",
        mathLatex: chain[1]
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: "=",
        mathLatex: chain[2]
      },
      {
        stepId: "step-4",
        type: "SIMPLIFICATION",
        narrative: "Answer",
        mathLatex: cleanAnswer
      },
      {
        stepId: "step-5",
        type: "CONCLUSION",
        narrative: `${selected.conclusion[variant]} ${cleanAnswer}.`
      }
    ];
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/renderers/percent-of-renderer.ts
var PercentOfRenderer = class {
  render(evidence) {
    const e = evidence;
    const { percentageRate, baseValue } = e.variables;
    const answer = e.answer;
    return [
      {
        stepId: "step-1",
        type: "GOAL",
        narrative: `${percentageRate}% of ${baseValue}`,
        mathLatex: `${percentageRate}\\%\\text{ of }${baseValue}`
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: `=`,
        mathLatex: `\\frac{${percentageRate}}{100}\\times${baseValue}`
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: `=`,
        mathLatex: `\\frac{${percentageRate}\\times${baseValue}}{100}`
      },
      {
        stepId: "step-4",
        type: "SIMPLIFICATION",
        narrative: `=`,
        mathLatex: `${answer}`
      },
      {
        stepId: "step-5",
        type: "CONCLUSION",
        narrative: `Hence, the required value is ${answer}.`
      }
    ];
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/renderers/reverse-percent-renderer.ts
var ReversePercentRenderer = class {
  constructor(_solverMathJax) {
  }
  render(evidence) {
    const e = evidence;
    const percentageRate = Number(e.variables.percentageRate);
    const knownValue = Number(e.variables.value);
    return [
      { stepId: "step-1", type: "GOAL", narrative: `${percentageRate}% corresponds to ${knownValue}.`, mathLatex: `${percentageRate}\\%=${knownValue}` },
      { stepId: "step-2", type: "FORMULA", narrative: `1%`, mathLatex: `\\frac{${knownValue}}{${percentageRate}}` },
      { stepId: "step-3", type: "SUBSTITUTION", narrative: `100%`, mathLatex: `\\frac{${knownValue}\\times100}{${percentageRate}}` },
      { stepId: "step-4", type: "SIMPLIFICATION", narrative: `=`, mathLatex: `${e.answer}` },
      { stepId: "step-5", type: "CONCLUSION", narrative: `Therefore, the number is ${e.answer}.` }
    ];
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/renderers/successive-change-renderer.ts
var SuccessiveChangeRenderer = class {
  constructor(_solverMathJax) {
  }
  render(evidence) {
    const e = evidence;
    const first = Number(e.variables.rate1);
    const second = Number(e.variables.rate2);
    const secondSigned = -second;
    return [
      { stepId: "step-1", type: "GOAL", narrative: `Equivalent percentage change`, mathLatex: `a+b+\\frac{ab}{100}` },
      { stepId: "step-2", type: "FORMULA", narrative: `=`, mathLatex: `${first}+(${secondSigned})+\\frac{${first}\\times(${secondSigned})}{100}` },
      { stepId: "step-3", type: "SUBSTITUTION", narrative: `=`, mathLatex: `${first + secondSigned}+\\frac{${first * secondSigned}}{100}` },
      { stepId: "step-4", type: "SIMPLIFICATION", narrative: `=`, mathLatex: `${e.answer}` },
      { stepId: "step-5", type: "CONCLUSION", narrative: `Hence, the overall change is ${e.answer}.` }
    ];
  }
};

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/explanation-renderer.ts
var LOCALIZED_EXPLANATION_CP_IDS = /* @__PURE__ */ new Set([
  "PCT-CP-001",
  "PCT-CP-002",
  "PCT-CP-003",
  "PCT-CP-004"
]);
function resolvePct001SemanticEntities(taskKind, semanticContext, language) {
  const map = {};
  if (!semanticContext || !semanticContext.entities) return map;
  const entities = semanticContext.entities;
  if (taskKind === "percentOf" || taskKind === "directRelation") {
    map["entityA"] = entities.subject?.[language] || "value";
  }
  return map;
}
function buildPct001Renderer(taskKind, solverMathJax) {
  let renderer;
  switch (taskKind) {
    case "percentOf":
      renderer = new PercentOfRenderer();
      break;
    case "percentToFraction":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "valueAsPercent":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "directRelation":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "moreToLess":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "lessToMore":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "ratioFromPercentEquality":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "reversePercent":
      renderer = new ReversePercentRenderer(solverMathJax);
      break;
    case "increaseNewValue":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "decreaseNewValue":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "reverseIncrease":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "reverseDecrease":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "increaseByAmount":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "percentOfKnownNumber":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "differenceOfPercents":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "restoreAfterDecrease":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "successiveIncrease":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "successiveChange":
      renderer = new SuccessiveChangeRenderer(solverMathJax);
      break;
    case "compoundGrowth":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "compoundDecay":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "areaChange":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "squareAreaChange":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "invarianceDecrease":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "invarianceIncrease":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "restoreAfterIncrease":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "revenueChange":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "circleAreaDecrease":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "incomePartition":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "successiveExpense":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "winnerVotes":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "cancelledVotes":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "passMarks":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "partToTotal":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "complementOfTotal":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "moreMarksBase":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "twoShareRemainder":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "loserVotes":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "dilutionAddWater":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "dryFromFresh":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "addSolute":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "dilutedPercent":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "freshFromDry":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "addPureComponent":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "evaporationOriginal":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    case "alloyComplement":
      renderer = new TaskKindTeacherRenderer(taskKind, solverMathJax);
      break;
    default:
      throw new Error(`Renderer missing for taskKind: ${taskKind}`);
  }
  return renderer;
}
function interpolateExplanationNarrative(template, evidence) {
  const values = {
    ...evidence.variables,
    ...evidence.derivedValues,
    ...evidence.entities,
    answer: evidence.answer
  };
  return template.replace(/\{([^}]+)\}/g, (_match, key) => {
    const value2 = values[key];
    if (typeof value2 !== "string" && typeof value2 !== "number") {
      throw new Error(`Missing explanation placeholder ${key}`);
    }
    return String(value2);
  });
}
function buildLocalizedSteps(rawRenderer, parameters, evidence) {
  const rawSteps = rawRenderer.render(evidence);
  const localizedNarratives = getExplanationSteps(
    parameters.canonicalProblemId,
    parameters.taskKind,
    parameters.language
  );
  if (localizedNarratives.length !== rawSteps.length) {
    throw new Error(
      `Explanation step count mismatch for ${parameters.language}:${parameters.canonicalProblemId}:${parameters.taskKind}`
    );
  }
  return rawSteps.map((step, index) => ({
    ...step,
    narrative: interpolateExplanationNarrative(localizedNarratives[index], evidence)
  }));
}
function renderPct001Explanation(parameters, solver, _graph) {
  const evidence = {
    variables: parameters.variables,
    derivedValues: solver.evidence,
    entities: resolvePct001SemanticEntities(parameters.taskKind, parameters.semanticContext, parameters.language),
    answer: solver.answer
  };
  const renderer = buildPct001Renderer(parameters.taskKind, solver.mathJax);
  if (parameters.language !== "en") {
    if (!isQlLocalized("PCT-001", parameters.questionLanguageId, parameters.language)) {
      throw new Error(
        `Question language ${parameters.questionLanguageId} is not localized for ${parameters.language} in PCT-001.`
      );
    }
    if (!LOCALIZED_EXPLANATION_CP_IDS.has(parameters.canonicalProblemId)) {
      throw new Error(
        `Explanation localization is not implemented for ${parameters.language}:${parameters.canonicalProblemId}:${parameters.taskKind}.`
      );
    }
    const localizedSteps = buildLocalizedSteps(renderer, parameters, evidence);
    const validatedSteps2 = validateExplanationPipeline(evidence, {
      render: () => localizedSteps
    });
    return {
      explanationId: parameters.explanationId,
      lines: formatExplanationSteps(validatedSteps2)
    };
  }
  const validatedSteps = validateExplanationPipeline(evidence, renderer);
  return {
    explanationId: parameters.explanationId,
    lines: formatExplanationSteps(validatedSteps)
  };
}

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/validator.ts
function check(name, passed, message) {
  return { name, passed, message };
}
function placeholderSet(parameters, language) {
  return new Set(extractPlaceholders(getQuestionEntry(parameters.canonicalProblemId, parameters.questionLanguageId, language).template));
}
function sameSet(left, right) {
  return left.size === right.size && [...left].every((value2) => right.has(value2));
}
function answerTypeLooksValid(pkg) {
  let answer = pkg.answer;
  if (answer.startsWith("$$") && answer.endsWith("$$")) {
    answer = answer.slice(2, -2).trim();
  }
  if (pkg.parameters.answerType === "FRACTION") {
    return /^-?\d+\/\d+$/.test(answer) || /^\\frac\{-?\d+\}\{\d+\}$/.test(answer);
  }
  if (pkg.parameters.answerType === "PERCENT") {
    return answer.endsWith("%") || answer.endsWith("\\%");
  }
  if (pkg.parameters.answerType === "RATIO") {
    const normalized = answer.replace(/\s+/g, "");
    return /^\d+(?:\.\d+)?(?::\d+(?:\.\d+)?)+$/.test(normalized);
  }
  if (pkg.parameters.answerType === "COUNT") {
    return /^-?\d+$/.test(answer);
  }
  return answer.length > 0 && !answer.endsWith("%") && !answer.includes(":") && !answer.includes("/");
}
var TEACHER_FORBIDDEN = /our objective|standard rule|plugging in|substitut(?:ing|e) the (?:parameters|values)|calculating the final|calculation gives|observe carefully|observe the given relation|keep the base quantity clear|write the working|target value for this problem|appropriate formula|mathematical relationship|computed result|useful starting point|working relation|this determines|combining aligned ratios|on simplification|completing the arithmetic|numerical result|key relation|observe that|notice that|using the above|required expression becomes/i;
function hasBrokenUnicode(value2) {
  return /[àÂ�]/.test(value2);
}
function validatePct001Parameters(parameters) {
  const registryEntry = getTaskRegistryEntry(parameters.canonicalProblemId, parameters.questionLanguageId);
  const isSharedQuestionLanguage = getCommonQuestionLanguageIds(parameters.canonicalProblemId).includes(parameters.questionLanguageId);
  const enPlaceholders = placeholderSet(parameters, "en");
  const hiPlaceholders = isSharedQuestionLanguage ? placeholderSet(parameters, "hi") : null;
  const paPlaceholders = isSharedQuestionLanguage ? placeholderSet(parameters, "pa") : null;
  const semantic = parameters.semanticContext;
  const scenarioMatch = semantic ? PCT_001_LIBRARY_REGISTRY.semantic.scenarioMap[parameters.canonicalProblemId] === semantic.scenario : true;
  const checks = [
    check("archetype", parameters.archetypeId === PCT_001_ARCHETYPE_ID, "Archetype ID must match."),
    check("cp", PCT_001_CP_IDS.includes(parameters.canonicalProblemId), "CP must be active."),
    check("questionLanguage", parameters.questionLanguageId.length > 0, "Question language ID must be present."),
    check("taskKindRegistry", parameters.taskKind === registryEntry.taskKind, "Task kind must come from task registry."),
    check("answerTypeRegistry", parameters.answerType === registryEntry.answerType, "Answer type must come from task registry."),
    check("requiredVariablesRegistry", parameters.requiredVariables.join("|") === registryEntry.requiredVariables.join("|"), "Required variables must come from task registry."),
    check(
      "placeholderCrossLanguage",
      !isSharedQuestionLanguage || sameSet(enPlaceholders, hiPlaceholders) && sameSet(enPlaceholders, paPlaceholders),
      "EN/HI/PA placeholders must match for shared question-language IDs."
    ),
    check(
      "questionLanguageRegistered",
      getQuestionLanguageIds(parameters.canonicalProblemId, parameters.language).includes(parameters.questionLanguageId),
      "Question language must be available for the package language."
    ),
    check("semanticScenario", scenarioMatch, "Scenario must match CP mapping.")
  ];
  try {
    const explanationSteps = getExplanationSteps(parameters.canonicalProblemId, parameters.taskKind, parameters.language);
    checks.push(check("taskExplanationFamily", explanationSteps.length > 0, "TaskKind-specific explanation family must exist."));
    checks.push(check("explanationVariantCount", getExplanationVariantCount(parameters.canonicalProblemId, parameters.taskKind, parameters.language) > 1, "TaskKind explanation must provide multiple variants."));
  } catch {
    checks.push(check("taskExplanationFamily", false, "TaskKind-specific explanation family must exist."));
    checks.push(check("explanationVariantCount", false, "TaskKind explanation must provide multiple variants."));
  }
  if (semantic) {
    const entities = Object.values(semantic.entities);
    const ids = entities.map((e) => e.id);
    const hasDuplicates = ids.some((id, index) => ids.indexOf(id) !== index);
    checks.push(check("semanticDuplicates", !hasDuplicates, "Duplicate entities found in semantic context."));
    for (const entity of entities) {
      const hasTranslation = entity.en && entity.hi && entity.pa;
      checks.push(check(`semanticTranslation:${entity.id}`, !!hasTranslation, `Missing translation for ${entity.id}`));
      const hiLeak = /[a-zA-Z]/.test(entity.hi);
      const paLeak = /[a-zA-Z]/.test(entity.pa);
      checks.push(check(`semanticLeakage:${entity.id}`, !hiLeak && !paLeak, `Translation leakage in ${entity.id}`));
      checks.push(check(`semanticUnicode:${entity.id}`, !hasBrokenUnicode(entity.hi) && !hasBrokenUnicode(entity.pa), `Broken Unicode in ${entity.id}`));
    }
  }
  for (const variable of registryEntry.requiredVariables) {
    checks.push(check(`requiredVariable:${variable}`, Object.hasOwn(parameters.variables, variable), `${variable} must be generated.`));
    checks.push(
      check(
        `placeholder:${variable}`,
        enPlaceholders.has(variable) && (!isSharedQuestionLanguage || hiPlaceholders.has(variable) && paPlaceholders.has(variable)),
        isSharedQuestionLanguage ? `${variable} must appear in every shared language template.` : `${variable} must appear in the English template.`
      )
    );
  }
  for (const variable of Object.keys(parameters.variables)) {
    checks.push(check(`declaredVariable:${variable}`, registryEntry.requiredVariables.includes(variable) || variable.startsWith("entity"), `${variable} must be declared in task registry or be a semantic entity.`));
  }
  for (const [key, value2] of Object.entries(parameters.variables)) {
    if (typeof value2 === "number") {
      checks.push(check(`finite:${key}`, isFiniteNumber(value2), `${key} must be finite.`));
      if (key.toLowerCase().includes("rate") || key === "percentageRate") {
        checks.push(check(`rate:${key}`, value2 > 0 && value2 < 100, `${key} must be between 0 and 100.`));
      }
      if (key.toLowerCase().includes("value") || key.toLowerCase().includes("population") || key.toLowerCase().includes("marks") || key.toLowerCase().includes("mixture") || key.toLowerCase().includes("quantity") || key.toLowerCase().includes("weight")) {
        checks.push(check(`positive:${key}`, value2 > 0, `${key} must be positive.`));
      }
    }
  }
  return { valid: checks.every((item) => item.passed), checks };
}
function validatePct001QuestionPackage(pkg) {
  const parameterValidation = validatePct001Parameters(pkg.parameters);
  const checks = [
    ...parameterValidation.checks,
    check("stem", pkg.stem.length > 0 && !pkg.stem.includes("undefined") && !pkg.stem.includes("NaN"), "Stem must render."),
    check("answer", pkg.answer.length > 0 && !pkg.answer.includes("undefined") && !pkg.answer.includes("NaN"), "Answer must render."),
    check("answerTypeFormat", answerTypeLooksValid(pkg), "Answer format must match declared answer type."),
    check("solverAnswerType", pkg.solver.answerType === pkg.parameters.answerType, "Solver answer type must match parameters."),
    check("graph", pkg.reasoningGraph.nodes.some((node) => node.id === "answer"), "Graph must contain answer node."),
    check("graphAnswerType", pkg.reasoningGraph.nodes.some((node) => node.id === "answerType" && node.value === pkg.parameters.answerType), "Graph must contain answer type node."),
    check("explanation", pkg.explanation.lines.length > 0, "Explanation must render."),
    check("explanationMinimumSteps", pkg.explanation.lines.length >= 4, "Explanation must contain at least four teacher-style steps."),
    check("teacherLanguage", !TEACHER_FORBIDDEN.test(pkg.explanation.lines.join("\n")), "Explanation must not contain renderer meta-language."),
    check("arithmeticExposure", pkg.explanation.lines.filter((line) => line.includes("\\Rightarrow")).length >= 3, "Explanation must expose at least three arithmetic lines."),
    check("noTaskKindLeak", !pkg.explanation.lines.join("\n").includes(pkg.parameters.taskKind), "TaskKind must never appear in the explanation."),
    check("noVariableLeak", !Object.keys(pkg.parameters.variables).filter((name) => name.length >= 6).some((name) => pkg.explanation.lines.join("\n").includes(name)), "Internal variable names must never appear in the explanation."),
    check("noGenericExplanation", !/generic|fallback|default explanation|AI explanation|apply the formula|use the formula/i.test(pkg.explanation.lines.join("\n")), "Generic explanation path must not be used."),
    check("traceability", pkg.traceability.answer === pkg.answer, "Traceability answer must match."),
    check("traceScenarioId", typeof pkg.traceability.scenarioId === "string", "Traceability must include scenarioId."),
    check("traceSemanticDomain", typeof pkg.traceability.semanticDomain === "string", "Traceability must include semanticDomain."),
    check("traceEntityIds", typeof pkg.traceability.entityIds === "object" && pkg.traceability.entityIds !== null, "Traceability must include entityIds."),
    check("traceFrequencyMetadata", typeof pkg.traceability.frequencyMetadata === "object" && pkg.traceability.frequencyMetadata !== null, "Traceability must include frequencyMetadata."),
    check("traceGrammarMetadata", typeof pkg.traceability.grammarMetadata === "object" && pkg.traceability.grammarMetadata !== null, "Traceability must include grammarMetadata."),
    check("mathJax", Object.values(pkg.mathJax).every((value2) => value2.length > 0), "MathJax evidence must be populated.")
  ];
  return { valid: checks.every((item) => item.passed), checks };
}

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/pipeline.ts
function runPct001Pipeline(cpId, input = {}) {
  const parameters = generatePct001Parameters(cpId, input);
  const solver = solvePct001(parameters);
  const reasoningGraph = buildPct001ReasoningGraph(parameters, solver);
  const explanation = renderPct001Explanation(parameters, solver, reasoningGraph);
  const stem = renderTemplate(getQuestionEntry(cpId, parameters.questionLanguageId, parameters.language).template, parameters.variables);
  const semanticTrace = buildPct001SemanticTrace(parameters.semanticContext);
  const basePackage = {
    archetypeId: PCT_001_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: parameters.questionId,
    questionLanguageId: parameters.questionLanguageId,
    explanationId: parameters.explanationId,
    language: parameters.language,
    difficultyBand: parameters.difficultyBand,
    stem,
    answer: solver.answer,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    traceability: {
      questionId: parameters.questionId,
      canonicalProblemId: cpId,
      questionLanguageId: parameters.questionLanguageId,
      explanationId: parameters.explanationId,
      difficultyBand: parameters.difficultyBand,
      taskKind: parameters.taskKind,
      answerType: parameters.answerType,
      scenario: semanticTrace.scenarioId,
      scenarioId: semanticTrace.scenarioId,
      semanticDomain: semanticTrace.semanticDomain,
      entityIds: semanticTrace.entityIds,
      frequencyMetadata: semanticTrace.frequencyMetadata,
      grammarMetadata: semanticTrace.grammarMetadata,
      graphId: reasoningGraph.graphId,
      answer: solver.answer
    },
    mathJax: solver.mathJax
  };
  const validation = validatePct001QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}
function runPct001ForLanguages(cpId, input = {}) {
  const base = generatePct001Parameters(cpId, {
    ...input,
    language: "hi"
  });
  return ["en", "hi", "pa"].map(
    (language) => runPct001Pipeline(cpId, {
      ...input,
      language,
      questionLanguageId: base.questionLanguageId,
      difficultyBand: base.difficultyBand,
      seed: input.seed
    })
  );
}
var runPct001Cp001Pipeline = (input = {}) => runPct001Pipeline("PCT-CP-001", input);
var runPct001Cp002Pipeline = (input = {}) => runPct001Pipeline("PCT-CP-002", input);
var runPct001Cp003Pipeline = (input = {}) => runPct001Pipeline("PCT-CP-003", input);
var runPct001Cp004Pipeline = (input = {}) => runPct001Pipeline("PCT-CP-004", input);
var runPct001Cp005Pipeline = (input = {}) => runPct001Pipeline("PCT-CP-005", input);
var runPct001Cp006Pipeline = (input = {}) => runPct001Pipeline("PCT-CP-006", input);

// src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/coverage-auditor.ts
function countBy(values) {
  return values.reduce((acc, value2) => {
    acc[value2] = (acc[value2] ?? 0) + 1;
    return acc;
  }, {});
}
function generatePct001Batch(count, language = "en") {
  const cpIds = getPct001ActiveCanonicalProblemIds();
  return Array.from({ length: count }, (_value, index) => {
    const cpId = cpIds[index % cpIds.length];
    const qlIds = getSelectableQuestionLanguageIds(cpId, language);
    const qlIndex = Math.floor(index / cpIds.length) % qlIds.length;
    return runPct001Pipeline(cpId, {
      language,
      questionLanguageId: qlIds[qlIndex],
      seed: `PCT-001:${language}:${index}`
    });
  });
}
function auditPct001Packages(packages) {
  const duplicateMap = /* @__PURE__ */ new Map();
  for (const pkg of packages) duplicateMap.set(pkg.stem, (duplicateMap.get(pkg.stem) ?? 0) + 1);
  const duplicateCount = [...duplicateMap.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  const qlCoverage = countBy(packages.map((pkg) => pkg.questionLanguageId));
  const cpCoverage = countBy(packages.map((pkg) => pkg.canonicalProblemId));
  const esCoverage = countBy(packages.map((pkg) => pkg.explanationId));
  const difficultyCoverage = countBy(packages.map((pkg) => pkg.difficultyBand));
  const auditLanguage = packages[0]?.language ?? "en";
  const unusedQlIds = getPct001ActiveCanonicalProblemIds().flatMap((cpId) => getSelectableQuestionLanguageIds(cpId, auditLanguage)).filter((id) => !qlCoverage[id]);
  let crossLanguageConsistencyFailures = 0;
  for (let index = 0; index < Math.min(120, packages.length); index += 1) {
    const pkg = packages[index];
    const isLocalizedTriplet = isQlLocalized("PCT-001", pkg.questionLanguageId, "hi") && isQlLocalized("PCT-001", pkg.questionLanguageId, "pa");
    if (!isLocalizedTriplet) continue;
    const triplet = runPct001ForLanguages(pkg.canonicalProblemId, {
      seed: `cross-language:${index}`,
      questionLanguageId: pkg.questionLanguageId,
      difficultyBand: pkg.difficultyBand
    });
    const answers = new Set(triplet.map((item) => item.answer));
    if (answers.size !== 1) crossLanguageConsistencyFailures += 1;
  }
  return {
    questionCount: packages.length,
    generationFailures: 0,
    validationFailures: packages.filter((pkg) => !pkg.validation.valid).length,
    renderFailures: packages.filter((pkg) => pkg.stem.includes("undefined") || pkg.stem.includes("NaN")).length,
    solverFailures: packages.filter((pkg) => pkg.answer.includes("undefined") || pkg.answer.includes("NaN") || pkg.answer.length === 0).length,
    duplicateRate: packages.length ? duplicateCount / packages.length : 0,
    cpCoverage,
    qlCoverage,
    esCoverage,
    difficultyCoverage,
    unusedQlIds,
    unusedEsIds: getPct001ActiveCanonicalProblemIds().map((cpId, index) => `PCT-ES-${String(index + 1).padStart(3, "0")}`).filter((id) => !esCoverage[id]),
    crossLanguageConsistencyFailures,
    libraryValidationFailures: validatePct001Libraries().failures
  };
}
function generatePct001CoverageAudit(count, language = "en") {
  const packages = generatePct001Batch(count, language);
  return { packages, audit: auditPct001Packages(packages) };
}
function renderPct001HumanReviewCsv(packages) {
  const header = ["language", "cpId", "qlId", "esId", "difficulty", "taskKind", "answerType", "question", "answer", "validation"];
  const rows = packages.map(
    (pkg) => [
      pkg.language,
      pkg.canonicalProblemId,
      pkg.questionLanguageId,
      pkg.explanationId,
      pkg.difficultyBand,
      pkg.parameters.taskKind,
      pkg.parameters.answerType,
      pkg.stem,
      pkg.answer,
      pkg.validation.valid ? "PASS" : "FAIL"
    ].map((value2) => `"${String(value2).replaceAll('"', '""')}"`).join(",")
  );
  return [header.join(","), ...rows].join("\n");
}
function renderPct001CoverageAuditMarkdown(audit, countLabel) {
  return [
    "# PCT-001 Pre-Freeze Coverage Audit",
    "",
    "## Summary",
    "",
    `- Question count: ${audit.questionCount}`,
    `- Generation failures: ${audit.generationFailures}`,
    `- Validation failures: ${audit.validationFailures}`,
    `- Render failures: ${audit.renderFailures}`,
    `- Solver failures: ${audit.solverFailures}`,
    `- Duplicate rate: ${(audit.duplicateRate * 100).toFixed(2)}%`,
    `- Sample profile: ${countLabel}`,
    ""
  ].join("\n");
}
export {
  PCT_001_ARCHETYPE_ID,
  PCT_001_CP_IDS,
  PCT_001_LANGUAGES,
  PCT_001_LIBRARY_REGISTRY,
  auditPct001Packages,
  buildPct001ReasoningGraph,
  buildPct001SemanticTrace,
  extractPlaceholders,
  formatFraction,
  formatNumber,
  formatPercent,
  formatRatio,
  gcd,
  generatePct001Batch,
  generatePct001CoverageAudit,
  generatePct001Parameters,
  getAnswerType,
  getCommonQuestionLanguageIds,
  getExplanationId,
  getExplanationSteps,
  getExplanationVariantCount,
  getPct001ActiveCanonicalProblemIds,
  getQuestionEntry,
  getQuestionLanguageIds,
  getRequiredVariables,
  getSelectableQuestionLanguageIds,
  getTaskKind,
  getTaskRegistryEntry,
  isFiniteNumber,
  mathJaxLine,
  percentOf,
  renderPct001CoverageAuditMarkdown,
  renderPct001Explanation,
  renderPct001HumanReviewCsv,
  renderTemplate,
  resolvePct001SemanticEntities,
  roundTo,
  runPct001Cp001Pipeline,
  runPct001Cp002Pipeline,
  runPct001Cp003Pipeline,
  runPct001Cp004Pipeline,
  runPct001Cp005Pipeline,
  runPct001Cp006Pipeline,
  runPct001ForLanguages,
  runPct001Pipeline,
  selectQuestionLanguageId,
  solvePct001,
  stableBucket,
  stableHash,
  validatePct001Libraries,
  validatePct001Parameters,
  validatePct001QuestionPackage
};
