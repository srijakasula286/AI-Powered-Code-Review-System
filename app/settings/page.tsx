"use client";

import { useEffect, useState } from "react";

type ScanSettings = {
  skipArchitecture: boolean;
  skipSecurity: boolean;
  minSeverity: "high" | "medium" | "low";
};

type Repository = {
  ownerAndRepo: string;
  cloneUrl?: string;
  connectedAt?: string;
  settings?: ScanSettings;
};

const defaultSettings: ScanSettings = {
  skipArchitecture: false,
  skipSecurity: false,
  minSeverity: "low",
};

export default function SettingsPage() {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [settings, setSettings] =
    useState<ScanSettings>(defaultSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadRepository() {
      try {
        const response = await fetch("/api/github/connect");

        if (!response.ok) {
          throw new Error("Failed to load repository");
        }

        const data = await response.json();

        const repo = data.repository ?? null;

        setRepository(repo);

        if (repo?.settings) {
          setSettings({
            skipArchitecture: repo.settings.skipArchitecture ?? false,
            skipSecurity: repo.settings.skipSecurity ?? false,
            minSeverity: repo.settings.minSeverity ?? "low",
          });
        }
      } catch (error) {
        console.error("Failed to load repository:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRepository();
  }, []);

  async function saveSettings() {
    if (!repository) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/github/connect", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerAndRepo: repository.ownerAndRepo,
          settings,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setRepository(data.repository);
      setMessage("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <h1>Settings</h1>

      <section
        style={{
          marginTop: "30px",
          padding: "24px",
          border: "1px solid #ddd",
          borderRadius: "12px",
        }}
      >
        <h2>GitHub Connection</h2>

        {loading ? (
          <p>Loading...</p>
        ) : repository ? (
          <>
            <p>
              <strong>Status:</strong> Connected ✓
            </p>

            <p>
              <strong>Repository:</strong>{" "}
              {repository.ownerAndRepo}
            </p>

            {repository.cloneUrl && (
              <p>
                <strong>Clone URL:</strong> {repository.cloneUrl}
              </p>
            )}

            {repository.connectedAt && (
              <p>
                <strong>Connected at:</strong>{" "}
                {new Date(
                  repository.connectedAt
                ).toLocaleString()}
              </p>
            )}
          </>
        ) : (
          <p>No repository connected.</p>
        )}
      </section>

      {repository && (
        <section
          style={{
            marginTop: "30px",
            padding: "24px",
            border: "1px solid #ddd",
            borderRadius: "12px",
          }}
        >
          <h2>Analysis Settings</h2>

          <div style={{ marginTop: "20px" }}>
            <label>
              <input
                type="checkbox"
                checked={settings.skipArchitecture}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    skipArchitecture: event.target.checked,
                  })
                }
              />{" "}
              Skip Architecture checks
            </label>
          </div>

          <div style={{ marginTop: "16px" }}>
            <label>
              <input
                type="checkbox"
                checked={settings.skipSecurity}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    skipSecurity: event.target.checked,
                  })
                }
              />{" "}
              Skip Security checks
            </label>
          </div>

          <div style={{ marginTop: "20px" }}>
            <label>
              <strong>Minimum Severity:</strong>{" "}
              <select
                value={settings.minSeverity}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    minSeverity: event.target.value as
                      | "high"
                      | "medium"
                      | "low",
                  })
                }
                style={{
                  marginLeft: "8px",
                  padding: "6px",
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>

          <button
            onClick={saveSettings}
            disabled={saving}
            style={{
              marginTop: "24px",
              padding: "10px 18px",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>

          {message && (
            <p style={{ marginTop: "16px" }}>
              {message}
            </p>
          )}
        </section>
      )}
    </main>
  );
}