import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  BorderStyle,
  TabStopType,
  TabStopPosition,
  UnderlineType,
} from "docx";
import { saveAs } from "file-saver";
import { cvHeader, cvSummary, cvJobs, cvSkills, cvEducation, cvAwards } from "./cvData";

const FONT = "Calibri";
const COLOR_DARK = "1a1a1a";
const COLOR_MID = "444444";
const COLOR_LIGHT = "777777";

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 19,
        font: FONT,
        color: COLOR_DARK,
        characterSpacing: 60,
      }),
    ],
    spacing: { before: 200, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "cccccc", space: 4 },
    },
  });
}

function jobHeader(title: string, dates: string): Paragraph {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    children: [
      new TextRun({ text: title, bold: true, size: 22, font: FONT, color: COLOR_DARK }),
      new TextRun({ text: "\t", font: FONT }),
      new TextRun({ text: dates, size: 20, font: FONT, color: COLOR_MID }),
    ],
    spacing: { before: 160, after: 20 },
  });
}

function jobOrg(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, font: FONT, color: COLOR_MID, italics: true })],
    spacing: { after: 40 },
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    children: [new TextRun({ text, size: 21, font: FONT, color: COLOR_DARK })],
    spacing: { after: 40 },
  });
}

function skillRow(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: label + ": ", bold: true, size: 21, font: FONT, color: COLOR_DARK }),
      new TextRun({ text: value, size: 21, font: FONT, color: COLOR_MID }),
    ],
    spacing: { after: 40 },
  });
}

function recItem(year: string, text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: year + "  ", size: 21, font: FONT, color: COLOR_LIGHT }),
      new TextRun({ text, size: 21, font: FONT, color: COLOR_DARK }),
    ],
    spacing: { after: 40 },
  });
}

function divider(): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: "" })],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "dddddd", space: 2 },
    },
    spacing: { before: 120, after: 120 },
  });
}

export async function generateDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 864, right: 864 },
          },
        },
        children: [
          // ── Header ──
          new Paragraph({
            children: [
              new TextRun({
                text: cvHeader.name,
                bold: true,
                size: 44,
                font: FONT,
                color: COLOR_DARK,
              }),
            ],
            spacing: { after: 40 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: cvHeader.title, size: 24, font: FONT, color: COLOR_MID }),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: cvHeader.phone, size: 20, font: FONT, color: COLOR_MID }),
              new TextRun({ text: "  ·  ", size: 20, font: FONT, color: COLOR_LIGHT }),
              new TextRun({
                text: cvHeader.email,
                size: 20,
                font: FONT,
                color: "1a5276",
                underline: { type: UnderlineType.SINGLE },
              }),
              new TextRun({ text: "  ·  ", size: 20, font: FONT, color: COLOR_LIGHT }),
              new TextRun({
                text: cvHeader.linkedin,
                size: 20,
                font: FONT,
                color: "1a5276",
                underline: { type: UnderlineType.SINGLE },
              }),
              new TextRun({ text: "  ·  ", size: 20, font: FONT, color: COLOR_LIGHT }),
              new TextRun({
                text: cvHeader.website,
                size: 20,
                font: FONT,
                color: "1a5276",
                underline: { type: UnderlineType.SINGLE },
              }),
            ],
            spacing: { after: 160 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 8, color: COLOR_DARK, space: 6 },
            },
          }),

          // ── Summary ──
          sectionHeading("Professional Summary"),
          new Paragraph({
            children: [
              new TextRun({ text: cvSummary, size: 21, font: FONT, color: COLOR_DARK }),
            ],
            spacing: { after: 120 },
          }),

          divider(),

          // ── Work Experience ──
          sectionHeading("Work Experience"),
          ...cvJobs.flatMap((job) => [
            jobHeader(job.title, job.dates),
            jobOrg(job.org),
            ...job.bullets.map(bullet),
          ]),

          divider(),

          // ── Skills ──
          sectionHeading("Skills"),
          ...cvSkills.map((s) => skillRow(s.label, s.value)),

          divider(),

          // ── Education ──
          sectionHeading("Education"),
          ...cvEducation.flatMap((edu) => [
            jobHeader(edu.degree, edu.dates),
            jobOrg(edu.school),
            ...edu.notes.map(bullet),
          ]),

          divider(),

          // ── Recognition ──
          sectionHeading("Recognition & Awards"),
          ...cvAwards.map((a) => recItem(a.year, a.text)),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${cvHeader.name} - CV.docx`);
}
