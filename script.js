(function () {
  "use strict";

  const data = window.SALARY_DATA || [];
  const TODAY = window.DATA_AS_OF || "2026-04-17";

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

  const STATUS_LABEL = {
    "current": "Current",
    "expired-in-negotiation": "Expired, in negotiation",
    "in-negotiation": "In negotiation"
  };

  // Pick the scheduled value in force on a given ISO date.
  function valueAt(schedule, iso) {
    if (!schedule || !schedule.length) return null;
    const t = new Date(iso).getTime();
    let chosen = null;
    for (const row of schedule) {
      if (new Date(row.date).getTime() <= t) chosen = row;
    }
    return chosen ? chosen.salary : null;
  }

  // ---- Summary table ---------------------------------------------------

  const tbody = document.querySelector("#summary-table tbody");
  const rows = data.map((j) => {
    const grad = valueAt(j.graduate.schedule, TODAY);
    const top = valueAt(j.top.schedule, TODAY);
    return {
      j,
      name: j.name,
      graduate: grad,
      top: top,
      gap: grad != null && top != null ? top - grad : null,
      expiry: j.ea.expires,
      status: j.ea.status
    };
  });

  let sortKey = "name";
  let sortDir = 1;

  function renderTable() {
    rows.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * sortDir;
      return String(av).localeCompare(String(bv)) * sortDir;
    });

    tbody.innerHTML = rows.map((r) => `
      <tr>
        <td><a href="#detail-${r.j.code}">${r.j.name}</a></td>
        <td class="num">${fmtMoney(r.graduate)}</td>
        <td class="num">${fmtMoney(r.top)}</td>
        <td class="num">${fmtMoney(r.gap)}</td>
        <td>${fmtDate(r.expiry)}</td>
        <td><span class="status-pill status-${r.status}">${STATUS_LABEL[r.status] || r.status}</span></td>
      </tr>
    `).join("");

    document.querySelectorAll("#summary-table th").forEach((th) => {
      th.classList.remove("sorted-asc", "sorted-desc");
      if (th.dataset.sort === sortKey) {
        th.classList.add(sortDir === 1 ? "sorted-asc" : "sorted-desc");
      }
    });
  }

  document.querySelectorAll("#summary-table th").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (key === sortKey) {
        sortDir = -sortDir;
      } else {
        sortKey = key;
        sortDir = 1;
      }
      renderTable();
    });
  });

  renderTable();

  // ---- Detail cards ----------------------------------------------------

  const details = document.getElementById("detail-cards");
  details.innerHTML = data.map((j) => {
    const unionDates = [...new Set([
      ...j.graduate.schedule.map((r) => r.date),
      ...j.top.schedule.map((r) => r.date)
    ])].sort();

    const salaryCell = (schedule, date) => {
      const row = schedule.find((r) => r.date === date);
      if (!row) return `<div class="salary-cell empty">—</div>`;
      const note = row.increase ? ` <span class="increase-note">(${row.increase})</span>` : "";
      return `<div class="salary-cell">${fmtMoney(row.salary)}${note}</div>`;
    };

    const scheduleRows = unionDates.map((d) => `
      <div class="date-cell">${fmtDate(d)}</div>
      ${salaryCell(j.graduate.schedule, d)}
      ${salaryCell(j.top.schedule, d)}
    `).join("");

    return `
      <article class="card" id="detail-${j.code}">
        <h3>${j.name} <span class="jurisdiction-code">${j.code}</span></h3>
        <div class="system">${j.system}</div>
        <div class="card-body">
          <section class="card-col">
            <h4>Agreement</h4>
            <dl>
              <dt>Current EA</dt><dd>${j.ea.name}</dd>
              <dt>Status</dt><dd><span class="status-pill status-${j.ea.status}">${STATUS_LABEL[j.ea.status] || j.ea.status}</span></dd>
              <dt>Commenced</dt><dd>${fmtDate(j.ea.commenced)}</dd>
              <dt>Nominal expiry</dt><dd>${fmtDate(j.ea.expires)}</dd>
              ${j.ea.published ? `<dt>Published</dt><dd>${fmtDate(j.ea.published)}</dd>` : ""}
            </dl>
          </section>

          <div class="salary-grid">
            <div class="salary-header-spacer"></div>
            <div class="salary-header">
              <h4>Graduate</h4>
              <div class="classification">Classification: ${j.graduate.classification}</div>
            </div>
            <div class="salary-header">
              <h4>Top-of-scale classroom teacher</h4>
              <div class="classification">Classification: ${j.top.classification}</div>
            </div>
            ${scheduleRows}
          </div>
        </div>

        ${j.ea.notes ? `<p class="notes">${j.ea.notes}</p>` : ""}

        <div class="sources">
          <strong>Sources</strong>
          <ol>
            ${j.sources.map((s) => `
              <li>
                <a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.url}</a>
                <br><span>accessed ${fmtDate(s.accessed)}${s.published ? `; published ${s.published === "not stated" ? "date not stated" : fmtDate(s.published)}` : ""}${s.usedFor ? ` — ${s.usedFor}` : ""}</span>
              </li>
            `).join("")}
          </ol>
        </div>
      </article>
    `;
  }).join("");

  // ---- Projection chart ------------------------------------------------

  const PALETTE = {
    NSW: "#7eb0dc", VIC: "#86c28a", QLD: "#d491c4",
    WA:  "#eaa962", SA:  "#e28b8b", TAS: "#7fc9be",
    ACT: "#aa99dc", NT:  "#c4a47a"
  };

  const ctx = document.getElementById("projection-chart").getContext("2d");
  let chart = null;

  function buildChart(series) {
    const todayTime = new Date(TODAY).getTime();
    const datasets = [];

    data.forEach((j) => {
      const expiryTime = new Date(j.ea.expires).getTime();
      const color = PALETTE[j.code] || "#888";
      const sched = j[series].schedule.map((r) => ({ x: r.date, y: r.salary }));
      if (!sched.length) return;

      const last = sched[sched.length - 1];
      const lastTime = new Date(last.x).getTime();

      // Solid line: schedule points, extended flat to EA expiry.
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
        stepped: "before"
      });

      // Dashed continuation for expired EAs: flat at last rate from expiry to today.
      if (todayTime > expiryTime) {
        datasets.push({
          label: j.code + " (post-expiry)",
          data: [
            { x: j.ea.expires, y: last.y },
            { x: TODAY, y: last.y }
          ],
          borderColor: color,
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
    chart = new Chart(ctx, {
      type: "line",
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "nearest", axis: "x", intersect: false },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              filter: (item, chartData) => !chartData.datasets[item.datasetIndex].hideInLegend
            },
            onClick: (e, legendItem, legend) => {
              const ci = legend.chart;
              const clickedLabel = legendItem.text;
              ci.data.datasets.forEach((ds, i) => {
                if (ds.label === clickedLabel || ds.label === clickedLabel + " (post-expiry)") {
                  ci.setDatasetVisibility(i, !ci.isDatasetVisible(i));
                }
              });
              ci.update();
            }
          },
          tooltip: {
            callbacks: {
              title: (items) => {
                if (!items.length) return "";
                const d = new Date(items[0].parsed.x);
                return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
              },
              label: (c) => `${c.dataset.label}: ${fmtMoney(c.parsed.y)}`
            }
          },
          title: {
            display: true,
            text: series === "top"
              ? "Top-of-scale classroom teacher salary (base FTE)"
              : "Graduate salary (base FTE)"
          }
        },
        scales: {
          y: {
            ticks: { callback: (v) => "$" + (v / 1000).toFixed(0) + "k" },
            title: { display: true, text: "Annual base salary (AUD)" }
          },
          x: {
            type: "time",
            time: {
              unit: "year",
              displayFormats: { year: "yyyy", month: "MMM yyyy" },
              tooltipFormat: "d MMM yyyy"
            },
            title: { display: true, text: "Date" }
          }
        }
      }
    });
  }

  buildChart("top");

  document.querySelectorAll("input[name='chart-series']").forEach((input) => {
    input.addEventListener("change", (e) => {
      if (e.target.checked) buildChart(e.target.value);
    });
  });

  // ---- Footer ----------------------------------------------------------
  document.getElementById("last-updated").textContent = fmtDate(TODAY);
})();
