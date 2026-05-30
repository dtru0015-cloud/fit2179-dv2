// Australia's Bushfire Crisis — DV2 FIT2179
// Dinh Duy Truong | 33538921 | May 2026

const embedOpts = { actions: false, renderer: "svg", theme: "default" };
const vegaOpts  = { actions: false, renderer: "svg" };

// ─── Event popup data (year slider) ─────────────────────────────────────────
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

// ─── State-specific data for click info box ──────────────────────────────────
const stateData = {
  NSW: {
    name: "New South Wales",
    riskScore: 92,
    pctFireProne: 67,
    worstEvent: "Black Summer 2019",
    worstAreaBurned: "5.5M ha",
    worstDeaths: 25,
    worstHomes: 2476,
    riskRise: "+23 pts since 2001",
    fact: "Highest-risk state. Blue Mountains & coastal ranges are extreme-risk zones. Sydney's urban fringe expands directly into fire-prone bush."
  },
  VIC: {
    name: "Victoria",
    riskScore: 88,
    pctFireProne: 58,
    worstEvent: "Black Saturday 2009",
    worstAreaBurned: "450,000 ha",
    worstDeaths: 173,
    worstHomes: 2029,
    riskRise: "+18 pts since 2001",
    fact: "Australia's deadliest fire state. Dense mountain ash forests and an expanding urban fringe create extreme fire corridors north of Melbourne."
  },
  QLD: {
    name: "Queensland",
    riskScore: 72,
    pctFireProne: 71,
    worstEvent: "2019 Queensland Fires",
    worstAreaBurned: "~10M ha",
    worstDeaths: 0,
    worstHomes: 71,
    riskRise: "+12 pts since 2001",
    fact: "Large fire area but lower population exposure. Tropical savanna burns seasonally — risk peaks in dry season from June–September."
  },
  SA: {
    name: "South Australia",
    riskScore: 75,
    pctFireProne: 54,
    worstEvent: "Ash Wednesday 1983",
    worstAreaBurned: "208,000 ha",
    worstDeaths: 28,
    worstHomes: 383,
    riskRise: "+10 pts since 2001",
    fact: "High summer temperatures push fire danger scores frequently into 'Catastrophic' range. The Adelaide Hills are a chronic risk zone."
  },
  WA: {
    name: "Western Australia",
    riskScore: 68,
    pctFireProne: 49,
    worstEvent: "Wooroloo 2021",
    worstAreaBurned: "10,000 ha",
    worstDeaths: 0,
    worstHomes: 86,
    riskRise: "+9 pts since 2001",
    fact: "South-west WA has seen dramatic rainfall decline since the 1970s, increasing fire frequency. The Darling Scarp is the primary risk corridor."
  },
  TAS: {
    name: "Tasmania",
    riskScore: 62,
    pctFireProne: 43,
    worstEvent: "2019 Wilderness Fires",
    worstAreaBurned: "~200,000 ha",
    worstDeaths: 0,
    worstHomes: 3,
    riskRise: "+14 pts since 2001",
    fact: "Rapid risk increase driven by warming and drying. Ancient rainforest and peatlands — not traditionally fire-adapted — now burning regularly."
  },
  NT: {
    name: "Northern Territory",
    riskScore: 48,
    pctFireProne: 82,
    worstEvent: "Annual savanna fires",
    worstAreaBurned: "~40M ha/yr",
    worstDeaths: 0,
    worstHomes: 0,
    riskRise: "+5 pts since 2001",
    fact: "Lowest risk score despite burning the most land. Sparse population and managed Indigenous burns keep human exposure low. Over 50% burns every year."
  },
  ACT: {
    name: "Aust. Capital Territory",
    riskScore: 80,
    pctFireProne: 61,
    worstEvent: "2003 Canberra Fires",
    worstAreaBurned: "160,000 ha",
    worstDeaths: 4,
    worstHomes: 487,
    riskRise: "+16 pts since 2001",
    fact: "High risk relative to size. The 2003 fires entered Canberra suburbs — a rare urban fire incursion. 70% of the ACT is national park and bush reserve."
  }
};

// ─── Default (all-states) info box content ──────────────────────────────────
const defaultBoxContent = [
  { value: "8 States",  label: "ASSESSED FOR RISK"  },
  { value: "92 / 100",  label: "NSW HIGHEST SCORE"  },
  { value: "48 / 100",  label: "NT LOWEST SCORE"    },
  { value: "+23 pts",   label: "NSW RISE 2001–2021" }
];

