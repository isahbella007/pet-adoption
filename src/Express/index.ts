import app from "./app";
import env from "dotenv"
import loggerConfig from "./utils/logger";

env.config({path: ".env"})
const port = process.env.PORT
const server = app.listen(port, () => { 
    console.log(`server is listening on port ${port}`)
})

function exitHandler () { 
    if(server){ 
        server.close(() => { 
            console.log(".....Shutting down.. :(")
            process.exit(0)
        })
    }else{ 
        process.exit(0)
    }
}
process.on("SIGTERM", exitHandler)
process.on("SIGINT", exitHandler)
process.on("uncaughtException", exitHandler)
process.on("uncaughtException", exitHandler)