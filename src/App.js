// src/App.js
import React, { useState, useEffect } from "react";
import { supabase } from "./Supabase.js";
import UploadZone from "./components/UploadZone.js";

function App() {
  const [uploadId, setUploadId] = useState(null);
  const [roast, setRoast]   = useState(null);
  const [loading, setLoading] = useState(false);

  // When we get an uploadId, start listening for the analysis row
  useEffect(() => {
    if (!uploadId) return;

    setLoading(true);

    // 1. Fetch initial row (in case it already exists)
    supabase
      .from("analyses")
      .select("grammar,impact,formatting")
      .eq("upload_id", uploadId)
      .single()
      .then(({ data, error }) => {
        if (data) {
          setRoast(data);
          setLoading(false);
        }
      });

    // 2. Subscribe to realtime updates on that row
    const subscription = supabase
      .channel(`analyses:upload_id=eq.${uploadId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "analyses", filter: `upload_id=eq.${uploadId}` },
        ({ new: newRow }) => {
          setRoast({
            grammar: newRow.grammar,
            impact: newRow.impact,
            formatting: newRow.formatting,
          });
          setLoading(false);
        }
      )
      .subscribe();

    // cleanup on unmount or uploadId change
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [uploadId]);

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Resume Roaster 🔥</h1>
      <p>made by gpt lover 🤤 shashwat</p>

      {!uploadId && (
        <UploadZone
          onRoastComplete={(id) => {
            setUploadId(id);
          }}
        />
      )}

      {loading && <p>Processing roast… please hang tight!</p>}

      {roast && (
        <div style={{ marginTop: "1.5rem" }}>
          <section>
            <h2>Grammar Gauntlet</h2>
            <p style={{ whiteSpace: "pre-wrap" }}>{roast.grammar}</p>
          </section>

          <section>
            <h2>Impact Igniter</h2>
            <p style={{ whiteSpace: "pre-wrap" }}>{roast.impact}</p>
          </section>

          <section>
            <h2>Formatting Finesse</h2>
            <p style={{ whiteSpace: "pre-wrap" }}>{roast.formatting}</p>
          </section>

          <button
            style={{ marginTop: "1rem" }}
            onClick={() => {
              setUploadId(null);
              setRoast(null);
            }}
          >
            Roast Another Resume
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
