import type {
  LinearSeatingClue,
  SeatingArrangementType,
  SeatingOrientationType,
  SeatingQuestionPrompt,
  SeatFacingDirection,
} from "./seating-engine";

type LayoutFamily =
  | "single-row"
  | "ring"
  | "two-row";

type SeatNode = {
  index: number;
  row: number;
  col: number;
  facing: SeatFacingDirection;
};

type SeatingLayout = {
  arrangementType: SeatingArrangementType;
  orientationType: SeatingOrientationType;
  family: LayoutFamily;
  seatCount: number;
  rowCount: number;
  colCount: number;
  seats: SeatNode[];
};

type SeatingValidationResult = {
  valid: boolean;
  warnings: string[];
  solutionCount: number;
  solverComplexity: number;
};

type SeatingSolveResult = {
  solutions: string[][];
  solutionCount: number;
  solverComplexity: number;
  trace: string[];
};

function createMixedFacings(
  count: number,
  primary: SeatFacingDirection,
  secondary: SeatFacingDirection,
) {
  return Array.from(
    { length: count },
    (_value, index) =>
      index % 2 === 0
        ? primary
        : secondary,
  );
}

function createLinearSeats(
  seatCount: number,
  orientationType: SeatingOrientationType,
) {
  const facings =
    orientationType === "south"
      ? Array.from(
        { length: seatCount },
        () =>
          "south" as const,
      )
      : orientationType === "alternate"
        ? Array.from(
          { length: seatCount },
          (_value, index) =>
            index % 2 === 0
              ? "north"
              : "south",
        )
        : orientationType === "mixed"
          ? createMixedFacings(
            seatCount,
            "north",
            "south",
          )
          : Array.from(
            { length: seatCount },
            () =>
              "north" as const,
          );

  return Array.from(
    { length: seatCount },
    (_value, index) => ({
      index,
      row: 0,
      col: index,
      facing: facings[index]!,
    }),
  );
}

function createRingSeats(
  seatCount: number,
  orientationType: SeatingOrientationType,
) {
  const facings =
    orientationType === "outward"
      ? Array.from(
        { length: seatCount },
        () =>
          "outward" as const,
      )
      : orientationType === "alternate"
        ? Array.from(
          { length: seatCount },
          (_value, index) =>
            index % 2 === 0
              ? "center"
              : "outward",
        )
        : orientationType === "mixed"
          ? createMixedFacings(
            seatCount,
            "center",
            "outward",
          )
          : Array.from(
            { length: seatCount },
            () =>
              "center" as const,
          );

  return Array.from(
    { length: seatCount },
    (_value, index) => ({
      index,
      row: 0,
      col: index,
      facing: facings[index]!,
    }),
  );
}

function createTwoRowSeats(
  seatCount: number,
  arrangementType: SeatingArrangementType,
  orientationType: SeatingOrientationType,
) {
  const colCount = seatCount / 2;
  const seats: SeatNode[] = [];

  for (let row = 0; row < 2; row++) {
    for (
      let col = 0;
      col < colCount;
      col++
    ) {
      let facing: SeatFacingDirection;

      if (
        orientationType === "north" ||
        orientationType === "south"
      ) {
        facing = orientationType;
      } else if (
        arrangementType ===
          "double-row" &&
        orientationType !== "mixed"
      ) {
        facing =
          row === 0
            ? "south"
            : "north";
      } else if (
        orientationType === "alternate"
      ) {
        facing =
          (row + col) % 2 === 0
            ? "north"
            : "south";
      } else {
        facing =
          (row === 0
            ? col % 2 === 0
            : col % 2 === 1)
            ? "north"
            : "south";
      }

      seats.push({
        index:
          row * colCount + col,
        row,
        col,
        facing,
      });
    }
  }

  return seats;
}

function buildLayout(
  arrangementType: SeatingArrangementType,
  orientationType: SeatingOrientationType,
  seatCount: number,
): SeatingLayout {
  if (arrangementType === "linear") {
    return {
      arrangementType,
      orientationType,
      family: "single-row",
      seatCount,
      rowCount: 1,
      colCount: seatCount,
      seats: createLinearSeats(
        seatCount,
        orientationType,
      ),
    };
  }

  if (
    arrangementType === "circular" ||
    arrangementType === "square" ||
    arrangementType ===
      "rectangular"
  ) {
    return {
      arrangementType,
      orientationType,
      family: "ring",
      seatCount,
      rowCount: 1,
      colCount: seatCount,
      seats: createRingSeats(
        seatCount,
        orientationType,
      ),
    };
  }

  return {
    arrangementType,
    orientationType,
    family: "two-row",
    seatCount,
    rowCount: 2,
    colCount: seatCount / 2,
    seats: createTwoRowSeats(
      seatCount,
      arrangementType,
      orientationType,
    ),
  };
}

