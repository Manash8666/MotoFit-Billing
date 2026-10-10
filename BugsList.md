# MotoFit Billing - Comprehensive Bug List
**Generated:** 2026-10-09  
**Status:** Active Bug Finding Session Complete

---

## Critical Bugs (P0 - System Breaking)

### 🔴 BUG-001: PDF Generation Fails with Modern CSS Color Functions
**Severity:** CRITICAL  
**Status:** DOCUMENTED (Bugfix spec created)  
**Location:** `components/DocumentCreator.tsx:219-253`

**Description:**  
When users attempt to generate PDF invoices/estimates, the system crashes with error: "Failed to generate PDF: Attempting to parse an unsupported color function '\''lab'\''". This affects both "Save PDF" and "WhatsApp Share" functionalities.

**Root Cause:**  
- jsPDF v4.2.1 (from 2018) does not support CSS Color Level 4 functions (lab, lch, oklab, oklch)
- Modern Tailwind CSS v4 or browser defaults may be generating lab() colors
- html2canvas v1.4.1 attempts to parse these colors but jsPDF cannot handle them

**Impact:**  
- 100% of PDF generation attempts fail
- Users cannot download invoices
- Users cannot share invoices via WhatsApp
- Core business functionality is blocked

**Reproduction:**  
1. Create any invoice with line items
2. Click "Preview Document"
3. Click "Save PDF" or "WhatsApp" button
4. Error appears: "Failed to generate PDF: Attempting to parse an unsupported color function '\''lab'\''"

**Fix Status:**  
Bugfix specification created at `.kiro/specs/pdf-lab-color-bugfix/`. Upgrade jsPDF from v4.2.1 to v2.5.2 required.

---

### 🔴 BUG-002: Hardcoded Phone Number for Admin Check
**Severity:** CRITICAL (Security)  
**Status:** ACTIVE  
**Location:** `app/api/v1/documents/route.ts:17`

**Description:**  
Admin privileges are determined by hardcoded phone number comparison (`payload.phone === "6359635416"`), which is a security vulnerability and violates proper role-based access control.

**Code:**
```typescript
if (payload.phone === "6359635416") isSamael = true;
```

**Root Cause:**  
- No proper role-based access control (RBAC) implementation
- Hardcoded credentials in source code
- Direct phone number comparison instead of role check

**Impact:**  
- Security vulnerability - anyone who knows this phone number can get admin access
- Not scalable for multiple admins
- Violates security best practices
- Exposes sensitive authentication logic

**Recommended Fix:**  
1. Use the existing `role` field from User model (SUPER_ADMIN, SERVICE_MANAGER, etc.)
2. Check `payload.role === '\''SUPER_ADMIN'\''` instead of phone number
3. Remove hardcoded phone number from source code
4. Implement proper middleware for role-based authentication

---

### 🟠 BUG-003: Unsafe Default JWT Secret
**Severity:** HIGH (Security)  
**Status:** ACTIVE  
**Location:** Multiple files

**Locations:**
- `app/api/auth/login/route.ts:6`
- `app/api/v1/documents/route.ts:16`

**Description:**  
JWT secret falls back to an unsafe default value if `JWT_SECRET` environment variable is not set.

**Code:**
```typescript
const JWT_SECRET = process.env.JWT_SECRET || "default_unsafe_secret_for_dev_only";
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_unsafe_secret_for_dev_only");
```

**Root Cause:**  
- Fallback to predictable default secret
- No validation that JWT_SECRET is set in production
- Development convenience prioritized over security

**Impact:**  
- In production, if JWT_SECRET is not set, tokens can be forged
- Attacker can generate valid JWT tokens and bypass authentication
- Complete authentication bypass vulnerability

**Recommended Fix:**  
1. Throw error if JWT_SECRET is not set: `if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET must be set")`
2. Remove default fallback value
3. Add startup validation to ensure JWT_SECRET exists
4. Document required environment variables in README

---

## High Priority Bugs (P1 - Feature Breaking)

### 🟠 BUG-004: Race Condition in Auto Document Number Generation
**Severity:** HIGH  
**Status:** PARTIALLY MITIGATED  
**Location:** `app/api/v1/documents/route.ts:69-93`

**Description:**  
When `docNumber === "AUTO"`, the system generates sequential document numbers by counting existing documents. A race condition exists where two simultaneous requests can generate the same document number, leading to unique constraint violations.

