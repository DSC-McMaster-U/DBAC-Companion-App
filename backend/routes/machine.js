// In backend/routes/machine.js
import express from "express";
import {
    editMachineUsageParams,
    getMachineInfo,
    getMachines,
    leaveMachine,
    useMachine
} from "../controllers/machine.js";

const router = express.Router()

// Existing routes
router.get("/machines", getMachines)
router.post("/machines/machine", getMachineInfo)
router.post("/machines/use", useMachine);
router.post("/machines/leave", leaveMachine);
router.post("/machines/edit", editMachineUsageParams);

export default router