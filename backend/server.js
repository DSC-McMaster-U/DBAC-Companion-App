import express from 'express'
import userRouter from "./routes/user.js"

const app = express()
const port = 8383
app.use(express.json())
app.use(userRouter)

app.listen(port, () => console.log(`Server has started on port: ${port}`))