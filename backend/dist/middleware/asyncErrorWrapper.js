"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncErrorWrapper = asyncErrorWrapper;
function asyncErrorWrapper(handler) {
    return (req, res, next) => {
        handler(req, res, next).catch(next);
    };
}
//# sourceMappingURL=asyncErrorWrapper.js.map