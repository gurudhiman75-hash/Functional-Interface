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

      setGenerated(
        data.questions || [],
      );
    } catch (error) {
      console.error(error);

      alert(
        "Generation failed",
      );
    } finally {
      setLoading(false);
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
            : "Generate Questions"}
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
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="font-medium">
                  {idx + 1}.{" "}
                  {String(q.text)}
                </div>

                <div className="space-y-2">
                  {q.options?.map(
                    (
                      opt: any,
                      i: number,
                    ) => (
                      <div
                        key={i}
                        className={`border rounded p-2 ${
                          q.correct ===
                          i
                            ? "bg-green-100"
                            : ""
                        }`}
                      >
                        {String(opt)}
                      </div>
                    ),
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  {String(
                    q.explanation,
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}