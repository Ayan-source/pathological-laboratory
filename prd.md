Bilkul. **Admin ke liye separate `/admin` area** rakhenge, normal dashboard se clearly separate. Admin hi system configuration, users, permissions, test catalog, pricing, report templates, inventory settings, audit logs, etc. control karega.

Neeche **PRD v1.0** ko intentionally task-level detail mein bana raha hoon. Isko tum development checklist ki tarah use kar sakte ho.

# Laboratory Information & Management System — PRD v1.0

**Project type:** Pathology Laboratory Management System / LIS
**Primary stack:** Next.js + TypeScript + Supabase + Prisma + PostgreSQL
**UI:** Tailwind CSS + component library
**Validation:** Zod
**Auth:** Supabase Auth
**ORM:** Prisma
**Deployment:** Vercel + Supabase
**Target:** Small/medium pathology laboratory

---

# 1. Product Objective

Current laboratory operations are largely manual:

* Patient/test registration
* Billing
* Result entry
* Report preparation
* Report printing
* Inventory tracking
* Daily/monthly statistics

The system will digitize the workflow so that every important laboratory activity has a traceable record.

### Core objective

```text
Patient
  ↓
Order
  ↓
Billing
  ↓
Sample
  ↓
Testing
  ↓
Result
  ↓
Verification
  ↓
Report
  ↓
Printing / Delivery
```

while simultaneously maintaining:

```text
Inventory
Payments
Users
Audit Logs
Analytics
```

---

# 2. Product Principles

These are architectural rules for the whole project.

### P1 — Everything important is traceable

If someone:

* creates a patient
* changes a result
* receives payment
* prints a report
* changes inventory

the system should know **who, what, and when**.

### P2 — Verified results are protected

A technician should never be able to silently modify a verified report.

### P3 — Stock changes through transactions

Don't simply overwrite:

```text
stock = 50
```

Instead:

```text
+20 Purchase
-5 Consumption
-2 Damaged
```

and calculate/maintain the resulting stock.

### P4 — Configuration over hardcoding

Tests, prices, parameters, reference ranges, report settings, invoice prefixes etc. should be configurable by Admin.

### P5 — Every feature has acceptance tests

Nothing is "done" until it passes its test cases.

---

# 3. User Roles

| Role                  | Access                          |
| --------------------- | ------------------------------- |
| **Admin**             | Full system                     |
| **Receptionist**      | Patients, orders, billing       |
| **Technician**        | Samples, testing, results       |
| **Pathologist**       | Verification, reports           |
| **Inventory Manager** | Inventory, suppliers, purchases |

---

# 4. Application Structure

There will be two major application areas.

```text
/
├── login
│
├── dashboard
│
├── patients
├── orders
├── samples
├── results
├── reports
├── billing
├── inventory
├── suppliers
├── purchases
└── analytics
```

And separately:

```text
/admin
├── dashboard
├── users
├── roles
├── permissions
├── tests
├── test-categories
├── test-parameters
├── reference-ranges
├── report-templates
├── pricing
├── inventory-settings
├── lab-settings
├── system-settings
└── audit-logs
```

**Admin pages should not just be hidden buttons.** Server-side authorization must also prevent non-admin users from accessing `/admin/*`.

---

# 5. Development Priority

We'll use:

* **P0** — Required for MVP
* **P1** — Important after core MVP
* **P2** — Future enhancement

---

# PHASE 0 — PROJECT FOUNDATION

## SETUP-001 — Create Next.js application

**Priority:** P0

### Tasks

* [ ] Initialize Next.js
* [ ] Enable TypeScript
* [ ] Configure App Router
* [ ] Configure ESLint
* [ ] Configure formatting
* [ ] Configure Tailwind
* [ ] Create base layout
* [ ] Create environment configuration

### Acceptance

* Application starts successfully
* TypeScript compiles
* Lint passes
* Production build succeeds

---

## SETUP-002 — Configure Supabase

**Priority:** P0

### Tasks

* [ ] Create Supabase project
* [ ] Configure PostgreSQL
* [ ] Configure Supabase Auth
* [ ] Configure Storage
* [ ] Create development environment variables
* [ ] Create production environment variables

### Test

```text
Application
    ↓
Supabase
    ↓
Connection successful
```

---

## SETUP-003 — Configure Prisma

**Priority:** P0

### Tasks

* [ ] Install Prisma
* [ ] Initialize Prisma
* [ ] Configure PostgreSQL datasource
* [ ] Create `schema.prisma`
* [ ] Configure Prisma Client
* [ ] Create migration workflow
* [ ] Create seed script
* [ ] Create initial seed data

### Test

```bash
npx prisma migrate dev
npx prisma db seed
```

must execute successfully.

---

## SETUP-004 — Create project architecture

**Priority:** P0

Create:

