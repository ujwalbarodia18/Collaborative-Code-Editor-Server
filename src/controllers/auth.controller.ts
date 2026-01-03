import { compare, hash } from "bcrypt";
import { UserModel } from "../models/user.model";
import { signToken } from "../utils/jwt";
import { Request, Response, Router } from "express";
import { ErrorFramework } from "../utils/error";
import { asyncHandler } from "../utils/helper";
import { loginService, registerService } from "../services/auth.service";

// export async function register(userDetails: any) {
//     const { name, email, password } = userDetails;
// 	if (!email || !password || !name) {
// 		throw new ErrorFramework('Name, email and password required', 400);
// 	}
//     const hashedPassword = await hash(password, 10);
// 	const newUser = await UserModel.create({
// 		name,
// 		email,
// 		password: hashedPassword,
// 	});

//     const user = await UserModel.findById(newUser._id);
//     return user;
// }

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
	const { name, email, password } = req.body;
	// try {
		const user = await registerService({ name, email, password });

		res.status(201).json({ 
			status: 1, 
			data: user 
		});
	// }
	// catch(err) {
	// 	res.status(400).json({
	// 		err
	// 	})
	// }
	
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const result = await loginService({ email, password });

	res.status(200).json({
		status: 1,
		data: result
	});
  }
);