**Code:**
```typescript
const count = await tx.document.count({ where: { type: docType } });
const prefix = docType === "SOW_BILL" ? "MF2-PASS-" : "MF2-EST-";
const seq = (count + 1).toString().padStart(2, '\''0'\'');
finalDocNumber = `${prefix}${seq}`;
```

**Mitigation Attempt:**
The code includes a retry loop (up to 5 attempts) to handle `P2002` unique constraint errors, but this is a band-aid solution.

**Root Cause:**  
- Count-based sequence generation is not atomic
- Time-of-check-time-of-use (TOCTOU) vulnerability
- No database-level sequence or auto-increment

**Impact:**  
- System becomes "too busy" after 5 failed retries
- Poor user experience with retries
- Unnecessary database load from retries
- Can still fail under high concurrent load

**Recommended Fix:**  
1. Use PostgreSQL sequence: `CREATE SEQUENCE motofit_bill_seq START 1`
2. Query sequence directly: `SELECT nextval('\''motofit_bill_seq'\'')`
3. Remove retry loop
4. Use database transaction isolation properly

---

### 🟠 BUG-005: Missing Pagination - Memory Exhaustion Risk
**Severity:** HIGH  
**Status:** ACTIVE  
**Location:** Multiple API routes

**Affected Routes:**
- `app/api/v1/documents/route.ts:26` - `take: 100` hardcoded
- `app/api/v1/customers/route.ts:6` - `take: 100` hardcoded
- `app/api/v1/parts/route.ts:5` - `take: 100` hardcoded

**Description:**  
All GET endpoints use hardcoded `take: 100` limit without offset pagination, skip/take parameters, or cursor-based pagination. As data grows beyond 100 records, older data becomes inaccessible.

**Impact:**  
- Users cannot access documents/customers/parts beyond first 100
- No way to view historical data once limit is reached
- Poor user experience as business scales
- Data effectively becomes "lost" from UI perspective

**Recommended Fix:**  
1. Implement cursor-based pagination with `cursor` and `take` query params
2. Or implement offset pagination with `page` and `pageSize` query params
3. Return pagination metadata: `{ data: [], totalCount, hasMore, nextCursor }`
4. Update frontend to handle pagination

---

### 🟡 BUG-006: Inconsistent Transaction Type Mapping
**Severity:** MEDIUM  
**Status:** ACTIVE  
**Location:** `app/dashboard/page.tsx:16-24`

**Description:**  
Dashboard calculates revenue/expenses by checking `t.type === '\''Income'\''` and `t.type === '\''Expense'\''`, but the Prisma schema defines `TransactionType` enum as `CREDIT`, `DEBIT`, `EXPENSE` (not "Income").

**Code:**
```typescript
data.forEach(t => {
  // ...
  if (t.type === '\''Income'\'') rev += val;  // '\''Income'\'' is not in enum!
  if (t.type === '\''Expense'\'') exp += val; // This matches
});
```

**Prisma Schema:**
```prisma
enum TransactionType {
  CREDIT
  DEBIT
  EXPENSE
}
```

**Root Cause:**  
- Mismatch between frontend expectations and backend schema
- No type checking between API and frontend
- Likely copy-paste error or schema change without updating frontend

**Impact:**  
- Revenue will always be 0 (no transactions have type "Income")
- Dashboard shows incorrect financial data
- Business metrics are unreliable
- Users cannot trust financial reporting

**Recommended Fix:**  
1. Update dashboard to check `t.type === '\''CREDIT'\''` instead of "Income"
2. Or update schema to include `INCOME` in enum
3. Add TypeScript types shared between frontend and backend
4. Use TypeScript enums for type safety

---

## Medium Priority Bugs (P2 - User Experience)

### 🟡 BUG-007: Plaintext PIN Storage with Unsafe Migration
**Severity:** MEDIUM (Security/Technical Debt)  
**Status:** ACTIVE  
**Location:** `app/api/auth/login/route.ts:28-45`

**Description:**  
Legacy PINs were stored in plaintext, and the migration path auto-upgrades to bcrypt on successful login. However, this means some users still have plaintext PINs in the database.

