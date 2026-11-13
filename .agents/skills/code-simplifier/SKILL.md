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
The text follows the adaptation in se-panfilov/modern_monorepo_template, translated and changed for a learning repository.
-->

# Упростить код

Прочитай [AGENTS.md](../../../AGENTS.md) и [стандарты кода](../code-standards/SKILL.md).
Skill не даёт прав менять данные, историю Git и внешние сервисы.

## Уровень ученика

- 🤖 ИИ-объяснитель: не переписывай код. Назови одно место, которое можно упростить, и спроси, как бы сделал(а) ученик.
- 🤝 ИИ-напарник: предлагай одно упрощение за раз, с объяснением «было → стало → почему лучше». Правку делает ученик или ты после согласия.
- 🚀 ИИ-агенты: можно править, потом объясни каждую правку.

## Объём

Упрощай только выбранные файлы или код, изменённый в текущей задаче.
Не превращай уборку в рефакторинг всего репозитория.
Не трогай чужие несвязанные изменения, сгенерированный код (`dist/`), тесты упражнений и данные ученика.

## Сохрани поведение

- Сохрани публичные функции, их аргументы и возвращаемые значения, порядок вывода, тексты на экране.
- Тесты должны остаться зелёными без изменения тестов.
- Сохрани проверки входных данных, экранирование текста в DOM и шаблонах Vue, ограничения размера.
- Не удаляй `try`/`catch`/`finally` только ради меньшей вложенности. Сохрани обработку ошибок и очистку.
- Сохрани комментарии, которые объясняют неочевидное правило или ограничение.

## Сделай понятнее

- Явный `if` лучше вложенного тернарного оператора и плотного выражения.
- Понятные имена на английском: `score`, `isAnswerCorrect`, а не `s`, `flag2`.
- Ранний `return`, если он не ломает очистку и обработку ошибок.
- Убирай лишнюю абстракцию, только если без неё понятнее.
- Не добавляй зависимость, фреймворк или шаг сборки ради красоты.
- Понятность важнее меньшего числа строк.

## Проверь

1. Назови, какое поведение затрагивает правка.
2. Сделай самую маленькую полезную правку.
3. Прочитай весь diff, включая ветки ошибок.
4. Запусти существующие проверки: `node --test`, а в проектах с `package.json` — их `test`, `build`, `lint` и `typecheck`, если такие скрипты есть.
5. Нашёл(а) ошибку — сообщи и предложи тест на неё.
6. Отчитайся на русском: что упрощено, что запущено, что не проверено.
