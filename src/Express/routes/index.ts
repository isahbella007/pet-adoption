import express from "express"

import refreshToken from "../controllers/auth/refreshToken"
import user from "./user"
import Learning from "../controllers/learning"

const router = express.Router()

router.post("/welcome", Learning)
router.use("/user/", user)
router.use("/refresh-token/", refreshToken)

export default router