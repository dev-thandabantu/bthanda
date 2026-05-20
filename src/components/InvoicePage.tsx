"use client";

import { useState } from "react";
import { generateInvoicePdf } from "@/lib/generateInvoicePdf";
import { contractor, client, lineItems, invoiceNumber, invoiceDate } from "@/lib/invoiceData";

const subtotal = lineItems.reduce((s, i) => s + i.amount, 0);

export default function InvoicePage() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await generateInvoicePdf();
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
          Tax Invoice — {invoiceNumber}
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

      {/* Invoice preview */}
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
              TAX INVOICE
            </h1>
            <div style={{ marginTop: 6, fontSize: 13, color: "#666" }}>Dennies &amp; Rewards Construction</div>
          </div>

          {/* Meta */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28, fontSize: 13 }}>
            <div>
              <span style={{ color: "#888", fontWeight: 600 }}>INVOICE NUMBER: </span>
              <span style={{ color: "#1a1a1a", fontWeight: 700 }}>{invoiceNumber}</span>
            </div>
            <div>
              <span style={{ color: "#888", fontWeight: 600 }}>DATE: </span>
              <span style={{ color: "#1a1a1a", fontWeight: 700 }}>{invoiceDate}</span>
            </div>
          </div>

          {/* From / To */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 1, marginBottom: 6 }}>FROM (CONTRACTOR)</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a", marginBottom: 4 }}>{contractor.name}</div>
              <div style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>
                {contractor.address}<br />
                {contractor.phone}<br />
                {contractor.email}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 1, marginBottom: 6 }}>TO (CLIENT)</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a", marginBottom: 4 }}>{client.name}</div>
              <div style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>
                {client.address}<br />
                {client.city}<br />
                {client.email}<br />
                {client.phone}
              </div>
            </div>
          </div>

          {/* Line items table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
            <thead>
              <tr style={{ background: "#f0f4fc" }}>
                <th style={{
                  textAlign: "left", padding: "9px 12px", fontSize: 11,
                  fontWeight: 700, color: "#1e50a0", letterSpacing: 0.5,
                }}>DESCRIPTION</th>
                <th style={{
                  textAlign: "right", padding: "9px 12px", fontSize: 11,
                  fontWeight: 700, color: "#1e50a0", letterSpacing: 0.5,
                }}>AMOUNT (ZAR)</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "11px 12px", fontSize: 13, color: "#1a1a1a" }}>{item.description}</td>
                  <td style={{ padding: "11px 12px", fontSize: 13, color: "#1a1a1a", textAlign: "right", fontWeight: 600 }}>
                    R {item.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 36 }}>
            <div style={{
              background: "#1e50a0", color: "#fff",
              padding: "12px 28px", borderRadius: 6, minWidth: 220,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>TOTAL DUE:</span>
              <span style={{ fontWeight: 800, fontSize: 16 }}>R {subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Banking details */}
          <div style={{ borderTop: "1px solid #e8e8e8", paddingTop: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 1, marginBottom: 12 }}>
              PAYMENT / BANKING DETAILS
            </div>
            <table style={{ fontSize: 13, borderCollapse: "collapse" }}>
              {[
                ["Bank:", contractor.bankName],
                ["Account Type:", contractor.accountType],
                ["Account Holder:", contractor.accountHolder],
                ["Account Number:", contractor.accountNumber],
                ["Branch Code:", contractor.branchCode],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td style={{ color: "#888", fontWeight: 600, paddingRight: 24, paddingBottom: 5 }}>{label}</td>
                  <td style={{ color: "#1a1a1a", paddingBottom: 5 }}>{value}</td>
                </tr>
              ))}
            </table>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 36, borderTop: "1px solid #e8e8e8", paddingTop: 14 }}>
            <p style={{ margin: 0, fontSize: 11, color: "#aaa", fontStyle: "italic" }}>
              Please ensure payment is made directly to Dennies &amp; Rewards Construction using the banking details above.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
