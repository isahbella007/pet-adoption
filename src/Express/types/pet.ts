import { z} from "zod"

function stringToNumber(value: string){ 
    if(typeof value === "string"){ 
        const numericalValue = Number(value)

        if(!Number.isNaN(value)){ 
            return Number(value)
        }
        return numericalValue
    }
}

export function stringToBoolean(value: string): boolean{ 
    if(typeof value === "string"){ 
        return value.toLocaleLowerCase() != "no"
    }
    return false
}
const PetsSchema = z.object({ 
    name: z.string().min(2), 
    breed: z.string().min(3),
    description: z.string().min(10),  
    size: z.string().transform(stringToNumber).refine((value) => typeof value === "number", {
        message: "Size must be a number",
      }), 
    gender: z.enum(["Male", "Female"]), 
    coat_length: z.union([
        z.literal("Short"), 
        z.literal("Medium"), 
        z.literal("Long"), 
        z.literal("Extra Long"), 
        z.literal("None")
    ]), 
    urgent_adoption: z.string(),
    fee: z.string().transform(stringToNumber).refine((value) => typeof value === "number", { 
        message: "Fee must be a number"
    }).optional(), 
    pet_type: z.string(), 
    good_with:z.union([
        z.literal("dogs"),
        z.literal("cats"),
        z.literal("children"),
        z.literal("family"),
        z.array(z.union([
            z.literal("dogs"),
            z.literal("cats"),
            z.literal("children"),
            z.literal("family"),
        ]))
      ]),
    behaviour: z.union([
        z.literal("Home trained"), 
        z.literal("Special needs"), 
        z.array(z.union([
            z.literal("Home trained"), 
            z.literal("Special needs"), 
        ]))
    ]),
    state: z.string(),
    LGA: z.string(), 
    city: z.string()
})

export type PetType = z.infer<typeof PetsSchema>
export default PetsSchema