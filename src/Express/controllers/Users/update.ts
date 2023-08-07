import { Request, Response } from "express";
import userUseCase from "../../UseCase/User";
import userRepository from "../../Repository/UserRepository";
import { userRequest } from "./createUser";
import ValidationError from "../../utils/validationErrorBuilder";
import ApiSucessResponse from "../../middlewear/apiResponseBuilder";

export const handleUserUpdate = async(req: Request, res: Response) => { 
    const {...userData} = req.body as userRequest
    const id = req.params.id as string
    const image = req.file 
    const userId = req?.userId 
    
    const userRepo = new userRepository()
    const userCase = new userUseCase(userRepo)

    if(!userData.name || !userData.email || !userData.password || !userData.description || !userData.state || !userData.LGA || !userData.city){
        throw new ValidationError("Fill all required fields", 400)
    }

    const updateUser = await userCase.updateUserDetails({userId, userData, image})
    if('status' in updateUser!){
        res.json(updateUser)
    }else{ 
        ApiSucessResponse.sendResponse(res, {updateUser}) 
    }
}
