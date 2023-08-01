import UserRepository from "../InterfaceAdapters/Repository/UserRepository"

class userUseCase { 
    private userRepository: UserRepository
    
    constructor(userRepository: UserRepository){ 
        this.userRepository = userRepository
    }

    async createUserWithoutImage(name:string, email:string, description:string, password: string){ 
        return this.userRepository.addWithoutImage({name, email, description, password})
    }

    async createUserWithImage(name:string, email:string, description: string, password: string, image: Express.Multer.File){ 
        return this.userRepository.addWithImage({name, email, description, password, image})
    }

    async LoginUser(email:string, password: string){ 
        return this.userRepository.userLogin({email, password})
    }

    async getUserDetails(userId:string){ 
        return this.userRepository.getUserDetails(userId)
    }

    async updateUserDetails(userId: string, name:string, email:string, description:string, password: string, image: Express.Multer.File | undefined){ 
        return this.userRepository.updateUser(userId, {name, email, description, password, image})
    }
}

export default userUseCase