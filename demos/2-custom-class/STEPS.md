# Writing a class

1.  Let's start off by adding some boilerplate for creating a module or class.

```
/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import { declared, subclass } from "esri/core/accessorSupport/decorators";

import Accessor = require("esri/core/Accessor");

@subclass("esri.demo.CustomClass")
class CustomClass extends declared(Accessor) {

}

export = CustomClass;
```

This is the minimum required to create a class in 4x. All we're doing here is creating a class that extends `esri/core/Accessor`, which is the base of all 4x classes.

1.  We'll now add the properties we described earlier in our design. We'll do this with the `property` decorator.

```tsx
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
```

TypeScript will complain about references to classes and utilities we haven't imported, so let's go ahead and fix that.

```tsx
import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");

import Accessor = require("esri/core/Accessor");
import Graphic = require("esri/Graphic");
import Point = require("esri/geometry/Point");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import { declared, property, subclass } from "esri/core/accessorSupport/decorators";
import { Choice, Choices } from "./interfaces";
import { pickChoices } from "./utils";
```

We can leverage TypeScript and type the constructor argument to ensure our class is created with the correct properties. We'll define an interface for these properties

```tsx
interface CustomClassProperties {
  view: MapView | SceneView;
}
```

and type the constructor arguments

```tsx
//--------------------------------------------------------------------------
//
//  Lifecycle
//
//--------------------------------------------------------------------------

constructor(props?: CustomClassProperties) {
  super();
}
```

We've now implemented the properties from our design. Properties defined this way can be watched for changes and initialized by a constructor object.

Let's bring in our public methods so we can finish implementing our public API.

```tsx
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
```

```tsx
//--------------------------------------------------------------------------
//
//  Variables
//
//--------------------------------------------------------------------------

private _choices: Choice[] = [
  {
    name: "Palm Springs",
    feature: new Graphic({
      geometry: { type: "point", x: -12970052.058526255, y: 4004544.8553683264, spatialReference: { wkid: 102100 } } as Point,
      symbol: { type: "simple-marker" } as SimpleMarkerSymbol
    })
  },
  {
    name: "Redlands",
    feature: new Graphic({
      geometry: { type: "point", x: -13044706.248636946, y: 4035952.8114616736, spatialReference: { wkid: 102100 } } as Point,
      symbol: { type: "simple-marker" } as SimpleMarkerSymbol
    })
  },
  {
    name: "San Diego",
    feature: new Graphic({
      geometry: { type: "point", x: -13042381.897669187, y: 3856726.5654889513, spatialReference: { wkid: 102100 } } as Point,
      symbol: { type: "simple-marker" } as SimpleMarkerSymbol
    })
  }
];

private _correctIndex: number = null;

//--------------------------------------------------------------------------
//
//  Private Methods
//
//--------------------------------------------------------------------------

private _setNextChoices(): void {
  const choices = pickChoices(this._choices);

  this._correctIndex = Math.floor(Math.random() * 2);
  this._set("choices", choices);
  this._goToChoice(choices);
}

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
```

We have now implemented our class and we can test it in our demo page.

1.  We can now update the application from the previous demo and bring in our `CustomClass`.

```ts
import Map = require("esri/Map");
import MapView = require("esri/views/MapView");

// import our new class
import CustomClass = require("./CustomClass");

//----------------
//  map setup
//----------------

const map = new Map({
  basemap: "streets-vector"
});

const view = new MapView({
  map,
  container: "viewDiv",
  center: [-116.538433, 33.824775],
  zoom: 15
});

// create an instance of our new class
const custom = new CustomClass({ view });

custom.watch("choices", ([a, b]) => console.log(`${a.name} or ${b.name}?`));

custom.watch("points", (points) => console.log(`Got points! Total score: ${points}`));

// expose instance for testing
(window as any).custom = custom;
```
