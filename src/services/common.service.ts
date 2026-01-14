import { UserModel } from "../models/user.model";
import { ErrorFramework } from "../utils/error";

export class CommonService {
        static async getUser(userId: string) {
            if (!userId) {
                throw new ErrorFramework('UserId not found', 500);
            }

            const user = await UserModel.findById(userId).select(['email', 'name']);
            if (!user) {
                throw new ErrorFramework('Invalid userId (No user found with this id)', 500);
            }

            return {
                user: {
                    userId: user._id.toString(),
                    email: user.email,
                    name: user.name
                }        
            };
        }
}
// export async function getUser(userId: string) {
//     if (!userId) {
//         throw new ErrorFramework('UserId not found', 500);
//     }

//     const user = await UserModel.findById(userId).select(['email', 'name']);
//     if (!user) {
//         throw new ErrorFramework('Invalid userId (No user found with this id)', 500);
//     }

//     return {
//         user: {
//             userId: user._id.toString(),
//             email: user.email,
//             name: user.name
//         }        
//     };
// }