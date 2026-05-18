"use client";

import { useState } from "react";
import { generateDocx } from "@/lib/generateDocx";
import { generatePdf } from "@/lib/generatePdf";
import {
  cvHeader,
  cvSummary,
  cvJobs,
  cvSkills,
  cvEducation,
  cvAwards,
} from "@/lib/cvData";

function DownloadBar() {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingDocx, setLoadingDocx] = useState(false);

  const downloadPdf = async () => {
    setLoadingPdf(true);
    try {
      await generatePdf();
    } finally {
      setLoadingPdf(false);
    }
  };

  const downloadDocx = async () => {
    setLoadingDocx(true);
    try {
      await generateDocx();
    } finally {
      setLoadingDocx(false);
    }
  };

  return (
    <div className="download-bar">
      <span className="download-label">{cvHeader.name} — CV</span>
      <div className="download-buttons">
        <button onClick={downloadPdf} disabled={loadingPdf} className="btn">
          {loadingPdf ? "Generating..." : "Download PDF"}
        </button>
        <button onClick={downloadDocx} disabled={loadingDocx} className="btn btn-secondary">
          {loadingDocx ? "Generating..." : "Download Word (.docx)"}
        </button>
      </div>
    </div>
  );
}

export default function CvPage() {
  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #f5f5f5;
          font-family: Calibri, Arial, Helvetica, sans-serif;
          color: #1a1a1a;
        }

        .download-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          height: 52px;
          gap: 16px;
        }
        .download-label {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          font-family: system-ui, sans-serif;
        }
        .download-buttons { display: flex; gap: 8px; }
        .btn {
          font-family: system-ui, sans-serif;
          font-size: 13px;
          padding: 6px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: opacity 0.15s;
          background: #fff;
          color: #1a1a1a;
        }
        .btn:hover { opacity: 0.85; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.25);
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.08); opacity: 1; }

        .cv-sheet {
          background: #fff;
          max-width: 820px;
          margin: 72px auto 48px;
          padding: 56px 64px;
          box-shadow: 0 2px 24px rgba(0,0,0,0.10);
          line-height: 1.5;
          font-size: 11pt;
        }

        /* Header */
        .cv-name { font-size: 22pt; font-weight: 700; letter-spacing: 0.3px; margin-bottom: 2px; }
        .cv-title { font-size: 12pt; color: #444; margin-bottom: 10px; }
        .cv-contact { font-size: 10pt; color: #555; display: flex; flex-wrap: wrap; gap: 4px 16px; }
        .cv-contact a { color: #555; text-decoration: none; }
        .cv-contact a:hover { text-decoration: underline; }

        hr.full { border: none; border-top: 1.5px solid #1a1a1a; margin: 14px 0; }
        hr.light { border: none; border-top: 0.5px solid #ccc; margin: 14px 0; }

        h2 {
          font-size: 9.5pt;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #1a1a1a;
          margin-bottom: 10px;
        }

        section { margin-bottom: 20px; }

        /* Summary */
        .summary p { font-size: 10.5pt; color: #333; line-height: 1.65; }

        /* Job */
        .job { margin-bottom: 16px; }
        .job-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px; }
        .job-title { font-weight: 700; font-size: 11pt; }
        .job-dates { font-size: 10pt; color: #555; white-space: nowrap; }
        .job-org { font-size: 10pt; color: #444; margin-bottom: 5px; }
        .job ul { padding-left: 18px; }
        .job ul li { font-size: 10.5pt; color: #222; margin-bottom: 3px; line-height: 1.5; }

        /* Skills */
        .skills-grid { display: flex; flex-direction: column; gap: 4px; }
        .skill-row { display: flex; gap: 8px; font-size: 10.5pt; }
        .skill-label { font-weight: 700; min-width: 180px; color: #1a1a1a; flex-shrink: 0; }
        .skill-value { color: #333; }

        /* Education */
        .edu-item { margin-bottom: 12px; }
        .edu-header { display: flex; justify-content: space-between; align-items: baseline; }
        .edu-degree { font-weight: 700; font-size: 11pt; }
        .edu-dates { font-size: 10pt; color: #555; }
        .edu-school { font-size: 10pt; color: #444; margin-bottom: 3px; }
        .edu-notes { padding-left: 18px; }
        .edu-notes li { font-size: 10pt; color: #444; margin-bottom: 2px; }

        /* Recognition */
        .rec-item { display: flex; gap: 16px; margin-bottom: 5px; font-size: 10.5pt; }
        .rec-year { color: #777; min-width: 36px; }
        .rec-text { color: #222; }

        @media (max-width: 600px) {
          .download-bar { padding: 0 16px; gap: 8px; }
          .download-label { display: none; }
          .cv-sheet { padding: 24px 18px; margin: 60px auto 32px; }
          .cv-name { font-size: 17pt; }
          .cv-title { font-size: 11pt; }
          .job-header { flex-direction: column; gap: 1px; }
          .job-dates { font-size: 9.5pt; }
          .edu-header { flex-direction: column; gap: 1px; }
          .skill-row { flex-direction: column; gap: 1px; }
          .skill-label { min-width: unset; }
        }

        @media print {
          .download-bar { display: none !important; }
          body { background: #fff; }
          .cv-sheet {
            margin: 0;
            padding: 32px 40px;
            box-shadow: none;
            max-width: 100%;
          }
          @page { margin: 0; size: A4; }
        }
      `}</style>

      <DownloadBar />

      <div className="cv-sheet" id="cv-content">
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div className="cv-name">{cvHeader.name}</div>
          <div className="cv-title">{cvHeader.title}</div>
          <div className="cv-contact">
            <span>{cvHeader.phone}</span>
            <a href={`mailto:${cvHeader.email}`}>{cvHeader.email}</a>
            <a href={cvHeader.linkedinUrl} target="_blank" rel="noopener noreferrer">{cvHeader.linkedin}</a>
            <a href={cvHeader.websiteUrl} target="_blank" rel="noopener noreferrer">{cvHeader.website}</a>
          </div>
        </div>

        <hr className="full" />

        {/* Summary */}
        <section className="summary">
          <h2>Professional Summary</h2>
          <p>{cvSummary}</p>
        </section>

        <hr className="light" />

        {/* Work Experience */}
        <section>
          <h2>Work Experience</h2>
          {cvJobs.map((job) => (
            <div key={job.title + job.org} className="job">
              <div className="job-header">
                <span className="job-title">{job.title}</span>
                <span className="job-dates">{job.dates}</span>
              </div>
              <div className="job-org">{job.org}</div>
              <ul>
                {job.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <hr className="light" />

        {/* Skills */}
        <section>
          <h2>Skills</h2>
          <div className="skills-grid">
            {cvSkills.map((s) => (
              <div key={s.label} className="skill-row">
                <span className="skill-label">{s.label}</span>
                <span className="skill-value">{s.value}</span>
              </div>
            ))}
          </div>
        </section>

        <hr className="light" />

        {/* Education */}
        <section>
          <h2>Education</h2>
          {cvEducation.map((edu) => (
            <div key={edu.degree} className="edu-item">
              <div className="edu-header">
                <span className="edu-degree">{edu.degree}</span>
                <span className="edu-dates">{edu.dates}</span>
              </div>
              <div className="edu-school">{edu.school}</div>
              <ul className="edu-notes">
                {edu.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <hr className="light" />

        {/* Recognition */}
        <section>
          <h2>Recognition &amp; Awards</h2>
          {cvAwards.map((a) => (
            <div key={a.year + a.text} className="rec-item">
              <span className="rec-year">{a.year}</span>
              <span className="rec-text">{a.text}</span>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
