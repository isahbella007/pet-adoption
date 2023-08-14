import express from "express"
import { addPetHandler } from "../handlers/Pets/add"
import verifyRoute from "../middlewear/verifyToken"
import multer from "multer"
import path from "path"

const petRouter = express.Router()
const storage = multer({dest: path.resolve('./public/uploads/pets')})

petRouter.post("/add",  storage.array('images', 5), addPetHandler)

export default petRouter