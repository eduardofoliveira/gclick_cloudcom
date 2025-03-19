import { Router } from "express"

import tokenController from "../controller/tokenController"

const router = Router()

router.get("/token", tokenController.index)
router.get("/token/:id", tokenController.show)
router.post("/token", tokenController.store)
router.delete("/token/:id", tokenController.destroy)

export default router
