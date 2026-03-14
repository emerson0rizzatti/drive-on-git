"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DriveController_1 = require("../controllers/DriveController");
const asyncErrorWrapper_1 = require("../middleware/asyncErrorWrapper");
const authGuard_1 = require("../middleware/authGuard");
const validateRequest_1 = require("../middleware/validateRequest");
const zod_1 = require("zod");
const drive_schema_1 = require("../validators/drive.schema");
const router = express_1.default.Router();
router.use(authGuard_1.googleAuthGuard);
router.get('/folders', (0, asyncErrorWrapper_1.asyncErrorWrapper)((req, res) => DriveController_1.driveController.listFolders(req, res)));
router.get('/folders/:id', (0, validateRequest_1.validateRequest)(drive_schema_1.driveFolderContentsSchema), (0, asyncErrorWrapper_1.asyncErrorWrapper)((req, res) => DriveController_1.driveController.listFolderContents(req, res)));
router.get('/inspect/:id', (0, validateRequest_1.validateRequest)(zod_1.z.object({ params: drive_schema_1.driveFolderIdSchema })), (0, asyncErrorWrapper_1.asyncErrorWrapper)((req, res) => DriveController_1.driveController.inspectFolder(req, res)));
exports.default = router;
//# sourceMappingURL=driveRoutes.js.map