/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");

import Accessor = require("esri/core/Accessor");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");
import Color = require("esri/Color");
import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol");
import HandleOwner = require("esri/core/HandleOwner");
import { declared, property, subclass } from "esri/core/accessorSupport/decorators";
import { fetchGameData } from "./util";
import { Choice, Choices, GameData, Result } from "./interfaces";

type State = "loading" | "splash" | "playing" | "game-over";

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

const secondInMs = 1000;
const gameDurationInSeconds = 30;

function getCorrect([a, b]: Choices): Choice {
  return isCorrect(a) ? a : b;
}

function isCorrect(choice: Choice): boolean {
  return !!choice.feature.geometry;
}

interface GuessWhereViewModelProperties {
  view: MapView | SceneView;
}

interface GuessWhereViewModel extends HandleOwner {}

@subclass("esri.demo.WebMapShowcaseViewModel")
class GuessWhereViewModel extends declared(Accessor, HandleOwner) {
  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(props?: GuessWhereViewModelProperties) {
    super();
  }

  initialize() {
    fetchGameData()
      .then((data) => {
        this._gameData = data;
        this.notifyChange("state");
      })
      .then(() => this._fetchNextChoices());

    (this.handles as any).add(this.watch("choices", (choices) => this._goToChoice(choices)));
  }

  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  private _active: boolean = false;

  private _choiceSymbol: SimpleFillSymbol = new SimpleFillSymbol({
    outline: { type: "simple-line", width: 2 } as SimpleLineSymbol
  });

  private _gameData: GameData = null;

  private _nextChoices: Choices = null;

  private _timerIntervalId: number = null;

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
  //  countdown
  //----------------------------------

  @property({
    readOnly: true
  })
  readonly countdown: number = -1;

  //----------------------------------
  //  duration
  //----------------------------------

  @property()
  duration: number = gameDurationInSeconds;

  //----------------------------------
  //  points
  //----------------------------------

  @property({
    readOnly: true
  })
  readonly points: number = -1;

  //----------------------------------
  //  state
  //----------------------------------

  @property({
    readOnly: true
  })
  get state(): State {
    return !this._gameData ? "loading" : !this._active ? "splash" : this.countdown === -1 ? "game-over" : "playing";
  }

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
    if (!this._gameData || this._active) {
      console.log("has active game or has not started");
      return;
    }

    this._fetchNextChoices();

    this._set("choices", this._nextChoices);
    this._set("points", 0);
    this._active = true;
    this._startTimer();
    this.notifyChange("state");
  }

  choose(choice: Choice): Result {
    if (!this._gameData || !this._active) {
      console.log("game has not started");
      return;
    }

    this._fetchNextChoices();

    const correct = getCorrect(this.choices);

    if (choice === correct) {
      this._set("points", this.points + 1);
    }

    return {
      choice: correct,
      done: () => this._set("choices", this._nextChoices)
    };
  }

  end() {
    if (!this._gameData || !this._active) {
      console.log("has no active game");
      return;
    }

    this._active = false;
    this._stopTimer();
    this.notifyChange("state");
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
    const correct = getCorrect(choices);

    const { view } = this;
    (view as any).goTo(correct.feature, { animate: false });
    view.graphics.removeAll();
    view.graphics.add(correct.feature);
  }

  private _fetchNextChoices(): IPromise<Choices> {
    return this._gameData
      .generateChoices()
      .then((choices) => {
        const correct = getCorrect(choices);

        const [fillColor, outlineColor] = rotatingColors[Math.floor(Math.random() * rotatingColors.length)];

        this._choiceSymbol.color = new Color(fillColor);
        this._choiceSymbol.outline.color = new Color(outlineColor);

        correct.feature.symbol = this._choiceSymbol.clone();

        return choices;
      })
      .then((choices) => (this._nextChoices = choices));
  }

  private _startTimer(): void {
    if (this._timerIntervalId) {
      return;
    }

    this._set("countdown", this.duration);

    this._timerIntervalId = setInterval(() => {
      const { countdown } = this;

      if (countdown === -1) {
        this._stopTimer();
        return;
      }

      this._set("countdown", countdown - 1);
    }, secondInMs);
  }

  private _stopTimer(): void {
    if (!this._timerIntervalId) {
      return;
    }

    clearInterval(this._timerIntervalId);
    this._timerIntervalId = null;
    this._set("choices", null);
    this._fetchNextChoices();
    this.notifyChange("state");
  }
}

export = GuessWhereViewModel;
