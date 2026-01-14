import { Router } from "express";
import { CommonController } from "../controllers/common.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const commonRoutes = Router();

commonRoutes.post('/getUserDetails', authMiddleware, CommonController.getUserDetails);

export default commonRoutes;