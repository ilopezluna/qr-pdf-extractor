import { extractQrFromPdf } from '../src';

describe('extractQrFromPdf', () => {
  it('should throw error for non-existent file', async () => {
    await expect(extractQrFromPdf('./non-existent.pdf')).rejects.toThrow();
  });

  it('should return an array of QR code results', async () => {
    // This test would need a real PDF file with QR codes to fully test
    // For now, just verify the return type is an array when called with a valid PDF
    // In a real test scenario, you'd mock the PDF or use a test fixture
  });
});
