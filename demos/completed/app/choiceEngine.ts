import Graphic = require("esri/Graphic");
import FeatureLayer = require("esri/layers/FeatureLayer");
import { ChoiceEngine, Choices } from "./interfaces";
import { assignSymbol, pickChoices } from "./utils";

const worldCountriesServiceUrl =
  "http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0";

const countryFieldName = "Country";

function assignCorrectChoice(choices: Choices): IPromise<Choices> {
  const correctIndex = Math.round(Math.random());
  const correct = choices[correctIndex];
  const layer = correct.feature.layer as FeatureLayer;
  const oidField = layer.objectIdField;

  return layer
    .queryFeatures({
      objectIds: [correct.feature.attributes[oidField]],
      returnGeometry: true
    })
    .then((featuresWithGeometry) => {
      choices[correctIndex].feature.geometry = featuresWithGeometry.features[0].geometry;
      return choices;
    })
    .then((choices) => assignSymbol(choices));
}

function generateChoices(rounds = 50, features: Graphic[]): IPromise<Choices>[] {
  const allChoices: IPromise<Choices>[] = [];

  for (let i = 0; i < rounds; i++) {
    const [a, b] = pickChoices(features);

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

    allChoices.push(assignCorrectChoice(choices));
  }

  return allChoices;
}

export function create(rounds = 50): IPromise<ChoiceEngine> {
  const gameDataLayer = new FeatureLayer({ url: worldCountriesServiceUrl });

  return gameDataLayer.load().then(() => {
    const oidField = gameDataLayer.objectIdField;

    return gameDataLayer
      .queryFeatures({
        returnGeometry: false,
        where: "1=1",
        outFields: [countryFieldName, oidField]
      })
      .then(({ features }) => {
        let allChoices = generateChoices(rounds, features);

        // ensure the first choice is loaded
        return allChoices[0].then(() => {
          return {
            randomize(): IPromise<void> {
              allChoices = generateChoices(rounds, features);
              return allChoices[0].then(() => {});
            },

            next(): IPromise<Choices> {
              return allChoices.shift();
            }
          };
        });
      });
  });
}
