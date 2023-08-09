import UserRepository from "../../Express/Repository/UserRepository"
import { prismaMock } from "../../prisma/singleton";


describe("User Repository", () => { 
    let userRepository: UserRepository;

    beforeAll(() => {
        userRepository = new UserRepository(prismaMock);
    });

    it("should add a new user to the database without image", async () => { 
    const userData = {
        id: "22-55-87",
        name: 'Test User',
        email: 'test@example.com',
        description: "A test user",
        password: 'A test user',
        state: "Test state", 
        LGA: "Test LGA", 
        city: "Test City", 
        home_address: "Test home address"
    };
    
    const something = jest.spyOn(prismaMock.user, 'create')
    something.mockResolvedValue({id: "22-55-87", name: "Test User", email: "test@example.com", description: "A test user", password: "A test user", image_public_id: "MockTest-23234-234345"})

    const result = await userRepository.addUser(userData, undefined)
    expect(result).toEqual({ id: "22-55-87",
        name: 'Test User',
        email: 'test@example.com',
        description: "A test user",
        password: 'A test user',
        image_public_id: "MockTest-23234-234345"
    });
    
    })

    
})