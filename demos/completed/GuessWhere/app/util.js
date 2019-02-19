define(["require", "exports", "esri/layers/FeatureLayer"], function (require, exports, FeatureLayer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var worldCountriesServiceUrl = "http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0";
    var countryFieldName = "Country";
    function fetchGameData() {
        var gameDataLayer = new FeatureLayer({ url: worldCountriesServiceUrl });
        return gameDataLayer.load().then(function () {
            var oidField = gameDataLayer.objectIdField;
            return gameDataLayer
                .queryFeatures({
                returnGeometry: false,
                where: "1=1",
                outFields: [countryFieldName, oidField]
            })
                .then(function (featureSet) {
                function randomPick(items) {
                    return items[Math.floor(Math.random() * (features.length - 1))];
                }
                var features = featureSet.features;
                return {
                    generateChoices: function () {
                        var a = randomPick(features);
                        var b = randomPick(features);
                        var choices = [
                            {
                                name: a.attributes[countryFieldName],
                                feature: a
                            },
                            {
                                name: b.attributes[countryFieldName],
                                feature: b
                            }
                        ];
                        var correctIndex = Math.round(Math.random());
                        return gameDataLayer
                            .queryFeatures({
                            objectIds: [choices[correctIndex].feature.attributes[oidField]],
                            returnGeometry: true
                        })
                            .then(function (featuresWithGeometry) {
                            choices[correctIndex].feature.geometry = featuresWithGeometry.features[0].geometry;
                            return choices;
                        });
                    }
                };
            });
        });
    }
    exports.fetchGameData = fetchGameData;
});
//# sourceMappingURL=util.js.map