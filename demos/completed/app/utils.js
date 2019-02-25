define(["require", "exports", "esri/Color", "esri/symbols/SimpleFillSymbol", "esri/core/lang"], function (require, exports, Color, SimpleFillSymbol, lang_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    function getCorrect(_a) {
        var a = _a[0], b = _a[1];
        return isCorrect(a) ? a : b;
    }
    exports.getCorrect = getCorrect;
    function isCorrect(choice) {
        return !!choice.feature.geometry;
    }
    function assignSymbol(choices) {
        var _a = rotatingColors[Math.floor(Math.random() * rotatingColors.length)], fillColor = _a[0], outlineColor = _a[1];
        var choiceSymbol = new SimpleFillSymbol({
            color: new Color(fillColor),
            outline: { color: new Color(outlineColor), type: "simple-line", width: 2 }
        });
        var correct = getCorrect(choices);
        correct.feature.symbol = choiceSymbol;
        return choices;
    }
    exports.assignSymbol = assignSymbol;
    function pickChoices(items) {
        var cloned = lang_1.clone(items);
        var a = randomPick(cloned);
        var aIndex = cloned.indexOf(a);
        cloned.splice(aIndex, 1);
        var b = randomPick(cloned);
        return [a, b];
    }
    exports.pickChoices = pickChoices;
    function randomPick(items) {
        return items[Math.round(Math.random() * (items.length - 1))];
    }
});
//# sourceMappingURL=utils.js.map