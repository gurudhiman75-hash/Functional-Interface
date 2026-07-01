import fs from "fs";

function generateQuestions() {
  const tasks = {
    // PCT-001 TASKS
    "percentOf": [
      "In an election, {percentageRate}% of the {baseValue} registered voters cast their vote. How many votes were cast?",
      "A candidate scored {percentageRate}% of the total {baseValue} marks in an examination. What was his score?",
      "Out of a population of {baseValue} in a village, {percentageRate}% are literate. What is the number of literate persons?",
      "A man spends {percentageRate}% of his monthly income of Rs. {baseValue}. Find his monthly expenditure.",
      "The price of an article is Rs. {baseValue}. If a discount of {percentageRate}% is offered, calculate the discount amount.",
      "If a factory produces {baseValue} units per day, and {percentageRate}% of them are defective, how many defective units are produced daily?",
      "{percentageRate}% of the {baseValue} students in a school are girls. Find the total number of girls.",
      "A mixture contains {baseValue} liters of liquid, of which {percentageRate}% is water. Calculate the volume of water.",
      "Rahul has Rs. {baseValue} with him. He gives {percentageRate}% of it to his friend. How much money did he give?",
      "The marked price of a book is Rs. {baseValue}. The shopkeeper gives a {percentageRate}% discount. What is the discount given?",
      "In a class of {baseValue} students, {percentageRate}% were present on Monday. How many students attended the class?",
      "A fruit seller had {baseValue} apples. He sold {percentageRate}% of them. Find the number of apples sold.",
      "Out of {baseValue} candidates who appeared for an exam, {percentageRate}% passed. How many passed?",
      "The total weight of an alloy is {baseValue} kg. If {percentageRate}% of it is copper, find the weight of copper.",
      "If {percentageRate}% of {baseValue} is equal to x, then what is the value of x?",
      "A library has {baseValue} books, and {percentageRate}% of them are fiction. How many fiction books are there?",
      "From a total salary of Rs. {baseValue}, a person saves {percentageRate}%. Calculate his total savings.",
      "In a garden of {baseValue} trees, {percentageRate}% are mango trees. Find the count of mango trees.",
      "A water tank holds {baseValue} liters. {percentageRate}% of the water was consumed. How much water was used?",
      "Out of Rs. {baseValue} invested in a business, {percentageRate}% is profit. Determine the profit amount."
    ],
    "reversePercent": [
      "If {percentageRate}% of a number is {value}, then what is the number?",
      "A student secured {value} marks, which is {percentageRate}% of the maximum marks. Find the maximum marks.",
      "{percentageRate}% of a person's monthly income is Rs. {value}. What is his total monthly income?",
      "In a school, {value} students play cricket, representing {percentageRate}% of the total strength. Find the total number of students.",
      "After spending {percentageRate}% of his money, a man has Rs. {value} left as his expenditure. Find his initial total amount.",
      "A shopkeeper sold {value} items, which is {percentageRate}% of his total stock. What was his total stock?",
      "If a discount of {percentageRate}% amounts to Rs. {value}, what is the marked price?",
      "The profit earned on selling an article is Rs. {value}, which is {percentageRate}% of the cost price. Find the cost price.",
      "If {percentageRate}% of the population of a town is {value}, calculate the total population.",
      "A car depreciates in value by {percentageRate}%, which equals Rs. {value}. Determine the original value.",
      "{value} liters of water leaked from a tank, making up {percentageRate}% of its total capacity. What is the total capacity?",
      "A man pays Rs. {value} as income tax, which is {percentageRate}% of his gross salary. Find his gross salary.",
      "If {percentageRate}% of a journey is {value} km, what is the total distance?",
      "The number of absent students in a class is {value}, which is {percentageRate}% of the total. Find the total students.",
      "If an alloy contains {value} kg of zinc, representing {percentageRate}% of the total weight, what is the total weight?",
      "A businessman lost Rs. {value}, which is {percentageRate}% of his investment. Find his total investment.",
      "If {percentageRate}% of a book contains {value} pages with illustrations, how many pages are in the book?",
      "The interest earned on a sum is Rs. {value}, which is {percentageRate}% of the principal. Calculate the principal.",
      "{value} defective items constitute {percentageRate}% of a daily production batch. Find the batch size.",
      "If {percentageRate}% of the votes polled in an election were {value}, find the total votes polled."
    ],
    "valueAsPercent": [
      "What percentage of {baseValue} is {value}?",
      "A student scored {value} marks out of a total of {baseValue} marks. What is his percentage score?",
      "Out of {baseValue} total apples, {value} were rotten. Find the percentage of rotten apples.",
      "A man saves Rs. {value} from his total monthly income of Rs. {baseValue}. Calculate his savings percentage.",
      "If {value} items in a batch of {baseValue} are defective, what is the defect rate in percent?",
      "In an election, a candidate received {value} votes out of a total of {baseValue} valid votes. What percent of votes did he secure?",
      "The cost price of an article is Rs. {baseValue} and the profit earned is Rs. {value}. Find the profit percentage.",
      "A mixture of {baseValue} liters contains {value} liters of milk. What is the percentage of milk in the mixture?",
      "In a class of {baseValue} students, {value} are girls. What is the percentage of girls?",
      "If a distance of {value} km is covered out of a total journey of {baseValue} km, what percent of the journey is completed?",
      "A shopkeeper gives a discount of Rs. {value} on a marked price of Rs. {baseValue}. Find the discount percentage.",
      "Out of a population of {baseValue}, {value} people are literate. What is the literacy rate?",
      "A person spends Rs. {value} out of his Rs. {baseValue} salary on rent. What percent of his salary goes to rent?",
      "If a factory target was {baseValue} units and it produced {value} units, what percentage of the target was achieved?",
      "A book has {baseValue} pages, and {value} pages have pictures. What percent of the book is illustrated?",
      "The marked price is Rs. {baseValue} and the selling price is less by Rs. {value} (discount). What is the discount percent?",
      "{value} kg of copper is mixed with other metals to form a {baseValue} kg alloy. Find the copper percentage.",
      "If a student attends school for {value} days out of a total of {baseValue} working days, calculate his attendance percentage.",
      "A water tank of capacity {baseValue} liters currently holds {value} liters. What percent of the tank is full?",
      "Out of Rs. {baseValue} allocated for a project, Rs. {value} was spent. What percentage was spent?"
    ],
    "percentToFraction": [
      "Convert {percentageRate}% into its simplest fractional form.",
      "Express {percentageRate}% as a fraction in lowest terms.",
      "What is the equivalent fraction of {percentageRate}%?",
      "Write {percentageRate}% in the form of a simple fraction.",
      "Find the fractional equivalent of {percentageRate}%.",
      "Reduce {percentageRate}% to its simplest fraction.",
      "Which fraction corresponds exactly to {percentageRate}%?",
      "Evaluate {percentageRate}% as a ratio in fraction format.",
      "Translate {percentageRate}% into a simplified fraction.",
      "State {percentageRate}% as a fraction.",
      "Calculate the lowest fraction form for {percentageRate}%.",
      "What fraction represents {percentageRate}% of a whole?",
      "Give the simplest fraction for {percentageRate}%.",
      "Represent {percentageRate}% as a proper or improper fraction.",
      "Transform {percentageRate}% to fraction notation.",
      "Provide the fraction equivalent for {percentageRate}%.",
      "If a value is {percentageRate}%, what part of the whole is it as a fraction?",
      "Find the simplified fraction that equals {percentageRate}%.",
      "Write down the fraction equivalent to {percentageRate}%.",
      "Convert the percentage {percentageRate}% into a/b format."
    ],
    // PCT-002 TASKS
    "inclusionExclusion": [
      "In an examination, {groupAPercentage}% of candidates failed in Mathematics and {groupBPercentage}% failed in English. If {neitherPercentage}% failed in both subjects, find the percentage of candidates who passed in both subjects.",
      "In a survey of a town, {groupAPercentage}% of people read Newspaper A, {groupBPercentage}% read Newspaper B, and {neitherPercentage}% read both. What percentage read neither Newspaper A nor Newspaper B?",
      "In a class, {groupAPercentage}% of students play cricket, and {groupBPercentage}% play football. If {neitherPercentage}% play neither game, find the percentage of students who play both games.",
      "In an office, {groupAPercentage}% of employees like tea, and {groupBPercentage}% like coffee. If {neitherPercentage}% like neither, what percent like both tea and coffee?",
      "{groupAPercentage}% of a group speak Hindi, and {groupBPercentage}% speak English. If {neitherPercentage}% speak neither language, find the percentage who speak both.",
      "In a town, {groupAPercentage}% of families own a car and {groupBPercentage}% own a scooter. If {neitherPercentage}% of families own neither a car nor a scooter, what percentage own both?",
      "At a party, {groupAPercentage}% of guests ate vegetarian food, and {groupBPercentage}% ate non-vegetarian food. If {neitherPercentage}% ate nothing, what percentage ate both types of food?",
      "{groupAPercentage}% of students passed in Science and {groupBPercentage}% passed in History. If {neitherPercentage}% failed in both, find the percentage of students who passed in both subjects.",
      "A survey reveals that {groupAPercentage}% of people watch channel A, and {groupBPercentage}% watch channel B. If {neitherPercentage}% watch neither, find the percentage of people who watch both channels.",
      "In a school, {groupAPercentage}% of students opt for Physics and {groupBPercentage}% opt for Chemistry. If {neitherPercentage}% opt for neither, find the percentage of students who opt for both Physics and Chemistry.",
      "In an exam, {groupAPercentage}% passed in English and {groupBPercentage}% passed in Math. If {neitherPercentage}% failed in both, what percent passed in both?",
      "{groupAPercentage}% of a population consumes rice, and {groupBPercentage}% consumes wheat. If {neitherPercentage}% consume neither, find the percentage consuming both.",
      "In a survey, {groupAPercentage}% like apples and {groupBPercentage}% like oranges. If {neitherPercentage}% like neither, what percentage like both?",
      "Of the people in a group, {groupAPercentage}% have a cat and {groupBPercentage}% have a dog. If {neitherPercentage}% have neither, find the percentage having both.",
      "{groupAPercentage}% of people travel by bus and {groupBPercentage}% travel by train. If {neitherPercentage}% use neither mode, find the percentage using both.",
      "In a locality, {groupAPercentage}% of houses have an AC and {groupBPercentage}% have a cooler. If {neitherPercentage}% have neither, what percentage have both?",
      "{groupAPercentage}% of students like drawing and {groupBPercentage}% like singing. If {neitherPercentage}% like neither, find the percentage who like both.",
      "In an apartment complex, {groupAPercentage}% use the gym and {groupBPercentage}% use the pool. If {neitherPercentage}% use neither, find the percentage using both.",
      "{groupAPercentage}% of customers bought product A and {groupBPercentage}% bought product B. If {neitherPercentage}% bought neither, what percentage bought both?",
      "In a village, {groupAPercentage}% of farmers grow wheat and {groupBPercentage}% grow maize. If {neitherPercentage}% grow neither, find the percentage growing both."
    ],
    "wrongMultiplier": [
      "A student multiplied a number by {wrongMultiplier} instead of {correctMultiplier}. Find the percentage error in the calculation.",
      "Instead of multiplying by {correctMultiplier}, a boy multiplied a number by {wrongMultiplier}. What is the percentage error?",
      "By mistake, a clerk multiplied a value by {wrongMultiplier} while he was supposed to multiply by {correctMultiplier}. Calculate the percentage error.",
      "A number was multiplied by {wrongMultiplier} rather than {correctMultiplier}. Determine the percentage error in the result.",
      "If a number is multiplied by {wrongMultiplier} instead of {correctMultiplier}, find the error percentage.",
      "A calculation required multiplying a number by {correctMultiplier}, but it was erroneously multiplied by {wrongMultiplier}. What is the error percent?",
      "A student finds the product of a number and {wrongMultiplier} instead of multiplying it by {correctMultiplier}. Find his error percentage.",
      "Due to an oversight, a number is multiplied by {wrongMultiplier} instead of {correctMultiplier}. What is the percentage error?",
      "In a math test, a student was asked to multiply a number by {correctMultiplier}, but he multiplied it by {wrongMultiplier}. Find the percentage error.",
      "A boy multiplied a number by {wrongMultiplier} instead of {correctMultiplier}. Find the error percentage.",
      "A girl was asked to multiply a quantity by {correctMultiplier}, but she mistakenly multiplied by {wrongMultiplier}. Calculate the percentage error.",
      "The correct procedure was to multiply by {correctMultiplier}, but a student multiplied by {wrongMultiplier}. What is the percentage error in the answer?",
      "An employee multiplied a figure by {wrongMultiplier} instead of {correctMultiplier}. Determine the error percent.",
      "If a given value is multiplied by {wrongMultiplier} instead of {correctMultiplier}, what will be the percentage error?",
      "A candidate multiplies a number by {wrongMultiplier} instead of {correctMultiplier}. Find the percentage error in his calculation.",
      "Find the percentage error when a number is multiplied by {wrongMultiplier} instead of {correctMultiplier}.",
      "A student multiplied a variable by {wrongMultiplier} instead of {correctMultiplier}. What is the error percentage?",
      "Instead of a multiplier of {correctMultiplier}, {wrongMultiplier} was used. Find the percentage error.",
      "A miscalculation occurred by multiplying a number by {wrongMultiplier} instead of {correctMultiplier}. What is the error percent?",
      "What is the percentage error if a number is multiplied by {wrongMultiplier} instead of {correctMultiplier}?"
    ],
    "fractionalError": [
      "A student multiplied a number by {wrongNumerator}/{wrongDenominator} instead of {correctNumerator}/{correctDenominator}. Find the percentage error in the calculation.",
      "Instead of multiplying by {correctNumerator}/{correctDenominator}, a boy multiplied a number by {wrongNumerator}/{wrongDenominator}. What is the percentage error?",
      "A number was supposed to be multiplied by {correctNumerator}/{correctDenominator}, but it was multiplied by {wrongNumerator}/{wrongDenominator}. Find the error percentage.",
      "By mistake, a student multiplied a number by {wrongNumerator}/{wrongDenominator} rather than {correctNumerator}/{correctDenominator}. Calculate the percentage error.",
      "If a number is multiplied by {wrongNumerator}/{wrongDenominator} instead of {correctNumerator}/{correctDenominator}, what is the percentage error?",
      "A clerk was asked to calculate {correctNumerator}/{correctDenominator} of a number, but he calculated {wrongNumerator}/{wrongDenominator} of it. Find the error percent.",
      "Find the percentage error if a student multiplies a number by {wrongNumerator}/{wrongDenominator} instead of {correctNumerator}/{correctDenominator}.",
      "A fraction {correctNumerator}/{correctDenominator} was misread as {wrongNumerator}/{wrongDenominator} and multiplied by a number. What is the percentage error?",
      "Instead of finding {correctNumerator}/{correctDenominator} of a value, {wrongNumerator}/{wrongDenominator} of the value was found. What is the error percentage?",
      "A candidate multiplied a number by {wrongNumerator}/{wrongDenominator} instead of {correctNumerator}/{correctDenominator}. Determine the percentage error.",
      "If a calculation involved multiplying by {correctNumerator}/{correctDenominator} but {wrongNumerator}/{wrongDenominator} was used, find the error percent.",
      "A girl multiplied a number by {wrongNumerator}/{wrongDenominator} instead of {correctNumerator}/{correctDenominator}. What is her percentage error?",
      "Calculate the percentage error when a number is multiplied by {wrongNumerator}/{wrongDenominator} instead of {correctNumerator}/{correctDenominator}.",
      "A boy was told to multiply a sum by {correctNumerator}/{correctDenominator}, but he multiplied it by {wrongNumerator}/{wrongDenominator}. Find the error percentage.",
      "A number is multiplied by {wrongNumerator}/{wrongDenominator} instead of {correctNumerator}/{correctDenominator}. What is the percentage error in the result?",
      "Due to an error, a value is multiplied by {wrongNumerator}/{wrongDenominator} rather than {correctNumerator}/{correctDenominator}. Determine the error percent.",
      "What is the percentage error if a number is scaled by {wrongNumerator}/{wrongDenominator} instead of {correctNumerator}/{correctDenominator}?",
      "A student computes {wrongNumerator}/{wrongDenominator} of a number instead of {correctNumerator}/{correctDenominator} of it. Find the percentage error.",
      "Instead of a fractional multiplier of {correctNumerator}/{correctDenominator}, {wrongNumerator}/{wrongDenominator} was applied. Find the percentage error.",
      "A man calculated {wrongNumerator}/{wrongDenominator} of his income instead of {correctNumerator}/{correctDenominator}. Find the percentage error."
    ],
    // RAP-001 TASKS
    "ratioNormalization": [
      "Convert the fractional ratio {numerator1}/{denominator1} : {numerator2}/{denominator2} into a simple integer ratio.",
      "Simplify the ratio of fractions {numerator1}/{denominator1} : {numerator2}/{denominator2} to whole numbers.",
      "Find the simplest integer ratio equivalent to {numerator1}/{denominator1} : {numerator2}/{denominator2}.",
      "Express the ratio {numerator1}/{denominator1} : {numerator2}/{denominator2} in its simplest integer form.",
      "What is the simple ratio of whole numbers for {numerator1}/{denominator1} : {numerator2}/{denominator2}?",
      "Reduce the fractional ratio {numerator1}/{denominator1} : {numerator2}/{denominator2} to its lowest whole number terms.",
      "Normalize the ratio {numerator1}/{denominator1} : {numerator2}/{denominator2}.",
      "Rewrite {numerator1}/{denominator1} : {numerator2}/{denominator2} as a ratio of integers.",
      "Find the integer ratio equivalent to {numerator1}/{denominator1} : {numerator2}/{denominator2}.",
      "Convert {numerator1}/{denominator1} : {numerator2}/{denominator2} into an irreducible whole number ratio.",
      "Determine the simplest whole-number ratio for {numerator1}/{denominator1} : {numerator2}/{denominator2}.",
      "State the fractional ratio {numerator1}/{denominator1} : {numerator2}/{denominator2} in integers.",
      "Calculate the simple integer ratio corresponding to {numerator1}/{denominator1} : {numerator2}/{denominator2}.",
      "Translate {numerator1}/{denominator1} : {numerator2}/{denominator2} into a ratio of whole numbers.",
      "Give the simplest integer format for the ratio {numerator1}/{denominator1} : {numerator2}/{denominator2}.",
      "Find the cross-multiplied and simplified integer ratio of {numerator1}/{denominator1} to {numerator2}/{denominator2}.",
      "Provide the whole number ratio for {numerator1}/{denominator1} : {numerator2}/{denominator2}.",
      "Express {numerator1}/{denominator1} to {numerator2}/{denominator2} as a ratio of integers in simplest form.",
      "Reduce {numerator1}/{denominator1} : {numerator2}/{denominator2} to the simplest integer ratio.",
      "Change the ratio {numerator1}/{denominator1} : {numerator2}/{denominator2} to whole numbers."
    ],
    "basicPartition": [
      "Divide Rs. {totalAmount} between {personA} and {personB} in the ratio {ratioA}:{ratioB}. Find the share of {personA}.",
      "A sum of Rs. {totalAmount} is distributed between {personA} and {personB} in the ratio {ratioA}:{ratioB}. What is the amount received by {personA}?",
      "{totalAmount} sweets are divided among {personA} and {personB} in the ratio {ratioA}:{ratioB}. How many sweets does {personA} get?",
      "Rs. {totalAmount} is to be divided between {personA} and {personB} in the ratio {ratioA}:{ratioB}. Calculate {personA}'s share.",
      "An amount of Rs. {totalAmount} is shared between {personA} and {personB} in the ratio {ratioA}:{ratioB}. Find {personA}'s share.",
      "If Rs. {totalAmount} is divided between {personA} and {personB} such that their shares are in the ratio {ratioA}:{ratioB}, how much does {personA} receive?",
      "{totalAmount} apples are distributed between {personA} and {personB} in the ratio of {ratioA}:{ratioB}. Find the number of apples {personA} receives.",
      "Divide a sum of {totalAmount} between {personA} and {personB} in the proportion {ratioA}:{ratioB}. What is {personA}'s portion?",
      "A total of Rs. {totalAmount} is split between {personA} and {personB} in the ratio {ratioA}:{ratioB}. Find the share belonging to {personA}.",
      "Distribute Rs. {totalAmount} between {personA} and {personB} in the ratio {ratioA}:{ratioB}. How much does {personA} get?",
      "If {totalAmount} items are divided between {personA} and {personB} in the ratio {ratioA}:{ratioB}, calculate the items received by {personA}.",
      "Rs. {totalAmount} is apportioned between {personA} and {personB} in the ratio {ratioA}:{ratioB}. What is the amount given to {personA}?",
      "A profit of Rs. {totalAmount} is divided between partners {personA} and {personB} in the ratio {ratioA}:{ratioB}. What is {personA}'s share of the profit?",
      "Divide {totalAmount} between {personA} and {personB} such that their portions are in the ratio {ratioA}:{ratioB}. Find {personA}'s portion.",
      "{totalAmount} rupees are shared between {personA} and {personB} in the ratio {ratioA}:{ratioB}. Determine the share of {personA}.",
      "In a distribution of Rs. {totalAmount} among {personA} and {personB} in the ratio {ratioA}:{ratioB}, what is {personA}'s share?",
      "Find the share of {personA} when Rs. {totalAmount} is divided between {personA} and {personB} in the ratio {ratioA}:{ratioB}.",
      "A sum of {totalAmount} is divided between {personA} and {personB} in the ratio of {ratioA}:{ratioB}. How much does {personA} receive?",
      "If a quantity of {totalAmount} is split between {personA} and {personB} in the ratio {ratioA}:{ratioB}, find the quantity acquired by {personA}.",
      "An inheritance of Rs. {totalAmount} is divided between {personA} and {personB} in the ratio {ratioA}:{ratioB}. What is {personA}'s share?"
    ]
  };

  const dbDirs = [
    "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/task-registry.library.json",
    "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/task-registry.library.json",
    "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/task-registry.library.json",
    "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-language.en.json",
    "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002/question-language.en.json",
    "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/question-language.en.json"
  ];

  for(let i=0; i<3; i++) {
    const registryPath = dbDirs[i];
    const qlPath = dbDirs[i+3];
    
    if(!fs.existsSync(registryPath) || !fs.existsSync(qlPath)) continue;

    const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
    const qlData = JSON.parse(fs.readFileSync(qlPath, "utf8"));

    const kindMap = {};
    for (const [qlId, entry] of Object.entries(registry.entries)) {
        kindMap[qlId] = entry.taskKind;
    }

    for (const [cpId, cpData] of Object.entries(qlData)) {
      if(!cpData.families) continue;
      
      const newFamilies = {};
      for (const [qlId, qlEntry] of Object.entries(cpData.families)) {
         const kind = kindMap[qlId];
         if (kind && tasks[kind]) {
             for (let j = 0; j < tasks[kind].length; j++) {
                 const newQlId = `${qlId.split('-').slice(0,2).join('-')}-${String(parseInt(qlId.split('-')[2]) + j * 100).padStart(3, '0')}`;
                 newFamilies[newQlId] = {
                     template: tasks[kind][j],
                     difficulty: qlEntry.difficulty
                 };
                 registry.entries[newQlId] = {
                     ...registry.entries[qlId],
                     cpId: cpId
                 };
             }
         } else {
             for (let j = 0; j < 5; j++) {
                const newQlId = `${qlId.split('-').slice(0,2).join('-')}-${String(parseInt(qlId.split('-')[2]) + j * 100).padStart(3, '0')}`;
                
                // Add realistic transitions to unmatched tasks
                const transitions = [
                  qlEntry.template,
                  "In a competitive exam setup, " + qlEntry.template.replace(/^[A-Z]/, c => c.toLowerCase()),
                  qlEntry.template.replace('Find', 'Determine').replace('What is', 'Calculate'),
                  "If the following conditions hold: " + qlEntry.template,
                  "Based on given parameters, " + qlEntry.template.replace('Calculate', 'find')
                ];
                
                newFamilies[newQlId] = {
                     template: transitions[j],
                     difficulty: qlEntry.difficulty
                 };
                 registry.entries[newQlId] = {
                     ...registry.entries[qlId],
                     cpId: cpId
                 };
             }
         }
      }
      cpData.families = newFamilies;
    }

    fs.writeFileSync(qlPath, JSON.stringify(qlData, null, 2));
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
  }
}

generateQuestions();
console.log("Stem families expanded.");