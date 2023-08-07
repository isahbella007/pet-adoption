import UserRepository from "../Repository/UserRepository"
import { userRequest } from "../controllers/Users/createUser"
class userUseCase { 
    private userRepository: UserRepository
    
    constructor(userRepository: UserRepository){ 
        this.userRepository = userRepository
    }

    async createUser({userData, image}:{userData:userRequest, image: Express.Multer.File | undefined}){
        return this.userRepository.addUser(userData, image)
    }

    async LoginUser(email:string, password: string){ 
        return this.userRepository.userLogin({email, password})
    }

    async getUserDetails(userId:string){ 
        return this.userRepository.getUserDetails(userId)
    }

    async updateUserDetails({userId, userData, image}: {userId: string | undefined, userData: userRequest, image: Express.Multer.File | undefined}){ 
        return this.userRepository.updateUser(userId, userData, image)
    }

    async getProfile(userId: string | undefined){ 
        return this.userRepository.getUserProfile(userId)
    }
}

export default userUseCase