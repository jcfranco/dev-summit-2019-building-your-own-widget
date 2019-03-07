# ViewModel Steps

## Rename class

We need to take our `GuessWhere` class and rename it to be our `GuessWhereViewModel`

```ts
@subclass("esri.demo.GuessWhereViewModel")
class GuessWhereViewModel extends declared(Accessor) {
```

## Add state property

```ts
//----------------------------------
//  state
//----------------------------------

@property({
  readOnly: true
})
get state(): State {
  return !this._active ? "splash" : "playing";
}
```

## Create State type

```ts
type State = "splash" | "playing" | "game-over";
```

## Create private variable `_active`

```ts
private _active: boolean = false;
```

## Compile: View `vm-test.html`

Compile and view the [vm-test.html](vm-test.html) page

Check the console for the VM properties. However, `state` isn't quite working yet.

## Modify `start()` method to update `_active`

```ts
start(): void {
  this._setNextChoices();
  this._set("points", 0);
  this._active = true;
  this.notifyChange("state");
}
```

## Modify `end` public method to update state

```ts
end() {
  this._active = false;
  this.notifyChange("state");
  this.view.graphics.removeAll();
}
```

## Compile:

Compile and view the `vm` global variable in the console.

Try the following commands in the console.

- `vm.start();`
- `vm.choose(vm.choices[0]);`
- `vm.end();`

# View Steps

Lets setup our Widget View for the game.

## Add Properties

Lets add some properties to our widget

```ts
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
```

## Add `aliasOf` Accessor decorator

To "alias" a property of the ViewModel, we need to bring in the alias decorator

```ts
import { aliasOf, declared, property, subclass } from "esri/core/accessorSupport/decorators";
```

## Import `GuessWhereViewModel`

Import our VM so we can use it in the widget.

```ts
import GuessWhereViewModel = require("./GuessWhereViewModel");
```

## Compile and check if working

Lets make sure everything is rendering ok and we see "hello world".

## Modify `render()` to render the game menu

Lets render a game menu instead of "hello world"

```tsx
render() {
  return <div class={this.classes(CSS.esriWidget, CSS.root)}>{this.renderMenu()}</div>;
}
```

## Add CSS constant

We have an object to map and keep track of all our classes using BEM naming convention.

```ts
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
```

## Create protected method `renderMenu()`

```tsx
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
```

## Add private method `_onStart()`

```ts
private _onStart(): void {
  this.viewModel.start();
}
```

## Bind `_onStart()` in `constructor`

```ts
this._onStart = this._onStart.bind(this);
```

## Compile

Compile and test UI as well as onclick button

## Update `render()` to render a game round

Now lets render a round of the game when the game starts.

```tsx
render() {
  const { state } = this.viewModel;

  return (
    <div class={this.classes(CSS.esriWidget, CSS.root)}>
      {state === "playing"
        ? this.renderRound()
        : state === "game-over"
        ? null
        : this.renderMenu()}
    </div>
  );
}
```

## Add protected method `renderRound()`

```tsx
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
```

## Add protected method `renderHUD`

Add the "heads up display" for scoring and info.

```tsx
protected renderHUD() {
  return (
    <div class={CSS.hud}>
      <div class={CSS.hudText} aria-label="Score">
        {this.viewModel.points}
      </div>
    </div>
  );
}
```

## Add protected method `renderChoice`

Render an option to choose from within a round.

```tsx
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
```

## Import `Choice` interface

```ts
import { Choice } from "./interfaces";
```

## Add private method `_onChoice()`

```ts
private _onChoice(event: Event): void {
  const element = event.currentTarget as HTMLElement;
  const choice = element["data-choice"] as Choice;

  this.viewModel.choose(choice);
}
```

## Bind `_onChoice()` in `constructor`

```ts
this._onChoice = this._onChoice.bind(this);
```

## Compile and test game

Lets compile and test out if we're able to render rounds and choose choices.

## Modify `render()` method to add mode for Game Over

```tsx
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
```

## Create protected method `renderGameOver()`

```tsx
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
```

## Add private methods `_onRetry()` and `onQuit()`

```ts
private _onRetry(): void {
  this.viewModel.end();
  this.viewModel.start();
}

private _onQuit(): void {
  this.viewModel.end();
}
```

## Bind private methods `_onRetry()` and `onQuit()` in constructor

```ts
this._onRetry = this._onRetry.bind(this);
this._onQuit = this._onQuit.bind(this);
```

## Modify `main.ts` to change state to "game-over"

Lets modify main.ts to set the game over after a specified time.

## Compile and test out game

Lets test out the game over state.

## Back to the slides to recap!
