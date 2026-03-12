"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GitHubController_1 = require("../controllers/GitHubController");
const asyncErrorWrapper_1 = require("../middleware/asyncErrorWrapper");
const authGuard_1 = require("../middleware/authGuard");
const router = express_1.default.Router();
router.use(authGuard_1.githubAuthGuard);
router.get('/repos', (0, asyncErrorWrapper_1.asyncErrorWrapper)((req, res) => GitHubController_1.gitHubController.listRepos(req, res)));
router.get('/repos/tagged', (0, asyncErrorWrapper_1.asyncErrorWrapper)((req, res) => GitHubController_1.gitHubController.listTaggedRepos(req, res)));
router.post('/repos', (0, asyncErrorWrapper_1.asyncErrorWrapper)((req, res) => GitHubController_1.gitHubController.createRepo(req, res)));
exports.default = router;
//# sourceMappingURL=githubRoutes.js.map