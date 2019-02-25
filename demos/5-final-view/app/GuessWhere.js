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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/widgets/Widget", "./GuessWhereViewModel", "esri/core/accessorSupport/decorators", "esri/widgets/support/widget"], function (require, exports, __extends, __decorate, Widget, GuessWhereViewModel, decorators_1, widget_1) {
    "use strict";
    var CSS = {
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
    var GuessWhere_final = /** @class */ (function (_super) {
        __extends(GuessWhere_final, _super);
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        function GuessWhere_final(props) {
            var _this = _super.call(this) || this;
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  view
            //----------------------------------
            _this.view = null;
            //----------------------------------
            //  viewModel
            //----------------------------------
            _this.viewModel = new GuessWhereViewModel();
            _this._onChoice = _this._onChoice.bind(_this);
            _this._onRetry = _this._onRetry.bind(_this);
            _this._onStart = _this._onStart.bind(_this);
            _this._onQuit = _this._onQuit.bind(_this);
            return _this;
        }
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        GuessWhere_final.prototype.render = function () {
            var state = this.viewModel.state;
            return (widget_1.tsx("div", { class: this.classes(CSS.esriWidget, CSS.root) }, state === "playing"
                ? this.renderRound()
                : state === "game-over"
                    ? this.renderGameOver()
                    : this.renderMenu()));
        };
        //--------------------------------------------------------------------------
        //
        //  Protected Methods
        //
        //--------------------------------------------------------------------------
        GuessWhere_final.prototype.renderMenu = function () {
            return (widget_1.tsx("div", { class: CSS.menu, key: "menu" },
                widget_1.tsx("h1", { class: CSS.menuTitle },
                    widget_1.tsx("span", { class: CSS.menuTitleText }, "Guess Where?")),
                widget_1.tsx("button", { class: this.classes(CSS.menuButton, CSS.esriButton), onclick: this._onStart }, "Start")));
        };
        GuessWhere_final.prototype.renderGameOver = function () {
            return (widget_1.tsx("div", { class: CSS.menu, key: "game-over" },
                widget_1.tsx("h1", { class: CSS.menuTitle },
                    widget_1.tsx("span", { class: CSS.menuTitleText }, "Game Over")),
                widget_1.tsx("div", { class: CSS.menuTitleText },
                    "Your Score: ",
                    this.viewModel.points),
                widget_1.tsx("div", { class: CSS.menuButtons },
                    widget_1.tsx("button", { class: this.classes(CSS.menuButton, CSS.esriButton), onclick: this._onRetry }, "Retry"),
                    widget_1.tsx("button", { class: this.classes(CSS.menuButton, CSS.esriButton), onclick: this._onQuit }, "Quit"))));
        };
        GuessWhere_final.prototype.renderRound = function () {
            var _a = this.viewModel.choices, a = _a[0], b = _a[1];
            return (widget_1.tsx("div", { class: CSS.round, key: "round" },
                this.renderHUD(),
                widget_1.tsx("div", { class: CSS.choices },
                    this.renderChoice(a, "a"),
                    this.renderChoice(b, "b"))));
        };
        GuessWhere_final.prototype.renderChoice = function (choice, type) {
            return (widget_1.tsx("div", { "aria-label": "Choice " + type, class: this.classes(CSS.choice, type === "a" ? CSS.choiceA : CSS.choiceB), "data-choice": choice, onclick: this._onChoice, role: "button", tabIndex: 0 },
                widget_1.tsx("div", { class: CSS.choiceText }, choice.name),
                widget_1.tsx("div", { class: CSS.choiceBackground })));
        };
        GuessWhere_final.prototype._onChoice = function (event) {
            var element = event.currentTarget;
            var choice = element["data-choice"];
            this.viewModel.choose(choice);
        };
        GuessWhere_final.prototype.renderHUD = function () {
            return (widget_1.tsx("div", { class: CSS.hud },
                widget_1.tsx("div", { class: CSS.hudText, "aria-label": "Score" }, this.viewModel.points)));
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        GuessWhere_final.prototype._onStart = function () {
            this.viewModel.start();
        };
        GuessWhere_final.prototype._onRetry = function () {
            this.viewModel.end();
            this.viewModel.start();
        };
        GuessWhere_final.prototype._onQuit = function () {
            this.viewModel.end();
        };
        __decorate([
            decorators_1.aliasOf("viewModel.view")
        ], GuessWhere_final.prototype, "view", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable(["viewModel.choices", "viewModel.countdown", "viewModel.state"])
        ], GuessWhere_final.prototype, "viewModel", void 0);
        GuessWhere_final = __decorate([
            decorators_1.subclass("esri.demo.GuessWhere")
        ], GuessWhere_final);
        return GuessWhere_final;
    }(decorators_1.declared(Widget)));
    return GuessWhere_final;
});
//# sourceMappingURL=GuessWhere.js.map