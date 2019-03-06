/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import Widget = require("esri/widgets/Widget");
import WidgetProperties = __esri.WidgetProperties;

import { property, declared, subclass } from "esri/core/accessorSupport/decorators";

import { renderable, tsx } from "esri/widgets/support/widget";

const CSS = {
  base: "simple-widget",
  enabled: "simple-widget--enabled"
};

@subclass("esri.demo.SimpleWidget")
class SimpleWidget extends declared(Widget) {
  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(params: WidgetProperties) {
    super();
  }

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  @property()
  @renderable()
  enabled = false;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  render() {
    const { enabled } = this;

    const rootClasses = {
      [CSS.enabled]: enabled
    };

    const text = enabled ? "Enabled" : "Disabled";

    return (
      <div bind={this} onclick={this._toggle} class={this.classes(CSS.base, rootClasses)}>
        {text}
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private _toggle(): void {
    this.enabled = !this.enabled;
  }
}

export = SimpleWidget;
