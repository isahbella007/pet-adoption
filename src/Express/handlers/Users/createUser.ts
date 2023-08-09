import asyncHandler from "../../middlewear/asyncHandler"
import { Request, Response } from "express";
import userRepository from "../../Repository/UserRepository";
import userUseCase from "../../UseCase/User";
import ApiError from "../../utils/ApiError";
import ApiSucessResponse from "../../middlewear/apiResponseBuilder";
import loggerConfig from "../../utils/logger";
import prisma from "../../../prisma/client";

export type userRequest = { 
    name: string, 
    email: string, 
    description: string, 
    password: string, 
    state: string, 
    LGA: string, 
    city: string, 
    home_address?: string, 
}
export const createUserAccount = asyncHandler(async (req: Request, res: Response) => { 
    
    const {...userData} = req.body as userRequest
    const image  = req.file
    
    if(!userData.name || !userData.email || !userData.password || !userData.description || !userData.state || !userData.LGA || !userData.city){
            throw new ApiError("Fill all required fields", 400)
        }

    const UserRepo = new userRepository(prisma)
    const UsersUseCase = new userUseCase(UserRepo)
    const addUser = await UsersUseCase.createUser({userData, image})
    // console.log(addUser)
    if('status' in addUser!){
        res.json(addUser)
    }else{ 
        ApiSucessResponse.sendResponse(res, {addUser}) 
    }
     
}) 
  