import { Request, Response } from "express";
import { getUser } from "../services/common.service";
import { asyncHandler } from "../utils/helper";

interface middlewareRequest extends Request {
    user?: any
}

export const getUserDetailsController = asyncHandler(
    async(req: any, res: Response) => {
        const { userId } = req.user;
        const user = await getUser(userId);

        res.status(200).json({
            status: 1,
            data: user
        })
    }
)