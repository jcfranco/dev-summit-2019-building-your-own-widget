/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/Accessor", "esri/Graphic", "esri/core/accessorSupport/decorators", "./utils"], function (require, exports, __extends, __decorate, Accessor, Graphic, decorators_1, utils_1) {
    "use strict";
    var GuessWhereViewModelFinal = /** @class */ (function (_super) {
        __extends(GuessWhereViewModelFinal, _super);
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        function GuessWhereViewModelFinal(props) {
            var _this = _super.call(this) || this;
            //--------------------------------------------------------------------------
            //
            //  Variables
            //
            //--------------------------------------------------------------------------
            _this._active = false;
            _this._choices = [
                {
                    name: "Palm Springs",
                    feature: new Graphic({
                        geometry: {
                            type: "point",
                            x: -12970052.058526255,
                            y: 4004544.8553683264,
                            spatialReference: { wkid: 102100 }
                        },
                        symbol: { type: "simple-marker" }
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
                        },
                        symbol: { type: "simple-marker" }
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
                        },
                        symbol: { type: "simple-marker" }
                    })
                }
            ];
            _this._correctIndex = null;
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  choices
            //----------------------------------
            _this.choices = null;
            //----------------------------------
            //  points
            //----------------------------------
            _this.points = 0;
            //----------------------------------
            //  view
            //----------------------------------
            _this.view = null;
            return _this;
        }
        Object.defineProperty(GuessWhereViewModelFinal.prototype, "state", {
            //----------------------------------
            //  state
            //----------------------------------
            get: function () {
                return !this._active ? "splash" : "playing";
            },
            enumerable: true,
            configurable: true
        });
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        GuessWhereViewModelFinal.prototype.start = function () {
            this._setNextChoices();
            this._set("points", 0);
            this._active = true;
            this.notifyChange("state");
        };
        GuessWhereViewModelFinal.prototype.choose = function (choice) {
            var correct = this.choices[this._correctIndex] === choice;
            if (correct) {
                this._set("points", this.points + 1);
            }
            this._setNextChoices();
            return correct;
        };
        GuessWhereViewModelFinal.prototype.end = function () {
            this._active = false;
            this.notifyChange("state");
            this.view.graphics.removeAll();
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        GuessWhereViewModelFinal.prototype._goToChoice = function (choices) {
            if (!choices) {
                return;
            }
            var correct = this.choices[this._correctIndex];
            var view = this.view;
            view.goTo(correct.feature, { animate: false });
            view.graphics.removeAll();
            view.graphics.add(correct.feature);
        };
        GuessWhereViewModelFinal.prototype._setNextChoices = function () {
            var choices = utils_1.pickChoices(this._choices);
            this._correctIndex = Math.floor(Math.random() * 2);
            this._set("choices", choices);
            this._goToChoice(choices);
        };
        __decorate([
            decorators_1.property({
                readOnly: true
            })
        ], GuessWhereViewModelFinal.prototype, "choices", void 0);
        __decorate([
            decorators_1.property({
                readOnly: true
            })
        ], GuessWhereViewModelFinal.prototype, "points", void 0);
        __decorate([
            decorators_1.property({
                readOnly: true
            })
        ], GuessWhereViewModelFinal.prototype, "state", null);
        __decorate([
            decorators_1.property()
        ], GuessWhereViewModelFinal.prototype, "view", void 0);
        GuessWhereViewModelFinal = __decorate([
            decorators_1.subclass("esri.demo.GuessWhereViewModel")
        ], GuessWhereViewModelFinal);
        return GuessWhereViewModelFinal;
    }(decorators_1.declared(Accessor)));
    return GuessWhereViewModelFinal;
});
//# sourceMappingURL=GuessWhereViewModel.js.map