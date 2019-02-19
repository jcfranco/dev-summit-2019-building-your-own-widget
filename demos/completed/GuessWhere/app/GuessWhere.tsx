/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import MapView = require("esri/views/MapView");
import Widget = require("esri/widgets/Widget");
import GuessWhereViewModel = require("./GuessWhereViewModel");
import { aliasOf, declared, property, subclass } from "esri/core/accessorSupport/decorators";
import { accessibleHandler, renderable, tsx } from "esri/widgets/support/widget";
import { Choice, Result } from "./interfaces";

// todo: can we maybe reduce the number of classes to simplify this demo?
const CSS = {
  root: "guess-where",

  round: "guess-where__round",

  choice: "guess-where__choice",
  choiceText: "guess-where__choice-text",
  choices: "guess-where__choices",
  choiceSubmitted: "guess-where__choice--submitted",
  choiceCorrect: "guess-where__choice--correct",
  choiceIncorrect: "guess-where__choice--incorrect",
  choiceA: "guess-where__choice-a",
  choiceB: "guess-where__choice-b",
  choiceBackground: "guess-where__choice-background",
  choiceResultIcon: "guess-where__choice-result-icon",

  menu: "guess-where__menu",
  menuTitle: "guess-where__menu-title",
  menuTitleText: "guess-where__menu-title-text",
  menuIcon: "guess-where__menu-icon",
  menuButton: "guess-where__menu-button",
  menuButtons: "guess-where__menu-buttons",
  menuButtonDisabled: "guess-where__menu-button--disabled",

  hudText: "guess-where__hud-text",
  hud: "guess-where__hud",
  hudTimer: "guess-where__hud-timer",
  hudTimerRing: "guess-where__hud-timer-ring",
  score: "guess-where__score",

  // icons
  esriIconCorrect: "esri-icon-check-mark",
  esriIconIncorrect: "esri-icon-close",
  esriIconMapPin: "esri-icon-map-pin",

  // common
  esriWidget: "esri-widget",
  esriButton: "esri-button"
};

interface GuessWhereProperties {
  view: MapView;
}

@subclass("esri.demo.GuessWhere")
class GuessWhere extends declared(Widget) {
  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(props: GuessWhereProperties) {
    super();

    this._onChoice = this._onChoice.bind(this);
    this._onRetry = this._onRetry.bind(this);
    this._onStart = this._onStart.bind(this);
    this._onQuit = this._onQuit.bind(this);
  }

  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  private _result: Result;

  // todo: can we offload this to the VM?
  private _resultDelayInMs: number = 1000;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  view
  //----------------------------------

  @aliasOf("viewModel.view") view: MapView = null;

  //----------------------------------
  //  viewModel
  //----------------------------------

  @property()
  @renderable(["viewModel.choices", "viewModel.countdown", "viewModel.state"])
  viewModel: GuessWhereViewModel = new GuessWhereViewModel();

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  render() {
    const { state } = this.viewModel;

    return (
      <div class={this.classes(CSS.esriWidget, CSS.root)}>
        {state === "playing"
          ? this.renderRound()
          : state === "game-over"
          ? this.renderGameOver()
          : this.renderMenu()}
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Protected Methods
  //
  //--------------------------------------------------------------------------

  protected renderMenu() {
    const loading = this.viewModel.state === "loading";

    return (
      <div class={CSS.menu} key="menu">
        <h1 class={CSS.menuTitle}>
          <span class={this.classes(CSS.menuIcon, CSS.esriIconMapPin)} aria-hidden="true" />
          <span class={CSS.menuTitleText}>Guess Where?</span>
        </h1>
        <button
          class={this.classes(
            CSS.menuButton,
            CSS.esriButton,
            loading ? CSS.menuButtonDisabled : null
          )}
          onclick={this._onStart}
          disabled={loading}
        >
          Start
        </button>
      </div>
    );
  }

  protected renderGameOver() {
    return (
      <div class={CSS.menu} key="game-over">
        <h1 class={CSS.menuTitle}>
          <span class={this.classes(CSS.menuIcon, CSS.esriIconMapPin)} aria-hidden="true" />
          <span class={CSS.menuTitleText}>Game Over</span>
        </h1>
        <div class={CSS.menuTitleText}>Your Score: {this.viewModel.points}</div>
        <div class={CSS.menuButtons}>
          <button class={this.classes(CSS.menuButton, CSS.esriButton)} onclick={this._onRetry}>
            Retry
          </button>
          <button class={this.classes(CSS.menuButton, CSS.esriButton)} onclick={this._onQuit}>
            Quit
          </button>
        </div>
      </div>
    );
  }

  protected renderRound() {
    const [a, b] = this.viewModel.choices;

    return (
      <div class={CSS.round} key="round">
        {this.renderHUD()}
        <div class={CSS.choices}>
          {this.renderChoice(a, "a")}
          {this.renderChoice(b, "b")}
        </div>
      </div>
    );
  }

  protected renderChoice(choice: Choice, type: "a" | "b") {
    const result = this._result;

    return (
      <div
        aria-label={`Choice ${type}`}
        class={this.classes(
          CSS.choice,
          type === "a" ? CSS.choiceA : CSS.choiceB,
          !result
            ? null
            : result.choice === choice
            ? `${CSS.choiceSubmitted}, ${CSS.choiceCorrect}`
            : `${CSS.choiceSubmitted}, ${CSS.choiceIncorrect}`
        )}
        data-choice={choice}
        onclick={this._onChoice}
        onkeydown={this._onChoice}
        role="button"
        tabIndex={0}
      >
        <span
          class={this.classes(
            CSS.choiceResultIcon,
            !result ? null : result.choice === choice ? CSS.esriIconCorrect : CSS.esriIconIncorrect
          )}
          aria-hidden="true"
        />
        <div class={CSS.choiceText}>{choice.name}</div>
        <div class={CSS.choiceBackground} />
      </div>
    );
  }

  @accessibleHandler()
  private _onChoice(event: Event): void {
    const element = event.currentTarget as HTMLElement;
    const choice = element["data-choice"] as Choice;

    this._result = this.viewModel.choose(choice);

    setTimeout(() => {
      this._result.done();
      this._result = null;
      this.scheduleRender();
    }, this._resultDelayInMs);
  }

  protected renderHUD() {
    const { countdown, duration } = this.viewModel;
    const radius = 48;
    const countdownCircumference = 2 * Math.PI * radius;
    const percentLeft = countdown / duration;
    const dashOffset = percentLeft * countdownCircumference;

    // todo: can we maybe make this a function to get a color from a percent?
    const strokeColor =
      percentLeft > 0.8
        ? "#f6f792"
        : percentLeft > 0.6
        ? "#FBB740"
        : percentLeft > 0.4
        ? "#F78A4B"
        : percentLeft > 0.2
        ? "#BF5B22"
        : "#C42519";

    return (
      <div class={CSS.hud}>
        <svg
          class={CSS.hudTimer}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={`${countdown} seconds left in this round`}
        >
          <circle cx="50" cy="50" r="50" fill="#333745" />
          <circle
            class={CSS.hudTimerRing}
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            stroke-width="4"
            stroke-dasharray={countdownCircumference}
            stroke-dashoffset={countdownCircumference - dashOffset}
          />
        </svg>
        <div class={CSS.hudText} aria-label="Score">
          {this.viewModel.points}
        </div>
      </div>
    );
  }

  private _onStart(): void {
    this.viewModel.start();
  }

  private _onRetry(): void {
    this.viewModel.end();
    this.viewModel.start();
  }

  private _onQuit(): void {
    this.viewModel.end();
  }
}

export = GuessWhere;
