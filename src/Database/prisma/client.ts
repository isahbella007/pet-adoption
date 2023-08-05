import { Prisma, PrismaClient } from "@prisma/client"
import DatabaseErrorBuilder from "../../Express/utils/databaseErrorBuilder"

const prisma = new PrismaClient()

async() => {
    try{ 
        await prisma.$connect()
        console.log("..Database Connected")
    }catch(error:any){
        throw new DatabaseErrorBuilder(error).build()
    }
    
}

export default prisma