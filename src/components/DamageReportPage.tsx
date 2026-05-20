"use client";

import { useState } from "react";
import jsPDF from "jspdf";

const client = {
  name: "Mlungisi Nhlapo",
  address: "92 End Street",
  city: "Sandbaai",
  email: "Mlungisi.nhlapo@gmail.com",
  phone: "083 459 1246",
};

const incidentDate = "11 May 2026";
const reportDate = "19 May 2026";

const damageItems = [
  { item: "Boundary wall", detail: "Wall collapsed onto the sewerage pipe due to the force of the storm.", repaired: true },
  { item: "Sewerage pipe", detail: "Cracked and fractured where the boundary wall fell on it. Sewage leakage observed.", repaired: false },
  { item: "Nutec planks", detail: "Multiple nutec planks along the boundary wall broke and required full replacement.", repaired: true },
  { item: "Gate steel reinforcement", detail: "Enforcing steel at the gate became loose and detached from its fitting.", repaired: true },
];

const repairsCompleted = [
  "Boundary wall rebuilt and plastered.",
  "Broken nutec planks fully replaced.",
  "Gate steel reinforcement re-secured and fitted.",
];

const outstandingRepairs = [
  "Sewerage pipe — damaged but not yet repaired. Requires a licensed plumber. Claim submitted for assessment.",
];

const beforePhotos = [
  "/insurance-photos/before-1.jpg",
  "/insurance-photos/before-2.jpg",
  "/insurance-photos/before-3.jpg",
];

const afterPhotos = [
  "/insurance-photos/after-1.jpg",
  "/insurance-photos/after-2.jpg",
  "/insurance-photos/after-3.jpg",
  "/insurance-photos/after-4.jpg",
];

async function loadImageAsDataUrl(src: string): Promise<string> {
  const res = await fetch(src);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

async function getImageDimensions(dataUrl: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = dataUrl;
  });
}

