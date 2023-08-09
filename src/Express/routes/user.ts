import express from "express"
import multer from "multer"
import verifyRoute from "../middlewear/verifyToken"
import path from "path"
import {createUserAccount} from "../handlers/Users/createUser"
import { handleUserLogin } from "../handlers/Users/userLogin"
import { handlegetUserProfile } from "../handlers/Users/profile"
import { handleUserUpdate } from "../handlers/Users/update"
import { handleLogout } from "../handlers/Users/userLogout"
import { handleProfilePicture } from "../handlers/Users/profilePicture"

const userRouter = express.Router()
const storage = multer({dest: path.resolve('./public/uploads/user') })

userRouter.post("/create", storage.single("user_image"), createUserAccount)
userRouter.post("/login", handleUserLogin)
userRouter.get("/profile", verifyRoute, handlegetUserProfile)
userRouter.put("/profile/", verifyRoute, storage.single("user_image"), handleUserUpdate)
userRouter.get("/profile-picture", verifyRoute, handleProfilePicture)
userRouter.post("/logout", verifyRoute, handleLogout)

export default userRouter