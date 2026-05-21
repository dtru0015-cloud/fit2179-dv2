// Australia's Bushfire Crisis — DV2 FIT2179
// Dinh Duy Truong | 33538921 | May 2026

const embedOpts = {
  actions: false,
  renderer: "svg",
  theme: "default"
};

vegaEmbed("#choropleth_map", "choropleth_map.vg.json", embedOpts).catch(console.error);
vegaEmbed("#area_by_state",  "area_by_state.vg.json",  embedOpts).catch(console.error);
vegaEmbed("#bump_chart",     "bump_chart.vg.json",     embedOpts).catch(console.error);
vegaEmbed("#dual_axis",      "dual_axis.vg.json",      embedOpts).catch(console.error);
vegaEmbed("#heatmap",        "heatmap.vg.json",        embedOpts).catch(console.error);
vegaEmbed("#dot_plot",       "dot_plot.vg.json",       embedOpts).catch(console.error);
vegaEmbed("#bubble_scatter", "bubble_scatter.vg.json", embedOpts).catch(console.error);
vegaEmbed("#pop_exposure",   "pop_exposure.vg.json",   embedOpts).catch(console.error);
vegaEmbed("#slope_chart",    "slope_chart.vg.json",    embedOpts).catch(console.error);
