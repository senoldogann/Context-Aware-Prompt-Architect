# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public issue. Instead, please email the maintainers directly or create a private security advisory on GitHub.

### What to Include

When reporting a vulnerability, please include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

### Response Time

We aim to respond to security reports within 48 hours and provide an initial assessment within 7 days.

## Security Best Practices

This application processes prompts locally using Ollama. However, please be aware:

- **Local Processing**: All AI processing happens locally on your machine
- **No Data Transmission**: Your prompts and code are never sent to external servers (except your local Ollama instance)
- **Project Files**: The application reads your project structure for context, but never modifies or transmits your code
- **Ollama Connection**: Ensure your Ollama instance is properly secured if exposed on a network

## Privacy

- All data stays on your local machine
- No telemetry or analytics are collected
- No external API calls (except to your local Ollama instance)
- Project analysis is performed locally

