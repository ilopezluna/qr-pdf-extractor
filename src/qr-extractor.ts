import { convertPdfToImages } from './pdf-parser.js';
import { scanPagesForQr } from './qr-decoder.js';
import { QrCodeResult } from './types.js';
import * as fs from 'fs';

/**
 * Extract all QR codes from a PDF file
 * @param pdfPath - Path to the PDF file
 * @returns Array of QR code results with page information (empty if none found)
 * @throws Error if PDF cannot be processed
 */
export async function extractQrFromPdf(
  pdfPath: string,
): Promise<QrCodeResult[]> {
  try {
    // Read PDF file
    const pdfBuffer = await fs.promises.readFile(pdfPath);

    // Convert PDF pages to images
    const pageImages = await convertPdfToImages(pdfBuffer);

    // Scan pages for QR codes
    const qrResults = await scanPagesForQr(pageImages);

    return qrResults;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to extract QR from ${pdfPath}: ${error.message}`);
    }
    throw new Error(`Failed to extract QR from ${pdfPath}: Unknown error`);
  }
}
