import express from "express"
import env from "dotenv"
import router from "./routes"
import cookieParser from "cookie-parser";

const app = express()

env.config({path: ".././.env"})
app.use(express.json())
app.use(cookieParser())

const PORT =  3000
app.listen(PORT, () => {console.log(`running on port ${PORT}`)})
app.use("/api/", router)