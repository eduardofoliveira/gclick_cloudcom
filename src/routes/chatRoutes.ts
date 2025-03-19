import { Router } from "express"
import multer from "multer"
const upload = multer({ dest: "uploads/" })

import userController from "../controller/userController"
import ContactController from "../controller/ContactController"
import ConversationController from "../controller/ConversationController"
import MessageController from "../controller/MessageController"
import { validateParamsData } from "../middleware/validationParamsMiddleware"
import validateAccountId from "../middleware/validateAccountId"
import { searchByIDSchema } from "../schemas/userSchemas"
import { validateAccountIdSchema } from "../schemas/accountIDSchema"

const router = Router()

router.get(
  "/user/:id/accounts/:account_id",
  validateAccountId,
  validateParamsData(searchByIDSchema),
  validateParamsData(validateAccountIdSchema),
  userController.show,
)
router.get(
  "/contact/:id/accounts/:account_id",
  validateAccountId,
  validateParamsData(searchByIDSchema),
  validateParamsData(validateAccountIdSchema),
  ContactController.show,
)
router.get(
  "/conversations/accounts/:account_id",
  validateAccountId,
  validateParamsData(validateAccountIdSchema),
  ConversationController.index,
)
router.get(
  "/messages/accounts/:account_id/conversations/:conversation_id",
  validateAccountId,
  validateParamsData(validateAccountIdSchema),
  MessageController.show,
)
router.post(
  "/messages/accounts/:account_id/sendMessage",
  validateAccountId,
  validateParamsData(validateAccountIdSchema),
  MessageController.store,
)
router.post(
  "/messages/accounts/:account_id/sendFile",
  upload.single("file"),
  validateAccountId,
  validateParamsData(validateAccountIdSchema),
  MessageController.storeFile,
)

export default router
