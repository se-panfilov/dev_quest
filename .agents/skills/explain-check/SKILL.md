---
name: explain-check
description: Check that the learner understands code before a commit. Use at the Partner or Agent level when code written or suggested by an agent is about to be committed.
---

# Check that the learner understands the code

Course rule: the learner has read and understood everything in a commit. The mentor can ask about any line. "AI wrote it" is not an answer.
This skill is practice for that question. Read [AGENTS.md](../../../AGENTS.md). Talk in Russian, simply, as to a person aged 12–14.

## When

- 🤝 Partner: before each commit that has code an agent suggested.
- 🚀 Agent: before the quest or PR is submitted. Pick the most important places, not every line.
- 🤖 Explainer: do not use. The learner writes the code.

## How

1. Get the diff for the commit: `git diff --staged` or `git diff`.
2. Pick 3–5 places: the main logic, a condition, error handling, data from outside.
3. Ask one question at a time and wait. Do not put the answer in the question. Examples (in Russian):
   - «Что делает эта строка?»
   - «Что будет, если сюда придёт пустой массив?»
   - «Почему здесь `await`?»
   - «Как проверить, что это работает? Покажи тест или шаги.»
4. Correct answer: confirm briefly and go on.
5. Wrong answer or "I don't know": explain briefly, better with another example. Then ask again.
6. After a second failed try: say directly that this part is not committed yet. Suggest to simplify it or to study the topic (give a link).

## Result

Give a short summary in Russian: what is understood, what was explained, what is left. Suggest to add new knowledge to the "что понято" part of the quest report. The learner writes the report.
Do not commit for the learner unless they ask directly.
