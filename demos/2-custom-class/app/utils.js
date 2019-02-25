define(["require", "exports", "esri/core/lang"], function (require, exports, lang_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function pickChoices(items) {
        var cloned = lang_1.clone(items);
        var a = randomPick(cloned);
        var aIndex = items.indexOf(a);
        var b = randomPick(cloned.splice(aIndex, 1));
        return [a, b];
    }
    exports.pickChoices = pickChoices;
    function randomPick(items) {
        return items[Math.floor(Math.random() * (items.length - 1))];
    }
});
//# sourceMappingURL=utils.js.map