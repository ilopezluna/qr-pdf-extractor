import { extractQrFromPdf } from './src';

async function main() {
  try {
    // Example: Extract all QR codes from a PDF file
    const qrResults = await extractQrFromPdf('./path/to/invoice.pdf');

    if (qrResults.length === 0) {
      console.log('No QR codes found in the PDF');
    } else {
      console.log(`Found ${qrResults.length} QR code(s):`);
      qrResults.forEach((result) => {
        console.log(`  Page ${result.page}: ${result.data}`);
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }
}

main();
