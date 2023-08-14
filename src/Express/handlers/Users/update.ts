import { Request, Response } from "express";
import prisma from "../../../prisma/client";
import userUseCase from "../../UseCase/User";
import userRepository from "../../Repository/UserRepository";
import ApiError from "../../utils/ApiError";
import ApiSucessResponse from "../../middlewear/apiResponseBuilder";
import { userRequest } from "../../types/user";

export const handleUserUpdate = async(req: Request, res: Response) => { 
    const {...userData} = req.body as userRequest
    const id = req.params.id as string
    const image = req.file 
    const userId = req?.userId 
    
    const userRepo = new userRepository(prisma)
    const userCase = new userUseCase(userRepo)

    const updateUser = await userCase.updateUserDetails({userId, userData, image})
    if('status' in updateUser!){
        res.json(updateUser)
    }else{ 
        ApiSucessResponse.sendResponse(res, {updateUser}) 
    }
}