function renderInfoBox(cards, factText) {
  const box = document.getElementById('state-info-box');
  if (!box) return;

  const cardsHTML = cards.map(c => `
    <div style="background:#0d1f3a;border:1px solid #1e3a5f;border-radius:8px;
                padding:14px 18px;text-align:center;">
      <div style="font-size:18px;font-weight:700;color:#E67E22;">${c.value}</div>
      <div style="font-size:10px;color:#8aabcc;text-transform:uppercase;
                  letter-spacing:0.07em;margin-top:4px;">${c.label}</div>
    </div>`).join('');

  const factHTML = factText ? `
    <div style="margin-top:10px;font-size:12px;color:#c8d8f0;line-height:1.55;
                padding:0 2px;">
      <span style="color:#E67E22;margin-right:6px;">●</span>${factText}
    </div>` : '';

  box.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      ${cardsHTML}
    </div>${factHTML}`;
}

function updateStateBox(stateCode) {
  const s = stateData[stateCode];
  if (!s) { resetStateBox(); return; }

  renderInfoBox([
    { value: s.name,            label: "SELECTED STATE"     },
    { value: `${s.riskScore} / 100`, label: "FIRE RISK SCORE"  },
    { value: `${s.pctFireProne}%`, label: "% LAND FIRE-PRONE" },
    { value: s.riskRise,        label: "RISK CHANGE 2001–2021" }
  ], `<strong style="color:#E67E22">${s.worstEvent}</strong>: ${s.worstAreaBurned} burned · ${s.worstDeaths} deaths · ${typeof s.worstHomes === 'number' ? s.worstHomes.toLocaleString() : s.worstHomes} homes lost. ${s.fact}`);
}

function resetStateBox() {
  renderInfoBox(defaultBoxContent, null);
}

// ─── Year slider popup ───────────────────────────────────────────────────────
let lastEvent = null;

function renderPopup(event, year) {
  const popup = document.getElementById('event-popup');
  if (!popup) return;
  popup.innerHTML = `
    <div style="background:linear-gradient(135deg,#1a0500,#4a1200);border:1px solid #E67E22;
                border-radius:8px;padding:14px 18px;color:white;margin-top:10px;">
      <div style="font-size:13px;font-weight:700;color:#E67E22;margin-bottom:8px;">📍 ${year}: ${event.name}</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;">
        <div><div style="font-size:15px;font-weight:900;color:#F1C40F;">${event.area}</div>
             <div style="font-size:10px;color:#c9a090;text-transform:uppercase;margin-top:2px;">Area Burned</div></div>
        <div><div style="font-size:15px;font-weight:900;color:#F1C40F;">${event.deaths}</div>
             <div style="font-size:10px;color:#c9a090;text-transform:uppercase;margin-top:2px;">Deaths</div></div>
        <div><div style="font-size:15px;font-weight:900;color:#F1C40F;">${typeof event.homes === 'number' ? event.homes.toLocaleString() : event.homes}</div>
             <div style="font-size:10px;color:#c9a090;text-transform:uppercase;margin-top:2px;">Homes Destroyed</div></div>
        <div><div style="font-size:15px;font-weight:900;color:#F1C40F;">${event.loss}</div>
             <div style="font-size:10px;color:#c9a090;text-transform:uppercase;margin-top:2px;">Economic Loss</div></div>
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

// ─── Chart embeds ────────────────────────────────────────────────────────────
let choroplethView, areaView;
let activeStateCode = null;

vegaEmbed("#area_by_state", "area_by_state.vg.json", embedOpts)
  .then(result => { areaView = result.view; })
  .catch(console.error);

vegaEmbed("#choropleth_map", "choropleth_map.vg.json", embedOpts)
  .then(result => {
    choroplethView = result.view;
    resetStateBox();
    updateEventPopup(2019);

    // ── Year slider ──────────────────────────────────────────────────────────
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

    // ── State dropdown ───────────────────────────────────────────────────────
    const dropdown = document.getElementById('state-dropdown');
    if (dropdown) {
      dropdown.addEventListener('change', function () {
        const val = this.value === 'null' ? null : this.value;
        choroplethView.signal('state_select', val).run();
        if (val) { activeStateCode = val; updateStateBox(val); }
        else      { activeStateCode = null; resetStateBox(); }
      });
    }

    // ── Map click → state info box ───────────────────────────────────────────
    choroplethView.addEventListener('click', function (event, item) {
      if (!item || !item.datum) {
        // Clicked blank area — deselect
        activeStateCode = null;
        choroplethView.signal('state_select', null).run();
        const dd = document.getElementById('state-dropdown');
        if (dd) dd.value = 'null';
        resetStateBox();
        return;
      }

      const code = item.datum.state_code;
      if (!code) return;

      if (activeStateCode === code) {
        // Click same state again → deselect
        activeStateCode = null;
        choroplethView.signal('state_select', null).run();
        const dd = document.getElementById('state-dropdown');
        if (dd) dd.value = 'null';
        resetStateBox();
      } else {
        activeStateCode = code;
        choroplethView.signal('state_select', code).run();
        const dd = document.getElementById('state-dropdown');
        if (dd) dd.value = code;
        updateStateBox(code);
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
