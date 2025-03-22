import express from 'express';
import { getDropins, joinDropin, leaveDropin } from '../controllers/dropin.js';

const router = express.Router();

router.get('/dropins/get', getDropins);
router.post('/dropins/join', joinDropin);
router.post('/dropins/leave', leaveDropin);

export default router;