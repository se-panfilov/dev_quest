// Инвентарь героя. Предмет — это объект:
//   { name: "Меч", type: "оружие", weight: 5, value: 100 }
// Инвентарь — массив таких предметов.
// Запуск тестов:  node --test

// 1. Общий вес всех предметов.
export function totalWeight(items) {
}

// 2. Можно ли положить предмет, не превысив вместимость (capacity)?
export function canAdd(items, item, capacity) {
}

// 3. Добавить предмет. Верни НОВЫЙ массив (старый не меняй).
//    Если не помещается — верни старый массив без изменений.
export function addItem(items, item, capacity) {
}

// 4. Убрать предмет по имени. Верни новый массив. Если таких несколько — убери только первый.
export function removeItem(items, name) {
}

// 5. Все предметы нужного типа.
export function findByType(items, type) {
}

// 6. Самый ценный предмет (по value). Для пустого инвентаря верни null.
export function mostValuable(items) {
}

// 7. Новый массив, отсортированный по ценности: от дорогих к дешёвым. Исходный не меняй.
export function sortByValue(items) {
}
