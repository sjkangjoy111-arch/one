(() => {
  'use strict';

  /* =========================================================
   * 1. 퍼즐 데이터 (좌표는 0~100 기준)
   * ======================================================= */
  const r2 = (v) => Math.round(v * 100) / 100;

  function ring(n, cx, cy, r, startDeg = -90) {
    return Array.from({ length: n }, (_, k) => {
      const a = ((startDeg + (360 * k) / n) * Math.PI) / 180;
      return [r2(cx + r * Math.cos(a)), r2(cy + r * Math.sin(a))];
    });
  }

  function allPairs(n) {
    const e = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) e.push([i, j]);
    return e;
  }

  function hexagram() {
    const R = 47;
    const tips = ring(6, 50, 50, R, -90);
    const inner = ring(6, 50, 50, R / Math.sqrt(3), -60);
    const edges = [];
    for (let k = 0; k < 6; k++) {
      edges.push([k, 6 + k]);
      edges.push([k, 6 + ((k + 5) % 6)]);
      edges.push([6 + k, 6 + ((k + 1) % 6)]);
    }
    return { nodes: [...tips, ...inner], edges };
  }

  function grid3() {
    const xs = [10, 50, 90];
    const nodes = [];
    xs.forEach((y) => xs.forEach((x) => nodes.push([x, y])));
    const edges = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const i = r * 3 + c;
        if (c < 2) edges.push([i, i + 1]);
        if (r < 2) edges.push([i, i + 3]);
      }
    }
    return { nodes, edges };
  }

  const PUZZLES = {
    possible: [
      {
        name: '네잎 꽃',
        desc: '꽃잎 네 장을 한 번에 그려 보세요.',
        nodes: [[50, 50], [50, 8], [92, 50], [50, 92], [8, 50]],
        edges: [[0, 1], [0, 1], [0, 2], [0, 2], [0, 3], [0, 3], [0, 4], [0, 4]],
      },
      {
        name: '니콜라우스의 집',
        desc: '유명한 "집 그리기". 출발점을 잘 고르세요!',
        nodes: [[18, 92], [82, 92], [82, 45], [18, 45], [50, 8]],
        edges: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3], [3, 4], [2, 4]],
      },
      {
        name: '편지 봉투',
        desc: '대각선이 만나는 점까지 있는 봉투입니다.',
        nodes: [[8, 36], [92, 36], [92, 92], [8, 92], [50, 64], [50, 6]],
        edges: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [4, 2], [1, 4], [4, 3], [0, 5], [5, 1]],
      },
      {
        name: '오각별',
        desc: '오각형과 별을 함께 — 선이 10개!',
        nodes: ring(5, 50, 53, 46),
        edges: allPairs(5),
      },
      {
        name: '다윗의 별',
        desc: '교차점도 모두 점이에요. 18개의 선.',
        ...hexagram(),
      },
      {
        name: '삼각 별',
        desc: '삼각형 안에 거꾸로 된 삼각형 (정팔면체 그래프).',
        nodes: [[50, 4], [96, 88], [4, 88], [50, 74], [29, 38], [71, 38]],
        edges: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3], [0, 4], [0, 5], [1, 5], [1, 3], [2, 3], [2, 4]],
      },
    ],
    impossible: [
      {
        name: '삼거리',
        desc: '선 3개뿐인데… 정말 한 번에 될까요?',
        nodes: [[50, 58], [50, 6], [6, 92], [94, 92]],
        edges: [[0, 1], [0, 2], [0, 3]],
      },
      {
        name: '삼각 피라미드',
        desc: '삼각형과 가운데 점을 잇는 그림.',
        nodes: [[50, 6], [94, 88], [6, 88], [50, 62]],
        edges: allPairs(4),
      },
      {
        name: 'X 상자',
        desc: '사각형과 두 대각선 (가운데에서 만나요).',
        nodes: [[8, 8], [92, 8], [92, 92], [8, 92], [50, 50]],
        edges: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4], [2, 4], [3, 4]],
      },
      {
        name: '쾨니히스베르크 다리',
        desc: 'A=북쪽 강변, B=남쪽 강변, C·D=섬. 7개의 다리를 한 번씩!',
        nodes: [[50, 6], [50, 94], [30, 50], [88, 50]],
        edges: [[0, 2], [0, 2], [1, 2], [1, 2], [0, 3], [1, 3], [2, 3]],
      },
      {
        name: '바둑판',
        desc: '2×2 칸의 격자. 간단해 보이지만…',
        ...grid3(),
      },
      {
        name: '정육면체',
        desc: '모든 꼭짓점의 차수가 3인 입체 도형.',
        nodes: [[6, 34], [64, 34], [64, 94], [6, 94], [34, 6], [94, 6], [94, 64], [34, 64]],
        edges: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]],
      },
    ],
  };

  const CAT_DESC = {
    possible: '홀수점(차수가 홀수인 점)이 0개 또는 2개인 그림 → 한 번에 그릴 수 있어요. 홀수점이 2개라면 그중 한 점에서 출발해야 합니다.',
    impossible: '홀수점이 4개 이상인 그림 → 한붓그리기 불가능! 직접 시도해 보고, 최소 몇 획이면 완성되는지 찾아보세요.',
  };

  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const INK = ['#e8590c', '#1971c2', '#2f9e44', '#9c36b5', '#c2255c', '#0c8599'];
  const CURVE = 24; // 같은 두 점을 잇는 여러 선(다리)의 휘어짐 정도
  const svgNS = 'http://www.w3.org/2000/svg';

  /* =========================================================
   * 2. 오일러 분석 & 풀이 (Hierholzer 알고리즘)
   * ======================================================= */
  function analyze(pz) {
    const n = pz.nodes.length;
    const deg = new Array(n).fill(0);
    pz.edges.forEach(([a, b]) => { deg[a]++; deg[b]++; });
    const odd = deg.map((d, i) => (d % 2 ? i : -1)).filter((i) => i >= 0);

    // 연결 요소별로 필요한 최소 획 수 = max(1, 홀수점/2)
    const comp = new Array(n).fill(-1);
    const adj = Array.from({ length: n }, () => []);
    pz.edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
    let comps = 0;
    let minStrokes = 0;
    for (let s = 0; s < n; s++) {
      if (comp[s] >= 0 || deg[s] === 0) continue;
      let oddHere = 0;
      const stack = [s];
      comp[s] = comps;
      while (stack.length) {
        const v = stack.pop();
        if (deg[v] % 2) oddHere++;
        adj[v].forEach((w) => { if (comp[w] < 0) { comp[w] = comps; stack.push(w); } });
      }
      minStrokes += Math.max(1, oddHere / 2);
      comps++;
    }

    let type = 'none';
    if (comps === 1 && odd.length === 0) type = 'circuit';
    else if (comps === 1 && odd.length === 2) type = 'path';
    return { deg, odd, comps, minStrokes, type };
  }

  // 오일러 경로 탐색 (다중 간선 지원). 반환: [{v, e}] — e는 v로 들어온 간선 번호
  function hierholzer(n, edges, start) {
    const adj = Array.from({ length: n }, () => []);
    edges.forEach(([a, b], i) => { adj[a].push([i, b]); adj[b].push([i, a]); });
    const ptr = new Array(n).fill(0);
    const used = new Array(edges.length).fill(false);
    const stack = [{ v: start, e: null }];
    const out = [];
    while (stack.length) {
      const top = stack[stack.length - 1];
      const list = adj[top.v];
      while (ptr[top.v] < list.length && used[list[ptr[top.v]][0]]) ptr[top.v]++;
      if (ptr[top.v] < list.length) {
        const [ei, w] = list[ptr[top.v]];
        used[ei] = true;
        stack.push({ v: w, e: ei });
      } else {
        out.push(stack.pop());
      }
    }
    return out.reverse();
  }

  // 최소 획 수로 나눈 풀이. 홀수점이 4개 이상이면 가상 간선으로 짝을 맞춘 뒤 그 자리에서 붓을 뗀다.
  function solveTrails(pz, info) {
    const n = pz.nodes.length;
    const edges = pz.edges.slice();
    const real = edges.length;
    const odd = info.odd.slice();
    for (let i = 2; i + 1 < odd.length; i += 2) edges.push([odd[i], odd[i + 1]]);
    const start = odd.length ? odd[0] : pz.edges[0][0];
    const seq = hierholzer(n, edges, start);

    const trails = [];
    let cur = { nodes: [seq[0].v], edges: [] };
    for (let i = 1; i < seq.length; i++) {
      const { v, e } = seq[i];
      if (e >= real) {
        trails.push(cur);
        cur = { nodes: [v], edges: [] };
      } else {
        cur.nodes.push(v);
        cur.edges.push(e);
      }
    }
    trails.push(cur);
    return trails.filter((t) => t.edges.length);
  }

  /* =========================================================
   * 3. 상태 & 저장
   * ======================================================= */
  const STORE_KEY = 'euler-onestroke-v1';
  let progress = {};
  try { progress = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (_) { progress = {}; }
  function saveProgress() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (_) { /* 무시 */ }
  }

  Object.entries(PUZZLES).forEach(([cat, list]) => {
    list.forEach((pz, i) => {
      pz.id = `${cat}-${i}`;
      pz.cat = cat;
      pz.info = analyze(pz);
      pz.offsets = edgeOffsets(pz);
    });
  });

  const state = {
    cat: 'possible',
    idx: 0,
    pz: null,
    used: [],
    strokes: [],
    inks: [],
    showDeg: false,
    showAnalysis: false,
    done: false,
    dragging: false,
    auto: false,
    timer: null,
  };

  /* =========================================================
   * 4. DOM
   * ======================================================= */
  const $ = (id) => document.getElementById(id);
  const board = $('board');
  const picker = $('picker');
  const statusEl = $('status');
  const analysisEl = $('analysis');

  let gBase, gInk, gNodes, band, nodeEls = [];

  function svgEl(tag, attrs, parent) {
    const e = document.createElementNS(svgNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function edgeOffsets(pz) {
    const groups = {};
    pz.edges.forEach(([a, b], i) => {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      (groups[k] = groups[k] || []).push(i);
    });
    const off = [];
    Object.values(groups).forEach((ids) => {
      ids.forEach((id, j) => { off[id] = (j - (ids.length - 1) / 2) * CURVE; });
    });
    return off;
  }

  // from을 주면 그 점에서 출발하는 방향으로 경로를 만든다 (잉크 애니메이션 방향)
  function edgeD(pz, i, from) {
    const [a, b] = pz.edges[i];
    const lo = Math.min(a, b), hi = Math.max(a, b);
    const P = pz.nodes[lo], Q = pz.nodes[hi];
    const s = from === undefined ? P : pz.nodes[from];
    const t = from === undefined ? Q : pz.nodes[from === a ? b : a];
    const off = pz.offsets[i];
    if (!off) return `M${s[0]} ${s[1]}L${t[0]} ${t[1]}`;
    const dx = Q[0] - P[0], dy = Q[1] - P[1], L = Math.hypot(dx, dy);
    const cx = (P[0] + Q[0]) / 2 + (-dy / L) * off;
    const cy = (P[1] + Q[1]) / 2 + (dx / L) * off;
    return `M${s[0]} ${s[1]}Q${r2(cx)} ${r2(cy)} ${t[0]} ${t[1]}`;
  }

  /* ---------- 퍼즐 선택 카드 ---------- */
  function renderPicker() {
    picker.innerHTML = '';
    PUZZLES[state.cat].forEach((pz, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'card' + (i === state.idx ? ' active' : '');
      const s = svgEl('svg', { viewBox: '-6 -6 112 112', 'aria-hidden': 'true' });
      pz.edges.forEach((_, ei) => svgEl('path', { d: edgeD(pz, ei), class: 't-edge' }, s));
      pz.nodes.forEach(([x, y]) => svgEl('circle', { cx: x, cy: y, r: 4.5, class: 't-node' }, s));
      btn.appendChild(s);
      btn.insertAdjacentHTML('beforeend', `<span class="num">#${i + 1}</span><span class="nm">${pz.name}</span>`);
      const best = progress[pz.id];
      if (best) {
        const optimal = best <= pz.info.minStrokes;
        btn.insertAdjacentHTML('beforeend', `<span class="badge">${optimal ? '★' : '✓'}</span>`);
      }
      btn.addEventListener('click', () => loadPuzzle(state.cat, i));
      picker.appendChild(btn);
    });
  }

  /* ---------- 판 그리기 ---------- */
  function renderBoard() {
    const pz = state.pz;
    board.innerHTML = '';
    gBase = svgEl('g', {}, board);
    gInk = svgEl('g', {}, board);
    band = svgEl('line', { class: 'band', visibility: 'hidden' }, board);
    gNodes = svgEl('g', {}, board);

    pz.edges.forEach((_, i) => svgEl('path', { d: edgeD(pz, i), class: 'edge' }, gBase));

    nodeEls = pz.nodes.map(([x, y], i) => {
      const g = svgEl('g', { class: 'node' + (pz.info.deg[i] % 2 ? ' odd' : '') }, gNodes);
      svgEl('circle', { cx: x, cy: y, r: 4, class: 'pulse' }, g);
      svgEl('circle', { cx: x, cy: y, r: 3.6, class: 'body' }, g);
      const lbl = svgEl('text', { x, y, class: 'lbl' }, g);
      lbl.textContent = LETTERS[i];
      const dg = svgEl('g', { class: 'deg' }, g);
      const bx = Math.min(x + 5, 104), by = Math.max(y - 5, -4);
      svgEl('circle', { cx: bx, cy: by, r: 2.4 }, dg);
      const dt = svgEl('text', { x: bx, y: by }, dg);
      dt.textContent = pz.info.deg[i];
      return g;
    });
    board.classList.toggle('show-deg', state.showDeg);
  }

  /* =========================================================
   * 5. 게임 로직
   * ======================================================= */
  function loadPuzzle(cat, idx) {
    stopAuto();
    state.cat = cat;
    state.idx = idx;
    state.pz = PUZZLES[cat][idx];
    state.showAnalysis = false;
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.cat === cat));
    $('catDesc').textContent = CAT_DESC[cat];
    $('pzName').textContent = `#${idx + 1} ${state.pz.name}`;
    $('pzDesc').textContent = state.pz.desc;
    const tag = $('pzTag');
    tag.className = 'tag ' + (cat === 'possible' ? 'ok' : 'bad');
    tag.textContent = cat === 'possible' ? '한붓그리기 가능' : '한붓그리기 불가능';
    renderPicker();
    renderBoard();
    resetPlay();
  }

  function resetPlay() {
    state.used = new Array(state.pz.edges.length).fill(false);
    state.strokes = [];
    state.inks = [];
    state.done = false;
    if (gInk) gInk.innerHTML = '';
    document.querySelector('.board-wrap').classList.remove('win');
    setStatus(state.cat === 'possible'
      ? '시작할 점을 누르세요. (힌트: "차수 보기"로 출발점을 찾아보세요)'
      : '한 번에 그릴 수 있을지 직접 시도해 보세요!');
    refresh();
  }

  const curStroke = () => state.strokes[state.strokes.length - 1] || null;
  const currentEnd = () => {
    const s = curStroke();
    return s ? s.nodes[s.nodes.length - 1] : null;
  };
  const usedCount = () => state.used.filter(Boolean).length;
  const strokeCount = () => state.strokes.filter((s) => s.edges.length).length;

  function remainingDeg(v) {
    let d = 0;
    state.pz.edges.forEach(([a, b], i) => {
      if (state.used[i]) return;
      if (a === v) d++;
      if (b === v) d++;
    });
    return d;
  }

  function findUnused(a, b) {
    return state.pz.edges.findIndex(([x, y], i) =>
      !state.used[i] && ((x === a && y === b) || (x === b && y === a)));
  }

  function startStroke(v) {
    if (remainingDeg(v) === 0) {
      setStatus(`${LETTERS[v]} 점에는 더 그릴 선이 남아 있지 않아요.`, 'warn');
      return false;
    }
    const s = curStroke();
    if (s && s.edges.length === 0) {
      s.nodes = [v]; // 아직 선을 안 그었으면 출발점만 바꾼다
    } else {
      state.strokes.push({ nodes: [v], edges: [] });
      if (state.strokes.length > 1 && !state.auto) {
        setStatus(`붓을 떼고 ${LETTERS[v]}에서 ${state.strokes.length}번째 획을 시작했어요.`, state.cat === 'possible' ? 'warn' : '');
      }
    }
    if (state.strokes.length === 1 && !state.auto) setStatus(`${LETTERS[v]}에서 출발! 이웃한 점으로 이어 그리세요.`);
    refresh();
    return true;
  }

  function traverse(from, to, ei) {
    const s = curStroke();
    state.used[ei] = true;
    s.edges.push(ei);
    s.nodes.push(to);
    drawInk(ei, from, state.strokes.length - 1);
    refresh();

    if (usedCount() === state.pz.edges.length) {
      finish();
    } else if (remainingDeg(to) === 0 && !state.auto) {
      if (state.cat === 'impossible' && state.strokes.length === 1) {
        setStatus(`막혔어요! 남은 선 ${state.pz.edges.length - usedCount()}개. 이 그림은 한붓그리기가 불가능해요 — "오일러 판정"으로 이유를 확인하거나, 다른 점을 눌러 새 획을 시작하세요.`, 'warn');
      } else if (state.cat === 'possible') {
        setStatus(`막혔어요! 남은 선 ${state.pz.edges.length - usedCount()}개. 되돌리기를 하거나 출발점을 바꿔 보세요.`, 'warn');
      } else {
        setStatus(`이 획은 끝! 남은 선 ${state.pz.edges.length - usedCount()}개 — 다른 점을 눌러 다음 획을 시작하세요.`);
      }
    } else if (!state.auto) {
      setStatus(`${s.nodes.map((v) => LETTERS[v]).join(' → ')}`);
    }
  }

  function drawInk(ei, from, strokeIdx) {
    const p = svgEl('path', {
      d: edgeD(state.pz, ei, from),
      class: 'ink',
      stroke: INK[strokeIdx % INK.length],
    }, gInk);
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
    p.getBoundingClientRect(); // 리플로우로 트랜지션 시작
    p.style.strokeDashoffset = 0;
    state.inks.push(p);
  }

  function undo() {
    if (state.auto) return;
    const s = curStroke();
    if (!s) return;
    state.done = false;
    document.querySelector('.board-wrap').classList.remove('win');
    if (s.edges.length === 0) {
      state.strokes.pop();
    } else {
      const ei = s.edges.pop();
      s.nodes.pop();
      state.used[ei] = false;
      const ink = state.inks.pop();
      if (ink) ink.remove();
      if (s.edges.length === 0 && state.strokes.length > 1) state.strokes.pop();
    }
    const cs = curStroke();
    setStatus(cs ? cs.nodes.map((v) => LETTERS[v]).join(' → ') : '시작할 점을 누르세요.');
    refresh();
  }

  function finish() {
    state.done = true;
    const info = state.pz.info;
    const n = strokeCount();
    const s0 = state.strokes[0];
    let msg;

    if (state.auto) {
      if (state.cat === 'possible') {
        msg = info.type === 'circuit'
          ? `풀이 완료: 홀수점이 없으므로 ${LETTERS[s0.nodes[0]]}에서 출발해 다시 ${LETTERS[s0.nodes[0]]}로 돌아오는 오일러 회로입니다.`
          : `풀이 완료: 홀수점 ${LETTERS[info.odd[0]]}에서 출발해 ${LETTERS[info.odd[1]]}에서 끝나는 오일러 경로입니다.`;
      } else {
        msg = `풀이 완료: 홀수점이 ${info.odd.length}개이므로 최소 ${info.minStrokes}획이 필요합니다. (색이 바뀌는 곳 = 붓을 뗀 곳)`;
      }
      setStatus(msg, 'ok');
      state.showAnalysis = true;
      refresh();
      return;
    }

    if (state.cat === 'possible') {
      if (n === 1) {
        const closed = s0.nodes[0] === s0.nodes[s0.nodes.length - 1];
        msg = `🎉 한붓그리기 성공! ${closed ? '출발점으로 돌아왔어요 (오일러 회로).' : `${LETTERS[s0.nodes[0]]} → ${LETTERS[s0.nodes[s0.nodes.length - 1]]} (오일러 경로).`}`;
      } else {
        msg = `완성! 하지만 ${n}획을 썼어요. 이 그림은 1획으로 그릴 수 있어요 — 다시 도전!`;
      }
    } else {
      msg = n <= info.minStrokes
        ? `🎉 ${n}획으로 완성 — 최소 획 수 달성! 홀수점이 ${info.odd.length}개라 이보다 줄일 수 없어요.`
        : `완성 (${n}획)! 최소 ${info.minStrokes}획까지 줄일 수 있어요.`;
      state.showAnalysis = true;
    }
    const good = (state.cat === 'possible' && n === 1) || (state.cat === 'impossible' && n <= info.minStrokes);
    setStatus(msg, good ? 'ok' : 'warn');
    if (good) {
      const wrap = document.querySelector('.board-wrap');
      wrap.classList.remove('win');
      void wrap.offsetWidth;
      wrap.classList.add('win');
    }
    if (!progress[state.pz.id] || n < progress[state.pz.id]) {
      progress[state.pz.id] = n;
      saveProgress();
      renderPicker();
    }
    refresh();
  }

  /* ---------- 자동 풀이 ---------- */
  function stopAuto() {
    if (state.timer) clearTimeout(state.timer);
    state.timer = null;
    state.auto = false;
  }

  function playSolution() {
    stopAuto();
    resetPlay();
    const trails = solveTrails(state.pz, state.pz.info);
    const steps = [];
    trails.forEach((t) => {
      steps.push({ start: t.nodes[0] });
      t.edges.forEach((e, i) => steps.push({ from: t.nodes[i], to: t.nodes[i + 1], e }));
    });
    state.auto = true;
    setStatus('풀이를 보여 주는 중…');
    let k = 0;
    const step = () => {
      if (!state.auto) return;
      const st = steps[k++];
      if (st.start !== undefined) startStroke(st.start);
      else traverse(st.from, st.to, st.e);
      if (k < steps.length) {
        state.timer = setTimeout(step, st.start !== undefined ? 260 : 380);
      } else {
        state.timer = null;
        state.auto = false;
        refresh();
      }
    };
    step();
    refresh();
  }

  /* ---------- 화면 갱신 ---------- */
  function setStatus(text, kind = '') {
    statusEl.textContent = text;
    statusEl.className = 'status' + (kind ? ' ' + kind : '');
  }

  function refresh() {
    const pz = state.pz;
    const info = pz.info;
    const end = currentEnd();
    const starts = new Set(state.strokes.map((s) => s.nodes[0]));
    nodeEls.forEach((g, i) => {
      g.classList.toggle('current', i === end && !state.done);
      g.classList.toggle('start', starts.has(i));
      g.classList.toggle('spent', remainingDeg(i) === 0);
    });

    $('stEdges').textContent = `${usedCount()}/${pz.edges.length}`;
    $('stStrokes').textContent = strokeCount();
    const revealGoal = state.cat === 'possible' || state.showAnalysis || state.done;
    $('stGoal').textContent = revealGoal ? info.minStrokes : '?';

    $('btnUndo').disabled = state.auto || state.strokes.length === 0;
    $('btnSolve').disabled = state.auto;
    $('btnHint').classList.toggle('on', state.showDeg);
    $('btnAnalyze').classList.toggle('on', state.showAnalysis);
    board.classList.toggle('show-deg', state.showDeg);
    renderAnalysis();
  }

  function renderAnalysis() {
    analysisEl.hidden = !state.showAnalysis;
    if (!state.showAnalysis) return;
    const pz = state.pz;
    const { deg, odd, type, minStrokes } = pz.info;
    const chips = deg.map((d, i) =>
      `<span class="chip${d % 2 ? ' odd' : ''}">${LETTERS[i]}: ${d}</span>`).join('');
    const oddNames = odd.map((i) => LETTERS[i]).join(', ');
    let verdict, why;
    if (type === 'circuit') {
      verdict = '<div class="verdict ok">✓ 오일러 회로 — 한붓그리기 가능</div>';
      why = '모든 점의 차수가 짝수예요. 어느 점에서 시작해도 되고, 마지막에 출발점으로 돌아옵니다.';
    } else if (type === 'path') {
      verdict = '<div class="verdict ok">✓ 오일러 경로 — 한붓그리기 가능</div>';
      why = `홀수점이 정확히 2개(${oddNames})예요. 반드시 이 중 한 점에서 출발해 다른 점에서 끝나야 합니다. 짝수점에서 시작하면 꼭 막혀요!`;
    } else {
      verdict = `<div class="verdict bad">✗ 한붓그리기 불가능 — 최소 ${minStrokes}획</div>`;
      why = `홀수점이 ${odd.length}개(${oddNames})예요. 지나가는 점은 들어오고 나가며 선을 2개씩 쓰므로 홀수점은 시작점·끝점만 될 수 있어요. `
        + `한 획이 해결할 수 있는 홀수점은 2개뿐이라 ${odd.length} ÷ 2 = ${minStrokes}획이 필요합니다.`;
    }
    analysisEl.innerHTML = `
      <h3>점별 차수 (홀수점 ${odd.length}개)</h3>
      <div class="chips">${chips}</div>
      ${verdict}
      <p>${why}</p>`;
  }

  /* =========================================================
   * 6. 입력 (마우스 · 터치 공통 Pointer Events)
   * ======================================================= */
  function toSvg(evt) {
    const pt = board.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(board.getScreenCTM().inverse());
  }

  // 화면 픽셀 기준 반경을 viewBox 단위로 변환 (손가락으로도 잘 잡히도록)
  const pxToUnits = (px) => (px * 112) / board.getBoundingClientRect().width;

  function nearestNode(p, px) {
    const lim = Math.max(pxToUnits(px), 5);
    let best = -1, bestD = Infinity;
    state.pz.nodes.forEach(([x, y], i) => {
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < lim && d < bestD) { best = i; bestD = d; }
    });
    return best;
  }

  function updateBand(p) {
    const end = currentEnd();
    if (!state.dragging || end === null || state.done) {
      band.setAttribute('visibility', 'hidden');
      return;
    }
    const [x, y] = state.pz.nodes[end];
    band.setAttribute('x1', x);
    band.setAttribute('y1', y);
    band.setAttribute('x2', p.x);
    band.setAttribute('y2', p.y);
    band.setAttribute('visibility', 'visible');
  }

  board.addEventListener('pointerdown', (e) => {
    if (state.auto || state.done) return;
    const p = toSvg(e);
    const v = nearestNode(p, 24);
    if (v < 0) return;
    e.preventDefault();
    try { board.setPointerCapture(e.pointerId); } catch (_) { /* 무시 */ }
    state.dragging = true;

    const cur = currentEnd();
    if (cur === null) {
      startStroke(v);
    } else if (v !== cur) {
      const ei = findUnused(cur, v);
      if (ei >= 0) traverse(cur, v, ei); // 탭으로 이어 그리기
      else startStroke(v);               // 붓 떼고 새 획
    }
    updateBand(p);
  });

  board.addEventListener('pointermove', (e) => {
    if (!state.dragging || state.auto || state.done) return;
    e.preventDefault();
    const p = toSvg(e);
    const cur = currentEnd();
    if (cur !== null) {
      const v = nearestNode(p, 18);
      if (v >= 0 && v !== cur) {
        const ei = findUnused(cur, v);
        if (ei >= 0) traverse(cur, v, ei);
      }
    }
    updateBand(p);
  });

  const endDrag = () => {
    state.dragging = false;
    if (band) band.setAttribute('visibility', 'hidden');
  };
  board.addEventListener('pointerup', endDrag);
  board.addEventListener('pointercancel', endDrag);
  board.addEventListener('lostpointercapture', endDrag);

  /* ---------- 버튼 ---------- */
  document.querySelectorAll('.tab').forEach((t) =>
    t.addEventListener('click', () => loadPuzzle(t.dataset.cat, 0)));
  $('btnUndo').addEventListener('click', undo);
  $('btnReset').addEventListener('click', () => { stopAuto(); resetPlay(); });
  $('btnHint').addEventListener('click', () => { state.showDeg = !state.showDeg; refresh(); });
  $('btnAnalyze').addEventListener('click', () => { state.showAnalysis = !state.showAnalysis; refresh(); });
  $('btnSolve').addEventListener('click', playSolution);

  loadPuzzle('possible', 0);
})();
