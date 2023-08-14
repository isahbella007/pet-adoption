import PetRepository from "../Repository/petRepository"
import PetsSchema, { PetType } from "../types/pet"
import ApiError from "../utils/ApiError"

class PetUseCase { 
    petRepository: PetRepository
    constructor(petRepo : PetRepository){ 
        this.petRepository = petRepo
    }

    async addPet({petDetails, images}: {petDetails: PetType , images: Express.Multer.File[]}){ 
        const result = PetsSchema.safeParse(petDetails)

        if(!result.success){ 
            const errorMessage = result.error.issues[0].message
            const path = result.error.issues[0].path[0]
            throw new ApiError(`${path} has error message: ${errorMessage}`, 400)
        }

        if(!images){
            throw new ApiError("Must provide 2 or more images", 400)
        }
        if(images.length < 2 || images.length > 5){
            throw new ApiError("Provide between 2 to 5 images", 400)
        }
        return this.petRepository.addPet({petDetails, images})
    }

}

export default PetUseCase