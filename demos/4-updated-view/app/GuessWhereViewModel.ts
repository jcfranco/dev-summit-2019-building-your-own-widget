/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");

import Accessor = require("esri/core/Accessor");

import { declared, property, subclass } from "esri/core/accessorSupport/decorators";

interface GuessWhereViewModelProperties {
  view: MapView | SceneView;
}

@subclass("esri.demo.GuessWhereViewModel")
class GuessWhereViewModelFinal extends declared(Accessor) {
  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(props?: GuessWhereViewModelProperties) {
    super();
  }

  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

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

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------
}

export = GuessWhereViewModelFinal;
