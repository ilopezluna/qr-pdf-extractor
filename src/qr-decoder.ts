import jsQR from 'jsqr';
import { PdfPageImage, QrCodeResult } from './types.js';

/**
 * Convert base64 image to RGBA pixel data for jsQR
 * @param base64Image - Base64 encoded PNG image
 * @returns Image data with width, height, and RGBA pixel array
 */
async function base64ToImageData(
  base64Image: string,
): Promise<{ data: Uint8ClampedArray; width: number; height: number }> {
  // Convert base64 to buffer
  const imageBuffer = Buffer.from(base64Image, 'base64');

  // Use canvas-like approach with PNG decoder
  const PNG = await import('pngjs').then((m) => m.PNG);
  const png = PNG.sync.read(imageBuffer);

  return {
    data: new Uint8ClampedArray(png.data),
    width: png.width,
    height: png.height,
  };
}

/**
 * Decode QR code from a base64 encoded image
 * @param base64Image - Base64 encoded PNG image
 * @returns Decoded QR code value
 * @throws Error if QR code not found or unreadable
 */
export async function decodeQrFromImage(base64Image: string): Promise<string> {
  try {
    const imageData = await base64ToImageData(base64Image);

    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (!code) {
      throw new Error('No QR code found in image');
    }

    if (!code.data || code.data.trim().length === 0) {
      throw new Error('QR code found but contains no data');
    }

    return code.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to decode QR code: ${error.message}`);
    }
    throw new Error('Failed to decode QR code: Unknown error');
  }
}

/**
 * Scan multiple PDF page images for QR codes
 * Collects all QR codes found across all pages
 * @param pageImages - Array of PDF page images
 * @returns Array of QR code results with page information (empty if none found)
 */
export async function scanPagesForQr(
  pageImages: PdfPageImage[],
): Promise<QrCodeResult[]> {
  const results: QrCodeResult[] = [];

  for (const pageImage of pageImages) {
    try {
      const qrValue = await decodeQrFromImage(pageImage.base64);
      results.push({
        data: qrValue,
        page: pageImage.page,
      });
    } catch (error) {
      // Continue to next page if QR not found on this page
    }
  }

  return results;
}
