import express from 'express';
import { getMachineCapacityInfo, getFacilityCapacityInfo } from '../controllers/facility.js';

const router = express.Router();

// Support both GET and POST methods for backwards compatibility
router.get('/facility/user_capacity', getFacilityCapacityInfo);
router.post('/facility/user_capacity', getFacilityCapacityInfo);

router.get('/facility/machine_capacity', getMachineCapacityInfo);
router.post('/facility/machine_capacity', getMachineCapacityInfo);

export default router;