**Code:**
```typescript
const isBcryptHash = user.pinHash.startsWith("$2a$") || user.pinHash.startsWith("$2b$");
let isPinValid = false;
if (isBcryptHash) {
  isPinValid = await bcrypt.compare(pin.trim(), user.pinHash);
} else {
  isPinValid = user.pinHash === pin.trim(); // Plaintext comparison!
  // Auto-migrate on successful login
  if (isPinValid) {
    const hashed = await bcrypt.hash(pin.trim(), 10);
    await prisma.user.update({ where: { id: user.id }, data: { pinHash: hashed } });
  }
}
```

**Root Cause:**  
- Technical debt from early development
- Gradual migration strategy instead of one-time migration
- No enforcement that all PINs must be hashed

**Impact:**  
- Some users have plaintext PINs in database (security risk)
- If database is compromised, these PINs are exposed
- Users who don'\''t log in won'\''t get migrated
- Inconsistent security posture across users

**Recommended Fix:**  
1. Write one-time migration script to hash all remaining plaintext PINs
2. Run migration: `UPDATE users SET pinHash = bcrypt_hash(pinHash) WHERE pinHash NOT LIKE '\''$2%'\''`
3. Remove plaintext fallback code after migration
4. Add database constraint to validate hash format

---

### 🟡 BUG-008: Error Messages Expose Internal Details
**Severity:** MEDIUM (Security/UX)  
**Status:** ACTIVE  
**Location:** Multiple API routes

**Examples:**
- `app/api/v1/documents/route.ts:42` - Returns raw `error.message` to client
- `app/api/v1/customers/route.ts:22` - Returns raw `error.message` to client
- `app/api/auth/login/route.ts:72` - Returns raw `error.message` to client

**Description:**  
API endpoints return raw error messages from exceptions, which may expose internal implementation details, database schema, file paths, or stack traces.

**Code Pattern:**
```typescript
} catch (error: any) {
  return NextResponse.json({ error: error.message }, { status: 500 });
}
```

**Root Cause:**  
- No error sanitization layer
- Direct exposure of exception messages
- Development convenience prioritized over security

**Impact:**  
- Information disclosure vulnerability
- Attackers can learn about database structure, file paths, dependencies
- Poor user experience (technical errors instead of user-friendly messages)
- Violates security best practices

**Recommended Fix:**  
1. Create error handler utility: `sanitizeError(error)`
2. Map known errors to user-friendly messages
3. Log full error server-side for debugging
4. Return generic "Something went wrong" for unexpected errors
5. Only return specific errors for validation failures

---

### 🟡 BUG-009: Missing Input Validation on Numeric Fields
**Severity:** MEDIUM  
**Status:** ACTIVE  
**Location:** `app/api/v1/parts/route.ts:25-26`

**Description:**  
Price and stock fields use regex replacement and fallback to 0, but don'\''t validate that the input is a valid positive number. This can lead to data integrity issues.

**Code:**
```typescript
price: Number.parseFloat(price.toString().replace(/[^0-9.-]+/g, "")) || 0.00,
stock: Number.parseInt(stock) || 0
```

**Issues:**
- Accepts negative prices: `price: -500` becomes `-500.00`
- Accepts negative stock: `stock: -10` becomes `-10`
- Empty string becomes `0` silently
- No validation that price/stock are reasonable values

**Impact:**  
- Database can contain invalid data (negative prices/stock)
- Business logic errors (selling at negative price)
- Accounting issues
- Poor data quality

**Recommended Fix:**  
1. Add validation: `if (price < 0) throw new Error("Price must be positive")`
2. Add validation: `if (stock < 0) throw new Error("Stock cannot be negative")`
3. Use validation library like Zod for schema validation
4. Return 400 Bad Request for invalid input

---

### 🟡 BUG-010: No Vehicle Update When Customer Already Exists
**Severity:** MEDIUM  
**Status:** ACTIVE  
**Location:** `app/api/v1/documents/route.ts:77-88`

**Description:**  
When creating a document, the code upserts the customer but doesn'\''t update the vehicle if it already exists. This means if a vehicle'\''s odometer reading or make/model changes, it won'\''t be updated.

**Code:**
```typescript
let vehicle = await tx.vehicle.findUnique({
  where: { regNumber: vehicleReg }
});
if (!vehicle) {
  vehicle = await tx.vehicle.create({
    data: {
      regNumber: vehicleReg,
      makeModel: makeModel || "Unknown",
      runningKm: runningKm || 0,
      customerId: customer.id
    }
  });
}
// No update path if vehicle exists!
```

**Root Cause:**  
- Only creates vehicle if it doesn'\''t exist
- No logic to update existing vehicle data
- Assumes vehicle data never changes

