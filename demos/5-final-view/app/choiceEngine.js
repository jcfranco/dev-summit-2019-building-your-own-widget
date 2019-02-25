define(["require", "exports", "esri/layers/FeatureLayer", "./utils"], function (require, exports, FeatureLayer, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var worldCountriesServiceUrl = "http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0";
    var countryFieldName = "Country";
    function assignCorrectChoice(choices) {
        var correctIndex = Math.round(Math.random());
        var correct = choices[correctIndex];
        var layer = correct.feature.layer;
        var oidField = layer.objectIdField;
        return layer
            .queryFeatures({
            objectIds: [correct.feature.attributes[oidField]],
            returnGeometry: true
        })
            .then(function (featuresWithGeometry) {
            choices[correctIndex].feature.geometry = featuresWithGeometry.features[0].geometry;
            return choices;
        })
            .then(function (choices) { return utils_1.assignSymbol(choices); });
    }
    function generateChoices(rounds, features) {
        if (rounds === void 0) { rounds = 50; }
        var allChoices = [];
        for (var i = 0; i < rounds; i++) {
            var _a = utils_1.pickChoices(features), a = _a[0], b = _a[1];
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
            allChoices.push(assignCorrectChoice(choices));
        }
        return allChoices;
    }
    function create(rounds) {
        if (rounds === void 0) { rounds = 50; }
        var gameDataLayer = new FeatureLayer({ url: worldCountriesServiceUrl });
        return gameDataLayer.load().then(function () {
            var oidField = gameDataLayer.objectIdField;
            return gameDataLayer
                .queryFeatures({
                returnGeometry: false,
                where: "1=1",
                outFields: [countryFieldName, oidField]
            })
                .then(function (_a) {
                var features = _a.features;
                var allChoices = generateChoices(rounds, features);
                // ensure the first choice is loaded
                return allChoices[0].then(function () {
                    return {
                        randomize: function () {
                            allChoices = generateChoices(rounds, features);
                            return allChoices[0].then(function () { });
                        },
                        next: function () {
                            return allChoices.shift();
                        }
                    };
                });
            });
        });
    }
    exports.create = create;
});
//# sourceMappingURL=choiceEngine.js.map