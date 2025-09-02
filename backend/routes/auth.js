import express from 'express';

import { protectRoute } from '../middleware/protectRoute.js';
import { authCheck, login, logout, signup } from '../controllers/auth.js';

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get('/', protectRoute, authCheck);

export default router;