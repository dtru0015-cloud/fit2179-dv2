// Australia's Bushfire Crisis — DV2 FIT2179
// Dinh Duy Truong | 33538921 | May 2026

const embedOpts = { actions: false, renderer: "svg", theme: "default" };
const vegaOpts  = { actions: false, renderer: "svg" };

// ─── Year slider → event popup ───────────────────────────────────────────────
const eventData = {
  2001: { name: "Black Christmas",     area: "753,314 ha",    deaths: 0,   homes: 109,  loss: "$70M"  },
  2003: { name: "Alpine Fires VIC",    area: "1,100,000 ha",  deaths: 0,   homes: 41,   loss: "$120M" },
  2009: { name: "Black Saturday",      area: "450,000 ha",    deaths: 173, homes: 2029, loss: "$4.4B" },
  2014: { name: "Hazelwood Mine Fire", area: "—",             deaths: 0,   homes: 0,    loss: "$650M" },
  2015: { name: "Sampson Flat",        area: "12,600 ha",     deaths: 0,   homes: 27,   loss: "$15M"  },
  2016: { name: "Yarloop",             area: "69,000 ha",     deaths: 2,   homes: 181,  loss: "$200M" },
  2018: { name: "Tathra",              area: "1,900 ha",      deaths: 0,   homes: 69,   loss: "$25M"  },
  2019: { name: "🔥 Black Summer",     area: "24,000,000 ha", deaths: 33,  homes: 3000, loss: "$103B" },
  2020: { name: "Post Black Summer",   area: "96,000,000 ha", deaths: 0,   homes: 0,    loss: "—"     },
  2021: { name: "Wooroloo",            area: "10,000 ha",     deaths: 0,   homes: 86,   loss: "$50M"  }
};

// ─── State data (keyed by whatever datum.state is in your CSV) ────────────────
// Keys here must match exactly what's in the 'state' column of your CSV.
// Common formats: "New South Wales" or "NSW" — check your CSV and adjust if needed.
const stateData = {
  // ── Full-name keys (most common in Australian GIS data) ──
  "New South Wales": {
    code: "NSW", riskScore: 92, pctFireProne: 67, riskChange: "+23 pts",
    blackSummer: { area: "5.5M ha", deaths: 25,  homes: "2,476", loss: "$4.5B" },
    worstEvent: "Black Summer 2019",
    animals: "1.5B+ animals killed (Black Summer)",
    fact: "Highest-risk state. 80% of the Blue Mountains burned in 2019. Sydney's urban fringe expands directly into fire-prone bush."
  },
  "Victoria": {
    code: "VIC", riskScore: 88, pctFireProne: 58, riskChange: "+18 pts",
    blackSummer: { area: "1.5M ha", deaths: 5,   homes: "149",   loss: "$1.3B" },
    worstEvent: "Black Saturday 2009 — 173 deaths",
    animals: "~600M animals killed (Black Summer)",
    fact: "Australia's deadliest fire state. Black Saturday 2009 remains the nation's worst. Dense mountain ash on Melbourne's north-eastern fringe drives extreme risk."
  },
  "Queensland": {
    code: "QLD", riskScore: 72, pctFireProne: 71, riskChange: "+12 pts",
    blackSummer: { area: "~10M ha", deaths: 0,   homes: "71",    loss: "$130M" },
    worstEvent: "2019 Queensland Fires",
    animals: "~430M animals killed (Black Summer)",
    fact: "Large area burned but lower population exposure. Tropical savanna burns seasonally — fire risk peaks in the dry season, June–September."
  },
  "South Australia": {
    code: "SA",  riskScore: 75, pctFireProne: 54, riskChange: "+10 pts",
    blackSummer: { area: "450,000 ha", deaths: 0, homes: "0",    loss: "$70M"  },
    worstEvent: "Ash Wednesday 1983 — 28 deaths",
    animals: "~110M animals killed (Black Summer)",
    fact: "High summer temperatures push fire danger into Catastrophic range frequently. The Adelaide Hills are a chronic, recurring risk corridor."
  },
  "Western Australia": {
    code: "WA",  riskScore: 68, pctFireProne: 49, riskChange: "+9 pts",
    blackSummer: { area: "—",         deaths: 0,  homes: "0",    loss: "—"     },
    worstEvent: "Wooroloo 2021 — 86 homes",
    animals: "~41M animals killed (Black Summer)",
    fact: "South-west WA has seen dramatic rainfall decline since the 1970s. The Darling Scarp is the primary risk corridor near Perth."
  },
  "Tasmania": {
    code: "TAS", riskScore: 62, pctFireProne: 43, riskChange: "+14 pts",
    blackSummer: { area: "~200K ha",  deaths: 0,  homes: "3",    loss: "$50M"  },
    worstEvent: "2019 Wilderness Fires",
    animals: "~61M animals killed (Black Summer)",
    fact: "Rapid risk growth — ancient rainforest and peatlands not traditionally fire-adapted are now burning regularly due to climate drying."
  },
  "Northern Territory": {
    code: "NT",  riskScore: 48, pctFireProne: 82, riskChange: "+5 pts",
    blackSummer: { area: "—",         deaths: 0,  homes: "0",    loss: "—"     },
    worstEvent: "Annual savanna burns (~40M ha/yr)",
    animals: "~272M animals killed (Black Summer)",
    fact: "Lowest risk score despite burning the most land. Sparse population and managed Indigenous burns keep human exposure low. 50%+ of NT burns every year."
  },
  "Australian Capital Territory": {
    code: "ACT", riskScore: 80, pctFireProne: 61, riskChange: "+16 pts",
    blackSummer: { area: "~82K ha",   deaths: 0,  homes: "0",    loss: "$20M"  },
    worstEvent: "2003 Canberra Fires — 4 deaths, 487 homes",
    animals: "~5M animals killed (Black Summer)",
    fact: "High risk for its small size. The 2003 fires entered Canberra suburbs — a rare urban fire incursion. 70% of the ACT is national park or bush reserve."
  },

  // ── Short-code fallbacks (if your CSV uses "NSW" etc. instead) ──
  "NSW": { ref: "New South Wales" },
  "VIC": { ref: "Victoria" },
  "QLD": { ref: "Queensland" },
  "SA":  { ref: "South Australia" },
  "WA":  { ref: "Western Australia" },
  "TAS": { ref: "Tasmania" },
  "NT":  { ref: "Northern Territory" },
  "ACT": { ref: "Australian Capital Territory" }
};

