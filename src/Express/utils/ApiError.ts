class ApiError extends Error {
    status_code: number 
    message: string
    constructor(message: string, status_code: number){
        super()
        this.message = message
        this.status_code = status_code || 500
    }
    
}

export default ApiError