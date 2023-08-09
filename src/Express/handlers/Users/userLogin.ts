import { Request, Response } from "express";
import userUseCase from "../../UseCase/User";
import userRepository from "../../Repository/UserRepository";
import jwt from "jsonwebtoken"
import env from "dotenv"
import asyncHandler from "../../middlewear/asyncHandler";
import ApiSucessResponse from "../../middlewear/apiResponseBuilder";
import ApiError from "../../utils/ApiError";

env.config({path: "../../.env"})

export const handleUserLogin = asyncHandler(async (req:Request, res: Response) => { 
    const {email, password}:{email:string, password: string} = req.body
    if(!email || !password){throw new ApiError("Fill all required fields", 400)}
    
    const userRepo = new userRepository()
    const userCase = new userUseCase(userRepo)

    const loggedInUser = await userCase.LoginUser(email, password)
    
    // create a JWT token for this user 
    if(loggedInUser){ 
        const access_token = jwt.sign(
            { id: loggedInUser?.id },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "15m" }
        );

        const refresh_token = jwt.sign(
            {id: loggedInUser?.id}, 
            process.env.REFRESH_TOKEN_SECRET!, 
            {expiresIn: "1d"}
        )

        // Assigning the refresh_token to the http-Cookie 
        res.cookie("jwt", refresh_token, {
            httpOnly: true, 
            maxAge: 24 * 60 * 60 * 1000, 
            secure: true, 
            sameSite: 'none'
        })
        
        res.set("Authorization", `Bearer ${access_token}`)
        ApiSucessResponse.sendResponse(res, {message: "Login Sucessful"})
    }else{ 
        res.status(406).json({error: "Invalid Credentials "})
    }
})