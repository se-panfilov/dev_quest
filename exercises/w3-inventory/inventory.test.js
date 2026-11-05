// ⚠️ Этот файл не меняй.
import { test } from "node:test";
import assert from "node:assert/strict";
import { totalWeight, canAdd, addItem, removeItem, findByType, mostValuable, sortByValue } from "./inventory.js";

const sword = { name: "Меч", type: "оружие", weight: 5, value: 100 };
const shield = { name: "Щит", type: "броня", weight: 8, value: 80 };
const potion = { name: "Зелье", type: "расходник", weight: 1, value: 20 };
const bow = { name: "Лук", type: "оружие", weight: 3, value: 150 };
const bag = () => [sword, shield, potion];

test("1. totalWeight", () => {
  assert.equal(totalWeight(bag()), 14);
  assert.equal(totalWeight([]), 0);
});

test("2. canAdd", () => {
  assert.equal(canAdd(bag(), bow, 20), true);
  assert.equal(canAdd(bag(), bow, 16), false);
  assert.equal(canAdd(bag(), bow, 17), true);
});

test("3. addItem", () => {
  const items = bag();
  const result = addItem(items, bow, 20);
  assert.equal(result.length, 4);
  assert.equal(items.length, 3, "старый массив не должен меняться");
  assert.deepEqual(addItem(items, bow, 10), items);
});

test("4. removeItem", () => {
  const items = [sword, potion, potion];
  const result = removeItem(items, "Зелье");
  assert.deepEqual(result, [sword, potion]);
  assert.equal(items.length, 3, "старый массив не должен меняться");
  assert.deepEqual(removeItem(items, "Кирка"), items);
});

test("5. findByType", () => {
  assert.deepEqual(findByType([sword, shield, bow], "оружие"), [sword, bow]);
  assert.deepEqual(findByType(bag(), "магия"), []);
});

test("6. mostValuable", () => {
  assert.equal(mostValuable([sword, bow, potion]), bow);
  assert.equal(mostValuable([]), null);
});

test("7. sortByValue", () => {
  const items = [potion, bow, sword];
  assert.deepEqual(sortByValue(items), [bow, sword, potion]);
  assert.deepEqual(items, [potion, bow, sword], "исходный массив не должен меняться");
});
