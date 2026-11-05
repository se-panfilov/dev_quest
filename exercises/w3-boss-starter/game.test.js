// ⚠️ Этот файл не меняй.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createGame, getCurrentQuestion, checkAnswer, answer, isFinished, getRank } from "./game.js";
import { questions } from "./questions.js";

const sample = [
  { text: "2+2?", options: ["3", "4", "5", "22"], correct: 1 },
  { text: "Столица Нидерландов?", options: ["Амстердам", "Роттердам", "Гаага", "Утрехт"], correct: 0 },
];

test("createGame", () => {
  const g = createGame(sample);
  assert.equal(g.current, 0);
  assert.equal(g.score, 0);
  assert.equal(g.questions, sample);
});

test("getCurrentQuestion", () => {
  const g = createGame(sample);
  assert.equal(getCurrentQuestion(g), sample[0]);
  g.current = 2;
  assert.equal(getCurrentQuestion(g), null);
});

test("checkAnswer", () => {
  assert.equal(checkAnswer(sample[0], 1), true);
  assert.equal(checkAnswer(sample[0], 0), false);
});

test("answer: счёт и переход к следующему вопросу", () => {
  const g = createGame(sample);
  assert.equal(answer(g, 1), true);
  assert.equal(g.score, 1);
  assert.equal(g.current, 1);
  assert.equal(answer(g, 3), false);
  assert.equal(g.score, 1);
  assert.equal(g.current, 2);
});

test("isFinished", () => {
  const g = createGame(sample);
  assert.equal(isFinished(g), false);
  answer(g, 0); answer(g, 0);
  assert.equal(isFinished(g), true);
});

test("getRank", () => {
  assert.equal(getRank(10, 10), "Легенда");
  assert.equal(getRank(8, 10), "Мастер");
  assert.equal(getRank(5, 10), "Знаток");
  assert.equal(getRank(4, 10), "Новичок");
  assert.equal(getRank(0, 10), "Новичок");
});

test("questions.js: 10 своих вопросов", () => {
  assert.ok(questions.length >= 10, `вопросов ${questions.length}, нужно минимум 10`);
  for (const q of questions) {
    assert.equal(typeof q.text, "string");
    assert.equal(q.options.length, 4, `у вопроса «${q.text}» должно быть 4 варианта`);
    assert.ok(q.correct >= 0 && q.correct <= 3, `у вопроса «${q.text}» correct должен быть от 0 до 3`);
  }
});
