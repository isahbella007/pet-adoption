import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
const verifyRoute = (req: Request, res: Response, next: NextFunction) => { 
    const token = req.header('Authorization')
    // Check if the Authorization header exists and has the correct format
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).send("Unauthorized request");
    }
     
    const accessToken = token.split(' ')[1];

    try{ 
        const verify = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {id: string}
        const userId = verify.id

        req.userId = userId
        // console.log(`I contain user id ${req.userId} `)
        
        next()
    }catch(error){ 
        res.status(400).send("Invalid token")
    }
}

export default verifyRoute