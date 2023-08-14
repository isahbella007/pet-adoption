import {Request, Response} from "express"
import asyncHandler from "../../middlewear/asyncHandler"
import PetRepository from "../../Repository/petRepository"
import prisma from "../../../prisma/client"
import PetUseCase from "../../UseCase/pet"
import { PetType } from "../../types/pet"
import ApiSucessResponse from "../../middlewear/apiResponseBuilder"

export const addPetHandler = asyncHandler(async (req: Request, res:Response) => { 
    const {...petDetails} = req.body as PetType
    const images = req.files as Express.Multer.File[]

    // console.log(images)
    const petRepository = new PetRepository(prisma)
    const petUseCase = new PetUseCase(petRepository)

    const addPet = await petUseCase.addPet({petDetails, images})
    ApiSucessResponse.sendResponse(res, addPet)

})