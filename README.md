<div align="center">

# Credit Assessment AI

### A privacy-first portfolio demonstration of intelligent loan assessment

A credential-free React application that demonstrates document intake,
serviceability analysis, risk indicators and explainable assessment output.

`React` · `TypeScript` · `Vite` · `Financial Workflow Design` · `Privacy by Design`

</div>

---

## Overview

**Credit Assessment AI** demonstrates how a lender-facing application can turn applicant information and document completeness into a structured, review-ready assessment.

The public application is deliberately self-contained. It does not connect to a production database, AI provider, storage bucket or customer system. Instead, it uses transparent local calculations so recruiters and reviewers can inspect the full decision flow without requiring shared credentials.

The workflow includes:

- Applicant and loan data entry
- Local document selection and categorisation
- Document-completeness checks
- Debt-to-income and monthly-commitment calculations
- Explainable risk indicators
- A structured review recommendation
- Privacy and responsible-use safeguards

## Why This Public Version Is Different

The original internal prototype explored AI-assisted extraction and assessment workflows. This public repository is a sanitised portfolio release designed to prevent credential or customer-data exposure.

It therefore:

- Requires no API tokens
- Requires no environment configuration
- Contains no Supabase project identifiers
- Contains no Google or AI-provider credentials
- Does not upload selected files
- Does not read document contents
- Contains no production applicant records
- Uses fresh Git history unrelated to the private development repository

## Application Flow

```text
Applicant details
      ↓
Local document selection
      ↓
Document category coverage
      ↓
Financial ratio calculations
      ↓
Transparent risk rules
      ↓
Review recommendation and explanations
```

## Assessment Signals

| Signal | Purpose |
|---|---|
| Debt-to-income ratio | Compares existing debt with annual income |
| Monthly commitment ratio | Estimates the share of monthly income committed to debt servicing |
| Loan-to-income ratio | Provides context for the requested amount |
| Document completeness | Checks whether core evidence categories have been selected |
| Review indicators | Explains which factors increased or reduced review risk |

The output is designed as **decision support**, not an automated credit decision.

## Privacy Model

Selected files remain on the user's device. The browser exposes only basic metadata to the application:

- Filename
- File size
- File type
- User-selected category

The application does not read file contents or send information over a network.

## Project Structure

```text
credit-assessment-ai/
├── docs/
│   └── ARCHITECTURE.md
├── src/
│   ├── App.tsx
│   ├── assessment.ts
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── SECURITY.md
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Lukeyone/credit-assessment-ai.git
cd credit-assessment-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open the local URL shown by Vite.

### 4. Validate a production build

```bash
npm run build
```

No environment file or external account is required.

## Responsible Use

This project is an educational and portfolio demonstration. It must not be used to approve, decline or price real credit applications.

A production system would require, at minimum:

- Independently validated risk models
- Regulatory and legal review
- Human oversight
- Bias and fairness testing
- Adverse-action and explanation processes
- Secure document storage and retention controls
- Identity, access and audit controls
- Model monitoring and change governance

## Planned Improvements

- Add automated tests for the assessment engine
- Add accessibility testing
- Add downloadable demonstration reports
- Add synthetic test scenarios
- Add a documented production threat model
- Add a secure backend reference architecture without shared credentials

## Background

This portfolio project represents experience designing AI-assisted credit assessment workflows, including document intake, anomaly-oriented review, structured summaries and privacy-conscious processing.

The public repository focuses on the workflow and engineering decisions while deliberately excluding operational credentials, production infrastructure and real applicant information.

## Author

**Lachlan McDonald**  
Applied AI Engineer · Software Engineer · Data Scientist

[LinkedIn](https://www.linkedin.com/in/lachlanmcdonaldtech) · [Email](mailto:lachornot@gmail.com)
