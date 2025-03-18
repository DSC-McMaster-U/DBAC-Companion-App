import express from 'express'
import dropinRouter from "./routes/dropin.js"
import userRouter from "./routes/user.js"
import machineRouter from "./routes/machine.js"
import facilityRouter from "./routes/facility.js"
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http';

const app = express()
const port = 8383

app.use(cors());
app.use(express.json())
app.use(dropinRouter)
app.use(userRouter)
app.use(machineRouter)
app.use(facilityRouter)
app.use('/assets', express.static('assets'));
app.use(cors());

// Setup websocket
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    })
});

server.listen(port, () => console.log(`Server has started on port: ${port}`))

export { io };