```text
src/
├── app/
├── components/
├── lib/
├── services/
├── validations/
├── types/
└── utils/

prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

---

# PHASE 1 — AUTHENTICATION

## AUTH-001 — Login

**Priority:** P0

### Tasks

* [ ] Login page
* [ ] Email input
* [ ] Password input
* [ ] Validation
* [ ] Supabase login
* [ ] Loading state
* [ ] Error state
* [ ] Successful redirect

### Tests

* Valid credentials
* Invalid password
* Invalid email
* Empty fields
* Session persistence

---

## AUTH-002 — Logout

* [ ] Logout button
* [ ] Supabase logout
* [ ] Clear session
* [ ] Redirect to login

---

## AUTH-003 — User profile

* [ ] Profile model
* [ ] Display name
* [ ] Role
* [ ] Profile page
* [ ] Update allowed profile fields

---

# PHASE 2 — ROLE & ACCESS CONTROL

## RBAC-001 — Define roles

Prisma enum:

```text
ADMIN
RECEPTIONIST
TECHNICIAN
PATHOLOGIST
INVENTORY_MANAGER
```

---

## RBAC-002 — Permission system

Create permissions such as:

```text
patients.read
patients.create
patients.update

orders.read
orders.create
orders.update

billing.read
billing.create

results.read
results.create
results.verify

reports.read
reports.generate
reports.print

inventory.read
inventory.manage

admin.users
admin.settings
admin.audit_logs
```

---

## RBAC-003 — Server-side authorization

Create:

```text
requireAuth()
requireRole()
requirePermission()
```

### Critical tests

A receptionist attempting:

```text
/admin/users
```

must receive:

```text
403 / Access Denied
```

even if they manually type the URL.

---

# PHASE 3 — ADMIN AREA

# `/admin`

This is a dedicated administrative control center.

## ADMIN-001 — Admin layout

**Priority:** P0

Create:

```text
/admin
```

with its own sidebar.

```text
ADMINISTRATION

Dashboard

Users
Roles & Permissions

Test Management
 ├── Tests
 ├── Categories
 ├── Parameters
 └── Reference Ranges

Report Configuration

Pricing

Inventory Configuration

Lab Settings

System Settings

Audit Logs
```

---

## ADMIN-002 — Admin dashboard

Display:

```text
Total Users
Active Users
Total Tests
Active Tests
Today's Orders
Today's Revenue
Pending Verification
Low Stock Items
```

### Test

Numbers must come from database queries, not hardcoded values.

---

# PHASE 4 — USER MANAGEMENT

## USER-001 — Create user

Admin can create staff account.

Fields:

```text
Name
Email
Phone
Role
Status
```

Tasks:

* [ ] Create user UI
* [ ] Validate email
* [ ] Assign role
* [ ] Set active/inactive
* [ ] Create profile
* [ ] Handle duplicate email

---

## USER-002 — User list

* [ ] Search
* [ ] Filter by role
* [ ] Filter by status
* [ ] Pagination
* [ ] Open user

---

## USER-003 — Activate/deactivate user

Admin can deactivate a staff account.

Test:

```text
Deactivate user
↓
User attempts login
↓
Access denied
```

---

# PHASE 5 — PATIENT MANAGEMENT

## PAT-001 — Patient Prisma model

Fields:

```text
id
patientNumber
firstName
lastName
dateOfBirth
gender
phone
email
cnic
address
notes
createdAt
updatedAt
```

---

## PAT-002 — Create patient

### Tasks

* [ ] Form
* [ ] Validation
* [ ] Generate patient number
* [ ] Save patient
* [ ] Success notification

### Tests

* Valid patient
* Missing required field
* Invalid phone
* Invalid date
* Duplicate handling

---

## PAT-003 — Patient search

Search by:

```text
Patient ID
Name
Phone
CNIC
```

---

## PAT-004 — Patient profile

Show:

```text
Patient details

Orders
Reports
Payments
Sample history
```

---

## PAT-005 — Patient edit

Allowed fields must be controlled.

Every update creates audit record.

---

# PHASE 6 — TEST CATALOG

# `/admin/tests`

## TEST-001 — Test category

Example:

```text
Hematology
Biochemistry
Microbiology
Serology
Urinalysis
Immunology
```

Tasks:

* [ ] Create category
* [ ] Edit category
* [ ] Activate/deactivate
* [ ] List categories

---

## TEST-002 — Create test

Fields:

```text
Test Name
Test Code
Category
Price
Sample Type
Turnaround Time
Status
```

---

## TEST-003 — Test list

* [ ] Search
* [ ] Filter category
* [ ] Filter status
* [ ] Sort
* [ ] Pagination

---

## TEST-004 — Test pricing

Admin can change price.

Important:

**Old orders must retain their original price.**

Example:

```text
CBC today = Rs. 500

Tomorrow price = Rs. 600
```

Old invoice remains:

```text
CBC = Rs. 500
```

---

# PHASE 7 — TEST PARAMETERS

## PARAM-001 — Create parameter

Example:

```text
Hemoglobin
Code: HB
Unit: g/dL
Data Type: Numeric
```

---

## PARAM-002 — Link parameters to tests

Example:

```text
CBC
 ├── Hemoglobin
 ├── RBC
 ├── WBC
 └── Platelets
