# Security Policy

## Credential-Free Public Repository

This public portfolio repository is intentionally self-contained and does not require external service credentials.

Do not commit:

- Environment files such as `.env` or `.env.local`
- API tokens or provider credentials
- Database passwords or connection strings
- Supabase service-role values
- Private certificates or signing material
- Service-account JSON files
- Real customer, applicant or financial documents

## Local File Handling

The demonstration reads only browser-provided file metadata such as filename, file type and size. It does not read document contents, upload files or transmit applicant information.

## Adding External Services

A future production implementation must keep all privileged values on a trusted server or managed secret store. Browser-prefixed configuration must never contain privileged credentials.

Each developer or deployer must create and configure their own external-service accounts. No shared credentials are supplied by this repository.

## Before Committing

Review staged changes:

```bash
git status
git diff --cached
```

Search for accidental secrets with a dedicated scanner before publishing.

## Reporting a Security Issue

Report suspected credential exposure privately to `lachornot@gmail.com`. Do not publish an active credential or private applicant information in a GitHub issue.
