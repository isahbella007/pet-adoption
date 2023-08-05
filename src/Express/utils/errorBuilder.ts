class ErrorBuilder{ 
    private status_code: number
    private message: string
    constructor(status_code: number, message:string){ 
        this.status_code = status_code
        this.message = message
    }

    build(){ 
        return{ 
            status: "ERROR", 
            status_code: this.status_code, 
            message: this.message
        }
    }
}

export default ErrorBuilder