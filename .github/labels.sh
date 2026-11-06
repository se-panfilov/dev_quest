#!/usr/bin/env bash
# Создаёт (или обновляет) метки для бонусов XP и бейджей.
# Нужны GH_TOKEN и GH_REPO в окружении. Вызывается из workflows.
set -euo pipefail
mk() { gh label create "$1" --color "$2" --description "$3" --force >/dev/null; }
mk "xp+25"  "fbca04" "Бонус +25 XP"
mk "xp+50"  "fbca04" "Бонус +50 XP"
mk "xp+100" "fbca04" "Бонус +100 XP"
mk "badge:nohints"    "5319e7" "🧠 Без читов: без ИИ и подсказок"
mk "badge:detective"  "5319e7" "🔍 Баг пойман через DevTools/отладчик"
mk "badge:explainer"  "5319e7" "🗣️ Объяснение понятнее учебника"
mk "badge:creative"   "5319e7" "🎨 Сделано больше, чем просили"
mk "badge:clean"      "5319e7" "🧹 Код, который не стыдно показать"
mk "badge:tester"     "5319e7" "🧪 Тесты с первого раза или свои тесты"
mk "badge:persistent" "5319e7" "💪 Задача пыталась убить, но не смогла"
mk "badge:design"     "5319e7" "✨ Выглядит лучше, чем требовалось"
mk "нужна-помощь"     "d93f0b" "В отчёте есть раздел «Вопрос»"
echo "Метки готовы."
