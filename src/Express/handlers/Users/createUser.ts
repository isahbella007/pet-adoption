import asyncHandler from "../../middlewear/asyncHandler"
import { Request, Response } from "express";
import userRepository from "../../Repository/UserRepository";
import userUseCase from "../../UseCase/User";
import ApiError from "../../utils/ApiError";
import ApiSucessResponse from "../../middlewear/apiResponseBuilder";
import loggerConfig from "../../utils/logger";
import prisma from "../../../prisma/client";
import { userRequest } from "../../types/user";


export const createUserAccount = asyncHandler(async (req: Request, res: Response) => { 
    
    const {...userData} = req.body as userRequest
    const image  = req.file
    
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
  