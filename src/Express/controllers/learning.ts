import { Request, Response, NextFunction } from "express"
import asyncHandler from "../middlewear/asyncHandler"
import ValidationError from "../utils/validationErrorBuilder"
import ApiSucessResponse from "../middlewear/apiResponseBuilder"
export type Learn = {
    name: string, 
    password: string, 
    home_address?: string
}
const Learning = asyncHandler(async (req:Request, res:Response, next: NextFunction) => {
    const {name, password, home_address} = req.body as Learn
    if(!name || !password){ throw new ValidationError("Name and password must be filled", 400)}  
    ApiSucessResponse.sendResponse(res, {name, password, home_address}) 
}) 

export default Learning