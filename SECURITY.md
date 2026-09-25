# Security Policy

## Supported Versions

Security fixes target the latest code on the default branch. Older releases
and other branches may not receive security updates.

## Reporting a Vulnerability

Do not publish vulnerability details in public issues, discussions, or pull
requests. Use this repository's
[private vulnerability reporting](https://github.com/fatmakahveci/react-expense-tracker/security/advisories/new)
when available.

If private reporting is unavailable, check the
[maintainer's GitHub profile](https://github.com/fatmakahveci) for a private
contact method. If none is listed, open an issue requesting a private reporting
channel without including vulnerability details.

Please include:

- The affected version or commit and component.
- Reproduction steps and a minimal example using synthetic expense data.
- Expected and actual behavior, along with the potential impact.
- Relevant browser and operating system versions.
- A suggested mitigation, if known.

Do not include real financial records, passwords, tokens, or other sensitive
information. Test only against your own local instance or systems you have
permission to assess.

## Review and Disclosure

Reports will be reviewed as maintainer availability permits. No fixed response
or resolution time is guaranteed. Please coordinate public disclosure with the
maintainer so a fix or mitigation can be prepared first.

## Expense Data and Security Boundaries

The current application stores expense records in browser local storage. It
does not provide user accounts, server-side expense storage, or a backup
service. The application does not encrypt these records before storing them.
People with access to the same browser profile and scripts running on the same
origin may be able to read them. Avoid using a shared browser profile for
sensitive financial information.

CSV exports contain expense titles, amounts, and dates in plain text. Store
and share exported files carefully. The export function quotes fields and
neutralizes common spreadsheet formula prefixes, but exported files should
still be handled as potentially sensitive data.

Saved data is validated when loaded. If saved records are invalid, the
application leaves the stored value untouched and warns that changes are
temporary. Writes use Web Locks to avoid lost updates between tabs; browsers
without this API use temporary changes only. Migration retains the original
`expense-tracker:v1` data alongside the new `expense-tracker:v2` records, so
clearing expense data requires removing both keys. Clearing browser data can remove records; export a backup first.

## Deployment and Dependencies

The Next.js server sends `frame-ancestors 'none'` and `X-Frame-Options: DENY`
to block framing, `nosniff` to prevent MIME sniffing, and a `no-referrer` policy.
The CSP also restricts object embedding, base URLs, and form destinations.
It does not restrict script execution and should not be treated as a complete
XSS defense. Expense titles are rendered as text through React.

CSV protection checks compatibility-normalized prefixes, including full-width
formula characters, while preserving the original cell text. Spreadsheet
applications can reinterpret files after saving and reopening; no CSV escaping
strategy guarantees safety across every consumer. See the
[OWASP CSV injection guidance](https://community.owasp.org/attacks/CSV_Injection).

CI runs `npm audit --audit-level=low`, and Dependabot checks npm dependencies
daily. A clean audit reports known advisories available at the time of the check;
it does not prove that all vulnerabilities have been eliminated.

When deploying your own instance, use HTTPS, keep dependencies updated, and
review security advisories affecting the versions you run. Do not commit
credentials or private expense data to this repository, or expose secrets in
client-side code.

## Pending Upstream Security Release

As of September 25, 2026, the project uses Next.js 16.3.6, the latest published
stable release checked in npm. Next.js has announced a September 30 security
release targeting 16.3.7. Upgrade and rerun the checks when that patch is
published; the upcoming advisories have not yet disclosed affected versions
or impact details sufficient to assess this application. See the
[official announcement](https://nextjs.org/blog/upcoming-nextjs-security-release-september-2026).
