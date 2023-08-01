import express, { Request, Response } from "express";
import userUseCase from "../../../../UseCase/User";
import userRepository from "../../../../InterfaceAdapters/Repository/UserRepository";
import multer from "multer"
import jwt from "jsonwebtoken"
import env from "dotenv"
import verifyRoute from "../../middlewear/auth";

env.config({path: "../../.env"})
const storage = multer({dest: './public/uploads/user/'})

const userController = express.Router()

userController.post("/create", storage.single("user_image"), async (req: Request, res: Response) => { 
    const {name, email, description, password}: {name: string, email: string, description: string, password: string} = req.body

    const image = req.file
    console.log(image)

    const UserRepo = new userRepository()
    const UsersUseCase = new userUseCase(UserRepo)

    try{ 
        var addNewUser
        if(image == undefined){
            console.log("No Image") 
            addNewUser = await UsersUseCase.createUserWithoutImage(name, email, description, password)
            res.status(201).json(addNewUser)
        }else{ 
            addNewUser = await UsersUseCase.createUserWithImage(name, email, description, password,  image)
            res.status(201).json(addNewUser)
        }
            
    }catch(error){ 
        console.error("Error adding new user:", error);
        res.status(501).json({error: "Failed to add new user"})
    }
})

userController.post("/login", async (req:Request, res: Response) => { 
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
            {expiresIn: "1h"}
        )

        // Assigning the refresh_token to the http-Cookie 
        res.cookie("jwt", refresh_token, {
            httpOnly: true, 
            maxAge: 24 * 60 * 60 * 1000, 
            secure: true, 
            sameSite: 'none'
        })
        res.set("Authorization", `Bearer ${access_token}`).json(loggedInUser)
    }else{ 
        res.status(406).json({error: "Invalid Credentials "})
    }
})

userController.get("/profile", verifyRoute, async(req: Request, res: Response) => { 
    const userRepo = new userRepository()
    const userCase = new userUseCase(userRepo)
    const userId = req?.userId ;
    const userProfile = await userCase.getUserDetails(userId!)
    res.status(200).json( userProfile)
})

userController.put("/profile", verifyRoute, storage.single("user_image"), async(req: Request, res: Response) => { 
    const {name, email, description, password}:{name: string, email: string, description: string, password: string} = req.body
    const id = req.params.id as string
    const image = req.file 
    const userId = req?.userId
    
    const userRepo = new userRepository()
    const userCase = new userUseCase(userRepo)

    const updateUser = await userCase.updateUserDetails(userId!, name, email, description, password, image)
    res.json(updateUser)
})

export default userController;
