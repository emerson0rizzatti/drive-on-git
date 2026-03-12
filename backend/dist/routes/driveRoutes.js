"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DriveController_1 = require("../controllers/DriveController");
const asyncErrorWrapper_1 = require("../middleware/asyncErrorWrapper");
const authGuard_1 = require("../middleware/authGuard");
const router = express_1.default.Router();
router.use(authGuard_1.googleAuthGuard);
router.get('/folders', (0, asyncErrorWrapper_1.asyncErrorWrapper)((req, res) => DriveController_1.driveController.listFolders(req, res)));
router.get('/folders/:id', (0, asyncErrorWrapper_1.asyncErrorWrapper)((req, res) => DriveController_1.driveController.listFolderContents(req, res)));
router.get('/inspect/:id', (0, asyncErrorWrapper_1.asyncErrorWrapper)((req, res) => DriveController_1.driveController.inspectFolder(req, res)));
exports.default = router;
//# sourceMappingURL=driveRoutes.js.map