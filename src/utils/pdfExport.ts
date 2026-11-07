import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * Downloads a DOM element as a high-resolution PNG image.
 */
export async function downloadCertificateAsPNG(
  elementId: string,
  filename: string = 'DeployProof-Certificate.png'
): Promise<void> {
  const node = document.getElementById(elementId);
  if (!node) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  const dataUrl = await toPng(node, {
    quality: 0.98,
    pixelRatio: 2.5, // Crisp high-DPI export
    cacheBust: true,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * Exports a certificate DOM element directly to a printable landscape PDF.
 */
export async function downloadCertificateAsPDF(
  elementId: string,
  filename: string = 'DeployProof-Certificate.pdf'
): Promise<void> {
  const node = document.getElementById(elementId);
  if (!node) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  const dataUrl = await toPng(node, {
    quality: 0.98,
    pixelRatio: 2,
    cacheBust: true,
  });

  // Landscape A4 orientation: 297mm x 210mm
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);
}

