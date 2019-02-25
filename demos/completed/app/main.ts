import Map = require("esri/Map");
import MapView = require("esri/views/MapView");
import VectorTileLayer = require("esri/layers/VectorTileLayer");

import GuessWhere = require("./GuessWhere");

//----------------
//  map setup
//----------------

var map = new Map({
  basemap: {
    baseLayers: [
      new VectorTileLayer({
        url: "https://arcgis.com/sharing/rest/content/items/b2cd19ebdf814f018ef6678bcdc44e3a/resources/styles/root.json"
      })
    ]
  }
});

var view = new MapView({
  container: "viewDiv",
  map,
  padding: {
    bottom: 200
  },
  ui: {
    components: []
  }
});

//----------------
//  widget setup
//----------------

const widget = new GuessWhere({ view, container: "widgetDiv" });
