export interface LineItemInput {
  mrpRate: number;
  discountPercent?: number; // e.g., 10 for 10%
  quantity: number;
}

export interface BillingCalculationInput {
  invoiceDate: Date | string;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "UPI";
  items: Array<{
    rate: number;
    mrpDiscount?: number;
    quantity: number;
  }>;
}

export interface BillingBreakdown {
  subtotal: number;
  isMdrApplicable: boolean;
  mdrRate: number;
  mdrSurcharge: number;
  finalTotal: number;
  cashDiscountEquivalent: number;
}

/**
 * Computes net line amount after MRP discount
 */
export function calculateLineAmount(
  mrpRate: number,
  discountPercent: number = 0,
  quantity: number = 1
): { netRate: number; totalAmount: number; } {
  const discountMultiplier = Math.max(0, 1 - discountPercent / 100);
  const netRate = Math.round(mrpRate * discountMultiplier * 100) / 100;
  const totalAmount = Math.round(netRate * quantity * 100) / 100;
  return { netRate, totalAmount };
}

/**
 * Evaluates UPI MDR Surcharge Rules:
 * Rule 1: Prior to 15 October 2026 -> MDR is strictly ₹0.00 (0%).
 * Rule 2: On or after 15 October 2026 -> If UPI and Total > ₹2,000.00, apply standard 1.1% interchange MDR.
 */
export function calculateInvoiceTotals(input: BillingCalculationInput): BillingBreakdown {
  const invoiceDate = new Date(input.invoiceDate);
  const mdrEffectiveDate = new Date("2026-10-15T00:00:00.000+05:30");
  
  let subtotal = 0;
  for (const item of input.items) {
    const { totalAmount } = calculateLineAmount(item.rate, item.mrpDiscount || 0, item.quantity);
    subtotal += totalAmount;
  }
  subtotal = Math.round(subtotal * 100) / 100;

  let isMdrApplicable = false;
  let mdrRate = 0.0;
  let mdrSurcharge = 0.0;

  if (invoiceDate >= mdrEffectiveDate) {
    if (input.paymentMethod === "UPI" && subtotal > 2000.0) {
      isMdrApplicable = true;
      mdrRate = 0.004; // 0.4% UPI Merchant Interchange Fee
      mdrSurcharge = Math.round(subtotal * mdrRate * 100) / 100;
    }
  }

  const finalTotal = Math.round((subtotal + mdrSurcharge) * 100) / 100;

  return {
    subtotal,
    isMdrApplicable,
    mdrRate,
    mdrSurcharge,
    finalTotal,
    cashDiscountEquivalent: mdrSurcharge,
  };
}

/**
 * Capped Budget Optimizer:
 * Calculates and balances parts, lathe machining, and labor charges
 * to match customer-defined budget caps without altering parts base pricing.
 */
export function balanceBudgetCap(
  fixedPartsCost: number,
  targetBudgetCap: number,
  standardLaborRate: number
): { laborCharge: number; adjustedDiscount: number; viable: boolean } {
  const marginAvailable = targetBudgetCap - fixedPartsCost;
  
  if (marginAvailable < 0) {
    return { laborCharge: 0, adjustedDiscount: 0, viable: false };
  }
  
  const laborCharge = Math.min(marginAvailable, standardLaborRate);
  const adjustedDiscount = Math.max(0, standardLaborRate - laborCharge);
  
  return { laborCharge, adjustedDiscount, viable: true };
}
