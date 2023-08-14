import { PrismaClient } from "@prisma/client"
import { PetType, stringToBoolean } from "../types/pet"
import googleStorage from "../services/googleStorage"
import {v4 as uuidv4} from "uuid"
import loggerConfig from "../utils/logger"
import DatabaseErrorBuilder from "../utils/databaseErrorBuilder"
import env from "dotenv"

env.config({path: "../../.env"})

class PetRepository{ 
    prisma: PrismaClient
    constructor(prisma: PrismaClient){
        this.prisma = prisma
    }
    async addPet({petDetails, images}: {petDetails: PetType, images: Express.Multer.File[]}){
        // Proceed to add the pet to the database
        let addedPet 
         
        try{ 
            addedPet = await this.prisma.pets.create({ 
                data: {
                    user_id: "75675746-591a-4c62-82b1-eed9ac595741",
                    name: petDetails.name, 
                    breed: petDetails.breed, 
                    description: petDetails.description, 
                    size: Number(petDetails.size), 
                    gender: petDetails.gender, 
                    coat_length: petDetails.coat_length,
                    urgent_adoption: stringToBoolean(petDetails.urgent_adoption) , 
                    fee: Number(petDetails.fee), 
                    flag: "PENDING", 
                    pet_type: petDetails.pet_type
                }
            })
            const pet_id = addedPet.id
            const petAddress = await this.prisma.pet_Address.create({ 
                data: { 
                    pet_id: pet_id,
                    state: petDetails.state, 
                    LGA: petDetails.LGA, 
                    city: petDetails.city
                }
            })

            // check if petDetails.good_with is an array, if it is an array, leave it
            // as it is otherwise, make it an array so you can loop theough it
            const good_with_values = Array.isArray(petDetails.good_with) ? petDetails.good_with : [petDetails.good_with]
            const goodWithDetails = good_with_values.map((values) => ({ 
                pet_id: pet_id, 
                good_with: values.toString()
            }))
              
            const behaviour_values = Array.isArray(petDetails.behaviour) ? petDetails.behaviour : [petDetails.behaviour]
            const petBehaviour = behaviour_values.map((values) => ({ 
                pet_id: pet_id, 
                behaviour: values.toString()
            }))
            
            // add image to gcp storage bucket
            const allImageId = await this.addImageToGCP(petDetails.name, images)
            const petImages = allImageId.map((values) => ({ 
                pet_id: pet_id, 
                pet_image_id: values.toString()
            }))
            
            
            Promise.all([
                await this.prisma.good_With.createMany({ 
                    data: goodWithDetails
                }),
                await this.prisma.pet_Behaviour.createMany({
                    data: petBehaviour
                }),
                await this.prisma.pet_Images.createMany({
                    data: petImages
                })
            ])

            return "Pet Added Successfully"
        }catch(error:any){ 
            loggerConfig.error(error)
            throw new DatabaseErrorBuilder(error).build()
        }
    }

    async petRecords(){}

    async updatePetInfo(){}

    async deletePet(){}

    async getAllPets(){
        // this is done in order of 'urgent' flag
        // this includes filtering
    }

    async getLoggedInUserPets(){}

    async addPetToSaved(){
        // Logged in users should be able to add pet to saved(wishlist)
    }

    async addImageToGCP( name: string, images:Express.Multer.File[]){ 
        try{ 
            const allPetImageId = await Promise.all(images.map(async (image) => {
                const uuid = uuidv4()
                const petImageId = `${name}-${uuid}`
                await googleStorage.bucket(`${process.env.BUCKET_NAME}`).upload(image.path, {
                    destination: `pets/${petImageId}`
                })
                return petImageId
            }))

            return allPetImageId
        }catch(error){ 
            loggerConfig.error(error)
            throw new Error("Failed to upload image for pet ")
        }
        
    }


}

export default PetRepository