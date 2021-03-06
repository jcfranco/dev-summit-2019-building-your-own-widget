define(["require", "exports", "esri/Map", "esri/views/MapView", "./GuessWhere"], function (require, exports, Map, MapView, GuessWhere) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //----------------
    //  map setup
    //----------------
    var map = new Map({
        basemap: "streets-vector"
    });
    var view = new MapView({
        map: map,
        container: "viewDiv",
        center: [-116.538433, 33.824775],
        zoom: 15
    });
    //----------------
    //  widget setup
    //----------------
    var widget = new GuessWhere({ container: "widgetDiv", view: view });
    console.log(widget);
});
// setTimeout(() => {
//   (widget.viewModel as any)._set("state", "game-over");
// }, 1000);
//# sourceMappingURL=main.js.map