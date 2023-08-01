import express from "express"
import user from "../controllers/Users/User"
import refreshToken from "../controllers/auth/refreshToken"

const router = express.Router()

router.use("/user/", user)
router.use("/refresh-token/", refreshToken)

export default router