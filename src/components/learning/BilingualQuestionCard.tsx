import { useMemo, useState } from "react";
import { Languages } from "lucide-react";
import { QuestionRichText } from "@/components/QuestionRichText";
import { cn } from "@/lib/utils";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;

export function hasGurmukhi(value: string) {
  return GURMUKHI_RE.test(value);
}

export function renderBilingualSegments(value: string) {
  const parts = value
    .normalize("NFC")
    .split(/([\u0A00-\u0A7F][\u0A00-\u0A7F\s\u0964.,;:!?'"()\-]*)/g)
    .filter(Boolean);

  return parts.map((part, index) =>
    hasGurmukhi(part) ? (
      <span
        key={`${part}-${index}`}
        lang="pa"
        className="punjabi-content leading-relaxed"
      >
        {part}
      </span>
    ) : (
      <span key={`${part}-${index}`}>
        {part}
      </span>
    ),
  );
}

type BilingualQuestionCardProps = {
  englishText: string;
  punjabiText?: string;
  options?: string[];
  explanation?: string;
  defaultLanguage?: "en" | "pa";
  className?: string;
};

export function BilingualQuestionCard({
  englishText,
  punjabiText,
  options = [],
  explanation,
  defaultLanguage = "en",
  className,
}: BilingualQuestionCardProps) {
  const [language, setLanguage] =
    useState(defaultLanguage);
  const activeText =
    language === "pa" && punjabiText
      ? punjabiText
      : englishText;
  const activeLang =
    language === "pa" && punjabiText
      ? "pa"
      : "en";
  const canToggle = Boolean(punjabiText);
  const segmentedPreview = useMemo(
    () => renderBilingualSegments(activeText),
    [activeText],
  );

  return (
    <section
      className={cn(
        "rounded-md border border-zinc-200 bg-white p-4 text-zinc-950 shadow-none",
        "dark:border-zinc-800 dark:bg-black dark:text-zinc-100",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
            Question
          </p>
          <h3 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Bilingual Content
          </h3>
        </div>
        {canToggle ? (
          <button
            type="button"
            onClick={() =>
              setLanguage((current) =>
                current === "en" ? "pa" : "en",
              )
            }
            className="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-indigo-300 hover:text-indigo-700 dark:border-zinc-800 dark:text-zinc-300"
          >
            <Languages className="h-3.5 w-3.5" />
            Toggle Language
          </button>
        ) : null}
      </div>

      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
        <QuestionRichText
          content={activeText}
          lang={activeLang}
          className="text-[15px]"
        />
        <span className="sr-only">
          {segmentedPreview}
        </span>
      </div>

      {options.length ? (
        <div className="mt-4 grid gap-2">
          {options.map((option, index) => (
            <div
              key={`${option}-${index}`}
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <span className="mr-2 font-semibold text-zinc-500">
                {String.fromCharCode(65 + index)}.
              </span>
              <QuestionRichText
                content={option}
                inline
                lang={
                  hasGurmukhi(option) ? "pa" : "en"
                }
              />
            </div>
          ))}
        </div>
      ) : null}

      {explanation ? (
        <div className="mt-4 border-t border-zinc-200 pt-3 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
          <p className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">
            Step-by-Step Explanation
          </p>
          <QuestionRichText
            content={explanation}
            lang={
              hasGurmukhi(explanation)
                ? "pa"
                : "en"
            }
          />
        </div>
      ) : null}
    </section>
  );
}

