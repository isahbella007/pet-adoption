import PetRepository from "../../../Express/Repository/petRepository"
import PetUseCase from "../../../Express/UseCase/pet"
import { PetType } from "../../../Express/types/pet"
import ApiError from "../../../Express/utils/ApiError"

describe("Pet UseCase", () => { 
    
    let mockRepo: PetRepository
    let petUC: PetUseCase
    
    const petDetailsInfo: PetType = {
        name: 'Grace',
        breed: 'Golden Retriever',
        description: 'Non',
        size: 10,
        gender: 'Male',
        coat_length: 'Medium',
        urgent_adoption: 'No',
        fee: 20,
        pet_type: 'Dog',
        good_with: ['cats', 'children'],
        behaviour: ['Home trained'],
        state: 'Somewhere',
        LGA: 'somewhere',
        city: 'saa',
    }
    beforeAll(() => { 
        petUC = new PetUseCase(mockRepo)
        
    })

    it('should throw an Api Error for the first invalid field', async() => {
        await expect(() =>
            petUC.addPet({
                petDetails: petDetailsInfo,
                images: []
            })
        ).rejects.toThrow(ApiError)
    })

    // it('should throw an APi Error if there are no images ', async() => { 
    //     await expect(() => { 
    //         petUC.addPet({
    //             petDetails: petDetailsInfo, 
    //             images: []
    //         })
    //     })
    // })

    // it('should check for valid images and form entry', () => { 

    // })

    // it('should check for invalid amount of images', () => { 

    // })

    // it('should call petRepository.addPet fn', () => { 

    // })
})