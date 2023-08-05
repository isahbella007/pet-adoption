import express from "express"
import multer from "multer"
import {createUserAccount} from "../controllers/Users/createUser"
import path from "path"

const userRouter = express.Router()
const storage = multer({dest: path.resolve('./public/uploads/user') })

userRouter.post("/create", storage.single("user_image"), createUserAccount)

export default userRouter