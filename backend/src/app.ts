import express, { Express, json } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routers/AuthRouter"
import errorMiddleware from "./middlewares/errorMiddleware"
import userRouter from "./routers/UserRouter"
import PostsRouter from "./routers/PostsRouter"
import authMiddlware from "./middlewares/AuthMiddlware"
import usersListRouter from "./routers/usersListRouter"
const app: Express = express()
app.use(json())
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:1727",
  }),
)
app.use(cookieParser())
app.use("/auth", authRouter)
app.use(authMiddlware)
app.use("/userPage", userRouter)
app.use("/usersList", usersListRouter)
app.use("/posts", PostsRouter)
app.use(errorMiddleware)
export default app
