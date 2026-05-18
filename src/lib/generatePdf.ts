import jsPDF from "jspdf";
import { cvHeader, cvSummary, cvJobs, cvSkills, cvEducation, cvAwards } from "./cvData";

const MARGIN = 18;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;

const DARK = [26, 26, 26] as const;
const MID = [80, 80, 80] as const;
const LIGHT = [150, 150, 150] as const;

export async function generatePdf() {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let y = MARGIN;

  const checkPage = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN) {
      pdf.addPage();
      y = MARGIN;
    }
  };

  const setColor = (rgb: readonly [number, number, number]) =>
    pdf.setTextColor(rgb[0], rgb[1], rgb[2]);

  const text = (
    str: string,
    x: number,
    size: number,
    rgb: readonly [number, number, number],
    style: "normal" | "bold" | "italic" = "normal",
    maxWidth?: number
  ) => {
    pdf.setFontSize(size);
    pdf.setFont("helvetica", style);
    setColor(rgb);
    if (maxWidth) {
      const lines = pdf.splitTextToSize(str, maxWidth);
      pdf.text(lines, x, y);
      return lines.length;
    }
    pdf.text(str, x, y);
    return 1;
  };

  const rule = (weight: number, rgb: readonly [number, number, number]) => {
    pdf.setDrawColor(rgb[0], rgb[1], rgb[2]);
    pdf.setLineWidth(weight);
    pdf.line(MARGIN, y, PAGE_W - MARGIN, y);
  };

  const sectionHeading = (label: string) => {
    checkPage(10);
    y += 4;
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    setColor(DARK);
    pdf.text(label.toUpperCase(), MARGIN, y);
    y += 2;
    rule(0.3, [200, 200, 200]);
    y += 4;
  };

  const jobHeader = (title: string, org: string, dates: string) => {
    checkPage(14);
    pdf.setFontSize(10.5);
    pdf.setFont("helvetica", "bold");
    setColor(DARK);
    pdf.text(title, MARGIN, y);
    const dateW = pdf.getTextWidth(dates);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    setColor(MID);
    pdf.text(dates, PAGE_W - MARGIN - dateW, y);
    y += 4;
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "italic");
    setColor(MID);
    pdf.text(org, MARGIN, y);
    y += 5;
  };

  const bullet = (str: string) => {
    const lines = pdf.splitTextToSize(str, CONTENT_W - 5);
    checkPage(lines.length * 4 + 1);
    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "normal");
    setColor(DARK);
    pdf.text("-", MARGIN + 1, y);
    pdf.text(lines, MARGIN + 5, y);
    y += lines.length * 4 + 0.5;
  };

  const skillRow = (label: string, value: string) => {
    const labelW = 52;
    const valueLines = pdf.splitTextToSize(value, CONTENT_W - labelW);
    checkPage(valueLines.length * 4 + 1);
    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "bold");
    setColor(DARK);
    pdf.text(label + ":", MARGIN, y);
    pdf.setFont("helvetica", "normal");
    setColor(MID);
    pdf.text(valueLines, MARGIN + labelW, y);
    y += Math.max(valueLines.length, 1) * 4 + 0.5;
  };

  const recItem = (year: string, value: string) => {
    const valueLines = pdf.splitTextToSize(value, CONTENT_W - 14);
    checkPage(valueLines.length * 4 + 1);
    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "normal");
    setColor(LIGHT);
    pdf.text(year, MARGIN, y);
    setColor(DARK);
    pdf.text(valueLines, MARGIN + 14, y);
    y += valueLines.length * 4 + 0.5;
  };

  // ── HEADER ──
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  setColor(DARK);
  pdf.text(cvHeader.name, MARGIN, y);
  y += 7;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  setColor(MID);
  pdf.text(cvHeader.title, MARGIN, y);
  y += 6;

  pdf.setFontSize(8.5);
  setColor(MID);
  const contactParts = [cvHeader.phone, cvHeader.email, cvHeader.linkedin, cvHeader.website];
  let cx = MARGIN;
  for (let i = 0; i < contactParts.length; i++) {
    const part = contactParts[i];
    pdf.text(part, cx, y);
    cx += pdf.getTextWidth(part);
    if (i < contactParts.length - 1) {
      pdf.text("   |   ", cx, y);
      cx += pdf.getTextWidth("   |   ");
    }
  }
  y += 5;

  rule(0.6, DARK);
  y += 6;

  // ── SUMMARY ──
  sectionHeading("Professional Summary");
  const summaryLines = pdf.splitTextToSize(cvSummary, CONTENT_W);
  pdf.setFontSize(9.5);
  pdf.setFont("helvetica", "normal");
  setColor(DARK);
  pdf.text(summaryLines, MARGIN, y);
  y += summaryLines.length * 4 + 4;

  // ── WORK EXPERIENCE ──
  sectionHeading("Work Experience");
  for (const job of cvJobs) {
    jobHeader(job.title, job.org, job.dates);
    for (const b of job.bullets) bullet(b);
    y += 2;
  }

  // ── SKILLS ──
  sectionHeading("Skills");
  for (const s of cvSkills) {
    skillRow(s.label, s.value);
  }
  y += 2;

  // ── EDUCATION ──
  sectionHeading("Education");
  for (const edu of cvEducation) {
    jobHeader(edu.degree, edu.school, edu.dates);
    for (const n of edu.notes) bullet(n);
    y += 2;
  }

  // ── RECOGNITION ──
  sectionHeading("Recognition & Awards");
  for (const a of cvAwards) {
    recItem(a.year, a.text);
  }

  pdf.save(`${cvHeader.name} - CV.pdf`);
}
