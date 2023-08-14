import express from "express"

import refreshToken from "../handlers/auth/refreshToken"
import user from "./user"
import Learning from "../handlers/learning"
import petRouter from "./pet"

const router = express.Router()

router.post("/welcome", Learning)
router.use("/user/", user)
router.use("/pet/", petRouter)
router.use("/refresh-token/", refreshToken)

export default router