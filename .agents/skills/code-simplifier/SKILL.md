---
name: code-simplifier
description: Simplify code for readability while preserving behavior and security. Use for requested refactoring or cleanup of recently changed code.
license: Apache-2.0
metadata:
  upstream-source: getsentry/skills
  upstream-revision: d12f250460ffd961f549dbebf7eeb0cf4afd4c2e
---

<!--
Adapted for this repository from Sentry's code-simplifier skill:
https://github.com/getsentry/skills/blob/d12f250460ffd961f549dbebf7eeb0cf4afd4c2e/skills/code-simplifier/SKILL.md
The upstream skill is based on Anthropic's code-simplifier agent:
https://github.com/anthropics/claude-plugins-official/blob/main/plugins/code-simplifier/agents/code-simplifier.md
The text follows the adaptation in se-panfilov/modern_monorepo_template, changed for a learning repository.
-->

# Simplify code

Read [AGENTS.md](../../../AGENTS.md) and [code-standards](../code-standards/SKILL.md). Talk in Russian.
This skill grants no permission to change data, Git history, or external services.

## Learner level

- 🤖 Explainer: do not rewrite the code. Name one place to simplify and ask how the learner would do it.
- 🤝 Partner: suggest one simplification at a time as "before → after → why better". The learner edits, or you edit after agreement.
- 🚀 Agent: you can edit. Then explain each edit.

## Scope

Simplify only the selected files or the code changed in the current task. Do not turn a cleanup into a repository-wide refactor.
Do not touch unrelated changes, generated output (`dist/`), exercise tests, or learner data.

## Preserve behavior

- Keep public functions, their arguments and return values, output order, and screen texts.
- Tests stay green without test changes.
- Keep input checks, escaping of text in the DOM and Vue templates, and size limits.
- Do not remove `try`/`catch`/`finally` only to reduce nesting. Keep error handling and cleanup.
- Keep comments that explain a non-obvious rule or limit.

## Improve readability

- Prefer an explicit `if` to nested ternaries and dense expressions.
- Use clear English names: `score`, `isAnswerCorrect`, not `s`, `flag2`.
- Use early returns only when cleanup and error handling stay correct.
- Remove an abstraction only when the code becomes clearer.
- Do not add a dependency, framework, or build step for looks.
- Clarity beats fewer lines.

## Verify

1. Name the behavior that the change touches.
2. Make the smallest useful change.
3. Read the whole diff, error paths included.
4. Run existing checks: `node --test`; in projects with `package.json`, also `test`, `build`, `lint`, and `typecheck` if they exist.
5. If you find a defect, report it and suggest a test.
6. Report in Russian: what you simplified, what you ran, what you did not check.
