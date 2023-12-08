import express, { NextFunction } from "express";
import { loginController, signupController } from "./controller/session";
import { userController } from "./controller/user";
import { memoryController } from "./controller/memory";

const PORT = process.env.port || 8080

const app = express();
app.use(express.json())

app.use('/api/v1/signup', signupController)
app.use('/api/v1/login', loginController)
app.use('/api/v1/user', userController)
app.use('/api/v1/memory', memoryController)

app.listen(PORT, () => console.log(`Server is running at port ${PORT}!`))