```

---

## PARAM-003 — Parameter ordering

Admin can configure:

```text
1. Hemoglobin
2. RBC
3. WBC
4. Platelets
```

This determines report order.

---

# PHASE 8 — REFERENCE RANGES

## RANGE-001

Support:

```text
Minimum
Maximum
Unit
Gender
Age range
```

Example:

```text
Male
Age 18–60
Hemoglobin
13–17 g/dL
```

---

## RANGE-002 — Abnormal status

System determines:

```text
LOW
NORMAL
HIGH
```

based on configured ranges.

**It does not diagnose disease.**

---

# PHASE 9 — LAB ORDERS

## ORDER-001 — Create order

Flow:

```text
Select patient
↓
Select tests
↓
Calculate pricing
↓
Apply discount
↓
Create order
```

---

## ORDER-002 — Order number

Generate unique:

```text
LAB-20261004-0001
```

---

## ORDER-003 — Add/remove tests

Tasks:

* [ ] Add test
* [ ] Remove test
* [ ] Prevent duplicate test unless configured
* [ ] Recalculate total

---

## ORDER-004 — Order status

```text
REGISTERED
SAMPLE_PENDING
PROCESSING
RESULT_PENDING
VERIFICATION_PENDING
COMPLETED
CANCELLED
```

---

# PHASE 10 — BILLING

## BILL-001 — Invoice generation

Automatically create invoice when order is confirmed.

---

## BILL-002 — Invoice calculation

```text
Subtotal
- Discount
+ Tax if configured
= Total
```

---

## BILL-003 — Payment

Support:

```text
CASH
CARD
BANK_TRANSFER
OTHER
```

---

## BILL-004 — Partial payments

Example:

```text
Total: 5,000

Payment: 2,000

Paid: 2,000
Balance: 3,000
Status: PARTIAL
```

---

## BILL-005 — Multiple payments

Second payment:

```text
+3,000

Balance: 0
Status: PAID
```

---

## BILL-006 — Receipt

Generate printable receipt.

---

## BILL-007 — Payment restrictions

Configurable Admin setting:

```text
Require payment before report printing
```

If enabled:

```text
Balance > 0
       ↓
Print blocked
```

---

# PHASE 11 — SAMPLE MANAGEMENT

## SAMPLE-001 — Sample creation

Each required sample gets:

```text
Sample ID
Order ID
Patient
Sample Type
Collection Status
```

---

## SAMPLE-002 — Sample number

Example:

```text
SMP-20261004-00124
```

---

## SAMPLE-003 — Collection

Technician/receptionist:

```text
Mark Collected
```

Store:

```text
Collected At
Collected By
```

---

## SAMPLE-004 — Receive sample

```text
COLLECTED
↓
RECEIVED
```

---

## SAMPLE-005 — Sample rejection

Support:

```text
Rejected
Reason
Rejected By
Rejected At
```

Example:

```text
Insufficient sample
Hemolysed sample
Wrong container
```

---

# PHASE 12 — RESULT ENTRY

## RESULT-001 — Technician queue

Show:

```text
Pending Tests
Processing
Draft Results
Submitted Results
```

---

## RESULT-002 — Dynamic result form

Test parameters automatically appear.

Example:

```text
CBC

Hemoglobin    [       ] g/dL
RBC           [       ] million/uL
WBC           [       ] /uL
Platelets     [       ] thousand/uL
```

---

## RESULT-003 — Result validation

Numeric parameter:

```text
12.5
```

must be valid.

Text parameter:

```text
Negative
```

allowed where configured.

---

## RESULT-004 — Save draft

Technician can save incomplete results.

---

## RESULT-005 — Submit result

Once submitted:

```text
DRAFT
↓
VERIFICATION_PENDING
```

---

# PHASE 13 — PATHOLOGIST VERIFICATION

## VERIFY-001 — Verification queue

Pathologist sees:

```text
Order
Patient
Test
Technician
Submitted At
Status
```

---

## VERIFY-002 — Review result

Pathologist sees:

```text
Patient
Test
Parameters
Values
Reference ranges
Abnormal flags
```

---

## VERIFY-003 — Approve

```text
VERIFIED
```

Store:

```text
Verified By
Verified At
```

---

## VERIFY-004 — Reject

Pathologist can return result to technician:

```text
REJECTED
Reason required
```

Then:

```text
REJECTED
↓
TECHNICIAN REVISION
↓
SUBMITTED
```

---

## VERIFY-005 — Lock verified result

After verification:

```text
Technician
❌ Cannot edit

Receptionist
❌ Cannot edit

Pathologist
Controlled correction process only
```

---

# PHASE 14 — REPORT GENERATION

## REPORT-001 — Report template

Template contains:

```text
Lab Logo
Lab Name
Address
Contact

Patient information

Test information

Result table

Reference ranges

Pathologist information

