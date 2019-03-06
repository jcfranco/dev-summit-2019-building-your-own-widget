# Simple View Steps

## Setup SimpleWidget

Open `SimpleWidget.tsx` and add the following basic class to the empty file.

```tsx
/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import Widget = require("esri/widgets/Widget");

import { renderable, tsx } from "esri/widgets/support/widget";

import { property, declared, subclass } from "esri/core/accessorSupport/decorators";

@subclass("esri.demo.SimpleWidget")
class SimpleWidget extends declared(Widget) {
  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor() {
    super();
  }

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------
  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  render() {}

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------
}

export = SimpleWidget;
```

## Modify Render method

Add the `render()` public method

```tsx
render() {
  return <div class="simple-widget">Hello World</div>;
}
```

## Setup Main

Open `main.ts` and setup the widget initialization.

## First require the widget

```ts
import SimpleWidget = require("./SimpleWidget");
```

## Then initialize the widget

```ts
//----------------
//  widget setup
//----------------

const widget = new SimpleWidget();

view.ui.add(widget, "top-right");
```

## Compile and test

You should see a red button!

## Improving on SimpleWidget

Lets add a property to our widget

```ts
@property()
@renderable()
enabled = false;
```

## Modify our render method

Modify our render method to contain a button that toggles a class

```tsx
render() {
  const { enabled } = this;

  const rootClasses = {
    [CSS.enabled]: enabled
  };

  const text = enabled ? "Enabled" : "Disabled";

  return (
    <button bind={this} onclick={this._toggle} class={this.classes(CSS.base, rootClasses)}>
      {text}
    </button>
  );
}
```

## Add CSS constant for JSX

```ts
const CSS = {
  base: "simple-widget",
  enabled: "simple-widget--enabled"
};
```

## Add private method to handle event

```ts
private _toggle(): void {
  this.enabled = !this.enabled;
}
```

## Complete

We're done with this set of steps! Compile, view, and proceed to the [next steps](../4-updated-view/STEPS.md).
