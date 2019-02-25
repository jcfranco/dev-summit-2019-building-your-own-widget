define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/VectorTileLayer", "./GuessWhere"], function (require, exports, Map, MapView, VectorTileLayer, GuessWhere) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        map: map,
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
    var widget = new GuessWhere({ view: view, container: "widgetDiv" });
});
//# sourceMappingURL=main.js.map