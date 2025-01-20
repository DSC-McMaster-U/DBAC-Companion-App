import express from 'express'
import userRouter from "./routes/user.js"
import machineRouter from "./routes/machine.js"
import facilityRouter from "./routes/facility.js"
import cors from 'cors'

const app = express()
const port = 8383
app.use(cors());
app.use(express.json())
app.use(userRouter)
app.use(machineRouter)
app.use(facilityRouter)
app.use('/assets', express.static('assets'));
app.use(cors());
app.listen(port, () => console.log(`Server has started on port: ${port}`))