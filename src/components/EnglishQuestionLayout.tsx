import { QuestionRichText } from "@/components/QuestionRichText";

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
      <QuestionRichText
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
        <QuestionRichText
          content={split.question}
          lang={lang}
          className="text-sm leading-7 text-slate-800"
        />
      </div>
    </div>
  );
}

export default EnglishQuestionLayout;
