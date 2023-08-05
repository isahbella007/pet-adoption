import express from "express"
import env from "dotenv"
import cookieParser from "cookie-parser";
import winston from "winston/lib/winston/config";
import loggerConfig from "./utils/logger";
import router from "./routes";
import ErrorBuilder from "./utils/errorBuilder";
import errorMiddleware from "./middlewear/error";
env.config({path: ".././.env"})

const logger = loggerConfig
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use("/api/",router)

app.use(errorMiddleware)



// 404
app.use((req, res) => { 
    const error = new ErrorBuilder(404, "Invalid Route").build()
    res.status(error.status_code).send(error)
})




export default app 