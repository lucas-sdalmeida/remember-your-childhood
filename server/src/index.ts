import express, { NextFunction } from "express";
import { loginController, signupController } from "./controller/session";

const PORT = process.env.port || 8080

const app = express();
app.use(express.json())

app.use('/api/v1/signup', signupController)
app.use('/api/v1/login', loginController)

app.listen(PORT, () => console.log(`Server is running at port ${PORT}!`))
