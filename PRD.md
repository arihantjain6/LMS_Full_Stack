# Loan Management System (LMS) — Product Requirements Document

## Overview

The Loan Management System (LMS) is a fintech-style lending platform where borrowers can apply for loans and internal operations teams manage those loans throughout their lifecycle.

The platform consists of:

1. Borrower Portal
2. Operations Dashboard

The system must support:

* authentication
* role-based authorization
* business rule validation
* document uploads
* loan lifecycle management
* payment collection
* automated loan closure

---

# Goals

The primary goals of the system are:

* Allow borrowers to apply for loans digitally
* Validate borrower eligibility using server-side business rules
* Enable internal teams to process loans through operational stages
* Maintain strict role-based access control
* Track repayments and automatically close completed loans

---

# Tech Stack

## Backend

* Bun
* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose

## Authentication & Security

* JWT Authentication
* bcrypt password hashing
* RBAC middleware
* helmet
* cors

## Validation

* Zod

## Uploads

* multer

---

# User Roles

The system supports the following roles:

| Role         | Description                         |
| ------------ | ----------------------------------- |
| ADMIN        | Full access to all modules          |
| BORROWER     | Can apply for loans                 |
| SALES        | Handles leads/pre-application users |
| SANCTION     | Approves or rejects loans           |
| DISBURSEMENT | Marks approved loans as disbursed   |
| COLLECTION   | Records repayments                  |

---

# Borrower Journey

## Step 1 — Authentication

Borrowers can:

* register
* login
* access protected routes

Requirements:

* passwords must be hashed
* JWT-based authentication required
* protected APIs must reject unauthorized users

---

## Step 2 — Personal Details + BRE

Borrower submits:

* fullName
* PAN
* dateOfBirth
* monthlySalary
* employmentMode

Employment modes:

* SALARIED
* SELF_EMPLOYED
* UNEMPLOYED

---

# Business Rule Engine (BRE)

BRE validation must run on the server.

Application must be rejected if:

* age < 23
* age > 50
* salary < 25000
* employmentMode is UNEMPLOYED
* invalid PAN

---

# PAN Validation

Use Indian PAN regex:

```regex id="r1nwmf"
^[A-Z]{5}[0-9]{4}[A-Z]{1}$
```

Example:

```txt id="1mkjys"
ABCDE1234F
```

---

## Step 3 — Salary Slip Upload

Borrower uploads:

* PDF
* JPG
* PNG

Constraints:

* max 5MB

Uploaded files should:

* be stored locally
* NOT be stored directly inside MongoDB

Only store:

* file path
* file metadata

---

## Step 4 — Loan Application

Borrower selects:

* loanAmount
* tenureDays

Constraints:

* amount between 50,000 and 500,000
* tenure between 30 and 365 days

Interest rate:

* fixed 12% p.a.

---

# Loan Calculation

Use Simple Interest:

```txt id="q0x0j7"
SI = (P × R × T) / (365 × 100)
```

Where:

* P = principal
* R = rate
* T = tenure in days

System must calculate:

* interestAmount
* totalRepayment
* outstandingAmount

---

# Loan Lifecycle

The system should support controlled loan state transitions.

## Recommended Statuses

```txt id="f0qg0n"
LEAD
APPLIED
SANCTIONED
REJECTED
DISBURSED
CLOSED
```

---

# Status Flow

```txt id="5wsv8v"
LEAD
  ↓
APPLIED
  ↓
SANCTIONED
  ↓
DISBURSED
  ↓
CLOSED
```

Alternative path:

```txt id="u1b67l"
APPLIED
  ↓
REJECTED
```

---

# Important Lifecycle Rules

* only APPLIED loans can be sanctioned
* only SANCTIONED loans can be disbursed
* REJECTED loans cannot move further
* CLOSED loans cannot accept payments
* arbitrary status changes are forbidden

---

# Operations Dashboard

The dashboard consists of four operational modules.

---

# SALES Module

Purpose:

* track leads
* track registered users without applications

Access:

* SALES role
* ADMIN role

---

# SANCTION Module

Purpose:

* review loan applications

Actions:

* approve loan
* reject loan
* add rejection reason

Visible loans:

* APPLIED only

Access:

* SANCTION role
* ADMIN role

---

# DISBURSEMENT Module

Purpose:

* release approved loan funds

Actions:

* mark loan as disbursed

Visible loans:

* SANCTIONED only

Access:

* DISBURSEMENT role
* ADMIN role

---

# COLLECTION Module

Purpose:

* track repayments
* record borrower payments

Actions:

* add payment
* track outstanding balance

Visible loans:

* DISBURSED loans

Access:

* COLLECTION role
* ADMIN role

---

# Payment Rules

Each payment must include:

* UTR number
* amount
* paymentDate

---

# UTR Requirements

UTR must:

* be globally unique
* reject duplicates

---

# Payment Validation

Prevent:

* negative payments
* zero-value payments
* overpayments

Outstanding balance formula:

```txt id="t7rgrj"
outstandingAmount = totalRepayment - totalPaid
```

When:

```txt id="eqh0x9"
outstandingAmount <= 0
```

Then:

* automatically mark loan as CLOSED

---

# Database Collections

Expected collections:

## users

Stores:

* authentication data
* role information

## loans

Stores:

* borrower details
* loan configuration
* lifecycle status
* repayment details

## payments

Stores:

* repayment transactions

Optional:

* documents
* audit logs

---

# RBAC Requirements

RBAC must be enforced on:

* frontend
* backend

Backend enforcement is mandatory.

Unauthorized requests must return:

* 401 Unauthorized
* 403 Forbidden

---

# Security Requirements

The backend must implement:

* JWT authentication
* bcrypt password hashing
* RBAC middleware
* request validation
* centralized error handling
* secure file upload validation
* protected routes

---

# API Design

The backend should expose REST APIs for:

* authentication
* loans
* payments
* uploads
* dashboard operations

APIs should:

* use proper HTTP methods
* use consistent response structure
* use proper status codes

---

# Seed Data

The system must include a seed script that creates:

| Role         | Email                                                 |
| ------------ | ----------------------------------------------------- |
| ADMIN        | [admin@test.com](mailto:admin@test.com)               |
| SALES        | [sales@test.com](mailto:sales@test.com)               |
| SANCTION     | [sanction@test.com](mailto:sanction@test.com)         |
| DISBURSEMENT | [disbursement@test.com](mailto:disbursement@test.com) |
| COLLECTION   | [collection@test.com](mailto:collection@test.com)     |
| BORROWER     | [borrower@test.com](mailto:borrower@test.com)         |

Password for all accounts:

```txt id="e9frtl"
Password@123
```

---

# Engineering Expectations

The project should follow:

* Clean Architecture
* SOLID principles
* DRY principles
* strict TypeScript
* modular architecture
* reusable services
* reusable middleware
* scalable folder structure

---

# Non-Functional Requirements

The system should be:

* maintainable
* scalable
* type-safe
* secure
* easy to understand
* production-oriented

Avoid:

* massive controller files
* duplicated logic
* weak typing
* insecure route handling
* business logic inside routes

---

# Suggested Backend Structure

```txt id="n09q6c"
src/
│
├── config/
├── constants/
├── middleware/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── loans/
│   ├── payments/
│   └── uploads/
│
├── repositories/
├── services/
├── utils/
├── validators/
├── types/
├── app.ts
└── server.ts
```

---

# Final Notes

This project should prioritize:

1. correct end-to-end workflow
2. strong backend architecture
3. secure RBAC implementation
4. proper lifecycle management
5. maintainable TypeScript code

A complete, stable implementation is preferred over partially implemented advanced features.