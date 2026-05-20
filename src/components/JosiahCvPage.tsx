"use client";

import { useState } from "react";
import { generateJosiahPdf } from "@/lib/generateJosiahPdf";
import { cvHeader, cvSummary, cvJobs, cvSkills, cvEducation } from "@/lib/josiahCvData";

export default function JosiahCvPage() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await generateJosiahPdf();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Download bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "#1a1a1a", padding: "10px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ color: "#fff", fontFamily: "helvetica, sans-serif", fontSize: 14, fontWeight: 600 }}>
          {cvHeader.name} — CV
        </span>
        <button
          onClick={handleDownload}
          disabled={loading}
          style={{
            background: loading ? "#555" : "#1e50a0",
            color: "#fff", border: "none", borderRadius: 6,
            padding: "8px 22px", fontSize: 13, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Generating..." : "Download PDF"}
        </button>
      </div>

      {/* CV preview */}
      <div style={{
        marginTop: 56, padding: "40px 24px", background: "#f4f4f4",
        minHeight: "100vh", fontFamily: "helvetica, arial, sans-serif",
      }}>
        <div style={{
          maxWidth: 760, margin: "0 auto", background: "#fff",
          padding: "48px 52px", boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
        }}>

          {/* Header */}
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#1a1a1a" }}>{cvHeader.name}</h1>
          <div style={{ fontSize: 14, color: "#555", marginTop: 4, marginBottom: 6 }}>{cvHeader.title}</div>
          <div style={{ fontSize: 12, color: "#888" }}>
            {[cvHeader.phone, cvHeader.email].filter(Boolean).join("   |   ")}
          </div>
          <hr style={{ border: "none", borderTop: "2px solid #1a1a1a", margin: "14px 0 18px" }} />

          {/* Summary */}
          <Section title="Professional Summary">
            <p style={{ margin: 0, fontSize: 13, color: "#333", lineHeight: 1.7 }}>{cvSummary}</p>
          </Section>

          {/* Experience */}
          <Section title="Work Experience">
            {cvJobs.map((job, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>{job.title}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{job.dates}</span>
                </div>
                <div style={{ fontSize: 12, color: "#666", fontStyle: "italic", marginBottom: 6 }}>{job.org}</div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: "#333", lineHeight: 1.8 }}>
                  {job.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            ))}
          </Section>

          {/* Skills */}
          <Section title="Skills">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              {cvSkills.map((s, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700, color: "#1a1a1a", paddingRight: 20, paddingBottom: 6, whiteSpace: "nowrap", verticalAlign: "top" }}>{s.label}:</td>
                  <td style={{ color: "#555", paddingBottom: 6 }}>{s.value}</td>
                </tr>
              ))}
            </table>
          </Section>

          {/* Education */}
          <Section title="Education">
            {cvEducation.map((edu, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>{edu.degree}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{edu.dates}</span>
                </div>
                <div style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}>{edu.school}</div>
              </div>
            ))}
          </Section>

          {/* Personal details */}
          <Section title="Personal Details">
            <table style={{ fontSize: 13, borderCollapse: "collapse" }}>
              {[
                ["Nationality", "Zimbabwean"],
                ["Date of Birth", "22 December 1995"],
                ["Passport", "AE981902 (valid to 29 Jan 2034)"],
                ["Based in", "Chipinge, Zimbabwe"],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td style={{ fontWeight: 700, color: "#1a1a1a", paddingRight: 20, paddingBottom: 5 }}>{label}:</td>
                  <td style={{ color: "#555", paddingBottom: 5 }}>{value}</td>
                </tr>
              ))}
            </table>
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: "#1a1a1a",
        textTransform: "uppercase", marginBottom: 4,
      }}>{title}</div>
      <hr style={{ border: "none", borderTop: "1px solid #ddd", marginBottom: 12 }} />
      {children}
    </div>
  );
}
