import express from "express";
import { getMachineCapacityInfo, getFacilityCapacityInfo } from "../controllers/facility.js";

const router = express.Router()

router.get("/facility/user_capacity", getFacilityCapacityInfo)
router.get("/facility/machine_capacity", getMachineCapacityInfo)

export default router