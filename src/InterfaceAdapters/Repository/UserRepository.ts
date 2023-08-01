import prisma from "../../Frameworks/Database/prisma/client"
import User from "../../Entities/User"
import { PrismaClient } from "@prisma/client"
import cloudinary from "../../Frameworks/Cloudinary/config"
import { v4 as uuidv4 } from 'uuid';
import sanitizePublicId from "../../Frameworks/Express/utils/PublicId";

class userRepository {
    prisma: PrismaClient 
    constructor(){ 
        this.prisma = prisma
    }

    async addWithoutImage(userData: { name: string; email: string; description: string, password: string }) { 
        // before you create, check if email exits 
        const duplicateEmail = await this.prisma.user.findFirst({ 
            where: {email: userData.email}
        })
        
        if(duplicateEmail){ 
            return "Email already exists"
        }else{ 
            const newUser = await this.prisma.user.create({ 
                data:{ 
                    name: userData.name, 
                    email: userData.email, 
                    description: userData.description,
                    password: userData.password 
                    
                }
            })
            return new User(newUser.id, newUser.name, newUser.email, newUser.description, newUser.password,  newUser.image)
        }
        
    }
    async addWithImage(userData: {name:string, email:string, description:string, password: string,  image:Express.Multer.File}){ 
        const duplicateEmail = await this.prisma.user.findFirst({ 
            where: {email: userData.email}
        })

        if(duplicateEmail){ 
            return "Email already exists"
        }else{ 
            // upload to the cloudinary user/storage
            const currentTimestamp = Math.floor(Date.now() / 1000) // Unix time in seconds
            const uuid = uuidv4()
            const mergedId = `${userData.name}${uuid.replace(/-/g, '')}`
            const custom_public_id = sanitizePublicId(mergedId)
  
            try{ 
                const uploadedUserImage = await cloudinary.uploader.upload(userData.image.path, { 
                    folder: "users/", 
                    public_id: custom_public_id, 
                    timestamp: currentTimestamp
                })
                const secure_url = uploadedUserImage.secure_url
                const newUser = await this.prisma.user.create({ 
                    data: { 
                        name: userData.name, 
                        email: userData.email, 
                        description: userData.description, 
                        password: userData.password,
                        image: secure_url, 
                        image_public_id: custom_public_id
                    }
                })
                return new User(newUser.id, newUser.name, newUser.email, newUser.description, newUser.password, newUser.image)
            }catch(error){ 
                console.log("Error uploading ", error)
                throw new Error("Failed to add user with image");
            }
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

    async getUserDetails(userId: string){ 
        const userDetails = await this.prisma.user.findUnique({ 
            where: { 
                id: userId
            }
        })
        return userDetails
    }

    async updateUser(userId:string, userData: {name: string, email: string, description:string, password: string, image: Express.Multer.File | undefined}){ 
        const currentTimestamp = Math.floor(Date.now() / 1000);
        try{ 
            // get the logged in user public_id
            const loggedInUser = await this.getUserDetails(userId)
            if (!loggedInUser) {
                throw new Error("Logged-in user not found.");
              }

            // Delete this logged in user resource from cloudinary using the public_id if the logged in user has a public.id
            console.log(`the user data image is ${userData.image?.path}`)
            if(loggedInUser.image_public_id && userData.image !== undefined){ 
                await cloudinary.api.delete_resources(
                    [`users/${loggedInUser?.image_public_id}`], 
                    {type: "upload", resource_type: "image"}
                ).then(result => console.log(`result from delting image ${result}`))
            }
            
            // check if the user created a new image to upload
            let secure_url = loggedInUser.image
            // upload the new picture 
            const uuid = uuidv4()
            const mergedId = `${userData.name}${uuid.replace(/-/g, '')}`
            const custom_public_id = sanitizePublicId(mergedId)
            if(userData.image !== undefined){ 
                const userNewImage = await cloudinary.uploader.upload(userData.image.path, {
                    folder: "users/", 
                    public_id: custom_public_id, 
                    timestamp: currentTimestamp
                })
                secure_url = userNewImage.secure_url
            }
           

            // Update the database with the new name, email, description, password, image and public_id
            
            const updatedData = await this.prisma.user.update(
                {
                    where:{id: userId}, 
                    data: {
                        name: userData.name, 
                        email: userData.email, 
                        description: userData.description, 
                        password: userData.password, 
                        image: secure_url, 
                        image_public_id: custom_public_id
                    }
                }
            )
            return updatedData
        }catch(error){ 
            console.log("Error uploading ", error)
            throw new Error("Failed to update user with image");
        }
    }
    
}
export default userRepository