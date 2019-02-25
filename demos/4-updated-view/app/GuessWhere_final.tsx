/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import MapView = require("esri/views/MapView");
import Widget = require("esri/widgets/Widget");
import GuessWhereViewModel = require("./GuessWhereViewModel");
import WidgetProperties = __esri.WidgetProperties;
import { aliasOf, declared, property, subclass } from "esri/core/accessorSupport/decorators";
import { renderable, tsx } from "esri/widgets/support/widget";
import { Choice } from "./interfaces";

const CSS = {
  root: "guess-where",

  round: "guess-where__round",

  choice: "guess-where__choice",
  choiceText: "guess-where__choice-text",
  choices: "guess-where__choices",
  choiceA: "guess-where__choice-a",
  choiceB: "guess-where__choice-b",
  choiceBackground: "guess-where__choice-background",

  menu: "guess-where__menu",
  menuTitle: "guess-where__menu-title",
  menuTitleText: "guess-where__menu-title-text",
  menuButton: "guess-where__menu-button",
  menuButtons: "guess-where__menu-buttons",

  hudText: "guess-where__hud-text",
  hud: "guess-where__hud",

  // common
  esriWidget: "esri-widget",
  esriButton: "esri-button"
};

interface GuessWhereProperties extends WidgetProperties {
  view: MapView;
}

@subclass("esri.demo.GuessWhere")
class GuessWhere_final extends declared(Widget) {
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
    return (
      <div class={CSS.menu} key="menu">
        <h1 class={CSS.menuTitle}>
          <span class={CSS.menuTitleText}>Guess Where?</span>
        </h1>
        <button class={this.classes(CSS.menuButton, CSS.esriButton)} onclick={this._onStart}>
          Start
        </button>
      </div>
    );
  }

  protected renderGameOver() {
    return (
      <div class={CSS.menu} key="game-over">
        <h1 class={CSS.menuTitle}>
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
    return (
      <div
        aria-label={`Choice ${type}`}
        class={this.classes(CSS.choice, type === "a" ? CSS.choiceA : CSS.choiceB)}
        data-choice={choice}
        onclick={this._onChoice}
        role="button"
        tabIndex={0}
      >
        <div class={CSS.choiceText}>{choice.name}</div>
        <div class={CSS.choiceBackground} />
      </div>
    );
  }

  private _onChoice(event: Event): void {
    const element = event.currentTarget as HTMLElement;
    const choice = element["data-choice"] as Choice;

    this.viewModel.choose(choice);
  }

  protected renderHUD() {
    return (
      <div class={CSS.hud}>
        <div class={CSS.hudText} aria-label="Score">
          {this.viewModel.points}
        </div>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

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

export = GuessWhere_final;