**Impact:**  
- Odometer readings don'\''t get updated on subsequent visits
- If vehicle model name changes (typo correction), it won'\''t update
- Data becomes stale over time
- Reports based on odometer are inaccurate

**Recommended Fix:**  
1. Use `upsert` instead of `findUnique` + conditional create
2. Update vehicle data on every document creation:
```typescript
vehicle = await tx.vehicle.upsert({
  where: { regNumber: vehicleReg },
  update: {
    makeModel: makeModel || vehicle.makeModel,
    runningKm: runningKm > vehicle.runningKm ? runningKm : vehicle.runningKm
  },
  create: { /* ... */ }
});
```

---

### 🟡 BUG-011: Failed Login Attempts Counter Not Incremented
**Severity:** MEDIUM (Security)  
**Status:** ACTIVE  
**Location:** `app/api/auth/login/route.ts`

**Description:**  
User model has `failedAttempts` field (line 50 in login route shows check for `isActive`), but failed login attempts are never incremented, and accounts are never locked after multiple failed attempts.

**Prisma Schema:**
```prisma
failedAttempts Int       @default(0)
isActive       Boolean   @default(true)
```

**Missing Implementation:**
- No increment on failed PIN
- No account lockout after threshold (e.g., 5 attempts)
- No reset of counter on successful login
- No rate limiting

**Impact:**  
- Brute force attacks are possible
- No protection against password guessing
- Security feature exists in schema but not implemented
- Violates security best practices

**Recommended Fix:**  
1. Increment `failedAttempts` on wrong PIN:
```typescript
await prisma.user.update({
  where: { id: user.id },
  data: { failedAttempts: { increment: 1 } }
});
```
2. Lock account if `failedAttempts >= 5`:
```typescript
if (user.failedAttempts >= 5) {
  await prisma.user.update({
    where: { id: user.id },
    data: { isActive: false }
  });
}
```
3. Reset counter on successful login
4. Add rate limiting middleware

---

## Low Priority Bugs (P3 - Minor Issues)

### 🟢 BUG-012: Inconsistent Comment Describing MDR Rate
**Severity:** LOW (Documentation)  
**Status:** ACTIVE  
**Location:** `lib/billing-calculations.ts:37`

**Description:**  
Code comment says "standard 1.1% interchange MDR" but the actual rate is 0.4% (0.004).

**Code:**
```typescript
// Rule 2: On or after 15 October 2026 -> If UPI and Total > ₹2,000.00, apply standard 1.1% interchange MDR.
// ...
mdrRate = 0.004; // 0.4% UPI Merchant Interchange Fee
```

**Impact:**  
- Comment is misleading
- Developers might get confused
- No functional impact (code is correct)

**Recommended Fix:**  
Update comment to say "standard 0.4% interchange MDR" to match the code.

---

### 🟢 BUG-013: Console.error in Production Code
**Severity:** LOW  
**Status:** ACTIVE  
**Location:** Multiple files

**Locations:**
- `app/dashboard/page.tsx:27` - `.catch(console.error)`
- `lib/whatsapp-share.ts:58` - `console.error("Native share failed", err)`

**Description:**  
Console.error statements exist in production code. While not harmful, they expose errors to the browser console which could aid attackers in reconnaissance.

**Impact:**  
- Information disclosure (minor)
- Clutters browser console
- Not professional in production

**Recommended Fix:**  
1. Replace with proper error logging service (Sentry, LogRocket)
2. Or remove console.error from production builds
3. Use conditional logging: `if (process.env.NODE_ENV !== '\''production'\'') console.error(...)`

---

### 🟢 BUG-014: Missing lastLogin Update
**Severity:** LOW  
**Status:** ACTIVE  
**Location:** `app/api/auth/login/route.ts`

**Description:**  
User model has `lastLogin` field but it'\''s never updated when user successfully logs in.

**Prisma Schema:**
```prisma
lastLogin DateTime?
```

**Impact:**  
- No audit trail of user logins
- Cannot track when users last accessed system
- Feature exists but not used

**Recommended Fix:**  
Add update on successful login:
```typescript
await prisma.user.update({
  where: { id: user.id },
  data: { 
    lastLogin: new Date(),
    failedAttempts: 0 // Also reset failed attempts
  }
});
```

---

