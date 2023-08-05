import { Prisma, PrismaClient } from "@prisma/client";
class DatabaseErrorBuilder{
  private db: PrismaClient
  
  constructor(db: PrismaClient) {
    this.db = db
  }

  build() {
    if (this.db instanceof Prisma.PrismaClientInitializationError) {
      return {
        // status: "DB Connection Error",
        status: "DB Initialization Error", 
        message: " DB Authentication Failed",
        // stack: this.db.stack
      };
    }

    if(this.db instanceof Prisma.PrismaClientKnownRequestError){ 
        if(this.db.code === "P2002"){
            return { 
              status: "Unique constraint error",
              message: "Unique constraint failed ",
              // stack: this.db.stack
            }
        }

        if(this.db.code === "P2001"){ 
            return{
              status: "Record not found",
              message: "The record searched for in where condition does not exist",
              stack: this.db.stack,
            }
        }
    }

    return {
      status: "Unknown Error",
      message: "An unexpected error occurred",
    };
  }


}

export default DatabaseErrorBuilder;
