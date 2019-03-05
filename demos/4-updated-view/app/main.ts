import Map = require("esri/Map");
import MapView = require("esri/views/MapView");

import GuessWhere = require("./GuessWhere");

//----------------
//  map setup
//----------------

const map = new Map({
  basemap: "streets-vector"
});

const view = new MapView({
  map,
  container: "viewDiv",
  center: [-116.538433, 33.824775],
  zoom: 15
});

//----------------
//  widget setup
//----------------

const widget = new GuessWhere({ container: "widgetDiv", view });

console.log(widget);

// setTimeout(() => {
//   (widget.viewModel as any)._set("state", "game-over");
// }, 1000);
