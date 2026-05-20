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

const incidentReport =
  "Due to bad weather conditions, the boundary wall fell on the sewerage pipe. Some nutec planks also broke. At the gate, an enforcing steel became loose and came off.";

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

  // ── HEADER ──
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  setColor(ACCENT);
  pdf.text("DAMAGE REPORT", MARGIN, y);
  y += 2;
  pdf.setDrawColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  pdf.setLineWidth(0.8);
  pdf.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 7;

  // Meta
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  setColor(MID);
  pdf.text("DATE:", MARGIN, y);
  pdf.setFont("helvetica", "normal");
  setColor(DARK);
  pdf.text("19 May 2026", MARGIN + 14, y);
  y += 10;

  // Claimant
  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "bold");
  setColor(MID);
  pdf.text("SUBMITTED BY", MARGIN, y);
  y += 4;
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  setColor(DARK);
  pdf.text(client.name, MARGIN, y);
  y += 5;
  pdf.setFontSize(8.5);
  pdf.setFont("helvetica", "normal");
  setColor(MID);
  for (const line of [client.address, client.city, client.email, client.phone]) {
    pdf.text(line, MARGIN, y);
    y += 4.5;
  }
  y += 6;

  // ── INCIDENT DESCRIPTION ──
  rule();
  y += 5;
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  setColor(DARK);
  pdf.text("INCIDENT DESCRIPTION", MARGIN, y);
  y += 5;
  pdf.setFontSize(9.5);
  pdf.setFont("helvetica", "normal");
  setColor(DARK);
  const descLines = pdf.splitTextToSize(incidentReport, CONTENT_W);
  pdf.text(descLines, MARGIN, y);
  y += descLines.length * 4.5 + 10;

  // ── PHOTOS ──
  const addPhotoSection = async (label: string, photos: string[]) => {
    checkPage(14);
    rule();
    y += 5;
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    setColor(DARK);
    pdf.text(label, MARGIN, y);
    y += 6;

    const imgW = (CONTENT_W - 6) / 2;

    for (let i = 0; i < photos.length; i++) {
      const dataUrl = await loadImageAsDataUrl(photos[i]);
      const dims = await getImageDimensions(dataUrl);
      const imgH = (dims.h / dims.w) * imgW;

      const col = i % 2 === 0 ? MARGIN : MARGIN + imgW + 6;
      if (i % 2 === 0) checkPage(imgH + 6);

      pdf.addImage(dataUrl, "JPEG", col, y, imgW, imgH);

      if (i % 2 === 1 || i === photos.length - 1) {
        const rowH = (dims.h / dims.w) * imgW;
        y += rowH + 6;
      }
    }
    y += 4;
  };

  await addPhotoSection("BEFORE — DAMAGE", beforePhotos);
  await addPhotoSection("AFTER — REPAIRS COMPLETED", afterPhotos);

  pdf.save("Damage-Report-Mlungisi-Nhlapo.pdf");
}

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
      {/* Top bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "#1a1a1a", padding: "10px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ color: "#fff", fontFamily: "helvetica, sans-serif", fontSize: 14, fontWeight: 600 }}>
          Damage Report — Mlungisi Nhlapo
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

      {/* Report preview */}
      <div style={{
        marginTop: 56, padding: "40px 24px", background: "#f4f4f4", minHeight: "100vh",
        fontFamily: "helvetica, arial, sans-serif",
      }}>
        <div style={{
          maxWidth: 760, margin: "0 auto", background: "#fff",
          padding: "48px 52px", boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
        }}>

          {/* Header */}
          <div style={{ borderBottom: "3px solid #1e50a0", paddingBottom: 14, marginBottom: 20 }}>
            <h1 style={{ margin: 0, fontSize: 22, color: "#1e50a0", fontWeight: 700, letterSpacing: 1 }}>
              DAMAGE REPORT
            </h1>
          </div>

          {/* Meta */}
          <div style={{ fontSize: 13, marginBottom: 20 }}>
            <span style={{ color: "#888", fontWeight: 600 }}>DATE: </span>
            <span style={{ color: "#1a1a1a", fontWeight: 700 }}>19 May 2026</span>
          </div>

          {/* Submitted by */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 1, marginBottom: 6 }}>SUBMITTED BY</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a", marginBottom: 4 }}>{client.name}</div>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>
              {client.address}<br />{client.city}<br />{client.email}<br />{client.phone}
            </div>
          </div>

          {/* Incident description */}
          <div style={{
            background: "#f0f4fc", borderLeft: "4px solid #1e50a0",
            padding: "14px 18px", marginBottom: 32, borderRadius: "0 6px 6px 0",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#1e50a0", letterSpacing: 1, marginBottom: 6 }}>
              INCIDENT DESCRIPTION
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#444", lineHeight: 1.65 }}>{incidentReport}</p>
          </div>

          {/* Before photos */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 1, marginBottom: 14, borderTop: "1px solid #e8e8e8", paddingTop: 18 }}>
              BEFORE — DAMAGE
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {beforePhotos.map((src, i) => (
                <img key={i} src={src} alt={`Before ${i + 1}`} style={{ width: "100%", borderRadius: 4, objectFit: "cover" }} />
              ))}
            </div>
          </div>

          {/* After photos */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 1, marginBottom: 14, borderTop: "1px solid #e8e8e8", paddingTop: 18 }}>
              AFTER — REPAIRS COMPLETED
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {afterPhotos.map((src, i) => (
                <img key={i} src={src} alt={`After ${i + 1}`} style={{ width: "100%", borderRadius: 4, objectFit: "cover" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
