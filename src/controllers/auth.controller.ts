import { AuthService } from './../services/auth.service';
import { Request, Response } from "express";
import { asyncHandler } from "../utils/helper";

export class AuthController {
	static register = asyncHandler(
		async (req: Request, res: Response) => {
			const { name, email, password } = req.body;
			const user = await AuthService.register({ name, email, password });

			res.status(201).json({ 
				status: 1, 
				data: user 
			});
		}
	);

	static login = asyncHandler(
		async (req: Request, res: Response) => {
			const { email, password } = req.body;
			const result = await AuthService.login({ email, password });

			res.status(200).json({
				status: 1,
				data: result
			});
		}
	);
}