Footer
```

---

## REPORT-002 — Generate report

Only verified results can generate final report.

Flow:

```text
Verified
↓
Generate PDF
↓
Store report
```

---

## REPORT-003 — Report number

Example:

```text
REP-20261004-0001
```

---

## REPORT-004 — Report versioning

If corrected:

```text
Version 1
Version 2
```

Previous version remains auditable.

---

# PHASE 15 — REPORT PRINTING

## PRINT-001 — Print report

Store:

```text
Report ID
Printed By
Printed At
```

---

## PRINT-002 — Print count

Example:

```text
Report ID: REP-1001

Print #1
Print #2
Print #3
```

---

## PRINT-003 — Reprint tracking

Dashboard:

```text
Reports Generated: 100
Reports Printed: 112
Reprints: 12
```

---

# PHASE 16 — INVENTORY

## INV-001 — Inventory item

Fields:

```text
Name
Code
Category
Unit
Minimum Stock
Status
```

---

## INV-002 — Inventory batch

Fields:

```text
Item
Batch Number
Expiry
Quantity
Purchase Price
Supplier
```

---

## INV-003 — Stock transaction

Types:

```text
PURCHASE
CONSUMPTION
DAMAGE
EXPIRY
RETURN
ADJUSTMENT
```

---

## INV-004 — Stock calculation

Example:

```text
Opening       100
Purchase       50
Consumption    -20
Damage          -2
------------------
Current        128
```

---

## INV-005 — Low-stock alert

If:

```text
Current <= Minimum
```

show:

```text
LOW STOCK
```

---

## INV-006 — Expiry alert

Admin configures:

```text
Alert 30 days before expiry
```

Dashboard:

```text
7 items expiring soon
```

---

# PHASE 17 — SUPPLIERS

## SUP-001

Create supplier:

```text
Name
Contact Person
Phone
Email
Address
Notes
```

---

## SUP-002

Supplier list:

* Search
* Filter
* View purchases
* View supplied items

---

# PHASE 18 — PURCHASES

## PUR-001 — Create purchase

```text
Supplier
↓
Items
↓
Quantity
↓
Batch
↓
Expiry
↓
Cost
```

---

## PUR-002 — Receive purchase

When purchase is received:

```text
Purchase
↓
Inventory Transaction
↓
Stock increases
```

---

## PUR-003 — Purchase history

Filter:

```text
Supplier
Date
Item
```

---

# PHASE 19 — DASHBOARD

## DASH-001 — Operational dashboard

For normal users according to permissions.

Cards:

```text
Today's Patients
Today's Orders
Pending Samples
Pending Results
Pending Verification
Reports Ready
```

---

# PHASE 20 — ADMIN DASHBOARD

Separate:

```text
/admin
```

Admin dashboard:

```text
             ADMIN DASHBOARD

Users                         18
Active Users                  16
Tests                         87
Active Tests                 82

Today's Orders                54
Today's Revenue          Rs. 91,500

Pending Verification           7
Low Stock                      4
Expiring Soon                  6

Reports Generated             48
Reports Printed               52
```

---

# PHASE 21 — ANALYTICS

## ANALYTICS-001

Date filters:

```text
Today
Yesterday
7 Days
30 Days
Custom
```

---

## ANALYTICS-002

Test volume:

```text
CBC       320
LFT       240
HbA1c     190
RFT       160
```

---

## ANALYTICS-003

Revenue:

```text
Daily
Weekly
Monthly
```

---

## ANALYTICS-004

Printing analytics:

```text
Generated
Printed
Reprinted
```

---

## ANALYTICS-005

Outstanding payments:

```text
Total billed
Total paid
Total outstanding
```

---

# PHASE 22 — AUDIT LOGS

## AUDIT-001

Record:

```text
User
Action
Entity
Entity ID
Timestamp
```

---

## AUDIT-002

Important actions:

```text
LOGIN
PATIENT_CREATED
PATIENT_UPDATED

ORDER_CREATED
ORDER_UPDATED

PAYMENT_CREATED

RESULT_CREATED
RESULT_UPDATED
RESULT_VERIFIED

REPORT_GENERATED
REPORT_PRINTED

INVENTORY_ADJUSTED
USER_CREATED
USER_DEACTIVATED
SETTINGS_UPDATED
```

---

## AUDIT-003

Admin UI:

```text
/admin/audit-logs
```

Filters:

```text
User
Action
Date
Entity
```

---

# PHASE 23 — LAB SETTINGS

## SETTINGS-001

Admin can configure:

```text
Lab Name
Logo
Address
Phone
Email
Website
```

---

## SETTINGS-002

Number prefixes:

```text
Patient: PT-
Order: LAB-
Invoice: INV-
Report: REP-
Sample: SMP-
```

---

## SETTINGS-003

Report settings:

```text
Require verification
Require payment
Allow reprint
```

---

# PHASE 24 — SECURITY

## SEC-001

Protect every authenticated route.

## SEC-002

Protect every admin route server-side.

## SEC-003

Validate all inputs using Zod.

## SEC-004

Never trust client-provided role.

## SEC-005

Use authorization before sensitive database operations.

## SEC-006

Do not expose sensitive database information to client unnecessarily.

## SEC-007

Protect report files.

## SEC-008

Do not use predictable public report URLs.

## SEC-009

Audit sensitive operations.

---

# 27. Core Prisma Data Model

High-level schema:

```text
User
Role
Permission