async function generateReportPdf() {
  const MARGIN = 18;
  const PAGE_W = 210;
  const PAGE_H = 297;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  const DARK = [26, 26, 26] as const;
  const MID = [90, 90, 90] as const;
  const ACCENT = [30, 80, 160] as const;
  const RED = [180, 40, 40] as const;
  const GREEN = [30, 130, 70] as const;

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let y = MARGIN;

  const setColor = (rgb: readonly [number, number, number]) =>
    pdf.setTextColor(rgb[0], rgb[1], rgb[2]);

  const rule = (rgb: readonly [number, number, number] = [210, 210, 210]) => {
    pdf.setDrawColor(rgb[0], rgb[1], rgb[2]);
    pdf.setLineWidth(0.3);
    pdf.line(MARGIN, y, PAGE_W - MARGIN, y);
  };

  const checkPage = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN) {
      pdf.addPage();
      y = MARGIN;
    }
  };

  const sectionLabel = (label: string) => {
    checkPage(12);
    rule();
    y += 5;
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    setColor(DARK);
    pdf.text(label, MARGIN, y);
    y += 5;
  };

  // ── HEADER ──
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  setColor(ACCENT);
  pdf.text("WEATHER DAMAGE REPORT", MARGIN, y);
  y += 2;
  pdf.setDrawColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  pdf.setLineWidth(0.8);
  pdf.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 7;

  // Meta row
  const metaItems = [
    ["INCIDENT DATE", incidentDate],
    ["REPORT DATE", reportDate],
    ["REFERENCE", "WDR-2026-001"],
  ];
  pdf.setFontSize(8.5);
  const colW = CONTENT_W / metaItems.length;
  for (let i = 0; i < metaItems.length; i++) {
    const x = MARGIN + i * colW;
    pdf.setFont("helvetica", "bold");
    setColor(MID);
    pdf.text(metaItems[i][0], x, y);
    pdf.setFont("helvetica", "normal");
    setColor(DARK);
    pdf.text(metaItems[i][1], x, y + 4.5);
  }
  y += 13;

  // ── PROPERTY / CLAIMANT ──
  sectionLabel("PROPERTY & CLAIMANT DETAILS");
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  setColor(DARK);
  pdf.text(client.name, MARGIN, y);
  y += 5;
  pdf.setFontSize(8.5);
  pdf.setFont("helvetica", "normal");
  setColor(MID);
  for (const line of [`${client.address}, ${client.city}`, client.email, client.phone]) {
    pdf.text(line, MARGIN, y);
    y += 4.5;
  }
  y += 5;

  // ── INCIDENT DESCRIPTION ──
  sectionLabel("INCIDENT DESCRIPTION");
  const narrative =
    `On ${incidentDate}, the property at ${client.address}, ${client.city} sustained significant structural damage as a result of severe weather conditions (heavy rainfall and strong winds). The boundary wall collapsed under the force of the storm, falling directly onto the underground sewerage pipe. Additionally, multiple nutec planks along the boundary wall were broken, and the enforcing steel at the gate became loose and detached.`;
  pdf.setFontSize(9.5);
  pdf.setFont("helvetica", "normal");
  setColor(DARK);
  const narrativeLines = pdf.splitTextToSize(narrative, CONTENT_W);
  checkPage(narrativeLines.length * 4.5 + 6);
  pdf.text(narrativeLines, MARGIN, y);
  y += narrativeLines.length * 4.5 + 6;

  // ── ITEMISED DAMAGE ──
  sectionLabel("ITEMISED DAMAGE ASSESSMENT");

  for (const d of damageItems) {
    checkPage(16);
    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "bold");
    setColor(DARK);
    pdf.text(d.item, MARGIN, y);

    const statusLabel = d.repaired ? "REPAIRED" : "OUTSTANDING";
    const statusColor = d.repaired ? GREEN : RED;
    const labelW = pdf.getStringUnitWidth(statusLabel) * 8.5 / pdf.internal.scaleFactor;
    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "bold");
    setColor(statusColor);
    pdf.text(statusLabel, PAGE_W - MARGIN - labelW, y);

    y += 4.5;
    pdf.setFontSize(8.5);
    pdf.setFont("helvetica", "normal");
    setColor(MID);
    const detailLines = pdf.splitTextToSize(d.detail, CONTENT_W - 4);
    pdf.text(detailLines, MARGIN + 2, y);
    y += detailLines.length * 4 + 4;
  }
  y += 2;

  // ── REPAIRS COMPLETED ──
  sectionLabel("REPAIRS COMPLETED");
  pdf.setFontSize(9.5);
  pdf.setFont("helvetica", "normal");
  setColor(DARK);
  for (const r of repairsCompleted) {
    checkPage(8);
    pdf.text("-", MARGIN + 1, y);
    const rLines = pdf.splitTextToSize(r, CONTENT_W - 6);
    pdf.text(rLines, MARGIN + 5, y);
    y += rLines.length * 4.5 + 1;
  }
  y += 4;

  // ── OUTSTANDING ──
  sectionLabel("OUTSTANDING / UNREPAIRED DAMAGE");
  pdf.setFontSize(9.5);
  pdf.setFont("helvetica", "normal");
  setColor(RED);
  for (const o of outstandingRepairs) {
    checkPage(8);
    pdf.text("-", MARGIN + 1, y);
    const oLines = pdf.splitTextToSize(o, CONTENT_W - 6);
    pdf.text(oLines, MARGIN + 5, y);
    y += oLines.length * 4.5 + 1;
  }
  y += 6;

  // ── PHOTOS ──
  const addPhotoSection = async (label: string, photos: string[]) => {
    checkPage(20);
    sectionLabel(label);

    const imgW = (CONTENT_W - 6) / 2;

    for (let i = 0; i < photos.length; i++) {
      const dataUrl = await loadImageAsDataUrl(photos[i]);
      const dims = await getImageDimensions(dataUrl);
      const imgH = Math.min((dims.h / dims.w) * imgW, 80);

      const col = i % 2 === 0 ? MARGIN : MARGIN + imgW + 6;
      if (i % 2 === 0) checkPage(imgH + 8);

      pdf.addImage(dataUrl, "JPEG", col, y, imgW, imgH);

      if (i % 2 === 1 || i === photos.length - 1) {
        y += imgH + 6;
      }
    }
    y += 4;
  };

  await addPhotoSection("PHOTOGRAPHIC EVIDENCE — BEFORE (DAMAGE)", beforePhotos);
  await addPhotoSection("PHOTOGRAPHIC EVIDENCE — AFTER (REPAIRS COMPLETED)", afterPhotos);

  // ── DECLARATION ──
  checkPage(28);
  rule();
  y += 6;
  pdf.setFontSize(8.5);
  pdf.setFont("helvetica", "italic");
  setColor(MID);
  const declaration = "I, the undersigned, hereby declare that the information provided in this damage report is accurate and true to the best of my knowledge.";
  const declLines = pdf.splitTextToSize(declaration, CONTENT_W);
  pdf.text(declLines, MARGIN, y);
  y += declLines.length * 4.5 + 10;

  pdf.setFont("helvetica", "normal");
  setColor(DARK);
  pdf.text("Signature: ____________________________", MARGIN, y);
  pdf.text(`Name: ${client.name}`, MARGIN, y + 7);
  pdf.text(`Date: ${reportDate}`, MARGIN, y + 14);

  pdf.save("Weather-Damage-Report-Mlungisi-Nhlapo.pdf");
}

// ── PREVIEW COMPONENT ──

const statusBadge = (repaired: boolean) => ({
  display: "inline-block" as const,
  fontSize: 10,
  fontWeight: 700,
  padding: "2px 8px",
  borderRadius: 3,
  background: repaired ? "#e6f4ec" : "#fdecea",
  color: repaired ? "#1e8246" : "#b42828",
  marginLeft: 10,
});

