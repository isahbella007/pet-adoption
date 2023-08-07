import prisma from "../../Database/prisma/client";
import User from "../../Entities/User"
import { Prisma, PrismaClient } from "@prisma/client"
import cloudinary from "../../Express/services/CloudinaryConfig";
import { v4 as uuidv4 } from 'uuid';
import sanitizePublicId from "../../Express/utils/PublicId";
import { userRequest } from "../../Express/controllers/Users/createUser";
import DatabaseErrorBuilder from "../../Express/utils/databaseErrorBuilder";
import googleStorage from "../services/googleStorage";
import loggerConfig from "../utils/logger";
import ValidationError from "../utils/validationErrorBuilder";

class UserRepository {
    prisma: PrismaClient 
    constructor(){ 
        this.prisma = prisma
    }

    async addUser(userData: userRequest , image: Express.Multer.File | undefined) { 
        const uuid = uuidv4()
        let newUser
        let mergedId: string | null = image !== undefined ? `${userData.name}${uuid}` : null

        try{ 
            try{
                newUser = await this.prisma.user.create({ 
                    data:{ 
                        address: { 
                            create: {
                                state: userData.state, 
                                LGA: userData.LGA, 
                                city: userData.city, 
                                home_address: userData.home_address
                            }
                        },    
                        name: userData.name, 
                        email: userData.email, 
                        description: userData.description,
                        password: userData.password, 
                        image_public_id: mergedId
                    } 
                })
            }catch(error: any){
                loggerConfig.error(error)
                return new DatabaseErrorBuilder(error).build()
            }
            
            
            if(image !== undefined){  
                try{ 
                    const userNewImage = await googleStorage.bucket("pet_api").upload(image.path, { 
                        destination: `users/${mergedId}`, 
                        public: false
                    })
                    
                    // get the proper url to display the image. This is done because the storage is set to private so you decrypt it 
                    const expiration = Date.now() + 2 * 60 * 1000;
                    const [url] = await googleStorage.bucket("pet_api").file(`users/${mergedId}`).getSignedUrl({version: "v4", action: "read", expires: expiration})
                }catch(error){ 
                    loggerConfig.error(error)
                }  
            }
            return newUser
            
        }catch(error:any){ 
            loggerConfig.error(error)
        }
    }

    async userLogin(userData: {email:string, password: string}){ 
        const userDetails = await this.prisma.user.findFirst({
            where: {
                email: userData.email, 
                password: userData.password,
            }
        })
        return userDetails
    }


    async getUserDetails(user_id: string){ 
        try{ 
            const userDetails = await this.prisma.user.findUnique({ 
                where: { 
                    id: user_id
                }, 
                include: { 
                    address: true
                }, 
                
            })
            return userDetails
        }catch(error: any ){ 
            loggerConfig.error(error)
            throw new DatabaseErrorBuilder(error).build()
        }
        
    }

    async updateUser(userId:string | undefined, userData: userRequest, image : Express.Multer.File | undefined){ 
        try{ 
            if(userId === undefined){throw new ValidationError("User Id is required ",400 )}
                
            const loggedInUser = await this.getUserDetails(userId)
            if(loggedInUser!.image_public_id && image !== undefined){ 
                await googleStorage.bucket("pet_api").file(`users/${loggedInUser?.image_public_id}`).delete()
            }
            let custom_public_id = loggedInUser!.image_public_id
            if(image !== undefined){ 
                const uuid = uuidv4()
                custom_public_id = `${userData.name}${uuid}`
                await googleStorage.bucket("pet_api").upload(image.path, { 
                    destination: `users/${custom_public_id}`, 
                    public: false
                })
            }

            // Update the database with the new name, email, description, password, image and public_id
            const existingAddress = await this.prisma.address.findUnique({
                where: { user_id: userId },
            });

            if(!existingAddress){throw new ValidationError("User Address not found", 404)}
            
            const updatedAddress = await this.prisma.address.update({ 
                where: {user_id: userId},
                data: { 
                    state: userData.state,
                    LGA: userData.LGA,
                    city: userData.city,
                    home_address: userData.home_address,
                }
            })

            const updatedData = await this.prisma.user.update({
                where: { id: userId },
                data: {
                address: { connect: { user_id: updatedAddress.user_id } }, // Use connect instead of update
                name: userData.name,
                email: userData.email,
                description: userData.description,
                password: userData.password,
                image_public_id: custom_public_id,
                },
                include: { address: true },
            });

            return updatedData
           
        }catch(error){ 
            loggerConfig.error(error)
        }
    }

    async getUserProfile(userId: string | undefined){ 
        if(userId === undefined){throw new ValidationError("User id is needed", 400)}

        const userDetails = await this.getUserDetails(userId)
        if(!userDetails){ throw new ValidationError("User Details not found", 400)}

        const signedURL = await googleStorage.bucket("pet_api").file(`users/${userDetails?.image_public_id}`).getSignedUrl({ 
            version: "v4", 
            action: "read", 
            expires: Date.now() + 25*60*1000
        })

        return signedURL
    }
    
}
export default UserRepository