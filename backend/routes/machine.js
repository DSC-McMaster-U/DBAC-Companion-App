// In backend/routes/machine.js
import express from "express";
import {
    getMachineInfo,
    getMachines,
    updateMachineUser,
    updateSetsLeft,
    updateQueue,
    updateWorkIn,
    useMachine
} from "../controllers/machine.js";

const router = express.Router()

// Existing routes
router.get("/machines", getMachines)
router.post("/machines/machine", getMachineInfo)
router.post("/machines/use", useMachine);
router.patch("/machines/users", updateMachineUser)
router.patch("/machines/setsleft", updateSetsLeft)
router.patch("/machines/queue", updateQueue)
router.patch("/machines/workin", updateWorkIn)

export default router