export default function DamageReportPage() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await generateReportPdf();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "#1a1a1a", padding: "10px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ color: "#fff", fontFamily: "helvetica, sans-serif", fontSize: 14, fontWeight: 600 }}>
          Weather Damage Report — Mlungisi Nhlapo
        </span>
        <button onClick={handleDownload} disabled={loading} style={{
          background: loading ? "#555" : "#1e50a0", color: "#fff", border: "none",
          borderRadius: 6, padding: "8px 22px", fontSize: 13, fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
        }}>
          {loading ? "Generating..." : "Download PDF"}
        </button>
      </div>

      <div style={{ marginTop: 56, padding: "40px 24px", background: "#f4f4f4", minHeight: "100vh", fontFamily: "helvetica, arial, sans-serif" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", background: "#fff", padding: "48px 52px", boxShadow: "0 2px 16px rgba(0,0,0,0.10)" }}>

          {/* Header */}
          <div style={{ borderBottom: "3px solid #1e50a0", paddingBottom: 14, marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 22, color: "#1e50a0", fontWeight: 700, letterSpacing: 1 }}>WEATHER DAMAGE REPORT</h1>
          </div>

          {/* Meta */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 28 }}>
            {[["INCIDENT DATE", incidentDate], ["REPORT DATE", reportDate], ["REFERENCE", "WDR-2026-001"]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 1, marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Property & Claimant */}
          <Section title="PROPERTY & CLAIMANT DETAILS">
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a", marginBottom: 4 }}>{client.name}</div>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.8 }}>
              {client.address}, {client.city}<br />{client.email}<br />{client.phone}
            </div>
          </Section>

          {/* Incident description */}
          <Section title="INCIDENT DESCRIPTION">
            <p style={{ margin: 0, fontSize: 13, color: "#333", lineHeight: 1.7 }}>
              On {incidentDate}, the property at {client.address}, {client.city} sustained significant structural damage as a result of severe weather conditions (heavy rainfall and strong winds). The boundary wall collapsed under the force of the storm, falling directly onto the underground sewerage pipe. Additionally, multiple nutec planks along the boundary wall were broken, and the enforcing steel at the gate became loose and detached.
            </p>
          </Section>

          {/* Itemised damage */}
          <Section title="ITEMISED DAMAGE ASSESSMENT">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f0f4fc" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, color: "#1e50a0", fontWeight: 700 }}>Item</th>
                  <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, color: "#1e50a0", fontWeight: 700 }}>Description</th>
                  <th style={{ textAlign: "center", padding: "8px 10px", fontSize: 11, color: "#1e50a0", fontWeight: 700 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {damageItems.map((d, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px 10px", fontSize: 13, fontWeight: 600, color: "#1a1a1a", whiteSpace: "nowrap" }}>{d.item}</td>
                    <td style={{ padding: "10px 10px", fontSize: 12, color: "#555" }}>{d.detail}</td>
                    <td style={{ padding: "10px 10px", textAlign: "center" }}>
                      <span style={statusBadge(d.repaired)}>{d.repaired ? "Repaired" : "Outstanding"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* Repairs completed */}
          <Section title="REPAIRS COMPLETED">
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#333", lineHeight: 2 }}>
              {repairsCompleted.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </Section>

          {/* Outstanding */}
          <Section title="OUTSTANDING / UNREPAIRED DAMAGE">
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#b42828", lineHeight: 2 }}>
              {outstandingRepairs.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </Section>

          {/* Before photos */}
          <Section title="PHOTOGRAPHIC EVIDENCE — BEFORE (DAMAGE)">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {beforePhotos.map((src, i) => (
                <img key={i} src={src} alt={`Before ${i + 1}`} style={{ width: "100%", borderRadius: 4, objectFit: "cover" }} />
              ))}
            </div>
          </Section>

          {/* After photos */}
          <Section title="PHOTOGRAPHIC EVIDENCE — AFTER (REPAIRS COMPLETED)">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {afterPhotos.map((src, i) => (
                <img key={i} src={src} alt={`After ${i + 1}`} style={{ width: "100%", borderRadius: 4, objectFit: "cover" }} />
              ))}
            </div>
          </Section>

          {/* Declaration */}
          <div style={{ borderTop: "1px solid #e8e8e8", paddingTop: 24, marginTop: 8 }}>
            <p style={{ fontSize: 12, color: "#888", fontStyle: "italic", marginBottom: 28 }}>
              I, the undersigned, hereby declare that the information provided in this damage report is accurate and true to the best of my knowledge.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, fontSize: 13, color: "#1a1a1a" }}>
              <div>
                <div style={{ borderBottom: "1px solid #aaa", marginBottom: 6, height: 32 }} />
                <div>Signature</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div><strong>Name:</strong> {client.name}</div>
                <div style={{ marginTop: 4 }}><strong>Date:</strong> {reportDate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 1, borderTop: "1px solid #e8e8e8", paddingTop: 18, marginBottom: 12 }}>
        {title}
      </div>
      {children}
    </div>
  );
}
