import { deterministicIndex } from "../../../../core/deterministic";

export type Eng008Difficulty = "easy" | "medium" | "hard";

export interface Eng008Cp001QuestionSeedV1 {
  id: string;
  prompt: string;
  options: readonly [string, string, string, string];
  correctOptionIndex: number;
  evidence: string;
}

export interface Eng008Cp001PassageV1 {
  id: string;
  difficulty: Eng008Difficulty;
  title: string;
  paragraphs: readonly [string, string, string];
  questions: readonly Eng008Cp001QuestionSeedV1[];
}

export interface GenerateEng008Cp001V1Input {
  seed: string;
  difficulty: Eng008Difficulty;
  passageId?: string;
  questionId?: string;
}

export interface Eng008Cp001QuestionV1 {
  questionId: string;
  stem: string;
  passageTitle: string;
  passage: string;
  paragraphs: readonly string[];
  options: readonly string[];
  correctOptionIndex: number;
  explanation: string;
  metadata: {
    track: "english";
    chapterId: "ENG-008";
    cpId: "ENG-008-CP001";
    skill: "direct-comprehension";
    passageId: string;
    sourceQuestionId: string;
    difficulty: Eng008Difficulty;
    seed: string;
    reviewOnly: true;
  };
}

export const ENG008_CP001_PASSAGES_V1: readonly Eng008Cp001PassageV1[] = Object.freeze([
  {
    id: "ENG008-RC-NAR-001", difficulty: "easy", title: "The Library Key",
    paragraphs: [
      "Mira volunteered at the small library near her school every Saturday. One morning, she noticed that the cupboard containing the children's storybooks had been locked, but the usual key was not hanging beside the desk.",
      "She first asked the librarian, who remembered placing the key inside a blue register while checking the shelves the previous evening. Mira looked through the register and found the key between two pages.",
      "After opening the cupboard, Mira arranged the returned books in alphabetical order. The librarian thanked her and decided to attach a bright red tag to the key so that it would be easier to notice in future."
    ],
    questions: [
      {id:"Q1",prompt:"Why could Mira not open the storybook cupboard at first?",options:["The cupboard was damaged.","The usual key was not in its normal place.","The librarian had taken the books home.","The register was locked."],correctOptionIndex:1,evidence:"the usual key was not hanging beside the desk"},
      {id:"Q2",prompt:"Where did Mira finally find the key?",options:["Inside a blue register.","Under the librarian's desk.","Between two storybooks.","In a red box."],correctOptionIndex:0,evidence:"found the key between two pages of the blue register"},
      {id:"Q3",prompt:"What did Mira do after opening the cupboard?",options:["She repaired the lock.","She counted the registers.","She arranged the returned books alphabetically.","She painted the cupboard."],correctOptionIndex:2,evidence:"arranged the returned books in alphabetical order"},
      {id:"Q4",prompt:"What change did the librarian decide to make?",options:["Replace the cupboard.","Keep the key at home.","Attach a bright red tag to the key.","Stop locking the cupboard."],correctOptionIndex:2,evidence:"decided to attach a bright red tag to the key"}
    ]
  },
  {
    id: "ENG008-RC-NAR-002", difficulty: "easy", title: "The Rainy Practice",
    paragraphs: [
      "A school football team had planned its final practice on the playground before an inter-school match. Soon after the players arrived, steady rain made the field slippery and unsafe.",
      "Instead of cancelling the session, the coach moved everyone to the assembly hall. The team spent half an hour discussing positions and then practised short passing drills with a soft indoor ball.",
      "By the end of the session, the players had not run as much as usual, but they understood their roles better. The coach said the unexpected indoor practice had helped the team focus on coordination."
    ],
    questions: [
      {id:"Q1",prompt:"Why was the team unable to practise on the playground?",options:["The match had been cancelled.","The field became slippery because of rain.","The footballs were missing.","The assembly hall was occupied."],correctOptionIndex:1,evidence:"steady rain made the field slippery and unsafe"},
      {id:"Q2",prompt:"Where did the coach move the practice session?",options:["To a classroom.","To the school gate.","To the assembly hall.","To a nearby stadium."],correctOptionIndex:2,evidence:"moved everyone to the assembly hall"},
      {id:"Q3",prompt:"What did the players discuss before the passing drills?",options:["Ticket prices.","Team positions.","School uniforms.","Travel plans."],correctOptionIndex:1,evidence:"spent half an hour discussing positions"},
      {id:"Q4",prompt:"According to the coach, what did the indoor session improve?",options:["Running speed.","Coordination.","Shooting power.","Physical endurance."],correctOptionIndex:1,evidence:"helped the team focus on coordination"}
    ]
  },
  {
    id: "ENG008-RC-NAR-003", difficulty: "easy", title: "A Missing Lunch Box",
    paragraphs: [
      "During the lunch break, Arjun realised that his steel lunch box was not in his school bag. He remembered placing it on the kitchen table before leaving home and assumed that he had forgotten it there.",
      "His friend Kabir offered to share his lunch. Before they began eating, the class monitor entered the room carrying a steel box that had been found near the bicycle stand.",
      "Arjun recognised a small green sticker on the lid and knew it was his. He later remembered that he had taken the box out of his bag while unlocking his bicycle in the morning and had left it on the nearby wall."
    ],
    questions: [
      {id:"Q1",prompt:"What did Arjun initially think had happened to his lunch box?",options:["Kabir had borrowed it.","He had forgotten it at home.","It had fallen inside the classroom.","The monitor had taken it."],correctOptionIndex:1,evidence:"assumed that he had forgotten it there"},
      {id:"Q2",prompt:"Who offered to share lunch with Arjun?",options:["The class monitor.","His teacher.","Kabir.","The bicycle guard."],correctOptionIndex:2,evidence:"His friend Kabir offered to share his lunch"},
      {id:"Q3",prompt:"Where had the lunch box been found?",options:["Near the bicycle stand.","On the kitchen table.","Under Arjun's desk.","At the school gate."],correctOptionIndex:0,evidence:"found near the bicycle stand"},
      {id:"Q4",prompt:"How did Arjun identify the box as his?",options:["By its size.","By a green sticker on the lid.","By the food inside.","By his name written underneath."],correctOptionIndex:1,evidence:"recognised a small green sticker on the lid"}
    ]
  },
  {
    id: "ENG008-RC-NAR-004", difficulty: "easy", title: "The Seedling Sale",
    paragraphs: [
      "Students in Class Eight grew vegetable seedlings for a school environment project. They planned to sell the young plants at the annual fair and use the money to buy saplings for the playground.",
      "On the morning of the fair, the students arranged tomato, chilli and brinjal seedlings in separate trays. They also made small labels explaining how often each plant should be watered.",
      "Most of the seedlings were sold before noon. With the money collected, the class bought six shade-giving saplings and planted them along the western edge of the playground the following week."
    ],
    questions: [
      {id:"Q1",prompt:"Why did the students sell the seedlings?",options:["To buy sports equipment.","To buy saplings for the playground.","To pay for the school fair.","To replace classroom furniture."],correctOptionIndex:1,evidence:"use the money to buy saplings for the playground"},
      {id:"Q2",prompt:"Which seedlings were arranged for sale?",options:["Tomato, chilli and brinjal.","Rose, jasmine and marigold.","Wheat, rice and maize.","Mango, guava and lemon."],correctOptionIndex:0,evidence:"tomato, chilli and brinjal seedlings"},
      {id:"Q3",prompt:"What information was written on the small labels?",options:["The price of school tickets.","The date of the fair.","How often each plant should be watered.","The names of the students."],correctOptionIndex:2,evidence:"labels explaining how often each plant should be watered"},
      {id:"Q4",prompt:"Where were the new saplings planted?",options:["Beside the library.","Along the western edge of the playground.","Near the main road.","Behind the science laboratory."],correctOptionIndex:1,evidence:"along the western edge of the playground"}
    ]
  },
  {
    id: "ENG008-RC-NAR-005", difficulty: "medium", title: "The Delayed Exhibition",
    paragraphs: [
      "A district museum planned to open a temporary exhibition on local crafts on Friday morning. Two days before the opening, a truck carrying several display cases was delayed because a bridge on its route had been closed for repairs.",
      "The museum staff could have opened the exhibition without the cases, but the curator felt that placing fragile pottery on ordinary tables would be risky. She postponed the opening until Saturday afternoon and used the extra time to improve the labels beside each exhibit.",
      "When the display cases arrived on Saturday morning, the staff installed them quickly. Visitors later commented that the detailed labels made it easier to understand how the objects had been made and used."
    ],
    questions: [
      {id:"Q1",prompt:"Why was the truck delayed?",options:["Its driver was ill.","A bridge on its route was closed for repairs.","The museum changed its order.","The display cases were damaged."],correctOptionIndex:1,evidence:"a bridge on its route had been closed for repairs"},
      {id:"Q2",prompt:"Why did the curator postpone the exhibition?",options:["She wanted more publicity.","The pottery had not arrived.","She considered ordinary tables unsafe for fragile pottery.","The museum was closed on Fridays."],correctOptionIndex:2,evidence:"placing fragile pottery on ordinary tables would be risky"},
      {id:"Q3",prompt:"How did the staff use the extra time?",options:["They painted the museum walls.","They improved the exhibit labels.","They made new pottery.","They changed the exhibition theme."],correctOptionIndex:1,evidence:"used the extra time to improve the labels"},
      {id:"Q4",prompt:"What did visitors appreciate about the final exhibition?",options:["Free entry.","The detailed labels.","A larger building.","Longer opening hours."],correctOptionIndex:1,evidence:"detailed labels made it easier to understand"}
    ]
  },
  {
    id: "ENG008-RC-NAR-006", difficulty: "medium", title: "The Early Bus",
    paragraphs: [
      "For several weeks, Neha travelled to a training centre on the 8:10 a.m. bus. The bus usually reached the town just in time for her first session, but road construction began causing unpredictable delays.",
      "Neha decided to try the 7:35 bus for one week. It meant leaving home earlier, yet she discovered that she could use the extra twenty minutes at the centre to review her notes in the reading room.",
      "At the end of the week, she kept the earlier routine even though the road delays had reduced. She found that arriving before the building became busy helped her begin the day more calmly."
    ],
    questions: [
      {id:"Q1",prompt:"What problem affected Neha's usual bus journey?",options:["The training centre changed location.","Road construction caused delays.","The 8:10 bus was cancelled permanently.","Her sessions began later."],correctOptionIndex:1,evidence:"road construction began causing unpredictable delays"},
      {id:"Q2",prompt:"How long did Neha first plan to try the earlier bus?",options:["One day.","Three days.","One week.","One month."],correctOptionIndex:2,evidence:"decided to try the 7:35 bus for one week"},
      {id:"Q3",prompt:"What did Neha do with the extra time at the centre?",options:["She exercised outdoors.","She reviewed her notes.","She helped drive the bus.","She ate breakfast in class."],correctOptionIndex:1,evidence:"review her notes in the reading room"},
      {id:"Q4",prompt:"Why did Neha continue taking the earlier bus?",options:["It became cheaper.","The later bus stopped running.","Arriving early helped her start the day calmly.","Her trainer ordered everyone to arrive early."],correctOptionIndex:2,evidence:"arriving before the building became busy helped her begin the day more calmly"}
    ]
  },
  {
    id: "ENG008-RC-NAR-007", difficulty: "medium", title: "Repairing the Old Clock",
    paragraphs: [
      "An old wall clock in the community hall had stopped working after many years of use. Rather than replacing it immediately, the hall committee asked a retired watchmaker named Mr Sen to inspect it.",
      "Mr Sen found that the main gears were still sound, but dust had collected around a small moving part. He cleaned the mechanism, replaced one worn spring and advised the committee to have the clock serviced once a year.",
      "The clock began keeping accurate time again. The committee spent far less than it would have on a replacement and placed a note beside the clock describing its history in the hall."
    ],
    questions: [
      {id:"Q1",prompt:"Who was asked to inspect the clock?",options:["A carpenter.","A retired watchmaker.","The hall manager's son.","An electrician."],correctOptionIndex:1,evidence:"asked a retired watchmaker named Mr Sen"},
      {id:"Q2",prompt:"What did Mr Sen find about the main gears?",options:["They were missing.","They were badly broken.","They were still sound.","They had been replaced recently."],correctOptionIndex:2,evidence:"the main gears were still sound"},
      {id:"Q3",prompt:"What part did Mr Sen replace?",options:["A worn spring.","The clock face.","The wooden frame.","All of the gears."],correctOptionIndex:0,evidence:"replaced one worn spring"},
      {id:"Q4",prompt:"What did the committee do after the repair?",options:["Sold the clock.","Moved the clock outdoors.","Placed a note describing its history beside it.","Stopped using the hall."],correctOptionIndex:2,evidence:"placed a note beside the clock describing its history"}
    ]
  },
  {
    id: "ENG008-RC-NAR-008", difficulty: "medium", title: "The Shared Garden",
    paragraphs: [
      "Residents of an apartment block wanted to turn an unused patch of land into a shared garden. At first, several people suggested planting only flowers because they would require less planning.",
      "During a meeting, an elderly resident proposed dividing the area into three sections: flowers near the entrance, herbs beside the walkway and seasonal vegetables in the sunniest corner. The group accepted the plan and created a weekly watering schedule.",
      "Within three months, the garden had become a regular meeting place. Residents exchanged herbs and vegetables, while children helped remove dry leaves on Sunday mornings."
    ],
    questions: [
      {id:"Q1",prompt:"What was the residents' original idea for the unused land?",options:["Build a parking area.","Plant only flowers.","Create a playground.","Leave it unchanged."],correctOptionIndex:1,evidence:"suggested planting only flowers"},
      {id:"Q2",prompt:"Who suggested dividing the garden into three sections?",options:["A child.","The building owner.","An elderly resident.","A gardener hired by the city."],correctOptionIndex:2,evidence:"an elderly resident proposed dividing the area"},
      {id:"Q3",prompt:"Where were the seasonal vegetables planted?",options:["Near the entrance.","Beside the walkway.","In the sunniest corner.","Under the staircase."],correctOptionIndex:2,evidence:"seasonal vegetables in the sunniest corner"},
      {id:"Q4",prompt:"What did children do on Sunday mornings?",options:["Sold flowers.","Removed dry leaves.","Painted the walkway.","Prepared the watering schedule."],correctOptionIndex:1,evidence:"children helped remove dry leaves on Sunday mornings"}
    ]
  },
  {
    id: "ENG008-RC-NAR-009", difficulty: "hard", title: "The Mountain Rest House",
    paragraphs: [
      "A small rest house on a mountain route had long depended on water carried from a spring nearly a kilometre away. During the tourist season, the owner hired extra workers simply to keep the storage tanks filled.",
      "After consulting an engineer, the owner installed gutters along the sloping roof and connected them to a covered underground tank. The first heavy rain filled much of the tank, but the owner continued to keep spring water for drinking until the collected rainwater could be properly filtered.",
      "Over the next season, the rest house used the stored rainwater mainly for cleaning, washing and the garden. The amount of water carried from the spring fell sharply, allowing the owner to assign workers to other maintenance tasks."
    ],
    questions: [
      {id:"Q1",prompt:"Why did the owner hire extra workers during the tourist season?",options:["To guide visitors on mountain trails.","To carry enough water from the spring.","To build new guest rooms.","To repair the road."],correctOptionIndex:1,evidence:"hired extra workers simply to keep the storage tanks filled"},
      {id:"Q2",prompt:"What system was installed after the engineer was consulted?",options:["A pipeline from the town.","Roof gutters connected to an underground tank.","A pump inside the spring.","A new drinking-water well."],correctOptionIndex:1,evidence:"installed gutters along the sloping roof and connected them to a covered underground tank"},
      {id:"Q3",prompt:"Why was spring water still kept for drinking at first?",options:["The rainwater tank was too small.","Rainwater could not be used before proper filtration.","Visitors preferred cold water.","The gutters had not been installed."],correctOptionIndex:1,evidence:"until the collected rainwater could be properly filtered"},
      {id:"Q4",prompt:"What was one result of the rainwater system in the next season?",options:["More workers had to carry spring water.","The garden was removed.","Workers could spend more time on other maintenance.","The rest house stopped receiving visitors."],correctOptionIndex:2,evidence:"allowing the owner to assign workers to other maintenance tasks"}
    ]
  },
  {
    id: "ENG008-RC-NAR-010", difficulty: "hard", title: "The Workshop Ledger",
    paragraphs: [
      "A family-run bicycle workshop had recorded repairs in a thick paper ledger for nearly twenty years. Each entry listed the customer's name, the repair performed and the date the bicycle was collected, but older records were increasingly difficult to search.",
      "The owner's daughter suggested creating a simple digital index without discarding the original ledger. Over several evenings, she entered the customer's name, date and page number for each recent repair, allowing staff to locate the full handwritten record quickly when a customer returned.",
      "The workshop later expanded the index to include common replacement parts. The system did not replace the mechanics' judgement or the paper records, but it reduced the time spent searching for previous work and helped staff check which parts were frequently needed."
    ],
    questions: [
      {id:"Q1",prompt:"What problem did the workshop face with the old ledger?",options:["The handwriting had disappeared completely.","Older records were difficult to search.","Customers refused to give their names.","The ledger contained no dates."],correctOptionIndex:1,evidence:"older records were increasingly difficult to search"},
      {id:"Q2",prompt:"What information did the first digital index include?",options:["Customer name, date and ledger page number.","Only the cost of each repair.","Mechanics' working hours and salaries.","Photographs of every bicycle."],correctOptionIndex:0,evidence:"entered the customer's name, date and page number"},
      {id:"Q3",prompt:"Why was the original ledger still useful?",options:["The digital index contained only directions to the full handwritten record.","The workshop had no electricity.","Customers were not allowed to see digital records.","The index covered only replacement parts."],correctOptionIndex:0,evidence:"allowing staff to locate the full handwritten record quickly"},
      {id:"Q4",prompt:"What additional benefit came from adding replacement parts to the index?",options:["It eliminated the need for mechanics.","It showed which parts were frequently needed.","It automatically ordered new bicycles.","It reduced the number of customers."],correctOptionIndex:1,evidence:"helped staff check which parts were frequently needed"}
    ]
  },
  {
    id: "ENG008-RC-NAR-011", difficulty: "hard", title: "The Village Map",
    paragraphs: [
      "Before the monsoon, volunteers in a village decided to update an old hand-drawn map showing footpaths, drains and public buildings. The earlier map had been useful during heavy rain, but several new houses and two narrow lanes were missing from it.",
      "The volunteers walked through each neighbourhood with long-time residents, who pointed out places where water had collected in previous years. Instead of marking every low spot as equally risky, the group also noted whether a drain was nearby and whether the route was used by schoolchildren or emergency vehicles.",
      "The revised map was displayed in the community centre and shared with the local maintenance team. When the first heavy rain arrived, workers used it to inspect the most important drains first rather than moving from one complaint to another without a plan."
    ],
    questions: [
      {id:"Q1",prompt:"Why did the old map need to be updated?",options:["It showed the wrong village name.","New houses and lanes were missing.","It had been damaged by fire.","It included too many public buildings."],correctOptionIndex:1,evidence:"several new houses and two narrow lanes were missing"},
      {id:"Q2",prompt:"Who helped identify places where water had collected before?",options:["Tourists.","Long-time residents.","Only school teachers.","Bus drivers from another town."],correctOptionIndex:1,evidence:"long-time residents, who pointed out places where water had collected"},
      {id:"Q3",prompt:"What factor besides low ground was considered when judging risk?",options:["The colour of nearby houses.","Whether a drain was nearby and how important the route was.","The age of each volunteer.","The distance from the market only."],correctOptionIndex:1,evidence:"noted whether a drain was nearby and whether the route was used by schoolchildren or emergency vehicles"},
      {id:"Q4",prompt:"How did the revised map change the workers' response during heavy rain?",options:["They waited for every complaint before acting.","They inspected priority drains first.","They closed all roads immediately.","They stopped using the community centre."],correctOptionIndex:1,evidence:"used it to inspect the most important drains first"}
    ]
  },
  {
    id: "ENG008-RC-NAR-012", difficulty: "hard", title: "The Borrowed Camera",
    paragraphs: [
      "Ravi borrowed a camera from his cousin for a weekend wildlife trip. His cousin explained that the battery lasted a full day under normal use but drained much faster when the rear screen was kept at maximum brightness.",
      "On the first morning, Ravi repeatedly reviewed every photograph and left the screen very bright. By early afternoon the battery warning appeared, so he reduced the brightness, reviewed fewer images and switched the camera off during long walks between observation points.",
      "The next day the battery lasted until evening even though Ravi took roughly the same number of photographs. He returned the camera with a note describing the settings he had changed, because his cousin planned to lend it to another traveller the following week."
    ],
    questions: [
      {id:"Q1",prompt:"What warning had Ravi's cousin given him?",options:["The camera could not be used outdoors.","The battery drained faster at maximum screen brightness.","The lens had to be replaced daily.","The camera could store only a few photographs."],correctOptionIndex:1,evidence:"drained much faster when the rear screen was kept at maximum brightness"},
      {id:"Q2",prompt:"What happened by early afternoon on the first day?",options:["The memory card became full.","The battery warning appeared.","Ravi lost the camera.","Rain stopped the trip."],correctOptionIndex:1,evidence:"By early afternoon the battery warning appeared"},
      {id:"Q3",prompt:"Which change did Ravi make after seeing the warning?",options:["He stopped taking photographs completely.","He increased screen brightness.","He reviewed fewer images and switched the camera off during long walks.","He replaced the camera."],correctOptionIndex:2,evidence:"reduced the brightness, reviewed fewer images and switched the camera off"},
      {id:"Q4",prompt:"What did Ravi's second-day experience show?",options:["The same number of photographs always uses the same amount of battery.","Changing screen and usage habits extended battery life.","The camera battery could not last beyond afternoon.","Reviewing every photograph was necessary."],correctOptionIndex:1,evidence:"battery lasted until evening even though Ravi took roughly the same number of photographs"}
    ]
  }
]);

