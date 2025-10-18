/**
 * Image representation of a PDF page
 */
export interface PdfPageImage {
  /** Page number (1-indexed) */
  page: number;
  /** Base64-encoded PNG image */
  base64: string;
}

/**
 * QR code extraction result with page information
 */
export interface QrCodeResult {
  /** QR code data/value */
  data: string;
  /** Page number where QR was found (1-indexed) */
  page: number;
}
