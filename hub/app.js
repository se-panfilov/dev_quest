(function () {
  "use strict";

  const D = window.QUEST_DATA;
  const CFG = Object.assign({ playerName: "Игрок", reviewerName: "Ревьюер", owner: "", repo: "" }, window.HUB_CONFIG || {});
  const MANUAL = new Set(window.MANUAL_PROGRESS || []);
  const CACHE_KEY = "hub-cache-v1";
  const CACHE_MS = 5 * 60 * 1000;

  // ---------- helpers ----------
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
  };
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200);
  }

  // ---------- repo detection ----------
  function detectRepo() {
    let owner = CFG.owner, repo = CFG.repo;
    const h = location.hostname;
    if (h.endsWith(".github.io")) {
      owner = owner || h.replace(/\.github\.io$/, "");
      const seg = location.pathname.split("/").filter(Boolean)[0];
      repo = repo || seg || `${owner}.github.io`;
    }
    return owner && repo ? { owner, repo } : null;
  }
  const REPO = detectRepo();

  // ---------- flatten quests ----------
  const worlds = D.worlds.map((w, i) => Object.assign({}, w, { index: i, bonus: false }));
  const bonusWorlds = (D.bonusWorlds || []).map((w) => Object.assign({}, w, { bonus: true }));
  const allWorlds = worlds.concat(bonusWorlds);
  const QUESTS = {};
  allWorlds.forEach((w) => w.quests.forEach((q, qi) => { QUESTS[q.id] = Object.assign({}, q, { world: w, qi }); }));
  // «Ворота» мира: босс, а если его нет — последний обязательный квест
  const gateOf = (w) => w.quests.find((q) => q.type === "boss") || w.quests.filter((q) => q.type !== "side").slice(-1)[0];
  const qxp = (q) => q.xp != null ? q.xp : D.xp[q.type] || 0;

  // ---------- GitHub sync ----------
  async function gh(path) {
    const r = await fetch(`https://api.github.com/repos/${REPO.owner}/${REPO.repo}${path}`, { headers: { Accept: "application/vnd.github+json" } });
    if (!r.ok) throw new Error(`GitHub ответил ${r.status}`);
    return r.json();
  }

  async function loadRemote(force) {
    if (!REPO) return { prs: [], comments: [], at: 0, offline: "no-repo" };
    const cached = store.get(CACHE_KEY, null);
    if (!force && cached && cached.repo === `${REPO.owner}/${REPO.repo}` && Date.now() - cached.at < CACHE_MS) return cached;
    try {
      let prs = [];
      for (let page = 1; page <= 5; page++) {
        const batch = await gh(`/pulls?state=all&per_page=100&page=${page}&sort=updated&direction=desc`);
        prs = prs.concat(batch);
        if (batch.length < 100) break;
      }
      prs = prs
        .filter((p) => /^quest\//.test(p.head.ref))
        .map((p) => ({
          number: p.number,
          id: p.head.ref.replace(/^quest\//, ""),
          state: p.merged_at ? "done" : p.state === "open" ? "review" : "closed",
          merged_at: p.merged_at,
          updated_at: p.updated_at,
          url: p.html_url,
          labels: (p.labels || []).map((l) => l.name),
        }));
      // отзывы — для 6 последних работ
      const recent = prs.filter((p) => p.state !== "closed").slice(0, 6);
      const comments = [];
      await Promise.all(recent.map(async (p) => {
        try {
          const [ic, rv] = await Promise.all([gh(`/issues/${p.number}/comments`), gh(`/pulls/${p.number}/reviews`)]);
          ic.concat(rv).forEach((c) => {
            if (!c.body || !c.body.trim() || (c.user && c.user.type === "Bot")) return;
            comments.push({ quest: p.id, url: c.html_url || p.url, body: c.body, at: c.submitted_at || c.created_at, approved: c.state === "APPROVED" });
          });
        } catch (e) { /* ignore single failures */ }
      }));
      comments.sort((a, b) => (a.at < b.at ? 1 : -1));
      const data = { repo: `${REPO.owner}/${REPO.repo}`, prs, comments, at: Date.now() };
      store.set(CACHE_KEY, data);
      return data;
    } catch (e) {
      if (cached) return Object.assign({}, cached, { offline: e.message });
      return { prs: [], comments: [], at: 0, offline: e.message };
    }
  }

  // ---------- state ----------
  function computeState(remote) {
    const status = {}; // id -> done | review
    const prOf = {};
    const bonusXp = {};
    const badgeAwards = []; // {key, quest}
    const doneDates = [];

    // самые свежие PR идут первыми; done побеждает review
    remote.prs.slice().reverse().forEach((p) => {
      if (!QUESTS[p.id] || p.state === "closed") return;
      if (status[p.id] === "done" && p.state !== "done") return;
      status[p.id] = p.state;
      prOf[p.id] = p;
    });
    MANUAL.forEach((id) => { if (QUESTS[id]) status[id] = "done"; });

    Object.keys(prOf).forEach((id) => {
      const p = prOf[id];
      if (p.state !== "done") return;
      doneDates.push(p.merged_at);
      p.labels.forEach((l) => {
        let m = l.match(/^xp\s*\+\s*(\d+)$/i);
        if (m) bonusXp[id] = (bonusXp[id] || 0) + parseInt(m[1], 10);
        m = l.match(/^badge:(\w+)$/i);
        if (m && D.badges[m[1]]) badgeAwards.push({ key: m[1], quest: id });
      });
    });

    // доступность
    const avail = {};
    const worldOpen = {};
    worlds.forEach((w, i) => {
      const prevBoss = i === 0 ? null : gateOf(worlds[i - 1]);
      worldOpen[w.id] = i === 0 || (prevBoss && !!status[prevBoss.id]);
      let chainOk = worldOpen[w.id];
      w.quests.forEach((q) => {
        if (q.type === "side") { avail[q.id] = worldOpen[w.id]; return; }
        avail[q.id] = chainOk;
        if (!status[q.id]) chainOk = false;
      });
    });
    bonusWorlds.forEach((w) => {
      worldOpen[w.id] = !!status[w.requires];
      w.quests.forEach((q) => { avail[q.id] = worldOpen[w.id]; });
    });

    // XP
    let xp = 0;
    Object.keys(status).forEach((id) => { if (status[id] === "done") xp += qxp(QUESTS[id]) + (bonusXp[id] || 0); });

    // авто-бейджи
    const done = Object.keys(status).filter((id) => status[id] === "done");
    const auto = [];
    if (done.length >= 1) auto.push({ emoji: "🚀", title: "Первый квест", text: "Первая принятая работа" });
    if (done.length >= 10) auto.push({ emoji: "🔟", title: "10 квестов", text: "Десять принятых работ" });
    if (done.length >= 25) auto.push({ emoji: "🎖️", title: "25 квестов", text: "Двадцать пять принятых работ" });
    if (done.length >= 50) auto.push({ emoji: "🏅", title: "50 квестов", text: "Полсотни принятых работ" });
    const bossesDone = done.filter((id) => QUESTS[id].type === "boss");
    if (bossesDone.length >= 1) auto.push({ emoji: "👑", title: "Победа над боссом", text: "Первый побеждённый босс" });
    worlds.forEach((w) => {
      const b = w.quests.find((q) => q.type === "boss");
      if (b && status[b.id] === "done") auto.push({ emoji: w.emoji, title: `Мир «${w.title}» пройден`, text: w.subtitle });
    });
    const sidesDone = done.filter((id) => QUESTS[id].type === "side").length;
    if (sidesDone >= 3) auto.push({ emoji: "🗺️", title: "Исследователь", text: "3 побочных квеста" });
    const weeks = new Set(doneDates.filter(Boolean).map(isoWeek));
    [[4, "📅", "4 недели в деле"], [12, "📆", "12 недель в деле"], [26, "🗓️", "Полгода в деле"], [52, "🎂", "Год в деле"]].forEach(([n, e, t]) => {
      if (weeks.size >= n) auto.push({ emoji: e, title: t, text: `Принятые работы в ${n}+ разных неделях` });
    });

    return { status, prOf, avail, worldOpen, xp, bonusXp, badgeAwards, auto, done, weeks: weeks.size, bossesDone };
  }

  function isoWeek(dateStr) {
    const d = new Date(dateStr);
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return t.getUTCFullYear() + "-" + Math.ceil(((t - y0) / 86400000 + 1) / 7);
  }

  // Уровни: шаг растёт на 50 XP каждый уровень (200, 250, 300, …)
  function levelOf(xp) {
    let lvl = 1, floor = 0, step = 200;
    while (xp >= floor + step) { floor += step; lvl++; step += 50; }
    return { lvl, floor, next: floor + step };
  }
  const titleOf = (lvl) => D.titles[lvl - 1] || `Разработчик, ур. ${lvl}`;

  // ---------- render ----------
  let S = null;
  let REMOTE = null;

  function render() {
    const L = levelOf(S.xp);
    $("#playerName").textContent = CFG.playerName;
    $("#lvl").textContent = L.lvl;
    $("#playerTitle").textContent = titleOf(L.lvl);
    $("#xpFill").style.width = Math.round(((S.xp - L.floor) / (L.next - L.floor)) * 100) + "%";
    $("#xpText").textContent = `${S.xp} XP · ещё ${L.next - S.xp} до уровня ${L.lvl + 1}`;

    const totalMain = worlds.reduce((n, w) => n + w.quests.filter((q) => q.type !== "side").length, 0);
    const mainDone = S.done.filter((id) => QUESTS[id].type !== "side" && !QUESTS[id].world.bonus).length;
    const badgeCount = S.badgeAwards.length + S.auto.length;
    $("#stats").innerHTML = [
      ["✅", `${mainDone}/${totalMain}`, "квестов пути"],
      ["👑", S.bossesDone.length, "боссов"],
      ["🏅", badgeCount, "бейджей"],
      ["📅", S.weeks, "недель в деле"],
    ].map(([e, v, l]) => `<div class="stat"><span class="stat-e">${e}</span><b>${v}</b><span>${l}</span></div>`).join("");

    // sync line
    const sync = $("#sync");
    if (!REPO) {
      sync.innerHTML = `⚠️ Не знаю, где репозиторий: открой карту по ссылке GitHub Pages или заполни owner/repo в <code>hub/config.js</code>. Пока считаются только квесты из <code>hub/progress.js</code>.`;
    } else if (REMOTE.offline) {
      sync.innerHTML = `⚠️ Не удалось обновиться с GitHub (${esc(REMOTE.offline)}). ${REMOTE.at ? "Показываю данные от " + new Date(REMOTE.at).toLocaleString("ru") + "." : ""} <button class="link" id="refresh">Повторить</button>`;
    } else {
      sync.innerHTML = `Обновлено ${new Date(REMOTE.at).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })} · <button class="link" id="refresh">обновить</button>`;
    }
    const rb = $("#refresh"); if (rb) rb.onclick = () => boot(true);

    renderNext();
    renderFeedback();
    renderMap();
    renderBadges();
    renderGallery();
    renderHelp();
  }

  function stateOf(id) {
    if (S.status[id]) return S.status[id];
    return S.avail[id] ? "open" : "locked";
  }
  const STATE_LABEL = { done: "✅ засчитан", review: "⏳ на проверке", open: "▶ доступен", locked: "🔒 закрыт" };

  function nextQuest() {
    for (const w of worlds) for (const q of w.quests) if (q.type !== "side" && stateOf(q.id) === "open") return QUESTS[q.id];
    return null;
  }

  function renderNext() {
    const q = nextQuest();
    const inReview = Object.keys(S.status).filter((id) => S.status[id] === "review");
    let html = "";
    if (q) {
      const w = q.world;
      html += `<div class="next-card" style="--c:${w.color}">
        <div class="next-label">Следующий шаг</div>
        <div class="next-title">${q.type === "boss" ? "👹 " : ""}${esc(q.title)}</div>
        <div class="next-meta">${w.emoji} ${esc(w.title)} · <code>${q.id}</code> · ${esc(q.time || "")} · +${qxp(q)} XP</div>
        <button class="btn" data-open="${q.id}">Открыть квест</button>
      </div>`;
    } else {
      html += `<div class="next-card"><div class="next-title">🎉 Все доступные квесты сданы!</div><div class="next-meta">Жди проверки или возьми побочный квест на карте.</div></div>`;
    }
    if (inReview.length) {
      html += `<div class="review-row">На проверке: ${inReview.map((id) => `<a class="chip" href="${S.prOf[id] ? esc(S.prOf[id].url) : "#"}" target="_blank" rel="noopener">⏳ ${esc(QUESTS[id].title)}</a>`).join(" ")}</div>`;
    }
    $("#next").innerHTML = html;
  }

  function renderFeedback() {
    const c = (REMOTE.comments || []).slice(0, 3);
    if (!c.length) { $("#feedback").innerHTML = ""; return; }
    $("#feedback").innerHTML = `<h2>💬 Отзывы: ${esc(CFG.reviewerName)}</h2>` + c.map((x) => `
      <a class="fb" href="${esc(x.url)}" target="_blank" rel="noopener">
        <div class="fb-head">${x.approved ? "✅ " : ""}<b>${esc(QUESTS[x.quest] ? QUESTS[x.quest].title : x.quest)}</b> · ${new Date(x.at).toLocaleDateString("ru")}</div>
        <div class="fb-body">${esc(x.body).slice(0, 600).replace(/\n/g, "<br>")}</div>
      </a>`).join("");
  }

  function worldProgress(w) {
    const main = w.quests.filter((q) => q.type !== "side");
    const d = main.filter((q) => S.status[q.id] === "done").length;
    return { d, n: main.length };
  }

  function renderWorld(w) {
    const open = S.worldOpen[w.id];
    const p = worldProgress(w);
    const pct = Math.round((p.d / p.n) * 100);
    let lockMsg = "";
    if (!open) {
      if (w.bonus) lockMsg = `Откроется после «${esc(QUESTS[w.requires].title)}»`;
      else { const pb = gateOf(worlds[w.index - 1]); lockMsg = `Откроется после «${esc(pb.title)}»`; }
    }
    const tiles = w.quests.map((q) => {
      const st = stateOf(q.id);
      const cls = `tile ${st} ${q.type}`;
      const icon = q.type === "boss" ? "👹" : q.type === "side" ? "✦" : "";
      return `<button class="${cls}" data-open="${q.id}" ${st === "locked" ? 'aria-disabled="true"' : ""}>
        <span class="tile-id">${q.id}</span>
        <span class="tile-title">${icon} ${esc(q.title)}</span>
        <span class="tile-state">${STATE_LABEL[st]}${q.type === "side" ? " · побочный" : ""}</span>
      </button>`;
    }).join("");
    return `<div class="world ${open ? "" : "locked"} ${w.bonus ? "bonus" : ""}" style="--c:${w.color}">
      <div class="world-head">
        <div class="world-emoji">${open ? w.emoji : "🔒"}</div>
        <div class="world-text">
          <div class="world-title">${w.bonus ? "" : `Мир ${w.index} · `}${esc(w.title)}</div>
          <div class="world-sub">${esc(w.subtitle)} · ${esc(w.duration)}</div>
        </div>
        <div class="world-pct">${p.d}/${p.n}</div>
      </div>
      <div class="wbar"><div style="width:${pct}%"></div></div>
      ${open ? `<p class="world-intro">${esc(w.intro)}</p>` : `<p class="world-intro">${lockMsg}</p>`}
      ${open ? `<div class="tiles">${tiles}</div>` : ""}
    </div>`;
  }

  function renderMap() {
    let html = "";
    worlds.forEach((w) => {
      html += renderWorld(w);
      if (w.unlock) {
        const b = w.quests.find((q) => q.type === "boss");
        const got = b && S.status[b.id] === "done";
        html += `<div class="unlock ${got ? "got" : ""}"><span>${w.unlock.emoji}</span><div><b>${got ? "" : "🔒 "}${esc(w.unlock.title)}</b><br>${esc(w.unlock.text)}</div></div>`;
      }
      if (w.index === 4) bonusWorlds.forEach((bw) => { html += renderWorld(bw); });
    });
    $("#tab-map").innerHTML = html;
  }

  function renderBadges() {
    const earned = {};
    S.badgeAwards.forEach((a) => { (earned[a.key] = earned[a.key] || []).push(a.quest); });
    const special = Object.keys(D.badges).map((k) => {
      const b = D.badges[k]; const n = (earned[k] || []).length;
      return `<div class="badge ${n ? "got" : ""}"><div class="badge-e">${b.emoji}</div><b>${esc(b.title)}${n > 1 ? ` ×${n}` : ""}</b><span>${esc(b.text)}</span></div>`;
    }).join("");
    const auto = S.auto.map((b) => `<div class="badge got"><div class="badge-e">${b.emoji}</div><b>${esc(b.title)}</b><span>${esc(b.text)}</span></div>`).join("");
    $("#tab-badges").innerHTML = `
      <h2>Бейджи мастерства</h2><p class="muted">Их выдаёт ${esc(CFG.reviewerName)} на проверке — за то, <i>как</i> ты работала.</p>
      <div class="badges">${special}</div>
      <h2>Достижения</h2><p class="muted">Открываются сами.</p>
      <div class="badges">${auto || '<p class="muted">Пока пусто — сдай первый квест!</p>'}</div>`;
  }

  function renderGallery() {
    const items = Object.values(QUESTS).filter((q) => q.gallery && S.status[q.id] === "done");
    const sub = (q) => (typeof q.gallery === "string" ? q.gallery : "");
    const html = items.length
      ? `<div class="gallery">${items.map((q) => `<a class="gal" style="--c:${q.world.color}" href="projects/${q.id}/${sub(q)}" target="_blank" rel="noopener"><div class="gal-e">${q.world.emoji}</div><b>${esc(q.title.replace(/^(ФИНАЛЬНЫЙ )?БОСС: /, ""))}</b><span>Открыть сайт →</span></a>`).join("")}</div>`
      : `<p class="muted">Здесь появятся твои опубликованные проекты — каждый побеждённый босс. Ссылкой можно поделиться с друзьями.</p>`;
    $("#tab-gallery").innerHTML = `<h2>Галерея проектов</h2>${html}`;
  }

  function renderHelp() {
    $("#tab-help").innerHTML = (window.HELP_CARDS || []).map((c, i) =>
      `<details class="help" ${i === 0 ? "open" : ""}><summary>${c.emoji} ${esc(c.title)}</summary><div class="help-body">${c.html}</div></details>`).join("");
  }

  // ---------- quest dialog ----------
  function openQuest(id) {
    const q = QUESTS[id];
    if (!q) return;
    const st = stateOf(id);
    if (st === "locked") { toast("Этот квест пока закрыт 🔒"); return; }
    const w = q.world;
    const steps = (q.steps || []).map((s, i) => {
      const k = `step:${id}:${i}`;
      return `<label class="step"><input type="checkbox" data-step="${k}" ${store.get(k, false) ? "checked" : ""}><span>${esc(s)}</span></label>`;
    }).join("");
    const learn = (q.learn || []).map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join("");
    const done = (q.done || []).map((d) => `<li>${esc(d)}</li>`).join("");
    const br = `quest/${id}`;
    const cmds = [
      ["Перед началом", `git checkout master\ngit pull\ngit checkout -b ${br}\nmkdir -p projects/${id}`],
      ["Сохранить и сдать (можно повторять)", `git add .\ngit commit -m "${id}: ${q.title.replace(/"/g, "'")}"\ngit push -u origin ${br}`],
    ];
    const pr = S.prOf[id];
    const bonusXp = S.bonusXp[id];
    $("#questBody").innerHTML = `
      <button class="close" id="closeDlg" aria-label="Закрыть">✕</button>
      <div class="dlg-head" style="--c:${w.color}">
        <div class="dlg-world">${w.emoji} ${esc(w.title)} · <code>${id}</code></div>
        <h2>${q.type === "boss" ? "👹 " : ""}${esc(q.title)}</h2>
        <div class="dlg-meta">
          <span class="pill">${STATE_LABEL[st]}</span>
          <span class="pill">⏱ ${esc(q.time || "")}</span>
          <span class="pill">⭐ +${qxp(q)} XP${bonusXp ? ` (+${bonusXp} бонус)` : ""}</span>
          ${q.type === "side" ? '<span class="pill">побочный</span>' : ""}
        </div>
        ${pr ? `<a class="btn small" href="${esc(pr.url)}" target="_blank" rel="noopener">Открыть работу на GitHub</a>` : ""}
      </div>
      ${learn ? `<h3>📚 Что изучить</h3><ul class="learn">${learn}</ul>` : ""}
      <h3>🛠 Что сделать</h3><div class="steps">${steps}</div>
      ${q.note ? `<p class="tip">${esc(q.note)}</p>` : ""}
      <h3>🎯 Готово, когда</h3><ul class="done">${done}<li>${esc("В папке projects/" + id + "/ есть README.md — твой отчёт")}</li></ul>
      ${q.bonus ? `<div class="bonus">⚡ ${esc(q.bonus)}</div>` : ""}
      <h3>📤 Как сдать</h3>
      ${cmds.map(([t, c]) => `<div class="cmd"><div class="cmd-t">${t}<button class="copy" data-copy="${esc(c)}">копировать</button></div><pre>${esc(c)}</pre></div>`).join("")}
      <p class="muted">После push через минуту квест станет «на проверке». Следующий квест можно начинать сразу.</p>`;
    const dlg = $("#questDialog");
    dlg.showModal();
    $("#closeDlg").onclick = () => dlg.close();
  }

  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]");
    if (o) { openQuest(o.dataset.open); return; }
    const c = e.target.closest("[data-copy]");
    if (c) {
      const text = c.dataset.copy;
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => toast("Скопировано!"), () => toast("Выдели текст и нажми Ctrl+C"));
      return;
    }
    const t = e.target.closest(".tab");
    if (t) {
      document.querySelectorAll(".tab").forEach((x) => x.classList.toggle("active", x === t));
      document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("hidden", p.id !== "tab-" + t.dataset.tab));
      store.set("hub-tab", t.dataset.tab);
    }
  });
  document.addEventListener("change", (e) => {
    const k = e.target.dataset && e.target.dataset.step;
    if (k) { store.set(k, e.target.checked); if (e.target.checked) toast("Шаг выполнен ✓"); }
  });
  $("#questDialog").addEventListener("click", (e) => { if (e.target.id === "questDialog") e.target.close(); });

  // ---------- level-up celebration ----------
  function celebrate() {
    const L = levelOf(S.xp);
    const seen = store.get("hub-seen", null);
    if (seen && L.lvl > seen.lvl) toast(`🎉 Новый уровень ${L.lvl}: ${titleOf(L.lvl)}!`);
    else if (seen && S.done.length > seen.done) toast(`✅ Работа принята! +XP`);
    store.set("hub-seen", { lvl: L.lvl, done: S.done.length });
  }

  async function boot(force) {
    REMOTE = await loadRemote(force);
    S = computeState(REMOTE);
    render();
    celebrate();
    const tab = store.get("hub-tab", "map");
    const btn = document.querySelector(`.tab[data-tab="${tab}"]`);
    if (btn && force !== true) btn.click();
  }

  boot(false);
})();
