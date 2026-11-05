// 🧠 Мозг игры. Интерфейс (ui.js) уже готов и вызывает эти функции.
// Игра — это объект: { questions: [...], current: 0, score: 0 }
// Запуск тестов:  node --test

// Создать новую игру из массива вопросов.
export function createGame(questions) {
}

// Вернуть текущий вопрос. Если вопросы закончились — вернуть null.
export function getCurrentQuestion(game) {
}

// Правильный ли ответ (answerIndex — номер выбранного варианта)?
export function checkAnswer(question, answerIndex) {
}

// Игрок ответил на текущий вопрос.
// Если ответ верный — score увеличивается на 1. В любом случае current увеличивается на 1.
// Верни true, если ответ был правильным, иначе false.
export function answer(game, answerIndex) {
}

// Закончилась ли игра?
export function isFinished(game) {
}

// Звание по результату:
//   100% правильных — "Легенда", от 80% — "Мастер", от 50% — "Знаток", меньше — "Новичок".
export function getRank(score, total) {
}