function resolveState(key) {
  if (!key) return null;
  const entry = stateData[key];
  if (!entry) return null;
  if (entry.ref) return stateData[entry.ref]; // dereference short codes
  return entry;
}

// ─── Info box renderer ────────────────────────────────────────────────────────
const defaultCards = [
  { value: "8 States", label: "ASSESSED FOR RISK",  sub: "" },
  { value: "92 / 100", label: "NSW HIGHEST SCORE",  sub: "" },
  { value: "48 / 100", label: "NT LOWEST SCORE",    sub: "" },
  { value: "+23 pts",  label: "NSW RISE 2001–2021", sub: "" }
];

function card(value, label) {
  return `
    <div class="state-card">
      <div class="state-card-value">${value}</div>
      <div class="state-card-label">${label}</div>
    </div>`;
}

function renderInfoBox(cards, factHTML) {
  const box = document.getElementById('state-info-box');
  if (!box) { console.warn('state-info-box element not found'); return; }
  box.innerHTML = `
    <div class="state-cards-grid">
      ${cards.map(c => card(c.value, c.label)).join('')}
    </div>
    ${factHTML ? `<div class="state-fact">${factHTML}</div>` : ''}`;
}

function updateStateBox(key) {
  const s = resolveState(key);
  if (!s) { resetStateBox(); return; }
  renderInfoBox(
    [
      { value: s.code,                    label: "SELECTED STATE"        },
      { value: `${s.riskScore} / 100`,    label: "FIRE RISK SCORE"       },
      { value: `${s.pctFireProne}%`,      label: "% LAND FIRE-PRONE"     },
      { value: s.riskChange,              label: "RISE SINCE 2001"        }
    ],
    `<span style="color:#E67E22">●</span>&nbsp;
     <strong style="color:#E67E22">Black Summer impact:</strong>
     ${s.blackSummer.area} burned &middot; ${s.blackSummer.deaths} deaths
     &middot; ${s.blackSummer.homes} homes &middot; ${s.blackSummer.loss} loss.
     <br><span style="color:#E67E22">●</span>&nbsp;
     <strong style="color:#E67E22">Worst event:</strong> ${s.worstEvent}.
     <br><span style="color:#c8d8f0; font-style:italic;">${s.fact}</span>`
  );
}

function resetStateBox() {
  renderInfoBox(defaultCards, null);
}

// ─── Year popup ───────────────────────────────────────────────────────────────
let lastEvent = null;

