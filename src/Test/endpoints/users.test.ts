import req from "supertest"
import app from "../../Express/app"

describe("Users Endpoint", () => { 
    it('should return error for missing parameters', async() => { 
        const incompletUser = {
            name: "Bella", 
            email: "bella@gmail.com"
        }
        const response = await req(app).post("/api/user/create").send(incompletUser).expect(400)
        expect(response.body.response).toEqual('Error')
        expect(response.body.error).toHaveProperty('message', 'Fill all required fields')
    })

    // it('should create a new user', async() => { 
    //     const newUser = { 
    //         name: "Bella", 
    //         email: "Bella@gmail.com", 
    //         description: "A lovely girl", 
    //         password: "hello", 
    //         state: "Cross Rivers", 
    //         LGA: "Somewhere", 
    //         city: "IDK", 
    //         home_address: ""
    //     }
    //     const response = await req(app).post("/api/user/create").send(newUser).expect(200)

    // })
})