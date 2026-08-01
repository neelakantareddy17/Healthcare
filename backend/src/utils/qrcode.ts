import QRCode from 'qrcode';

/**
 * Generates a base64 data-URL QR code image encoding the given payload string.
 * Used for appointment check-in codes.
 */
export const generateQrCodeDataUrl = async (payload: string): Promise<string> => {
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 300,
  });
};