Patient

TestCategory
Test
TestParameter
ReferenceRange

LabOrder
LabOrderItem

Sample
SampleEvent

Result
ResultValue

Report
ReportVersion
ReportPrintLog

Invoice
Payment

InventoryItem
InventoryBatch
InventoryTransaction

Supplier
Purchase
PurchaseItem

AuditLog

LabSettings
ReportTemplate
```

Relationships:

```text
Patient
  └── LabOrder
       ├── LabOrderItem
       │      └── Test
       │           └── TestParameter
       │                 └── ReferenceRange
       │
       ├── Sample
       ├── Result
       ├── Invoice
       │     └── Payment
       │
       └── Report
             ├── ReportVersion
             └── ReportPrintLog
```

---

# 28. Important Database Rule

For billing, don't rely on the current test price.

When order is created:

```text
Test current price
        ↓
copy into OrderItem
```

So:

```text
Test.price = 600
```

but:

```text
OrderItem.unitPrice = 500
```

if that order was created before the price change.

Same concept applies to report configuration/versioning.

---

# 29. Order Lifecycle

```text
REGISTERED
    ↓
SAMPLE_PENDING
    ↓
SAMPLE_COLLECTED
    ↓
PROCESSING
    ↓
RESULT_PENDING
    ↓
VERIFICATION_PENDING
    ↓
VERIFIED
    ↓
REPORT_GENERATED
    ↓
COMPLETED
```

Cancellation should be a controlled transition:

```text
REGISTERED
    ↓
CANCELLED
```

with reason + user + timestamp.

---

# 30. Definition of Done

A feature is **not complete** when its UI works.

It is complete only when:

```text
[✓] Database model
[✓] Prisma migration
[✓] Server-side logic
[✓] Validation
[✓] Authorization
[✓] UI
[✓] Error handling
[✓] Loading state
[✓] Empty state
[✓] Success state
[✓] Audit logging where required
[✓] Manual test
[✓] Edge-case test
```

---

# 31. MVP Development Order

Main tumhe **ye exact order** recommend karunga:

### Sprint 1 — Foundation

```text
SETUP-001 → SETUP-004
AUTH-001 → AUTH-003
RBAC-001 → RBAC-003
```

### Sprint 2 — Admin

```text
ADMIN-001 → ADMIN-002
USER-001 → USER-003
```

### Sprint 3 — Patients + Tests

```text
PAT-001 → PAT-005
TEST-001 → TEST-004
PARAM-001 → PARAM-003
RANGE-001 → RANGE-002
```

### Sprint 4 — Orders + Billing

```text
ORDER-001 → ORDER-004
BILL-001 → BILL-007
```

### Sprint 5 — Samples + Results

```text
SAMPLE-001 → SAMPLE-005
RESULT-001 → RESULT-005
VERIFY-001 → VERIFY-005
```

### Sprint 6 — Reports

```text
REPORT-001 → REPORT-004
PRINT-001 → PRINT-003
```

At this point you have a **real working pathology workflow**.

### Sprint 7 — Inventory

```text
INV-001 → INV-006
SUP-001 → SUP-002
PUR-001 → PUR-003
```

### Sprint 8 — Analytics/Admin

```text
DASH-001
ANALYTICS-001 → ANALYTICS-005
AUDIT-001 → AUDIT-003
SETTINGS-001 → SETTINGS-003
```

### Sprint 9 — Hardening

```text
Security
Error handling
Performance
Backup/recovery strategy
Testing
Deployment
```

---

# 32. MVP End-to-End Acceptance Test

This **one test** is extremely important.

A complete demo should work like this:

```text
1. Admin logs in
2. Admin creates CBC test
3. Admin adds CBC parameters
4. Admin configures reference ranges
5. Admin sets CBC price
6. Receptionist logs in
7. Receptionist creates patient
8. Receptionist creates order
9. Receptionist adds CBC
10. System calculates invoice
11. Receptionist receives payment
12. Sample is collected
13. Technician logs in
14. Technician sees pending CBC
15. Technician enters results
16. Technician submits results
17. Pathologist logs in
18. Pathologist reviews results
19. Pathologist verifies
20. System generates report
21. Receptionist prints report
22. System records print event
23. Dashboard updates test/report counts
24. Admin opens audit logs
25. All relevant actions are visible
```

**Agar ye complete journey successfully chalti hai, tumhare MVP ka core system genuinely working hai.**

---

# 33. Future Features — P2

Inko MVP mein **mat ghusana**.

Later:

```text
Barcode scanner
QR-based sample tracking
Patient portal
Doctor portal
WhatsApp report delivery
SMS notifications
Email reports
Online payments
Machine/analyzer integration
HL7/LIS integrations
Multiple branches
Multi-lab support
Automatic reagent consumption
Advanced accounting
Insurance
Home sample collection
Mobile application
```

---

# 34. Recommended Final Architecture

So final stack:

```text
                    USERS
                      │
                      ▼
              ┌───────────────┐
              │    Next.js    │
              │ App Router    │
              │ TypeScript    │
              └───────┬───────┘
                      │
            ┌─────────┴─────────┐
            ▼                   ▼
      Server Actions       Route Handlers
            │                   │
            └─────────┬─────────┘
                      ▼
                 Services
                      │
                      ▼
                  Prisma ORM
                      │
                      ▼
             Supabase PostgreSQL

          ┌───────────┴────────────┐
          │                        │
     Supabase Auth            Supabase Storage
