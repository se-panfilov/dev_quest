---
name: code-standards
description: Code standards for learner projects and the template. Use before you write, suggest, or review code in projects/, exercises/, or hub/.
---

# Code standards

Adapted from se-panfilov/modern_monorepo_template for a learning repository.
Read [AGENTS.md](../../../AGENTS.md). The learner level decides *who* writes code. This skill decides *how* the code looks.
Use the same standard when you explain or review learner code: show the standard way and say why.

## Stack per world

Take the stack from the quest and from the project `package.json`. Do not add a tool that the quest does not name, unless the learner asks and the mentor agrees.

| Worlds | Stack | Tests |
| --- | --- | --- |
| 1–4 and `hub/` | HTML, CSS, JavaScript, no build | `node --test` |
| 5 | npm, Vite, TypeScript | `node --test`, or Vitest if the quest names it |
| 6 | Vue 3 + TypeScript, Vue Router | Vitest and `@vue/test-utils` if the project has them |
| 7 | Node.js: `node:http`, `node:fs`, `node:sqlite` | `node --test` |
| 8 | The stack from the project plan | Same |

## General

- Follow `.editorconfig` and the [Prettier config](../../../configs/prettier.config.mjs). Edit source, not generated output.
- Names of variables, functions, and files: English and clear (`score`, `loadQuestions`, `isGameOver`).
- Code comments: Russian. A comment tells *why*, not *what*.
- One function does one job. Keep logic apart from the DOM and the UI, so tests can reach it.
- Use built-ins first: Web APIs in the browser; `node:fs`, `node:path`, `node:crypto` in Node.js.
- Add a dependency only when it clearly helps. State the reason, the license, and the size. Pin the exact version (`npm install --save-exact`). Commit `package-lock.json`.
- Do not change a test to make it pass. Change the code, or report the test defect.

## TypeScript (world 5 and later)

- `strict: true` in `tsconfig.json`. No `any` (the quest forbids it). Unknown type: use `unknown` and check it.
- Check types in a separate step: `tsc --noEmit` or `vue-tsc --noEmit`. Vite removes types but does not check them.
- Validate data from outside (`fetch`, `localStorage`, JSON files, forms) at run time. Types do not prove that data is valid.

## Vue (world 6 and later)

- Composition API with `<script setup lang="ts">`.
- Keep game and data logic in plain `.ts` modules. Components show state and send user actions.
- Do not render user or server data with `v-html`. Check URLs from data before `href` and `src`.

## Server and database (world 7 and later)

- Validate the request body: type, required fields, size limit. A bad request gets `400`, the server does not crash.
- SQL only with parameters (`?`). Never build a query string from user data.
- Store passwords only as a hash (`node:crypto` `scrypt`). Never store plain passwords.
- Secrets go to environment variables and a `.env` file that is in `.gitignore`. Not in code, logs, or the browser.
- Server errors do not show internals to the user: stack traces, SQL, file paths.
- Start external programs with an argument array. No `shell: true`, no command strings built from data.

## Before handover

1. Run the project tests. Run `typecheck`, `lint`, and `build` scripts if they exist.
2. Open the result in the browser, or send a request to the server, and check that it works.
3. Read the whole diff.
4. Report in Russian: what changed, what you ran, what you did not check. Do not present an unchecked result as checked.
