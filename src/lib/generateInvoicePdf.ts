import jsPDF from "jspdf";
import { contractor, client, incidentReport, lineItems, invoiceNumber, invoiceDate } from "./invoiceData";

const MARGIN = 18;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;

const DARK = [26, 26, 26] as const;
const MID = [90, 90, 90] as const;
const ACCENT = [30, 80, 160] as const;

export async function generateInvoicePdf() {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let y = MARGIN;

  const setColor = (rgb: readonly [number, number, number]) =>
    pdf.setTextColor(rgb[0], rgb[1], rgb[2]);

  const rule = (weight: number, rgb: readonly [number, number, number]) => {
    pdf.setDrawColor(rgb[0], rgb[1], rgb[2]);
    pdf.setLineWidth(weight);
    pdf.line(MARGIN, y, PAGE_W - MARGIN, y);
  };

  // ── HEADER ──
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  setColor(ACCENT);
  pdf.text("INSURANCE CLAIM INVOICE", MARGIN, y);
  y += 2;
  rule(0.8, ACCENT);
  y += 7;

  // Invoice meta
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  setColor(MID);
  pdf.text("INVOICE NUMBER:", MARGIN, y);
  pdf.setFont("helvetica", "normal");
  setColor(DARK);
  pdf.text(invoiceNumber, MARGIN + 38, y);

  pdf.setFont("helvetica", "bold");
  setColor(MID);
  pdf.text("DATE:", PAGE_W - MARGIN - 60, y);
  pdf.setFont("helvetica", "normal");
  setColor(DARK);
  pdf.text(invoiceDate, PAGE_W - MARGIN - 46, y);
  y += 12;

  // ── FROM / TO ──
  const col2 = PAGE_W / 2 + 4;

  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "bold");
  setColor(MID);
  pdf.text("FROM (CONTRACTOR)", MARGIN, y);
  pdf.text("TO (CLAIMANT)", col2, y);
  y += 4;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  setColor(DARK);
  pdf.text(contractor.name, MARGIN, y);
  pdf.text(client.name, col2, y);
  y += 5;

  pdf.setFontSize(8.5);
  pdf.setFont("helvetica", "normal");
  setColor(MID);

  const contractorLines = [contractor.phone];
  const clientLines = [client.address, client.city, client.email, client.phone];

  const maxLines = Math.max(contractorLines.length, clientLines.length);
  for (let i = 0; i < maxLines; i++) {
    if (contractorLines[i]) pdf.text(contractorLines[i], MARGIN, y);
    if (clientLines[i]) pdf.text(clientLines[i], col2, y);
    y += 4.5;
  }
  y += 6;

  // ── INCIDENT REPORT ──
  rule(0.3, [210, 210, 210]);
  y += 5;

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  setColor(DARK);
  pdf.text("INCIDENT REPORT", MARGIN, y);
  y += 4;

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "italic");
  setColor(MID);
  const reportLines = pdf.splitTextToSize(`"${incidentReport}"`, CONTENT_W);
  pdf.text(reportLines, MARGIN, y);
  y += reportLines.length * 4.5 + 7;

  // ── LINE ITEMS TABLE ──
  rule(0.3, [210, 210, 210]);
  y += 5;

  // Table header
  pdf.setFillColor(240, 244, 252);
  pdf.rect(MARGIN, y - 4, CONTENT_W, 8, "F");
  pdf.setFontSize(8.5);
  pdf.setFont("helvetica", "bold");
  setColor(ACCENT);
  pdf.text("DESCRIPTION", MARGIN + 2, y);
  pdf.text("AMOUNT (ZAR)", PAGE_W - MARGIN - 2, y, { align: "right" });
  y += 6;

  rule(0.3, [200, 210, 230]);
  y += 4;

  // Items
  let subtotal = 0;
  for (const item of lineItems) {
    const descLines = pdf.splitTextToSize(item.description, CONTENT_W - 35);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    setColor(DARK);
    pdf.text(descLines, MARGIN + 2, y);
    pdf.text(`R ${item.amount.toFixed(2)}`, PAGE_W - MARGIN - 2, y, { align: "right" });
    y += descLines.length * 4.5 + 1.5;

    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.2);
    pdf.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 3.5;

    subtotal += item.amount;
  }

  y += 3;

  // Total box
  const boxX = PAGE_W - MARGIN - 70;
  pdf.setFillColor(30, 80, 160);
  pdf.rect(boxX, y - 5, 70, 11, "F");
  pdf.setFontSize(10.5);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text("TOTAL DUE:", boxX + 3, y + 1.5);
  pdf.text(`R ${subtotal.toFixed(2)}`, PAGE_W - MARGIN - 2, y + 1.5, { align: "right" });
  y += 16;

  // ── BANKING DETAILS ──
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  setColor(DARK);
  pdf.text("PAYMENT / BANKING DETAILS", MARGIN, y);
  y += 5;

  const bankRows = [
    ["Bank:", contractor.bankName],
    ["Account Holder:", contractor.accountHolder],
    ["Account Number:", contractor.accountNumber],
    ["Branch Code:", contractor.branchCode],
  ];

  for (const [label, value] of bankRows) {
    pdf.setFontSize(8.5);
    pdf.setFont("helvetica", "bold");
    setColor(MID);
    pdf.text(label, MARGIN, y);
    pdf.setFont("helvetica", "normal");
    setColor(DARK);
    pdf.text(value, MARGIN + 38, y);
    y += 5;
  }

  y += 8;
  rule(0.3, [210, 210, 210]);
  y += 5;

  // Footer note
  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "italic");
  setColor([160, 160, 160]);
  pdf.text(
    "This invoice is submitted in support of an insurance claim for storm/weather damage repairs.",
    MARGIN,
    y
  );

  pdf.save(`Insurance-Claim-Invoice-${invoiceNumber}.pdf`);
}