function passagePool(difficulty: Eng008Difficulty) {
  return ENG008_CP001_PASSAGES_V1.filter((passage) => passage.difficulty === difficulty);
}

function resolvePassage(input: GenerateEng008Cp001V1Input) {
  if (input.passageId) {
    const passage = ENG008_CP001_PASSAGES_V1.find((item) => item.id === input.passageId);
    if (!passage) throw new Error("Unknown ENG-008 CP001 passage");
    if (passage.difficulty !== input.difficulty) throw new Error("ENG-008 CP001 passage difficulty mismatch");
    return passage;
  }
  const pool = passagePool(input.difficulty);
  return pool[deterministicIndex(`${input.seed}:passage`, pool.length)]!;
}

function resolveQuestion(passage: Eng008Cp001PassageV1, input: GenerateEng008Cp001V1Input) {
  if (input.questionId) {
    const question = passage.questions.find((item) => item.id === input.questionId);
    if (!question) throw new Error("Unknown ENG-008 CP001 question for passage");
    return question;
  }
  return passage.questions[deterministicIndex(`${input.seed}:question`, passage.questions.length)]!;
}

export function generateEng008Cp001QuestionV1(input: GenerateEng008Cp001V1Input): Eng008Cp001QuestionV1 {
  const passage = resolvePassage(input);
  const question = resolveQuestion(passage, input);
  const passageText = passage.paragraphs.join("\n\n");
  const correct = question.options[question.correctOptionIndex];
  return {
    questionId: `ENG-008-CP001-V1:${passage.id}:${question.id}:${input.seed}`,
    stem: question.prompt,
    passageTitle: passage.title,
    passage: passageText,
    paragraphs: [...passage.paragraphs],
    options: [...question.options],
    correctOptionIndex: question.correctOptionIndex,
    explanation: `The correct answer is “${correct}”. The passage states that ${question.evidence}.`,
    metadata: {
      track: "english",
      chapterId: "ENG-008",
      cpId: "ENG-008-CP001",
      skill: "direct-comprehension",
      passageId: passage.id,
      sourceQuestionId: question.id,
      difficulty: passage.difficulty,
      seed: input.seed,
      reviewOnly: true
    }
  };
}
