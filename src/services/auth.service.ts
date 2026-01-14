import { UserModel } from '../models/user.model';
import { compare, hash } from 'bcrypt';
import { ErrorFramework } from '../utils/error';
import { signToken } from '../utils/jwt';
import mongoose from 'mongoose';

export class AuthService {
    static async login(loginDetails: any) {
        const {email, password} = loginDetails;
        if (!email || !password) {
            throw new ErrorFramework('Email and password required', 400);
        }

        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) {
            throw new ErrorFramework('No such user exists', 400);
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
            throw new ErrorFramework('Invalid credentials', 400);
        }

        const token = signToken({
            userId: user._id.toString()
        });

        return { token };
    }

    static async register(userDetails: any) {
        const { name, email, password } = userDetails;
        if (!email || !password || !name) {
            throw new ErrorFramework('Name, email and password required', 400);
        }

        try {
            const hashedPassword = await hash(password, 10);

            const newUser = await UserModel.create({
                name,
                email,
                password: hashedPassword,
            });
            const user = await UserModel.findById(newUser._id);

            if (!user) {
                throw new ErrorFramework("Something went wrong", 500);
            }

            const token = signToken({
                userId: user._id.toString()
            });

            return { token };
        }
        catch(err: any) {
            if (err instanceof mongoose.Error.ValidationError) {
                throw new ErrorFramework(err.message, 400);
            }

            if (err.code === 11000) {
                const field = Object.keys(err.keyValue)[0];
                const value = err.keyValue[field];

                throw new ErrorFramework(
                    `${field} '${value}' already exists`,
                    409
                );
            }

            throw new ErrorFramework("Database error", 500);
        }
    }
}

// export async function loginService(loginDetails: any) {
//     const {email, password} = loginDetails;
//   if (!email || !password) {
//     throw new ErrorFramework('Email and password required', 400);
//   }

//   const user = await UserModel.findOne({ email }).select('+password');
//   if (!user) {
//     throw new ErrorFramework('No such user exists', 400);
//   }

//   const isValid = await compare(password, user.password);
//   if (!isValid) {
//     throw new ErrorFramework('Invalid credentials', 400);
//   }

//   const token = signToken({
//     userId: user._id.toString()
//   });

//   return { token };
// }

// export async function registerService(userDetails: any) {
//     const { name, email, password } = userDetails;
//     if (!email || !password || !name) {
//         throw new ErrorFramework('Name, email and password required', 400);
//     }

//     try {
//         const hashedPassword = await hash(password, 10);

//         const newUser = await UserModel.create({
//             name,
//             email,
//             password: hashedPassword,
//         });
//         const user = await UserModel.findById(newUser._id);

//         if (!user) {
//             throw new ErrorFramework("Something went wrong", 500);
//         }

//         const token = signToken({
//             userId: user._id.toString()
//         });

//         return { token };
//     }
//     catch(err: any) {
//         if (err instanceof mongoose.Error.ValidationError) {
//             throw new ErrorFramework(err.message, 400);
//         }

//         if (err.code === 11000) {
//             const field = Object.keys(err.keyValue)[0];
//             const value = err.keyValue[field];

//             throw new ErrorFramework(
//                 `${field} '${value}' already exists`,
//                 409
//             );
//         }

//         throw new ErrorFramework("Database error", 500);
//     }
// }