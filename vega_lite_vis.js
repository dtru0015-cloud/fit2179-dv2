{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": 280,
  "data": {"url": "bushfire_area_by_state.csv"},
  "transform": [
    {"filter": "datum.state !== 'Northern Territory'"}
  ],
  "params": [
    {
      "name": "state_highlight",
      "select": {"type": "point", "fields": ["state"]},
      "bind": "legend"
    }
  ],
  "layer": [
    {
      "mark": {
        "type": "bar",
        "cornerRadiusTopLeft": 3,
        "cornerRadiusTopRight": 3
      },
      "encoding": {
        "x": {
          "field": "season",
          "type": "ordinal",
          "title": "Fire Season",
          "sort": null,
          "axis": {
            "labelAngle": -30, "labelFontSize": 9,
            "titleFontSize": 11, "titleColor": "#ffffff",
            "labelColor": "#cccccc", "domainColor": "#1e3a55", "tickColor": "#1e3a55"
          }
        },
        "y": {
          "field": "area_burned_ha",
          "type": "quantitative",
          "title": "Area Burned (ha)",
          "axis": {
            "format": ".2s", "titleFontSize": 11, "labelFontSize": 9,
            "titleColor": "#ffffff", "labelColor": "#aaaaaa",
            "gridColor": "#1e2d45", "gridDash": [3,3], "domainColor": "#1e3a55"
          }
        },
        "color": {
          "field": "state",
          "type": "nominal",
          "title": "State — click to highlight",
          "scale": {
            "domain": ["New South Wales","Victoria","Queensland","Western Australia","South Australia","Tasmania","Australian Capital Territory"],
            "range": ["#E74C3C","#E67E22","#F1C40F","#2980B9","#27AE60","#8E44AD","#1ABC9C"]
          },
          "legend": {
            "labelColor": "#cccccc", "titleColor": "#ffffff",
            "labelFontSize": 10, "titleFontSize": 10
          }
        },
        "opacity": {
          "condition": {"param": "state_highlight", "value": 1},
          "value": 0.12
        },
        "tooltip": [
          {"field": "state", "type": "nominal", "title": "State"},
          {"field": "season", "type": "ordinal", "title": "Season"},
          {"field": "area_burned_ha", "type": "quantitative", "title": "Area Burned (ha)", "format": ","}
        ]
      }
    }
  ],
  "config": {
    "background": "#0a1628",
    "font": "Inter, sans-serif",
    "view": {"stroke": "transparent"}
  }
}
