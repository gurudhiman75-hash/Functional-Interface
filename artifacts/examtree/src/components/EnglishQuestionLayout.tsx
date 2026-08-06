import { QuestionRichText } from "@/components/QuestionRichText";
import {
  detectSeriesRenderingContract,
  type DetectedSeriesRenderingContract,
} from "@/lib/series-rendering-contract";

function splitPassage(
  content: string | number | null | undefined,
) {
  const text =
    typeof content === "string"
      ? content
      : content == null
        ? ""
        : String(content);
  const passageMatch = text.match(
    /([\s\S]*?Passage:\s*)([\s\S]*?)(\n\n(?:What|Which|Choose|Identify|Arrange)\b[\s\S]*)/i,
  );

  if (!passageMatch) {
    return null;
  }

  return {
    intro: passageMatch[1].trim(),
    passage: passageMatch[2].trim(),
    question: passageMatch[3].trim(),
  };
}

function ProtectedSeriesLine({
  contract,
  lang,
}: {
  contract: DetectedSeriesRenderingContract;
  lang?: string;
}) {
  if (contract.kind === "PERIODIC_GAP_LINE") {
    return (
      <div
        className="mt-3 max-w-full overflow-x-auto rounded-md border border-slate-200 bg-slate-50 p-3"
        aria-label="Letter-gap series. Scroll horizontally to keep the repeating pattern on one line."
      >
        <div className="w-max whitespace-nowrap font-mono text-base font-semibold tracking-[0.12em] text-slate-900 normal-case">
          {contract.seriesLine}
        </div>
      </div>
    );
  }

  const accessible = [
    "Letter-group series. Letter case is meaningful.",
    ...contract.markerDescriptions,
  ].join(" ");
  return (
    <div
      className="mt-3 max-w-full overflow-x-auto rounded-md border border-slate-200 bg-slate-50 p-3"
      role="img"
      aria-label={accessible}
      lang={lang}
    >
      <div className="flex w-max items-center gap-2 whitespace-nowrap font-mono text-base font-semibold tracking-wide text-slate-900 normal-case" aria-hidden="true">
        {contract.seriesLine.split(",").map((rawGroup, groupIndex, groups) => (
          <span key={`${rawGroup}-${groupIndex}`} className="inline-flex items-center">
            {[...rawGroup.trim()].map((character, characterIndex) =>
              /[a-z]/.test(character) ? (
                <span
                  key={`${character}-${characterIndex}`}
                  className="mx-px inline-flex min-w-[1.4em] items-center justify-center rounded border-2 border-current px-0.5 font-bold underline decoration-2 underline-offset-2 normal-case"
                >
                  {character}
                </span>
              ) : (
                <span key={`${character}-${characterIndex}`}>{character}</span>
              ),
            )}
            {groupIndex < groups.length - 1 ? (
              <span className="ml-2" aria-hidden="true">,</span>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}

function SeriesAwareQuestion({
  content,
  lang,
  className,
}: {
  content: string | number | null | undefined;
  lang?: string;
  className?: string;
}) {
  const contract = detectSeriesRenderingContract(content);
  if (!contract) {
    return <QuestionRichText content={content} lang={lang} className={className} />;
  }
  return (
    <div className={className}>
      {contract.intro ? (
        <QuestionRichText content={contract.intro} lang={lang} />
      ) : null}
      <ProtectedSeriesLine contract={contract} lang={lang} />
    </div>
  );
}

export function EnglishQuestionLayout({
  content,
  lang,
  className,
}: {
  content: string | number | null | undefined;
  lang?: string;
  className?: string;
}) {
  const split = splitPassage(content);

  if (!split) {
    return (
      <SeriesAwareQuestion
        content={content}
        lang={lang}
        className={className}
      />
    );
  }

  return (
    <div
      className={[
        "grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="max-h-80 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/80 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Passage
        </p>
        {split.intro ? (
          <QuestionRichText
            content={split.intro.replace(
              /Passage:\s*$/i,
              "",
            )}
            lang={lang}
            className="mb-2 text-sm text-slate-600"
          />
        ) : null}
        <QuestionRichText
          content={split.passage}
          lang={lang}
          className="text-sm leading-7 text-slate-800"
        />
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Question
        </p>
        <SeriesAwareQuestion
          content={split.question}
          lang={lang}
          className="text-sm leading-7 text-slate-800"
        />
      </div>
    </div>
  );
}

export default EnglishQuestionLayout;
