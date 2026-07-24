<div align="center">

# Credit Assessment AI

### A transparent, credential-free demonstration of human-reviewed lending decision support

A React and TypeScript application that converts applicant inputs and selected document categories into deterministic financial ratios, evidence-completeness signals and an explainable review recommendation.

`React` · `TypeScript` · `Vite` · `Deterministic calculations` · `Privacy by design`

</div>

---

## Evidence snapshot

| Area | Current public implementation |
|---|---|
| Runtime | Browser-only React application |
| External services | None |
| File handling | Local metadata only; file contents are not read or uploaded |
| Assessment logic | Transparent TypeScript calculations and rules |
| Outputs | Review-support recommendation, ratios, completeness, strengths and indicators |
| Decision boundary | No automated approval, decline or pricing |
| Build verification | GitHub Actions production build workflow |

## Relationship to Assess Swift AI

This repository is a deliberately sanitised public portfolio demonstration.

The private **Assess Swift AI** repository contains a substantially broader document-processing and infrastructure programme. This public project does **not** claim to reproduce its private backend, extraction providers, database, Storage, security controls or current pull-request stack.

Its purpose is to make the central workflow and responsible-decision boundary inspectable without exposing credentials, applicant data or private implementation details.

## Application flow

```text
Applicant financial inputs
        ↓
Local document selection
        ↓
Filename-based category suggestion
        ↓
User-confirmed evidence categories
        ↓
Deterministic financial calculations
        ↓
Transparent risk and completeness rules
        ↓
Human review recommendation + explanations
```

## Current assessment signals

The application calculates:

| Signal | Current calculation |
|---|---|
| Debt-to-income | Existing debt as a percentage of annual income |
| Monthly commitment ratio | Estimated repayment, existing-debt allowance and living expenses relative to monthly income |
| Loan-to-income | Requested amount divided by annual income |
| Document completeness | Weighted coverage of bank, income, identification, liability and other evidence categories |
| Estimated repayment | Amortising repayment using the demonstration interest-rate assumption |

The current public code returns one of three workflow recommendations:

- `Proceed to review`
- `Manual review recommended`
- `Additional information required`

These are triage labels for a reviewer, not credit decisions.

## Document privacy model

Selected files remain on the user's device. The application uses only:

- filename;
- size;
- declared browser MIME type;
- user-confirmed document category.

It does not:

- read document bytes;
- extract document text;
- send selected information to a server;
- connect to Supabase or another database;
- include production applicants or credentials.

Filename-based category inference is a convenience feature and can be corrected by the user.

## Why the logic is explicit

The assessment engine lives in [`src/assessment.ts`](src/assessment.ts). The formulas, category weights, thresholds and recommendation mapping are readable TypeScript rather than hidden behind a hosted model call.

That makes it possible to inspect:

- which inputs affect each output;
- the assumptions used in estimated repayments;
- why a risk indicator was added;
- which document categories are missing;
- why a case was routed to additional or manual review.

The values are demonstration rules, not independently validated lending policy.

## Local setup

```bash
git clone https://github.com/Lukeyone/credit-assessment-ai.git
cd credit-assessment-ai
npm install
npm run dev
```

Validate a production build:

```bash
npm run build
```

No environment file, API key or external account is required.

## Repository structure

```text
credit-assessment-ai/
├── .github/workflows/build.yml
├── docs/ARCHITECTURE.md
├── src/
│   ├── App.tsx
│   ├── assessment.ts
│   ├── index.css
│   └── main.tsx
├── SECURITY.md
├── package.json
└── README.md
```

## Responsible use

This repository is an educational and portfolio demonstration. It must not be used to approve, decline, price or otherwise determine a real credit application.

A production system would require, at minimum:

- approved lending policy and independently validated calculations;
- legal and regulatory review;
- adverse-action and explanation processes;
- bias and fairness testing;
- secure identity, access, storage, retention and audit controls;
- representative evaluation data;
- monitoring, incident response and change governance;
- authorised human decision makers.

## Verified limitations

- The repayment interest rate and existing-debt payment allowance are demonstration assumptions.
- Filename inference is not document classification.
- Completeness measures category coverage, not authenticity or evidentiary quality.
- The rule thresholds are not approved lender policy.
- There is no backend, persistent account or document-processing service.
- The current build workflow validates compilation, not complete behavioural correctness.

## Portfolio context

This public project demonstrates:

- translating a sensitive commercial workflow into a safe public artefact;
- deterministic financial and completeness calculations;
- explainable review-oriented output;
- privacy-preserving local file handling;
- React/TypeScript interface engineering;
- explicit separation between decision support and consequential decisions.

## Author

**Lachlan McDonald**  
Applied AI & Machine Learning Engineer · Software Engineer

[Portfolio](https://lukeyone.github.io) · [LinkedIn](https://www.linkedin.com/in/lachlanmcdonaldtech) · [Email](mailto:lachlanmcdonald2000@gmail.com)
