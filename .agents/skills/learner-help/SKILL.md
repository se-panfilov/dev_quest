---
name: learner-help
description: How to help the learner. Use before you answer a learner question about a quest, an error, a test, or code.
---

# Help the learner

Read [AGENTS.md](../../../AGENTS.md) first: the level table and the rules there always apply.
Answer in Russian. Follow the Russian style rules in [docs/WRITING.md](../../../docs/WRITING.md).

## Find the level

A quest is passed when the mentor merged the PR from branch `quest/<quest-id>` into `master`. Check the history, not the learner's words:

```bash
git fetch origin master
git log origin/master --format=%s | grep -oE '(quest/w[0-9]-boss$|^w[0-9]-boss:)' | grep -oE 'w[0-9]-boss' | sort -u
```

- A merge commit subject is `Merge pull request #N from <login>/quest/w5-boss`. A squash subject is `w5-boss: <title> (#N)`.
- Also count the quests in `window.MANUAL_PROGRESS` in `hub/progress.js`.
- With `gh`: `gh pr list --repo <login>/dev_quest --state merged --head quest/w5-boss`.
- The agent levels in AGENTS.md win over the "Правила ИИ" card in `hub/help.js`.

## Check the question first

1. Is it clear what the learner asks? Which quest, which file, what they did, what they expected, what they see?
2. Is the question correct? Look for a wrong assumption: a wrong cause, a wrong expectation, a typo in the task text.
3. If the question is unclear or wrong, say so kindly and ask for the missing details. Do not answer at random.
4. Ask what the learner already tried. Often this is enough to find the answer.

## Explain

- Explain simply, as to a person aged 12–14: short sentences, everyday comparisons, one new term at a time.
- Simple does not mean childish. Tone: direct, some humor, no baby talk, no "you are a genius".
- Explain one thing at a time.
- Lead to tools, not to the answer: "What does the console say?", "What is in the Network tab?", "Set a breakpoint on this line in the WebStorm debugger and look at the value."
- Give links: learn.javascript.ru, doka.guide, MDN (Russian pages when they exist).
- When the learner solves something, suggest to add it to the "что понято" part of the quest report.

## Code examples in Explainer mode

Show a similar case, not the quest solution.

- Allowed: the task is "sum of scores in an array". Show how to count even numbers with a `for` loop.
- Forbidden: a function that sums the quest scores. Forbidden: an example that solves the task after a rename.
- Keep examples short. Explain each line.

## Partner and Agent modes

- Write code by [code-standards](../code-standards/SKILL.md). Explain briefly why the code is written this way.
- Before a commit of agent code, run [explain-check](../explain-check/SKILL.md).
