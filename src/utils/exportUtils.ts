/**
 * Export and Download Utility Helpers for MedEx
 */

export const downloadBlobFile = (filename: string, content: string, mimeType = 'text/csv;charset=utf-8;') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadSimulatedPdf = (filename: string, documentTitle: string, details: Record<string, any>) => {
  const lines = [
    `========================================================================`,
    `                     MEDEX HEALTHCARE NETWORK                          `,
    `             STATUTORY VERIFIED PHARMACEUTICAL DOCUMENT                `,
    `========================================================================`,
    `Document: ${documentTitle}`,
    `Generated At: ${new Date().toISOString()}`,
    `Verification: CDSCO / State Drug Controller / CPCB Regulated Gate`,
    `Digital Signature: SHA256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
    `------------------------------------------------------------------------`,
    ``,
    ...Object.entries(details).map(([k, v]) => `${k.padEnd(28)}: ${v}`),
    ``,
    `------------------------------------------------------------------------`,
    `This document has been cryptographically recorded on the MedEx network.`,
    `Any alteration renders this document null and void under Section 18 of`,
    `the Drugs and Cosmetics Act 1940.`,
    `========================================================================`
  ].join('\n');

  downloadBlobFile(filename, lines, 'text/plain;charset=utf-8;');
};
