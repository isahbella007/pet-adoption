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

    async addUser(userData: { name: string; email: string; description: string, password: string, state: string, LGA: string, city: string, home_address: string | null, image: Express.Multer.File | undefined }) { 
        // before you create, check if email exits 
        const duplicateEmail = await this.prisma.user.findFirst({ 
            where: {email: userData.email}
        })
        
        if(duplicateEmail){ 
            return "Email already exists"
        }else{
            let secure_url 
            let custom_public_id
            

            if(userData.image !== undefined){ 
                const currentTimestamp = Math.floor(Date.now() / 1000);
                const uuid = uuidv4()
                const mergedId = `${userData.name}${uuid.replace(/-/g, '')}`
                custom_public_id = sanitizePublicId(mergedId)
                // add the image to the cloduinary 
                const userNewImage = await cloudinary.uploader.upload(userData.image.path, {
                    folder: "users/", 
                    public_id: custom_public_id, 
                    timestamp: currentTimestamp
                })
                secure_url = userNewImage.secure_url
            }
            const newUser = await this.prisma.user.create({ 
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
                    image: secure_url, 
                    image_public_id: custom_public_id
                }
                
            })
            return new User(newUser.id, newUser.name, newUser.email, newUser.description, newUser.password,  newUser.image) 
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
        const userDetails = await this.prisma.user.findUnique({ 
            where: { 
                id: user_id
            }, 
            include: { 
                address: true
            }, 
            
        })
        return userDetails
    }

    async updateUser(userId:string, userData: {name: string, email: string, description:string, password: string, image: Express.Multer.File | undefined, state: string, LGA: string, city: string, home_address: string}){ 
        const currentTimestamp = Math.floor(Date.now() / 1000);
        try{ 
            // get the logged in user public_id
            const loggedInUser = await this.getUserDetails(userId)
            if (!loggedInUser) {
                throw new Error("Logged-in user not found.");
              }

            // Delete this logged in user resource from cloudinary using the public_id if the logged in user has a public.id
            if(loggedInUser.image_public_id && userData.image !== undefined){ 
                await cloudinary.api.delete_resources(
                    [`users/${loggedInUser?.image_public_id}`], 
                    {type: "upload", resource_type: "image"}
                )
            }
            
            // check if the user created a new image to upload
            let secure_url = loggedInUser.image
            let custom_public_id = loggedInUser.image_public_id
            // upload the new picture 
            
            if(userData.image !== undefined){ 
                const uuid = uuidv4()
                const mergedId = `${userData.name}${uuid.replace(/-/g, '')}`
                custom_public_id = sanitizePublicId(mergedId)
                const userNewImage = await cloudinary.uploader.upload(userData.image.path, {
                    folder: "users/", 
                    public_id: custom_public_id, 
                    timestamp: currentTimestamp
                })
                secure_url = userNewImage.secure_url
            }
           

            // Update the database with the new name, email, description, password, image and public_id
            const existingAddress = await this.prisma.address.findUnique({
                where: { user_id: userId },
              });

            if(existingAddress){ 
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
                      image: secure_url,
                      image_public_id: custom_public_id,
                    },
                    include: { address: true },
                  });
                return updatedData
            }else{ 
                return "No Address Record for this user "
            }
            
           
        }catch(error){ 
            console.log("Error uploading ", error)
            throw new Error("Failed to update user with image");
        }
    }
    
}
export default userRepository