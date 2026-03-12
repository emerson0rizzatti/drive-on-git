"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CloneController_1 = require("../controllers/CloneController");
const asyncErrorWrapper_1 = require("../middleware/asyncErrorWrapper");
const authGuard_1 = require("../middleware/authGuard");
const router = express_1.default.Router();
router.use(authGuard_1.authGuard); // Both Google + GitHub required
router.post('/start', (0, asyncErrorWrapper_1.asyncErrorWrapper)(async (req, res) => CloneController_1.cloneController.startClone(req, res)));
router.get('/status/:jobId', (req, res) => CloneController_1.cloneController.streamStatus(req, res));
exports.default = router;
//# sourceMappingURL=cloneRoutes.js.map