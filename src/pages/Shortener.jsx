import React, { useMemo, useState } from "react";
import LightPillar from "../components/LightPillar";
import { randFloat } from "three/src/math/MathUtils.js";
import "./Shortener.css";

export default function Shortener() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showApi, setShowApi] = useState(false);

  const origin = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.origin;
  }, []);

  const pillar = useMemo(
    () => ({
      intensity: 1.0,
      rotationSpeed: randFloat(0.3, 0.7),
      glowAmount: randFloat(0.005, 0.015),
      pillarWidth: randFloat(2.0, 5.0),
      pillarHeight: randFloat(0.2, 0.9),
      pillarRotation: randFloat(15, 175),
    }),
    [],
  );

  async function onSubmit(e) {
    e.preventDefault();
    const value = longUrl.trim();
    if (!value) return;

    setBusy(true);
    setError("");
    setShortUrl("");
    setCopied(false);

    try {
      const resp = await fetch("/put", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: value,
      });

      const data = await resp.json();
      if (!data || !data.ok) {
        setError(data?.msg || "error");
        return;
      }

      const code = data.msg;
      setShortUrl(`${origin}/${code}`);
    } catch (err) {
      setError(String(err));
    } finally {
      setBusy(false);
    }
  }

  async function onCopy() {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      setError(`copy failed: ${String(err)}`);
    }
  }

  return (
    <div className="shortenerRoot">
      <div className="shortenerBg" />
      <LightPillar
        topColor="#621F6D"
        bottomColor="#FE0000"
        intensity={pillar.intensity}
        rotationSpeed={pillar.rotationSpeed}
        glowAmount={pillar.glowAmount}
        pillarWidth={pillar.pillarWidth}
        pillarHeight={pillar.pillarHeight}
        pillarRotation={pillar.pillarRotation}
      />

      <div className="shortenerCard" role="main">
        <h1 className="shortenerTitle">cc — url shortener</h1>

        <form className="shortenerForm" onSubmit={onSubmit}>
          <input
            className="shortenerInput"
            placeholder="https://example.com/..."
            autoComplete="off"
            spellCheck={false}
            required
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
          />
          <button className="shortenerBtn" type="submit" disabled={busy}>
            {busy ? "…" : "Shorten"}
          </button>
        </form>

        {error ? <div className="shortenerOut">{error}</div> : null}

        {shortUrl ? (
          <div className="shortenerResultRow">
            <div className="shortenerOut">
              <a href={shortUrl}>{shortUrl}</a>
            </div>
            <button className="shortenerBtn secondary" type="button" onClick={onCopy}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        ) : null}

        <label className="shortenerMuted shortenerToggle">
          <input
            type="checkbox"
            checked={showApi}
            onChange={(e) => setShowApi(e.target.checked)}
          />
          Show API commands
        </label>

        {showApi ? (
          <div className="shortenerApi">
            <div className="shortenerMuted">POST /put (body is URL), GET /&lt;code&gt;</div>
            <pre>
              <code>{`curl -X POST ${origin}/put -H 'Content-Type: text/plain' -d 'https://example.com'\n\ncurl -i ${origin}/<code>`}</code>
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}
