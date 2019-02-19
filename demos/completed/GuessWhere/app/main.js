define(["require", "exports", "esri/views/MapView", "./GuessWhere"], function (require, exports, MapView, GuessWhere) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //----------------
    //  map setup
    //----------------
    var view = new MapView({ container: "viewDiv" });
    //----------------
    //  widget setup
    //----------------
    var widget = new GuessWhere({ view: view });
    view.ui.add(widget, "top-right");
});
//# sourceMappingURL=main.js.map