function getSeat(
  layout: SeatingLayout,
  index: number,
) {
  return layout.seats[index]!;
}

function sameRow(
  firstIndex: number,
  secondIndex: number,
  layout: SeatingLayout,
) {
  return (
    getSeat(layout, firstIndex).row ===
    getSeat(layout, secondIndex).row
  );
}

function getRelativeIndex(
  index: number,
  direction: "left" | "right",
  distance: number,
  layout: SeatingLayout,
) {
  const seat = getSeat(
    layout,
    index,
  );

  if (
    layout.family === "single-row" ||
    layout.family === "two-row"
  ) {
    const step =
      seat.facing === "south"
        ? direction === "left"
          ? 1
          : -1
        : direction === "left"
          ? -1
          : 1;
    const targetCol =
      seat.col + step * distance;

    if (
      targetCol < 0 ||
      targetCol >= layout.colCount
    ) {
      return undefined;
    }

    return (
      seat.row * layout.colCount +
      targetCol
    );
  }

  const step =
    seat.facing === "outward"
      ? direction === "left"
        ? -distance
        : distance
      : direction === "left"
        ? distance
        : -distance;

  return (
    (index + step + layout.seatCount) %
    layout.seatCount
  );
}

function getCircularDistance(
  firstIndex: number,
  secondIndex: number,
  layout: SeatingLayout,
) {
  const direct = Math.abs(
    firstIndex - secondIndex,
  );

  return Math.min(
    direct,
    layout.seatCount - direct,
  );
}

function areAdjacent(
  firstIndex: number,
  secondIndex: number,
  layout: SeatingLayout,
) {
  if (layout.family === "ring") {
    return (
      getCircularDistance(
        firstIndex,
        secondIndex,
        layout,
      ) === 1
    );
  }

  const firstSeat = getSeat(
    layout,
    firstIndex,
  );
  const secondSeat = getSeat(
    layout,
    secondIndex,
  );

  return (
    firstSeat.row === secondSeat.row &&
    Math.abs(
      firstSeat.col - secondSeat.col,
    ) === 1
  );
}

function getOppositeIndex(
  index: number,
  layout: SeatingLayout,
) {
  if (layout.family === "ring") {
    if (
      layout.seatCount % 2 !== 0
    ) {
      return undefined;
    }

    return (
      index + layout.seatCount / 2
    ) % layout.seatCount;
  }

  if (layout.family === "two-row") {
    const seat = getSeat(
      layout,
      index,
    );

    return (
      (1 - seat.row) *
        layout.colCount +
      seat.col
    );
  }

  return undefined;
}

