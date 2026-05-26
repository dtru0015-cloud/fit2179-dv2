// Australia's Bushfire Crisis — DV2 FIT2179
// Dinh Duy Truong | 33538921 | May 2026

const embedOpts = { actions: false, renderer: "svg", theme: "default" };

let choroplethView, areaView;

vegaEmbed("#choropleth_map", "choropleth_map.vg.json", embedOpts)
  .then(result => {
    choroplethView = result.view;
    choroplethView.addSignalListener('year_select', (name, value) => {
      if (areaView) areaView.signal('selected_year', value).run();
    });
  }).catch(console.error);

fetch('area_by_state.vg.json')
  .then(r => r.json())
  .then(spec => {
    spec.params = spec.params || [];
    spec.params.push({ name: "selected_year", value: 2021 });

    // Red highlight dot for selected year
    spec.layer.push({
      "transform": [{ "filter": "datum.year == selected_year" }],
      "mark": {
        "type": "point", "filled": true, "size": 300,
        "color": "#C0392B", "stroke": "#fff", "strokeWidth": 2
      },
      "encoding": {
        "x": { "field": "year", "type": "ordinal" },
        "y": { "field": "total_area_ha", "type": "quantitative" },
        "tooltip": [
          { "field": "year", "type": "ordinal", "title": "Year" },
          { "field": "total_area_ha", "type": "quantitative", "title": "Area Burned (ha)", "format": ",.0f" },
          { "field": "notable_event", "type": "nominal", "title": "Notable Event" }
        ]
      }
    });

    // Event label above red dot
    spec.layer.push({
      "transform": [
        { "filter": "datum.year == selected_year" },
        { "filter": "datum.notable_event != ''" }
      ],
      "mark": {
        "type": "text", "fontSize": 11, "fontWeight": "bold",
        "color": "#C0392B", "align": "center", "dy": -18
      },
      "encoding": {
        "x": { "field": "year", "type": "ordinal" },
        "y": { "field": "total_area_ha", "type": "quantitative" },
        "text": { "field": "notable_event", "type": "nominal" }
      }
    });

    return vegaEmbed("#area_by_state", spec, embedOpts);
  })
  .then(result => { areaView = result.view; })
  .catch(console.error);

vegaEmbed("#bump_chart",     "bump_chart.vg.json",     embedOpts).catch(console.error);
vegaEmbed("#dual_axis",      "dual_axis.vg.json",      embedOpts).catch(console.error);
vegaEmbed("#heatmap",        "heatmap.vg.json",        embedOpts).catch(console.error);
vegaEmbed("#dot_plot",       "dot_plot.vg.json",       embedOpts).catch(console.error);
vegaEmbed("#bubble_scatter", "bubble_scatter.vg.json", embedOpts).catch(console.error);
vegaEmbed("#pop_exposure",   "pop_exposure.vg.json",   embedOpts).catch(console.error);
vegaEmbed("#slope_chart",    "slope_chart.vg.json",    embedOpts).catch(console.error);
