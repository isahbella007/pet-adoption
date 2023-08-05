import {Response} from "express"
class ApiSucessResponse { 
    static sendResponse(res: Response, data: any){ 
        const responseObj = { 
            response: "Successful", 
            data: {...data}
        }

        return res.status(200).json(responseObj)
    }
}
export default ApiSucessResponse