import {z} from "zod"
const userSchema = z.object({ 
    name: z.string(), 
    email: z.string().email().endsWith(".com"), 
    description: z.string().min(10), 
    password: z.string().min(6), 
    state: z.string(), 
    LGA: z.string(), 
    city: z.string(), 
    home_address: z.string().optional(),
})
export type userRequest = z.infer<typeof userSchema>
export default userSchema