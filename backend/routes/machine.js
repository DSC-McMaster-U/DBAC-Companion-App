import express from "express";
import { getMachineInfo, getMachines, updateMachineUser, updateSetsLeft } from "../controllers/machine.js";

const router = express.Router()

router.get("/machines", getMachines)
router.get("/machines/:machineid", getMachineInfo)
router.patch("/machines/users", updateMachineUser)
router.patch("/machines/setsleft", updateSetsLeft)

export default router