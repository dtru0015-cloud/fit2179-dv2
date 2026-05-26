// Australia's Bushfire Crisis — DV2 FIT2179
// Dinh Duy Truong | 33538921 | May 2026

const embedOpts = {
  actions: false,
  renderer: "svg",
  theme: "default"
};

let choroplethView, areaView;

vegaEmbed("#choropleth_map", "choropleth_map.vg.json", embedOpts)
  .then(result => {
    choroplethView = result.view;
    choroplethView.addSignalListener('year_select', (name, value) => {
      if (areaView) {
        areaView.signal('selected_year', value).run();
      }
    });
  }).catch(console.error);

// Load area chart spec manually, add highlight layer, then embed
fetch('area_by_state.vg.json')
  .then(r => r.json())
  .then(spec => {
    // Add selected_year param
    spec.params = spec.params || [];
    spec.params.push({ name: "selected_year", value: 2021 });

    // Add red highlight dot for selected year
    spec.layer.push({
      "transform": [{ "filter": "datum.year == selected_year" }],
      "mark": { "type": "point", "filled": true, "size": 250,
                "color": "#C0392B", "stroke": "#fff", "strokeWidth": 2 },
      "encoding": {
        "x": { "field": "year", "type": "ordinal" },
        "y": { "field": "area_ha", "type": "quantitative" },
        "tooltip": [
          { "field": "event_name", "type": "nominal", "title": "Event" },
          { "field": "year", "type": "ordinal", "title": "Year" },
          { "field": "area_ha", "type": "quantitative", "title": "Area Burned (ha)", "format": ",.0f" },
          { "field": "deaths", "type": "quantitative", "title": "Deaths" }
        ]
      }
    });

    return vegaEmbed("#area_by_state", spec, embedOpts);
  })
  .then(result => {
    areaView = result.view;
  }).catch(console.error);

vegaEmbed("#bump_chart",     "bump_chart.vg.json",     embedOpts).catch(console.error);
vegaEmbed("#dual_axis",      "dual_axis.vg.json",      embedOpts).catch(console.error);
vegaEmbed("#heatmap",        "heatmap.vg.json",        embedOpts).catch(console.error);
vegaEmbed("#dot_plot",       "dot_plot.vg.json",       embedOpts).catch(console.error);
vegaEmbed("#bubble_scatter", "bubble_scatter.vg.json", embedOpts).catch(console.error);
vegaEmbed("#pop_exposure",   "pop_exposure.vg.json",   embedOpts).catch(console.error);
vegaEmbed("#slope_chart",    "slope_chart.vg.json",    embedOpts).catch(console.error);
