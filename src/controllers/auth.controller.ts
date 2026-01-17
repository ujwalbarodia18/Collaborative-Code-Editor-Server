import { AuthService } from './../services/auth.service';
import { Request, Response } from "express";
import { asyncHandler } from "../utils/helper";
import { UserModel } from '../models/user.model';
import { signToken } from '../utils/jwt';

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

	static googleAuth = asyncHandler(
		async (req: Request, res: Response) => {
			const { idToken } = req.body;

			if (!idToken) {
				return res.status(400).json({ message: 'Missing idToken' });
			}

			const googleUser = await AuthService.verifyGoogleIdToken(idToken);

			let user = await UserModel.findOne({ googleId: googleUser.googleId });
			if (!user) {
				user = await UserModel.create({
					googleId: googleUser.googleId,
					email: googleUser.email,
					name: googleUser.name
				});
			}
			const token = signToken({userId: user._id.toString()});

			res.status(201).json({ 
				status: 1, 
				data: { token }
			});
		}
	);
}