```

And conceptually:

```text
                ┌───────────────┐
                │     ADMIN     │
                │ /admin/*      │
                └───────┬───────┘
                        │
          ┌─────────────┼──────────────┐
          ↓             ↓              ↓
       Config        Users          Analytics
          │
          ↓
       Test Catalog
          │
          ↓
┌───────────────────────────────────────────┐
│              LAB WORKFLOW                 │
│                                           │
│ Patient → Order → Sample → Result         │
│                         ↓                 │
│                    Verification           │
│                         ↓                 │
│                      Report               │
│                         ↓                 │
│                       Print               │
└───────────────────────────────────────────┘
          │
          ├──────── Billing
          │
          ├──────── Inventory
          │
          └──────── Audit Logs
```



#prisma schema
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

//
// ENUMS
//

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum Gender {
  MALE
  FEMALE
  OTHER
  UNKNOWN
}

enum OrderStatus {
  REGISTERED
  SAMPLE_PENDING
  SAMPLE_COLLECTED
  PROCESSING
  RESULT_PENDING
  VERIFICATION_PENDING
  VERIFIED
  REPORT_GENERATED
  COMPLETED
  CANCELLED
}

enum SampleStatus {
  PENDING
  COLLECTED
  RECEIVED
  PROCESSING
  COMPLETED
  REJECTED
}

enum ResultStatus {
  DRAFT
  SUBMITTED
  VERIFICATION_PENDING
  REJECTED
  VERIFIED
}

enum ResultValueType {
  NUMERIC
  TEXT
  BOOLEAN
  OPTION
}

enum AbnormalFlag {
  LOW
  HIGH
  NORMAL
  CRITICAL
  NONE
}

enum ReportStatus {
  DRAFT
  GENERATED
  VERIFIED
  CANCELLED
}

enum PaymentStatus {
  UNPAID
  PARTIAL
  PAID
  REFUNDED
}

enum PaymentMethod {
  CASH
  CARD
  BANK_TRANSFER
  ONLINE
  OTHER
}

enum InventoryTransactionType {
  PURCHASE
  CONSUMPTION
  DAMAGE
  EXPIRY
  RETURN
  ADJUSTMENT
}

enum PurchaseStatus {
  DRAFT
  RECEIVED
  CANCELLED
}

enum UserRole {
  ADMIN
  RECEPTIONIST
  TECHNICIAN
  PATHOLOGIST
  INVENTORY_MANAGER
}

enum DataType {
  NUMERIC
  TEXT
  BOOLEAN
  OPTION
}

//
// USERS / RBAC
//

model UserProfile {
  id        String     @id @default(uuid())
  authId    String     @unique
  name      String
  email     String     @unique
  phone     String?
  role      UserRole
  status    UserStatus @default(ACTIVE)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  ordersCreated       LabOrder[]             @relation("OrderCreatedBy")
  samplesCollected    Sample[]               @relation("SampleCollectedBy")
  samplesReceived     Sample[]               @relation("SampleReceivedBy")
  resultsEntered      Result[]               @relation("ResultEnteredBy")
  resultsVerified     Result[]               @relation("ResultVerifiedBy")
  reportsGenerated    Report[]               @relation("ReportGeneratedBy")
  reportPrints        ReportPrintLog[]
  payments            Payment[]
  inventoryTransactions InventoryTransaction[]
  purchases           Purchase[]
  auditLogs           AuditLog[]

  @@index([role])
  @@index([status])
}

//
// PATIENT
//

model Patient {
  id            String   @id @default(uuid())
  patientNumber String   @unique

  firstName     String
  lastName      String?
  dateOfBirth   DateTime?
  gender        Gender   @default(UNKNOWN)

  phone         String?
  email         String?
  cnic          String?
  address       String?
  notes         String?

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  orders        LabOrder[]

  @@index([firstName, lastName])
  @@index([phone])
  @@index([cnic])
}

//
// TEST CATALOG
//

model TestCategory {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  isActive    Boolean  @default(true)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tests       Test[]
}

model Test {
  id                String   @id @default(uuid())
  code              String   @unique
  name              String
  description       String?

  categoryId        String
  category          TestCategory @relation(fields: [categoryId], references: [id])

  price             Decimal  @db.Decimal(12, 2)
  sampleType        String
  turnaroundMinutes Int?

  isActive          Boolean  @default(true)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  parameters        TestParameter[]
  orderItems        LabOrderItem[]
  results           Result[]

  @@index([categoryId])
  @@index([name])
  @@index([isActive])
}

model TestParameter {
  id          String   @id @default(uuid())

  testId      String
  test        Test     @relation(fields: [testId], references: [id], onDelete: Cascade)

  code        String
  name        String
  unit        String?
  dataType    DataType @default(TEXT)

  displayOrder Int

  isRequired  Boolean  @default(true)
  isActive    Boolean  @default(true)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  referenceRanges ReferenceRange[]
  resultValues    ResultValue[]

  @@unique([testId, code])
  @@index([testId])
}

model ReferenceRange {
  id          String   @id @default(uuid())

  parameterId String
  parameter   TestParameter @relation(fields: [parameterId], references: [id], onDelete: Cascade)

  gender      Gender?
  minAge      Decimal? @db.Decimal(8, 2)
  maxAge      Decimal? @db.Decimal(8, 2)

  minValue    Decimal? @db.Decimal(12, 4)
  maxValue    Decimal? @db.Decimal(12, 4)

  textValue   String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([parameterId])
}

//
// ORDERS
//

model LabOrder {
  id          String      @id @default(uuid())
  orderNumber String      @unique

  patientId   String
  patient     Patient     @relation(fields: [patientId], references: [id])

  status      OrderStatus @default(REGISTERED)

  createdById  String
  createdBy    UserProfile @relation("OrderCreatedBy", fields: [createdById], references: [id])

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  items        LabOrderItem[]
  samples      Sample[]
  results      Result[]
  invoice      Invoice?
  reports      Report[]

  @@index([patientId])
  @@index([status])
  @@index([createdAt])
}

model LabOrderItem {
  id          String   @id @default(uuid())

  orderId     String
  order       LabOrder @relation(fields: [orderId], references: [id], onDelete: Cascade)

  testId      String
  test        Test     @relation(fields: [testId], references: [id])

  quantity    Int      @default(1)

  unitPrice   Decimal  @db.Decimal(12, 2)
  discount    Decimal  @default(0) @db.Decimal(12, 2)
  total       Decimal  @db.Decimal(12, 2)

  createdAt   DateTime @default(now())

  @@index([orderId])
  @@index([testId])
}

//
// SAMPLES
//

model Sample {
  id          String       @id @default(uuid())
  sampleNumber String      @unique

  orderId     String
  order       LabOrder     @relation(fields: [orderId], references: [id], onDelete: Cascade)

  sampleType  String
  status      SampleStatus @default(PENDING)

  collectedAt DateTime?
  collectedById String?
  collectedBy UserProfile? @relation("SampleCollectedBy", fields: [collectedById], references: [id])

  receivedAt  DateTime?
  receivedById String?
  receivedBy  UserProfile? @relation("SampleReceivedBy", fields: [receivedById], references: [id])

  rejectionReason String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([orderId])
  @@index([status])
}

//
// RESULTS
//

model Result {
  id          String       @id @default(uuid())

  orderId     String
  order       LabOrder     @relation(fields: [orderId], references: [id], onDelete: Cascade)

  testId      String
  test        Test         @relation(fields: [testId], references: [id])

  status      ResultStatus @default(DRAFT)

  enteredById String?
  enteredBy  UserProfile? @relation("ResultEnteredBy", fields: [enteredById], references: [id])

  verifiedById String?
  verifiedBy UserProfile? @relation("ResultVerifiedBy", fields: [verifiedById], references: [id])

  submittedAt DateTime?
  verifiedAt  DateTime?

  rejectionReason String?
  verificationNote String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  values ResultValue[]

  @@unique([orderId, testId])
  @@index([status])
  @@index([orderId])
}

model ResultValue {
  id          String   @id @default(uuid())

  resultId    String
  result      Result   @relation(fields: [resultId], references: [id], onDelete: Cascade)

  parameterId String
  parameter   TestParameter @relation(fields: [parameterId], references: [id])

  value       String
  numericValue Decimal? @db.Decimal(16, 6)

  abnormalFlag AbnormalFlag @default(NONE)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([resultId, parameterId])
  @@index([resultId])
}

//
// BILLING
//

model Invoice {
  id            String        @id @default(uuid())
  invoiceNumber String        @unique

  orderId       String        @unique
  order         LabOrder      @relation(fields: [orderId], references: [id])

  subtotal      Decimal       @db.Decimal(12, 2)
  discount      Decimal       @default(0) @db.Decimal(12, 2)
  tax           Decimal       @default(0) @db.Decimal(12, 2)
  total         Decimal       @db.Decimal(12, 2)

  paidAmount    Decimal       @default(0) @db.Decimal(12, 2)
  balance       Decimal       @db.Decimal(12, 2)

  paymentStatus PaymentStatus @default(UNPAID)

  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  payments      Payment[]
}

model Payment {
  id          String        @id @default(uuid())

  invoiceId   String
  invoice     Invoice       @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  amount      Decimal       @db.Decimal(12, 2)
  method      PaymentMethod

  receivedById String
  receivedBy   UserProfile  @relation(fields: [receivedById], references: [id])

  notes       String?

  createdAt   DateTime      @default(now())

  @@index([invoiceId])
  @@index([createdAt])
}

//
// REPORTS
//

model Report {
  id           String       @id @default(uuid())
  reportNumber String       @unique

  orderId      String
  order        LabOrder     @relation(fields: [orderId], references: [id])

  status       ReportStatus @default(DRAFT)

  generatedById String?
  generatedBy UserProfile? @relation("ReportGeneratedBy", fields: [generatedById], references: [id])

  generatedAt DateTime?

  currentVersion Int @default(1)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  versions ReportVersion[]
  printLogs ReportPrintLog[]

  @@index([orderId])
  @@index([status])
}

model ReportVersion {
  id        String @id @default(uuid())

  reportId  String
  report    Report @relation(fields: [reportId], references: [id], onDelete: Cascade)

  version   Int
  filePath  String

  createdAt DateTime @default(now())

  @@unique([reportId, version])
}

model ReportPrintLog {
  id        String @id @default(uuid())

  reportId String
  report   Report @relation(fields: [reportId], references: [id], onDelete: Cascade)

  printedById String
  printedBy UserProfile @relation(fields: [printedById], references: [id])

  printedAt DateTime @default(now())

  @@index([reportId])
  @@index([printedAt])
}

//
// INVENTORY
//

model InventoryItem {
  id           String   @id @default(uuid())
  code         String   @unique

  name         String
  category     String?
  unit         String

  minimumStock Decimal  @default(0) @db.Decimal(12, 3)

  isActive     Boolean  @default(true)

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  batches      InventoryBatch[]
  transactions InventoryTransaction[]
}

model InventoryBatch {
  id          String   @id @default(uuid())

  itemId      String
  item        InventoryItem @relation(fields: [itemId], references: [id], onDelete: Cascade)

  batchNumber String
  expiryDate  DateTime?

  quantity    Decimal  @db.Decimal(12, 3)
  unitCost    Decimal  @db.Decimal(12, 2)

  supplierId  String?
  supplier    Supplier? @relation(fields: [supplierId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  transactions InventoryTransaction[]

  @@unique([itemId, batchNumber])
  @@index([expiryDate])
}

model InventoryTransaction {
  id          String   @id @default(uuid())

  itemId      String
  item        InventoryItem @relation(fields: [itemId], references: [id])

  batchId     String?
  batch       InventoryBatch? @relation(fields: [batchId], references: [id])

  type        InventoryTransactionType

  quantity    Decimal  @db.Decimal(12, 3)

  reason      String?

  createdById String
  createdBy   UserProfile @relation(fields: [createdById], references: [id])

  createdAt DateTime @default(now())

  @@index([itemId])
  @@index([batchId])
  @@index([type])
  @@index([createdAt])
}

//
// SUPPLIERS
//

model Supplier {
  id          String   @id @default(uuid())

  name        String
  contactName String?
  phone       String?
  email       String?
  address     String?
  notes       String?

  isActive    Boolean  @default(true)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  purchases  Purchase[]
  batches    InventoryBatch[]
}

//
// PURCHASES
//

model Purchase {
  id            String         @id @default(uuid())
  purchaseNumber String        @unique

  supplierId    String
  supplier      Supplier       @relation(fields: [supplierId], references: [id])

  status        PurchaseStatus @default(DRAFT)

  totalAmount   Decimal        @default(0) @db.Decimal(12, 2)

  createdById   String
  createdBy     UserProfile    @relation(fields: [createdById], references: [id])

  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  items         PurchaseItem[]
}

model PurchaseItem {
  id          String   @id @default(uuid())

  purchaseId  String
  purchase    Purchase @relation(fields: [purchaseId], references: [id], onDelete: Cascade)

  inventoryItemId String
  inventoryItem InventoryItem @relation(fields: [inventoryItemId], references: [id])

  batchNumber String
  expiryDate  DateTime?

  quantity    Decimal  @db.Decimal(12, 3)
  unitCost    Decimal  @db.Decimal(12, 2)
  total       Decimal  @db.Decimal(12, 2)

  @@index([purchaseId])
}

//
// ADMIN / CONFIGURATION
//

model ReportTemplate {
  id          String   @id @default(uuid())

  name        String
  description String?

  configuration Json

  isDefault   Boolean  @default(false)
  isActive    Boolean  @default(true)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model LabSettings {
  id          String   @id @default(uuid())

  labName     String
  logoPath    String?

  address     String?
  phone       String?
  email       String?
  website     String?

  currency    String   @default("PKR")

  patientPrefix String @default("PT-")
  orderPrefix   String @default("LAB-")
  invoicePrefix String @default("INV-")
  reportPrefix  String @default("REP-")
  samplePrefix  String @default("SMP-")

  requirePaymentBeforeReport Boolean @default(false)
  requireVerification         Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

//
// AUDIT
//

model AuditLog {
  id        String   @id @default(uuid())

  userId    String?
  user      UserProfile? @relation(fields: [userId], references: [id])

  action    String
  entity    String
  entityId  String?

  oldData   Json?
  newData   Json?

  createdAt DateTime @default(now())

  @@index([userId])
  @@index([action])
  @@index([entity])
  @@index([entityId])
  @@index([createdAt])
}