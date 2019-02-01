import MapView = require("esri/views/MapView");

import GuessWhere = require("./GuessWhere");

//----------------
//  map setup
//----------------

const view = new MapView({ container: "viewDiv" });

//----------------
//  widget setup
//----------------

const widget = new GuessWhere({ view });

view.ui.add(widget, "top-right");
