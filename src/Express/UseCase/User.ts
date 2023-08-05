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

    async updateUserDetails(userId: string, name:string, email:string, description:string, password: string, image: Express.Multer.File | undefined, state: string, LGA: string, city: string, home_address: string){ 
        return this.userRepository.updateUser(userId, {name, email, description, password, image, state, LGA, city, home_address})
    }
}

export default userUseCase