export interface WhatsAppDocumentPayload {
  customerName: string;
  customerPhone: string;
  docNumber: string;
  docType: "ESTIMATE" | "SOW_BILL" | "JOB_CARD";
  vehicleReg: string;
  vehicleModel: string;
  totalAmount: number;
  pdfPublicUrl?: string;
}

/**
 * Generates an automated MotoFit 2 WhatsApp notification payload.
 * Runs completely free via WhatsApp Click-to-Chat deep links.
 */
export function buildWhatsAppLink(payload: WhatsAppDocumentPayload): string {
  // Normalize phone number to international format (Defaulting to +91 India)
  let phone = payload.customerPhone.replace(/[^0-9]/g, "");
  if (phone.length === 10) {
    phone = `91${phone}`;
  }

  const docTitle =
    payload.docType === "SOW_BILL" ? "Final Scope of Work (SoW) Bill" : "Service Estimate";

  const message = [
    `*MOTOFIT 2 - WORKSHOP MANAGEMENT*`,
    `_Nigam Nagar HQ, Ahmedabad | Precision Servicing_`,
    ``,
    `Hello *${payload.customerName}*,`,
    `Your ${docTitle} for *${payload.vehicleModel}* (${payload.vehicleReg}) is ready.`,
    ``,
    `📄 *Document No:* ${payload.docNumber}`,
    `💰 *Total Payable:* ₹${payload.totalAmount.toFixed(2)}`,
    payload.pdfPublicUrl ? `📥 *View / Download PDF:* ${payload.pdfPublicUrl}` : ``,
    ``,
    `Service Manager: Manash (+91 63596 35416)`,
    `Floor Technician: Munna (+91 91232 93450)`,
    ``,
    `Thank you for choosing MotoFit 2!`,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Triggers native mobile share sheet for direct PDF file sharing.
 * Bypasses WhatsApp business API costs on Android and iOS devices.
 */
export async function sharePdfNative(file: File, payload: WhatsAppDocumentPayload): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `MotoFit 2 - ${payload.docNumber}`,
        text: `MotoFit 2 Invoice ${payload.docNumber} for ${payload.vehicleReg}`,
      });
      return true;
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Native share failed", err);
      }
    }
  }

  // Fallback to WhatsApp URL
  window.open(buildWhatsAppLink(payload), "_blank");
  return false;
}
