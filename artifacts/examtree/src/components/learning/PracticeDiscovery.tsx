import { useEffect, useMemo, useState } from "react";
import {
  BrainCircuit,
  ChevronDown,
  Command,
  Flame,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export type PracticeCategory = {
  id: string;
  title: string;
  examLevel: "SSC" | "Banking" | "CAT";
  complexity: number;
  logicPattern: string;
  group: string;
  isNew?: boolean;
  highWeightage?: boolean;
};

const defaultCategories: PracticeCategory[] = [
  {
    id: "hard-circular-puzzles",
    title: "Hard Circular Puzzles",
    examLevel: "Banking",
    complexity: 8,
    logicPattern: "Facing In/Out",
    group: "Seating",
    highWeightage: true,
  },
  {
    id: "variable-mapping",
    title: "Variable Mapping",
    examLevel: "CAT",
    complexity: 9,
    logicPattern: "Triad Mapping",
    group: "Puzzles",
    isNew: true,
  },
  {
    id: "linear-north-south",
    title: "Linear North/South",
    examLevel: "SSC",
    complexity: 4,
    logicPattern: "Facing North/South",
    group: "Seating",
  },
  {
    id: "coded-inequality",
    title: "Coded Inequality",
    examLevel: "Banking",
    complexity: 6,
    logicPattern: "Symbol Logic",
    group: "Deduction",
    highWeightage: true,
  },
];

export function PracticeDiscovery({
  categories = defaultCategories,
  onSelect,
  className,
}: {
  categories?: PracticeCategory[];
  onSelect?: (
    category: PracticeCategory,
  ) => void;
  className?: string;
}) {
  const [commandOpen, setCommandOpen] =
    useState(false);
  const [examLevel, setExamLevel] =
    useState<string>("All");
  const [complexity, setComplexity] =
    useState(10);
  const [logicPattern, setLogicPattern] =
    useState("All");

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isMac =
        navigator.platform
          .toLowerCase()
          .includes("mac");
      if (
        (isMac
          ? event.metaKey
          : event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () =>
      window.removeEventListener(
        "keydown",
        handler,
      );
  }, []);

  const logicPatterns = useMemo(
    () => [
      "All",
      ...new Set(
        categories.map(
          (category) =>
            category.logicPattern,
        ),
      ),
    ],
    [categories],
  );

  const filtered = categories.filter(
    (category) =>
      (examLevel === "All" ||
        category.examLevel === examLevel) &&
      category.complexity <= complexity &&
      (logicPattern === "All" ||
        category.logicPattern ===
          logicPattern),
  );

  const groups = [
    ...new Set(
      filtered.map(
        (category) => category.group,
      ),
    ),
  ];

  return (
    <aside
      className={cn(
        "rounded-md border border-zinc-200 bg-white p-3 text-zinc-950 dark:border-zinc-800 dark:bg-black dark:text-zinc-100",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
            Practice Categories
          </p>
          <h3 className="text-sm font-semibold">
            Discovery
          </h3>
        </div>
        <button
          type="button"
          onClick={() =>
            setCommandOpen(true)
          }
          className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
        >
          <Command className="h-3.5 w-3.5" />
          K
        </button>
      </div>

      <div className="space-y-2 rounded-md border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-950">
        <label className="text-xs font-medium text-zinc-500">
          Exam Level
          <select
            value={examLevel}
            onChange={(event) =>
              setExamLevel(
                event.target.value,
              )
            }
            className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-sm dark:border-zinc-800 dark:bg-black"
          >
            {["All", "SSC", "Banking", "CAT"].map(
              (level) => (
                <option
                  key={level}
                  value={level}
                >
                  {level}
                </option>
              ),
            )}
          </select>
        </label>

        <label className="block text-xs font-medium text-zinc-500">
          Difficulty Rating: {complexity}/10
          <input
            type="range"
            min={1}
            max={10}
            value={complexity}
            onChange={(event) =>
              setComplexity(
                Number(event.target.value),
              )
            }
            className="mt-2 w-full accent-indigo-600"
          />
        </label>

        <label className="text-xs font-medium text-zinc-500">
          Logic Pattern
          <select
            value={logicPattern}
            onChange={(event) =>
              setLogicPattern(
                event.target.value,
              )
            }
            className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-sm dark:border-zinc-800 dark:bg-black"
          >
            {logicPatterns.map((pattern) => (
              <option
                key={pattern}
                value={pattern}
              >
                {pattern}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Accordion
        type="multiple"
        defaultValue={groups}
        className="mt-3"
      >
        {groups.map((group) => (
          <AccordionItem
            key={group}
            value={group}
            className="border-zinc-200 dark:border-zinc-800"
          >
            <AccordionTrigger className="py-2 text-sm hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-indigo-600" />
                {group}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {filtered
                  .filter(
                    (category) =>
                      category.group === group,
                  )
                  .map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() =>
                        onSelect?.(category)
                      }
                      className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                      <span>
                        <span className="block font-medium">
                          {category.title}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {category.logicPattern} · {category.complexity}/10
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        {category.isNew ? (
                          <span className="rounded-sm bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                            New
                          </span>
                        ) : null}
                        {category.highWeightage ? (
                          <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                            <Flame className="h-3 w-3" />
                            High Weightage
                          </span>
                        ) : null}
                      </span>
                    </button>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <CommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
      >
        <CommandInput placeholder="Search: Hard circular puzzles" />
        <CommandList>
          <CommandEmpty>
            No practice category found.
          </CommandEmpty>
          <CommandGroup heading="Jump to practice">
            {categories.map((category) => (
              <CommandItem
                key={category.id}
                value={`${category.title} ${category.logicPattern} ${category.examLevel}`}
                onSelect={() => {
                  setCommandOpen(false);
                  onSelect?.(category);
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>{category.title}</span>
                <span className="ml-auto text-xs text-zinc-500">
                  {category.complexity}/10
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Compact filters for power users
        <ChevronDown className="ml-auto h-3.5 w-3.5" />
      </div>
    </aside>
  );
}

