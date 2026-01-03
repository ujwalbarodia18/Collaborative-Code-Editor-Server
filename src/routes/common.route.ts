import { Router } from "express";
import { getUserDetailsController } from "../controllers/common.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const commonRoutes = Router();

commonRoutes.post('/getUserDetails', authMiddleware, getUserDetailsController);

export default commonRoutes;