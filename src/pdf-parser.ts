import { PDFParse } from 'pdf-parse';
import { PdfPageImage } from './types.js';

/**
 * Convert PDF to images using pdf-parse v2's built-in getScreenshot
 * @param pdfSource - Path to PDF or Buffer
 * @returns Array of page images as base64 strings
 */
export async function convertPdfToImages(
  pdfSource: string | Buffer,
): Promise<PdfPageImage[]> {
  const parser = new PDFParse(
    typeof pdfSource === 'string' ? { url: pdfSource } : { data: pdfSource },
  );

  try {
    // Use pdf-parse v2's built-in screenshot functionality
    const result = await parser.getScreenshot({
      scale: 3,
      imageDataUrl: true,
      imageBuffer: false,
    });

    const images: PdfPageImage[] = result.pages.map((page) => ({
      page: page.pageNumber,
      base64: page.dataUrl?.split(',')[1] || '', // Extract base64 from data URL
    }));

    if (images.length === 0) {
      throw new Error('PDF conversion produced no images');
    }

    return images;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to convert PDF to images: ${error.message}`);
    }
    throw error;
  } finally {
    await parser.destroy();
  }
}
