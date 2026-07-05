export type HealthCheckResponse = {
    status: "ok";
};
export declare const HealthCheckResponse: {
    parse(value: unknown): HealthCheckResponse;
};
export type User = {
    id: string;
    email: string;
    name: string;
    role: "admin" | "student";
    createdAt: number;
    updatedAt: number;
};
export declare const User: {
    parse(value: unknown): User;
};
export type Category = {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    testsCount: number;
};
export declare const Category: {
    parse(value: unknown): Category;
};
export type Test = {
    id: string;
    name: string;
    category: string;
    categoryId: string;
    duration: number;
    totalQuestions: number;
    attempts: number;
    avgScore: number;
    difficulty: "Easy" | "Medium" | "Hard";
    sectionTimingMode?: "none" | "fixed";
    sectionTimings?: {
        name: string;
        minutes: number;
    }[];
    sectionSettings?: {
        name: string;
        locked: boolean;
    }[];
    sections: TestSection[];
    /** Languages available for this test. Defaults to ["en"] when absent. */
    languages?: Language[];
    /** Marks per correct answer (test-level default). Defaults to 1 when absent. */
    marksPerQuestion?: number;
    /** Marks deducted per wrong answer (non-negative). Defaults to 0 when absent. */
    negativeMarks?: number;
    /** Marks for unattempted questions. Defaults to 0 when absent. */
    unattemptedMarks?: number;
};
export declare const Test: {
    parse(value: unknown): Test;
};
export type TestSection = {
    id: string;
    name: string;
    questions: Question[];
};
export type Language = "en" | "hi" | "pa";
export type SeatingDiagramArrangementType = "linear" | "circular" | "square" | "rectangular" | "double-row" | "parallel-row" | "floor" | "box-stack" | "scheduling" | "ranking" | "mapping";
export type SeatingDiagramOrientationType = "north" | "south" | "center" | "outward" | "alternate" | "mixed";
export type SeatingDiagramFacing = "north" | "south" | "center" | "outward";
export type SeatingDiagramSeat = {
    label: string;
    position: number;
    facing: SeatingDiagramFacing;
    highlighted?: boolean;
    isAnswer?: boolean;
    row?: number;
    col?: number;
    seatLabel?: string;
};
export type LayoutManifestType = "LINEAR" | "RING" | "GRID" | "STACK" | "PARALLEL";
export type LayoutManifestFacing = "IN" | "OUT" | "NORTH" | "SOUTH";
export type LayoutManifestSlotState = "EMPTY" | "OCCUPIED" | "HIGHLIGHTED" | "HIDDEN";
export type LayoutManifestSlot = {
    id: number;
    coordinates: {
        x: number;
        y: number;
    };
    facing?: LayoutManifestFacing;
    data: {
        primaryLabel: string;
        secondaryLabel?: string;
        tertiaryLabel?: string;
        colorCode?: string;
    };
    state: LayoutManifestSlotState;
};
export type LayoutManifestSlotMapEntry = {
    slotId: number;
    coordinates: {
        x: number;
        y: number;
    };
    label?: string;
    row?: number;
    col?: number;
};
export type LayoutManifestVisualLayer = {
    colorCode?: string;
    strokeCode?: string;
    style?: string;
};
export type LayoutManifestAttributeLayer = {
    core?: string;
    badge?: string;
    detail?: string;
    visual?: LayoutManifestVisualLayer;
};
export type LayoutManifestSyncState = {
    entityPositions: Record<string, number>;
    highlightedSlotIds: number[];
    hiddenSlotIds?: number[];
    availableEntities?: string[];
};
export type LayoutManifestTimelineEntry = {
    stepIndex: number;
    currentVisibleArrangement: Record<number, string>;
    highlightedSlotIds: number[];
    availableEntities?: string[];
    note?: string;
};
export type LayoutManifest = {
    type: LayoutManifestType;
    dimensions: {
        rows: number;
        cols: number;
    };
    slots: LayoutManifestSlot[];
    slotMap?: LayoutManifestSlotMapEntry[];
    stateSync?: Record<string, LayoutManifestSyncState>;
    attributeLayers?: Record<string, LayoutManifestAttributeLayer>;
    reasoningTimeline?: LayoutManifestTimelineEntry[];
};
export type SeatingDiagramQuestionTarget = {
    label: string;
    promptType?: string;
    answerLabel?: string;
};
export type SeatingDiagramData = {
    arrangementType: SeatingDiagramArrangementType;
    orientationType: SeatingDiagramOrientationType;
    seats: SeatingDiagramSeat[];
    seatLabels?: string[];
    questionTarget?: SeatingDiagramQuestionTarget;
    rowCount?: number;
    colCount?: number;
    layoutManifest?: LayoutManifest;
};
export type SeatingExplanationBranch = {
    id: string;
    label: string;
    status: "candidate" | "eliminated" | "selected";
    text: string;
    arrangementSnapshot?: SeatingDiagramData | null;
};
export type SeatingExplanationStep = {
    type: "reference" | "inference" | "case-analysis" | "elimination" | "final-arrangement";
    title: string;
    text: string;
    arrangementSnapshot?: SeatingDiagramData | null;
    branches?: SeatingExplanationBranch[];
};
export type SeatingExplanationFlow = {
    summary?: string;
    steps: SeatingExplanationStep[];
};
export type Question = {
    id: number;
    text: string | null;
    options: string[];
    correct: number;
    section: string;
    explanation: string | null;
    textHi?: string | null;
    optionsHi?: string[] | null;
    explanationHi?: string | null;
    textPa?: string | null;
    optionsPa?: string[] | null;
    explanationPa?: string | null;
    seatingDiagram?: SeatingDiagramData | null;
    seatingExplanationFlow?: SeatingExplanationFlow | null;
};
export type TestAttempt = {
    id: string;
    userId: string;
    testId: string;
    testName: string;
    category: string;
    score: number;
    /** Marks-based score: sum of +marksPerQuestion for correct and -negativeMarks for wrong */
    actualScore?: number | null;
    correct: number;
    wrong: number;
    unanswered: number;
    totalQuestions: number;
    timeSpent: number;
    createdAt: string | Date;
    /** "REAL" | "PRACTICE" — absent/null means legacy row, treated as REAL */
    attemptType?: "REAL" | "PRACTICE" | null;
    sectionStats?: {
        name: string;
        correct: number;
        wrong: number;
        unanswered: number;
        totalQuestions: number;
        accuracy: number;
    }[];
    sectionTimeSpent?: {
        name: string;
        minutesSpent: number;
    }[];
    questionReview?: {
        questionId: number;
        section: string;
        text: string;
        options: string[];
        selected: number | null;
        correct: number;
        flagged: boolean;
        explanation: string;
        seatingDiagram?: SeatingDiagramData | null;
        seatingExplanationFlow?: SeatingExplanationFlow | null;
        proceduralLogic?: unknown | null;
        languages?: unknown | null;
        motifs?: unknown | null;
        inferenceTrace?: unknown | null;
    }[];
};
export declare const TestAttempt: {
    parse(value: unknown): TestAttempt;
};
