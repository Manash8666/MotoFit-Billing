# Kiro MustRead - MotoFit Billing Code Updates

## Document Purpose
This file tracks all significant code changes, library upgrades, and architectural decisions made during development sessions. It serves as a technical reference for understanding system evolution and troubleshooting.

---

## 2026-10-09: PDF Generation Lab() Color Bug - Library Upgrade

### Issue Summary
- **Bug**: PDF generation fails with error "Attempting to parse an unsupported color function 'lab'"
- **Impact**: 100% of PDF generation attempts fail (both Download PDF and WhatsApp Share)
- **Root Cause**: Outdated jsPDF v4.2.1 (from 2018) and html2canvas v1.4.1 do not support CSS Color Level 4 functions

### Affected Components
- `components/DocumentCreator.tsx` - generatePDF() function (lines 219-253)
- `components/MotoFitPrintableInvoice.tsx` - Invoice rendering with Tailwind CSS
- `package.json` - Dependencies

### Technical Analysis

#### Bug Condition Function
```pascal
FUNCTION isBugCondition(X)
  INPUT: X of type PDFGenerationRequest
  OUTPUT: boolean
  
  // Returns true when any PDF generation is attempted with current library versions
  RETURN (X.libraries.jspdf.version == "4.2.1") AND 
         (X.invoice.containsModernColorFunctions() OR 
          X.invoice.usesTailwindCSS())
END FUNCTION
```

#### Current (Buggy) Libraries
```json
{
  "jspdf": "^4.2.1",           // Released 2018, no modern CSS color support
  "html2canvas": "^1.4.1"      // May not fully support lab(), lch(), oklab(), oklch()
}
```

### Proposed Solution

#### Option 1: Upgrade jsPDF to Latest (RECOMMENDED)
```json
{
  "jspdf": "^2.5.2",           // Latest stable with modern CSS support
  "html2canvas": "^1.4.1"      // Keep current, may upgrade if still problematic
}
```

**Pros:**
- Official maintained library
- Full CSS Color Level 4 support
- Active community and bug fixes
- Well-documented migration path

**Cons:**
- Breaking changes from v1.x → v2.x API
- Requires code refactoring in generatePDF()

#### Option 2: Alternative Open Source Libraries
Research needed for:
- `pdfmake` - Client-side PDF generation
- `react-pdf` - React-based PDF rendering
- `puppeteer` (server-side) - Not suitable for client-side TWA/WebView

### Migration Requirements

#### API Changes (v1 → v2)
```typescript
// OLD (v4.2.1)
const { jsPDF } = await import('jspdf');
const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

// NEW (v2.x) - Same API, but check for any deprecations
const { jsPDF } = await import('jspdf');
const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
```

#### Testing Checklist
- [ ] PDF downloads with identical visual appearance
- [ ] WhatsApp share functionality works
- [ ] SOW_BILL document type renders correctly
- [ ] ESTIMATE document type renders correctly
- [ ] Proof images embed correctly
- [ ] MDR surcharge calculations display
- [ ] Complimentary items show "N/C" correctly
- [ ] Custom fonts render or fallback gracefully
- [ ] Works in TWA/WebView environment
- [ ] Works in standard mobile browsers
- [ ] File size remains reasonable (<2MB typical)

### Implementation Notes

#### Files to Modify
1. **package.json** - Update jsPDF version
2. **DocumentCreator.tsx** - Update import and API calls if needed
3. **Test with actual invoice data** - Ensure no visual regressions

#### Regression Prevention
- Maintain scale: 2 for quality
- Keep JPEG compression at 1.0
- Preserve A4 portrait format (210mm x 297mm)
- Maintain all TWA/WebView polyfills (window.scrollTo)
- Keep onclone workaround for iframe scrollTo issue

---

## Future Updates
[Additional changes will be documented here chronologically]
