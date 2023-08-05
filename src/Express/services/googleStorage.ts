import { Storage } from "@google-cloud/storage";
import env from "dotenv"
import loggerConfig from "../utils/logger";

env.config({path: "../../.env"})
const googleStorage = new Storage({
    projectId: process.env.PROJECT_ID_GOOGLE, 
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS
})

// async function trial() {
//     try{ 
//         const [buckets] = await googleStorage.getBuckets();
//         for (const bucket of buckets) {
//             loggerConfig.info(bucket.name)
//         }
//     }catch(error){ 
//         loggerConfig.error("Could not run trial function ", error)
//     }
    
// }
// trial()
export default googleStorage