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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/Accessor", "esri/core/promiseUtils", "esri/core/HandleOwner", "esri/core/accessorSupport/decorators", "./choiceEngine", "./utils"], function (require, exports, __extends, __decorate, Accessor, promiseUtils, HandleOwner, decorators_1, choiceEngine_1, utils_1) {
    "use strict";
    var secondInMs = 1000;
    var gameDurationInSeconds = 30;
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
            _this._choiceEngine = null;
            _this._result = null;
            _this._resultDelayInMs = 1000;
            _this._timerIntervalId = null;
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
            _this.points = 0;
            //----------------------------------
            //  view
            //----------------------------------
            _this.view = null;
            return _this;
        }
        GuessWhereViewModel.prototype.initialize = function () {
            var _this = this;
            choiceEngine_1.create().then(function (engine) {
                _this._choiceEngine = engine;
                _this.notifyChange("state");
            });
            this.handles.add(this.watch("choices", function (choices) { return _this._goToChoice(choices); }));
        };
        Object.defineProperty(GuessWhereViewModel.prototype, "state", {
            //----------------------------------
            //  state
            //----------------------------------
            get: function () {
                return !this._choiceEngine ? "loading" : !this._active ? "splash" : this.countdown === -1 ? "game-over" : "playing";
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
            var _this = this;
            this._choiceEngine.randomize().then(function () {
                _this._setNextChoices();
                _this._set("points", 0);
                _this._active = true;
                _this._startTimer();
                _this.notifyChange("state");
            });
        };
        GuessWhereViewModel.prototype.choose = function (choice) {
            var _this = this;
            // ignore choices if we're showing a result
            if (this._result) {
                return;
            }
            var correct = utils_1.getCorrect(this.choices);
            if (choice === correct) {
                this._set("points", this.points + 1);
            }
            var result = {
                choice: correct,
                done: function () {
                    return promiseUtils.create(function (resolve) {
                        setTimeout(function () {
                            _this._setNextChoices();
                            _this._result = null;
                            resolve();
                        }, _this._resultDelayInMs);
                    });
                }
            };
            this._result = result;
            return result;
        };
        GuessWhereViewModel.prototype.end = function () {
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
            var correct = utils_1.getCorrect(choices);
            var view = this.view;
            view.goTo(correct.feature, { animate: false });
            view.graphics.removeAll();
            view.graphics.add(correct.feature);
        };
        GuessWhereViewModel.prototype._setNextChoices = function () {
            var _this = this;
            return this._choiceEngine.next().then(function (choices) {
                _this._set("choices", choices);
            });
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
            decorators_1.subclass("esri.demo.GuessWhereViewModel")
        ], GuessWhereViewModel);
        return GuessWhereViewModel;
    }(decorators_1.declared(Accessor, HandleOwner)));
    return GuessWhereViewModel;
});
//# sourceMappingURL=GuessWhereViewModel.js.map