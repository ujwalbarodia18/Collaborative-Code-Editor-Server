import { Request, Response, Router } from "express";
import { CommonController } from "../controllers/common.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const commonRoutes = Router();

commonRoutes.post('/getUserDetails', authMiddleware, CommonController.getUserDetails);
commonRoutes.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        status: 1,
        message: "Server running successfully!"
    })
});

export default commonRoutes;