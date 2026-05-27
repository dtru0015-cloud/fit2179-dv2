// Australia's Bushfire Crisis — DV2 FIT2179
// Dinh Duy Truong | 33538921 | May 2026

const embedOpts = { actions: false, renderer: "svg", theme: "default" };

const eventData = {
  2001: { name: "Black Christmas", area: "753,314 ha", deaths: 0, homes: 109, loss: "$70M" },
  2003: { name: "Alpine Fires VIC", area: "1,100,000 ha", deaths: 0, homes: 41, loss: "$120M" },
  2009: { name: "Black Saturday", area: "450,000 ha", deaths: 173, homes: 2029, loss: "$4.4B" },
  2014: { name: "Hazelwood Mine Fire", area: "—", deaths: 0, homes: 0, loss: "$650M" },
  2015: { name: "Sampson Flat", area: "12,600 ha", deaths: 0, homes: 27, loss: "$15M" },
  2016: { name: "Yarloop", area: "69,000 ha", deaths: 2, homes: 181, loss: "$200M" },
  2018: { name: "Tathra", area: "1,900 ha", deaths: 0, homes: 69, loss: "$25M" },
  2019: { name: "🔥 Black Summer", area: "24,000,000 ha", deaths: 33, homes: 3000, loss: "$103B" },
  2020: { name: "Post Black Summer", area: "96,000,000 ha", deaths: 0, homes: 0, loss: "—" },
  2021: { name: "Wooroloo", area: "10,000 ha", deaths: 0, homes: 86, loss: "$50M" }
};

let lastEvent = null;

function renderPopup(event, year) {
  const popup = document.getElementById('event-popup');
  if (!popup) return;
  popup.innerHTML = `
    <div style="background:linear-gradient(135deg,#1a0500,#4a1200);border:1px solid #E67E22;
                border-radius:8px;padding:14px 18px;color:white;margin-top:10px;">
      <div style="font-size:13px;font-weight:700;color:#E67E22;margin-bottom:8px;">
        📍 ${year}: ${event.name}
      </div>
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

// Update year label display
function updateYearLabel(year) {
  const label = document.getElementById('year-label');
  if (label) label.textContent = year;
}

let choroplethView, areaView;

vegaEmbed("#choropleth_map", "choropleth_map.vg.json", embedOpts)
  .then(result => {
    choroplethView = result.view;
    updateEventPopup(2019);

    // Wire HTML slider to choropleth signal
    const slider = document.getElementById('year-slider');
    if (slider) {
      slider.addEventListener('input', function() {
        const val = +this.value;
        updateYearLabel(val);
        choroplethView.signal('year_select', val).run();
        if (areaView) areaView.signal('selected_year', val).run();
        updateEventPopup(val);
      });
    }

    // Wire HTML dropdown to choropleth signal
    const dropdown = document.getElementById('state-dropdown');
    if (dropdown) {
      dropdown.addEventListener('change', function() {
        const val = this.value === 'null' ? null : this.value;
        choroplethView.signal('state_select', val).run();
      });
    }
  }).catch(console.error);

fetch('area_by_state.vg.json')
  .then(r => r.json())
  .then(spec => {
    spec.params = spec.params || [];
    spec.params.push({ name: "selected_year", value: 2019 });

    spec.layer.push({
      "transform": [{ "filter": "datum.year == selected_year" }],
      "mark": { "type": "point", "filled": true, "size": 300,
                "color": "#C0392B", "stroke": "#fff", "strokeWidth": 2 },
      "encoding": {
        "x": { "field": "year", "type": "ordinal" },
        "y": { "field": "total_area_ha", "type": "quantitative" },
        "tooltip": [
          { "field": "year", "type": "ordinal", "title": "Year" },
          { "field": "total_area_ha", "type": "quantitative", "title": "Area Burned (ha)", "format": ",.0f" },
          { "field": "notable_event", "type": "nominal", "title": "Event" }
        ]
      }
    });

    return vegaEmbed("#area_by_state", spec, embedOpts);
  })
  .then(result => { areaView = result.view; })
  .catch(console.error);

vegaEmbed("#heatmap",         "heatmap.vg.json",         embedOpts).catch(console.error);
vegaEmbed("#dual_axis",       "dual_axis.vg.json",        embedOpts).catch(console.error);
vegaEmbed("#small_multiples", "small_multiples.vg.json",  embedOpts).catch(console.error);
vegaEmbed("#dot_plot",        "dot_plot.vg.json",         embedOpts).catch(console.error);
vegaEmbed("#bubble_scatter",  "bubble_scatter.vg.json",   embedOpts).catch(console.error);
vegaEmbed("#dot_matrix",      "dot_matrix.vg.json",       embedOpts).catch(console.error);
vegaEmbed("#slope_chart",     "slope_chart.vg.json",      embedOpts).catch(console.error);
