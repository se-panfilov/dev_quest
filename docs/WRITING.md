# Writing rules

Rules for agents that write text in this repository or talk to the learner.
The base is [ASD-STE100, Issue 9](https://www.asd-ste100.org/) (Simplified Technical English).
Agent instructions use it in English. Russian texts use its structure rules, not its dictionary.

## Language

| What | Language |
| --- | --- |
| Talk with the learner and the mentor, agent questions and answers | Russian |
| Documentation, READMEs, agent reports, code comments | Russian |
| Commits, PR titles and descriptions | Russian |
| Agent instructions: `AGENTS.md`, skills, adapters, this file | English |
| Code identifiers, file names, branch names | English (ASCII) |
| Terms: `commit`, `pull request`, `props`, `callback` | English is allowed, as is |
| Commands, paths, identifiers, UI labels, license text | Exact, as in the source |

- English text for the learner, other than terms: A2 level. Short phrases, common words, no idioms. "Read the error message" is fine. "Let's dig into this gnarly edge case" is not.
- The learner can write in Dutch or use Dutch words. Understand it and answer in Russian. You can use a Dutch word if the learner uses it or if it helps.
- Explain a new English term the first time, in one Russian sentence: «`props` — входные данные компонента».
- For the learner, explain simply, as to a person aged 12–14: short sentences, everyday comparisons, one new term at a time. Simple is not childish.

## Structure (English and Russian)

1. Use one term for one concept. Do not call one thing "quest", "task", and "exercise" in one text.
2. Put one instruction in one sentence.
3. Use the imperative and the active voice for instructions.
4. Put a condition before the instruction: "If the tests are red, read the first error."
5. Put a data-loss caution before the action.
6. Keep instruction sentences to 20 words and descriptive sentences to 25 words.
7. Keep paragraphs to six sentences.
8. Do not use semicolons in prose.
9. Use tables for comparisons and mappings.
10. Keep text consistent with real behavior: defaults, prompts, errors.

## Status marks

In mentor and template documents, mark the status of each statement that is not a plain fact.

| English | Russian | Meaning |
| --- | --- | --- |
| **Draft** | **Черновик** | Can change without a human decision |
| **Proposed** | **Предложение** | A recommendation, not accepted |
| **Accepted** | **Принято** | A human decided |
| **Assumption** | **Допущение** | Not verified. Say how to verify |
| **Verified** | **Проверено** | Confirmed by a test or a primary source. Name it |

## Licenses and prices

When you name a tool, a library, or a model, give its license.
Do not call software "open source" when its license restricts use. Name the license.
Give a price only with the date of the check.

## PR descriptions

- Start with `## tl;dr`: one or two short paragraphs in plain Russian. Explain any technical term.
- Then: what changed, what you checked and how, what you did not check, remaining limits.
- Describe the final change, not the history of attempts.
