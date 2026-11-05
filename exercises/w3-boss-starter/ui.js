// Интерфейс викторины. Этот файл уже готов — разбираться в нём не обязательно
// (ты научишься такому в мире 4). Вся логика — в game.js.
import { questions } from "./questions.js";
import { createGame, getCurrentQuestion, answer, isFinished, getRank } from "./game.js";

const $ = (s) => document.querySelector(s);
let game;

function start() {
  game = createGame(questions);
  show();
}

function show() {
  const box = $("#game");
  if (isFinished(game)) {
    const total = game.questions.length;
    box.innerHTML = `
      <h2>Игра окончена!</h2>
      <p class="big">${game.score} из ${total}</p>
      <p class="rank">Твоё звание: <b>${getRank(game.score, total)}</b></p>
      <button id="again">Сыграть ещё</button>`;
    $("#again").onclick = start;
    return;
  }
  const q = getCurrentQuestion(game);
  box.innerHTML = `
    <p class="progress">Вопрос ${game.current + 1} из ${game.questions.length} · Очки: ${game.score}</p>
    <h2></h2>
    <div class="options"></div>`;
  box.querySelector("h2").textContent = q.text;
  q.options.forEach((opt, i) => {
    const b = document.createElement("button");
    b.textContent = opt;
    b.onclick = () => {
      const ok = answer(game, i);
      b.classList.add(ok ? "ok" : "bad");
      box.querySelectorAll(".options button").forEach((x) => (x.disabled = true));
      setTimeout(show, 700);
    };
    box.querySelector(".options").append(b);
  });
}

start();