function matchesClue(
  arrangement: string[],
  clue: LinearSeatingClue,
  layout: SeatingLayout,
) {
  switch (clue.type) {
    case "absolute":
      return (
        layout.family ===
          "single-row" &&
        arrangement[clue.index] ===
          clue.person
      );
    case "end":
      if (
        layout.family !== "single-row"
      ) {
        return false;
      }

      return clue.side === "left"
        ? arrangement[0] === clue.person
        : arrangement[
            arrangement.length - 1
          ] === clue.person;
    case "adjacent": {
      const leftIndex =
        arrangement.indexOf(clue.left);
      const rightIndex =
        arrangement.indexOf(clue.right);

      if (clue.ordered) {
        return (
          getRelativeIndex(
            leftIndex,
            "right",
            1,
            layout,
          ) === rightIndex
        );
      }

      return areAdjacent(
        leftIndex,
        rightIndex,
        layout,
      );
    }
    case "not-adjacent": {
      const leftIndex =
        arrangement.indexOf(clue.left);
      const rightIndex =
        arrangement.indexOf(clue.right);

      return !areAdjacent(
        leftIndex,
        rightIndex,
        layout,
      );
    }
    case "offset": {
      const anchorIndex =
        arrangement.indexOf(
          clue.anchor,
        );
      const personIndex =
        arrangement.indexOf(
          clue.person,
        );

      return (
        getRelativeIndex(
          anchorIndex,
          clue.direction,
          clue.distance,
          layout,
        ) === personIndex
      );
    }
    case "distance-gap": {
      const leftIndex =
        arrangement.indexOf(clue.left);
      const rightIndex =
        arrangement.indexOf(clue.right);

      if (layout.family === "ring") {
        return (
          getCircularDistance(
            leftIndex,
            rightIndex,
            layout,
          ) === clue.gap + 1
        );
      }

      if (
        !sameRow(
          leftIndex,
          rightIndex,
          layout,
        )
      ) {
        return false;
      }

      return (
        Math.abs(
          getSeat(layout, leftIndex)
            .col -
            getSeat(
              layout,
              rightIndex,
            ).col,
        ) === clue.gap + 1
      );
    }
    case "between":
    case "adjacent-both": {
      const middleIndex =
        arrangement.indexOf(
          clue.middle,
        );
      const firstIndex =
        arrangement.indexOf(clue.first);
      const secondIndex =
        arrangement.indexOf(clue.second);

      return (
        areAdjacent(
          middleIndex,
          firstIndex,
          layout,
        ) &&
        areAdjacent(
          middleIndex,
          secondIndex,
          layout,
        ) &&
        firstIndex !== secondIndex
      );
    }
    case "not-end": {
      if (
        layout.family !== "single-row"
      ) {
        return false;
      }

      const personIndex =
        arrangement.indexOf(clue.person);

      return (
        personIndex > 0 &&
        personIndex <
          arrangement.length - 1
      );
    }
    case "opposite": {
      const leftIndex =
        arrangement.indexOf(clue.left);
      const rightIndex =
        arrangement.indexOf(clue.right);

      return (
        getOppositeIndex(
          leftIndex,
          layout,
        ) === rightIndex
      );
    }
    case "not-opposite": {
      const leftIndex =
        arrangement.indexOf(clue.left);
      const rightIndex =
        arrangement.indexOf(clue.right);

      return (
        getOppositeIndex(
          leftIndex,
          layout,
        ) !== rightIndex
      );
    }
    case "same-row": {
      if (
        layout.family !== "two-row"
      ) {
        return false;
      }

      return sameRow(
        arrangement.indexOf(clue.left),
        arrangement.indexOf(
          clue.right,
        ),
        layout,
      );
    }
    case "different-row": {
      if (
        layout.family !== "two-row"
      ) {
        return false;
      }

      return !sameRow(
        arrangement.indexOf(clue.left),
        arrangement.indexOf(
          clue.right,
        ),
        layout,
      );
    }
    case "facing": {
      if (
        layout.family !== "two-row"
      ) {
        return false;
      }

      const leftIndex =
        arrangement.indexOf(clue.left);
      const rightIndex =
        arrangement.indexOf(clue.right);

      return (
        getOppositeIndex(
          leftIndex,
          layout,
        ) === rightIndex
      );
    }
    case "not-facing": {
      if (
        layout.family !== "two-row"
      ) {
        return false;
      }

      const leftIndex =
        arrangement.indexOf(clue.left);
      const rightIndex =
        arrangement.indexOf(clue.right);

      return (
        getOppositeIndex(
          leftIndex,
          layout,
        ) !== rightIndex
      );
    }
    default:
      return false;
  }
}

export function isPromptDirectlyAnsweredByClue(
  prompt: SeatingQuestionPrompt,
  clues: LinearSeatingClue[],
  arrangementType: SeatingArrangementType,
  orientationType: SeatingOrientationType,
  seatCount: number,
) {
  const layout = buildLayout(
    arrangementType,
    orientationType,
    seatCount,
  );

  return clues.some((clue) => {
    if (
      prompt.type ===
        "neighbor-left" ||
      prompt.type ===
        "neighbor-right"
    ) {
      return (
        clue.type === "adjacent" &&
        clue.ordered &&
        ((prompt.type ===
          "neighbor-right" &&
          clue.left ===
            prompt.anchor &&
          clue.right ===
            prompt.correctAnswer) ||
          (prompt.type ===
            "neighbor-left" &&
            clue.right ===
              prompt.anchor &&
            clue.left ===
              prompt.correctAnswer))
      );
    }

    if (prompt.type === "relative") {
      return (
        clue.type === "offset" &&
        clue.anchor === prompt.anchor &&
        clue.distance ===
          prompt.distance &&
        clue.direction ===
          prompt.direction &&
        clue.person ===
          prompt.correctAnswer
      );
    }

    if (prompt.type === "opposite") {
      return (
        clue.type === "opposite" &&
        ((clue.left ===
          prompt.anchor &&
          clue.right ===
            prompt.correctAnswer) ||
          (clue.right ===
            prompt.anchor &&
            clue.left ===
              prompt.correctAnswer))
      );
    }

    if (prompt.type === "facing") {
      if (
        layout.family !== "two-row"
      ) {
        return false;
      }

      return (
        clue.type === "facing" &&
        ((clue.left ===
          prompt.anchor &&
          clue.right ===
            prompt.correctAnswer) ||
          (clue.right ===
            prompt.anchor &&
            clue.left ===
              prompt.correctAnswer))
      );
    }

    return false;
  });
}

