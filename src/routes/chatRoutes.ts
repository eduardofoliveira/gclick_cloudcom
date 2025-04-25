import { Router } from "express"
import multer from "multer"
const upload = multer({ dest: "uploads/" })

import inboxController from "../controller/inboxController"
import userController from "../controller/userController"
import ContactController from "../controller/ContactController"
import ConversationController from "../controller/ConversationController"
import MessageController from "../controller/MessageController"
import { validateParamsData } from "../middleware/validationParamsMiddleware"
import { validateBodyData } from "../middleware/validationBodyMiddleware"
// import validateAccountId from "../middleware/validateAccountId"
import { searchByIDSchema } from "../schemas/userSchemas"
// import { validateAccountIdSchema } from "../schemas/accountIDSchema"
import { validateInboxIdSchema } from "../schemas/inboxIdSchema"

const router = Router()

router.get(
  "/user/:id",
  // validateAccountId,
  validateParamsData(searchByIDSchema),
  // validateParamsData(validateAccountIdSchema),
  userController.show,
)
router.get(
  "/contact/:id",
  // validateAccountId,
  validateParamsData(searchByIDSchema),
  // validateParamsData(validateAccountIdSchema),
  ContactController.show,
)
router.get(
  "/conversations",
  // validateAccountId,
  // validateParamsData(validateAccountIdSchema),
  ConversationController.index,
)
router.get(
  "/conversations/contact/:contact_id",
  MessageController.showByContact,
)
router.get(
  "/messages/conversations/:conversation_id",
  // validateAccountId,
  // validateParamsData(validateAccountIdSchema),
  MessageController.show,
)
router.post(
  "/messages/sendMessage",
  validateBodyData(validateInboxIdSchema),
  // validateAccountId,
  // validateParamsData(validateAccountIdSchema),
  MessageController.store,
)
router.post(
  "/messages/sendFile",
  upload.single("file"),
  validateBodyData(validateInboxIdSchema),
  // validateAccountId,
  // validateParamsData(validateAccountIdSchema),
  MessageController.storeFile,
)
router.get("/inbox", inboxController.show)

export default router
