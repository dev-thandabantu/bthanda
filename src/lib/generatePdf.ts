import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function generatePdf() {
  const element = document.getElementById("cv-content");
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    windowWidth: 820,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = pdfWidth / imgWidth;
  const scaledHeight = imgHeight * ratio;

  // Multi-page support if CV is taller than one A4 page
  let yOffset = 0;
  while (yOffset < scaledHeight) {
    if (yOffset > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, -yOffset, pdfWidth, scaledHeight);
    yOffset += pdfHeight;
  }

  pdf.save("Brighton Tandabantu - CV.pdf");
}
