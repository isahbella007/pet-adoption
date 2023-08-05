import { Request, Response } from "express";
import userUseCase from "../../UseCase/User";
import userRepository from "../../Repository/UserRepository";
import jwt from "jsonwebtoken"
import env from "dotenv"
import asyncHandler from "../../middlewear/asyncHandler";

env.config({path: "../../.env"})


const handleUserLogin =  async (req:Request, res: Response) => { 
    const {email, password}:{email:string, password: string} = req.body
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
        res.set("Authorization", `Bearer ${access_token}`).json("Loggin Sucessful")
    }else{ 
        res.status(406).json({error: "Invalid Credentials "})
    }
}

const handleLogout = (req: Request, res: Response) => { 
    res.clearCookie("jwt")
    res.clearCookie("refreshToken")
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully.' });
}

const handlegetUserProfile =  async(req: Request, res: Response) => { 
    const userRepo = new userRepository()
    const userCase = new userUseCase(userRepo)
    const userId = req?.userId ;
    const userProfile = await userCase.getUserDetails(userId!)
    res.status(200).json( userProfile)
}

// collect the storage.single("user_image") from the route 
const handleUserUpdate = async(req: Request, res: Response) => { 
    const {name, email, description, password, state, LGA, city, home_address}:{name: string, email: string, description: string, password: string, state: string, LGA: string, city: string, home_address: string} = req.body
    const id = req.params.id as string
    const image = req.file 
    const userId = req?.userId
    
    const userRepo = new userRepository()
    const userCase = new userUseCase(userRepo)

    const updateUser = await userCase.updateUserDetails(userId!, name, email, description, password, image, state, LGA, city, home_address)
    res.json(updateUser)
}


