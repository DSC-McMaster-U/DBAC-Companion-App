// In backend/routes/machine.js
import express from "express";
import {
    getMachineInfo,
    getMachines,
    useMachine
} from "../controllers/machine.js";

const router = express.Router()

// Existing routes
router.get("/machines", getMachines)
router.post("/machines/machine", getMachineInfo)
router.post("/machines/use", useMachine);

export default router