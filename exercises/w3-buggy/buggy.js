// В этом файле 5 багов. Тесты в buggy.test.js показывают, что функции работают неправильно.
// Найди и почини каждый баг. Попробуй отладчик: поставь breakpoint или добавь console.log.

// Среднее арифметическое массива чисел.
export function average(numbers) {
  let total = 0;
  for (let i = 0; i <= numbers.length; i++) {
    total += numbers[i];
  }
  return total / numbers.length;
}

// Можно ли игроку в игру 12+?
export function canPlay(age) {
  return age > 12;
}

// Сделать первую букву заглавной: "дракон" → "Дракон".
export function capitalize(word) {
  return word[0].toUpperCase() + word.slice(0);
}

// Сколько слов в предложении?
export function countWords(sentence) {
  return sentence.split("").length;
}

// Найти героя по имени. Вернуть объект героя или null.
export function findHero(heroes, name) {
  for (const hero of heroes) {
    if (hero.name = name) {
      return hero;
    }
  }
  return null;
}
