"use client";

import { useEffect, useState } from "react";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  private: boolean;
  description: string | null;
}

export default function GitHubReposPage() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRepos() {
      try {
        const response = await fetch("/api/github/repos");

        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }

        const data = await response.json();
        setRepos(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load GitHub repositories.");
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading repositories...</p>;
  }

  if (error) {
    return <p style={{ padding: "2rem" }}>{error}</p>;
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>My GitHub Repositories</h1>

      {selectedRepo && (
        <div
          style={{
            marginTop: "1.5rem",
            marginBottom: "2rem",
            padding: "1rem",
            border: "2px solid #2563eb",
            borderRadius: "10px",
            backgroundColor: "#f0f7ff",
          }}
        >
          <h2>Selected Repository</h2>
          <p>
            <strong>{selectedRepo.full_name}</strong>
          </p>

          <button
            type="button"
            style={{
              padding: "0.7rem 1.2rem",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#2563eb",
              color: "white",
              fontWeight: "bold",
            }}
            onClick={async () => {
  try {
    const [owner, repo] = selectedRepo.full_name.split("/");

    const response = await fetch("/api/github/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        owner,
        repo,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to connect repository");
      return;
    }

    alert("Repository connected successfully!");
  } catch (error) {
    console.error(error);
    alert("Something went wrong while connecting the repository.");
  }
}}
          >
            Connect Repository
          </button>
        </div>
      )}

      {repos.length === 0 ? (
        <p>No repositories found.</p>
      ) : (
        <div style={{ marginTop: "1.5rem" }}>
          {repos.map((repo) => (
            <div
              key={repo.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h2>{repo.name}</h2>

              <p>
                {repo.description || "No description available."}
              </p>

              <p>
                {repo.private ? "🔒 Private" : "🌐 Public"}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedRepo(repo)}
                  style={{
                    padding: "0.6rem 1rem",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "#111827",
                    color: "white",
                  }}
                >
                  Select Repository
                </button>

                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}