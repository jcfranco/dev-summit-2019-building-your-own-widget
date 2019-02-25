/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");

import Accessor = require("esri/core/Accessor");
import promiseUtils = require("esri/core/promiseUtils");
import HandleOwner = require("esri/core/HandleOwner");
import { declared, property, subclass } from "esri/core/accessorSupport/decorators";
import { create } from "./choiceEngine";
import { Choice, Choices, ChoiceEngine, Result } from "./interfaces";
import { getCorrect } from "./utils";

type State = "loading" | "splash" | "playing" | "game-over";

const secondInMs = 1000;
const gameDurationInSeconds = 30;

interface GuessWhereViewModelProperties {
  view: MapView | SceneView;
}

interface GuessWhereViewModel extends HandleOwner {}

@subclass("esri.demo.GuessWhereViewModel")
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
    create().then((engine) => {
      this._choiceEngine = engine;
      this.notifyChange("state");
    });

    this.handles.add(this.watch("choices", (choices) => this._goToChoice(choices)));
  }

  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  private _active: boolean = false;

  private _choiceEngine: ChoiceEngine = null;

  private _result: Result = null;

  private _resultDelayInMs: number = 1000;

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
  readonly points: number = 0;

  //----------------------------------
  //  state
  //----------------------------------

  @property({
    readOnly: true
  })
  get state(): State {
    return !this._choiceEngine ? "loading" : !this._active ? "splash" : this.countdown === -1 ? "game-over" : "playing";
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
    this._choiceEngine.randomize().then(() => {
      this._setNextChoices();
      this._set("points", 0);
      this._active = true;
      this._startTimer();
      this.notifyChange("state");
    });
  }

  choose(choice: Choice): Result {
    // ignore choices if we're showing a result
    if (this._result) {
      return;
    }

    const correct = getCorrect(this.choices);

    if (choice === correct) {
      this._set("points", this.points + 1);
    }

    const result = {
      choice: correct,
      done: () => {
        return promiseUtils.create((resolve) => {
          setTimeout(() => {
            this._setNextChoices();
            this._result = null;
            resolve();
          }, this._resultDelayInMs);
        });
      }
    };

    this._result = result;

    return result;
  }

  end() {
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

  private _setNextChoices(): IPromise<void> {
    return this._choiceEngine.next().then((choices) => {
      this._set("choices", choices);
    });
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
    this.notifyChange("state");
  }
}

export = GuessWhereViewModel;
