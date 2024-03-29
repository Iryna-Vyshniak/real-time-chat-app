import { Router } from 'express';

import chatCtrl from '../../controllers/chat.controller.js';
import protectRoute from '../../middlewares/protectRoute.js';

const router = Router();

router.post('/group', protectRoute, chatCtrl.createGroupChat);

export default router;
