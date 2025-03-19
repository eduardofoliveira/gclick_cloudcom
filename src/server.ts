import "dotenv/config"
import { resolve } from "node:path"
import "express-async-errors"
import express from "express"
import morgan from "morgan"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"

import chatRoutes from "./routes/chatRoutes"
import tokenRoutes from "./routes/tokenRoutes"
import { authMiddleware } from "./middleware/authMiddleware"
import responseError from "./middleware/response-error"

const app = express()
const port = process.env.PORT || 3000
const swaggerDocument = YAML.load(resolve("gclick.yaml"))

app.use(cors())
app.use(morgan("dev"))
app.use(express.json({ limit: "200mb" }))
app.use(express.urlencoded({ extended: true, limit: "200mb" }))
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(authMiddleware)
app.use(tokenRoutes)
app.use(chatRoutes)
app.use(responseError)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
