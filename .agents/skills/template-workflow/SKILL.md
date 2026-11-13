---
name: template-workflow
description: Workflow for changes to the Dev Quest template. Use before you change quests, the hub map, exercises, workflows, or mentor and learner docs.
---

# Change the template

[AGENTS.md](../../../AGENTS.md) holds permissions, human decisions, and security. This skill holds the steps and checks.
Write code by [code-standards](../code-standards/SKILL.md). Write texts by [docs/WRITING.md](../../../docs/WRITING.md).

## Before a change

1. Read the files you change and the related ones: `README.md`, `MENTOR.md`, `hub/quests.js`, `hub/help.js`, the exercise README.
2. Find every mention of what you change: `grep -rn "<id or word>" hub exercises README.md MENTOR.md .github`.
3. Check whether the change touches a human decision from AGENTS.md: levels, XP, quest ids, workflow permissions.

## Map (`hub/`)

- No build. Scripts load with `<script>` tags in `index.html` and share data through `window.*`. The map works on GitHub Pages and from disk.
- Progress comes from PRs from branches `quest/<quest-id>`. Do not change this without a human decision.

## Quests (`hub/quests.js`)

- Ids: `w<world>-q<number>` or `w<world>-boss`. Never change or remove an existing id.
- Types: `quest`, `side`, `boss`. Copy fields and XP from neighbor quests of the same type.
- Editor steps: WebStorm only. Give shortcuts for Windows and Mac.
- Links: free resources, Russian where possible. Check that each link opens.

## Exercises (`exercises/`)

- The exercise README says where to copy the folder (`projects/<quest-id>/`), how to run tests, and what not to touch.
- The starter code fails the tests. Red to green is the task.
- Tests check the behavior from the README, not one implementation.
- Check in a temporary folder outside the repository that a solution can pass. Do not commit the solution.
- Add images only when needed, and keep them small.

## Workflows (`.github/`)

- A workflow works in any fork, without a hard-coded owner.
- For a security check, use [gha-security-review](../gha-security-review/SKILL.md).

## Checks

```bash
# Exercise tests on the starter code (must fail)
cd exercises/<exercise> && node --test

# quests.js loads (quest.yml reads it the same way)
node -e 'const fs=require("fs"),vm=require("vm");const c={window:{}};vm.runInNewContext(fs.readFileSync("hub/quests.js","utf8"),c);console.log(c.window.QUEST_DATA.worlds.length,"worlds")'
```

- Map change: open `index.html` in a browser. The map renders and the console has no errors.
- Text-only change: check links, commands, and agreement between `README.md`, `MENTOR.md`, `hub/help.js`, and `hub/quests.js`.
