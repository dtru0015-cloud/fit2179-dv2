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

// ─── Per-state data (keys = full state name from CSV) ────────────────────────
const stateData = {
  "New South Wales": {
    code: "NSW", riskScore: 92, pctFireProne: 67, riskChange: "+23 pts",
    blackSummer: { area: "5.5M ha", deaths: 25, homes: "2,476", loss: "$4.5B" },
    worstEvent: "Black Summer 2019",
    fact: "Highest-risk state. 80% of the Blue Mountains burned in 2019. Sydney's expanding urban fringe grows directly into fire-prone bush."
  },
  "Victoria": {
    code: "VIC", riskScore: 88, pctFireProne: 58, riskChange: "+18 pts",
    blackSummer: { area: "1.5M ha", deaths: 5, homes: "149", loss: "$1.3B" },
    worstEvent: "Black Saturday 2009 — 173 deaths",
    fact: "Australia's deadliest fire state. Dense mountain ash forests and Melbourne's north-eastern fringe create extreme fire corridors."
  },
  "Queensland": {
    code: "QLD", riskScore: 72, pctFireProne: 71, riskChange: "+12 pts",
    blackSummer: { area: "~10M ha", deaths: 0, homes: "71", loss: "$130M" },
    worstEvent: "2019 Queensland Fires",
    fact: "Large area burned but lower population exposure. Tropical savanna burns seasonally — fire risk peaks June–September."
  },
  "South Australia": {
    code: "SA", riskScore: 75, pctFireProne: 54, riskChange: "+10 pts",
    blackSummer: { area: "450,000 ha", deaths: 0, homes: "0", loss: "$70M" },
    worstEvent: "Ash Wednesday 1983 — 28 deaths",
    fact: "High summer temperatures push fire danger into Catastrophic range frequently. The Adelaide Hills are a chronic risk corridor."
  },
  "Western Australia": {
    code: "WA", riskScore: 68, pctFireProne: 49, riskChange: "+9 pts",
    blackSummer: { area: "—", deaths: 0, homes: "0", loss: "—" },
    worstEvent: "Wooroloo 2021 — 86 homes",
    fact: "South-west WA rainfall has declined dramatically since the 1970s. The Darling Scarp near Perth is the primary risk corridor."
  },
  "Tasmania": {
    code: "TAS", riskScore: 62, pctFireProne: 43, riskChange: "+14 pts",
    blackSummer: { area: "~200K ha", deaths: 0, homes: "3", loss: "$50M" },
    worstEvent: "2019 Wilderness Fires",
    fact: "Ancient rainforest and peatlands — not traditionally fire-adapted — now burning regularly due to climate drying."
  },
  "Northern Territory": {
    code: "NT", riskScore: 48, pctFireProne: 82, riskChange: "+5 pts",
    blackSummer: { area: "—", deaths: 0, homes: "0", loss: "—" },
    worstEvent: "Annual savanna burns (~40M ha/yr)",
    fact: "Lowest risk score despite burning the most land. Sparse population and managed Indigenous burns keep human exposure low."
  },
  "Australian Capital Territory": {
    code: "ACT", riskScore: 80, pctFireProne: 61, riskChange: "+16 pts",
    blackSummer: { area: "~82K ha", deaths: 0, homes: "0", loss: "$20M" },
    worstEvent: "2003 Canberra Fires — 4 deaths, 487 homes",
    fact: "High risk for its small size. The 2003 fires entered Canberra suburbs. 70% of the ACT is national park or bush reserve."
  }
};

// ─── Info box — uses existing .stat-box / .sv / .sl CSS classes ──────────────
function statBox(value, label) {
  return `<div class="stat-box"><div class="sv">${value}</div><div class="sl">${label}</div></div>`;
}

function renderInfoBox(cards, factHTML) {
  const box = document.getElementById('state-info-box');
  if (!box) { console.warn('state-info-box element not found'); return; }
  box.innerHTML =
    cards.map(c => statBox(c.value, c.label)).join('') +
    (factHTML
      ? `<div style="grid-column:1/-1;font-size:0.78rem;color:#aaa;margin-top:4px;
                     line-height:1.65;border-top:1px solid #1e3a55;padding-top:8px;">${factHTML}</div>`
      : '');
}

const defaultCards = [
  { value: "8 States", label: "Assessed for risk"  },
  { value: "92 / 100", label: "NSW highest score"  },
  { value: "48 / 100", label: "NT lowest score"    },
  { value: "+23 pts",  label: "NSW rise 2001–2021" }
];

function resetStateBox() { renderInfoBox(defaultCards, null); }

function updateStateBox(stateName) {
  const s = stateData[stateName];
  if (!s) { resetStateBox(); return; }
  renderInfoBox(
    [
      { value: s.code,                 label: "Selected state"       },
      { value: `${s.riskScore} / 100`, label: "Fire risk score"      },
      { value: `${s.pctFireProne}%`,   label: "% land fire-prone"    },
      { value: s.riskChange,           label: "Rise since 2001"       }
    ],
    `<span style="color:#E67E22">●</span>
     <strong style="color:#E67E22">Black Summer:</strong>
     ${s.blackSummer.area} burned · ${s.blackSummer.deaths} deaths ·
     ${s.blackSummer.homes} homes · ${s.blackSummer.loss} loss.<br>
     <span style="color:#E67E22">●</span>
     <strong style="color:#E67E22">Worst event:</strong> ${s.worstEvent}.<br>
     <em>${s.fact}</em>`
  );
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
    resetStateBox();
    updateEventPopup(2019);

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

    const dropdown = document.getElementById('state-dropdown');
    if (dropdown) {
      dropdown.addEventListener('change', function () {
        const val = this.value === 'null' ? null : this.value;
        choroplethView.signal('state_select', val).run();
        activeStateName = val;
        val ? updateStateBox(val) : resetStateBox();
      });
    }

    choroplethView.addEventListener('click', function (event, item) {
      if (!item || !item.datum || !item.datum.state) {
        activeStateName = null;
        choroplethView.signal('state_select', null).run();
        const dd = document.getElementById('state-dropdown');
        if (dd) dd.value = 'null';
        resetStateBox();
        return;
      }

      const stateName = item.datum.state;

      if (activeStateName === stateName) {
        activeStateName = null;
        choroplethView.signal('state_select', null).run();
        const dd = document.getElementById('state-dropdown');
        if (dd) dd.value = 'null';
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
vegaEmbed("#seasonal_trend",     "seasonal_trend.vg.json",     embedOpts).catch(console.error);
vegaEmbed("#fire_frequency_map", "fire_frequency_map.vg.json", embedOpts).catch(console.error);
vegaEmbed("#deaths_chart",    "deaths_chart.vg.json",     embedOpts).catch(console.error);
vegaEmbed("#homes_chart",     "homes_chart.vg.json",      embedOpts).catch(console.error);
vegaEmbed("#wildlife_chart",  "wildlife_chart.vg.json",   vegaOpts ).catch(console.error);
vegaEmbed("#waterfall_chart", "waterfall_chart.vg.json",  vegaOpts ).catch(console.error);
vegaEmbed("#dot_matrix",      "dot_matrix.vg.json",       embedOpts).catch(console.error);
