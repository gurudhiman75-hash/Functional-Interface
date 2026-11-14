console.log("home.tsx loaded");

export default function Home() {
  console.log("Home component rendered");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center">Home Page Loaded Successfully!</h1>
        <p className="text-center mt-4">If you can see this, the routing is working.</p>
        <p className="text-center mt-4">Now let's test the API calls...</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded block mx-auto"
          onClick={async () => {
            try {
              console.log("Testing API call...");
              const response = await fetch("http://localhost:3001/api/tests");
              console.log("Response status:", response.status);
              console.log("Response headers:", response.headers);
              const text = await response.text();
              console.log("Response text:", text);
              if (response.ok) {
                const data = JSON.parse(text);
                alert(`API returned ${data.length} tests!`);
              } else {
                alert(`API error: ${response.status} - ${text}`);
              }
            } catch (error) {
              console.error("API error:", error);
              alert("API call failed: " + (error instanceof Error ? error.message : String(error)));
            }
          }}
        >
          Test API Call
        </button>
      </div>
    </div>
  );
}
