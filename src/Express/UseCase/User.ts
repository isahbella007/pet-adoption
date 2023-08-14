import UserRepository from "../Repository/UserRepository"
import userSchema, { userRequest } from "../types/user"
import ApiError from "../utils/ApiError"

class userUseCase { 
    private userRepository: UserRepository
    
    constructor(userRepository: UserRepository){ 
        this.userRepository = userRepository
    }

    async createUser({userData, image}:{userData:userRequest, image: Express.Multer.File | undefined}){
        const result = userSchema.safeParse(userData)
        if(!result.success){ 
            const validationErroMessage = result.error.issues[0].message
            throw new ApiError(validationErroMessage, 400)
        }
        return this.userRepository.addUser(userData, image)
    }

    async LoginUser(email:string, password: string){ 
        if(!email || !password){throw new ApiError("Fill all required fields", 400)}
        return this.userRepository.userLogin({email, password})
    }

    async getUserDetails(userId:string){ 
        return this.userRepository.getUserDetails(userId)
    }

    async updateUserDetails({userId, userData, image}: {userId: string | undefined, userData: userRequest, image: Express.Multer.File | undefined}){ 
        const result = userSchema.safeParse(userData)
        if(!result.success){ 
            const validationErroMessage = result.error.issues[0].message
            throw new ApiError(validationErroMessage, 400)
        }
        return this.userRepository.updateUser(userId, userData, image)
    }

    async getProfile(userId: string | undefined){ 
        return this.userRepository.getUserProfile(userId)
    }
}

export default userUseCase