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
  zoom: 13
});

//----------------
//  create GuessWhere class
//----------------

const guessWhere = new GuessWhere({ view });

guessWhere.watch("choices", ([a, b]) => console.log(`${a.name} or ${b.name}?`));

guessWhere.watch("points", (points) => console.log(`Got points! Total score: ${points}`));

// expose instance for testing
(window as any).guessWhere = guessWhere;
