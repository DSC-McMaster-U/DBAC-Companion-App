import express from 'express';
import { joinDropin, leaveDropin } from '../controllers/dropin.js';

const router = express.Router();

router.post('/dropins/join', joinDropin);
router.post('/dropins/leave', leaveDropin);

export default router;