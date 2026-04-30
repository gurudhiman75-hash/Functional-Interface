import {
  useEffect,
  useState,
} from "react";

const API_BASE_URL =
  import.meta.env.DEV
    ? "http://localhost:3001"
    : "";

export default function AdminGeneratorPage() {
  const [patternId, setPatternId] =
    useState("");

  const [count, setCount] =
    useState(5);

  const [generated, setGenerated] =
    useState<any[]>([]);

  const [patterns, setPatterns] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);
 const [newPattern, setNewPattern] =
  useState({
    id: "",
    name: "",
    section: "quant",
    topic: "",
    subtopic: "",
    difficulty: "Easy",
    formula: "",

    template: "",

    variables: `{
  "a": { "min": 1, "max": 10 },
  "b": { "min": 1, "max": 10 }
}`,

    offsets: "-1,1,2",
  });

const [
  editingPatternId,
  setEditingPatternId,
] = useState<string | null>(
  null,
);
 

  useEffect(() => {
    async function loadPatterns() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/generator/patterns`,
        );

        const data =
          await res.json();

        setPatterns(
          data.patterns || [],
        );
      } catch (error) {
        console.error(error);
      }
    }

    loadPatterns();
  }, []);
  async function savePattern() {
    try {
      const res = await fetch(
        editingPatternId
          ? `${API_BASE_URL}/api/generator/patterns/${editingPatternId}`
          : `${API_BASE_URL}/api/generator/patterns`,
        {
          method:
            editingPatternId
              ? "PUT"
              : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id: newPattern.id,

            name:
              newPattern.name,

            section:
              newPattern.section,

            topic:
              newPattern.topic,

            subtopic:
              newPattern.subtopic,

            type: "formula",

            difficulty:
              newPattern.difficulty,

            formula:
              newPattern.formula,

            templateVariants: [
              newPattern.template,
            ],

            variables: JSON.parse(
              newPattern.variables,
            ),

            distractorStrategy:
            {
              type: "numeric_offsets",

              offsets:
                newPattern.offsets
                  .split(",")
                  .map((x) =>
                    Number(
                      x.trim(),
                    ),
                  ),
            },
          }),
        },
      );

      const data = await res.json();

      console.log(data);

      alert(
        "Pattern created",
      );

      const patternsRes =
        await fetch(
          `${API_BASE_URL}/api/generator/patterns`,
        );

      const patternsData =
        await patternsRes.json();

      setPatterns(
        patternsData.patterns ||
        [],
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to create pattern",
      );
    }
  }
  function isDuplicateQuestion(
    currentIndex: number,
  ) {
    const current =
      generated[
        currentIndex
      ]?.text
        ?.toLowerCase()
        ?.replace(/\s+/g, " ")
        ?.trim();

    return generated.some(
      (q, idx) => {
        if (
          idx === currentIndex
        ) {
          return false;
        }

        const compare =
          q?.text
            ?.toLowerCase()
            ?.replace(
              /\s+/g,
              " ",
            )
            ?.trim();

        return (
          current === compare
        );
      },
    );
  }
  async function deletePattern(
    id: string,
  ) {
    try {
      await fetch(
        `${API_BASE_URL}/api/generator/patterns/${id}`,
        {
          method: "DELETE",
        },
      );

      setPatterns(
        patterns.filter(
          (p) => p.id !== id,
        ),
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to delete pattern",
      );
    }
  }
  async function generate() {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/generator/pattern`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            patternId,
            count,
          }),
        },
      );

      const data = await res.json();

      console.log(data);

      setGenerated((prev) => [
        ...prev,
        ...(data.questions || []),
      ]);
    } catch (error) {
      console.error(error);

      alert(
        "Generation failed",
      );
    } finally {
      setLoading(false);
    }
  }

  async function regenerateQuestion(
    index: number,
  ) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/generator/pattern`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            patternId,
            count: 1,
          }),
        },
      );

      const data = await res.json();

      if (
        data.questions?.length
      ) {
        const updated = [
          ...generated,
        ];

        updated[index] =
          data.questions[0];

        setGenerated(updated);
      }
    } catch (error) {
      console.error(error);

      alert(
        "Failed to regenerate question",
      );
    }
  }
  async function saveQuestions() {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/generator/save`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            questions: generated,
          }),
        },
      );

      const data = await res.json();

      alert(
        `Saved ${data.count} questions`,
      );
    } catch (error) {
      console.error(error);

      alert("Save failed");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Question Generator
      </h1>
      <div className="border rounded-lg p-4 space-y-4">
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">
            Existing Patterns
          </h2>

          <div className="space-y-2">
            {patterns.map((p) => (
              <div
                key={p.id}
                className="border rounded p-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {p.name}
                  </div>

                  <div className="text-sm text-gray-600">
                    {p.topic}
                  </div>

                  <div className="text-xs text-gray-500">
                    {p.formula}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setPatternId(p.id)
                    }
                    className="bg-black text-white px-3 py-1 rounded text-sm"
                  >
                    Use
                  </button>
                  <button
                    onClick={() => {
                      setEditingPatternId(
                        p.id,
                      );

                      setNewPattern({
                        id: p.id,
                        name: p.name,
                        section:
                          p.section,
                        topic: p.topic,
                        subtopic:
                          p.subtopic,
                        difficulty:
                          p.difficulty,
                        formula:
                          p.formula || "",

                        template:
                          p.templateVariants?.[0] ||
                          "",

                        variables:
                          JSON.stringify(
                            p.variables,
                            null,
                            2,
                          ),

                        offsets:
                          p
                            .distractorStrategy
                            ?.offsets?.join(
                              ",",
                            ) || "",
                      });
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      deletePattern(p.id)
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <h2 className="text-xl font-semibold">
          Create Pattern
        </h2>

        <input
          placeholder="Pattern ID"
          value={newPattern.id}
          onChange={(e) =>
            setNewPattern({
              ...newPattern,
              id: e.target.value,
            })
          }
          className="border rounded p-2 w-full"
        />

        <input
          placeholder="Pattern Name"
          value={newPattern.name}
          onChange={(e) =>
            setNewPattern({
              ...newPattern,
              name: e.target.value,
            })
          }
          className="border rounded p-2 w-full"
        />

        <input
          placeholder="Topic"
          value={newPattern.topic}
          onChange={(e) =>
            setNewPattern({
              ...newPattern,
              topic:
                e.target.value,
            })
          }
          className="border rounded p-2 w-full"
        />

        <input
          placeholder="Formula (example: a + b)"
          value={newPattern.formula}
          onChange={(e) =>
            setNewPattern({
              ...newPattern,
              formula:
                e.target.value,
            })
          }
          className="border rounded p-2 w-full"
        />

        <textarea
          placeholder="Template"
          value={newPattern.template}
          onChange={(e) =>
            setNewPattern({
              ...newPattern,
              template:
                e.target.value,
            })
          }
          className="border rounded p-2 w-full h-24"
        />

        <textarea
          placeholder="Variables JSON"
          value={newPattern.variables}
          onChange={(e) =>
            setNewPattern({
              ...newPattern,
              variables:
                e.target.value,
            })
          }
          className="border rounded p-2 w-full h-32"
        />

        <button
          onClick={savePattern}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingPatternId
            ? "Update Pattern"
            : "Create Pattern"}
        </button>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div>
          <label className="block mb-2 font-medium">
            Pattern
          </label>

          <select
            value={patternId}
            onChange={(e) =>
              setPatternId(
                e.target.value,
              )
            }
            className="border rounded p-2 w-full"
          >
            <option value="">
              Select Pattern
            </option>

            {patterns.map((p) => (
              <option
                key={p.id}
                value={p.id}
              >
                {p.name} (
                {p.topic})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Number of Questions
          </label>

          <input
            type="number"
            value={count}
            onChange={(e) =>
              setCount(
                Number(
                  e.target.value,
                ),
              )
            }
            className="border rounded p-2 w-full"
          />
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading
            ? "Generating..."
            : "Generate Batch"}
        </button>
        <button
          onClick={() =>
            setGenerated([])
          }
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Clear All
        </button>
      </div>

      {generated.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">
              Generated Questions
            </h2>

            <button
              onClick={
                saveQuestions
              }
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save to Question Bank
            </button>
          </div>

          {generated.map(
            (q, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-4 space-y-3 ${isDuplicateQuestion(idx)
                  ? "border-red-500 bg-red-50"
                  : ""
                  }`}
              >
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() =>
                      regenerateQuestion(idx)
                    }
                    className="text-blue-600 text-sm"
                  >
                    Regenerate
                  </button>

                  <button
                    onClick={() => {
                      setGenerated(
                        generated.filter(
                          (
                            _: any,
                            questionIndex: number,
                          ) =>
                            questionIndex !==
                            idx,
                        ),
                      );
                    }}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
                {isDuplicateQuestion(
                  idx,
                ) && (
                    <div className="text-red-600 text-sm font-medium">
                      Duplicate Question
                    </div>
                  )}
                <div className="font-medium">
                  {idx + 1}.{" "}
                  <textarea
                    value={q.text}
                    onChange={(e) => {
                      const updated = [
                        ...generated,
                      ];

                      updated[idx].text =
                        e.target.value;

                      setGenerated(updated);
                    }}
                    className="border rounded p-2 w-full"
                  />
                </div>

                <div className="space-y-2">
                  {q.options?.map(
                    (
                      opt: any,
                      i: number,
                    ) => (
                      <div
                        key={i}
                        className={`border rounded p-2 ${q.correct === i
                          ? "bg-green-100"
                          : ""
                          }`}
                      >
                        <input
                          value={opt}
                          onChange={(e) => {
                            const updated = [
                              ...generated,
                            ];

                            updated[idx].options[i] =
                              e.target.value;

                            setGenerated(updated);
                          }}
                          className="w-full bg-transparent outline-none"
                        />
                      </div>
                    ),
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Correct Answer:
                  </span>

                  <select
                    value={q.correct}
                    onChange={(e) => {
                      const updated = [
                        ...generated,
                      ];

                      updated[idx].correct =
                        Number(
                          e.target.value,
                        );

                      setGenerated(updated);
                    }}
                    className="border rounded p-2"
                  >
                    {q.options.map(
                      (
                        _: any,
                        optionIndex: number,
                      ) => (
                        <option
                          key={optionIndex}
                          value={optionIndex}
                        >
                          Option{" "}
                          {optionIndex + 1}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="text-sm text-gray-600">
                  <div>
                    <label className="text-sm font-medium">
                      Topic
                    </label>

                    <input
                      value={q.topic || ""}
                      onChange={(e) => {
                        const updated = [
                          ...generated,
                        ];

                        updated[idx].topic =
                          e.target.value;

                        setGenerated(updated);
                      }}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Section
                    </label>

                    <input
                      value={
                        q.section || ""
                      }
                      onChange={(e) => {
                        const updated = [
                          ...generated,
                        ];

                        updated[idx].section =
                          e.target.value;

                        setGenerated(updated);
                      }}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Difficulty
                    </label>

                    <select
                      value={
                        q.difficulty ||
                        "Easy"
                      }
                      onChange={(e) => {
                        const updated = [
                          ...generated,
                        ];

                        updated[idx].difficulty =
                          e.target.value;

                        setGenerated(updated);
                      }}
                      className="border rounded p-2 w-full"
                    >
                      <option value="Easy">
                        Easy
                      </option>

                      <option value="Medium">
                        Medium
                      </option>

                      <option value="Hard">
                        Hard
                      </option>
                    </select>
                  </div>
                  <textarea
                    value={q.explanation}
                    onChange={(e) => {
                      const updated = [
                        ...generated,
                      ];

                      updated[idx].explanation =
                        e.target.value;

                      setGenerated(updated);
                    }}
                    className="border rounded p-2 w-full"
                  />
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}