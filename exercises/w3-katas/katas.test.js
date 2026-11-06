// ⚠️ Этот файл не меняй — по нему проверяется твоё решение.
import { test } from "node:test";
import assert from "node:assert/strict";
import { sum, isEven, greet, maxOfThree, damage, fizzBuzz, countVowels, reverseWord } from "./katas.js";

test("1. sum", () => {
  assert.equal(sum(2, 3), 5);
  assert.equal(sum(-4, 4), 0);
  assert.equal(sum(0.5, 0.25), 0.75);
});

test("2. isEven", () => {
  assert.equal(isEven(4), true);
  assert.equal(isEven(7), false);
  assert.equal(isEven(0), true);
  assert.equal(isEven(-2), true);
});

test("3. greet", () => {
  assert.equal(greet("Лара"), "Привет, Лара!");
  assert.equal(greet("Steve"), "Привет, Steve!");
  assert.equal(greet(""), "Привет, незнакомец!");
});

test("4. maxOfThree", () => {
  assert.equal(maxOfThree(1, 2, 3), 3);
  assert.equal(maxOfThree(9, 2, 3), 9);
  assert.equal(maxOfThree(1, 8, 3), 8);
  assert.equal(maxOfThree(5, 5, 5), 5);
  assert.equal(maxOfThree(-1, -8, -3), -1);
});

test("5. damage", () => {
  assert.equal(damage(10, 4, false), 6);
  assert.equal(damage(3, 10, false), 1);
  assert.equal(damage(10, 4, true), 12);
  assert.equal(damage(5, 5, true), 2);
});

test("6. fizzBuzz", () => {
  assert.equal(fizzBuzz(3), "Fizz");
  assert.equal(fizzBuzz(10), "Buzz");
  assert.equal(fizzBuzz(30), "FizzBuzz");
  assert.equal(fizzBuzz(7), "7");
});

test("7. countVowels", () => {
  assert.equal(countVowels("Привет"), 2);
  assert.equal(countVowels("Minecraft"), 3);
  assert.equal(countVowels("АБВГД"), 1);
  assert.equal(countVowels(""), 0);
  assert.equal(countVowels("Ёжик и Elf"), 4);
});

test("8. reverseWord", () => {
  assert.equal(reverseWord("магия"), "яигам");
  assert.equal(reverseWord("a"), "a");
  assert.equal(reverseWord(""), "");
});
