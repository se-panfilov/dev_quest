// ⚠️ Этот файл не меняй.
import { test } from "node:test";
import assert from "node:assert/strict";
import { average, canPlay, capitalize, countWords, findHero } from "./buggy.js";

test("average", () => {
  assert.equal(average([2, 4, 6]), 4);
  assert.equal(average([10]), 10);
});

test("canPlay", () => {
  assert.equal(canPlay(12), true);
  assert.equal(canPlay(15), true);
  assert.equal(canPlay(11), false);
});

test("capitalize", () => {
  assert.equal(capitalize("дракон"), "Дракон");
  assert.equal(capitalize("a"), "A");
});

test("countWords", () => {
  assert.equal(countWords("я люблю писать код"), 4);
  assert.equal(countWords("привет"), 1);
});

test("findHero", () => {
  const heroes = [{ name: "Арья" }, { name: "Гэндальф" }];
  assert.deepEqual(findHero(heroes, "Гэндальф"), { name: "Гэндальф" });
  assert.equal(findHero(heroes, "Шрек"), null);
});