### 🟢 BUG-015: Misleading "This Month" Label on Net Profit
**Severity:** LOW (UX)  
**Status:** ACTIVE  
**Location:** `app/dashboard/page.tsx:108`

**Description:**  
Dashboard shows "Net Profit" with label "This Month", but the calculation is actually "All Time" (same as revenue and expenses).

**Code:**
```typescript
const netProfit = revenue - expenses; // All time calculation
// ...
<p className="text-sm text-gray-400 mt-2">This Month</p>
```

**Impact:**  
- Misleading UI
- Users think it'\''s monthly profit but it'\''s actually all-time
- Business decisions based on wrong interpretation

**Recommended Fix:**  
Change label to "All Time" to match revenue and expenses labels, or implement actual monthly filtering.

---

## Design/Architecture Issues

### 📋 ISSUE-001: Missing API Authentication Middleware
**Severity:** ARCHITECTURAL  
**Status:** ACTIVE  
**Location:** All API routes

**Description:**  
Every API route manually handles JWT verification with duplicated code. There'\''s no centralized authentication middleware.

**Impact:**  
- Code duplication
- Inconsistent auth implementation
- Easy to forget auth checks on new endpoints
- Maintenance burden

**Recommended Fix:**  
1. Create Next.js middleware at `middleware.ts`
2. Implement JWT verification once
3. Attach user to request object
4. Protect routes by path pattern

---

### 📋 ISSUE-002: No Request Validation Layer
**Severity:** ARCHITECTURAL  
**Status:** ACTIVE

**Description:**  
API routes manually validate each field without a schema validation library. This leads to inconsistent validation and missing edge cases.

**Recommended Fix:**  
1. Use Zod or Yup for schema validation
2. Create reusable schemas for each endpoint
3. Validate request body in middleware
4. Return structured 400 errors

---

### 📋 ISSUE-003: No Centralized Error Handling
**Severity:** ARCHITECTURAL  
**Status:** ACTIVE

**Description:**  
Every route has its own try-catch with inconsistent error responses. No global error handler.

**Recommended Fix:**  
1. Create error handling utility: `handleApiError(error, req)`
2. Map error types to HTTP status codes
3. Standardize error response format
4. Log errors to monitoring service

---

## Summary Statistics

**Total Bugs Found:** 15  
**Critical (P0):** 2  
**High (P1):** 4  
**Medium (P2):** 5  
**Low (P3):** 4  

**By Category:**
- Security: 6 bugs
- Functionality: 5 bugs
- Data Integrity: 3 bugs
- User Experience: 3 bugs
- Documentation: 1 bug

**Status:**
- Active (Need Fix): 14
- Documented (Fix Planned): 1

---

## Recommended Priority Order

1. **BUG-001** - PDF Generation (BLOCKS CORE FEATURE)
2. **BUG-002** - Hardcoded Admin Phone (SECURITY CRITICAL)
3. **BUG-003** - Unsafe JWT Secret (SECURITY CRITICAL)
4. **BUG-004** - Race Condition in Doc Numbers (HIGH VOLUME IMPACT)
5. **BUG-005** - Missing Pagination (SCALABILITY BLOCKER)
6. **BUG-011** - Failed Login Counter (SECURITY)
7. **BUG-006** - Transaction Type Mapping (DATA INTEGRITY)
8. **BUG-007** - Plaintext PIN Migration (SECURITY DEBT)
9. **BUG-010** - Vehicle Update Missing (DATA STALENESS)
10. **BUG-008** - Error Message Exposure (SECURITY)
11. **BUG-009** - Missing Numeric Validation (DATA INTEGRITY)
12. **BUG-014** - Missing lastLogin Update (AUDIT)
13. **BUG-015** - Misleading Label (UX)
14. **BUG-012** - Comment Inaccuracy (DOCS)
15. **BUG-013** - Console.error in Production (MINOR)

---

## Next Steps

1. Review and prioritize this list with the team
2. Create GitHub/Jira issues for each bug
3. Assign bugs to sprints based on priority
4. Start with BUG-001 (PDF generation) as it'\''s already documented
5. Schedule security audit for CRITICAL bugs (002, 003, 011)
6. Consider hiring security consultant for penetration testing

---

*This bug list was generated through automated code analysis and manual review. Additional bugs may exist and should be discovered through:*
- *Unit testing*
- *Integration testing*
- *User acceptance testing*
- *Security penetration testing*
- *Load testing*
