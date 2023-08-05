import { Request, Response, NextFunction } from "express";
const errorMiddleware = (error: any,req: Request,res: Response,next: NextFunction) => {
  const customError : boolean = error.constructor.name === "NodeError" || error.constructor.name === "SyntaxError" ? false : true

 
  const message = error.message || "INTERNAL SERVER ERROR"
  const status_code = error.status_code || 500
  res.status(status_code).json({ 
    response: "Error", 
    error: { 
      type: customError === false ? "Unhandled Error" : error.constructor.name,
      path: req.path, 
      statusCode: status_code, 
      message: message
    }
  })
  
};

export default errorMiddleware;