function renderPopup(event, year) {
  const popup = document.getElementById('event-popup');
  if (!popup) return;
  popup.innerHTML = `
    <div style="background:linear-gradient(135deg,#1a0500,#4a1200);
                border:1px solid #E67E22;border-radius:8px;
                padding:14px 18px;color:white;margin-top:10px;">
      <div style="font-size:13px;font-weight:700;color:#E67E22;margin-bottom:8px;">
        📍 ${year}: ${event.name}</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;">
        <div>
          <div style="font-size:15px;font-weight:900;color:#F1C40F;">${event.area}</div>
          <div style="font-size:10px;color:#c9a090;text-transform:uppercase;margin-top:2px;">Area Burned</div>
        </div>
        <div>
          <div style="font-size:15px;font-weight:900;color:#F1C40F;">${event.deaths}</div>
          <div style="font-size:10px;color:#c9a090;text-transform:uppercase;margin-top:2px;">Deaths</div>
        </div>
        <div>
          <div style="font-size:15px;font-weight:900;color:#F1C40F;">
            ${typeof event.homes === 'number' ? event.homes.toLocaleString() : event.homes}</div>
          <div style="font-size:10px;color:#c9a090;text-transform:uppercase;margin-top:2px;">Homes Destroyed</div>
        </div>
        <div>
          <div style="font-size:15px;font-weight:900;color:#F1C40F;">${event.loss}</div>
          <div style="font-size:10px;color:#c9a090;text-transform:uppercase;margin-top:2px;">Economic Loss</div>
        </div>
      </div>
    </div>`;
}

function updateEventPopup(year) {
  const event = eventData[year];
  if (event) { lastEvent = { event, year }; renderPopup(event, year); }
  else if (lastEvent) { renderPopup(lastEvent.event, lastEvent.year); }
}

function updateYearLabel(year) {
  const label = document.getElementById('year-label');
  if (label) label.textContent = year;
}

// ─── Chart embeds ─────────────────────────────────────────────────────────────
let choroplethView, areaView;
let activeStateName = null;

vegaEmbed("#area_by_state", "area_by_state.vg.json", embedOpts)
  .then(result => { areaView = result.view; })
  .catch(console.error);

vegaEmbed("#choropleth_map", "choropleth_map.vg.json", embedOpts)
  .then(result => {
    choroplethView = result.view;
    resetStateBox();         // render default 4 cards on load
    updateEventPopup(2019);

    // Year slider ──────────────────────────────────────────────────────────────
    const slider = document.getElementById('year-slider');
    if (slider) {
      slider.addEventListener('input', function () {
        const val = +this.value;
        updateYearLabel(val);
        choroplethView.signal('year_select', val).run();
        if (areaView) areaView.signal('selected_year', val).run();
        updateEventPopup(val);
      });
    }

    // State dropdown ───────────────────────────────────────────────────────────
    const dropdown = document.getElementById('state-dropdown');
    if (dropdown) {
      dropdown.addEventListener('change', function () {
        const val = this.value === '' ? null : this.value;
        choroplethView.signal('state_select', val).run();
        activeStateName = val;
        val ? updateStateBox(val) : resetStateBox();
      });
    }

    // Circle / shape click ─────────────────────────────────────────────────────
    choroplethView.addEventListener('click', function (event, item) {
      // Clicked on blank ocean or no datum
      if (!item || !item.datum) {
        activeStateName = null;
        choroplethView.signal('state_select', null).run();
        const dd = document.getElementById('state-dropdown');
        if (dd) dd.value = '';
        resetStateBox();
        return;
      }

      // datum.state = full name from CSV (e.g. "New South Wales")
      const stateName = item.datum.state || item.datum.state_code;
      if (!stateName) return;

      if (activeStateName === stateName) {
        // Second click on same state → deselect
        activeStateName = null;
        choroplethView.signal('state_select', null).run();
        const dd = document.getElementById('state-dropdown');
        if (dd) dd.value = '';
        resetStateBox();
      } else {
        activeStateName = stateName;
        choroplethView.signal('state_select', stateName).run();
        const dd = document.getElementById('state-dropdown');
        if (dd) dd.value = stateName;
        updateStateBox(stateName);
      }
    });

  }).catch(console.error);

vegaEmbed("#heatmap",         "heatmap.vg.json",         embedOpts).catch(console.error);
vegaEmbed("#dual_axis",       "dual_axis.vg.json",        embedOpts).catch(console.error);
vegaEmbed("#slope_chart",     "slope_chart.vg.json",      embedOpts).catch(console.error);
vegaEmbed("#deaths_chart",    "deaths_chart.vg.json",     embedOpts).catch(console.error);
vegaEmbed("#homes_chart",     "homes_chart.vg.json",      embedOpts).catch(console.error);
vegaEmbed("#wildlife_chart",  "wildlife_chart.vg.json",   vegaOpts ).catch(console.error);
vegaEmbed("#waterfall_chart", "waterfall_chart.vg.json",  vegaOpts ).catch(console.error);
vegaEmbed("#dot_matrix",      "dot_matrix.vg.json",       embedOpts).catch(console.error);
