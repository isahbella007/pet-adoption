import request from "supertest"
import app from "../../Express/app"

describe('Server Testing', () => { 
    it('should return error for invalid route', async () => { 
        const response = await request(app).get("/api/fake-url")
        expect(response.status).toBe(404)
    })
})