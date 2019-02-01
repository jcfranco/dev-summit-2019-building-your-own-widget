import FeatureLayer = require("esri/layers/FeatureLayer");
import { Choices, GameData } from "./interfaces";

const worldCountriesServiceUrl =
  "http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0";

const countryFieldName = "Country";

export function fetchGameData(): IPromise<GameData> {
  const gameDataLayer = new FeatureLayer({ url: worldCountriesServiceUrl });

  return gameDataLayer.load().then(() => {
    const oidField = gameDataLayer.objectIdField;

    return gameDataLayer
      .queryFeatures({
        returnGeometry: false,
        where: "1=1",
        outFields: [countryFieldName, oidField]
      })
      .then((featureSet) => {
        function randomPick<T>(items: T[]): T {
          return items[Math.floor(Math.random() * (features.length - 1))];
        }

        const { features } = featureSet;

        return {
          generateChoices(): IPromise<Choices> {
            const a = randomPick(features);
            const b = randomPick(features);

            const choices: Choices = [
              {
                name: a.attributes[countryFieldName],
                feature: a
              },
              {
                name: b.attributes[countryFieldName],
                feature: b
              }
            ];

            const correctIndex = Math.round(Math.random());

            return gameDataLayer
              .queryFeatures({
                objectIds: [choices[correctIndex].feature.attributes[oidField]],
                returnGeometry: true
              })
              .then((featuresWithGeometry) => {
                choices[correctIndex].feature.geometry = featuresWithGeometry.features[0].geometry;
                return choices;
              });
          }
        };
      });
  });
}
