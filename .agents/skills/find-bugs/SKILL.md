---
name: find-bugs
description: Find bugs, security vulnerabilities, and code quality issues in local branch changes. Use when asked to review changes, find bugs, security review, or audit code on the current branch.
---

<!-- Adapted for this repository from getsentry/skills at d12f250460ffd961f549dbebf7eeb0cf4afd4c2e. -->

# Find Bugs

## Project integration

Прочитай [AGENTS.md](../../../AGENTS.md) до того, как применять текст ниже. Правила AGENTS.md важнее этого skill.
Отвечай, задавай вопросы и пиши отчёт на русском по [правилам письма](../../../docs/WRITING.md). Английские термины допустимы.
Если перед тобой ученик, сначала определи его уровень ИИ по AGENTS.md. Skill не повышает уровень и не даёт новых прав.
Skill только читает. Не правь файлы, не делай commit и push, не пиши комментарии в PR.
Если `gh` нет или он не авторизован, бери `git diff origin/master...HEAD` или базу PR, если она другая.
Пункты про веб, сервер и базу данных применяй только к коду, где они есть.

Уровень ученика меняет формат отчёта:

- 🤖 ИИ-объяснитель: назови файл, строку и что проверить. Поле **Fix** не пиши, вместо него — наводящий вопрос или ссылка на тему.
- 🤝 ИИ-напарник и выше: поле **Fix** можно писать. Ученик сам решает, что исправлять.
- 🔒 Без ИИ: skill не применяй.

Дополнительно проверь в каждом изменённом файле:

* [ ] **Данные снаружи** (`fetch`, `localStorage`, JSON, формы): проверяются во время работы программы. Тип в TypeScript ничего не гарантирует.
* [ ] **DOM**: нет `innerHTML` и `v-html` с данными пользователя или сервера. URL из данных проверены перед `href` и `src`.
* [ ] **Сервер и база**: SQL только с параметрами. Пароли только как hash. Секреты не в коде и не в браузере.
* [ ] **Внешние действия**: нет загрузок, платных API, отправки данных и публикации без явной просьбы.
* [ ] **Тесты**: тесты упражнений не изменены. Новые проверки не ослаблены.

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
