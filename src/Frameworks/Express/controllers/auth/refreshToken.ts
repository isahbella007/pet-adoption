import express, {Response, Request} from "express"
import env from "dotenv"
import jwt from "jsonwebtoken"
const refreshToken = express.Router()

refreshToken.post("/", (req: Request, res: Response) => { 
    if(req.cookies?.jwt){ 
        const refreshToken = req.cookies.jwt
        // verify token 
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any, decoded: any ) => { 
            if(err){ 
                return res.status(406).send("Unauthorized");
            }

            const userId = decoded.id
            // console.log("User ID from Refresh Token:", userId);

            const newAccessToken = jwt.sign(
                { id: userId }, 
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: "1m" }
              );
        
              return res.json({ accessToken: newAccessToken });
        })     
    }else{ 
        return res.status(401).send("Refresh token not found");
    }
})

export default refreshToken