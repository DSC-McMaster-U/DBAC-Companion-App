import express from 'express'
import userRouter from "./routes/user.js"
import machineRouter from "./routes/machine.js"
import facilityRouter from "./routes/facility.js"

const app = express()
const port = 8383
app.use(express.json())
app.use(userRouter)
app.use(machineRouter)
app.use(facilityRouter)

app.listen(port, () => console.log(`Server has started on port: ${port}`))