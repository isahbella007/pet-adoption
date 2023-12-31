import { Request, Response } from "express";
import prisma from "../../../prisma/client";
import userUseCase from "../../UseCase/User";
import userRepository from "../../Repository/UserRepository";
import ApiSucessResponse from "../../middlewear/apiResponseBuilder";

export const handlegetUserProfile =  async(req: Request, res: Response) => { 
    const userRepo = new userRepository(prisma)
    const userCase = new userUseCase(userRepo)
    const userId = req?.userId ;
    const userProfile = await userCase.getUserDetails(userId!)
    ApiSucessResponse.sendResponse(res, {userProfile}) 
}