function partialCluePossible(
  clue: LinearSeatingClue,
  assignment: Map<string, number>,
  layout: SeatingLayout,
) {
  const getIndex = (name: string) =>
    assignment.get(name);

  switch (clue.type) {
    case "absolute": {
      const index = getIndex(
        clue.person,
      );

      return (
        index === undefined ||
        index === clue.index
      );
    }
    case "end": {
      const index = getIndex(
        clue.person,
      );

      if (index === undefined) {
        return true;
      }

      if (
        layout.family !== "single-row"
      ) {
        return false;
      }

      return clue.side === "left"
        ? index === 0
        : index ===
            layout.seatCount - 1;
    }
    case "not-end": {
      const index = getIndex(
        clue.person,
      );

      if (index === undefined) {
        return true;
      }

      if (
        layout.family !== "single-row"
      ) {
        return false;
      }

      return (
        index > 0 &&
        index < layout.seatCount - 1
      );
    }
    case "adjacent":
    case "not-adjacent":
    case "distance-gap":
    case "same-row":
    case "different-row":
    case "facing":
    case "not-facing":
    case "opposite":
    case "not-opposite": {
      const leftIndex = getIndex(
        clue.left,
      );
      const rightIndex = getIndex(
        clue.right,
      );

      if (
        leftIndex === undefined ||
        rightIndex === undefined
      ) {
        return true;
      }

      return matchesClue(
        Array.from(
          { length: layout.seatCount },
          () => "",
        ).map(
          (_value, index) =>
            [...assignment.entries()].find(
              (entry) =>
                entry[1] === index,
            )?.[0] ?? "",
        ),
        clue,
        layout,
      );
    }
    case "offset": {
      const anchorIndex = getIndex(
        clue.anchor,
      );
      const personIndex = getIndex(
        clue.person,
      );

      if (
        anchorIndex === undefined ||
        personIndex === undefined
      ) {
        return true;
      }

      return (
        getRelativeIndex(
          anchorIndex,
          clue.direction,
          clue.distance,
          layout,
        ) === personIndex
      );
    }
    case "between":
    case "adjacent-both": {
      const middleIndex = getIndex(
        clue.middle,
      );
      const firstIndex = getIndex(
        clue.first,
      );
      const secondIndex = getIndex(
        clue.second,
      );

      if (
        middleIndex === undefined ||
        firstIndex === undefined ||
        secondIndex === undefined
      ) {
        return true;
      }

      return (
        areAdjacent(
          middleIndex,
          firstIndex,
          layout,
        ) &&
        areAdjacent(
          middleIndex,
          secondIndex,
          layout,
        )
      );
    }
    default:
      return true;
  }
}

function solveSeating(
  participants: string[],
  clues: LinearSeatingClue[],
  arrangementType: SeatingArrangementType,
  orientationType: SeatingOrientationType,
  seatCount: number,
): SeatingSolveResult {
  const layout = buildLayout(
    arrangementType,
    orientationType,
    seatCount,
  );
  const solutions: string[][] = [];
  const trace: string[] = [];
  let evaluated = 0;
  const assignment = new Map<
    string,
    number
  >();
  const usedSeats =
    new Set<number>();

  const remainingPeople = [
    ...participants,
  ];

  if (layout.family === "ring") {
    assignment.set(
      participants[0]!,
      0,
    );
    usedSeats.add(0);
    remainingPeople.shift();
  }

  function backtrack(
    personIndex: number,
  ) {
    if (solutions.length > 1) {
      return;
    }

    if (
      personIndex >=
      remainingPeople.length
    ) {
      evaluated += 1;
      const arrangement =
        Array.from(
          { length: seatCount },
          () => "",
        );

      for (const [
        person,
        seatIndex,
      ] of assignment.entries()) {
        arrangement[seatIndex] =
          person;
      }

      if (
        clues.every((clue) =>
          matchesClue(
            arrangement,
            clue,
            layout,
          ),
        )
      ) {
        solutions.push(arrangement);
        trace.push(
          `Accepted arrangement ${solutions.length}: ${arrangement.join(" | ")}`,
        );
      }

      return;
    }

    const person =
      remainingPeople[
        personIndex
      ]!;

    for (
      let seat = 0;
      seat < seatCount;
      seat++
    ) {
      if (usedSeats.has(seat)) {
        continue;
      }

      assignment.set(person, seat);
      usedSeats.add(seat);

      if (
        clues.every((clue) =>
          partialCluePossible(
            clue,
            assignment,
            layout,
          ),
        )
      ) {
        backtrack(personIndex + 1);
      }

      usedSeats.delete(seat);
      assignment.delete(person);

      if (solutions.length > 1) {
        break;
      }
    }
  }

  backtrack(0);

  return {
    solutions,
    solutionCount: solutions.length,
    solverComplexity: evaluated,
    trace,
  };
}

