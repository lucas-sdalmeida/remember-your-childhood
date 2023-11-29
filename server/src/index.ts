import express from "express";

const PORT = process.env.port || 8080

const app = express();
app.listen(PORT, () => console.log(`Server is running at port ${PORT}!`))
