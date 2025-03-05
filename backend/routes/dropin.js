import express from 'express';
import { leaveDropin } from '../controllers/dropin.js';

const router = express.Router();

router.post('/dropins/leave', leaveDropin);

export default router;