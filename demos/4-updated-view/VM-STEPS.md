# Updated View Steps

## Background

Lets create our game widget by first creating the ViewModel.

## Add properties

```ts
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
//  state
//----------------------------------

@property({
  readOnly: true
})
get state(): State {
  return !this._active ? "splash" : "playing";
}

//----------------------------------
//  view
//----------------------------------

@property() view: MapView | SceneView = null;
```

## Import interfaces

View & import interfaces for Choice and Choices

```ts
import { Choice, Choices } from "./interfaces";
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

## Add `start()` method

```ts
start(): void {
  this._setNextChoices();
  this._set("points", 0);
  this._active = true;
  this.notifyChange("state");
}
```

## Add `_setNextchoices()` private method

```ts
private _setNextChoices(): void {
  const choices = pickChoices(this._choices);

  this._correctIndex = Math.floor(Math.random() * 2);
  this._set("choices", choices);
  this._goToChoice(choices);
}
```

## Import `pickChoices()` utility method

```ts
import { pickChoices } from "./utils";
```

## Add `_choices` private variable

```ts
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
```

## Add choices imports

```ts
import Graphic = require("esri/Graphic");
import Point = require("esri/geometry/Point");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
```

## Add `_correctIndex` private variable

```ts
private _correctIndex: number = null;
```

## Add `_goToChoice` private method

```ts
private _goToChoice(choices: Choices): void {
  if (!choices) {
    return;
  }
  const correct = this.choices[this._correctIndex];

  const { view } = this;
  (view as any).goTo(correct.feature, { animate: false });
  view.graphics.removeAll();
  view.graphics.add(correct.feature);
}
```

## Add `choose` and `end` public methods

```ts
choose(choice: Choice): boolean {
  const correct = this.choices[this._correctIndex] === choice;

  if (correct) {
    this._set("points", this.points + 1);
  }

  this._setNextChoices();

  return correct;
}

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

## Back to the slides to recap!
