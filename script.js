(function () {
  "use strict";

  const data = window.SALARY_DATA || [];
  const CHANGELOG = window.CHANGELOG || [];
  const TODAY = window.DATA_AS_OF || "2026-05-18";

  // ---- Helpers ---------------------------------------------------------

  const fmtMoney = (n) =>
    n == null ? "—" : "$" + Math.round(n).toLocaleString("en-AU");

  const fmtDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-AU", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  const fmtDateShort = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-AU", { month: "short", year: "numeric" });
  };

  // Render **bold** markers in EA notes text.
  function renderMd(text) {
    if (!text) return "";
    return text.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  }

  const STATUS_LABEL = {
    "current":                "Current",
    "expired-in-negotiation": "Expired, in negotiation",
    "in-negotiation":         "In negotiation"
  };

  const STATUS_CLASS = {
    "current":                "status-current",
    "expired-in-negotiation": "status-expired-in-negotiation",
    "in-negotiation":         "status-in-negotiation"
  };

  // Return the salary in force on the given ISO date.
  function valueAt(schedule, iso) {
    if (!schedule || !schedule.length) return null;
    const t = new Date(iso).getTime();
    let chosen = null;
    for (const row of schedule) {
      if (new Date(row.date).getTime() <= t) chosen = row;
    }
    return chosen ? chosen.salary : null;
  }

  // Find the index of the schedule row currently in force (last row <= TODAY).
  function currentRowIdx(schedule) {
    const t = new Date(TODAY).getTime();
    let idx = -1;
    for (let i = 0; i < schedule.length; i++) {
      if (new Date(schedule[i].date).getTime() <= t) idx = i;
    }
    return idx;
  }

  // EA progress 0..1 from commenced to expires (capped at 1).
  function eaProgress(j) {
    const start = new Date(j.ea.commenced).getTime();
    const end   = new Date(j.ea.expires).getTime();
    const now   = new Date(TODAY).getTime();
    if (end <= start) return 1;
    return Math.max(0, Math.min(1, (now - start) / (end - start)));
  }

  // ---- Pre-compute table rows -----------------------------------------

  const rows = data.map((j) => {
    const grad = valueAt(j.graduate.schedule, TODAY);
    const top  = valueAt(j.top.schedule,      TODAY);
    return {
      j,
      name:     j.name,
      code:     j.code,
      graduate: grad,
      top:      top,
      gap:      grad != null && top != null ? top - grad : null,
      expiry:   j.ea.expires,
      status:   j.ea.status
    };
  });

  function getMaxMin(key) {
    const vals = rows.map(r => r[key]).filter(v => v != null);
    if (!vals.length) return { max: null, min: null };
    return { max: Math.max(...vals), min: Math.min(...vals) };
  }

  // =====================================================================
  // Phase 10 — URL hash state
  // =====================================================================

  let sortKey      = "name";
  let sortDir      = 1;
  let filterStatus = "all";
  let chartSeries  = "top";
  const selectedCodes = new Set();

  const VALID_SORT_KEYS = new Set(["name","graduate","top","gap","expiry","status"]);
  const VALID_FILTERS   = new Set(["all","current","expired"]);
  const VALID_SERIES    = new Set(["top","graduate"]);
  const validCodes      = new Set(data.map(j => j.code));

  function readHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const p = new URLSearchParams(hash);
    if (p.has("s")   && VALID_SORT_KEYS.has(p.get("s")))   sortKey      = p.get("s");
    if (p.has("d")   && (p.get("d") === "1" || p.get("d") === "-1")) sortDir = parseInt(p.get("d"), 10);
    if (p.has("f")   && VALID_FILTERS.has(p.get("f")))     filterStatus = p.get("f");
    if (p.has("c")   && VALID_SERIES.has(p.get("c")))      chartSeries  = p.get("c");
    if (p.has("sel")) {
      p.get("sel").split(",").filter(c => validCodes.has(c)).forEach(c => selectedCodes.add(c));
    }
  }

  function writeHash() {
    const p = new URLSearchParams();
    if (sortKey !== "name")      p.set("s", sortKey);
    if (sortDir !== 1)           p.set("d", String(sortDir));
    if (filterStatus !== "all")  p.set("f", filterStatus);
    if (chartSeries !== "top")   p.set("c", chartSeries);
    if (selectedCodes.size)      p.set("sel", [...selectedCodes].join(","));
    const str = p.toString();
    history.replaceState(null, "", str ? "#" + str : window.location.pathname + window.location.search);
  }

  // Read hash before any rendering so initial state is correct.
  readHash();

  // =====================================================================
  // Phase 4 — Summary table
  // =====================================================================

  const tbody = document.querySelector("#summary-table tbody");

  // ---- Filter buttons -------------------------------------------------

  (function buildFilterButtons() {
    const secHead = document.querySelector("#summary .sec-head");
    if (!secHead) return;
    const fg = document.createElement("div");
    fg.className = "filter-group";
    const mkOn = (f) => filterStatus === f ? " class=\"on\"" : "";
    fg.innerHTML = `
      <button${mkOn("all")} data-f="all">All</button>
      <button${mkOn("current")} data-f="current">Current EAs</button>
      <button${mkOn("expired")} data-f="expired">Expired</button>
    `;
    fg.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        filterStatus = btn.dataset.f;
        fg.querySelectorAll("button").forEach(b => b.classList.remove("on"));
        btn.classList.add("on");
        renderTable();
        writeHash();
      });
    });
    secHead.appendChild(fg);
  }());

  // ---- renderTable ----------------------------------------------------

  function renderTable() {
    const { max: gradMax, min: gradMin } = getMaxMin("graduate");
    const { max: topMax,  min: topMin  } = getMaxMin("top");

    let visible = rows.filter(r => {
      if (filterStatus === "current") return r.status === "current";
      if (filterStatus === "expired") return r.status !== "current";
      return true;
    });

    visible.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * sortDir;
      return String(av).localeCompare(String(bv)) * sortDir;
    });

    tbody.innerHTML = visible.map((r) => {
      const isSelected = selectedCodes.has(r.code);
      const gradClass  = r.graduate === gradMax ? " max-cell"
                       : r.graduate === gradMin ? " min-cell" : "";
      const topClass   = r.top === topMax ? " max-cell"
                       : r.top === topMin ? " min-cell" : "";
      const expired    = new Date(TODAY) > new Date(r.j.ea.expires);
      const prog       = eaProgress(r.j);
      const pct        = Math.round(Math.min(prog, 1) * 100);
      const fillCls    = expired ? " warn" : "";
      const srcCount   = r.j.sources.length;

      return `
        <tr class="${isSelected ? "selected" : ""}" data-code="${r.code}">
          <td class="check">
            <input type="checkbox" aria-label="Select ${r.j.name}"
              ${isSelected ? "checked" : ""} data-code="${r.code}">
          </td>
          <td>
            <div class="juris">
              <a href="#detail-${r.code}" style="text-decoration:none;color:inherit">${r.j.name}</a>
            </div>
            <div class="juris-sub">${r.code}</div>
          </td>
          <td class="num${gradClass}">${fmtMoney(r.graduate)}</td>
          <td class="num${topClass}">${fmtMoney(r.top)}</td>
          <td class="num">${fmtMoney(r.gap)}</td>
          <td>
            <div class="ea-timeline">
              <div class="ea-bar">
                <div class="fill${fillCls}" style="width:${pct}%"></div>
              </div>
              <span>${fmtDateShort(r.expiry)}</span>
            </div>
          </td>
          <td>
            <span class="status-pill ${STATUS_CLASS[r.status] || ""}">
              ${STATUS_LABEL[r.status] || r.status}
            </span>
          </td>
          <td>
            <a class="src-tag" href="#detail-${r.code}">
              ${srcCount} source${srcCount !== 1 ? "s" : ""}
            </a>
          </td>
        </tr>
      `;
    }).join("");

    // Wire checkboxes
    tbody.querySelectorAll("input[type=checkbox]").forEach(cb => {
      cb.addEventListener("change", () => {
        const code = cb.dataset.code;
        if (cb.checked) {
          if (selectedCodes.size >= 4) { cb.checked = false; return; }
          selectedCodes.add(code);
        } else {
          selectedCodes.delete(code);
        }
        renderTable();
        updateCmpBar();
        renderComparePanel();
        writeHash();
      });
    });

    // Sort indicators
    document.querySelectorAll("#summary-table thead th[data-sort]").forEach(th => {
      th.classList.remove("sorted-asc", "sorted-desc");
      if (th.dataset.sort === sortKey) {
        th.classList.add(sortDir === 1 ? "sorted-asc" : "sorted-desc");
      }
    });
  }

  document.querySelectorAll("#summary-table thead th[data-sort]").forEach(th => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      sortDir = key === sortKey ? -sortDir : 1;
      sortKey = key;
      renderTable();
      writeHash();
    });
  });

  renderTable();

  // =====================================================================
  // Phase 5 — Selection state + comparison bar + comparison panel
  // =====================================================================

  const cmpBar    = document.getElementById("cmpBar");
  const chipBox   = document.getElementById("chipBox");
  const cmpOpenBtn = document.getElementById("cmpOpenBtn");

  function updateCmpBar() {
    if (!cmpBar) return;
    if (selectedCodes.size === 0) {
      cmpBar.classList.add("hidden");
      return;
    }
    cmpBar.classList.remove("hidden");
    chipBox.innerHTML = [...selectedCodes].map(code => {
      const j = data.find(d => d.code === code);
      return `<span class="chip">${j ? j.name : code}
        <span class="x" data-code="${code}" role="button" aria-label="Remove ${code}">×</span>
      </span>`;
    }).join("");
    chipBox.querySelectorAll(".x").forEach(x => {
      x.addEventListener("click", () => {
        selectedCodes.delete(x.dataset.code);
        renderTable();
        updateCmpBar();
        renderComparePanel();
        writeHash();
      });
    });
  }

  if (cmpOpenBtn) {
    cmpOpenBtn.addEventListener("click", () => {
      const panel = document.getElementById("comparePanel");
      if (panel) {
        panel.classList.add("on");
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  function renderComparePanel() {
    const panel = document.getElementById("comparePanel");
    if (!panel) return;
    if (selectedCodes.size < 2) {
      panel.classList.remove("on");
      panel.innerHTML = "";
      return;
    }
    panel.classList.add("on");

    const sel = [...selectedCodes]
      .map(code => rows.find(r => r.code === code))
      .filter(Boolean);

    const colCount = sel.length;
    const ref = sel[0]; // first selected = reference

    function delta(refVal, val) {
      if (refVal == null || val == null) return "";
      const d = val - refVal;
      if (d === 0) return "";
      const cls  = d > 0 ? "up" : "down";
      const sign = d > 0 ? "+" : "";
      return `<span class="delta ${cls}">${sign}${fmtMoney(d)}</span>`;
    }

    const metrics = [
      {
        label: "Graduate salary",
        fn: r => fmtMoney(r.graduate),
        deltafn: r => delta(ref.graduate, r.graduate)
      },
      {
        label: "Top-of-scale",
        fn: r => fmtMoney(r.top),
        deltafn: r => delta(ref.top, r.top)
      },
      {
        label: "Gap (top − grad)",
        fn: r => fmtMoney(r.gap),
        deltafn: r => delta(ref.gap, r.gap)
      },
      {
        label: "EA expiry",
        fn: r => fmtDate(r.expiry),
        deltafn: () => ""
      },
      {
        label: "Status",
        fn: r => `<span class="status-pill ${STATUS_CLASS[r.status] || ""}">${STATUS_LABEL[r.status] || r.status}</span>`,
        deltafn: () => ""
      }
    ];

    const colTpl = `140px repeat(${colCount}, 1fr)`;

    panel.innerHTML = `
      <div class="cp-head">
        <h3>Comparison</h3>
        <button class="cp-close" aria-label="Close comparison">×</button>
      </div>
      <div class="cp-grid">
        <div class="cp-row head" style="grid-template-columns:${colTpl}">
          <div></div>
          ${sel.map((r, i) => `
            <div>
              <div class="juris-h">${r.j.name}</div>
              ${i === 0 ? `<div style="font-family:var(--mono);font-size:10px;color:var(--ink-3);margin-top:2px;letter-spacing:0.04em;">REFERENCE</div>` : ""}
            </div>
          `).join("")}
        </div>
        ${metrics.map(m => `
          <div class="cp-row" style="grid-template-columns:${colTpl}">
            <div class="label">${m.label}</div>
            ${sel.map((r, i) => `
              <div>
                <div class="val">${m.fn(r)}</div>
                ${i > 0 ? m.deltafn(r) : ""}
              </div>
            `).join("")}
          </div>
        `).join("")}
      </div>
    `;

    panel.querySelector(".cp-close").addEventListener("click", () => {
      panel.classList.remove("on");
    });
  }

  // =====================================================================
  // Phase 6 — Chart (segmented control, jurisdiction chips, TODAY line)
  // =====================================================================

  const PALETTE = {
    NSW: "#5b8bcf", VIC: "#6aaf86", QLD: "#c779a5",
    WA:  "#d29050", SA:  "#c75c5c", TAS: "#5eb5a8",
    ACT: "#a07ec0", NT:  "#b39458"
  };

  const hiddenCodes = new Set();
  const chartCtx = document.getElementById("projection-chart").getContext("2d");
  let chart = null;
  // chartSeries is declared in Phase 10 state block; default already set there

  // Custom plugin: vertical "Today" line
  const todayLinePlugin = {
    id: "todayLine",
    afterDatasetsDraw(ch) {
      const { ctx, chartArea, scales: { x } } = ch;
      if (!chartArea) return;
      const px = x.getPixelForValue(new Date(TODAY).getTime());
      if (px < chartArea.left || px > chartArea.right) return;
      ctx.save();
      ctx.strokeStyle = "rgba(26,22,20,0.18)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(px, chartArea.top);
      ctx.lineTo(px, chartArea.bottom);
      ctx.stroke();
      ctx.fillStyle = "rgba(132,123,114,0.8)";
      ctx.font = "10px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center";
      ctx.setLineDash([]);
      ctx.fillText("Today", px, chartArea.top - 6);
      ctx.restore();
    }
  };

  function buildChart(series) {
    chartSeries = series;
    const todayTime  = new Date(TODAY).getTime();
    const datasets   = [];

    data.forEach((j) => {
      if (hiddenCodes.has(j.code)) return;
      const expiryTime = new Date(j.ea.expires).getTime();
      const color      = PALETTE[j.code] || "#888";
      const sched      = j[series].schedule.map(r => ({ x: r.date, y: r.salary }));
      if (!sched.length) return;

      const last     = sched[sched.length - 1];
      const lastTime = new Date(last.x).getTime();

      const solidPoints = sched.slice();
      if (expiryTime > lastTime) {
        solidPoints.push({ x: j.ea.expires, y: last.y });
      }

      datasets.push({
        label: j.code,
        data: solidPoints,
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        stepped: "before"
      });

      // Dashed post-expiry extension — only when the schedule has no future
      // agreed entries that already cover the post-expiry period (e.g. VIC
      // has in-principle rates through 2029 and needs no dashed extension).
      if (todayTime > expiryTime && lastTime <= todayTime) {
        datasets.push({
          label: j.code + " (post-expiry)",
          data: [
            { x: j.ea.expires, y: last.y },
            { x: TODAY,        y: last.y }
          ],
          borderColor:     color,
          backgroundColor: color,
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          stepped: "before",
          hideInLegend: true
        });
      }
    });

    if (chart) chart.destroy();
    chart = new Chart(chartCtx, {
      type: "line",
      data: { datasets },
      plugins: [todayLinePlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 24 } },
        interaction: { mode: "nearest", axis: "x", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => {
                if (!items.length) return "";
                return new Date(items[0].parsed.x).toLocaleDateString("en-AU", {
                  day: "numeric", month: "short", year: "numeric"
                });
              },
              label: (c) => {
                const lbl = c.dataset.label.replace(" (post-expiry)", "");
                return `${lbl}: ${fmtMoney(c.parsed.y)}`;
              }
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: (v) => "$" + (v / 1000).toFixed(0) + "k",
              font: { family: "'IBM Plex Mono', monospace", size: 11 }
            },
            title: {
              display: true,
              text: "Annual base salary (AUD)",
              font: { family: "'IBM Plex Mono', monospace", size: 11 },
              color: "#847b72"
            },
            grid: { color: "#e4ddd1" }
          },
          x: {
            type: "time",
            time: {
              unit: "year",
              displayFormats: { year: "yyyy", month: "MMM yyyy" }
            },
            ticks: { font: { family: "'IBM Plex Mono', monospace", size: 11 } },
            title: { display: false },
            grid: { color: "#e4ddd1" }
          }
        }
      }
    });
  }

  function renderChartToolbar() {
    const toolbar = document.getElementById("chart-toolbar");
    if (!toolbar) return;

    toolbar.innerHTML = `
      <div class="seg" id="metricSeg">
        <button data-metric="top"      class="${chartSeries === "top"      ? "on" : ""}">Top-of-scale</button>
        <button data-metric="graduate" class="${chartSeries === "graduate" ? "on" : ""}">Graduate</button>
      </div>
      <div class="chart-legend-chips" id="lcChips">
        ${data.map(j => {
          const color = PALETTE[j.code] || "#888";
          const off   = hiddenCodes.has(j.code) ? " off" : "";
          return `<span class="lc${off}" data-code="${j.code}">
            <span class="sw" style="background:${color}"></span>${j.code}
          </span>`;
        }).join("")}
      </div>
    `;

    toolbar.querySelectorAll("#metricSeg button").forEach(btn => {
      btn.addEventListener("click", () => {
        toolbar.querySelectorAll("#metricSeg button").forEach(b => b.classList.remove("on"));
        btn.classList.add("on");
        buildChart(btn.dataset.metric);
        writeHash();
      });
    });

    toolbar.querySelectorAll(".lc").forEach(chip => {
      chip.addEventListener("click", () => {
        const code = chip.dataset.code;
        if (hiddenCodes.has(code)) {
          hiddenCodes.delete(code);
          chip.classList.remove("off");
        } else {
          hiddenCodes.add(code);
          chip.classList.add("off");
        }
        buildChart(chartSeries);
      });
    });
  }

  renderChartToolbar();
  buildChart("top");

  // =====================================================================
  // Phase 7 — Jurisdiction detail cards
  // =====================================================================

  function buildCards() {
    const container = document.getElementById("detail-cards");
    if (!container) return;

    container.innerHTML = data.map((j) => {
      // Source id → 1-based display number for this card
      const srcIdx = {};
      j.sources.forEach((s, i) => { srcIdx[s.id] = i + 1; });

      const gradCurrent = currentRowIdx(j.graduate.schedule);
      const topCurrent  = currentRowIdx(j.top.schedule);

      function salaryRowsHtml(schedule, currentIdx) {
        return schedule.map((row, i) => {
          const isCurrent = i === currentIdx;
          const srcNum    = srcIdx[row.sourceId] || null;
          const footnote  = srcNum
            ? `<a class="footnote-ref" href="#${row.sourceId}" title="Source ${srcNum}">[${srcNum}]</a>`
            : "";
          const noteEl = row.increase
            ? `<span class="note">${row.increase}</span>`
            : `<span></span>`;
          return `
            <div class="salary-row${isCurrent ? " current" : ""}">
              <span class="dt">${fmtDate(row.date)}</span>
              ${noteEl}
              <span class="amt">${fmtMoney(row.salary)}${footnote}</span>
            </div>
          `;
        }).join("");
      }

      const verifiedStamp = j.verifiedOn ? `
        <span class="verified">
          <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Verified ${fmtDate(j.verifiedOn).toUpperCase()}
        </span>` : "";

      const notesHtml = j.ea.notes
        ? `<div class="jc-notes"><b>Notes.</b> ${renderMd(j.ea.notes)}</div>`
        : "";

      const pubRow = j.ea.published
        ? `<div><dt>Published</dt><dd>${fmtDate(j.ea.published)}</dd></div>`
        : "";

      const sourcesHtml = `
        <div class="jc-sources">
          <div class="jc-sources-head"><h4>Sources</h4></div>
          <ol class="src-list">
            ${j.sources.map((s) => {
              const pub = s.published && s.published !== "not stated"
                ? `pub. ${fmtDate(s.published)}`
                : s.published === "not stated" ? "date not stated" : "";
              const meta = [pub, `accessed ${fmtDate(s.accessed)}`].filter(Boolean).join(" · ");
              return `
                <li id="${s.id}">
                  <a class="src-link" href="${s.url}" target="_blank" rel="noopener noreferrer">${s.url}</a>
                  <span class="src-meta">${meta}</span>
                  ${s.usedFor ? `<span class="src-detail">${s.usedFor}</span>` : ""}
                </li>
              `;
            }).join("")}
          </ol>
        </div>
      `;

      return `
        <article class="juris-card" id="detail-${j.code}">
          <details class="card-collapse">
            <summary>
              <div class="jc-head">
                <div>
                  <div class="jc-title">${j.name} <span class="code">${j.code}</span></div>
                  <div class="jc-sub">${j.system}</div>
                </div>
                ${verifiedStamp}
              </div>
            </summary>
            <div class="jc-body">
              <div class="jc-meta">
                <div class="jc-col-label">Agreement</div>
                <dl>
                  <div><dt>Current EA</dt><dd>${j.ea.name}</dd></div>
                  <div>
                    <dt>Status</dt>
                    <dd><span class="status-pill ${STATUS_CLASS[j.ea.status] || ""}">
                      ${STATUS_LABEL[j.ea.status] || j.ea.status}
                    </span></dd>
                  </div>
                  <div><dt>Commenced</dt><dd>${fmtDate(j.ea.commenced)}</dd></div>
                  <div><dt>Nominal expiry</dt><dd>${fmtDate(j.ea.expires)}</dd></div>
                  ${pubRow}
                </dl>
              </div>
              <div>
                <details class="classifier-collapse">
                  <summary>Graduate</summary>
                  <div class="jc-classifier">${j.graduate.classification}</div>
                </details>
                <div class="salary-rows">${salaryRowsHtml(j.graduate.schedule, gradCurrent)}</div>
              </div>
              <div>
                <details class="classifier-collapse">
                  <summary>Top-of-scale classroom teacher</summary>
                  <div class="jc-classifier">${j.top.classification}</div>
                </details>
                <div class="salary-rows">${salaryRowsHtml(j.top.schedule, topCurrent)}</div>
              </div>
            </div>
            ${notesHtml}
            ${sourcesHtml}
          </details>
        </article>
      `;
    }).join("");
  }

  buildCards();

  // =====================================================================
  // Phase 8 — Provenance section
  // =====================================================================

  function buildProvenance() {
    const section = document.getElementById("provenance");
    if (!section) return;

    // Remove any existing generated content (keep .sec-head and .sec-sub)
    section.querySelectorAll(".provenance-content").forEach(el => el.remove());

    const container = document.createElement("div");
    container.className = "provenance-content";

    // Freshness table
    const freshnessHtml = `
      <h3 class="prov-sub-head">Data freshness</h3>
      <div class="table-wrap" style="margin-bottom:40px;">
        <table class="salary-table">
          <thead>
            <tr>
              <th>Jurisdiction</th>
              <th>Enterprise Agreement</th>
              <th>Status</th>
              <th>EA expiry</th>
              <th>Last verified</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(j => `
              <tr>
                <td>
                  <div class="juris">
                    <a href="#detail-${j.code}" style="text-decoration:none;color:inherit">${j.name}</a>
                  </div>
                  <div class="juris-sub">${j.code}</div>
                </td>
                <td style="font-size:13px;color:var(--ink-2);line-height:1.4;">${j.ea.name}</td>
                <td>
                  <span class="status-pill ${STATUS_CLASS[j.ea.status] || ""}">
                    ${STATUS_LABEL[j.ea.status] || j.ea.status}
                  </span>
                </td>
                <td style="font-family:var(--mono);font-size:12.5px;">${fmtDate(j.ea.expires)}</td>
                <td style="font-family:var(--mono);font-size:12px;color:var(--ink-3);">${fmtDate(j.verifiedOn)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;

    // Changelog
    const changelogHtml = CHANGELOG.length ? `
      <h3 class="prov-sub-head">Recent changes</h3>
      <div class="change-log">
        ${CHANGELOG.map(entry => `
          <div class="cl-when">
            <div class="cl-date">${fmtDate(entry.date)}</div>
            <div class="cl-code">${entry.jurisdiction}</div>
          </div>
          <div class="cl-what">${entry.summary}</div>
        `).join("")}
      </div>
    ` : "";

    container.innerHTML = freshnessHtml + changelogHtml;
    section.appendChild(container);
  }

  buildProvenance();

  // =====================================================================
  // Phase 9 — CSV download
  // =====================================================================

  function buildDownloads() {
    const dataCell = document.querySelector("footer .foot-grid > div:last-child");
    if (!dataCell) return;

    const btn = document.createElement("button");
    btn.textContent = "↓ Download CSV";
    btn.style.cssText = [
      "margin-top:10px",
      "font-family:var(--mono)",
      "font-size:11.5px",
      "color:var(--ink-3)",
      "background:none",
      "border:1px solid var(--rule-strong)",
      "border-radius:3px",
      "padding:5px 10px",
      "cursor:pointer",
      "display:block",
      "letter-spacing:0.02em"
    ].join(";");
    btn.addEventListener("mouseover", () => { btn.style.color = "var(--ink)"; btn.style.borderColor = "var(--ink-2)"; });
    btn.addEventListener("mouseout",  () => { btn.style.color = "var(--ink-3)"; btn.style.borderColor = "var(--rule-strong)"; });

    btn.addEventListener("click", () => {
      const header = [
        "Jurisdiction", "Code",
        "Graduate salary", "Top-of-scale salary", "Gap",
        "EA name", "EA status", "EA commenced", "EA expires",
        "Last verified"
      ];
      const csvRows = data.map(j => {
        const grad = valueAt(j.graduate.schedule, TODAY);
        const top  = valueAt(j.top.schedule,      TODAY);
        const gap  = grad != null && top != null ? top - grad : "";
        return [
          j.name, j.code,
          grad ?? "", top ?? "", gap,
          j.ea.name, j.ea.status, j.ea.commenced, j.ea.expires,
          j.verifiedOn ?? ""
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
      });
      const csv  = [header.join(","), ...csvRows].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement("a"), {
        href: url,
        download: `teacher-salaries-au-${TODAY}.csv`
      });
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    dataCell.appendChild(btn);
  }

  buildDownloads();

  // =====================================================================
  // Phase 10 — popstate (browser back/forward restores hash state)
  // =====================================================================

  window.addEventListener("popstate", () => {
    // Reset to defaults, then re-read hash
    sortKey = "name"; sortDir = 1; filterStatus = "all"; chartSeries = "top";
    selectedCodes.clear(); hiddenCodes.clear();
    readHash();
    // Re-sync filter buttons
    document.querySelectorAll(".filter-group button").forEach(b => {
      b.classList.toggle("on", b.dataset.f === filterStatus);
    });
    renderTable();
    updateCmpBar();
    renderComparePanel();
    renderChartToolbar();
    buildChart(chartSeries);
  });

  // =====================================================================
  // Colophon / footer
  // =====================================================================

  const totalSources = data.reduce((n, j) => n + j.sources.length, 0);

  const elLastUpdated  = document.getElementById("last-updated");
  const elSourceCount  = document.getElementById("source-count");
  const elFooterDate   = document.getElementById("footer-last-updated");

  if (elLastUpdated) elLastUpdated.textContent  = fmtDate(TODAY);
  if (elSourceCount) elSourceCount.textContent  = totalSources;
  if (elFooterDate)  elFooterDate.textContent   = fmtDate(TODAY);

})();
