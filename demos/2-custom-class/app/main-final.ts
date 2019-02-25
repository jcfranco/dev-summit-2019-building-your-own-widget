import Map = require("esri/Map");
import MapView = require("esri/views/MapView");
import CustomClass = require("./CustomClass");

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
  zoom: 13
});

//----------------
//  create custom class
//----------------

const custom = new CustomClass({ view });

custom.watch("choices", ([a, b]) => console.log(`${a.name} or ${b.name}?`));

custom.watch("points", (points) => console.log(`Got points! Total score: ${points}`));

// expose instance for testing
(window as any).custom = custom;
