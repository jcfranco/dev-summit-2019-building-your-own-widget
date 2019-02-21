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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/Accessor", "esri/core/promiseUtils", "esri/Color", "esri/symbols/SimpleFillSymbol", "esri/core/HandleOwner", "esri/core/accessorSupport/decorators", "./util"], function (require, exports, __extends, __decorate, Accessor, promiseUtils, Color, SimpleFillSymbol, HandleOwner, decorators_1, util_1) {
    "use strict";
    var rotatingColors = [
        ["#C2D3A4", "#4D5441"],
        ["#D3BFA4", "#544C41"],
        ["#B1B1D3", "#464654"],
        ["#D0B1D3", "#524654"],
        ["#B1C6D3", "#464E54"],
        ["#B1D3C5", "#46544E"],
        ["#D36F19", "#542C0A"],
        ["#D31D5C", "#540C24"],
        ["#D3CA1E", "#54500C"],
        ["#D3766C", "#542F2B"],
        ["#DAD451", "#545238"]
    ];
    var secondInMs = 1000;
    var gameDurationInSeconds = 30;
    function getCorrect(_a) {
        var a = _a[0], b = _a[1];
        return isCorrect(a) ? a : b;
    }
    function isCorrect(choice) {
        return !!choice.feature.geometry;
    }
    var GuessWhereViewModel = /** @class */ (function (_super) {
        __extends(GuessWhereViewModel, _super);
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        function GuessWhereViewModel(props) {
            var _this = _super.call(this) || this;
            //--------------------------------------------------------------------------
            //
            //  Variables
            //
            //--------------------------------------------------------------------------
            _this._active = false;
            _this._choiceSymbol = new SimpleFillSymbol({
                outline: { type: "simple-line", width: 2 }
            });
            _this._gameData = null;
            _this._nextChoices = null;
            _this._timerIntervalId = null;
            _this._resultDelayInMs = 1000;
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
            //  countdown
            //----------------------------------
            _this.countdown = -1;
            //----------------------------------
            //  duration
            //----------------------------------
            _this.duration = gameDurationInSeconds;
            //----------------------------------
            //  points
            //----------------------------------
            _this.points = -1;
            //----------------------------------
            //  view
            //----------------------------------
            _this.view = null;
            return _this;
        }
        GuessWhereViewModel.prototype.initialize = function () {
            var _this = this;
            util_1.fetchGameData()
                .then(function (data) {
                _this._gameData = data;
                _this.notifyChange("state");
            })
                .then(function () { return _this._fetchNextChoices(); });
            this.handles.add(this.watch("choices", function (choices) { return _this._goToChoice(choices); }));
        };
        Object.defineProperty(GuessWhereViewModel.prototype, "state", {
            //----------------------------------
            //  state
            //----------------------------------
            get: function () {
                return !this._gameData ? "loading" : !this._active ? "splash" : this.countdown === -1 ? "game-over" : "playing";
            },
            enumerable: true,
            configurable: true
        });
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        GuessWhereViewModel.prototype.start = function () {
            if (!this._gameData || this._active) {
                console.log("has active game or has not started");
                return;
            }
            this._fetchNextChoices();
            this._set("choices", this._nextChoices);
            this._set("points", 0);
            this._active = true;
            this._startTimer();
            this.notifyChange("state");
        };
        GuessWhereViewModel.prototype.choose = function (choice) {
            var _this = this;
            if (!this._gameData || !this._active) {
                console.log("game has not started");
                return;
            }
            this._fetchNextChoices();
            var correct = getCorrect(this.choices);
            if (choice === correct) {
                this._set("points", this.points + 1);
            }
            return {
                choice: correct,
                done: function () {
                    return promiseUtils.create(function (resolve) {
                        setTimeout(function () {
                            _this._set("choices", _this._nextChoices);
                            resolve();
                        }, _this._resultDelayInMs);
                    });
                }
            };
        };
        GuessWhereViewModel.prototype.end = function () {
            if (!this._gameData || !this._active) {
                console.log("has no active game");
                return;
            }
            this._active = false;
            this._stopTimer();
            this.notifyChange("state");
            this.view.graphics.removeAll();
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        GuessWhereViewModel.prototype._goToChoice = function (choices) {
            if (!choices) {
                return;
            }
            var correct = getCorrect(choices);
            var view = this.view;
            view.goTo(correct.feature, { animate: false });
            view.graphics.removeAll();
            view.graphics.add(correct.feature);
        };
        GuessWhereViewModel.prototype._fetchNextChoices = function () {
            var _this = this;
            return this._gameData
                .generateChoices()
                .then(function (choices) {
                var correct = getCorrect(choices);
                var _a = rotatingColors[Math.floor(Math.random() * rotatingColors.length)], fillColor = _a[0], outlineColor = _a[1];
                _this._choiceSymbol.color = new Color(fillColor);
                _this._choiceSymbol.outline.color = new Color(outlineColor);
                correct.feature.symbol = _this._choiceSymbol.clone();
                return choices;
            })
                .then(function (choices) { return (_this._nextChoices = choices); });
        };
        GuessWhereViewModel.prototype._startTimer = function () {
            var _this = this;
            if (this._timerIntervalId) {
                return;
            }
            this._set("countdown", this.duration);
            this._timerIntervalId = setInterval(function () {
                var countdown = _this.countdown;
                if (countdown === -1) {
                    _this._stopTimer();
                    return;
                }
                _this._set("countdown", countdown - 1);
            }, secondInMs);
        };
        GuessWhereViewModel.prototype._stopTimer = function () {
            if (!this._timerIntervalId) {
                return;
            }
            clearInterval(this._timerIntervalId);
            this._timerIntervalId = null;
            this._set("choices", null);
            this._fetchNextChoices();
            this.notifyChange("state");
        };
        __decorate([
            decorators_1.property({
                readOnly: true
            })
        ], GuessWhereViewModel.prototype, "choices", void 0);
        __decorate([
            decorators_1.property({
                readOnly: true
            })
        ], GuessWhereViewModel.prototype, "countdown", void 0);
        __decorate([
            decorators_1.property()
        ], GuessWhereViewModel.prototype, "duration", void 0);
        __decorate([
            decorators_1.property({
                readOnly: true
            })
        ], GuessWhereViewModel.prototype, "points", void 0);
        __decorate([
            decorators_1.property({
                readOnly: true
            })
        ], GuessWhereViewModel.prototype, "state", null);
        __decorate([
            decorators_1.property()
        ], GuessWhereViewModel.prototype, "view", void 0);
        GuessWhereViewModel = __decorate([
            decorators_1.subclass("esri.demo.WebMapShowcaseViewModel")
        ], GuessWhereViewModel);
        return GuessWhereViewModel;
    }(decorators_1.declared(Accessor, HandleOwner)));
    return GuessWhereViewModel;
});
//# sourceMappingURL=GuessWhereViewModel.js.map