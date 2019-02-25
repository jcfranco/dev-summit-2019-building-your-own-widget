import Color = require("esri/Color");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");
import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol");
import { clone } from "esri/core/lang";
import { Choice, Choices } from "./interfaces";

const rotatingColors = [
  ["#C2D3A4", "#4D5441"],
  ["#D3BFA4", "#544C41"],
  ["#B1B1D3", "#464654"],
  ["#D0B1D3", "#524654"],
  ["#B1C6D3", "#464E54"],
  ["#B1D3C5", "#46544E"],
  ["#D36F19", "#542C0A"],
  ["#D31D5C", "#540C24"],
  ["#D3CA1E", "#54500C"],
  ["#D3766C", "#542F2B"],
  ["#DAD451", "#545238"]
];

export function getCorrect([a, b]: Choices): Choice {
  return isCorrect(a) ? a : b;
}

function isCorrect(choice: Choice): boolean {
  return !!choice.feature.geometry;
}

export function assignSymbol(choices: Choices): Choices {
  const [fillColor, outlineColor] = rotatingColors[Math.floor(Math.random() * rotatingColors.length)];

  const choiceSymbol = new SimpleFillSymbol({
    color: new Color(fillColor),
    outline: { color: new Color(outlineColor), type: "simple-line", width: 2 } as SimpleLineSymbol
  });

  const correct = getCorrect(choices);
  correct.feature.symbol = choiceSymbol;

  return choices;
}

export function pickChoices<T>(items: T[]): [T, T] {
  const cloned = clone(items) as T[];

  const a = randomPick(cloned);

  const aIndex = cloned.indexOf(a);
  cloned.splice(aIndex, 1);

  const b = randomPick(cloned);

  return [a, b];
}

function randomPick<T>(items: T[]): T {
  return items[Math.round(Math.random() * (items.length - 1))];
}
