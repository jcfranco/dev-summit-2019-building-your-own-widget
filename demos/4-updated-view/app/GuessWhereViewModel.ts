/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");

import Accessor = require("esri/core/Accessor");
import Graphic = require("esri/Graphic");
import Point = require("esri/geometry/Point");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import { declared, property, subclass } from "esri/core/accessorSupport/decorators";
import { Choice, Choices } from "./interfaces";
import { pickChoices } from "./utils";

interface CustomClassProperties {
  view: MapView | SceneView;
}

@subclass("esri.demo.CustomClass")
class CustomClass extends declared(Accessor) {
  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(props?: CustomClassProperties) {
    super();
  }

  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  private _choices: Choice[] = [
    {
      name: "Palm Springs",
      feature: new Graphic({
        geometry: {
          type: "point",
          x: -12970052.058526255,
          y: 4004544.8553683264,
          spatialReference: { wkid: 102100 }
        } as Point,
        symbol: { type: "simple-marker" } as SimpleMarkerSymbol
      })
    },
    {
      name: "Redlands",
      feature: new Graphic({
        geometry: {
          type: "point",
          x: -13044706.248636946,
          y: 4035952.8114616736,
          spatialReference: { wkid: 102100 }
        } as Point,
        symbol: { type: "simple-marker" } as SimpleMarkerSymbol
      })
    },
    {
      name: "San Diego",
      feature: new Graphic({
        geometry: {
          type: "point",
          x: -13042381.897669187,
          y: 3856726.5654889513,
          spatialReference: { wkid: 102100 }
        } as Point,
        symbol: { type: "simple-marker" } as SimpleMarkerSymbol
      })
    }
  ];

  private _correctIndex: number = null;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  choices
  //----------------------------------

  @property({
    readOnly: true
  })
  readonly choices: Choices = null;

  //----------------------------------
  //  points
  //----------------------------------

  @property({
    readOnly: true
  })
  readonly points: number = 0;

  //----------------------------------
  //  view
  //----------------------------------

  @property() view: MapView | SceneView = null;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  start(): void {
    this._setNextChoices();
    this._set("points", 0);
  }

  choose(choice: Choice): boolean {
    const correct = this.choices[this._correctIndex] === choice;

    if (correct) {
      this._set("points", this.points + 1);
    }

    this._setNextChoices();

    return correct;
  }

  end() {
    this.view.graphics.removeAll();
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private _goToChoice(choices: Choices): void {
    if (!choices) {
      return;
    }

    const correct = choices[this._correctIndex];

    const { view } = this;
    (view as any).goTo(correct.feature, { animate: false });
    view.graphics.removeAll();
    view.graphics.add(correct.feature);
  }

  private _setNextChoices(): void {
    const choices = pickChoices(this._choices);

    this._correctIndex = Math.floor(Math.random() * 2);
    this._set("choices", choices);
    this._goToChoice(choices);
  }
}

export = CustomClass;
