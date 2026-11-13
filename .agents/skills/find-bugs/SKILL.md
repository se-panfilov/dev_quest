---
name: find-bugs
description: Find bugs, security vulnerabilities, and code quality issues in local branch changes. Use when asked to review changes, find bugs, security review, or audit code on the current branch.
---

<!-- Adapted for this repository from getsentry/skills at d12f250460ffd961f549dbebf7eeb0cf4afd4c2e. -->

# Find Bugs

## Project integration

Read [AGENTS.md](../../../AGENTS.md) before you apply the text below. AGENTS.md wins over this skill.
Talk, ask, and report in Russian by [docs/WRITING.md](../../../docs/WRITING.md). English terms are allowed.
If the user is the learner, find the learner level first (see AGENTS.md). This skill grants no level and no permission.
This skill is read-only. Do not edit files, commit, push, or post PR comments.
If `gh` is not available or not authenticated, use `git diff origin/master...HEAD`, or the PR base when it differs.
Apply the web, server, and database items only to code that has those surfaces.

The learner level changes the report:

- 🤖 Explainer: give the file, the line, and what to check. Do not write the **Fix** field. Write a guiding question or a topic link instead.
- 🤝 Partner and 🚀 Agent: the **Fix** field is allowed. The learner decides what to fix.

Also check each changed file for these items:

* [ ] **Outside data** (`fetch`, `localStorage`, JSON, forms): validated at run time. TypeScript types prove nothing at run time.
* [ ] **DOM**: no `innerHTML` or `v-html` with user or server data. URLs from data are checked before `href` and `src`.
* [ ] **Server and database**: SQL only with parameters. Passwords only as a hash. No secrets in code or in the browser.
* [ ] **External effects**: no download, paid API call, data transfer, or publication without an explicit request.
* [ ] **Tests**: exercise tests are not changed. Checks are not weakened.

## Upstream workflow

Review changes on this branch for bugs, security vulnerabilities, and code quality issues.

## Phase 1: Complete Input Gathering

1. Get the FULL diff: `git diff $(gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name')...HEAD`
2. If output is truncated, read each changed file individually until you have seen every changed line
3. List all files modified in this branch before proceeding

## Phase 2: Attack Surface Mapping

For each changed file, identify and list:

* All user inputs (request params, headers, body, URL components)
* All database queries
* All authentication/authorization checks
* All session/state operations
* All external calls
* All cryptographic operations

## Phase 3: Security Checklist (check EVERY item for EVERY file)

* [ ] **Injection**: SQL, command, template, header injection
* [ ] **XSS**: All outputs in templates properly escaped?
* [ ] **Authentication**: Auth checks on all protected operations?
* [ ] **Authorization/IDOR**: Access control verified, not just auth?
* [ ] **CSRF**: State-changing operations protected?
* [ ] **Race conditions**: TOCTOU in any read-then-write patterns?
* [ ] **Session**: Fixation, expiration, secure flags?
* [ ] **Cryptography**: Secure random, proper algorithms, no secrets in logs?
* [ ] **Information disclosure**: Error messages, logs, timing attacks?
* [ ] **DoS**: Unbounded operations, missing rate limits, resource exhaustion?
* [ ] **Business logic**: Edge cases, state machine violations, numeric overflow?

## Phase 4: Verification

For each potential issue:

* Check if it's already handled elsewhere in the changed code
* Search for existing tests covering the scenario
* Read surrounding context to verify the issue is real

## Phase 5: Pre-Conclusion Audit

Before finalizing, you MUST:

1. List every file you reviewed and confirm you read it completely
2. List every checklist item and note whether you found issues or confirmed it's clean
3. List any areas you could NOT fully verify and why
4. Only then provide your final findings

## Output Format

**Prioritize**: security vulnerabilities > bugs > code quality

**Skip**: stylistic/formatting issues

For each issue:

* **File:Line** - Brief description
* **Severity**: Critical/High/Medium/Low
* **Problem**: What's wrong
* **Evidence**: Why this is real (not already fixed, no existing test, etc.)
* **Fix**: Concrete suggestion
* **References**: OWASP, RFCs, or other standards if applicable

If you find nothing significant, say so - don't invent issues.

Do not make changes - just report findings. I'll decide what to address.
