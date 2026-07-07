# Architecture

## Public Demonstration

The public application runs entirely in the browser:

```text
React user interface
        ↓
Local form state
        ↓
File metadata only
        ↓
Pure TypeScript assessment engine
        ↓
Explainable result view
```

No network request is required for the assessment workflow.

## Security Boundary

The browser application is intentionally untrusted and contains no privileged configuration. Any future integration with AI models, storage or customer systems must be placed behind a server-side boundary.

```text
Browser
  └── public application configuration only

Trusted backend
  ├── authentication and authorisation
  ├── document validation and malware scanning
  ├── encrypted object storage
  ├── audit logging
  ├── model-provider calls
  ├── database access
  └── secrets supplied by managed secret storage
```

## Production Principles

1. Never place privileged credentials in browser-delivered code.
2. Use short-lived, scoped authorisation for document upload and download.
3. Separate personally identifiable information from derived assessment data.
4. Encrypt data in transit and at rest.
5. Define retention and deletion policies before accepting documents.
6. Require authenticated human review for consequential decisions.
7. Record model version, input provenance and reviewer actions.
8. Test for security, fairness, explainability and operational failure modes.

## Demonstration Logic

The local engine uses transparent calculations rather than a hidden model. This makes every signal inspectable and prevents the portfolio demonstration from being mistaken for a production credit model.