export function solveSeatingArrangement(
  participants: string[],
  clues: LinearSeatingClue[],
  arrangementType: SeatingArrangementType,
  orientationType: SeatingOrientationType,
  seatCount: number,
) {
  return solveSeating(
    participants,
    clues,
    arrangementType,
    orientationType,
    seatCount,
  );
}

export function solveLinearSeating(
  participants: string[],
  clues: LinearSeatingClue[],
  orientationType: SeatingOrientationType = "north",
  seatCount = participants.length,
) {
  return solveSeating(
    participants,
    clues,
    "linear",
    orientationType,
    seatCount,
  );
}

export function solveCircularSeating(
  participants: string[],
  clues: LinearSeatingClue[],
  orientationType: SeatingOrientationType = "center",
  seatCount = participants.length,
) {
  return solveSeating(
    participants,
    clues,
    "circular",
    orientationType,
    seatCount,
  );
}

export function validateSeatingScenario(
  participants: string[],
  arrangement: string[],
  clues: LinearSeatingClue[],
  prompt: SeatingQuestionPrompt | undefined,
  arrangementType: SeatingArrangementType,
  orientationType: SeatingOrientationType,
  seatCount: number,
): SeatingValidationResult {
  const warnings: string[] = [];
  const layout = buildLayout(
    arrangementType,
    orientationType,
    seatCount,
  );

  if (
    new Set(participants).size !==
    participants.length
  ) {
    warnings.push(
      "Participant list contained duplicate names.",
    );
  }

  if (
    !clues.every((clue) =>
      matchesClue(
        arrangement,
        clue,
        layout,
      ),
    )
  ) {
    warnings.push(
      "One or more clues contradicted the target arrangement.",
    );
  }

  const solveResult =
    solveSeating(
      participants,
      clues,
      arrangementType,
      orientationType,
      seatCount,
    );

  if (solveResult.solutionCount === 0) {
    warnings.push(
      "No valid seating arrangement satisfied the clue set.",
    );
  } else if (
    solveResult.solutionCount > 1
  ) {
    warnings.push(
      "Clue set produced multiple valid arrangements.",
    );
  }

  if (
    prompt &&
    isPromptDirectlyAnsweredByClue(
      prompt,
      clues,
      arrangementType,
      orientationType,
      seatCount,
    )
  ) {
    warnings.push(
      "Prompt answer was directly revealed by a clue.",
    );
  }

  return {
    valid: warnings.length === 0,
    warnings,
    solutionCount:
      solveResult.solutionCount,
    solverComplexity:
      solveResult.solverComplexity,
  };
}

export function validateLinearSeatingScenario(
  participants: string[],
  arrangement: string[],
  clues: LinearSeatingClue[],
  prompt?: SeatingQuestionPrompt,
  orientationType: SeatingOrientationType = "north",
  seatCount = participants.length,
) {
  return validateSeatingScenario(
    participants,
    arrangement,
    clues,
    prompt,
    "linear",
    orientationType,
    seatCount,
  );
}

export function validateCircularSeatingScenario(
  participants: string[],
  arrangement: string[],
  clues: LinearSeatingClue[],
  prompt?: SeatingQuestionPrompt,
  orientationType: SeatingOrientationType = "center",
  seatCount = participants.length,
) {
  return validateSeatingScenario(
    participants,
    arrangement,
    clues,
    prompt,
    "circular",
    orientationType,
    seatCount,
  );
}
