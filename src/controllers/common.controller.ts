import { Request, Response } from "express";
import { CommonService } from "../services/common.service";
import { asyncHandler } from "../utils/helper";

export class CommonController {
    static getUserDetails = asyncHandler(
        async(req: Request, res: Response) => {
            const { userId } = (req as any).user;
            const user = await CommonService.getUser(userId);
            
            res.status(200).json({
                status: 1,
                data: user
            })
        }
    );
}