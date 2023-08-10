import { Request, Response } from "express";
import asyncHandler from "../../middlewear/asyncHandler";
import prisma from "../../../prisma/client";
import UserRepository from "../../Repository/UserRepository";
import userUseCase from "../../UseCase/User";
import ApiSucessResponse from "../../middlewear/apiResponseBuilder";

export const handleProfilePicture = asyncHandler(async (req: Request, res: Response) => { 
    const userId = req.userId

    const userRepo = new UserRepository(prisma)
    const userCase = new userUseCase(userRepo)

    const signedURL = await userCase.getProfile(userId)
    ApiSucessResponse.sendResponse(res, {signedURL})
})