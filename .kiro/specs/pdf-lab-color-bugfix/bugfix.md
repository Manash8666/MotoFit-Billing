# Bugfix Requirements Document

## Introduction

The MotoFit Billing application is experiencing a **critical PDF generation failure** that prevents users from creating downloadable PDF invoices/estimates or sharing them via WhatsApp. When users attempt to generate a PDF, the system throws an error: "Failed to generate PDF: Attempting to parse an unsupported color function 'lab'". This bug affects 100% of PDF generation attempts, blocking a core business function for the motorcycle workshop billing system.

The root cause is incompatibility between outdated PDF generation libraries (jsPDF v4.2.1 from 2018, html2canvas v1.4.1) and modern CSS Color Level 4 specification's `lab()` color function, which is either being used in the codebase or injected by Tailwind CSS or browser defaults.

This bugfix will upgrade the PDF generation libraries to current versions that support modern CSS color functions, ensuring reliable PDF generation while maintaining identical visual appearance and functionality.

---

## Bug Analysis

### Current Behavior (Defect)

**1.1** WHEN a user clicks the "Save PDF" button in preview mode THEN the system crashes with error "Failed to generate PDF: Attempting to parse an unsupported color function 'lab'" and no PDF is generated

**1.2** WHEN a user clicks the "WhatsApp" share button in preview mode THEN the system crashes with the same lab() color parsing error and the WhatsApp share dialog fails to open

**1.3** WHEN the `generatePDF()` function is invoked with html2canvas and jsPDF v4.2.1 THEN the library cannot parse modern CSS color functions and throws an unsupported color function exception

**1.4** WHEN the invoice HTML contains or computes lab() color functions (from Tailwind, browser defaults, or CSS) THEN the outdated html2canvas/jsPDF pipeline fails to process the DOM element

---

### Expected Behavior (Correct)

**2.1** WHEN a user clicks the "Save PDF" button in preview mode THEN the system SHALL successfully generate a PDF file with identical visual appearance to the on-screen invoice and download it with filename pattern `{docNumber}.pdf`

**2.2** WHEN a user clicks the "WhatsApp" share button in preview mode THEN the system SHALL successfully generate a PDF blob, create a File object, and open the native share dialog (or WhatsApp fallback URL) without errors

**2.3** WHEN the `generatePDF()` function is invoked THEN it SHALL use updated PDF generation libraries that support modern CSS Color Level 4 functions including lab(), lch(), oklab(), and oklch()

**2.4** WHEN the invoice HTML is processed by html2canvas THEN it SHALL correctly parse all modern CSS color functions without throwing parsing exceptions

**2.5** WHEN a PDF is generated THEN it SHALL maintain the current quality settings (scale: 2, JPEG compression 1.0, A4 portrait format) and visual fidelity

---

### Unchanged Behavior (Regression Prevention)

**3.1** WHEN a SOW_BILL document type is rendered and converted to PDF THEN the system SHALL CONTINUE TO display all invoice elements (header, metadata, line items table, totals, notice section, contacts, signatory, proof image) with correct styling

**3.2** WHEN an ESTIMATE document type is rendered and converted to PDF THEN the system SHALL CONTINUE TO display all estimate elements with correct styling and labeling differences from SOW_BILL

**3.3** WHEN the PDF generation includes a proof image (base64 JPEG) THEN the system SHALL CONTINUE TO embed the image in the PDF output at the bottom of the document

**3.4** WHEN the `generatePDF()` function executes in a TWA/WebView environment THEN the system SHALL CONTINUE TO apply the window.scrollTo polyfill workaround for compatibility

**3.5** WHEN a PDF contains invoice line items with complimentary pricing (rate = 0) THEN the system SHALL CONTINUE TO display "Complimentary / N/C" text and "0.00" amounts correctly

**3.6** WHEN the MDR surcharge is applicable (post-15 Oct 2026, UPI payment) THEN the system SHALL CONTINUE TO calculate and display the 0.4% surcharge in the PDF totals section

**3.7** WHEN the user is offline and saves a document THEN the system SHALL CONTINUE TO queue the document in localStorage and NOT attempt PDF generation until explicitly requested

**3.8** WHEN a user clicks "Edit Details" from preview mode THEN the system SHALL CONTINUE TO return to the form view with all data preserved

**3.9** WHEN Tailwind CSS utility classes are applied to invoice elements THEN the system SHALL CONTINUE TO render colors, borders, backgrounds, fonts, and spacing identically in the PDF output

**3.10** WHEN the invoice contains custom fonts (Brush Script MT, Caveat for signature) THEN the system SHALL CONTINUE TO render these fonts in the PDF or use appropriate fallbacks
