# Security Policy

Thank you for helping improve the security of this project.

We take security vulnerabilities seriously and appreciate responsible disclosure from the community.

---

## Supported Versions

The following versions are currently supported with security updates.

| Version | Supported |
| -------- | --------- |
| Latest `main` | ✅ |
| Older versions | ❌ |

Always use the latest version of the project.

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub Issues.**

Instead, report them privately by one of the following methods:

- GitHub Security Advisory (preferred)
- Email the project maintainer (if available)

Include as much information as possible:

- Description of the vulnerability
- Steps to reproduce
- Proof of Concept (if applicable)
- Affected files, endpoints, or components
- Potential impact
- Suggested remediation (optional)

---

## Response Process

After receiving a report:

1. We acknowledge receipt within **48 hours**.
2. We investigate the issue.
3. We determine severity and impact.
4. A fix is developed and tested.
5. A security release is published.
6. Credit is given to the reporter (if requested).

---

## Disclosure Policy

Please allow reasonable time for investigation and remediation before publicly disclosing a vulnerability.

Coordinated disclosure helps protect users of the project.

---

## Scope

Examples of vulnerabilities that should be reported include:

- Authentication bypass
- Authorization issues
- Remote Code Execution (RCE)
- Command Injection
- SQL Injection
- Cross-Site Scripting (XSS)
- Server-Side Request Forgery (SSRF)
- Path Traversal
- Deserialization vulnerabilities
- Privilege Escalation
- Sensitive Information Disclosure
- Insecure Defaults
- Cryptographic weaknesses
- Dependency vulnerabilities with security impact

---

## Out of Scope

The following are generally not considered security vulnerabilities:

- Missing security headers without exploitability
- Rate limiting recommendations
- Clickjacking on non-sensitive pages
- Best practice suggestions without security impact
- Denial-of-Service requiring unrealistic resources
- Vulnerabilities in unsupported versions
- Issues caused solely by third-party software outside this project

---

## Security Best Practices

Users are encouraged to:

- Keep dependencies updated.
- Protect secrets using environment variables.
- Never commit API keys or credentials.
- Run dependency vulnerability scans regularly.
- Enable branch protection for production repositories.
- Apply the principle of least privilege.
- Review pull requests before merging.

---

## Security Updates

Security fixes will be released as soon as reasonably possible.

Critical vulnerabilities may result in immediate patch releases.

---

## Acknowledgements

We appreciate responsible security researchers who help improve this project through coordinated vulnerability disclosure.

Thank you for helping keep this project secure.
