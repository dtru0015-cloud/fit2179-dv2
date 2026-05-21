{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": 280,
  "data": {
    "values": [
      {"state": "New South Wales", "year": 2001, "risk": 0.58},
      {"state": "New South Wales", "year": 2021, "risk": 0.81},
      {"state": "Victoria",        "year": 2001, "risk": 0.56},
      {"state": "Victoria",        "year": 2021, "risk": 0.74},
      {"state": "Queensland",      "year": 2001, "risk": 0.49},
      {"state": "Queensland",      "year": 2021, "risk": 0.66},
      {"state": "Western Australia","year": 2001, "risk": 0.36},
      {"state": "Western Australia","year": 2021, "risk": 0.48},
      {"state": "South Australia", "year": 2001, "risk": 0.32},
      {"state": "South Australia", "year": 2021, "risk": 0.41},
      {"state": "Tasmania",        "year": 2001, "risk": 0.28},
      {"state": "Tasmania",        "year": 2021, "risk": 0.35}
    ]
  },
  "layer": [
    {
      "mark": {"type": "line", "strokeWidth": 2},
      "encoding": {
        "x": {
          "field": "year",
          "type": "ordinal",
          "title": null,
          "axis": {"labelFontSize": 11, "labelFontWeight": "bold"}
        },
        "y": {
          "field": "risk",
          "type": "quantitative",
          "title": "Fire Risk Score",
          "scale": {"domain": [0.2, 0.9]},
          "axis": {"labelFontSize": 9}
        },
        "color": {
          "field": "state",
          "type": "nominal",
          "title": "State",
          "scale": {
            "domain": ["New South Wales","Victoria","Queensland","Western Australia","South Australia","Tasmania"],
            "range": ["#C0392B","#E67E22","#F1C40F","#2980B9","#27AE60","#8E44AD"]
          }
        },
        "tooltip": [
          {"field": "state", "type": "nominal"},
          {"field": "year", "type": "ordinal"},
          {"field": "risk", "type": "quantitative", "title": "Risk Score", "format": ".2f"}
        ]
      }
    },
    {
      "mark": {"type": "point", "filled": true, "size": 80},
      "encoding": {
        "x": {"field": "year", "type": "ordinal"},
        "y": {"field": "risk", "type": "quantitative", "scale": {"domain": [0.2, 0.9]}},
        "color": {"field": "state", "type": "nominal"}
      }
    },
    {
      "transform": [{"filter": "datum.year === 2021"}],
      "mark": {
        "type": "text",
        "align": "left",
        "dx": 6,
        "fontSize": 9
      },
      "encoding": {
        "x": {"field": "year", "type": "ordinal"},
        "y": {"field": "risk", "type": "quantitative", "scale": {"domain": [0.2, 0.9]}},
        "text": {
          "field": "risk",
          "type": "quantitative",
          "format": ".2f"
        },
        "color": {"field": "state", "type": "nominal"}
      }
    }
  ],
  "config": {"font": "Inter, sans-serif", "view": {"stroke": "transparent"}}
}
